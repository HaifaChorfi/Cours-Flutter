import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, update, get, remove, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB9wL1JhgfcYJriLvyDxAxNQWBXeGhxbLo",
  authDomain: "flutterqcm.firebaseapp.com",
  projectId: "flutterqcm",
  storageBucket: "flutterqcm.firebasestorage.app",
  messagingSenderId: "758018454310",
  appId: "1:758018454310:web:015ef358ed48790c8507e7",
  measurementId: "G-03HLJL4MBF"
};
const TEACHER_CODE = "flutter2026"; // code d'accès au tableau de bord (à changer)
const LIMIT = 30; // durée stricte par question (secondes)
const NOCFG = firebaseConfig.apiKey.startsWith("VOTRE");
const db = getDatabase(initializeApp(firebaseConfig));

/* ====== CONTENU DES QCM ====== */
const Q = (q, o, a, e) => ({ q, o, a, e });
const QCMS = [
  {
    id: "qcm1",
    titre: "QCM 1 — Fondamentaux Flutter",
    sous: "TP1 · Séance 1 · 16 questions",
    questions: [
      Q("Quelle famille de solutions correspond à Flutter ?", ["Natif (un code par plateforme)", "Hybride (WebView)", "Cross-platform compilé (un code source → code natif)", "Application web uniquement"], 2, "Un seul code source, compilé en code natif pour chaque plateforme."),
      Q("Quelle est la limite principale d'une approche hybride (WebView) ?", ["Il faut deux équipes de développement", "Performances et rendu limités", "Impossible d'utiliser HTML/CSS", "Le code doit être écrit en Swift"], 1, "Une app web encapsulée dans une coquille native : rapide à produire, mais performances et rendu limités."),
      Q("Laquelle de ces propositions n'est PAS une limite du cross-platform ?", ["Accès parfois retardé aux dernières API natives", "Binaire parfois plus lourd", "Deux bases de code à maintenir en parallèle", "Dépendance à l'évolution du framework"], 2, "Deux bases de code, c'est le problème du natif. Le cross-platform n'en garde qu'une."),
      Q("Flutter a été créé par ___ et utilise le langage ___.", ["Meta — JavaScript", "Google — Dart", "Microsoft — C#", "Google — Kotlin"], 1, "Flutter : Google, open-source depuis 2017, langage Dart."),
      Q("Dans Flutter, un bouton, une marge ou une animation sont…", ["des activités Android", "des balises HTML", "des widgets", "des composants XML"], 2, "Tout est widget : une app est un arbre de widgets imbriqués."),
      Q("Comment Flutter affiche-t-il l'interface ?", ["Via une WebView", "Via un pont JavaScript vers des composants natifs", "Son moteur de rendu (Impeller) dessine chaque pixel, sans pont", "Il délègue tout au système d'exploitation"], 2, "Impeller dessine chaque pixel : pas de pont intermédiaire, donc une performance quasi-native."),
      Q("Quel résultat attend-on de « flutter doctor » avant de continuer ?", ["Au moins un [!] est toléré", "Aucun [!] ni [✗] : « No issues found »", "Seulement Flutter en [✓]", "La liste des émulateurs"], 1, "Chaque ligne avec [!] ou [✗] doit être résolue avant de continuer."),
      Q("Quelle commande permet d'accepter les licences Android ?", ["flutter doctor --android-licenses", "flutter create --licenses", "flutter run --accept", "dart pub licenses"], 0, "flutter doctor --android-licenses, cité dans l'énoncé du TP."),
      Q("Quelle commande crée le projet « bienvenue_iset » ?", ["flutter new bienvenue_iset", "flutter create bienvenue_iset", "flutter init bienvenue_iset", "flutter start bienvenue_iset"], 1, "flutter create <nom_du_projet>, puis cd bienvenue_iset."),
      Q("Que fait le hot reload ?", ["Relance l'app depuis le début", "Injecte le nouveau code dans l'app lancée, en conservant l'état (~1 s)", "Recompile l'app pour iOS", "Efface les données locales"], 1, "Même écran, mêmes données : seul le code est mis à jour."),
      Q("Quand faut-il un hot restart plutôt qu'un hot reload ?", ["Changer le texte d'un Text", "Changer une couleur", "Changer main() ou la structure globale de l'app", "Modifier un padding"], 2, "Le restart relance l'app de zéro : nécessaire pour main(), une variable const ou la structure globale."),
      Q("Une donnée affichée change au cours du temps (ex. un compteur). Quel type de widget utiliser ?", ["StatelessWidget", "StatefulWidget + setState()", "Uniquement un Container", "MaterialApp"], 1, "Donnée qui change à l'écran → StatefulWidget + setState(). Sinon → StatelessWidget."),
      Q("Que se passe-t-il si on modifie _counter sans appeler setState() ?", ["L'écran se met à jour automatiquement", "Erreur de compilation", "Flutter ne redessine pas : le changement ne s'affiche pas", "L'application redémarre"], 2, "Un changement de donnée ne s'affiche que s'il passe par setState()."),
      Q("Quelle déclaration Dart est valide ?", ["string prenom = 'Ahmed';", "prenom: String = 'Ahmed';", "String prenom = 'Ahmed';", "var String prenom = 'Ahmed';"], 2, "Syntaxe Dart : Type nom = valeur; ex. String prenom = 'Ahmed';"),
      Q("Que retourne bonjour('Sami') avec : return 'Bonjour $nom'; (paramètre nom) ?", ["Bonjour $nom", "Bonjour Sami", "Bonjour nom", "Une erreur"], 1, "$nom est une interpolation : remplacée par la valeur de la variable."),
      Q("Que fait RegExp(r'[0-9]').hasMatch(mdp) ?", ["Vérifie que mdp ne contient que des chiffres", "Teste si mdp contient au moins un chiffre", "Compte le nombre de chiffres", "Convertit mdp en int"], 1, "hasMatch renvoie true si au moins un caractère de 0 à 9 est trouvé (Exercice 5)."),
    ],
  },
  { id: "qcm2", titre: "QCM 2 — Dart & Widgets", sous: "Bientôt disponible", soon: true },
  { id: "qcm3", titre: "QCM 3 — Listes & Navigation", sous: "Bientôt disponible", soon: true },
];

