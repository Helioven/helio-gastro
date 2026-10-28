import {chromium,devices} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const profiles=[{name:'desktop',config:{viewport:{width:1365,height:900}}},{name:'mobile',config:devices['iPhone 13']}];
const modes=[{name:'public',query:''},{name:'qa-fr',query:'?qa_fr=1'}];
mkdirSync('qa-reports',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];let failed=false;
for(const profile of profiles)for(const mode of modes){
 const context=await browser.newContext(profile.config),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push('JavaScript: '+e.message));
 try{
  await page.goto('http://127.0.0.1:8765/index.html'+mode.query,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length>0);
  await page.locator('#language-select').selectOption('es');
  await page.locator('[data-service="comida"]').click();
  await page.locator('#clear-search').click();
  for(const target of ['recommendations-section','search-section','favorite-section']){
   const anchor=page.locator('#quick-nav a[href="#'+target+'"]');
   if(await anchor.count()!==1)errors.push('Navigation link missing: '+target);
   else {await anchor.click();if(await page.evaluate(()=>location.hash)!=='#'+target)errors.push('Wrong navigation hash: '+target);}
  }
  if(!(await page.locator('#nav-compare').isHidden()))errors.push('Compare navigation visible without search');
  await page.locator('#dish').fill('');
  await page.locator('#filters').evaluate(f=>f.requestSubmit());
  await page.waitForFunction(()=>state.filtered.length>=2);
  const buttons=page.locator('#results article.place button[aria-pressed]').filter({hasText:'Comparar'});
  await buttons.nth(0).click();
  await buttons.nth(1).click();
  if(await page.locator('#nav-compare').isHidden())errors.push('Compare navigation missing after selection');
  const label=await page.locator('#nav-compare-count').textContent();
  if(label?.trim()!=='2')errors.push('Compare nav count not 2: '+label);
  await page.locator('#nav-compare').click();
  if(await page.evaluate(()=>location.hash)!=='#compare-section')errors.push('Compare anchor does not navigate');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length>0);
  if(await page.locator('#nav-compare-count').textContent()!=='2')errors.push('Compare navigation not restored after reload');
  await page.locator('#clear-search').click();
  if(!(await page.locator('#nav-compare').isHidden()))errors.push('Compare navigation visible after clear');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))errors.push('Horizontal overflow');
  if(mode.name==='public'&&await page.locator('#language-select option[value="fr"]').count())errors.push('French exposed publicly');
  if(mode.name==='qa-fr'&&!(await page.locator('#language-select option[value="fr"]').count()))errors.push('French QA option missing');
 }catch(e){errors.push('Interrupted: '+e.message);}
 results.push({profile:profile.name,mode:mode.name,status:errors.length?'FAIL':'PASS',errors});
 if(errors.length)failed=true;
 await context.close();
}
await browser.close();
const report={suite:'HG-QA-036 navigation regression',status:failed?'FAIL':'PASS',results};
writeFileSync('qa-reports/navigation-regression.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(failed)process.exitCode=1;
