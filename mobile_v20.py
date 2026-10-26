from pathlib import Path
import re
p=Path("project/app/src/main/assets/app.js")
s=p.read_text()
# v1.9 patch has already been applied before this script.
needle='<article class="item" onclick="if(itemView===\'tiles\' && !event.target.closest(\'.pic,.name,.actions\'))details(\'\u0024{r.id}\')">'
assert needle in s, "Expected v1.9 tile markup not found"
s=s.replace(needle,'<article class="item" data-item-id="\u0024{r.id}" onpointerdown="tileDown(event,\'\u0024{r.id}\')" onpointerup="tileUp(event)" onpointercancel="tileCancel()" onclick="tileClick(event,\'\u0024{r.id}\')">',1)
# Capture owned toggle behavior from the app, so no separate data model is introduced.
p.write_text(s)
