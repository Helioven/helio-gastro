# QA FR — Lote 007: Cafetería Bar La Jineta (28/10/2026)

**Estado:** 12 propuestas francesas nuevas (lote 007), integradas con las 10 del lote 006 solo en `?qa_fr=1`. Total: **22 descripciones candidatas** para La Jineta.

- Fuentes ES/EN: registros reales de `data/places.json`, extraídos mediante el inventario de lectura en GitHub Actions. Índices del lote 007: 2:3–2:4 (bocadillos), 3:0–3:3 (tostas), 4:0–4:5 (cazuelitas).
- Terminología conservada: `pinchitos`, `lomo de orza`, `pimientos del piquillo`, `ensaladilla`, `salmorejo`, `Pedro Ximénez`, `chorizo`. No inferir composición exacta de preparados ni tipo de carne de `pinchitos`.
- `app.js` carga los siete lotes 001–007 solo en QA, sin modificar `data/places.json`. El nuevo test `scripts/test-fr-la-jineta-22.mjs` comprueba 22 explicaciones FR, sus textos y la permanencia de títulos ES/EN en escritorio y móvil.
- **Pendiente:** resultado CI de la batería actual; revisión lingüística nativa y aprobación editorial/humana. No publicar ni fusionar a `main`.
