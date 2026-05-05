import { c } from "../lib/defaults";

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
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            {["in","tw","fb","ig"].map((s, i) => (
              <a key={i} href="#" style={{
                width: 34, height: 34, borderRadius: 2,
                background: "rgba(201,150,26,0.08)", border: "1px solid rgba(201,150,26,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#E8B84B", fontSize: "0.68rem", fontWeight: 600, textDecoration: "none", textTransform: "uppercase",
              }}>{s}</a>
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
        <span>Luxury Real Estate · Nairobi, Kenya</span>
      </div>
      <style>{`@media(max-width:768px){ .ah-footer-grid{ grid-template-columns:1fr 1fr !important; } }`}</style>
    </footer>
  );
}
