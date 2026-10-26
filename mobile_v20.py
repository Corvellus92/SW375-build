from pathlib import Path
import re

root = Path("project")
p = root / "app/src/main/assets/app.js"
htmlp = root / "app/src/main/assets/index.html"
gradlep = root / "app/build.gradle"
s = p.read_text(encoding="utf-8")

# Keep the existing list view untouched. In tiles, all child taps are
# handled in capture phase, before the old image/name inline click handlers.
old = '<article class="item" onclick="if(itemView===\'tiles\' && !event.target.closest(\'.pic,.name,.actions\'))details(\'\u0024{r.id}\')">'
assert old in s, "v1.9 tile markup missing"
new = '<article class="item \u0024{r.owned||Number(r.count)>0?"owned-tile":""}" data-item-id="\u0024{r.id}" onclick="if(itemView===\'tiles\')details(\'\u0024{r.id}\')">'
s = s.replace(old, new, 1)

needle = 'window.toggle=(id,k)=>'
assert needle in s
handlers = """
// Tile interactions: tap toggles Owned, hold (550 ms) opens edit.
let tilePress=null;
let tileSuppressClickUntil=0;
const tileList=$("#list");
function activeTile(e){
 if(itemView!=="tiles")return null;
 const tile=e.target.closest(".item[data-item-id]");
 return tile&&tileList.contains(tile)?tile:null;
}
function cancelTilePress(){
 if(tilePress){clearTimeout(tilePress.timer);tilePress=null;}
}
tileList.addEventListener("pointerdown",e=>{
 const tile=activeTile(e);
 if(!tile||e.button!==0)return;
 cancelTilePress();
 const press={id:tile.dataset.itemId,pointerId:e.pointerId,x:e.clientX,y:e.clientY,timer:null};
 tilePress=press;
 press.timer=setTimeout(()=>{
  if(tilePress!==press)return;
  tileSuppressClickUntil=Date.now()+1800;
  tilePress=null;
  window.details(press.id);
 },550);
},{passive:true});
tileList.addEventListener("pointermove",e=>{
 if(tilePress&&tilePress.pointerId===e.pointerId&&
 (Math.abs(e.clientX-tilePress.x)>12||Math.abs(e.clientY-tilePress.y)>12))
 cancelTilePress();
},{passive:true});
tileList.addEventListener("pointerup",cancelTilePress,{passive:true});
tileList.addEventListener("pointercancel",cancelTilePress,{passive:true});
tileList.addEventListener("pointerleave",cancelTilePress,{passive:true});
tileList.addEventListener("contextmenu",e=>{
 if(activeTile(e))e.preventDefault();
},true);
tileList.addEventListener("click",e=>{
 const tile=activeTile(e);
 if(!tile)return;
 e.preventDefault();
 e.stopPropagation();
 e.stopImmediatePropagation();
 if(Date.now()<tileSuppressClickUntil)return;
 window.toggle(tile.dataset.itemId,"owned");
},true);
"""
s = s.replace(needle, handlers + "\n" + needle, 1)
p.write_text(s,encoding="utf-8")

html=htmlp.read_text(encoding="utf-8")
assert "</head>" in html
html=html.replace("</head>", """
<style>
#list.tiles .item.owned-tile {
 border:2px solid #27c466 !important;
 box-shadow:0 0 0 1px rgba(39,196,102,.28);
 box-sizing:border-box;
}
#list.tiles .item {touch-action:pan-y;}
</style>
</head>""",1)
htmlp.write_text(html,encoding="utf-8")

gradle=gradlep.read_text(encoding="utf-8")
gradle=re.sub(r"versionCode\\s+\\d+", "versionCode 21", gradle)
gradle=re.sub(r'versionName\\s+"[^"]+"', 'versionName "1.10-tile-owned"', gradle)
gradlep.write_text(gradle,encoding="utf-8")
print("v1.10 tile gestures applied.")
