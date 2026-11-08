import { chromium, devices } from 'playwright';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const filenames = ['flamenquin', 'salmorejo', 'rabo-de-toro', 'berenjenas-con-miel', 'mazamorra',
  'croquetas', 'tortilla-de-patatas', 'boquerones-fritos', 'huevos-rotos', 'hamburguesa',
  'pizza', 'cachopo', 'ensaladilla-rusa', 'nachos', 'tarta-de-queso', 'carrillada-con-patatas', 'pisto-cordobes'];
for (const name of filenames) {
  const bytes = readFileSync(`assets/dishes/${name}.webp`);
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
  assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
}

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
try {
  for (const config of [{ viewport: { width: 1365, height: 900 } }, devices['iPhone 13']]) {
    const page = await browser.newPage(config);
    await page.goto('http://127.0.0.1:8765/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => typeof state !== 'undefined' && state.places.length > 0);
    await page.locator('[data-service="comida"]').click();
    const images = page.locator('.recommendation-tile .dish-visual img');
    assert.equal(await images.count(), 6);
    await images.evaluateAll(nodes => Promise.all(nodes.map(image => image.decode())));
    for (const [language, label] of [['es', 'Imagen ilustrativa'], ['en', 'Illustrative image'], ['fr', 'Image illustrative']]) {
      await page.locator('#language-select').selectOption(language);
      assert.deepEqual(await page.locator('.dish-visual-label').allTextContents(), Array(6).fill(label));
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    await page.locator('[data-service="cena"]').click();
    assert.equal(await page.locator('.recommendation-tile .dish-visual img').count(), 5);
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
    for(const [dish,place] of [['Pisto cordobés',''],['Pisto',''],['Pisto con huevo',''],['Carrillada',''],['Carrillada de ternera',''],['Pisto cordobés','local inexistente']]){
      await search(dish,place);
      assert.equal(await resultImage.count(),0,`Asociación inesperada para ${dish} / ${place}`);
    }
    await page.close();
  }
  console.log('PASS: shared dish illustrations, ES/EN/FR labels, dinner and mobile layout');
} finally {
  await browser.close();
}
