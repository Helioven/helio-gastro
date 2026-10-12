'use strict';
const state={places:[],filtered:[],selected:new Set(),favorites:new Set(),searched:false,appliedTerm:'',appliedScope:'dish',appliedPortion:'',appliedBudget:null,currentDetailId:null,mode:'comida'};
const el=id=>document.getElementById(id);
const MODE_CONFIG={
 desayuno:{label:'Desayunar',emoji:'☕',budgets:[3,5,7,10],dishes:['Tostadas','Churros','Molletes','Café','Bollería'],portions:[['unidad','Unidad'],['media-tostada','Media tostada'],['tostada-entera','Tostada entera'],['combinado','Desayuno combinado']],placeholder:'Tostadas, churros, molletes…'},
 comida:{label:'Comer',emoji:'🍽️',budgets:[10,15,20,30,50],dishes:['Flamenquín','Salmorejo','Rabo de toro','Croquetas','Mazamorra','Carrillada','Berenjenas','Pisto'],portions:[['unidad','Unidad'],['tapa','Tapa'],['media','Media ración'],['racion','Ración completa']],placeholder:'Flamenquín, salmorejo, carrillada…'},
 merienda:{label:'Merendar',emoji:'🥐',budgets:[3,5,8,12],dishes:['Churros','Chocolate','Pasteles','Tartas','Tostadas','Bollería','Café'],portions:[['unidad','Unidad'],['racion','Ración'],['combinado','Merienda combinada']],placeholder:'Churros con chocolate, pasteles…'},
 cena:{label:'Cenar',emoji:'🌙',budgets:[10,15,20,30,50],dishes:['Tapas','Flamenquín','Croquetas','Tortilla','Rabo de toro','Salmorejo'],portions:[['unidad','Unidad'],['tapa','Tapa'],['media','Media ración'],['racion','Ración completa']],placeholder:'Tapas, tortilla, croquetas…'}
};

// Explanations are general cultural guidance, not claims about individual menus.
const DISH_EXPLANATIONS_EN={"Flamenquín":"Breaded rolled meat, a Córdoba speciality; fillings vary.","Salmorejo":"Thick chilled tomato and bread soup, traditionally served with toppings.","Rabo de toro":"Slow-braised oxtail stew.","Croquetas":"Crisp, breaded croquettes with a creamy filling.","Mazamorra":"Chilled almond and bread cream, a traditional Córdoba dish.","Carrillada":"Slow-cooked pork or beef cheeks.","Berenjenas":"Aubergine dishes; preparation varies by restaurant.","Pisto":"Spanish vegetable stew, usually made with seasonal vegetables.","Bollería":"Sweet baked goods and breakfast pastries, such as croissants, muffins and filled pastries.","Tostadas":"Toasted bread, usually served with olive oil, tomato, butter or ham.","Churros":"Fried dough pastries, often served with hot chocolate.","Molletes":"Soft Andalusian bread rolls, commonly toasted with olive oil and tomato.","Café":"Coffee drinks, such as espresso and café con leche (coffee with milk).","Chocolate":"Thick Spanish-style hot chocolate, often served as a dip for churros.","Pasteles":"Individual sweet pastries, such as custard slices, cream-filled pastries and fruit tartlets.","Tartas":"Slices of cakes and cheesecakes; flavours and serving sizes vary.","Tapas":"Small portions of food served as snacks or shared dishes.","Tortilla":"Spanish potato omelette; ingredients can vary."};
function dishExplanation(name){return DISH_EXPLANATIONS_EN[name]||'';}

