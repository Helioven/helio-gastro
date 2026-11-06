# QA FR — Lotes 015 y 016 Taberna La Viuda (28/10/2026)

**Estado:** 22 descripciones francesas candidatas adicionales (11 + 11), completando las **34/34** propuestas de La Viuda con el lote 014.

- Texto fuente: ES/EN de `data/places.json` consultado a través de `scripts/inspect-next-fr-restaurant.mjs`, ejecución #40652197061. Índices: 1:3–1:7, 2:0–2:5, 3:0–3:2, 4:0–4:3, 5:0–5:3.
- Se respetan las reservas editoriales originales: no se especifica el relleno del flamenquín cordobés tradicional y el churrasco de bellota es estacional. Se mantienen nombres tradicionales como `pisto`, `gulas`, `tagarninas`, `gazpachuelo`, `rabo de toro`, `manteca colorá`, sin inventar ingredientes.
- Todos los lotes se cargan solo en memoria con `?qa_fr=1`; `data/places.json`, formatos, precios y `main` no se modifican.
- Se añade `scripts/test-fr-la-viuda-34.mjs` al workflow para comprobar los 34 textos, títulos ES/EN y desbordamiento de pantalla en escritorio/móvil.
- **Pendientes:** resultado CI definitivo, revisión visual humana y revisión lingüística nativa; no equivale a traducción total de interfaz, nombres de platos ni autorización para publicar.
