// Read-only UI regression: favorites populated and comparator in FR QA, desktop/mobile.
import assert from 'node:assert/strict';
import { chromium, devices } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const profiles=[
 {name:'desktop',options:{viewport:{width:1365,height:900}}},
 {name:'mobile',options:devices['iPhone 13']}
];
const base='http://127.0.0.1:8765/index.html?qa_fr=1';
const folder='qa-reports/fr-favorites-populated';
mkdirSync(folder,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];
for(const profile of profiles){
 const context=await browser.newContext(profile.options);
 const page=await context.newPage();
 const errors=[];
 page.on('pageerror',e=>errors.push('pageerror: '+e.message));
 const select=async lang=>{
  await page.locator('#language-select').selectOption(lang);
  await page.waitForFunction(lang=>document.documentElement.lang===lang,lang);
 };
 const count=async (n,label)=>{
  await page.waitForFunction(([n,label])=>
   document.querySelectorAll('#favorite-list .favorite-entry').length===n &&
   document.querySelector('#favorite-count')?.textContent.trim()===label,[n,label],{timeout:7000});
  assert.equal(await page.locator('#favorite-list .favorite-entry').count(),n);
 };
 try {
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length>=4);
  await page.evaluate(()=>{
   localStorage.removeItem('helio-gastro-favorites-v1');
   localStorage.removeItem('helio-gastro-search-v1');
  });
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length>=4);
  await select('fr');
  await page.locator('[data-service="comida"]').click();
  await count(0,'0 favori');
  await page.locator('#dish').fill('');
  await page.locator('#filters').evaluate(f=>f.requestSubmit());
  await page.waitForFunction(()=>state.filtered.length>=4);
  const cards=page.locator('#results article.place');
  await cards.nth(0).locator('.fav-button').click();
  await count(1,'1 favori');
  await page.locator('#favorite-section').screenshot({path:folder+'/'+profile.name+'-one-fr.png'});
  await cards.nth(1).locator('.fav-button').click();
  await count(2,'2 favoris');
  await page.waitForFunction(()=>[...document.querySelectorAll('#favorite-list .favorite-entry')].every(row=>
    [...row.querySelectorAll('button')].map(el=>el.textContent.trim()).join('|')==='Voir la fiche|📍 Voir la carte|★ Enregistré'));
  await page.locator('#favorite-section').screenshot({path:folder+'/'+profile.name+'-two-fr.png'});
  const ids=await page.evaluate(()=>[...state.favorites].sort());
  for(const [lang,label] of [['es','2 favoritos'],['en','2 favourites'],['fr','2 favoris']]){
   await select(lang);
   await count(2,label);
   const expected=lang==='es'?'Ver ficha|📍 Ver mapa|★ Guardado':
    lang==='en'?'View details|📍 View map|★ Saved':'Voir la fiche|📍 Voir la carte|★ Enregistré';
   await page.waitForFunction(expected=>[...document.querySelectorAll('#favorite-list .favorite-entry')].every(row=>
    [...row.querySelectorAll('button')].map(el=>el.textContent.trim()).join('|')===expected),expected);
  }
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length>=4);
  await select('fr');
  await count(2,'2 favoris');
  const stored=await page.evaluate(()=>[...state.favorites].sort());
  assert.deepEqual(stored,ids,'Favorites did not persist after reload');
  await page.locator('#favorite-list .favorite-entry').first().locator('.fav-button').click();
  await count(1,'1 favori');
  await page.locator('#favorite-list .favorite-entry').first().locator('.fav-button').click();
  await count(0,'0 favori');

  // Comparator: functional selection must also present correctly in French.
  await page.locator('[data-service="comida"]').click();
  await page.locator('#clear-search').click();
  await page.locator('#dish').fill('');
  await page.locator('#filters').evaluate(f=>f.requestSubmit());
  await page.waitForFunction(()=>state.filtered.length>=4);
  const compareButtons=page.locator('#results article.place button[aria-pressed]').filter({hasText:'Comparer'});
  await compareButtons.nth(0).click();
  await compareButtons.nth(1).click();
  await page.waitForFunction(()=>document.querySelectorAll('#compare-output .compare-place').length===2);
  assert.equal((await page.locator('#compare-title').textContent()).trim(),'Comparateur');
  assert.equal((await page.locator('#nav-compare-count').textContent()).trim(),'2');
  await page.waitForFunction(()=>{
    const text=document.querySelector('#compare-output')?.innerText||'';
    return text.includes('Itinéraire à pied entre 2 établissements')
      && text.includes('Plats avec prix publié :')
      && !text.includes('Ruta a pie entre')
      && !text.includes('Platos con precio publicado:')
      && !text.includes('Variante sin categorizar');
   });
   await page.locator('#compare-section').screenshot({path:folder+'/'+profile.name+'-comparator-fr.png'});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2),
   'Horizontal overflow after favorites/comparator');
 } catch(e){ errors.push(e.stack||String(e)); }
 results.push({profile:profile.name,status:errors.length?'FAIL':'PASS',errors});
 await context.close();
}
await browser.close();
const report={suite:'FR populated favorites and comparator',results,status:results.every(x=>x.status==='PASS')?'PASS':'FAIL'};
writeFileSync(folder+'/result.json',JSON.stringify(report,null,2)+'\n');
console.log('FR FAVORITES POPULATED '+JSON.stringify(report));
if(report.status==='FAIL')process.exitCode=1;
