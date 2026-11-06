import {chromium,devices} from 'playwright';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const candidates=['batch-001-la-montillana.json','batch-002-la-montillana.json','batch-003-la-montillana.json']
 .flatMap(filename=>JSON.parse(readFileSync('translations/fr/'+filename,'utf8')).entries);
const profiles=[{name:'desktop',settings:{viewport:{width:1365,height:900}}},{name:'mobile',settings:devices['iPhone 13']}];
mkdirSync('qa-reports/screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];
for(const profile of profiles){
 const context=await browser.newContext(profile.settings),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push('JavaScript: '+e.message));
 try{
  await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.some(p=>p.id==='la-montillana'));
  await page.locator('#language-select').selectOption('fr');
  await page.evaluate(()=>showPlace(state.places.find(p=>p.id==='la-montillana'),false));
  const texts=await page.locator('#detail-content [data-dish-explanation]:visible').allTextContents();
  if(texts.length!==candidates.length)errors.push('Expected '+candidates.length+' French explanations; received '+texts.length);
  if(texts.some((text,index)=>text!==candidates[index]?.fr))errors.push('French descriptions do not match candidate order');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))errors.push('Horizontal overflow');
  await page.screenshot({path:'qa-reports/screenshots/'+profile.name+'-real-detail-fr-30.png',fullPage:true});
  await page.locator('#language-select').selectOption('es');
  const esCount=await page.locator('#detail-content [data-dish-explanation]:visible').count();
  await page.locator('#language-select').selectOption('en');
  const enCount=await page.locator('#detail-content [data-dish-explanation]:visible').count();
  if(esCount<30||enCount<30)errors.push('Source-language descriptions missing');
 }catch(e){errors.push('Interrupted: '+e.message)}
 results.push({profile:profile.name,status:errors.length?'FAIL':'PASS',errors});
 await context.close();
}
await browser.close();
const status=results.some(result=>result.errors.length)?'FAIL':'PASS';
const report={suite:'FR real restaurant detail 30 candidate descriptions',status,results};
writeFileSync('qa-reports/fr-real-detail-30.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(status==='FAIL')process.exitCode=1;
