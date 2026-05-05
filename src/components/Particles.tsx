import { useEffect } from "react";
export default function Particles() {
  useEffect(() => {
    const el = document.getElementById("particles");
    if (!el) return;
    el.innerHTML = "";
    for (let i = 0; i < 40; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = (8 + Math.random() * 12) + "s";
      p.style.animationDelay = (Math.random() * 10) + "s";
      el.appendChild(p);
    }
  }, []);
  return <div id="particles" />;
}
