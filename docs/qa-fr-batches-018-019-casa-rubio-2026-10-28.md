# QA FR — Lotes 018 y 019 Casa Rubio (28/10/2026)

- 24 descripciones francesas candidatas nuevas, 12 por lote; con lote 017 se alcanza **36/36** descripciones candidatas de Casa Rubio.
- Fuente ES/EN: catálogo real `data/places.json`, inspeccionado en GitHub Actions #40652895955; registros tras la primera docena (secciones 1–5).
- Conservados gramajes, opciones por unidades y denominaciones gastronómicas. No añadir ingredientes, precios ni modalidades ajenas a la fuente. Nombres como rosada, pisto, torreznos, flamenquín y tocino de cielo se conservan cuando la precisión lo requiere.
- `app.js` carga 19 lotes que totalizan 198 propuestas, solo mediante `?qa_fr=1`; sin cambios en `data/places.json` ni `main`.
- `scripts/test-fr-casa-rubio-36.mjs` comprueba las 36 descripciones, textos ES/EN y ausencia de desbordamiento horizontal en móvil y escritorio. Incluido en workflow.
- **Pendientes:** resultado CI, revisión visual humana, revisión lingüística nativa y autorización editorial; PASS técnico no equivale a aprobación de publicación ni traducción integral de títulos e interfaz.
