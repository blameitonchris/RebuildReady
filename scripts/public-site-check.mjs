import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculate,importPlan} from '../src/calculations.js';
const site=process.env.SITE_URL||'http://127.0.0.1:4187/';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},acceptDownloads:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto(site);assert(response.ok(),`Site returned ${response.status()}`);
 await page.getByRole('button',{name:'I’m a homeowner'}).click();
 await page.getByRole('textbox',{name:'Room name'}).first().fill('Test room');
 await page.getByRole('spinbutton',{name:'Length · ft',exact:true}).first().fill('20');
 await page.getByRole('spinbutton',{name:'Width · ft',exact:true}).first().fill('15');
 await page.locator('[data-step="3"]').click();await page.getByText('Incomplete estimate',{exact:true}).waitFor();
 await page.reload();await page.getByRole('button',{name:'Continue device draft'}).click();assert.equal(await page.getByRole('textbox',{name:'Room name'}).first().inputValue(),'Test room');
 await page.locator('[data-action="home"]').click();await page.getByRole('button',{name:'I’m a contractor'}).click();
 await page.locator('[data-step="2"]').click();await page.getByRole('textbox',{name:'Contractor / business name'}).fill('Test Contractor');
 await page.locator('#file').setInputFiles('examples/full-restoration-plan.json');
 await page.getByText('Plan imported. Check its measurements and prices before using it.').waitFor();
 await page.locator('[data-step="3"]').click();await page.getByText('All selected work is priced',{exact:true}).waitFor();await page.getByText('EXAMPLE PROJECT · All prices are demonstration values, not local market estimates.',{exact:true}).waitFor();
 const original=await page.evaluate(()=>JSON.parse(localStorage.getItem('basementquote-v1')));assert.equal(original.role,'contractor');
 const pending=page.waitForEvent('download');await page.locator('.editor .share-options [data-action="export"]').click();const download=await pending;
 assert.match(download.suggestedFilename(),/^RebuildReady-.*-Plan\.json$/);const file=await download.path();assert.deepEqual(importPlan(await readFile(file,'utf8')),original);
 await page.locator('#file').setInputFiles(file);await page.getByText('Plan imported. Check its measurements and prices before using it.').waitFor();assert.deepEqual(calculate(importPlan(await page.evaluate(()=>localStorage.getItem('basementquote-v1')))),calculate(original));
 await page.evaluate(()=>{window.__printEvents=0;window.addEventListener('beforeprint',()=>window.__printEvents++);});
 await page.locator('header [data-action="print"]').click();assert.equal(await page.evaluate(()=>window.__printEvents),1);assert.equal(await page.locator('.summary-stage').count(),6);
 const printablePending=page.waitForEvent('download');await page.getByRole('button',{name:'Download printable estimate (.html)'}).click();const printable=await printablePending;const html=await readFile(await printable.path(),'utf8');for(const term of ['Contractor quote &amp; overall project budget','Homeowner-paid','Quote notes','What this plan covers'])assert(html.includes(term),term);
 await page.pdf({path:'/tmp/RebuildReady-production-check.pdf',format:'A4',printBackground:true});
 await page.setViewportSize({width:390,height:844});for(const role of ['contractor','homeowner']){
 if(role==='homeowner')await page.getByRole('button',{name:'Switch to homeowner'}).click();
 for(const step of [0,1,2,3]){await page.locator(`[data-step="${step}"]`).click();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${role} step ${step} horizontal overflow`);}
 }
 await page.screenshot({path:'/tmp/RebuildReady-production-mobile.png',fullPage:false});assert.deepEqual(errors,[]);
 console.log(`Production check passed at ${site}: desktop/mobile, both roles, drafts, example labels, complete/incomplete estimates, JSON round-trip, native print, printable HTML, six-stage PDF, no JavaScript errors.`);
}finally{await browser.close();}
