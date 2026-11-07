'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {analyze}=require('./engine.js');
const {render}=require('./editorial.js');
const {FIXTURES,opinion}=require('./fixtures.js');
const [positive,mixed,empty]=FIXTURES;
const find=(result,topic,polarity)=>result.findings.find(f=>f.topic===topic&&f.polarity===polarity);
const withOpinions=(record,opinions)=>({...record,opinions});

test('Positive sample preserves exact evidence and keeps a single criticism isolated',()=>{
 const result=analyze(positive);
 assert.equal(result.status,'qa-only');
 assert.equal(result.analyzedCount,4);
 assert.deepEqual(find(result,'stew','positive').evidenceIds,['F01-2','F01-3','F01-4']);
 assert.deepEqual(find(result,'seating','negative'),{topic:'seating',polarity:'negative',count:1,recurrent:false,evidenceIds:['F01-4']});
 assert.deepEqual(render(result,'es').advice.evidenceIds,['F01-2','F01-3','F01-4']);
});
test('Mixed sample traces the two positions to different opinions',()=>{
 const result=analyze(mixed);
 assert.deepEqual(result.contradictions,[{topic:'pace',positiveIds:['F02-3'],negativeIds:['F02-1','F02-2']}]);
 assert.deepEqual(find(result,'noise','negative').evidenceIds,['F02-3','F02-4']);
 for(const language of ['es','en','fr']){
  const copy=render(result,language);
  assert.equal(copy.contradictions.length,1);
  assert.deepEqual(copy.positive.map(claim=>claim.evidenceIds),[['F02-1','F02-2','F02-4']]);
  assert.deepEqual(copy.negative.map(claim=>claim.evidenceIds),[['F02-3','F02-4']]);
  assert.deepEqual(copy.contradictions[0].evidenceGroups.map(group=>group.ids),[['F02-3'],['F02-1','F02-2']]);
  assert.deepEqual(copy.advice.evidenceIds,['F02-1','F02-2']);
 }
});
test('Duplicate identities and repeated aspects count once',()=>{
 const record=structuredClone(positive);
 record.opinions.push(structuredClone(record.opinions[1]));
 record.opinions[1].aspects.push(record.opinions[1].aspects[0]);
 assert.deepEqual(analyze(record),analyze(positive));
});
test('Conflicting duplicate IDs trigger abstention',()=>{
 const record=withOpinions(positive,[...positive.opinions,{...positive.opinions[0],text:'Contenido diferente'}]);
 assert.equal(analyze(record).reason,'conflicting-duplicate');
});
test('An internally mixed opinion is not evidence of disagreement between reviewers',()=>{
 const record=structuredClone(positive);
 record.opinions[0].aspects.push({topic:'service',polarity:'negative'});
 const result=analyze(record);
 assert.deepEqual(find(result,'service','mixed').evidenceIds,['F01-1']);
 assert(!result.contradictions.some(c=>c.topic==='service'));
 assert.equal(find(result,'service','positive').count,2);
});
test('Zero and too few opinions abstain and show the exact sample size',()=>{
 for(const [record,n] of [[empty,0],[withOpinions(positive,positive.opinions.slice(0,3)),3]]){
  const result=analyze(record);
  assert.equal(result.reason,'small-sample');assert.equal(result.analyzedCount,n);
  assert.equal(render(result,'es'),null);
 }
});
test('Missing metadata, invalid dates and foreign establishments fail closed',()=>{
 for(const patch of [{date:null},{date:'2026-02-30'},{establishmentId:'otro'},{id:''},{text:''}]){
  const record=withOpinions(positive,[{...positive.opinions[0],...patch},...positive.opinions.slice(1)]);
  assert.equal(analyze(record).reason,'invalid-record');
 }
});
test('Unauthorized, unrecognized annotations and publication requests abstain',()=>{
 const changed=(patch)=>withOpinions(positive,[{...positive.opinions[0],...patch},...positive.opinions.slice(1)]);
 assert.equal(analyze(changed({source:null})).reason,'rights-unavailable');
 assert.equal(analyze(changed({source:{name:'Fixture',authorization:'unknown'}})).reason,'rights-unavailable');
 assert.equal(analyze(changed({aspects:[{topic:'noise',polarity:'unknown'}]})).reason,'invalid-annotation');
 assert.equal(analyze(positive,'publication').reason,'publication-disabled');
});
test('Ambiguous or neutral-only text never generates a recommendation',()=>{
 const {establishmentId}=positive;
 const opinions=Array.from({length:4},(_,i)=>opinion(establishmentId,'A'+i,'2026-10-01','Bueno… depende.',i%2?[['service','neutral']]:[]));
 const result=analyze(withOpinions(positive,opinions));
 assert.equal(result.reason,'no-recurrent-signal');
 assert.equal(result.analyzedCount,4);
 assert.equal(render(result,'fr'),null);
});
test('Every localized conclusion has evidence from its own sample',()=>{
 for(const record of [positive,mixed]){
  const result=analyze(record);
  const ids=new Set(record.opinions.map(x=>x.id));
  for(const language of ['es','en','fr']){
   const copy=render(result,language);
   for(const claim of [copy.summary,...copy.positive,...copy.negative,...copy.contradictions,copy.advice]){
    assert(claim.text.length>0);
    assert(claim.evidenceIds.length>0);
    assert(claim.evidenceIds.every(id=>ids.has(id)));
    assert.equal(new Set(claim.evidenceIds).size,claim.evidenceIds.length);
   }
   for(const claim of [...copy.positive,...copy.negative]){
    assert(result.findings.some(f=>JSON.stringify(f.evidenceIds)===JSON.stringify(claim.evidenceIds)));
   }
  }
 }
});
test('The editorial layer can abstain from advice despite a recurring pattern',()=>{
 const record=withOpinions(positive,positive.opinions.map(item=>({...item,aspects:[{topic:'service',polarity:'positive'}]})));
 const copy=render(analyze(record),'en');
 assert.equal(copy.positive.length,1);
 assert.equal(copy.advice,null);
});
