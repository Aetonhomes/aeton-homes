import { c } from "../lib/defaults";

const SOCIALS = [
  {
    label: "Facebook",
    url: "https://www.facebook.com/share/1Coc9tP66r/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
        <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    url: "https://www.instagram.com/alexwycliffe?igsh=MWg4M3M0dzkwZHU4eg==",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    label: "TikTok",
    url: "https://www.tiktok.com/@realtyalex1?_r=1&_t=ZS-966bf6NGgEC",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    url: "https://youtube.com/@aetonhomes7948?si=lpnW43bQkMbaX2Pk",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
];

export default function Footer({ content }: { content: Record<string, string> }) {
  return (
    <footer style={{ background: "#080101", borderTop: "1px solid rgba(201,150,26,0.15)", padding: "60px 5% 30px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 50, marginBottom: 48 }}
        className="ah-footer-grid">
        <div>
          <a href="/" style={{ display: "flex", alignItems: "center", marginBottom: 14, textDecoration: "none" }}>
            <img src="https://jewelbookstore.neocities.org/logo.jpeg" alt="Aeton Homes" style={{ height: 48, objectFit: "contain", borderRadius: 3 }} />
          </a>
          <p style={{ fontSize: "0.82rem", color: "#C4A97A", lineHeight: 1.8, maxWidth: 260 }}>
            {c(content, "footer_desc")}
          </p>
          {/* Social icons */}
          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                title={s.label}
                style={{
                  width: 36, height: 36, borderRadius: 4,
                  background: "rgba(201,150,26,0.08)", border: "1px solid rgba(201,150,26,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#E8B84B", textDecoration: "none",
                  transition: "background 0.2s, border-color 0.2s, transform 0.2s",
                }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.background = "rgba(201,150,26,0.2)"; el.style.borderColor = "rgba(201,150,26,0.5)"; el.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.background = "rgba(201,150,26,0.08)"; el.style.borderColor = "rgba(201,150,26,0.2)"; el.style.transform = ""; }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        {[
          { title: "Properties", links: ["For Sale","For Rent","Commercial","Land & Plots","New Developments"] },
          { title: "Locations", links: ["Karen","Westlands","Kilimani","Lavington","Runda"] },
          { title: "Company", links: ["About Us","Our Team","Careers","Contact"] },
        ].map((col, i) => (
          <div key={i}>
            <h5 style={{ fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#C9961A", marginBottom: 18 }}>{col.title}</h5>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
              {col.links.map((l, j) => (
                <li key={j}><a href="#" style={{ fontSize: "0.82rem", color: "#C4A97A", textDecoration: "none" }}>{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(201,150,26,0.1)", paddingTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, fontSize: "0.72rem", color: "#C4A97A" }}>
        <span>© {new Date().getFullYear()} Aeton Homes. All rights reserved.</span>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          {SOCIALS.map(s => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
              style={{ color: "#8A6520", textDecoration: "none", fontSize: "0.7rem", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#E8B84B")}
              onMouseLeave={e => (e.currentTarget.style.color = "#8A6520")}
            >{s.label}</a>
          ))}
          <span style={{ color: "rgba(201,150,26,0.2)" }}>|</span>
          <span style={{ color: "#6B4F20", fontSize: "0.68rem" }}>
            Website by{" "}
            <a
              href="https://materiaprimadesignsea.neocities.org/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#8A6520", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#E8B84B")}
              onMouseLeave={e => (e.currentTarget.style.color = "#8A6520")}
            >Materia Prima Designs</a>
          </span>
        </div>
      </div>
      <style>{`@media(max-width:768px){ .ah-footer-grid{ grid-template-columns:1fr 1fr !important; } }`}</style>
    </footer>
  );
}
