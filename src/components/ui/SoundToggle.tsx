import { useState, useEffect } from 'react';
import { audioSystem } from '../../utils/audio';

// Inline simple SVGs for Speaker ON / OFF in pixel art style
const SpeakerOn = () => (
  <svg viewBox="0 0 16 16" width="24" height="24" style={{ imageRendering: 'pixelated' as const }}>
    <rect x="2" y="6" width="2" height="4" fill="#ffcd75" />
    <rect x="4" y="4" width="2" height="8" fill="#ffcd75" />
    <rect x="6" y="2" width="2" height="12" fill="#ffcd75" />
    {/* Sound waves */}
    <rect x="10" y="6" width="2" height="4" fill="#a7f070" />
    <rect x="13" y="4" width="2" height="8" fill="#a7f070" />
  </svg>
);

const SpeakerOff = () => (
  <svg viewBox="0 0 16 16" width="24" height="24" style={{ imageRendering: 'pixelated' as const }}>
    <rect x="2" y="6" width="2" height="4" fill="#566c86" />
    <rect x="4" y="4" width="2" height="8" fill="#566c86" />
    <rect x="6" y="2" width="2" height="12" fill="#566c86" />
    {/* X mark */}
    <rect x="11" y="6" width="2" height="2" fill="#b13e53" />
    <rect x="11" y="8" width="2" height="2" fill="#b13e53" />
    <rect x="9" y="8" width="2" height="2" fill="#b13e53" />
    <rect x="13" y="8" width="2" height="2" fill="#b13e53" />
    <rect x="11" y="10" width="2" height="2" fill="#b13e53" />
  </svg>
);

export default function SoundToggle() {
  // We assume audio is globally muted by default until activated or explicitly toggled.
  // Actually, let's just trace local React state that syncs with the AudioSystem flag.
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    // Initial sync
    if (audioSystem) {
      setIsMuted(audioSystem.muted);
    }
  }, []);

  const handleToggle = () => {
    if (audioSystem) {
      const currentMuteState = audioSystem.toggleMute();
      setIsMuted(currentMuteState);
      if (!currentMuteState) {
        audioSystem.playHoverSound();
      }
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="pixel-border flex items-center justify-center fixed z-50"
      style={{
        bottom: '24px',
        right: '24px',
        width: '48px',
        height: '48px',
        backgroundColor: '#1a1c2c',
        cursor: "url('/cursors/pixel-hand.svg') 8 0, pointer",
        outline: 'none'
      }}
      aria-label="Toggle Sound"
      title={isMuted ? "Unmute Sound" : "Mute Sound"}
    >
      {isMuted ? <SpeakerOff /> : <SpeakerOn />}
    </button>
  );
}
