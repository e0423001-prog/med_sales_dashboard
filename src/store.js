import { products } from './catalog.js';

export const money = value => new Intl.NumberFormat('en-IN', {style:'currency',currency:'INR',maximumFractionDigits:0}).format(value);
const productById = new Map(products.map(product => [product.id, product]));
export const getProduct = id => productById.get(id);

export function readStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

export function writeStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}

export function createStore() {
  const savedCart = readStorage('medora.cart.v1', []);
  const cart = Array.isArray(savedCart) ? savedCart.filter(item => item && getProduct(item.id)?.stock > 0 && Number.isInteger(item.quantity) && item.quantity > 0).reduce((items,item)=>{
    const existing=items.find(entry=>entry.id===item.id);
    if(existing) existing.quantity=Math.min(existing.quantity+item.quantity,getProduct(item.id).stock);
    else items.push({id:item.id,quantity:Math.min(item.quantity,getProduct(item.id).stock)});
    return items;
  },[]) : [];
  const savedWishlist = readStorage('medora.wishlist.v1', []);
  const wishlist = new Set(Array.isArray(savedWishlist) ? savedWishlist.filter(id=>getProduct(id)) : []);
  const listeners = new Set();
  const save = () => {
    const cartSaved=writeStorage('medora.cart.v1', cart);
    const wishlistSaved=writeStorage('medora.wishlist.v1', [...wishlist]);
    listeners.forEach(listener=>listener({persisted:cartSaved&&wishlistSaved}));
  };
  return {
    cart, wishlist,
    subscribe: listener => { listeners.add(listener); return ()=>listeners.delete(listener); },
    get count() { return cart.reduce((sum,item)=>sum+item.quantity,0); },
    get subtotal() { return cart.reduce((sum,item)=>sum+getProduct(item.id).price*item.quantity,0); },
    get shipping() { return this.subtotal === 0 || this.subtotal >= 5000 ? 0 : 199; },
    get total() { return this.subtotal + this.shipping; },
    add(id, quantity=1) {
      const product=getProduct(id);
      if(!product || !product.stock || !Number.isInteger(quantity) || quantity<1) return false;
      const existing=cart.find(item=>item.id===id);
      if((existing?.quantity??0)+quantity > product.stock) return false;
      if(existing) existing.quantity+=quantity;
      else cart.push({id,quantity});
      save(); return true;
    },
    change(id, delta) {
      const item=cart.find(item=>item.id===id);
      if(!item || !Number.isInteger(delta)) return false;
      const quantity=item.quantity+delta;
      if(quantity<1 || quantity>getProduct(id).stock) return false;
      item.quantity=quantity; save(); return true;
    },
    remove(id) { const index=cart.findIndex(item=>item.id===id); if(index>=0) {cart.splice(index,1);save();} },
    toggleWishlist(id) { if(!getProduct(id)) return; wishlist.has(id)?wishlist.delete(id):wishlist.add(id);save(); },
    clear() {cart.splice(0,cart.length);save();},
  };
}

export function filterProducts({search='',category='all',maxPrice='all',sort='popular'}={}) {
  const query=search.trim().toLowerCase();
  return products.filter(product =>
    (category==='all'||product.category===category||product.tags?.includes(category)) &&
    (maxPrice==='all'||product.price<=Number(maxPrice)) &&
    (!query||`${product.name} ${product.brand} ${categoriesForSearch(product)} ${product.description}`.toLowerCase().includes(query))
  ).sort((a,b)=>sort==='price-asc'?a.price-b.price:sort==='price-desc'?b.price-a.price:sort==='rating'?b.rating-a.rating||b.reviews-a.reviews:b.popularity-a.popularity);
}

function categoriesForSearch(product){return `${product.category} ${(product.tags||[]).join(' ')}`;}
