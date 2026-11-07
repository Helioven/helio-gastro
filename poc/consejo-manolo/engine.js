'use strict';
// Rules for fictitious QA data. Publication requires a separate policy.
const ReviewEngine = (() => {
 const topics = ['stew','service','seating','terrace','pace','noise'];
 const polarities = ['positive','negative','mixed','neutral'];
 const validDate = value => typeof value==='string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10)===value;
 const MIN_SAMPLE=4;
 const MIN_RECURRENT=2;

 function analyze({establishmentId,opinions,analyzedAt},mode='qa'){
  const abstain=(reason,analyzedCount=0,metadata={})=>({status:'abstain',reason,analyzedCount,findings:[],contradictions:[],...metadata});
  if(mode!=='qa')return abstain('publication-disabled');
  if(typeof establishmentId!=='string'||!establishmentId.trim()||!Array.isArray(opinions))return abstain('invalid-record');
  if(analyzedAt!=null&&!validDate(analyzedAt))return abstain('invalid-record');
  const unique=new Map();
  for(const item of opinions){
   if(!item||item.establishmentId!==establishmentId||typeof item.id!=='string'||!item.id.trim()
    ||typeof item.text!=='string'||!item.text.trim()||!validDate(item.date)||!Array.isArray(item.aspects)
    ||(analyzedAt&&item.date>analyzedAt))return abstain('invalid-record');
   if(item.source?.authorization!=='prototype-only'||typeof item.source.name!=='string'||!item.source.name.trim())return abstain('rights-unavailable');
   if(item.aspects.some(tag=>!tag||!topics.includes(tag.topic)||!polarities.includes(tag.polarity)))return abstain('invalid-annotation');
   const tags=[...new Set(item.aspects.map(({topic,polarity})=>topic+':'+polarity))].sort();
   const fingerprint=JSON.stringify([item.text,item.date,item.source.name,tags]);
   if(unique.has(item.id)){
    if(unique.get(item.id).fingerprint!==fingerprint)return abstain('conflicting-duplicate');
    continue;
   }
   unique.set(item.id,{item,tags,fingerprint});
  }

  const analyzedCount=unique.size;
  const dates=[...unique.values()].map(({item})=>item.date).sort();
  const metadata={analyzedIds:[...unique.keys()].sort(),sources:[...new Set([...unique.values()].map(({item})=>item.source.name))].sort(),
   period:dates.length?{from:dates[0],to:dates.at(-1)}:null,analyzedAt:analyzedAt??null};
  if(analyzedCount<MIN_SAMPLE)return abstain('small-sample',analyzedCount,metadata);
  const findings=[],contradictions=[];
  for(const topic of topics){
   const evidence={positive:[],negative:[],mixed:[],neutral:[]};
   for(const [id,{tags}] of unique){
    const has=polarity=>tags.includes(topic+':'+polarity);
    if(has('mixed')||(has('positive')&&has('negative')))evidence.mixed.push(id);
    else if(has('positive'))evidence.positive.push(id);
    else if(has('negative'))evidence.negative.push(id);
    else if(has('neutral'))evidence.neutral.push(id);
   }
   for(const polarity of polarities){
    const ids=evidence[polarity].sort();
    if(ids.length)findings.push({topic,polarity,count:ids.length,recurrent:ids.length>=MIN_RECURRENT,evidenceIds:ids});
   }
   if(evidence.positive.length&&evidence.negative.length){
    contradictions.push({topic,positiveIds:evidence.positive,negativeIds:evidence.negative});
   }
  }
  if(!findings.some(item=>item.recurrent&&['positive','negative'].includes(item.polarity)))
   return {...abstain('no-recurrent-signal',analyzedCount,metadata),findings,contradictions};
  return {status:'qa-only',analyzedCount,...metadata,findings,contradictions};
 }
 return {analyze};
})();
if(typeof module!=='undefined')module.exports=ReviewEngine;
