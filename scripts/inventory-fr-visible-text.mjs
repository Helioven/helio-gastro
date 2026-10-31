// Exploratory browser inventory: source-language strings still visible in FR QA.
// Informational only. Some Spanish strings are protected dish/venue names.
import {chromium,devices} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const profiles=[{name:'desktop',options:{viewport:{width:1280,height:800}}},{name:'mobile',options:devices['iPhone 13']}];
const report={kind:'exploratory_not_a_translation_failure',profiles:[]};
const spanishCue=/\b(?:buscar|búsqueda|precios pendientes|sin fecha|cerrar|selecciona|consulta|ver ficha|fuentes y fecha|comida completa|establecimientos encontrados)\b/i;
if(!spanishCue.test('Cerrar ficha')||!spanishCue.test('Ver ficha')||spanishCue.test('Fermer la fiche'))throw Error('Spanish triage cue self-test failed');
try{
 for(const profile of profiles){
  const ctx=await browser.newContext(profile.options),page=await ctx.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1',{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length>0);
   await page.locator('#language-select').selectOption('fr');
   const views=[
     {id:'home',open:async()=>{}},
     {id:'search',open:async()=>page.locator('#search-section').scrollIntoViewIfNeeded()},
     {id:'detail-montillana',open:async()=>page.evaluate(()=>showPlace(state.places.find(p=>p.id==='la-montillana'),false))},
     {id:'detail-beatillas',open:async()=>page.evaluate(()=>showPlace(state.places.find(p=>p.id==='rincon-beatillas'),false))},
     {id:'detail-rubio',open:async()=>page.evaluate(()=>showPlace(state.places.find(p=>p.id==='casa-rubio'),false))},
     {id:'detail-roldan',open:async()=>page.evaluate(()=>{
       const place=state.places.find(p=>p.menuPriceNotice?.startsWith('Precios publicados en la carta general de Roldán.'));
       if(!place)throw Error('Roldán notice venue unavailable');
       showPlace(place,false);
     })},
     {id:'favorites',open:async()=>{
       await page.evaluate(()=>{const section=document.querySelector('#favorite-section');if(!section)throw Error('Favorites section missing');section.scrollIntoView();});
     }}
   ];
   const findings=[];
   for(const view of views){
    await view.open();
    await page.waitForTimeout(100);
    const visible=await page.evaluate(viewId=>{
      const selector=viewId.startsWith('detail-')?'#detail-section':viewId==='search'?'#search-section':viewId==='favorites'?'#favorite-section' :'main > header, main > .hero, #service-section, #recommendations-section, main > .info';
      const roots=[...document.querySelectorAll(selector)];
      const candidates=roots.flatMap(root=>[...root.querySelectorAll('h1,h2,h3,button,label,.note,.service-notice,p')]);
      return candidates.filter(el=>{
       if(!el.getClientRects().length)return false;
       if(el.closest('[data-keep-dish-spanish],#language-select'))return false;
       // Price/validity notices inside menu cards are UI copy, not protected dish titles.
       if(el.closest('.menu-dish,[data-venue-menu-section]')&&!el.matches('.service-notice,.note'))return false;
       return true;
      }).map(el=>({tag:el.tagName,text:(el.innerText||el.textContent||'').replace(/\s+/g,' ').trim().slice(0,220)})).filter(x=>x.text);
    },view.id);
    // Heuristic triage only: do not classify names, cognates, or dates as errors.
    const viewport=await page.evaluate(()=>{
      const viewportWidth=window.innerWidth;
      const documentWidth=document.documentElement.scrollWidth;
      const overflowingElements=[...document.querySelectorAll('main h1,main h2,main h3,main p,main button,main label,#detail-section .service-notice')]
        .filter(el=>el.getClientRects().length && !el.closest('[hidden],[aria-hidden="true"]'))
        .map(el=>({el,rect:el.getBoundingClientRect()}))
        .filter(({rect})=>rect.right>viewportWidth+1 || rect.left < -1)
        .slice(0,10)
        .map(({el,rect})=>({tag:el.tagName,text:(el.innerText||el.textContent||'').replace(/\s+/g,' ').trim().slice(0,100),left:Math.round(rect.left),right:Math.round(rect.right)}));
      return {viewportWidth,documentWidth,overflowingElements};
    });
    // Keep a visual record of the real FR detail layout for editorial review.
    // Screenshots are evidence for manual triage, never an automatic translation verdict.
    let screenshot=null;
    if(view.id.startsWith('detail-')){
      mkdirSync('qa-reports/screenshots/fr-detail-triage',{recursive:true});
      screenshot='qa-reports/screenshots/fr-detail-triage/'+profile.name+'-'+view.id+'.png';
      await page.locator('#detail-section').screenshot({path:screenshot});
    }
    findings.push({view:view.id,reviewCandidates:visible.filter(x=>spanishCue.test(x.text)).slice(0,30),visibleElementsChecked:visible.length,horizontalOverflow:viewport.documentWidth>viewport.viewportWidth+1,viewport,screenshot});
   }
   report.profiles.push({profile:profile.name,errors,findings});
  }finally{await ctx.close();}
 }
}finally{await browser.close();}
mkdirSync('qa-reports',{recursive:true});
writeFileSync('qa-reports/fr-visible-text-triage.json',JSON.stringify(report,null,2)+'\n');
console.log('FR VISIBLE TEXT TRIAGE (nonblocking) '+JSON.stringify(report.profiles.map(p=>({profile:p.profile,errors:p.errors.length,views:p.findings.map(f=>({view:f.view,candidates:f.reviewCandidates.length,horizontalOverflow:f.horizontalOverflow,viewportWidth:f.viewport.viewportWidth,documentWidth:f.viewport.documentWidth}))}))));
