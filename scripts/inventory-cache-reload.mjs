// HG-QA-CACHE-001: browser reload, cache-policy and persistent-state inventory.
// Diagnostic readings are separate from assertions. No remote network or live venue verification.
import {chromium,devices} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const PAGE_URL='http://127.0.0.1:8765/index.html';
const ORIGIN=new URL(PAGE_URL).origin;
const IMAGE_ROOT=new URL('/assets/dishes/',PAGE_URL).href;
const dinnerImages='tapas flamenquin croquetas tortilla-de-patatas rabo-de-toro salmorejo pescados-y-mariscos carnes-y-asados bocadillos-y-sandwiches guisos-y-cocina-tradicional verduras-y-ensaladas tapas-y-raciones postres-y-dulces'.split(' ').map(name=>IMAGE_ROOT+name+'.webp');
const lunchImagesSharedWithDinner=dinnerImages.filter(url=>!url.endsWith('/tapas.webp')&&!url.endsWith('/tortilla-de-patatas.webp'));
const lunchOnlyImages='mazamorra carrillada-con-patatas berenjenas-con-miel pisto-cordobes'.split(' ').map(name=>IMAGE_ROOT+name+'.webp');
const profiles=[{name:'desktop',config:{viewport:{width:1365,height:900}}},{name:'mobile-viewport',config:devices['iPhone 13']}];
const out={suite:'HG-QA-CACHE-002',status:'PASS',scope:'Local CI HTTP server in Chromium, not deployed GitHub Pages or offline certification',profiles:[]};
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
mkdirSync('qa-reports',{recursive:true});
// Use main-frame commits and Playwright Request identity, not URL alone, to
// distinguish a pending request of the outgoing document from a new request.
function observeRequests(page){
 let document=0,transition;
 const inFlight=new Set(),requests=new Map(),failures=[],benignCancellations=[];
 page.on('framenavigated',frame=>{if(frame===page.mainFrame())document++});
 page.on('request',request=>{
  if(new URL(request.url()).origin!==ORIGIN)return;
  let mainFrame=false;
  // Navigation requests may precede frame creation. An unknown owner is never forgiven.
  try{mainFrame=request.frame()===page.mainFrame()}catch{}
  if(transition&&request.isNavigationRequest()&&request.resourceType()==='document'&&
   (mainFrame||request.url()===PAGE_URL))transition.navigationRequested=true;
  requests.set(request,{url:request.url(),document:mainFrame&&document>0?document:null,type:request.resourceType()});
  inFlight.add(request);
 });
 page.on('response',response=>{
  const entry=requests.get(response.request());
  if(!entry)return;
  entry.status=response.status();
  if(entry.status>=400)failures.push({kind:'http',...entry});
 });
 page.on('requestfinished',request=>{
  inFlight.delete(request);
  const entry=requests.get(request);
  if(entry)entry.finished=true;
 });
 page.on('requestfailed',request=>{
  inFlight.delete(request);
  const entry=requests.get(request)??{url:request.url(),document:null,type:request.resourceType()};
  const failure={kind:'network',...entry,error:request.failure()?.errorText};
  if(failure.error==='net::ERR_ABORTED'&&entry.type==='image'&&transition?.navigationRequested&&entry.document===transition.from&&transition.pending.has(request)){
   transition.candidates.push(failure);
  }else failures.push(failure);
 });
 return {
  failures,benignCancellations,
  startReload(){
   transition={from:document,pending:new Set(inFlight),candidates:[]};
  },
  finishReload(rendered){
   for(const failure of transition.candidates){
    const recovered=document===transition.from+1&&rendered.has(failure.url)&&
     [...requests.values()].some(entry=>entry.document===document&&entry.url===failure.url&&entry.type==='image'&&entry.status===200&&entry.finished);
    if(recovered)benignCancellations.push({...failure,restoredDocument:document,recoveryStatus:200,decoded:true,rendered:true});
    else failures.push({...failure,recovery:'not verified in the next document'});
   }
   transition=undefined;
  }
 };
}

async function verifyImages(page,urls,failures){
 const rendered=new Set();
 for(const url of new Set(urls)){
  const image=page.locator(`#recommendation-dishes img[src="./assets/dishes/${new URL(url).pathname.split('/').at(-1)}"]`);
  try{
   await image.scrollIntoViewIfNeeded({timeout:5000});
   await page.waitForFunction(src=>[...document.images].some(node=>node.src===src&&node.complete),url,{timeout:5000});
   const valid=await image.evaluate(async node=>{
    await node.decode();
    const rect=node.getBoundingClientRect(),style=getComputedStyle(node);
    return node.isConnected&&node.complete&&node.naturalWidth>0&&node.naturalHeight>0&&
     rect.width>0&&rect.height>0&&style.visibility==='visible'&&style.opacity!=='0';
   },null,{timeout:5000});
   if(!valid)throw Error('image is not rendered');
   rendered.add(url);
  }catch(error){failures.push({kind:'image',url,error:error.message})}
 }
 return rendered;
}

