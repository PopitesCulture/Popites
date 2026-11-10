/* Ambiance de Popites :
   - en fond, toutes les petites icônes au trait sont là en permanence, très discrètes, comme un papier peint ;
     de temps en temps, une onde arc-en-ciel les balaie et les illumine sur son passage, avec deux crêtes rapprochées
     comme un battement de cœur (toutes les 1 à 2 minutes, et aux grands moments : légendaire, Popites, badge) ;
   - confettis quand on retourne une carte rare (bleu), épique (violet), légendaire (or) ou la Popites (arc-en-ciel).
   Rien ne bouge si le téléphone demande moins d'animations. FOND.confettis(élément, rareté), FOND.vague(). */
const FOND = (() => {
  const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- papier peint d'icônes + onde arc-en-ciel ---------- */
  const TUILE = 260;
  let onde = null;
  function tuile(){
    // une tuile de 260 px avec 16 icônes, placées en grille avec un peu de désordre (toujours le même tirage)
    const noms = Object.keys(SYMBOLES); let s = 7;
    const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    let g = "";
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
      const nom = noms[Math.floor(rnd() * noms.length)], t = 22 + rnd() * 10;
      const px = x * 65 + 10 + rnd() * 22, py = y * 65 + 10 + rnd() * 22, r = Math.round((rnd() - .5) * 50);
      g += `<g transform="translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${r} ${t / 2} ${t / 2}) scale(${(t / 12).toFixed(2)})">${SYMBOLES[nom]}</g>`;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TUILE}" height="${TUILE}" viewBox="0 0 ${TUILE} ${TUILE}" fill="none" stroke="white" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round">${g}</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }
  /* la forme de l'onde : une crête qui ondule de haut en bas (et une seconde, plus douce, juste derrière : le battement),
     floutée pour que les icônes s'allument et s'éteignent en douceur */
  function crete(){
    const pts = (x0, amp, ph) => { let d = ""; for (let y = 0; y <= 1000; y += 25) { const x = x0 + amp * Math.sin(y / 1000 * Math.PI * 3 + ph); d += (y ? "L" : "M") + x.toFixed(1) + " " + y; } return d; };
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3000 1000" preserveAspectRatio="none"><filter id="f" x="-50%" y="-10%" width="200%" height="120%"><feGaussianBlur stdDeviation="22"/></filter>
      <g filter="url(#f)" fill="none" stroke-linecap="round"><path d="${pts(1500, 70, 0)}" stroke="#000" stroke-width="95"/><path d="${pts(1360, 60, .5)}" stroke="#000" stroke-opacity=".6" stroke-width="55"/></g></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }
  function decor(){
    if (onde || typeof SYMBOLES === "undefined") return;
    const d = document.createElement("div"); d.className = "decor"; d.setAttribute("aria-hidden", "true");
    d.innerHTML = `<div class="decor-base"></div><div class="decor-onde"></div>`;
    document.body.prepend(d);
    const t = tuile();
    d.style.setProperty("--tuile", t);
    d.style.setProperty("--crete", crete());
    onde = d.querySelector(".decor-onde");
    onde.addEventListener("animationend", () => onde.classList.remove("bat"));
  }
  function vague(){
    decor();
    if (calm() || !onde || document.hidden) return;
    // fenêtre du booster ouverte : elle couvre l'écran, elle reçoit donc son propre papier peint
    const m = document.getElementById("modal");
    if (m && !m.hidden && !m.querySelector(":scope > .decor")) {
      const d = document.querySelector("body > .decor").cloneNode(true);
      d.querySelector(".decor-onde").addEventListener("animationend", e => e.target.classList.remove("bat"));
      m.prepend(d);
    }
    document.querySelectorAll(".decor-onde").forEach(o => { o.classList.remove("bat"); void o.offsetWidth; o.classList.add("bat"); });
  }
  function suivante(delai){ setTimeout(() => { vague(); suivante(60000 + Math.random() * 60000); }, delai); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", decor); else decor();
  if (!calm()) suivante(15000);

  /* ---------- confettis : un canon à confettis au-dessus de la carte ---------- */
  const TEINTES = {
    R: ["#3b8bff", "#8fc1ff", "#5ad1ff", "#ffffff"],
    E: ["#9a5cff", "#d08bff", "#ff7ad9", "#ffffff"],
    L: ["#ffd23f", "#ff9a1a", "#fff4c2", "#ffb84a", "#ffffff"],
    P: ["#ff3b3b", "#ff9a1a", "#ffe14a", "#36e07f", "#3b8bff", "#9a5cff", "#ff5fb0", "#ffffff"],
  };
  const COMBIEN = { R: 34, E: 60, L: 110, P: 160 };
  const FORMES = ["rect", "rect", "rond", "etoile", "serpentin", "serpentin"];
  let couche = null;
  function confettis(el, r){
    if (calm() || !COMBIEN[r] || !el) return;
    if (!couche) { couche = document.createElement("div"); couche.className = "confettis"; couche.setAttribute("aria-hidden", "true"); document.body.appendChild(couche); }
    const b = el.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height * .35, cols = TEINTES[r];
    const force = r === "R" ? 1 : r === "E" ? 1.25 : 1.55;
    for (let i = 0; i < COMBIEN[r]; i++) {
      const p = document.createElement("i"), forme = FORMES[Math.floor(Math.random() * FORMES.length)];
      const c = cols[i % cols.length];
      let w = 10 + Math.random() * 8, h = w * (.5 + Math.random() * .6), extra = "";
      if (forme === "rond") h = w;
      if (forme === "serpentin") { w = 5 + Math.random() * 3; h = 26 + Math.random() * 22; }
      if (forme === "etoile") { w = h = 14 + Math.random() * 8; extra = "clip-path:polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);"; }
      p.style.cssText = `left:${cx}px;top:${cy}px;width:${w}px;height:${h}px;background:${c};border-radius:${forme === "rond" ? "50%" : forme === "serpentin" ? "3px" : "2px"};${extra}`;
      couche.appendChild(p);
      // jaillit vers le haut en éventail, flotte, puis retombe en tournoyant (les serpentins ondulent)
      const ang = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.1, v = (160 + Math.random() * 260) * force;
      const dx = Math.cos(ang) * v, dy = Math.sin(ang) * v, chute = 260 + Math.random() * 300, rot = (Math.random() - .5) * 1400;
      const sway = forme === "serpentin" ? 40 : 18;
      p.animate([
        { transform: "translate(-50%,-50%) rotate(0deg) scale(.6)", opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rot * .3}deg) scale(1)`, opacity: 1, offset: .3 },
        { transform: `translate(calc(-50% + ${dx * 1.15 + sway}px), calc(-50% + ${dy + chute * .45}px)) rotate(${rot * .65}deg) scaleX(${forme === "serpentin" ? -1 : 1})`, opacity: 1, offset: .65 },
        { transform: `translate(calc(-50% + ${dx * 1.25 - sway}px), calc(-50% + ${dy + chute}px)) rotate(${rot}deg)`, opacity: 0 },
      ], { duration: 2200 + Math.random() * 1400, easing: "cubic-bezier(.15,.8,.35,1)", fill: "forwards" }).onfinish = () => p.remove();
    }
  }

  return { confettis, vague };
})();
