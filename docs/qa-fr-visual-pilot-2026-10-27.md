# QA visual — piloto FR La Montillana — 2026-10-27

## Alcance
Página aislada `qa-fr-la-montillana.html`; lote `translations/fr/batch-001-la-montillana.json`. No se ha evaluado la aplicación principal en francés ni se ha publicado el piloto.

## Ejecuciones
- Intento 1: https://github.com/Helioven/helio-gastro/actions/runs/40479851088 — catalog-audit PASS; visual-qa FAIL antes de abrir navegador porque Playwright 1.56.1 no admite Ubuntu 26.04 del runner.
- Corrección de infraestructura: job visual dentro de `mcr.microsoft.com/playwright:v1.56.1-noble`.
- Ejecución válida: https://github.com/Helioven/helio-gastro/actions/runs/40480100402 — ambos jobs PASS.

## Resultados verificados por Chromium
- Escritorio 1365×900: 15 registros, ES/EN/FR distintos, 0 errores, 0 desbordamientos horizontales.
- Móvil (perfil iPhone 13, 390×664): 15 registros, ES/EN/FR distintos, 0 errores, 0 desbordamientos horizontales.
- 6 capturas de página completa y JSON: https://github.com/Helioven/helio-gastro/actions/runs/40480100402/artifacts/12723185392

## Alcance y límites
Se han probado select, HTML lang, número de tarjetas, primera descripción en cada idioma, consola/pageerror y overflow de documento. **No se ha inspeccionado manualmente cada captura**, ni se ha probado en dispositivos físicos, lectores de pantalla o navegador Safari real. La comprobación de textos distintos compara la primera descripción, no cada una de las quince. No se ha verificado traducción francesa del encabezado, secciones o toda la aplicación: es piloto aislado.

## Estado
Prueba funcional de navegador: SUPERADA. Inspección visual manual, accesibilidad ampliada y regresión de aplicación principal: PENDIENTES. `data/places.json` y producción no modificados.
