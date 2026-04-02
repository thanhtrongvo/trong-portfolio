import ScrollReveal from '../motion/ScrollReveal';
import PixelCard from '../pixel-art/PixelCard';

// Pixel art icons as inline SVGs
const ShoppingCartIcon = () => (
  <svg viewBox="0 0 16 16" width="40" height="40" style={{ imageRendering: 'pixelated' as const }}>
    <rect x="2" y="2" width="2" height="2" fill="#ffcd75" />
    <rect x="4" y="2" width="10" height="2" fill="#ffcd75" />
    <rect x="4" y="4" width="10" height="2" fill="#ef7d57" />
    <rect x="4" y="6" width="8" height="2" fill="#ef7d57" />
    <rect x="5" y="8" width="6" height="2" fill="#ffcd75" />
    <rect x="6" y="10" width="2" height="2" fill="#f4f4f4" />
    <rect x="10" y="10" width="2" height="2" fill="#f4f4f4" />
    <rect x="0" y="2" width="2" height="2" fill="#94b0c2" />
    <rect x="0" y="4" width="2" height="2" fill="#94b0c2" />
  </svg>
);

const BookIcon = () => (
  <svg viewBox="0 0 16 16" width="40" height="40" style={{ imageRendering: 'pixelated' as const }}>
    <rect x="2" y="1" width="12" height="2" fill="#5d275d" />
    <rect x="2" y="3" width="12" height="2" fill="#b13e53" />
    <rect x="2" y="5" width="12" height="2" fill="#b13e53" />
    <rect x="2" y="7" width="12" height="2" fill="#b13e53" />
    <rect x="2" y="9" width="12" height="2" fill="#b13e53" />
    <rect x="2" y="11" width="12" height="2" fill="#5d275d" />
    {/* Book pages */}
    <rect x="4" y="4" width="8" height="1" fill="#f4f4f4" />
    <rect x="4" y="6" width="6" height="1" fill="#f4f4f4" />
    <rect x="4" y="8" width="7" height="1" fill="#f4f4f4" />
    {/* Book spine */}
    <rect x="2" y="1" width="1" height="12" fill="#5d275d" />
    {/* Star on cover */}
    <rect x="7" y="3" width="2" height="2" fill="#ffcd75" />
  </svg>
);

const projects = [
  {
    title: 'E-Commerce Platform',
    description:
      'Full Stack e-commerce platform showcasing skills in React, Node.js, Express, and MongoDB. Features product listings, cart system, user authentication, and payment integration.',
    link: 'https://github.com/thanhtrongvo/e-commerce',
    icon: <ShoppingCartIcon />,
  },
  {
    title: 'Blog MERN Stack',
    description:
      'Complete blog management system built with the MERN stack (MongoDB, Express, React, Node.js). Features rich text editing, user roles, comments, and responsive design.',
    link: 'https://github.com/thanhtrongvo/BlogMernStack',
    icon: <BookIcon />,
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-20 px-4 md:px-8 max-w-5xl mx-auto">
      <ScrollReveal>
        <h2 className="section-title">📜 QUEST LOG 📜</h2>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <div
          className="text-center mb-10"
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: '22px',
            color: '#94b0c2',
          }}
        >
          Select a quest to inspect the details...
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <PixelCard
            key={project.title}
            title={project.title}
            description={project.description}
            link={project.link}
            icon={project.icon}
            index={index}
          />
        ))}
      </div>

      {/* More quests coming indicator */}
      <ScrollReveal delay={0.6}>
        <div
          className="text-center mt-12 p-4"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '10px',
            color: '#566c86',
            borderTop: '2px dashed #333c57',
            paddingTop: '24px',
          }}
        >
          <span style={{ animation: 'blink 1.5s step-end infinite', display: 'inline-block' }}>
            ▶ MORE QUESTS LOADING...
          </span>
        </div>
      </ScrollReveal>
    </section>
  );
}
