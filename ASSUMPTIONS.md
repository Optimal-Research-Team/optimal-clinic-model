# Fixed Assumptions & Default Inputs

Everything the model holds constant, plus the default value of every slider. Items
marked **[PLACEHOLDER]** are estimates that should be replaced with real Acuity/EMR
data (see CONTEXT.md §7).

## Hard-coded constants
| Constant | Value | Notes |
|---|---|---|
| Clinic days / week | 4 | |
| Working weeks / year | 46 | ≈ 6 weeks off (vacation, CME, sick, stat) |
| Clinic day length | 8 hrs | |
| Lunch inside admin block | 0.5 hr/day | not chartable |
| AHE (annual exam) | 60 min | |
| Combined intake | 60 min | |
| Split intake | 30-min meet-&-greet + 60-min AHE = 90 min | |
| Foundation program | 60 + 30 + 30 min (wk 0, 6, 12) | $895 one-time |
| Ongoing care | 2×30 + 45 min = 105 min/yr | 3 visits/yr |
| Single (à la carte) visit | 30 min | $295 |
| Longevity price | $1,495/yr (slider 995–2500) | = $145/mo |
| Ongoing price (early / std) | $695 / $795 | early = within 1 wk of foundation |
| Renewal price | $795 | |
| Booking ceiling | 1-wk ⇒ 72% fill, 2-wk ⇒ 80% | bundles urgent + access reserve |

## Default slider values

### Core MD
| Input | Default | Range |
|---|---|---|
| Master mix (longevity %) | 75% | 0–100 |
| Worked hours / week | 29 | 29 / 32 |
| Daily admin block | 1.5 h | 1–3 |
| Admin + charting min/visit **[PLACEHOLDER]** | 12 | 4–25 |
| Booking promise | 1 week | 1 / 2 wk |
| Longevity follow-ups / hour | 2 (30 min) | 2 / 3 |
| Revenue / member / yr | $1,495 | 995–2500 |
| Visits / member / yr **[PLACEHOLDER]** | 8 | 4–14 |
| Annual churn **[PLACEHOLDER]** | 15% | 0–40 |
| Split-intake share | 50% | 0–100 |
| Actual panel (overtime check) | 120 | 0–300 |
| Program maturity | 100% | 0–100 |
| Foundation → ongoing **[PLACEHOLDER]** | 50% | 0–100 |
| Early-enroll share **[PLACEHOLDER]** | 60% | 0–100 |
| Non-converters → à la carte **[PLACEHOLDER]** | 30% | 0–100 |
| À la carte visits / yr **[PLACEHOLDER]** | 2 | 0–6 |
| Ongoing retention **[PLACEHOLDER]** | 3 yrs | 1–6 |
| Clinician salary | $132,000 | 80k–220k |
| Target gross margin | 70% | 40–85 |
| Other COGS | 8% | 0–25 |

### Menopause NP
| Input | Default | Range |
|---|---|---|
| Hours / week | 6 | 4–8 |
| Sessions / week | 1 | 1–3 |
| Fragmentation constant k **[PLACEHOLDER]** | 0.3 | 0.1–0.5 |
| PRN buffer | 12% | 0–25 |
| Pay rate | $75/hr | 75–100 |

### Longevity NP
| Input | Default | Range |
|---|---|---|
| Hours / week | 16 | 8–24 |
| Non-face overhead | 22% | 10–35 |
| Reserve (clinic urgent backstop) | 28% | 0–40 |
| Pay rate | $90/hr | 70–120 |

## Modeling conventions
- Steady-state unless the maturity slider is lowered.
- Revenue-per-clinical-hour comparisons use face time only.
- Salaried MD: charting overflow = unpaid overtime (capacity = face time).
- Hourly NPs: charting happens within paid hours (consumes billable time).
- Women's "total patients/yr" = new foundation starts + continuing ongoing patients
  (à la carte and drops are subsets of new starts, not added again).
