// Read-only semantic review evidence for Moriles Ribera FR candidates.
// This exports ES/EN/FR side by side; it does not approve translations.
import {chromium} from 'playwright';
import {readdirSync,readFileSync,mkdirSync,writeFileSync} from 'node:fs';

const id='moriles-ribera';
const batches=readdirSync('translations/fr')
  .filter(name=>/^batch-\d+-moriles-ribera\.json$/.test(name)).sort();
const entries=batches.flatMap(file=>JSON.parse(readFileSync('translations/fr/'+file,'utf8')).entries
  .map(entry=>({...entry,sourceBatch:file})));
if(!entries.length)throw Error('No Moriles Ribera FR candidates found');
mkdirSync('qa-reports',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
let report;
try{
 const page=await browser.newPage({viewport:{width:1365,height:900}});
 await page.goto('http://127.0.0.1:8765/index.html?qa_fr=1',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(id=>typeof state!=='undefined'&&state.places.some(p=>p.id===id),id);
 const source=await page.evaluate(id=>{
  const venue=state.places.find(p=>p.id===id);
  return venue.menuSections.map(section=>({
   section:section.name||section.title||'',
   items:section.items.map(item=>({name:item.name,es:item.es||'',en:item.en||'',fr:item.fr||''}))
  }));
 },id);
 const rows=entries.map(entry=>{
  const section=source[entry.sectionIndex],dish=section?.items?.[entry.itemIndex];
  const issues=[];
  if(!dish)issues.push('Missing source dish at section/item index');
  if(!dish?.es?.trim())issues.push('Missing ES description');
  if(!dish?.en?.trim())issues.push('Missing EN description');
  if(!dish?.fr?.trim())issues.push('Missing FR overlay');
  if(dish?.fr!==entry.fr)issues.push('FR candidate mismatch with browser overlay');
  return {sectionIndex:entry.sectionIndex,itemIndex:entry.itemIndex,
    section:section?.section||'',dish:dish?.name||'',
    es:dish?.es||'',en:dish?.en||'',fr:entry.fr,
    sourceBatch:entry.sourceBatch,issues,
    editorialStatus:'pending_human_semantic_review'};
 });
 const keys=rows.map(x=>x.sectionIndex+':'+x.itemIndex);
 const duplicates=keys.filter((key,i)=>keys.indexOf(key)!==i);
 report={kind:'read_only_trilingual_semantic_review_evidence',venue:id,
   note:'Technical alignment only. No automatic approval of ingredients, culinary terms or original source accuracy.',
   count:rows.length,duplicates,rows,
   technicalStatus:duplicates.length||rows.some(r=>r.issues.length)?'FAIL':'PASS'};
}finally{await browser.close();}
writeFileSync('qa-reports/fr-moriles-ribera-semantic-review.json',JSON.stringify(report,null,2)+'\n');
console.log('FR MORILES RIBERA SEMANTIC EVIDENCE '+JSON.stringify({
 count:report.count,status:report.technicalStatus,issues:report.rows.filter(r=>r.issues.length).map(r=>({index:r.sectionIndex+':'+r.itemIndex,issues:r.issues})),
 duplicates:report.duplicates}));
if(report.technicalStatus!=='PASS')process.exitCode=1;
