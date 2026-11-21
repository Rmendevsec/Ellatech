import React, { useState, useRef, useEffect } from "react";
import { Field, Submit, Social, Check } from "./AuthUI";
import { RULES, LEVELS, strength } from "./validators";
import api from "../api/axios";

const PHONE = /^(\+?251|0)?9\d{8}$/;
const MAIL = /^\S+@\S+\.\S+$/;
const clean = (v) => v.replace(/[\s-]/g, "");

export function LoginForm({ go, onLogin }) {
  const [vals, setVals] = useState({ id: "", password: "" });
  const [errs, setErrs] = useState({});
  const [state, setState] = useState("idle");
  const [shake, setShake] = useState(false);
  const [apiErr, setApiErr] = useState("");
  const [remember, setRemember] = useState(false);

  const validate = () => {
    const e = { id: RULES.loginId(vals.id), password: RULES.password(vals.password) };
    setErrs(e); return !Object.values(e).some(Boolean);
  };

  const submit = async (e) => {
    e.preventDefault();
    setApiErr("");
    if (!validate()) { setShake(true); setTimeout(() => setShake(false), 450); return; }
    setState("loading");
    try {
      const res = await api.post("/auth/login", { phone: vals.id, password: vals.password });
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      setState("done");
      setTimeout(() => onLogin(res.data.user), 800);
    } catch (err) {
      setState("idle");
      setApiErr(err.response?.data?.message || "Login failed");
      setShake(true); setTimeout(() => setShake(false), 450);
    }
  };

  return (
    <>
      <form onSubmit={submit} className={shake ? "shake" : ""} noValidate>
        <Field label="Phone number or email" placeholder="Enter your phone or email" i={2}
          value={vals.id} onChange={(v) => setVals(s => ({ ...s, id: v }))} onBlur={() => setErrs({ ...errs, id: RULES.loginId(vals.id) })} error={errs.id} />
        <Field label="Password" type="password" placeholder="Enter your password" i={3}
          value={vals.password} onChange={(v) => setVals(s => ({ ...s, password: v }))} onBlur={() => setErrs({ ...errs, password: RULES.password(vals.password) })} error={errs.password} />
        <div className="row rise" style={{ "--i": 4 }}>
          <label className="chk">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <span className="box"><Check s={12} /></span>Remember me
          </label>
          <button type="button" className="link" onClick={() => go("forgot")}>Forgot Password?</button>
        </div>
        {apiErr && <p className="err form-err" role="alert">{apiErr}</p>}
        <div className="rise" style={{ "--i": 5 }}><Submit state={state} label="Login" done="Welcome back!" /></div>
      </form>
      <Social busy={false} onClick={() => {}} />
      <p className="switch rise" style={{ "--i": 10 }}>New to Merkato Gebeya? <button type="button" onClick={() => go("register")}>Create Account</button></p>
    </>
  );
}

/* -------- Forgot Password -------- */
export function ForgotForm({ go, onNext }) {
  const [contact, setContact] = useState("");
  const [err, setErr] = useState("");
  const [state, setState] = useState("idle");

  const submit = async (e) => {
    e.preventDefault();
    const e1 = RULES.loginId(contact);
    setErr(e1);
    if (e1) return;
    setState("loading");
    // TODO: replace with real API call: await api.post("/auth/forgot", { contact });
    setTimeout(() => {
      setState("done");
      setTimeout(() => onNext(contact), 800);
    }, 1000);
  };

  return (
    <form onSubmit={submit} noValidate>
      <Field label="Phone number or email" placeholder="Enter your registered contact" i={2}
        value={contact} onChange={setContact} onBlur={() => setErr(RULES.loginId(contact))} error={err} />
      <div className="back rise" style={{ "--i": 3 }}>
        <button type="button" onClick={() => go("login")}>Back to Login</button>
      </div>
      <div className="rise" style={{ "--i": 4 }}><Submit state={state} label="Send Verification Code" done="Code sent!" /></div>
      <Social busy={false} onClick={() => {}} />
    </form>
  );
}

