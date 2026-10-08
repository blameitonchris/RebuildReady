import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const site=process.env.SAVE_TEST_URL||'http://127.0.0.1:5173/';const key=process.env.SAVE_TEST_KEY||'basementquote-v1';
try{
 const page=await browser.newPage({viewport:{width:800,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(site);await page.getByRole('button',{name:'I’m a homeowner'}).click();
 await page.evaluate(()=>{window.__originalSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new Error('Storage unavailable')};});
 await page.getByRole('textbox',{name:'Room name',exact:true}).fill('Save button test');await page.getByRole('spinbutton',{name:'Length · ft',exact:true}).fill('22');
 await page.locator('.draft-save-top button').click();assert.match(await page.locator('.draft-save-top .draft-save-status').textContent(),/Could not save/);
 await page.evaluate(()=>Storage.prototype.setItem=window.__originalSetItem);await page.locator('.draft-save-top button').click();assert.match(await page.locator('.draft-save-top .draft-save-status').textContent(),/Saved on this device/);
 assert.equal(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).rooms[0].length,key),'22');assert.equal(await page.getByRole('textbox',{name:'Room name',exact:true}).inputValue(),'Save button test');
 for(const role of ['homeowner','contractor']){
  if(role==='contractor')await page.getByRole('button',{name:'Switch to contractor'}).click();
  for(const step of [0,1,2,3]){await page.locator(`[data-step="${step}"]`).click();assert.equal(await page.getByRole('button',{name:'Save draft',exact:true}).count(),2);await page.locator('.draft-save-bottom button').click();assert.match(await page.locator('.draft-save-bottom .draft-save-status').textContent(),/Saved on this device/);}
 }
 await page.locator('[data-step="2"]').click();await page.locator('textarea[data-path="notes"]').fill('An unfinished plan can be saved.');await page.locator('.draft-save-top button').click();const saved=await page.evaluate(k=>localStorage.getItem(k),key);
 await page.reload();await page.getByRole('button',{name:'Continue device draft'}).click();assert.equal(await page.getByRole('textbox',{name:'Room name',exact:true}).inputValue(),'Save button test');assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),saved);
 await page.setViewportSize({width:390,height:700});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.locator('[data-step="3"]').click();await page.emulateMedia({media:'print'});assert(!(await page.locator('.draft-save-top').isVisible()));assert(!(await page.locator('.draft-save-bottom').isVisible()));assert.deepEqual(errors,[]);
 console.log('Save draft passed: explicit success/failure, current edited values, both roles/all steps, partial draft restore, mobile layout, and print exclusion at '+site);
}finally{await browser.close();}
