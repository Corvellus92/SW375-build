from pathlib import Path
p=Path('project/app/src/main/assets')
hp,jp=p/'index.html',p/'app.js'
h=hp.read_text()
def H(a,b):
 global h
 assert a in h,a[:50]
 h=h.replace(a,b,1)
H('<section id="submenu"','''<section id="dashboard" class="screen">
<h2 id="dashTitle">Collection overview</h2>
<div class="stats"><div class="stat"><b id="dashTotal">0</b><span>Items</span></div><div class="stat"><b id="dashOwned">0</b><span>Owned</span></div><div class="stat"><b id="dashWanted">0</b><span>Wanted</span></div><div class="stat"><b id="dashCopies">0</b><span>Copies</span></div></div>
<div class="dashProgress"><b id="dashPercent"></b><div class="dashTrack"><span id="dashBar"></span></div></div>
<h3 id="dashByCategory">Categories</h3><div id="dashCategories"></div>
<h3 id="dashWishlistTitle">Wishlist</h3><input id="dashWishQ" placeholder="Search wishlist"><div id="dashWishlist"></div><button id="dashMore" class="moreBtn">More</button>
<div class="toolbar"><button id="dashCsvAll">⬇ CSV: All</button><button id="dashCsvOwned">⬇ CSV: Owned</button><button id="dashCsvWanted">⬇ CSV: Wishlist</button><button id="dashBackup">⬇ JSON backup</button></div>
</section>
<section id="submenu"''')
H('<button id="globalSearchBtn" class="cat globalSearchCard">','<button id="dashboardBtn" class="cat globalSearchCard"><span class="ico">📊</span><b id="txDashboard">Collection overview</b><small id="txDashboardDesc">Progress, wishlist and exports</small></button>\n<button id="globalSearchBtn" class="cat globalSearchCard">')
H('</style>\n</head>','''.dashProgress{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px;margin:10px 0}.dashTrack{height:12px;background:#202a36;border-radius:99px;overflow:hidden;margin-top:8px}.dashTrack span{display:block;height:100%;background:var(--ok);width:0}.dashRow{display:flex;width:100%;align-items:center;justify-content:space-between;gap:6px;margin:6px 0;padding:10px;text-align:left}.dashWish{display:flex;justify-content:space-between;gap:8px;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:9px;padding:8px;margin:5px 0}.dashWish b{font-size:13px}.dashWish small{display:block;color:var(--muted)}#dashWishQ{width:100%}.moreBtn{display:none;width:100%;margin:10px 0}#dashboard .toolbar button{font-size:12px}
</style>
</head>''')
hp.write_text(h)
s=jp.read_text()
def J(a,b):
 global s
 assert a in s,a[:60]
 s=s.replace(a,b,1)
