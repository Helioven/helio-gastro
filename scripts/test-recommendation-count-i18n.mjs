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
        const verified = mode === 'desayuno' || mode === 'merienda';
        if (verified && !total) return null;
        if (language === 'es') return `${total} locales ${verified ? 'verificados' : 'registrados'} · ${priced} con precio`;
        if (language === 'en') return `${total} ${verified ? 'verified places' : 'places listed'} · ${priced} with prices`;
        const singular = total === 1;
        const status = verified ? (singular ? 'vérifié' : 'vérifiés') : (singular ? 'répertorié' : 'répertoriés');
        return `${total} ${singular ? 'établissement' : 'établissements'} ${status} · ${priced} avec prix`;
      }), { mode, language });
      assert(expected.some(Boolean), `${profile}: ${mode} has no count to check`);
      await page.waitForFunction(expected => [...document.querySelectorAll('#recommendation-dishes .recommendation-tile')].every((tile, i) =>
        expected[i] === null || tile.querySelector(':scope > span:not(.dish-visual)')?.textContent === expected[i]), expected);
    }

    for (const language of ['es', 'en', 'fr', 'es']) await check('comida', language);
    for (const language of ['fr', 'en', 'es', 'fr']) await check('desayuno', language);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => typeof state !== 'undefined' && state.places.length > 0);
    assert.equal(await page.locator('#language-select').inputValue(), 'fr');
    assert.equal(await page.evaluate(() => state.mode), 'desayuno');
    await check('desayuno', 'fr');
    await check('cena', 'fr');
    await check('cena', 'en');
    await check('cena', 'es');
    // Exercise zero and singular counts even if today's catalog has neither.
    await page.evaluate(() => {
      for (const text of ['0 locales registrados · 0 con precio', '1 locales verificados · 1 con precio']) {
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
      return values[0] === '0 établissements répertoriés · 0 avec prix' && values[1] === '1 établissement vérifié · 1 avec prix';
    });
    console.log(`Recommendation count i18n ${profile}: PASS`);
    await page.close();
  }
} finally {
  await browser.close();
}
