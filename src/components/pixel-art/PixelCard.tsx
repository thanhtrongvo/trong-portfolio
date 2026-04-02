import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PixelCardProps {
  title: string;
  description: string;
  link: string;
  icon: ReactNode;
  index?: number;
}

export default function PixelCard({
  title,
  description,
  link,
  icon,
  index = 0,
}: PixelCardProps) {
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="inventory-slot pixel-border block no-underline"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      whileHover={{
        scale: 1.03,
        rotate: [0, -1, 1, -1, 0],
        transition: { rotate: { duration: 0.4, ease: 'easeInOut' } },
      }}
      whileTap={{ scale: 0.97 }}
      style={{ cursor: "url('/cursors/pixel-hand.svg') 8 0, pointer" }}
    >
      {/* Icon area */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-16 h-16 flex items-center justify-center text-3xl"
          style={{ backgroundColor: '#29366f', imageRendering: 'pixelated' }}
        >
          {icon}
        </div>
        <h3
          className="text-xs leading-relaxed"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            color: '#ffcd75',
          }}
        >
          {title}
        </h3>
      </div>

      {/* Description */}
      <p
        className="mb-4 leading-relaxed"
        style={{
          fontFamily: "'VT323', monospace",
          color: '#94b0c2',
          fontSize: '22px',
        }}
      >
        {description}
      </p>

      {/* Action */}
      <div
        className="flex items-center gap-2 mt-auto"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '10px',
          color: '#a7f070',
        }}
      >
        <span>EXPLORE</span>
        <motion.span
          animate={{ x: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          →
        </motion.span>
      </div>
    </motion.a>
  );
}
