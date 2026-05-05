import { useState, useEffect } from "react";
import { showToast } from "./index";

const API = import.meta.env.VITE_API_URL || "";

const CONTACT_ICON: Record<string, string> = {
  call: "📞", whatsapp: "💬", sms: "✉️", telegram: "✈️", email: "📧",
};

function formatPhone(raw: string) {
  const digits = (raw || "").replace(/\D/g, "");
  if (digits.startsWith("0")) return "254" + digits.slice(1);
  if (digits.startsWith("254")) return digits;
  return "254" + digits;
}

function buildReplyLinks(b: any) {
  const phone = formatPhone(b.phone);
  const name = b.name || "there";
  const prop = b.property_title ? `"${b.property_title}"` : "your property of interest";
  const date = b.viewing_date ? ` on ${b.viewing_date}` : "";
  const msg = encodeURIComponent(
    `Hello ${name}, this is the Aeton Homes team. Thank you for booking a viewing for ${prop}${date}. We'd love to confirm the details — when are you available?`
  );
  return {
    call: `tel:+${phone}`,
    whatsapp: `https://wa.me/${phone}?text=${msg}`,
    sms: `sms:+${phone}?body=${msg}`,
    telegram: `tg://resolve?phone=${phone}`,
    email: b.email ? `mailto:${b.email}?subject=Viewing Booking — Aeton Homes&body=${encodeURIComponent(`Hello ${name},\n\nThank you for booking a viewing for ${prop}${date}.\n\nBest regards,\nAeton Homes Team`)}` : null,
  };
}

const STATUS_COLOR: Record<string, string> = {
  new: "#C9961A", confirmed: "#4ade80", completed: "#4ade80", cancelled: "#f87171",
};
const STATUS_BG: Record<string, string> = {
  new: "rgba(201,150,26,0.12)", confirmed: "rgba(74,222,128,0.12)",
  completed: "rgba(74,222,128,0.08)", cancelled: "rgba(248,113,113,0.12)",
};

