# QA FR — Lote 017, Restaurante Casa Rubio (28/10/2026)

**Estado:** 12 descripciones FR candidatas de 36 entradas ES/EN inventariadas; aún sin integración en la interfaz.

- Fuente: campos ES/EN reales de `data/places.json`, extraídos mediante `scripts/inspect-next-fr-restaurant.mjs` y registros GitHub Actions #40652607945.
- Traducciones: `translations/fr/batch-017-casa-rubio.json`, sección 0 índices 0–10 y sección 1 índice 0.
- Se conservan los gramajes originales (60/100 g, 100/150 g, 90/160 g, 200/300 g, 150 g), las opciones de seis/nueve croquetas, denominaciones tradicionales (`salmorejo`, `mazamorra`, `flamenquín`, `puchero`, `adobo`) y los ingredientes documentados.
- No se han añadido precios, ingredientes ni disponibilidad. Se ha evitado traducir `miel de caña` como miel de abeja: se usa sirop de canne.
- Las 24 descripciones restantes se abordarán en lotes controlados. Pendientes CI, revisión semántica/lingüística e integración y prueba visual ES/EN/FR. Sin cambios en `data/places.json` ni `main`.
