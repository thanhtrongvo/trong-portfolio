import { motion } from 'framer-motion';
import ScrollReveal from '../motion/ScrollReveal';

// Pixel art icons
const EmailIcon = () => (
  <svg viewBox="0 0 16 12" width="32" height="24" style={{ imageRendering: 'pixelated' as const }}>
    <rect x="0" y="0" width="16" height="12" fill="#333c57" />
    <rect x="1" y="1" width="14" height="10" fill="#29366f" />
    <rect x="0" y="0" width="2" height="2" fill="#ffcd75" />
    <rect x="14" y="0" width="2" height="2" fill="#ffcd75" />
    <rect x="2" y="2" width="2" height="2" fill="#ffcd75" />
    <rect x="12" y="2" width="2" height="2" fill="#ffcd75" />
    <rect x="4" y="4" width="2" height="2" fill="#ffcd75" />
    <rect x="10" y="4" width="2" height="2" fill="#ffcd75" />
    <rect x="6" y="6" width="4" height="2" fill="#ffcd75" />
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 16 16" width="32" height="32" style={{ imageRendering: 'pixelated' as const }}>
    <rect x="4" y="0" width="8" height="2" fill="#f4f4f4" />
    <rect x="2" y="2" width="12" height="2" fill="#f4f4f4" />
    <rect x="2" y="4" width="12" height="2" fill="#f4f4f4" />
    <rect x="4" y="4" width="2" height="2" fill="#1a1c2c" />
    <rect x="10" y="4" width="2" height="2" fill="#1a1c2c" />
    <rect x="2" y="6" width="12" height="2" fill="#f4f4f4" />
    <rect x="4" y="8" width="8" height="2" fill="#f4f4f4" />
    <rect x="2" y="10" width="4" height="2" fill="#f4f4f4" />
    <rect x="10" y="10" width="4" height="2" fill="#f4f4f4" />
    <rect x="2" y="12" width="2" height="2" fill="#f4f4f4" />
    <rect x="12" y="12" width="2" height="2" fill="#f4f4f4" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 16 16" width="32" height="32" style={{ imageRendering: 'pixelated' as const }}>
    <rect x="0" y="0" width="16" height="16" fill="#3b5dc9" />
    <rect x="2" y="2" width="3" height="3" fill="#f4f4f4" />
    <rect x="2" y="6" width="3" height="8" fill="#f4f4f4" />
    <rect x="7" y="6" width="3" height="8" fill="#f4f4f4" />
    <rect x="10" y="8" width="3" height="6" fill="#f4f4f4" />
    <rect x="10" y="6" width="3" height="2" fill="#f4f4f4" />
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
    value: 'Võ Thanh Trọng',
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
                color: '#a7f070',
                marginBottom: '8px',
              }}
            >
              ► QUEST GIVER:
            </p>
            <p
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: '24px',
                color: '#f4f4f4',
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
                className="flex items-center gap-4 p-4 no-underline"
                style={{
                  backgroundColor: '#333c57',
                  cursor: "url('/cursors/pixel-hand.svg') 8 0, pointer",
                }}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.15 }}
                whileHover={{
                  backgroundColor: '#3a4466',
                  x: 8,
                  transition: { duration: 0.1 },
                }}
              >
                <div className="shrink-0">{contact.icon}</div>
                <div>
                  <p
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '9px',
                      color: '#ffcd75',
                      marginBottom: '4px',
                    }}
                  >
                    {contact.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "'VT323', monospace",
                      fontSize: '22px',
                      color: '#94b0c2',
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
                    color: '#566c86',
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
            color: '#566c86',
            lineHeight: '2.5',
          }}
        >
          <p>CRAFTED WITH ♥ BY VÕ THANH TRỌNG</p>
          <p style={{ marginTop: '8px' }}>© 2026 • ALL RIGHTS RESERVED</p>
          <div
            className="mt-4 mx-auto"
            style={{
              width: '64px',
              height: '4px',
              background: 'linear-gradient(90deg, #b13e53, #ef7d57, #ffcd75, #a7f070, #3b5dc9, #5d275d)',
              imageRendering: 'auto',
            }}
          />
        </div>
      </ScrollReveal>
    </section>
  );
}
