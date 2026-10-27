from pathlib import Path

root=Path("project/app/src/main/assets")
html=root/"index.html"
js=root/"app.js"
sw=root/"sw.js"
manifest=root/"manifest.json"

s=html.read_text(encoding="utf-8")
assert 'id="desktopNav"' not in s
desktop_css=r"""
<style id="desktop-v118">
/* Desktop-first enhancement; mobile layout is deliberately unchanged. */
@media(min-width:900px){
 body{background:radial-gradient(ellipse at 50% -150px,#17263c 0,#080b10 45%) fixed}
 header{padding:0 24px;box-shadow:0 4px 24px #0006}
 header .title{max-width:1500px;margin:auto;min-height:66px;gap:14px}
 header h1{font-size:22px;letter-spacing:.065em}
 main{max-width:1500px;padding:26px 28px 72px}
 #home.home{grid-template-columns:repeat(4,minmax(0,1fr));gap:17px}
 #subgrid.home{grid-template-columns:repeat(5,minmax(0,1fr));gap:15px}
 .globalSearchCard{grid-column:span 2;min-height:112px}
 .cat{min-height:170px;border-radius:17px;transition:transform .16s,border-color .16s,background .16s}
 .cat:hover{transform:translateY(-2px);border-color:#526a94;background:#1a2434}
 .cat .ico{font-size:45px}
 #list.tiles{grid-template-columns:repeat(6,minmax(0,1fr));gap:13px}
 #list.tiles .item{padding:10px;gap:9px;border-radius:14px}
 #list.tiles .name{font-size:13px;min-height:36px}
 #list:not(.tiles){display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
 #list:not(.tiles) .item{margin:0}
 #globalList{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
 #globalList .item{margin:0}
 #dashboard .stats,#browser .stats{grid-template-columns:repeat(4,1fr);gap:14px}
 #dashboard .stat,#browser .stat{padding:18px;font-size:13px}
 #dashboard .stat b,#browser .stat b{font-size:26px}
 #dashCategories{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px 15px}
 #dashWishlist{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px 15px}
 #dashboard .dashWish{margin:0}
 .controls input{min-width:250px}
 dialog{width:min(90vw,760px);max-height:90vh;padding:24px}
 .toolbar{gap:10px;margin:14px 0}
 .toolbar button,.controls button{padding:11px 15px}
}
@media(min-width:1200px){#list.tiles{grid-template-columns:repeat(7,minmax(0,1fr))}}
@media(min-width:1550px){#list.tiles{grid-template-columns:repeat(8,minmax(0,1fr))}}
#desktopNav{display:none}
@media(min-width:900px){
 #desktopNav{display:flex;align-items:center;gap:8px;max-width:1500px;margin:0 auto;padding:0 0 11px}
 #desktopNav button{background:transparent;border-color:transparent;color:#b9c5d9;border-radius:9px;padding:9px 14px;font-size:13px;font-weight:650}
 #desktopNav button:hover,#desktopNav button[aria-current="page"]{background:#233047;border-color:#425a81;color:#f1c40f}
 #desktopNav .desktopNavRight{margin-left:auto;display:flex;align-items:center;gap:8px}
 #desktopNav .desktopNavRight button{border-color:#38445a}
 #desktopNav .desktopNavRight button:first-child{color:#8fdf9d}
}
@media(min-width:900px) and (max-width:1150px){#desktopNav button{padding:8px 9px;font-size:12px}}
#desktopWelcome{display:none}
@media(min-width:900px){
 #desktopWelcome{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px 26px;margin:0 0 22px;background:linear-gradient(100deg,#1b2941,#121a29);border:1px solid #2d3d59;border-radius:18px}
 #desktopWelcome h2{font-size:24px;margin:0 0 5px;color:#f1c40f}
 #desktopWelcome p{margin:0;color:#acb8c9;font-size:13px}
 #desktopWelcome .welcomePill{white-space:nowrap;background:#0f1826;border:1px solid #395374;border-radius:999px;padding:9px 16px;color:#9ce7a6;font-weight:700}
}
button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid #f1c40f;outline-offset:2px}
</style>
"""
assert "</head>" in s
s=s.replace("</head>",desktop_css+"</head>",1)
assert '<main>' in s
nav=r"""
<nav id="desktopNav" aria-label="Desktop navigation">
<button type="button" data-desktop-route="home" aria-current="page">⌂ <span data-nav-tx="home">Kezdőlap</span></button>
<button type="button" data-desktop-route="dashboard">▥ <span data-nav-tx="dashboard">Áttekintés</span></button>
<button type="button" data-desktop-route="globalSearch">⌕ <span data-nav-tx="search">Keresés</span> <small>Ctrl+K</small></button>
<button type="button" data-desktop-route="community">⇄ <span data-nav-tx="community">Közösség / Master</span></button>
<div class="desktopNavRight">
<button type="button" id="desktopBackup" title="Ctrl+Shift+S">⬇ <span data-nav-tx="backup">Biztonsági mentés</span></button>
<button type="button" id="desktopSync">⟳ <span data-nav-tx="sync">Szinkron</span></button>
</div>
</nav>
"""
s=s.replace("</header>","</header>",1) if False else s
s=s.replace("</div></header>","</div>"+nav+"</header>",1)
s=s.replace("<main>","""<main>
<section id="desktopWelcome" aria-label="Desktop overview">
<div><h2 id="desktopWelcomeTitle">STAR WARS · 3.75 COLLECTION</h2><p id="desktopWelcomeDesc">Teljes gyűjtemény • keresés • listák • mentés és szinkron</p></div>
<div class="welcomePill" id="desktopCatalogCount">1 257 tétel</div>
</section>
""",1)
html.write_text(s,encoding="utf-8")

