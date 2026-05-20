import { useState } from 'react';
import ScrollReveal from '../motion/ScrollReveal';
import QuestCard, { type QuestCardProps } from '../pixel-art/QuestCard';
import QuestModal from '../ui/QuestModal';

// Pixel art icons as inline SVGs
const ShoppingCartIcon = () => (
  <svg viewBox="0 0 16 16" width="40" height="40" style={{ imageRendering: 'pixelated' as const }}>
    <rect x="2" y="2" width="2" height="2" fill="var(--color-pixel-yellow)" />
    <rect x="4" y="2" width="10" height="2" fill="var(--color-pixel-yellow)" />
    <rect x="4" y="4" width="10" height="2" fill="var(--color-pixel-orange)" />
    <rect x="4" y="6" width="8" height="2" fill="var(--color-pixel-orange)" />
    <rect x="5" y="8" width="6" height="2" fill="var(--color-pixel-yellow)" />
    <rect x="6" y="10" width="2" height="2" fill="var(--color-pixel-white)" />
    <rect x="10" y="10" width="2" height="2" fill="var(--color-pixel-white)" />
    <rect x="0" y="2" width="2" height="2" fill="var(--color-pixel-light)" />
    <rect x="0" y="4" width="2" height="2" fill="var(--color-pixel-light)" />
  </svg>
);

const BookIcon = () => (
  <svg viewBox="0 0 16 16" width="40" height="40" style={{ imageRendering: 'pixelated' as const }}>
    <rect x="2" y="1" width="12" height="2" fill="var(--color-pixel-purple)" />
    <rect x="2" y="3" width="12" height="2" fill="var(--color-pixel-red)" />
    <rect x="2" y="5" width="12" height="2" fill="var(--color-pixel-red)" />
    <rect x="2" y="7" width="12" height="2" fill="var(--color-pixel-red)" />
    <rect x="2" y="9" width="12" height="2" fill="var(--color-pixel-red)" />
    <rect x="2" y="11" width="12" height="2" fill="var(--color-pixel-purple)" />
    {/* Book pages */}
    <rect x="4" y="4" width="8" height="1" fill="var(--color-pixel-white)" />
    <rect x="4" y="6" width="6" height="1" fill="var(--color-pixel-white)" />
    <rect x="4" y="8" width="7" height="1" fill="var(--color-pixel-white)" />
    {/* Book spine */}
    <rect x="2" y="1" width="1" height="12" fill="var(--color-pixel-purple)" />
    {/* Star on cover */}
    <rect x="7" y="3" width="2" height="2" fill="var(--color-pixel-yellow)" />
  </svg>
);

// Extended project type to fit QuestCardProps structure
const quests: Omit<QuestCardProps, 'index'>[] = [
  {
    title: 'E-Commerce Platform',
    description:
      'Full Stack e-commerce platform showcasing skills in React, Node.js, Express, and MongoDB. Features product listings, cart system, user authentication, and payment integration.',
    longDescription:
      'This epic quest required forging a complete digital bazaar. Features a fully pixel-responsive front-end, secure magic gate (user authentication) with JSON Web Tokens, state management via React Context, and a treasure treasury (payment system) powered by Stripe. Adventurers can browse items, fill their bags, and make secure transactions!',
    link: 'https://github.com/thanhtrongvo/e-commerce',
    liveUrl: 'https://github.com/thanhtrongvo/e-commerce', // Replace with live URL if available
    icon: <ShoppingCartIcon />,
    rank: 'S',
    reward: '★ 1000 XP & Node Mastery',
    client: 'Freelance Guild',
    status: 'COMPLETED',
    tags: ['React', 'NodeJS', 'Express', 'MongoDB', 'JWT', 'Stripe'],
  },
  {
    title: 'Blog MERN Stack',
    description:
      'Complete blog management system built with the MERN stack. Features rich text editing, user roles, comments, and responsive design.',
    longDescription:
      "Embark on a chronicler's journey. Designed and constructed a scrolls management portal (MERN Blog) enabling scholars to read, draft, and annotate public logs. Features rich text scrolls editing, user tier privileges (Admin/User permissions), dynamic comments section, and full database persistence in MongoDB.",
    link: 'https://github.com/thanhtrongvo/BlogMernStack',
    liveUrl: 'https://github.com/thanhtrongvo/BlogMernStack', // Replace with live URL if available
    icon: <BookIcon />,
    rank: 'A',
    reward: '★ 800 XP & React Spells',
    client: 'Local Village',
    status: 'COMPLETED',
    tags: ['React', 'Express', 'MongoDB', 'NodeJS', 'RichText', 'OAuth'],
  },
];

export default function ProjectsSection() {
  const [selectedQuest, setSelectedQuest] = useState<typeof quests[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleQuestSelect = (quest: typeof quests[0]) => {
    setSelectedQuest(quest);
    setModalOpen(true);
  };

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
            color: 'var(--color-pixel-light)',
          }}
        >
          ► Select a quest to inspect details...
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-8">
        {quests.map((quest, index) => (
          <QuestCard
            key={quest.title}
            {...quest}
            index={index}
            onClick={() => handleQuestSelect(quest)}
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
            color: 'var(--color-pixel-gray)',
            borderTop: '2px dashed var(--color-pixel-dark)',
            paddingTop: '24px',
          }}
        >
          <span style={{ animation: 'blink 1.5s step-end infinite', display: 'inline-block' }}>
            ▶ MORE QUESTS LOADING...
          </span>
        </div>
      </ScrollReveal>

      {/* Quest Details Modal Overlay */}
      <QuestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        project={selectedQuest}
      />
    </section>
  );
}
