#!/usr/bin/env node
// Structural safety audit of all documented restaurant links. Read-only, no network requests.
// Does NOT prove the destination is alive, accurate, official or current.
import {readFileSync} from 'node:fs';
import {writeFileSync,mkdirSync} from 'node:fs';
const places=JSON.parse(readFileSync('data/places.json','utf8'));
const fields=new Set(['url','sourceUrl','productUrl']);
const records=[],issues=[];
function scan(value,path,venue){
 if(Array.isArray(value)){value.forEach((v,i)=>scan(v,path+'['+i+']',venue));return;}
 if(!value||typeof value!=='object')return;
 for(const [key,child] of Object.entries(value)){
  const at=path+'.'+key;
  if(fields.has(key)){
   if(typeof child!=='string'||!child.trim()){issues.push({venue,path:at,reason:'empty-or-nonstring-url'});continue;}
   let url;
   try{url=new URL(child)}catch{issues.push({venue,path:at,reason:'invalid-url'});continue;}
   if(url.protocol!=='https:')issues.push({venue,path:at,reason:'non-https-protocol'});
   if(!url.hostname||url.username||url.password)issues.push({venue,path:at,reason:'invalid-host-or-embedded-credentials'});
   if(/[\s\u0000-\u001f]/.test(child))issues.push({venue,path:at,reason:'whitespace-or-control-character'});
   if(['localhost','127.0.0.1','::1'].includes(url.hostname))issues.push({venue,path:at,reason:'local-address'});
   records.push({venue,path:at,host:url.hostname,kind:key});
  }else scan(child,at,venue);
 }
}
for(const [i,p] of places.entries())scan(p,'places['+i+']',p?.id||'unknown');
const result={suite:'HG-QA-EXT-001',status:issues.length?'FAIL':'PASS',scope:'URL syntax and protocol only; external reachability not checked',
  checked:records.length,venues:places.length,distinctHosts:new Set(records.map(r=>r.host)).size,
  kinds:Object.fromEntries([...fields].map(k=>[k,records.filter(r=>r.kind===k).length])),issues};
mkdirSync('qa-reports',{recursive:true});
writeFileSync('qa-reports/external-links-audit.json',JSON.stringify(result,null,2)+'\n');
console.log('EXTERNAL LINKS QA '+JSON.stringify(result));
if(issues.length)process.exitCode=1;
