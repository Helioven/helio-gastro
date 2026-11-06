# Consolidación del cierre técnico francés — 6 de noviembre de 2026

**Rama:** `feature/fr-integration-qa-20261027`. **HEAD técnico verificado:** `f597c3b994d03643f396c45be095a3119988da6f`. Francés **solo QA opt-in** con `index.html?qa_fr=1`.

## Dictamen

**Cierre técnico favorable dentro de la cobertura comprobada, no autorización de publicación.** [GitHub Actions #857](https://github.com/Helioven/helio-gastro/actions/runs/42181805551), correspondiente al commit `f597c3b`, terminó `completed/success` con ambos jobs, `catalog-audit` y `visual-qa`. Se verificaron los logs originales: **40 suites cronometradas PASS; 0 FAIL**.

La inspección humana dirigida de las seis capturas de favoritos y comparador post-fix, en escritorio y móvil, confirmó la presentación FR, incluido `📍 Voir la carte`. Esta inspección no cubre todas las pantallas de la aplicación.

## Matriz de regresiones y evidencias

| Área | Estado | Alcance |
|---|---|---|
| Búsqueda, filtros, fichas, comparador y navegación | PASS | Regresiones Playwright, escritorio y móvil |
| Favoritos 0/1/2, persistencia, retirada y ES/EN/FR | PASS | `test-fr-favorites-populated.mjs`, dos perfiles |
| Dos botones de mapa del comparador FR→ES→EN→FR | PASS | Aserciones explícitas de `test-fr-favorites-populated.mjs` |
| Diálogo mapa por teclado ES/EN/FR | 6/6 PASS | Dos perfiles; no es auditoría con lector de pantalla |
| Inventario exploratorio de accesibilidad | 24 vistas; 0 candidatos; 0 errores | No equivale a certificación WCAG |
| Catálogo FR | 43 fichas ordinarias por perfil; 0 candidatos | Heurístico, no aprobación lingüística |
| Maquetación FR | 0 candidatos en escritorio/móvil | Barrido exploratorio |
| Textos visibles FR | 0 candidatos en siete vistas por perfil | Muestreo automatizado |
| Moriles Ribera | 214 entradas PASS, sin duplicados | Integridad documental y semántica de la cobertura |
| Integridad FR | 1.232 traducciones comprobadas; 0 campos protegidos modificados; 0 escrituras al catálogo | Auditoría técnica del #857 |
| Menús de grupo | 48 entradas en 10 locales; invariantes PASS | El contenido puede necesitar revisión editorial |

**Excepción:** El Caballo Rojo sigue fuera de las 43 fichas ordinarias validadas; no declarar 44/44.

## Incidencias

| ID | Resultado |
|---|---|
| QA-FR-VIS-01 | Metodología y pie: cerrada técnicamente |
| QA-FR-VIS-02 | Avisos Comer/Cenar: cerrada técnicamente |
| QA-FR-VIS-03 | Favoritos vacíos, título, contador: cerrada técnicamente |
| QA-FR-VIS-04 | La Tarterie, filtros y avisos: cerrada técnicamente |
| FR-VIS-05 | Favoritos poblados: PASS técnico + visual dirigido |
| FR-VIS-06 | Comparador poblado y botón mapa: PASS técnico + visual dirigido; commit `f597c3b` |

## Pendientes reales y puerta editorial

1. **Revisión francófona competente**, verificando naturalidad y denominaciones tradicionales (Manolete, flamenquín, mazamorra, salmorejo, torrija), sin inventar ingredientes ni alterar recetas.
2. **El Caballo Rojo:** mantener su excepción documental hasta decisión con fuentes.
3. **Publicación FR:** no autorizada. Los lotes candidatos no cambian de estado por este informe; no publicar ni fusionar a `main` sin aprobación expresa.
4. Tras resolver la puerta editorial, continuar con la **fase 3, auditoría integral QA**, en el orden del README.

## Límites y trazabilidad

El CI no garantiza ausencia de defectos visuales no muestreados ni certifica accesibilidad o calidad lingüística nativa. Las capturas de Actions tienen retención de 14 días; conservar evidencias selectivas. No confundir cartas de Moriles Ribera y Moriles Casa Fina; la categoría `Cafés et chocolats` de Casa Fina se mantuvo tras contraste de la fuente original.

- [#855](https://github.com/Helioven/helio-gastro/actions/runs/42177713743) — prueba de favoritos poblados y comparador.
- [#856](https://github.com/Helioven/helio-gastro/actions/runs/42180272486) — traducciones principales FR.
- [#857](https://github.com/Helioven/helio-gastro/actions/runs/42181805551) — último botón de mapa y regresión de tres idiomas.
- Contexto: `README.md`; `docs/qa-fr-editorial-review-2026-11-03.md`.

**Este documento solo registra evidencias.** No cambia catálogo, importes, fuentes, ES/EN ni decisiones de publicación. El CI provocado por su propio commit documental requiere verificación independiente.
