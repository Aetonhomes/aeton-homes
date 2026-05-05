import { useState, useEffect } from "react";
import { showToast } from "./index";

const API = import.meta.env.VITE_API_URL || "";

export default function EnquiriesTab({ token }: { token: string }) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = () => { setLoading(true); fetch(`${API}/api/enquiries`,{headers:{"Authorization":`Bearer ${token}`}}).then(r=>r.json()).then(d=>{setList(d);setLoading(false);}); };
  useEffect(()=>load(),[]);

  const updateStatus = async (id:number, status:string) => {
    await fetch(`${API}/api/enquiries/${id}/status`,{method:"PUT",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},body:JSON.stringify({status})});
    showToast("Status updated!"); load();
  };

  const STATUS_COLOR: Record<string,string> = { new:"#C9961A", contacted:"#4ade80", closed:"#666" };
  const STATUS_BG: Record<string,string> = { new:"rgba(201,150,26,0.12)", contacted:"rgba(74,222,128,0.12)", closed:"rgba(100,100,100,0.12)" };

  const filtered = filter==="all" ? list : list.filter(e=>e.status===filter);

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:26,flexWrap:"wrap",gap:12 }}>
        <div>
          <h2 className="ah-section-title">Enquiries</h2>
          <p style={{ fontSize:"0.8rem",color:"#C4A97A",marginTop:4 }}>{list.length} total · {list.filter(e=>e.status==="new").length} new</p>
        </div>
        <div style={{ display:"flex",gap:6 }}>
          {["all","new","contacted","closed"].map(s=>(
            <button key={s} onClick={()=>setFilter(s)} style={{ padding:"7px 14px",border:"1px solid",borderColor:filter===s?"#C9961A":"rgba(201,150,26,0.2)",background:filter===s?"rgba(201,150,26,0.15)":"none",color:filter===s?"#E8B84B":"#C4A97A",cursor:"pointer",fontFamily:"'Jost',sans-serif",fontSize:"0.72rem",letterSpacing:"0.1em",textTransform:"uppercase",borderRadius:2,transition:"all 0.2s" }}>{s}</button>
          ))}
        </div>
      </div>

      {loading?<p style={{ color:"#C4A97A" }}>Loading...</p>:filtered.length===0?(
        <div style={{ textAlign:"center",padding:"60px 0",color:"#C4A97A" }}>
          <div style={{ fontSize:"3rem",marginBottom:14,opacity:0.2 }}>📩</div>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontStyle:"italic" }}>No {filter==="all"?"enquiries":"\""+filter+"\""} yet.</p>
        </div>
      ):(
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {filtered.map(e=>(
            <div key={e.id} className="ah-card" style={{ padding:"18px 22px" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16,flexWrap:"wrap" }}>
                <div style={{ flex:1,minWidth:220 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:5 }}>
                    <div style={{ width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#8A6520,#C9961A)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",color:"#3D0A0A",fontWeight:700,flexShrink:0 }}>{e.name[0]}</div>
                    <div>
                      <div style={{ fontSize:"0.92rem",fontWeight:500,color:"#FDF8EF" }}>{e.name}</div>
                      <div style={{ fontSize:"0.74rem",color:"#C4A97A" }}>{e.email}{e.phone&&` · ${e.phone}`}</div>
                    </div>
                  </div>
                  {e.interest&&<div style={{ fontSize:"0.74rem",letterSpacing:"0.1em",textTransform:"uppercase",color:"#E8B84B",marginBottom:6 }}>{e.interest}</div>}
                  {e.message&&<p style={{ fontSize:"0.8rem",color:"#C4A97A",lineHeight:1.65,maxWidth:500 }}>{e.message}</p>}
                  <div style={{ fontSize:"0.68rem",color:"#6B4F20",marginTop:8 }}>
                    {e.created_at ? new Date(e.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}) : ""}
                  </div>
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end",flexShrink:0 }}>
                  <span style={{ fontSize:"0.65rem",letterSpacing:"0.1em",textTransform:"uppercase",padding:"3px 10px",borderRadius:20,background:STATUS_BG[e.status]||"rgba(100,100,100,0.1)",color:STATUS_COLOR[e.status]||"#888" }}>{e.status}</span>
                  <div style={{ display:"flex",gap:6 }}>
                    {["new","contacted","closed"].filter(s=>s!==e.status).map(s=>(
                      <button key={s} onClick={()=>updateStatus(e.id,s)} className="ah-btn-outline" style={{ padding:"5px 10px",fontSize:"0.65rem" }}>→ {s}</button>
                    ))}
                  </div>
                  <a href={`mailto:${e.email}`} style={{ fontSize:"0.7rem",color:"#C9961A",textDecoration:"none",letterSpacing:"0.06em" }}>Send Email ↗</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
