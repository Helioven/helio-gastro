# Ilustraciones gastronómicas

Son imágenes generadas de platos generales, no fotografías de restaurantes ni representaciones de sus recetas o presentaciones. Las preparaciones y los ingredientes pueden variar entre locales; no sirven para informar sobre alérgenos.

`DISH_ILLUSTRATIONS`, en `app.js`, relaciona nombres de plato normalizados **exactos** con archivos WebP. Así se reutiliza una imagen por concepto en los modos que comparten tarjeta, sin modificar el catálogo. Los alias son explícitos: no se infiere una receta de un nombre parecido. «Berenjenas» muestra una posible preparación con miel, no una afirmación sobre todas las opciones. Los nombres que no figuran en el mapa conservan el marcador abstracto. Las imágenes se muestran en tarjetas generales y junto al resumen de una búsqueda con resultados si el nombre normalizado coincide con el mapa. En resultados se presenta una sola imagen de contexto para el plato, fuera de las fichas de los locales.

Para ampliar el sistema, añadir un WebP aprobado a esta carpeta y agregar al mapa el nombre normalizado y archivo; incluir alias inequívocos solo cuando proceda. No añadir platos ni vincular imágenes a locales por inferencia. Comprobar carga, fallback y etiqueta ES/EN/FR con `scripts/test-dish-illustrations.mjs`.

Las imágenes se cargan de forma diferida. Si un archivo falla, la tarjeta recupera el marcador sin etiqueta de imagen. Los archivos están optimizados a 640 × 480 px.
