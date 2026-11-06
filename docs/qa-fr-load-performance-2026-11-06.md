# QA integral — HG-QA-PERF-001 · Inventario de carga del francés
**Fecha:** 6 de noviembre de 2026. **Rama:** `audit/fr-load-performance-20261106`. **Código de base:** `224c1e7` (PR #45 integrado).

## Motivo
En la versión pública `app.js` carga mediante `Promise.all` una lista de 107 lotes `translations/fr/batch-*.json` cuando se inicializa. Antes de decidir optimizaciones hay que medir cuántas peticiones se producen, qué carga representan y si se observan errores; esto incluye la primera visita en español.

## Prueba incorporada
`scripts/inventory-fr-load-performance.mjs`, añadida a `visual-qa`: en el servidor HTTP local de GitHub Actions, mide en Chromium con escritorio y viewport de iPhone 13:
- Número efectivo de solicitudes de lotes, comparado con el número de archivos reales.
- Bytes codificados/decodificados y transferencia según Performance API.
- Tiempo aproximado hasta que el catálogo y la primera descripción FR están disponibles; duración máxima y último fin de respuesta de los lotes.
- Errores JavaScript, solicitudes fallidas, selector público FR y exclusión de El Caballo Rojo.

**No usar umbrales arbitrarios de velocidad**, no simular que el runner es un teléfono real o una red móvil, ni suponer que `transferSize` son bytes facturados por un usuario: son indicadores del navegador bajo CI local. La medición es exploratoria; solo fallará por falta de lotes, errores de red, duplicados o regresiones de integridad visibles. Sus resultados se guardan en `qa-reports/fr-load-performance.json`.

## Riesgos / próximos pasos
Si la carga inicial de 107 lotes resulta significativa, evaluar alternativas **por separado**, con regresión en ES/EN/FR: carga diferida al seleccionar FR, un manifiesto de lotes, o agrupación; nunca alterar el catálogo ni las traducciones para «optimizar». Una mejora de producto requiere medir nuevamente antes/después y revisar caché, uso offline y accesibilidad.

**Estado en el momento de crear esta prueba:** implementada en rama; **CI aún pendiente**, no se declara resultado medido ni PASS. El resto de la fase integral sigue como en `docs/qa-integral-baseline-2026-11-06.md`.
