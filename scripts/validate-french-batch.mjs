import {readFileSync,readdirSync} from 'node:fs';
const places=JSON.parse(readFileSync('data/places.json','utf8'));
const files=readdirSync('translations/fr').filter(f=>/^batch-\d+.*\.json$/.test(f)).sort();
let issues=[],seen=new Set(),total=0;
for(const filename of files){
 const batch=JSON.parse(readFileSync('translations/fr/'+filename,'utf8'));
 for(const x of batch.entries||[]){
  total++;
  const key=[x.placeId,x.sectionIndex,x.itemIndex].join(':');
  if(seen.has(key))issues.push(key+' duplicated across batches');
  seen.add(key);
  const place=places.find(a=>a.id===x.placeId),item=place?.menuSections?.[x.sectionIndex]?.items?.[x.itemIndex];
  if(!item?.es?.trim()||!item?.en?.trim())issues.push(key+' ES/EN source missing');
  if(typeof x.fr!=='string'||!x.fr.trim())issues.push(key+' French missing');
  const nums=s=>(String(s||'').match(/\d+(?:[.,]\d+)*/g)||[]).sort();
  if(item&&JSON.stringify(nums(item.es))!==JSON.stringify(nums(x.fr)))issues.push(key+' numeric mismatch');
 }
}
console.log(JSON.stringify({status:issues.length?'FAIL':'PASS',batches:files.length,entries:total,issues,mode:'candidate batches only; catalog unchanged'},null,2));
if(issues.length)process.exitCode=1;
