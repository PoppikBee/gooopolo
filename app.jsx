// gooo.polo — one-pager app
const { useState, useEffect, useRef, useCallback } = React;

// ===== DATA =====
const PHOTOS = [
  { id: 1, title: "Soleil bas, marée basse", place: "Côte sauvage", year: "2025",
    url: "assets/photos/sunset-bretagne.jpg" },
  { id: 2, title: "Volant, contre-jour", place: "Voiture ancienne", year: "2025",
    url: "assets/photos/volant-vintage.jpg" },
  { id: 3, title: "Nuit, intérieur", place: "Atmosphères", year: "2025",
    url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1800&q=80&auto=format&fit=crop" },
  { id: 4, title: "Lueur basse", place: "Lumières", year: "2025",
    url: "https://images.unsplash.com/photo-1502209524164-acea936639a2?w=1800&q=80&auto=format&fit=crop" },
  { id: 5, title: "Souffle rouge", place: "Atmosphères", year: "2024",
    url: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=1800&q=80&auto=format&fit=crop" },
  { id: 6, title: "Or & poussière", place: "Lumières", year: "2024",
    url: "https://images.unsplash.com/photo-1485178575877-1a13bf489dfe?w=1800&q=80&auto=format&fit=crop" },
  { id: 7, title: "Bleu froid", place: "Portrait", year: "2025",
    url: "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?w=1800&q=80&auto=format&fit=crop" },
  { id: 8, title: "Silence d'asphalte", place: "Nuit", year: "2024",
    url: "https://images.unsplash.com/photo-1520116468816-95b69f847357?w=1800&q=80&auto=format&fit=crop" },
];

const REELS = [
  { id: 1, title: "Court-métrage · Nocturne", duration: "02:14",
    badge: "Réalisation",
    url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1800&q=80&auto=format&fit=crop" },
  { id: 2, title: "Clip · Onde", duration: "03:42",
    badge: "Direction photo",
    url: "https://images.unsplash.com/photo-1517722014278-c256a91a6fba?w=1800&q=80&auto=format&fit=crop" },
  { id: 3, title: "Doc · L'atelier", duration: "05:58",
    badge: "Op. de prise de vue",
    url: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=1800&q=80&auto=format&fit=crop" },
];

const SECTIONS = [
  { id: "accueil", num: "01", label: "Accueil" },
  { id: "travail", num: "02", label: "Travail" },
  { id: "showreel", num: "03", label: "Showreel" },
  { id: "apropos", num: "04", label: "À propos" },
  { id: "contact", num: "05", label: "Contact" },
];

// ===== HOOKS =====
function useScrolled(threshold = 30) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

function useActiveSection() {
  const [active, setActive] = useState("accueil");
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY + window.innerHeight * 0.4;
      let cur = "accueil";
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= y) cur = s.id;
      }
      setActive(cur);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return active;
}

function useParallax(ref, strength = 0.18) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    function tick() {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress: -1 (above) → 1 (below)
      const center = rect.top + rect.height / 2;
      const p = (center - vh / 2) / vh;
      const offset = -p * strength * rect.height;
      el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    }
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    }
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref, strength]);
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      els.forEach(e => e.classList.add("revealed"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("revealed");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.18 });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }, []);
}

// ===== COMPONENTS =====
function Nav() {
  const scrolled = useScrolled();
  const active = useActiveSection();
  const click = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop, behavior: "smooth" });
  };
  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <a href="#accueil" onClick={e => click(e, "accueil")} className="brand"><em>Gooo</em>.polo</a>
      <ul>
        {SECTIONS.map(s => (
          <li key={s.id}>
            <a href={`#${s.id}`}
               onClick={e => click(e, s.id)}
               className={active === s.id ? "active" : ""}>{s.label}</a>
          </li>
        ))}
      </ul>
      <div className="burger" aria-label="menu"><span></span><span></span></div>
    </nav>
  );
}

function Rail() {
  const active = useActiveSection();
  const click = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop, behavior: "smooth" });
  };
  return (
    <div className="rail">
      {SECTIONS.map(s => (
        <button key={s.id} className={`item ${active === s.id ? "active" : ""}`} onClick={() => click(s.id)}>
          <span className="num">{s.num}</span>
          <span className="dot"></span>
          <span className="lbl">{s.label}</span>
        </button>
      ))}
    </div>
  );
}

