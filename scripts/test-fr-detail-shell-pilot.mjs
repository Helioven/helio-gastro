import assert from 'node:assert/strict';
import {chromium,devices} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
for(const profile of [{name:'desktop',options:{viewport:{width:1280,height:800}}},{name:'mobile',options:devices['iPhone 13']}]){
 const ctx=await browser.newContext(profile.options),page=await ctx.newPage();
 await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.some(p=>p.id==='la-montillana'));
 await page.locator('#language-select').selectOption('fr');
 await page.evaluate(()=>showPlace(state.places.find(p=>p.id==='la-montillana'),false));
 await page.waitForFunction(()=>[...document.querySelectorAll('#detail-content h3')].some(x=>x.textContent==='Sources et date'));
 assert.ok((await page.locator('#detail-content h3').allTextContents()).includes('Sources et date'));
 assert.equal(await page.locator('#detail-content .fav-button').textContent(),'☆ Enregistrer','FR detail save button');
 assert.ok((await page.locator('#detail-content .map-button').allTextContents()).includes('📍 Voir la carte'),'FR detail map button');
 const titles=await page.locator('#detail-content .menu-dish h4').allTextContents();
 assert.ok(titles.length>0);
 await page.evaluate(()=>{const place=state.places.find(p=>Array.isArray(p.locations)&&p.locations.length);if(!place)throw Error('Roldan directory missing');showPlace(place,false);});
 assert.ok((await page.locator('#detail-content').innerText()).includes('📍 Établissements Roldán à Cordoue'),'FR Roldan heading');
 assert.ok((await page.locator('#detail-content').innerText()).includes('Les boulangeries figurent uniquement comme adresses'),'FR Roldan menu scope');
 await page.evaluate(()=>showPlace(state.places.find(p=>p.id==='la-montillana'),false));
 await page.locator('#language-select').selectOption('es');
 assert.ok((await page.locator('#detail-content h3').allTextContents()).includes('Fuentes y fecha'));
 assert.deepEqual(await page.locator('#detail-content .menu-dish h4').allTextContents(),titles);
 await page.locator('#language-select').selectOption('en');
 assert.ok((await page.locator('#detail-content h3').allTextContents()).includes('Sources and date'));
 assert.deepEqual(await page.locator('#detail-content .menu-dish h4').allTextContents(),titles);
 await ctx.close();console.log('FR DETAIL SHELL '+profile.name+' PASS');
}
await browser.close();
