import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
try {
  for (const [width, height] of [[1365, 900], [768, 1024], [360, 800], [320, 700]]) {
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
    const shortcuts = page.locator('.radar-shortcuts');
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
      assert.ok(await nav.locator('a span').evaluateAll(labels => labels.every(label => {
        const text = document.createRange();
        text.selectNodeContents(label);
        return text.getClientRects().length === 1;
      })), 'Navigation labels must fit on one line at ' + width + ' px in ' + language);
      assert.equal(await shortcuts.evaluate(grid => getComputedStyle(grid).gridTemplateColumns.split(' ').length), width > 1000 ? 6 : 3);
      const layout = await shortcuts.locator('a,button').evaluateAll(cards => cards.map(card => {
        const label = card.querySelector('span'), arrow = card.querySelector('.radar-arrow');
        const box = card.getBoundingClientRect(), text = label.getBoundingClientRect(), tip = arrow.getBoundingClientRect();
        return { label: label.textContent, fits: label.scrollWidth <= label.clientWidth &&
          text.left >= box.left && text.right <= box.right && text.bottom <= tip.top &&
          box.width >= 44 && box.height >= 44 };
      }));
      assert.deepEqual(layout.map(item => item.label), {
        es: ['Desayunos', 'Comer', 'Cenar', 'Mapa', 'Comparador', 'Sugerencias'],
        en: ['Breakfast', 'Lunch', 'Dinner', 'Map', 'Comparison', 'Suggestions'],
        fr: ['Petit-déjeuner', 'Déjeuner', 'Dîner', 'Carte', 'Comparateur', 'Suggestions']
      }[language]);
      assert.ok(layout.every(item => item.fits), JSON.stringify({ width, language, layout }));
      assert.ok(await page.locator('.radar-header').evaluate(header => {
        const mascot = header.querySelector('.radar-desk img').getBoundingClientRect();
        const navigation = header.querySelector('.radar-nav').getBoundingClientRect();
        return mascot.right <= navigation.left || mascot.bottom <= navigation.top;
      }));
    }

    for (const target of ['#search-section', '#favorite-section', '#guide-section', '#inicio']) {
      await nav.locator('a[href="' + target + '"]').press('Enter');
      assert.equal(new URL(page.url()).hash, target);
      assert.equal(await page.locator(target).isVisible(), true);
    }
    await page.locator('.radar-hero .radar-cta').click();
    assert.equal(new URL(page.url()).hash, '#search-section');

    assert.equal(await shortcuts.locator('a,button').count(), 6);
    for (const mode of ['desayuno', 'comida', 'cena']) {
      await shortcuts.locator('[data-radar-service="' + mode + '"]').click();
      assert.equal(await page.evaluate(() => state.mode), mode);
      assert.equal(await page.evaluate(() => document.activeElement.id), 'dish');
    }
    const suggestions = shortcuts.locator('a[href="#recommendations-section"]');
    await suggestions.press('Tab');
    await page.keyboard.press('Shift+Tab');
    assert.equal(await suggestions.evaluate(link => getComputedStyle(link).outlineStyle), 'solid');
    if (width === 1365) {
      await suggestions.hover();
      await page.waitForFunction(() => {
        const link = document.querySelector('.radar-shortcuts a[href="#recommendations-section"]');
        return new DOMMatrix(getComputedStyle(link).transform).m42 === -2;
      });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      assert.equal(await suggestions.evaluate(link => getComputedStyle(link).transform), 'none');
    }
    await suggestions.press('Enter');
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
