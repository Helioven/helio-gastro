import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
try {
  for (const [width, height] of [[1365, 900], [360, 800]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    await page.goto('http://127.0.0.1:8765/');
    await page.waitForFunction(() => state.places.length === 43);
    const advanced = page.locator('#advanced-filters');
    const summary = advanced.locator('summary');
    const active = page.locator('#advanced-filter-status');
    const quick = page.locator('#quick-dishes');
    assert.equal(await quick.evaluate(el => el.open), width > 560);
    assert.equal(await advanced.evaluate(el => el.open), false);
    for (const id of ['place-name', 'dish', 'budget']) assert.equal(await page.locator('#' + id).isVisible(), true);
    assert.equal(await page.locator('#portion').isVisible(), false);
    assert.equal(await active.isVisible(), false);

    await summary.press('Enter');
    await page.locator('#portion').selectOption('media');
    await page.locator('#price-kind').selectOption('confirmed');
    await page.locator('#sort').selectOption('price');
    await page.locator('#budget').selectOption('10');
    await page.locator('#dish').fill('Salmorejo');
    await summary.press('Space');
    assert.equal(await advanced.evaluate(el => el.open), false);
    assert.equal(await active.isVisible(), true);
    await page.locator('#search-button').click();
    const places = await page.evaluate(() => state.filtered.map(place => place.id));
    assert.ok(places.includes('la-montillana'));
    await page.reload();
    await page.waitForFunction(() => state.searched && state.places.length === 43);
    assert.deepEqual(await page.evaluate(() => state.filtered.map(place => place.id)), places);
    assert.equal(await advanced.evaluate(el => el.open), false);
    assert.equal(await active.isVisible(), true);
    for (const [language, title, status] of [
      ['fr', 'Plus de filtres', 'Filtres actifs'],
      ['en', 'More filters', 'Active filters'],
      ['es', 'Más filtros', 'Filtros activos']
    ]) {
      await page.locator('#language-select').selectOption(language);
      assert.equal(await summary.locator('span').first().textContent(), title);
      assert.equal(await active.textContent(), status);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
    await summary.press('Enter');
    assert.equal(await page.locator('#portion').inputValue(), 'media');
    assert.equal(await page.locator('#price-kind').inputValue(), 'confirmed');
    assert.equal(await page.locator('#sort').inputValue(), 'price');
    await page.locator('#clear-search').click();
    assert.equal(await active.isVisible(), false);

    const guide = page.locator('.manolo-guide');
    if (!await guide.evaluate(el => el.open)) await guide.locator('summary').press('Enter');
    assert.equal(await guide.locator('summary').getAttribute('aria-expanded'), 'true');
    await summary.press('Enter');
    await guide.locator('[data-manolo-action="budget"]').press('Enter');
    assert.equal(await advanced.evaluate(el => el.open), true);
    assert.equal(await page.evaluate(() => document.activeElement.id), 'price-scope');
    assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('.quick-nav')).position),
      width === 360 ? 'static' : 'sticky');
    await page.close();
    console.log(width + ' PASS');
  }
} finally {
  await browser.close();
}
