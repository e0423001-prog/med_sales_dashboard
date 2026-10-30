import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,channel:'msedge'});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
try {
 await page.goto('http://127.0.0.1:5173',{waitUntil:'networkidle'});
 await page.screenshot({path:'artifacts/desktop-home.png'});
 for(const section of ['categories','products','featured']){
   await page.locator(`#${section}`).scrollIntoViewIfNeeded();
   await page.waitForTimeout(300);
   await page.locator(`#${section}`).screenshot({path:`artifacts/${section}.png`});
 }
 await page.setViewportSize({width:390,height:844});
 await page.goto('http://127.0.0.1:5173',{waitUntil:'networkidle'});
 await page.screenshot({path:'artifacts/mobile-home.png'});
 await page.locator('#products').scrollIntoViewIfNeeded();await page.waitForTimeout(300);
 await page.screenshot({path:'artifacts/mobile-products.png'});
 console.log('Desktop and mobile screenshots captured.');
} finally {await browser.close();}
