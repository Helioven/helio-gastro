import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
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
assert.ok(script.includes("language==='en'"));
assert.ok(script.includes("else if(node.nodeValue!==original)node.nodeValue=original;"),'Spanish restoration must remain supported');
console.log('FR QA SECTION HEADING CHECK: '+count+'/'+count+' supported; ES/EN branches retained (static checks)');
