from pathlib import Path
import json,re

root=Path("project/app/src/main/assets")
dp=root/"data.js"
gp=Path("project/app/build.gradle")
prefix="window.SW375_V18_SEED="
raw=dp.read_text(encoding="utf-8")
assert raw.startswith(prefix)
d=json.loads(raw[len(prefix):].rstrip(";\r\n "))
assert d["masterVersion"]=="2026.10.27-potj-saga-otc-v1.15",d["masterVersion"]
d["masterVersion"]="2026.10.27-rots-tsc-audit-v1.16"
d["sources"].update({
 "rots2005":"https://www.rebelscum.com/ch-rots.asp",
 "saga2006":"https://www.rebelscum.com/ch-tsc.asp",
 "saga2006extra":"https://www.rebelscum.com/TSC065elite.asp"
})
cats=d["categories"]
allnames={x["entity"].casefold() for arr in cats.values() for x in arr}
added=[]

def add(cat,name,sub,release,src,aliases=(),species="Unknown / Other",factions=(),note=""):
 assert name.casefold() not in allnames, "duplicate "+name
 ident=f"{cat[:3].upper()}-AUD116-{len(added)+1:03d}"
 rec={
  "id":ident,"entity":name,"subcategory":sub,"owned":False,"wanted":False,
  "count":0,"quantity":0,"notes":note,"localImage":"","imageUrl":"",
  "continuity":"Canon","media":[],"factions":list(factions),
  "aliases":list(aliases),"knownReleases":[release],"sourceKeys":[src],
  "verified":True,"category":cat,"factionSource":"Rebelscum 2005/2006 collector checklist",
  "species":species,"speciesSource":"Curated",
  "autoImageQuery":name+" Star Wars Hasbro 3.75"}
 cats[cat].append(rec)
 added.append((cat,name))
 allnames.add(name.casefold())

# 2005 ROTS checklist - unique character/role entries only.
add("figures","Ask Aak","Republic Senator","ROTS III-46 Ask Aak (Senator, 2005)","rots2005",
    species="Gran",factions=("Galactic Republic",))
add("figures","Meena Tills","Republic Senator","ROTS III-47 Meena Tills (Senator, 2005)","rots2005",
    species="Mon Calamari",factions=("Galactic Republic",))
add("figures","Zett Jukassa","Jedi","ROTS III-52 Zett Jukassa (Jedi Padawan, 2005)","rots2005",
    species="Human",factions=("Jedi",))
add("figures","Utapauan Warrior","Utapau","ROTS III-53 Utapauan Warrior (2005)","rots2005",
    species="Pau'an",aliases=("Utapaun Warrior",))
add("figures","Mustafar Sentry","Mustafar","ROTS III-56 Mustafar Sentry (2005)","rots2005",
    species="Mustafarian")
add("figures","Wookiee Commando","Wookiee","ROTS III-58 Wookiee Commando (2005)","rots2005",
    species="Wookiee")
add("figures","Wookiee Heavy Gunner","Wookiee","ROTS III-68 Wookiee Heavy Gunner (2005)","rots2005",
    species="Wookiee")
add("figures","Neimoidian Commander","Separatist","ROTS III-63 Neimoidian Commander (2005)","rots2005",
    species="Neimoidian",factions=("Separatist",))
add("figures","Neimoidian Warrior","Separatist","ROTS III-42 Neimoidian Warrior (2005)","rots2005",
    species="Neimoidian",factions=("Separatist",))
add("figures","Cat Miin","Separatist","ROTS III-62 Cat Miin (2005)","rots2005",
    species="Neimoidian",factions=("Separatist",))
add("figures","Tion Medon","Utapau","ROTS Sneak Preview 2 of 4 Tion Medon (2005)","rots2005",
    species="Pau'an")
add("figures","Utapau Shadow Trooper","Clone","ROTS Target exclusive Utapau Shadow Trooper (2005)","rots2005",
    factions=("Galactic Republic",),aliases=("Shadow Trooper (Utapau)",))
add("figures","Clone Trooper Sergeant","Clone","The Saga Collection SAGA-060 Clone Trooper Sergeant (2006)","saga2006",
    factions=("Galactic Republic",),aliases=("Clone Sergeant",))
add("figures","501st Stormtrooper","Empire","The Saga Collection 501st Stormtrooper (SDCC exclusive, 2006)","saga2006",
    factions=("Empire",),note="Imperial Stormtrooper armor; distinct from the 501st Clone Trooper.")

# Astromechs and medical droid are distinct physical releases.
add("droids","R4-K5","Astromech","The Saga Collection SAGA-066 R4-K5 (2006)","saga2006",
    aliases=("R4 K5","Darth Vader's Astromech Droid"))
add("droids","R4-M6","Astromech","The Saga Collection SAGA-074 R4-M6 (2006)","saga2006",
    aliases=("R4 M6","Mace Windu's Astromech Droid"))
add("droids","Vader's Medical Droid","Medical","ROTS III-37 Vader's Medical Droid (Chopper Droid, 2005)","rots2005",
    aliases=("Chopper Droid","Vader’s Medical Droid","Chopper Medical Droid"))

# Do not duplicate already indexed roles/characters just because a different
# carded version or naming convention was used.
enrich=[
 ("figures","Stealth Ops Clone Trooper","ROTS Covert Ops Clone Trooper (StarWarsShop.com exclusive, 2005)","rots2005",
    ("Covert Ops Clone Trooper",)),
 ("figures","Clone Combat Engineer","The Saga Collection SAGA-068 Combat Engineer Trooper (2006)","saga2006",
    ("Combat Engineer Trooper",)),
 ("figures","41st Elite Corps Clone Trooper","The Saga Collection SAGA-065 Elite Corps Clone Trooper (2006)","saga2006",
    ("Elite Corps Clone Trooper",)),
 ("figures","Commander Bly","ROTS III-57 Commander Bly (2005)","rots2005",
    ("Clone Commander Bly",)),
 ("figures","Grand Moff Tarkin","ROTS III-45 Tarkin (Governor, 2005)","rots2005",
    ("Governor Tarkin",)),
 ("figures","Captain Antilles","ROTS III-51 Captain Antilles (Senate Security, 2005)","rots2005",
    ("Captain Antilles (Senate Security)",)),
 ("droids","R4-G9","ROTS Sneak Preview 4 of 4 R4-G9 (2005)","rots2005",
    ("R4 G9",))
]
for cat,name,release,src,aliases in enrich:
 matches=[r for r in cats[cat] if r["entity"]==name]
 assert len(matches)==1,name
 r=matches[0]
 r["knownReleases"]=list(dict.fromkeys(r.get("knownReleases",[])+[release]))
 r["sourceKeys"]=list(dict.fromkeys(r.get("sourceKeys",[])+[src]))
 r["aliases"]=list(dict.fromkeys(r.get("aliases",[])+list(aliases)))

assert len(added)==17,len(added)
assert sum(len(v) for v in cats.values())==1250
dp.write_text(prefix+json.dumps(d,ensure_ascii=False,separators=(",",":"))+";\n",encoding="utf-8")
gradle=gp.read_text(encoding="utf-8")
gradle=re.sub(r"versionCode\s+\d+","versionCode 27",gradle)
gradle=re.sub(r'versionName\s+"[^"]+"','versionName "1.16-rots-saga-audit"',gradle)
gp.write_text(gradle,encoding="utf-8")
print("ROTS/TSC v1.16 added",added)
print("Catalog totals:",{c:len(a) for c,a in cats.items()})
