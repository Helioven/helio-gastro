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

    const budget = page.locator('#budget');
    const notice = page.locator('#budget-explain');
    assert.equal(await notice.isVisible(), false);
    assert.equal(await budget.getAttribute('aria-describedby'), null);
    if (!await quick.evaluate(el => el.open)) await quick.locator('summary').press('Enter');
    const salmorejo = quick.locator('button[data-dish="Salmorejo"]');
    await salmorejo.press('Space');
    assert.equal(await salmorejo.getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('#dish').inputValue(), 'Salmorejo');
    assert.equal(await page.locator('#results-section').isHidden(), true);
    await page.locator('#dish').fill('Flamenquin');
    assert.equal(await salmorejo.getAttribute('aria-pressed'), 'false');
    assert.equal(await quick.locator('[aria-pressed="true"]').count(), 1);

    await summary.press('Enter');
    await page.locator('#portion').selectOption('media');
    await page.locator('#price-kind').selectOption('confirmed');
    await page.locator('#sort').selectOption('price');
    await budget.selectOption('10');
    assert.equal(await notice.isVisible(), true);
    assert.equal(await budget.getAttribute('aria-describedby'), 'budget-explain');
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
    assert.equal(await notice.isVisible(), true);
    assert.equal(await salmorejo.getAttribute('aria-pressed'), 'true');
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
    assert.equal(await notice.isVisible(), false);
    assert.equal(await quick.locator('[aria-pressed="true"]').count(), 0);

    const guide = page.locator('.manolo-guide');
    await summary.press('Enter');
    assert.equal(await advanced.evaluate(el => el.open), false);
    const guideSummary = guide.locator('summary');
    if (!await guide.evaluate(el => el.open)) await guideSummary.press('Enter');
    assert.equal(await guideSummary.getAttribute('aria-expanded'), 'true');
    const action = guide.locator('[data-manolo-action="budget"]');
    assert.equal(await guide.locator('.manolo-action-arrow[aria-hidden="true"]').count(), 4);
    assert.equal(await action.evaluate(el => getComputedStyle(el).transitionDuration), '0s');
    await guideSummary.focus();
    assert.ok(await guideSummary.evaluate(el => document.activeElement === el),
      `${width}px: keyboard traversal must start at the guide summary`);
    const expectedActions = ['discover', 'traditional', 'budget'];
    const tabPath = [];
    for (const expectedAction of expectedActions) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tag: el.tagName,
          id: el.id || null,
          action: el.getAttribute('data-manolo-action'),
          text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 120)
        };
      });
      tabPath.push(focused);
      assert.equal(focused.action, expectedAction,
        `${width}px: unexpected Tab path ${JSON.stringify(tabPath)}`);
    }
    console.log(`${width}px Tab path: ${JSON.stringify(tabPath)}`);
    const focusIndicator = await action.evaluate(el => ({
      focused: document.activeElement === el,
      focusVisible: el.matches(':focus-visible'),
      outlineStyle: getComputedStyle(el).outlineStyle,
      outlineWidth: parseFloat(getComputedStyle(el).outlineWidth)
    }));
    assert.equal(focusIndicator.focused, true, 'Tab must reach the budget action');
    assert.equal(focusIndicator.focusVisible, true, 'The budget action must match :focus-visible');
    assert.equal(focusIndicator.outlineStyle, 'solid', 'The focus outline must be solid');
    assert.ok(focusIndicator.outlineWidth > 0, 'The focus outline must have a visible width');
    await page.keyboard.press('Enter');
    assert.equal(await advanced.evaluate(el => el.open), true);
    assert.equal(await page.evaluate(() => document.activeElement.id), 'price-scope');
    assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('.quick-nav')).position),
      width === 360 ? 'static' : 'sticky');
    if (width === 1365) {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await action.hover();
      assert.match(await action.evaluate(el => getComputedStyle(el).transitionDuration), /0\.17s/);
      const translationY = async expected => {
        await page.waitForFunction(y => {
          const card = document.querySelector('[data-manolo-action="budget"]');
          return new DOMMatrix(getComputedStyle(card).transform).m42 === y;
        }, expected);
      };
      await translationY(-2);
      await page.mouse.down();
      try { await translationY(1); }
      finally { await page.mouse.up(); }
      await page.emulateMedia({ reducedMotion: 'reduce' });
      assert.equal(await action.evaluate(el => getComputedStyle(el).transform), 'none');
    }
    for (const name of ['discover', 'traditional', 'budget', 'compare']) {
      const card = guide.locator('[data-manolo-action="' + name + '"]');
      const box = await card.boundingBox();
      await card.click({ position: { x: box.width - 5, y: Math.floor(box.height / 2) } });
      const focus = await page.evaluate(() => ({
        id: document.activeElement.id, quick: !!document.activeElement.closest('#quick-categories')
      }));
      if (name === 'discover') assert.equal(focus.quick, true);
      else assert.equal(focus.id, { traditional: 'recommendations-heading', budget: 'price-scope', compare: 'dish' }[name]);
    }
    await budget.selectOption('10');
    await page.locator('#price-scope').selectOption('meal');
    assert.match(await notice.textContent(), /coste total por persona/);
    await budget.selectOption('');
    assert.equal(await notice.isVisible(), false);
    await page.close();
    console.log(width + ' PASS');
  }
} finally {
  await browser.close();
}
