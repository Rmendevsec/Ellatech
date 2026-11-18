import React, { useState, useRef, useEffect } from "react";

/* ============ API Mock ============ */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const defaultApi = {
  login: async () => sleep(1200),
  register: async () => sleep(1400),
  google: async () => sleep(900),
  forgot: async () => sleep(1200),
  verify: async () => sleep(1200),
};

/* ============ Constants ============ */
const COPY = {
  login: {
    title: "Welcome back",
    sub: "Login to continue your shopping journey",
    h: ["Back to your account", "and make your life", "simple again"],
  },
  register: {
    title: "Create your account",
    sub: "create an account before enjoying the experience",
    h: ["Simplify your", "shopping experience", "with us"],
  },
  forgot: {
    title: "Forgot your password?",
    sub: "Enter the phone number or email linked to your account, and we'll help you reset your password.",
    h: ["Don't worry if you", "forgot your password"],
  },
  verify: {
    title: "Verify your account",
    sub: "Enter the 6-digit code we sent to your e-mail",
    h: ["Verify Your identity to", "secure your account"],
  },
};
const TAGLINE = "Shop simply and get ready to the future and make your life easy";

/* ============ Validation ============ */
const PHONE = /^(\+?251|0)?9\d{8}$/;
const MAIL = /^\S+@\S+\.\S+$/;
const clean = (v) => v.replace(/[\s-]/g, "");
const LOGIN_RULES = {
  id: (v) => (MAIL.test(v.trim()) || PHONE.test(clean(v)) ? "" : "Enter a valid phone number or email"),
  password: (v) => (v ? "" : "Enter your password"),
};
const REG_RULES = {
  name: (v) => (v.trim().length >= 2 ? "" : "Please enter your full name"),
  phone: (v) => (PHONE.test(clean(v)) ? "" : "Use an Ethiopian number, e.g. +251 912 345 678"),
  password: (v) => (v.length >= 8 ? "" : "Use at least 8 characters"),
  email: (v) => (MAIL.test(v.trim()) ? "" : "Enter a valid email address"),
};
const FORGOT_RULES = {
  contact: (v) => (MAIL.test(v.trim()) || PHONE.test(clean(v)) ? "" : "Enter a valid phone or email"),
};

function useForm(rules) {
  const [vals, setVals] = useState(() => Object.fromEntries(Object.keys(rules).map((k) => [k, ""])));
  const [errs, setErrs] = useState({});
  const set = (k, v) => { setVals((s) => ({ ...s, [k]: v })); if (errs[k]) setErrs((e) => ({ ...e, [k]: rules[k](v) })); };
  const blur = (k) => vals[k] && setErrs((e) => ({ ...e, [k]: rules[k](vals[k]) }));
  const validate = () => {
    const e = Object.fromEntries(Object.keys(rules).map((k) => [k, rules[k](vals[k])]));
    setErrs(e); return !Object.values(e).some(Boolean);
  };
  const bind = (k) => ({ id: k, value: vals[k], error: errs[k], onChange: (v) => set(k, v), onBlur: () => blur(k) });
  return { vals, validate, bind };
}

function strength(p) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}
const LEVELS = [["Weak", "#d92d20"], ["Weak", "#d92d20"], ["Fair", "#f79009"], ["Good", "#84cc16"], ["Strong", "#12b76a"]];

/* ============ Reusable Components ============ */
const Logo = () => (
  <svg className="logo" width="104" height="112" viewBox="0 0 104 112" role="img" aria-label="Merkato Gebeya">
    <g fill="none" stroke="#FF5208" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="52" cy="17" r="10" strokeWidth="6" />
      <path d="M52 29L47 60M52 36L74 40L84 37M52 36L32 47L27 52M47 60L35 82M47 60L62 70L71 81" />
    </g>
    <g fill="#fff" stroke="#222" strokeWidth="1.4">
      <rect x="22" y="52" width="11" height="9" rx="2" /><rect x="82" y="38" width="11" height="9" rx="2" />
    </g>
    <text x="52" y="103" textAnchor="middle" fontSize="14" fontWeight="700" fontFamily="'Noto Sans Ethiopic','Plus Jakarta Sans',sans-serif">
      <tspan fill="#FF5208">መርካቶ </tspan><tspan fill="#111">ገበያ</tspan>
    </text>
  </svg>
);

const Eye = ({ off }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={off ? "M3 3l18 18M10.6 5.1A9.8 9.8 0 0112 5c6 0 10 7 10 7a17 17 0 01-3.2 3.9M6.6 6.6A17 17 0 002 12s4 7 10 7a9.7 9.7 0 004.4-1M9.9 9.9a3 3 0 004.2 4.2" : "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z"} />
  </svg>
);

