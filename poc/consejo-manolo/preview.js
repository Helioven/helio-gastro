'use strict';
const UI = {
 es:{language:'Idioma',title:'El Consejo de Manolo',subtitle:'Tres casos de prueba para revisar el diseño y el tono.',warning:'DATOS FICTICIOS — SOLO PROTOTIPO',cases:'Casos ficticios',sample:'Opiniones analizadas',source:'Fuente',fixture:'Conjunto ficticio de QA',period:'Periodo',date:'Fecha de análisis',positive:'Puntos a favor',negative:'Puntos a tener en cuenta',advice:'El consejo',enough:'Muestra de prueba',insufficient:'Datos insuficientes',empty:'No hay una muestra válida para resumir opiniones. El consejo aparecerá cuando exista evidencia suficiente.',footer:'Los nombres y las opiniones de esta página son inventados para QA. Los textos son ejemplos editoriales.'},
 en:{language:'Language',title:'Manolo’s advice',subtitle:'Three test cases to review the design and tone.',warning:'FICTIONAL DATA — PROTOTYPE ONLY',cases:'Fictional cases',sample:'Reviews analysed',source:'Source',fixture:'Fictional QA fixture',period:'Period',date:'Analysis date',positive:'What went well',negative:'What to consider',advice:'Manolo’s tip',enough:'Test sample',insufficient:'Insufficient data',empty:'There is no valid sample to summarise. Advice will appear when there is enough evidence.',footer:'The names and reviews on this page are fictional QA data. The text is editorial sample copy.'},
 fr:{language:'Langue',title:'Le conseil de Manolo',subtitle:'Trois cas de test pour évaluer la présentation et le ton.',warning:'DONNÉES FICTIVES — PROTOTYPE UNIQUEMENT',cases:'Cas fictifs',sample:'Avis analysés',source:'Source',fixture:'Jeu de données fictif de QA',period:'Période',date:'Date d’analyse',positive:'Points forts',negative:'Points à considérer',advice:'Le conseil',enough:'Échantillon de test',insufficient:'Données insuffisantes',empty:'Aucun échantillon valide ne permet de résumer les avis. Le conseil apparaîtra lorsque les données seront suffisantes.',footer:'Les noms et les avis de cette page sont fictifs et réservés aux tests. Les textes sont des exemples éditoriaux.'}
};
const chefAlt = {es:'Manolo Chef con gorro blanco, dos antenas y delantal oscuro',en:'Manolo Chef with a white chef hat, two antennae and a dark apron',fr:'Manolo Chef avec une toque blanche, deux antennes et un tablier sombre'};
const locale = {es:'es-ES',en:'en-GB',fr:'fr-FR'};
const byId = id => document.getElementById(id);
function element(tag, text, className) {
 const node = document.createElement(tag);
 if (text !== undefined) node.textContent = text;
 if (className) node.className = className;
 return node;
}
function render(language) {
 const t = UI[language];
 const dates = new Intl.DateTimeFormat(locale[language],{dateStyle:'medium',timeZone:'UTC'});
 const date = value => dates.format(new Date(value));
 document.documentElement.lang = language;
 byId('manolo-chef').alt = chefAlt[language];
 for (const id of ['title','subtitle','warning','footer']) byId(id).textContent = t[id];
 byId('language-label').textContent = t.language;
 const cases = byId('cases');
 cases.setAttribute('aria-label',t.cases);
 cases.replaceChildren();
 for (const record of FIXTURES) {
  const copy = record.sampleStatus === 'sufficient' && record.analyzedCount > 0 ? record.editorial?.[language] : null;
  const card = element('article');
  const heading = element('h2',record.name);
  heading.id = record.establishmentId;
  card.setAttribute('aria-labelledby',heading.id);
  card.append(element('p',copy?t.enough:t.insufficient,'state'),heading);
  const meta = [];
  if (Number.isInteger(record.analyzedCount)) meta.push(t.sample+' · '+record.analyzedCount);
  if (record.source) meta.push(t.source+' · '+t.fixture);
  if (record.period?.from && record.period?.to) meta.push(t.period+' · '+date(record.period.from)+' – '+date(record.period.to));
  if (record.analyzedAt) meta.push(t.date+' · '+date(record.analyzedAt));
  if (meta.length) {
   const provenance = element('div',undefined,'meta');
   for (const entry of meta) provenance.append(element('p',entry));
   card.append(provenance);
  }
  if (copy) {
   card.append(element('p',copy.summary));
   for (const kind of ['positive','negative']) {
    if (!copy[kind]?.length) continue;
    const list = element('ul');
    for (const point of copy[kind]) list.append(element('li',point));
    card.append(element('h3',t[kind]),list);
   }
   if (copy.advice) {
    const tip = element('div',undefined,'advice');
    tip.append(element('h3',t.advice),element('p',copy.advice));
    card.append(tip);
   }
  } else {
   card.append(element('p',t.empty,'empty'));
  }
  cases.append(card);
 }
}
byId('language').addEventListener('change',event=>render(event.target.value));
render('es');
