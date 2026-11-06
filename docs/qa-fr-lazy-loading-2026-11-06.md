# HG-QA-PERF-001 — Carga diferida del francés (06/11/2026)

**Base:** `main` `bc53961210d8f5f6579641afc335db17cde40db0`. **Rama de QA:** `feature/fr-lazy-loading-qa-20261106`.

## Evidencia de partida
CI #878 (PR #46) midió **107 lotes** de descripciones FR y **263.904 bytes transferidos** incluso al entrar en español, por escritorio y viewport móvil, sin errores de carga. Es una medida del servidor local de CI, no de una red móvil real.

## Implementación propuesta y realizada en rama
- En el acceso público normal se carga el catálogo ES/EN sin descargar los 107 JSON de descripciones FR.
- Al elegir francés, se descarga y valida el overlay existente una sola vez por página; al regresar a FR se reutiliza. Si se recarga con FR guardado en localStorage, se vuelve a traer el overlay en la nueva página.
- Se refresca la ficha abierta cuando terminan de llegar las descripciones FR. La carga de los lotes es asíncrona; no atribuirles disponibilidad antes de completarse.
- El modo de test histórico `?qa_fr=1` conserva la precarga para no cambiar el alcance de las pruebas de restaurantes existentes.
- No se altera la traducción, nombre, alérgeno, fuente, dato ni formato. El Caballo Rojo sigue excluido.

## Criterios de aceptación automatizados
`scripts/inventory-fr-load-performance.mjs`: **0 solicitudes iniciales en ES**, **0 en EN**, **107 al elegir FR**, **107 en total tras alternar FR↔ES↔FR** y **107 en la recarga con FR persistido**; sin errores JS/red ni reintroducir El Caballo Rojo. `scripts/test-fr-public-release.mjs` espera las descripciones FR asíncronas.

**Estado al añadir:** implementación lista para CI, no declarar PASS hasta ver ejecución. Comparar con el punto de partida antes de proponer otras optimizaciones.