const Check = ({ s = 18, c = "#fff" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>
);

const Google = () => (
  <svg width="24" height="24" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

function Field({ label, id, type = "text", value, onChange, onBlur, error, placeholder, autoComplete, i, children }) {
  const [show, setShow] = useState(false);
  const pw = type === "password";
  return (
    <div className="field rise" style={{ "--i": i }}>
      <label htmlFor={id}>{label}</label>
      <div className={`inp ${error ? "bad" : ""}`}>
        <input id={id} name={id} type={pw && show ? "text" : type} value={value} placeholder={placeholder} autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)} onBlur={onBlur} aria-invalid={!!error} aria-describedby={error ? id + "-e" : undefined} />
        {pw && (
          <button type="button" className="eye" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"}><Eye off={show} /></button>
        )}
      </div>
      {error && <p className="err" id={id + "-e"} role="alert">{error}</p>}
      {children}
    </div>
  );
}

function Submit({ state, label, done }) {
  return (
    <button className={`cta ${state}`} disabled={state !== "idle"} type="submit">
      {state === "loading" ? <i className="spin" aria-label="Loading" /> : state === "done" ? <><Check />{done}</> : label}
    </button>
  );
}

function Social({ onClick, busy }) {
  return (
    <>
      <div className="or rise" style={{ "--i": 8 }}><span>OR</span></div>
      <button type="button" className="g rise" style={{ "--i": 9 }} onClick={onClick} disabled={busy} aria-label="Continue with Google"><Google /></button>
    </>
  );
}

function useSubmit(form, call, onSuccess) {
  const [state, setState] = useState("idle");
  const [shake, setShake] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!form.validate()) { setShake(true); setTimeout(() => setShake(false), 450); return; }
    setState("loading");
    try { await call(form.vals); setState("done"); onSuccess?.(form.vals); setTimeout(() => setState("idle"), 2600); }
    catch { setState("idle"); }
  };
  return { state, shake, submit };
}

/* ============ Forms ============ */
function LoginForm({ api, go, onSuccess }) {
  const f = useForm(LOGIN_RULES);
  const [remember, setRemember] = useState(false);
  const [gBusy, setG] = useState(false);
  const s = useSubmit(f, (v) => api.login({ ...v, remember }), onSuccess);
  
  return (
    <>
      <form onSubmit={s.submit} noValidate className={s.shake ? "shake" : ""}>
        <Field label="Phone number or email" placeholder="Enter your phone or email" autoComplete="username" i={2} {...f.bind("id")} />
        <Field label="Password" type="password" placeholder="Enter your password" autoComplete="current-password" i={3} {...f.bind("password")} />
        <div className="row rise" style={{ "--i": 4 }}>
          <label className="chk">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <span className="box"><Check s={12} /></span>Remember me
          </label>
          <button type="button" onClick={() => go("forgot")} className="link">Forgot Password?</button>
        </div>
        <div className="rise" style={{ "--i": 5 }}><Submit state={s.state} label="Login" done="Welcome back!" /></div>
      </form>
      <Social busy={gBusy} onClick={async () => { setG(true); await api.google(); setG(false); onSuccess?.({ google: true }); }} />
      <p className="switch rise" style={{ "--i": 10 }}>New to Merkato Gebeya? <button type="button" onClick={() => go("register")}>Create Account</button></p>
    </>
  );
}

function RegisterForm({ api, go, onSuccess }) {
  const f = useForm(REG_RULES);
  const [gBusy, setG] = useState(false);
  const s = useSubmit(f, api.register, onSuccess);
  const lvl = strength(f.vals.password);
  const [label, color] = LEVELS[lvl];
  
  return (
    <>
      <form onSubmit={s.submit} noValidate className={s.shake ? "shake" : ""}>
        <div className="grid2">
          <Field label="Full name" placeholder="Enter your full name" autoComplete="name" i={2} {...f.bind("name")} />
          <Field label="Phone number" type="tel" placeholder="+251 9XX XXX XXX" autoComplete="tel" i={3} {...f.bind("phone")} />
          <Field label="Password" type="password" placeholder="Create a strong password" autoComplete="new-password" i={4} {...f.bind("password")}>
            {f.vals.password && (
              <div className="meter" style={{ "--c": color }} aria-live="polite">
                {[1, 2, 3, 4].map((n) => <i key={n} className={n <= lvl ? "on" : ""} />)}<em>{label}</em>
              </div>
            )}
          </Field>
          <Field label="Email address" type="email" placeholder="Enter your email address" autoComplete="email" i={5} {...f.bind("email")} />
        </div>
        <div className="rise" style={{ "--i": 6, marginTop: 34 }}><Submit state={s.state} label="Create Account" done="Account created!" /></div>
      </form>
      <Social busy={gBusy} onClick={async () => { setG(true); await api.google(); setG(false); onSuccess?.({ google: true }); }} />
      <p className="switch rise" style={{ "--i": 10 }}>Already have an account? <button type="button" onClick={() => go("login")}>Login</button></p>
    </>
  );
}

