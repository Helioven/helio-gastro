import assert from 'node:assert/strict';
import { join } from 'node:path';
import { chromium } from 'playwright';

const copy = {
 es: ['Manolo te orienta', 'No sé qué comer', 'Quiero algo típico', 'Busco algo económico', 'Quiero comparar'],
 fr: ['Les astuces de Manolo', 'Je ne sais pas quoi manger', 'Je veux goûter une spécialité locale', 'Je cherche une option économique', 'Je veux comparer'],
 en: ['Manolo’s search tips', 'I don’t know what to eat', 'I want something local', 'I’m looking for something affordable', 'I want to compare']
};
const descriptions = {
 "es": [
  "¿Con hambre y sin ideas? ¡Para eso estoy yo!",
  "Descubre platos y encuentra dónde probarlos.",
  "Explora los sabores tradicionales de Córdoba.",
  "Encuentra platos que se ajusten a tu presupuesto.",
  "Compara precios de un mismo plato."
 ],
 "fr": [
  "Vous avez faim et manquez d’idées ? Je suis là pour ça !",
  "Découvrez des plats et où les déguster.",
  "Explorez les saveurs traditionnelles de Cordoue.",
  "Trouvez des plats adaptés à votre budget.",
  "Comparez les prix d’un même plat."
 ],
 "en": [
  "Hungry and out of ideas? That’s what I’m here for!",
  "Discover dishes and find where to try them.",
  "Explore the traditional flavours of Córdoba.",
  "Find dishes that fit your budget.",
  "Compare prices for the same dish."
 ]
};
const browser = await chromium.launch({ headless: true });
try {
 for (const [profile, width, height] of [['movil', 360, 800], ['escritorio', 1365, 900]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:8765/?qa_fr=1');
  await page.waitForFunction(() => state.places.length === 43);
  const guide = page.locator('.manolo-guide');
  const summary = guide.locator('summary');
  const action = name => guide.locator('[data-manolo-action="' + name + '"]');
  const focus = () => page.evaluate(() => document.activeElement.id);
  const checkWidth = async () => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  assert.equal(await guide.locator('input,textarea,form').count(), 0);
  const setExpanded = async expanded => {
   await page.waitForFunction(value => document.querySelector('.manolo-guide summary').getAttribute('aria-expanded') === String(value), expanded);
   assert.equal(await guide.evaluate(node => node.open), expanded);
   assert.equal(await action('discover').isVisible(), expanded);
  };
  const shot = async name => {
   if (!process.argv[2]) return;
   await guide.evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
   await page.mouse.move(0, 0);
   await page.screenshot({ path: join(process.argv[2], name + '.png') });
  };
  const mobile = width === 360;
  await setExpanded(!mobile);
  await checkWidth();
  await shot(mobile ? 'manolo-movil-cerrado' : 'manolo-escritorio');
  await summary.press('Enter');
  await setExpanded(mobile);
  if (!mobile) await summary.press('Space');
  await setExpanded(true);
  assert.equal(await guide.locator('.manolo-guide-options').evaluate(node => getComputedStyle(node).gridTemplateColumns.split(' ').length), mobile ? 1 : 2);
  assert.equal(new Set(await guide.locator('button').evaluateAll(buttons => buttons.map(button => getComputedStyle(button).backgroundColor))).size, 1);
  if (mobile) await shot('manolo-movil-abierto');
  for (const name of ['traditional', 'budget', 'compare']) assert.equal(await page.locator('#manolo-' + name + '-note').isVisible(), false);
  await page.keyboard.press('Tab');
  assert.equal(await action('discover').evaluate(node => document.activeElement === node && node.matches(':focus-visible')), true);
  await page.locator('[data-service="desayuno"]').click();
  await action('discover').press('Enter');
  assert.equal(await focus(), 'recommendations-heading');
  assert.equal(await page.evaluate(() => state.mode), 'desayuno');
  assert.match(await page.locator('#recommendations-heading').innerText(), /Ideas para tu momento/);
  assert.ok(await page.locator('#recommendation-dishes button').count());
  await action('traditional').press('Enter');
  assert.equal(await focus(), 'recommendations-heading');
  assert.equal(await page.evaluate(() => state.mode), 'comida');
  assert.equal(await page.locator('#recommendations-heading').innerText(), 'Sabores de Córdoba');
  assert.match(await page.locator('#manolo-traditional-note').innerText(), /Has pasado al momento de comida/);
  assert.equal(await page.locator('#manolo-traditional-note').isVisible(), true);
  await action('discover').press('Enter');
  assert.equal(await page.locator('#manolo-traditional-note').isVisible(), false);
  assert.equal(await page.locator('#quick-categories button').first().evaluate(node => document.activeElement === node), true);
  assert.equal(await page.evaluate(() => state.mode), 'comida');

  await action('budget').press('Enter');
  assert.equal(await focus(), 'price-scope');
  assert.deepEqual(await page.locator('#price-scope option').evaluateAll(options => options.map(option => option.value)), ['dish', 'meal']);
  assert.equal(await page.locator('#manolo-budget-note').isVisible(), true);
  assert.match(await page.locator('#manolo-budget-note').innerText(), /por plato o por persona.*precios desconocidos/i);
  assert.equal(await page.evaluate(() => state.searched), false);
  await action('compare').press('Enter');
  assert.equal(await focus(), 'dish');
  assert.equal(await page.locator('#manolo-budget-note').isVisible(), false);
  assert.equal(await page.locator('#search-section #manolo-compare-note').isVisible(), true);
  await page.locator('#dish').fill('Salmorejo');
  await action('compare').press('Enter');
  assert.equal(await focus(), 'portion');
  await page.locator('#price-scope').selectOption('meal');
  await action('compare').press('Enter');
  assert.equal(await focus(), 'price-scope');
  await page.locator('#price-scope').selectOption('dish');
  await page.locator('#place-name').fill('La Montillana');
  await page.locator('#portion').selectOption('media');
  await page.locator('#price-kind').selectOption('confirmed');
  await page.locator('#budget').selectOption('10');
  await page.locator('#sort').selectOption('price');
  await page.locator('#include-unknown').uncheck();
  await action('compare').press('Enter');
  assert.equal(await focus(), 'search-button');
  await page.keyboard.press('Enter');
  await action('compare').press('Enter');
  assert.equal(await focus(), 'results-heading');
  assert.equal(await page.locator('#results-section #manolo-compare-note').isVisible(), true);
  const result = page.locator('#results article');
  assert.equal(await result.count(), 1);
  assert.match(await result.locator('.result-main-price').innerText(), /6,90.*Media ración/);
  await result.locator('button[aria-pressed]').first().click();
  const snapshot = () => page.evaluate(() => ({ form: searchFormValues(), mode: state.mode, selected: [...state.selected], term: state.appliedTerm, portion: state.appliedPortion }));
  const before = await snapshot();
  await action('compare').press('Enter');
  assert.equal(await focus(), 'compare-title');
  assert.match(await page.locator('#compare-output .note').first().innerText(), /mismo formato declarado/);
  assert.deepEqual(await snapshot(), before);
  const prices = await page.locator('#compare-output li').allTextContents();
  assert.ok(prices.some(price => /6,90.*Media ración/i.test(price)));
  assert.ok(prices.every(price => !price.includes('9,90')));
  await page.locator('#sort').selectOption('name');
  await action('compare').press('Enter');
  assert.equal(await focus(), 'search-button');
  assert.equal(await page.locator('#sort').inputValue(), 'name');

  await page.locator('#portion').selectOption('racion');
  await page.locator('#search-button').click();
  await action('compare').press('Enter');
  assert.equal(await focus(), 'compare-title');
  const fullPrices = await page.locator('#compare-output li').allTextContents();
  assert.ok(fullPrices.some(price => /9,90.*Ración completa/i.test(price)));
  assert.ok(fullPrices.every(price => !price.includes('6,90')));

  await page.locator('#place-name').fill('Patio Romano');
  await page.locator('#dish').fill('Pizza');
  await page.locator('#budget').selectOption('');
  await page.locator('#price-kind').selectOption('');
  await page.locator('#portion').selectOption('');
  await page.locator('#search-button').click();
  assert.equal(await result.count(), 1);
  assert.equal(await page.locator('#result-format-note').count(), 1);
  await action('compare').press('Enter');
  assert.equal(await focus(), 'portion');
  assert.equal(await page.locator('#compare-output .best-comparable').count(), 0);
  assert.equal(await page.evaluate(() => comparableHighlights([
   { id: 'media', dishPrices: [{ dish: 'Salmorejo', eur: 6.9, portion: 'media' }] },
   { id: 'racion', dishPrices: [{ dish: 'Salmorejo', eur: 9.9, portion: 'racion' }] },
   { id: 'unknown', dishPrices: [{ dish: 'Salmorejo', eur: 4 }] }
  ], 'salmorejo', 'media').size), 0);

  for (const language of ['es', 'fr', 'en', 'es']) {
   const [title, ...labels] = copy[language];
   await page.locator('#language-select').selectOption(language);
   await page.waitForFunction(lang => document.documentElement.lang === lang, language);
   await summary.getByText(title, { exact: true }).waitFor();
   for (const label of labels.slice(0, 4)) await guide.getByRole('button', { name: label, exact: true }).waitFor();
   for (const text of descriptions[language]) await guide.getByText(text, { exact: true }).waitFor();
   await action('budget').press('Enter');
   await page.locator('#manolo-budget-note').filter({ hasText: {es: /Los precios desconocidos/, fr: /Les prix inconnus/, en: /Unknown prices/}[language] }).waitFor();
   await action('traditional').press('Enter');
   assert.equal(await page.locator('#recommendations-heading').innerText(), {
    es: 'Sabores de Córdoba', en: 'Flavours of Córdoba', fr: 'Saveurs de Cordoue'
   }[language]);
   await checkWidth();
  }
  const image = guide.locator('img');
  await image.evaluate(node => node.decode());
  assert.ok(await image.evaluate(node => node.naturalWidth > 0 && node.naturalWidth === node.naturalHeight && getComputedStyle(node).objectFit === 'contain'));
  assert.doesNotMatch(await page.locator('body').innerText(), /datos ficticios|reseñas ficticias|solo prototipo/i);
  assert.ok((await page.locator('script[src]').evaluateAll(nodes => nodes.map(node => node.src))).every(src => !/consejo-manolo|review-engine/i.test(src)));
  assert.deepEqual(errors, []);
  await page.close();
  console.log(profile + ' PASS · cuatro acciones, formatos, contexto, ES/FR/EN, teclado e imagen');
 }
} finally {
 await browser.close();
}
