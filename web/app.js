
const S=window.SW375_V18_SEED,KEY="sw375-v18",FACTIONS=S.factionVocabulary||[],SPECIES=S.speciesVocabulary||[];
let state=JSON.parse(localStorage.getItem(KEY)||"null"),cat=null,sub=null,tab="all",screen="home",cur=null;
const $=s=>document.querySelector(s),E=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const cleanF=a=>[...new Set((Array.isArray(a)?a:[]).filter(x=>FACTIONS.includes(x)))].sort((a,b)=>FACTIONS.indexOf(a)-FACTIONS.indexOf(b));
const cleanS=s=>SPECIES.includes(s)?s:"Unknown / Other";
const deep=x=>JSON.parse(JSON.stringify(x));
const now=()=>new Date().toISOString();

const LANGS=["en","hu","de"];
let lang=localStorage.getItem("sw375-language")||S.defaultLanguage||"en";
if(!LANGS.includes(lang))lang="en";
const TX={
en:{vehicles:"Vehicles",figures:"Figures",creatures:"Creatures",droids:"Droids",playsets:"Playsets",accessories:"Accessories",weapons:"Weapons",search:"Search",searchDesc:"Search the entire collection",community:"Community / Master",communityDesc:"Send and receive suggestions and master updates",globalHint:"Search by name, category, faction, species and media.",results:"results",owned:"Owned",wanted:"Wanted",categories:"categories",addItem:"Add item",sync:"Sync",all:"All",missing:"Missing",total:"total",complete:"complete",allFactions:"All factions",allSpecies:"All species",newItem:"New item",mainCategory:"Main category",name:"Name",subcategory:"Subcategory",canonStatus:"Canon status",quantity:"Quantity",species:"Species",factions:"Factions (SWGOH.GG list)",media:"Media",filmMedia:"Film / series / media",note:"Note",notSpecified:"Not specified",both:"Both",save:"Save",ownImage:"Own image",delete:"Delete",close:"Close",add:"Add",cancel:"Cancel",communitySuggestions:"Community suggestions",contributorName:"Contributor name / nickname",emailSuggestion:"Email Master Suggestion",emailRecipient:"Recipient: corvellus92@gmail.com",emailFallback:"The suggestion file was downloaded. Attach it to the email that opens.",contributionPrivacy:"The suggestion package does NOT contain Owned/Wanted status, quantity or personal notes.",receivedSuggestions:"Received suggestions",acceptAll:"Accept all",clearPending:"Clear pending",masterUpdate:"MASTER update",masterPreserve:"When importing a Master Update, your personal collection data is preserved.",masterPreserveDesc:"Only the base list, official metadata and accepted master images are updated.",shareCandidate:"Can be sent as a MASTER update suggestion",shareImage:"Include my own image in the suggestion",contributionNote:"Suggestion note (not a personal collection note)",syncTitle:"PC ↔ phone sync",syncUrl:"PC sync server URL",smartMerge:"Smart merge",pcToPhone:"PC → phone",phoneToPc:"Phone → PC",recommended:"Recommended:",smartMergeHint:"Smart merge keeps newer changes and custom items from both devices.",fileBackup:"File backup",searchPlaceholder:"Search...",globalSearchPlaceholder:"Search all categories...",optional:"optional",subcategoryExample:"e.g. Jedi, Astromech, Ground",suggestionExample:"e.g. missing figure / wrong species / better image",edit:"Edit",open:"Open",searchMin:"Type at least 1 character.",ownedLower:"owned",wantedLower:"wanted",unnamed:"Unnamed",imageLoading:"loading image…",noContribution:"No items are marked as MASTER suggestions.",invalidContribution:"Invalid community suggestion package.",invalidBackup:"Invalid backup.",invalidMaster:"Invalid Master Update file.",masterUpdated:"Master updated. Your personal collection data was preserved.",confirmDelete:"Are you sure you want to delete",giveName:"Enter a name.",currentMaster:"Current master version:",unknown:"unknown",pendingReview:"suggestions waiting for review.",contributor:"Contributor:",base:"base",accept:"Accept",reject:"Reject",newEntry:"NEW ITEM",noDiff:"No metadata differences",notePrefix:"Note:",syncSameWifi:"Recommended: Smart merge. PC and phone must be on the same Wi-Fi.",enterPcUrl:"Enter the PC address.",merging:"Merging…",syncDone:"Smart merge completed. PC and this device now have the same merged state.",firstSync:"First sync completed: current database uploaded to the PC.",error:"Error:"},
hu:{vehicles:"Járművek",figures:"Figurák",creatures:"Lények",droids:"Droidok",playsets:"Playsetek",accessories:"Kiegészítők",weapons:"Fegyverek",search:"Keresés",searchDesc:"Keresés az egész gyűjteményben",community:"Közösség / Master",communityDesc:"Javaslatok küldése, fogadása és master frissítés",globalHint:"Név, kategória, frakció, faj és média alapján is keres.",results:"találat",owned:"Megvan",wanted:"Kell",categories:"kategória",addItem:"Saját tétel",sync:"Szinkron",all:"Minden",missing:"Hiányzik",total:"összes",complete:"kész",allFactions:"Minden frakció",allSpecies:"Minden faj",newItem:"Új saját tétel",mainCategory:"Fő kategória",name:"Név",subcategory:"Alkategória",canonStatus:"Canon státusz",quantity:"Darabszám",species:"Faj",factions:"Frakciók (SWGOH.GG lista)",media:"Média",filmMedia:"Film / sorozat / média",note:"Megjegyzés",notSpecified:"Nincs megadva",both:"Mindkettő",save:"Mentés",ownImage:"Saját kép",delete:"Törlés",close:"Bezárás",add:"Hozzáadás",cancel:"Mégse",communitySuggestions:"Közösségi javaslatok",contributorName:"Beküldő neve / beceneve",emailSuggestion:"Master javaslat küldése e-mailben",emailRecipient:"Címzett: corvellus92@gmail.com",emailFallback:"A javaslatfájl letöltődött. Csatold a megnyíló e-mailhez.",contributionPrivacy:"A javaslatcsomag NEM tartalmazza a Megvan/Kell állapotot, darabszámot vagy személyes megjegyzéseket.",receivedSuggestions:"Beérkezett javaslatok",acceptAll:"Összes elfogadása",clearPending:"Törlés a várólistáról",masterUpdate:"MASTER frissítés",masterPreserve:"Master Update betöltésekor a saját gyűjteményadataid megmaradnak.",masterPreserveDesc:"Csak az alaplista, a hivatalos metaadatok és az elfogadott master képek frissülnek.",shareCandidate:"Javaslatként elküldhető a MASTER frissítéshez",shareImage:"Saját képemet is mellékelem a javaslathoz",contributionNote:"Javaslat megjegyzése (nem személyes gyűjtemény-megjegyzés)",syncTitle:"PC ↔ telefon szinkron",syncUrl:"PC szinkron szerver címe",smartMerge:"Intelligens összefésülés",pcToPhone:"PC → telefon",phoneToPc:"Telefon → PC",recommended:"Ajánlott:",smartMergeHint:"Az Intelligens összefésülés megtartja mindkét eszköz újabb módosításait és saját tételeit.",fileBackup:"Fájlos tartalék megoldás",searchPlaceholder:"Keresés...",globalSearchPlaceholder:"Keresés minden kategóriában...",optional:"opcionális",subcategoryExample:"pl. Jedi, Astromech, Földi",suggestionExample:"pl. hiányzó figura / rossz faj / jobb kép",edit:"Szerkesztés",open:"Megnyitás",searchMin:"Írj be legalább 1 karaktert.",ownedLower:"megvan",wantedLower:"kell",unnamed:"Névtelen",imageLoading:"kép betöltése…",noContribution:"Nincs MASTER-javaslatként megjelölt tétel.",invalidContribution:"Nem megfelelő közösségi javaslatcsomag.",invalidBackup:"Nem megfelelő mentés.",invalidMaster:"Nem megfelelő Master Update fájl.",masterUpdated:"Master frissítve. A saját gyűjteményadataid megmaradtak.",confirmDelete:"Biztosan törlöd ezt",giveName:"Adj nevet.",currentMaster:"Aktuális master verzió:",unknown:"ismeretlen",pendingReview:"javaslat vár ellenőrzésre.",contributor:"Beküldő:",base:"alap",accept:"Elfogadás",reject:"Elutasítás",newEntry:"ÚJ TÉTEL",noDiff:"Nincs metaadat-eltérés",notePrefix:"Megjegyzés:",syncSameWifi:"Ajánlott: Intelligens összefésülés. A PC és telefon ugyanazon Wi-Fi-n legyen.",enterPcUrl:"Add meg a PC címét.",merging:"Összefésülés folyamatban…",syncDone:"Intelligens összefésülés kész. A PC szerveren és ezen az eszközön ugyanaz az egyesített állapot van.",firstSync:"Első szinkron kész: a jelenlegi adatbázis felkerült a PC-re.",error:"Hiba:"},
de:{vehicles:"Fahrzeuge",figures:"Figuren",creatures:"Kreaturen",droids:"Droiden",playsets:"Spielsets",accessories:"Zubehör",weapons:"Waffen",search:"Suche",searchDesc:"Gesamte Sammlung durchsuchen",community:"Community / Master",communityDesc:"Vorschläge senden, empfangen und Master aktualisieren",globalHint:"Suche nach Name, Kategorie, Fraktion, Spezies und Medium.",results:"Treffer",owned:"Vorhanden",wanted:"Gesucht",categories:"Kategorien",addItem:"Eigenen Eintrag",sync:"Synchronisieren",all:"Alle",missing:"Fehlt",total:"gesamt",complete:"vollständig",allFactions:"Alle Fraktionen",allSpecies:"Alle Spezies",newItem:"Neuer eigener Eintrag",mainCategory:"Hauptkategorie",name:"Name",subcategory:"Unterkategorie",canonStatus:"Kanon-Status",quantity:"Anzahl",species:"Spezies",factions:"Fraktionen (SWGOH.GG-Liste)",media:"Medium",filmMedia:"Film / Serie / Medium",note:"Notiz",notSpecified:"Nicht angegeben",both:"Beides",save:"Speichern",ownImage:"Eigenes Bild",delete:"Löschen",close:"Schließen",add:"Hinzufügen",cancel:"Abbrechen",communitySuggestions:"Community-Vorschläge",contributorName:"Name / Spitzname des Einsenders",emailSuggestion:"Master-Vorschlag per E-Mail senden",emailRecipient:"Empfänger: corvellus92@gmail.com",emailFallback:"Die Vorschlagsdatei wurde heruntergeladen. Bitte an die geöffnete E-Mail anhängen.",contributionPrivacy:"Das Vorschlagspaket enthält NICHT den Vorhanden/Gesucht-Status, Mengen oder persönliche Notizen.",receivedSuggestions:"Eingegangene Vorschläge",acceptAll:"Alle annehmen",clearPending:"Warteliste leeren",masterUpdate:"MASTER-Update",masterPreserve:"Beim Import eines Master-Updates bleiben deine persönlichen Sammlungsdaten erhalten.",masterPreserveDesc:"Nur Basisliste, offizielle Metadaten und akzeptierte Master-Bilder werden aktualisiert.",shareCandidate:"Kann als MASTER-Update-Vorschlag gesendet werden",shareImage:"Mein eigenes Bild dem Vorschlag beifügen",contributionNote:"Hinweis zum Vorschlag (keine persönliche Sammlungsnotiz)",syncTitle:"PC ↔ Telefon Synchronisierung",syncUrl:"PC-Sync-Serveradresse",smartMerge:"Smart Merge",pcToPhone:"PC → Telefon",phoneToPc:"Telefon → PC",recommended:"Empfohlen:",smartMergeHint:"Smart Merge behält die neuesten Änderungen und eigenen Einträge beider Geräte.",fileBackup:"Datei-Backup",searchPlaceholder:"Suchen...",globalSearchPlaceholder:"Alle Kategorien durchsuchen...",optional:"optional",subcategoryExample:"z. B. Jedi, Astromech, Boden",suggestionExample:"z. B. fehlende Figur / falsche Spezies / besseres Bild",edit:"Bearbeiten",open:"Öffnen",searchMin:"Mindestens 1 Zeichen eingeben.",ownedLower:"vorhanden",wantedLower:"gesucht",unnamed:"Unbenannt",imageLoading:"Bild wird geladen…",noContribution:"Keine Einträge sind als MASTER-Vorschlag markiert.",invalidContribution:"Ungültiges Community-Vorschlagspaket.",invalidBackup:"Ungültiges Backup.",invalidMaster:"Ungültige Master-Update-Datei.",masterUpdated:"Master aktualisiert. Deine persönlichen Sammlungsdaten wurden beibehalten.",confirmDelete:"Wirklich löschen",giveName:"Bitte einen Namen eingeben.",currentMaster:"Aktuelle Master-Version:",unknown:"unbekannt",pendingReview:"Vorschläge warten auf Prüfung.",contributor:"Einsender:",base:"Basis",accept:"Annehmen",reject:"Ablehnen",newEntry:"NEUER EINTRAG",noDiff:"Keine Metadaten-Unterschiede",notePrefix:"Notiz:",syncSameWifi:"Empfohlen: Smart Merge. PC und Telefon müssen im selben WLAN sein.",enterPcUrl:"PC-Adresse eingeben.",merging:"Zusammenführen…",syncDone:"Smart Merge abgeschlossen. PC und dieses Gerät haben jetzt denselben zusammengeführten Stand.",firstSync:"Erste Synchronisierung abgeschlossen: aktuelle Datenbank wurde auf den PC übertragen.",error:"Fehler:"}
};
const t=k=>(TX[lang]&&TX[lang][k])||TX.en[k]||k;
const SUBTX={
"Droid jármű":{en:"Droid vehicle",hu:"Droid jármű",de:"Droidenfahrzeug"},"Földi":{en:"Ground",hu:"Földi",de:"Boden"},"Légi / űr":{en:"Air / space",hu:"Légi / űr",de:"Luft / Weltraum"},"Speeder / motor":{en:"Speeder / bike",hu:"Speeder / motor",de:"Speeder / Bike"},"Vízi / tengeralattjáró":{en:"Water / submarine",hu:"Vízi / tengeralattjáró",de:"Wasser / U-Boot"},"Civil / politikus":{en:"Civilian / politician",hu:"Civil / politikus",de:"Zivilist / Politiker"},"Egyéb karakter":{en:"Other character",hu:"Egyéb karakter",de:"Andere Figur"},"Katona / őr":{en:"Soldier / guard",hu:"Katona / őr",de:"Soldat / Wache"},"Köztársaság / Naboo":{en:"Republic / Naboo",hu:"Köztársaság / Naboo",de:"Republik / Naboo"},"Pilóta":{en:"Pilot",hu:"Pilóta",de:"Pilot"},"Szeparatista / Geonosis":{en:"Separatist / Geonosis",hu:"Szeparatista / Geonosis",de:"Separatist / Geonosis"},"Hátas / háziállat":{en:"Mount / pet",hu:"Hátas / háziállat",de:"Reittier / Haustier"},"Karakter / értelmes lény":{en:"Character / sentient creature",hu:"Karakter / értelmes lény",de:"Figur / intelligente Kreatur"},"Kis lény / egyéb":{en:"Small creature / other",hu:"Kis lény / egyéb",de:"Kleine Kreatur / Sonstiges"},"Nagy lény / ragadozó":{en:"Large creature / predator",hu:"Nagy lény / ragadozó",de:"Große Kreatur / Raubtier"},"Repülő / űrlény":{en:"Flying / space creature",hu:"Repülő / űrlény",de:"Flug- / Weltraumkreatur"},"Vízi lény":{en:"Aquatic creature",hu:"Vízi lény",de:"Wasserkreatur"},"BB egység":{en:"BB unit",hu:"BB egység",de:"BB-Einheit"},"Biztonsági / fejvadász":{en:"Security / bounty hunter",hu:"Biztonsági / fejvadász",de:"Sicherheit / Kopfgeldjäger"},"Felderítő / probe":{en:"Scout / probe",hu:"Felderítő / probe",de:"Aufklärung / Sonde"},"Harci":{en:"Combat",hu:"Harci",de:"Kampf"},"Humanoid / protokoll":{en:"Humanoid / protocol",hu:"Humanoid / protokoll",de:"Humanoid / Protokoll"},"Orvosi":{en:"Medical",hu:"Orvosi",de:"Medizinisch"},"Speciális / egyéb droid":{en:"Special / other droid",hu:"Speciális / egyéb droid",de:"Spezial- / sonstiger Droide"},"Szerviz / munkadroid":{en:"Service / work droid",hu:"Szerviz / munkadroid",de:"Service- / Arbeitsdroide"},"Helyszín / dioráma":{en:"Location / diorama",hu:"Helyszín / dioráma",de:"Schauplatz / Diorama"},"Tároló / hordozó":{en:"Storage / carrier",hu:"Tároló / hordozó",de:"Aufbewahrung / Träger"},"Egyéb":{en:"Other",hu:"Egyéb",de:"Sonstiges"},"Felszerelés / jelenet":{en:"Equipment / scene",hu:"Felszerelés / jelenet",de:"Ausrüstung / Szene"},"Harci eszköz":{en:"Combat equipment",hu:"Harci eszköz",de:"Kampfausrüstung"},"Műszaki / szerviz":{en:"Technical / service",hu:"Műszaki / szerviz",de:"Technik / Service"},"Blaster / pisztoly":{en:"Blaster / pistol",hu:"Blaster / pisztoly",de:"Blaster / Pistole"},"Blaster / puska":{en:"Blaster / rifle",hu:"Blaster / puska",de:"Blaster / Gewehr"},"Fénykard / Erő-fegyver":{en:"Lightsaber / Force weapon",hu:"Fénykard / Erő-fegyver",de:"Lichtschwert / Machtwaffe"},"Gránát / robbanó":{en:"Grenade / explosive",hu:"Gránát / robbanó",de:"Granate / Sprengstoff"},"Közelharci":{en:"Melee",hu:"Közelharci",de:"Nahkampf"},"Nehézfegyver":{en:"Heavy weapon",hu:"Nehézfegyver",de:"Schwere Waffe"}
};
const ALL_SUB="__ALL__";
const subLabel=s=>s===ALL_SUB?(lang==="hu"?"Összes":lang==="de"?"Alle":"All"):(SUBTX[s]&&SUBTX[s][lang])||s;
function setText(sel,val){const e=$(sel);if(e)e.textContent=val}
function applyLanguageStatic(){
document.documentElement.lang=lang;$("#langSelect").value=lang;
const pairs=[["#txVehicles","vehicles"],["#txFigures","figures"],["#txCreatures","creatures"],["#txDroids","droids"],["#txPlaysets","playsets"],["#txAccessories","accessories"],["#txWeapons","weapons"],["#txSearch","search"],["#txSearchDesc","searchDesc"],["#txCommunity","community"],["#txCommunityDesc","communityDesc"],["#txGlobalHint","globalHint"],["#txResults","results"],["#txGlobalOwned","ownedLower"],["#txGlobalWanted","wantedLower"],["#txGlobalCategories","categories"],["#txCommunitySuggestions","communitySuggestions"],["#txContributorName","contributorName"],["#txContributionPrivacy","contributionPrivacy"],["#txMasterEmailRecipient","emailRecipient"],["#txReceivedSuggestions","receivedSuggestions"],["#txMasterUpdate","masterUpdate"],["#txMasterPreserve","masterPreserve"],["#txMasterPreserveDesc","masterPreserveDesc"],["#txTotal","total"],["#txOwnedStat","ownedLower"],["#txWantedStat","wantedLower"],["#txComplete","complete"],["#txNewItem","newItem"],["#txShareCandidate","shareCandidate"],["#txShareImage","shareImage"],["#txContributionNote","contributionNote"],["#txSyncTitle","syncTitle"],["#txSyncUrl","syncUrl"],["#txRecommended","recommended"],["#txSmartMergeHint","smartMergeHint"],["#txFileBackup","fileBackup"]];
pairs.forEach(([s,k])=>setText(s,t(k)));
document.querySelectorAll(".txName").forEach(e=>e.textContent=t("name"));document.querySelectorAll(".txSubcategory").forEach(e=>e.textContent=t("subcategory"));document.querySelectorAll(".txCanonStatus").forEach(e=>e.textContent=t("canonStatus"));document.querySelectorAll(".txQuantity").forEach(e=>e.textContent=t("quantity"));document.querySelectorAll(".txSpecies").forEach(e=>e.textContent=t("species"));document.querySelectorAll(".txFactions").forEach(e=>e.textContent=t("factions"));document.querySelectorAll(".txFilmMedia").forEach(e=>e.textContent=t("filmMedia"));document.querySelectorAll(".txMedia").forEach(e=>e.textContent=t("media"));document.querySelectorAll(".txNote").forEach(e=>e.textContent=t("note"));document.querySelectorAll(".txMainCategory").forEach(e=>e.textContent=t("mainCategory"));
$("#globalQ").placeholder=t("globalSearchPlaceholder");$("#q").placeholder=t("searchPlaceholder");$("#contributorName").placeholder=t("optional");$("#newSub").placeholder=t("subcategoryExample");$("#contributionNote").placeholder=t("suggestionExample");
$("#addItem").textContent="＋ "+t("addItem");$("#syncHere").textContent="⇄ "+t("sync");document.querySelector('[data-tab="all"]').textContent=t("all");document.querySelector('[data-tab="owned"]').textContent=t("owned");document.querySelector('[data-tab="wanted"]').textContent=t("wanted");document.querySelector('[data-tab="missing"]').textContent=t("missing");
$("#saveEdit").textContent="💾 "+t("save");$("#pickimg").textContent="📷 "+t("ownImage");$("#deleteItem").textContent="🗑 "+t("delete");$("#createItem").textContent="＋ "+t("add");$("#mergeSync").textContent="⟳ "+t("smartMerge");$("#pullSync").textContent="⬇ "+t("pcToPhone");$("#pushSync").textContent="⬆ "+t("phoneToPc");
$("#emailContribution").textContent="📧 "+t("emailSuggestion");$("#exportContribution").textContent="📤 "+(lang==="hu"?"Javaslatcsomag export":lang==="de"?"Vorschlagspaket exportieren":"Export suggestion package");$("#importContribution").textContent="📥 "+(lang==="hu"?"Javaslatcsomag import":lang==="de"?"Vorschlagspaket importieren":"Import suggestion package");$("#acceptAllPending").textContent="✓ "+t("acceptAll");$("#clearPending").textContent=t("clearPending");$("#exportMaster").textContent="📦 "+(lang==="hu"?"Master Update export":lang==="de"?"Master Update exportieren":"Export Master Update");$("#importMaster").textContent="⬇ "+(lang==="hu"?"Master Update betöltése":lang==="de"?"Master Update importieren":"Import Master Update");
document.querySelectorAll("#dlg form>.toolbar button:not(#saveEdit):not(#pickimg):not(#deleteItem)").forEach(e=>e.textContent=t("close"));document.querySelectorAll("#addDlg form>.toolbar button:not(#createItem)").forEach(e=>e.textContent=t("cancel"));document.querySelectorAll("#syncDlg form>button").forEach(e=>e.textContent=t("close"));
["editCanon","newCanon"].forEach(id=>{const s=$("#"+id);if(!s)return;const v=s.value;if(s.options[0])s.options[0].text=t("notSpecified");[...s.options].forEach(o=>{if(o.value==="Both"||o.text==="Mindkettő"||o.text==="Both"||o.text==="Beides"){o.value="Both";o.text=t("both")}});s.value=v==="Mindkettő"?"Both":v});
}


