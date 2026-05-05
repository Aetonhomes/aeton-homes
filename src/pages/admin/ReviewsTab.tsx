import { useState, useEffect } from "react";
import { showToast } from "./index";

const API = import.meta.env.VITE_API_URL || "";

export default function ReviewsTab({ token }: { token: string }) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch(`${API}/api/reviews/all`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setList(Array.isArray(d) ? d : []); setLoading(false); });
  };
  useEffect(() => load(), []);

  const del = async (id: number) => {
    if (!confirm("Delete this review permanently?")) return;
    await fetch(`${API}/api/reviews/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
    showToast("Review deleted.");
    load();
  };

  return (
    <div>
      <div style={{ marginBottom: 26 }}>
        <h2 className="ah-section-title">Client Reviews</h2>
        <p style={{ fontSize: "0.8rem", color: "#C4A97A", marginTop: 4 }}>
          {list.length} reviews · all published instantly
        </p>
      </div>

      {loading ? <p style={{ color: "#C4A97A" }}>Loading...</p> : list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#C4A97A" }}>
          <div style={{ fontSize: "3rem", marginBottom: 14, opacity: 0.2 }}>⭐</div>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", fontStyle: "italic" }}>No reviews yet.</p>
          <p style={{ fontSize: "0.8rem", marginTop: 8, opacity: 0.6 }}>Reviews submitted on the website appear here immediately.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {list.map(r => (
            <div key={r.id} className="ah-card" style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#8A6520,#C9961A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", color: "#3D0A0A", fontWeight: 700, flexShrink: 0 }}>{r.name[0]}</div>
                  <span style={{ fontSize: "0.85rem", color: "#FDF8EF", fontWeight: 500 }}>{r.name}</span>
                  {r.email && <span style={{ fontSize: "0.7rem", color: "#8A6520" }}>{r.email}</span>}
                  <span style={{ color: "#C9961A", fontSize: "0.78rem", letterSpacing: 1 }}>{"★".repeat(r.stars)}</span>
                  <span style={{ fontSize: "0.65rem", color: "#8A6520", marginLeft: "auto" }}>{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "#C4A97A", fontStyle: "italic", lineHeight: 1.6 }}>"{r.quote}"</p>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
                <div style={{ fontSize: "0.62rem", padding: "3px 9px", borderRadius: 20, background: "rgba(74,222,128,0.1)", color: "#4ade80", letterSpacing: "0.08em", textTransform: "uppercase" }}>Live</div>
                <button onClick={() => del(r.id)} className="ah-btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
