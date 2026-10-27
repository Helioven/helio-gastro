import {readFileSync} from 'node:fs';
const p=JSON.parse(readFileSync('data/places.json','utf8'));
const batch=JSON.parse(readFileSync('translations/fr/batch-001-la-montillana.json','utf8'));
let issues=[];let seen=new Set();
for(const x of batch.entries){
const key=[x.placeId,x.sectionIndex,x.itemIndex].join(':');
if(seen.has(key))issues.push(key+' duplicated key');seen.add(key);
const place=p.find(a=>a.id===x.placeId),item=place?.menuSections?.[x.sectionIndex]?.items?.[x.itemIndex];
if(!item?.es?.trim())issues.push(key+' source missing');
if(typeof x.fr!=='string'||!x.fr.trim())issues.push(key+' French missing');
const nums=s=>(String(s||'').match(/\d+(?:[.,]\d+)*/g)||[]).sort();
if(item&&! (JSON.stringify(nums(item.es))===JSON.stringify(nums(x.fr))))issues.push(key+' numeric mismatch');
}
console.log(JSON.stringify({status:issues.length?'FAIL':'PASS',entries:batch.entries.length,issues,mode:'candidate batch only; catalog unchanged'},null,2));
if(issues.length)process.exitCode=1;
