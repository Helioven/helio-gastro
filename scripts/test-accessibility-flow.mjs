// HG-QA-A11Y-001: keyboard and semantic-flow regression in public ES/EN/FR.
// Chromium automated checks are NOT a screen-reader or WCAG conformance audit.
import {chromium,devices} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const profiles=[
 {name:'desktop',config:{viewport:{width:1365,height:900}}},
 {name:'mobile-viewport',config:devices['iPhone 13']}
];
const languages=['es','en','fr'];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];let failed=false;
mkdirSync('qa-reports',{recursive:true});
for(const profile of profiles){
 const context=await browser.newContext(profile.config);
 const page=await context.newPage();
 const jsErrors=[];
 page.on('pageerror',e=>jsErrors.push(e.message));
 try{
  await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.some(p=>p.id==='la-montillana'));
  for(const lang of languages){
   const errors=[];const beforeErrors=jsErrors.length;
   try{
    await page.locator('#language-select').selectOption(lang);
    await page.waitForFunction(value=>document.documentElement.lang===value,lang);
    if(lang==='fr'){
     await page.waitForFunction(()=>!!state.places.find(p=>p.id==='la-montillana')?.menuSections?.[0]?.items?.[0]?.fr,
      null,{timeout:45000});
    }
    await page.locator('#clear-search').click();
    const structure=await page.evaluate(()=>{
     const ids=['language-select','place-name','dish','price-scope','budget','area','portion','price-kind','sort'];
     const accessibleName=(el)=>!!(el.getAttribute('aria-label')?.trim()||
       (el.getAttribute('aria-labelledby')||'').split(/\s+/).some(id=>id&&document.getElementById(id)?.textContent?.trim())||
       el.labels&&[...el.labels].some(label=>label.textContent.trim()));
     return {
      htmlLang:document.documentElement.lang,
      unnamedInputs:ids.filter(id=>!accessibleName(document.getElementById(id))),
      searchStatus:document.querySelector('#results')?.getAttribute('aria-live'),
      coverageStatus:document.querySelector('#coverage-summary')?.getAttribute('role'),
      serviceStatus:document.querySelector('#service-intro')?.getAttribute('role'),
      searchHeadingFocusTarget:document.querySelector('#results-heading')?.getAttribute('tabindex'),
      hiddenVenue:!state.places.some(p=>p.id==='el-caballo-rojo'),
      noHorizontalOverflow:document.documentElement.scrollWidth<=innerWidth+2
     };
    });
    if(structure.htmlLang!==lang)errors.push('Document language mismatch');
    if(structure.unnamedInputs.length)errors.push('Unnamed form controls: '+structure.unnamedInputs.join(','));
    if(structure.searchStatus!=='polite'||structure.coverageStatus!=='status'||structure.serviceStatus!=='status')
     errors.push('Missing search/status semantics');
    if(structure.searchHeadingFocusTarget!=='-1')errors.push('Results heading lacks programmatic focus');
    if(!structure.hiddenVenue)errors.push('Hidden venue leaked into app state');
    if(!structure.noHorizontalOverflow)errors.push('Horizontal overflow');
    const searchField=page.locator('#place-name');
    await searchField.fill('La Montillana');
    await searchField.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(()=>state.searched&&state.filtered.some(p=>p.id==='la-montillana'));
    if(await page.locator('#results-section').isHidden())errors.push('Search results remain hidden');
    const focusAfterSearch=await page.evaluate(()=>document.activeElement?.id);
    if(focusAfterSearch!=='results-heading')errors.push('Search did not focus results heading: '+focusAfterSearch);
    await page.evaluate(()=>showPlace(state.places.find(p=>p.id==='la-montillana')));
    await page.locator('#detail-title').waitFor({state:'visible'});
    const detailFocus=await page.evaluate(()=>document.activeElement?.id);
    if(detailFocus!=='detail-title')errors.push('Opening detail did not focus heading: '+detailFocus);
    const close=page.locator('#close-detail');
    await close.focus();
    await page.keyboard.press('Enter');
    if(!(await page.locator('#detail-section').isHidden()))errors.push('Keyboard did not close detail');
    const returnFocus=await page.evaluate(()=>document.activeElement?.id);
    if(returnFocus!=='results-heading')errors.push('Close detail did not restore results focus: '+returnFocus);
    if(jsErrors.length>beforeErrors)errors.push('JavaScript errors: '+jsErrors.slice(beforeErrors).join('; '));
    results.push({profile:profile.name,language:lang,status:errors.length?'FAIL':'PASS',checks:structure,
     focus:{search:focusAfterSearch,detail:detailFocus,return:returnFocus},errors});
   }catch(e){
    errors.push('Interrupted: '+e.message);
    results.push({profile:profile.name,language:lang,status:'FAIL',errors});
   }
   if(errors.length)failed=true;
  }
 }finally{await context.close()}
}
await browser.close();
const report={suite:'HG-QA-A11Y-001',status:failed?'FAIL':'PASS',
 scope:'Keyboard focus, labels and live regions in Chromium; no automated WCAG certification or screen-reader evidence',
 results};
writeFileSync('qa-reports/accessibility-flow.json',JSON.stringify(report,null,2)+'\n');
console.log('ACCESSIBILITY FLOW '+JSON.stringify(report));
if(failed)process.exitCode=1;
