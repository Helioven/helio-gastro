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
