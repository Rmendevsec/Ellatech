import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "./AuthUI";
import { LoginForm, ForgotForm, OtpForm, ResetForm } from "./LoginFlow";
import { RegisterFlow } from "./RegisterFlow";

const COPY = {
  login: { title: "Welcome back", sub: "Login to continue your shopping journey", h: ["Back to your account", "and make your life", "simple again"] },
  register: { title: "Create your account", sub: "create an account before enjoying the experience", h: ["Simplify your", "shopping experience", "with us"] },
  forgot: { title: "Forgot your password?", sub: "Enter the phone number or email linked to your account.", h: ["Don't worry if you", "forgot your password"] },
  otp: { title: "Verify your account", sub: "Enter the 6-digit code we sent you", h: ["Verify Your identity to", "secure your account"] },
  reset: { title: "Create a new password", sub: "Use at least 8 characters with letters, numbers and symbols.", h: ["Secure your account", "by making a complex", "password"] },
  success: { title: "Password reset success", sub: "Your password has been changed. You can log in now.", h: ["Everything is set up!", "You can now log in", "securely."] },
};
const TAGLINE = "Shop simply and get ready to the future and make your life easy";

const Arcs = ({ cls }) => (
  <svg className={`arcs ${cls}`} viewBox="0 0 300 300" aria-hidden="true">
    <defs><filter id={"s" + cls}><feGaussianBlur stdDeviation="1.8" /></filter></defs>
    {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx="150" cy="150" r={64 + i * 13} fill="none" stroke="#fff" strokeOpacity={0.55 - i * 0.08} strokeWidth="9" filter={`url(#s${cls})`} />)}
  </svg>
);

