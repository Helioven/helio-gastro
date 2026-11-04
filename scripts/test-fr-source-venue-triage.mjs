// Targeted read-only ES/EN/FR source-label and layout regression for three distinct venues.
// Source labels are checked for stable URLs, not editorial approval of translations.
import {chromium,devices} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';

const venues=['moriles-ribera','moriles-casa-fina','pastelerias-roldan-centro'];
const profiles=[
  {name:'desktop',options:{viewport:{width:1365,height:900}}},
  {name:'mobile',options:devices['iPhone 13']},
];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const report={scope:'targeted_source_links_and_geometry_not_editorial_approval',results:[]};
mkdirSync('qa-reports/screenshots/fr-source-venue-triage',{recursive:true});
try{
  for(const profile of profiles){
    const context=await browser.newContext(profile.options);
    const page=await context.newPage();
    try{
      for(const venue of venues){
        const errors=[];
        const pageErrors=[];
        const onPageError=e=>pageErrors.push(e.message);
        page.on('pageerror',onPageError);
        try{
          await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1',{waitUntil:'domcontentloaded'});
          await page.waitForFunction(id=>typeof state!=='undefined'&&state.places.some(p=>p.id===id),venue);
          const observations={};
          for(const lang of ['es','fr','en','fr','es']){
            await page.locator('#language-select').selectOption(lang);
            await page.evaluate(id=>showPlace(state.places.find(p=>p.id===id),false),venue);
            await page.waitForFunction(l=>document.documentElement.lang===l,lang);
            await page.waitForTimeout(60);
            const snapshot=await page.evaluate(()=>{
              const root=document.querySelector('#detail-section');
              const links=[...root.querySelectorAll('[data-source-label-es]')].map(a=>({
                original:a.dataset.sourceLabelEs||'',
                label:(a.textContent||'').trim(),
                href:a.getAttribute('href'),
              }));
              return {links,documentWidth:document.documentElement.scrollWidth,
                viewportWidth:window.innerWidth,detailWidth:root.scrollWidth,detailClientWidth:root.clientWidth};
            });
            (observations[lang]??=[]).push(snapshot);
            if(snapshot.links.length===0)errors.push(lang+': missing source links');
            if(snapshot.links.some(l=>!l.label||!l.href))errors.push(lang+': blank link label or href');
            if(snapshot.documentWidth>snapshot.viewportWidth+2)errors.push(lang+': document overflow '+snapshot.documentWidth+'/'+snapshot.viewportWidth);
            if(snapshot.detailWidth>snapshot.detailClientWidth+2)errors.push(lang+': detail overflow '+snapshot.detailWidth+'/'+snapshot.detailClientWidth);
          }
          const baseline=observations.es[0].links.map(x=>({original:x.original,href:x.href}));
          for(const [lang,snapshots] of Object.entries(observations)){
            for(const snap of snapshots){
              const actual=snap.links.map(x=>({original:x.original,href:x.href}));
              if(JSON.stringify(actual)!==JSON.stringify(baseline))errors.push(lang+': source identity/href changed');
            }
          }
          for(const lang of ['es','fr']){
            const a=observations[lang][0].links.map(l=>l.label);
            const b=observations[lang][1].links.map(l=>l.label);
            if(JSON.stringify(a)!==JSON.stringify(b))errors.push(lang+': labels not restored on round-trip');
          }
          await page.locator('#language-select').selectOption('fr');
          await page.evaluate(id=>showPlace(state.places.find(p=>p.id===id),false),venue);
          const screenshot='qa-reports/screenshots/fr-source-venue-triage/'+profile.name+'-'+venue+'-fr.png';
          await page.screenshot({path:screenshot,fullPage:true});
          report.results.push({profile:profile.name,venue,status:errors.length?'FAIL':'PASS',errors,
            sources:baseline.length,observations,screenshot});
        }catch(e){
          report.results.push({profile:profile.name,venue,status:'FAIL',errors:[...errors,e.message]});
        }finally{
          page.off('pageerror',onPageError);
          if(pageErrors.length){
            const item=report.results[report.results.length-1];
            item.errors.push(...pageErrors.map(e=>'JS: '+e));
            item.status='FAIL';
          }
        }
      }
    }finally{await context.close();}
  }
}finally{await browser.close();}
writeFileSync('qa-reports/fr-source-venue-triage.json',JSON.stringify(report,null,2)+'\n');
console.log('FR SOURCE VENUE TRIAGE '+JSON.stringify(report.results.map(x=>({
  profile:x.profile,venue:x.venue,status:x.status,sources:x.sources,errors:x.errors
}))));
if(report.results.length!==6||report.results.some(x=>x.status!=='PASS'))process.exitCode=1;
