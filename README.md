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
