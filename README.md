# Optimal Clinic — Staffing & Capacity Model

An interactive model for sizing clinician capacity, revenue, gross margin, and
scheduling for an NP-led longevity + women's-hormone clinic. Built as a single
React component with three provider scenarios (tabs).

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

It's a single self-contained component (`src/ClinicModel.jsx`) — no backend, no
data files, all state in-memory. Edit the component and the page hot-reloads.

## What it does

Three tabs, each solving capacity at **maximum sustainable load** for the current
slider settings:

1. **Core clinician (MD)** — salaried, carries both longevity members and the
   women's-hormone program. Capacity is limited by clinical (face) time. A master
   mix slider splits her bookable hours between the two programs; panel sizes,
   revenue, gross margin, and unpaid-overtime charting are all solved from it.
2. **Menopause NP** — hourly, women's-only, part-time. Adds a scheduling-continuity
   model because the foundation program has fixed-offset follow-ups (wk 6, wk 12)
   plus unpredictable PRN visits, so a thin roster loses effective capacity.
3. **Longevity NP** — hourly, membership-only, part-time. Hours spread across
   several days; its held-open reserve is load-bearing as a clinic-wide urgent
   backstop.

Every slider has a `?` button explaining what it does. See `CONTEXT.md` for the
full model logic and `ASSUMPTIONS.md` for every fixed assumption and which inputs
are placeholders awaiting real scheduling data.

## Live (⚠️ no access control)

**https://optimal-research-team.github.io/optimal-clinic-model-site/**

**Anyone with this URL can read the full model, including pricing, salary and margins.**
The SHA-256 password gate was removed on 2026-07-16 (autofill broke it — see PRD §7.9),
so the site is currently unprotected. `noindex` discourages search engines but does
nothing about a forwarded link.

Source lives here (private repo); the public `optimal-clinic-model-site` repo holds
only the compiled build that Pages serves — so the readable source and business
context stay private, but the compiled model does not.

To restrict it properly, put the site behind Cloudflare Access or Vercel Basic Auth —
both authenticate at the edge, before any asset is served. See **[PRD.md](PRD.md)** §10
for the options and **[DEPLOYMENT.md](DEPLOYMENT.md)** for how to update the live site.
