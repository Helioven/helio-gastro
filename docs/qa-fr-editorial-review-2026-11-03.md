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


## Inspección visual del artefacto ZIP — 3 de noviembre de 2026

**Fuente efectivamente examinada:** archivo `fr-visual-qa-desktop-mobile (3).zip`, aportado por el responsable y generado por GitHub Actions. Se inspeccionaron su inventario, los informes `fr-visual-qa.json`, `fr-visible-text-triage.json`, `fr-catalog-sweep-review.md`, resultados de regresión y muestras reales de capturas de escritorio/móvil. Las capturas completas se revisaron mediante dimensiones y muestras visuales; **no se afirma lectura minuciosa de cada texto de todas las imágenes**.

**Resultados compatibles con lo confirmado en CI:**
- `fr-visual-qa.json` comunica `PASS` en los perfiles desktop (1365 × 900) y mobile (390 × 664 CSS px), 15 tarjetas por perfil, idiomas diferenciados, sin errores reportados.
- `fr-catalog-sweep-review.md`: 0 candidatos heurísticos de texto en 43 fichas ordinarias y 0 candidatos de desbordamiento en el barrido exploratorio; esto no constituye un certificado visual completo.
- Las muestras de capturas móviles examinadas muestran cabecera, selector de FR QA y navegación sin recorte evidente en la parte superior.

### QA visual: discrepancia entre el tamaño de captura y el viewport

**Evidencia observable, sin causa raíz aún establecida:** de **21 capturas francesas de escritorio** `screenshots/desktop-*-fr.png`, **13 PNG exceden los 1365 px de ancho** del perfil de navegador usado por sus respectivas suites. Ejemplos:
- `desktop-la-cazuela-esparteria-fr.png`: **1895 px** (+530).
- `desktop-la-bandera-cafe-fr.png`: **1845 px** (+480).
- `desktop-rincon-beatillas-fr.png`: **1755 px** (+390).
- `desktop-taberna-san-miguel-el-pisto-fr.png`: **1625 px** (+260).
- `desktop-taberna-la-sal-fr.png`: **1605 px** (+240).
- `desktop-taberna-salinas-fr.png`: **1565 px** (+200).
- Otras siete capturas francesas de escritorio tienen excesos entre +10 y +100 px.

**Interpretación provisional:** las capturas `fullPage` sugieren contenido/documento extendido horizontalmente, aunque la cabecera principal sigue visible y las imágenes por sí solas no bastan para atribuir el problema a un elemento concreto, ni para afirmar que exista recorte de toda la ficha. Esta evidencia **contrasta con el informe de 0 candidatos** del barrido, que utilizó un perfil de escritorio de 1280 px y un recorrido distinto. No asumir que ambos miden la misma situación.

**Ticket propuesto, pendiente de reproducción instrumental:**
- **Título:** anchura de PNG `fullPage` superior al viewport en varias fichas FR de escritorio.
- **Pasos:** abrir `index.html?qa_fr=1` en escritorio a **1365 × 900**, seleccionar FR, abrir La Cazuela de la Espartería; comparar `window.innerWidth`, `document.documentElement.scrollWidth`, `document.body.scrollWidth`, `#detail-section.scrollWidth` y los límites de los elementos visibles con la anchura de la captura `fullPage`. Repetir en La Bandera y Beatillas y después en un perfil de 1280 px y en móvil.
- **Esperado:** no aparecer desplazamiento horizontal involuntario ni contenido inaccesible; la captura y las mediciones deben permitir explicar cualquier anchura adicional.
- **Observado:** PNG de La Cazuela de 1895 px frente a viewport nominal de 1365 px; la discrepancia también aparece en otras 12 capturas, aunque el barrido exploratorio declara 0 candidatos.
- **Severidad/prioridad provisional:** **media / P2 para investigar**, sujeta a confirmar desbordamiento real, interacción y alcance. No corregir CSS a ciegas.
- **Estado:** evidencia visual inspeccionada; **defecto funcional todavía no reproducido ni confirmado en el DOM**.

**Siguiente control recomendado:** prueba enfocada de geometría y captura con el **mismo viewport y la misma secuencia de acciones** de las suites de las fichas afectadas. Si se reproduce la expansión, localizar el elemento exacto antes de modificar estilos; ejecutar regresión escritorio/móvil/ES/EN/FR después. En paralelo, mantener la revisión de naturalidad de las traducciones y las excepciones editoriales pendientes.

**Ámbito protegido:** no se han cambiado textos, precios, ingredientes, cartas, `data/places.json`, estilos ni `main`. El francés continúa experimental con `?qa_fr=1`.


## Revisión del diagnóstico de anchuras — 4 de noviembre de 2026

**Verificación estática realizada sobre los scripts reales de la rama QA, sin ejecución de navegador nueva.** El informe del 3/11 comparó las anchuras de 13 capturas francesas con un supuesto viewport común de 1365 px. Ese supuesto no es aplicable a todas las suites: cada prueba de restaurante puede configurar un viewport de escritorio específico.

| Captura FR | Script inspeccionado | Viewport desktop configurado | Anchura PNG observada el 3/11 | Interpretación |
|---|---|---:|---:|---|
| La Cazuela de la Espartería | `scripts/test-fr-la-cazuela-89.mjs` | 1895 × 900 | 1895 px | Coincide |
| La Bandera | `scripts/test-fr-la-bandera-84.mjs` | 1845 × 900 | 1845 px | Coincide |
| Rincón de las Beatillas | `scripts/test-fr-rincon-beatillas-75.mjs` | 1755 × 900 | 1755 px | Coincide |
| San Miguel · El Pisto | `scripts/test-fr-el-pisto-62.mjs` | 1625 × 900 | 1625 px | Coincide |
| Taberna La Sal | `scripts/test-fr-taberna-la-sal-60.mjs` | 1605 × 900 | 1605 px | Coincide |
| Taberna Salinas | `scripts/test-fr-taberna-salinas-56.mjs` | 1565 × 900 | 1565 px | Coincide |

**Resultado:** en estas seis muestras, el PNG no es más ancho que el viewport **real de su suite**. La diferencia con 1365 px no demuestra un desbordamiento. Se corrige, por tanto, la premisa de la incidencia P2 provisional para estas seis capturas; no procede un parche CSS. Los scripts inspeccionados incluyen además una comprobación de `document.documentElement.scrollWidth > innerWidth + 1`, pero **no se han ejecutado nuevamente** ni se infiere un PASS actual.

**Pendiente:** cotejar individualmente las otras siete capturas señaladas con sus scripts y, si queda alguna discrepancia real, reproducirla con el viewport y la secuencia exactos de su propia suite; medir DOM y regiones afectadas antes de decidir una corrección. El barrido de 1280 px sigue siendo una prueba independiente. No se alteraron estilos, interfaz, datos, traducciones ni `main`. Esta actualización es **documental**, no una certificación visual/lingüística ni cierre global de QA. La ejecución de CI disparada por este cambio, en su caso, debe verificarse aparte.


### Ampliación de la revisión de anchuras — siete suites restantes (04/11/2026)

Se inspeccionaron en la rama QA los scripts Playwright que producen las **siete capturas adicionales** cuyo exceso respecto a 1365 px se había descrito en el traspaso como situado entre +10 y +100 px. Todas estas suites configuran explícitamente una anchura de escritorio propia, mayor que 1365 px:

| Captura / establecimiento | Script de origen | Viewport desktop declarado | Diferencia frente a 1365 px |
|---|---|---:|---:|
| El Nº 10 | `scripts/test-fr-el-numero-10-37.mjs` | 1375 × 900 | +10 px |
| La Taberna del Río | `scripts/test-fr-la-taberna-del-rio-38.mjs` | 1385 × 900 | +20 px |
| Taberna Rafaé | `scripts/test-fr-rafae-38.mjs` | 1385 × 900 | +20 px |
| Don Pepe Centro | `scripts/test-fr-don-pepe-centro-43.mjs` | 1435 × 900 | +70 px |
| El Poema · Alonso de Burgos | `scripts/test-fr-el-poema-alonso-44.mjs` | 1445 × 900 | +80 px |
| D'Tapas COVAP | `scripts/test-fr-dtapas-covap-45.mjs` | 1455 × 900 | +90 px |
| Plateros San Francisco | `scripts/test-fr-plateros-san-francisco-46.mjs` | 1465 × 900 | +100 px |

Los siete scripts usan captura de página completa (`fullPage: true`); las anchuras configuradas explican exactamente el **rango de incrementos** anotado en el informe anterior. Sumados a los seis casos documentados en el apartado precedente, hay **13 suites con viewport desktop superior a 1365 px**, precisamente la cantidad de PNG inicialmente señalados.

**Dictamen de triaje:** se descarta la comparación con un supuesto viewport común de 1365 px como prueba de un defecto P2. La anomalía **de interpretación de tamaños** queda explicada por los scripts; **no existe evidencia suficiente para abrir un defecto de CSS**. Este dictamen no certifica que todos los elementos sean accesibles ni sustituye la inspección de DOM con viewports reales. El ZIP de capturas anterior no está disponible en esta sesión: las dimensiones individuales de estas siete imágenes no se han vuelto a medir, y no se atribuye por ello una nueva ejecución Playwright ni un PASS de navegador.

**Estado del trabajo:** verificación estática de los 13 scripts terminada; registro corregido; ningún cambio de CSS, JS, datos gastronómicos, traducciones ni rama `main`. Continuar con QA visual/lingüístico, accesibilidad y regresión en los perfiles declarados; investigar desbordamientos únicamente ante mediciones DOM o capturas que excedan el viewport **de su propia suite**. CI del commit documental: comprobar por separado, sin presumir PASS.


## Control exploratorio de accesibilidad y presentación FR — 4 de noviembre de 2026

**Objetivo:** tras aclarar la comparación errónea de anchuras, iniciar una inspección visual instrumentada sobre fichas extensas sin alterar CSS ni los datos originales.

- **Nuevo script:** `scripts/inventory-fr-detail-accessibility.mjs` (incorporado al job `visual-qa` en `.github/workflows/data-qa.yml`).
- **Muestras:** La Cazuela de la Espartería, La Bandera y Rincón de las Beatillas; idiomas ES/EN/FR en escritorio 1365 × 900 e iPhone 13 (18 combinaciones). Se emplea `index.html?qa_fr=1` y `showPlace` como en las suites existentes.
- **Evidencia prevista:** `qa-reports/fr-detail-accessibility-triage.json` y capturas `qa-reports/screenshots/fr-accessibility-triage/`. Mediciones: ancho de viewport/documento/cuerpo/ficha; elementos interactivos fuera del viewport; posibles controles sin nombre; textos con `overflow:hidden` y ancho recortado; número de enlaces de fuente, idioma HTML y errores de página.
- **Criterio:** un candidato heurístico **no** implica defecto funcional ni incumplimiento WCAG. Verificar visualmente, distinguir contenedores desplazables voluntarios de recortes y documentar la reproducción antes de modificar estilos. La prueba falla si no completa las 18 vistas o si registra errores JS; los candidatos visuales se registran para análisis humano y no bloquean CI automáticamente.
- **Estado al registrar el cambio:** **prueba añadida y conectada al workflow, ejecución de CI pendiente de verificar**. No se ha realizado revisión manual de las 18 capturas ni pruebas con lector de pantalla. No marcar como superada una auditoría de accesibilidad completa.
- **Ámbito protegido:** rama `feature/fr-integration-qa-20261027`; sin modificaciones en `main`, `data/places.json`, cartas, precios, traducciones ni CSS. La publicación del francés permanece sin autorizar.


### Confirmación del responsable — 04/11/2026

Helio confirma **PASS de las comprobaciones ejecutadas, con cero fallos reportados**, para el nuevo bloque de inventario exploratorio visual/accesibilidad ES/EN/FR (tres fichas × tres idiomas × dos perfiles, 18 combinaciones) integrado en `visual-qa`.

**Estado:** PASS técnico **comunicado por el responsable**; esta anotación no implica que el asistente haya inspeccionado independientemente el archivo JSON, las 18 capturas o los logs de GitHub Actions. «Cero fallos» corresponde a la confirmación recibida y no se convierte automáticamente en «cero candidatos heurísticos» si no se ha contrastado el informe de triaje. La revisión humana exhaustiva, las pruebas de lector de pantalla, la aprobación editorial/lingüística y la publicación del francés siguen pendientes. Sin cambios de interfaz, CSS, catálogos ni `main`.


## Triaje editorial dirigido — 04/11/2026 (fuentes FR)

**Alcance y método:** inspección estática del mapa real de etiquetas de fuentes en `i18n.js`, sin alterar el catálogo ni presumir una validación de las cartas externas. Se conservan las conclusiones preliminares anteriores; este apartado concreta tres candidatos. La confirmación adicional de PASS comunicada por Helio en esta sesión no especifica nuevas muestras lingüísticas aprobadas y **no se usa para cerrar estos candidatos**.

| Establecimiento / expresión española | FR actual comprobado en `i18n.js` | Valoración | Estado |
|---|---|---|---|
| Moriles Ribera: `ibéricos` (fuente de febrero 2026) | `charcuteries ibériques` | Traducción plausible para charcutería, pero quizá más estrecha que una sección con platos ibéricos más amplios. Requiere leer la fuente original antes de concretar. | Revisión editorial pendiente, no defecto confirmado |
| Moriles Ribera: `revueltos` (fuente de febrero 2026) | `œufs brouillés garnis` | Se entiende como huevos revueltos acompañados; validar si ese descriptor refleja los revueltos concretos de la carta. No cambiar automáticamente los nombres de platos. | Revisión editorial pendiente, no defecto confirmado |
| Moriles Casa Fina: `Cafés y chocolates` | `Cafés et chocolats` | `chocolats` es ambiguo en francés (bebida frente a bombones). `Cafés et chocolats chauds` sería una opción **solo si** la fuente designa bebidas calientes. | Propuesta condicionada a contraste de la fuente |

**Comprobación efectuada:** las tres parejas ES/FR aparecen efectivamente en el mapa de fuentes de la rama QA; no son cadenas inferidas. **No realizado:** lectura de las cartas externas, validación nativa por francófono, examen visual específico de estas etiquetas o ejecución Playwright nueva. La revisión debe mantener denominaciones tradicionales, atribución y fechas.

**Decisión:** ningún cambio en `i18n.js` hasta resolver cada ambigüedad con evidencia documental y criterio editorial. El siguiente lote debe cotejar estas tres expresiones con sus páginas de fuente registradas y valorar si la traducción existente se conserva o se ajusta con regresión ES/EN/FR.

**Integridad:** registro documental solamente; no se cambia `main`, `data/places.json`, precios, ingredientes, formatos, CSS ni los lotes FR. El francés continúa limitado a `?qa_fr=1`.


## Seguimiento de fuentes y PASS específico — 04/11/2026

**Confirmación del responsable:** Helio comunica un nuevo **PASS para La Cazuela de la Espartería**. Se registra como PASS comunicado para esa ficha; no se extiende a La Bandera, Beatillas ni a una aprobación editorial global, y no se afirma lectura independiente de logs o capturas por esta confirmación.

### Contraste externo acotado de tres etiquetas FR (04/11/2026)

Se han abierto las páginas de los **establecimientos concretos** y se han contrastado los títulos originales visibles. No se reutilizan datos de una sede para otra.

| Etiqueta | Evidencia oficial contrastada | Interpretación / decisión |
|---|---|---|
| Moriles Ribera: `ibéricos` → `charcuteries ibériques` | `https://www.morilesribera.com/nuestra-cocina` presenta una imagen de carta rotulada «Ibericos-Revueltos-Risottos-Pastas»; la versión `https://www.morilesribera.com/our-kitchen` distingue «Ibericos» como categoría | **Pendiente de verificación semántica de los platos**: «charcuteries» podría reducir la categoría si incluye elaboraciones no clasificables como charcutería. No editar a ciegas |
| Moriles Ribera: `revueltos` → `œufs brouillés garnis` | La carta inglesa oficial separa la categoría «Revueltos» y la española la identifica en su imagen de carta | **Sin defecto demostrado**: la interpretación descriptiva parece comprensible, pero falta cotejar elaboraciones concretas de la imagen para aceptar «garnis» |
| Moriles Casa Fina: `Cafés y chocolates` → `Cafés et chocolats` | El menú de navegación oficial en `https://morilescasafina.com/nuestra-cocina/` muestra literalmente «CAFÉS Y CHOCOLATES». Se intentó abrir `https://www.morilescasafina.com/cafes-y-chocolates`, pero no se pudo recuperar su contenido | **Ambigüedad no resuelta:** no se puede afirmar que todos sean chocolates calientes ni sustituir la etiqueta con seguridad. Mantener la traducción candidata hasta obtener el detalle original |

**Alcance real de la comprobación:** se verificó la existencia y separación de categorías y la atribución a las páginas oficiales; no se leyó íntegramente el contenido gráfico de las cartas, ni se contrastó la vigencia de precios, ni se ejecutó una prueba Playwright nueva. No se consideran aprobaciones lingüísticas.

**Siguiente decisión QA:** obtener/leer de forma autorizada las páginas gráficas concretas y, solo ante discrepancia confirmada, efectuar un ajuste mínimo de etiqueta, prueba ES/EN/FR y CI. Por ahora **ningún cambio** en `i18n.js`, datos, CSS o `main`.


## QA de fuentes ES/EN/FR — siguiente lote (04/11/2026)

**Confirmación recibida:** Helio comunica un nuevo **PASS** para el lote inmediatamente anterior de contraste documental/QA. Se registra como **PASS comunicado por el responsable**, sin inferir que las tres ambigüedades semánticas estén resueltas ni que exista aprobación editorial nativa de la traducción. No atribuir este PASS a la nueva prueba descrita a continuación.

