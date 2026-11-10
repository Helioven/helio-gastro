import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
try {
  for (const [width, height] of [[1365, 900], [768, 1024], [360, 800]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    // Verify the real dialog and its URL without depending on a third-party iframe response.
    await page.route('https://maps.google.com/**', route => route.fulfill({ contentType: 'text/html', body: '<title>Map QA</title>' }));
    await page.goto('http://127.0.0.1:8765/');
    await page.waitForFunction(() => state.places.length === 43);
    const panorama = page.locator('.radar-panorama');
    assert.ok(await panorama.evaluate(async image => { await image.decode(); return image.naturalWidth > 0; }));
    const nav = page.locator('.radar-nav');
    assert.equal(await nav.locator('a').count(), 5);
    for (const [language, home, cta, guide] of [
      ['en', 'Home', 'Explore flavours', 'Guide'],
      ['fr', 'Accueil', 'Explorer les saveurs', 'Guide'],
      ['es', 'Inicio', 'Explorar sabores', 'Guía']
    ]) {
      await page.locator('#language-select').selectOption(language);
      assert.match(await page.title(), /^PlatoRadar/);
      assert.equal(await nav.getByRole('link', { name: home, exact: true }).count(), 1);
      assert.equal(await nav.getByRole('link', { name: guide, exact: true }).count(), 1);
      assert.equal(await page.locator('.radar-hero').getByRole('link', { name: cta, exact: true }).count(), 1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
    }

    for (const target of ['#search-section', '#favorite-section', '#guide-section', '#inicio']) {
      await nav.locator('a[href="' + target + '"]').press('Enter');
      assert.equal(new URL(page.url()).hash, target);
      assert.equal(await page.locator(target).isVisible(), true);
    }
    await page.locator('.radar-hero .radar-cta').click();
    assert.equal(new URL(page.url()).hash, '#search-section');

    const shortcuts = page.locator('.radar-shortcuts');
    assert.equal(await shortcuts.locator('a,button').count(), 6);
    for (const mode of ['desayuno', 'comida', 'cena']) {
      await shortcuts.locator('[data-radar-service="' + mode + '"]').click();
      assert.equal(await page.evaluate(() => state.mode), mode);
      assert.equal(await page.evaluate(() => document.activeElement.id), 'dish');
    }
    await shortcuts.locator('a[href="#recommendations-section"]').click();
    assert.equal(new URL(page.url()).hash, '#recommendations-section');

    for (const entry of [nav, shortcuts]) {
      await entry.locator('[data-radar-compare]').click();
      assert.equal(await page.locator('#compare-section').isVisible(), true);
      assert.equal(await page.evaluate(() => document.activeElement.id), 'compare-title');
    }
    await shortcuts.locator('#radar-map').click();
    assert.equal(await page.locator('#radar-map-note').isVisible(), true);
    const map = page.locator('#results .map-button').first();
    await map.click();
    assert.equal(await page.locator('#map-dialog').isVisible(), true);
    assert.match(await page.locator('#open-external-map').getAttribute('href'), /^https:\/\/www\.google\.com\/maps\/search/);
    await page.locator('#close-map').click();

    const orientation = page.locator('#manolo-orientation');
    if (await orientation.evaluate(el => el.open)) await orientation.locator('summary').click();
    await page.locator('#radar-orient').press('Enter');
    assert.equal(await orientation.evaluate(el => el.open), true);
    assert.equal(await orientation.locator('summary').evaluate(el => el === document.activeElement), true);
    assert.deepEqual(errors, []);
    console.log(width + ' PASS · navigation, six shortcuts, map, orientation and ES/EN/FR');
    await page.close();
  }
} finally {
  await browser.close();
}
