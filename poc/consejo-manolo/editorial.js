'use strict';
const ReviewEditorial = (() => {
 const copy = {
  es:{
   topics:{stew:'Guiso',service:'Atención',seating:'Espera para sentarse',terrace:'Terraza',pace:'Ritmo del servicio',noise:'Ruido en sala'},
   positive:n=>n===1?'opinión favorable':'opiniones favorables',negative:n=>n===1?'opinión crítica':'opiniones críticas',
   summary:(n,p,m)=>'Temas que se repiten en '+n+' opiniones ficticias: '+p+' a favor y '+m+' críticos.',
   line:(topic,n,word,isolated)=>topic+' · '+n+' '+word+(isolated?' (mención aislada)':''),
   and:' y ',
   tips:{stew:'Si el guiso sigue en carta, ya tienes por dónde empezar. El resto puede esperar un minuto.',
    pace:'Si vas con prisa, pregunta cuánto tardan en servir antes de pedir. Comer mirando el reloj tiene poca gracia.',
    terrace:'Si te apetece terraza, pregunta si hay sitio antes de sentarte dentro. Así eliges mesa con calma.'}
  },
  en:{
   topics:{stew:'Stew',service:'Service',seating:'Wait for a table',terrace:'Terrace',pace:'Pace of service',noise:'Indoor noise'},
   positive:n=>n===1?'favourable review':'favourable reviews',negative:n=>n===1?'critical review':'critical reviews',
   summary:(n,p,m)=>'Recurring themes in '+n+' fictional reviews: '+p+' positive and '+m+' critical.',
   line:(topic,n,word,isolated)=>topic+' · '+n+' '+word+(isolated?' (isolated mention)':''),
   and:' and ',
   tips:{stew:'If the stew is still on the menu, you’ve got a good place to start. The rest of the menu can wait a minute.',
    pace:'If you’re in a hurry, ask how long the food will take before ordering. Clock-watching makes for a poor lunch companion.',
    terrace:'Fancy sitting outside? Ask whether there’s a terrace table before you settle indoors.'}
  },
  fr:{
   topics:{stew:'Ragoût',service:'Accueil',seating:'Attente avant de s’installer',terrace:'Terrasse',pace:'Rythme du service',noise:'Bruit en salle'},
   positive:n=>n===1?'avis favorable':'avis favorables',negative:n=>n===1?'avis critique':'avis critiques',
   summary:(n,p,m)=>'Thèmes récurrents dans '+n+' avis fictifs : '+p+' positifs et '+m+' critiques.',
   line:(topic,n,word,isolated)=>topic+' · '+n+' '+word+(isolated?' (mention isolée)':''),
   and:' et ',
   tips:{stew:'Si le ragoût est toujours à la carte, voilà une piste pour commencer. Le reste du menu peut attendre une minute.',
    pace:'Si vous êtes pressé, demandez le délai avant de commander. C’est plus agréable de déjeuner sans surveiller l’heure.',
    terrace:'Envie de terrasse ? Demandez s’il reste une table avant de vous installer en salle.'}
  }
 };
 function render(result,language){
  if(result.status!=='qa-only')return null;
  const t=copy[language];
  const recurrent=result.findings.filter(f=>f.recurrent&&['positive','negative'].includes(f.polarity));
  const contestedTopics=new Set(result.contradictions.map(item=>item.topic));
  const counts=polarity=>recurrent.filter(f=>f.polarity===polarity).length;
  const line=f=>({text:t.line(t.topics[f.topic],f.count,t[f.polarity](f.count),!f.recurrent),evidenceIds:f.evidenceIds});
  const tip=[['pace','negative'],['stew','positive'],['terrace','positive']]
   .map(([topic,polarity])=>recurrent.find(f=>f.topic===topic&&f.polarity===polarity)).find(Boolean);
  return {
   summary:{text:t.summary(result.analyzedCount,counts('positive'),counts('negative')),evidenceIds:result.analyzedIds},
   positive:recurrent.filter(f=>f.polarity==='positive'&&!contestedTopics.has(f.topic)).map(line),
   negative:result.findings.filter(f=>f.polarity==='negative'&&!contestedTopics.has(f.topic)).map(line),
   contradictions:result.contradictions.map(c=>({text:t.topics[c.topic]+' · '+c.positiveIds.length+' '+t.positive(c.positiveIds.length)+t.and+c.negativeIds.length+' '+t.negative(c.negativeIds.length),
    evidenceIds:[...c.positiveIds,...c.negativeIds],
    evidenceGroups:[
     {label:t.positive(c.positiveIds.length),ids:c.positiveIds},
     {label:t.negative(c.negativeIds.length),ids:c.negativeIds}
    ]})),
   advice:tip?{text:t.tips[tip.topic],evidenceIds:tip.evidenceIds}:null
  };
 }
 return {render};
})();
if(typeof module!=='undefined')module.exports=ReviewEditorial;
