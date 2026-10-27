import {readFileSync} from 'node:fs';
const places=JSON.parse(readFileSync('data/places.json','utf8'));
const counters={exactDuplicatePrices:0,missingFrenchDescription:0,missingEnglishDescription:0,missingFrenchSectionTitle:0};
const examples={};
function note(k,where){counters[k]++;(examples[k]??=[]);if(examples[k].length<8)examples[k].push(where);}
for(const p of places){
 for(const m of p.menus||[]){
  const seen=new Set();
  for(const r of m.dishPrices||[]){
   if(!r || typeof r!=='object')continue;
   const key=JSON.stringify([r.dish,r.eur,r.portion??null,r.label??null,r.variant??null]);
   if(seen.has(key))note('exactDuplicatePrices',p.id+' / '+m.service+' / '+r.dish);
   seen.add(key);
  }
 }
 for(const s of p.menuSections||[]){
  if((s.titleEn||s.titleFr)&&!s.titleFr)note('missingFrenchSectionTitle',p.id+' / '+s.title);
  for(const item of s.items||[]){
   if(typeof item.es==='string' && item.es.trim()){
    if(!item.en || !String(item.en).trim())note('missingEnglishDescription',p.id+' / '+item.name);
    if(!item.fr || !String(item.fr).trim())note('missingFrenchDescription',p.id+' / '+item.name);
   }
  }
 }
}
console.log('EXPLORATORY QA (informational, not errors): '+JSON.stringify({counters,examples},null,2));
