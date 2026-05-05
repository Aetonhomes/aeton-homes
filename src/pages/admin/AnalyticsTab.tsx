import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "";

export default function AnalyticsTab({ token }: { token: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch(`${API}/api/analytics`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setErr("Failed to load analytics"); setLoading(false); });
  }, []);

  if (loading) return <p style={{ color: "#C4A97A", padding: 40 }}>Loading analytics...</p>;
  if (err) return <p style={{ color: "#f87171", padding: 40 }}>{err}</p>;

  const maxDay = data.byDay.length ? Math.max(...data.byDay.map((d: any) => parseInt(d.n))) : 1;

  return (
    <div>
      <div style={{ marginBottom: 26 }}>
        <h2 className="ah-section-title">Site Analytics</h2>
        <p style={{ fontSize: "0.8rem", color: "#C4A97A", marginTop: 4 }}>Visitor tracking & overview</p>
      </div>

      {/* Top stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Today", value: data.visits.today },
          { label: "This Week", value: data.visits.week },
          { label: "This Month", value: data.visits.month },
          { label: "All Time", value: data.visits.total },
          { label: "Enquiries", value: data.counts.enquiries },
          { label: "Reviews", value: data.counts.reviews },
          { label: "Properties", value: data.counts.properties },
        ].map(s => (
          <div key={s.label} className="ah-card" style={{ padding: "18px 16px", textAlign: "center" }}>
            <div style={{ fontSize: "1.8rem", fontFamily: "'Cormorant Garamond',serif", color: "#E8B84B", fontWeight: 600 }}>{s.value}</div>
            <div style={{ fontSize: "0.68rem", color: "#8A6520", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        {/* Visits by day chart */}
        <div className="ah-card" style={{ padding: "20px 18px" }}>
          <div style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#C4A97A", marginBottom: 16 }}>Visits — Last 30 Days</div>
          {data.byDay.length === 0 ? (
            <p style={{ color: "#8A6520", fontSize: "0.8rem" }}>No data yet.</p>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 80, overflowX: "auto" }}>
              {data.byDay.map((d: any) => {
                const pct = Math.max(4, (parseInt(d.n) / maxDay) * 100);
                return (
                  <div key={d.day} title={`${d.day}: ${d.n} visits`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flex: "1 0 10px", minWidth: 10 }}>
                    <div style={{ width: "100%", height: `${pct}%`, background: "linear-gradient(to top,#8A6520,#C9961A)", borderRadius: "2px 2px 0 0", minHeight: 4, transition: "height 0.3s", cursor: "default" }} />
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {data.byDay.length > 0 && (
              <>
                <span style={{ fontSize: "0.62rem", color: "#6B4F20" }}>{new Date(data.byDay[0].day).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                <span style={{ fontSize: "0.62rem", color: "#6B4F20" }}>{new Date(data.byDay[data.byDay.length - 1].day).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
              </>
            )}
          </div>
        </div>

        {/* Visits by page */}
        <div className="ah-card" style={{ padding: "20px 18px" }}>
          <div style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#C4A97A", marginBottom: 16 }}>Top Pages</div>
          {data.byPage.length === 0 ? (
            <p style={{ color: "#8A6520", fontSize: "0.8rem" }}>No data yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.byPage.map((p: any) => {
                const maxPg = parseInt(data.byPage[0].n);
                const pct = (parseInt(p.n) / maxPg) * 100;
                return (
                  <div key={p.path}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: "0.78rem", color: "#FDF8EF" }}>{p.path || "/"}</span>
                      <span style={{ fontSize: "0.72rem", color: "#C9961A" }}>{p.n}</span>
                    </div>
                    <div style={{ height: 3, background: "rgba(201,150,26,0.15)", borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(to right,#8A6520,#C9961A)", borderRadius: 2 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent visitors */}
      <div className="ah-card" style={{ padding: "20px 18px" }}>
        <div style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#C4A97A", marginBottom: 16 }}>Recent Visitors</div>
        {data.recent.length === 0 ? (
          <p style={{ color: "#8A6520", fontSize: "0.8rem" }}>No visits recorded yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(201,150,26,0.15)" }}>
                  {["Time", "Page", "IP", "Referrer", "Screen"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "6px 10px", color: "#8A6520", fontWeight: 400, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.recent.map((v: any, i: number) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(201,150,26,0.06)" }}>
                    <td style={{ padding: "7px 10px", color: "#8A6520", whiteSpace: "nowrap" }}>{new Date(v.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                    <td style={{ padding: "7px 10px", color: "#C9961A" }}>{v.path || "/"}</td>
                    <td style={{ padding: "7px 10px", color: "#C4A97A", fontFamily: "monospace" }}>{v.ip || "—"}</td>
                    <td style={{ padding: "7px 10px", color: "#8A6520", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.referrer ? new URL(v.referrer.startsWith("http") ? v.referrer : "https://x.com").hostname : "direct"}</td>
                    <td style={{ padding: "7px 10px", color: "#8A6520" }}>{v.screen_width ? `${v.screen_width}px` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
