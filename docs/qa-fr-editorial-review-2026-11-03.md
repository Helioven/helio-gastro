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


## Tercera muestra: Moriles Casa Fina — fuentes y menú especial

**Control ejecutado:** cotejo documental de las **8 fuentes** del registro `moriles-casa-fina`, sus etiquetas ES/EN/FR y enlaces del catálogo, con el mapa `frenchSourceLabels` de `i18n.js`. Inspección de los metadatos de `officialSetMenus`; no se han revisado de nuevo las páginas externas ni todas las descripciones de platos.

| Elemento | Evidencia del repositorio | Estado |
|---|---|---|
| Fuentes de Casa Fina | 8 entradas, 8 etiquetas FR diferenciadas; URLs asociadas al dominio de Casa Fina | Cotejo de metadatos realizado |
| Carta española frente a inglesa | `Nuestra cocina` y `Carta inglesa` tienen enlaces distintos y etiquetas que indican el idioma | Diferenciación mantenida |
| Menús sugeridos, glosario y eventos | Enlaces separados con etiquetas específicas | Sin mezcla visible de fuentes en el catálogo |
| Menú `Tapas Cordobesas` | `officialSetMenus`: nombre original, nombre inglés, precio documentado **15,95 €**, 8 opciones de platos y 4 de bebidas | Metadatos comprobados, sin alterar importes |
| Vigencia | La presentación FR muestra `Validité à confirmer` y la ES recupera `Vigencia pendiente de confirmar`, según regresión `e28e171` con PASS comunicado por el responsable | Regresión técnica superada, vigencia real **no verificada** |

**Propuesta lingüística, no defecto confirmado:** el original de fuente `Cafés y chocolates` tiene equivalente inglés `Coffee and hot chocolate`, mientras que la etiqueta FR actual es `Cafés et chocolats`. En francés, `chocolats` puede también designar bombones; considerar `Cafés et chocolats chauds` una vez revisado el contenido original de esa sección. **No cambiar el texto sin aprobación editorial o corroboración de la fuente.**

**Límites:** esta revisión documental no demuestra la corrección semántica de las 15 secciones de platos ni de sus ingredientes, ni acredita inspección visual de la ficha. Ningún estado de traducción se eleva a aprobado. Se mantiene separación estricta de Moriles Ribera y Casa Fina, aunque existan páginas de nombre parecido.


## Cuarta muestra: La Tarterie y Pastelerías Roldán Centro

**Método:** cotejo documental del registro real en `data/places.json`, etiquetas FR en `i18n.js` y metadatos de menús. No se han consultado de nuevo las webs comerciales ni examinado las capturas manualmente. No es una certificación visual ni validación de vigencia.

### La Tarterie (`la-tarterie-centro`)

- **Una fuente documental**: tienda oficial; la etiqueta FR propuesta conserva el alcance de `catálogo y precios por producto` como `catalogue et prix par produit`.
- **28 productos**, repartidos en 25 de `Tartas y dulces` y 3 de `Salados`, con `priceRangeEur` en los 28 registros. Son **rangos mínimo–máximo de producto completo**, sin atribución a un tamaño concreto ni a porciones individuales.
- `menuPublicNoticeEs` y `menuPublicNoticeEn` distinguen expresamente **tartas completas/productos salados frente a porciones** y alertan de que las variantes especiales no garantizan ausencia de alérgenos.
- `menuSourceNote` registra transcripción de catálogo/capturas del 23–24/10/2026, alérgenos pendientes, disponibilidad estacional no confirmada, no inclusión en comparador monetario y ausencia de fotografías reutilizadas.
- **Estado:** metadatos y salvaguardas cotejados en catálogo. No se han validado contra la web actual, ni la equivalencia exacta de todas las descripciones FR de producto.

### Pastelerías Roldán — Centro (`pastelerias-roldan-centro`)

