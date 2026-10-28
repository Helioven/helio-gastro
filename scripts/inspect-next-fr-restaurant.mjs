import {readFileSync} from 'node:fs';
const data=JSON.parse(readFileSync('data/places.json','utf8'));
for(const p of data){if(['la-montillana','churros-bar-marta'].includes(p.id)||p.name?.includes('Caballo Rojo'))continue;const entries=[];for(const [si,s] of (p.menuSections||[]).entries()){for(const [ii,x] of (s.items||[]).entries()){if(x.es&&x.en)entries.push({sectionIndex:si,itemIndex:ii,name:x.name,es:x.es,en:x.en});}}if(entries.length>0&&entries.length<=20)console.log('FR-NEXT-CANDIDATE '+JSON.stringify({id:p.id,name:p.name,count:entries.length,entries:entries.slice(0,12)}));}
