import { chromium, devices } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const base = 'http://127.0.0.1:8765/index.html';
const profiles = [
  { name: 'desktop', config: { viewport: { width: 1365, height: 900 } } },
  { name: 'mobile', config: devices['iPhone 13'] }
];
const modes = [{ name: 'public', query: '' }, { name: 'qa-fr', query: '?qa_fr=1' }];
mkdirSync('qa-reports', { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const results = [];
let failed = false;

for (const profile of profiles) {
  for (const mode of modes) {
    const context = await browser.newContext(profile.config);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push('JavaScript: ' + error.message));
    try {
      await page.goto(base + mode.query, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => typeof state !== 'undefined' && state.places.length > 0);
      // Stable ES baseline: French opt-in must not change matching, amounts or formats.
      await page.locator('#language-select').selectOption('es');
      await page.locator('[data-service="comida"]').click();
      await page.locator('#clear-search').click();
      if (!(await page.locator('#results-section').isHidden())) errors.push('Results visible before Search');
      await page.locator('#dish').fill('Flamenquín');
      if (!(await page.locator('#results-section').isHidden())) errors.push('Typing triggered automatic search');
      await page.locator('#filters').evaluate(form => form.requestSubmit());
      await page.waitForFunction(() => state.searched && state.appliedTerm === 'flamenquin');
      const search = await page.evaluate(() => ({
        results: state.filtered.map(p => p.id).sort(),
        total: state.filtered.length,
        invalid: state.filtered.filter(p => !serviceDishes(p).some(d => clean(d).includes('flamenquin')) &&
          !servicePrices(p).some(price => clean(price.dish).includes('flamenquin'))).map(p => p.id),
        cardCount: document.querySelectorAll('#results article.place').length,
        advertised: document.querySelector('#count')?.textContent
      }));
      if (!search.total) errors.push('Flamenquín yielded zero results');
      if (search.invalid.length) errors.push('Nonmatching places: ' + search.invalid.join(', '));
      if (search.cardCount !== search.total) errors.push('Rendered cards do not match filtered result count');
      // A name search cannot be satisfied merely by a dish match.
      await page.locator('#dish').fill('');
      await page.locator('#place-name').fill('Moriles');
      await page.locator('#filters').evaluate(form => form.requestSubmit());
      const names = await page.evaluate(() => state.filtered.map(p => p.name));
      if (!names.length || names.some(n => !n.toLocaleLowerCase('es').includes('moriles')))
        errors.push('Name-only Moriles search returned absent/unrelated places');
      // Filtering changes must not launch a new search before submitting.
      const countBefore = await page.locator('#count').textContent();
      await page.locator('#dish').fill('Rabo de toro');
      if (await page.locator('#count').textContent() !== countBefore)
        errors.push('Typing modified results without Search');
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => typeof state !== 'undefined' && state.places.length > 0);
      if (await page.locator('#place-name').inputValue() !== 'Moriles' ||
          await page.locator('#dish').inputValue() !== '')
        errors.push('Reload failed to restore last submitted search');
      if (await page.locator('#results-section').isHidden())
        errors.push('Submitted search not restored on reload');
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1))
        errors.push('Horizontal overflow');
      if (mode.name === 'public' && await page.locator('#language-select option[value="fr"]').count())
        errors.push('Public language selector unexpectedly shows FR');
      if (mode.name === 'qa-fr' && !(await page.locator('#language-select option[value="fr"]').count()))
        errors.push('French QA language selector is absent');
      results.push({ profile: profile.name, mode: mode.name, status: errors.length ? 'FAIL' : 'PASS', search, morilesCount: names.length, errors });
    } catch (error) {
      errors.push('Test interrupted: ' + error.message);
      results.push({ profile: profile.name, mode: mode.name, status: 'FAIL', errors });
    }
    if (errors.length) failed = true;
    await context.close();
  }
}
await browser.close();
const report = { suite: 'HG-QA-032 search regression', status: failed ? 'FAIL' : 'PASS', results };
writeFileSync('qa-reports/search-regression.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (failed) process.exitCode = 1;
