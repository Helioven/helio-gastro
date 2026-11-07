import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {join} from 'node:path';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try{
for(const [name,width,height] of [['movil',360,800],['escritorio',1365,900]]){
 const page=await browser.newPage({viewport:{width,height}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(new URL('./index.html',import.meta.url).href);
 await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').getAttribute('id'),'language');
 for(const [lang,warning,empty] of [['es','DATOS FICTICIOS','Datos insuficientes'],['en','FICTIONAL DATA','Insufficient data'],['fr','DONNÉES FICTIVES','Données insuffisantes']]){
  if(lang!=='es')await page.keyboard.press('ArrowDown');
  assert.equal(await page.locator('html').getAttribute('lang'),lang);
  assert((await page.locator('#warning').textContent()).startsWith(warning));
  const cards=page.locator('article');assert.equal(await cards.count(),3);
  assert.deepEqual(await cards.evaluateAll(nodes=>nodes.map(n=>n.querySelector('h2').id)),['fixture-faro-de-menta','fixture-brujula-de-nuez','fixture-tetera-orbital']);
  assert.equal(await page.locator('.advice').count(),2);
  assert.equal(await cards.nth(2).locator('.state').textContent(),empty);
  assert.equal(await cards.nth(2).locator('.meta p').count(),1);
  assert.equal(await page.locator('.meta').evaluateAll(nodes=>nodes.map(n=>Number(n.querySelector('p').textContent.split(' · ').at(-1))).join(',')),'4,4,0');
  assert.equal(await page.evaluate(()=>FIXTURES.every(x=>x.opinions.length===x.analyzedCount)),true);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.locator('#manolo-chef').evaluate(n=>n.decode());
  assert.equal(await page.locator('#manolo-chef').evaluate(n=>n.naturalWidth===384 && n.naturalHeight===384 && Math.abs(n.clientWidth-n.clientHeight)<2 && getComputedStyle(n).objectFit==='contain'),true);
  assert.equal(await page.locator('#manolo-chef').getAttribute('alt'),await page.evaluate(lang=>chefAlt[lang],lang));
  if(process.argv[2]) await page.screenshot({path:join(process.argv[2],'chef-oficial-'+name+'-'+lang+'.png'),fullPage:true});
 }
 assert.deepEqual(errors,[]);console.log(name+' ES/EN/FR PASS');await page.close();
}
}finally{await browser.close()}
