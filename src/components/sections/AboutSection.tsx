import { motion } from 'framer-motion';
import ScrollReveal from '../motion/ScrollReveal';
import SkillTree from '../pixel-art/SkillTree';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 md:px-8 max-w-5xl mx-auto">
      <ScrollReveal>
        <h2 className="section-title">⚔ CHARACTER STATS ⚔</h2>
      </ScrollReveal>

      {/* Character Info Panel — full width */}
      <ScrollReveal direction="up" delay={0.2}>
        <div
          className="pixel-border p-6 mb-8"
          style={{
            backgroundColor: 'var(--color-pixel-blue)',
            margin: '8px',
          }}
        >
          {/* Character header */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-16 h-16 flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: 'var(--color-pixel-dark)' }}
            >
              {/* Mini character icon with idle bounce animation */}
              <motion.div
                animate={{
                  y: [0, -2, 0],
                  scaleY: [1, 0.95, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg viewBox="0 0 16 16" width="48" height="48" style={{ imageRendering: 'pixelated' }}>
                  <rect x="5" y="0" width="6" height="2" fill="var(--color-pixel-dark)" />
                  <rect x="4" y="2" width="8" height="3" fill="var(--color-pixel-orange)" />
                  <rect x="5" y="2" width="2" height="2" fill="var(--color-pixel-black)" />
                  <rect x="9" y="2" width="2" height="2" fill="var(--color-pixel-black)" />
                  <rect x="4" y="5" width="8" height="4" fill="var(--color-pixel-indigo)" />
                  <rect x="4" y="9" width="3" height="3" fill="var(--color-pixel-blue)" />
                  <rect x="9" y="9" width="3" height="3" fill="var(--color-pixel-blue)" />
                  <rect x="3" y="12" width="4" height="2" fill="var(--color-pixel-purple)" />
                  <rect x="9" y="12" width="4" height="2" fill="var(--color-pixel-purple)" />
                </svg>
              </motion.div>
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '12px',
                  color: 'var(--color-pixel-yellow)',
                  marginBottom: '8px',
                }}
              >
                VO THANH TRONG
              </h3>
              <p
                style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: '20px',
                  color: 'var(--color-pixel-lime)',
                }}
              >
                LVL: GRADUATE ★
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Description */}
            <div
              className="dialog-box"
              style={{ padding: '20px' }}
            >
              <p
                style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: '22px',
                  color: 'var(--color-pixel-white)',
                  lineHeight: '1.6',
                }}
              >
                A recent IT Engineering graduate with a passion for building
                web applications. Currently seeking the next quest to level
                up my skills and join a legendary guild of developers.
              </p>
            </div>

            {/* Class info */}
            <div className="grid grid-cols-2 gap-4 content-start">
              <div className="text-center p-3" style={{ backgroundColor: 'var(--color-pixel-dark)' }}>
                <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', color: 'var(--color-pixel-light)', marginBottom: '4px' }}>
                  CLASS
                </p>
                <p style={{ fontFamily: "'VT323', monospace", fontSize: '20px', color: 'var(--color-pixel-yellow)' }}>
                  Full Stack Dev
                </p>
              </div>
              <div className="text-center p-3" style={{ backgroundColor: 'var(--color-pixel-dark)' }}>
                <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', color: 'var(--color-pixel-light)', marginBottom: '4px' }}>
                  STATUS
                </p>
                <p style={{ fontFamily: "'VT323', monospace", fontSize: '20px', color: 'var(--color-pixel-lime)' }}>
                  Ready!
                </p>
              </div>
              <div className="text-center p-3" style={{ backgroundColor: 'var(--color-pixel-dark)' }}>
                <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', color: 'var(--color-pixel-light)', marginBottom: '4px' }}>
                  GUILD
                </p>
                <p style={{ fontFamily: "'VT323', monospace", fontSize: '20px', color: 'var(--color-pixel-sky)' }}>
                  Seeking...
                </p>
              </div>
              <div className="text-center p-3" style={{ backgroundColor: 'var(--color-pixel-dark)' }}>
                <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', color: 'var(--color-pixel-light)', marginBottom: '4px' }}>
                  REGION
                </p>
                <p style={{ fontFamily: "'VT323', monospace", fontSize: '20px', color: 'var(--color-pixel-orange)' }}>
                  Viet Nam
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Skill Tree — full width */}
      <ScrollReveal direction="up" delay={0.4}>
        <div
          className="pixel-border p-6"
          style={{
            backgroundColor: 'var(--color-pixel-blue)',
            margin: '8px',
          }}
        >
          <SkillTree />
        </div>
      </ScrollReveal>
    </section>
  );
}
