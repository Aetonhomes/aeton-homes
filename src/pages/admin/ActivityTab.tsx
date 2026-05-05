import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "";

const TYPE_META: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  enquiry: { icon:"📩", color:"#E8B84B", bg:"rgba(201,150,26,0.12)", label:"Enquiry" },
  visit:   { icon:"👁️", color:"#60a5fa", bg:"rgba(96,165,250,0.1)",  label:"Visit"   },
  review:  { icon:"⭐", color:"#4ade80", bg:"rgba(74,222,128,0.1)",  label:"Review"  },
};

const CONTACT_ICON: Record<string, string> = {
  call: "📞", whatsapp: "💬", sms: "✉️", telegram: "✈️", email: "📧",
};

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return new Date(date).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
}

export default function ActivityTab({ token }: { token: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const load = () => {
    fetch(`${API}/api/activity?limit=150`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setItems(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // Auto-refresh every 30s
  useEffect(() => {
    if (!autoRefresh) return;
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [autoRefresh]);

  const filtered = filter === "all" ? items : items.filter(i => i.type === filter);

  // Summary counts
  const counts = {
    enquiry: items.filter(i => i.type === "enquiry").length,
    visit:   items.filter(i => i.type === "visit").length,
    review:  items.filter(i => i.type === "review").length,
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <h2 className="ah-section-title">Live Activity</h2>
          <p style={{ fontSize:"0.8rem", color:"#C4A97A", marginTop:4 }}>All website activity — visitors, enquiries, reviews · last 150 events</p>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button onClick={load} style={{ padding:"7px 14px", background:"rgba(201,150,26,0.1)", border:"1px solid rgba(201,150,26,0.25)", color:"#C9961A", borderRadius:2, cursor:"pointer", fontSize:"0.72rem", fontFamily:"'Jost',sans-serif", letterSpacing:"0.1em" }}>
            ↻ Refresh
          </button>
          <button onClick={()=>setAutoRefresh(a=>!a)} style={{ padding:"7px 14px", background:autoRefresh?"rgba(74,222,128,0.1)":"rgba(255,255,255,0.03)", border:`1px solid ${autoRefresh?"rgba(74,222,128,0.3)":"rgba(201,150,26,0.15)"}`, color:autoRefresh?"#4ade80":"#6B4F20", borderRadius:2, cursor:"pointer", fontSize:"0.72rem", fontFamily:"'Jost',sans-serif", letterSpacing:"0.1em" }}>
            {autoRefresh ? "● Live" : "○ Paused"}
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:22 }}>
        {Object.entries(TYPE_META).map(([type, meta]) => (
          <div key={type} style={{ padding:"14px 16px", background:meta.bg, border:`1px solid ${meta.color}22`, borderRadius:4, display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:"1.4rem" }}>{meta.icon}</span>
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.6rem", color:meta.color, lineHeight:1, fontWeight:600 }}>{counts[type as keyof typeof counts]}</div>
              <div style={{ fontSize:"0.62rem", color:meta.color, opacity:0.7, letterSpacing:"0.14em", textTransform:"uppercase" }}>{meta.label}s</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:18, flexWrap:"wrap" }}>
        {["all","enquiry","visit","review"].map(f => (
          <button key={f} onClick={()=>setFilter(f)} style={{ padding:"7px 16px", border:"1px solid", borderColor:filter===f?"#C9961A":"rgba(201,150,26,0.2)", background:filter===f?"rgba(201,150,26,0.12)":"none", color:filter===f?"#E8B84B":"#8A6520", cursor:"pointer", fontFamily:"'Jost',sans-serif", fontSize:"0.72rem", letterSpacing:"0.1em", textTransform:"capitalize", borderRadius:2, transition:"all 0.2s" }}>
            {f === "all" ? `All (${items.length})` : `${TYPE_META[f].icon} ${f}s (${counts[f as keyof typeof counts]})`}
          </button>
        ))}
      </div>

      {/* Activity list */}
      {loading ? (
        <p style={{ color:"#C4A97A", padding:"40px 0" }}>Loading activity...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px 0", color:"#6B4F20" }}>
          <div style={{ fontSize:"2.5rem", opacity:0.2, marginBottom:12 }}>📋</div>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.2rem", fontStyle:"italic" }}>No activity yet.</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          {filtered.map((item, i) => {
            const meta = TYPE_META[item.type] || TYPE_META.visit;
            return (
              <div key={`${item.type}-${item.id}-${i}`} style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"12px 14px", background:i%2===0?"rgba(255,255,255,0.015)":"transparent", borderRadius:3, borderLeft:`2px solid ${meta.color}33`, transition:"background 0.2s" }}
                onMouseEnter={e=>(e.currentTarget.style.background="rgba(201,150,26,0.05)")}
                onMouseLeave={e=>(e.currentTarget.style.background=i%2===0?"rgba(255,255,255,0.015)":"transparent")}>

                {/* Type icon */}
                <div style={{ width:32, height:32, borderRadius:"50%", background:meta.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.9rem", flexShrink:0, marginTop:1 }}>
                  {meta.icon}
                </div>

                {/* Content */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, flexWrap:"wrap" }}>
                    <div>
                      <span style={{ fontSize:"0.82rem", color:"#FDF8EF", fontWeight:500 }}>
                        {item.type === "enquiry" && item.title}
                        {item.type === "visit" && <span style={{ color:"#60a5fa" }}>{item.title}</span>}
                        {item.type === "review" && item.title}
                      </span>
                      {/* Type badge */}
                      <span style={{ marginLeft:8, fontSize:"0.58rem", letterSpacing:"0.12em", textTransform:"uppercase", padding:"2px 7px", borderRadius:10, background:meta.bg, color:meta.color }}>{meta.label}</span>

                      {/* Extra info per type */}
                      {item.type === "enquiry" && (
                        <div style={{ marginTop:3, display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
                          {item.phone && <span style={{ fontSize:"0.74rem", color:"#C4A97A" }}>📞 {item.phone}</span>}
                          {item.email && <span style={{ fontSize:"0.74rem", color:"#8A6520" }}>✉️ {item.email}</span>}
                          {item.preferred_contact && (
                            <span style={{ fontSize:"0.7rem", color:"#E8B84B", background:"rgba(201,150,26,0.1)", padding:"2px 8px", borderRadius:10 }}>
                              {CONTACT_ICON[item.preferred_contact] || "📞"} prefers {item.preferred_contact}
                            </span>
                          )}
                          {item.subtitle && <span style={{ fontSize:"0.74rem", color:"#6B4F20", fontStyle:"italic" }}>"{item.subtitle}"</span>}
                          <span style={{ fontSize:"0.68rem", padding:"2px 8px", borderRadius:10, background:item.status==="new"?"rgba(201,150,26,0.12)":item.status==="contacted"?"rgba(74,222,128,0.12)":"rgba(100,100,100,0.1)", color:item.status==="new"?"#C9961A":item.status==="contacted"?"#4ade80":"#666" }}>{item.status}</span>
                        </div>
                      )}
                      {item.type === "visit" && (
                        <div style={{ marginTop:3, display:"flex", gap:10, flexWrap:"wrap" }}>
                          {item.ip && <span style={{ fontSize:"0.72rem", color:"#6B4F20" }}>IP: {item.ip}</span>}
                          {item.subtitle && <span style={{ fontSize:"0.72rem", color:"#6B4F20" }}>ref: {item.subtitle.slice(0,40)}</span>}
                          {item.screen_width > 0 && <span style={{ fontSize:"0.68rem", color:"#4A3010" }}>{item.screen_width}px screen</span>}
                        </div>
                      )}
                      {item.type === "review" && (
                        <div style={{ marginTop:3 }}>
                          {item.rating && <span style={{ fontSize:"0.72rem", color:"#C9961A", letterSpacing:2 }}>{"★".repeat(item.rating)}</span>}
                          {item.subtitle && <p style={{ fontSize:"0.76rem", color:"#8A6520", fontStyle:"italic", marginTop:3, maxWidth:500 }}>"{item.subtitle.slice(0,120)}{item.subtitle.length>120?"…":""}"</p>}
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize:"0.65rem", color:"#4A3010", flexShrink:0, whiteSpace:"nowrap" }}>{timeAgo(item.created_at)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
