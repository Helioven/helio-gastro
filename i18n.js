'use strict';
// Helio Gastro — ES/EN interface translations.
// Data records keep their original names and documented prices.
window.GASTRO_I18N = Object.freeze({
  es: {
    'language':'Idioma','breakfast':'Desayunar','lunch':'Comer','snack':'Merendar','dinner':'Cenar',
    'search':'Buscar establecimientos →','clear':'Limpiar búsqueda','favorites':'Mis tabernas favoritas',
    'results':'Resultados','compare':'Comparador','close':'Cerrar ×','viewDetails':'Ver ficha',
    'placeName':'Nombre del establecimiento','dish':'Plato o especialidad',
    'area':'Zona','budget':'Presupuesto máximo','portion':'Formato del plato',
    'sort':'Ordenar','allCordoba':'Toda Córdoba','noLimit':'Sin límite (mostrar fichas)',
    'priceKind':'Tipo de precio','priceConfirmed':'Solo precios documentados',
    'priceEstimated':'Documentados o estimados','priceAll':'Todos los precios',
    'unknown':'Precio desconocido','verified':'Confirmado','estimated':'Estimado'
  },
  en: {
    'language':'Language','breakfast':'Breakfast','lunch':'Lunch','snack':'Afternoon snack','dinner':'Dinner',
    'search':'Find places →','clear':'Clear search','favorites':'My favourite taverns',
    'results':'Results','compare':'Compare','close':'Close ×','viewDetails':'View details',
    'placeName':'Establishment name','dish':'Dish or speciality',
    'area':'Area','budget':'Maximum budget','portion':'Dish portion size',
    'sort':'Sort by','allCordoba':'All of Córdoba','noLimit':'No limit (show all listings)',
    'priceKind':'Price type','priceConfirmed':'Documented prices only',
    'priceEstimated':'Documented or estimated','priceAll':'All prices',
    'unknown':'Price unknown','verified':'Confirmed','estimated':'Estimated'
  }
});