**Nueva regresión incorporada, aún sin PASS confirmado:** `scripts/test-fr-source-venue-triage.mjs`, conectada al job `visual-qa` de `.github/workflows/data-qa.yml`.

- **Tres fichas independientes:** `moriles-ribera`, `moriles-casa-fina` y `pastelerias-roldan-centro`. Nunca se intercambian sus cartas ni enlaces.
- **Dos perfiles por ficha:** escritorio 1365 × 900 e iPhone 13; **seis escenarios**. Transiciones ES → FR → EN → FR → ES en `index.html?qa_fr=1`.
- **Criterios automatizados:** existen etiquetas y URL de fuentes; se conservan sus pares `data-source-label-es` y `href` en cada transición; los rótulos vuelven a su contenido previo en ES y FR; no hay desbordamiento de documento o ficha por encima de la tolerancia de 2 px ni errores JavaScript. El script guarda `qa-reports/fr-source-venue-triage.json` y capturas de las tres fichas en cada perfil para inspección manual.
- **Estado de QA:** prueba **implementada/conectada, pendiente de ejecución y comprobación del CI**. Ninguna captura de este lote ha sido inspeccionada visualmente aquí; PASS automatizado futuro no supondrá aprobación editorial ni accesibilidad completa.
- **Límites protegidos:** sin cambios en CSS, `i18n.js`, fuentes, `data/places.json`, platos, ingredientes, precios, fechas ni rama `main`. El francés continúa experimental bajo `?qa_fr=1`.


## Confirmación y siguiente control de teclado — 04/11/2026

**PASS del responsable:** Helio confirma **PASS del lote anterior** `scripts/test-fr-source-venue-triage.mjs` (Moriles Ribera, Moriles Casa Fina y Roldán Centro). Se registra como **PASS comunicado por Helio, sin inspección independiente del artefacto/log de CI en esta anotación**. No implica autorización editorial del francés ni cierre de las tres decisiones semánticas documentadas.

**Siguiente prueba implantada, todavía sin resultado confirmado:** `scripts/test-fr-keyboard-map-dialog.mjs`, incorporada a `.github/workflows/data-qa.yml`.

- **Objeto:** interacción por teclado del diálogo nativo de mapa en la ficha de La Montillana, en español, inglés y francés bajo `?qa_fr=1`.
- **Perfiles:** escritorio 1365 × 900 e iPhone 13. Total **6 combinaciones** de perfil e idioma.
- **Pasos automatizados:** enfocar el botón de mapa, activar con **Enter**, verificar apertura y foco dentro del diálogo; pulsar **Tab** tres veces y verificar que el foco permanece dentro; cerrar con **Escape**, comprobar restauración de foco en el botón y retirada del `src` del iframe de mapa al cerrar.
- **Evidencia prevista:** `qa-reports/fr-keyboard-map-dialog.json` y registro de la suite en `qa-reports/visual-qa-timings.csv`.
- **Estado actual:** script creado y conectado al workflow, **ejecución y PASS/FAIL pendientes de verificación**. Si falla, conservar pasos y salida antes de corregir; no atribuir automáticamente la causa a CSS o traducción.
- **Límites:** esta regresión **no** equivale a auditoría WCAG, prueba de lector de pantalla o revisión visual del contenido de la carta. No cambia HTML, CSS, JS de aplicación, datos, traducciones, `main`, ni autoriza despliegue de francés.


## Incidencia CI tras incorporar la prueba de teclado — 04/11/2026

**Evidencia aportada por Helio:** captura del listado de ejecuciones de GitHub Actions `Helio Gastro - data QA`, rama `feature/fr-integration-qa-20261027`:
- **#756**, commit `ef8f06f` — icono verde / **PASS observado en el listado**. Esta ejecución corresponde a la creación del script, **antes de incorporarlo a la lista de ejecución del workflow**; por tanto, no valida la nueva suite.
- **#757**, commit `2e6dda3` — icono rojo / **FAIL observado**, primer workflow con `scripts/test-fr-keyboard-map-dialog.mjs` incluido.
- **#758**, commit `884e425` — icono rojo / **FAIL observado**, actualización documental posterior, con la misma prueba integrada.

**Triaje:** la correlación temporal convierte la nueva prueba del diálogo en **hipótesis prioritaria**, pero **no demuestra** que ese script sea el job o paso fallido ni identifica la causa. No se dispuso de los logs de `visual-qa` ni de `qa-reports/fr-keyboard-map-dialog.json` en esta sesión; el conector GitHub no devolvió ejecuciones para esos SHA mediante su consulta de workflow runs (limitada a otros tipos de disparador). No clasificar como defecto de accesibilidad ni modificar producción o prueba hasta leer evidencia de fallo.

**Siguiente acción necesaria:** abrir ejecución **#758** → job fallido → paso `Start static server and run desktop/mobile browser QA`; localizar `FR KEYBOARD MAP DIALOG`, `Visual QA failed`, o las últimas líneas. Si el job falla antes, copiar el nombre del paso y el error exacto. Contrastar también `qa-reports/fr-keyboard-map-dialog.json` si el artefacto existe. Reproducir caso, corregir solo causa confirmada y exigir CI PASS nuevo.

**Estado:** #757 y #758 **FAIL observado en GitHub Actions**, raíz **sin confirmar**; #756 PASS anterior **no certifica** la suite nueva. No tocar `main`, cartas, traducciones o CSS.


### Diagnóstico y corrección de la suite de teclado — 04/11/2026

**Evidencia directa de la ejecución fallida aportada por Helio:** `FR KEYBOARD MAP DIALOG` devuelve FAIL en los **seis** perfiles/idiomas ES, EN y FR (escritorio/móvil) con `Tab moved focus outside modal at step 3`; en móvil ES y FR también aparece `Map iframe source retained after closing`. El job informa `Suite scripts/test-fr-keyboard-map-dialog.mjs exited non-zero`.

**Causa del falso negativo de foco reproducida de forma aislada:** en Chromium, el `<dialog>.showModal()` nativo con tres controles enfocados (botón, iframe, enlace) puede colocar `document.activeElement` temporalmente en `BODY` cuando Tab agota el ciclo, y el siguiente Tab vuelve al primer control del modal. El fondo permanece bloqueado por la modalidad nativa. La aserción anterior exigía que el foco estuviera dentro del árbol del diálogo **después de cada Tab**, de modo que interpretaba este paso transitorio como fuga de foco.

**Causa del aviso de iframe:** el código de aplicación elimina el `src` del iframe en el evento `close`; Playwright comprobaba el atributo inmediatamente tras esperar a que el diálogo dejase de estar visible, sin esperar a dicho listener. Es una condición de carrera de la prueba, no prueba de que el iframe siga cargado indefinidamente.

**Corrección restringida** en `scripts/test-fr-keyboard-map-dialog.mjs` (commit `c9c04f8`):
- Aceptar la transición transitoria a `BODY` **solo si** el modal sigue abierto y el Tab siguiente devuelve el foco a un elemento dentro; seguir fallando si se enfoca un elemento ajeno al modal o no se recupera el foco.
- Esperar hasta 1,5 segundos a que el evento `close` retire el atributo `src`, manteniendo FAIL si no sucede.
- Conservar los controles de activación con Enter, apertura, retorno del foco tras Escape y los seis escenarios ES/EN/FR escritorio/móvil.

**Estado:** modificación realizada en rama QA; el comportamiento nativo del navegador se reprodujo en una página mínima separada; **no se declara PASS de la suite real ni del nuevo workflow** hasta ver los resultados de CI. No se ha modificado `app.js`, HTML, CSS, datos, traducciones o `main`.


### Segunda incidencia de teclado y aislamiento de casos — 04/11/2026

**Log real aportado por el responsable, tras el arreglo anterior:** desktop ES/EN/FR **FAIL** por `locator('#map-dialog').waitFor({state:'hidden'})` agotado a los 30 segundos; desktop EN/FR también notifican `Map trigger not focusable`. Mobile ES/EN/FR **PASS** en ese mismo informe. Duración de la suite: 92 s.

**Análisis del código:** el modal contiene un `iframe` de Google Maps. Después de navegar con Tab, el foco puede pasar al documento del iframe, donde `Escape` no está garantizado que alcance al `<dialog>` padre. La prueba enviaba Escape sin situar previamente el foco en un control del documento padre. Cuando la comprobación fallaba, dejaba el diálogo abierto, provocando fallos secundarios de enfoque en las siguientes lenguas del mismo perfil. **Hipótesis razonada por el flujo de la prueba; no hay traza del elemento activo dentro del iframe que confirme la causa con certeza.**

**Cambio de prueba exclusivamente** (`scripts/test-fr-keyboard-map-dialog.mjs`, commit `145997f`):
- Después de la comprobación de Tab, enfocar explícitamente `#close-map` (botón interno del diálogo padre) y verificar ese foco antes de enviar Escape.
- Esperar un máximo de 3 segundos a que el modal se cierre, anotando un error específico en vez de agotar el timeout de 30 segundos.
- En `finally`, cerrar el diálogo si sigue abierto para impedir que un caso fallido contamine los siguientes idiomas; **el FAIL original se conserva**.
- Mantener comprobaciones de apertura con Enter, foco inicial, ciclo Tab, restauración del foco y limpieza asíncrona del iframe.

**Alcance exacto:** se comprueba Escape desde el control de cierre del diálogo **padre**, no desde el contenido interactivo de un iframe externo. El comportamiento de Escape con foco dentro de Google Maps requiere otra evaluación específica y no debe interpretarse como cubierto por esta regresión. **Nuevo CI pendiente**: no proclamar PASS hasta revisar el run actualizado. Sin cambios de aplicación, estilos, datos, idiomas ni `main`.


### Cierre de incidencia: teclado y diálogo de mapa — 04/11/2026

**Confirmación expresa del responsable:** Helio informa que la ejecución posterior a la corrección `145997f` y documentación `c322313` ha dado **PASS**, sin fallos. Se registra como **PASS confirmado por el responsable** para la regresión `scripts/test-fr-keyboard-map-dialog.mjs`, en los escenarios de escritorio/móvil y ES/EN/FR declarados. No se afirma que el asistente haya inspeccionado directamente los logs o el artefacto de esta ejecución.

**Resultado del triaje:** el FAIL anterior de escritorio por espera de cierre de `#map-dialog` queda resuelto según la ejecución comunicada. El script aísla los idiomas entre sí, verifica Escape desde el botón del diálogo padre y espera la limpieza del iframe. La observación relativa a Escape cuando el foco está **dentro del iframe externo de Google Maps** queda fuera de ese alcance y no se declara probada.

**Estado:** incidencia técnica de la suite **CERRADA — PASS comunicado**; no constituye auditoría WCAG, prueba con lector de pantalla, aprobación editorial integral ni permiso de publicación del francés. `main`, aplicación, estilos, traducciones y cartas se mantienen sin cambios.


## Revisión editorial conservadora con fuentes disponibles — 04/11/2026

**Comprobación ejecutada:** inspección de la carta pública española `https://www.morilesribera.com/nuestra-cocina`, la inglesa `https://www.morilesribera.com/our-kitchen`, la navegación de Casa Fina `https://morilescasafina.com/nuestra-cocina/`, el mapa de rótulos de `i18n.js` y la descripción de Manolete en `translations/fr/batch-003-la-montillana.json`. **Limitación:** las imágenes de las cartas oficiales no han podido recuperarse para leer sus productos; no se verifican platos concretos ni precios.

| Cuestión | Evidencia del origen | Decisión |
|---|---|---|
| Moriles Ribera, `ibéricos` → `charcuteries ibériques` | La web ES identifica imagen `MR 003 (Ibericos-Revueltos-Risottos-Pastas)`, y la web EN imagen `MR 031 (Ibericos) EN`. | **Pendiente**: «charcuteries» podría ser demasiado estrecho para toda la sección; no cambiar sin cotejar la imagen. «Produits ibériques» sería una alternativa neutra por evaluar, no una corrección aprobada. |
| Moriles Ribera, `revueltos` → `œufs brouillés garnis` | La página EN mantiene `MR 032 (Revueltos) EN` como categoría distinta. | Comprensible, pero verificar platos antes de afirmar que `garnis` es semánticamente exacto. **No hay defecto probado**. |
| Moriles Casa Fina, `Cafés y chocolates` → `Cafés et chocolats` | Título confirmado en navegación oficial; el documento QA previo recoge traducción inglesa `Coffee and hot chocolate`, no verificación actual del contenido original. | **Pendiente**: `Cafés et chocolats chauds` únicamente si la carta confirma que se trata de bebidas calientes. |
| La Montillana, Manolete | Lote FR 003, sección 5/entrada 1: `Pâtisserie Manolete fourrée au cabello de ángel (confiture sucrée de courge), accompagnée d’une soupe froide sucrée au vinaigre de Pedro Ximénez.` | Se conservan nombre tradicional e ingrediente explicado; falta valoración de naturalidad por francófono. **Sin defecto confirmado**. |

**Resultado:** cuatro decisiones editoriales documentadas; **cero errores lingüísticos confirmados**, ninguna traducción modificada ni nuevo PASS técnico atribuido a esta revisión. Los siguientes pasos son leer el detalle gráfico oficial, cotejar los productos de cada sede, acordar los cambios editoriales necesarios y probar ES/EN/FR solo si se modifica algo. No reproducir fotografías de terceros en la aplicación sin licencia. No se alteran `main`, CSS, catálogo, recetas, precios, fuentes o lotes FR; francés aún restringido a `?qa_fr=1`.


## PASS comunicado y extracción trilingüe para revisión semántica — 04/11/2026

**PASS del responsable:** Helio confirma **PASS del último bloque de revisión documental conservadora** (Moriles Ribera, Casa Fina y Manolete). Se registra como confirmación del control anterior, **sin transformar** las cuatro cuestiones editoriales pendientes en traducciones aprobadas. No equivale a un examen de los PNG originales ni una aprobación lingüística por un hablante nativo.

**Nuevo control incorporado (aún sin PASS de CI):** `scripts/inventory-fr-moriles-ribera-semantics.mjs` conectado al job `visual-qa` de `.github/workflows/data-qa.yml`.

- Extrae del `state.places` real bajo `?qa_fr=1` las denominaciones y descripciones **ES, EN y FR** de cada entrada de los lotes `translations/fr/batch-*-moriles-ribera.json`, conservando `sectionIndex` e `itemIndex`.
- Verifica técnicamente que cada entrada tenga los tres textos, corresponda a una posición existente, no se duplique y coincida la traducción francesa del lote con la superposición activa del navegador.
- Entrega `qa-reports/fr-moriles-ribera-semantic-review.json` como tabla de evidencia con los tres textos y el estado `pending_human_semantic_review` de **cada plato**. Este informe se publicará en el artefacto habitual `fr-visual-qa-desktop-mobile` cuando se ejecute GitHub Actions.
- **Regla esencial:** PASS del script significaría **alineación estructural de textos**, no que ingredientes, métodos culinarios o términos estén traducidos correctamente. Los casos `ibéricos`/`revueltos` siguen abiertos hasta contrastar el contenido de las cartas originales, igual que `Cafés y chocolates` en Casa Fina.
- **Estado:** script y CI modificados; **ejecución nueva pendiente de comprobar**. No se han modificado `main`, `app.js`, `i18n.js`, JSON gastronómicos, lotes FR, precios ni estilos. Francés experimental no publicado.


## Revisión trilingüe manual: Moriles Ribera, primeros 24 platos — 04/11/2026

**PASS precedente comunicado por el responsable:** Helio confirma nuevos **PASS del control de alineación ES/EN/FR de Moriles Ribera** incorporado en `scripts/inventory-fr-moriles-ribera-semantics.mjs`. Esta confirmación se atribuye exclusivamente al control técnico anterior; no implica aprobación lingüística humana de todas las entradas ni inspección directa de su último artefacto de CI por el asistente.

**Método de este nuevo lote (revisión ejecutada, sin nuevo CI):** lectura del catálogo original **`data/places.json`** del blob `0ffd3de396986d99125752cde7b4c2c52a20b31e` a través del conector GitHub y cotejo por `sectionIndex` / `itemIndex` con los candidatos franceses `translations/fr/batch-090-moriles-ribera.json` y `batch-091-moriles-ribera.json` de la misma rama. **24/24 entradas examinadas**, 12 por lote; incluye `name`, `es`, `en` y `fr`. Es un cotejo con los textos registrados en el proyecto, **no** una nueva verificación de los platos o ingredientes en la web oficial.

**Resultado observado:** no se aprecian omisiones evidentes de los ingredientes principales en esas 24 traducciones. Se identifican **tres candidatos de mejora**, sin declarar defectos funcionales ni modificar traducciones:

| Índice | Plato | Fuente ES / EN | FR actual | Propuesta bajo revisión |
|---|---|---|---|---|
| `0:3` | Pimientos con Ventresca | ES: `Pimientos rojos y verdes asados con ventresca`; EN: `Roasted red and green peppers with tuna belly` | `Poivrons rouges et verts grillés accompagnés de ventrèche de thon.` | `rôtis` reflejaría mejor `asados` / `roasted` frente a `grillés`; no implica cambio de ingrediente |
| `0:5` | Tropical | ES: `Anchoas, espárragos blancos, palmitos, piña, tomate rosa, maíz y salsa rosa`; EN: `... pink dressing` | `... maïs doux et sauce cocktail.` | `sauce rose` sería más literal y evitaría una equivalencia culinaria no explicitada en el origen; `sauce cocktail` puede ser convencional, por lo que es criterio editorial, no error confirmado |
| `0:2` | Moriles | ES: `queso puro de oveja`; EN: `sheep's milk cheese` | `fromage pur brebis` | Valorar `fromage au lait de brebis` para naturalidad; no atribuir tipo, maduración o denominación que el origen no registre |

