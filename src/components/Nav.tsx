import { useState, useEffect } from "react";
import { c } from "../lib/defaults";

const S = {
  link: { color: "#F0E6CE", textDecoration: "none", fontSize: "0.82rem", fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase" } as React.CSSProperties,
};

export default function Nav({ content }: { content: Record<string, string> }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close menu on scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const links = [1,2,3,4,5].map(i => ({
    label: c(content, `nav_link_${i}_label`),
    href: c(content, `nav_link_${i}_href`),
  })).filter(l => l.label);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 5%", height: 68,
        background: scrolled ? "rgba(14,1,1,0.98)" : "rgba(14,1,1,0.75)",
        borderBottom: scrolled ? "1px solid rgba(201,150,26,0.22)" : "1px solid rgba(201,150,26,0.08)",
        backdropFilter: "blur(14px)",
        transition: "all 0.4s",
      }}>
        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0, textDecoration: "none", zIndex: 2 }}>
          <img src="https://jewelbookstore.neocities.org/logo.jpeg" alt="Aeton Homes"
            style={{ height: 42, width: "auto", objectFit: "contain", borderRadius: 3 }} />
        </a>

        {/* Desktop links */}
        <div className="ah-nav-desktop" style={{
          display: "flex", alignItems: "center", gap: 4, flex: 1,
          justifyContent: "flex-end", paddingLeft: 12,
        }}>
          {links.map((l, i) => i < links.length - 1 ? (
            <a key={i} href={l.href} style={{
              ...S.link, padding: "8px 14px", borderRadius: 2, whiteSpace: "nowrap",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "#E8B84B")}
              onMouseLeave={e => (e.currentTarget.style.color = "#F0E6CE")}
            >{l.label}</a>
          ) : (
            <a key={i} href={l.href} style={{
              ...S.link, background: "linear-gradient(135deg, #C9961A, #E8B84B)",
              color: "#1A0101", padding: "9px 20px", borderRadius: 2,
              fontWeight: 700, whiteSpace: "nowrap", marginLeft: 8,
              boxShadow: "0 4px 16px rgba(201,150,26,0.25)",
              transition: "opacity 0.2s, transform 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = ""; }}
            >{l.label}</a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="ah-nav-burger"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          style={{
            display: "none", flexDirection: "column", gap: 5, background: "none",
            border: "none", cursor: "pointer", padding: "8px", zIndex: 2,
          }}
        >
          <span style={{ display: "block", width: 22, height: 1.5, background: "#E8B84B", borderRadius: 1, transition: "all 0.3s", transform: open ? "translateY(6.5px) rotate(45deg)" : "" }} />
          <span style={{ display: "block", width: 22, height: 1.5, background: "#E8B84B", borderRadius: 1, transition: "all 0.3s", opacity: open ? 0 : 1 }} />
          <span style={{ display: "block", width: 22, height: 1.5, background: "#E8B84B", borderRadius: 1, transition: "all 0.3s", transform: open ? "translateY(-6.5px) rotate(-45deg)" : "" }} />
        </button>
      </nav>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 998, backdropFilter: "blur(4px)" }}
        />
      )}

      {/* Mobile drawer */}
      <div style={{
        position: "fixed", top: 68, right: 0, zIndex: 999,
        width: "min(300px, 85vw)", height: "calc(100vh - 68px)",
        background: "rgba(12,1,1,0.99)", borderLeft: "1px solid rgba(201,150,26,0.18)",
        display: "flex", flexDirection: "column", padding: "28px 24px",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
        overflowY: "auto",
      }}>
        {links.map((l, i) => (
          <a key={i} href={l.href} onClick={() => setOpen(false)}
            style={{
              display: "block", padding: "16px 0",
              borderBottom: "1px solid rgba(201,150,26,0.07)",
              color: i === links.length - 1 ? "#E8B84B" : "#F0E6CE",
              textDecoration: "none", fontSize: "0.9rem", letterSpacing: "0.14em",
              textTransform: "uppercase", fontWeight: i === links.length - 1 ? 600 : 300,
              transition: "color 0.2s, padding-left 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "#E8B84B"; e.currentTarget.style.paddingLeft = "8px"; }}
            onMouseLeave={e => { e.currentTarget.style.color = i === links.length - 1 ? "#E8B84B" : "#F0E6CE"; e.currentTarget.style.paddingLeft = "0"; }}
          >{l.label}</a>
        ))}

        {/* Contact quick links */}
        <div style={{ marginTop: 40 }}>
          <p style={{ fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#6B4F20", marginBottom: 16 }}>Contact Us</p>
          <a href="tel:+254728683027" style={{ display: "flex", alignItems: "center", gap: 10, color: "#C4A97A", textDecoration: "none", fontSize: "0.82rem", marginBottom: 12 }}>
            <span style={{ fontSize: "1rem" }}>📞</span> +254 728 683 027
          </a>
          <a href="https://wa.me/254728683027" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, color: "#C4A97A", textDecoration: "none", fontSize: "0.82rem" }}>
            <span style={{ fontSize: "1rem" }}>💬</span> WhatsApp Us
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ah-nav-desktop { display: none !important; }
          .ah-nav-burger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
