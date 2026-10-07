import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {parse} from 'acorn';
import {calculate,importPlan} from '../src/calculations.js';
const html=await fs.readFile('dist-compat/index.html','utf8');
for(const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g))parse(match[1],{ecmaVersion:5,sourceType:'script'});
assert(!html.includes('type="module"'));assert(!html.includes('serviceWorker'));assert(!html.includes('basementquote-v1'));
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:800,height:1280},acceptDownloads:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  localStorage.setItem('basementquote-v1','LIVE-SENTINEL-UNCHANGED');
  Object.fromEntries=undefined;Object.entries=undefined;Object.values=undefined;Array.prototype.at=undefined;String.prototype.padStart=undefined;NodeList.prototype.forEach=undefined;
  NodeList.prototype[Symbol.iterator]=undefined;Blob.prototype.text=undefined;crypto.randomUUID=undefined;window.Intl=undefined;
  const supports=CSS.supports.bind(CSS);CSS.supports=(a,b)=>a==='selector(:focus-visible)'||a==='padding'&&b==='max(1px,2px)'?false:supports(a,b);
 });
 await page.goto(process.env.COMPAT_URL||'http://127.0.0.1:4190/');
 await page.getByRole('button',{name:'I’m a homeowner'}).click();
 await page.getByRole('textbox',{name:'Room name',exact:true}).fill('Tablet test');await page.getByRole('spinbutton',{name:'Length · ft',exact:true}).fill('20');await page.getByRole('spinbutton',{name:'Width · ft',exact:true}).fill('15');
 assert.equal(await page.evaluate(()=>localStorage.getItem('basementquote-v1')),'LIVE-SENTINEL-UNCHANGED');
 assert(await page.evaluate(()=>!!localStorage.getItem('rebuildready-compatibility-preview-v1')));
 await page.locator('#file').setInputFiles('examples/full-restoration-plan.json');await page.getByText('Plan imported. Check its measurements and prices before using it.').waitFor();
 const expected=importPlan(await fs.readFile('examples/full-restoration-plan.json','utf8'));const current=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('rebuildready-compatibility-preview-v1')));
 assert.equal(calculate(await current()).projectTotal,calculate(expected).projectTotal);
 for(const dimensions of [{width:800,height:1280},{width:1280,height:800},{width:800,height:420}]){
  await page.setViewportSize(dimensions);await page.evaluate(()=>document.documentElement.classList.add('no-flex-gap'));
  for(const step of [0,1,2,3]){await page.locator(`[data-step="${step}"]`).click();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Step ${step}: horizontal page overflow`);}
  await page.locator('[data-step="2"]').click();await page.getByRole('textbox',{name:'Project name'}).focus();await page.waitForTimeout(450);const bounds=await page.getByRole('textbox',{name:'Project name'}).boundingBox();assert(bounds.y>=0&&bounds.y+bounds.height<=dimensions.height+1,'Focused input is reachable in reduced viewport');
 }
 await page.getByRole('button',{name:'Switch to contractor'}).click();await page.locator('input[data-path="items.drywall.material"]').fill('2.25');await page.locator('input[data-path="items.drywall.labor"]').fill('3.75');
 await page.locator('[data-step="3"]').click();const before=await current();
 const pending=page.waitForEvent('download');await page.locator('.editor .share-options [data-action="export"]').click();const download=await pending;assert.deepEqual(importPlan(await fs.readFile(await download.path(),'utf8')),before);
 await page.locator('#file').setInputFiles(await download.path());await page.getByText('Plan imported. Check its measurements and prices before using it.').waitFor();assert.deepEqual(await current(),before);
 await page.locator('header [data-action="print"]').click();assert.equal(await page.locator('.summary-stage').count(),6);await page.pdf({path:'/tmp/RebuildReady-compatibility-estimate.pdf',format:'A4',printBackground:true});
 await page.evaluate(()=>{window.print=undefined;URL.createObjectURL=undefined;window.open=()=>null;});
 await page.locator('header [data-action="print"]').click();assert.match(await page.locator('.print-feedback').textContent(),/could not open/);
 await page.getByRole('button',{name:'Open printable estimate in new tab'}).click();assert.match(await page.locator('.print-feedback').textContent(),/blocked/);
 await page.locator('.editor .share-options [data-action="export"]').click();await page.locator('#plan-text').waitFor();assert.deepEqual(importPlan(await page.locator('#plan-text').inputValue()),before);
 await page.locator('#plan-text').fill('{bad');await page.getByRole('button',{name:'Import pasted plan'}).click();assert.match(await page.locator('.plan-text-feedback').textContent(),/unchanged/);assert.deepEqual(await current(),before);
 await page.locator('#plan-text').fill(JSON.stringify(before));await page.getByRole('button',{name:'Import pasted plan'}).click();assert.deepEqual(await current(),before);
 await page.reload();await page.getByRole('button',{name:'Continue device draft'}).click();assert.deepEqual(await current(),before);assert.equal(await page.evaluate(()=>localStorage.getItem('basementquote-v1')),'LIVE-SENTINEL-UNCHANGED');
 await page.screenshot({path:'/tmp/RebuildReady-compatibility-tablet.png',fullPage:true});assert.deepEqual(errors,[]);
 console.log('Passed: ES5 parsing; no modules; newer APIs removed; FileReader imports; UUID fallback; pricing/calculations; JSON round-trip and paste alternatives; blocked printing/popups/downloads; isolated storage; portrait/landscape/reduced viewport and focus reachability. These are desktop tests, not proof of Android 4.2.2 compatibility.');
}finally{await browser.close();}
