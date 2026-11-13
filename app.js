/* ---------- Métriques ---------- */
const METRICS = {
  imdb:   {fmt:v=>`${v.toFixed(1).replace(".",",")}/10 sur IMDb`, unit:v=>v.toString().replace(".",","), name:"Note IMDb"},
  sales:  {fmt:v=>`${v} M d'ex. vendus`, unit:v=>v+" M", name:"Ventes"},
  spotify:{fmt:v=>`${v} M d'auditeurs`, unit:v=>v+" M", name:"Auditeurs mensuels Spotify"},
  google: {fmt:v=>`${v}/100 popularité`, unit:v=>v, name:"Indice de recherches Google"},
  views:  {fmt:v=>`${v.toLocaleString("fr-FR")} vues`, unit:v=>v.toLocaleString("fr-FR"), name:"Vues Wikipédia FR sur 12 mois"},
};
const RAR = {P:"Popites",L:"Légendaire",E:"Épique",R:"Rare",PU:"Peu commune",C:"Commune"};
const ORDER = ["C","PU","R","E","L","P"];
/* chances de chaque carte d'un booster : jamais de légendaire ni de Popites par ce tirage */
const DROP = {C:45,PU:28,R:16,E:8};
/* bande coincée : 1 booster sur 20 cache une légendaire que le joueur n'a pas encore, et 1 sur 20 de ceux-là la Popites à la place */
const JAM_CHANCE = .05, POPITES_SHARE = .05;
const PACK_SIZE = 10;

/* ---------- Badges : un écusson brodé par sous-genre complété (dessins et animations dans badges.js) ---------- */


/* cartes générées (collections.js) : rareté calculée au rang dans le sous-genre, id = identifiant Wikidata (stable d'une génération à l'autre) */
const RANK_SHARE = {L:8,E:15,R:22,PU:25,C:30};
COLLECTIONS.forEach(c=>{
  c.all=[];
  c.subs.forEach(s=>{
    s.cards=s.cards.map(([title,sub,v,r,qid,pal,sym,yr,img,credit,blurb],i)=>({id:qid, n:i+1, title, sub, v, r, pal, sym, yr, img, credit, blurb, s}));
    c.all.push(...s.cards);
  });
  c.quiz=QUESTIONS[c.id]||[];
});
const colById = id => COLLECTIONS.find(c=>c.id===id);

/* ---------- État (sauvegardé dans ce navigateur) ---------- */
const KEY="culturedeck-v2";
const today=()=>{const d=new Date();return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`};
function fresh(){return {owned:{},packs:COLLECTIONS.map(c=>({c:c.id,g:"",src:"Bienvenue"})),claimed:{},quizDate:today(),quizDone:{},
  free:{stock:2,t:Date.now()},stats:{opened:0,quizWon:0},pseudo:"",
  pid:Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4),friends:[]}}
let S;
try{S=JSON.parse(localStorage.getItem(KEY))||fresh()}catch(e){S=fresh()}
S.claimed=S.claimed||{};
S.free=S.free||{stock:2,t:Date.now()};
S.stats=S.stats||{opened:0,quizWon:0};
/* identifiant anonyme du profil (pour que la fiche d'un ami se mette à jour au lieu d'être dupliquée) et liste d'amis */
S.pid=S.pid||Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);
S.friends=Array.isArray(S.friends)?S.friends:[];
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
/* quiz du jour : un par catégorie, remis à zéro à minuit */
if(S.quizDate!==today()||!S.quizDone){S.quizDate=today();S.quizDone={}}
delete S.quizLeft;

/* booster gratuit : un toutes les 20 min (3 par heure), 10 en stock maximum ; le compteur s'arrête quand le stock est plein */
const FREE_EVERY=20*60*1000, FREE_MAX=10;
function tickFree(){
  const f=S.free, now=Date.now();
  if(f.stock>=FREE_MAX){f.t=now;return false}
  const n=Math.floor((now-f.t)/FREE_EVERY); if(n<=0) return false;
  f.stock=Math.min(FREE_MAX,f.stock+n);
  f.t=f.stock>=FREE_MAX?now:f.t+n*FREE_EVERY;
  return true;
}
const freeNext=()=>S.free.stock>=FREE_MAX?0:FREE_EVERY-(Date.now()-S.free.t);

/* quiz express : 3 par jour, 5 questions difficiles, 3 bonnes réponses pour débloquer un booster tout de suite */
const EXPRESS_PER_DAY=3, EXPRESS_QS=5, EXPRESS_NEED=4;
function expressLeft(){if(!S.express||S.express.day!==today())S.express={day:today(),left:EXPRESS_PER_DAY};return S.express.left}
tickFree(); save();

/* gratuit, express, boutique : la catégorie est tirée au sort à l'ouverture */
const randomCol=()=>COLLECTIONS[Math.floor(Math.random()*COLLECTIONS.length)];

let view=S.packs.length&&!Object.keys(S.owned).length?"packs":"album", curCol=COLLECTIONS[0].id, quiz=null;

/* ---------- Utilitaires ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function hash(s){let h=0;for(const ch of s)h=(h*31+ch.charCodeAt(0))>>>0;return h}
const STOP=new Set(["the","le","la","les","de","du","of","l","d","a","no","ni","et","&"]);
function mono(t){
  const w=t.replace(/[^\p{L}\p{N}\s]/gu," ").split(/\s+/).filter(x=>x&&!STOP.has(x.toLowerCase()));
  if(!w.length) return t.slice(0,2).toUpperCase();
  if(w.length===1) return w[0].slice(0,2).toUpperCase();
  return w.slice(0,3).map(x=>x[0]).join("").toUpperCase();
}
const has=k=>!!S.owned[k.id];
const ownedIn=list=>list.filter(has).length;
const dupesIn=list=>list.reduce((s,k)=>s+Math.max(0,(S.owned[k.id]||0)-1),0);
const pad=(n,of=99)=>String(n).padStart(Math.max(2,String(of).length),"0");

/* symboles de fond (symboles.js) : un motif en damier par symbole, déclaré une seule fois pour toutes les cartes */
(function symbolTiles(){
  const css=Object.entries(SYMBOLES).map(([n,p])=>{
    const s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" stroke="white" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round"><g transform="translate(2 2) scale(1.4)">${p}</g><g transform="translate(22 22) scale(1.4) rotate(18 6 6)">${p}</g></svg>`;
    return `.s-${n}{--tile:url('data:image/svg+xml,${encodeURIComponent(s)}')}`;
  }).join("\n");
  const el=document.createElement("style"); el.textContent=css; document.head.appendChild(el);
})();
function lum(hex){const n=parseInt(hex.slice(1),16),c=[n>>16,(n>>8)&255,n&255].map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4});return .2126*c[0]+.7152*c[1]+.0722*c[2];}
/* petit tirage toujours le même pour une carte : le sens du dégradé change d'une carte à l'autre */
function seeded(seed){let h=2166136261;for(const ch of seed)h=Math.imul(h^ch.charCodeAt(0),16777619);return()=>((h=Math.imul(h^(h>>>15),2246822507)^Math.imul(h^(h>>>13),3266489909))>>>0)/4294967296}
/* taille du nom en grand : la plus grande où aucun mot n'est coupé et où tout tient dans la carte */
/* mode : "" (carte sans image), "pic" (personnage détouré à côté du nom), "photo" (nom sous la fenêtre photo, peu de place en hauteur) */
function bigSize(title,mode){
  const words=title.toUpperCase().split(/\s+/);
  const [room,start,tall]={pic:[46,12,40],photo:[86,11,17]}[mode]||[76,24,46];
  for(let s=start;s>=5;s-=.5){
    const max=Math.floor(room/(s*.74));let lines=1,cur=0,ok=true;
    for(const w of words){if(w.length>max){ok=false;break}if(cur&&cur+1+w.length>max){lines++;cur=w.length}else cur+=(cur?1:0)+w.length}
    if(ok&&lines*s*.98<=tall)return s;
  }
  return 5;
}
/* image détourée : réglage de base (116 %, 12 % du bord droit, -3 % en bas ; centrée si l'image est large),
   ou réglage de la carte [taille, vers le bord, hauteur, côté d/g, miroir, rotation] fait avec outils\reglage-images.html */
function picStyle(t){
  const [h,x,y,side,m,rot]=t, tr=[rot?`rotate(${rot}deg)`:"",m?"scaleX(-1)":""].filter(Boolean).join(" ");
  return `height:${h}%;bottom:${y}%;${side==="g"?`left:${x}%;right:auto`:`right:${x}%`}${tr?`;transform:${tr}`:""}`;
}
function picHTML(k){
  return Array.isArray(k.img)
    ? `<img src="img/${k.id}.webp" alt="" loading="lazy" style="${picStyle(k.img)}">`
    : `<img src="img/${k.id}.webp" alt="" loading="lazy" onload="if(this.naturalWidth>this.naturalHeight*.8)this.classList.add('wide')">`;
}
/* carte : dégradé + symbole, année en filigrane, personnage détouré (si une image a été choisie), nom en grand, infos ;
   le tour de la carte porte la couleur de la rareté */
