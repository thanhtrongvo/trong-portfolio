import ScrollReveal from '../motion/ScrollReveal';
import StatBar from '../pixel-art/StatBar';

const skills = [
  { label: 'React', value: 85, color: 'cyan' },
  { label: 'Node.js', value: 80, color: 'green' },
  { label: 'TypeScript', value: 78, color: 'blue' },
  { label: 'Astro', value: 75, color: 'orange' },
  { label: 'Database', value: 82, color: 'purple' },
  { label: 'Git', value: 88, color: 'lime' },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 md:px-8 max-w-4xl mx-auto">
      <ScrollReveal>
        <h2 className="section-title">⚔ CHARACTER STATS ⚔</h2>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Character Info Panel */}
        <ScrollReveal direction="left" delay={0.2}>
          <div
            className="pixel-border p-6"
            style={{
              backgroundColor: '#29366f',
              margin: '8px',
            }}
          >
            {/* Character header */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-16 h-16 flex items-center justify-center"
                style={{ backgroundColor: '#333c57' }}
              >
                {/* Mini character icon */}
                <svg viewBox="0 0 16 16" width="48" height="48" style={{ imageRendering: 'pixelated' }}>
                  <rect x="5" y="0" width="6" height="2" fill="#333c57" />
                  <rect x="4" y="2" width="8" height="3" fill="#ef7d57" />
                  <rect x="5" y="2" width="2" height="2" fill="#1a1c2c" />
                  <rect x="9" y="2" width="2" height="2" fill="#1a1c2c" />
                  <rect x="4" y="5" width="8" height="4" fill="#3b5dc9" />
                  <rect x="4" y="9" width="3" height="3" fill="#29366f" />
                  <rect x="9" y="9" width="3" height="3" fill="#29366f" />
                  <rect x="3" y="12" width="4" height="2" fill="#5d275d" />
                  <rect x="9" y="12" width="4" height="2" fill="#5d275d" />
                </svg>
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '12px',
                    color: '#ffcd75',
                    marginBottom: '8px',
                  }}
                >
                  VÕ THANH TRỌNG
                </h3>
                <p
                  style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: '20px',
                    color: '#a7f070',
                  }}
                >
                  LVL: GRADUATE ★
                </p>
              </div>
            </div>

            {/* Description */}
            <div
              className="dialog-box"
              style={{ padding: '20px', marginTop: '16px' }}
            >
              <p
                style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: '22px',
                  color: '#f4f4f4',
                  lineHeight: '1.6',
                }}
              >
                A recent IT Engineering graduate with a passion for building
                web applications. Currently seeking the next quest to level
                up my skills and join a legendary guild of developers.
              </p>
            </div>

            {/* Class info */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center p-3" style={{ backgroundColor: '#333c57' }}>
                <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', color: '#94b0c2', marginBottom: '4px' }}>
                  CLASS
                </p>
                <p style={{ fontFamily: "'VT323', monospace", fontSize: '20px', color: '#ffcd75' }}>
                  Full Stack Dev
                </p>
              </div>
              <div className="text-center p-3" style={{ backgroundColor: '#333c57' }}>
                <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', color: '#94b0c2', marginBottom: '4px' }}>
                  STATUS
                </p>
                <p style={{ fontFamily: "'VT323', monospace", fontSize: '20px', color: '#a7f070' }}>
                  Ready!
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Skills Panel */}
        <ScrollReveal direction="right" delay={0.4}>
          <div
            className="pixel-border p-6"
            style={{
              backgroundColor: '#29366f',
              margin: '8px',
            }}
          >
            <h3
              className="mb-6 text-center"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '11px',
                color: '#73eff7',
                letterSpacing: '1px',
              }}
            >
              ♦ SKILL POINTS ♦
            </h3>

            {skills.map((skill, index) => (
              <StatBar
                key={skill.label}
                label={skill.label}
                value={skill.value}
                color={skill.color}
                delay={0.3 + index * 0.15}
              />
            ))}

            {/* Total XP */}
            <div
              className="mt-6 text-center p-3"
              style={{ backgroundColor: '#333c57' }}
            >
              <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', color: '#94b0c2', marginBottom: '4px' }}>
                TOTAL XP
              </p>
              <p style={{ fontFamily: "'VT323', monospace", fontSize: '28px', color: '#ffcd75' }}>
                488 / 600
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
