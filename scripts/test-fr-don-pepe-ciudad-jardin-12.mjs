import {chromium,devices} from 'playwright';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const entries=['batch-081-don-pepe-ciudad-jardin.json','batch-082-don-pepe-ciudad-jardin.json'].flatMap(name=>JSON.parse(readFileSync('translations/fr/'+name,'utf8')).entries);
const id='cafeteria-don-pepe-ciudad-jardin';
mkdirSync('qa-reports/screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];
for(const profile of [{name:'desktop',options:{viewport:{width:1365,height:900}}},{name:'mobile',options:devices['iPhone 13']}]){
 const context=await browser.newContext(profile.options),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push('JS: '+e.message));
 page.on('console',m=>{if(m.type()==='warning'&&m.text().includes('French QA batch unavailable'))errors.push(m.text());});
 try{
  await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(id=>typeof state!=='undefined'&&state.places.some(p=>p.id===id),id);
  const source=await page.evaluate(id=>state.places.find(p=>p.id===id),id);
  if(source.menuSections?.[0]?.items?.[0]?.fr!==entries[0].fr)errors.push('FR overlay not applied to first item');
  await page.locator('#language-select').selectOption('fr');
  await page.evaluate(id=>showPlace(state.places.find(p=>p.id===id),false),id);
  const fr=await page.locator('#detail-content [data-dish-explanation]:visible').allTextContents();
  if(fr.length!==24||fr.some((value,i)=>value!==entries[i].fr))errors.push('FR visible text count/order mismatch: '+fr.length);
  const es=[];
  for(const lang of ['es','en']){
   await page.locator('#language-select').selectOption(lang);
   const texts=await page.locator('#detail-content [data-dish-explanation]:visible').allTextContents();
   if(texts.length===0)errors.push(lang+' has no visible descriptions');
   // The inventory counts ES/EN source pairs; the UI intentionally omits descriptions identical to dish titles.
   // Compare against the unmodified public rendering below instead of assuming all 103 are visible.
   es.push(texts);
  }
  await page.locator('#language-select').selectOption('fr');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))errors.push('Horizontal overflow');
  await page.screenshot({path:'qa-reports/screenshots/'+profile.name+'-don-pepe-ciudad-jardin-fr.png',fullPage:true});
  const base=await context.newPage();
  await base.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded'});
  await base.waitForFunction(id=>typeof state!=='undefined'&&state.places.some(p=>p.id===id),id);
  if((await base.locator('#language-select option[value="fr"]').count())!==0)errors.push('FR exposed publicly');
  for(const [i,lang] of ['es','en'].entries()){
   await base.locator('#language-select').selectOption(lang);
   await base.evaluate(id=>showPlace(state.places.find(p=>p.id===id),false),id);
   const texts=await base.locator('#detail-content [data-dish-explanation]:visible').allTextContents();
   if(JSON.stringify(texts)!==JSON.stringify(es[i]))errors.push(lang+' differs from public baseline');
  }
  await base.close();
 }catch(error){errors.push('Interrupted: '+error.message)}
 results.push({profile:profile.name,status:errors.length?'FAIL':'PASS',errors});await context.close();
}
await browser.close();
const status=results.some(x=>x.errors.length)?'FAIL':'PASS';
writeFileSync('qa-reports/fr-don-pepe-ciudad-jardin-24.json',JSON.stringify({status,results},null,2)+'\n');
console.log('FR DON PEPE CIUDAD JARDIN '+JSON.stringify({status,results}));
if(status==='FAIL')process.exitCode=1;
