from pathlib import Path
import json,re
root=Path('project/app/src/main/assets')
p=root/'data.js'
raw=p.read_text(encoding='utf-8')
prefix='window.SW375_V18_SEED='
assert raw.startswith(prefix)
d=json.loads(raw[len(prefix):].rstrip(';\r\n '))
assert d['masterVersion']=='2026.10.27-rots-tsc-audit-v1.16'
d['masterVersion']='2026.10.27-major-features-v1.17'
d['sources']['tac2007']='https://www.rebelscum.com/ch-tac.asp'
rows=[
('figures','McQuarrie Concept Darth Vader','30-28 Concept Darth Vader (2007)'),
('figures','McQuarrie Concept Snowtrooper','30-42 Concept Snowtrooper (2007)'),
('figures','McQuarrie Concept Starkiller Hero','30-37 Concept Starkiller Hero (2007)'),
('figures','McQuarrie Concept Luke Skywalker','Celebration IV Concept Luke Skywalker (2007)'),
('figures','Concept General Grievous','StarWarsShop Exclusive Concept General Grievous (2007)'),
('droids','McQuarrie Concept R2-D2','Celebration IV Concept R2-D2 & C-3PO two-pack (2007)'),
('droids','McQuarrie Concept C-3PO','Celebration IV Concept R2-D2 & C-3PO two-pack (2007)')]
names={x['entity'].casefold() for a in d['categories'].values() for x in a}
for i,(c,n,release) in enumerate(rows,1):
 assert n.casefold() not in names,n
 d['categories'][c].append({'id':f'{c[:3].upper()}-AUD117-{i:03d}','entity':n,'subcategory':'McQuarrie / Concept','owned':False,'wanted':False,'count':0,'quantity':0,'notes':'','localImage':'','imageUrl':'','continuity':'Legends','media':[],'factions':[],'aliases':[],'knownReleases':[release],'sourceKeys':['tac2007'],'verified':True,'category':c,'factionSource':'Rebelscum TAC checklist','species':'Unknown / Other','speciesSource':'Curated','autoImageQuery':n+' Star Wars 3.75 Hasbro'})
 names.add(n.casefold())
assert sum(len(a) for a in d['categories'].values())==1257
p.write_text(prefix+json.dumps(d,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
g=Path('project/app/build.gradle')
s=g.read_text()
s=re.sub(r'versionCode\s+\d+','versionCode 28',s)
s=re.sub(r'versionName\s+"[^"]+"','versionName "1.17-dashboard-bulk"',s)
g.write_text(s)
print('v1.17 catalog:',{k:len(v) for k,v in d['categories'].items()})
