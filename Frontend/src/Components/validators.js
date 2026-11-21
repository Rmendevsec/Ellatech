const PHONE = /^(\+?251|0)?9\d{8}$/;
const MAIL = /^\S+@\S+\.\S+$/;
const clean = (v) => v.replace(/[\s-]/g, "");

export const RULES = {
  name: (v) => (v.trim().length >= 2 ? "" : "Please enter your full name"),
  phone: (v) => (PHONE.test(clean(v)) ? "" : "Use an Ethiopian number, e.g. +251 912 345 678"),
  email: (v) => (MAIL.test(v.trim()) ? "" : "Enter a valid email address"),
  password: (v) => (v.length >= 8 ? "" : "Use at least 8 characters"),
  loginId: (v) => (MAIL.test(v.trim()) || PHONE.test(clean(v)) ? "" : "Enter a valid phone or email"),
  nationalId: (v) => (v.trim().length >= 5 ? "" : "Enter your National ID number"),
  emergencyName: (v) => (v.trim().length >= 2 ? "" : "Enter emergency contact name"),
  emergencyPhone: (v) => (PHONE.test(clean(v)) ? "" : "Enter a valid emergency phone"),
  emergencyAddress: (v) => (v.trim().length >= 3 ? "" : "Enter emergency contact address"),
  plateNumber: (v) => (v.trim().length >= 3 ? "" : "Enter vehicle plate number"),
  make: (v) => (v.trim().length >= 2 ? "" : "Enter vehicle make"),
  model: (v) => (v.trim().length >= 1 ? "" : "Enter vehicle model"),
  year: (v) => (/^\d{4}$/.test(v) && Number(v) >= 1990 ? "" : "Enter a valid year"),
  tinNumber: (v) => (v.trim().length >= 5 ? "" : "Enter your TIN number"),
  storeName: (v) => (v.trim().length >= 2 ? "" : "Enter store name"),
  storeAddress: (v) => (v.trim().length >= 3 ? "" : "Enter store address"),
};

export function strength(p) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}
export const LEVELS = [
  ["Weak", "#d92d20"], ["Weak", "#d92d20"], ["Fair", "#f79009"],
  ["Good", "#84cc16"], ["Strong", "#12b76a"],
];