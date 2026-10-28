# Cierre técnico FR — La Taberna del Río (28/10/2026)

- **38/38 descripciones francesas candidatas** preparadas en lotes 023–025 e integradas exclusivamente en el modo `?qa_fr=1`.
- Carta real: **44 títulos de platos** en la ficha, de los cuales **38 tienen descripciones ES/EN candidatas a traducir**. Los seis restantes no deben confundirse con descripciones omitidas.
- Primer test visual [#40655348181](https://github.com/Helioven/helio-gastro/actions/runs/40655348181): **FAIL** por aserción incorrecta de 38 títulos, frente a 44 renderizados. Segunda corrección [#40655611931](https://github.com/Helioven/helio-gastro/actions/runs/40655611931): **FAIL** porque la estructura fuente inspeccionada no coincidía con los títulos renderizados. Tercer intento [#40655857807](https://github.com/Helioven/helio-gastro/actions/runs/40655857807): **FAIL** por exigir coincidencia literal de los títulos EN con los ES.
- Solución: conservar las 38 aserciones de texto FR y comprobar estabilidad de títulos ES, además de comparar los títulos EN frente a la aplicación sin overlay francés, en vez de equipararlos a ES. Última ejecución [#40656146561](https://github.com/Helioven/helio-gastro/actions/runs/40656146561): **SUCCESS**, verificada vía GitHub.
- Acumulado: **9 restaurantes / 273 descripciones FR candidatas / 25 lotes**. No se certifican títulos, secciones ni interfaz íntegramente traducidos.
- `data/places.json`, precios originales y rama `main` no se han modificado.
- **Cierre estrictamente técnico**: pendientes revisión semántica/contextual y lingüística humana, así como aprobación editorial antes de publicar.
