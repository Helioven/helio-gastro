import {readFileSync} from 'node:fs';
const p=JSON.parse(readFileSync('data/places.json','utf8'));
let n=0;
for(const place of p)for(const [si,sec] of (place.menuSections||[]).entries())for(const [ii,item] of (sec.items||[]).entries()){
 if(!item.es?.trim()||item.fr?.trim())continue;
 if(n++<15)console.log('TRANSLATION_SOURCE '+JSON.stringify({placeId:place.id,sectionIndex:si,itemIndex:ii,name:item.name,es:item.es,en:item.en}));
}