/* ====== STYLES ====== */
const CSS = `
*{box-sizing:border-box}body{margin:0}
.app{min-height:100vh;background:#0b1e3a;color:#e8eef9;font-family:system-ui,Segoe UI,Roboto,sans-serif}
.top{display:flex;align-items:center;gap:10px;padding:12px 18px;background:#081529;border-bottom:1px solid #1d3557}
.top b{font-size:15px}.top small{color:#7f98c0}.top .sp{flex:1}
.wrap{max-width:860px;margin:0 auto;padding:20px 16px 60px}.wide{max-width:1100px}
h1{font-size:26px;margin:8px 0}h2{font-size:18px;margin:22px 0 10px}p.sub{color:#9bb0d3;margin:0 0 18px}
.card{background:#12294d;border:1px solid #1d3a66;border-radius:14px;padding:16px;margin-bottom:12px}
.btn{background:#13b9fd;color:#04203d;border:0;border-radius:10px;padding:11px 18px;font-weight:700;font-size:15px;cursor:pointer}
.btn:disabled{opacity:.4;cursor:default}.btn.g{background:#1d3a66;color:#e8eef9}.btn.r{background:#ef5350;color:#fff}.btn.s{padding:7px 12px;font-size:13px}
.menu{display:flex;align-items:center;gap:14px;cursor:pointer;transition:.15s}.menu:hover{border-color:#13b9fd;transform:translateY(-2px)}
.menu.soon{opacity:.45;cursor:default}.menu.soon:hover{transform:none;border-color:#1d3a66}
.ico{width:46px;height:46px;border-radius:12px;background:#13b9fd;color:#04203d;display:grid;place-items:center;font-weight:800;font-size:18px}
input{width:100%;padding:12px;border-radius:10px;border:1px solid #2a4b7e;background:#0b1e3a;color:#fff;font-size:16px;margin:10px 0}
.bar{height:8px;background:#1d3a66;border-radius:6px;overflow:hidden}.bar i{display:block;height:100%;background:#13b9fd;transition:.3s}
.opt{display:block;width:100%;text-align:left;background:#0f2447;border:2px solid #234a80;color:#e8eef9;border-radius:12px;padding:13px 14px;margin:9px 0;font-size:15.5px;cursor:pointer}
.opt:hover:not(:disabled){border-color:#13b9fd}.opt.ok{border-color:#2ecc71;background:#0f3a2a}.opt.ko{border-color:#ef5350;background:#3d1a22}.opt:disabled{cursor:default}
.exp{background:#0f2447;border-left:4px solid #13b9fd;padding:10px 12px;border-radius:8px;margin:12px 0;font-size:14.5px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
.stat{background:#12294d;border:1px solid #1d3a66;border-radius:14px;padding:14px}.stat b{display:block;font-size:30px}.stat span{color:#9bb0d3;font-size:13px}
.row{display:flex;align-items:center;gap:10px;margin:7px 0;font-size:14px}.row .l{width:150px;flex-shrink:0}.row .bar{flex:1;height:14px}.row .v{width:70px;text-align:right}
.hist{display:flex;align-items:flex-end;gap:5px;height:140px;padding-top:8px}.hist div{flex:1;text-align:center;font-size:11px;color:#9bb0d3}.hist i{display:block;background:#13b9fd;border-radius:4px 4px 0 0;min-height:2px}
table{width:100%;border-collapse:collapse;font-size:14px}th,td{padding:7px 8px;text-align:left;border-bottom:1px solid #1d3a66}th{color:#9bb0d3;font-weight:600}
.tag{padding:2px 8px;border-radius:20px;font-size:12px;font-weight:700}.tag.on{background:#1b5e3a;color:#8dffb8}.tag.off{background:#5e1b25;color:#ff9aa8}
.scroll{max-height:420px;overflow:auto}.big{font-size:54px;font-weight:800;text-align:center;margin:10px 0}
`;

