// Optional maintainer check: node tests/static-check.mjs. No dependency install.
import {readFileSync,readdirSync,existsSync,statSync} from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=process.cwd();
const files=readdirSync('demo').filter(f=>f.endsWith('.html'));
let references=0;
const idsByFile=new Map();
for(const name of files){
  const html=readFileSync(`demo/${name}`,'utf8');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,`Duplicate ID: ${name}`);
  idsByFile.set(name,new Set(ids));
}
for(const name of files){
  const html=readFileSync(`demo/${name}`,'utf8');
  assert.match(html,/<html[^>]+lang="en"/);
  assert.match(html,/<meta charset="utf-8">/);
  assert.match(html,/<script src="\.\.\/assets\/js\/theme-init\.js"><\/script>/,`Early theme setup: ${name}`);
  assert.match(html,/<html[^>]+data-ui-theme="graphite-blue"/,`Default Graphite Blue: ${name}`);
  assert.match(html,/<a href="\?theme=graphite-blue" data-demo-theme="graphite-blue" aria-current="true">Graphite Blue<\/a>/,`Default theme preview: ${name}`);
  assert.match(html,/<a href="\?theme=dark" data-demo-theme="dark">Dark<\/a>/,`Dark theme preview: ${name}`);
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`h1 count: ${name}`);
  assert.equal((html.match(/id="ui-dialog"/g)||[]).length,1,`Shared dialog: ${name}`);
  for(const m of html.matchAll(/\b(?:href|src|action)="([^"]+)"/g)){
    const url=m[1];
    assert(!/^(?:https?:)?\/\//.test(url),`Remote dependency: ${name}: ${url}`);
    if(url.startsWith('data:')) continue;
    const [fileQuery,fragment]=url.split('#');
    const relative=fileQuery.split('?')[0];
    const target=relative?path.resolve('demo',relative):path.resolve('demo',name);
    assert(target.startsWith(root+path.sep),`Path escapes project: ${url}`);
    assert(existsSync(target),`Missing target: ${name}: ${url}`);
    if(fragment && target.endsWith('.html')){
      const content=readFileSync(target,'utf8');
      assert(content.includes(`id="${fragment}"`),`Missing fragment: ${name}: ${url}`);
    }
    references++;
  }
  for(const m of html.matchAll(/\b(?:aria-controls|aria-labelledby|aria-describedby)="([^"]+)"/g)){
    for(const id of m[1].split(' '))assert(idsByFile.get(name).has(id),`Missing ARIA target: ${name}: ${id}`);
  }
  for(const m of html.matchAll(/<input\b[^>]*>/g)){
    if(/type="(?:hidden|submit)"/.test(m[0])||/aria-label=/.test(m[0])) continue;
    const id=m[0].match(/\bid="([^"]+)"/)?.[1];
    assert(id&&html.includes(`for="${id}"`),`Unlabeled input: ${name}: ${m[0]}`);
  }
}
for(const file of ['assets/css/admin-ui.css','assets/vendor/bootstrap/bootstrap.min.css','assets/vendor/bootstrap-icons/bootstrap-icons.min.css']){
  const css=readFileSync(file,'utf8');
  for(const m of css.matchAll(/url\(([^)]+)\)/g)){
    const value=m[1].replace(/^['"]|['"]$/g,'');
    if(value.startsWith('data:'))continue;
    assert(!/^(?:https?:)?\/\//.test(value),`Remote CSS asset: ${file}`);
    assert(existsSync(path.resolve(path.dirname(file),value.split('?')[0])),`Missing CSS asset: ${value}`);
  }
}
for(const file of ['assets/js/admin-ui.js','assets/js/reference-demo.js','assets/js/theme-init.js']){
  assert(!/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\s*\(/.test(readFileSync(file,'utf8')),`Unexpected network client: ${file}`);
}
for(const file of ['assets/vendor/bootstrap/LICENSE','assets/vendor/bootstrap/POPPER-LICENSE.md','assets/vendor/bootstrap-icons/LICENSE','assets/vendor/bootstrap/bootstrap.min.css.map','assets/vendor/bootstrap/bootstrap.bundle.min.js.map'])assert(statSync(file).size>500,`Missing vendor material: ${file}`);
const rgb=hex=>hex.replace('#','').match(/../g).map(v=>{const s=parseInt(v,16)/255;return s<=.04045?s/12.92:((s+.055)/1.055)**2.4;});
const luminance=hex=>rgb(hex).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
const colors=[['primary text','#202b36','#ffffff'],['secondary text','#4a5969','#ffffff'],['muted text','#5d6c7c','#edf1f5'],['interactive text','#225da8','#ffffff'],['shell text','#f3f6fa','#272b30'],['shell muted','#b9c3ce','#272b30'],['shell active','#f3f6fa','#3a4654'],['primary action','#ffffff','#2866b3'],['danger action','#ffffff','#b3363d'],['success','#23704c','#edf7f1'],['warning','#885613','#fff7e8'],['danger','#b3363d','#fdf0f0'],['info','#31688d','#eef6fb'],['soft blue theme on white','#365c82','#ffffff'],['soft blue selection','#365c82','#e5eff8'],['muted red theme on white','#86515a','#ffffff'],['muted red selection','#86515a','#f5e9eb'],['dark primary text','#edf2f7','#20262e'],['dark secondary text','#bdc9d5','#20262e'],['dark muted text','#aab7c4','#15191f'],['dark accent','#91b8e8','#20262e'],['dark selection','#91b8e8','#31445b'],['dark active page','#15191f','#91b8e8'],['dark primary action','#ffffff','#446fa6'],['dark danger action','#ffffff','#a53442'],['dark success','#89d5ad','#203a2d'],['dark warning','#e6bf79','#413220'],['dark danger','#f08e94','#42262b'],['dark info','#87c9e3','#203644']];
assert(contrast('#798797','#eef2f5')>=3,'Disabled text should remain distinguishable');
for(const [name,fg,bg]of colors){const ratio=contrast(fg,bg);assert(ratio>=4.5,`${name} contrast ${ratio}`);console.log(`${name}: ${ratio.toFixed(2)}:1`);}
console.log(`PASS: ${files.length} pages, ${references} local references, IDs/ARIA/input labels, offline assets, vendor materials, ${colors.length} text contrast pairs.`);
