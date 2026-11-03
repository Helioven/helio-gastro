import assert from 'node:assert/strict';
import {chromium,devices} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
for(const profile of [{name:'desktop',options:{viewport:{width:1280,height:800}}},{name:'mobile',options:devices['iPhone 13']}]){
 const ctx=await browser.newContext(profile.options),page=await ctx.newPage();
 await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.some(p=>p.id==='la-montillana'));
 await page.locator('#language-select').selectOption('fr');
 await page.evaluate(()=>showPlace(state.places.find(p=>p.id==='la-montillana'),false));
 const detail=page.locator('#detail-content');
 await page.waitForFunction(()=>document.querySelector('#detail-content')?.textContent.includes('Dernière consultation :'));
 assert.ok((await detail.textContent()).includes('Le coût total d’un repas ici n’est pas documenté.'));
 const names=await page.locator('#detail-content .menu-dish h4').allTextContents();
 await page.locator('#language-select').selectOption('es');
 assert.ok((await detail.textContent()).includes('El coste total de comer aquí no está documentado.'));
 assert.ok((await detail.textContent()).includes('Última consulta: '));
 assert.deepEqual(await page.locator('#detail-content .menu-dish h4').allTextContents(),names);
 await page.locator('#language-select').selectOption('en');
 assert.deepEqual(await page.locator('#detail-content .menu-dish h4').allTextContents(),names);
 await page.locator('#language-select').selectOption('fr');
 await page.evaluate(()=>showPlace(state.places.find(p=>p.id==='casa-rubio'),false));
 const rubio=page.locator('#detail-content .service-notice');
 await rubio.waitFor();
 await page.waitForFunction(()=>document.querySelector('#detail-content .service-notice')?.textContent.startsWith('Informations sur la carte :'));
 const rubioFr=await rubio.textContent();
 assert.ok(rubioFr.includes('octobre 2025'));
 await page.locator('#language-select').selectOption('es');
 assert.ok((await rubio.textContent()).startsWith('Información sobre la carta:'));
 await page.locator('#language-select').selectOption('en');
 assert.notEqual(await rubio.textContent(),rubioFr);
 await page.locator('#language-select').selectOption('fr');
 await page.waitForFunction(()=>document.querySelector('#detail-content .service-notice')?.textContent.startsWith('Informations sur la carte :'));
 // Casa Rubio: protect original prices and historical publication terms on language round-trips.
 await page.locator('#language-select').selectOption('es');
 const rubioEs=await rubio.textContent();
 assert.ok(rubioEs.includes('octubre de 2025'));
 await page.locator('#language-select').selectOption('fr');
 await page.waitForFunction(()=>document.querySelector('#detail-content .service-notice')?.textContent.startsWith('Informations sur la carte :'));
 assert.ok((await rubio.textContent()).includes('octobre 2025'));
 await page.locator('#language-select').selectOption('en');
 assert.ok((await rubio.textContent()).length>0);
 // Beatillas: verify the already documented 2025 historical-price notice across languages.
 await page.locator('#language-select').selectOption('fr');
 await page.evaluate(()=>showPlace(state.places.find(p=>p.id==='rincon-beatillas'),false));
 // Keep the same DOM node across translations; a text-filtered locator stops matching after switching languages.
 const beatillasGeneral=await page.locator('#detail-content > .service-notice').filter({hasText:/carte individuelle officielle|carta individual oficial|individual official menu/i}).elementHandle();
 assert.ok(beatillasGeneral,'Beatillas general notice element present');
 assert.ok((await beatillasGeneral.textContent()).includes('La carte individuelle officielle ne publie pas de prix par plat.'),'FR Beatillas general notice');
 const beatillasNotice=page.locator('#detail-content .beatillas-group-menus > .service-notice');
 await beatillasNotice.waitFor();
 assert.ok((await beatillasNotice.textContent()).includes('Prix historiques des menus complets publiés en 2025'),'FR Beatillas historical menu notice');
 assert.ok((await beatillasNotice.textContent()).includes('non confirmés pour 2026'),'FR Beatillas validity caveat');
 await page.locator('#language-select').selectOption('es');
 assert.ok((await beatillasGeneral.textContent()).includes('La carta individual oficial no publica precios por plato.'),'ES Beatillas general notice restored');
 assert.ok((await beatillasNotice.textContent()).includes('Precios históricos de los menús completos publicados en 2025'),'ES Beatillas notice restored');
 await page.locator('#language-select').selectOption('en');
 assert.ok(!(await beatillasGeneral.textContent()).includes('La carte individuelle officielle'),'EN Beatillas general notice not French');
 assert.ok((await beatillasNotice.textContent()).includes('Historical prices for complete set menus published in 2025'),'EN Beatillas notice restored');
 await page.locator('#language-select').selectOption('fr');
 assert.ok((await beatillasGeneral.textContent()).includes('La carte individuelle officielle ne publie pas de prix par plat.'),'FR Beatillas general notice restored');
 assert.ok((await beatillasNotice.textContent()).includes('Prix historiques des menus complets publiés en 2025'),'FR Beatillas notice restored');
 // Catalog sweep #654: protect key uncertainty notices, preserving their verification dates.
 for(const item of [
   {id:'taberna-salinas',fr:'Prix indicatifs affichés sur le menu Google consulté le 24/10/2026',es:'Precios orientativos mostrados en el menú de Google, consultados el 24/10/2026'},
   {id:'taberna-el-poema-gran-capitan',fr:'Carte partielle indicative établie à partir d’une liste publique fournie le 23/10/2026',es:'Carta parcial orientativa elaborada a partir de un listado público aportado el 23/10/2026'}
 ]){
   await page.evaluate(id=>showPlace(state.places.find(p=>p.id===id),false),item.id);
   await page.waitForFunction(expected=>document.querySelector('#detail-content')?.textContent.includes(expected),item.fr);
   await page.locator('#language-select').selectOption('es');
   assert.ok((await detail.textContent()).includes(item.es),'ES original notice '+item.id);
   await page.locator('#language-select').selectOption('fr');
   await page.waitForFunction(expected=>document.querySelector('#detail-content')?.textContent.includes(expected),item.fr);
 }
 // El Pisto: exact 2024 historic warning must remain qualified in FR and restore in ES.
 await page.evaluate(()=>showPlace(state.places.find(p=>p.id==='taberna-san-miguel-el-pisto'),false));
 const historicFr='Prix historiques de la carte officielle de 2024, non confirmés pour 2026.';
 const historicEs='Precios históricos de carta oficial de 2024; no confirmados en 2026.';
 await page.waitForFunction(expected=>document.querySelector('#detail-content')?.textContent.includes(expected),historicFr);
 await page.locator('#language-select').selectOption('es');
 assert.ok((await detail.textContent()).includes(historicEs),'ES 2024 historic warning restored');
 await page.locator('#language-select').selectOption('fr');
 await page.waitForFunction(expected=>document.querySelector('#detail-content')?.textContent.includes(expected),historicFr);
 // La Tarterie: prices are for whole products, not portions; sizes/options and allergens remain qualified.
 await page.evaluate(()=>showPlace(state.places.find(p=>p.id==='la-tarterie-centro'),false));
 const tarterieNotice=page.locator('#detail-content .service-notice').first();
 const tarterieSource=page.locator('#detail-content [data-source-label-es]').filter({hasText:'Boutique officielle La Tarterie'}).first();
 const tarterieFrNotice='Prix des gâteaux entiers ou des produits salés, et NON à la part. Chaque fourchette dépend de la taille et des options choisies ; vérifiez le prix exact sur la boutique officielle. Les options spéciales ne garantissent pas l’absence d’allergènes.';
 const tarterieEsNotice='Precios de tartas completas o productos salados, NO por porción. Cada rango depende del tamaño y opciones elegidas; consulta el precio exacto en la tienda oficial. Las opciones especiales no garantizan ausencia de alérgenos.';
 await page.waitForFunction(expected=>document.querySelector('#detail-content .service-notice')?.textContent.trim()===expected,tarterieFrNotice);
 assert.equal((await tarterieNotice.textContent()).trim(),tarterieFrNotice,'La Tarterie French caveat');
 await tarterieSource.waitFor();
 assert.equal((await tarterieSource.textContent()).trim(),'Boutique officielle La Tarterie — catalogue et prix par produit ↗','Tarterie source label in French');
 const tarterieUrl=await tarterieSource.getAttribute('href');
 assert.ok(tarterieUrl?.startsWith('https://'),'Tarterie official source URL');
 await page.locator('#language-select').selectOption('es');
 assert.equal((await tarterieNotice.textContent()).trim(),tarterieEsNotice,'La Tarterie Spanish notice restored');
 const tarterieSourceEs=page.locator('#detail-content [data-source-label-es]').filter({hasText:'Tienda oficial La Tarterie'}).first();
 assert.equal((await tarterieSourceEs.textContent()).trim(),'Tienda oficial La Tarterie — catálogo y precios por producto ↗','La Tarterie Spanish source restored');
 await page.locator('#language-select').selectOption('en');
 const tarterieEnNotice=(await tarterieNotice.textContent()).trim();
 assert.ok(tarterieEnNotice && tarterieEnNotice!==tarterieEsNotice && tarterieEnNotice!==tarterieFrNotice,'La Tarterie original English notice present');
 assert.equal(await page.locator('#detail-content [data-source-label-es="Tienda oficial La Tarterie — catálogo y precios por producto"]').getAttribute('href'),tarterieUrl,'La Tarterie source URL unchanged in English');
 await page.locator('#language-select').selectOption('fr');
 assert.equal((await tarterieNotice.textContent()).trim(),tarterieFrNotice,'La Tarterie French notice restored');
 assert.equal((await tarterieSource.textContent()).trim(),'Boutique officielle La Tarterie — catalogue et prix par produit ↗','La Tarterie French source restored');
 assert.equal(await tarterieSource.getAttribute('href'),tarterieUrl,'La Tarterie official source URL unchanged');
 // Moriles Casa Fina historical validity qualifier: preserve the actual documented price.
 await page.evaluate(()=>{
  const place=state.places.find(p=>p.id==='moriles-casa-fina');
  if(!place)throw Error('Moriles Casa Fina missing');
  showPlace(place,false);
 });
 const finaAmount=page.locator('#detail-content .menu-dish > strong').filter({hasText:'Validité à confirmer'}).first();
 await finaAmount.waitFor();
 const frenchAmount=(await finaAmount.textContent()).trim();
 assert.ok(frenchAmount.endsWith(' · Validité à confirmer'),'Casa Fina FR unverified price qualifier');
 const pricePrefix=frenchAmount.slice(0,-' · Validité à confirmer'.length);
 assert.ok(pricePrefix.includes('15')&&pricePrefix.includes('95'),'Casa Fina documented 15.95 menu price preserved');
 await page.locator('#language-select').selectOption('es');
 const spanishAmount=(await page.locator('#detail-content .menu-dish > strong').first().textContent()).trim();
 assert.equal(spanishAmount,pricePrefix+' · Vigencia pendiente de confirmar','Casa Fina original Spanish qualifier restored');
 await page.locator('#language-select').selectOption('en');
 const englishAmount=(await page.locator('#detail-content .menu-dish > strong').first().textContent()).trim();
 assert.ok(englishAmount.startsWith(pricePrefix),'Casa Fina English amount must not change');
 await page.locator('#language-select').selectOption('fr');
 assert.equal((await page.locator('#detail-content .menu-dish > strong').first().textContent()).trim(),frenchAmount,'Casa Fina FR qualifier restored');
 const plain=await ctx.newPage();
 await plain.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded'});
 assert.equal(await plain.locator('#language-select option[value="fr"]').count(),0);
 await plain.locator('#language-select').selectOption('en');
 assert.equal(await plain.locator('#language-select option[value="fr"]').count(),0);
 await plain.close();
 await ctx.close();console.log('FR DETAIL NOTICES '+profile.name+' PASS');
}
await browser.close();