async function restoreView(page,network,ready){
 network.startReload();
 let rendered=new Set();
 try{
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(ready,null,{timeout:45000});
  rendered=await verifyImages(page,dinnerImages,network.failures);
 }finally{network.finishReload(rendered)}
}

for(const profile of profiles){
 const context=await browser.newContext(profile.config),page=await context.newPage(),errors=[],responses=[];
 const network=observeRequests(page);
 const {failures:networkFailures,benignCancellations}=network;
 page.on('pageerror',e=>errors.push('pageerror '+e.message));
 page.on('response',r=>{
  const pathname=new URL(r.url()).pathname;
  if(pathname.endsWith('/data/places.json')||pathname.endsWith('/docs/french-glossary-v1.json')||pathname.endsWith('/app.js')||pathname.endsWith('/i18n.js')||pathname.includes('/translations/fr/batch-')){
   responses.push({path:pathname.split('/').slice(-2).join('/'),status:r.status(),cacheControl:r.headers()['cache-control']||null,
    lastModified:!!r.headers()['last-modified'],etag:!!r.headers().etag});
  }
 });
 try{
  await page.goto(PAGE_URL,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length===43,null,{timeout:45000});
  const initialImages=await page.locator('#recommendation-dishes img').evaluateAll(nodes=>nodes.map(node=>node.src));
  for(const url of lunchImagesSharedWithDinner){
   if(!initialImages.includes(url))networkFailures.push({kind:'image',url,document:1,error:'expected image missing in initial view'});
  }
  await verifyImages(page,lunchOnlyImages,networkFailures);
  const clean=await page.evaluate(()=>({lang:document.documentElement.lang,selected:document.querySelector('#language-select').value,
   hidden:!state.places.some(p=>p.id==='el-caballo-rojo'),frResources:performance.getEntriesByType('resource').filter(r=>r.name.includes('/translations/fr/batch-')).length}));
  if(!clean.hidden)errors.push('Hidden venue in initial catalog');
  if(clean.frResources!==0)errors.push('FR resources downloaded before French selection');
  await page.evaluate(()=>{
   localStorage.setItem('helio-gastro-favorites-v1',JSON.stringify(['la-montillana','el-caballo-rojo']));
   localStorage.setItem('helio-gastro-meal-mode-v1','cena');
  });
  await restoreView(page,network,()=>typeof state!=='undefined'&&state.places.length===43);
  const restored=await page.evaluate(()=>({favorites:[...state.favorites],mode:state.mode,hidden:!state.places.some(p=>p.id==='el-caballo-rojo'),
   lang:document.documentElement.lang,frResources:performance.getEntriesByType('resource').filter(r=>r.name.includes('/translations/fr/batch-')).length}));
  if(!restored.favorites.includes('la-montillana')||restored.favorites.includes('el-caballo-rojo'))errors.push('Favorites not safely restored');
  if(restored.mode!=='cena')errors.push('Meal selection not restored');
  if(restored.frResources!==0)errors.push('FR resources requested on ES reload');
  await page.locator('#language-select').selectOption('en');
  await restoreView(page,network,()=>typeof state!=='undefined'&&state.places.length===43);
  const english=await page.evaluate(()=>({language:document.documentElement.lang,
   chosen:document.querySelector('#language-select').value,frResources:performance.getEntriesByType('resource').filter(r=>r.name.includes('/translations/fr/batch-')).length}));
  if(english.language!=='en'||english.chosen!=='en'||english.frResources!==0)errors.push('EN preference or FR deferral regression');
  await page.locator('#language-select').selectOption('fr');
  await page.waitForFunction(()=>state.places.find(p=>p.id==='la-montillana')?.menuSections?.[0]?.items?.[0]?.fr,null,{timeout:45000});
  await restoreView(page,network,()=>typeof state!=='undefined'&&state.places.length===43&&state.places.find(p=>p.id==='la-montillana')?.menuSections?.[0]?.items?.[0]?.fr);
  const french=await page.evaluate(()=>({language:document.documentElement.lang,
   chosen:document.querySelector('#language-select').value,
   frResources:performance.getEntriesByType('resource').filter(r=>r.name.includes('/translations/fr/batch-')).length,
   hidden:!state.places.some(p=>p.id==='el-caballo-rojo'),
   workerControlled:!!navigator.serviceWorker?.controller}));
  if(french.language!=='fr'||french.chosen!=='fr'||french.frResources!==107||!french.hidden)errors.push('FR preference and overlay reload regression');
  const catalogResponses=responses.filter(x=>x.path==='data/places.json');
  if(catalogResponses.length<4||catalogResponses.some(x=>x.status!==200))errors.push('Catalog reload requests not healthy');
  if(networkFailures.length)errors.push('Resource failures: '+networkFailures.length);
  out.profiles.push({profile:profile.name,status:errors.length?'FAIL':'PASS',clean,restored,english,french,
   responseCount:responses.length,catalogResponses:catalogResponses.length,
   cachePolicySummary:[...new Set(responses.map(x=>x.path+':'+(x.cacheControl||'(none)')))].slice(0,9),
   errors,networkFailures,benignCancellations});
 }catch(e){errors.push('Interrupted: '+e.message);out.profiles.push({profile:profile.name,status:'FAIL',errors,networkFailures,benignCancellations})}
 await context.close();
}
// Hold one outgoing image and abort it only once the reload request starts.
{
 const page=await browser.newPage(profiles[0].config),network=observeRequests(page);
 const url=IMAGE_ROOT+'postres-y-dulces.webp';
 let heldRoute,reloading=false,intercepted;
 const started=new Promise(resolve=>{intercepted=resolve});
 try{
  await page.route(url,route=>{
   if(reloading)return route.continue();
   heldRoute=route;intercepted();
  });
  await page.route(PAGE_URL,async route=>{
   if(reloading&&heldRoute)await heldRoute.abort('aborted');
   await route.continue();
  });
  await page.goto(PAGE_URL,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length===43);
  await page.locator('.recommendation-tile').filter({hasText:'Postres y dulces'}).scrollIntoViewIfNeeded();
  await Promise.race([started,new Promise((_,reject)=>{
   setTimeout(()=>reject(Error('Outgoing image was not intercepted')),5000).unref();
  })]);
  reloading=true;
  network.startReload();
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length===43);
  const rendered=await verifyImages(page,[url],network.failures);
  network.finishReload(rendered);
  out.outgoingControl={
   status:network.benignCancellations.some(entry=>entry.url===url)&&!network.failures.length?'PASS':'FAIL',
   benignCancellations:network.benignCancellations,failures:network.failures
  };
 }catch(error){out.outgoingControl={status:'FAIL',error:error.message}}
 await page.close();
}

