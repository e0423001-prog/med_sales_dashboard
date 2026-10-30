import './styles.css';
import { createIcons, Search, Heart, ShoppingBag, Menu, ChevronDown, Plus, Minus, ArrowRight, ArrowLeft, ArrowUpRight, ArrowDown, ShieldCheck, BadgeCheck, Truck, Headset, Activity, Monitor, BatteryCharging, Pause, Play, ZoomIn, ZoomOut, RotateCcw, SlidersHorizontal, X, Eye, LockKeyhole, ClipboardCheck, Linkedin, Instagram, Mail, MapPin, CheckCircle2, PackageOpen, HeartOff, Trash2 } from 'lucide';
import {categories,products,benefits,reviews} from './catalog.js';
import {createStore,filterProducts,getProduct,money,writeStorage} from './store.js';

const icons={Search,Heart,ShoppingBag,Menu,ChevronDown,Plus,Minus,ArrowRight,ArrowLeft,ArrowUpRight,ArrowDown,ShieldCheck,BadgeCheck,Truck,Headset,Activity,Monitor,BatteryCharging,Pause,Play,ZoomIn,ZoomOut,RotateCcw,SlidersHorizontal,X,Eye,LockKeyhole,ClipboardCheck,Linkedin,Instagram,Mail,MapPin,CheckCircle2,PackageOpen,HeartOff,Trash2};
const refreshIcons=()=>createIcons({icons,attrs:{'aria-hidden':'true'}});
const $=selector=>document.querySelector(selector);
const icon=name=>`<i data-lucide="${name}"></i>`;
const escapeHTML=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const store=createStore();
const filters={search:'',category:'all',maxPrice:'all',sort:'popular'};
let expanded=false, quickQuantity=1, quickId=null, reviewIndex=0, toastTimer, carouselTimer;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');