**Control de alcance:** se contrastaron las **24 primeras** entradas de los **dos lotes indicados**, no el resto de Moriles Ribera ni las demás fichas. Los tres pares ES/EN/FR siguen siendo **candidatos**, no correcciones aprobadas. Mantener nombres de platos, fuentes, ingredientes, precios y formatos originales. La revisión por francófono y el cotejo con cartas oficiales siguen pendientes antes de decidir retoques. No se modifica `i18n.js`, lotes FR, datos, CSS, aplicación ni `main`.

**Próxima tarea sugerida:** continuar con los lotes `batch-092` y `batch-093` de Moriles Ribera y aplicar la misma revisión 1:1, registrando cambios de sentido comprobables por separado de preferencias estilísticas. Si se autoriza un cambio editorial, hacerlo mínimo y verificar ES/EN/FR más CI antes de cerrar el caso.


## Revisión trilingüe manual: Moriles Ribera, lotes 092–093 — 04/11/2026

**PASS del responsable para el lote anterior:** Helio confirma nuevamente **PASS** de las comprobaciones anteriores. Registrar como confirmación comunicada, **no** como aprobación editorial de los 24 textos que se examinan en este bloque.

**Evidencia y alcance:** lectura íntegra de `translations/fr/batch-092-moriles-ribera.json` (**12 entradas**) y `batch-093-moriles-ribera.json` (**12 entradas**), cruzadas 1:1 mediante `sectionIndex:itemIndex` con `name`, `es` y `en` de `data/places.json` del repositorio (blob `0ffd3de396986d99125752cde7b4c2c52a20b31e`). **24/24 candidatos FR leídos y contrastados**; acumulado de muestras de Moriles Ribera: **48 candidatos**, lotes 090–093. No se revalidó el contenido de las cartas publicadas por el establecimiento ni la vigencia de precios.

| Índice | Texto fuente y traducción | Evaluación fundamentada |
|---|---|---|
| `2:3` | ES `Caña de Lomo Ibérica de Bellota`, EN `Acorn-fed Iberian cured pork loin`; FR `Caña de lomo ibérique de bellota (longe de porc séchée, issu de porcs nourris aux glands).` | **Observación lingüística concreta:** la concordancia `séchée, issu` resulta inconsistente si ambos participios describen `longe` (femenino); revisar sintaxis y terminología para describir con precisión la caña de lomo. No modificar `bellota` ni afirmar un método de curado adicional no documentado. |
| `2:4`, `2:5`, `2:7` | ES `Queso Puro de Oveja`; EN `sheep's milk cheese`; FR repite `fromage pur brebis`. | **Mejora estilística candidata:** `fromage au lait de brebis` expresa el contenido original con mayor naturalidad, sin sugerir procedencia o tipo nuevos. Afecta a tres entradas y también al caso `0:2` ya documentado en el lote 090. |
| `2:6` | ES `Formatos 110 g, 75 g y 40 g`, EN `published 110 g, 75 g and 40 g portions`; FR `portions de 110 g, 75 g et 40 g`. | **Correspondencia verificada contra el catálogo:** las tres cantidades se preservan en FR sin cambio numérico. No supone validación de disponibilidad actual. |
| `1:17`, `1:18`, `1:19` | Tortillas de patata preparadas al momento y tortilla de camarones. | Se conserva la preparación al momento en `1:17` y `1:18`, y la explicación de fritura de camarones en `1:19`. La forma `tortillita` en FR mantiene una denominación tradicional, pero la naturalidad cultural queda bajo revisión humana. |
| `2:9` | ES `Queso asado a la miel de caña`, EN `Grilled cheese with cane syrup`, FR `Fromage grillé au sirop de canne à sucre`. | Significado coherente con el EN documentado; no introducir ingredientes o formatos. |

**Resultado del control:** no se observan omisiones flagrantes de los elementos principales en las 24 entradas cotejadas. Se distingue **una inconsistencia gramatical candidata concreta** (caña de lomo) de las **preferencias terminológicas** (queso de oveja). El origen permite constatar las diferencias entre los idiomas, **no** certificar los ingredientes frente a fuentes externas ni aprobar todo el francés. Ningún texto de producción modificado.

**Próximo lote:** revisar `batch-094-moriles-ribera.json` y `batch-095-moriles-ribera.json` con el mismo método; preparar propuestas pequeñas, someter a criterio editorial y ejecutar regresión ES/EN/FR solo si se autorizan correcciones. Conservar la excepción de El Caballo Rojo y el bloqueo de publicación del francés hasta autorización final. Rama `main`, CSS, datos y traducciones intactos.


## Regresión del presupuesto francés en el buscador — 04/11/2026

**FAIL comunicado por Helio:** `scripts/test-fr-search-ui-pilot.mjs:27` falla en `FR initial unlimited budget` con `actual: 'Sans limite'` y `expected: 'Sans limite (afficher les fiches)'`. El error aparece en GitHub Actions y hace fallar `visual-qa`. La confirmación previa de PASS se refería a ejecuciones anteriores, no a esta.

**Causa comprobada en el repositorio:** `index.html` declara inicialmente `<option value="">Sin límite (mostrar fichas)</option>`, pero `app.js`, al ejecutar la configuración del modo de servicio, reconstruye `#budget` con una opción dinámica `Sin límite`. `i18n.js` incluye la traducción de esta versión a `Sans limite`. El propio README registra un incidente histórico análogo en las ejecuciones #618–#620. Por tanto, la prueba estaba validando el texto previo a la reconstrucción, no el estado real estable del control. **No hay evidencia en este log de pérdida de funcionalidad del presupuesto ni de un defecto de datos.**

**Corrección de alcance mínimo:** en `scripts/test-fr-search-ui-pilot.mjs` se espera a que `state.places` esté cargado y a que la opción dinámica de presupuesto figure como `Sans limite`, y entonces se verifica ese valor exacto. Commit `e38d332`. Se conserva la comprobación de restauración ES (`Sin límite`) y el resto del flujo ES/EN/FR. Sin cambios en `app.js`, `index.html`, `i18n.js`, catálogo, lotes FR, CSS ni `main`.

**Estado:** diagnóstico a partir del error real y del código **confirmado**, modificación de test **implementada**, **CI posterior pendiente**. No afirmar PASS hasta recibir evidencia del siguiente run.


## PASS buscador FR y cotejo de Moriles Ribera, lotes 094–095 — 04/11/2026

**Cierre de incidencia anterior:** Helio confirma **PASS** de GitHub Actions después del ajuste `e38d332` de la aserción de presupuesto en `scripts/test-fr-search-ui-pilot.mjs`. El FAIL por diferencia `Sans limite` / `Sans limite (afficher les fiches)` queda **cerrado por confirmación del responsable**; no se atribuye revisión directa de logs al asistente.

**Revisión nueva realizada:** cotejo individual de las **24 entradas** de `translations/fr/batch-094-moriles-ribera.json` (12) y `batch-095-moriles-ribera.json` (12) con `name`, `es` y `en` del mismo índice de `data/places.json` en la rama QA (blob `0ffd3de396986d99125752cde7b4c2c52a20b31e`). Acumulado documental de Moriles Ribera: **72 entradas revisadas (lotes 090–095)**. No se comprobaron de nuevo las imágenes de la carta oficial ni la vigencia de platos/precios.

**Resultado del contraste ES/EN/FR:** las 24 entradas preservan a primera lectura los principales ingredientes y preparaciones del catálogo registrado: anchoas, queso de Zuheros, ciervo, salmón, sardina, salmorejo, risottos, pastas, huevos, revueltos, alcachofas, berenjenas, boletus y cardos. Ninguna omisión evidente de ingredientes se ha demostrado por este contraste. **Esto no supone revisión francófona nativa ni aprobación editorial.**

| Índice | Descripción actual en FR | Observación y decisión |
|---|---|---|
| `5:0` Huevos a la flamenca con Jamón y Chorizo | `Huevos à la flamenca, oeufs au jambon et au chorizo.` | **Observación ortotipográfica verificable:** `oeufs` no utiliza la ligadura francesa habitual `œufs`; además la mezcla `Huevos ... oeufs` resulta redundante. Proponer conservar el nombre tradicional y explicar en francés solo una vez los ingredientes, sin alterar receta. **Pendiente de decisión editorial**, sin modificación. |
| `5:1` Huevos camperos con Patatas y Gulas | `Œufs à la campagne avec pommes de terre et gulas (substitut de civelles).` | **Revisión de naturalidad:** `à la campagne` es traducción literal de `camperos`; preservar el nombre cultural del plato y considerar una explicación más idiomática, solo con criterio editorial. Se conservan patatas y gulas. |
| `4:0` Risotto de Boletus y Setas | `Risotto aux cèpes et autres champignons.` | La distinción boletus/setas se conserva con una formulación razonable; `cèpes` puede concretar un grupo de boletus y requiere verificación gastronómica si el origen es genérico. **No afirmar error confirmado**. |
| `5:2` Revuelto Tierra y Mar | `Œufs brouillés aux asperges, au saumon fumé et aux crevettes.` | Las tres adiciones del original están presentes (espárragos, salmón ahumado y gambas). Concordancia con el catálogo documentada. |
| `5:6` Revuelto Moriles | `Œufs brouillés aux petits pois, aux champignons, à l’oignon et au jambon.` | Conserva guisantes, setas, cebolla y jamón. Concordancia con el catálogo documentada. |
| `5:12` Cardos con Almejas y Gambas | `Cardons aux palourdes et aux crevettes.` | Preserva cardos, almejas y gambas; sin discrepancia detectada respecto al catálogo. |

**Estado:** revisión de la muestra documental **ejecutada**; 1 observación ortotipográfica concreta y 2 candidatos de naturalidad/precisión; **ningún archivo de traducción, catálogo, código de aplicación o CSS modificado**. No hay nueva prueba de CI en este lote documental. Continúa pendiente la validación semántica de los demás lotes, verificación con originales, decisión editorial de correcciones propuestas y autorización de publicación. Próximos lotes sugeridos: `batch-096` y `batch-097`. Rama `main` intacta; FR limitado a `?qa_fr=1`.


## Confirmación de PASS y entrega de handoff — 04/11/2026

**Confirmación comunicada por Helio:** nuevos **PASS** después del tramo de revisión documental de Moriles Ribera lotes 094–095 (última anotación en commit `1746696`). Como ese commit solo editó documentación, registrar la confirmación como **conformidad del responsable / CI reportado en verde**, sin atribuir a dichos PASS validación lingüística completa de las 24 entradas ni indicar que se ejecutó una nueva prueba de contenido.

**Traspaso:** se añadió al final de `README.md` el bloque «Handoff QA francés — 4 de noviembre de 2026 (estado actualizado)» (commit `693168d`). En él se sintetizan rama exclusiva, pruebas PASS, fallos resueltos, observaciones editoriales pendientes, situación de publicación y próxima tarea. **La siguiente revisión es de `batch-096-moriles-ribera.json` y `batch-097-moriles-ribera.json`**, tomando ES/EN y formatos desde el catálogo real de la misma rama.

**Límites:** el francés sigue solo bajo `?qa_fr=1`; `main` intacta; no se ha aprobado ni modificado ninguna traducción por este traspaso. No confundir automatización estructural con validación editorial o auditoría WCAG.


## Revisión trilingüe: Moriles Ribera, lotes 096–097 — 04/11/2026

**Fuentes y método:** revisión documental individual de las 12 entradas de `translations/fr/batch-096-moriles-ribera.json` (índices `5:13–5:18`, `6:0–6:5`) y las 12 de `batch-097-moriles-ribera.json` (`6:6–6:17`), comparando por `sectionIndex:itemIndex` con `name`, `es`, `en` y `prices[].label` de `data/places.json` de esta misma rama, blob `0ffd3de396986d99125752cde7b4c2c52a20b31e`. **24/24 revisadas; acumulado documental 090–097: 96 entradas.** No es inspección de la carta oficial externa ni validación de vigencia de platos o precios. Los lotes continúan marcados `candidate_awaiting_semantic_review`.

| Índice | Plato | Resultado / clasificación |
|---|---|---|
| `5:13` | Champiñones con Jamón y Salsa Verde | Conserva ingredientes y salsa; sin discrepancia apreciable. |
| `5:14` | Parrillada de Verduras con Salsa Romesco | Conserva verduras a la parrilla y romesco. |
| `5:15` | Parrillada de Verduras con Queso de Cabra Asado | Conserva verduras, queso de cabra y asado. |
| `5:16` | Pimientos del Padrón | `Piments de Padrón` respeta el nombre de origen. |
| `5:17` | Pisto Cordobés con Huevo | Conserva pisto y huevo; `aux légumes` explicativo, no error demostrado. |
| `5:18` | Setas a la plancha con Salsa Verde | `Champignons grillés` resulta menos específico que `a la plancha` / `griddled`; precisión estilística candidata. |
| `6:0` | Araña | Conserva `araña` sin inventar especie; conforme al prudente EN. |
| `6:1` | Bacalao Frito | `Morue salée frite` sigue al EN `fried salt cod`; el ES no especifica salazón; sin defecto FR probado. |
| `6:2` | Soldaditos de Pavía | Conserva nombre cultural y buñuelo de bacalao salado según EN; naturalidad pendiente. |
| `6:3` | Boquerones Fritos | `Anchois frits` conserva pescado y fritura. |
| `6:4` | Calamaritos Fritos | `Petits calamars frits` preserva tamaño y fritura. |
| `6:5` | Chanquetes Cristal con Huevos Fritos y Fritada de Ajitos | Preserva pescado tradicional, huevos fritos y ajo; `ail frit` simplifica `fritada de ajitos`, precisión opcional a evaluar. |
| `6:6` | Chipirones Fritos | `Petits calamars frits` conserva significado general, pero coincide con la entrada de calamaritos `6:4`; posible pérdida de distinción tradicional. |
| `6:7` | Choco Frito | `Seiche frite` correcto respecto al catálogo. |
| `6:8` | Japuta en Adobo | Mantiene `japuta` y marinado, sin atribuir composición del adobo. |
| `6:9` | Ortiguillas de Chipiona Fritas | Mantiene anémonas, Chipiona y fritura. |
| `6:10` | Rosada al Limón | Mantiene `rosada` y limón sin inventar especie. |
| `6:11` | Fritura Variada de Pescaito (2 personas) | Mantiene fritura y **2 personas**; hay ración y media ración en catálogo: no atribuir automáticamente el alcance de dos comensales a ambos formatos. |
| `6:12` | Calamar a la brasa | `Grillé à la braise` mantiene técnica; leve redundancia estilística. |
| `6:13` | Mero a la plancha | `Mérou à la plancha` preserva especie y técnica. |
| `6:14` | Navajas a la plancha | `Couteaux de mer à la plancha` preserva molusco y técnica. |
| `6:15` | Filete de Atún vuelta y vuelta con sal de escamas | **Discrepancia semántica concreta contra el origen:** FR `fleur de sel` es más específico que ES `sal de escamas` y EN `flaky salt`. Propuesta **no autorizada**: `Filet de thon saisi rapidement, avec du sel en flocons.` |
| `6:16` | Pez espada a la Cordobesa | Respeta pez espada y preparación regional sin añadir ingredientes. |
| `6:17` | Gamba blanca de Huelva a la plancha | Preserva especie/variedad, procedencia y plancha. |

**Balance:** una discrepancia de precisión semántica en `6:15` frente al catálogo; cuatro cuestiones no concluyentes de terminología/estilo (`5:18`, `6:5`, `6:6`, `6:12`). Las demás entradas no muestran pérdidas relevantes en el cotejo ES/EN/FR. No equivale a certificación nativa ni a validación frente a imágenes oficiales. Se contrastaron los formatos registrados pero no se alteraron importes, cantidades ni modalidades; los JSON FR de estos lotes solo aportan descripciones.

**Estado:** registro exclusivamente documental, **sin autorización de cambios editoriales**. No se modifican `data/places.json`, los lotes FR, `i18n.js`, la aplicación ni CSS. **No se ha ejecutado CI nuevo** por este control. Los PASS técnicos previos constan como comunicados por Helio y no como aprobación semántica. Francés limitado a `?qa_fr=1`, no publicable; `main` permanece intacta.

**Próximo control:** decidir editorialmente si se acepta la propuesta mínima de `6:15` y si merece la pena refinar las otras observaciones; solo tras aprobación modificar en la rama QA, contrastar ES/EN/FR y probar regresión.


## PASS comunicado y revisión documental de Moriles Ribera, lotes 098–099 — 04/11/2026

**PASS comunicado por Helio:** confirmación del tramo anterior (lotes 096–097) y de las comprobaciones existentes. Se registra como confirmación del responsable; **no** como aprobación editorial de los candidatos ni como ejecución de una nueva prueba CI para este tramo.

**Fuentes y alcance:** cotejo directo de las 12 entradas de `translations/fr/batch-098-moriles-ribera.json` (`6:18–6:25`, `7:0–7:3`) y 12 entradas de `batch-099-moriles-ribera.json` (`7:4–7:15`) con `name`, `es`, `en` y `prices[].label` de la ficha `moriles-ribera` en `data/places.json`, mismo blob de la rama QA `0ffd3de396986d99125752cde7b4c2c52a20b31e`. **24/24 descripciones revisadas**; acumulado documental de Moriles Ribera lotes 090–099: **120 entradas**. Revisión del catálogo, **no** inspección de cartas gráficas externas ni validación de vigencia/precios.

