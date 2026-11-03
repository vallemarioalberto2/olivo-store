# 🌿 Olivo Store

Demo inicial de la tienda en línea **Olivo Store**, dedicada a la venta y promoción de accesorios y joyería. Diseño con paleta base en **verde olivo**.

## Características del demo

- Página de inicio con hero, beneficios, categorías, productos, "Nosotros" y newsletter.
- Catálogo de ejemplo con filtros por categoría (collares, aretes, pulseras y anillos).
- Carrito lateral funcional (agregar, quitar, cambiar cantidades y total). Se guarda en `localStorage`.
- "Finalizar compra" abre WhatsApp con el resumen del pedido (productos, cantidades y total). Configura el número en `WHATSAPP_NUMBER`, al inicio de `js/main.js`, en formato `52` + 10 dígitos (por ejemplo `525512345678`).
- Diseño responsive (móvil, tablet y escritorio).
- Sin dependencias ni proceso de build: HTML, CSS y JavaScript puros.

## Paleta de colores

| Color | Hex | Uso |
|-------|-----|-----|
| Olivo base | `#6B705C` | Botones, acentos principales |
| Olivo oscuro | `#3F4238` | Títulos, barra de anuncio |
| Olivo profundo | `#2F3225` | Footer |
| Olivo claro | `#A5A58D` / `#D6D8C3` | Bordes, detalles |
| Olivo muy claro | `#E8EDD9` | Fondos suaves |
| Crema | `#F6F2E8` | Fondo general |
| Dorado | `#C9A66B` | Acentos y llamadas a la acción |

Las variables están definidas en `:root` dentro de `css/styles.css`.

## Estructura

```
olivo-store/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── img/
│   └── productos/      ← aquí van las fotos de los productos
├── README.md
└── .gitignore
```

## Cómo agregar fotos de productos

1. Guarda la imagen en `img/productos/` (por ejemplo `collar-hoja-olivo.jpg`).
2. En `js/main.js`, dentro de `PRODUCTS`, escribe la ruta en el campo `img` del producto:
   ```js
   { id: 1, name: "Collar Hoja de Olivo", cat: "collares", price: 349, tone: "#E8EDD9", img: "img/productos/collar-hoja-olivo.jpg" }
   ```
3. Guarda, haz commit y push. Si el archivo no existe o la ruta está mal escrita, se muestra el ícono de la categoría en su lugar.

Recomendaciones:
- Formato **cuadrado** (por ejemplo 800 × 800 px); si no lo es, la imagen se recorta al centro.
- Usa `.jpg` o `.webp` y procura que cada foto pese menos de 200 KB para que la página cargue rápido.
- Usa nombres en minúsculas, sin espacios ni acentos. GitHub Pages distingue mayúsculas de minúsculas: `Collar.JPG` y `collar.jpg` son archivos distintos.
- Para agregar un producto nuevo, copia una línea de `PRODUCTS` y cambia el `id` por un número que no se repita.

## Cómo ejecutarlo

Abre `index.html` en tu navegador, o levanta un servidor local:

```bash
python3 -m http.server 8000
# luego visita http://localhost:8000
```

## Subir a GitHub

```bash
cd olivo-store
git init
git add .
git commit -m "Primer demo de Olivo Store"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/olivo-store.git
git push -u origin main
```

### Publicar con GitHub Pages (opcional)

1. En el repositorio, ve a **Settings → Pages**.
2. En *Source* elige **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
3. Guarda y en unos minutos tendrás tu sitio en `https://TU_USUARIO.github.io/olivo-store/`.

## Próximos pasos sugeridos

- Reemplazar los íconos por fotografías reales de los productos (carpeta `img/`).
- Mover el catálogo a un archivo `products.json` o a una API.
- Conectar una pasarela de pago (Stripe, Mercado Pago, etc.).
- Agregar páginas de detalle de producto, contacto y política de envíos.
- Agregar logo definitivo y favicon.

## Licencia

Proyecto en desarrollo. Todos los derechos reservados © Olivo Store.