function N(r){return r.entity||r.name||r.release||t("unnamed")}
function labels(){return{vehicles:t("vehicles"),figures:t("figures"),creatures:t("creatures"),droids:t("droids"),playsets:t("playsets"),accessories:t("accessories"),weapons:t("weapons")}}
function icon(c=cat){return c==="vehicles"?"🚀":c==="figures"?"👤":c==="creatures"?"🐾":c==="droids"?"🤖":c==="playsets"?"🏰":c==="weapons"?"🎯":"🧰"}

const MASTER_FIELDS=["entity","release","subcategory","canon","factions","species","media","imageUrl","masterImage","aliases","knownReleases","verified","sourceKeys","continuity","category","speciesSource","factionSource","autoImageQuery"];
function pickMasterFields(r){
  const o={id:r.id};
  MASTER_FIELDS.forEach(f=>{if(r[f]!==undefined)o[f]=deep(r[f])});
  return o;
}
function ensureMasterFields(r,seedRecord=null){
  if(!r.masterFields){
    const src=seedRecord||r;
    r.masterFields=pickMasterFields(src);
    if(r.masterFields.masterImage===undefined)r.masterFields.masterImage="";
  }
  if(r.masterImage==null)r.masterImage=r.masterFields.masterImage||"";
  if(r.contribute==null)r.contribute=false;
  if(r.shareImage==null)r.shareImage=false;
  if(r.contributionNote==null)r.contributionNote="";
  return r;
}
function seedRecordById(c,id,name){
  const arr=S.categories?.[c]||[];
  return arr.find(x=>x.id===id)||arr.find(x=>N(x)===name)||null;
}
function applyMasterFields(r,mf,preserveUserOverrides=true){
  if(!r.masterFields)r.masterFields={};
  for(const f of MASTER_FIELDS){
    if(mf[f]===undefined)continue;
    r.masterFields[f]=deep(mf[f]);
    const userChanged=preserveUserOverrides && !!(r.fieldUpdated||{})[f];
    if(!userChanged){
      r[f]=deep(mf[f]);
    }
  }
  r.masterImage=r.masterFields.masterImage||r.masterImage||"";
}