// Fault injection uses independent contexts and the same recorder/DOM checks.
out.negativeControls=[];
for(const fault of ['http-404','active-abort','invalid-webp']){
 const page=await browser.newPage(profiles[0].config),network=observeRequests(page);
 const url=IMAGE_ROOT+'postres-y-dulces.webp';
 try{
  await page.goto(PAGE_URL,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length===43);
  await verifyImages(page,[url],network.failures);
  await page.route(url,route=>fault==='active-abort'?route.abort('aborted'):route.fulfill({
   status:fault==='http-404'?404:200,contentType:'image/webp',body:'QA fault injection'
  }));
  network.startReload();
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length===43);
  await page.locator('.recommendation-tile').filter({hasText:'Postres y dulces'}).scrollIntoViewIfNeeded();
  const rendered=await verifyImages(page,[url],network.failures);
  network.finishReload(rendered);
  const detected=network.failures.some(entry=>entry.url===url&&(
   fault==='http-404'?entry.kind==='http'&&entry.status===404:
   fault==='active-abort'?entry.kind==='network'&&entry.error==='net::ERR_ABORTED'&&entry.document===2:
   entry.kind==='image'
  ));
  const pass=detected&&!rendered.has(url)&&network.benignCancellations.length===0;
  out.negativeControls.push({fault,status:pass?'PASS':'FAIL',failures:network.failures});
 }catch(error){out.negativeControls.push({fault,status:'FAIL',error:error.message})}
 await page.close();
}
await browser.close();
if(out.outgoingControl.status!=='PASS'||out.negativeControls.some(control=>control.status!=='PASS'))out.status='FAIL';
if(out.profiles.some(p=>p.status!=='PASS'))out.status='FAIL';
writeFileSync('qa-reports/cache-reload-inventory.json',JSON.stringify(out,null,2)+'\n');
console.log('CACHE RELOAD QA '+JSON.stringify(out));
if(out.status!=='PASS')process.exitCode=1;
