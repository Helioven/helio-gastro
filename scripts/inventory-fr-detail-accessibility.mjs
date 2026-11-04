// Exploratory FR QA geometry/accessibility inventory. Findings require human triage.
import { chromium, devices } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const venues=[
  {id:'la-cazuela-esparteria',label:'La Cazuela'},
  {id:'la-bandera-cafe',label:'La Bandera'},
  {id:'rincon-beatillas',label:'Beatillas'},
];
const profiles=[
  {name:'desktop-1365',options:{viewport:{width:1365,height:900}}},
  {name:'mobile-iphone13',options:devices['iPhone 13']},
];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const report={kind:'exploratory_fr_visual_accessibility_not_a_pass_certificate',generatedAt:new Date().toISOString(),results:[]};
mkdirSync('qa-reports/screenshots/fr-accessibility-triage',{recursive:true});
try{
  for(const profile of profiles){
    const context=await browser.newContext(profile.options);
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    try{
      await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1',{waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.some(p=>p.id==='la-cazuela-esparteria'));
      for(const venue of venues){
        for(const language of ['es','en','fr']){
          await page.locator('#language-select').selectOption(language);
          await page.evaluate(id=>showPlace(state.places.find(p=>p.id===id),false),venue.id);
          await page.locator('#detail-section').waitFor({state:'visible'});
          await page.waitForFunction(lang=>document.documentElement.lang===lang,language);
          await page.waitForTimeout(80);
          const metrics=await page.evaluate(()=>{
            const section=document.querySelector('#detail-section');
            const vp=window.innerWidth;
            const main=document.querySelector('main.shell');
            const rectData=el=>{
              const r=el.getBoundingClientRect();
              return {tag:el.tagName,selector:el.id?'#'+el.id:el.className&&typeof el.className==='string'?'.'+el.className.trim().split(/\\s+/).join('.'):el.tagName.toLowerCase(),
                text:(el.innerText||el.textContent||'').replace(/\\s+/g,' ').trim().slice(0,100),
                left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width)};
            };
            const visible=el=>el.getClientRects().length>0 && getComputedStyle(el).visibility!=='hidden';
            const controls=[...section.querySelectorAll('button,a,input,select')].filter(visible);
            // Only flag controls outside the horizontal viewport. Long text can be intentionally wrapped.
            const outsideControls=controls.filter(el=>{
              const r=el.getBoundingClientRect();
              return r.right>vp+2||r.left < -2||r.width===0;
            }).slice(0,15).map(rectData);
            const unnamedControls=controls.filter(el=>{
              const name=(el.getAttribute('aria-label')||el.innerText||el.textContent||el.getAttribute('title')||'').trim();
              return !name && !['INPUT','SELECT'].includes(el.tagName);
            }).slice(0,15).map(rectData);
            const clippedText=[...section.querySelectorAll('h2,h3,h4,p,li,.service-notice,.detail-dish-explanation')]
              .filter(visible).filter(el=>{
                const s=getComputedStyle(el);
                return s.overflow==='hidden' && el.scrollWidth>el.clientWidth+2;
              }).slice(0,15).map(rectData);
            return {viewportWidth:vp,documentWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,
              mainWidth:main?.clientWidth,detailWidth:section.scrollWidth,detailClientWidth:section.clientWidth,
              controlsChecked:controls.length,outsideControls,unnamedControls,clippedText,
              sourceLinks:section.querySelectorAll('[data-source-label-es]').length,
              htmlLang:document.documentElement.lang};
          });
          const path='qa-reports/screenshots/fr-accessibility-triage/'+profile.name+'-'+venue.id+'-'+language+'.png';
          await page.screenshot({path,fullPage:true});
          report.results.push({profile:profile.name,venue:venue.id,language,metrics,screenshot:path,
            candidates:metrics.outsideControls.length+metrics.unnamedControls.length+metrics.clippedText.length+
              Number(metrics.documentWidth>metrics.viewportWidth+2)});
        }
      }
    }finally{
      report.results.push(...errors.map(message=>({profile:profile.name,pageError:message})));
      await context.close();
    }
  }
}finally{await browser.close();}
writeFileSync('qa-reports/fr-detail-accessibility-triage.json',JSON.stringify(report,null,2)+'\\n');
const rows=report.results.filter(item=>item.metrics);
const totals={views:rows.length,withCandidates:rows.filter(r=>r.candidates).length,
  errors:report.results.filter(r=>r.pageError).length};
console.log('FR DETAIL ACCESSIBILITY TRIAGE '+JSON.stringify(totals));
for(const r of rows.filter(r=>r.candidates)){
  console.log('FR DETAIL ACCESSIBILITY CANDIDATE '+JSON.stringify({profile:r.profile,venue:r.venue,language:r.language,
    candidates:r.candidates,metrics:r.metrics}));
}
if(totals.views!==18||totals.errors)process.exitCode=1;
