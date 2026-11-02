import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { profile, buildings, words } from '../content.js';
import { beijingSeconds, townTimeMode, nextTownBoundary } from '../town.js';
import { townLayout } from '../assets/town/layout.js';
const root=fileURLToPath(new URL('../',import.meta.url));
for(const file of ['app.js','content.js','motion.js','town.js','scene.js','vendor/town-engine.js','vendor/world-layout.js']) execFileSync(process.execPath,['--check',root+file]);
assert.equal(buildings.length,6);
assert.equal(new Set(buildings.map(b=>b.id)).size,6);
for(const key of Object.keys(words.zh)) assert.ok(key in words.en,'Missing English translation: '+key);
for(const list of ['projects','experiences','links']) assert.equal(profile[list].length,0,'This local acceptance version must not fabricate '+list);
assert.equal(profile.articles.length,4);
assert.equal(new Set(profile.articles.map(a=>a.url)).size,4);
for(const article of profile.articles) {assert.ok(article.title.zh && article.title.en);assert.equal(new URL(article.url).hostname,'mp.weixin.qq.com');}
const articleIDs=['-7A6BenYm8seHDT0keUjEQ','yjDNopiw4RT6CGZwwFwl-Q','63wP56oHuWgKfjFgUZLOzA','TY5RQpJ6Zyw6dyVXN6H_3g'];
const articleTitles=['DeepSeek和MiniMax正面交锋：便宜的AI，真的更划算吗？','AI已经可以自主写代码，大学四年究竟应该学什么？','每天刷红果2小时，我们离《娱乐至死》还有多远？','DeepSeek让AI指挥AI，看完技术原文我反而后背发凉'];
profile.articles.forEach((article,index)=>{assert.equal(article.url,'https://mp.weixin.qq.com/s/'+articleIDs[index]);assert.equal(article.title.zh,articleTitles[index]);});
// Exact Beijing boundaries, including the next day's daylight transition.
for(const [seconds,mode,wait] of [[0,'night',21600],[21599,'night',1],[21600,'day',45000],[66599,'day',1],[66600,'night',41400],[86399,'night',21601]]){
 assert.equal(townTimeMode(seconds),mode);assert.equal(nextTownBoundary(seconds),wait);
}
assert.equal(beijingSeconds(new Date('2026-11-02T22:00:00Z')),21600);
assert.equal(beijingSeconds(new Date('2026-11-03T10:30:00Z')),66600);
for(const name of ['day','night']){
 const file=await readFile(root+'assets/town/'+name+'.png');
 assert.equal(file.subarray(1,4).toString(),'PNG');assert.equal(file.readUInt32BE(16),2000);assert.equal(file.readUInt32BE(20),1250);
}
for(const building of buildings){
 const region=townLayout[building.id];assert.ok(region.polygon.length>=3);
 for(const [x,y] of [...region.polygon,region.label])assert.ok(Number.isFinite(x)&&Number.isFinite(y)&&x>=0&&x<=1000&&y>=0&&y<=625);
}
const source=await readFile(root+'app.js','utf8');
const content=await readFile(root+'content.js','utf8');
assert.ok(!/泽轩|Telescope_8|zexuanw958|青灯墨屏|travel-plan-viz/.test(source+content),'Reference profile leaked into personal content');
assert.ok(!/mailto:|javascript:|href="#"\s+target/.test(source),'Unexpected fabricated contact or unsafe URL');
for(const model of ['town-base','town-buildings','town-props','drive-car']){
  const file=await readFile(root+'assets/models/'+model+'.glb');
  assert.equal(file.readUInt32LE(0),0x46546c67);
  assert.equal(file.readUInt32LE(8),file.length);
  const json=JSON.parse(file.subarray(20,20+file.readUInt32LE(12)).toString());
  assert.ok(json.meshes.length>0);
  assert.equal(json.images?.length||0,0,'Models should not require remote textures');
}
await import('./build.mjs');
const routes=['','home','drive','about','projects','resume','writing','contact','en','en/home','en/drive','en/about','en/projects','en/resume','en/writing','en/contact'];
for(const route of routes){
  const file=root+'dist/'+(route?route+'/':'')+'index.html';
  await access(file);
  const html=await readFile(file,'utf8');
  for(const [,href] of html.matchAll(/(?:src|href)="([^"#]+)"/g)) await access(fileURLToPath(new URL(href,new URL('file://'+file))));
  assert.ok(html.includes(route.startsWith('en')?'lang="en"':'lang="zh-CN"'));
}
console.log('Passed: JavaScript syntax, bilingual content, four exact article/title mappings, Beijing time boundaries, town images/hit regions, empty sections, profile isolation, four GLBs, and all 16 static routes.');
