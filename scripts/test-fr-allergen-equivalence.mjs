#!/usr/bin/env node
// Read-only ES/FR equivalence regression for explicit allergen declarations
// and gluten/lactose-free statements. The source claims are NOT verified here.
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
const places=JSON.parse(readFileSync('data/places.json','utf8'));
const batches=readdirSync('translations/fr').filter(x=>/^batch-\d+.*\.json$/.test(x)).sort();
const translations=new Map();
for(const file of batches)for(const e of JSON.parse(readFileSync('translations/fr/'+file,'utf8')).entries){
 const key=[e.placeId,e.sectionIndex,e.itemIndex].join('/');
 assert(!translations.has(key),'Duplicate FR target '+key);
 translations.set(key,e.fr);
}
const tokens=[
 ['lácteos','produits laitiers'],
 ['huevo','œuf'],
 ['gluten','gluten'],
 ['frutos secos','fruits à coque'],
 ['sulfitos','sulfites'],
 ['soja','soja'],
 ['mostaza','moutarde'],
 ['apio','céleri'],
 ['sésamo','sésame']
];
const norm=s=>String(s??'').normalize('NFC').toLocaleLowerCase('es');
const results={declarations:0,freeFrom:0,ingredientMentions:0,errors:[],nuances:[]};
for(const p of places)for(const [si,sec] of (p.menuSections||[]).entries())
 for(const [ii,item] of (sec.items||[]).entries()){
  const es=norm(item.es);if(!es)continue;
  const key=[p.id,si,ii].join('/');
  const fr=norm(translations.get(key));
  if(es.includes('alérgenos declarados:')){
   results.declarations++;
   if(!fr.includes('allergènes déclarés :'))
    results.errors.push({key,reason:'Missing explicit declared-allergen attribution'});
   const source=es.split('alérgenos declarados:')[1]||'';
   const target=fr.split('allergènes déclarés :')[1]||'';
   for(const [esTerm,frTerm] of tokens){
    const inSource=source.includes(esTerm),inTarget=target.includes(frTerm);
    if(inSource!==inTarget)
     results.errors.push({key,reason:'Allergen category mismatch',esTerm,frTerm,inSource,inTarget});
   }
   if(source.includes('frutos secos'))
    results.nuances.push({key,reason:'frutos secos → fruits à coque: verify scope against original source; peanuts may require separate category'});
  }else if(es.includes('sin gluten')||es.includes('sin lactosa')){
   results.freeFrom++;
   if(es.includes('sin gluten')&&!fr.includes('sans gluten'))
    results.errors.push({key,reason:'Gluten-free claim missing'});
   if((es.includes('sin lactosa')||/sin gluten (?:y|ni) lactosa/.test(es))&&!fr.includes('lactose'))
    results.errors.push({key,reason:'Lactose-free claim missing'});
   if(es.includes('indicado en carta')&&!fr.includes('indiqué sur la carte'))
    results.errors.push({key,reason:'Source attribution missing for free-from claim'});
  }else if(/(?:marisco|frutos secos)/.test(es))results.ingredientMentions++;
 }
assert.equal(results.declarations,29,'Source declaration inventory changed: review before acceptance');
assert.equal(results.freeFrom,2,'Source free-from inventory changed: review before acceptance');
assert.equal(results.ingredientMentions,5,'Ingredient candidate inventory changed: review before acceptance');
console.log('FR ALLERGEN EQUIVALENCE '+JSON.stringify({status:results.errors.length?'FAIL':'PASS',scope:'ES/FR text equivalence only; NOT allergen safety certification',...results},null,2));
if(results.errors.length)process.exitCode=1;
