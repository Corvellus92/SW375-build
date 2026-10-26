from pathlib import Path
import json,re

root=Path("project/app/src/main/assets")
dp,jp=root/"data.js",root/"app.js"
gp=Path("project/app/build.gradle")
prefix="window.SW375_V18_SEED="
raw=dp.read_text(encoding="utf-8")
assert raw.startswith(prefix)
d=json.loads(raw[len(prefix):].rstrip(";\r\n "))
assert d["masterVersion"]=="2026.10.26-vintage-audit-v1.13",d["masterVersion"]
d["masterVersion"]="2026.10.26-potf2-episode1-v1.14"
d["sources"].update({
 "potf2Checklist":"https://www.rebelscum.com/chp-potf2.htm",
 "potf2CompleteGalaxy":"https://rebelscum.com/potf2completegalaxy.asp",
 "potf2GunnerStations":"https://www.rebelscum.com/potf2gunnerstations.asp",
 "episode1AccessorySets":"https://www.rebelscum.com/episodeIaccessorysets.asp",
 "episode1Carryall":"https://www.rebelscum.com/episodeIr2playset.asp",
 "figrinDanHasbro":"https://consumercare.hasbro.com/en-us/product/star-wars-the-vintage-collection-figrin-d-an-toy-3-75-inch-scale-star-wars-a-new-hope-action-figure-toys-kids-4-and-up/1E6259C6-7D45-4D60-85A4-4916E8CAEED9"
})
cats=d["categories"]
allnames={x["entity"].casefold() for arr in cats.values() for x in arr}
added=[]
def add(cat,name,sub,release,src,aliases=(),species="Unknown / Other",factions=(),notes=""):
 assert name.casefold() not in allnames, "duplicate "+name
 ident=f"{cat[:3].upper()}-AUD114-{len(added)+1:03d}"
 rec={"id":ident,"entity":name,"subcategory":sub,"owned":False,"wanted":False,
      "count":0,"quantity":0,"notes":notes,"localImage":"","imageUrl":"",
      "continuity":"Legends","media":[],"factions":list(factions),
      "aliases":list(aliases),"knownReleases":[release],"sourceKeys":[src],
      "verified":True,"category":cat,"factionSource":"Collector checklist",
      "species":species,"speciesSource":"Curated",
      "autoImageQuery":name+" Hasbro Kenner Star Wars 3.75"}
 cats[cat].append(rec);added.append((cat,name));allnames.add(name.casefold())

# Figures/pack-ins omitted from the one-per-character/role database.
add("figures","Spacetrooper","Empire","Kenner POTF2 Expanded Universe (1998)","potf2Checklist",
    aliases=("Space Trooper","Zero-G Stormtrooper"),factions=("Empire",))
add("figures","Ugnaught","Civil / politikus","Kenner POTF2 Ugnaughts two-pack (1998)","potf2Checklist",
    aliases=("Ugnaughts","Ugloste"),species="Ugnaught")
add("figures","Airspeeder Pilot","Rebel Pilot","Kenner POTF2 Expanded Universe Airspeeder pack-in (1997)","potf2Checklist",
    aliases=("McQuarrie Airspeeder Pilot",),factions=("Rebel Alliance",))
add("figures","Swoop Trooper","Empire","Kenner Shadows of the Empire Swoop with Swoop Trooper (1996)","potf2Checklist",
    aliases=("Swoop Rider",))
add("figures","Imperial Scanning Technician","Empire","Kenner POTF2 Millennium Falcon carry case pack-in (1998)","potf2Checklist",
    factions=("Empire",))
add("figures","Figrin D'an","Cantina / Mos Eisley","Hasbro The Vintage Collection VC249 (2022)","figrinDanHasbro",
    aliases=("Cantina Band Member","Modal Nodes Figrin D'an"),species="Bith")
add("figures","B'Omarr Monk","Jabba / Tatooine","Kenner POTF2 mail-away B'Omarr Monk (1998)","potf2Checklist",
    aliases=("B'omarr Monk","B'omarr Brain Walker"))

# The 1998 Complete Galaxy globes are distinct playable display sets,
# rather than variants of the full-sized Kenner vintage playsets.
for name,release in [
 ("Complete Galaxy: Dagobah with Yoda","Kenner POTF2 Complete Galaxy Dagobah with Yoda (1998)"),
 ("Complete Galaxy: Death Star with Darth Vader","Kenner POTF2 Complete Galaxy Death Star with Darth Vader (1998)"),
 ("Complete Galaxy: Endor with Ewok","Kenner POTF2 Complete Galaxy Endor with Ewok (1998)"),
 ("Complete Galaxy: Tatooine with Luke Skywalker","Kenner POTF2 Complete Galaxy Tatooine with Luke Skywalker (1998)")
]:
 add("playsets",name,"Complete Galaxy (POTF2)",release,"potf2CompleteGalaxy")

