# Helio Gastro — Fase 3 · Inicio de auditoría integral QA
**Fecha:** 6 de noviembre de 2026. **Rama:** `audit/integral-qa-20261106`. **Base:** `main` en `ccfe52e75f6a30f61e73fa56b2670327c5334bf7`.

## Evidencia de despliegue
- GitHub Pages [#542](https://github.com/Helioven/helio-gastro/actions/runs/42192390965): **completed/success** para el merge francés `ccfe52e`.
- GitHub Actions [#873](https://github.com/Helioven/helio-gastro/actions/runs/42192391624): al abrir esta auditoría, **catalog-audit SUCCESS** y **visual-qa in_progress**. Este documento **no declara PASS final** de #873.
- La rama publicada incorpora ES/EN/FR y mantiene `el-caballo-rojo` con `hidden:true`; el test de ocultación pasó en la PR de publicación. No publicar fichas incompletas.

## Cobertura previamente existente (no repetir por costumbre)
- Buscador, filtros, comparador, ficha, navegación y restauración de sesión: Playwright en escritorio y móvil.
- Favoritos, mapas por teclado, cambio ES/EN/FR y francés público: pruebas ya incorporadas al CI.
- Catálogo y lotes FR: integridad, campos protegidos, recuentos, números y alérgenos, **sin certificación semántica externa**.
- Accesibilidad: inventarios exploratorios de 24 vistas y controles de teclado; **no conformidad WCAG certificada**.
- El CI ya se ejecuta en cambios dirigidos a `main`.

## Nueva cobertura de esta tanda
**HG-QA-EXT-001** — `scripts/audit-external-links.mjs`: recorre fuentes, `sourceUrl` y `productUrl` anidados, comprueba sintaxis URL, HTTPS, ausencia de credenciales y direcciones locales, y genera `qa-reports/external-links-audit.json`. Se integra en `catalog-audit`. **No consulta la red ni acredita que una carta o precio siga vigente.** El resultado es **propuesto/pendiente de ejecución CI** en el momento de redactar.

## Riesgos por priorizar durante la fase integral
| Área | Riesgo / pregunta QA | Próxima comprobación | Estado |
|---|---|---|---|
| Fuentes y seguridad de enlaces | URL anidadas no verificadas por auditoría global única | HG-QA-EXT-001 | Implementada en rama, ejecución pendiente |
| Carga de traducciones FR | `app.js` descarga 107 lotes cuando el overlay FR está habilitado; coste de red y errores de lote en el público | Medición real de solicitudes, bytes y carga en móvil / red lenta; evitar optimización sin perfilado | Propuesta |
| Caché y actualización | PWA con manifest; inspeccionar caché, actualización de assets y comportamiento offline sin asumir soporte | Prueba exploratoria de recarga y caché / inspección de service worker si existe | Pendiente |
| Accesibilidad completa | Controles heurísticos y teclado no equivalen a lector de pantalla ni WCAG | Inventario semántico, estados de foco y mensajes dinámicos | Pendiente |
| Datos y alérgenos | La equivalencia de traducción no confirma vigencia de las cartas | Inspección de fuentes, fechas y notas sin alterar datos sin autorización | Pendiente |
| Rendimiento y privacidad | Mapas y recursos de terceros | Revisar activación bajo interacción, políticas de navegación y carga | Pendiente |

**Método:** un cambio pequeño por tanda, pruebas automatizadas con resultados verificables y regresión tras modificaciones. Ningún cambio de datos gastronómicos, traducciones, precios, reseñas o imágenes. No se altera `main` desde esta rama sin nuevo PASS y revisión del PR.
