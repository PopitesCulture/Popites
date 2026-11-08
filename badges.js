/* Badges de Popites : un écusson brodé par sous-genre complété, l'écrin du profil et l'animation de déblocage.
   Dessins validés dans design\badges.html (maquette) ; BADGE.svg(clé, nom, verrouillé), BADGE.ecrin(catégories), BADGE.debloquer(liste, suite). */
const BADGE = (() => {
  const DEFS = "\u003csvg width=\"0\" height=\"0\" style=\"position:absolute\" aria-hidden=\"true\"\u003e\r\n  \u003cdefs\u003e\r\n    \u003clinearGradient id=\"holo\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\" gradientTransform=\"rotate(0 .5 .5)\"\u003e\r\n      \u003cstop offset=\"0\" stop-color=\"#ff5f8f\"/\u003e\u003cstop offset=\".17\" stop-color=\"#ffb84a\"/\u003e\u003cstop offset=\".33\" stop-color=\"#fff07a\"/\u003e\r\n      \u003cstop offset=\".5\" stop-color=\"#5dffb0\"/\u003e\u003cstop offset=\".67\" stop-color=\"#5ab8ff\"/\u003e\u003cstop offset=\".83\" stop-color=\"#b47dff\"/\u003e\u003cstop offset=\"1\" stop-color=\"#ff5f8f\"/\u003e\r\n      \u003canimateTransform attributeName=\"gradientTransform\" type=\"rotate\" from=\"0 .5 .5\" to=\"360 .5 .5\" dur=\"7s\" repeatCount=\"indefinite\"/\u003e\r\n    \u003c/linearGradient\u003e\r\n    \u003clinearGradient id=\"argent\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"\u003e\u003cstop offset=\"0\" stop-color=\"#ffffff\"/\u003e\u003cstop offset=\".45\" stop-color=\"#c9cfdc\"/\u003e\u003cstop offset=\".7\" stop-color=\"#8a92a8\"/\u003e\u003cstop offset=\"1\" stop-color=\"#e6e9f2\"/\u003e\u003c/linearGradient\u003e\r\n    \u003clinearGradient id=\"or\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"\u003e\u003cstop offset=\"0\" stop-color=\"#fff3b0\"/\u003e\u003cstop offset=\".4\" stop-color=\"#ffc83a\"/\u003e\u003cstop offset=\".75\" stop-color=\"#d98c0a\"/\u003e\u003cstop offset=\"1\" stop-color=\"#ffe27a\"/\u003e\u003c/linearGradient\u003e\r\n    \u003clinearGradient id=\"brut\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"\u003e\u003cstop offset=\"0\" stop-color=\"#57526a\"/\u003e\u003cstop offset=\".5\" stop-color=\"#36324a\"/\u003e\u003cstop offset=\"1\" stop-color=\"#4a4560\"/\u003e\u003c/linearGradient\u003e\r\n    \u003clinearGradient id=\"reflet\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"\u003e\u003cstop offset=\"0\" stop-color=\"#fff\" stop-opacity=\"0\"/\u003e\u003cstop offset=\".5\" stop-color=\"#fff\" stop-opacity=\".8\"/\u003e\u003cstop offset=\"1\" stop-color=\"#fff\" stop-opacity=\"0\"/\u003e\u003c/linearGradient\u003e\r\n    \u003cpattern id=\"trame\" width=\"6\" height=\"6\" patternUnits=\"userSpaceOnUse\"\u003e\u003ccircle cx=\"3\" cy=\"3\" r=\"1.1\" fill=\"#000\" opacity=\".14\"/\u003e\u003c/pattern\u003e\r\n    \u003c!-- paillettes du métal holographique --\u003e\r\n    \u003cpattern id=\"paillettes\" width=\"14\" height=\"14\" patternUnits=\"userSpaceOnUse\"\u003e\u003ccircle cx=\"2\" cy=\"3\" r=\".9\" fill=\"#fff\" opacity=\".9\"/\u003e\u003ccircle cx=\"9\" cy=\"10\" r=\".6\" fill=\"#fff\" opacity=\".7\"/\u003e\u003ccircle cx=\"11\" cy=\"2\" r=\".4\" fill=\"#fff\"/\u003e\u003c/pattern\u003e\r\n    \u003c!-- émail qui s\u0027éclaire au centre et s\u0027assombrit vers les bords --\u003e\r\n    \u003cradialGradient id=\"lumiere\" cx=\".5\" cy=\".38\" r=\".62\"\u003e\u003cstop offset=\"0\" stop-color=\"#fff\" stop-opacity=\".38\"/\u003e\u003cstop offset=\".55\" stop-color=\"#fff\" stop-opacity=\"0\"/\u003e\u003cstop offset=\"1\" stop-color=\"#000\" stop-opacity=\".42\"/\u003e\u003c/radialGradient\u003e\r\n    \u003c!-- reflet qui suit le doigt --\u003e\r\n    \u003cradialGradient id=\"glare\"\u003e\u003cstop offset=\"0\" stop-color=\"#fff\" stop-opacity=\".55\"/\u003e\u003cstop offset=\".6\" stop-color=\"#fff\" stop-opacity=\".08\"/\u003e\u003cstop offset=\"1\" stop-color=\"#fff\" stop-opacity=\"0\"/\u003e\u003c/radialGradient\u003e\r\n    \u003c!-- partie découpée qui dépasse : bordée de métal, avec son ombre portée sur l\u0027émail --\u003e\r\n    \u003cfilter id=\"sticker\" x=\"-25%\" y=\"-25%\" width=\"150%\" height=\"150%\"\u003e\r\n      \u003cfeMorphology in=\"SourceAlpha\" operator=\"dilate\" radius=\"2.2\" result=\"d2\"/\u003e\r\n      \u003cfeFlood flood-color=\"#2b2638\"/\u003e\u003cfeComposite in2=\"d2\" operator=\"in\" result=\"metal\"/\u003e\r\n      \u003cfeOffset in=\"metal\" dy=\"2.6\" result=\"decale\"/\u003e\u003cfeGaussianBlur in=\"decale\" stdDeviation=\"1.6\" result=\"ombre\"/\u003e\r\n      \u003cfeColorMatrix in=\"ombre\" type=\"matrix\" values=\"0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .7 0\" result=\"ombre2\"/\u003e\r\n      \u003cfeMerge\u003e\u003cfeMergeNode in=\"ombre2\"/\u003e\u003cfeMergeNode in=\"metal\"/\u003e\u003cfeMergeNode in=\"SourceGraphic\"/\u003e\u003c/feMerge\u003e\r\n    \u003c/filter\u003e\r\n    \u003c!-- relief du métal : les lignes sombres (le métal) deviennent bombées et accrochent la lumière venue d\u0027en haut à gauche --\u003e\r\n    \u003cfilter id=\"relief\" x=\"-10%\" y=\"-10%\" width=\"120%\" height=\"120%\" color-interpolation-filters=\"sRGB\"\u003e\r\n      \u003cfeColorMatrix in=\"SourceGraphic\" type=\"matrix\" values=\"0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -.35 -.55 -.1 1 0\" result=\"sombre\"/\u003e\r\n      \u003cfeGaussianBlur in=\"sombre\" stdDeviation=\".8\" result=\"bosse\"/\u003e\r\n      \u003cfeSpecularLighting in=\"bosse\" surfaceScale=\"4\" specularConstant=\"1.5\" specularExponent=\"70\" lighting-color=\"#ffffff\" result=\"eclat\"\u003e\r\n        \u003cfeDistantLight azimuth=\"225\" elevation=\"52\"/\u003e\r\n      \u003c/feSpecularLighting\u003e\r\n      \u003cfeComposite in=\"eclat\" in2=\"SourceAlpha\" operator=\"in\" result=\"eclat2\"/\u003e\r\n      \u003cfeComposite in=\"SourceGraphic\" in2=\"eclat2\" operator=\"arithmetic\" k2=\"1\" k3=\".9\" k4=\"0\"/\u003e\r\n    \u003c/filter\u003e\r\n    \u003c!-- résine bombée : un grand reflet doux en haut, un liseré clair en bas --\u003e\r\n    \u003cradialGradient id=\"dome\" cx=\".35\" cy=\".18\" r=\".7\"\u003e\u003cstop offset=\"0\" stop-color=\"#fff\" stop-opacity=\".42\"/\u003e\u003cstop offset=\".45\" stop-color=\"#fff\" stop-opacity=\".06\"/\u003e\u003cstop offset=\"1\" stop-color=\"#fff\" stop-opacity=\"0\"/\u003e\u003c/radialGradient\u003e\r\n    \u003cg id=\"vol\"\u003e\u003c/g\u003e\r\n    \u003c!-- broderie : fils serrés (anneau en biais, centre dans l\u0027autre sens) --\u003e\r\n    \u003cpattern id=\"fil\" width=\"3\" height=\"3\" patternUnits=\"userSpaceOnUse\" patternTransform=\"rotate(35)\"\u003e\u003crect width=\"3\" height=\"1.3\" fill=\"#fff\" opacity=\".22\"/\u003e\u003crect y=\"1.6\" width=\"3\" height=\".6\" fill=\"#000\" opacity=\".18\"/\u003e\u003c/pattern\u003e\r\n    \u003cpattern id=\"fil2\" width=\"3\" height=\"3\" patternUnits=\"userSpaceOnUse\" patternTransform=\"rotate(-30)\"\u003e\u003crect width=\"3\" height=\"1.2\" fill=\"#fff\" opacity=\".28\"/\u003e\u003crect y=\"1.6\" width=\"3\" height=\".5\" fill=\"#000\" opacity=\".12\"/\u003e\u003c/pattern\u003e\r\n    \u003c!-- illustration brodée : contour épais en fil foncé, texture de fil sur les aplats, petit relief --\u003e\r\n    \u003cfilter id=\"brode\" x=\"-20%\" y=\"-20%\" width=\"140%\" height=\"140%\" color-interpolation-filters=\"sRGB\"\u003e\r\n      \u003cfeMorphology in=\"SourceAlpha\" operator=\"dilate\" radius=\"1.6\" result=\"d\"/\u003e\r\n      \u003cfeFlood flood-color=\"#2a1f2e\"/\u003e\u003cfeComposite in2=\"d\" operator=\"in\" result=\"contour\"/\u003e\r\n      \u003cfeTurbulence type=\"fractalNoise\" baseFrequency=\"1.4 .18\" numOctaves=\"2\" seed=\"7\" result=\"bruit\"/\u003e\r\n      \u003cfeColorMatrix in=\"bruit\" type=\"matrix\" values=\"0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .5 -.12\" result=\"fils\"/\u003e\r\n      \u003cfeComposite in=\"fils\" in2=\"SourceAlpha\" operator=\"in\" result=\"fils2\"/\u003e\r\n      \u003cfeOffset in=\"contour\" dy=\"1.6\" result=\"ombre0\"/\u003e\u003cfeGaussianBlur in=\"ombre0\" stdDeviation=\"1\" result=\"ombre1\"/\u003e\r\n      \u003cfeColorMatrix in=\"ombre1\" type=\"matrix\" values=\"0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0\" result=\"ombre\"/\u003e\r\n      \u003cfeMerge\u003e\u003cfeMergeNode in=\"ombre\"/\u003e\u003cfeMergeNode in=\"contour\"/\u003e\u003cfeMergeNode in=\"SourceGraphic\"/\u003e\u003cfeMergeNode in=\"fils2\"/\u003e\u003c/feMerge\u003e\r\n    \u003c/filter\u003e\r\n    \u003c!-- galaxie dans la boule de cristal --\u003e\r\n    \u003cradialGradient id=\"nebuleuse\" cx=\".42\" cy=\".4\" r=\".62\"\u003e\u003cstop offset=\"0\" stop-color=\"#ffd6f5\"/\u003e\u003cstop offset=\".22\" stop-color=\"#ff7ad9\"/\u003e\u003cstop offset=\".5\" stop-color=\"#8a3dff\"/\u003e\u003cstop offset=\".8\" stop-color=\"#2b1a8f\"/\u003e\u003cstop offset=\"1\" stop-color=\"#140b4a\"/\u003e\u003c/radialGradient\u003e\r\n    \u003clinearGradient id=\"tranche\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"\u003e\u003cstop offset=\"0\" stop-color=\"#7a4bd6\"/\u003e\u003cstop offset=\".3\" stop-color=\"#2a8fd8\"/\u003e\u003cstop offset=\".55\" stop-color=\"#2fbf86\"/\u003e\u003cstop offset=\".8\" stop-color=\"#d9a21e\"/\u003e\u003cstop offset=\"1\" stop-color=\"#c2386b\"/\u003e\u003c/linearGradient\u003e\r\n  \u003c/defs\u003e\r\n\u003c/svg\u003e";
const O = "#1a1428";                       // contour noir des pin's
const W = 'stroke="#1a1428" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"';
const HL = 'fill="#fff" opacity=".55"';    // reflets blancs
/* formes d'écusson (viewBox 0 0 120 140, centre 60,64) */
const poly = (n, r, rot, cy) => { const p = []; for (let i = 0; i < n; i++) { const a = rot + i * 2 * Math.PI / n; p.push((60 + r * Math.cos(a)).toFixed(1) + " " + (cy + r * Math.sin(a)).toFixed(1)); } return "M" + p.join(" L") + " Z"; };
const SHAPES = {
  blason: "M60 6 L108 19 V60 C108 93 87 116 60 130 C33 116 12 93 12 60 V19 Z",
  octogone: poly(8, 55, Math.PI / 8, 64),
  medaille: "M60 8 A56 56 0 1 1 59.9 8 Z",
  hexagone: poly(6, 59, -Math.PI / 2, 66),
};
/* illustrations, dessinées pour Popites dans une case de 64 × 64 ; a, b, c = couleurs du sous-genre */
const ILL = {
  /* Séries médicales : stéthoscope posé sur une croix, ligne de pouls */
  stethoscope: (a, b, c) => `
    <path d="M23 4h18v17h17v18H41v17H23V39H6V21h17z" fill="${c}" ${W}/>
    <path d="M41 21h17v18H41v17H23V39h18z" fill="${shade(c, -.25)}"/><path d="M23 4h18v17h17v18H41v17H23V39H6V21h17z" fill="none" ${W}/>
    <path d="M26 7h4v14M9 24h12" stroke="#fff" stroke-width="2.2" opacity=".7" fill="none"/>
    <path d="M8 31h10l3-6 4 12 4-9 2 3h9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M15 6v13c0 10 7 17 17 17s17-7 17-17V6" fill="none" stroke="${O}" stroke-width="8.4" stroke-linecap="round"/>
    <path d="M15 6v13c0 10 7 17 17 17s17-7 17-17V6" fill="none" stroke="${b}" stroke-width="4.6" stroke-linecap="round"/>
    <path d="M17 8v11c0 8 5 13 11 15" fill="none" stroke="#fff" stroke-width="1.6" opacity=".7" stroke-linecap="round"/>
    <circle cx="15" cy="6" r="4" fill="url(#argent)" ${W}/><circle cx="49" cy="6" r="4" fill="url(#argent)" ${W}/>
    <path d="M32 36v6c0 8 5 13 12 13s10-4 10-10v-4" fill="none" stroke="${O}" stroke-width="8.4" stroke-linecap="round"/>
    <path d="M32 36v6c0 8 5 13 12 13s10-4 10-10v-4" fill="none" stroke="${b}" stroke-width="4.6" stroke-linecap="round"/>
    <circle cx="54" cy="38" r="9.5" fill="url(#argent)" ${W}/><circle cx="54" cy="38" r="5.6" fill="#6f7891" ${W}/><circle cx="54" cy="38" r="2.4" fill="#c9cfdc"/>
    <path d="M48.5 33.5a7 7 0 0 1 4.5-2.5" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,

  /* Séries policières : revolver qui tire, étoile de shérif */
  pistolet: (a, b, c) => `
    <path d="M1 18l7 1 0-7 5 5 5-5 0 7 7 1-6 4 4 6-7-2-3 7-2-7-7 2 4-6z" fill="${b}" ${W}/><circle cx="12" cy="21" r="2.4" fill="#fff"/>
    <path d="M18 14h28l2 3v6H18z" fill="url(#argent)" ${W}/><path d="M18 18h29" stroke="${O}" stroke-width="1.2" opacity=".5"/><path d="M20 16h22" stroke="#fff" stroke-width="1.8"/>
    <path d="M20 23h20v4H22z" fill="#9aa3ba" ${W} stroke-width="1.8"/>
    <rect x="38" y="11" width="15" height="17" rx="4" fill="#a5adc2" ${W}/><path d="M42 11.5v16M45.5 11v17M49 11.5v16" stroke="${O}" stroke-width="1.3" opacity=".55"/><path d="M40 14h10" stroke="#fff" stroke-width="1.6" opacity=".9"/>
    <path d="M53 13l5-6 4 3-5 6z" fill="#7c859c" ${W}/>
    <path d="M51 24h7l5 26c.5 4-2 7-6 7h-5c-3 0-5-3-4-6z" fill="#b4612f" ${W}/><path d="M57 25l4.5 25c.4 3-1.4 5-4 5" fill="none" stroke="#7c3a14" stroke-width="3" opacity=".7"/>
    <path d="M53 30l3 18" stroke="#e7a26a" stroke-width="2.2" stroke-linecap="round"/><circle cx="54" cy="44" r="1.5" fill="url(#or)" stroke="${O}"/>
    <path d="M43 28c-1 7 2 12 9 12" fill="none" ${W} stroke-width="3.2"/><path d="M47 28l1.5 7" ${W} stroke-width="2.6"/>
    <path d="M22 35l4.2 9 9.8 1.2-7.3 6.5 2 9.8-8.7-5-8.7 5 2-9.8-7.3-6.5 9.8-1.2z" fill="url(#or)" ${W}/>
    <circle cx="22" cy="49" r="3.4" fill="${a}" ${W} stroke-width="1.6"/><path d="M18 40l2-3" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>`,

  /* Fantastique : tête de dragon de profil, gueule ouverte qui crache une flamme */
  dragon: (a, b, c) => `
    <path d="M52 36c5 2 9 0 11-4-1 6-4 9-8 10 4 1 6 4 6 8-3-3-7-4-11-3z" fill="${c}" ${W}/><path d="M53 38c3 1 5 1 7-1-1 3-3 4-5 4 2 1 3 2 3 4-2-2-4-2-6-2z" fill="#ffe36b"/>
    <path d="M6 64c1-14 4-24 10-32 6-8 14-13 24-13 7 0 12 2 16 6l4 5c1 2 0 4-2 4l-8 1 5 4c1 1 0 3-1 3h-6c-4 6-10 9-17 9-6 3-10 8-12 13z" fill="${b}" ${W}/>
    <path d="M6 64c1-14 4-24 10-32 3-4 6-7 10-9-4 6-7 13-8 21-1 7-3 13-5 20z" fill="${shade(b, -.3)}"/>
    <path d="M19 64c2-5 6-10 12-13 7 0 13-3 17-9l2 3c-4 6-11 10-18 11-5 2-8 5-9 8z" fill="#ffe9a8" ${W} stroke-width="1.8"/>
    <path d="M26 54l3 2M31 51l2 3M36 49l1.5 3" stroke="#d9b45a" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M48 32l12-2-1 2-11 2z" fill="#7a1030"/><path d="M48 31l1.6 3 1.6-3M53 30.5l1.4 2.8 1.4-2.8" fill="#fff" ${W} stroke-width="1"/>
    <path d="M30 22c-3-8-8-14-16-18 7 1 13 5 17 10z" fill="#fff4d6" ${W}/><path d="M38 19c0-8-3-14-8-18 7 3 11 9 12 16z" fill="#fff4d6" ${W}/>
    <path d="M27 17c-2-3-5-6-9-9" stroke="#d9c49a" stroke-width="1.6" fill="none"/>
    <path d="M14 32l-8-3 5 7M10 43l-8 0 6 5M8 54l-7 2 6 4" fill="${shade(b, -.3)}" ${W} stroke-width="1.8"/>
    <path d="M37 26c4-2 9-2 13 1" fill="none" ${W} stroke-width="2.6"/>
    <ellipse cx="44" cy="29" rx="4.2" ry="3.2" fill="#ffe14a" ${W} stroke-width="1.8"/><path d="M44 26.5v5" stroke="${O}" stroke-width="2.2" stroke-linecap="round"/><circle cx="42.6" cy="28" r=".8" fill="#fff"/>
    <circle cx="57.5" cy="27" r="1.1" fill="${O}"/>
    <path d="M22 30c4-4 9-6 14-6" stroke="#fff" stroke-width="2.2" opacity=".55" fill="none" stroke-linecap="round"/>
    <path d="M28 38c2 0 3 1 4 2M24 44c2 0 3 1 4 2M33 34c2 0 3 1 3 2" stroke="${shade(b, -.35)}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,

  /* Fantastique & SF : boule de cristal, une galaxie et une planète à anneau à l'intérieur, pied doré à griffes */
  cristal: (a, b, c) => `
    <path d="M4 14l1.4 3.6 3.6 1.4-3.6 1.4L4 24l-1.4-3.6L-1 19l3.6-1.4zM60 6l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z" fill="#fff"/>
    <path d="M10 62h44l-5-9H15z" fill="url(#or)" ${W}/><path d="M12 62h40" stroke="#8a5704" stroke-width="1.6" opacity=".5"/>
    <path d="M15 53c-3-2-4-6-2-8M49 53c3-2 4-6 2-8M32 53v-5" fill="none" stroke="${O}" stroke-width="5.6" stroke-linecap="round"/>
    <path d="M15 53c-3-2-4-6-2-8M49 53c3-2 4-6 2-8M32 53v-5" fill="none" stroke="url(#or)" stroke-width="3" stroke-linecap="round"/>
    <circle cx="32" cy="27" r="23" fill="url(#nebuleuse)" ${W}/>
    <path d="M14 30c6-10 20-12 30-6 4 2 6 6 3 9-4 4-14 2-20-2" fill="none" stroke="#8ff0ff" stroke-width="2.6" stroke-linecap="round" opacity=".75"/>
    <path d="M20 40c8 2 17 1 23-5" fill="none" stroke="#ffb3ec" stroke-width="2" stroke-linecap="round" opacity=".7"/>
    <ellipse cx="40" cy="17" rx="8.5" ry="2.6" transform="rotate(-18 40 17)" fill="none" stroke="#ffe14a" stroke-width="1.8"/>
    <circle cx="40" cy="17" r="4.4" fill="#ff9a1a" ${W} stroke-width="1.4"/><path d="M36.6 15.6a4 4 0 0 1 3-2.6" stroke="#ffe0a8" stroke-width="1.4" fill="none"/>
    <path d="M32.2 18.6a8.5 2.6 -18 0 0 15.6-3.2" fill="none" stroke="#ffe14a" stroke-width="1.8"/>
    <path d="M22 22l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1zM30 36l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" fill="#fff"/>
    <circle cx="44" cy="32" r="1" fill="#fff"/><circle cx="18" cy="34" r=".9" fill="#fff"/><circle cx="35" cy="10" r=".8" fill="#fff"/><circle cx="27" cy="44" r=".8" fill="#fff"/>
    <path d="M17 17a17 17 0 0 1 11-9" stroke="#fff" stroke-width="3.2" stroke-linecap="round" opacity=".85" fill="none"/><circle cx="15.5" cy="22" r="1.6" fill="#fff" opacity=".85"/>
    <path d="M47 37a17 17 0 0 1-8 7" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".4" fill="none"/>
    <path d="M18 48c4 2 9 3 14 3s10-1 14-3" fill="none" ${W} stroke-width="2"/>`,

  /* Comédies : masque qui rit (or) devant le masque qui pleure (bleu), rubans */
  masques: (a, b, c) => `
    <path d="M4 50c8-7 18-8 28-3M36 46c8 5 15 8 24 5" fill="none" stroke="${O}" stroke-width="7.4" stroke-linecap="round"/>
    <path d="M4 50c8-7 18-8 28-3M36 46c8 5 15 8 24 5" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/>
    <path d="M30 10c9 4 20 4 30 0v19c0 12-7 21-15 21s-15-9-15-21z" fill="#5b8cff" ${W}/>
    <path d="M45 50c8 0 15-9 15-21V10c-3 1-6 2-9 2v17c0 11-3 18-6 21z" fill="#3a63d6"/><path d="M30 10c9 4 20 4 30 0v19c0 12-7 21-15 21s-15-9-15-21z" fill="none" ${W}/>
    <path d="M35 22c2-2 5-2 7 1M48 23c2-3 5-3 7-1" fill="none" ${W}/><path d="M37 41c3-5 12-5 15 0" fill="none" ${W} stroke-width="3"/>
    <path d="M38 26c0 3-1 5-2 7" stroke="#bfe0ff" stroke-width="2.2" stroke-linecap="round"/><circle cx="36" cy="34" r="1.6" fill="#bfe0ff"/>
    <path d="M3 4c9 4 20 4 30 0v19c0 12-7 21-15 21S3 35 3 23z" fill="url(#or)" ${W}/>
    <path d="M18 44c-8 0-15-9-15-21V4c3 1 6 2 9 2v17c0 11 3 18 6 21z" fill="#fff6c8" opacity=".55"/><path d="M3 4c9 4 20 4 30 0v19c0 12-7 21-15 21S3 35 3 23z" fill="none" ${W}/>
    <path d="M8 16c2-3 5-3 7 0M21 16c2-3 5-3 7 0" fill="none" ${W}/><path d="M8 26c3 9 17 9 20 0z" fill="${O}"/><path d="M11 28c3 3 11 3 14 0" stroke="#ff5f8f" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="9" cy="22" r="2" fill="#ff9a6b" opacity=".8"/><circle cx="27" cy="22" r="2" fill="#ff9a6b" opacity=".8"/>`,

  /* Shōnen : éclair d'énergie qui jaillit d'une explosion */
  eclair: (a, b, c) => `
    <path d="M32 0l5 13 12-8-4 14 15-2-11 10 11 10-15-2 4 14-12-8-5 13-5-13-12 8 4-14-15 2 11-10L4 17l15 2-4-14 12 8z" fill="${b}" ${W}/>
    <path d="M32 9l3 9 8-5-3 9 10-1-8 7 8 7-10-1 3 9-8-5-3 9-3-9-8 5 3-9-10 1 8-7-8-7 10 1-3-9 8 5z" fill="#ffe14a"/>
    <path d="M37 3 13 37h15L21 62l31-36H37l7-23z" fill="#fff36b" ${W} stroke-width="2.8"/>
    <path d="M37 3 13 37h6L39 8z" fill="#fff"/><path d="M44 26 28 44" stroke="#ffb02e" stroke-width="3" stroke-linecap="round"/>`,

  /* Seinen : katana sous la pleine lune, lame courbe avec sa ligne de trempe, garde dorée, poignée tressée, cordon rouge */
  lame: (a, b, c) => `
    <circle cx="41" cy="20" r="13" fill="#fff1c4" ${W}/><circle cx="36.5" cy="16" r="2.6" fill="#f2dc9a"/><circle cx="45.5" cy="24.5" r="2" fill="#f2dc9a"/><circle cx="45" cy="13.5" r="1.3" fill="#f2dc9a"/>
    <path d="M10 50c-3 4-2 8 2 10" fill="none" stroke="${O}" stroke-width="4.2" stroke-linecap="round"/><path d="M10 50c-3 4-2 8 2 10" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M12 59l-1 5M14 59l1 4M11 60l-3 3" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>
    <g transform="translate(32 32) rotate(-42) scale(1.14) translate(-32 -32)">
      <path d="M2 32l-1 6 3 2" fill="none"/>
      <path d="M27 29.4Q46 28 63 23.2l.6 1.6Q50 33.4 27 34.6z" fill="url(#argent)" ${W}/>
      <path d="M28 33.6q2-1 4 0t4-.2 4-.4 4-.7 4-.9 4-1.2 4-1.4" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M28 31.2Q46 30 61 25.6" fill="none" stroke="#8a92a8" stroke-width=".8"/>
      <rect x="24.4" y="29.4" width="3" height="5.2" rx=".8" fill="url(#or)" ${W} stroke-width="1.4"/>
      <ellipse cx="22.6" cy="32" rx="2.6" ry="8" fill="url(#or)" ${W}/><circle cx="22.6" cy="27.6" r=".9" fill="${O}"/><circle cx="22.6" cy="36.4" r=".9" fill="${O}"/>
      <rect x="4.5" y="28.6" width="16" height="6.8" rx="2.2" fill="#1f1a2b" ${W}/>
      <path d="M6 32l1.8-2.6 1.8 2.6-1.8 2.6zM10 32l1.8-2.6 1.8 2.6-1.8 2.6zM14 32l1.8-2.6 1.8 2.6-1.8 2.6z" fill="#f4f0ff"/>
      <path d="M5.5 29.4l14 5.2M5.5 34.6l14-5.2" stroke="${c}" stroke-width="1.3" opacity=".9"/>
      <rect x="1.4" y="28" width="3.6" height="8" rx="1.4" fill="url(#or)" ${W} stroke-width="1.4"/>
    </g>
    <path d="M8 10l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z" fill="#fff"/>`,

  /* Shōjo : fleur de cerisier, pétales en dégradé, une fleur plus petite et des pétales qui volent */
  sakura: (a, b, c) => {
    const pet = (col) => `<path d="M32 31c-7-6-9-17-2-24 1 3 3 3 4 0 7 7 5 18-2 24z" fill="${col}" ${W}/><path d="M32 29c-5-6-6-13-2-18" stroke="#fff" stroke-width="2" opacity=".75" fill="none" stroke-linecap="round"/><path d="M32 30l0-7" stroke="${shade(col, -.3)}" stroke-width="1.6" stroke-linecap="round"/>`;
    return `<path d="M50 50c3-1 6 0 7 3-3 1-6 0-7-3zM8 10c2-2 5-2 7 0-2 2-5 2-7 0zM56 14c1-3 4-4 6-3-1 3-3 4-6 3z" fill="${b}" ${W} stroke-width="1.4"/>` +
      [0, 72, 144, 216, 288].map(r => `<g transform="rotate(${r} 32 32)">${pet(b)}</g>`).join("") +
      `<circle cx="32" cy="32" r="6.5" fill="#ffd23f" ${W}/>` +
      [0, 60, 120, 180, 240, 300].map(r => `<g transform="rotate(${r} 32 32)"><path d="M32 25.5v-4" stroke="${shade(a, -.2)}" stroke-width="1.8"/><circle cx="32" cy="20.5" r="1.6" fill="${shade(a, -.2)}"/></g>`).join("") +
      `<g transform="translate(43 42) scale(.42)">${[0, 72, 144, 216, 288].map(r => `<g transform="rotate(${r} 32 32)"><path d="M32 31c-7-6-9-17-2-24 1 3 3 3 4 0 7 7 5 18-2 24z" fill="${c}" stroke="${O}" stroke-width="5"/></g>`).join("")}<circle cx="32" cy="32" r="6" fill="#ffd23f" stroke="${O}" stroke-width="5"/></g>`;
  },

  /* Sport : ballon de basket lancé, traînées de vitesse */
  ballon: (a, b, c) => `
    <path d="M1 20h15M0 30h12M1 40h13M4 50h12" stroke="${O}" stroke-width="7" stroke-linecap="round"/><path d="M1 20h15M0 30h12M1 40h13M4 50h12" stroke="${b}" stroke-width="3.6" stroke-linecap="round"/>
    <circle cx="38" cy="33" r="24" fill="#ff8a1f" ${W}/>
    <path d="M38 57a24 24 0 0 0 24-24c0-6-2-11-6-16a24 24 0 0 1-30 37c3 2 7 3 12 3z" fill="#e0640a"/>
    <circle cx="38" cy="33" r="24" fill="none" ${W}/>
    <path d="M14 33h48M38 9v48" fill="none" ${W} stroke-width="2.2"/><path d="M21 16c8 8 8 26 0 34M55 16c-8 8-8 26 0 34" fill="none" ${W} stroke-width="2.2"/>
    <path d="M24 17c4-4 10-5 15-5" stroke="#fff" stroke-width="3.2" stroke-linecap="round" opacity=".75" fill="none"/><circle cx="21" cy="24" r="1.8" fill="#fff" opacity=".75"/>`,

  /* Rap français : micro vintage doré, ondes sonores */
  micro: (a, b, c) => `
    <path d="M10 17c-5 7-5 16 0 23M3 12c-7 10-7 24 0 34M54 17c5 7 5 16 0 23M61 12c7 10 7 24 0 34" fill="none" stroke="${O}" stroke-width="6.4" stroke-linecap="round"/>
    <path d="M10 17c-5 7-5 16 0 23M3 12c-7 10-7 24 0 34M54 17c5 7 5 16 0 23M61 12c7 10 7 24 0 34" fill="none" stroke="${b}" stroke-width="3" stroke-linecap="round"/>
    <path d="M21 19a11 11 0 0 1 22 0v14H21z" fill="url(#or)" ${W}/>
    <path d="M36 9a11 11 0 0 1 7 10v14h-6V19c0-4-1-7-1-10z" fill="#c07a08" opacity=".6"/>
    <path d="M23 14h18M22 19h20M22 24h20M22 29h20M27 9.5v23M32 8v25M37 9.5v23" stroke="#8a5704" stroke-width="1.2" opacity=".75"/>
    <path d="M25 12c2-3 5-4 8-4" stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none"/>
    <rect x="18" y="32" width="28" height="7" rx="2.5" fill="${a}" ${W}/><path d="M21 34h22" stroke="#fff" stroke-width="1.4" opacity=".6"/>
    <path d="M25 39h14l-2.5 16h-9z" fill="#2a2440" ${W}/><path d="M29 41l1 12" stroke="#5a5276" stroke-width="2.2" stroke-linecap="round"/>
    <rect x="22" y="55" width="20" height="6" rx="2.5" fill="url(#or)" ${W}/>`,

  /* Pop : disque vinyle qui brille, étiquette colorée, note de musique */
  disque: (a, b, c) => `
    <circle cx="30" cy="34" r="27" fill="#15111f" ${W}/>
    <circle cx="30" cy="34" r="22.5" fill="none" stroke="#3a3350" stroke-width="1.1"/><circle cx="30" cy="34" r="19" fill="none" stroke="#3a3350" stroke-width="1.1"/><circle cx="30" cy="34" r="15.5" fill="none" stroke="#3a3350" stroke-width="1.1"/>
    <path d="M30 7a27 27 0 0 1 19 8L37 27a10 10 0 0 0-7-3z" fill="#fff" opacity=".18"/><path d="M30 61a27 27 0 0 1-19-8l12-12a10 10 0 0 0 7 3z" fill="#fff" opacity=".1"/>
    <circle cx="30" cy="34" r="11" fill="${a}" ${W}/><path d="M30 23a11 11 0 0 1 11 11h-5a6 6 0 0 0-6-6z" fill="${shade(a, .35)}"/>
    <circle cx="30" cy="34" r="6.5" fill="none" stroke="${b}" stroke-width="2.4"/><circle cx="30" cy="34" r="2.2" fill="#15111f"/>
    <path d="M9 22a24 24 0 0 1 12-11" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".65" fill="none"/>
    <path d="M48 6v16a4 4 0 1 1-3-4V9l14-4v14a4 4 0 1 1-3-4V8z" fill="${b}" ${W} stroke-width="1.8"/><path d="M49 9l9-2.5" stroke="#fff" stroke-width="1.4" opacity=".7"/>`,

  /* Rock : guitare électrique rouge à double pan coupé, dessinée à plat puis penchée ; éclair et notes autour */
  guitare: (a, b, c) => `
    <path d="M8 2 1 16h6l-4 12 12-16H9l5-10z" fill="${c}" ${W} stroke-width="2"/>
    <path d="M54 46v9a3 3 0 1 1-2-3v-8l8-2v8a3 3 0 1 1-2-3v-3z" fill="#fff" ${W} stroke-width="1.6"/>
    <g transform="translate(33 33) rotate(-40) scale(.94) translate(-28 -32)">
      <path d="M24 29.6h31v4.8H24z" fill="#d9a066" ${W}/><path d="M25 30.6h29" stroke="#f3cf9f" stroke-width="1.2"/>
      <path d="M28 29.6v4.8M32 29.6v4.8M35.6 29.6v4.8M39 29.6v4.8M42.2 29.6v4.8M45.2 29.6v4.8M48 29.6v4.8M50.6 29.6v4.8" stroke="#8a5a2b" stroke-width=".9"/>
      <circle cx="33.8" cy="32" r=".9" fill="#fff"/><circle cx="40.6" cy="32" r=".9" fill="#fff"/><circle cx="46.6" cy="32" r=".9" fill="#fff"/>
      <path d="M54 28.6l7-3 3 2.4v8l-3 2.4-7-3z" fill="#2a2440" ${W}/>
      <circle cx="57" cy="26.6" r="1.5" fill="url(#argent)" stroke="${O}" stroke-width="1"/><circle cx="61" cy="25.4" r="1.5" fill="url(#argent)" stroke="${O}" stroke-width="1"/>
      <circle cx="57" cy="37.4" r="1.5" fill="url(#argent)" stroke="${O}" stroke-width="1"/><circle cx="61" cy="38.6" r="1.5" fill="url(#argent)" stroke="${O}" stroke-width="1"/>
      <g transform="translate(-6 0) translate(14 32) scale(1.38) translate(-14 -32)">
      <path d="M26 21c-3 0-5 2-6 4-3-4-8-7-13-5-5 2-7 8-5 12-2 4 0 10 5 12 5 2 10-1 13-5 1 2 3 4 6 4-2-3-3-6-3-9s1-6 3-9z" fill="${a}" ${W}/>
      <path d="M2 32c-2 4 0 10 5 12 5 2 10-1 13-5 1 2 3 4 6 4-2-1-3-3-3-5-3 3-8 6-13 5-4-1-7-5-8-11z" fill="${shade(a, -.35)}"/>
      <path d="M26 21c-3 0-5 2-6 4-3-4-8-7-13-5-5 2-7 8-5 12-2 4 0 10 5 12 5 2 10-1 13-5 1 2 3 4 6 4-2-3-3-6-3-9s1-6 3-9z" fill="none" ${W}/>
      <path d="M22 33c-1 3-4 6-8 6.6-4 .4-7-1.6-8.4-4.6l-.6-2z" fill="#fff" ${W} stroke-width="1.6"/>
      <rect x="11" y="27.6" width="3.2" height="8.8" rx="1.2" fill="#2a2440" ${W} stroke-width="1.2"/><rect x="16" y="27.6" width="3.2" height="8.8" rx="1.2" fill="#2a2440" ${W} stroke-width="1.2"/>
      <path d="M12.6 29.4v.1M12.6 31.4v.1M12.6 33.4v.1M17.6 29.4v.1M17.6 31.4v.1M17.6 33.4v.1" stroke="#c9cfdc" stroke-width="1.4" stroke-linecap="round"/>
      <rect x="5.4" y="28" width="2.8" height="8" rx="1" fill="url(#argent)" ${W} stroke-width="1.2"/>
      <circle cx="9" cy="41.5" r="1.8" fill="url(#or)" stroke="${O}" stroke-width="1"/><circle cx="13.5" cy="43" r="1.8" fill="url(#or)" stroke="${O}" stroke-width="1"/>

      <path d="M6 23c2-2 5-3 8-2" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".6" fill="none"/>
      </g>
      <path d="M4 30.6h52M4 31.6h52M4 32.4h52M4 33.4h52" stroke="#eef1f8" stroke-width=".45"/>
    </g>`,

  /* K-pop : bâton lumineux en cœur, qui brille comme au concert */
  lightstick: (a, b, c) => `
    <circle cx="32" cy="22" r="21" fill="${b}" opacity=".22"/><circle cx="32" cy="22" r="15" fill="#fff" opacity=".2"/>
    <path d="M27 36h10l-1 24h-8z" fill="#f4f0ff" ${W}/><path d="M28 40h8M28 46h8M28 52h8" stroke="#c9c2e6" stroke-width="1.6"/><path d="M33 37l-.5 22" stroke="#fff" stroke-width="1.8"/>
    <rect x="25" y="33" width="14" height="5" rx="2" fill="${c}" ${W}/><rect x="26" y="59" width="12" height="4" rx="2" fill="${c}" ${W}/>
    <path d="M32 34C22 27 13 21 13 12c0-6 5-10 10-10 4 0 7 2 9 5 2-3 5-5 9-5 5 0 10 4 10 10 0 9-9 15-19 22z" fill="${b}" ${W}/>
    <path d="M32 30C24 24 18 19 18 12c0-4 3-6 6-6 3 0 6 2 8 5 2-3 5-5 8-5 3 0 6 2 6 6 0 7-6 12-14 18z" fill="${shade(b, .45)}"/>
    <path d="M20 9c1-2 3-3 5-3" stroke="#fff" stroke-width="2.6" stroke-linecap="round" fill="none"/><circle cx="18.5" cy="13" r="1.4" fill="#fff"/>
    <path d="M6 30l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5zM56 34l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2zM54 4l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z" fill="#fff"/>`,

  /* Disney & Pixar : château de conte, toits bleus, fanions dorés, étoiles */
  chateau: (a, b, c) => `
    <path d="M4 6l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1zM60 22l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z" fill="url(#or)"/>
    <path d="M9 62V30h11v32M44 62V30h11v32" fill="#f4f0ff" ${W}/><path d="M16 30h4v32h-4zM51 30h4v32h-4z" fill="#d9d1f5"/>
    <path d="M17 62V36h30v26" fill="#e6dfff" ${W}/><path d="M40 36h7v26h-7z" fill="#cfc5f0"/><path d="M17 36h30" ${W}/>
    <path d="M17 36v-4h4v4M25 36v-4h4v4M35 36v-4h4v4M43 36v-4h4v4" fill="#e6dfff" ${W} stroke-width="1.8"/>
    <path d="M7 30 14.5 10 22 30z" fill="${a}" ${W}/><path d="M14.5 10 22 30h-4z" fill="${shade(a, -.3)}"/>
    <path d="M42 30l7.5-20L57 30z" fill="${a}" ${W}/><path d="M49.5 10 57 30h-4z" fill="${shade(a, -.3)}"/>
    <path d="M23 32l9-26 9 26z" fill="${shade(a, .15)}" ${W}/><path d="M32 6l9 26h-4z" fill="${shade(a, -.25)}"/>
    <path d="M14.5 10V3l6 2-6 2M32 6V-1l6 2-6 2M49.5 10V3l6 2-6 2" fill="url(#or)" ${W} stroke-width="1.6"/>
    <path d="M27 62V52a5 5 0 0 1 10 0v10z" fill="#2a2440" ${W}/><path d="M32 47v15" stroke="#5a5276" stroke-width="1.4"/>
    <rect x="12.5" y="40" width="4" height="7" rx="2" fill="#2a2440"/><rect x="47.5" y="40" width="4" height="7" rx="2" fill="#2a2440"/><circle cx="32" cy="42" r="2.4" fill="url(#or)" stroke="${O}" stroke-width="1.2"/>
    <path d="M11 28l3-9M26 30l4-13" stroke="#fff" stroke-width="1.8" opacity=".65" stroke-linecap="round"/>`,

  /* Jeux vidéo : manette avec ses boutons de couleur, pixels qui s'envolent */
  manette: (a, b, c) => `
    <path d="M50 6h4v4h-4zM56 2h3v3h-3zM58 10h3v3h-3z" fill="${b}" ${W} stroke-width="1.2"/>
    <path d="M14 20h36c9 0 14 8 14 17v8c0 7-7 11-13 5l-8-8H21l-8 8c-6 6-13 2-13-5v-8c0-9 5-17 14-17z" fill="#f4f0ff" ${W}/>
    <path d="M64 37v8c0 7-7 11-13 5l-8-8H21l-8 8c-6 6-13 2-13-5v-2c0 6 7 9 12 4l8-8h24l8 8c5 5 12 2 12-4z" fill="#d6cff0"/>
    <path d="M14 20h36c9 0 14 8 14 17v8c0 7-7 11-13 5l-8-8H21l-8 8c-6 6-13 2-13-5v-8c0-9 5-17 14-17z" fill="none" ${W}/>
    <path d="M12 27h5v5h5v5h-5v5h-5v-5H7v-5h5z" fill="#2a2440" ${W} stroke-width="1.4"/><path d="M13 29h3" stroke="#5a5276" stroke-width="1.4"/>
    <circle cx="49" cy="28" r="3.4" fill="#ff4d6d" ${W} stroke-width="1.6"/><circle cx="56" cy="34" r="3.4" fill="#ffd23f" ${W} stroke-width="1.6"/>
    <circle cx="42" cy="34" r="3.4" fill="#3b8bff" ${W} stroke-width="1.6"/><circle cx="49" cy="40" r="3.4" fill="${a}" ${W} stroke-width="1.6"/>
    <circle cx="26" cy="39" r="4.4" fill="#4a4363" ${W} stroke-width="1.6"/><circle cx="25" cy="38" r="1.4" fill="#7a72a0"/>
    <path d="M27 27h10" stroke="${b}" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M8 25c3-3 6-4 10-4" stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none"/>`,

  /* Dessins animés : télé rétro en bois, mire arc-en-ciel à l'écran */
  tele: (a, b, c) => `
    <path d="M21 4l11 12 11-12" fill="none" stroke="${O}" stroke-width="5" stroke-linecap="round"/><path d="M21 4l11 12 11-12" fill="none" stroke="#9aa3ba" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="21" cy="4" r="2.8" fill="${c}" ${W} stroke-width="1.6"/><circle cx="43" cy="4" r="2.8" fill="${c}" ${W} stroke-width="1.6"/>
    <rect x="3" y="16" width="58" height="41" rx="9" fill="#cf7b2e" ${W}/>
    <path d="M61 25v23a9 9 0 0 1-9 9H12a9 9 0 0 1-9-9v-3a9 9 0 0 0 9 9h40a9 9 0 0 0 9-9z" fill="#a85a1a"/><rect x="3" y="16" width="58" height="41" rx="9" fill="none" ${W}/>
    <path d="M8 21h48" stroke="#eaa463" stroke-width="2.2" stroke-linecap="round"/>
    <rect x="8" y="22" width="37" height="30" rx="6" fill="#15111f" ${W}/>
    <g clip-path="url(#ecran)"><rect x="8" y="22" width="5.3" height="30" fill="#ff3b3b"/><rect x="13.3" y="22" width="5.3" height="30" fill="#ff9a1a"/><rect x="18.6" y="22" width="5.3" height="30" fill="#ffe14a"/><rect x="23.9" y="22" width="5.3" height="30" fill="#36e07f"/><rect x="29.2" y="22" width="5.3" height="30" fill="#3b8bff"/><rect x="34.5" y="22" width="5.3" height="30" fill="#9a5cff"/><rect x="39.8" y="22" width="5.3" height="30" fill="#ff5fb0"/>
      <path d="M8 22h37v6H8z" fill="#fff" opacity=".3"/></g>
    <rect x="8" y="22" width="37" height="30" rx="6" fill="none" ${W}/>
    <circle cx="53" cy="29" r="4" fill="#f4e3c9" ${W} stroke-width="1.6"/><path d="M53 26.5v3" stroke="${O}" stroke-width="1.6"/>
    <circle cx="53" cy="40" r="4" fill="#f4e3c9" ${W} stroke-width="1.6"/><path d="M51 40h3" stroke="${O}" stroke-width="1.6"/>
    <path d="M49 49h8M49 52h8" stroke="#7a3f10" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M12 57l-3 6M52 57l3 6" stroke="${O}" stroke-width="3.6" stroke-linecap="round"/>`,

  /* BD & comics : bulle « POW! » sur une explosion, trame de points */
  bulle: (a, b, c) => `
    <path d="M32 0l6 10 11-6-1 12 13 1-9 9 9 9-13 2 2 12-11-6-5 11-6-10-11 7 1-13-12-1 8-10-9-8 13-3-2-12 11 6z" fill="${c}" ${W}/>
    <path d="M32 9l4 7 7-4-1 8 8 1-6 5 6 6-8 1 1 8-7-4-3 7-4-7-7 4 1-8-8 0 5-6-6-5 9-2-1-8 7 4z" fill="#ffe14a"/>
    <path d="M14 18h34a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6H31l-11 11V44h-6a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6z" fill="#fff8d6" ${W}/>
    <rect x="11" y="20" width="41" height="22" rx="5" fill="url(#trame)"/><path d="M13 22h12" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
    <text x="31" y="38.5" text-anchor="middle" font-family="Bungee, Impact, sans-serif" font-size="15.5" fill="${O}" transform="rotate(-6 31 33)">POW!</text>`,
};
let uid = 0;
const dark = hex => { const n = parseInt(hex.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) < 110; };  // banderole foncée : texte blanc
const shade = (hex, f) => { const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f)); return "#" + c.map(v => v.toString(16).padStart(2, "0")).join(""); };
function pin(shape, sym, label, pal, locked, top, bottom){
  /* pas encore gagné : écusson tout noir, un petit cadenas au centre (il tremble quand on touche l'écusson) */
  if (locked) return `<svg viewBox="-6 -6 132 132" role="img" aria-label="Badge ${esc((top || label))} : pas encore gagné" class="locked" tabindex="0">
    <circle cx="60" cy="63" r="58" fill="#000" opacity=".45"/>
    <circle cx="60" cy="60" r="57" fill="#0b0910"/>
    <circle cx="60" cy="60" r="55" fill="none" stroke="#1d1a26" stroke-width="5" stroke-dasharray="1.1 1.3"/>
    <circle cx="60" cy="60" r="49" fill="none" stroke="#1d1a26" stroke-width="1" stroke-dasharray="2.4 2"/>
    <circle cx="60" cy="60" r="37" fill="#100e16" stroke="#1d1a26" stroke-width="2"/>
    <g class="cadenas">
      <path d="M50 58v-6a10 10 0 0 1 20 0v6" fill="none" stroke="#4d4762" stroke-width="5" stroke-linecap="round"/>
      <rect x="45" y="57" width="30" height="23" rx="5" fill="#4d4762"/>
      <rect x="45" y="57" width="30" height="7" rx="3" fill="#5f5878"/>
      <circle cx="60" cy="67" r="3.4" fill="#100e16"/><path d="M58.6 68.5h2.8l.9 6h-4.6z" fill="#100e16"/>
    </g>
  </svg>`;
  const id = "p" + (uid++), [a, b, c] = pal;
  top = (top || label).toUpperCase(); bottom = (bottom || "POPITES").toUpperCase();
  const ring = locked ? "#4a4560" : shade(a, -.12);            // anneau : la couleur du sous-genre, un peu plus soutenue
  const edge = locked ? "#2e2a3d" : shade(a, -.45);            // bord surpiqué, plus foncé
  const core = locked ? "#575170" : shade(b, .55);             // centre : une teinte claire
  const ink = locked ? "#8d87a6" : "#ffffff";
  const fs = t => t.length > 17 ? 7.6 : t.length > 13 ? 8.6 : 9.8;
  const deco = [[13, 60], [107, 60]].map(([x, y]) => `<path d="M${x} ${y - 5}l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z" fill="${locked ? "#8d87a6" : "#fff"}" stroke="${edge}" stroke-width=".8"/>`).join("");
  const stars = locked ? "" : [[8, 10, 0, .9], [114, 22, .9, .7], [110, 112, 1.7, .8]].map(([x, y, dl, s]) =>
    `<path class="spark" style="animation-delay:${dl}s" d="M${x} ${y - 8 * s}l${2 * s} ${6 * s} ${6 * s} ${2 * s}-${6 * s} ${2 * s}-${2 * s} ${6 * s}-${2 * s}-${6 * s}-${6 * s}-${2 * s} ${6 * s}-${2 * s}z" fill="#fffbe6"/>`).join("");
  const art = locked
    ? `<g transform="translate(34.4 34.4) scale(.8)" opacity=".28" style="filter:grayscale(1)">${ILL[sym](a, b, c)}</g>`
    : `<g filter="url(#brode)"><g transform="translate(34.4 34.4) scale(.8)">${ILL[sym](a, b, c)}</g></g>`;       // 64 × 0,8 = 51 px, au centre
  return `<svg viewBox="-6 -6 132 132" role="img" aria-label="Badge ${top}${locked ? " (pas encore gagné)" : ""}" class="${locked ? "locked" : ""}">
    <defs>
      <clipPath id="${id}c"><circle cx="60" cy="60" r="35.5"/></clipPath><clipPath id="${id}o"><circle cx="60" cy="60" r="58"/></clipPath>
      <clipPath id="ecran"><rect x="8" y="22" width="37" height="30" rx="6"/></clipPath>
      <path id="${id}h" d="M18.5 60 A41.5 41.5 0 0 1 101.5 60"/>
      <path id="${id}b" d="M13 60 A47 47 0 0 0 107 60"/>
    </defs>
    <circle cx="60" cy="63" r="58" fill="#000" opacity=".45"/>
    <!-- bord surpiqué : un gros fil qui fait tout le tour -->
    <circle cx="60" cy="60" r="57" fill="${edge}"/>
    <circle cx="60" cy="60" r="55" fill="none" stroke="${shade(edge, .25)}" stroke-width="5" stroke-dasharray="1.1 1.3"/>
    <!-- anneau brodé, fils dans le sens du cercle -->
    <circle cx="60" cy="60" r="51" fill="${ring}"/>
    <circle cx="60" cy="60" r="51" fill="url(#fil)" opacity=".55"/>
    <circle cx="60" cy="60" r="49" fill="none" stroke="#fff" stroke-width=".9" stroke-dasharray="2.4 2" opacity=".55"/>
    <text font-family="Bungee, Impact, sans-serif" font-size="${fs(top)}" fill="${ink}" letter-spacing="1" text-anchor="middle" stroke="${edge}" stroke-width="2.2" paint-order="stroke" stroke-linejoin="round"><textPath href="#${id}h" startOffset="50%">${top}</textPath></text>
    <text font-family="Bungee, Impact, sans-serif" font-size="${fs(bottom)}" fill="${ink}" letter-spacing="1" text-anchor="middle" stroke="${edge}" stroke-width="2.2" paint-order="stroke" stroke-linejoin="round"><textPath href="#${id}b" startOffset="50%">${bottom}</textPath></text>
    ${deco}
    <!-- centre brodé : fond clair, points de couture, illustration -->
    <circle cx="60" cy="60" r="37.5" fill="${edge}"/>
    <circle cx="60" cy="60" r="35.5" fill="${core}"/>
    <g clip-path="url(#${id}c)"><rect x="20" y="20" width="80" height="80" fill="url(#fil2)" opacity=".6"/>
      <circle cx="60" cy="96" r="30" fill="${shade(core, -.12)}"/></g>
    <circle cx="60" cy="60" r="32.5" fill="none" stroke="${shade(core, -.25)}" stroke-width=".9" stroke-dasharray="2.2 2"/>
    ${art}
    <g clip-path="url(#${id}o)"><circle class="glare" cx="-60" cy="-60" r="50" fill="url(#glare)" opacity=".6"/></g>
    ${stars}
  </svg>`;
}

  /* ---------- branchement dans le jeu ---------- */
  const esc = s => String(s).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  /* chaque sous-genre : illustration, couleurs (fond, principale, accent), devise brodée en bas, nom du badge */
  const DATA = {
    "series-med":    ["stethoscope", ["#0fb5a6", "#7ff5dc", "#ff4d6d"], "Docteur certifié", "Stéthoscope"],
    "series-pol":    ["pistolet", ["#2b3a9e", "#ffd23f", "#ff3b5c"], "Brigade Popites", "Revolver"],
    "series-fan":    ["cristal", ["#6d28d9", "#3ddc97", "#ff7a1a"], "Au-delà du réel", "Boule de cristal"],
    "series-com":    ["masques", ["#ff9f1c", "#ffd23f", "#b14bff"], "Rire garanti", "Masques"],
    "manga-shonen":  ["eclair", ["#ff5a1f", "#ffb02e", "#ff2d55"], "Niveau max", "Éclair"],
    "manga-seinen":  ["lame", ["#b3001b", "#2a2440", "#ff4d6d"], "Voie du sabre", "Katana"],
    "manga-shojo":   ["sakura", ["#c06bff", "#ff9ccf", "#ffd6ec"], "Cœur en fleur", "Fleur de cerisier"],
    "manga-sport":   ["ballon", ["#16a34a", "#c6ff3d", "#ff8a1f"], "Équipe titulaire", "Ballon"],
    "musique-rapfr": ["micro", ["#7c3aed", "#ffd23f", "#ff4d9d"], "Flow certifié", "Micro"],
    "musique-pop":   ["disque", ["#ff2e93", "#22d3ee", "#ffe14a"], "Disque de platine", "Disque"],
    "musique-rock":  ["guitare", ["#e11d2e", "#2a2440", "#ffd23f"], "Toujours plus fort", "Guitare électrique"],
    "musique-kpop":  ["lightstick", ["#ff5fb0", "#ff2e6d", "#b47dff"], "Fan club officiel", "Bâton lumineux"],
    "perso-disney":  ["chateau", ["#2f5bea", "#8fb5ff", "#ffd23f"], "Il était une fois", "Château"],
    "perso-jv":      ["manette", ["#22c55e", "#ff3fd2", "#3b8bff"], "Partie gagnée", "Manette"],
    "perso-anim":    ["tele", ["#0ea5a5", "#ffd23f", "#ff4d6d"], "Samedi matin", "Télé"],
    "perso-bd":      ["bulle", ["#ffcc00", "#ff3b3b", "#ff3b3b"], "Série complète", "Bulle"],
  };
  /* les dégradés, motifs et filtres des écussons, posés une fois dans la page */
  function defs(){
    if (document.getElementById("bdg-defs")) return;
    const d = document.createElement("div"); d.id = "bdg-defs"; d.innerHTML = DEFS; document.body.appendChild(d.firstElementChild);
  }
  /* un écusson : key = "series-med"…, name = nom du sous-genre (brodé en haut) */
  function svg(key, name, locked){
    defs();
    const [sym, pal, devise] = DATA[key];
    return pin("medaille", sym, name, pal, locked, name, devise);
  }
  const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* l'écusson gagné s'incline vers le doigt, un reflet le suit ; le verrouillé fait trembler son cadenas */
  function bind(root){
    root.querySelectorAll("svg").forEach(s => {
      if (s.classList.contains("locked")) {
        const shake = () => { s.classList.remove("secoue"); void s.getBoundingClientRect(); s.classList.add("secoue"); };
        s.addEventListener("click", shake);
        s.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); shake(); } });
        return;
      }
      if (calm()) return;
      const glare = s.querySelector(".glare");
      s.addEventListener("pointermove", e => {
        const r = s.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        s.style.transform = `perspective(600px) rotateY(${(x - .5) * 26}deg) rotateX(${(.5 - y) * 22}deg) scale(1.06)`;
        if (glare) { glare.setAttribute("cx", (-6 + x * 132).toFixed(1)); glare.setAttribute("cy", (-6 + y * 132).toFixed(1)); }
      });
      s.addEventListener("pointerleave", () => { s.style.transform = ""; if (glare) { glare.setAttribute("cx", -60); glare.setAttribute("cy", -60); } });
    });
  }
  /* l'écrin du profil : subs = [{key, name, cat, own, total}] rangés par catégorie */
  function ecrin(cats){
    const all = cats.flatMap(c => c.subs), won = all.filter(x => x.own >= x.total).length;
    return `<div class="ecrin"><div class="velours">
      <div class="plaque titre">MA COLLECTION · ${won}/${all.length}</div>
      <div class="rangees">${cats.map(c => `<div class="rangee"><div class="plaque">${esc(c.name.toUpperCase())}</div><div class="alveoles">
        ${c.subs.map(x => { const done = x.own >= x.total;
          return `<div class="alveole" title="${esc(x.name)}">${svg(x.key, x.name, !done)}${done ? "" : `<small>${x.own}/${x.total}</small>`}</div>`; }).join("")}
      </div></div>`).join("")}</div>
    </div><div class="vitre" aria-hidden="true"></div></div>`;
  }
  /* déblocage : le badge arrive en tournant, la lumière explose derrière, les confettis tombent ; un par un s'il y en a plusieurs */
  function debloquer(list, done){
    if (!list.length) { done && done(); return; }
    defs();
    const [x, ...rest] = list, [, pal] = DATA[x.key];
    let m = document.getElementById("debloque");
    if (!m) {
      m = document.createElement("div"); m.id = "debloque"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true"); m.setAttribute("aria-label", "Badge débloqué");
      m.innerHTML = `<div class="burst" aria-hidden="true"></div><div class="conf" aria-hidden="true"></div>
        <div class="dbl-box"><div class="tag">NOUVEAU BADGE</div><div class="show"></div><p class="what"></p><button type="button" class="close btn">Génial !</button></div>`;
      document.body.appendChild(m);
    }
    m.querySelector(".show").innerHTML = svg(x.key, x.name, false);
    m.querySelector(".what").textContent = `Sous-genre complété : ${x.name} !`;
    const conf = m.querySelector(".conf"); conf.innerHTML = "";
    if (!calm()) for (let i = 0; i < 70; i++) {
      const p = document.createElement("i");
      p.style.cssText = `left:${50 + (Math.random() - .5) * 20}%;background:${i % 5 ? pal[i % 3] : "#fff"};--dx:${(Math.random() - .5) * 120}vw;--dy:${40 + Math.random() * 60}vh;--r:${Math.random() * 900}deg;animation-delay:${1.5 + Math.random() * .3}s;width:${6 + Math.random() * 6}px;height:${8 + Math.random() * 8}px`;
      conf.appendChild(p);
    }
    m.hidden = false; m.classList.remove("on"); void m.offsetWidth; m.classList.add("on");
    bind(m.querySelector(".show"));
    const btn = m.querySelector(".close");
    const close = () => { m.hidden = true; m.onclick = null; document.removeEventListener("keydown", esc2); debloquer(rest, done); };
    const esc2 = e => { if (e.key === "Escape") close(); };
    btn.onclick = close; m.onclick = e => { if (e.target === m) close(); };
    document.addEventListener("keydown", esc2);
    setTimeout(() => btn.focus(), 50);
  }
  return { svg, ecrin, bind, debloquer, names: k => DATA[k] && DATA[k][3] };
})();