function piscatoriaSweetExplanation(name){
 const n=clean(name);
 if(n==='bolleria')return 'Choose from croissant, chocolate napolitana, chocolate horseshoe pastry or puff-pastry palmier; selection may vary.';
 if(n==='dulces por porcion')return 'Choose from mille-feuille, ensaimada, tocino de cielo or cream-filled choux pastry; selection may vary.';
 if(n.includes('pastel cordobes'))return 'Cordoban pastry: classic, nuts and raisins, pistachio or Lotus varieties.';
 if(n.includes('bowl de yogur griego'))return 'Greek yoghurt with a choice of seasonal fruit, granola, honey, flax or chia seeds, pumpkin seeds, walnuts or peanut butter.';
 if(n.includes('copa de helado'))return 'Two scoops with a choice of vanilla or chocolate ice cream and listed toppings.';
 if(n.includes('pizzella de cuatro quesos'))return 'Four-cheese pizzella.';
 if(n.includes('pizzella de york y queso'))return 'Pizzella with cooked ham and cheese.';
 return '';
}
function detailDishExplanation(name,placeId=''){
 if(placeId==='la-piscatoria'){const description=piscatoriaSweetExplanation(name);if(description)return description;}
 if(placeId==='la-piscatoria'&&/tostada/i.test(name)){
  const n=clean(name);
  if(n.includes('clasica'))return 'Choose olive oil, butter, jam, tomato, pâté, cream cheese, cooked ham spread, pork spread or sobrasada.';
  if(n.includes('especial'))return 'Choose Serrano ham, cooked ham, cheese, avocado, salmon or tuna.';
  if(n.includes('gratinada'))return 'Gratinated toast: choose cheese, cooked ham, bacon, tuna or tomato.';
 }
 const normalized=clean(name);
 const special=[
  [/cochifrito.*salsa brava/,'Crisp-fried pork served with brava sauce.'],
  [/cochifrito/,'Traditional fried pork dish; preparation varies.'],
  [/venado/,'Venison dish.'],
  [/boquerones/,'Anchovies, often served fried.'],
  [/bacalao/,'Cod dish; preparation varies.'],
  [/chipirones/,'Small squid dish.'],
  [/huevos rotos/,'Fried eggs served over potatoes.'],
  [/solomillo/,'Pork tenderloin dish.'],
  [/torrijas/,'Traditional Spanish bread dessert.'],
  [/jamon iberico/,'Iberian cured ham.'],
  [/queso curado/,'Aged cheese.'],
  [/churrasco/,'Grilled meat dish.'],
  [/chuleton/,'Large beef steak.'],
  [/montaditos/,'Small sandwiches.'],
  [/ensaladilla/,'Spanish-style potato salad.'],
  [/salazones|conservas/,'Salt-cured and preserved foods.'],
  [/casqueria/,'Traditional offal dishes.'],
  [/frituras/,'Assorted fried dishes.'],
  [/cocina cordobesa|cocina tradicional|carta de temporada|tapas y platos tradicionales|tapas tradicionales/,'Traditional regional dishes; selection varies.'],
  [/menu degustacion/,'Tasting menu.'],
  [/tarta de queso|cheesecake/,'Cheesecake.'],
  [/brownie/,'Chocolate brownie.'],
  [/cookies/,'Sweet cookies.'],
  [/tortitas/,'Pancakes.'],
  [/tarta de zanahoria/,'Carrot cake.'],
  [/tarta de chocolate/,'Chocolate cake.'],
  [/tarta de limon/,'Lemon cake.'],
  [/tartas/,'Assorted cakes.'],
  [/pasteles/,'Assorted sweet pastries.'],
  [/zumo de naranja/,'Fresh orange juice.'],
  [/jeringos/,'Andalusian-style fried dough pastries.'],
  [/berenjenas.*miel/,'Fried aubergines with honey.'],
  [/carrillada.*salsa/,'Slow-cooked cheeks served in sauce.'],
  [/croquetas.*rabo/,'Croquettes made with oxtail.'],
  [/croquetas.*jamon/,'Croquettes with ham.'],
  [/flamenquin.*rabo/,'Breaded rolled meat with oxtail filling.'],
  [/flamenquin/,'Breaded rolled meat, a Córdoba speciality; fillings vary.'],
  [/salmorejo/,'Thick chilled tomato and bread soup.'],
  [/rabo de toro/,'Slow-braised oxtail stew.'],
  [/carrillada/,'Slow-cooked pork or beef cheeks.'],
  [/berenjenas/,'Aubergine dish; preparation varies.'],
  [/croquetas/,'Crisp breaded croquettes with a creamy filling.'],
  [/mazamorra/,'Chilled almond and bread cream.'],
  [/pisto/,'Spanish vegetable stew.'],
  [/codillo/,'Pork knuckle.'],
  [/carne con tomate/,'Meat cooked in tomato sauce.'],
  [/tortilla/,'Spanish omelette.'],
  [/tostada.*basica/,'Choose olive oil, tomato, pâté, butter, jam or honey.'],
  [/tostada.*untar/,'Choose cooked ham spread, guacamole, cream cheese or pork loin spread.'],
  [/tostada.*mixta/,'Choose two: tomato, cured ham, cooked ham, guacamole, butter, honey, jam or cream cheese.'],
  [/tostada.*gratinada/,'Toasted with butter, cooked ham and cheese.'],
  [/tostada.*jamon york y queso/,'Toast with cooked ham and cheese.'],
  [/tostada.*pavo y queso/,'Toast with turkey and cheese.'],
  [/tostada.*crema de york/,'Toast with cooked ham spread.'],
  [/tostada.*trocitos de jamon/,'Toast with diced ham.'],
  [/tostada.*lonchas de jamon/,'Toast with slices of ham.'],
  [/tostada.*mantequilla y mermelada/,'Toast with butter and jam.'],
  [/tostada.*(?:aceite y tomate|tomate y aceite)/,'Toast with olive oil and tomato.'],
  [/tostada.*aceite o tomate/,'Toast with olive oil or tomato.'],
  [/tostada.*(?:mantequilla o pate|mantequilla|pate)/,'Toast with butter or pâté.'],
  [/tostada.*jamon york/,'Toast with cooked ham.'],
  [/tostada.*pavo/,'Toast with turkey.'],
  [/tostada.*(?:jamon|serrano)/,'Toast with ham.'],
  [/tostada.*(?:aceite|tomate)/,'Toast with olive oil or tomato.'],
  [/tostada/,'Toasted bread with a choice of toppings.'],
  [/bolleria mini/,'Mini-sized assorted breakfast pastries.'],
  [/magdalena/,'Traditional Spanish sponge cake, usually served at breakfast.'],
  [/donut/,'Ring-shaped sweet doughnut, plain or chocolate-coated.'],
  [/croissant|croisan/,'Flaky, buttery crescent-shaped pastry.'],
  [/bollo de leche/,'Soft, lightly sweetened milk bread roll.'],
  [/palmera/,'Crisp, palm-shaped puff pastry, sometimes coated in chocolate.'],
  [/napolitana/,'Rectangular puff pastry, usually filled with chocolate or cream.'],
  [/berlina/,'Soft filled doughnut, often with whipped cream or custard.'],
  [/milhoja/,'Layered puff pastry with a sweet filling.'],
  [/tartaleta/,'Small sweet tart with a pastry base and filling.'],
  [/pastelon/,'Slice of a traditional layered pastry cake.'],
  [/gofre/,'Waffle, often served with a sweet topping.'],
  [/chocolate (?:caliente|a la taza)/,'Traditional Spanish hot chocolate, usually thick and served warm; often enjoyed with churros.'],
  [/churros/,'Fried dough pastries.'],
  [/mollete/,'Soft bread roll.'],
  [/tostada/,'Toasted bread.'],
  [/cafe con leche/,'Espresso-style coffee served with milk.'],
  [/cafe solo/,'A small, strong black coffee, similar to espresso.'],
  [/cafe cortado/,'Espresso with a small splash of milk.'],
  [/cafe americano/,'Espresso diluted with hot water.'],
  [/cafe/,'Coffee; preparation depends on the menu.']
 ];
 const found=special.find(([pattern])=>pattern.test(normalized));
 return found?found[1]:'';
}
function appendDetailExplanation(container,name,placeId=''){
 const explanation=detailDishExplanation(name,placeId);
 if(!explanation)return;
 const node=document.createElement('small');
 node.className='dish-explanation detail-dish-explanation';
 node.dataset.dishExplanation='';
 node.textContent=explanation;
 node.hidden=window.HelioGastroLanguage?.get()!=='en';
 container.append(node);
}
function refreshDishExplanations(){
 const english=window.HelioGastroLanguage?.get()==='en';
 document.querySelectorAll('[data-dish-explanation]').forEach(node=>{node.hidden=!english;});
 const help=el('portion-help');if(help)help.hidden=!english;
}
const DISH_ICONS={
 flamenquin:'🥩',salmorejo:'🥣','rabo de toro':'🍲',croquetas:'🍘',
 mazamorra:'🥣',carrillada:'🍖',berenjenas:'🍆',pisto:'🍳',
 tostadas:'🥖',churros:'🍩',molletes:'🥪',cafe:'☕',
 chocolate:'🍫',pasteles:'🧁',tartas:'🍰',tapas:'🍢',tortilla:'🍳'
};
function dishIcon(name){return DISH_ICONS[clean(name)]||'🍴'}
const MODE_KEY='helio-gastro-meal-mode-v1';
function serviceMenus(p){
 const specific=p.menus.filter(m=>m.service===state.mode);
 // La carta general sirve solo para explorar platos, no confirma el servicio ni horario.
 return specific.length?specific:(state.mode==='comida'||state.mode==='cena'?p.menus.filter(m=>m.service==='general'):[]);
}
function serviceDishes(p){return serviceMenus(p).flatMap(m=>m.dishes)}
function servicePrices(p){return serviceMenus(p).flatMap(m=>m.dishPrices)}
function serviceKnown(p){return p.menus.some(m=>m.service===state.mode)}
function updateMealMode(mode,{reset=true}={}){
 if(!Object.hasOwn(MODE_CONFIG,mode))return;
 state.mode=mode;
 try{localStorage.setItem(MODE_KEY,mode)}catch{}
 const cfg=MODE_CONFIG[mode];
 for(const btn of document.querySelectorAll('[data-service]')){
  btn.setAttribute('aria-pressed',String(btn.dataset.service===mode));
 }
 const budget=el('budget'),oldBudget=reset?'':budget.value;budget.replaceChildren();
 const unlimited=document.createElement('option');unlimited.value='';unlimited.textContent='Sin límite';budget.append(unlimited);
 for(const value of cfg.budgets){const opt=document.createElement('option');opt.value=String(value);opt.textContent=value+' €';budget.append(opt)}
 budget.value=cfg.budgets.some(n=>String(n)===oldBudget)?oldBudget:'';
 const portion=el('portion'),oldPortion=reset?'':portion.value;portion.replaceChildren();
 const any=document.createElement('option');any.value='';any.textContent='Cualquier formato';portion.append(any);
 for(const [value,label] of cfg.portions){const opt=document.createElement('option');opt.value=value;opt.textContent=label;portion.append(opt)}
 portion.value=cfg.portions.some(([v])=>v===oldPortion)?oldPortion:'';
 portion.disabled=el('price-scope').value==='meal';
 el('dish').placeholder=cfg.placeholder;
 el('budget-label').textContent=mode==='desayuno'?'Presupuesto de desayuno':mode==='merienda'?'Presupuesto de merienda':'Presupuesto máximo';
 const documented=state.places.filter(p=>p.menus.some(m=>m.service===mode)).length;
 const serviceMessage=documented
  ?'Tenemos '+documented+' locales con especialidades registradas para este servicio. Los precios y horarios concretos siguen pendientes de confirmar.'
  :'Estamos preparando cartas de '+cfg.label.toLowerCase()+'. Todavía no hay locales con especialidades documentadas para este servicio.';
 el('service-intro').textContent=(mode==='desayuno'||mode==='merienda')?serviceMessage
  :'Puedes explorar las cartas generales existentes; el servicio de '+cfg.label.toLowerCase()+' y su horario siguen pendientes de verificar.';
 el('service-results-note').textContent=(mode==='desayuno'||mode==='merienda')
  ?serviceMessage
  :'Se muestran cartas generales para explorar opciones. No confirman que el local sirva este plato a la hora elegida.';
 const dishSuggestions=el('dish-suggestions-list');dishSuggestions.replaceChildren();
 for(const dish of cfg.dishes){const btn=document.createElement('button');btn.type='button';btn.textContent=dish;btn.addEventListener('click',()=>{el('dish').value=dish;el('dish').focus()});dishSuggestions.append(btn)}
 renderRecommendations();
 if(reset){
  el('dish').value='';el('place-name').value='';
  state.searched=state.selected.size>0;state.filtered=[];state.currentDetailId=null;
  el('results-section').hidden=true;el('compare-section').hidden=state.selected.size===0;el('detail-section').hidden=true;
   if(state.selected.size)compare();
  el('coverage-summary').hidden=true;el('show-offering').hidden=true;
  updateQuickNav();
  try{localStorage.removeItem(SEARCH_KEY)}catch{}
 }
}

