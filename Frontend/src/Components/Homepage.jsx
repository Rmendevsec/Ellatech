import React, { useEffect, useMemo, useRef, useState } from "react";

/* ============ DATA — Live images ============ */
const U = (id, w = 800) => `https://images.unsplash.com/photo-${id}?w=${w}&auto=format&fit=crop`;
const CATS = [
  ["Electronics", [U("1498049794561-7780e7231661", 400)]],
  ["Sport", [U("1461896836934-ffe607ba8211", 400)]],
  ["Food", [U("1504674900247-0877df9cc836", 400)]],
  ["Fashion", [U("1483985988355-763728e1935b", 400)]],
  ["Shoes", [U("1542291026-7eec264c27ff", 400)]],
  ["Health & beauty", [U("1596462502278-27bfdc403348", 400)]],
  ["Books & Education", [U("1495446815901-a7297e633e8d", 400)]],
];

const PRODUCTS = [
  { id: 1, name: "Magnetic Wireless Charger", cat: "Electronics", price: 1850, rating: 4.6, reviews: 128, tag: "New", img: [U("1511707171634-5f897ff02aa9")] },
  { id: 2, name: "Vitamin C Brightening Serum", cat: "Health & beauty", price: 1200, old: 1500, rating: 4.8, reviews: 342, tag: "Trending", img: [U("1620916566398-39f1143ab7be")] },
  { id: 3, name: "Retro Court Sneakers", cat: "Shoes", price: 4200, old: 5200, rating: 4.7, reviews: 215, tag: "Sale", img: [U("1542291026-7eec264c27ff")] },
  { id: 4, name: "Striped Tee & Denim Set", cat: "Fashion", price: 2600, rating: 4.5, reviews: 96, tag: "", img: [U("1542272604-787c3835535d")] },
  { id: 5, name: "Smart Wall Socket", cat: "Electronics", price: 650, rating: 4.4, reviews: 61, tag: "", img: [U("1620626011761-996317b8d101")] },
  { id: 6, name: "Modern LED Wall Light", cat: "Electronics", price: 980, rating: 4.6, reviews: 140, tag: "Hot", img: [U("1565814329452-e1efa11c5b89")] },
  { id: 7, name: "Pro Digital Camera", cat: "Electronics", price: 18500, rating: 4.7, reviews: 87, tag: "", img: [U("1516035069371-29a1b244cc32")] },
  { id: 8, name: "Solar Panel 200W", cat: "Electronics", price: 9800, rating: 4.8, reviews: 173, tag: "", img: [U("1509391366360-2e959784a276")] },
  { id: 9, name: "Running Shorts", cat: "Sport", price: 780, rating: 4.3, reviews: 54, tag: "", img: [U("1591195853828-11db59a44f6b")] },
  { id: 10, name: "Teff Flour 10kg", cat: "Food", price: 1450, rating: 4.9, reviews: 410, tag: "Local", img: [U("1509440159596-0249088772ff")] },
  { id: 11, name: "Habesha Kemis", cat: "Fashion", price: 5200, rating: 4.9, reviews: 188, tag: "Local", img: [U("1595777457583-95e059d581b8")] },
  { id: 12, name: "Notebook Set", cat: "Books & Education", price: 320, rating: 4.5, reviews: 77, tag: "", img: [U("1544816155-12df9643f363")] },
  { id: 13, name: "Fresh Fruit Basket", cat: "Food", price: 900, rating: 4.6, reviews: 63, tag: "Fresh", img: [U("1542838132-92c53300491e")] },
  { id: 14, name: "Men's Habesha Suit", cat: "Fashion", price: 6400, rating: 4.8, reviews: 92, tag: "Local", img: [U("1506794778202-cad84cf45f1d")] },
  { id: 15, name: "Couple Traditional Set", cat: "Fashion", price: 11800, rating: 4.8, reviews: 41, tag: "Local", img: [U("1621784563330-caee0b138a00")] },
  { id: 16, name: "Handwoven Colorful Basket", cat: "Fashion", price: 1750, rating: 4.7, reviews: 58, tag: "Local", img: [U("1550614000-4b95d466f2a6")] },
];

const HERO = [
  { id: 13, l: 0, t: 0, w: 19.3, n: "tr" }, { id: 14, l: 20.3, t: 29.5, w: 19.1, n: "tr" },
  { id: 15, l: 42, t: 44.4, w: 16, n: "" }, { id: 11, l: 60.4, t: 29.5, w: 19.1, n: "tl" },
  { id: 16, l: 80.5, t: 0, w: 19.5, n: "tl" },
];

const COLL = [
  ["Fashion", "Habesha & modern wear", [U("1595777457583-95e059d581b8")], "c-t"],
  ["Electronics", "Phones, cameras, solar", [U("1498049794561-7780e7231661")], "c-l"],
  ["Food", "Teff, fruit & more", [U("1504674900247-0877df9cc836")], "c-r"],
  ["Health & beauty", "Skincare essentials", [U("1596462502278-27bfdc403348")], "c-b"],
];

const PERKS = [
  // ["M5 12l5 5 9-10", "Secure checkout"], ["M3 6h11v10H3zM14 9h4l3 3v4h-7", "Delivery to your home"],
  // ["M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18", "Local & international"],
  // ["M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z", "Order anytime"],
];

const SOCIAL = [
  ["Facebook", "M15 3h-2a4 4 0 00-4 4v3H7v4h2v7h4v-7h2.5l.5-4H13V7a1 1 0 011-1h1z"],
  ["Instagram", "M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zM12 8a4 4 0 100 8 4 4 0 000-8zM17.5 6.5h.01"],
  ["Telegram", "M21 4L3 11l6 2 2 6 3-4 5 4L21 4zM9 13l12-9"],
  ["X", "M4 4l16 16M20 4L4 20"],
];

const STAR = "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z";

