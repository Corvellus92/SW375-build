from pathlib import Path
import json, re

root = Path("project/app/src/main/assets")
dp, jp = root/"data.js", root/"app.js"
gp = Path("project/app/build.gradle")
raw = dp.read_text(encoding="utf-8")
prefix = "window.SW375_V18_SEED="
assert raw.startswith(prefix)
d = json.loads(raw[len(prefix):].rstrip(";\r\n "))
cats = d["categories"]
assert d.get("masterVersion") == "2026.10.26-audit-v1.11", d.get("masterVersion")
d["masterVersion"] = "2026.10.26-audit-v1.12"
d["sources"].update({
 "tvcChecklist": "https://www.rebelscum.com/ch-tvc.asp",
 "tvcCardMatrix": "https://www.jeditemplearchives.com/special-reports/the-vintage-collection-card-matrix/",
 "haslabCantina": "https://www.hasbropulse.com/eu/en/pages/G13025L00-pdp",
 "episode1Figures": "https://www.sandcrawler.com/SWB/hasbro-figures.html",
 "tvc2026": "https://www.jeditemplearchives.com/vintagecollection/",
 "kennerPlaysets": "https://www.mrvintagestarwars.com/kenner-the-empire-strikes-back-playsets-1980-1982/"
})
all_names = {r["entity"].casefold() for a in cats.values() for r in a}
added = []
def add(cat, name, sub, release, src, species="Unknown / Other", factions=(), aliases=()):
    assert name.casefold() not in all_names, "Duplicate " + name
    n = len(added)+1
    ident = f"{cat[:3].upper()}-AUD112-{n:03d}"
    rec = {
      "id": ident, "entity": name, "subcategory": sub,
      "owned": False, "wanted": False, "count": 0, "quantity": 0,
      "notes": "", "localImage": "", "imageUrl": "",
      "continuity": "Ismeretlen", "media": [],
      "factions": list(factions), "aliases": list(aliases),
      "knownReleases": [release], "sourceKeys": [src],
      "verified": True, "category": cat, "factionSource": "Collector checklist",
      "species": species, "speciesSource": "Curated",
      "autoImageQuery": name + " Star Wars Hasbro 3.75"
    }
    cats[cat].append(rec)
    all_names.add(name.casefold())
    added.append((cat, name))

add("figures", "Jocasta Nu", "Jedi", "The Vintage Collection (2012, Brian's Toys exclusive)", "tvcCardMatrix", "Human", ["Jedi"])
add("figures", "Dr. Evazan", "Cantina / Mos Eisley", "The Vintage Collection VC57 (2011)", "tvcChecklist", "Human")
add("figures", "Lobot", "Civil / politikus", "The Vintage Collection VC223 (2021); POTF2 (1998)", "tvcChecklist", "Human")
add("figures", "Ratts Tyerell", "Egyéb karakter", "The Vintage Collection VC77 with Pit Droid (2012)", "tvcChecklist", aliases=["Ratts Tyerell & Pit Droid"])
add("figures", "Ben Quadinaros", "Egyéb karakter", "The Vintage Collection VC81 with Otoga-222 (2012)", "tvcChecklist", "Toong")
add("figures", "Wuher", "Cantina / Mos Eisley", "The Vintage Collection HasLab Mos Eisley Cantina (2025)", "haslabCantina", "Human")
add("figures", "Imperial Remnant AT-RT Driver", "Empire", "The Vintage Collection VC396 (2026)", "tvc2026", "Human", ["Imperial Remnant"])
add("figures", "Clone Trooper Commander", "Clone", "The Vintage Collection VC404 (2026)", "tvc2026", "Human", ["Galactic Republic"])
add("figures", "Ody Mandrell", "Egyéb karakter", "Episode I Collection (1999) with Otoga-222", "episode1Figures")
add("figures", "Gasgano", "Egyéb karakter", "Episode I Collection (1999) with Pit Droid", "episode1Figures")
add("droids", "Otoga-222", "Szerviz / munkadroid", "Episode I Collection (1999); The Vintage Collection VC81 (2012)", "tvcChecklist", aliases=["Otoga 222"])
add("droids", "B1 Battle Droid Commander", "Harci", "The Vintage Collection VC414 (2026)", "tvc2026", factions=["Separatist"], aliases=["Battle Droid Commander"])

