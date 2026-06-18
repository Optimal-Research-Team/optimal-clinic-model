# Deployment

The model is live, password-gated, behind a SHA-256 access gate.

| | |
|---|---|
| **Live URL** | https://optimal-research-team.github.io/optimal-clinic-model-site/ |
| **Access** | one shared password (shared out-of-band — never committed) |
| **Source repo** | `Optimal-Research-Team/optimal-clinic-model` (**private**) |
| **Host repo** | `Optimal-Research-Team/optimal-clinic-model-site` (**public**, dist only) |

## How the gate works

`src/Gate.jsx` wraps the model and renders a lock screen until the password is
entered. On submit it SHA-256-hashes the input (Web Crypto, `crypto.subtle`) and
compares it to `GATE_HASH` in `src/gate.config.js`. **Only the hash is ever in the
repo or the bundle — the plaintext password is not.** No `localStorage`/
`sessionStorage`, so a reload re-prompts (matches the repo's storage convention).

## Security level (read this)

This is a **soft gate** (CLAUDE.md "Option C", hardened form). It hides the rendered
UI from casual viewers and search engines (`noindex` + `robots disallow`). It does
**not** stop a determined person from downloading and reading the minified JS in the
public host repo, which contains the model's default numbers.

The host account is **GitHub Free**, where Pages only serves from public repos — so
the *human-readable source, CONTEXT.md and ASSUMPTIONS.md stay private*, and only the
compiled bundle is public. For **hard, bundle-level protection** (the bundle is never
served until you authenticate), move the site behind edge auth:

- **Vercel + Edge Middleware Basic Auth** — see CLAUDE.md "Option A". (Note: the
  Vercel CLI token on this machine is currently dead; connect the repo via the Vercel
  dashboard or refresh the token.)
- **Cloudflare Access** in front of Cloudflare Pages / any host — see "Option B".
  Real per-user identity + audit, nothing in the bundle.

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

## Rotate the password

```bash
node -e "console.log(require('crypto').createHash('sha256').update('NEW_PASSWORD').digest('hex'))"
# paste the hash into src/gate.config.js (GATE_HASH default), or set VITE_GATE_HASH at build,
# then rebuild + redeploy as above. Share the new plaintext out-of-band.
```
