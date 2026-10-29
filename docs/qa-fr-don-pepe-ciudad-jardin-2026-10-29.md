# QA francés — Don Pepe Ciudad Jardín, lote 081 (29/10/2026)

**Estado:** traducciones candidatas; revisión semántica y lingüística, integración visual y validación CI del nuevo lote pendientes.

- Rama aislada: `feature/fr-integration-qa-20261027`.
- Establecimiento: `cafeteria-don-pepe-ciudad-jardin` (no confundir con Don Pepe Centro).
- Fuente de los 12 pares ES/EN: salida `FR-NEXT-CANDIDATE` del inventario del job `catalog-audit`, ejecución [#40833949864](https://github.com/Helioven/helio-gastro/actions/runs/40833949864).
- Archivo candidato: `translations/fr/batch-081-don-pepe-ciudad-jardin.json`, con 12 entradas: secciones 0 (ítems 0–5) y 1 (ítems 0–5). Tras el lote quedan 91 entradas originales pendientes, sujeto a recuento en CI.
- Se conservan las denominaciones gastronómicas `migas camperas`, `flamenquín`, `arroz a la cubana` y `San Jacobo`. No se han añadido precios ni formatos.
- En una primera redacción se retiró del texto de migas una atribución de ingredientes no respaldada por la fuente, antes de considerarlo validado.
- El archivo se mantiene como **candidato**, no como aprobado, y no se ha aplicado a `data/places.json` ni a la interfaz pública.
- **Pruebas propuestas:** `validate-french-batch.mjs`, `test-fr-overlay-integrity.mjs`, inventario de cobertura y regresión de ES/EN. Comprobar resultados actuales de GitHub Actions antes de cerrar el lote.
- **No realizado:** visualización de Don Pepe en francés, QA móvil/escritorio específica ni validación lingüística nativa. No fusionar a `main` ni activar FR públicamente.

**Próximo paso:** obtener el siguiente tramo ES/EN del artefacto actualizado del inventario; preparar otro lote controlado y realizar pruebas. No inferir textos que no consten en el catálogo.

## Integración experimental del lote 081

- **Implementado en rama QA:** `app.js` carga `batch-081-don-pepe-ciudad-jardin.json` únicamente cuando está activo `?qa_fr=1`. Total esperado del overlay: **927** descripciones candidatas en **81 lotes**; se mantienen independientes del catálogo original.
- **Prueba añadida a CI:** `scripts/test-fr-don-pepe-ciudad-jardin-12.mjs`; comprueba 12 descripciones FR, conservación de 103 textos ES/EN frente a la vista pública, ausencia de selector FR sin parámetro, errores JS y desbordamiento horizontal en escritorio/móvil.
- **Estado de ejecución:** pendiente de verificar en GitHub Actions; la presencia del script no equivale a PASS. No cerrar todavía este lote ni publicarlo.

## Resultado tras corrección del test (29/10/2026)

- La primera ejecución del test incorporado al workflow falló en escritorio y móvil: esperaba 103 descripciones ES/EN visibles, pero la interfaz mostró 99 en cada idioma. La cifra 103 corresponde a pares fuente del inventario, no necesariamente a textos renderizados (los idénticos al título del plato pueden omitirse).
- Se corrigió el test en el commit `6f238c2a63c002f3b1cd7c301b39d5cb45ab28c5`: compara ES/EN de la vista QA con la vista pública original, en lugar de exigir 103 visibles.
- **Helio confirmó PASS de la ejecución posterior** el 29/10/2026. Se registra **cierre técnico del lote 081 (12 entradas)** basado en esa comprobación comunicada; no se afirma un ID de ejecución no aportado.
- Quedan **91 entradas ES/EN pendientes de lote FR** en Don Pepe Ciudad Jardín, según el inventario anterior, sujeto a actualización. La revisión semántica y lingüística de las traducciones sigue pendiente; no equivale a autorización para fusionar a `main` o publicar francés.

## Confirmación de inventario posterior al lote 081 (29/10/2026)

- Helio confirmó **PASS** de GitHub Actions tras el commit `f93fe26fe44b3593ddec87638e4bf514f448a849`, relativo a la actualización del inventario `scripts/inspect-next-fr-restaurant.mjs`.
- Se registra como **prueba técnica superada según confirmación del responsable**, sin atribuir número de ejecución no aportado.
- Este PASS no significa que se haya creado el lote 082: siguen pendientes recuperar y cotejar los siguientes textos ES/EN, preparar traducciones candidatas e integrarlas con su QA específico.
- Se mantienen 12/103 descripciones candidatas para Don Pepe Ciudad Jardín y 91 sin lote; sin cambios en carta original ni en `main`.

## Lote 082 — preparación e integración QA (29/10/2026)

- **Fuente:** tabla de 12 pares ES/EN (índices 1:6, 1:7, 2:0–2:8 y 3:0) del resumen de inventario de GitHub Actions aportada por Helio.
- **Implementado:** `translations/fr/batch-082-don-pepe-ciudad-jardin.json` con 12 textos franceses **candidatos**, integrados en el overlay `?qa_fr=1` (sin modificar la carta original).
- **Acumulado previsto:** 24/103 descripciones de Don Pepe Ciudad Jardín; 79 pendientes. Total experimental previsto: 939 candidatas en 82 lotes, sujeto a validación CI.
- **Prueba automatizada:** el script histórico `scripts/test-fr-don-pepe-ciudad-jardin-12.mjs` se ha ampliado para comprobar las 24 traducciones y conservación ES/EN en escritorio y móvil. Su nombre de archivo histórico se mantiene para evitar modificar el workflow en esta tanda; el informe emitido es `fr-don-pepe-ciudad-jardin-24.json`.
- **Control editorial:** `pescadito`, `migas`, `pisto`, `cachopo`, `torreznos` y `gulas` conservan referencia a denominaciones tradicionales; no se han introducido precios, formatos ni ingredientes que no estén respaldados en ES/EN. Revisar especialmente matices de `gulas` y `huevos rotos` en revisión lingüística.
- **Estado:** implementación en rama QA realizada; **CI y QA técnico del nuevo lote pendientes de confirmar**, al igual que revisión semántica/lingüística nativa. Sin publicación ni fusión a `main`.

## Seguimiento de CI del lote 082 — captura de Helio (29/10/2026)

- Helio aportó captura de GitHub Actions con **#378 SUCCESS**, **#379 FAIL**, **#380 SUCCESS** y **#381 SUCCESS** en la rama experimental.
- #379 corresponde al commit `3a4e0d40a7d8cf41856463369aef252b6debb089` (integración del overlay), mientras #380 incluye la ampliación de la prueba a 24 entradas y #381 registra documentación. **El estado posterior visible es PASS**.
- El paso y mensaje exactos que provocaron el fallo #379 **no constan en la captura**; no atribuirle una causa ni afirmar que se corrigió un defecto concreto sin logs. Conservar como incidencia histórica pendiente de análisis causal si procede.
- **QA técnico del estado #381:** PASS conforme a la evidencia visual aportada por Helio. No confundirlo con aprobación semántica/lingüística nativa ni con publicación.

## Lote 083 — integración experimental (29/10/2026)

- Fuente: 12 pares ES/EN de la tabla del inventario entregada por Helio (índices 3:1–3:3, 4:0–4:5, 5:0–5:2).
- Creadas 12 traducciones candidatas en `translations/fr/batch-083-don-pepe-ciudad-jardin.json`. `S/T` se mantiene literalmente porque no se ha acreditado su significado. Se conservan denominaciones tradicionales de platos y no se modifican ingredientes, formatos ni precios.
- `app.js` actualizado únicamente en la rama QA para incluir el lote con `?qa_fr=1`. Acumulado **previsto**: 951 descripciones candidatas en 83 lotes; Don Pepe 36/103 (67 pendientes).
- Prueba existente `scripts/test-fr-don-pepe-ciudad-jardin-12.mjs` ampliada a las 36 traducciones acumuladas en escritorio y móvil, con comparación ES/EN frente a base pública. Informe: `fr-don-pepe-ciudad-jardin-36.json`.
- **Estado:** implementación completada; CI/regresión del lote 083 todavía sin resultado confirmado. Traducciones pendientes de revisión semántica y lingüística. No fusionar a `main` ni desplegar.