function cardHTML(c,k,opts={}){
  const cnt=S.owned[k.id]||0, [p0,p1,p2]=k.pal, light=(lum(p0)+lum(p1)+lum(p2))/3>.4;
  const r=seeded(k.title), ang=Math.round(110+r()*120), mid=Math.round(38+r()*30);
  const st=`--g:linear-gradient(${ang}deg,${p0} 0%,${p1} ${mid}%,${p2} 100%);--ink:${light?"#15121a":"#ffffff"};--inv:${light?"#ffffff":"#15121a"};--shade:${light?"rgba(255,255,255,.35)":"rgba(0,0,0,.35)"}`;
  const photo=k.img===2, cut=k.img&&!photo;   // photo libre dans sa fenêtre (chanteurs) ou personnage détouré
  return `<div class="card r-${k.r}${cut?" has-pic":""}${photo?" photo":""}${k.img&&k.img[3]==="g"?" pic-g":""}" aria-label="${esc(k.title)}, ${RAR[k.r]}">
    <div class="in s-${k.sym}" style="${st}">
      <div class="lay sym"></div>
      ${photo?"":`<div class="lay yr">${k.yr||""}</div>`}
      ${cut?`<div class="lay pic">${picHTML(k)}</div>`:""}
      <div class="lay front">
        <div class="top"><span>${k.s.short}</span><span class="n">${pad(k.n,k.s.cards.length)}/${k.s.cards.length}</span></div>
        ${photo?`<div class="win"><img src="img/${k.id}.webp" alt="${esc(k.title)}" loading="lazy"></div>`:""}
        <div class="mid"><span class="big" style="font-size:${bigSize(k.title,photo?"photo":cut?"pic":"")}cqw">${esc(k.title)}</span></div>
        <div class="sub">${esc(k.sub)}</div>
        ${k.img&&k.credit?`<div class="credit">${esc(k.credit)}</div>`:""}
        <div class="stat"><span>${METRICS[c.metric].fmt(k.v)}</span><span class="chip">${RAR[k.r]}</span></div>
      </div>
    </div>
    ${opts.count!==false&&cnt>1?`<span class="count">×${cnt}</span>`:""}
    ${opts.isNew?`<span class="new">NOUVELLE</span>`:""}
  </div>`;
}

/* ---------- Vues ---------- */
function updateTabs(){
  document.querySelectorAll(".tab").forEach(t=>t.setAttribute("aria-current",t.dataset.v===view));
  const nPacks=S.packs.length+S.free.stock;
  $("#tab-packs").innerHTML=`Boosters${nPacks?`<span class="badge">${nPacks}</span>`:""}`;
  const qLeft=COLLECTIONS.filter(c=>!S.quizDone[c.id]).length;
  $("#tab-quiz").innerHTML=`Quiz du jour${qLeft?`<span class="badge">${qLeft}</span>`:""}`;
  const all=COLLECTIONS.reduce((s,c)=>s+c.all.length,0), got=COLLECTIONS.reduce((s,c)=>s+ownedIn(c.all),0);
  $("#total").innerHTML=`<strong>${got}</strong> / ${all} cartes`;
}
function render(){updateTabs();({album:renderAlbum,quiz:renderQuiz,packs:renderPacks,profile:renderProfile,shop:renderShop,poll:renderPoll,info:renderInfo,legal:renderLegal})[view]();}

function renderAlbum(){
  const c=colById(curCol), d=dupesIn(c.all);
  $("#view").innerHTML=`
    <div class="kicker">Album</div>
    <h1>Tes collections</h1>
    <p class="lede">Quatre grandes catégories, chacune découpée en sous-genres. Complète un sous-genre pour gagner son badge et un booster avec une carte épique garantie.</p>
    <div class="colpick">${COLLECTIONS.map(x=>{const o=ownedIn(x.all),p=Math.round(o/x.all.length*100);
      return `<button class="colbtn" id="col-${x.id}" data-col="${x.id}" aria-pressed="${x.id===curCol}">
        <span class="kicker">${x.subs.length} sous-genres</span><span class="nm">${esc(x.name)}</span>
        <span class="prog"><i style="width:${p}%"></i></span>
        <span class="meta"><span>${o}/${x.all.length}</span><span>${p===100?"Complète !":p+" %"}</span></span></button>`}).join("")}</div>
    <div class="colhead">
      <div><h2>${esc(c.name)}</h2><p class="lede">${esc(c.desc)}</p>
        <div class="jump">${c.subs.map(s=>{const o=ownedIn(s.cards);return `<a href="#sub-${c.id}-${s.id}" class="${o===s.cards.length?"done":""}">${esc(s.name)}<span>${o}/${s.cards.length}</span></a>`}).join("")}</div></div>
      <div class="dupes"><span>Doublons : <strong>${d}</strong></span>
        <button class="btn sm" id="swap" ${d<5?"disabled":""}>Échanger 5 doublons contre un booster</button></div>
    </div>
    ${c.subs.map(s=>{
      const o=ownedIn(s.cards), done=o===s.cards.length, key=`${c.id}-${s.id}`, claimed=S.claimed[key];
      return `<section class="subsec" id="sub-${key}">
        <div class="subhead">
          <div class="l"><h3>${esc(s.name)}</h3><small>${o}/${s.cards.length} cartes · badge « ${esc(BADGE.names(key))} » ${done?"obtenu":"à gagner"}</small></div>
          <div class="reward">${claimed?`<span class="pill got">Récompense récupérée</span>`:
            done?`<button class="btn sm" data-claim="${key}">Récupérer le booster épique</button>`:
            `<span class="pill">Récompense : booster épique garanti</span>`}</div>
        </div>
        <div class="grid">${s.cards.map(k=>has(k)?cardHTML(c,k):
          `<div class="missing" aria-label="Carte ${k.n} manquante"><span class="q">?</span><span class="n">${pad(k.n)}</span></div>`).join("")}</div>
      </section>`}).join("")}`;
  document.querySelectorAll(".colbtn").forEach(b=>b.onclick=()=>{curCol=b.dataset.col;render()});
  document.querySelectorAll("[data-claim]").forEach(b=>b.onclick=()=>{
    S.claimed[b.dataset.claim]=true;
    const s=c.subs.find(x=>`${c.id}-${x.id}`===b.dataset.claim);
    S.packs.push({c:c.id,g:"E",src:s.name+" complète"});save();render();
  });
  $("#swap").onclick=()=>{
    let need=5;
    while(need>0){const k=c.all.filter(k=>(S.owned[k.id]||0)>1).sort((a,b)=>S.owned[b.id]-S.owned[a.id])[0];if(!k)break;S.owned[k.id]--;need--}
    S.packs.push({c:c.id,g:"",src:"Échange"});save();render();
  };
}

function renderQuiz(){
  if(quiz) return renderQuestion();
  $("#view").innerHTML=`
    <div class="quizhead">
      <div><div class="kicker">Quiz du jour</div><h1>Gagne un booster thématique</h1>
      <p class="lede">Un quiz par catégorie et par jour. 5 questions de niveau moyen à difficile : avec 3 bonnes réponses ou plus, tu gagnes un booster de la catégorie avec au moins une carte rare garantie.</p></div>
      <div><div class="kicker" style="margin-bottom:6px">Quiz restants aujourd'hui</div><div class="tokens">${COLLECTIONS.map(c=>`<i class="${S.quizDone[c.id]?"":"on"}" title="${esc(c.name)}"></i>`).join("")}</div></div>
    </div>
    <div class="themes">${COLLECTIONS.map(c=>{const done=S.quizDone[c.id];return `
      <button class="theme" id="th-${c.id}" data-col="${c.id}" ${done?"disabled":""}>
        <span class="kicker">${ownedIn(c.all)}/${c.all.length} cartes</span>
        <span class="t">${esc(c.name)}</span>
        <span class="d">${done?"Déjà fait aujourd'hui, reviens demain":"Lancer le quiz"}</span>
      </button>`}).join("")}</div>
    <div class="rules"><span>Un quiz commencé est décompté, même abandonné.</span><span>Les quiz se rechargent à minuit.</span></div>`;
  document.querySelectorAll(".theme").forEach(b=>b.onclick=()=>{
    const c=colById(b.dataset.col);
    if(S.quizDone[c.id]) return;
    S.quizDone[c.id]=true;save();
    startQuiz(c,"daily");
  });
}
/* ---------- Signalement d'une question ---------- */
/* où arrivent les signalements : le lien du formulaire Framaforms (champ « Signalement » prérempli via [current-page:query:signalement]),
   ou une adresse « mailto:… ». Vide : gardé seulement sur l'appareil. Mode d'emploi : generation\formulaire-signalement.md */