const fmt=n=>typeof n==='number'?new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n):'No disponible';
const clean=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const SERVICE_TYPES={
 general:'Carta general (horario sin verificar)',
 desayuno:'Desayuno',
 comida:'Comida',
 merienda:'Merienda',
 cena:'Cena'
};
function normalizePlace(raw){
 if(!raw||typeof raw!=='object')return raw;
 // Conversión de la antigua carta plana para consumidores existentes.
 const menus=Array.isArray(raw.menus)?raw.menus:
  [{service:'general',dishes:raw.dishes,dishPrices:raw.dishPrices}];
 const safeMenus=menus.filter(m=>m&&Object.hasOwn(SERVICE_TYPES,m.service)
  &&Array.isArray(m.dishes)&&Array.isArray(m.dishPrices)
  &&m.dishes.every(d=>typeof d==='string')
  &&m.dishPrices.every(item=>item&&typeof item.dish==='string'
   &&Number.isFinite(item.eur)&&item.eur>=0));
 const allDishes=[...new Set(safeMenus.flatMap(m=>m.dishes))];
 const allPrices=safeMenus.flatMap(m=>m.dishPrices.map(price=>({...price,service:m.service})));
 return {...raw,menus:safeMenus,dishes:allDishes,dishPrices:allPrices};
}

function validPlace(p){
 return p&&typeof p.id==='string'&&typeof p.name==='string'&&typeof p.area==='string'
 &&Array.isArray(p.dishes)&&p.menus.length>0&&Array.isArray(p.sources)&&['confirmed','estimated','unknown'].includes(p.priceStatus)
 &&(p.mealCostEur===null||Number.isFinite(p.mealCostEur));
}
function dishPrices(p){return(Array.isArray(p.dishPrices)?p.dishPrices:[]).filter(d=>typeof d.dish==='string'&&Number.isFinite(d.eur)&&d.eur>=0)}
const PORTIONS={unidad:'Unidad',tapa:'Tapa',media:'Media ración',racion:'Ración completa','media-tostada':'Media tostada','tostada-entera':'Tostada entera',combinado:'Combinado',desconocida:'Formato sin especificar'};
function portionOf(item){
 if(PORTIONS[item.portion])return item.portion;
 const name=clean(item.dish);
 if(/\bmedia(?:\s+racion)?\b/.test(name))return 'media';
 if(/\btapa\b/.test(name))return 'tapa';
 if(/\bunidad\b/.test(name))return 'unidad';
 if(/\bracion\b/.test(name))return 'racion';
 return 'desconocida';
}
function relevantPrices(p,term,portion=''){return dishPrices(p).filter(d=>(!term||clean(d.dish).includes(term))&&(!portion||portionOf(d)===portion))}
function lowestPrice(p,scope,term,portion=''){
 if(scope==='meal')return Number.isFinite(p.mealCostEur)?p.mealCostEur:null;
 const arr=relevantPrices(p,term,portion);return arr.length?Math.min(...arr.map(x=>x.eur)):null;
}
function variantOf(item){
 const s=clean(item.dish);
 if(s.includes('flamenquin')){
  if(s.includes('rabo de toro'))return 'flamenquin-rabo';
  if(s.includes('jamon')||s.includes('cordobes'))return 'flamenquin-tradicional';
  return 'flamenquin-otra';
 }
 if(s.includes('croqueta')){
  if(s.includes('rabo de toro'))return 'croquetas-rabo';
  if(s.includes('jamon')&&s.includes('cocido'))return 'croquetas-jamon-cocido';
  if(s.includes('jamon')&&s.includes('puchero'))return 'croquetas-jamon-puchero';
  if(s.includes('jamon'))return 'croquetas-jamon';
  if(s.includes('salmon'))return 'croquetas-salmon';
  if(s.includes('boniato'))return 'croquetas-boniato';
  return 'croquetas-otras';
 }
 return 'other:'+s.replace(/\s*\((?:media racion|racion|tapa|unidad|media)\)/g,'').trim();
}
const VARIANT_NAMES={
 'flamenquin-rabo':'Flamenquín de rabo de toro',
 'flamenquin-tradicional':'Flamenquín tradicional / jamón',
 'flamenquin-otra':'Otro flamenquín',
 'croquetas-rabo':'Croquetas de rabo de toro',
 'croquetas-jamon-cocido':'Croquetas de jamón y cocido',
 'croquetas-jamon-puchero':'Croquetas de jamón y puchero',
 'croquetas-jamon':'Croquetas de jamón',
 'croquetas-salmon':'Croquetas de salmón',
 'croquetas-boniato':'Croquetas de boniato',
 'croquetas-otras':'Otras croquetas'
};

