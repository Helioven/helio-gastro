(() => {
 const labels={
  es:{title:'Horarios',opening:'Apertura del local',kitchen:'Servicio de cocina',breakfast:'Desayuno',lunch:'Comida',dinner:'Cena',more:'Desayuno, comida, cena y excepciones',exceptions:'Excepciones',unknown:'Horario sin confirmar.',conflict:'Las fuentes oficiales discrepan. Confirma el horario con el local.',closed:'Cerrado',next:'del día siguiente',partial:'{start} · cierre sin precisar',sources:'Fuentes y fecha de comprobación',source:'Web oficial',spanishPage:'Web oficial en español',englishPage:'Web oficial en inglés',contactPage:'Bodegas Campos: Contacto',reservationsPage:'Bodegas Campos: Reservas',note:'Horarios publicados sujetos a cambios.',none:'Sin excepciones documentadas.'},
  en:{title:'Hours',opening:'Venue opening hours',kitchen:'Kitchen service hours',breakfast:'Breakfast',lunch:'Lunch',dinner:'Dinner',more:'Breakfast, lunch, dinner and exceptions',exceptions:'Exceptions',unknown:'Hours unconfirmed.',conflict:'Official sources disagree. Check the hours with the venue.',closed:'Closed',next:'the next day',partial:'{start} · closing time unspecified',sources:'Sources and date checked',source:'Official website',spanishPage:'Official website in Spanish',englishPage:'Official website in English',contactPage:'Bodegas Campos: Contact',reservationsPage:'Bodegas Campos: Reservations',note:'Published hours may change.',none:'No exceptions documented.'},
  fr:{title:'Horaires',opening:'Ouverture de l’établissement',kitchen:'Service de cuisine',breakfast:'Petit-déjeuner',lunch:'Déjeuner',dinner:'Dîner',more:'Petit-déjeuner, déjeuner, dîner et exceptions',exceptions:'Exceptions',unknown:'Horaires à confirmer.',conflict:'Les sources officielles divergent. Confirmez les horaires auprès de l’établissement.',closed:'Fermé',next:'le lendemain',partial:'{start} · fermeture non précisée',sources:'Sources et date de vérification',source:'Site officiel',spanishPage:'Site officiel en espagnol',englishPage:'Site officiel en anglais',contactPage:'Bodegas Campos : Contact',reservationsPage:'Bodegas Campos : Réservations',note:'Les horaires publiés peuvent changer.',none:'Aucune exception documentée.'}
 };
 let pending,current;
 function data(){
  pending??=fetch('./data/venue-hours.json?v=3').then(response=>{
   if(!response.ok)throw Error('HTTP '+response.status);
   return response.json();
  }).then(payload=>{
   if(payload.schemaVersion!==1)throw Error('Unsupported venue hours schema');
   return payload.records;
  }).catch(error=>{pending=null;throw error});
  return pending;
 }
 function node(tag,text,className){
  const el=document.createElement(tag);
  if(text)el.textContent=text;
  if(className)el.className=className;
  return el;
 }
 const scopes=['opening','kitchen','breakfast','lunch','dinner'];
 function render(section,record){
  const lang=document.documentElement.lang;
  const t=labels[lang]||labels.es;
  const date=new Intl.DateTimeFormat(lang,{dateStyle:'medium',timeZone:'UTC'});
  const weekday=new Intl.DateTimeFormat(lang,{weekday:'long',timeZone:'UTC'});
  const localDate=value=>date.format(new Date(value+'T12:00:00Z'));
  const day=value=>weekday.format(new Date(Date.UTC(2024,0,value)));
  const dayList=new Intl.ListFormat(lang);
  function ruleText(rule){
   if(rule.status==='closed')return t.closed;
   if(rule.status==='unknown')return t.unknown;
   return rule.intervals.map(({start,end,endDayOffset})=>end===null?t.partial.replace('{start}',start):
    start+'–'+end+(endDayOffset?' '+t.next:'')).join(' · ');
  }
  function scheduleBlock(scope){
   const schedule=record.schedules[scope];
   const card=node('div',null,'venue-hours-card');
   card.append(node('h4',t[scope]));
   if(schedule.status!=='published'){
    card.append(node('p',schedule.status==='conflict'?t.conflict:t.unknown,'note'));
    return card;
   }
   const rows=node('dl');
   for(const rule of schedule.week){
    const days=rule.days;
    const consecutive=days.every((d,i)=>i===0||d===days[i-1]+1);
    const title=days.length>2&&consecutive?day(days[0])+' – '+day(days.at(-1)):dayList.format(days.map(day));
    rows.append(node('dt',title),node('dd',ruleText(rule)));
   }
   card.append(rows);
   return card;
  }
  const heading=node('h3',t.title);heading.id='venue-hours-title';
  const grid=node('div',null,'venue-hours-grid');
  grid.append(scheduleBlock('opening'),scheduleBlock('kitchen'));
  const more=node('details');more.append(node('summary',t.more));
  const extra=node('div',null,'venue-hours-grid');
  extra.append(...scopes.slice(2).map(scheduleBlock));
  more.append(extra,node('h4',t.exceptions));
  const exceptions=scopes.flatMap(scope=>record.schedules[scope].exceptions.map(rule=>({scope,rule})));
  if(exceptions.length){
   const rows=node('dl');
   for(const {scope,rule} of exceptions)rows.append(node('dt',t[scope]+' · '+localDate(rule.date)),node('dd',ruleText(rule)));
   more.append(rows);
  }else more.append(node('p',t.none,'note'));
  const sources=node('details');sources.append(node('summary',t.sources));
  const list=node('ul');
  for(const [id,source] of Object.entries(record.sources)){
   const contexts=scopes.filter(scope=>record.schedules[scope].sourceIds.includes(id)).map(scope=>t[scope]);
   const item=node('li');
   const link=node('a',(t[source.labelKey]||t.source)+' · '+dayList.format(contexts));
   link.href=source.url;
   item.append(link,document.createTextNode(' · '+localDate(source.checkedOn)));
   list.append(item);
  }
  sources.append(list);
  const previous=[...section.querySelectorAll('details')].map(details=>details.open);
  [more,sources].forEach((details,index)=>{details.open=previous[index]||false});
  section.replaceChildren(heading,grid,more,sources,node('p',t.note,'note'));
 }
 new MutationObserver(()=>{
  if(current?.section.isConnected)render(current.section,current.record);
 }).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 window.HelioGastroVenueHours={
  attach(panel,id){
   const slot=node('section',null,'venue-hours');
   slot.hidden=true;
   slot.dataset.hoursLocalized='';
   slot.setAttribute('aria-labelledby','venue-hours-title');
   panel.append(slot);
   data().then(records=>{
    if(!slot.isConnected)return;
    const record=Object.hasOwn(records,id)?records[id]:null;
    if(!record){slot.remove();return}
    current={section:slot,record};
    render(slot,record);
    slot.hidden=false;
   }).catch(()=>slot.remove());
  }
 };
})();