const REPORT_TO="https://framaforms.org/popites-signaler-une-question-1793529699";
const REPORT_WHY=[["fausse","La bonne réponse est fausse"],["plusieurs","Plusieurs réponses sont justes"],["confuse","La question est mal écrite ou pas claire"],["autre","Autre problème"]];
S.reported=S.reported||{};
function reportText(c,q,why,note){
  return `Signalement Popites — question ${q.id}\nCatégorie : ${c.name}\nQuestion : ${q.q}\nRéponse donnée comme bonne : ${q.right}\nChoix proposés : ${q.opts.join(" / ")}\nProblème : ${REPORT_WHY.find(w=>w[0]===why)[1]}${note?`\nPrécision : ${note}`:""}`;
}
function openReport(c,q){
  const box=$("#report"); box.hidden=false; $("#q-report").hidden=true;
  box.innerHTML=`<div class="kicker">Signaler cette question</div>
    <div class="choices">${REPORT_WHY.map(([k,l],i)=>`<label class="choice"><input type="radio" name="why" value="${k}" ${i?"":"checked"}><span>${l}</span></label>`).join("")}</div>
    <input type="text" id="r-note" maxlength="200" placeholder="Une précision ? (facultatif, ex. la vraie réponse)" aria-label="Précision">
    <div class="row"><button class="btn sm" id="r-send">Envoyer</button><button class="btn ghost sm" id="r-cancel">Annuler</button><span class="note" id="r-msg"></span></div>`;
  $("#r-cancel").onclick=()=>{box.hidden=true;$("#q-report").hidden=false};
  $("#r-send").onclick=async()=>{
    const why=box.querySelector('input[name=why]:checked').value, note=$("#r-note").value.trim().slice(0,200);
    const text=reportText(c,q,why,note);
    S.reported=S.reported||{}; S.reported[q.id]=why; save();   // cette question ne sera plus posée sur cet appareil
    let msg="Merci ! Cette question ne te sera plus posée.";
    if(REPORT_TO.startsWith("mailto:")){
      location.href=`${REPORT_TO}?subject=${encodeURIComponent("Popites : signalement "+q.id)}&body=${encodeURIComponent(text)}`;
      msg+=" Ton application mail s'ouvre avec le signalement prêt à envoyer.";
    }else if(REPORT_TO){
      /* Framaforms préremplit le champ dont la valeur par défaut est [current-page:query:signalement] ; on copie aussi le texte au cas où */
      try{await navigator.clipboard.writeText(text);msg+=" Le formulaire s'ouvre avec ton signalement (il est aussi copié, au cas où : colle-le s'il n'apparaît pas)."}catch(e){msg+=" Le formulaire s'ouvre avec ton signalement. S'il n'apparaît pas, indique le code "+q.id+"."}
      window.open(REPORT_TO+(REPORT_TO.includes("?")?"&":"?")+"signalement="+encodeURIComponent(text),"_blank","noopener");
    }
    box.innerHTML=`<p class="note">${esc(msg)}</p>`;
  };
}

/* le quiz express donne 2 essais ; le second reprend la même catégorie avec d'autres questions */
function startQuiz(c,mode,attempt=1,used=[]){
  /* quiz du jour : niveaux moyen et difficile ; quiz express : difficile et très difficile ; jamais une question que le joueur a signalée */
  const ex=mode==="express", lv=ex?[1,2]:[0,1];
  const pool=shuffle(c.quiz.filter(x=>lv.includes(x[2])&&!used.includes(x[0])&&!(S.reported||{})[x[3]]));
  const qs=pool.slice(0,ex?EXPRESS_QS:5);
  quiz={c:c.id,mode,attempt,used:[...used,...qs.map(x=>x[0])],need:ex?EXPRESS_NEED:3,qs:qs.map(([q,a,,id])=>({q,id,right:a[0],opts:shuffle(a)})),i:0,res:[]};
  view="quiz";render();window.scrollTo(0,0);
}

function renderQuestion(){
  const c=colById(quiz.c), total=quiz.qs.length, ex=quiz.mode==="express", label=ex?"Quiz express":"Quiz";
  if(quiz.i>=total){
    const score=quiz.res.filter(Boolean).length, win=score>=quiz.need;
    if(win&&!quiz.rewarded){S.packs.push(ex?{c:null,g:"",src:"Quiz express"}:{c:c.id,g:"R",src:"Quiz"});S.stats.quizWon++;quiz.rewarded=true;save();updateTabs();}
    const xl=expressLeft(), retry=ex&&!win&&quiz.attempt===1;
    const left=COLLECTIONS.filter(x=>!S.quizDone[x.id]).length;
    const lose=ex?(retry?`Il fallait ${EXPRESS_NEED} bonnes réponses. Il te reste une deuxième chance sur ce quiz, avec d'autres questions.`
        :`Il fallait ${EXPRESS_NEED} bonnes réponses, et c'était ta deuxième chance. ${xl?`Encore ${xl} quiz express aujourd'hui.`:"Nouveaux quiz express demain."}`)
      :`Il fallait 3 bonnes réponses. ${left?`Il te reste ${left} quiz aujourd'hui, dans d'autres catégories.`:"Nouveaux quiz demain."}`;
    $("#view").innerHTML=`<div class="qbox"><div class="result">
      <div class="kicker">${label} ${esc(c.name)}${ex?` · essai ${quiz.attempt}/2`:""}</div>
      <div class="score">${score}/${total}</div>
      <h2>${win?(score===total?"Sans faute !":"Booster gagné"):"Pas cette fois"}</h2>
      <p class="lede">${win?(ex?"Ton booster surprise est débloqué, tout de suite.":"Un booster "+esc(c.name)+" avec une carte rare garantie t'attend."):lose}</p>
      <div class="mactions">${win?`<button class="btn" id="q-open">Ouvrir le booster</button>`:""}${retry?`<button class="btn" id="q-retry">Deuxième chance</button>`:""}<button class="btn ghost" id="q-back">${ex?"Retour aux boosters":"Retour aux quiz"}</button></div>
    </div></div>`;
    $("#q-back").onclick=()=>{quiz=null;if(ex)view="packs";render()};
    if(retry) $("#q-retry").onclick=()=>startQuiz(c,"express",2,quiz.used);
    if(win) $("#q-open").onclick=()=>{quiz=null;view="packs";render();openPack(S.packs.length-1)};
    return;
  }
  const q=quiz.qs[quiz.i];
  $("#view").innerHTML=`<div class="qbox">
    <div class="qmeta"><span>${label} ${esc(c.name)}${ex?` · essai ${quiz.attempt}/2 · ${EXPRESS_NEED} bonnes réponses pour gagner`:""}</span><span>Question ${quiz.i+1}/${total}</span></div>
    <div class="dots">${quiz.qs.map((_,i)=>`<i class="${i<quiz.res.length?(quiz.res[i]?"ok":"ko"):i===quiz.i?"cur":""}"></i>`).join("")}</div>
    <div class="qtext">${esc(q.q)}</div>
    <div class="opts">${q.opts.map((o,i)=>`<button class="opt" id="opt-${i}" data-o="${esc(o)}">${esc(o)}</button>`).join("")}</div>
    <div class="mactions" id="next" hidden><button class="btn" id="q-next">${quiz.i===total-1?"Voir le résultat":"Question suivante"}</button><button class="btn ghost sm" id="q-report">Signaler un problème</button></div>
    <div class="report" id="report" hidden></div>
  </div>`;
  $("#q-report").onclick=()=>openReport(c,q);
  document.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{
    const ok=b.dataset.o===q.right; quiz.res.push(ok);
    document.querySelectorAll(".opt").forEach(x=>{x.disabled=true;if(x.dataset.o===q.right)x.classList.add("right")});
    if(!ok)b.classList.add("wrong");
    $("#next").hidden=false;$("#q-next").focus();
  });
  $("#q-next").onclick=()=>{quiz.i++;render()};
}

function renderPacks(){
  const st=S.free.stock, xl=expressLeft();
  $("#view").innerHTML=`<div class="kicker">Boosters</div><h1>À ouvrir</h1>
    <p class="lede">${PACK_SIZE} cartes par booster, tirées dans toute la catégorie. Quiz réussi : une rare garantie. Sous-genre complété : une épique garantie.</p>
    <div class="freebar">
      <section class="panel">
        <h3>Boosters gratuits</h3>
        <div class="stock" aria-label="${st} sur ${FREE_MAX} en stock">${Array.from({length:FREE_MAX},(_,i)=>`<i class="${i<st?"on":""}"></i>`).join("")}</div>
        <div class="timer" id="free-timer"></div>
        <p class="note">Catégorie tirée au sort à l'ouverture.</p>
        <div class="row"><button class="btn" id="free-open" ${st?"":"disabled"}>Ouvrir un booster surprise</button></div>
      </section>
      <section class="panel">
        <h3>Quiz express</h3>
        <p>Pas envie d'attendre ? ${EXPRESS_QS} questions difficiles sur une catégorie au hasard. ${EXPRESS_NEED} bonnes réponses et un booster surprise se débloque tout de suite. Si tu rates, tu as une deuxième chance avec d'autres questions.</p>
        <div class="row"><span class="note">Aujourd'hui</span><div class="tokens">${Array.from({length:EXPRESS_PER_DAY},(_,i)=>`<i class="${i<xl?"on":""}"></i>`).join("")}</div></div>
        <div class="row"><button class="btn ghost" id="express-go" ${xl?"":"disabled"}>${xl?"Lancer un quiz express":"Plus de quiz express aujourd'hui"}</button></div>
      </section>
    </div>
    <h2 style="margin-top:28px">Boosters gagnés</h2>
    ${S.packs.length?`<div class="packs">${S.packs.map((p,i)=>{const c=p.c?colById(p.c):{name:"Surprise"};
      return `<button class="pack" id="pack-${i}" data-i="${i}" aria-label="Ouvrir le booster ${esc(c.name)}">
        ${PAQUET.svg(c.name)}<span class="ps">${esc(p.src)}</span>
        ${p.g==="E"?`<span class="gr E">Épique garantie</span>`:p.g==="R"?`<span class="gr">Rare garantie</span>`:""}</button>`}).join("")}</div>`
    :`<div class="empty">Aucun booster gagné en attente. Fais un quiz du jour pour en gagner un.</div>`}`;
  document.querySelectorAll(".pack").forEach(b=>b.onclick=()=>openPack(+b.dataset.i));
  $("#free-open").onclick=()=>{
    tickFree(); if(!S.free.stock) return;
    S.free.stock--; S.packs.push({c:null,g:"",src:"Gratuit"}); save(); openPack(S.packs.length-1);
  };
  $("#express-go").onclick=()=>{
    if(!expressLeft()) return;
    S.express.left--; save(); startQuiz(randomCol(),"express");
  };
  showTimer();
}
const fmtDur=ms=>{const s=Math.ceil(ms/1000),m=Math.floor(s/60);return `${m}:${String(s%60).padStart(2,"0")}`};
function showTimer(){
  const el=$("#free-timer"); if(!el) return;
  el.innerHTML=S.free.stock>=FREE_MAX?`Stock plein (${FREE_MAX}). Ouvre-en un pour relancer le compteur.`
    :`<strong>${S.free.stock}</strong>/${FREE_MAX} en stock · prochain dans <strong>${fmtDur(freeNext())}</strong>`;
}

