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
