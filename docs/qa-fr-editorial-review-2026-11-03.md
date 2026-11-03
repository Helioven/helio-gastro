# Revisión preliminar FR — 3 de noviembre de 2026

**Ámbito:** rama `feature/fr-integration-qa-20261027`; francés solo en `?qa_fr=1`. Revisión documental y semántica preliminar, **no aprobación editorial, lingüística nativa ni visual**.

## Evidencia técnica previa

- El responsable confirmó PASS del último inventario de textos y desbordamientos.
- `FR CATALOG SWEEP`: **0 candidatos heurísticos en 43 fichas ordinarias**; El Caballo Rojo es una excepción documental separada.
- Triaje horizontal: **0 candidatos** en escritorio/móvil. El resultado no acredita visualmente todas las pantallas.
- Vistas adicionales `home`, `search`, `favorites`, Montillana, Beatillas, Rubio y Roldán: **0 candidatos** por perfil en el informe aportado.

## Primera muestra lingüística: Taberna La Montillana

**Fuente cotejada:** `data/places.json` (`menuSections[].items[].es` / nombres originales) con `translations/fr/batch-001-la-montillana.json`, `batch-002-la-montillana.json` y `batch-003-la-montillana.json`.

- **30/30 descripciones francesas revisadas preliminarmente** a partir de los textos de la rama: secciones 0 a 5, índices documentados en los tres lotes.
- Se conservan a primera lectura los ingredientes y preparaciones mencionados en la descripción española: salmorejo, mazamorra, pescado, carnes, salsas y postres. **No se ha verificado de nuevo la exactitud del origen gastronómico frente a cartas externas.**
- Los tres JSON se declaran `candidate_awaiting_semantic_review`: **no cambiar el estado a aprobado** con esta inspección.
- **Observación editorial no bloqueante y sin defecto confirmado:** `Manolete` se describe como `Pâtisserie Manolete...`. El nombre tradicional está presente; conviene comprobar con revisión francófona que la denominación y explicación resulten naturales y no induzcan a confundirlo con otra elaboración.
- Prestar también atención editorial al uso de términos específicos conservados (`salmorejo`, `mazamorra`, `flamenquín`, `rabo de toro`, `turrón` y `dulce de leche merengada`). No traducirlos automáticamente ni alterar recetas.

## Pendientes para cerrar la fase

1. Revisión lingüística y gastronómica de los demás lotes/frases FR, con evidencia por establecimiento y diferenciando errores confirmados de propuestas de estilo.
2. Inspección manual de las capturas `qa-reports/screenshots/fr-detail-triage/` y de los flujos principales en escritorio y móvil; el CI solo aporta evidencia técnica.
3. Revisión de accesibilidad y consistencia ES/EN/FR; documentar defectos con pasos, resultado esperado, real y severidad.
4. El Caballo Rojo: mantener la excepción documental separada hasta resolver editorialmente su situación.
5. Regresión final y autorización expresa antes de activar públicamente el francés o fusionar en `main`.

**Cambios realizados por esta revisión:** solo documentación; no cambios de cartas, precios, ingredientes, `data/places.json`, código de producción ni `main`.


## Segunda muestra: Moriles Ribera — fuentes y procedencia

**Tipo de control ejecutado:** cotejo documental **ES/EN/FR de 13 etiquetas de fuentes** con las entradas originales de `data/places.json` y las propuestas visibles de `frenchSourceLabels` en `i18n.js`. No se han inspeccionado los archivos externos de las cartas ni los lotes de descripciones del restaurante en esta ronda.

| Aspecto | Resultado preliminar |
|---|---|
| Enlaces de fuentes registrados | **13/13** tienen propuesta de etiqueta francesa en el mapa de presentación |
| Carta española de febrero de 2026 | Se conserva explícitamente febrero de 2026 en cinco referencias de platos |
| Postres de marzo de 2026 | Las dos referencias conservan marzo de 2026 |
| Carta inglesa de contraste de 2025 | La etiqueta FR mantiene el año 2025 y la prohibición de mezclar precios |
| Menú Tapas Cordobesas | Mantiene la denominación cultural original entre comillas |
| Enlaces ingleses `Suggested Menu` y `Glossary` | Se conservan los títulos originales, identificados como contenidos en inglés |
| Importes / ingredientes | **No revisados en esta muestra**; sin alteraciones del catálogo |

**Observaciones editoriales no confirmadas como defectos:**
- `ibéricos` se presenta como `charcuteries ibériques` en una fuente de febrero de 2026. Es una concreción semántica potencialmente más estrecha que el encabezado original; contrastar con el contenido de la carta y con la nomenclatura del establecimiento antes de retocar.
- `revueltos` se muestra como `œufs brouillés garnis`, explicación plausible del tipo de plato, pero revisar naturalidad gastronómica y fidelidad con la carta real.
- Algunas traducciones francesas siguen siendo **propuestas**; haber superado las regresiones de etiquetas y enlaces no acredita su aprobación lingüística.

**Estado de esta muestra:** cotejo documental preliminar de 13/13 etiquetas; **revisión de platos, recetas, ingredientes, cartas externas y capturas visuales pendiente**. No actualizar el estado de aprobación de los lotes FR ni activar el idioma público.
