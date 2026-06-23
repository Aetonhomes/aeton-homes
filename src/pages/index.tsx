import { useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

import Particles from "../components/Particles";
import { useContent, useApi } from "../lib/useContent";
import { c, DEFAULTS } from "../lib/defaults";

// ── Shared style tokens ────────────────────────────────────
const T = {
  eyebrow: {
    fontSize: "0.65rem", letterSpacing: "0.28em", textTransform: "uppercase" as const,
    color: "#D4A422", marginBottom: 14, display: "block",
  } as React.CSSProperties,
  h2: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300, lineHeight: 1.15,
    color: "#FFFFFF", marginBottom: 16,
  } as React.CSSProperties,
  em: { fontStyle: "italic", color: "#F0C355" } as React.CSSProperties,
  sub: {
    fontSize: "0.88rem", color: "#D4B890", lineHeight: 1.8,
    maxWidth: 560, marginBottom: 0,
  } as React.CSSProperties,
};

export default function Index() {
  const { content, loading } = useContent();
  const { data: propertiesRaw } = useApi<any[]>("/api/properties");
  const { data: testimonialsList } = useApi<any[]>("/api/testimonials");
  const { data: teamList } = useApi<any[]>("/api/team");
  const { data: featuredVideos } = useApi<any[]>("/api/videos");
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [tab, setTab] = useState("Buy");

  // ── Search / filter state ──────────────────────────────
  const [filterLocation, setFilterLocation] = useState("All Locations");
  const [filterType, setFilterType] = useState("All Types");
  const [filterBeds, setFilterBeds] = useState("Any");
  const [filterBudget, setFilterBudget] = useState("Any");

  // Derive filtered list from raw API data
  const properties = (propertiesRaw ?? []).filter((p: any) => {
    // Location
    if (filterLocation !== "All Locations") {
      const loc = (p.location || "").toLowerCase();
      if (!loc.includes(filterLocation.toLowerCase())) return false;
    }
    // Type (sale/rent/commercial/land)
    if (filterType !== "All Types") {
      const t = filterType.toLowerCase();
      const pType = (p.type || "").toLowerCase();
      const pCategory = (p.category || p.property_type || "").toLowerCase();
      const combo = pType + " " + pCategory;
      if (t === "apartment" && !combo.includes("apartment")) return false;
      if (t === "villa" && !combo.includes("villa")) return false;
      if (t === "townhouse" && !combo.includes("townhouse")) return false;
      if (t === "bungalow" && !combo.includes("bungalow")) return false;
      if (t === "penthouse" && !combo.includes("penthouse")) return false;
      if (t === "office" && !combo.includes("office") && !combo.includes("commercial")) return false;
      if (t === "land" && !combo.includes("land")) return false;
    }
    // Bedrooms
    if (filterBeds !== "Any") {
      const beds = Number(p.beds) || 0;
      if (filterBeds === "Studio" && beds !== 0) return false;
      if (filterBeds === "1 Bed" && beds !== 1) return false;
      if (filterBeds === "2 Beds" && beds !== 2) return false;
      if (filterBeds === "3 Beds" && beds !== 3) return false;
      if (filterBeds === "4 Beds" && beds !== 4) return false;
      if (filterBeds === "5+ Beds" && beds < 5) return false;
    }
    // Budget — parse price string (KES 5,000,000 → 5000000)
    if (filterBudget !== "Any") {
      const raw = (p.price || "").replace(/[^0-9]/g, "");
      const price = parseInt(raw, 10) || 0;
      if (filterBudget === "Up to 5M"   && price > 5_000_000) return false;
      if (filterBudget === "5M–15M"     && (price < 5_000_000  || price > 15_000_000)) return false;
      if (filterBudget === "15M–30M"    && (price < 15_000_000 || price > 30_000_000)) return false;
      if (filterBudget === "30M–60M"    && (price < 30_000_000 || price > 60_000_000)) return false;
      if (filterBudget === "60M–100M"   && (price < 60_000_000 || price > 100_000_000)) return false;
      if (filterBudget === "100M+"      && price < 100_000_000) return false;
    }
    return true;
  });

  useEffect(() => {
    const _API = import.meta.env.VITE_API_URL || "";
    fetch(`${_API}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "/", referrer: document.referrer, screen_width: window.innerWidth }),
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [loading, properties, testimonialsList]);

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
        const step = () => { s += end / 80; (el as HTMLElement).textContent = Math.min(Math.floor(s), end) + suffix; if (s < end) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, [loading, statsAnimated]);

  const marqueeItems = (() => {
    try { return JSON.parse(c(content, "marquee_items")); }
    catch { return DEFAULTS.marquee_items ? JSON.parse(DEFAULTS.marquee_items) : []; }
  })();

  return (
    <div style={{ background: "#0E0101", color: "#FFFFFF", minHeight: "100vh", overflowX: "hidden" }}>
      <Particles />
      <Nav content={content} />

      {/* ══════════════════════════════════════════════
          HERO — luxury real estate Nairobi Kenya
      ══════════════════════════════════════════════ */}
      <section
        aria-label="Aeton Homes — Luxury Real Estate Kenya"
        style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
      >
        {/* BG */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: `radial-gradient(ellipse at 20% 50%, rgba(10,1,1,0.75) 0%, transparent 65%),
            linear-gradient(to bottom, rgba(10,1,1,0.5) 0%, rgba(20,3,3,0.7) 55%, rgba(8,0,0,0.97) 100%),
            url('https://jewelbookstore.neocities.org/property%208.jpeg') center/cover no-repeat`,
        }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          backgroundImage: "linear-gradient(rgba(212,164,34,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(212,164,34,0.04) 1px,transparent 1px)",
          backgroundSize: "80px 80px", animation: "gridShift 24s linear infinite",
        }} />

        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 5%", maxWidth: 960 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(212,164,34,0.1)", border: "1px solid rgba(212,164,34,0.28)",
            padding: "6px 20px", borderRadius: 50, fontSize: "0.65rem",
            letterSpacing: "0.24em", textTransform: "uppercase", color: "#F0C355",
            marginBottom: 32, animation: "fadeInDown 0.8s ease forwards",
          }}>
            <span style={{ width: 5, height: 5, background: "#D4A422", borderRadius: "50%", animation: "pulse 2s infinite" }} />
            {c(content, "hero_badge")}
          </div>

          {/* H1 with SEO keywords embedded naturally */}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.8rem, 7.5vw, 6rem)", fontWeight: 300, lineHeight: 1.08,
            color: "#FFFFFF", animation: "fadeInUp 0.9s 0.2s ease both", letterSpacing: "-0.01em",
          }}>
            {c(content, "hero_title")}<br />
            <em style={{ fontStyle: "italic", color: "#F0C355" }}>{c(content, "hero_title_em")}</em><br />
            {c(content, "hero_title_end")}
          </h1>

          <p style={{
            fontSize: "clamp(0.82rem,1.4vw,0.95rem)", color: "#E2C99A",
            letterSpacing: "0.22em", textTransform: "uppercase", margin: "24px 0 44px",
            animation: "fadeInUp 0.9s 0.4s ease both",
          }}>{c(content, "hero_subtitle")}</p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", animation: "fadeInUp 0.9s 0.6s ease both" }}>
            <a href="#properties" className="ah-hero-cta-primary">
              {c(content, "hero_btn1")}
            </a>
            <a href="#contact" className="ah-hero-cta-secondary">
              {c(content, "hero_btn2")}
            </a>
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", gap: 28, justifyContent: "center", flexWrap: "wrap", marginTop: 52, animation: "fadeInUp 0.9s 0.8s ease both" }}>
            {["Verified Listings","Bank-Ready Titles","Nairobi's Top Agents"].map((badge, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.7rem", color: "#B8892A", letterSpacing: "0.1em" }}>
                <span style={{ color: "#D4A422", fontSize: "0.75rem" }}>✓</span> {badge}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRef} style={{ position: "absolute", bottom: 56, left: 0, right: 0, zIndex: 2, display: "flex", justifyContent: "center", gap: 0, flexWrap: "wrap", padding: "0 5%", maxWidth: "100%" }}>
          <div className="ah-stats-bar" style={{ display: "flex", gap: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(16px)", border: "1px solid rgba(212,164,34,0.14)", borderRadius: 4, overflow: "hidden", width: "100%" }}>
            {[1,2,3,4].map((i, idx) => (
              <div key={i} className="ah-stat-item" style={{ flex: 1, padding: "18px 24px", textAlign: "center", borderRight: idx < 3 ? "1px solid rgba(212,164,34,0.1)" : "none", minWidth: 0 }}>
                <div data-stat={i} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.4rem, 4vw, 2.2rem)", fontWeight: 600, color: "#F0C355", lineHeight: 1 }}>
                  {c(content, `stat_${i}_num`)}
                </div>
                <div style={{ fontSize: "clamp(0.5rem, 1.5vw, 0.62rem)", letterSpacing: "0.12em", textTransform: "uppercase", color: "#6B4F20", marginTop: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c(content, `stat_${i}_label`)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "#6B4F20", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", animation: "bounce 2s infinite" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B4F20" strokeWidth="1.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
          Explore
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SEARCH — find property for sale rent Nairobi
      ══════════════════════════════════════════════ */}
      <div className="reveal" style={{ position: "relative", zIndex: 10, marginTop: -2, padding: "0 5%" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", background: "rgba(8,0,0,0.97)", border: "1px solid rgba(212,164,34,0.2)", borderRadius: 4, padding: "30px 36px", backdropFilter: "blur(24px)", boxShadow: "0 40px 100px rgba(0,0,0,0.7)" }}>
          <p style={{ fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#6B4F20", marginBottom: 18 }}>Find Your Property</p>
          <div style={{ display: "flex", marginBottom: 22, borderBottom: "1px solid rgba(212,164,34,0.12)", gap: 4 }}>
            {["Buy","Rent","Commercial","Land"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 20px", cursor: "pointer", background: tab===t ? "rgba(212,164,34,0.1)" : "none", fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", border: "none", fontFamily: "'Jost',sans-serif", borderBottom: `2px solid ${tab===t?"#D4A422":"transparent"}`, color: tab===t?"#F0C355":"#6B4F20", marginBottom: -1, transition: "all 0.25s", borderRadius: "2px 2px 0 0" }}>{t}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
            {[
              {label:"Location", opts:["All Locations","Westlands","Karen","Kilimani","Lavington","Runda","Muthaiga","Kileleshwa","Spring Valley"], val:filterLocation, set:setFilterLocation},
              {label:"Property Type", opts:["All Types","Apartment","Villa","Townhouse","Bungalow","Penthouse","Office","Land"], val:filterType, set:setFilterType},
              {label:"Bedrooms", opts:["Any","Studio","1 Bed","2 Beds","3 Beds","4 Beds","5+ Beds"], val:filterBeds, set:setFilterBeds},
              {label:"Budget (KES)", opts:["Any","Up to 5M","5M–15M","15M–30M","30M–60M","60M–100M","100M+"], val:filterBudget, set:setFilterBudget},
            ].map((f,i) => (
              <div key={i} style={{ flex: 1, minWidth: 140 }}>
                <label className="ah-label">{f.label}</label>
                <select
                  className="ah-input"
                  style={{ appearance: "none", cursor: "pointer" }}
                  value={f.val}
                  onChange={e => { f.set(e.target.value); document.getElementById("properties")?.scrollIntoView({behavior:"smooth"}); }}
                >
                  {f.opts.map(o => <option key={o} style={{background:"#0E0101"}}>{o}</option>)}
                </select>
              </div>
            ))}
            <button className="ah-btn-gold" style={{ padding: "11px 32px", whiteSpace: "nowrap", flexShrink: 0 }}
              onClick={() => document.getElementById("properties")?.scrollIntoView({behavior:"smooth"})}>
              Search Properties
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MARQUEE
      ══════════════════════════════════════════════ */}
      <div style={{ overflow: "hidden", borderTop: "1px solid rgba(212,164,34,0.08)", borderBottom: "1px solid rgba(212,164,34,0.08)", background: "rgba(0,0,0,0.3)", marginTop: 48 }}>
        <div className="marquee-track" style={{ display: "flex", width: "max-content", padding: "18px 0" }}>
          {[...Array(2)].flatMap(() => marqueeItems).map((item: string, i: number) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 40px", fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#6B4F20", whiteSpace: "nowrap" }}>
              <span style={{ width: 4, height: 4, background: "#D4A422", borderRadius: "50%", opacity: 0.7 }} />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          PROPERTIES — luxury homes for sale Nairobi Kenya
      ══════════════════════════════════════════════ */}
      <section
        id="properties"
        aria-label="Luxury properties for sale and rent in Nairobi, Kenya"
        style={{ position: "relative", zIndex: 2, padding: "110px 5%", background: "linear-gradient(to bottom, #0E0101, #180303)" }}
      >
        <div className="reveal" style={{ marginBottom: 64 }}>
          <span style={T.eyebrow}>{c(content,"props_eyebrow") || "Premium Listings"}</span>
          <h2 style={T.h2}>
            {c(content,"props_title")} <em style={T.em}>{c(content,"props_title_em")}</em>
          </h2>
          <p style={T.sub}>{c(content,"props_subtitle") || "Curated luxury properties — apartments, villas, townhouses & land — across Nairobi's most sought-after neighbourhoods."}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 28 }}>
          {(properties && properties.length > 0 ? properties : []).map((p: any) => (
            <PropCard key={p.id} p={p} />
          ))}
          {properties.length === 0 && (
            <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"80px 0", color:"#E2C99A" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.6rem", fontStyle:"italic", opacity:0.35, marginBottom:12 }}>
                {(propertiesRaw && propertiesRaw.length > 0) ? "No properties match your filters" : "Premium listings coming soon"}
              </div>
              <p style={{ fontSize:"0.8rem", color:"#B8892A" }}>
                {(propertiesRaw && propertiesRaw.length > 0)
                  ? <button onClick={() => { setFilterLocation("All Locations"); setFilterType("All Types"); setFilterBeds("Any"); setFilterBudget("Any"); }} style={{ background:"none", border:"1px solid rgba(212,164,34,0.3)", color:"#D4A422", padding:"8px 20px", borderRadius:2, cursor:"pointer", fontSize:"0.78rem", fontFamily:"'Jost',sans-serif" }}>Clear Filters</button>
                  : "Check back shortly or contact us directly for available properties."
                }
              </p>
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 56 }}>
          <a href="#contact" className="ah-btn-outline" style={{ padding: "14px 40px", textDecoration: "none", display: "inline-block" }}>
            Request Full Portfolio
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          WHY AETON — trusted real estate agents Kenya
      ══════════════════════════════════════════════ */}
      <section
        id="why"
        aria-label="Why choose Aeton Homes — trusted luxury real estate agency Nairobi"
        style={{ position: "relative", zIndex: 2, padding: "110px 5%", background: "linear-gradient(to bottom,#180303,#0E0101)" }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", maxWidth: 1200, margin: "0 auto" }} className="ah-two-col">
          {/* Visual */}
          <div className="reveal" style={{ position: "relative" }}>
            <div style={{ aspectRatio: "4/5", maxHeight: 560, background: "linear-gradient(135deg,#1A0303,#2E0808)", border: "1px solid rgba(212,164,34,0.15)", borderRadius: 4, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, padding: 20 }}>
                {[0,1,2,3,"logo",4,5,6,7].map((item,i) => (
                  <div key={i} style={{
                    width:72, height:72,
                    background: item==="logo" ? "linear-gradient(135deg,rgba(212,164,34,0.45),rgba(212,164,34,0.2))" : "linear-gradient(135deg,rgba(212,164,34,0.08),rgba(212,164,34,0.02))",
                    clipPath: "polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    animation:`hexPulse 3s ease-in-out ${i*0.3}s infinite`,
                    overflow:"hidden",
                  }}>
                    {item==="logo"
                      ? <img src="https://jewelbookstore.neocities.org/logo.jpeg" alt="Aeton Homes" style={{ width:"70%", height:"70%", objectFit:"contain" }} />
                      : null
                    }
                  </div>
                ))}
              </div>
              {/* Float card */}
              <div style={{ position:"absolute", bottom:28, right:-20, background:"linear-gradient(135deg,#D4A422,#F0C355)", color:"#0E0101", padding:"20px 24px", borderRadius:4, boxShadow:"0 24px 60px rgba(0,0,0,0.5)", animation:"floatBadge 4s ease-in-out infinite" }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2.4rem", fontWeight:700, lineHeight:1 }}>{c(content,"why_badge_num")}</div>
                <div style={{ fontSize:"0.6rem", letterSpacing:"0.14em", textTransform:"uppercase", marginTop:4 }}>{c(content,"why_badge_label")}</div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="reveal">
            <span style={T.eyebrow}>{c(content,"why_eyebrow") || "Why Aeton Homes"}</span>
            <h2 style={T.h2}>
              {c(content,"why_title")} <em style={T.em}>{c(content,"why_title_em")}</em>
              {c(content,"why_title_end") && <><br/>{c(content,"why_title_end")}</>}
            </h2>
            <p style={{...T.sub, marginBottom:36}}>{c(content,"why_subtitle") || "Kenya's most trusted luxury property consultants — combining deep market knowledge with white-glove service."}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[1,2,3,4].map(i => (
                <div key={i} className="ah-why-feat">
                  <div style={{ width:6, height:6, flexShrink:0, background:"#D4A422", borderRadius:"50%", marginTop:6 }} />
                  <div>
                    <div style={{ fontSize:"0.88rem", fontWeight:600, color:"#FFFFFF", marginBottom:4 }}>{c(content,`why_feat_${i}_title`)}</div>
                    <div style={{ fontSize:"0.8rem", color:"#E2C99A", lineHeight:1.7 }}>{c(content,`why_feat_${i}_desc`)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURED VIDEOS
      ══════════════════════════════════════════════ */}
      {featuredVideos && featuredVideos.length > 0 && (
        <section
          aria-label="Luxury property tour videos Nairobi Kenya"
          style={{ position:"relative", zIndex:2, padding:"110px 5%", background:"linear-gradient(to bottom,#0E0101,#180303)" }}
        >
          <div className="reveal" style={{ marginBottom:60 }}>
            <span style={T.eyebrow}>{c(content,"videos_eyebrow") || "Property Tours"}</span>
            <h2 style={T.h2}>{c(content,"videos_title")} <em style={T.em}>{c(content,"videos_title_em")}</em></h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:26 }}>
            {featuredVideos.map((v:any) => <VideoCard key={v.id} video={v} />)}
          </div>
          <div style={{ textAlign:"center", marginTop:48 }}>
            <a href="/videos" className="ah-btn-outline" style={{ padding:"14px 40px", textDecoration:"none", display:"inline-block" }}>View All Tours</a>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          PROCESS — how to buy property Kenya
      ══════════════════════════════════════════════ */}
      <section
        id="process"
        aria-label="How to buy or rent property in Nairobi Kenya — step by step"
        style={{ position:"relative", zIndex:2, padding:"110px 5%", background:"linear-gradient(to bottom,#180303,#0E0101)" }}
      >
        <div className="reveal" style={{ textAlign:"center", marginBottom:72 }}>
          <span style={T.eyebrow}>{c(content,"process_eyebrow") || "How It Works"}</span>
          <h2 style={T.h2}>{c(content,"process_title")} <em style={T.em}>{c(content,"process_title_em")}</em></h2>
          <p style={{...T.sub, margin:"0 auto"}}>From first consultation to handing over the keys — a seamless, transparent journey.</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0, position:"relative", maxWidth:1100, margin:"0 auto" }} className="ah-process-grid">
          {/* Connector line */}
          <div style={{ position:"absolute", top:38, left:"12.5%", right:"12.5%", height:1, background:"linear-gradient(to right,rgba(212,164,34,0.2),rgba(212,164,34,0.5),rgba(212,164,34,0.2))", zIndex:0 }} className="ah-process-line" />
          {[1,2,3,4].map(i => (
            <div key={i} style={{ padding:"0 24px", textAlign:"center", position:"relative", zIndex:1 }}>
              <div style={{ width:76, height:76, margin:"0 auto 24px", background:"linear-gradient(135deg,rgba(212,164,34,0.1),rgba(212,164,34,0.04))", border:"1px solid rgba(212,164,34,0.3)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 0 6px rgba(212,164,34,0.04)" }}>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.9rem", fontWeight:600, color:"#F0C355" }}>{i}</span>
              </div>
              <div style={{ fontSize:"0.9rem", fontWeight:500, color:"#FFFFFF", marginBottom:10 }}>{c(content,`process_step_${i}_title`)}</div>
              <div style={{ fontSize:"0.78rem", color:"#B8892A", lineHeight:1.75 }}>{c(content,`process_step_${i}_desc`)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TESTIMONIALS — client reviews luxury property
      ══════════════════════════════════════════════ */}
      {testimonialsList && testimonialsList.length > 0 && (
        <section
          id="testimonials"
          aria-label="Client testimonials — Aeton Homes luxury real estate Kenya"
          style={{ position:"relative", zIndex:2, padding:"110px 5%", background:"linear-gradient(to bottom,#0E0101,#180303)" }}
        >
          <div className="reveal" style={{ textAlign:"center", marginBottom:64 }}>
            <span style={T.eyebrow}>{c(content,"testi_eyebrow") || "Testimonials"}</span>
            <h2 style={T.h2}>{c(content,"testi_title")} <em style={T.em}>{c(content,"testi_title_em")}</em></h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:22 }}>
            {testimonialsList.map((t:any, i:number) => (
              <div key={t.id||i} className="reveal ah-card ah-testi-card" style={{ padding:28, position:"relative" }}>
                <div style={{ fontSize:"1.8rem", color:"rgba(212,164,34,0.18)", fontFamily:"Georgia,serif", lineHeight:1, marginBottom:6, userSelect:"none" }}>"</div>
                <div style={{ color:"#D4A422", fontSize:"0.8rem", marginBottom:12, letterSpacing:3 }}>{"★".repeat(t.stars||5)}</div>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.05rem", fontStyle:"italic", color:"#F0E6CE", lineHeight:1.75, marginBottom:22 }}>{t.quote}</p>
                <div style={{ display:"flex", alignItems:"center", gap:12, borderTop:"1px solid rgba(212,164,34,0.08)", paddingTop:18 }}>
                  {t.avatar_url
                    ? <img src={t.avatar_url} alt={t.name} style={{ width:40, height:40, borderRadius:"50%", objectFit:"cover" }} />
                    : <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#6B4510,#D4A422)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", color:"#0E0101", fontWeight:700 }}>{t.name[0]}</div>
                  }
                  <div>
                    <div style={{ fontSize:"0.83rem", fontWeight:500, color:"#FFFFFF" }}>{t.name}</div>
                    <div style={{ fontSize:"0.7rem", color:"#B8892A", marginTop:2 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          CLIENT REVIEWS
      ══════════════════════════════════════════════ */}
      <section
        id="reviews"
        aria-label="Real estate client reviews Nairobi Kenya"
        style={{ position:"relative", zIndex:2, padding:"110px 5%", background:"linear-gradient(to bottom,#180303,#0E0101)" }}
      >
        <div className="reveal" style={{ textAlign:"center", marginBottom:64 }}>
          <span style={T.eyebrow}>Client Reviews</span>
          <h2 style={T.h2}>What Our <em style={T.em}>Clients Say</em></h2>
          <p style={{...T.sub, margin:"0 auto"}}>Honest feedback from homebuyers, investors and tenants across Nairobi's luxury market.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, maxWidth:1100, margin:"0 auto" }} className="ah-two-col">
          <PublicReviewsList />
          <PublicReviewForm />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TEAM — real estate experts Nairobi
      ══════════════════════════════════════════════ */}
      <section
        id="team"
        aria-label="Aeton Homes real estate team — property experts Nairobi Kenya"
        style={{ position:"relative", zIndex:2, padding:"110px 5%", background:"linear-gradient(to bottom,#0E0101,#180303)" }}
      >
        <div className="reveal" style={{ marginBottom:64 }}>
          <span style={T.eyebrow}>{c(content,"team_eyebrow") || "Our Team"}</span>
          <h2 style={T.h2}>{c(content,"team_title")} <em style={T.em}>{c(content,"team_title_em")}</em></h2>
        </div>

        {(teamList && teamList.length > 0) ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:26 }}>
            {teamList.map((m:any) => (
              <div key={m.id} className="reveal ah-card" style={{ overflow:"hidden" }}>
                <div style={{ aspectRatio:"3/4", overflow:"hidden", background:"#1A0303" }}>
                  {m.photo_url
                    ? <img src={m.photo_url} alt={m.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                    : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"3.5rem", opacity:0.1 }}>👤</div>
                  }
                </div>
                <div style={{ padding:22, borderTop:"1px solid rgba(212,164,34,0.08)" }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.4rem", fontWeight:600, color:"#FFFFFF", marginBottom:3 }}>{m.name}</div>
                  <div style={{ fontSize:"0.65rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"#D4A422", marginBottom:12 }}>{m.role}</div>
                  <div style={{ fontSize:"0.8rem", color:"#E2C99A", lineHeight:1.75 }}>{m.bio}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* CEO placeholder — stacks vertically on mobile, no hidden columns */
          <div className="reveal ah-ceo-grid" style={{ display:"grid", gridTemplateColumns:"240px 1fr", gap:44, alignItems:"start", maxWidth:860 }}>
            <div style={{ borderRadius:4, overflow:"hidden", border:"1px solid rgba(212,164,34,0.18)", boxShadow:"0 24px 60px rgba(0,0,0,0.5)" }}>
              <div style={{ aspectRatio:"3/4", background:"linear-gradient(160deg,#2A0606,#140202)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
                <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(212,164,34,0.12)", border:"1.5px solid rgba(212,164,34,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2rem" }}>👤</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", color:"rgba(212,164,34,0.4)", fontStyle:"italic" }}>Aeton Homes</div>
              </div>
            </div>
            <div style={{ paddingTop:4 }}>
              <div style={{ display:"inline-block", background:"rgba(212,164,34,0.08)", border:"1px solid rgba(212,164,34,0.2)", padding:"4px 14px", borderRadius:2, fontSize:"0.6rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"#D4A422", marginBottom:18 }}>Leadership</div>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.8rem,4vw,2.4rem)", fontWeight:300, color:"#FFFFFF", marginBottom:6, lineHeight:1.15 }}>Our Chief Executive</h3>
              <p style={{ fontSize:"0.65rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"#D4A422", marginBottom:24, paddingBottom:20, borderBottom:"1px solid rgba(212,164,34,0.08)" }}>Founder & CEO — Aeton Homes Kenya</p>
              <p style={{ fontSize:"0.87rem", color:"#E2C99A", lineHeight:1.9, marginBottom:18 }}>
                With over 12 years of experience in Kenya's luxury real estate market, our CEO founded Aeton Homes with a singular vision: to make premium property accessible, transparent, and rewarding for every client across Nairobi and beyond.
              </p>
              <blockquote style={{ fontSize:"0.87rem", color:"#E2C99A", lineHeight:1.9, fontStyle:"italic", borderLeft:"2px solid rgba(212,164,34,0.35)", paddingLeft:18, marginBottom:24 }}>
                "Every property transaction is a life decision. We treat it with the gravity it deserves."
              </blockquote>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {["12+ Years Experience","50+ Luxury Sales","200+ Families Served","Top Agent — Nairobi"].map((badge,i) => (
                  <div key={i} style={{ background:"rgba(212,164,34,0.06)", border:"1px solid rgba(212,164,34,0.15)", padding:"6px 13px", borderRadius:2, fontSize:"0.67rem", color:"#B8892A" }}>{badge}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════
          CONTACT — real estate enquiry Kenya
      ══════════════════════════════════════════════ */}
      <section
        id="contact"
        aria-label="Contact Aeton Homes — luxury real estate enquiries Nairobi Kenya"
        style={{ position:"relative", zIndex:2, padding:"110px 5%", background:"linear-gradient(to bottom,#180303,#050000)" }}
      >
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"start", maxWidth:1200, margin:"0 auto" }} className="ah-two-col">
          <ContactForm />
          <div style={{ paddingTop:8 }}>
            <span style={T.eyebrow}>{c(content,"contact_eyebrow") || "Get In Touch"}</span>
            <h2 style={{...T.h2, marginBottom:12}}>
              {c(content,"contact_title")}<br/><em style={T.em}>{c(content,"contact_title_em")}</em>
            </h2>
            <p style={{...T.sub, marginBottom:40}}>{c(content,"contact_subtitle") || "Ready to find your dream home in Nairobi? Our luxury property specialists are available 7 days a week."}</p>

            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              {[
                { label:"Phone", key:"contact_phone" },
                { label:"Email", key:"contact_email" },
                { label:"Office", key:"contact_address" },
              ].map((item,i) => (
                <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <div style={{ width:3, flexShrink:0, alignSelf:"stretch", background:"linear-gradient(to bottom,#D4A422,transparent)", borderRadius:2 }} />
                  <div>
                    <div className="ah-label" style={{ marginBottom:3 }}>{item.label}</div>
                    <div style={{ fontSize:"0.9rem", color:"#FFFFFF" }}>{c(content,item.key)}</div>
                  </div>
                </div>
              ))}
            </div>

            <a href="#contact"
              style={{ display:"inline-flex", alignItems:"center", gap:10, background:"linear-gradient(135deg,#D4A422,#F0C355)", color:"#0E0101", padding:"13px 28px", borderRadius:2, marginTop:32, textDecoration:"none", fontSize:"0.8rem", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>
              Send Us a Message →
            </a>

            {/* SEO-friendly area text */}
            <div style={{ marginTop:40, padding:"20px 22px", background:"rgba(212,164,34,0.04)", border:"1px solid rgba(212,164,34,0.1)", borderRadius:4 }}>
              <p style={{ fontSize:"0.75rem", color:"#B8892A", lineHeight:1.8 }}>
                Aeton Homes serves clients across <strong style={{color:"#B8892A"}}>Westlands, Karen, Kilimani, Lavington, Runda, Muthaiga</strong> and all of Nairobi. We specialise in <strong style={{color:"#B8892A"}}>luxury apartments, villas, townhouses, commercial property</strong> and prime land — for sale and rent in Kenya.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer content={content} />

      <style>{`
        @media(max-width:900px){
          .ah-two-col{grid-template-columns:1fr!important;}
          .ah-process-grid{grid-template-columns:repeat(2,1fr)!important;gap:48px!important;}
          .ah-process-line{display:none!important;}
          .ah-ceo-grid{grid-template-columns:1fr!important;}
        }
        @media(max-width:500px){
          .ah-process-grid{grid-template-columns:1fr!important;}
        }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════

type MediaSlide = { kind: "image"; url: string } | { kind: "video"; url: string; embedUrl: string };

function getYtVimeoEmbed(v: { type: string; url: string }): string {
  if (v.type === "youtube") {
    const id = v.url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([^&\s?/]+)/)?.[1];
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : v.url;
  }
  if (v.type === "vimeo") {
    const id = v.url.match(/vimeo\.com\/(\d+)/)?.[1];
    return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : v.url;
  }
  return v.url;
}

function buildMedia(p: any): MediaSlide[] {
  let imgs: string[] = [];
  try { imgs = Array.isArray(p.images) ? p.images : JSON.parse(p.images || "[]"); } catch { imgs = []; }
  if (p.image_url && !imgs.includes(p.image_url)) imgs = [p.image_url, ...imgs];
  if (!imgs.length) imgs = ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"];
  let vids: { type: string; url: string }[] = [];
  try { vids = Array.isArray(p.property_videos) ? p.property_videos : JSON.parse(p.property_videos || "[]"); } catch { vids = []; }
  vids = vids.filter(v => v.url?.trim());
  const slides: MediaSlide[] = imgs.map(url => ({ kind: "image", url }));
  vids.forEach(v => slides.push({ kind: "video", url: v.url, embedUrl: getYtVimeoEmbed(v) }));
  return slides;
}

// ══════════════════════════════════════════════════════════
// PROPERTY MODAL
// ══════════════════════════════════════════════════════════
function PropertyModal({ p, onClose }: { p: any; onClose: () => void }) {

  const API = import.meta.env.VITE_API_URL || "";
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [touchStart, setTouchStart] = useState<number|null>(null);
  const [rightTab, setRightTab] = useState<"enquiry"|"booking">("booking");

  // Enquiry form
  const [eForm, setEForm] = useState({ name:"", email:"", phone:"", message:"", preferred_contact:"call" });
  const [eStatus, setEStatus] = useState<"idle"|"loading"|"success"|"error">("idle");

  // Booking form
  const [bForm, setBForm] = useState({ name:"", email:"", phone:"", viewing_date:"", message:"", preferred_contact:"whatsapp" });
  const [bStatus, setBStatus] = useState<"idle"|"loading"|"success"|"error">("idle");

  const media = buildMedia(p);
  const total = media.length;
  const cur = media[idx];

  const go = (dir: number, e?: React.MouseEvent) => { e?.stopPropagation(); setPlaying(false); setIdx(i => (i+dir+total)%total); };

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const submitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault(); setEStatus("loading");
    try {
      await fetch(`${API}/api/enquiries`, { method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ ...eForm, interest: p.title, source: "property_modal",
          message: eForm.message || `General enquiry about: ${p.title} — ${p.price}` }) });
      setEStatus("success");
    } catch { setEStatus("error"); }
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault(); setBStatus("loading");
    try {
      await fetch(`${API}/api/bookings`, { method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ ...bForm, property_title: p.title, property_id: p.id || null }) });
      setBStatus("success");
    } catch { setBStatus("error"); }
  };

  const specs = [
    { icon:"🛏", label:"Beds", val: p.beds },
    { icon:"🚿", label:"Baths", val: p.baths },
    { icon:"📐", label:"Size", val: p.sqm, suffix:" m²" },
  ].filter(s => s.val && Number(s.val) > 0);

  const contactOpts = [
    {v:"call",label:"Phone Call",icon:<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>},
    {v:"whatsapp",label:"WhatsApp",icon:<svg viewBox="0 0 32 32" fill="currentColor" width="14" height="14"><path d="M16 2C8.27 2 2 8.27 2 16c0 2.44.64 4.73 1.76 6.72L2 30l7.44-1.74A13.9 13.9 0 0 0 16 30c7.73 0 14-6.27 14-14S23.73 2 16 2zm6.29 19.47c-.34-.17-2.02-.99-2.33-1.1-.31-.12-.54-.17-.77.17-.23.34-.88 1.1-1.08 1.33-.2.23-.4.25-.74.08-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.7-2.01-1.9-2.35-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.08-.17-.77-1.85-1.05-2.54-.28-.67-.56-.58-.77-.59l-.66-.01c-.23 0-.6.08-.91.4s-1.2 1.17-1.2 2.85c0 1.68 1.23 3.31 1.4 3.54.17.23 2.41 3.68 5.84 5.16.82.35 1.45.56 1.95.72.82.26 1.57.22 2.16.13.66-.1 2.02-.82 2.3-1.62.29-.8.29-1.48.2-1.62-.08-.14-.31-.22-.65-.39z"/></svg>},
    {v:"sms",label:"SMS",icon:<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/></svg>},
    {v:"telegram",label:"Telegram",icon:<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>},
    {v:"email",label:"Email",icon:<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>},
  ];

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:9000, background:"rgba(0,0,0,0.92)", backdropFilter:"blur(8px)", overflowY:"auto", padding:"8px", display:"flex", alignItems:"flex-start", justifyContent:"center" }}>
      <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:980, background:"#100101", border:"1px solid rgba(212,164,34,0.18)", borderRadius:6, overflow:"hidden", position:"relative", marginTop:16, marginBottom:32, animation:"fadeInUp 0.28s ease", boxShadow:"0 40px 100px rgba(0,0,0,0.8)" }}>

        {/* Close */}
        <button onClick={onClose} title="Close" style={{ position:"absolute", top:10, right:10, zIndex:10, width:34, height:34, borderRadius:"50%", background:"rgba(0,0,0,0.7)", border:"1px solid rgba(212,164,34,0.2)", color:"#F0C355", fontSize:"1.1rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>

        <div className="ah-modal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 360px" }}>

          {/* ─── LEFT ─── */}
          <div>
            {/* Gallery */}
            <div className="ah-modal-img-wrap" style={{ position:"relative", background:"#050000", userSelect:"none" }}
              onTouchStart={e=>setTouchStart(e.touches[0].clientX)}
              onTouchEnd={e=>{ if(touchStart===null)return; const d=touchStart-e.changedTouches[0].clientX; if(Math.abs(d)>40)go(d>0?1:-1); setTouchStart(null); }}>

              {cur.kind === "image" ? (
                <img src={cur.url} alt={p.title} className="ah-modal-main-img" style={{ width:"100%", height:"auto", display:"block", background:"#050000" }}
                  onError={e=>{(e.target as HTMLImageElement).src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";}} />
              ) : playing ? (
                cur.url.includes(".mp4")
                  ? <video src={cur.url} autoPlay controls style={{ width:"100%", aspectRatio:"16/9", display:"block", background:"#000" }} />
                  : <div style={{ position:"relative", aspectRatio:"16/9", width:"100%" }}><iframe src={cur.embedUrl} style={{ position:"absolute", inset:0, width:"100%", height:"100%", border:"none" }} allow="autoplay; fullscreen" allowFullScreen /></div>
              ) : (
                <div style={{ width:"100%", aspectRatio:"16/9", background:"#0A0101", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", position:"relative" }} onClick={()=>setPlaying(true)}>
                  <div style={{ width:60, height:60, borderRadius:"50%", background:"linear-gradient(135deg,#D4A422,#F0C355)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 8px 32px rgba(0,0,0,0.7)" }}>
                    <span style={{ color:"#0E0101", fontSize:"1.4rem", marginLeft:5 }}>▶</span>
                  </div>
                  <span style={{ position:"absolute", bottom:14, left:"50%", transform:"translateX(-50%)", fontSize:"0.65rem", color:"rgba(255,255,255,0.4)", letterSpacing:"0.12em", textTransform:"uppercase", whiteSpace:"nowrap" }}>🎬 Property Video</span>
                </div>
              )}

              {total > 1 && !playing && (<>
                <button onClick={e=>go(-1,e)} style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.65)",border:"none",color:"#F0C355",width:34,height:34,borderRadius:"50%",cursor:"pointer",fontSize:"1.1rem",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2 }}>‹</button>
                <button onClick={e=>go(1,e)} style={{ position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.65)",border:"none",color:"#F0C355",width:34,height:34,borderRadius:"50%",cursor:"pointer",fontSize:"1.1rem",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2 }}>›</button>
                <div style={{ position:"absolute",top:10,right:50,background:"rgba(0,0,0,0.7)",color:"#F0C355",fontSize:"0.65rem",padding:"3px 10px",borderRadius:10,zIndex:2,display:"flex",alignItems:"center",gap:4 }}>
                  {cur.kind==="video"&&<span>🎬</span>}{idx+1}/{total}
                </div>
              </>)}

              <span style={{ position:"absolute",top:12,left:12,background:p.type==="sale"?"#D4A422":"rgba(212,164,34,0.15)",color:p.type==="sale"?"#0E0101":"#F0C355",border:p.type==="rent"?"1px solid rgba(212,164,34,0.4)":"none",padding:"4px 12px",borderRadius:2,fontSize:"0.6rem",fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",zIndex:2 }}>
                {p.type==="sale"?"For Sale":"For Rent"}
              </span>
            </div>

            {/* Thumbnails */}
            {total > 1 && (
              <div style={{ display:"flex", gap:5, padding:"8px 10px", overflowX:"auto", background:"rgba(0,0,0,0.5)", scrollbarWidth:"none" }}>
                {media.map((m,i) => (
                  <div key={i} onClick={()=>{setIdx(i);setPlaying(false);}} style={{ flexShrink:0, width:64, height:44, borderRadius:3, overflow:"hidden", cursor:"pointer", border: i===idx ? "2px solid #D4A422" : "2px solid rgba(255,255,255,0.05)", opacity: i===idx ? 1 : 0.5, transition:"all 0.2s", background:"#0A0101", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {m.kind==="image"
                      ? <img src={m.url} style={{ width:"100%", height:"100%", objectFit:"contain", background:"#0A0101" }} onError={e=>{(e.target as HTMLImageElement).style.display="none";}} />
                      : <span style={{ fontSize:"1rem" }}>🎬</span>
                    }
                  </div>
                ))}
              </div>
            )}

            {/* Info */}
            <div style={{ padding:"20px 22px 24px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, marginBottom:12, flexWrap:"wrap" }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.3rem,3vw,1.9rem)", fontWeight:400, color:"#FFFFFF", marginBottom:3, lineHeight:1.2 }}>{p.title}</h2>
                  {p.subtitle && <p style={{ fontSize:"0.82rem", color:"#E2C99A", fontStyle:"italic", marginBottom:4 }}>{p.subtitle}</p>}
                  <div style={{ fontSize:"0.75rem", color:"#B8892A" }}>📍 {p.location}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.3rem,2.5vw,1.8rem)", fontWeight:600, color:"#F0C355", lineHeight:1 }}>{p.price}</div>
                  {p.price_suffix && <div style={{ fontSize:"0.72rem", color:"#B8892A", marginTop:2 }}>{p.price_suffix}</div>}
                </div>
              </div>

              {specs.length > 0 && (
                <div style={{ display:"flex", gap:0, marginBottom:16, background:"rgba(212,164,34,0.04)", border:"1px solid rgba(212,164,34,0.1)", borderRadius:3 }}>
                  {specs.map((s,i) => (
                    <div key={i} style={{ flex:1, textAlign:"center", borderRight: i<specs.length-1 ? "1px solid rgba(212,164,34,0.1)" : "none", padding:"10px 6px" }}>
                      <div style={{ fontSize:"1.1rem", marginBottom:2 }}>{s.icon}</div>
                      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", fontWeight:600, color:"#F0C355", lineHeight:1 }}>{s.val}{s.suffix||""}</div>
                      <div style={{ fontSize:"0.56rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"#B8892A", marginTop:2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {p.description && (
                <div style={{ padding:"14px 16px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(212,164,34,0.08)", borderRadius:3 }}>
                  <div style={{ fontSize:"0.56rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"#D4A422", marginBottom:8 }}>About This Property</div>
                  <p style={{ fontSize:"0.83rem", color:"#E2C99A", lineHeight:1.85, whiteSpace:"pre-wrap", margin:0 }}>{p.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* ─── RIGHT: Tabbed forms ─── */}
          <div style={{ borderLeft:"1px solid rgba(212,164,34,0.08)", display:"flex", flexDirection:"column", background:"rgba(0,0,0,0.25)" }}>

            {/* Tabs */}
            <div style={{ display:"flex", borderBottom:"1px solid rgba(212,164,34,0.12)" }}>
              {([["booking","📅 Book Viewing"],["enquiry","📩 Enquire"]] as const).map(([id, label]) => (
                <button key={id} onClick={()=>setRightTab(id)} style={{
                  flex:1, padding:"14px 8px", background: rightTab===id ? "rgba(212,164,34,0.1)" : "transparent",
                  border:"none", borderBottom: rightTab===id ? "2px solid #D4A422" : "2px solid transparent",
                  color: rightTab===id ? "#F0C355" : "#6B4F20", cursor:"pointer",
                  fontFamily:"'Jost',sans-serif", fontSize:"0.72rem", letterSpacing:"0.1em",
                  textTransform:"uppercase", transition:"all 0.2s",
                }}>
                  {label}
                </button>
              ))}
            </div>

            <div style={{ flex:1, padding:"20px 18px", overflowY:"auto" }}>

              {/* ── BOOKING TAB ── */}
              {rightTab === "booking" && (
                bStatus === "success" ? (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, textAlign:"center", padding:"40px 0" }}>
                    <div style={{ fontSize:"2.5rem" }}>📅</div>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.2rem", color:"#F0C355" }}>Viewing requested!</p>
                    <p style={{ fontSize:"0.78rem", color:"#B8892A", lineHeight:1.6 }}>We'll confirm via {bForm.preferred_contact} within hours.</p>
                  </div>
                ) : (
                  <form onSubmit={submitBooking} style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    <div>
                      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:"#FFFFFF", marginBottom:4 }}>
                        Book a Viewing
                      </p>
                      <p style={{ fontSize:"0.72rem", color:"#B8892A", lineHeight:1.6, marginBottom:4 }}>
                        <strong style={{color:"#B8892A"}}>{p.title}</strong> — we'll confirm a time that works.
                      </p>
                    </div>
                    <div>
                      <label className="ah-label">Full Name *</label>
                      <input required value={bForm.name} onChange={e=>setBForm({...bForm,name:e.target.value})} className="ah-input" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="ah-label">Phone *</label>
                      <input required value={bForm.phone} onChange={e=>setBForm({...bForm,phone:e.target.value})} className="ah-input" placeholder="+254..." inputMode="tel" />
                    </div>
                    <div>
                      <label className="ah-label">Email</label>
                      <input type="email" value={bForm.email} onChange={e=>setBForm({...bForm,email:e.target.value})} className="ah-input" placeholder="your@email.com" />
                    </div>
                    <div>
                      <label className="ah-label">Preferred Viewing Date</label>
                      <input type="date" value={bForm.viewing_date} onChange={e=>setBForm({...bForm,viewing_date:e.target.value})} className="ah-input" style={{colorScheme:"dark"}} />
                    </div>
                    <div>
                      <label className="ah-label">How should we confirm? *</label>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:2 }}>
                        {contactOpts.map(opt=>(
                          <button key={opt.v} type="button" onClick={()=>setBForm({...bForm,preferred_contact:opt.v})}
                            style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 11px", borderRadius:2, border:`1px solid ${bForm.preferred_contact===opt.v?"#D4A422":"rgba(212,164,34,0.2)"}`, background:bForm.preferred_contact===opt.v?"rgba(212,164,34,0.15)":"rgba(255,255,255,0.02)", color:bForm.preferred_contact===opt.v?"#F0C355":"#B8892A", fontSize:"0.7rem", cursor:"pointer", fontFamily:"'Jost',sans-serif", transition:"all 0.2s", whiteSpace:"nowrap" }}>
                            {opt.icon}{opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="ah-label">Notes (optional)</label>
                      <textarea rows={2} value={bForm.message} onChange={e=>setBForm({...bForm,message:e.target.value})} className="ah-input" style={{resize:"vertical"}} placeholder="Preferred time, access needs, questions…" />
                    </div>
                    {bStatus==="error" && <p style={{color:"#f87171",fontSize:"0.75rem"}}>Something went wrong. Try again.</p>}
                    <button type="submit" disabled={bStatus==="loading"} className="ah-btn-gold" style={{padding:"13px 0",width:"100%",fontSize:"0.78rem"}}>
                      {bStatus==="loading" ? "Sending…" : "Request Viewing"}
                    </button>
                    <p style={{ fontSize:"0.65rem", color:"#4A2E10", textAlign:"center", lineHeight:1.5 }}>
                      We'll confirm via <strong style={{color:"#B8892A"}}>{contactOpts.find(o=>o.v===bForm.preferred_contact)?.label}</strong> · Mon–Sat 8am–7pm
                    </p>
                  </form>
                )
              )}

              {/* ── ENQUIRY TAB ── */}
              {rightTab === "enquiry" && (
                eStatus === "success" ? (
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, textAlign:"center", padding:"40px 0" }}>
                    <div style={{ fontSize:"2.5rem" }}>✅</div>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.2rem", color:"#F0C355" }}>Enquiry sent!</p>
                    <p style={{ fontSize:"0.78rem", color:"#B8892A" }}>We'll be in touch via {eForm.preferred_contact} shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={submitEnquiry} style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    <div>
                      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:"#FFFFFF", marginBottom:4 }}>General Enquiry</p>
                      <p style={{ fontSize:"0.72rem", color:"#B8892A", lineHeight:1.6, marginBottom:4 }}>Questions about pricing, availability, or this property.</p>
                    </div>
                    <div>
                      <label className="ah-label">Full Name *</label>
                      <input required value={eForm.name} onChange={e=>setEForm({...eForm,name:e.target.value})} className="ah-input" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="ah-label">Phone *</label>
                      <input required value={eForm.phone} onChange={e=>setEForm({...eForm,phone:e.target.value})} className="ah-input" placeholder="+254..." inputMode="tel" />
                    </div>
                    <div>
                      <label className="ah-label">Email</label>
                      <input type="email" value={eForm.email} onChange={e=>setEForm({...eForm,email:e.target.value})} className="ah-input" placeholder="your@email.com" />
                    </div>
                    <div>
                      <label className="ah-label">How should we contact you? *</label>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:2 }}>
                        {contactOpts.map(opt=>(
                          <button key={opt.v} type="button" onClick={()=>setEForm({...eForm,preferred_contact:opt.v})}
                            style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 11px", borderRadius:2, border:`1px solid ${eForm.preferred_contact===opt.v?"#D4A422":"rgba(212,164,34,0.2)"}`, background:eForm.preferred_contact===opt.v?"rgba(212,164,34,0.15)":"rgba(255,255,255,0.02)", color:eForm.preferred_contact===opt.v?"#F0C355":"#B8892A", fontSize:"0.7rem", cursor:"pointer", fontFamily:"'Jost',sans-serif", transition:"all 0.2s", whiteSpace:"nowrap" }}>
                            {opt.icon}{opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="ah-label">Message</label>
                      <textarea rows={3} value={eForm.message} onChange={e=>setEForm({...eForm,message:e.target.value})} className="ah-input" style={{resize:"vertical"}} placeholder="Viewing time, questions, budget..." />
                    </div>
                    {eStatus==="error" && <p style={{color:"#f87171",fontSize:"0.75rem"}}>Something went wrong. Try again.</p>}
                    <button type="submit" disabled={eStatus==="loading"} className="ah-btn-gold" style={{padding:"13px 0",width:"100%",fontSize:"0.78rem"}}>
                      {eStatus==="loading" ? "Sending…" : "Send Enquiry"}
                    </button>
                    <p style={{ fontSize:"0.65rem", color:"#4A2E10", textAlign:"center", lineHeight:1.5 }}>
                      We'll reach you via <strong style={{color:"#B8892A"}}>{contactOpts.find(o=>o.v===eForm.preferred_contact)?.label}</strong> · Mon–Sat 8am–7pm
                    </p>
                  </form>
                )
              )}

            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ah-modal-main-img { width:100%; height:auto; display:block; }
        @media(max-width:700px){
          .ah-modal-grid{grid-template-columns:1fr!important;}
          .ah-modal-grid > div:last-child { border-left: none !important; border-top: 1px solid rgba(212,164,34,0.12) !important; }
          .ah-modal-img-wrap img.ah-modal-main-img { max-height:none !important; height:auto !important; }
        }
      `}</style>
    </div>
  );
}


// ══════════════════════════════════════════════════════════
// PROP CARD
// ══════════════════════════════════════════════════════════
function PropCard({ p }: { p: any }) {
  const [idx, setIdx] = useState(0);
  const [touchStart, setTouchStart] = useState<number|null>(null);
  const [playing, setPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const media = buildMedia(p);
  const total = media.length;
  const cur = media[idx];

  const go = (dir: number, e?: React.MouseEvent) => { e?.stopPropagation(); setPlaying(false); setIdx(i => (i+dir+total)%total); };

  const specs = [
    {i:"🛏",v:p.beds,suffix:" Beds"},
    {i:"🚿",v:p.baths,suffix:" Baths"},
    {i:"📐",v:p.sqm,suffix:" m²"},
  ].filter(f => f.v && Number(f.v) > 0);

  // Truncate description for card preview
  const descPreview = p.description ? (p.description.length > 100 ? p.description.slice(0, 100).trim() + "…" : p.description) : null;

  return (
    <>
      {showModal && <PropertyModal p={p} onClose={()=>setShowModal(false)} />}

      <article className="ah-card ah-propcard" itemScope itemType="https://schema.org/RealEstateListing"
        style={{ overflow:"hidden", cursor:"pointer", display:"flex", flexDirection:"column" }}
        onClick={()=>setShowModal(true)}>

        {/* Image area */}
        <div style={{ position:"relative", aspectRatio:"4/3", overflow:"hidden", background:"#0A0101", userSelect:"none", flexShrink:0 }}
          onTouchStart={e=>setTouchStart(e.touches[0].clientX)}
          onTouchEnd={e=>{ if(touchStart===null)return; const d=touchStart-e.changedTouches[0].clientX; if(Math.abs(d)>40)go(d>0?1:-1); setTouchStart(null); }}>

          {cur.kind === "image" ? (
            <img src={cur.url} alt={p.title} itemProp="image" className="ah-card-img"
              style={{ display:"block", background:"#0A0101" }}
              onError={e=>{(e.target as HTMLImageElement).src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80";}} />
          ) : playing ? (
            cur.url.includes(".mp4")
              ? <video src={cur.url} autoPlay controls style={{ width:"100%", height:"100%", background:"#000" }} />
              : <iframe src={cur.embedUrl} style={{ width:"100%", height:"100%", border:"none" }} allow="autoplay; fullscreen" allowFullScreen />
          ) : (
            <div style={{ width:"100%", height:"100%", background:"#0A0101", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}
              onClick={e=>{ e.stopPropagation(); setPlaying(true); }}>
              <div style={{ width:50, height:50, borderRadius:"50%", background:"linear-gradient(135deg,#D4A422,#F0C355)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 20px rgba(0,0,0,0.6)" }}>
                <span style={{ color:"#0E0101", fontSize:"1.2rem", marginLeft:4 }}>▶</span>
              </div>
              <span style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)", fontSize:"0.62rem", color:"rgba(255,255,255,0.45)", letterSpacing:"0.1em", textTransform:"uppercase", whiteSpace:"nowrap" }}>🎬 Tour Video</span>
            </div>
          )}

          {total > 1 && !playing && (<>
            <button onClick={e=>go(-1,e)} style={{ position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.6)",border:"none",color:"#F0C355",width:26,height:26,borderRadius:"50%",cursor:"pointer",fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2 }}>‹</button>
            <button onClick={e=>go(1,e)} style={{ position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.6)",border:"none",color:"#F0C355",width:26,height:26,borderRadius:"50%",cursor:"pointer",fontSize:"0.85rem",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2 }}>›</button>
            <div style={{ position:"absolute",bottom:8,left:0,right:0,display:"flex",justifyContent:"center",gap:5,zIndex:2 }}>
              {media.map((_,i) => (
                <button key={i} onClick={e=>{ e.stopPropagation(); setPlaying(false); setIdx(i); }}
                  style={{ width:i===idx?14:5, height:5, borderRadius:3, background:i===idx?"#F0C355":"rgba(255,255,255,0.3)", border:"none", cursor:"pointer", padding:0, transition:"all 0.25s" }}/>
              ))}
            </div>
          </>)}

          {/* Status badge */}
          <span style={{ position:"absolute",top:12,left:12,background:p.type==="sale"?"#D4A422":"rgba(10,1,1,0.8)",color:p.type==="sale"?"#0E0101":"#F0C355",border:p.type==="rent"?"1px solid rgba(212,164,34,0.4)":"none",padding:"4px 11px",borderRadius:2,fontSize:"0.6rem",fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",zIndex:2,backdropFilter:"blur(4px)" }}>
            {p.type==="sale"?"For Sale":"For Rent"}
          </span>

          {/* Image count */}
          {total > 1 && (
            <span style={{ position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.65)",color:"#F0C355",fontSize:"0.6rem",padding:"3px 8px",borderRadius:10,zIndex:2 }}>
              {total} {cur.kind==="video"?"🎬":"📷"}
            </span>
          )}
        </div>

        {/* Card body */}
        <div style={{ padding:"18px 20px 20px", display:"flex", flexDirection:"column", flex:1 }}>
          {/* Price */}
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.55rem", fontWeight:600, color:"#F0C355", lineHeight:1, marginBottom:6 }} itemProp="price">
            {p.price}
            {p.price_suffix && <span style={{ fontSize:"0.72rem", fontFamily:"'Jost',sans-serif", fontWeight:300, color:"#B8892A", marginLeft:4 }}>{p.price_suffix}</span>}
          </div>

          {/* Title */}
          <div style={{ fontSize:"0.95rem", fontWeight:500, color:"#FFFFFF", marginBottom:4, lineHeight:1.3 }} itemProp="name">{p.title}</div>

          {/* Location */}
          <div style={{ fontSize:"0.75rem", color:"#B8892A", marginBottom:12, display:"flex", alignItems:"center", gap:4 }}>
            <span>📍</span><span itemProp="address">{p.location}</span>
          </div>

          {/* Description preview — always visible */}
          {descPreview && (
            <p style={{ fontSize:"0.78rem", color:"#B8892A", lineHeight:1.7, marginBottom:14, flexGrow:1 }}>{descPreview}</p>
          )}

          {/* Divider */}
          <div style={{ borderTop:"1px solid rgba(212,164,34,0.08)", paddingTop:14, marginTop: descPreview ? 0 : "auto", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
              {specs.map((f,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:4, fontSize:"0.72rem", color:"#B8892A" }}>
                  <span>{f.i}</span>{f.v}{f.suffix}
                </div>
              ))}
            </div>
            <span style={{ fontSize:"0.65rem", color:"#D4A422", letterSpacing:"0.12em", textTransform:"uppercase", flexShrink:0, marginLeft:8 }}>Details →</span>
          </div>
        </div>
      </article>
    </>
  );
}

// ══════════════════════════════════════════════════════════
// VIDEO CARD
// ══════════════════════════════════════════════════════════
function VideoCard({ video }: { video: any }) {
  const [playing, setPlaying] = useState(false);
  const getUrl = () => {
    if (video.video_type==="youtube"){const id=video.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];return id?`https://www.youtube.com/embed/${id}?autoplay=1`:video.video_url;}
    if (video.video_type==="vimeo"){const id=video.video_url.match(/vimeo\.com\/(\d+)/)?.[1];return id?`https://player.vimeo.com/video/${id}?autoplay=1`:video.video_url;}
    return video.video_url;
  };
  return (
    <div className="ah-card" style={{ overflow:"hidden", transition:"transform 0.3s,box-shadow 0.3s" }}
      onMouseEnter={e=>{const el=e.currentTarget;el.style.transform="translateY(-4px)";el.style.boxShadow="0 20px 50px rgba(0,0,0,0.4)";}}
      onMouseLeave={e=>{const el=e.currentTarget;el.style.transform="";el.style.boxShadow="";}}>
      <div style={{ position:"relative", aspectRatio:"16/9", background:"#0A0101", cursor:"pointer" }} onClick={()=>setPlaying(true)}>
        {playing ? (
          <iframe src={getUrl()} style={{ width:"100%", height:"100%", border:"none" }} allow="autoplay;fullscreen" allowFullScreen />
        ) : (<>
          {video.thumbnail_url
            ? <img src={video.thumbnail_url} alt={video.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#1A0303,#0A0101)" }}><span style={{ fontSize:"2.5rem", opacity:0.15 }}>🎬</span></div>
          }
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.3)" }}>
            <div style={{ width:50, height:50, borderRadius:"50%", background:"linear-gradient(135deg,#D4A422,#F0C355)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 6px 24px rgba(0,0,0,0.5)" }}>
              <span style={{ color:"#0E0101", fontSize:"1.1rem", marginLeft:3 }}>▶</span>
            </div>
          </div>
        </>)}
      </div>
      <div style={{ padding:"14px 18px" }}>
        {video.category && <span style={{ fontSize:"0.58rem", letterSpacing:"0.12em", textTransform:"uppercase", background:"rgba(212,164,34,0.1)", color:"#F0C355", padding:"2px 8px", borderRadius:2 }}>{video.category}</span>}
        <div style={{ fontSize:"0.93rem", fontWeight:500, color:"#FFFFFF", marginTop:8, marginBottom:2 }}>{video.title}</div>
        {video.location_tag && <div style={{ fontSize:"0.73rem", color:"#B8892A" }}>📍 {video.location_tag}</div>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// PUBLIC REVIEWS
// ══════════════════════════════════════════════════════════
function PublicReviewsList() {
  const { data: reviews } = useApi<any[]>("/api/reviews");
  if (!reviews || reviews.length === 0)
    return <div style={{ color:"#B8892A", fontSize:"0.82rem", paddingTop:20 }}>No reviews yet — be the first!</div>;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      {reviews.slice(0,6).map((r:any,i:number) => (
        <div key={r.id||i} style={{ padding:"18px 20px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(212,164,34,0.08)", borderRadius:4 }}>
          <div style={{ color:"#D4A422", fontSize:"0.78rem", marginBottom:8, letterSpacing:2 }}>{"★".repeat(r.rating||5)}<span style={{color:"rgba(212,164,34,0.25)"}}>{"★".repeat(5-(r.rating||5))}</span></div>
          <p style={{ fontSize:"0.84rem", color:"#E2C99A", lineHeight:1.75, marginBottom:12, fontStyle:"italic" }}>"{r.review}"</p>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:"0.78rem", fontWeight:500, color:"#FFFFFF" }}>{r.name}</span>
            {r.property_ref && <span style={{ fontSize:"0.65rem", color:"#B8892A" }}>📍 {r.property_ref}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function PublicReviewForm() {
  const [form, setForm] = useState({ name:"", rating:5, review:"", property_ref:"" });
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus("loading");
    try {
      const _API = import.meta.env.VITE_API_URL || "";
      await fetch(`${_API}/api/reviews`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
      setStatus("success");
    } catch { setStatus("error"); }
  };
  if (status === "success") return (
    <div style={{ padding:"40px 0", textAlign:"center" }}>
      <div style={{ fontSize:"2rem", marginBottom:12 }}>🙏</div>
      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.2rem", color:"#F0C355" }}>Thank you for your review!</p>
    </div>
  );
  return (
    <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.4rem", color:"#FFFFFF", marginBottom:4 }}>Leave a Review</h3>
      <div>
        <label className="ah-label">Your Name *</label>
        <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="ah-input" placeholder="Your name" />
      </div>
      <div>
        <label className="ah-label">Rating</label>
        <div style={{ display:"flex", gap:6 }}>
          {[1,2,3,4,5].map(n => (
            <button key={n} type="button" onClick={()=>setForm({...form,rating:n})}
              style={{ background:"none", border:"none", cursor:"pointer", fontSize:"1.3rem", color:n<=form.rating?"#D4A422":"rgba(212,164,34,0.2)", padding:0, transition:"color 0.2s" }}>★</button>
          ))}
        </div>
      </div>
      <div>
        <label className="ah-label">Property (optional)</label>
        <input value={form.property_ref} onChange={e=>setForm({...form,property_ref:e.target.value})} className="ah-input" placeholder="e.g. Karen Villa" />
      </div>
      <div>
        <label className="ah-label">Your Review *</label>
        <textarea required rows={4} value={form.review} onChange={e=>setForm({...form,review:e.target.value})} className="ah-input" placeholder="Share your experience with Aeton Homes…" />
      </div>
      {status==="error" && <p style={{color:"#f87171",fontSize:"0.76rem"}}>Something went wrong. Please try again.</p>}
      <button type="submit" disabled={status==="loading"} className="ah-btn-gold" style={{width:"100%",padding:12}}>
        {status==="loading"?"Submitting…":"Submit Review"}
      </button>
    </form>
  );
}

// ══════════════════════════════════════════════════════════
// CONTACT FORM
// ══════════════════════════════════════════════════════════
function ContactForm() {
  const [form, setForm] = useState({ name:"", email:"", phone:"", interest:"", message:"", preferred_contact:"call" });
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setStatus("loading");
    try {
      const _API = import.meta.env.VITE_API_URL || "";
      await fetch(`${_API}/api/enquiries`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({...form, source:"contact_form"}) });
      setStatus("success"); setForm({name:"",email:"",phone:"",interest:"",message:"",preferred_contact:"call"});
    } catch { setStatus("error"); }
  };

  if (status === "success") return (
    <div style={{ padding:"60px 0", textAlign:"center" }}>
      <div style={{ fontSize:"2.5rem", marginBottom:16 }}>✅</div>
      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.4rem", color:"#F0C355", marginBottom:8 }}>Message received!</p>
      <p style={{ fontSize:"0.82rem", color:"#B8892A" }}>Our team will be in touch via {form.preferred_contact} very soon.</p>
    </div>
  );

  const contactOpts = [
    {v:"call", label:"Phone Call", icon:<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>},
    {v:"whatsapp", label:"WhatsApp", icon:<svg viewBox="0 0 32 32" fill="currentColor" width="14" height="14"><path d="M16 2C8.27 2 2 8.27 2 16c0 2.44.64 4.73 1.76 6.72L2 30l7.44-1.74A13.9 13.9 0 0 0 16 30c7.73 0 14-6.27 14-14S23.73 2 16 2zm6.29 19.47c-.34-.17-2.02-.99-2.33-1.1-.31-.12-.54-.17-.77.17-.23.34-.88 1.1-1.08 1.33-.2.23-.4.25-.74.08-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.7-2.01-1.9-2.35-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.08-.17-.77-1.85-1.05-2.54-.28-.67-.56-.58-.77-.59l-.66-.01c-.23 0-.6.08-.91.4s-1.2 1.17-1.2 2.85c0 1.68 1.23 3.31 1.4 3.54.17.23 2.41 3.68 5.84 5.16.82.35 1.45.56 1.95.72.82.26 1.57.22 2.16.13.66-.1 2.02-.82 2.3-1.62.29-.8.29-1.48.2-1.62-.08-.14-.31-.22-.65-.39z"/></svg>},
    {v:"sms", label:"SMS", icon:<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/></svg>},
    {v:"telegram", label:"Telegram", icon:<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>},
    {v:"email", label:"Email", icon:<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>},
  ];

  return (
    <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div>
        <h2 style={{...T.h2, fontSize:"clamp(1.6rem,3vw,2.2rem)"}}>Send Us a <em style={T.em}>Message</em></h2>
        <p style={{...T.sub, marginBottom:28}}>Tell us what you're looking for and we'll match you with the perfect property.</p>
      </div>
      <div className="ah-name-phone-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <div>
          <label className="ah-label">Full Name *</label>
          <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="ah-input" placeholder="Your name" />
        </div>
        <div>
          <label className="ah-label">Phone *</label>
          <input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="ah-input" placeholder="+254..." />
        </div>
      </div>
      <div>
        <label className="ah-label">Email</label>
        <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="ah-input" placeholder="your@email.com" />
      </div>
      <div>
        <label className="ah-label">I'm interested in</label>
        <select value={form.interest} onChange={e=>setForm({...form,interest:e.target.value})} className="ah-input" style={{appearance:"none",cursor:"pointer"}}>
          {["","Buying a Home","Renting a Property","Commercial Space","Investment Property","Land Purchase","General Enquiry"].map(o=><option key={o} value={o} style={{background:"#0E0101"}}>{o||"Select..."}</option>)}
        </select>
      </div>

      {/* Preferred contact method */}
      <div>
        <label className="ah-label">How should we contact you? *</label>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:2 }}>
          {contactOpts.map(opt => (
            <button key={opt.v} type="button" onClick={()=>setForm({...form,preferred_contact:opt.v})}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 14px", borderRadius:2, border:`1px solid ${form.preferred_contact===opt.v?"#D4A422":"rgba(212,164,34,0.2)"}`, background:form.preferred_contact===opt.v?"rgba(212,164,34,0.15)":"rgba(255,255,255,0.02)", color:form.preferred_contact===opt.v?"#F0C355":"#B8892A", fontSize:"0.76rem", cursor:"pointer", fontFamily:"'Jost',sans-serif", transition:"all 0.2s", whiteSpace:"nowrap" }}>
              {opt.icon}{opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="ah-label">Message</label>
        <textarea rows={4} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} className="ah-input" style={{resize:"vertical"}} placeholder="Budget, preferred location, timeline, requirements…" />
      </div>
      {status==="error" && <p style={{color:"#f87171",fontSize:"0.78rem"}}>Something went wrong. Please try again.</p>}
      <button type="submit" disabled={status==="loading"} className="ah-btn-gold" style={{padding:"13px 0",width:"100%",fontSize:"0.78rem"}}>
        {status==="loading"?"Sending…":"Send Message"}
      </button>
      <p style={{ fontSize:"0.68rem", color:"#4A2E10", textAlign:"center", lineHeight:1.5 }}>
        We'll contact you via <strong style={{color:"#B8892A"}}>{contactOpts.find(o=>o.v===form.preferred_contact)?.label}</strong> · Mon–Sat 8am–7pm
      </p>
    </form>
  );
}