const STEPS = [
  ["Browse Products", "Search or pick a category to find what you need.", "M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.5-4.5"],
  ["Add to Cart", "Save items to your cart and adjust quantities anytime.", "M3 4h2.5l2 10h10L19 7H6M9 19h.01M17 19h.01"],
  ["Secure Checkout", "Pay safely and confirm your delivery address.", "M5 11h14v9H5zM8 11V8a4 4 0 018 0v3"],
  ["Receive at Home", "Your order arrives at your door, carefully packed.", "M3 6h11v10H3zM14 9h4l3 3v4h-7M7 18h.01M17 18h.01"],
];

const FREE_FROM = 5000, DELIVERY = 150;
const etb = (n) => n.toLocaleString("en-US") + " ETB";

const Ic = ({ d, s = 22, w = 1.8, c = "currentColor" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);

const I = {
  search: "M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.5-4.5", cart: "M3 4h2.5l2 10h10L19 7H6M9 19h.01M17 19h.01",
  heart: "M12 20s-7-4.4-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.600-7 10-7 10z", x: "M6 6l12 12M18 6L6 18",
  plus: "M12 5v14M5 12h14", minus: "M5 12h14", left: "M15 5l-7 7 7 7", right: "M9 5l7 7-7 7", menu: "M4 7h16M4 12h16M4 17h16",
  check: "M5 12l5 5 9-10", truck: "M3 6h11v10H3zM14 9h4l3 3v4h-7",
};

/* ============ HELPERS ============ */
function Img({ src, name = "", className = "" }) {
  const list = useMemo(() => [].concat(src || []), [src]);
  const [i, setI] = useState(0);
  const cur = list[i];
  return (
    <div className={`img ${className}`}>
      {cur ? <img key={cur} src={cur} alt={name} loading="lazy" onError={() => setI((n) => n + 1)} /> : <span className="ph">{name.charAt(0)}</span>}
    </div>
  );
}
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return ref;
}
const Reveal = ({ as: T = "div", className = "", children, ...p }) => {
  const ref = useReveal();
  return <T ref={ref} className={`rv ${className}`} {...p}>{children}</T>;
};

