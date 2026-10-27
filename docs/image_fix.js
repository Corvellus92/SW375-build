/* 3.75 Collection v1.19 - robust desktop image handling */
(function(){
'use strict';
const texts={
 hu:{url:'Közvetlen kép URL',apply:'Kép beállítása',search:'Kép keresése',retry:'Újrapróbálás',hint:'Ha nem tölt be automatikusan, tölts fel saját képet, vagy illessz be egy közvetlen .jpg/.png/.webp kép URL-t.',bad:'Érvényes https:// vagy http:// kép URL-t adj meg.'},
 en:{url:'Direct image URL',apply:'Set image',search:'Find image',retry:'Retry',hint:'If automatic images are unavailable, upload a photo or paste a direct .jpg/.png/.webp image URL.',bad:'Enter a valid https:// or http:// image URL.'},
 de:{url:'Direkte Bild-URL',apply:'Bild setzen',search:'Bild suchen',retry:'Erneut versuchen',hint:'Falls Bilder nicht automatisch laden, lade ein Foto hoch oder füge eine direkte Bild-URL ein.',bad:'Bitte eine gültige https:// oder http:// Bild-URL eingeben.'}
};
const T=()=>texts[typeof lang==='string'?lang:'hu']||texts.hu;
const failures=new Set(),busy=new Set();
const activeImage=(r)=>r.localImage||r.manualImageUrl||r.masterImage||r.masterFields?.masterImage||r.imageUrl||'';
function item(cat,id){return (state.categories[cat]||[]).find(x=>x.id===id)}
function placeholder(cat,id){
 const el=document.createElement('div');
 el.className='autoLoading';
 el.dataset.autoImg=id;
 el.dataset.autoCat=cat;
 const ph=document.createElement('span');
 ph.className='ph';ph.textContent=icon(cat);
 el.append(ph);
 return el;
}
function safeUrl(url){
 try{const u=new URL(url);return ['https:','http:','data:'].includes(u.protocol)}catch(_){return false}
}
function broken(img){
 const wrap=img.parentElement;
 if(!wrap)return;
 const cat=img.dataset.cat||'figures',id=img.dataset.item;
 const r=item(cat,id);
 const failedSrc=img.getAttribute('src')||'';
 if(r && r.imageUrl===failedSrc){r.imageUrl='';save()}
 failures.add(cat+'::'+id);
 const ph=placeholder(cat,id);
 ph.dataset.autoDisabled='1';
 wrap.replaceChildren(ph);
}
window.sw375ImageBroken=broken;
function imageHtmlFixed(r,c){
 const im=activeImage(r);
 if(im && safeUrl(im))return '<img loading="lazy" decoding="async" src="'+E(im)+'" data-item="'+E(r.id)+'" data-cat="'+E(c)+'" onerror="sw375ImageBroken(this)" alt="'+E(N(r))+'">';
 return '<div class="autoLoading" data-auto-img="'+E(r.id)+'" data-auto-cat="'+E(c)+'"><span class="ph">'+icon(c)+'</span></div>';
}
imageHtml=imageHtmlFixed;
function loadable(src){
 return new Promise(resolve=>{
  if(!safeUrl(src))return resolve(false);
  const img=new Image();let done=false;
  const timer=setTimeout(()=>finish(false),6500);
  function finish(ok){if(done)return;done=true;clearTimeout(timer);img.onload=null;img.onerror=null;resolve(ok)}
  img.onload=()=>finish(true);img.onerror=()=>finish(false);img.src=src;
 });
}
async function jsonApi(endpoint,params){
 const controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),6500);
 try{
  const u=new URL(endpoint);for(const [k,v] of Object.entries(params))u.searchParams.set(k,String(v));
  const response=await fetch(u.href,{signal:controller.signal,mode:'cors',cache:'default'});
  if(!response.ok)throw new Error('HTTP '+response.status);
  return await response.json();
 }finally{clearTimeout(timer)}
}
function titleMatches(title,entity){
 const q=entity.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 const t=title.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 const terms=q.split(' ').filter(x=>x.length>2);
 return terms.length>0 && terms.filter(x=>t.includes(x)).length>=Math.min(2,terms.length);
}
async function commonsCandidate(name){
 const data=await jsonApi('https://commons.wikimedia.org/w/api.php',{
  action:'query',generator:'search',gsrsearch:'Star Wars '+name,
  gsrnamespace:6,gsrlimit:6,prop:'imageinfo',iiprop:'url|mime',iiurlwidth:500,format:'json',origin:'*'
 });
 const pages=Object.values(data?.query?.pages||{}).sort((a,b)=>(a.index||99)-(b.index||99));
 for(const p of pages){
  const i=p.imageinfo?.[0];if(!i)continue;
  if(!String(i.mime||'').startsWith('image/'))continue;
  if(!titleMatches(p.title||'',name))continue;
  if(i.thumburl||i.url)return i.thumburl||i.url;
 }
 return null;
}
async function wikipediaCandidate(name){
 const data=await jsonApi('https://en.wikipedia.org/w/api.php',{
  action:'query',generator:'search',gsrsearch:'Star Wars '+name,
  gsrnamespace:0,gsrlimit:4,prop:'pageimages',piprop:'thumbnail',
  pithumbsize:500,format:'json',origin:'*'
 });
 const pages=Object.values(data?.query?.pages||{}).sort((a,b)=>(a.index||99)-(b.index||99));
 for(const p of pages){
  if(p.thumbnail?.source&&titleMatches(p.title||'',name))return p.thumbnail.source;
 }
 return null;
}
async function autoFixed(cat,id){
 const key=cat+'::'+id;
 if(failures.has(key)||busy.has(key))return;
 const r=item(cat,id);if(!r||activeImage(r))return;
 busy.add(key);
 try{
  const name=N(r);
  let url=null;
  try{url=await commonsCandidate(name)}catch(_){}
  if(!url)try{url=await wikipediaCandidate(name)}catch(_){}
  if(!url||!await loadable(url))throw new Error('no verified image');
  if(!item(cat,id)||activeImage(r))return;
  r.imageUrl=url;r.imageSource='Wikimedia Commons / Wikipedia';save();
  document.querySelectorAll('[data-auto-img]').forEach(el=>{
   if(el.dataset.autoImg!==id||el.dataset.autoCat!==cat)return;
   const img=document.createElement('img');
   img.loading='lazy';img.decoding='async';img.src=url;img.alt=N(r);
   img.dataset.item=id;img.dataset.cat=cat;img.onerror=()=>broken(img);
   el.replaceWith(img);
  });
 }catch(_){failures.add(key)}
 finally{busy.delete(key)}
}
fetchAutoImage=autoFixed;
hydrateAutoImages=function(root=document){
 const els=[...root.querySelectorAll('[data-auto-img]:not([data-auto-disabled])')].slice(0,18);
 let i=0;
 function next(){
  if(i>=els.length)return;
  const el=els[i++];autoFixed(el.dataset.autoCat,el.dataset.autoImg).finally(()=>setTimeout(next,120));
 }
 next();next();
};
function refresh(){
 if(screen==='browser')render();
 else if(screen==='globalSearch')renderGlobal();
 else if(screen==='home')home();
}
function updateDialog(){
 const r=Object.values(state.categories).flat().find(x=>x.id===cur);
 if(!r)return;
 const input=document.getElementById('swImageUrl');
 if(input)input.value=r.manualImageUrl||'';
 const im=activeImage(r),img=document.getElementById('dimg');
 if(img){img.onerror=()=>{img.style.display='none'};img.src=im||'';img.style.display=im?'block':'none'}
}
const dlg=document.getElementById('dlg');
if(dlg){
 const box=document.createElement('div');
 box.className='field';
 box.id='swImageTools';
 box.style.cssText='border:1px solid var(--line);padding:10px;border-radius:9px;margin:10px 0';
 box.innerHTML='<label id="swImageLabel"></label><input id="swImageUrl" type="url" style="width:100%;margin-bottom:7px" placeholder="https://.../photo.jpg"><div class="toolbar"><button type="button" id="swImageApply"></button><button type="button" id="swImageSearch"></button><button type="button" id="swImageRetry"></button></div><small id="swImageHint" style="color:var(--muted)"></small>';
 const pick=document.getElementById('pickimg');
 pick?.parentElement?.insertAdjacentElement('afterend',box);
 function translate(){
  document.getElementById('swImageLabel').textContent=T().url;
  document.getElementById('swImageApply').textContent='✓ '+T().apply;
  document.getElementById('swImageSearch').textContent='🔎 '+T().search;
  document.getElementById('swImageRetry').textContent='⟳ '+T().retry;
  document.getElementById('swImageHint').textContent=T().hint;
 }
 translate();
 document.getElementById('langSelect')?.addEventListener('change',translate);
 document.getElementById('swImageApply').onclick=async()=>{
  const r=Object.values(state.categories).flat().find(x=>x.id===cur);if(!r)return;
  const url=document.getElementById('swImageUrl').value.trim();
  if(url&&!safeUrl(url)){alert(T().bad);return}
  if(url&&!await loadable(url)){alert(T().bad+' (A kép nem tölthető be.)');return}
  r.manualImageUrl=url;r.localImage='';r.imageUrl='';
  touch(r,['manualImageUrl','localImage','imageUrl']);save();updateDialog();refresh();
 };
 document.getElementById('swImageSearch').onclick=()=>{
  const r=Object.values(state.categories).flat().find(x=>x.id===cur);
  if(r)window.open('https://www.google.com/search?tbm=isch&q='+encodeURIComponent('Star Wars 3.75 Hasbro '+N(r)),'_blank','noopener,noreferrer');
 };
 document.getElementById('swImageRetry').onclick=()=>{
  const r=Object.values(state.categories).flat().find(x=>x.id===cur);if(!r)return;
  const key=Object.entries(state.categories).find(([c,a])=>a.some(x=>x.id===cur))?.[0]+'::'+cur;
  failures.delete(key);r.imageUrl='';save();updateDialog();refresh();
 };
 dlg.addEventListener('close',refresh);
 dlg.addEventListener('click',e=>{if(e.target===dlg)return;});
 const originalDetails=window.details;
 window.details=function(id){originalDetails(id);updateDialog();translate()};
}
})();
