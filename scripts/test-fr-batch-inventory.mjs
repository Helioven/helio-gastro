import {readdirSync,readFileSync} from 'node:fs';
const filenames=readdirSync('translations/fr').filter(name=>name.startsWith('batch-')&&name.endsWith('.json')).sort();
const seen=new Set(),issues=[];
for(const name of filenames){
 const batch=JSON.parse(readFileSync('translations/fr/'+name,'utf8'));
 if(batch.meta?.language!=='fr'||batch.meta?.catalogModified!==false)issues.push(name+': candidate metadata invalid');
 for(const entry of batch.entries||[]){
  const key=entry.placeId+':'+entry.sectionIndex+':'+entry.itemIndex;
  if(seen.has(key))issues.push(name+': duplicated candidate target '+key);
  seen.add(key);
  if(typeof entry.fr!=='string'||!entry.fr.trim())issues.push(name+': missing translation '+key);
 }
}
console.log(JSON.stringify({status:issues.length?'FAIL':'PASS',batches:filenames.length,targets:seen.size,issues,catalogModified:false},null,2));
if(issues.length)process.exitCode=1;
