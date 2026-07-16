# CLAUDE.md — agent brief for this repo

You are working on an interactive staffing/capacity/revenue model for an NP/MD-led
longevity + women's-hormone clinic. Read `CONTEXT.md` first (full business setup and
exact math) and `ASSUMPTIONS.md` (every constant and default). This file is the
operating brief: what to preserve, how to work, and how to ship it as a
password-protected website.

## Run / build
```bash
npm install
npm run dev      # local dev (Vite)
npm run build    # production build -> dist/
npm run preview  # serve the production build
```
Single self-contained component: `src/ClinicModel.jsx`. No backend, all state in-memory.

## Repo map
- `src/ClinicModel.jsx` — the whole model (3 tabs, all sliders, all math)
- `src/Gate.jsx`, `src/gate.config.js` — password gate (SHA-256 hash only, never plaintext)
- `src/main.jsx`, `index.html` — entry
- `CONTEXT.md` — business context, math, decision history (READ FIRST)
- `ASSUMPTIONS.md` — constants, defaults, and which inputs are placeholders
- `PRD.md` — product requirements, key lessons, worked calculations, deploy posture
- `docs/images/` — PRD assets (real screenshots + capacity chart)
- `package.json`, `vite.config.js`

## Model invariants — DO NOT regress these
These are hard-won decisions from many iterations. Changing them silently will make
the model wrong. If a change requires touching one, call it out explicitly.

1. **Capacity = clinical (face) time only** for the salaried MD. Patients are booked
   into face time = worked hours − the daily admin block.
2. **Charting never caps the panel.** Documentation lives inside the fixed admin
   block; whatever overflows is **unpaid overtime** the clinician absorbs. Do NOT
   reintroduce charting as a capacity constraint (an earlier version did this; it was
   wrong).
3. **`docMin` (admin+charting min/visit) affects ONLY the unpaid-overtime figure** —
   never capacity or revenue. This is the lever an AI scribe moves; its payoff is
   wellbeing/retention, not throughput.
4. **One reserve, not two.** The booking-promise toggle (1-wk ⇒ 72% fill, 2-wk ⇒ 80%)
   bundles BOTH urgent reserve and routine-access slack. Do not re-add a separate
   urgent-reserve slider on the MD tab.
5. **Lunch is a fixed 0.5 h/day inside the admin block** (a constant, not a slider).
6. **Salaried vs hourly asymmetry is intentional:** the MD has a fixed admin block
   and unpaid-overtime overflow; hourly NPs chart within their paid hours, so for the
   NP tabs documentation consumes billable time. Keep this distinction.
7. **Every figure is solved at maximum sustainable capacity** for the current settings.
8. **Total women's patients/yr = new foundation starts + continuing ongoing patients.**
   À-la-carte and drops are subsets of new starts — never add them again.
9. **Every slider must keep its `?` explanation.** New sliders need one too.

## Placeholders awaiting real data (see CONTEXT.md §7)
`docMin`, `util`, visits/member/yr, churn, the women's conversion/early/à-la-carte/
retention rates, and the NP fragmentation constant `k` are estimates. If real Acuity/
EMR data is provided, wire it in and mark the value as measured (not assumed).

## Conventions
- Pure React, no router, inline styles + the small component kit already in the file
  (`Section`, `Slider`, `Toggle`, `Stat`, `Info`, etc.). Match the existing palette
  (`C`) and `mono`/`sans` fonts.
- Keep it a single component unless asked to split; if you split, preserve all state
  in one parent so the three tabs share women's assumptions.
- No `localStorage`/`sessionStorage` if this is ever embedded in a constrained host;
  plain React state is fine here.

---

## Ship it as a PASSWORD-PROTECTED website

The app is a static Vite SPA, so any static host works. Pick one of these by how much
real security you need. **Never hardcode the password in the source** (it ends up in
the JS bundle) — use a host-level gate or an env var read on the server/edge.

### Option A — Vercel + Edge Middleware HTTP Basic Auth (recommended; free, real-ish)
Password is checked at the edge before any asset is served, and lives in an env var,
not the bundle.

1. `npm i -D vercel` (or just connect the repo in the Vercel dashboard).
2. Add `middleware.ts` at the repo root:

```ts
import { next } from "@vercel/edge";

export const config = { matcher: "/((?!_next/static|favicon.ico).*)" };

export default function middleware(req: Request) {
  const auth = req.headers.get("authorization");
  const expected = "Basic " + btoa(`admin:${process.env.SITE_PASSWORD}`);
  if (auth !== expected) {
    return new Response("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Optimal Clinic Model"' },
    });
  }
  return next();
}
```

3. In Vercel project settings, add env var `SITE_PASSWORD` (set it yourself — do not
   commit it). Redeploy. The browser will prompt for user `admin` + that password.

> Note: a single shared password via Basic Auth is fine for an internal tool. It is
> NOT per-user identity. Use Option B if you need named access or audit.

### Option B — Cloudflare Access in front of any static host (strongest, no app code)
Real identity (email one-time-PIN or Google/Microsoft SSO), free for small teams, and
nothing leaks into the bundle.
1. Deploy the static `dist/` anywhere (Cloudflare Pages, Vercel, Netlify, S3).
2. Put the domain behind **Cloudflare Access**: create an Access application for the
   hostname, add a policy (e.g., "emails ending in @yourclinic.com" or a named list).
3. Visitors authenticate with Cloudflare's hosted login; no password lives in your code.
Use this if the financials warrant proper access control.

### Option C — client-side password gate (WEAK; avoid for sensitive financials)
A React gate that hides the app until a password is typed. The password is visible to
anyone who reads the JS bundle, so it only deters casual viewing. If you must:
- Store a SHA-256 hash of the password as a build-time env var (`VITE_GATE_HASH`),
  compare the hashed input in a wrapper component, render the model only on match.
- Be explicit in the UI that this is a soft gate, not security.
- Do not use this for anything you'd be unhappy to see leaked.

### Recommendation
Internal use, one shared password → **Option A**. Multiple named users or anything you
consider sensitive → **Option B**. Reach for **Option C** only for a throwaway demo.
Whichever you choose, the password/secret is set by the human in host settings or an
env var — never written into the repo.
