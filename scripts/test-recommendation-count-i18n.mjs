import assert from 'node:assert/strict';
import { chromium, devices } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
try {
  for (const [profile, config] of [['desktop', { viewport: { width: 1365, height: 900 } }], ['mobile', devices['iPhone 13']]]) {
    const page = await browser.newPage(config);
    await page.goto('http://127.0.0.1:8765/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => typeof state !== 'undefined' && state.places.length > 0);

    async function check(mode, language) {
      await page.locator(`[data-service="${mode}"]`).click();
      await page.locator('#language-select').selectOption(language);
      const expected = await page.evaluate(({ mode, language }) => MODE_CONFIG[mode].dishes.map(name => {
        const data = recommendationEntries(clean(name));
        const total = data.matches.length;
        const priced = new Set(data.priced.map(entry => entry.p.id)).size;
        if (clean(name) === 'tapas' && !total) return null;
        if (language === 'es') return `${total} ${total === 1 ? 'local registrado' : 'locales registrados'} · ${priced} con precio registrado`;
        if (language === 'en') return `${total} ${total === 1 ? 'place listed' : 'places listed'} · ${priced} with a recorded price`;
        return `${total} ${total === 1 ? 'établissement répertorié' : 'établissements répertoriés'} · ${priced} avec un prix renseigné`;
      }), { mode, language });
      const visibleCounts = expected.filter(Boolean);
      const tiles = page.locator('#recommendation-dishes .recommendation-tile');
      assert.equal(await tiles.count(), visibleCounts.length);
      assert.deepEqual(await tiles.locator(':scope > span:not(.dish-visual)').allTextContents(), visibleCounts);
      if (mode === 'desayuno' || mode === 'merienda') {
        const expectedImages = mode === 'desayuno'
          ? ['tostadas', 'churros', 'molletes', 'cafe', 'bolleria']
          : ['churros', 'chocolate-a-la-taza', 'pasteles', 'tartas', 'tostadas', 'bolleria', 'cafe', 'molletes'];
        const images = tiles.locator('.dish-visual img');
        assert.deepEqual(await images.evaluateAll(nodes => nodes.map(node => node.src.split('/').pop())),
          expectedImages.map(name => name + '.webp'));
        assert.deepEqual(await images.evaluateAll(nodes => Promise.all(nodes.map(async node => {
          await node.decode();
          return node.alt;
        }))), await images.evaluateAll((nodes, lang) =>
          nodes.map(node => CARD_ILLUSTRATIONS[node.dataset.cardIllustration].alt[lang]), language));
        assert.deepEqual(await tiles.locator('.dish-visual-label').allTextContents(),
          Array(expectedImages.length).fill({ es: 'Imagen ilustrativa', en: 'Illustrative image', fr: 'Image illustrative' }[language]));
        const molletes = await page.evaluate(() => {
          const data = recommendationEntries('molletes');
          return {
            ids: data.matches.map(p => p.id),
            names: [...new Set(data.priced.map(({item}) => item.dish))],
            prices: data.priced.map(({item}) => item.eur),
            searchable: ['mollete', 'molletes'].map(term =>
              state.places.filter(p => placeMatchesDish(p, term)).map(p => p.id))
          };
        });
        assert.deepEqual(molletes.ids, ['bar-moriles-original']);
        assert.deepEqual(molletes.names, ['Mollete de Antequera', 'Mollete rústico cordobés']);
        assert.deepEqual(molletes.prices, [1.3, 2.1, 1.3, 2.1]);
        assert.deepEqual(molletes.searchable, [molletes.ids, molletes.ids]);
        assert.equal(await tiles.locator('strong svg[aria-hidden="true"]').count(), visibleCounts.length - expectedImages.length);
        if (language === 'fr') assert.match(await page.locator('#service-intro').textContent(), /restent à confirmer/);
      }
    }

    for (const language of ['es', 'en', 'fr', 'es']) await check('comida', language);
    for (const language of ['fr', 'en', 'es', 'fr']) await check('desayuno', language);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => typeof state !== 'undefined' && state.places.length > 0);
    assert.equal(await page.locator('#language-select').inputValue(), 'fr');
    assert.equal(await page.evaluate(() => state.mode), 'desayuno');
    await check('desayuno', 'fr');
    for (const language of ['es', 'en', 'fr']) await check('merienda', language);
    await check('cena', 'fr');
    await check('cena', 'en');
    await check('cena', 'es');
    // Exercise zero and singular counts even if today's catalog has neither.
    await page.evaluate(() => {
      for (const text of ['0 locales registrados · 0 con precio registrado', '1 local registrado · 1 con precio registrado']) {
        const tile = document.createElement('button');
        tile.className = 'recommendation-tile test-count';
        const count = document.createElement('span');
        count.textContent = text;
        tile.append(count);
        document.querySelector('#recommendation-dishes').append(tile);
      }
    });
    await page.locator('#language-select').selectOption('fr');
    await page.waitForFunction(() => {
      const values = [...document.querySelectorAll('.test-count > span')].map(node => node.textContent);
      return values[0] === '0 établissements répertoriés · 0 avec un prix renseigné' && values[1] === '1 établissement répertorié · 1 avec un prix renseigné';
    });
    console.log(`Recommendation count i18n ${profile}: PASS`);
    await page.close();
  }
} finally {
  await browser.close();
}