| Índice | Plato | Contraste documental ES / EN / FR |
|---|---|---|
| `6:18` | Gamba blanca de Huelva cocida | `Crevettes blanches de Huelva bouillies`: conserva procedencia y cocción. |
| `6:19` | Almejas a la marinera | `Palourdes en sauce marinière`: equivalente descriptivo razonable. |
| `6:20` | Coquinas de la Isla Cristina | `Coquinas de Isla Cristina`: mantiene denominación tradicional y origen, aunque sin explicación francesa del molusco; **posible mejora de comprensión**, no defecto demostrado. |
| `6:21` | Taco de Bacalao con Pisto | `Pavé de morue salée avec pisto de légumes`: conserva pescado y pisto; salazón explícita procede de EN, no consta explícitamente en ES. |
| `6:22` | Taco de Bacalao en salsa de Gambas | `Pavé de morue salée en sauce aux crevettes`: conserva ingredientes; misma reserva sobre salazón. |
| `6:23` | Pata de Pulpo a la brasa | `Tentacule de poulpe grillé`: conserva tentáculo y cocción general; `grillé` menos preciso que `a la brasa` / `chargrilled`. |
| `6:24` | Pulpo Feira a la Gallega | `Poulpe à la galicienne, pulpo a feira`: preserva estilo y nombre tradicional. |
| `6:25` | Salmón plancha a la naranja con patatitas y zanahoria baby | `Saumon grillé a l’orange avec petites pommes de terre et jeunes carottes`: ingredientes principales presentes; **error ortográfico verificable** `a l’orange` por `à l’orange`; `grillé` menos específico que ES `plancha` / EN `griddled`. |
| `7:0` | Chorizo al vino | `Chorizo au vin`: ingredientes principales preservados; no atribuir variedad de vino. |
| `7:1` | Chorizo criollo a la brasa | `Chorizo criollo grillé`: preserva origen nominal y cocción general, pero no explicita brasa. |
| `7:2` | Chorizo frito | `Chorizo frit`: equivalente correcto. |
| `7:3` | Cochifrito cordobés confitado | `Cochifrito cordobés confit, spécialité traditionnelle`: conserva `cochifrito`, origen y confitado del ES; no añadir técnica de cocción nueva. |
| `7:4` | Flamenquín de Jamón Serrano | `Flamenquín au jambon serrano`: mantiene nombre tradicional e ingrediente. |
| `7:5` | Flamenquín de Jamón Ibérico y Queso puro de Oveja | `Flamenquín au jambon ibérique et au fromage pur brebis`: preserva principales ingredientes; se repite el giro poco idiomático `fromage pur brebis` documentado en lotes previos. Candidato: `fromage au lait de brebis`, sin autorización. |
| `7:6` | Brocheta de Solomillo Ibérico | `Brochette de filet mignon de porc ibérique avec cèpes, champignons de Paris et fromage bleu`: preserva componentes explícitos del EN; `cèpes` puede estrechar `boletus`, pendiente de confirmar tipo de hongo. |
| `7:7` | Mollejas de Cordero lechal a la brasa | `Ris d’agneau de lait grillés à la braise`: víscera, animal y brasa preservados. |
| `7:8` | Riñones de Cordero lechal a la brasa | `Rognons d’agneau de lait grillés à la braise`: órganos, animal y brasa preservados. |
| `7:9` | Codillo asado | `Jarret de porc rôti`: conserva corte y asado. |
| `7:10` | Chuletitas de cordero lechal | `Côtelettes d’agneau de lait`: conserva corte y animal. |
| `7:11` | Entrecot de vaca vieja | `Entrecôte de bœuf maturé`: **discrepancia semántica candidata**: `maturé` suele describir maduración de carne, mientras que `vaca vieja` describe la edad del animal; EN `mature beef` también es ambiguo. No corregir sin decidir cómo preservar el dato original. |
| `7:12` | Chuletón de vaca vieja Frisona | La descripción FR `Prix publié au kilogramme et non à la portion` coincide con la **descripción** ES/EN y el formato real `Precio por kg`. El nombre del plato se conserva en el campo `name` del catálogo; no interpretar la descripción como traducción íntegra del nombre. |
| `7:13` | Solomillo de vaca Simmental | `Filet de bœuf de race Simmental`: respeta corte y raza. |
| `7:14` | Churrasco de Pollo a la Brasa con ajitos y patatas panaderas | `Poulet grillé à la braise avec ail et pommes de terre en rondelles`: conserva pollo, brasa, ajo y patatas; describe el corte pero no todo el sentido culinario de `patatas panaderas`, también simplificado en EN. **Mejora cultural/terminológica candidata**. |
| `7:15` | Lomo Ibérico de orza | `Longe de porc ibérique préparée traditionnellement en orza`: conserva carne ibérica y denominación tradicional `orza` sin presumir ingredientes. |

**Balance y distinción de estados:** 1 defecto ortográfico demostrable frente al francés escrito (`6:25` `a` por `à`); 1 discrepancia semántica candidata de mayor relevancia (`7:11` vaca vieja ≠ necesariamente carne madurada); alternativas editoriales menores en `6:20`, `6:23`, `6:25` (plancha), `7:1`, `7:5`, `7:6`, `7:14`. Ninguna omisión manifiesta de ingrediente principal detectada contra ES/EN del catálogo. No se declara error de fuente original ni validación lingüística nativa.

**Formatos:** se contrastaron los `prices[].label` reales, incluidos `Ración`, `Media ración`, `Tapa` y excepcionalmente `Precio por kg` en `7:12`. Las traducciones FR de los lotes son descripciones, no equivalencias nuevas de tamaño o importe. No alterar su significado ni extrapolar cantidades.

**Decisión / alcance:** registro documental únicamente. **Sin edición de candidatos FR ni `data/places.json`; sin pruebas CI nuevas.** Francés bajo `?qa_fr=1`, sin autorización para publicación o fusión; `main` no se toca. Siguiente tarea editorial: evaluar primero ortografía `6:25` y significado `7:11`; modificar solo con autorización y realizar regresión ES/EN/FR tras cualquier cambio. Continuar después con lotes Moriles Ribera siguientes que existan.


## PASS comunicado y revisión Moriles Ribera, lotes 100–101 — 04/11/2026

**PASS comunicado:** Helio confirma nuevo PASS del tramo previo (lotes 098–099). Es confirmación del responsable, sin convertir los 24 candidatos de ese tramo en traducciones aprobadas ni atribuir al presente control una ejecución CI.

**Método y fuentes:** lectura de `translations/fr/batch-100-moriles-ribera.json` (12 entradas, `7:16–7:27`) y `batch-101-moriles-ribera.json` (12 entradas, `7:28`, `8:0–8:4`, `9:0–9:5`). Contraste individual por índice con los campos `name`, `es`, `en` y formatos de `data/places.json`, ficha exacta `moriles-ribera` de la rama QA, blob `0ffd3de396986d99125752cde7b4c2c52a20b31e`. **24/24 examinadas; acumulado documental 090–101: 144 entradas.** No se verificó la carta gráfica oficial, la vigencia ni precios actuales.

| Índice | Plato | Resultado del cotejo |
|---|---|---|
| `7:16` | Abanico Ibérico | `Morceau « abanico » de porc ibérique`: corte tradicional y especie conservados. |
| `7:17` | Churrasco Ibérico a las dos salsas | `Churrasco de porc ibérique accompagné de deux sauces`: conserva las **dos salsas**; no infiere cuáles son. |
| `7:18` | Lagarto Ibérico | Conserva `lagarto` como denominación de corte, evitando interpretarlo como reptil. |
| `7:19` | Pluma Ibérica | Conserva `pluma` y cerdo ibérico. |
| `7:20` | Presa Ibérica | Conserva `presa` y cerdo ibérico. |
| `7:21` | Secreto Ibérico | Conserva `secreto` y cerdo ibérico. |
| `7:22` | Parrillada Ibérica | Selección de cortes de cerdo ibérico y salchichas/embutidos mencionados en EN; mantiene **dos personas**. No extrapolar equivalencia de tamaño con otros platos. |
| `7:23` | Tomahawk Ibérico (270 g aprox.) | Mantiene tomahawk, cerdo ibérico y **270 g aproximados**, sin alterar cantidad. |
| `7:24` | Solomillo Ibérico a la Pimienta | Conserva solomillo ibérico y salsa a la pimienta. |
| `7:25` | Solomillo Ibérico al Pedro Ximénez | Conserva solomillo ibérico y Pedro Ximénez; `sauce au vin` procede del descriptivo EN. |
| `7:26` | Solomillo Ibérico con Queso Azul del Valle de los Pedroches | Conserva carne, queso azul y Los Pedroches. |
| `7:27` | Magret de Pato Mulard con salsa de naranja de Palma del Río | Conserva magret, pato mulard, naranja y Palma del Río. |
| `7:28` | Hamburguesa Moriles | Conserva vaca retinta, jamón ibérico, queso de oveja, patatas gajo y pimientos del Padrón. `jambon ibérique` es coherente, sin especificar tipo de curación no descrito en ES. |
| `8:0` | Rabo de toro | `Rabo de toro, queue de taureau traditionnelle`: respeta literalmente nombre español; `queue de bœuf` sería habitual en gastronomía francesa, pero podría borrar literalidad de `toro`. **Preferencia terminológica pendiente**, no error demostrado con ES/EN. |
| `8:1` | Carrillada Ibérica a la miel de caña | `Joues de porc ibérique au sirop de canne`: carne y miel de caña preservadas de forma descriptiva. |
| `8:2` | Callos con Manitas y Garbanzos | `Tripes avec pieds de porc et pois chiches`: los tres componentes registrados se preservan. |
| `8:3` | Ternera en salsa | `Veau en sauce`: coincide con ES/EN sin inventar ingredientes de la salsa. |
| `8:4` | Lomo con Tomate | `Longe de porc à la tomate`: mantiene corte y tomate. |
| `9:0` | Flamenquín de york con patatas fritas | `Flamenquín au jambon cuit avec frites`: conserva nombre, jamón cocido y patatas fritas. |
| `9:1` | San Jacobo con patatas fritas | `San Jacobo pané au jambon et au fromage avec frites`: conserva denominación y preparación conforme a EN. |
| `9:2` | Huevos (dos) con patatas fritas | `Deux œufs avec frites`: **dos** huevos conservados. |
| `9:3` | Mini hamburguesas (dos) de pollo con patatas fritas | `Deux mini burgers de poulet avec frites`: **dos** miniburgers de pollo conservados. |
| `9:4` | Nuggets de pollo con patatas fritas | `Nuggets de poulet avec frites`: componentes conservados. |
| `9:5` | Pechuga de pollo empanada con patatas fritas | `Blanc de poulet pané avec frites`: corte, empanado y acompañamiento conservados. |

**Balance:** sin omisiones demostradas de ingredientes principales, números o formatos entre ES/EN/FR; una observación editorial no concluyente sobre `8:0` (`queue de taureau` frente al uso gastronómico `queue de bœuf`). Los formatos `Ración`, `Media ración` y `Tapa` del catálogo se mantienen como datos de origen; ninguno de estos JSON FR introduce precios nuevos ni conversiones. Estas observaciones **no son aprobación editorial de los textos ni verificación frente a fuentes originales externas**.

**Estado y límites:** registro documental únicamente; traducciones `candidate_awaiting_semantic_review`. No cambiar lotes FR, `data/places.json`, `i18n.js`, HTML, JS ni CSS; sin CI nuevo por esta revisión. Francés limitado a `?qa_fr=1` y no autorizado para publicar. Rama `main` intacta. Continuar con los siguientes lotes reales de Moriles Ribera; resolver cambios editoriales solo tras decisión expresa y regresión ES/EN/FR.


## PASS comunicado y cotejo documental Moriles Ribera, lotes 102–103 — 04/11/2026

**PASS precedente:** Helio comunica un nuevo PASS después del bloque 100–101. Se registra como **confirmación del responsable**, no como aprobación de sus traducciones ni como un nuevo CI ejecutado para este lote documental.

**Evidencias y método:** lectura de `translations/fr/batch-102-moriles-ribera.json` (12 entradas: `9:6`, `10:0–10:1`, `11:0–11:8`) y `batch-103-moriles-ribera.json` (12 entradas: `11:9–11:20`), cotejadas por índice con el catálogo `data/places.json` de la misma rama, blob `0ffd3de396986d99125752cde7b4c2c52a20b31e`. Comprobados `name`, `es`, `en` y `prices[].label` de cada entrada. **24/24 contrastadas; total documental Moriles Ribera lotes 090–103: 168 entradas.** No se han consultado las imágenes de la carta original ni revalidado precios actuales, ingredientes externos o posibles alérgenos.

| Índice | Plato | Resultado del contraste |
|---|---|---|
| `9:6` | Pechuga de pollo plancha con patatas fritas | FR `Blanc de poulet à la plancha avec frites`: conserva corte, técnica y acompañamiento. |
| `10:0` | Plato Moriles | FR conserva lomo conservado, jamón serrano, chorizo, morcilla y patatas según EN. `longe de porc conservée` puede sonar poco natural, pero evita inventar técnica de conservación. |
| `10:1` | Plato Ribera | FR conserva flamenquín, berenjenas fritas, huevos y patatas; sin detalles nuevos de preparación. |
| `11:0` | Flan con helado de vainilla | FR conserva flan y helado de vainilla. |
| `11:1` | Gachas con pasas y nueces | FR conserva nombre tradicional, carácter dulce según EN, pasas y nueces. |
| `11:2` | Naranja estilo Moriles | FR conserva naranja y estilo Moriles; no infiere ingredientes adicionales. |
| `11:3` | Natillas con su galleta María | FR `Crème dessert espagnole avec biscuit María` preserva postre y galleta, aunque podría mantener también `natillas` como nombre cultural. Preferencia editorial. |
| `11:4` | Pastel Cordobés con helado de vainilla | FR conserva `Pastel cordobés` y helado de vainilla sin inventar relleno. |
| `11:5` | Tarta de queso del Moriles con membrillo | FR conserva queso, Moriles y membrillo como pasta. |
| `11:6` | Tocino de cielo con helado de turrón | FR conserva `Tocino de cielo`, yemas según EN y helado de turrón. |
| `11:7` | Torrija de crema con helado de vainilla | FR conserva `Torrija`, crema según EN y helado. |
| `11:8` | Arco de la Mezquita | FR conserva mousse de vainilla, arco de frambuesa y cobertura de chocolate como ES/EN; el nombre comercial permanece en `name` del catálogo. |
| `11:9` | Pastel de Caramelo a la Flor de Sal | FR `fleur de sel` **sí está respaldado literalmente por ES** y es correcto aquí (distinto de la discrepancia `sal de escamas` en `6:15` de lote 097). |
| `11:10` | Coulant de chocolate con helado de vainilla | FR conserva pastel de chocolate tipo fondant y helado de vainilla. |
| `11:11` | Tres chocolates | FR conserva tres chocolates. |
| `11:12` | Iglú de Ferrero | FR `Dessert glacé façon Ferrero` conserva helado y marca/estilo, pero **no expresa la forma o denominación «iglú»**; EN también omite esta noción. Candidato de identidad de plato, no omisión de ingrediente. |
| `11:13` | Tarta de chocolate (sin gluten y sin lactosa) | FR `Gâteau au chocolat indiqué sans gluten et sans lactose` conserva ambas indicaciones como **declaraciones de la carta**, no certificación analítica o recomendación sobre alérgenos. |
| `11:14` | Tarta Selva Negra | FR `Gâteau Forêt-Noire` preserva denominación habitual. |
| `11:15` | Tarta de Tiramisú | FR `Gâteau au tiramisu` conserva categoría y sabor. |
| `11:16` | Tarta de Mousse de Chocolate | FR conserva tarta y mousse de chocolate. |
| `11:17` | Tarta Cremosa de Pistacho | FR conserva tarta, cremosidad y pistacho. |
| `11:18` | Tulipa de muerte por chocolate | FR preserva chocolate y recipiente en forma de tulipa, pero **no traslada el nombre expresivo «muerte por chocolate»**; EN también lo generaliza. Candidato de identidad gastronómica. |
| `11:19` | Tulipa helada de turrón | FR conserva helado de turrón y copa en forma de tulipa según EN. |
| `11:20` | Tulipa helada de vainilla de Tahití con nueces de macadamia | FR conserva vainilla de Tahití y macadamia, pero **omite el formato/presentación «tulipa»** del nombre ES; EN también lo omite. Candidato de descripción incompleta, no defecto de formato de precio. |

**Balance:** no se aprecia ingrediente principal inventado u omitido frente a la información registrada. Tres candidatos de conservación de identidad/presentación de postres `11:12`, `11:18`, `11:20`, compartidos en diversa medida con EN; observaciones leves de terminología en `11:3` y `10:0`. **No son errores externos demostrados ni decisiones de corrección.** Los formatos de catálogo son `Ración` para `9:6` y `10:0–10:1`, y `Unidad` para los postres `11:0–11:20`. La forma de tulipa del nombre no cambia el formato de precio `Unidad` del catálogo.

**Decisión:** informe documental únicamente. No hay cambios en lotes FR, ES/EN, `data/places.json`, código ni CSS; **sin nuevo CI** en este control. Los candidatos siguen `candidate_awaiting_semantic_review`; francés experimental bajo `?qa_fr=1`, sin autorización de publicación. `main` intacta. Continuar con los siguientes lotes reales y evaluar ajustes editoriales solo tras consentimiento, seguida de regresión ES/EN/FR.


## PASS comunicado y revisión documental Moriles Ribera, lotes 104–105 — 04/11/2026

**PASS comunicado:** Helio confirma nuevo PASS tras el tramo 102–103. Se registra como **confirmación del responsable** de controles previos, sin atribuir a esta revisión documental nuevas ejecuciones CI ni aprobación editorial de candidatos FR.

**Alcance y método:** cotejo 1:1 de las 12 entradas de `translations/fr/batch-104-moriles-ribera.json` (`11:21–11:25` y `12:0–12:6`) y las 12 de `batch-105-moriles-ribera.json` (`12:7–12:18`) con `name`, `es`, `en` y `prices[].label` de `data/places.json`, ficha `moriles-ribera`, blob `0ffd3de396986d99125752cde7b4c2c52a20b31e` de la misma rama. **24/24 entradas contrastadas; 192 acumuladas en los lotes 090–105.** No se leyeron imágenes de cartas externas ni se validó vigencia de productos, precios o reclamos nutricionales.

