import {readFileSync} from 'node:fs';import assert from 'node:assert/strict';
const html=readFileSync('qa-fr-la-montillana.html','utf8');
const data=JSON.parse(readFileSync('data/places.json','utf8'));
const batch=JSON.parse(readFileSync('translations/fr/batch-001-la-montillana.json','utf8'));
const place=data.find(x=>x.id==='la-montillana');
assert(place);assert.equal(batch.entries.length,15);
assert(html.includes('value="es"')&&html.includes('value="en"')&&html.includes('value="fr"'));
assert(html.includes("language==='fr'?x.fr:(language==='en'?item.en:item.es)"));
assert(html.includes('textContent=')&&!html.includes('innerHTML='));
for(const x of batch.entries){assert.equal(x.placeId,place.id);const i=place.menuSections[x.sectionIndex]?.items[x.itemIndex];assert(i?.es&&i?.en&&x.fr)}
console.log(JSON.stringify({status:'PASS',uiModes:['es','en','fr'],batchEntries:15,sourceDataReadOnly:true,checks:'static integration and references; browser visual QA pending'}));
