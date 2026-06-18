import React, { useState, useMemo } from "react";

const C = {
  bg: "#F6F7F8", panel: "#FFFFFF", ink: "#15181C", sub: "#5B6470", faint: "#8A929C",
  line: "#E6E9ED", accent: "#0E7C86", gold: "#C9A227", green: "#0F8A4D", amber: "#C97A0A", amberBg: "#FBF1E2", red: "#C4362F", purple: "#6B4E9E",
};
const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const sans = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const n0 = (n) => Math.round(n).toLocaleString("en-US");
const n1 = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const usd = (n) => "$" + Math.round(n).toLocaleString("en-US");
const usdk = (n) => "$" + (n / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 }) + "k";
const pct = (n) => Math.round(n) + "%";
const LUNCH = 0.5, DAYS = 4, WK = 46;

function Info({ id, pop, setPop, text }) {
  const open = pop === id;
  return (
    <span style={{ position: "relative", display: "inline-block", marginLeft: 6 }}>
      <button onClick={(e) => { e.stopPropagation(); setPop(open ? null : id); }} style={{ width: 16, height: 16, borderRadius: 8, border: `1px solid ${C.accent}`, background: open ? C.accent : "#fff", color: open ? "#fff" : C.accent, fontSize: 10, fontWeight: 800, cursor: "pointer", lineHeight: 1, padding: 0, fontFamily: sans }}>?</button>
      {open && <div style={{ position: "absolute", zIndex: 40, top: 22, right: 0, width: 270, background: C.ink, color: "#fff", borderRadius: 10, padding: "12px 14px", fontSize: 12, lineHeight: 1.55, boxShadow: "0 8px 24px rgba(0,0,0,.22)", fontWeight: 400 }}>{text}</div>}
    </span>
  );
}
function Section({ title, kicker, subtitle, children }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 14, padding: "18px 20px" }}>
      {(title || kicker) && <div style={{ marginBottom: 14 }}>
        {kicker && <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.accent, fontWeight: 700 }}>{kicker}</div>}
        {title && <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, marginTop: 2 }}>{title}</div>}
        {subtitle && <div style={{ fontFamily: mono, fontSize: 11, color: C.faint, marginTop: 5, lineHeight: 1.5 }}>{subtitle}</div>}
      </div>}
      {children}
    </div>
  );
}
function Slider({ label, value, min, max, step, onChange, suffix, hint, color = C.accent, info }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: C.sub, fontWeight: 500, display: "flex", alignItems: "center" }}>{label}{info}</span>
        <span style={{ fontFamily: mono, fontSize: 14, color: C.ink, fontWeight: 700 }}>{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} style={{ width: "100%", accentColor: color, cursor: "pointer" }} />
      {hint && <div style={{ fontSize: 11, color: C.faint, marginTop: 3, lineHeight: 1.4 }}>{hint}</div>}
    </div>
  );
}
function Toggle({ label, options, value, onChange, hint, info }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, color: C.sub, fontWeight: 500, marginBottom: 7, display: "flex", alignItems: "center" }}>{label}{info}</div>
      <div style={{ display: "flex", gap: 6, background: C.bg, padding: 4, borderRadius: 10, border: `1px solid ${C.line}` }}>
        {options.map((o) => { const active = o.val === value;
          return <button key={o.label} onClick={() => onChange(o.val)} style={{ flex: 1, border: "none", cursor: "pointer", borderRadius: 7, padding: "9px 6px", fontSize: 13, fontWeight: 600, fontFamily: sans, background: active ? C.accent : "transparent", color: active ? "#fff" : C.sub }}>{o.label}</button>; })}
      </div>
      {hint && <div style={{ fontSize: 11, color: C.faint, marginTop: 6, lineHeight: 1.4 }}>{hint}</div>}
    </div>
  );
}
function Stat({ label, value, unit, sub, accent }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: "14px 16px", flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 10.5, letterSpacing: "0.05em", textTransform: "uppercase", color: C.faint, fontWeight: 600 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 6 }}>
        <span style={{ fontFamily: mono, fontSize: 25, fontWeight: 700, color: accent || C.ink, lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: 12, color: C.sub, fontWeight: 600 }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize: 11.5, color: C.sub, marginTop: 5, lineHeight: 1.35 }}>{sub}</div>}
    </div>
  );
}
function Chip({ label, value, col }) {
  return (
    <div style={{ flex: 1, minWidth: 108, background: C.bg, borderRadius: 10, padding: "10px 12px", borderLeft: `3px solid ${col}` }}>
      <div style={{ fontSize: 11, color: C.sub, fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: mono, fontSize: 18, fontWeight: 700, color: col, marginTop: 3 }}>{value}</div>
    </div>
  );
}
function FunnelBreakdown({ total, F, earlyN, lateN, alaN, dropN, renewers }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 14, padding: "18px 20px", marginBottom: 16 }}>
      <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.gold, fontWeight: 700 }}>Women's patient flow · this year</div>
      <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>{n0(total)} total women in care / yr</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
        <Chip label="New foundation starts" value={n0(F) + "/yr"} col={C.ink} />
        <Chip label="→ Ongoing (early $695)" value={n0(earlyN)} col={C.green} />
        <Chip label="→ Ongoing (std $795)" value={n0(lateN)} col={C.accent} />
        <Chip label="→ À la carte $295" value={n0(alaN)} col={C.gold} />
        <Chip label="→ Drop after foundation" value={n0(dropN)} col={C.faint} />
        <Chip label="Continuing ongoing" value={n0(renewers)} col={C.purple} />
      </div>
    </div>
  );
}
function BreakdownBar({ segments, total }) {
  return (
    <div>
      <div style={{ display: "flex", height: 34, borderRadius: 8, overflow: "hidden", border: `1px solid ${C.line}` }}>
        {segments.map((s, i) => <div key={i} title={`${s.label}: ${n1(s.hrs)} hrs`} style={{ width: `${(s.hrs / total) * 100}%`, background: s.col, minWidth: s.hrs > 0.05 ? 2 : 0 }} />)}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 10 }}>
        {segments.map((s, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.sub }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: s.col, display: "inline-block" }} />{s.label} <b style={{ fontFamily: mono, color: C.ink }}>{n1(s.hrs)}h</b></div>)}
      </div>
    </div>
  );
}

