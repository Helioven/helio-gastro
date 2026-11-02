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
