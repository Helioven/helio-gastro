import assert from 'node:assert/strict';
import { join } from 'node:path';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const base = 'http://127.0.0.1:8765/index.html';
const labels = {
  es: ['Córdoba se descubre a bocados.', 'Pizzas', 'Hamburguesas', 'Tartas de queso', 'El asterisco'],
  en: ['Discover Córdoba one bite at a time.', 'Pizzas', 'Burgers', 'Cheesecakes', 'An asterisk'],
  fr: ['Découvrez Cordoue une bouchée à la fois.', 'Pizzas', 'Burgers', 'Gâteaux au fromage', 'Un astérisque']
};
const categoryPatterns = [
  /^pizzas?\b/i, /^(?:mini\s*)?hamburguesas?\b/i, /^tartas? de queso\b/i
];
try {
  for (const [profile, width, height] of [['mobile', 360, 800], ['desktop', 1365, 900]]) {
    for (const [language, [hero, ...copy]] of Object.entries(labels)) {
      const page = await browser.newPage({ viewport: { width, height } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base);
      await page.waitForFunction(() => state.places.length > 30);
      await page.locator('#language-select').selectOption(language);
      await page.waitForFunction(lang => document.documentElement.lang === lang, language);
      await page.getByRole('heading', { name: hero, exact: true }).waitFor();
      const categories = page.locator('#quick-categories button');
      assert.deepEqual(await categories.allTextContents(), copy.slice(0, 3));
      const shot = async (view, selector) => {
        if (language !== 'es' || !process.argv[2]) return;
        if (selector) await page.locator(selector).evaluate(node => node.scrollIntoView({ block: 'start' }));
        await page.screenshot({ path: join(process.argv[2], profile + '-' + view + '.png') });
      };
      const checkWidth = async () => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await checkWidth();
      await shot('portada');
      for (const [index, regex] of categoryPatterns.entries()) {
        const expected = await page.evaluate(source => {
          const pattern = new RegExp(source, 'i');
          return state.places.filter(place => serviceMenus(place).some(menu => [
            ...menu.dishes, ...menu.dishPrices.map(row => row.dish)
          ].some(name => pattern.test(name.trim())))).map(place => place.id).sort();
        }, regex.source);
        assert.ok(expected.length > 0);
        await categories.nth(index).click();
        assert.deepEqual(await page.evaluate(() => state.filtered.map(place => place.id).sort()), expected);
        assert.equal(await page.evaluate(() => document.activeElement.id), 'results-heading');
        await checkWidth();
        if (index === 0) await shot('resultados', '#results-section');
      }
      await page.reload();
      await page.waitForFunction(() => state.searched);
      assert.equal(await page.locator('#direct-dish').inputValue(), 'Tarta de queso');
      await categories.first().click();
      await page.locator('#place-name').fill('Patio Romano');
      await page.locator('#search-button').click();
      const result = page.locator('#results article');
      assert.equal(await result.count(), 1);
      const resultNote = page.locator('#result-format-note');
      assert.ok((await resultNote.textContent()).startsWith(copy[3]));
      assert.ok(await result.locator('[aria-describedby="result-format-note"] .format-marker').count());
      await result.locator('button[aria-pressed]').first().click();
      assert.ok(await page.locator('#compare-format-note').count());
      assert.equal(await page.locator('#compare-output .best-comparable').count(), 0);
      const guarded = await page.evaluate(() => comparableHighlights([
        { id: 'x', dishPrices: [{ dish: 'Pizza', eur: 10 }] },
        { id: 'y', dishPrices: [{ dish: 'Pizza', eur: 11 }] }
      ], 'pizza', 'desconocida').size);
      assert.equal(guarded, 0);
      await result.locator('button.detail-button').first().click();
      assert.equal(await page.locator('#venue-section-index').count(), 0);
      assert.equal(await page.locator('#detail-format-note').count(), 1);
      await page.locator('#close-detail').click();
      assert.equal(await page.evaluate(() => document.activeElement.id), 'results-heading');
      await page.locator('#place-name').fill('La Manuela');
      await page.locator('#advanced-filters > summary').click();
      await page.locator('#portion').selectOption('');
      await page.locator('#search-button').click();
      await result.locator('button.detail-button').first().click();
      const index = page.locator('#venue-section-index');
      assert.equal(await index.locator('button').count(), 9);
      await checkWidth();
      await shot('ficha', '#detail-section');
      await index.locator('button').nth(6).press('Enter');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'venue-section-taberna-la-manuela-6');
      await page.locator('.menu-index-return').nth(6).press('Enter');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'venue-section-index');
      await page.locator('.venue-sources-jump').press('Enter');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'venue-sources');
      assert.ok(await page.locator('#quick-nav').evaluate(nav => nav.scrollWidth <= nav.clientWidth));
      assert.deepEqual(errors, []);
      await page.close();
      console.log(profile + ' ' + language + ' PASS');
    }
  }
} finally {
  await browser.close();
}
