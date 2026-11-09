import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
try {
 for (const viewport of [{ width: 360, height: 800 }, { width: 1365, height: 900 }]) {
  const page = await browser.newPage({ viewport });
  await page.goto('http://127.0.0.1:8765/');
  await page.waitForFunction(() => state.places.length === 43);
  await page.locator('#direct-dish').fill('flamenquín');
  await page.locator('#direct-search .primary').click();
  const first = page.locator('#results article').first();
  for (const [lang, coverage, price, map, save] of [
   ['fr', /^Dans notre base : \d+ établissements/, /^À partir de.*Prix du plat publié/, 'Voir la carte', 'Enregistrer'],
   ['en', /^In our current database:/, /^From.*Published dish price/, 'View map', 'Save'],
   ['es', /^En nuestra base actual:/, /^Desde.*Precio de plato publicado/, 'Ver mapa', 'Guardar']
  ]) {
   await page.locator('#language-select').selectOption(lang);
   assert.match(await page.locator('#coverage-summary').textContent(), coverage);
   assert.match(await first.locator('.result-main-price').textContent(), price);
   assert.equal(await first.locator('.map-button').textContent(), map);
   assert.equal(await first.locator('.fav-button').textContent(), save);
  }
  await page.locator('.recommendation-tile').filter({ hasText: /salmorejo/i }).first().click();
  const dialog = page.locator('#recommendation-dialog');
  for (const [lang, title, close, notice, portions] of [
   ['fr', 'Options pour salmorejo', 'Fermer', /Ce n’est ni un classement/, ['Demi-portion', 'Portion entière']],
   ['en', 'Options for salmorejo', 'Close', /not a quality ranking/, ['Half portion', 'Full portion']],
   ['es', 'Opciones de salmorejo', 'Cerrar', /No es un ranking/, ['Media ración', 'Ración completa']]
  ]) {
   await page.evaluate(lang => window.HelioGastroLanguage.set(lang), lang);
   assert.equal(await dialog.locator('h2').textContent(), title);
   assert.equal(await dialog.locator('#close-recommendations').textContent(), close);
   assert.match(await dialog.innerText(), notice);
   const venue = dialog.locator('.recommendation-place').filter({ hasText: 'La Montillana' });
   assert.deepEqual(await venue.locator('.portion-tag').allTextContents(), portions);
   assert.match(await venue.innerText(), /Salmorejo cordobés/);
  }
  await page.close();
  console.log(viewport.width + ' PASS · rendered text and language restoration');
 }
} finally {
 await browser.close();
}