const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);

/* ====== APP ====== */
export default function App() {
  const [v, setV] = useState({ p: "menu" });
  const home = () => setV({ p: "menu" });
  return (
    <div className="app">
      <style>{CSS}</style>
      <div className="top">
        <b>📱 Atelier Cross-Platform</b>
        <small>ISET Béja · DSI 3</small>
        <span className="sp" />
        {v.p !== "menu" && <button className="btn g s" onClick={home}>← Menu</button>}
      </div>
      {v.p === "menu" && <Menu go={setV} />}
      {v.p === "student" && <Student qcm={v.qcm} />}
      {v.p === "teacher" && <Teacher qcm={v.qcm} />}
    </div>
  );
}

function Menu({ go }) {
  return (
    <div className="wrap">
      <h1>Bienvenue 👋</h1>
      <p className="sub">Choisissez un QCM pour commencer. Module : développement mobile multiplateforme avec Flutter.</p>
      {QCMS.map((q, i) => (
        <div key={q.id} className={"card menu" + (q.soon ? " soon" : "")} onClick={() => !q.soon && go({ p: "student", qcm: q })}>
          <div className="ico">{q.soon ? "🔒" : i + 1}</div>
          <div style={{ flex: 1 }}>
            <b>{q.titre}</b>
            <div style={{ color: "#9bb0d3", fontSize: 13 }}>{q.sous}</div>
          </div>
          {!q.soon && <span style={{ fontSize: 22 }}>→</span>}
        </div>
      ))}
      <div style={{ marginTop: 30 }}>
        <button className="btn g" onClick={() => go({ p: "teacher", qcm: QCMS[0] })}>🔐 Espace enseignant</button>
      </div>
    </div>
  );
}

