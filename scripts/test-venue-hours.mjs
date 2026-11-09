import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const pilot = JSON.parse(readFileSync('data/venue-hours.json', 'utf8'));
const catalog = JSON.parse(readFileSync('data/places.json', 'utf8'));
assert.equal(pilot.timeZone, 'Europe/Madrid');
assert.equal(pilot.schemaVersion, 1);
assert.equal(Object.keys(pilot.records).length, 43);
assert.equal(catalog.length, 44);
assert.equal(catalog.filter(place => !place.hidden).length, 43);
assert.deepEqual(Object.keys(pilot.records).sort(), catalog.filter(place => !place.hidden).map(place => place.id).sort());
assert.equal(catalog.find(place => place.id === 'el-caballo-rojo').hidden, true);
const scopes = ['opening', 'kitchen', 'breakfast', 'lunch', 'dinner'];
const week = [1, 2, 3, 4, 5, 6, 7];
const time = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
for (const [id, record] of Object.entries(pilot.records)) {
  assert.ok(catalog.some(place => place.id === id && !place.hidden));
  for (const source of Object.values(record.sources)) {
    assert.equal(new URL(source.url).protocol, 'https:');
    assert.match(source.checkedOn, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(source.evidence.trim());
  }
  assert.deepEqual(Object.keys(record.schedules), scopes);
  for (const entry of record.discrepancies) {
    assert.ok(scopes.includes(entry.scope));
    assert.ok(entry.sourceIds.length && entry.sourceIds.every(key => Object.hasOwn(record.sources, key)));
  }
  for (const [scope, schedule] of Object.entries(record.schedules)) {
    assert.ok(['published', 'unknown', 'conflict'].includes(schedule.status));
    if (schedule.status !== 'unknown') assert.ok(schedule.sourceIds.length);
    if (schedule.status === 'conflict') {
      assert.ok(record.discrepancies.some(entry => entry.scope === scope && entry.status === 'unresolved'));
    }
    for (const rule of [...schedule.week, ...schedule.exceptions]) {
      assert.ok(['scheduled', 'partial', 'closed', 'unknown'].includes(rule.status));
      assert.equal(rule.intervals.length > 0, ['scheduled', 'partial'].includes(rule.status));
      for (const {start, end, endDayOffset} of rule.intervals) {
        assert.match(start, time);
        if (end === null) {
          assert.equal(rule.status, 'partial');
          assert.equal(endDayOffset, null);
        } else {
          assert.match(end, time);
          assert.notEqual(start, end);
          assert.equal(endDayOffset, Number(end < start));
        }
      }
    }
    assert.ok(schedule.sourceIds.every(key => Object.hasOwn(record.sources, key)));
    const days = schedule.week.flatMap(rule => rule.days);
    assert.equal(new Set(days).size, days.length);
    if (schedule.status === 'published') assert.deepEqual([...days].sort(), week);
    else assert.equal(days.length, 0);
  }
}
assert.equal(pilot.records['bodegas-campos'].discrepancies[0].status, 'unresolved');

const pageUrl = 'http://127.0.0.1:8765/index.html';
function hoursProbe(page) {
  const panel = page.locator('#detail-section .venue-hours');
  const attempt = { phase: 'page setup' };
  let clickProbeId = 0;
  page.on('console', message => {
    if (message.text() === 'venue-hours-click:' + clickProbeId) attempt.clickReachedButton = true;
  });
  async function open(place, beforeClick) {
    clickProbeId++;
    Object.assign(attempt, { place, phase: 'search', clickReachedButton: false });
    await page.locator('#place-name').fill(place);
    await page.locator('#search-button').click();
    attempt.phase = 'result identity';
    const card = page.locator('#results article').filter({
      has: page.getByRole('heading', { level: 3, name: place, exact: true })
    });
    assert.equal(await card.count(), 1, 'Expected one result with exact heading for ' + place);
    const venues = catalog.filter(venue => venue.name === place);
    assert.equal(venues.length, 1, 'Ambiguous or missing catalog name ' + place);
    const button = card.locator('.detail-button');
    await button.evaluate((node, id) => {
      node.addEventListener('click', () => console.debug('venue-hours-click:' + id), { capture: true, once: true });
    }, clickProbeId);
    if (beforeClick) await beforeClick(button);
    attempt.phase = 'click';
    await button.click();
    attempt.phase = 'detail identity';
    const detail = page.locator('#detail-section');
    await detail.getByRole('heading', { level: 2, name: place, exact: true }).waitFor();
    assert.equal(await page.evaluate(() => state.currentDetailId), venues[0].id);
    attempt.phase = 'hours visibility';
    await panel.waitFor();
    attempt.phase = 'hours assertions';
  }
  return { panel, attempt, open };
}

async function withFailureEvidence(page, profile, run) {
  const { tracing } = page.context();
  const probe = hoursProbe(page);
  // Keep action timing without recording every DOM snapshot in the full matrix.
  await tracing.start();
  try {
    await run(probe);
  } catch (error) {
    const folder = 'qa-reports';
    mkdirSync(folder, { recursive: true });
    const stem = join(folder, 'venue-hours-' + profile + '-failure');
    const evidence = {
      profile, viewport: page.viewportSize(), ...probe.attempt,
      language: await page.locator('html').getAttribute('lang', { timeout: 1000 }).catch(() => null),
      error: error.message, artifactErrors: []
    };
    await page.screenshot({ path: stem + '.png', timeout: 5000 }).catch(failure => {
      evidence.artifactErrors.push('Screenshot: ' + failure.message);
    });
    await tracing.stop({ path: stem + '.zip' }).catch(failure => {
      evidence.artifactErrors.push('Trace: ' + failure.message);
    });
    writeFileSync(stem + '.json', JSON.stringify(evidence, null, 2) + '\n');
    console.error('VENUE HOURS FAILURE', JSON.stringify(evidence));
    throw error;
  }
  await tracing.stop();
}

const browser = await chromium.launch({ headless: true });
try {
  for (const [profile, width, height] of [['mobile', 360, 800], ['desktop', 1365, 900]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await withFailureEvidence(page, profile, async ({ open, panel }) => {
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(pageUrl);
      await page.waitForFunction(() => state.places.length > 30);
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
        await open('Taberna La Montillana');
        assert.match(await panel.locator('.venue-hours-card').first().textContent(), /13:00–18:00/);
        assert.ok((await panel.locator('.venue-hours-card').first().textContent()).includes(partial));
        assert.ok((await panel.locator('.venue-hours-card').nth(1).textContent()).includes(unknown));
        if (lang === 'es' && process.argv[2]) {
          await panel.evaluate(node => { node.scrollIntoView({ block: 'start' }); window.scrollBy(0, -145); });
          await page.screenshot({ path: join(process.argv[2], profile + '-montillana.png') });
        }
        await open('Taberna Salinas');
        assert.ok((await panel.textContent()).includes(closed));
        await open('Taberna Ágora Casa Bravo 1919');
        assert.match(await panel.locator('.venue-hours-card').nth(1).textContent(), /12:00–00:00/);
        await open('Bodegas Campos');
        assert.ok((await panel.textContent()).includes(conflict));
        assert.doesNotMatch(await panel.textContent(), /13:30|20:00/);
        const names = {
          es: ['Bodegas Campos: Contacto · Apertura del local', 'Bodegas Campos: Reservas · Apertura del local'],
          en: ['Bodegas Campos: Contact · Venue opening hours', 'Bodegas Campos: Reservations · Venue opening hours'],
          fr: ['Bodegas Campos : Contact · Ouverture de l’établissement', 'Bodegas Campos : Réservations · Ouverture de l’établissement']
        }[lang];
        const urls = Object.values(pilot.records['bodegas-campos'].sources).map(source => source.url);
        await panel.locator('summary').last().press('Enter');
        for (const [index, name] of names.entries()) {
          const link = panel.getByRole('link', { name, exact: true });
          assert.equal(await link.getAttribute('href'), urls[index]);
          await page.keyboard.press('Tab');
          assert.equal(await link.evaluate(node => node === document.activeElement), true);
        }
        const additions = [
          ['Taberna La Viuda', '13:00–16:30 · 20:00–23:30'],
          ['Casa Pepe de la Judería', unknown],
          ['Restaurante Casa Rubio', conflict],
          ['Restaurante Puerta Sevilla', '13:00–16:30 · 20:00–23:30'],
          ['La Posada del Caballo Andaluz', '20:00–00:00 ' + nextDay],
          ['La Cazuela de la Espartería', '20:30–00:30 ' + nextDay],
          ['La Taberna del Río', '13:00–00:00 ' + nextDay],
          ['Bodegas Mezquita Céspedes', conflict],
          ['Taberna El Nº 10', '20:00–00:00 ' + nextDay, '20:00–00:00 ' + nextDay],
          ['Taberna La Manuela', '12:00–23:00', '12:00–23:00'],
          ['Taberna Góngora', '13:00–16:00 · 20:00–23:30'],
          ['Taberna Sociedad de Plateros · San Francisco', '20:00 · ' + partial],
          ['Taberna Rincón de las Beatillas', closed],
          ['Moriles Ribera', '12:00–03:00 ' + nextDay],
          ['Moriles Casa Fina', '12:00–02:00 ' + nextDay],
          ['La Piscatoria', '09:00–21:00'],
          ['La Tarterie', '08:30–20:30'],
          ['La Bandera', '07:30–13:30 · 17:00–21:00'],
          ['Con Acento Brasería', conflict],
          ['Taberna Museo Manolete', '12:30–00:00 ' + nextDay]
        ];
        for (const [venue, opening, kitchen = unknown] of additions) {
          if (venue === 'La Tarterie') await page.locator('[data-service="merienda"]').click();
          await open(venue);
          const cards = panel.locator('.venue-hours-card');
          assert.equal(await panel.locator('h3').textContent(), title);
          assert.ok((await cards.nth(0).textContent()).includes(opening), venue + ' opening');
          assert.ok((await cards.nth(1).textContent()).includes(kitchen), venue + ' kitchen');
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), venue);
          if (venue === 'Casa Pepe de la Judería') {
            await panel.locator('summary').first().press('Enter');
            assert.match(await cards.nth(3).innerText(), /13:00–16:00/);
            assert.match(await cards.nth(4).innerText(), /19:30–23:00.*19:30–23:30/s);
          }
          if (['Taberna Góngora', 'Taberna Sociedad de Plateros · San Francisco'].includes(venue)) {
            assert.ok((await cards.nth(0).textContent()).includes(closed), venue);
          }
          if (['Taberna Rincón de las Beatillas', 'La Tarterie'].includes(venue)) {
            assert.ok((await cards.nth(0).textContent()).includes(unknown), venue);
          }
          if (venue === 'Con Acento Brasería') {
            assert.doesNotMatch(await cards.nth(0).textContent(), /12:30|13:00|00:30/);
            await panel.locator('summary').last().press('Enter');
            const links = panel.getByRole('link');
            assert.equal(await links.count(), 3);
            assert.equal(new Set(await links.allTextContents()).size, 3);
            const sources = Object.values(pilot.records['con-acento-braseria'].sources);
            for (const [index, source] of sources.entries()) {
              const link = links.nth(index);
              assert.equal(await link.getAttribute('href'), source.url);
              await page.keyboard.press('Tab');
              assert.ok(await link.evaluate(node => node === document.activeElement));
            }
          }
          if (venue === 'La Tarterie') await page.locator('[data-service="comida"]').click();
          if (venue === 'Restaurante Casa Rubio') assert.doesNotMatch(await cards.nth(0).textContent(), /19:30|20:00/);
          if (venue === 'Taberna El Nº 10') assert.ok((await cards.nth(0).textContent()).includes(unknown));
          if (venue === 'Bodegas Mezquita Céspedes') {
            assert.doesNotMatch(await cards.nth(0).textContent(), /23:30|00:00/);
            await panel.locator('summary').last().press('Enter');
            const links = panel.getByRole('link');
            const sources = Object.values(pilot.records['bodegas-mezquita-cespedes'].sources);
            assert.equal(await links.count(), 4);
            assert.equal(new Set(await links.allTextContents()).size, sources.length);
            for (const [index, source] of sources.entries()) {
              assert.equal(await links.nth(index).getAttribute('href'), source.url);
            }
          }
        }
        const lastBatch = [
          ['taberna-el-poema-alonso'], ['taberna-el-poema-gran-capitan'], ['taberna-rafae'],
          ['taberna-san-miguel-el-pisto'], ['sociedad-plateros-maria-auxiliadora'], ['el-churrasco'],
          ['taberna-el-abuelo'], ['bar-moriles-original', '07:00–03:00 ' + nextDay],
          ['churros-bar-marta', unknown, 'desayuno'], ['cafeteria-don-pepe-centro', unknown, 'desayuno'],
          ['cafeteria-don-pepe-ciudad-jardin', unknown, 'desayuno'], ['dtapas-covap-cordoba'],
          ['cafeteria-bar-la-jineta', '07:30–00:00 ' + nextDay],
          ['pastelerias-roldan-centro', '07:30–21:30', 'desayuno'],
          ['pastelerias-roldan-tiendas', unknown, 'desayuno'], ['patio-romano'], ['el-burlaero'],
          ['taberna-la-sal', '08:00–00:30 ' + nextDay]
        ];
        for (const [id, opening = unknown, mode = 'comida'] of lastBatch) {
          const venue = catalog.find(place => place.id === id);
          const service = page.locator('[data-service="' + mode + '"]');
          if (await service.getAttribute('aria-pressed') !== 'true') await service.click();
          await open(venue.name);
          assert.equal(await page.evaluate(() => state.currentDetailId), id);
          assert.equal(await panel.locator('h3').textContent(), title);
          const cards = panel.locator('.venue-hours-card');
          assert.ok((await cards.nth(0).textContent()).includes(opening), id);
          assert.ok((await cards.nth(1).textContent()).includes(unknown), id);
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), id);
          const links = panel.locator('a');
          const sources = Object.values(pilot.records[id].sources);
          assert.equal(await links.count(), sources.length);
          assert.equal(await links.first().getAttribute('href'), sources[0].url);
          if (sources[0].labelKey === 'referenceSource') {
            const label = {es:'Directorio consultado',en:'Directory consulted',fr:'Annuaire consulté'}[lang];
            assert.ok((await links.first().textContent()).startsWith(label), id);
          }
        }
      }
      assert.deepEqual(errors, []);
    });
    await page.close();
    console.log(profile + ' PASS · 43 venues and ES/EN/FR');
  }

  const page = await browser.newPage();
  await withFailureEvidence(page, 'exception-and-controls', async ({ open, panel, attempt }) => {
    const testData = structuredClone(pilot);
    testData.records['agora-mezquita'].schedules.opening.exceptions.push({
      date: '2099-12-25', status: 'closed', sourceIds: ['contact'], intervals: []
    });
    await page.route('**/data/venue-hours.json*', route => route.fulfill({ json: testData }));
    await page.goto(pageUrl);
    await page.waitForFunction(() => state.places.length > 30);
    await open('Ágora Mezquita');
    const more = panel.locator('details').first();
    await more.locator('summary').press('Enter');
    assert.match(await more.textContent(), /2099.*Cerrado/);
    console.log('Exception rendering PASS · QA fixture only');

    const venue = 'Bodegas Mezquita Céspedes';
    // Short deadlines apply only to the intentionally broken fixture page.
    page.setDefaultTimeout(1500);
    try {
      await assert.rejects(open(venue, button => button.evaluate(node => {
        const overlay = document.createElement('div');
        overlay.id = 'qa-hours-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483647';
        node.ownerDocument.body.append(overlay);
      })), /intercepts pointer events/);
      assert.equal(attempt.phase, 'click');
      assert.equal(attempt.clickReachedButton, false);
    } finally {
      await page.locator('#qa-hours-overlay').evaluateAll(nodes => nodes.forEach(node => node.remove()));
    }
    await assert.rejects(open(venue, button => button.evaluate(node => {
      node.addEventListener('click', event => event.stopImmediatePropagation(), { capture: true, once: true });
    })), /Timeout/);
    assert.equal(attempt.phase, 'detail identity');
    assert.equal(attempt.clickReachedButton, true);
    await open(venue);
    console.log('Overlay and blocked detail handler controls PASS');
  });
  await page.close();
} finally {
  await browser.close();
}
