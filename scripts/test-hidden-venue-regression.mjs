import { chromium,devices } from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const base='http://127.0.0.1:8765/index.html';
const hidden='el-caballo-rojo';
const profiles=[{name:'desktop',config:{viewport:{width:1365,height:900}}},{name:'mobile',config:devices['iPhone 13']}];
const modes=[{name:'public',query:''},{name:'qa-fr',query:'?qa_fr=1'}];
mkdirSync('qa-reports',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];let failed=false;
for(const profile of profiles)for(const mode of modes){
 const context=await browser.newContext(profile.config),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push('JS: '+e.message));
 try{
  await page.addInitScript(id=>{
   localStorage.setItem('helio-gastro-favorites-v1',JSON.stringify([id,'la-montillana']));
   localStorage.setItem('helio-gastro-search-v1',JSON.stringify({
    mode:'comida',form:{'place-name':'','dish':'','budget':'','price-scope':'dish','portion':'','area':'','include-unknown':true,'price-kind':'','sort':''},
    selected:[id,'la-montillana']
   }));
  },hidden);
  await page.goto(base+mode.query,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length>0);
  const snapshot=await page.evaluate(id=>({
   catalogExcluded:!state.places.some(p=>p.id===id),
   favoriteExcluded:!state.favorites.has(id),
   selectedExcluded:!state.selected.has(id),
   filterExcluded:!state.filtered.some(p=>p.id===id),
   renderedFavorites:document.querySelector('#favorite-list')?.innerText||'',
   renderedCompare:document.querySelector('#compare-output')?.innerText||'',
   renderedResults:document.querySelector('#results')?.innerText||'',
   detailId:state.currentDetailId
  }),hidden);
  if(!snapshot.catalogExcluded)errors.push('Hidden venue entered active catalog');
  if(!snapshot.favoriteExcluded||/caballo rojo/i.test(snapshot.renderedFavorites))errors.push('Hidden venue in restored favorites');
  if(!snapshot.selectedExcluded||/caballo rojo/i.test(snapshot.renderedCompare))errors.push('Hidden venue in restored comparator');
  if(!snapshot.filterExcluded||/caballo rojo/i.test(snapshot.renderedResults))errors.push('Hidden venue in restored results');
  await page.locator('#language-select').selectOption(mode.name==='qa-fr'?'fr':'es');
  await page.locator('[data-service="comida"]').click();
  await page.locator('#place-name').fill('Caballo Rojo');
  await page.locator('#dish').fill('');
  await page.locator('#filters').evaluate(f=>f.requestSubmit());
  await page.waitForFunction(()=>state.searched);
  const afterSearch=await page.evaluate(id=>({
   matches:state.filtered.map(p=>p.id),
   rendered:document.querySelector('#results')?.innerText||'',
   selected:[...state.selected],
   favoriteIds:[...state.favorites]
  }),hidden);
  if(afterSearch.matches.length||/Restaurante El Caballo Rojo/i.test(afterSearch.rendered))errors.push('Hidden venue exposed by exact-name search');
  if(afterSearch.selected.includes(hidden)||afterSearch.favoriteIds.includes(hidden))errors.push('Hidden venue retained after search');
  results.push({profile:profile.name,mode:mode.name,status:errors.length?'FAIL':'PASS',
   catalogExcluded:snapshot.catalogExcluded,restoredFavoriteExcluded:snapshot.favoriteExcluded,
   restoredCompareExcluded:snapshot.selectedExcluded,searchMatches:afterSearch.matches.length,errors});
 }catch(error){errors.push('Interrupted: '+error.message);results.push({profile:profile.name,mode:mode.name,status:'FAIL',errors});}
 if(errors.length)failed=true;
 await context.close();
}
await browser.close();
const report={suite:'HG-QA hidden venue exclusion',status:failed?'FAIL':'PASS',venue:hidden,results};
writeFileSync('qa-reports/hidden-venue-regression.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(failed)process.exitCode=1;