/* ============ NEW: Forgot Password Flow ============ */
function ForgotForm({ api, go, onSuccess }) {
  const f = useForm(FORGOT_RULES);
  const s = useSubmit(f, (v) => api.forgot(v), onSuccess);

  return (
    <>
      <form onSubmit={s.submit} noValidate className={s.shake ? "shake" : ""}>
        <Field label="Phone number or email" placeholder="Enter your registered phone or email" autoComplete="username" i={2} {...f.bind("contact")} />
        
        <div className="row rise" style={{ "--i": 4, justifyContent: "center" }}>
            <button type="button" onClick={() => go("login")} className="link" style={{ color: "#555" }}>Back to Login</button>
        </div>

        <div className="rise" style={{ "--i": 5 }}><Submit state={s.state} label="Send Verification Code" done="Code Sent!" /></div>
      </form>
      <Social busy={false} onClick={async () => { await api.google(); onSuccess?.({ google: true }); }} />
      <p className="switch rise" style={{ "--i": 10 }}>New to Merkato Gebeya? <button type="button" onClick={() => go("register")}>Create Account</button></p>
    </>
  );
}

/* ============ NEW: OTP Verification Flow ============ */
function VerifyForm({ api, go, onSuccess, contactInfo }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [state, setState] = useState("idle");
  const [shake, setShake] = useState(false);
  const refs = useRef([]);

  const handleChange = (index, e) => {
    const val = e.target.value;
    if (isNaN(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);
    if (val && index < 5) refs.current[index + 1].focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      refs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pasted.some(isNaN)) return;
    const newOtp = [...otp];
    pasted.forEach((char, i) => { if (i < 6) newOtp[i] = char; });
    setOtp(newOtp);
    refs.current[Math.min(pasted.length, 5)].focus();
  };

  const isComplete = otp.every((d) => d !== "");

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!isComplete) { setShake(true); setTimeout(() => setShake(false), 450); return; }
    setState("loading");
    try {
        await api.verify(otp.join(""));
        setState("done");
        onSuccess?.();
        setTimeout(() => go("login"), 2600); // Go back to login after success
    } catch {
        setState("idle");
    }
  };

  return (
    <>
      <form onSubmit={handleVerify} noValidate className={shake ? "shake" : ""}>
        <div className="rise" style={{ "--i": 2, textAlign: "center", marginBottom: 24, fontSize: 14, color: "#666" }}>
            Enter the code sent to {contactInfo ? <strong>{contactInfo}</strong> : "your email"}
        </div>
        
        {/* OTP Boxes */}
        <div className="otp-group rise" style={{ "--i": 3 }}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (refs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              className={`otp-input ${digit ? "filled" : ""}`}
            />
          ))}
        </div>

        <div className="row rise" style={{ "--i": 4, justifyContent: "center", marginTop: 10 }}>
            <span style={{ fontSize: 13, color: "#666" }}>Didn't receive a code? <button type="button" className="link">Resend code</button></span>
        </div>

        <div className="rise" style={{ "--i": 5, marginTop: 14 }}>
            <Submit state={state} label="Verify Code" done="Verified!" />
        </div>

        <div className="row rise" style={{ "--i": 6, justifyContent: "center", marginTop: 20 }}>
            <span style={{ fontSize: 13, color: "#666" }}>Wrong contact? <button type="button" onClick={() => go("forgot")} className="link">Edit details</button></span>
        </div>
      </form>
    </>
  );
}

/* ============ Page Layout ============ */
const Arcs = ({ cls }) => (
  <svg className={`arcs ${cls}`} viewBox="0 0 300 300" aria-hidden="true">
    <defs><filter id={"s" + cls}><feGaussianBlur stdDeviation="1.8" /></filter></defs>
    {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx="150" cy="150" r={64 + i * 13} fill="none" stroke="#fff" strokeOpacity={0.55 - i * 0.08} strokeWidth="9" filter={`url(#s${cls})`} />)}
  </svg>
);

