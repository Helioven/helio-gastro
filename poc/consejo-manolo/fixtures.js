'use strict';
// Private QA fixtures. Editorial text is authored separately from the raw opinions.
const FIXTURES = [
 {
  establishmentId:'fixture-faro-de-menta', name:'El Faro de Menta (F-01)',
  source:{name:'Fixture local de QA', authorizationRef:null, rights:'prototype-only'},
  analyzedCount:4, analyzedAt:'2026-11-07', period:{from:'2026-10-02',to:'2026-10-21'},
  validation:'prototype-only', sampleStatus:'sufficient', reviewStatus:'draft',
  opinions:['Me atendieron con calma y explicaron la carta.','El guiso llegó caliente y el trato fue amable.','Me gustó el guiso y nos atendieron rápido.','El guiso estaba rico, pero esperamos para sentarnos.'],
  editorial:{
   es:{summary:'En esta muestra predomina una experiencia positiva, con una reserva sobre la espera.',positive:['Tres opiniones mencionan el guiso y tres valoran la atención.'],negative:['Una opinión menciona espera para sentarse.'],advice:'Si vas con prisa, pregunta por la mesa antes de sacar el cucharón.'},
   en:{summary:'This sample is mostly positive, with one report of a wait for a table.',positive:['Three reviews mention the stew and three praise the service.'],negative:['One review mentions a wait to be seated.'],advice:'On a tight schedule? Check the wait before you commit to the stew.'},
   fr:{summary:'L’échantillon est surtout positif, avec un bémol sur l’attente.',positive:['Trois avis citent le ragoût et trois apprécient le service.'],negative:['Un avis signale une attente avant d’être installé.'],advice:'Vous êtes pressé ? Demandez le délai avant de sortir la cuillère.'}
  }
 },
 {
  establishmentId:'fixture-brujula-de-nuez', name:'La Brújula de Nuez (F-02)',
  source:{name:'Fixture local de QA', authorizationRef:null, rights:'prototype-only'},
  analyzedCount:4, analyzedAt:'2026-11-07', period:{from:'2026-10-03',to:'2026-10-25'},
  validation:'prototype-only', sampleStatus:'sufficient', reviewStatus:'draft',
  opinions:['La terraza era agradable, aunque tardaron en servir.','Buen ambiente en la terraza; mi plato tardó.','Nos sirvieron pronto, pero dentro había mucho ruido.','El interior era ruidoso y preferí la terraza.'],
  editorial:{
   es:{summary:'La terraza reúne más elogios. La experiencia dentro y el ritmo del servicio dividen la muestra.',positive:['Tres opiniones valoran la terraza.'],negative:['Dos mencionan ruido en el interior y dos señalan demoras.'],advice:'Si quieres charlar sin competir con la mesa de al lado, prueba la terraza y deja margen.'},
   en:{summary:'The terrace gets the most praise. The indoor experience and pace of service draw mixed reactions.',positive:['Three reviews like the terrace.'],negative:['Two mention indoor noise and two report delays.'],advice:'After a quiet catch-up? Try the terrace and leave a little room in your schedule.'},
   fr:{summary:'La terrasse plaît davantage. L’expérience en salle et le rythme du service divisent les avis.',positive:['Trois avis apprécient la terrasse.'],negative:['Deux évoquent le bruit en salle et deux signalent de l’attente.'],advice:'Pour discuter sans hausser la voix, essayez la terrasse et prévoyez un peu de temps.'}
  }
 },
 {
  establishmentId:'fixture-tetera-orbital', name:'La Tetera Orbital (F-03)',
  source:null, analyzedCount:0, analyzedAt:null, period:null,
  validation:'prototype-only', sampleStatus:'insufficient', reviewStatus:'draft',
  opinions:[], editorial:null
 }
];
