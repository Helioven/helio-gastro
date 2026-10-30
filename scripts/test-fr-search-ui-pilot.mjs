import assert from 'node:assert/strict';
import {chromium,devices} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
for(const profile of [{name:'desktop',options:{viewport:{width:1280,height:800}}},{name:'mobile',options:devices['iPhone 13']}]){
 const context=await browser.newContext(profile.options);const page=await context.newPage();
 await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1',{waitUntil:'domcontentloaded'});
 const heading=page.locator('#search-title');const button=page.locator('#search-button');
 await page.locator('#language-select').selectOption('fr');
 await page.waitForFunction(()=>document.querySelector('#search-title')?.textContent==='Une petite envie ?');
 assert.equal(await button.textContent(),'Rechercher des établissements →');
 assert.equal(await page.locator('[data-dish="Flamenquín"]').textContent(),'Flamenquín');
 await page.locator('#language-select').selectOption('es');
 assert.equal(await heading.textContent(),'¿Qué te apetece?');
 assert.equal(await button.textContent(),'Buscar establecimientos →');
 await page.locator('#language-select').selectOption('en');
 assert.equal(await button.textContent(),'Find places →');
 await context.close();console.log('FR SEARCH PILOT '+profile.name+' PASS');
}
await browser.close();
