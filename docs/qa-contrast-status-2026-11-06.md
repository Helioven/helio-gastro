# Fase 3 — HG-QA-A11Y-002 · Contraste y avisos dinámicos (06/11/2026)

**Base:** `main` `c8f8ad8a465e68ccb12a997ff446a0203cca9664`. **Rama:** `audit/contrast-status-qa-20261106`.

## Justificación
La suite HG-QA-A11Y-001 (PR #49, CI #885 PASS) comprueba teclado, etiquetas y foco en ES/EN/FR. La prueba del diálogo del mapa ya se ejecuta. Esta tanda amplía cobertura a **contrastes visuales orientativos** y a los **estados dinámicos** sin tocar ni el código de la interfaz ni las cartas.

## HG-QA-A11Y-002
`scripts/inventory-contrast-status.mjs`: usa Playwright/Chromium en escritorio y viewport móvil y para ES, EN y FR:
- Ejecuta cambio de servicio a Merienda y búsqueda de La Montillana.
- Registra colores calculados de una muestra de títulos, notas, controles, botones y resultados.
- Estima la razón de contraste **solo** cuando puede aproximar fondo y texto opacos de color sólido. Los fondos degradados, imágenes o transparencias complicadas quedan marcados como **no medibles** para revisión humana; la razón aproximada no equivale a un resultado WCAG.
- Genera candidatos a revisión visual por debajo de 4,5:1 (texto habitual) o 3:1 (texto grande). **Los candidatos no se convierten automáticamente en PASS o FAIL de accesibilidad.**
- Comprueba semántica y texto no vacío de las regiones `#service-intro` y `#results`, y el rol de `#coverage-summary`. Los avisos visuales no garantizan por sí solos lectura correcta en NVDA, VoiceOver u otros lectores.
- Protege la exclusión de El Caballo Rojo.

El informe se conserva en `qa-reports/contrast-status-inventory.json`. No se realiza auditoría de contraste completa ni certificación WCAG y la ejecución CI debe confirmar PASS antes de plantear integración.

**Siguiente paso:** revisar candidatos reales con capturas y pruebas manuales, distinguir defectos de estimaciones poco fiables; corregir CSS solo si hay un problema demostrado y volver a ejecutar la regresión.
