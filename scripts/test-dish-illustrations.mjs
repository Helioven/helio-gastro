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
    const tapas = cards.filter({has:page.locator('img[data-card-illustration="tapas"]')});
    const tapasCounts = {
      es:'13 locales registrados · 13 con precio',
      en:'13 places listed · 13 with prices',
      fr:'13 établissements répertoriés · 13 avec prix'
    };
    for (const [mode, names] of expectedCards) {
      await page.locator('[data-service="'+mode+'"]').click();
      const expected = names.split(' ').map(name => './assets/dishes/'+name+'.webp');
      assert.equal(await cards.count(), expected.length);
      const images = cards.locator('.dish-visual img');
      assert.deepEqual(await images.evaluateAll(nodes => nodes.map(image => image.getAttribute('src'))), expected);
      await images.evaluateAll(nodes => Promise.all(nodes.map(image => image.decode())));
      for (const [language, label] of [['es','Imagen ilustrativa'],['en','Illustrative image'],['fr','Image illustrative']]) {
        await page.locator('#language-select').selectOption(language);
        assert.equal(await tapas.count(),mode==='cena'?1:0);
        if(mode==='cena')assert.equal(await tapas.locator(':scope > span:not(.dish-visual)').textContent(),tapasCounts[language]);
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
    await page.locator('[data-service="cena"]').click();
    await tapas.click();
    assert.equal(await page.locator('#recommendation-results .recommendation-place').count(),13);
    const conAcento = page.locator('#recommendation-results .recommendation-place').filter({hasText:'Con Acento'});
    assert.equal(await conAcento.locator('li').count(),7,'The documented tapas menu should be included');
    assert.equal(await conAcento.locator('h5').textContent(),'Tapas sin clasificación de temperatura');
    const compareButtons = page.locator('#recommendation-results [data-compare-place-id]');
    await compareButtons.nth(0).click();
    await compareButtons.nth(1).click();
    await page.keyboard.press('Escape');
    const compare = page.locator('#compare-output');
    for(const [language,prompt] of [
      ['es','Elige un plato concreto para comparar sus precios.'],
      ['fr','Choisissez un plat précis pour comparer ses prix.'],
      ['en','Choose a specific dish to compare its prices.'],
      ['es','Elige un plato concreto para comparar sus precios.']
    ]){
      await page.locator('#language-select').selectOption(language);
      assert.equal(await compare.getByRole('status').textContent(),prompt);
      assert.equal(await compare.locator('li:visible').count(),0);
      assert.equal(await compare.locator('#compare-tapa-format').isDisabled(),true);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    }
    await page.evaluate(() => {
      state.places = state.places.filter(place=>state.selected.has(place.id)).map((place,index)=>normalizePlace({...place,menus:[
        {service:'Tapas frías',dishes:['Tapa de tortilla'],dishPrices:[
          {dish:'Tapa de tortilla',eur:4+index,portion:'tapa'},
          {dish:'Tapa de tortilla',eur:8+index,portion:index?'tapa (3 uds.)':'tapa (2 uds.)'}
        ]},
        {service:'Tapas calientes',dishes:['Albóndigas'],dishPrices:[{dish:'Albóndigas',eur:7,portion:'tapa'}]},
        {service:'general',dishes:['Ensaladilla'],dishPrices:[{dish:'Ensaladilla',eur:6,portion:'tapa'}]}
      ]}));
      compare();
    });
    await tapas.click();
    for(const [language,headings] of [
      ['fr',['Tapas froides','Tapas chaudes','Tapas sans température documentée']],
      ['en',['Cold tapas','Hot tapas','Tapas with no documented temperature']],
      ['es',['Tapas frías','Tapas calientes','Tapas sin clasificación de temperatura']]
    ]){
      await page.evaluate(language=>window.HelioGastroLanguage.set(language),language);
      assert.deepEqual(await page.locator('.recommendation-place').first().locator('h5').allTextContents(),headings);
    }
    await page.keyboard.press('Escape');
    await compare.locator('#compare-tapa-dish').selectOption('tapa de tortilla');
    assert.deepEqual(await compare.locator('#compare-tapa-format option').evaluateAll(options=>options.map(option=>option.value)),['','tapa']);
    assert.equal(await compare.locator('li:visible').count(),0);
    await compare.locator('#compare-tapa-format').selectOption('tapa');
    assert.deepEqual((await compare.locator('li:visible').allTextContents()).map(value=>Number.parseInt(value,10)),[4,5]);

    await page.evaluate(() => {
      const place = state.places[0];
      state.places = [normalizePlace({...place, menus:[
        {service:'comida', dishes:['Tapa de tortilla'], dishPrices:[]},
        {service:'cena', dishes:['Croquetas'], dishPrices:[{dish:'Croquetas',eur:9,portion:'racion'}]},
        {service:'tapas', dishes:['Gilda'], dishPrices:[{dish:'Gilda',eur:3}]}
      ]})];
    });
    await page.locator('[data-service="comida"]').click();
    assert.deepEqual(await page.evaluate(() => [tapasEntries().matches.length,tapasEntries().priced.length]),[1,0]);
    await page.locator('[data-service="cena"]').click();
    assert.equal(await tapas.count(),0,'A full portion and an out-of-context menu must not create a tapas card');
    assert.equal(await cards.filter({has:page.locator('img[data-card-illustration="tapas y raciones"]')}).count(),1);
    await page.close();
  }
  console.log('PASS: 17 distinct cards, tapas evidence and empty state, exact result rules, ES/EN/FR and responsive framing');
} finally {
  await browser.close();
}
