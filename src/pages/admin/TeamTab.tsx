import { useState, useEffect } from "react";
import { showToast } from "./index";

const API = import.meta.env.VITE_API_URL || "";
const EMPTY = { name:"",role:"",bio:"",photo_url:"",order_index:0,active:true };

export default function TeamTab({ token }: { token: string }) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(EMPTY);
  const [editing, setEditing] = useState<number|null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const hdrs = { "Content-Type":"application/json","Authorization":`Bearer ${token}` };

  const load = () => { setLoading(true); fetch(`${API}/api/team/all`,{headers:{"Authorization":`Bearer ${token}`}}).then(r=>r.json()).then(d=>{setList(d);setLoading(false);}); };
  useEffect(()=>load(),[]);

  const compressImage = (file: File): Promise<Blob> => new Promise((resolve) => {
    const img = new Image(); const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1200; let {width,height} = img;
      if (width>MAX||height>MAX){if(width>height){height=Math.round(height*MAX/width);width=MAX;}else{width=Math.round(width*MAX/height);height=MAX;}}
      const canvas=document.createElement("canvas"); canvas.width=width; canvas.height=height;
      canvas.getContext("2d")!.drawImage(img,0,0,width,height);
      URL.revokeObjectURL(url);
      canvas.toBlob(b=>resolve(b!),"image/jpeg",0.78);
    }; img.src=url;
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const fd = new FormData(); fd.append("image", compressed, "photo.jpg");
      const res = await fetch(`${API}/api/upload`,{method:"POST",headers:{"Authorization":`Bearer ${token}`},body:fd});
      const {url} = await res.json();
      setForm((f:any)=>({...f,photo_url:url}));
      showToast("Photo uploaded!");
    } catch { showToast("Upload failed","error"); } finally { setUploading(false); }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await fetch(`${API}/api/team/${editing}`,{method:"PUT",headers:hdrs,body:JSON.stringify(form)}); showToast("Updated!"); }
      else { await fetch(`${API}/api/team`,{method:"POST",headers:hdrs,body:JSON.stringify(form)}); showToast("Added!"); }
      setShowForm(false); load();
    } catch { showToast("Failed","error"); } finally { setSaving(false); }
  };

  const del = async (id:number) => {
    if (!confirm("Delete?")) return;
    await fetch(`${API}/api/team/${id}`,{method:"DELETE",headers:{"Authorization":`Bearer ${token}`}});
    showToast("Deleted."); load();
  };

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:26 }}>
        <div><h2 className="ah-section-title">Team Members</h2><p style={{ fontSize:"0.8rem",color:"#C4A97A",marginTop:4 }}>CEO, agents, and staff</p></div>
        <button onClick={()=>{setForm({...EMPTY});setEditing(null);setShowForm(true);}} className="ah-btn-gold">+ Add Member</button>
      </div>

      {showForm&&(
        <div className="ah-card" style={{ padding:28,marginBottom:28 }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",color:"#FDF8EF",marginBottom:20 }}>{editing?"Edit":"Add"} Team Member</h3>
          <form onSubmit={save}>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px 20px",marginBottom:18 }}>
              <div><label className="ah-label">Full Name *</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="ah-input"/></div>
              <div><label className="ah-label">Role / Title</label><input value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="ah-input" placeholder="Founder & CEO"/></div>
              <div style={{ gridColumn:"1/-1" }}><label className="ah-label">Bio</label><textarea value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} rows={4} className="ah-input" style={{ resize:"vertical" }} placeholder="Brief biography..."/></div>
              <div style={{ gridColumn:"1/-1" }}>
                <label className="ah-label">Photo</label>
                <div style={{ display:"flex",gap:12,alignItems:"flex-start",flexWrap:"wrap" }}>
                  <input value={form.photo_url} onChange={e=>setForm({...form,photo_url:e.target.value})} className="ah-input" style={{ flex:1,minWidth:180 }} placeholder="Paste photo URL or upload"/>
                  <label style={{ cursor:"pointer",flexShrink:0 }}>
                    <span className="ah-btn-outline" style={{ display:"inline-block",padding:"10px 16px",fontSize:"0.74rem" }}>{uploading?"Uploading...":"📁 Upload Photo"}</span>
                    <input type="file" accept="image/*" style={{ display:"none" }} onChange={handleUpload} disabled={uploading}/>
                  </label>
                </div>
                {form.photo_url&&<img src={form.photo_url} alt="Preview" style={{ marginTop:10,height:120,width:"auto",objectFit:"cover",borderRadius:3,border:"1px solid rgba(201,150,26,0.2)" }} onError={e=>{(e.target as HTMLImageElement).style.display="none";}}/>}
              </div>
              <div><label className="ah-label">Display Order</label><input type="number" value={form.order_index} onChange={e=>setForm({...form,order_index:parseInt(e.target.value)||0})} className="ah-input" min={0}/></div>
              <div style={{ display:"flex",alignItems:"center",gap:8,paddingTop:24 }}>
                <label style={{ display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:"0.82rem",color:"#C4A97A" }}>
                  <input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})} style={{ width:15,height:15 }}/>
                  Active (visible on site)
                </label>
              </div>
            </div>
            <div style={{ display:"flex",gap:10 }}>
              <button type="submit" disabled={saving} className="ah-btn-gold">{saving?"Saving...":editing?"Update":"Add Member"}</button>
              <button type="button" onClick={()=>setShowForm(false)} className="ah-btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading?<p style={{ color:"#C4A97A" }}>Loading...</p>:list.length===0?(
        <div style={{ textAlign:"center",padding:"60px 0",color:"#C4A97A" }}>
          <div style={{ fontSize:"3rem",marginBottom:14,opacity:0.2 }}>👤</div>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontStyle:"italic" }}>No team members yet.</p>
        </div>
      ):(
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:18 }}>
          {list.map(m=>(
            <div key={m.id} className="ah-card" style={{ overflow:"hidden" }}>
              <div style={{ height:200,background:"linear-gradient(135deg,#2A0606,#1A0404)",overflow:"hidden" }}>
                {m.photo_url?<img src={m.photo_url} alt={m.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e=>{(e.target as HTMLImageElement).style.display="none";}}/>:<div style={{ width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"3rem",opacity:0.12 }}>👤</div>}
              </div>
              <div style={{ padding:16 }}>
                <div style={{ fontSize:"0.96rem",fontWeight:500,color:"#FDF8EF",marginBottom:3 }}>{m.name}</div>
                <div style={{ fontSize:"0.7rem",letterSpacing:"0.15em",textTransform:"uppercase",color:"#C9961A",marginBottom:8 }}>{m.role}</div>
                {m.bio&&<p style={{ fontSize:"0.78rem",color:"#C4A97A",lineHeight:1.6,marginBottom:12,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical" }}>{m.bio}</p>}
                <div style={{ display:"flex",gap:8 }}>
                  <button onClick={()=>{setForm({...m});setEditing(m.id);setShowForm(true);}} className="ah-btn-outline" style={{ flex:1,padding:"7px 0",fontSize:"0.72rem" }}>Edit</button>
                  <button onClick={()=>del(m.id)} className="ah-btn-danger" style={{ flex:1 }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
