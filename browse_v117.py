from pathlib import Path
p=Path('project/app/src/main/assets')
hp,jp=p/'index.html',p/'app.js'
h=hp.read_text()
def H(a,b):
 global h
 assert a in h,a[:60]
 h=h.replace(a,b,1)
H('<div id="txGlobalHint" class="hint">','<div class="controls advancedSearch"><select id="globalCategory"><option value="">All categories</option></select><select id="globalStatus"><option value="all">All</option><option value="owned">Owned</option><option value="wanted">Wanted</option><option value="missing">Missing</option></select><select id="globalSort"><option value="name">Name A–Z</option><option value="nameDesc">Name Z–A</option><option value="category">Category</option><option value="recent">Recently changed</option></select></div>\n<div id="txGlobalHint" class="hint">')
H('<section id="globalList"></section>','<section id="globalList"></section><button id="globalMore" class="moreBtn">More results</button>')
H('<div class="toolbar"><button id="addItem">＋ Add item</button><button id="syncHere">⇄ Sync</button></div>','''<div class="toolbar"><button id="addItem">＋ Add item</button><button id="syncHere">⇄ Sync</button><button id="batchStart">☑ Select</button><button id="browserCsv">⬇ CSV</button></div>
<div id="batchBar" hidden><b id="batchCount">0 selected</b><button id="batchVisible">Select visible</button><button id="batchOwned">✓ Owned</button><button id="batchMissing">✕ Missing</button><button id="batchWanted">★ Wanted</button><button id="batchUnwanted">☆ Not wanted</button><button id="batchDone">Done</button></div>''')
H('<div class="stats"><div class="stat"><b id="allc">','<div class="controls" style="margin:8px 0;align-items:center"><select id="browserSort"><option value="name">Name A–Z</option><option value="nameDesc">Name Z–A</option><option value="owned">Owned first</option><option value="wanted">Wanted first</option><option value="recent">Recently changed</option></select><span id="browserShown" class="hint"></span></div>\n<div class="stats"><div class="stat"><b id="allc">')
H('<section id="list"></section>','<section id="list"></section><button id="browserMore" class="moreBtn">More items</button>')
H('</style>\n</head>','''.advancedSearch{margin:8px 0;flex-wrap:wrap}.advancedSearch select{flex:1;min-width:0}#batchBar{display:flex;flex-wrap:wrap;align-items:center;gap:5px;border:1px solid var(--gold);border-radius:10px;background:#292613;padding:7px;margin:8px 0}#batchBar[hidden]{display:none}#batchBar button{font-size:12px;padding:7px}.batch-selected{outline:3px solid var(--gold);outline-offset:-3px}
</style>
</head>''')
hp.write_text(h)
s=jp.read_text()
def J(a,b):
 global s
 assert a in s,a[:80]
 s=s.replace(a,b,1)
J('let itemView=localStorage.getItem("sw375-item-view")||"tiles";','''let itemView=localStorage.getItem("sw375-item-view")||"tiles";
let browserLimit=120,globalLimit=100,batchMode=false;
const batchSelected=new Set();
function sorted(rows,mode){
 const x=[...rows];x.sort((a,b)=>mode==='nameDesc'?-nameCompare(a,b):mode==='owned'?(Number(isOwned(b))-Number(isOwned(a))||nameCompare(a,b)):mode==='wanted'?(Number(!!b.wanted)-Number(!!a.wanted)||nameCompare(a,b)):mode==='recent'?(String(b.modifiedAt||'').localeCompare(String(a.modifiedAt||''))||nameCompare(a,b)):nameCompare(a,b));return x;
}
function batchStatus(){
 $('#batchBar').hidden=!batchMode;$('#batchStart').classList.toggle('on',batchMode);
 $('#batchCount').textContent=batchSelected.size+' '+(lang==='hu'?'kijelölve':lang==='de'?'ausgewählt':'selected');
 document.querySelectorAll('#list [data-item-id]').forEach(el=>el.classList.toggle('batch-selected',batchSelected.has(el.dataset.itemId)));
}
function batchDone(){batchMode=false;batchSelected.clear();render()}
function bulkApply(mode){
 const rows=A().filter(r=>batchSelected.has(r.id));if(!rows.length)return;
 if(!confirm((lang==='hu'?'Módosítod ezt a ':lang==='de'?'Ändern: ':'Change ')+rows.length+'?'))return;
 rows.forEach(r=>{if(mode==='owned'||mode==='missing'){r.owned=mode==='owned';r.count=mode==='owned'?Math.max(1,Number(r.count)||0):0;touch(r,['owned','count'])}
 else{r.wanted=mode==='wanted';touch(r,['wanted'])}});
 save();homeCounts();batchDone();
}
$('#batchStart').onclick=()=>{batchMode=!batchMode;batchSelected.clear();render()};
$('#batchDone').onclick=batchDone;
$('#batchVisible').onclick=()=>{document.querySelectorAll('#list [data-item-id]').forEach(el=>batchSelected.add(el.dataset.itemId));batchStatus()};
[['batchOwned','owned'],['batchMissing','missing'],['batchWanted','wanted'],['batchUnwanted','unwanted']].forEach(([id,k])=>$('#'+id).onclick=()=>bulkApply(k));
$('#browserMore').onclick=()=>{browserLimit+=120;render()};
$('#globalMore').onclick=()=>{globalLimit+=100;renderGlobal()};
$('#browserSort').onchange=()=>{browserLimit=120;render()};
['globalCategory','globalStatus','globalSort'].forEach(id=>$('#'+id).onchange=()=>{globalLimit=100;renderGlobal()});
$('#browserCsv').onclick=()=>csvExport('all',cat);
''')
J('const f=all.filter(r=>{','let f=all.filter(r=>{')
J('  const owned=all.filter(x=>x.owned||Number(x.count)>0).length;', '''  f=sorted(f,$('#browserSort').value);
  $('#browserShown').textContent=Math.min(f.length,browserLimit)+' / '+f.length;
  $('#browserMore').style.display=f.length>browserLimit?'block':'none';
  const visible=f.slice(0,browserLimit);
  const owned=all.filter(x=>x.owned||Number(x.count)>0).length;''')
