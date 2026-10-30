import assert from 'node:assert/strict';
import {chromium,devices} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
for(const profile of [{name:'desktop',options:{viewport:{width:1280,height:800}}},{name:'mobile',options:devices['iPhone 13']}]){
 const ctx=await browser.newContext(profile.options),page=await ctx.newPage();
 await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof state!=='undefined'&&state.places.some(p=>p.id==='la-montillana'));
 await page.locator('#language-select').selectOption('fr');
 await page.evaluate(()=>showPlace(state.places.find(p=>p.id==='la-montillana'),false));
 const detail=page.locator('#detail-content');
 await page.waitForFunction(()=>document.querySelector('#detail-content')?.textContent.includes('Dernière consultation :'));
 assert.ok((await detail.textContent()).includes('Le coût total d’un repas ici n’est pas documenté.'));
 const names=await page.locator('#detail-content .menu-dish h4').allTextContents();
 await page.locator('#language-select').selectOption('es');
 assert.ok((await detail.textContent()).includes('El coste total de comer aquí no está documentado.'));
 assert.ok((await detail.textContent()).includes('Última consulta: '));
 assert.deepEqual(await page.locator('#detail-content .menu-dish h4').allTextContents(),names);
 await page.locator('#language-select').selectOption('en');
 assert.deepEqual(await page.locator('#detail-content .menu-dish h4').allTextContents(),names);
 await ctx.close();console.log('FR DETAIL NOTICES '+profile.name+' PASS');
}
await browser.close();
