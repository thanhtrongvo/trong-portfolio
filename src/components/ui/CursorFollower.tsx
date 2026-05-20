import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export default function CursorFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Hide default cursor on desktop devices with mice
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    setIsVisible(true);
    document.documentElement.classList.add('custom-cursor-enabled');

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Spawn trail particle if mouse has moved sufficiently
      const dist = Math.hypot(e.clientX - lastPos.current.x, e.clientY - lastPos.current.y);
      if (dist > 8) {
        lastPos.current = { x: e.clientX, y: e.clientY };
        
        // Random particle color from active theme variables
        const colors = [
          'var(--color-pixel-yellow)',
          'var(--color-pixel-cyan)',
          'var(--color-pixel-lime)',
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const newParticle: Particle = {
          id: Math.random() + Date.now(),
          x: e.clientX + window.scrollX,
          y: e.clientY + window.scrollY,
          size: Math.floor(Math.random() * 4) + 3, // 3px to 7px
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2 - 0.4, // drift up
          life: 1.0,
          color: randomColor,
        };
        
        setParticles((prev) => [...prev.slice(-15), newParticle]);
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      
      // Click burst particles
      const burst: Particle[] = [];
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const speed = Math.random() * 2 + 1.5;
        burst.push({
          id: Math.random() + Date.now() + i,
          x: position.x + window.scrollX,
          y: position.y + window.scrollY,
          size: 5,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          color: 'var(--color-pixel-orange)',
        });
      }
      setParticles((prev) => [...prev, ...burst]);
    };

    const handleMouseUp = () => setIsClicking(false);

    // Detect if hovering interactive items
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.pixel-btn') ||
        target.closest('.inventory-slot') ||
        target.closest('[role="button"]');

      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.documentElement.classList.remove('custom-cursor-enabled');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [position.x, position.y]);

  // Particle update loops
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.08,
          }))
          .filter((p) => p.life > 0)
      );
    }, 30);

    return () => clearInterval(interval);
  }, [particles.length]);

  if (!isVisible) return null;

  return (
    <>
      {/* 1. Sparkle Particle Trails */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute pointer-events-none z-50"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.life,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 4px ${p.color}`,
            imageRendering: 'pixelated',
          }}
        />
      ))}

      {/* 2. Floating Adaptive Cursor Follower */}
      <div
        className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `scale(${isClicking ? 0.85 : isHovering ? 1.3 : 1})`,
        }}
      >
        {isHovering ? (
          /* Gleaming RPG Broadsword Hover Cursor */
          <svg viewBox="0 0 16 16" width="32" height="32" style={{ imageRendering: 'pixelated' }}>
            {/* Blade Outline */}
            <rect x="1" y="0" width="2" height="1" fill="var(--color-pixel-black)" />
            <rect x="0" y="1" width="1" height="2" fill="var(--color-pixel-black)" />
            <rect x="2" y="1" width="1" height="1" fill="var(--color-pixel-black)" />
            <rect x="3" y="2" width="1" height="1" fill="var(--color-pixel-black)" />
            <rect x="4" y="3" width="1" height="1" fill="var(--color-pixel-black)" />
            <rect x="5" y="4" width="1" height="1" fill="var(--color-pixel-black)" />
            <rect x="6" y="5" width="1" height="1" fill="var(--color-pixel-black)" />
            <rect x="7" y="6" width="1" height="1" fill="var(--color-pixel-black)" />
            
            <rect x="1" y="3" width="1" height="1" fill="var(--color-pixel-black)" />
            <rect x="2" y="4" width="1" height="1" fill="var(--color-pixel-black)" />
            <rect x="3" y="5" width="1" height="1" fill="var(--color-pixel-black)" />
            <rect x="4" y="6" width="1" height="1" fill="var(--color-pixel-black)" />
            <rect x="5" y="7" width="1" height="1" fill="var(--color-pixel-black)" />
            <rect x="6" y="8" width="1" height="1" fill="var(--color-pixel-black)" />
            
            {/* Blade Fill (glowing steel & silver highlight) */}
            <rect x="1" y="1" width="1" height="1" fill="var(--color-pixel-white)" />
            <rect x="1" y="2" width="1" height="1" fill="var(--color-pixel-white)" />
            <rect x="2" y="2" width="1" height="1" fill="var(--color-pixel-cyan)" />
            <rect x="2" y="3" width="1" height="1" fill="var(--color-pixel-white)" />
            <rect x="3" y="3" width="1" height="1" fill="var(--color-pixel-cyan)" />
            <rect x="3" y="4" width="1" height="1" fill="var(--color-pixel-white)" />
            <rect x="4" y="4" width="1" height="1" fill="var(--color-pixel-cyan)" />
            <rect x="4" y="5" width="1" height="1" fill="var(--color-pixel-white)" />
            <rect x="5" y="5" width="1" height="1" fill="var(--color-pixel-cyan)" />
            <rect x="5" y="6" width="1" height="1" fill="var(--color-pixel-white)" />
            <rect x="6" y="6" width="1" height="1" fill="var(--color-pixel-cyan)" />
            <rect x="6" y="7" width="1" height="1" fill="var(--color-pixel-white)" />
            <rect x="7" y="7" width="1" height="1" fill="var(--color-pixel-cyan)" />

            {/* Guard Outline */}
            <rect x="8" y="5" width="1" height="1" fill="var(--color-pixel-black)" />
            <rect x="9" y="4" width="2" height="1" fill="var(--color-pixel-black)" />
            <rect x="11" y="5" width="1" height="1" fill="var(--color-pixel-black)" />
            <rect x="10" y="6" width="1" height="1" fill="var(--color-pixel-black)" />
            
            <rect x="4" y="9" width="1" height="1" fill="var(--color-pixel-black)" />
            <rect x="5" y="8" width="1" height="2" fill="var(--color-pixel-black)" />
            <rect x="6" y="10" width="2" height="1" fill="var(--color-pixel-black)" />
            <rect x="8" y="9" width="1" height="1" fill="var(--color-pixel-black)" />
            
            {/* Guard Fill (gold) */}
            <rect x="7" y="8" width="1" height="1" fill="var(--color-pixel-yellow)" />
            <rect x="8" y="7" width="1" height="1" fill="var(--color-pixel-yellow)" />
            <rect x="8" y="8" width="1" height="1" fill="var(--color-pixel-orange)" />
            <rect x="9" y="5" width="1" height="1" fill="var(--color-pixel-yellow)" />
            <rect x="10" y="5" width="1" height="1" fill="var(--color-pixel-yellow)" />
            <rect x="9" y="6" width="1" height="1" fill="var(--color-pixel-orange)" />
            
            <rect x="5" y="9" width="1" height="1" fill="var(--color-pixel-yellow)" />
            <rect x="6" y="9" width="1" height="1" fill="var(--color-pixel-yellow)" />
            
            {/* Hilt & handle wrap */}
            <rect x="9" y="9" width="1" height="1" fill="var(--color-pixel-black)" />
            <rect x="10" y="10" width="1" height="1" fill="var(--color-pixel-black)" />
            
            <rect x="9" y="8" width="1" height="1" fill="var(--color-pixel-red)" />
            <rect x="10" y="9" width="1" height="1" fill="var(--color-pixel-red)" />
            <rect x="11" y="10" width="1" height="1" fill="var(--color-pixel-red)" />
            
            {/* Pommel */}
            <rect x="11" y="11" width="2" height="2" fill="var(--color-pixel-black)" />
            <rect x="12" y="12" width="1" height="1" fill="var(--color-pixel-yellow)" />
          </svg>
        ) : (
          /* Custom Retro Arrow Icon */
          <svg viewBox="0 0 16 16" width="24" height="24" style={{ imageRendering: 'pixelated' }}>
            {/* Outline black */}
            <rect x="0" y="0" width="2" height="12" fill="var(--color-pixel-black)" />
            <rect x="2" y="10" width="2" height="2" fill="var(--color-pixel-black)" />
            <rect x="4" y="8" width="2" height="2" fill="var(--color-pixel-black)" />
            <rect x="6" y="6" width="2" height="2" fill="var(--color-pixel-black)" />
            <rect x="8" y="4" width="2" height="2" fill="var(--color-pixel-black)" />
            <rect x="10" y="2" width="2" height="2" fill="var(--color-pixel-black)" />
            <rect x="12" y="0" width="2" height="2" fill="var(--color-pixel-black)" />
            <rect x="2" y="0" width="10" height="2" fill="var(--color-pixel-black)" />
            
            {/* Stem outline */}
            <rect x="6" y="10" width="4" height="4" fill="var(--color-pixel-black)" />
            
            {/* Inside Fills */}
            <rect x="2" y="2" width="8" height="2" fill="var(--color-pixel-white)" />
            <rect x="2" y="4" width="6" height="2" fill="var(--color-pixel-white)" />
            <rect x="2" y="6" width="4" height="2" fill="var(--color-pixel-white)" />
            <rect x="2" y="8" width="2" height="2" fill="var(--color-pixel-white)" />
            
            {/* Highlight shadow */}
            <rect x="8" y="2" width="2" height="1" fill="var(--color-pixel-yellow)" />
            <rect x="6" y="4" width="2" height="1" fill="var(--color-pixel-yellow)" />
            <rect x="4" y="6" width="2" height="1" fill="var(--color-pixel-yellow)" />
            <rect x="2" y="8" width="2" height="1" fill="var(--color-pixel-yellow)" />
          </svg>
        )}
      </div>
    </>
  );
}