export default function AuthFlow() {
  const [mode, setMode] = useState("login");
  const [contact, setContact] = useState("");
  const navigate = useNavigate();
  const c = COPY[mode] || COPY.login;

  const handleRegister = (user) => {
    navigate(user.role === "DRIVER" ? "/driver" : user.role === "MERCHANT" ? "/merchant" : "/shop");
  };

  const renderForm = () => {
    switch (mode) {
      case "login": return <LoginForm go={setMode} onLogin={(u) => handleRegister(u)} />;
      case "register": return <RegisterFlow go={setMode} onRegister={handleRegister} />;
      case "forgot": return <ForgotForm go={setMode} onNext={(c) => { setContact(c); setMode("otp"); }} />;
      case "otp": return <OtpForm contact={contact} back={() => setMode("forgot")} onVerified={() => setMode("reset")} />;
      case "reset": return <ResetForm go={setMode} onReset={() => setMode("success")} />;
      case "success": return (
        <>
          <div className="okc rise"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M5 12l5 5 9-10"/></svg></div>
          <p className="sub rise">{c.sub}</p>
          <button className="cta rise" onClick={() => setMode("login")}>Continue to Login</button>
        </>
      );
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
          {mode !== "success" && <p className="sub rise" style={{ "--i": 1 }}>{c.sub}</p>}
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

/* ===========================================================
   YOUR EXACT CSS + ADDITIONS (for wizard dots + file upload)
   =========================================================== */
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
.sub{color:#a3a3a3;font-size:15px;margin:22px 0 34px;line-height:1.5;max-width:340px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:22px 32px}
.field{margin-bottom:18px}.grid2 .field{margin:0}
.field label{display:block;font-size:13px;margin-bottom:9px}
.inp{position:relative}
.inp input{width:100%;height:48px;border-radius:10px;border:1.5px solid transparent;background:#f4f4f2;padding:0 16px;font:400 14px 'Plus Jakarta Sans',sans-serif;color:#111;outline:0;transition:background .2s,border-color .2s,box-shadow .2s}
.inp input::placeholder{color:#c4c4c4}
.inp input:hover{background:#eeeeeb}
.inp input:focus{background:#fff;border-color:var(--o);box-shadow:0 0 0 4px rgba(255,82,8,.13)}
.inp.bad input{background:#fff6f5;border-color:#d92d20}
.eye{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:34px;height:34px;border-radius:8px;display:grid;place-items:center;color:#98a2b3;transition:.2s}
.eye:hover{color:var(--o);background:#fff0ea}
.err{color:#d92d20;font-size:12px;margin-top:7px;animation:up .25s}
.form-err{margin:0 0 12px;text-align:center}
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
.link{color:var(--o);font-size:13px;text-decoration:none;font-weight:500}
.link:hover{text-decoration:underline}
.cta{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;height:48px;border-radius:10px;background:var(--o);color:#fff;font-weight:500;font-size:15px;box-shadow:0 14px 26px -14px rgba(255,82,8,.8);transition:transform .2s,background .25s,box-shadow .2s}
.cta:hover:not(:disabled){transform:translateY(-2px);background:#e84a05}
.cta:active:not(:disabled){transform:none}
.cta:disabled{cursor:not-allowed}
.cta:disabled:not(.loading):not(.done){background:#f4a88e;box-shadow:none;opacity:.85}
.cta.done{background:#12b76a}
.card.register .cta{width:min(295px,100%);margin:0 auto}
.spin{width:20px;height:20px;border:2.5px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:rot .7s linear infinite}
.or{display:flex;align-items:center;gap:16px;width:100%;max-width:364px;margin:26px auto 20px;color:#b5b5b5;font-weight:700;font-size:15px}
.or::before,.or::after{content:"";flex:1;height:1px;background:#d6d6d6}
.g{width:50px;height:50px;border-radius:50%;display:grid;place-items:center;border:1px solid #ececea;background:#fff;transition:.25s;margin:0 auto}
.g:hover:not(:disabled){transform:translateY(-3px);box-shadow:0 14px 26px -12px rgba(16,24,40,.35)}
.switch{margin-top:28px;font-size:15px}
.switch button{color:var(--o);font-weight:600;font-size:15px}.switch button:hover{text-decoration:underline}
.switch.small{font-size:13px;color:#333;margin-top:26px}.switch.small button{font-size:13px}
.rise{animation:up .65s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i,0)*70ms + 60ms)}
.shake{animation:shake .45s}
.back{text-align:center;margin:-4px 0 32px}.back button{font-size:13px;color:#333;transition:.2s}.back button:hover{color:var(--o)}
.otp{display:flex;justify-content:center;gap:10px}
.otp input{width:56px;height:48px;border-radius:10px;border:1.5px solid var(--o);background:#fff;text-align:center;font:600 20px 'Plus Jakarta Sans',sans-serif;color:#111;outline:0;caret-color:var(--o);transition:.2s}
.otp input:focus{box-shadow:0 0 0 4px rgba(255,82,8,.15);transform:translateY(-2px)}
.otp input.fill{background:#fff4ee}
.otp input.bad{border-color:#d92d20;background:#fff6f5}
.otp-err{text-align:center;margin-top:14px}
.resend{text-align:center;font-size:13px;color:#333;margin:34px 0 26px}
.resend button{color:var(--o);font-size:13px}.resend span{color:#a3a3a3}
.okc{width:72px;height:72px;border-radius:50%;background:#12b76a;display:grid;place-items:center;margin-bottom:12px}

/* ⭐ NEW: Wizard dots */
.wizard-dots{display:flex;justify-content:center;gap:8px;margin-bottom:24px}
.wizard-dots span{width:32px;height:4px;border-radius:9px;background:#e8e8e5;transition:.3s}
.wizard-dots span.on{background:var(--o);width:48px}
.wizard-dots span.done{background:#12b76a}

/* ⭐ NEW: Role selector */
.role-select{display:flex;gap:10px;margin-top:9px}
.role-btn{flex:1;height:48px;border-radius:10px;border:1.5px solid #e8e8e5;background:#f9f9f7;font-weight:600;font-size:13px;color:#555;transition:.2s}
.role-btn:hover{border-color:var(--o);background:#fff4ee}
.role-btn.on{border-color:var(--o);background:#fff;color:var(--o);box-shadow:0 0 0 4px rgba(255,82,8,.13)}

/* ⭐ NEW: Beautiful file upload */
.file-drop{display:flex;align-items:center;justify-content:center;min-height:100px;padding:16px;border-radius:12px;border:2px dashed #d4d4d0;background:#f9f9f7;cursor:pointer;transition:.2s;margin-top:9px;width:100%}
.file-drop:hover{border-color:var(--o);background:#fff4ee}
.file-drop.bad{border-color:#d92d20;background:#fff6f5}
.file-drop.has-file{border-style:solid;border-color:var(--o);background:#fff}
.file-empty{display:flex;flex-direction:column;align-items:center;gap:6px;color:#98a2b3;font-size:13px;font-weight:500}
.file-empty small{color:#b5b5b5;font-size:11px;font-weight:400}
.file-preview{display:flex;align-items:center;gap:12px;width:100%}
.file-preview img{width:56px;height:56px;border-radius:8px;object-fit:cover;flex-shrink:0}
.file-icon{width:56px;height:56px;border-radius:8px;background:#fff4ee;display:grid;place-items:center;font-size:24px;flex-shrink:0}
.file-meta{display:flex;flex-direction:column;gap:3px;flex:1;min-width:0;text-align:left}
.file-meta b{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#111}
.file-meta small{color:var(--o);font-size:11px;font-weight:600}
.file-check{width:26px;height:26px;border-radius:50%;background:#12b76a;display:grid;place-items:center;flex-shrink:0}

/* Side panel (unchanged) */
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
@media (max-width:420px){.otp{gap:6px}.otp input{width:44px}.role-btn{font-size:11px;padding:0 4px}}
@media (prefers-reduced-motion:reduce){.au *{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
`;