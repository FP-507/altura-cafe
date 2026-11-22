// Interacciones del sitio de Altura: catálogo, configurador de suscripción, guía con temporizador y animaciones.
const CAFES = [
  { id: "geisha", nombre: "Geisha", proceso: "Lavado · 1 750 m", notas: ["Jazmín", "Bergamota", "Durazno"], tueste: 1, precio: 24, insignia: "86 pts",
    color: "#c99a4b" },
  { id: "catuai", nombre: "Catuaí", proceso: "Honey · 1 650 m", notas: ["Panela", "Naranja", "Cacao"], tueste: 3, precio: 15, color: "#b5492f" },
  { id: "typica", nombre: "Typica", proceso: "Natural · 1 700 m", notas: ["Fresa", "Vino tinto", "Chocolate"], tueste: 4, precio: 17, color: "#6b7a52" },
];
const METODOS = {
  V60: { receta: [["15 g", "café, molienda media"], ["250 ml", "agua a 93 °C"], ["1:16", "proporción"], ["3:00", "tiempo total"]], segundos: 180,
    pasos: ["Enjuaga el filtro con agua caliente y descarta esa agua.", "Vierte 40 ml para el bloom y espera 30 segundos.", "Vierte en espiral hasta 150 ml.", "Completa hasta 250 ml y deja que drene."] },
  Prensa: { receta: [["30 g", "café, molienda gruesa"], ["500 ml", "agua a 94 °C"], ["1:16", "proporción"], ["4:00", "tiempo de infusión"]], segundos: 240,
    pasos: ["Agrega el café y toda el agua.", "Remueve suave tres veces.", "Tapa sin presionar y espera 4 minutos.", "Presiona lento y sirve de inmediato."] },
  Espresso: { receta: [["18 g", "café, molienda fina"], ["36 g", "bebida en taza"], ["1:2", "proporción"], ["0:28", "extracción"]], segundos: 28,
    pasos: ["Distribuye y apisona el café de forma pareja.", "Purga el grupo y coloca el portafiltro.", "Extrae hasta obtener 36 g.", "Si sale ácido, muele más fino; si sale amargo, más grueso."] },
  "Cold brew": { receta: [["100 g", "café, molienda gruesa"], ["1 L", "agua fría"], ["1:10", "proporción"], ["16 h", "en la nevera"]], segundos: 0,
    pasos: ["Mezcla café y agua en un frasco.", "Refrigera entre 14 y 18 horas.", "Cuela con filtro de papel.", "Sirve con hielo; diluye 1:1 si lo prefieres suave."] },
};
const DESCUENTO = 0.15;
const $ = (s, r = document) => r.querySelector(s);

function bolsaSVG(c) {
  return `<svg viewBox="0 0 120 170" aria-hidden="true">
    <path d="M22 26 L98 26 L106 160 Q60 168 14 160 Z" fill="#f6efe3"/>
    <path d="M22 26 L98 26 L94 12 L26 12 Z" fill="#e3d6c1"/>
    <rect x="30" y="70" width="60" height="58" rx="6" fill="${c.color}"/>
    <path d="M40 112 L54 88 L62 100 L68 92 L80 112 Z" fill="#f6efe3" opacity=".9"/>
    <text x="60" y="56" text-anchor="middle" font-family="Gloock, serif" font-size="13" fill="#1f2a1f">ALTURA</text>
  </svg>`;
}

