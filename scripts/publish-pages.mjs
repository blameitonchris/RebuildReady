import {spawnSync} from 'node:child_process';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
function run(command,args,options={}){
 const result=spawnSync(command,args,{cwd:root,encoding:'utf8',...options});
 if(result.error)throw result.error;
 if(result.status!==0)throw new Error(`${command} failed: ${result.stderr||result.stdout}`);
 return result.stdout?.trim();
}
if(run('git',['branch','--show-current']).startsWith('compatibility/'))throw new Error('Live-site publishing is blocked on a compatibility branch. Use deploy:compatibility.');
// Build only application files. Device drafts and imported plans live in browser storage.
run('npm',['test'],{stdio:'inherit'});
run('npm',['run','standalone'],{stdio:'inherit'});
const previous=run('git',['ls-remote','origin','refs/heads/gh-pages']).split(/\s/)[0];
if(previous)run('git',['fetch','origin','refs/heads/gh-pages']);
const temporary=await mkdtemp(path.join(tmpdir(),'rebuildready-pages-'));
const environment={...process.env,GIT_INDEX_FILE:path.join(temporary,'index')};
const git=(args,input)=>run('git',args,{env:environment,input});
try{
 git(['read-tree','--empty']);
 for(const [name,content] of [['index.html',await readFile(path.join(root,'RebuildReady.html'),'utf8')],['.nojekyll','']]){
  const hash=git(['hash-object','-w','--stdin'],content);
  git(['update-index','--add','--cacheinfo',`100644,${hash},${name}`]);
 }
 const tree=git(['write-tree']);
 const args=['-c','user.name=RebuildReady','-c','user.email=deploy@rebuildready.invalid','commit-tree',tree];
 if(previous)args.push('-p',previous);
 const commit=git(args,'Publish tested RebuildReady free testing version\n');
 run('git',['push','origin',`${commit}:refs/heads/gh-pages`],{stdio:'inherit'});
 console.log('Uploaded production files to gh-pages. No source files, credentials, or device drafts are in this payload.');
 console.log('GitHub Settings → Pages must use gh-pages and / (root).');
 console.log('Configured site address: https://blameitonchris.github.io/RebuildReady/');
 console.log('A successful upload does not confirm that Pages is enabled or that the public site is live.');
}finally{await rm(temporary,{recursive:true,force:true});}
