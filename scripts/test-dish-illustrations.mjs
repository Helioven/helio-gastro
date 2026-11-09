import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const expectedCards = [
  [
    "comida",
    "flamenquin salmorejo rabo-de-toro croquetas mazamorra carrillada-con-patatas berenjenas-con-miel pisto-cordobes pescados-y-mariscos carnes-y-asados bocadillos-y-sandwiches guisos-y-cocina-tradicional verduras-y-ensaladas tapas-y-raciones postres-y-dulces"
  ],
  [
    "cena",
    "tapas flamenquin croquetas tortilla-de-patatas rabo-de-toro salmorejo pescados-y-mariscos carnes-y-asados bocadillos-y-sandwiches guisos-y-cocina-tradicional verduras-y-ensaladas tapas-y-raciones postres-y-dulces"
  ]
];
const filenames = ['flamenquin', 'salmorejo', 'rabo-de-toro', 'berenjenas-con-miel', 'mazamorra',
  'croquetas', 'tortilla-de-patatas', 'boquerones-fritos', 'huevos-rotos', 'hamburguesa',
  'pizza', 'cachopo', 'ensaladilla-rusa', 'nachos', 'tarta-de-queso', 'carrillada-con-patatas', 'pisto-cordobes',
  'pescados-y-mariscos','carnes-y-asados','bocadillos-y-sandwiches','guisos-y-cocina-tradicional',
  'verduras-y-ensaladas','tapas-y-raciones','postres-y-dulces','tapas'];
for (const name of filenames) {
  const bytes = readFileSync(`assets/dishes/${name}.webp`);
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
  assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
}

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
try {
  for (const config of [{ viewport: { width: 1365, height: 900 } }, { viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true }]) {
    const page = await browser.newPage(config);
    await page.goto('http://127.0.0.1:8765/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => typeof state !== 'undefined' && state.places.length > 0);
    const cards = page.locator('.recommendation-tile');
    for (const [mode, names] of expectedCards) {
      await page.locator('[data-service="'+mode+'"]').click();
      const expected = names.split(' ').map(name => './assets/dishes/'+name+'.webp');
      assert.equal(await cards.count(), expected.length);
      const images = cards.locator('.dish-visual img');
      assert.deepEqual(await images.evaluateAll(nodes => nodes.map(image => image.getAttribute('src'))), expected);
      await images.evaluateAll(nodes => Promise.all(nodes.map(image => image.decode())));
      for (const [language, label] of [['es','Imagen ilustrativa'],['en','Illustrative image'],['fr','Image illustrative']]) {
        await page.locator('#language-select').selectOption(language);
        assert.deepEqual(await cards.locator('.dish-visual-label').allTextContents(), Array(expected.length).fill(label));
        const alts = await cards.locator('[data-card-illustration]').evaluateAll((nodes, language) =>
          nodes.map(image => [image.alt, CARD_ILLUSTRATIONS[image.dataset.cardIllustration].alt[language]]), language);
        assert.ok(alts.length >= 8 && alts.every(([actual, wanted]) => actual && actual === wanted));
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      }
      const ratios = await cards.locator('.category-visual').evaluateAll(nodes => nodes.map(visual =>
        [visual.classList.contains('category-visual-wide'), visual.clientWidth / visual.clientHeight]));
      assert.ok(ratios.every(([wide, ratio]) => Math.abs(ratio - (wide ? 16/9 : 4/3)) < .035));
      await page.locator('#language-select').selectOption('es');
      if(process.argv[2]) await page.locator('#recommendations-section').screenshot({
        path:join(process.argv[2],(config.isMobile?'movil':'escritorio')+'-'+mode+'.png')
      });
    }
    await page.locator('[data-service="comida"]').click();
    const resultImage=page.locator('#result-dish-visual img');
    async function search(dish,place='') {
      await page.locator('#dish').fill(dish);
      await page.locator('#place-name').fill(place);
      await page.locator('#search-button').click();
    }
    for (const [dish,place,file] of [
      ['Carrillada Ibérica con Patatas Fritas','El Poema','carrillada-con-patatas'],
      ['Pisto cordobés','La Cazuela','pisto-cordobes']
    ]) {
      await search(dish,place);
      assert.equal(await resultImage.getAttribute('src'),`./assets/dishes/${file}.webp`);
      await resultImage.evaluate(image=>image.decode());
      for (const [language,label] of [['es','Imagen ilustrativa'],['en','Illustrative image'],['fr','Image illustrative']]) {
        await page.locator('#language-select').selectOption(language);
        assert.equal(await page.locator('#result-dish-visual .dish-visual-label').textContent(),label);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
      }
      await page.locator('#language-select').selectOption('es');
      if(process.argv[2]) await page.screenshot({path:join(process.argv[2],`${file}-${config.isMobile?'movil':'escritorio'}.png`)});
    }
    for(const [dish,place] of [['Pisto cordobés',''],['Pisto',''],['Pisto con huevo',''],['Carrillada',''],['Carrillada de ternera',''],['Pisto cordobés','local inexistente'],['Pescados y mariscos',''],['Tapas','']]){
      await search(dish,place);
      assert.equal(await resultImage.count(),0,`Asociación inesperada para ${dish} / ${place}`);
    }
    await page.close();
  }
  console.log('PASS: 17 distinct cards, exact result rules, ES/EN/FR and responsive framing');
} finally {
  await browser.close();
}
