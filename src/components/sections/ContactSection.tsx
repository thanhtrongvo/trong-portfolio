import { motion } from 'framer-motion';
import ScrollReveal from '../motion/ScrollReveal';
import { audioSystem } from '../../utils/audio';

// Pixel art icons using theme variables
const EmailIcon = () => (
  <svg viewBox="0 0 16 12" width="32" height="24" style={{ imageRendering: 'pixelated' as const }}>
    <rect x="0" y="0" width="16" height="12" fill="var(--color-pixel-dark)" />
    <rect x="1" y="1" width="14" height="10" fill="var(--color-pixel-blue)" />
    <rect x="0" y="0" width="2" height="2" fill="var(--color-pixel-yellow)" />
    <rect x="14" y="0" width="2" height="2" fill="var(--color-pixel-yellow)" />
    <rect x="2" y="2" width="2" height="2" fill="var(--color-pixel-yellow)" />
    <rect x="12" y="2" width="2" height="2" fill="var(--color-pixel-yellow)" />
    <rect x="4" y="4" width="2" height="2" fill="var(--color-pixel-yellow)" />
    <rect x="10" y="4" width="2" height="2" fill="var(--color-pixel-yellow)" />
    <rect x="6" y="6" width="4" height="2" fill="var(--color-pixel-yellow)" />
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 16 16" width="32" height="32" style={{ imageRendering: 'pixelated' as const }}>
    <rect x="4" y="0" width="8" height="2" fill="var(--color-pixel-white)" />
    <rect x="2" y="2" width="12" height="2" fill="var(--color-pixel-white)" />
    <rect x="2" y="4" width="12" height="2" fill="var(--color-pixel-white)" />
    <rect x="4" y="4" width="2" height="2" fill="var(--color-pixel-black)" />
    <rect x="10" y="4" width="2" height="2" fill="var(--color-pixel-black)" />
    <rect x="2" y="6" width="12" height="2" fill="var(--color-pixel-white)" />
    <rect x="4" y="8" width="8" height="2" fill="var(--color-pixel-white)" />
    <rect x="2" y="10" width="4" height="2" fill="var(--color-pixel-white)" />
    <rect x="10" y="10" width="4" height="2" fill="var(--color-pixel-white)" />
    <rect x="2" y="12" width="2" height="2" fill="var(--color-pixel-white)" />
    <rect x="12" y="12" width="2" height="2" fill="var(--color-pixel-white)" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 16 16" width="32" height="32" style={{ imageRendering: 'pixelated' as const }}>
    <rect x="0" y="0" width="16" height="16" fill="var(--color-pixel-indigo)" />
    <rect x="2" y="2" width="3" height="3" fill="var(--color-pixel-white)" />
    <rect x="2" y="6" width="3" height="8" fill="var(--color-pixel-white)" />
    <rect x="7" y="6" width="3" height="8" fill="var(--color-pixel-white)" />
    <rect x="10" y="8" width="3" height="6" fill="var(--color-pixel-white)" />
    <rect x="10" y="6" width="3" height="2" fill="var(--color-pixel-white)" />
  </svg>
);

const contactLinks = [
  {
    icon: <EmailIcon />,
    label: 'EMAIL',
    value: 'votrong1471@gmail.com',
    href: 'mailto:votrong1471@gmail.com',
  },
  {
    icon: <GithubIcon />,
    label: 'GITHUB',
    value: 'thanhtrongvo',
    href: 'https://github.com/thanhtrongvo',
  },
  {
    icon: <LinkedInIcon />,
    label: 'LINKEDIN',
    value: 'Vo Thanh Trong',
    href: 'https://www.linkedin.com/in/thanhtrongvo/',
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 px-4 md:px-8 max-w-3xl mx-auto">
      <ScrollReveal>
        <h2 className="section-title">💾 SAVE GAME 💾</h2>
      </ScrollReveal>

      <ScrollReveal direction="left" delay={0.2}>
        <div
          className="dialog-box pixel-border"
          style={{ margin: '8px', padding: '32px' }}
        >
          {/* NPC dialog style header */}
          <div className="mb-6">
            <p
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '10px',
                color: 'var(--color-pixel-lime)',
                marginBottom: '8px',
              }}
            >
              ► QUEST GIVER:
            </p>
            <p
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: '24px',
                color: 'var(--color-pixel-white)',
                lineHeight: '1.5',
              }}
            >
              "Greetings, adventurer! If you seek to form a party
              or embark on a new quest together, send me a message
              using one of these magic scrolls..."
            </p>
          </div>

          {/* Contact links grid */}
          <div className="grid gap-4 mt-8">
            {contactLinks.map((contact, index) => (
              <motion.a
                key={contact.label}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => audioSystem?.playHoverSound()}
                onClick={() => audioSystem?.playClickSound()}
                className="flex items-center gap-4 p-4 no-underline border-2 border-transparent hover:border-[var(--color-pixel-yellow)] transition-all duration-100"
                style={{
                  backgroundColor: 'var(--color-pixel-dark)',
                  cursor: "url('/cursors/pixel-hand.svg') 8 0, pointer",
                }}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.15 }}
                whileHover={{
                  backgroundColor: 'var(--color-pixel-blue)',
                  x: 8,
                  boxShadow: '0 0 10px var(--color-pixel-yellow)',
                }}
              >
                <div className="shrink-0">{contact.icon}</div>
                <div>
                  <p
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '9px',
                      color: 'var(--color-pixel-yellow)',
                      marginBottom: '4px',
                    }}
                  >
                    {contact.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "'VT323', monospace",
                      fontSize: '22px',
                      color: 'var(--color-pixel-light)',
                    }}
                  >
                    {contact.value}
                  </p>
                </div>
                <motion.span
                  className="ml-auto"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '12px',
                    color: 'var(--color-pixel-gray)',
                  }}
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.a>
            ))}
          </div>

          {/* Guild invitation button */}
          <div className="text-center mt-8">
            <motion.a
              href="mailto:votrong1471@gmail.com?subject=Guild%20Invitation"
              onMouseEnter={() => audioSystem?.playHoverSound()}
              onClick={() => audioSystem?.playClickSound()}
              className="pixel-btn pixel-border inline-block no-underline"
              style={{ margin: '8px' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✉ GUILD INVITATION
            </motion.a>
          </div>
        </div>
      </ScrollReveal>

      {/* Footer */}
      <ScrollReveal delay={0.6}>
        <div
          className="text-center mt-16 pb-8"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '8px',
            color: 'var(--color-pixel-gray)',
            lineHeight: '2.5',
          }}
        >
          <p>CRAFTED WITH ♥ BY VO THANH TRONG</p>
          <p style={{ marginTop: '8px' }}>© 2026 • ALL RIGHTS RESERVED</p>
          <div
            className="mt-4 mx-auto"
            style={{
              width: '64px',
              height: '4px',
              background: 'linear-gradient(90deg, var(--color-pixel-red), var(--color-pixel-orange), var(--color-pixel-yellow), var(--color-pixel-lime), var(--color-pixel-indigo), var(--color-pixel-purple))',
              imageRendering: 'auto',
            }}
          />
        </div>
      </ScrollReveal>
    </section>
  );
}
