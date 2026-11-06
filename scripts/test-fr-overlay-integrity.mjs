#!/usr/bin/env node
// Integrity gate for a proposed French-only overlay, without writing data/places.json.
// Fails if any approved source field changes, or a candidate points at an invalid item.
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
const places=JSON.parse(readFileSync('data/places.json','utf8'));
const files=readdirSync('translations/fr').filter(f=>/^batch-\d+.*\.json$/.test(f)).sort();
const batch={entries:files.flatMap(f=>JSON.parse(readFileSync('translations/fr/'+f,'utf8')).entries)};
const clone=x=>JSON.parse(JSON.stringify(x));
function overlay(data, entries) {
  const output=clone(data), seen=new Set();
  for(const e of entries){
    const key=[e.placeId,e.sectionIndex,e.itemIndex].join('/');
    assert(!seen.has(key),'duplicate translation target: '+key);seen.add(key);
    const place=output.find(p=>p.id===e.placeId);
    assert(place,'missing restaurant '+key);
    const item=place.menuSections?.[e.sectionIndex]?.items?.[e.itemIndex];
    assert(item?.es && item?.en,'missing ES/EN source: '+key);
    assert(typeof e.fr==='string'&&e.fr.trim(),'blank French: '+key);
    assert(!item.fr || item.fr===e.fr,'existing French differs: '+key);
    item.fr=e.fr;
  }
  return output;
}
const updated=overlay(places,batch.entries);
assert.equal(updated.length,places.length);
function removeFrOnly(after,before) {
  if(Array.isArray(before))return after.map((v,i)=>removeFrOnly(v,before[i]));
  if(before&&typeof before==='object'){
    const result={};
    for(const k of Object.keys(before)){
      assert(Object.prototype.hasOwnProperty.call(after,k),'removed field '+k);
      result[k]=removeFrOnly(after[k],before[k]);
    }
    return result;
  }
  return after;
}
assert.deepEqual(removeFrOnly(updated,places),places,'protected catalog fields were modified');
let injected=0;
for(const [i,p] of places.entries())for(const [j,s] of (p.menuSections||[]).entries())for(const [k,item] of (s.items||[]).entries())if(updated[i].menuSections?.[j]?.items?.[k]?.fr!==item.fr)injected++;
assert.equal(injected,batch.entries.length,'unexpected number of edits');
const numbers=s=>(String(s).match(/\d+(?:[.,]\d+)*/g)||[]).sort();
for(const e of batch.entries){
 const item=places.find(x=>x.id===e.placeId).menuSections[e.sectionIndex].items[e.itemIndex];
 assert.deepEqual(numbers(item.es),numbers(e.fr),'numeric discrepancy at '+e.placeId+'/'+e.sectionIndex+'/'+e.itemIndex);
}
// Negative tests: these are expected to fail.
assert.throws(()=>overlay(places,[{...batch.entries[0],itemIndex:999}]));
assert.throws(()=>overlay(places,[batch.entries[0],batch.entries[0]]));
assert.throws(()=>overlay(places,[{...batch.entries[0],fr:''}]));
console.log(JSON.stringify({status:'PASS',translationsChecked:batch.entries.length,proposedFieldsChanged:injected,protectedFieldsChanged:0,negativeTests:3,writesToCatalog:0}));
