import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const [showStart, setShowStart] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowStart((prev) => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // CSS pixel character (developer with laptop)
  const PixelCharacter = () => (
    <motion.div
      className="relative mx-auto"
      style={{ width: "96px", height: "120px", imageRendering: "pixelated" }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 24 30"
        width="96"
        height="120"
        style={{ imageRendering: "pixelated" }}
      >
        {/* Hair */}
        <rect x="8" y="0" width="8" height="2" fill="#333c57" />
        <rect x="6" y="2" width="12" height="2" fill="#333c57" />
        {/* Face */}
        <rect x="6" y="4" width="12" height="2" fill="#ef7d57" />
        <rect x="6" y="6" width="12" height="2" fill="#ef7d57" />
        {/* Eyes */}
        <rect x="8" y="4" width="2" height="2" fill="#1a1c2c" />
        <rect x="14" y="4" width="2" height="2" fill="#1a1c2c" />
        {/* Mouth */}
        <rect x="10" y="7" width="4" height="1" fill="#b13e53" />
        {/* Body (shirt) */}
        <rect x="6" y="8" width="12" height="2" fill="#3b5dc9" />
        <rect x="4" y="10" width="16" height="2" fill="#3b5dc9" />
        <rect x="4" y="12" width="16" height="2" fill="#3b5dc9" />
        <rect x="4" y="14" width="16" height="2" fill="#3b5dc9" />
        {/* Belt */}
        <rect x="6" y="16" width="12" height="2" fill="#ffcd75" />
        {/* Pants */}
        <rect x="6" y="18" width="5" height="4" fill="#29366f" />
        <rect x="13" y="18" width="5" height="4" fill="#29366f" />
        {/* Shoes */}
        <rect x="4" y="22" width="7" height="2" fill="#5d275d" />
        <rect x="13" y="22" width="7" height="2" fill="#5d275d" />
        {/* Arms */}
        <rect x="0" y="10" width="4" height="2" fill="#ef7d57" />
        <rect x="20" y="10" width="4" height="2" fill="#ef7d57" />
        {/* Laptop */}
        <rect x="0" y="12" width="8" height="2" fill="#566c86" />
        <rect x="0" y="14" width="8" height="4" fill="#94b0c2" />
        <rect x="2" y="14" width="4" height="2" fill="#73eff7" />
      </svg>
    </motion.div>
  );

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center px-4 relative"
      style={{ paddingTop: "60px", paddingBottom: "60px" }}
    >
      {/* Decorative pixel corners */}
      <div
        className="absolute top-8 left-8 w-8 h-8 border-t-4 border-l-4"
        style={{ borderColor: "#ffcd75" }}
      />
      <div
        className="absolute top-8 right-8 w-8 h-8 border-t-4 border-r-4"
        style={{ borderColor: "#ffcd75" }}
      />
      <div
        className="absolute bottom-8 left-8 w-8 h-8 border-b-4 border-l-4"
        style={{ borderColor: "#ffcd75" }}
      />
      <div
        className="absolute bottom-8 right-8 w-8 h-8 border-b-4 border-r-4"
        style={{ borderColor: "#ffcd75" }}
      />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center mb-8"
      >
        <h1
          className="leading-relaxed mb-4 px-4"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(12px, 3vw, 24px)",
            color: "#ffcd75",
            textShadow: "4px 4px 0 #ef7d57, 6px 6px 0 #1a1c2c",
            lineHeight: "2",
          }}
        >
          WELCOME TO
          <br />
          <span style={{ color: "#73eff7" }}>THANH TRONG'S</span>
          <br />
          QUEST!
        </h1>
      </motion.div>

      {/* Character */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-8"
      >
        <PixelCharacter />
      </motion.div>

      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center mb-10"
      >
        <p
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: "28px",
            color: "#94b0c2",
            letterSpacing: "2px",
          }}
        >
          Võ Thanh Trọng
        </p>
        <p
          className="mt-2"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "10px",
            color: "#a7f070",
            letterSpacing: "1px",
          }}
        >
          IT ENGINEER • FULL STACK DEV
        </p>
      </motion.div>

      {/* Start Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <button
          onClick={handleStart}
          className="pixel-btn pixel-border"
          style={{ opacity: showStart ? 1 : 0.3, margin: "8px" }}
          id="start-adventure-btn"
        >
          ▶ START ADVENTURE
        </button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-16"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "8px",
          color: "#566c86",
        }}
      >
        ▼ SCROLL ▼
      </motion.div>
    </section>
  );
}
