# Helio Gastro — Dictamen consolidado de cierre francés para piloto
**Fecha:** 6 de noviembre de 2026  
**Rama exclusiva:** `feature/fr-integration-qa-20261027`  
**Commit documental anterior comprobado:** `22114c7e9e497f2b320b6ee70313253a18be3c26`  
**Estado propuesto:** **cierre interno condicionado del trabajo de integración FR; publicación NO autorizada**. No se certifica calidad nativa ni seguridad alimentaria.

## 1. Decisión ejecutiva

La integración técnica experimental del francés muestra resultados favorables dentro de las pruebas ejecutadas. Para un **piloto/portfolio**, Helio decidió sustituir la exigencia de revisor francófono profesional por una **revisión editorial interna asistida por IA**, expresamente identificada como tal y limitada a los textos comparados. Esta decisión **no convierte** la traducción global en certificada ni garantiza corrección perfecta del francés.

**Se recomienda preparar una autorización expresa para la activación pública del francés solo después de comprobar la última regresión CI, revisar los riesgos residuales que se aceptan para el piloto y verificar que El Caballo Rojo no aparece públicamente.** Esta recomendación no cambia el estado `candidate_awaiting_semantic_review` de los lotes ni activa ninguna función.

## 2. Matriz de evidencias

| Área | Evidencia comprobada | Resultado / límite |
|---|---|---|
| Integración técnica FR | [CI #857](https://github.com/Helioven/helio-gastro/actions/runs/42181805551), 40 suites cronometradas | PASS, cero FAIL; pruebas funcionales, navegación, comparador, favoritos, visual dirigida |
| Auditoría reciente del catálogo | [CI #861](https://github.com/Helioven/helio-gastro/actions/runs/42185653771), `scripts/audit-french-integrity.mjs` | PASS completo del workflow; 107 lotes, 1.232 candidatas, cero ausentes, duplicados o referencias inválidas; cero discrepancias numéricas |
| Integridad del overlay | `scripts/test-fr-overlay-integrity.mjs` en CI | 1.232 traducciones, cero campos protegidos modificados, cero escrituras al catálogo |
| La Montillana, revisión interna dirigida | [Informe de 30 entradas](qa-fr-internal-ai-review-la-montillana-2026-11-06.md) | 30/30 cotejadas con ES; seis cuestiones de naturalidad/especificidad; sin error material probado |
| Muestra multilocal | [Informe de 13 entradas](qa-fr-internal-ai-review-multilocal-2026-11-06.md) | 13/13 cotejadas; tres cuestiones editoriales no confirmadas como defecto |
| Moriles Ribera | [Cierre técnico previo](qa-fr-technical-closure-2026-11-06.md) y registro editorial | 214/214 entradas cotejadas previamente; sin extrapolar a otros locales ni fuentes recientes |
| Control alimentario | [Revisión de alérgenos](qa-fr-allergen-review-2026-11-06.md), [CI #864](https://github.com/Helioven/helio-gastro/actions/runs/42186398957) | PASS; 29 declaraciones de alérgenos, dos platos con afirmaciones de ausencia de gluten/lactosa, cinco opciones sin lactosa y cinco menciones de ingredientes |
| Última comprobación del estado | [CI #866](https://github.com/Helioven/helio-gastro/actions/runs/42187254996), commit `22114c7` | **Al redactar:** `catalog-audit` SUCCESS; `visual-qa` IN_PROGRESS. **No afirmar PASS global** hasta conclusión confirmada |
| Accesibilidad | Exploración 24 vistas y diálogo mapa por teclado 6/6 PASS, documentado en cierre previo | Cero candidatos en controles aplicados; **no certificación WCAG** ni ensayo exhaustivo con lector de pantalla |
| Francés visible | `index.html?qa_fr=1` en rama QA | Opt-in experimental, **no publicación FR en `main`** |

**Nota de precisión:** el script histórico `audit-french-integrity.mjs` miraba equivocadamente el campo `item.fr` en el catálogo ES/EN, donde no se almacenan las traducciones candidatas. Se corrigió para leer `translations/fr/batch-*.json`; el resultado previo de «1.232 ausentes» **no representaba traducciones perdidas**. Los errores de test intermedios #862–#863 se resolvieron, con PASS posterior #864 y #865.

## 3. Riesgos y decisiones de alcance

| ID | Riesgo / punto abierto | Evidencia y tratamiento | ¿Bloquea decisión de piloto? |
|---|---|---|---|
| FR-ED-01 | No existe validación externa por francófono competente | Se adopta revisión interna asistida por IA, sin atribuir certificación; quedan dudas de naturalidad en muestras tradicionales (p. ej. Manolete, rosada, foie/faux-filet, piparra) | **No por requisito contractual**, si Helio acepta por escrito el riesgo residual del piloto |
| FR-DATA-01 | D'Tapas COVAP, mazamorra con crema de PX: vigencia de atribución de alérgenos de ese plato | `frutos secos` → `fruits à coque` **correcto terminológicamente** según la leyenda de la fuente COVAP y categorías europeas; **atribución actual al plato no verificada** | No usar la traducción correcta como prueba de vigencia; se debe respetar el aviso de fuente/fecha y valorar riesgo antes de publicar |
| FR-VENUE-01 | El Caballo Rojo: excepción documental | **Decisión expresa de Helio: mantener oculto**; no declarar 44/44 verificados. Comprobar ocultación real en la versión a publicar | **Sí**, si apareciera públicamente |
| FR-CI-01 | CI #866 todavía no completado a la hora de redactar | Esperar conclusión real de `visual-qa` y workflow; cualquier FAIL debe investigarse | **Sí** mientras no haya PASS final para el commit elegido |
| FR-VIS-01 | Revisión visual limitada a muestras y automatización | Las capturas y el inventario heurístico no equivalen a inspección manual exhaustiva de todas las fichas | Riesgo residual del piloto; presentar sin sobregarantizar |
| FR-SRC-01 | Vigencia de cartas, precios y fuentes de ciertos locales | Mantener avisos y fechas registrados; no inferir disponibilidad, alérgenos o condiciones a partir de traducciones | Mantener como limitación documentada; bloquear cualquier dato sin respaldo según normas del proyecto |

## 4. Condiciones de salida y regla de autorización

Antes de considerar la activación pública del francés:
1. Confirmar estado `completed/success` de **todos los jobs** del último commit técnico y, tras cualquier edición posterior, comprobar el nuevo CI correspondiente. Un PASS anterior no se hereda automáticamente.
2. Verificar en la copia de publicación que **El Caballo Rojo está oculto** y no se filtra en buscador, favoritos, fichas ni comparador; no inventar una supuesta verificación todavía no ejecutada.
3. Confirmar que no hay correcciones de catálogo o alérgenos propuestas sin respaldo de fuente; conservar la advertencia de atribución no actualizada de la mazamorra de COVAP.
4. Registrar la **aceptación del riesgo lingüístico residual** como revisión interna asistida por IA para un proyecto piloto/portfolio, sin afirmar revisión profesional independiente.
5. Solicitar **autorización expresa de Helio para activar FR, fusionar o publicar**. Ninguno de estos actos se desprende de este informe.

## 5. Hoja de ruta posterior

Con el francés resuelto mediante decisión editorial de piloto, corresponde avanzar a **fase 3: auditoría integral y QA de toda la aplicación**, sin adelantar reseñas ni imágenes. La auditoría debería priorizar controles de teclado, experiencia móvil/escritorio, accesibilidad exploratoria, casos de búsqueda y filtros y regresiones cruzadas de ES/EN/FR, reconociendo que ya existen suites específicas para buscador, filtros, navegación, ficha y comparador. No repetir las pruebas cerradas sin indicio o nueva modificación.

## 6. Control de cambios

Este documento registra evidencias y criterios de salida exclusivamente en la rama `feature/fr-integration-qa-20261027`. **No modifica** `main`, `data/places.json`, `translations/fr`, precios, platos, alérgenos, ni activa francés público. Su propio commit documental desencadenará, si la configuración de Actions así lo dispone, una ejecución nueva cuyo estado deberá comprobarse por separado.