/* -------- OTP Verify -------- */
export function OtpForm({ contact, back, onVerified }) {
  const [d, setD] = useState(Array(6).fill(""));
  const [err, setErr] = useState("");
  const [state, setState] = useState("idle");
  const [shake, setShake] = useState(false);
  const [left, setLeft] = useState(30);
  const refs = useRef([]);

  useEffect(() => { refs.current[0]?.focus(); }, []);
  useEffect(() => { if (left <= 0) return; const t = setTimeout(() => setLeft(n => n - 1), 1000); return () => clearTimeout(t); }, [left]);

  const verify = async (code) => {
    if (code.length < 6) return setErr("Enter all 6 digits");
    setState("loading");
    setTimeout(() => {
      if (code === "123456") {
        setState("done");
        setTimeout(() => onVerified(contact), 800);
      } else {
        setState("idle"); setD(Array(6).fill(""));
        setErr("That code is incorrect. Try again.");
        setShake(true); setTimeout(() => setShake(false), 450);
        refs.current[0]?.focus();
      }
    }, 900);
  };

  const put = (i, raw) => {
    const x = raw.replace(/\D/g, "");
    if (!x) return;
    const n = [...d];
    x.slice(0, 6 - i).split("").forEach((c, k) => { n[i + k] = c; });
    setD(n); setErr("");
    refs.current[Math.min(i + x.length, 5)]?.focus();
    if (n.every(Boolean)) verify(n.join(""));
  };

  const key = (i, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const n = [...d];
      if (n[i]) n[i] = ""; else if (i > 0) { n[i - 1] = ""; refs.current[i - 1]?.focus(); }
      setD(n);
    }
  };

  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); verify(d.join("")); }} className={shake ? "shake" : ""} noValidate>
        <div className="otp rise" style={{ "--i": 2 }}>
          {d.map((v, i) => (
            <input key={i} ref={(el) => (refs.current[i] = el)} className={`${v ? "fill" : ""} ${err ? "bad" : ""}`}
              inputMode="numeric" maxLength={6} value={v}
              onChange={(e) => put(i, e.target.value)} onKeyDown={(e) => key(i, e)}
              onPaste={(e) => { e.preventDefault(); put(i, e.clipboardData.getData("text")); }} />
          ))}
        </div>
        {err && <p className="err otp-err" role="alert">{err}</p>}
        <p className="resend rise" style={{ "--i": 3 }}>Didn't receive a code?{" "}
          {left > 0 ? <span>Resend in 0:{String(left).padStart(2, "0")}</span> : <button type="button" onClick={() => { setLeft(30); setD(Array(6).fill("")); setErr(""); }}>Resend code</button>}
        </p>
        <div className="rise" style={{ "--i": 4 }}><Submit state={state} label="Verify Code" done="Verified!" /></div>
      </form>
      <p className="switch small rise" style={{ "--i": 5 }}>Wrong contact? <button type="button" onClick={back}>Edit details</button></p>
    </>
  );
}

/* -------- Reset Password -------- */
export function ResetForm({ go, onReset }) {
  const [pw, setPw] = useState("");
  const [conf, setConf] = useState("");
  const [errs, setErrs] = useState({});
  const [state, setState] = useState("idle");
  const lvl = strength(pw);
  const [label, color] = LEVELS[lvl];

  const submit = async (e) => {
    e.preventDefault();
    const e1 = RULES.password(pw);
    const e2 = pw !== conf ? "Passwords do not match" : "";
    setErrs({ pw: e1, conf: e2 });
    if (e1 || e2) return;
    setState("loading");
    // TODO: replace with real API call: await api.post("/auth/reset", { newPassword: pw });
    setTimeout(() => {
      setState("done");
      setTimeout(() => onReset(), 900);
    }, 1000);
  };

  return (
    <form onSubmit={submit} noValidate>
      <Field label="New password" type="password" placeholder="New password" i={2}
        value={pw} onChange={setPw} onBlur={() => setErrs({ ...errs, pw: RULES.password(pw) })} error={errs.pw}>
        {pw && (
          <div className="meter" style={{ "--c": color }}>
            {[1, 2, 3, 4].map(n => <i key={n} className={n <= lvl ? "on" : ""} />)}<em>{label}</em>
          </div>
        )}
      </Field>
      <Field label="Confirm new password" type="password" placeholder="Confirm new password" i={3}
        value={conf} onChange={setConf} onBlur={() => setErrs({ ...errs, conf: pw !== conf ? "Passwords do not match" : "" })} error={errs.conf} />
      <div className="rise" style={{ "--i": 5, marginTop: 20 }}><Submit state={state} label="Reset Password" done="Password Reset!" /></div>
      <p className="switch rise" style={{ "--i": 10 }}>Remembered it? <button type="button" onClick={() => go("login")}>Login</button></p>
    </form>
  );
}