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

## Evidencia visual de CI lote 083 (29/10/2026)

- Captura aportada por Helio: #383 SUCCESS (creación de lote), #384 FAIL (integración inicial), #385 SUCCESS (prueba acumulada a 36) y #386 SUCCESS (documentación). Se registra la secuencia sin borrar el fallo intermedio.
- **Estado técnico del commit #386: PASS mostrado en GitHub Actions**, con QA acumulado. El error exacto de #384 no está documentado en la captura; no atribuir causa ni corregir a ciegas.
- Cierre técnico provisional del lote 083 sobre el estado #386, sujeto a revisión si los logs revelan una incidencia remanente. No equivale a aprobación semántica/lingüística ni autorización de publicación.

## Lote 084 — preparado e integrado en QA (29/10/2026)

- Fuente: tabla ES/EN entregada por Helio, índices 5:3–5:5, 6:0–6:1, 7:0–7:3 y 8:0–8:2 (12 entradas).
- Archivo `translations/fr/batch-084-don-pepe-ciudad-jardin.json`: traducciones **candidatas**, con denominaciones tradicionales conservadas (patatas bravas, torreznos, salmorejo, gulas) y sin inventar precios ni ingredientes.
- `app.js` integra el lote exclusivamente en `?qa_fr=1`; total esperado del overlay 963 entradas / 84 lotes. Don Pepe: **48/103 candidatas**, 55 pendientes.
- Prueba automatizada acumulada ampliada a 48 entradas, con comparación ES/EN respecto a interfaz pública en escritorio y móvil; informe `fr-don-pepe-ciudad-jardin-48.json`.
- **Estado: integración realizada, CI y QA técnico del lote 084 aún pendientes de confirmar.** Revisión semántica y lingüística nativa pendiente. Sin fusión a `main` ni cambios en `data/places.json`.

## Regresión recurrente durante la integración de nuevos lotes (29/10/2026)

- Captura aportada por Helio: #388 PASS, #389 FAIL, #390 PASS y #391 PASS. La ejecución #389 corresponde a integrar el lote 084 mientras el test de navegador seguía esperando 36 descripciones; #390 ya incluía la ampliación a 48. **Hipótesis de causa probable**, no diagnóstico del log: expectativas fijas desincronizadas entre commits consecutivos.
- Mitigación implementada en commit `95247a0`: el test de Don Pepe descubre automáticamente todos los archivos `batch-*-don-pepe-ciudad-jardin.json` y compara el número visible contra `entries.length`, en vez de mantener la lista y el total manualmente. El informe ahora se guarda con nombre estable `fr-don-pepe-ciudad-jardin-latest.json`.
- Esta corrección del test no elimina las listas y totales fijos del cargador de `app.js`. En futuros lotes, actualizar el cargador y comprobar en un mismo conjunto de cambios antes de considerar el CI definitivo. Evitar declarar la causa confirmada sin logs.
- **Estado de la nueva mitigación:** commit creado, ejecución CI aún no verificada. La revisión lingüística permanece pendiente y `main` continúa fuera del alcance.

## Confirmación de regresión completa (29/10/2026)

- **Helio confirmó PASS completo** de GitHub Actions después de la mitigación del test dinámico de Don Pepe (`95247a0`) y su documentación (`3941323`). No se atribuye ID de ejecución que no se haya facilitado.
- **Lote 084:** cierre técnico conforme al PASS comunicado; cobertura candidata de Don Pepe: **48/103**, con **55 entradas** pendientes. La comprobación automática no sustituye la revisión semántica ni lingüística nativa.
- La mejora pendiente del cargador `app.js` (lista y contador de lotes codificados manualmente) sigue abierta; no confundir el ajuste del test con la solución completa de esta dependencia.
- `data/places.json` y `main` permanecen sin modificación por esta documentación. Próxima etapa: lote 085 con fuentes ES/EN originales y QA incremental.
