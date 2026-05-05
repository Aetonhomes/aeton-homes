import { useState, useEffect } from "react";
import { Link } from "wouter";
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

  const links = [1,2,3,4,5].map(i => ({
    label: c(content, `nav_link_${i}_label`),
    href: c(content, `nav_link_${i}_href`),
  })).filter(l => l.label);

  return (
    <>
      {/* Mobile overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 999,
        background: "rgba(10,1,1,0.98)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.4s",
      }}>
        {links.map((l, i) => (
          <a key={i} href={l.href} onClick={() => setOpen(false)} style={{
            fontSize: "1.6rem", fontFamily: "'Cormorant Garamond', serif",
            color: "#FDF8EF", textDecoration: "none", fontStyle: "italic",
          }}>{l.label}</a>
        ))}
        <Link href="/admin" onClick={() => setOpen(false)} style={{ fontSize: "0.85rem", color: "#E8B84B", textDecoration: "none", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          Admin ↗
        </Link>
      </div>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 5%",
        background: scrolled ? "rgba(20,3,3,0.97)" : "linear-gradient(to bottom, rgba(20,3,3,0.9), transparent)",
        borderBottom: scrolled ? "1px solid rgba(201,150,26,0.18)" : "none",
        backdropFilter: "blur(4px)",
        transition: "all 0.4s",
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="https://jewelbookstore.neocities.org/logo.jpeg" alt="Aeton Homes"
            style={{ height: 52, width: "auto", objectFit: "contain", borderRadius: 3 }} />
        </a>

        <ul className="ah-desktop-nav" style={{ display: "flex", gap: 28, listStyle: "none", alignItems: "center" }}>
          {links.map((l, i) => i < links.length - 1 ? (
            <li key={i}><a href={l.href} style={S.link}>{l.label}</a></li>
          ) : (
            <li key={i}><a href={l.href} style={{
              ...S.link,
              background: "linear-gradient(135deg, #C9961A, #E8B84B)", color: "#3D0A0A",
              padding: "10px 22px", borderRadius: 2, fontWeight: 500,
            }}>{l.label}</a></li>
          ))}
        </ul>

        <button onClick={() => setOpen(!open)} className="ah-hamburger" style={{
          display: "none", background: "none", border: "none",
          flexDirection: "column", gap: 5, cursor: "pointer", padding: 4,
        }}>
          {[0,1,2].map(i => <span key={i} style={{ display: "block", width: 24, height: 2, background: "#E8B84B" }} />)}
        </button>
      </nav>

      <style>{`
        @media (max-width: 900px) {
          .ah-desktop-nav { display: none !important; }
          .ah-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
