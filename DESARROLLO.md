# Notas de desarrollo · Altura (café de especialidad)

Guía para retomar el proyecto: cómo está armado, por qué y cómo cambiarlo.

## Puesta en marcha

Sitio estático sin build ni dependencias. Para verlo con las fuentes y sin restricciones del navegador:

```bash
python -m http.server 8000      # o: npx serve .
```

Se publica con GitHub Pages desde la raíz de la rama principal: subir a `main` actualiza el sitio en uno o dos minutos.

## Archivos

| Archivo | Contenido |
|---|---|
| `index.html` | Secciones: hero con paisaje SVG, origen y gráfico de altitud, catálogo, configurador de suscripción, guía de preparación, testimonios y pie |
| `estilo.css` | Variables de diseño (`:root`), modo oscuro (`prefers-color-scheme`), tipografía, layout por sección, animaciones y `prefers-reduced-motion` |
| `app.js` | Datos (`CAFES`, `METODOS`), render del catálogo y del configurador, cálculo de precios, pestañas con temporizador y animaciones al hacer scroll |

## Sistema visual

Todos los colores salen de variables en `estilo.css`; el modo oscuro **redefine las mismas variables**, así que ningún componente necesita reglas propias para el tema.

| Variable | Uso |
|---|---|
| `--crema`, `--crema-2`, `--papel` | Fondos (de más claro a tarjeta) |
| `--tinta`, `--tinta-2` | Texto principal y secundario |
| `--verde`, `--musgo` | Marca y acentos de la montaña |
| `--terracota` | Acento principal (itálicas de titulares, botones) |
| `--dorado` | Detalles (sello, Geisha) |
| `--radio`, `--serif` (Gloock), `--sans` (Figtree) | Forma y tipografía |

## Cómo funciona `app.js`

- **Catálogo:** `renderCafes()` dibuja una tarjeta por elemento de `CAFES`, con la bolsa generada por `bolsaSVG(cafe)` usando su `color`. El botón **Elegir** (`data-cafe`) selecciona ese café en el configurador y hace scroll hasta él.
- **Configurador:** `renderConfigurador()` crea las opciones; `calcular()` se ejecuta en cada `input` y muestra el precio por envío y el estimado mensual (con `DESCUENTO` del 15 % para la suscripción).
- **Guía de preparación:** pestañas con el patrón ARIA (flechas izquierda y derecha, `aria-selected`). `mostrar()` pinta la receta y los pasos de `METODOS`; si el método tiene `segundos > 0` aparece el temporizador con barra de progreso (`role="progressbar"`).
- **Animaciones:** `observar()` usa `IntersectionObserver` para revelar secciones, dibujar el gráfico de altitud y contar cifras (`animarCifra`). Con `prefers-reduced-motion` se muestran directamente en su estado final.

## Cómo extenderlo

- **Nuevo café:** agregar un objeto a `CAFES` (`id`, `nombre`, `proceso`, `notas`, `tueste` del 1 al 5, `precio`, `color`, `insignia` opcional). Aparece en el catálogo y en el configurador.
- **Nuevo método de preparación:** agregar una entrada a `METODOS` con `receta` (pares valor y descripción), `segundos` (0 si no lleva temporizador) y `pasos`.
- **Cambiar la paleta:** editar las variables de `:root` y su bloque de modo oscuro.

## Pendientes

- El formulario de suscripción no envía datos: es una demostración.
- Las ilustraciones SVG están en línea dentro de `index.html`; si crecen, convendría moverlas a archivos.

> Marca, precios y testimonios ficticios.