export default function BookingsTab({ token }: { token: string }) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [savingNotes, setSavingNotes] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    fetch(`${API}/api/bookings`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        setList(Array.isArray(d) ? d : []);
        const initialNotes: Record<number, string> = {};
        (Array.isArray(d) ? d : []).forEach((b: any) => {
          initialNotes[b.id] = b.admin_notes || "";
        });
        setNotes(initialNotes);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };
  useEffect(() => load(), []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`${API}/api/bookings/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    showToast("Status updated!");
    load();
  };

  const saveNotes = async (id: number) => {
    setSavingNotes(id);
    await fetch(`${API}/api/bookings/${id}/notes`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ admin_notes: notes[id] || "" }),
    });
    setSavingNotes(null);
    showToast("Notes saved!");
  };

  const deleteBooking = async (id: number) => {
    if (!confirm("Delete this booking?")) return;
    await fetch(`${API}/api/bookings/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    showToast("Booking deleted");
    load();
  };

  const filtered = filter === "all" ? list : list.filter(b => b.status === filter);
  const newCount = list.filter(b => b.status === "new").length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 26, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 className="ah-section-title">Viewing Bookings</h2>
          <p style={{ fontSize: "0.8rem", color: "#C4A97A", marginTop: 4 }}>
            {list.length} total · <span style={{ color: "#C9961A" }}>{newCount} new</span>
          </p>
        </div>
        <div className="ah-filter-tabs" style={{ display: "flex", gap: 6 }}>
          {["all", "new", "confirmed", "completed", "cancelled"].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: "7px 14px",
                border: "1px solid",
                borderColor: filter === s ? "#C9961A" : "rgba(201,150,26,0.2)",
                background: filter === s ? "rgba(201,150,26,0.15)" : "none",
                color: filter === s ? "#E8B84B" : "#C4A97A",
                cursor: "pointer",
                fontFamily: "'Jost',sans-serif",
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                borderRadius: 2,
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {s}{s === "new" && newCount > 0 ? ` (${newCount})` : ""}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#C4A97A" }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#C4A97A" }}>
          <div style={{ fontSize: "3rem", marginBottom: 14, opacity: 0.2 }}>📅</div>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", fontStyle: "italic" }}>
            No {filter === "all" ? "bookings" : `"${filter}"`} yet.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(b => {
            const links = buildReplyLinks(b);
            const isExpanded = expanded === b.id;
            const pref = b.preferred_contact || "call";

            return (
              <div key={b.id} className="ah-card" style={{ overflow: "hidden" }}>
                {/* Main row */}
                <div
                  style={{ padding: "18px 22px", cursor: "pointer" }}
                  onClick={() => setExpanded(isExpanded ? null : b.id)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                    {/* Left */}
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        {/* Avatar */}
                        <div style={{
                          width: 38, height: 38, borderRadius: "50%",
                          background: "linear-gradient(135deg,#8A6520,#C9961A)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem",
                          color: "#3D0A0A", fontWeight: 700, flexShrink: 0,
                        }}>
                          {(b.name || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: "0.92rem", fontWeight: 500, color: "#FDF8EF" }}>{b.name}</div>
                          <div style={{ fontSize: "0.73rem", color: "#C4A97A" }}>
                            {b.phone}{b.email ? ` · ${b.email}` : ""}
                          </div>
                        </div>
                      </div>

                      {/* Property */}
                      {b.property_title && (
                        <div style={{ fontSize: "0.76rem", color: "#E8B84B", letterSpacing: "0.08em", marginBottom: 5 }}>
                          🏠 {b.property_title}
                        </div>
                      )}

                      {/* Date */}
                      {b.viewing_date && (
                        <div style={{ fontSize: "0.74rem", color: "#C4A97A", marginBottom: 5 }}>
                          📅 Requested: <strong style={{ color: "#FDF8EF" }}>{b.viewing_date}</strong>
                        </div>
                      )}

                      {/* Preferred contact badge */}
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        fontSize: "0.72rem",
                        background: pref === "whatsapp" ? "rgba(37,211,102,0.12)" : "rgba(201,150,26,0.1)",
                        border: `1px solid ${pref === "whatsapp" ? "rgba(37,211,102,0.3)" : "rgba(201,150,26,0.2)"}`,
                        color: pref === "whatsapp" ? "#25D366" : "#E8B84B",
                        padding: "3px 10px", borderRadius: 10,
                      }}>
                        {CONTACT_ICON[pref]} Prefers <strong style={{ marginLeft: 3 }}>{pref}</strong>
                      </div>

                      {b.message && (
                        <p style={{ fontSize: "0.79rem", color: "#C4A97A", lineHeight: 1.65, marginTop: 8, maxWidth: 500 }}>
                          "{b.message}"
                        </p>
                      )}
                    </div>

                    {/* Right — status + quick reply */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", flexShrink: 0 }}>
                      <span style={{
                        fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase",
                        padding: "3px 10px", borderRadius: 20,
                        background: STATUS_BG[b.status] || "rgba(100,100,100,0.1)",
                        color: STATUS_COLOR[b.status] || "#888",
                      }}>
                        {b.status || "new"}
                      </span>

                      <div style={{ fontSize: "0.65rem", color: "#6B4F20" }}>
                        {b.created_at ? new Date(b.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""}
                      </div>

                      {/* Primary reply button — highlighted based on preference */}
                      {pref === "whatsapp" && (
                        <a href={links.whatsapp} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "rgba(37,211,102,0.15)", border: "1px solid rgba(37,211,102,0.4)", color: "#25D366", textDecoration: "none", fontSize: "0.76rem", borderRadius: 2, fontWeight: 600 }}>
                          💬 Reply on WhatsApp
                        </a>
                      )}
                      {pref === "call" && (
                        <a href={links.call} onClick={e => e.stopPropagation()}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80", textDecoration: "none", fontSize: "0.76rem", borderRadius: 2, fontWeight: 600 }}>
                          📞 Call Client
                        </a>
                      )}
                      {pref === "sms" && (
                        <a href={links.sms} onClick={e => e.stopPropagation()}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "rgba(201,150,26,0.12)", border: "1px solid rgba(201,150,26,0.3)", color: "#E8B84B", textDecoration: "none", fontSize: "0.76rem", borderRadius: 2, fontWeight: 600 }}>
                          ✉️ Send SMS
                        </a>
                      )}
                      {pref === "telegram" && (
                        <a href={links.telegram} onClick={e => e.stopPropagation()}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "rgba(0,136,204,0.12)", border: "1px solid rgba(0,136,204,0.3)", color: "#29B6F6", textDecoration: "none", fontSize: "0.76rem", borderRadius: 2, fontWeight: 600 }}>
                          ✈️ Telegram
                        </a>
                      )}
                      {pref === "email" && links.email && (
                        <a href={links.email} onClick={e => e.stopPropagation()}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "rgba(201,150,26,0.12)", border: "1px solid rgba(201,150,26,0.3)", color: "#C9961A", textDecoration: "none", fontSize: "0.76rem", borderRadius: 2, fontWeight: 600 }}>
                          📧 Email Client
                        </a>
                      )}

                      <span style={{ fontSize: "0.65rem", color: "#6B4F20" }}>{isExpanded ? "▲ less" : "▼ more"}</span>
                    </div>
                  </div>
                </div>

                {/* Expanded panel */}
                {isExpanded && (
                  <div style={{ borderTop: "1px solid rgba(201,150,26,0.1)", padding: "18px 22px", background: "rgba(0,0,0,0.2)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="ah-booking-detail-grid">

                      {/* All reply methods */}
                      <div>
                        <div style={{ fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#6B4F20", marginBottom: 12 }}>
                          Reply Options
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <a href={links.call}
                            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80", textDecoration: "none", fontSize: "0.78rem", borderRadius: 2 }}>
                            📞 <span><strong>Call</strong> · +{formatPhone(b.phone)}</span>
                          </a>
                          <a href={links.whatsapp} target="_blank" rel="noopener noreferrer"
                            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.25)", color: "#25D366", textDecoration: "none", fontSize: "0.78rem", borderRadius: 2 }}>
                            💬 <span><strong>WhatsApp</strong> · pre-filled message</span>
                          </a>
                          <a href={links.sms}
                            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "rgba(201,150,26,0.08)", border: "1px solid rgba(201,150,26,0.2)", color: "#C9961A", textDecoration: "none", fontSize: "0.78rem", borderRadius: 2 }}>
                            ✉️ <span><strong>SMS</strong> · pre-filled text</span>
                          </a>
                          <a href={links.telegram}
                            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "rgba(0,136,204,0.08)", border: "1px solid rgba(0,136,204,0.2)", color: "#29B6F6", textDecoration: "none", fontSize: "0.78rem", borderRadius: 2 }}>
                            ✈️ <span><strong>Telegram</strong></span>
                          </a>
                          {links.email && (
                            <a href={links.email}
                              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "rgba(201,150,26,0.08)", border: "1px solid rgba(201,150,26,0.2)", color: "#E8B84B", textDecoration: "none", fontSize: "0.78rem", borderRadius: 2 }}>
                              📧 <span><strong>Email</strong> · {b.email}</span>
                            </a>
                          )}
                        </div>

                        {/* Status updates */}
                        <div style={{ marginTop: 18 }}>
                          <div style={{ fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#6B4F20", marginBottom: 10 }}>Update Status</div>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {["new", "confirmed", "completed", "cancelled"]
                              .filter(s => s !== b.status)
                              .map(s => (
                                <button key={s} onClick={() => updateStatus(b.id, s)} className="ah-btn-outline" style={{ padding: "7px 14px", fontSize: "0.68rem" }}>
                                  → {s}
                                </button>
                              ))}
                          </div>
                        </div>
                      </div>

                      {/* Admin notes */}
                      <div>
                        <div style={{ fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#6B4F20", marginBottom: 10 }}>
                          Admin Notes (private)
                        </div>
                        <textarea
                          className="ah-input"
                          rows={5}
                          style={{ resize: "vertical", width: "100%" }}
                          placeholder="Notes about this client, viewing, follow-ups…"
                          value={notes[b.id] || ""}
                          onChange={e => setNotes(prev => ({ ...prev, [b.id]: e.target.value }))}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, gap: 8 }}>
                          <button
                            className="ah-btn-gold"
                            style={{ flex: 1, padding: "9px 0", fontSize: "0.72rem" }}
                            onClick={() => saveNotes(b.id)}
                            disabled={savingNotes === b.id}
                          >
                            {savingNotes === b.id ? "Saving…" : "Save Notes"}
                          </button>
                          <button
                            className="ah-btn-danger"
                            style={{ padding: "9px 16px", fontSize: "0.68rem" }}
                            onClick={() => deleteBooking(b.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @media(max-width:600px){
          .ah-booking-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
