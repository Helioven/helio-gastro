import assert from 'node:assert/strict';
import {chromium,devices} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
for(const profile of [{name:'desktop',options:{viewport:{width:1280,height:800}}},{name:'mobile',options:devices['iPhone 13']}]){
 const ctx=await browser.newContext(profile.options),page=await ctx.newPage();
 await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1',{waitUntil:'domcontentloaded'});
 await page.locator('#language-select').selectOption('fr');
 assert.equal(await page.locator('#price-kind option[value="confirmed"]').textContent(),'Prix documentés uniquement');
 assert.equal(await page.locator('#price-kind option[value="estimated"]').textContent(),'Prix documentés ou estimés');
 assert.equal(await page.locator('#portion option[value="media"]').textContent(),'Demi-portion');
 assert.equal(await page.locator('#budget-explain').textContent(),'Plafond appliqué au prix d’un plat, et non à celui d’un repas complet.');
 assert.equal(await page.locator('[data-dish="Flamenquín"]').textContent(),'Flamenquín');
 await page.locator('#language-select').selectOption('es');
 assert.equal(await page.locator('#price-kind option[value="confirmed"]').textContent(),'Solo precios documentados');
 assert.equal(await page.locator('#budget-explain').textContent(),'Límite aplicado al precio de un plato, no a una comida completa.');
 await page.locator('#language-select').selectOption('en');
 assert.equal(await page.locator('#price-kind option[value="confirmed"]').textContent(),'Documented prices only');
 await ctx.close();console.log('FR FILTER PILOT '+profile.name+' PASS');
}
await browser.close();
