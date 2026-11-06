# QA FR — Lotes 012–013, Taberna El Abuelo (28/10/2026)

**Estado:** las 21 traducciones restantes están preparadas (10 + 11), junto con 10 del lote 011: **31/31 entradas candidatas**.

- Fuente de verdad: descripciones ES y EN del catálogo en `data/places.json`, inspeccionadas desde GitHub Actions en la ejecución #40650774174, índice 0:10–0:30.
- Los lotes `translations/fr/batch-012-taberna-el-abuelo.json` y `batch-013-taberna-el-abuelo.json` conservan denominaciones como `flamenquín`, `torreznos`, `criadillas`, `salmorejo`, `pisto` y `adobo`; no añaden ingredientes, precios ni información de disponibilidad.
- `app.js` aplica las 31 descripciones en memoria únicamente al activar `?qa_fr=1`. Los controles validan 128 entradas acumuladas en 13 lotes y evitan cambios en el catálogo.
- `scripts/test-fr-el-abuelo-31.mjs` comprueba visualización francesa, orden, textos, títulos ES/EN y ausencia de desbordamiento en escritorio y móvil. Incluido en GitHub Actions.
- **Pendiente:** resultado de CI del commit del workflow, inspección visual humana, revisión lingüística nativa y autorización editorial. No se considera traducción completa de los títulos de platos o de toda la interfaz, ni se ha fusionado a `main`.
