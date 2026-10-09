'use strict';
const state={places:[],filtered:[],selected:new Set(),searched:false,appliedTerm:''};
const el=id=>document.getElementById(id);
const fmt=n=>typeof n==='number'?new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n):'No disponible';
const clean=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function validPlace(p){
 return p&&typeof p.id==='string'&&typeof p.name==='string'&&typeof p.area==='string'
 &&Array.isArray(p.dishes)&&Array.isArray(p.sources)&&['confirmed','estimated','unknown'].includes(p.priceStatus)
 &&(p.mealCostEur===null||Number.isFinite(p.mealCostEur));
}
function dishPrices(p){return(Array.isArray(p.dishPrices)?p.dishPrices:[]).filter(d=>typeof d.dish==='string'&&Number.isFinite(d.eur)&&d.eur>=0)}
function relevantPrices(p,term){return dishPrices(p).filter(d=>!term||clean(d.dish).includes(term))}
function lowestPrice(p,scope,term){if(scope==='meal')return Number.isFinite(p.mealCostEur)?p.mealCostEur:null;const arr=relevantPrices(p,term);return arr.length?Math.min(...arr.map(x=>x.eur)):null}
function showEmpty(message){const node=document.createElement('div');node.className='empty';node.textContent=message;el('results').replaceChildren(node)}
function draw(){
 const list=el('results');list.replaceChildren();
 el('count').textContent=state.filtered.length+' '+(state.filtered.length===1?'lugar':'lugares');
 if(!state.places.length){showEmpty('Todavía no hemos incorporado establecimientos verificados. Empezaremos por una selección pequeña y documentada de Córdoba.');return}
 if(!state.filtered.length){showEmpty('No hay establecimientos que cumplan estos filtros. Prueba con otra especialidad o presupuesto.');return}
 for(const p of state.filtered){
  const card=document.createElement('article');card.className='place';
  const title=document.createElement('h3');title.textContent=p.name;card.append(title);
  const details=document.createElement('p');details.textContent='📍 '+p.area+' · '+p.dishes.join(', ');card.append(details);
  const price=document.createElement('p');
  const status=p.priceStatus==='confirmed'?'Coste completo confirmado':p.priceStatus==='estimated'?'Coste completo estimado':'Coste completo desconocido';
  price.textContent='Comida completa por persona: '+fmt(p.mealCostEur)+' · '+status;card.append(price);
  const term=state.appliedTerm;
  const shown=term?relevantPrices(p,term):dishPrices(p);
  if(shown.length) {
    const priceHeading=document.createElement('p');
    priceHeading.textContent=term?'Platos coincidentes con precio publicado:':'Precios publicados de platos (NO coste total):';
    card.append(priceHeading);
    const dishes=document.createElement('ul');dishes.className='dish-prices';
    for (const item of shown) {
      if(typeof item.dish!=='string'||!Number.isFinite(item.eur)) continue;
      const li=document.createElement('li');
      li.textContent=item.dish+' — '+fmt(item.eur);
      dishes.append(li);
    }
    card.append(dishes);
  } else if(term && dishPrices(p).length){
    const notice=document.createElement('p');
    notice.className='note';notice.textContent='Hay precios de otros platos, pero ninguno verificado para esta búsqueda.';
    card.append(notice);
  }
  if(state.appliedBudget && lowestPrice(p,state.appliedScope,state.appliedTerm)===null){
    const warning=document.createElement('p');warning.className='price-unknown';
    warning.textContent='⚠ Precio desconocido. No podemos confirmar que se ajuste a tu presupuesto.';
    card.append(warning);
  }
  const sources=document.createElement('p');sources.textContent='Fuentes documentadas: '+p.sources.length+' · Fecha de consulta: '+(p.checkedAt||'pendiente');card.append(sources);
  for(const source of p.sources){
   if(source.url && /^https:\/\//.test(source.url)){
    const link=document.createElement('a');link.href=source.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=(source.label||'Ver fuente')+' ↗';card.append(link);
   }
  }
  const button=document.createElement('button');button.type='button';button.textContent=state.selected.has(p.id)?'✓ Quitar del comparador':'+ Comparar';
  button.setAttribute('aria-pressed',String(state.selected.has(p.id)));
  button.addEventListener('click',()=>{
   if(state.selected.has(p.id))state.selected.delete(p.id);
   else if(state.selected.size<3)state.selected.add(p.id);
   else {el('compare-output').textContent='Puedes comparar hasta tres sitios. Quita uno antes de añadir otro.';return}
   draw();compare();
  });card.append(button);list.append(card);
 }
}
function compare(){
 const panel=el('compare-output');panel.replaceChildren();
 const items=state.places.filter(p=>state.selected.has(p.id));
 el('compare-count').textContent=items.length+' / 3';
 if(!items.length){panel.className='empty';panel.textContent='Selecciona establecimientos de los resultados para compararlos aquí.';return}
 panel.className='';
 const term=state.appliedTerm;
 for(const p of items){
  const box=document.createElement('div');box.className='compare-place';
  const title=document.createElement('h3');title.textContent=p.name;box.append(title);
  const cost=document.createElement('p');cost.textContent='Comida completa por persona: '+fmt(p.mealCostEur)+' · '+(p.priceStatus==='unknown'?'Coste desconocido':p.priceStatus==='estimated'?'Coste estimado':'Coste confirmado');box.append(cost);
  const prices=relevantPrices(p,term);
  const label=document.createElement('p');label.textContent=prices.length?'Platos con precio publicado:':'Sin precios de platos coincidentes documentados.';box.append(label);
  const ul=document.createElement('ul');for(const item of prices){const li=document.createElement('li');li.textContent=item.dish+' — '+fmt(item.eur);ul.append(li)}
  box.append(ul);
  const foot=document.createElement('p');foot.textContent=p.sources.length+' fuente(s) · Revisado '+(p.checkedAt||'sin fecha');box.append(foot);
  panel.append(box);
 }
}
function getDishCoverage(term, area) {
 const matches=state.places.filter(p=>(!term||clean(p.name+' '+p.dishes.join(' ')+' '+dishPrices(p).map(d=>d.dish).join(' ')).includes(term))&&(!area||p.area===area));
 const priced=matches.filter(p=>relevantPrices(p,term).length>0);
 return {total:matches.length, priced:priced.length, unpriced:matches.length-priced.length};
}
function filter(event){
 if(event)event.preventDefault();
 const dish=clean(el('dish').value.trim()),max=el('budget').value?Number(el('budget').value):null;
 state.appliedTerm=dish;state.appliedBudget=max;state.appliedScope=el('price-scope').value;state.searched=true;
 el('results-section').hidden=false;
 el('compare-section').hidden=false;
 const area=el('area').value,kind=el('price-kind').value,scope=el('price-scope').value,includeUnknown=el('include-unknown').checked;
 state.filtered=state.places.filter(p=>{
  if(dish&&!clean(p.name+' '+p.dishes.join(' ')+' '+dishPrices(p).map(d=>d.dish).join(' ')).includes(dish))return false;
  if(area&&p.area!==area)return false;
  const price=lowestPrice(p,scope,dish);
  if(max!==null&&(price>max||(price===null&&!includeUnknown)))return false;
  if(kind==='confirmed')return scope==='dish'?relevantPrices(p,dish).length>0:p.priceStatus==='confirmed';
  if(kind==='estimated')return scope==='dish'?relevantPrices(p,dish).length>0:['confirmed','estimated'].includes(p.priceStatus);
  return true;
 });
 const sort=el('sort').value;
 if(sort==='price')state.filtered.sort((x,y)=>(lowestPrice(x,scope,dish)??Infinity)-(lowestPrice(y,scope,dish)??Infinity));
 if(sort==='verified')state.filtered.sort((x,y)=>dishPrices(y).length-dishPrices(x).length);
 if(sort==='name')state.filtered.sort((x,y)=>x.name.localeCompare(y.name,'es'));
 el('budget-explain').textContent=scope==='dish'?
  'Presupuesto aplicado al plato más económico coincidente y documentado. Los precios desconocidos no garantizan cumplirlo.':
  'Presupuesto aplicado al coste total por persona. Los locales sin coste documentado pueden mostrarse, pero no se consideran dentro del límite.';
 const coverage=getDishCoverage(dish,area);
 const coverageBox=el('coverage-summary'), more=el('show-offering');
 coverageBox.hidden=!dish;
 more.hidden=!dish || !(coverage.unpriced>0 && (max!==null || kind!==''));
 if(dish){
  coverageBox.textContent='En nuestra base actual: '+coverage.total+' local(es) con «'+el('dish').value.trim()+'» registrado(s); '+coverage.priced+' con precio de ese plato documentado y '+coverage.unpriced+' sin precio. Esto NO representa todos los bares de Córdoba.';
 }
 draw();compare();
 el('results-section').scrollIntoView({behavior:'auto',block:'start'});
 el('results-heading').focus({preventScroll:true});
}
async function init(){
 el('filters').addEventListener('submit',filter);
 el('show-offering').addEventListener('click',()=>{
  el('budget').value='';
  el('price-kind').value='';
  el('include-unknown').checked=true;
  el('filters').requestSubmit();
 });
 document.querySelectorAll('[data-dish]').forEach(button=>button.addEventListener('click',()=>{
  el('dish').value=button.dataset.dish;
  el('dish').focus();
  // Elegir un plato solo prepara el formulario, nunca ejecuta una búsqueda.
 }));
 try{
  const res=await fetch('./data/places.json',{cache:'no-store'});
  if(!res.ok)throw Error('HTTP '+res.status);
  const data=await res.json();if(!Array.isArray(data))throw Error('Formato inválido');
  state.places=data.filter(validPlace);
  const areas=[...new Set(state.places.map(p=>p.area))].sort((a,b)=>a.localeCompare(b,'es'));
  for(const area of areas){const opt=document.createElement('option');opt.value=area;opt.textContent=area;el('area').append(opt)}
  // Los resultados y el comparador permanecen ocultos hasta enviar el formulario.
  el('results-section').hidden=true;
  el('compare-section').hidden=true;
 }catch(e){
  // Fallo de carga: informar al usuario sin mostrar resultados ficticios.
  el('results-section').hidden=false;
  el('count').textContent='Sin datos';
  showEmpty('No se ha podido cargar la base de datos. Inténtalo de nuevo más tarde.');
 }
}
init();
