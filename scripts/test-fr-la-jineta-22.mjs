import {chromium,devices} from 'playwright';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const entries=['batch-006-cafeteria-bar-la-jineta.json','batch-007-cafeteria-bar-la-jineta.json'].flatMap(f=>JSON.parse(readFileSync('translations/fr/'+f,'utf8')).entries);
mkdirSync('qa-reports/screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];
for(const p of [{name:'desktop',options:{viewport:{width:1365,height:900}}},{name:'mobile',options:devices['iPhone 13']}]){
 const context=await browser.newContext(p.options),page=await context.newPage(),issues=[];
 page.on('pageerror',e=>issues.push('JavaScript: '+e.message));
 try{
  await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.some(x=>x.id==='cafeteria-bar-la-jineta'));
  await page.locator('#language-select').selectOption('fr');
  await page.evaluate(()=>showPlace(state.places.find(x=>x.id==='cafeteria-bar-la-jineta'),false));
  const fr=await page.locator('#detail-content [data-dish-explanation]:visible').allTextContents();
  if(fr.length!==22)issues.push('Expected 22 French explanations, got '+fr.length);
  if(fr.some((t,i)=>t!==entries[i]?.fr))issues.push('French candidate text mismatch');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))issues.push('Horizontal overflow');
  await page.screenshot({path:'qa-reports/screenshots/'+p.name+'-la-jineta-fr.png',fullPage:true});
  for(const lang of ['es','en']){
   await page.locator('#language-select').selectOption(lang);
   const titles=await page.locator('#detail-content .menu-dish h4').count();
   if(titles!==22)issues.push(lang+' original dish count '+titles);
  }
 }catch(e){issues.push(e.message)}
 results.push({profile:p.name,status:issues.length?'FAIL':'PASS',issues});
 await context.close();
}
await browser.close();
const status=results.every(x=>x.status==='PASS')?'PASS':'FAIL';
writeFileSync('qa-reports/fr-la-jineta-22.json',JSON.stringify({status,results},null,2)+'\n');
console.log('FR LA JINETA '+JSON.stringify({status,results}));
if(status==='FAIL')process.exitCode=1;