| Índice | Plato / campo | Evaluación de FR frente a ES/EN |
|---|---|---|
| `11:21` | Copa Helada de Nata y Nueces (sin azúcar) | `Coupe glacée à la crème et aux noix, indiquée sans sucre`: conserva presentación, nata, nueces y la declaración `sin azúcar` atribuida a la carta. No afirmar certificación nutricional. |
| `11:22` | Tarta de Zanahoria | `Gâteau aux carottes`: equivalente. |
| `11:23` | Surtido de postres | Conserva tres chocolates, tarta de tiramisú, torrija de crema y helado de vainilla; `fourrée` sigue la interpretación de EN. |
| `11:24` | Surtido de postres cordobeses | Conserva tarta de queso Moriles con membrillo, pastel cordobés con helado de vainilla y Arco de la Mezquita. |
| `11:25` | Trufita de Chocolate | `Petite truffe au chocolat`: conserva chocolate y diminutivo. |
| `12:0` | Café Solo | `Café espresso noir`: fiel al origen y EN; `espresso noir` ligeramente redundante, solo estilo. |
| `12:1` | Café Expreso | `Café espresso`: fiel. |
| `12:2` | Café Cortado | `Espresso avec un peu de lait`: conserva proporción descriptiva sin fijar cantidad. |
| `12:3` | Café con Leche | `Café au lait`: fiel. |
| `12:4` | Leche Manchada | `Lait avec un trait de café`: diferencia correctamente la leche manchada del cortado. |
| `12:5` | Café Americano | `Café americano`: equivalente comprensible. |
| `12:6` | Café Bombón | `Café au lait concentré sucré`: traduce según EN; el ES nombra el café pero no explicita su composición. No inventar proporciones. |
| `12:7` | Café Capuchino | `Cappuccino`: denominación habitual. |
| `12:8` | Café Vienés | `Café viennois`: equivalente. |
| `12:9` | Café Mocaccino | `Café mocaccino`: denominación conservada, sin inferir ingredientes adicionales. |
| `12:10` | Café con Helado de Vainilla | `Café accompagné de glace à la vanille`: fiel. |
| `12:11` | Café con Helado de Turrón | `Café accompagné de glace au touron`: fiel. |
| `12:12` | Carajillo Flameado de Brandy | `Carajillo flambé au brandy`: conserva nombre, técnica y licor. |
| `12:13` | Carajillo Flameado de Ron | `Carajillo flambé au rhum`: fiel. |
| `12:14` | Carajillo Flameado de Anís | `Carajillo flambé à la liqueur d’anis`: sigue el EN y conserva licor y técnica. |
| `12:15` | Carajillo Flameado de Whisky | `Carajillo flambé au whisky`: fiel. |
| `12:16` | Expreso 43 | `Espresso au Licor 43`: preserva denominación de licor explicitada en EN. |
| `12:17` | Café con Baileys | `Café au Baileys`: fiel. |
| `12:18` | Café Irlandés | `Café irlandais`: equivalente común. |

**Balance:** 24/24 entradas cotejadas, sin omisiones principales ni discrepancias semánticas demostradas entre los textos registrados. Observación meramente estilística en `12:0`, sin necesidad de editar. Los 24 artículos conservan `Unidad` como formato de origen; los lotes FR son descripciones sin datos de precio nuevos. No se extrapolan ingredientes de la carta original gráfica, disponibilidad ni composición de bebidas.

**Estado:** revisión documental completada; `candidate_awaiting_semantic_review` sin cambio. Ninguna modificación de lotes FR, ES/EN, `data/places.json`, `i18n.js`, HTML, JS o CSS; ningún CI nuevo ejecutado para esta revisión. Francés experimental bajo `?qa_fr=1`, sin autorización para publicar o fusionar; `main` intacta. Continuar con los lotes siguientes que realmente existan y mantener acumuladas las cuestiones editoriales para decisión expresa.


## PASS comunicado y revisión documental Moriles Ribera, lotes 106–107 — 04/11/2026

**Confirmación recibida:** Helio comunica nuevo **PASS** para el tramo precedente (lotes 104–105). Se registra como confirmación del responsable, sin atribuir a este bloque una ejecución nueva de CI ni una aprobación editorial lingüística.

**Alcance real:** lectura de `translations/fr/batch-106-moriles-ribera.json` (**12 entradas**, índices `12:19–12:22` y `13:0–13:7`) y `batch-107-moriles-ribera.json` (**10 entradas**, índices `13:8` y `14:0–14:8`). **22/22 entradas examinadas; acumulado documental Moriles Ribera lotes 090–107: 214 entradas**. Se han comparado `placeId`, `sectionIndex`, `itemIndex`, FR y los campos `name`, `es`, `en`, `prices[].label` de la ficha exacta `moriles-ribera` en `data/places.json` de esta rama (blob `0ffd3de396986d99125752cde7b4c2c52a20b31e`). No se revalidaron cartas gráficas oficiales, precios ni disponibilidad.

| Índice | Plato / bebida | Contraste ES/EN/FR |
|---|---|---|
| `12:19` | Café Cubano | `Café à la cubaine` representa el estilo sin inferir receta. |
| `12:20` | Amaretto Café | `Café à l’amaretto` preserva café y amaretto. |
| `12:21` | Calypso Café | `Café façon Calypso` conserva denominación/estilo sin inferir ingredientes. |
| `12:22` | Café Barraquito | `Café barraquito` conserva nombre tradicional. |
| `13:0` | Menta | `Infusion à la menthe` reproduce el EN `mint infusion`. |
| `13:1` | Manzanilla | `Infusion à la camomille` desambigua manzanilla como infusión, sin confundir con vino. |
| `13:2` | Tila | `Infusion de fleurs de tilleul` conserva materia vegetal. |
| `13:3` | Rooibos Canela y Menta | `Rooibos à la cannelle et à la menthe` conserva ambas adiciones. |
| `13:4` | Té Blanco con Fresa y Frambuesa | `Thé blanc à la fraise et à la framboise` conserva té y frutas. |
| `13:5` | Té Rojo Pu-Erh | `Thé pu-erh` preserva variedad, aunque omite el descriptor comercial español `rojo`; no es error demostrado al tratarse de pu-erh correctamente identificado. |
| `13:6` | Té Verde Gunpowder | `Thé vert Gunpowder` preserva variedad y color. |
| `13:7` | Té Verde con Hierbabuena | `Thé vert à la menthe verte` traduce hierbabuena como spearmint, conforme al EN. |
| `13:8` | Té Negro English Breakfast | `Thé noir English Breakfast` preserva variedad. |
| `14:0` | Chocolate con leche | `Chocolat au lait` reproduce `milk chocolate`, sin atribuir formato de bebida. |
| `14:1` | Chocolate Blanco | `Chocolat blanc` equivalente. |
| `14:2` | Chocolate Negro | `Chocolat noir` equivalente. |
| `14:3` | Chocolate Blanco con Avellanas | `Chocolat blanc aux noisettes` preserva fruto seco. |
| `14:4` | Chocolate con Leche y Praliné | `Chocolat au lait et au praliné` conserva componentes. |
| `14:5` | Chocolate Negro con Naranja y Canela | `Chocolat noir à l’orange et à la cannelle` conserva ingredientes. |
| `14:6` | Chocolate Suizo | `Chocolat chaud noir avec crème fouettée et cannelle` reproduce ES chocolate negro, nata montada y canela; `chaud` está apoyado por el EN. |
| `14:7` | Chocolate al Turrón | `Chocolat chaud noir avec crème fouettée et glace au touron` preserva ingredientes, temperatura identificada en EN y helado de turrón. |
| `14:8` | Chocolate a la Vainilla | `Chocolat chaud noir avec crème fouettée et glace à la vanille` preserva ingredientes y temperatura indicada por EN. |

**Ambigüedad conservada:** en `14:0–14:5`, ES y EN hablan de variedades de chocolate sin describir expresamente la presentación como bebida caliente. No sustituir por `chocolat chaud` sin evidencia de la carta original. En `14:6–14:8`, EN sí explicita `hot chocolate`. Los 22 registros conservan formato `Unidad`, que no demuestra por sí mismo si se trata de bebidas o piezas. No hay omisión o añadido sustancial de ingrediente detectado en el cotejo documental.

**Resultado y límites:** 22 entradas comprobadas; **cero discrepancias semánticas demostradas frente a ES/EN**, una cautela editorial explícita sobre presentación de chocolates, ninguna modificación propuesta como obligatoria. No se han modificado candidatos FR, `data/places.json`, i18n, JS, CSS o HTML. **No se ejecutó nuevo CI por este contraste.** Los lotes permanecen `candidate_awaiting_semantic_review`, francés experimental bajo `?qa_fr=1`, publicación no autorizada y `main` intacta. Revisar siguientes lotes solo si existen; mantener decisión editorial posterior separada de los PASS técnicos.


## PASS comunicado y cierre de cobertura documental Moriles Ribera — 04/11/2026

**PASS del responsable:** Helio comunica nuevo PASS tras el control de lotes 106–107. Es confirmación comunicada, no inspección independiente de logs/artefactos ni aprobación editorial de los candidatos.

**Comprobación directa del inventario de la rama:** `translations/fr/` contiene exactamente 18 ficheros `batch-090-moriles-ribera.json` a `batch-107-moriles-ribera.json`. Los supuestos `batch-108-moriles-ribera.json` y `batch-109-moriles-ribera.json` responden 404 y no aparecen en el listado del directorio. Las 15 secciones de `menuSections` en la ficha `moriles-ribera` de `data/places.json` suman **214 entradas** (12+20+14+8+5+19+26+29+5+7+2+26+23+9+9), frente a las **214 descripciones revisadas documentalmente** en lotes 090–107. La cifra de cobertura es del **100 % de las entradas del catálogo registrado**, NO una aprobación semántica completa ni una certificación frente a la carta oficial externa. No hay lotes 108–109 para revisar; no generarlos artificialmente.

**Triaje editorial consolidado (sin autorización para editar):**

| Índice / lote | Hallazgo documentado | Clase / prioridad sugerida |
|---|---|---|
| `6:25`, lote 098 | `a l’orange` en lugar de `à l’orange` | Ortografía francesa comprobable; alta |
| `7:11`, lote 099 | `bœuf maturé` no equivale necesariamente a `vaca vieja` | Ambigüedad semántica relevante; alta, verificar decisión de término y origen |
| `6:15`, lote 097 | `fleur de sel` es más específico que `sal de escamas` / `flaky salt` | Discrepancia de especificidad; media |
| `2:3`, lote 092–093 | Construcción `séchée, issu` para caña de lomo | Concordancia/sintaxis candidata; media |
| `0:2`, `2:4–5`, `2:7`, `7:5` | `fromage pur brebis` frente a queso puro de oveja | Naturalidad terminológica recurrente; editorial |
| `5:0–1`, `6:5–6`, `11:12`, `11:18`, `11:20` | Huevos, distinción de frituras y preservación de nombres/presentación de postres | Identidad cultural y naturalidad; editorial |
| Etiquetas `ibéricos` / `revueltos` | Fuente de Moriles Ribera aún no interpretada totalmente a nivel de platos originales | Necesita cotejo visual de la carta oficial, no sustituir por intuición |
| `14:0–14:5`, lotes 106–107 | No está demostrado que todos los chocolates sean bebidas calientes | Mantener ambigüedad; no completar `chaud` sin fuente |

**Importante:** las etiquetas pendientes de Moriles Casa Fina y Manolete de La Montillana se mantienen fuera del alcance de Moriles Ribera; no mezclar establecimientos. Tampoco confundir la expresión documentada `fleur de sel` en el postre `11:9` con el caso de `6:15`.

**Estado al cierre del inventario:** revisión documental ES/EN/FR **terminada para las 214 entradas del catálogo Moriles Ribera**, con observaciones editoriales **abiertas**. Traducciones siguen `candidate_awaiting_semantic_review`; no se han modificado archivos de traducciones, nombres, ingredientes, precios, formatos, `data/places.json`, aplicación, CSS ni `main`. No se ha ejecutado un CI nuevo por esta documentación. Francés solo disponible experimentalmente bajo `?qa_fr=1` y **no autorizado para publicación**.

**Siguiente decisión:** aprobar o descartar explícitamente las correcciones editoriales mínimas con evidencia ES/EN y, donde haga falta, carta oficial; después aplicar ajustes solo en la rama QA y ejecutar regresión ES/EN/FR. Alternativamente, continuar la revisión humana de otro establecimiento sin declarar cerrado el criterio editorial de Moriles Ribera.


## PASS comunicado y preparación de decisiones editoriales — Moriles Ribera — 04/11/2026

**Confirmación del responsable:** Helio comunica otro PASS tras el cierre del inventario documental de los 214 platos de Moriles Ribera (lotes 090–107). Se registra como **PASS comunicado**, no como inspección directa de CI ni autorización para editar traducciones; el 100 % de cobertura documental sigue sin equivaler a aprobación lingüística.

**Reverificación de fuentes internas:** consulta del README, este informe y de los lotes FR reales `batch-092`, `batch-097`, `batch-098` y `batch-099` de la rama `feature/fr-integration-qa-20261027`. Las observaciones siguientes ya estaban registradas y aquí se consolidan como decisiones propuestas, no como defectos técnicos nuevos ni cambios implementados.

| Índice / archivo | Valor actual comprobado | Evaluación y propuesta *no aprobada* | Dependencia |
|---|---|---|---|
| `6:25` / `batch-098` | `Saumon grillé a l’orange avec petites pommes de terre et jeunes carottes.` | Error ortográfico francés confirmado: preposición `à` requiere acento. Ajuste mínimo sugerido: cambiar únicamente `a l’orange` → `à l’orange`. La equivalencia `grillé` frente a `plancha` es cuestión independiente. | Autorización editorial, prueba FR y regresión ES/EN/FR |
| `2:3` / `batch-092` | `Caña de lomo ibérique de bellota (longe de porc séchée, issu de porcs nourris aux glands).` | Construcción con concordancia/referente poco clara entre `longe ... séchée` y `issu de porcs`; candidata a reestructurar sin perder `caña de lomo`, `bellota` ni alimentación de bellotas. No cambiar el método de curado sin fuente externa. | Redacción francesa revisada y aprobación |
| `6:15` / `batch-097` | `Filet de thon saisi rapidement, avec fleur de sel.` | `fleur de sel` es una variedad más específica que ES `sal de escamas` / EN `flaky salt`. Candidata: `Filet de thon saisi rapidement, avec du sel en flocons.` (preservar atún y vuelta y vuelta). **No afecta** al postre `11:9` cuya `flor de sal` sí está en ES. | Decisión editorial de precisión |
| `7:11` / `batch-099` | `Entrecôte de bœuf maturé.` | `vaca vieja` designa edad del animal; `bœuf maturé` puede transmitir maduración del producto. **No hay reemplazo aprobado**; verificar fuente y elegir formulación que no presuma maduración. | Contraste de origen y elección terminológica |

**Orden de decisión sugerido:** (1) aprobar o rechazar corrección ortográfica inequívoca `6:25`; (2) aprobar redacción gramatical `2:3` y precisión `6:15`; (3) resolver `7:11` tras contrastar la terminología del producto; (4) abordar, en otro control, naturalidad, nombres regionales y descripciones de postres sin mezclarlos con errores demostrables. No alterar automáticamente el inglés ni el español: cotejar ambos cada vez que cambie FR.

**Estado:** **propuestas documentadas, cero modificaciones editoriales autorizadas o ejecutadas, cero nuevas pruebas CI ejecutadas por este análisis**. Los JSON conservan `candidate_awaiting_semantic_review`, francés solo con `?qa_fr=1` y publicación no autorizada. `main` permanece intacta. Antes de editar cualquier candidato pedir decisión expresa del responsable y después realizar regresión y confirmar CI.


## Aplicación de tres correcciones FR autorizadas — 04/11/2026

**Autorización expresa del responsable:** tras la propuesta documentada en el bloque anterior, Helio autoriza las **tres correcciones puntuales** de Moriles Ribera (acentuación, concordancia de caña de lomo y precisión de sal en escamas). **No** autoriza modificar `7:11` (vaca vieja), aplicar retoques estilísticos adicionales, publicar el francés ni fusionar en `main`.

| Archivo / índice | Antes | Después | Commit |
|---|---|---|---|
| `batch-092-moriles-ribera.json` / `2:3` | `Caña de lomo ibérique de bellota (longe de porc séchée, issu de porcs nourris aux glands).` | `Caña de lomo ibérique de bellota (longe de porc séchée provenant de porcs nourris aux glands).` | `0d888cc` |
| `batch-097-moriles-ribera.json` / `6:15` | `Filet de thon saisi rapidement, avec fleur de sel.` | `Filet de thon saisi rapidement, avec du sel en flocons.` | `a1e7667` |
| `batch-098-moriles-ribera.json` / `6:25` | `Saumon grillé a l’orange avec petites pommes de terre et jeunes carottes.` | `Saumon grillé à l’orange avec petites pommes de terre et jeunes carottes.` | `99ef0b7` |

**Validación efectivamente realizada:** cada archivo se volvió a leer **desde GitHub, en la rama QA**, después de la escritura. Los tres se pudieron analizar como JSON y se comprobó coincidencia exacta del texto `fr` del índice esperado, 12 entradas por lote y conservación de `meta.status = candidate_awaiting_semantic_review`. En las tres operaciones se sustituyó el `fr` de un único índice conservando las demás entradas en memoria. Se mantienen nombres tradicionales y las distinciones originales: la caña de lomo sigue siendo `de bellota`, el atún continúa `saisi rapidement` con sal en escamas (no `fleur de sel`) y el salmón conserva naranja, patatas y zanahorias. No se cambió `data/places.json`, los textos ES/EN, los precios, los formatos, `i18n.js`, la aplicación o CSS.