# Correct a genuine classification error: the Kenner 1980 Star Destroyer
# is a playset, not a 3.75-inch-scale vehicle.
matches = [r for r in cats["vehicles"] if r["entity"] == "Darth Vader’s Star Destroyer"]
assert len(matches) == 1
star = matches[0]
cats["vehicles"].remove(star)
star["category"] = "playsets"
star["subcategory"] = "Playset"
star["knownReleases"] = list(dict.fromkeys(star.get("knownReleases", [])+["Kenner Darth Vader's Star Destroyer Playset (1980)"]))
star["sourceKeys"] = list(dict.fromkeys(star.get("sourceKeys", [])+["kennerPlaysets"]))
cats["playsets"].append(star)

# Fix obviously airborne craft mistakenly filed as ground vehicles.
fixes = {
  "Ewok Glider": "Légi / űr",
  "First Order Short-Range Evacuation Vehicle": "Légi / űr",
  "Resistance Transport Pod": "Légi / űr",
  "Starspeeder 1000": "Légi / űr",
  "Starspeeder 3000": "Légi / űr"
}
for name, sub in fixes.items():
    m=[r for r in cats["vehicles"] if r["entity"]==name]
    assert len(m)==1, name
    m[0]["subcategory"]=sub

# Enrich existing characters rather than duplicating different releases
for cat,name,release in [
    ("droids", "IG-11", "The Vintage Collection VC388 IG-11 (Nevarro Marshal, 2026)"),
    ("figures", "General Veers", "The Vintage Collection VC392 (AT-AT Commander, 2026)"),
    ("figures", "Hera Syndulla", "The Vintage Collection VC410 (Rebels Season 1, 2026)")
]:
    m=[r for r in cats[cat] if r["entity"]==name]
    assert len(m)==1,name
    m[0]["knownReleases"]=list(dict.fromkeys(m[0].get("knownReleases",[])+[release]))

dp.write_text(prefix+json.dumps(d,ensure_ascii=False,separators=(",",":"))+";\n",encoding="utf-8")

js=jp.read_text(encoding="utf-8")
anchor = "updateBundledCatalog();\nsave();"
assert anchor in js
migration = """updateBundledCatalog();
// Migrate the vintage Star Destroyer playset without losing ownership/notes.
if(!state.starDestroyerMovedV112){
 const old=state.categories.vehicles||[];
 const ix=old.findIndex(x=>x.entity==="Darth Vader’s Star Destroyer");
 if(ix>=0){
  const prev=old.splice(ix,1)[0];
  const arr=state.categories.playsets||(state.categories.playsets=[]);
  const existing=arr.find(x=>x.id===prev.id);
  if(existing){
   for(const key of ["owned","wanted","count","quantity","notes","note","localImage","imageUrl","contribute","shareImage","contributionNote","modifiedAt"]){
    if(prev[key]!==undefined)existing[key]=deep(prev[key]);
   }
   existing.fieldUpdated={...(existing.fieldUpdated||{}),...(prev.fieldUpdated||{})};
  }else{
   prev.category="playsets";
   prev.subcategory="Playset";
   arr.push(prev);
  }
 }
 state.starDestroyerMovedV112=true;
}
save();"""
js=js.replace(anchor,migration,1)
jp.write_text(js,encoding="utf-8")

gradle=gp.read_text(encoding="utf-8")
gradle=re.sub(r"versionCode\s+\d+","versionCode 23",gradle)
gradle=re.sub(r'versionName\s+"[^"]+"','versionName "1.12-catalog-audit"',gradle)
gp.write_text(gradle,encoding="utf-8")
assert len(added)==12
print("Catalog v1.12", {c:len(a) for c,a in cats.items()}, "added:",added)
