/* ============================
   Olivo Store · Lógica del demo
   ============================ */

// ---------- Configuración de WhatsApp ----------
// Número en formato internacional, solo dígitos: 52 + lada y número a 10 dígitos.
// Ejemplo: "525512345678". Cámbialo por el número real de la tienda.
const WHATSAPP_NUMBER = "520000000000";

// Catálogo de ejemplo (reemplazar por datos reales o una API)
//
// Para agregar la foto de un producto:
//   1. Guarda la imagen en la carpeta  img/productos/
//   2. Escribe su ruta en el campo "img" (respeta mayúsculas, minúsculas y la extensión).
// Si "img" está vacío o el archivo no existe, se muestra un ícono de la categoría.
const PRODUCTS = [
  { id: 1,  name: "Collar Hoja de Olivo",     cat: "collares", price: 349, tone: "#E8EDD9", badge: "Nuevo", img: "img/productos/olivo1.png" },
  { id: 2,  name: "Collar Luna Dorada",       cat: "collares", price: 289, tone: "#F3E8CF", img: "img/productos/olivo2.png" },
  { id: 3,  name: "Collar Perla Natural",     cat: "collares", price: 419, tone: "#DDE2CC", img: "img/productos/olivo3.png" },
  { id: 4,  name: "Aretes Argolla Fina",      cat: "aretes",   price: 199, tone: "#F3E8CF", badge: "Top",   img: "img/productos/olivo4.png" },
  { id: 5,  name: "Aretes Gota Olivo",        cat: "aretes",   price: 259, tone: "#E8EDD9", img: "img/productos/olivo1.png" },
  { id: 6,  name: "Aretes Botón Perla",       cat: "aretes",   price: 179, tone: "#DDE2CC", img: "img/productos/olivo2.png" },
  { id: 7,  name: "Pulsera Cadena Sutil",     cat: "pulseras", price: 229, tone: "#E8EDD9", img: "img/productos/olivo3.png" },
  { id: 8,  name: "Pulsera Trenzada",         cat: "pulseras", price: 189, tone: "#F3E8CF", badge: "Nuevo", img: "img/productos/olivo4.png" },
  { id: 9,  name: "Pulsera Dijes Hojas",      cat: "pulseras", price: 319, tone: "#DDE2CC", img: "img/productos/olivo1.png" },
  { id: 10, name: "Anillo Minimal Dorado",    cat: "anillos",  price: 159, tone: "#F3E8CF", img: "img/productos/olivo2.png" },
  { id: 11, name: "Anillo Piedra Verde",      cat: "anillos",  price: 279, tone: "#E8EDD9", badge: "Top",   img: "img/productos/olivo3.png" },
  { id: 12, name: "Set de Anillos Apilables", cat: "anillos",  price: 349, tone: "#DDE2CC", img: "img/productos/olivo4.png" }
];

// Íconos SVG simples por categoría (se usan cuando un producto aún no tiene foto)
const ICONS = {
  collares: `<svg viewBox="0 0 100 100" fill="none" stroke="#A9854A" stroke-width="3" stroke-linecap="round"><path d="M18 22c0 34 14 50 32 50s32-16 32-50"/><circle cx="50" cy="78" r="8" fill="#C9A66B"/></svg>`,
  aretes:   `<svg viewBox="0 0 100 100" fill="none" stroke="#A9854A" stroke-width="3" stroke-linecap="round"><circle cx="50" cy="22" r="6"/><path d="M50 28v18"/><path d="M50 46c-12 8-12 26 0 34 12-8 12-26 0-34Z" fill="#C9A66B"/></svg>`,
  pulseras: `<svg viewBox="0 0 100 100" fill="none" stroke="#A9854A" stroke-width="3" stroke-linecap="round"><ellipse cx="50" cy="50" rx="34" ry="26"/><ellipse cx="50" cy="50" rx="34" ry="26" stroke="#C9A66B" stroke-dasharray="2 8" stroke-width="6"/></svg>`,
  anillos:  `<svg viewBox="0 0 100 100" fill="none" stroke="#A9854A" stroke-width="5" stroke-linecap="round"><circle cx="50" cy="58" r="24"/><path d="M42 30l8-10 8 10-8 8Z" fill="#C9A66B" stroke-width="3"/></svg>`
};

