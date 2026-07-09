/* Scope Digest — bedside calculators. Educational use only; verify against primary sources. */

function show(id, big, note, rose){
  const el = document.getElementById(id);
  el.style.display = "block";
  el.classList.toggle("rose", !!rose);
  el.querySelector(".big").textContent = big;
  el.querySelector(".note").textContent = note;
}
function num(id){ const v = parseFloat(document.getElementById(id).value); return isNaN(v) ? null : v; }
function chk(id){ return document.getElementById(id).checked; }

/* ——— Glasgow-Blatchford Score (BUN entered in mg/dL, converted to urea mmol/L) ——— */
function calcGBS(){
  const bun = num("gbs-bun"), hgb = num("gbs-hgb"), sbp = num("gbs-sbp");
  const sex = document.getElementById("gbs-sex").value;
  if(bun===null||hgb===null||sbp===null){ show("gbs-result","—","Enter BUN, hemoglobin, and systolic BP.",false); return; }
  let s = 0;
  const urea = bun / 2.8; // mg/dL -> mmol/L
  if(urea >= 25) s += 6;
  else if(urea >= 10) s += 4;
  else if(urea >= 8) s += 3;
  else if(urea >= 6.5) s += 2;
  if(sex === "m"){
    if(hgb < 10) s += 6; else if(hgb < 12) s += 3; else if(hgb < 13) s += 1;
  } else {
    if(hgb < 10) s += 6; else if(hgb < 12) s += 1;
  }
  if(sbp < 90) s += 3; else if(sbp < 100) s += 2; else if(sbp < 110) s += 1;
  if(chk("gbs-hr")) s += 1;
  if(chk("gbs-melena")) s += 1;
  if(chk("gbs-syncope")) s += 2;
  if(chk("gbs-liver")) s += 2;
  if(chk("gbs-chf")) s += 2;
  const lowRisk = s <= 1;
  show("gbs-result", "GBS " + s,
    lowRisk ? "Score 0–1: very low risk — ACG 2021 supports outpatient management with early follow-up."
            : "Score ≥2: admit; risk of needing intervention rises with score.",
    !lowRisk);
}

/* ——— MELD 3.0 (Kim et al., Gastroenterology 2021) ——— */
function calcMELD(){
  let bili = num("meld-bili"), cr = num("meld-cr"), inr = num("meld-inr"),
      na = num("meld-na"), alb = num("meld-alb");
  const female = document.getElementById("meld-sex").value === "f";
  const hd = chk("meld-hd");
  if([bili,cr,inr,na,alb].some(v => v===null)){ show("meld-result","—","Enter all five labs.",false); return; }
  bili = Math.max(bili, 1);
  inr  = Math.max(inr, 1);
  na   = Math.min(Math.max(na, 125), 137);
  alb  = Math.min(Math.max(alb, 1.5), 3.5);
  cr   = Math.max(cr, 1);
  if(hd || cr > 3) cr = 3;
  let m = (female ? 1.33 : 0)
        + 4.56 * Math.log(bili)
        + 0.82 * (137 - na)
        - 0.24 * (137 - na) * Math.log(bili)
        + 9.09 * Math.log(inr)
        + 11.14 * Math.log(cr)
        + 1.85 * (3.5 - alb)
        - 1.83 * (3.5 - alb) * Math.log(cr)
        + 6;
  m = Math.round(m);
  m = Math.min(Math.max(m, 6), 40);
  show("meld-result", "MELD 3.0 = " + m,
    m >= 15 ? "MELD ≥15: discuss transplant referral if not already listed."
            : "Inputs are clamped per the published model (Na 125–137, albumin 1.5–3.5, Cr 1–3; Cr set to 3 if dialysis).",
    m >= 15);
}

/* ——— Child-Pugh ——— */
function calcCP(){
  const pts = ["cp-bili","cp-alb","cp-inr","cp-asc","cp-enc"]
    .map(id => parseInt(document.getElementById(id).value, 10))
    .reduce((a,b)=>a+b,0);
  let cls, note;
  if(pts <= 6){ cls="A"; note="Class A (5–6): well-compensated; ~1-yr survival >95%."; }
  else if(pts <= 9){ cls="B"; note="Class B (7–9): significant compromise."; }
  else { cls="C"; note="Class C (10–15): decompensated; discuss transplant evaluation and goals."; }
  show("cp-result", "Child-Pugh " + cls + " (" + pts + " pts)", note, cls==="C");
}

/* ——— BISAP ——— */
function calcBISAP(){
  let s = 0;
  ["bisap-bun","bisap-ams","bisap-sirs","bisap-age","bisap-pleff"].forEach(id => { if(chk(id)) s += 1; });
  show("bisap-result", "BISAP " + s,
    s >= 3 ? "BISAP ≥3: elevated risk of severe pancreatitis and mortality — escalate monitoring."
           : "BISAP 0–2: lower risk; reassess at 24–48 h.",
    s >= 3);
}
