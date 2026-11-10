import assert from 'node:assert/strict';
import {chromium,devices} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
for(const profile of [{name:'desktop',options:{viewport:{width:1280,height:800}}},{name:'mobile',options:devices['iPhone 13']}]){
 const ctx=await browser.newContext(profile.options),page=await ctx.newPage();
 await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1',{waitUntil:'domcontentloaded'});
 await page.locator('#language-select').selectOption('fr');
 assert.equal(await page.locator('#results-heading').textContent(),'Résultats');
 assert.equal(await page.locator('#compare-title').textContent(),'Comparateur');
 assert.equal(await page.locator('#close-detail').textContent(),'Fermer la fiche');
 assert.equal(await page.locator('#close-detail use').getAttribute('href'),'./assets/ui/icons.svg#close');
 assert.equal(await page.locator('#compare-output').textContent(),'Todavía no hay establecimientos seleccionados.');
 await page.locator('#language-select').selectOption('es');
 assert.equal(await page.locator('#results-heading').textContent(),'Resultados');
 assert.equal(await page.locator('#compare-title').textContent(),'Comparador');
 await page.locator('#language-select').selectOption('en');
 assert.equal(await page.locator('#results-heading').textContent(),'Results');
 await page.waitForFunction(()=>state.places.length===43);
 const counts={
  es:['0 lugares','1 lugar','32 lugares'],
  en:['0 places','1 place','32 places'],
  fr:['0 établissement','1 établissement','32 établissements']
 };
 const emptyMessages={
  es:'No hay establecimientos que coincidan con los filtros seleccionados. Los horarios y servicios de las cartas generales siguen sin verificar.',
  en:'No places match your filters. Opening hours and services for general menus remain unverified.',
  fr:'Aucun établissement ne correspond aux filtres sélectionnés. Les horaires et les services des cartes générales restent à vérifier.'
 };
 const scenarios=[['zz-no-existe-qa','',0],['La Montillana','Salmorejo',1],['','Flamenquín',32]];
 for(const language of ['es','fr','en','es']){
  await page.locator('#language-select').selectOption(language);
  for(const [index,[venue,dish,total]] of scenarios.entries()){
   await page.locator('#place-name').fill(venue);
   await page.locator('#dish').fill(dish);
   await page.locator('#search-button').click();
   assert.equal(await page.locator('#results article').count(),total);
   assert.equal(await page.locator('#count').textContent(),counts[language][index]);
   if(!total)assert.equal(await page.locator('#results .empty').textContent(),emptyMessages[language]);
  }
 }
 await ctx.close();console.log('FR RESULTS PILOT '+profile.name+' PASS');
}
await browser.close();
