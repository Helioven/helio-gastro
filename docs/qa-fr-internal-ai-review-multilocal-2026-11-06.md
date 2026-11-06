# Helio Gastro — Revisión editorial FR asistida por IA · Bloque 2 (multilocal)

**Fecha:** 6 de noviembre de 2026. **Rama:** `feature/fr-integration-qa-20261027`; HEAD del catálogo examinado: `04e6a47bf30b4c2550305794847dca7b6c6eab2a`. **Alcance:** 13 entradas con sus originales `name` y `es` de `data/places.json` y sus descripciones `fr` de los cinco lotes reales indicados. Se leyó el blob GitHub `0ffd3de396986d99125752cde7b4c2c52a20b31e` y los JSON FR de la rama.

## Dictamen acotado

**13/13 parejas ES/FR cotejadas con original identificado.** Ninguna contradicción manifiesta de ingredientes o formato demostrada en estos 13 casos. **3 observaciones para valorar naturalidad/especificidad**: japuta en adobo, paté de piparra y sobrasada ibérica del Valle de los Pedroches. No se convierten en bugs ni justifican editar datos sin revisar fuentes y criterio editorial.

Este control es una revisión interna asistida por IA de los **textos presentes en el repositorio**, no una validación profesional externa, no prueba la vigencia de la carta ni valida la integridad del resto del catálogo. No sustituye las regresiones funcionales ya pasadas.

## Matriz verificable

| Local | Referencia (lote, índice) | Nombre de catálogo | ES original | FR candidato vigente | Resultado y observación |
|---|---|---|---|---|---|
| Taberna El Abuelo | `batch-011-taberna-el-abuelo.json` `0:4` | Boquerones en vinagre | Boquerones en vinagre | Anchois au vinaigre. | **Conforme.** Boquerones en vinagre se expresa como «Anchois au vinaigre»; sin ingredientes añadidos. |
| Taberna El Abuelo | `batch-011-taberna-el-abuelo.json` `0:5` | Boquerones en adobo | Boquerones en adobo | Anchois marinés en adobo. | **Conforme.** Se conserva el adobo como técnica/nombre tradicional, sin afirmar condimentos concretos. |
| Taberna El Abuelo | `batch-011-taberna-el-abuelo.json` `0:6` | Japuta en adobo | Japuta en adobo | Japuta marinée en adobo. | **Precaución de claridad.** Se mantiene «Japuta» en francés y el adobo sin atribuir una especie no respaldada por la descripción ES. |
| Casa Rubio | `batch-017-casa-rubio.json` `0:3` | Salmorejo cordobés con jamón y huevo | Salmorejo cordobés acompañado de jamón y huevo. | Salmorejo cordobés accompagné de jambon et d’œuf. | **Conforme.** Salmorejo con jamón y huevo, sin ingredientes inventados. |
| Casa Rubio | `batch-017-casa-rubio.json` `0:4` | Mazamorra con manzana verde y pasas al PX | Mazamorra acompañada de manzana verde y pasas al vino Pedro Ximénez. | Mazamorra accompagnée de pomme verte et de raisins secs au vin Pedro Ximénez. | **Conforme.** Se conservan mazamorra, manzana verde, pasas y vino Pedro Ximénez. |
| Casa Rubio | `batch-017-casa-rubio.json` `0:5` | Nuestra ensaladilla de atún con carpaccio de pulpo y pimentón (200/300 g) | Ensaladilla de atún con carpaccio de pulpo y pimentón, en cantidades de 200 y 300 gramos. | Ensaladilla au thon avec carpaccio de poulpe et paprika, proposée en portions de 200 ou 300 grammes. | **Conforme.** Atún, carpaccio de pulpo, pimentón y dos cantidades de 200/300 g conservados; no confundir gramos con precios. |
| La Taberna del Río | `batch-023-la-taberna-del-rio.json` `0:0` | Tosta de anchoa del Cantábrico, paté de piparra y AOVE | Tosta con anchoa del Cantábrico, paté de piparra y aceite de oliva virgen extra. | Tartine garnie d’un anchois de Cantabrie, de pâté de piment piparra et d’huile d’olive vierge extra. | **Precaución de naturalidad.** Anchoa del Cantábrico, piparra y AOVE conservados; comprobar si «pâté de piment piparra» resulta idiomático, sin cambiar ingrediente. |
| La Taberna del Río | `batch-023-la-taberna-del-rio.json` `0:1` | Tabla charcutera de morcón ibérico, mortadela de Bolonia, sobrasada ibérica del Valle de los Pedroches y pan de aceite | Selección de morcón ibérico, mortadela de Bolonia y sobrasada de Los Pedroches, acompañada de pan de aceite. | Assortiment de morcón ibérique, de mortadelle de Bologne et de sobrasada des Pedroches, accompagné de pain à l’huile d’olive. | **Precaución de especificidad.** Morcón, mortadela, sobrasada, origen Pedroches y pan de aceite conservados respecto a ES descriptivo; el nombre del plato añade «ibérica» a la sobrasada, dato no repetido en la descripción ES ni FR. No declarar fallo inequívoco sin criterio sobre si se exige reproducir nombre íntegro. |
| La Taberna del Río | `batch-023-la-taberna-del-rio.json` `0:4` | Ensaladilla de atún y mahonesa de AOVE | Ensaladilla de atún con mayonesa elaborada con aceite de oliva virgen extra. | Ensaladilla au thon avec mayonnaise préparée à l’huile d’olive vierge extra. | **Conforme.** Ensaladilla de atún y mayonesa con aceite de oliva virgen extra conservadas. |
| Taberna Salinas | `batch-046-taberna-salinas.json` `0:2` | Jamón serrano del Valle | Jamón serrano curado procedente del Valle, según la carta. | Jambon serrano affiné provenant de la vallée indiquée sur la carte. | **Conforme.** Origen «del Valle» no se concreta geográficamente; se mantiene prudencia documental. |
| Taberna Salinas | `batch-046-taberna-salinas.json` `0:3` | Queso de oveja de Zuhetos | Queso de oveja de la localidad indicada en la carta; origen exacto pendiente de confirmar. | Fromage de brebis provenant de la localité indiquée sur la carte ; origine exacte à confirmer. | **Conforme con fuente pendiente.** Conserva origen exacto por confirmar y no inventa localidad ni corrige la grafía «Zuhetos» del título. |
| La Cazuela de la Espartería | `batch-073-la-cazuela-esparteria.json` `0:0` | Jamón ibérico de bellota (90/150 g) | Disponible en media ración y ración según la carta. | Disponible en demi-portion et en portion, selon la carte. | **Conforme.** Demi-portion/portion refleja media ración/ración, sin asociar tamaños no indicados en la descripción. Los 90/150 g figuran en el nombre del plato, no en el texto FR. |
| La Cazuela de la Espartería | `batch-073-la-cazuela-esparteria.json` `0:1` | Salchichón ibérico (90/130 g) | Disponible en media ración y ración según la carta. | Disponible en demi-portion et en portion, selon la carte. | **Conforme.** Demi-portion/portion preserva los dos formatos; no confundir 90/130 g con los de jamón. |

