import {spawnSync} from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
function run(args,options={}){const r=spawnSync('git',args,{encoding:'utf8',...options});if(r.status!==0)throw new Error(r.stderr||r.stdout);return r.stdout.trim();}
if(!run(['branch','--show-current']).startsWith('compatibility/'))throw new Error('Run only from the compatibility branch.');
const source=await fs.readFile('dist-compat/index.html','utf8');
if(!source.includes('rebuildready-compatibility-preview-v1')||source.includes('basementquote-v1'))throw new Error('Isolated preview storage is required.');
const previous=run(['ls-remote','origin','refs/heads/gh-pages']).split(/\s/)[0];
if(!previous)throw new Error('Existing release is required; this publisher never creates or replaces the main site.');
run(['fetch','origin','refs/heads/gh-pages']);
// Preserve the current original version, including the separately approved Save draft update.
const baseline=run(['rev-parse',`${previous}:index.html`]);
const temp=await fs.mkdtemp(path.join(os.tmpdir(),'rebuildready-preview-index-'));
const env={...process.env,GIT_INDEX_FILE:path.join(temp,'index')};
const git=(args,input)=>run(args,{env,input});
try{
 git(['read-tree',previous]);
 const blob=git(['hash-object','-w','--stdin'],source);git(['update-index','--add','--cacheinfo',`100644,${blob},compatibility/index.html`]);
 const tree=git(['write-tree']);
 if(run(['rev-parse',`${tree}:index.html`])!==baseline)throw new Error('Main page preservation failed.');
 const names=run(['diff-tree','--no-commit-id','--name-only','-r',`${previous}^{tree}`,tree]).split('\n').filter(Boolean);
 if(names.some(name=>name!=='compatibility/index.html'))throw new Error('Only the preview path may change.');
 const commit=git(['-c','user.name=RebuildReady','-c','user.email=deploy@rebuildready.invalid','commit-tree',tree,'-p',previous],'Add isolated online tablet compatibility preview; preserve original release\n');
 run(['push','origin',`${commit}:refs/heads/gh-pages`]);
 console.log('Published compatibility/index.html only; original index.html is byte-for-byte unchanged.');
 console.log('https://blameitonchris.github.io/RebuildReady/compatibility/');
}finally{await fs.rm(temp,{recursive:true,force:true});}
