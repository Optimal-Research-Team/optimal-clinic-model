# Model Context & Logic

This document gives an agent (or a new reader) enough context to understand and
extend the model without re-deriving it. It captures the business setup, the exact
math, the key design decisions, and the open calibration questions.

## 1. Business setup

- NP/MD-led clinic running two product lines:
  - **Longevity Membership Core** — annual membership, $1,495/yr (≈ $145/mo).
    Care = one 60-min annual health exam (AHE) + recurring follow-ups; assume
    ~8 visits/member/year on average. New members onboard via either a combined
    60-min intake OR a split 30-min meet-and-greet + separate 60-min AHE (90 min).
  - **Women's Hormone program**:
    - **Foundation** (3-month): visit 1 = 60 min, visit 2 (wk 6) = 30 min,
      visit 3 (wk 12) = 30 min. One-time $895.
    - **Ongoing care** (optional, annual): 2 × 30-min follow-ups + a 45-min annual
      visit = 105 min/yr. $695 if enrolled within 1 week of finishing foundation,
      else $795. Renewals modeled at $795.
    - **À la carte**: non-converters who return for individual visits at $295 (30 min).

- Current core clinician: ~29 worked hrs/week now, ramping to 32 (four 8-hr days).
  Carries ~120 longevity members + ~10–12 women's-hormone patients. ~85% schedule
  utilization, no dedicated urgent reserve (urgents backstopped by a remote clinician).
  Can do ~2–3 sixty-minute appointments per full clinic day.

- Inbound women's-hormone demand is ~20+/month and may grow — far above what one
  clinician can absorb at steady state, which is the core staffing tension.

- Strategic context: the clinic is the reference customer for an agentic clinic-OS
  product ("Blair") whose first wins are documentation/charting automation and
  intake/scheduling agents. The model is deliberately structured so the value of
  charting automation is visible (see §4).

## 2. The single most important structural decision

**Capacity is limited by clinical (face) time only. Documentation never caps the panel.**

The clinician's day is 8 hrs with a fixed 1.5 hr/day admin block (lunch + admin +
ALL charting). Clinical/face time = worked hours − admin block. Patients are booked
into clinical time. Charting happens inside the admin block; anything that does not
fit is absorbed as **unpaid overtime** by the clinician — it does NOT reduce the
panel or block a clinical slot.

Consequence: `documentation min/visit` affects ONLY the unpaid-overtime figure
(a wellbeing/retention cost). It has zero effect on capacity or revenue. This was a
corrected assumption late in development — earlier versions wrongly let charting
compete with clinical time. Do not reintroduce that.

Hourly NPs are different: they chart within their paid hours, so for the NP tabs
documentation DOES consume billable time (hours-per-patient includes charting).
This asymmetry between salaried-MD and hourly-NP is intentional and correct.

## 3. Core math (MD tab)

Constants: 4 clinic days/week, 46 working weeks/year, 0.5 hr/day lunch inside the
admin block.

```
faceWeek       = workedHrs − adminBlock × 4
faceFillable   = faceWeek × 46 × util        # util = schedulable fraction
chartAllowance = (adminBlock − 0.5) × 4 × 46 # chartable hrs/yr inside the block

# util ("booking promise"): 1-week access ⇒ 0.72, 2-week ⇒ 0.80.
# This single number bundles BOTH urgent-visit reserve AND routine-access slack.
# There is intentionally no separate "urgent reserve" — they were merged.

# Per-patient CLINICAL (face) hours
longFacePer = (60 + (visits−1)×fuMin + churn×split×30) / 60
  # fuMin = 60/followupsPerHour (30 min at 2/hr, 20 min at 3/hr)
  # split = share of new patients using the 90-min split intake; adds a 30-min visit
womFacePer  = (120 + maturity·conv·tenure·105 + (1−conv)·ala·nAla·30) / 60

# CAPACITY = face only
mix      = mixLong/100
maxLong  = faceFillable × mix       / longFacePer
F        = faceFillable × (1−mix)   / womFacePer   # F = new foundation starts/yr

revenue  = maxLong × priceLong + womensRevenue(F)

# Per-patient CHARTING hours (drive UNPAID OVERTIME only — not capacity)
longChartPer = visits × docMin / 60
womChartPer  = (3 + maturity·conv·tenure·3 + (1−conv)·ala·nAla) × docMin / 60
chartNeeded  = actualPanel × longChartPer        # at the real current panel
unpaidOT/wk  = max(0, chartNeeded − chartAllowance) / 46
```

### Women's funnel (drives revenue and counts)
```
conv = pOngoing/100; early = pEarly/100; ala = pAla/100; maturity ∈ [0,1]
newConverters = F·conv
earlyN = newConverters·early          # $695/yr first year
lateN  = newConverters·(1−early)      # $795/yr first year
alaN   = F·(1−conv)·ala               # à la carte, nAla × $295 each
dropN  = F·(1−conv)·(1−ala)
ongoingPool = newConverters · tenure · maturity   # active ongoing patients (steady state)
renewers    = max(0, ongoingPool − newConverters) # renew at $795
womensRevenue = F·895 + earlyN·695 + lateN·795 + renewers·795 + alaN·nAla·295
totalWomenPerYear = F + renewers      # new starts + continuing ongoing
```

