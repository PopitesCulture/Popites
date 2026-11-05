/* Paquet de booster : le sachet noir aux badges arc-en-ciel, et son ouverture en arrachant la bande du milieu.
   PAQUET.svg(nom) dessine un paquet ; PAQUET.ouvrir(élément, {nom, coince, fini}) y pose un paquet à ouvrir du doigt.
   coince : "L" ou "P" quand le booster cache une légendaire ou la Popites (la bande se bloque à mi-chemin). */
const PAQUET = (() => {
  const ICONS = {
    med:'<path d="M4.5 1.5h3v3h3v3h-3v3h-3v-3h-3v-3h3z"/>', pol:'<circle cx="5" cy="5" r="3.4"/><path d="M7.5 7.5 11 11"/>',
    fan:'<circle cx="6" cy="6" r="2.8"/><ellipse cx="6" cy="6" rx="5.4" ry="1.8" transform="rotate(-22 6 6)"/>', com:'<circle cx="6" cy="6" r="5"/><path d="M3.8 7.1q2.2 2.2 4.4 0M4.3 4.4v.6M7.7 4.4v.6"/>',
    shonen:'<path d="M6 11C3.2 11 2 8.6 3 6c.9 1 1.9.9 2-.9.1-1.8 1-3 2-4.1.2 2 3 3 3 5.9C10 9.3 8.6 11 6 11z"/>', seinen:'<path d="M3.4 8.6 10.6 1.4M1.6 7.4l3 3M2.2 9.8 1 11"/>',
    shojo:'<circle cx="6" cy="6" r="1.4"/><circle cx="6" cy="2.8" r="1.8"/><circle cx="9.2" cy="6" r="1.8"/><circle cx="6" cy="9.2" r="1.8"/><circle cx="2.8" cy="6" r="1.8"/>',
    sport:'<circle cx="6" cy="6" r="5"/><path d="M1 6h10M6 1c-2.4 3-2.4 7 0 10M6 1c2.4 3 2.4 7 0 10"/>', rapfr:'<rect x="4.2" y="1" width="3.6" height="6" rx="1.8"/><path d="M2.6 5.8a3.4 3.4 0 0 0 6.8 0M6 9.4V11M4.2 11h3.6"/>',
    pop:'<path d="M6 1l1.5 3.4 3.6.4-2.7 2.4.8 3.6L6 9 2.8 10.8l.8-3.6L.9 4.8l3.6-.4z"/>', rock:'<path d="M7.2 1 3 7h3.2L5 11l4.2-6.2H6z"/>',
    kpop:'<path d="M6 10.4C2.2 8 1.1 6 1.6 4.2 2.2 2.2 4.9 2 6 4c1.1-2 3.8-1.8 4.4.2.5 1.8-.6 3.8-4.4 6.2z"/>', disney:'<path d="M1.5 11V5.2L3 3.8l1.5 1.4V3l1.5-1.6L7.5 3v2.2L9 3.8l1.5 1.4V11zM5 11V8.4a1 1 0 0 1 2 0V11"/>',
    jv:'<rect x="1" y="3.4" width="10" height="5.6" rx="2.8"/><path d="M3.4 6.2h2M4.4 5.2v2"/><circle cx="8.4" cy="5.6" r=".5"/><circle cx="8.4" cy="6.9" r=".5"/>',
    anim:'<rect x="1.4" y="3.6" width="9.2" height="6.8" rx="1.3"/><path d="M4.4 1l1.6 2.6L7.6 1"/>', bd:'<path d="M2.2 1.8h7.6a1.2 1.2 0 0 1 1.2 1.2v4.4a1.2 1.2 0 0 1-1.2 1.2H6.2L3.4 11V8.6H2.2A1.2 1.2 0 0 1 1 7.4V3a1.2 1.2 0 0 1 1.2-1.2z"/>'
  };
  const RAINBOW = ["#ff3b3b", "#ff9a1a", "#ffe14a", "#36e07f", "#3b8bff", "#9a5cff", "#ff5fb0"];
  const stops = RAINBOW.map((c, i) => `<stop offset="${(i / 6).toFixed(2)}" stop-color="${c}"/>`).join("");

  /* éléments communs à tous les paquets, posés une seule fois dans la page */
  function defs(){
    if (document.getElementById("pk-defs")) return;
    const names = Object.keys(ICONS); let grid = "", k = 0;
    for (let r = 0; r * 14 < 342; r++) for (let c = 0; c * 14 < 210; c++) {
      if ((r + c) % 2) continue;                     // damier : une case sur deux
      grid += `<use href="#pk-i-${names[k++ % names.length]}" x="${c * 14 + 2}" y="${20 + r * 14}" width="8.5" height="8.5"/>`;
    }
    const div = document.createElement("div");
    div.innerHTML = `<svg id="pk-defs" width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
      <linearGradient id="pk-rb" gradientUnits="userSpaceOnUse" x1="0" y1="22" x2="200" y2="358">${stops}</linearGradient>
      <linearGradient id="pk-rbh" gradientUnits="userSpaceOnUse" x1="38" y1="0" x2="162" y2="0">${stops}</linearGradient>
      <linearGradient id="pk-bulge" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".7"/><stop offset=".09" stop-color="#fff" stop-opacity=".05"/><stop offset=".32" stop-color="#fff" stop-opacity=".13"/><stop offset=".5" stop-color="#fff" stop-opacity=".07"/><stop offset=".8" stop-color="#000" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".72"/></linearGradient>
      <linearGradient id="pk-pinch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".75"/><stop offset=".07" stop-color="#000" stop-opacity="0"/><stop offset=".93" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".75"/></linearGradient>
      <radialGradient id="pk-gloss" cx=".3" cy=".22" r=".45"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <linearGradient id="pk-crimp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2830"/><stop offset=".5" stop-color="#17161b"/><stop offset="1" stop-color="#0b0a0e"/></linearGradient>
      <linearGradient id="pk-crimpside" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset=".15" stop-color="#000" stop-opacity="0"/><stop offset=".35" stop-color="#fff" stop-opacity=".06"/><stop offset=".85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></linearGradient>
      <radialGradient id="pk-hush" gradientUnits="userSpaceOnUse" cx="100" cy="200" r="78" gradientTransform="translate(0 200) scale(1 .4) translate(0 -200)"><stop offset="0" stop-color="#0b0a0e" stop-opacity=".82"/><stop offset=".6" stop-color="#0b0a0e" stop-opacity=".5"/><stop offset="1" stop-color="#0b0a0e" stop-opacity="0"/></radialGradient>
      <linearGradient id="pk-sheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <clipPath id="pk-body"><path d="M12 22 C8.5 120 8.5 260 12 358 L188 358 C191.5 260 191.5 120 188 22 Z"/></clipPath>
      <mask id="pk-icons" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="380"><rect width="200" height="380" fill="#000"/><g fill="none" stroke="#fff" stroke-opacity=".72" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round">${grid}</g></mask>
      ${names.map(n => `<symbol id="pk-i-${n}" viewBox="0 0 12 12">${ICONS[n]}</symbol>`).join("")}
    </defs></svg>`;
    document.body.appendChild(div.firstChild);
  }

  function teeth(y0, y1, up){                         // soudure dentelée, striée, de la largeur du sachet
    let d = `M12 ${up ? y1 : y0}`;
    for (let x = 12, i = 0; x <= 188; x += 4, i++) d += ` L${x} ${up ? (i % 2 ? y0 + 2.2 : y0) : (i % 2 ? y1 - 2.2 : y1)}`;
    d += ` L188 ${up ? y1 : y0} Z`;
    let ridges = ""; for (let x = 14; x < 187; x += 2.6) ridges += `M${x.toFixed(1)} ${y0 + 4}V${y1 - 2}`;
    return `<path d="${d}" fill="url(#pk-crimp)"/><path d="${d}" fill="url(#pk-crimpside)"/><path d="${ridges}" stroke="#fff" stroke-opacity=".08" stroke-width=".8"/>
      <path d="M12 ${up ? y0 + 5 : y1 - 5}H188" stroke="#fff" stroke-opacity=".06" stroke-width=".8"/><path d="M12 ${up ? y1 : y0}H188" stroke="#000" stroke-opacity=".85" stroke-width="1.2"/>`;
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  /* un paquet : texte en pyramide (logo, catégorie, nombre de cartes) posé sur le motif */
  function svg(name){
    defs();
    return `<svg class="pk" viewBox="0 0 200 380" role="img" aria-label="Booster ${esc(name)}">
      ${teeth(3, 23, true)}${teeth(357, 377, false)}
      <g clip-path="url(#pk-body)">
        <rect x="0" y="20" width="200" height="340" fill="#0b0a0e"/>
        <rect x="0" y="20" width="200" height="340" fill="url(#pk-rb)" mask="url(#pk-icons)"/>
        <rect x="0" y="20" width="200" height="340" fill="url(#pk-bulge)"/><rect x="0" y="20" width="200" height="340" fill="url(#pk-pinch)"/>
        <rect x="0" y="20" width="200" height="340" fill="url(#pk-gloss)"/>
        <path d="M14 30q20 9 42 4M186 30q-20 9-42 4M14 350q20-9 42-4M186 350q-20-9-42-4" fill="none" stroke="#fff" stroke-opacity=".07" stroke-width="2"/>
        <rect x="0" y="20" width="200" height="340" fill="url(#pk-hush)"/>
        <path d="M12 22C8.5 120 8.5 260 12 358M188 22C191.5 120 191.5 260 188 358" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="1.2"/>
        <rect class="pk-shine" x="0" y="10" width="60" height="370" fill="url(#pk-sheen)" transform="skewX(-18)"/>
      </g>
      <text x="100" y="188" text-anchor="middle" font-family="Bungee, Impact, sans-serif" font-size="24" fill="url(#pk-rbh)">POPITES</text>
      <text x="100" y="206" text-anchor="middle" font-family="'Alfa Slab One', Georgia, serif" font-size="${name.length > 10 ? 11 : 14}" fill="#fff">${esc(name)}</text>
      <text x="100" y="217" text-anchor="middle" font-family="Figtree, system-ui, sans-serif" font-size="5.2" font-weight="800" fill="#fff" fill-opacity=".75" letter-spacing="1.3">10 CARTES</text>
    </svg>`;
  }

  /* ouverture : quatre copies du paquet, découpées (côté gauche, côté droit, bande encore attachée, bout arraché) */
  function ouvrir(host, { nom, coince = "", fini }){
    host.innerHTML = `<div class="tear" tabindex="0" role="button" aria-label="Booster ${esc(nom)} : glisse le doigt du haut vers le bas au milieu du paquet pour l'ouvrir">
      <div class="tear-inside" aria-hidden="true"></div>
      <div class="tear-part side l"></div><div class="tear-part side r"></div><div class="tear-part mid"></div>
      <div class="tear-part peel"><div class="face"></div><div class="back"></div></div>
      <div class="tear-dots l" aria-hidden="true"></div><div class="tear-dots r" aria-hidden="true"></div>
      <div class="tear-tri" aria-hidden="true"></div><div class="tear-burst"></div></div>`;
    const st = host.firstElementChild, $ = s => st.querySelector(s);
    const P = { l: $(".l.side"), r: $(".r.side"), m: $(".mid"), peel: $(".peel") };
    const face = P.peel.firstElementChild, back = P.peel.lastElementChild;
    P.l.innerHTML = P.r.innerHTML = P.m.innerHTML = face.innerHTML = svg(nom);
    const L = 45, R = 55, JAM_AT = 50;               // bords de la bande, en % de la largeur ; blocage à mi-hauteur
    const edge = x => Array.from({ length: 39 }, (_, i) => [x + (i % 2 ? 1.1 : -1.1) * (0.6 + ((i * 7) % 5) / 6), i * 100 / 38]);
    const EL = edge(L), ER = edge(R);
    const poly = pts => `polygon(${pts.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(",")})`;
    const cut = (pts, a, b) => pts.filter(([, y]) => y >= a && y <= b);
    P.l.style.clipPath = poly([[0, 0], ...EL, [0, 100]]);
    P.r.style.clipPath = poly([[100, 0], ...ER, [100, 100]]);
    let torn = 0, drag = false, state = "closed";
    const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
    function setTorn(v){                             // jusqu'où la bande est arrachée, de 0 à 100 % de la hauteur
      torn = Math.max(torn, Math.min(100, v));
      const t = torn, a = Math.max(0, t - (97 - t)); // une fois rabattu, le bout arraché ne dépasse pas du bas
      P.m.style.clipPath = poly([[L, t], ...cut(EL, t, 100), ...cut(ER, t, 100).reverse(), [R, t]]);
      const piece = [[L, a], ...cut(EL, a, t), [L, t], [R, t], ...cut(ER, a, t).reverse(), [R, a]];
      face.style.clipPath = poly(piece);
      back.style.clipPath = poly(piece.map(([x, y]) => [x, 100 - y]));
      P.peel.style.transformOrigin = `50% ${t}%`;
      P.peel.style.transform = `rotateX(${-Math.min(158, t * 9).toFixed(1)}deg)`;
      P.peel.style.opacity = t > 1 ? 1 : 0;
      st.classList.toggle("torn", t > 2);
    }
    function open(){
      state = "open"; st.classList.add("opened"); P.peel.style.opacity = "";
      setTimeout(() => fini && fini(), reduce() ? 0 : 1100);
    }
    function jamNow(){                               // la bande se bloque : à-coup, le triangle revient au point de blocage
      state = "jammed"; st.classList.add("jammed"); st.style.setProperty("--tri-top", (JAM_AT - 1.5) + "%");
      st.classList.remove("jolt"); void st.offsetWidth; st.classList.add("jolt");
    }
    function auto(ms){                               // la bande finit de se déchirer d'un coup (ou jusqu'au blocage)
      if (state !== "closed" && state !== "second") return;
      const target = coince && state === "closed" ? JAM_AT : 100;
      state = "auto"; drag = false;
      const end = () => target < 100 ? jamNow() : open();
      if (reduce()) { setTorn(target); return end(); }
      const t0 = performance.now(), from = torn;
      (function step(t){ const k = Math.min(1, (t - t0) / ms), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; setTorn(from + (target - from) * e); k < 1 ? requestAnimationFrame(step) : end(); })(t0);
    }
    function second(){                               // second tirage : lumière dorée (légendaire) ou arc-en-ciel qui tourne (Popites)
      state = "second"; st.classList.remove("jammed"); st.classList.add(coince === "P" ? "prism" : "gold"); st.style.removeProperty("--tri-top");
    }
    const pos = e => { const r = st.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 100, (e.clientY - r.top) / r.height * 100]; };
    st.addEventListener("pointerdown", e => {
      const [x, y] = pos(e);
      if (Math.abs(x - 50) > 16) return;
      if (state === "closed" && y <= 18) { st.setPointerCapture(e.pointerId); drag = true; }
      else if (state === "jammed" && Math.abs(y - JAM_AT) <= 16) { st.setPointerCapture(e.pointerId); drag = true; second(); }
    });
    st.addEventListener("pointermove", e => {
      if (!drag) return;
      const y = pos(e)[1];
      setTorn(state === "closed" && coince ? Math.min(y, JAM_AT) : y);
      if (state === "closed" && torn >= (coince ? JAM_AT - 1 : 45)) auto(coince ? 200 : 850);
      if (state === "second" && torn >= JAM_AT + 10) auto(750);
    });
    const stop = () => { if (!drag) return; drag = false; if (torn > 3) auto(state === "second" ? 800 : 1000); else setTorn(0); };
    st.addEventListener("pointerup", stop);
    st.addEventListener("pointercancel", stop);
    const go = () => { if (state === "closed") auto(1300); else if (state === "jammed") { second(); auto(900); } };
    st.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    setTorn(0);
    return { go };                                   // pour un bouton « ouvrir sans glisser »
  }
  return { svg, ouvrir };
})();
