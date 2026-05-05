import { useState, useEffect } from "react";
import { showToast } from "./index";

const API = import.meta.env.VITE_API_URL || "";
const CATS = ["Tour","Promo","Testimonial","Development Update","Aerial"];
const EMPTY = { title:"",description:"",location_tag:"",category:"Tour",thumbnail_url:"",video_url:"",video_type:"youtube",featured:false,active:true };

export default function VideosTab({ token }: { token: string }) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(EMPTY);
  const [editing, setEditing] = useState<number|null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const hdrs = { "Content-Type":"application/json","Authorization":`Bearer ${token}` };

  const load = () => { setLoading(true); fetch(`${API}/api/videos/all`,{headers:{"Authorization":`Bearer ${token}`}}).then(r=>r.json()).then(d=>{setList(d);setLoading(false);}); };
  useEffect(()=>load(),[]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await fetch(`${API}/api/videos/${editing}`,{method:"PUT",headers:hdrs,body:JSON.stringify(form)}); showToast("Video updated!"); }
      else { await fetch(`${API}/api/videos`,{method:"POST",headers:hdrs,body:JSON.stringify(form)}); showToast("Video added!"); }
      setShowForm(false); load();
    } catch { showToast("Failed","error"); } finally { setSaving(false); }
  };

  const del = async (id:number) => {
    if (!confirm("Delete?")) return;
    await fetch(`${API}/api/videos/${id}`,{method:"DELETE",headers:{"Authorization":`Bearer ${token}`}});
    showToast("Deleted."); load();
  };

  const urlHint = form.video_type==="youtube"?"https://www.youtube.com/watch?v=...":form.video_type==="vimeo"?"https://vimeo.com/...":"https://... (direct mp4 URL)";

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:26 }}>
        <div><h2 className="ah-section-title">Videos</h2><p style={{ fontSize:"0.8rem",color:"#C4A97A",marginTop:4 }}>{list.length} videos</p></div>
        <button onClick={()=>{setForm({...EMPTY});setEditing(null);setShowForm(true);}} className="ah-btn-gold">+ Add Video</button>
      </div>

      {showForm&&(
        <div className="ah-card" style={{ padding:28,marginBottom:28 }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",color:"#FDF8EF",marginBottom:22 }}>{editing?"Edit Video":"Add Video"}</h3>
          <form onSubmit={save}>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:"16px 20px",marginBottom:20 }}>
              <div style={{ gridColumn:"1/-1" }}><label className="ah-label">Title *</label><input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="ah-input"/></div>
              <div>
                <label className="ah-label">Video Type *</label>
                <select value={form.video_type} onChange={e=>setForm({...form,video_type:e.target.value})} className="ah-input" style={{ appearance:"none" }}>
                  <option value="youtube" style={{background:"#1A0303"}}>YouTube</option>
                  <option value="vimeo" style={{background:"#1A0303"}}>Vimeo</option>
                  <option value="upload" style={{background:"#1A0303"}}>Direct URL / Upload</option>
                </select>
              </div>
              <div>
                <label className="ah-label">Category *</label>
                <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="ah-input" style={{ appearance:"none" }}>
                  {CATS.map(c=><option key={c} value={c} style={{background:"#1A0303"}}>{c}</option>)}
                </select>
              </div>
              <div><label className="ah-label">Location / Property Tag</label><input value={form.location_tag} onChange={e=>setForm({...form,location_tag:e.target.value})} className="ah-input" placeholder="e.g. Karen, Nairobi"/></div>
              <div style={{ gridColumn:"1/-1" }}>
                <label className="ah-label">Video URL *</label>
                <input required value={form.video_url} onChange={e=>setForm({...form,video_url:e.target.value})} className="ah-input" placeholder={urlHint}/>
                <p style={{ fontSize:"0.7rem",color:"#8A6520",marginTop:5 }}>
                  {form.video_type==="youtube"&&"Paste the full YouTube video URL"}
                  {form.video_type==="vimeo"&&"Paste the full Vimeo video URL"}
                  {form.video_type==="upload"&&"Paste a direct link to your hosted video (.mp4)"}
                </p>
              </div>
              <div style={{ gridColumn:"1/-1" }}><label className="ah-label">Thumbnail URL (optional)</label><input value={form.thumbnail_url} onChange={e=>setForm({...form,thumbnail_url:e.target.value})} className="ah-input" placeholder="https://..."/></div>
              <div style={{ gridColumn:"1/-1" }}><label className="ah-label">Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={2} className="ah-input" style={{ resize:"vertical" }}/></div>
              <div style={{ display:"flex",gap:22,gridColumn:"1/-1" }}>
                <label style={{ display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:"0.82rem",color:"#C4A97A" }}>
                  <input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} style={{ width:15,height:15 }}/>
                  Featured (shows on homepage)
                </label>
                <label style={{ display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:"0.82rem",color:"#C4A97A" }}>
                  <input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})} style={{ width:15,height:15 }}/>
                  Active
                </label>
              </div>
            </div>
            <div style={{ display:"flex",gap:10 }}>
              <button type="submit" disabled={saving} className="ah-btn-gold">{saving?"Saving...":editing?"Update Video":"Add Video"}</button>
              <button type="button" onClick={()=>setShowForm(false)} className="ah-btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading?<p style={{ color:"#C4A97A" }}>Loading...</p>:list.length===0?(
        <div style={{ textAlign:"center",padding:"60px 0",color:"#C4A97A" }}>
          <div style={{ fontSize:"3rem",marginBottom:14,opacity:0.2 }}>🎬</div>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontStyle:"italic" }}>No videos yet.</p>
        </div>
      ):(
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:18 }}>
          {list.map(v=>(
            <div key={v.id} className="ah-card" style={{ overflow:"hidden" }}>
              <div style={{ aspectRatio:"16/9",background:"#1A0404",position:"relative",display:"flex",alignItems:"center",justifyContent:"center" }}>
                {v.thumbnail_url?<img src={v.thumbnail_url} alt={v.title} style={{ width:"100%",height:"100%",objectFit:"cover" }}/>:<span style={{ fontSize:"2.5rem",opacity:0.15 }}>🎬</span>}
                {v.featured&&<span style={{ position:"absolute",top:8,left:8,fontSize:"0.6rem",fontWeight:600,textTransform:"uppercase",padding:"2px 8px",borderRadius:2,background:"linear-gradient(135deg,#C9961A,#E8B84B)",color:"#3D0A0A" }}>★ Featured</span>}
                {!v.active&&<span style={{ position:"absolute",top:8,right:8,fontSize:"0.6rem",fontWeight:600,textTransform:"uppercase",padding:"2px 8px",borderRadius:2,background:"rgba(100,100,100,0.6)",color:"#aaa" }}>Hidden</span>}
              </div>
              <div style={{ padding:14 }}>
                <div style={{ display:"flex",gap:6,marginBottom:8,flexWrap:"wrap" }}>
                  <span style={{ fontSize:"0.6rem",letterSpacing:"0.1em",textTransform:"uppercase",background:"rgba(201,150,26,0.12)",color:"#E8B84B",padding:"2px 8px",borderRadius:2 }}>{v.category}</span>
                  <span style={{ fontSize:"0.6rem",letterSpacing:"0.08em",textTransform:"uppercase",color:"#8A6520",padding:"2px 8px",borderRadius:2,border:"1px solid rgba(201,150,26,0.15)" }}>{v.video_type}</span>
                </div>
                <div style={{ fontSize:"0.93rem",fontWeight:500,color:"#FDF8EF",marginBottom:3 }}>{v.title}</div>
                {v.location_tag&&<div style={{ fontSize:"0.72rem",color:"#C4A97A",marginBottom:10 }}>📍 {v.location_tag}</div>}
                <div style={{ display:"flex",gap:8,marginTop:10 }}>
                  <button onClick={()=>{setForm({...v});setEditing(v.id);setShowForm(true);}} className="ah-btn-outline" style={{ flex:1,padding:"7px 0",fontSize:"0.72rem" }}>Edit</button>
                  <button onClick={()=>del(v.id)} className="ah-btn-danger" style={{ flex:1 }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