J('["home","submenu","browser","globalSearch","community"].forEach','["home","dashboard","submenu","browser","globalSearch","community"].forEach')
J('else if(screen==="submenu"||screen==="globalSearch"||screen==="community")home();','else if(screen==="submenu"||screen==="dashboard"||screen==="globalSearch"||screen==="community")home();')
J('else if(screen==="globalSearch")globalSearch();else if(screen==="community")communityOpen()','else if(screen==="globalSearch")globalSearch();else if(screen==="dashboard")dashboardOpen();else if(screen==="community")communityOpen()')
J('$("#globalSearchBtn").onclick=globalSearch;','$("#dashboardBtn").onclick=dashboardOpen;$("#globalSearchBtn").onclick=globalSearch;')
J(' const version=S.masterVersion||"bundled";\n if(state.bundledCatalogVersion===version)return;', ' const version=S.masterVersion||"bundled";\n if(state.bundledCatalogVersion===version)return;\n const prevBundle=state.bundledCatalogVersion;')
J(' state.bundledCatalogVersion=version;\n state.masterVersion=version;', ' state.bundledCatalogVersion=version;\n if(!state.masterVersion||state.masterVersion===prevBundle||state.masterVersion==="bundled")state.masterVersion=version;')
dash=r'''
let wishLimit=50;
const isOwned=r=>!!(r.owned||Number(r.count)>0);
const nameCompare=(a,b)=>N(a).localeCompare(N(b),lang==='hu'?'hu':lang==='de'?'de':'en');
function dashboardOpen(){
 screen='dashboard';cat=null;sub=null;show('dashboard');$('#back').style.display='block';
 $('#title').textContent='3.75 COLLECTION · '+(lang==='hu'?'ÁTTEKINTÉS':lang==='de'?'ÜBERSICHT':'OVERVIEW');renderDashboard();
}
function dashboardItem(c,id){
 const r=(state.categories[c]||[]).find(x=>x.id===id);if(!r)return;
 cat=c;sub=ALL_SUB;screen='browser';show('browser');$('#back').style.display='block';$('#title').textContent='3.75 COLLECTION · '+(labels()[c]||c);fillFilters();$('#q').value=N(r);render();
}
function renderDashboard(){
 const all=Object.entries(state.categories||{}).flatMap(([c,arr])=>(arr||[]).map(r=>({c,r})));
 const owned=all.filter(x=>isOwned(x.r)),wish=all.filter(x=>x.r.wanted);
 const count=all.reduce((a,x)=>a+Math.max(0,Number(x.r.count)||0),0),pct=all.length?Math.round(100*owned.length/all.length):0;
 $('#dashTitle').textContent=lang==='hu'?'Gyűjtemény áttekintése':lang==='de'?'Sammlungsübersicht':'Collection overview';
 $('#dashByCategory').textContent=lang==='hu'?'Kategóriák':'Categories';$('#dashWishlistTitle').textContent=lang==='hu'?'Kívánságlista':'Wishlist';
 $('#dashTotal').textContent=all.length;$('#dashOwned').textContent=owned.length;$('#dashWanted').textContent=wish.length;$('#dashCopies').textContent=count;
 $('#dashPercent').textContent=pct+'% '+t('complete');$('#dashBar').style.width=pct+'%';
 $('#dashCategories').innerHTML=Object.keys(labels()).map(c=>{const a=state.categories[c]||[],n=a.filter(isOwned).length;return '<button class="dashRow" data-dash-cat="'+E(c)+'"><span>'+icon(c)+' '+E(labels()[c])+'</span><b>'+n+'/'+a.length+'</b></button>'}).join('');
 document.querySelectorAll('[data-dash-cat]').forEach(b=>b.onclick=()=>enter(b.dataset.dashCat));
 const q=$('#dashWishQ').value.trim().toLowerCase();
 const filtered=wish.filter(x=>!q||[N(x.r),x.r.subcategory,x.c,...(x.r.aliases||[])].join(' ').toLowerCase().includes(q)).sort((a,b)=>nameCompare(a.r,b.r));
 $('#dashMore').style.display=filtered.length>wishLimit?'block':'none';
 $('#dashWishlist').innerHTML=filtered.length?filtered.slice(0,wishLimit).map(({c,r})=>'<div class="dashWish"><div><b>'+E(N(r))+'</b><small>'+E(labels()[c]||c)+'</small></div><button data-wish-cat="'+E(c)+'" data-wish-id="'+E(r.id)+'">'+t('open')+'</button></div>').join(''):'<div class="hint">'+(lang==='hu'?'Nincs találat.':'No wishlist items.')+'</div>';
 document.querySelectorAll('[data-wish-id]').forEach(b=>b.onclick=()=>dashboardItem(b.dataset.wishCat,b.dataset.wishId));
}
$('#dashWishQ').oninput=()=>{wishLimit=50;renderDashboard()};
$('#dashMore').onclick=()=>{wishLimit+=50;renderDashboard()};
function csvCell(v){let s=Array.isArray(v)?v.join(' | '):String(v??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'}
function csvExport(mode='all',category=''){
 const rows=Object.entries(state.categories||{}).flatMap(([c,a])=>category&&c!==category?[]:(a||[]).filter(r=>mode==='all'||(mode==='owned'&&isOwned(r))||(mode==='wanted'&&r.wanted)).map(r=>({c,r})));
 rows.sort((a,b)=>a.c.localeCompare(b.c)||nameCompare(a.r,b.r));
 const data=[['Category','Name','Subcategory','Owned','Wanted','Quantity','Species','Factions','Releases','Notes','ID'],...rows.map(({c,r})=>[labels()[c]||c,N(r),r.subcategory||'',isOwned(r)?'Yes':'No',r.wanted?'Yes':'No',Number(r.count)||0,r.species||'',r.factions||[],r.knownReleases||[],r.note||'',r.id])];
 const blob=new Blob(['\uFEFF'+data.map(row=>row.map(csvCell).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='3.75_Collection_'+(category||'all')+'_'+mode+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
}
$('#dashCsvAll').onclick=()=>csvExport('all');$('#dashCsvOwned').onclick=()=>csvExport('owned');$('#dashCsvWanted').onclick=()=>csvExport('wanted');$('#dashBackup').onclick=()=>exp();
const baseLanguage=applyLanguageStatic;
applyLanguageStatic=function(){baseLanguage();$('#txDashboard').textContent=lang==='hu'?'Gyűjtemény áttekintése':lang==='de'?'Sammlungsübersicht':'Collection overview';$('#txDashboardDesc').textContent=lang==='hu'?'Statisztika, kívánságlista, export':lang==='de'?'Statistik, Wunschliste, Export':'Progress, wishlist and exports';};
'''
J('$("#langSelect").onchange=e=>',dash+'\n$("#langSelect").onchange=e=>')
jp.write_text(s)
print('Dashboard, wishlist, CSV and master-preservation applied')
