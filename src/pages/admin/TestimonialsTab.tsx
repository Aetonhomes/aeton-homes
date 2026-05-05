import { useState, useEffect } from "react";
import { showToast } from "./index";

const API = import.meta.env.VITE_API_URL || "";
const EMPTY = { name:"",role:"",quote:"",stars:5,avatar_url:"",active:true,order_index:0 };

export default function TestimonialsTab({ token }: { token: string }) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(EMPTY);
  const [editing, setEditing] = useState<number|null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const hdrs = { "Content-Type":"application/json","Authorization":`Bearer ${token}` };

  const load = () => { setLoading(true); fetch(`${API}/api/testimonials/all`,{headers:{"Authorization":`Bearer ${token}`}}).then(r=>r.json()).then(d=>{setList(d);setLoading(false);}); };
  useEffect(()=>load(),[]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await fetch(`${API}/api/testimonials/${editing}`,{method:"PUT",headers:hdrs,body:JSON.stringify(form)}); showToast("Updated!"); }
      else { await fetch(`${API}/api/testimonials`,{method:"POST",headers:hdrs,body:JSON.stringify(form)}); showToast("Added!"); }
      setShowForm(false); load();
    } catch { showToast("Failed","error"); } finally { setSaving(false); }
  };

  const del = async (id:number) => {
    if (!confirm("Delete?")) return;
    await fetch(`${API}/api/testimonials/${id}`,{method:"DELETE",headers:{"Authorization":`Bearer ${token}`}});
    showToast("Deleted."); load();
  };

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:26 }}>
        <div><h2 className="ah-section-title">Testimonials</h2><p style={{ fontSize:"0.8rem",color:"#C4A97A",marginTop:4 }}>{list.length} reviews</p></div>
        <button onClick={()=>{setForm({...EMPTY});setEditing(null);setShowForm(true);}} className="ah-btn-gold">+ Add Testimonial</button>
      </div>

      {showForm&&(
        <div className="ah-card" style={{ padding:28,marginBottom:28 }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",color:"#FDF8EF",marginBottom:20 }}>{editing?"Edit":"Add"} Testimonial</h3>
          <form onSubmit={save}>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px 20px",marginBottom:18 }}>
              <div><label className="ah-label">Client Name *</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="ah-input"/></div>
              <div><label className="ah-label">Role / Title</label><input value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="ah-input" placeholder="Property Investor"/></div>
              <div style={{ gridColumn:"1/-1" }}><label className="ah-label">Quote *</label><textarea required value={form.quote} onChange={e=>setForm({...form,quote:e.target.value})} rows={3} className="ah-input" style={{ resize:"vertical" }} placeholder="What the client said..."/></div>
              <div>
                <label className="ah-label">Stars</label>
                <select value={form.stars} onChange={e=>setForm({...form,stars:parseInt(e.target.value)})} className="ah-input" style={{ appearance:"none" }}>
                  {[5,4,3,2,1].map(n=><option key={n} value={n} style={{background:"#1A0303"}}>{"★".repeat(n)}</option>)}
                </select>
              </div>
              <div><label className="ah-label">Avatar URL (optional)</label><input value={form.avatar_url} onChange={e=>setForm({...form,avatar_url:e.target.value})} className="ah-input" placeholder="https://..."/></div>
              <div><label className="ah-label">Display Order</label><input type="number" value={form.order_index} onChange={e=>setForm({...form,order_index:parseInt(e.target.value)||0})} className="ah-input" min={0}/></div>
              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                <label style={{ display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:"0.82rem",color:"#C4A97A" }}>
                  <input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})} style={{ width:15,height:15 }}/>
                  Active (visible on site)
                </label>
              </div>
            </div>
            <div style={{ display:"flex",gap:10 }}>
              <button type="submit" disabled={saving} className="ah-btn-gold">{saving?"Saving...":editing?"Update":"Add Testimonial"}</button>
              <button type="button" onClick={()=>setShowForm(false)} className="ah-btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading?<p style={{ color:"#C4A97A" }}>Loading...</p>:list.length===0?(
        <div style={{ textAlign:"center",padding:"60px 0",color:"#C4A97A" }}>
          <div style={{ fontSize:"3rem",marginBottom:14,opacity:0.2 }}>⭐</div>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontStyle:"italic" }}>No testimonials yet.</p>
        </div>
      ):(
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          {list.map(t=>(
            <div key={t.id} className="ah-card" style={{ padding:"18px 20px",display:"flex",gap:16,alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap" }}>
              <div style={{ flex:1,minWidth:200 }}>
                <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:6 }}>
                  <div style={{ width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#8A6520,#C9961A)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",color:"#3D0A0A",fontWeight:700,flexShrink:0 }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontSize:"0.9rem",fontWeight:500,color:"#FDF8EF" }}>{t.name}</div>
                    <div style={{ fontSize:"0.72rem",color:"#C4A97A" }}>{t.role}</div>
                  </div>
                  <div style={{ fontSize:"0.8rem",color:"#C9961A",marginLeft:4 }}>{"★".repeat(t.stars)}</div>
                  {!t.active&&<span style={{ fontSize:"0.6rem",background:"rgba(100,100,100,0.4)",color:"#aaa",padding:"1px 6px",borderRadius:2,textTransform:"uppercase" }}>Hidden</span>}
                </div>
                <p style={{ fontSize:"0.82rem",color:"#C4A97A",fontStyle:"italic",lineHeight:1.6 }}>"{t.quote}"</p>
              </div>
              <div style={{ display:"flex",gap:8,flexShrink:0 }}>
                <button onClick={()=>{setForm({...t});setEditing(t.id);setShowForm(true);}} className="ah-btn-outline" style={{ padding:"6px 14px",fontSize:"0.72rem" }}>Edit</button>
                <button onClick={()=>del(t.id)} className="ah-btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
