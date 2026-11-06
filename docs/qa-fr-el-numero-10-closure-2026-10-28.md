# Cierre técnico FR — Taberna El Nº 10 (28/10/2026)

- **37/37** descripciones francesas **candidatas** preparadas en lotes 020–022 e integradas solo en `?qa_fr=1`.
- Primer QA del navegador [#40653979630](https://github.com/Helioven/helio-gastro/actions/runs/40653979630): **FAIL** en escritorio y móvil (0/37 descripciones visibles). Causa confirmada: faltaba `taberna-el-numero-10` en la lista de establecimientos que permiten renderizar explicaciones FR; no era un fallo de las traducciones.
- Corrección mínima en `app.js`, commit `0930b478`. Repetición [#40654228938](https://github.com/Helioven/helio-gastro/actions/runs/40654228938): **SUCCESS** del workflow, con auditoría de catálogo y QA visual/regresión.
- Con estos tres lotes, el piloto alcanza **8 restaurantes y 235 descripciones francesas candidatas**. No comprende aún títulos, secciones ni todos los textos de interfaz.
- Se conservan expresamente los gramos, unidades, ingredientes, preparaciones declaradas y advertencias cuando falta información. `data/places.json`, precios y `main` no se han modificado.
- **Cierre técnico solamente**: pendiente revisión humana semántica y lingüística, y aprobación editorial previa a publicación.
