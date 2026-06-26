import { useState, useEffect } from "react";
import { c } from "../lib/defaults";

const S = {
  link: { color: "#F0E6CE", textDecoration: "none", fontSize: "0.82rem", fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase" } as React.CSSProperties,
};

// Map nav href → section IDs to watch
const SECTION_MAP: Record<string, string> = {
  "#properties": "properties",
  "#why": "why",
  "#process": "process",
  "#testimonials": "testimonials",
  "#reviews": "reviews",
  "#team": "team",
  "#contact": "contact",
};

function smoothScrollTo(href: string) {
  if (href.startsWith("#")) {
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
  }
  window.location.href = href;
}

export default function Nav({ content }: { content: Record<string, string> }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 40);
      setShowBackTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const sections = Object.values(SECTION_MAP);
    const els = sections.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const links = [1, 2, 3, 4, 5].map(i => ({
    label: c(content, `nav_link_${i}_label`),
    href: c(content, `nav_link_${i}_href`),
  })).filter(l => l.label);

  const isActive = (href: string) => {
    const sectionId = SECTION_MAP[href];
    return sectionId ? activeSection === sectionId : false;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      smoothScrollTo(href);
      setOpen(false);
    }
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 5%", height: 68,
        background: scrolled ? "rgba(14,1,1,0.98)" : "rgba(14,1,1,0.75)",
        borderBottom: scrolled ? "1px solid rgba(212,164,34,0.22)" : "1px solid rgba(212,164,34,0.08)",
        backdropFilter: "blur(14px)",
        transition: "all 0.4s",
      }}>
        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0, textDecoration: "none", zIndex: 2 }}>
          <img src="https://jewelbookstore.neocities.org/logo.jpeg" alt="Aeton Homes" className="ah-nav-logo"
            style={{ height: 42, width: "auto", objectFit: "contain", borderRadius: 3 }} />
        </a>

        {/* Desktop links */}
        <div className="ah-nav-desktop" style={{
          display: "flex", alignItems: "center", gap: 2, flex: 1,
          justifyContent: "flex-end", paddingLeft: 12,
        }}>
          {links.map((l, i) => {
            const active = isActive(l.href);
            const isCTA = i === links.length - 1;
            return isCTA ? (
              <a key={i} href={l.href}
                onClick={e => handleNavClick(e, l.href)}
                style={{
                  ...S.link, background: "linear-gradient(135deg, #D4A422, #F0C355)",
                  color: "#1A0101", padding: "9px 20px", borderRadius: 2,
                  fontWeight: 700, whiteSpace: "nowrap", marginLeft: 8,
                  boxShadow: "0 4px 16px rgba(212,164,34,0.25)",
                  transition: "opacity 0.2s, transform 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = ""; }}
              >{l.label}</a>
            ) : (
              <a key={i} href={l.href}
                onClick={e => handleNavClick(e, l.href)}
                style={{
                  ...S.link, padding: "8px 13px", borderRadius: 2, whiteSpace: "nowrap",
                  transition: "color 0.2s",
                  color: active ? "#F0C355" : "#F0E6CE",
                  borderBottom: active ? "1.5px solid #D4A422" : "1.5px solid transparent",
                  paddingBottom: "6px",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#F0C355")}
                onMouseLeave={e => (e.currentTarget.style.color = active ? "#F0C355" : "#F0E6CE")}
              >{l.label}</a>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="ah-nav-burger"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          style={{
            display: "none", flexDirection: "column", gap: 5, background: "none",
            border: "none", cursor: "pointer", padding: "8px", zIndex: 2,
          }}
        >
          <span style={{ display: "block", width: 22, height: 1.5, background: "#F0C355", borderRadius: 1, transition: "all 0.3s", transform: open ? "translateY(6.5px) rotate(45deg)" : "" }} />
          <span style={{ display: "block", width: 22, height: 1.5, background: "#F0C355", borderRadius: 1, transition: "all 0.3s", opacity: open ? 0 : 1 }} />
          <span style={{ display: "block", width: 22, height: 1.5, background: "#F0C355", borderRadius: 1, transition: "all 0.3s", transform: open ? "translateY(-6.5px) rotate(-45deg)" : "" }} />
        </button>
      </nav>

      {/* Mobile drawer overlay */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 998,
          backdropFilter: "blur(4px)", opacity: open ? 1 : 0,
          pointerEvents: open ? "all" : "none",
          transition: "opacity 0.28s",
        }}
      />

      {/* Mobile drawer */}
      <div style={{
        position: "fixed", top: 68, right: 0, zIndex: 999,
        width: "min(300px, 85vw)", height: "calc(100vh - 68px)",
        background: "rgba(12,1,1,0.99)", borderLeft: "1px solid rgba(212,164,34,0.18)",
        display: "flex", flexDirection: "column", padding: "28px 24px",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
        overflowY: "auto",
      }}>
        {links.map((l, i) => {
          const active = isActive(l.href);
          const isCTA = i === links.length - 1;
          return (
            <a key={i} href={l.href}
              onClick={e => handleNavClick(e, l.href)}
              style={{
                display: "block", padding: "16px 0",
                borderBottom: "1px solid rgba(212,164,34,0.07)",
                color: active || isCTA ? "#F0C355" : "#F0E6CE",
                textDecoration: "none", fontSize: "0.9rem", letterSpacing: "0.14em",
                textTransform: "uppercase", fontWeight: isCTA ? 600 : 300,
                transition: "color 0.2s, padding-left 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#F0C355"; e.currentTarget.style.paddingLeft = "8px"; }}
              onMouseLeave={e => { e.currentTarget.style.color = active || isCTA ? "#F0C355" : "#F0E6CE"; e.currentTarget.style.paddingLeft = "0"; }}
            >
              {active && <span style={{ display: "inline-block", width: 4, height: 4, background: "#D4A422", borderRadius: "50%", marginRight: 8, marginBottom: 2, verticalAlign: "middle" }} />}
              {l.label}
            </a>
          );
        })}

        {/* Contact quick links */}
        <div style={{ marginTop: 40 }}>
          <p style={{ fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#6B4F20", marginBottom: 16 }}>Contact Us</p>
          <a href="tel:+254728683027" style={{ display: "flex", alignItems: "center", gap: 10, color: "#E2C99A", textDecoration: "none", fontSize: "0.82rem", marginBottom: 12 }}>
            <span style={{ width: 32, height: 32, background: "rgba(212,164,34,0.08)", border: "1px solid rgba(212,164,34,0.2)", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style={{ color: "#D4A422" }}><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" /></svg>
            </span>
            +254 728 683 027
          </a>

        </div>

        {/* Bottom CTA in mobile drawer */}
        <a href="#contact"
          onClick={e => handleNavClick(e, "#contact")}
          style={{ marginTop: "auto", display: "block", textAlign: "center", padding: "13px 0", background: "linear-gradient(135deg,#D4A422,#F0C355)", color: "#0E0101", borderRadius: 2, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none" }}>
          Book a Viewing
        </a>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Back to top"
        style={{
          position: "fixed", bottom: 88, right: 20, zIndex: 800,
          width: 40, height: 40, borderRadius: "50%",
          background: "rgba(14,1,1,0.95)", border: "1px solid rgba(212,164,34,0.35)",
          color: "#F0C355", cursor: "pointer", fontSize: "1.1rem",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: showBackTop ? 1 : 0, pointerEvents: showBackTop ? "all" : "none",
          transition: "opacity 0.3s, transform 0.3s",
          transform: showBackTop ? "translateY(0)" : "translateY(10px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}>
        ↑
      </button>



      <style>{`
        @media (max-width: 768px) {
          .ah-nav-desktop { display: none !important; }
          .ah-nav-burger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