function normalizeRecord(r,stateTs){
  if(r.count==null)r.count=r.owned?1:0;
  if(r.owned==null)r.owned=Number(r.count)>0;
  if(r.wanted==null)r.wanted=false;
  if(!r.subcategory)r.subcategory="Egyéb";
  if(!r.id)r.id="USR-"+Date.now()+"-"+Math.random().toString(36).slice(2,8);
  r.factions=cleanF(r.factions);
  r.species=cleanS(r.species||"Unknown / Other");if(r.canon==="Mindkettő")r.canon="Both";
  if(!r.fieldUpdated)r.fieldUpdated={};
  if(!r.modifiedAt)r.modifiedAt=stateTs||now();
  ensureMasterFields(r,seedRecordById(cat||"",r.id,N(r)));
  return r;
}
function importOld(){
  const fresh={schema:18,categories:deep(S.categories||{}),updatedAt:now(),deleted:{},pendingContributions:[],masterVersion:S.masterVersion||"bundled"};
  const keys=["sw375-v17","sw375-v16","sw375-v15","sw375-v14","sw375-v13","sw375-v12","sw375-v11","sw375-v10","sw375-v9","sw375-v8"];
  for(const k of keys){
    try{
      const o=JSON.parse(localStorage.getItem(k)||"null");if(!o)continue;
      const oc=o.categories||o,ots=o.updatedAt||now();
      Object.keys(fresh.categories).forEach(c=>{
        const oldArr=oc[c]||[];
        fresh.categories[c].forEach(n=>{
          const m=oldArr.find(x=>(x.id&&n.id&&x.id===n.id)||(N(x)===N(n)));
          if(m){
            const preserve=["owned","wanted","count","localImage","note","canon","media","subcategory","factions","species"];
            preserve.forEach(f=>{if(m[f]!=null&&m[f]!==""&&!(Array.isArray(m[f])&&m[f].length===0))n[f]=deep(m[f])});
            n.modifiedAt=m.modifiedAt||ots;
            n.fieldUpdated=deep(m.fieldUpdated||{});
          }
        });
      });
      // Preserve user-created items that may not exist in seed
      Object.keys(oc).forEach(c=>{
        if(!fresh.categories[c])fresh.categories[c]=[];
        (oc[c]||[]).filter(x=>x.userCreated).forEach(x=>{
          if(!fresh.categories[c].some(y=>y.id===x.id))fresh.categories[c].push(deep(x));
        });
      });
      break;
    }catch(e){}
  }
  Object.values(fresh.categories).flat().forEach(r=>normalizeRecord(r,fresh.updatedAt));
  return fresh;
}
if(!state||state.schema!==18)state=importOld();
if(!state.deleted)state.deleted={};
if(!state.pendingContributions)state.pendingContributions=[];
if(!state.masterVersion)state.masterVersion=S.masterVersion||"bundled";
for(const [cc,aa] of Object.entries(state.categories||{})){
  (aa||[]).forEach(r=>{normalizeRecord(r,state.updatedAt);ensureMasterFields(r,seedRecordById(cc,r.id,N(r)))});
}
function save(){state.updatedAt=now();localStorage.setItem(KEY,JSON.stringify(state))}
function updateBundledCatalog(){
 const version=S.masterVersion||"bundled";
 if(state.bundledCatalogVersion===version)return;
 const prevBundle=state.bundledCatalogVersion;
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
 if(!state.masterVersion||state.masterVersion===prevBundle||state.masterVersion==="bundled")state.masterVersion=version;
}
updateBundledCatalog();
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
save();

