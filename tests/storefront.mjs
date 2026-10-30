import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';

const browser=await chromium.launch({headless:true,channel:'msedge'});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const errors=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('console',message=>{if(message.type()==='error'&&!message.text().includes('fonts.googleapis'))errors.push(message.text());});
const base=process.env.TEST_URL||'http://127.0.0.1:5173';
let passed=0;
const check=(name)=>{passed++;console.log(`PASS ${name}`);};
async function text(selector){return page.locator(selector).textContent();}
async function click(selector){await page.locator(selector).click();}
async function waitRender(){await page.waitForTimeout(150);}

try {
 await page.goto(base,{waitUntil:'networkidle'});
 await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'networkidle'});
 assert.equal(await page.title(),'Medora — Precision in Every Care');
 assert.match((await text('h1')).replace(/\s+/g,' '),/Precision in Every Breath\. Innovation in Every Care\./);
 assert.equal(await page.locator('.category-card').count(),8);
 assert.equal(await page.locator('.product-card').count(),8);check('home, eight categories and featured catalog render');
 await page.evaluate(async()=>{document.querySelectorAll('img').forEach(image=>image.loading='eager');await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})));});
 await page.screenshot({path:'artifacts/desktop-home.png'});
 assert.equal(await page.evaluate(()=>[...document.images].filter(img=>!img.complete||!img.naturalWidth).length),0);check('all initial product and category images load');
 await click('#view-all');assert.equal(await page.locator('.product-card').count(),12);
 assert.equal(await page.locator('[data-product="microscope"] .add-cart').isDisabled(),true);check('expanded catalog and unavailable stock');
 await page.locator('#product-search').fill('oxygen');await waitRender();assert.equal(await page.locator('.product-card').count(),1);assert.match(await text('.product-name'),/Oxygen/);check('product search');
 await page.locator('#product-search').fill('zzzzzz');await waitRender();assert.equal(await page.locator('.no-results').count(),1);
 await click('[data-action="reset-filters"]');assert.equal(await page.locator('.product-card').count(),8);check('empty search and filter reset');
 await page.locator('#category-filter').selectOption('respiratory');assert.equal(await page.locator('.product-card').count(),2);
 await page.locator('#price-filter').selectOption('5000');assert.equal(await page.locator('.product-card').count(),1);
 assert.match(await text('.product-name'),/Nebulizer/);check('combined category and price filtering');
 await click('#clear-filters');await click('#view-all');
 await page.locator('#sort-filter').selectOption('price-asc');assert.match(await text('.product-card:first-child .product-name'),/Thermometer/);
 await page.locator('#sort-filter').selectOption('price-desc');assert.match(await text('.product-card:first-child .product-name'),/Ultrasound/);
 await page.locator('#sort-filter').selectOption('popular');assert.match(await text('.product-card:first-child .product-name'),/Blood Pressure/);check('price ascending, descending and popularity sorting');
 await click('[data-product="bp"] [data-action="add"]');await click('[data-product="bp"] [data-action="add"]');
 assert.equal(await text('#cart-count'),'2');
 await click('.cart-button');assert.match(await text('#cart-summary'),/4,998/);assert.match(await text('#cart-summary'),/199/);assert.match(await text('#cart-summary'),/5,197/);check('cart quantities, subtotal and delivery totals');
 await click('[data-action="cart-plus"]');assert.equal(await text('#cart-count'),'3');assert.match(await text('#cart-summary'),/7,497/);assert.match(await text('#cart-summary'),/Complimentary/);
 await click('[data-action="cart-minus"]');assert.equal(await text('#cart-count'),'2');check('increment, decrement and free-delivery threshold');
 await page.keyboard.press('Escape');assert.equal(await page.locator('dialog[open]').count(),0);
 await click('[data-product="oxygen"] [data-action="save"]');assert.equal(await text('#wishlist-count'),'1');
 await page.reload({waitUntil:'networkidle'});assert.equal(await text('#cart-count'),'2');assert.equal(await text('#wishlist-count'),'1');check('cart and wishlist survive refresh');
 await click('.wishlist-nav');assert.match(await text('#wishlist-items'),/Oxygen/);await click('#wishlist-items [data-action="save"]');assert.match(await text('#wishlist-items'),/Your next essential/);await page.keyboard.press('Escape');check('wishlist drawer and removal');
 await click('[data-product="monitor"] .quick-view');assert.equal(await page.locator('#quick-dialog').isVisible(),true);
 await click('[data-action="quick-plus"]');assert.equal(await text('#quick-quantity'),'2');
 await click('[data-action="quick-add"]');assert.equal(await page.locator('#cart-dialog').isVisible(),true);assert.equal(await text('#cart-count'),'4');check('quick view, quantity and add to bag');
 await click('[data-action="remove"][data-id="p-bp"]');assert.equal(await text('#cart-count'),'2');assert.match(await text('#cart-summary'),/85,980/);check('remove cart product and recalculate');
 await click('[data-action="checkout"]');
 await page.locator('#checkout-form [name="name"]').fill('Demo User');await page.locator('#checkout-form [name="email"]').fill('demo@example.com');await page.locator('#checkout-form [name="address"]').fill('123 Demo Street, Bengaluru');await page.locator('#checkout-form [name="pincode"]').fill('560001');
 await click('#checkout-form [type="submit"]');assert.match(await text('#checkout-content'),/MD-DEMO-/);assert.equal(await text('#cart-count'),'0');
 const order=await page.evaluate(()=>JSON.parse(localStorage.getItem('medora.last-order.v1')));assert.equal(order.total,85980);assert.equal(order.items[0].quantity,2);assert.equal(order.email,undefined);assert.equal(order.address,undefined);check('demo checkout, order summary and personal details not persisted');
 await page.keyboard.press('Escape');
 await page.locator('#newsletter-email').fill('reader@example.com');await click('#newsletter-form button');assert.match(await text('#newsletter-status'),/Saved on this device/);check('newsletter submission');
 await click('.main-nav [data-action="contact"]');
 await page.locator('#contact-form [name="name"]').fill('<img src=x onerror=alert(1)>');await page.locator('#contact-form [name="email"]').fill('demo@example.com');await page.locator('#contact-form [name="message"]').fill('Please preview this inquiry.');await click('#contact-form [type="submit"]');assert.match(await text('#info-content'),/has not been sent/);assert.equal(await page.locator('#info-content img').count(),0);check('contact preview safely escapes user input');
 await page.keyboard.press('Escape');await click('[data-policy="privacy"]');assert.match(await text('#info-title'),/Privacy/);await page.keyboard.press('Escape');check('footer information dialogs and Escape close');
 const reviewBefore=await text('#testimonial-card blockquote');await click('#review-next');assert.notEqual(await text('#testimonial-card blockquote'),reviewBefore);await click('#review-prev');assert.equal(await text('#testimonial-card blockquote'),reviewBefore);check('testimonial carousel controls');
 await click('#zoom-toggle');assert.equal(await page.locator('#zoom-toggle').getAttribute('aria-pressed'),'true');await click('#reset-showcase');assert.equal(await page.locator('#zoom-toggle').getAttribute('aria-pressed'),'false');await click('#rotate-toggle');assert.equal(await page.locator('#rotate-toggle').getAttribute('aria-pressed'),'false');check('showcase zoom, reset and motion controls');
 await page.setViewportSize({width:390,height:844});await page.goto(base,{waitUntil:'networkidle'});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await click('#menu-toggle');assert.equal(await page.locator('#main-nav').isVisible(),true);await click('#main-nav a[href="#products"]');assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');check('mobile layout and hamburger navigation');
 await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:'artifacts/mobile-home.png'});
 await page.setViewportSize({width:768,height:1024});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);check('tablet layout has no horizontal overflow');
 await page.setViewportSize({width:320,height:750});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);check('small mobile layout has no horizontal overflow');
 await page.evaluate(()=>{localStorage.setItem('medora.cart.v1','{"broken":true}');localStorage.setItem('medora.wishlist.v1','not-json');});await page.reload({waitUntil:'networkidle'});assert.equal(await text('#cart-count'),'0');check('malformed saved state recovers safely');
 assert.deepEqual(errors,[]);check('no JavaScript or browser console errors');
 console.log(`\n${passed} browser checks passed.`);
} finally {await browser.close();}
