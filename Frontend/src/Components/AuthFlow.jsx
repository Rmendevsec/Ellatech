import React, { useState } from "react";
import { Logo } from "./AuthUI";
import { LoginForm, ForgotForm, VerifyForm } from "./LoginFlow";
import { RegisterForm } from "./RegisterFlow";

const COPY = {
  login: { title: "Welcome back", sub: "Login to continue your shopping journey", h: ["Back to your account", "and make your life", "simple again"] },
  register: { title: "Create your account", sub: "create an account before enjoying the experience", h: ["Simplify your", "shopping experience", "with us"] },
  forgot: { title: "Forgot your password?", sub: "Enter the phone number or email linked to your account.", h: ["Don't worry if you", "forgot your password"] },
  verify: { title: "Verify your account", sub: "Enter the 6-digit code we sent to your e-mail", h: ["Verify Your identity to", "secure your account"] },
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
  const [contactInfo, setContactInfo] = useState("");
  
  const c = COPY[mode] || COPY.login;

  const renderForm = () => {
    switch (mode) {
      case "login": return <LoginForm go={setMode} onSuccess={() => alert("Logged in! Next: Dashboard")} />;
      case "register": return <RegisterForm go={setMode} onSuccess={() => alert("Registered! Next: Dashboard")} />;
      case "forgot": return <ForgotForm go={setMode} onSuccess={(v) => { setContactInfo(v); setMode("verify"); }} />;
      case "verify": return <VerifyForm go={setMode} onSuccess={() => alert("Code Verified! Next: Reset Password")} contactInfo={contactInfo} />;
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

/* =========================================
   YOUR EXACT ORIGINAL CSS (100% UNTOUCHED)
   ========================================= */
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
.chk input:checked+.box{background:var(--o);border-color:var(--o)}
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
.g{width:50px;height:50px;border-radius:50%;display:grid;place-items:center;border:1px solid #ececea;background:#fff;transition:.25s; margin: 0 auto;}
.g:hover:not(:disabled){transform:translateY(-3px);box-shadow:0 14px 26px -12px rgba(16,24,40,.35)}
.g:disabled{opacity:.6;cursor:default}
.switch{margin-top:28px;font-size:15px}
.switch button{color:var(--o);font-weight:600;font-size:15px}.switch button:hover{text-decoration:underline}
.rise{animation:up .65s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i,0)*70ms + 60ms)}
.shake{animation:shake .45s}

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