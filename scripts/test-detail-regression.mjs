import { chromium, devices } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const profiles = [{name:'desktop',config:{viewport:{width:1365,height:900}}},{name:'mobile',config:devices['iPhone 13']}];
const modes = [{name:'public',query:''},{name:'qa-fr',query:'?qa_fr=1'}];
const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
const results = [];
let failed = false;
mkdirSync('qa-reports',{recursive:true});
for (const profile of profiles) for (const mode of modes) {
  const context = await browser.newContext(profile.config), page = await context.newPage();
  const errors = [];
  page.on('pageerror',e=>errors.push('JavaScript: '+e.message));
  try {
    await page.goto('http://127.0.0.1:8765/index.html'+mode.query,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.length>0);
    await page.locator('#language-select').selectOption('es');
    await page.locator('[data-service="comida"]').click();
    await page.locator('#clear-search').click();
    await page.locator('#place-name').fill('La Montillana');
    await page.locator('#filters').evaluate(form=>form.requestSubmit());
    await page.waitForFunction(()=>state.filtered.some(p=>p.id==='la-montillana'));
    await page.locator('#results article.place').filter({hasText:'La Montillana'}).getByRole('button',{name:'Ver ficha completa'}).first().click();
    if(await page.locator('#detail-section').isHidden())errors.push('Detail did not open');
    const detail=await page.evaluate(()=>{
      const p=state.places.find(x=>x.id==='la-montillana');
      return {title:document.querySelector('#detail-title')?.textContent,address:document.querySelector('#detail-content')?.textContent?.includes(p.address),sourceLinks:[...document.querySelectorAll('#detail-content a.detail-source')].map(a=>({url:a.href,rel:a.rel})),checkedAt:p.checkedAt,visiblePrices:document.querySelectorAll('#detail-content .menu-price-row').length};
    });
    if(!detail.title?.includes('Montillana')||!detail.address)errors.push('Detail title/address mismatch');
    if(!detail.sourceLinks.length)errors.push('No source links in Montillana detail');
    if(detail.sourceLinks.some(a=>!a.url.startsWith('https://')||!a.rel.includes('noopener')||!a.rel.includes('noreferrer')))errors.push('Unsafe detail source link');
    if(!detail.checkedAt)errors.push('Missing documentary checkedAt field');
    const before=await page.evaluate(()=>state.places.find(x=>x.id==='la-montillana').dishPrices.map(p=>[p.dish,p.eur,p.portion]));
    await page.locator('#language-select').selectOption('en');
    const afterEn=await page.evaluate(()=>state.places.find(x=>x.id==='la-montillana').dishPrices.map(p=>[p.dish,p.eur,p.portion]));
    if(JSON.stringify(before)!==JSON.stringify(afterEn))errors.push('EN switch altered price records');
    if(mode.name==='qa-fr'){
      await page.locator('#language-select').selectOption('fr');
      const afterFr=await page.evaluate(()=>state.places.find(x=>x.id==='la-montillana').dishPrices.map(p=>[p.dish,p.eur,p.portion]));
      if(JSON.stringify(before)!==JSON.stringify(afterFr))errors.push('FR QA switch altered price records');
      await page.locator('#language-select').selectOption('es');
    }else{
      await page.locator('#language-select').selectOption('es');
    }
    await page.locator('#close-detail').click();
    if(!(await page.locator('#detail-section').isHidden()))errors.push('Detail did not close');
    await page.locator('#place-name').fill('La Taberna del Río');
    await page.locator('#filters').evaluate(form=>form.requestSubmit());
    const venue=page.locator('#results article.place').filter({hasText:'La Taberna del Río'}).first();
    if(await venue.count()){
      await venue.getByRole('button',{name:'Ver ficha completa'}).click();
      const group=await page.evaluate(()=>{
        const p=state.places.find(p=>p.name.includes('Taberna del Río'));
        return {menuCount:p?.groupMenus?.length||0,minPeople:p?.groupMenus?.map(m=>m.minPeople)||[],text:document.querySelector('#detail-content')?.textContent||''};
      });
      if(group.menuCount&&group.minPeople.some(n=>n>1)&&!/mínimo\s+\d+/.test(group.text))errors.push('Group minimum diners not displayed');
    }else errors.push('Taberna del Río not found via name search');
    if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))errors.push('Horizontal overflow');
    results.push({profile:profile.name,mode:mode.name,status:errors.length?'FAIL':'PASS',detail,errors});
  }catch(e){errors.push('Interrupted: '+e.message);results.push({profile:profile.name,mode:mode.name,status:'FAIL',errors});}
  if(errors.length)failed=true;
  await context.close();
}
await browser.close();
const report={suite:'HG-QA-035 detail views and sources',status:failed?'FAIL':'PASS',results};
writeFileSync('qa-reports/detail-regression.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(failed)process.exitCode=1;
