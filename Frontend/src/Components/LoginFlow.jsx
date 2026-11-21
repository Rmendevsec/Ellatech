import React, { useState, useRef } from "react";
import { Field, Submit, Social } from "./AuthUI";

const PHONE = /^(\+?251|0)?9\d{8}$/;
const MAIL = /^\S+@\S+\.\S+$/;
const clean = (v) => v.replace(/[\s-]/g, "");

function useForm(rules) {
  const [vals, setVals] = useState(() => Object.fromEntries(Object.keys(rules).map((k) => [k, ""])));
  const [errs, setErrs] = useState({});
  const set = (k, v) => { setVals((s) => ({ ...s, [k]: v })); if (errs[k]) setErrs((e) => ({ ...e, [k]: rules[k](v) })); };
  const bind = (k) => ({ id: k, value: vals[k], error: errs[k], onChange: (v) => set(k, v) });
  const validate = () => {
    const e = Object.fromEntries(Object.keys(rules).map((k) => [k, rules[k](vals[k])]));
    setErrs(e); return !Object.values(e).some(Boolean);
  };
  return { vals, validate, bind };
}

export function LoginForm({ go, onSuccess }) {
  const rules = {
    id: (v) => (MAIL.test(v.trim()) || PHONE.test(clean(v)) ? "" : "Enter a valid phone or email"),
    password: (v) => (v ? "" : "Enter your password"),
  };
  const f = useForm(rules);
  const [state, setState] = useState("idle");

  const submit = (e) => {
    e.preventDefault();
    if (!f.validate()) return;
    setState("loading");
    setTimeout(() => { setState("done"); onSuccess?.(); setTimeout(() => setState("idle"), 2000); }, 1200);
  };

  return (
    <>
      <form onSubmit={submit}>
        <Field label="Phone number or email" placeholder="Enter your phone or email" i={2} {...f.bind("id")} />
        <Field label="Password" type="password" placeholder="Enter your password" i={3} {...f.bind("password")} />
        <div className="row rise" style={{ "--i": 4 }}>
          <label className="chk"><input type="checkbox" /><span className="box"></span>Remember me</label>
          <button type="button" onClick={() => go("forgot")} className="link">Forgot Password?</button>
        </div>
        <div className="rise" style={{ "--i": 5 }}><Submit state={state} label="Login" done="Welcome back!" /></div>
      </form>
      <Social onClick={() => {}} busy={false} />
      <p className="switch rise" style={{ "--i": 10 }}>New to Merkato Gebeya? <button type="button" onClick={() => go("register")}>Create Account</button></p>
    </>
  );
}

export function ForgotForm({ go, onSuccess }) {
  const f = useForm({ contact: (v) => (MAIL.test(v.trim()) || PHONE.test(clean(v)) ? "" : "Enter valid contact") });
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (f.validate()) onSuccess(f.vals.contact); }}>
      <Field label="Phone number or email" placeholder="Enter your registered contact" i={2} {...f.bind("contact")} />
      <div className="row rise" style={{ "--i": 4, justifyContent: "center" }}>
        <button type="button" onClick={() => go("login")} className="link" style={{ color: "#555" }}>Back to Login</button>
      </div>
      <div className="rise" style={{ "--i": 5 }}><Submit state="idle" label="Send Verification Code" done="Code Sent!" /></div>
    </form>
  );
}

export function VerifyForm({ go, onSuccess, contactInfo }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const refs = useRef([]);
  const handleChange = (i, e) => {
    const v = e.target.value;
    if (isNaN(v)) return;
    const n = [...otp]; n[i] = v.substring(v.length - 1); setOtp(n);
    if (v && i < 5) refs.current[i + 1].focus();
  };
  const handleKeyDown = (i, e) => { if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1].focus(); };
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSuccess(); }}>
      <div className="rise" style={{ textAlign: "center", marginBottom: 24, fontSize: 14, color: "#666" }}>
        Enter code sent to <strong>{contactInfo || "your email"}</strong>
      </div>
      <div className="otp-group rise">
        {otp.map((d, i) => (
          <input key={i} ref={(el) => (refs.current[i] = el)} type="text" maxLength={1} value={d} onChange={(e) => handleChange(i, e)} onKeyDown={(e) => handleKeyDown(i, e)} className={`otp-input ${d ? "filled" : ""}`} />
        ))}
      </div>
      <div className="rise" style={{ marginTop: 14 }}><Submit state="idle" label="Verify Code" done="Verified!" /></div>
      <div className="row rise" style={{ justifyContent: "center", marginTop: 20 }}>
        <span style={{ fontSize: 13, color: "#666" }}>Wrong contact? <button type="button" onClick={() => go("forgot")} className="link">Edit details</button></span>
      </div>
    </form>
  );
}