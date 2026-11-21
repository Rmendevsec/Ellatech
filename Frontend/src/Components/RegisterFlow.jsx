import React, { useState } from "react";
import { Field, FileUpload, Submit, Social } from "./AuthUI";
import { RULES, LEVELS, strength } from "./validators";
import api from "../api/axios";

export function RegisterFlow({ go, onRegister }) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("CUSTOMER");
  const [state, setState] = useState("idle");
  const [apiErr, setApiErr] = useState("");

  const [vals, setVals] = useState({
    name: "", phone: "", email: "", password: "",
    nationalId: "", emergencyName: "", emergencyPhone: "", emergencyAddress: "",
    vehicleType: "MOTORCYCLE", plateNumber: "", make: "", model: "", year: "",
    storeName: "", tinNumber: "", storeAddress: "",
  });
  const [files, setFiles] = useState({ nationalIdImage: null, drivingLicenseImage: null, tradeLicenseImage: null });
  const [errs, setErrs] = useState({});

  const setV = (k, v) => setVals(s => ({ ...s, [k]: v }));
  const setF = (k, v) => setFiles(s => ({ ...s, [k]: v }));
  const lvl = strength(vals.password);
  const [pLabel, pColor] = LEVELS[lvl];

  /* ---------- Step 1: Account Basics ---------- */
  const step1Validate = () => {
    const e = {
      name: RULES.name(vals.name),
      phone: RULES.phone(vals.phone),
      email: RULES.email(vals.email),
      password: RULES.password(vals.password),
    };
    setErrs(e);
    return !Object.values(e).some(Boolean);
  };

  const goStep2 = (e) => {
    e.preventDefault();
    if (!step1Validate()) return;
    setStep(2);
  };

  /* ---------- Step 2: KYC Documents ---------- */
  const step2Validate = () => {
    const e = {
      nationalId: RULES.nationalId(vals.nationalId),
      emergencyName: RULES.emergencyName(vals.emergencyName),
      emergencyPhone: RULES.emergencyPhone(vals.emergencyPhone),
      emergencyAddress: RULES.emergencyAddress(vals.emergencyAddress),
      nationalIdImage: !files.nationalIdImage ? "Upload your National ID image" : "",
    };
    if (role === "DRIVER") e.drivingLicenseImage = !files.drivingLicenseImage ? "Upload your driving license" : "";
    if (role === "MERCHANT") e.tradeLicenseImage = !files.tradeLicenseImage ? "Upload your trade license" : "";
    setErrs(e);
    return !Object.values(e).some(Boolean);
  };

  const goStep3OrFinish = async (e) => {
    e.preventDefault();
    if (!step2Validate()) return;
    if (role === "CUSTOMER") return submitAll();
    setStep(3);
  };

  /* ---------- Step 3: Role specifics ---------- */
  const step3Validate = () => {
    const e = {};
    if (role === "DRIVER") {
      e.plateNumber = RULES.plateNumber(vals.plateNumber);
      e.make = RULES.make(vals.make);
      e.model = RULES.model(vals.model);
      e.year = RULES.year(vals.year);
    }
    if (role === "MERCHANT") {
      e.storeName = RULES.storeName(vals.storeName);
      e.tinNumber = RULES.tinNumber(vals.tinNumber);
      e.storeAddress = RULES.storeAddress(vals.storeAddress);
    }
    setErrs(e);
    return !Object.values(e).some(Boolean);
  };

  const finish = (e) => {
    e.preventDefault();
    if (!step3Validate()) return;
    submitAll();
  };

  /* ---------- The real submit ---------- */
  const submitAll = async () => {
    setApiErr("");
    setState("loading");
    try {
      const rolePath = role === "CUSTOMER" ? "" : `/${role.toLowerCase()}`;
      const res = await api.post(`/auth/register${rolePath}`, {
        phone: vals.phone, email: vals.email, password: vals.password, name: vals.name,
      });
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      const fd = new FormData();
      fd.append("fullName", vals.name);
      fd.append("nationalIdNumber", vals.nationalId);
      fd.append("emergencyContactName", vals.emergencyName);
      fd.append("emergencyContactPhone", vals.emergencyPhone);
      fd.append("emergencyContactAddress", vals.emergencyAddress);
      if (files.nationalIdImage) fd.append("nationalIdImage", files.nationalIdImage);
      if (files.drivingLicenseImage) fd.append("drivingLicenseImage", files.drivingLicenseImage);
      if (files.tradeLicenseImage) fd.append("tradeLicenseImage", files.tradeLicenseImage);
      await api.post("/kyc/submit", fd, { headers: { "Content-Type": "multipart/form-data" } });

      if (role === "DRIVER") {
        await api.post("/vehicles/add", {
          type: vals.vehicleType, plateNumber: vals.plateNumber, make: vals.make,
          model: vals.model, year: parseInt(vals.year, 10),
        });
      }

      setState("done");
      setTimeout(() => onRegister(res.data.user), 900);
    } catch (err) {
      setState("idle");
      setApiErr(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <>
      {/* Wizard progress dots */}
      <div className="wizard-dots rise" style={{ "--i": 0 }}>
        {[1, 2, 3].filter(n => n <= (role === "CUSTOMER" ? 2 : 3)).map(n => (
          <span key={n} className={step === n ? "on" : step > n ? "done" : ""} />
        ))}
      </div>

      {/* === STEP 1 === */}
      {step === 1 && (
        <form onSubmit={goStep2} noValidate>
          <div className="field rise">
            <label>I am a</label>
            <div className="role-select">
              {["CUSTOMER", "DRIVER", "MERCHANT"].map(r => (
                <button key={r} type="button" onClick={() => setRole(r)} className={`role-btn ${role === r ? "on" : ""}`}>
                  {r === "CUSTOMER" ? "🛍 Buyer" : r === "DRIVER" ? "🚗 Driver" : "🏪 Seller"}
                </button>
              ))}
            </div>
          </div>
          <div className="grid2">
            <Field label="Full name" placeholder="Enter your full name" i={2} value={vals.name}
              onChange={(v) => setV("name", v)} onBlur={() => setErrs({ ...errs, name: RULES.name(vals.name) })} error={errs.name} />
            <Field label="Phone number" placeholder="+251 9XX XXX XXX" i={3} value={vals.phone}
              onChange={(v) => setV("phone", v)} onBlur={() => setErrs({ ...errs, phone: RULES.phone(vals.phone) })} error={errs.phone} />
            <Field label="Password" type="password" placeholder="Create password" i={4} value={vals.password}
              onChange={(v) => setV("password", v)} onBlur={() => setErrs({ ...errs, password: RULES.password(vals.password) })} error={errs.password}>
              {vals.password && (
                <div className="meter" style={{ "--c": pColor }}>
                  {[1, 2, 3, 4].map(n => <i key={n} className={n <= lvl ? "on" : ""} />)}<em>{pLabel}</em>
                </div>
              )}
            </Field>
            <Field label="Email address" type="email" placeholder="you@example.com" i={5} value={vals.email}
              onChange={(v) => setV("email", v)} onBlur={() => setErrs({ ...errs, email: RULES.email(vals.email) })} error={errs.email} />
          </div>
          <div className="rise" style={{ "--i": 6, marginTop: 34 }}>
            <Submit state="idle" label="Continue to KYC" />
          </div>
        </form>
      )}

      {/* === STEP 2 === */}
      {step === 2 && (
        <form onSubmit={goStep3OrFinish} noValidate>
          <Field label="National ID number" placeholder="Enter your ID number" i={1} value={vals.nationalId}
            onChange={(v) => setV("nationalId", v)} onBlur={() => setErrs({ ...errs, nationalId: RULES.nationalId(vals.nationalId) })} error={errs.nationalId} />
          <FileUpload label="National ID image" id="natId" i={2}
            file={files.nationalIdImage} onChange={(f) => { setF("nationalIdImage", f); setErrs({ ...errs, nationalIdImage: f ? "" : "Upload your National ID image" }); }}
            error={errs.nationalIdImage} />
          {role === "DRIVER" && (
            <FileUpload label="Driving license" id="dl" i={3}
              file={files.drivingLicenseImage} onChange={(f) => { setF("drivingLicenseImage", f); setErrs({ ...errs, drivingLicenseImage: f ? "" : "Upload your driving license" }); }}
              error={errs.drivingLicenseImage} />
          )}
          {role === "MERCHANT" && (
            <FileUpload label="Trade license" id="tl" i={3}
              file={files.tradeLicenseImage} onChange={(f) => { setF("tradeLicenseImage", f); setErrs({ ...errs, tradeLicenseImage: f ? "" : "Upload your trade license" }); }}
              error={errs.tradeLicenseImage} />
          )}
          <div className="grid2" style={{ marginTop: 8 }}>
            <Field label="Emergency name" placeholder="Contact name" i={4} value={vals.emergencyName}
              onChange={(v) => setV("emergencyName", v)} onBlur={() => setErrs({ ...errs, emergencyName: RULES.emergencyName(vals.emergencyName) })} error={errs.emergencyName} />
            <Field label="Emergency phone" placeholder="+251..." i={5} value={vals.emergencyPhone}
              onChange={(v) => setV("emergencyPhone", v)} onBlur={() => setErrs({ ...errs, emergencyPhone: RULES.emergencyPhone(vals.emergencyPhone) })} error={errs.emergencyPhone} />
          </div>
          <Field label="Emergency address" placeholder="Address" i={6} value={vals.emergencyAddress}
            onChange={(v) => setV("emergencyAddress", v)} onBlur={() => setErrs({ ...errs, emergencyAddress: RULES.emergencyAddress(vals.emergencyAddress) })} error={errs.emergencyAddress} />

          {apiErr && <p className="err form-err">{apiErr}</p>}
          <div className="rise" style={{ "--i": 7, marginTop: 34 }}>
            <Submit state={state} label={role === "CUSTOMER" ? "Create Account" : "Next: Details"} done="Done!" />
          </div>
        </form>
      )}

      {/* === STEP 3 === */}
      {step === 3 && (
        <form onSubmit={finish} noValidate>
          {role === "DRIVER" && (
            <>
              <div className="field rise">
                <label>Vehicle type</label>
                <select value={vals.vehicleType} onChange={(e) => setV("vehicleType", e.target.value)} className="inp" style={{ width: '100%', height: '48px', borderRadius: '10px', padding: '0 16px', background: '#f4f4f2', border: 'none' }}>
                  <option value="BICYCLE">Bicycle</option>
                  <option value="MOTORCYCLE">Motorcycle</option>
                  <option value="CAR">Car</option>
                  <option value="TRUCK">Truck</option>
                </select>
              </div>
              <div className="grid2">
                <Field label="Plate number" placeholder="AA-12345" i={2} value={vals.plateNumber}
                  onChange={(v) => setV("plateNumber", v)} onBlur={() => setErrs({ ...errs, plateNumber: RULES.plateNumber(vals.plateNumber) })} error={errs.plateNumber} />
                <Field label="Make" placeholder="Toyota" i={3} value={vals.make}
                  onChange={(v) => setV("make", v)} onBlur={() => setErrs({ ...errs, make: RULES.make(vals.make) })} error={errs.make} />
                <Field label="Model" placeholder="Corolla" i={4} value={vals.model}
                  onChange={(v) => setV("model", v)} onBlur={() => setErrs({ ...errs, model: RULES.model(vals.model) })} error={errs.model} />
                <Field label="Year" placeholder="2020" i={5} value={vals.year}
                  onChange={(v) => setV("year", v)} onBlur={() => setErrs({ ...errs, year: RULES.year(vals.year) })} error={errs.year} />
              </div>
            </>
          )}
          {role === "MERCHANT" && (
            <>
              <Field label="Store name" placeholder="My Store" i={1} value={vals.storeName}
                onChange={(v) => setV("storeName", v)} onBlur={() => setErrs({ ...errs, storeName: RULES.storeName(vals.storeName) })} error={errs.storeName} />
              <Field label="TIN number" placeholder="1234567890" i={2} value={vals.tinNumber}
                onChange={(v) => setV("tinNumber", v)} onBlur={() => setErrs({ ...errs, tinNumber: RULES.tinNumber(vals.tinNumber) })} error={errs.tinNumber} />
              <Field label="Store address" placeholder="Bole, Addis Ababa" i={3} value={vals.storeAddress}
                onChange={(v) => setV("storeAddress", v)} onBlur={() => setErrs({ ...errs, storeAddress: RULES.storeAddress(vals.storeAddress) })} error={errs.storeAddress} />
            </>
          )}
          {apiErr && <p className="err form-err">{apiErr}</p>}
          <div className="rise" style={{ "--i": 7, marginTop: 34 }}>
            <Submit state={state} label="Finish Registration" done="Welcome!" />
          </div>
        </form>
      )}

      <Social busy={false} onClick={() => {}} />
      <p className="switch rise" style={{ "--i": 10 }}>Already have an account? <button type="button" onClick={() => go("login")}>Login</button></p>
    </>
  );
}