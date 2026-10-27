import { chromium, devices } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const profiles = [
  { name: 'desktop', config: { viewport: { width: 1365, height: 900 } } },
  { name: 'mobile', config: devices['iPhone 13'] }
];
const modes = [{ name: 'public', query: '' }, { name: 'qa-fr', query: '?qa_fr=1' }];
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
mkdirSync('qa-reports', { recursive: true });
const results = [];
let failed = false;

for (const profile of profiles) for (const mode of modes) {
  const context = await browser.newContext(profile.config);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('JavaScript: ' + e.message));
  try {
    await page.goto('http://127.0.0.1:8765/index.html' + mode.query, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => typeof state !== 'undefined' && state.places.length > 0);
    await page.locator('#language-select').selectOption('es');
    await page.locator('[data-service="comida"]').click();
    await page.locator('#clear-search').click();
    await page.locator('#dish').fill('');
    await page.locator('#filters').evaluate(form => form.requestSubmit());
    await page.waitForFunction(() => state.filtered.length >= 4);
    const all = await page.locator('#results article.place').count();
    if (all < 4) errors.push('Not enough places for comparator limit test');
    const add = async index => {
      const cards = page.locator('#results article.place');
      await cards.nth(index).locator('button[aria-pressed]').filter({ hasText: 'Comparar' }).click();
    };
    for (let i = 0; i < 3; i++) await add(i);
    const firstThree = await page.evaluate(() => [...state.selected].sort());
    if (firstThree.length !== 3) errors.push('Comparator did not accept three');
    if (await page.locator('#compare-count').textContent() !== '3 / 3') errors.push('Counter did not show 3 / 3');
    await add(3);
    const afterFourth = await page.evaluate(() => [...state.selected].sort());
    if (JSON.stringify(firstThree) !== JSON.stringify(afterFourth))
      errors.push('Fourth restaurant altered comparator selection');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => typeof state !== 'undefined' && state.places.length > 0);
    const restored = await page.evaluate(() => [...state.selected].sort());
    if (JSON.stringify(restored) !== JSON.stringify(firstThree))
      errors.push('Selected three were not restored after reload');
    const route = page.locator('#compare-output a[href*="travelmode=walking"]');
    if (await route.count() !== 1) errors.push('Walking route is absent for three selected restaurants');
    const compareLinks = await page.locator('#compare-output a[target="_blank"]').evaluateAll(els =>
      els.map(a => ({ href: a.href, rel: a.rel })));
    if (compareLinks.some(a => !a.href.startsWith('https://') || !a.rel.includes('noopener') || !a.rel.includes('noreferrer')))
      errors.push('Unsafe comparator external link');
    const selectedNames = await page.evaluate(() => state.places.filter(p => state.selected.has(p.id)).map(p => p.name));
    const cardsCount = await page.locator('#compare-output .compare-place').count();
    if (cardsCount !== 3) errors.push('Comparator does not render three establishments');
    await page.locator('[data-service="desayuno"]').click();
    const selectionAfterService = await page.evaluate(() => [...state.selected]);
    if (selectionAfterService.length) errors.push('Changing service retained incompatible comparison');
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1))
      errors.push('Horizontal page overflow');
    results.push({ profile: profile.name, mode: mode.name, status: errors.length ? 'FAIL' : 'PASS',
      available: all, compared: selectedNames, restored: restored.length, afterService: selectionAfterService.length, errors });
  } catch (error) {
    errors.push('Interrupted: ' + error.message);
    results.push({ profile: profile.name, mode: mode.name, status: 'FAIL', errors });
  }
  if (errors.length) failed = true;
  await context.close();
}
await browser.close();
const report = { suite: 'HG-QA-034 comparator regression', status: failed ? 'FAIL' : 'PASS', results };
writeFileSync('qa-reports/comparator-regression.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (failed) process.exitCode = 1;