**Estado de pruebas:** lectura posterior y comprobaciones estáticas JSON **superadas**; **no** se ha ejecutado ni comprobado aquí un nuevo workflow GitHub Actions, Playwright o regresión visual ES/EN/FR. Su PASS está **pendiente**. El PASS anterior comunicado por Helio no debe atribuirse a estos cambios posteriores.

**Pendiente editorial:** `7:11` (`vaca vieja` frente a `bœuf maturé`) sigue abierto; otras observaciones de naturalidad, denominaciones y posibles discrepancias con la carta original permanecen pendientes. Los lotes siguen siendo candidatos, el francés únicamente experimental bajo `?qa_fr=1` y su publicación sigue sin autorización. **No se ha tocado `main`.**


## PASS posterior a las tres correcciones FR y triaje de vaca vieja — 04/11/2026

**PASS confirmado por Helio:** el responsable comunica PASS después de los commits de ajustes autorizados en `batch-092` (`0d888cc`), `batch-097` (`a1e7667`) y `batch-098` (`99ef0b7`), más el registro documental `0fb7f83`. Se clasifica como **PASS comunicado por el responsable posterior a los cambios**, sin afirmar inspección independiente de logs, artefactos o capturas de GitHub Actions.

**Nuevo triaje documental dirigido; no es una nueva prueba de CI:**
- El catálogo `data/places.json` de la rama QA, ficha exacta `moriles-ribera`, sección `7`, entrada `11`, registra nombre y ES **`Entrecot de vaca vieja`**, EN **`Mature beef entrecôte.`**, formato `Ración`. El lote real `translations/fr/batch-099-moriles-ribera.json` mantiene **`Entrecôte de bœuf maturé.`**, con estado `candidate_awaiting_semantic_review`.
- La web oficial española `https://www.morilesribera.com/nuestra-cocina` publica la imagen de categoría `MR 005 (Carnes)`; la versión inglesa `https://www.morilesribera.com/our-kitchen` separa las imágenes `MR 036 (Carnes 1) EN` y `MR 037 (Carnes 2) EN`. Se ha confirmado **la existencia de esas fuentes e identificación de la sección**, pero no se ha conseguido recuperar la imagen de carnes española ni leer sus textos directamente. Por tanto no se afirma confirmación del ítem en la imagen actual ni revisión de composición o precio en origen.
- **Riesgo semántico:** `vaca vieja` describe un animal de mayor edad; `bœuf maturé` en francés podría interpretarse como carne sometida a un proceso de maduración, que no se declara en el texto ES del catálogo. El EN `mature beef` no resuelve por sí solo esta ambigüedad. **Candidato de ajuste**, no prueba de un producto efectivamente madurado.
- **Alternativa editorial preliminar, NO autorizada:** considerar `Entrecôte de vache âgée.` o una formulación francesa gastronómicamente más natural que exprese edad del animal sin prometer maduración en seco; someter a revisión lingüística y, si es posible, contrastar la imagen original. No introducir raza, días de maduración, marmoleo ni método de crianza.
- La sección `7:12` (Chuletón de vaca vieja Frisona) tiene un campo de descripción destinado a **precio por kilogramo**, no porción; no intercambiarlo con el entrecot `7:11`, cuyo formato es ración.

**Decisión del bloque:** solo actualización de documentación y registro del PASS comunicado. No se altera `batch-099`, `data/places.json`, ningún texto ES/EN ni interfaz; ninguna prueba nueva ejecutada. Las tres correcciones anteriores siguen aplicadas y no se da por cerrada toda la evaluación editorial de Moriles Ribera. Francés experimental bajo `?qa_fr=1`, no autorizado para publicar; `main` sin tocar.

**Siguiente paso:** decidir expresamente una formulación FR para `7:11` cuando haya evidencia suficiente y criterio editorial; entonces aplicar un ajuste mínimo solo en rama QA y exigir nuevo control ES/EN/FR y confirmación de CI. También queda abierta la revisión nativa de mejoras estilísticas menos prioritarias.


## Contraste terminológico complementario: vaca vieja — 04/11/2026

**Objeto:** continuar el triaje del índice `7:11` de Moriles Ribera, sin cambiar la traducción `batch-099-moriles-ribera.json`. Se han releído README, informe editorial y lote actual de la rama QA.

**Evidencia del catálogo de la rama (ya contrastada en registros anteriores):** ES `Entrecot de vaca vieja`; EN `Mature beef entrecôte.`; FR actual `Entrecôte de bœuf maturé.`, formato `Ración`. No intercambiar con `7:12`, que usa precio por kilogramo.

**Comprobación de fuente externa:** la página oficial `https://www.morilesribera.com/nuestra-cocina` enumera la imagen `MR 005 (Carnes)`, con enlace a `https://www.morilesribera.com/wp-content/uploads/2026/02/MR-005-Carnes-scaled.png`; se intentó abrir la imagen mediante consulta web, pero la recuperación falló (cache miss). **No se ha comprobado visualmente el contenido del producto en esa imagen**, su vigencia ni su precio. No afirmar verificación oficial de la denominación.

**Contraste terminológico externo:** en el vocabulario francés de ganadería, `vache de réforme` abarca vacas retiradas de producción por distintos motivos y edades; no es sinónimo inequívoco de `vaca vieja`. La investigación sobre hembras de reforma distingue expresamente categorías y edades (INRA Productions Animales, 2005: `https://productions-animales.org/article/download/3508/11191`). `bœuf maturé` puede interpretarse como maduración aplicada a la carne, que el texto ES `vaca vieja` no afirma. La documentación externa sirve para distinguir conceptos, **no** para atribuir origen, raza o maduración a este restaurante.

**Propuesta editorial conservadora, todavía NO autorizada:** `Entrecôte de vache âgée.` representa la edad del animal sin añadir tratamiento de maduración. Debe revisarse su naturalidad gastronómica por francófono; no afirmar que es denominación oficial del restaurante. Otras expresiones como `vache de réforme` no se proponen automáticamente por su alcance diferente. El inglés `Mature beef entrecôte` queda sin cambios hasta decisión editorial ES/EN/FR.

**Estado:** contraste externo acotado realizado; lectura de la carta gráfica original **no realizada**; JSON `batch-099` **sin modificar**; **no hay CI ni prueba Playwright nueva**. Francés aún candidato experimental bajo `?qa_fr=1`, sin autorización de publicación; `main` intacta. Si se aprueba corrección, aplicar solo a `7:11` en rama QA y ejecutar regresión lingüística/estructural antes de pedir PASS del workflow.

## Nuevo PASS y triaje del queso de oveja — 04/11/2026

Helio comunica PASS posterior al último contraste documental. Es un **PASS comunicado**; no se ha comprobado una nueva ejecución de CI aquí y no hay aprobación editorial implícita.

Se han cotejado las cinco ocurrencias de `fromage pur brebis` en Moriles Ribera, índices `0:2` (lote 090), `2:4`, `2:5`, `2:7` (lote 093) y `7:5` (lote 099), con sus respectivos nombres y descripciones ES/EN en `data/places.json` de la misma rama. En español aparece `queso puro de oveja`; el inglés emplea `sheep's milk cheese` y el francés actual `fromage pur brebis`.

**Propuesta no autorizada:** `fromage au lait de brebis` ofrece una construcción francesa natural y es coherente con EN, pero no expresa literalmente `puro`. Confirmar antes si se desea preservar expresamente ese matiz; no atribuir composiciones adicionales al producto. Formatos originales sin cambios: `0:2` ración/media; `2:4` ración/media; `2:5` ración; `2:7` ración/media/tapa; `7:5` ración.

El índice `7:11`, `Entrecôte de bœuf maturé`, permanece sin autorización y sin cambios. Esta actuación es solo documental; no cambia textos FR, ES/EN, datos, precios ni interfaz; no ejecuta CI. Francés sigue experimental bajo `?qa_fr=1`, no publicado, y `main` intacta.


## Revisión de pimientos, salsa rosa y croquetas de boletus — 04/11/2026

**Alcance:** continuación de la revisión editorial tras cierre documental de Moriles Ribera. Se revisaron los candidatos FR reales `batch-090-moriles-ribera.json` y `batch-091-moriles-ribera.json`, cotejando las cuatro entradas señaladas con `name`, `es`, `en` y formatos del registro `moriles-ribera` de `data/places.json` de la rama QA, blob `0ffd3de396986d99125752cde7b4c2c52a20b31e`.

| Índice | Original y comparativa | Observación y propuesta, sin autorización |
|---|---|---|
| `0:3` / lote 090 | ES `Pimientos rojos y verdes asados con ventresca`; EN `Roasted red and green peppers with tuna belly`; FR `Poivrons rouges et verts grillés accompagnés de ventrèche de thon.` | `grillés` no distingue con la misma claridad el asado documentado frente al grill. **Candidata:** `Poivrons rouges et verts rôtis accompagnés de ventrèche de thon.` No afirmar técnica exacta de horno sin carta original. |
| `0:5` / lote 090 | ES `Anchoas, espárragos blancos, palmitos, piña, tomate rosa, maíz y salsa rosa`; EN `Anchovies, white asparagus, hearts of palm, pineapple, pink tomato, sweetcorn and pink dressing`; FR `Anchois, asperges blanches, cœurs de palmier, ananas, tomate rose, maïs doux et sauce cocktail.` | `sauce cocktail` puede designar una receta más concreta que la `salsa rosa` del origen. **Candidata:** sustituir únicamente por `sauce rose` para no atribuir ingredientes no identificados. Comprobar naturalidad francesa. |
| `1:1` / lote 091 | ES `Croquetas de Boletus`; EN `Boletus mushroom croquettes.`; FR `Croquettes aux cèpes (boletus).` | `cèpes` puede restringir el término amplio `boletus` sin respaldo explícito de la fuente. **Candidata:** `Croquettes aux boletus.` o mantener `boletus` como denominación del ingrediente; no asignar especie fúngica sin fuente. |
| `1:4` / lote 091 | ES `Croquetas de Rabo de Toro`; EN `Oxtail croquettes.`; FR `Croquettes à la queue de taureau.` | Conserva literalmente el nombre tradicional ES; no hay discrepancia demostrada. Sin corrección propuesta. |

**Formatos:** estas cuatro entradas tienen `Ración` y `Media ración` en el catálogo. Los JSON FR son textos descriptivos sin precios nuevos. **Resultado:** cuatro entradas contrastadas; tres candidatos editoriales y una coherencia confirmada contra ES/EN, sin acreditación visual de carta oficial. No hay modificaciones implementadas, ni CI nuevo ejecutado, ni autorización de publicación. La entrada `7:11` (`vaca vieja`) y las cinco entradas `fromage pur brebis` permanecen sin cambio, a la espera de decisión explícita.

**Estado de control:** revisión documental hecha, correcciones propuestas y pendientes de autorización. Francés bajo `?qa_fr=1` y `candidate_awaiting_semantic_review`; `main` intacta.


## Aplicación autorizada de cuatro ajustes FR — 05/11/2026 (Moriles Ribera, lotes 094–095)

**Autorización:** Helio aprobó expresamente las cuatro formulaciones FR propuestas. Alcance limitado a la rama `feature/fr-integration-qa-20261027`, sin publicación ni fusión a `main`.

| Lote / índice | FR anterior | FR nuevo | Commit |
|---|---|---|---|
| 094 / `4:0` | `Risotto aux cèpes et autres champignons.` | `Risotto aux boletus et autres champignons.` | `45233f4` |
| 094 / `5:0` | `Huevos à la flamenca, oeufs au jambon et au chorizo.` | `Huevos a la flamenca (œufs au jambon et au chorizo).` | `45233f4` |
| 095 / `5:1` | `Œufs à la campagne avec pommes de terre et gulas (substitut de civelles).` | `Huevos camperos aux pommes de terre et aux gulas (substitut de civelles).` | `349a1e7` |
| 095 / `5:11` | `Cèpes à la plancha avec jambon.` | `Boletus à la plancha avec jambon.` | `349a1e7` |

**Motivación editorial:** conservar los nombres tradicionales de huevos a la flamenca y huevos camperos; eliminar la errata tipográfica `oeufs` y la construcción literal `à la campagne`. Mantener `boletus` sin afirmar una especie concreta que no declara el texto de referencia. Son decisiones aprobadas de traducción, no constatación de especies o ingredientes nuevos en la carta original.

**Comprobaciones ejecutadas y superadas:** ambas escrituras devolvieron commit; cada JSON se volvió a obtener de GitHub desde la rama QA, se analizó y se comparó íntegramente con la versión escrita. Se comprobaron 12 entradas por archivo, `meta.status = candidate_awaiting_semantic_review`, `catalogModified = false`, y la invariancia de índices y campos distintos de los cuatro textos `fr` autorizados. No se editaron ES/EN, `data/places.json`, platos, precios, formatos, CSS ni interfaz.

**Límites:** la lectura JSON y comprobación estática **no equivalen** a ejecución de Playwright o PASS de GitHub Actions, y las fórmulas aprobadas no certifican revisión lingüística nativa completa. Las cuestiones anteriores (vaca vieja, queso puro de oveja, pimientos, salsa rosa, etc.) siguen abiertas y **no han sido alteradas**. Francés experimental bajo `?qa_fr=1`, `main` intacta. Cotejo histórico de 214/214 entradas ya completado: no duplicarlo.


### Confirmación de GitHub Actions — 05/11/2026, lotes 094–095

Helio aportó captura de la lista de GitHub Actions de la rama `feature/fr-integration-qa-20261027`, con indicadores verdes de éxito para tres ejecuciones consecutivas del workflow **Helio Gastro - data QA**:

- **#793 — SUCCESS**: `45233f4` (`fix(fr): refine Moriles Ribera editorial wording in batch 094`); duración mostrada 5 min 37 s.
- **#794 — SUCCESS**: `349a1e7` (`fix(fr): refine Moriles Ribera editorial wording in batch 095`); duración mostrada 5 min 35 s.
- **#795 — SUCCESS**: `026b3e4` (`docs(qa): record authorized Moriles Ribera FR batch 094-095 corrections`); duración mostrada 4 min 8 s.

**Evidencia y alcance:** PASS **confirmados visualmente por captura aportada por Helio**, no por inspección individual de logs ni de pasos del workflow. No inferir qué suites concretas se ejecutaron solo por el estado agregado. Las comprobaciones estáticas de estructura JSON y relectura de los archivos tras escritura también fueron realizadas y superadas; quedan separadas de esta evidencia CI. Las cuatro propuestas de traducción están autorizadas e implementadas, pero el PASS técnico no equivale a aprobación editorial nativa integral, revisión visual completa ni permiso para publicar francés o fusionar a `main`. Las cuestiones editoriales restantes continúan pendientes.


## Triaje dirigido de vaca vieja y queso puro de oveja — 05/11/2026

**Alcance:** lectura de los candidatos de `batch-090`, `batch-093` y `batch-099` directamente en la rama QA, después de los PASS #793–#795 comunicados por Helio. No se ha modificado ningún JSON FR ni `data/places.json` y no se ha ejecutado una nueva prueba CI. Las formulaciones a continuación son **propuestas pendientes de aprobación**, no cambios aplicados.

- **`batch-099`, `7:11` (entrecot de vaca vieja):** FR actual `Entrecôte de bœuf maturé.`. El término `maturé` puede sugerir un procedimiento de maduración no declarado en ES `vaca vieja`. Propuesta conservadora `Entrecôte de vache âgée.` aún pendiente de criterio editorial, contraste con la imagen de carta original y revisión de naturalidad francófona. No confundir con `7:12` (precio por kg).
- **Cinco entradas de queso puro de oveja:** `batch-090 0:2`, `batch-093 2:4, 2:5, 2:7`, `batch-099 7:5`. FR actual `fromage pur brebis` (mayúscula inicial en `2:7`). Propuesta `fromage pur lait de brebis` / `Fromage pur lait de brebis`; conserva el matiz de `puro` registrado en ES y es construcción natural en contexto quesero francés. La alternativa `fromage au lait de brebis` es más sencilla pero no explicita pureza. No afirmar composición o certificación independientes de la fuente original.
- **Referencias terminológicas externas, no fuentes del restaurante:** INAO Ossau-Iraty: https://inao.gouv.fr/produit/ossau-iraty-13705 usa `pur lait de brebis`; CIHEAM https://om.ciheam.org/ressources/om/pdf/a12/CI910172.pdf emplea `fromage pur lait de brebis`. Estas fuentes avalan la expresión lingüística, no la ficha gastronómica específica de Moriles Ribera.

**Estado:** seis entradas examinadas; una interpretación semántica sensible y cinco mejoras de formulación propuestas. Pendiente de autorización antes de editar, y después requerir comprobación estática, revisión ES/EN/FR y CI. Los cuatro ajustes de lotes 094–095 permanecen aplicados; no repetir los 214 controles ya completados. Francés experimental, no publicar ni fusionar.


## Cinco ajustes FR autorizados: queso puro de oveja — 05/11/2026

**Autorización editorial expresa de Helio:** sustituir las cinco ocurrencias de `fromage pur brebis` por `fromage pur lait de brebis`, manteniendo la mayúscula inicial donde corresponda, únicamente en `feature/fr-integration-qa-20261027`. **No autoriza** modificar el entrecot de vaca vieja `7:11`, que queda pendiente de contraste con carta original y revisión de naturalidad lingüística.

| Archivo | Índices modificados | Commit |
|---|---|---|
| `batch-090-moriles-ribera.json` | `0:2` | `ea49b6b` |
| `batch-093-moriles-ribera.json` | `2:4`, `2:5`, `2:7` | `01b4ec5` |
| `batch-099-moriles-ribera.json` | `7:5` | `903f998` |

