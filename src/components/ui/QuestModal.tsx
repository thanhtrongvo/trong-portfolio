import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioSystem } from '../../utils/audio';

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    description: string;
    longDescription?: string;
    link: string;
    liveUrl?: string;
    icon: React.ReactNode;
    rank: 'S' | 'A' | 'B' | 'C';
    reward: string;
    status: 'COMPLETED' | 'IN_PROGRESS';
    client: string;
    tags?: string[];
  } | null;
}

const colorMap = {
  S: 'var(--color-pixel-yellow)',
  A: 'var(--color-pixel-lime)',
  B: 'var(--color-pixel-sky)',
  C: 'var(--color-pixel-orange)',
};

export default function QuestModal({ isOpen, onClose, project }: QuestModalProps) {
  const [accepting, setAccepting] = useState(false);

  // Reset accepting state when modal closes/opens
  useEffect(() => {
    if (isOpen) {
      setAccepting(false);
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        audioSystem?.playClickSound();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!project) return null;

  const rankColor = colorMap[project.rank];
  const tags = project.tags || [];

  const handleAcceptQuest = () => {
    audioSystem?.playPowerUpSound();
    setAccepting(true);
    
    // Simulate portal opening / loading
    setTimeout(() => {
      window.open(project.liveUrl || project.link, '_blank');
      setAccepting(false);
      onClose();
    }, 1200);
  };

  const handleInspectCode = () => {
    audioSystem?.playClickSound();
    window.open(project.link, '_blank');
  };

  const handleClose = () => {
    audioSystem?.playClickSound();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal Container */}
          <motion.div
            className="pixel-border w-full max-w-lg bg-[var(--color-pixel-black)] text-[var(--color-pixel-white)] relative overflow-hidden flex flex-col z-10"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            style={{
              maxHeight: '85vh',
              boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
            }}
          >
            {/* Screen static scanlines overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 3px)',
                pointerEvents: 'none',
                zIndex: 4,
              }}
            />

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-4 border-[var(--color-pixel-dark)] bg-[var(--color-pixel-blue)] p-4">
              <div className="flex items-center gap-3">
                {/* Mini icon */}
                <div className="w-8 h-8 flex items-center justify-center p-1 bg-[var(--color-pixel-dark)]">
                  {project.icon}
                </div>
                <span
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '9px',
                    color: 'var(--color-pixel-yellow)',
                  }}
                >
                  QUEST DETAILS
                </span>
              </div>
              <button
                onClick={handleClose}
                onMouseEnter={() => audioSystem?.playHoverSound()}
                className="text-[12px] px-2 py-1 bg-[var(--color-pixel-dark)] hover:bg-[var(--color-pixel-red)] hover:text-white cursor-pointer"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                [X]
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-4">
              {/* Title & Rank Block */}
              <div className="flex items-start gap-4 pb-4 border-b border-[var(--color-pixel-dark)]">
                <div
                  className="flex-shrink-0 w-14 h-14 flex flex-col items-center justify-center pixel-border"
                  style={{ backgroundColor: 'var(--color-pixel-dark)', margin: '2px' }}
                >
                  <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '5px', color: 'var(--color-pixel-gray)', marginBottom: '4px' }}>RANK</span>
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: '28px', color: rankColor, lineHeight: '1' }}>{project.rank}</span>
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '11px',
                      color: 'var(--color-pixel-white)',
                      marginBottom: '6px',
                      lineHeight: '1.4',
                    }}
                  >
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[13px] text-[var(--color-pixel-light)]">
                    <p>Client: <span className="text-[var(--color-pixel-orange)]">{project.client}</span></p>
                    <p>Status: <span className="text-[var(--color-pixel-lime)]">{project.status}</span></p>
                  </div>
                </div>
              </div>

              {/* Tag Badges */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-[11px] font-mono bg-[var(--color-pixel-dark)] border border-[var(--color-pixel-light)] text-[var(--color-pixel-cyan)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Narrative description */}
              <div className="bg-[rgba(0,0,0,0.3)] p-4 space-y-3">
                <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: 'var(--color-pixel-gray)' }}>QUEST BRIEFING:</p>
                <p
                  style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: '18px',
                    color: 'var(--color-pixel-light)',
                    lineHeight: '1.5',
                  }}
                >
                  {project.longDescription || project.description}
                </p>
              </div>

              {/* Rewards */}
              <div className="border-t border-b border-[var(--color-pixel-dark)] py-3 flex justify-between items-center">
                <span
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '6px',
                    color: 'var(--color-pixel-gray)',
                  }}
                >
                  ESTIMATED REWARDS:
                </span>
                <span
                  style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: '20px',
                    color: 'var(--color-pixel-lime)',
                  }}
                >
                  {project.reward}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="border-t-4 border-[var(--color-pixel-dark)] p-4 bg-[rgba(0,0,0,0.45)] flex flex-wrap gap-3 items-center justify-end">
              {accepting ? (
                <div className="flex-1 text-center font-mono text-[var(--color-pixel-yellow)] animate-pulse py-2 text-[14px]">
                  ⚡ [ OPENING TELEPORT PORTAL... ] ⚡
                </div>
              ) : (
                <>
                  <button
                    onClick={handleClose}
                    onMouseEnter={() => audioSystem?.playHoverSound()}
                    className="px-3 py-2 text-[8px] text-[var(--color-pixel-white)] bg-[var(--color-pixel-dark)] border border-transparent hover:border-[var(--color-pixel-red)] cursor-pointer"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    [ ABANDON ]
                  </button>
                  <button
                    onClick={handleInspectCode}
                    onMouseEnter={() => audioSystem?.playHoverSound()}
                    className="px-3 py-2 text-[8px] text-[var(--color-pixel-white)] bg-[var(--color-pixel-dark)] border border-transparent hover:border-[var(--color-pixel-yellow)] cursor-pointer"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    [ INSPECT CODE ]
                  </button>
                  <button
                    onClick={handleAcceptQuest}
                    onMouseEnter={() => audioSystem?.playHoverSound()}
                    className="px-3 py-2 text-[8px] text-[var(--color-pixel-black)] bg-[var(--color-pixel-yellow)] border-2 border-[var(--color-pixel-white)] hover:scale-105 transition-transform cursor-pointer"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    ▶ ACCEPT QUEST
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
