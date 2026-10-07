import {spawnSync} from 'node:child_process';
import fs from 'node:fs/promises';
import {transformAsync} from '@babel/core';
import {parse} from 'acorn';
const result=spawnSync('npm',['run','build','--','--outDir','dist-compat'],{stdio:'inherit',env:{...process.env,VITE_COMPAT_PREVIEW:'1'}});
if(result.status!==0)process.exit(result.status||1);
const html=await fs.readFile('dist-compat/index.html','utf8');
const jsPath=html.match(/src="([^"]+\.js)"/)[1];const cssPath=html.match(/href="([^"]+\.css)"/)[1];
const js=await fs.readFile(`dist-compat${jsPath}`,'utf8');
const transformed=await transformAsync(js,{babelrc:false,configFile:false,presets:[['@babel/preset-env',{targets:{chrome:'49'},forceAllTransforms:true,modules:false}]],comments:false,compact:true});
// Classic ES5 avoids both module bootstrapping and newer syntax parse failures.
parse(transformed.code,{ecmaVersion:5,sourceType:'script'});
const css=(await fs.readFile(`dist-compat${cssPath}`,'utf8')).replace(/@import\s*(?:url\([^)]*\)|"[^"]*"|'[^']*')\s*;/g,'');
const licenses=await fs.readFile('node_modules/core-js/LICENSE','utf8')+'\n'+await fs.readFile('node_modules/@babel/core/LICENSE','utf8');
const output=html.replace(/<script type="module"[^>]+><\/script>/,'').replace('</body>',()=>`<script>${transformed.code.replace(/<\/script/gi,'<\\/script')}</script></body>`).replace(/<link rel="stylesheet"[^>]+>/,()=>`<style>${css}</style>`);
if(!output.includes('rebuildready-compatibility-preview-v1'))throw new Error('Preview draft key missing');
await fs.writeFile('dist-compat/index.html',output.replace('</head>',()=>`<!-- Third-party notices: ${licenses.replace(/--/g,'—')} --></head>`));
await fs.rm('dist-compat/assets',{recursive:true,force:true});
console.log('Built online compatibility preview: ES5 classic script, targeted polyfills, isolated draft key. No offline support.');
