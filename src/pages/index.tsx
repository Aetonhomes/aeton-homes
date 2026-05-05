import { useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Particles from "../components/Particles";
import { useContent, useApi } from "../lib/useContent";
import { c, DEFAULTS } from "../lib/defaults";

export default function Index() {
  const { content, loading } = useContent();
  const { data: properties } = useApi<any[]>("/api/properties");
  const { data: testimonialsList } = useApi<any[]>("/api/testimonials");
  const { data: teamList } = useApi<any[]>("/api/team");
  const { data: featuredVideos } = useApi<any[]>("/api/videos");
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [tab, setTab] = useState("Buy");

  // Reveal
  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }), { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [loading, properties, testimonialsList]);

  // Stats counter
  useEffect(() => {
    if (!statsRef.current || statsAnimated || loading) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setStatsAnimated(true);
      [1,2,3,4].forEach(i => {
        const el = document.querySelector(`[data-stat="${i}"]`);
        if (!el) return;
        const raw = c(content, `stat_${i}_num`);
        const end = parseInt(raw.replace(/\D/g, "")) || 0;
        const suffix = raw.replace(/[0-9]/g, "");
        let s = 0;
        const step = () => {
          s += end / 80;
          (el as HTMLElement).textContent = Math.min(Math.floor(s), end) + suffix;
          if (s < end) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, [loading, statsAnimated]);

  const marqueeItems = (() => {
    try { return JSON.parse(c(content, "marquee_items")); } catch { return DEFAULTS.marquee_items ? JSON.parse(DEFAULTS.marquee_items) : []; }
  })();

  const getEmbedUrl = (v: any) => {
    if (v.video_type === "youtube") {
      const id = v.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : v.video_url;
    }
    if (v.video_type === "vimeo") {
      const id = v.video_url.match(/vimeo\.com\/(\d+)/)?.[1];
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : v.video_url;
    }
    return v.video_url;
  };

  return (
    <div style={{ background: "#3D0A0A", color: "#FDF8EF", minHeight: "100vh", overflowX: "hidden", width: "100%" }}>
      <Particles />
      <Nav content={content} />

      {/* ── HERO ── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: `radial-gradient(ellipse at 20% 50%, rgba(20,2,2,0.72) 0%, transparent 70%),
            linear-gradient(to bottom, rgba(10,1,1,0.55) 0%, rgba(30,4,4,0.75) 60%, rgba(10,1,1,0.95) 100%),
            url('https://jewelbookstore.neocities.org/property%208.jpeg') center/cover no-repeat`,
        }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          backgroundImage: "linear-gradient(rgba(201,150,26,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,150,26,0.05) 1px,transparent 1px)",
          backgroundSize: "80px 80px", animation: "gridShift 20s linear infinite",
        }} />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 5%", maxWidth: 920 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(201,150,26,0.12)", border: "1px solid rgba(201,150,26,0.3)",
            padding: "6px 18px", borderRadius: 50, fontSize: "0.72rem",
            letterSpacing: "0.2em", textTransform: "uppercase", color: "#E8B84B",
            marginBottom: 28, animation: "fadeInDown 0.8s ease forwards",
          }}>
            <span style={{ width: 6, height: 6, background: "#C9961A", borderRadius: "50%", animation: "pulse 2s infinite" }} />
            {c(content, "hero_badge")}
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(3rem, 8vw, 6.5rem)", fontWeight: 300, lineHeight: 1.05,
            color: "#FDF8EF", animation: "fadeInUp 0.9s 0.2s ease both",
          }}>
            {c(content, "hero_title")}<br />
            <em style={{ fontStyle: "italic", color: "#E8B84B" }}>{c(content, "hero_title_em")}</em><br />
            {c(content, "hero_title_end")}
          </h1>
          <p style={{
            fontSize: "clamp(0.85rem,1.5vw,1rem)", color: "#C4A97A",
            letterSpacing: "0.25em", textTransform: "uppercase", margin: "20px 0 40px",
            animation: "fadeInUp 0.9s 0.4s ease both",
          }}>{c(content, "hero_subtitle")}</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", animation: "fadeInUp 0.9s 0.6s ease both" }}>
            <a href="#properties" style={{ background: "linear-gradient(135deg,#C9961A,#E8B84B)", color: "#3D0A0A", padding: "16px 36px", textDecoration: "none", borderRadius: 2, fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              {c(content, "hero_btn1")}
            </a>
            <a href="#contact" style={{ background: "transparent", color: "#E8B84B", padding: "16px 36px", border: "1px solid rgba(201,150,26,0.4)", textDecoration: "none", borderRadius: 2, fontSize: "0.82rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              {c(content, "hero_btn2")}
            </a>
          </div>
        </div>

        <div ref={statsRef} style={{ position: "absolute", bottom: 60, left: 0, right: 0, zIndex: 2, display: "flex", justifyContent: "center", gap: 60, flexWrap: "wrap", padding: "0 20px" }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ textAlign: "center" }}>
              <div data-stat={i} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.4rem", fontWeight: 600, color: "#E8B84B", lineHeight: 1 }}>
                {c(content, `stat_${i}_num`)}
              </div>
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C4A97A", marginTop: 4 }}>
                {c(content, `stat_${i}_label`)}
              </div>
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", bottom: 20, left: "50%", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "#C4A97A", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", animation: "bounce 2s infinite" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8A6520" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
          Scroll
        </div>
      </section>

      {/* ── SEARCH ── */}
      <div className="reveal" style={{ position: "relative", zIndex: 10, marginTop: -40, padding: "0 5%" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", background: "rgba(12,2,2,0.93)", border: "1px solid rgba(201,150,26,0.25)", borderRadius: 4, padding: "28px 32px", backdropFilter: "blur(20px)", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
          <div style={{ display: "flex", marginBottom: 22, borderBottom: "1px solid rgba(201,150,26,0.18)" }}>
            {["Buy","Rent","Commercial","Land"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: "9px 22px", cursor: "pointer", background: "none", fontSize: "0.74rem", letterSpacing: "0.14em", textTransform: "uppercase", border: "none", fontFamily: "'Jost',sans-serif", borderBottom: `2px solid ${tab===t?"#C9961A":"transparent"}`, color: tab===t?"#E8B84B":"#C4A97A", marginBottom: -1, transition: "all 0.3s" }}>{t}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
            {[{label:"Location",opts:["All Locations","Westlands","Karen","Kilimani","Lavington","Runda","Muthaiga"]},{label:"Type",opts:["All Types","Apartment","Villa","Townhouse","Bungalow","Penthouse"]},{label:"Bedrooms",opts:["Any","1 Bed","2 Beds","3 Beds","4+ Beds"]},{label:"Budget (KES)",opts:["Any","Up to 5M","5M–15M","15M–30M","30M–60M","60M+"]}].map((f,i)=>(
              <div key={i} style={{ flex: 1, minWidth: 140 }}>
                <label className="ah-label">{f.label}</label>
                <select className="ah-input" style={{ appearance: "none" }}>
                  {f.opts.map(o=><option key={o} style={{background:"#3D0A0A"}}>{o}</option>)}
                </select>
              </div>
            ))}
            <button className="ah-btn-gold" style={{ padding: "11px 28px", whiteSpace: "nowrap" }}>Search</button>
          </div>
        </div>
      </div>

      {/* ── MARQUEE ── */}
      <div style={{ padding: "26px 0", overflow: "hidden", borderTop: "1px solid rgba(201,150,26,0.12)", borderBottom: "1px solid rgba(201,150,26,0.12)", background: "rgba(0,0,0,0.25)", marginTop: 40, maxWidth: "100vw" }}>
        <div className="marquee-track" style={{ width: "max-content" }}>
          {[...Array(2)].flatMap(() => marqueeItems).map((item: string, i: number) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 36px", fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8A6520", whiteSpace: "nowrap" }}>
              <span style={{ width: 5, height: 5, background: "#C9961A", borderRadius: "50%", display: "inline-block" }} />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ── PROPERTIES ── */}
      <section id="properties" style={{ position: "relative", zIndex: 2, padding: "100px 5%", background: "linear-gradient(to bottom, #3D0A0A, #1E0404)" }}>
        <div className="reveal" style={{ marginBottom: 56 }}>
          <p style={eyebrow}>{c(content,"props_eyebrow")}</p>
          <h2 style={secTitle}>{c(content,"props_title")} <em style={em}>{c(content,"props_title_em")}</em></h2>
          <p style={secSub}>{c(content,"props_subtitle")}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 26 }}>
          {(properties && properties.length > 0 ? properties : []).map((p: any) => (
            <PropCard key={p.id} p={p} />
          ))}
          {(!properties || properties.length === 0) && (
            <div style={{ gridColumn:"1/-1",textAlign:"center",padding:"60px 0",color:"#C4A97A" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontStyle:"italic",opacity:0.5 }}>Properties coming soon</div>
            </div>
          )}
        </div>
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <button className="ah-btn-outline" style={{ padding: "14px 36px" }}>View All Properties</button>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section id="why" style={{ position: "relative", zIndex: 2, padding: "100px 5%", background: "linear-gradient(to bottom,#1E0404,#3D0A0A)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="ah-two-col">
          <div className="reveal" style={{ position: "relative", aspectRatio: "4/5", maxHeight: 560, background: "linear-gradient(135deg,#2A0606,#4A0E0E)", border: "1px solid rgba(201,150,26,0.2)", borderRadius: 4, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              {["🏠","💎","📍","🤝","AH","📊","🔑","⭐","🌟"].map((icon,i)=>(
                <div key={i} style={{ width:70,height:70, background:icon==="AH"?"linear-gradient(135deg,rgba(201,150,26,0.4),rgba(201,150,26,0.2))":"linear-gradient(135deg,rgba(201,150,26,0.15),rgba(201,150,26,0.05))", clipPath:"polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)", display:"flex",alignItems:"center",justifyContent:"center", fontSize:icon==="AH"?"1rem":"1.4rem", color:icon==="AH"?"#3D0A0A":"#E8B84B", fontFamily:icon==="AH"?"'Cormorant Garamond',serif":undefined, fontWeight:icon==="AH"?700:undefined, animation:`hexPulse 3s ease-in-out ${i*0.3}s infinite` }}>
                  {icon}
                </div>
              ))}
            </div>
            <div style={{ position:"absolute",bottom:32,right:-24, background:"linear-gradient(135deg,#C9961A,#E8B84B)",color:"#3D0A0A", padding:"18px 22px",borderRadius:4,boxShadow:"0 20px 50px rgba(0,0,0,0.4)",animation:"floatBadge 4s ease-in-out infinite" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"2.2rem",fontWeight:700,lineHeight:1 }}>{c(content,"why_badge_num")}</div>
              <div style={{ fontSize:"0.62rem",letterSpacing:"0.12em" }}>{c(content,"why_badge_label")}</div>
            </div>
          </div>
          <div className="reveal">
            <p style={eyebrow}>{c(content,"why_eyebrow")}</p>
            <h2 style={secTitle}>{c(content,"why_title")} <em style={em}>{c(content,"why_title_em")}</em><br/>{c(content,"why_title_end")}</h2>
            <p style={{...secSub, marginBottom:32}}>{c(content,"why_subtitle")}</p>
            <div style={{ display:"flex",flexDirection:"column",gap:18 }}>
              {[1,2,3,4].map(i=>(
                <div key={i} style={{ display:"flex",gap:18,alignItems:"flex-start",padding:22,border:"1px solid rgba(201,150,26,0.1)",borderRadius:4,background:"rgba(255,255,255,0.02)" }}>
                  <div style={{ width:44,height:44,flexShrink:0,background:"rgba(201,150,26,0.08)",border:"1px solid rgba(201,150,26,0.2)",borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem" }}>
                    {c(content,`why_feat_${i}_icon`)||["🛡️","🚀","🕐","📊"][i-1]}
                  </div>
                  <div>
                    <div style={{ fontSize:"0.93rem",fontWeight:500,color:"#FDF8EF",marginBottom:5 }}>{c(content,`why_feat_${i}_title`)}</div>
                    <div style={{ fontSize:"0.82rem",color:"#C4A97A",lineHeight:1.7 }}>{c(content,`why_feat_${i}_desc`)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED VIDEOS ── */}
      {featuredVideos && featuredVideos.length > 0 && (
        <section style={{ position:"relative",zIndex:2,padding:"100px 5%",background:"linear-gradient(to bottom,#3D0A0A,#150202)" }}>
          <div className="reveal" style={{ marginBottom:56 }}>
            <p style={eyebrow}>{c(content,"videos_eyebrow")}</p>
            <h2 style={secTitle}>{c(content,"videos_title")} <em style={em}>{c(content,"videos_title_em")}</em></h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:26 }}>
            {featuredVideos.map((v:any)=><VideoCard key={v.id} video={v} />)}
          </div>
          <div style={{ textAlign:"center",marginTop:48 }}>
            <a href="/videos" className="ah-btn-outline" style={{ padding:"14px 36px",textDecoration:"none",display:"inline-block" }}>View All Videos</a>
          </div>
        </section>
      )}

      {/* ── PROCESS ── */}
      <section id="process" style={{ position:"relative",zIndex:2,padding:"100px 5%",textAlign:"center",background:"linear-gradient(to bottom,#150202,#3D0A0A)" }}>
        <div className="reveal" style={{ marginBottom:56 }}>
          <p style={eyebrow}>{c(content,"process_eyebrow")}</p>
          <h2 style={secTitle}>{c(content,"process_title")} <em style={em}>{c(content,"process_title_em")}</em></h2>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:0 }} className="ah-process-grid">
          {[1,2,3,4].map(i=>(
            <div key={i} style={{ padding:"0 20px" }}>
              <div style={{ width:76,height:76,margin:"0 auto 22px",background:"linear-gradient(135deg,rgba(201,150,26,0.12),rgba(201,150,26,0.04))",border:"1px solid rgba(201,150,26,0.28)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:600,color:"#E8B84B" }}>{i}</span>
              </div>
              <div style={{ fontSize:"0.93rem",fontWeight:500,color:"#FDF8EF",marginBottom:10 }}>{c(content,`process_step_${i}_title`)}</div>
              <div style={{ fontSize:"0.8rem",color:"#C4A97A",lineHeight:1.7 }}>{c(content,`process_step_${i}_desc`)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS (admin-managed) ── */}
      {testimonialsList && testimonialsList.length > 0 && (
      <section id="testimonials" style={{ position:"relative",zIndex:2,padding:"100px 5%",background:"linear-gradient(to bottom,#3D0A0A,#1E0404)" }}>
        <div className="reveal" style={{ marginBottom:56 }}>
          <p style={eyebrow}>{c(content,"testi_eyebrow")}</p>
          <h2 style={secTitle}>{c(content,"testi_title")} <em style={em}>{c(content,"testi_title_em")}</em></h2>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:22 }}>
          {testimonialsList.map((t:any,i:number)=>(
            <div key={t.id||i} className="reveal ah-card" style={{ padding:30 }}>
              <div style={{ color:"#C9961A",fontSize:"0.9rem",marginBottom:14,letterSpacing:3 }}>{"★".repeat(t.stars||5)}</div>
              <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",fontStyle:"italic",color:"#F0E6CE",lineHeight:1.7,marginBottom:22 }}>"{t.quote}"</p>
              <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                {t.avatar_url ? (
                  <img src={t.avatar_url} alt={t.name} style={{ width:42,height:42,borderRadius:"50%",objectFit:"cover" }} />
                ) : (
                  <div style={{ width:42,height:42,borderRadius:"50%",background:"linear-gradient(135deg,#8A6520,#C9961A)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:"#3D0A0A",fontWeight:700 }}>{t.name[0]}</div>
                )}
                <div>
                  <div style={{ fontSize:"0.85rem",fontWeight:500,color:"#FDF8EF" }}>{t.name}</div>
                  <div style={{ fontSize:"0.72rem",color:"#C4A97A" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* ── CLIENT REVIEWS ── */}
      <section id="reviews" style={{ position:"relative",zIndex:2,padding:"100px 5%",background:"linear-gradient(to bottom,#1E0404,#3D0A0A)" }}>
        <div className="reveal" style={{ marginBottom:56,textAlign:"center" }}>
          <p style={eyebrow}>Client Reviews</p>
          <h2 style={secTitle}>What Our <em style={em}>Clients Say</em></h2>
          <p style={{...secSub,margin:"0 auto"}}>Real experiences from people we've helped find their perfect property</p>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,maxWidth:1100,margin:"0 auto" }} className="ah-two-col">
          <PublicReviewsList />
          <PublicReviewForm />
        </div>
      </section>

      {/* ── TEAM ── */}
      <section id="team" style={{ position:"relative",zIndex:2,padding:"100px 5%",background:"linear-gradient(to bottom,#1E0404,#3D0A0A)" }}>
        <div className="reveal" style={{ marginBottom:56 }}>
          <p style={eyebrow}>{c(content,"team_eyebrow")}</p>
          <h2 style={secTitle}>{c(content,"team_title")} <em style={em}>{c(content,"team_title_em")}</em></h2>
        </div>
        {(teamList && teamList.length > 0) ? (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:28 }}>
            {teamList.map((m:any)=>(
              <div key={m.id} className="reveal ah-card" style={{ overflow:"hidden" }}>
                <div style={{ aspectRatio:"3/4",overflow:"hidden",background:"linear-gradient(135deg,#2A0606,#1A0404)" }}>
                  {m.photo_url ? (
                    <img src={m.photo_url} alt={m.name} style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} />
                  ) : (
                    <div style={{ width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"4rem",opacity:0.15 }}>👤</div>
                  )}
                </div>
                <div style={{ padding:22,borderTop:"1px solid rgba(201,150,26,0.1)" }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:600,color:"#FDF8EF",marginBottom:4 }}>{m.name}</div>
                  <div style={{ fontSize:"0.7rem",letterSpacing:"0.2em",textTransform:"uppercase",color:"#C9961A",marginBottom:10 }}>{m.role}</div>
                  <div style={{ fontSize:"0.8rem",color:"#C4A97A",lineHeight:1.7 }}>{m.bio}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="reveal" style={{ display:"grid",gridTemplateColumns:"340px 1fr",gap:60,alignItems:"start",maxWidth:1100 }} >
            <div style={{ borderRadius:4,overflow:"hidden",border:"1px solid rgba(201,150,26,0.25)",boxShadow:"0 24px 60px rgba(0,0,0,0.4)" }}>
              <div style={{ aspectRatio:"3/4",background:"linear-gradient(135deg,#2A0606,#1A0404)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"5rem",opacity:0.1 }}>👤</div>
            </div>
            <div style={{ paddingTop:10 }}>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",color:"#FDF8EF",marginBottom:6 }}>Our Chief Executive</h3>
              <p style={{ fontSize:"0.72rem",letterSpacing:"0.2em",textTransform:"uppercase",color:"#C9961A",marginBottom:24 }}>Founder & CEO, Aeton Homes</p>
              <p style={{ fontSize:"0.88rem",color:"#C4A97A",lineHeight:1.85,marginBottom:18 }}>
                With over 12 years of experience in Kenya's luxury real estate market, our CEO founded Aeton Homes with a singular vision: to make premium property accessible, transparent, and rewarding for every client.
              </p>
              <p style={{ fontSize:"0.88rem",color:"#C4A97A",lineHeight:1.85,fontStyle:"italic" }}>
                "Every property transaction is a life decision. We treat it with the gravity it deserves."
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ position:"relative",zIndex:2,padding:"100px 5%",background:"linear-gradient(to bottom,#3D0A0A,#0D0202)" }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"start" }} className="ah-two-col">
          <ContactForm />
          <div style={{ paddingTop:10 }}>
            <p style={eyebrow}>{c(content,"contact_eyebrow")}</p>
            <h2 style={{ ...secTitle,marginBottom:12 }}>{c(content,"contact_title")}<br/><em style={em}>{c(content,"contact_title_em")}</em></h2>
            <p style={{...secSub,marginBottom:38}}>{c(content,"contact_subtitle")}</p>
            <div style={{ display:"flex",flexDirection:"column",gap:22 }}>
              {[
                { icon:"📞",label:"Phone",key:"contact_phone" },
                { icon:"✉️",label:"Email",key:"contact_email" },
                { icon:"📍",label:"Office",key:"contact_address" },
              ].map((item,i)=>(
                <div key={i} style={{ display:"flex",gap:14,alignItems:"flex-start" }}>
                  <div style={{ width:42,height:42,flexShrink:0,background:"rgba(201,150,26,0.08)",border:"1px solid rgba(201,150,26,0.22)",borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem" }}>{item.icon}</div>
                  <div>
                    <div className="ah-label" style={{ marginBottom:3 }}>{item.label}</div>
                    <div style={{ fontSize:"0.92rem",color:"#FDF8EF" }}>{c(content,item.key)}</div>
                  </div>
                </div>
              ))}
            </div>
            <a href={`https://wa.me/${c(content,"contact_whatsapp")}`} style={{ display:"inline-flex",alignItems:"center",gap:10,background:"#25D366",color:"#fff",padding:"13px 26px",borderRadius:2,marginTop:30,textDecoration:"none",fontSize:"0.82rem",fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase" }}>
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer content={content} />

      <style>{`
        @media(max-width:900px){
          .ah-two-col{grid-template-columns:1fr!important;}
          .ah-two-col>div:first-child{display:none;}
          .ah-process-grid{grid-template-columns:repeat(2,1fr)!important;gap:36px!important;}
        }
      `}</style>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────

function PropCard({ p }: { p: any }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [touchStart, setTouchStart] = useState<number|null>(null);

  // Build images array: images field + image_url as fallback
  const allImages: string[] = (() => {
    let imgs: string[] = [];
    try { imgs = Array.isArray(p.images) ? p.images : JSON.parse(p.images || '[]'); } catch { imgs = []; }
    if (p.image_url && !imgs.includes(p.image_url)) imgs = [p.image_url, ...imgs];
    if (!imgs.length) imgs = ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"];
    return imgs;
  })();

  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setImgIdx(i => (i - 1 + allImages.length) % allImages.length); };
  const next = (e: React.MouseEvent) => { e.stopPropagation(); setImgIdx(i => (i + 1) % allImages.length); };

  return (
    <div className="ah-card" style={{ overflow:"hidden",cursor:"pointer",transition:"transform 0.4s,border-color 0.4s,box-shadow 0.4s" }}
      onMouseEnter={e=>{const el=e.currentTarget;el.style.transform="translateY(-8px)";el.style.borderColor="rgba(201,150,26,0.4)";el.style.boxShadow="0 24px 60px rgba(0,0,0,0.4)";}}
      onMouseLeave={e=>{const el=e.currentTarget;el.style.transform="";el.style.borderColor="rgba(201,150,26,0.12)";el.style.boxShadow="";}}>
      {/* Image swiper */}
      <div style={{ position:"relative",height:220,overflow:"hidden",background:"#1A0404",userSelect:"none" }}
        onTouchStart={e=>setTouchStart(e.touches[0].clientX)}
        onTouchEnd={e=>{
          if (touchStart===null) return;
          const diff = touchStart - e.changedTouches[0].clientX;
          if (Math.abs(diff)>40) diff>0 ? setImgIdx(i=>(i+1)%allImages.length) : setImgIdx(i=>(i-1+allImages.length)%allImages.length);
          setTouchStart(null);
        }}>
        <img src={allImages[imgIdx]} alt={p.title}
          style={{ width:"100%",height:"100%",objectFit:"cover",transition:"opacity 0.3s",display:"block" }}
          onError={(e)=>{(e.target as HTMLImageElement).src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80";}} />
        {/* Arrows — only show if multiple images */}
        {allImages.length > 1 && (<>
          <button onClick={prev} style={{ position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.55)",border:"none",color:"#E8B84B",width:28,height:28,borderRadius:"50%",cursor:"pointer",fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2 }}>‹</button>
          <button onClick={next} style={{ position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.55)",border:"none",color:"#E8B84B",width:28,height:28,borderRadius:"50%",cursor:"pointer",fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2 }}>›</button>
          {/* Dots */}
          <div style={{ position:"absolute",bottom:8,left:0,right:0,display:"flex",justifyContent:"center",gap:5,zIndex:2 }}>
            {allImages.map((_,i)=>(
              <button key={i} onClick={e=>{e.stopPropagation();setImgIdx(i);}} style={{ width:i===imgIdx?16:6,height:6,borderRadius:3,background:i===imgIdx?"#E8B84B":"rgba(255,255,255,0.4)",border:"none",cursor:"pointer",padding:0,transition:"all 0.25s" }}/>
            ))}
          </div>
          {/* Counter */}
          <div style={{ position:"absolute",top:8,right:8,background:"rgba(0,0,0,0.6)",color:"#E8B84B",fontSize:"0.65rem",padding:"2px 7px",borderRadius:10,zIndex:2 }}>{imgIdx+1}/{allImages.length}</div>
        </>)}
        <span style={{ position:"absolute",top:14,left:14,background:p.type==="sale"?"#C9961A":"rgba(201,150,26,0.2)",color:p.type==="sale"?"#3D0A0A":"#E8B84B",border:p.type==="rent"?"1px solid #8A6520":"none",padding:"4px 12px",borderRadius:2,fontSize:"0.62rem",fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",zIndex:2 }}>
          {p.type==="sale"?"For Sale":"For Rent"}
        </span>
      </div>
      <div style={{ padding:20 }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.6rem",fontWeight:600,color:"#E8B84B",marginBottom:5 }}>{p.price}{p.price_suffix&&<span style={{ fontSize:"0.78rem",fontFamily:"'Jost',sans-serif",fontWeight:300,color:"#C4A97A" }}>{p.price_suffix}</span>}</div>
        <div style={{ fontSize:"0.97rem",fontWeight:500,color:"#FDF8EF",marginBottom:5 }}>{p.title}</div>
        <div style={{ fontSize:"0.78rem",color:"#C4A97A",marginBottom:16 }}>📍 {p.location}</div>
        <div style={{ display:"flex",gap:18,paddingTop:16,borderTop:"1px solid rgba(201,150,26,0.1)" }}>
          {[{i:"🛏",v:`${p.beds} Beds`},{i:"🚿",v:`${p.baths} Baths`},{i:"📐",v:`${p.sqm} m²`}].map((f,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"center",gap:5,fontSize:"0.74rem",color:"#C4A97A" }}><span>{f.i}</span>{f.v}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VideoCard({ video }: { video: any }) {
  const [playing, setPlaying] = useState(false);
  const getUrl = () => {
    if (video.video_type==="youtube"){const id=video.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];return id?`https://www.youtube.com/embed/${id}?autoplay=1`:video.video_url;}
    if (video.video_type==="vimeo"){const id=video.video_url.match(/vimeo\.com\/(\d+)/)?.[1];return id?`https://player.vimeo.com/video/${id}?autoplay=1`:video.video_url;}
    return video.video_url;
  };
  return (
    <div className="ah-card" style={{ overflow:"hidden" }}>
      <div style={{ position:"relative",aspectRatio:"16/9",background:"#1A0404",cursor:"pointer" }} onClick={()=>setPlaying(true)}>
        {playing?(<iframe src={getUrl()} style={{ width:"100%",height:"100%",border:"none" }} allow="autoplay;fullscreen" allowFullScreen />):(<>
          {video.thumbnail_url?<img src={video.thumbnail_url} alt={video.title} style={{ width:"100%",height:"100%",objectFit:"cover" }}/>:<div style={{ width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#2A0606,#1A0404)" }}><span style={{ fontSize:"3rem",opacity:0.2 }}>🎬</span></div>}
          <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.25)" }}>
            <div style={{ width:54,height:54,borderRadius:"50%",background:"linear-gradient(135deg,#C9961A,#E8B84B)",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <span style={{ color:"#3D0A0A",fontSize:"1.2rem",marginLeft:3 }}>▶</span>
            </div>
          </div>
        </>)}
      </div>
      <div style={{ padding:"14px 18px" }}>
        <span style={{ fontSize:"0.6rem",letterSpacing:"0.1em",textTransform:"uppercase",background:"rgba(201,150,26,0.12)",color:"#E8B84B",padding:"2px 8px",borderRadius:2 }}>{video.category}</span>
        <div style={{ fontSize:"0.95rem",fontWeight:500,color:"#FDF8EF",marginTop:8 }}>{video.title}</div>
        {video.location_tag&&<div style={{ fontSize:"0.75rem",color:"#C4A97A",marginTop:3 }}>📍 {video.location_tag}</div>}
      </div>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name:"",email:"",phone:"",interest:"",message:"" });
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus("loading");
    try {
      const _API = import.meta.env.VITE_API_URL || "";
      await fetch(`${_API}/api/enquiries`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      setStatus("success"); setForm({name:"",email:"",phone:"",interest:"",message:""});
    } catch { setStatus("error"); }
  };
  if (status==="success") return (
    <div className="ah-card" style={{ padding:40,textAlign:"center" }}>
      <div style={{ fontSize:"3rem",marginBottom:16 }}>✅</div>
      <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",color:"#E8B84B" }}>Thank you! We'll be in touch shortly.</p>
    </div>
  );
  return (
    <div className="ah-card" style={{ padding:38 }}>
      <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",color:"#FDF8EF",marginBottom:26 }}>Send an Enquiry</h3>
      <form onSubmit={submit}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:18 }}>
          <div><label className="ah-label">Full Name</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="ah-input" placeholder="Your name"/></div>
          <div><label className="ah-label">Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="ah-input" placeholder="+254..."/></div>
        </div>
        <div style={{ marginBottom:18 }}><label className="ah-label">Email</label><input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="ah-input" placeholder="your@email.com"/></div>
        <div style={{ marginBottom:18 }}>
          <label className="ah-label">Interest</label>
          <select value={form.interest} onChange={e=>setForm({...form,interest:e.target.value})} className="ah-input" style={{ appearance:"none" }}>
            <option style={{background:"#1A0303"}} value="">Select interest</option>
            {["Buying","Renting","Selling","Investment","General Enquiry"].map(o=><option key={o} style={{background:"#1A0303"}}>{o}</option>)}
          </select>
        </div>
        <div style={{ marginBottom:22 }}><label className="ah-label">Message</label><textarea rows={4} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} className="ah-input" style={{ resize:"vertical" }} placeholder="Tell us what you're looking for..."/></div>
        <button type="submit" disabled={status==="loading"} className="ah-btn-gold" style={{ width:"100%",padding:14 }}>{status==="loading"?"Sending...":"Send Enquiry"}</button>
      </form>
    </div>
  );
}

// Style helpers
const eyebrow: React.CSSProperties = { fontSize:"0.7rem",letterSpacing:"0.3em",textTransform:"uppercase",color:"#C9961A",marginBottom:12 };
const secTitle: React.CSSProperties = { fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2.2rem,5vw,3.8rem)",fontWeight:300,color:"#FDF8EF",marginBottom:16 };
const secSub: React.CSSProperties = { fontSize:"0.9rem",color:"#C4A97A",maxWidth:480,lineHeight:1.8 };
const em: React.CSSProperties = { fontStyle:"italic",color:"#E8B84B" };

function PublicReviewsList() {
  const API = import.meta.env.VITE_API_URL || "";
  const [reviews, setReviews] = useState<any[]>([]);
  useEffect(()=>{
    fetch(`${API}/api/reviews`).then(r=>r.json()).then(d=>{ if(Array.isArray(d)) setReviews(d); }).catch(()=>{});
  },[]);
  if (!reviews.length) return (
    <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
      <div className="ah-card" style={{ padding:28,opacity:0.5,textAlign:"center" }}>
        <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",fontStyle:"italic",color:"#C4A97A" }}>No reviews yet — be the first!</p>
      </div>
    </div>
  );
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:16,maxHeight:520,overflowY:"auto",paddingRight:4 }}>
      {reviews.map((r:any)=>(
        <div key={r.id} className="ah-card" style={{ padding:24 }}>
          <div style={{ color:"#C9961A",fontSize:"0.9rem",marginBottom:10,letterSpacing:2 }}>{"★".repeat(r.stars||5)}</div>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.05rem",fontStyle:"italic",color:"#F0E6CE",lineHeight:1.7,marginBottom:16 }}>"{r.quote}"</p>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#8A6520,#C9961A)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",color:"#3D0A0A",fontWeight:700,flexShrink:0 }}>{r.name[0]}</div>
            <div>
              <div style={{ fontSize:"0.85rem",fontWeight:500,color:"#FDF8EF" }}>{r.name}</div>
              <div style={{ fontSize:"0.7rem",color:"#8A6520" }}>{new Date(r.created_at).toLocaleDateString("en-KE",{year:"numeric",month:"short"})}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PublicReviewForm() {
  const API = import.meta.env.VITE_API_URL || "";
  const [form, setForm] = useState({ name:"", email:"", quote:"", stars:5 });
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [hovered, setHovered] = useState(0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus("loading");
    try {
      const res = await fetch(`${API}/api/reviews`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch { setStatus("error"); }
  };

  if (status==="success") return (
    <div className="ah-card" style={{ padding:36,textAlign:"center" }}>
      <div style={{ fontSize:"3rem",marginBottom:14 }}>✨</div>
      <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",color:"#E8B84B",marginBottom:10 }}>Thank you!</p>
      <p style={{ fontSize:"0.84rem",color:"#C4A97A",lineHeight:1.7 }}>Your review has been submitted and will appear once approved.</p>
      <button onClick={()=>{setStatus("idle");setForm({name:"",email:"",quote:"",stars:5});}} className="ah-btn-outline" style={{ marginTop:20,padding:"10px 24px" }}>Leave Another</button>
    </div>
  );

  return (
    <div className="ah-card" style={{ padding:32 }}>
      <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.6rem",color:"#FDF8EF",marginBottom:6 }}>Leave a Review</h3>
      <p style={{ fontSize:"0.8rem",color:"#8A6520",marginBottom:22 }}>Share your experience with Aeton Homes</p>
      <form onSubmit={submit}>
        <div style={{ marginBottom:16 }}>
          <label className="ah-label">Your Rating</label>
          <div style={{ display:"flex",gap:6,marginTop:4 }}>
            {[1,2,3,4,5].map(n=>(
              <button key={n} type="button"
                onMouseEnter={()=>setHovered(n)} onMouseLeave={()=>setHovered(0)}
                onClick={()=>setForm({...form,stars:n})}
                style={{ background:"none",border:"none",cursor:"pointer",fontSize:"1.8rem",color:(hovered||form.stars)>=n?"#C9961A":"rgba(201,150,26,0.2)",transition:"color 0.15s",padding:"0 2px",lineHeight:1 }}>★</button>
            ))}
            <span style={{ fontSize:"0.78rem",color:"#8A6520",alignSelf:"center",marginLeft:6 }}>{["","Poor","Fair","Good","Great","Excellent"][hovered||form.stars]}</span>
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14 }}>
          <div><label className="ah-label">Your Name *</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="ah-input" placeholder="John Doe"/></div>
          <div><label className="ah-label">Email (optional)</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="ah-input" placeholder="your@email.com"/></div>
        </div>
        <div style={{ marginBottom:20 }}>
          <label className="ah-label">Your Review *</label>
          <textarea required rows={4} value={form.quote} onChange={e=>setForm({...form,quote:e.target.value})} className="ah-input" style={{ resize:"vertical" }} placeholder="Tell us about your experience with Aeton Homes..."/>
        </div>
        {status==="error"&&<p style={{ color:"#f87171",fontSize:"0.8rem",marginBottom:12 }}>Something went wrong. Please try again.</p>}
        <button type="submit" disabled={status==="loading"} className="ah-btn-gold" style={{ width:"100%",padding:13 }}>{status==="loading"?"Submitting...":"Submit Review"}</button>
        <p style={{ fontSize:"0.7rem",color:"#8A6520",marginTop:10,textAlign:"center" }}>Reviews are moderated before appearing publicly</p>
      </form>
    </div>
  );
}