function toast(message){clearTimeout(toastTimer);$('#toast span').textContent=message;$('#toast').classList.add('show');toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3200);}
function openDialog(id){document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());$(id).showModal();}
function closeDialogs(){document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());}
function browse(){closeDialogs();$('#products').scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth'});}

$('#category-grid').innerHTML=categories.map(category=>`<button class="category-card" data-category="${category.id}" aria-label="Shop ${category.name}"><div><h3>${category.name}</h3><p>${category.short}</p>${icon('arrow-right')}</div><img src="/assets/${category.image}" alt="" loading="lazy" width="105" height="95" /></button>`).join('');
$('#category-filter').insertAdjacentHTML('beforeend',categories.map(category=>`<option value="${category.id}">${category.name}</option>`).join(''));
$('#benefit-grid').innerHTML=benefits.map(([name,title,description])=>`<article class="benefit reveal"><span class="benefit-icon">${icon(name)}</span><div><h3>${title}</h3><p>${description}</p></div></article>`).join('');

function stars(product){return `<span class="stars" aria-label="Rated ${product.rating} out of 5">★★★★★</span><strong>${product.rating.toFixed(1)}</strong><span>(${product.reviews})</span>`;}
function productCard(product,index){
  const saved=store.wishlist.has(product.id);
  return `<article class="product-card" style="animation-delay:${Math.min(index,7)*40}ms" data-product="${product.id}"><div class="product-image-area"><span class="discount-badge">${Math.round((1-product.price/product.original)*100)}% OFF</span><button class="icon-button product-wishlist ${saved?'saved':''}" data-action="save" data-id="${product.id}" aria-label="${saved?'Remove':'Save'} ${product.name} ${saved?'from':'to'} wishlist" aria-pressed="${saved}">${icon('heart')}</button><button class="product-image-link" data-action="quick" data-id="${product.id}" aria-label="View ${product.name}"><img ${product.id==='monitor'?'class="monitor-image"':''} src="/assets/${product.image}" alt="${product.name} — illustrative product photograph" loading="lazy" width="280" height="225" /></button><button class="quick-view" data-action="quick" data-id="${product.id}">${icon('eye')} Quick view</button></div><div class="product-info"><div class="product-brand">${product.brand}</div><button class="product-name" data-action="quick" data-id="${product.id}">${product.name}</button><div class="product-rating">${stars(product)}</div><div class="product-price-row"><span class="product-price">${money(product.price)} <del>${money(product.original)}</del></span><span class="stock-status ${product.stock?'':'out-of-stock'}">${product.stock?'In stock':'Unavailable'}</span></div><button class="add-cart" data-action="add" data-id="${product.id}" ${product.stock?'':'disabled'}>${icon('plus')} ${product.stock?'Add to Cart':'Out of stock'}</button></div></article>`;
}

function renderProducts(){
  const filtered=filterProducts(filters);
  const visible=expanded||hasFilters()?filtered:filtered.slice(0,8);
  $('#product-grid').innerHTML=visible.length?visible.map(productCard).join(''):`<div class="no-results">${icon('search')}<h3>No equipment found</h3><p>Try a different search or adjust your filters.</p><button class="btn btn-outline" data-action="reset-filters">Reset filters ${icon('arrow-right')}</button></div>`;
  $('#product-count').textContent=`Showing ${visible.length} of ${filtered.length} products`;
  $('#clear-filters').hidden=!hasFilters();
  $('#view-all').hidden=hasFilters()||filtered.length<=8;
  $('#view-all').innerHTML=`${expanded?'Show less':'View all '+products.length+' products'} ${icon(expanded?'arrow-up-right':'arrow-right')}`;
  document.querySelectorAll('.catalog-tab').forEach(button=>{button.classList.toggle('selected',button.dataset.category===filters.category);button.setAttribute('aria-pressed',String(button.dataset.category===filters.category));});
  refreshIcons();
}
function hasFilters(){return filters.search.trim()||filters.category!=='all'||filters.maxPrice!=='all';}
function resetFilters(){Object.assign(filters,{search:'',category:'all',maxPrice:'all',sort:'popular'});$('#product-search').value='';$('#category-filter').value='all';$('#price-filter').value='all';$('#sort-filter').value='popular';expanded=false;renderProducts();}
function setCategory(category){filters.category=category;$('#category-filter').value=category;renderProducts();}

function quantityControl(id,quantity,max,context='cart'){return `<div class="quantity-control" aria-label="Quantity for ${getProduct(id).name}"><button data-action="${context}-minus" data-id="${id}" aria-label="Decrease quantity" ${quantity<=1?'disabled':''}>${icon('minus')}</button><span ${context==='quick'?'id="quick-quantity"':''}>${quantity}</span><button data-action="${context}-plus" data-id="${id}" aria-label="Increase quantity" ${quantity>=max?'disabled':''}>${icon('plus')}</button></div>`;}
function emptyState(type){return `<div class="empty-state">${icon(type==='cart'?'shopping-bag':'heart')}<h3>${type==='cart'?'A little room for better care.':'Your next essential, saved.'}</h3><p>${type==='cart'?'Your equipment bag is empty.<br />Discover something thoughtfully selected.':'Tap the heart on a product to build<br />your personal equipment shortlist.'}</p><button class="btn btn-primary" data-action="browse">Explore equipment ${icon('arrow-right')}</button></div>`;}

function renderCart(){
  $('#cart-count').textContent=store.count;
  $('.cart-button').setAttribute('aria-label',`Open shopping cart, ${store.count} items`);
  $('#cart-title-count').textContent=`(${store.count})`;
  $('#cart-items').innerHTML=store.cart.length?store.cart.map(item=>{const p=getProduct(item.id);return `<article class="cart-item"><img src="/assets/${p.image}" alt="${p.name}" /><div><h3>${p.name}</h3><div class="cart-brand">${p.brand}</div><div class="cart-item-bottom">${quantityControl(p.id,item.quantity,p.stock)}<span class="cart-item-price">${money(p.price*item.quantity)}</span></div></div><button class="icon-button remove-item" data-action="remove" data-id="p-${p.id}" aria-label="Remove ${p.name}">${icon('x')}</button></article>`;}).join(''):emptyState('cart');
  $('#cart-summary').hidden=!store.cart.length;
  $('#cart-summary').innerHTML=store.cart.length?`<div class="shipping-note">${icon('truck')} ${store.shipping?`You are ${money(5000-store.subtotal)} away from free delivery.`:'Complimentary delivery included.'}</div><div class="summary-line"><span>Subtotal</span><span>${money(store.subtotal)}</span></div><div class="summary-line"><span>Delivery</span><span>${store.shipping?money(store.shipping):'Complimentary'}</span></div><div class="summary-line"><span>Taxes</span><span>Included in prices</span></div><div class="summary-line total"><span>Total</span><span>${money(store.total)}</span></div><button class="btn btn-primary" data-action="checkout">Continue to demo checkout ${icon('arrow-right')}</button><p class="summary-note">Demo store · No real payment or order will be placed.</p>`:'';
  refreshIcons();
}
function renderWishlist(){
  $('#wishlist-count').textContent=store.wishlist.size;
  $('#wishlist-count').hidden=!store.wishlist.size;
  $('#wishlist-items').innerHTML=store.wishlist.size?[...store.wishlist].map(id=>{const p=getProduct(id);return `<article class="cart-item"><img src="/assets/${p.image}" alt="${p.name}" /><div><h3>${p.name}</h3><div class="cart-brand">${p.brand}</div><div class="cart-item-price">${money(p.price)}</div><button class="wishlist-add" data-action="add" data-id="${id}" ${p.stock?'':'disabled'}>${p.stock?'+ Add to bag':'Currently unavailable'}</button></div><button class="icon-button remove-item" data-action="save" data-id="${id}" aria-label="Remove ${p.name} from wishlist">${icon('x')}</button></article>`;}).join(''):emptyState('wishlist');
  document.querySelectorAll('.product-wishlist').forEach(button=>{const saved=store.wishlist.has(button.dataset.id);button.classList.toggle('saved',saved);button.setAttribute('aria-pressed',String(saved));button.setAttribute('aria-label',`${saved?'Remove':'Save'} ${getProduct(button.dataset.id).name} ${saved?'from':'to'} wishlist`);});
  refreshIcons();
}

function openQuick(id){
  const p=getProduct(id);if(!p)return;
  quickQuantity=1;quickId=id;
  $('#quick-content').innerHTML=`<div class="quick-layout"><div class="quick-image"><img src="/assets/${p.image}" alt="${p.name} illustrative photograph" /></div><div class="quick-info"><div class="eyebrow">${p.brand}</div><h2>${p.name}</h2><div class="product-rating">${stars(p)}</div><p>${p.description}</p><div class="product-price">${money(p.price)} <del>${money(p.original)}</del></div><span class="stock-status ${p.stock?'':'out-of-stock'}">${p.stock?`${p.stock} available in this demo`:'Currently unavailable'}</span><ul class="quick-specs">${p.specs.map(spec=>`<li>${spec}</li>`).join('')}</ul><div class="quick-actions">${quantityControl(id,quickQuantity,p.stock,'quick')}<button class="btn btn-primary" data-action="quick-add" data-id="${id}" ${p.stock?'':'disabled'}>Add to bag ${icon('shopping-bag')}</button></div><div class="quick-demo">Illustrative product, specifications, ratings and price.</div></div></div>`;
  openDialog('#quick-dialog');refreshIcons();
}
function updateQuickQuantity(delta){const p=getProduct(quickId);quickQuantity=Math.max(1,Math.min(p.stock,quickQuantity+delta));const control=$('#quick-content .quantity-control');control.outerHTML=quantityControl(p.id,quickQuantity,p.stock,'quick');refreshIcons();}

function addToCart(id,quantity=1){
  if(store.add(id,quantity)){toast(`${quantity>1?quantity+' × ':''}${getProduct(id).name} added to your bag`);return true;}
  toast(`Only ${getProduct(id)?.stock??0} available. Check the quantity in your bag.`);return false;
}

const policies={
  privacy:['Privacy policy','<p>This demonstration storefront stores your cart, wishlist, newsletter preference, and demo order reference in localStorage on your device. It has no customer database and does not send form submissions to a server.</p><p>Contact and checkout personal details remain in the current page session and are not saved. The site loads fonts from Google Fonts. Product images are bundled locally.</p><p>To remove saved data, clear this site’s browser storage. A production store would need its own complete privacy policy.</p>'],
  terms:['Terms & conditions','<p>Medora is a fictional demonstration brand. All products, prices, discounts, stock, specifications, ratings, testimonials and service promises are sample content. Images illustrate equipment types and do not imply affiliation with a manufacturer.</p><p>No items can be purchased from this demo. Completing checkout generates a local demo order reference, without payment or fulfillment.</p><p>Equipment descriptions are illustrative and should not be used to choose or operate a medical device.</p>'],
  shipping:['Shipping & delivery','<p>The demo cart applies complimentary delivery for orders of ₹5,000 and above, and a ₹199 delivery fee below that amount. All displayed product prices include illustrative taxes.</p><p>No actual deliveries take place. Delivery dates, service areas, installation, and freight requirements would be confirmed by a real supplier before purchase.</p>'],
  returns:['Returns & warranty','<p>This is a demonstration of an equipment shopping experience. No actual return, warranty, certification, or service agreement is provided.</p><p>A production store would show manufacturer-specific warranty details, return eligibility, installation support, and a clearly defined service process for each product.</p><p>Use “Contact our team” to try the local demo inquiry form.</p>'],
  faq:['Frequently asked questions','<h3>Can I place an order?</h3><p>You can try the complete shopping flow. Checkout creates a demo reference only, with no real payment or order.</p><h3>Will my shopping bag be saved?</h3><p>Yes. Your bag and wishlist are saved in this browser when local storage is available.</p><h3>Are these actual product specifications?</h3><p>No. Product identities, specifications, pricing and ratings are illustrative demo content.</p><h3>How is delivery calculated?</h3><p>The demo delivery fee is ₹199, with complimentary delivery on orders of ₹5,000 or more.</p>'],
  about:['A more thoughtful standard of care','<p>Medora is a fictional medical technology brand created to demonstrate a premium equipment shopping experience.</p><p>The collection brings diagnostic equipment, patient monitoring, respiratory care, hospital furniture, surgical essentials, laboratory tools, mobility aids, and emergency care into one considered browsing experience.</p><p>Every part of this prototype is designed to help you explore, compare, shortlist, and try a complete shopping journey.</p>'],
  social:['Stay connected','<p>Medora is a fictional demonstration brand and has no official social media profiles.</p><p>Try the newsletter form to save a local demo subscription, or use the contact form to explore a sample inquiry flow.</p><button class="btn btn-primary" data-action="contact">Contact our team</button>'],
};
function openPolicy(name){const policy=policies[name];if(!policy)return;$('#info-title').textContent=policy[0];$('#info-content').innerHTML=policy[1];openDialog('#info-dialog');refreshIcons();}
function openContact(){
  $('#info-title').textContent='Let’s talk equipment.';
  $('#info-content').innerHTML='<p>Tell us what you’re looking for. Try a sample inquiry for your clinic, hospital, or practice.</p><div class="demo-notice">Demo contact form. Submissions stay in this page session and are not sent to anyone.</div><form id="contact-form" class="dialog-form"><label>Your name<input name="name" required autocomplete="name" maxlength="100" placeholder="Dr. Ananya Sharma" /></label><label>Email address<input type="email" name="email" required autocomplete="email" placeholder="you@example.com" /></label><label>How can we help?<textarea name="message" required minlength="10" maxlength="2000" placeholder="Tell us about the equipment you need..."></textarea></label><button type="submit" class="btn btn-primary">Preview inquiry <i data-lucide="arrow-right"></i></button></form>';
  openDialog('#info-dialog');refreshIcons();
}
function openCheckout(){
  if(!store.cart.length)return;
  $('#checkout-content').innerHTML=`<div class="demo-notice">Try the checkout experience. No payment is collected, no real order is placed, and your personal details are not saved.</div><form id="checkout-form" class="dialog-form"><label>Full name<input name="name" autocomplete="name" required maxlength="100" placeholder="Your full name" /></label><label>Email address<input type="email" name="email" autocomplete="email" required placeholder="you@example.com" /></label><label>Delivery address<textarea name="address" autocomplete="street-address" required minlength="10" maxlength="500" placeholder="Building, street, area and city"></textarea></label><label>Indian PIN code<input name="pincode" autocomplete="postal-code" required inputmode="numeric" pattern="[1-9][0-9]{5}" maxlength="6" placeholder="560001" title="Enter a valid six-digit Indian PIN code" /></label><div class="checkout-total"><span>${store.count} item${store.count===1?'':'s'} · Total</span><strong>${money(store.total)}</strong></div><button type="submit" class="btn btn-primary">Complete demo order ${icon('arrow-right')}</button></form>`;
  openDialog('#checkout-dialog');refreshIcons();
}

document.addEventListener('click',event=>{
  const button=event.target.closest('[data-action],[data-close],[data-policy],[data-category]');if(!button)return;
  if(button.hasAttribute('data-close')){button.closest('dialog').close();return;}
  if(button.dataset.policy){openPolicy(button.dataset.policy);return;}
  if(button.dataset.category){setCategory(button.dataset.category);if(!button.classList.contains('catalog-tab'))browse();return;}
  const id=button.dataset.id;
  switch(button.dataset.action){
    case 'cart':renderCart();openDialog('#cart-dialog');break;
    case 'wishlist':renderWishlist();openDialog('#wishlist-dialog');break;
    case 'save':{const wasSaved=store.wishlist.has(id);store.toggleWishlist(id);toast(wasSaved?'Removed from your wishlist':'Saved to your wishlist');break;}
    case 'add':addToCart(id);break;
    case 'buy':if(addToCart(id))openCheckout();break;
    case 'remove':store.remove(id.replace(/^p-/,''));toast('Removed from your equipment bag');break;
    case 'cart-minus':store.change(id,-1);break;
    case 'cart-plus':store.change(id,1);break;
    case 'quick':openQuick(id);break;
    case 'quick-minus':updateQuickQuantity(-1);break;
    case 'quick-plus':updateQuickQuantity(1);break;
    case 'quick-add':if(addToCart(id,quickQuantity)){closeDialogs();openDialog('#cart-dialog');}break;
    case 'browse':browse();break;
    case 'checkout':openCheckout();break;
    case 'contact':openContact();break;
    case 'reset-filters':resetFilters();break;
    case 'search':browse();setTimeout(()=>$('#product-search').focus({preventScroll:true}),reducedMotion.matches?0:450);break;
  }
});

document.addEventListener('submit',event=>{
  if(event.target.id==='newsletter-form'){
    event.preventDefault();const email=$('#newsletter-email').value.trim();
    const saved=writeStorage('medora.newsletter.v1',{email,subscribedAt:new Date().toISOString()});
    $('#newsletter-status').textContent=saved?'You’re on the demo list. Saved on this device only.':'Demo subscription previewed. Browser storage is unavailable.';
    $('#newsletter-email').value='';toast('Thank you. Your demo subscription is ready.');
  }
  if(event.target.id==='contact-form'){
    event.preventDefault();const form=new FormData(event.target);const name=escapeHTML(form.get('name'));const message=escapeHTML(form.get('message'));const email=escapeHTML(form.get('email'));
    $('#info-content').innerHTML=`<div class="order-success">${icon('check-circle-2')}<h3>Your inquiry preview is ready.</h3><p>Thank you, ${name}. This preview has not been sent.</p></div><div class="demo-notice"><strong>Reply to:</strong> ${email}<br /><strong>Your message:</strong><br />${message.replace(/\n/g,'<br />')}</div><button class="btn btn-outline" data-close>Close preview</button>`;refreshIcons();
  }
  if(event.target.id==='checkout-form'){
    event.preventDefault();if(!store.cart.length)return;
    const order={reference:'MD-DEMO-'+crypto.randomUUID().slice(0,8).toUpperCase(),items:store.cart.map(item=>({...item})),subtotal:store.subtotal,shipping:store.shipping,total:store.total,createdAt:new Date().toISOString()};
    writeStorage('medora.last-order.v1',order);store.clear();
    $('#checkout-content').innerHTML=`<div class="order-success">${icon('check-circle-2')}<h3>A better-equipped tomorrow.</h3><p>Your demo order is complete. No payment was taken and no real order has been placed.</p><span class="order-reference">${order.reference}</span><div class="summary-line"><span>Demo order total</span><strong>${money(order.total)}</strong></div><p>Thank you for exploring Medora. Your wishlist is ready whenever you return.</p><button class="btn btn-primary" data-action="browse">Continue exploring ${icon('arrow-right')}</button></div>`;refreshIcons();
  }
});

store.subscribe(({persisted})=>{
  const focused=document.activeElement;
  const focusAction=focused?.closest('dialog[open]')&&focused?.dataset.action;
  const focusId=focused?.dataset.id;
  renderCart();renderWishlist();
  if(focusAction){const replacement=document.querySelector(`dialog[open] [data-action="${focusAction}"][data-id="${focusId}"]`);if(replacement&&!replacement.disabled)replacement.focus({preventScroll:true});else document.querySelector('dialog[open] [data-close]')?.focus({preventScroll:true});}
  if(!persisted)toast('Updated for this session. Browser storage is unavailable.');
});
$('#product-search').addEventListener('input',event=>{filters.search=event.target.value;renderProducts();});
$('#category-filter').addEventListener('change',event=>setCategory(event.target.value));
$('#price-filter').addEventListener('change',event=>{filters.maxPrice=event.target.value;renderProducts();});
$('#sort-filter').addEventListener('change',event=>{filters.sort=event.target.value;renderProducts();});
$('#clear-filters').addEventListener('click',resetFilters);
$('#view-all').addEventListener('click',()=>{expanded=!expanded;renderProducts();if(!expanded)$('#products').scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth'});});

document.querySelectorAll('dialog').forEach(dialog=>{
  dialog.setAttribute('aria-modal','true');
  const heading=dialog.querySelector('h2');if(heading){heading.id ||= `${dialog.id}-heading`;dialog.setAttribute('aria-labelledby',heading.id);}
  if(dialog.id==='quick-dialog')dialog.setAttribute('aria-label','Equipment quick view');
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const bounds=dialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close();});
});

$('#menu-toggle').addEventListener('click',()=>{const open=$('#main-nav').classList.toggle('open');$('#menu-toggle').setAttribute('aria-expanded',String(open));$('#menu-toggle').setAttribute('aria-label',open?'Close menu':'Open menu');});
document.querySelectorAll('.main-nav a,.main-nav button').forEach(link=>link.addEventListener('click',()=>{$('#main-nav').classList.remove('open');$('#menu-toggle').setAttribute('aria-expanded','false');$('#menu-toggle').setAttribute('aria-label','Open menu');}));
document.addEventListener('keydown',event=>{if(event.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!document.querySelector('dialog[open]')){event.preventDefault();browse();$('#product-search').focus({preventScroll:true});}if(event.key==='Escape'){$('#main-nav').classList.remove('open');$('#menu-toggle').setAttribute('aria-expanded','false');}});
window.addEventListener('scroll',()=>$('#header').classList.toggle('scrolled',window.scrollY>15),{passive:true});

function renderReview(){const review=reviews[reviewIndex];$('#testimonial-card').innerHTML=`<span class="quote-mark" aria-hidden="true">“</span><div class="stars" aria-label="5 out of 5 stars">★★★★★</div><blockquote>“${review.quote}”</blockquote><div class="review-person"><span class="review-avatar">${review.initials}</span><div><strong>${review.name}</strong><span>${review.role}</span></div></div>`;$('#review-position').textContent=`0${reviewIndex+1} / 03`;}
function changeReview(delta){reviewIndex=(reviewIndex+delta+reviews.length)%reviews.length;renderReview();}
function startCarousel(){clearInterval(carouselTimer);if(!reducedMotion.matches)carouselTimer=setInterval(()=>{if(!document.hidden&&!document.querySelector('dialog[open]'))changeReview(1);},8500);}
$('#review-prev').addEventListener('click',()=>{changeReview(-1);startCarousel();});$('#review-next').addEventListener('click',()=>{changeReview(1);startCarousel();});
$('.testimonial-layout').addEventListener('mouseenter',()=>clearInterval(carouselTimer));$('.testimonial-layout').addEventListener('mouseleave',startCarousel);$('.testimonial-layout').addEventListener('focusin',()=>clearInterval(carouselTimer));$('.testimonial-layout').addEventListener('focusout',startCarousel);

function setupMotion(stageId,showcase=false){
  const stage=$(stageId),object=stage.querySelector('.motion-object');let frame;
  stage.addEventListener('pointermove',event=>{if(reducedMotion.matches||event.pointerType==='touch')return;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const rect=stage.getBoundingClientRect();const x=(event.clientX-rect.left)/rect.width-.5,y=(event.clientY-rect.top)/rect.height-.5;if(showcase)object.style.animation='none';else object.style.animationPlayState='paused';object.style.transform=`${showcase?'translate(-50%, -50%) ':''}rotateY(${x*7}deg) rotateX(${-y*5}deg)`;});});
  stage.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);object.style.transform='';if(showcase)object.style.animation='';object.style.animationPlayState=showcase&&!$('#rotate-toggle').matches('[aria-pressed="true"]')?'paused':'';});
}
setupMotion('#hero-stage');setupMotion('#showcase-stage',true);
$('#rotate-toggle').addEventListener('click',()=>{const playing=$('#rotate-toggle').getAttribute('aria-pressed')==='true';$('#rotate-toggle').setAttribute('aria-pressed',String(!playing));$('#rotate-toggle').setAttribute('aria-label',playing?'Play product motion':'Pause product motion');$('#rotate-toggle').innerHTML=icon(playing?'play':'pause');$('.featured-image-wrap').style.animationPlayState=playing?'paused':'';refreshIcons();});
$('#zoom-toggle').addEventListener('click',()=>{const zoomed=$('.featured-image-wrap').classList.toggle('zoomed');$('#zoom-toggle').setAttribute('aria-pressed',String(zoomed));$('#zoom-toggle').setAttribute('aria-label',zoomed?'Zoom out product':'Zoom product');$('#zoom-toggle').innerHTML=icon(zoomed?'zoom-out':'zoom-in');refreshIcons();});
$('#reset-showcase').addEventListener('click',()=>{$('.featured-image-wrap').classList.remove('zoomed');$('.featured-image-wrap').style.transform='';$('#zoom-toggle').setAttribute('aria-pressed','false');$('#zoom-toggle').setAttribute('aria-label','Zoom product');$('#zoom-toggle').innerHTML=icon('zoom-in');refreshIcons();toast('Product view reset');});
reducedMotion.addEventListener('change',startCarousel);

renderProducts();renderCart();renderWishlist();renderReview();refreshIcons();startCarousel();
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));
