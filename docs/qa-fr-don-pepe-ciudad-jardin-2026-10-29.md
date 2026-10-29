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
