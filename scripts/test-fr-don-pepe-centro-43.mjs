import {chromium,devices} from 'playwright';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const filenames=['batch-030-don-pepe-centro.json','batch-031-don-pepe-centro.json','batch-032-don-pepe-centro.json','batch-033-don-pepe-centro.json'];
const expected=filenames.flatMap(f=>JSON.parse(readFileSync('translations/fr/'+f,'utf8')).entries);
mkdirSync('qa-reports/screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];
for(const profile of [{name:'desktop',options:{viewport:{width:1435,height:900}}},{name:'mobile',options:devices['iPhone 13']}]){
 const ctx=await browser.newContext(profile.options),page=await ctx.newPage(),issues=[];
 page.on('pageerror',e=>issues.push('JS: '+e.message));
 try{
  await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.some(p=>p.id==='cafeteria-don-pepe-centro'));
  await page.locator('#language-select').selectOption('fr');
  await page.evaluate(()=>showPlace(state.places.find(p=>p.id==='cafeteria-don-pepe-centro'),false));
  const originalDishNames=await page.locator('#detail-content .menu-dish h4').allTextContents();
  const baseline=await ctx.newPage();
  await baseline.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded'});
  await baseline.waitForFunction(()=>typeof state!=='undefined'&&state.places.some(p=>p.id==='cafeteria-don-pepe-centro'));
  await baseline.locator('#language-select').selectOption('en');
  await baseline.evaluate(()=>showPlace(state.places.find(p=>p.id==='cafeteria-don-pepe-centro'),false));
  const originalEnglishTitles=await baseline.locator('#detail-content .menu-dish h4').allTextContents();
  await baseline.close();
  if(originalDishNames.length<43)issues.push('Visible dish titles fewer than translated descriptions');
  const fr=await page.locator('#detail-content [data-dish-explanation]:visible').allTextContents();
  if(fr.length!==43)issues.push('French explanations: '+fr.length+' expected 43');
  if(fr.some((text,i)=>text!==expected[i]?.fr))issues.push('French translation mismatch');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))issues.push('Horizontal overflow');
  await page.screenshot({path:'qa-reports/screenshots/'+profile.name+'-cafeteria-don-pepe-centro-fr.png',fullPage:true});
  for(const lang of ['es','en']){
   await page.locator('#language-select').selectOption(lang);
   const names=await page.locator('#detail-content .menu-dish h4').allTextContents();
   if(names.length!==originalDishNames.length)issues.push(lang+' dish title count '+names.length+' expected '+originalDishNames.length);
   if(lang==='es'&&names.some((name,i)=>name!==originalDishNames[i]))issues.push('Spanish original dish titles changed');
   if(lang==='en'&&names.some((name,i)=>name!==originalEnglishTitles[i]))issues.push('English dish titles differ from public baseline');
  }
 }catch(e){issues.push(e.message)}
 results.push({profile:profile.name,status:issues.length?'FAIL':'PASS',issues});
 await ctx.close();
}
await browser.close();
const status=results.some(r=>r.issues.length)?'FAIL':'PASS';
writeFileSync('qa-reports/fr-cafeteria-don-pepe-centro-43.json',JSON.stringify({status,results},null,2)+'\n');
console.log('FR DON PEPE CENTRO '+JSON.stringify({status,results}));
if(status==='FAIL')process.exitCode=1;
