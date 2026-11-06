// Read-only performance inventory for the public French overlay (local CI server).
// Timings and transfer sizes are environmental measurements, NOT mobile-user benchmarks.
import {chromium,devices} from 'playwright';
import {readdirSync,mkdirSync,writeFileSync} from 'node:fs';
const expectedBatches=readdirSync('translations/fr').filter(x=>/^batch-\d+.*\.json$/.test(x)).length;
const profiles=[{name:'desktop-chromium',options:{viewport:{width:1365,height:900}}},{name:'mobile-viewport-iphone13',options:devices['iPhone 13']}];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];let failure=false;
mkdirSync('qa-reports',{recursive:true});
for(const profile of profiles){
 const context=await browser.newContext(profile.options),page=await context.newPage();
 const errors=[],networkFailures=[];
 page.on('pageerror',e=>errors.push('JavaScript: '+e.message));
 page.on('requestfailed',r=>networkFailures.push(r.url()+' — '+r.failure()?.errorText));
 const start=Date.now();
 try{
  await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length===43
    &&state.places.find(p=>p.id==='la-montillana')?.menuSections?.[0]?.items?.[0]?.fr,
    null,{timeout:45000});
  const readyMs=Date.now()-start;
  const perf=await page.evaluate(()=>({
   resources:performance.getEntriesByType('resource').filter(r=>r.name.includes('/translations/fr/batch-')).map(r=>({
    name:r.name.split('/').pop(),durationMs:r.duration,encodedBodySize:r.encodedBodySize,
    decodedBodySize:r.decodedBodySize,transferSize:r.transferSize,responseEnd:r.responseEnd,
    initiatorType:r.initiatorType
   })),
   navigation:performance.getEntriesByType('navigation').map(n=>({
    domContentLoadedMs:n.domContentLoadedEventEnd,loadMs:n.loadEventEnd,
    transferSize:n.transferSize
   }))[0]||null,
   frenchOption:!!document.querySelector('#language-select option[value="fr"]'),
   hiddenPresent:state.places.some(p=>p.id==='el-caballo-rojo')
  }));
  const observed=perf.resources.length;
  const duplicateNames=perf.resources.map(x=>x.name).filter((x,i,a)=>a.indexOf(x)!==i);
  if(observed!==expectedBatches)errors.push('FR batch requests: expected '+expectedBatches+', observed '+observed);
  if(duplicateNames.length)errors.push('Duplicate batch requests: '+[...new Set(duplicateNames)].join(', '));
  if(!perf.frenchOption)errors.push('Public French language selector missing');
  if(perf.hiddenPresent)errors.push('El Caballo Rojo visible');
  if(networkFailures.length)errors.push('Network failures observed: '+networkFailures.length);
  results.push({
   profile:profile.name,status:errors.length?'FAIL':'PASS',expectedBatches,observedBatches:observed,
   readyMs,bodyEncodedBytes:perf.resources.reduce((n,r)=>n+r.encodedBodySize,0),
   bodyDecodedBytes:perf.resources.reduce((n,r)=>n+r.decodedBodySize,0),
   transferBytes:perf.resources.reduce((n,r)=>n+r.transferSize,0),
   longestBatchMs:Math.round(Math.max(0,...perf.resources.map(r=>r.durationMs))),
   lastBatchResponseEndMs:Math.round(Math.max(0,...perf.resources.map(r=>r.responseEnd))),
   navigation:perf.navigation,errors,networkFailures
  });
 }catch(e){errors.push('Measurement interrupted: '+e.message);results.push({profile:profile.name,status:'FAIL',expectedBatches,errors,networkFailures})}
 if(errors.length)failure=true;
 await context.close();
}
await browser.close();
const report={suite:'HG-QA-PERF-001 public French overlay network inventory',
 status:failure?'FAIL':'PASS',measurementScope:'GitHub Actions local HTTP server / Chromium desktop & emulated viewport; no network throttling; figures are NOT real-world user timing',results};
writeFileSync('qa-reports/fr-load-performance.json',JSON.stringify(report,null,2)+'\n');
console.log('FR LOAD PERFORMANCE '+JSON.stringify(report));
if(failure)process.exitCode=1;