function Student({ qcm }) {
  const Qs = qcm.questions, base = `qcm/${qcm.id}`;
  const [open, setOpen] = useState(null);
  const [secret, setSecret] = useState("");
  const [err, setErr] = useState("");
  const [bad, setBad] = useState("");
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [pid, setPid] = useState(localStorage.getItem("pid_" + qcm.id) || "");
  const [ans, setAns] = useState({});
  const [i, setI] = useState(0);
  const [ready, setReady] = useState(!pid);
  const [st, setSt] = useState({}); // échéance de la question en cours {dq, dl}
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (NOCFG) return;
    const t = setTimeout(() => setErr("timeout"), 8000);
    const a = onValue(ref(db, `${base}/open`), (s) => { clearTimeout(t); setOpen(!!s.val()); setErr(""); }, (e) => { clearTimeout(t); setErr(e.code || e.message); });
    const b = onValue(ref(db, `${base}/code`), (s) => setSecret(s.val() ? String(s.val()) : ""), () => {});
    return () => { a(); b(); clearTimeout(t); };
  }, []);
  useEffect(() => {
    if (!pid) return;
    get(ref(db, `${base}/players/${pid}`)).then((s) => {
      const v = s.val();
      if (v) { setName(v.name); setAns(v.ans || {}); setI(Object.keys(v.ans || {}).length); setSt({ dq: v.dq, dl: v.dl }); }
      else { localStorage.removeItem("pid_" + qcm.id); setPid(""); }
      setReady(true);
    }).catch(() => setReady(true));
  }, []);

  const start = async () => {
    if (!secret) return setBad("Le code d'accès n'est pas encore défini par l'enseignante.");
    if (code.trim() !== secret) return setBad("Code d'accès incorrect.");
    setBad("");
    const full = `${nom.trim().toUpperCase()} ${prenom.trim()}`;
    setName(full);
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    await set(ref(db, `${base}/players/${id}`), { name: full, score: 0, done: false, t: Date.now() });
    localStorage.setItem("pid_" + qcm.id, id);
    setPid(id);
  };
  const choose = (k) => {
    if (ans["q" + i] !== undefined) return;
    if (st.dq === i && Date.now() > st.dl) k = -1; // réponse hors délai = sans réponse
    const na = { ...ans, ["q" + i]: k };
    const score = Qs.filter((x, j) => na["q" + j] === x.a).length;
    setAns(na);
    update(ref(db, `${base}/players/${pid}`), { ["ans/q" + i]: k, score, done: Object.keys(na).length === Qs.length });
  };

  const cur = ans["q" + i];
  const live = ready && !!pid && i < Qs.length && cur === undefined;
  // 1) fixe l'échéance (30 s) à l'affichage de la question, stockée dans Firebase (anti-rechargement)
  useEffect(() => {
    if (!live || st.dq === i) return;
    const dl = Date.now() + LIMIT * 1000;
    setSt({ dq: i, dl });
    update(ref(db, `${base}/players/${pid}`), { dq: i, dl });
  }, [live, i, st.dq]);
  // 2) horloge
  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [live]);
  // 3) temps écoulé : validation automatique sans réponse
  useEffect(() => {
    if (live && st.dq === i && now >= st.dl) choose(-1);
  }, [now, live, st]);
  // 4) après un timeout : passage automatique à la question suivante (6 s pour lire la correction)
  useEffect(() => {
    if (cur !== -1) return;
    const t = setTimeout(() => setI((j) => j + 1), 6000);
    return () => clearTimeout(t);
  }, [cur, i]);

  if (NOCFG || err)
    return (
      <div className="wrap">
        <div className="card">
          <b>⚠️ Connexion à Firebase impossible</b>
          <p>
            {NOCFG
              ? "La configuration Firebase n'a pas été remplie dans App.jsx (valeurs « VOTRE_… »)."
              : "Vérifiez : 1) la databaseURL exacte (base en Europe : https://PROJET-default-rtdb.europe-west1.firebasedatabase.app), 2) que la Realtime Database est créée, 3) que ses règles autorisent la lecture et l'écriture."}
          </p>
          {err && err !== "timeout" && <small style={{ color: "#ff8a95" }}>Détail : {err}</small>}
        </div>
      </div>
    );
  if (!ready || open === null) return <div className="wrap">Chargement…</div>;
  if (!pid)
    return (
      <div className="wrap">
        <h1>{qcm.titre}</h1>
        <p className="sub">{Qs.length} questions · ⏱ {LIMIT} secondes par question (limite stricte : sans réponse à temps, la question est comptée fausse et on passe à la suivante) · une seule réponse possible.</p>
        {open ? (
          <div className="card">
            <b>Prénom</b>
            <input value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Ex. Ahmed" maxLength={30} />
            <b>Nom</b>
            <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex. Ben Salah" maxLength={30} />
            <b>Code d'accès</b>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code affiché au tableau" inputMode="numeric" maxLength={8} />
            {bad && <div style={{ color: "#ff8a95", marginBottom: 10 }}>⚠️ {bad}</div>}
            <button className="btn" disabled={prenom.trim().length < 2 || nom.trim().length < 2 || !code.trim()} onClick={start}>Commencer</button>
          </div>
        ) : (
          <div className="card">⏳ La session n'est pas encore ouverte. Attendez que l'enseignante l'ouvre (la page se met à jour toute seule).</div>
        )}
      </div>
    );

  if (i >= Qs.length) {
    const score = Qs.filter((x, j) => ans["q" + j] === x.a).length;
    return (
      <div className="wrap">
        <div className="card" style={{ textAlign: "center" }}>
          <div>{name}</div>
          <div className="big">{score} / {Qs.length}</div>
          <div>{pct(score, Qs.length) >= 50 ? "Bravo, continuez ! 🎉" : "À revoir avec la présentation 📚"}</div>
        </div>
        <h2>Correction</h2>
        {Qs.map((x, j) => (
          <div key={j} className="card">
            <b>{j + 1}. {x.q}</b>
            <div style={{ margin: "6px 0", color: ans["q" + j] === x.a ? "#6ef0a0" : "#ff8a95" }}>
              Votre réponse : {x.o[ans["q" + j]] ?? "⏱ Sans réponse (temps écoulé)"} {ans["q" + j] === x.a ? "✓" : "✗"}
            </div>
            {ans["q" + j] !== x.a && <div>Bonne réponse : {x.o[x.a]}</div>}
            <div className="exp">{x.e}</div>
          </div>
        ))}
      </div>
    );
  }

  const x = Qs[i], sel = ans["q" + i], answered = sel !== undefined;
  return (
    <div className="wrap">
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#9bb0d3" }}>
        <span>{name}</span><span>Question {i + 1} / {Qs.length}</span>
      </div>
      <div className="bar"><i style={{ width: `${(i / Qs.length) * 100}%` }} /></div>
      {!answered && st.dq === i && (() => {
        const ms = Math.max(0, st.dl - now), left = Math.ceil(ms / 1000);
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
            <div className="bar" style={{ flex: 1, height: 12 }}>
              <i style={{ width: (ms / (LIMIT * 1000)) * 100 + "%", background: left <= 10 ? "#ef5350" : "#13b9fd", transition: "width .25s linear" }} />
            </div>
            <b style={{ width: 52, textAlign: "right", fontSize: 20, color: left <= 10 ? "#ff8a95" : "#e8eef9" }}>⏱ {left}s</b>
          </div>
        );
      })()}
      <h2 style={{ fontSize: 20, margin: "20px 0 8px" }}>{x.q}</h2>
      {x.o.map((t, k) => (
        <button key={k} disabled={answered} onClick={() => choose(k)}
          className={"opt" + (answered ? (k === x.a ? " ok" : k === sel ? " ko" : "") : "")}>
          <b style={{ marginRight: 8 }}>{"ABCD"[k]}.</b>{t}
        </button>
      ))}
      {answered && (
        <>
          <div className="exp">
            <b>{sel === -1 ? "⏱ Temps écoulé (comptée fausse). " : sel === x.a ? "✓ Correct. " : "✗ Incorrect. "}</b>{x.e}
            {sel === -1 && <div style={{ marginTop: 6, color: "#9bb0d3" }}>Passage automatique à la question suivante dans 6 s…</div>}
          </div>
          <button className="btn" onClick={() => setI(i + 1)}>{i + 1 === Qs.length ? "Voir mon résultat" : "Suivant →"}</button>
        </>
      )}
    </div>
  );
}

