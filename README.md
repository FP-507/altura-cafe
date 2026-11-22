# Altura · sitio de café de especialidad

Sitio web para **Altura**, una marca ficticia de café de altura de Boquete, Panamá. Proyecto de diseño web con dirección de arte editorial, ilustraciones hechas en SVG y microinteracciones, sin frameworks ni imágenes externas.

**[Ver el sitio en vivo →](https://fp-507.github.io/altura-cafe/)**

## Dirección de arte

- **Concepto**: "el café sabe mejor cerca de las nubes". La paleta sale de la montaña al atardecer: verde volcán, crema, terracota de cereza madura y dorado.
- **Tipografía**: *Gloock* (serif de alto contraste) para titulares, con itálicas en terracota como acento, y *Figtree* para el texto.
- **Ilustración**: el paisaje del hero, las bolsas de café y el gráfico de altitud son SVG dibujado a mano en código. Nubes animadas y un sello de cosecha.
- **Modo oscuro** completo, con su propia paleta, no una simple inversión.

## Interacciones

- **Configurador de suscripción**: café, tamaño, frecuencia y molienda, con precio por envío y estimado mensual en vivo.
- **Guía de preparación** con pestañas accesibles (flechas del teclado) y **temporizador** con barra de progreso para V60, prensa francesa y espresso.
- **Gráfico de altitud** que se dibuja al entrar en pantalla, cifras que cuentan hacia arriba y animaciones de entrada escalonadas.
- Botón **Elegir** en cada café, que lleva al configurador con ese café seleccionado.

## Calidad

- HTML semántico, enlace para saltar al contenido, foco visible y roles ARIA en pestañas y barra de progreso.
- Respeta `prefers-reduced-motion` y `prefers-color-scheme`.
- Responsive de 320 px a pantallas anchas, sin desborde horizontal.

## Estructura

```
index.html   estructura y contenido
estilo.css   sistema visual (variables, tipografía, layout, modo oscuro)
app.js       catálogo, configurador, guía con temporizador y animaciones
```

> Marca, precios y testimonios ficticios, creados para este proyecto de portafolio.