/* ---------- Tirage & ouverture ---------- */
function pickTier(allowed){
  const tot=allowed.reduce((s,t)=>s+DROP[t],0);let x=Math.random()*tot;
  for(const t of allowed){x-=DROP[t];if(x<0)return t}return allowed[allowed.length-1];
}
/* Tirage d'un booster : 10 cartes de commune à épique. Une fois sur 20, la bande coince : la dernière carte devient
   une légendaire que le joueur n'a pas encore (une fois sur 20 de ces fois-là, la Popites). Rien de manquant = pas de bande coincée. */
function draw(c,g){
  const tiers=Object.keys(DROP).filter(t=>c.all.some(k=>k.r===t));
  const min={R:["R","E"],E:["E"]}[g];
  const out=[];
  for(let i=0;i<PACK_SIZE;i++){
    const allowed=(min&&i===PACK_SIZE-1)?tiers.filter(t=>min.includes(t)):tiers;
    const t=pickTier(allowed), pool=c.all.filter(k=>k.r===t);
    out.push(pool[Math.floor(Math.random()*pool.length)]);
  }
  let jam=null;
  if(Math.random()<JAM_CHANCE){
    const missing=t=>c.all.filter(k=>k.r===t&&!S.owned[k.id]);
    const wantP=Math.random()<POPITES_SHARE, first=missing(wantP?"P":"L"), pool=first.length?first:missing(wantP?"L":"P");
    if(pool.length){jam=pool[Math.floor(Math.random()*pool.length)];out[PACK_SIZE-1]=jam}
  }
  out.sort((a,b)=>ORDER.indexOf(a.r)-ORDER.indexOf(b.r));
  out.jam=jam?jam.r:"";
  return out;
}
function openPack(i){
  const p=S.packs[i]; if(!p) return;
  if(!p.c) p.c=randomCol().id;
  const c=colById(p.c), cards=draw(c,p.g);
  const seen=new Set(); const isNew=cards.map(k=>{const n=!S.owned[k.id]&&!seen.has(k.id);seen.add(k.id);return n});
  cards.forEach(k=>S.owned[k.id]=(S.owned[k.id]||0)+1);
  S.packs.splice(i,1); S.stats.opened++; save();
  const completed=c.subs.filter(s=>!S.claimed[`${c.id}-${s.id}`]&&ownedIn(s.cards)===s.cards.length&&cards.some(k=>k.s===s));
  const m=$("#modal"); m.hidden=false;
  /* d'abord le paquet à ouvrir en arrachant sa bande ; la bande coince si le booster cache une légendaire ou la Popites */
  m.innerHTML=`<div class="mbox">
    <div><div class="kicker">Booster ${esc(p.src)}</div><h1>${esc(c.name)}</h1></div>
    <div id="m-pack"></div>
    <p class="tear-hint">Pose le doigt sur le petit triangle en haut du paquet et tire vers le bas.</p>
    <div class="mactions"><button class="btn ghost" id="m-skip">Ouvrir sans glisser</button></div>
  </div>`;
  const opener=PAQUET.ouvrir($("#m-pack"),{nom:c.name,coince:cards.jam,fini:showCards});
  $("#m-skip").onclick=()=>opener.go();
  if(cards.jam){const t=$("#m-pack .tear"),hint=$(".tear-hint");
    new MutationObserver((_,o)=>{if(t.classList.contains("jammed")){hint.textContent="Ça coince… Tire encore depuis le triangle !";o.disconnect()}}).observe(t,{attributes:true,attributeFilter:["class"]})}
  render();
  /* puis les cartes, à retourner */
  function showCards(){
    m.innerHTML=`<div class="mbox">
      <div><div class="kicker">Booster ${esc(p.src)}</div><h1>${esc(c.name)}</h1><p class="lede" style="margin-inline:auto">Touche les cartes pour les retourner.</p></div>
      <div class="reveal appear">${cards.map((k,j)=>`<button class="flip r-glow-${k.r}" id="flip-${j}" aria-label="Retourner la carte ${j+1}">
        <span class="inner"><span class="back"><span><b>POPITES</b></span></span>${cardHTML(c,k,{count:false,isNew:isNew[j]})}</span></button>`).join("")}</div>
      ${completed.length?`<div class="toast">Sous-genre complété : ${completed.map(s=>esc(s.name)).join(", ")}. Ton nouveau badge est dans l'écrin de ton profil, et ton booster épique t'attend dans l'album.</div>`:""}
      <div class="mactions"><button class="btn ghost" id="m-all">Tout retourner</button><button class="btn" id="m-close">Voir l'album</button></div>
    </div>`;
    /* retourner une carte ; rare, épique, légendaire ou Popites : des confettis de sa couleur (et une vague en fond pour les plus rares) */
    const turn=f=>{if(f.classList.contains("on"))return;f.classList.add("on");const r=(f.className.match(/r-glow-(\w+)/)||[])[1];
      setTimeout(()=>{FOND.confettis(f,r);if(r==="L"||r==="P")FOND.vague()},280)};
    m.querySelectorAll(".flip").forEach(f=>f.onclick=()=>turn(f));
    /* sous-genre complété grâce à ce booster : le badge se débloque, avec son animation, une fois les cartes retournées */
    if(completed.length){
      const shown=new Set(), unlock=()=>{const list=completed.filter(s=>!shown.has(s.id));list.forEach(s=>shown.add(s.id));
        if(list.length){BADGE.debloquer(list.map(s=>({key:`${c.id}-${s.id}`,name:s.name})));FOND.vague()}};
      const watch=setInterval(()=>{if(!m.isConnected||m.hidden){clearInterval(watch);return}
        if([...m.querySelectorAll(".flip")].every(f=>f.classList.contains("on"))){clearInterval(watch);setTimeout(unlock,900)}},300);
    }
    $("#m-all").onclick=()=>m.querySelectorAll(".flip").forEach((f,j)=>setTimeout(()=>turn(f),j*140));
    $("#m-close").onclick=()=>{m.hidden=true;m.innerHTML="";curCol=c.id;view="album";render();window.scrollTo(0,0)};
  }
}

/* ---------- Soutenir : dons + boutique plafonnée ---------- */
const SHOP_ENABLED=false;      // pas de boosters payants au lancement : dons seulement (à rouvrir s'il y a de la demande)
const SHOP_LIMIT=5;           // boosters achetables max par semaine (lundi → dimanche)…
const SHOP_MONTH=10;           // …et par mois civil, soit 20 € au plus
const PRICE=2;                 // euros par booster
const SHOP_PERIOD="semaine";
function weekKey(){const d=new Date();d.setDate(d.getDate()-((d.getDay()+6)%7));return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`}
function monthKey(){const d=new Date();return `${d.getFullYear()}-${d.getMonth()+1}`}
function shopState(){
  if(!S.shop||S.shop.week!==weekKey())S.shop={week:weekKey(),bought:0,month:S.shop?.month,mBought:S.shop?.mBought||0};
  if(S.shop.month!==monthKey()){S.shop.month=monthKey();S.shop.mBought=0}
  return S.shop;
}
const euros=n=>n+" €";
const LIBERAPAY_URL="https://liberapay.com/PopitesCulture/";
const KOFI_URL="";   // lien de la page Ko-fi, vide tant qu'elle n'existe pas (le bouton est alors caché)
function renderShop(){
  const sh=shopState(), wLeft=SHOP_LIMIT-sh.bought, mLeft=SHOP_MONTH-sh.mBought, left=Math.max(0,Math.min(wLeft,mLeft));
  $("#view").innerHTML=`<div class="page">
    <div><div class="kicker">Soutenir</div><h1>Un jeu gratuit et open source</h1>
      <p class="lede">Popites est gratuit, sans pub, sans compte et son code est ouvert. ${SHOP_ENABLED?"Les dons et les quelques boosters payants aident":"Aucun achat dans le jeu : tout se gagne en jouant. Les dons aident"} à agrandir et améliorer le jeu.</p></div>
    <section class="panel">
      <h2>Faire un don</h2>
      <p>Un don ne donne aucun avantage dans le jeu. C'est juste un coup de main pour que le projet continue.</p>
      <div class="row"><a class="btn" href="${LIBERAPAY_URL}" target="_blank" rel="noopener" style="text-decoration:none">Donner sur Liberapay</a>${KOFI_URL?`<a class="btn ghost" href="${KOFI_URL}" target="_blank" rel="noopener" style="text-decoration:none">Ko-fi</a>`:""}</div>
      <p class="note">Liberapay permet un don chaque semaine, chaque mois ou chaque année.</p>
    </section>
    ${SHOP_ENABLED?`<section class="panel">
      <h2>Acheter un booster</h2>
      <p><strong>${euros(PRICE)} le booster</strong>, avec deux plafonds qui ne se débloquent jamais : <strong>${SHOP_LIMIT} par ${SHOP_PERIOD}</strong> et <strong>${SHOP_MONTH} par mois</strong>, soit ${euros(SHOP_MONTH*PRICE)} au maximum. C'est volontaire : on ne veut pas que quelqu'un se ruine sur un jeu de cartes. Les cartes ne se revendent pas contre de l'argent réel.</p>
      <div class="row"><span class="note" style="min-width:110px">Cette ${SHOP_PERIOD}</span><div class="limit" aria-label="${Math.max(0,wLeft)} achats restants cette semaine">${Array.from({length:SHOP_LIMIT},(_,i)=>`<i class="${i<sh.bought?"used":"free"}"></i>`).join("")}</div>
        <span class="note">${Math.max(0,wLeft)} restant${wLeft>1?"s":""}</span></div>
      <div class="row"><span class="note" style="min-width:110px">Ce mois-ci</span><div class="limit" aria-label="${mLeft} achats restants ce mois">${Array.from({length:SHOP_MONTH},(_,i)=>`<i class="${i<sh.mBought?"used":"free"}"></i>`).join("")}</div>
        <span class="note">${euros(sh.mBought*PRICE)} dépensés sur ${euros(SHOP_MONTH*PRICE)}</span></div>
      <div class="row">
        <span class="note">Booster surprise : catégorie tirée au sort.</span>
        <button class="btn" id="shop-buy" ${left?"":"disabled"}>${left?`Acheter · ${euros(PRICE)}`:mLeft<=0?"Plafond du mois atteint":"Limite de la semaine atteinte, à lundi"}</button>
      </div>
      <p class="note">Prototype : l'achat est simulé, aucun paiement. Les taux d'obtention sont affichés dans Infos.</p>
    </section>`:""}</div>`;
  if(!SHOP_ENABLED) return;
  $("#shop-buy").onclick=()=>{
    const sh=shopState(); if(sh.bought>=SHOP_LIMIT||sh.mBought>=SHOP_MONTH) return;
    sh.bought++; sh.mBought++;
    S.packs.push({c:null,g:"",src:"Boutique"}); save(); render();
  };
}

/* ---------- Profil : pseudo, stats, badges de sous-genres ---------- */
/* apparence : réglage propre à l'appareil, hors de la sauvegarde (un import ne le change pas) */
function themeNow(){try{return localStorage.getItem("popites-theme")||"auto"}catch(e){return "auto"}}
function renderProfile(){
  const all=COLLECTIONS.reduce((s,c)=>s+c.all.length,0), got=COLLECTIONS.reduce((s,c)=>s+ownedIn(c.all),0);
  const subs=COLLECTIONS.flatMap(c=>c.subs.map(s=>({c,s,key:`${c.id}-${s.id}`,done:ownedIn(s.cards)===s.cards.length})));
  const nb=subs.filter(x=>x.done).length;
  $("#view").innerHTML=`<div class="page">
    <div><div class="kicker">Profil</div><h1>${esc(S.pseudo||"Collectionneur·se anonyme")}</h1>
      <p class="lede">Chaque sous-genre complété te donne son badge.</p></div>
    <section class="panel">
      <div class="pseudo"><label class="note" for="pseudo">Pseudo</label><input type="text" id="pseudo" maxlength="24" placeholder="Ton pseudo"><button class="btn sm" id="pseudo-ok">Enregistrer</button></div>
      <div class="pstats">
        <div class="pstat"><b>${got}/${all}</b><span>cartes</span></div>
        <div class="pstat"><b>${Math.round(got/all*100)} %</b><span>de l'album</span></div>
        <div class="pstat"><b>${nb}/${subs.length}</b><span>badges</span></div>
        <div class="pstat"><b>${S.stats.opened}</b><span>boosters ouverts</span></div>
        <div class="pstat"><b>${S.stats.quizWon}</b><span>quiz réussis</span></div>
      </div>
      <div class="apparence" role="radiogroup" aria-label="Apparence"><span class="note">Apparence</span>
        ${[["auto","Auto"],["light","Clair"],["dark","Sombre"]].map(([v,l])=>`<button type="button" class="seg" role="radio" data-theme-set="${v}" aria-checked="${(themeNow()===v)}">${l}</button>`).join("")}
      </div>
    </section>
    <section class="panel" id="p-ecrin" aria-label="Écrin des badges">
      <h2>Mes badges</h2>
      ${BADGE.ecrin(COLLECTIONS.map(c=>({name:c.name,subs:c.subs.map(s=>({key:`${c.id}-${s.id}`,name:s.name,own:ownedIn(s.cards),total:s.cards.length}))})))}
    </section>
    <section class="panel">
      <h2>Mes amis</h2>
      <p>Partage ton profil (pseudo, badges, avancement) à tes amis : ils t'ajoutent en ouvrant ton lien. Renvoie-le quand tu progresses, ta fiche se met à jour chez eux.</p>
      <div class="row"><button class="btn" id="fr-share">Partager mon profil</button><button class="btn ghost" id="fr-copy">Copier mon code ami</button><span class="note" id="fr-sharemsg"></span></div>
      <div class="row"><input type="text" id="fr-in" placeholder="Colle ici le code ou le lien d'un ami" aria-label="Code ami" style="flex:1;min-width:200px"><button class="btn ghost" id="fr-add">Ajouter</button></div>
      <span class="note" id="fr-msg"></span>
      <div class="friends">${S.friends.length?S.friends.slice().sort((a,b)=>friendPct(b)-friendPct(a)).map(friendHTML).join(""):`<p class="note">Pas encore d'ami ajouté.</p>`}</div>
    </section>
    <section class="panel">
      <h2>Sauvegarde</h2>
      <p>Pas de compte : ta collection reste sur cet appareil. Pour la retrouver sur un autre téléphone, exporte ton code ici puis importe-le là-bas.</p>
      <div class="row"><button class="btn" id="sv-export">Exporter ma collection</button>${window.claude?"":`<button class="btn ghost" id="sv-file">Télécharger en fichier</button>`}</div>
      <textarea id="sv-code" class="code" rows="3" readonly hidden aria-label="Code de sauvegarde"></textarea>
      <div class="row" id="sv-copyrow" hidden><button class="btn sm" id="sv-copy">Copier le code</button><span class="note" id="sv-copymsg"></span></div>
      <h3 style="margin-top:8px">Importer</h3>
      <textarea id="sv-in" class="code" rows="3" placeholder="Colle ici un code de sauvegarde Popites" aria-label="Code à importer"></textarea>
      <div class="row"><button class="btn ghost" id="sv-import">Importer le code</button><label class="btn ghost" for="sv-infile" style="cursor:pointer">Importer un fichier</label><input type="file" id="sv-infile" accept=".txt,text/plain" hidden><span class="note" id="sv-msg"></span></div>
      <p class="note">Importer remplace la collection de cet appareil.</p>
    </section>
  </div>`;
  document.querySelectorAll("[data-theme-set]").forEach(b=>b.onclick=()=>{
    const v=b.dataset.themeSet; try{v==="auto"?localStorage.removeItem("popites-theme"):localStorage.setItem("popites-theme",v)}catch(e){}
    popitesTheme(v); document.querySelectorAll("[data-theme-set]").forEach(x=>x.setAttribute("aria-checked",x===b));
  });
  BADGE.bind($("#p-ecrin"));                       // badges gagnés : ils s'inclinent ; verrouillés : le cadenas tremble
  $("#pseudo").value=S.pseudo||"";
  $("#pseudo-ok").onclick=()=>{S.pseudo=$("#pseudo").value.trim().slice(0,24);save();render()};
  const showCode=()=>{const t=$("#sv-code");t.value=exportCode();t.hidden=false;$("#sv-copyrow").hidden=false;t.select();return t.value};
  $("#sv-export").onclick=showCode;
  $("#sv-copy").onclick=async()=>{const v=showCode();try{await navigator.clipboard.writeText(v);$("#sv-copymsg").textContent="Code copié."}catch(e){$("#sv-copymsg").textContent="Sélectionne le code et copie-le à la main."}};
  /* dans l'aperçu claude.ai la page ne peut pas télécharger : le bouton n'existe que sur le vrai site */
  if($("#sv-file")) $("#sv-file").onclick=()=>{
    const v=showCode();
    try{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([v],{type:"text/plain"}));a.download=`popites-sauvegarde-${today()}.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)}
    catch(e){$("#sv-copymsg").textContent="Téléchargement impossible ici : copie le code à la place."}
  };
  let armedImport=false;
  const doImport=txt=>{
    const st=importCode(txt);
    if(!st){$("#sv-msg").textContent="Code invalide ou abîmé.";return}
    if(!armedImport){armedImport=true;$("#sv-import").textContent="Confirmer : remplacer ma collection";
      $("#sv-msg").textContent=`Ce code contient ${Object.keys(st.owned).length} cartes différentes.`;pendingImport=st;return}
    S=pendingImport;S.claimed=S.claimed||{};S.stats=S.stats||{opened:0,quizWon:0};S.free=S.free||{stock:2,t:Date.now()};
    S.pid=S.pid||Math.random().toString(36).slice(2,10);S.friends=Array.isArray(S.friends)?S.friends:[];
    save();quiz=null;render();$("#sv-msg").textContent="Collection importée.";
  };
  let pendingImport=null;
  $("#sv-import").onclick=()=>doImport($("#sv-in").value);
  $("#sv-infile").onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(t=>{$("#sv-in").value=t.trim();doImport(t)})};
  bindFriends();
}