const CAT_LABEL = { collares: "Collar", aretes: "Aretes", pulseras: "Pulsera", anillos: "Anillo" };

// Utilidades
const money = (n) => "$" + n.toLocaleString("es-MX") + " MXN";
const $ = (sel) => document.querySelector(sel);

// Foto del producto; si no hay imagen, usa el ícono de la categoría
const escapeAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
// queued = true: la foto no se descarga sola; la descarga loadImagesInOrder() por turnos.
function mediaHTML(p, queued = false) {
  if (!p.img) return ICONS[p.cat];
  const src = escapeAttr(p.img), name = escapeAttr(p.name);
  return queued
    ? `<img alt="" data-src="${src}" data-name="${name}" data-cat="${p.cat}" decoding="async" />`
    : `<img src="${src}" alt="${name}" data-cat="${p.cat}" decoding="async" />`;
}

// Descarga las fotos del catálogo por turnos: primero las 4 que se ven al abrir la página y
// luego el resto. Si todas se pidieran a la vez, compartirían la conexión y ninguna
// terminaría hasta el final (en ese caso parece que las fotos "esperan" a que hagas clic).
function loadImagesInOrder(root, firstBatch = 4) {
  const imgs = [...root.querySelectorAll("img[data-src]")];
  const start = (img) => new Promise((done) => {
    if (!img.isConnected) return done();            // el catálogo ya se volvió a dibujar
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
    img.alt = img.dataset.name || "";
    img.src = img.dataset.src;
  });
  const firstRow = Promise.all(imgs.slice(0, firstBatch).map(start));
  const timeout = new Promise((done) => setTimeout(done, 6000)); // por si alguna se queda colgada
  Promise.race([firstRow, timeout]).then(() => imgs.slice(firstBatch).forEach(start));
}

// Si una imagen no carga, reintenta una vez; si vuelve a fallar (archivo faltante o
// ruta mal escrita), se muestra el ícono de la categoría
document.addEventListener("error", (e) => {
  const img = e.target;
  if (!img || img.tagName !== "IMG" || !img.dataset.cat) return;
  if (!img.dataset.retry) {
    img.dataset.retry = "1";
    const src = img.getAttribute("src");
    img.src = src + (src.includes("?") ? "&" : "?") + "r=" + Date.now();
    return;
  }
  img.insertAdjacentHTML("afterend", ICONS[img.dataset.cat] || "");
  img.remove();
}, true);

// Estado del carrito (se guarda en localStorage)
let cart = [];
try { cart = JSON.parse(localStorage.getItem("olivo-cart")) || []; } catch (e) { cart = []; }
const saveCart = () => { try { localStorage.setItem("olivo-cart", JSON.stringify(cart)); } catch (e) {} };

/* ---------- Productos ---------- */
function renderProducts(filter = "todos") {
  const grid = $("#productGrid");
  const list = filter === "todos" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === filter);
  grid.innerHTML = list.map((p) => `
    <article class="card">
      <div class="card__media" style="background:${p.tone}">
        ${p.badge ? `<span class="card__badge">${p.badge}</span>` : ""}
        ${mediaHTML(p, true)}
      </div>
      <div class="card__body">
        <span class="card__cat">${CAT_LABEL[p.cat]}</span>
        <h3 class="card__title">${p.name}</h3>
        <span class="card__price">${money(p.price)}</span>
        <button class="card__btn" data-add="${p.id}">Agregar al carrito</button>
      </div>
    </article>
  `).join("");
  loadImagesInOrder(grid);
}

function setFilter(filter) {
  document.querySelectorAll(".chip").forEach((c) =>
    c.classList.toggle("is-active", c.dataset.filter === filter)
  );
  renderProducts(filter);
}

