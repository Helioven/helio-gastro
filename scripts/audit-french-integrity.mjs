#!/usr/bin/env node
// Read-only inventory of French candidate batches; never treats the unmodified ES/EN
// catalog as missing French. Structural integrity is enforced separately by
// validate-french-batch.mjs and test-fr-overlay-integrity.mjs.
import {readFileSync,readdirSync} from 'node:fs';
const places=JSON.parse(readFileSync('data/places.json','utf8'));
const byId=new Map(places.map(p=>[p.id,p]));
const files=readdirSync('translations/fr').filter(f=>/^batch-\d+.*\.json$/.test(f)).sort();
const numbers=s=>(String(s??'').normalize('NFC').match(/\d+(?:[.,]\d+)*/g)||[]).map(v=>v.replace(',', '.')).sort();
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const keyOf=(id,si,ii)=>id+'/'+si+'/'+ii;
const entries=new Map(),duplicateTargets=[];
for(const file of files){
 const batch=JSON.parse(readFileSync('translations/fr/'+file,'utf8'));
 for(const e of batch.entries||[]){
  const key=keyOf(e.placeId,e.sectionIndex,e.itemIndex);
  if(entries.has(key))duplicateTargets.push({key,file});
  entries.set(key,{...e,file});
 }
}
const results={
 checkedFrenchDescriptions:0,
 missingFrenchDescriptions:0,
 numericMismatches:[],
 unchangedDescriptions:[],
 dietaryReview:[],
 invalidTargets:[],
 duplicateTargets,
 coverageByVenue:[]
};
for(const place of places){
 let applicable=0,covered=0;
 for(const [sectionIndex,section] of (place.menuSections||[]).entries())
  for(const [itemIndex,item] of (section.items||[]).entries()){
   if(typeof item?.es!=='string'||!item.es.trim())continue;
   applicable++;
   const key=keyOf(place.id,sectionIndex,itemIndex),entry=entries.get(key);
   if(!entry?.fr?.trim()){results.missingFrenchDescriptions++;continue;}
   covered++;results.checkedFrenchDescriptions++;
   const location={placeId:place.id,sectionIndex,itemIndex,dish:item.name||''};
   if(!equal(numbers(item.es),numbers(entry.fr)))
    results.numericMismatches.push({...location,esNumbers:numbers(item.es),frNumbers:numbers(entry.fr)});
   if(item.es.normalize('NFC').trim()===entry.fr.normalize('NFC').trim())
    results.unchangedDescriptions.push(location);
   // This is a candidate for human/AI review, NOT a demonstrated allergy error.
   if(/\b(?:sin gluten|cel[ií]ac[oa]s?|al[eé]rgenos?|trazas|frutos secos|cacahuetes|marisco|crust[aá]ceos)\b/i.test(item.es))
    results.dietaryReview.push({...location,es:item.es,fr:entry.fr,reason:'Dietary/allergen language needs contextual review'});
  }
 if(applicable)results.coverageByVenue.push({id:place.id,applicable,covered});
}
for(const [key,e] of entries){
 const source=byId.get(e.placeId)?.menuSections?.[e.sectionIndex]?.items?.[e.itemIndex];
 if(!source?.es?.trim())results.invalidTargets.push({key,file:e.file});
}
const outcome={
 status:(results.missingFrenchDescriptions||results.numericMismatches.length||results.invalidTargets.length||results.duplicateTargets.length)?'REVIEW':'PASS',
 source:'translations/fr/batch-*.json (candidate overlay, read only)',
 candidateBatches:files.length,
 checkedFrenchDescriptions:results.checkedFrenchDescriptions,
 missingFrenchDescriptions:results.missingFrenchDescriptions,
 numericMismatches:results.numericMismatches.length,
 unchangedDescriptions:results.unchangedDescriptions.length,
 dietaryReview:results.dietaryReview.length,
 invalidTargets:results.invalidTargets.length,
 duplicateTargets:results.duplicateTargets.length,
 examples:{
  numericMismatches:results.numericMismatches.slice(0,10),
  unchangedDescriptions:results.unchangedDescriptions.slice(0,10),
  dietaryReview:results.dietaryReview.slice(0,20),
  invalidTargets:results.invalidTargets.slice(0,10)
 }
};
console.log('FR TRANSLATION INTEGRITY (nonblocking): '+JSON.stringify(outcome,null,2));
