import { chromium, devices } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
const base='http://127.0.0.1:8765/qa-fr-la-montillana.html';
const profiles=[
 {name:'desktop',viewport:{width:1365,height:900},isMobile:false},
 {name:'mobile',...devices['iPhone 13'],browserName:undefined},
];
mkdirSync('qa-reports/screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const report=[];
let fail=false;
for(const profile of profiles){
 const context=await browser.newContext(profile.name==='mobile'?{...devices['iPhone 13']}:{viewport:profile.viewport});
 const page=await context.newPage();const faults=[];
 page.on('pageerror',e=>faults.push('pageerror: '+e.message));
 page.on('console',msg=>{if(msg.type()==='error')faults.push('console: '+msg.text())});
 const response=await page.goto(base,{waitUntil:'networkidle'});
 await page.locator('main#dishes article').first().waitFor({timeout:15000});
 const count=await page.locator('main#dishes article').count();
 const texts={};
 for(const language of ['es','en','fr']){
   await page.locator('#lang').selectOption(language);
   const selector=page.locator('main#dishes article p').first();
   texts[language]=await selector.textContent();
   if(!texts[language]?.trim())faults.push(language+' first description blank');
   if(await page.locator('main#dishes article').count()!==15)faults.push(language+' wrong card count');
   const htmlLang=await page.locator('html').getAttribute('lang');
   if(htmlLang!==language)faults.push(language+' html lang mismatch: '+htmlLang);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
   if(overflow)faults.push(language+' horizontal viewport overflow');
   await page.screenshot({path:'qa-reports/screenshots/'+profile.name+'-'+language+'.png',fullPage:true});
 }
 if(count!==15)faults.push('initial card count '+count);
 if(texts.es===texts.fr||texts.en===texts.fr||texts.es===texts.en)faults.push('language descriptions not distinct');
 if(response.status()!==200)faults.push('HTTP status '+response.status());
 const result={profile:profile.name,viewport:page.viewportSize(),cards:count,distinctLanguages:new Set(Object.values(texts)).size===3,errors:faults};
 report.push(result);if(faults.length)fail=true;
 await context.close();
}
await browser.close();
writeFileSync('qa-reports/fr-visual-qa.json',JSON.stringify({status:fail?'FAIL':'PASS',profiles:report},null,2)+'\n');
console.log('FR VISUAL QA '+JSON.stringify({status:fail?'FAIL':'PASS',profiles:report}));
if(fail)process.exitCode=1;
