// Optional Node-only maintainer tests; no application runtime dependency.
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import vm from 'node:vm';
const require=createRequire(import.meta.url);
const assetRoot='skills/server-rendered-admin-ui/assets';
const pageRoot=`${assetRoot}/reference-ui`;
assert.equal(require(`../${assetRoot}/vendor/chartjs/chart.umd.min.js`).version,'4.5.1');
const code=readFileSync(`${assetRoot}/js/admin-charts.js`,'utf8');
assert(!/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\s*\(/.test(code));
const valid={labels:['10:00','10:10'],datasets:[{label:'CPU',data:[.22,.28]}],locale:'en-US',format:{style:'percent',maximumFractionDigits:0}};
function fixture(type='line',data=valid,{missing=false,raw=false,library=true,fail=false}={}) {
  const messages=new Map(['[data-chart-error]','[data-chart-empty]','[data-chart-fallback]'].map(k=>[k,{hidden:k!=='[data-chart-fallback]'}]));
  const frame={hidden:true};
  const host={dataset:{},querySelectorAll:s=>s.split(', ').map(k=>messages.get(k))};
  const canvas={dataset:{uiChart:type,chartSource:'#data'},parentElement:frame,closest:s=>s==='[data-chart-panel]'?host:{lang:'en'}};
  const source={tagName:'SCRIPT',type:'application/json',textContent:raw?data:JSON.stringify(data)};
  let created=0,updated=0,destroyed=0,chart;
  class Chart {
    constructor(_canvas,config){if(fail)throw Error('canvas failure');this.config=config;this.data=config.data;this.options=config.options;chart=this;created++;}
    update(mode){assert.equal(mode,'none');updated++;}
    destroy(){destroyed++;chart=undefined;}
    static getChart(){return chart;}
  }
  const window={Chart:library?Chart:undefined};
  const context={window,Chart,Intl,document:{documentElement:{lang:'en'},getElementById:()=>missing?null:source,querySelectorAll:()=>[canvas]},getComputedStyle:()=>({fontFamily:'system-ui',getPropertyValue:()=> '#3b6c9d'})};
  vm.runInNewContext(code,context);
  return {host,frame,messages,canvas,source,window,get chart(){return chart},counts:()=>({created,updated,destroyed})};
}
for(const type of ['line','bar','doughnut','mini']) {
  const f=fixture(type);assert.equal(f.host.dataset.chartState,'ready');assert.equal(f.frame.hidden,false);
  assert.equal(f.chart.options.animation,false);assert.equal(f.chart.options.plugins.legend.display,false);
}
for(const data of [{labels:[],datasets:[]},{...valid,datasets:[{label:'CPU',data:[null,null]}]}])assert.equal(fixture('line',data).host.dataset.chartState,'empty');
assert.equal(fixture('line',{...valid,datasets:[{label:'CPU',data:[0,0]}]}).host.dataset.chartState,'ready');
assert.equal(fixture('doughnut',{...valid,datasets:[{label:'Storage',data:[0,0]}]}).host.dataset.chartState,'empty');
for(const f of [fixture('line',valid,{missing:true}),fixture('line','{broken',{raw:true}),fixture('line',valid,{library:false}),fixture('line',valid,{fail:true}),fixture('radar'),fixture('line',{...valid,datasets:[{label:'CPU',data:[1]}]}),fixture('line',{...valid,datasets:[{label:'CPU',data:['1','2']}]}),fixture('doughnut',{...valid,datasets:[{label:'Storage',data:[-1,2]}]}),fixture('line',{...valid,format:{style:'currency'}}),fixture('line',{...valid,datasets:Array(6).fill(valid.datasets[0])})]) {
  assert.equal(f.host.dataset.chartState,'error');assert.equal(f.messages.get('[data-chart-error]').hidden,false);assert.equal(f.frame.hidden,true);
}
const update=fixture();update.source.textContent=JSON.stringify({...valid,datasets:[{label:'CPU',data:[.4,.6]}]});
assert.equal(update.window.AdminCharts.refresh(update.canvas),true);assert.deepEqual(update.counts(),{created:1,updated:1,destroyed:0});
assert.equal(update.chart.data.datasets[0].data[1],.6);
update.source.textContent='{invalid';assert.equal(update.window.AdminCharts.refresh(update.canvas),false);
assert.equal(update.host.dataset.chartState,'stale');assert.equal(update.frame.hidden,false);assert.equal(update.chart.data.datasets[0].data[1],.6);
update.source.textContent=JSON.stringify({labels:[],datasets:[]});update.window.AdminCharts.refresh(update.canvas);
assert.equal(update.host.dataset.chartState,'empty');assert.equal(update.counts().destroyed,1);
const text='</script><img src=x onerror=alert(1)>';
const safe=fixture('line',{...valid,datasets:[{label:text,data:[.2,.3]}],options:{plugins:{evil:true}},__proto__:{polluted:true}});
assert.equal(safe.chart.data.datasets[0].label,text);assert.equal(safe.chart.options.plugins.evil,undefined);assert.equal({}.polluted,undefined);
assert.equal(safe.chart.options.plugins.tooltip.callbacks.label({dataset:{label:text},raw:.2}),text+': 20%');
const ja=fixture('line',{...valid,locale:'ja-JP',datasets:[{label:'CPU 使用率',data:[.22,.28]}]});
assert.equal(ja.chart.options.plugins.tooltip.callbacks.label({dataset:{label:'CPU 使用率'},raw:.28}),'CPU 使用率: 28%');
for(const [format,value,expected] of [[{maximumFractionDigits:0},1248,'1,248'],[{maximumFractionDigits:1},12.34,'12.3'],[{notation:'compact'},12000,'12K'],[{maximumFractionDigits:0,suffix:' GiB'},640,'640 GiB'],[{style:'unit',unit:'millisecond'},12,'12 ms']]) {
 const f=fixture('line',{...valid,format});assert.equal(f.chart.options.scales.y.ticks.callback(value),expected);
}
for(const name of readdirSync(pageRoot).filter(n=>n.endsWith('.html'))) {
 const html=readFileSync(`${pageRoot}/${name}`,'utf8'),hasCharts=['charts.html','dashboard.html'].includes(name);
 assert.equal(html.includes('src="../vendor/chartjs/chart.umd.min.js"'),hasCharts,name);
 assert.equal(html.includes('src="../js/admin-charts.js"'),hasCharts,name);
 if(hasCharts)for(const m of html.matchAll(/<script type="application\/json" id="([^"]+)">([\s\S]*?)<\/script>/g)) {
   if(m[1]==='error-chart-data'){assert.throws(()=>JSON.parse(m[2]));continue;}
   const data=JSON.parse(m[2]);assert(!m[2].includes('<'));assert(data.labels);assert(data.datasets);
 }
}
for(const file of ['LICENSE.md','COLOR-LICENSE.md'])assert.match(readFileSync(`${assetRoot}/vendor/chartjs/${file}`,'utf8'),/Permission is hereby granted/);
assert(readFileSync(`${assetRoot}/vendor/chartjs/chart.umd.min.js.map`,'utf8').includes('sourcesContent'));
const chartCss=readFileSync(`${assetRoot}/css/charts.css`,'utf8');
const luminance=hex=>hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
const ratio=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
for(const [block,surface] of [[chartCss.match(/:root\s*\{([^}]+)\}/)[1],'#ffffff'],[chartCss.match(/\[data-ui-theme="dark"\]\s*\{([^}]+)\}/)[1],'#20262e']]) {
 for(const match of block.matchAll(/--ui-chart-series-\d:(#[a-f0-9]{6})/g))assert(ratio(match[1],surface)>=3,'Chart line contrast');
 const bg=block.match(/--ui-chart-tooltip-bg:(#[a-f0-9]{6})/)[1],fg=block.match(/--ui-chart-tooltip-text:(#[a-f0-9]{6})/)[1];
 assert(ratio(bg,fg)>=4.5,'Tooltip text contrast');
}
for(const theme of ['sapphire-blue','garnet-red','aqua-ivory']) {
 const block=chartCss.match(new RegExp(`\\[data-ui-theme="${theme}"\\]\\s*\\{([^}]+)\\}`))?.[1];
 assert(block,`${theme} chart palette`);
 assert(ratio(block.match(/--ui-chart-tooltip-bg:(#[a-f0-9]{6})/)[1],'#f7f9fc')>=4.5,`${theme} tooltip text contrast`);
 for(const match of block.matchAll(/--ui-chart-series-\d:(#[a-f0-9]{6})/g))assert(ratio(match[1],'#ffffff')>=3,`${theme} chart line contrast`);
}
console.log('PASS: Chart.js 4.5.1, four types, empty/zero/null, malformed/missing source, unavailable library, isolated failure, instance update/stale retention, locale/formatting, safe options, optional loading, local licenses/map.');