add("playsets","POTF2 Millennium Falcon Gunner Station","Gunner Station (POTF2)",
    "Kenner POTF2 Millennium Falcon Gunner Station with Han Solo or Luke Skywalker (1998)","potf2GunnerStations",
    aliases=("Millennium Falcon Gunner Station",))
add("playsets","POTF2 TIE Fighter Gunner Station","Gunner Station (POTF2)",
    "Kenner POTF2 Darth Vader TIE Fighter Gunner Station (1998)","potf2GunnerStations",
    aliases=("Darth Vader Gunner Station",))

# Only add unique 1999-2000 accessory sets not already represented
# under shorter names in the previous database.
add("accessories","Sith Accessory Set","Episode I (1999–2000)",
    "Hasbro Episode I Sith Accessory Set (2000)","episode1AccessorySets")
add("accessories","Naboo Accessory Set","Episode I (1999–2000)",
    "Hasbro Episode I Naboo Accessory Set (2000)","episode1AccessorySets")
add("accessories","Tatooine Accessory Set","Episode I (1999–2000)",
    "Hasbro Episode I Tatooine Accessory Set (2000)","episode1AccessorySets")
add("accessories","POTF2 Millennium Falcon Carry Case","Gyűjtőtok",
    "Kenner POTF2 Millennium Falcon Carry Case with Wedge Antilles or Imperial Scanning Technician (1998)","potf2Checklist",
    aliases=("Millennium Falcon Collector Case","Millennium Falcon Figure Case"))

# Attach precise physical-release names to records already in the database,
# without creating duplicate items for the same toy.
updates=[
 ("accessories","Flash Cannon","Hasbro Episode I Flash Cannon Electronic Accessory Set (1999)","episode1AccessorySets",("Electronic Flash Cannon",)),
 ("accessories","Gungan Catapult","Hasbro Episode I Gungan Energy Ball Catapult Electronic Accessory Set (1999)","episode1AccessorySets",("Gungan Energy Ball Catapult Set",)),
 ("accessories","Hyperdrive Repair","Hasbro Episode I Hyper-Drive Repair Kit Accessory Set (1999)","episode1AccessorySets",("Hyper-Drive Repair Kit Accessory Set",)),
 ("accessories","Podracer Fuel Station","Hasbro Episode I Pod Racer Fuel Station Accessory Set (1999)","episode1AccessorySets",("Pod Racer Fuel Station Accessory Set",)),
 ("accessories","Rappel Line Attack","Hasbro Episode I Rappel Line Attack Accessory Set (1999)","episode1AccessorySets",("Rappel Line Attack Accessory Set",)),
 ("accessories","Tatooine Disguise","Hasbro Episode I Tatooine Disguise Accessory Set (2000)","episode1AccessorySets",("Tatooine Disguise Accessory Set",)),
 ("accessories","Underwater Accessory Set","Hasbro Episode I Underwater Accessory Set (2000)","episode1AccessorySets",()),
 ("accessories","R2-D2 Carry Case","Hasbro Episode I R2-D2 Carryall Playset (1999)","episode1Carryall",("R2-D2 Carryall Playset","R2-D2 Carryall",))
]
for cat,name,release,src,aliases in updates:
 m=[r for r in cats[cat] if r["entity"]==name]
 assert len(m)==1,name
 rec=m[0]
 rec["knownReleases"]=list(dict.fromkeys(rec.get("knownReleases",[])+[release]))
 rec["sourceKeys"]=list(dict.fromkeys(rec.get("sourceKeys",[])+[src]))
 rec["aliases"]=list(dict.fromkeys(rec.get("aliases",[])+list(aliases)))

assert len(added)==17,len(added)
dp.write_text(prefix+json.dumps(d,ensure_ascii=False,separators=(",",":"))+";\n",encoding="utf-8")
gradle=gp.read_text(encoding="utf-8")
gradle=re.sub(r"versionCode\s+\d+","versionCode 25",gradle)
gradle=re.sub(r'versionName\s+"[^"]+"','versionName "1.14-potf2-episode1"',gradle)
gp.write_text(gradle,encoding="utf-8")
print("v1.14 verified additions:",added)
print("Total:",sum(len(x) for x in cats.values()))