function A(){return state.categories[cat]||[]}
function touch(r,fields){
  const t=now();if(!r.fieldUpdated)r.fieldUpdated={};
  fields.forEach(f=>r.fieldUpdated[f]=t);r.modifiedAt=t;
}
function recordKey(c,r){return c+"::"+String(r.id||("NAME:"+N(r).toLowerCase()))}
function recordMaxTs(r,fallback=""){
  const vals=[r.modifiedAt,fallback,...Object.values(r.fieldUpdated||{})].filter(Boolean).sort();
  return vals.length?vals[vals.length-1]:"";
}
function fieldTs(r,f,stateTs){return (r.fieldUpdated||{})[f]||r.modifiedAt||stateTs||""}
function newer(a,b){return String(a||"")>String(b||"")}

const MERGE_FIELDS=["entity","release","subcategory","canon","count","owned","wanted","factions","species","media","note","localImage","imageUrl","autoImageQuery","userCreated","knownReleases","speciesSource","factionSource"];

function mergeStates(local,remote){
  local=deep(local);remote=deep(remote);
  local.deleted=local.deleted||{};remote.deleted=remote.deleted||{};
  const out={schema:18,categories:{},updatedAt:now(),deleted:{}};

  // newest tombstone wins
  for(const [k,v] of Object.entries(local.deleted))out.deleted[k]=v;
  for(const [k,v] of Object.entries(remote.deleted))if(!out.deleted[k]||newer(v,out.deleted[k]))out.deleted[k]=v;

  const allCats=new Set([...Object.keys(local.categories||{}),...Object.keys(remote.categories||{})]);
  for(const c of allCats){
    const la=local.categories?.[c]||[],ra=remote.categories?.[c]||[];
    const lm=new Map(),rm=new Map();
    la.forEach(r=>lm.set(String(r.id||("NAME:"+N(r).toLowerCase())),r));
    ra.forEach(r=>rm.set(String(r.id||("NAME:"+N(r).toLowerCase())),r));
    const ids=new Set([...lm.keys(),...rm.keys()]);
    out.categories[c]=[];
    for(const id of ids){
      const l=lm.get(id),r=rm.get(id);
      let m;
      if(l&&r){
        m=deep(l);
        m.fieldUpdated=Object.assign({},l.fieldUpdated||{});
        for(const f of MERGE_FIELDS){
          const lt=fieldTs(l,f,local.updatedAt),rt=fieldTs(r,f,remote.updatedAt);
          if(newer(rt,lt)){
            m[f]=deep(r[f]);
            if((r.fieldUpdated||{})[f])m.fieldUpdated[f]=r.fieldUpdated[f];
          }
        }
        // merge timestamp maps so future sync remains field-aware
        for(const [f,t] of Object.entries(r.fieldUpdated||{})){
          if(!m.fieldUpdated[f]||newer(t,m.fieldUpdated[f]))m.fieldUpdated[f]=t;
        }
        m.modifiedAt=newer(r.modifiedAt,l.modifiedAt)?r.modifiedAt:l.modifiedAt;
      }else m=deep(l||r);

      normalizeRecord(m,newer(local.updatedAt,remote.updatedAt)?local.updatedAt:remote.updatedAt);
      const k=c+"::"+String(m.id||("NAME:"+N(m).toLowerCase()));
      const del=out.deleted[k];
      if(del && newer(del,recordMaxTs(m,newer(local.updatedAt,remote.updatedAt)?local.updatedAt:remote.updatedAt)))continue;
      if(Number(m.count)>0)m.owned=true;
      out.categories[c].push(m);
    }
  }
  return out;
}

function show(id){["home","dashboard","submenu","browser","globalSearch","community"].forEach(x=>$("#"+x).style.display=x===id?(x==="home"?"grid":"block"):"none")}
function homeCounts(){Object.keys(labels()).forEach(c=>{const e=$("#h"+c),a=state.categories[c]||[];if(e)e.textContent=`${a.filter(x=>x.owned||Number(x.count)>0).length}/${a.length} ${t("ownedLower")}`})}
function home(){screen="home";cat=null;sub=null;show("home");$("#back").style.display="none";$("#title").textContent="3.75 COLLECTION";homeCounts()}
function subs(){return[ALL_SUB,...[...new Set(A().map(x=>x.subcategory||"Egyéb"))].sort((a,b)=>a.localeCompare(b,lang==="de"?"de":lang==="hu"?"hu":"en"))]}
function fillFilters(){
  const uf=new Set(A().flatMap(r=>r.factions||[])),us=new Set(A().map(r=>r.species).filter(Boolean));
  $("#factionFilter").innerHTML=`<option value="">${E(t("allFactions"))}</option>`+FACTIONS.filter(f=>uf.has(f)).map(f=>`<option>${E(f)}</option>`).join("");
  $("#speciesFilter").innerHTML=`<option value="">${E(t("allSpecies"))}</option>`+SPECIES.filter(s=>us.has(s)).map(s=>`<option>${E(s)}</option>`).join("");
}
function enter(c){cat=c;sub=null;screen="submenu";show("submenu");$("#back").style.display="block";$("#title").textContent="3.75 COLLECTION · "+(labels()[c]||c).toUpperCase();const ss=subs();$("#subgrid").innerHTML=ss.map((s,i)=>{const a=s===ALL_SUB?A():A().filter(x=>(x.subcategory||"Egyéb")===s);return`<button class="cat" data-sub="${i}"><span class="ico">${icon()}</span><b>${E(subLabel(s))}</b><small>${a.filter(x=>x.owned||Number(x.count)>0).length}/${a.length} megvan</small></button>`}).join("");document.querySelectorAll("[data-sub]").forEach((b,i)=>b.onclick=()=>openSub(ss[i]))}
function openSub(s){sub=s;screen="browser";show("browser");$("#title").textContent=`3.75 COLLECTION · ${(labels()[cat]||cat).toUpperCase()} · ${subLabel(s)}`;fillFilters();render()}
function back(){if(screen==="browser")enter(cat);else if(screen==="submenu"||screen==="dashboard"||screen==="globalSearch"||screen==="community")home();else home()}
function tabok(r){const o=r.owned||Number(r.count)>0;return tab==="all"||(tab==="owned"&&o)||(tab==="wanted"&&r.wanted)||(tab==="missing"&&!o)}
function chips(r){let a=[...(r.factions||[])];if(r.species&&r.species!=="Unknown / Other")a.unshift(r.species);return a.slice(0,6).map(f=>`<span class="chip">${E(f)}</span>`).join("")+(a.length>6?`<span class="chip">+${a.length-6}</span>`:"")}

const autoImageFailures=new Set(),autoImageBusy=new Set();
function findById(id){
  for(const [c,a] of Object.entries(state.categories||{})){
    const r=(a||[]).find(x=>x.id===id);
    if(r)return{cat:c,r};
  }
  return null;
}
function imageHtml(r,c){
  const im=r.localImage||r.masterImage||r.masterFields?.masterImage||r.imageUrl||"";
  if(im)return `<img src="${E(im)}" alt="${E(N(r))}">`;
  return `<div class="autoLoading" data-auto-img="${E(r.id)}" data-auto-cat="${E(c)}"><span class="ph">${icon(c)}</span><br>${t("imageLoading")}</div>`;
}
async function fetchAutoImage(c,id){
  const key=c+"::"+id;
  if(autoImageFailures.has(key)||autoImageBusy.has(key))return;
  const r=(state.categories[c]||[]).find(x=>x.id===id);
  if(!r||r.localImage||r.masterImage||r.masterFields?.masterImage||r.imageUrl)return;
  autoImageBusy.add(key);
  try{
    const q=(r.autoImageQuery||N(r)).trim();
    const url="https://starwars.fandom.com/api.php?action=query&generator=search&gsrnamespace=0&gsrlimit=1&gsrsearch="+encodeURIComponent(q)+"&prop=pageimages&piprop=thumbnail&pithumbsize=500&format=json&origin=*";
    const res=await fetch(url,{cache:"force-cache"});
    if(!res.ok)throw new Error("HTTP "+res.status);
    const data=await res.json();
    const pages=data?.query?.pages?Object.values(data.query.pages):[];
    const thumb=pages[0]?.thumbnail?.source;
    if(!thumb)throw new Error("no image");
    r.imageUrl=thumb;
    r.imageSource="Wookieepedia";
    const el=document.querySelector(`[data-auto-img="${CSS.escape(id)}"][data-auto-cat="${CSS.escape(c)}"]`);
    if(el)el.parentElement.innerHTML=`<img src="${E(thumb)}" alt="${E(N(r))}">`;
    save();
  }catch(e){
    autoImageFailures.add(key);
    const el=document.querySelector(`[data-auto-img="${CSS.escape(id)}"][data-auto-cat="${CSS.escape(c)}"]`);
    if(el)el.innerHTML=`<span class="ph">${icon(c)}</span>`;
  }finally{autoImageBusy.delete(key)}
}
function hydrateAutoImages(root=document){
  const els=[...root.querySelectorAll("[data-auto-img]")].slice(0,12);
  let i=0;
  function next(){
    if(i>=els.length)return;
    const el=els[i++],id=el.dataset.autoImg,c=el.dataset.autoCat;
    fetchAutoImage(c,id).finally(()=>setTimeout(next,80));
  }
  next();
}

