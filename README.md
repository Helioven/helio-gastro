# Helio Gastro 1.0 — piloto

> **CONTINUACIÓN PRIORITARIA (07/11/2026):** el [handoff operativo para el domingo 8 de noviembre](#handoff-operativo-para-el-domingo-8-de-noviembre-de-2026--consejo-de-manolo) resume el estado de Git, el motor de «El Consejo de Manolo» y el siguiente encargo a Codex. El trabajo de reseñas sigue **solo en QA, sin datos reales ni despliegue**. La identidad vigente del proyecto es **ManoloLabs by Helio**.

Aplicación estática y mobile-first de búsqueda gastronómica en Córdoba. Proyecto de Helio Software Studios.

> **Estado actualizado (06/11/2026):** francés público ES/EN/FR y fase 3 de QA integral en marcha. Las PR [#44–#50](https://github.com/Helioven/helio-gastro/pulls?q=is%3Apr+is%3Amerged) están integradas en `main`. La cobertura automática incluye enlaces, rendimiento de carga FR, caché/recargas, navegación accesible y avisos dinámicos. **El contraste visual sigue pendiente de revisión real.** Consulta [Estado vigente y continuación](#estado-vigente-fase-3-qa-integral--6-de-noviembre-de-2026) al final de este documento.

## Incluye
- Buscador por plato, presupuesto por persona, zona y fiabilidad del precio.
- Comparador de hasta 3 establecimientos.
- Base `data/places.json` vacía **a propósito**: sin precios, reseñas ni establecimientos inventados.
- HTML/CSS/JS sin dependencias. Preparado para GitHub Pages.
- PWA: manifiesto básico; service worker y notificaciones pendientes.

## Esquema de cada establecimiento
```json
{
  "id": "slug-unico",
  "name": "Nombre verificado",
  "area": "Barrio o zona",
  "dishes": ["Plato verificado"],
  "mealCostEur": null,
  "dishPrices": [{"dish": "Flamenquín (ración)", "eur": 12.50}],
  "priceStatus": "unknown",
  "checkedAt": "YYYY-MM-DD",
  "sources": [{"label":"Carta oficial","url":"https://sitio-real.com/carta"}]
}
```
`mealCostEur` corresponde a un coste estimado por persona, no al precio aislado de un plato. Estados: `confirmed`, `estimated`, `unknown`. No señalar como confirmado un coste sin fuente y fecha de comprobación.

## Ejecutar
Desde el directorio del proyecto: `python -m http.server 8000` y entrar en `http://localhost:8000`. No usar `file://` (fetch JSON).

## Publicación
Settings → Pages → Deploy from a branch → `main` → `/(root)`.

## Casos QA iniciales
| ID | Prueba | Resultado esperado |
|---|---|---|
| HG-001 | Base vacía | 0 fichas, mensaje honesto |
| HG-002 | Buscar flamenquín | Solo resultados documentados coincidentes |
| HG-003 | Presupuesto 15 € | Excluir costes desconocidos o mayores |
| HG-004 | Elegir 4 para comparar | Máximo 3 |
| HG-005 | Precio estimado | Etiqueta explícita |
| HG-006 | Abrir fuente | HTTPS y rel seguro |
| HG-007 | Móvil 360 px | Sin desbordamiento horizontal |

Siguiente etapa: investigar 20–30 lugares reales, verificar carta y fecha, separar costes confirmados y estimados, registrar evidencias y pulir accesibilidad.

## Primera tanda documental (9 de octubre de 2026)
Cuatro locales del centro: Taberna La Montillana, Taberna Salinas, Bodegas Mezquita Céspedes y Taberna El Poema (Alonso de Burgos).

Se registran **seis precios de platos publicados por los propios locales** en Montillana y Bodegas Mezquita. No se ha confirmado un coste total comparable por persona en ninguno de los cuatro locales: por eso `mealCostEur` permanece en `null` y el filtro de presupuesto excluye correctamente esas fichas cuando se fija un máximo. Por defecto se muestran sin límite de presupuesto para poder explorarlas. Las otras dos tabernas tienen carta o información oficial de platos sin precios comprobables.

### QA adicional
- HG-008: buscar «flamenquín» muestra locales con ese plato documentado.
- HG-009: mostrar precio de plato y distinguirlo claramente del coste de comida.
- HG-010: con presupuesto de 15 €, excluir fichas con `mealCostEur=null`.
- HG-011: enlaces externos con `https`, `noopener` y `noreferrer`.

## Versión 1.3 — funcionalidad y fuentes
- Siete establecimientos del centro de Córdoba y 18 precios de platos documentados.
- Al buscar una especialidad, el listado de precios de cada ficha destaca solo los platos coincidentes.
- Se separa explícitamente **comida completa por persona (desconocida)** de **precio de platos publicado en carta**.
- Tres fichas adicionales: Taberna Rafaé (Deanes 2), La Manuela (Cardenal González 69) y Góngora (Conde de Torres Cabrera 4).
- Las fuentes se consultaron el 9 de octubre de 2026. Los precios son publicaciones de las propias cartas, no presupuestos garantizados. Las raciones y medias raciones no se equiparan entre sí.

### Pruebas QA 1.3
- HG-012: buscar 'flamenquín' no debe mostrar precios de salmorejo dentro de la ficha.
- HG-013: buscar 'rabo de toro' muestra precios de rabo donde estén documentados.
- HG-014: los tres locales nuevos tienen dirección, fuentes HTTPS y fecha de consulta.
- HG-015: el filtro de comida completa nunca usa el precio de una media ración como si fuera el coste total.

## Versión 1.6 — Tabernas y platos típicos
- 10 locales documentados, incluidos San Miguel · El Pisto (Plaza San Miguel, 1), Plateros San Francisco (San Francisco, 6) y Sociedad Plateros María Auxiliadora (María Auxiliadora, 25).
- Los tres locales añadidos tienen especialidades y enlaces oficiales, **sin precios actuales comprobados**. No se usan cartas de 2020 para imputar precios actuales.
- Accesos rápidos a 10 especialidades (flamenquín, salmorejo, rabo de toro, mazamorra, carrillada, berenjenas, croquetas, pisto, cochifrito, codillo). Las sugerencias preparan el campo pero **no ejecutan búsquedas**: solo lo hace el botón Buscar.

QA: HG-017 selección de plato típico sin auto-búsqueda; HG-018 consulta de mazamorra; HG-019 cambio de filtros sin revelar resultados; HG-020 precios nulos en nuevas fichas.

## Versión 1.7 — cobertura de platos frente a precios
El filtro «Solo precios documentados» se mantiene estricto, pero el resultado explica cuántos locales en **nuestra base parcial** tienen el plato registrado y cuántos cuentan con un precio. Un botón voluntario «Ver todos los locales que ofrecen este plato» retira los filtros monetarios y vuelve a buscar. Nunca se atribuye un precio desconocido ni se hace pasar el registro como un censo completo de Córdoba.

- HG-021: croquetas: aparecen al menos 4 locales documentados sin filtros de precio.
- HG-022: codillo: aparece Plateros San Francisco sin precios.
- HG-023: «Solo precios documentados» muestra solo platos con precio conocido.
- HG-024: botón Ver todos elimina filtros monetarios únicamente después de clic; no hay autobúsqueda al cargar.

## Versión 1.8: resultados agrupados y 12 locales
- Dos incorporaciones con webs y platos documentados: Taberna El Nº 10 (Romero 10) y La Cazuela de la Espartería (Rodríguez Marín 16).
- 12 establecimientos en total. Los dos nuevos **no tienen precios transcritos/confirmados**; no se infieren desde cartas PDF antiguas.
- Fichas destacan el plato que coincide en vez de mostrar todas las especialidades antes de la información esencial.
- Resultados agrupados en precio documentado o precio sin verificar; la agrupación solo habla del plato o coste seleccionado por el usuario.
- QA HG-025: comprobar croquetas sin exigir precios; HG-026: comprobar flamenquín con un presupuesto; HG-027: comprobar que no aparece una lista genérica en las búsquedas específicas.

## Versión 1.9 — 16 locales, unidades y menús de grupo
- Cuatro incorporaciones fundamentadas en fuentes oficiales: La Viuda, La Taberna del Río, Puerta Sevilla y La Posada del Caballo Andaluz.
- La Viuda: carta online con diez precios de platos, anotando tapa / media / ración / unidad. En el caso de croquetas, 1,50 € corresponde a **una unidad**, no una ración.
- La Taberna del Río: menú Lares 2026, 36 € por persona para un **mínimo de ocho personas**; se almacena como `groupMenus`, nunca como `mealCostEur` para un comensal individual.
- Otras dos incorporaciones: platos publicados por los establecimientos, sin precio confirmado para esas especialidades.
- QA HG-028: croqueta de La Viuda no equiparada a ración de Góngora; HG-029: menú de grupo no entra en comparador individual; HG-030: al buscar una especialidad siguen apareciendo locales sin precio cuando está permitida la opción; HG-031: búsqueda permanece oculta hasta pulsar Buscar.

## Versión 2.0: formatos de ración y comparador
- Filtra por unidad, tapa, media ración, ración completa o formato sin especificar.
- La inferencia del formato solo se hace desde campos explícitos o palabras inequívocas del nombre del plato; si faltan, no suponemos que sea ración.
- El presupuesto, la ordenación y el comparador usan el formato elegido. Sin filtro de formato se muestran precios, pero no se consideran cantidades equivalentes.
- Los menús para grupos siguen fuera del coste de comida individual.
- QA: croquetas La Viuda 1,50 € por unidad vs Góngora 7,50 € media / 14,50 € ración; flamenquín Montillana 8,50 € media / 12,50 € ración; preservar botón Buscar.

## 2.2: fichas de establecimiento a demanda
- Resultados resumidos con nombre, zona, especialidad coincidente, precio disponible y botón «Ver ficha completa».
- La ficha incorpora dirección, enlace a mapas, todas las especialidades, precios de carta, condiciones de menú de grupo cuando existan, fuentes y fecha de consulta.
- No se muestra «No disponible» repetidamente en resultados y comparador. Si el coste de una comida es desconocido, se explica una sola vez en la ficha.
- QA: verificar La Viuda (precios), Salinas (sin precios), La Taberna del Río (menú 8+), enlaces seguros, botón cerrar y búsqueda manual.

## Versión 2.3 — Cartas agrupadas
- Una sección por plato con sus importes separados por unidad/tapa/media/ración.
- Las especialidades registradas sin precio pasan a una sola sección discreta final.
- No se inventan importes ni se deducen formatos no registrados.
- Para evitar duplicados, se relaciona el nombre de la especialidad con la denominación publicada de su precio; se mantiene el nombre original si difiere.
- Casos QA: La Viuda agrupa tres precios del salmorejo y de la mazamorra; Salinas lista especialidades sin precios; La Taberna del Río conserva condiciones del menú de grupo; búsqueda y comparador sin cambios.

## 2.4: tabernas favoritas
- Guardar/quitar favoritos en resultados, en la ficha o desde la lista personal.
- Persistencia localStorage (`helio-gastro-favorites-v1`) y limpieza de identificadores que ya no estén en la base.
- Favoritos accesibles sin ejecutar una búsqueda: abrir ficha directamente desde la lista.
- Sin cuentas ni servidor; datos propios de cada navegador. Puede no persistir en navegación privada o si el almacenamiento está bloqueado.
- QA: marcar La Viuda, recargar, abrir ficha, quitar, comprobar que se actualizan todos los botones y que la búsqueda sigue siendo manual.

## 2.4.1 — Restauración de búsqueda y comparador
- Guarda la última búsqueda ejecutada, sus filtros y hasta tres ID seleccionados para comparar en localStorage.
- Al recargar, restaura resultados desde los datos actuales sin desplazar automáticamente el scroll ni simular un clic del usuario.
- Si el usuario no había buscado, sigue arrancando con los resultados ocultos.
- La selección se valida contra los locales disponibles. Si localStorage está bloqueado, funciona sin persistencia.
- QA: sin búsqueda previa, inicio limpio; con flamenquín/ración/20€ y 3 comparados, tras recarga permanecen filtros, resultados y comparación; cambiar filtros sin pulsar Buscar no ejecuta búsqueda; no más de 3 comparados.

## Versión 2.5 — recomendaciones directas
- Ocho platos con acceso directo desde portada, sin configurar filtros.
- Los precios de cada plato se presentan agrupados por variante y formato; los locales sin precio documentado se muestran aparte.
- No hay valoración de calidad ni promesa sobre tamaños equivalentes. Se mantiene la búsqueda manual y persistencia del comparador.
- Pruebas: flamenquines tradicional/rabo separados, croquetas por unidad y media ración, consulta rápida y apertura de ficha.

## 2.5.2 — Modal de recomendaciones
- Pulsar un plato abre un cuadro modal desplazable sin alargar la página principal.
- Se cierra por botón o Esc; al abrir una ficha se cierra antes el modal y se muestra la ficha correspondiente.
- Conserva el estado de filtros, favoritos y comparador y usa el diálogo nativo accesible del navegador.
- QA: abrir flamenquín, desplazar contenido, cerrar con Esc y botón, abrir ficha, comprobar la persistencia tras F5.

## 2.6: mapa bajo demanda y rutas a pie
- «Ver mapa» desde resultados, favoritos, recomendaciones y ficha; abre ventana con mapa incrustado a partir del nombre y dirección registrados, más enlace directo a Google Maps.
- En el comparador, cuando se eligen 2 o 3 locales, aparece «Ruta a pie» con origen, destino y, si procede, punto intermedio en Google Maps. El orden usa el de los locales seleccionados al reconstruir la lista de datos, no optimiza distancia.
- No almacena coordenadas inventadas ni calcula distancias. Las ubicaciones deben verificarse en Google Maps; el mapa de terceros solo se carga bajo demanda.
- QA: La Viuda vista en mapa y cierre; selección de 2/3 locales para ruta externa; recomendación Croquetas > Ver mapa; cerrar con Esc; favoritos y comparador sobreviven a recarga.

## 2.7 — Navegación rápida
- Barra compacta de acceso a Platos, Buscar y Favoritos, más Comparar cuando hay una búsqueda activa.
- Al seleccionar o quitar restaurantes se actualiza el contador de comparación; el enlace se oculta si se limpia la búsqueda.
- Anclas accesibles, desplazamiento con margen para la barra fija y disposición desplazable en móvil.
- No altera datos, filtros, almacenamiento ni modal de recomendaciones y mapas.
- QA: Platos > Buscar > Favoritos; seleccionar 2 locales y pulsar Comparar 2; F5 debe mantener comparador; Limpiar búsqueda oculta Comparar.

## 2.8 — Ampliación documentada de clásicos cordobeses
- 27 establecimientos, frente a 16: Bodegas Campos, Casa Pepe, Casa Rubio, El Churrasco, El Caballo Rojo, Beatillas, Casa Bravo, El Abuelo, Bar Moriles (Antonio Maura), Moriles Ribera y Moriles Casa Fina.
- 29 precios de plato añadidos donde existe carta oficial con formato explícito (El Caballo Rojo y Casa Bravo). Sin importes de plato inventados para otros locales.
- Bodegas Campos: menú degustación Tradición 66 € por persona, con reserva previa y entre 2 y 4 personas (no se confunde con coste habitual de comida).
- Casa Pepe y Casa Rubio: enlace a carta PDF oficial pero sin transcribir importes de formatos inciertos. Los Moriles se documentan como establecimientos diferentes.
- QA recomendado: flamenquín 12,95 € Casa Bravo frente a 12 € Caballo Rojo, croquetas por media y ración, carrillada en Casa Bravo, 27 locales y dirección/mapas de las tres sedes Moriles.
- Los precios proceden de fuentes consultadas el 09/10/2026 y deben confirmarse antes de desplazarse.

## 2.8.1 — Búsqueda por nombre de establecimiento
- Nuevo filtro independiente «Nombre del establecimiento»; escribir Moriles devuelve sus tres locales aunque el campo del plato esté vacío.
- El filtro de plato solo examina platos y precios, nunca nombres de locales: evita falsos positivos.
- Cuando no hay plato elegido, las fichas de resultados muestran un resumen de carta en lugar de afirmar que falta el precio de un plato inexistente.
- El nombre buscado se conserva junto con el resto de filtros y la selección del comparador tras F5. «Limpiar búsqueda» restaura también este campo.
- QA: Moriles = 3 sedes con nombre; sin plato ningún mensaje «precio del plato pendiente»; flamenquín + Moriles = sede de Ciudad Jardín; F5 y limpiar.

## 2.9 — Esquema de cartas por servicio (sin modificar la interfaz)
- Los 27 establecimientos usan ahora `menus`, una colección de cartas por servicio: `general`, `desayuno`, `comida`, `merienda` o `cena`.
- Las cartas existentes se migran todas a `general`: NO se afirma que un local sirva esas especialidades en un horario concreto. Ni la ausencia de una carta en un servicio significa que el bar no lo ofrezca.
- `app.js` contiene `normalizePlace`, adaptador que aúna cartas por servicio y reconstruye `dishes` y `dishPrices` para la interfaz actual. El adaptador también acepta antiguos registros planos para migraciones futuras.
- Para añadir desayunos verificados en una futura versión: nueva carta en `menus` con `service: "desayuno"`, especialidades, formatos y precios contrastados; nunca mezclar automáticamente el precio de un desayuno completo con el precio individual de una tostada.
- Los formatos actuales (unidad, tapa, media, ración y desconocida) siguen asociados a cada precio; formatos futuros como media tostada, tostada entera, pieza o desayuno combinado requieren reglas explícitas antes de activar la interfaz 3.0.
- Los horarios de servicio NO se han inferido ni registrado; exigir fuente específica antes de afirmar disponibilidad por franja.
- Regresión: las 27 fichas, precios, recomendaciones, búsqueda por nombre, favoritos, rutas y comparador deben seguir igual que en 2.8.1.

## 3.0 — Elección de momento gastronómico
- Nueva portada con Desayunar, Comer, Merendar y Cenar. Cada elección actualiza propuestas y escalas de presupuesto: desayuno 3–10 €, merienda 3–12 €, comidas/cenas 10–50 €.
- Carta específica por servicio solo cuando existe. Sin datos de desayuno/merienda confirmados, devuelve resultados vacíos con explicación: no se adjudican servicios a locales sin respaldo.
- La carta general anterior permanece accesible como catálogo exploratorio al elegir comida o cena, con aviso claro de que el servicio y sus horarios no están verificados.
- Cambio de servicio limpia la búsqueda y selección activa para evitar comparaciones cruzadas; conserva favoritos y base de datos. La última búsqueda y modo se restauran tras F5.
- Los filtros de formatos se adaptan al momento gastronómico; no se inventan horarios, teléfonos, aperturas en tiempo real ni precios de desayunos.
- QA: Comer > Flamenquín y precio Rafaé; Desayunar > Churros sin locales falsamente disponibles; Merendar sin datos; Cenar > croquetas como catálogo general con advertencia; F5 restaura el modo y búsqueda.

## 3.0.1 — Iconos de platos y estados vacíos
- Restaura iconos específicos por especialidad en comidas y cenas, extendiéndolos a desayunos y meriendas.
- En desayunos y meriendas sin carta verificada las tarjetas indican «Pendiente de incorporar cartas verificadas» en vez de sugerir una búsqueda fallida con cero locales.
- Al abrir una sugerencia o buscar sin cobertura se explica que falta documentación, no que el restaurante esté cerrado.
- No añade horarios, desayunos ni precios no verificados. Conserva 27 establecimientos, búsqueda, mapas, favoritos y comparador.

## 3.1 — Primeros desayunos documentados de Córdoba
- Churros Bar Marta (Cruz Conde, 32), Cafetería Don Pepe Centro (Diego de León, 6), Cafetería Bar Don Pepe Ciudad Jardín (Antonio Maura, 35), cada establecimiento independiente.
- 30 locales en total; tres cartas `service: desayuno` con churros, chocolate, café o tostadas respaldados por sus fichas/reseñas. Precios no confirmados; se dejan vacíos en vez de estimar.
- Horarios generales consultados y consignados como NOTA orientativa de cada local; NO deben usarse para afirmar disponibilidad de churros, cocina o servicio a una hora concreta. Si las fuentes discrepan se indica expresamente.
- Atención: existen dos establecimientos llamados Don Pepe en la ciudad, no se mezclan sus direcciones ni sus fuentes.
- Casos QA: Desayunar > Churros muestra 3 locales; Desayunar > Tostadas muestra los 3; Comer > Flamenquín mantiene datos antiguos; buscar Don Pepe por nombre en desayuno devuelve 2; Marta 1; F5 conserva búsqueda y modo.

## 3.1.1 — Mensajes de desayuno basados en los datos
- Los avisos de selección de servicio, buscador y recomendaciones ahora cuentan los locales que realmente tienen carta específica.
- Diferencia especialidad documentada de precios y horarios confirmados, y deja de afirmar cero locales cuando existen tres.
- Se conservan las dos ubicaciones contrastadas de Don Pepe por separado. No se presupone franquicia o relación societaria ni se agregan locales sin dirección contrastada.
- Regresión: desayunar > churros/tostadas muestra tres; merendar sin datos sigue explicando que faltan cartas; se conservan búsqueda y comparador.

## Hoja de ruta acordada — 16 de octubre de 2026

Orden de trabajo para Helio Gastro (42 restaurantes registrados; las cartas no están todas completas):

1. **Completar las cartas de los restaurantes**: continuar por las fichas pendientes, sección a sección; conservar nombre, ingredientes confirmados, tamaños, precios y fuentes. No inventar precios ni ingredientes. No subir una carta parcial hasta que Helio confirme que está terminada. Próximo restaurante propuesto: Taberna El Poema · Alonso de Burgos.
2. **Añadir francés**: interfaz y cartas en español, inglés y francés; conservar denominaciones tradicionales cuando proceda.
3. **Auditoría integral y QA**: comprobar integridad de las 42 fichas, duplicados, correspondencia de precios y formatos, traducciones, buscador en los tres idiomas, filtros, comparador, navegación, móvil y escritorio.
4. **Envío de reseñas y comentarios**: formulario público, almacenamiento apropiado, moderación, privacidad y protección frente a spam.
5. **Resúmenes de reseñas por restaurante**: mostrar síntesis útil de opiniones reales en vez de decenas de comentarios; distinguir las reseñas propias de fuentes externas, respetando licencias, atribución y condiciones de uso. No inventar valoraciones.
6. **Imágenes al final**: no utilizar fotografías oficiales sin autorización; usar imágenes propias, generadas o con licencia adecuada, identificadas claramente como ilustrativas. Aviso propuesto: «Imagen ilustrativa. La presentación real puede variar»; incluir equivalente en los tres idiomas. Los enlaces directos a fotos de terceros fueron retirados de `data/places.json` el 16/10/2026.
7. **Revisión final del producto**: repasar funcionalidades, experiencia de usuario, accesibilidad, rendimiento, privacidad, seguridad y decidir si falta algo antes del lanzamiento.

Mejoras transversales: indicar fecha de verificación de cada carta y estudiar un mecanismo para que visitantes avisen de datos o precios incorrectos. Prioridad general: **datos reales → tres idiomas → QA → reseñas → imágenes → revisión final**.

### Dependencias entre fases y puntos de control (20/10/2026)
- **Fase 1 → fase 2 (cartas → francés):** antes de traducir, hacer una validación documental ligera de cada carta completada: fuente, fecha de consulta, precios, formatos, ingredientes confirmados y ausencia de duplicados evidentes. Corregir primero los datos de origen para evitar traducir errores o rehacer traducciones. Esta comprobación no sustituye la auditoría integral de la fase 3.
- **Fase 2 → fase 3 (idiomas → QA):** una vez incorporado el francés, comprobar correspondencia entre ES/EN/FR, denominaciones tradicionales y visualización de textos en móvil y escritorio. Registrar defectos y corregirlos antes de cerrar la fase de QA.
- **Fase 3 → fases 4 y 5 (QA → reseñas):** estabilizar buscador, fichas, filtros y navegación antes de introducir formularios y almacenamiento de comentarios. Los resúmenes solo podrán utilizar reseñas reales disponibles y verificables; primero definir moderación, privacidad, consentimiento y tratamiento del spam.
- **Fases 4 y 5 → fase 6 (reseñas → imágenes):** mantener las imágenes para el final y verificar derechos de uso, atribución y etiquetas ilustrativas antes de incorporarlas. No bloquear la revisión de datos por falta de imágenes.
- **Todas las fases → fase 7 (revisión final):** realizar pruebas de regresión después de cambios relevantes, no únicamente al final. La publicación se decidirá tras comprobar integridad de datos, funciones críticas, accesibilidad, rendimiento, privacidad y seguridad.
- **Gestión de cambios:** si se modifica una carta ya traducida, revisar sus versiones en los tres idiomas y repetir las pruebas afectadas. Mantener el orden general acordado y registrar las excepciones justificadas.

### Criterio documental: las dos Tabernas El Poema (16/10/2026)
- **Alonso de Burgos, 2**: usar únicamente platos y precios verificables en las cartas de Just Eat (https://www.just-eat.es/restaurants-taberna-el-poema-cordoba/menu) y Uber Eats (https://www.ubereats.com/es/store/taberna-el-poema/CbDjgDGhVEqNYmYsVKSpJA). Identificar claramente la fuente y advertir que los precios de reparto pueden diferir de los precios en sala. No mezclar importes entre plataformas sin atribución.
- **Gran Capitán, 29**: ficha diferenciada, pero sin carta verificable; indicar «Carta no disponible / pendiente de verificar». No extrapolar platos, ingredientes ni precios de Alonso de Burgos. Restaurant Guru puede servir para identificar el local, no para copiar imágenes de usuarios.
- **Imágenes**: prohibido incorporar fotos de terceros subidas a Restaurant Guru, Google u otras plataformas sin permiso o licencia válida. Se mantiene la fase de imágenes para el final.
- **Estado**: decisión editorial documentada; transcripción completa de Alonso de Burgos y edición de las fichas de datos pendientes de ejecución y comprobación.

## Investigación exploratoria — rutas gastronómicas personalizadas (20/10/2026)

> **Estado: idea en investigación; no aprobada para desarrollo ni incorporada a la hoja de ruta de siete fases.** Este apartado conserva hipótesis y tareas de validación, no requisitos cerrados ni funcionalidades implementadas. No modificar prioridades ni código por esta investigación sin decisión posterior.

### Hipótesis de valor y diferenciación
- Evolucionar de un directorio/comparador de cartas hacia una herramienta para **decidir qué comer, dónde y por cuánto**, combinando platos concretos, precios documentados y recorridos a pie.
- Explorar un **planificador de rutas gastronómicas personalizadas por Córdoba**: varias paradas seleccionadas por platos, presupuesto y preferencias, en vez de limitarse a mostrar restaurantes en un mapa.
- Diferenciación por **calidad y transparencia de datos**: indicar fuentes, fecha de verificación, tipo de precio (sala/reparto), formatos (unidad/tapa/media/ración) e incertidumbres. No comparar formatos incompatibles como si fueran equivalentes.
- La búsqueda por plato y las rutas gastronómicas **no son conceptos exclusivos**; investigar competidores y validar con usuarios antes de afirmar novedad o demanda.

### Funciones candidatas a estudiar (no implementadas)
1. **Origen configurable:** ubicación actual solo con permiso explícito o punto de partida manual (p. ej., Plaza de las Tendillas).
2. **Preferencias de ruta:** platos deseados, presupuesto por persona o total, número de comensales, máximo de paradas y distancia/tiempo a pie.
3. **Modos de planificación:** ruta automática por preferencias, ruta manual con locales/platos seleccionados y rutas temáticas (tapeo tradicional, económica, frituras, etc.). No afirmar aptitud para dietas o alérgenos sin evidencia documental suficiente.
4. **Recorrido calculado:** ordenar paradas de forma razonable, estimar coste únicamente con precios y formatos contrastados, y mostrar claramente los datos desconocidos. No garantizar disponibilidad de platos, apertura ni mesa.
5. **Cambios durante el recorrido:** opción de saltar una parada y recalcular el resto conservando preferencias y presupuesto.
6. **Experiencia simple:** entrada rápida tipo «Sorpréndeme» y controles avanzados opcionales; evitar una interfaz sobrecargada.
7. **Otras hipótesis complementarias:** planificador de comida por presupuesto, comparador explícito de formatos/raciones, ficha de confianza de cada carta y posible búsqueda conversacional **limitada a datos verificados**.

### Investigación de mercado pendiente
- Comparar funciones reales y cobertura en Córdoba de Google Maps, TheFork, Tripadvisor y servicios especializados en cartas, búsqueda por plato o rutas de tapas (p. ej., Restauranis, MenuRoom, Foodyt, Dishity y Gastrorutas). Las menciones son **candidatos a analizar, no una auditoría competitiva concluida**.
- Examinar fuentes recientes (preferentemente 2024–2026) sobre turismo gastronómico local, consulta digital de cartas, sensibilidad al precio y necesidades no cubiertas; distinguir datos específicos de Córdoba de estadísticas nacionales y de hipótesis.
- Investigar cómo gestionan otros productos las cartas desactualizadas, precios de reparto frente a sala, tamaños de ración y disponibilidad.
- Preparar una prueba de concepto **sin cambiar la interfaz** con cartas verificadas: ¿pueden generarse rutas plausibles para varias combinaciones de platos, presupuesto y origen? Registrar datos faltantes, errores y límites.
- Validar utilidad con usuarios reales antes de priorizar desarrollo. No inventar métricas de demanda, cifras de mercado ni resultados de entrevistas.

### Nombre comercial y comprobación de marcas
- **«GPS de la Fritanga»** fue una broma interna, **no** un nombre comercial propuesto.
- **«GastroRuta»** gustó como nombre inicial, pero apareció un servicio del mismo ámbito llamado **Gastrorutas** (https://gastrorutas.app/). Esto representa un **posible riesgo de confusión**, no una constatación de infracción ni de registro marcario.
- **No adoptar todavía «GastroRuta» como marca definitiva.** Buscar alternativas más distintivas; nombres mencionados para explorar: SaborBrújula, BocadoNómada y Helio Rutas (todos **sin verificar**).
- Antes de elegir nombre: comprobar coincidencias exactas y similares en OEPM (https://consultas2.oepm.es/LocalizadorWeb/index.jsp) y EUIPO (https://www.euipo.europa.eu/es/search), usos comerciales, dominios y denominaciones del mismo sector. La ausencia de resultados en una búsqueda web no equivale a disponibilidad legal; considerar asesoramiento especializado si se va a registrar o comercializar.

### Criterios para decidir si avanzar
- Datos suficientes y fiables para recomendar paradas sin inventar precios, ingredientes ni horarios.
- Ventaja comprensible frente a herramientas existentes, contrastada mediante investigación y pruebas de uso.
- Viabilidad técnica de rutas y recálculo, permisos de ubicación y tratamiento de privacidad.
- Nombre distintivo tras comprobación de marcas.
- **Punto de decisión futuro:** evaluar la idea tras cumplir las prioridades de la hoja de ruta vigente; documentar aceptación, descarte o aplazamiento antes de implementarla.


## Control de cartas revisadas y cerradas (24/10/2026)

- **Bodegas Campos — REVISADA Y CERRADA (24/10/2026).** Helio confirma que la carta se ha revisado y completado. **No volver a incluir en la lista de restaurantes pendientes de revisión** ni repetir una auditoría documental completa sin una nueva incidencia, cambio acreditado de carta o solicitud expresa. Este cierre es un control editorial de avance; no modifica precios ni sustituye futuras pruebas de regresión de la aplicación.
- **Casa Pepe de la Judería — REVISADA Y CERRADA (24/10/2026).** Helio confirma la carta completa y revisada; etiquetas de fuentes uniformadas en inglés y fecha de revisión actualizada. Excluir de nuevas revisiones completas salvo cambios documentados o incidencia específica.
- **Restaurante Casa Rubio — REVISADA Y CERRADA (24/10/2026).** Helio confirma que la carta de octubre de 2025 sigue siendo la misma y da por completada la revisión de la ficha. Se corrigen al inglés las etiquetas de las fuentes y se actualiza `checkedAt`. No volver a revisar íntegramente salvo cambio documental, incidencia o solicitud expresa.

### Revisión aplazada — Restaurante El Churrasco (24/10/2026)

- **Estado: EN PAUSA / PENDIENTE DE VERIFICACIÓN; NO CERRADO.** Al revisar el 24/10/2026, la web del restaurante mostraba un aviso de renovación («Estamos renovando nuestra web, próximamente estaremos activos»). No es posible contrastar la carta con la web oficial en este momento.
- Conservar los datos existentes sin atribuirles una nueva verificación; no modificar precios, formatos, ingredientes ni la fecha de comprobación de la ficha por este intento fallido.
- Reanudar la comprobación cuando vuelva a estar accesible una fuente oficial adecuada. No confundir el mantenimiento de la web con el cierre del restaurante.

### Cierre de revisión — Rincón de las Beatillas (24/10/2026)

- **Taberna Rincón de las Beatillas — REVISADA Y CERRADA.** Helio confirma que la ficha y carta están completas respecto a las fuentes consultadas. **Los precios no figuran en la fuente**, por lo que se mantienen sin inventar ni estimar. Excluir de próximas revisiones ordinarias; reabrir solo ante nueva fuente, incidencia o cambio contrastado.

### Cierre de revisión — Taberna Ágora Casa Bravo 1919 (24/10/2026)

- **Taberna Ágora Casa Bravo 1919 — REVISADA Y CERRADA.** Helio confirma que la carta registrada está completa. Excluir de próximas revisiones ordinarias salvo cambio documentado, incidencia o nueva solicitud. Sin modificar datos gastronómicos ni afirmar una verificación independiente de precios.

- **Taberna El Abuelo — REVISADA Y CERRADA (23/10/2026).** Helio confirma que esta revisión se completó el 23/10/2026. Excluir de nuevas revisiones ordinarias salvo cambios documentados o incidencia; no modificar carta ni fecha de comprobación solo por registrar el cierre.
- **Moriles Ribera — REVISADA Y CERRADA (24/10/2026).** Helio confirma que la carta está completa y que las etiquetas de las fuentes en inglés se muestran correctamente tras la corrección. No repetir la revisión ordinaria salvo cambios verificados, incidencia o petición expresa.
- **Moriles Casa Fina — REVISADA Y CERRADA (24/10/2026).** Helio confirma que la carta está completa y que las etiquetas de las fuentes en inglés se muestran correctamente tras la corrección. No repetir la revisión ordinaria salvo cambios verificados, incidencia o petición expresa.

- **Bar Moriles · Ciudad Jardín — REVISADA Y CERRADA (24/10/2026).** Helio confirma que la carta y la ficha están correctas y completas. No incluir en próximas revisiones ordinarias salvo actualización documental, incidencia o solicitud expresa; no modificar precios ni otros datos gastronómicos por este cierre.

- **Churros Bar Marta — REVISADO Y CERRADO (24/10/2026).** Helio confirma la revisión de la carta de desayunos, sus 15 precios publicados, las traducciones ES/EN y la claridad de la etiqueta de desayuno combinado. La atribución y titularidad de churrosbarmarta.shop quedan sujetas a la cautela documental anotada en los datos. Excluir de revisiones ordinarias salvo nueva evidencia, cambio de carta, incidencia o solicitud expresa.

### Carta documentada — Don Pepe Antonio Maura (24/10/2026)

- **Estado: incorporada, pendiente de QA visual; NO CERRADA.** Se han documentado 18 apartados y 114 entradas de carta (incluida la nota de menú del día), con **18 precios publicados** procedentes de la transcripción facilitada por Helio del menú mostrado en la búsqueda de Google. Sin fecha de vigencia confirmada ni cantidades equiparables: no presentarlos como precios oficiales actuales ni como coste por persona.
- Fuente del establecimiento: https://churreriadonpepe.com/ (jeringos, churros, lazos y chocolate; sin tabla de precios contrastable). Enlace de referencia externa: https://es.restaurantguru.com/Cafeteria-Don-Pepe-Cordoba-Andalusia/menu ; sus fotos aportadas por usuarios **no se han validado como origen exacto de los 18 importes**. No reutilizar esas fotos.
- Las descripciones de las entradas y títulos de las secciones disponen de versión ES/EN. Los platos sin precio permanecen sin importe. Conservamos sin interpretar el marcador «S/T»; el menú del día es variable y no tiene precio establecido. No mezclar información con Don Pepe de Diego de León, 6.
- **QA pendiente:** comprobar representación de las 18 secciones, traducciones de cada entrada, visualización de precios sin formato conocido, fuentes y ausencia de duplicados o cruces con Don Pepe Centro. El cierre requiere comprobación de Helio.

### Cierre de revisión — Don Pepe (24/10/2026)

- **Cafetería Bar Don Pepe · Ciudad Jardín (Antonio Maura, 35) — REVISADA Y CERRADA.** Helio valida visualmente la ficha incorporada, sus secciones y traducciones ES/EN. Los 18 precios transcritos desde la búsqueda de Google conservan la advertencia de vigencia no confirmada; la web del establecimiento documenta especialidades sin precios. No repetir revisión ordinaria salvo cambios o incidencias.
- **Cafetería Don Pepe · Centro (Diego de León, 6) — REVISIÓN CERRADA POR HELIO, CON DATOS PENDIENTES.** Helio solicita cerrar ambos establecimientos. La transcripción de precios compartida para este local aún no está incorporada a `data/places.json`; por ello NO afirmar que su carta esté completa ni que sus precios estén publicados en la app. Mantener ese pendiente explícito y no mezclar cartas entre sedes. Reabrir únicamente esa tarea documental cuando se decida incorporar los datos.


### Actualización de Don Pepe · Diego de León (24/10/2026)

- Se ha incorporado la carta de desayunos transcrita por Helio a partir de la búsqueda de Google: **9 apartados, 43 entradas y 36 precios**. Incluye cafés, bocadillos, tostadas por media y entera, chocolate, infusiones, zumos, extras y artículos sin precio. Se han omitido duplicados del resumen «At a Glance»; los grupos con igual precio se desglosan sin modificar importes.
- Datos ES/EN en cada entrada. Precios publicados sin fecha de vigencia verificable; no presentar como carta oficial actual ni como coste completo de desayuno. El vínculo a la búsqueda de Maps es orientativo, no prueba del origen exacto de la carta. **No mezclar** con Don Pepe Antonio Maura.
- **Estado:** incorporación documental completa según la transcripción, pero **QA visual pendiente** en ES/EN. Actualiza la nota anterior que señalaba precios aún no incorporados; no supone un PASS visual.

### Cierre definitivo de ambos Don Pepe (24/10/2026)

- **Cafetería Don Pepe · Centro (Diego de León, 6) — REVISADA Y CERRADA / QA visual PASS confirmado por Helio.** La carta de desayunos y precios incorporada (9 apartados, 43 entradas, 36 importes) fue comprobada en ES/EN. Queda sin efecto el anterior pendiente de incorporación de precios. La vigencia de los importes obtenidos de la búsqueda de Google sigue sin acreditación independiente; no presentarlos como precios oficiales actuales.
- **Cafetería Bar Don Pepe · Ciudad Jardín (Antonio Maura, 35) — REVISADA Y CERRADA / QA visual PASS confirmado por Helio.** Se ratifica el cierre anterior tras revisión de la carta con 18 importes registrados. Mantener la distinción entre web del establecimiento y carta externa con vigencia no verificada.
- **Control de pendientes:** excluir ambos locales de nuevas revisiones ordinarias, salvo evidencia de cambios, incidencias o petición expresa. Conservar sus fichas y datos por separado.

### Excepción de revisión — El Caballo Rojo (24/10/2026)

- Helio confirma que el restaurante está cerrado temporalmente y que su ficha ya se había ocultado. No programar revisión ordinaria mientras continúe esta situación; conservar datos históricos y comprobar una eventual reapertura antes de reactivar la ficha. Este apunte refleja el estado comunicado por Helio, no una comprobación externa nueva. No modificar la visibilidad en código sin revisar el estado implementado.

### Ajuste documental — Taberna La Viuda (26/10/2026)

- Contrastada la ficha `taberna-la-viuda` con la carta PDF de dos páginas facilitada por Helio. Los cinco apartados principales y sus precios ya estaban incorporados; no se reescribieron.
- Los tres acompañamientos de los huevos estrellados (4,50 €, 4,50 € y 6,00 €) pasan a identificarse como `suplemento` en `menus` y `menuSections`, no como raciones independientes.
- Los cuatro conceptos registrados en `extras` (pan y palillos, aceitunas, pan extra y envase desechable) se muestran también en una sección visible de la ficha, con texto ES/EN. La cerveza casera (3,80 €) continúa consignada en la nota documental y excluida del comparador de comida.
- Se mantiene `priceStatus: historical_menu_2025_unverified_current` y `checkedAt` sin adelantar fechas ni afirmar vigencia actual. El PDF contiene referencias temporales no concluyentes.
- **Verificación técnica:** JSON leído tras commit; 43 registros conservados; los tres suplementos y los cuatro extras comprobados en los datos. **QA visual ES/EN: PASS confirmado por Helio el 26/10/2026. Taberna La Viuda — REVISADA Y CERRADA.** Excluir de próximas revisiones ordinarias salvo incidencia, cambio documental o petición expresa. Este cierre no acredita la vigencia actual de los precios históricos ni sustituye pruebas de regresión posteriores.

### Revisión documental — Taberna El Poema · Alonso de Burgos (26/10/2026)

- Comparada la ficha con la transcripción de búsqueda de Google aportada por Helio y las referencias Just Eat / Uber Eats. Se mantuvieron los precios de reparto ya registrados y se añadieron **27 precios alimentarios de Google**, etiquetados por origen, sin asumir vigencia, formato ni equivalencia con los precios en sala.
- **Corrección de alcance:** se retiraron las 31 entradas de bebidas que se habían añadido por error. Conforme a la decisión editorial de Helio, **las bebidas quedan fuera de la aplicación**, también de las fichas, no solo del comparador.
- Quedan documentadas las divergencias entre fuentes. Los tamaños indicados en el listado de Google no permiten asignar un importe concreto a cada formato. No modificar la ficha distinta de Gran Capitán, 29, ni atribuir a esta última los precios de Alonso de Burgos.
- **QA de datos ejecutado:** JSON válido tras corrección, 43 restaurantes conservados, 11 secciones de comida en esta ficha y 27 precios alimentarios de Google añadidos. **QA visual ES/EN aún pendiente; NO marcar como PASS o cierre editorial hasta la comprobación de Helio.**

### Contraste documental — El Poema · Gran Capitán (26/10/2026)

- Contrastado el listado de carta procedente de la consulta de Google Maps facilitado por Helio con `taberna-el-poema-gran-capitan`: las cuatro secciones coinciden (**25 tapas calientes, 12 tapas frías, 9 entradas de menú del día y 10 entrantes; 56 apariciones, 55 nombres diferentes** por repetirse «Ensaladilla rusa»).
- Las entradas de «At a Glance» son resúmenes duplicados y no se incorporan como nuevos platos. Se conservan las denominaciones abreviadas «Pollo Salsa» y «Pechuga Empan» sin completar ingredientes por inferencia.
- **Sin modificación de platos ni importes**: los precios siguen desconocidos (`dishPrices: []`), no existe comprobación de vigencia ni carta oficial contrastada. Se conserva la separación estricta respecto a Alonso de Burgos. La URL registrada de Restaurant Guru es referencia del establecimiento, no acreditación de que sea el origen del menú remitido por Helio.
- **Resultado del contraste de datos: PASS** respecto al listado facilitado. **QA visual ES/EN y cierre editorial: pendientes de confirmación de Helio**; no confundir la cobertura de la transcripción con verificación externa de disponibilidad actual.

### Cierre de revisión — las dos Tabernas El Poema (26/10/2026)

- **Taberna El Poema · Alonso de Burgos, 2 — REVISADA Y CERRADA / QA visual ES/EN PASS confirmado por Helio.** Se completó el contraste de sus secciones gastronómicas con el material facilitado, se conservaron diferenciados los precios de Just Eat y los del listado de Google (formato y vigencia no confirmados), y se corrigieron las etiquetas en inglés de fuentes y precios. Las bebidas fueron retiradas conforme al alcance del proyecto. No interpretar el cierre como verificación de precios vigentes en sala.
- **Taberna El Poema · Gran Capitán, 29 — REVISADA Y CERRADA / QA visual ES/EN confirmado por Helio.** Los 56 registros de cuatro secciones del listado facilitado están cubiertos en la ficha; no hay precios verificados. La etiqueta inglesa de la fuente fue corregida. Esta carta no se mezcla con Alonso de Burgos y su vigencia continúa sin comprobación externa.
- **Control de pendientes:** no proponer ninguna de las dos sedes en futuras revisiones ordinarias. Reabrir solo por cambio documental, incidencia concreta o solicitud expresa. Las pruebas de regresión generales de la aplicación siguen formando parte de la fase QA posterior.

### Cierre de revisión — La Taberna del Río (26/10/2026)

- **La Taberna del Río — REVISADA Y CERRADA / QA visual ES/EN PASS confirmado por Helio.** Tras comprobar la ficha en inglés, se incorporaron las traducciones `labelEn` de sus dos fuentes (carta general bilingüe y menús para grupos de 2026), sin modificar platos, precios, enlaces ni condiciones de los menús.
- **Control editorial:** excluir de próximas revisiones ordinarias salvo cambios documentados, incidencia específica o solicitud expresa. El cierre visual no implica verificación independiente de vigencia de todos los precios ni sustituye las futuras pruebas de regresión generales.

### Cierre de revisión — Restaurante Puerta Sevilla (26/10/2026)

- **Restaurante Puerta Sevilla — REVISADO Y CERRADO / QA visual ES/EN PASS confirmado por Helio.** Se corrigió `labelEn` de la fuente «Carta digital oficial en inglés (versión independiente; puede diferir de la española)» y Helio confirmó la visualización correcta. Se conservaron el texto español, los enlaces, platos y precios sin cambios.
- Excluir de futuras revisiones ordinarias salvo modificación documentada de la carta, incidencia o petición expresa. El cierre no equivale a certificar vigencia de precios ni reemplaza las pruebas de regresión posteriores.

### Cierre de revisión — La Posada del Caballo Andaluz (26/10/2026)

- **La Posada del Caballo Andaluz — REVISADA Y CERRADA / validación visual confirmada por Helio el 26/10/2026.** Helio indica que la ficha está correcta. No se han modificado platos, precios, textos ni enlaces por este cierre.
- Excluir de próximas revisiones ordinarias salvo nueva evidencia documental, incidencia específica o petición expresa. Esta aprobación visual no supone una verificación independiente de precios o disponibilidad actuales ni sustituye la QA integral posterior.

### Cierre de revisión — Taberna La Montillana (26/10/2026)

- **Taberna La Montillana — REVISADA Y CERRADA / QA visual ES/EN PASS confirmado por Helio.** Se añadió `labelEn` a la fuente de la carta oficial («Official menu — restaurant website») y Helio comprobó la traducción en la aplicación. No se modificaron platos, importes, formatos ni enlaces.
- Excluir de revisiones ordinarias futuras salvo incidencia, nueva evidencia documental, actualización de carta o petición expresa. El cierre de revisión visual no certifica la vigencia actual de todos los precios ni sustituye la auditoría integral posterior.

### Cierre de revisión — Taberna Salinas (26/10/2026)

- **Taberna Salinas — REVISADA Y CERRADA (26/10/2026), confirmado por Helio.** Helio valida que la ficha está completa y solicita cerrar la revisión ordinaria. No se han modificado platos, precios, traducciones ni fuentes por este registro de cierre.
- No volver a incluirla entre restaurantes pendientes salvo incidencia, cambio documental o solicitud expresa. El cierre editorial no equivale a certificar disponibilidad ni precios actuales y no sustituye las pruebas de regresión generales.

### Cierre de revisión — Bodegas Mezquita Céspedes (26/10/2026)

- **Bodegas Mezquita Céspedes — REVISADA Y CERRADA / QA visual ES/EN PASS confirmado por Helio.** Corregidas en `app.js` las etiquetas de formatos y cantidades que permanecían en español en la interfaz inglesa (medias y raciones por gramos, unidades, con/sin aceite, degustación, botella y precio único). Helio confirmó visualmente que la ficha queda correcta el 26/10/2026.
- Los cambios fueron de presentación/traducción; no se alteraron platos, ingredientes, cantidades originales ni precios. Excluir este establecimiento de futuras revisiones ordinarias salvo nueva incidencia, cambio acreditado de carta o petición expresa. El cierre no sustituye la futura auditoría integral y pruebas de regresión.

### Cierre de revisión — Taberna Rafaé (26/10/2026)

- **Taberna Rafaé — REVISADA Y CERRADA (26/10/2026), validación confirmada por Helio.** Helio indica que la ficha está correcta y solicita dar por terminada su revisión ordinaria. No se modificaron platos, precios, fuentes ni traducciones por este cierre.
- Excluir de revisiones ordinarias posteriores salvo incidencia concreta, cambio documental o nueva solicitud. Este cierre editorial no constituye verificación independiente de vigencia de precios y no sustituye las pruebas generales de regresión.

### Cierre de revisión — Taberna La Manuela (26/10/2026)

- **Taberna La Manuela — REVISADA Y CERRADA (26/10/2026), validación confirmada por Helio.** Helio confirma que la ficha está correcta y da por finalizada su revisión ordinaria. No se modificaron platos, precios, traducciones ni fuentes por registrar este cierre.
- Excluir de futuras revisiones ordinarias salvo incidencia, nueva documentación o solicitud expresa. El cierre editorial no certifica por sí solo la vigencia actual de los precios ni sustituye las pruebas de regresión generales.

### Cierre de revisión — Taberna Góngora (26/10/2026)

- **Taberna Góngora — REVISADA Y CERRADA (26/10/2026), validación confirmada por Helio.** Helio confirma que la ficha está correcta y solicita cerrar su revisión ordinaria. No se modificaron platos, precios, traducciones ni fuentes por registrar este cierre.
- Excluir de futuras revisiones ordinarias salvo incidencia concreta, nueva documentación o solicitud expresa. El cierre editorial no supone verificación independiente de vigencia de precios y no sustituye las pruebas generales de regresión.

### Cierre de revisión — Taberna San Miguel · El Pisto (26/10/2026)

- **Taberna San Miguel · El Pisto — REVISADA Y CERRADA (26/10/2026), validación confirmada por Helio.** La ficha ha sido aprobada para cerrar su revisión ordinaria. No se han modificado datos gastronómicos, precios, traducciones ni fuentes por registrar este cierre.
- Excluir de próximas revisiones ordinarias salvo nueva documentación, incidencia concreta o petición expresa. Este cierre editorial no implica verificación independiente de vigencia de precios ni sustituye la auditoría general y pruebas de regresión pendientes.

### Cierre de revisión — Taberna Sociedad de Plateros · San Francisco (26/10/2026)

- **Taberna Sociedad de Plateros · San Francisco — REVISADA Y CERRADA (26/10/2026), validación confirmada por Helio.** Helio confirma que la ficha está lista y solicita cerrar su revisión ordinaria. No se han modificado platos, precios, fuentes ni traducciones por este cierre.
- Excluir de futuras revisiones ordinarias salvo incidencia, nueva fuente o solicitud expresa. El cierre editorial no acredita vigencia actual de precios ni sustituye las pruebas generales de regresión.

### Cierre de revisión — Sociedad Plateros · María Auxiliadora (26/10/2026)

- **Sociedad Plateros · María Auxiliadora — REVISADA Y CERRADA (26/10/2026), validación editorial confirmada por Helio.** Helio confirma que la ficha puede darse por cerrada tras su revisión. Excluir de próximas revisiones ordinarias salvo incidencia, nueva documentación o solicitud expresa.
- El cierre no implica una nueva verificación independiente de precios o disponibilidad ni certifica pruebas técnicas o de regresión no ejecutadas. **Siguiente ficha a revisar: Taberna El Nº 10 (Romero, 10), pendiente de comprobación de Helio; no cerrada.**

### Cierre de revisión — Taberna El Nº 10 (26/10/2026)

- **Taberna El Nº 10 (Romero, 10) — REVISADA Y CERRADA / QA visual ES/EN confirmado por Helio el 26/10/2026.** Se añadieron las traducciones inglesas `labelEn` de las tres fuentes de la ficha (cocina y especialidades, carta PDF y contacto). Helio revisó la aplicación tras el cambio y confirmó que se visualiza correctamente.
- No se alteraron platos, precios, formatos ni enlaces. El JSON se validó tras el cambio con 43 establecimientos conservados. La carta PDF incluye una referencia a septiembre de 2025 en su URL, sin que ello acredite vigencia actual.
- **Control de pendientes:** excluir la taberna de nuevas revisiones ordinarias salvo incidencia, actualización documental o petición expresa. El cierre no sustituye la auditoría integral ni las futuras pruebas de regresión.

### Cierre de revisión — La Cazuela de la Espartería (26/10/2026)

- **La Cazuela de la Espartería — REVISADA Y CERRADA / QA visual ES/EN PASS confirmado por Helio el 26/10/2026.** Tras revisar la ficha, se incorporaron descripciones para 89 platos, títulos bilingües de sus nueve secciones, traducciones de los platos de cuatro menús navideños, traducciones de tres etiquetas de fuentes y títulos ingleses de los menús de grupo. Helio confirma que la visualización resultante es correcta.
- **Alcance del cambio:** no se modificaron importes, formatos ni enlaces. Las descripciones no incorporan ingredientes no documentados. Los precios y la vigencia de los menús siguen sujetos a las reservas documentales ya indicadas en la ficha.
- **Control de pendientes:** excluir de revisiones ordinarias futuras salvo incidencia, nueva documentación o petición expresa. La aprobación visual no sustituye la auditoría integral ni las pruebas de regresión posteriores.

### Cierre de revisión — Restaurante El Churrasco (26/10/2026)

- **Restaurante El Churrasco — REVISADO Y CERRADO / QA visual ES/EN PASS confirmado por Helio el 26/10/2026.** La única corrección detectada fue traducir la etiqueta de la tercera fuente («Carta QR del restaurante, sin fecha (PDF aportado por el usuario)») al inglés como «Restaurant QR menu, undated (PDF provided by the user)». Helio comprobó el cambio y confirmó que la ficha está correcta.
- No se modificaron platos, precios, formatos ni enlaces. Se mantuvo el aviso de que la carta QR aportada no tiene fecha acreditada; el cierre visual no certifica vigencia de precios.
- **Control de pendientes:** excluir El Churrasco de revisiones ordinarias futuras salvo nueva documentación, incidencia o petición expresa. No sustituye la auditoría integral ni las pruebas de regresión generales.

### Cierre de revisión — La Piscatoria (26/10/2026)

- **La Piscatoria — REVISADA Y CERRADA (26/10/2026), confirmación editorial de Helio.** Helio indica que la ficha puede darse por cerrada. No se modificaron platos, precios, formatos, traducciones ni fuentes por registrar este cierre.
- **Control de pendientes:** excluir La Piscatoria de revisiones ordinarias futuras salvo nueva documentación, incidencia o solicitud expresa. No se atribuye un QA técnico nuevo ni una verificación independiente de vigencia de precios; las pruebas generales de regresión siguen pendientes para la fase de auditoría.

### Cierre de revisión — D'Tapas COVAP Córdoba (26/10/2026)

- **D'Tapas COVAP Córdoba — REVISADA Y CERRADA / QA visual ES/EN confirmado por Helio el 26/10/2026.** Se incorporó la traducción `labelEn` de la fuente «Carta oficial D'Tapas COVAP Córdoba completa» como «Complete official D'Tapas COVAP Córdoba menu». Helio comprobó el cambio y confirmó que la ficha está correcta.
- No se modificaron platos, importes, formatos ni enlaces; el JSON siguió siendo válido con 43 establecimientos. Este cierre editorial no equivale a una nueva comprobación independiente de vigencia de precios.
- **Control de pendientes:** excluir D'Tapas COVAP Córdoba de revisiones ordinarias futuras salvo incidencia, actualización documental o petición expresa. Las pruebas generales de regresión siguen pendientes de la fase de auditoría.

### Cierre de revisión — Cafetería Bar La Jineta (26/10/2026)

- **Cafetería Bar La Jineta — REVISADA Y CERRADA / QA visual ES/EN confirmado por Helio el 26/10/2026.** Se contrastó la carta facilitada por Helio desde QueResto con los datos existentes: ya constaban 16 variantes de tostadas (media/entera, con/sin café) y café. Se añadieron 17 opciones de perritos, bocadillos, tostas y cazuelitas con los importes publicados, sin duplicar los desayunos.
- **Incidencias corregidas:** se incorporaron descripciones bilingües a las 17 opciones nuevas y se restauró la visualización de tostadas y café después de detectar una regresión al crear las secciones de comida. Se tradujeron las cuatro etiquetas de media/entera con/sin café. Helio confirmó finalmente la visualización correcta. Las bebidas ajenas al desayuno quedan fuera del alcance editorial.
- Los precios proceden de la carta consultada, pero no se ha certificado su vigencia actual ni los horarios de servicio. **Control de pendientes:** excluir La Jineta de revisiones ordinarias salvo incidencia, nueva fuente o solicitud expresa. Este cierre no sustituye las pruebas generales de regresión de la fase QA.

### Cierre de revisión — Pastelerías Roldán (26/10/2026)

- **Pastelerías Roldán — REVISADO Y CERRADO / QA visual ES/EN PASS confirmado por Helio el 26/10/2026.** Roldán Centro conserva su ficha y carta específica; se incorpora una ficha genérica para las otras cafeterías con precios documentados de desayunos y un directorio de 13 cafeterías y tres panaderías. No se atribuye la carta de cafeterías a las panaderías.
- **Incidencia resuelta:** traducción completa al inglés de ubicación genérica, encabezado y tipos de establecimiento, avisos de carta y precios. Helio ha confirmado que ahora se visualiza correctamente. Excluir ambas fichas de la revisión ordinaria salvo actualización documental, incidencia o petición expresa.
- Los cierres no certifican vigencia actual de precios ni sustituyen la futura regresión general.

### Cierre de revisión — La Tarterie (26/10/2026)

- **La Tarterie — REVISADA Y CERRADA (26/10/2026), según confirmación de Helio.** Se conserva el aviso general bilingüe al inicio de la carta sobre precios por producto completo y variaciones por tamaño u opciones. Se elimina la repetición del enlace «Ver precio exacto en tienda oficial / Check exact price at official shop» dentro de cada producto; el acceso a la tienda oficial sigue disponible en las fuentes de la ficha.
- No se modifican precios, ingredientes, tamaños ni fichas de producto. Pendiente comprobar visualmente este último ajuste ES/EN; el cierre editorial previo no equivale a aprobar todavía esta regresión. No incluir en revisiones ordinarias futuras salvo incidencia, cambio documentado o petición expresa.

### Cierre de revisión — La Bandera (26/10/2026)

- **La Bandera — REVISADA Y CERRADA (26/10/2026), confirmación visual de Helio.** Helio indica que la ficha está correcta y solicita finalizar su revisión ordinaria. No se han modificado precios, platos, traducciones ni fuentes con este cierre.
- Excluir de próximas revisiones ordinarias salvo incidencia, nueva fuente, cambio documental o petición expresa. Esta conformidad visual no constituye una comprobación independiente de vigencia de precios ni sustituye la regresión integral de Helio Gastro.

### Cierre de revisión — Cafetería Bar Don Pepe · Ciudad Jardín (26/10/2026)

- **Cafetería Bar Don Pepe · Ciudad Jardín — REVISADA Y CERRADA / QA visual confirmado por Helio (26/10/2026).** Se corrigió el aviso de horarios en inglés y se retiraron las once bebidas de la sección «Bebidas y extras», conservando únicamente «Extras» (pieza de pan, táper para llevar y bolsa). Se eliminaron también esas bebidas del catálogo de búsqueda de esta ficha.
- Helio confirmó que los últimos cambios se visualizan correctamente. No se modificó el resto de la carta ni sus precios. Excluir este establecimiento de revisiones ordinarias salvo incidencia, actualización documental o petición expresa. **Cafetería Don Pepe · Centro permanece pendiente de revisión y cierre por separado.**

### Cierre de revisión — Cafetería Don Pepe · Centro (26/10/2026)

- **Cafetería Don Pepe · Centro — REVISADA Y CERRADA (26/10/2026), por confirmación de Helio.** Se da por concluida su revisión ordinaria y se conserva la carta y ficha existentes. El aviso de horarios cuenta con traducción ES/EN.
- No se modifican platos, precios ni fuentes al registrar este cierre. Excluir de próximas revisiones ordinarias salvo incidencia, cambio documentado o petición expresa. El cierre no implica nueva verificación independiente de horarios o vigencia de precios ni sustituye la posterior regresión general.

### Próximas revisiones al retomar — 26/10/2026

- **Trabajo pausado por decisión de Helio el 26/10/2026.** No continuar revisiones ni implementar cambios hasta que Helio lo indique.
- **Próximas fichas propuestas para revisar, aún NO cerradas:** Restaurante El Caballo Rojo, Patio Romano y Taberna El Burlaero. El orden puede decidirse al retomar.
- Las dos fichas de Don Pepe, La Bandera, La Tarterie y Pastelerías Roldán ya están registradas como cerradas; no reabrirlas sin incidencia o petición expresa.



### Cierre de revisión — Patio Romano (27/10/2026)

- **Patio Romano — REVISADO Y CERRADO / validación visual ES/EN confirmada por Helio el 27/10/2026.** Se conservaron los 38 registros con precio de la carta general y se incorporó la carta de desayunos facilitada por Helio (60 entradas de precio, incluidos suplementos), respetando medias tostadas, tostadas enteras y desayunos completos como formatos distintos.
- Se añadieron explicaciones inglesas específicas para los 38 platos de la carta general y se corrigió la traducción de la primera etiqueta de fuente. Se incorporaron cuatro menús especiales de la web oficial: **Moschea di Cordova (38 €), Giudecca di Cordova (48 €), Cordobés (48 €) e Italiano (48 €)**, diferenciados de los precios de platos individuales y con sus condiciones documentadas.
- **Verificación técnica:** lectura posterior del JSON válida; 44 establecimientos conservados, carta general con 38 precios, desayunos con 60 entradas y cuatro menús especiales. **QA visual:** Helio confirmó la correcta presentación tras revisar platos y menús; cierre editorial autorizado. No se certifica vigencia actual de todos los precios, apertura ni disponibilidad; la auditoría integral y pruebas generales de regresión quedan pendientes.
- **Control de pendientes:** excluir Patio Romano de futuras revisiones ordinarias salvo incidencia, documentación nueva o solicitud expresa. **Próxima ficha propuesta: Taberna El Burlaero.**

### Cierre de revisión — Taberna El Burlaero (27/10/2026)

- **Taberna El Burlaero — REVISADA Y CERRADA / QA visual ES/EN confirmado por Helio el 27/10/2026.** Se cotejó el PDF aportado (11 páginas) con la ficha existente: 44 platos principales registrados y 66 entradas con precio en carta general, además del menú del día de 16,50 € con suplementos de flamenquín (2,50 €) y rabo de toro (4 €).
- Se corrigieron etiquetas de fuente en inglés y se añadieron explicaciones inglesas para platos que carecían de ellas. Los importes presentados como «precio 1/2; tamaño sin precisar» no se asignan artificialmente a tapa, media ni ración: el documento ofrece las variantes numéricas pero no identifica inequívocamente su formato para esos platos. Los formatos expresamente indicados se conservan. Las bebidas independientes permanecen fuera del catálogo.
- **Validación:** actualización del código y datos en GitHub; Helio ha confirmado visualmente que las correcciones se muestran correctamente. Este cierre editorial no acredita vigencia actual de precios ni sustituye la auditoría integral y la regresión posterior. Excluir de revisiones ordinarias salvo incidencia, nueva documentación o solicitud expresa.
- **Siguiente decisión:** revisar los establecimientos restantes sin cierre, manteniendo El Caballo Rojo como caso especial por el cierre temporal comunicado y sin marcarlo como operativo hasta contrastar la reapertura.

### Propuestas de revisión externa (Paca / Gemini) — 27/10/2026

**Estado: backlog propuesto, no implementado.** Mantener el orden de fases y el principio del Método Helio: **«En lo simple está la estabilidad»**. Estas ideas proceden de una revisión de capturas de pantalla, **no de una auditoría del código o de los datos**.

1. **Indicador visible de última verificación de carta (prioridad alta, fase 1 y auditoría):** mostrar en cada ficha la fecha real de la última comprobación documental de la carta, cuando exista. Diferenciar la fecha de revisión de la fecha de publicación del menú y de la última modificación del registro. Aprovechar `checkedAt` si los datos existentes lo permiten; no rellenar fechas supuestas ni presentar información antigua como actual. Revisar su coherencia en la auditoría final.
2. **Control de cambios antes de producción (prioridad alta, transversal):** desarrollar cambios en ramas, revisar diferencias y, cuando sea práctico, utilizar pull requests antes de fusionar a la rama publicada. Ejecutar regresión sobre búsqueda, filtros, favoritos, comparador, mapas y traducciones. No publicar modificaciones parciales de cartas sin aprobación de Helio.
3. **Casos límite y pruebas de estrés (fase 3):** ampliar el plan QA con búsquedas sin resultados, formatos/precios ausentes, platos duplicados, textos largos en ES/EN/FR, fallos de enlaces y mapas, persistencia local, navegación móvil y volúmenes grandes de datos. Medir rendimiento real; no confundir pruebas funcionales con pruebas de carga.
4. **Claridad y simplicidad (criterio transversal):** mantener navegación por Desayunar, Comer, Merendar y Cenar, precios por formato, acceso a fuentes y comparador sin añadir complejidad innecesaria. Revisar textos y densidad visual al cerrar las cartas.
5. **Mapa de terrazas con sombra (idea futura, sin compromiso):** valorar utilidad y viabilidad solo tras completar el alcance actual. Requeriría información fiable y actualizable sobre terrazas y sombra según horario/estación; no inferir disponibilidad.

**Plan de cierre ya acordado:** completar cartas y fuentes → francés ES/EN/FR → auditoría automatizada y manual enfocada en excepciones → reseñas y resúmenes con moderación → imágenes con derechos adecuados → pulido final con Work. Para evitar revisar fichas una a una, estudiar validadores automáticos de claves y traducciones ausentes, formatos/precios incoherentes, duplicados y enlaces; reservar revisión humana para errores semánticos y comprobación documental.

### Identidad visual ManoloLabs by Helio — pendiente

- **Pendiente de implementar en la página principal de Helio Gastro:** incorporar la marca **ManoloLabs by Helio** y su mascota/logotipo oficial (robot Manolo con gafas, bigote, antena y café), siguiendo la referencia visual aprobada por Helio.
- Lema de marca: **«Ideas humanas · Tecnología inteligente»**. Respetar la identidad actual de Helio Gastro y colocar el sello de ManoloLabs de forma discreta, sin recargar la portada ni sustituir el nombre de la aplicación.
- **Estado:** anotado en el backlog; no implementado todavía. Abordar tras completar los restaurantes, cartas y traducciones al inglés, en la fase de pulido de la aplicación.

### Casa Pepe de la Judería — carta cerrada (27/10/2026)

- **Estado: cerrada por validación expresa de Helio.** Se cotejaron las cartas de restaurante y barra y los postres con el PDF aportado `Casa_Pepe-carta_web-20260515.pdf` (fecha indicada en el nombre del archivo, no confirmación de vigencia actual).
- Cobertura registrada: 26 platos de restaurante, 17 de barra, 7 postres y 4 vinos de postre. Se preservan precios distintos entre restaurante y barra y los formatos declarados, sin inventar tamaños.
- Se incorporaron los cuatro vinos en una sección «Vinos de postre» y se corrigieron etiquetas en inglés de unidades, pesos y medias raciones, así como la nota y encabezado de vinos.
- **QA:** Helio confirmó visualmente la corrección final y autorizó cerrar la ficha. La auditoría integral ES/EN/FR y regresión global siguen en sus fases previstas.

### Taberna Museo Manolete — revisión cerrada (27/10/2026)

- **REVISADA Y CERRADA / QA visual ES/EN confirmado por Helio.** Se revisaron etiquetas de formato con gramajes, medias/raciones y precios únicos, y se añadió la etiqueta inglesa de la fuente del grupo Ágora. Helio confirmó la correcta visualización tras los cambios.
- Se mantienen los seis apartados y los precios registrados sin alteración. No incluir en nuevas revisiones ordinarias salvo incidencia, fuente nueva o solicitud expresa. La validación visual no sustituye la auditoría integral ni garantiza vigencia actual de los precios.

### Corrección de fuente — Taberna Museo Manolete (27/10/2026)

- La fuente de su ficha enlazaba por error a Casa Bravo, otro local del grupo Ágora. Sustituida por la carta del propio establecimiento: https://www.tabernaagoramuseomanolete.com/#carta (etiquetas ES/EN).
- Comprobación puntual con la web: coinciden ejemplos de jamón ibérico de cebo, flamenquín cordobés y postres. Se conservan los 54 platos, 74 variantes y precios sin modificaciones. La revisión exhaustiva de vigencia sigue pendiente, sin reabrir la revisión editorial ya validada por Helio.

### Cierre editorial — Ágora Mezquita (27/10/2026)

- **REVISADA Y CERRADA**, con aprobación expresa de Helio y comprobación visual ES/EN del 27/10/2026.
- Carta: 56 platos en 9 secciones y 76 entradas de precio. Se añadió el coulant de chocolate (6,50 €), se corrigió el nombre de «Patatas fritas» y se evitó duplicar el cochifrito.
- Se retiraron del potaje flamenco los ingredientes atribuidos desde Casa Bravo sin confirmación para este local. También se tradujeron al inglés las etiquetas de las dos fuentes.
- Dirección corregida a partir de la información oficial aportada: Calle Céspedes, 11 y Calle Velázquez Bosco, 10/12 (Calleja de las Flores), 14003 Córdoba, sin afirmar que sean accesos distintos.
- Excluir de revisiones ordinarias salvo incidencia, nueva documentación o petición de Helio. La auditoría integral y la comprobación de vigencia de precios permanecen pendientes.


### Cierre de revisión — Con Acento Brasería (27/10/2026)

- **Con Acento Brasería — REVISADA Y CERRADA / aprobación visual confirmada por Helio el 27/10/2026.** Se cotejaron las cartas PDF de parrilla y tapas proporcionadas por Helio con la ficha registrada.
- La ficha conserva **43 platos/opciones y 45 entradas de precio**, distribuidos en nueve secciones, con descripciones en español e inglés; se añadió la dirección **Avenida Al-Nasir, 13 (Vial Norte), Córdoba** y la traducción inglesa de la etiqueta de fuente.
- Se respetaron los formatos de media/ración y los importes por 100 g de carnes al corte; los vinos quedaron fuera del catálogo conforme al criterio editorial. No se alteraron los importes ni se afirmó una nueva comprobación de vigencia de precios.
- **Control de pendientes:** excluir de próximas revisiones ordinarias salvo incidencia, carta nueva o petición expresa. **Taberna La Sal** queda como única ficha sin cierre editorial registrado; **El Caballo Rojo** permanece como excepción por cierre temporal comunicado. La auditoría integral y pruebas generales de regresión siguen pendientes.


### Cierre de revisión — Taberna La Sal (27/10/2026)

- **Taberna La Sal — REVISADA Y CERRADA / QA visual ES/EN confirmado por Helio el 27/10/2026.** Tras contrastar la transcripción de carta proporcionada, se incorporaron 60 platos/opciones en diez secciones y 78 entradas de precio, con explicaciones bilingües mostradas correctamente mediante los campos `es` y `en` utilizados por la aplicación.
- Se corrigieron las etiquetas de ración para evitar textos españoles en la interfaz inglesa, se registró la dirección de Avenida Llanos del Pretorio, 1, 14006 Córdoba, y se preservaron formatos y condiciones: arroces por persona (mínimo dos) y carne madurada a 7 €/100 g (precio final según peso).
- **Reserva documental:** el revuelto de aguacate con crujiente de jamón figura en la fuente con dos precios diferentes (13 € y 14 €), sin confirmación de cuál está vigente. Se conservan ambos valores con la discrepancia documentada, sin presentarlos como un precio único confirmado. La aprobación visual no acredita vigencia de todos los importes ni sustituye auditoría integral.
- **Control de pendientes:** Helio confirmó que la ficha ya se muestra correctamente y autoriza su cierre editorial. Con este cierre, **43 de 44 fichas quedan cerradas editorialmente**; Restaurante El Caballo Rojo es la única excepción, apartada por cierre temporal comunicado y pendiente de verificación de reapertura. No quedan fichas ordinarias pendientes de revisión. Próxima fase prevista: traducción al francés, seguida de la auditoría integral y regresión ES/EN/FR.


### Estado de continuidad — Francés y QA (27/10/2026)

**Situación editorial y alcance.** Permanecen **43 de 44 fichas cerradas editorialmente**; **El Caballo Rojo** es la excepción por cierre temporal comunicado. No reabrir las 43 cartas ni corregir datos gastronómicos sin incidencia, documentación nueva o autorización expresa. La fase francesa y su QA se trabajan en la rama aislada `feature/fr-integration-qa-20261027`, **sin fusionar a `main`**. Esta sección deja constancia del avance técnico, no de una publicación del francés en producción.

**Inventario y auditorías sobre la rama:**
- `scripts/audit-data.mjs` y workflow `.github/workflows/data-qa.yml`: validación estructural sobre 44 establecimientos, con 0 errores y 0 avisos en la ejecución inicial. Inventario registrado: 195 registros de menús, 314 secciones, 2.693 elementos en secciones y 3.337 registros de precios. Estas pruebas no prueban vigencia externa de cartas o precios.
- Auditoría exploratoria: un **posible duplicado exacto** de registro de precio en Casa Pepe de la Judería (ensaladilla de atún, mayonesa de AOVE y gamba blanca); **no eliminar sin verificar formato y contexto**.
- Vocabulario francés candidato en `docs/french-glossary-v1.json`: **241 de 314 apariciones de encabezados** tienen propuesta exacta, **73 pendientes**. Son propuestas con revisión contextual pendiente, no traducciones desplegadas.
- Descripciones gastronómicas con campo `fr` ausente en el catálogo principal: **1.232** en la auditoría realizada. Otros documentos auxiliares pueden contener candidatos; no equiparar ausencia del campo a falta absoluta de material traducido. `scripts/build-french-plan.mjs` genera propuestas externas al catálogo, descargables como artefacto CI.
- Controles creados: `scripts/audit-exploratory.mjs`, `scripts/audit-french-coverage.mjs`, `scripts/audit-french-integrity.mjs`, `scripts/validate-french-batch.mjs` y `scripts/test-fr-overlay-integrity.mjs`. Los ceros de errores semánticos no pueden inferirse de validaciones únicamente estructurales o numéricas.

**Primer lote y revisión:**
- `translations/fr/batch-001-la-montillana.json`: **15 descripciones francesas candidatas**, procedentes de los campos ES/EN de **La Montillana**. Se cotejaron en revisión semántica de escritorio; sin ingredientes inventados u omisiones evidentes, conservando nombres como salmorejo, mazamorra, flamenquín y torreznos. Revisión lingüística nativa todavía pendiente.
- La prueba `scripts/test-fr-overlay-integrity.mjs` simula incorporar esos 15 campos sobre una copia de los datos y comprueba **0 modificaciones de campos protegidos**, exactamente 15 adiciones esperadas y 3 pruebas negativas. **No escribe `data/places.json`**.
- Documentación detallada: `docs/qa-fr-batch-001-2026-10-27.md`.

**Aplicación y navegador:**
- Se creó el piloto independiente `qa-fr-la-montillana.html`. Helio revisó personalmente sus capturas y confirmó una buena presentación.
- En `i18n.js` (solo rama QA), `?qa_fr=1` habilita temporalmente `Français (QA)`; sin este parámetro el selector sigue siendo ES/EN. Se corrigió una expresión regular errónea del `MutationObserver` detectada mediante Chromium.
- En `app.js` (solo rama QA) se carga el lote independiente **solo para La Montillana y solo con QA FR activo**; su ficha real muestra las 15 traducciones `fr` en dicho modo. La vista trilingüe general **no está terminada**: otras partes de la interfaz y establecimientos carecen aún de francés.
- `scripts/test-fr-visual.mjs` ejecuta Chromium en escritorio (1365×900) y perfil móvil (390×664), comprueba 15 tarjetas del piloto, ES/EN/FR, errores de consola y desbordamiento; además verifica selector de la aplicación principal ES/EN por defecto, activación QA, ida/vuelta FR→EN→ES y explicaciones de La Montillana.
- **Última ejecución verificada PASS (ambos jobs: catalog-audit y visual-qa):** https://github.com/Helioven/helio-gastro/actions/runs/40483426697 . En la ficha real de La Montillana se observaron **30 explicaciones ES, 30 EN y 15 FR**, sin errores JavaScript registrados; el número 30 en ES/EN incluye descripciones fuera del primer lote. Informes anteriores: `docs/qa-fr-visual-pilot-2026-10-27.md`; ejecución visual piloto: https://github.com/Helioven/helio-gastro/actions/runs/40480100402 .
- Las ejecuciones fallidas intermedias se debieron a incompatibilidad de Playwright con el runner Ubuntu 26.04 (resuelta usando imagen oficial `mcr.microsoft.com/playwright:v1.56.1-noble`) y a defectos detectados/corregidos en scripts y `i18n.js`. No se consideran fallos abiertos tras el PASS final.

**Próximo paso acordado:** **paso 3: regresión de la aplicación principal**, comprobando **buscador, filtros, comparador, fichas y navegación** con y sin `?qa_fr=1`, en escritorio y móvil, comprobando conservación de ES/EN y de precios/formatos. Documentar cada prueba como propuesta/ejecutada/superada/fallida, corregir solo errores confirmados y repetir QA. No desplegar francés público ni ampliar traducciones masivas antes de superar esta etapa. Posteriormente, avanzar por lotes controlados hacia la cobertura francesa integral, siguiendo la hoja de ruta existente.


### Pausa de trabajo — regresión global inicial (27/10/2026)

**Estado: primera batería de regresión automatizada SUPERADA en GitHub Actions #55; sesión pausada por decisión de Helio.** Ejecución asociada al commit `18973b9`, rama `feature/fr-integration-qa-20261027`. Evidencia visual aportada por Helio: workflow general en verde. Esta aprobación cubre la batería automatizada actual; no equivale a finalizar la auditoría integral, las traducciones francesas ni el QA exploratorio completo.

**Baterías incorporadas al job `visual-qa`:**
- `scripts/test-fr-visual.mjs`: piloto francés, selector e integridad visual ES/EN/FR. PASS en la ejecución #51, confirmado por sus registros.
- `scripts/test-search-regression.mjs` — HG-QA-032: búsqueda manual por plato y nombre, coincidencias, persistencia y controles del selector en escritorio/móvil con y sin modo francés QA. Corregido el propio test por errores de contexto (`clean is not defined`) y normalización de «Moriles»; ejecución #55 en verde.
- `scripts/test-filter-regression.mjs` — HG-QA-033: presupuestos por plato/comida, precios desconocidos, filtros de formato y precios documentados. PASS observado en #51; se añadió un caso positivo documentado para evitar aprobar únicamente condiciones vacías. Incluido en #55.
- `scripts/test-comparator-regression.mjs` — HG-QA-034: máximo tres locales, rechazo del cuarto, persistencia tras F5, enlaces de ruta seguros y limpieza al cambiar de servicio. Falló inicialmente en los cuatro escenarios y pasó los cuatro tras corregir el defecto, según informe del artefacto aportado por Helio. Incluido en #55.
- `scripts/test-detail-regression.mjs` — HG-QA-035: ficha, dirección, fuente HTTPS segura, fecha, integridad de precios al cambiar idioma, condiciones de menú de grupo y cierre. PASS en los cuatro escenarios del informe #51 (La Montillana y La Taberna del Río); incluido en #55.

**Defecto funcional HG-BUG-001 — corregido y validado:** el comparador conservaba tres establecimientos al cambiar de Comer a Desayunar, contra los requisitos. Reproducción inicial: 4/4 combinaciones escritorio/móvil × público/`?qa_fr=1` con selección restante 3. Ajuste mínimo en `app.js`: vaciar `state.selected` solo al cambiar efectivamente de servicio, manteniendo la restauración normal tras F5. Commit `65f752c`. Regresión posterior: 4/4 PASS; selección recuperada tras F5 = 3, tras cambio de servicio = 0. Ningún cambio de cartas o precios.

**Control de calidad de los tests:** los fallos de `clean is not defined` y de la aserción Moriles se localizaron en el script de pruebas, no demostraron fallos de búsqueda en producción. Correcciones `47a2cb6` y `18973b9`. El test de filtros inicialmente ofrecía PASS con casos de presupuesto sin coincidencias; se reforzó con comprobación positiva real (`9c88e9a`). El workflow se modificó para ejecutar las cinco suites aunque alguna falle y preservar informes por separado (`e62194e`). No equiparar el PASS a cobertura exhaustiva de formatos, precios o los 44 establecimientos.

**Evidencia y límites de verificación:** Helio aportó capturas del workflow #51, registros JSON de las cinco suites y captura del workflow #55 en verde (commit `18973b9`). En #51, `catalog-audit` pasó, mientras `visual-qa` falló por HG-QA-032 y HG-QA-034; las demás suites pasaron. La captura de #55 acredita éxito general de la ejecución más reciente, pero los artefactos individuales de #55 no se han contrastado uno por uno en este cierre. Enlaces a ejecución: https://github.com/Helioven/helio-gastro/actions/workflows/data-qa.yml .

**Condiciones al retomar:**
1. Confirmar rama, commit y estado de CI; descargar y revisar los cinco JSON de #55 si se requiere evidencia granular de cierre.
2. Continuar fase 3 con exploratorias de navegación, favoritos, recomendaciones y mapas, accesibilidad, casos límite, coherencia semántica y revisión documental de excepciones; evitar duplicar pruebas ya cubiertas.
3. Mantener el francés solo en modo QA (`?qa_fr=1`) y avanzar en lotes controlados hacia ES/EN/FR completos antes de declarar cerrada la auditoría integral.
4. No fusionar la rama QA con `main`, no desplegar francés público, no reabrir las 43 cartas cerradas ni modificar datos sin nueva evidencia y autorización expresa. El Caballo Rojo continúa como excepción pendiente de verificar reapertura.
5. Repetir regresión tras cualquier corrección y registrar evidencia, severidad, resultado y cierre de cada incidencia.

**Decisión:** detener aquí la sesión de desarrollo/QA hasta que Helio solicite continuar. No se altera el orden acordado de las siete fases.


### Regresión FR — cierre técnico (28/10/2026)

- La ejecución [40645692892](https://github.com/Helioven/helio-gastro/actions/runs/40645692892) finalizó **SUCCESS** en la rama aislada `feature/fr-integration-qa-20261027`.
- Superados los jobs `catalog-audit` y `visual-qa`. El workflow incluye las pruebas de buscador (`HG-QA-032`), filtros (`HG-QA-033`), comparador (`HG-QA-034`), fichas (`HG-QA-035`) y navegación (`HG-QA-036`), en perfiles escritorio y móvil, tanto modo ES/EN público como `?qa_fr=1`.
- Incidencia corregida: «Limpiar búsqueda» conservaba selección de comparación y dejaba visible la navegación del comparador. La corrección restaura búsqueda limpia y elimina la selección persistida. El primer run [40645430430](https://github.com/Helioven/helio-gastro/actions/runs/40645430430) falló por este defecto; la repetición final fue satisfactoria.
- El piloto francés permanece **sin fusionar a `main`**. La validación técnica no equivale a revisión lingüística nativa ni a cobertura integral francesa.
- **Próximo paso:** traducir por lotes controlados a partir de descripciones ES/EN verificables; cada lote candidato debe revisarse semánticamente y validar integridad, números, formatos, pantallas y regresión antes de integrarse. No completar ingredientes desconocidos ni aplicar automáticamente traducciones.


### Relevo de sesión — avance francés QA al 28/10/2026 (actualización operativa)

**Rama de trabajo:** `feature/fr-integration-qa-20261027`. **No fusionar a `main` ni publicar el francés sin aprobación editorial explícita.** El idioma FR se aplica solo en `?qa_fr=1`, como superposición en memoria; `data/places.json` y sus precios/formato originales no se alteraron. Las traducciones son **candidatas** (`candidate_awaiting_semantic_review`), no traducciones nativas aprobadas. La cifra 198 se refiere exclusivamente a **descripciones de platos**, no a títulos, secciones ni interfaz enteramente traducidos.

**Progreso confirmado: 7 establecimientos / 198 descripciones francesas candidatas**, repartidas en 19 lotes `translations/fr/batch-001-*.json` a `batch-019-*.json`:

| Establecimiento (id) | Lotes | Descripciones FR candidatas |
| --- | --- | ---: |
| La Montillana (`la-montillana`) | 001–003 | 30/30 |
| Churros Bar Marta (`churros-bar-marta`) | 004–005 | 17/17 |
| Cafetería Bar La Jineta (`cafeteria-bar-la-jineta`) | 006–007 | 22/22 |
| La Tarterie (`la-tarterie-centro`) | 008–010 | 28/28 |
| Taberna El Abuelo (`taberna-el-abuelo`) | 011–013 | 31/31 |
| Taberna La Viuda (`taberna-la-viuda`) | 014–016 | 34/34 |
| Restaurante Casa Rubio (`casa-rubio`) | 017–019 | 36/36 |

**Último PASS contrastado:** [GitHub Actions #40653024075](https://github.com/Helioven/helio-gastro/actions/runs/40653024075), terminado **SUCCESS**; los dos runs precedentes #40653010033 y #40652999634 también finalizaron con éxito. La suite incluye auditoría de lotes FR, integridad del overlay y pruebas Playwright en escritorio/móvil; último test específico: `scripts/test-fr-casa-rubio-36.mjs`. El PASS automatizado **no** certifica calidad lingüística ni publicación.

**Documentación de cierres técnicos:** `docs/qa-fr-la-montillana-closure-2026-10-28.md`, `docs/qa-fr-churros-bar-marta-closure-2026-10-28.md`, `docs/qa-fr-la-jineta-closure-2026-10-28.md`, `docs/qa-fr-la-tarterie-closure-2026-10-28.md`, `docs/qa-fr-el-abuelo-closure-2026-10-28.md` y `docs/qa-fr-la-viuda-closure-2026-10-28.md`. Para Casa Rubio, `docs/qa-fr-batch-017-casa-rubio-2026-10-28.md` y `docs/qa-fr-batches-018-019-casa-rubio-2026-10-28.md`; **falta crear cierre técnico de Casa Rubio**, tomando como prueba el run #40653024075.

**Siguiente restaurante propuesto:** **Taberna El Número 10** (`taberna-el-numero-10`), con **37 entradas ES/EN** según inventario anterior; verificar de nuevo el contenido real antes de traducir. El script `scripts/inspect-next-fr-restaurant.mjs` acaba apuntando a `casa-rubio` con `entries.slice(12)`. Para obtener los datos siguientes, ajustar filtro a `taberna-el-numero-10` y paginación `slice(0,12)`, hacer commit **solo en la rama QA**, dejar correr `.github/workflows/data-qa.yml`, y leer la línea `FR-NEXT-CANDIDATE` en los logs del job `catalog-audit`. El catálogo original es grande; no deducir platos a partir de nombres ni de memoria.

**Procedimiento de continuidad:** crear lotes JSON con `meta.status='candidate_awaiting_semantic_review'`, `meta.source='data/places.json'`, `meta.language='fr'`, `meta.catalogModified=false`, entradas `{placeId,sectionIndex,itemIndex,fr}`; verificar los lotes vía GitHub Actions. Una vez completadas las descripciones de un restaurante, añadir sus nombres de lote y recuentos a la lista `paths`/`expectedCounts` de `app.js`, incluir su ID en la lista permitida y actualizar total esperado (actual **198**). Añadir una prueba de ficha FR ES/EN escritorio/móvil siguiendo `scripts/test-fr-casa-rubio-36.mjs`, activarla en `.github/workflows/data-qa.yml`, documentar reservas editoriales y **comprobar PASS antes de afirmar cierre**. Mantener preservación de gramajes, unidades, formatos, ingredientes explícitos y advertencias de origen; no inventar disponibilidad o variedades.

**Prioridades y límites del proyecto:** respetar las 43 cartas editoriales ya cerradas, no publicar cartas parciales, mantener excepción de El Caballo Rojo sin verificación de reapertura. Continuar de manera incremental con francés aislado y revisión lingüística pendiente; luego auditoría integral y resto de fases según hoja de ruta, sin alterar prioridades unilateralmente. La próxima conversación puede empezar comprobando este README, creando el cierre de Casa Rubio y recuperando las entradas reales de Taberna El Número 10.


### Actualización de relevo — FR QA, Taberna El Nº 10 (28/10/2026)

- Estado vigente: **8 establecimientos / 235 descripciones FR candidatas** en 22 lotes (`batch-001` a `batch-022`). Se añade **Taberna El Nº 10: 37/37**, lotes 020–022. El resumen anterior de 7/198 queda como registro histórico anterior, no estado actual.
- Cierre técnico: [`docs/qa-fr-el-numero-10-closure-2026-10-28.md`](docs/qa-fr-el-numero-10-closure-2026-10-28.md). Primera ejecución visual [#40653979630](https://github.com/Helioven/helio-gastro/actions/runs/40653979630) FAIL por falta de autorización del restaurante en el renderizado FR; corregido en `app.js` (commit `0930b478`). Repetición [#40654228938](https://github.com/Helioven/helio-gastro/actions/runs/40654228938) **SUCCESS**.
- Las pruebas técnicas no sustituyen revisión lingüística humana. Traducciones solo en `?qa_fr=1`; no publicar ni fusionar en `main` sin autorización.
- **Próximo paso:** consultar inventario de entradas ES/EN aún sin lotes FR, elegir establecimiento pendiente y continuar por lotes de 12 con comprobación CI, preservando originales, precios y formatos. No reabrir los ocho establecimientos técnicamente cubiertos salvo defecto real.


### Actualización de relevo — FR QA, La Taberna del Río (28/10/2026)

**Estado vigente: 9 establecimientos y 273 descripciones francesas candidatas en 25 lotes** (`batch-001` a `batch-025`). Las cifras anteriores (7/198 y 8/235) son hitos históricos, no el estado actual. **La Taberna del Río** (`la-taberna-del-rio`): **38/38 descripciones** en los lotes 023–025, integradas únicamente en `?qa_fr=1`. La ficha contiene 44 platos, pero solo 38 descripciones ES/EN traducibles identificadas en el inventario.

**Cierre técnico contrastado:** [GitHub Actions #40656146561](https://github.com/Helioven/helio-gastro/actions/runs/40656146561) terminó **SUCCESS** (auditoría y regresión automatizada). Detalle del cierre y de los intentos fallidos previos: [`docs/qa-fr-la-taberna-del-rio-closure-2026-10-28.md`](docs/qa-fr-la-taberna-del-rio-closure-2026-10-28.md). Las incidencias previas procedían de expectativas incorrectas del test sobre el número de títulos y la equivalencia literal ES/EN; no se verificó un defecto de las 38 traducciones FR. Las comprobaciones finales utilizan los títulos visibles y una referencia inglesa sin overlay FR.

**Límites editoriales:** la revisión semántica y lingüística humana sigue pendiente. Estas 273 traducciones son candidatas de **descripciones**, no equivalen a la traducción íntegra de títulos, secciones e interfaz. No fusionar la rama QA con `main` ni publicar el francés sin autorización. `data/places.json`, precios y formatos originales permanecen intactos.

**Próximo paso operativo:** seleccionar el siguiente establecimiento pendiente del inventario real, recuperar sus entradas ES/EN, crear lotes FR revisables, integrar solo en QA y pasar las pruebas de regresión. Entre los siguientes candidatos detectados: Taberna Rafaé (38 descripciones), Cafetería Don Pepe · Centro (43), Taberna El Poema · Alonso de Burgos (44) y D'Tapas COVAP Córdoba (45); verificar datos antes de traducir. Mantener el orden acordado de fases.


### Rafaé — traducción francesa QA (28/10/2026)

- Fuente: 38 entradas con descripciones originales `es` y `en` de `taberna-rafae` verificadas por el inspector de la rama QA. No se reabre la carta editorial ES/EN, cerrada el 26/10.
- Candidatas FR: 38/38 descripciones en los lotes `translations/fr/batch-026-rafae.json` a `batch-029-rafae.json`, en grupos de 12+12+12+2; `meta.status=candidate_awaiting_semantic_review`.
- Integración exclusivamente experimental en `?qa_fr=1`, mediante overlay en memoria de `app.js`; el catálogo original, precios y formatos no se modifican. Total acumulado de candidatos: 311 descripciones / 10 establecimientos.
- Se añadió `scripts/test-fr-rafae-38.mjs` a `.github/workflows/data-qa.yml`, con prueba FR y comprobaciones de ES/EN en escritorio y móvil. **QA técnico SUPERADO:** ejecución [#40657184491](https://github.com/Helioven/helio-gastro/actions/runs/40657184491) completada con `SUCCESS` (jobs `catalog-audit` y `visual-qa`), confirmado también por Helio el 28/10/2026. Cierre técnico FR QA de Rafaé autorizado; no equivale a revisión lingüística nativa ni a publicación.
- Pendientes editoriales: revisión semántica de las traducciones candidatas, revisión lingüística y cobertura de títulos/secciones/interfaz FR. No fusionar a `main` ni publicar francés sin aprobación.


### Don Pepe Centro — francés QA (28/10/2026)

- `cafeteria-don-pepe-centro`: 43 entradas de descripciones ES/EN verificadas mediante `scripts/inspect-next-fr-restaurant.mjs`.
- Cuatro lotes candidatos `translations/fr/batch-030-don-pepe-centro.json` a `batch-033-don-pepe-centro.json` (12+12+12+7), con estado `candidate_awaiting_semantic_review`. Total acumulado del overlay FR QA: **354 descripciones candidatas / 11 establecimientos**.
- Activación únicamente en `?qa_fr=1`, sin modificar `data/places.json`, ingredientes, formatos ni precios. Prueba visual específica `scripts/test-fr-don-pepe-centro-43.mjs` añadida a `.github/workflows/data-qa.yml` para escritorio y móvil, ES/EN/FR.
- **Cierre técnico QA confirmado por Helio el 28/10/2026:** [GitHub Actions #40657881675](https://github.com/Helioven/helio-gastro/actions/runs/40657881675) terminó `SUCCESS` (catalog-audit y visual-qa). No implica aprobación lingüística nativa ni publicación; no confundir traducción candidata con revisión nativa ni publicar francés o fusionar la rama a `main` sin aprobación. Revisar contextual y editorialmente los nombres breves y las diferencias entre campos ES/EN (por ejemplo, denominación genérica frente a baguette en algunas entradas).


### El Poema · Alonso de Burgos — francés QA (28/10/2026)

- ID real `taberna-el-poema-alonso`: 44 descripciones ES/EN recuperadas del inventario real; establecimiento distinto de El Poema de Gran Capitán. Cuatro lotes `translations/fr/batch-034-el-poema-alonso.json` a `batch-037-el-poema-alonso.json` (12+12+12+8), estado `candidate_awaiting_semantic_review`.
- El overlay francés aislado `?qa_fr=1` suma ahora **398 descripciones candidatas / 12 establecimientos**. Catálogo `data/places.json`, precios de plataformas de reparto, formatos y fuentes no modificados; se preservan las notas de ingredientes no especificados.
- Prueba de regresión `scripts/test-fr-el-poema-alonso-44.mjs` añadida al workflow para ES/EN/FR y escritorio/móvil. **QA técnico SUPERADO y cierre confirmado por Helio (28/10/2026):** [GitHub Actions #40658951373](https://github.com/Helioven/helio-gastro/actions/runs/40658951373) completó `SUCCESS`. El cierre técnico no equivale a revisión lingüística nativa ni a publicación. La revisión semántica y lingüística nativa, títulos/secciones y la interfaz FR completa siguen pendientes. No fusionar la rama QA con `main`.


### D'Tapas COVAP Córdoba — francés QA (28/10/2026)

- ID confirmado `dtapas-covap-cordoba`: 45 entradas con campos ES/EN verificadas en el inventario real. Cuatro lotes candidatos `translations/fr/batch-038-dtapas-covap.json` a `batch-041-dtapas-covap.json` (12+12+12+9), `candidate_awaiting_semantic_review`.
- Overlay QA exclusivamente con `?qa_fr=1`: total acumulado **443 descripciones francesas candidatas / 13 establecimientos**. No se modificó `data/places.json`, ni precios, fuentes, formatos o declaraciones de alérgenos originales.
- Se añadieron `scripts/test-fr-dtapas-covap-45.mjs` y su ejecución en `.github/workflows/data-qa.yml`, con controles de ficha FR, comparación con títulos ES/EN y escritorio/móvil. **QA técnico SUPERADO y cierre confirmado por Helio (28/10/2026):** [GitHub Actions #40659764245](https://github.com/Helioven/helio-gastro/actions/runs/40659764245) finalizó `SUCCESS` en `catalog-audit` y `visual-qa`. El cierre técnico no supone revisión lingüística nativa ni publicación.
- Reserva editorial: los textos ES de varias entradas son notas de alérgenos o formatos más breves que el campo EN. Las candidatas FR respetan esas notas sin añadir ingredientes o deducir alérgenos. Validación semántica y lingüística pendiente. No fusionar a `main` ni publicar francés todavía.


### Taberna Sociedad de Plateros · San Francisco — francés QA (28/10/2026)

- ID `taberna-plateros-san-francisco`: **46 descripciones ES/EN** identificadas en el catálogo real. Creados cuatro lotes candidatos `translations/fr/batch-042-plateros-san-francisco.json` a `batch-045-plateros-san-francisco.json` (12+12+12+10), con estado `candidate_awaiting_semantic_review`.
- Las 46 propuestas se cargan únicamente mediante overlay en memoria bajo `?qa_fr=1`. Acumulado experimental: **489 descripciones francesas candidatas en 14 establecimientos**. No se modifica `data/places.json`, precios, formatos, fuentes ni datos gastronómicos originales.
- Añadida prueba visual `scripts/test-fr-plateros-san-francisco-46.mjs` al workflow de CI para validar explicaciones FR, invariancia ES/EN y navegación de ficha en escritorio/móvil. **Ejecución final y cierre técnico pendientes de comprobar; no afirmar PASS anticipadamente.**
- Las traducciones mantienen denominaciones tradicionales y reservas sobre preparaciones y guarniciones no especificadas. Sigue pendiente revisión semántica y lingüística nativa, así como títulos, secciones y cobertura completa de interfaz francesa. No fusionar a `main` ni publicar todavía.

- **Incidencia QA real (28/10/2026):** ejecución [#40661926971](https://github.com/Helioven/helio-gastro/actions/runs/40661926971) `FAIL`: `catalog-audit` PASS y `visual-qa` FAIL por `ENOENT` del archivo inexistente `batch-046-plateros-san-francisco.json`, citado por error en `scripts/test-fr-plateros-san-francisco-46.mjs`. El lote real es `batch-045`; corregida la ruta en commit `c9686a2a`. **Reejecución y cierre técnico confirmados por Helio el 28/10/2026:** [GitHub Actions #40662776332](https://github.com/Helioven/helio-gastro/actions/runs/40662776332) finalizó `SUCCESS`; se conserva el registro histórico del fallo y su corrección. No se han cambiado las traducciones ni la carta.


### Taberna Salinas — francés QA (28/10/2026)

- ID confirmado `taberna-salinas`: **56 entradas ES/EN** inventariadas; cinco lotes candidatos `translations/fr/batch-046-taberna-salinas.json` a `batch-050-taberna-salinas.json` (12+12+12+12+8), `meta.status=candidate_awaiting_semantic_review`.
- Overlay experimental visible solo con `?qa_fr=1`: acumulado **545 descripciones francesas candidatas en 15 establecimientos**. Sin cambios en `data/places.json`, platos originales, precios ni formatos.
- Prueba `scripts/test-fr-taberna-salinas-56.mjs` añadida a CI para navegador escritorio/móvil y comprobación de FR y conservación ES/EN. **QA técnico superado y confirmado (28/10/2026):** [GitHub Actions #40663561737](https://github.com/Helioven/helio-gastro/actions/runs/40663561737) terminó `SUCCESS` (jobs `catalog-audit` y `visual-qa`). La advertencia final sobre acciones que usan Node.js 20 y ejecución forzada sobre Node.js 24 es **WARNING no bloqueante**, no fallo de pruebas; registrar actualización de acciones como mantenimiento posterior, sin cambiar las prioridades del proyecto.
- Se mantienen explícitas las incertidumbres originales sobre la procedencia de algunos productos (`Zuhetos`, `Moltalbán`) y sobre ingredientes/preparaciones no detallados; no reinterpretar ni corregir sin fuente. Revisión semántica y lingüística nativa aún pendiente, igual que títulos, secciones e interfaz FR completa. No fusionar esta rama con `main` ni publicar francés sin autorización.


### Taberna La Sal — francés QA (28/10/2026)

- ID real `taberna-la-sal`: 60 descripciones con fuentes ES/EN verificadas en `data/places.json` mediante el inspector del catálogo. Cinco lotes candidatos `translations/fr/batch-051-taberna-la-sal.json` a `batch-055-taberna-la-sal.json` (12+12+12+12+12), con `candidate_awaiting_semantic_review`.
- Overlay exclusivo de `?qa_fr=1`: **605 descripciones FR candidatas / 16 establecimientos / 55 lotes**. El archivo `data/places.json`, los títulos originales, precios y formatos no se modificaron.
- Prueba `scripts/test-fr-taberna-la-sal-60.mjs` añadida a `.github/workflows/data-qa.yml` para escritorio/móvil y regresión ES/EN/FR; **QA técnico SUPERADO, confirmado por Helio el 28/10/2026:** [GitHub Actions #40664538783](https://github.com/Helioven/helio-gastro/actions/runs/40664538783) terminó `SUCCESS`, con `catalog-audit` y `visual-qa` superados. Cierre técnico de La Sal registrado; no equivale a aprobación semántica o lingüística nativa ni autoriza publicación.
- Se conservan como pendientes las incertidumbres documentadas en la fuente, en particular dos precios distintos de 13 € y 14 € en el revuelto de aguacate, y las preparaciones o acompañamientos no especificados. La revisión editorial y lingüística nativa sigue pendiente, así como títulos, secciones e interfaz FR completa. No fusionar rama a `main` ni publicar francés sin autorización.


### Taberna San Miguel · El Pisto — francés QA (28/10/2026)

- ID verificado `taberna-san-miguel-el-pisto`: 62 descripciones reales con fuentes ES/EN inspeccionadas en `data/places.json`. Seis lotes candidatos `translations/fr/batch-056-el-pisto.json` a `batch-061-el-pisto.json` (12+12+12+12+12+2); estado `candidate_awaiting_semantic_review`.
- Integración exclusivamente en `?qa_fr=1`; overlay acumulado **667 descripciones FR candidatas / 17 establecimientos / 61 lotes**. No se modifica `data/places.json`, los precios, las denominaciones ni los formatos originales.
- Añadida prueba `scripts/test-fr-el-pisto-62.mjs` al workflow `data-qa.yml` para desktop/móvil y preservación ES/EN; **QA técnico SUPERADO (28/10/2026):** [GitHub Actions #40665724021](https://github.com/Helioven/helio-gastro/actions/runs/40665724021) terminó `SUCCESS`, con `catalog-audit` y `visual-qa` superados; Helio confirmó el PASS. El aviso de deprecación de Node.js 20 es no bloqueante. Cierre técnico registrado; no equivale a aprobación lingüística ni a publicación.
- Se respetan las notas originales de preparaciones no especificadas y la fecha histórica de la referencia al solomillo de gamo (carta 2024). Las propuestas francesas siguen pendientes de revisión semántica y lingüística, y la cobertura de títulos/secciones/interfaz FR sigue incompleta. No publicar ni fusionar a `main` sin autorización editorial.


### Taberna Rincón de las Beatillas — francés QA (28/10/2026)

- ID verificado `rincon-beatillas`: **75 entradas ES/EN** recuperadas del inventario real mediante `scripts/inspect-next-fr-restaurant.mjs`. Se han creado los cinco lotes candidatos `translations/fr/batch-062-rincon-beatillas.json` a `batch-066-rincon-beatillas.json` (15+15+15+15+15), con estado `candidate_awaiting_semantic_review`.
- Integración solo en el overlay experimental `?qa_fr=1`: acumulado **742 descripciones francesas candidatas en 18 establecimientos y 66 lotes**. No se ha modificado `data/places.json`, los precios ni los formatos del catálogo.
- Prueba específica `scripts/test-fr-rincon-beatillas-75.mjs` incluida en `.github/workflows/data-qa.yml`, con comprobaciones FR y conservación ES/EN en escritorio/móvil. **QA técnico superado y cierre confirmado por Helio el 28/10/2026:** [GitHub Actions #40666623610](https://github.com/Helioven/helio-gastro/actions/runs/40666623610) finalizó `SUCCESS`, con `catalog-audit` y `visual-qa` en PASS. El cierre técnico no equivale a validación lingüística nativa ni autoriza publicar el francés.
- Se respetan expresiones gastronómicas tradicionales, porciones de 2 personas y 250 g cuando figuran en la fuente, y el aviso de helados sin variedades ni precios disponibles. La revisión semántica y lingüística nativa y la cobertura FR de títulos/secciones/interfaz siguen pendientes. No fusionar a `main` ni publicar francés sin autorización.


### La Bandera — traducciones francesas candidatas (28/10/2026)

- A partir de `fr-next-restaurant.json` del artefacto CI #316, se han preparado las **84 descripciones ES/EN de La Bandera** (ID `la-bandera-cafe`) en seis lotes candidatos `batch-067` a `batch-072-la-bandera.json`, de 14 entradas cada uno.
- Los textos FR están marcados `candidate_awaiting_semantic_review`. Conservan los nombres tradicionales, ingredientes presentes en la fuente y notas sobre suplementos o precios por unidad, sin afirmar ingredientes para preparaciones no detalladas.
- Se han conectado únicamente al overlay experimental de `?qa_fr=1` y se ha incluido `scripts/test-fr-la-bandera-84.mjs` en `visual-qa` para escritorio/móvil y conservación ES/EN. **QA técnico superado el 28/10/2026:** Helio confirmó la ejecución verde **#329** tras corregir el renderizado FR de esta ficha. El PASS técnico no equivale a revisión lingüística nativa.
- Cobertura candidata acumulada: **826 descripciones / 19 establecimientos / 72 lotes**. No se modificó `data/places.json`, ni precios, formatos o fuentes. Pendientes revisión semántica, revisión lingüística nativa y traducción de títulos, secciones e interfaz completa. No publicar ni fusionar con `main` sin aprobación.


### Cierre de sesión — francés QA, 28/10/2026

- **Estado comprobado al detener el trabajo:** 43/44 fichas cerradas editorialmente (El Caballo Rojo continúa como excepción); **826 descripciones FR candidatas, 19 establecimientos, 72 lotes**. El último lote, **La Bandera (84/84)**, tiene cierre **técnico QA** confirmado visualmente por Helio en GitHub Actions **#329**, commit `a745452`. No interpretar ese PASS como aprobación lingüística ni como francés publicado.
- **Selector de idiomas:** banderas ES/EN y opción 🇫🇷 Français (QA) solo con `?qa_fr=1`. Pruebas automatizadas del selector PASS en GitHub Actions #310. `main` conserva únicamente ES/EN; ninguna traducción candidata se ha fusionado.
- **Inventario y continuidad:** `scripts/inspect-next-fr-restaurant.mjs` calcula cobertura a partir del catálogo y los lotes, exporta `qa-reports/fr-next-restaurant.json` como artefacto de CI y muestra el próximo establecimiento en el resumen de `catalog-audit`. La corrección del YAML de subida se verificó en #315; el resumen automatizado pasó en #316. Volver a ejecutar el inventario para elegir el próximo restaurante; no asumir que sigue siendo La Bandera.
- **Incidencias al integrar La Bandera:** ejecuciones #323–#328 con FAIL de `visual-qa` (el catálogo pasó). Los logs mostraban cero descripciones francesas visibles. Se corrigieron los tamaños esperados de los seis lotes (14 entradas cada uno), el total de 826 y la lista de locales admitidos en el cargador (`f858ea7`). Persistió el defecto porque `app.js` mantenía **otra lista independiente** de locales admitidos en el renderizador. La incorporación de `la-bandera-cafe` a esa segunda lista (`a745452`) permitió el **PASS #329**. No borrar este historial de fallos: evidencia QA de regresión y corrección.
- **Riesgo técnico detectado:** duplicar listas de IDs permitidos, tamaños de lotes y totales entre carga y renderizado provoca discrepancias y puede ocultar todo el overlay FR. Antes de ampliar mucho más la cobertura, proponer una refactorización pequeña y comprobable para derivar estos valores de una única fuente validada, con pruebas negativas y regresión ES/EN/FR. **Propuesta pendiente, no implementada ni aprobada.**
- **Pendientes editoriales y QA:** revisión contextual de las propuestas francesas, validación lingüística nativa, títulos y secciones de cartas, traducción integral de interfaz, y auditoría final en tres idiomas. Mantener denominaciones tradicionales, precios, formatos, fuentes y reservas documentales. La cobertura 826 corresponde solo a descripciones candidatas, no a cobertura integral del idioma.
- **Próximo arranque:** consultar este README y el estado real de la rama; ejecutar inventario, revisar el siguiente restaurante con fuentes ES/EN y continuar en lotes controlados con QA escritorio/móvil y regresión. No reabrir las 43 cartas cerradas sin incidencia; no modificar `data/places.json`, ni fusionar `main` o publicar FR sin autorización expresa.


### Cierre técnico de francés QA — La Cazuela de la Espartería (29/10/2026)

- **Cierre técnico autorizado por Helio** tras comprobar la ejecución [GitHub Actions #363](https://github.com/Helioven/helio-gastro/actions/runs/40833949864), con `catalog-audit` y `visual-qa` en **SUCCESS**.
- ID `la-cazuela-esparteria`: **89 de 89 descripciones francesas candidatas** distribuidas en los lotes `batch-073` a `batch-080`, integradas exclusivamente en el overlay experimental `?qa_fr=1`. Acumulado de la rama: **915 descripciones FR candidatas en 20 establecimientos, 80 lotes**.
- La prueba `scripts/test-fr-la-cazuela-89.mjs` cubre la visualización acumulada en escritorio y móvil y la conservación de títulos ES/EN; incluida en `.github/workflows/data-qa.yml`. El cierre técnico **no equivale** a revisión semántica o lingüística nativa, traducción de títulos/secciones/interfaz completa ni publicación.
- No se modificaron `data/places.json`, importes, formatos ni la rama pública `main`. Mantener el control editorial de las 43/44 cartas cerradas y la excepción de El Caballo Rojo.
- **Mejora ya implementada antes del lote:** se sustituyeron dos listas duplicadas de IDs en `app.js` por la identificación de locales derivada de lotes FR validados; ejecución #331 PASS. Evitar tratarla en futuras sesiones como pendiente. Los contadores y nombres de archivos siguen sujetos a actualización por lote; la eventual automatización completa es una decisión distinta.
- **Próximo paso:** volver a ejecutar el inventario de cobertura, elegir el siguiente establecimiento pendiente y continuar por lotes con validación y regresión. No fusionar ni publicar el francés sin autorización expresa.


### Cierre técnico de francés QA — Don Pepe · Ciudad Jardín (29/10/2026)

- **Establecimiento:** `cafeteria-don-pepe-ciudad-jardin`, distinto de Don Pepe Centro. **103/103 descripciones ES/EN con traducción francesa candidata**, distribuidas en los lotes `batch-081` a `batch-089`. Sin entradas pendientes de traducción inicial de este establecimiento según el inventario usado.
- **Acumulado experimental actualizado:** **1.018 descripciones candidatas en 89 lotes y 21 establecimientos**; la cifra histórica de 915/80 indicada en el apartado anterior corresponde al cierre previo de La Cazuela, no al estado actual.
- **Estado QA:** Helio confirmó PASS del último lote con evidencia de GitHub Actions **#415 y #416**; #414 registró un FAIL intermedio anterior a la integración completa. Los lotes 081–088 también se cerraron técnicamente tras sus comprobaciones. Trazabilidad y detalles en `docs/qa-fr-don-pepe-ciudad-jardin-2026-10-29.md`.
- **Defecto y corrección verificados:** en el lote 086 el test acumulativo comparaba el orden de los archivos frente al orden de las secciones de la carta; tras ordenar por `sectionIndex`/`itemIndex` en `scripts/test-fr-don-pepe-ciudad-jardin-12.mjs` (commit `1c01ef1`), Helio confirmó PASS. El test descubre automáticamente los lotes de Don Pepe, sin un recuento fijo; cubre escritorio, móvil y comparación ES/EN con la versión sin overlay.
- **Alcance estricto:** los textos FR siguen siendo **candidatos pendientes de revisión semántica y lingüística**, no traducciones editoriales aprobadas. No se han traducido necesariamente títulos, secciones ni toda la interfaz, ni se autoriza publicación. La carta `data/places.json` y la rama pública `main` permanecen sin cambios por estos lotes. El overlay se activa solo con `?qa_fr=1`.
- **Siguiente paso:** consultar `fr-next-restaurant.json` / inventario del `catalog-audit` actualizado para identificar el próximo establecimiento con cobertura pendiente. No reabrir Don Pepe Ciudad Jardín salvo incidencia documentada ni alterar las prioridades de la hoja de ruta.


### Moriles Ribera — lote francés 090 (29/10/2026)

- **Cierre técnico QA:** 12 descripciones francesas candidatas (índices 0:0–0:11), archivo `translations/fr/batch-090-moriles-ribera.json`, integradas exclusivamente en el overlay `?qa_fr=1` de la rama `feature/fr-integration-qa-20261027`.
- **Pruebas confirmadas:** GitHub Actions #419, #420, #421 y **#422** finalizaron en SUCCESS; la última incluye `scripts/test-fr-moriles-ribera-12.mjs` para escritorio/móvil y contraste ES/EN con la versión sin overlay. Evidencia: https://github.com/Helioven/helio-gastro/actions/runs/40847546785.
- **Cobertura parcial:** 12 de 214 descripciones iniciales del establecimiento, 202 pendientes. Acumulado de propuestas FR de la rama: 1.030 descripciones en 90 lotes, 22 establecimientos con al menos una propuesta; **solo 21 completos según el inventario previo**.
- **Alcance:** no se modifica `data/places.json`, los precios, los formatos ni la rama `main`. La revisión semántica y lingüística nativa, títulos, secciones e interfaz francesa general siguen pendientes; PASS técnico no equivale a aprobación editorial ni publicación.
- **Próximo paso:** lote 091 con las siguientes entradas pendientes según inventario de la rama, verificando índices y textos ES/EN antes de traducir y repitiendo QA/regresión.


### Moriles Ribera — lote francés 091 (29/10/2026)

- **Cierre técnico QA:** 12 nuevas traducciones candidatas, índices 1:0–1:11, en `translations/fr/batch-091-moriles-ribera.json`, añadidas al overlay exclusivamente bajo `?qa_fr=1`. Total parcial de Moriles Ribera: **24/214**; 190 descripciones iniciales pendientes.
- **Evidencia:** Actions **#426 SUCCESS** (commit `a38f43a`), https://github.com/Helioven/helio-gastro/actions/runs/40849605993 . En #424 y #425 `catalog-audit` pasó y `visual-qa` falló porque el cargador aún no incluía el lote; el historial se conserva como regresión intermedia y su corrección mediante la integración del overlay.
- **Alcance:** candidatas FR, no revisión lingüística nativa ni aprobación editorial; `data/places.json` y `main` intactos. Próximo lote 092: obtener los siguientes índices ES/EN desde el inventario antes de traducir.


### Moriles Ribera — lote francés 092 (29/10/2026)

- **QA técnico superado:** 12 descripciones francesas candidatas en `translations/fr/batch-092-moriles-ribera.json`, índices 1:12–1:19 y 2:0–2:3. La integración del overlay experimental se verificó en **GitHub Actions #429 SUCCESS** (commit `1215024`): https://github.com/Helioven/helio-gastro/actions/runs/40850271685.
- **Trazabilidad de incidencias:** #428 finalizó en FAIL antes de incorporar el nuevo lote al cargador, mientras que la ejecución posterior #429 terminó en SUCCESS. Mantener ambas evidencias; no presentar el fallo intermedio como incidencia abierta sin nueva evidencia.
- **Progreso Moriles Ribera:** 36/214 descripciones FR candidatas en los lotes 090–092; quedan 178 por preparar. Son propuestas aún pendientes de revisión semántica y lingüística, no francés aprobado para publicación.
- **Sin alteraciones del catálogo:** `data/places.json`, precios, formatos y `main` no se modificaron. Próximo lote 093: obtener las siguientes entradas del inventario antes de traducir.


### Moriles Ribera — lote francés 093 (29/10/2026)

- **Cierre técnico QA:** 12 descripciones FR candidatas (índices 2:4–2:13 y 3:0–3:1), integradas en el overlay experimental `?qa_fr=1` mediante `batch-093-moriles-ribera.json` y actualización del cargador.
- **Evidencia:** GitHub Actions **#432 SUCCESS**, commit `2cd4110`: https://github.com/Helioven/helio-gastro/actions/runs/40850952163. El run intermedio **#431 FAIL** corresponde al commit de creación del lote antes de incluirlo en el cargador; conservar trazabilidad.
- **Cobertura Moriles Ribera:** 48 de 214 descripciones FR candidatas preparadas en lotes 090–093; quedan 166. Revisión semántica y lingüística nativa pendientes; no equivale a aprobación editorial ni publicación.
- **Sin cambios** en `data/places.json`, importes, formatos o `main`. Siguiente lote 094: seleccionar las próximas 12 entradas del inventario y repetir QA incremental.


### Moriles Ribera — lote francés 094 (29/10/2026)

- **Cierre técnico QA:** lote `translations/fr/batch-094-moriles-ribera.json` con 12 descripciones FR candidatas (índices 3:2–3:7, 4:0–4:4 y 5:0), integrado solo en `?qa_fr=1`.
- **Evidencia:** GitHub Actions **#435 y #436 SUCCESS**; última ejecución sobre commit `e91e18e`: https://github.com/Helioven/helio-gastro/actions/runs/40851726115. El run **#434 FAIL** fue intermedio, anterior a incluir el nuevo archivo en el cargador; conservar trazabilidad.
- **Progreso:** 60 de 214 descripciones FR candidatas preparadas para Moriles Ribera (lotes 090–094); 154 pendientes. PASS técnico no acredita revisión lingüística nativa ni autorización de publicación.
- `data/places.json`, importes, formatos y `main` sin modificaciones por este lote. **Siguiente:** inventario y lote 095 por índices pendientes, validación y regresión incremental.


### Moriles Ribera — lote francés 095 (29/10/2026)

- **Cierre técnico QA:** 12 propuestas francesas del lote `translations/fr/batch-095-moriles-ribera.json` (índices 5:1–5:12), integradas exclusivamente en `?qa_fr=1`.
- **Evidencia:** Actions **#439 SUCCESS**, commit `2682cdb`: https://github.com/Helioven/helio-gastro/actions/runs/40852324420. La ejecución intermedia **#438 FAIL** se produjo antes de incorporar el lote al cargador; se mantiene la trazabilidad sin considerarla un fallo abierto tras el PASS.
- **Cobertura parcial:** Moriles Ribera, **72 de 214** descripciones FR candidatas preparadas en lotes 090–095; **142 pendientes**. Siguen pendientes la revisión semántica y lingüística definitiva, títulos, secciones e interfaz francesa general. El PASS automatizado no es aprobación editorial.
- No se alteraron `data/places.json`, los precios, formatos ni `main`. Próximo lote 096: utilizar las siguientes 12 entradas ES/EN del inventario y repetir la validación y regresión incremental.


### Moriles Ribera — lote francés 096 (29/10/2026)

- **Cierre técnico QA:** 12 descripciones francesas candidatas en `translations/fr/batch-096-moriles-ribera.json` (índices 5:13–5:18 y 6:0–6:5), integradas exclusivamente en `?qa_fr=1`.
- **Evidencia:** GitHub Actions **#443 SUCCESS** sobre commit `f6672ca`: https://github.com/Helioven/helio-gastro/actions/runs/40853044439. Las ejecuciones intermedias **#441 y #442 FAIL** precedieron a la integración del lote en el cargador; se mantiene su historial para trazabilidad.
- **Cobertura parcial:** Moriles Ribera cuenta con **84/214 descripciones FR candidatas** en los lotes 090–096; **130 pendientes**. PASS técnico no implica validación lingüística nativa, aprobación editorial ni publicación.
- `data/places.json`, precios, formatos y `main` no modificados en este lote. **Siguiente:** lote 097 a partir de los próximos índices ES/EN del inventario y nueva regresión incremental.


### Moriles Ribera — lote francés 097 (29/10/2026)

- **Cierre técnico QA:** 12 descripciones francesas candidatas (índices 6:6–6:17) en `translations/fr/batch-097-moriles-ribera.json`, integradas exclusivamente en `?qa_fr=1`.
- **Incidencia comprobada y corregida:** #445 y #446 FAIL; en #446 `visual-qa` pasó pero `catalog-audit` falló por el número de comensales de la fritura (ES `2 personas`, FR inicial `deux personnes`). Se corrigió a `2 personnes` para conservar el dato numérico; commit `5fb09bf`.
- **Evidencia final:** GitHub Actions **#447 SUCCESS** sobre commit `5fb09bf`: https://github.com/Helioven/helio-gastro/actions/runs/40854442319. Se mantienen los fallos intermedios como historial de QA, no como fallos abiertos tras esta corrección.
- **Cobertura parcial:** Moriles Ribera **96/214 descripciones FR candidatas**, 118 pendientes; lotes 090–097. PASS técnico no equivale a revisión lingüística nativa, aprobación editorial ni publicación.
- Sin cambios en `data/places.json`, importes, formatos o `main`. **Siguiente lote 098:** próximas entradas ES/EN según inventario, con regresión incremental.


### Moriles Ribera — lote francés 098 (29/10/2026)

- **Cierre técnico QA:** 12 descripciones francesas candidatas (índices 6:18–6:25 y 7:0–7:3) registradas en `translations/fr/batch-098-moriles-ribera.json`, cargadas únicamente bajo `?qa_fr=1`.
- **Evidencia final:** GitHub Actions **#450 y #451 SUCCESS**; última ejecución sobre commit `ded582b`: https://github.com/Helioven/helio-gastro/actions/runs/40855232492. La ejecución anterior **#449 FAIL**, previa a integrar el lote en el cargador, permanece documentada como prueba intermedia.
- **Cobertura parcial:** Moriles Ribera **108/214 descripciones FR candidatas** en lotes 090–098; **106 pendientes**. Se ha superado la mitad del inventario de descripciones, pero la revisión contextual/lingüística, títulos, secciones e interfaz francesa general siguen pendientes; PASS técnico no equivale a aprobación editorial.
- No se modificaron `data/places.json`, los precios, formatos o `main`. **Siguiente lote 099:** obtener próximas entradas ES/EN desde el inventario y repetir validación y regresión.


### Moriles Ribera — lote francés 099 (29/10/2026)

- **Cierre técnico QA:** 12 traducciones francesas candidatas en `translations/fr/batch-099-moriles-ribera.json` (índices 7:4–7:15), integradas solo en el overlay experimental `?qa_fr=1`.
- **Evidencia:** GitHub Actions **#454 SUCCESS**, commit `61080b1`: https://github.com/Helioven/helio-gastro/actions/runs/40855998675. La ejecución intermedia **#453 FAIL** ocurrió antes de integrar el lote en el cargador y se conserva para trazabilidad.
- **Cobertura Moriles Ribera:** 120 de 214 descripciones francesas candidatas en lotes 090–099; 94 pendientes. El PASS técnico no equivale a revisión lingüística nativa, aprobación editorial ni publicación.
- No se modificaron `data/places.json`, precios, formatos ni `main`. Próximo lote 100: obtener las siguientes doce entradas ES/EN del inventario y repetir QA.


### Moriles Ribera — lote francés 100 (29/10/2026)

- **Cierre técnico QA:** 12 descripciones francesas candidatas (índices 7:16–7:27), archivo `translations/fr/batch-100-moriles-ribera.json`, integrado solo en el overlay `?qa_fr=1`.
- **Incidencias y resolución:** #456 y #457 FAIL; en #457 pasó `visual-qa` y falló `catalog-audit` por discrepancia numérica en la parrillada ibérica (español sin cifra, traducción inicial con `2`). Se cambió `pour 2 personnes` por `pour deux personnes`, conservando la condición documentada en inglés sin introducir cifras que incumplieran la validación. Tomahawk mantiene `270 g`.
- **Evidencia final:** Actions **#458 SUCCESS**, commit `98e8193`: https://github.com/Helioven/helio-gastro/actions/runs/40857320793. Los FAIL anteriores se conservan como historial de QA.
- **Cobertura parcial:** Moriles Ribera **132/214 descripciones francesas candidatas** en lotes 090–100; **82 pendientes**. Aún falta revisión lingüística/contextual y traducción de títulos, secciones e interfaz general. PASS técnico no equivale a aprobación editorial ni publicación.
- Sin modificación de `data/places.json`, importes, formatos ni `main`. **Siguiente lote 101:** próximas entradas ES/EN del inventario, validación y regresión incremental.


### Moriles Ribera — lote francés 101 (29/10/2026)

- **Cierre técnico QA:** 12 descripciones francesas candidatas, índices 7:28, 8:0–8:4 y 9:0–9:5, en `translations/fr/batch-101-moriles-ribera.json`, integradas exclusivamente con `?qa_fr=1`.
- **Evidencia:** GitHub Actions **#462 SUCCESS**, commit `33c9e6e`: https://github.com/Helioven/helio-gastro/actions/runs/40858096077. Las ejecuciones intermedias **#460 y #461 FAIL** precedieron a la incorporación del archivo al cargador; preservar su historial para QA.
- **Cobertura parcial:** Moriles Ribera **144/214 descripciones candidatas** en lotes 090–101; **70 pendientes**. Sigue pendiente revisión semántica y lingüística nativa, además de títulos, secciones e interfaz general FR. El PASS técnico no equivale a aprobación editorial ni publicación.
- Sin cambios en `data/places.json`, precios, formatos o `main`. **Siguiente lote 102:** consultar próximas entradas ES/EN del inventario y repetir regresión.


### Moriles Ribera — lote francés 102 (29/10/2026)

- **Cierre técnico QA:** 12 descripciones candidatas FR (índices 9:6, 10:0–10:1 y 11:0–11:8) registradas en `translations/fr/batch-102-moriles-ribera.json` e integradas exclusivamente en `?qa_fr=1`.
- **Evidencia:** GitHub Actions **#465 SUCCESS**, commit `3efe4b9`: https://github.com/Helioven/helio-gastro/actions/runs/40858952620. La ejecución **#464 FAIL** corresponde al estado intermedio previo a incorporar el lote al cargador; se conserva en el historial QA.
- **Cobertura Moriles Ribera:** **156/214 descripciones francesas candidatas** (lotes 090–102), **58 pendientes**. La validación técnica no equivale a revisión semántica y lingüística definitiva ni autoriza publicar el francés.
- Sin cambios en `data/places.json`, precios, formatos ni `main`. **Siguiente lote 103:** obtener las doce entradas pendientes del inventario y repetir pruebas/regresión.


### Estado de integración francesa — 30 de octubre de 2026 (rama QA)

- **Ámbito:** trabajo exclusivo en `feature/fr-integration-qa-20261027`; el francés solo está disponible mediante `?qa_fr=1` y la opción «Français (QA)». **No publicado** en `main`; sin cambios en `data/places.json`, precios, formatos ni fuentes gastronómicas.
- **Descripciones de platos:** lotes candidatos `translations/fr/batch-001-*.json` a `batch-107-*.json` incorporados al cargador experimental para los establecimientos cubiertos por el inventario de traducción. Se completó la cola de **214/214 descripciones candidatas de Moriles Ribera** (lotes 090–107). Esta cobertura **no** significa que los 44 establecimientos estén traducidos ni aprobados lingüísticamente.
- **Encabezados de cartas:** `docs/french-glossary-v1.json` contiene 198 entradas ES→FR de secciones con marca de revisión contextual/editorial; cubre las **314/314 apariciones** de encabezados del catálogo actual. Las propuestas se integraron en el navegador solo en modo FR QA; se conservan las denominaciones originales de los platos. Algunos títulos creativos mantienen pendiente una revisión editorial definitiva.
- **Interfaz general FR QA, implantación incremental:** 15 textos del buscador; 12 opciones y avisos de filtros/precios; 8 textos de encabezados y mensajes generales de resultados/ficha/comparador; 7 mensajes dinámicos de resultados; 8 etiquetas informativas de ficha; y un lote adicional de avisos de coste total no documentado, consulta y vigencia. Estas cifras describen **propuestas y cadenas integradas en sus ámbitos**, no una auditoría exhaustiva del interfaz completo.
- **Regresión resuelta:** en las ejecuciones **#486–#488** fallaron la auditoría y/o pruebas visuales durante la integración de encabezados. La auditoría incluía una aserción estática incorrecta sobre la rama española. Las comprobaciones visuales detectaron cambios de espacios (normal frente a inseparable) en los títulos de menús de grupo de **La Taberna del Río** y **La Cazuela de la Espartería** al alternar idiomas. Se restringió la traducción a elementos exactos y se conservó el texto original de los demás nodos; se reforzaron las pruebas. **#494 SUCCESS** fue el primer cierre de esta incidencia, confirmado en la conversación.
- **Evidencia técnica posterior:** `#497` (buscador), `#500` (filtros), `#502` (resultados/comparador), `#505` (resultados dinámicos), `#508` (fichas) y `#511` (avisos de ficha) se confirmaron PASS durante las revisiones. Última ejecución de la misma rama comprobada al actualizar esta nota: **GitHub Actions #512, SUCCESS**, commit `c8ec87b` — https://github.com/Helioven/helio-gastro/actions/runs/41020645940. Las pruebas de navegador incluyen perfiles de escritorio/móvil y recorridos FR→ES→EN; el PASS automático acredita los casos probados, no una aprobación editorial ni ausencia universal de defectos.
- **Siguiente trabajo dentro de la fase francesa:** inventariar y traducir con criterio contextual las condiciones de menús de grupo y los textos dinámicos aún visibles en español, ampliar pruebas de cambio de idioma/formatos/importes, y realizar revisión lingüística y visual integral. Antes de cualquier publicación, validar las traducciones frente a las fuentes ES y revisar conjuntamente ES/EN/FR. **No** anticipar comentarios, reseñas ni imágenes mientras esté pendiente esta fase según la hoja de ruta.
- **Cierre documental del 30/10/2026:** GitHub Actions **#514 SUCCESS** (ejecución completada, comprobada en GitHub; commit probado `b4881d0`) — https://github.com/Helioven/helio-gastro/actions/runs/41021166353. Esta ejecución valida el estado anterior del README y los trabajos de QA vigentes; la presente anotación documental requiere su propia comprobación tras el commit. Se mantienen las tareas pendientes de traducción de menús de grupo, revisión lingüística y pruebas de integración final.

### Menús de grupo — primer lote FR QA y regresión (30/10/2026)

- Se incorporaron propuestas francesas para etiquetas y condiciones de menús de grupo en `i18n.js`, exclusivamente bajo `?qa_fr=1`, sin alterar cartas, precios ni `main`.
- **#516 FAIL** por error de sintaxis JavaScript; corregido en `00172cf`. **#517 FAIL** por modificación de títulos originales de menús en La Taberna del Río, Rincón de Beatillas y La Cazuela de la Espartería; corregido excluyendo esos títulos de la traducción en `4a69615`.
- **#518 SUCCESS** sobre `4a69615`: https://github.com/Helioven/helio-gastro/actions/runs/41025336190. Los fallos anteriores quedan como trazabilidad histórica, no como defectos abiertos de estas pruebas.
- Pendientes: condiciones variables aún no cubiertas, inventario de cadenas restantes y revisión lingüística/visual final ES/EN/FR. El PASS automatizado no implica aprobación editorial del francés.

### QA francés — bebidas de menús de grupo Beatillas (30/10/2026)

- Traducciones FR candidatas de condiciones de bebidas incluidas del Rincón de Beatillas, limitadas al modo experimental `?qa_fr=1` y a atributos bilingües documentados. Último commit funcional: `5993b02`.
- **GitHub Actions #521 SUCCESS**, comprobado en el commit `5993b02`: https://github.com/Helioven/helio-gastro/actions/runs/41026116744.
- Sin cambios en `data/places.json`, precios, cartas originales ni rama `main`. Permanecen pendientes otras condiciones dinámicas y la revisión lingüística/editorial global; PASS técnico no implica publicación.

### QA francés — encabezados de menús cerrados oficiales (30/10/2026)

- Se incorporaron propuestas FR QA para «Platos a elegir», «Postre a elegir» y «Bebidas incluidas (una a elegir)», junto con sus equivalentes ingleses, en `i18n.js`; commit `952b6d0`.
- **GitHub Actions #523 SUCCESS**, confirmado sobre `952b6d0`: https://github.com/Helioven/helio-gastro/actions/runs/41026949273.
- Se conserva la restricción `?qa_fr=1`; sin cambios en cartas originales, precios, `data/places.json` ni `main`. Pendientes: notas y condiciones particulares de menús, inventario de cadenas restantes y QA lingüístico/visual final.

### QA francés — aviso de vigencia de menús cerrados (30/10/2026)

- Traducción FR QA contextual del aviso «Vigencia pendiente de confirmar» → «Validité à confirmer» junto a importes de menús oficiales, sin alterar nombres, cantidades ni precios; commit `52e208e`.
- **GitHub Actions #525 SUCCESS**, comprobado sobre `52e208e`: https://github.com/Helioven/helio-gastro/actions/runs/41027470966.
- Exclusivo de `?qa_fr=1` en `feature/fr-integration-qa-20261027`. Sin cambios en `data/places.json`, las cartas originales ni `main`. Pendientes inventario de condiciones particulares y QA lingüístico/visual integral.

### Inventario de condiciones FR QA — script de auditoría (30/10/2026)

- Se incorpora el script de solo lectura `scripts/inventory-fr-group-menu-notes.mjs` para inventariar condiciones de menús de grupo y campos ES/EN; commit `b6c0003`.
- **GitHub Actions #527 SUCCESS** sobre `b6c0003`: https://github.com/Helioven/helio-gastro/actions/runs/41027982787.
- La validación de Actions no implica que el inventario haya sido ejecutado ni que sus resultados estén revisados; queda pendiente ejecutarlo y seleccionar los próximos lotes FR. Sin modificación de `data/places.json`, precios, cartas originales ni `main`.

### Inventario ejecutado de condiciones de menús de grupo — #529 (30/10/2026)

- El workflow de la rama QA ejecuta `scripts/inventory-fr-group-menu-notes.mjs` y publica el archivo `fr-group-menu-notes.json` en el artefacto `group-menu-conditions-inventory` (cambio `e7f07a2`).
- **GitHub Actions #529 SUCCESS**, commit `e7f07a2`: https://github.com/Helioven/helio-gastro/actions/runs/41028567844. `catalog-audit` y `visual-qa` finalizaron correctamente.
- Artefacto: https://github.com/Helioven/helio-gastro/actions/runs/41028567844/artifacts/12964413723. El resultado del inventario debe leerse antes de contar condiciones pendientes o traducirlas; el éxito de CI solo valida su ejecución.
- Sin cambios en cartas originales, `data/places.json`, precios ni `main`. El francés sigue exclusivo de `?qa_fr=1`.

### QA francés — condiciones Campos y Moriles (#531) (30/10/2026)

- Tres traducciones FR QA candidatas de condiciones documentadas de Bodegas Campos y los menús Moriles; commit `28c5e3b`. Se conserva la fecha histórica 30/11/2024 y la distinción entre vigencia confirmada y pendiente de comprobar.
- **GitHub Actions #531 SUCCESS** sobre `28c5e3b`: https://github.com/Helioven/helio-gastro/actions/runs/41029301719.
- No se modificaron `data/places.json`, las cartas, los precios ni `main`. Pendientes restantes condiciones del inventario y QA lingüístico/editorial integral.

### QA francés — condiciones La Taberna del Río (#533) (30/10/2026)

- Traducción FR QA de la condición común de seis menús de grupo de La Taberna del Río (mínimo 8 personas, platos compartidos para 4, bebidas incluidas y aviso de alergias con 48 horas); commit `f251019`.
- **GitHub Actions #533 SUCCESS**, verificado en el commit `f251019`: https://github.com/Helioven/helio-gastro/actions/runs/41029893708.
- No se modificaron el catálogo, las cartas originales, los precios ni `main`; francés restringido a `?qa_fr=1`. Próximo lote previsto: condiciones verificadas de Bodegas Campos. PASS automatizado no implica aprobación editorial.

### QA francés — condiciones Bodegas Campos (#535) (30/10/2026)

- Incorporadas propuestas FR QA para condiciones documentadas de los menús Los Flamencos, Los Patios y La Bodega de Bodegas Campos, preservando diferencias de bebidas, IVA, inclusiones y exclusiones y el precio adicional publicado de 8 € por copa no prémium; commit `57fc33d`.
- **GitHub Actions #535 SUCCESS**, verificado sobre `57fc33d`: https://github.com/Helioven/helio-gastro/actions/runs/41030715621.
- El PASS técnico no implica aprobación lingüística/editorial final. No se modificaron `data/places.json`, cartas, precios ni `main`; francés exclusivamente con `?qa_fr=1`. Próximo trabajo: restantes condiciones verificadas del inventario y QA integral.

### QA francés — Patio Romano, primer lote (#537) (30/10/2026)

- Traducción FR QA de condiciones del menú de 38 € de Patio Romano (entrantes para compartir, bebidas y mínimo de comensales no especificado), commit `559acf2`.
- **GitHub Actions #537 SUCCESS**, confirmado sobre `559acf2`: https://github.com/Helioven/helio-gastro/actions/runs/41031441225.
- Quedan tres condiciones de menús de 48 € pendientes de lote FR. No se modificaron precios, cartas originales, `data/places.json` ni `main`. Traducción experimental exclusiva de `?qa_fr=1`. PASS técnico no implica validación lingüística/editorial final.

### QA francés — Patio Romano, condiciones completas (#539) (30/10/2026)

- Incorporadas las tres condiciones pendientes de menús de 48 € de Patio Romano en `i18n.js`, preservando diferencias de platos, bebidas, IVA y ausencia de mínimo de comensales especificado; commit `c8b44e6`. Junto al lote previo de 38 €, las cuatro condiciones inventariadas tienen propuesta FR QA.
- **GitHub Actions #539 SUCCESS**, comprobado sobre `c8b44e6`: https://github.com/Helioven/helio-gastro/actions/runs/41032138961.
- Sin modificación de `data/places.json`, cartas originales, precios ni `main`. Francés experimental limitado a `?qa_fr=1`; siguen pendientes validación lingüística/editorial y restantes condiciones del inventario.

### QA francés — avisos Casa Rubio y La Piscatoría (#541) (30/10/2026)

- Incorporadas propuestas FR QA para avisos históricos de carta, IVA y alérgenos de Casa Rubio y opciones de pan/suplementos de La Piscatoría, conservando precios y fechas; commit `4f27c34`.
- **GitHub Actions #541 SUCCESS**, confirmado sobre `4f27c34`: https://github.com/Helioven/helio-gastro/actions/runs/41033004369.
- Francés restringido a `?qa_fr=1`. Sin cambios en `data/places.json`, cartas originales, precios ni `main`. Pendiente revisión de avisos restantes y QA lingüístico y visual final; PASS técnico no constituye aprobación editorial.

### QA francés — aviso bilingüe de Roldán (#544) (30/10/2026)

- Traducción FR QA del aviso de la carta general de Roldán con distinción expresa de la carta y ficha de Roldán Centro. Ajuste de la ruta de presentación de avisos bilingües; commits `6574252` y `be28cae`.
- **GitHub Actions #544 SUCCESS**, comprobado sobre `be28cae`: https://github.com/Helioven/helio-gastro/actions/runs/41033767377.
- Sin modificación de `data/places.json`, cartas originales, precios ni `main`; francés exclusivo de `?qa_fr=1`. Restan revisión del inventario y QA lingüístico/visual final; PASS técnico no equivale a aprobación editorial.

### QA francés — regresión Casa Rubio (#547 → #548) (30/10/2026)

- **#547 FAILURE** en `visual-qa`: la prueba `scripts/test-fr-detail-notices-pilot.mjs` esperaba el selector `[data-bilingual-es]` en el aviso de Casa Rubio, ausente en el elemento real `.service-notice`; `catalog-audit` pasó. Incidencia en el selector de prueba, no regresión de datos demostrada. https://github.com/Helioven/helio-gastro/actions/runs/41034476549.
- Selector de prueba corregido en commit `fe6b084` para comprobar `.service-notice`; **#548 SUCCESS** sobre ese commit: https://github.com/Helioven/helio-gastro/actions/runs/41034986214.
- El cambio previo de renderizado FR QA de avisos bilingües (`658aa44`) se mantiene. Sin cambios en el catálogo, precios, cartas originales ni `main`. La revisión editorial/lingüística general sigue pendiente.

### QA francés — regresión histórica Casa Rubio (#550) (30/10/2026)

- Ampliada la prueba de navegador `scripts/test-fr-detail-notices-pilot.mjs` para verificar cambios FR → ES → FR → EN y preservación de la referencia de octubre de 2025 en los avisos históricos de Casa Rubio; commit `8b7871c`.
- **GitHub Actions #550 SUCCESS** confirmado sobre `8b7871c`: https://github.com/Helioven/helio-gastro/actions/runs/41035646688.
- No se modificaron cartas originales, precios, `data/places.json` ni `main`. Francés exclusivo de `?qa_fr=1`. El PASS automatizado no sustituye la revisión lingüística/editorial final.

### QA francés — acceso experimental protegido (#552) (30/10/2026)

- Ampliada la prueba de navegador en `scripts/test-fr-detail-notices-pilot.mjs` para comprobar en escritorio y móvil que `Français (QA)` no aparece sin `?qa_fr=1`; commit `42e9f69`.
- **GitHub Actions #552 SUCCESS**, confirmado sobre `42e9f69`: https://github.com/Helioven/helio-gastro/actions/runs/41036314128.
- Sin cambios en `data/places.json`, cartas originales, precios ni `main`. Continúan pendientes revisión lingüística/editorial integral y auditoría visual; PASS técnico no equivale a autorización de publicación.

### QA francés — selector oculto tras cambio a inglés (#554) (30/10/2026)

- Ampliada la prueba de navegador `scripts/test-fr-detail-notices-pilot.mjs` para verificar que en una visita sin `?qa_fr=1`, el selector de francés sigue ausente después de cambiar de ES a EN, en escritorio y móvil; commit `cf7fe8c`.
- **GitHub Actions #554 SUCCESS**, confirmado sobre `cf7fe8c`: https://github.com/Helioven/helio-gastro/actions/runs/41037003033.
- Sin cambios en `data/places.json`, las cartas originales, los precios ni `main`. Continúa pendiente QA lingüístico/editorial y visual integral del francés; éxito automatizado no implica publicación.


### Seguimiento QA francés — integración, triaje e interfaz (31/10/2026)

- **Inventario de condiciones de menús de grupo**: 48 entradas: 24 nombres protegidos, 19 traducciones literales candidatas, 5 dinámicas candidatas y **0 para revisión contextual**. Estas categorías describen cobertura del inventario, no aprobación editorial. Regresión dinámica de Beatillas/Roldán (escritorio, móvil y cambios de idioma) superada según confirmación del responsable; commits de integración `016daed` y `c0a5c1f`.
- **Triaje de textos visibles FR**: incorporado `scripts/inventory-fr-visible-text.mjs` e informe `qa-reports/fr-visible-text-triage.json` al workflow. Corregida una expresión regular inicialmente mal escapada y añadida comprobación interna; corregidos posteriormente selectores para aislar pantallas reales. Se registró fallo de workflow **#572** por saltos de línea literales, solucionado en `6c7bdbc`, con PASS posterior confirmado. El triaje es heurístico: sus coincidencias son **candidatos**, no defectos demostrados.
- El primer triaje mostró el aviso de favoritos en ocho capturas/vistas; traducción FR QA y regresión ES/EN/FR en `637d2e7` (**PASS confirmado**). Tras acotar la inspección por pantalla, el informe mostró únicamente el aviso de **múltiples direcciones de Roldán**, repetido en escritorio y móvil. Traducción FR QA y regresión en `911b1da` (**PASS confirmado**). La ausencia de nuevos candidatos en esas vistas no equivale a una auditoría lingüística completa.
- **Interfaz general francesa**, siempre limitada a `?qa_fr=1`: navegación rápida (Platos/Buscar/Favoritos/Comparar), `facc14b` (**PASS**); portada/hero, `47b03ac` (**PASS**); selector de momentos gastronómicos y advertencia sobre horarios pendientes de verificar, `85ba39b` (**PASS**); bloque introductorio de recomendaciones, incluyendo advertencia de que menor coste no significa mejor, `fe95ddc` (**PASS**). Las pruebas ampliadas verifican ida y vuelta ES/EN/FR en escritorio y móvil.
- **Incidencia de rendimiento CI**: la ejecución del cambio `fe95ddc` terminó en **PASS confirmado por el responsable**, pero el trabajo `visual-qa` tardó **más de 30 minutos**. La captura mostraba `Install browser QA dependencies` completado y `Start static server and run desktop/mobile browser QA` activo; no hay causa raíz demostrada. **Pendiente** medir tiempos por suite, investigar bloqueos/esperas de Playwright y optimizar sin reducir cobertura. No describir como prueba fallida.
- **Límites y pendientes**: no se modificaron `data/places.json`, cartas originales, precios ni la rama `main`. El francés continúa experimental y no autorizado para publicación; pendientes la revisión lingüística/editorial integral, comprobación visual general, auditoría y regresión final. La comprobación de los candidatos del inventario no sustituye estas fases.


### Cierre de sesión — diagnóstico y recuperación de visual-qa (#590–#595, 31/10/2026)

- La instrumentación inicial de duración por suite (`4fa4ccb`) mostró en **#590 FAIL** 35 suites y el inventario como FAIL con `0 s`, pese a consumir unos 29 minutos. **No eran mediciones válidas**: se usó `$SECONDS` en el shell del workflow. Sustituido por reloj de pared `date +%s` y añadidas anotaciones de fallos por suite (`bbff877`).
- El registro de #590 reveló un `locator.selectOption` de Playwright esperando 30 segundos por la opción `fr` ausente. Se detectaron errores de paréntesis en `i18n.js`: correcciones en `b5eaeee` y `e6075a8`. Se añadió al workflow una validación previa de sintaxis con `node --check` (`c57bf79`) para evitar que una sintaxis inválida genere decenas de esperas de navegador. **#593 FAIL** en el control rápido; tras la segunda corrección, el control sintáctico de #594 pasó.
- **#594 FAIL** en `visual-qa`: `scripts/test-fr-search-ui-pilot.mjs` esperaba `[data-dish="Flamenquín"]` durante 30 segundos; `app.js` reconstruye las sugerencias de platos al cargar, y los nuevos botones no conservan ese atributo. Se corrigió la prueba para esperar el catálogo y comprobar el botón renderizado por texto en `#dish-suggestions-list`, sin modificar la aplicación ni los datos (`b2d6800`).
- **#595 SUCCESS — PASS confirmado por el responsable**, commit `b2d6800`, duración global **3 min 44 s** según captura de GitHub Actions. El resultado valida el estado de esa ejecución, no el rendimiento sostenido en futuras ejecuciones. Las ejecuciones más antiguas #591 y #592 aún aparecían en curso en la última captura; sus resultados no deben confundirse con el estado del último commit.
- **Próximos pasos**: revisar la tabla real `Duración de pruebas visual-qa` de #595 para identificar suites lentas y confirmar tiempos distintos de cero; mantener la validación sintáctica temprana. Después retomar revisión de avisos generales, traducciones FR y QA editorial/visual integral según hoja de ruta, sin publicar el francés hasta aprobación.
- **Alcance preservado**: cambios solo en la rama `feature/fr-integration-qa-20261027`, sin tocar `main`, `data/places.json`, cartas ni precios; francés experimental exclusivamente con `?qa_fr=1`. No se ha realizado aprobación lingüística/editorial definitiva.

### Continuación QA FR — accesibilidad, buscador y recuperación de CI (#595–#620, 31/10/2026)

- **Rendimiento de #595:** 36 suites PASS; total medido por suites **183 s**, frente a **3 min 44 s** de duración global. La suite más lenta fue `test-fr-moriles-ribera-12.mjs` (14 s), seguida de La Cazuela (11 s) y La Bandera (9 s). Es una ejecución concreta, no una garantía de rendimiento sostenido; los tiempos por sí solos no identifican causas.
- **Inventario visual exploratorio:** incorporada detección de desbordamiento horizontal por vista, anchuras de documento/viewport y hasta diez elementos candidatos fuera de pantalla; ampliada la salida de CI. Cambios `d04494a`, `b716157`, `2cc778d` y corrección del patrón de espacios `f330da0`. El inventario no certifica defectos por sí solo.
- **Accesibilidad ES/EN/FR:** traducción de etiquetas `aria-label`/`title` para navegación, momento gastronómico, sugerencias, resultados, ficha, recomendaciones y mapa; regresiones en escritorio y móvil. Se completaron las traducciones inglesas y la comprobación de vuelta entre idiomas. Se tradujo también `Language / Idioma` como etiqueta accesible y visible `Langue` en francés. Últimos cambios de esta secuencia: `e88d246`, `e0705e3`; PASS comunicado por el responsable.
- **Buscador FR:** traducidos los placeholders de nombre de establecimiento y plato, la instrucción de búsqueda manual y las opciones de presupuesto/ordenación; pruebas de ida y vuelta FR → ES. Los lotes anteriores a las opciones de presupuesto tuvieron PASS comunicado por el responsable.
- **Incidente de regresión de presupuesto (#618–#620):** `app.js` reconstruye dinámicamente `#budget` con `Sin límite`, mientras que la opción inicial del HTML usa `Sin límite (mostrar fichas)`. La prueba introducida esperaba valores incompatibles con esos momentos de renderizado: se observó primero en ES `actual: Sin límite` frente a `expected: Sin límite (mostrar fichas)` y después en FR `actual: Sans limite (afficher les fiches)` frente a `expected: Sans limite`. Se añadió la traducción `Sin límite → Sans limite` (`11dafb6`) y se corrigieron expectativas del test (`03fa60c`, `e4c326c`). **#618 FAIL y #619 FAIL; #620 SUCCESS**, commit `e4c326c`, **3 min 42 s**, según captura del responsable. No atribuir a esos FAIL una regresión del catálogo ni considerar todas las variantes visuales auditadas.
- **Lección QA:** verificar el DOM efectivo y el instante de actualización antes de fijar aserciones de texto; distinguir contenido estático del HTML y opciones generadas por JavaScript. Evitar parches sucesivos sin leer el `actual/expected` del fallo.
- **Próximos pasos:** retomar QA lingüístico/editorial y visual real de fichas francesas (móvil y escritorio), revisando informes exploratorios y capturas antes de corregir defectos; completar regresiones y aprobación editorial antes de publicar. No continuar ampliando el selector de presupuesto sin hallazgos nuevos.
- **Límites:** todo este trabajo sigue en `feature/fr-integration-qa-20261027`; no se modificaron `main`, `data/places.json`, cartas originales ni precios. Francés experimental solo bajo `?qa_fr=1`, sin aprobación para publicación.

### Seguimiento de fichas francesas — QA visual y avisos (#623–#625, 31/10/2026)

- Se incorporaron ocho capturas de La Montillana, Rincón de Beatillas, Casa Rubio y Roldán, para escritorio y móvil, al inventario de QA exploratorio (`86460af`); su ejecución fue **PASS confirmado por el responsable**. Las capturas requieren inspección editorial independiente: el PASS del workflow no certifica la ausencia de textos españoles ni la calidad lingüística.
- Correcciones de interfaz en la rama experimental: `☆ Guardar` → `☆ Enregistrer`, `★ Guardado` → `★ Enregistré`, `📍 Ver mapa` → `📍 Voir la carte` (`3da44dd`). Se incorporó la traducción francesa del encabezado de ubicaciones y del aviso de alcance de carta de Roldán (`16b45ba`), con cobertura de escritorio/móvil (`c4e5e77`).
- **Resultados comunicados por el responsable:** **#623 PASS** (3:22), **#624 FAIL** (2:50), **#625 PASS** (2:53, commit `c4e5e77`). El FAIL intermedio no equivale a fallo de la última revisión; no se dispone aquí del log para atribuirle causa concreta.
- **Beatillas:** el aviso de precios históricos de menús completos (publicados en 2025, sin confirmación para 2026) ya tenía traducción francesa en `i18n.js`. No se duplicó ni se modificaron cifras o condiciones. Se amplió la regresión para comprobar su presencia y la ida y vuelta FR → ES → EN → FR en escritorio y móvil (`f23040f`). **CI de esta ampliación PASS confirmado posteriormente por el responsable**; no considerar resuelta toda la revisión visual/editorial de Beatillas.
- **Límites:** sin cambios en `main`, `data/places.json`, platos, importes ni disponibilidad. El francés sigue detrás de `?qa_fr=1` y no está autorizado para publicación.

### Inventario FR — avisos de fichas y menús (31/10/2026)

- Revisión del inventario exploratorio `scripts/inventory-fr-visible-text.mjs`: se permitieron como candidatos de revisión las notas y advertencias `.note`/`.service-notice` dentro de tarjetas de menú, que antes quedaban excluidas junto con los títulos de platos. Los nombres tradicionales y los elementos marcados para conservar el español siguen protegidos. Commit `dc97c45`.
- Se añadieron al detector indicios específicos de español en avisos de precios históricos y vigencia (`precios históricos`, `vigencia pendiente`, `consultar vigencia`) para localizar posibles textos sin traducir, sin declararlos automáticamente defectos. Commit `8e62f02`.
- **Estado:** cambios de instrumentación guardados; ejecución CI pendiente. La ausencia de candidatos no equivale a aprobación lingüística y las capturas siguen requiriendo inspección manual. Sin modificaciones de `main`, catálogo, cartas o precios.

### Cierre de lote — etiquetas de ubicaciones de Roldán en francés (31/10/2026)

- Se detectó que en el listado de ubicaciones de Roldán persistían los tipos de establecimiento en español: `Panadería:` y `Cafetería:`.
- Se incorporaron traducciones acotadas a la ficha francesa: `Panadería:` → `Boulangerie :` y `Cafetería:` → `Café :` (`i18n.js`, commit `d6a8237`). Se mantienen intactos los nombres, direcciones y datos originales de cada ubicación.
- Se amplió `scripts/test-fr-detail-shell-pilot.mjs` para comprobar los rótulos renderizados en francés en escritorio y móvil (commit `d02003d`). **PASS confirmado por el responsable**; no se documenta número de ejecución ni duración porque no se aportaron.
- La ampliación anterior del inventario de notas y avisos de menús también tuvo **PASS confirmado por el responsable**; sigue siendo un detector exploratorio, no una certificación lingüística.
- **Siguiente paso:** revisar candidatos reales del inventario y las capturas de fichas antes de nuevas correcciones, manteniendo los nombres gastronómicos originales y la revisión editorial pendiente.
- **Alcance:** exclusivamente rama `feature/fr-integration-qa-20261027`; sin cambios en `main`, `data/places.json`, cartas ni precios. Francés experimental bajo `?qa_fr=1`.


### Continuidad QA francés — 2 de noviembre de 2026

**Alcance y estado.** Todo este trabajo continúa exclusivamente en `feature/fr-integration-qa-20261027`, con el francés experimental habilitado mediante `?qa_fr=1`; no se ha fusionado a `main`, ni modificado `data/places.json`, cartas, ingredientes o precios. Los PASS de CI son validaciones técnicas, **no una aprobación editorial ni autorización de publicación**.

**Lotes realizados y verificados:**

- Regresión de aviso general de Rincón de Beatillas, con restauración entre FR/ES/EN/FR. Correcciones y prueba culminadas en `d745a0c`; PASS confirmado por el responsable.
- Formatos de precio: traducción de rótulos simples (`920e921`), prueba (`7d89718`), corrección del orden de traducción dentro de tarjetas (`9eb5b26`) y regresión estabilizada (`132796f`, CI #646 SUCCESS). Se respeta `tapa` y se conservan los nombres gastronómicos.
- Formatos compuestos, pesos y calificadores de 2024: `d715566` y prueba `cb28906`; CI #647 y #648 SUCCESS.
- Inventario exploratorio de textos visibles, fuentes y capturas en escritorio/móvil: `e26e2a0`, `4c08b96`; CI #649 y #650 SUCCESS. Las siete etiquetas detectadas inicialmente en cuatro fichas se tradujeron mediante `636d54d` y se cubrieron con prueba `291730e`; CI #651 y #652 SUCCESS, sin candidatos de fuente en esas cuatro fichas en la ejecución #652.
- Barrido exploratorio del catálogo completo: `2bcb4b2` y `15bd9b0`; CI #653 y #654 SUCCESS. El log de #654 registra **43 fichas inspeccionadas por perfil** (escritorio y móvil), **39 fichas con candidatos** (principalmente etiquetas de fuentes y algunos avisos). No equivale a 39 defectos confirmados: títulos propios y denominaciones originales requieren criterio editorial.
- Avisos de precios no verificados: Taberna Salinas, El Poema de Gran Capitán y Casa El Pisto, con matices históricos de 2024/2026 y fechas de octubre de 2026. Traducciones `d1585c2`, `84052be`; pruebas `c75eaaa`, `8e3cb96`; CI #655 y #656 SUCCESS. La ejecución #659 falló por una aserción de *placeholder* de búsqueda ajena a El Pisto. Se corrigió el test para admitir ejemplos gastronómicos dinámicos (`8d69f98`), y CI #660 SUCCESS.
- Primer lote del barrido de etiquetas de fuentes en otras fichas: **10 etiquetas** de Salinas, Bodegas Mezquita, El Poema y otras fichas, preservando fuentes, enlaces, fechas y advertencias (`c836631`); prueba ES/FR y URL en Salinas (`effb2d3`). **CI #661 y #662 SUCCESS** (verificado en GitHub el 2/11/2026). Son los últimos commits de código revisados para este cierre.

**Pruebas y riesgos:** Los controles automáticos abarcan vistas y transiciones específicas, no una revisión lingüística humana exhaustiva. Las capturas del inventario son evidencia para inspección manual. El barrido de 43 fichas es heurístico y sus resultados requieren clasificación. Mantener avisos sobre precios históricos/no confirmados, formatos (tapa, media ración, ración, unidad), cantidades, local exacto y atribuciones de fuente. No publicar cartas parciales ni el francés sin autorización.

**Próximo paso al retomar:** (1) leer este README actualizado y los scripts reales; (2) repetir el barrido de 43 fichas tras `effb2d3` y consultar `FR CATALOG SWEEP` de CI para conocer candidatos restantes; (3) priorizar avisos relevantes y grupos pequeños de etiquetas de fuentes, sin traducciones masivas a ciegas; (4) añadir pruebas de regresión ES/EN/FR y ejecutar CI; (5) documentar resultados y efectuar revisión editorial/visual integral antes de considerar el francés cerrado. El inventario debe interpretarse como un detector, no como aprobación. **No cambiar de fase de hoja de ruta ni fusionar a `main` sin confirmación.**


### Seguimiento FR CATALOG SWEEP — 2 de noviembre de 2026 (CI #663–#697)

- **Alcance inalterado:** trabajo solo en `feature/fr-integration-qa-20261027`, francés experimental bajo `?qa_fr=1`. No se ha fusionado a `main` ni alterado `data/places.json`, cartas, platos, formatos o precios. PASS técnico no equivale a aprobación editorial.
- **Inventario heurístico:** 43 fichas inspeccionadas por perfil (escritorio y móvil). Fichas con candidatos: 39 (#654), 32 (#662), 28 (#667), 24 (#675), 20 (#680), 18 (#682), 16 (#684), 15 (#686), 13 (#688), 10 (#690), 7 (#692), 6 (#694) y **5 (#696)**. Los conteos son de posibles textos pendientes, no defectos confirmados.
- **Lotes de fuentes con regresión SUCCESS:** Plateros San Francisco/La Viuda/Casa Bravo (#665, `4fcfa70`); Sociedad Plateros y El Nº 10 (#667, `40aeef4`); El Nº 10 y El Churrasco (#670, `7b98bc1`); Don Pepe Centro (#672, `ed1b1e5`); Patio Romano (#675, `0b32915`); El Abuelo/La Piscatoria (#678, `f998c73`); La Cazuela/Taberna del Río (#680, `9c9eabf`); Puerta Sevilla/Posada del Caballo Andaluz (#682, `7d1ccef`); Bodegas Campos/Casa Pepe de la Judería (#684, `8620c0d`); Casa El Pisto (#686, `26db4c8`); Bar Moriles Original/D'Tapas COVAP (#688, `c0dcf95`); La Jineta/La Bandera/Con Acento (#690, `179ae0a`); El Burlaero/La Sal/Museo Manolete (#692, `1c65e55`); Ágora Mezquita (#694, `245dfc6`); Churros Bar Marta (#696, `2038cfc`). Las pruebas cubren etiquetas y URL de las fichas seleccionadas, con cambios ES/EN/FR en escritorio y móvil. Los FAIL intermedios #669, #674, #679 y #685 se corrigieron en ejecuciones posteriores SUCCESS; no deben atribuirse al último estado.
- **Don Pepe Ciudad Jardín:** cuatro etiquetas traducidas en `8a1ad0b`, con **GitHub Actions #697 SUCCESS** verificado. Se mantiene separado de Don Pepe Centro; Restaurant Guru figura como referencia externa publicada por usuarios, con vigencia sin confirmar. **Pendiente** la regresión específica de estas etiquetas (ES/EN/FR, escritorio/móvil y conservación de enlaces): dos intentos de modificar `scripts/test-fr-detail-shell-pilot.mjs` fueron bloqueados y se comprobó que no contiene el caso. #697 PASS no demuestra esa regresión particular.
- **Candidatos del último barrido verificado (#696, anterior a #697):** Moriles Ribera, Moriles Casa Fina, Don Pepe Ciudad Jardín, Pastelerías Roldán Centro y La Tarterie Centro. No afirmar aún un nuevo conteo posterior a #697. Proteger denominaciones tradicionales y sedes independientes, fechas y procedencia documental, precios de barra/mesa, disponibilidad no confirmada y advertencias sobre rangos de producto y alérgenos.
- **Continuación:** completar primero el test específico de Don Pepe Ciudad Jardín y su CI; consultar de nuevo `FR CATALOG SWEEP`; resolver los demás candidatos en lotes pequeños con pruebas de regresión y revisión visual/editorial. El detector no acredita calidad lingüística definitiva. No publicar francés ni cambiar de fase sin autorización expresa.


### Seguimiento FR QA — 3 de noviembre de 2026 (fuentes, inventario y avisos)

- **Rama y alcance:** actividad exclusivamente en `feature/fr-integration-qa-20261027`. Francés visible solo bajo `?qa_fr=1`. No se han modificado `main`, `data/places.json`, platos, ingredientes, formatos ni precios. Los PASS automatizados **no** suponen aprobación lingüística/editorial ni autorización de publicación.
- **Inventario de fuentes documentales y presentación francesa:** se completaron lotes pequeños de etiquetas en Don Pepe Ciudad Jardín, Moriles Ribera, Moriles Casa Fina, La Tarterie Centro y Pastelerías Roldán Centro, con pruebas de ida y vuelta ES/EN/FR, enlaces y perfiles de escritorio/móvil. Se amplió el inventario `scripts/inventory-fr-visible-text.mjs` y el resumen de `FR CATALOG SWEEP` en Actions; sus coincidencias son **candidatos heurísticos**, no defectos lingüísticos demostrados. Se añadieron regresiones sobre las **13 etiquetas** de Moriles Ribera (`a9722d5`, **CI #719 SUCCESS confirmado**) y las **8 etiquetas** de Moriles Casa Fina (`c708668`, PASS comunicado por el responsable), además de La Tarterie y Roldán Centro (PASS comunicados).
- **Cierre del lote de cuatro fichas:** la comprobación de presentación de **24 enlaces de fuentes** de La Tarterie Centro (1), Moriles Casa Fina (8), Moriles Ribera (13) y Pastelerías Roldán Centro (2) se incorporó en `cb4adc4` y ajustó en `0b4a35f`; PASS confirmado por el responsable. El resultado es técnico y específico de las etiquetas/URL, no revisión visual integral.
- **Regresión de fuentes del catálogo ordinario:** comprobación del mapa de traducciones frente a **44 registros / 107 enlaces**: **104 enlaces de 43 fichas** cuentan con correspondencia francesa; las otras **3 referencias** corresponden a **El Caballo Rojo**, que conserva su excepción de cierre temporal y no se incluyó en la regresión. Se añadió control de navegador para los 43 registros (escritorio y móvil) en `646a29a`, ajustado en `a7b8734`; **PASS confirmado por el responsable**. Este conteo comprueba etiquetas, no todos los textos o la corrección estilística del francés.
- **Aviso de vigencia de Moriles Casa Fina (15,95 €):** se añadió prueba de preservación del importe y del aviso `Vigencia pendiente de confirmar` / `Validité à confirmer` en `scripts/test-fr-detail-notices-pilot.mjs`. Hubo **FAIL sucesivos** tras `581b89a`, `e03d69b` y `283c4eb`, sin evidencia de alteración del precio de catálogo: primero se usó un selector de texto visible que desaparecía al pasar a inglés; después el log mostró `15,95 €` (espacio inseparable) en FR/ES y `15,95 €` (espacio normal) en EN, que la comparación estricta consideraba distintos. El selector se fijó al atributo estable `data-set-menu-es` y la comparación de importe normaliza únicamente espacios en `e28e171`; **PASS final confirmado por el responsable**. No se han cambiado el precio, la advertencia original ni el renderizado de producción en ese arreglo.
- **Estado y siguientes controles:** mantener el triaje del `FR CATALOG SWEEP` y examinar las capturas/resultados actuales, los avisos generales, la integridad ES/EN/FR y la experiencia de móvil/escritorio. Revisar separadamente la situación documental de El Caballo Rojo, sin afirmar que sus fuentes estén aprobadas. Siguen pendientes la auditoría lingüística/editorial integral, QA visual y accesibilidad final, regresiones de cierre y autorización expresa antes de publicar o fusionar el francés. No cambiar la hoja de ruta ni las prioridades sin consultar.


### Traspaso para próximo chat — QA francés y revisión visual (03/11/2026)

**Punto de continuación recomendado: verificar la discrepancia de anchura en capturas de escritorio antes de cambiar CSS.** Este apartado es un traspaso operativo; consultar también `docs/qa-fr-editorial-review-2026-11-03.md`, que contiene la evidencia visual y el registro de las muestras lingüísticas.

**Repositorio y límites innegociables**
- Repositorio: `Helioven/helio-gastro`; trabajar **solo** en `feature/fr-integration-qa-20261027`, nunca en `main` sin autorización. Leer primero el README y los archivos reales de la rama.
- Francés **experimental**, visible únicamente con `index.html?qa_fr=1`. No publicarlo ni fusionar mientras falten aprobación editorial, control visual y regresión final.
- No modificar `data/places.json`, cartas, platos, ingredientes, precios, formatos, fuentes ni fechas sin evidencia y autorización editorial expresa; mantener separadas las sedes de un mismo negocio.
- Cambios pequeños y reversibles; CI GitHub Actions PASS confirmado antes de pasar al lote siguiente. No equiparar PASS técnico con aprobación de estilo o publicación.

**Lo completado y confirmado por el responsable**
- Regresión técnica de **104 etiquetas de enlaces de fuentes en 43 establecimientos ordinarios**; los otros **3 enlaces** corresponden a la excepción documental **El Caballo Rojo** (cierre temporal). El inventario recorre 44 establecimientos, pero informa de 43 ordinarios más la excepción.
- `FR CATALOG SWEEP` de la ejecución aportada: **0 candidatos heurísticos** de texto en 43 fichas ordinarias; **0 candidatos** de desbordamiento horizontal en los perfiles inventariados; igualmente **0 candidatos** en las vistas home, search, favorites, Montillana, Beatillas, Rubio y Roldán de escritorio/móvil. Estos ceros **no prueban revisión lingüística o visual completa**.
- Moriles Casa Fina, menú `Menú Tapas Cordobesas` de **15,95 €**: solucionada la fuga de `Vigencia pendiente de confirmar` al inglés (`Validity not confirmed`) y el fallo posterior de retorno al francés (`Validité à confirmer`) debido a rutas discrepantes del `MutationObserver`. Commits de arreglo `1dffc79` y regresión `fa1dd1c`; **PASS confirmado** por el responsable tras FAIL #737/#738. La prueba `scripts/test-fr-detail-notices-pilot.mjs` cubre vueltas sucesivas ES/EN/FR y visita inglesa pública; precio y catálogo intactos.
- Revisión **documental preliminar, no aprobación final** de La Montillana (30 descripciones), Moriles Ribera (13 etiquetas de fuentes), Moriles Casa Fina (8), La Tarterie (1) y Roldán Centro (2). Observaciones semánticas pendientes constan en `docs/qa-fr-editorial-review-2026-11-03.md`.
- Último commit de documentación visual previo a este traspaso: **`e72106b`**. No asumir que el nuevo commit de README o cualquier commit posterior tiene PASS si el responsable no lo ha confirmado.

**Evidencia del ZIP de GitHub Actions inspeccionada**
- Archivo facilitado en la conversación: `fr-visual-qa-desktop-mobile (3).zip`, artefacto `fr-visual-qa-desktop-mobile` del workflow. En un nuevo chat, volver a adjuntarlo si se necesitan sus imágenes; no asumir que estará montado automáticamente.
- Informe `fr-visual-qa.json` indicaba PASS, perfiles desktop (1365 × 900) y mobile (390 × 664 CSS px) y pruebas de idiomas; se inspeccionaron muestras y dimensiones de capturas, **no cada detalle lingüístico de todas las imágenes**.
- **Anomalía visual P2 provisional, NO defecto DOM confirmado:** **13 de 21** PNG franceses de escritorio `fullPage` superan la anchura nominal de **1365 px**. Ejemplos: La Cazuela de la Espartería **1895 px**, La Bandera **1845 px**, Rincón de las Beatillas **1755 px**, Taberna San Miguel · El Pisto **1625 px**; la zona principal se ve, pero aparece franja adicional a la derecha. El barrido previo de geometría (1280 px, secuencia distinta) informó 0 candidatos; por tanto, no atribuir causa raíz a CSS ni dar el problema por descartado.
- Se prepararon imágenes comparativas locales para la conversación anterior (`gastro-visual-top-samples.png`, `gastro-overflow-regions.png`), pero el registro persistente es el documento QA y el ZIP original; los enlaces locales podrían no conservarse entre chats.

**Siguiente tarea precisa (hacer primero)**
1. Consultar la rama y el documento QA actualizados. Identificar el script Playwright que genera las capturas `desktop-*-fr.png` afectadas y **replicar exactamente su viewport, secuencia de apertura y `fullPage`**. No sustituirlos por la prueba de 1280 px del inventario.
2. En La Cazuela, La Bandera y Beatillas, medir a **1365 × 900**: `window.innerWidth`, `document.documentElement.scrollWidth`, `document.body.scrollWidth`, `#detail-section.scrollWidth/clientWidth`, los límites `getBoundingClientRect()` de elementos relevantes y el ancho real de la captura. Comparar con escritorio 1280 px y móvil; registrar evidencia en el informe. La inspección debe distinguir expansión real, comportamiento de `fullPage` y elementos intencionadamente desplazables.
3. Solo si se reproduce un defecto funcional concreto, localizar **el elemento exacto**, proponer/implementar un cambio CSS mínimo y añadir regresión de las vistas afectadas ES/EN/FR en escritorio/móvil. Si no se reproduce, dejar la anomalía clasificada con sus límites y no aplicar parches cosméticos.
4. Solicitar/verificar PASS del nuevo CI. Después retomar revisión **visual y lingüística humana** de capturas, avisos, formatos, accesibilidad y muestras restantes; conservar la excepción de El Caballo Rojo y los criterios editoriales pendientes antes de cualquier autorización de publicación.

**Regla de estado:** indicar siempre qué pruebas están propuestas, ejecutadas, PASS o FAIL y cuáles dependen de verificación humana. La prioridad continúa siendo completar y validar cartas, terminar francés QA y después avanzar a auditoría integral según la hoja de ruta existente; no adelantar reseñas o nuevas fases.


---

## Handoff vigente — QA francés, pausa del 5 de noviembre de 2026

> **Punto de reanudación tras la sesión larga de QA del 05/11/2026.** Este bloque sustituye para el trabajo actual al handoff anterior de ese día y a los traspasos históricos; no reabrir tareas cerradas. Antes de cualquier edición, contrastar este README, [docs/qa-fr-editorial-review-2026-11-03.md](docs/qa-fr-editorial-review-2026-11-03.md), los archivos reales y el último CI de la rama.

**Repositorio:** `Helioven/helio-gastro`. **Única rama autorizada:** `feature/fr-integration-qa-20261027`. **No modificar/fusionar/desplegar/publicar `main` sin autorización expresa de Helio.** El francés continúa experimental solo mediante `index.html?qa_fr=1`; los lotes `translations/fr/` siguen siendo `candidate_awaiting_semantic_review`. La web pública no representa la copia QA.

### Situación consolidada antes de la pausa

- **Hoja de ruta sin cambios:** 1) verificar/completar cartas; 2) cerrar integración francesa; 3) auditoría integral y QA; 4) reseñas/comentarios; 5) resúmenes de reseñas reales; 6) imágenes autorizadas; 7) revisión final.
- **Cartas:** 43/44 registradas como cerradas. **El Caballo Rojo** sigue como excepción documental; no darla por resuelta.
- **Moriles Ribera:** cotejo documental de 214/214 entradas en 18 lotes reales FR 090–107 **cerrado**. Correcciones aprobadas aplicadas y regresadas; incluidos `vaca vieja`, `ibéricos`, `revueltos`, postres y rótulos de fuentes. No repetir cotejos ni crear lotes ficticios. Separar siempre Moriles Ribera y Moriles Casa Fina.
- **Moriles Casa Fina:** `Cafés et chocolats` se mantiene tras cotejo de carta oficial; no añadir `chauds` por estilo. **La Montillana:** descripción de postre Manolete contrastada con carta oficial, sin discrepancia semántica demostrada; naturalidad francófona aún pendiente.
- **Accesibilidad/visual anterior:** inventario FR de 24 escenarios (4 fichas × 3 idiomas × escritorio/iPhone13) con cero candidatos heurísticos, **no certificado WCAG**. Revisión humana previa de postres y `Cartes officielles` de Moriles Ribera con PASS visual limitado. El aparente exceso de anchura de 13 PNG de escritorio se explicó por viewports propios de sus suites, no por defecto CSS confirmado.
- **Artefacto de trabajo:** Helio aportó `fr-visual-qa-desktop-mobile (5).zip` (aprox. 400 MB). En la sesión se inventariaron **86 PNG y 33 JSON**, y se inspeccionaron muestras selectivas de escritorio y móvil, no las 86 capturas exhaustivamente. Los informes automáticos indicaban PASS/cero candidatos dentro de su alcance. Reutilizar ese artefacto cuando esté disponible; solicitarlo de nuevo solo si no es accesible. **Las capturas son anteriores a las correcciones de esta sesión** y no acreditan visualmente el último commit.

### Incidencias de internacionalización resueltas en esta sesión

Las cuatro incidencias se confirmaron a partir de muestras visuales y del código real; Helio aprobó expresamente las traducciones propuestas. **Cierre técnico con PASS de CI, no aprobación lingüística nativa ni de publicación.**

| ID | Problema y cambio mínimo en QA | Commits relevantes | Estado |
|---|---|---|---|
| `QA-FR-VIS-01` | `Nuestro criterio` y pie seguían en ES; traducciones FR en `i18n.js` y aserciones FR→EN→ES en `scripts/test-fr-visual.mjs` | `0226204`, `8c0b097`, `97bbcf5` | Cerrada técnicamente; Helio confirmó PASS #846–#848 |
| `QA-FR-VIS-02` | Advertencia dinámica de cartas generales para Comer/Cenar sin FR; dos frases aprobadas y regresión en `scripts/test-fr-search-ui-pilot.mjs` | `ed80d0f`, `9a02450` | Cerrada técnicamente; Helio confirmó PASS #850 |
| `QA-FR-VIS-03` | Encabezado, contador singular/plural y estado vacío de favoritos sin FR | `0bf8a71`, `e5ea00f` | Cerrada técnicamente; última suite #853 PASS comunicado |
| `QA-FR-VIS-04` | `Cualquier formato`, `Nombre`, y notas de rango/tamaños/opciones de La Tarterie seguían en ES; traducción de presentación sin alterar tamaños, opciones ni importes | `0bf8a71`, `e5ea00f`, `4904eca` | Cerrada técnicamente; Helio confirmó PASS #853 |

**CI de cierre:** al consultarlo, GitHub Actions mostraba `#849–#853` como `completed/success` en la rama QA. Helio **confirmó expresamente PASS de #853**, correspondiente a `4904eca5de8493f06280f3d74e4fcdb6a02bb79b`, último commit de código/pruebas al preparar este handoff. Distinguir esta verificación de la ejecución nueva que provocará la actualización documental del README: **no presumir su PASS hasta comprobarla**. Los fallos históricos #837–#839 de expectativas antiguas quedaron resueltos previamente: no reabrirlos.

**Archivos modificados en las correcciones:** `i18n.js`, `scripts/test-fr-visual.mjs`, `scripts/test-fr-search-ui-pilot.mjs` y `scripts/test-fr-la-tarterie-28.mjs`. **No se modificaron** `data/places.json`, precios, ingredientes, fuentes, lotes FR, ES/EN ni `main`.

### Pendientes reales al reanudar

1. **Inspección visual humana selectiva restante:** continuar desde las muestras ya vistas del ZIP, centrando escritorio/móvil en regiones no inspeccionadas, textos largos, avisos, favoritos, filtros y navegación. Como las capturas preceden a las correcciones, comprobar específicamente el aspecto final de los textos arreglados con evidencia nueva si se requiere PASS visual post-fix. No inferir defectos por un texto español legítimamente protegido como nombre de plato.
2. **Revisión lingüística editorial:** contraste selectivo de naturalidad gastronómica y nombres tradicionales, incluyendo Manolete, flamenquín, mazamorra, salmorejo y torrija; seis muestras preliminares de La Montillana revisadas sin contradicción semántica demostrada ni cambios. **No hay validación por francófono competente/nativo acreditada**. Conservar candidatos FR y pedir autorización antes de cualquier texto editorial nuevo.
3. **Matriz final de regresiones ES/EN/FR:** consolidar ejecuciones de Actions, alcance de pruebas, inspecciones visuales parciales, controles de accesibilidad y limitaciones. No repetir suites ni abrir defectos de CSS sin reproducción.
4. **Puerta editorial de publicación:** mantener FR desactivado para público; documentar pendientes y resolverlos antes de solicitar autorización expresa. El Caballo Rojo conserva su excepción documental. Solo después proceder a la auditoría integral según hoja de ruta.

### Método obligatorio

**Verificar → proponer con evidencia → aprobación de Helio → cambio mínimo en la rama QA → regresiones y CI → documentación.** Distinguir prueba propuesta, ejecutada, PASS directo, PASS comunicado, revisión visual y validación lingüística. No hacer commits cosméticos, ni alterar `main`, catálogo, importes, ingredientes, formatos o URL sin autorización y fundamento.

**Punto de arranque concreto tras el descanso:** comprobar el PASS del commit documental de este README, después continuar la inspección selectiva visual pendiente y consolidar resultados. No reabrir las incidencias VIS-01 a VIS-04 sin evidencia nueva.


---

## Alcance de publicación Helio Gastro 1.0 — decisión de Helio (27/10/2026)

**Objetivo:** no publicar como producto terminado hasta completar y validar el alcance funcional y visual previsto. Esta sección concreta la hoja de ruta existente; no significa que estas funciones estén ya implementadas ni autoriza desplegarlas automáticamente.

1. **Cartas y datos:** conservar el cierre editorial de 43/44 fichas. El Caballo Rojo sigue como excepción por cierre temporal comunicado; no presentarlo como abierto sin verificar. Corregir cartas cerradas solo por incidencia, evidencia nueva o aprobación de Helio.
2. **Francés y QA incremental:** completar ES/EN/FR por lotes, con revisión contextual y pruebas. Primero superar la regresión acordada en la rama `feature/fr-integration-qa-20261027` (buscador, filtros, comparador, fichas, navegación, escritorio/móvil, con y sin `?qa_fr=1`). No fusionar ni activar francés públicamente antes de validación.
3. **Horarios de todos los establecimientos:** documentar horarios generales, días de cierre y, solo cuando haya fuente, horarios específicos de cocina/desayuno/otros servicios. Guardar fuente y fecha de comprobación, distinguir horarios desconocidos, excepciones y cierres temporales. No deducir «abierto ahora» de horarios no verificados o desactualizados.
4. **Reseñas y «El consejo de Manolo»:** diseñar resúmenes breves por restaurante a partir de opiniones reales obtenidas y utilizadas legítimamente; indicar procedencia, período/fecha y límites de representatividad. Separar elogios, críticas recurrentes y consejo editorial con humor, sin inventar experiencias, puntuaciones ni consenso. Si la evidencia es insuficiente, indicarlo. Comprobar licencias, atribución, condiciones de las plataformas y privacidad antes de importar reseñas externas.
5. **Buzón de comentarios y avisos:** permitir sugerir locales, informar de errores de precios/horarios y enviar mejoras. Definir almacenamiento, moderación, protección antispam, minimización de datos, aviso de privacidad y gestión de solicitudes. No publicar automáticamente aportaciones de usuarios. Decidir por separado si habrá reseñas públicas propias y cómo se moderarán.
6. **Acabado visual de app e imágenes generadas:** diseñar portada, categorías y fichas con una estética coherente y mobile-first, usando imágenes propias, generadas o con licencia adecuada. Señalizar las imágenes ilustrativas como tales; nunca presentarlas como fotografía real de un plato/local. Integrar discretamente **ManoloLabs by Helio** y el lema **«Ideas humanas · Tecnología inteligente»**, manteniendo el nombre Helio Gastro.
7. **QA integral y decisión de lanzamiento:** verificar integridad de datos, idiomas, búsqueda, filtros, comparador, favoritos, mapas, horarios, reseñas, buzón, accesibilidad, rendimiento, privacidad y seguridad en móvil y escritorio. Revisar incidencias y aprobar expresamente el despliegue final.

**Secuencia orientativa:** terminar francés y su regresión → completar horarios documentados → diseñar/implementar fuentes de reseñas, resúmenes y consejo → buzón con moderación → imágenes y pulido visual → QA integral y publicación. Se permiten pruebas de regresión en cada fase. Las rutas gastronómicas personalizadas y el mapa de terrazas con sombra siguen como ideas exploratorias, fuera del alcance comprometido de la 1.0.

**Criterio de cierre:** una función no se considera terminada por existir en código; requiere datos verificables cuando proceda, pruebas suficientes y aprobación visual/funcional de Helio. Si alguna fuente externa impide obtener reseñas u horarios fiables, registrar la limitación y decidir explícitamente una alternativa antes de publicar.


## Autorización posterior de piloto FR — 6 de noviembre de 2026

Helio autorizó expresamente activar el francés públicamente e integrarlo en `main`, conservando El Caballo Rojo oculto y las advertencias. Preparar el despliegue y sus regresiones en una rama de release antes de fusionar. Tras publicar el francés, proseguir con la fase 3 de auditoría integral; las mejoras automatizadas posteriores requieren su propia evaluación y autorización de alcance.


---

## Estado vigente — Francés público y fase 3 QA integral (06/11/2026)

> Este apartado actualiza los estados técnicos de publicación y pruebas de las secciones históricas de este README. **No cambia la hoja de ruta ni autoriza por sí mismo funcionalidades nuevas.**

### Francés público: integrado y desplegado

- **Autorización expresa de Helio:** activar el francés como idioma público de piloto, conservando los riesgos editoriales documentados y El Caballo Rojo oculto.
- **PR de publicación [#44](https://github.com/Helioven/helio-gastro/pull/44):** fusionado con `main` en el commit `ccfe52e75f6a30f61e73fa56b2670327c5334bf7`. Se preservaron las decisiones de alcance que solo estaban en `main`.
- **GitHub Pages [#542](https://github.com/Helioven/helio-gastro/actions/runs/42192390965):** `completed/success`; corresponde al commit `ccfe52e`.
- **Regresión posterior a la integración [#873](https://github.com/Helioven/helio-gastro/actions/runs/42192391624):** `completed/success`, incluidos los jobs `catalog-audit` y `visual-qa`.
- El selector público permite **ES/EN/FR**, sin exigir `?qa_fr=1`. El idioma seleccionado persiste tras la recarga; las regresiones de liberación ES/EN/FR finalizaron con PASS antes de fusionar ([#871](https://github.com/Helioven/helio-gastro/actions/runs/42191459707) y [#872](https://github.com/Helioven/helio-gastro/actions/runs/42191467906)).
- **El Caballo Rojo** continúa con `hidden: true` en el catálogo; la regresión de ocultación cubre búsqueda, resultados, favoritos y comparador, incluidos estados guardados. No se considera resuelta su carta ni se declara 44/44 fichas verificadas.
- **Alcance editorial:** 107 lotes y 1.232 descripciones FR con integridad técnica comprobada; revisión interna asistida por IA, **no certificación lingüística profesional**, y sin garantía de vigencia de cartas/alérgenos. Se conserva la observación de fuente de la mazamorra de D'Tapas COVAP. Véase [dictamen de piloto](docs/qa-fr-pilot-closure-decision-2026-11-06.md) e [informe de alérgenos](docs/qa-fr-allergen-review-2026-11-06.md). Los informes anteriores describen el estado histórico QA antes de la autorización; no deben interpretarse como prohibición actual de mostrar FR.

### Fase 3: auditoría integral en curso

- **Rama de trabajo:** `audit/integral-qa-20261106`; **PR [#45](https://github.com/Helioven/helio-gastro/pull/45)** abierto en **borrador**, sin fusionar a `main` en el momento de esta actualización.
- **Nueva prueba HG-QA-EXT-001:** `scripts/audit-external-links.mjs`. Valida en modo solo lectura la sintaxis y HTTPS de URLs de fuentes (`url`), menús (`sourceUrl`) y productos (`productUrl`), incluyendo registros anidados.
- **[CI #874](https://github.com/Helioven/helio-gastro/actions/runs/42192813470):** `completed/success`. El job `catalog-audit` registró **185 URL revisadas, 54 dominios, 44 establecimientos y 0 incidencias**; la suite `visual-qa` también concluyó correctamente. Esta comprobación **no hace peticiones a sitios externos** y, por tanto, no certifica que las páginas funcionen ni que sus precios y cartas estén vigentes.
- **Cobertura ya existente:** suites de búsqueda, filtros, comparador, fichas, navegación, favoritos, cambio de idioma, mapa por teclado y ocultación del local excluido. Inventarios visuales y de accesibilidad exploratorios; **no equivalen a certificación WCAG**.
- **Próximas prioridades QA, propuestas y no ejecutadas:** medir tiempo, cantidad y tamaño de solicitudes de los 107 lotes FR en móvil; revisar comportamiento de caché y recarga; ampliar controles de foco y avisos accesibles; inspeccionar carga de mapas y recursos externos; verificar fuentes y fechas sin asumir datos nuevos.
- **Límite de alcance:** no se incorporan todavía horarios no verificados, reseñas, buzón, resúmenes ni imágenes. Cualquier automatización funcional adicional debe evaluarse después de las dependencias de QA y recibir aprobación de Helio.

**Siguiente paso operativo:** revisar el PR #45 con su PASS y decidir su integración en `main`; continuar después con una medición reproducible de rendimiento, en una tanda pequeña y reversible. Distinguir siempre prueba propuesta, ejecutada, PASS y revisión humana pendiente.


---

## Estado vigente: fase 3 QA integral — 6 de noviembre de 2026

> Este bloque tiene prioridad sobre las referencias históricas a tareas pendientes de las secciones anteriores. Mantener las decisiones editoriales de alcance de la versión 1.0: no ampliar fases ni publicar datos parciales sin autorización.

### Estado de publicación y ramas

- **Francés público ES/EN/FR:** autorizado por Helio e integrado en `main` mediante [PR #44](https://github.com/Helioven/helio-gastro/pull/44); permanece la carga diferida de los 107 lotes de descripciones FR al seleccionar francés ([PR #47](https://github.com/Helioven/helio-gastro/pull/47)).
- **GitHub Pages:** [#547](https://github.com/Helioven/helio-gastro/actions/runs/42203305110) finalizó **PASS** para la versión anterior; tras la fusión de la PR #50, el despliegue [#548](https://github.com/Helioven/helio-gastro/actions) y la regresión de `main` #889 se activaron. **Comprobar su conclusión real en Actions**; no se considera completado el despliegue de la última integración mientras esté en curso.
- **Última fusión de alcance QA:** [PR #50](https://github.com/Helioven/helio-gastro/pull/50), **fusionada** en `main` en `cc93989fe359ef9eca93c0215d0fc47547ef0602`. Su rama de trabajo ya no es la fuente de verdad.
- **Catálogo:** 44 registros; **El Caballo Rojo** permanece `hidden: true`, de modo que 43 son visibles en la aplicación. No dar por verificadas todas las cartas ni inferir precios, ingredientes, alérgenos u horarios no documentados. Los 107 lotes FR y las 1.232 descripciones no equivalen a certificación lingüística profesional ni a vigencia de la fuente.

### Auditorías incorporadas y evidencia CI

| Entrega | Alcance probado | Evidencia |
|---|---|---|
| [PR #45](https://github.com/Helioven/helio-gastro/pull/45) · HG-QA-EXT-001 | Auditoría sintáctica de 185 URL HTTPS, 54 dominios, sin errores estructurales. **No comprueba enlaces vivos ni cartas actuales.** | [#874 PASS](https://github.com/Helioven/helio-gastro/actions/runs/42192813470) y [#876 PASS en segundo intento](https://github.com/Helioven/helio-gastro/actions/runs/42193878959); timeout intermitente en un test de filtro FR en el primer intento de #876 |
| [PR #46](https://github.com/Helioven/helio-gastro/pull/46) · HG-QA-PERF-001 | Línea base local: 107 solicitudes FR y 263.904 bytes de transferencia incluso en español; mediciones en escritorio y viewport móvil simulado. | [#878 PASS](https://github.com/Helioven/helio-gastro/actions/runs/42196222946) |
| [PR #47](https://github.com/Helioven/helio-gastro/pull/47) · carga diferida | **0** solicitudes de lotes FR en ES y EN, **107** tras elegir FR, sin descargas adicionales al volver a FR en la misma página; idioma persistente. | [#880 PASS](https://github.com/Helioven/helio-gastro/actions/runs/42198601384), [#881 PASS](https://github.com/Helioven/helio-gastro/actions/runs/42199574671) |
| [PR #48](https://github.com/Helioven/helio-gastro/pull/48) · HG-QA-CACHE-001 | Recargas ES/EN/FR, favoritos, modo de servicio, exclusión del local oculto e inventario informativo de cabeceras de caché; **sin modo offline certificado**. | #882 FAIL por variable `URL` que ocultaba el constructor nativo; corregida, [#883 PASS](https://github.com/Helioven/helio-gastro/actions/runs/42200960658) |
| [PR #49](https://github.com/Helioven/helio-gastro/pull/49) · HG-QA-A11Y-001 | Teclado, envío con Enter, foco de resultados y fichas, retorno de foco, etiquetas y regiones semánticas ES/EN/FR en escritorio/móvil simulado. | [#885 PASS](https://github.com/Helioven/helio-gastro/actions/runs/42202315846), [#886 PASS](https://github.com/Helioven/helio-gastro/actions/runs/42203305436) |
| [PR #50](https://github.com/Helioven/helio-gastro/pull/50) · HG-QA-A11Y-002 | Inventario de posibles contrastes y avisos dinámicos ES/EN/FR. #887 FAIL por exigir una búsqueda de La Montillana en modo Merienda; el test se corrigió para comprobar el aviso de Merienda y buscar el local bajo Comida. | [#888 PASS](https://github.com/Helioven/helio-gastro/actions/runs/42204755067) |

**Limitación crítica de la última auditoría:** en el CI #888 se evaluaron **14 selectores por perfil e idioma**, pero los **14 quedaron clasificados como no medibles** en cada una de las seis combinaciones (escritorio/móvil × ES/EN/FR), por fondos con degradados/transparencias y límites del algoritmo. El resultado PASS **solo certifica las aserciones estructurales del test**, **no** que el contraste sea conforme, ni que existan cero defectos de contraste. No afirmar certificación WCAG.

### Siguiente sesión: prioridades y criterios de aceptación

1. **Comprobar primero GitHub Actions:** estado exacto de regresión `main` #889 y Pages #548 tras fusionar PR #50. Corregir cualquier fallo real antes de avanzar.
2. **Auditoría de contraste con evidencia útil:** revisar `qa-reports/contrast-status-inventory.json` de #888, capturas y CSS. Refinar el cálculo para colores opacos sobre fondos sólidos sin declarar conformidad donde haya degradados/transparencia. Añadir comprobaciones manuales dirigidas de texto normal, texto pequeño, botones y estados de foco en móvil y escritorio, ES/EN/FR. Registrar defectos reproducibles y prioridad; corregir solo los confirmados.
3. **Avisos dinámicos y lectores de pantalla:** diseñar prueba manual con NVDA/VoiceOver para búsquedas, favoritos, errores y comparador; evitar confundir presencia de `aria-live` con anuncio audible confirmado.
4. **Regresión y documentación:** ejecutar CI completo tras cada cambio, documentar PASS/FAIL/pendiente, actualizar README y conservar El Caballo Rojo oculto; no modificar cartas, precios, traducciones, reseñas ni imágenes sin respaldo y autorización.

**Límites vigentes:** la PWA tiene un manifiesto, pero no se ha comprobado soporte offline mediante service worker; no añadir caché persistente para cartas/precios sin política de caducidad y validación. La fase 3 sigue **en curso**, no constituye lanzamiento final aprobado.


---

## Handoff vigente — renovación visual ManoloLabs y QA (7 de noviembre de 2026)

> **Fuente de verdad para reanudar la nueva fase visual.** Este apartado documenta el trabajo realizado en la rama `feature/manololabs-visual-20261107` y complementa —no sustituye— la fase 3 de QA integral descrita arriba. **No implica lanzamiento público ni aprobación para fusionar en `main`.** Revisar GitHub Actions y el HEAD real antes de continuar.

### Repositorio, alcance y control de versiones

- **Repositorio:** `Helioven/helio-gastro`. **Rama exclusiva de la renovación:** `feature/manololabs-visual-20261107`; `main` se mantiene sin estos cambios hasta autorización expresa de Helio.
- El primer agente Codex trabajó primero sobre una copia local del repositorio. Como la autenticación de Git desde Codex falla con `Cannot prompt because user interactivity has been disabled`, las subidas se realizan manualmente con **GitHub Desktop → Push origin**; no repetir intentos automáticos de credenciales ni compartir tokens.
- **Commits clave:**
  - `9ca9037`: prototipo de nueva presentación visual (portada/tarjetas, espacio para imágenes y firma discreta).
  - `e3b4b74`: piloto de cinco especialidades, imágenes ilustrativas y prueba de integración.
  - `57862da`: segunda tanda de ilustraciones y ampliación del mapeo de recursos.
  - `1f4c603`: sustitución final aprobada de `boquerones-fritos.webp` y `huevos-rotos.webp`, sin cambiar las otras trece imágenes.
  - `e39b1b0`: corrección de contadores dinámicos en francés, prueba `scripts/test-recommendation-count-i18n.mjs` e integración en workflow.
- Mantener fuera de commits los informes locales generados en `qa-reports/`, salvo petición expresa.

### Nueva interfaz e ilustraciones aprobadas

- Estilo de interfaz: **azul marino y acentos cálidos** de ManoloLabs, tarjetas con zona visual, etiqueta **«Imagen ilustrativa»** localizada en ES/EN/FR, carga diferida, reutilización por plato normalizado y marcador abstracto de respaldo cuando no hay imagen o falla su carga.
- Las ilustraciones son **representaciones generales generadas**, **no fotos de comida ofrecida por restaurantes concretos**. No inferir ingredientes, raciones, disponibilidad ni precios a partir de ellas.
- **15 imágenes aprobadas visualmente por Helio**, en `assets/dishes/`, formato WebP: **flamenquín cordobés, salmorejo, rabo de toro, berenjenas con miel, mazamorra, croquetas, tortilla de patatas, boquerones fritos, huevos rotos con jamón, hamburguesa, pizza, cachopo, ensaladilla rusa, nachos y tarta de queso**. Consultar `assets/dishes/README.md` para el mapeo y la ampliación.
- Las versiones definitivas del flamenquín (largo y artesanal, patatas fritas, lechuga y tomate), berenjenas en bastones con miel, boquerones (fritura fina, piel plateada visible y limón) y huevos rotos (patatas en bastones, yema mezclada y jamón en trocitos) fueron aprobadas tras varias iteraciones de revisión visual. **No regenerarlas ni reemplazarlas sin una nueva aprobación.**
- **Solo 7 de las 15 imágenes aparecen hoy en accesos generales existentes:** seis en «Comer» —flamenquín, salmorejo, rabo de toro, croquetas, mazamorra, berenjenas— y tortilla en «Cenar». Las otras ocho —boquerones, huevos rotos, hamburguesa, pizza, cachopo, ensaladilla rusa, nachos y tarta de queso— **están disponibles como assets**, pero no tienen tarjeta general visible; no inventar platos o asociaciones con restaurantes para forzar su aparición. Las categorías generales restantes conservan marcadores abstractos.

### Evidencia y límites de QA

- [GitHub Actions #891](https://github.com/Helioven/helio-gastro/actions/runs/42369802251): `completed/success` para `9ca9037`, **no** para las ampliaciones posteriores.
- [GitHub Actions #894](https://github.com/Helioven/helio-gastro/actions/runs/42376874403): `completed/success` para `1f4c603`, con la tanda final de las 15 ilustraciones.
- **Corrección FR `e39b1b0`:** al preparar este handoff, la ejecución manual **#895** estaba **en curso**; **comprobar su conclusión** en [Actions](https://github.com/Helioven/helio-gastro/actions) y no dar PASS hasta confirmarla. El CI previo #894 **no valida** esta corrección posterior.
- El agente reportó PASS **local** de contadores ES/EN/FR (singular, cero, cambios sin recarga, recarga y cambio de momento gastronómico), regresiones de búsqueda y resultados FR, ilustraciones, sintaxis y catálogo. Esto **no sustituye** el CI oficial.
- En la inspección visual se probaron recorridos de portada, tarjetas, resultados, favoritos, comparador, ficha y pie en **360×800, 390×844, 768×1024 y 1365×900**; no se detectó desbordamiento global en esos recorridos. Algunas capturas de tableta/escritorio se obtuvieron redimensionando una sesión cargada; no equivalen a validación exhaustiva por dispositivo.
- **Incidencia detectada:** en francés, la etiqueta de imagen sí traducía pero los contadores de tarjetas seguían en español. La corrección de `e39b1b0` distingue `répertoriés` y `vérifiés` sin alterar cifras y añade prueba de regresión; **pendiente corroborar CI #895**.
- **Todavía pendientes:** revisión visual humana exhaustiva de tarjetas (especialmente encuadre ajustado del flamenquín), fichas y comparadores largos, dispositivos reales, contraste con mediciones válidas, lector de pantalla y estados no inspeccionados. Un PASS automático no equivale a certificación WCAG ni a aprobación editorial completa.

### Identidad ManoloLabs by Helio aprobada conceptualmente

- Marca seleccionada: **ManoloLabs by Helio**, lema **«Ideas humanas · Tecnología inteligente»**. Paleta: azul marino `#0B2545`, naranja `#FF8A00`, amarillo `#FFC857`, azul `#3B82F6`, blanco cálido `#F5F5F4`; tipografía de referencia Poppins/Montserrat.
- **Mascota oficial actual:** robot 3D blanco y metálico con **dos antenas**, gafas oscuras cuadradas, bigote marrón, acentos luminosos azules y **M azul luminosa en el pecho**. El modelo antiguo del cartel tiene una sola antena y **no debe reutilizarse**; las imágenes oficiales de referencia están en la conversación con Helio y **deben proporcionarse al agente** para integrarlas. Los accesorios (gorro, taza, etc.) no son rasgos permanentes.
- El pie ya muestra una firma discreta «ManoloLabs by Helio», pero la cabecera aún contiene **«HELIO SOFTWARE STUDIOS»**. **Pendiente** actualizar logotipo, cabecera y variantes/favicons de forma coherente, manteniendo **Helio Gastro** como nombre de la aplicación. No afirmar que esta integración visual esté acabada.

### Próximos pasos acordados, sin autorización automática para ejecutarlos

1. **Cerrar CI de `e39b1b0` (#895)** y anotar PASS/FAIL real; si falla, investigar y reparar únicamente la incidencia demostrada en la rama.
2. **Revisión visual selectiva final** en móvil/escritorio de los contadores FR, tarjetas e imagen del flamenquín; no modificar datos a ciegas.
3. **Preparar propuesta de identidad ManoloLabs** con las referencias oficiales del Manolo de dos antenas; exigir aprobación visual de Helio antes de integrar. No reemplazar Helio Gastro como título.
4. **Evaluar uso visible de las ocho ilustraciones sin tarjeta** y mejora de marcadores de categorías, sin inventar platos ni ofertas de locales. Considerar la legibilidad del comparador largo, especialmente en móvil.
5. Mantener pendientes para fases posteriores **horarios con fuente**, **reseñas autorizadas y «El Consejo de Manolo»** (hasta 100–200 reseñas cuando sea legalmente posible, sin extracción masiva no autorizada de Google), buzón moderado y auditoría integral final. No inventar puntuaciones ni testimonios ni mezclar resúmenes editoriales con valoraciones de terceros.

**Regla de continuidad:** leer este handoff y el README previo, verificar HEAD y CI, proponer un cambio de alcance limitado, **obtener aprobación de Helio**, aplicar en rama de trabajo, pasar pruebas, documentar y **no fusionar/desplegar `main` sin autorización expresa**.

### Integración de Manolo aprobada — 7 de noviembre de 2026

- Helio Gastro conserva el título principal. La cabecera muestra la cabeza de Manolo con sus dos antenas y el pie incorpora el busto junto a **ManoloLabs by Helio** e **Ideas humanas · Tecnología inteligente**. Los tres recursos optimizados están en `assets/brand/`.
- El 404 de `test-fr-visual.mjs` correspondía a `/favicon.ico`. La aplicación y la página de QA declaran ahora el favicon PNG. Se comprobó su legibilidad a 16 × 16 px en una simulación de pestaña con fondos claro y oscuro.
- **QA local PASS** para `test-fr-visual.mjs`, `test-recommendation-count-i18n.mjs` y `test-dish-illustrations.mjs`. También se comprobaron la carga de los recursos, las capturas a 360 × 800 y 1365 × 900 y la ausencia de desbordamiento en ES/EN/FR.
- **CI de marca PASS** en [GitHub Actions #896](https://github.com/Helioven/helio-gastro/actions/runs/42390590855), para `c44afdd` en `feature/manololabs-visual-20261107`. El [CI #895](https://github.com/Helioven/helio-gastro/actions/runs/42380436709) también terminó correctamente para `e39b1b0`, la corrección anterior de contadores en francés.

### Ampliación visual de resultados — aprobada el 7 de noviembre de 2026

- Una búsqueda con resultados y un nombre normalizado del mapa de ilustraciones muestra un único WebP junto al resumen general. Así se pueden ver también los ocho recursos que carecen de tarjeta propia: boquerones fritos, huevos rotos, hamburguesa, pizza, cachopo, ensaladilla rusa, nachos y tarta de queso. La etiqueta se traduce en ES/EN/FR. La ilustración se mantiene separada de las fichas de locales y reutiliza la carga diferida y el marcador de respaldo.
- Los resultados se desplazan por debajo de la navegación fija y las entradas de precios del comparador móvil tienen más separación.
- El resumen y la ilustración ocupan menos espacio vertical. El primer encabezado queda a 6 px del resumen en la búsqueda de pizza probada. Los platos encontrados se muestran en una lista con encabezado en ES/EN/FR, conservando el texto, el orden y el bloque de precio publicado.
- **QA local PASS** en búsqueda, filtros, comparador, ilustraciones, contadores ES/EN/FR y flujo básico de accesibilidad. En Chromium local se comprobaron las ocho búsquedas a 360 × 800 y 1365 × 900, las etiquetas, el marcador al bloquear la imagen y la ausencia de desbordamiento en los recorridos comprobados. Pizza no se solicitó al cargar la portada y su WebP mide 81 152 bytes. No se midieron tiempos de carga en redes móviles ni se probó con un lector de pantalla.
- En la revisión previa al commit también pasó `test-fr-visual.mjs`. Se comprobó que los siete platos del caso de pizza mantienen texto y orden al alternar ES/EN/FR, y que los 15 archivos WebP aprobados permanecen intactos. El CI oficial de esta ampliación se comprobará sobre el SHA del commit tras la subida de la rama y la ejecución manual del workflow.


---

## PLAN DE BATALLA — Cierre de Helio Gastro (7 de noviembre de 2026)

> **Documento operativo prioritario para la siguiente sesión de Codex.** Leer junto al handoff de la fase visual y al historial de QA anterior. Distinguir siempre entre **aprobado**, **implementado localmente**, **confirmado en GitHub** y **desplegado**; la planificación no constituye autorización de merge ni de publicación.
>
> **Estrategia de Helio:** terminar primero **contenido y funcionalidades**, después realizar **un rediseño profesional integral**, luego QA final y lanzamiento. No migrar prematuramente ni rehacer pantallas varias veces. Objetivo posterior: renovar Manolo Meteo y **presentar ambos proyectos juntos en LinkedIn** como portfolio de QA, verificación de datos y trabajo con IA, recordando la búsqueda activa de empleo.

### 0. Situación comprobada y controles de continuidad

- Repositorio: `Helioven/helio-gastro`; rama exclusiva de trabajo visual: `feature/manololabs-visual-20261107`. **`main` permanece protegida de cambios no autorizados**: no hacer merge ni desplegar sin aprobación expresa.
- **Branding integrado y confirmado en remoto:** commit `c44afdd00cad661023abf9c7062a31965b62638d` — `feat(brand): integrate approved Manolo mascot and favicon`; [CI #896 PASS](https://github.com/Helioven/helio-gastro/actions/runs/42390590855), correspondiente específicamente a ese commit. Cabecera: cabeza de Manolo; pie: busto y firma; favicon; error 404 de favicon corregido. No interpretar ese PASS como validación de trabajo posterior.
- **Ilustraciones aprobadas:** 15 WebP en `assets/dishes/`, con etiqueta localizada «Imagen ilustrativa» (ES/EN/FR). Son conceptos generales, NO fotografías de platos servidos por un local.
- **Trabajo posterior reportado por Codex y revisado visualmente por Helio/Manolo, pendiente de constatar en remoto:** uso de las otras ocho imágenes en resúmenes de búsquedas por nombre exacto normalizado (ya no quedan recursos sin uso en el prototipo), una sola imagen por búsqueda, carga diferida y fallback; reducción de huecos verticales; presentación en lista de coincidencias múltiples (caso pizza/Patio Romano), mejor espaciado del comparador móvil y corrección de desplazamiento bajo navegación fija. Capturas y QA local reportados PASS a 360×800 y 1365×900 en ES/EN/FR. **El usuario aprobó realizar el commit de esa fase**, pero no hay confirmación aquí de su hash ni de un CI oficial nuevo: comprobar el HEAD, git status y Actions antes de darla por cerrada.
- Conservar las 15 imágenes, especialmente las variantes expresamente aprobadas de flamenquín, berenjenas con miel, boquerones fritos y huevos rotos. No regenerar o sustituir sin aprobación.

### 1. Prioridad A — Consejo de Manolo basado en reseñas reales

**Objetivo:** reemplazar el comentario genérico basado en la puntuación y el comentario redundante de Manolo por **una única síntesis original, útil, distendida e imparcial**. Puede destacar virtudes y críticas recurrentes con humor, pero nunca inventar defectos, testimonios, cifras ni reseñas.

1. **Primero investigar viabilidad de datos y licencias**, antes de programar el sistema: Google Maps muestra reseñas públicas, pero ser públicas no autoriza a extraerlas masivamente ni a publicar derivados. La API estándar de Places solo expone una muestra pequeña (habitualmente hasta cinco reseñas); verificar documentación, términos y alternativas vigentes. Evaluar otras fuentes con licencia, acuerdos, datos autorizados o reseñas propias de usuarios.
2. Meta ideal: **muestreo de 100–200 reseñas por local si existe acceso permitido y muestra suficiente**. Nunca declarar 100/200 si se han analizado menos ni simular datos. Documentar fuente, fecha, tamaño, método de selección, sesgos posibles y criterio de suficiencia. No confundir **media de la muestra** con **valoración global de la plataforma**.
3. Analizar patrones reales: calidad y especialidades, atención, precio/valor, ambiente, accesibilidad y esperas. Ponderar recurrencia y actualidad si está justificado; no sobrerrepresentar opiniones aisladas ni acusaciones no corroboradas.
4. Salida única «**El Consejo de Manolo**», tono castellano natural, original y divertido, **con rigor**. Distinguir hechos y opiniones. Añadir trazabilidad/aviso metodológico sin mostrar texto de terceros cuando no esté autorizado. Evitar sesgos reputacionales.
5. Construir **piloto de tres locales** solo cuando las fuentes y el tratamiento sean lícitos; revisión editorial humana y QA. Si no existen permisos o muestra fiable, mostrar «Sin datos suficientes» o aplazar la función, **no fabricar comentarios**.
6. Decisión pendiente: arquitectura concreta de captura, almacenamiento/caducidad, actualización y coste. Considerar requisitos de protección de datos y condiciones de atribución.

### 2. Prioridad B — Biblioteca reutilizable de ilustraciones para las cartas

**No** generar una imagen por cada plato ni añadir cientos de recursos por inercia. Primero analizar el catálogo existente y obtener un inventario de **conceptos gastronómicos frecuentes y no ambiguos**.

1. Reutilizar las 15 ilustraciones actuales donde el concepto coincida fielmente con el nombre **documentado** del plato. Para un plato de restaurante específico, no insinuar presentación, ingredientes, alérgenos, precio o disponibilidad no comprobados.
2. Evaluar una ampliación **gradual** de la biblioteca (orientativamente 40–60 conceptos, **no cuota obligatoria**), según cobertura real, utilidad y revisión visual. Distinguir especialidades representativas y conceptos generales; los ambiguos permanecen solo texto.
3. Preparar un sistema explícito de asociación nombre normalizado → imagen aprobada, sin coincidencias laxas ni falsos positivos. Mantener etiqueta **«Imagen ilustrativa»** en ES/EN/FR, texto alternativo y marcador de respaldo.
4. **No llenar ahora cada carta de fotos**: diseñar los recursos, mapeo y criterios editoriales, dejando la integración visual final para el rediseño profesional. Las cartas extensas deben seguir siendo rápidas, legibles y fáciles de recorrer.
5. WebP optimizado, `loading=lazy`, tamaños responsivos, comprobación de peso de red, CLS y móviles modestos; no descargar imágenes de platos que el usuario no ve.
6. Criterio de aprobación: muestra reducida de platos/menús, QA de coincidencias y revisión humana antes de escalar.

### 3. Prioridad C — Buzón privado de sugerencias conectado al email

**Objetivo:** formulario para visitantes, dirigido al correo de Helio **sin exponer la dirección personal** en HTML, JavaScript, repositorio ni respuesta de la aplicación.

- Campos: tipo (sugerencia, restaurante nuevo, dato/carta incorrecta, error técnico, otros), mensaje obligatorio, email del remitente **opcional** para respuesta; recoger lo mínimo.
- Investigar y comparar pasarelas para sitios estáticos, por ejemplo **Formspree** y **Web3Forms**, verificando **precios, límites actuales, privacidad, antispam y comportamiento real** antes de elegir. Ninguna suscripción de pago sin evaluación ni autorización.
- Usar intermediario/form ID público cuando proceda; **nunca** incrustar email del propietario, tokens secretos o credenciales en frontend. Considerar honeypot, límites, moderación, protección antiabuso y confirmaciones sin revelar datos sensibles.
- Interfaz ES/EN/FR, accesibilidad, errores/red desconectada y prevención de duplicados. Aviso de privacidad claro (finalidad, conservación, encargado y derechos); revisión RGPD antes de activar.
- Primero prototipo/sandbox, después configuración privada y **prueba real controlada** con aprobación. No prometer envío funcional si la pasarela aún no está conectada.

### 4. Prioridad D — Contenido, consistencia editorial y cierre funcional

- Revisar cartas y enlaces con fuentes fechadas; **no inventar ni actualizar precios/ingredientes/horarios por conjetura**, y no publicar información sin validar.
- Respetar las decisiones editoriales del README: locales ocultos, cartas parciales, borradores y separaciones por modalidad. No reactivar **El Caballo Rojo** ni fusionar cartas parciales sin autorización.
- Regresión de búsquedas, filtros por momento (desayuno, comida, merienda, cena), resultados, precios documentados, comparador, favoritos, ficha, mapas, navegación, ES/EN/FR y móviles; documentar lo probado y lo pendiente.
- No añadir extras indefinidamente. Cerrar cada fase con aceptación explícita y backlog pequeño.

### 5. Prioridad E — Rediseño profesional integral (DESPUÉS del contenido)

**Meta:** dejar de parecer una plantilla y ofrecer una experiencia gastronómica con personalidad propia, moderna y móvil primero, sin perder rendimiento ni la identidad ManoloLabs.

- **Elegir primero dirección visual** con **dos propuestas** de portada y una ficha de restaurante, en móvil y escritorio, para aprobación. Idea: portada con buscador protagonista, navegación natural, jerarquía limpia, tarjetas más legibles, menos cajas rígidas y párrafos densos, imágenes donde aporten valor.
- Respetar nombre **Helio Gastro** como producto, firma **ManoloLabs by Helio**, lema «Ideas humanas · Tecnología inteligente» y mascota oficial **de DOS antenas** (gafas oscuras cuadradas, bigote marrón, detalles azules, M luminosa); mantener los recursos oficiales aprobados, icono de cabeza en cabecera y busto en pie.
- Conservar inicialmente HTML/CSS/JS: **no migrar a React ni a otro framework por apariencia**. Solo proponer migración si aparece una necesidad técnica demostrada, con costes y plan de regresión.
- Decisión abierta para el diseño de las cartas: ¿aspecto de app de pedidos con miniaturas y precios, o carta tradicional refinada? Resolverla mediante prototipos, no imponiendo una estética sin consulta.
- Integrar en esta fase el tratamiento definitivo de imágenes en cartas, Consejo de Manolo y buzón, evitando rehacerlos varias veces.
- Diseño responsivo, contraste, navegación con teclado, lector de pantalla, velocidad de carga, estados vacíos y largos listados. No reducir la usabilidad por perseguir estética.

### 6. Prioridad F — QA integral, publicación y portfolio

1. Revisar cambios en rama, pruebas automáticas y casos manuales en **móvil real y escritorio**, ES/EN/FR, incluyendo formularios, teclado, lector de pantalla, imágenes rotas, rendimiento en redes lentas, privacidad, caché y datos.
2. Corregir defectos demostrados; documentar CI con **hash concreto** y distinguir PASS local, PASS oficial y evaluación visual/editorial humana. Un CI verde **no equivale** a certificación WCAG ni a veracidad de cartas.
3. Solo con autorización explícita: preparar PR, revisar diff, fusionar en `main`, verificar despliegue y versión pública. Conservar procedimiento de recuperación/rollback.
4. Después, **Manolo Meteo v1.7**: propuesta de renovación visual y funciones adicionales por definir, misma marca ManoloLabs, QA de PWA/datos meteorológicos sin prometer capacidades no comprobadas.
5. Lanzamiento conjunto **Helio Gastro + Manolo Meteo en LinkedIn**, con capturas reales, demo y repositorios; mostrar el trabajo auténtico de Helio: definición de requisitos, dirección de agentes IA, QA manual, validación de datos, correcciones y entrega. Recordar de forma profesional que busca empleo remoto QA, Data QA, operaciones digitales e iGaming. No atribuirse labores técnicas que no haya realizado.

### Reglas obligatorias para el agente y próxima sesión

- **Antes de actuar:** `git status`, HEAD local/remoto, rama, README y CI. Verificar si hay commits locales pendientes; no reescribir ni borrar trabajo no subido.
- **Prioridad inmediata:** cerrar con commit/push/CI la fase visual de las 15 ilustraciones **solo si el estado real lo confirma**; a continuación, **investigar reseñas** y presentar opciones viables con fuentes, restricciones y costes **sin programar extracción masiva**.
- Usar ramas/commits pequeños y reversibles, sin tocar `main`, sin despliegue ni gasto sin permiso. QA y capturas antes de dar una fase por buena.
- **Este plan describe decisiones y prioridades, no concede permiso para ejecutar todas las fases automáticamente.** Pedir aprobación en puntos de decisión; en trabajos acotados aprobados, avanzar sin interrumpir cada minuto.
- Mantener una sección de **estado vivo** por fase: `Pendiente / Investigación / Prototipo / QA local / CI / Aprobado / Publicado`; fecha, commit/PR, evidencia y bloqueantes. Actualizar el README tras cada entrega, sin borrar evidencias históricas.


---

## INVESTIGACIÓN DE RESEÑAS — Consejo de Manolo (7 de noviembre de 2026)

> **Estado: INVESTIGACIÓN CONCLUIDA EN PRIMERA PASADA; NO APROBADO PARA IMPLEMENTACIÓN.** Fuentes oficiales verificadas el 07/11/2026. Antes de contratar, importar, resumir o publicar opiniones, comprobar términos y coberturas contractuales vigentes. Esta nota no es asesoramiento jurídico ni concede derecho de reutilización de contenido de terceros.

### Hallazgos verificados y limitaciones

1. **Google Places API (New):** `reviews` devuelve **máximo 5 reseñas por lugar**; `rating` y `userRatingCount` son datos agregados distintos de las reseñas. Solicitar `reviews` o `reviewSummary` activa una categoría de facturación más elevada (Enterprise + Atmosphere). No existe una paginación pública documentada para recuperar 100–200 reseñas de cualquier negocio. Fuente: https://developers.google.com/maps/documentation/places/web-service/place-details
2. **Términos para proyectos vinculados a facturación EEE:** se prohíben expresamente la extracción/scraping, el almacenamiento no autorizado de reseñas y la creación de contenido a partir de Google Maps Content, salvo excepciones específicas. **No** usar Playwright, Selenium, SerpAPI, scraping manual industrializado ni terceros que extraigan Google Maps como atajo para generar el Consejo de Manolo. Fuente actual: https://cloud.google.com/terms/maps-platform/eea (sec. 3.3.2); guía API: https://developers.google.com/maps/documentation/places/web-service/policies
3. **Resúmenes de reseñas generados por Google:** Google `reviewSummary` exige mostrar el texto completo sin modificarlo, avisos y enlaces/atribuciones. La documentación de disponibilidad regional **no incluye España** en sus regiones de apoyo publicadas para estos resúmenes. En consecuencia, no sirve actualmente como base fiable para una voz propia y humorística de Manolo en Córdoba. Fuentes: https://developers.google.com/maps/documentation/places/web-service/review-summaries ; https://developers.google.com/maps/documentation/places/web-service/policies
4. **Yelp Places/Fusion Reviews:** endpoint público de producto devuelve hasta **3 extractos** por negocio y exige permisos de plan Enhanced o Premium. No satisface 100–200. Fuente: https://docs.developer.yelp.com/reference/v3_business_reviews
5. **Tripadvisor Content API (legado):** la documentación histórica exponía hasta **5 reseñas recientes por local**, pero **está deprecada**; no seleccionar una integración nueva contra esa API. Fuentes: https://tripadvisor-content-api.readme.io/reference/overview ; https://tripadvisor-content-api.readme.io/reference/getlocationreviews
6. **Tripadvisor Terra (API actual):** **opción comercial que merece investigación**. Dispone de `GET /api/locations/{id}/reviews`, con paginación sobre un **conjunto contratado**: N reseñas recientes o reseñas de los últimos M meses, según paquete y acuerdo. NO significa acceso ilimitado ni que 100–200 estén incluidos. La plataforma tiene niveles Discover/Growth/Scale/Innovate y permisos por endpoint. **Precio exacto, disponibilidad de restaurantes cordobeses, tamaño del pool, almacenamiento, resumen transformativo con IA y atribución/redistribución deben confirmarse por escrito con Tripadvisor antes de iniciar.** Fuentes: https://docs.terra.tripadvisor.com/reference/locationreviewsget ; https://docs.terra.tripadvisor.com/docs/overview ; https://docs.terra.tripadvisor.com/docs/rate-limits
7. **Google Business Profile API:** devuelve reseñas paginadas de ubicaciones **verificadas y administradas con autorización OAuth**, no es una vía para consultar las reseñas completas de restaurantes de terceros sin control. El acceso del negocio tampoco debe interpretarse como una licencia automática de explotación derivada; revisar condiciones aplicables. Fuente: https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list
8. **Reseñas originales enviadas directamente a Helio Gastro:** posible vía autónoma y sostenible a futuro, con formulario específico, condiciones de licencia/permiso claros para síntesis editorial, moderación, controles contra spam, rectificación/supresión y política RGPD. Al inicio no habrá una muestra suficiente para generalizaciones: mostrar cantidad exacta y «Datos insuficientes» cuando corresponda. Referencia sobre transparencia de recogida de datos: https://www.aepd.es/derechos-y-deberes/conoce-tus-derechos/derecho-de-informacion

### Recomendación funcional y económica

- **No** desarrollar aún extracción automática de opiniones de Google/Yelp/Tripadvisor. Ninguna de sus opciones públicas simples probadas proporciona 100–200 reseñas por restaurante con derecho claro a crear resúmenes propios.
- **Pista principal a evaluar:** solicitar información comercial/licencia de **Tripadvisor Terra** sobre un **piloto de 3 locales concretos de Córdoba** y permiso explícito para generar y publicar resúmenes originales asistidos por IA, volumen 100–200 por establecimiento, costes, actualización y avisos. **No hay contrato, precio ni acceso verificado** al 07/11/2026. No comprometer gasto.
- **Plan independiente viable:** investigar un futuro sistema de reseñas originales de usuarios de Helio Gastro, separado del buzón de sugerencias (que sirve para avisar al administrador y no equivale a opinión publicable). Recoger solo lo imprescindible y moderar con criterios publicados. En una PWA estática requerirá almacenamiento/backend o proveedor adecuado; diseñar y aprobar antes de programar.
- **Plan de contingencia para el lanzamiento:** mantener «El Consejo de Manolo» **sin resumen basado en opiniones** cuando falte fuente o muestra autorizada. Puede existir por separado una **nota editorial sobre el menú y datos documentados** (claramente rotulada como orientación sobre carta, no como reseñas, ni experiencia vivida, ni valoración de terceros). No fingir patrones ni asignar una nota media propia no respaldada.
- **No confundir**: valoración global de Google/Tripadvisor ≠ puntuación de un muestreo ≠ análisis de texto de 100–200 opiniones. Siempre fuente, periodo, n real, criterios, revisión humana y fecha; jamás claims genéricos «todos opinan», «los clientes destacan» sin evidencia.
- **Criterios de go/no-go:** fuente/licencia por escrito que permita los usos concretos; cobertura real de ≥3 locales; disponibilidad de 100–200 **si realmente existe** (o transparencia al reducir n), presupuesto aceptado, seguridad/RGPD, proceso de actualización, análisis de sesgos y prueba editorial. Si falla, no se publica la función como «reseñas sintetizadas».

### Estado CI y próximo encargo a Codex

- Fase de las 15 ilustraciones y lectura de resultados **cerrada en desarrollo**, con [GitHub Actions #897 PASS](https://github.com/Helioven/helio-gastro/actions/runs/42395115356) para commit **`d52872a2812a9dc3e850d9978cc9ece822f90a46`** (verificado externamente). Este PASS **no** valida commits de solo documentación posteriores ni significa merge a `main` o despliegue.
- **Siguiente paso recomendado:** sin tocar código de producción, elaborar **matriz de viabilidad de proveedores** y esquema de datos/UX para una prueba de «Consejo de Manolo» con un conjunto de reseñas **ficticias etiquetadas como datos de prueba** y/o datos originales con permiso. Esa maqueta no debe publicar testimonios inventados como reales.
- Preguntas de negocio pendientes: ¿merece la pena un proveedor de pago si Terra concede el permiso y hay datos suficientes? ¿Se lanzará inicialmente el Consejo como nota editorial de carta, o se ocultará hasta tener reseñas legítimas? Resolución corresponde a Helio.
- Mantener prioridad posterior: biblioteca de ilustraciones para cartas → buzón privado → completar contenido → rediseño profesional → QA final → lanzar Gastro/Meteo y presentación conjunta.


---

## Handoff operativo para el domingo 8 de noviembre de 2026 — Consejo de Manolo

> **Documento de continuidad prioritario, escrito el sábado 7 de noviembre.** Resumen de lo completado hoy, evidencias y siguiente tarea. Complementa el [Plan de Batalla](#plan-de-batalla--cierre-de-helio-gastro-7-de-noviembre-de-2026) y la [investigación de licencias](#investigación-de-reseñas--consejo-de-manolo-7-de-noviembre-de-2026), sin borrar el historial. La tarea siguiente se prepara para mañana; **no se ha ejecutado**.

### A. Resumen del avance de hoy: qué está hecho

**Helio Gastro — rama de desarrollo**

- Identidad de marca seleccionada: **ManoloLabs by Helio**, lema «Ideas humanas · Tecnología inteligente», producto «Helio Gastro». Mascota base Manolo, robot 3D metálico blanco con **dos antenas**, gafas oscuras cuadradas, bigote marrón, acentos azules y «M» luminosa. En cabecera cabeza del robot, en pie busto y firma; favicon arreglado. La variante antigua de una sola antena NO sustituye esta identidad.
- Ilustraciones generales: **15 WebP aprobados** en `assets/dishes/`, sin imágenes atribuidas falsamente a locales. Siete accesos generales originales y otras ocho ilustraciones visibles al buscar su plato compatible; resumen de búsqueda compacto, imagen única etiquetada «Imagen ilustrativa», listas legibles de platos coincidentes, comparador móvil y foco de resultados mejorados. ES/EN/FR y fallbacks mantenidos.
- Último PASS de GitHub Actions verificado en la rama de desarrollo: **[#897](https://github.com/Helioven/helio-gastro/actions/runs/42395115356), `success`, commit `d52872a2812a9dc3e850d9978cc9ece822f90a46`**. Este PASS corresponde a las ilustraciones/resultados, NO a los cambios experimentales posteriores.
- Se creó el Plan de Batalla para **terminar contenido y funcionalidades ANTES del rediseño profesional integral**. Se investigaron restricciones de fuentes de reseñas. No existe permiso ni proveedor contratado para analizar 100–200 opiniones de restaurantes cordobeses; no usar scraping ni inferir una licencia de datos públicos. Tripadvisor Terra queda como posibilidad comercial no verificada, junto a eventuales opiniones propias de usuarios.

**«El Consejo de Manolo» — prototipo independiente en rama `poc/consejo-manolo-qa`**

- **HG-REV-POC-001:** maqueta responsive en ES/EN/FR con tres restaurantes y opiniones ficticios, respectivamente **4, 4 y 0 opiniones**, advertencia «DATOS FICTICIOS — SOLO PROTOTIPO». Sin publicar opiniones ni crear fichas reales de esos establecimientos.
- **HG-REV-POC-002:** variante **Manolo Chef** aprobada por Helio: gorro de cocina blanco con **M AZUL**, antenas, bigote, gafas y delantal «Manolo Chef». PNG original conservado; WebP transparente optimizado de **384 × 384** para la maqueta. No reemplaza logotipo general de ManoloLabs.
- Prototipo y mascota guardados en rama aislada, primer commit **`068dbb41565e239d5abfd10f796ad1515b86933b`** (`feat(qa): finalize approved Manolo Chef prototype`), publicado y comprobado en GitHub. Archivos en `poc/consejo-manolo/`: HTML de demostración, fixtures, JS de render, test Playwright, PNG y WebP.
- **HG-REV-ENGINE-001:** motor experimental construido posteriormente **a partir de anotaciones estructuradas de opiniones ficticias**; NO entiende todavía reseñas libres mediante IA. Arquitectura separa anotaciones/fuente → agregación determinista y referencias a IDs → redacción ES/EN/FR por reglas/plantillas → vista. Deduplica por ID, cuenta cada aspecto como máximo una vez por opinión, distingue polaridad y contradicciones, identifica menciones aisladas y puede **abstenerse**. Desplegable «Ver referencias de evidencia» para auditar cada afirmación.
- Casos: **El Faro de Menta** (4 opiniones: guiso y atención 3 favorables cada uno; 1 espera aislada); **La Brújula de Nuez** (4: terraza 3 favorables; ruido 2 críticos; ritmo de servicio 1 favorable y 2 críticos, ahora mostrado UNA vez como contradictorio); **La Tetera Orbital** (0: abstención). Son **solo fixtures inventados**; no extrapolar cifras a restaurantes reales.
- Umbrales **exclusivamente de QA**: 4 opiniones únicas para activar ejemplos y al menos 2 del mismo signo para declarar recurrencia. **NO son un criterio de publicación**. Pendientes permisos, muestra válida, sesgos, antigüedad, cobertura y revisión humana.
- Se hizo una iteración editorial: mejor agrupación de opiniones contrapuestas y consejos más naturales, sin inventar hechos. Helio aprobó el enfoque. **QA local reportado por Codex: PASS** en 11 pruebas unitarias (duplicados, falta de derechos, datos incompletos, ambigüedad, trazabilidad y otros), además de Playwright en **360 × 800 y 1365 × 900**, ES/EN/FR, teclado, evidencias, ancho; fixtures fuera de la app pública. **No afirmar CI oficial para este motor**.

### B. Estado de Git al cerrar esta sesión — NO perder cambios

- **Remoto de desarrollo** `feature/manololabs-visual-20261107`: commit `9d025278c1aa1ea59477ddc254b6061cab29363a` antes de este documento. Se actualiza su **README solamente** con este handoff. No tocar `main`; aún no se ha autorizado el rediseño ni el lanzamiento.
- **Remoto del prototipo** `poc/consejo-manolo-qa`: confirmado en `068dbb41565e239d5abfd10f796ad1515b86933b` al redactar esta nota. **Codex informa de otro commit LOCAL, `c1610679fdb6b271abe15f52d3a707348c697c9c`, pendiente de Push origin**. Este incluye el motor y sus ajustes finales, con 11 pruebas unitarias y el README de QA, según el informe del agente. **No darlo por publicado ni CI-validado hasta comprobar la subida**.
- **Hay además un borrador sin commit de `README.md` en la copia local de la rama de desarrollo**, reportado por Codex y visto en GitHub Desktop. Se solapa con los bloques `HG-REV-POC-001` y `HG-REV-POC-002` de la rama de QA. **Conservarlo** al sincronizar, conciliar en una sola sección (evitar duplicados). Esta actualización del README remoto puede requerir integrar cambios antes de Push; nunca usar force push ni descartar el borrador.
- **No asumir que la copia de GitHub Desktop activa es la copia QA**. El prototipo se gestiona en un worktree independiente. Comprobar arriba `Current repository` / `Current branch` antes de cualquier operación.

### C. Secuencia exacta de reanudación (mañana, domingo 8/11)

1. **Git primero:** abrir GitHub Desktop en el worktree de QA `poc/consejo-manolo-qa`, verificar el commit local `c1610679`, pulsar **Push origin** y confirmar en GitHub que el HEAD de esa rama es `c1610679…`. Si cambió el remoto, `Fetch origin` e integrar sin force push. Revisar si la rama QA tiene workflow aplicable; **11 pruebas locales PASS no equivalen a CI oficial**.
2. **Proteger documentación:** en la copia de desarrollo, guardar/respaldar el README local pendiente, hacer Fetch, integrar este nuevo handoff del README remoto y reconciliar su bloque de POC/engine, sin duplicar secciones ni borrar el Plan de Batalla. No hacer merge de todo el POC a `main`.
3. **Ajuste editorial no bloqueante:** cambiar la frase potencialmente engañosa «2 a favor y 0 críticos» por «2 temas positivos recurrentes y 0 temas negativos recurrentes», o equivalente por idioma, **sin ocultar la mención crítica aislada de espera**. Añadir test. Verificar que las frases humorísticas no exageran ni contradicen evidencia.
4. **Siguiente desarrollo: `HG-REV-AI-001` — extracción asistida de aspectos desde opiniones en lenguaje natural de QA**. Preparar primero diseño/criterios y después un piloto **aislado y sin costes**. Ningún scraping, reseñas reales de terceros, claves de API, modelos de pago ni despliegue sin autorización.
5. **Probar y revisar antes de cerrar**: entregar tabla de errores, etiquetas propuestas por el extractor, referencias a la frase origen, casos ambiguos/abstención, métricas de precisión/recall sobre una muestra manualmente etiquetada y diferencias entre determinismo y posible LLM. Solo después decidir si se avanza a un modelo de lenguaje real.
6. Mantener resto del itinerario: conseguir fuente de reseñas **autorizada por escrito** (si existe) → ampliar gradualmente biblioteca de imágenes de platos para cartas (sin una imagen por plato indiscriminadamente) → buzón privado conectado a email sin exponer dirección → completar contenido y fuentes → **rediseño profesional de la app** → QA integral y lanzamiento → actualizar Manolo Meteo y presentar ambos proyectos juntos en LinkedIn.

### D. Especificación breve para el siguiente agente: HG-REV-AI-001

**Meta concreta:** convertir texto de prueba libre en **propuestas de anotación** de tema y polaridad, con `opinionId`, cita/referencia a un fragmento de la opinión ficticia y un estado de confianza o abstención. **Nunca** producir directamente afirmaciones publicables desde el texto bruto.

- **Contrato:** opinión original ficticia → extractor propuesto → lista `{ opinionId, aspect, sentiment, evidenceSpan, status }` → validación y revisión editorial → motor determinista existente → resumen. Conservar fuente, licencia, trazabilidad, recuentos y separación de responsabilidades. Los recuentos pertenecen al motor, no a la IA generativa.
- **Dataset de evaluación:** construir un conjunto pequeño y revisable de **20–50 opiniones ficticias adicionales**, etiquetadas manualmente como verdad de referencia, que cubra servicio, espera, calidad, raciones, ruido, precio, accesibilidad y casos neutros. Incluir negaciones («no tardaron»), sarcasmo/ironía, frases con sentimientos mixtos, errores ortográficos, referencias vagas, dos menciones del mismo tema, duplicados y contenido ambiguo. Idiomas ES/EN/FR o diseñar explícitamente cobertura y límites por idioma antes de afirmarla.
- **Método:** comparar una línea base transparente basada en reglas/lexicón con opción posterior de IA/LLM **solo si aporta mejora demostrable**. No vender «IA que entiende reseñas» si depende de palabras clave o anotaciones manuales. Los modelos de lenguaje pueden equivocarse y deben someterse a evaluación reproducible y revisión humana.
- **Criterios de aceptación:** ninguna evidencia inventada, `evidenceSpan` verificable dentro del texto, ningún recuento inflado por repeticiones, abstención para negaciones ambiguas/ironía no resoluble, ausencia de datos personales, controles de publicación que bloqueen fixtures, licencias ausentes y revisión no aprobada. Informar **errores reales, falsos positivos y falsos negativos**, no solo tests PASS.
- **QA/documentación:** scripts y capturas de prototipo en rama `poc/consejo-manolo-qa`, control de regresiones del motor (11 tests existentes), casos nuevos y ES/EN/FR; lista de riesgos y deuda. Proponer cambios primero para aprobación. **No commit, merge, despliegue ni gasto sin autorización específica** del siguiente alcance.

### E. Decisiones que no deben perderse

- **Regla de Manolo:** «Si no hay pruebas, no hay consejo». No afirmar una valoración general de un negocio a partir de cuatro opiniones; no inventar reseñas, menciones, ingredientes, tiempos ni porcentajes.
- Diferenciar **CI aprobado de desarrollo** (#897), **PASS de QA local del motor** y **revisión humana**. No confundirlos.
- No atribuir a Google/Yelp/Tripadvisor datos o licencias no obtenidos; la investigación de Terra es exploratoria. La funcionalidad pública de reseñas está **pendiente**, aunque el POC esté avanzado.
- El estilo definitivo de interfaz se decide **después de acabar contenido y funciones**, con dos propuestas visuales para elegir, sin migrar por inercia a React ni sustituir la identidad aprobada.
- Los logos principales usan Manolo normal; **Manolo Chef** con M azul solo para el Consejo. PNG original y WebP optimizado se conservan en la rama experimental.
- Al cerrar cada fase: actualizar README, informar fecha + rama + hash + pruebas efectivas + pendientes y guardar la documentación en la rama correspondiente sin reescribir la historia.

### Cierre local de la ampliación de ilustraciones

- Rama `feature/manololabs-visual-20261107` sincronizada por avance directo a `baf436c`. Se conserva el Plan de Batalla y se recuperan debajo las decisiones complementarias del borrador local sobre el Consejo.
- Biblioteca de 17 ilustraciones. Se añaden `assets/dishes/carrillada-con-patatas.webp` y `assets/dishes/pisto-cordobes.webp` a 640 × 480 px a partir de los PNG aprobados. Las 15 ilustraciones anteriores son idénticas a las de `1f4c603`.
- `app.js` muestra estas dos imágenes en el resumen de resultados con denominaciones normalizadas exactas y solo cuando todos los resultados visibles son compatibles. `index.html` actualiza la versión del script. Ver asociaciones en `assets/dishes/README.md`.
- QA local PASS en sintaxis JS, auditoría de 44 establecimientos (0 errores y 0 avisos), búsqueda, filtros, comparador, accesibilidad básica, contadores de recomendaciones e ilustraciones. En Chrome con Playwright se verificaron móvil emulado y escritorio, carga de los WebP, etiquetas ES/EN/FR, coincidencias compatibles y exclusión de variantes. Regresiones repetidas tras la aprobación visual de Helio, con el mismo resultado. CI oficial pendiente.
### Integración gradual del rediseño híbrido

- Rama separada `codex/helio-gastro-rediseno`, desde `c16e6f0`. La rama visual conserva su borrador local del Consejo. El prototipo del Consejo y el buzón permanecen en sus entornos de QA.
- Portada en `6b2431e`. Cabecera y portada crema, lema y descripción aprobados, flamenquín ilustrativo y orientación breve de Manolo. La búsqueda directa envía el formulario existente, con los filtros de la sesión.
- Resultados y categorías en `c96ee93`. Pizzas, hamburguesas y tartas de queso consultan los nombres de plato y los precios del catálogo activo. La coincidencia de esas tres consultas exactas admite singular y plural, e incluye minihamburguesas. Excluye los extras de hamburguesa. Las categorías solo aparecen cuando el momento gastronómico activo tiene coincidencias. En escritorio, los filtros y los resultados se muestran en columnas. En móvil, «Ajustar filtros» vuelve al mismo formulario.
- Fichas y formatos. Se añade índice con foco de teclado cuando la carta ya contiene varias secciones documentadas. Se conserva el renderizador actual, incluidas cartas sin secciones, fuentes y avisos. Un asterisco remite a un aviso por vista cuando falta el formato de un precio publicado. El comparador no destaca un precio mínimo si el formato es desconocido.
- Se conservaron el catálogo, las traducciones de datos, las 17 ilustraciones y los recursos de marca.

**Reproducir el QA local**

1. Usar un checkout de `c16e6f0` para la línea base y el HEAD de la rama de integración para la comparación. Arrancar un servidor estático desde la raíz del checkout en `127.0.0.1:8765`.
2. Ejecutar `node scripts/audit-data.mjs`, `node --check app.js` y `node --check i18n.js`. Ejecutar con Playwright las suites `test-search-regression`, `test-filter-regression`, `test-comparator-regression`, `test-detail-regression`, `test-navigation-regression`, `test-accessibility-flow`, `test-recommendation-count-i18n`, `test-dish-illustrations`, `test-fr-favorites-populated` y `test-fr-visual`, todas en `scripts/` con extensión `.mjs`.
3. En la rama de integración, ejecutar `node scripts/test-hybrid-redesign.mjs`. Para guardar capturas, pasar como primer argumento un directorio existente fuera del checkout. La prueba usa el catálogo real y comprueba ES/EN/FR a 360 × 800 y 1365 × 900, el foco y la persistencia de búsqueda.
4. En esta sesión, el runner local reutilizó Chrome y Playwright de la máquina con un servidor separado en el puerto 8766. Los informes se conservaron fuera del repositorio. El workflow oficial, la revisión humana, el lector de pantalla y el rendimiento en móvil físico siguen pendientes.
### Piloto de horarios de apertura y cocina

- Datos aislados en `data/venue-hours.json` (esquema 1, zona Europe/Madrid). Solo se muestran en las cinco fichas incluidas. El catálogo, la búsqueda por momento y los precios mantienen su estructura previa.
- Cada horario distingue `published`, `unknown` y `conflict`. Una regla semanal agrupa días ISO de 1 a 7, con estado `scheduled`, `partial`, `closed` o `unknown`. Las reglas admiten varios intervalos y `endDayOffset: 1` para los que terminan al día siguiente. Un cierre sin hora exacta lleva `end: null`. Las excepciones se registran con fecha local, estado, intervalos y referencia a la fuente.
- Consulta de fuentes oficiales del 8 de noviembre de 2026. Ágora Mezquita y Casa Bravo documentan cocina continua durante toda la apertura. La Montillana y Salinas solo aportan apertura. Las dos páginas oficiales de Bodegas Campos discrepan en horarios o alcance. Se conservan ambas evidencias y la ficha no publica intervalos para ese local. Ninguno de los cinco tiene tramos separados de desayuno, comida o cena ni excepciones fechadas comprobadas en las fuentes consultadas.
- La carga se realiza al abrir una ficha y se reutiliza durante la sesión. La interfaz está en ES/EN/FR y muestra fuentes y fecha. No evalúa estados en tiempo real. Si falla la carga del archivo, la ficha habitual sigue disponible.
- QA del piloto en `scripts/test-venue-hours.mjs`. Con Playwright instalado y servidor local en el puerto 8765, ejecutar `node scripts/test-venue-hours.mjs`. Se puede pasar un directorio existente como primer argumento para guardar capturas. La excepción fechada de prueba se inyecta exclusivamente en QA.
- QA local PASS en el piloto y la regresión híbrida a 360 × 800 y 1365 × 900 en ES/EN/FR, diez suites de regresión adicionales y auditoría de 44 registros sin errores ni avisos. CI oficial y revisión humana pendientes.
- Accesibilidad de fuentes en Bodegas Campos. Contacto y Reservas tienen nombres visibles y accesibles distintos en ES/EN/FR. Se conservan las dos URL, las evidencias y la discrepancia sin resolver. La prueba del piloto comprueba los nombres por rol de enlace y el orden del foco con Tab en móvil y escritorio.

### Corrección del QA francés del buscador (#898)

- La prueba del buscador francés aún esperaba la instrucción y los títulos anteriores al rediseño híbrido. Ahora comprueba una instrucción francesa de búsqueda válida o los ejemplos documentados del campo por servicio, y comprueba los títulos aprobados en ES/EN/FR. El texto de producto se conserva.
- La prueba de ida y vuelta detectó que el observador de traducción podía guardar un texto híbrido traducido como si fuera el original. El observador y el renderizado comparten ahora el mismo cálculo de traducción, preservando el texto fuente para el cambio de idioma.
- La prueba de filtros espera a que se cargue el catálogo y localiza «Flamenquín» por su nombre accesible. También comprueba que elegir una sugerencia rellena el campo sin ejecutar la búsqueda.
- QA local PASS en sintaxis, buscador y filtros FR, resultados FR y traducción dinámica, contadores, búsqueda general, rediseño híbrido, horarios, accesibilidad y francés público. Nueva ejecución del workflow oficial pendiente de publicación.

### Corrección de la prueba de restauración de idioma

- `test-fr-section-render.mjs` buscaba una sentencia literal eliminada al unificar el traductor en `26f185d`. La prueba mantiene la cobertura de 314 encabezados y ahora ejecuta el traductor real en Node para comprobar el ciclo ES → FR → ES → EN → ES, incluido el observador de mutaciones y la conservación de los nombres de plato.
- QA local PASS en los 21 scripts y los dos bloques de resumen del job `catalog-audit`. El ciclo de idiomas también pasó en Chromium a 360 × 800 y 1365 × 900, con la portada y la carta de La Montillana abiertas. El CI oficial del nuevo commit queda pendiente de publicación.

### Correcciones previas a publicación

- Los formatos explícitos de carta se normalizan antes de filtrar y comparar. La regresión de La Montillana comprueba que Media ración y Solo precios documentados devuelven el salmorejo a 6,90 €. Los formatos ambiguos siguen sin asignarse cuando tampoco se especifican en el nombre del plato.
- Los recorridos de búsqueda y descubrimiento cubren sus textos dinámicos en ES/EN/FR. El traductor ignora nodos separados del DOM y conserva la ficha al cambiar de idioma si su capa francesa ya está cargada.
- La cabecera y navegación móviles dejan visibles los cuatro controles, se adelanta el primer precio y se puede saltar a las fuentes de carta con teclado. Comparador y diálogos usan la paleta híbrida. El catálogo y los recursos visuales permanecen intactos.

## Identidad de ManoloLabs — ideas pendientes

ManoloLabs by Helio es la identidad común de los proyectos desarrollados por Helio. Manolo es su mascota y protagonista visual. Es un robot 3D blanco y metálico con dos antenas, gafas oscuras cuadradas, bigote marrón, detalles azules y una M luminosa azul en el pecho. Su personalidad es divertida, cercana y útil. El humor acompaña a la funcionalidad y nunca la sustituye.

### Lemas candidatos

La elección del lema sigue pendiente.

- «Tecnología útil, con un toque de humor».
- «Aplicaciones útiles, con un toque de humor».
- «Ideas útiles, con un toque de humor».

### Identidad compartida

Manolo mantiene una identidad visual reconocible aunque adopte distintos papeles en cada proyecto.

- **Helio Gastro** — Manolo Chef, orientador gastronómico.
- **Manolo Meteo** — Consejos meteorológicos.
- **Kanji Trainer** — Posible acompañante del aprendizaje.
- **Manolo & Paca** — Humor y entretenimiento.

### Revisión futura del nombre de Helio Gastro

Queda pendiente estudiar si un cambio de nombre reforzaría la relación de Helio Gastro con ManoloLabs y el papel de Manolo como personaje central. Hasta que se tome una decisión, se conservan el nombre actual, los enlaces, los identificadores técnicos y el lema «Descubre Córdoba a bocados».


## Estado de cierre — 8 de noviembre de 2026 (sin lanzamiento)

> **Estado operativo vigente:** desarrollo y validación interna. **No se autoriza todavía la integración en `main`, la publicación ni el anuncio público.** Esta sección actualiza los estados de «CI pendiente» que puedan aparecer en notas históricas anteriores; aquellas notas se conservan como registro de cada fase.

### Versión candidata validada

- Rama de trabajo: `codex/helio-gastro-rediseno`; commit validado: `f55eb6b`.
- GitHub Actions oficial: **PASS** en los dos jobs, `catalog-audit` y `visual-qa`, para ese mismo SHA. [Ejecución 42503739673](https://github.com/Helioven/helio-gastro/actions/runs/42503739673).
- La comparación realizada antes del cierre encontró `main` en `4d4ee3f`, ancestro de `f55eb6b`: 29 commits exclusivos de la rama de trabajo, ninguno exclusivo de `main`, sin conflictos previstos en ese momento. **Volver a comprobar ambos SHA antes de integrar.**
- Catálogo: 44 registros, 43 visibles; El Caballo Rojo permanece oculto. `data/places.json` era idéntico en ambas ramas durante la revisión.
- Incluye rediseño híbrido, 17 ilustraciones aprobadas, marca ManoloLabs, panel «Manolo te orienta» V1.1, piloto de horarios, mejoras de formatos, traducciones ES/EN/FR, accesibilidad y pruebas.
- El experimento de motor de opiniones y los escenarios ficticios de su POC **no** forman parte de la integración prevista.

### «Manolo te orienta» — comportamiento acordado

Panel de ayuda guiada, sin reseñas inventadas ni recomendaciones basadas en supuesta experiencia personal. Saludo: «¿Con hambre y sin ideas? ¡Para eso estoy yo!». Opciones:

1. «No sé qué comer» — «Descubre platos y encuentra dónde probarlos».
2. «Quiero algo típico» — «Explora los sabores tradicionales de Córdoba».
3. «Busco algo económico» — «Encuentra platos que se ajusten a tu presupuesto».
4. «Quiero comparar» — «Compara precios de un mismo plato».

Por defecto, panel cerrado en móvil y abierto en escritorio. Se reutiliza Manolo Chef y se respeta la información documentada del catálogo.

### Decisiones y trabajo pendiente antes del lanzamiento

1. **Nombre de la aplicación:** estudiar y elegir el nombre definitivo, sin cambiar todavía enlaces ni identificadores técnicos.
2. **Identidad ManoloLabs:** decidir el lema entre los candidatos documentados y revisar la coherencia visual y editorial de la marca.
3. **Experiencia final:** aplicar los ajustes acordados y revisar cómo queda la aplicación en móvil y escritorio, incluidos los primeros pasos de un visitante.
4. **Validación:** repetir las comprobaciones pertinentes sobre el SHA final tras los cambios; revisar datos, traducciones, accesibilidad y navegación.
5. **Publicación:** confirmar la fuente vigente de GitHub Pages en [Settings → Pages](https://github.com/Helioven/helio-gastro/settings/pages). El README documenta publicación desde `main`/`(root)` y el último despliegue confirmado procedía de `main`, pero la consulta de configuración de Pages devolvió 404; **no se debe asumir que fusionar es inocuo**.
6. **Autorización expresa:** solo cuando Helio haya visto el resultado y esté satisfecho, decidir si se abre PR, se fusiona y se publica. No hacer push a `main`, merge, despliegue ni anuncio público por iniciativa propia.

### Integración futura y reversión

Cuando se autorice el lanzamiento: comprobar nuevamente los SHA remotos, abrir PR a `main`, esperar los checks oficiales, fusionar únicamente con aprobación y verificar el despliegue del nuevo SHA. Si hubiera una regresión, preparar una reversión del commit de merge mediante PR y comprobar que Pages publica la versión restaurada. Publicar **no impide** continuar desarrollando nuevas versiones mediante ramas separadas.

**Próxima sesión:** retomar nombre, lema e identidad; aplicar cambios; inspeccionar el resultado; decidir sobre lanzamiento **solo después** de la validación y la aprobación explícita.

## HG-HOURS-002 — Primera ampliación de horarios (9 de noviembre de 2026)

- Rama local `codex/hg-hours-002`, basada en `9c51b9a` de `codex/helio-gastro-rediseno`. Diez fichas nuevas elevan la cobertura a **15 de 43 locales visibles**. Once tienen apertura publicada total o parcial, tres tienen discrepancias y una solo tiene tramos de servicio de comidas y cenas publicados. Los cinco registros originales y `data/places.json` permanecen intactos.
- `data/venue-hours.json` conserva las fuentes y evidencias comprobadas el 9 de noviembre. Casa Rubio presenta dos inicios nocturnos distintos en la misma página. Las versiones española e inglesa de Bodegas Mezquita Céspedes discrepan en el cierre de viernes y sábado. Ambos casos se muestran como conflicto. En Casa Pepe, los tramos de comida y cena se registran por separado. Taberna El Nº 10 deja lunes y martes sin confirmar. Las vísperas y festivos sin fecha y horario confirmados se documentan en la evidencia.
- `scripts/test-venue-hours.mjs` valida el esquema, los identificadores, los 15 registros en ES/EN/FR a 360 × 800 y 1365 × 900, y la visualización de una excepción sintética aislada en QA. La suite está incluida en `visual-qa`. Auditoría local del catálogo con 44 registros, 0 errores y 0 avisos. PASS local también en las regresiones de búsqueda, filtros, comparador y accesibilidad básica. CI oficial de la tanda pendiente.
- Siguiente tanda. Revisar los **28 locales visibles sin ficha de horarios**, priorizando fuentes oficiales específicas para cada sede. Confirmar por separado las discrepancias ya registradas y mantener como desconocidos los tramos sin respaldo.

## HG-HOURS-003 — Segunda ampliación de horarios (9 de noviembre de 2026)

- Base remota `codex/hg-hours-002` en `7103129`, con PASS de `catalog-audit` y `visual-qa` en la [ejecución oficial](https://github.com/Helioven/helio-gastro/actions/runs/42579519654). La rama `codex/hg-hours-003` añade diez registros y conserva los quince anteriores.
- Cobertura de **25 de 43 locales visibles**. Hay 20 aperturas publicadas (15 completas y cinco parciales), cuatro en conflicto y una sin confirmar. Cuatro fichas tienen intervalos de cocina publicados, tres completos y uno parcial. Se mantienen los 44 registros del catálogo y El Caballo Rojo oculto.
- En Con Acento Parrilla, tres páginas oficiales de la misma sede publican intervalos distintos. La ficha muestra el conflicto y enlaces con nombres distintos en ES/EN/FR. En ambas sedes Moriles, la cocina continua y el horario de festivos quedan en la evidencia. Las fuentes no fijan un cierre de cocina ni fechas concretas para las excepciones. En Beatillas consta el cierre semanal, pero faltan intervalos completos. Plateros San Francisco conserva el cierre nocturno sin precisar y La Tarterie deja el lunes sin confirmar.
- PASS local de horarios en las 25 fichas en ES/EN/FR a 360 × 800 y 1365 × 900, incluida una excepción fechada sintética aislada en QA. PASS local de búsqueda, filtros, comparador y accesibilidad básica. La auditoría local del catálogo devuelve 44 registros, 0 errores y 0 avisos. CI oficial de esta tanda pendiente.
- Siguiente paso. Revisar los **18 locales visibles sin ficha** por sede y confirmar los conflictos pendientes antes de publicar intervalos. Mantener separados apertura, cocina y servicios, con fecha y fuente en cada revisión.

## HG-HOURS-004 — Cierre de investigación de horarios

- 9 de noviembre de 2026. Rama `codex/hg-hours-004` sobre `cd7af2bc7f5cfab9cadac4cff9ad85e1991d5daa` de `codex/hg-hours-003`. Base remota comprobada con PASS de `catalog-audit` y `visual-qa` en la [ejecución oficial](https://github.com/Helioven/helio-gastro/actions/runs/42580951778).
- Los **43 locales visibles** tienen ficha documental en `data/venue-hours.json`. Apertura completa en 19, parcial en 5, desconocida en 15 y conflictiva en 4. Hay cuatro fichas con tramos de cocina publicados (tres completos y uno parcial) y una con comida y cena documentadas por separado. El catálogo conserva 44 registros y El Caballo Rojo sigue oculto.
- Esta tanda verifica apertura de Moriles · Ciudad Jardín, La Jineta, Roldán · Centro y La Sal. Las 14 fichas restantes conservan la fuente consultada y el motivo de la incertidumbre. El grupo Roldán mantiene horarios sin confirmar para la ficha colectiva porque el localizador distingue horarios por sede. La apertura de El Churrasco queda pendiente de confirmación tras detectar su web en mantenimiento. Las reglas genéricas de festivos quedan en la evidencia si no hay fechas publicadas.
- Continúan en conflicto Bodegas Campos, Casa Rubio, Bodegas Mezquita Céspedes y Con Acento Brasería. Se conservan las evidencias anteriores y se registran los hallazgos de la revisión. En Céspedes se añaden la página francesa y el artículo oficial sobre cocina continua, sin tratar la última comanda como cierre.
- QA local PASS en las 43 fichas en ES/EN/FR a 360 × 800 y 1365 × 900, incluidas regresiones de búsqueda, filtros, comparador, navegación y accesibilidad básica. Auditoría del catálogo con 44 registros, 0 errores y 0 avisos. La excepción fechada probada es sintética y permanece en QA.
- Siguiente paso. Ejecutar el CI oficial para el commit de cierre cuando la rama se suba. Para mejorar los datos, pedir confirmación al establecimiento de los cuatro conflictos y buscar horarios explícitos para las fichas parciales o desconocidas.

## HG-UI-ICONS-002 — Realismo minimalista

- Rama `codex/hg-ui-icons-002` sobre `0f2441e0e264119fb62c2f49448f110b15c33dce`, base HG-HOURS-004 con [CI oficial en verde](https://github.com/Helioven/helio-gastro/actions/runs/42582655137).
- `assets/ui/icons.svg` reúne los SVG originales de la maqueta B y variantes para cerrar, quitar, enlazar, volver y trazar una ruta. Los iconos son decorativos para tecnologías de asistencia. Las etiquetas traducibles y los estados de los controles se conservan por separado. El sprite se sirve localmente, sin dependencia de una biblioteca externa.
- Navegación, momentos, buscador, Manolo, resultados, fichas, favoritos, comparador y mapa comparten tratamiento visual. Los desplegables de horarios y de resultados conservan `details` y `summary`. «Sabores de Córdoba» usa un marco con relieve discreto sobre las imágenes existentes. La etiqueta de imagen ilustrativa se mantiene en ES/EN/FR.
- Los 44 registros del catálogo, las 43 fichas de horarios, las 17 ilustraciones y los recursos oficiales de marca se conservan byte a byte. El Caballo Rojo permanece oculto.
- QA local PASS en Chromium a 360 × 800 y 1365 × 900, en ES/EN/FR. Se verificaron renderizado SVG, teclado, foco, contraste de texto de los controles principales y objetivos de 44 px. Pasaron las regresiones de búsqueda, filtros, fichas, favoritos, comparador, mapas, navegación, Manolo, horarios, ilustraciones e idiomas. Auditoría del catálogo con 44 registros, 0 errores y 0 avisos.
- `scripts/test-ui-icons.mjs` forma parte de `visual-qa`. Las capturas antes/después se guardan fuera del repositorio. El CI de esta rama y la revisión de Helio quedan pendientes antes de integrar.

## HG-QA-FIX-001 — Metodología y comparación de tapas

- 9 de noviembre de 2026. Rama `codex/hg-images-001` sobre `241f5e201377752d2570b1e4aee858bea0182a51`. La [ejecución #906 del SHA base](https://github.com/Helioven/helio-gastro/actions/runs/42594076916) pasó `catalog-audit` y falló en `visual-qa` por la expectativa del emoji en `test-fr-visual.mjs`.
- La prueba de metodología verifica los encabezados ES/EN/FR, el SVG decorativo, el contenido y la restauración del idioma. En Cena → Tapas, el comparador exige elegir un plato y un formato documentado común a dos locales antes de mostrar precios. Sabores de Córdoba muestra tapas frías o calientes solo cuando la sección documentada lo indica. Las 194 filas con precio de los 13 locales quedan sin clasificación de temperatura con la evidencia actual.
- QA local PASS en las 73 comprobaciones del workflow tras reintentos, con casos específicos en ES/EN/FR a 360 × 800 y 1365 × 900. En paralelo, Salinas y El Pisto agotaron el tiempo de captura móvil y La Sal superó el límite del ejecutor. Las tres suites pasaron al repetirse por separado. Auditoría con 44 registros, 0 errores y 0 avisos. Se mantienen 43 locales visibles, El Caballo Rojo oculto y los datos, las imágenes, los horarios y sus fuentes.
- CI oficial del commit de cierre pendiente de verificación en `catalog-audit` y `visual-qa`. La validación de esta rama es independiente de la autorización de lanzamiento.

## HG-QA-CACHE-002 — Validación de imágenes durante la recarga

- 9 de noviembre de 2026. Rama `codex/hg-images-001`, base `b40783be49bc5036b9a733b173c59b8d357073f4`. El [CI de la base](https://github.com/Helioven/helio-gastro/actions/runs/42656080857) pasó `catalog-audit` y falló en `visual-qa` exclusivamente en `inventory-cache-reload.mjs`, con dos abortos de imágenes en escritorio.
- El inventario identifica las peticiones por documento y solo acepta `net::ERR_ABORTED` de una imagen que estaba pendiente en el documento saliente cuando comenzó la recarga. Para aceptarla exige una petición completada con HTTP 200 para la misma URL en el documento siguiente y comprueba que la imagen se decodifica y se renderiza. El informe separa `benignCancellations` de `networkFailures`.
- Siguen siendo fallos los abortos de la vista activa, los errores de red sin recuperación comprobada, los HTTP 4xx/5xx locales, los errores de JavaScript y las imágenes esperadas que faltan o no se decodifican. Un control provoca una cancelación saliente y comprueba su recuperación. Otros tres simulan un 404, un aborto en el documento restaurado y un WebP inválido con HTTP 200.
- QA local PASS en tres repeticiones de escritorio y móvil y en la ejecución de la batería completa. El control saliente registró la misma URL en los documentos 1 y 2, con HTTP 200 y decodificación y renderizado verificados en el segundo. Los tres controles negativos detectaron el fallo esperado. Las 73 comprobaciones del workflow pasaron tras repetir por separado dos suites que agotaron el tiempo local, `test-fr-detail-shell-pilot.mjs` y `test-fr-source-venue-triage.mjs`.
- CI oficial del commit `6e497b1` ([ejecución #42662844377](https://github.com/Helioven/helio-gastro/actions/runs/42662844377)): `catalog-audit` PASS y `visual-qa` FAIL por un timeout en `test-venue-hours.mjs`, no en `inventory-cache-reload.mjs`. La prueba de recarga pasó en escritorio y móvil, incluidos sus controles negativos. Las comprobaciones locales se ejecutaron en una copia temporal con Chrome y servidor estático local; el control de cancelación fue inducido para verificar la regla de clasificación.

## HG-QA-HOURS-006 — Robustez y diagnóstico del test de horarios

- 9 de noviembre de 2026. Rama `codex/hg-images-001` sobre `6e497b18ec4e10629dda13f19fd132d8932cf755`. El [CI de la base](https://github.com/Helioven/helio-gastro/actions/runs/42662844377) pasó `catalog-audit` y falló únicamente en `test-venue-hours.mjs` por un timeout al pulsar el botón de Bodegas Mezquita Céspedes. El diagnóstico local anterior no reprodujo ese timeout.
- La prueba exige una única tarjeta con el encabezado exacto del establecimiento. Comprueba por separado el clic normal, la identidad de la ficha y la visibilidad del panel de horarios. Al fallar conserva el FAIL y registra idioma, viewport, establecimiento, fase y recepción del evento de clic. Guarda el JSON, la captura y la traza de acciones en `qa-reports/`.
- Los controles negativos provocan una intercepción real del puntero y bloquean el manejador de apertura por separado. El primero falla antes de recibir el clic. El segundo recibe el clic, pero falla al comprobar la ficha.
- QA local PASS en ES/EN/FR a 360 × 800 y 1365 × 900, con 18 aperturas repetidas de Céspedes y los dos controles negativos. Un fallo inducido confirmó la creación de la traza ZIP, la captura PNG y el informe JSON. Las 73 comprobaciones del workflow pasaron en el primer intento de la batería completa, con Chrome y el servidor local en una copia temporal.
- **CI oficial PASS** del commit `653b17b9c892e502e5228b1c75ad788ffe61a8ab`: [`catalog-audit` y `visual-qa` en verde, ejecución #42668708415](https://github.com/Helioven/helio-gastro/actions/runs/42668708415). El cambio mejora la detección y el diagnóstico del fallo; la causa del timeout intermitente original sigue sin confirmarse. Esta validación no implica merge a `main` ni autorización de despliegue.

## HG-UI-PREMIUM-003 — Portada PlatoRadar

- La portada local adopta PlatoRadar by ManoloLabs y el lema «Córdoba se descubre a bocados.». Los identificadores de persistencia y las rutas se mantienen. La panorámica es una ilustración generada a partir de la referencia aprobada, guardada como WebP independiente de 1680 × 560. La cabecera usa el busto oficial con dos adornos SVG, y el panel conserva el Manolo Chef aprobado.
- Mapa reutiliza los mapas por establecimiento desde los resultados. Si hay un único resultado abre su mapa. Sugerencias lleva a la selección gastronómica existente. El buzón sigue siendo un prototipo de QA y requiere autorización aparte para activarse. El comparador y la orientación conservan sus componentes existentes.
- QA local con Chromium en escritorio, tableta y móvil. La prueba de portada verifica navegación, accesos, ES/EN/FR y el mapa mediante una respuesta de prueba para el iframe externo. Pasaron además 14 regresiones seleccionadas, incluida la auditoría del catálogo. CI oficial pendiente.

## HG-QA-FINAL-006 — Resultados vacíos y pruebas históricas

- 10 de noviembre de 2026. Rama `codex/hg-premium-fase-1`, base `051cef7ced133ab16e8b3efb2270cfa3904ba7f6`. Se reprodujo una búsqueda sin coincidencias en francés con el contador y el aviso en español. La traducción se aplica al contador de resultados y al aviso de búsqueda sin coincidencias. La regresión verifica 0, 1 y 32 resultados en ES/EN/FR sin cambiar la búsqueda.
- Las seis pruebas históricas `test-fr-la-cazuela-{12,24,36,48,60,72}.mjs` cubren los prefijos de 12, 24, 36, 48, 60 y 84 descripciones. El nombre histórico `72` se conserva y su conjunto incluye el lote 079, por lo que valida 84. Cada prueba exige todos los textos de sus lotes en el mismo orden y permite los lotes posteriores. `test-fr-la-cazuela-89.mjs` sigue comprobando las 89 descripciones completas. El catálogo y los lotes de traducción se mantienen.
- QA local PASS en 84 comprobaciones, con 75 del workflow y 9 pruebas adicionales. Pasaron las seis pruebas históricas y la de 89 descripciones. Se repitieron la prueba de resultados tras corregir el singular francés y El Poema Alonso tras un timeout del ejecutor. Sintaxis PASS en 87 archivos. El estado vacío francés se revisó visualmente a 320 × 700.
- CI oficial de la corrección pendiente en el SHA que la contiene.

## HG-PROD-HOTFIX-004 — Ilustraciones y recuentos de PlatoRadar

- Las tarjetas de desayuno y merienda usan ocho WebP aprobados con etiquetas y textos alternativos en ES/EN/FR. Si falta una imagen, la tarjeta conserva el texto y la acción sin mostrar un marco vacío.
- Los recuentos distinguen locales registrados y locales con precio registrado. La carta transcrita de Moriles Ciudad Jardín respalda Mollete de Antequera y Mollete rústico cordobés en desayuno y merienda. Ambas variantes cuentan como un único local y sus importes no acreditan vigencia.
- Situación observada el 10 de noviembre de 2026. El cargador valida y aplica los 107 lotes como un conjunto. Con los 107 lotes disponibles, La Montillana se traduce y el flujo de accesibilidad pasa. Al simular HTTP 503 en el lote 107 de Moriles Ribera, el cargador descarta el conjunto y La Montillana queda sin traducción. Esta prueba demuestra la dependencia entre lotes, pero no confirma la causa del timeout original. El cargador y la comprobación de accesibilidad se conservaron en aquella fase. La revisión técnica del 11 de noviembre documenta la recuperación incorporada después.

## Pendientes antes del cierre y publicación

### Estado actual

- HG-PROD-HOTFIX-001/002/003 están implementados localmente en `codex/hg-prod-hotfix-001`, sobre la base `f986627`.
- El hotfix integra ocho ilustraciones gastronómicas y corrige los recuentos de locales y precios registrados y la clasificación de los molletes de Moriles Ciudad Jardín en desayuno y merienda.
- Los cambios siguen sin commit, push, merge ni despliegue.

### Validación pendiente

- El timeout histórico de 30 segundos al esperar `DOMContentLoaded` en escritorio sigue sin causa confirmada. El 11 de noviembre la prueba de recarga pasó en el diagnóstico inicial, en las pruebas afectadas y en la batería completa, con sus controles de cancelación, HTTP 404 y WebP inválido.
- Las suites pendientes del balance del 10 de noviembre tienen PASS local en el balance del 11 de noviembre. Recuentos e iconos necesitaron reintento en la batería completa. Rendimiento francés y búsqueda premium pasaron a la primera.
- Balance del 11 de noviembre de 2026, 85/85 PASS local, con 69 a la primera y 16 tras un reintento. FAIL finales 0. El flujo de accesibilidad de La Montillana en ES/EN/FR pasó a la primera. Las limitaciones del entorno y el CI pendiente se detallan más abajo.
- El cargador francés valida y aplica los 107 lotes como un conjunto. Un HTTP 503 simulado en el lote 107 de Moriles Ribera impidió aplicar las traducciones, incluida la de La Montillana. La causa del timeout original sigue sin confirmar.
- Ejecutar `catalog-audit` y `visual-qa` en GitHub Actions sobre el SHA exacto del futuro commit. La validación oficial de estos cambios continúa pendiente.

### Unificación definitiva de Manolo

- Usar como modelo maestro el Manolo original de la cabecera, cuyo diseño ya está aprobado. «Manolo te orienta» debe mostrar exactamente el mismo robot y conservar cabeza, gafas, antenas, bigote, expresión, cuerpo, proporciones y detalles luminosos.
- Añadir únicamente el gorro de cocinero y el mandil, sin reinterpretar al personaje. Mantener intactos la cabecera y el diseño aprobado de la página.
- Sustituir la ilustración del cocinero solo después de que el usuario apruebe visualmente la imagen definitiva.

### Cierre final

1. Validar la imagen definitiva de Manolo y completar las comprobaciones técnicas pendientes.
2. Crear el commit y hacer push de la rama únicamente tras recibir autorización.
3. Verificar el CI del SHA exacto, preparar la PR y solicitar autorización antes del merge y del despliegue.
4. Comprobar la web publicada y dar por cerrada esta versión de PlatoRadar.
5. Continuar con Manolo Meteo.


## Revisión técnica del cierre — 11 de noviembre de 2026

- Rama local `codex/hg-prod-hotfix-001`, base `f986627fbef8a2c6544607495b7975523631abda`. Las ocho imágenes, sus asociaciones y los molletes de Moriles conservan su aprobación. Los dos molletes y cuatro importes cuentan una sola ficha en desayuno y merienda. Catálogo de 44 registros, 43 visibles y El Caballo Rojo oculto.
- Recarga de escritorio. El diagnóstico registró los eventos DOMContentLoaded y las peticiones pendientes, y pasó con el test existente. La prueba específica y la batería completa también pasaron. Durante la batería, la prueba de recuentos agotó una espera de recarga y pasó en el reintento. No se ha demostrado una causa funcional ni una causa exclusivamente ambiental para los timeouts históricos. Se conservan las esperas, los controles negativos y las aserciones.
- Traducción francesa. Cada lote se descarga y decodifica antes de esperar al conjunto. El cargador permite como máximo dos intentos por lote ante un error de red o HTTP 503. Un error HTTP persistente o un JSON inválido sigue rechazando la carga. La validación completa precede a cualquier aplicación de traducciones. Tras un rechazo se libera la promesa para permitir un nuevo intento. Los 107 lotes siguen sujetos a validación conjunta.
- `scripts/test-fr-overlay-recovery.mjs` verifica un 503 transitorio, un 503 persistente y un JSON inválido a 1365 y 360 px. Comprueba el límite de intentos, las llamadas concurrentes, la ausencia de aplicación parcial, la recuperación posterior y la conservación de los datos ES/EN. Los seis escenarios pasaron a la primera. La nueva prueba queda incluida en el workflow oficial.
- Antes de la regresión completa pasaron las pruebas afectadas de imágenes, recuentos y recarga. Sintaxis PASS en 88 archivos. La batería ejecutó 76 comprobaciones del workflow y 9 adicionales, con 85/85 PASS. Pasaron a la primera catálogo, ilustraciones, búsqueda, filtros, comparador, recarga, recuperación francesa, accesibilidad, horarios, portada, búsqueda premium, rendimiento francés y contraste.
- Necesitaron un reintento las suites `test-recommendation-count-i18n`, `test-fr-beatillas-roldan-dynamic`, `test-fr-bar-marta-17`, `test-fr-la-tarterie-28`, `test-fr-el-numero-10-37`, `test-fr-plateros-san-francisco-46`, `test-fr-taberna-salinas-56`, `test-fr-taberna-la-sal-60`, `test-fr-rincon-beatillas-75`, `test-fr-don-pepe-ciudad-jardin-12`, `test-fr-source-venue-triage`, `test-fr-favorites-populated`, `test-manolo-guide`, `test-ui-icons`, `test-fr-la-cazuela-24` y `test-fr-la-cazuela-72`. Sus primeras ejecuciones agotaron esperas. Los registros de ambos intentos se conservan fuera de los archivos de aplicación.
- Entorno local Windows, Node.js 24 y Playwright 1.56.1 con Chromium 141. Las pruebas se ejecutaron en serie sobre una copia temporal, con puerto 8799 y servidor estático local que comprime los recursos de texto. Los cambios temporales de puerto y diagnóstico no forman parte de las pruebas del repositorio. La validación oficial pendiente usa Ubuntu, Node.js 22 y el servidor Python del workflow.
- Para reproducir los controles de recuperación en el entorno del workflow, servir la raíz en 127.0.0.1:8765 y ejecutar `node scripts/test-fr-overlay-recovery.mjs`. Después ejecutar las suites enumeradas en `.github/workflows/data-qa.yml`. Los controles no consultan proveedores ni fuentes externas.
- No ejecutados en esta revisión, CI oficial del futuro commit, lectores de pantalla y dispositivos físicos. Quedan pendientes la aprobación de la unificación visual de Manolo, la autorización de commit y sincronización y la validación del SHA exacto en GitHub Actions antes de plantear la publicación.
