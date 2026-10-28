import {readFileSync} from 'node:fs';
const data=JSON.parse(readFileSync('data/places.json','utf8'));
const candidates=[];
for(const p of data){if(['la-montillana','churros-bar-marta'].includes(p.id)||p.name?.includes('Caballo Rojo')||p.hidden)continue;const entries=[];for(const [sectionIndex,s] of (p.menuSections||[]).entries())for(const [itemIndex,item] of (s.items||[]).entries())if(item.es?.trim()&&item.en?.trim())entries.push({sectionIndex,itemIndex,name:item.name,es:item.es,en:item.en});if(entries.length)candidates.push({id:p.id,name:p.name,count:entries.length,entries});}
candidates.sort((a,b)=>a.count-b.count||a.id.localeCompare(b.id));
console.log('FR-NEXT-INVENTORY '+JSON.stringify(candidates.map(x=>({id:x.id,name:x.name,count:x.count}))));
const done=new Set(['la-montillana','churros-bar-marta','cafeteria-bar-la-jineta','la-tarterie-centro','taberna-el-abuelo','taberna-la-viuda','casa-rubio','taberna-el-numero-10']);
for(const p of candidates.filter(x=>x.id==='taberna-plateros-san-francisco'))console.log('FR-NEXT-CANDIDATE '+JSON.stringify({id:p.id,name:p.name,count:p.count,entries:p.entries.slice(12,24)}));
