# Ilustraciones gastronómicas del piloto

Las cinco imágenes son ilustraciones generadas de platos generales, no fotografías de restaurantes ni representaciones de sus recetas o presentaciones. Las preparaciones y los ingredientes pueden variar entre locales; no sirven para informar sobre alérgenos.

`DISH_ILLUSTRATIONS`, en `app.js`, relaciona el nombre normalizado **exacto** de cada tarjeta de recomendaciones con su archivo WebP. Así se reutiliza una imagen por concepto en los modos que comparten tarjeta, sin modificar el catálogo. «Berenjenas» muestra una posible preparación con miel, no una afirmación sobre todas las opciones. Los nombres que no figuran en el mapa conservan el marcador abstracto. Para añadir una imagen aprobada, incorporarla aquí y agregar su nombre normalizado y archivo al mapa; mantener la etiqueta traducida y probar los tres idiomas.

Las imágenes se cargan de forma diferida. Si un archivo falla, la tarjeta recupera el marcador sin etiqueta de imagen. Los archivos del piloto están optimizados a 640 × 480 px.
