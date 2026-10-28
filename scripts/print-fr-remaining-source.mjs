import {readFileSync} from 'node:fs';
const places=JSON.parse(readFileSync('data/places.json','utf8'));
const place=places.find(x=>x.id==='la-montillana');
const covered=new Set(['batch-001-la-montillana.json','batch-002-la-montillana.json'].flatMap(f=>JSON.parse(readFileSync('translations/fr/'+f,'utf8')).entries).map(x=>x.sectionIndex+':'+x.itemIndex));
const remaining=[];
for(const [sectionIndex,section] of place.menuSections.entries())for(const [itemIndex,item] of section.items.entries())if(item.es?.trim()&&!covered.has(sectionIndex+':'+itemIndex))remaining.push({placeId:place.id,sectionIndex,itemIndex,name:item.name,es:item.es,en:item.en,section:section.title});
console.log('FR-REMAINING '+JSON.stringify({count:remaining.length,next:remaining.slice(0,15)}));
