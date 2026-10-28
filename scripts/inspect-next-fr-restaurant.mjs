import {readFileSync,readdirSync,mkdirSync,writeFileSync} from 'node:fs';

const data=JSON.parse(readFileSync('data/places.json','utf8'));
const translated=new Map();
for(const file of readdirSync('translations/fr').filter(name=>/^batch-\d+.*\.json$/.test(name))){
 const batch=JSON.parse(readFileSync('translations/fr/'+file,'utf8'));
 for(const item of batch.entries||[]){
  if(!item.placeId||!Number.isInteger(item.sectionIndex)||!Number.isInteger(item.itemIndex)||!item.fr?.trim())continue;
  const keys=translated.get(item.placeId)||new Set();
  keys.add(item.sectionIndex+':'+item.itemIndex);
  translated.set(item.placeId,keys);
 }
}
const candidates=[];
for(const p of data){
 if(p.hidden||p.name?.includes('Caballo Rojo'))continue;
 const entries=[];
 for(const [sectionIndex,section] of (p.menuSections||[]).entries())
  for(const [itemIndex,item] of (section.items||[]).entries())
   if(item.es?.trim()&&item.en?.trim())entries.push({sectionIndex,itemIndex,name:item.name,es:item.es,en:item.en});
 if(!entries.length)continue;
 const covered=translated.get(p.id)||new Set();
 const pending=entries.filter(item=>!covered.has(item.sectionIndex+':'+item.itemIndex));
 candidates.push({id:p.id,name:p.name,count:entries.length,covered:entries.length-pending.length,pending});
}
candidates.sort((a,b)=>a.pending.length-b.pending.length||a.id.localeCompare(b.id));
console.log('FR-COVERAGE-INVENTORY '+JSON.stringify(candidates.map(({id,name,count,covered,pending})=>({id,name,count,covered,pending:pending.length}))));
const next=candidates.find(p=>p.pending.length>0);
console.log('FR-NEXT-CANDIDATE '+JSON.stringify(next?{id:next.id,name:next.name,count:next.count,covered:next.covered,pendingCount:next.pending.length,entries:next.pending.slice(0,12)}:null));

mkdirSync('qa-reports',{recursive:true});
writeFileSync('qa-reports/fr-next-restaurant.json',JSON.stringify({
 source:'data/places.json + translations/fr batches',catalogModified:false,
 next:next?{id:next.id,name:next.name,count:next.count,covered:next.covered,pendingCount:next.pending.length,entries:next.pending}:null,
 summary:candidates.map(({id,name,count,covered,pending})=>({id,name,count,covered,pending:pending.length}))
},null,2)+'\n');
