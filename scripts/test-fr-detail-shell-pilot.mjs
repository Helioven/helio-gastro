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
  {id:'taberna-museo-manolete',pairs:[['Carta de Taberna Ágora/Museo Manolete (web del establecimiento)','Carte de Taberna Ágora/Museo Manolete (site de l’établissement)']]}
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