- **Dos fuentes diferentes**: carta de Pastelería Centro (barra/mesa, disponibilidad variable) y carta de desayunos Centro (disponibilidad de tostadas en merienda no confirmada). Las dos etiquetas propuestas FR mantienen estas distinciones.
- **Dos servicios en el catálogo:** `desayuno` con **54 entradas** de precio en `dishPrices`, y `merienda` con **31 entradas**; los formatos registrados incluyen `unidad`, `media-tostada`, `tostada-entera` y `suplemento` (este último en desayuno). Son números de **registros de precio**, no de platos únicos ni confirmación de disponibilidad actual.
- El `priceStatus` de Centro figura como `unknown`. No afirmar que todos los precios están vigentes, ni que las tostadas se sirven en merienda, por aparecer en esa sección documental.
- **Distinción obligatoria:** `pastelerias-roldan-tiendas` es otra ficha con carta general; no mezclar ni extrapolar sus importes a Centro.
- **Estado:** cotejo de procedencia, formatos y advertencias; pendientes contraste actual de disponibilidad, calidad de todos los textos FR y revisión de capturas.

**Resultado conjunto:** no se ha detectado contradicción de metadatos en los campos cotejados. No se proponen cambios de traducción ni de datos sin evidencia adicional. La revisión editorial/lingüística nativa y la comprobación visual manual siguen pendientes; ninguna de las fichas se considera aprobada para publicación.

## Cierre técnico: aviso de Casa Fina y control visual pendiente

**Evidencia aportada por el responsable:** PASS de GitHub Actions para el commit `fa1dd1c` en la rama QA. Las ejecuciones anteriores #737 (`02eeb49`) y #738 (`b520b50`) fallaron por una regresión de transición entre idiomas, no por una alteración acreditada del catálogo.

**Defecto demostrado por el log #738:** `scripts/test-fr-detail-notices-pilot.mjs` registró `15,95 € · Validity not confirmed` al seleccionar EN, pero mantuvo ese mismo aviso en la vuelta a FR, en lugar de `15,95 € · Validité à confirmer`. La diferencia de espacios antes del símbolo € no era el defecto funcional de este episodio.

**Causa técnica contrastada:** el camino de traducción EN para el importe de un menú especial había cambiado, pero la expectativa en el `MutationObserver` todavía utilizaba `translateValue`, la antigua ruta. El observador interpretaba el texto inglés producido por la propia aplicación como contenido nuevo y perdía la fuente española utilizada para recomponer FR.

**Resolución y prueba:** `1dffc79` centraliza la traducción inglesa del aviso en una función utilizada tanto para renderizar como para calcular la expectativa del observador. `fa1dd1c` comprueba las transiciones sucesivas FR → ES → EN → FR → ES → FR y que el aviso también aparece en inglés en la visita pública. **PASS confirmado por el responsable** para `fa1dd1c`; no proclamar que se han aprobado otros textos o pantallas por este resultado.

### Puerta de salida QA: pendientes abiertos

| Control | Evidencia actual | Estado |
|---|---|---|
| Regresión técnica del aviso Casa Fina | Log del fallo #738 y PASS final del responsable | Superado |
| Barrido heurístico 43 fichas ordinarias | 0 candidatos de texto y 0 candidatos de desbordamiento, según Summary aportado | Superado como inventario, no revisión humana |
| Muestras documentales (Montillana, Moriles Ribera, Casa Fina, La Tarterie, Roldán Centro) | Cotejos detallados en este archivo | Preliminares |
| Capturas reales de fichas y flujos ES/EN/FR | Generadas por `visual-qa` en el artefacto `fr-visual-qa-desktop-mobile`, pero no inspeccionadas manualmente en esta sesión | **Pendiente** |
| Control semántico integral de descripciones, precios y avisos en los tres idiomas | No cubierto completamente por los inventarios heurísticos | **Pendiente** |
| Excepción documental de El Caballo Rojo | Separada del catálogo ordinario | Pendiente de criterio editorial |
| Publicación/fusión de francés | Requiere revisión integral y autorización del responsable | **No autorizado** |

**Criterio visual de aceptación pendiente de ejecutar:** revisar capturas reales en escritorio y móvil para portada, buscador, resultados, comparador, favoritos y fichas, prestando atención a truncamientos, legibilidad, avisos, orden de lectura, navegación y diferencias entre idiomas. Para cualquier defecto, registrar vista, resolución, idioma, pasos de reproducción, comportamiento esperado y observado, severidad y evidencia visual. Una captura automatizada generada no equivale a una captura examinada.

**Límites:** ningún cambio de datos o publicación por esta documentación. `main` permanece intacta y FR sigue restringido a `?qa_fr=1`.