function Hero() {
  const imgRef = useRef(null);
  useParallax(imgRef, 0.22);
  return (
    <section id="accueil" className="hero">
      <div className="image-col">
        <img ref={imgRef} src="assets/photos/sunset-bretagne.jpg" alt="" />
        <div className="image-meta">
          <span>© Gooo.polo</span> <span style={{margin:"0 10px",color:"var(--gold)"}}>·</span>
          <span>Côte sauvage <span className="gold">·</span> MMXXVI</span>
        </div>
      </div>
      <div className="text-col" data-reveal>
        <div className="section-eyebrow hero-eyebrow">
          <span className="num">01</span><span>Photographe & Vidéaste</span><span className="rule"></span>
        </div>
        <h1>
          <em>Gooo</em>.polo<br/>
          Une <span className="accent">façon</span><br/>
          de voir.
        </h1>
        <div className="role">
          Photographie <span className="sep">·</span> Vidéo
        </div>
        <p className="lead">
          Atmosphères <em>sombres</em>, lumières travaillées, instants qui méritent d'être arrêtés. Mon chemin pointe vers l'audiovisuel — la photo, elle, ne me quittera jamais.
        </p>
        <div className="ctas">
          <a className="btn" href="#travail" onClick={e => { e.preventDefault(); document.getElementById("travail").scrollIntoView({ behavior: "smooth" }); }}>
            Voir mon travail <span className="arr">→</span>
          </a>
          <a className="btn ghost" href="#contact" onClick={e => { e.preventDefault(); document.getElementById("contact").scrollIntoView({ behavior: "smooth" }); }}>
            Me contacter
          </a>
        </div>
        <div className="scroll-cue">
          <span>Scroll</span>
          <span className="line"></span>
          <span>02 — Travail</span>
        </div>
      </div>
    </section>
  );
}

