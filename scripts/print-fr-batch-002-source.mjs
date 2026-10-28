import {readFileSync} from 'node:fs';
const places=JSON.parse(readFileSync('data/places.json','utf8'));
const place=places.find(x=>x.id==='la-montillana');
if(!place)throw Error('La Montillana missing');
const covered=new Set(JSON.parse(readFileSync('translations/fr/batch-001-la-montillana.json','utf8')).entries.map(x=>x.sectionIndex+':'+x.itemIndex));
const next=[];
for(const [sectionIndex,section] of (place.menuSections||[]).entries()){
 for(const [itemIndex,item] of (section.items||[]).entries()){
  if(!item.es?.trim()||covered.has(sectionIndex+':'+itemIndex))continue;
  next.push({placeId:place.id,sectionIndex,itemIndex,name:item.name,es:item.es,en:item.en,section:section.title});
  if(next.length===12)break;
 }
 if(next.length===12)break;
}
console.log('FR-BATCH-002-SOURCE '+JSON.stringify(next));