(function(){
  const KEY='helio-gastro-language-v1';
  const translations={"Piloto 3.1.1":"Pilot 3.1.1","Navegación rápida":"Quick navigation","🍴 Platos":"🍴 Dishes","🔎 Buscar":"🔎 Search","★ Favoritos":"★ Favourites","⚖️ Comparar":"⚖️ Compare","CÓRDOBA · DÓNDE COMER BIEN":"CÓRDOBA · WHERE TO EAT WELL","Encuentra algo rico.":"Find something delicious.","Sin sorpresas en la cuenta.":"No surprises on the bill.","Platos que te apetecen, presupuestos realistas y fuentes que puedes comprobar.":"Dishes you crave, realistic budgets and sources you can verify.","¿Qué plan tienes?":"What are you in the mood for?","Elige un momento del día para adaptar platos y presupuesto. Los horarios todavía requieren verificación.":"Choose a time of day to tailor dishes and budgets. Opening hours still need verification.","Momento gastronómico":"Meal occasion","☕ Desayunar":"☕ Breakfast","🍽️ Comer":"🍽️ Lunch","🥐 Merendar":"🥐 Afternoon snack","🌙 Cenar":"🌙 Dinner","🍴 ¿Qué te apetece hoy?":"🍴 What would you like today?","Acceso directo":"Quick access","Elige un plato y descubre directamente opciones documentadas de nuestra base, separadas por variante y formato. Más barato no significa mejor.":"Choose a dish to explore documented options, grouped by variation and portion. Cheaper does not mean better.","¿Qué te apetece?":"What would you like?","Nombre del establecimiento":"Establishment name","Plato o especialidad":"Dish or speciality","Especialidades cordobesas para buscar":"Córdoba specialities to search","PRUEBA UN PLATO TÍPICO":"TRY A LOCAL SPECIALITY","Elige un plato y pulsa «Buscar establecimientos» para consultar resultados.":"Choose a dish and select Find places to see results.","Aplicar presupuesto a":"Apply budget to","Un plato de la carta":"One menu dish","Comida total por persona":"Total meal per person","Presupuesto máximo":"Maximum budget","Sin límite (mostrar fichas)":"No limit (show listings)","Zona":"Area","Toda Córdoba":"All of Córdoba","Formato del plato":"Dish portion size","Cualquier formato (sin equivalencia de tamaños)":"Any portion (sizes may differ)","Unidad":"Single item","Tapa":"Tapas portion","Media ración":"Half portion","Ración completa":"Full portion","Formato no especificado":"Portion not specified","Mostrar también establecimientos sin precio documentado":"Also show places without documented prices","(se identificarán claramente como precio desconocido)":"(clearly marked as price unknown)","Límite aplicado al precio de un plato, no a una comida completa.":"Limit applies to one dish, not a full meal.","Tipo de precio":"Price type","Todos los precios":"All prices","Solo precios documentados":"Documented prices only","Documentados o estimados":"Documented or estimated","Ordenar":"Sort by","Nombre":"Name","Menor coste":"Lowest price","Verificados primero":"Verified first","Buscar establecimientos →":"Find places →","Limpiar búsqueda":"Clear search","★ Mis tabernas favoritas":"★ My favourite taverns","Guardadas solo en este navegador. Puedes consultarlas sin volver a buscar.":"Saved only in this browser. You can view them without searching again.","Resultados":"Results","El límite solo se puede comprobar cuando existe un precio documentado. Las fichas sin precio se muestran como desconocidas, no como ofertas dentro del presupuesto.":"A budget limit can only be checked against documented prices. Listings without prices are marked unknown, not within budget.","Ver todos los locales que ofrecen este plato →":"See all places serving this dish →","Ficha del establecimiento":"Establishment details","FICHA DEL LOCAL":"ESTABLISHMENT DETAILS","Cerrar ficha ×":"Close details ×","Comparador":"Comparison","Elige hasta tres establecimientos. Para comparar precios, selecciona un mismo formato en el buscador. Las cantidades reales pueden variar entre locales.":"Choose up to three places. For price comparisons, select the same portion type in search. Actual quantities may vary.","Todavía no hay establecimientos seleccionados.":"No places selected yet.","🔍 Nuestro criterio":"🔍 Our methodology","Confirmado":"Confirmed","Estimado":"Estimated","significa coste publicado y verificable, con fuente y fecha.":"means a published, verifiable price with a source and date.","indica una orientación, nunca el precio de una carta.":"is a guide, never a published menu price.","No inventamos reseñas, puntuaciones ni disponibilidad. Si no sabemos algo, lo indicamos.":"We never invent reviews, ratings or availability. If we don't know, we say so.","Sin publicidad ni afiliación. Datos pendientes de verificación.":"No advertising or affiliate links. Data awaiting verification.","Recomendaciones":"Recommendations","Cerrar recomendaciones":"Close recommendations","Cerrar ×":"Close ×","Comparación informativa por variante y formato. Un precio menor no implica mejor calidad ni la misma cantidad.":"Informational comparison by variation and portion. A lower price does not imply better quality or the same quantity.","Ubicación":"Location","Mapa de Google Maps cargado al abrir esta ventana. Confirma la dirección antes de desplazarte.":"Google Maps loads when you open this window. Check the address before travelling.","Mapa del establecimiento":"Establishment map","Abrir en Google Maps ↗":"Open in Google Maps ↗","Escribe o elige un plato cordobés…":"Type or choose a Córdoba dish…"};
  const originalNodes=new WeakMap();
  const originalAttributes=new WeakMap();
  let language='es';
  const normalize=s=>s.trim().replace(/\s+/g,' ');
  function translateText(node){
    if(!node || !node.parentElement || node.parentElement.closest('script,style,textarea,option[data-keep-original]'))return;
    if(!originalNodes.has(node))originalNodes.set(node,node.nodeValue);
    const original=originalNodes.get(node);
    const match=original.match(/^(\s*)([\s\S]*?)(\s*)$/);
    const key=normalize(match[2]);
    if(language==='en' && Object.prototype.hasOwnProperty.call(translations,key)){
      const next=match[1]+translations[key]+match[3];
      if(node.nodeValue!==next)node.nodeValue=next;
    }else if(language==='es' && node.nodeValue!==original)node.nodeValue=original;
  }
  function translateElement(root){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode()))translateText(node);
    const elements=[root,...(root.querySelectorAll?root.querySelectorAll('[placeholder],[aria-label],[title]'):[])];
    for(const element of elements){
      if(!element.getAttribute)continue;
      for(const attr of ['placeholder','aria-label','title']){
        if(!element.hasAttribute(attr))continue;
        let originals=originalAttributes.get(element);
        if(!originals){originals={};originalAttributes.set(element,originals);}
        if(!(attr in originals))originals[attr]=element.getAttribute(attr);
        const source=originals[attr];
        const translated=language==='en'?(translations[source]||source):source;
        if(element.getAttribute(attr)!==translated)element.setAttribute(attr,translated);
      }
    }
  }
  function applyLanguage(next){
    language=next==='en'?'en':'es';
    document.documentElement.lang=language;
    const select=document.getElementById('language-select');
    if(select && select.value!==language)select.value=language;
    translateElement(document.body);
    try{localStorage.setItem(KEY,language)}catch(e){}
  }
  function init(){
    const select=document.getElementById('language-select');
    if(!select)return;
    try{language=localStorage.getItem(KEY)==='en'?'en':'es'}catch(e){}
    select.addEventListener('change',()=>applyLanguage(select.value));
    applyLanguage(language);
    const observer=new MutationObserver(records=>{
      for(const record of records){
        if(record.type==='characterData'){
          const node=record.target;
          const previous=originalNodes.get(node);
          if(language==='en' && previous!==undefined && node.nodeValue===translations[normalize(previous)])continue;
          originalNodes.delete(node);
          translateText(node);
        }else{
          for(const node of record.addedNodes){
            if(node.nodeType===Node.TEXT_NODE)translateText(node);
            else if(node.nodeType===Node.ELEMENT_NODE)translateElement(node);
          }
        }
      }
    });
    observer.observe(document.body,{childList:true,characterData:true,subtree:true});
  }
  window.HelioGastroLanguage={set:applyLanguage,get:()=>language};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
