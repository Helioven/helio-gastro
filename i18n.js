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
  const extraTranslations={"Carta de restaurante":"Restaurant menu","Carta de barra":"Bar menu","Postres de la carta de restaurante.":"Desserts from the restaurant menu.","Pan y picos: 3,20 € por persona (IVA incluido).":"Bread and breadsticks: €3.20 per person (VAT included).","Pan y picos: 2,80 € por persona (IVA incluido).":"Bread and breadsticks: €2.80 per person (VAT included).","Precios transcritos del PDF aportado (Casa_Pepe-carta_web-20260515.pdf). Verificar vigencia directamente con el local.":"Prices transcribed from the supplied PDF (Casa_Pepe-carta_web-20260515.pdf). Confirm current prices directly with the restaurant.","Formato 1":"First listed size (not specified)","Formato 2":"Second listed size (not specified)","Plato":"Dish","Postre":"Dessert","Precio por kg":"Price per kg","Vaso":"Glass","Los precios de los platos no se muestran de forma legible en la carta oficial consultada. Por causas ajenas a Helio Gastro, no podemos indicar importes fiables. Recomendamos contactar con el establecimiento antes de acudir para confirmar precios y disponibilidad.":"Dish prices are not legible in the official menu consulted. For reasons beyond Helio Gastro’s control, we cannot provide reliable prices. Please contact the restaurant before visiting to confirm prices and availability.","Cesta de pan y picos: 2,40 € (IVA incluido), según carta oficial consultada.":"Bread basket and breadsticks: €2.40 (VAT included), according to the official menu consulted.","Pescados y mariscos":"Fish and seafood","Carnes y asados":"Meat and roasts","Bocadillos y sándwiches":"Sandwiches and bread rolls","Guisos y cocina tradicional":"Stews and traditional dishes","Verduras y ensaladas":"Vegetables and salads","Tapas y raciones":"Tapas and sharing plates","Postres y dulces":"Desserts and sweets","Sin límite":"No limit","Cualquier formato":"Any portion","Presupuesto de desayuno":"Breakfast budget","Presupuesto de merienda":"Afternoon snack budget","📍 Ver mapa":"📍 View map","☆ Guardar":"☆ Save","★ Guardado":"★ Saved","Ver ficha":"View details","Ver ficha completa":"View full details","✓ Quitar del comparador":"✓ Remove from comparison","+ Comparar":"+ Compare","Establecimientos encontrados":"Places found","✓ Con precio documentado":"✓ With documented prices","Carta específica registrada · horario pendiente de confirmar":"Service-specific menu recorded · hours unverified","Carta general · servicio y horarios sin confirmar":"General menu · service and hours unverified","Coincidencia con el nombre del local":"Matched establishment name","Precio de plato publicado":"Published dish price","Consulta especialidades y fuentes en la ficha":"See dishes and sources in details","No podemos confirmar que cumpla el presupuesto indicado.":"We cannot confirm this fits your budget.","Carta y especialidades":"Menu and specialities","Otras especialidades · precios pendientes":"Other specialities · prices pending","Aún no tenemos especialidades registradas para este local.":"We have not recorded specialities for this place yet.","El coste total de comer aquí no está documentado. Los precios de platos no incluyen necesariamente bebida ni extras.":"The total cost of a meal here is not documented. Dish prices may exclude drinks and extras.","Menús para grupos":"Group menus","Fuentes y fecha":"Sources and date","Sin fecha registrada":"No date recorded","Selecciona establecimientos de los resultados para compararlos aquí.":"Select places from the results to compare them here.","Platos con precio publicado:":"Dishes with published prices:","Sin precios de platos coincidentes documentados.":"No documented prices for matching dishes.","Formatos diferentes: no comparamos cantidades ni asumimos tamaños equivalentes.":"Different portions: we do not compare quantities or assume equivalent sizes.","Precio por unidad: no comparable directamente con una ración.":"Price per item: not directly comparable to a full portion.","Precios documentados por variante y formato":"Documented prices by variation and portion","También ofrecen el plato · precio pendiente":"Also serve this dish · price pending","No se ha podido cargar la base de datos. Inténtalo de nuevo más tarde.":"Could not load the database. Please try again later.","Sin datos":"No data","Todavía no hay establecimientos seleccionados.":"No places selected yet.","No se han podido guardar favoritos en este navegador.":"Could not save favourites in this browser.","Aún no tienes tabernas guardadas. Marca ☆ en los resultados o fichas.":"No saved taverns yet. Select ☆ in results or details.","Todavía no hemos incorporado establecimientos verificados. Empezaremos por una selección pequeña y documentada de Córdoba.":"No verified establishments have been added yet. We will start with a small documented selection in Córdoba.","Todavía no tenemos cartas verificadas para este servicio. Estamos preparando el catálogo; no significa que los locales no lo ofrezcan.":"We do not yet have verified menus for this service. This does not mean local places do not offer it.","Puedes comparar hasta tres sitios. Quita uno antes de añadir otro.":"You can compare up to three places. Remove one before adding another.","Todavía no tenemos esta especialidad documentada para el servicio seleccionado.":"We do not yet have this speciality documented for the selected service.","Todavía no disponemos de cartas verificadas para este servicio. No significa que las cafeterías o restaurantes estén cerrados o no lo sirvan.":"We do not yet have verified menus for this service. This does not mean venues are closed or do not serve it."};
  Object.assign(extraTranslations,{"Pan a elegir: chapata, pan de lino, bollo o pan sin gluten. Extra clásico +0,50 €; extra especial +2 €.":"Bread choices: ciabatta-style bread, flaxseed bread, bread roll or gluten-free bread. Classic extra +€0.50; special extra +€2."});
  Object.assign(extraTranslations,{"Media tostada · Sin café":"Half toast · Without coffee","Tostada entera · Sin café":"Full toast · Without coffee","Media tostada · Con café":"Half toast · With coffee","Tostada entera · Con café":"Full toast · With coffee"});
  Object.assign(extraTranslations,{"Carta oficial con precios de churros, chocolate y tostadas ↗":"Official menu with prices for churros, hot chocolate and toast ↗","Carta oficial con precios de churros, chocolate y tostadas":"Official menu with prices for churros, hot chocolate and toast"});
  const sourceLabelTranslations={"Carta oficial con precios":"Official menu with prices","Carta oficial sin precios":"Official menu without prices","Ubicación del local":"Venue location","Menús y condiciones":"Menus and terms","Web oficial y locales":"Official website and locations","Dirección y contacto":"Address and contact","Carta y dirección oficiales":"Official menu and address","Dirección y presentación oficial":"Official address and introduction","Carta general oficial sin importes visibles":"Official general menu without visible prices","Dirección y web oficial":"Official website and address","Carta oficial de platos sin precios visibles":"Official dish menu without visible prices","Web oficial y dirección":"Official website and address","Turismo de Córdoba: especialidades y dirección":"Córdoba Tourism: specialities and address","Información del establecimiento":"Venue information","Cocina y especialidades oficiales":"Official cuisine and specialities","Carta oficial PDF (precios pendientes de extracción)":"Official PDF menu (prices pending extraction)","Dirección y contacto oficial":"Official address and contact","Carta y cocina tradicional oficiales":"Official traditional menu and cuisine","Web oficial y ubicación":"Official website and location","Carta oficial de La Viuda":"La Viuda official menu","Menús para grupos 2026, con condiciones":"2026 group menus, with conditions","Web y cocina oficial":"Official website and cuisine","Platos del menú degustación":"Tasting menu dishes","Web oficial y cocina tradicional":"Official website and traditional cuisine","Menú degustación y platos":"Tasting menu and dishes","Menús oficiales":"Official menus","Menú degustación Tradición (66 €/persona, mínimo 2, máximo 4)":"Tradición tasting menu (€66/person, minimum 2, maximum 4)","Carta oficial PDF (consultar precio y formato)":"Official PDF menu (check price and portion size)","Carta oficial PDF (precios pendientes de transcripción fiable)":"Official PDF menu (prices pending reliable transcription)","Carta y especialidades oficiales":"Official menu and specialities","Dirección y contacto oficiales":"Official address and contact","Carta oficial para tapear con precios":"Official tapas menu with prices","Dirección legal oficial":"Official legal address","Carta oficial de platos":"Official dish menu","Menús oficiales para grupos (precios y condiciones sujetos a consulta)":"Official group menus (prices and conditions subject to confirmation)","Carta oficial con formatos e importes":"Official menu with portion sizes and prices","Ficha de Turismo de Córdoba":"Córdoba Tourism listing","Historia y especialidades":"History and specialities","Ficha del restaurante con dirección y especialidades":"Restaurant listing with address and specialities","Ficha con información sobre desayunos":"Listing with breakfast information","Web oficial, sede y dirección":"Official website, branch and address","Ficha de Churros Bar Marta y horario publicado":"Churros Bar Marta listing and published opening hours","Opiniones con especialidades de desayuno":"Reviews mentioning breakfast specialities","Ficha y dirección de Don Pepe Centro":"Don Pepe Centro listing and address","Información orientativa del establecimiento":"Indicative venue information","Ficha y dirección de Don Pepe Ciudad Jardín":"Don Pepe Ciudad Jardín listing and address","Opiniones y especialidades":"Reviews and specialities","Carta oficial de comida y dulces":"Official food and desserts menu","Carta oficial de bebidas y cafés":"Official drinks and coffee menu","Carta oficial de desayunos COVAP":"Official COVAP breakfast menu","Presentación oficial COVAP":"Official COVAP introduction","Carta publicada por el establecimiento en Queresto":"Menu published by the establishment on Queresto","Carta oficial Pastelería Centro; precios de barra y mesa, disponibilidad variable":"Pastelería Centro official menu; bar and table prices, availability varies","Carta oficial desayunos Centro: tostadas y precios; disponibilidad durante merienda sin confirmar":"Centro breakfast menu: toast and prices; afternoon availability unconfirmed","Carta de reparto en Glovo: precios NO verificados para consumo en local":"Glovo delivery menu: prices NOT verified for dining in","Carta oficial con precios de churros, chocolate y tostadas":"Official menu with prices for churros, hot chocolate and toast"};
  const KEY='helio-gastro-language-v1';
  const translations={"Los clásicos de la casa":"House classics","Curaciones del valle y marinas":"Cured meats and seafood","Picar y compartir":"Small plates to share","Para terminar":"Main courses","1/2 ración":"Half portion","Abriendo boca":"To whet your appetite","Sabores Córdoba":"Flavours of Córdoba","Puro Río":"Pure Río","Pescados a la brasa":"Chargrilled fish","Menús para grupos":"Group menus","Platos para compartir":"Dishes to share","Plato a elegir":"Choice of main course","Ver PDF oficial del menú":"View official menu PDF","Para los más peques":"For the little ones","Carta especial de celíacos":"Special coeliac menu","Bar · Carta histórica (febrero 2023)":"Bar · Historical menu (February 2023)","Restaurante · Para comenzar":"Restaurant · To start","Restaurante · La antigua cocina mozárabe-magrebí":"Restaurant · Historic Mozarabic-Maghrebi cuisine","Restaurante · Para compartir":"Restaurant · To share","Restaurante · Pescados":"Restaurant · Fish","Restaurante · Carnes":"Restaurant · Meat","Restaurante · Cortes de vacuno":"Restaurant · Beef cuts","Entrantes fríos y ensaladas":"Cold starters and salads","Entrantes calientes":"Hot starters","Carnes y platos fuertes":"Meat and main courses","Entrantes":"Starters","Opciones sin gluten / para celíacos":"Gluten-free / coeliac options","Cordobesa":"Cordoban specialities","Carnes":"Meat","Pescados":"Fish","Postres":"Desserts","Sugerencias del día":"Daily specials","Ensaladas":"Salads","Arroces":"Rice dishes","Verduras":"Vegetables","Mariscos":"Seafood","Tapas":"Tapas","Raciones":"Sharing plates","Bebidas":"Drinks","Desayunos":"Breakfast","Meriendas":"Afternoon snacks","Bollería":"Pastries","Tostadas":"Toast","Churros":"Churros (fried dough pastries)","Molletes":"Andalusian bread rolls","Café":"Coffee","Chocolate":"Hot chocolate","Pasteles":"Sweet pastries","Tartas":"Cakes", "Precios documentados por establecimiento":"Documented prices by establishment","Piloto 3.1.1":"Pilot 3.1.1","Navegación rápida":"Quick navigation","🍴 Platos":"🍴 Dishes","🔎 Buscar":"🔎 Search","★ Favoritos":"★ Favourites","⚖️ Comparar":"⚖️ Compare","CÓRDOBA · DÓNDE COMER BIEN":"CÓRDOBA · WHERE TO EAT WELL","Encuentra algo rico.":"Find something delicious.","Sin sorpresas en la cuenta.":"No surprises on the bill.","Platos que te apetecen, presupuestos realistas y fuentes que puedes comprobar.":"Dishes you crave, realistic budgets and sources you can verify.","¿Qué plan tienes?":"What are you in the mood for?","Elige un momento del día para adaptar platos y presupuesto. Los horarios todavía requieren verificación.":"Choose a time of day to tailor dishes and budgets. Opening hours still need verification.","Momento gastronómico":"Meal occasion","☕ Desayunar":"☕ Breakfast","🍽️ Comer":"🍽️ Lunch","🥐 Merendar":"🥐 Afternoon snack","🌙 Cenar":"🌙 Dinner","🍴 ¿Qué te apetece hoy?":"🍴 What would you like today?","Acceso directo":"Quick access","Elige un plato y descubre directamente opciones documentadas de nuestra base, separadas por variante y formato. Más barato no significa mejor.":"Choose a dish to explore documented options, grouped by variation and portion. Cheaper does not mean better.","¿Qué te apetece?":"What would you like?","Nombre del establecimiento":"Establishment name","Plato o especialidad":"Dish or speciality","Especialidades cordobesas para buscar":"Córdoba specialities to search","PRUEBA UN PLATO TÍPICO":"TRY A LOCAL SPECIALITY","Elige un plato y pulsa «Buscar establecimientos» para consultar resultados.":"Choose a dish and select Find places to see results.","Aplicar presupuesto a":"Apply budget to","Un plato de la carta":"One menu dish","Comida total por persona":"Total meal per person","Presupuesto máximo":"Maximum budget","Sin límite (mostrar fichas)":"No limit (show listings)","Zona":"Area","Toda Córdoba":"All of Córdoba","Formato del plato":"Dish portion size","Cualquier formato (sin equivalencia de tamaños)":"Any portion (sizes may differ)","Unidad":"Single item","Tapa":"Tapas portion","Media ración":"Half portion","Ración completa":"Full portion","Formato no especificado":"Portion size not documented","Mostrar también establecimientos sin precio documentado":"Also show places without documented prices","(se identificarán claramente como precio desconocido)":"(clearly marked as price unknown)","Límite aplicado al precio de un plato, no a una comida completa.":"Limit applies to one dish, not a full meal.","Tipo de precio":"Price type","Todos los precios":"All prices","Solo precios documentados":"Documented prices only","Documentados o estimados":"Documented or estimated","Ordenar":"Sort by","Nombre":"Name","Menor coste":"Lowest price","Verificados primero":"Verified first","Buscar establecimientos →":"Find places →","Limpiar búsqueda":"Clear search","★ Mis tabernas favoritas":"★ My favourite taverns","Guardadas solo en este navegador. Puedes consultarlas sin volver a buscar.":"Saved only in this browser. You can view them without searching again.","Resultados":"Results","El límite solo se puede comprobar cuando existe un precio documentado. Las fichas sin precio se muestran como desconocidas, no como ofertas dentro del presupuesto.":"A budget limit can only be checked against documented prices. Listings without prices are marked unknown, not within budget.","Ver todos los locales que ofrecen este plato →":"See all places serving this dish →","Ficha del establecimiento":"Establishment details","FICHA DEL LOCAL":"ESTABLISHMENT DETAILS","Cerrar ficha ×":"Close details ×","Comparador":"Comparison","Elige hasta tres establecimientos. Para comparar precios, selecciona un mismo formato en el buscador. Las cantidades reales pueden variar entre locales.":"Choose up to three places. For price comparisons, select the same portion type in search. Actual quantities may vary.","Todavía no hay establecimientos seleccionados.":"No places selected yet.","🔍 Nuestro criterio":"🔍 Our methodology","Confirmado":"Confirmed","Estimado":"Estimated","significa coste publicado y verificable, con fuente y fecha.":"means a published, verifiable price with a source and date.","indica una orientación, nunca el precio de una carta.":"is a guide, never a published menu price.","No inventamos reseñas, puntuaciones ni disponibilidad. Si no sabemos algo, lo indicamos.":"We never invent reviews, ratings or availability. If we don't know, we say so.","Sin publicidad ni afiliación. Datos pendientes de verificación.":"No advertising or affiliate links. Data awaiting verification.","Recomendaciones":"Recommendations","Cerrar recomendaciones":"Close recommendations","Cerrar ×":"Close ×","Comparación informativa por variante y formato. Un precio menor no implica mejor calidad ni la misma cantidad.":"Informational comparison by variation and portion. A lower price does not imply better quality or the same quantity.","Ubicación":"Location","Mapa de Google Maps cargado al abrir esta ventana. Confirma la dirección antes de desplazarte.":"Google Maps loads when you open this window. Check the address before travelling.","Mapa del establecimiento":"Establishment map","Abrir en Google Maps ↗":"Open in Google Maps ↗","Escribe o elige un plato cordobés…":"Type or choose a Córdoba dish…"};
  Object.assign(translations,extraTranslations,{"Carta oficial con precios ↗":"Official menu with prices ↗","Ubicación del local ↗":"Restaurant location ↗","Menús y condiciones ↗":"Menus and terms ↗","Carta oficial con precios":"Official menu with prices","Ubicación del local":"Restaurant location","Menús y condiciones":"Menus and terms"},{"Formato sin especificar":"Portion size not documented","3 fuentes":"3 sources","2 fuentes":"2 sources"},{"Selecciona un plato y un formato concreto para identificar precios comparables entre variantes equivalentes.":"Select a dish and portion type to identify comparable prices for equivalent variations.","Se comparan solo variantes coincidentes y el mismo formato declarado. «Menor precio» requiere al menos dos locales con esa variante. La cantidad real puede variar.":"Only matching variations with the same declared portion are compared. A lowest-price comparison requires at least two venues with that variation. Actual quantities may differ.","Carta general · servicio y horarios sin verificar":"General menu · service and hours unverified","Carta específica registrada · horario pendiente de confirmar":"Service-specific menu recorded · hours unverified","Precio de plato publicado":"Published dish price","Formato sin especificar":"Portion size not documented","Media ración":"Half portion","Ración completa":"Full portion","Unidad":"Single item","Combinado":"Combo","Menor precio comparable":"Lowest comparable price","Precio superior al presupuesto":"Price exceeds budget","✓ Con precio documentado dentro del presupuesto":"✓ Documented price within budget","Sin precios de platos coincidentes documentados.":"No documented prices for matching dishes.","No hay establecimientos que coincidan con los filtros seleccionados. Los horarios y servicios de las cartas generales siguen sin verificar.":"No places match your filters. Opening hours and services for general menus remain unverified."},{"✓ Quitar del comparador":"✓ Remove from comparison","+ Comparar":"+ Compare","Puedes comparar hasta tres sitios. Quita uno antes de añadir otro.":"You can compare up to three places. Remove one before adding another.","Selecciona establecimientos de los resultados para compararlos aquí.":"Select places from the results to compare them here.","★ Guardado":"★ Saved","☆ Guardar":"☆ Save","Ver ficha":"View details","📍 Ver mapa":"📍 View map","0 favoritos":"0 favourites","1 favoritos":"1 favourite","1 lugar":"1 place","No se han podido guardar favoritos en este navegador.":"Could not save favourites in this browser.","Aún no tienes tabernas guardadas. Marca ☆ en los resultados o fichas.":"No saved taverns yet. Select ☆ in results or details."},{"Hay":"There are","Precio por unidad":"Price per item","Menor precio comparable":"Lowest comparable price","Variante sin categorizar":"Uncategorized variation","Otro flamenquín":"Other flamenquín","Otras croquetas":"Other croquettes","Los platos proceden de cartas generales. No se ha confirmado que estén disponibles específicamente para comer ni a una hora determinada.":"Dishes come from general menus. Availability at lunchtime or any particular time is not confirmed.","Los platos proceden de cartas generales. No se ha confirmado que estén disponibles específicamente para cenar ni a una hora determinada.":"Dishes come from general menus. Availability at dinner or any particular time is not confirmed.","Los precios pueden cambiar. Confirma la carta actual con el establecimiento.":"Prices may change. Check the current menu with the establishment."},{"⏳ Pendiente de incorporar cartas verificadas":"⏳ Verified menus coming soon","Ej.: Moriles, Casa Bravo, Plateros…":"E.g. Moriles, Casa Bravo, Plateros…","Tostadas, churros, molletes…":"Toast, churros, molletes…","Flamenquín, salmorejo, carrillada…":"Flamenquín, salmorejo, carrillada…","Churros con chocolate, pasteles…":"Churros with chocolate, pastries…","Tapas, tortilla, croquetas…":"Tapas, tortilla, croquetas…","Media tostada":"Half toast","Tostada entera":"Full toast","Desayuno combinado":"Breakfast combo","Ración":"Portion","Merienda combinada":"Afternoon snack combo","Helio Gastro 3.1.1 · Córdoba · Proyecto piloto para portfolio QA":"Helio Gastro 3.1.1 · Córdoba · QA portfolio pilot project","Idioma / Language":"Language / Idioma","Desayunar":"Breakfast","Comer":"Lunch","Merendar":"Afternoon snack","Cenar":"Dinner"});

  // Parameterized UI messages; never translate verified restaurant names or prices.
  const dynamicRules=[
    [/^Hay (\d+) (local|locales) con esta especialidad registrada para el servicio\. (\d+) (local tiene|locales tienen) precios documentados; horarios concretos pendientes de verificar\.$/,m=>'We have '+m[1]+(m[1]==='1'?' place':' places')+' listing this speciality for this service. '+m[3]+(m[3]==='1'?' place has':' places have')+' documented prices; exact opening hours remain unverified.'],
    [/^Hay (\d+) (local|locales) con esta especialidad registrada para el servicio\. Precios pendientes de confirmar; horarios concretos pendientes de verificar\.$/,m=>'We have '+m[1]+(m[1]==='1'?' place':' places')+' listing this speciality for this service. Prices and exact opening hours are not yet verified.'],

    [/^(\d+) favoritos$/,m=>m[1]+' favourites'],
    [/^(\d+) (lugar|lugares)$/,m=>m[1]+(m[1]==='1'?' place':' places')],
    [/^(\d+) locales registrados · (\d+) con precio$/,m=>m[1]+' places listed · '+m[2]+' with prices'],
    [/^(\d+) locales verificados · (\d+) con precio$/,m=>m[1]+' verified places · '+m[2]+' with prices'],
    [/^(\d+) precio\(s\) de carta documentado\(s\) · Ver ficha para detalles$/,m=>m[1]+' documented menu prices · View details'],
    [/^Desde (.+) · (.+)$/,m=>'From '+m[1]+' · '+translateValue(m[2])],
    [/^Especialidades: (.+)$/,m=>'Specialities: '+m[1]],
    [/^🍴 Plato encontrado: (.+)$/,m=>'🍴 Dish found: '+m[1]],
    [/^Coste de comida por persona: (.+)$/,m=>'Meal cost per person: '+m[1]],
    [/^Comida completa por persona: (.+)$/,m=>'Full meal per person: '+m[1]],
    [/^Comida completa: (.+)$/,m=>'Full meal: '+m[1]],
    [/^Última consulta: (.+)$/,m=>'Last checked: '+m[1]],
    [/^Opciones de (.+)$/,m=>'Options for '+m[1]],
    [/^Precio del plato( en este formato)? pendiente de confirmar$/,m=>'Dish price'+(m[1]?' for this portion':'')+' awaiting confirmation'],
    [/^En nuestra base actual: (\d+) local\(es\) con «(.+)» registrado\(s\); (\d+) con precio de ese plato documentado y (\d+) sin precio\. Esto NO representa todos los bares de Córdoba\.$/,m=>'In our current database: '+m[1]+' places list “'+m[2]+'”; '+m[3]+' have a documented price and '+m[4]+' do not. This is NOT a complete list of Córdoba venues.'],
    [/^(\d+) locales en nuestra base; (\d+) con precios publicados\. No es un ranking de calidad ni una lista completa de Córdoba\.$/,m=>m[1]+' places in our database; '+m[2]+' with published prices. This is not a quality ranking or a complete list of Córdoba.'],
    [/^(\d+) fuente\(s\) · Revisado (.+)$/,m=>m[1]+' sources · Checked '+m[2]]
  ];
  dynamicRules.unshift(
    [/^(.* · )Formato sin especificar( · .*)?$/,m=>m[1]+'Portion size not documented'+(m[2]||'')],
    [/^(\d+) favoritos$/,m=>m[1]+(m[1]==='1'?' favourite':' favourites')],
    [/^🚶 Ruta a pie entre (\d+) tabernas ↗$/,m=>'🚶 Walking route between '+m[1]+' taverns ↗'],
    [/^(\d+) fuente\(s\) · Revisado (.+)$/,m=>m[1]+' sources · Checked '+m[2]],
    [/^Desde (.+) · Precio de plato publicado$/,m=>'From '+m[1]+' · Published dish price'],
    [/^(\d+) locales registrados · (\d+) con precio$/,m=>m[1]+' places listed · '+m[2]+' with prices'],
    [/^(\d+) locales verificados · (\d+) con precio$/,m=>m[1]+' verified places · '+m[2]+' with prices']
  );
  dynamicRules.unshift(
    [/^Tenemos (\d+) locales con especialidades registradas para este servicio\. Los precios y horarios concretos siguen pendientes de confirmar\.$/,m=>'We have '+m[1]+' places with specialities recorded for this service. Exact prices and opening hours still need confirmation.'],
    [/^Puedes explorar las cartas generales existentes; el servicio de (comer|cenar) y su horario siguen pendientes de verificar\.$/,m=>'You can explore the available general menus; '+(m[1]==='comer'?'lunch':'dinner')+' service and opening hours are still unverified.'],
    [/^Estamos preparando cartas de (.+)\. Todavía no hay locales con especialidades documentadas para este servicio\.$/,m=>'We are preparing '+({'desayunar':'breakfast','merendar':'afternoon snack'}[m[1]]||m[1])+' menus. No places have documented specialities for this service yet.']
  );
  Object.assign(translations,{
    'No hay precios documentados para este plato en el servicio seleccionado.':'No documented prices for this dish in the selected meal service.',
    'No hay precios documentados para el servicio seleccionado.':'No documented prices for the selected meal service.',
    'Selecciona un plato y un formato concreto para identificar precios comparables entre variantes equivalentes.':'Select a dish and portion size to compare equivalent variants.',
    'Se comparan solo variantes coincidentes y el mismo formato declarado. «Menor precio» requiere al menos dos locales con esa variante. La cantidad real puede variar.':'Only matching variants with the same declared portion size are compared. A lowest price requires at least two venues. Actual quantities may differ.',
    'Formatos diferentes: no comparamos cantidades ni asumimos tamaños equivalentes.':'Different portion sizes: quantities are not assumed to be equivalent.',
    'Precio por unidad: no comparable directamente con una ración.':'Price per item: not directly comparable with a full portion.'
  });
  dynamicRules.push([/^Precios publicados para «(.+)»\. Los formatos pueden ser distintos y no deben compararse como cantidades equivalentes\.$/,m=>'Published prices for “'+m[1]+'”. Portion sizes may differ and should not be treated as equivalent.']);
  Object.assign(translations,{
    'También ofrecen el plato · Precio pendiente de confirmar':'Also serves this dish · Price awaiting confirmation'
  });
  Object.assign(translations,{
    'Se muestran cartas generales para explorar opciones. No confirman que el local sirva este plato a la hora elegida.':'General menus are shown to help you explore options. They do not confirm that the restaurant serves this dish at the selected time.',
  });
  Object.assign(translations,{
    'El presupuesto usa exclusivamente el formato seleccionado: unidad, tapa, media o ración. Si no hay precio de ese formato, se indica como desconocido.':'The budget applies only to the selected portion size: single item, tapa, half or full portion. If no price is available for that size, it is marked as unknown.',
    'Presupuesto aplicado al coste total por persona. Los locales sin coste documentado pueden mostrarse, pero no se consideran dentro del límite.':'Budget applied to the total cost per person. Places without a documented total may still appear, but they are not counted as within budget.'
  });
  function translateValue(value){
    if(Object.prototype.hasOwnProperty.call(sourceLabelTranslations,value.replace(/ ↗$/,'')))return sourceLabelTranslations[value.replace(/ ↗$/,'')]+(value.endsWith(' ↗')?' ↗':'');
    if(Object.prototype.hasOwnProperty.call(translations,value))return translations[value];
    for(const [pattern,render] of dynamicRules){const match=value.match(pattern);if(match)return render(match);}
    return value;
  }
  const originalNodes=new WeakMap();
  const originalAttributes=new WeakMap();
  let language='es';
  const normalize=s=>s.trim().replace(/\s+/g,' ');
  function translateText(node){
    if(!node || !node.parentElement || node.parentElement.closest('script,style,textarea,option[data-keep-original],#language-select,[data-keep-dish-spanish]'))return;
    if(!originalNodes.has(node))originalNodes.set(node,node.nodeValue);
    const original=originalNodes.get(node);
    const match=original.match(/^(\s*)([\s\S]*?)(\s*)$/);
    const key=normalize(match[2]);
    if(language==='en'){
      const next=match[1]+translateValue(key)+match[3];
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
        const translated=language==='en'?translateValue(source):source;
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
    if(typeof window.HelioGastroRefreshExplanations==='function')window.HelioGastroRefreshExplanations();
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
          if(previous!==undefined){
            const match=previous.match(/^(\\s*)([\\s\\S]*?)(\\s*)$/);
            const expected=language==='en'?match[1]+translateValue(normalize(match[2]))+match[3]:previous;
            if(node.nodeValue===expected)continue;
          }
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