function renderCafes() {
  $("#cafes-grid").innerHTML = CAFES.map((c) => `
    <article class="cafe revelar">
      ${c.insignia ? `<span class="insignia">${c.insignia}</span>` : ""}
      <div class="bolsa">${bolsaSVG(c)}</div>
      <p class="proceso">${c.proceso}</p>
      <h3>${c.nombre}</h3>
      <ul class="notas" aria-label="Notas de cata">${c.notas.map((n) => `<li>${n}</li>`).join("")}</ul>
      <div class="tueste"><span>Tueste ${["", "claro", "claro-medio", "medio", "medio-oscuro", "oscuro"][c.tueste]}</span>
        <div class="tueste-barra" aria-hidden="true">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= c.tueste ? "on" : ""}"></i>`).join("")}</div></div>
      <div class="fila"><span class="valor">$${c.precio}<small style="font-size:14px;font-family:Figtree"> / 250 g</small></span>
        <a class="boton boton-chico elegir" href="#suscripcion" data-cafe="${c.id}">Elegir</a></div>
    </article>`).join("");
  document.querySelectorAll("[data-cafe]").forEach((a) => a.addEventListener("click", () => {
    const radio = document.querySelector(`input[name="cafe"][value="${a.dataset.cafe}"]`);
    radio.checked = true;
    calcular();
  }));
}

function renderConfigurador() {
  $("#op-cafe").innerHTML = CAFES.map((c, i) => `
    <label><input type="radio" name="cafe" value="${c.id}" ${i === 1 ? "checked" : ""}><span>${c.nombre}<small>$${c.precio} / 250 g</small></span></label>`).join("");
  $("#configurador").addEventListener("input", calcular);
  $("#configurador").addEventListener("submit", (e) => {
    e.preventDefault();
    $("#nota-envio").textContent = "¡Listo! Esto es una demostración: no se realizó ningún cobro.";
  });
  calcular();
}

function calcular() {
  const f = $("#configurador");
  const cafe = CAFES.find((c) => c.id === f.cafe.value);
  const gramos = +f.tamano.value, semanas = +f.frecuencia.value;
  const factor = { 250: 1, 500: 1.9, 1000: 3.6 }[gramos];       // más barato por gramo en bolsas grandes
  const porEnvio = Math.round(cafe.precio * factor * (1 - DESCUENTO) * 100) / 100;
  const mensual = porEnvio * (4.33 / semanas);
  $("#precio").textContent = `$${porEnvio.toFixed(2)}`;
  const freq = { 1: "cada semana", 2: "cada 2 semanas", 4: "cada mes" }[semanas];
  const tamano = gramos === 1000 ? "1 kg" : `${gramos} g`;
  $("#detalle-plan").textContent = `${cafe.nombre} · ${tamano} · ${freq} · ${f.molienda.value.toLowerCase()} — unos $${mensual.toFixed(2)} al mes`;
}

// ---------- guía de preparación ----------
let intervalo = null;
function renderMetodos() {
  const nombres = Object.keys(METODOS);
  $("#pestanas").innerHTML = nombres.map((n, i) =>
    `<button role="tab" id="tab-${i}" aria-selected="${i === 0}" aria-controls="metodo" tabindex="${i === 0 ? 0 : -1}">${n}</button>`).join("");
  const tabs = [...document.querySelectorAll("#pestanas button")];
  tabs.forEach((b, i) => {
    b.addEventListener("click", () => elegir(i));
    b.addEventListener("keydown", (e) => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (d) { const j = (i + d + tabs.length) % tabs.length; tabs[j].focus(); elegir(j); }
    });
  });
  function elegir(i) {
    tabs.forEach((b, j) => { b.setAttribute("aria-selected", j === i); b.tabIndex = j === i ? 0 : -1; });
    mostrar(nombres[i], i);
  }
  elegir(0);
}

function formato(s) { return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }

function mostrar(nombre, i) {
  clearInterval(intervalo);
  const m = METODOS[nombre];
  const panel = $("#metodo");
  panel.setAttribute("aria-labelledby", `tab-${i}`);
  panel.innerHTML = `
    <div class="receta">${m.receta.map(([v, t]) => `<div><strong>${v}</strong><span>${t}</span></div>`).join("")}</div>
    <div>
      <ol class="pasos">${m.pasos.map((p) => `<li>${p}</li>`).join("")}</ol>
      ${m.segundos ? `<div class="temporizador">
        <span class="reloj" aria-live="off">${formato(m.segundos)}</span>
        <div class="progreso" role="progressbar" aria-label="Progreso de la preparación" aria-valuemin="0" aria-valuemax="${m.segundos}" aria-valuenow="0"><i></i></div>
        <button class="boton boton-chico" type="button">Iniciar</button>
      </div>` : ""}
    </div>`;
  if (!m.segundos) return;
  const reloj = $(".reloj", panel), barra = $(".progreso", panel), boton = $("button", panel);
  let restante = m.segundos, corriendo = false;
  boton.addEventListener("click", () => {
    if (corriendo) { clearInterval(intervalo); corriendo = false; boton.textContent = "Continuar"; return; }
    if (restante === 0) restante = m.segundos;
    corriendo = true; boton.textContent = "Pausar";
    intervalo = setInterval(() => {
      restante--;
      reloj.textContent = formato(restante);
      const hecho = m.segundos - restante;
      barra.firstElementChild.style.width = `${(hecho / m.segundos) * 100}%`;
      barra.setAttribute("aria-valuenow", hecho);
      if (restante <= 0) { clearInterval(intervalo); corriendo = false; boton.textContent = "Repetir"; reloj.textContent = "¡Listo!"; }
    }, 1000);
  });
}

// ---------- animaciones ----------
function animarCifra(el) {
  const fin = +el.dataset.contar, t0 = performance.now(), dur = 1400;
  el.textContent = "0";
  const paso = (t) => {
    const p = Math.min(1, (t - t0) / dur), suave = 1 - (1 - p) ** 3;
    el.textContent = Math.round(fin * suave).toLocaleString("es-PA");
    if (p < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
}

function observar() {
  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const io = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      e.target.classList.add("visible");
      const cifra = e.target.querySelector("[data-contar]");
      if (cifra) reducido ? (cifra.textContent = (+cifra.dataset.contar).toLocaleString("es-PA")) : animarCifra(cifra);
      io.unobserve(e.target);
    }
  }, { threshold: 0.15 });
  document.querySelectorAll(".revelar").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    io.observe(el);
  });
  addEventListener("scroll", () => $("#nav").classList.toggle("solida", scrollY > 20), { passive: true });
}

renderCafes();
renderConfigurador();
renderMetodos();
observar();