function Teacher({ qcm }) {
  const Qs = qcm.questions, n = Qs.length, base = `qcm/${qcm.id}`;
  const [ok, setOk] = useState(false);
  const [code, setCode] = useState("");
  const [d, setD] = useState({});

  useEffect(() => (ok ? onValue(ref(db, base), (s) => setD(s.val() || {})) : undefined), [ok]);

  if (!ok)
    return (
      <div className="wrap">
        <h1>Espace enseignant</h1>
        <div className="card">
          <input type="password" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code d'accès"
            onKeyDown={(e) => e.key === "Enter" && code === TEACHER_CODE && setOk(true)} />
          <button className="btn" onClick={() => (code === TEACHER_CODE ? setOk(true) : alert("Code incorrect"))}>Entrer</button>
        </div>
      </div>
    );

  const P = Object.entries(d.players || {}).map(([id, p]) => ({ id, ...p, k: Object.keys(p.ans || {}).length }));
  const done = P.filter((p) => p.done);
  const avg = done.length ? (done.reduce((s, p) => s + p.score, 0) / done.length).toFixed(1) : "–";
  const hist = Array.from({ length: n + 1 }, (_, s) => done.filter((p) => p.score === s).length);
  const hmax = Math.max(1, ...hist);
  const qs = Qs.map((x, j) => {
    const a = P.filter((p) => p.ans && p.ans["q" + j] !== undefined);
    return { a: a.length, c: a.filter((p) => p.ans["q" + j] === x.a).length, t: a.filter((p) => p.ans["q" + j] === -1).length };
  });
  const ranked = [...P].sort((a, b) => b.score - a.score || b.k - a.k || a.t - b.t);

  const csv = () => {
    const rows = ["Nom;Score;Sur;Termine", ...ranked.map((p) => `${p.name};${p.score};${n};${p.done ? "oui" : "non"}`)];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["\ufeff" + rows.join("\n")], { type: "text/csv" }));
    a.download = `${qcm.id}_resultats.csv`;
    a.click();
  };

  return (
    <div className="wrap wide">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 14 }}>
        <h1 style={{ margin: 0, flex: 1 }}>{qcm.titre} <span className={"tag " + (d.open ? "on" : "off")}>{d.open ? "OUVERT" : "FERMÉ"}</span></h1>
        <button className="btn" onClick={() => {
          const o = !d.open, u = { [`${base}/open`]: o };
          if (o && !d.code) u[`${base}/code`] = String(Math.floor(1000 + Math.random() * 9000));
          update(ref(db), u);
        }}>{d.open ? "Fermer la session" : "Ouvrir la session"}</button>
        <button className="btn g" onClick={() => set(ref(db, `${base}/code`), String(Math.floor(1000 + Math.random() * 9000)))}>🔑 Nouveau code</button>
        <button className="btn g" onClick={csv}>⬇ CSV</button>
        <button className="btn r" onClick={() => window.confirm("Supprimer toutes les réponses ?") && remove(ref(db, `${base}/players`))}>Réinitialiser</button>
      </div>

      <div className="card" style={{ textAlign: "center" }}>
        <span style={{ color: "#9bb0d3" }}>Code d'accès à donner aux étudiants</span>
        <div className="big" style={{ letterSpacing: 10, margin: "4px 0" }}>{d.code || "— — — —"}</div>
        {!d.code && <small style={{ color: "#9bb0d3" }}>Il sera généré à l'ouverture de la session.</small>}
      </div>

      <div className="grid">
        <div className="stat"><b>{P.length}</b><span>Étudiants connectés</span></div>
        <div className="stat"><b>{done.length}</b><span>Ont terminé</span></div>
        <div className="stat"><b>{P.length - done.length}</b><span>En cours</span></div>
        <div className="stat"><b>{avg}<small style={{ fontSize: 16 }}> /{n}</small></b><span>Moyenne (terminés)</span></div>
      </div>

      <h2>Taux de réussite par question</h2>
      <div className="card">
        {qs.map((s, j) => {
          const r = pct(s.c, s.a);
          return (
            <div className="row" key={j} title={Qs[j].q}>
              <span className="l">Q{j + 1} · {Qs[j].q.slice(0, 22)}…</span>
              <div className="bar"><i style={{ width: r + "%", background: s.a === 0 ? "#234a80" : r < 40 ? "#ef5350" : r < 70 ? "#ffb74d" : "#2ecc71" }} /></div>
              <span className="v">{s.a ? r + "% " : "–"}<small style={{ color: "#7f98c0" }}>({s.a}{s.t ? ` · ⏱${s.t}` : ""})</small></span>
            </div>
          );
        })}
      </div>

      <h2>Distribution des scores</h2>
      <div className="card">
        <div className="hist">
          {hist.map((c, s) => (
            <div key={s}><span>{c || ""}</span><i style={{ height: (c / hmax) * 100 + "px" }} /><span>{s}</span></div>
          ))}
        </div>
      </div>

      <h2>Classement et progression</h2>
      <div className="card scroll">
        <table>
          <thead><tr><th>#</th><th>Nom</th><th>Progression</th><th>Score</th></tr></thead>
          <tbody>
            {ranked.map((p, r) => (
              <tr key={p.id}>
                <td>{r + 1}</td><td>{p.name}</td>
                <td style={{ width: "40%" }}><div className="bar"><i style={{ width: pct(p.k, n) + "%", background: p.done ? "#2ecc71" : "#13b9fd" }} /></div></td>
                <td><b>{p.score}</b> / {n}</td>
              </tr>
            ))}
            {!P.length && <tr><td colSpan={4} style={{ color: "#7f98c0" }}>En attente des étudiants…</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}