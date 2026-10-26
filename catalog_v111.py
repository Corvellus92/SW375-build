from pathlib import Path
import json
import re

root = Path("project/app/src/main/assets")
data_file = root / "data.js"
js_file = root / "app.js"
gradle_file = Path("project/app/build.gradle")

raw = data_file.read_text(encoding="utf-8")
assert raw.startswith("window.SW375_V18_SEED=")
data = json.loads(raw.split("=", 1)[1].rstrip(";\r\n "))
data["masterVersion"] = "2026.10.26-audit-v1.11"
data["generated"] = "2026-10-26"
data["sources"]["audit2026"] = "https://www.jeditemplearchives.com/vintagecollection/"
data["sources"]["hasbroMosEisley"] = "https://www.hasbropulse.com/eu/en/product/star-wars-the-vintage-collection-mos-eisley-set/G32105L00"
data["sources"]["orray2026"] = "https://www.toyark.com/2026/03/25/star-wars-vintage-collection-orray-and-geonosian-picador-586070"
data["sources"]["hyperspaceRing"] = "https://www.rebelscum.com/tacobifighterring.asp"

def add(cat, ident, name, sub, species="Unknown / Other", factions=None, known=None, sources=None, aliases=None):
    arr = data["categories"][cat]
    assert not any(x["id"] == ident or x["entity"].casefold() == name.casefold() for x in arr), name
    arr.append({
        "id": ident, "entity": name, "subcategory": sub,
        "owned": False, "wanted": False, "count": 0,
        "quantity": 0, "notes": "", "localImage": "", "imageUrl": "",
        "continuity": "Ismeretlen", "media": [],
        "factions": factions or [], "aliases": aliases or [],
        "knownReleases": known or [], "sourceKeys": sources or ["audit2026"],
        "verified": True, "category": cat,
        "factionSource": "Verified collector catalog",
        "species": species, "speciesSource": "Curated",
        "autoImageQuery": name + " Star Wars Hasbro 3.75"
    })

add("figures","FIG-AUD26-001","Eleventh Brother","Inquisitorius","Unknown / Other",
    ["Inquisitorius","Empire"],["VC390: Eleventh Brother (2026)"])
add("figures","FIG-AUD26-002","Luuke Skywalker","Legends / EU","Human",
    [],["VC401: Luuke Skywalker (The Last Command, 2026)"])
add("figures","FIG-AUD26-003","Chalmun","Cantina / Mos Eisley","Wookiee",
    ["Wookiee"],["The Vintage Collection Mos Eisley 4-Pack (2026)"],["hasbroMosEisley"])
add("figures","FIG-AUD26-004","Arleil Schous","Cantina / Mos Eisley","Defel",
    [],["The Vintage Collection Mos Eisley 4-Pack (2026)"],["hasbroMosEisley"])
add("figures","FIG-AUD26-005","Poggle the Lesser","Szeparatista / Geonosis","Geonosian",
    ["Geonosian","Separatist"],["VC391: Poggle the Lesser (2026)"])
add("figures","FIG-AUD26-006","Imperial Snowtrooper Commander","Empire","Human",
    ["Empire","Imperial Trooper"],["VC394: Imperial Snowtrooper Commander (2026)"])
add("figures","FIG-AUD26-007","Imperial Remnant Snowtrooper","Empire","Human",
    ["Imperial Remnant"],["VC389: Imperial Remnant Snowtrooper (2026)"])
add("creatures","CRE-AUD26-001","Orray","Hátas / háziállat",
    known=["The Vintage Collection Orray & Geonosian Picador (2026)"],sources=["orray2026"])
add("creatures","CRE-AUD26-002","Rotta the Hutt","Karakter / értelmes lény","Hutt",
    ["Hutt Cartel"],["The Vintage Collection Rotta the Hutt (2026)"])
add("accessories","ACC-AUD26-001","Jedi Starfighter Hyperspace Ring","Jármű kiegészítő",
    known=["Obi-Wan's Starfighter & Hyperspace Ring (2007/2008)"],sources=["hyperspaceRing"],
    aliases=["Delta-7 Hyperspace Ring","Hyperdrive Ring","Hiperűr gyűrű"])