### Near-term vs steady-state
The women's program is new, so the ongoing-care pool is nearly empty. The
`maturity` slider scales the accumulated ongoing load:
- **Near-term ramp** = solve F at maturity = 0 (each woman costs only foundation
  hours; the calendar isn't full of follow-ups yet). She can run hot for a quarter.
- **Steady-state sustainable** = solve F at maturity = 100 (years of ongoing care
  have stacked up). The real long-run ceiling.
The gap between them is the ramp runway and the countdown to needing a 2nd provider.

## 4. Why charting automation (Blair) shows up in the model

At ~12 min charting/visit in a 1.5 hr block, the clinician is doing modest unpaid
overtime; at realistic higher charting times it balloons. Automating charting drops
`docMin`, which drives `unpaidOT` to zero with NO change to capacity or revenue.
The value proposition is therefore **wellbeing/retention** (a clinician who isn't
doing hours of unpaid documentation), not raw throughput. This is the honest framing
the model is built to surface.

## 5. NP tabs

**Menopause NP (hourly, women's only):**
- `gross = hrs/week × 46`
- `continuity = max(0.4, 1 − k/sessions)` — fewer working days ⇒ harder to land the
  fixed wk-6/wk-12 follow-ups on time and to backfill no-shows. `k` is a tunable
  fragmentation constant (~0.3, calibrate to real fill).
- `ceiling = continuity × (1 − prnBuffer)` — PRN visits are unpredictable and need
  held-open slots.
- `F = gross × ceiling / womHrsFull` where `womHrsFull = womFacePer + womChartPer`
  (NP charts within paid hours).
- `gm = (revenue − hrs×pay − revenue×otherCOGS) / revenue`. Pay $75–100/hr.
- Key insight: two 3-hr days beat one 6-hr day by ~20% throughput (continuity).

**Longevity NP (hourly, membership only):**
- `gross = hrs/week × 46` (hrs 8–24, spread across several days)
- `faceFillable = gross × (1 − overhead%) × (1 − reserve%)`
  - overhead% = lunch + admin + charting bundled (~22% mirrors the MD's block)
  - reserve% = held-open capacity, load-bearing as a clinic-wide urgent backstop
- `panel = faceFillable / longFacePer`; revenue = panel × priceLong
- Pay $70–120/hr. Strategic role: absorb overflow members + serve clinic-wide
  urgents so the MD can run a tighter reserve and bigger scheduled panel.

## 6. Margin

`GM = (revenue − clinicianComp − revenue×otherCOGS) / revenue`. For the salaried MD,
a $132k salary against a ~$200–270k revenue ceiling lands GM well below the 70%
target — the model shows the revenue you'd need (~$600k, infeasible for one provider)
or the max comp affordable at target. This is the unit-economics case for hourly NP
staffing on the high-yield women's line.

## 7. Open calibration questions (replace guesses with real data)

The model is well-reasoned but several inputs are estimates. An anonymized Acuity /
EMR export would let you replace them with measured values:
- **Real charting minutes per visit** by type — the whole unpaid-overtime figure
  scales off this. Highest-leverage single number.
- **Schedulable utilization** (`util`) — derive from real booking-to-appointment
  lead times rather than the 0.72/0.80 assumption.
- **Visit-length distribution** by appointment type (vs assumed 60/30/20).
- **No-show / cancellation rate** (inflates "scheduled" above "delivered").
- **Real visits/member/year** for longevity (vs assumed 8).
- **Women's conversion / early-enroll / à-la-carte / retention** rates (vs 50/60/30/3yr).
- **Fragmentation constant `k`** for the menopause NP — back out from real fill vs
  sessions worked.

## 8. Version history (design decisions)

- v1: capacity-only model, fu/hr + admin sliders, access buffer.
- v2: real numbers; split face-time vs documentation; revenue per stream + per hour.
- v3: branched new-patient intake (combined 60 vs split 90); fixed-assumption subtitles.
- v4: master mix slider drives capacity-solved panels so revenue responds to all
  levers; access toggle; price slider; demand-vs-capacity + clinicians-needed; popups.
- v5: tabs (MD + menopause NP); program-maturity slider; near-term vs steady-state;
  hours breakdown; margin analysis; NP hourly economics.
- v6: total women's patients/yr + funnel breakdown; NP scheduling-continuity heuristic
  with cadence timeline.
- v7: CORRECTED time model — documentation moved inside the fixed admin block
  (dual constraint: face vs charting); explicit admin label; added longevity NP tab.
- v8: `?` on every slider; merged urgent reserve + access buffer into one reserve;
  removed the lunch sub-slider (fixed 0.5h); near-term/steady explainer; binding banner.
- v9 (current): CORRECTED again per clinic reality — capacity is FACE-ONLY;
  charting that overflows the admin block is UNPAID OVERTIME, not a capacity limit;
  `documentation min/visit` drives only the overtime figure; removed the
  "charting-blocked idle face" concept; overtime shown as a bar outside the paid week.
