// HG-QA-A11Y-002: computed-color contrast candidates and dynamic-status semantics.
// Heuristic only: skips gradients/images/partially transparent layers; not a WCAG audit.
import {chromium,devices} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const profiles=[{name:'desktop',config:{viewport:{width:1365,height:900}}},{name:'mobile-viewport',config:devices['iPhone 13']}];
const languages=['es','en','fr'];
const results=[];let failed=false;mkdirSync('qa-reports',{recursive:true});
for(const profile of profiles){
 const ctx=await browser.newContext(profile.config),page=await ctx.newPage(),errors=[];
 page.on('pageerror',e=>errors.push('JavaScript: '+e.message));
 try{
  await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length===43);
  for(const language of languages){
   const failuresBefore=errors.length;
   await page.locator('#language-select').selectOption(language);
   await page.waitForFunction(lang=>document.documentElement.lang===lang,language);
   if(language==='fr')await page.waitForFunction(()=>!!state.places.find(p=>p.id==='la-montillana')?.menuSections?.[0]?.items?.[0]?.fr,null,{timeout:45000});
   await page.locator('[data-service="merienda"]').click();
   await page.waitForFunction(()=>!!document.querySelector('#service-intro')?.textContent?.trim());
   await page.locator('#clear-search').click();
   await page.locator('#place-name').fill('La Montillana');
   await page.locator('#filters').evaluate(form=>form.requestSubmit());
   await page.waitForFunction(()=>state.searched&&state.filtered.some(p=>p.id==='la-montillana'));
   const check=await page.evaluate(()=>{
    const selectors=['header .version','.hero h2','.hero p','.panel .note','form label','#language-select','#place-name',
     '.primary','#clear-search','#service-intro','#results-heading','#count','#coverage-summary',
     '#results article.place h3','#results article.place button'];
    function rgba(s){
     const m=s.match(/^rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)(?:\s*,\s*([\d.]+))?\s*\)$/);
     return m?[+m[1],+m[2],+m[3],m[4]===undefined?1:+m[4]]:null;
    }
    const blend=(top,under)=>[0,1,2].map(i=>top[i]*top[3]+under[i]*(1-top[3]));
    const luminance=color=>{
     const channels=color.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
     return .2126*channels[0]+.7152*channels[1]+.0722*channels[2];
    };
    const samples=[];
    for(const selector of selectors){
     const node=document.querySelector(selector);
     if(!node||node.hidden||!node.getClientRects().length)continue;
     const cs=getComputedStyle(node),fg=rgba(cs.color);
     // A gradient or image across any ancestor defeats this solid-color approximation.
     let current=node,bg=[255,255,255],backgrounds=[],uncertain=false;
     while(current&&current.nodeType===1){
      const st=getComputedStyle(current);
      if(st.backgroundImage!=='none'||st.opacity!=='1'){uncertain=true;break;}
      const c=rgba(st.backgroundColor);
      if(!c){uncertain=true;break;}
      backgrounds.push(c);current=current.parentElement;
     }
     for(const c of backgrounds.reverse())bg=blend(c,bg);
     let ratio=null;
     if(!uncertain&&fg&&fg[3]===1){
      const l1=luminance(fg.slice(0,3)),l2=luminance(bg);
      ratio=+(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);
     }
     const fontSize=parseFloat(cs.fontSize),bold=Number.parseInt(cs.fontWeight,10)>=700;
     const large=fontSize>=24||(fontSize>=18.66&&bold);
     samples.push({selector,text:node.textContent.trim().replace(/\s+/g,' ').slice(0,85),
      computedForeground:cs.color,backgroundAnalyzable:!uncertain,
      estimatedContrast:ratio===null?null:Math.round(ratio*100)/100,
      referenceThreshold:large?3:4.5,belowReference:ratio!==null&&ratio<(large?3:4.5),
      note:'Approximate opaque text on solid CSS backgrounds; confirm visually'});
    }
    const status=['service-intro','coverage-summary','results','compare-output','favorite-notice'].map(id=>{
     const el=document.getElementById(id);
     return {id,present:!!el,role:el?.getAttribute('role')||null,live:el?.getAttribute('aria-live')||null,
      hidden:!!el?.hidden,textLength:el?.textContent?.trim().length||0};
    });
    return {htmlLang:document.documentElement.lang,samples,status,
     hiddenVenue:!state.places.some(p=>p.id==='el-caballo-rojo')};
   });
   if(check.htmlLang!==language||!check.hiddenVenue)errors.push('Language or hidden venue regression '+language);
   if(!check.status.find(s=>s.id==='service-intro'&&s.role==='status'&&s.textLength>0))
    errors.push('Service update lacks a readable status '+language);
   if(!check.status.find(s=>s.id==='results'&&s.live==='polite'&&s.textLength>0))
    errors.push('Search results missing live region '+language);
   if(!check.status.find(s=>s.id==='coverage-summary'&&s.role==='status'))
    errors.push('Coverage summary semantic role missing '+language);
   results.push({profile:profile.name,language,status:errors.length>failuresBefore?'FAIL':'PASS',
    evaluated:check.samples.length,contrastReviewCandidates:check.samples.filter(s=>s.belowReference),
    unmeasurable:check.samples.filter(s=>!s.backgroundAnalyzable).map(s=>s.selector),
    statusRegions:check.status,errors:errors.slice(failuresBefore)});
  }
 }catch(e){errors.push('Interrupted: '+e.message);results.push({profile:profile.name,status:'FAIL',errors})}
 if(errors.length)failed=true;
 await ctx.close();
}
await browser.close();
const report={suite:'HG-QA-A11Y-002',status:failed?'FAIL':'PASS',
 caveat:'Contrast ratios are approximate for solid opaque colors, not WCAG results; gradient/image/opacity samples require manual review; PASS means structural assertions only',
 results};
writeFileSync('qa-reports/contrast-status-inventory.json',JSON.stringify(report,null,2)+'\n');
console.log('CONTRAST STATUS INVENTORY '+JSON.stringify({status:report.status,results:results.map(r=>({
 profile:r.profile,language:r.language,status:r.status,evaluated:r.evaluated,
 contrastCandidates:r.contrastReviewCandidates?.length||0,unmeasurable:r.unmeasurable?.length||0,errors:r.errors
}))}));
if(failed)process.exitCode=1;
