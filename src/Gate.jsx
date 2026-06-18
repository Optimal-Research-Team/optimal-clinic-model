import React, { useState, useEffect, useRef } from "react";
import { GATE_HASH } from "./gate.config.js";

const sans =
  "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const mono =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const TEAL = "#2DD4BF"; // brightened accent for dark ground
const GOLD = "#E8C45C";

async function sha256Hex(str) {
  const data = new TextEncoder().encode(str);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function Gate({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("idle"); // idle | checking | error
  const [leaving, setLeaving] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = async (e) => {
    e?.preventDefault();
    if (status === "checking" || !value) return;
    setStatus("checking");
    const ok =
      crypto?.subtle && GATE_HASH
        ? (await sha256Hex(value)) === GATE_HASH.toLowerCase()
        : false;
    if (ok) {
      setLeaving(true);
      setTimeout(() => setUnlocked(true), 480);
    } else {
      setStatus("error");
      setValue("");
      inputRef.current?.focus();
    }
  };

  if (unlocked) return children;

  return (
    <div style={S.root(leaving)}>
      <style>{KEYFRAMES}</style>
      <div style={S.glowA} />
      <div style={S.glowB} />
      <div style={S.grid} />

      <div style={S.card(status === "error")}>
        <div style={S.mark}>
          <LockMark />
        </div>

        <div style={S.kicker}>OPTIMAL · CONFIDENTIAL</div>
        <h1 style={S.title}>Clinic Staffing &amp; Capacity Model</h1>
        <p style={S.sub}>
          This workspace contains internal financials. Enter the access password to
          continue.
        </p>

        <form onSubmit={submit} style={{ marginTop: 22 }}>
          <div style={S.field(status)}>
            <span style={S.fieldIcon}>
              <KeyIcon />
            </span>
            <input
              ref={inputRef}
              type="password"
              value={value}
              autoComplete="off"
              spellCheck={false}
              placeholder="Access password"
              onChange={(e) => {
                setValue(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              style={S.input}
            />
          </div>

          <div style={S.statusRow}>
            {status === "error" ? (
              <span style={{ color: "#F87171" }}>
                Incorrect password — try again.
              </span>
            ) : (
              <span style={{ color: "rgba(255,255,255,.34)" }}>
                Access is restricted to authorized members.
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={status === "checking" || !value}
            style={S.button(status === "checking" || !value)}
          >
            {status === "checking" ? (
              <>
                <Spinner /> Verifying…
              </>
            ) : (
              <>Unlock workspace</>
            )}
          </button>
        </form>

        <div style={S.footer}>
          <span style={S.dot} /> Optimal Research Team · {new Date().getFullYear()}
        </div>
      </div>

      <p style={S.fineprint}>
        Soft access gate. For audited or per-user access, deploy behind edge
        authentication.
      </p>
    </div>
  );
}

/* ---------- glyphs ---------- */
function LockMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.4" stroke={TEAL} strokeWidth="1.6" />
      <path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9" stroke={TEAL} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="15.2" r="1.5" fill={GOLD} />
      <path d="M12 16.4v2.1" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function KeyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="8" cy="8" r="4.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11l7 7m-3-1l2-2m-4-1l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Spinner() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" style={{ animation: "spin 0.7s linear infinite" }}>
      <circle cx="12" cy="12" r="9" stroke="rgba(0,0,0,.25)" strokeWidth="3" fill="none" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="#06231f" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* ---------- styles ---------- */
const S = {
  root: (leaving) => ({
    position: "fixed",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#070B0E",
    fontFamily: sans,
    overflow: "hidden",
    padding: 24,
    opacity: leaving ? 0 : 1,
    transition: "opacity .45s ease",
    WebkitFontSmoothing: "antialiased",
  }),
  glowA: {
    position: "absolute",
    width: 620,
    height: 620,
    top: "-22%",
    left: "-12%",
    background: "radial-gradient(circle, rgba(45,212,191,.16), transparent 62%)",
    filter: "blur(20px)",
    pointerEvents: "none",
    animation: "drift 14s ease-in-out infinite alternate",
  },
  glowB: {
    position: "absolute",
    width: 560,
    height: 560,
    bottom: "-26%",
    right: "-14%",
    background: "radial-gradient(circle, rgba(232,196,92,.10), transparent 62%)",
    filter: "blur(20px)",
    pointerEvents: "none",
    animation: "drift 18s ease-in-out infinite alternate-reverse",
  },
  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.022) 1px, transparent 1px)",
    backgroundSize: "46px 46px",
    maskImage: "radial-gradient(circle at 50% 42%, #000 0%, transparent 72%)",
    WebkitMaskImage: "radial-gradient(circle at 50% 42%, #000 0%, transparent 72%)",
    pointerEvents: "none",
  },
  card: (err) => ({
    position: "relative",
    width: "100%",
    maxWidth: 416,
    background: "linear-gradient(180deg, rgba(22,28,33,.92), rgba(14,18,22,.92))",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 20,
    padding: "34px 34px 26px",
    boxShadow:
      "0 1px 0 rgba(255,255,255,.05) inset, 0 30px 80px -28px rgba(0,0,0,.85)",
    backdropFilter: "blur(12px)",
    animation: err ? "shake .42s cubic-bezier(.36,.07,.19,.97)" : "rise .6s cubic-bezier(.16,1,.3,1)",
  }),
  mark: {
    width: 52,
    height: 52,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(45,212,191,.08)",
    border: "1px solid rgba(45,212,191,.22)",
    boxShadow: "0 0 0 4px rgba(45,212,191,.04), 0 8px 24px -10px rgba(45,212,191,.4)",
  },
  kicker: {
    marginTop: 22,
    fontFamily: mono,
    fontSize: 10.5,
    letterSpacing: "0.22em",
    color: GOLD,
    fontWeight: 600,
  },
  title: {
    margin: "9px 0 0",
    fontSize: 22,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: "-0.01em",
    color: "#F4F6F7",
  },
  sub: {
    margin: "10px 0 0",
    fontSize: 13.5,
    lineHeight: 1.55,
    color: "rgba(255,255,255,.5)",
    maxWidth: 330,
  },
  field: (status) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(0,0,0,.28)",
    border: `1px solid ${
      status === "error" ? "rgba(248,113,113,.6)" : "rgba(255,255,255,.1)"
    }`,
    borderRadius: 12,
    padding: "0 14px",
    height: 50,
    transition: "border-color .2s ease, box-shadow .2s ease",
  }),
  fieldIcon: { color: "rgba(255,255,255,.32)", display: "flex" },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#F4F6F7",
    fontSize: 15,
    fontFamily: mono,
    letterSpacing: "0.04em",
    height: "100%",
  },
  statusRow: {
    minHeight: 18,
    marginTop: 9,
    fontSize: 12,
    lineHeight: 1.4,
  },
  button: (disabled) => ({
    width: "100%",
    marginTop: 16,
    height: 48,
    border: "none",
    borderRadius: 12,
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: sans,
    fontSize: 14.5,
    fontWeight: 650,
    color: "#06231f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    background: disabled
      ? "rgba(45,212,191,.28)"
      : "linear-gradient(180deg, #43E6D0, #21B7A6)",
    boxShadow: disabled
      ? "none"
      : "0 10px 26px -10px rgba(45,212,191,.7), 0 1px 0 rgba(255,255,255,.4) inset",
    opacity: disabled ? 0.7 : 1,
    transition: "transform .12s ease, box-shadow .2s ease, opacity .2s ease",
  }),
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTop: "1px solid rgba(255,255,255,.06)",
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontFamily: mono,
    fontSize: 11,
    color: "rgba(255,255,255,.34)",
    letterSpacing: "0.03em",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    background: TEAL,
    boxShadow: `0 0 8px ${TEAL}`,
  },
  fineprint: {
    position: "relative",
    marginTop: 22,
    fontSize: 11.5,
    color: "rgba(255,255,255,.26)",
    textAlign: "center",
    maxWidth: 360,
    lineHeight: 1.5,
  },
};

const KEYFRAMES = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes rise {
    from { opacity: 0; transform: translateY(14px) scale(.985); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes shake {
    10%, 90% { transform: translateX(-1px); }
    20%, 80% { transform: translateX(2px); }
    30%, 50%, 70% { transform: translateX(-5px); }
    40%, 60% { transform: translateX(5px); }
  }
  @keyframes drift {
    from { transform: translate(0,0); }
    to   { transform: translate(34px,28px); }
  }
  input::placeholder { color: rgba(255,255,255,.28); }
`;
