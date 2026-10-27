import { chromium, devices } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const profiles=[{name:'desktop',config:{viewport:{width:1365,height:900}}},{name:'mobile',config:devices['iPhone 13']}];
const modes=[{name:'public',query:''},{name:'qa-fr',query:'?qa_fr=1'}];
mkdirSync('qa-reports',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];
let failed=false;
for(const profile of profiles)for(const mode of modes){
 const context=await browser.newContext(profile.config),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push('JS: '+e.message));
 const submit=()=>page.locator('#filters').evaluate(f=>f.requestSubmit());
 try{
  await page.goto('http://127.0.0.1:8765/index.html'+mode.query,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length>0);
  await page.locator('#language-select').selectOption('es');
  await page.locator('[data-service="comida"]').click();
  await page.locator('#clear-search').click();
  await page.locator('#dish').fill('Flamenquín');
  await page.locator('#portion').selectOption('media');
  await page.locator('#budget').selectOption('10');
  await page.locator('#include-unknown').uncheck();
  await submit();
  let snapshot=await page.evaluate(()=>({
    candidates:state.places.filter(p=>serviceMenus(p).length&&serviceDishes(p).some(d=>clean(d).includes('flamenquin'))).length,
    records:state.filtered.map(p=>({id:p.id,prices:relevantPrices(p,'flamenquin','media').map(x=>x.eur)}))
  }));
  if(snapshot.records.some(p=>!p.prices.length||Math.min(...p.prices)>10))errors.push('Budget/portion returned an unknown or over-limit price');
  await page.locator('#include-unknown').check();await submit();
  const permissive=await page.evaluate(()=>state.filtered.map(p=>p.id));
  if(permissive.length<snapshot.records.length)errors.push('Including unknown prices removed restaurants');
  await page.locator('#price-kind').selectOption('confirmed');await submit();
  const documented=await page.evaluate(()=>state.filtered.map(p=>({id:p.id,prices:relevantPrices(p,'flamenquin','media').length})));
  if(documented.some(p=>!p.prices))errors.push('Documented-only filter admits an unpriced format');
  await page.locator('#price-kind').selectOption('');
  await page.locator('#budget').selectOption('');
  await page.locator('#portion').selectOption('racion');await submit();
  const full=await page.evaluate(()=>state.filtered.map(p=>({id:p.id,prices:relevantPrices(p,'flamenquin','racion').map(x=>x.eur)})));
  await page.locator('#price-scope').selectOption('meal');
  if(!(await page.locator('#portion').isDisabled()))errors.push('Meal scope did not disable portion filter');
  await page.locator('#budget').selectOption('20');
  await page.locator('#include-unknown').uncheck();await submit();
  const meals=await page.evaluate(()=>state.filtered.map(p=>({id:p.id,mealCostEur:p.mealCostEur})));
  if(meals.some(p=>p.mealCostEur===null||p.mealCostEur>20))errors.push('Meal filter used dish price or unknown meal total');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))errors.push('Horizontal overflow');
  results.push({profile:profile.name,mode:mode.name,status:errors.length?'FAIL':'PASS',budgetMatched:snapshot.records.length,includeUnknown:permissive.length,documentedOnly:documented.length,fullPortionResults:full.length,mealResults:meals.length,errors});
 }catch(e){errors.push('Interrupted: '+e.message);results.push({profile:profile.name,mode:mode.name,status:'FAIL',errors})}
 if(errors.length)failed=true;
 await context.close();
}
await browser.close();
const report={suite:'HG-QA-033 price and portion filters',status:failed?'FAIL':'PASS',results};
writeFileSync('qa-reports/filter-regression.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(failed)process.exitCode=1;
