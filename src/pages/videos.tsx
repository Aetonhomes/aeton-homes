import { useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Particles from "../components/Particles";
import { useContent, useApi } from "../lib/useContent";

const CATS = ["All","Tour","Promo","Testimonial","Development Update","Aerial"];

export default function Videos() {
  const { content } = useContent();
  const [cat, setCat] = useState("All");
  const { data: videos, loading } = useApi<any[]>(`/api/videos?category=${encodeURIComponent(cat)}`, [cat]);
  const [active, setActive] = useState<any>(null);

  const getUrl = (v: any) => {
    if (v.video_type==="youtube"){const id=v.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];return id?`https://www.youtube.com/embed/${id}?autoplay=1`:v.video_url;}
    if (v.video_type==="vimeo"){const id=v.video_url.match(/vimeo\.com\/(\d+)/)?.[1];return id?`https://player.vimeo.com/video/${id}?autoplay=1`:v.video_url;}
    return v.video_url;
  };

  return (
    <div style={{ background:"#3D0A0A",color:"#FDF8EF",minHeight:"100vh" }}>
      <Particles />
      <Nav content={content} />
      <section style={{ position:"relative",padding:"160px 5% 60px",textAlign:"center",background:"linear-gradient(to bottom,#1A0404,#3D0A0A)" }}>
        <p style={{ fontSize:"0.7rem",letterSpacing:"0.3em",textTransform:"uppercase",color:"#C9961A",marginBottom:12 }}>Visual Tours</p>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2.5rem,6vw,5rem)",fontWeight:300,color:"#FDF8EF" }}>
          Property <em style={{ fontStyle:"italic",color:"#E8B84B" }}>Videos</em>
        </h1>
        <p style={{ fontSize:"0.9rem",color:"#C4A97A",maxWidth:500,margin:"14px auto 0",lineHeight:1.8 }}>
          Explore Nairobi's finest properties through immersive video tours, aerial views, and client stories.
        </p>
      </section>

      <div style={{ padding:"0 5% 50px",display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center" }}>
        {CATS.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{ padding:"8px 20px",border:"1px solid",borderColor:cat===c?"#C9961A":"rgba(201,150,26,0.22)",background:cat===c?"linear-gradient(135deg,#C9961A,#E8B84B)":"transparent",color:cat===c?"#3D0A0A":"#C4A97A",cursor:"pointer",fontFamily:"'Jost',sans-serif",fontSize:"0.74rem",letterSpacing:"0.12em",textTransform:"uppercase",borderRadius:2,transition:"all 0.3s" }}>{c}</button>
        ))}
      </div>

      <section style={{ padding:"0 5% 100px",position:"relative",zIndex:2 }}>
        {loading?(
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:26 }}>
            {[...Array(6)].map((_,i)=><div key={i} className="shimmer" style={{ borderRadius:4,aspectRatio:"16/9" }}/>)}
          </div>
        ):!videos||videos.length===0?(
          <div style={{ textAlign:"center",padding:"80px 0" }}>
            <div style={{ fontSize:"4rem",marginBottom:20,opacity:0.2 }}>🎬</div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",color:"#C4A97A",fontStyle:"italic" }}>No videos in this category yet.</p>
          </div>
        ):(
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:26 }}>
            {videos.map((v:any)=>(
              <div key={v.id} className="ah-card" style={{ overflow:"hidden",cursor:"pointer",transition:"transform 0.3s,border-color 0.3s" }}
                onMouseEnter={e=>{const el=e.currentTarget;el.style.transform="translateY(-6px)";el.style.borderColor="rgba(201,150,26,0.4)";}}
                onMouseLeave={e=>{const el=e.currentTarget;el.style.transform="";el.style.borderColor="rgba(201,150,26,0.12)";}}>
                <div onClick={()=>setActive(v)} style={{ position:"relative",aspectRatio:"16/9",background:"#1A0404",overflow:"hidden" }}>
                  {v.thumbnail_url?<img src={v.thumbnail_url} alt={v.title} style={{ width:"100%",height:"100%",objectFit:"cover" }}/>:<div style={{ width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#2A0606,#1A0404)" }}><span style={{ fontSize:"3rem",opacity:0.2 }}>🎬</span></div>}
                  <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.22)" }}>
                    <div style={{ width:58,height:58,borderRadius:"50%",background:"linear-gradient(135deg,#C9961A,#E8B84B)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 30px rgba(201,150,26,0.35)" }}>
                      <span style={{ color:"#3D0A0A",fontSize:"1.3rem",marginLeft:4 }}>▶</span>
                    </div>
                  </div>
                  {v.featured&&<span style={{ position:"absolute",top:10,right:10,background:"linear-gradient(135deg,#C9961A,#E8B84B)",color:"#3D0A0A",padding:"2px 8px",borderRadius:2,fontSize:"0.58rem",fontWeight:600,textTransform:"uppercase" }}>★ Featured</span>}
                </div>
                <div style={{ padding:"14px 18px" }}>
                  <div style={{ display:"flex",gap:8,marginBottom:8,flexWrap:"wrap",alignItems:"center" }}>
                    <span style={{ fontSize:"0.6rem",letterSpacing:"0.1em",textTransform:"uppercase",background:"rgba(201,150,26,0.12)",color:"#E8B84B",padding:"2px 8px",borderRadius:2,border:"1px solid rgba(201,150,26,0.18)" }}>{v.category}</span>
                    {v.location_tag&&<span style={{ fontSize:"0.72rem",color:"#C4A97A" }}>📍 {v.location_tag}</span>}
                  </div>
                  <div style={{ fontSize:"0.96rem",fontWeight:500,color:"#FDF8EF",marginBottom:4 }}>{v.title}</div>
                  {v.description&&<div style={{ fontSize:"0.78rem",color:"#C4A97A",lineHeight:1.6,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical" }}>{v.description}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {active&&(
        <div onClick={()=>setActive(null)} style={{ position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.92)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"100%",maxWidth:900 }}>
            <div style={{ position:"relative",paddingTop:"56.25%" }}>
              <iframe src={getUrl(active)} style={{ position:"absolute",inset:0,width:"100%",height:"100%",border:"none",borderRadius:4 }} allow="autoplay;fullscreen" allowFullScreen/>
            </div>
            <div style={{ marginTop:18,display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
              <div>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",color:"#FDF8EF" }}>{active.title}</h3>
                <div style={{ display:"flex",gap:12,marginTop:6 }}>
                  <span style={{ fontSize:"0.72rem",color:"#E8B84B",letterSpacing:"0.1em",textTransform:"uppercase" }}>{active.category}</span>
                  {active.location_tag&&<span style={{ fontSize:"0.72rem",color:"#C4A97A" }}>📍 {active.location_tag}</span>}
                </div>
                {active.description&&<p style={{ fontSize:"0.85rem",color:"#C4A97A",marginTop:8,lineHeight:1.6 }}>{active.description}</p>}
              </div>
              <button onClick={()=>setActive(null)} className="ah-btn-outline" style={{ padding:"8px 16px",whiteSpace:"nowrap" }}>✕ Close</button>
            </div>
          </div>
        </div>
      )}
      <Footer content={content} />
    </div>
  );
}
