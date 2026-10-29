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
