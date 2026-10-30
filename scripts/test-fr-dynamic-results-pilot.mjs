import assert from 'node:assert/strict';
import {chromium,devices} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
for(const profile of [{name:'desktop',options:{viewport:{width:1280,height:800}}},{name:'mobile',options:devices['iPhone 13']}]){
 const ctx=await browser.newContext(profile.options),page=await ctx.newPage();
 await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1',{waitUntil:'domcontentloaded'});
 await page.locator('#language-select').selectOption('fr');
 await page.locator('#search-button').click();
 await page.waitForSelector('#results .detail-button');
 assert.equal(await page.locator('#results .detail-button').first().textContent(),'Voir la fiche complète');
 assert.equal(await page.locator('#results button').filter({hasText:'+ Comparer'}).count()>0,true);
 await page.locator('#language-select').selectOption('es');
 assert.equal(await page.locator('#results .detail-button').first().textContent(),'Ver ficha completa');
 await page.locator('#language-select').selectOption('en');
 assert.equal(await page.locator('#results .detail-button').first().textContent(),'View full details');
 await ctx.close();console.log('FR DYNAMIC RESULTS '+profile.name+' PASS');
}
await browser.close();
