import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const places=JSON.parse(readFileSync('data/places.json','utf8'));
const glossary=JSON.parse(readFileSync('docs/french-glossary-v1.json','utf8'));
const script=readFileSync('i18n.js','utf8');
const sections=new Map();
for(const entry of glossary.sections){
 assert.equal(typeof entry.es,'string');assert.equal(typeof entry.fr,'string');
 assert.ok(entry.es.trim()&&entry.fr.trim());
 assert.ok(!sections.has(entry.es.trim()),'Duplicate heading: '+entry.es);
 sections.set(entry.es.trim(),entry.fr.trim());
}
let count=0;
for(const place of places)for(const section of place.menuSections||[]){
 assert.ok(sections.has(section.title.trim()),'Missing heading: '+section.title);
 count++;
}
assert.equal(count,314);
assert.ok(script.includes("if(frenchQaEnabled){"));
assert.ok(script.includes("node.parentElement?.matches('[data-venue-menu-section]')"),'French headings must match the element itself, not a dish ancestor');
assert.ok(!script.includes("node.parentElement?.closest('[data-venue-menu-section]')"),'Must never translate dish descendants');
assert.ok(script.includes("language==='fr'"));
assert.ok(script.includes('translateFrenchHeading(node,match[2])'),'French must preserve original spacing of non-section titles');
assert.ok(script.includes('frenchSectionHeadings.get(normalize(source))'),'Only heading lookup may normalize spaces');
assert.ok(script.includes("language==='en'"));
// Run the shipped translator in the Node-only catalog job, with the DOM surface it needs.
const headingParent = { matches: selector => selector === '[data-venue-menu-section]', closest: () => null };
const plainParent = { matches: () => false, closest: () => null };
const protectedDish = { matches: () => false, closest: selector => selector.includes('[data-keep-dish-spanish]') ? {} : null };
const originals = ['Descubre Córdoba a bocados', '  Lo nuestro  ', 'Lo nuestro', 'Lo nuestro'];
const nodes = [plainParent, headingParent, plainParent, protectedDish].map((parentElement,index) => ({
 parentElement, nodeValue: originals[index]
}));
const select = { value: 'es', querySelector: () => ({}), addEventListener() {} };
const document = {
 readyState: 'complete', documentElement: {}, body: {},
 getElementById: id => id === 'language-select' ? select : null,
 querySelector: () => null, querySelectorAll: () => [],
 createTreeWalker: () => { let index = 0; return { nextNode: () => nodes[index++] }; }
};
let observeMutations;
const window = {};
runInNewContext(script, {
 window, document, NodeFilter: { SHOW_TEXT: 4 }, localStorage: { getItem: () => null, setItem() {} },
 fetch: async () => ({ ok: true, json: async () => glossary }),
 MutationObserver: class { constructor(callback) { observeMutations = callback; } observe() {} }
}, { filename: 'i18n.js' });
await new Promise(resolve => setImmediate(resolve));
const actual = () => nodes.map(node => node.nodeValue);
assert.deepEqual(actual(), originals);
function switchLanguage(language) {
 window.HelioGastroLanguage.set(language);
 assert.equal(document.documentElement.lang, language);
 observeMutations(nodes.map(target => ({ type: 'characterData', target })));
}
switchLanguage('fr');
assert.deepEqual(actual(), [
 'Découvrez Cordoue une bouchée à la fois', '  '+sections.get('Lo nuestro')+'  ', 'Lo nuestro', 'Lo nuestro'
], 'French translates the hero and only the marked section, preserving spacing and dish names');
switchLanguage('es');
assert.deepEqual(actual(), originals, 'Spanish restoration must remain supported');
switchLanguage('en');
assert.equal(nodes[0].nodeValue, 'Discover Córdoba one bite at a time');
assert.equal(nodes[1].nodeValue, '  Our specialities  ');
assert.equal(nodes[3].nodeValue, 'Lo nuestro');
switchLanguage('es');
assert.deepEqual(actual(), originals, 'Spanish must also be restored from English');
console.log('FR QA SECTION HEADING CHECK: '+count+'/'+count+' supported; ES/FR/EN rendering and restoration PASS');
