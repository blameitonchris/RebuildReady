// Targeted platform support; no service worker, caching, or offline mode.
import 'core-js/actual/object/from-entries';
import 'core-js/actual/object/entries';
import 'core-js/actual/object/values';
import 'core-js/actual/array/at';
import 'core-js/actual/array/includes';
import 'core-js/actual/string/pad-start';
import 'core-js/actual/dom-collections/for-each';
import 'core-js/actual/dom-collections/iterator';

export const previewMode=import.meta.env.VITE_COMPAT_PREVIEW==='1';
export const storageKey=previewMode?'rebuildready-compatibility-preview-v1':'basementquote-v1';

export function readPlanFile(file){
 if(typeof file.text==='function')return file.text();
 return new Promise((resolve,reject)=>{
  if(typeof FileReader!=='function'){reject(new Error('Use Paste saved plan instead.'));return;}
  const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('The file could not be read. Use Paste saved plan instead.'));reader.readAsText(file);
 });
}
export function reveal(element){
 if(!element)return;
 try{element.focus({preventScroll:true});}catch{element.focus();}
 try{element.scrollIntoView({block:'nearest'});}catch{element.scrollIntoView(false);}
}
export function downloadFile(content,type,filename){
 if(typeof Blob!=='function'||!window.URL||typeof URL.createObjectURL!=='function')return false;
 let url;
 try{
  url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');
  if(!('download' in a)){URL.revokeObjectURL(url);return false;}
  a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.parentNode.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url),60000);return true;
 }catch{if(url)URL.revokeObjectURL(url);return false;}
}
export function installLayoutSupport(){
 const root=document.documentElement;
 const flex=document.createElement('div');flex.style.cssText='position:absolute;visibility:hidden;display:flex;flex-direction:column;row-gap:1px';
 flex.appendChild(document.createElement('div'));flex.appendChild(document.createElement('div'));document.body.appendChild(flex);
 if(flex.scrollHeight!==1)root.classList.add('no-flex-gap');flex.parentNode.removeChild(flex);
 if(!window.CSS||!CSS.supports||!CSS.supports('padding','max(1px,2px)'))root.classList.add('no-css-math');
 let focusSupported=false;try{focusSupported=!!(window.CSS&&CSS.supports('selector(:focus-visible)'));}catch{}
 if(!focusSupported)root.classList.add('legacy-focus');
 if(!window.CSS||!CSS.supports||!CSS.supports('display','grid'))root.classList.add('no-grid');
 document.addEventListener('focusin',event=>{
  const target=event.target;if(!/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))return;
  root.classList.add('editing-field');setTimeout(()=>reveal(target),350);
 });
 document.addEventListener('focusout',()=>root.classList.remove('editing-field'));
 window.addEventListener('resize',()=>{if(/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName))setTimeout(()=>reveal(document.activeElement),150);});
}
