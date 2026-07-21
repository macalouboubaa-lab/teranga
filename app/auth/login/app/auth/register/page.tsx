import { useState, useEffect, useRef } from "react"

// ═══════════════════════════════════════════════
// TERANGA — Kit de Templates Complet
// Copie chaque composant dans ton projet Next.js
// ═══════════════════════════════════════════════
/*****************************************************************************/

/*****************************************************************************/
// ─── Données fictives pour la démo ───
const DEMO_DRIVERS = [
  { id: 1, name: "Mamadou Diallo", rating: 4.9, rides: 312, lat: 14.695, lng: -17.442, plate: "DK 4821 AB" },
  { id: 2, name: "Ibrahima Sow", rating: 4.7, rides: 187, lat: 14.701, lng: -17.449, plate: "DK 2033 CD" },
  { id: 3, name: "Ousmane Fall", rating: 4.8, rides: 254, lat: 14.688, lng: -17.437, plate: "DK 7714 EF" },
]
const DEMO_RIDES = [
  { id: 1, from: "Plateau", to: "Almadies", price: 3500, date: "Aujourd'hui 14h20", status: "completed", driver: "Mamadou D." },
  { id: 2, from: "Sacré-Cœur", to: "Yoff", price: 2000, date: "Hier 09h15", status: "completed", driver: "Ibrahima S." },
  { id: 3, from: "Medina", to: "Point E", price: 1500, date: "12 Jul", status: "cancelled", driver: "—" },
]
const DEMO_STATS = [
  { label: "Revenus aujourd'hui", value: "47 500 FCFA", icon: "💰", trend: "+12%" },
  { label: "Courses du jour", value: "8 courses", icon: "🛣️", trend: "+3" },
  { label: "Note moyenne", value: "4.9 ★", icon: "⭐", trend: "stable" },
  { label: "Km parcourus", value: "142 km", icon: "📍", trend: "" },
]
/*****************************************************************************//*****************************************************************************/

