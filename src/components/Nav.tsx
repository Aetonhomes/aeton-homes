import { useState, useEffect } from "react";
import { Link } from "wouter";
import { c } from "../lib/defaults";

const S = {
  link: { color: "#F0E6CE", textDecoration: "none", fontSize: "0.82rem", fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase" } as React.CSSProperties,
};

export default function Nav({ content }: { content: Record<string, string> }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [1,2,3,4,5].map(i => ({
    label: c(content, `nav_link_${i}_label`),
    href: c(content, `nav_link_${i}_href`),
  })).filter(l => l.label);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 5%",
        background: scrolled ? "rgba(20,3,3,0.97)" : "rgba(20,3,3,0.82)",
        borderBottom: scrolled ? "1px solid rgba(201,150,26,0.18)" : "1px solid rgba(201,150,26,0.08)",
        backdropFilter: "blur(8px)",
        transition: "all 0.4s",
      }}>
        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0, textDecoration: "none" }}>
          <img src="https://jewelbookstore.neocities.org/logo.jpeg" alt="Aeton Homes"
            style={{ height: 44, width: "auto", objectFit: "contain", borderRadius: 3 }} />
        </a>

        {/* Links — always visible, scroll on mobile */}
        <div className="ah-nav-links" style={{
          display: "flex", alignItems: "center", gap: 4,
          overflowX: "auto", flex: 1, justifyContent: "flex-end",
          scrollbarWidth: "none", msOverflowStyle: "none",
          paddingLeft: 12,
        }}>
          {links.map((l, i) => i < links.length - 1 ? (
            <a key={i} href={l.href} className="ah-nav-link" style={{
              ...S.link,
              padding: "8px 12px",
              borderRadius: 2,
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "color 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "#E8B84B")}
              onMouseLeave={e => (e.currentTarget.style.color = "#F0E6CE")}
            >{l.label}</a>
          ) : (
            <a key={i} href={l.href} style={{
              ...S.link,
              background: "linear-gradient(135deg, #C9961A, #E8B84B)",
              color: "#3D0A0A", padding: "9px 18px", borderRadius: 2,
              fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0,
              marginLeft: 6,
            }}>{l.label}</a>
          ))}

        </div>
      </nav>

      <style>{`
        /* Hide scrollbar on nav link row */
        .ah-nav-links::-webkit-scrollbar { display: none; }

        @media (max-width: 700px) {
          /* Smaller font + tighter padding on mobile */
          .ah-nav-link {
            font-size: 0.7rem !important;
            padding: 7px 8px !important;
            letter-spacing: 0.08em !important;
          }
        }
        @media (max-width: 480px) {
          .ah-nav-link {
            font-size: 0.65rem !important;
            padding: 6px 7px !important;
          }
        }
      `}</style>
    </>
  );
}