function communityOpen(){
  screen="community";cat=null;sub=null;show("community");$("#back").style.display="block";$("#title").textContent="3.75 COLLECTION · "+t("community").toUpperCase();
  $("#contributorName").value=localStorage.getItem("sw375-contributor-name")||"";
  renderPending();
  $("#masterInfo").textContent=t("currentMaster")+" "+(state.masterVersion||t("unknown"));
}
function contributionPayload(){
  const items=[];
  for(const [c,a] of Object.entries(state.categories||{})){
    for(const r of a||[]){
      if(!r.contribute)continue;
      const proposed=pickMasterFields(r);
      // If user changed master-relevant fields, send visible user value.
      MASTER_FIELDS.forEach(f=>{
        if((r.fieldUpdated||{})[f])proposed[f]=deep(r[f]);
      });
      if(r.userCreated){
        MASTER_FIELDS.forEach(f=>{if(r[f]!==undefined)proposed[f]=deep(r[f])});
      }
      if(r.shareImage&&r.localImage)proposed.masterImage=r.localImage;
      items.push({
        category:c,id:r.id,name:N(r),userCreated:!!r.userCreated,
        proposed,contributionNote:r.contributionNote||"",
        hasSharedImage:!!(r.shareImage&&r.localImage)
      });
    }
  }
  return{
    format:"SW375_COMMUNITY_CONTRIBUTION",formatVersion:1,
    createdAt:now(),contributor:$("#contributorName").value.trim()||"",
    basedOnMaster:state.masterVersion||"",
    items
  };
}
function downloadJson(obj,name){
  const b=new Blob([JSON.stringify(obj,null,2)],{type:"application/json"}),a=document.createElement("a");
  a.href=URL.createObjectURL(b);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}

$("#emailContribution").onclick=()=>{
  localStorage.setItem("sw375-contributor-name",$("#contributorName").value.trim());
  const p=contributionPayload();
  if(!p.items.length){alert(t("noContribution"));return}
  const payload=JSON.stringify(p,null,2);
  const subject="3.75 Collection – Master Update Suggestion";
  const sender=p.contributor?("Contributor: "+p.contributor+"\n"):"";
  const body=
    "3.75 Collection community master suggestion.\n\n"+
    sender+
    "Based on master: "+(p.basedOnMaster||"?")+"\n"+
    "Items in package: "+p.items.length+"\n\n"+
    "The attached JSON contains only MASTER suggestions. Personal Owned/Wanted collection status is not included.";
  try{
    if(window.AndroidShare && typeof window.AndroidShare.sendMasterSuggestion==="function"){
      window.AndroidShare.sendMasterSuggestion(payload,subject,body);
      return;
    }
  }catch(err){}
  // PC/web fallback: download the JSON and open a pre-addressed email draft.
  downloadJson(p,"SW375_Community_Contribution_"+new Date().toISOString().slice(0,10)+".json");
  alert(t("emailFallback"));
  const mailto="mailto:corvellus92@gmail.com?subject="+encodeURIComponent(subject)+"&body="+
    encodeURIComponent(body+"\n\nPlease attach the downloaded JSON suggestion package.");
  window.location.href=mailto;
};

$("#exportContribution").onclick=()=>{
  localStorage.setItem("sw375-contributor-name",$("#contributorName").value.trim());
  const p=contributionPayload();
  if(!p.items.length){alert(t("noContribution"));return}
  downloadJson(p,"SW375_Community_Contribution_"+new Date().toISOString().slice(0,10)+".json");
};
$("#importContribution").onclick=()=>$("#contributionFile").click();
$("#contributionFile").onchange=async e=>{
  try{
    const x=JSON.parse(await e.target.files[0].text());
    if(x.format!=="SW375_COMMUNITY_CONTRIBUTION"||!Array.isArray(x.items))throw 0;
    x.items.forEach(it=>{
      state.pendingContributions.push({
        pendingId:"P-"+Date.now()+"-"+Math.random().toString(36).slice(2,7),
        contributor:x.contributor||"Ismeretlen",
        createdAt:x.createdAt||now(),basedOnMaster:x.basedOnMaster||"",
        ...it
      });
    });
    save();renderPending();
  }catch(e){alert(t("invalidContribution"));}
};
function diffText(p){
  const target=(state.categories?.[p.category]||[]).find(r=>r.id===p.id)||null;
  if(!target)return t("newEntry");
  const dif=[];
  for(const f of MASTER_FIELDS){
    if(p.proposed?.[f]===undefined)continue;
    const oldv=JSON.stringify(target.masterFields?.[f]??target[f]??null);
    const newv=JSON.stringify(p.proposed[f]);
    if(oldv!==newv)dif.push(f+": "+String(target.masterFields?.[f]??target[f]??"")+" → "+String(p.proposed[f]));
  }
  return dif.length?dif.join("\n"):t("noDiff");
}
function renderPending(){
  const a=state.pendingContributions||[];
  $("#pendingStats").textContent=a.length+" "+t("pendingReview");
  $("#pendingList").innerHTML=a.map(p=>`
    <div class="pendingCard">
      <div class="pendingTitle">${E(p.name||p.proposed?.entity||"Névtelen")} <span class="chip">${E(labels()[p.category]||p.category)}</span></div>
      <div class="hint">${t("contributor")} ${E(p.contributor||t("unknown"))} · ${t("base")}: ${E(p.basedOnMaster||"?")}</div>
      ${p.proposed?.masterImage?`<img class="pendingImg" src="${p.proposed.masterImage}">`:""}
      <div class="pendingDiff">${E(diffText(p))}</div>
      ${p.contributionNote?`<div class="hint">${t("notePrefix")} ${E(p.contributionNote)}</div>`:""}
      <div class="toolbar"><button data-accept="${p.pendingId}">✓ ${t("accept")}</button><button data-reject="${p.pendingId}" class="danger">${t("reject")}</button></div>
    </div>`).join("");
  document.querySelectorAll("[data-accept]").forEach(b=>b.onclick=()=>acceptPending(b.dataset.accept));
  document.querySelectorAll("[data-reject]").forEach(b=>b.onclick=()=>rejectPending(b.dataset.reject));
}
function acceptPending(pid){
  const i=state.pendingContributions.findIndex(x=>x.pendingId===pid);if(i<0)return;
  const p=state.pendingContributions[i];
  if(!state.categories[p.category])state.categories[p.category]=[];
  let r=state.categories[p.category].find(x=>x.id===p.id);
  if(!r){
    r=normalizeRecord({id:p.id||("MASTER-"+Date.now()+"-"+Math.random().toString(36).slice(2,7)),...deep(p.proposed),owned:false,wanted:false,count:0,note:"",localImage:"",userCreated:false,fieldUpdated:{},modifiedAt:now()},now());
    r.masterFields=deep(p.proposed);
    r.masterImage=p.proposed?.masterImage||"";
    state.categories[p.category].push(r);
  }else{
    applyMasterFields(r,p.proposed,true);
    r.modifiedAt=now();
  }
  state.pendingContributions.splice(i,1);save();renderPending();homeCounts();
}
function rejectPending(pid){const i=state.pendingContributions.findIndex(x=>x.pendingId===pid);if(i>=0){state.pendingContributions.splice(i,1);save();renderPending()}}
$("#acceptAllPending").onclick=()=>{while(state.pendingContributions.length)acceptPending(state.pendingContributions[0].pendingId)};
$("#clearPending").onclick=()=>{if(confirm("Törlöd az összes várakozó javaslatot?")){state.pendingContributions=[];save();renderPending()}};

function makeMasterUpdate(){
  const categories={};
  for(const [c,a] of Object.entries(state.categories||{})){
    categories[c]=(a||[]).filter(r=>!r.userCreated||Object.keys(r.masterFields||{}).length>1).map(r=>{
      const mf=deep(r.masterFields||pickMasterFields(r));
      mf.id=r.id;
      return mf;
    });
  }
  return{
    format:"SW375_MASTER_UPDATE",formatVersion:1,
    masterVersion:"community-"+new Date().toISOString().slice(0,10)+"-"+Date.now(),
    createdAt:now(),categories
  };
}
$("#exportMaster").onclick=()=>downloadJson(makeMasterUpdate(),"SW375_Master_Update_"+new Date().toISOString().slice(0,10)+".json");
$("#importMaster").onclick=()=>$("#masterFile").click();
$("#masterFile").onchange=async e=>{
  try{
    const x=JSON.parse(await e.target.files[0].text());
    if(x.format!=="SW375_MASTER_UPDATE"||!x.categories)throw 0;
    importMasterUpdate(x);
    alert(t("masterUpdated"));
    $("#masterInfo").textContent=t("currentMaster")+" "+state.masterVersion;
  }catch(e){alert(t("invalidMaster"));}
};
function importMasterUpdate(x){
  for(const [c,arr] of Object.entries(x.categories||{})){
    if(!state.categories[c])state.categories[c]=[];
    for(const mf of arr||[]){
      let r=state.categories[c].find(z=>z.id===mf.id);
      if(!r){
        r=normalizeRecord({id:mf.id,...deep(mf),owned:false,wanted:false,count:0,note:"",localImage:"",fieldUpdated:{},modifiedAt:now()},now());
        r.masterFields=deep(mf);r.masterImage=mf.masterImage||"";
        state.categories[c].push(r);
      }else applyMasterFields(r,mf,true);
    }
  }
  state.masterVersion=x.masterVersion||("import-"+now());
  save();homeCounts();
}

