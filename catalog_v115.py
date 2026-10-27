from pathlib import Path
import json,re

root=Path("project/app/src/main/assets")
dp=root/"data.js"
gp=Path("project/app/build.gradle")
prefix="window.SW375_V18_SEED="
raw=dp.read_text(encoding="utf-8")
assert raw.startswith(prefix)
d=json.loads(raw[len(prefix):].rstrip(";\r\n "))
assert d["masterVersion"]=="2026.10.26-potf2-episode1-v1.14",d["masterVersion"]
d["masterVersion"]="2026.10.27-potj-saga-otc-v1.15"
d["sources"].update({
 "potjChecklist":"https://www.rebelscum.com/chp-potjedi.htm",
 "rorworrWotc":"https://rebelscum.com/potjinvoftheed.asp",
 "sagaChecklist":"https://www.rebelscum.com/chp-saga.htm",
 "otcTransition":"https://www.rebelscum.com/OTCtransitionlist.asp",
 "sagaAccessories":"https://www.rebelscum.com/SAGAacccreatures.asp",
 "sagaR2Kouhuns":"https://rebelscum.com/sagar2d2coruscantsentry.asp"
})
cats=d["categories"]
allnames={x["entity"].casefold() for a in cats.values() for x in a}
added=[]
def add(cat,name,sub,release,source,aliases=(),species="Unknown / Other",factions=(),note="",continuity="Ismeretlen"):
 assert name.casefold() not in allnames, "duplicate "+name
 ident=f"{cat[:3].upper()}-AUD115-{len(added)+1:03d}"
 rec={"id":ident,"entity":name,"subcategory":sub,"owned":False,"wanted":False,
      "count":0,"quantity":0,"notes":note,"localImage":"","imageUrl":"",
      "continuity":continuity,"media":[],"factions":list(factions),
      "aliases":list(aliases),"knownReleases":[release],"sourceKeys":[source],
      "verified":True,"category":cat,"factionSource":"Collector checklist",
      "species":species,"speciesSource":"Curated",
      "autoImageQuery":name+" Star Wars Hasbro 3.75 action figure"}
 cats[cat].append(rec)
 added.append((cat,name))
 allnames.add(name.casefold())

# POTJ 2000: physical 3.75-inch WOTC game exclusive.
add("figures","Rorworr","Power of the Jedi (2000–2002)",
    "Wizards of the Coast Invasion of Theed Adventure Game (2000) 3.75-inch figure",
    "rorworrWotc",aliases=("Rorworr (Wookiee Scout)","Wookiee Scout Rorworr"),
    species="Wookiee",continuity="Legends")

# Saga 2003–2004: character/role, not another card variation.
add("figures","Kren Blista-Vinee","Empire",
    "Star Wars Saga 03-41 Imperial Dignitary Kren Blista-Vinee (2003)",
    "sagaChecklist",aliases=("Imperial Dignitary Kren Blista-Vinee",),
    species="Human",factions=("Empire",))
add("figures","Captain Antilles","Rebel Alliance",
    "Star Wars Saga 04-15 Captain Antilles (Tantive IV Invasion, 2004)",
    "sagaChecklist",aliases=("Raymus Antilles","Captain Raymus Antilles"),
    species="Human",factions=("Rebel Alliance",))

# Original Trilogy Collection transition (2005), all distinct characters.
add("figures","Pablo-Jill","Jedi",
    "OTC Transitional 05-01 Pablo-Jill (Geonosis Arena, 2005)",
    "otcTransition",aliases=("Pablo Jill",),factions=("Jedi",))
add("figures","Yarua","Civil / politikus",
    "OTC Transitional 05-02 Yarua (Wookiee Senator, 2005)",
    "otcTransition",species="Wookiee")
add("figures","Sly Moore","Civil / politikus",
    "OTC Transitional 05-03 Sly Moore (Coruscant Senate, 2005)",
    "otcTransition",species="Umbaran")
