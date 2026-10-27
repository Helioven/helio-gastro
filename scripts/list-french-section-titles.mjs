import {readFileSync} from 'node:fs';
const p=JSON.parse(readFileSync('data/places.json','utf8'));
const g=JSON.parse(readFileSync('docs/french-glossary-v1.json','utf8'));
const known=new Set(g.sections.map(x=>x.es.trim()));
const counts=new Map();
for(const place of p)for(const s of place.menuSections||[]){const t=(s.title||'').trim();if(t&&!known.has(t))counts.set(t,(counts.get(t)||0)+1)}
console.log('UNMATCHED SECTION TITLES '+JSON.stringify([...counts].sort((a,b)=>b[1]-a[1]),null,2));
