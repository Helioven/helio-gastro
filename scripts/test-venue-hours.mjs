import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const pilot = JSON.parse(readFileSync('data/venue-hours.json', 'utf8'));
const catalog = JSON.parse(readFileSync('data/places.json', 'utf8'));
assert.equal(pilot.timeZone, 'Europe/Madrid');
assert.equal(Object.keys(pilot.records).length, 5);
for (const [id, record] of Object.entries(pilot.records)) {
  assert.ok(catalog.some(place => place.id === id && !place.hidden));
  for (const source of Object.values(record.sources)) {
    assert.equal(new URL(source.url).protocol, 'https:');
    assert.match(source.checkedOn, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(source.evidence.trim());
  }
  for (const schedule of Object.values(record.schedules)) {
    assert.ok(schedule.sourceIds.every(key => Object.hasOwn(record.sources, key)));
    const days = schedule.week.flatMap(rule => rule.days);
    assert.equal(new Set(days).size, days.length);
    if (schedule.status === 'published') assert.deepEqual([...days].sort(), [1,2,3,4,5,6,7]);
    else assert.equal(days.length, 0);
  }
}
assert.equal(pilot.records['bodegas-campos'].discrepancies[0].status, 'unresolved');

const browser = await chromium.launch({ headless: true });
try {
  for (const [profile, width, height] of [['mobile', 360, 800], ['desktop', 1365, 900]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:8765/index.html');
    await page.waitForFunction(() => state.places.length > 30);
    const panel = page.locator('.venue-hours');
    const open = async (place, present = true) => {
      await page.locator('#place-name').fill(place);
      await page.locator('#search-button').click();
      const card = page.locator('#results article').filter({ hasText: place }).first();
      await card.locator('.detail-button').click();
      if (present) await panel.waitFor();
      else await panel.waitFor({ state: 'detached' });
    };
    for (const [lang, title, nextDay, partial, closed, conflict, unknown] of [
      ['es','Horarios','del día siguiente','cierre sin precisar','Cerrado','Las fuentes oficiales discrepan','Horario sin confirmar'],
      ['en','Hours','the next day','closing time unspecified','Closed','Official sources disagree','Hours unconfirmed'],
      ['fr','Horaires','le lendemain','fermeture non précisée','Fermé','Les sources officielles divergent','Horaires à confirmer']
    ]) {
      await page.locator('#language-select').selectOption(lang);
      await open('Ágora Mezquita');
      assert.equal(await panel.locator('h3').textContent(), title);
      assert.equal(await panel.locator('.venue-hours-card').filter({ hasText: '12:30–01:00 ' + nextDay }).count(), 2);
      assert.equal(await panel.locator('a').count(), 2);
      assert.match(await panel.locator('li').first().textContent(), /2026/);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      if (lang === 'es' && process.argv[2]) {
        await panel.locator('summary').last().press('Enter');
        assert.ok(await panel.locator('a').first().isVisible());
        await panel.evaluate(node => { node.scrollIntoView({ block: 'start' }); window.scrollBy(0, -145); });
        await page.evaluate(() => document.activeElement.blur());
        await page.screenshot({ path: join(process.argv[2], profile + '-agora.png') });
      }
      await open('La Montillana');
      assert.match(await panel.locator('.venue-hours-card').first().textContent(), /13:00–18:00/);
      assert.ok((await panel.locator('.venue-hours-card').first().textContent()).includes(partial));
      assert.ok((await panel.locator('.venue-hours-card').nth(1).textContent()).includes(unknown));
      if (lang === 'es' && process.argv[2]) {
        await panel.evaluate(node => { node.scrollIntoView({ block: 'start' }); window.scrollBy(0, -145); });
        await page.screenshot({ path: join(process.argv[2], profile + '-montillana.png') });
      }
      await open('Taberna Salinas');
      assert.ok((await panel.textContent()).includes(closed));
      await open('Casa Bravo');
      assert.match(await panel.locator('.venue-hours-card').nth(1).textContent(), /12:00–00:00/);
      await open('Bodegas Campos');
      assert.ok((await panel.textContent()).includes(conflict));
      assert.doesNotMatch(await panel.textContent(), /13:30|20:00/);
      await open('Patio Romano', false);
    }
    assert.deepEqual(errors, []);
    await page.close();
    console.log(profile + ' PASS · five venues and ES/EN/FR');
  }

  const page = await browser.newPage();
  const testData = structuredClone(pilot);
  testData.records['agora-mezquita'].schedules.opening.exceptions.push({
    date: '2099-12-25', status: 'closed', sourceIds: ['contact'], intervals: []
  });
  await page.route('**/data/venue-hours.json*', route => route.fulfill({ json: testData }));
  await page.goto('http://127.0.0.1:8765/index.html');
  await page.waitForFunction(() => state.places.length > 30);
  await page.locator('#place-name').fill('Ágora Mezquita');
  await page.locator('#search-button').click();
  await page.locator('#results .detail-button').first().click();
  const more = page.locator('.venue-hours details').first();
  await more.locator('summary').press('Enter');
  assert.match(await more.textContent(), /2099.*Cerrado/);
  console.log('Exception rendering PASS · QA fixture only');
  await page.close();
} finally {
  await browser.close();
}
