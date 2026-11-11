import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
try {
  for (const width of [1365, 360]) {
    for (const fault of ['transient-503', 'persistent-503', 'invalid-json']) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      let attempts = 0;
      let requests = 0;
      page.on('request', request => {
        if (request.url().includes('/translations/fr/batch-')) requests++;
      });
      const target = '**/batch-107-moriles-ribera.json';
      await page.route(target, async route => {
        attempts++;
        if (fault === 'invalid-json') {
          await route.fulfill({ status: 200, contentType: 'application/json', body: '{' });
        } else if (fault === 'persistent-503' || attempts === 1) {
          await route.fulfill({ status: 503, body: 'Temporarily unavailable' });
        } else {
          await route.continue();
        }
      });
      await page.goto('http://127.0.0.1:8765/');
      await page.waitForFunction(() => typeof state !== 'undefined' && state.places.length === 43);
      const before = await page.evaluate(() => JSON.stringify(state.places));
      const result = await page.evaluate(async () => {
        try {
          // Concurrent callers must share one load and one atomic application.
          await Promise.all([ensureFrenchOverlay(state.places), ensureFrenchOverlay(state.places)]);
          return { loaded: frenchOverlayLoaded };
        } catch (error) {
          return { loaded: frenchOverlayLoaded, error: error.message, retryable: frenchOverlayPromise === null };
        }
      });
      if (fault === 'transient-503') {
        assert.deepEqual(result, { loaded: true });
        assert.equal(attempts, 2);
        assert.equal(requests, 108);
      } else {
        assert.equal(result.loaded, false);
        assert.equal(result.retryable, true);
        assert.ok(result.error);
        assert.equal(attempts, fault === 'persistent-503' ? 2 : 1);
        assert.equal(await page.evaluate(() => JSON.stringify(state.places)), before,
          'Failed batches must leave every catalogue field and translation intact');
        assert.equal(await page.evaluate(() => qaFrenchPlaceIds.size), 0);
        await page.unroute(target);
        await page.evaluate(() => ensureFrenchOverlay(state.places));
      }
      const after = await page.evaluate(() => ({
        data: JSON.stringify(state.places, (key, value) => key === 'fr' ? undefined : value),
        ready: frenchOverlayLoaded,
        translated: state.places.find(p => p.id === 'la-montillana').menuSections[0].items[0].fr
      }));
      assert.equal(after.ready, true);
      assert.ok(after.translated);
      assert.equal(after.data, JSON.stringify(JSON.parse(before), (key, value) => key === 'fr' ? undefined : value));
      const fetched = requests;
      await page.evaluate(() => ensureFrenchOverlay(state.places));
      assert.equal(requests, fetched, 'An applied overlay must not be fetched again');
      console.log(`${width}px ${fault} PASS`);
      await page.close();
    }
  }
} finally {
  await browser.close();
}