export default function MerkatoAuth({ initial = "login", api = defaultApi, onSuccess }) {
  const [mode, setMode] = useState(initial);
  const [contactInfo, setContactInfo] = useState("");
  
  const c = COPY[mode];
  
  // Select which form to render
  const renderForm = () => {
    switch (mode) {
      case "login": return <LoginForm api={api} go={setMode} onSuccess={onSuccess} />;
      case "register": return <RegisterForm api={api} go={setMode} onSuccess={onSuccess} />;
      case "forgot": return <ForgotForm api={api} go={setMode} onSuccess={(vals) => { setContactInfo(vals.contact); setMode("verify"); }} />;
      case "verify": return <VerifyForm api={api} go={setMode} onSuccess={onSuccess} contactInfo={contactInfo} />;
      default: return null;
    }
  };

  return (
    <main className="au">
      <style>{css}</style>
      <section className="pane">
        <div className={`card ${mode === "register" ? "register" : "login"}`} key={mode}>
          <Logo />
          <h1 className="rise" style={{ "--i": 0 }}>{c.title}</h1>
          <p className="sub rise" style={{ "--i": 1 }}>{c.sub}</p>
          {renderForm()}
        </div>
      </section>
      <aside className="side">
        <Arcs cls="a1" /><Arcs cls="a2" />
        <div className="copy" key={mode}>
          <h2>{c.h.map((l, i) => <span className="line" key={l}><span style={{ "--i": i }}>{l}</span></span>)}</h2>
          <p>{TAGLINE}</p>
        </div>
        <a className="terms" href="#terms" onClick={(e) => e.preventDefault()}>Terms and privacy</a>
      </aside>
    </main>
  );
}

