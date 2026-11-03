import assert from 'node:assert/strict';
import {chromium,devices} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
for(const profile of [{name:'desktop',options:{viewport:{width:1280,height:800}}},{name:'mobile',options:devices['iPhone 13']}]){
 const ctx=await browser.newContext(profile.options),page=await ctx.newPage();
 await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.some(p=>p.id==='la-montillana'));
 await page.locator('#language-select').selectOption('fr');
 await page.evaluate(()=>showPlace(state.places.find(p=>p.id==='la-montillana'),false));
 await page.waitForFunction(()=>[...document.querySelectorAll('#detail-content h3')].some(x=>x.textContent==='Sources et date'));
 assert.ok((await page.locator('#detail-content h3').allTextContents()).includes('Sources et date'));
 assert.equal(await page.locator('#detail-content .fav-button').textContent(),'☆ Enregistrer','FR detail save button');
 // The source link's visible label is translated, without changing its href.
 const sourceLink=page.locator('#detail-content [data-source-label-es]').filter({hasText:'Carte officielle — site de l’établissement'}).first();
 await sourceLink.waitFor();
 const sourceHref=await sourceLink.getAttribute('href');
 assert.ok(sourceHref,'Source must retain a destination');

 assert.ok((await page.locator('#detail-content .map-button').allTextContents()).includes('📍 Voir la carte'),'FR detail map button');
 // Inspect rendered presentation labels only; dish names must remain unchanged.
 const portionRows=page.locator('#detail-content [data-venue-menu-price-label]');
 const frLabels=await portionRows.allTextContents();
 assert.ok(frLabels.length>0,'Documented price labels present in Montillana');
 // Test explicit UI labels with a deterministic DOM fixture, independent of each venue's source wording.
 const fixture=await page.evaluate(()=>{
   const row=document.createElement('span');
   row.dataset.venueMenuPriceLabel='Media ración';
   row.textContent='Media ración';
   row.id='qa-fr-portion-fixture';
   document.querySelector('#detail-content').append(row);
   return true;
 });
 assert.ok(fixture);
 await page.waitForFunction(()=>document.querySelector('#qa-fr-portion-fixture')?.textContent==='Demi-portion');
 assert.equal(await page.locator('#qa-fr-portion-fixture').textContent(),'Demi-portion','FR explicit half-portion label');
 const frLabelsAfterFixture=await portionRows.allTextContents();
 const prohibited=new Set(['Ración','Media ración','1/2 ración','Unidad','Full portion','Half portion','Single item']);
 for(const label of frLabelsAfterFixture)assert.ok(!prohibited.has(label.trim()),'FR portion label not localized: '+label);
 // Verify a documented compound label keeps its year and historic-price qualification.
 await page.locator('#qa-fr-portion-fixture').evaluate(node=>{
   node.dataset.venueMenuPriceLabel='Media ración · precio de carta 2024';
   node.textContent='Media ración · precio de carta 2024';
 });
 await page.waitForFunction(()=>document.querySelector('#qa-fr-portion-fixture')?.textContent==='Demi-portion · prix de la carte 2024');
 assert.equal(await page.locator('#qa-fr-portion-fixture').textContent(),'Demi-portion · prix de la carte 2024');
 await page.locator('#qa-fr-portion-fixture').evaluate(node=>node.remove());
 // Regression for a source label outside the original four-venue pilot.
 await page.evaluate(()=>showPlace(state.places.find(p=>p.id==='taberna-salinas'),false));
 const salinasSource=page.locator('#detail-content [data-source-label-es]').filter({hasText:'Carte officielle de Taberna Salinas (plats et desserts ; sans prix)'});
 assert.equal(await salinasSource.count(),1,'FR Salinas source link');
 const salinasHref=await salinasSource.getAttribute('href');
 await page.locator('#language-select').selectOption('es');
 assert.ok((await page.locator('#detail-content [data-source-label-es]').allTextContents()).some(v=>v.includes('Carta oficial de Taberna Salinas (platos y postres; sin precios)')),'ES Salinas source restored');
 await page.locator('#language-select').selectOption('fr');
 assert.ok((await page.locator('#detail-content [data-source-label-es]').allTextContents()).some(v=>v.includes('Carte officielle de Taberna Salinas (plats et desserts ; sans prix)')),'FR Salinas source restored');
 assert.equal(await page.locator('#detail-content [data-source-label-es]').first().getAttribute('href'),salinasHref,'Source link unchanged');
 // Small follow-up sweep: preserve original labels and source URLs across FR/ES/EN/FR.
 for(const venue of [
  {id:'taberna-plateros-san-francisco',pairs:[['Carta oficial del restaurante','Carte officielle du restaurant']]},
  {id:'taberna-la-viuda',pairs:[['Carta oficial de La Viuda','Carte officielle de La Viuda'],['Web oficial y ubicación','Site officiel et localisation']]},
  {id:'casa-bravo-1919',pairs:[['Carta oficial con formatos e importes','Carte officielle avec formats de portions et prix']]},
  {id:'sociedad-plateros-maria-auxiliadora',pairs:[['Turismo de Córdoba: especialidades y dirección','Tourisme de Cordoue : spécialités et adresse'],['Información del establecimiento','Informations sur l’établissement'],['Carta del restaurante transcrita por el usuario, con precios publicados','Carte du restaurant transcrite par l’utilisateur, avec prix publiés']]},
  {id:'taberna-el-numero-10',pairs:[['Cocina y especialidades oficiales','Cuisine et spécialités présentées sur le site officiel'],['Dirección y contacto oficial','Adresse et coordonnées officielles'],['Carta oficial PDF · 4 páginas (septiembre de 2025 en la URL; vigencia no garantizada)','Carte officielle PDF · 4 pages (septembre 2025 indiqué dans l’URL ; validité non garantie)']]},
  {id:'el-churrasco',pairs:[['Carta y especialidades oficiales','Carte et spécialités présentées sur le site officiel'],['Dirección y contacto oficiales','Adresse et coordonnées officielles'],['Carta QR del restaurante, sin fecha (PDF aportado por el usuario)','Carte QR du restaurant, non datée (PDF fourni par l’utilisateur)']]},
  {id:'cafeteria-don-pepe-ciudad-jardin',pairs:[['Ficha y dirección de Don Pepe Ciudad Jardín','Fiche et adresse de Don Pepe Ciudad Jardín'],['Opiniones y especialidades','Avis et spécialités'],['Web del establecimiento · especialidades de churrería','Site de l’établissement · spécialités de churrería'],['Carta publicada por usuarios · referencia externa (Restaurant Guru; vigencia no confirmada)','Carte publiée par des utilisateurs · source externe (Restaurant Guru ; validité non confirmée)']]},
  {id:'cafeteria-don-pepe-centro',pairs:[['Ficha y dirección de Don Pepe Centro','Fiche et adresse de Don Pepe Centro'],['Información orientativa del establecimiento','Informations indicatives sur l’établissement'],['Carta transcrita de la búsqueda de Google por Helio · origen y vigencia no verificados','Carte transcrite par Helio à partir d’une recherche Google · origine et validité non vérifiées']]},
  {id:'patio-romano',pairs:[['Carta oficial 2026 (PDF facilitado; comidas y precios)','Carte officielle 2026 (PDF fourni ; plats et prix)'],['Carta oficial de desayunos 2026 (PDF aportado por Helio; sin verificación independiente de vigencia)','Carte officielle des petits-déjeuners 2026 (PDF fourni par Helio ; validité non vérifiée de manière indépendante)'],['Menús oficiales 2025–2026 — Moschea di Cordova y Giudecca di Cordova (web del restaurante; consulta 27/10/2026)','Menus officiels 2025–2026 — Moschea di Cordova et Giudecca di Cordova (site du restaurant ; consulté le 27/10/2026)']]},
  {id:'taberna-el-abuelo',pairs:[['Ficha de Turismo de Córdoba','Fiche de l’Office de tourisme de Cordoue'],['Historia y especialidades','Histoire et spécialités']]},
  {id:'la-piscatoria',pairs:[['Carta oficial de comida y dulces','Carte officielle des plats et pâtisseries'],['Carta oficial de bebidas y cafés','Carte officielle des boissons et cafés']]},
  {id:'la-cazuela-esparteria',pairs:[['Carta y cocina tradicional oficiales','Carte officielle et cuisine traditionnelle'],['Carta general · capturas facilitadas por el usuario (11 imágenes, octubre 2026)','Carte générale · captures fournies par l’utilisateur (11 images, octobre 2026)']]},
  {id:'la-taberna-del-rio',pairs:[['Carta general bilingüe con precios · PDF facilitado por el usuario','Carte générale bilingue avec prix · PDF fourni par l’utilisateur'],['Menús para grupos 2026 · PDF oficial','Menus pour groupes 2026 · PDF officiel']]},
  {id:'restaurante-puerta-sevilla',pairs:[['Web y cocina oficial','Site officiel et cuisine présentée'],['Platos del menú degustación','Plats du menu dégustation'],['Carta digital oficial en inglés (versión independiente; puede diferir de la española)','Carte numérique officielle en anglais (version distincte ; peut différer de la version espagnole)']]},
  {id:'posada-caballo-andaluz',pairs:[['Web oficial y cocina tradicional','Site officiel et cuisine traditionnelle'],['Menú degustación y platos','Menu dégustation et plats']]},
  {id:'bodegas-campos',pairs:[['Menús oficiales','Menus officiels'],['Menú degustación Tradición (66 €/persona, mínimo 2, máximo 4)','Menu dégustation Tradición (66 €/personne, minimum 2, maximum 4)'],['Carta oficial en español e inglés (PDF facilitados por el usuario)','Carte officielle en espagnol et en anglais (PDF fournis par l’utilisateur)']]},
  {id:'casa-pepe-juderia',pairs:[['Official restaurant, bar and dessert menus (PDF provided, May 2026)','Cartes officielles du restaurant, du bar et des desserts (PDF fourni, mai 2026)']]},
  {id:'taberna-san-miguel-el-pisto',pairs:[['Carta oficial Casa El Pisto · edición conmemorativa 1974–2024 · precios históricos (vigencia en 2026 sin verificar)','Carte officielle Casa El Pisto · édition commémorative 1974–2024 · prix historiques (validité en 2026 non vérifiée)'],['Carta general oficial sin importes visibles','Carte générale officielle sans prix visibles'],['Dirección y web oficial','Adresse et site officiel'],['Carta oficial en inglés, edición conmemorativa 2024','Carte officielle en anglais, édition commémorative 2024']]},
  {id:'bar-moriles-original',pairs:[['Ficha del restaurante con dirección y especialidades','Fiche du restaurant avec adresse et spécialités'],['Ficha con información sobre desayunos','Fiche avec informations sur les petits-déjeuners']]},
  {id:'dtapas-covap-cordoba',pairs:[["Carta oficial D'Tapas COVAP Córdoba completa","Carte officielle complète de D'Tapas COVAP Córdoba"],['Presentación oficial COVAP','Présentation officielle de COVAP']]},
  {id:'cafeteria-bar-la-jineta',pairs:[['Carta publicada por el establecimiento en Queresto','Carte publiée par l’établissement sur Queresto']]},
  {id:'la-bandera-cafe',pairs:[['Carta oficial de La Bandera — desayunos, meriendas y comida','Carte officielle de La Bandera — petits-déjeuners, goûters et repas']]},
  {id:'con-acento-braseria',pairs:[['Carta general y tapas oficiales (PDF facilitados)','Carte générale et carte des tapas officielles (PDF fournis)']]},
  {id:'el-burlaero',pairs:[['Carta oficial de El Burlaero (PDF facilitado; la carta no asigna formatos a todos los precios)','Carte officielle de El Burlaero (PDF fourni ; la carte ne précise pas le format de portion pour tous les prix)']]},
  {id:'taberna-la-sal',pairs:[['Carta publicada en web del restaurante; transcripción facilitada por usuario','Carte publiée sur le site du restaurant ; transcription fournie par l’utilisateur']]},
  {id:'taberna-museo-manolete',pairs:[['Carta de Taberna Ágora/Museo Manolete (web del establecimiento)','Carte de Taberna Ágora/Museo Manolete (site de l’établissement)']]},
  {id:'agora-mezquita',pairs:[['Información de establecimientos del grupo Ágora (captura aportada por el usuario)','Informations sur les établissements du groupe Ágora (capture fournie par l’utilisateur)'],['Carta individual de Ágora Mezquita y fotografías oficiales aportadas por el usuario','Carte propre à Ágora Mezquita et photographies officielles fournies par l’utilisateur']]},
  {id:'churros-bar-marta',pairs:[['Ficha de Churros Bar Marta y horario publicado','Fiche de Churros Bar Marta et horaires publiés'],['Opiniones con especialidades de desayuno','Avis mentionnant des spécialités de petit-déjeuner'],['Carta de desayunos y bollería publicada en churrosbarmarta.shop (autoría del sitio sin verificar)','Carte des petits-déjeuners et viennoiseries publiée sur churrosbarmarta.shop (identité de l’éditeur du site non vérifiée)']]}
 ]){
  await page.evaluate(id=>showPlace(state.places.find(p=>p.id===id),false),venue.id);
  const getLinks=()=>page.locator('#detail-content [data-source-label-es]').evaluateAll(nodes=>nodes.map(n=>({original:n.dataset.sourceLabelEs,text:n.textContent.trim(),href:n.getAttribute('href')})));
  const fr=await getLinks();
  for(const [es,translated] of venue.pairs){
   const link=fr.find(x=>x.original===es);
   assert.ok(link,'Missing FR source '+venue.id+' / '+es);
   assert.equal(link.text,translated+' ↗','FR label '+venue.id);
   assert.ok(link.href,'Source URL '+venue.id);
  }
  await page.locator('#language-select').selectOption('es');
  const esLinks=await getLinks();
  for(const [es] of venue.pairs)assert.equal(esLinks.find(x=>x.original===es)?.text,es+' ↗','ES source restored '+venue.id);
  await page.locator('#language-select').selectOption('en');
  const enLinks=await getLinks();
  for(const [es] of venue.pairs)assert.ok(enLinks.find(x=>x.original===es)?.text,'EN source present '+venue.id);
  await page.locator('#language-select').selectOption('fr');
  const restored=await getLinks();
  for(const [es,translated] of venue.pairs)assert.equal(restored.find(x=>x.original===es)?.text,translated+' ↗','FR source restored '+venue.id);
  assert.deepEqual(restored.map(x=>x.href),fr.map(x=>x.href),'URLs unchanged '+venue.id);
 }
 // Moriles Ribera: inspect actual source labels without assuming editorial translations.
 await page.evaluate(()=>showPlace(state.places.find(p=>p.id==='moriles-ribera'),false));
 const riberaLinks=()=>page.locator('#detail-content [data-source-label-es]').evaluateAll(nodes=>nodes.map(n=>({original:n.dataset.sourceLabelEs,text:n.textContent.trim(),href:n.getAttribute('href')})));
 const riberaFr=await riberaLinks();
 assert.ok(riberaFr.length>0,'Moriles Ribera source links present');
 const riberaTranslations=[
  ['Carta digital oficial de Moriles Ribera (índice)','Carte numérique officielle de Moriles Ribera (index)'],
  ['Carta española oficial · ensaladas y entrantes (archivo febrero 2026)','Carte officielle en espagnol · salades et entrées (archive de février 2026)'],
  ['Carta española oficial · ibéricos, tostas, risottos y pastas (febrero 2026)','Carte officielle en espagnol · charcuteries ibériques, tartines, risottos et pâtes (février 2026)'],
  ['Carta española oficial · revueltos, verduras y pescados (febrero 2026)','Carte officielle en espagnol · œufs brouillés garnis, légumes et poissons (février 2026)'],
  ['Carta española oficial · carnes (febrero 2026)','Carte officielle en espagnol · viandes (février 2026)'],
  ['Carta española oficial · guisos, infantil y combinados (febrero 2026)','Carte officielle en espagnol · plats mijotés, plats pour enfants et assiettes composées (février 2026)'],
  ['Carta española oficial · postres (marzo 2026)','Carte officielle en espagnol · desserts (mars 2026)'],
  ['Carta inglesa de contraste · archivos 2025 (no mezclar importes)','Carte anglaise de comparaison · archives de 2025 (ne pas mélanger les prix)'],
  ['Menú especial Tapas Cordobesas · carta oficial','Menu spécial « Tapas Cordobesas » · carte officielle'],
  ['Postres · carta oficial marzo 2026','Desserts · carte officielle de mars 2026'],
  ['Cafés, chocolates e infusiones · carta oficial','Cafés, chocolats chauds et infusions · carte officielle'],
  ['Suggested Menu · menú especial inglés','Suggested Menu · menu spécial en anglais'],
  ['Glossary · glosario gastronómico oficial inglés','Glossary · glossaire gastronomique officiel en anglais']
 ];
 for(const [original,translated] of riberaTranslations){
  const link=riberaFr.find(x=>x.original===original);
  assert.ok(link,'Moriles Ribera source missing: '+original);
  assert.equal(link.text,translated+' ↗','Moriles Ribera French label: '+original);
 }

 for(const link of riberaFr){assert.ok(link.original,'Moriles Ribera original source label');assert.ok(link.href,'Moriles Ribera source URL');}
 await page.locator('#language-select').selectOption('es');
 const riberaEs=await riberaLinks();
 assert.deepEqual(riberaEs.map(x=>x.href),riberaFr.map(x=>x.href),'Moriles Ribera source URLs FR/ES');
 for(const link of riberaEs)assert.equal(link.text,link.original+' ↗','Moriles Ribera ES label restored');
 await page.locator('#language-select').selectOption('en');
 const riberaEn=await riberaLinks();
 assert.deepEqual(riberaEn.map(x=>x.href),riberaFr.map(x=>x.href),'Moriles Ribera source URLs FR/EN');
 for(const link of riberaEn)assert.ok(link.text,'Moriles Ribera EN source label');
 await page.locator('#language-select').selectOption('fr');
 const riberaRestored=await riberaLinks();
 assert.deepEqual(riberaRestored,riberaFr,'Moriles Ribera FR source labels restored');
 const riberaCandidates=riberaRestored.filter(x=>x.text===x.original+' ↗').map(x=>x.original);
 console.log('FR MORILES RIBERA SOURCE CANDIDATES '+profile.name+' '+JSON.stringify(riberaCandidates));
 // Moriles Casa Fina: isolate this branch's source labels from Moriles Ribera.
 const casaFinaId='moriles-casa-fina';
 await page.evaluate(id=>{
  const place=state.places.find(p=>p.id===id);
  if(!place)throw Error('Moriles Casa Fina record not found');
  showPlace(place,false);
 },casaFinaId);
 const casaFinaLinks=()=>page.locator('#detail-content [data-source-label-es]').evaluateAll(nodes=>nodes.map(n=>({original:n.dataset.sourceLabelEs,text:n.textContent.trim(),href:n.getAttribute('href')})));
 const casaFinaFr=await casaFinaLinks();
 assert.ok(casaFinaFr.length>0,'Moriles Casa Fina source links present');
 const casaFinaTranslations=[
  ['Nuestra cocina (carta española)','Notre cuisine (carte en espagnol)'],
  ['Menú Tapas Cordobesas','Menu « Tapas Cordobesas »'],
  ['Postres','Desserts'],
  ['Cafés y chocolates','Cafés et chocolats'],
  ['Carta inglesa','Carte en anglais'],
  ['Menús sugeridos','Menus suggérés'],
  ['Glosario','Glossaire'],
  ['Menús de eventos','Menus pour événements']
 ];
 for(const [original,translated] of casaFinaTranslations){
  const entry=casaFinaFr.find(x=>x.original===original);
  assert.ok(entry,'Moriles Casa Fina source missing: '+original);
  assert.equal(entry.text,translated+' ↗','Moriles Casa Fina French source: '+original);
 }

 for(const link of casaFinaFr){assert.ok(link.original,'Moriles Casa Fina original source label');assert.ok(link.href,'Moriles Casa Fina source URL');}
 await page.locator('#language-select').selectOption('es');
 const casaFinaEs=await casaFinaLinks();
 assert.deepEqual(casaFinaEs.map(x=>x.href),casaFinaFr.map(x=>x.href),'Moriles Casa Fina source URLs FR/ES');
 for(const link of casaFinaEs)assert.equal(link.text,link.original+' ↗','Moriles Casa Fina ES label restored');
 await page.locator('#language-select').selectOption('en');
 const casaFinaEn=await casaFinaLinks();
 assert.deepEqual(casaFinaEn.map(x=>x.href),casaFinaFr.map(x=>x.href),'Moriles Casa Fina source URLs FR/EN');
 for(const link of casaFinaEn)assert.ok(link.text,'Moriles Casa Fina EN source label');
 await page.locator('#language-select').selectOption('fr');
 const casaFinaRestored=await casaFinaLinks();
 assert.deepEqual(casaFinaRestored,casaFinaFr,'Moriles Casa Fina FR labels restored');
 const casaFinaCandidates=casaFinaRestored.filter(x=>x.text===x.original+' ↗').map(x=>x.original);
 console.log('FR MORILES CASA FINA SOURCE CANDIDATES '+profile.name+' '+JSON.stringify(casaFinaCandidates));
 // Roldán Centro is distinct from the generic Roldán cafeterias directory.
 const roldanCentroId=await page.evaluate(()=>{
  const matches=state.places.filter(p=>/rold[aá]n/i.test(p.name||'') && /centro/i.test(p.name||''));
  if(matches.length!==1)throw Error('Expected one Roldán Centro record, found '+matches.length);
  return matches[0].id;
 });
 await page.evaluate(id=>showPlace(state.places.find(p=>p.id===id),false),roldanCentroId);
 const roldanCentroLinks=()=>page.locator('#detail-content [data-source-label-es]').evaluateAll(nodes=>nodes.map(n=>({original:n.dataset.sourceLabelEs,text:n.textContent.trim(),href:n.getAttribute('href')})));
 const roldanCentroFr=await roldanCentroLinks();
 assert.ok(roldanCentroFr.length>0,'Roldán Centro sources present');
 const roldanCentroTranslations=[
  ['Carta oficial Pastelería Centro; precios de barra y mesa, disponibilidad variable','Carte officielle de Pastelería Centro ; prix au comptoir et en salle, disponibilité variable'],
  ['Carta oficial desayunos Centro: tostadas y precios; disponibilidad durante merienda sin confirmar','Carte officielle des petits-déjeuners de Centro : tartines et prix ; disponibilité au goûter non confirmée']
 ];
 for(const [original,translated] of roldanCentroTranslations){
  const source=roldanCentroFr.find(x=>x.original===original);
  assert.ok(source,'Roldán Centro source missing: '+original);
  assert.equal(source.text,translated+' ↗','Roldán Centro FR label '+original);
 }

 for(const link of roldanCentroFr){assert.ok(link.original,'Roldán Centro original source label');assert.ok(link.href,'Roldán Centro source URL');}
 await page.locator('#language-select').selectOption('es');
 const roldanCentroEs=await roldanCentroLinks();
 assert.deepEqual(roldanCentroEs.map(x=>x.href),roldanCentroFr.map(x=>x.href),'Roldán Centro source URLs FR/ES');
 for(const link of roldanCentroEs)assert.equal(link.text,link.original+' ↗','Roldán Centro ES label restored');
 await page.locator('#language-select').selectOption('en');
 const roldanCentroEn=await roldanCentroLinks();
 assert.deepEqual(roldanCentroEn.map(x=>x.href),roldanCentroFr.map(x=>x.href),'Roldán Centro source URLs FR/EN');
 for(const link of roldanCentroEn)assert.ok(link.text,'Roldán Centro EN source label');
 await page.locator('#language-select').selectOption('fr');
 const roldanCentroRestored=await roldanCentroLinks();
 assert.deepEqual(roldanCentroRestored,roldanCentroFr,'Roldán Centro FR labels restored');
 const roldanCentroCandidates=roldanCentroRestored.filter(x=>x.text===x.original+' ↗').map(x=>x.original);
 console.log('FR ROLDAN CENTRO SOURCE CANDIDATES '+profile.name+' '+JSON.stringify(roldanCentroCandidates));
 // La Tarterie Centro: inspect sources without changing variable product-price notices.
 await page.evaluate(()=>{
  const place=state.places.find(p=>p.id==='la-tarterie-centro');
  if(!place)throw Error('La Tarterie Centro record not found');
  showPlace(place,false);
 });
 const tarterieLinks=()=>page.locator('#detail-content [data-source-label-es]').evaluateAll(nodes=>nodes.map(n=>({original:n.dataset.sourceLabelEs,text:n.textContent.trim(),href:n.getAttribute('href')})));
 const tarterieFr=await tarterieLinks();
 assert.ok(tarterieFr.length>0,'La Tarterie sources present');
 for(const link of tarterieFr){assert.ok(link.original,'La Tarterie original source label');assert.ok(link.href,'La Tarterie source URL');}
 await page.locator('#language-select').selectOption('es');
 const tarterieEs=await tarterieLinks();
 assert.deepEqual(tarterieEs.map(x=>x.href),tarterieFr.map(x=>x.href),'La Tarterie URLs FR/ES');
 for(const link of tarterieEs)assert.equal(link.text,link.original+' ↗','La Tarterie ES source restored');
 await page.locator('#language-select').selectOption('en');
 const tarterieEn=await tarterieLinks();
 assert.deepEqual(tarterieEn.map(x=>x.href),tarterieFr.map(x=>x.href),'La Tarterie URLs FR/EN');
 for(const link of tarterieEn)assert.ok(link.text,'La Tarterie EN label');
 await page.locator('#language-select').selectOption('fr');
 const tarterieRestored=await tarterieLinks();
 assert.deepEqual(tarterieRestored,tarterieFr,'La Tarterie FR source restored');
 const tarterieCandidates=tarterieRestored.filter(x=>x.text===x.original+' ↗').map(x=>x.original);
 console.log('FR LA TARTERIE SOURCE CANDIDATES '+profile.name+' '+JSON.stringify(tarterieCandidates));
 // Closure check for the four venues flagged in FR CATALOG SWEEP.
 // The exact translation tests above guard wording and URLs; this guards remaining Spanish labels.
 const sweepVenueIds=['la-tarterie-centro','moriles-casa-fina','moriles-ribera','pastelerias-roldan-centro'];
 let sourceCount=0;
 for(const venueId of sweepVenueIds){
  await page.evaluate(id=>{
   const place=state.places.find(p=>p.id===id);
   if(!place)throw Error('Sweep venue not found '+id);
   showPlace(place,false);
  },venueId);
  const labels=await page.locator('#detail-content [data-source-label-es]').evaluateAll(nodes=>nodes.map(n=>({
   original:(n.dataset.sourceLabelEs||'').trim(),
   displayed:(n.textContent||'').replace(/\s*↗\s*$/,'').trim(),
   href:n.getAttribute('href')
  })));
  assert.ok(labels.length>0,'No sources for '+venueId);
  for(const item of labels){
   assert.ok(item.href,'Source URL missing for '+venueId);
   assert.notEqual(item.displayed,item.original,'Untranslated French source label for '+venueId+': '+item.original);
  }
  sourceCount+=labels.length;
 }
 assert.equal(sourceCount,24,'Expected 24 source links across the four sweep venues');
 console.log('FR FOUR VENUE SOURCES CLEAN '+profile.name+' '+sourceCount+'/24');
 // Full active-catalog source-label regression. El Caballo Rojo is excluded while temporarily closed.
 const activeSourceIds=await page.evaluate(()=>state.places.filter(p=>p.id!=='el-caballo-rojo').map(p=>p.id));
 assert.equal(activeSourceIds.length,43,'Expected 43 active/catalogue venues for FR source audit');
 let activeSourcesChecked=0;
 for(const venueId of activeSourceIds){
  await page.evaluate(id=>showPlace(state.places.find(p=>p.id===id),false),venueId);
  const sourceRows=await page.locator('#detail-content [data-source-label-es]').evaluateAll(nodes=>nodes.map(n=>({
   original:(n.dataset.sourceLabelEs||'').trim(),
   text:(n.textContent||'').replace(/\\s*↗\\s*$/,'').trim(),
   href:n.getAttribute('href')
  })));
  for(const item of sourceRows){
   assert.ok(item.original,'Missing source original label: '+venueId);
   assert.ok(item.href?.startsWith('https://'),'Missing HTTPS source: '+venueId);
   assert.notEqual(item.text,item.original,'FR source unchanged: '+venueId+' / '+item.original);
  }
  activeSourcesChecked+=sourceRows.length;
 }
 assert.equal(activeSourcesChecked,104,'Expected 104 sources across 43 non-exception venues');
 console.log('FR ACTIVE CATALOG SOURCES '+profile.name+' '+activeSourcesChecked+'/104 PASS (El Caballo Rojo excluded)');
 await page.evaluate(()=>showPlace(state.places.find(p=>p.id==='la-montillana'),false));
 const titles=await page.locator('#detail-content .menu-dish h4').allTextContents();
 assert.ok(titles.length>0);
 await page.evaluate(()=>{const place=state.places.find(p=>Array.isArray(p.locations)&&p.locations.length);if(!place)throw Error('Roldan directory missing');showPlace(place,false);});
 assert.ok((await page.locator('#detail-content').innerText()).includes('📍 Établissements Roldán à Cordoue'),'FR Roldan heading');
 assert.ok((await page.locator('#detail-content').innerText()).includes('Les boulangeries figurent uniquement comme adresses'),'FR Roldan menu scope');
 const roldanTypes=page.locator('#detail-content li span[data-bilingual-es]');
 assert.ok(await roldanTypes.count()>0,'Roldan location type labels present');
 for(const label of await roldanTypes.allTextContents())assert.ok(['Boulangerie :','Café :'].includes(label.trim()),'FR Roldan location type: '+label);

 await page.evaluate(()=>showPlace(state.places.find(p=>p.id==='la-montillana'),false));
 await page.locator('#language-select').selectOption('es');
 assert.ok((await page.locator('#detail-content h3').allTextContents()).includes('Fuentes y fecha'));
 assert.ok((await page.locator('#detail-content [data-source-label-es]').allTextContents()).some(x=>x.includes('Carta oficial — web del establecimiento')),'ES source label restored');
 assert.deepEqual(await page.locator('#detail-content .menu-dish h4').allTextContents(),titles);
 await page.locator('#language-select').selectOption('en');
 assert.ok((await page.locator('#detail-content h3').allTextContents()).includes('Sources and date'));
 assert.equal(await page.locator('#detail-content [data-source-label-es]').first().getAttribute('href'),sourceHref,'Source URL preserved');
 assert.deepEqual(await page.locator('#detail-content .menu-dish h4').allTextContents(),titles);
 await ctx.close();console.log('FR DETAIL SHELL '+profile.name+' PASS');
}
await browser.close();
