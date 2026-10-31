
const EMAIL = "jlopezj26@miumg.edu.gt";
const P = [
  { id: 1, ref: "FR-1001", n: "Pastillas de freno delanteras", t: "Frenos", marca: "Toyota", mod: "Corolla", y: "2014–2019", s: 24, p: 38, f: "Presionan el disco al frenar y convierten el movimiento en fricción para detener el vehículo." },
  { id: 2, ref: "MO-2014", n: "Filtro de aceite", t: "Motor", marca: "Honda", mod: "Civic", y: "2016–2021", s: 58, p: 50, f: "Retiene partículas y residuos del aceite para proteger las piezas internas del motor." },
  { id: 3, ref: "EL-3007", n: "Batería 12V 60Ah", t: "Eléctrico", marca: "Universal", mod: "Sedán y SUV compactos", y: "2010–2024", s: 9, p: 95, f: "Entrega la energía para el arranque y alimenta los sistemas eléctricos con el motor apagado." },
  { id: 4, ref: "SU-4012", n: "Amortiguador delantero", t: "Suspensión", marca: "Nissan", mod: "Sentra", y: "2013–2019", s: 0, p: 62, f: "Controla el rebote de los resortes para mantener las llantas en contacto con el suelo." },
  { id: 5, ref: "EN-5003", n: "Bujías de iridio (juego de 4)", t: "Encendido", marca: "Hyundai", mod: "Elantra", y: "2015–2020", s: 31, p: 44, f: "Producen la chispa que enciende la mezcla de aire y combustible en cada cilindro." },
  { id: 6, ref: "MO-2020", n: "Filtro de aire", t: "Motor", marca: "Toyota", mod: "Hilux", y: "2016–2022", s: 17, p: 16, f: "Limpia el aire que entra al motor para una combustión eficiente y sin polvo." },
  { id: 7, ref: "MO-2031", n: "Correa de distribución", t: "Motor", marca: "Kia", mod: "Rio", y: "2012–2017", s: 5, p: 52, f: "Sincroniza el giro del cigüeñal y el árbol de levas para abrir y cerrar las válvulas a tiempo." },
  { id: 8, ref: "RE-6002", n: "Radiador", t: "Refrigeración", marca: "Chevrolet", mod: "Aveo", y: "2010–2016", s: 3, p: 130, f: "Disipa el calor del líquido refrigerante para evitar que el motor se sobrecaliente." },
  { id: 9, ref: "EL-3022", n: "Alternador 90A", t: "Eléctrico", marca: "Suzuki", mod: "Swift", y: "2011–2017", s: 6, p: 175, f: "Genera electricidad con el motor encendido para cargar la batería y alimentar el vehículo." },
  { id: 10, ref: "FR-1015", n: "Discos de freno ventilados (par)", t: "Frenos", marca: "Mazda", mod: "Mazda 3", y: "2014–2018", s: 12, p: 88, f: "Superficie metálica contra la que actúan las pastillas; sus canales internos disipan el calor." }
];
const $ = s => document.querySelector(s), app = $("#app"), qi = $("#q");
let cat = "Todos";
const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const stock = s => s === 0 ? ["out", "Agotado"] : s <= 10 ? ["low", "Quedan " + s] : ["ok", "En stock (" + s + ")"];
const money = v => "Q" + v.toFixed(2);
function mail(sub, body) { location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(sub) + "&body=" + encodeURIComponent(body) }
function list() {
  const q = norm(qi.value.trim());
  return P.filter(x => (cat === "Todos" || x.t === cat) && (!q || norm([x.n, x.t, x.marca, x.mod, x.y, x.ref].join(" ")).includes(q)));
}
function grid() {
  const r = list(), g = $("#grid"); if (!g) return;
  g.innerHTML = r.length ? r.map(x => { const [c, l] = stock(x.s); return `<a class="card" href="#repuesto-${x.id}"><span class="ref">Ref. ${x.ref}</span><h3>${x.n}</h3><p>${x.marca} ${x.mod} · ${x.y}</p><div class="foot"><span class="price">${money(x.p)}</span><span class="tag ${c}">${l}</span></div></a>` }).join("") :
    `<div class="empty" style="grid-column:1/-1"><p><strong>No encontramos ese repuesto.</strong><br>Prueba con otra palabra o pídelo por correo y lo buscamos por ti.</p><a class="btn" href="#pedido">Pedir un repuesto</a></div>`;
  $("#count").textContent = r.length + (r.length === 1 ? " repuesto" : " repuestos");
}
function catalogo() {
  const types = ["Todos", ...new Set(P.map(x => x.t))];
  app.innerHTML = `<div class="intro"><h1>Catálogo de repuestos</h1><p>Filtra por tipo, busca por marca o modelo y abre cada pieza para ver su compatibilidad, stock y función.</p></div>
  <div class="chips" role="group" aria-label="Filtrar por tipo">${types.map(t => `<button class="chip" aria-pressed="${t === cat}" data-t="${t}">${t}</button>`).join("")}</div>
  <p class="note" id="count" aria-live="polite"></p><div class="grid" id="grid"></div>`;
  app.querySelectorAll(".chip").forEach(b => b.onclick = () => { cat = b.dataset.t; catalogo() });
  grid();
}
function detalle(id) {
  const x = P.find(p => p.id === id); if (!x) { location.hash = "catalogo"; return }
  const [c, l] = stock(x.s);
  app.innerHTML = `<a class="back" href="#catalogo">← Volver al catálogo</a>
  <div class="detail"><div class="panel"><span class="ref">Ref. ${x.ref}</span><h1>${x.n}</h1>
  <span class="tag ${c}">${l}</span>
  <h2 style="font-size:24px;margin:22px 0 6px">Funcionamiento principal</h2><p style="margin:0">${x.f}</p>
  <div class="actions"><button class="btn" id="ped">Pedir este repuesto por correo</button><a class="btn alt" href="#opiniones">Reportar un problema</a></div>
  ${x.s === 0 ? '<p class="note">Está agotado ahora, pero puedes pedirlo y te avisamos cuando llegue.</p>' : ''}</div>
  <div class="panel"><h2 style="font-size:24px;margin-bottom:6px">Ficha técnica</h2><table class="specs">
  <tr><th>Tipo</th><td>${x.t}</td></tr><tr><th>Marca compatible</th><td>${x.marca}</td></tr><tr><th>Modelo</th><td>${x.mod}</td></tr>
  <tr><th>Año</th><td>${x.y}</td></tr><tr><th>Stock</th><td>${x.s} unidades</td></tr><tr><th>Precio</th><td>${money(x.p)}</td></tr></table></div></div>`;
  $("#ped").onclick = () => mail("Pedido: " + x.n + " (" + x.ref + ")", "Hola, quiero pedir este repuesto:\n\n" + x.n + " – Ref. " + x.ref + "\nCompatible con: " + x.marca + " " + x.mod + " " + x.y + "\nCantidad: 1\n\nMi nombre:\nMi teléfono:\n");
}
function pedido() {
  app.innerHTML = `<div class="intro"><h1>Pedir un repuesto</h1><p>¿No lo ves en el catálogo? Cuéntanos qué necesitas y te respondemos con precio y disponibilidad.</p></div>
  <form id="f1"><label>Tu nombre<input name="n" required></label>
  <label>Repuesto que necesitas<input name="r" required placeholder="Ej. Bomba de agua"></label>
  <label>Marca, modelo y año del vehículo<input name="v" required placeholder="Ej. Toyota Yaris 2017"></label>
  <label>Mensaje (opcional)<textarea name="m"></textarea></label>
  <button class="btn" type="submit">Enviar pedido por correo</button>
  <p class="note">Se abrirá tu programa de correo con el mensaje listo para enviar.</p></form>`;
  $("#f1").onsubmit = e => {
    e.preventDefault(); const d = new FormData(e.target);
    mail("Pedido: " + d.get("r"), "Nombre: " + d.get("n") + "\nRepuesto: " + d.get("r") + "\nVehículo: " + d.get("v") + "\n\n" + d.get("m"))
  };
}
function opiniones() {
  app.innerHTML = `<div class="intro"><h1>Opiniones y reportes</h1><p>Cuéntanos cómo fue tu compra o avísanos si algo falló en un repuesto o en la página.</p></div>
  <form id="f2"><label>Tipo de mensaje<select name="t"><option>Opinión</option><option>Reporte de problema</option><option>Sugerencia</option></select></label>
  <label>Tu nombre<input name="n" required></label>
  <label>Repuesto relacionado (opcional)<select name="p"><option value="">Ninguno</option>${P.map(x => `<option>${x.n} (${x.ref})</option>`).join("")}</select></label>
  <label>Tu mensaje<textarea name="m" required></textarea></label>
  <button class="btn" type="submit">Enviar mensaje</button><div id="msg" aria-live="polite"></div></form>`;
  $("#f2").onsubmit = e => {
    e.preventDefault(); const d = new FormData(e.target);
    $("#msg").innerHTML = '<p class="ok-msg">Listo, abrimos tu correo con el mensaje. Envíalo para que nos llegue.</p>';
    mail(d.get("t") + " de " + d.get("n"), "Tipo: " + d.get("t") + "\nNombre: " + d.get("n") + "\nRepuesto: " + (d.get("p") || "—") + "\n\n" + d.get("m"))
  };
}
function route() {
  const h = location.hash.slice(1) || "catalogo", m = h.match(/^repuesto-(\d+)$/);
  document.querySelectorAll("nav a").forEach(a => a.removeAttribute("aria-current"));
  const k = m ? "catalogo" : h; const n = $("#n-" + k); if (n) n.setAttribute("aria-current", "page");
  window.scrollTo(0, 0);
  if (m) detalle(+m[1]); else if (h === "pedido") pedido(); else if (h === "opiniones") opiniones(); else catalogo();
}
qi.addEventListener("input", () => { if ((location.hash || "#catalogo") !== "#catalogo") { location.hash = "catalogo"; setTimeout(grid, 0) } else grid() });
addEventListener("hashchange", route); route();