function localizedPortion(value){
 const es=PORTIONS[value]||value;
 const en={'unidad':'Single item','tapa':'Tapa (small serving)','media':'Half portion','racion':'Full portion','media-tostada':'Half toast','tostada-entera':'Full toast','combinado':'Combo','desconocida':'Portion not specified'};
 return es; // Translation is applied by the language layer, enabling reliable EN → ES.
}
function variantLabel(item){const key=variantOf(item);return VARIANT_NAMES[key]||'Variante sin categorizar'}
function priceDescriptor(item){
 const format=portionOf(item);
 const dishHasFormat=/\b(media(?:\s+racion)?|racion|tapa|unidad)\b/.test(clean(item.dish));
 return item.dish+' — '+fmt(item.eur)+(dishHasFormat?'':' · '+localizedPortion(format));
}
function comparableHighlights(items,term,portion){
 if(!term||!portion)return new Set();
 const groups=new Map();
 for(const p of items){
  for(const item of relevantPrices(p,term,portion)){
   const key=variantOf(item)+'|'+portion;
   if(!groups.has(key))groups.set(key,[]);
   groups.get(key).push({id:p.id,price:item.eur,dish:item.dish});
  }
 }
 const highlights=new Set();
 for(const group of groups.values()){
  if(new Set(group.map(x=>x.id)).size<2)continue;
  const cheapest=Math.min(...group.map(x=>x.price));
  for(const x of group)if(x.price===cheapest)highlights.add(x.id+'|'+x.dish+'|'+x.price);
 }
 return highlights;
}
function placeMapUrl(p){
 return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(p.name+', '+p.address);
}
function routeMapUrl(places){
 const addresses=places.map(p=>p.name+', '+p.address);
 if(addresses.length<2)return null;
 const origin=encodeURIComponent(addresses[0]),destination=encodeURIComponent(addresses[addresses.length-1]);
 const waypoints=addresses.slice(1,-1).map(encodeURIComponent).join('%7C');
 return 'https://www.google.com/maps/dir/?api=1&origin='+origin+'&destination='+destination+(waypoints?'&waypoints='+waypoints:'')+'&travelmode=walking';
}
function mapButton(p){
 const button=document.createElement('button');button.type='button';button.className='map-button';
 button.textContent='📍 Ver mapa';button.addEventListener('click',()=>showMap(p));return button;
}
function showMap(p){
 const dialog=el('map-dialog'),frame=el('map-frame');
 el('map-title').textContent=p.name;
 el('map-address').textContent=p.address;
 el('open-external-map').href=placeMapUrl(p);
 // El mapa se carga solo cuando el usuario solicita verlo.
 frame.title='Mapa de '+p.name;
 frame.src='https://maps.google.com/maps?q='+encodeURIComponent(p.name+', '+p.address)+'&output=embed';
 if(!dialog.open)dialog.showModal();
}
function closeMap(){
 el('map-dialog').close();
 el('map-frame').removeAttribute('src');
}
function routeButton(places){
 const href=routeMapUrl(places);
 if(!href)return null;
 const link=document.createElement('a');link.className='map-route-link';link.href=href;
 link.target='_blank';link.rel='noopener noreferrer';
 link.textContent='🚶 Ruta a pie entre '+places.length+' tabernas ↗';
 return link;
}

function showEmpty(message){const node=document.createElement('div');node.className='empty';node.textContent=message;el('results').replaceChildren(node)}
function groupFor(p) {
 const price=lowestPrice(p,state.appliedScope,state.appliedTerm,state.appliedPortion);
 if(price===null)return 'unknown';
 if(state.appliedBudget!==null && price>state.appliedBudget)return 'over';
 return 'verified';
}
const FAV_KEY='helio-gastro-favorites-v1';
function loadFavorites(){
 try{const saved=JSON.parse(localStorage.getItem(FAV_KEY)||'[]');return new Set(Array.isArray(saved)?saved.filter(id=>typeof id==='string'):[])}catch{return new Set()}
}
function toggleFavorite(id){
 if(state.favorites.has(id))state.favorites.delete(id);else state.favorites.add(id);
 try{localStorage.setItem(FAV_KEY,JSON.stringify([...state.favorites]))}catch{el('favorite-notice').textContent='No se han podido guardar favoritos en este navegador.'}
 renderFavorites();if(state.searched)draw();
 if(state.currentDetailId===id&&!el('detail-section').hidden){const place=state.places.find(p=>p.id===id);if(place)showPlace(place,false)}
}
function favoriteButton(p){
 const btn=document.createElement('button');btn.type='button';btn.className='fav-button';
 btn.textContent=(state.favorites.has(p.id)?'★ Guardado':'☆ Guardar');
 btn.setAttribute('aria-pressed',String(state.favorites.has(p.id)));
 btn.addEventListener('click',()=>toggleFavorite(p.id));
 return btn;
}
function renderFavorites(){
 const list=el('favorite-list');list.replaceChildren();
 const selected=state.places.filter(p=>state.favorites.has(p.id));
 el('favorite-count').textContent=selected.length+' favoritos';
 if(!selected.length){const msg=document.createElement('p');msg.className='note';msg.textContent='Aún no tienes tabernas guardadas. Marca ☆ en los resultados o fichas.';list.append(msg);return}
 for(const p of selected){
  const row=document.createElement('div');row.className='favorite-entry';
  const name=document.createElement('strong');name.textContent=p.name;
  const open=document.createElement('button');open.type='button';open.textContent='Ver ficha';open.addEventListener('click',()=>showPlace(p));
  row.append(name,open,mapButton(p),favoriteButton(p));list.append(row);
 }
}
const SEARCH_KEY='helio-gastro-search-v1';
const SEARCH_FIELDS=['place-name','dish','budget','price-scope','portion','area','include-unknown','price-kind','sort'];
function saveSearch(){
 if(!state.searched)return;
 const form={};
 for(const id of SEARCH_FIELDS){const node=el(id);form[id]=node.type==='checkbox'?node.checked:node.value}
 try{localStorage.setItem(SEARCH_KEY,JSON.stringify({form,selected:[...state.selected],mode:state.mode}))}catch{}
}
function restoreSearch(){
 let snapshot;
 try{snapshot=JSON.parse(localStorage.getItem(SEARCH_KEY)||'null')}catch{return false}
 if(!snapshot||typeof snapshot!=='object'||!snapshot.form||typeof snapshot.form!=='object')return false;
 if(typeof snapshot.mode==='string'&&Object.hasOwn(MODE_CONFIG,snapshot.mode))updateMealMode(snapshot.mode,{reset:false});
 for(const id of SEARCH_FIELDS){
  const node=el(id),saved=snapshot.form[id];
  if(id==='dish'||id==='place-name'){node.value=typeof saved==='string'?saved.slice(0,120):'';continue}
  if(node.type==='checkbox'){if(typeof saved==='boolean')node.checked=saved;continue}
  if(typeof saved==='string'&&[...node.options].some(opt=>opt.value===saved))node.value=saved;
 }
 el('portion').disabled=el('price-scope').value==='meal';
 state.selected=new Set((Array.isArray(snapshot.selected)?snapshot.selected:[])
  .filter(id=>typeof id==='string'&&state.places.some(p=>p.id===id)).slice(0,3));
 filter(null,true);
 return true;
}
function updateQuickNav(){
 const link=el('nav-compare');
 link.hidden=!state.searched;
 el('nav-compare-count').textContent=String(state.selected.size);
}

