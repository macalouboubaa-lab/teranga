import { useState, useEffect, useRef } from "react"

// ═══════════════════════════════════════════════
// TERANGA — Kit de Templates Complet
// Copie chaque composant dans ton projet Next.js
// ═══════════════════════════════════════════════

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

// ═══════════════════════════════════════════════
// PAGE 1 — LANDING PAGE
// ═══════════════════════════════════════════════
function LandingPage() {
  const [email, setEmail] = useState("")
  const [joined, setJoined] = useState(false)

  return (
    <div>
      {/* HERO */}
      <div className="hero">
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span className="badge badge-green">🟢 Bêta Dakar</span>
            <span style={{ fontSize: "0.78rem", color: G.muted }}>Lancement en 2025</span>
          </div>
          <h1 className="hero-title">
            Votre course,<br />
            <span className="hero-green">votre prix,</span><br />
            votre chauffeur.
          </h1>
          <p className="hero-sub">
            TERANGA connecte les Dakarois à des chauffeurs de confiance. Paiement Wave ou Orange Money, prix transparents au km.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-lg">🚗 Commander une course</button>
            <button className="btn btn-secondary btn-lg">Devenir chauffeur</button>
          </div>
          <div style={{ display: "flex", gap: 24, marginTop: 28, flexWrap: "wrap" }}>
            {[["500+", "Chauffeurs actifs"], ["4.8★", "Note moyenne"], ["1 min", "Temps d'attente moyen"]].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.4rem", color: G.green }}>{v}</div>
                <div style={{ fontSize: "0.75rem", color: G.muted, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAP PREVIEW */}
      <div className="section">
        <MapMock showRoute={true} />

        {/* FEATURES */}
        <div className="grid-3" style={{ marginTop: "1.5rem" }}>
          {[
            { icon: "🌊", title: "Wave & Orange Money", desc: "Payez avec votre mobile, sans carte bancaire" },
            { icon: "📍", title: "Prix transparent", desc: "500 FCFA + 350 FCFA/km, calculé avant la course" },
            { icon: "⭐", title: "Chauffeurs vérifiés", desc: "Chaque chauffeur est noté et évalué par la communauté" },
            { icon: "🗣️", title: "Interface en wolof", desc: "Application disponible en français et en wolof" },
            { icon: "⚡", title: "Temps réel", desc: "Suivez votre chauffeur en direct sur la carte" },
            { icon: "🔒", title: "Sécurisé", desc: "Vos données protégées, vos courses assurées" },
          ].map(f => (
            <div key={f.title} className="card" style={{ cursor: "default" }}>
              <div style={{ fontSize: "1.6rem", marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: "0.92rem", marginBottom: 6, color: G.text }}>{f.title}</div>
              <div style={{ fontSize: "0.8rem", color: G.muted, lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA EMAIL */}
        <div style={{ marginTop: "2rem", background: "linear-gradient(135deg, rgba(0,194,100,0.08), rgba(0,146,73,0.04))", border: `1px solid rgba(0,194,100,0.2)`, borderRadius: 20, padding: "2rem", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "1.4rem", marginBottom: 8 }}>Rejoindre la liste d'attente</h2>
          <p style={{ color: G.muted, fontSize: "0.88rem", marginBottom: 20 }}>Soyez parmi les premiers à essayer TERANGA à Dakar</p>
          {joined ? (
            <div style={{ color: G.green, fontWeight: 700, fontSize: "1rem" }}>✅ Merci ! Vous êtes sur la liste.</div>
          ) : (
            <div style={{ display: "flex", gap: 10, maxWidth: 400, margin: "0 auto" }}>
              <input className="trg-input" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ flex: 1 }} />
              <button className="btn btn-primary" onClick={() => email && setJoined(true)}>Rejoindre</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════
// PAGE 2 — INTERFACE CLIENT
// ═══════════════════════════════════════════════
function ClientPage() {
  const [pickup, setPickup] = useState("")
  const [dropoff, setDropoff] = useState("")
  const [payMethod, setPayMethod] = useState("wave")
  const [step, setStep] = useState("idle")
  const [rideStep, setRideStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const price = dropoff ? 3500 : null

  const request = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep("tracking"); }, 1800)
  }

  return (
    <div>
      {/* MAP */}
      <div style={{ padding: "1rem 1.5rem 0" }}>
        <MapMock showRoute={step === "tracking"} />
      </div>

      <div className="section" style={{ paddingTop: "1rem" }}>
        {step === "idle" && (
          <div className="card fade-up">
            <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              🚗 Commander une course
            </div>

            {/* SEARCH INPUTS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              <div>
                <label className="trg-label">📍 Point de départ</label>
                <input className="trg-input" placeholder="Ex: Plateau, Avenue Pompidou" value={pickup} onChange={e => setPickup(e.target.value)} />
              </div>
              <div>
                <label className="trg-label">🎯 Destination</label>
                <input className="trg-input" placeholder="Ex: Almadies, VDN" value={dropoff} onChange={e => { setDropoff(e.target.value); setStep(e.target.value ? "confirm" : "idle") }} />
              </div>
            </div>

            {/* SUGGESTIONS RAPIDES */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              {["Aéroport AIBD", "Almadies", "Yoff", "Sacré-Cœur", "Medina"].map(p => (
                <button key={p} className="btn btn-secondary" style={{ padding: "5px 12px", fontSize: "0.76rem", borderRadius: 20 }}
                  onClick={() => { setDropoff(p); setStep("confirm") }}>
                  {p}
                </button>
              ))}
            </div>

            {/* CHAUFFEURS PROCHES */}
            <div style={{ fontSize: "0.78rem", color: G.muted, display: "flex", alignItems: "center", gap: 6 }}>
              <span className="badge badge-green">● 3 chauffeurs proches</span>
              <span>~2 min d'attente</span>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="card fade-up">
            <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 16 }}>Confirmer votre course</div>

            <div style={{ background: G.dark3, borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem", marginBottom: 6 }}>
                <span style={{ color: G.muted }}>📍 Départ</span>
                <span style={{ fontWeight: 600 }}>{pickup || "Position actuelle"}</span>
              </div>
              <div style={{ height: 1, background: G.border, margin: "8px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem" }}>
                <span style={{ color: G.muted }}>🎯 Arrivée</span>
                <span style={{ fontWeight: 600 }}>{dropoff}</span>
              </div>
            </div>

            {/* PRIX */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: G.muted }}>Prix estimé</div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "1.8rem", fontWeight: 700, color: G.green }}>3 500 FCFA</div>
                <div style={{ fontSize: "0.72rem", color: G.muted }}>~8 km · ~18 min</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.75rem", color: G.muted }}>Chauffeur estimé</div>
                <div style={{ fontWeight: 700, marginTop: 4 }}>Mamadou D.</div>
                <div style={{ color: G.gold, fontSize: "0.8rem" }}>★ 4.9</div>
              </div>
            </div>

            {/* PAIEMENT */}
            <div style={{ marginBottom: 16 }}>
              <label className="trg-label" style={{ marginBottom: 8 }}>Mode de paiement</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { id: "wave", icon: "🌊", name: "Wave", desc: "Paiement mobile instantané" },
                  { id: "orange", icon: "🟠", name: "Orange Money", desc: "Paiement sécurisé OM" },
                  { id: "cash", icon: "💵", name: "Cash", desc: "Payer le chauffeur en espèces" },
                ].map(m => (
                  <div key={m.id} className={`pay-method ${payMethod === m.id ? "selected" : ""}`} onClick={() => setPayMethod(m.id)}>
                    <span className="pay-icon">{m.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div className="pay-name">{m.name}</div>
                      <div className="pay-desc">{m.desc}</div>
                    </div>
                    {payMethod === m.id && <span style={{ color: G.green, fontWeight: 700 }}>✓</span>}
                  </div>
                ))}
              </div>
            </div>

            <button className="btn btn-primary btn-full btn-lg" onClick={request} disabled={loading}>
              {loading ? "⏳ Recherche d'un chauffeur..." : "Commander maintenant 🚗"}
            </button>
          </div>
        )}

        {step === "tracking" && (
          <div className="card fade-up">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: "1rem" }}>Course en cours</div>
              <span className="badge badge-green">● En route</span>
            </div>

            <StatusBar step={rideStep} />

            {/* DRIVER INFO */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", background: G.dark3, borderRadius: 12, marginBottom: 16 }}>
              <div className="driver-avatar">M</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>Mamadou Diallo</div>
                <div style={{ fontSize: "0.75rem", color: G.muted }}>DK 4821 AB · Toyota Corolla Blanc</div>
                <div style={{ color: G.gold, fontSize: "0.78rem", marginTop: 2 }}>★ 4.9 · 312 courses</div>
              </div>
              <button className="btn btn-secondary" style={{ padding: "8px 14px", fontSize: "0.8rem" }}>📞</button>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary" style={{ flex: 1, fontSize: "0.82rem" }} onClick={() => setRideStep(Math.min(rideStep + 1, 3))}>
                Étape suivante (démo)
              </button>
              <button className="btn btn-danger" onClick={() => { setStep("idle"); setDropoff(""); setRideStep(1) }}>
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* NEARBY DRIVERS */}
        {step === "idle" && (
          <div style={{ marginTop: "1rem" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: G.muted, marginBottom: 10, letterSpacing: "0.5px", textTransform: "uppercase" }}>
              Chauffeurs disponibles
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {DEMO_DRIVERS.map(d => (
                <div key={d.id} className="driver-card">
                  <div className="driver-avatar">{d.name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div className="driver-name">{d.name}</div>
                    <div className="driver-meta">{d.plate} · {d.rides} courses</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: G.gold, fontWeight: 700, fontSize: "0.88rem" }}>★ {d.rating}</div>
                    <div style={{ fontSize: "0.72rem", color: G.muted, marginTop: 2 }}>~2 min</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════
// PAGE 3 — DASHBOARD CHAUFFEUR
// ═══════════════════════════════════════════════
function DriverPage() {
  const [isOnline, setIsOnline] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [timer, setTimer] = useState(30)
  const [tab, setTab] = useState("home")
  const timerRef = useRef(null)

  const goOnline = (v) => {
    setIsOnline(v)
    if (v) {
      setTimeout(() => {
        setShowNotif(true)
        setTimer(30)
        timerRef.current = setInterval(() => {
          setTimer(t => { if (t <= 1) { clearInterval(timerRef.current); setShowNotif(false); return 30 } return t - 1 })
        }, 1000)
      }, 1500)
    } else {
      setShowNotif(false)
      clearInterval(timerRef.current)
    }
  }

  return (
    <div>
      {/* HEADER */}
      <div style={{ background: G.dark2, borderBottom: `1px solid ${G.border}`, padding: "12px 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Bonjour Mamadou 👋</div>
          <div style={{ fontSize: "0.75rem", color: G.muted }}>Jeudi 16 Juillet 2026</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className={`badge ${isOnline ? "badge-green" : "badge-red"}`}>{isOnline ? "● EN LIGNE" : "● HORS LIGNE"}</span>
        </div>
      </div>

      {/* TABS */}
      <div style={{ padding: "0 1.5rem", background: G.dark2 }}>
        <div className="tabs">
          {[["home", "🏠 Accueil"], ["earnings", "💰 Revenus"], ["history", "📋 Courses"]].map(([id, label]) => (
            <button key={id} className={`tab-btn ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>
      </div>

      <div className="section" style={{ paddingTop: "1rem" }}>

        {tab === "home" && (
          <>
            {/* TOGGLE ONLINE */}
            <div className="card" style={{ textAlign: "center", padding: "1.5rem", marginBottom: "1rem", background: isOnline ? "rgba(0,194,100,0.06)" : G.dark2, borderColor: isOnline ? "rgba(0,194,100,0.3)" : G.border }}>
              <div style={{ marginBottom: 16, fontSize: "0.85rem", color: G.muted }}>
                {isOnline ? "🟢 Vous recevez des demandes de course" : "Passez en ligne pour recevoir des courses"}
              </div>
              <button
                className={`btn btn-lg ${isOnline ? "btn-danger" : "btn-primary"}`}
                style={{ minWidth: 180, fontSize: "1rem" }}
                onClick={() => goOnline(!isOnline)}
              >
                {isOnline ? "⚫ Passer hors ligne" : "🟢 Passer en ligne"}
              </button>
              {isOnline && (
                <div style={{ marginTop: 12, fontSize: "0.78rem", color: G.muted }}>
                  En attente d'une course...
                </div>
              )}
            </div>

            {/* STATS */}
            <div className="grid-2" style={{ marginBottom: "1rem" }}>
              {DEMO_STATS.slice(0, 4).map(s => (
                <div key={s.label} className="stat-card">
                  <div style={{ fontSize: "1.4rem" }}>{s.icon}</div>
                  <div className="stat-value">{s.value}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div className="stat-label">{s.label}</div>
                    {s.trend && <div className={`stat-trend ${s.trend.startsWith("+") ? "up" : "neutral"}`}>{s.trend}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* MAP */}
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.78rem", color: G.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700 }}>Zone d'activité</div>
              <MapMock />
            </div>
          </>
        )}

        {tab === "earnings" && (
          <>
            <div className="card" style={{ marginBottom: "1rem", textAlign: "center", padding: "1.5rem" }}>
              <div style={{ fontSize: "0.8rem", color: G.muted, marginBottom: 4 }}>Revenus ce mois</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "2.5rem", fontWeight: 800, color: G.green }}>287 500 FCFA</div>
              <div style={{ fontSize: "0.78rem", color: G.muted }}>après commission TERANGA (18%)</div>
            </div>
            <div className="grid-3" style={{ marginBottom: "1rem" }}>
              {[["Ce mois", "287 500"], ["Semaine", "68 000"], ["Aujourd'hui", "47 500"]].map(([l, v]) => (
                <div key={l} className="stat-card" style={{ textAlign: "center" }}>
                  <div className="stat-label">{l}</div>
                  <div className="stat-value" style={{ fontSize: "1.1rem" }}>{v} F</div>
                </div>
              ))}
            </div>
            {/* BARRE GRAPHIQUE SIMPLE */}
            <div className="card">
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: G.muted, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>7 derniers jours</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
                {[45, 72, 38, 85, 60, 90, 68].map((h, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: "100%", height: `${h}%`, borderRadius: "6px 6px 0 0", background: i === 6 ? G.green : "rgba(0,194,100,0.25)", transition: "height 0.5s" }} />
                    <div style={{ fontSize: "0.62rem", color: G.muted }}>{"LMMJVSd"[i]}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "history" && (
          <div className="card">
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: G.muted, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>Dernières courses</div>
            {DEMO_RIDES.map(r => (
              <div key={r.id} className="ride-row">
                <div>
                  <div className="ride-route">{r.from} → {r.to}</div>
                  <div className="ride-meta">{r.date} · {r.driver}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="ride-price">{r.status === "cancelled" ? "—" : `${r.price.toLocaleString("fr")} F`}</div>
                  <span className={`badge ${r.status === "completed" ? "badge-green" : "badge-red"}`} style={{ marginTop: 4 }}>
                    {r.status === "completed" ? "Terminée" : "Annulée"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* NOTIFICATION COURSE */}
      {showNotif && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "1rem", background: "rgba(10,14,23,0.95)", borderTop: `2px solid ${G.green}`, zIndex: 999, backdropFilter: "blur(12px)" }}>
          <div className="fade-up">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: "1rem", color: G.green }}>🔔 Nouvelle course !</div>
                <div style={{ fontSize: "0.82rem", color: G.muted, marginTop: 2 }}>Plateau → Almadies · ~8 km</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "1.4rem", fontWeight: 800, color: G.green }}>3 500 F</div>
                <div style={{ fontSize: "0.75rem", color: timer < 10 ? G.red : G.gold, fontWeight: 700 }}>{timer}s restant</div>
              </div>
            </div>
            <div style={{ height: 3, background: G.dark4, borderRadius: 4, marginBottom: 12 }}>
              <div style={{ height: "100%", width: `${(timer / 30) * 100}%`, background: timer < 10 ? G.red : G.green, borderRadius: 4, transition: "width 1s linear, background 0.3s" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button className="btn btn-secondary btn-full" onClick={() => { setShowNotif(false); clearInterval(timerRef.current) }}>❌ Refuser</button>
              <button className="btn btn-primary btn-full" onClick={() => { setShowNotif(false); clearInterval(timerRef.current) }}>✅ Accepter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

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

// ═══════════════════════════════════════════════
// APP PRINCIPALE
// ═══════════════════════════════════════════════
export default function TerangaTemplates() {
  const [page, setPage] = useState("landing")

  const pages = [
    { id: "landing", label: "🏠 Landing" },
    { id: "client", label: "📱 Client" },
    { id: "driver", label: "🚗 Chauffeur" },
    { id: "auth", label: "🔐 Auth" },
    { id: "code", label: "📋 Code" },
  ]

  return (
    <>
      <style>{CSS}</style>
      <div className="trg-root">
        <nav className="trg-nav">
          <div className="trg-logo">🚗 TERANGA</div>
          <div className="trg-nav-tabs">
            {pages.map(p => (
              <button key={p.id} className={`trg-tab ${page === p.id ? "active" : ""}`} onClick={() => setPage(p.id)}>
                {p.label}
              </button>
            ))}
          </div>
        </nav>

        <div>
          {page === "landing" && <LandingPage />}
          {page === "client" && <ClientPage />}
          {page === "driver" && <DriverPage />}
          {page === "auth" && <AuthPage />}
          {page === "code" && <CodePage />}
        </div>
      </div>
    </>
  )
}