/*****************************************************************************/
// ─── Palette & Design tokens ───
const G = {
  green: "#00C264",
  greenDark: "#009249",
  greenGlow: "rgba(0,194,100,0.15)",
  gold: "#F5A623",
  dark: "#0A0E17",
  dark2: "#111827",
  dark3: "#1C2536",
  dark4: "#263044",
  border: "rgba(255,255,255,0.07)",
  text: "#F1F5F9",
  muted: "#64748B",
  red: "#EF4444",
}
/*****************************************************************************/
/*****************************************************************************/
// ─── CSS global injecté ───
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  .trg-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #0A0E17;
    color: #F1F5F9;
    min-height: 100vh;
  }

  /* NAV */
  .trg-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem; height: 60px;
    background: rgba(10,14,23,0.92);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    position: sticky; top: 0; z-index: 100;
    backdrop-filter: blur(12px);
  }
  .trg-logo { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 1.2rem; color: #00C264; letter-spacing: -0.5px; }
  .trg-nav-tabs { display: flex; gap: 4px; overflow-x: auto; }
  .trg-tab {
    padding: 6px 14px; border-radius: 8px; border: none; cursor: pointer;
    font-size: 0.82rem; font-weight: 500; font-family: 'Plus Jakarta Sans', sans-serif;
    color: #64748B; background: none; white-space: nowrap; transition: all 0.2s;
  }
  .trg-tab:hover { color: #F1F5F9; background: rgba(255,255,255,0.05); }
  .trg-tab.active { color: #00C264; background: rgba(0,194,100,0.1); }

  /* BTN */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 10px 20px; border-radius: 12px; font-weight: 600; font-size: 0.88rem;
    cursor: pointer; border: none; transition: all 0.18s; font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .btn-primary { background: #00C264; color: #000; }
  .btn-primary:hover { background: #00E573; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,194,100,0.35); }
  .btn-secondary { background: rgba(255,255,255,0.06); color: #F1F5F9; border: 1px solid rgba(255,255,255,0.1); }
  .btn-secondary:hover { background: rgba(255,255,255,0.1); }
  .btn-danger { background: rgba(239,68,68,0.12); color: #EF4444; border: 1px solid rgba(239,68,68,0.25); }
  .btn-lg { padding: 14px 28px; font-size: 1rem; border-radius: 14px; }
  .btn-full { width: 100%; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }

  /* CARD */
  .card {
    background: #111827; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px; padding: 1.25rem; transition: border-color 0.2s;
  }
  .card:hover { border-color: rgba(0,194,100,0.2); }

  /* INPUT */
  .trg-input {
    width: 100%; background: #1C2536; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px; padding: 12px 16px; color: #F1F5F9; font-size: 0.9rem;
    font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: border-color 0.2s;
  }
  .trg-input:focus { border-color: #00C264; box-shadow: 0 0 0 3px rgba(0,194,100,0.1); }
  .trg-input::placeholder { color: #64748B; }
  .trg-label { display: block; font-size: 0.8rem; font-weight: 600; color: #94A3B8; margin-bottom: 6px; letter-spacing: 0.3px; }

  /* BADGE */
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; }
  .badge-green { background: rgba(0,194,100,0.12); color: #00C264; border: 1px solid rgba(0,194,100,0.2); }
  .badge-red { background: rgba(239,68,68,0.12); color: #EF4444; border: 1px solid rgba(239,68,68,0.2); }
  .badge-gold { background: rgba(245,166,35,0.12); color: #F5A623; border: 1px solid rgba(245,166,35,0.2); }
  .badge-blue { background: rgba(99,179,237,0.12); color: #63B3ED; border: 1px solid rgba(99,179,237,0.2); }

  /* GRID */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }

  /* SECTION */
  .section { padding: 1.5rem; max-width: 900px; margin: 0 auto; }

  /* HERO */
  .hero {
    position: relative; overflow: hidden;
    background: linear-gradient(135deg, #0A0E17 0%, #0D1B2A 60%, #0A1F0F 100%);
    padding: 3rem 1.5rem 2rem;
  }
  .hero::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 50% at 80% 50%, rgba(0,194,100,0.08) 0%, transparent 70%);
  }
  .hero-title {
    font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: clamp(2rem, 5vw, 3.2rem);
    line-height: 1.1; color: #F1F5F9; position: relative;
  }
  .hero-green { color: #00C264; }
  .hero-sub { color: #64748B; font-size: 1rem; margin-top: 0.75rem; max-width: 420px; line-height: 1.6; position: relative; }

  /* MAP MOCK */
  .map-mock {
    position: relative; border-radius: 16px; overflow: hidden;
    background: #111827; border: 1px solid rgba(255,255,255,0.07);
    height: 260px;
  }
  .map-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(0,194,100,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,194,100,0.04) 1px, transparent 1px);
    background-size: 28px 28px;
  }
  .map-road-h { position: absolute; left: 0; right: 0; height: 2px; background: rgba(255,255,255,0.06); }
  .map-road-v { position: absolute; top: 0; bottom: 0; width: 2px; background: rgba(255,255,255,0.06); }
  .map-pin { position: absolute; transform: translate(-50%, -100%); font-size: 1.4rem; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5)); }
  .map-car { position: absolute; transform: translate(-50%, -50%); font-size: 1.2rem; }
  .map-pulse {
    position: absolute; width: 40px; height: 40px; border-radius: 50%;
    border: 2px solid #00C264; transform: translate(-50%, -50%);
    animation: pulse 2s ease-out infinite;
  }
  @keyframes pulse { 0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; } 100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; } }

  /* RIDE STATUS */
  .status-bar {
    display: flex; align-items: center; gap: 0; position: relative; margin: 1.5rem 0;
  }
  .status-step {
    flex: 1; display: flex; flex-direction: column; align-items: center; position: relative; z-index: 1;
  }
  .status-dot {
    width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 700; margin-bottom: 6px; position: relative; z-index: 2;
  }
  .status-dot.done { background: #00C264; color: #000; }
  .status-dot.active { background: #00C264; color: #000; box-shadow: 0 0 0 4px rgba(0,194,100,0.2); animation: statusPulse 1.5s ease-in-out infinite; }
  .status-dot.pending { background: #1C2536; color: #64748B; border: 1px solid rgba(255,255,255,0.1); }
  @keyframes statusPulse { 0%, 100% { box-shadow: 0 0 0 4px rgba(0,194,100,0.2); } 50% { box-shadow: 0 0 0 8px rgba(0,194,100,0.05); } }
  .status-label { font-size: 0.7rem; color: #64748B; text-align: center; font-weight: 500; }
  .status-label.active { color: #00C264; }
  .status-connector { position: absolute; top: 14px; left: 50%; right: -50%; height: 2px; background: #1C2536; z-index: 0; }
  .status-connector.done { background: #00C264; }

  /* TOGGLE */
  .toggle-wrap { display: flex; align-items: center; gap: 12px; cursor: pointer; }
  .toggle-track {
    width: 48px; height: 26px; border-radius: 13px; background: #1C2536;
    border: 1px solid rgba(255,255,255,0.1); position: relative; transition: all 0.25s;
  }
  .toggle-track.on { background: #00C264; border-color: #00C264; }
  .toggle-thumb {
    position: absolute; top: 3px; left: 3px; width: 18px; height: 18px;
    border-radius: 50%; background: #fff; transition: all 0.25s; box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  }
  .toggle-track.on .toggle-thumb { left: 25px; }

  /* STAT CARD */
  .stat-card {
    background: #111827; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px; padding: 1rem 1.25rem;
  }
  .stat-value { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700; color: #F1F5F9; margin: 4px 0; }
  .stat-label { font-size: 0.75rem; color: #64748B; font-weight: 500; }
  .stat-trend { font-size: 0.72rem; font-weight: 600; }
  .stat-trend.up { color: #00C264; }
  .stat-trend.neutral { color: #64748B; }

  /* DRIVER CARD */
  .driver-card {
    display: flex; align-items: center; gap: 12px; padding: 12px;
    background: #111827; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px; transition: all 0.2s; cursor: pointer;
  }
  .driver-card:hover { border-color: rgba(0,194,100,0.3); background: rgba(0,194,100,0.04); }
  .driver-avatar {
    width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #00C264, #007A3D);
    display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem; color: #000; flex-shrink: 0;
  }
  .driver-name { font-weight: 600; font-size: 0.9rem; color: #F1F5F9; }
  .driver-meta { font-size: 0.75rem; color: #64748B; margin-top: 2px; }

  /* NOTIFICATION */
  .notif {
    padding: 14px 16px; border-radius: 14px; border-left: 3px solid #00C264;
    background: rgba(0,194,100,0.06); animation: slideIn 0.3s ease;
  }
  .notif-title { font-weight: 600; font-size: 0.88rem; color: #F1F5F9; }
  .notif-body { font-size: 0.8rem; color: #64748B; margin-top: 3px; }
  @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }

  /* RIDE HISTORY */
  .ride-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .ride-row:last-child { border-bottom: none; }
  .ride-route { font-size: 0.88rem; font-weight: 600; color: #F1F5F9; }
  .ride-meta { font-size: 0.75rem; color: #64748B; margin-top: 2px; }
  .ride-price { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 0.95rem; color: #00C264; }

  /* PAYMENT METHODS */
  .pay-method {
    display: flex; align-items: center; gap: 10px; padding: 12px 14px;
    border-radius: 12px; border: 1.5px solid rgba(255,255,255,0.08);
    background: #1C2536; cursor: pointer; transition: all 0.2s;
  }
  .pay-method:hover { border-color: rgba(0,194,100,0.4); }
  .pay-method.selected { border-color: #00C264; background: rgba(0,194,100,0.06); }
  .pay-icon { font-size: 1.4rem; }
  .pay-name { font-weight: 600; font-size: 0.88rem; }
  .pay-desc { font-size: 0.72rem; color: #64748B; }

  /* TABS */
  .tabs { display: flex; gap: 0; border-bottom: 1px solid rgba(255,255,255,0.07); margin-bottom: 1.25rem; }
  .tab-btn {
    padding: 10px 18px; font-size: 0.84rem; font-weight: 600; cursor: pointer;
    border: none; background: none; color: #64748B; font-family: 'Plus Jakarta Sans', sans-serif;
    border-bottom: 2px solid transparent; transition: all 0.2s; margin-bottom: -1px;
  }
  .tab-btn.active { color: #00C264; border-bottom-color: #00C264; }
  .tab-btn:hover { color: #F1F5F9; }

  /* CODE BLOCK */
  .code-wrap { background: #0D1117; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; overflow: hidden; margin-top: 1rem; }
  .code-head { display: flex; align-items: center; justify-content: space-between; padding: 8px 14px; background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.06); }
  .code-path { font-size: 0.75rem; color: #64748B; font-family: monospace; }
  .code-copy { padding: 3px 10px; font-size: 0.72rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); background: none; color: #64748B; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
  .code-copy:hover { color: #00C264; border-color: rgba(0,194,100,0.4); }
  .code-body { padding: 1rem 1.25rem; font-family: monospace; font-size: 0.78rem; line-height: 1.8; color: #A8B5C8; overflow-x: auto; }
  .ck { color: #FF79C6; } .cs { color: #A8FF78; } .cf { color: #BD93F9; } .ct { color: #FFB86C; } .cc { color: #6272A4; font-style: italic; }

  /* ANIMATE */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fadeUp 0.4s ease forwards; }

  /* RESPONSIVE */
  @media (max-width: 600px) {
    .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
    .hero { padding: 2rem 1rem 1.5rem; }
    .section { padding: 1rem; }
  }
`
/*****************************************************************************/
/*****************************************************************************/
// ═══════════════════════════════════════════════
// COMPOSANTS RÉUTILISABLES
// ═══════════════════════════════════════════════

function Toggle({ label, value, onChange }) {
  return (
    <div className="toggle-wrap" onClick={() => onChange(!value)}>
      <div className={`toggle-track ${value ? "on" : ""}`}>
        <div className="toggle-thumb" />
      </div>
      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: value ? G.green : G.muted }}>{label}</span>
    </div>
  )
}

function StatusBar({ step }) {
  const steps = ["En attente", "Chauffeur trouvé", "En route", "Arrivé"]
  return (
    <div className="status-bar">
      {steps.map((s, i) => (
        <div key={i} className="status-step">
          {i < steps.length - 1 && <div className={`status-connector ${i < step ? "done" : ""}`} />}
          <div className={`status-dot ${i < step ? "done" : i === step ? "active" : "pending"}`}>
            {i < step ? "✓" : i + 1}
          </div>
          <div className={`status-label ${i === step ? "active" : ""}`}>{s}</div>
        </div>
      ))}
    </div>
  )
}

function MapMock({ showRoute = false }) {
  return (
    <div className="map-mock">
      <div className="map-grid" />
      <div className="map-road-h" style={{ top: "35%" }} />
      <div className="map-road-h" style={{ top: "60%" }} />
      <div className="map-road-h" style={{ top: "80%" }} />
      <div className="map-road-v" style={{ left: "30%" }} />
      <div className="map-road-v" style={{ left: "55%" }} />
      <div className="map-road-v" style={{ left: "75%" }} />
      {showRoute && (
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <path d="M 100 200 Q 180 140 280 120 Q 360 100 420 80" stroke="#00C264" strokeWidth="2.5" fill="none" strokeDasharray="6 4" opacity="0.8" />
        </svg>
      )}
      <div className="map-pulse" style={{ top: "75%", left: "28%" }} />
      <div className="map-pin" style={{ top: "75%", left: "28%" }}>📍</div>
      <div className="map-car" style={{ top: "48%", left: "52%" }}>🚗</div>
      <div className="map-car" style={{ top: "62%", left: "68%" }}>🚗</div>
      <div className="map-car" style={{ top: "38%", left: "40%" }}>🚗</div>
      {showRoute && <div className="map-pin" style={{ top: "35%", left: "83%" }}>🎯</div>}
      <div style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(10,14,23,0.85)", borderRadius: 8, padding: "4px 10px", fontSize: "0.72rem", color: G.muted }}>
        Mapbox Dark — Dakar
      </div>
    </div>
  )
}

function CodeBlock({ path, code }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="code-wrap">
      <div className="code-head">
        <span className="code-path">📁 {path}</span>
        <button className="code-copy" onClick={copy}>{copied ? "✓ Copié !" : "Copier"}</button>
      </div>
      <pre className="code-body">{code}</pre>
    </div>
  )
}
/*****************************************************************************/




/*****************************************************************************/


/*****************************************************************************/

/*****************************************************************************/

// ═══════════════════════════════════════════════
// PAGE 4 — AUTH (LOGIN / REGISTER)
// ═══════════════════════════════════════════════
function AuthPage() {
  const [mode, setMode] = useState("login")
  const [role, setRole] = useState("client")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({ email: "", password: "", name: "", phone: "" })

  const submit = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); setDone(true) }, 1500)
  }

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: "2.5rem", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, color: G.green }}>🚗 TERANGA</div>
          <div style={{ color: G.muted, fontSize: "0.88rem", marginTop: 6 }}>
            {mode === "login" ? "Connectez-vous à votre compte" : "Créer votre compte"}
          </div>
        </div>

        {done ? (
          <div className="card fade-up" style={{ textAlign: "center", padding: "2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>✅</div>
            <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 8 }}>{mode === "login" ? "Connexion réussie !" : "Compte créé !"}</div>
            <div style={{ color: G.muted, fontSize: "0.85rem" }}>Redirection vers votre espace...</div>
            <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => { setDone(false); setLoading(false) }}>Retour (démo)</button>
          </div>
        ) : (
          <div className="card fade-up">
            {/* MODE SWITCH */}
            <div style={{ display: "flex", background: G.dark3, borderRadius: 10, padding: 4, marginBottom: 20 }}>
              {[["login", "Connexion"], ["register", "Inscription"]].map(([m, l]) => (
                <button key={m} onClick={() => setMode(m)} style={{
                  flex: 1, padding: "8px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontWeight: 600, fontSize: "0.85rem", transition: "all 0.2s",
                  background: mode === m ? G.dark : "none",
                  color: mode === m ? G.text : G.muted,
                  boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.3)" : "none"
                }}>{l}</button>
              ))}
            </div>

            {/* ROLE SELECTOR (register only) */}
            {mode === "register" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                {[["client", "👤 Client"], ["driver", "🚗 Chauffeur"]].map(([r, l]) => (
                  <button key={r} onClick={() => setRole(r)} style={{
                    padding: "10px", borderRadius: 10, border: `1.5px solid ${role === r ? G.green : "rgba(255,255,255,0.08)"}`,
                    background: role === r ? "rgba(0,194,100,0.08)" : G.dark3,
                    color: role === r ? G.green : G.muted, fontWeight: 600, fontSize: "0.85rem",
                    cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "all 0.2s"
                  }}>{l}</button>
                ))}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {mode === "register" && (
                <>
                  <div>
                    <label className="trg-label">Nom complet</label>
                    <input className="trg-input" placeholder="Aminata Diallo" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="trg-label">Téléphone</label>
                    <input className="trg-input" placeholder="+221 77 000 00 00" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </>
              )}
              <div>
                <label className="trg-label">Email</label>
                <input className="trg-input" type="email" placeholder="votre@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="trg-label">Mot de passe</label>
                <input className="trg-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
            </div>

            {mode === "login" && (
              <div style={{ textAlign: "right", marginTop: 6 }}>
                <a style={{ fontSize: "0.78rem", color: G.green, cursor: "pointer" }}>Mot de passe oublié ?</a>
              </div>
            )}

            <button className="btn btn-primary btn-full btn-lg" style={{ marginTop: 20 }} onClick={submit} disabled={loading}>
              {loading ? "⏳ Chargement..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
            </button>

            <div style={{ textAlign: "center", marginTop: 16, fontSize: "0.82rem", color: G.muted }}>
              {mode === "login" ? "Pas encore de compte ? " : "Déjà un compte ? "}
              <span style={{ color: G.green, cursor: "pointer", fontWeight: 600 }} onClick={() => setMode(mode === "login" ? "register" : "login")}>
                {mode === "login" ? "S'inscrire" : "Se connecter"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


/*****************************************************************************/

/*****************************************************************************/


/*****************************************************************************/

/*****************************************************************************/

// ═══════════════════════════════════════════════
// PAGE 5 — CODE À COPIER
// ═══════════════════════════════════════════════
function CodePage() {
  return (
    <div className="section">
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "1.3rem", marginBottom: 6 }}>📋 Code à copier dans ton projet</h2>
        <p style={{ color: G.muted, fontSize: "0.85rem" }}>Copie ces fichiers directement dans ton projet Next.js TERANGA</p>
      </div>

      <CodeBlock path="lib/supabaseClient.ts" code={`import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)`} />

      <CodeBlock path="lib/pricing.ts" code={`export function calculatePrice(distanceKm: number): number {
  const BASE = 500       // Prise en charge (FCFA)
  const PER_KM = 350     // Tarif kilométrique
  const MIN = 1000       // Prix minimum

  const total = BASE + distanceKm * PER_KM
  // Arrondir au 50 FCFA le plus proche
  return Math.max(Math.round(total / 50) * 50, MIN)
}

export function formatFCFA(amount: number): string {
  return new Intl.NumberFormat("fr-SN", {
    style: "currency", currency: "XOF", minimumFractionDigits: 0
  }).format(amount)
}`} />

      <CodeBlock path="hooks/useRideStatus.ts" code={`import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export function useRideStatus(rideId: string) {
  const [status, setStatus] = useState("pending")
  const [driver, setDriver] = useState<any>(null)

  useEffect(() => {
    const channel = supabase
      .channel("ride-" + rideId)
      .on("postgres_changes", {
        event: "UPDATE", schema: "public",
        table: "rides", filter: \`id=eq.\${rideId}\`
      }, (payload) => {
        setStatus(payload.new.status)
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [rideId])

  return { status, driver }
}`} />

      <CodeBlock path=".env.local" code={`NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoiTON_TOKEN...`} />

      <div style={{ marginTop: "1.5rem", padding: "1rem 1.25rem", background: "rgba(0,194,100,0.06)", borderRadius: 12, border: "1px solid rgba(0,194,100,0.2)" }}>
        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: G.green, marginBottom: 6 }}>📦 Packages à installer</div>
        <pre style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "#A8B5C8", lineHeight: 2 }}>
{`npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install react-map-gl mapbox-gl @mapbox/mapbox-sdk
npm install @types/mapbox-gl --save-dev`}
        </pre>
      </div>
    </div>
  )
}


