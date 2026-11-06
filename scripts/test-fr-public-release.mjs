import {chromium,devices} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const profiles=[{name:'desktop',config:{viewport:{width:1365,height:900}}},{name:'mobile',config:devices['iPhone 13']}];
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];let failed=false;mkdirSync('qa-reports',{recursive:true});
for(const profile of profiles){
 const context=await browser.newContext(profile.config),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push('JavaScript: '+e.message));
 try{
  await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length>0);
  const option=page.locator('#language-select option[value="fr"]');
  if(await option.count()!==1)errors.push('French not available on public URL');
  else if(/QA/.test(await option.textContent()))errors.push('French still marked QA');
  await page.locator('#language-select').selectOption('fr');
  await page.waitForFunction(()=>document.documentElement.lang==='fr');
  await page.waitForFunction(()=>state.places.find(p=>p.id==='la-montillana')?.menuSections?.[0]?.items?.[0]?.fr,null,{timeout:45000});
  const first=await page.evaluate(()=>({lang:document.documentElement.lang,
   desc:state.places.find(p=>p.id==='la-montillana')?.menuSections?.[0]?.items?.[0]?.fr,
   hidden:!state.places.some(p=>p.id==='el-caballo-rojo'),
   saved:localStorage.getItem('helio-gastro-language-v1')}));
  if(!first.desc||!first.desc.includes('Salmorejo'))errors.push('French overlay absent on public URL');
  if(!first.hidden)errors.push('Caballo Rojo visible');
  if(first.saved!=='fr')errors.push('French preference not persisted');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length>0);
  const after=await page.evaluate(()=>({lang:document.documentElement.lang,selected:document.querySelector('#language-select')?.value,hidden:!state.places.some(p=>p.id==='el-caballo-rojo')}));
  if(after.lang!=='fr'||after.selected!=='fr')errors.push('French preference not restored');
  if(!after.hidden)errors.push('Caballo Rojo visible after reload');
  await page.locator('#language-select').selectOption('en');
  if(await page.evaluate(()=>document.documentElement.lang)!=='en')errors.push('EN switch failed');
  await page.locator('#language-select').selectOption('es');
  if(await page.evaluate(()=>document.documentElement.lang)!=='es')errors.push('ES switch failed');
 }catch(e){errors.push('Interrupted: '+e.message);}
 results.push({profile:profile.name,status:errors.length?'FAIL':'PASS',errors});
 if(errors.length)failed=true;
 await context.close();
}
await browser.close();
const report={suite:'HG QA public French release',status:failed?'FAIL':'PASS',results};
writeFileSync('qa-reports/fr-public-release.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(failed)process.exitCode=1;