/* ============ Styles ============ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Noto+Sans+Ethiopic:wght@700&display=swap');
.au{--o:#FF5208;font-family:'Plus Jakarta Sans',system-ui,sans-serif;display:grid;grid-template-columns:55% 45%;min-height:100vh;background:#fff;color:#111;-webkit-font-smoothing:antialiased}
.au *{box-sizing:border-box;margin:0}
.au button{font:inherit;color:inherit;border:0;background:none;cursor:pointer}
.au :focus-visible{outline:2px solid var(--o);outline-offset:3px}
.pane{display:grid;place-items:center;padding:48px 32px}
.card{width:100%;display:flex;flex-direction:column;align-items:center;text-align:center}
.card.login{max-width:372px}.card.register{max-width:640px}
.card form,.card .field{text-align:left}.card form{width:100%}
.logo{animation:up .6s both,bob 5s ease-in-out .8s infinite}
.card h1{color:var(--o);font-weight:500;font-size:28px;margin-top:18px;letter-spacing:-.01em}
.sub{color:#a3a3a3;font-size:15px;margin:22px 0 34px;line-height: 1.5; max-width: 300px;}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:22px 32px}
.field{margin-bottom:18px}.grid2 .field{margin:0}
.field label{display:block;font-size:13px;margin-bottom:9px}
.inp{position:relative}
.inp input{width:100%;height:48px;border-radius:10px;border:1.5px solid transparent;background:#f4f4f2;padding:0 16px;font:400 14px 'Plus Jakarta Sans',sans-serif;color:#111;outline:0;transition:background .2s,border-color .2s,box-shadow .2s}
.inp input::placeholder{color:#c4c4c4}
.inp input:hover{background:#eeeeeb}
.inp input:focus{background:#fff;border-color:var(--o);box-shadow:0 0 0 4px rgba(255,82,8,.13)}
.inp.bad input{background:#fff6f5;border-color:#d92d20}
.inp.bad input:focus{box-shadow:0 0 0 4px rgba(217,45,32,.12)}
.eye{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:34px;height:34px;border-radius:8px;display:grid;place-items:center;color:#98a2b3;transition:.2s}
.eye:hover{color:var(--o);background:#fff0ea}
.err{color:#d92d20;font-size:12px;margin-top:7px;animation:up .25s}
.meter{display:flex;align-items:center;gap:6px;margin-top:10px}
.meter i{flex:1;height:4px;border-radius:9px;background:#e8e8e5;transition:background .3s}
.meter i.on{background:var(--c)}
.meter em{font-style:normal;font-size:12px;font-weight:600;color:var(--c);min-width:44px;text-align:right}
.row{display:flex;justify-content:space-between;align-items:center;margin:2px 0 24px;font-size:13px}
.chk{display:flex;align-items:center;gap:8px;cursor:pointer;color:#333;font-size:13px;margin:0!important}
.chk input{position:absolute;opacity:0;width:0;height:0}
.box{width:16px;height:16px;border-radius:4px;background:#f4f4f2;border:1.5px solid #d4d4d0;display:grid;place-items:center;transition:.2s}
.box svg{opacity:0;transform:scale(.5);transition:.2s}
.chk input:checked+.box{background:var(--o);border-color:var(--o)}
.chk input:checked+.box svg{opacity:1;transform:none}
.chk input:focus-visible+.box{outline:2px solid var(--o);outline-offset:2px}
.link{color:var(--o);font-size:13px;text-decoration:none;font-weight: 500;}.link:hover{text-decoration:underline}
.cta{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;height:48px;border-radius:10px;background:var(--o);color:#fff;font-weight:500;font-size:15px;box-shadow:0 14px 26px -14px rgba(255,82,8,.8);transition:transform .2s,background .25s,box-shadow .2s}
.cta:hover:not(:disabled){transform:translateY(-2px);background:#e84a05;box-shadow:0 18px 30px -14px rgba(255,82,8,.9)}
.cta:active:not(:disabled){transform:none}
.cta:disabled{cursor:default}
.cta.done{background:#12b76a;box-shadow:0 14px 26px -14px rgba(18,183,106,.8)}
.card.register .cta{width:min(295px,100%);margin:0 auto}
.spin{width:20px;height:20px;border:2.5px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:rot .7s linear infinite}
.or{display:flex;align-items:center;gap:16px;width:100%;max-width:364px;margin:26px auto 20px;color:#b5b5b5;font-weight:700;font-size:15px}
.or::before,.or::after{content:"";flex:1;height:1px;background:#d6d6d6}
.g{width:50px;height:50px;border-radius:50%;display:grid;place-items:center;border:1px solid #ececea;background:#fff;transition:.25s}
.g:hover:not(:disabled){transform:translateY(-3px);box-shadow:0 14px 26px -12px rgba(16,24,40,.35)}
.g:disabled{opacity:.6;cursor:default}
.switch{margin-top:28px;font-size:15px}
.switch button{color:var(--o);font-weight:600;font-size:15px}.switch button:hover{text-decoration:underline}
.rise{animation:up .65s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i,0)*70ms + 60ms)}
.shake{animation:shake .45s}

/* NEW: OTP Layout */
.otp-group{display:flex;justify-content:center;gap:12px;margin:10px 0 20px;}
.otp-input{width:52px;height:56px;border-radius:12px;background:#f4f4f2;border:1.5px solid transparent;text-align:center;font-size:20px;font-weight:600;color:#111;outline:0;transition:all .2s;}
.otp-input:focus{background:#fff;border-color:var(--o);box-shadow:0 0 0 4px rgba(255,82,8,.13)}
.otp-input.filled{background:#fff;border-color:var(--o);color:var(--o)}

.side{position:relative;background:var(--o);color:#fff;overflow:hidden;display:flex;flex-direction:column;padding:max(150px,24vh) clamp(32px,5vw,64px) 0}
.copy{position:relative;z-index:2}
.side h2{font-weight:300;font-size:clamp(30px,3.4vw,44px);line-height:1.2;letter-spacing:-.01em}
.line{display:block;overflow:hidden;padding-bottom:.08em}
.line>span{display:block;animation:lift .85s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i)*110ms)}
.side p{margin-top:24px;max-width:400px;font-size:15px;line-height:1.5;animation:up .8s .4s both}
.terms{position:absolute;z-index:2;bottom:80px;left:50%;transform:translateX(-50%);color:#fff;font-size:15px;text-decoration:underline;text-underline-offset:3px;opacity:.9;transition:.2s}
.terms:hover{opacity:1;letter-spacing:.02em}
.arcs{position:absolute;pointer-events:none}
.a1{width:340px;top:-90px;right:-175px;animation:drift 14s ease-in-out infinite alternate}
.a2{width:380px;left:-200px;bottom:-140px;animation:drift 18s ease-in-out infinite alternate-reverse}

@keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes lift{from{transform:translateY(105%)}to{transform:none}}
@keyframes bob{50%{transform:translateY(-6px)}}
@keyframes rot{to{transform:rotate(360deg)}}
@keyframes drift{from{transform:rotate(0) scale(1)}to{transform:rotate(14deg) scale(1.06)}}
@keyframes shake{20%,60%{transform:translateX(-7px)}40%,80%{transform:translateX(7px)}}

@media (max-width:860px){
  .au{grid-template-columns:1fr}
  .side{order:-1;padding:36px 24px 56px}
  .terms{position:static;transform:none;margin-top:24px}
  .a1{width:240px;top:-70px;right:-120px}.a2{display:none}
  .pane{padding:36px 20px 56px}
}
@media (max-width:620px){.grid2{grid-template-columns:1fr}.grid2 .field{margin-bottom:0}}
@media (prefers-reduced-motion:reduce){.au *{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
`;