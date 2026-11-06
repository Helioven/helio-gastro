// HG-QA-PERF-001: public FR lazy-load measurements. Local Chromium CI, not real mobile benchmarks.
import {chromium,devices} from 'playwright';
import {readdirSync,mkdirSync,writeFileSync} from 'node:fs';
const expected=readdirSync('translations/fr').filter(n=>/^batch-\d+.*\.json$/.test(n)).length;
const profiles=[{name:'desktop',config:{viewport:{width:1365,height:900}}},{name:'mobile-viewport',config:devices['iPhone 13']}];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
mkdirSync('qa-reports',{recursive:true});
let failed=false;const results=[];
for(const profile of profiles){
 const context=await browser.newContext(profile.config),page=await context.newPage();
 const errors=[],failedRequests=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('requestfailed',r=>failedRequests.push(r.url()));
 try{
  const resources=()=>page.evaluate(()=>performance.getEntriesByType('resource')
   .filter(x=>x.name.includes('/translations/fr/batch-'))
   .map(x=>({name:x.name.split('/').pop(),transfer:x.transferSize,encoded:x.encodedBodySize,duration:x.duration})));
  await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length===43);
  const es=await resources();
  await page.locator('#language-select').selectOption('en');
  const en=await resources();
  const start=Date.now();
  await page.locator('#language-select').selectOption('fr');
  await page.waitForFunction(()=>state.places.find(p=>p.id==='la-montillana')?.menuSections?.[0]?.items?.[0]?.fr,null,{timeout:45000});
  const elapsedMs=Date.now()-start;
  const fr=await resources();
  await page.locator('#language-select').selectOption('es');
  await page.locator('#language-select').selectOption('fr');
  const repeat=await resources();
  const beforeReload=await page.evaluate(()=>({lang:document.documentElement.lang,
   saved:localStorage.getItem('helio-gastro-language-v1'),hidden:!state.places.some(p=>p.id==='el-caballo-rojo')}));
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>state.places.length===43&&state.places.find(p=>p.id==='la-montillana')?.menuSections?.[0]?.items?.[0]?.fr,null,{timeout:45000});
  const afterReload=await page.evaluate(()=>({lang:document.documentElement.lang,select:document.querySelector('#language-select').value,
   requests:performance.getEntriesByType('resource').filter(r=>r.name.includes('/translations/fr/batch-')).length}));
  if(es.length||en.length)errors.push('Unexpected FR downloads in ES/EN: '+es.length+'/'+en.length);
  if(fr.length!==expected||repeat.length!==expected||afterReload.requests!==expected)errors.push('FR batch mismatch / duplicate reload');
  if(new Set(fr.map(x=>x.name)).size!==expected)errors.push('Repeated batch filenames');
  if(beforeReload.saved!=='fr'||beforeReload.lang!=='fr'||!beforeReload.hidden||afterReload.lang!=='fr'||afterReload.select!=='fr')errors.push('Language persistence or venue hiding regression');
  if(failedRequests.length)errors.push('Network failures: '+failedRequests.length);
  results.push({profile:profile.name,status:errors.length?'FAIL':'PASS',
   expectedBatches:expected,initialEsRequests:es.length,afterEnglishRequests:en.length,
   firstFrenchRequests:fr.length,afterReturningFrenchRequests:repeat.length,restoredFrenchRequests:afterReload.requests,
   firstFrenchReadyMs:elapsedMs,frenchTransferBytes:fr.reduce((n,x)=>n+x.transfer,0),
   frenchEncodedBytes:fr.reduce((n,x)=>n+x.encoded,0),errors,failedRequests});
 }catch(e){errors.push('Test interrupted: '+e.message);results.push({profile:profile.name,status:'FAIL',errors,failedRequests})}
 if(errors.length)failed=true;
 await context.close();
}
await browser.close();
const report={suite:'HG-QA-PERF-001 lazy FR',status:failed?'FAIL':'PASS',
 scope:'Local CI Chromium / desktop and emulated iPhone 13 viewport, no throttling; not real-user timing',results};
writeFileSync('qa-reports/fr-load-performance.json',JSON.stringify(report,null,2)+'\n');
console.log('FR LOAD PERFORMANCE '+JSON.stringify(report));
if(failed)process.exitCode=1;
