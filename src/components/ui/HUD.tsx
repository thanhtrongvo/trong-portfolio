import { useState, useEffect } from 'react';
import { audioSystem } from '../../utils/audio';

const themes = [
  { id: 'quest', label: 'QUEST', value: '' },
  { id: 'gameboy', label: 'GAME BOY', value: 'gameboy' },
  { id: 'cyberpunk', label: 'NEON', value: 'cyberpunk' },
  { id: 'vampire', label: 'GOTHIC', value: 'vampire' },
];

export default function HUD() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [bgmActive, setBgmActive] = useState(false);
  const [soundMuted, setSoundMuted] = useState(true);
  const [currentThemeIdx, setCurrentThemeIdx] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Scroll progress handler
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const percent = (window.scrollY / scrollHeight) * 100;
        setScrollPercent(Math.min(percent, 100));
      } else {
        setScrollPercent(0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // Initial audio system state sync
    if (audioSystem) {
      setSoundMuted(audioSystem.muted);
      setBgmActive(!!audioSystem.bgmIntervalId);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update theme on HTML tag
  const rotateTheme = () => {
    audioSystem?.playClickSound();
    const nextIdx = (currentThemeIdx + 1) % themes.length;
    setCurrentThemeIdx(nextIdx);
    const nextTheme = themes[nextIdx];
    document.documentElement.setAttribute('data-theme', nextTheme.value);
  };

  const handleToggleBGM = () => {
    if (audioSystem) {
      if (audioSystem.muted) {
        // If sound is globally muted, unmute it first so BGM can play
        audioSystem.toggleMute();
        setSoundMuted(false);
      }
      const isMuted = audioSystem.toggleBGMMute();
      setBgmActive(!isMuted);
    }
  };

  const handleToggleSound = () => {
    if (audioSystem) {
      const muted = audioSystem.toggleMute();
      setSoundMuted(muted);
      if (muted) {
        // If globally muted, BGM is paused
        audioSystem.stopBGM();
        setBgmActive(false);
      } else {
        audioSystem.playHoverSound();
      }
    }
  };

  const scrollToSection = (id: string) => {
    audioSystem?.playClickSound();
    setMobileMenuOpen(false);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentTheme = themes[currentThemeIdx];

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-40 bg-[var(--color-pixel-black)] border-b-4 border-[var(--color-pixel-dark)] px-4 py-2 md:py-3 shadow-md"
      style={{
        boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
      }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Name and Level */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block w-7 h-7 bg-[var(--color-pixel-dark)] border-2 border-[var(--color-pixel-yellow)] flex items-center justify-center p-0.5" style={{ imageRendering: 'pixelated' }}>
            <svg viewBox="0 0 8 8" width="16" height="16">
              <rect x="2" y="0" width="4" height="2" fill="var(--color-pixel-dark)" />
              <rect x="1" y="2" width="6" height="2" fill="var(--color-pixel-orange)" />
              <rect x="2" y="2" width="1" height="1" fill="var(--color-pixel-black)" />
              <rect x="5" y="2" width="1" height="1" fill="var(--color-pixel-black)" />
              <rect x="1" y="4" width="6" height="2" fill="var(--color-pixel-indigo)" />
              <rect x="2" y="6" width="2" height="2" fill="var(--color-pixel-blue)" />
              <rect x="4" y="6" width="2" height="2" fill="var(--color-pixel-blue)" />
            </svg>
          </div>
          <div>
            <h1 
              onClick={() => scrollToSection('hero')}
              className="text-[9px] md:text-[10px] tracking-wide font-bold cursor-pointer text-[var(--color-pixel-yellow)]"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              VO THANH TRONG
            </h1>
            <p className="text-[12px] md:text-[14px] text-[var(--color-pixel-lime)] font-mono tracking-wider">
              LVL: GRADUATE ★
            </p>
          </div>
        </div>

        {/* Stats: HP & MP Bars */}
        <div className="hidden md:flex items-center gap-6">
          {/* HP: Scroll Progress */}
          <div className="flex flex-col text-left">
            <div className="flex justify-between items-center text-[7px] mb-0.5 font-mono text-[var(--color-pixel-red)]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              <span>HP [SCROLL]</span>
              <span>{Math.round(scrollPercent)}/100</span>
            </div>
            <div className="w-[120px] h-3 bg-[var(--color-pixel-dark)] relative border-2 border-[var(--color-pixel-black)]">
              <div 
                className="h-full bg-[var(--color-pixel-red)] transition-all duration-75" 
                style={{ width: `${scrollPercent}%` }}
              />
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 4px, rgba(0,0,0,0.15) 4px, rgba(0,0,0,0.15) 6px)' }} />
            </div>
          </div>

          {/* MP: BGM Synth */}
          <div className="flex flex-col text-left cursor-pointer" onClick={handleToggleBGM}>
            <div className="flex justify-between items-center text-[7px] mb-0.5 font-mono text-[var(--color-pixel-sky)]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              <span>MP [BGM]</span>
              <span>{bgmActive ? '99/99' : '00/99'}</span>
            </div>
            <div className="w-[120px] h-3 bg-[var(--color-pixel-dark)] relative border-2 border-[var(--color-pixel-black)]">
              <div 
                className="h-full bg-[var(--color-pixel-sky)] transition-all duration-300" 
                style={{ width: bgmActive ? '100%' : '0%' }}
              />
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 4px, rgba(0,0,0,0.15) 4px, rgba(0,0,0,0.15) 6px)' }} />
            </div>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Sound Mute Toggle */}
          <button
            onClick={handleToggleSound}
            onMouseEnter={() => audioSystem?.playHoverSound()}
            className="w-7 h-7 flex items-center justify-center bg-[var(--color-pixel-dark)] border-2 border-[var(--color-pixel-light)] text-xs cursor-pointer active:scale-95"
            title={soundMuted ? "Unmute sound blips" : "Mute sound blips"}
          >
            {soundMuted ? '🔇' : '🔊'}
          </button>

          {/* BGM Toggle */}
          <button
            onClick={handleToggleBGM}
            onMouseEnter={() => audioSystem?.playHoverSound()}
            className={`w-7 h-7 flex items-center justify-center bg-[var(--color-pixel-dark)] border-2 text-xs cursor-pointer active:scale-95 ${bgmActive ? 'border-[var(--color-pixel-sky)]' : 'border-[var(--color-pixel-gray)] opacity-60'}`}
            title="Toggle Retro BGM"
          >
            🎵
          </button>

          {/* Theme Rotator */}
          <button
            onClick={rotateTheme}
            className="px-2 h-7 flex items-center justify-center bg-[var(--color-pixel-dark)] border-2 border-[var(--color-pixel-yellow)] text-[7px] text-[var(--color-pixel-yellow)] cursor-pointer active:scale-95"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            THEME: {currentTheme.label}
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            <button 
              onClick={() => scrollToSection('about')}
              className="px-2 py-1 text-[8px] text-[var(--color-pixel-white)] bg-[var(--color-pixel-dark)] border border-transparent hover:border-[var(--color-pixel-yellow)] hover:text-[var(--color-pixel-yellow)] cursor-pointer"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              [ CHAR ]
            </button>
            <button 
              onClick={() => scrollToSection('projects')}
              className="px-2 py-1 text-[8px] text-[var(--color-pixel-white)] bg-[var(--color-pixel-dark)] border border-transparent hover:border-[var(--color-pixel-yellow)] hover:text-[var(--color-pixel-yellow)] cursor-pointer"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              [ QUEST ]
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-2 py-1 text-[8px] text-[var(--color-pixel-white)] bg-[var(--color-pixel-dark)] border border-transparent hover:border-[var(--color-pixel-yellow)] hover:text-[var(--color-pixel-yellow)] cursor-pointer"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              [ SAVE ]
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              audioSystem?.playClickSound();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden w-7 h-7 flex flex-col items-center justify-center gap-1 bg-[var(--color-pixel-dark)] border-2 border-[var(--color-pixel-light)] p-1 cursor-pointer"
          >
            <span className="w-4 h-0.5 bg-[var(--color-pixel-white)]" />
            <span className="w-4 h-0.5 bg-[var(--color-pixel-white)]" />
            <span className="w-4 h-0.5 bg-[var(--color-pixel-white)]" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden mt-2 p-3 bg-[var(--color-pixel-black)] border-4 border-[var(--color-pixel-dark)] flex flex-col gap-2 z-50 relative"
          style={{ imageRendering: 'pixelated' }}
        >
          {/* Mini HP/MP for Mobile */}
          <div className="flex justify-between gap-4 mb-2 pb-2 border-b border-[var(--color-pixel-dark)]">
            <div className="flex-1 flex flex-col text-left">
              <div className="flex justify-between items-center text-[6px] mb-0.5 font-mono text-[var(--color-pixel-red)]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                <span>HP</span>
                <span>{Math.round(scrollPercent)}%</span>
              </div>
              <div className="h-2 bg-[var(--color-pixel-dark)] relative">
                <div className="h-full bg-[var(--color-pixel-red)]" style={{ width: `${scrollPercent}%` }} />
              </div>
            </div>
            <div className="flex-1 flex flex-col text-left" onClick={handleToggleBGM}>
              <div className="flex justify-between items-center text-[6px] mb-0.5 font-mono text-[var(--color-pixel-sky)]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                <span>MP [BGM]</span>
                <span>{bgmActive ? 'ON' : 'OFF'}</span>
              </div>
              <div className="h-2 bg-[var(--color-pixel-dark)] relative">
                <div className="h-full bg-[var(--color-pixel-sky)]" style={{ width: bgmActive ? '100%' : '0%' }} />
              </div>
            </div>
          </div>

          <button 
            onClick={() => scrollToSection('about')}
            className="w-full text-left p-2 text-[8px] text-[var(--color-pixel-white)] bg-[var(--color-pixel-dark)] hover:text-[var(--color-pixel-yellow)] active:scale-98"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            ⚙ [ CHARACTER STATS ]
          </button>
          <button 
            onClick={() => scrollToSection('projects')}
            className="w-full text-left p-2 text-[8px] text-[var(--color-pixel-white)] bg-[var(--color-pixel-dark)] hover:text-[var(--color-pixel-yellow)] active:scale-98"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            📜 [ QUEST LOG ]
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="w-full text-left p-2 text-[8px] text-[var(--color-pixel-white)] bg-[var(--color-pixel-dark)] hover:text-[var(--color-pixel-yellow)] active:scale-98"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            💾 [ SAVE GAME ]
          </button>
        </div>
      )}
    </header>
  );
}
