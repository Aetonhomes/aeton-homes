import { useState, useEffect } from "react";
import ContentEditor from "./ContentEditor";
import PropertiesTab from "./PropertiesTab";
import VideosTab from "./VideosTab";
import TestimonialsTab from "./TestimonialsTab";
import TeamTab from "./TeamTab";
import EnquiriesTab from "./EnquiriesTab";
import ReviewsTab from "./ReviewsTab";
import AnalyticsTab from "./AnalyticsTab";

const TABS = [
  { id:"analytics",    label:"Analytics",    icon:"📊" },
  { id:"enquiries",    label:"Enquiries",    icon:"📩" },
  { id:"content",      label:"Content",      icon:"✏️" },
  { id:"properties",   label:"Properties",   icon:"🏠" },
  { id:"reviews",      label:"Reviews",      icon:"⭐" },
  { id:"videos",       label:"Videos",       icon:"🎬" },
  { id:"testimonials", label:"Testimonials", icon:"💬" },
  { id:"team",         label:"Team",         icon:"👤" },
];

export default function Admin() {
  const [token, setToken] = useState<string|null>(localStorage.getItem("ah_token"));
  const [tab, setTab] = useState("analytics");
  const [sideOpen, setSideOpen] = useState(false);

  // close sidebar on outside click (mobile)
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (sideOpen && !target.closest(".ah-sidebar") && !target.closest(".ah-hamburger")) {
        setSideOpen(false);
      }
    };
    document.addEventListener("click", fn);
    return () => document.removeEventListener("click", fn);
  }, [sideOpen]);

  if (!token) return <Login onLogin={setToken} />;

  const switchTab = (id: string) => { setTab(id); setSideOpen(false); };

  return (
    <div style={{ background:"#0A0101", color:"#FDF8EF", minHeight:"100vh", display:"flex", overflowX:"hidden", width:"100%", maxWidth:"100vw" }}>

      {/* ── Mobile overlay backdrop ── */}
      {sideOpen && (
        <div onClick={() => setSideOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:199, display:"none" }} className="ah-overlay" />
      )}

      {/* ── Sidebar ── */}
      <div className={`ah-sidebar${sideOpen ? " open" : ""}`} style={{
        width:220, minWidth:220, flexShrink:0,
        background:"rgba(5,0,0,0.95)", borderRight:"1px solid rgba(201,150,26,0.15)",
        display:"flex", flexDirection:"column",
        position:"sticky", top:0, height:"100vh", overflow:"auto",
        zIndex:200,
      }}>
        <div style={{ padding:"22px 20px 18px", borderBottom:"1px solid rgba(201,150,26,0.12)" }}>
          <a href="/" style={{ display:"block", textDecoration:"none" }}>
            <img src="https://jewelbookstore.neocities.org/logo.jpeg" alt="Aeton" style={{ height:44, objectFit:"contain", borderRadius:3 }}/>
          </a>
          <p style={{ fontSize:"0.62rem", letterSpacing:"0.18em", textTransform:"uppercase", color:"#8A6520", marginTop:10 }}>Admin Panel</p>
        </div>
        <nav style={{ flex:1, padding:"16px 12px", display:"flex", flexDirection:"column", gap:4 }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={() => switchTab(t.id)} style={{
              textAlign:"left", padding:"11px 14px", border:"none", borderRadius:3, cursor:"pointer",
              fontFamily:"'Jost',sans-serif", fontSize:"0.8rem", letterSpacing:"0.06em",
              background:tab===t.id ? "rgba(201,150,26,0.15)" : "transparent",
              color:tab===t.id ? "#E8B84B" : "#C4A97A",
              borderLeft:tab===t.id ? "2px solid #C9961A" : "2px solid transparent",
              transition:"all 0.2s", display:"flex", alignItems:"center", gap:10,
            }}>
              <span style={{ fontSize:"1rem", lineHeight:1 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
        <div style={{ padding:"16px 12px", borderTop:"1px solid rgba(201,150,26,0.1)" }}>
          <a href="/" style={{ display:"block", fontSize:"0.72rem", color:"#8A6520", textDecoration:"none", marginBottom:10, letterSpacing:"0.06em" }}>← View Site</a>
          <button onClick={()=>{localStorage.removeItem("ah_token"); setToken(null);}} className="ah-btn-danger" style={{ width:"100%", padding:"8px 0", fontSize:"0.7rem" }}>Logout</button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="ah-main-content" style={{ flex:1, overflow:"auto", minWidth:0, display:"flex", flexDirection:"column" }}>
        {/* Mobile top bar */}
        <div className="ah-topbar" style={{
          display:"none", alignItems:"center", justifyContent:"space-between",
          padding:"12px 16px", background:"rgba(5,0,0,0.95)", borderBottom:"1px solid rgba(201,150,26,0.15)",
          position:"sticky", top:0, zIndex:100,
        }}>
          <button className="ah-hamburger" onClick={() => setSideOpen(s => !s)} style={{
            background:"none", border:"1px solid rgba(201,150,26,0.3)", color:"#E8B84B",
            width:40, height:40, borderRadius:4, cursor:"pointer", fontSize:"1.1rem",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>☰</button>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:"#FDF8EF" }}>
            {TABS.find(t=>t.id===tab)?.icon} {TABS.find(t=>t.id===tab)?.label}
          </span>
          <a href="/" style={{ fontSize:"0.7rem", color:"#8A6520", textDecoration:"none" }}>← Site</a>
        </div>

        <div style={{ padding:"24px 20px", flex:1 }}>
          {tab==="analytics"    && <AnalyticsTab token={token}/>}
          {tab==="content"      && <ContentEditor token={token}/>}
          {tab==="properties"   && <PropertiesTab token={token}/>}
          {tab==="reviews"      && <ReviewsTab token={token}/>}
          {tab==="videos"       && <VideosTab token={token}/>}
          {tab==="testimonials" && <TestimonialsTab token={token}/>}
          {tab==="team"         && <TeamTab token={token}/>}
          {tab==="enquiries"    && <EnquiriesTab token={token}/>}
        </div>
      </div>

      <Toast />


    </div>
  );
}

function Login({ onLogin }: { onLogin: (t: string)=>void }) {
  const [pw, setPw] = useState(""); const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setErr("");
    try {
      const _API = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${_API}/api/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:pw})});
      if (!res.ok){setErr("Incorrect password");return;}
      const {token}=await res.json();
      localStorage.setItem("ah_token",token);
      onLogin(token);
    } catch { setErr("Login failed."); } finally { setLoading(false); }
  };
  return (
    <div style={{ background:"#0A0101", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
      <div className="ah-card" style={{ padding:"46px 40px", width:"100%", maxWidth:400, backdropFilter:"blur(20px)" }}>
        <div style={{ textAlign:"center", marginBottom:34 }}>
          <img src="https://jewelbookstore.neocities.org/logo.jpeg" alt="Aeton Homes" style={{ height:58, objectFit:"contain", borderRadius:3, marginBottom:14 }}/>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.8rem", color:"#FDF8EF" }}>Admin Access</h1>
          <p style={{ fontSize:"0.8rem", color:"#C4A97A", marginTop:4 }}>Enter your password to continue</p>
        </div>
        <form onSubmit={submit}>
          <div style={{ marginBottom:18 }}>
            <label className="ah-label">Password</label>
            <input type="password" value={pw} onChange={e=>setPw(e.target.value)} required className="ah-input" placeholder="Enter admin password" style={{ fontSize:"1rem" }}/>
          </div>
          {err&&<p style={{ color:"#f87171", fontSize:"0.8rem", marginBottom:14 }}>{err}</p>}
          <button type="submit" disabled={loading} className="ah-btn-gold" style={{ width:"100%", padding:14 }}>{loading?"Signing in...":"Sign In"}</button>
        </form>
        <p style={{ textAlign:"center", marginTop:18 }}>
          <a href="/" style={{ fontSize:"0.74rem", color:"#8A6520", textDecoration:"none" }}>← Back to website</a>
        </p>
      </div>
    </div>
  );
}

// Global toast
export function showToast(msg: string, type: "success"|"error" = "success") {
  window.dispatchEvent(new CustomEvent("ah-toast", { detail: { msg, type } }));
}

function Toast() {
  const [toast, setToast] = useState<{msg:string;type:string}|null>(null);
  useEffect(()=>{
    const fn=(e:any)=>{ setToast(e.detail); setTimeout(()=>setToast(null),3000); };
    window.addEventListener("ah-toast",fn);
    return ()=>window.removeEventListener("ah-toast",fn);
  },[]);
  if (!toast) return null;
  return (
    <div style={{ position:"fixed", bottom:28, right:28, zIndex:9999, background:toast.type==="error"?"#7f1d1d":"linear-gradient(135deg,#C9961A,#E8B84B)", color:toast.type==="error"?"#fca5a5":"#3D0A0A", padding:"12px 22px", borderRadius:4, fontSize:"0.84rem", fontWeight:500, boxShadow:"0 8px 30px rgba(0,0,0,0.4)", animation:"fadeInDown 0.3s ease", maxWidth:"calc(100vw - 40px)" }}>
      {toast.msg}
    </div>
  );
}
