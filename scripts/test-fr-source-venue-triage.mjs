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
            if(venue==='moriles-ribera'){
              const official=await page.evaluate(()=>{
                const section=document.querySelector('#detail-content .official-menu-resources');
                return section?{
                  heading:section.querySelector('[data-official-menus-heading]')?.textContent?.trim(),
                  notice:section.querySelector('[data-official-menu-notice-es]')?.textContent?.trim(),
                  links:[...section.querySelectorAll('[data-official-menu-es]')].map(a=>({
                    es:a.dataset.officialMenuEs,en:a.dataset.officialMenuEn,
                    label:a.textContent.trim(),href:a.getAttribute('href')
                  }))
                }:null;
              });
              if(!official){errors.push(lang+': missing official-menu section');}
              else{
                const translations=new Map([
                  ['Carta de cocina','Carte des plats'],
                  ['Menú Tapas Cordobesas','Menu « Tapas Cordobesas »'],
                  ['Postres','Desserts'],
                  ['Cafés, tés y chocolates','Cafés, thés et chocolats'],
                  ['Carta de cocina en inglés','Carte des plats en anglais'],
                  ['Menú sugerido en inglés','Menu suggéré en anglais'],
                  ['Glosario de traducciones','Glossaire des traductions']
                ]);
                const frNotice='Carte officielle espagnole de 2026 transcrite en 15 sections. Vérifiez les prix dans la source d’origine ; leur validité peut avoir changé. Les traductions en anglais sont toujours en cours de révision.';
                const expectedHeading=lang==='fr'?'Cartes officielles':lang==='en'?'Official menus':'Cartas oficiales';
                if(official.heading!==expectedHeading)errors.push(lang+': official menu heading '+JSON.stringify(official.heading));
                if(lang==='fr'&&official.notice!==frNotice)errors.push('fr: official menu notice differs');
                if(official.links.length!==7)errors.push(lang+': expected seven official links; got '+official.links.length);
                for(const link of official.links){
                  const expectedLabel=lang==='fr'?translations.get(link.es):lang==='en'?link.en:link.es;
                  if(!expectedLabel)errors.push(lang+': unexpected official link '+link.es);
                  else if(link.label!==expectedLabel+' ↗')errors.push(lang+': official menu label '+link.es+' => '+link.label);
                  if(!/^https:\/\//.test(link.href||''))errors.push(lang+': invalid official link URL '+link.es);
                }
                const previous=(observations.es?.[0]||{}).official;
                if(previous&&JSON.stringify(official.links.map(l=>({es:l.es,en:l.en,href:l.href})))!==JSON.stringify(previous.links.map(l=>({es:l.es,en:l.en,href:l.href}))))
                  errors.push(lang+': official menu URL or source metadata changed');
                snapshot.official=official;
              }
            }
            if(snapshot.links.length===0)errors.push(lang+': missing source links');
            if(snapshot.links.some(l=>!l.label||!l.href))errors.push(lang+': blank link label or href');
            if(venue==='moriles-ribera'&&lang==='fr'){
              const expectedSourceLabels=new Map([
                ['Carta española oficial · ibéricos, tostas, risottos y pastas (febrero 2026)','Carte officielle en espagnol · Ibériques, fromages et charcuteries, tartines, risottos et pâtes (février 2026) ↗'],
                ['Carta española oficial · revueltos, verduras y pescados (febrero 2026)','Carte officielle en espagnol · Œufs brouillés et légumes, poissons (février 2026) ↗']
              ]);
              for(const [original,expected] of expectedSourceLabels){
                const links=snapshot.links.filter(link=>link.original===original);
                if(links.length!==1)errors.push('fr: expected exactly one source label for '+original);
                else if(links[0].label!==expected)errors.push('fr: incorrect source label for '+original+': '+links[0].label);
              }
            }
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
