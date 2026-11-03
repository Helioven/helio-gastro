// Exploratory browser inventory: source-language strings still visible in FR QA.
// Informational only. Some Spanish strings are protected dish/venue names.
import {chromium,devices} from 'playwright';
import {mkdirSync,writeFileSync,appendFileSync} from 'node:fs';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const profiles=[{name:'desktop',options:{viewport:{width:1280,height:800}}},{name:'mobile',options:devices['iPhone 13']}];
const report={kind:'exploratory_not_a_translation_failure',profiles:[]};
const spanishCue=/\b(?:buscar|búsqueda|precios pendientes|precios históricos|vigencia pendiente|consultar vigencia|sin fecha|cerrar|selecciona|consulta|ver ficha|fuentes y fecha|comida completa|establecimientos encontrados)\b/i;
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
    // Exact source-label comparison is exploratory: proper names and source titles may intentionally remain Spanish.
    const sourceLabelCandidates=view.id.startsWith('detail-')?await page.locator('#detail-content [data-source-label-es]').evaluateAll(nodes=>nodes.map(node=>{
      const original=(node.dataset.sourceLabelEs||'').trim();
      const rendered=(node.textContent||'').replace(/\s*↗\s*$/,'').trim();
      return {original,rendered};
    }).filter(item=>item.original&&item.original===item.rendered).slice(0,15)):[];
    findings.push({view:view.id,reviewCandidates:visible.filter(x=>spanishCue.test(x.text)).slice(0,30),sourceLabelCandidates,visibleElementsChecked:visible.length,horizontalOverflow:viewport.documentWidth>viewport.viewportWidth+1,viewport,screenshot});
   }
   // Full-catalog exploratory sweep: metadata only, no extra screenshots or content changes.
   // Names and traditional dishes are intentionally not assessed as translation failures.
   const allPlaces=await page.evaluate(()=>state.places.map(p=>({id:p.id,name:p.name})));
   const catalogFindings=[];
   for(const place of allPlaces){
     await page.evaluate(id=>{
       const venue=state.places.find(p=>p.id===id);
       if(!venue)throw Error('Missing venue '+id);
       showPlace(venue,false);
     },place.id);
     await page.waitForTimeout(20);
     const finding=await page.locator('#detail-content').evaluate((root,cueSource)=>{
       const cue=new RegExp(cueSource,'i');
       const items=[...root.querySelectorAll('.service-notice,.note,[data-source-label-es]')].filter(el=>el.getClientRects().length);
       const strings=items.map(el=>(el.innerText||el.textContent||'').trim()).filter(Boolean);
       const cueMatches=strings.filter(t=>cue.test(t)).slice(0,5);
       const sourceLabels=[...root.querySelectorAll('[data-source-label-es]')].filter(el=>{
         const original=(el.dataset.sourceLabelEs||'').trim();
         return original && (el.textContent||'').replace(/\s*↗\s*$/,'').trim()===original;
       }).map(el=>({original:el.dataset.sourceLabelEs})).slice(0,6);
       return {cueMatches,sourceLabels};
     },spanishCue.source);
     if(finding.cueMatches.length||finding.sourceLabels.length)catalogFindings.push({id:place.id,...finding});
   }
   console.log('FR CATALOG SWEEP '+JSON.stringify({profile:profile.name,placesInspected:allPlaces.length,venuesFlagged:catalogFindings.length,findings:catalogFindings.slice(0,30),truncated:catalogFindings.length>30,note:'Heuristic candidates, not verified translation defects'}));
   // Preserve the complete catalog sweep in the uploaded JSON artifact, not just the first 30 CI log entries.
   report.profiles.push({profile:profile.name,errors,findings,catalogSweep:{placesInspected:allPlaces.length,venuesFlagged:catalogFindings.length,venues:catalogFindings}});
   console.log('FR CATALOG SWEEP DETAIL '+JSON.stringify({profile:profile.name,venues:catalogFindings}));
  }finally{await ctx.close();}
 }
}finally{await browser.close();}
mkdirSync('qa-reports',{recursive:true});
writeFileSync('qa-reports/fr-visible-text-triage.json',JSON.stringify(report,null,2)+'\n');
const catalogRows=new Map();
for(const profile of report.profiles){
 for(const venue of profile.catalogSweep?.venues||[]){
  if(!catalogRows.has(venue.id))catalogRows.set(venue.id,{desktop:null,mobile:null});
  catalogRows.get(venue.id)[profile.profile]=venue;
 }
}
const mdSafe=value=>String(value??'').replace(/\|/g,'\\|').replace(/\r?\n/g,' ');
const lines=[
 '## FR CATALOG SWEEP — revisión pendiente',
 '',
 '> Detector heurístico: una coincidencia no es un defecto confirmado ni una autorización para traducir.',
 '',
 '| Ficha | Escritorio | Móvil | Evidencia para revisar |',
 '|---|---|---|---|'
];
for(const [id,profiles] of [...catalogRows].sort((a,b)=>a[0].localeCompare(b[0]))){
 const evidence=[...new Set([...(profiles.desktop?.sourceLabels||[]),...(profiles.mobile?.sourceLabels||[])].map(x=>x.original).concat(profiles.desktop?.cueMatches||[],profiles.mobile?.cueMatches||[]))];
 lines.push('| '+mdSafe(id)+' | '+(profiles.desktop?'Candidato':'—')+' | '+(profiles.mobile?'Candidato':'—')+' | '+mdSafe(evidence.slice(0,4).join(' / ')||'Ver informe JSON')+' |');
}
if(!catalogRows.size)lines.push('| Ninguno detectado | — | — | Requiere revisión editorial igualmente |');
lines.push('','Total de fichas con candidatos en algún perfil: **'+catalogRows.size+'**. No confundir con el número de defectos.');
const reviewMarkdown=lines.join('\n')+'\n';
writeFileSync('qa-reports/fr-catalog-sweep-review.md',reviewMarkdown);
if(process.env.GITHUB_STEP_SUMMARY)appendFileSync(process.env.GITHUB_STEP_SUMMARY,reviewMarkdown);
console.log('FR CATALOG REVIEW SUMMARY '+JSON.stringify({venues:catalogRows.size,report:'qa-reports/fr-catalog-sweep-review.md'}));
console.log('FR VISIBLE TEXT TRIAGE (nonblocking) '+JSON.stringify(report.profiles.map(p=>({profile:p.profile,errors:p.errors.length,views:p.findings.map(f=>({view:f.view,candidates:f.reviewCandidates.length,horizontalOverflow:f.horizontalOverflow,viewportWidth:f.viewport.viewportWidth,documentWidth:f.viewport.documentWidth}))}))));
// Always list the screenshot evidence and whether a profile has outstanding heuristic candidates.
for(const profile of report.profiles){
 const candidateTotal=profile.findings.reduce((sum,f)=>sum+f.reviewCandidates.length,0);
 console.log('FR TRIAGE PROFILE '+JSON.stringify({profile:profile.profile,candidateTotal,viewsInspected:profile.findings.length,screenshots:profile.findings.filter(f=>f.screenshot).map(f=>({view:f.view,path:f.screenshot})),note:'Candidates require human review; zero candidates is not editorial approval'}));
}
// Emit actionable, bounded evidence in CI logs even when the JSON artifact is unavailable.
for(const profile of report.profiles){
 for(const finding of profile.findings){
  if(!finding.reviewCandidates.length&&!finding.sourceLabelCandidates.length&&!finding.horizontalOverflow&&!finding.viewport.overflowingElements.length)continue;
  console.log('FR TRIAGE DETAIL '+JSON.stringify({profile:profile.profile,view:finding.view,reviewCandidates:finding.reviewCandidates.slice(0,10),sourceLabelCandidates:finding.sourceLabelCandidates.slice(0,10),horizontalOverflow:finding.horizontalOverflow,overflowingElements:finding.viewport.overflowingElements.slice(0,10),screenshot:finding.screenshot}));
 }
 if(profile.errors.length)console.log('FR TRIAGE PAGE ERRORS '+JSON.stringify({profile:profile.profile,errors:profile.errors.slice(0,10)}));
}