**Validación realmente ejecutada:** tras cada escritura se obtuvo de nuevo el archivo desde la rama QA y se comprobó coincidencia íntegra del contenido, análisis JSON válido, 12 entradas por lote, `meta.status = candidate_awaiting_semantic_review` y `catalogModified = false`; no se alteraron otras entradas no autorizadas. Lectura adicional del lote 099 confirma que `7:11` sigue siendo `Entrecôte de bœuf maturé.`, **pendiente**, no corregido. Se modificaron solo cinco cadenas `fr`, sin alterar ES/EN, datos, precios, formatos, CSS ni `main`.

**Pruebas:** comprobaciones estáticas y relectura GitHub **PASS**. CI / GitHub Actions **sin nueva confirmación** para estos commits al momento de documentar; no atribuirles PASS de ejecuciones anteriores. Tampoco existe aprobación lingüística integral ni permiso de publicar francés. Próximo paso: verificar las ejecuciones de Actions y después proseguir los puntos editoriales abiertos sin repetir 214/214 controles.


## PASS comunicados #797–#801 y siguiente triaje del lote 090 — 05/11/2026

**Evidencia CI:** Helio adjuntó una captura de GitHub Actions de la rama `feature/fr-integration-qa-20261027` con marcas verdes SUCCESS en las ejecuciones **Helio Gastro - data QA** #797 (commit `4dfaec8`, triaje previo), #798 (`ea49b6b`, lote 090), #799 (`01b4ec5`, lote 093), #800 (`903f998`, lote 099) y #801 (`467a88b`, documentación). Se registra como **PASS confirmado por captura aportada por el responsable**, no como inspección de logs individuales o auditoría lingüística nativa. No hay autorización de publicación/fusión.

**Continuación editorial: lote 090, candidatos todavía sin modificar.** Relectura actual de `translations/fr/batch-090-moriles-ribera.json` de la rama QA:
- Índice `0:3`: FR `Poivrons rouges et verts grillés accompagnés de ventrèche de thon.`; ES documentado `Pimientos rojos y verdes asados con ventresca`; EN documentado `Roasted red and green peppers with tuna belly`. **Propuesta pendiente de aprobación:** `Poivrons rouges et verts rôtis accompagnés de ventrèche de thon.` Justificación: `rôtis` evita insinuar necesariamente parrilla/grill; no permite inferir horno concreto.
- Índice `0:5`: FR contiene `sauce cocktail`; ES documentado `salsa rosa`; EN `pink dressing`. **Propuesta pendiente de aprobación:** cambiar solamente `sauce cocktail` por `sauce rose`, manteniendo los demás ingredientes de la descripción. Justificación: evitar atribuir una receta concreta no documentada; falta confirmación del ingrediente original y revisión nativa de naturalidad.

**Estado actual:** la revisión de estos dos puntos es documental, sin edición de traducciones, pruebas funcionales nuevas ni CI atribuible a las propuestas. `7:11` (vaca vieja) permanece explícitamente pendiente de fuente. No repetir los 214 controles de Moriles Ribera. Francés candidato no publicado; `main` intacta.


## Aplicación autorizada de pimientos asados y salsa rosa — 05/11/2026

Helio **autorizó expresamente** dos ajustes FR en `translations/fr/batch-090-moriles-ribera.json` para Moriles Ribera, limitados a `feature/fr-integration-qa-20261027`:

| Índice | FR previo | FR aplicado |
|---|---|---|
| `0:3` | `Poivrons rouges et verts grillés accompagnés de ventrèche de thon.` | `Poivrons rouges et verts rôtis accompagnés de ventrèche de thon.` |
| `0:5` | `Anchois, asperges blanches, cœurs de palmier, ananas, tomate rose, maïs doux et sauce cocktail.` | `Anchois, asperges blanches, cœurs de palmier, ananas, tomate rose, maïs doux et sauce rose.` |

**Commit de implementación:** `45c8812`.

**Motivo:** `rôtis` comunica mejor `asados` sin imponer una técnica concreta; `sauce rose` evita identificar la salsa rosa de origen como una fórmula específica de salsa cóctel no acreditada. Solo se modificaron los dos textos `fr` autorizados; no se alteró el nombre, los ingredientes restantes, formato, precio, ES/EN, `data/places.json`, aplicación, CSS ni `main`.

**Pruebas realmente ejecutadas y superadas:** lectura GitHub previa, coincidencia exacta de las dos cadenas antes del reemplazo, validación estructural del JSON, comparación con el objeto original para descartar modificaciones no autorizadas en otros campos/entradas, relectura de la versión escrita desde GitHub con coincidencia íntegra, conservación de 12 entradas, `meta.status = candidate_awaiting_semantic_review` y `meta.catalogModified = false`.

**Pendientes:** no se ha verificado un nuevo PASS del workflow GitHub Actions para este commit ni para el de documentación; la revisión editorial nativa integral sigue pendiente. `7:11` (vaca vieja) continúa sin autorización y a la espera de carta original. Los 214 controles documentales históricos no se repiten. Francés experimental mediante `?qa_fr=1`, sin publicación/fusión.


## PASS #802–#804 y revisión dirigida de croquetas de boletus — 05/11/2026

**Confirmación CI:** Helio facilitó captura de GitHub Actions en `feature/fr-integration-qa-20261027`, workflow `Helio Gastro - data QA`, con tres ejecuciones SUCCESS: **#802** (`39e1510`, documentación de triaje anterior), **#803** (`45c8812`, ajustes de pimientos asados y salsa rosa), **#804** (`444c160`, documentación de esas correcciones). Fuente de evidencia: captura visual del responsable, sin examen de logs de cada job. El PASS técnico de estos commits no equivale a aprobación lingüística integral ni permiso para publicar francés.

**Siguiente triaje: lote 091**, relectura de `translations/fr/batch-091-moriles-ribera.json` en rama QA:
- `1:1`, ES `Croquetas de Boletus`, EN `Boletus mushroom croquettes.`, FR actual `Croquettes aux cèpes (boletus).`. **Propuesta aún no autorizada:** `Croquettes aux boletus.`, coherente con el criterio editorial ya aprobado en los lotes 094/095 de evitar `cèpes` sin respaldo de especie concreta. Clasificación: mejora de precisión semántica, no defecto funcional demostrado.
- `1:4`, ES `Croquetas de Rabo de Toro`, FR `Croquettes à la queue de taureau.`: no hay discrepancia nueva demostrada en este control; no proponer modificación automática.

**Estado:** ninguna traducción nueva aplicada, ninguna regresión CI nueva ejecutada por este triaje. `7:11` (vaca vieja) permanece pendiente de evidencia original. La rama experimental `?qa_fr=1` y el bloqueo de publicación/fusión a `main` siguen vigentes; no repetir 214 controles concluidos.


## Corrección autorizada de croquetas de boletus — 05/11/2026

**Autorización editorial explícita de Helio:** cambiar únicamente el texto francés del índice `1:1` de `translations/fr/batch-091-moriles-ribera.json`, de `Croquettes aux cèpes (boletus).` a `Croquettes aux boletus.`, para evitar atribuir una especie/grupo fúngico más específico que el `boletus` genérico documentado por el catálogo español de Moriles Ribera. **Commit de implementación:** `bdc1bb8`.

**Validación efectivamente realizada:** se leyó el JSON original desde la rama `feature/fr-integration-qa-20261027`, se comprobó coincidencia exacta de la entrada antes de editar y se preservaron las otras 11 entradas y todos los campos no autorizados. Tras el commit se volvió a leer el archivo desde GitHub y se comprobó igualdad íntegra con el contenido escrito, parseo JSON válido, 12 entradas, nueva cadena exacta en `1:1`, `meta.status = candidate_awaiting_semantic_review` y `catalogModified = false`. **PASS estático**. ES/EN, `data/places.json`, precios, formatos, ingredientes y aplicación no se modificaron.

**Pendiente:** no se ha acreditado aún el PASS de GitHub Actions asociado a este commit ni al de documentación; no se ha ejecutado revisión francófona nativa ni prueba visual específica. `7:11` (vaca vieja) permanece pendiente de fuente original, sin edición. Francés experimental bajo `?qa_fr=1`; no publicar ni fusionar en `main`. No repetir los 214 controles documentales completados.


## Confirmación CI #805–#807 — 05/11/2026

Helio aportó captura de GitHub Actions, workflow `Helio Gastro - data QA`, sobre `feature/fr-integration-qa-20261027`, donde aparecen en verde SUCCESS las siguientes ejecuciones:
- **#805**, commit `bd04134`: documentación de PASS #802–#804 y triaje de croquetas de boletus.
- **#806**, commit `bdc1bb8`: traducción FR de croquetas de boletus a `Croquettes aux boletus.` en `batch-091`, índice `1:1`.
- **#807**, commit `e2ab662`: documentación del cambio autorizado en `batch-091`.

**Naturaleza de la prueba:** PASS del workflow confirmado por captura del responsable; no hay inspección detallada de pasos/logs ni acreditación de revisión lingüística nativa o visual completa. Los PASS estáticos JSON de la implementación ya constan en el apartado anterior.

**Estado para continuar:** queda pendiente `batch-099`, `7:11`, `Entrecôte de bœuf maturé.`, por posible confusión entre edad de la vaca y maduración de carne. No cambiar sin corroborar fuente/carta y decisión editorial. También quedan criterios de estilo menores consignados históricamente (postres, etiquetas originales `ibéricos`/`revueltos`); tratarlos como observaciones, no defectos confirmados. Francés experimental y `main` intacta.


## Intento de verificación de carta original: vaca vieja — 05/11/2026

**Acción documental, sin editar traducciones:** se consultó la página oficial de Moriles Ribera `https://www.morilesribera.com/nuestra-cocina`, que sigue mostrando la imagen `MR 005 (Carnes)` y enlaza a `https://www.morilesribera.com/wp-content/uploads/2026/02/MR-005-Carnes-scaled.png`. La herramienta web no pudo recuperar la imagen (error *cache miss*) y una descarga directa tampoco tuvo éxito. Por tanto **no se ha leído visualmente la carta oficial actual** ni comprobado allí el texto preciso del entrecot.

**Referencia histórica adicional, insuficiente para cerrar:** una transcripción publicada en Scribd de `Carta Ribera 1` incluye `Entrecot de vaca vieja` y `Chuletón de vaca vieja`, pero no constituye comprobación verificable de la imagen oficial vigente de 2026. No se trasladan precios ni otros datos desde esa transcripción.

**Estado del candidato `batch-099`, `7:11`:** el JSON de la rama QA todavía muestra `Entrecôte de bœuf maturé.`; la posible confusión entre edad del animal y proceso de maduración permanece **pendiente de confirmación y criterio editorial**. No se ha modificado `7:11` ni `7:12`, no se ha ejecutado CI por este triaje y no se reabre el cotejo 214/214. Francés candidato no publicado; `main` sin cambios.


## Revisión focalizada de postres y etiquetas tradicionales — 05/11/2026

**Alcance:** relectura de informe editorial vigente y archivos reales `translations/fr/batch-102-moriles-ribera.json` y `batch-103-moriles-ribera.json` de la rama QA. Los casos ya figuran en el contraste histórico 214/214 y **no se computan como revisión adicional de entradas**. No se han modificado traducciones ni catálogo.

| Índice / lote | FR actualmente comprobado | Clasificación y propuesta no autorizada |
|---|---|---|
| `11:3` / 102, Natillas con su galleta María | `Crème dessert espagnole avec biscuit María.` | Conserva el significado; opcional mantener nombre tradicional `Natillas (crème dessert espagnole) avec biscuit María.`. Solo estilo cultural, no fallo probado. |
| `11:12` / 103, Iglú de Ferrero | `Dessert glacé façon Ferrero.` | Omite el nombre/imagen comercial «iglú» expresado en ES; propuesta `Iglú de Ferrero (dessert glacé façon Ferrero).` antes de revisión nativa. No inferir forma física adicional ni composición. |
| `11:18` / 103, Tulipa de muerte por chocolate | `Dessert au chocolat servi dans une coupe en forme de tulipe.` | Preserva la tulipa pero omite el nombre expresivo «muerte por chocolate». Propuesta conservadora `Tulipa « Muerte por chocolate » (dessert au chocolat servi dans une coupe en forme de tulipe).` como denominación original y explicación; naturalidad FR pendiente. |
| `11:20` / 103, Tulipa helada de vainilla de Tahití con nueces de macadamia | `Glace à la vanille de Tahiti aux noix de macadamia.` | Omite «tulipa» como presentación del nombre ES; propuesta `Tulipa glacée à la vanille de Tahiti et aux noix de macadamia.` a revisión editorial, sin cambiar formato de precio `Unidad`. |

**Otros términos originales:** `ibéricos` → `charcuteries ibériques` y `revueltos` → `œufs brouillés garnis` continúan como dudas documentales sin defecto confirmado; la imagen oficial de carta correspondiente no se ha leído con garantías. No aplicar cambios a `i18n.js` por intuición. `7:11` vaca vieja también sigue pendiente de original.

**Estado de las pruebas:** lectura documental/JSON y comprobación de textos realizadas; ninguna edición de los lotes ni prueba funcional o CI nueva por este análisis. El francés permanece experimental `?qa_fr=1` y `main` intacta. Solicitar decisión editorial antes de cambiar nombres/descripciones y, si se aprueban, aplicar cambios mínimos y regresión ES/EN/FR; el EN también omite aspectos de algunos nombres, pero no existe autorización para editarlo.


## Cuatro ajustes FR autorizados de postres — 05/11/2026

**Aprobación expresa de Helio:** conservar denominaciones tradicionales y de presentación en cuatro descripciones francesas de postres de Moriles Ribera; exclusivamente en `feature/fr-integration-qa-20261027`. Correcciones de identidad del plato, no nuevas afirmaciones de ingredientes, técnicas ni tamaños.

| Lote / índice | Antes | Después | Commit |
|---|---|---|---|
| 102 / `11:3` | `Crème dessert espagnole avec biscuit María.` | `Natillas (crème dessert espagnole) avec biscuit María.` | `2471342` |
| 103 / `11:12` | `Dessert glacé façon Ferrero.` | `Iglú de Ferrero (dessert glacé façon Ferrero).` | `dc69b7b` |
| 103 / `11:18` | `Dessert au chocolat servi dans une coupe en forme de tulipe.` | `Tulipa « Muerte por chocolate » (dessert au chocolat servi dans une coupe en forme de tulipe).` | `dc69b7b` |
| 103 / `11:20` | `Glace à la vanille de Tahiti aux noix de macadamia.` | `Tulipa glacée à la vanille de Tahiti et aux noix de macadamia.` | `dc69b7b` |

**Controles realmente ejecutados y superados:** antes de cada escritura se releía el archivo real desde GitHub y se contrastaba el texto previo exacto y el índice único. Cada JSON se analizó correctamente; 12 entradas y estado `candidate_awaiting_semantic_review`, `catalogModified = false`, `restaurant = moriles-ribera`. Se compararon todos los campos de las entradas para verificar que solo cambiaban las cuatro cadenas `fr` autorizadas. Después de escribir se recuperó cada archivo nuevamente de GitHub y su contenido coincidió exactamente con el preparado.

**Estado y límites:** PASS **estático/estructural**, no prueba Playwright ni PASS de GitHub Actions todavía confirmado para estos commits. No se han modificado `data/places.json`, ES/EN, ingredientes, precios, formatos de servicio, interfaz, CSS ni `main`. `11:12`, `11:18` y `11:20` pueden requerir revisión posterior de naturalidad por francófono. Las etiquetas `ibéricos`/`revueltos` y `7:11` vaca vieja continúan pendientes de carta original y criterio editorial. No reabrir los 214 controles documentales. Francés experimental bajo `?qa_fr=1`, sin autorización para publicar/fusionar.


## PASS #809–#813 y comprobación pendiente de ibéricos/revueltos — 05/11/2026

**PASS confirmados por captura aportada por Helio:** workflow `Helio Gastro - data QA` de `feature/fr-integration-qa-20261027`, ejecuciones SUCCESS **#809** (commit `d6a3db3`, limitación de carta de carnes), **#810** (`1e05cdc`, triaje documental de postres y etiquetas), **#811** (`2471342`, ajuste FR de natillas), **#812** (`dc69b7b`, tres ajustes FR de postres) y **#813** (`fa35fa1`, documentación de cuatro postres). Confirmación visual de estado agregado por el responsable; no se han inspeccionado individualmente los logs ni se infiere aprobación lingüística nativa o visual integral.

**Revisión de categorías pendientes de Moriles Ribera:** consulta de `https://www.morilesribera.com/nuestra-cocina`, donde aparece `MR 003 (Ibericos-Revueltos-Risottos-Pastas)`, y `https://www.morilesribera.com/our-kitchen`, donde se muestran `MR 031 (Ibericos) EN` y `MR 032 (Revueltos) EN` por separado. La recuperación del PNG original `MR-003-Ibericos-Revueltos-Risottos-Pastas-scaled.png` falló (cache miss en consulta web y descarga directa no disponible). **No se han podido leer las entradas de la carta gráfica**, así que no se confirma si `charcuteries ibériques` cubre todas las elaboraciones ni se detecta error verificable en `œufs brouillés garnis`.

**Decisión de triaje, sin cambio editorial de contenido:** mantener como pendientes documentales las etiquetas `ibéricos` / `revueltos` y el índice `7:11` `vaca vieja`; no cambiar `i18n.js`, lotes ni datos sin respaldo. Continuar con la revisión global visual/lingüística del francés pendiente, respetando `?qa_fr=1`, sin fusionar a `main` ni repetir los 214 controles completos. **CI nuevo no comprobado para este apunte documental**; se requerirá confirmación separada si su escritura dispara workflow.


## Refuerzo dirigido de regresión trilingüe Moriles Ribera — 05/11/2026

