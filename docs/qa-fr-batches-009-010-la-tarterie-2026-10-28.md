# QA FR — Lotes 009 y 010, La Tarterie (28/10/2026)

**Estado:** 18 traducciones candidatas añadidas en dos lotes de 9, completando **28/28** descripciones ES/EN inventariadas del local junto con el lote 008.

- Fuente de verdad: `data/places.json`, registros ES/EN extraídos mediante `scripts/inspect-next-fr-restaurant.mjs` y registros de GitHub Actions. Índices del 009: 0:10–0:18. Índices del 010: 0:19–0:24 y 1:0–1:2.
- Precauciones trasladadas al francés: la tarta de manzana se presenta como apta para personas que no toman lácteos **según el establecimiento y sin certificación independiente**; en la mousse de mojito **no se ha verificado ausencia de alcohol**. No omitir estas advertencias al publicar.
- Se mantienen denominaciones como `pisto`, `turrón`, `dulce de leche`, `Baileys` y `Amaretto` donde corresponden. No se añaden precios, formatos ni ingredientes.
- `app.js` carga los diez lotes FR solo con `?qa_fr=1`; las 28 descripciones de La Tarterie están en overlay de memoria. Sin modificaciones de `data/places.json` o `main`.
- El test `scripts/test-fr-la-tarterie-28.mjs` comprueba en escritorio y móvil la ficha, las 28 traducciones FR, los títulos ES/EN y la ausencia de desbordamiento.
- **Pendiente de verificación:** resultado de la última ejecución GitHub Actions, revisión visual editorial y revisión lingüística nativa. No publicar ni fusionar todavía.
