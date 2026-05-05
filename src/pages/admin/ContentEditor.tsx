import { useState, useEffect } from "react";
import { DEFAULTS } from "../../lib/defaults";
import { showToast } from "./index";

const API = import.meta.env.VITE_API_URL || "";

const SECTIONS = [
  {
    id: "hero", label: "🖼️ Hero Section",
    fields: [
      {key:"hero_badge",label:"Badge Text"},
      {key:"hero_title",label:"Title Line 1"},
      {key:"hero_title_em",label:"Title Highlight (italic gold)"},
      {key:"hero_title_end",label:"Title Line 3"},
      {key:"hero_subtitle",label:"Subtitle"},
      {key:"hero_btn1",label:"Button 1 Label"},
      {key:"hero_btn2",label:"Button 2 Label"},
    ],
  },
  {
    id: "stats", label: "📊 Stats",
    fields: [
      {key:"stat_1_num",label:"Stat 1 Number"},{key:"stat_1_label",label:"Stat 1 Label"},
      {key:"stat_2_num",label:"Stat 2 Number"},{key:"stat_2_label",label:"Stat 2 Label"},
      {key:"stat_3_num",label:"Stat 3 Number"},{key:"stat_3_label",label:"Stat 3 Label"},
      {key:"stat_4_num",label:"Stat 4 Number"},{key:"stat_4_label",label:"Stat 4 Label"},
    ],
  },
  {
    id: "props", label: "🏠 Properties Section Header",
    fields: [
      {key:"props_eyebrow",label:"Eyebrow"},{key:"props_title",label:"Title"},
      {key:"props_title_em",label:"Title Highlight"},{key:"props_subtitle",label:"Subtitle",textarea:true},
    ],
  },
  {
    id: "why", label: "✅ Why Us",
    fields: [
      {key:"why_eyebrow",label:"Eyebrow"},{key:"why_title",label:"Title Line 1"},
      {key:"why_title_em",label:"Title Highlight"},{key:"why_title_end",label:"Title Line 3"},
      {key:"why_subtitle",label:"Subtitle",textarea:true},
      {key:"why_badge_num",label:"Badge Number"},{key:"why_badge_label",label:"Badge Label"},
      {key:"why_feat_1_icon",label:"Feature 1 Icon (emoji)"},{key:"why_feat_1_title",label:"Feature 1 Title"},{key:"why_feat_1_desc",label:"Feature 1 Description",textarea:true},
      {key:"why_feat_2_icon",label:"Feature 2 Icon"},{key:"why_feat_2_title",label:"Feature 2 Title"},{key:"why_feat_2_desc",label:"Feature 2 Description",textarea:true},
      {key:"why_feat_3_icon",label:"Feature 3 Icon"},{key:"why_feat_3_title",label:"Feature 3 Title"},{key:"why_feat_3_desc",label:"Feature 3 Description",textarea:true},
      {key:"why_feat_4_icon",label:"Feature 4 Icon"},{key:"why_feat_4_title",label:"Feature 4 Title"},{key:"why_feat_4_desc",label:"Feature 4 Description",textarea:true},
    ],
  },
  {
    id: "process", label: "⚙️ Process Steps",
    fields: [
      {key:"process_eyebrow",label:"Eyebrow"},{key:"process_title",label:"Title"},{key:"process_title_em",label:"Title Highlight"},
      {key:"process_step_1_title",label:"Step 1 Title"},{key:"process_step_1_desc",label:"Step 1 Description",textarea:true},
      {key:"process_step_2_title",label:"Step 2 Title"},{key:"process_step_2_desc",label:"Step 2 Description",textarea:true},
      {key:"process_step_3_title",label:"Step 3 Title"},{key:"process_step_3_desc",label:"Step 3 Description",textarea:true},
      {key:"process_step_4_title",label:"Step 4 Title"},{key:"process_step_4_desc",label:"Step 4 Description",textarea:true},
    ],
  },
  {
    id: "testi", label: "⭐ Testimonials Header",
    fields: [
      {key:"testi_eyebrow",label:"Eyebrow"},{key:"testi_title",label:"Title"},{key:"testi_title_em",label:"Title Highlight"},
    ],
  },
  {
    id: "team", label: "👤 Team Section Header",
    fields: [
      {key:"team_eyebrow",label:"Eyebrow"},{key:"team_title",label:"Title"},{key:"team_title_em",label:"Title Highlight"},
    ],
  },
  {
    id: "contact", label: "📞 Contact Info",
    fields: [
      {key:"contact_eyebrow",label:"Eyebrow"},{key:"contact_title",label:"Title"},{key:"contact_title_em",label:"Title Highlight"},
      {key:"contact_subtitle",label:"Subtitle",textarea:true},
      {key:"contact_phone",label:"Phone Number"},{key:"contact_email",label:"Email Address"},
      {key:"contact_address",label:"Office Address"},{key:"contact_whatsapp",label:"WhatsApp Number (digits only, e.g. 254700000000)"},
    ],
  },
  {
    id: "nav", label: "🧭 Navigation Links",
    fields: [
      {key:"nav_link_1_label",label:"Link 1 Label"},{key:"nav_link_1_href",label:"Link 1 URL"},
      {key:"nav_link_2_label",label:"Link 2 Label"},{key:"nav_link_2_href",label:"Link 2 URL"},
      {key:"nav_link_3_label",label:"Link 3 Label"},{key:"nav_link_3_href",label:"Link 3 URL"},
      {key:"nav_link_4_label",label:"Link 4 Label"},{key:"nav_link_4_href",label:"Link 4 URL"},
      {key:"nav_link_5_label",label:"Link 5 Label (CTA button)"},{key:"nav_link_5_href",label:"Link 5 URL"},
    ],
  },
  {
    id: "footer", label: "🦶 Footer",
    fields: [{key:"footer_desc",label:"Footer Description",textarea:true}],
  },
];