vehicles = {r["entity"]:r for r in data["categories"]["vehicles"]}
atat = vehicles["AT-AT"]
atat["aliases"] = list(dict.fromkeys(atat.get("aliases", []) + [
    "AT AT", "ATAT", "Imperial AT-AT", "All Terrain Armored Transport",
    "Birodalmi lépegető", "Imperial Walker"
]))
atat["knownReleases"] = list(dict.fromkeys(atat.get("knownReleases", []) + [
    "Kenner AT-AT (1981)", "Hasbro Power of the Force II AT-AT (1997)",
    "Hasbro Imperial AT-AT (2010)", "The Vintage Collection Imperial AT-AT (2013)"
]))
for name, sub in {
    "Naboo Royal Starship": "Légi / űr",
    "Republic Fighter Tank": "Földi",
    "Xanadu Blood": "Légi / űr",
    "Snowspeeder": "Légi / űr",
    "Republic Attack Dropship": "Légi / űr",
    "Mandalorian Assault Transport": "Légi / űr"
}.items():
    assert name in vehicles, name
    vehicles[name]["subcategory"] = sub

data_file.write_text("window.SW375_V18_SEED=" +
    json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")

js = js_file.read_text(encoding="utf-8")
old = 'const subLabel=s=>(SUBTX[s]&&SUBTX[s][lang])||s;'
assert old in js
js = js.replace(old, 'const ALL_SUB="__ALL__";\nconst subLabel=s=>s===ALL_SUB?(lang==="hu"?"Összes":lang==="de"?"Alle":"All"):(SUBTX[s]&&SUBTX[s][lang])||s;', 1)
old = 'function subs(){return[...new Set(A().map(x=>x.subcategory||"Egyéb"))].sort((a,b)=>a.localeCompare(b,lang==="de"?"de":lang==="hu"?"hu":"en"))}'
assert old in js
js = js.replace(old, 'function subs(){return[ALL_SUB,...[...new Set(A().map(x=>x.subcategory||"Egyéb"))].sort((a,b)=>a.localeCompare(b,lang==="de"?"de":lang==="hu"?"hu":"en"))]}', 1)
old = 'const a=A().filter(x=>(x.subcategory||"Egyéb")===s);'
assert old in js
js = js.replace(old, 'const a=s===ALL_SUB?A():A().filter(x=>(x.subcategory||"Egyéb")===s);', 1)
old = 'const all=A().filter(x=>(x.subcategory||"Egyéb")===sub);'
assert old in js
js = js.replace(old, 'const all=sub===ALL_SUB?A():A().filter(x=>(x.subcategory||"Egyéb")===sub);', 1)
old = 'const h=[N(r),r.subcategory,r.media,r.canon,r.note,r.species,...(r.factions||[])].join(" ").toLowerCase();'
assert old in js
js = js.replace(old, 'const h=[N(r),r.subcategory,r.media,r.canon,r.note,r.species,...(r.factions||[]),...(r.aliases||[]),...(r.knownReleases||[])].join(" ").toLowerCase();', 1)

# Add missing master records on upgrades without resetting user Owned/Wanted,
# quantities, images, notes, custom items, or explicitly deleted items.
needle = 'function save(){state.updatedAt=now();localStorage.setItem(KEY,JSON.stringify(state))}\nsave();'
assert needle in js
replacement = '''function save(){state.updatedAt=now();localStorage.setItem(KEY,JSON.stringify(state))}
function updateBundledCatalog(){
 const version=S.masterVersion||"bundled";
 if(state.bundledCatalogVersion===version)return;
 for(const [c,records] of Object.entries(S.categories||{})){
  if(!state.categories[c])state.categories[c]=[];
  const arr=state.categories[c];
  for(const base of records){
   const existing=arr.find(x=>x.id===base.id);
   if(existing){
    for(const field of ["subcategory","aliases","knownReleases","sourceKeys"]){
     if(base[field]!==undefined && !(existing.fieldUpdated||{})[field]){
      existing[field]=deep(base[field]);
      if(existing.masterFields)existing.masterFields[field]=deep(base[field]);
     }
    }
   }else if(!state.deleted[c+"::"+base.id]){
    const entry=deep(base);
    normalizeRecord(entry,state.updatedAt);
    arr.push(entry);
   }
  }
 }
 state.bundledCatalogVersion=version;
 state.masterVersion=version;
}
updateBundledCatalog();
save();'''
js = js.replace(needle, replacement, 1)
js_file.write_text(js, encoding="utf-8")

gradle = gradle_file.read_text(encoding="utf-8")
gradle = re.sub(r"versionCode\s+\d+", "versionCode 22", gradle)
gradle = re.sub(r'versionName\s+"[^"]+"', 'versionName "1.11-catalog-audit"', gradle)
gradle_file.write_text(gradle, encoding="utf-8")
print("Catalog audit patch complete:", {k:len(v) for k,v in data["categories"].items()})
