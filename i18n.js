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
  const sourceLabelTranslations={"Carta oficial con precios":"Official menu with prices","Carta oficial de Taberna Salinas (platos y postres; sin precios)":"Taberna Salinas official menu (dishes and desserts; no prices listed)","Carta oficial del restaurante":"Official restaurant menu","Carta oficial sin precios":"Official menu without prices","Ubicación del local":"Venue location","Menús y condiciones":"Menus and terms","Web oficial y locales":"Official website and locations","Dirección y contacto":"Address and contact","Carta y dirección oficiales":"Official menu and address","Dirección y presentación oficial":"Official address and introduction","Carta general oficial sin importes visibles":"Official general menu without visible prices","Dirección y web oficial":"Official website and address","Carta oficial de platos sin precios visibles":"Official dish menu without visible prices","Web oficial y dirección":"Official website and address","Turismo de Córdoba: especialidades y dirección":"Córdoba Tourism: specialities and address","Información del establecimiento":"Venue information","Cocina y especialidades oficiales":"Official cuisine and specialities","Carta oficial PDF (precios pendientes de extracción)":"Official PDF menu (prices pending extraction)","Dirección y contacto oficial":"Official address and contact","Carta y cocina tradicional oficiales":"Official traditional menu and cuisine","Web oficial y ubicación":"Official website and location","Carta oficial de La Viuda":"La Viuda official menu","Menús para grupos 2026, con condiciones":"2026 group menus, with conditions","Web y cocina oficial":"Official website and cuisine","Platos del menú degustación":"Tasting menu dishes","Web oficial y cocina tradicional":"Official website and traditional cuisine","Menú degustación y platos":"Tasting menu and dishes","Menús oficiales":"Official menus","Menú degustación Tradición (66 €/persona, mínimo 2, máximo 4)":"Tradición tasting menu (€66/person, minimum 2, maximum 4)","Carta oficial PDF (consultar precio y formato)":"Official PDF menu (check price and portion size)","Carta oficial PDF (precios pendientes de transcripción fiable)":"Official PDF menu (prices pending reliable transcription)","Carta y especialidades oficiales":"Official menu and specialities","Dirección y contacto oficiales":"Official address and contact","Carta oficial para tapear con precios":"Official tapas menu with prices","Dirección legal oficial":"Official legal address","Carta oficial de platos":"Official dish menu","Menús oficiales para grupos (precios y condiciones sujetos a consulta)":"Official group menus (prices and conditions subject to confirmation)","Carta oficial con formatos e importes":"Official menu with portion sizes and prices","Ficha de Turismo de Córdoba":"Córdoba Tourism listing","Historia y especialidades":"History and specialities","Ficha del restaurante con dirección y especialidades":"Restaurant listing with address and specialities","Ficha con información sobre desayunos":"Listing with breakfast information","Web oficial, sede y dirección":"Official website, branch and address","Ficha de Churros Bar Marta y horario publicado":"Churros Bar Marta listing and published opening hours","Opiniones con especialidades de desayuno":"Reviews mentioning breakfast specialities","Ficha y dirección de Don Pepe Centro":"Don Pepe Centro listing and address","Información orientativa del establecimiento":"Indicative venue information","Ficha y dirección de Don Pepe Ciudad Jardín":"Don Pepe Ciudad Jardín listing and address","Opiniones y especialidades":"Reviews and specialities","Carta oficial de comida y dulces":"Official food and desserts menu","Carta oficial de bebidas y cafés":"Official drinks and coffee menu","Carta oficial de desayunos COVAP":"Official COVAP breakfast menu","Presentación oficial COVAP":"Official COVAP introduction","Carta publicada por el establecimiento en Queresto":"Menu published by the establishment on Queresto","Carta oficial Pastelería Centro; precios de barra y mesa, disponibilidad variable":"Pastelería Centro official menu; bar and table prices, availability varies","Carta oficial desayunos Centro: tostadas y precios; disponibilidad durante merienda sin confirmar":"Centro breakfast menu: toast and prices; afternoon availability unconfirmed","Carta de reparto en Glovo: precios NO verificados para consumo en local":"Glovo delivery menu: prices NOT verified for dining in","Carta oficial con precios de churros, chocolate y tostadas":"Official menu with prices for churros, hot chocolate and toast"};
  const KEY='helio-gastro-language-v1';
  const translations={"Menú n.º 1":"Set menu no. 1","Menú n.º 2":"Set menu no. 2","Menú n.º 3":"Set menu no. 3","Menú infantil":"Children's menu","Revueltos":"Scrambled egg dishes","Fritos":"Fried dishes","Guisos":"Stews","Postres Caseros":"Homemade desserts","Just Eat · reparto · formato no especificado":"Just Eat · delivery · portion size unspecified","Entrantes Fríos":"Cold starters","Entrantes Calientes":"Hot starters","Pescaitos Fritos":"Fried fish","Huevos y Revueltos":"Eggs and scrambles","Platos Tradicionales":"Traditional dishes","Información sobre la carta: La carta disponible corresponde a octubre de 2025. Los platos y precios mostrados proceden de esa publicación y podrían haber cambiado. Algunos platos pueden haber dejado de estar disponibles. Recomendamos consultar con Casa Rubio para confirmar la carta y los precios actuales.":"Menu information: The available menu dates from October 2025. The dishes and prices shown come from that publication and may have changed. Some dishes may no longer be available. We recommend contacting Casa Rubio to confirm the current menu and prices.","Carta oficial de octubre de 2025. IVA del 10% incluido. Cesta de pan y picos 2,60 € (histórico). Alérgenos: consultar carta específica del restaurante.":"Official menu dated October 2025. 10% VAT included. Bread and breadsticks basket €2.60 (historical price). Allergens: consult the restaurant's dedicated allergen menu.","De la huerta":"From the garden","De la lonja":"From the fish market","De nuestra dehesa":"From our dehesa","Acompañamientos":"Sides","media":"Half portion","ración":"Full portion","precio único":"Single price","Lo nuestro":"Our specialities","Del huerto":"From the garden","Para gozar":"To savour","De la mar":"From the sea","De la tierra":"From the land","Dulce final":"Sweet finale","media ración":"Half portion","ración entera":"Full portion","plato":"Dish","unidad":"Single item","Rodeado de Gitanillas":"Surrounded by Gitanillas flowers","Entre macetas y flores":"Among flowerpots and flowers","Azahar y Jazmines":"Orange blossom and jasmine","Rosas y Claveles":"Roses and carnations","Especialidades":"Specialities","Los clásicos de la casa":"House classics","Curaciones del valle y marinas":"Cured meats and seafood","Picar y compartir":"Small plates to share","Para terminar":"Main courses","1/2 ración":"Half portion","Abriendo boca":"To whet your appetite","Sabores Córdoba":"Flavours of Córdoba","Puro Río":"Pure Río","Pescados a la brasa":"Chargrilled fish","Menús para grupos":"Group menus","Platos para compartir":"Dishes to share","Plato a elegir":"Choice of main course","Ver PDF oficial del menú":"View official menu PDF","Para los más peques":"For the little ones","Carta especial de celíacos":"Special coeliac menu","Bar · Carta histórica (febrero 2023)":"Bar · Historical menu (February 2023)","Restaurante · Para comenzar":"Restaurant · To start","Restaurante · La antigua cocina mozárabe-magrebí":"Restaurant · Historic Mozarabic-Maghrebi cuisine","Restaurante · Para compartir":"Restaurant · To share","Restaurante · Pescados":"Restaurant · Fish","Restaurante · Carnes":"Restaurant · Meat","Restaurante · Cortes de vacuno":"Restaurant · Beef cuts","Entrantes fríos y ensaladas":"Cold starters and salads","Entrantes calientes":"Hot starters","Carnes y platos fuertes":"Meat and main courses","Entrantes":"Starters","Opciones sin gluten / para celíacos":"Gluten-free / coeliac options","Cordobesa":"Cordoban specialities","Carnes":"Meat","Pescados":"Fish","Postres":"Desserts","Sugerencias del día":"Daily specials","Ensaladas":"Salads","Arroces":"Rice dishes","Verduras":"Vegetables","Mariscos":"Seafood","Tapas":"Tapas","Raciones":"Sharing plates","Bebidas":"Drinks","Desayunos":"Breakfast","Meriendas":"Afternoon snacks","Bollería":"Pastries","Tostadas":"Toast","Churros":"Churros (fried dough pastries)","Molletes":"Andalusian bread rolls","Café":"Coffee","Chocolate":"Hot chocolate","Pasteles":"Sweet pastries","Tartas":"Cakes", "Precios documentados por establecimiento":"Documented prices by establishment","Piloto 3.1.1":"Pilot 3.1.1","Navegación rápida":"Quick navigation","🍴 Platos":"🍴 Dishes","🔎 Buscar":"🔎 Search","★ Favoritos":"★ Favourites","⚖️ Comparar":"⚖️ Compare","CÓRDOBA · DÓNDE COMER BIEN":"CÓRDOBA · WHERE TO EAT WELL","Encuentra algo rico.":"Find something delicious.","Sin sorpresas en la cuenta.":"No surprises on the bill.","Platos que te apetecen, presupuestos realistas y fuentes que puedes comprobar.":"Dishes you crave, realistic budgets and sources you can verify.","¿Qué plan tienes?":"What are you in the mood for?","Elige un momento del día para adaptar platos y presupuesto. Los horarios todavía requieren verificación.":"Choose a time of day to tailor dishes and budgets. Opening hours still need verification.","Momento gastronómico":"Meal occasion","☕ Desayunar":"☕ Breakfast","🍽️ Comer":"🍽️ Lunch","🥐 Merendar":"🥐 Afternoon snack","🌙 Cenar":"🌙 Dinner","🍴 ¿Qué te apetece hoy?":"🍴 What would you like today?","Acceso directo":"Quick access","Elige un plato y descubre directamente opciones documentadas de nuestra base, separadas por variante y formato. Más barato no significa mejor.":"Choose a dish to explore documented options, grouped by variation and portion. Cheaper does not mean better.","¿Qué te apetece?":"What would you like?","Nombre del establecimiento":"Establishment name","Plato o especialidad":"Dish or speciality","Especialidades cordobesas para buscar":"Córdoba specialities to search","PRUEBA UN PLATO TÍPICO":"TRY A LOCAL SPECIALITY","Elige un plato y pulsa «Buscar establecimientos» para consultar resultados.":"Choose a dish and select Find places to see results.","Aplicar presupuesto a":"Apply budget to","Un plato de la carta":"One menu dish","Comida total por persona":"Total meal per person","Presupuesto máximo":"Maximum budget","Sin límite (mostrar fichas)":"No limit (show listings)","Zona":"Area","Toda Córdoba":"All of Córdoba","Formato del plato":"Dish portion size","Cualquier formato (sin equivalencia de tamaños)":"Any portion (sizes may differ)","Unidad":"Single item","Tapa":"Tapa","Media ración":"Half portion","Ración completa":"Full portion","Formato no especificado":"Portion size not specified","Mostrar también establecimientos sin precio documentado":"Also show places without documented prices","(se identificarán claramente como precio desconocido)":"(clearly marked as price unknown)","Límite aplicado al precio de un plato, no a una comida completa.":"Limit applies to one dish, not a full meal.","Tipo de precio":"Price type","Todos los precios":"All prices","Solo precios documentados":"Documented prices only","Documentados o estimados":"Documented or estimated","Ordenar":"Sort by","Nombre":"Name","Menor coste":"Lowest price","Verificados primero":"Verified first","Buscar establecimientos →":"Find places →","Limpiar búsqueda":"Clear search","★ Mis tabernas favoritas":"★ My favourite taverns","Guardadas solo en este navegador. Puedes consultarlas sin volver a buscar.":"Saved only in this browser. You can view them without searching again.","Resultados":"Results","El límite solo se puede comprobar cuando existe un precio documentado. Las fichas sin precio se muestran como desconocidas, no como ofertas dentro del presupuesto.":"A budget limit can only be checked against documented prices. Listings without prices are marked unknown, not within budget.","Ver todos los locales que ofrecen este plato →":"See all places serving this dish →","Ficha del establecimiento":"Establishment details","FICHA DEL LOCAL":"ESTABLISHMENT DETAILS","Cerrar ficha ×":"Close details ×","Comparador":"Comparison","Elige hasta tres establecimientos. Para comparar precios, selecciona un mismo formato en el buscador. Las cantidades reales pueden variar entre locales.":"Choose up to three places. For price comparisons, select the same portion type in search. Actual quantities may vary.","Todavía no hay establecimientos seleccionados.":"No places selected yet.","🔍 Nuestro criterio":"🔍 Our methodology","Confirmado":"Confirmed","Estimado":"Estimated","significa coste publicado y verificable, con fuente y fecha.":"means a published, verifiable price with a source and date.","indica una orientación, nunca el precio de una carta.":"is a guide, never a published menu price.","No inventamos reseñas, puntuaciones ni disponibilidad. Si no sabemos algo, lo indicamos.":"We never invent reviews, ratings or availability. If we don't know, we say so.","Sin publicidad ni afiliación. Datos pendientes de verificación.":"No advertising or affiliate links. Data awaiting verification.","Recomendaciones":"Recommendations","Cerrar recomendaciones":"Close recommendations","Cerrar ×":"Close ×","Comparación informativa por variante y formato. Un precio menor no implica mejor calidad ni la misma cantidad.":"Informational comparison by variation and portion. A lower price does not imply better quality or the same quantity.","Ubicación":"Location","Mapa de Google Maps cargado al abrir esta ventana. Confirma la dirección antes de desplazarte.":"Google Maps loads when you open this window. Check the address before travelling.","Mapa del establecimiento":"Establishment map","Abrir en Google Maps ↗":"Open in Google Maps ↗","Escribe o elige un plato cordobés…":"Type or choose a Córdoba dish…"};
  Object.assign(translations,extraTranslations,{"Carta oficial con precios ↗":"Official menu with prices ↗","Ubicación del local ↗":"Restaurant location ↗","Menús y condiciones ↗":"Menus and terms ↗","Carta oficial con precios":"Official menu with prices","Ubicación del local":"Restaurant location","Menús y condiciones":"Menus and terms"},{"Formato sin especificar":"Portion size not specified","3 fuentes":"3 sources","2 fuentes":"2 sources"},{"Selecciona un plato y un formato concreto para identificar precios comparables entre variantes equivalentes.":"Select a dish and portion type to identify comparable prices for equivalent variations.","Se comparan solo variantes coincidentes y el mismo formato declarado. «Menor precio» requiere al menos dos locales con esa variante. La cantidad real puede variar.":"Only matching variations with the same declared portion are compared. A lowest-price comparison requires at least two venues with that variation. Actual quantities may differ.","Carta general · servicio y horarios sin verificar":"General menu · service and hours unverified","Carta específica registrada · horario pendiente de confirmar":"Service-specific menu recorded · hours unverified","Precio de plato publicado":"Published dish price","Formato sin especificar":"Portion size not specified","Media ración":"Half portion","Ración completa":"Full portion","Unidad":"Single item","Combinado":"Combo","Menor precio comparable":"Lowest comparable price","Precio superior al presupuesto":"Price exceeds budget","✓ Con precio documentado dentro del presupuesto":"✓ Documented price within budget","Sin precios de platos coincidentes documentados.":"No documented prices for matching dishes.","No hay establecimientos que coincidan con los filtros seleccionados. Los horarios y servicios de las cartas generales siguen sin verificar.":"No places match your filters. Opening hours and services for general menus remain unverified."},{"✓ Quitar del comparador":"✓ Remove from comparison","+ Comparar":"+ Compare","Puedes comparar hasta tres sitios. Quita uno antes de añadir otro.":"You can compare up to three places. Remove one before adding another.","Selecciona establecimientos de los resultados para compararlos aquí.":"Select places from the results to compare them here.","★ Guardado":"★ Saved","☆ Guardar":"☆ Save","Ver ficha":"View details","📍 Ver mapa":"📍 View map","0 favoritos":"0 favourites","1 favoritos":"1 favourite","1 lugar":"1 place","No se han podido guardar favoritos en este navegador.":"Could not save favourites in this browser.","Aún no tienes tabernas guardadas. Marca ☆ en los resultados o fichas.":"No saved taverns yet. Select ☆ in results or details."},{"Hay":"There are","Precio por unidad":"Price per item","Menor precio comparable":"Lowest comparable price","Variante sin categorizar":"Uncategorized variation","Otro flamenquín":"Other flamenquín","Otras croquetas":"Other croquettes","Los platos proceden de cartas generales. No se ha confirmado que estén disponibles específicamente para comer ni a una hora determinada.":"Dishes come from general menus. Availability at lunchtime or any particular time is not confirmed.","Los platos proceden de cartas generales. No se ha confirmado que estén disponibles específicamente para cenar ni a una hora determinada.":"Dishes come from general menus. Availability at dinner or any particular time is not confirmed.","Los precios pueden cambiar. Confirma la carta actual con el establecimiento.":"Prices may change. Check the current menu with the establishment."},{"⏳ Pendiente de incorporar cartas verificadas":"⏳ Verified menus coming soon","Ej.: Moriles, Casa Bravo, Plateros…":"E.g. Moriles, Casa Bravo, Plateros…","Tostadas, churros, molletes…":"Toast, churros, molletes…","Flamenquín, salmorejo, carrillada…":"Flamenquín, salmorejo, carrillada…","Churros con chocolate, pasteles…":"Churros with chocolate, pastries…","Tapas, tortilla, croquetas…":"Tapas, tortilla, croquetas…","Media tostada":"Half toast","Tostada entera":"Full toast","Desayuno combinado":"Breakfast combo","Ración":"Portion","Merienda combinada":"Afternoon snack combo","Helio Gastro 3.1.1 · Córdoba · Proyecto piloto para portfolio QA":"Helio Gastro 3.1.1 · Córdoba · QA portfolio pilot project","Idioma / Language":"Language / Idioma","Desayunar":"Breakfast","Comer":"Lunch","Merendar":"Afternoon snack","Cenar":"Dinner"});

  // Parameterized UI messages; never translate verified restaurant names or prices.
  // Roldán: shared branch directory and breakfast-menu caveats.
  const roldanTranslations={
    '📍 Establecimientos de Roldán en Córdoba':'📍 Roldán locations in Córdoba',
    'La carta y los precios indicados corresponden a las cafeterías, excepto Centro. Las panaderías se listan solo como ubicaciones; su oferta puede ser diferente.':'The menu and prices shown apply to the cafés, except Centro. Bakeries are listed as locations only; their selection may differ.',
    'Precios publicados en la carta general de Roldán. Pueden variar; la disponibilidad de productos depende de cada local. Roldán Centro tiene carta y ficha propias.':'Prices published in Roldán’s general menu. Prices and product availability may vary by location. Roldán Centro has its own menu and listing.'
  };
  const dynamicRules=[
    [/^(Cafetería|Panadería): (.*)$/,m=>(m[1]==='Panadería'?'Bakery':'Café')+': '+m[2]],
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
    [/^(.* · )Formato sin especificar( · .*)?$/,m=>m[1]+'Portion size not specified'+(m[2]||'')],
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
  Object.assign(translations,{
    'Ficha del local':'Restaurant details',
    'Ficha del establecimiento':'Restaurant information',
    'Cerrar ficha ×':'Close details ×',
    'Fuentes y fecha':'Sources and date',
    'Platos a elegir':'Dishes to choose from',
    'Postre a elegir':'Choose a dessert',
    'Bebidas incluidas (una a elegir)':'Included drinks (choose one)'
  });
  // Group menu names from La Cazuela de la Espartería (keep prices unchanged).
  dynamicRules.unshift([/^(Menú [12] Navidad · (?:mesa|cóctel de pie)) · ([\d.,]+ €)\/persona$/,m=>({
    'Menú 1 Navidad · mesa':'Christmas Menu 1 · seated',
    'Menú 2 Navidad · mesa':'Christmas Menu 2 · seated',
    'Menú 1 Navidad · cóctel de pie':'Christmas Menu 1 · standing cocktail',
    'Menú 2 Navidad · cóctel de pie':'Christmas Menu 2 · standing cocktail'
  }[m[1]]||m[1])+' · '+m[2]+'/person']);
  function translateValue(value){
    if(Object.prototype.hasOwnProperty.call(sourceLabelTranslations,value.replace(/ ↗$/,'')))return sourceLabelTranslations[value.replace(/ ↗$/,'')]+(value.endsWith(' ↗')?' ↗':'');
    if(Object.prototype.hasOwnProperty.call(roldanTranslations,value))return roldanTranslations[value];
    if(Object.prototype.hasOwnProperty.call(translations,value))return translations[value];
    for(const [pattern,render] of dynamicRules){const match=value.match(pattern);if(match)return render(match);}
    return value;
  }
  const originalNodes=new WeakMap();
  const originalAttributes=new WeakMap();
  const frenchQaEnabled=new URLSearchParams(window.location.search).get('qa_fr')==='1';
  const isSupportedLanguage=value=>value==='es'||value==='en'||(frenchQaEnabled&&value==='fr');
  let language='es';
  // First French UI pilot: narrowly scoped search controls, QA flag only.
  const frenchSearchLabels=new Map([
    ['¿Qué te apetece?','Une petite envie ?'],
    ['Nombre del establecimiento',"Nom de l’établissement"],
    ['Plato o especialidad','Plat ou spécialité'],
    ['PRUEBA UN PLATO TÍPICO','DÉCOUVREZ UNE SPÉCIALITÉ'],
    ['Elige un plato y pulsa «Buscar establecimientos» para consultar resultados.','Choisissez un plat, puis cliquez sur « Rechercher des établissements » pour afficher les résultats.'],
    ['Presupuesto máximo','Budget maximum'],
    ['Aplicar presupuesto a','Appliquer le budget à'],
    ['Un plato de la carta','Un plat à la carte'],
    ['Comida total por persona','Repas complet par personne'],
    ['Zona','Quartier'],
    ['Toda Córdoba','Tout Cordoue'],
    ['Sin límite (mostrar fichas)','Sans limite (afficher les fiches)'],
    ['Sin límite','Sans limite'],
    ['Menor coste','Prix le plus bas'],
    ['Verificados primero','Vérifiés en premier'],
    ['Formato del plato','Format du plat'],
    ['Tipo de precio','Type de prix'],
    ['Ordenar','Trier'],
    ['Buscar establecimientos →','Rechercher des établissements →'],
    ['Limpiar búsqueda','Effacer la recherche'],
    ['Cualquier formato (sin equivalencia de tamaños)','Tout format (tailles non comparables)'],
    ['Unidad','À l’unité'],
    ['Media ración','Demi-portion'],
    ['Ración completa','Portion entière'],
    ['Formato no especificado','Format non précisé'],
    ['Todos los precios','Tous les prix'],
    ['Solo precios documentados','Prix documentés uniquement'],
    ['Documentados o estimados','Prix documentés ou estimés'],
    ['Mostrar también establecimientos sin precio documentado','Afficher aussi les établissements sans prix documenté'],
    ['(se identificarán claramente como precio desconocido)','(signalés clairement comme prix inconnus)'],
    ['Límite aplicado al precio de un plato, no a una comida completa.','Plafond appliqué au prix d’un plat, et non à celui d’un repas complet.'],
    ['El límite solo se puede comprobar cuando existe un precio documentado. Las fichas sin precio se muestran como desconocidas, no como ofertas dentro del presupuesto.','Le plafond ne peut être vérifié que si un prix est documenté. Les établissements sans prix sont indiqués comme inconnus et non comme des offres respectant le budget.']
  ]);
  const translateFrenchSearchText=(node,source)=>node.parentElement?.closest('#search-section')&&!node.parentElement.closest('.dish-suggestions-list')?(frenchSearchLabels.get(normalize(source))||source):source;
  const frenchRecommendationsLabels=new Map([
    ['🍴 ¿Qué te apetece hoy?','🍴 Qu’est-ce qui vous ferait plaisir aujourd’hui ?'],
    ['Acceso directo','Accès direct'],
    ['Elige un plato y descubre directamente opciones documentadas de nuestra base, separadas por variante y formato. Más barato no significa mejor.','Choisissez un plat et découvrez les options documentées dans notre base, classées par variante et par format. Le moins cher n’est pas forcément le meilleur.']
  ]);
  const translateFrenchRecommendationsText=(node,source)=>node.parentElement?.closest('#recommendations-section')&&!node.parentElement.closest('#recommendation-dishes')?(frenchRecommendationsLabels.get(normalize(source))||source):source;
  const frenchServiceLabels=new Map([
    ['¿Qué plan tienes ?','Quel repas avez-vous en tête ?'],
    ['¿Qué plan tienes?','Quel repas avez-vous en tête ?'],
    ['Elige un momento del día para adaptar platos y presupuesto. Los horarios todavía requieren verificación.','Choisissez un moment de la journée pour adapter les plats et le budget. Les horaires restent à vérifier.'],
    ['☕ Desayunar','☕ Petit-déjeuner'],
    ['🍽️ Comer','🍽️ Déjeuner'],
    ['🥐 Merendar','🥐 Goûter'],
    ['🌙 Cenar','🌙 Dîner']
  ]);
  const translateFrenchServiceText=(node,source)=>node.parentElement?.closest('#service-section')?(frenchServiceLabels.get(normalize(source))||source):source;
  const frenchHeroLabels=new Map([
    ['CÓRDOBA · DÓNDE COMER BIEN','CORDOUE · OÙ BIEN MANGER'],
    ['Encuentra algo rico.','Trouvez un bon petit plat.'],
    ['Sin sorpresas en la cuenta.','Sans surprise sur l’addition.'],
    ['Platos que te apetecen, presupuestos realistas y fuentes que puedes comprobar.','Des plats qui vous font envie, des budgets réalistes et des sources vérifiables.']
  ]);
  const translateFrenchHeroText=(node,source)=>node.parentElement?.closest('.hero')?(frenchHeroLabels.get(normalize(source))||source):source;
  const frenchNavLabels=new Map([
    ['🍴 Platos','🍴 Plats'],
    ['🔎 Buscar','🔎 Rechercher'],
    ['★ Favoritos','★ Favoris'],
    ['⚖️ Comparar','⚖️ Comparer']
  ]);
  const translateFrenchNavText=(node,source)=>node.parentElement?.closest('#quick-nav')?(frenchNavLabels.get(normalize(source))||source):source;
  const frenchFavoritesNotice='Enregistrées uniquement dans ce navigateur. Vous pouvez les consulter sans effectuer une nouvelle recherche.';
  const translateFrenchFavoritesNotice=(node,source)=>node.parentElement?.id==='favorite-notice'&&normalize(source)==='Guardadas solo en este navegador. Puedes consultarlas sin volver a buscar.'?frenchFavoritesNotice:source;
  const frenchResultsLabels=new Map([
    ['Resultados','Résultats'],
    ['Ver todos los locales que ofrecen este plato →','Voir tous les établissements proposant ce plat →'],
    ['Ficha del local',"Fiche de l’établissement"],
    ['Cerrar ficha ×','Fermer la fiche ×'],
    ['Comparador','Comparateur'],
    ['Elige hasta tres establecimientos. Para comparar precios, selecciona un mismo formato en el buscador. Las cantidades reales pueden variar entre locales.',"Choisissez jusqu’à trois établissements. Pour comparer les prix, sélectionnez un même format dans la recherche. Les quantités réelles peuvent varier selon l’établissement."],
    ['Todavía no hay establecimientos seleccionados.','Aucun établissement sélectionné pour le moment.'],
    ['El límite solo se puede comprobar cuando existe un precio documentado. Las fichas sin precio se muestran como desconocidas, no como ofertas dentro del presupuesto.',"Le plafond ne peut être vérifié que si un prix est documenté. Les établissements sans prix sont signalés comme inconnus, et non comme des offres respectant le budget."]
  ]);
  const translateFrenchResultsText=(node,source)=>node.parentElement?.closest('#results-section,#detail-section,#compare-section')&&!node.parentElement.closest('#results,#detail-content,#compare-output')?(frenchResultsLabels.get(normalize(source))||source):source;
  const frenchDynamicResults=new Map([
    ['Consulta especialidades y fuentes en la ficha','Consultez les spécialités et les sources dans la fiche.'],
    ['Precio del plato pendiente de confirmar','Prix du plat en attente de confirmation'],
    ['Precio del plato en este formato pendiente de confirmar','Prix du plat dans ce format en attente de confirmation'],
    ['No podemos confirmar que cumpla el presupuesto indicado.',"Nous ne pouvons pas confirmer que cet établissement respecte le budget indiqué."],
    ['Ver ficha completa','Voir la fiche complète'],
    ['✓ Quitar del comparador','✓ Retirer du comparateur'],
    ['+ Comparar','+ Comparer']
  ]);
  const translateFrenchDynamicResult=(node,source)=>node.parentElement?.closest('#results')&&node.parentElement.matches('.result-pending,.note,.detail-button,button')?(frenchDynamicResults.get(normalize(source))||source):source;
  const frenchDetailLabels=new Map([
    ['Abrir en Google Maps ↗','Ouvrir dans Google Maps ↗'],
    ['Carta y especialidades','Carte et spécialités'],
    ['Otras especialidades · precios pendientes','Autres spécialités · prix à confirmer'],
    ['Aún no tenemos especialidades registradas para este local.',"Aucune spécialité n’est encore enregistrée pour cet établissement."],
    ['Menús para grupos','Menus pour groupes'],
    ['Ver PDF oficial del menú','Voir le PDF officiel du menu'],
    ['Fuentes y fecha','Sources et date'],
    ['Documentación de fuentes (desplegar)','Documentation des sources (déplier)']
  ]);
  const translateFrenchDetailText=(node,source)=>node.parentElement?.closest('#detail-content')&&!node.parentElement.closest('.menu-dish,[data-venue-menu-section],[data-bilingual-es],[data-source-label-es]')?(frenchDetailLabels.get(normalize(source))||source):source;
  const frenchRoldanNotice=["Precios publicados en la carta general de Roldán. Pueden variar; la disponibilidad de productos depende de cada local. Roldán Centro tiene carta y ficha propias.","Prix publiés dans la carte générale de Roldán. Ils peuvent varier ; la disponibilité des produits dépend de chaque établissement. Roldán Centro dispose de sa propre carte et de sa propre fiche."];
  const frenchDetailNotices=new Map([
    ['📍 Varias ubicaciones en Córdoba (consulta los establecimientos de abajo)','📍 Plusieurs adresses à Cordoue (voir les établissements ci-dessous)'],
    ["Información sobre la carta: La carta disponible corresponde a octubre de 2025. Los platos y precios mostrados proceden de esa publicación y podrían haber cambiado. Algunos platos pueden haber dejado de estar disponibles. Recomendamos consultar con Casa Rubio para confirmar la carta y los precios actuales.","Informations sur la carte : la carte disponible date d’octobre 2025. Les plats et prix affichés proviennent de cette publication et peuvent avoir changé. Certains plats peuvent ne plus être proposés. Nous recommandons de consulter Casa Rubio pour confirmer la carte et les prix actuels."],
    ["Carta oficial de octubre de 2025. IVA del 10% incluido. Cesta de pan y picos 2,60 € (histórico). Alérgenos: consultar carta específica del restaurante.","Carte officielle d’octobre 2025. TVA de 10 % comprise. Corbeille de pain et de picos : 2,60 € (prix historique). Allergènes : consulter la carte spécifique du restaurant."],
    ["Pan a elegir: chapata, pan de lino, bollo o pan sin gluten. Extra clásico +0,50 €; extra especial +2 €.","Pain au choix : ciabatta, pain au lin, petit pain ou pain sans gluten. Supplément classique : +0,50 € ; supplément spécial : +2 €."],
    ['El coste total de comer aquí no está documentado. Los precios de platos no incluyen necesariamente bebida ni extras.',"Le coût total d’un repas ici n’est pas documenté. Les prix des plats n’incluent pas nécessairement les boissons ni les suppléments."],
    ['Sin fecha registrada','Aucune date enregistrée'],
    ['Vigencia pendiente de confirmar','Validité à confirmer']
  ]);
  const translateFrenchDetailNotice=(node,source)=>{
    if(!node.parentElement?.closest('#detail-content')||node.parentElement.closest('.menu-dish,[data-venue-menu-section],[data-bilingual-es]'))return source;
    const raw=normalize(source);
    if(frenchDetailNotices.has(raw))return frenchDetailNotices.get(raw);
    if(raw.startsWith('Última consulta: '))return 'Dernière consultation : '+raw.slice('Última consulta: '.length);
    if(raw.startsWith('Comida completa por persona: '))return 'Repas complet par personne : '+raw.slice('Comida completa por persona: '.length);
    return source;
  };
  // Scoped QA-only French rendering for group-menu labels and historical terms.
  // Never translate dish names or mutate source menu records/prices.
  const frenchGroupLabels=new Map([
    ['Menús para grupos · precios publicados en 2025','Menus pour groupes · prix publiés en 2025'],
    ["48 € por persona, IVA incluido. Entrantes para compartir: un plato de cada entrante por cada cuatro personas. Segundo plato individual a elegir y postre individual. Incluye pan, grissini y bebidas según selección publicada (agua mineral, cerveza de barril, refrescos y vinos indicados). No se especifica un mínimo de comensales en la página. Consultar condiciones y disponibilidad con el restaurante.","48 € par personne, TVA comprise. Entrées à partager : une portion de chaque entrée pour quatre personnes. Plat principal individuel au choix et dessert individuel. Pain, grissini et boissons de la sélection publiée compris (eau minérale, bière pression, boissons sans alcool et vins indiqués). La page ne précise pas de nombre minimum de convives. Vérifiez les conditions et la disponibilité auprès du restaurant."],
    ["48 € por persona (IVA incluido). Entrantes para compartir: un plato de cada entrante por cada cuatro personas. Segundo plato y postre individuales. Incluye pan, café y bebidas durante la comida: agua mineral, cerveza de barril o refrescos; vinos indicados en la fuente. Sin mínimo de comensales especificado en la página. Consultar disponibilidad y condiciones.","48 € par personne (TVA comprise). Entrées à partager : une portion de chaque entrée pour quatre personnes. Plat principal et dessert individuels. Pain, café et boissons pendant le repas compris : eau minérale, bière pression ou boissons sans alcool ; vins indiqués dans la source. Aucun nombre minimum de convives n’est précisé sur la page. Vérifiez la disponibilité et les conditions."],
    ["48 € por persona (IVA incluido). Entrantes para compartir: un plato de cada entrante por cada cuatro personas. Segundo plato a elegir y postre individual. Incluye pan, café y bebidas durante la comida: agua mineral, cerveza de barril o refrescos; vinos indicados en la fuente. Sin mínimo de comensales especificado en la página. Consultar disponibilidad y condiciones.","48 € par personne (TVA comprise). Entrées à partager : une portion de chaque entrée pour quatre personnes. Plat principal au choix et dessert individuel. Pain, café et boissons pendant le repas compris : eau minérale, bière pression ou boissons sans alcool ; vins indiqués dans la source. Aucun nombre minimum de convives n’est précisé sur la page. Vérifiez la disponibilité et les conditions."],
    ["38 € por persona, IVA incluido. Entrantes para compartir: un plato de cada entrante por cada cuatro personas. Segundo plato y postre individuales. Incluye pan, grissini y bebidas según selección publicada (agua mineral, cerveza de barril, refrescos y vinos indicados). No se especifica un mínimo de comensales en la página. Consultar condiciones y disponibilidad con el restaurante.","38 € par personne, TVA comprise. Entrées à partager : une portion de chaque entrée pour quatre personnes. Plat principal et dessert individuels. Pain, grissini et boissons de la sélection publiée compris (eau minérale, bière pression, boissons sans alcool et vins indiqués). Aucun minimum de convives n'est précisé sur la page. Vérifiez les conditions et la disponibilité auprès du restaurant."],
    ["Para recibir: Copa de fino Los Amigos, aceitunas y almendras fritas. Bebidas incluidas durante el almuerzo: Fino Pérez Barquero; blanco Bodegas Campos; tinto Bodegas Campos; cerveza de barril; refrescos; café o infusión. IVA incluido; bebidas incluidas durante el almuerzo, excepto consumiciones en barra y posteriores al servicio; pan de masa madre incluido. Consumiciones fuera del servicio de almuerzo no incluidas. Precio por copa no premium: 8 € (IVA incluido), como precio adicional publicado.","À l’accueil : un verre de fino Los Amigos, des olives et des amandes frites. Boissons comprises pendant le déjeuner : fino Pérez Barquero ; vin blanc Bodegas Campos ; vin rouge Bodegas Campos ; bière pression ; boissons sans alcool ; café ou infusion. TVA comprise ; boissons comprises pendant le déjeuner, hors consommations au bar et après le service ; pain au levain compris. Les consommations en dehors du service du déjeuner ne sont pas comprises. Prix supplémentaire publié pour un verre de boisson non premium : 8 € (TVA comprise)."],
    ["Para recibir: Copa de fino Los Amigos, aceitunas y almendras fritas. Bebidas incluidas durante el almuerzo: Fino Pérez Barquero; amontillado Pérez Barquero; oloroso Pérez Barquero; blanco Finca La Cañada; tinto Matarromera crianza o Luis Cañas crianza; cerveza de barril; refrescos; café o infusión. IVA incluido; bebidas incluidas durante el almuerzo, excepto consumiciones en barra y posteriores al servicio; pan de masa madre incluido. Consumiciones fuera del servicio de almuerzo no incluidas. Precio por copa no premium: 8 € (IVA incluido), como precio adicional publicado.","À l’accueil : un verre de fino Los Amigos, des olives et des amandes frites. Boissons comprises pendant le déjeuner : fino Pérez Barquero ; amontillado Pérez Barquero ; oloroso Pérez Barquero ; vin blanc Finca La Cañada ; vin rouge Matarromera crianza ou Luis Cañas crianza ; bière pression ; boissons sans alcool ; café ou infusion. TVA comprise ; boissons comprises pendant le déjeuner, hors consommations au bar et après le service ; pain au levain compris. Les consommations en dehors du service du déjeuner ne sont pas comprises. Prix supplémentaire publié pour un verre de boisson non premium : 8 € (TVA comprise)."],
    ["Mínimo 8 personas. Platos de compartir cada 4 personas. Bebida incluida: refresco, agua, cerveza de barril y vino de la casa, desde el primer plato hasta el comienzo del postre. Comunicar alergias o intolerancias al reservar o con un mínimo de 48 horas de antelación.","Minimum 8 personnes. Plats à partager pour 4 personnes. Boissons comprises : boissons sans alcool, eau, bière pression et vin de la maison, du premier plat jusqu’au début du dessert. Signalez toute allergie ou intolérance lors de la réservation ou au moins 48 heures à l’avance."],
    ["Bebidas durante el almuerzo; oferta sujeta a cambios estacionales","Boissons pendant le déjeuner ; l’offre peut varier selon la saison."],
    ["La lámina indica platos individuales a elegir, postre y una bebida; no especifica inequívocamente cuántos platos individuales incluye. Confirmar condiciones con el local. Precio IVA incluido, vigencia actual sin confirmar.","Le visuel présente des plats individuels au choix, un dessert et une boisson, sans préciser clairement combien de plats individuels sont compris. Vérifiez les conditions auprès du restaurant. TVA comprise ; validité actuelle non confirmée."],
    ["La imagen inglesa indica validez hasta el 30/11/2024; la española no indica fecha. Vigencia pendiente de confirmar.","Le visuel en anglais indique une validité jusqu’au 30/11/2024 ; le visuel en espagnol ne mentionne aucune date. Validité actuelle à confirmer."],
    ['Group set menus · prices published in 2025','Menus pour groupes · prix publiés en 2025'],
    ['Para comenzar','Pour commencer'],['To start','Pour commencer'],
    ['Para continuar','Pour continuer'],['Following courses','Pour continuer'],
    ['Principal · opciones a elegir','Plat principal · au choix'],['Main course · choose an option','Plat principal · au choix'],
    ['Postre','Dessert'],['Dessert','Dessert'],['Postre:','Dessert :'],['Dessert:','Dessert :'],
    ['Aperitivos','Amuse-bouches'],['Appetizers','Amuse-bouches'],
    ['Platos para compartir','Plats à partager'],['Dishes to share','Plats à partager'],
    ['Plato a elegir','Plat au choix'],['Choose a main course','Plat au choix'],
    ['Primer plato','Entrée'],['First course','Entrée'],
    ['Plato principal','Plat principal'],['Main course','Plat principal'],
    ['Platos a elegir','Plats au choix'],['Dishes to choose from','Plats au choix'],
    ['Postre a elegir','Dessert au choix'],['Dessert choices','Dessert au choix'],
    ['Bebidas incluidas (una a elegir)','Boissons comprises (une au choix)'],
    ['Included drinks (choose one)','Boissons comprises (une au choix)'],
    ['Menú infantil','Menu enfant'],["Children's menu",'Menu enfant'],
    ['Bebidas incluidas: agua mineral y dos refrescos','Boissons comprises : eau minérale et deux boissons sans alcool'],
    ['Drinks included: mineral water and two soft drinks','Boissons comprises : eau minérale et deux boissons sans alcool'],
    ['Drinks included: beer, Montilla-Moriles wine, Rioja red wine, mineral water and cava from Bodegas Faustino','Boissons comprises : bière, vin de Montilla-Moriles, vin rouge de Rioja, eau minérale et cava des Bodegas Faustino'],
    ['La documentación de 2025 indica una reserva del 20 % y platos compartidos entre cuatro personas, excepto el principal. Confirmar condiciones actuales.','La documentation de 2025 indique un acompte de 20 % et des plats à partager entre quatre personnes, sauf le plat principal. Vérifiez les conditions actuelles.'],
    ['The 2025 documentation indicates a 20% deposit and dishes shared among four guests, except the main course. Confirm current terms.','La documentation de 2025 indique un acompte de 20 % et des plats à partager entre quatre personnes, sauf le plat principal. Vérifiez les conditions actuelles.'],
    ['Precios históricos de los menús completos publicados en 2025, no confirmados en 2026. Consultar vigencia, condiciones y precio por comensal directamente con el restaurante. No son precios de platos individuales.','Prix historiques des menus complets publiés en 2025, non confirmés pour 2026. Vérifiez leur validité, les conditions et le prix par personne directement auprès du restaurant. Il ne s’agit pas de prix de plats individuels.'],
    ['Historical prices for complete set menus published in 2025; not verified for 2026. Confirm current prices, terms and per-person pricing with the restaurant. These are not individual dish prices.','Prix historiques des menus complets publiés en 2025, non confirmés pour 2026. Vérifiez leur validité, les conditions et le prix par personne directement auprès du restaurant. Il ne s’agit pas de prix de plats individuels.']
  ]);
  const translateFrenchGroupText=(node,source)=>{
    const parent=node.parentElement;
    if(!parent?.closest('#detail-content'))return source;
    // Group menu titles are catalog entries: preserve exact Spanish titles across languages.
    if(parent.matches('[data-group-menu-heading]')||parent.matches('.menu-dish > h4'))return source;
    if(parent.closest('[data-keep-dish-spanish],[data-dish-explanation]'))return source;
    const inGroup=parent.closest('.beatillas-group-menus')||parent.closest('.menu-dish')||parent.hasAttribute('data-group-menu-heading');
    if(!inGroup)return source;
    const value=normalize(source);
    // Exact documented validity note on official set-menu price, preserving the amount.
    if(parent.matches('.menu-dish > strong') && value.endsWith(' · Vigencia pendiente de confirmar'))
      return source.replace(/ · Vigencia pendiente de confirmar$/, ' · Validité à confirmer');
    if(frenchGroupLabels.has(value))return frenchGroupLabels.get(value);
    if(parent.hasAttribute('data-group-menu-heading')){
      // Preserve the original name, monetary amount, guest count and separators.
      return source.replace(/\/(?:persona|person)(?=\s|$)/,'/personne')
        .replace(/ · (?:mínimo |minimum )(\d+) (?:comensales|guests)/,' · minimum $1 personnes');
    }
    if(parent.hasAttribute('data-group-menu-price'))
      return source.replace('Precio de menú publicado en 2025','Prix du menu publié en 2025')
        .replace('2025 published set-menu price','Prix du menu publié en 2025');
    if(parent.hasAttribute('data-group-menu-label-es')){
      // Beatillas supplies an exact English source for these two documented beverage sets.
      const beverageEnglish=parent.dataset.groupMenuLabelEn;
      if(beverageEnglish==='Drinks included: mineral water and two soft drinks')
        return 'Boissons comprises : eau minérale et deux boissons sans alcool';
      if(beverageEnglish==='Drinks included: beer, Montilla-Moriles wine, Rioja red wine, mineral water and cava from Bodegas Faustino')
        return 'Boissons comprises : bière, vin de Montilla-Moriles, vin rouge de Rioja, eau minérale et cava des Bodegas Faustino';
      const m=value.match(/^(?:Menú n\.º|Set menu no\.)\s*(\d+)$/);
      if(m)return 'Menu n° '+m[1];
      if(value.startsWith('Bebidas incluidas: '))return 'Boissons comprises : '+value.slice('Bebidas incluidas: '.length);
      if(value.startsWith('Drinks included: '))return 'Boissons comprises : '+value.slice('Drinks included: '.length);
    }
    return source;
  };
  const frenchSectionHeadings=new Map();
  const translateFrenchHeading=(node,source)=>node.parentElement?.matches('.language-label')&&normalize(source)==='Language / Idioma'?'Langue':node.parentElement?.matches('[data-venue-menu-section]')?(frenchSectionHeadings.get(normalize(source))||source):source;
  const normalize=s=>s.trim().replace(/\s+/g,' ');
  function translateText(node){
    if(!node || !node.parentElement || node.parentElement.closest('script,style,textarea,option[data-keep-original],#language-select,[data-keep-dish-spanish],[data-bilingual-es]'))return;
    if(!originalNodes.has(node))originalNodes.set(node,node.nodeValue);
    const original=originalNodes.get(node);
    const match=original.match(/^(\s*)([\s\S]*?)(\s*)$/);
    const key=normalize(match[2]);
    if(language==='en'){
      const next=match[1]+translateValue(key)+match[3];
      if(node.nodeValue!==next)node.nodeValue=next;
    }else if(language==='fr'){
      const next=match[1]+translateFrenchDetailNotice(node,translateFrenchDetailText(node,translateFrenchDynamicResult(node,translateFrenchResultsText(node,translateFrenchRecommendationsText(node,translateFrenchServiceText(node,translateFrenchHeroText(node,translateFrenchNavText(node,translateFrenchFavoritesNotice(node,translateFrenchSearchText(node,translateFrenchGroupText(node,translateFrenchHeading(node,match[2]))))))))))))+match[3];
      if(node.nodeValue!==next)node.nodeValue=next;
    }else if(node.nodeValue!==original)node.nodeValue=original;
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
        const frenchAccessibleLabels={
          'Language / Idioma':'Langue',
          'Navegación rápida':'Navigation rapide',
          'Momento gastronómico':'Moment du repas',
          'Especialidades cordobesas para buscar':'Spécialités cordouanes à rechercher',
          'Resultados':'Résultats',
          'Ficha del establecimiento':'Fiche de l’établissement',
          'Cerrar recomendaciones':'Fermer les recommandations',
          'Mapa del establecimiento':'Carte de l’établissement',
          'Ej.: Moriles, Casa Bravo, Plateros…':'Ex. : Moriles, Casa Bravo, Plateros…',
          'Escribe o elige un plato cordobés…':'Saisissez ou choisissez une spécialité cordouane…'
        };
        const englishAccessibleLabels={
          'Navegación rápida':'Quick navigation',
          'Momento gastronómico':'Meal occasion',
          'Especialidades cordobesas para buscar':'Córdoba specialities to search',
          'Resultados':'Results',
          'Ficha del establecimiento':'Establishment details',
          'Cerrar recomendaciones':'Close recommendations',
          'Mapa del establecimiento':'Establishment map'
        };
        const translated=language==='en'?(englishAccessibleLabels[source]||translateValue(source)):language==='fr'?(frenchAccessibleLabels[source]||source):source;
        if(element.getAttribute(attr)!==translated)element.setAttribute(attr,translated);
      }
    }
  }
  function applyLanguage(next){
    language=isSupportedLanguage(next)?next:'es';
    document.documentElement.lang=language;
    const select=document.getElementById('language-select');
    if(select && select.value!==language)select.value=language;
    translateElement(document.body);
    for(const element of document.querySelectorAll('[data-bilingual-es]')){
      const translated=language==='fr'&&element.closest('#detail-content')?(normalize(element.dataset.bilingualEs)===frenchRoldanNotice[0]?frenchRoldanNotice[1]:(frenchDetailNotices.get(normalize(element.dataset.bilingualEs))||element.dataset.bilingualEs)):(language==='en'?element.dataset.bilingualEn:element.dataset.bilingualEs);
      if(translated!==undefined && element.textContent!==translated)element.textContent=translated;
    }
    if(typeof window.HelioGastroRefreshExplanations==='function')window.HelioGastroRefreshExplanations();
    try{if(language!=='fr')localStorage.setItem(KEY,language)}catch(e){}
  }
  function init(){
    const select=document.getElementById('language-select');
    if(!select)return;
    if(frenchQaEnabled&&!select.querySelector('option[value="fr"]')){
      const option=document.createElement('option');option.value='fr';option.textContent='🇫🇷 Français (QA)';select.append(option);
    }
    try{const saved=localStorage.getItem(KEY);language=isSupportedLanguage(saved)?saved:'es'}catch(e){}
    select.addEventListener('change',()=>applyLanguage(select.value));
    applyLanguage(language);
    if(frenchQaEnabled){
      fetch('./docs/french-glossary-v1.json',{cache:'no-store'})
        .then(response=>{if(!response.ok)throw Error('FR glossary HTTP '+response.status);return response.json();})
        .then(glossary=>{
          if(!Array.isArray(glossary.sections))throw Error('Invalid FR section glossary');
          for(const entry of glossary.sections){
            if(typeof entry.es!=='string'||typeof entry.fr!=='string'||!entry.es.trim()||!entry.fr.trim()||frenchSectionHeadings.has(entry.es.trim()))throw Error('Invalid or duplicate FR heading');
            frenchSectionHeadings.set(entry.es.trim(),entry.fr.trim());
          }
          if(language==='fr')translateElement(document.body);
        })
        .catch(error=>console.warn('French section glossary unavailable:',error.message));
    }
    const observer=new MutationObserver(records=>{
      for(const record of records){
        if(record.type==='characterData'){
          const node=record.target;
          const previous=originalNodes.get(node);
          if(previous!==undefined){
            const match=previous.match(/^(\s*)([\s\S]*?)(\s*)$/);
            const expected=language==='en'?match[1]+translateValue(normalize(match[2]))+match[3]:language==='fr'?match[1]+translateFrenchDetailNotice(node,translateFrenchDetailText(node,translateFrenchDynamicResult(node,translateFrenchResultsText(node,translateFrenchRecommendationsText(node,translateFrenchServiceText(node,translateFrenchHeroText(node,translateFrenchNavText(node,translateFrenchFavoritesNotice(node,translateFrenchSearchText(node,translateFrenchGroupText(node,translateFrenchHeading(node,match[2]))))))))))))+match[3]:previous;
            if(node.nodeValue===expected)continue;
          }
          originalNodes.delete(node);
          translateText(node);
        }else{
          for(const node of record.addedNodes){
            if(node.nodeType===Node.TEXT_NODE)translateText(node);
            else if(node.nodeType===Node.ELEMENT_NODE){
              translateElement(node);
              const bilingual=[...(node.matches?.('[data-bilingual-es]')?[node]:[]),...(node.querySelectorAll?.('[data-bilingual-es]')||[])];
              for(const element of bilingual){const value=language==='fr'&&element.closest('#detail-content')?(normalize(element.dataset.bilingualEs)===frenchRoldanNotice[0]?frenchRoldanNotice[1]:(frenchDetailNotices.get(normalize(element.dataset.bilingualEs))||element.dataset.bilingualEs)):(language==='en'?element.dataset.bilingualEn:element.dataset.bilingualEs);if(value!==undefined && element.textContent!==value)element.textContent=value;}
            }
          }
        }
      }
    });
    observer.observe(document.body,{childList:true,characterData:true,subtree:true});
  }
  window.HelioGastroLanguage={set:applyLanguage,get:()=>language,qaFrenchEnabled:()=>frenchQaEnabled};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