J('$("#list").innerHTML=f.map(r=>','$("#list").innerHTML=visible.map(r=>')
J('hydrateAutoImages($("#browser"));updateItemView();','hydrateAutoImages($("#browser"));updateItemView();batchStatus();')
J('if(itemView!=="tiles")return null;','if(itemView!=="tiles"||batchMode)return null;')
J('tileList.addEventListener("pointerdown",e=>{','''tileList.addEventListener('click',e=>{if(!batchMode)return;const tile=e.target.closest('.item[data-item-id]');if(!tile)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();if(batchSelected.has(tile.dataset.itemId))batchSelected.delete(tile.dataset.itemId);else batchSelected.add(tile.dataset.itemId);batchStatus()},true);
tileList.addEventListener("pointerdown",e=>{''')
J('  if(q.length>=1){\n    for(const [c,a] of Object.entries(state.categories||{})){','''  const gc=$('#globalCategory').value,gs=$('#globalStatus').value,sort=$('#globalSort').value;
  if(q.length>=1){
    for(const [c,a] of Object.entries(state.categories||{})){
      if(gc&&c!==gc)continue;''')
J('...(r.aliases||[])].join(" ").toLowerCase();','...(r.aliases||[]),...(r.knownReleases||[])].join(" ").toLowerCase();')
J('  rows.sort((a,b)=>N(a.r).localeCompare(N(b.r),"hu"));','''  rows=rows.filter(x=>gs==='all'||(gs==='owned'&&isOwned(x.r))||(gs==='wanted'&&x.r.wanted)||(gs==='missing'&&!isOwned(x.r)));
  rows.sort((a,b)=>sort==='nameDesc'?-nameCompare(a.r,b.r):sort==='category'?(a.c.localeCompare(b.c)||nameCompare(a.r,b.r)):sort==='recent'?(String(b.r.modifiedAt||'').localeCompare(String(a.r.modifiedAt||''))||nameCompare(a.r,b.r)):nameCompare(a.r,b.r));
  $('#globalMore').style.display=rows.length>globalLimit?'block':'none';''')
J('rows.slice(0,200).map(({c,r})=>','rows.slice(0,globalLimit).map(({c,r})=>')
J('$("#globalQ").oninput=renderGlobal;','$("#globalQ").oninput=()=>{globalLimit=100;renderGlobal()};')
J('$("#q").oninput=render;','$("#q").oninput=()=>{browserLimit=120;render()};')
J('$("#factionFilter").onchange=render;','$("#factionFilter").onchange=()=>{browserLimit=120;render()};')
J('$("#speciesFilter").onchange=render;','$("#speciesFilter").onchange=()=>{browserLimit=120;render()};')
# Insert setup after dashboard_v117 has wrapped applyLanguageStatic.
setup=r'''
const dashboardLanguage=applyLanguageStatic;
applyLanguageStatic=function(){
 dashboardLanguage();
 const old=$('#globalCategory').value;
 $('#globalCategory').innerHTML='<option value="">'+E(lang==='hu'?'Minden kategória':lang==='de'?'Alle Kategorien':'All categories')+'</option>'+Object.entries(labels()).map(([c,n])=>'<option value="'+E(c)+'">'+E(n)+'</option>').join('');
 $('#globalCategory').value=old;
 const st=$('#globalStatus'),v=st.value;st.innerHTML=[['all',t('all')],['owned',t('owned')],['wanted',t('wanted')],['missing',t('missing')]].map(([k,n])=>'<option value="'+k+'">'+E(n)+'</option>').join('');st.value=v;
 $('#batchStart').textContent=lang==='hu'?'☑ Kijelölés':lang==='de'?'☑ Auswählen':'☑ Select';
 $('#batchVisible').textContent=lang==='hu'?'Láthatók kijelölése':'Select visible';
 $('#batchDone').textContent=lang==='hu'?'Kész':'Done';
 $('#batchOwned').textContent='✓ '+t('owned');$('#batchMissing').textContent='✕ '+t('missing');$('#batchWanted').textContent='★ '+t('wanted');
};
const originalEnter=enter;
enter=function(c){batchMode=false;batchSelected.clear();browserLimit=120;originalEnter(c)};
'''
J('$("#langSelect").onchange=e=>',setup+'\n$("#langSelect").onchange=e=>')
jp.write_text(s)
print('Bulk selection, paging, sorting and advanced global search applied')
