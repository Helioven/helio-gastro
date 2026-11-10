import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
try {
 for (const viewport of [{ width: 360, height: 800 }, { width: 1365, height: 900 }]) {
  const page = await browser.newPage({ viewport });
  await page.goto('http://127.0.0.1:8765/');
  await page.waitForFunction(() => state.places.length === 43);
  const formats = await page.evaluate(() => {
   const place = state.places.find(p => p.id === 'la-montillana');
   return place.dishPrices.filter(item => item.dish === 'Salmorejo cordobés')
    .map(item => [item.eur, portionOf(item)]);
  });
  assert.deepEqual(formats, [[6.9, 'media'], [9.9, 'racion']]);
  assert.deepEqual(await page.evaluate(() => ['Ración', '1/2 ración', 'Unidad', 'Tapa', 'precio único', 'Formato no indicado']
   .map(portion => portionOf({ dish: 'Ejemplo', portion }))), ['racion', 'media', 'unidad', 'tapa', 'desconocida', 'desconocida']);
  assert.equal(await page.evaluate(() => portionOf({ dish: 'Ración de rodaballo', portion: 'precio único' })), 'racion');
  await page.locator('.recommendation-tile').filter({ hasText: /salmorejo/i }).first().click();
  const venue = page.locator('.recommendation-place').filter({ hasText: 'La Montillana' });
  assert.deepEqual(await venue.locator('.portion-tag').allTextContents(), ['Media ración', 'Ración completa']);
  await page.locator('#close-recommendations').click();
  await page.locator('#place-name').fill('La Montillana');
  await page.locator('#dish').fill('Salmorejo');
  await page.locator('#advanced-filters > summary').click();
  await page.locator('#portion').selectOption('media');
  await page.locator('#price-kind').selectOption('confirmed');
  await page.locator('#search-button').click();
  const result = page.locator('#results article');
  assert.equal(await result.count(), 1);
  assert.match(await result.innerText(), /La Montillana/);
  assert.match(await result.locator('.result-main-price').textContent(), /6,90.*Media ración/);
  await page.close();
  console.log(viewport.width + ' PASS · documented portions and price filter');
 }
} finally {
 await browser.close();
}
