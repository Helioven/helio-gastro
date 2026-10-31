// Exploratory browser inventory: source-language strings still visible in FR QA.
// Informational only. Some Spanish strings are protected dish/venue names.
import {chromium,devices} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const profiles=[{name:'desktop',options:{viewport:{width:1280,height:800}}},{name:'mobile',options:devices['iPhone 13']}];
const report={kind:'exploratory_not_a_translation_failure',profiles:[]};
try{
 for(const profile of profiles){
  const ctx=await browser.newContext(profile.options),page=await ctx.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1',{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length>0);
   await page.locator('#language-select').selectOption('fr');
   const views=[{id:'home',open:async()=>{}},
     {id:'search',open:async()=>page.locator('#search-section').scrollIntoViewIfNeeded()},
     {id:'detail-montillana',open:async()=>page.evaluate(()=>showPlace(state.places.find(p=>p.id==='la-montillana'),false))},
     {id:'detail-beatillas',open:async()=>page.evaluate(()=>showPlace(state.places.find(p=>p.id==='rincon-beatillas'),false))}
   ];
   const findings=[];
   for(const view of views){
    await view.open();
    await page.waitForTimeout(100);
    const visible=await page.evaluate(()=>{
      const root=document.querySelector('#detail-content');
      const candidates=[...document.querySelectorAll('h1,h2,h3,button,label,.note,.service-notice,#search-section p,#detail-content p')];
      return candidates.filter(el=>{
       if(!el.getClientRects().length)return false;
       if(el.closest('.menu-dish,[data-keep-dish-spanish],[data-venue-menu-section],#language-select'))return false;
       return true;
      }).map(el=>({tag:el.tagName,text:(el.innerText||el.textContent||'').replace(/\\s+/g,' ').trim().slice(0,220)})).filter(x=>x.text);
    });
    // Heuristic triage only: do not classify names, cognates, or dates as errors.
    const cues=/\\b(?:buscar|búsqueda|precios pendientes|sin fecha|cerrar|selecciona|consulta|ver ficha|fuentes y fecha|comida completa|establecimientos encontrados)\\b/i;
    findings.push({view:view.id,reviewCandidates:visible.filter(x=>cues.test(x.text)).slice(0,30),visibleElementsChecked:visible.length});
   }
   report.profiles.push({profile:profile.name,errors,findings});
  }finally{await ctx.close();}
 }
}finally{await browser.close();}
mkdirSync('qa-reports',{recursive:true});
writeFileSync('qa-reports/fr-visible-text-triage.json',JSON.stringify(report,null,2)+'\n');
console.log('FR VISIBLE TEXT TRIAGE (nonblocking) '+JSON.stringify(report.profiles.map(p=>({profile:p.profile,errors:p.errors.length,views:p.findings.map(f=>({view:f.view,candidates:f.reviewCandidates.length}))}))));
