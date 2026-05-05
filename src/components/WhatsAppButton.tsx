export default function WhatsAppButton() {
  const phone = "254728683027"; // 0728683027 → international format
  const message = encodeURIComponent("Hello Aeton Homes, I'm interested in your properties.");
  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 9999,
          width: 58,
          height: 58,
          borderRadius: "50%",
          background: "#25D366",
          boxShadow: "0 4px 20px rgba(37,211,102,0.45), 0 2px 8px rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
          transition: "transform 0.2s, box-shadow 0.2s",
          animation: "waPulse 2.5s ease-in-out infinite",
        }}
        onMouseEnter={e => { const el = e.currentTarget; el.style.transform = "scale(1.12)"; el.style.boxShadow = "0 6px 28px rgba(37,211,102,0.6), 0 2px 10px rgba(0,0,0,0.4)"; }}
        onMouseLeave={e => { const el = e.currentTarget; el.style.transform = ""; el.style.boxShadow = "0 4px 20px rgba(37,211,102,0.45), 0 2px 8px rgba(0,0,0,0.35)"; }}
      >
        {/* WhatsApp SVG icon */}
        <svg viewBox="0 0 32 32" width="30" height="30" fill="white">
          <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.347.64 4.64 1.854 6.654L2.667 29.333l6.88-1.8A13.267 13.267 0 0016.004 29.333c7.36 0 13.33-5.973 13.33-13.333 0-7.36-5.97-13.333-13.33-13.333zm0 24c-2.16 0-4.267-.587-6.107-1.693l-.44-.267-4.08 1.067 1.094-3.947-.294-.454A10.613 10.613 0 015.334 16c0-5.867 4.8-10.667 10.667-10.667S26.667 10.133 26.667 16 21.867 26.667 16.004 26.667zm5.84-7.974c-.32-.16-1.893-.933-2.187-1.04-.293-.106-.506-.16-.72.16-.213.32-.826 1.04-1.013 1.254-.187.213-.374.24-.693.08-.32-.16-1.347-.494-2.56-1.574-.947-.84-1.587-1.88-1.774-2.2-.186-.32-.02-.493.14-.653.144-.144.32-.373.48-.56.16-.187.213-.32.32-.534.107-.213.054-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.26-.627-.52-.533-.72-.547l-.614-.013a1.174 1.174 0 00-.853.4c-.293.32-1.12 1.093-1.12 2.667s1.147 3.093 1.307 3.307c.16.213 2.253 3.44 5.46 4.826.76.333 1.36.533 1.826.68.768.24 1.467.208 2.02.128.614-.094 1.893-.774 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.134-.294-.214-.614-.374z"/>
        </svg>
      </a>

      <style>{`
        @keyframes waPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(37,211,102,0.45), 0 2px 8px rgba(0,0,0,0.35); }
          50% { box-shadow: 0 4px 28px rgba(37,211,102,0.75), 0 0 0 8px rgba(37,211,102,0.12); }
        }
      `}</style>
    </>
  );
}
