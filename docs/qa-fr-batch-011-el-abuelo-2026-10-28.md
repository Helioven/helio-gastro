# QA FR — Lote 011: Taberna El Abuelo (28/10/2026)

**Estado:** 10 propuestas francesas candidatas de 31 entradas ES/EN inventariadas, sin integración en interfaz ni cambios de `data/places.json`.

- Fuente: descripciones ES/EN del catálogo real recuperadas por `scripts/inspect-next-fr-restaurant.mjs` en GitHub Actions #40650440959. Sección 0, índices 0–9.
- Archivo: `translations/fr/batch-011-taberna-el-abuelo.json`.
- Las entradas de origen son denominaciones breves, no descripciones de ingredientes. Se traduce su significado explícito sin añadir composición ni formatos. Para `japuta` y `rosada` se conserva el nombre comercial para no asignar especie zoológica no verificada; se conserva `adobo` como preparación tradicional.
- Pendientes: CI, revisión contextual y lingüística, otras 21 entradas y pruebas visuales antes de su incorporación al modo francés de QA.
- `main`, precios, cartas originales y fichas editoriales quedan intactos.