function Gallery({ tweaks }) {
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const total = PHOTOS.length;
  const mode = tweaks.galleryMode;

  useEffect(() => {
    if (mode !== "story") { setProgress(0); return; }
    const dur = (tweaks.storyDuration || 5) * 1000;
    const start = Date.now();
    let raf;
    function tick() {
      const t = Date.now() - start;
      const p = Math.min(t / dur, 1);
      setProgress(p);
      if (p >= 1) setIdx(i => (i + 1) % total);
      else raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode, idx, tweaks.storyDuration, total]);

  const go = (i) => setIdx(((i % total) + total) % total);
  const cur = PHOTOS[idx];

  return (
    <section id="travail" className="gallery" data-mode={mode}>
      <div className="head">
        <div className="section-eyebrow">
          <span className="num">02</span><span>Travail · Photo</span><span className="rule"></span>
        </div>
        <div className="right">{cur.place} <span className="gold">·</span> {cur.year}</div>
      </div>

      <div className="mode-tag">
        <span className="dot"></span>
        <span>Mode {mode === "story" ? "Story · scroll guidé" : "Galerie · scroll libre"}</span>
      </div>

      <div className="progress">
        {PHOTOS.map((_, i) => (
          <div key={i} className={`seg ${i < idx ? "done" : ""}`}>
            <div className="fill" style={{ width: i === idx ? `${progress * 100}%` : (i < idx ? "100%" : "0%") }}></div>
          </div>
        ))}
      </div>

      <div className="stage">
        <div className="photo-track">
          {PHOTOS.map((p, i) => (
            <div key={p.id} className={`photo ${i === idx ? "active" : ""}`}>
              <div className="photo-inner">
                <img className="photo-img" src={p.url} alt={p.title} loading="lazy" />
                <div className="photo-veil"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="caption">
        <div className="ttl"><em>{cur.title}</em></div>
        <div className="sub">
          <span>{cur.place}</span><span className="dot"></span><span>{cur.year}</span>
        </div>
      </div>

      <div className="counter">
        <span className="now">{String(idx + 1).padStart(2, "0")}</span>
        <span className="sep"></span>
        <span>{String(total).padStart(2, "0")}</span>
      </div>

      <div className="arrows left"><button className="arrow" onClick={() => go(idx - 1)} aria-label="précédent">←</button></div>
      <div className="arrows right"><button className="arrow" onClick={() => go(idx + 1)} aria-label="suivant">→</button></div>

      <div className="thumbs">
        {PHOTOS.map((p, i) => (
          <button key={p.id} className={`thumb ${i === idx ? "active" : ""}`} onClick={() => go(i)} aria-label={`photo ${i+1}`}></button>
        ))}
      </div>
    </section>
  );
}

function Showreel() {
  return (
    <section id="showreel" className="showreel">
      <div className="head" data-reveal>
        <div>
          <div className="section-eyebrow" style={{marginBottom:18}}>
            <span className="num">03</span><span>Showreel · Vidéo</span><span className="rule"></span>
          </div>
          <h2><em>Images</em> en <span className="accent">mouvement</span>.</h2>
        </div>
        <div className="meta-strip">
          <span><span className="v">04</span> projets</span>
          <span><span className="v">2024</span> — 2026</span>
          <span><span className="v">Vimeo</span></span>
        </div>
      </div>

      <div className="frame" data-reveal>
        <img src="https://images.unsplash/photo-1485846234645-a62644f84728?w=2200&q=85&auto=format&fit=crop" alt="" />
        <div className="overlay">
          <div className="play"><span className="tri"></span></div>
          <div className="play-label">Lire le showreel</div>
        </div>
        <div className="timecode">REEL · 02:14</div>
        <div className="info">
          <div className="ttl"><em>Showreel</em> 2026</div>
          <div className="right">
            <div>Sélection · 4 projets</div>
            <div style={{color:"var(--gold)"}}>Vimeo · HD</div>
          </div>
        </div>
      </div>

      <div className="thumbs-grid">
        {REELS.map(r => (
          <a key={r.id} href="#" className="t-card" data-reveal>
            <div className="t-img">
              <img src={r.url} alt={r.title} />
              <div className="badge">{r.badge}</div>
              <div className="duration">{r.duration}</div>
            </div>
            <div className="t-meta">
              <div className="ttl"><em>{r.title}</em></div>
              <div className="sub">→</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function About() {
  const portraitRef = useRef(null);
  useParallax(portraitRef, 0.16);
  return (
    <section id="apropos" className="about">
      <div className="portrait">
        <img ref={portraitRef} src="https://images.unsplash/photo-1506794778202-cad84cf45f1d?w=1400&q=85&auto=format&fit=crop" alt="" />
        <div className="portrait-meta">
          <span>04 <span className="gold">·</span> Portrait</span>
        </div>
      </div>
      <div className="text-col" data-reveal>
        <div className="section-eyebrow">
          <span className="num">04</span><span>À propos</span><span className="rule"></span>
        </div>
        <h2><em>Une façon</em><br/>de voir le monde.</h2>
        <div className="bio">
          <p>Je suis <em>Paul-Henri</em>, photographe et vidéaste. Mon goût pour l'image s'est construit au fil du temps, naturellement — pas d'un seul déclic, mais d'une envie qui n'a fait que grandir.</p>
          <p>Ce qui m'attire ? <span className="accent">Les atmosphères sombres, les lumières travaillées, les images qui ont quelque chose à dire.</span> Les couleurs, la lumière, certains instants méritent d'être arrêtés.</p>
        </div>
        <span className="pullquote">« Même sur un tournage à 80 ans, j'aurai encore un appareil dans les mains. »</span>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="col-left" data-reveal>
        <div className="section-eyebrow">
          <span className="num">05</span><span>Contact</span><span className="rule"></span>
        </div>
        <h2>Une <em>image</em>,<br/>une <em>idée</em> ?</h2>
        <p className="lead">Tournages, collaborations, projets photo — le plus simple est encore d'écrire.</p>
        <a className="mail" href="mailto:hello@gooopolo.fr">hello@gooopolo.fr →</a>

        <div className="socials">
          <div className="label">Réseaux</div>
          <div className="list">
            <a className="item" href="#" target="_blank" rel="noreferrer">
              <span className="left"><span className="num">01</span><span className="name"><em>Instagram</em></span><span className="handle">@gooo.polo</span></span>
              <span className="arrow">→</span>
            </a>
            <a className="item" href="#" target="_blank" rel="noreferrer">
              <span className="left"><span className="num">02</span><span className="name"><em>Vimeo</em></span><span className="handle">vimeo.com/gooopolo</span></span>
              <span className="arrow">→</span>
            </a>
            <a className="item" href="#" target="_blank" rel="noreferrer">
              <span className="left"><span className="num">03</span><span className="name"><em>YouTube</em></span><span className="handle">@gooopolo</span></span>
              <span className="arrow">→</span>
            </a>
            <a className="item" href="#" target="_blank" rel="noreferrer">
              <span className="left"><span className="num">04</span><span className="name"><em>LinkedIn</em></span><span className="handle">Paul-Henri</span></span>
              <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </div>

      <div className="col-right" data-reveal>
        <div className="section-eyebrow">
          <span className="num">05</span><span>Formulaire</span><span className="rule"></span>
        </div>
        <div className="form-head">
          <span className="ttl"><em>Écrivez-moi</em></span>
          <span className="meta">3 champs · 1 envoi</span>
        </div>
        <form className="form" onSubmit={e => e.preventDefault()}>
          <div className="field">
            <label><span className="num">01</span><span>Nom</span></label>
            <input type="text" placeholder="Votre nom" />
          </div>
          <div className="field">
            <label><span className="num">02</span><span>Email</span></label>
            <input type="email" placeholder="vous@exemple.com" />
          </div>
          <div className="field">
            <label><span className="num">03</span><span>Message</span></label>
            <textarea placeholder="Quelques lignes sur le projet…"></textarea>
          </div>
          <div className="submit-row">
            <button type="submit" className="btn">Envoyer <span className="arr">→</span></button>
            <span className="submit-meta"><span className="dot">●</span> Réponse sous 48h</span>
          </div>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="foot">
      <div className="row">
        <div className="brand-big"><em>Gooo</em>.polo</div>
        <div className="nav-mini">
          {SECTIONS.map(s => (
            <a key={s.id} href={`#${s.id}`}>{s.num} — {s.label}</a>
          ))}
        </div>
      </div>
      <div className="micro">
        <span>gooopolo.com <span className="gold">·</span> Paul-Henri <span className="gold">·</span> Photographe & Vidéaste</span>
        <span>MMXXVI <span className="gold">·</span> Tous droits réservés</span>
      </div>
    </footer>
  );
}

function GlobalGrain() {
  return (
    <svg className="global-grain" xmlns="http://www.w3.org/2000/svg">
      <filter id="globalNoise">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
        <feColorMatrix values="0 0 0 0 0.95 0 0 0 0 0.93 0 0 0 0 0.88 0 0 0 0.5 0"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#globalNoise)"/>
    </svg>
  );
}

function App() {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "galleryMode": "gallery",
    "storyDuration": 5,
    "showGrain": true
  }/*EDITMODE-END*/;
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useReveal();

  return (
    <>
      {tweaks.showGrain && <GlobalGrain />}
      <Nav />
      <Rail />
      <main>
        <Hero />
        <Gallery tweaks={tweaks} />
        <Showreel />
        <About />
        <Contact />
        <Footer />
      </main>
      <TweaksPanel title="Tweaks">
        <TweakSection label="Galerie">
          <TweakRadio
            label="Mode"
            value={tweaks.galleryMode}
            options={[
              { value: "gallery", label: "Galerie" },
              { value: "story", label: "Story" },
            ]}
            onChange={(v) => setTweak("galleryMode", v)}
          />
          <p style={{ fontSize: 11, color: "#8a8278", lineHeight: 1.5, marginTop: 4 }}>
            <strong style={{color:"#c8c2b8"}}>Galerie</strong> · scroll libre, flèches + miniatures.<br/>
            <strong style={{color:"#c8c2b8"}}>Story</strong> · auto-avance, barre de progression.
          </p>
          {tweaks.galleryMode === "story" && (
            <TweakSlider
              label="Durée par photo"
              value={tweaks.storyDuration}
              min={2} max={10} step={1}
              unit="s"
              onChange={(v) => setTweak("storyDuration", v)}
            />
          )}
        </TweakSection>
        <TweakSection label="Ambiance">
          <TweakToggle label="Grain photo (overlay)" value={tweaks.showGrain} onChange={(v) => setTweak("showGrain", v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
