import assert from 'node:assert/strict';
import {chromium,devices} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
for(const profile of [{name:'desktop',options:{viewport:{width:1280,height:800}}},{name:'mobile',options:devices['iPhone 13']}]){
 const context=await browser.newContext(profile.options);const page=await context.newPage();
 await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1',{waitUntil:'domcontentloaded'});
 const heading=page.locator('#search-title');const button=page.locator('#search-button');
 await page.locator('#language-select').selectOption('fr');
 const nav=page.locator('#quick-nav');
 assert.ok((await nav.innerText()).includes('🔎 Rechercher'),'French quick navigation search absent');
 assert.ok((await nav.innerText()).includes('★ Favoris'),'French quick navigation favorites absent');
 const favoriteNotice=page.locator('#favorite-notice');
 const favoriteEs='Guardadas solo en este navegador. Puedes consultarlas sin volver a buscar.';
 const favoriteFr='Enregistrées uniquement dans ce navigateur. Vous pouvez les consulter sans effectuer une nouvelle recherche.';
 await page.waitForFunction(expected=>document.querySelector('#favorite-notice')?.textContent===expected,favoriteFr);
 assert.equal(await favoriteNotice.textContent(),favoriteFr);

 await page.waitForFunction(()=>document.querySelector('#search-title')?.textContent==='Une petite envie ?');
 assert.equal(await button.textContent(),'Rechercher des établissements →');
 assert.equal(await page.locator('[data-dish="Flamenquín"]').textContent(),'Flamenquín');
 await page.locator('#language-select').selectOption('es');
 assert.equal(await favoriteNotice.textContent(),favoriteEs);
 assert.ok((await nav.innerText()).includes('🔎 Buscar'),'Spanish quick navigation not restored');
 assert.equal(await heading.textContent(),'¿Qué te apetece?');
 assert.equal(await button.textContent(),'Buscar establecimientos →');
 await page.locator('#language-select').selectOption('en');
 assert.equal(await favoriteNotice.textContent(),'Saved only in this browser. You can view them without searching again.');
 assert.ok((await nav.innerText()).includes('🔎 Search'),'English quick navigation absent');
 assert.equal(await button.textContent(),'Find places →');
 await page.locator('#language-select').selectOption('fr');
 assert.equal(await favoriteNotice.textContent(),favoriteFr);
 assert.ok((await nav.innerText()).includes('🔎 Rechercher'),'French quick navigation not restored');
 await context.close();console.log('FR SEARCH PILOT '+profile.name+' PASS');
}
await browser.close();