function globalSearch(){
  screen="globalSearch";cat=null;sub=null;show("globalSearch");$("#back").style.display="block";$("#title").textContent="3.75 COLLECTION · "+t("search").toUpperCase();
  $("#globalQ").focus();renderGlobal();
}
function renderGlobal(){
  const q=$("#globalQ").value.trim().toLowerCase();
  let rows=[];
  const gc=$('#globalCategory').value,gs=$('#globalStatus').value,sort=$('#globalSort').value;
  if(q.length>=1){
    for(const [c,a] of Object.entries(state.categories||{})){
      if(gc&&c!==gc)continue;
      for(const r of a||[]){
        const hay=[N(r),r.subcategory,r.species,r.media,r.canon,...(r.factions||[]),...(r.aliases||[]),...(r.knownReleases||[])].join(" ").toLowerCase();
        if(hay.includes(q))rows.push({c,r});
      }
    }
  }
  rows=rows.filter(x=>gs==='all'||(gs==='owned'&&isOwned(x.r))||(gs==='wanted'&&x.r.wanted)||(gs==='missing'&&!isOwned(x.r)));
  rows.sort((a,b)=>sort==='nameDesc'?-nameCompare(a.r,b.r):sort==='category'?(a.c.localeCompare(b.c)||nameCompare(a.r,b.r)):sort==='recent'?(String(b.r.modifiedAt||'').localeCompare(String(a.r.modifiedAt||''))||nameCompare(a.r,b.r)):nameCompare(a.r,b.r));
  $('#globalMore').style.display=rows.length>globalLimit?'block':'none';
  $("#globalCount").textContent=rows.length;
  $("#globalOwned").textContent=rows.filter(x=>x.r.owned||Number(x.r.count)>0).length;
  $("#globalWanted").textContent=rows.filter(x=>x.r.wanted).length;
  $("#globalCats").textContent=new Set(rows.map(x=>x.c)).size;
  $("#globalList").innerHTML=q.length<1?`<div class="hint" style="padding:25px;text-align:center">${t("searchMin")}</div>`:rows.slice(0,globalLimit).map(({c,r})=>`
    <article class="item">
      <div class="pic">${imageHtml(r,c)}</div>
      <div>
        <div class="name">${E(N(r))}</div>
        <div class="meta">${E(labels()[c]||c)} · ${E(subLabel(r.subcategory||"Egyéb"))}${r.species&&r.species!=="Unknown / Other"?` · ${E(r.species)}`:""}</div>
        <div class="chips">${chips(r)}</div>
        <div class="actions"><button data-open-result="${E(r.id)}" data-open-cat="${E(c)}">${t("open")}</button></div>
      </div>
    </article>`).join("");
  document.querySelectorAll("[data-open-result]").forEach(b=>b.onclick=()=>{
    const c=b.dataset.openCat,id=b.dataset.openResult,r=(state.categories[c]||[]).find(x=>x.id===id);
    if(!r)return;
    cat=c;sub=r.subcategory||"Egyéb";screen="browser";show("browser");$("#back").style.display="block";
    $("#title").textContent=`3.75 COLLECTION · ${(labels()[c]||c).toUpperCase()} · ${subLabel(sub)}`;
    fillFilters();$("#q").value=N(r);render();
  });
  hydrateAutoImages($("#globalSearch"));
}


let itemView=localStorage.getItem("sw375-item-view")||"tiles";
let browserLimit=120,globalLimit=100,batchMode=false;
const batchSelected=new Set();
function sorted(rows,mode){
 const x=[...rows];x.sort((a,b)=>mode==='nameDesc'?-nameCompare(a,b):mode==='owned'?(Number(isOwned(b))-Number(isOwned(a))||nameCompare(a,b)):mode==='wanted'?(Number(!!b.wanted)-Number(!!a.wanted)||nameCompare(a,b)):mode==='recent'?(String(b.modifiedAt||'').localeCompare(String(a.modifiedAt||''))||nameCompare(a,b)):nameCompare(a,b));return x;
}
function batchStatus(){
 $('#batchBar').hidden=!batchMode;$('#batchStart').classList.toggle('on',batchMode);
 $('#batchCount').textContent=batchSelected.size+' '+(lang==='hu'?'kijelölve':lang==='de'?'ausgewählt':'selected');
 document.querySelectorAll('#list [data-item-id]').forEach(el=>el.classList.toggle('batch-selected',batchSelected.has(el.dataset.itemId)));
}
function batchDone(){batchMode=false;batchSelected.clear();render()}
function bulkApply(mode){
 const rows=A().filter(r=>batchSelected.has(r.id));if(!rows.length)return;
 if(!confirm((lang==='hu'?'Módosítod ezt a ':lang==='de'?'Ändern: ':'Change ')+rows.length+'?'))return;
 rows.forEach(r=>{if(mode==='owned'||mode==='missing'){r.owned=mode==='owned';r.count=mode==='owned'?Math.max(1,Number(r.count)||0):0;touch(r,['owned','count'])}
 else{r.wanted=mode==='wanted';touch(r,['wanted'])}});
 save();homeCounts();batchDone();
}
$('#batchStart').onclick=()=>{batchMode=!batchMode;batchSelected.clear();render()};
$('#batchDone').onclick=batchDone;
$('#batchVisible').onclick=()=>{document.querySelectorAll('#list [data-item-id]').forEach(el=>batchSelected.add(el.dataset.itemId));batchStatus()};
[['batchOwned','owned'],['batchMissing','missing'],['batchWanted','wanted'],['batchUnwanted','unwanted']].forEach(([id,k])=>$('#'+id).onclick=()=>bulkApply(k));
$('#browserMore').onclick=()=>{browserLimit+=120;render()};
$('#globalMore').onclick=()=>{globalLimit+=100;renderGlobal()};
$('#browserSort').onchange=()=>{browserLimit=120;render()};
['globalCategory','globalStatus','globalSort'].forEach(id=>$('#'+id).onchange=()=>{globalLimit=100;renderGlobal()});
$('#browserCsv').onclick=()=>csvExport('all',cat);

function updateItemView(){
 const l=$("#list");if(!l)return;
 l.classList.toggle("tiles",itemView==="tiles");
 $("#viewGrid")?.classList.toggle("selected",itemView==="tiles");
 $("#viewList")?.classList.toggle("selected",itemView==="list");
}
$("#viewGrid").onclick=()=>{itemView="tiles";localStorage.setItem("sw375-item-view",itemView);updateItemView()};
$("#viewList").onclick=()=>{itemView="list";localStorage.setItem("sw375-item-view",itemView);updateItemView()};
function render(){
  const q=$("#q").value.trim().toLowerCase(),ff=$("#factionFilter").value,sf=$("#speciesFilter").value;
  const all=sub===ALL_SUB?A():A().filter(x=>(x.subcategory||"Egyéb")===sub);
  let f=all.filter(r=>{const h=[N(r),r.subcategory,r.media,r.canon,r.note,r.species,...(r.factions||[]),...(r.aliases||[]),...(r.knownReleases||[])].join(" ").toLowerCase();return(!q||h.includes(q))&&(!ff||(r.factions||[]).includes(ff))&&(!sf||r.species===sf)&&tabok(r)});
  f=sorted(f,$('#browserSort').value);
  $('#browserShown').textContent=Math.min(f.length,browserLimit)+' / '+f.length;
  $('#browserMore').style.display=f.length>browserLimit?'block':'none';
  const visible=f.slice(0,browserLimit);
  const owned=all.filter(x=>x.owned||Number(x.count)>0).length;
  $("#allc").textContent=all.length;$("#ownc").textContent=owned;$("#wantc").textContent=all.filter(x=>x.wanted).length;$("#pctc").textContent=all.length?Math.round(owned/all.length*100)+"%":"0%";
  $("#list").innerHTML=visible.map(r=>`<article class="item ${r.owned||Number(r.count)>0?"owned-tile":""}" data-item-id="${r.id}" onclick="if(itemView==='tiles')details('${r.id}')"><div class="pic" onclick="details('${r.id}')">${imageHtml(r,cat)}</div><div><div class="name" onclick="details('${r.id}')">${E(N(r))}</div><div class="meta">${E(subLabel(r.subcategory||"Egyéb"))}${r.canon?` · ${E(r.canon)}`:""}${Number(r.count)>0?` · ${r.count} db`:""}${r.species&&r.species!=="Unknown / Other"?` · ${E(r.species)}`:""}</div><div class="chips">${chips(r)}</div><div class="actions"><button class="${r.owned||Number(r.count)>0?"on":""}" onclick="toggle('${r.id}','owned')">✓ ${t("owned")}</button><button class="${r.wanted?"on":""}" onclick="toggle('${r.id}','wanted')">★ ${t("wanted")}</button><button onclick="details('${r.id}')">${t("edit")}</button></div></div></article>`).join("");  hydrateAutoImages($("#browser"));updateItemView();batchStatus();
}

// Tile interactions: tap toggles Owned, hold (550 ms) opens edit.
let tilePress=null;
let tileSuppressClickUntil=0;
const tileList=$("#list");
function activeTile(e){
 if(itemView!=="tiles"||batchMode)return null;
 const tile=e.target.closest(".item[data-item-id]");
 return tile&&tileList.contains(tile)?tile:null;
}
function cancelTilePress(){
 if(tilePress){clearTimeout(tilePress.timer);tilePress=null;}
}
tileList.addEventListener('click',e=>{if(!batchMode)return;const tile=e.target.closest('.item[data-item-id]');if(!tile)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();if(batchSelected.has(tile.dataset.itemId))batchSelected.delete(tile.dataset.itemId);else batchSelected.add(tile.dataset.itemId);batchStatus()},true);
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

window.toggle=(id,k)=>{const r=A().find(x=>x.id===id);if(!r)return;if(k==="owned"){r.owned=!(r.owned||Number(r.count)>0);if(r.owned&&Number(r.count)===0)r.count=1;if(!r.owned)r.count=0;touch(r,["owned","count"])}else{r[k]=!r[k];touch(r,[k])}save();render();homeCounts()}

