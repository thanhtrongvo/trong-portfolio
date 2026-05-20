import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { audioSystem } from '../../utils/audio';

export interface QuestCardProps {
  title: string;
  description: string;
  link: string;
  icon: ReactNode;
  rank: 'S' | 'A' | 'B' | 'C';
  reward: string;
  status: 'COMPLETED' | 'IN_PROGRESS';
  client: string;
  index?: number;
  longDescription?: string;
  liveUrl?: string;
  tags?: string[];
  onClick?: () => void;
}

const colorMap = {
  S: 'var(--color-pixel-yellow)', 
  A: 'var(--color-pixel-lime)', 
  B: 'var(--color-pixel-sky)', 
  C: 'var(--color-pixel-orange)', 
};

export default function QuestCard({
  title,
  description,
  link,
  icon,
  rank,
  reward,
  status,
  client,
  index = 0,
  onClick,
}: QuestCardProps) {
  const rankColor = colorMap[rank];

  // Helper bindings for sound
  const handleHover = () => audioSystem?.playHoverSound();
  const handleClick = () => audioSystem?.playClickSound();

  return (
    <motion.div
      className="pixel-border block select-none"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      onMouseEnter={handleHover}
      onClick={(e) => {
        handleClick();
        if (onClick) {
          onClick();
        } else {
          window.open(link, '_blank');
        }
      }}
      whileHover={{
        scale: 1.02,
        backgroundColor: 'var(--color-pixel-blue)',
      }}
      whileTap={{ scale: 0.98 }}
      style={{
        backgroundColor: 'var(--color-pixel-black)',
        cursor: "url('/cursors/pixel-hand.svg') 8 0, pointer",
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header Tape */}
      <div 
        style={{
          borderBottom: '2px dashed var(--color-pixel-dark)',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--color-pixel-blue)',
        }}
      >
        <span 
          style={{ 
            fontFamily: "'Press Start 2P', monospace", 
            fontSize: '8px', 
            color: 'var(--color-pixel-light)',
            letterSpacing: '1px'
          }}
        >
          ► QUEST LOG ENTRY
        </span>
        <span 
          style={{ 
            fontFamily: "'VT323', monospace", 
            fontSize: '18px', 
            color: status === 'COMPLETED' ? 'var(--color-pixel-yellow)' : 'var(--color-pixel-sky)'
          }}
        >
          {status === 'COMPLETED' ? '[✓] COMPLETE' : '[!] NEW QUEST'}
        </span>
      </div>

      <div style={{ padding: '20px' }} className="flex-1 flex flex-col">
        {/* Title row */}
        <div className="flex items-start gap-4 mb-4">
          {/* Rank Badge */}
          <div
            className="flex-shrink-0 w-12 h-12 flex flex-col items-center justify-center pixel-border"
            style={{ backgroundColor: 'var(--color-pixel-dark)', margin: '2px' }}
          >
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: 'var(--color-pixel-gray)', marginBottom: '4px' }}>RANK</span>
            <span style={{ fontFamily: "'VT323', monospace", fontSize: '24px', color: rankColor, lineHeight: '1' }}>{rank}</span>
          </div>

          <div className="flex-1">
            <h3
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '10px',
                color: 'var(--color-pixel-white)',
                marginBottom: '8px',
                lineHeight: '1.4'
              }}
            >
              {title}
            </h3>
            <p
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: '16px',
                color: 'var(--color-pixel-light)',
              }}
            >
              Client: <span style={{ color: 'var(--color-pixel-orange)' }}>{client}</span>
            </p>
          </div>
        </div>

        {/* Objective / Description */}
        <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '12px', marginBottom: '16px' }}>
          <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: 'var(--color-pixel-gray)', marginBottom: '8px' }}>OBJECTIVE:</p>
          <p
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: '20px',
              color: 'var(--color-pixel-white)',
              lineHeight: '1.5',
            }}
          >
            {description}
          </p>
        </div>

        {/* Reward & Footer */}
        <div className="mt-auto flex justify-between items-end">
          <div>
            <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: 'var(--color-pixel-gray)', marginBottom: '4px' }}>REWARD:</p>
            <p style={{ fontFamily: "'VT323', monospace", fontSize: '18px', color: 'var(--color-pixel-lime)' }}>{reward}</p>
          </div>
          
          <div className="flex items-center gap-2" style={{ color: 'var(--color-pixel-yellow)' }}>
            <div className="w-8 h-8 flex items-center justify-center p-1 bg-var(--color-pixel-dark)" style={{ imageRendering: 'pixelated' }}>
               {icon}
            </div>
            <motion.span 
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px' }}
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >→</motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
