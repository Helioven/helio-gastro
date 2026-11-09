import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const labels = {
 es: ['Buscar', 'Desayunar', 'Guardar', 'Ver mapa', 'Imagen ilustrativa'],
 en: ['Search', 'Breakfast', 'Save', 'View map', 'Illustrative image'],
 fr: ['Rechercher', 'Petit-déjeuner', 'Enregistrer', 'Voir la carte', 'Image illustrative']
};
try {
 for (const [width,height] of [[360,800],[1365,900]]) {
  const page = await browser.newPage({ viewport: { width,height }, hasTouch: width === 360 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:8765/index.html');
  await page.waitForFunction(() => state.places.length === 43);
  const checkWidth = async () => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  const checkIcon = async node => {
   const svg = node.locator('svg.ui-icon');
   await svg.waitFor();
   assert.equal(await svg.getAttribute('aria-hidden'), 'true');
   assert.equal(await svg.getAttribute('focusable'), 'false');
   const use = await svg.locator('use').elementHandle();
   await page.waitForFunction(symbol => {
    const {width,height}=symbol.getBBox();
    return width>0||height>0;
   }, use);
  };
  const checkContrast = async locator => {
   const ratio = await locator.evaluate(node => {
    const linear = value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
    const luminance = color => color.match(/\d+/g).slice(0,3).reduce((sum,part,i) => sum + linear(Number(part)/255)*[.2126,.7152,.0722][i],0);
    const css=getComputedStyle(node);
    const fg=luminance(css.color),bg=luminance(css.backgroundColor);
    return (Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05);
   });
   assert.ok(ratio >= 4.5, String(ratio));
  };
  assert.equal(await page.locator('#nav-compare').isVisible(), false);
  const guide = page.locator('.manolo-guide');
  if (!await guide.evaluate(node => node.open)) await guide.locator('summary').press('Enter');
  for (const option of await guide.locator('[data-manolo-action]').all()) await checkIcon(option);
  await page.locator('#dish').fill('Flamenquín');
  await page.locator('#search-button').press('Enter');
  const card = page.locator('#results article').first();
  await card.waitFor();
  for (const lang of ['es','fr','en','es']) {
   const [search, breakfast, save, map, illustration] = labels[lang];
   await page.locator('#language-select').selectOption(lang);
   await checkIcon(page.locator('#quick-nav').getByRole('link',{name:search,exact:true}));
   await checkIcon(page.locator('.service-selector').getByRole('button',{name:breakfast,exact:true}));
   await checkIcon(card.getByRole('button',{name:save,exact:true}));
   await checkIcon(card.getByRole('button',{name:map,exact:true}));
   assert.equal(await page.locator('#result-dish-visual .dish-visual-label').textContent(),illustration);
   for (const control of [page.locator('#search-button'), card.locator('.detail-button'),card.locator('.fav-button'),card.locator('.map-button')]) {
    const size=await control.boundingBox();
    assert.ok(size.width>=44&&size.height>=44);
    await checkContrast(control);
   }
   await checkWidth();
  }
  const compare=card.getByRole('button',{name:'Comparar',exact:true});
  await compare.press('Enter');
  const selected=card.getByRole('button',{name:'Quitar del comparador',exact:true});
  assert.equal(await selected.getAttribute('aria-pressed'),'true');
  await checkIcon(selected);
  await checkContrast(selected);
  await card.locator('.detail-button').press('Enter');
  await page.locator('.venue-hours').waitFor();
  await checkWidth();
  const sources=page.locator('.venue-hours summary').last();
  await sources.press('Enter');
  assert.ok(await sources.evaluate(node=>node.matches(':focus-visible')));
  assert.ok(await sources.evaluate(node=>node.parentElement.open));
  await page.locator('#detail-content .map-button').press('Enter');
  await page.locator('#map-dialog').waitFor();
  await checkIcon(page.locator('#close-map'));
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#map-dialog').isVisible(),false);
  await page.locator('#close-detail').press('Enter');
  assert.equal(await page.locator('#results-heading').evaluate(node=>node===document.activeElement),true);
  assert.deepEqual(errors,[]);
  await page.close();
  console.log(width+' PASS · SVG, controles ES/FR/EN, foco, contraste y objetivos táctiles');
 }
} finally {
 await browser.close();
}
