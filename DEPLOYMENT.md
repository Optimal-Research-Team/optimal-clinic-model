# Deployment

The model is live with **no access control**.

| | |
|---|---|
| **Live URL** | https://optimal-research-team.github.io/optimal-clinic-model-site/ |
| **Access** | ⚠️ **none — anyone with the URL can read the full model** |
| **Source repo** | `Optimal-Research-Team/optimal-clinic-model` (**private**) |
| **Host repo** | `Optimal-Research-Team/optimal-clinic-model-site` (**public**, dist only) |

## Security level (read this)

The SHA-256 password gate was **removed on 2026-07-16**. It was rejected in use —
most likely because password managers and browser autofill set the input's value
without firing React's `onChange`, so the controlled component's state stayed empty
and submit silently bailed. (Implementation is recoverable from git history:
`src/Gate.jsx`, `src/gate.config.js`.)

**Today the live site is unprotected.** `noindex` + robots disallow discourage search
engines, but that is only a request and does nothing about a forwarded link. Pricing,
salary, panel sizes and margins are all readable by anyone who opens the URL.

The host account is **GitHub Free**, where Pages only serves from public repos — so
the *human-readable source, CONTEXT.md and ASSUMPTIONS.md stay private*, and only the
compiled bundle is public.

For **hard, bundle-level protection** (nothing is served until you authenticate),
move the site behind edge auth:

- **Cloudflare Access** in front of Cloudflare Pages / any host — see CLAUDE.md
  "Option B". Real per-user identity + audit log, nothing in the bundle. Strongest.
- **Vercel + Edge Middleware Basic Auth** — see "Option A", one shared password in an
  env var. (Note: the Vercel CLI token on this machine is currently dead; connect the
  repo via the Vercel dashboard or refresh the token.)

A client-side gate is **not** on this list for a reason: it hides the UI, never the
bundle. If it's wanted back anyway, fix the autofill binding first — read the value
via the native setter and listen for `input`, not just React's `onChange`.

## Why two repos

`optimal-clinic-model` (private) holds the source; GitHub Free can't publish Pages
from a private repo, so `optimal-clinic-model-site` (public) holds only the built
`dist/` and is what Pages serves.

## Update the live site

```bash
# in the source repo
export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$PATH"
npm run build

# copy the fresh build into the host repo and push
cp -R dist/. ../optimal-clinic-model-site/
cd ../optimal-clinic-model-site
cp -f /dev/null .nojekyll        # keep the .nojekyll marker
git add -A && git commit -m "Update build" && git push
```

GitHub Pages rebuilds automatically (~30–90s).

## Take the site down

If the model should stop being publicly readable right now, the fastest fix is to
unpublish Pages — this takes effect immediately and needs no rebuild:

```bash
gh api -X DELETE repos/Optimal-Research-Team/optimal-clinic-model-site/pages
```

The source repo is unaffected; `npm run dev` still runs the model locally.
