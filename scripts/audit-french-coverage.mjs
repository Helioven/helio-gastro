import {readFileSync} from 'node:fs';
const places=JSON.parse(readFileSync('data/places.json','utf8'));
const glossary=JSON.parse(readFileSync('docs/french-glossary-v1.json','utf8'));
const norm=x=>String(x??'').normalize('NFC').trim();
const sectionsMap=new Map((glossary.sections||[]).map(x=>[norm(x.es),x.fr]));
const data={sections:{missing:0,exactGlossary:0,notInGlossary:0,alreadyFrench:0},descriptions:{missing:0,alreadyFrench:0},examples:{sectionUnmatched:[],sectionMatched:[],descriptionMissing:[]}};
for(const p of places){
  for(const section of p.menuSections||[]){
    if(section.titleFr?.trim()){data.sections.alreadyFrench++;} else if(section.titleEn||section.title){
      data.sections.missing++;
      const fr=sectionsMap.get(norm(section.title));
      if(fr){data.sections.exactGlossary++;if(data.examples.sectionMatched.length<12)data.examples.sectionMatched.push({place:p.id,es:section.title,fr});}
      else {data.sections.notInGlossary++;if(data.examples.sectionUnmatched.length<20)data.examples.sectionUnmatched.push({place:p.id,es:section.title});}
    }
    for(const item of section.items||[]){
      if(!item.es?.trim())continue;
      if(item.fr?.trim())data.descriptions.alreadyFrench++;
      else {data.descriptions.missing++;if(data.examples.descriptionMissing.length<12)data.examples.descriptionMissing.push({place:p.id,dish:item.name});}
    }
  }
}
console.log('FRENCH COVERAGE — REPORT ONLY, NO DATA CHANGES\n'+JSON.stringify(data,null,2));
