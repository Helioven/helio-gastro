#!/usr/bin/env node
// Helio Gastro: read-only ES/FR translation integrity checks.
// Reports only; does not translate or modify menu data.
import { readFileSync } from 'node:fs';
const places = JSON.parse(readFileSync('data/places.json', 'utf8'));
const normalize = s => String(s ?? '').normalize('NFC');
const numbers = s => (normalize(s).match(/\d+(?:[.,]\d+)*/g) || []).map(v => v.replace(',', '.')).sort();
const same = (a,b) => JSON.stringify(a)===JSON.stringify(b);
const results={checkedFrenchDescriptions:0,numericMismatches:[],sameAsSpanish:[],missingFrenchDescriptions:0,reviewRequired:[]};
for (const place of places) for (const [sectionIndex,section] of (place.menuSections||[]).entries()) {
 for (const [itemIndex,item] of (section.items||[]).entries()){
  if (!item || typeof item.es !== 'string' || !item.es.trim()) continue;
  const location={placeId:place.id,sectionIndex,itemIndex,dish:item.name||''};
  if (!item.fr || !String(item.fr).trim()) {results.missingFrenchDescriptions++;continue;}
  results.checkedFrenchDescriptions++;
  if(!same(numbers(item.es),numbers(item.fr)))results.numericMismatches.push({...location,esNumbers:numbers(item.es),frNumbers:numbers(item.fr)});
  if(normalize(item.es).trim()===normalize(item.fr).trim())results.sameAsSpanish.push(location);
  if (/\b(?:sin gluten|celiac[oa]s?|al[eé]rgenos?|trazas)\b/i.test(item.es)) results.reviewRequired.push({...location,reason:'dietary/allergen claim requires manual review'});
 }
}
console.log('FR TRANSLATION INTEGRITY (nonblocking): '+JSON.stringify({checkedFrenchDescriptions:results.checkedFrenchDescriptions,missingFrenchDescriptions:results.missingFrenchDescriptions,numericMismatches:results.numericMismatches.length,unchangedDescriptions:results.sameAsSpanish.length,dietaryReview:results.reviewRequired.length,examples:{numericMismatches:results.numericMismatches.slice(0,10),unchangedDescriptions:results.sameAsSpanish.slice(0,10),dietaryReview:results.reviewRequired.slice(0,10)}},null,2));
