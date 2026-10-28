import {chromium,devices} from 'playwright';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const files=['batch-011-taberna-el-abuelo.json','batch-012-taberna-el-abuelo.json','batch-013-taberna-el-abuelo.json'];
const expected=files.flatMap(f=>JSON.parse(readFileSync('translations/fr/'+f,'utf8')).entries);
mkdirSync('qa-reports/screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];
for(const profile of [{name:'desktop',options:{viewport:{width:1365,height:900}}},{name:'mobile',options:devices['iPhone 13']}]){
 const ctx=await browser.newContext(profile.options),page=await ctx.newPage(),issues=[];
 page.on('pageerror',e=>issues.push('JS: '+e.message));
 try{
  await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.some(p=>p.id==='taberna-el-abuelo'));
  await page.locator('#language-select').selectOption('fr');
  await page.evaluate(()=>showPlace(state.places.find(p=>p.id==='taberna-el-abuelo'),false));
  const fr=await page.locator('#detail-content [data-dish-explanation]:visible').allTextContents();
  if(fr.length!==31)issues.push('Expected 31 French entries, received '+fr.length);
  if(fr.some((t,i)=>t!==expected[i]?.fr))issues.push('Unexpected French ordering/text');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))issues.push('Horizontal overflow');
  await page.screenshot({path:'qa-reports/screenshots/'+profile.name+'-el-abuelo-fr.png',fullPage:true});
  for(const language of ['es','en']){
   await page.locator('#language-select').selectOption(language);
   const titles=await page.locator('#detail-content .menu-dish h4').count();
   if(titles!==31)issues.push(language+' original dish count '+titles);
  }
 }catch(error){issues.push(error.message)}
 results.push({profile:profile.name,status:issues.length?'FAIL':'PASS',issues});
 await ctx.close();
}
await browser.close();
const status=results.every(x=>x.status==='PASS')?'PASS':'FAIL';
writeFileSync('qa-reports/fr-el-abuelo-31.json',JSON.stringify({status,results},null,2)+'\n');
console.log('FR EL ABUELO '+JSON.stringify({status,results}));
if(status==='FAIL')process.exitCode=1;