function grid(id,selected=[]){const set=new Set(selected);$(id).innerHTML=FACTIONS.map(f=>`<label class="factionOpt"><input type="checkbox" value="${E(f)}" ${set.has(f)?"checked":""}>${E(f)}</label>`).join("")}
function selected(id){return[...$(id).querySelectorAll('input:checked')].map(x=>x.value).filter(x=>FACTIONS.includes(x))}
function speciesOptions(id,val){$(id).innerHTML=SPECIES.map(s=>`<option value="${E(s)}" ${s===val?"selected":""}>${E(s)}</option>`).join("")}

window.details=id=>{const r=A().find(x=>x.id===id);if(!r)return;cur=id;$("#dtitle").textContent=N(r);$("#editName").value=N(r);$("#editSub").value=r.subcategory||"Egyéb";$("#editCanon").value=r.canon||"";$("#editCount").value=Number(r.count||0);$("#editMedia").value=r.media||"";$("#editNote").value=r.note||"";grid("#editFactions",r.factions||[]);speciesOptions("#editSpecies",r.species||"Unknown / Other");$("#shareCandidate").checked=!!r.contribute;$("#shareImage").checked=!!r.shareImage;$("#contributionNote").value=r.contributionNote||"";const im=r.localImage||r.masterImage||r.masterFields?.masterImage||r.imageUrl||"";$("#dimg").src=im;$("#dimg").style.display=im?"block":"none";$("#dlg").showModal();if(!im){fetchAutoImage(cat,r.id).then(()=>{const rr=A().find(x=>x.id===r.id);const ii=rr?.localImage||rr?.masterImage||rr?.masterFields?.masterImage||rr?.imageUrl||"";if(ii){$("#dimg").src=ii;$("#dimg").style.display="block"}})}}
$("#saveEdit").onclick=()=>{const r=A().find(x=>x.id===cur);if(!r)return;r.entity=$("#editName").value.trim()||N(r);r.release=r.entity;r.subcategory=$("#editSub").value.trim()||"Egyéb";r.canon=$("#editCanon").value;r.count=Math.max(0,Number($("#editCount").value||0));r.owned=r.count>0;r.factions=selected("#editFactions");r.species=cleanS($("#editSpecies").value);r.media=$("#editMedia").value.trim();r.note=$("#editNote").value.trim();r.contribute=$("#shareCandidate").checked;r.shareImage=$("#shareImage").checked;r.contributionNote=$("#contributionNote").value.trim();r.factionSource="User selection / SWGOH.GG vocabulary";r.speciesSource="User selection";touch(r,["entity","release","subcategory","canon","count","owned","factions","species","media","note"]);save();$("#dlg").close();enter(cat)}
$("#deleteItem").onclick=()=>{const r=A().find(x=>x.id===cur);if(!r||!confirm(`${t("confirmDelete")}: ${N(r)}?`))return;const k=recordKey(cat,r);state.deleted[k]=now();const i=A().findIndex(x=>x.id===cur);if(i>=0)A().splice(i,1);save();$("#dlg").close();enter(cat)}
$("#pickimg").onclick=()=>$("#imgfile").click();$("#imgfile").onchange=e=>{const f=e.target.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{const r=A().find(x=>x.id===cur);r.localImage=rd.result;touch(r,["localImage"]);save();$("#dlg").close();render();details(cur)};rd.readAsDataURL(f)}
function fillCat(){$("#newCat").innerHTML=Object.entries(labels()).map(([k,v])=>`<option value="${k}" ${k===cat?"selected":""}>${E(v)}</option>`).join("")}
$("#addItem").onclick=()=>{fillCat();$("#newName").value="";$("#newSub").value=sub||"";$("#newCanon").value="";$("#newCount").value=0;$("#newMedia").value="";$("#newNote").value="";grid("#newFactions",[]);speciesOptions("#newSpecies","Unknown / Other");$("#addDlg").showModal()}
$("#createItem").onclick=()=>{const c=$("#newCat").value,n=$("#newName").value.trim();if(!n){alert(t("giveName"));return}const cnt=Math.max(0,Number($("#newCount").value||0)),t=now(),r=normalizeRecord({id:"USR-"+Date.now()+"-"+Math.random().toString(36).slice(2,8),entity:n,release:n,subcategory:$("#newSub").value.trim()||"Egyéb",canon:$("#newCanon").value,count:cnt,owned:cnt>0,wanted:false,factions:selected("#newFactions"),species:cleanS($("#newSpecies").value),media:$("#newMedia").value.trim(),note:$("#newNote").value.trim(),userCreated:true,contribute:false,shareImage:false,contributionNote:"",masterFields:{},fieldUpdated:{},modifiedAt:t},t);touch(r,MERGE_FIELDS);state.categories[c].push(r);save();$("#addDlg").close();if(c===cat)enter(cat);homeCounts()}

function exp(){const b=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="3.75_Collection_SYNC_v18.json";a.click()}$("#exportBtn").onclick=exp;$("#importBtn").onclick=()=>$("#importFile").click();$("#importFile").onchange=async e=>{try{const x=JSON.parse(await e.target.files[0].text());if(!x.categories)throw 0;x.schema=18;if(!x.deleted)x.deleted={};Object.values(x.categories).flat().forEach(r=>normalizeRecord(r,x.updatedAt));state=mergeStates(state,x);save();$("#syncDlg").close();home();alert("A mentést összefésültem a jelenlegi adatokkal.")}catch(e){alert(t("invalidBackup"))}}

function syncOpen(){$("#syncUrl").value=localStorage.getItem("sw375-sync-url")||"";$("#syncStatus").textContent=t("syncSameWifi");$("#syncDlg").showModal()}$("#syncTop").onclick=syncOpen;$("#syncHere").onclick=syncOpen;
async function pull(){const u=$("#syncUrl").value.trim().replace(/\/$/,"");if(!u)return;localStorage.setItem("sw375-sync-url",u);try{const r=await fetch(u+"/sync",{cache:"no-store"});if(!r.ok)throw new Error(await r.text());const x=await r.json();x.schema=18;if(!x.deleted)x.deleted={};Object.values(x.categories).flat().forEach(z=>normalizeRecord(z,x.updatedAt));state=x;save();$("#syncStatus").textContent="✓ PC → eszköz kész";homeCounts();if(screen==="browser")render()}catch(e){$("#syncStatus").textContent=t("error")+" "+e.message}}
async function push(){const u=$("#syncUrl").value.trim().replace(/\/$/,"");if(!u)return;localStorage.setItem("sw375-sync-url",u);try{save();const r=await fetch(u+"/sync",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(state)});if(!r.ok)throw new Error(await r.text());$("#syncStatus").textContent="✓ Eszköz → PC kész"}catch(e){$("#syncStatus").textContent=t("error")+" "+e.message}}
async function smartMerge(){
  const u=$("#syncUrl").value.trim().replace(/\/$/,"");if(!u){$("#syncStatus").textContent=t("enterPcUrl");return}
  localStorage.setItem("sw375-sync-url",u);$("#syncStatus").textContent=t("merging");
  try{
    let remote=null;
    const rr=await fetch(u+"/sync",{cache:"no-store"});
    if(rr.ok)remote=await rr.json();
    if(!remote||!remote.categories){
      save();
      const pr=await fetch(u+"/sync",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(state)});
      if(!pr.ok)throw new Error(await pr.text());
      $("#syncStatus").textContent="✓ "+t("firstSync");return;
    }
    remote.schema=18;if(!remote.deleted)remote.deleted={};Object.values(remote.categories).flat().forEach(z=>normalizeRecord(z,remote.updatedAt));
    state=mergeStates(state,remote);save();
    const pr=await fetch(u+"/sync",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(state)});
    if(!pr.ok)throw new Error(await pr.text());
    $("#syncStatus").textContent="✓ "+t("syncDone");
    homeCounts();if(screen==="browser")render();
  }catch(e){$("#syncStatus").textContent=t("error")+" "+e.message}
}
$("#pullSync").onclick=pull;$("#pushSync").onclick=push;$("#mergeSync").onclick=smartMerge;


