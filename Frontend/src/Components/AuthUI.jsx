import React, { useState } from "react";

export const Logo = () => (
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

export const Eye = ({ off }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={off ? "M3 3l18 18M10.6 5.1A9.8 9.8 0 0112 5c6 0 10 7 10 7a17 17 0 01-3.2 3.9M6.6 6.6A17 17 0 002 12s4 7 10 7a9.7 9.7 0 004.4-1M9.9 9.9a3 3 0 004.2 4.2" : "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z"} />
  </svg>
);

export const Check = ({ s = 18, c = "#fff" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg>
);

export const Google = () => (
  <svg width="24" height="24" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

export function Field({ label, id, type = "text", value, onChange, onBlur, error, placeholder, i }) {
  const [show, setShow] = useState(false);
  const pw = type === "password";
  return (
    <div className="field rise" style={{ "--i": i }}>
      <label htmlFor={id}>{label}</label>
      <div className={`inp ${error ? "bad" : ""}`}>
        <input id={id} name={id} type={pw && show ? "text" : type} value={value} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)} onBlur={onBlur} />
        {pw && (
          <button type="button" className="eye" onClick={() => setShow(!show)}><Eye off={show} /></button>
        )}
      </div>
      {error && <p className="err" role="alert">{error}</p>}
    </div>
  );
}

export function Submit({ state, label, done }) {
  return (
    <button className={`cta ${state}`} disabled={state !== "idle"} type="submit">
      {state === "loading" ? <i className="spin" /> : state === "done" ? <><Check />{done}</> : label}
    </button>
  );
}

export function Social({ onClick, busy }) {
  return (
    <>
      <div className="or rise" style={{ "--i": 8 }}><span>OR</span></div>
      <button type="button" className="g rise" style={{ "--i": 9 }} onClick={onClick} disabled={busy}><Google /></button>
    </>
  );
}