'use strict';
const fixtureSource = Object.freeze({name:'Fixture local de QA', authorization:'prototype-only'});
function opinion(establishmentId,id,date,text,aspects,source=fixtureSource){
 return {id,establishmentId,date,text,source,aspects:aspects.map(([topic,polarity])=>({topic,polarity}))};
}
const FIXTURES = [
 {
  establishmentId:'fixture-faro-de-menta', name:'El Faro de Menta (F-01)', analyzedAt:'2026-11-07',
  opinions:[
   opinion('fixture-faro-de-menta','F01-1','2026-10-02','Me atendieron con calma y explicaron la carta.',[['service','positive']]),
   opinion('fixture-faro-de-menta','F01-2','2026-10-08','El guiso llegó caliente y el trato fue amable.',[['stew','positive'],['service','positive']]),
   opinion('fixture-faro-de-menta','F01-3','2026-10-14','Me gustó el guiso y nos atendieron rápido.',[['stew','positive'],['service','positive']]),
   opinion('fixture-faro-de-menta','F01-4','2026-10-21','El guiso estaba rico, pero esperamos para sentarnos.',[['stew','positive'],['seating','negative']])
  ]
 },
 {
  establishmentId:'fixture-brujula-de-nuez', name:'La Brújula de Nuez (F-02)', analyzedAt:'2026-11-07',
  opinions:[
   opinion('fixture-brujula-de-nuez','F02-1','2026-10-03','La terraza era agradable, aunque tardaron en servir.',[['terrace','positive'],['pace','negative']]),
   opinion('fixture-brujula-de-nuez','F02-2','2026-10-09','Buen ambiente en la terraza; mi plato tardó.',[['terrace','positive'],['pace','negative']]),
   opinion('fixture-brujula-de-nuez','F02-3','2026-10-15','Nos sirvieron pronto, pero dentro había mucho ruido.',[['pace','positive'],['noise','negative']]),
   opinion('fixture-brujula-de-nuez','F02-4','2026-10-25','El interior era ruidoso y preferí la terraza.',[['noise','negative'],['terrace','positive']])
  ]
 },
 {establishmentId:'fixture-tetera-orbital',name:'La Tetera Orbital (F-03)',analyzedAt:null,opinions:[]}
];
if(typeof module!=='undefined')module.exports={FIXTURES,opinion};
