# QA FR — Lote 004: Churros Bar Marta (28/10/2026)

**Estado:** 10 traducciones francesas candidatas; no publicadas ni cargadas en la interfaz. Fuente: campos ES/EN de `data/places.json` extraídos por `scripts/inspect-next-fr-restaurant.mjs` en GitHub Actions. La lectura del catálogo no confirma por sí sola vigencia de la carta.

- Local: `churros-bar-marta`. Primeras diez entradas de la sección 0, índices 0–9; del inventario inicial de 17 descripciones con ES/EN.
- Se distingue `media tostada` de `tostada entera`, y `media ración` de `ración entera` de churros. `York` se explica como `jambon blanc`; `jamón serrano` conserva su denominación.
- El precio, los formatos registrados y los datos de origen no se modifican. No se añade ningún ingrediente ni se afirma disponibilidad por horario.
- Control automatizado: `scripts/validate-french-batch.mjs`, `scripts/test-fr-batch-inventory.mjs` y simulación `scripts/test-fr-overlay-integrity.mjs` sobre todos los lotes. Pendiente confirmar la última ejecución de CI y revisión semántica/visual.
- Las siete descripciones restantes requerirán extracción y traducción por otro lote. No activar este restaurante en `?qa_fr=1` hasta tener validación de candidatos y pruebas de integración específicas.
