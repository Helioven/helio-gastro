import {chromium,devices} from 'playwright';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const entries=['batch-008-la-tarterie-centro.json','batch-009-la-tarterie-centro.json','batch-010-la-tarterie-centro.json'].flatMap(f=>JSON.parse(readFileSync('translations/fr/'+f,'utf8')).entries);
mkdirSync('qa-reports/screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];
for(const config of [{name:'desktop',options:{viewport:{width:1365,height:900}}},{name:'mobile',options:devices['iPhone 13']}]){
 const context=await browser.newContext(config.options),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push('JS: '+e.message));
 try{
  await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.some(p=>p.id==='la-tarterie-centro'));
  await page.locator('#language-select').selectOption('fr');
  await page.evaluate(()=>showPlace(state.places.find(p=>p.id==='la-tarterie-centro'),false));
  const actual=await page.locator('#detail-content [data-dish-explanation]:visible').allTextContents();
  if(actual.length!==28)errors.push('French descriptions: '+actual.length+' instead of 28');
  if(actual.some((t,i)=>t!==entries[i]?.fr))errors.push('French candidate ordering or wording mismatch');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))errors.push('Horizontal overflow');
  await page.screenshot({path:'qa-reports/screenshots/'+config.name+'-la-tarterie-fr.png',fullPage:true});
  for(const language of ['es','en']){
   await page.locator('#language-select').selectOption(language);
   const titles=await page.locator('#detail-content .menu-dish h4').count();
   if(titles!==28)errors.push(language+' source dish title count '+titles);
  }
 }catch(e){errors.push(e.message)}
 results.push({profile:config.name,status:errors.length?'FAIL':'PASS',errors});
 await context.close();
}
await browser.close();
const status=results.some(x=>x.errors.length)?'FAIL':'PASS';
writeFileSync('qa-reports/fr-la-tarterie-28.json',JSON.stringify({status,results},null,2)+'\n');
console.log('FR LA TARTERIE '+JSON.stringify({status,results}));
if(status==='FAIL')process.exitCode=1;
