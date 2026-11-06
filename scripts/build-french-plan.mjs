#!/usr/bin/env node
// Read-only French translation planning. No modifications to restaurant records.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const places=JSON.parse(readFileSync('data/places.json','utf8'));
const glossary=JSON.parse(readFileSync('docs/french-glossary-v1.json','utf8'));
const clean=s=>typeof s==='string'?s.normalize('NFC').trim():'';
const map=new Map((glossary.sections||[]).filter(x=>clean(x.es)&&clean(x.fr)).map(x=>[clean(x.es),clean(x.fr)]));
const report={meta:{kind:'proposal_only',source:'data/places.json',glossary:'docs/french-glossary-v1.json',note:'No translations have been applied to the live catalog; exact section matches require contextual approval.'},proposedSections:[],unmatchedSections:[],missingDescriptions:[]};
for(const place of places)for(const [idx,sec] of (place.menuSections||[]).entries()){
 if(!clean(sec.titleFr)){
  const record={placeId:place.id,sectionIndex:idx,es:sec.title||'',en:sec.titleEn||''};
  const fr=map.get(clean(sec.title));
  if(fr)report.proposedSections.push({...record,proposedFr:fr,status:'needs_context_review'});
  else report.unmatchedSections.push({...record,status:'needs_translation'});
 }
 for(const [j,item] of (sec.items||[]).entries())if(clean(item.es)&&!clean(item.fr))report.missingDescriptions.push({placeId:place.id,sectionIndex:idx,itemIndex:j,dish:item.name||'',es:item.es,en:item.en||'',status:'needs_translation'});
}
mkdirSync('qa-reports',{recursive:true});
writeFileSync('qa-reports/fr-coverage-proposals.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({proposedSections:report.proposedSections.length,unmatchedSections:report.unmatchedSections.length,missingDescriptions:report.missingDescriptions.length,output:'qa-reports/fr-coverage-proposals.json'}));
