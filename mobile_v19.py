from pathlib import Path
import re

root = Path("project")
html_path = root / "app/src/main/assets/index.html"
js_path = root / "app/src/main/assets/app.js"
gradle_path = root / "app/build.gradle"

html = html_path.read_text(encoding="utf-8")
assert '<section id="list"></section>' in html
html = html.replace(
    '<section id="list"></section>',
    '<div class="viewSwitcher"><button type="button" id="viewGrid">▦ Tiles</button><button type="button" id="viewList">☷ List</button></div><section id="list"></section>',
    1
)
css = """
<style>
.viewSwitcher{display:flex;gap:6px;justify-content:flex-end;margin:8px 0}
.viewSwitcher button{padding:8px 12px;border-radius:10px;font-size:13px;min-height:38px}
.viewSwitcher button.selected{background:#31405a;border-color:#82a8ef;color:#fff}
#list.tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}
#list.tiles .item{min-width:0;display:flex;flex-direction:column;margin:0;padding:5px;border-radius:10px;gap:5px;overflow:hidden}
#list.tiles .pic{height:auto;aspect-ratio:1/1;width:100%;border-radius:7px}
#list.tiles .pic img{object-fit:contain}
#list.tiles .name{font-size:11px;line-height:1.3;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;overflow-wrap:anywhere;min-height:29px}
#list.tiles .meta,#list.tiles .chips,#list.tiles .actions{display:none}
#list.tiles .item>div:nth-child(2){min-width:0}
@media(max-width:600px){
 main{padding:8px}.controls{gap:5px}.controls input,.controls select{min-width:0}
 .item{grid-template-columns:60px minmax(0,1fr);padding:7px;gap:7px}
 .item .pic{height:58px}
 dialog{width:calc(100vw - 12px);max-height:96dvh;padding:12px}
 dialog img{max-height:150px}
 #list.tiles{gap:5px}
 #list.tiles .item{padding:4px}
 #list.tiles .name{font-size:10.5px}
}
</style>
"""
html = html.replace("</head>", css + "</head>", 1)
html_path.write_text(html, encoding="utf-8")

js = js_path.read_text(encoding="utf-8")
assert "function render(){" in js
js = js.replace("function render(){", """
let itemView=localStorage.getItem("sw375-item-view")||"tiles";
function updateItemView(){
 const l=$("#list");if(!l)return;
 l.classList.toggle("tiles",itemView==="tiles");
 $("#viewGrid")?.classList.toggle("selected",itemView==="tiles");
 $("#viewList")?.classList.toggle("selected",itemView==="list");
}
$("#viewGrid").onclick=()=>{itemView="tiles";localStorage.setItem("sw375-item-view",itemView);updateItemView()};
$("#viewList").onclick=()=>{itemView="list";localStorage.setItem("sw375-item-view",itemView);updateItemView()};
function render(){""", 1)
assert '<article class="item"><div class="pic" onclick="details(' in js
js = js.replace(
    '<article class="item"><div class="pic" onclick="details(',
    '<article class="item" onclick="if(itemView===\'tiles\' && !event.target.closest(\'.pic,.name,.actions\'))details(\'\u0024{r.id}\')"><div class="pic" onclick="details(',
    1
)
# Update tile/list CSS after every item list render.
needle = '  $("#list").innerHTML=f.map(r=>'
assert needle in js
start = js.index(needle)
end = js.find("\n", start)
assert end != -1
js = js[:end] + "\n  updateItemView();" + js[end:]
js_path.write_text(js, encoding="utf-8")

gradle = gradle_path.read_text(encoding="utf-8")
gradle = re.sub(r"versionCode\s+\d+", "versionCode 20", gradle)
gradle = re.sub(r'versionName\s+"[^"]+"', 'versionName "1.9-mobile-grid"', gradle)
gradle_path.write_text(gradle, encoding="utf-8")
print("Mobile grid patch applied.")
