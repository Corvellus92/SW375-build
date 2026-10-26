from pathlib import Path
import json,re

root=Path("project/app/src/main/assets")
dp=root/"data.js"
jp=root/"app.js"
gp=Path("project/app/build.gradle")
prefix="window.SW375_V18_SEED="
raw=dp.read_text(encoding="utf-8")
assert raw.startswith(prefix)
d=json.loads(raw[len(prefix):].rstrip(";\n\r "))
assert d["masterVersion"]=="2026.10.26-audit-v1.12",d["masterVersion"]
d["masterVersion"]="2026.10.26-vintage-audit-v1.13"
d["sources"]["kenner1978_1985"]="https://www.rebelscum.com/ch-vint.asp"
d["sources"]["kenner1978_1985_secondary"]="https://www.actionfigure411.com/star-wars/kenner-vintage-collection-checklist.php"
cats=d["categories"]
allnames={x["entity"].casefold() for a in cats.values() for x in a}
added=[]

def add(cat,name,sub,release,notes="",aliases=(),species="Unknown / Other",factions=()):
 assert name.casefold() not in allnames,"duplicate "+name
 idx=len(added)+1
 record={
  "id":f"{cat[:3].upper()}-AUD113-{idx:03d}",
  "entity":name,"subcategory":sub,"owned":False,"wanted":False,
  "count":0,"quantity":0,"notes":notes,"localImage":"","imageUrl":"",
  "continuity":"Legends","media":[],"factions":list(factions),
  "aliases":list(aliases),"knownReleases":[release],
  "sourceKeys":["kenner1978_1985"],"verified":True,"category":cat,
  "factionSource":"Kenner vintage collector checklist",
  "species":species,"speciesSource":"Curated",
  "autoImageQuery":name+" Kenner vintage Star Wars 3.75"
 }
 cats[cat].append(record)
 added.append((cat,name))
 allnames.add(name.casefold())

# 1985 animated Droids series - physical Kenner 3.75-inch releases.
for name in ["Jann Tosh","Jord Dusat","Kea Moll","Kez-Iban","Sise Fromm","Thall Joben","Tig Fromm","Uncle Gundy","Vlix"]:
 note="Brazil-exclusive Glasslite issue" if name=="Vlix" else ""
 add("figures",name,"Droids (1985)", "Kenner Droids (1985)" if name!="Vlix" else "Glasslite Droids (Brazil, 1988)",notes=note)

# 1985 animated Ewoks series.
for name in ["Dulok Scout","Dulok Shaman","King Gorneesh","Urgah Lady Gorneesh"]:
 add("figures",name,"Ewoks (1985)","Kenner Ewoks (1985)")

# Missing original Kenner action figures (one entry per distinct character/role).
for name in ["Rebel Commander","Imperial Dignitary","Warok","A-Wing Pilot"]:
 add("figures",name,"Kenner Vintage (1978–1985)","Kenner Star Wars 3.75-inch vintage (1978–1985)")

# Vintage vehicles that are distinct from existing Rebel Transport Speeder,
# Ewok Battle Wagon, Desert Sail Skiff and One-Man Sand Skimmer.
add("vehicles","Rebel Transport","Légi / űr","Kenner The Empire Strikes Back Rebel Transport (1982)",
    aliases=("Rebel Transporter","GR-75 Medium Transport"))
add("vehicles","Ewok Woodland Wagon","Földi","Kenner Ewoks Woodland Wagon (1985)")
add("vehicles","Sand Skimmer","Földi","Kenner Star Wars Mini-Rigs Sand Skimmer",
    notes="Kenner vintage checklist; distinct from One-Man Sand Skimmer.")

# Kenner playsets - not mere variant duplicates of current generic environments.
add("playsets","Rebel Command Center","Playset","Kenner The Empire Strikes Back Rebel Command Center (1980)")
add("playsets","Jabba the Hutt Playset (Kenner 1983)","Playset",
    "Kenner Return of the Jedi Jabba the Hutt Playset (1983)",
    aliases=("Jabba the Hutt Throne Room vintage","Jabba's Throne Room Kenner"))

# Small accessories and vintage Ewoks playthings.
add("accessories","Ewok Family Hut","Kenner vintage","Kenner Ewoks Ewok Family Hut (1985)")
add("accessories","Ewok Fire Cart","Kenner vintage","Kenner Ewoks Ewok Fire Cart (1985)")
add("accessories","Kenner Survival Kit","Kenner vintage","Kenner Star Wars Survival Kit (1981)",
    aliases=("Survival Kit","Mail-Away Survival Kit"))

# Figure carrying cases are actual vintage products, not 12-inch role-play toys.
add("accessories","C-3PO Collector Case","Gyűjtőtok","Kenner C-3PO Collector Case (1983)")
add("accessories","Darth Vader Collector Case","Gyűjtőtok","Kenner Darth Vader Collector's Case (1980)")
add("accessories","Chewbacca Bandolier Strap","Gyűjtőtok","Kenner Chewbacca's Bandolier Strap (1983)")
add("accessories","Laser Rifle Carry Case","Gyűjtőtok","Kenner Laser Rifle Carry Case (1979)")

# Existing R2-D2 carrying case belongs with collector cases, not playsets.
m=[x for x in cats["playsets"] if x["entity"]=="R2-D2 Carry Case"]
assert len(m)==1
r2=m[0]
cats["playsets"].remove(r2)
r2["category"]="accessories"
r2["subcategory"]="Gyűjtőtok"
cats["accessories"].append(r2)

dp.write_text(prefix+json.dumps(d,ensure_ascii=False,separators=(",",":"))+";\n",encoding="utf-8")

js=jp.read_text(encoding="utf-8")
anchor="updateBundledCatalog();\n// Migrate the vintage Star Destroyer"
assert anchor in js
# updateBundledCatalog adds the reclassified case to the new category;
# merge existing user metadata and remove the old playset record.
new="""updateBundledCatalog();
// v1.13: preserve the R2-D2 Carry Case collection status when moving category.
if(!state.r2CaseMovedV113){
 const from=state.categories.playsets||[];
 const ix=from.findIndex(x=>x.entity==="R2-D2 Carry Case");
 if(ix>=0){
  const prev=from.splice(ix,1)[0];
  const to=state.categories.accessories||(state.categories.accessories=[]);
  const dest=to.find(x=>x.id===prev.id);
  if(dest){
   for(const key of ["owned","wanted","count","quantity","notes","note","localImage","imageUrl","modifiedAt"]){
    if(prev[key]!==undefined)dest[key]=deep(prev[key]);
   }
   dest.fieldUpdated={...(dest.fieldUpdated||{}),...(prev.fieldUpdated||{})};
  }else{
   prev.category="accessories";
   prev.subcategory="Gyűjtőtok";
   to.push(prev);
  }
 }
 state.r2CaseMovedV113=true;
}
// Migrate the vintage Star Destroyer"""
js=js.replace(anchor,new,1)
jp.write_text(js,encoding="utf-8")
gradle=gp.read_text(encoding="utf-8")
gradle=re.sub(r"versionCode\s+\d+","versionCode 24",gradle)
gradle=re.sub(r'versionName\s+"[^"]+"','versionName "1.13-vintage-kenner"',gradle)
gp.write_text(gradle,encoding="utf-8")
assert len(added)==29, len(added)
print("Vintage audit v1.13 added:",len(added))
print("Category totals:",{c:len(a) for c,a in cats.items()})