/* ---------- Carrito ---------- */
function renderCart() {
  const box = $("#cartItems");
  if (!cart.length) {
    box.innerHTML = `<p class="cart__empty">Tu carrito está vacío.<br/>¡Descubre nuestras piezas!</p>`;
  } else {
    box.innerHTML = cart.map((item) => {
      const p = PRODUCTS.find((x) => x.id === item.id);
      if (!p) return "";
      return `
        <div class="cart-item">
          <div class="cart-item__thumb" style="background:${p.tone}">${mediaHTML(p)}</div>
          <div>
            <h4>${p.name}</h4>
            <small>${money(p.price)}</small>
            <div class="qty">
              <button data-dec="${p.id}" aria-label="Quitar uno">−</button>
              <span>${item.qty}</span>
              <button data-inc="${p.id}" aria-label="Agregar uno">+</button>
            </div>
          </div>
          <button class="cart-item__remove" data-remove="${p.id}" aria-label="Eliminar">✕</button>
        </div>`;
    }).join("");
  }
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => {
    const p = PRODUCTS.find((x) => x.id === i.id);
    return s + (p ? p.price * i.qty : 0);
  }, 0);
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = money(total);
  saveCart();
}

function addToCart(id) {
  const found = cart.find((i) => i.id === id);
  if (found) found.qty++; else cart.push({ id, qty: 1 });
  renderCart();
  openCart();
}
function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
  renderCart();
}
function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  renderCart();
}

function openCart() {
  $("#cart").classList.add("is-open");
  $("#overlay").classList.add("is-open");
  $("#cart").setAttribute("aria-hidden", "false");
}
function closeCart() {
  $("#cart").classList.remove("is-open");
  $("#overlay").classList.remove("is-open");
  $("#cart").setAttribute("aria-hidden", "true");
}

/* ---------- Eventos ---------- */
document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) return addToCart(Number(add.dataset.add));

  const inc = e.target.closest("[data-inc]");
  if (inc) return changeQty(Number(inc.dataset.inc), 1);

  const dec = e.target.closest("[data-dec]");
  if (dec) return changeQty(Number(dec.dataset.dec), -1);

  const rem = e.target.closest("[data-remove]");
  if (rem) return removeFromCart(Number(rem.dataset.remove));

  const chip = e.target.closest(".chip");
  if (chip) return setFilter(chip.dataset.filter);

  const cat = e.target.closest(".cat");
  if (cat) return setFilter(cat.dataset.filter);
});

$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });

// Arma el resumen del pedido y abre WhatsApp con el mensaje listo para enviar
function buildWhatsAppMessage() {
  let total = 0;
  const lines = cart.map((item) => {
    const p = PRODUCTS.find((x) => x.id === item.id);
    if (!p) return null;
    const subtotal = p.price * item.qty;
    total += subtotal;
    return `• ${item.qty} x ${p.name} - ${money(subtotal)}`;
  }).filter(Boolean);

  return [
    "¡Hola, Olivo Store! Me interesan estos productos:",
    "",
    ...lines,
    "",
    `Total: ${money(total)}`,
    "",
    "¿Me ayudan a confirmar disponibilidad, envío y forma de pago? Gracias."
  ].join("\n");
}

$("#checkoutBtn").addEventListener("click", () => {
  if (!cart.length) {
    alert("Agrega productos a tu carrito primero.");
    return;
  }
  if (WHATSAPP_NUMBER === "520000000000") {
    alert("Falta configurar el número de WhatsApp en js/main.js (WHATSAPP_NUMBER).");
    return;
  }
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage())}`;
  window.open(url, "_blank", "noopener");
});

// Menú móvil
const menuBtn = $("#menuBtn");
const nav = $("#nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuBtn.setAttribute("aria-expanded", String(open));
});
nav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    nav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});

// Newsletter (solo validación en el demo)
$("#newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = $("#email");
  const msg = $("#formMsg");
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
  msg.textContent = ok ? "¡Gracias por suscribirte! 🌿" : "Ingresa un correo válido.";
  if (ok) email.value = "";
});

/* ---------- Inicio ---------- */
$("#year").textContent = new Date().getFullYear();
renderProducts();
renderCart();