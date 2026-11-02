import { initMotion } from './motion.js';
import {renderTown, initTown} from './town.js';
import { personalizeScene } from './scene.js';
import { profile as p, buildings, words } from './content.js';
const ROOT = new URL('./', import.meta.url);
const relativePath = location.pathname.slice(ROOT.pathname.length).replace(/^\/+|\/+$/g, '');
const parts = relativePath.split('/').filter(Boolean);
const lang = parts[0] === 'en' ? 'en' : 'zh';
const route = (lang === 'en' ? parts[1] : parts[0]) || 'entrance';
const t = words[lang];
const L = value => typeof value === 'object' && value !== null ? (value[lang] || value.zh || value.en || '') : (value ?? '');
const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const url = (path = '', language = lang) => { const target = new URL((language === 'en' ? 'en/' : '') + path, ROOT); return target.pathname + target.hash; };
const home = (anchor = '') => url('home/') + (anchor ? '#' + anchor : '');
const activeRoute = ['about','projects','writing','resume','contact'].includes(route) ? route : 'home';
const year = new Date().getFullYear();
const paragraphs = texts => texts.map(s => `<p>${esc(s)}</p>`).join('');
const stamp = (extra = '') => `<button type="button" class="stamp ${extra}" data-stamp aria-label="${lang==='zh'?'慧洁的印章，点击盖章':'Huijie’s stamp. Click to stamp again'}"><span>${lang==='zh'?'慧洁':'Huijie'}</span><b>HJ.</b></button>`;
const halftone = (text, cls = '') => `<span class="halftone ${cls}" data-halftone="${esc(text)}"><span class="halftone-fallback">${esc(text)}</span><canvas aria-hidden="true"></canvas></span>`;
const arrow = '<span aria-hidden="true">↗</span>';
const sectionHead = (id, english, title, index, link = '') => `<div class="section-heading"><div><div class="eyebrow">${english}</div><h2><sup>${index}</sup>${esc(title)}</h2></div>${link ? `<a class="text-link" href="${url(id+'/')}">${esc(link)} ${arrow}</a>` : ''}</div>`;
function header() {
  const nav = ['', 'drive/', 'home/', 'home/#about', 'home/#projects', 'home/#writing', 'home/#resume', 'home/#contact'];
  return `<header class="site-header"><a class="brand" href="${url()}" aria-label="Huijie's Space"><span class="brand-mark">HJ.</span><span>Huijie's Space</span></a><nav aria-label="${lang==='zh'?'主导航':'Main navigation'}">${nav.map((href,i)=>`<a ${i===1?'class="desktop-only"':''} href="${url(href)}" ${((i===0&&route==='entrance')||(i===1&&route==='drive')||(i===2&&route==='home'))?'aria-current="page"':''}>${t.nav[i]}</a>`).join('')}<a class="lang-switch" href="${url(route==='entrance'?'':route+'/',lang==='zh'?'en':'zh')}${location.hash}" lang="${lang==='zh'?'en':'zh-CN'}">${t.switch}</a></nav></header>`;
}
function footer() {
  return `<footer class="site-footer"><div class="footer-row"><div class="colophon"><b>${t.colophon}</b><span>${t.imprint}</span><span>${t.craft}</span><span>© ${year} Huijie Li</span></div><div class="footer-right"><span>Stay curious. Keep creating.</span><a href="#" class="text-link">${t.backTop} ↑</a></div></div><div class="footer-wordmark" aria-hidden="true">${halftone('Huijie’s Space')}</div></footer>`;
}
function ticket(kind) {
  const drive = kind === 'drive';
  return `<a class="ticket ${drive?'ticket-forest desktop-only':'ticket-paper'}" href="${url(drive?'drive/':'home/')}" data-mode="${kind}"><span class="ticket-main"><span class="ticket-top"><span>${drive?'TOWN HJ.':'DIRECT ROUTE'}</span><span class="ticket-no">NO.HJ.–0${drive?2:1}</span></span><strong>${drive?t.drive:t.direct}</strong><span class="ticket-description">${drive?t.driveDesc:t.directDesc}</span><span class="ticket-meta"><span>${t.station} /${drive?'DRIVE':'HOME'}/</span><span>${drive?'WASD':t.duration}</span><span>${drive?t.desktop:t.seat}</span></span><span class="ticket-cta">${drive?t.driveCta:t.directCta} →</span></span><span class="ticket-stub" aria-hidden="true"><span class="ticket-kind">${drive?t.driving:t.reading}</span><span class="barcode"></span><span class="stub-no">NO.HJ.–0${drive?2:1}</span></span></a>`;
}
function entrance() {
  return `<section class="gateway container"><div class="remember-status" hidden><span data-remember-label></span><a data-continue>${t.continue}</a><button data-choose>${t.choose}</button><button data-clear>${t.clear}</button></div><div class="gateway-intro"><div class="eyebrow">${t.gateKicker}</div><h1 class="gateway-title" aria-label="${esc(L(p.name))} HJ.">${halftone(lang==='zh'?'李慧洁 HJ.':'Huijie’s Space')}</h1><p>${t.gateIntro}</p></div><div class="ticket-grid">${ticket('home')}${ticket('drive')}</div><label class="remember-choice"><input type="checkbox" id="remember-choice">${t.remember}</label><div class="gateway-signoff">${lang==='zh'?p.sloganZh:p.slogan}</div></section>`;
}
function town(){return renderTown({buildings,p,t,lang});}
function aboutContent(full = false) {
  return `<div class="about-grid"><div class="about-copy">${paragraphs(L(p.about))}<p class="serif about-motto">${p.slogan}</p>${full?'':`<a class="button button-outline" href="${url('about/')}">${t.aboutLink} ${arrow}</a>`}</div><div class="curiosity-card"><span class="mono">FIELD NOTES / HJ.</span><div class="curiosity-symbol" aria-hidden="true">✳</div><p>${lang==='zh'?'保持好奇<br>持续创造':'Stay curious.<br>Keep creating.'}</p><div class="interest-nodes">${(lang==='zh'?['AI 探索','创意实践','文字记录','独立思考']:['Explore AI','Create','Write','Think']).map((label,i)=>`<button class="interest-node" data-interest="${i}" aria-pressed="false"><small>0${i+1}</small>${label}</button>`).join('')}</div><p class="interest-note" aria-live="polite">${lang==='zh'?'点一个关键词，展开看看。':'Pick a note. Follow your curiosity.'}</p><span class="card-edition">${year} · AN OPEN-ENDED EXPLORATION</span></div></div>`;
}
function channelsContent() {
  return `<div class="idea-grid"><div class="idea-statement"><p class="serif">${lang==='zh'?'让好奇心<br>带路。':'Let curiosity<br>lead the way.'}</p><span class="mono">A LITTLE SPACE FOR WHAT’S NEXT</span></div><div class="idea-copy"><p>${esc(L(p.townIntro))}</p><div class="idea-tags">${L(p.keywords).map((k,i)=>`<span><small>0${i+1}</small>${esc(k)}</span>`).join('')}</div><p class="muted">${esc(L(p.role))}</p></div></div>`;
}
function safeExternal(value) {
  try { const target = new URL(value); return ['https:','http:'].includes(target.protocol) ? target.href : ''; } catch { return ''; }
}
function emptyContent(type) {
  const items=type==='resume'?p.experiences:p.projects;
  if(items.length){
    return `<div class="${type==='resume'?'experience-list':'project-list'}">${items.map((item,i)=>{
      const target=safeExternal(item.url);
      return `<article class="future-entry"><span class="mono">${String(i+1).padStart(2,'0')}${item.period?' / '+esc(L(item.period)):''}</span><h3>${esc(L(item.title))}</h3>${item.description?`<p>${esc(L(item.description))}</p>`:''}${target?`<a class="text-link" href="${esc(target)}" target="_blank" rel="noreferrer">${lang==='zh'?'查看':'View'} ↗</a>`:''}</article>`;
    }).join('')}</div>`;
  }
  if(type==='resume') return '<div class="archive-blank" aria-label="'+(lang==='zh'?'经历栏目，暂留空白':'Experience section, left blank')+'"><span class="archive-line"></span><span class="archive-line"></span><span class="archive-line"></span></div>';
  return `<div class="project-empty"><span class="project-corner mono">HJ. / OPEN WORKSHOP</span><div class="waiting-graphic" aria-hidden="true"><span></span><span></span><span></span></div><p class="serif">${t.empty}</p><span class="muted">${t.emptyEn}</span><span class="project-bottom mono">STAY CURIOUS. KEEP CREATING.</span></div>`;
}
function articleCards(compact=false){
 return `<div class="article-container ${compact?'article-container-compact':''}">${p.articles.map((article,index)=>`<article class="article-entry"><div class="article-meta"><span class="mono">NO. ${String(index+1).padStart(2,'0')}</span><span>${esc(L(article.platform))}</span></div><h3><a href="${esc(article.url)}" target="_blank" rel="noreferrer">${esc(L(article.title))}</a></h3><div class="article-actions"><a class="text-link" href="${esc(article.url)}" target="_blank" rel="noreferrer">${lang==='zh'?'阅读全文':'Read article'} ↗</a><button class="copy-article" data-copy="${esc(article.url)}">${lang==='zh'?'复制链接':'Copy link'} ⧉</button></div></article>`).join('')}</div>`;
}
function writingContent() {
  const pub=p.publication;
  return `<div class="publication"><div class="publication-cover"><div class="publication-top mono"><span>HJ. PRESS</span><span>AI & BEYOND</span></div><div class="publication-cover-title">${lang==='zh'?'慢变量<br><em>AI</em>':'Slow<br>Variables<em>AI & BEYOND</em>'}</div><div class="publication-bottom"><span>${lang==='zh'?'技术在加速，<br>思考不必赶路。':pub.slogan.en}</span><span class="cover-seal">慢<br>思</span></div></div><div class="publication-copy"><div class="eyebrow">${t.platform}</div><h3>${esc(lang==='zh'?pub.zh:pub.en)}</h3><p class="publication-role">${esc(L(pub.role))}</p><blockquote>${esc(L(pub.slogan))}</blockquote>${paragraphs(L(pub.intro))}<div class="publication-actions"><button class="button button-outline" data-copy="慢变量AI">${t.pubCopy} <span aria-hidden="true">⧉</span></button><span class="muted">${lang==='zh'?'在微信中搜索「慢变量AI」':'Search “慢变量AI” in WeChat'}</span></div></div></div><div class="writing-directions">${pub.directions.map((d,i)=>`<div class="direction"><span class="mono">0${i+1}</span><h3>${esc(d[lang][0])}</h3><p>${esc(d[lang][1])}</p></div>`).join('')}</div>${articleCards()}`;
}
function contactContent() {
  return `<div class="contact-grid"><div class="contact-intro"><h3>Let's<br><em>Connect.</em></h3>${paragraphs(L(p.contact))}</div><div class="postcard"><div class="postcard-top"><span class="mono">POST CARD / ${t.postcard}</span><span class="postmark" aria-hidden="true">HUIJIE’S SPACE<br>好奇小镇 · HJ.<br>✳ ${year} ✳</span></div><div class="postcard-body"><div class="letter"><p>${t.hello}</p><p>${t.cardLine1}<br>${t.cardLine2}</p><p class="letter-signature">${t.cardFrom}</p></div><div class="postcard-address">${stamp()}<span class="mono">${t.sendTo}</span><strong>${esc(L(p.nickname))} / HJ.</strong><span>${t.platform}</span><button class="publication-address" data-copy="慢变量AI"><span>慢变量AI</span><small>${t.pubCopy} ⧉</small></button></div></div></div></div>`;
}
function homePage() {
  return `<section class="home-hero container"><div class="hero-copy"><div class="eyebrow">${t.heroKicker}</div><div class="hero-title-wrap"><h1 class="display-title" aria-label="${esc(L(p.name))}">${halftone(lang==='zh'?'李慧洁':'Huijie')}${halftone(lang==='zh'?'HJ.':'Li')}</h1>${stamp('hero-stamp')}</div><p class="hero-intro">${t.heroIntro}</p><p class="hero-slogan">${lang==='zh'?p.sloganZh:p.slogan}</p><div class="button-row"><a class="button button-primary desktop-only" href="${url('drive/')}">${t.driveCta} ${arrow}</a><a class="button button-outline" href="#contact">${t.connect} ${arrow}</a></div></div>${town()}</section><div class="marquee" aria-hidden="true"><div>${Array.from({length:4},()=>`<span>AI</span><i>✳</i><span>AGENTS</span><i>✳</i><span>CURIOSITY</span><i>✳</i><span>CREATE</span><i>✳</i><span>THINK</span><i>✳</i><span>WRITE</span><i>✳</i><span class="beijing-clock"></span><i>✳</i>`).join('')}</div></div><div class="container home-sections"><section id="about" class="content-section reveal">${sectionHead('about','About',t.about,'01')}${aboutContent()}</section><section id="channels" class="content-section reveal">${sectionHead('channels','A space for ideas',t.channels,'02')}${channelsContent()}</section><section id="resume" class="content-section reveal">${sectionHead('resume','Experience',t.experience,'03',t.experienceLink)}${emptyContent('resume')}</section><section id="projects" class="content-section reveal">${sectionHead('projects','Projects',t.projects,'04',t.projectsLink)}${emptyContent('projects')}</section><section id="writing" class="content-section reveal">${sectionHead('writing','Writing',t.writing,'05',t.writingLink)}${writingContent()}</section><section id="contact" class="content-section reveal">${sectionHead('contact','Contact',t.contact,'06')}${contactContent()}</section></div>`;
}
function detailPage() {
  const renderers={about:()=>aboutContent(true), projects:()=>emptyContent('projects'), resume:()=>emptyContent('resume'), writing:writingContent, contact:contactContent};
  const titles={about:t.about, projects:t.projects, resume:t.experience, writing:t.writing, contact:t.contact};
  const english={about:'About',projects:'Projects',resume:'Experience',writing:'Writing',contact:'Contact'};
  return `<section class="detail-page container"><div class="detail-heading"><a class="back-link mono" href="${home()}">← ${t.backHome}</a><div class="eyebrow">${english[route]}</div><h1>${route==='about'?(lang==='zh'?'关于李慧洁':'About Huijie'):titles[route]}</h1></div>${renderers[route]()}</section>`;
}
function drivePage() {
  return `<section class="drive-shell"><div class="drive-stage" data-state="loading"><div class="drive-canvas" id="drive-canvas" tabindex="0" role="application" aria-label="${lang==='zh'?'好奇小镇驾驶场景，WASD 或方向键移动，E 查看，Esc 关闭':'Driving scene. WASD or arrows to move, E to visit, Escape to close'}"></div><div class="drive-masthead"><div><span class="mono">HJ. PRESS · A LITTLE WORLD OF MINE</span><h1>${esc(L(p.town))}</h1></div><a href="${home()}" class="drive-home">${t.backHome} ↗</a></div><div class="drive-intro"><div class="drive-intro-copy"><span class="mono">WELCOME TO HJ.’S LITTLE WORLD</span><h2>${esc(L(p.town))}</h2><p>${t.driveIntro}</p><span class="drive-loading-label">${t.loading}</span><button class="button button-primary" id="drive-start" disabled>${t.start} →</button></div></div><div class="drive-hud" hidden><div class="drive-help"><span>${t.drivingHint}</span><small>N ${lang==='zh'?'昼夜':'day/night'} · V ${lang==='zh'?'总览':'overview'}</small></div><div class="drive-actions"><button id="drive-night" aria-pressed="false">${t.nightToggle}</button><button id="drive-overview" aria-pressed="false">${t.overview}</button><button id="drive-tour" aria-pressed="false">${t.tour}</button></div><div class="speedometer"><b id="speed">0</b><span>km/h</span><small id="gear">${t.gearIdle}</small><small id="surface">${t.roads.road}</small></div><div class="drive-map"><div class="map-heading"><span>${lang==='zh'?'镇上走走':'AROUND TOWN'}</span><span id="discoveries">${t.discovered} 0 / 6</span></div><svg viewBox="-18 -13 36 27" aria-label="${lang==='zh'?'小镇地图':'Town map'}"><path class="map-road" d="M-10,-1 H10 Q13,-1 13,2 V6 Q13,9 10,9 H-11 Q-14,9 -14,6 V2 Q-14,-1 -10,-1Z"/><path class="map-path" d="M-9,-1V-4M-1,-1V-4M7,-1V-4M-9,9V6M-3,9V6M5,9V6"/>${buildings.map(b=>{const positions={about:[-9,-6],resume:[-1,-6],projects:[-9,5],writing:[-3,5],contact:[5,5],channels:[7,-6]};const[x,y]=positions[b.id];return `<g class="map-node" data-go="${b.id}" role="button" tabindex="0" aria-label="${esc(b[lang][0])}"><rect x="${x-1.8}" y="${y-1.4}" width="3.6" height="2.8" rx=".3"/><title>${esc(b[lang][0])}</title></g>`}).join('')}<g id="map-car"><circle r=".8"/><path d="M0,-1.2 L-.6,.5 H.6Z"/></g></svg><span id="map-hint">${t.mapHint}</span></div><div class="drive-prompt" role="status"></div></div><div class="drive-fallback" hidden><span class="eyebrow">Drive mode</span><h2></h2><p></p><div class="fallback-doors">${buildings.map(b=>`<a class="button button-outline" href="${home(b.id)}">${esc(b[lang][0])} ↗</a>`).join('')}</div><a class="text-link" href="${home()}">${t.backHome} ↗</a><button id="retry" hidden>${t.retry}</button></div></div><aside class="drive-dialog" hidden aria-label="${lang==='zh'?'小镇信息卡':'Town information card'}"><button class="dialog-close" aria-label="${t.close}">×</button><span class="eyebrow" data-panel-eyebrow></span><h2 data-panel-title></h2><div data-panel-body></div><a class="button button-primary" data-panel-link>${t.openPage} ↗</a><span class="dialog-stamp" aria-hidden="true">HJ.<br>VISITED</span></aside></section>`;
}
const known = ['entrance','home','drive','about','projects','resume','writing','contact'];
const page = route==='entrance'?entrance():route==='home'?homePage():route==='drive'?drivePage():known.includes(route)?detailPage():`<section class="container not-found"><h1>404</h1><p>${t.notFound}</p><a href="${home()}">${t.backHome} ↗</a></section>`;
document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
document.body.classList.toggle('is-drive',route==='drive');
document.title = `${route==='entrance'?(lang==='zh'?'入口':'Entrance'):route==='home'?L(p.name):route==='drive'?L(p.town):t.nav[{about:3,projects:4,writing:5,resume:6,contact:7}[route]]||'404'} | Huijie's Space`;
document.getElementById('app').innerHTML = `${header()}<div class="reading-progress" aria-hidden="true"></div><main id="main">${page}</main>${route==='drive'?'':footer()}<div id="toast" role="status" aria-live="polite"></div>`;

