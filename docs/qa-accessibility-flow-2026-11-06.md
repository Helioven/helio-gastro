# Fase 3 — HG-QA-A11Y-001 · Flujo accesible ES/EN/FR
**Fecha:** 6 de noviembre de 2026. **Rama:** `audit/accessibility-flow-qa-20261106`.

## Punto de partida verificado en el código
Existe ya `scripts/test-fr-keyboard-map-dialog.mjs`, que comprueba foco, Escape y recuperación en el diálogo del mapa en los tres idiomas. También existen inventarios exploratorios de geometría, etiquetas y textos. No repetir esas pruebas ni confundir resultados automatizados con una certificación WCAG.

## Nueva cobertura
`scripts/test-accessibility-flow.mjs`, en CI `visual-qa`, comprueba en escritorio y viewport móvil:
- Documento identificado correctamente con `lang=es/en/fr`, controles esenciales del formulario con nombre accesible y avisos de estado semánticos.
- Búsqueda de un establecimiento enviando **Enter** desde el campo de nombre, resultados visibles y foco programático en el título de resultados.
- Apertura de ficha y foco en su título; cierre con **Enter** desde el botón de cerrar y devolución del foco al encabezado de resultados.
- Exclusión de El Caballo Rojo de los resultados internos y ausencia de desbordamiento horizontal, para cada idioma.
- Errores JavaScript. En francés público espera a la carga diferida de los lotes ya implantada.

**No incluye** lector de pantalla, pruebas manuales de contraste, análisis integral WCAG, ni validación de todos los textos traducidos; se documentarán por separado. Ninguna modificación en precios, fuentes, idiomas o catálogo.

**Estado al redactar:** suite propuesta e implementada en rama; resultado GitHub Actions pendiente de ejecución.
