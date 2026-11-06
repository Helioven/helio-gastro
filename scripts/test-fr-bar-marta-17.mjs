import {chromium,devices} from 'playwright';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const files=['batch-004-churros-bar-marta.json','batch-005-churros-bar-marta.json'];
const expected=files.flatMap(f=>JSON.parse(readFileSync('translations/fr/'+f,'utf8')).entries);
mkdirSync('qa-reports/screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];
for(const config of [{name:'desktop',options:{viewport:{width:1365,height:900}}},{name:'mobile',options:devices['iPhone 13']}]){
 const context=await browser.newContext(config.options),page=await context.newPage(),issues=[];
 page.on('pageerror',e=>issues.push('Page error: '+e.message));
 try{
  await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.some(p=>p.id==='churros-bar-marta'));
  await page.locator('#language-select').selectOption('fr');
  await page.evaluate(()=>showPlace(state.places.find(p=>p.id==='churros-bar-marta'),false));
  const texts=await page.locator('#detail-content [data-dish-explanation]:visible').allTextContents();
  if(texts.length!==17)issues.push('French explanations: '+texts.length+' instead of 17');
  if(texts.some((t,i)=>t!==expected[i]?.fr))issues.push('French text order or values differ');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))issues.push('Horizontal overflow');
  await page.screenshot({path:'qa-reports/screenshots/'+config.name+'-bar-marta-fr.png',fullPage:true});
  for(const lang of ['es','en']){
   await page.locator('#language-select').selectOption(lang);
   const count=await page.locator('#detail-content [data-dish-explanation]:visible').count();
   if(lang==='en'&&count!==17)issues.push(lang+' description count: '+count);
   if(lang==='es'&&count!==0)issues.push('ES duplicate explanations unexpectedly shown: '+count);
   if(lang==='es'){
    const titles=await page.locator('#detail-content .menu-dish h4').allTextContents();
    if(titles.length!==17)issues.push('ES dish titles count: '+titles.length);
   }
  }
 }catch(e){issues.push(e.message)}
 results.push({profile:config.name,status:issues.length?'FAIL':'PASS',issues});
 await context.close();
}
await browser.close();
const status=results.every(r=>r.status==='PASS')?'PASS':'FAIL';
writeFileSync('qa-reports/fr-bar-marta-17.json',JSON.stringify({status,results},null,2)+'\n');
console.log('FR BAR MARTA '+JSON.stringify({status,results}));
if(status==='FAIL')process.exitCode=1;
