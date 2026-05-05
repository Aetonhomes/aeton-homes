import { useState, useEffect } from "react";
import { showToast } from "./index";

const API = import.meta.env.VITE_API_URL || "";

export default function ReviewsTab({ token }: { token: string }) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch(`${API}/api/reviews/all`,{headers:{"Authorization":`Bearer ${token}`}})
      .then(r=>r.json()).then(d=>{setList(Array.isArray(d)?d:[]);setLoading(false);});
  };
  useEffect(()=>load(),[]);

  const approve = async (id:number, approved:boolean) => {
    await fetch(`${API}/api/reviews/${id}/approve`,{method:"PUT",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},body:JSON.stringify({approved})});
    showToast(approved?"Review approved — now visible on site!":"Review hidden.");
    load();
  };

  const del = async (id:number) => {
    if (!confirm("Delete this review?")) return;
    await fetch(`${API}/api/reviews/${id}`,{method:"DELETE",headers:{"Authorization":`Bearer ${token}`}});
    showToast("Deleted."); load();
  };

  const pending = list.filter(r=>!r.approved);
  const approved = list.filter(r=>r.approved);

  return (
    <div>
      <div style={{ marginBottom:26 }}>
        <h2 className="ah-section-title">Client Reviews</h2>
        <p style={{ fontSize:"0.8rem",color:"#C4A97A",marginTop:4 }}>
          {pending.length} pending approval · {approved.length} published
        </p>
      </div>

      {/* Pending */}
      {pending.length>0&&(
        <div style={{ marginBottom:32 }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14 }}>
            <div style={{ width:8,height:8,borderRadius:"50%",background:"#E8B84B",animation:"pulse 2s infinite" }}/>
            <span style={{ fontSize:"0.72rem",letterSpacing:"0.18em",textTransform:"uppercase",color:"#C9961A" }}>Awaiting Approval ({pending.length})</span>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            {pending.map(r=>(
              <div key={r.id} className="ah-card" style={{ padding:"18px 20px",border:"1px solid rgba(201,150,26,0.25)" }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap" }}>
                  <div style={{ flex:1,minWidth:200 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8 }}>
                      <div style={{ width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#8A6520,#C9961A)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.9rem",color:"#3D0A0A",fontWeight:700,flexShrink:0 }}>{r.name[0]}</div>
                      <div>
                        <div style={{ fontSize:"0.88rem",fontWeight:500,color:"#FDF8EF" }}>{r.name}</div>
                        {r.email&&<div style={{ fontSize:"0.7rem",color:"#8A6520" }}>{r.email}</div>}
                      </div>
                      <div style={{ color:"#C9961A",fontSize:"0.82rem",letterSpacing:1 }}>{"★".repeat(r.stars)}</div>
                      <div style={{ fontSize:"0.65rem",color:"#8A6520",marginLeft:"auto" }}>{new Date(r.created_at).toLocaleDateString()}</div>
                    </div>
                    <p style={{ fontSize:"0.84rem",color:"#C4A97A",fontStyle:"italic",lineHeight:1.65 }}>"{r.quote}"</p>
                  </div>
                  <div style={{ display:"flex",gap:8,flexShrink:0,alignItems:"center" }}>
                    <button onClick={()=>approve(r.id,true)} className="ah-btn-gold" style={{ padding:"7px 14px",fontSize:"0.72rem" }}>✓ Approve</button>
                    <button onClick={()=>del(r.id)} className="ah-btn-danger">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Published */}
      {approved.length>0&&(
        <div>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14 }}>
            <div style={{ width:8,height:8,borderRadius:"50%",background:"#4ade80" }}/>
            <span style={{ fontSize:"0.72rem",letterSpacing:"0.18em",textTransform:"uppercase",color:"#C4A97A" }}>Published ({approved.length})</span>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {approved.map(r=>(
              <div key={r.id} className="ah-card" style={{ padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap" }}>
                <div style={{ flex:1,minWidth:200 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6 }}>
                    <div style={{ width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#8A6520,#C9961A)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem",color:"#3D0A0A",fontWeight:700,flexShrink:0 }}>{r.name[0]}</div>
                    <span style={{ fontSize:"0.85rem",color:"#FDF8EF",fontWeight:500 }}>{r.name}</span>
                    <span style={{ color:"#C9961A",fontSize:"0.78rem",letterSpacing:1 }}>{"★".repeat(r.stars)}</span>
                    <span style={{ fontSize:"0.65rem",color:"#8A6520",marginLeft:"auto" }}>{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  <p style={{ fontSize:"0.8rem",color:"#C4A97A",fontStyle:"italic",lineHeight:1.6 }}>"{r.quote}"</p>
                </div>
                <div style={{ display:"flex",gap:8,flexShrink:0 }}>
                  <button onClick={()=>approve(r.id,false)} className="ah-btn-outline" style={{ padding:"6px 12px",fontSize:"0.7rem" }}>Hide</button>
                  <button onClick={()=>del(r.id)} className="ah-btn-danger">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && list.length===0&&(
        <div style={{ textAlign:"center",padding:"60px 0",color:"#C4A97A" }}>
          <div style={{ fontSize:"3rem",marginBottom:14,opacity:0.2 }}>⭐</div>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontStyle:"italic" }}>No reviews submitted yet.</p>
          <p style={{ fontSize:"0.8rem",marginTop:8,opacity:0.6 }}>Reviews left on the website will appear here for moderation.</p>
        </div>
      )}
    </div>
  );
}