/* ---------- Amis : profil partagé par lien ou code (photo à un instant donné, sans serveur ni compte) ---------- */
const FRIEND_PREFIX="POPAMI1.";
const b64url=s=>b64(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
const unb64url=s=>unb64(s.replace(/-/g,"+").replace(/_/g,"/")+"===".slice((s.length+3)%4));
function mySnapshot(){
  const s={}; COLLECTIONS.forEach(c=>c.subs.forEach(x=>{s[`${c.id}-${x.id}`]=[ownedIn(x.cards),x.cards.length]}));
  return {pid:S.pid,p:(S.pseudo||"Anonyme").slice(0,24),at:Date.now(),s};
}
function friendCode(){const p=b64url(JSON.stringify(mySnapshot()));return FRIEND_PREFIX+p+"."+hash("popami"+p).toString(36)}
function friendLink(){return location.origin+location.pathname+"#ami="+friendCode()}
function parseFriend(txt){
  try{
    let t=String(txt).trim(); const i=t.indexOf("#ami="); if(i>=0) t=t.slice(i+5);
    t=decodeURIComponent(t).replace(/\s+/g,"");
    if(!t.startsWith(FRIEND_PREFIX)) return null;
    const [p,sum]=t.slice(FRIEND_PREFIX.length).split(".");
    if(hash("popami"+p).toString(36)!==sum) return null;
    const f=JSON.parse(unb64url(p));
    if(!f||typeof f.pid!=="string"||typeof f.s!=="object") return null;
    f.p=String(f.p||"Anonyme").slice(0,24);
    return f;
  }catch(e){return null}
}
/* ajoute ou met à jour (même identifiant = même ami) ; renvoie un message */
function addFriend(f){
  if(f.pid===S.pid) return "C'est ton propre profil !";
  const i=S.friends.findIndex(x=>x.pid===f.pid);
  if(i>=0){ if(f.at<S.friends[i].at) return `Tu as déjà une fiche plus récente de ${f.p}.`; S.friends[i]=f; save(); return `Fiche de ${f.p} mise à jour.` }
  S.friends.push(f); save(); return `${f.p} ajouté·e à tes amis.`;
}
const pctOf=(o,t)=>t?Math.round(o/t*100):0;
function friendCat(f,c){let o=0,t=0;c.subs.forEach(x=>{const v=f.s[`${c.id}-${x.id}`];if(v){o+=v[0];t+=v[1]}});return pctOf(o,t)}
function friendPct(f){let o=0,t=0;Object.values(f.s).forEach(v=>{o+=v[0];t+=v[1]});return pctOf(o,t)}
function friendHTML(f){
  const badges=COLLECTIONS.flatMap(c=>c.subs.map(x=>`${c.id}-${x.id}`)).filter(k=>{const v=f.s[k];return v&&v[1]&&v[0]>=v[1]});
  const date=new Date(f.at).toLocaleDateString("fr-FR",{day:"numeric",month:"short"});
  return `<article class="friend">
    <div class="fhead"><div><b>${esc(f.p)}</b><span class="note"> · ${friendPct(f)} % de l'album · mis à jour le ${date}</span></div>
      <button class="btn ghost sm" data-unfriend="${esc(f.pid)}">Retirer</button></div>
    <div class="fbadges">${badges.length?badges.map(k=>{const [cid,sid]=k.split("-"),s=colById(cid).subs.find(x=>x.id===sid);return `<span title="${esc(s.name)}">${BADGE.svg(k,s.name,false)}</span>`}).join(""):`<span class="note">Aucun badge pour l'instant</span>`}</div>
    ${COLLECTIONS.map(c=>{const fp=friendCat(f,c), mp=pctOf(ownedIn(c.all),c.all.length);return `<details class="fcat"><summary><span>${esc(c.name)}</span><span class="prog"><i style="width:${fp}%"></i></span><span class="n">${fp} %</span></summary>
      <div class="fsubs">${c.subs.map(x=>{const v=f.s[`${c.id}-${x.id}`]||[0,0];return `<div><span>${esc(x.name)}</span><span class="n">${pctOf(v[0],v[1])} %</span><span class="n me">toi ${pctOf(ownedIn(x.cards),x.cards.length)} %</span></div>`}).join("")}
      <div class="note">Toi sur ${esc(c.name)} : ${mp} %</div></div></details>`}).join("")}
  </article>`;
}
function bindFriends(){
  const msg=t=>{$("#fr-sharemsg").textContent=t};
  $("#fr-share").onclick=async()=>{
    const url=friendLink(), text=`Ajoute-moi sur Popites ! ${friendPct(mySnapshot())} % de l'album pour l'instant.`;
    if(navigator.share){try{await navigator.share({title:"Popites",text,url});return}catch(e){if(e.name==="AbortError")return}}
    try{await navigator.clipboard.writeText(url);msg("Lien copié : envoie-le à tes amis.")}catch(e){msg("Copie impossible : utilise « Copier mon code ami ».")}
  };
  $("#fr-copy").onclick=async()=>{try{await navigator.clipboard.writeText(friendCode());msg("Code ami copié.")}catch(e){$("#fr-in").value=friendCode();msg("Copie impossible : le code est dans le champ ci-dessous.")}};
  $("#fr-add").onclick=()=>{
    const f=parseFriend($("#fr-in").value);
    if(!f){$("#fr-msg").textContent="Code ou lien invalide.";return}
    const m=addFriend(f); render(); $("#fr-msg").textContent=m;
  };
  document.querySelectorAll("[data-unfriend]").forEach(b=>b.onclick=()=>{
    if(b.dataset.armed){S.friends=S.friends.filter(x=>x.pid!==b.dataset.unfriend);save();render();return}
    b.dataset.armed="1";b.textContent="Confirmer";
  });
}
/* ouverture d'un lien ami (…#ami=CODE) : proposer d'ajouter, puis nettoyer l'adresse */
function checkFriendLink(){
  if(!location.hash.startsWith("#ami=")) return;
  const f=parseFriend(location.hash);
  history.replaceState(null,"",location.pathname+location.search);
  const m=$("#modal"); m.hidden=false;
  m.innerHTML=f?`<div class="mbox"><div class="kicker">Lien ami</div><h1>Ajouter ${esc(f.p)} ?</h1>
      <p class="lede" style="margin-inline:auto">${friendPct(f)} % de l'album. Tu verras ses badges et son avancement dans ton profil.</p>
      <div class="mactions"><button class="btn" id="fl-yes">Ajouter</button><button class="btn ghost" id="fl-no">Non merci</button></div></div>`
    :`<div class="mbox"><h1>Lien ami invalide</h1><p class="lede" style="margin-inline:auto">Le lien est incomplet ou abîmé. Demande à ton ami de le renvoyer.</p>
      <div class="mactions"><button class="btn" id="fl-no">OK</button></div></div>`;
  const close=()=>{m.hidden=true;m.innerHTML=""};
  $("#fl-no").onclick=close;
  if(f) $("#fl-yes").onclick=()=>{const t=addFriend(f);close();view="profile";render();window.scrollTo(0,0);$("#fr-msg").textContent=t};
}

/* code de sauvegarde : état du jeu en JSON -> base64, avec une somme de contrôle pour repérer un code abîmé ou retouché */
const SAVE_PREFIX="POPITES1.";
function b64(s){const u=new TextEncoder().encode(s);let bin="";for(let i=0;i<u.length;i+=8192)bin+=String.fromCharCode(...u.subarray(i,i+8192));return btoa(bin)}
function unb64(s){return new TextDecoder().decode(Uint8Array.from(atob(s),ch=>ch.charCodeAt(0)))}
function exportCode(){const p=b64(JSON.stringify(S));return SAVE_PREFIX+p+"."+hash("popites"+p).toString(36)}
function importCode(txt){
  try{
    const t=String(txt).trim().replace(/\s+/g,"");
    if(!t.startsWith(SAVE_PREFIX)) return null;
    const [p,sum]=t.slice(SAVE_PREFIX.length).split(".");
    if(hash("popites"+p).toString(36)!==sum) return null;
    const st=JSON.parse(unb64(p));
    if(!st||typeof st.owned!=="object"||!Array.isArray(st.packs)) return null;
    return st;
  }catch(e){return null}
}

/* ---------- Sondage privé : formulaire externe (Framaforms), résultats publiés à la main chaque mois ---------- */
const POLL_FORM_URL="https://framaforms.org/quelle-collection-ensuite-1793786240";   // formulaire Framaforms : les votes ne sont visibles que par l'auteur
/* classement publié chaque mois, mis à jour à la main ; null tant qu'il n'y en a pas */
const POLL_RESULTS=null;  // ex. {mois:"novembre 2026", top:["Films","Plus de cartes : Manga","Animé"]}
function renderPoll(){
  $("#view").innerHTML=`<div class="page">
    <div><div class="kicker">Sondage</div><h1>Quelle collection ensuite ?</h1>
      <p class="lede">Choisis jusqu'à 3 propositions : une nouvelle catégorie (Films, Animé, Marques, Animaux, Jeux vidéo, Sportifs, Youtubeurs & streamers, Livres…) ou plus de cartes dans une catégorie existante. Ton vote reste privé, le classement est publié chaque mois.</p></div>
    <section class="panel">
      ${POLL_FORM_URL?`<iframe src="${esc(POLL_FORM_URL)}" title="Formulaire du sondage" style="width:100%;min-height:720px;border:0;border-radius:10px;background:#fff" loading="lazy"></iframe>
        <p class="note">Le formulaire ne marche pas ici ? <a href="${esc(POLL_FORM_URL)}" target="_blank" rel="noopener" style="color:var(--accent)">Ouvre-le dans un nouvel onglet</a>.</p>`
        :`<p>Le formulaire de vote arrive bientôt.</p>`}
    </section>
    <section class="panel"><h2>Résultats du mois</h2>
      ${POLL_RESULTS?`<p class="note">${esc(POLL_RESULTS.mois)}</p><ol class="plain">${POLL_RESULTS.top.map(x=>`<li><strong>${esc(x)}</strong></li>`).join("")}</ol>`
        :`<p>Pas encore de classement : le premier sera publié à la fin du mois.</p>`}
    </section></div>`;
}
/* ---------- Infos : rareté, taux, règles, données ---------- */
function renderInfo(){
  const tot=Object.values(DROP).reduce((a,b)=>a+b,0);
  const col={C:"var(--r-C)",PU:"var(--r-PU)",R:"var(--r-R)",E:"var(--r-E)",L:"var(--r-L)"};
  $("#view").innerHTML=`<div class="page">
    <div><div class="kicker">Infos</div><h1>Comment marche le jeu</h1>
      <p class="lede">Tout ce qui décide de la rareté d'une carte et de ce que tu trouves dans un booster.</p></div>
    <section class="panel">
      <h2>Taux d'obtention</h2>
      <p>Un booster contient ${PACK_SIZE} cartes, chacune tirée avec ces chances. Dans un booster gagné au quiz du jour, la ${PACK_SIZE}e carte est au moins rare ; dans un booster de sous-genre complété, au moins épique.</p>
      <div class="odds">${["C","PU","R","E"].map(t=>`<div class="odd" style="--c:${col[t]}"><b>${Math.round(DROP[t]/tot*100)} %</b><span>${RAR[t]}</span></div>`).join("")}</div>
      <p><strong>Légendaires et Popites :</strong> environ 1 booster sur ${Math.round(1/JAM_CHANCE)} contient une légendaire que tu n'as pas encore. Dans 1 de ces boosters sur ${Math.round(1/POPITES_SHARE)}, c'est la Popites à la place, soit environ 1 booster sur ${Math.round(1/(JAM_CHANCE*POPITES_SHARE))}. Jamais en double.</p>
    </section>
    <section class="panel">
      <h2>D'où vient la rareté</h2>
      <p>Chaque carte affiche un chiffre réel : ses vues sur Wikipédia en français pendant les 12 derniers mois. Un personnage qui donne son nom à son œuvre (Lucky Luke, Totoro…) prend les vues de l'œuvre si elles sont plus fortes. Dans chaque sous-genre, les cartes sont classées de la plus vue à la moins vue : la toute première est la <strong>Popites</strong> du sous-genre, puis les ${RANK_SHARE.L} % premières sont légendaires, les ${RANK_SHARE.E} % suivantes épiques, puis ${RANK_SHARE.R} % rares, ${RANK_SHARE.PU} % peu communes et le reste communes.</p>
      ${COLLECTIONS.map(c=>`<div class="tblwrap"><table class="tbl"><thead><tr><th>${esc(c.name)}</th><th>Cartes</th>${["P","L","E","R","PU","C"].map(t=>`<th>${RAR[t]}</th>`).join("")}</tr></thead>
        <tbody>${c.subs.map(s=>`<tr><td>${esc(s.name)}</td><td>${s.cards.length}</td>${["P","L","E","R","PU","C"].map(t=>`<td>${s.cards.filter(k=>k.r===t).length}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`).join("")}
      <p class="note">Données Wikidata et Wikipédia, mises à jour à chaque génération des cartes.</p>
    </section>
    <section class="panel">
      <h2>Gagner des boosters</h2>
      <ul class="plain">
        <li><strong>Quiz du jour :</strong> un par catégorie et par jour, 3 bonnes réponses sur 5 pour gagner un booster de la catégorie avec une rare garantie.</li>
        <li><strong>Booster gratuit :</strong> un toutes les 20 minutes (3 par heure), jusqu'à ${FREE_MAX} en stock. Catégorie tirée au sort.</li>
        <li><strong>Quiz express :</strong> ${EXPRESS_PER_DAY} par jour. ${EXPRESS_QS} questions difficiles, ${EXPRESS_NEED} bonnes réponses débloquent un booster surprise tout de suite. Chaque quiz express donne 2 essais, le second avec d'autres questions.</li>
        <li><strong>Sous-genre complété :</strong> un badge pour ton profil et un booster avec une épique garantie.</li>
        <li><strong>Doublons :</strong> 5 doublons d'une catégorie contre un booster de cette catégorie.</li>
        ${SHOP_ENABLED?`<li><strong>Boutique :</strong> ${euros(PRICE)} le booster surprise, ${SHOP_LIMIT} maximum par ${SHOP_PERIOD} et ${SHOP_MONTH} par mois (${euros(SHOP_MONTH*PRICE)}).</li>`:`<li><strong>Aucun achat :</strong> pas de booster payant, tout se gagne en jouant.</li>`}
      </ul>
    </section>
    <section class="panel">
      <h2>Données et licences</h2>
      <ul class="plain">
        <li>Jeu gratuit et open source.</li>
        <li>Les informations sur les œuvres viennent de bases ouvertes (Wikidata, domaine public).</li>
        <li>Les chiffres de vues viennent des statistiques publiques de Wikipédia (Wikimedia).</li>
        <li>Les descriptions des personnages sont écrites pour le jeu, d'après les articles Wikipédia en français.</li>
        ${PICS?`<li>Les photos des artistes sont des photos libres de Wikimedia Commons : auteur et licence sont indiqués sur chaque carte et dans les <a href="#" data-legal="credits" style="color:var(--accent)">crédits photos</a>.</li>
        <li>Les images des séries, mangas et personnages appartiennent à leurs ayants droit, indiqués sur chaque carte (©). Sur simple demande d'un ayant droit, la carte est retirée.</li>`:`<li>Aucune photo n'est utilisée sur les cartes.</li>
        <li>Aucun logo, affiche ou dessin officiel : les personnages sont évoqués par leurs couleurs, jamais redessinés.</li>`}
      </ul>
    </section>
    <section class="panel">
      <h2>Installer l'appli</h2>
      ${isInstalled()?`<p>Popites est déjà installé sur cet appareil.</p>`:`
      <ul class="plain">
        <li><strong>iPhone / iPad (Safari) :</strong> touche le bouton Partager, puis « Sur l'écran d'accueil ».</li>
        <li><strong>Android (Chrome) :</strong> touche « Installer l'appli » en haut de la page, ou le menu ⋮ puis « Installer l'application ».</li>
        <li><strong>Ordinateur (Chrome, Edge) :</strong> l'icône d'installation apparaît dans la barre d'adresse.</li>
      </ul>`}
      <p class="note">Une fois installé, le jeu s'ouvre en plein écran et marche même sans connexion.</p>
    </section></div>`;
  bindLegalLinks($("#view"));
}

/* ---------- Contact, mentions légales, confidentialité, licence ---------- */
const CONTACT_MAIL="popitesculture@protonmail.com";
function renderLegal(){
  const mail=`<a href="mailto:${CONTACT_MAIL}" style="color:var(--accent)">${CONTACT_MAIL}</a>`;
  $("#view").innerHTML=`<div class="page">
    <div><div class="kicker">À propos</div><h1>Contact et mentions légales</h1>
      <p class="lede">Qui fait le jeu, où il est hébergé et ce qu'il fait de tes données (presque rien).</p></div>
    <section class="panel" id="legal-contact">
      <h2>Contact</h2>
      <p>Une question, une idée, un problème ? Écris à ${mail}.</p>
      <p>Une question du quiz est fausse ? Le plus simple est de la signaler directement depuis le quiz, avec le bouton « Signaler ».</p>
    </section>
    <section class="panel" id="legal-mentions">
      <h2>Mentions légales</h2>
      <ul class="plain">
        <li><strong>Éditeur :</strong> Popites est un site personnel, non professionnel et sans but lucratif. Comme le permet l'article 6, III, 2 de la loi pour la confiance dans l'économie numérique (LCEN), son éditeur a choisi de rester anonyme ; son identité est connue de l'hébergeur.</li>
        <li><strong>Directeur de la publication :</strong> l'éditeur du site, joignable à ${mail}.</li>
        <li><strong>Hébergeur :</strong> GitHub Pages, service de GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis (github.com).</li>
        ${PICS?`<li><strong>Œuvres citées :</strong> les noms et les images des séries, mangas et personnages appartiennent à leurs ayants droit, mentionnés sur chaque carte (©). Ils sont repris à titre d'information et d'hommage, dans un jeu gratuit. Popites n'est lié à aucun d'eux.</li>
        <li><strong>Photos des artistes :</strong> photos sous licence libre (Creative Commons ou domaine public), venant de Wikimedia Commons ; auteur, licence et lien dans les <a href="#" data-legal="credits" style="color:var(--accent)">crédits photos</a>.</li>`:`<li><strong>Œuvres citées :</strong> les noms de séries, mangas, artistes et personnages appartiennent à leurs ayants droit. Ils sont cités à titre d'information, sans logo, image ni dessin officiel. Popites n'est lié à aucun d'eux.</li>`}
        <li><strong>Un contenu te pose problème ?</strong> Écris à ${mail} : il sera corrigé ou retiré rapidement. ${PICS?"Un ayant droit qui demande le retrait d'une image ou d'une carte l'obtient sans discussion.":""}</li>
      </ul>
    </section>
    <section class="panel" id="legal-privacy">
      <h2>Confidentialité</h2>
      <ul class="plain">
        <li><strong>Pas de compte, pas de pub, pas de statistiques de visite, pas de cookie.</strong></li>
        <li><strong>Ta partie reste sur ton appareil :</strong> collection, boosters, pseudo et liste d'amis sont enregistrés dans le stockage de ton navigateur. Rien n'est envoyé à Popites, qui n'a pas de serveur.</li>
        <li><strong>Code ami :</strong> il contient ton pseudo, un identifiant tiré au hasard et ta progression. Il ne quitte ton appareil que si tu le partages toi-même.</li>
        <li><strong>Services extérieurs :</strong> comme tout site, l'hébergeur (GitHub) reçoit ton adresse IP quand tu ouvres le jeu. Les polices d'écriture et les images sont sur le site lui-même : aucun autre service n'est appelé pour les afficher. Le signalement d'une question et le sondage passent par Framaforms (Framasoft, association française) : seules les réponses que tu écris y sont envoyées. Les sites de dons (Liberapay${KOFI_URL?", Ko-fi":""}) ne sont contactés que si tu cliques sur leur bouton.</li>
        <li><strong>Tout effacer :</strong> supprime les données du site dans les réglages de ton navigateur, ou désinstalle l'appli. Popites ne garde aucune copie.</li>
      </ul>
    </section>
    <section class="panel" id="legal-licence">
      <h2>Licence</h2>
      <ul class="plain">
        <li><strong>Code :</strong> licence MIT. Tu peux le réutiliser, le modifier et le partager librement, en gardant la mention de la licence.</li>
        <li><strong>Données :</strong> Wikidata (domaine public, CC0) et statistiques de vues de Wikipédia (Wikimedia).</li>
        <li><strong>Polices :</strong> Dela Gothic One, Figtree, JetBrains Mono, Alfa Slab One et Bungee, sous licence SIL Open Font License.</li>
        ${PICS?`<li><strong>Photos des artistes :</strong> chacune garde sa propre licence, voir les <a href="#" data-legal="credits" style="color:var(--accent)">crédits photos</a>.</li>`:""}
      </ul>
    </section>
    ${PICS?creditsHTML():""}</div>`;
  bindLegalLinks($("#view"));
  const q=$("#cr-q");
  if(q) q.oninput=()=>{const t=norm(q.value);let n=0;
    document.querySelectorAll("#legal-credits li[data-n]").forEach(li=>{const ok=!t||li.dataset.n.includes(t);li.hidden=!ok;if(ok)n++});
    document.querySelectorAll("#legal-credits details").forEach(d=>{const any=d.querySelector("li[data-n]:not([hidden])");d.hidden=!any;if(t)d.open=!!any});
    $("#cr-n").textContent=t?`${n} résultat${n>1?"s":""}`:"";};
}

/* ---------- Crédits photos : chaque photo libre avec son auteur, sa licence et le lien vers l'original ---------- */
const PICS=typeof CREDITS!=="undefined";   // credits.js arrive avec les images : avant, les anciens textes restent
const norm=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
function licenceURL(l){
  const m=l.match(/^CC (BY(?:-SA|-NC|-ND|-NC-SA|-NC-ND)?) (\d\.\d)(?: (\w\w))?$/i);
  if(m) return `https://creativecommons.org/licenses/${m[1].toLowerCase()}/${m[2]}/${m[3]?m[3].toLowerCase()+"/":""}deed.fr`;
  if(/^CC0/i.test(l)) return "https://creativecommons.org/publicdomain/zero/1.0/deed.fr";
  return "";
}
function creditsHTML(){
  const ext=`target="_blank" rel="noopener"`;
  const groups=COLLECTIONS.flatMap(c=>c.subs.map(s=>({name:`${c.name} · ${s.name}`,cards:s.cards.filter(k=>k.img===2&&CREDITS[k.id]&&/^Photo :/.test(k.credit||""))}))).filter(g=>g.cards.length);
  const total=groups.reduce((a,g)=>a+g.cards.length,0);
  return `<section class="panel" id="legal-credits">
      <h2>Crédits photos</h2>
      <p>Les ${total} photos d'artistes viennent de <a href="https://commons.wikimedia.org" ${ext} style="color:var(--accent)">Wikimedia Commons</a>, sous licence libre ou dans le domaine public. Elles sont recadrées pour tenir sur les cartes, sans autre modification. Merci à leurs auteurs !</p>
      <div class="row"><input type="search" id="cr-q" placeholder="Chercher un artiste ou un photographe" aria-label="Chercher dans les crédits" style="flex:1;min-width:200px"><span class="note" id="cr-n" aria-live="polite"></span></div>
      ${groups.map(g=>`<details class="credits"><summary>${esc(g.name)} <span class="note">${g.cards.length}</span></summary><ul>${g.cards.map(k=>{
        const [auteur,lic]=k.credit.replace(/^Photo :\s*/,"").split(" · ");
        const lu=licenceURL(lic||""), file=CREDITS[k.id];
        return `<li data-n="${esc(norm(k.title+" "+auteur))}"><strong>${esc(k.title)}</strong> : ${esc(auteur)}, ${lu?`<a href="${lu}" ${ext}>${esc(lic)}</a>`:esc(lic||"")} · <a href="https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g,"_"))}" ${ext}>voir l'original</a></li>`}).join("")}</ul></details>`).join("")}
    </section>`;
}

/* ---------- Navigation & outils de test ---------- */
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{view=t.dataset.v;render();window.scrollTo(0,0)});
/* liens vers la page « Contact et mentions légales » (pied de page, et liens dans les pages elles-mêmes) */
function bindLegalLinks(root){root.querySelectorAll("[data-legal]").forEach(a=>a.onclick=e=>{
  e.preventDefault();if(view!=="legal"){view="legal";render()}
  const s=document.getElementById("legal-"+a.dataset.legal);if(s)s.scrollIntoView();else window.scrollTo(0,0);
})}
bindLegalLinks(document);
if(!PICS){const f=document.querySelector('[data-legal="credits"]');if(f)f.hidden=true}
$("#t-quiz").onclick=()=>{S.quizDone={};S.shop=null;S.express=null;S.free={stock:FREE_MAX,t:Date.now()};save();quiz=null;render()};
/* minuteur du booster gratuit : met à jour le compteur, et la page quand un booster arrive */
setInterval(()=>{
  if(tickFree()){save();updateTabs();if(view==="packs"&&$("#modal").hidden)render();return}
  if(view==="packs") showTimer();
},1000);
let armed=false;
$("#t-reset").onclick=e=>{
  if(!armed){armed=true;e.target.textContent="Confirmer la remise à zéro";setTimeout(()=>{armed=false;e.target.textContent="Test : tout remettre à zéro"},4000);return}
  S=fresh();save();quiz=null;view="packs";armed=false;e.target.textContent="Test : tout remettre à zéro";render();
};

/* ---------- Appli installable (PWA) ---------- */
const isInstalled=()=>matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
if("serviceWorker" in navigator&&location.protocol!=="file:"){
  window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
}
/* Android / Chrome / Edge : le navigateur propose l'installation, on l'affiche dans un bouton */
let installEvt=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installEvt=e;$("#install").hidden=false});
$("#install").onclick=async()=>{
  if(!installEvt) return;
  installEvt.prompt(); await installEvt.userChoice; installEvt=null; $("#install").hidden=true;
};
window.addEventListener("appinstalled",()=>{$("#install").hidden=true});

render();
checkFriendLink();
window.addEventListener("hashchange",checkFriendLink);
