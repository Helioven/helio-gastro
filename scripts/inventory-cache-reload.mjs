// HG-QA-CACHE-001: browser reload, cache-policy and persistent-state inventory.
// Diagnostic readings are separate from assertions. No remote network or live venue verification.
import {chromium,devices} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const URL='http://127.0.0.1:8765/index.html';
const profiles=[{name:'desktop',config:{viewport:{width:1365,height:900}}},{name:'mobile-viewport',config:devices['iPhone 13']}];
const out={suite:'HG-QA-CACHE-001',status:'PASS',scope:'Local CI HTTP server in Chromium, not deployed GitHub Pages or offline certification',profiles:[]};
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
mkdirSync('qa-reports',{recursive:true});
for(const profile of profiles){
 const context=await browser.newContext(profile.config),page=await context.newPage(),errors=[],networkFailures=[],responses=[];
 page.on('pageerror',e=>errors.push('pageerror '+e.message));
 page.on('requestfailed',r=>networkFailures.push({url:r.url(),error:r.failure()?.errorText}));
 page.on('response',r=>{
  const pathname=new URL(r.url()).pathname;
  if(pathname.endsWith('/data/places.json')||pathname.endsWith('/docs/french-glossary-v1.json')||pathname.endsWith('/app.js')||pathname.endsWith('/i18n.js')||pathname.includes('/translations/fr/batch-')){
   responses.push({path:pathname.split('/').slice(-2).join('/'),status:r.status(),cacheControl:r.headers()['cache-control']||null,
    lastModified:!!r.headers()['last-modified'],etag:!!r.headers().etag});
  }
 });
 try{
  await page.goto(URL,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length===43,{timeout:45000});
  const clean=await page.evaluate(()=>({lang:document.documentElement.lang,selected:document.querySelector('#language-select').value,
   hidden:!state.places.some(p=>p.id==='el-caballo-rojo'),frResources:performance.getEntriesByType('resource').filter(r=>r.name.includes('/translations/fr/batch-')).length}));
  if(!clean.hidden)errors.push('Hidden venue in initial catalog');
  if(clean.frResources!==0)errors.push('FR resources downloaded before French selection');
  await page.evaluate(()=>{
   localStorage.setItem('helio-gastro-favorites-v1',JSON.stringify(['la-montillana','el-caballo-rojo']));
   localStorage.setItem('helio-gastro-meal-mode-v1','cena');
  });
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length===43,{timeout:45000});
  const restored=await page.evaluate(()=>({favorites:[...state.favorites],mode:state.mode,hidden:!state.places.some(p=>p.id==='el-caballo-rojo'),
   lang:document.documentElement.lang,frResources:performance.getEntriesByType('resource').filter(r=>r.name.includes('/translations/fr/batch-')).length}));
  if(!restored.favorites.includes('la-montillana')||restored.favorites.includes('el-caballo-rojo'))errors.push('Favorites not safely restored');
  if(restored.mode!=='cena')errors.push('Meal selection not restored');
  if(restored.frResources!==0)errors.push('FR resources requested on ES reload');
  await page.locator('#language-select').selectOption('en');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length===43,{timeout:45000});
  const english=await page.evaluate(()=>({language:document.documentElement.lang,
   chosen:document.querySelector('#language-select').value,frResources:performance.getEntriesByType('resource').filter(r=>r.name.includes('/translations/fr/batch-')).length}));
  if(english.language!=='en'||english.chosen!=='en'||english.frResources!==0)errors.push('EN preference or FR deferral regression');
  await page.locator('#language-select').selectOption('fr');
  await page.waitForFunction(()=>state.places.find(p=>p.id==='la-montillana')?.menuSections?.[0]?.items?.[0]?.fr,null,{timeout:45000});
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length===43&&state.places.find(p=>p.id==='la-montillana')?.menuSections?.[0]?.items?.[0]?.fr,null,{timeout:45000});
  const french=await page.evaluate(()=>({language:document.documentElement.lang,
   chosen:document.querySelector('#language-select').value,
   frResources:performance.getEntriesByType('resource').filter(r=>r.name.includes('/translations/fr/batch-')).length,
   hidden:!state.places.some(p=>p.id==='el-caballo-rojo'),
   workerControlled:!!navigator.serviceWorker?.controller}));
  if(french.language!=='fr'||french.chosen!=='fr'||french.frResources!==107||!french.hidden)errors.push('FR preference and overlay reload regression');
  const catalogResponses=responses.filter(x=>x.path==='data/places.json');
  if(catalogResponses.length<4||catalogResponses.some(x=>x.status!==200))errors.push('Catalog reload requests not healthy');
  if(networkFailures.length)errors.push('Failed requests: '+networkFailures.length);
  out.profiles.push({profile:profile.name,status:errors.length?'FAIL':'PASS',clean,restored,english,french,
   responseCount:responses.length,catalogResponses:catalogResponses.length,
   cachePolicySummary:[...new Set(responses.map(x=>x.path+':'+(x.cacheControl||'(none)')))].slice(0,9),
   errors,networkFailures});
 }catch(e){errors.push('Interrupted: '+e.message);out.profiles.push({profile:profile.name,status:'FAIL',errors,networkFailures})}
 await context.close();
}
await browser.close();
if(out.profiles.some(p=>p.status!=='PASS'))out.status='FAIL';
writeFileSync('qa-reports/cache-reload-inventory.json',JSON.stringify(out,null,2)+'\n');
console.log('CACHE RELOAD QA '+JSON.stringify(out));
if(out.status!=='PASS')process.exitCode=1;
