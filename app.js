'use strict';
const state={places:[],filtered:[],selected:new Set()};
const el=id=>document.getElementById(id);
const fmt=n=>typeof n==='number'?new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n):'No disponible';
const clean=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function validPlace(p){
 return p&&typeof p.id==='string'&&typeof p.name==='string'&&typeof p.area==='string'
 &&Array.isArray(p.dishes)&&Array.isArray(p.sources)&&['confirmed','estimated','unknown'].includes(p.priceStatus)
 &&(p.mealCostEur===null||Number.isFinite(p.mealCostEur));
}
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
  const status=p.priceStatus==='confirmed'?'Precio publicado y contrastado':p.priceStatus==='estimated'?'Estimación — no confirmado':'Precio sin verificar';
  price.textContent='Coste orientativo por persona: '+fmt(p.mealCostEur)+' · '+status;card.append(price);
  const sources=document.createElement('p');sources.textContent='Fuentes documentadas: '+p.sources.length+' · Última comprobación: '+(p.checkedAt||'pendiente');card.append(sources);
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
 for(const p of items){const line=document.createElement('p');line.textContent=p.name+' — '+fmt(p.mealCostEur)+' · '+(p.priceStatus==='confirmed'?'Confirmado':p.priceStatus==='estimated'?'Estimado':'Sin precio')+' · '+p.sources.length+' fuentes';panel.append(line)}
}
function filter(event){
 if(event)event.preventDefault();
 const dish=clean(el('dish').value.trim()),max=el('budget').value?Number(el('budget').value):null,area=el('area').value,kind=el('price-kind').value;
 state.filtered=state.places.filter(p=>
  (!dish||clean(p.name+' '+p.dishes.join(' ')).includes(dish))&&
  (!area||p.area===area)&&
  (!kind||p.priceStatus===kind||(kind==='estimated'&&p.priceStatus==='confirmed'))&&
  (!max||(typeof p.mealCostEur==='number'&&p.mealCostEur<=max))
 );
 const sort=el('sort').value;
 if(sort==='price')state.filtered.sort((a,b)=>(a.mealCostEur??Infinity)-(b.mealCostEur??Infinity));
 if(sort==='verified')state.filtered.sort((a,b)=>(a.priceStatus==='confirmed'?0:1)-(b.priceStatus==='confirmed'?0:1));
 if(sort==='name')state.filtered.sort((a,b)=>a.name.localeCompare(b.name,'es'));
 draw();compare();
}
async function init(){
 el('filters').addEventListener('submit',filter);
 try{
  const res=await fetch('./data/places.json',{cache:'no-store'});
  if(!res.ok)throw Error('HTTP '+res.status);
  const data=await res.json();if(!Array.isArray(data))throw Error('Formato inválido');
  state.places=data.filter(validPlace);
  const areas=[...new Set(state.places.map(p=>p.area))].sort((a,b)=>a.localeCompare(b,'es'));
  for(const area of areas){const opt=document.createElement('option');opt.value=area;opt.textContent=area;el('area').append(opt)}
  filter();
 }catch(e){showEmpty('No se ha podido cargar la base de datos. Inténtalo de nuevo más tarde.');el('count').textContent='Sin datos'}
}
init();
