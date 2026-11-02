const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
const cleanups=[];
const fontFamily='Georgia, "Songti SC", "STSong", serif';
function mountTitle(element){
 const canvas=element.querySelector('canvas'),context=canvas.getContext('2d');
 let dots=[],width=0,height=0,pad=0,ratio=1,gap=4,frame=0,visible=false,settled=false,origin=0,last=0,resizeTimer;
 const pointer={x:-9999,y:-9999,active:false,time:0};
 function draw(){context.setTransform(ratio,0,0,ratio,0,0);context.clearRect(0,0,width+pad*2,height+pad*2);context.fillStyle='#171b16';context.beginPath();for(const dot of dots){context.moveTo(dot.x+dot.r,dot.y);context.arc(dot.x,dot.y,dot.r,0,Math.PI*2);}context.fill();}
 function tick(now){frame=0;if(!visible||document.hidden)return;if(!origin)origin=now;
  const dt=last?Math.min(2,(now-last)/16.67):1;last=now;let energy=0;
  const interact=pointer.active&&now-pointer.time<1000&&!reduceMotion.matches;
  for(const dot of dots){
   if(!settled&&now-origin<dot.delay)continue;
   let fx=(dot.ox-dot.x)*.058,fy=(dot.oy-dot.y)*.058;
   if(interact){const x=dot.x-pointer.x,y=dot.y-pointer.y,distance=Math.hypot(x,y),radius=Math.max(65,gap*18);if(distance<radius&&distance>.01){const strength=(1-distance/radius)**2*5.3;fx+=x/distance*strength;fy+=y/distance*strength;}}
   dot.vx=(dot.vx+fx*dt)*Math.pow(.81,dt);dot.vy=(dot.vy+fy*dt)*Math.pow(.81,dt);dot.x+=dot.vx*dt;dot.y+=dot.vy*dt;
   energy+=Math.abs(dot.vx)+Math.abs(dot.vy)+Math.hypot(dot.ox-dot.x,dot.oy-dot.y)*.1;
  }
  if(now-origin>1900)settled=true;draw();
  if(!settled||energy/Math.max(1,dots.length)>.007||interact)frame=requestAnimationFrame(tick);
 }
 const wake=()=>{if(!frame&&visible&&!document.hidden&&!reduceMotion.matches){last=0;frame=requestAnimationFrame(tick);}};
 function rebuild(){
  const next=Math.round(element.clientWidth);if(!next)return;
  width=next;const scratch=document.createElement('canvas'),ctx=scratch.getContext('2d',{willReadFrequently:true});ctx.font=`500 200px ${fontFamily}`;
  let size=Math.min(360,200*width/ctx.measureText(element.dataset.halftone).width);
  if(innerWidth<=760&&element.closest('.display-title'))size=Math.min(...[...element.parentElement.querySelectorAll('[data-halftone]')].map(item=>200*item.clientWidth/ctx.measureText(item.dataset.halftone).width));
  height=Math.ceil(size*1.19);pad=Math.max(28,Math.round(size*.27));gap=Math.max(3.2,Math.min(7.5,size/30));ratio=Math.min(devicePixelRatio||1,2);
  scratch.width=width*2;scratch.height=height*2;ctx.scale(2,2);ctx.font=`500 ${size}px ${fontFamily}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(element.dataset.halftone,width/2,height/2);
  const pixels=ctx.getImageData(0,0,scratch.width,scratch.height).data;dots=[];let row=0;
  for(let y=gap*.5;y<height;y+=gap*.866,row++)for(let x=gap*.5+(row%2?gap*.5:0);x<width;x+=gap){
   let alpha=0;for(const dx of [-.25,0,.25])for(const dy of [-.25,0,.25]){const px=Math.max(0,Math.min(scratch.width-1,Math.floor((x+dx*gap)*2))),py=Math.max(0,Math.min(scratch.height-1,Math.floor((y+dy*gap)*2)));alpha+=pixels[(py*scratch.width+px)*4+3]/(255*9);}
   if(alpha>.08){const ox=x+pad,oy=y+pad,noise=(Math.sin(x*16.1+y*33.7)+1)*.5;dots.push({ox,oy,x:settled||reduceMotion.matches?ox:ox+(noise-.5)*gap*14,y:settled||reduceMotion.matches?oy:oy+gap*(5+noise*5),vx:0,vy:0,r:gap*.56*Math.sqrt(alpha),delay:x/width*560+noise*120});}
  }
  canvas.width=Math.round((width+pad*2)*ratio);canvas.height=Math.round((height+pad*2)*ratio);
  Object.assign(canvas.style,{width:width+pad*2+'px',height:height+pad*2+'px',left:-pad+'px',top:-pad+'px'});element.style.height=height+'px';element.classList.add('is-drawn');origin=0;draw();wake();
 }
 const move=event=>{const rect=canvas.getBoundingClientRect();pointer.x=event.clientX-rect.left;pointer.y=event.clientY-rect.top;pointer.active=event.clientX>=rect.left&&event.clientX<=rect.right&&event.clientY>=rect.top&&event.clientY<=rect.bottom;pointer.time=performance.now();if(pointer.active)wake();};
 window.addEventListener('pointermove',move,{passive:true});window.addEventListener('pointerdown',move,{passive:true});
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake();else{cancelAnimationFrame(frame);frame=0;}});observer.observe(element);
 let previousWidth=0;const resize=new ResizeObserver(entries=>{const current=Math.round(entries[0].contentRect.width);if(current!==previousWidth){previousWidth=current;clearTimeout(resizeTimer);resizeTimer=setTimeout(rebuild,100);}});resize.observe(element);
 const onVisibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else wake();};document.addEventListener('visibilitychange',onVisibility);
 const onReduce=()=>{if(reduceMotion.matches){cancelAnimationFrame(frame);frame=0;dots.forEach(dot=>{dot.x=dot.ox;dot.y=dot.oy;dot.vx=dot.vy=0;});draw();}else wake();};reduceMotion.addEventListener('change',onReduce);
 rebuild();cleanups.push(()=>{cancelAnimationFrame(frame);clearTimeout(resizeTimer);observer.disconnect();resize.disconnect();window.removeEventListener('pointermove',move);window.removeEventListener('pointerdown',move);document.removeEventListener('visibilitychange',onVisibility);reduceMotion.removeEventListener('change',onReduce);});
}
export async function initMotion(){
 await document.fonts.ready;document.querySelectorAll('[data-halftone]').forEach(mountTitle);
 const header=document.querySelector('.site-header');const headerResize=new ResizeObserver(()=>{document.documentElement.style.setProperty('--nav-offset',(header.getBoundingClientRect().height+(innerWidth<=760?28:36))+'px');});if(header)headerResize.observe(header);cleanups.push(()=>headerResize.disconnect());
 document.documentElement.classList.add('motion-ready');
 const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');reveal.unobserve(entry.target);}}),{threshold:.09});
 document.querySelectorAll('.reveal,.direction,.article-entry,.interest-node').forEach((element,index)=>{element.classList.add('reveal-ready');element.style.setProperty('--reveal-delay',Math.min(index%4*75,225)+'ms');reveal.observe(element);});
 const stampObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){stamp(entry.target);stampObserver.unobserve(entry.target);}}),{threshold:.6});
 document.querySelectorAll('[data-stamp]').forEach(button=>{stampObserver.observe(button);button.addEventListener('click',()=>stamp(button));});
 const track=document.querySelector('.marquee>div');let marquee=track?.getAnimations()[0],hover=false,lastScroll=scrollY,currentRate=1,targetRate=1,rateFrame=0,rateUntil=0;
 function smoothRate(now){rateFrame=0;if(!marquee||reduceMotion.matches)return;if(now>rateUntil)targetRate=Math.sign(targetRate)||1;currentRate+=(targetRate-currentRate)*.09;marquee.playbackRate=currentRate;if(now<rateUntil||Math.abs(currentRate-targetRate)>.01)rateFrame=requestAnimationFrame(smoothRate);}
 const progress=()=>{const total=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty('--reading-progress',String(total>0?scrollY/total:0));document.querySelector('.site-header')?.classList.toggle('is-scrolled',scrollY>24);
  const delta=scrollY-lastScroll;lastScroll=scrollY;if(Math.abs(delta)>.5){targetRate=Math.sign(delta)*(1+Math.min(6,Math.abs(delta)*.13));rateUntil=performance.now()+150;if(!rateFrame&&!hover)rateFrame=requestAnimationFrame(smoothRate);}
  if(Math.abs(delta)<.5&&targetRate!==0)targetRate=Math.sign(targetRate);
  const sections=[...document.querySelectorAll('.content-section[id]')];const current=sections.filter(el=>el.getBoundingClientRect().top<160).at(-1);
  if(current)document.body.dataset.currentSection=current.id;else delete document.body.dataset.currentSection;
 };
 window.addEventListener('scroll',progress,{passive:true});window.addEventListener('resize',progress,{passive:true});progress();
 if(track){track.parentElement.addEventListener('pointerenter',()=>{hover=true;marquee?.pause();});track.parentElement.addEventListener('pointerleave',()=>{hover=false;if(!reduceMotion.matches){marquee?.play();if(!rateFrame)rateFrame=requestAnimationFrame(smoothRate);}});}
 document.querySelectorAll('.publication-cover').forEach(card=>{card.addEventListener('pointermove',event=>{if(reduceMotion.matches||!matchMedia('(pointer:fine)').matches)return;const rect=card.getBoundingClientRect();card.style.setProperty('--tilt-x',((.5-(event.clientY-rect.top)/rect.height)*7)+'deg');card.style.setProperty('--tilt-y',(((event.clientX-rect.left)/rect.width-.5)*9)+'deg');});card.addEventListener('pointerleave',()=>{card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');});});
 cleanups.push(()=>{reveal.disconnect();stampObserver.disconnect();cancelAnimationFrame(rateFrame);window.removeEventListener('scroll',progress);window.removeEventListener('resize',progress);});
 window.addEventListener('pagehide',()=>cleanups.forEach(fn=>fn()),{once:true});
 // A BFCache restore reconnects listeners and animations from a clean document.
 window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
}
export function stamp(button){button.classList.remove('stamping');void button.offsetWidth;button.classList.add('stamping');}
