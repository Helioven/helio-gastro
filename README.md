# Helio Gastro 1.0 — piloto

Aplicación estática y mobile-first de búsqueda gastronómica en Córdoba. Proyecto de Helio Software Studios.

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