## Decisiones y limitaciones

- Mantener los términos gastronómicos autóctonos `japuta`, `adobo`, `mazamorra`, `piparra`, `morcón` y `sobrasada` cuando la traducción no puede mejorarse sin perder fidelidad o agregar una identidad no documentada.
- No alterar la indicación del queso de Salinas: su origen permanece pendiente de confirmar. No corregir por inferencia el nombre original del plato.
- No mezclar los dos tamaños de Casa Rubio con precios ni confundir los gramos de los dos productos de La Cazuela; los formatos de servicio siguen diferenciados.
- La frase española de la sobrasada no repite el adjetivo «ibérica» visible en el nombre del plato: comprobar si el texto francés de presentación necesita conservar ese calificativo antes de proponer cualquier cambio. **No se ha cambiado.**
- **Estado:** revisión semántica interna IA **realizada**, cobertura `13/13` de esta muestra, no aprobación del francés íntegro. Los lotes siguen `candidate_awaiting_semantic_review`; `?qa_fr=1` sigue experimental.
- **Archivos no modificados:** `data/places.json`, lotes FR, `i18n.js`, ES/EN, precios, formatos, enlaces, `main`.

**Siguiente paso recomendado:** ampliar las muestras de términos culinarios con alto riesgo (especies, ingredientes, advertencias y unidades) y, tras terminar el recorrido interno, presentar un resumen de riesgos residuales para decisión explícita de publicación o mantenimiento en QA.