**Diagnóstico previo del estado real:** revisados `scripts/test-fr-moriles-ribera-12.mjs`, `scripts/inventory-fr-moriles-ribera-semantics.mjs`, `scripts/inventory-fr-detail-accessibility.mjs`, `scripts/test-fr-source-venue-triage.mjs` y `.github/workflows/data-qa.yml` en la rama QA. La suite específica de Moriles Ribera ya comprueba las 214 entradas FR contra los lotes (texto/orden), perfiles desktop 1365×900 e iPhone 13, navegación ES/EN y baseline público; no crear pruebas redundantes ni volver a contabilizar esos 214 contrastes como nuevos.

**Hueco de cobertura encontrado:** el test `scripts/test-fr-moriles-ribera-12.mjs` volvía a seleccionar FR tras ES y EN, pero solo comprobaba geometría horizontal en ese retorno: no acreditaba que las **descripciones FR hubieran sido restauradas exactamente**. Se añadió una aserción contra el vector FR leído inicialmente usando `#detail-content [data-dish-explanation]:visible` tras la secuencia FR → ES → EN → FR, ejecutada en los dos perfiles ya previstos. El test previo continúa igual; no se retocan textos ni datos. **Commit:** `1768980`.

**Pruebas y estado:** modificación mínima del script y relectura del contenido modificado desde GitHub **verificadas**. **No se ha inspeccionado aún el PASS de GitHub Actions de esta nueva aserción**, ni se afirma ejecución local de Playwright. El workflow `Helio Gastro - data QA` ya incluye la suite, por lo que el nuevo commit deberá producir su ejecución habitual. Resultado esperado: revalidación de la igualdad exacta de los textos visibles tras la ida/vuelta entre idiomas, sin fallar por alteraciones transitorias del DOM. Revisar la ejecución # posterior, sus errores si los hubiera y capturas/artifactos visuales antes de considerar cerrado el control.

**Observaciones pendientes:** el antiguo indicador de PNG FR de escritorio con anchura mayor a 1365 px ya fue explicado por scripts que usaban viewports diferentes y **no constituye un defecto CSS confirmado**. La revisión humana completa de capturas y terminología sigue separada del PASS técnico. `7:11` vaca vieja y etiquetas `ibéricos`/`revueltos` permanecen bloqueadas por evidencia original; no cambiar sin decisión. Francés experimental `?qa_fr=1`, no tocar `main`, no publicar.


## Extensión de triaje visual a Moriles Ribera — 05/11/2026

**Confirmación del responsable:** Helio comunicó nuevos **PASS** para las ejecuciones de GitHub Actions asociadas a los commits `1768980` (regresión de retorno FR tras ES/EN de Moriles Ribera) y `d460abd` (documentación). Esta confirmación se registra como PASS comunicado, sin número de run ni inspección independiente de logs; no se debe inferir aprobación de la calidad lingüística.

**Siguiente control efectuado:** inspección estática de `scripts/inventory-fr-detail-accessibility.mjs` y del workflow `.github/workflows/data-qa.yml`. El inventario exploratorio ya recorre La Cazuela, La Bandera y Beatillas en ES/EN/FR, desktop 1365×900 e iPhone 13, creando capturas completas y métricas DOM de controles fuera del viewport, posibles controles sin nombre y texto recortado. Moriles Ribera no figuraba entre las fichas cubiertas. Dada la revisión reciente de nombres/descripciones FR extensos, se amplió **el mismo script existente** con `moriles-ribera` (no se creó otra suite). Ahora se esperan **24 vistas** en vez de 18: cuatro fichas × tres idiomas × dos perfiles. **Commit:** `5266c99`.

**Verificación ejecutada:** relectura del script desde GitHub y comprobación de igualdad íntegra del contenido escrito: **PASS de persistencia**. La suite ya está incluida en el workflow, por lo que no se modificó `data-qa.yml`. **Pendiente:** obtener PASS real de Actions del commit y examinar `qa-reports/fr-detail-accessibility-triage.json` y sus capturas de Moriles Ribera para clasificar cualquier candidato de desbordamiento o recorte. Que el workflow sea SUCCESS no demuestra que el inventario no encuentre candidatos, pues el propio script solo hace FAIL ante número incompleto de vistas o errores JS. No se ha inspeccionado aún el artefacto visual ni ejecutado Playwright local en este trabajo.

**Sin cambios** en traducciones, `data/places.json`, precios, formatos, interfaz, CSS o `main`. Las dudas originales `7:11` (vaca vieja), `ibéricos` y `revueltos` continúan identificadas, sin edición. Francés experimental `?qa_fr=1`; no publicar ni fusionar sin autorización expresa.


## Resumen de candidatos visuales de Moriles Ribera en Actions — 05/11/2026

**PASS comunicados por Helio:** las últimas ejecuciones posteriores a `5266c99` (ampliación del inventario de accesibilidad a 24 vistas) y `e52ffe4` (documentación) figuran como PASS según el responsable. No se dispone aquí de números de ejecución ni de inspección de logs/capturas; registrar el resultado como **PASS comunicado**, no inspección visual completa.

**Objetivo del siguiente ajuste:** el inventario existente `scripts/inventory-fr-detail-accessibility.mjs` escribe `qa-reports/fr-detail-accessibility-triage.json`, pero una ejecución verde no muestra de forma suficientemente directa los posibles candidatos específicos de Moriles Ribera. Se añadió al propio script un resumen Markdown en `GITHUB_STEP_SUMMARY` con seis filas de Moriles Ribera (ES/EN/FR × desktop/iPhone13), diferencia entre ancho documental y viewport, recuentos de controles fuera de pantalla, controles sin nombre y textos potencialmente recortados, además de las rutas de las capturas dentro del artefacto. Comprobación de formato posterior: commit `4752ecc`; primer commit incremental `b1b71e9`. El script y el workflow siguen siendo los existentes; no se añade una suite redundante.

**Estado real:** relectura de GitHub de los cambios de código y coincidencia íntegra de los archivos guardados **PASS de persistencia**; no se ha descargado aún el ZIP de capturas ni ejecutado Playwright local o verificado nuevo PASS de Actions para este ajuste. El resumen es orientativo: candidatos = posibles anomalías que requieren examen humano, y cero candidatos no garantiza accesibilidad conforme a WCAG. No atribuir ningún defecto a Moriles Ribera hasta contar con métricas/capturas de la ejecución.

**Sin cambios:** `main`, `data/places.json`, textos ES/EN/FR, precios, formatos y CSS. Francés experimental `?qa_fr=1`. Mantener los bloqueos documentales conocidos (vaca vieja, ibéricos/revueltos) y no reabrir 214 entradas.


## PASS comunicados y puerta de revisión visual — 05/11/2026

**Resultado comunicado por Helio:** PASS de las nuevas ejecuciones posteriores a `b1b71e9` (resumen de candidatos visuales), `4752ecc` (salto de línea correcto en resumen) y `203dff6` (documentación). Se registra **PASS comunicado por el responsable**, sin número de workflow, examen de logs ni descarga de artefactos; no usarlo para afirmar ausencia de candidatos visuales.

**Revisión de estado efectuada:** la rama QA conserva `scripts/inventory-fr-detail-accessibility.mjs` con 24 escenarios previstos, incluidos los seis de Moriles Ribera; el script vuelca el resumen correspondiente en `GITHUB_STEP_SUMMARY` y el detalle en `qa-reports/fr-detail-accessibility-triage.json` dentro de `fr-visual-qa-desktop-mobile`. Se comprobó que el workflow `.github/workflows/data-qa.yml` ejecuta la suite existente y sube los artefactos con `if: always()`, retención de 14 días. La suite **solo suspende** por vistas incompletas o errores JS; puede registrar candidatos aunque Actions sea SUCCESS.

**Próxima puerta de decisión, todavía pendiente:** leer la tabla `FR visual accessibility — Moriles Ribera (exploratory)` de la ejecución aprobada y el JSON/capturas asociados. Clasificar cada candidato según evidencia: 1) defecto reproducible con pasos, severidad y esperado/real; 2) desplazamiento o formato intencionado; 3) falso positivo heurístico; 4) información insuficiente. No aplicar parches CSS ni declarar cero defectos sin ese contraste. Si no se puede recuperar artefacto desde esta sesión, solicitar captura de la tabla y/o ZIP al responsable; no crear nueva instrumentación redundante.

**Sin cambios de aplicación ni traducciones.** `main` intacta; francés experimental con `?qa_fr=1`. Conservar como pendientes de fuente las decisiones sobre `7:11` vaca vieja y categorías `ibéricos`/`revueltos`. Mantener los 214 controles documentales ya completados.


## Nuevo PASS comunicado y control de artefacto visual — 05/11/2026

Helio comunica **PASS** para las nuevas ejecuciones posteriores a `b1b71e9`, `4752ecc` y `203dff6`, y posteriormente otro **PASS** al continuar la sesión. Se registra como confirmación del responsable, sin atribuir números de ejecución o logs no suministrados ni confundirlo con revisión manual de imágenes.

**Comprobación de la rama:** `.github/workflows/data-qa.yml` mantiene `scripts/inventory-fr-detail-accessibility.mjs` dentro del job visual y sube `qa-reports/` como artefacto `fr-visual-qa-desktop-mobile` (retención: 14 días; upload incluso si falla la prueba). El script genera `fr-detail-accessibility-triage.json` y capturas del perfil móvil y escritorio para La Cazuela, La Bandera, Beatillas y Moriles Ribera, ES/EN/FR (24 combinaciones). Su criterio de fallo sigue limitado a vistas incompletas y errores de JavaScript; los posibles recortes, controles sin nombre o desbordamientos son **candidatos para triaje humano**, aunque Actions marque SUCCESS.

**Límite actual:** no se ha recuperado el ZIP ni leído el JSON ni las capturas de la última ejecución desde esta conversación. Un intento de consultar la página pública del workflow no devolvió su contenido. No corresponde afirmar cero defectos visuales ni aplicar CSS a ciegas. Para continuar la revisión de cierre, inspeccionar el artefacto `fr-visual-qa-desktop-mobile` de la última ejecución aprobada; clasificar cada candidato según pasos, esperado/observado, severidad y evidencia de captura. También revisar manualmente los postres largos de Moriles Ribera en FR y el retorno ES/EN, ya cubierto técnicamente.

**Sin cambios funcionales ni editoriales:** `main` intacta; francés sigue disponible solo bajo `?qa_fr=1`. Persisten los bloqueos de origen sobre vaca vieja, ibéricos y revueltos, sin cambiar textos por intuición. No duplicar los 214 controles completados ni crear suites mientras la evidencia vigente no se haya revisado.


## Artefacto ligero de métricas visuales — 05/11/2026

**Bloqueo al inspeccionar el ZIP real:** Helio aportó `fr-visual-qa-desktop-mobile (4).zip` de **416.061.616 bytes** (aprox. 416 MB decimal). El archivo figura como adjunto de la conversación, pero intentos de lectura mediante herramientas locales y una operación mínima en el contenedor devolvieron error `ClientError`. **No se ha inspeccionado su contenido**, por lo que no se afirma ausencia de anomalías visuales ni resultado de los candidatos del detector.

**Medida incremental de accesibilidad a las evidencias:** en la rama `feature/fr-integration-qa-20261027` se añadió a `.github/workflows/data-qa.yml` un paso `Upload FR accessibility metrics only` con `actions/upload-artifact@v4`, `if: always()`, nombre único `fr-accessibility-metrics-only`, ruta exacta `qa-reports/fr-detail-accessibility-triage.json`, `if-no-files-found: error` y retención 14 días. El archivo JSON se genera ya en la suite de accesibilidad existente; **no hay pruebas nuevas ni reducción/eliminación de capturas**. Se mantiene íntegro el artefacto anterior `fr-visual-qa-desktop-mobile`. Commit `81bb854`.

**Validación realizada:** lectura del workflow original, cambio mínimo del YAML, escritura a GitHub y relectura byte a byte de su contenido: PASS de persistencia. **Pendiente:** confirmación del PASS de GitHub Actions de este cambio, descarga del JSON ligero e inspección de sus 24 filas para identificar candidatos; los casos con candidatos requerirán consultar capturas y reproducción. No se ejecutó Playwright local.

**Sin cambios en** `main`, `data/places.json`, textos ES/EN/FR, precios, CSS o interfaz. El francés sigue en `?qa_fr=1`. Mantener pendientes por fuente `7:11` vaca vieja y `ibéricos`/`revueltos`; no repetir el cotejo 214/214.


## PASS del artefacto ligero y siguiente control de evidencias — 05/11/2026

**Confirmación de Helio:** PASS de GitHub Actions tras los commits `81bb854` (alta de `fr-accessibility-metrics-only`) y `6617370` (documentación). **Tipo de evidencia:** confirmación del responsable; no se han examinado en esta sesión los pasos internos de CI, el archivo JSON resultante ni las capturas. El PASS técnico no certifica ausencia de hallazgos heurísticos.

**Verificación adicional:** se reintentó consultar Actions y abrir el ZIP original de 416 MB; el acceso a la página produjo `cache miss` y la operación local devolvió `ClientError`. No existe base para declarar PASS de inspección visual ni para crear incidencias CSS.

**Siguiente paso definido:** recuperar **solo** el pequeño artefacto `fr-accessibility-metrics-only` generado por la ejecución con PASS, leer `fr-detail-accessibility-triage.json`, resumir resultados de las 24 combinaciones (Moriles Ribera en ES/EN/FR × escritorio/móvil) y separar alertas heurísticas de defectos observables. Solicitar capturas individuales únicamente para las vistas con hallazgos, si los hubiera. No añadir nuevas suites ni modificar interfaz antes de la clasificación.

**Alcance intacto:** FR experimental `?qa_fr=1`, `main` sin cambios, cartas y precios intactos, y dudas de fuente (vaca vieja, ibéricos/revueltos) aún abiertas. No repetir controles documentales 214/214.


## Resultado real del inventario de accesibilidad 24/24 — 05/11/2026

**Evidencia leída:** archivo aportado por Helio `fr-detail-accessibility-triage.json`, generado el `2026-11-05T08:06:35.939Z`, con `kind = exploratory_fr_visual_accessibility_not_a_pass_certificate`. Se pudo leer el contenido JSON completo de la carga de archivo del usuario (24 resultados) pese a que la operación adicional de lectura local por contenedor devolvió `ClientError`. **No se han inspeccionado los PNG ni los logs individualizados del workflow.**

**Resultados del detector (24/24):** cuatro establecimientos (`la-cazuela-esparteria`, `la-bandera-cafe`, `rincon-beatillas`, `moriles-ribera`) × tres idiomas (ES/EN/FR) × dos perfiles (`desktop-1365`, `mobile-iphone13`). Cada resultado declara `candidates: 0`, `outsideControls: []`, `unnamedControls: []`, `clippedText: []`; `viewportWidth = documentWidth = bodyWidth` en las 24 vistas (1365 píxeles en escritorio, 390 píxeles en móvil). `htmlLang` coincide con el idioma de cada resultado. Las seis vistas de Moriles Ribera también declaran cero candidatos; el inventario registra 13 enlaces de fuentes y 24 controles comprobados en cada idioma/perfil.

**Dictamen técnico acotado:** **PASS del inventario exploratorio bajo sus heurísticas** y ningún candidato a defecto de geometría/accesibilidad en las 24 vistas. No es aprobación WCAG, inspección humana de screenshots, prueba de todos los tamaños/dispositivos ni validación lingüística. Los PASS de workflow comunicados por Helio se conservan como evidencia separada; no inferir de ellos la ausencia de defectos visuales. No crear tickets ni cambiar CSS sin defecto reproducible.

**Acciones:** cerrar el triaje de *métricas automáticas* de estas 24 vistas y continuar con la inspección visual/manual de capturas de forma selectiva si se obtiene evidencia. Conservar pendientes por fuente `7:11` vaca vieja y etiquetas `ibéricos`/`revueltos`. No reabrir 214 entradas de Moriles Ribera. `main` intacta; `?qa_fr=1` experimental, sin autorización de lanzamiento.


## Inspección visual panorámica de Moriles Ribera FR — 05/11/2026

**Evidencia suministrada por Helio:** las capturas originales `desktop-1365-moriles-ribera-fr.png` y `mobile-iphone13-moriles-ribera-fr.png` correspondientes a la ficha completa de Moriles Ribera en francés. Se han visto ambas en la conversación como vistas panorámicas completas. **La inspección detallada de recortes a resolución nativa no ha podido efectuarse:** las operaciones del entorno de imagen/archivo devolvieron `ClientError`. No se han aplicado OCR ni recortes ni se han inspeccionado píxeles en zonas individuales.

**Observación visual cualitativa, de alcance limitado:** se aprecia continuidad vertical de la ficha y estructura de componentes de escritorio y móvil; no se observa una rotura global manifiesta del diseño o un desbordamiento horizontal evidente en las vistas reducidas. Esta observación **no prueba** ausencia de recortes en líneas individuales, legibilidad de todos los textos ni correcta distribución de las cuatro descripciones largas de postres corregidas.

**Evidencia instrumental relacionada:** el JSON aportado `fr-detail-accessibility-triage.json`, registrado en el bloque anterior, presenta 24/24 escenarios con `candidates: 0`, incluyendo las dos vistas FR de Moriles Ribera, sin controles fuera de pantalla, textos recortados por la heurística ni overflow del documento. Se mantiene el **PASS del inventario automatizado** como resultado separado de la revisión humana.

**Dictamen:** panorama visual sin defectos macroscópicos demostrados; **revisión fina de legibilidad/texto y contraste de postres pendiente de zoom/recortes verificables**. No abrir incidencias ni modificar CSS por intuición. Pendientes editoriales originales (`7:11` vaca vieja, `ibéricos` y `revueltos`) no varían. `main` no tocada, `?qa_fr=1` experimental y 214 entradas de Moriles Ribera ya contrastadas documentalmente.
