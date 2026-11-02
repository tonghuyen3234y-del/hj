// DOM state verification only: no browser, layout, canvas or WebGL rendering.
// node --experimental-vm-modules qa/verify-interactions.mjs /path/to/happy-dom/lib/index.js
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {fileURLToPath, pathToFileURL} from 'node:url';
const {Window}=await import(process.argv[2]?pathToFileURL(process.argv[2]).href:'happy-dom');
const root=fileURLToPath(new URL('../',import.meta.url));
let checks=0;
const engineStub=`export class DriveExperience extends EventTarget {
 constructor(host,nodes){super();this.host=host;this.nodes=nodes;this.auto=null;window.testEngine=this;window.testLoads=(window.testLoads||0)+1;}
 startEntryReveal(){this.dispatchEvent(new Event('introcomplete'));}
 setPaused(value){this.paused=value;}
 closeCard(){this.setPaused(false);this.dispatchEvent(new Event('nodeclosed'));}
 destroy(){this.destroyed=true;}
 navigateTo(id){this.destination=id;}
 toggleNight(){} toggleOverview(){} startTour(){this.auto={tour:true};}
}`;
async function page(route,{width=1280,reduced=false,memory=null}={}){
 const w=new Window({url:'http://huijie.local/'+route,settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});
 w.innerWidth=width;w.innerHeight=900;
 w.document.body.innerHTML='<div id="app"></div>';
 Object.defineProperty(w.document,'fonts',{value:{ready:Promise.resolve()}});
 w.requestAnimationFrame=()=>1;w.cancelAnimationFrame=()=>{};
 w.ResizeObserver=class{observe(){} disconnect(){}};
 w.IntersectionObserver=class{constructor(fn){this.fn=fn;}observe(target){this.fn([{target,isIntersecting:true}]);}unobserve(){}disconnect(){}};
 w.HTMLElement.prototype.getAnimations=()=>[];
 w.HTMLElement.prototype.scrollIntoView=()=>{};
 w.HTMLCanvasElement.prototype.getContext=()=>({});
 const media=new Map();
 w.matchMedia=query=>{if(!media.has(query)){const m=new w.EventTarget();m.media=query;m.matches=query.includes('max-width')?width<=760||reduced:query.includes('reduced-motion')?reduced:query.includes('pointer:fine');media.set(query,m);}return media.get(query);};
 w.changeMedia=(small,reduce)=>{w.innerWidth=small?390:1280;for(const [query,m] of media){const next=query.includes('max-width')?small||reduce:query.includes('reduced-motion')?reduce:m.matches;if(m.matches!==next){m.matches=next;m.dispatchEvent(new w.Event('change'));}}};
 const copied=[];Object.defineProperty(w.navigator,'clipboard',{configurable:true,value:{writeText:async text=>{copied.push(text);}}});
 if(memory)w.localStorage.setItem('huijie:preferred-mode',memory);
 const ctx=vm.createContext(w),modules=new Map();
 async function load(id){
  if(modules.has(id))return modules.get(id);
  const pathname=new URL(id).pathname;
  const source=pathname==='/vendor/town-engine.js'?engineStub:pathname==='/scene.js'?'export async function personalizeScene(){}':await readFile(root+pathname.slice(1),'utf8');
  const module=new vm.SourceTextModule(source,{context:ctx,identifier:id,initializeImportMeta(meta){meta.url=id;},importModuleDynamically:async(specifier,ref)=>{const child=await load(new URL(specifier,ref.identifier).href);if(child.status==='linked')await child.evaluate();return child;}});
  modules.set(id,module);await module.link((specifier,ref)=>load(new URL(specifier,ref.identifier).href));return module;
 }
 const main=await load('http://huijie.local/app.js');await main.evaluate();
 const flush=async()=>{for(let i=0;i<4;i++)await new Promise(resolve=>setTimeout(resolve,5));};await flush();
 const click=(selector,options={})=>{const el=typeof selector==='string'?w.document.querySelector(selector):selector;assert.ok(el,'Missing action '+selector);el.dispatchEvent(new w.MouseEvent('click',{bubbles:true,cancelable:true,button:0,...options}));return el;};
 return {w,d:w.document,click,copied,flush,close:async()=>{w.dispatchEvent(new w.Event('pagehide'));await w.happyDOM.close();}};
}
for(const lang of ['','en/'])for(const route of ['','home/','drive/','about/','projects/','resume/','writing/','contact/']){
 const p=await page(lang+route,{width:390,reduced:true});
 assert.equal(p.d.documentElement.lang,lang?'en':'zh-CN');
 assert.ok(p.d.querySelector('main'));assert.ok(p.d.querySelector('.lang-switch'));
 if(['home/','writing/'].includes(route)){
  assert.equal(p.d.querySelectorAll('.article-entry').length,4);
  for(const card of p.d.querySelectorAll('.article-entry')){const link=card.querySelector('h3 a');assert.equal(link.target,'_blank');assert.equal(card.querySelector('[data-copy]').dataset.copy,link.href);}
 }
 if(route==='drive/'){assert.equal(p.d.querySelector('.drive-fallback').hidden,false);assert.equal(p.d.querySelectorAll('.fallback-doors a').length,6);assert.equal(p.w.testLoads,undefined);}
 checks++;await p.close();
}
{
 const p=await page('home/');
 p.click('.copy-article');await p.flush();assert.equal(p.copied[0],'https://mp.weixin.qq.com/s/-7A6BenYm8seHDT0keUjEQ');assert.equal(p.d.querySelector('.copy-article').dataset.copied,'true');assert.ok(p.d.querySelector('.copy-result').textContent.includes('复制'));
 p.d.body.dataset.currentSection='writing';const language=p.click('.lang-switch',{ctrlKey:true});assert.equal(new URL(language.href).pathname,'/en/home/');assert.equal(new URL(language.href).hash,'#writing');
 p.click('[data-interest="2"]');assert.equal(p.d.querySelector('[data-interest="2"]').getAttribute('aria-pressed'),'true');assert.ok(p.d.querySelector('.interest-note').textContent.includes('文字'));
 const house=p.d.querySelector('[data-building="writing"]');house.dispatchEvent(new p.w.Event('focus'));assert.ok(house.classList.contains('is-active'));assert.ok(p.d.querySelector('[data-town-link="writing"]').classList.contains('is-active'));house.dispatchEvent(new p.w.Event('blur'));assert.ok(!house.classList.contains('is-active'));
 p.click('button[data-time="night"]');assert.equal(p.d.querySelector('.town-hero').dataset.time,'night');assert.equal(p.d.querySelector('.town-still-day').getAttribute('aria-hidden'),'true');p.w.document.dispatchEvent(new p.w.Event('visibilitychange'));assert.equal(p.d.querySelector('.town-hero').dataset.time,'night');
 checks+=5;await p.close();
}
{
 const p=await page('',{memory:'home'});assert.equal(p.d.querySelector('.remember-status').hidden,false);p.click('[data-choose]');assert.equal(p.d.querySelector('.remember-status').hidden,true);assert.equal(p.w.localStorage.getItem('huijie:preferred-mode'),'home');
 p.click('[data-mode="drive"]',{ctrlKey:true});assert.equal(p.w.localStorage.getItem('huijie:preferred-mode'),'home');assert.ok(!p.d.querySelector('[data-mode="drive"]').classList.contains('is-tearing'));
 p.d.querySelector('[data-mode="home"]').classList.add('is-tearing');p.w.dispatchEvent(new p.w.Event('pageshow'));assert.ok(!p.d.querySelector('[data-mode="home"]').classList.contains('is-tearing'));
 p.click('[data-clear]');assert.equal(p.w.localStorage.getItem('huijie:preferred-mode'),null);checks+=4;await p.close();
}
{
 const p=await page('contact/');Object.defineProperty(p.w.navigator,'clipboard',{value:{writeText:async()=>{throw Error('Clipboard denied');}}});p.click('[data-copy]');await p.flush();assert.ok(p.d.getElementById('toast').textContent.includes('慢变量AI'));checks++;await p.close();
}
{
 const p=await page('drive/');const e=p.w.testEngine;assert.ok(e);e.dispatchEvent(new p.w.Event('ready'));await p.flush();assert.equal(p.d.getElementById('drive-start').disabled,false);p.click('#drive-start');assert.equal(p.d.querySelector('.drive-hud').hidden,false);
 p.d.getElementById('drive-canvas').focus();e.dispatchEvent(new p.w.CustomEvent('nodeselected',{detail:{nodeId:'writing'}}));assert.equal(p.d.querySelector('.drive-dialog').hidden,false);assert.equal(p.d.querySelector('.drive-dialog').tagName,'ASIDE');assert.equal(p.d.querySelectorAll('.drive-dialog .article-entry').length,4);assert.equal(e.paused,true);
 p.w.dispatchEvent(new p.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(p.d.querySelector('.drive-dialog').hidden,true);assert.equal(e.paused,false);assert.equal(p.d.activeElement.id,'drive-canvas');
 e.dispatchEvent(new p.w.CustomEvent('nodeselected',{detail:{nodeId:'contact'}}));p.click('.drive-dialog [data-copy]');await p.flush();assert.equal(p.copied.at(-1),'慢变量AI');
 p.w.changeMedia(true,false);await p.flush();assert.equal(e.destroyed,true);assert.equal(p.d.querySelector('.drive-dialog').hidden,true);assert.equal(p.d.querySelector('.drive-fallback').hidden,false);
 p.w.changeMedia(false,false);await p.flush();assert.notEqual(p.w.testEngine,e);assert.equal(p.w.testLoads,2);
 p.w.changeMedia(false,true);await p.flush();assert.equal(p.w.testEngine.destroyed,true);assert.equal(p.d.querySelector('.drive-fallback h2').textContent,'用安静的方式，走进小镇');checks+=6;await p.close();
}
console.log(`Passed ${checks} DOM state scenarios; engine/observers/canvas were stubbed. Visual and WebGL checks are not covered.`);
