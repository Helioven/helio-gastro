import {readFileSync} from 'node:fs';
const data=JSON.parse(readFileSync('data/places.json','utf8'));
const targets=new Set(['Para gozar','Curaciones del valle y marinas','Mantequeando','De la Confi del Abuelo','Rodeado de Gitanillas','Cordobesa','Muy cordobés','Molletes de bandera']);
const results=[];
for(const p of data)for(const s of p.menuSections||[])if(targets.has(s.title)){
 results.push({restaurant:p.name,id:p.id,title:s.title,itemCount:s.items?.length||0,examples:(s.items||[]).slice(0,6).map(x=>({name:x.name,es:x.es,en:x.en}))});
}
console.log('FR-SECTION-CONTEXT '+JSON.stringify(results));
console.log('FR-SECTION-CONTEXT-COUNT '+results.length);
if(results.length!==8)process.exitCode=1;