j=js.read_text(encoding="utf-8")
assert 'desktopNavV118' not in j
j+=r"""

// desktopNavV118: desktop navigation, keyboard controls, and quick backup.
(function(){
 const nav=document.querySelector('#desktopNav');
 if(!nav)return;
 const navButtons=[...nav.querySelectorAll('[data-desktop-route]')];
 const labels={
  hu:{home:'Kezdőlap',dashboard:'Áttekintés',search:'Keresés',community:'Közösség / Master',backup:'Biztonsági mentés',sync:'Szinkron',desc:'Teljes gyűjtemény • keresés • listák • mentés és szinkron',items:'tétel'},
  en:{home:'Home',dashboard:'Overview',search:'Search',community:'Community / Master',backup:'Backup',sync:'Sync',desc:'Complete catalog • search • lists • backup and sync',items:'items'},
  de:{home:'Startseite',dashboard:'Übersicht',search:'Suche',community:'Community / Master',backup:'Sicherung',sync:'Sync',desc:'Gesamtkatalog • Suche • Listen • Backup und Sync',items:'Einträge'}
 };
 function updateNav(){
  const t=labels[lang]||labels.en;
  document.querySelectorAll('[data-nav-tx]').forEach(x=>x.textContent=t[x.dataset.navTx]||x.dataset.navTx);
  document.querySelector('#desktopWelcomeDesc').textContent=t.desc;
  const total=Object.values(state.categories||{}).reduce((n,arr)=>n+(arr||[]).length,0);
  document.querySelector('#desktopCatalogCount').textContent=total.toLocaleString(lang==='hu'?'hu-HU':lang==='de'?'de-DE':'en-US')+' '+t.items;
  const selected=screen==='browser'||screen==='submenu'?'home':screen;
  navButtons.forEach(b=>{if(b.dataset.desktopRoute===selected)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  document.querySelector('#desktopWelcome').style.display=screen==='home'?'':'none';
 }
 function route(name){
  if(name==='home')home();
  else if(name==='dashboard')dashboardOpen();
  else if(name==='globalSearch')globalSearch();
  else if(name==='community')communityOpen();
  updateNav();
 }
 navButtons.forEach(b=>b.addEventListener('click',()=>route(b.dataset.desktopRoute)));
 document.querySelector('#desktopBackup').addEventListener('click',()=>exp());
 document.querySelector('#desktopSync').addEventListener('click',()=>syncOpen());
 const originalShow=show;
 show=function(id){originalShow(id);queueMicrotask(updateNav)};
 const originalLang=document.querySelector('#langSelect').onchange;
 document.querySelector('#langSelect').onchange=function(e){originalLang.call(this,e);updateNav()};
 document.addEventListener('keydown',function(e){
  const target=e.target;
  const typing=target instanceof HTMLElement&&(target.matches('input,textarea,select')||target.isContentEditable);
  const dlgOpen=!!document.querySelector('dialog[open]');
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){
   e.preventDefault();if(dlgOpen)return;
   if(screen!=='globalSearch')route('globalSearch');
   document.querySelector('#globalQ').focus();document.querySelector('#globalQ').select();
   return;
  }
  if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key.toLowerCase()==='s'){
   e.preventDefault();exp();return;
  }
  if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key.toLowerCase()==='d'){
   e.preventDefault();if(!dlgOpen)route('dashboard');return;
  }
  if(e.key==='/'&&!typing&&!dlgOpen&&!e.ctrlKey&&!e.altKey&&!e.metaKey){
   e.preventDefault();if(screen!=='globalSearch')route('globalSearch');
   document.querySelector('#globalQ').focus();return;
  }
  if(e.altKey&&e.key==='ArrowLeft'&&!dlgOpen){e.preventDefault();back();return}
  if(e.key==='Escape'&&!dlgOpen&&screen!=='home'&&!typing){back()}
 });
 updateNav();
})();
"""
js.write_text(j,encoding="utf-8")
# Avoid stale GitHub Pages versions after updates: network-first for HTML and scripts.
sw.write_text("""const CACHE='sw375-desktop-v118';
const FILES=['./','./index.html','./app.js','./data.js','./manifest.json'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)))});
self.addEventListener('activate',e=>e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))])));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 e.respondWith(fetch(e.request).then(response=>{if(response.ok&&new URL(e.request.url).origin===self.location.origin){const copy=response.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return response}).catch(()=>caches.match(e.request)))
});
""",encoding="utf-8")
print('Desktop web v1.18 applied: desktop nav, responsive grid, keyboard, network-first service worker')
