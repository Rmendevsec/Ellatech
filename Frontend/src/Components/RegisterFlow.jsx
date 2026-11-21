import React, { useState } from "react";
import { Field, Submit, Social } from "./AuthUI";

export function RegisterForm({ go, onSuccess }) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("CUSTOMER");
  
  // State to hold all data
  const [data, setData] = useState({
    name: "", phone: "", email: "", password: "",
    nationalId: "", emergencyName: "", emergencyPhone: "", emergencyAddress: "",
    vehicleType: "MOTORCYCLE", plateNumber: "", make: "", model: "", year: ""
  });
  const [files, setFiles] = useState({ nationalIdImage: null, drivingLicenseImage: null });

  const change = (k, v) => setData(p => ({ ...p, [k]: v }));
  const changeFile = (k, v) => setFiles(p => ({ ...p, [k]: v }));

  const submitStep1 = (e) => { e.preventDefault(); setStep(2); };
  const submitStep2 = (e) => { 
    e.preventDefault(); 
    if (role === "CUSTOMER") onSuccess(); else setStep(3); 
  };
  const submitStep3 = (e) => { e.preventDefault(); onSuccess(); };

  return (
    <>
      {step === 1 && (
        <form onSubmit={submitStep1}>
          {/* Role Selector styled exactly like your inputs */}
          <div className="field rise" style={{ marginBottom: 22 }}>
            <label>I am a:</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '9px' }}>
              {["CUSTOMER", "DRIVER", "MERCHANT"].map(r => (
                <button key={r} type="button" onClick={() => setRole(r)} 
                  className={`inp ${role === r ? 'active' : ''}`}
                  style={{ flex: 1, height: '48px', border: role === r ? '1.5px solid var(--o)' : '1.5px solid transparent', background: role === r ? '#fff' : '#f4f4f2', fontWeight: 600, fontSize: '12px', color: role === r ? 'var(--o)' : '#111' }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid2">
            <Field label="Full name" placeholder="Enter full name" i={2} value={data.name} onChange={(v) => change("name", v)} />
            <Field label="Phone number" placeholder="+251 9XX XXX XXX" i={3} value={data.phone} onChange={(v) => change("phone", v)} />
            <Field label="Password" type="password" placeholder="Create password" i={4} value={data.password} onChange={(v) => change("password", v)} />
            <Field label="Email address" type="email" placeholder="Enter email" i={5} value={data.email} onChange={(v) => change("email", v)} />
          </div>
          <div className="rise" style={{ "--i": 6, marginTop: 34 }}><Submit state="idle" label="Continue to KYC" /></div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={submitStep2}>
          <Field label="National ID Number" placeholder="Enter ID number" i={2} value={data.nationalId} onChange={(v) => change("nationalId", v)} />
          <div className="field rise">
            <label>Upload National ID</label>
            <input type="file" onChange={(e) => changeFile("nationalIdImage", e.target.files[0])} style={{ marginTop: '9px' }} />
          </div>
          
          <div className="grid2">
            <Field label="Emergency Name" placeholder="Contact name" i={3} value={data.emergencyName} onChange={(v) => change("emergencyName", v)} />
            <Field label="Emergency Phone" placeholder="+251..." i={4} value={data.emergencyPhone} onChange={(v) => change("emergencyPhone", v)} />
          </div>
          <Field label="Emergency Address" placeholder="Address" i={5} value={data.emergencyAddress} onChange={(v) => change("emergencyAddress", v)} />

          {role === "DRIVER" && (
            <div className="field rise" style={{ marginTop: 10 }}>
              <label>Upload Driving License</label>
              <input type="file" onChange={(e) => changeFile("drivingLicenseImage", e.target.files[0])} style={{ marginTop: '9px' }} />
            </div>
          )}

          <div className="rise" style={{ "--i": 6, marginTop: 34 }}>
            <Submit state="idle" label={role === "CUSTOMER" ? "Create Account" : "Next: Details"} done="Account created!" />
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={submitStep3}>
          {role === "DRIVER" && (
            <>
              <div className="field rise"><label>Vehicle Type</label>
                <select value={data.vehicleType} onChange={(e) => change("vehicleType", e.target.value)} className="inp" style={{ width: '100%', height: '48px', borderRadius: '10px', padding: '0 16px', background: '#f4f4f2', border: 'none' }}>
                  <option value="BICYCLE">Bicycle</option><option value="MOTORCYCLE">Motorcycle</option><option value="CAR">Car</option><option value="TRUCK">Truck</option>
                </select>
              </div>
              <div className="grid2">
                <Field label="Plate Number" placeholder="AA-12345" i={3} value={data.plateNumber} onChange={(v) => change("plateNumber", v)} />
                <Field label="Make" placeholder="Toyota" i={4} value={data.make} onChange={(v) => change("make", v)} />
                <Field label="Model" placeholder="Corolla" i={5} value={data.model} onChange={(v) => change("model", v)} />
                <Field label="Year" placeholder="2020" i={6} value={data.year} onChange={(v) => change("year", v)} />
              </div>
            </>
          )}
          <div className="rise" style={{ "--i": 7, marginTop: 34 }}><Submit state="idle" label="Finish Registration" done="Done!" /></div>
        </form>
      )}

      <Social onClick={() => {}} busy={false} />
      <p className="switch rise" style={{ "--i": 10 }}>Already have an account? <button type="button" onClick={() => go("login")}>Login</button></p>
    </>
  );
}