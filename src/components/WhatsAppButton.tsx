export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/254728683027?text=Hi%2C%20I%27m%20interested%20in%20a%20property%20from%20Aeton%20Homes."
      target="_blank"
      rel="noopener noreferrer"
      className="ah-wa-btn"
      title="Chat on WhatsApp"
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 8999,
        width: 58,
        height: 58,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #25D366, #128C7E)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        boxShadow: "0 8px 28px rgba(0,0,0,0.45)",
        transition: "transform 0.2s",
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.12)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "")}
    >
      {/* WhatsApp SVG icon */}
      <svg viewBox="0 0 32 32" width="30" height="30" fill="white">
        <path d="M16 2C8.27 2 2 8.27 2 16c0 2.44.64 4.73 1.76 6.72L2 30l7.44-1.74A13.9 13.9 0 0 0 16 30c7.73 0 14-6.27 14-14S23.73 2 16 2zm0 25.5a11.47 11.47 0 0 1-5.82-1.58l-.42-.25-4.41 1.03 1.06-4.3-.27-.44A11.48 11.48 0 0 1 4.5 16C4.5 9.6 9.6 4.5 16 4.5S27.5 9.6 27.5 16 22.4 27.5 16 27.5zm6.29-8.53c-.34-.17-2.02-.99-2.33-1.1-.31-.12-.54-.17-.77.17-.23.34-.88 1.1-1.08 1.33-.2.23-.4.25-.74.08-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.7-2.01-1.9-2.35-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.08-.17-.77-1.85-1.05-2.54-.28-.67-.56-.58-.77-.59l-.66-.01c-.23 0-.6.08-.91.4s-1.2 1.17-1.2 2.85c0 1.68 1.23 3.31 1.4 3.54.17.23 2.41 3.68 5.84 5.16.82.35 1.45.56 1.95.72.82.26 1.57.22 2.16.13.66-.1 2.02-.82 2.3-1.62.29-.8.29-1.48.2-1.62-.08-.14-.31-.22-.65-.39z"/>
      </svg>
    </a>
  );
}