function womensEconomics({ F, pOngoing, pEarly, pAla, nAla, tenure, maturity }) {
  const conv = pOngoing / 100, early = pEarly / 100, ala = pAla / 100, mat = maturity / 100;
  const newConverters = F * conv, earlyN = newConverters * early, lateN = newConverters * (1 - early);
  const alaN = F * (1 - conv) * ala, dropN = F * (1 - conv) * (1 - ala);
  const ongoingPool = newConverters * tenure * mat, renewers = Math.max(0, ongoingPool - newConverters);
  const womRev = F * 895 + earlyN * 695 + lateN * 795 + renewers * 795 + alaN * nAla * 295;
  return { newConverters, earlyN, lateN, alaN, dropN, ongoingPool, renewers, womRev, totalWomen: F + renewers };
}
const womFacePer = ({ pOngoing, pAla, nAla, tenure, maturity }) => {
  const conv = pOngoing / 100, ala = pAla / 100, mat = maturity / 100;
  return (120 + mat * conv * tenure * 105 + (1 - conv) * ala * nAla * 30) / 60;
};
const womChartPer = ({ docMin, pOngoing, pAla, nAla, tenure, maturity }) => {
  const conv = pOngoing / 100, ala = pAla / 100, mat = maturity / 100;
  return (3 + mat * conv * tenure * 3 + (1 - conv) * ala * nAla) * docMin / 60;
};
const womHrsFull = (p) => womFacePer(p) + womChartPer(p);