add("figures","Rabé","Naboo",
    "OTC Transitional 05-05 Rabé (Queen's Chambers, 2005)",
    "otcTransition",aliases=("Rabe","Rabé (Royal Handmaiden)"),species="Human")
add("figures","Feltipern Trevagg","Cantina / Mos Eisley",
    "OTC Transitional 05-06 Feltipern Trevagg (Cantina, 2005)",
    "otcTransition",species="Gotal")
add("figures","Myo","Cantina / Mos Eisley",
    "OTC Transitional 05-07 Myo (Cantina, 2005)",
    "otcTransition",species="Abyssin")
add("figures","Dannik Jerriko","Cantina / Mos Eisley",
    "OTC Transitional 05-08 Dannik Jerriko (Cantina Encounter, 2005)",
    "otcTransition",species="Anzat")

# Saga pack-in miniatures, explicitly identified as pack-ins (not standalone toys).
add("creatures","Wol Cabbashite","Jabba / Tatooine",
    "Saga Ultra Jabba's Palace Court Denizens (2004), with B'Omarr Monk and Bubo",
    "sagaChecklist",aliases=("Wol Cabbashite (Jabba's Palace)",),
    note="Miniature included in the Saga Ultra Court Denizens set; not sold individually.")
add("creatures","Kouhun","Kis lény / kiegészítő",
    "Saga 02-14 R2-D2 (Coruscant Sentry, 2002), two Kouhun miniatures",
    "sagaR2Kouhuns",aliases=("Kouhuns","Assassin Centipede"),
    note="Miniature pack-ins with the R2-D2 Coruscant Sentry action figure; not a separate carded release.")

# Update existing identities instead of creating duplicates.
enrich=[
 ("figures","General Crix Madine",
   "Star Wars Saga 04-20 General Madine (Imperial Shuttle Capture, 2004)",
   "sagaChecklist",("General Madine","Crix Madine")),
 ("figures","Fi-Ek Sirch",
   "Star Wars Saga 02-21 Nikto (Jedi Knight, 2002); The Vintage Collection VC49 (2011)",
   "sagaChecklist",("Sirch Fi-Ek","Nikto (Jedi Knight)")),
 ("figures","General Jan Dodonna",
   "Star Wars Saga 04-12 General Jan Dodonna (Battle of Yavin, 2004)",
   "sagaChecklist",("Jan Dodonna",)),
 ("figures","Dutch Vander",
   "Star Wars Saga 04-13 Dutch Vander: Gold Leader (Battle of Yavin, 2004)",
   "sagaChecklist",("Gold Leader","Dutch Vander Gold Leader")),
 ("figures","Zutton (Snaggletooth)",
   "Power of the Jedi Zutton (Snaggletooth, 2001)",
   "potjChecklist",("Zutton","Snaggletooth"))
]
for cat,name,release,src,aliases in enrich:
 matches=[x for x in cats[cat] if x["entity"]==name]
 assert len(matches)==1,name
 rec=matches[0]
 rec["knownReleases"]=list(dict.fromkeys(rec.get("knownReleases",[])+[release]))
 rec["sourceKeys"]=list(dict.fromkeys(rec.get("sourceKeys",[])+[src]))
 rec["aliases"]=list(dict.fromkeys(rec.get("aliases",[])+list(aliases)))

assert len(added)==12,len(added)
dp.write_text(prefix+json.dumps(d,ensure_ascii=False,separators=(",",":"))+";\n",encoding="utf-8")
gradle=gp.read_text(encoding="utf-8")
gradle=re.sub(r"versionCode\s+\d+","versionCode 26",gradle)
gradle=re.sub(r'versionName\s+"[^"]+"','versionName "1.15-potj-saga-otc"',gradle)
gp.write_text(gradle,encoding="utf-8")
print("v1.15 additions:",added)
print("Total:",sum(len(x) for x in cats.values()))