let wishLimit=50;
const isOwned=r=>!!(r.owned||Number(r.count)>0);
const nameCompare=(a,b)=>N(a).localeCompare(N(b),lang==='hu'?'hu':lang==='de'?'de':'en');
function dashboardOpen(){
 screen='dashboard';cat=null;sub=null;show('dashboard');$('#back').style.display='block';
 $('#title').textContent='3.75 COLLECTION · '+(lang==='hu'?'ÁTTEKINTÉS':lang==='de'?'ÜBERSICHT':'OVERVIEW');renderDashboard();
}
function dashboardItem(c,id){
 const r=(state.categories[c]||[]).find(x=>x.id===id);if(!r)return;
 cat=c;sub=ALL_SUB;screen='browser';show('browser');$('#back').style.display='block';$('#title').textContent='3.75 COLLECTION · '+(labels()[c]||c);fillFilters();$('#q').value=N(r);render();
}
function renderDashboard(){
 const all=Object.entries(state.categories||{}).flatMap(([c,arr])=>(arr||[]).map(r=>({c,r})));
 const owned=all.filter(x=>isOwned(x.r)),wish=all.filter(x=>x.r.wanted);
 const count=all.reduce((a,x)=>a+Math.max(0,Number(x.r.count)||0),0),pct=all.length?Math.round(100*owned.length/all.length):0;
 $('#dashTitle').textContent=lang==='hu'?'Gyűjtemény áttekintése':lang==='de'?'Sammlungsübersicht':'Collection overview';
 $('#dashByCategory').textContent=lang==='hu'?'Kategóriák':'Categories';$('#dashWishlistTitle').textContent=lang==='hu'?'Kívánságlista':'Wishlist';
 $('#dashTotal').textContent=all.length;$('#dashOwned').textContent=owned.length;$('#dashWanted').textContent=wish.length;$('#dashCopies').textContent=count;
 $('#dashPercent').textContent=pct+'% '+t('complete');$('#dashBar').style.width=pct+'%';
 $('#dashCategories').innerHTML=Object.keys(labels()).map(c=>{const a=state.categories[c]||[],n=a.filter(isOwned).length;return '<button class="dashRow" data-dash-cat="'+E(c)+'"><span>'+icon(c)+' '+E(labels()[c])+'</span><b>'+n+'/'+a.length+'</b></button>'}).join('');
 document.querySelectorAll('[data-dash-cat]').forEach(b=>b.onclick=()=>enter(b.dataset.dashCat));
 const q=$('#dashWishQ').value.trim().toLowerCase();
 const filtered=wish.filter(x=>!q||[N(x.r),x.r.subcategory,x.c,...(x.r.aliases||[])].join(' ').toLowerCase().includes(q)).sort((a,b)=>nameCompare(a.r,b.r));
 $('#dashMore').style.display=filtered.length>wishLimit?'block':'none';
 $('#dashWishlist').innerHTML=filtered.length?filtered.slice(0,wishLimit).map(({c,r})=>'<div class="dashWish"><div><b>'+E(N(r))+'</b><small>'+E(labels()[c]||c)+'</small></div><button data-wish-cat="'+E(c)+'" data-wish-id="'+E(r.id)+'">'+t('open')+'</button></div>').join(''):'<div class="hint">'+(lang==='hu'?'Nincs találat.':'No wishlist items.')+'</div>';
 document.querySelectorAll('[data-wish-id]').forEach(b=>b.onclick=()=>dashboardItem(b.dataset.wishCat,b.dataset.wishId));
}
$('#dashWishQ').oninput=()=>{wishLimit=50;renderDashboard()};
$('#dashMore').onclick=()=>{wishLimit+=50;renderDashboard()};
function csvCell(v){let s=Array.isArray(v)?v.join(' | '):String(v??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'}
function csvExport(mode='all',category=''){
 const rows=Object.entries(state.categories||{}).flatMap(([c,a])=>category&&c!==category?[]:(a||[]).filter(r=>mode==='all'||(mode==='owned'&&isOwned(r))||(mode==='wanted'&&r.wanted)).map(r=>({c,r})));
 rows.sort((a,b)=>a.c.localeCompare(b.c)||nameCompare(a.r,b.r));
 const data=[['Category','Name','Subcategory','Owned','Wanted','Quantity','Species','Factions','Releases','Notes','ID'],...rows.map(({c,r})=>[labels()[c]||c,N(r),r.subcategory||'',isOwned(r)?'Yes':'No',r.wanted?'Yes':'No',Number(r.count)||0,r.species||'',r.factions||[],r.knownReleases||[],r.note||'',r.id])];
 const blob=new Blob(['\uFEFF'+data.map(row=>row.map(csvCell).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='3.75_Collection_'+(category||'all')+'_'+mode+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
}
$('#dashCsvAll').onclick=()=>csvExport('all');$('#dashCsvOwned').onclick=()=>csvExport('owned');$('#dashCsvWanted').onclick=()=>csvExport('wanted');$('#dashBackup').onclick=()=>exp();
const baseLanguage=applyLanguageStatic;
applyLanguageStatic=function(){baseLanguage();$('#txDashboard').textContent=lang==='hu'?'Gyűjtemény áttekintése':lang==='de'?'Sammlungsübersicht':'Collection overview';$('#txDashboardDesc').textContent=lang==='hu'?'Statisztika, kívánságlista, export':lang==='de'?'Statistik, Wunschliste, Export':'Progress, wishlist and exports';};


const dashboardLanguage=applyLanguageStatic;
applyLanguageStatic=function(){
 dashboardLanguage();
 const old=$('#globalCategory').value;
 $('#globalCategory').innerHTML='<option value="">'+E(lang==='hu'?'Minden kategória':lang==='de'?'Alle Kategorien':'All categories')+'</option>'+Object.entries(labels()).map(([c,n])=>'<option value="'+E(c)+'">'+E(n)+'</option>').join('');
 $('#globalCategory').value=old;
 const st=$('#globalStatus'),v=st.value;st.innerHTML=[['all',t('all')],['owned',t('owned')],['wanted',t('wanted')],['missing',t('missing')]].map(([k,n])=>'<option value="'+k+'">'+E(n)+'</option>').join('');st.value=v;
 $('#batchStart').textContent=lang==='hu'?'☑ Kijelölés':lang==='de'?'☑ Auswählen':'☑ Select';
 $('#batchVisible').textContent=lang==='hu'?'Láthatók kijelölése':'Select visible';
 $('#batchDone').textContent=lang==='hu'?'Kész':'Done';
 $('#batchOwned').textContent='✓ '+t('owned');$('#batchMissing').textContent='✕ '+t('missing');$('#batchWanted').textContent='★ '+t('wanted');
};
const originalEnter=enter;
enter=function(c){batchMode=false;batchSelected.clear();browserLimit=120;originalEnter(c)};

$("#langSelect").onchange=e=>{lang=e.target.value;localStorage.setItem("sw375-language",lang);applyLanguageStatic();if(screen==="home")home();else if(screen==="submenu"&&cat)enter(cat);else if(screen==="browser"&&cat&&sub)openSub(sub);else if(screen==="globalSearch")globalSearch();else if(screen==="dashboard")dashboardOpen();else if(screen==="community")communityOpen()};document.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>enter(b.dataset.cat));$("#dashboardBtn").onclick=dashboardOpen;$("#globalSearchBtn").onclick=globalSearch;$("#communityBtn").onclick=communityOpen;$("#globalQ").oninput=()=>{globalLimit=100;renderGlobal()};$("#back").onclick=back;$("#q").oninput=()=>{browserLimit=120;render()};$("#factionFilter").onchange=()=>{browserLimit=120;render()};$("#speciesFilter").onchange=()=>{browserLimit=120;render()};document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{document.querySelector("[data-tab].active")?.classList.remove("active");b.classList.add("active");tab=b.dataset.tab;render()});applyLanguageStatic();
home();


// desktopNavV118: desktop navigation, keyboard controls, and quick backup.
(function(){
 const nav=document.querySelector('#desktopNav');
 if(!nav)return;
 const navButtons=[...nav.querySelectorAll('[data-desktop-route]')];
 const labels={
  hu:{home:'Kezdőlap',dashboard:'Áttekintés',search:'Keresés',community:'Közösség / Master',backup:'Biztonsági mentés',sync:'Szinkron',desc:'Teljes gyűjtemény • keresés • listák • mentés és szinkron',items:'tétel'},
  en:{home:'Home',dashboard:'Overview',search:'Search',community:'Community / Master',backup:'Backup',sync:'Sync',desc:'Complete catalog • search • lists • backup and sync',items:'items'},
  de:{home:'Startseite',dashboard:'Übersicht',search:'Suche',community:'Community / Master',backup:'Sicherung',sync:'Sync',desc:'Gesamtkatalog • Suche • Listen • Backup und Sync',items:'Einträge'}
 };
 function updateNav(){
  const t=labels[lang]||labels.en;
  document.querySelectorAll('[data-nav-tx]').forEach(x=>x.textContent=t[x.dataset.navTx]||x.dataset.navTx);
  document.querySelector('#desktopWelcomeDesc').textContent=t.desc;
  const total=Object.values(state.categories||{}).reduce((n,arr)=>n+(arr||[]).length,0);
  document.querySelector('#desktopCatalogCount').textContent=total.toLocaleString(lang==='hu'?'hu-HU':lang==='de'?'de-DE':'en-US')+' '+t.items;
  const selected=screen==='browser'||screen==='submenu'?'home':screen;
  navButtons.forEach(b=>{if(b.dataset.desktopRoute===selected)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  document.querySelector('#desktopWelcome').style.display=screen==='home'?'':'none';
 }
 function route(name){
  if(name==='home')home();
  else if(name==='dashboard')dashboardOpen();
  else if(name==='globalSearch')globalSearch();
  else if(name==='community')communityOpen();
  updateNav();
 }
 navButtons.forEach(b=>b.addEventListener('click',()=>route(b.dataset.desktopRoute)));
 document.querySelector('#desktopBackup').addEventListener('click',()=>exp());
 document.querySelector('#desktopSync').addEventListener('click',()=>syncOpen());
 const originalShow=show;
 show=function(id){originalShow(id);queueMicrotask(updateNav)};
 const originalLang=document.querySelector('#langSelect').onchange;
 document.querySelector('#langSelect').onchange=function(e){originalLang.call(this,e);updateNav()};
 document.addEventListener('keydown',function(e){
  const target=e.target;
  const typing=target instanceof HTMLElement&&(target.matches('input,textarea,select')||target.isContentEditable);
  const dlgOpen=!!document.querySelector('dialog[open]');
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){
   e.preventDefault();if(dlgOpen)return;
   if(screen!=='globalSearch')route('globalSearch');
   document.querySelector('#globalQ').focus();document.querySelector('#globalQ').select();
   return;
  }
  if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key.toLowerCase()==='s'){
   e.preventDefault();exp();return;
  }
  if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key.toLowerCase()==='d'){
   e.preventDefault();if(!dlgOpen)route('dashboard');return;
  }
  if(e.key==='/'&&!typing&&!dlgOpen&&!e.ctrlKey&&!e.altKey&&!e.metaKey){
   e.preventDefault();if(screen!=='globalSearch')route('globalSearch');
   document.querySelector('#globalQ').focus();return;
  }
  if(e.altKey&&e.key==='ArrowLeft'&&!dlgOpen){e.preventDefault();back();return}
  if(e.key==='Escape'&&!dlgOpen&&screen!=='home'&&!typing){back()}
 });
 updateNav();
})();
