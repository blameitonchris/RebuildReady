import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculate,importPlan} from '../src/calculations.js';
const site=process.env.SITE_URL||'http://127.0.0.1:5173';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},acceptDownloads:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(site);await page.getByRole('button',{name:'Explore an example project'}).click();
 const stored=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('basementquote-v1')));const original=await stored();
 await page.locator('[data-step="1"]').click();assert.equal(await page.locator('.stage-mini b').count(),0);assert.equal(await page.locator('aside').getByText('Contractor materials',{exact:true}).count(),0);assert.equal(await page.locator('aside').getByText('Contractor labor',{exact:true}).count(),0);
 await page.locator('#stage-reconstruction details>summary').click();const quantity=page.getByRole('spinbutton',{name:'Drywall quantity · sq ft',exact:true});await quantity.fill('250');assert.equal(await page.locator('.stage-mini b').count(),0);
 await page.locator('[data-step="2"]').click();assert.equal(await page.locator('input[data-path$=".material"],input[data-path$=".labor"]').count(),0);assert(await page.getByText('Your contractor will set material prices and labor rates.',{exact:false}).isVisible());
 const services=page.locator('.stage-prices').filter({has:page.getByRole('heading',{name:'Reconstruction & finishing',exact:true})});assert(await services.getByText('Drywall',{exact:true}).isVisible());
 const drying=page.locator('.stage-prices').filter({has:page.getByRole('heading',{name:'Drying & dehumidifiers',exact:true})});await drying.locator('summary').click();await page.getByRole('spinbutton',{name:'Industrial dehumidifiers daily rental · $ / unit / day',exact:true}).fill('70');
 const homeowner=await stored();assert.equal(homeowner.items.drywall.material,original.items.drywall.material);assert.equal(homeowner.items.drywall.labor,original.items.drywall.labor);
 await page.getByRole('button',{name:'Switch to contractor'}).click();assert(await page.locator('input[data-path="items.drywall.material"]').isVisible());assert(await page.locator('input[data-path="items.drywall.labor"]').isVisible());await page.locator('input[data-path="items.drywall.material"]').fill('2.25');await page.locator('input[data-path="items.drywall.labor"]').fill('3.75');
 const priced=await stored();await page.getByRole('button',{name:'Switch to homeowner'}).click();assert.equal(await page.locator('input[data-path$=".material"],input[data-path$=".labor"]').count(),0);assert.equal(calculate(await stored()).projectTotal,calculate(priced).projectTotal);
 await page.locator('[data-step="3"]').click();assert(await page.locator('.summary-stage table').first().isVisible());
 const pending=page.waitForEvent('download');await page.locator('.editor .share-options [data-action="export"]').click();const file=await pending;const exported=importPlan(await readFile(await file.path(),'utf8'));assert.equal(exported.items.drywall.material,'2.25');assert.equal(exported.items.drywall.labor,'3.75');await page.locator('#file').setInputFiles(await file.path());assert.equal((await stored()).items.drywall.material,'2.25');
 await page.reload();await page.getByRole('button',{name:'Continue device draft'}).click();await page.locator('[data-step="2"]').click();assert.equal(await page.locator('input[data-path$=".material"],input[data-path$=".labor"]').count(),0);assert.equal((await stored()).items.drywall.labor,'3.75');
 await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'/tmp/RebuildReady-homeowner-services-mobile.png',fullPage:true});
 if(!process.env.SITE_URL){await page.goto('http://127.0.0.1:5173/RebuildReady.html');await page.getByRole('button',{name:'Explore an example project'}).click();await page.locator('[data-step="2"]').click();assert.equal(await page.locator('input[data-path$=".material"],input[data-path$=".labor"]').count(),0);
 }
 assert.deepEqual(errors,[]);console.log('Homeowner services-only pricing passed: scope and live updates, contractor-only material/labor editing, known rental editing, rate preservation, totals, JSON round-trip, drafts, mobile, standalone.');
}finally{await browser.close();}