export default function ClinicModel() {
  const [pop, setPop] = useState(null);
  const [tab, setTab] = useState("core");
  const [mixLong, setMixLong] = useState(75);
  const [workedHrs, setWorkedHrs] = useState(29);
  const [accessWeeks, setAccessWeeks] = useState(1); // 1wk=72% schedulable, 2wk=80% (bundles urgent + access)
  const [adminBlock, setAdminBlock] = useState(1.5);
  const [docMin, setDocMin] = useState(12);
  const [fuPerHour, setFuPerHour] = useState(2);
  const [priceLong, setPriceLong] = useState(1495);
  const [longVisits, setLongVisits] = useState(8);
  const [churn, setChurn] = useState(15);
  const [splitShare, setSplitShare] = useState(50);
  const [actualPanel, setActualPanel] = useState(120);
  const [pOngoing, setPOngoing] = useState(50);
  const [pEarly, setPEarly] = useState(60);
  const [pAla, setPAla] = useState(30);
  const [nAla, setNAla] = useState(2);
  const [tenure, setTenure] = useState(3);
  const [maturity, setMaturity] = useState(100);
  const [salary, setSalary] = useState(132000);
  const [targetGM, setTargetGM] = useState(70);
  const [otherCOGS, setOtherCOGS] = useState(8);
  const [npHrs, setNpHrs] = useState(6);
  const [npSessions, setNpSessions] = useState(1);
  const [npFrag, setNpFrag] = useState(0.3);
  const [npPrn, setNpPrn] = useState(12);
  const [npPay, setNpPay] = useState(75);
  const [nlHrs, setNlHrs] = useState(16);
  const [nlOverhead, setNlOverhead] = useState(22);
  const [nlReserve, setNlReserve] = useState(28);
  const [nlPay, setNlPay] = useState(90);
  const [nlPph, setNlPph] = useState(2); // longevity NP throughput: patients (routine visits) seen per hour

  const util = accessWeeks === 1 ? 0.72 : 0.80;
  const wP = { docMin, pOngoing, pEarly, pAla, nAla, tenure, maturity };
  const fuMin = 60 / fuPerHour;
  const longFacePer = (60 + (longVisits - 1) * fuMin + (churn / 100) * (splitShare / 100) * 30) / 60;
  const longChartPer = longVisits * docMin / 60;
  const longHrsFull = longFacePer + longChartPer;

  const m = useMemo(() => {
    const faceWeek = Math.max(0, workedHrs - adminBlock * DAYS);
    const faceFillable = faceWeek * WK * util;
    const chartAllowance = Math.max(0, adminBlock - LUNCH) * DAYS * WK;
    const wFace = womFacePer(wP), wChart = womChartPer(wP);
    const mix = mixLong / 100;

    // CAPACITY = clinical (face) time ONLY. Charting never caps the panel.
    const maxLong = faceFillable * mix / longFacePer;
    const F = faceFillable * (1 - mix) / wFace;

    const we = womensEconomics({ F, ...wP });
    const totalRev = maxLong * priceLong + we.womRev;

    // Charting that doesn't fit the admin block = UNPAID overtime (wellbeing cost, not capacity)
    const chartNeededAtMax = maxLong * longChartPer + F * wChart;
    const otAtMaxWk = Math.max(0, chartNeededAtMax - chartAllowance) / WK;

    // near-term (mat 0) vs steady-state (mat 100) women's starts/yr
    const solveF = (mat) => {
      const wf = womFacePer({ ...wP, maturity: mat }), wc = womChartPer({ ...wP, maturity: mat });
      return Math.min(faceFillable * (1 - mix) / wf, chartAllowance * (1 - mix) / wc);
    };
    const Fnear = solveF(0), Fsteady = solveF(100);

    // after-hours charting reality check (actual longevity panel)
    const actualChartNeed = actualPanel * longChartPer;
    const afterHoursWk = Math.max(0, actualChartNeed - chartAllowance) / WK;

    // weekly breakdown (paid week = face + reserve + admin block)
    const adminWk = adminBlock * DAYS, reserveWk = faceWeek * (1 - util);
    const usedFaceWk = faceWeek * util;

    const cogs = salary + totalRev * (otherCOGS / 100);
    const gm = totalRev > 0 ? (totalRev - cogs) / totalRev : 0;
    const denom = 1 - targetGM / 100 - otherCOGS / 100;
    const revForTarget = denom > 0 ? salary / denom : Infinity;
    const maxSalaryAtTarget = totalRev * denom;

    return { faceFillable, chartAllowance, faceWeek, maxLong,
      F, ...we, totalRev, Fnear, Fsteady, actualChartNeed, afterHoursWk, chartNeededAtMax, otAtMaxWk,
      adminWk, reserveWk, usedFaceWk, cogs, gm, revForTarget, maxSalaryAtTarget, wFace };
  }, [mixLong, workedHrs, accessWeeks, adminBlock, docMin, fuPerHour, priceLong, longVisits, churn, splitShare, actualPanel, pOngoing, pEarly, pAla, nAla, tenure, maturity, salary, targetGM, otherCOGS]);

  const np = useMemo(() => {
    const gross = npHrs * WK, continuity = Math.max(0.4, 1 - npFrag / npSessions), ceil = continuity * (1 - npPrn / 100);
    const F = gross * ceil / womHrsFull(wP), we = womensEconomics({ F, ...wP });
    const comp = gross * npPay, gm = we.womRev > 0 ? (we.womRev - comp - we.womRev * (otherCOGS / 100)) / we.womRev : 0;
    return { gross, continuity, ceil, effFillable: gross * ceil, F, ...we, comp, gm, foundMo: F / 12, revPerHr: we.womRev / gross };
  }, [npHrs, npSessions, npFrag, npPrn, npPay, pOngoing, pEarly, pAla, nAla, tenure, maturity, docMin, otherCOGS]);

  const nl = useMemo(() => {
    const gross = nlHrs * WK;
    // NP-specific throughput: routine visits run 30 min (2/hr) or 20 min (3/hr).
    const nlFuMin = 60 / nlPph;
    const nlFacePer = (60 + (longVisits - 1) * nlFuMin + (churn / 100) * (splitShare / 100) * 30) / 60;
    const faceFill = gross * (1 - nlOverhead / 100) * (1 - nlReserve / 100);
    const panel = faceFill / nlFacePer, rev = panel * priceLong, comp = gross * nlPay;

    // Margin: hourly NP charts INSIDE paid hours (no unpaid overtime) — comp is the only labor cost.
    const cogsDollar = rev * (otherCOGS / 100);
    const grossProfit = rev - comp - cogsDollar;
    const gm = rev > 0 ? grossProfit / rev : 0;
    const denom = 1 - targetGM / 100 - otherCOGS / 100;
    const maxPayAtTarget = gross > 0 && denom > 0 ? (rev * denom) / gross : 0;

    // Weekly paid-hours allocation (sums exactly to nlHrs; charting lives inside overhead).
    const overheadWk = nlHrs * (nlOverhead / 100);
    const reserveWk = nlHrs * (1 - nlOverhead / 100) * (nlReserve / 100);
    const faceWk = nlHrs * (1 - nlOverhead / 100) * (1 - nlReserve / 100);
    const clinicUrgentHrs = gross * (1 - nlOverhead / 100) * (nlReserve / 100);

    return { gross, nlFacePer, panel, rev, comp, cogsDollar, grossProfit, gm, maxPayAtTarget,
      clinicUrgentHrs, overheadWk, reserveWk, faceWk, revPerHr: rev / gross };
  }, [nlHrs, nlOverhead, nlReserve, nlPay, nlPph, priceLong, longVisits, churn, splitShare, targetGM, otherCOGS]);

  const TabBtn = ({ id, label, sub }) => (
    <button onClick={() => setTab(id)} style={{ flex: 1, textAlign: "left", border: `1px solid ${tab === id ? C.accent : C.line}`, background: tab === id ? "#fff" : C.bg, borderRadius: 12, padding: "11px 14px", cursor: "pointer", fontFamily: sans }}>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: tab === id ? C.accent : C.ink }}>{label}</div>
      <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>{sub}</div>
    </button>
  );

  return (
    <div style={{ fontFamily: sans, background: C.bg, color: C.ink, padding: "26px 22px", minHeight: "100%" }} onClick={() => setPop(null)}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.accent, fontWeight: 700 }}>Capacity · revenue · margin · scheduling</div>
          <h1 style={{ fontSize: 27, fontWeight: 800, margin: "6px 0 4px", letterSpacing: "-0.02em" }}>Clinic Staffing Model</h1>
          <div style={{ fontFamily: mono, fontSize: 11, color: C.faint }}>Every figure is solved at MAXIMUM sustainable capacity for the current settings. Tap any ? for an explanation.</div>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <TabBtn id="core" label="Core clinician (MD)" sub="Longevity + women's · salaried" />
          <TabBtn id="np" label="Menopause NP" sub="Women's only · hourly · schedule-aware" />
          <TabBtn id="nl" label="Longevity NP" sub="Membership · hourly · part-time" />
        </div>

        {tab === "core" && (<>
          {/* CAPACITY NOTE */}
          <div style={{ background: "#EAF5F6", border: `1px solid ${C.accent}44`, borderRadius: 14, padding: "13px 18px", marginBottom: 16 }}>
            <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.55 }}>
              <b style={{ color: C.accent }}>Capacity is set by clinical (face) time.</b> Charting always happens inside the {adminBlock}h/day admin block; anything that doesn't fit becomes <b>unpaid overtime</b> the clinician absorbs — it never reduces the panel or blocks a clinical slot. So worked hours, follow-up length, the booking promise, visits/yr, mix and price all move capacity &amp; revenue; charting min/visit moves only the unpaid-overtime number below.
            </div>
          </div>

          <div style={{ background: C.panel, border: `2px solid ${C.accent}`, borderRadius: 14, padding: "18px 20px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ fontSize: 15, fontWeight: 800, display: "flex", alignItems: "center" }}>Master mix — capacity split
                <Info id="mix" pop={pop} setPop={setPop} text="The master dial. It divides the clinician's bookable time between the two programs — left for a bigger longevity panel, right for more women's throughput. Every panel and revenue figure below is solved at maximum capacity for whatever split you choose." /></div>
              <div style={{ fontFamily: mono, fontWeight: 800, fontSize: 15 }}><span style={{ color: C.accent }}>{mixLong}% longevity</span> · <span style={{ color: C.gold }}>{100 - mixLong}% women's</span></div>
            </div>
            <input type="range" min={0} max={100} step={5} value={mixLong} onChange={(e) => setMixLong(parseFloat(e.target.value))} style={{ width: "100%", accentColor: C.accent, cursor: "pointer", height: 6 }} />
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
            <Stat label="Max longevity panel" value={n0(m.maxLong)} unit="members" accent={C.accent} sub="limited by clinical time" />
            <Stat label="Total women's patients" value={n0(m.totalWomen)} unit="/yr" accent={C.gold} sub={`${n0(m.F)} new starts`} />
            <Stat label="Total revenue (at max)" value={usdk(m.totalRev)} unit="/yr" accent={C.ink} sub={`GM ${pct(m.gm * 100)}`} />
            <Stat label="Unpaid charting overtime" value={n1(m.afterHoursWk)} unit="h/wk" accent={m.afterHoursWk > 0.3 ? C.red : C.green} sub="at your current panel" />
          </div>

          {/* UNPAID OVERTIME CHARTING */}
          <div style={{ background: m.afterHoursWk > 0.3 ? C.amberBg : "#E8F5EE", border: `1px solid ${(m.afterHoursWk > 0.3 ? C.amber : C.green)}44`, borderRadius: 14, padding: "18px 20px", marginBottom: 16 }}>
            <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: m.afterHoursWk > 0.3 ? C.amber : C.green, fontWeight: 700 }}>Unpaid overtime charting — wellbeing &amp; retention, not capacity</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
              <Stat label="Charting that fits the block" value={n0(m.chartAllowance)} unit="hrs/yr" sub={`(${adminBlock}−${LUNCH}h lunch)×4 days`} />
              <Stat label="Charting your panel needs" value={n0(m.actualChartNeed)} unit="hrs/yr" sub={`${n0(actualPanel)} members × ${longVisits}×${docMin}min`} accent={C.ink} />
              <Stat label="Unpaid overtime" value={n1(m.afterHoursWk)} unit="hrs/wk" accent={m.afterHoursWk > 0.3 ? C.red : C.green} sub="charting done off the clock" />
            </div>
            <p style={{ fontSize: 13, color: C.ink, marginTop: 12, marginBottom: 0, lineHeight: 1.55 }}>
              This does <b>not</b> cap the panel — every patient is still booked into clinical time. The charting that won't fit the {adminBlock}h block (lunch aside) is simply done as unpaid overtime: <b>{n1(m.afterHoursWk)} hrs/week</b> at your {n0(actualPanel)}-member panel and {docMin} min/visit. That's the burnout and the retention risk — and the only thing an AI scribe changes. Drop charting min/visit and watch this fall to zero with no change to capacity or revenue.
            </p>
          </div>

          {/* NEAR-TERM vs STEADY */}
          <div style={{ background: "#FFF9EC", border: `1px solid ${C.gold}55`, borderRadius: 14, padding: "18px 20px", marginBottom: 16 }}>
            <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.gold, fontWeight: 700 }}>Women's intake: near-term ramp vs steady-state</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
              <Stat label="Near-term ramp" value={n1(m.Fnear / 12)} unit="/mo" accent={C.green} sub="while the program is young" />
              <Stat label="Steady-state sustainable" value={n1(m.Fsteady / 12)} unit="/mo" accent={C.red} sub="once fully matured" />
              <Stat label="At current maturity" value={n1(m.F / 12)} unit="/mo" accent={C.ink} sub={`${maturity}% pool filled`} />
            </div>
            <p style={{ fontSize: 13, color: C.ink, marginTop: 12, marginBottom: 0, lineHeight: 1.6 }}>
              <b>Near-term ramp</b> is how many new women she can START each month right now. A new patient's immediate cost is mostly her 60-minute first visit — the week-6 and week-12 follow-ups and any ongoing care arrive later, so the calendar isn't full yet. You can run above the sustainable rate for a quarter or two.<br />
              <b>Steady-state sustainable</b> is what she can start every month forever, once those follow-ups and years of accumulated ongoing care have stacked up. That's the real long-run ceiling. The gap between the two is your ramp runway — and the countdown to needing a second provider. The maturity slider moves "current" between them.
            </p>
          </div>

          {/* HOURS BREAKDOWN */}
          <div style={{ marginBottom: 16 }}>
            <Section kicker="Where the hours go" title={`Her ${workedHrs} paid hrs/week`} subtitle="The paid week is fully used at capacity: clinical time + reserve + admin block. Charting overflow sits OUTSIDE the paid week as unpaid overtime.">
              <BreakdownBar total={workedHrs} segments={[
                { label: "Clinical (face) time", hrs: m.usedFaceWk, col: C.accent },
                { label: "Held-open reserve (urgent + routine access)", hrs: m.reserveWk, col: C.purple },
                { label: "Admin block (lunch + admin + charting)", hrs: m.adminWk, col: C.amber },
              ]} />
              {m.afterHoursWk > 0.05 && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 11.5, color: C.red, fontWeight: 600, marginBottom: 5 }}>+ Unpaid overtime charting (off the clock, beyond the paid week)</div>
                  <div style={{ display: "flex", height: 22, borderRadius: 6, overflow: "hidden", border: `1px dashed ${C.red}` }}>
                    <div style={{ width: `${Math.min(100, (m.afterHoursWk / workedHrs) * 100)}%`, background: C.red, opacity: 0.75 }} />
                  </div>
                  <div style={{ fontSize: 11.5, color: C.sub, marginTop: 5, fontFamily: mono }}>{n1(m.afterHoursWk)} hrs/week unpaid · {n0(m.afterHoursWk * WK)} hrs/yr</div>
                </div>
              )}
            </Section>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 14, marginBottom: 16 }}>
            <Section kicker="Supply" title="Clinician time" subtitle="Fixed: 4 clinic days/week · 8-hr day · 0.5h lunch inside the admin block">
              <Toggle label="Worked hours / week" info={<Info id="wk" pop={pop} setPop={setPop} text="Total hours she's at the clinic each week, including her admin block. 29 today, ramping to 32 (four 8-hour days)." />} options={[{ label: "29 (now)", val: 29 }, { label: "32 (target)", val: 32 }]} value={workedHrs} onChange={setWorkedHrs} />
              <Slider label="Daily admin block (lunch + admin + ALL charting)" value={adminBlock} min={1} max={3} step={0.25} onChange={setAdminBlock} suffix=" h/day" info={<Info id="block" pop={pop} setPop={setPop} text="The single daily block for everything non-clinical: lunch, admin, and ALL documentation. Nothing administrative happens outside it. Clinical (face) time = worked hours − this block. We assume 0.5h of it is lunch, so the rest is available for admin + charting." />} hint="No admin outside this. 0.5h is lunch; the rest holds charting." />
              <Slider label="Admin + charting min / visit" value={docMin} min={4} max={25} step={1} onChange={setDocMin} suffix=" min" info={<Info id="doc" pop={pop} setPop={setPop} text="Documentation + related admin generated per visit. It does NOT affect capacity or revenue — capacity is set by clinical time. It drives ONLY one thing: how much unpaid after-hours charting the clinician absorbs when it overflows the admin block. Lowering it (an AI scribe like Blair) is a wellbeing and retention win, not a capacity win." />} hint="Drives unpaid overtime only — not capacity or revenue." />
              <Toggle label="Routine booking promise" info={<Info id="acc" pop={pop} setPop={setPop} text="How fast you promise routine follow-ups can be booked. A 1-week promise means holding more slots open, so you fill ~72% of clinical time; 2 weeks lets you fill ~80%. This single setting already reserves capacity for BOTH urgent visits and routine-access slack — there is no separate urgent reserve (we merged them, since they're the same idea: don't run at 100%)." />} options={[{ label: "1 week (72%)", val: 1 }, { label: "2 weeks (80%)", val: 2 }]} value={accessWeeks} onChange={setAccessWeeks} hint="One reserve, covering urgent + routine access." />
              <Toggle label="Longevity follow-ups / hour" info={<Info id="fu" pop={pop} setPop={setPop} text="How long a routine longevity follow-up runs: 30 min (2/hr) or 20 min (3/hr). Shorter visits free clinical time — but that only raises capacity when clinical time is the binding constraint (see the banner up top)." />} options={[{ label: "2 /hr (30m)", val: 2 }, { label: "3 /hr (20m)", val: 3 }]} value={fuPerHour} onChange={setFuPerHour} />
            </Section>
            <Section kicker="Demand · longevity" title="Membership Core" subtitle="Fixed: AHE 60m · intake 60m / 30m+60m split">
              <Slider label="Revenue / member / year" value={priceLong} min={995} max={2500} step={5} onChange={setPriceLong} suffix="" info={<Info id="price" pop={pop} setPop={setPop} text="Annual membership price ($1,495 = $145/mo). A pure revenue lever — it scales membership revenue directly and has no effect on capacity." />} hint="$1,495/yr = $145/mo." />
              <Slider label="Visits / member / year" value={longVisits} min={4} max={14} step={1} onChange={setLongVisits} suffix="" info={<Info id="vis" pop={pop} setPop={setPop} text="Average visits per member per year — 1 is the 60-min annual exam, the rest are follow-ups. More visits means more time AND more charting per member, shrinking both the clinical and charting panels." />} hint={`face ${n1(longFacePer)}h + charting ${n1(longChartPer)}h / member`} />
              <Slider label="Annual churn" value={churn} min={0} max={40} step={1} onChange={setChurn} suffix="%" info={<Info id="churn" pop={pop} setPop={setPop} text="Share of members who leave and are replaced each year. Each replacement needs onboarding time. Affects clinical time, not charting." />} />
              <Slider label="New patients using split intake (90m)" value={splitShare} min={0} max={100} step={5} onChange={setSplitShare} suffix="%" info={<Info id="split" pop={pop} setPop={setPop} text="Of new members, the share doing the longer split intake (30-min meet-and-greet + separate 60-min exam = 90 min) instead of the combined 60-min intake. The split path adds a 30-min visit." />} />
              <Slider label="Your actual panel (drives overtime check)" value={actualPanel} min={0} max={300} step={5} onChange={setActualPanel} suffix="" info={<Info id="act" pop={pop} setPop={setPop} text="Your real current membership (~120). It does NOT change the max-capacity solve or revenue — it drives the unpaid-overtime charting number, showing how much after-hours documentation she's actually absorbing at today's panel size." />} hint="Drives the unpaid-overtime number, not capacity/revenue." />
            </Section>
            <Section kicker="Demand · women's flow" title="Conversion levers" subtitle="Fixed: foundation 60+30+30m ($895) · ongoing 105m/yr · single 30m ($295)">
              <Slider label="Program maturity (ongoing pool filled)" value={maturity} min={0} max={100} step={5} onChange={setMaturity} suffix="%" color={C.gold} info={<Info id="mat" pop={pop} setPop={setPop} text="How full the ongoing-care pool is. A brand-new program (low %) has almost no recurring follow-ups yet, so each new woman costs only her foundation visits — capacity looks high. A mature program (100%) carries years of accumulated ongoing care, so sustainable intake is much lower. This dial slides 'current' between the near-term and steady-state numbers above." />} hint="New program ≈ low." />
              <Slider label="Foundation → ongoing care" value={pOngoing} min={0} max={100} step={5} onChange={setPOngoing} suffix="%" color={C.gold} info={<Info id="conv" pop={pop} setPop={setPop} text="Of women finishing foundation, the share who enroll in ongoing care. Higher conversion means more recurring revenue per woman but more ongoing-care hours, so slightly fewer new starts fit." />} />
              <Slider label="…of converters, early ($695)" value={pEarly} min={0} max={100} step={5} onChange={setPEarly} suffix="%" color={C.gold} info={<Info id="early" pop={pop} setPop={setPop} text="Of those who convert to ongoing care, the share who sign up within one week, locking the $695 rate instead of $795." />} />
              <Slider label="Non-converters → à la carte" value={pAla} min={0} max={100} step={5} onChange={setPAla} suffix="%" color={C.gold} info={<Info id="ala" pop={pop} setPop={setPop} text="Of women who DON'T convert to ongoing care, the share who still return for occasional paid visits at $295 each." />} />
              <Slider label="Avg à la carte visits / yr" value={nAla} min={0} max={6} step={1} onChange={setNAla} suffix="" color={C.gold} info={<Info id="nala" pop={pop} setPop={setPop} text="Average number of à-la-carte visits per year for those occasional-return patients." />} />
              <Slider label="Ongoing-care retention" value={tenure} min={1} max={6} step={1} onChange={setTenure} suffix=" yrs" color={C.gold} info={<Info id="ten" pop={pop} setPop={setPop} text="Average years a woman stays in ongoing care before leaving. Longer tenure builds a larger recurring pool and more renewal revenue." />} />
            </Section>
          </div>

          <FunnelBreakdown total={m.totalWomen} F={m.F} earlyN={m.earlyN} lateN={m.lateN} alaN={m.alaN} dropN={m.dropN} renewers={m.renewers} />

          <Section kicker="Unit economics" title="Gross margin" subtitle="Fixed: GM = (revenue − comp − other COGS) ÷ revenue">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 16, alignItems: "start" }}>
              <div>
                <Slider label="Clinician salary / yr" value={salary} min={80000} max={220000} step={1000} onChange={setSalary} suffix="" info={<Info id="sal" pop={pop} setPop={setPop} text="Annual cost of the salaried clinician. Used only for margin — it does not change revenue or capacity." />} hint="Planned $132k." />
                <Slider label="Target gross margin" value={targetGM} min={40} max={85} step={1} onChange={setTargetGM} suffix="%" color={C.green} info={<Info id="tgm" pop={pop} setPop={setPop} text="The gross margin you're aiming for. The model then shows the revenue you'd need, and the max comp you could pay, to hit it." />} />
                <Slider label="Other COGS (labs/supplies/software)" value={otherCOGS} min={0} max={25} step={1} onChange={setOtherCOGS} suffix="%" info={<Info id="cogs" pop={pop} setPop={setPop} text="Non-labor cost of goods as a % of revenue: labs, supplies, software, per-patient consumables." />} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Stat label="Current gross margin" value={pct(m.gm * 100)} accent={m.gm >= targetGM / 100 ? C.green : C.red} sub={`${usd(m.totalRev)} − ${usd(m.cogs)}`} />
                <Stat label="Revenue needed for target" value={isFinite(m.revForTarget) ? usdk(m.revForTarget) : "—"} accent={C.ink} sub={isFinite(m.revForTarget) ? `${usd(Math.max(0, m.revForTarget - m.totalRev))} short` : "unreachable"} />
                <Stat label="Max salary at target margin" value={usdk(Math.max(0, m.maxSalaryAtTarget))} accent={C.gold} sub="on current revenue" />
              </div>
            </div>
          </Section>
        </>)}

        {tab === "np" && (<>
          <div style={{ background: "#F3EFFA", border: `1px solid ${C.purple}44`, borderRadius: 14, padding: "14px 18px", marginBottom: 16, fontSize: 13.5, color: C.ink, lineHeight: 1.55 }}>
            Menopause-only hourly NP. Hourly providers chart within their paid hours, so documentation consumes billable time here (unlike the salaried MD's fixed block). Program + conversion assumptions carry over from the Core tab. All figures at max capacity.
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
            <Stat label="Total women's patients" value={n0(np.totalWomen)} unit="/yr" accent={C.gold} sub={`${n1(np.foundMo)} new/mo`} />
            <Stat label="Revenue (at max)" value={usdk(np.womRev)} unit="/yr" accent={C.ink} sub={`${usd(np.revPerHr)}/worked hr`} />
            <Stat label="NP comp" value={usdk(np.comp)} unit="/yr" accent={C.purple} sub={`${npHrs}h/wk × $${npPay}`} />
            <Stat label="Gross margin" value={pct(np.gm * 100)} accent={np.gm >= 0.6 ? C.green : C.amber} sub="rev − comp − COGS" />
          </div>
          <FunnelBreakdown total={np.totalWomen} F={np.F} earlyN={np.earlyN} lateN={np.lateN} alaN={np.alaN} dropN={np.dropN} renewers={np.renewers} />
          <Section kicker="Scheduling & availability" title="Thin-roster capacity loss" subtitle="Effective ceiling = continuity × (1 − PRN buffer)">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              <Stat label="Continuity factor" value={pct(np.continuity * 100)} accent={C.purple} sub={`${npSessions} session(s)/wk`} />
              <Stat label="Effective ceiling" value={pct(np.ceil * 100)} accent={C.purple} sub="of raw hours" />
              <Stat label="Effective bookable" value={n0(np.effFillable)} unit="hrs/yr" accent={C.ink} sub={`of ${n0(np.gross)} raw`} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
              <div>
                <Slider label="Hours / week" value={npHrs} min={4} max={8} step={1} onChange={setNpHrs} suffix=" hrs" color={C.purple} info={<Info id="nph" pop={pop} setPop={setPop} text="Paid hours per week for this hourly, menopause-only NP." />} />
                <Slider label="Sessions / week (days worked)" value={npSessions} min={1} max={3} step={1} onChange={setNpSessions} suffix="" color={C.purple} info={<Info id="nps" pop={pop} setPop={setPop} text="How many separate days those hours are spread across. More days = higher continuity: easier to land the fixed week-6 and week-12 follow-ups on time and to backfill no-shows. Two 3-hr days beat one 6-hr day by ~20%." />} hint="More days = higher continuity." />
                <Slider label="Fragmentation constant k" value={npFrag} min={0.1} max={0.5} step={0.05} onChange={setNpFrag} suffix="" color={C.purple} info={<Info id="npf" pop={pop} setPop={setPop} text="Calibration constant: continuity = 1 − k/sessions. It captures slots lost to gaps, un-backfillable no-shows, and the rigidity of fixed-cadence follow-ups. Tune to her real fill rate once you have Acuity data." />} hint="continuity = 1 − k/sessions" />
                <Slider label="PRN buffer (held open)" value={npPrn} min={0} max={25} step={1} onChange={setNpPrn} suffix="%" color={C.purple} info={<Info id="npp" pop={pop} setPop={setPop} text="Share of capacity held open for unpredictable PRN (as-needed) follow-ups that can't be scheduled in advance." />} />
                <Slider label="NP pay rate" value={npPay} min={75} max={100} step={5} onChange={setNpPay} suffix=" /hr" color={C.purple} info={<Info id="npy" pop={pop} setPop={setPop} text="Hourly pay. A pure variable cost with no salary floor — which is why hourly NP margins stay high even part-time." />} />
              </div>
              <div style={{ background: C.bg, borderRadius: 10, padding: "14px 16px", fontSize: 12.5, color: C.sub, lineHeight: 1.6 }}>
                A foundation patient is locked to a cadence (intake → +6wk → +12wk → ongoing → annual) plus unpredictable PRN. A one-day-a-week NP pre-commits her few slots to time-locked follow-ups and holds some open for PRN, and can't backfill a no-show until next week — so usable hours fall to <b style={{ fontFamily: mono, color: C.purple }}>{pct(np.ceil * 100)}</b> of raw.
              </div>
            </div>
          </Section>
        </>)}

        {tab === "nl" && (<>
          <div style={{ background: "#EAF5F6", border: `1px solid ${C.accent}44`, borderRadius: 14, padding: "14px 18px", marginBottom: 16, fontSize: 13.5, color: C.ink, lineHeight: 1.55 }}>
            Part-time, hourly longevity-membership NP, hours spread across several days. Longevity assumptions (visits, price, follow-up length) carry over from the Core tab. All figures at max capacity.
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
            <Stat label="Longevity panel held" value={n0(nl.panel)} unit="members" accent={C.accent} sub={`${nl.gross.toFixed(0)} paid hrs/yr`} />
            <Stat label="Revenue (at max)" value={usdk(nl.rev)} unit="/yr" accent={C.ink} sub={`${usd(nl.revPerHr)}/worked hr`} />
            <Stat label="NP comp" value={usdk(nl.comp)} unit="/yr" accent={C.purple} sub={`${nlHrs}h/wk × $${nlPay}`} />
            <Stat label="Gross margin" value={pct(nl.gm * 100)} accent={nl.gm >= 0.6 ? C.green : C.amber} sub="rev − comp − COGS" />
          </div>

          {/* WEEKLY TIME ALLOCATION */}
          <div style={{ marginBottom: 16 }}>
            <Section kicker="Where her hours go" title={`Her ${nlHrs} paid hrs/week`} subtitle="Every paid hour is used: clinical time + held-open reserve + non-face overhead. Charting lives INSIDE overhead — an hourly NP charts on the clock, so there is no unpaid overtime here (unlike the salaried MD).">
              <BreakdownBar total={nlHrs} segments={[
                { label: "Clinical (face) time", hrs: nl.faceWk, col: C.accent },
                { label: "Held-open reserve (urgent + access)", hrs: nl.reserveWk, col: C.purple },
                { label: "Non-face overhead (lunch + admin + charting)", hrs: nl.overheadWk, col: C.amber },
              ]} />
              <div style={{ fontSize: 11.5, color: C.sub, marginTop: 10, fontFamily: mono }}>
                {n1(nl.faceWk)}h clinical fills {n0(nl.panel)} members at {nlPph}/hr ({(60 / nlPph).toFixed(0)}-min visits) · reserve ≈ {n0(nl.clinicUrgentHrs)} urgent hrs/yr for the whole clinic
              </div>
            </Section>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 14, marginBottom: 16 }}>
            <Section kicker="NP supply" title="Hours, throughput & reserve" subtitle="Fixed: same longevity visit schedule & $1,495/yr as Core">
              <Slider label="Hours / week" value={nlHrs} min={8} max={24} step={1} onChange={setNlHrs} suffix=" hrs" color={C.accent} info={<Info id="nlh" pop={pop} setPop={setPop} text="Paid hours per week for this part-time membership NP, assumed spread across several days so scheduling/timing isn't the binding issue (membership care isn't fixed-cadence like the menopause program)." />} hint="Spread across several days." />
              <Slider label="Patients seen / hour" value={nlPph} min={2} max={3} step={1} onChange={setNlPph} suffix=" /hr" color={C.accent} info={<Info id="nlpph" pop={pop} setPop={setPop} text="Routine-visit throughput for the membership NP: 2/hr (30-min visits) or 3/hr (20-min visits). Faster cadence shrinks the clinical hours each member consumes, so the same paid hours hold a larger panel. The annual exam stays 60 min regardless." />} hint={`${(60 / nlPph).toFixed(0)}-min visits · ${n1(nl.nlFacePer)}h face / member`} />
              <Slider label="Non-face overhead (lunch + admin + charting)" value={nlOverhead} min={10} max={35} step={1} onChange={setNlOverhead} suffix="%" color={C.accent} info={<Info id="nlo" pop={pop} setPop={setPop} text="Non-clinical share of paid hours: lunch + admin + charting bundled. ~22% mirrors the MD's 1.5h block on a 6.5h clinical day. Lower it as documentation gets automated." />} hint="≈22% mirrors the MD's block." />
              <Slider label="Reserve held open (urgent + access, load-bearing)" value={nlReserve} min={0} max={40} step={1} onChange={setNlReserve} suffix="%" color={C.accent} info={<Info id="nlr" pop={pop} setPop={setPop} text="Capacity this NP holds open — and because she's flexible, it doubles as the clinic's urgent backstop: she can see urgent visits for ANY member, not just her own panel. Higher = smaller own panel but better clinic-wide access, letting the MD run a tighter reserve and a bigger scheduled panel. This is the single reserve (urgent + routine access combined), same idea as the MD's booking promise." />} hint={`≈ ${n0(nl.clinicUrgentHrs)} urgent hrs/yr available to the whole clinic.`} />
            </Section>
            <Section kicker="Comparison" title="vs salaried MD on longevity" subtitle="Hourly economics for membership care">
              <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.line}` }}><span>Longevity NP gross margin</span><b style={{ fontFamily: mono, color: nl.gm >= 0.6 ? C.green : C.amber }}>{pct(nl.gm * 100)}</b></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.line}` }}><span>Core MD gross margin</span><b style={{ fontFamily: mono, color: m.gm >= 0.7 ? C.green : C.red }}>{pct(m.gm * 100)}</b></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}><span>Rev / worked hr</span><b style={{ fontFamily: mono, color: C.ink }}>{usd(nl.revPerHr)}</b></div>
              </div>
              <p style={{ fontSize: 12, color: C.faint, marginTop: 12, marginBottom: 0, lineHeight: 1.5 }}>A part-time longevity NP at $90/hr carrying overflow members can lift blended margin and double as the clinic's urgent backstop — letting the MD run a tighter reserve and a bigger scheduled panel.</p>
            </Section>
          </div>

          <Section kicker="Unit economics" title="Gross margin" subtitle="GM = (revenue − NP comp − other COGS) ÷ revenue · comp is the only labor cost (charting is on the clock)">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 16, alignItems: "start" }}>
              <div>
                <Slider label="NP pay rate" value={nlPay} min={70} max={120} step={5} onChange={setNlPay} suffix=" /hr" color={C.accent} info={<Info id="nlgmpay" pop={pop} setPop={setPop} text="Hourly pay for the membership NP — the only labor cost in the margin. Pure variable cost, no salary floor, which is why a part-time hourly NP holds high margin even at a modest panel." />} hint={`${usdk(nl.comp)}/yr at ${nlHrs}h/wk`} />
                <Slider label="Target gross margin" value={targetGM} min={40} max={85} step={1} onChange={setTargetGM} suffix="%" color={C.green} info={<Info id="nltgm" pop={pop} setPop={setPop} text="The gross margin you're aiming for (shared clinic target). The model shows the highest hourly rate you could pay this NP and still hit it on her capacity-bound revenue." />} />
                <Slider label="Other COGS (labs/supplies/software)" value={otherCOGS} min={0} max={25} step={1} onChange={setOtherCOGS} suffix="%" info={<Info id="nlcogs" pop={pop} setPop={setPop} text="Non-labor cost of goods as a % of revenue: labs, supplies, software, per-patient consumables. Shared with the Core tab." />} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Stat label="Current gross margin" value={pct(nl.gm * 100)} accent={nl.gm >= targetGM / 100 ? C.green : C.amber} sub={`${usd(nl.rev)} − ${usd(nl.comp)} comp − ${usd(nl.cogsDollar)} COGS`} />
                <Stat label="Gross profit" value={usdk(Math.max(0, nl.grossProfit))} accent={C.ink} sub={`${usd(nl.revPerHr)}/worked hr revenue`} />
                <Stat label="Max pay rate at target" value={nl.maxPayAtTarget > 0 ? "$" + n0(nl.maxPayAtTarget) : "—"} unit="/hr" accent={C.gold} sub={nl.maxPayAtTarget >= nlPay ? `$${n0(nl.maxPayAtTarget - nlPay)}/hr headroom` : `over by $${n0(nlPay - nl.maxPayAtTarget)}/hr`} />
              </div>
            </div>
          </Section>
        </>)}

        <p style={{ fontSize: 11.5, color: C.faint, marginTop: 16, lineHeight: 1.5 }}>
          Logic: clinical time = worked − admin block; documentation lives only inside the block; capacity is the lesser of the clinical-limited and charting-limited panel and is always solved at maximum. The held-open reserve (one combined slider) covers urgent visits and routine-access slack — no separate urgent reserve. When charting binds, clinical-time levers don't change capacity (shown in the banner). Replace assumptions with Acuity-derived values to finalize.
        </p>
      </div>
    </div>
  );
}
