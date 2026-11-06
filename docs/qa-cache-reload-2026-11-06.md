# Fase 3 — HG-QA-CACHE-001 · Recarga y caché del navegador
**Fecha:** 6 de noviembre de 2026. **Rama:** `audit/cache-reload-qa-20261106`.

## Observaciones comprobadas en código antes de la prueba
- La app contiene `manifest.webmanifest` y es instalable según los controles del navegador, pero **no se encuentra** un archivo de service worker en el directorio raíz ni una llamada de registro en los scripts revisados. Esto **no autoriza** afirmar que exista modo offline.
- El catálogo `./data/places.json` y los lotes `./translations/fr/batch-*.json` usan solicitudes `cache:'no-store'`, decisión conservadora cuando hay precios y cartas con vigencia variable.
- Los archivos estáticos `app.js` e `i18n.js` incluyen parámetros de versión en `index.html`. **No se verifica en esta fase** una política de invalidación CDN de GitHub Pages ni se infiere que la página pública tenga recursos obsoletos.
- La carga de los 107 lotes se difiere en la URL pública ES/EN, comprobada en CI #880 antes de fusionar PR #47.

## Nuevo test automatizado
`scripts/inventory-cache-reload.mjs` se ejecuta en `visual-qa` en escritorio y viewport móvil simulado; verifica:
1. Primera entrada ES sin descargas FR.
2. Recarga ES con favorito válido y favorito oculto guardados: solo permanece el válido, el modo Cena se restaura.
3. Preferencia EN conservada tras recargar, sin lotes FR.
4. Preferencia FR conservada tras recargar, con 107 lotes y El Caballo Rojo excluido.
5. Sin errores de red/JS ni respuestas defectuosas del catálogo; inventario informativo de cabeceras HTTP y presencia de control por service worker.

**Alcance:** Chromium contra servidor HTTP local de GitHub Actions. No equivale a ensayo en navegador real, prueba de red desconectada ni certificación de seguridad/caché de CDN. `qa-reports/cache-reload-inventory.json` conserva evidencias.

**Criterio editorial:** no activar caché offline de cartas, precios o alérgenos automáticamente; antes, diseñar política de caducidad, invalidación y comunicación clara de vigencia y validar los tres idiomas.

**Estado al crear:** prueba implementada en rama; ejecución CI pendiente, no afirmar PASS todavía.
