import assert from 'node:assert/strict';
import {chromium,devices} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
for(const profile of [{name:'desktop',options:{viewport:{width:1280,height:800}}},{name:'mobile',options:devices['iPhone 13']}]){
 const ctx=await browser.newContext(profile.options),page=await ctx.newPage();
 await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1',{waitUntil:'domcontentloaded'});
 await page.locator('#language-select').selectOption('fr');
 assert.equal(await page.locator('#results-heading').textContent(),'Résultats');
 assert.equal(await page.locator('#compare-title').textContent(),'Comparateur');
 assert.equal(await page.locator('#close-detail').textContent(),'Fermer la fiche ×');
 assert.equal(await page.locator('#compare-output').textContent(),'Todavía no hay establecimientos seleccionados.');
 await page.locator('#language-select').selectOption('es');
 assert.equal(await page.locator('#results-heading').textContent(),'Resultados');
 assert.equal(await page.locator('#compare-title').textContent(),'Comparador');
 await page.locator('#language-select').selectOption('en');
 assert.equal(await page.locator('#results-heading').textContent(),'Results');
 await ctx.close();console.log('FR RESULTS PILOT '+profile.name+' PASS');
}
await browser.close();