const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
initMotion();
function toast(message){const el=document.getElementById('toast');el.textContent=message;el.classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('visible'),2400);}
const copyTimers=new WeakMap();
document.addEventListener('click',async event=>{
 const button=event.target.closest('[data-copy]');if(!button)return;const value=button.dataset.copy;clearTimeout(copyTimers.get(button));
 try{await navigator.clipboard.writeText(value);button.dataset.copied='true';let label=button.querySelector('.copy-result');if(!label){label=document.createElement('span');label.className='copy-result';button.append(label);}label.textContent=t.copied;toast(t.copied);copyTimers.set(button,setTimeout(()=>{delete button.dataset.copied;label.remove();},1800));}
 catch{toast((lang==='zh'?'请手动复制：':'Copy manually: ')+value);}
});
document.querySelector('.lang-switch')?.addEventListener('click',event=>{const link=event.currentTarget,hash=route==='home'&&document.body.dataset.currentSection?'#'+document.body.dataset.currentSection:location.hash;link.href=url(route==='entrance'?'':route+'/',lang==='zh'?'en':'zh')+hash;});
window.addEventListener('hashchange',()=>{const link=document.querySelector('.lang-switch');if(link)link.href=url(route==='entrance'?'':route+'/',lang==='zh'?'en':'zh')+location.hash;});
if(location.hash)requestAnimationFrame(()=>document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({behavior:'instant'}));
function updateClock(){const time=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit'}).format(new Date());document.querySelectorAll('.beijing-clock').forEach(el=>el.textContent=(lang==='zh'?'北京时间 ':'BEIJING ')+time);}
updateClock();if(document.querySelector('.beijing-clock'))setInterval(updateClock,30000);
if(route==='entrance'){
 const storageKey='huijie:preferred-mode',status=document.querySelector('.remember-status'),checkbox=document.getElementById('remember-choice');let choosing=false,navigating=false;
 const read=()=>{try{return localStorage.getItem(storageKey);}catch{return null;}};
 const remove=()=>{try{localStorage.removeItem(storageKey);}catch{}};
 const show=()=>{const value=read();status.hidden=choosing||!['home','drive'].includes(value)||(value==='drive'&&innerWidth<761);if(!status.hidden){document.querySelector('[data-remember-label]').textContent=t.remembered+' · '+(value==='home'?t.direct:t.drive);document.querySelector('[data-continue]').href=url(value+'/');}};
 const reset=()=>{navigating=false;document.querySelectorAll('[data-mode]').forEach(link=>link.classList.remove('is-tearing'));};
 document.querySelector('[data-choose]').addEventListener('click',()=>{choosing=true;show();document.querySelector('[data-mode]').focus();});
 document.querySelector('[data-clear]').addEventListener('click',()=>{remove();choosing=false;checkbox.checked=false;show();});
 document.querySelectorAll('[data-mode]').forEach(link=>link.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  if(checkbox.checked){try{localStorage.setItem(storageKey,link.dataset.mode);}catch{}}else if(choosing)remove();
  if(reduced)return;event.preventDefault();if(navigating)return;navigating=true;link.classList.add('is-tearing');
  // Short, bounded delay allows the ticket stub to leave before native navigation.
  setTimeout(()=>location.assign(link.href),420);
 }));show();window.addEventListener('resize',show);window.addEventListener('pageshow',reset);reset();
}
if(route==='home')initTown();
if(route==='drive')initDrive();
async function loadEngine(){return import('./vendor/town-engine.js');}
function makeNodes(layout){return layout.map(b=>({...b,position:b.arrival,radius:b.arrival.radius,label:buildings.find(n=>n.id===b.id)[lang][0]}));}
async function initDrive(){
 const stage=document.querySelector('.drive-stage'),host=document.getElementById('drive-canvas'),panel=document.querySelector('.drive-dialog');
 const media=matchMedia('(max-width:760px), (prefers-reduced-motion: reduce)');const abort=new AbortController();
 let experience=null,ready=false,started=false,generation=0,timeout,lastFocus=null;
 const uiClose=(restore=false)=>{panel.hidden=true;document.body.classList.remove('card-open');if(restore){const target=lastFocus?.isConnected?lastFocus:host;target.focus({preventScroll:true});}lastFocus=null;};
 const close=()=>{uiClose(true);experience?.closeCard();};
 const stop=()=>{generation++;clearTimeout(timeout);ready=started=false;uiClose();experience?.destroy();experience=null;host.replaceChildren();};
 const fallback=(reason='error')=>{
  stop();stage.dataset.state='fallback';document.querySelector('.drive-intro').hidden=true;document.querySelector('.drive-hud').hidden=true;
  const box=document.querySelector('.drive-fallback');box.hidden=false;box.querySelector('h2').textContent=reason==='mobile'?t.mobileTitle:reason==='reduced'?t.reducedTitle:t.fallbackTitle;
  box.querySelector('p').textContent=reason==='mobile'?t.mobileDesc:reason==='reduced'?t.reducedDesc:t.fallbackDesc;document.getElementById('retry').hidden=reason!=='error';
 };
 const start=()=>{if(!ready||started||!experience)return;started=true;stage.dataset.state='starting';experience.startEntryReveal();document.querySelector('.drive-intro').hidden=true;};
 async function load(){
  if(media.matches){fallback(innerWidth<761?'mobile':'reduced');return;}
  stop();const token=generation;stage.dataset.state='loading';stage.classList.remove('is-night');document.querySelector('.drive-fallback').hidden=true;document.querySelector('.drive-intro').hidden=false;document.querySelector('.drive-hud').hidden=true;document.getElementById('drive-start').disabled=true;document.querySelector('.drive-loading-label').textContent=t.loading;
  try{
   const [engine,layout]=await Promise.all([loadEngine(),import('./vendor/world-layout.js')]);if(token!==generation||media.matches)return;
   const current=new engine.DriveExperience(host,makeNodes(layout.B));experience=current;
   timeout=setTimeout(()=>{if(!ready&&token===generation)fallback();},30000);
   current.addEventListener('ready',async()=>{
    if(token!==generation)return;
    try{await personalizeScene(current,engine,lang);if(token!==generation)return;clearTimeout(timeout);ready=true;stage.dataset.state='ready';document.querySelector('.drive-loading-label').textContent=t.ready;document.getElementById('drive-start').disabled=false;}
    catch(error){console.error('Town signs:',error);fallback();}
   },{once:true});
   current.addEventListener('unavailable',()=>{if(token===generation)fallback();});
   current.addEventListener('introcomplete',()=>{if(token!==generation)return;stage.dataset.state='running';document.querySelector('.drive-hud').hidden=false;host.focus({preventScroll:true});});
   current.addEventListener('nodeactive',event=>{const b=buildings.find(b=>b.id===event.detail.nodeId);document.querySelector('.drive-prompt').textContent=b?`${t.near} ${b[lang][0]} · ${t.viewHint}`:'';});
   current.addEventListener('nodeselected',event=>{
    const id=event.detail.nodeId,b=buildings.find(b=>b.id===id);document.querySelector('[data-panel-eyebrow]').textContent=`${t.visiting} · ${b[lang][1]}`;document.querySelector('[data-panel-title]').textContent=b[lang][0];
    const content={about:paragraphs(L(p.about)),resume:`<div class="dialog-empty" aria-label="${lang==='zh'?'经历暂留空白':'Experience left blank'}"></div>`,projects:`<p class="serif">${t.empty}</p>`,writing:`<blockquote>${esc(L(p.publication.slogan))}</blockquote>${articleCards(true)}`,contact:paragraphs(L(p.contact))+`<p>${t.platform} · 慢变量AI</p><button class="button button-outline" data-copy="慢变量AI">${t.pubCopy} ⧉</button>`,channels:`<p>${esc(L(p.townIntro))}</p><p>${L(p.keywords).map(esc).join(' · ')}</p>`};
    document.querySelector('[data-panel-body]').innerHTML=content[id];document.querySelector('[data-panel-link]').href=home(id);lastFocus=document.activeElement;panel.hidden=false;document.body.classList.add('card-open');
    current.setPaused(true);if(!current.auto?.tour)document.querySelector('.dialog-close').focus({preventScroll:true});
   });
   current.addEventListener('nodeclosed',()=>uiClose());
   current.addEventListener('telemetry',event=>{
    if(token!==generation)return;const d=event.detail;stage.classList.toggle('is-night',d.night);document.getElementById('speed').textContent=d.speed;document.getElementById('surface').textContent=t.roads[d.surface]||t.roads.road;
    document.getElementById('gear').textContent=d.braking?t.gearBrake:d.reverse?t.gearReverse:d.boosting&&d.speed?t.gearBoost:d.speed?t.gearDrive:t.gearIdle;
    document.getElementById('map-car').setAttribute('transform',`translate(${d.x},${d.z}) rotate(${-d.heading*180/Math.PI+180})`);document.getElementById('discoveries').textContent=`${t.discovered} ${d.discovered.length} / 6`;
    document.querySelectorAll('[data-go]').forEach(node=>node.classList.toggle('discovered',d.discovered.includes(node.dataset.go)));
    const night=document.getElementById('drive-night');night.textContent=d.night?t.dayToggle:t.nightToggle;night.setAttribute('aria-pressed',String(d.night));
    const overview=document.getElementById('drive-overview');overview.textContent=d.overview?t.carView:t.overview;overview.setAttribute('aria-pressed',String(d.overview));
    const tour=document.getElementById('drive-tour');tour.textContent=d.touring?t.takeWheel:t.tour;tour.setAttribute('aria-pressed',String(d.touring));
    document.getElementById('map-hint').textContent=d.touring?`${t.tourTo} ${d.destination} · ${lang==='zh'?'方向键接管':'arrows to take over'}`:d.overview?t.orbitHint:d.navigationHint?(lang==='zh'?d.navigationHint:'Obstacle ahead. Return to the street and try again.'):t.mapHint;
   });
  }catch(error){if(token===generation){console.error('Driving town:',error);fallback();}}
 }
 document.getElementById('drive-start').addEventListener('click',start,{signal:abort.signal});
 document.getElementById('retry').addEventListener('click',load,{signal:abort.signal});
 document.querySelector('.dialog-close').addEventListener('click',close,{signal:abort.signal});
 document.getElementById('drive-night').addEventListener('click',()=>experience?.toggleNight(),{signal:abort.signal});
 document.getElementById('drive-overview').addEventListener('click',()=>experience?.toggleOverview(),{signal:abort.signal});
 document.getElementById('drive-tour').addEventListener('click',()=>{close();experience?.startTour();},{signal:abort.signal});
 const go=id=>{if(!started||!experience)return;close();experience.navigateTo(id);};
 document.querySelectorAll('[data-go]').forEach(node=>{node.addEventListener('click',()=>go(node.dataset.go),{signal:abort.signal});node.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();go(node.dataset.go);}},{signal:abort.signal});});
 window.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!panel.hidden){event.preventDefault();close();return;}
  if(!started&&['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','enter',' '].includes(event.key.toLowerCase())&&!event.target.closest('a,button,input,textarea')){event.preventDefault();start();}
 },{signal:abort.signal});
 media.addEventListener('change',load);
 window.addEventListener('pagehide',()=>{abort.abort();media.removeEventListener('change',load);stop();},{once:true});
 load();
}

const interestNotes=lang==='zh'?['探索 AI 产品、智能体与技术创新。','用技术，把有趣的想法变成现实。','用文字，记录对科技与生活的观察。','保持好奇，慢慢形成自己的判断。']:['Exploring AI products, agents, and emerging technology.','Turning interesting ideas into things that work.','Writing about technology and everyday life.','Staying curious and taking time to form a perspective.'];
document.querySelectorAll('[data-interest]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-interest]').forEach(node=>node.setAttribute('aria-pressed',String(node===button)));document.querySelector('.interest-note').textContent=interestNotes[Number(button.dataset.interest)];}));
