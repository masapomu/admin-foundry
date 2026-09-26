// Optional maintainer check: node tests/static-check.mjs. No dependency install.
import {readFileSync,readdirSync,existsSync,statSync} from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=process.cwd();
const assetRoot='skills/server-rendered-admin-ui/assets';
const pageRoot=`${assetRoot}/reference-ui`;
const files=readdirSync(pageRoot).filter(f=>f.endsWith('.html'));
const manifest=JSON.parse(readFileSync('plugin.json','utf8'));
assert.equal(manifest.name,'admin-foundry');
assert.equal(manifest.version,'0.1.2');
assert.equal(manifest.homepage,'https://masapomu.github.io/admin-foundry/');
const codexManifest=JSON.parse(readFileSync('.codex-plugin/plugin.json','utf8'));
assert.equal(codexManifest.version,manifest.version);
assert.equal(codexManifest.interface.websiteURL,manifest.homepage);
assert.equal(manifest.license,'MIT');
assert.equal(manifest.$schema,'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json');
assert(!existsSync('mcp.json')&&!existsSync('.mcp.json'),'Skills-only plugin must not declare MCP');
const markdownFiles=['README.md','README.ja.md','VALIDATION.md','THIRD-PARTY-NOTICES.md','skills/server-rendered-admin-ui/SKILL.md',...readdirSync('skills/server-rendered-admin-ui/references').filter(f=>f.endsWith('.md')).map(f=>`skills/server-rendered-admin-ui/references/${f}`)];
for(const file of markdownFiles){
  const md=readFileSync(file,'utf8');
  for(const match of md.matchAll(/\]\(([^)]+)\)/g)){
    const link=match[1].split('#')[0];
    if(!link||/^(?:https?:)?\/\//.test(link))continue;
    assert(existsSync(path.resolve(path.dirname(file),decodeURIComponent(link))),`Broken Markdown link: ${file}: ${link}`);
  }
}
let references=0;
const idsByFile=new Map();
for(const name of files){
  const html=readFileSync(`${pageRoot}/${name}`,'utf8');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,`Duplicate ID: ${name}`);
  idsByFile.set(name,new Set(ids));
}
for(const name of files){
  const html=readFileSync(`${pageRoot}/${name}`,'utf8');
  assert.match(html,/<html[^>]+lang="(?:en|ja)"/);
  assert.match(html,/<meta charset="utf-8">/);
  assert.match(html,/<script src="\.\.\/js\/theme-init\.js"><\/script>/,`Early theme setup: ${name}`);
  assert.match(html,/<html[^>]+data-ui-theme="graphite-blue"/,`Default Graphite Blue: ${name}`);
  assert.match(html,/<a href="\?theme=graphite-blue" data-demo-theme="graphite-blue" aria-current="true">Graphite Blue<\/a>/,`Default theme preview: ${name}`);
  assert.match(html,/<a href="\?theme=sapphire-blue" data-demo-theme="sapphire-blue">Sapphire Blue<\/a>/,`Sapphire Blue preview: ${name}`);
  assert.match(html,/<a href="\?theme=garnet-red" data-demo-theme="garnet-red">Garnet Red<\/a>/,`Garnet Red preview: ${name}`);
  assert.match(html,/<a href="\?theme=aqua-ivory" data-demo-theme="aqua-ivory">Aqua Ivory<\/a>/,`Aqua Ivory preview: ${name}`);
  assert.match(html,/<a href="\?theme=dark" data-demo-theme="dark">Dark<\/a>/,`Dark theme preview: ${name}`);
  assert.doesNotMatch(html,/Soft blue|Muted red|\?theme=(?:blue|red)"/,`Retired preview: ${name}`);
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`h1 count: ${name}`);
  assert.equal((html.match(/id="ui-dialog"/g)||[]).length,name.startsWith('login')?0:1,`Shared dialog: ${name}`);
  if(name.startsWith('login')) {
    assert.match(html,/method="post"/,`Server-style sign-in form: ${name}`);
    assert.match(html,/autocomplete="current-password"/,`Password autofill: ${name}`);
    assert.match(html,/\.\.\/css\/login\.css/,`Scoped sign-in styles: ${name}`);
  }
  for(const m of html.matchAll(/\b(?:href|src|action)="([^"]+)"/g)){
    const url=m[1];
    assert(!/^(?:https?:)?\/\//.test(url),`Remote dependency: ${name}: ${url}`);
    if(url.startsWith('data:')) continue;
    const [fileQuery,fragment]=url.split('#');
    const relative=fileQuery.split('?')[0];
    const target=relative?path.resolve(pageRoot,relative):path.resolve(pageRoot,name);
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
for(const file of [`${assetRoot}/css/admin-ui.css`,`${assetRoot}/css/login.css`,`${assetRoot}/vendor/bootstrap/bootstrap.min.css`,`${assetRoot}/vendor/bootstrap-icons/bootstrap-icons.min.css`]){
  const css=readFileSync(file,'utf8');
  for(const m of css.matchAll(/url\(([^)]+)\)/g)){
    const value=m[1].replace(/^['"]|['"]$/g,'');
    if(value.startsWith('data:'))continue;
    assert(!/^(?:https?:)?\/\//.test(value),`Remote CSS asset: ${file}`);
    assert(existsSync(path.resolve(path.dirname(file),value.split('?')[0])),`Missing CSS asset: ${value}`);
  }
}
for(const file of [`${assetRoot}/js/admin-ui.js`,`${assetRoot}/js/reference-demo.js`,`${assetRoot}/js/theme-init.js`]){
  assert(!/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\s*\(/.test(readFileSync(file,'utf8')),`Unexpected network client: ${file}`);
}
for(const file of [`${assetRoot}/vendor/bootstrap/LICENSE`,`${assetRoot}/vendor/bootstrap/POPPER-LICENSE.md`,`${assetRoot}/vendor/bootstrap-icons/LICENSE`,`${assetRoot}/vendor/bootstrap/bootstrap.min.css.map`,`${assetRoot}/vendor/bootstrap/bootstrap.bundle.min.js.map`])assert(statSync(file).size>500,`Missing vendor material: ${file}`);
const rgb=hex=>hex.replace('#','').match(/../g).map(v=>{const s=parseInt(v,16)/255;return s<=.04045?s/12.92:((s+.055)/1.055)**2.4;});
const luminance=hex=>rgb(hex).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
const colors=[['primary text','#202b36','#ffffff'],['secondary text','#4a5969','#ffffff'],['muted text','#5d6c7c','#edf1f5'],['interactive text','#225da8','#ffffff'],['shell text','#f3f6fa','#272b30'],['shell muted','#b9c3ce','#272b30'],['shell active','#f3f6fa','#3a4654'],['primary action','#ffffff','#2866b3'],['danger action','#ffffff','#b3363d'],['success','#23704c','#edf7f1'],['warning','#885613','#fff7e8'],['danger','#b3363d','#fdf0f0'],['info','#31688d','#eef6fb'],['sapphire primary action','#ffffff','#176aa9'],['sapphire interactive text','#165e9d','#ffffff'],['sapphire muted text','#596f84','#eaf1f8'],['sapphire shell muted','#bed1e2','#213750'],['sapphire active navigation','#f5f9ff','#315475'],['garnet primary action','#ffffff','#8f3b60'],['garnet interactive text','#843650','#ffffff'],['garnet muted text','#755867','#f5eef1'],['garnet shell muted','#e1cbd5','#352a31'],['garnet active navigation','#fcf5f8','#563f4b'],['aqua ivory primary action','#ffffff','#176d9e'],['aqua ivory interactive text','#0e638d','#ffffff'],['aqua ivory muted text','#5b6972','#fbfcfd'],['aqua ivory shell cyan','#25333a','#eaf6f8'],['aqua ivory shell ivory','#25333a','#f8f3e5'],['aqua ivory shell muted cyan','#51616b','#eaf6f8'],['aqua ivory shell muted ivory','#51616b','#f8f3e5'],['aqua ivory selected navigation','#25333a','#e7f2ee'],['dark primary text','#edf2f7','#20262e'],['dark secondary text','#bdc9d5','#20262e'],['dark muted text','#aab7c4','#15191f'],['dark accent','#91b8e8','#20262e'],['dark selection','#91b8e8','#31445b'],['dark active page','#15191f','#91b8e8'],['dark primary action','#ffffff','#446fa6'],['dark danger action','#ffffff','#a53442'],['dark success','#89d5ad','#203a2d'],['dark warning','#e6bf79','#413220'],['dark danger','#f08e94','#42262b'],['dark info','#87c9e3','#203644']];
assert(contrast('#798797','#eef2f5')>=3,'Disabled text should remain distinguishable');
for(const [name,fg,bg]of colors){const ratio=contrast(fg,bg);assert(ratio>=4.5,`${name} contrast ${ratio}`);console.log(`${name}: ${ratio.toFixed(2)}:1`);}
console.log(`PASS: ${files.length} pages, ${references} local references, IDs/ARIA/input labels, offline assets, vendor materials, ${colors.length} text contrast pairs.`);
