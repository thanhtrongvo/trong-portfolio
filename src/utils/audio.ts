// Minimal 8-bit Synthesizer using Web Audio API

class AudioSystem {
  context: AudioContext | null = null;
  muted: boolean = false;
  isInitialized: boolean = false;

  // BGM Properties
  bgmIntervalId: any = null;
  bgmIndex: number = 0;
  bgmMuted: boolean = true;
  bgmSequence: number[] = [
    // A minor arpeggio
    220.00, 261.63, 329.63, 440.00, 392.00, 329.63, 261.63,
    // F major arpeggio
    174.61, 220.00, 261.63, 349.23, 329.63, 261.63, 220.00,
    // C major arpeggio
    261.63, 329.63, 392.00, 523.25, 493.88, 392.00, 329.63,
    // G major arpeggio
    196.00, 246.94, 293.66, 392.00, 349.23, 293.66, 246.94
  ];

  init() {
    if (!this.context) {
      // Create audio context only on user interaction
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
    
    this.isInitialized = true;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (!this.isInitialized && !this.muted) {
      this.init();
    }
    return this.muted;
  }

  startBGM() {
    if (this.bgmIntervalId) return;
    this.bgmMuted = false;
    this.init();
    
    if (this.muted) return;
    
    this.bgmIndex = 0;
    this.playBgmStep();
    this.bgmIntervalId = setInterval(() => {
      this.playBgmStep();
    }, 300);
  }

  stopBGM() {
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    this.bgmMuted = true;
  }

  toggleBGMMute() {
    if (this.bgmIntervalId && !this.bgmMuted) {
      this.stopBGM();
      return true; // is muted
    } else {
      this.startBGM();
      return false; // is unmuted
    }
  }

  playBgmStep() {
    if (this.muted || this.bgmMuted || !this.context) return;
    
    const freq = this.bgmSequence[this.bgmIndex];
    this.bgmIndex = (this.bgmIndex + 1) % this.bgmSequence.length;
    
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();
    const filter = this.context.createBiquadFilter();
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(freq, this.context.currentTime);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.context.currentTime);
    
    // Very quiet arpeggio
    const volume = 0.015;
    gainNode.gain.setValueAtTime(volume, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.45);
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.context.destination);
    
    oscillator.start();
    oscillator.stop(this.context.currentTime + 0.48);
  }

  playTone(frequency: number, type: OscillatorType, duration: number, vol = 0.1) {
    if (this.muted || !this.context) return;
    
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);

    gainNode.gain.setValueAtTime(vol, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.start();
    oscillator.stop(this.context.currentTime + duration);
  }

  playHoverSound() {
    // A quick, short blip
    this.playTone(600, 'square', 0.05, 0.05);
  }

  playClickSound() {
    // A deeper, more fulfilling thud
    this.playTone(150, 'square', 0.1, 0.1);
  }

  playTypingSound() {
    // high frequency quick noise for terminal typing
    this.playTone(800, 'square', 0.02, 0.03);
  }

  playPowerUpSound() {
    // Rapid ascending tones
    if (this.muted || !this.context) return;
    
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(300, this.context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, this.context.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.start();
    oscillator.stop(this.context.currentTime + 0.3);
  }
}

// Export a singleton instance
export const audioSystem = typeof window !== 'undefined' ? new AudioSystem() : null;
