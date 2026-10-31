import assert from 'node:assert/strict';
import { chromium, devices } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const profiles = [
  { name: 'desktop', options: { viewport: { width: 1280, height: 800 } } },
  { name: 'mobile', options: devices['iPhone 13'] }
];
const beer = 'Boissons comprises : bière, vin de Montilla-Moriles, vin rouge de Rioja, eau minérale et cava des Bodegas Faustino';
const water = 'Boissons comprises : eau minérale et deux boissons sans alcool';
const roldanFr = 'Prix publiés dans la carte générale de Roldán. Ils peuvent varier ; la disponibilité des produits dépend de chaque établissement. Roldán Centro dispose de sa propre carte et de sa propre fiche.';
const roldanEs = 'Precios publicados en la carta general de Roldán. Pueden variar; la disponibilidad de productos depende de cada local. Roldán Centro tiene carta y ficha propias.';

try {
  for (const profile of profiles) {
    const context = await browser.newContext(profile.options);
    const page = await context.newPage();
    try {
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => typeof state !== 'undefined' && state.places.some(p => p.id === 'rincon-beatillas'));
      await page.locator('#language-select').selectOption('fr');
      await page.evaluate(() => showPlace(state.places.find(p => p.id === 'rincon-beatillas'), false));
      const beverages = page.locator('#detail-content [data-group-menu-label-es]');
      await assert.doesNotReject(async () => beverages.first().waitFor(), 'Beatillas beverage labels missing');
      const fr = await beverages.allTextContents();
      assert.ok(fr.filter(s => s.trim() === beer).length >= 1, 'Beatillas beer/wine translation absent');
      assert.ok(fr.some(s => s.trim() === water), 'Beatillas water/soft drinks translation absent');
      await page.locator('#language-select').selectOption('es');
      const es = await beverages.allTextContents();
      assert.ok(es.some(s => s.includes('Bebidas incluidas:')), 'Beatillas Spanish beverage labels missing');
      await page.locator('#language-select').selectOption('en');
      const en = await beverages.allTextContents();
      assert.ok(en.some(s => s.includes('Drinks included:')), 'Beatillas English beverage labels missing');
      await page.locator('#language-select').selectOption('fr');
      assert.deepEqual(await beverages.allTextContents(), fr, 'Beatillas French text changed after language roundtrip');

      const roldan = await page.evaluate(() => state.places.find(p => p.name?.includes('Pastelerías Roldán') && p.menuPriceNotice?.startsWith('Precios publicados en la carta general de Roldán.'))?.id);
      assert.ok(roldan, 'Roldán other cafeterias record missing');
      await page.evaluate(id => showPlace(state.places.find(p => p.id === id), false), roldan);
      const addressEs='📍 Varias ubicaciones en Córdoba (consulta los establecimientos de abajo)';
      const addressFr='📍 Plusieurs adresses à Cordoue (voir les établissements ci-dessous)';
      const addressText=()=>page.locator('#detail-content').innerText();
      await page.waitForFunction(expected=>document.querySelector('#detail-content')?.innerText.includes(expected),addressFr);
      assert.ok((await addressText()).includes(addressFr),'Roldán multiple addresses note not translated to French');
      const notice = page.locator('#detail-content [data-bilingual-es]');
      await page.waitForFunction(expected => [...document.querySelectorAll('#detail-content [data-bilingual-es]')].some(n => n.textContent.trim() === expected), roldanFr);
      assert.ok((await notice.allTextContents()).some(s => s.trim() === roldanFr), 'Roldán French notice absent');
      await page.locator('#language-select').selectOption('es');
      assert.ok((await addressText()).includes(addressEs),'Roldán Spanish locations note not restored');
      assert.ok((await notice.allTextContents()).some(s => s.trim() === roldanEs), 'Roldán Spanish notice altered');
      await page.locator('#language-select').selectOption('en');
      assert.ok((await notice.allTextContents()).some(s => s.trim() && s.trim() !== roldanFr && s.trim() !== roldanEs), 'Roldán English notice absent');
      await page.locator('#language-select').selectOption('fr');
      assert.ok((await addressText()).includes(addressFr),'Roldán French locations note not restored');
      assert.ok((await notice.allTextContents()).some(s => s.trim() === roldanFr), 'Roldán French notice not restored');
      assert.equal(errors.length, 0, 'JavaScript errors: ' + errors.join('; '));
      console.log('FR BEATILLAS / ROLDAN ' + profile.name + ' PASS');
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
