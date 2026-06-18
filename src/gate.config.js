// Access gate configuration.
//
// SECURITY NOTE: only the SHA-256 *hash* of the access password lives here — never
// the plaintext. The hash is safe to commit/ship in the bundle: a strong password
// cannot be recovered from its SHA-256 digest. The plaintext is shared out-of-band.
//
// A build can override the default by setting VITE_GATE_HASH (sha-256 hex) at build
// time. To rotate the password: pick a new one, compute its hash, and replace below
//   node -e "console.log(require('crypto').createHash('sha256').update('NEW_PW').digest('hex'))"
//
// This is a *soft* gate: it hides the rendered UI from casual viewers. The compiled
// model logic still ships in the JS bundle. For hard, bundle-level protection put the
// site behind edge auth (Vercel Basic Auth / Cloudflare Access) — see CLAUDE.md.

export const GATE_HASH =
  import.meta.env.VITE_GATE_HASH ||
  "0ba49b587df34112369053c3550e39cde3a287d913f460d8ba4b43077cf86c2c";