export default function MerkatoLandingPro() {
  const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem("mk-cart")) || {}; } catch { return {}; } });
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [done, setDone] = useState(false);
  const [toast, setToast] = useState("");
  const [wish, setWish] = useState({});
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [email, setEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const searchRef = useRef(null);
  const rail = useRef(null);

  useEffect(() => { try { localStorage.setItem("mk-cart", JSON.stringify(cart)); } catch {} }, [cart]);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      setScrolled(window.scrollY > 12);
      setProgress((window.scrollY / Math.max(1, h.scrollHeight - h.clientHeight)) * 100);
    };
    on(); window.addEventListener("scroll", on, { passive: true });
    const key = (e) => { if (e.key === "/" && document.activeElement.tagName !== "INPUT") { e.preventDefault(); searchRef.current?.focus(); } if (e.key === "Escape") { setOpen(false); setMenu(false); } };
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("keydown", key); };
  }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 2200); return () => clearTimeout(t); }, [toast]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  const add = (p) => { setCart((c) => ({ ...c, [p.id]: (c[p.id] || 0) + 1 })); setDone(false); setToast(`${p.name} added to cart`); };
  const setQty = (id, d) => setCart((c) => { const n = (c[id] || 0) + d; const x = { ...c }; if (n <= 0) delete x[id]; else x[id] = n; return x; });
  const lines = useMemo(() => Object.entries(cart).map(([id, qty]) => ({ p: PRODUCTS.find((x) => x.id === +id), qty })).filter((l) => l.p), [cart]);
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const sub = lines.reduce((a, l) => a + l.qty * l.p.price, 0);
  const ship = sub === 0 || sub >= FREE_FROM ? 0 : DELIVERY;

  const results = useMemo(() => PRODUCTS.filter((p) => (cat === "All" || p.cat === cat) && (p.name + p.cat).toLowerCase().includes(q.trim().toLowerCase())), [cat, q]);
  const suggest = q.trim() ? PRODUCTS.filter((p) => (p.name + p.cat).toLowerCase().includes(q.trim().toLowerCase())).slice(0, 5) : [];
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const pickCat = (c) => { setCat(c); setQ(""); go("products"); };
  const pickSuggest = (p) => { setQ(p.name); setCat("All"); setFocus(false); go("products"); };
  const subscribe = (e) => { e.preventDefault(); if (/^\S+@\S+\.\S+$/.test(email)) { setEmailMsg("You're subscribed. Welcome to Merkato!"); setEmail(""); } else setEmailMsg("Enter a valid email address."); };
  const checkout = () => { setCart({}); setDone(true); };
  const scrollRail = (d) => rail.current?.scrollBy({ left: d * 320, behavior: "smooth" });

  return (
    <div className="mk">
      <style>{css}</style>
      <div className="bar" style={{ width: progress + "%" }} />

      {/* NAV */}
      <header className={`nav ${scrolled ? "sc" : ""}`}>
        <a href="#top" className="brand" onClick={(e) => { e.preventDefault(); go("top"); }}>
          <img src="/logo.png" alt="Merkato Logo" className="logo-img" />
          Merkato
        </a>
        <nav className={`links ${menu ? "show" : ""}`}>
          {[["Home", "top"], ["Categories", "cats"], ["Products", "products"], ["How it works", "how"], ["New", "new"],["Videos", "videos"]].map(([l, id]) => (
            <a key={id} href={"#" + id} onClick={(e) => { e.preventDefault(); setMenu(false); go(id); }}>{l}</a>
          ))}
        </nav>
        <div className="actions">
          <button className="cartbtn" onClick={() => setOpen(true)} aria-label={`Open cart, ${count} items`}>
            <Ic d={I.cart} />{count > 0 && <b key={count} className="badge">{count}</b>}
          </button>
          <button className="btn solid sm hide-m"> <a href="http://localhost:5173/auth">Register</a></button>
          <button className="burger" onClick={() => setMenu(!menu)} aria-label="Menu"><Ic d={menu ? I.x : I.menu} /></button>
        </div>
      </header>

      {/* SEARCH */}
      <div className="search">
        <Ic d={I.search} s={20} />
        <input ref={searchRef} value={q} placeholder="What do you want today..." aria-label="Search products"
          onChange={(e) => { setQ(e.target.value); setFocus(true); }} onFocus={() => setFocus(true)} onBlur={() => setTimeout(() => setFocus(false), 150)}
          onKeyDown={(e) => { if (e.key === "Enter") { setFocus(false); go("products"); } }} />
        <kbd>/</kbd>
        {focus && q.trim() && (
          <ul className="drop">
            {suggest.length ? suggest.map((p) => (
              <li key={p.id}><button onMouseDown={() => pickSuggest(p)}><Img src={p.img} name={p.name} className="mini" /><span>{p.name}<small>{p.cat}</small></span><em>{etb(p.price)}</em></button></li>
            )) : <li className="none">No products match “{q}”.</li>}
          </ul>
        )}
      </div>

      {/* HERO */}
      <section id="top" className="hero">
        <h1>Shop anything from<br /><span className="pill">Merkato</span> at your home</h1>
        <p>Find everything you need from Merkato in one place. Order easily and get your items delivered safely to your home.</p>
        <div className="cta">
          <button className="btn solid" onClick={() => go("products")}>Shop Now</button>
          <button className="btn line"><a href="http://localhost:5173/auth">Get Started</a></button>
        </div>
      </section>

      <div className="collage">
        {HERO.map((h, i) => {
          const p = PRODUCTS.find((x) => x.id === h.id);
          return (
            <div key={h.id} className={`ci ${h.n ? "notch-" + h.n : ""}`} style={{ left: h.l + "%", top: h.t + "%", width: h.w + "%", height: "54%", animationDelay: i * 90 + "ms" }}>
              <Img src={p.img} name={p.name} />
              <div className="hc">
                <span><em>{p.name}</em><b>{etb(p.price)}</b></span>
                <button onClick={() => add(p)} aria-label={`Add ${p.name} to cart`}><Ic d={I.plus} s={14} w={2.6} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CATEGORIES */}
      <section id="cats" className="sec">
        <Reveal className="head"><h2>Explore categories</h2>
          <button className="va" onClick={() => pickCat("All")}>View All <Ic d={I.right} s={14} w={2.6} /></button></Reveal>
        <Reveal className="cats">
          {CATS.map(([n, src]) => (
            <button key={n} className={`cat ${cat === n ? "on" : ""}`} onClick={() => pickCat(n)}>
              <Img src={src} name={n} className="round" /><span>{n}</span>
            </button>
          ))}
        </Reveal>
      </section>

      {/* TRENDING */}
      <section id="products" className="sec">
        <Reveal className="head"><h2>Trending Products</h2>
          <button className="va" onClick={() => { setCat("All"); setQ(""); }}>View All <Ic d={I.right} s={14} w={2.6} /></button></Reveal>
        <p className="sub">Check out what's trending on Merkato right now. These top picks are loved by customers and ready to be delivered to your home.</p>
        <div className="chips" role="tablist">
          {["All", ...CATS.map((c) => c[0])].map((c) => <button key={c} role="tab" aria-selected={cat === c} className={cat === c ? "on" : ""} onClick={() => setCat(c)}>{c}</button>)}
        </div>
        {q && <p className="found">{results.length} result{results.length !== 1 && "s"} for “{q}” <button onClick={() => setQ("")}>Clear</button></p>}
        <div className="grid">
          {results.slice(0, 8).map((p, i) => (
            <article key={p.id} className="card" style={{ animationDelay: i * 50 + "ms" }}>
              <div className="media">
                <Img src={p.img} name={p.name} />
                {p.tag && <span className={`tag ${p.tag.toLowerCase()}`}>{p.tag}</span>}
                <button className={`heart ${wish[p.id] ? "on" : ""}`} aria-pressed={!!wish[p.id]} aria-label="Save to wishlist" onClick={() => setWish({ ...wish, [p.id]: !wish[p.id] })}><Ic d={I.heart} s={18} /></button>
              </div>
              <div className="info">
                <span>{p.cat}</span>
                <h3>{p.name}</h3>
                <div className="rate" aria-label={`Rated ${p.rating} out of 5`}>
                  {[1, 2, 3, 4, 5].map((n) => <svg key={n} width="14" height="14" viewBox="0 0 24 24" fill={n <= Math.round(p.rating) ? "#fdb022" : "none"} stroke="#fdb022" strokeWidth="1.6" strokeLinejoin="round"><path d={STAR} /></svg>)}
                  <em>{p.rating} ({p.reviews})</em>
                </div>
                <div className="buy">
                  <div><b>{etb(p.price)}</b>{p.old && <s>{etb(p.old)}</s>}</div>
                  <button className="addb" onClick={() => add(p)} aria-label={`Add ${p.name} to cart`}><Ic d={I.cart} s={20} /></button>
                </div>
              </div>
            </article>
          ))}
          {!results.length && <p className="empty">Nothing here yet. Try another category or clear your search.</p>}
        </div>
      </section>

      {/* STEPS — Solid Orange, No Animation */}
      <section id="how" className="sec">
        <Reveal><h2>Shop in 4 Simple Steps</h2>
          <p className="sub">From browsing to delivery, shopping on Merkato is effortless. Follow these simple steps and enjoy a smooth experience.</p></Reveal>
        <div className="steps">
          {STEPS.map(([t, d, p], i) => (
            <div key={t} className="step">
              <div className="step-ic"><Ic d={p} s={32} w={1.5} /></div>
              <strong>{t}</strong>
              <span>{d}</span>
            </div>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section id="new" className="sec">
        <Reveal className="head"><h2>Explore the new arrival</h2>
          <div className="arrows"><button onClick={() => scrollRail(-1)} aria-label="Previous"><Ic d={I.left} s={18} /></button><button onClick={() => scrollRail(1)} aria-label="Next"><Ic d={I.right} s={18} /></button></div></Reveal>
        <div className="rail" ref={rail}>
          {[...PRODUCTS].reverse().slice(0, 8).map((p) => (
            <article key={p.id} className="rc">
              <Img src={p.img} name={p.name} /><span className="new">New</span>
              <div><h3>{p.name}</h3><b>{etb(p.price)}</b></div>
              <button onClick={() => add(p)} aria-label={`Add ${p.name}`}><Ic d={I.plus} s={18} w={2.4} /></button>
            </article>
          ))}
        </div>
      </section>

      {/* EXPLORE CIRCLE */}
      <section className="sec">
        <Reveal className="orbit2">
          <svg className="rings" viewBox="0 0 1000 900" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            {[250, 330, 420].map((r) => <circle key={r} cx="500" cy="450" r={r} />)}
          </svg>
          <div className="core2">
            <small>Discover</small>
            <h3>Explore the<br />new arrival</h3>
            <button className="btn dark sm" onClick={() => { setCat("All"); setQ(""); go("new"); }}>Shop Now</button>
          </div>
          {COLL.map(([name, sub, srcs, cls], i) => (
            <button key={name} className={`coll ${cls}`} style={{ animationDelay: i * 0.7 + "s" }} onClick={() => pickCat(name)}>
              <Img src={srcs} name={name} />
              <span><b>{name}</b><small>{sub}</small></span>
              <i><Ic d={I.right} s={14} w={2.6} /></i>
            </button>
          ))}
          {PERKS.map(([d, t], i) => <div key={t} className={`perk p${i + 1}`}><Ic d={d} s={18} />{t}</div>)}
        </Reveal>
      </section>

      {/* FOOTER — Modern Light Redesign */}
      <footer className="foot">
        <div id="newsletter" className="news">
          <div><h2>Get new arrivals first</h2><p>Join Merkato and hear about new products and offers.</p></div>
          <form onSubmit={subscribe} noValidate>
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setEmailMsg(""); }} placeholder="you@example.com" aria-label="Email address" />
            <button className="btn solid">Register</button>
            <small role="status">{emailMsg}</small>
          </form>
        </div>
        <div className="cols2">
          <div className="fb">
            <div className="brand">
              <img src="/logo.png" alt="Merkato Logo" className="logo-img" />
              Merkato
            </div>
            <p>Your one-stop marketplace for Ethiopian and international products, delivered safely to your home.</p>
            <div className="soc">{SOCIAL.map(([n, d]) => <a key={n} href="#" aria-label={n} onClick={(e) => e.preventDefault()}><Ic d={d} s={18} /></a>)}</div>
            <p className="loc"><Ic d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zM12 12a2 2 0 100-4 2 2 0 000 4z" s={16} />Addis Ababa, Ethiopia</p>
          </div>
          {[["Shop", ["Electronics", "Fashion", "Shoes", "Food", "Sport"]], ["Company", ["About", "Contact", "Careers", "Press", "Blog"]], ["Support", ["Help center", "Delivery", "Returns", "Payments", "Track order"]], ["Legal", ["Terms", "Privacy", "Cookies", "Security", "Sitemap"]]].map(([h, ls]) => (
            <ul key={h}><li className="h">{h}</li>{ls.map((l) => <li key={l}><a href="#" onClick={(e) => { e.preventDefault(); if (CATS.some((c) => c[0] === l)) pickCat(l); }}>{l}</a></li>)}</ul>
          ))}
        </div>
        <div className="legal2">
          <span>© {new Date().getFullYear()} Merkato. All rights reserved.</span>
          <div className="pay">{["Telebirr", "CBE Birr", "Visa", "Mastercard"].map((m) => <span key={m}>{m}</span>)}</div>
          <button className="totop" onClick={() => go("top")}>Back to top <Ic d="M12 19V5M5 12l7-7 7 7" s={14} w={2.4} /></button>
        </div>
      </footer>

      {/* CART DRAWER */}
      <div className={`scrim ${open ? "on" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`drawer ${open ? "on" : ""}`} aria-hidden={!open} aria-label="Cart">
        <div className="dh"><h3>Your cart <span>({count})</span></h3><button onClick={() => setOpen(false)} aria-label="Close cart"><Ic d={I.x} /></button></div>
        {done ? (
          <div className="state"><span className="okc"><Ic d={I.check} s={34} w={2.6} c="#fff" /></span><h4>Order placed</h4><p>Thank you! Your items will be delivered to your home in 2–3 days.</p><button className="btn solid" onClick={() => { setOpen(false); setDone(false); }}>Keep shopping</button></div>
        ) : !lines.length ? (
          <div className="state"><Ic d={I.cart} s={40} w={1.4} /><h4>Your cart is empty</h4><p>Add a product and it will show up here.</p><button className="btn solid" onClick={() => { setOpen(false); go("products"); }}>Browse Products</button></div>
        ) : (
          <>
            <div className="ship"><span>{sub >= FREE_FROM ? "You get free delivery" : `Add ${etb(FREE_FROM - sub)} for free delivery`}</span><i><b style={{ width: Math.min(100, (sub / FREE_FROM) * 100) + "%" }} /></i></div>
            <ul className="items">
              {lines.map(({ p, qty }) => (
                <li key={p.id}><Img src={p.img} name={p.name} className="mini lg" />
                  <div><h4>{p.name}</h4><span>{etb(p.price)}</span>
                    <div className="qty"><button onClick={() => setQty(p.id, -1)} aria-label="Decrease"><Ic d={I.minus} s={14} w={2.4} /></button><b>{qty}</b><button onClick={() => setQty(p.id, 1)} aria-label="Increase"><Ic d={I.plus} s={14} w={2.4} /></button></div></div>
                  <button className="rm" onClick={() => setQty(p.id, -qty)} aria-label="Remove"><Ic d={I.x} s={16} /></button></li>
              ))}
            </ul>
            <div className="sum">
              <p><span>Subtotal</span><b>{etb(sub)}</b></p>
              <p><span>Delivery</span><b>{ship ? etb(ship) : "Free"}</b></p>
              <p className="tot"><span>Total</span><b>{etb(sub + ship)}</b></p>
              <button className="btn solid full" onClick={checkout}>Secure Checkout</button>
            </div>
          </>
        )}
      </aside>

      <div className={`toast ${toast ? "on" : ""}`} role="status"><Ic d={I.check} s={16} w={2.6} />{toast}</div>
    </div>
  );
}

/* ============ STYLES ============ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
.mk{--o:#FC5207;--o2:#e44700;--ink:#101828;--mut:#667085;--bg:#f5f6f8;--ln:#e6e8ec;font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:var(--ink);background:#fff;overflow-x:clip;-webkit-font-smoothing:antialiased;line-height:1.5}
.mk *{box-sizing:border-box;margin:0}
.mk button{font:inherit;color:inherit;border:0;background:none;cursor:pointer}
.mk a{color:inherit;text-decoration:none}
.mk ul{list-style:none;padding:0}
.mk :focus-visible{outline:2px solid var(--o);outline-offset:3px}
.bar{position:fixed;top:0;left:0;height:3px;background:var(--o);z-index:90;transition:width .1s}

.nav{position:sticky;top:0;z-index:60;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:14px clamp(16px,4vw,56px);transition:.3s}
.nav.sc{background:rgba(255,255,255,.82);backdrop-filter:blur(14px);box-shadow:0 1px 0 var(--ln)}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:20px;letter-spacing:-.02em}
.logo-img{width:34px;height:34px;border-radius:11px;object-fit:contain}
.links{display:flex;gap:clamp(18px,3vw,44px);font-weight:500;font-size:15px}
.links a{position:relative;padding:4px 0;color:#344054}
.links a::after{content:"";position:absolute;left:0;bottom:-2px;height:2px;width:100%;background:var(--o);transform:scaleX(0);transform-origin:left;transition:transform .25s}
.links a:hover::after{transform:scaleX(1)}
.actions{display:flex;align-items:center;gap:14px}
.cartbtn{position:relative;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;transition:.2s}
.cartbtn:hover{background:var(--bg)}
.badge{position:absolute;top:2px;right:0;min-width:19px;height:19px;border-radius:99px;background:var(--o);color:#fff;font-size:11px;display:grid;place-items:center;padding:0 5px;animation:pop .35s}
.burger{display:none;width:44px;height:44px;border-radius:50%;place-items:center}
.btn{display:inline-flex;justify-content:center;align-items:center;border-radius:99px;font-weight:600;font-size:15px;padding:15px 38px;transition:transform .2s,background .2s,box-shadow .2s}
.btn:hover{transform:translateY(-2px)}
.btn.solid{background:var(--o);color:#fff;box-shadow:0 10px 24px -10px rgba(252,82,7,.7)}
.btn.solid:hover{background:var(--o2)}
.btn.line{border:1.5px solid var(--o);color:var(--o);background:#fff}
.btn.line:hover{background:#fff4ee}
.btn.dark{background:var(--ink);color:#fff}
.btn.sm{padding:11px 24px;font-size:14px}
.btn.full{width:100%}

.search{position:relative;display:flex;align-items:center;gap:12px;width:min(92%,800px);margin:18px auto 0;background:#e3e4e6;border:1.5px solid transparent;border-radius:99px;padding:16px 28px;transition:.2s;color:var(--mut)}
.search:focus-within{background:#fff;border-color:var(--o);box-shadow:0 0 0 5px rgba(252,82,7,.12)}
.search input{flex:1;min-width:0;border:0;outline:0;background:none;font:500 15px 'Plus Jakarta Sans',sans-serif;color:var(--ink)}
.search input::placeholder{color:#777}
.search kbd{font:600 12px inherit;border:1px solid #cfd2d6;border-radius:6px;padding:1px 7px;background:#fff}
.drop{position:absolute;left:0;right:0;top:calc(100% + 8px);background:#fff;border-radius:20px;box-shadow:0 24px 60px -12px rgba(16,24,40,.28);padding:8px;z-index:20;animation:up .2s;text-align:left}
.drop button{display:flex;align-items:center;gap:12px;width:100%;padding:8px;border-radius:14px;text-align:left}
.drop button:hover{background:var(--bg)}
.drop span{flex:1;font-weight:600;font-size:14px;color:var(--ink)}
.drop small{display:block;color:var(--mut);font-weight:500}
.drop em{font-style:normal;font-weight:700;font-size:13px;color:var(--o)}
.none{padding:14px;color:var(--mut);font-size:14px}

.hero{text-align:center;padding:clamp(36px,5.5vw,84px) 20px 0}
.hero h1{font-weight:500;font-size:clamp(30px,4.4vw,64px);line-height:1.25;letter-spacing:-.02em}
.pill{display:inline-block;background:var(--o);color:#fff;border-radius:99px;padding:0 .35em;line-height:1.3}
.hero p{max-width:760px;margin:22px auto 0;color:var(--mut);font-size:clamp(14px,1.45vw,20px);line-height:1.55}
.cta{display:flex;gap:clamp(14px,2vw,30px);justify-content:center;margin-top:36px;flex-wrap:wrap}

.collage{position:relative;width:min(96.4%,1390px);margin:clamp(40px,6vw,90px) auto 0;aspect-ratio:502/207}
.ci{position:absolute;border-radius:clamp(10px,1.6vw,24px);overflow:hidden;background:#eee;animation:in .9s cubic-bezier(.2,.8,.2,1) both;transition:transform .35s,box-shadow .35s}
.ci:hover{transform:translateY(-6px);box-shadow:0 26px 50px -22px rgba(16,24,40,.45)}
.ci:hover img{transform:scale(1.05)}
.ci .img{width:100%;height:100%}
.ci.notch-tr::after,.ci.notch-tl::after{content:"";position:absolute;top:0;width:32%;height:17%;background:#fff}
.ci.notch-tr::after{right:0;border-bottom-left-radius:clamp(10px,1.6vw,24px)}
.ci.notch-tl::after{left:0;border-bottom-right-radius:clamp(10px,1.6vw,24px)}
.hc{position:absolute;z-index:3;left:8px;right:8px;bottom:8px;display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.9);backdrop-filter:blur(8px);border-radius:14px;padding:6px 6px 6px 10px}
.hc span{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.25;text-align:left}
.hc em{font-style:normal;font-weight:700;font-size:clamp(9px,.95vw,13px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hc b{color:var(--o);font-size:clamp(9px,.9vw,12px)}
.hc button{flex:none;width:clamp(22px,2.2vw,32px);height:clamp(22px,2.2vw,32px);border-radius:50%;background:var(--o);color:#fff;display:grid;place-items:center;transition:.25s}
.hc button:hover{transform:rotate(90deg) scale(1.1)}

.img{position:relative;overflow:hidden;background:linear-gradient(135deg,#ffe6d9,#ffd0b8)}
.img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s}
.ph{position:absolute;inset:0;display:grid;place-items:center;font-weight:800;font-size:34px;color:var(--o);opacity:.6}

.sec{max-width:1440px;margin:0 auto;padding:clamp(48px,7vw,100px) clamp(16px,4vw,56px) 0}
.head{display:flex;justify-content:space-between;align-items:center;gap:16px}
h2{font-weight:800;font-size:clamp(28px,3.4vw,46px);letter-spacing:-.03em;line-height:1.1}
.va{display:inline-flex;align-items:center;gap:6px;color:var(--mut);font-weight:600;font-size:15px;transition:.2s}
.va:hover{color:var(--o);gap:10px}
.sub{color:var(--mut);font-size:clamp(15px,1.3vw,18px);max-width:620px;margin-top:14px}
.rv{opacity:0;transform:translateY(22px);transition:opacity .7s,transform .7s cubic-bezier(.2,.8,.2,1)}
.rv.in{opacity:1;transform:none}

.cats{display:flex;justify-content:space-between;gap:14px;margin-top:36px;overflow-x:auto;padding:6px 4px 14px;scrollbar-width:none}
.cat{flex:1 0 108px;display:flex;flex-direction:column;align-items:center;gap:12px;font-weight:600;font-size:14px;color:var(--mut);white-space:nowrap;transition:.25s}
.round{width:clamp(88px,10.5vw,148px);aspect-ratio:1;border-radius:50%;box-shadow:0 0 0 0 var(--o);transition:.3s}
.cat:hover .round,.cat.on .round{box-shadow:0 0 0 4px #fff,0 0 0 7px var(--o);transform:translateY(-4px)}
.cat:hover img{transform:scale(1.08)}
.cat:hover,.cat.on{color:var(--ink)}

.chips{display:flex;gap:10px;margin-top:28px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px}
.chips button{flex:none;padding:10px 20px;border-radius:99px;border:1.5px solid var(--ln);font-weight:600;font-size:14px;color:#344054;transition:.2s}
.chips button:hover{border-color:var(--o)}
.chips button.on{background:var(--ink);border-color:var(--ink);color:#fff}
.found{margin-top:18px;color:var(--mut);font-size:14px}
.found button{color:var(--o);font-weight:700;margin-left:8px}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(12px,1.6vw,24px);margin-top:28px;min-height:300px}
.empty{grid-column:1/-1;text-align:center;color:var(--mut);padding:60px 0}
.card{animation:up .5s both}
.media{position:relative;aspect-ratio:3/4;border-radius:24px;overflow:hidden;background:var(--bg)}
.media .img{width:100%;height:100%}
.card:hover .media img{transform:scale(1.06)}
.heart{position:absolute;top:12px;right:12px;width:38px;height:38px;border-radius:50%;background:#fff;display:grid;place-items:center;color:#344054;box-shadow:0 6px 16px -6px rgba(0,0,0,.3);transition:.2s}
.heart.on{color:var(--o);background:#fff4ee}.heart.on svg{fill:var(--o)}
.heart:active{transform:scale(.88)}
.quick{position:absolute;left:12px;right:12px;bottom:12px;display:flex;justify-content:center;align-items:center;gap:6px;padding:13px;border-radius:99px;background:var(--o);color:#fff;font-weight:700;font-size:14px;transform:translateY(130%);transition:transform .35s cubic-bezier(.2,.8,.2,1)}
.card:hover .quick,.quick:focus-visible{transform:none}
.info{padding:14px 4px 0}.info span{font-size:12px;color:var(--mut);font-weight:600}
.info h3{font-size:16px;font-weight:700;margin:2px 0 4px;letter-spacing:-.01em}.info b{color:var(--o);font-size:15px}

/* STEPS — Solid Orange, No Animation */
.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(12px,1.6vw,24px);margin-top:44px}
.step{background:var(--o);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:clamp(24px,3vw,40px);border-radius:24px;text-align:center;transition:transform .3s,box-shadow .3s}
.step:hover{transform:translateY(-6px);box-shadow:0 20px 40px -10px rgba(252,82,7,.4)}
// .step-ic{width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,.2);display:grid;place-items:center;color:#fff}
.step strong{font-size:18px;font-weight:700}
.step span{font-size:14px;opacity:.9;line-height:1.4}

.arrows{display:flex;gap:10px}
.arrows button{width:46px;height:46px;border-radius:50%;border:1.5px solid var(--ln);display:grid;place-items:center;transition:.2s}
.arrows button:hover{background:var(--ink);color:#fff;border-color:var(--ink)}
.rail{display:flex;gap:20px;overflow-x:auto;scroll-snap-type:x mandatory;margin-top:32px;padding-bottom:12px;scrollbar-width:none}
.rc{position:relative;flex:0 0 clamp(240px,24vw,320px);scroll-snap-align:start;border-radius:28px;overflow:hidden;aspect-ratio:4/5;background:var(--bg)}
.rc .img{position:absolute;inset:0}.rc:hover img{transform:scale(1.06)}
.rc>div{position:absolute;left:0;right:0;bottom:0;padding:60px 20px 20px;color:#fff;background:linear-gradient(transparent,rgba(16,24,40,.85))}
.rc h3{font-size:17px;font-weight:700}.rc b{font-size:14px;opacity:.9}
.rc>button{position:absolute;right:16px;bottom:16px;width:44px;height:44px;border-radius:50%;background:var(--o);color:#fff;display:grid;place-items:center;transition:.2s}
.rc>button:hover{transform:rotate(90deg) scale(1.08)}
.new{position:absolute;top:16px;left:16px;background:#fff;border-radius:99px;padding:4px 12px;font-size:12px;font-weight:800;color:var(--o)}

.orbit2{position:relative;width:min(100%,1000px);margin:0 auto;aspect-ratio:1000/900}
.rings{position:absolute;inset:0;width:100%;height:100%}
.rings circle{fill:none;stroke:#d0d5dd;stroke-width:1}
.core2{position:absolute;left:30%;top:27.8%;width:40%;aspect-ratio:1;border-radius:50%;background:var(--o);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;text-align:center;box-shadow:0 40px 80px -30px rgba(252,82,7,.75)}
.core2 small{font-weight:600;opacity:.85;font-size:clamp(12px,1.3vw,16px)}
.core2 h3{font-weight:700;font-size:clamp(22px,3.4vw,46px);line-height:1.1;letter-spacing:-.03em}
.coll{position:absolute;width:19%;display:flex;flex-direction:column;background:#fff;border-radius:24px;padding:8px;text-align:left;box-shadow:0 24px 50px -24px rgba(16,24,40,.35);animation:bob 6s ease-in-out infinite;transition:box-shadow .3s}
.coll:hover{animation-play-state:paused;box-shadow:0 0 0 3px var(--o),0 30px 60px -24px rgba(252,82,7,.5)}
.coll .img{aspect-ratio:1/.85;border-radius:16px}
.coll:hover img{transform:scale(1.07)}
.coll span{display:flex;flex-direction:column;padding:10px 6px 4px;font-size:clamp(11px,1.2vw,15px)}
.coll b{font-weight:700}.coll small{color:var(--mut);font-size:.85em}
.coll i{position:absolute;right:14px;bottom:14px;width:28px;height:28px;border-radius:50%;background:var(--bg);display:grid;place-items:center;transition:.25s}
.coll:hover i{background:var(--o);color:#fff}
.c-t{left:40.5%;top:0}.c-l{left:2%;top:37%}.c-r{left:79%;top:37%}.c-b{left:40.5%;bottom:0}
.perk{position:absolute;display:flex;align-items:center;gap:10px;background:var(--bg);border-radius:99px;padding:10px 18px 10px 12px;font-weight:600;font-size:clamp(11px,1.15vw,14px)}
.perk svg{color:var(--o)}
.p1{left:1%;top:6%}.p2{right:1%;top:8%}.p3{left:1%;bottom:8%}.p4{right:1%;bottom:6%}

/* FOOTER — Modern Light Redesign */
.foot{background:#f9fafb;color:var(--ink);padding:clamp(40px,5vw,72px) clamp(16px,4vw,56px) 28px;border-top:1px solid var(--ln);margin-top:clamp(60px,8vw,120px)}
.news{max-width:1328px;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:24px;padding-bottom:48px;border-bottom:1px solid var(--ln)}
.news h2{font-size:clamp(24px,2.5vw,32px);color:var(--ink)}
.news p{color:var(--mut);margin-top:8px}
.news form{display:flex;flex-wrap:wrap;gap:10px;flex:1 1 380px;max-width:520px;position:relative}
.news input{flex:1;min-width:0;padding:15px 22px;border-radius:99px;border:1.5px solid var(--ln);background:#fff;color:var(--ink);font:500 15px 'Plus Jakarta Sans',sans-serif;outline:0}
.news input:focus{border-color:var(--o);box-shadow:0 0 0 4px rgba(252,82,7,.1)}
.news small{width:100%;min-height:18px;color:#d92d20;font-size:13px;position:absolute;bottom:-22px;left:10px}

.cols2{max-width:1328px;margin:0 auto;display:grid;grid-template-columns:1.6fr repeat(4,1fr);gap:40px;padding:56px 0 40px}
.fb p{color:var(--mut);margin:16px 0;max-width:340px;font-size:14px}
.soc{display:flex;gap:10px}
.soc a{width:40px;height:40px;border-radius:50%;background:#fff;border:1px solid var(--ln);display:grid;place-items:center;color:var(--mut);transition:.25s}
.soc a:hover{background:var(--o);color:#fff;border-color:var(--o);transform:translateY(-3px)}
.fb .loc{display:flex;align-items:center;gap:8px;color:var(--ink);font-weight:500}
.cols2 ul{display:flex;flex-direction:column;gap:12px;font-size:14px;color:var(--mut)}
.cols2 .h{color:var(--ink);font-weight:700;margin-bottom:4px}
.cols2 ul a{display:inline-block;transition:.2s}.cols2 ul a:hover{color:var(--o);transform:translateX(4px)}

.legal2{max-width:1328px;margin:0 auto;padding-top:24px;border-top:1px solid var(--ln);display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px;color:var(--mut);font-size:13px}
.pay{display:flex;gap:8px;flex-wrap:wrap}.pay span{border:1px solid var(--ln);border-radius:8px;padding:4px 10px;color:var(--ink);font-weight:600;font-size:12px;background:#fff}
.totop{display:flex;align-items:center;gap:8px;color:var(--ink);font-weight:600;font-size:13px;border:1.5px solid var(--ln);border-radius:99px;padding:9px 18px;transition:.2s;background:#fff}
.totop:hover{background:var(--o);color:#fff;border-color:var(--o)}

.scrim{position:fixed;inset:0;background:rgba(16,24,40,.5);backdrop-filter:blur(3px);opacity:0;pointer-events:none;transition:.3s;z-index:70}
.scrim.on{opacity:1;pointer-events:auto}
.drawer{position:fixed;top:0;right:0;bottom:0;width:min(440px,100%);background:#fff;z-index:80;display:flex;flex-direction:column;transform:translateX(105%);transition:transform .45s cubic-bezier(.2,.8,.2,1);box-shadow:-30px 0 60px -30px rgba(16,24,40,.3)}
.drawer.on{transform:none}
.dh{display:flex;justify-content:space-between;align-items:center;padding:22px 24px;border-bottom:1px solid var(--ln)}
.dh h3{font-size:20px;font-weight:800}.dh span{color:var(--mut);font-weight:500}
.dh button{width:40px;height:40px;border-radius:50%;display:grid;place-items:center}.dh button:hover{background:var(--bg)}
.ship{padding:16px 24px;font-size:13px;font-weight:600;background:#fff7f2}
.ship i{display:block;height:6px;border-radius:9px;background:#ffe0d0;margin-top:8px;overflow:hidden}
.ship b{display:block;height:100%;background:var(--o);border-radius:9px;transition:width .5s}
.items{flex:1;overflow-y:auto;padding:8px 24px}
.items li{display:flex;gap:14px;padding:16px 0;border-bottom:1px solid var(--ln);animation:up .3s}
.items li>div{flex:1}.items h4{font-size:15px;font-weight:700}.items span{color:var(--o);font-weight:700;font-size:14px}
.mini{width:44px;height:44px;border-radius:12px;flex:none}.mini.lg{width:76px;height:76px;border-radius:16px}
.qty{display:inline-flex;align-items:center;gap:12px;margin-top:10px;border:1.5px solid var(--ln);border-radius:99px;padding:3px}
.qty button{width:28px;height:28px;border-radius:50%;display:grid;place-items:center}.qty button:hover{background:var(--bg)}
.qty b{min-width:18px;text-align:center;font-size:14px}
.rm{align-self:flex-start;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;color:var(--mut)}.rm:hover{background:var(--bg);color:#d92d20}
.sum{padding:20px 24px 24px;border-top:1px solid var(--ln);display:flex;flex-direction:column;gap:10px}
.sum p{display:flex;justify-content:space-between;color:var(--mut);font-size:14px}.sum p b{color:var(--ink)}
.sum .tot{font-size:18px;font-weight:800;color:var(--ink);margin:6px 0}
.state{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;text-align:center;padding:32px;color:var(--mut)}
.state h4{color:var(--ink);font-size:22px;font-weight:800}.state .btn{margin-top:10px}
.okc{width:72px;height:72px;border-radius:50%;background:#12b76a;display:grid;place-items:center;animation:pop .5s}
.toast{position:fixed;left:50%;bottom:28px;z-index:95;display:flex;align-items:center;gap:10px;background:var(--ink);color:#fff;padding:13px 22px;border-radius:99px;font-weight:600;font-size:14px;transform:translate(-50%,30px);opacity:0;pointer-events:none;transition:.35s cubic-bezier(.2,.8,.2,1)}
.toast.on{transform:translate(-50%,0);opacity:1}.toast svg{color:#12b76a}

.card{background:#fff;border:1px solid var(--ln);border-radius:26px;padding:12px 12px 16px;transition:transform .3s,box-shadow .3s,border-color .3s}
.card:hover{transform:translateY(-6px);box-shadow:0 28px 50px -26px rgba(16,24,40,.35);border-color:transparent}
.media{aspect-ratio:1/1.05;border-radius:18px}
.tag{position:absolute;top:12px;left:12px;z-index:2;padding:4px 11px;border-radius:99px;font-size:11px;font-weight:800;background:var(--ink);color:#fff}
.tag.sale{background:#d92d20}.tag.new,.tag.fresh,.tag.local{background:#079455}.tag.hot,.tag.trending{background:var(--o)}
.info{padding:14px 6px 0}
.info h3{font-size:16px;font-weight:700;margin:2px 0 0;letter-spacing:-.01em}
.rate{display:flex;align-items:center;gap:2px;margin:8px 0 14px}
.rate em{font-style:normal;color:var(--mut);font-size:12px;margin-left:6px}
.buy{display:flex;justify-content:space-between;align-items:center;gap:8px}
.buy b{display:block;font-size:17px;color:var(--ink)}
.buy s{font-size:12px;color:var(--mut)}
.addb{width:44px;height:44px;flex:none;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;transition:.25s}
.addb:hover{background:var(--o);transform:scale(1.08) rotate(-8deg)}

@keyframes bob{50%{transform:translateY(-9px)}}
@keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes in{from{opacity:0;transform:translateY(30px) scale(.94)}}
@keyframes pop{0%{transform:scale(.6)}60%{transform:scale(1.12)}100%{transform:scale(1)}}
@keyframes fill{to{width:100%}}

@media (max-width:1024px){
  .grid{grid-template-columns:repeat(3,1fr)}.steps{grid-template-columns:repeat(2,1fr)}
  .cols2{grid-template-columns:repeat(2,1fr)}.fb{grid-column:1/-1}
}
@media (max-width:900px){.hc{display:none}.perk{display:none}}
@media (max-width:760px){
  .burger{display:grid}.hide-m{display:none}
  .links{position:absolute;left:12px;right:12px;top:100%;flex-direction:column;gap:4px;background:#fff;border-radius:20px;padding:12px;box-shadow:0 24px 50px -12px rgba(16,24,40,.3);opacity:0;pointer-events:none;transform:translateY(-8px);transition:.25s}
  .links.show{opacity:1;pointer-events:auto;transform:none}.links a{padding:12px 14px}
  .grid{grid-template-columns:repeat(2,1fr)}.steps{grid-template-columns:1fr}
  .search kbd{display:none}
  .orbit2{aspect-ratio:auto;display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .rings{display:none}
  .core2{position:static;grid-column:1/-1;width:min(300px,100%);margin:0 auto 10px}
  .coll{position:static;width:auto;animation:none}
  .legal2{justify-content:center;text-align:center}
}
@media (prefers-reduced-motion:reduce){.mk *,.mk *::before,.mk *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}.rv{opacity:1;transform:none}}
`;