function draw(){
 const list=el('results');list.replaceChildren();
 el('count').textContent=state.filtered.length+' '+(state.filtered.length===1?'lugar':'lugares');
 if(!state.places.length){showEmpty('Todavía no hemos incorporado establecimientos verificados. Empezaremos por una selección pequeña y documentada de Córdoba.');return}
 if(!state.filtered.length){showEmpty((state.mode==='desayuno'||state.mode==='merienda')?'Todavía no tenemos cartas verificadas para este servicio. Estamos preparando el catálogo; no significa que los locales no lo ofrezcan.':'No hay establecimientos que coincidan con los filtros seleccionados. Los horarios y servicios de las cartas generales siguen sin verificar.');return}
 let previousGroup='';
 const ordered=[...state.filtered].sort((x,y)=>{
  const rank={verified:0,unknown:1,over:2};
  return rank[groupFor(x)]-rank[groupFor(y)];
 });
 for(const p of ordered){
  const group=state.appliedTerm?groupFor(p):'all';
  if(group!==previousGroup){
   const heading=document.createElement('h3');heading.className='result-group-title';
   heading.textContent=!state.appliedTerm?'Establecimientos encontrados':group==='verified'?'✓ Con precio documentado'+(state.appliedBudget!==null?' dentro del presupuesto':''):
     group==='unknown'?'También ofrecen el plato · Precio pendiente de confirmar':'Precio superior al presupuesto';
   list.append(heading);previousGroup=group;
  }
  const card=document.createElement('article');card.className='place';
  const title=document.createElement('h3');title.textContent=p.name;card.append(title);
  const details=document.createElement('p');details.textContent='📍 '+p.area;card.append(details);
  const serviceNote=document.createElement('p');serviceNote.className='service-notice';serviceNote.textContent=serviceKnown(p)?'Carta específica registrada · horario pendiente de confirmar':'Carta general · servicio y horarios sin verificar';card.append(serviceNote);
  if(state.appliedTerm){
   const matches=p.dishes.filter(d=>clean(d).includes(state.appliedTerm));
   const matched=document.createElement('p');matched.className='matching-dishes';
   matched.textContent=matches.length?'🍴 Plato encontrado: '+matches.join(' · '):'Coincidencia con el nombre del local';
   card.append(matched);
  } else {
   const dishes=document.createElement('p');dishes.textContent='Especialidades: '+p.dishes.join(', ');card.append(dishes);
  }
  const chosen=relevantPrices(p,state.appliedTerm,state.appliedScope==='dish'?state.appliedPortion:'');
  const cost=lowestPrice(p,state.appliedScope,state.appliedTerm,state.appliedPortion);
  if(!state.appliedTerm){
   const summary=document.createElement('p');summary.className='result-pending';
   summary.textContent=dishPrices(p).length?dishPrices(p).length+' precio(s) de carta documentado(s) · Ver ficha para detalles':'Consulta especialidades y fuentes en la ficha';
   card.append(summary);
  }else if(chosen.length){
   const cheapest=[...chosen].sort((a,b)=>a.eur-b.eur)[0];
   const main=document.createElement('p');main.className='result-main-price';
   main.textContent='Desde '+fmt(cheapest.eur)+' · '+(state.appliedPortion?localizedPortion(state.appliedPortion):'Precio de plato publicado');
   card.append(main);
  }else{
   const pending=document.createElement('p');pending.className='result-pending';
   pending.textContent='Precio del plato'+(state.appliedPortion?' en este formato':'')+' pendiente de confirmar';
   card.append(pending);
  }
  if(state.appliedBudget!==null&&cost===null){
   const warning=document.createElement('p');warning.className='note';
   warning.textContent='No podemos confirmar que cumpla el presupuesto indicado.';card.append(warning);
  }
  if(state.appliedScope==='meal'&&Number.isFinite(p.mealCostEur)){
   const meal=document.createElement('p');meal.textContent='Coste de comida por persona: '+fmt(p.mealCostEur);card.append(meal);
  }
  const detailButton=document.createElement('button');detailButton.type='button';detailButton.className='detail-button';
  detailButton.textContent='Ver ficha completa';detailButton.addEventListener('click',()=>showPlace(p));card.append(detailButton,mapButton(p));
  const button=document.createElement('button');button.type='button';button.textContent=state.selected.has(p.id)?'✓ Quitar del comparador':'+ Comparar';
  button.setAttribute('aria-pressed',String(state.selected.has(p.id)));
  button.addEventListener('click',()=>{
   if(state.selected.has(p.id))state.selected.delete(p.id);
   else if(state.selected.size<3)state.selected.add(p.id);
   else {el('compare-output').textContent='Puedes comparar hasta tres sitios. Quita uno antes de añadir otro.';return}
   draw();compare();saveSearch();updateQuickNav();
  });card.append(button,favoriteButton(p));list.append(card);
 }
}
function menuDishName(item){
 const name=item.dish.replace(/\s*\((?:media(?:\s+ración)?|ración|tapa|unidad|media)\)\s*$/i,'').trim();
 // Portion prefixes describe a serving size, not a separate dish.
 // Only normalize prefixes when the explicit portion agrees.
 if(portionOf(item)==='media'&&/^media ración de /i.test(name))return name.replace(/^media ración de /i,'');
 if(portionOf(item)==='racion'&&/^ración de /i.test(name))return name.replace(/^ración de /i,'');
 if(portionOf(item)==='media-tostada'&&/^media tostada de /i.test(name))return name.replace(/^media tostada de /i,'Tostada de ');
 if(portionOf(item)==='tostada-entera'&&/^tostada entera de /i.test(name))return name.replace(/^tostada entera de /i,'Tostada de ');
 return name;
}
function menuGroups(p){
 const groups=[];
 for(const item of dishPrices(p)){
  let label=menuDishName(item);
  if(p.id==='cafeteria-bar-la-jineta'&&/tostada/i.test(item.dish))label='Tostada '+(clean(item.dish).match(/\b(basica|untar|mixta|gratinada)\b/)||[])[1];
  if(p.id==='la-piscatoria'&&/tostada/i.test(item.dish))label='Tostada '+(clean(item.dish).match(/\b(clasica|especial|gratinada)\b/)||[])[1];
  const key=clean(label);
  let group=groups.find(g=>g.key===key);
  if(!group){group={key,label,prices:[]};groups.push(group)}
  if(!group.prices.some(price=>price.dish===item.dish&&price.eur===item.eur&&portionOf(price)===portionOf(item)))group.prices.push(item);
 }
 const unpriced=p.dishes.filter(d=>{
  if(d.includes('(disponibilidad en merienda por confirmar)'))return false;
  const key=clean(d);
  if(p.id==='cafeteria-bar-la-jineta'&&/^tostada(?:s|\s)/.test(key)&&groups.some(g=>g.key.startsWith('tostada ')))return false;
  if(p.id==='la-piscatoria'&&key==='tostadas'&&groups.some(g=>g.key.startsWith('tostada ')))return false;
  // A priced variant may have a different descriptive suffix or prefix.
  // Only collapse clear word-boundary matches; never infer a price for a distinct dish.
  return !groups.some(g=>g.key===key||g.key.startsWith(key+' ')||key.startsWith(g.key+' ')||
   g.key.startsWith(key+' con ')||g.key.startsWith(key+' de ')||
   g.key.endsWith(' '+key));
 });
 return {groups,unpriced};
}
function showPlace(p,scroll=true){
 state.currentDetailId=p.id;
 el('detail-sticky-name').textContent=p.name;
 const panel=el('detail-content');panel.replaceChildren();
 const title=document.createElement('h2');title.id='detail-title';title.tabIndex=-1;title.textContent=p.name;panel.append(title,favoriteButton(p));
 const address=document.createElement('p');address.textContent='📍 '+p.address;panel.append(address);
 if(p.openingHoursNote){
  const hours=document.createElement('p');hours.className='service-notice';
  hours.textContent='🕒 '+p.openingHoursNote;panel.append(hours);
 }

 panel.append(mapButton(p));
 const map=document.createElement('a');map.href=placeMapUrl(p);map.target='_blank';map.rel='noopener noreferrer';map.textContent='Abrir en Google Maps ↗';panel.append(map);
 const menu=menuGroups(p);
 const heading=document.createElement('h3');heading.textContent='Carta y especialidades';panel.append(heading);
 if(menu.groups.length){
  const list=document.createElement('div');list.className='menu-groups';
  for(const group of menu.groups){
   const entry=document.createElement('section');entry.className='menu-dish';
   const name=document.createElement('h4');name.dataset.keepDishSpanish='';name.textContent=group.label;entry.append(name);appendDetailExplanation(entry,group.label,p.id);
   for(const price of group.prices){
    const row=document.createElement('div');row.className='menu-price-row';
    const portion=document.createElement('span');portion.textContent=p.id==='cafeteria-bar-la-jineta'&&/tostada/i.test(price.dish)?(portionOf(price)==='media-tostada'?'Media tostada':'Tostada entera')+(clean(price.dish).includes('sin cafe')?' · Sin café':' · Con café'):localizedPortion(portionOf(price));
    const amount=document.createElement('strong');amount.textContent=fmt(price.eur);
    if(p.id==='la-piscatoria'&&group.prices.length===1&&portionOf(price)==='unidad')portion.textContent='';
    row.append(portion,amount);entry.append(row);
   }
   list.append(entry);
   if(p.id==='la-piscatoria'&&clean(group.label)==='tostada gratinada'&&Array.isArray(p.menuNotes)&&p.menuNotes.length){
    const note=document.createElement('p');note.className='note';note.textContent=p.menuNotes[0];note.dataset.piscatoriaBreadNote='';list.append(note);
   }
  }
  panel.append(list);
 }
 if(menu.unpriced.length){
  const label=document.createElement('h4');label.className='menu-unpriced-title';label.textContent='Otras especialidades · precios pendientes';panel.append(label);
  const unpriced=document.createElement('ul');unpriced.className='menu-unpriced';
  for(const dish of menu.unpriced){const li=document.createElement('li');const name=document.createElement('span');name.dataset.keepDishSpanish='';name.textContent=dish;li.append(name);appendDetailExplanation(li,dish,p.id);unpriced.append(li)}
  panel.append(unpriced);
 }else if(!menu.groups.length){
  const msg=document.createElement('p');msg.className='note';msg.textContent='Aún no tenemos especialidades registradas para este local.';panel.append(msg);
 }
 if(Number.isFinite(p.mealCostEur)){const total=document.createElement('p');total.textContent='Comida completa por persona: '+fmt(p.mealCostEur);panel.append(total)}
 else{const caveat=document.createElement('p');caveat.className='note';caveat.textContent='El coste total de comer aquí no está documentado. Los precios de platos no incluyen necesariamente bebida ni extras.';panel.append(caveat)}
 if(Array.isArray(p.groupMenus)&&p.groupMenus.length){const label=document.createElement('h3');label.textContent='Menús para grupos';panel.append(label);for(const m of p.groupMenus){const text=document.createElement('p');text.textContent=m.name+' · '+fmt(m.eurPerPerson)+'/persona · mínimo '+m.minPeople+' comensales';panel.append(text)}}
 const sources=document.createElement('h3');sources.textContent='Fuentes y fecha';panel.append(sources);
 const checked=document.createElement('p');checked.textContent='Última consulta: '+(p.checkedAt||'Sin fecha registrada');panel.append(checked);
 for(const source of p.sources){if(!/^https:\/\//.test(source.url))continue;const a=document.createElement('a');a.href=source.url;a.textContent=source.label+' ↗';a.target='_blank';a.rel='noopener noreferrer';a.className='detail-source';panel.append(a)}
 el('detail-section').hidden=false;
 if(scroll){el('detail-section').scrollIntoView({behavior:'auto',block:'start'});el('detail-title').focus({preventScroll:true})}
}
function compare(){
 const panel=el('compare-output');panel.replaceChildren();
 const items=state.places.filter(p=>state.selected.has(p.id));
 el('compare-count').textContent=items.length+' / 3';
 if(!items.length){panel.className='empty';panel.textContent='Selecciona establecimientos de los resultados para compararlos aquí.';return}
 panel.className='';
 const term=state.appliedTerm;
 const pricesOnly=state.appliedScope==='dish'&&!!state.appliedPortion;
 const highlights=pricesOnly?comparableHighlights(items,term,state.appliedPortion):new Set();
 const advisory=document.createElement('p');advisory.className='note';
 advisory.textContent=pricesOnly?'Se comparan solo variantes coincidentes y el mismo formato declarado. «Menor precio» requiere al menos dos locales con esa variante. La cantidad real puede variar.':term?'Precios publicados para «'+(el('dish').value.trim()&&clean(el('dish').value.trim())===term?el('dish').value.trim():term)+'». Los formatos pueden ser distintos y no deben compararse como cantidades equivalentes.':'Selecciona un plato y un formato concreto para identificar precios comparables entre variantes equivalentes.';
 panel.append(advisory);
 const route=routeButton(items);if(route)panel.append(route);
 for(const p of items){
  const box=document.createElement('div');box.className='compare-place';
  const title=document.createElement('h3');title.textContent=p.name;box.append(title,mapButton(p));
  if(Number.isFinite(p.mealCostEur)){const cost=document.createElement('p');cost.textContent='Comida completa: '+fmt(p.mealCostEur);box.append(cost);}
  const prices=relevantPrices(p,term,state.appliedScope==='dish'?state.appliedPortion:'');
  const label=document.createElement('p');label.textContent=prices.length?'Platos con precio publicado:':term?'No hay precios documentados para este plato en el servicio seleccionado.':'No hay precios documentados para el servicio seleccionado.';box.append(label);
  const ul=document.createElement('ul');
  for(const item of prices){
   const li=document.createElement('li');
   const winning=highlights.has(p.id+'|'+item.dish+'|'+item.eur);
   li.textContent=priceDescriptor(item)+' · '+variantLabel(item)+(winning?' · ★ Menor precio comparable':'');
   if(winning)li.className='best-comparable';
   ul.append(li);
  }
  box.append(ul);
  if(!state.appliedPortion&&new Set(prices.map(portionOf)).size>1){
   const caution=document.createElement('p');caution.className='note';
   caution.textContent='Formatos diferentes: no comparamos cantidades ni asumimos tamaños equivalentes.';
   box.append(caution);
  }
  if(prices.some(item=>item.portion==='unidad')){
    const note=document.createElement('p');note.textContent='Precio por unidad: no comparable directamente con una ración.';box.append(note);
  }
  const foot=document.createElement('p');foot.textContent=p.sources.length+' fuente(s) · Revisado '+(p.checkedAt||'sin fecha');box.append(foot);
  panel.append(box);
 }
}
function getDishCoverage(term, area, nameQuery='') {
 const matches=state.places.filter(p=>serviceMenus(p).length>0&&(!nameQuery||clean(p.name).includes(nameQuery))&&(!term||clean(serviceDishes(p).join(' ')+' '+servicePrices(p).map(d=>d.dish).join(' ')).includes(term))&&(!area||p.area===area));
 const priced=matches.filter(p=>servicePrices(p).some(d=>!term||clean(d.dish).includes(term)));
 return {total:matches.length, priced:priced.length, unpriced:matches.length-priced.length};
}
function filter(event,restoring=false){
 if(event)event.preventDefault();
 const dish=clean(el('dish').value.trim()),nameQuery=clean(el('place-name').value.trim()),max=el('budget').value?Number(el('budget').value):null;
 state.appliedTerm=dish;state.appliedBudget=max;state.appliedScope=el('price-scope').value;state.appliedPortion=state.appliedScope==='dish'?el('portion').value:'';state.searched=true;
 el('results-section').hidden=false;
 el('compare-section').hidden=false;
 el('detail-section').hidden=true;
 state.currentDetailId=null;
 const area=el('area').value,kind=el('price-kind').value,scope=el('price-scope').value,includeUnknown=el('include-unknown').checked;
 state.filtered=state.places.filter(p=>{
  if(!serviceMenus(p).length)return false;
  if(nameQuery&&!clean(p.name).includes(nameQuery))return false;
  if(dish&&!clean(serviceDishes(p).join(' ')+' '+servicePrices(p).map(d=>d.dish).join(' ')).includes(dish))return false;
  if(area&&p.area!==area)return false;
  const price=lowestPrice(p,scope,dish,state.appliedPortion);
  if(max!==null&&(price>max||(price===null&&!includeUnknown)))return false;
  if(kind==='confirmed')return scope==='dish'?relevantPrices(p,dish,state.appliedPortion).length>0:p.priceStatus==='confirmed';
  if(kind==='estimated')return scope==='dish'?relevantPrices(p,dish,state.appliedPortion).length>0:['confirmed','estimated'].includes(p.priceStatus);
  return true;
 });
 const sort=el('sort').value;
 if(sort==='price')state.filtered.sort((x,y)=>(lowestPrice(x,scope,dish,state.appliedPortion)??Infinity)-(lowestPrice(y,scope,dish,state.appliedPortion)??Infinity));
 if(sort==='verified')state.filtered.sort((x,y)=>dishPrices(y).length-dishPrices(x).length);
 if(sort==='name')state.filtered.sort((x,y)=>x.name.localeCompare(y.name,'es'));
 el('budget-explain').textContent=scope==='dish'?
  'El presupuesto usa exclusivamente el formato seleccionado: unidad, tapa, media o ración. Si no hay precio de ese formato, se indica como desconocido.':
  'Presupuesto aplicado al coste total por persona. Los locales sin coste documentado pueden mostrarse, pero no se consideran dentro del límite.';
 const coverage=getDishCoverage(dish,area,nameQuery);
 const coverageBox=el('coverage-summary'), more=el('show-offering');
 coverageBox.hidden=!dish;
 more.hidden=!dish || !(coverage.unpriced>0 && (max!==null || kind!==''));
 if(dish){
  coverageBox.textContent='En nuestra base actual: '+coverage.total+' local(es) con «'+el('dish').value.trim()+'» registrado(s); '+coverage.priced+' con precio de ese plato documentado y '+coverage.unpriced+' sin precio. Esto NO representa todos los bares de Córdoba.';
 }
 draw();compare();updateQuickNav();
 if(!restoring){saveSearch();el('results-section').scrollIntoView({behavior:'auto',block:'start'});el('results-heading').focus({preventScroll:true});}
}
const QUICK_DISHES=[
 {name:'Flamenquín',icon:'🥩'}, {name:'Croquetas',icon:'🍘'},
 {name:'Salmorejo',icon:'🥣'}, {name:'Rabo de toro',icon:'🍲'},
 {name:'Mazamorra',icon:'🥣'}, {name:'Carrillada',icon:'🍖'},
 {name:'Berenjenas',icon:'🍆'}, {name:'Pisto',icon:'🍳'}
];
function recommendationDishMatches(dish,term){
 const value=clean(dish);
 // Las categorías de acceso rápido admiten singular/plural, pero no coincidencias
 // semánticamente erróneas: un brownie no es chocolate a la taza.
 if(state.mode==='merienda'&&term==='chocolate')return /\bchocolate\s+(?:a\s+la\s+taza|caliente|con\s+churros)\b/.test(value)||/\bchurros\s+con\s+chocolate\b/.test(value);
 if(term==='tostadas')return /\btostad(?:a|as)\b/.test(value);
 if(term==='bolleria')return /\b(?:bolleria|croissant(?:s)?|napolitana(?:s)?|magdalena(?:s)?|donut(?:s)?|palmera(?:s)?|berlina(?:s)?|bollo(?:s)?|hojaldre(?:s)?)\b/.test(value);
 if(term==='pasteles')return /\b(?:pastel(?:es)?|milhoja(?:s)?|tartaleta(?:s)?|berlina(?:s)?|palmera(?:s)?|croissant(?:s)?|napolitana(?:s)?|magdalena(?:s)?|donut(?:s)?|hojaldre(?:s)?|bollo(?:s)?|bolleria|semifrio(?:s)?|bizcocho(?:s)?)\b/.test(value);
 if(term==='tartas')return /\btarta(?:s)?\b/.test(value);
 return value.includes(term);
}
function recommendationEntries(term){
 const matches=state.places.filter(p=>serviceDishes(p).some(d=>recommendationDishMatches(d,term))||servicePrices(p).some(d=>recommendationDishMatches(d.dish,term)));
 const priced=matches.flatMap(p=>servicePrices(p).filter(item=>recommendationDishMatches(item.dish,term)).map(item=>({p,item,portion:portionOf(item),variant:variantOf(item)})));
 return {matches,priced};
}
function renderRecommendations(){
 const deck=el('recommendation-dishes');deck.replaceChildren();
 for(const name of MODE_CONFIG[state.mode].dishes){
  const dish={name,icon:dishIcon(name)};
  const term=clean(dish.name),data=recommendationEntries(term);
  const btn=document.createElement('button');btn.type='button';btn.className='recommendation-tile';
  const label=document.createElement('strong');label.textContent=dish.icon+' '+dish.name;
  const count=document.createElement('span');
  count.textContent=state.mode==='desayuno'||state.mode==='merienda'
   ?(data.matches.length?data.matches.length+' locales verificados · '+new Set(data.priced.map(x=>x.p.id)).size+' con precio':'⏳ Pendiente de incorporar cartas verificadas')
   :data.matches.length+' locales registrados · '+new Set(data.priced.map(x=>x.p.id)).size+' con precio';
  const description=document.createElement('small');description.className='dish-explanation';description.dataset.dishExplanation='';description.textContent=dishExplanation(dish.name);description.hidden=window.HelioGastroLanguage?.get()!=='en';
  btn.append(label,description,count);btn.addEventListener('click',()=>showRecommendations(dish.name));deck.append(btn);
 }
}
function recommendationCompareButton(p,dishName){
 const button=document.createElement('button');
 button.type='button';
 button.dataset.comparePlaceId=p.id;
 const refresh=()=>{
  const selected=state.selected.has(p.id);
  button.textContent=selected?'✓ Quitar del comparador':'+ Comparar';
  button.setAttribute('aria-pressed',String(selected));
 };
 refresh();
 button.addEventListener('click',()=>{
  // Use the same dish context as the quick recommendation when comparing prices.
  state.appliedTerm=clean(dishName);
  state.appliedScope='dish';
  state.appliedPortion='';
  if(state.selected.has(p.id))state.selected.delete(p.id);
  else if(state.selected.size<3)state.selected.add(p.id);
  else {window.alert('Puedes comparar hasta tres sitios. Quita uno antes de añadir otro.');return}
  state.searched=state.searched||state.selected.size>0;
  el('compare-section').hidden=state.selected.size===0;
  compare();updateQuickNav();saveSearch();
  document.querySelectorAll('#recommendation-results [data-compare-place-id]').forEach(node=>{
   const selected=state.selected.has(node.dataset.comparePlaceId);
   node.textContent=selected?'✓ Quitar del comparador':'+ Comparar';
   node.setAttribute('aria-pressed',String(selected));
  });
  if(!el('results-section').hidden)draw();
 });
 return button;
}
function openRecommendationPlace(p){
 el('recommendation-dialog').close();
 showPlace(p);
}
function showRecommendations(dishName){
 const term=clean(dishName),data=recommendationEntries(term),panel=el('recommendation-results');
 panel.replaceChildren();
 el('recommendation-title').textContent='Opciones de '+dishName.toLowerCase();
 const description=document.createElement('p');description.className='dish-explanation';description.dataset.dishExplanation='';description.textContent=dishExplanation(dishName);description.hidden=window.HelioGastroLanguage?.get()!=='en';panel.append(description);
 const context=document.createElement('p');context.className='service-notice';
 const pricedPlaceCount=new Set(data.priced.map(x=>x.p.id)).size;
 context.textContent=(state.mode==='desayuno'||state.mode==='merienda')
  ?(data.matches.length
    ?'Hay '+data.matches.length+' '+(data.matches.length===1?'local':'locales')+' con esta especialidad registrada para el servicio. '+(pricedPlaceCount?pricedPlaceCount+' '+(pricedPlaceCount===1?'local tiene':'locales tienen')+' precios documentados; ':'Precios pendientes de confirmar; ')+'horarios concretos pendientes de verificar.'
    :'Todavía no tenemos esta especialidad documentada para el servicio seleccionado.')
  :'Los platos proceden de cartas generales. No se ha confirmado que estén disponibles específicamente para '+MODE_CONFIG[state.mode].label.toLowerCase()+' ni a una hora determinada.';panel.append(context);
 const intro=document.createElement('p');intro.className='note';
 intro.textContent=(state.mode==='desayuno'||state.mode==='merienda')&&!data.matches.length
  ?'Todavía no disponemos de cartas verificadas para este servicio. No significa que las cafeterías o restaurantes estén cerrados o no lo sirvan.'
  :data.matches.length+' locales en nuestra base; '+new Set(data.priced.map(x=>x.p.id)).size+' con precios publicados. No es un ranking de calidad ni una lista completa de Córdoba.';
 panel.append(intro);
 const groups=new Map();
 for(const entry of data.priced){
  const key=entry.variant+'|'+entry.portion;
  if(!groups.has(key))groups.set(key,[]);
  groups.get(key).push(entry);
 }
 if(groups.size){
  const heading=document.createElement('h3');heading.textContent='Precios documentados por establecimiento';panel.append(heading);
  const byPlace=new Map();
  for(const entry of data.priced){
   if(!byPlace.has(entry.p.id))byPlace.set(entry.p.id,{place:entry.p,items:[]});
   byPlace.get(entry.p.id).items.push(entry);
  }
  for(const {place,items} of byPlace.values()){
   const card=document.createElement('section');card.className='recommendation-place';
   const title=document.createElement('h4');title.textContent=place.name;card.append(title);
   const list=document.createElement('ul');list.className='recommendation-place-items';
   for(const entry of items.sort((a,b)=>a.item.eur-b.item.eur)){
    const line=document.createElement('li');
    const label=document.createElement('span');label.dataset.keepDishSpanish='';label.textContent=entry.item.dish;
    const explanation=detailDishExplanation(entry.item.dish)||dishExplanation(entry.item.dish);
    if(explanation){const info=document.createElement('small');info.className='dish-explanation detail-dish-explanation';info.dataset.dishExplanation='';info.textContent=explanation;info.hidden=window.HelioGastroLanguage?.get()!=='en';label.append(document.createElement('br'),info);}
    const format=document.createElement('small');format.className='portion-tag';format.textContent=localizedPortion(entry.portion);
    const price=document.createElement('strong');price.textContent=fmt(entry.item.eur);
    line.append(label,format,price);list.append(line);
   }
   card.append(list);
   const actions=document.createElement('div');actions.className='recommendation-place-actions';
   const more=document.createElement('button');more.type='button';more.textContent='Ver ficha';more.addEventListener('click',()=>openRecommendationPlace(place));
   actions.append(more,mapButton(place),recommendationCompareButton(place,dishName));card.append(actions);panel.append(card);
  }
 }
 const known=new Set(data.priced.map(x=>x.p.id)),unknown=data.matches.filter(p=>!known.has(p.id));
 if(unknown.length){
  const heading=document.createElement('h3');heading.textContent='También ofrecen el plato · precio pendiente';panel.append(heading);
  for(const p of unknown){const row=document.createElement('div');row.className='recommendation-row';const name=document.createElement('span');name.textContent=p.name;const btn=document.createElement('button');btn.type='button';btn.textContent='Ver ficha';btn.addEventListener('click',()=>openRecommendationPlace(p));row.append(name,btn,mapButton(p),recommendationCompareButton(p,dishName));panel.append(row)}
 }
 el('recommendation-dialog').showModal();
}

function clearSearch(){
 el('filters').reset();
 updateMealMode(state.mode,{reset:false});
 el('portion').disabled=false;
 state.filtered=[];
 state.searched=state.selected.size>0;
 updateQuickNav();
 state.appliedTerm='';
 state.appliedScope='dish';
 state.appliedPortion='';
 state.appliedBudget=null;
 state.currentDetailId=null;
 el('results-section').hidden=true;
 el('compare-section').hidden=state.selected.size===0;
 el('detail-section').hidden=true;
 el('coverage-summary').hidden=true;
 el('show-offering').hidden=true;
 el('budget-explain').textContent='Límite aplicado al precio de un plato, no a una comida completa.';
 compare();
 if(state.selected.size)saveSearch();else try{localStorage.removeItem(SEARCH_KEY)}catch{}
 el('dish').focus();
}
async function init(){
 document.querySelectorAll('[data-service]').forEach(btn=>btn.addEventListener('click',()=>updateMealMode(btn.dataset.service)));
 el('filters').addEventListener('submit',filter);
 el('close-recommendations').addEventListener('click',()=>el('recommendation-dialog').close());
 el('close-map').addEventListener('click',closeMap);
 el('map-dialog').addEventListener('close',()=>el('map-frame').removeAttribute('src'));
 el('map-dialog').addEventListener('click',event=>{if(event.target===el('map-dialog'))closeMap()});
 el('clear-search').addEventListener('click',clearSearch);
 el('close-detail').addEventListener('click',()=>{el('detail-section').hidden=true;el('results-heading').focus();});
 el('price-scope').addEventListener('change',()=>{el('portion').disabled=el('price-scope').value==='meal';});
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
  state.places=data.map(normalizePlace).filter(validPlace);
  state.favorites=new Set([...loadFavorites()].filter(id=>state.places.some(p=>p.id===id)));
  renderFavorites();
  updateMealMode((()=>{try{return localStorage.getItem(MODE_KEY)||'comida'}catch{return 'comida'}})(),{reset:false});
  updateQuickNav();
  const areas=[...new Set(state.places.map(p=>p.area))].sort((a,b)=>a.localeCompare(b,'es'));
  for(const area of areas){const opt=document.createElement('option');opt.value=area;opt.textContent=area;el('area').append(opt)}
  // Los resultados y el comparador permanecen ocultos hasta enviar el formulario.
  el('results-section').hidden=true;
  el('compare-section').hidden=true;
  restoreSearch();
 }catch(e){
  // Fallo de carga: informar al usuario sin mostrar resultados ficticios.
  el('results-section').hidden=false;
  el('count').textContent='Sin datos';
  showEmpty('No se ha podido cargar la base de datos. Inténtalo de nuevo más tarde.');
 }
}
init();

window.HelioGastroRefreshExplanations=refreshDishExplanations;
