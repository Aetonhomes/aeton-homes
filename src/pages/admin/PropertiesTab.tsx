import { useState, useEffect } from "react";
import { showToast } from "./index";

const API = import.meta.env.VITE_API_URL || "";
const EMPTY = { title:"",subtitle:"",description:"",price:"",price_suffix:"",type:"sale",beds:3,baths:2,sqm:150,location:"",image_url:"",images:[],property_videos:[],featured:false,active:true,order_index:0 };

export default function PropertiesTab({ token }: { token: string }) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({...EMPTY});
  const [editing, setEditing] = useState<number|null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const hdrs = { "Content-Type":"application/json","Authorization":`Bearer ${token}` };

  const load = () => { setLoading(true); fetch(`${API}/api/properties/all`,{headers:{"Authorization":`Bearer ${token}`}}).then(r=>r.json()).then(d=>{setList(Array.isArray(d)?d:[]);setLoading(false);}); };
  useEffect(()=>{ load(); },[]);

  const openAdd = () => { setForm({...EMPTY,images:[],property_videos:[]}); setEditing(null); setShowForm(true); };
  const openEdit = (p:any) => {
    let imgs:string[] = [];
    try { imgs = Array.isArray(p.images) ? p.images : JSON.parse(p.images||'[]'); } catch { imgs=[]; }
    let vids:any[] = [];
    try { vids = Array.isArray(p.property_videos) ? p.property_videos : JSON.parse(p.property_videos||'[]'); } catch { vids=[]; }
    setForm({...p, images:imgs, property_videos:vids});
    setEditing(p.id); setShowForm(true);
  };

  // Add a video entry (YouTube/Vimeo URL or direct mp4 URL)
  const addVideo = () => {
    setForm((f:any) => ({
      ...f,
      property_videos: [...(f.property_videos||[]), { type:"youtube", url:"", label:"" }]
    }));
  };
  const updateVideo = (idx:number, key:string, val:string) => {
    setForm((f:any) => {
      const vids = [...(f.property_videos||[])];
      vids[idx] = { ...vids[idx], [key]: val };
      return { ...f, property_videos: vids };
    });
  };
  const removeVideo = (idx:number) => {
    setForm((f:any) => ({ ...f, property_videos: (f.property_videos||[]).filter((_:any,i:number)=>i!==idx) }));
  };

  // Compress image client-side before upload (canvas resize → max 1200px, JPEG 0.78)
  const compressImage = (file: File): Promise<Blob> => new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1200;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
        else { width = Math.round(width * MAX / height); height = MAX; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      canvas.toBlob(b => resolve(b!), "image/jpeg", 0.78);
    };
    img.src = url;
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const compressed = await compressImage(file);
        const fd = new FormData();
        fd.append("image", compressed, file.name.replace(/\.[^.]+$/, ".jpg"));
        const res = await fetch(`${API}/api/upload`,{method:"POST",headers:{"Authorization":`Bearer ${token}`},body:fd});
        if (!res.ok) throw new Error(await res.text());
        const { url } = await res.json();
        urls.push(url);
      }
      setForm((f:any) => {
        const existing = Array.isArray(f.images) ? f.images : [];
        const merged = [...existing, ...urls];
        return { ...f, images: merged, image_url: merged[0] || f.image_url };
      });
      showToast(`${urls.length} image(s) uploaded!`);
    } catch(err) { showToast("Upload failed","error"); console.error(err); } finally { setUploading(false); e.target.value=""; }
  };

  const removeImage = (idx:number) => {
    setForm((f:any) => {
      const imgs = f.images.filter((_:any,i:number)=>i!==idx);
      return { ...f, images: imgs, image_url: imgs[0] || "" };
    });
  };

  const moveImage = (from:number, to:number) => {
    setForm((f:any) => {
      const imgs = [...f.images];
      const [moved] = imgs.splice(from,1); imgs.splice(to,0,moved);
      return { ...f, images: imgs, image_url: imgs[0] || "" };
    });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = {
        ...form,
        images: Array.isArray(form.images) ? form.images : [],
        image_url: form.images?.[0] || form.image_url || "",
        property_videos: Array.isArray(form.property_videos) ? form.property_videos.filter((v:any)=>v.url?.trim()) : [],
      };
      if (editing) { await fetch(`${API}/api/properties/${editing}`,{method:"PUT",headers:hdrs,body:JSON.stringify(payload)}); showToast("Property updated!"); }
      else { await fetch(`${API}/api/properties`,{method:"POST",headers:hdrs,body:JSON.stringify(payload)}); showToast("Property added!"); }
      setShowForm(false); load();
    } catch { showToast("Failed to save","error"); } finally { setSaving(false); }
  };

  const del = async (id:number) => {
    if (!confirm("Delete this property?")) return;
    await fetch(`${API}/api/properties/${id}`,{method:"DELETE",headers:{"Authorization":`Bearer ${token}`}});
    showToast("Deleted."); load();
  };

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:26,flexWrap:"wrap",gap:12 }}>
        <div>
          <h2 className="ah-section-title">Properties</h2>
          <p style={{ fontSize:"0.8rem",color:"#C4A97A",marginTop:4 }}>{list.length} listings</p>
        </div>
        <button onClick={openAdd} className="ah-btn-gold">+ Add Property</button>
      </div>

      {showForm&&(
        <div className="ah-card" style={{ padding:28,marginBottom:28 }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",color:"#FDF8EF",marginBottom:22 }}>{editing?"Edit Property":"Add Property"}</h3>
          <form onSubmit={save}>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"14px 18px",marginBottom:20 }}>
              <div style={{ gridColumn:"1/-1" }}><label className="ah-label">Title *</label><input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="ah-input"/></div>
              <div style={{ gridColumn:"1/-1" }}><label className="ah-label">Subtitle</label><input value={form.subtitle} onChange={e=>setForm({...form,subtitle:e.target.value})} className="ah-input" placeholder="Optional short subtitle"/></div>
              <div><label className="ah-label">Price *</label><input required value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="ah-input" placeholder="KES 45,000,000"/></div>
              <div><label className="ah-label">Price Suffix</label><input value={form.price_suffix} onChange={e=>setForm({...form,price_suffix:e.target.value})} className="ah-input" placeholder="/mo"/></div>
              <div>
                <label className="ah-label">Type</label>
                <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="ah-input" style={{ appearance:"none" }}>
                  <option value="sale" style={{background:"#1A0303"}}>For Sale</option>
                  <option value="rent" style={{background:"#1A0303"}}>For Rent</option>
                </select>
              </div>
              <div><label className="ah-label">Location *</label><input required value={form.location} onChange={e=>setForm({...form,location:e.target.value})} className="ah-input" placeholder="Karen, Nairobi"/></div>
              <div><label className="ah-label">Bedrooms</label><input type="number" value={form.beds} onChange={e=>setForm({...form,beds:parseInt(e.target.value)||0})} className="ah-input" min={0}/></div>
              <div><label className="ah-label">Bathrooms</label><input type="number" value={form.baths} onChange={e=>setForm({...form,baths:parseInt(e.target.value)||0})} className="ah-input" min={0}/></div>
              <div><label className="ah-label">Size (m²)</label><input type="number" value={form.sqm} onChange={e=>setForm({...form,sqm:parseInt(e.target.value)||0})} className="ah-input" min={0}/></div>
              <div><label className="ah-label">Display Order</label><input type="number" value={form.order_index} onChange={e=>setForm({...form,order_index:parseInt(e.target.value)||0})} className="ah-input" min={0}/></div>
              <div style={{ gridColumn:"1/-1" }}>
                <label className="ah-label">Description</label>
                <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3} className="ah-input" style={{ resize:"vertical" }}/>
              </div>

              {/* ── Multi-image upload ── */}
              <div style={{ gridColumn:"1/-1" }}>
                <label className="ah-label">Property Images ({(form.images||[]).length} uploaded)</label>
                <div style={{ display:"flex",gap:10,alignItems:"center",marginBottom:12,flexWrap:"wrap" }}>
                  <label style={{ cursor:"pointer" }}>
                    <span className="ah-btn-outline" style={{ display:"inline-block",padding:"9px 16px",fontSize:"0.74rem" }}>
                      {uploading?"Uploading...":"📁 Upload Images (multiple)"}
                    </span>
                    <input type="file" accept="image/*" multiple style={{ display:"none" }} onChange={handleUpload} disabled={uploading}/>
                  </label>
                  <span style={{ fontSize:"0.72rem",color:"#8A6520" }}>First image = main. Drag to reorder.</span>
                </div>

                {/* Image grid preview */}
                {(form.images||[]).length > 0 && (
                  <div style={{ display:"flex",flexWrap:"wrap",gap:10,marginBottom:10 }}>
                    {(form.images||[]).map((url:string,i:number)=>(
                      <div key={i} style={{ position:"relative",width:90,height:70,borderRadius:3,overflow:"hidden",border:i===0?"2px solid #C9961A":"1px solid rgba(201,150,26,0.2)",flexShrink:0 }}>
                        <img src={url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e=>{(e.target as HTMLImageElement).style.display="none";}}/>
                        {i===0&&<div style={{ position:"absolute",bottom:0,left:0,right:0,background:"rgba(201,150,26,0.85)",fontSize:"0.55rem",textAlign:"center",color:"#3D0A0A",fontWeight:700,padding:"2px 0",letterSpacing:"0.08em" }}>MAIN</div>}
                        <div style={{ position:"absolute",top:2,right:2,display:"flex",gap:2 }}>
                          {i>0&&<button type="button" onClick={()=>moveImage(i,i-1)} style={{ width:16,height:16,background:"rgba(0,0,0,0.7)",border:"none",color:"#E8B84B",borderRadius:2,cursor:"pointer",fontSize:"0.6rem",lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center" }}>←</button>}
                          <button type="button" onClick={()=>removeImage(i)} style={{ width:16,height:16,background:"rgba(200,50,50,0.8)",border:"none",color:"white",borderRadius:2,cursor:"pointer",fontSize:"0.65rem",lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center" }}>×</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Also allow URL input for first image */}
                <div>
                  <label className="ah-label" style={{ marginTop:8 }}>Or paste image URL</label>
                  <input value={form.image_url} onChange={e=>{
                    const url = e.target.value;
                    setForm((f:any)=>{
                      const imgs = Array.isArray(f.images) ? [...f.images] : [];
                      if (url && !imgs.includes(url)) imgs.unshift(url);
                      return { ...f, image_url: url, images: imgs };
                    });
                  }} className="ah-input" placeholder="https://..."/>
                </div>
              </div>

              {/* ── Property Videos ── */}
              <div style={{ gridColumn:"1/-1" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                  <label className="ah-label" style={{ marginBottom:0 }}>Property Videos ({(form.property_videos||[]).length})</label>
                  <button type="button" onClick={addVideo} className="ah-btn-outline" style={{ padding:"5px 14px", fontSize:"0.72rem" }}>+ Add Video</button>
                </div>
                {(form.property_videos||[]).length === 0 && (
                  <p style={{ fontSize:"0.78rem", color:"#6B4F20", fontStyle:"italic" }}>No videos yet. Add a YouTube, Vimeo, or direct MP4 URL.</p>
                )}
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {(form.property_videos||[]).map((v:any, idx:number) => (
                    <div key={idx} style={{ display:"grid", gridTemplateColumns:"120px 1fr auto", gap:10, alignItems:"center", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(201,150,26,0.12)", borderRadius:3, padding:"10px 14px" }}>
                      <select value={v.type} onChange={e=>updateVideo(idx,"type",e.target.value)} className="ah-input" style={{ appearance:"none", fontSize:"0.78rem" }}>
                        <option value="youtube" style={{background:"#1A0303"}}>YouTube</option>
                        <option value="vimeo"   style={{background:"#1A0303"}}>Vimeo</option>
                        <option value="mp4"     style={{background:"#1A0303"}}>Direct MP4</option>
                      </select>
                      <input
                        value={v.url}
                        onChange={e=>updateVideo(idx,"url",e.target.value)}
                        className="ah-input"
                        placeholder={
                          v.type==="youtube" ? "https://youtu.be/..." :
                          v.type==="vimeo"   ? "https://vimeo.com/..." :
                          "https://example.com/video.mp4"
                        }
                      />
                      <button type="button" onClick={()=>removeVideo(idx)} style={{ background:"rgba(200,50,50,0.15)", border:"1px solid rgba(200,50,50,0.3)", color:"#f87171", width:32, height:32, borderRadius:3, cursor:"pointer", fontSize:"1rem", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>×</button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display:"flex",gap:24,gridColumn:"1/-1" }}>
                <label style={{ display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:"0.82rem",color:"#C4A97A" }}>
                  <input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} style={{ width:15,height:15 }}/>
                  Mark as Featured
                </label>
                <label style={{ display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:"0.82rem",color:"#C4A97A" }}>
                  <input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})} style={{ width:15,height:15 }}/>
                  Active (visible on site)
                </label>
              </div>
            </div>
            <div style={{ display:"flex",gap:10 }}>
              <button type="submit" disabled={saving} className="ah-btn-gold">{saving?"Saving...":editing?"Update Property":"Add Property"}</button>
              <button type="button" onClick={()=>setShowForm(false)} className="ah-btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading?<p style={{ color:"#C4A97A" }}>Loading...</p>:list.length===0?(
        <div style={{ textAlign:"center",padding:"60px 0",color:"#C4A97A" }}>
          <div style={{ fontSize:"3rem",marginBottom:14,opacity:0.2 }}>🏠</div>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontStyle:"italic" }}>No properties yet. Add your first one!</p>
        </div>
      ):(
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:18 }}>
          {list.map(p=>{
            let imgs:string[]=[];
            try{imgs=Array.isArray(p.images)?p.images:JSON.parse(p.images||'[]');}catch{imgs=[];}
            let pvids:any[]=[];
            try{pvids=Array.isArray(p.property_videos)?p.property_videos:JSON.parse(p.property_videos||'[]');}catch{pvids=[];}
            const mainImg = imgs[0] || p.image_url;
            return (
              <div key={p.id} className="ah-card" style={{ overflow:"hidden" }}>
                <div style={{ height:160,overflow:"hidden",background:"#1A0404",position:"relative" }}>
                  {mainImg?<img src={mainImg} alt={p.title} style={{ width:"100%",height:"100%",objectFit:"cover" }} onError={e=>{(e.target as HTMLImageElement).src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=60";}}/>:<div style={{ width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2.5rem",opacity:0.15 }}>🏠</div>}
                  <div style={{ position:"absolute",top:8,left:8,display:"flex",gap:6 }}>
                    <span style={{ fontSize:"0.6rem",fontWeight:600,textTransform:"uppercase",padding:"2px 8px",borderRadius:2,background:p.type==="sale"?"#C9961A":"rgba(201,150,26,0.2)",color:p.type==="sale"?"#3D0A0A":"#E8B84B" }}>{p.type==="sale"?"Sale":"Rent"}</span>
                    {p.featured&&<span style={{ fontSize:"0.6rem",fontWeight:600,textTransform:"uppercase",padding:"2px 8px",borderRadius:2,background:"rgba(201,150,26,0.3)",color:"#E8B84B" }}>★</span>}
                    {!p.active&&<span style={{ fontSize:"0.6rem",fontWeight:600,textTransform:"uppercase",padding:"2px 8px",borderRadius:2,background:"rgba(100,100,100,0.5)",color:"#aaa" }}>Hidden</span>}
                    {imgs.length>1&&<span style={{ fontSize:"0.6rem",fontWeight:600,textTransform:"uppercase",padding:"2px 8px",borderRadius:2,background:"rgba(0,0,0,0.5)",color:"#E8B84B" }}>📷{imgs.length}</span>}
                    {pvids.length>0&&<span style={{ fontSize:"0.6rem",fontWeight:600,textTransform:"uppercase",padding:"2px 8px",borderRadius:2,background:"rgba(0,0,0,0.5)",color:"#C4A97A" }}>🎬{pvids.length}</span>}
                  </div>
                </div>
                <div style={{ padding:16 }}>
                  <div style={{ fontSize:"0.96rem",fontWeight:500,color:"#FDF8EF",marginBottom:3 }}>{p.title}</div>
                  <div style={{ fontSize:"0.85rem",color:"#E8B84B",marginBottom:3 }}>{p.price}{p.price_suffix}</div>
                  <div style={{ fontSize:"0.74rem",color:"#C4A97A",marginBottom:12 }}>📍{p.location} · {p.beds}bd {p.baths}ba</div>
                  <div style={{ display:"flex",gap:8 }}>
                    <button onClick={()=>openEdit(p)} className="ah-btn-outline" style={{ flex:1,padding:"7px 0",fontSize:"0.72rem" }}>Edit</button>
                    <button onClick={()=>del(p.id)} className="ah-btn-danger" style={{ flex:1 }}>Delete</button>
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