export default function ContentEditor({ token }: { token: string }) {
  const [content, setContent] = useState<Record<string,string>>({});
  const [openSection, setOpenSection] = useState<string>("hero");
  const [saving, setSaving] = useState(false);
  const [marqueeRaw, setMarqueeRaw] = useState("");

  useEffect(()=>{
    fetch(`${API}/api/content`).then(r=>r.json()).then((data:Record<string,string>)=>{
      setContent(data);
      try { setMarqueeRaw(JSON.parse(data.marquee_items||"[]").join("\n")); } catch {}
    });
  },[]);

  const save = async (keys: string[]) => {
    setSaving(true);
    const payload: Record<string,string> = {};
    keys.forEach(k=>{ payload[k] = content[k]??DEFAULTS[k]??""; });
    try {
      await fetch(`${API}/api/content`,{method:"PUT",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},body:JSON.stringify(payload)});
      showToast("Saved successfully!");
    } catch { showToast("Save failed","error"); } finally { setSaving(false); }
  };

  const saveMarquee = async () => {
    const items = marqueeRaw.split("\n").map(l=>l.trim()).filter(Boolean);
    setSaving(true);
    try {
      await fetch(`${API}/api/content`,{method:"PUT",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},body:JSON.stringify({marquee_items:JSON.stringify(items)})});
      setContent({...content,marquee_items:JSON.stringify(items)});
      showToast("Marquee saved!");
    } catch { showToast("Save failed","error"); } finally { setSaving(false); }
  };

  return (
    <div>
      <h2 className="ah-section-title" style={{ marginBottom:6 }}>Site Content Editor</h2>
      <p style={{ fontSize:"0.82rem",color:"#C4A97A",marginBottom:28 }}>Edit every text on the website. Changes are live immediately.</p>

      {/* Marquee special section */}
      <div className="ah-card" style={{ marginBottom:14,overflow:"hidden" }}>
        <button onClick={()=>setOpenSection(openSection==="marquee"?"":"marquee")} style={{ width:"100%",padding:"16px 22px",background:"none",border:"none",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",color:"#E8B84B",fontFamily:"'Jost',sans-serif",fontSize:"0.82rem",letterSpacing:"0.1em",textTransform:"uppercase" }}>
          <span>📢 Marquee Ticker</span><span>{openSection==="marquee"?"▲":"▼"}</span>
        </button>
        {openSection==="marquee"&&(
          <div style={{ padding:"0 22px 22px" }}>
            <label className="ah-label">Ticker items — one per line</label>
            <textarea value={marqueeRaw} onChange={e=>setMarqueeRaw(e.target.value)} rows={8} className="ah-input" style={{ resize:"vertical",fontFamily:"monospace",fontSize:"0.84rem" }} placeholder={"Luxury Homes for Sale\nPrime Nairobi Locations\n..."}/>
            <div style={{ marginTop:12 }}>
              <button onClick={saveMarquee} disabled={saving} className="ah-btn-gold">{saving?"Saving...":"Save Marquee"}</button>
            </div>
          </div>
        )}
      </div>

      {SECTIONS.map(sec=>{
        const isOpen = openSection===sec.id;
        return (
          <div key={sec.id} className="ah-card" style={{ marginBottom:10,overflow:"hidden" }}>
            <button onClick={()=>setOpenSection(isOpen?"":sec.id)} style={{ width:"100%",padding:"16px 22px",background:"none",border:"none",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",color:"#E8B84B",fontFamily:"'Jost',sans-serif",fontSize:"0.82rem",letterSpacing:"0.1em",textTransform:"uppercase" }}>
              <span>{sec.label}</span><span>{isOpen?"▲":"▼"}</span>
            </button>
            {isOpen&&(
              <div style={{ padding:"0 22px 24px" }}>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"16px 20px",marginBottom:18 }}>
                  {sec.fields.map(f=>(
                    <div key={f.key} style={(f as any).textarea?{gridColumn:"1/-1"}:{}}>
                      <label className="ah-label">{f.label}</label>
                      {(f as any).textarea?(
                        <textarea value={content[f.key]??DEFAULTS[f.key]??""} onChange={e=>setContent({...content,[f.key]:e.target.value})} rows={3} className="ah-input" style={{ resize:"vertical" }}/>
                      ):(
                        <input value={content[f.key]??DEFAULTS[f.key]??""} onChange={e=>setContent({...content,[f.key]:e.target.value})} className="ah-input"/>
                      )}
                    </div>
                  ))}
                </div>
                <button onClick={()=>save(sec.fields.map(f=>f.key))} disabled={saving} className="ah-btn-gold">
                  {saving?"Saving...":"Save "+sec.label.split(" ").slice(1).join(" ")}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
