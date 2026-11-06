# QA FR — Revisión de alérgenos y restricciones alimentarias, 6 de noviembre de 2026

**Rama:** `feature/fr-integration-qa-20261027`. **Alcance:** revisión textual interna asistida por IA contra los datos españoles registrados; no certificación alimentaria, no análisis de recetas en cocina ni verificación independiente de la vigencia de las cartas.

## Decisiones de alcance

- **El Caballo Rojo permanece oculto/excluido del piloto.** Decisión expresa de Helio, 6 de noviembre de 2026. No se han editado sus datos ni se ha autorizado su publicación.
- Se conserva la distinción entre **lo declarado por una carta** y **la seguridad real para una persona con alergias o intolerancias**. La ausencia de un alérgeno de una lista no prueba su ausencia en la elaboración o por contaminación cruzada.
- No cambiar ingredientes, avisos ni precios por inferencia; no presentar traducciones como verificadas por un profesional francófono.

## Revisión realizada

Se contrastaron los **36 candidatos** del inventario `scripts/audit-french-integrity.mjs` con sus descripciones FR de los lotes originales y, adicionalmente, **cinco opciones de leche/chocolate sin lactosa** que el inventario inicial no había incluido.

| Tipo de comprobación | Textos | Resultado |
|---|---:|---|
| `Alérgenos declarados` → `Allergènes déclarés`, con categorías | 29 | Regresión ES→FR PASS; sin categorías omitidas/diferentes según el mapeo de test |
| Declaraciones de plato `sin gluten` / `sin lactosa` | 2 | PASS; preservadas ambas condiciones y la atribución a la carta cuando se consigna |
| Opciones `sin lactosa` (cuatro en D'Tapas COVAP y una en La Bandera) | 5 | PASS; distinguidas de una garantía para el plato completo |
| Menciones de `marisco` / `frutos secos` en nombre o ingredientes | 5 | Cotejo textual preliminar; no implican declaración exhaustiva de alérgenos |
| **Total de entradas relevantes** | **41** | Ningún error material de equivalencia demostrado en el alcance comprobado |

**Distribución de los 36 candidatos del primer detector:** D'Tapas COVAP 29; La Taberna del Río 1; Rincón de Beatillas 1; Moriles Ribera 2; La Bandera 1; Taberna La Sal 2. Se mantiene separación entre las sedes y sus fuentes.

## Riesgo editorial residual (no es un fallo confirmado)

En `dtapas-covap-cordoba/4/1` el español dice `Frutos secos (la fuente dice «con cáscara, sin cáscara»)`, mientras el francés utiliza `fruits à coque (la source indique « avec coque, sans coque »)`. En el uso de etiquetado de alérgenos, `fruits à coque` puede tener alcance más estrecho que la expresión española genérica `frutos secos` y no comprende por sí mismo `cacahuètes`. No añadir ni retirar categorías sin cotejar el documento original del establecimiento y su significado. **Sin cambio propuesto de producción por ahora.**

## Evidencia técnica de CI y correcciones del test

- [Actions #861](https://github.com/Helioven/helio-gastro/actions/runs/42185653771) corrige el detector global: 107 lotes, 1.232 descripciones, 0 ausentes, 0 discrepancias numéricas, 0 destinos duplicados o inválidos; 36 candidatos a revisión alimentaria.
- `scripts/test-fr-allergen-equivalence.mjs`: regresión nueva y de solo lectura; se incorporó a `.github/workflows/data-qa.yml`. Commit inicial `419fec4`.
- El test necesitó dos correcciones: patrón de selección de lotes y tratamiento de `sin gluten ni lactosa` (`250aa47`); identificación explícita de cinco opciones `sin lactosa` (`ce0c9b6`).
- [Actions #864](https://github.com/Helioven/helio-gastro/actions/runs/42186398957), commit `ce0c9b6`: **job `catalog-audit` completado con éxito**, log `FR ALLERGEN EQUIVALENCE` con `status: PASS`, `declarations: 29`, `freeFrom: 2`, `lactoseOptions: 5`, `ingredientMentions: 5`, `errors: []`; conserva la observación sobre `frutos secos`. El estado del job `visual-qa` y el workflow completo deben confirmarse por separado.
- Los FAIL de ejecución intermedia de una aserción de inventario pertenecen al test, no a un error alimentario confirmado en las traducciones. La corrección de esa aserción se verificó con el job posterior PASS.

## Decisión QA

**La equivalencia textual de las 29 declaraciones de alérgenos y las 7 menciones de restricciones/opciones alimentarias ha superado los controles realizados; no se han identificado modificaciones editoriales necesarias inmediatas.** La observación sobre `frutos secos` queda registrada como riesgo residual pendiente de corroboración de fuente. No se garantiza aptitud de consumo a personas alérgicas.

No se ha alterado `main`, `data/places.json`, `translations/fr`, cartas, ingredientes, alérgenos, cantidades ni precios. El francés sigue experimental bajo `?qa_fr=1`, sujeto a decisión expresa de publicación.

## Contraste terminológico oficial posterior — 06/11/2026

**Pregunta:** ¿es correcta la equivalencia del indicador de alérgenos de D'Tapas COVAP `Frutos secos` → `fruits à coque` en `dtapas-covap-cordoba/4/1`?

**Fuentes externas consultadas:**

1. Reglamento (UE) nº 1169/2011, anexo II, versiones ES y FR en EUR-Lex: `Frutos de cáscara` ↔ `Fruits à coque` (grupo 8), mientras `Cacahuetes` ↔ `Arachides` corresponde al grupo 5. https://eur-lex.europa.eu/legal-content/NL-FR-ES/TXT/?uri=CELEX%3A32011R1169
2. AESAN, explicación oficial de alérgenos, con cacahuetes y frutos de cáscara como categorías diferenciadas: https://aesan.gob.es/seguridad-alimentaria/informacion-alimentaria/etiquetado-sustancias
3. Carta del propio establecimiento registrada en `data/places.json`: https://www.ibericoscovap.com/es/dtapas-covap-cordoba-carta/; en la leyenda de alérgenos aparecen *Cacahuetes* y *Frutos Secos: Frutos secos con cáscara, sin cáscara* como categorías distintas. El aviso de trazas del pie también menciona *frutos de cáscara*. La página accesible en esta consulta no incluye una entrada de mazamorra correspondiente al índice del catálogo; **no se debe inferir de ella la atribución vigente al plato**.

**Dictamen de traducción:** **CORRECTA terminológicamente** la traducción `fruits à coque` como denominación oficial de la clase de frutos de cáscara en la carta de COVAP. **No añadir `arachides`**: el original de COVAP distingue cacahuetes por separado. La coletilla `avec coque, sans coque` reproduce la explicación de la leyenda de la fuente, sin constituir una nueva garantía alimentaria.

**Límite de verificación:** queda **pendiente de fuente vigente** confirmar que la declaración histórica `frutos secos, gluten, sulfitos` se atribuye hoy a la *Mazamorra con crema de PX y uvas laminadas* y no a otra elaboración. Es una cuestión de procedencia/vigencia del dato, **no un error de traducción probado**. No cambiar ni eliminar alérgenos sin confirmación; la carta del establecimiento es la referencia que debe consultar cualquier persona con alergias.

**Cambios en aplicación y datos:** ninguno. Se mantiene la excepción de El Caballo Rojo y la condición experimental de francés. Este añadido es solo documental y no acredita PASS de su propio CI hasta comprobarlo.
