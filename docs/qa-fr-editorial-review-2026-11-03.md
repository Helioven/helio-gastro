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
