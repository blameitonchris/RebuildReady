import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
await page.goto('http://127.0.0.1:5173');
await page.keyboard.press('Tab');assert.equal(await page.locator('.brand').evaluate(e=>e===document.activeElement),true);
await page.keyboard.press('Tab');assert.equal(await page.locator('[data-role="homeowner"]').evaluate(e=>e===document.activeElement),true);
assert.equal(await page.locator('[data-role="homeowner"]').evaluate(e=>getComputedStyle(e).outlineStyle),'solid');
await page.keyboard.press('Enter');assert.equal(await page.locator('[aria-current="step"]').textContent(),'1Measure');
await page.locator('[data-action="home"]').click();await page.getByRole('button',{name:'Explore an example project'}).click();
await page.screenshot({path:'/tmp/rebuildready-homeowner-rooms.png',fullPage:true});
await page.locator('[data-step="3"]').click();assert.equal(await page.locator('.status.good').count(),1);assert.equal(await page.locator('.summary-costs').first().isVisible(),true);
await page.getByRole('button',{name:'Switch to contractor'}).click();await page.locator('[data-step="2"]').click();await page.getByRole('spinbutton',{name:'Material · $ / sq ft',exact:true}).first().fill('');await page.getByRole('button',{name:'Switch to homeowner'}).click();await page.locator('[data-step="3"]').click();assert.equal(await page.locator('.status.good').count(),0);await page.getByText('Budget incomplete · 1 missing prices').waitFor();
await page.emulateMedia({media:'print'});assert.equal(await page.locator('aside').isVisible(),false);assert.equal(await page.locator('.header-note').isVisible(),true);assert.equal(await page.locator('.warning').isVisible(),true);assert.equal(await page.locator('.brand').isVisible(),true);await page.pdf({path:'/tmp/rebuildready-homeowner-incomplete.pdf',preferCSSPageSize:true,printBackground:true});await page.emulateMedia({media:'screen'});
await page.setViewportSize({width:390,height:844});for(const s of [0,1,2,3]){await page.locator(`[data-step="${s}"]`).click();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Homeowner step ${s} overflows`);}
await page.getByRole('button',{name:'Switch to contractor'}).click();for(const s of [0,1,2,3]){await page.locator(`[data-step="${s}"]`).click();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Contractor step ${s} overflows`);}
await page.locator('[data-step="2"]').click();await page.screenshot({path:'/tmp/rebuildready-contractor-pricing-mobile.png',fullPage:true});
await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.primary').first().evaluate(e=>getComputedStyle(e).transitionDuration),'0s');
const luminance=hex=>{const c=hex.match(/\w\w/g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};for(const [fg,bg]of [['285dcc','ffffff'],['596b80','faf9f6'],['536b88','edf4fc'],['315c99','f1f7ff'],['7e5720','fff7e7']]){const l=[luminance(fg),luminance(bg)].sort((a,b)=>a-b);assert.ok((l[1]+.05)/(l[0]+.05)>=4.5,`${fg}/${bg} text contrast`);}
await page.goto('http://127.0.0.1:5173/RebuildReady.html');await page.waitForFunction(()=>getComputedStyle(document.documentElement).backgroundColor==='rgb(250, 249, 246)');await page.getByRole('button',{name:'Explore an example project'}).click();await page.locator('[data-step="3"]').click();await page.getByRole('heading',{name:'Maple Street · Full basement restoration'}).waitFor();assert.equal(await page.locator('.brand-icon svg').count(),1);
console.log('Design checks passed: keyboard start, visible focus, progress state, complete/incomplete estimates, print branding and warnings, all eight mobile steps, reduced motion, text contrast, standalone copy.');await browser.close();
