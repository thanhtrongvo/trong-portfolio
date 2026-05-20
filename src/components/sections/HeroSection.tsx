import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { audioSystem } from "../../utils/audio";

// Typewriter hook
function useTypewriter(text: string, speed = 80, delay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setIsDone(false);

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          audioSystem?.playTypingSound();
          i++;
        } else {
          setIsDone(true);
          clearInterval(interval);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayed, isDone };
}

// Animated loading bar component
function LoadingBar({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  delay: number;
}) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const steps = 20;
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setCurrentValue(Math.min((step / steps) * value, value));
        if (step >= steps) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return (
    <div className="flex items-center gap-3 mb-2">
      <span
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "7px",
          color: "var(--color-pixel-light)",
          width: "44px",
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div
        className="flex-1 relative animate-pulse"
        style={{
          height: "12px",
          backgroundColor: "var(--color-pixel-black)",
          border: "2px solid var(--color-pixel-dark)",
        }}
      >
        <motion.div
          style={{
            height: "100%",
            backgroundColor: color,
            width: `${currentValue}%`,
          }}
          transition={{ duration: 0.1 }}
        />
        {/* Pixel segments */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `repeating-linear-gradient(90deg, transparent 0px, transparent 6px, rgba(0,0,0,0.4) 6px, rgba(0,0,0,0.4) 8px)`,
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "'VT323', monospace",
          fontSize: "14px",
          color: color,
          width: "36px",
          textAlign: "left",
          flexShrink: 0,
        }}
      >
        {Math.round(currentValue)}%
      </span>
    </div>
  );
}

// Floating pixel icon
function FloatingIcon({
  emoji,
  x,
  y,
  delay,
  duration,
}: {
  emoji: string;
  x: string;
  y: string;
  delay: number;
  duration: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{
        left: x,
        top: y,
        fontSize: "20px",
        filter: "drop-shadow(0 0 6px rgba(115, 239, 247, 0.3))",
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.7, 0.5, 0.7, 0],
        scale: [0.5, 1, 0.9, 1, 0.5],
        y: [0, -15, -5, -20, 0],
        rotate: [0, 10, -5, 15, 0],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {emoji}
    </motion.div>
  );
}

// Initial Boot Terminal Lines
const initialCodeLines = [
  { text: "$ whoami", color: "var(--color-pixel-lime)" },
  { text: "> Vo_Thanh_Trong", color: "var(--color-pixel-yellow)" },
  { text: "$ cat skills.json", color: "var(--color-pixel-lime)" },
  { text: '  "frontend": "React, Astro"', color: "var(--color-pixel-cyan)" },
  { text: '  "backend": "Node.js, Java"', color: "var(--color-pixel-cyan)" },
  { text: '  "database": "MongoDB, SQL"', color: "var(--color-pixel-cyan)" },
  { text: "$ ./start_quest.sh", color: "var(--color-pixel-lime)" },
  { text: "> Loading adventure...", color: "var(--color-pixel-orange)" },
  { text: "> Ready! ★", color: "var(--color-pixel-yellow)" },
];

export default function HeroSection() {
  const [showStart, setShowStart] = useState(true);
  const [bootPhase, setBootPhase] = useState(0); // 0: init, 1: bars loading, 2: terminal, 3: ready
  const [visibleLines, setVisibleLines] = useState(0);
  const [cursorBlink, setCursorBlink] = useState(true);

  // Command logs state
  const [terminalLogs, setTerminalLogs] = useState<{ text: string; color: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [interactive, setInteractive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Blinking "START" button
  useEffect(() => {
    const interval = setInterval(() => {
      setShowStart((prev) => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Boot sequence timer triggers
  useEffect(() => {
    const timers = [
      setTimeout(() => setBootPhase(1), 500),
      setTimeout(() => setBootPhase(2), 2200),
      setTimeout(() => setBootPhase(3), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Terminal line printing effect
  useEffect(() => {
    if (bootPhase < 2) return;
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= initialCodeLines.length) {
          clearInterval(interval);
          return prev;
        }
        audioSystem?.playTypingSound();
        return prev + 1;
      });
    }, 250);
    return () => clearInterval(interval);
  }, [bootPhase]);

  // Once terminal booting ends, make it interactive
  useEffect(() => {
    if (bootPhase === 3 && visibleLines >= initialCodeLines.length) {
      setTerminalLogs(initialCodeLines);
      setInteractive(true);
    }
  }, [bootPhase, visibleLines]);

  // Cursor blink scheduler
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorBlink((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    audioSystem?.playClickSound();
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const focusInput = () => {
    if (interactive && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    audioSystem?.playTypingSound();
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const commandText = inputValue.trim();
    if (!commandText) return;

    // Add command echo to history
    const commandEcho = { text: `guest@portfolio:~$ ${commandText}`, color: "var(--color-pixel-white)" };
    const currentHistory = [...terminalLogs, commandEcho];

    const parts = commandText.toLowerCase().split(" ");
    const cmd = parts[0];
    const arg = parts[1];

    let outputs: { text: string; color: string }[] = [];

    switch (cmd) {
      case "help":
        outputs = [
          { text: "=== COMMAND MANUAL ===", color: "var(--color-pixel-yellow)" },
          { text: "  help      - Show this manual", color: "var(--color-pixel-light)" },
          { text: "  skills    - List character stats & skills", color: "var(--color-pixel-light)" },
          { text: "  quests    - View available quests (projects)", color: "var(--color-pixel-light)" },
          { text: "  theme <t> - Set theme (classic, cyberpunk, vampire, default)", color: "var(--color-pixel-light)" },
          { text: "  clear     - Wipe console screen", color: "var(--color-pixel-light)" },
        ];
        audioSystem?.playTone(440, 'square', 0.08, 0.05);
        break;
      case "skills":
        outputs = [
          { text: "=== CHARACTER SKILLS ===", color: "var(--color-pixel-lime)" },
          { text: "  FRONTEND: React, Astro, TS, JS, CSS", color: "var(--color-pixel-cyan)" },
          { text: "  BACKEND:  Node.js, Express, Java, Spring", color: "var(--color-pixel-cyan)" },
          { text: "  DATABASE: SQL, MongoDB, PostgreSQL", color: "var(--color-pixel-cyan)" },
          { text: "  TOOLS:    Git, Docker, Linux, Cloud", color: "var(--color-pixel-cyan)" },
        ];
        audioSystem?.playTone(440, 'square', 0.08, 0.05);
        break;
      case "quests":
      case "projects":
        outputs = [
          { text: "=== ACTIVE QUEST LOG ===", color: "var(--color-pixel-orange)" },
          { text: "  1. E-Commerce Platform [Rank S]", color: "var(--color-pixel-white)" },
          { text: "  2. Blog MERN Stack [Rank A]", color: "var(--color-pixel-white)" },
          { text: "  * Tip: Scroll down to Quest Log to play!", color: "var(--color-pixel-light)" },
        ];
        audioSystem?.playTone(440, 'square', 0.08, 0.05);
        break;
      case "theme":
        if (arg === "classic" || arg === "gameboy") {
          document.documentElement.setAttribute("data-theme", "gameboy");
          outputs = [{ text: "Game Boy green theme activated!", color: "var(--color-pixel-lime)" }];
        } else if (arg === "cyberpunk" || arg === "neon") {
          document.documentElement.setAttribute("data-theme", "cyberpunk");
          outputs = [{ text: "Cyberpunk retro theme activated!", color: "var(--color-pixel-cyan)" }];
        } else if (arg === "vampire" || arg === "gothic") {
          document.documentElement.setAttribute("data-theme", "vampire");
          outputs = [{ text: "Vampire castle theme activated!", color: "var(--color-pixel-red)" }];
        } else if (arg === "default" || arg === "quest") {
          document.documentElement.removeAttribute("data-theme");
          outputs = [{ text: "Default RPG colors restored!", color: "var(--color-pixel-yellow)" }];
        } else {
          outputs = [
            { text: "Usage: theme [classic | cyberpunk | vampire | default]", color: "var(--color-pixel-red)" }
          ];
        }
        audioSystem?.playPowerUpSound();
        break;
      case "clear":
        setTerminalLogs([]);
        setInputValue("");
        return;
      case "easteregg":
      case "secret":
        audioSystem?.playPowerUpSound();
        setTimeout(() => {
          audioSystem?.playTone(523.25, 'square', 0.15, 0.08);
          audioSystem?.playTone(659.25, 'square', 0.15, 0.08);
          audioSystem?.playTone(783.99, 'square', 0.15, 0.08);
          audioSystem?.playTone(1046.50, 'square', 0.3, 0.12);
        }, 200);
        outputs = [
          { text: "★ LEVEL UP! SECRET QUEST UNLOCKED ★", color: "var(--color-pixel-yellow)" },
          { text: "You found a secret easter egg! Try gushing BGM music!", color: "var(--color-pixel-lime)" },
        ];
        break;
      default:
        outputs = [{ text: `Command not found: '${cmd}'. Type 'help' for options.`, color: "var(--color-pixel-red)" }];
        audioSystem?.playTone(120, 'sawtooth', 0.15, 0.15); // error buzz
    }

    setTerminalLogs([...currentHistory, ...outputs]);
    setInputValue("");

    // Auto scroll to bottom
    setTimeout(() => {
      if (terminalEndRef.current) {
        terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  const { displayed: titleText } = useTypewriter(
    "THANH TRONG'S QUEST",
    100,
    800,
  );

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ paddingTop: "80px", paddingBottom: "60px" }}
    >
      {/* Decorative pixel corners */}
      <div
        className="absolute top-8 left-8 w-8 h-8 border-t-4 border-l-4"
        style={{ borderColor: "var(--color-pixel-yellow)" }}
      />
      <div
        className="absolute top-8 right-8 w-8 h-8 border-t-4 border-r-4"
        style={{ borderColor: "var(--color-pixel-yellow)" }}
      />
      <div
        className="absolute bottom-8 left-8 w-8 h-8 border-b-4 border-l-4"
        style={{ borderColor: "var(--color-pixel-yellow)" }}
      />
      <div
        className="absolute bottom-8 right-8 w-8 h-8 border-b-4 border-r-4"
        style={{ borderColor: "var(--color-pixel-yellow)" }}
      />

      {/* Floating tech icons */}
      <FloatingIcon emoji="⚛" x="10%" y="20%" delay={2} duration={8} />
      <FloatingIcon emoji="🟢" x="85%" y="15%" delay={3.5} duration={9} />
      <FloatingIcon emoji="📦" x="8%" y="70%" delay={5} duration={7} />
      <FloatingIcon emoji="⚡" x="88%" y="65%" delay={1.5} duration={10} />
      <FloatingIcon emoji="🎮" x="15%" y="45%" delay={4} duration={8.5} />
      <FloatingIcon emoji="💾" x="82%" y="42%" delay={6} duration={7.5} />

      {/* Main Title — typewriter */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <p
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(8px, 2vw, 12px)",
            color: "var(--color-pixel-light)",
            marginBottom: "12px",
            letterSpacing: "3px",
          }}
        >
          — WELCOME TO —
        </p>
        <h1
          className="px-4"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "clamp(14px, 3.5vw, 28px)",
            color: "var(--color-pixel-yellow)",
            textShadow: "4px 4px 0 var(--color-pixel-orange), 6px 6px 0 var(--color-pixel-black)",
            lineHeight: "1.8",
            minHeight: "1.8em",
          }}
        >
          {titleText}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{ color: "var(--color-pixel-cyan)" }}
          >
            _
          </motion.span>
        </h1>
      </motion.div>

      {/* CRT Monitor / Terminal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative mb-6 w-full"
        style={{ maxWidth: "480px" }}
      >
        {/* Monitor outer frame */}
        <div
          className="pixel-border relative"
          style={{
            backgroundColor: "var(--color-pixel-blue)",
            padding: "8px",
            margin: "8px",
          }}
        >
          {/* Monitor label */}
          <div
            className="flex items-center justify-between mb-2 px-2"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "6px",
            }}
          >
            <span style={{ color: "var(--color-pixel-gray)" }}>SYSTEM.EXE</span>
            <div className="flex gap-2">
              <span style={{ color: "var(--color-pixel-red)" }}>●</span>
              <span style={{ color: "var(--color-pixel-yellow)" }}>●</span>
              <span style={{ color: "var(--color-pixel-lime)" }}>●</span>
            </div>
          </div>

          {/* Screen */}
          <div
            onClick={focusInput}
            style={{
              backgroundColor: "#0d1117",
              border: "3px solid var(--color-pixel-dark)",
              padding: "16px",
              minHeight: "220px",
              maxHeight: "300px",
              position: "relative",
              overflowY: "auto",
              cursor: interactive ? "text" : "default",
            }}
            className="custom-scrollbar"
          >
            {/* CRT scanline effect inside screen */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 3px)",
                pointerEvents: "none",
                zIndex: 2,
              }}
            />

            {/* Screen content */}
            <div style={{ position: "relative", zIndex: 1 }}>
              {/* Boot phase 1: Loading bars */}
              <AnimatePresence>
                {bootPhase === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p
                      className="mb-4"
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: "8px",
                        color: "var(--color-pixel-lime)",
                      }}
                    >
                      BOOTING SYSTEM...
                    </p>
                    <LoadingBar
                      label="STR"
                      value={85}
                      color="var(--color-pixel-red)"
                      delay={100}
                    />
                    <LoadingBar
                      label="INT"
                      value={92}
                      color="var(--color-pixel-cyan)"
                      delay={300}
                    />
                    <LoadingBar
                      label="DEX"
                      value={78}
                      color="var(--color-pixel-lime)"
                      delay={500}
                    />
                    <LoadingBar
                      label="WIS"
                      value={88}
                      color="var(--color-pixel-yellow)"
                      delay={700}
                    />
                    <LoadingBar
                      label="CHA"
                      value={80}
                      color="var(--color-pixel-orange)"
                      delay={900}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Boot phase 2+: Terminal Logs & Command Line */}
              {bootPhase >= 2 && (
                <div className="text-left font-mono">
                  {/* Boot Sequence Line Output */}
                  {bootPhase === 2 && (
                    <>
                      {initialCodeLines.slice(0, visibleLines).map((line, i) => (
                        <p
                          key={i}
                          style={{
                            fontFamily: "'VT323', monospace",
                            fontSize: "16px",
                            color: line.color,
                            lineHeight: "1.6",
                          }}
                        >
                          {line.text}
                        </p>
                      ))}
                      {visibleLines < initialCodeLines.length && (
                        <span
                          style={{
                            fontFamily: "'VT323', monospace",
                            fontSize: "16px",
                            color: "var(--color-pixel-lime)",
                            opacity: cursorBlink ? 1 : 0,
                          }}
                        >
                          █
                        </span>
                      )}
                    </>
                  )}

                  {/* Fully Interactive Shell Logs */}
                  {interactive && (
                    <>
                      {terminalLogs.map((log, i) => (
                        <p
                          key={i}
                          style={{
                            fontFamily: "'VT323', monospace",
                            fontSize: "16px",
                            color: log.color,
                            lineHeight: "1.5",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {log.text}
                        </p>
                      ))}
                      {/* Active Input Line */}
                      <form onSubmit={handleCommandSubmit} className="flex items-center mt-1">
                        <span
                          className="mr-2 text-[var(--color-pixel-lime)]"
                          style={{
                            fontFamily: "'VT323', monospace",
                            fontSize: "16px",
                          }}
                        >
                          guest@portfolio:~$
                        </span>
                        <input
                          ref={inputRef}
                          type="text"
                          value={inputValue}
                          onChange={handleInputChange}
                          className="bg-transparent border-none outline-none flex-1 text-[var(--color-pixel-white)] select-text"
                          style={{
                            fontFamily: "'VT323', monospace",
                            fontSize: "16px",
                            caretColor: "var(--color-pixel-lime)",
                          }}
                          maxLength={40}
                          autoFocus
                        />
                      </form>
                    </>
                  )}
                  <div ref={terminalEndRef} />
                </div>
              )}

              {/* Initial boot state */}
              {bootPhase === 0 && (
                <motion.p
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: "8px",
                    color: "var(--color-pixel-gray)",
                    textAlign: "center",
                    paddingTop: "80px",
                  }}
                >
                  INITIALIZING...
                </motion.p>
              )}
            </div>

            {/* Screen glow — subtle */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                boxShadow: "inset 0 0 60px rgba(115, 239, 247, 0.05)",
                pointerEvents: "none",
                zIndex: 3,
              }}
            />
          </div>

          {/* Monitor base */}
          <div className="flex justify-center mt-2">
            <div
              style={{
                width: "60px",
                height: "4px",
                backgroundColor: "var(--color-pixel-gray)",
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Player info card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="text-center mb-8"
      >
        <div
          className="inline-flex items-center gap-3 px-6 py-3"
          style={{
            backgroundColor: "var(--color-pixel-blue)",
            border: "2px solid var(--color-pixel-indigo)",
          }}
        >
          {/* Animated Mini avatar pixel */}
          <div
            style={{
              width: "28px",
              height: "28px",
              backgroundColor: "var(--color-pixel-dark)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <motion.div
              animate={{
                y: [0, -1.5, 0],
                scaleY: [1, 0.95, 1],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                viewBox="0 0 8 8"
                width="20"
                height="20"
                style={{ imageRendering: "pixelated" }}
              >
                <rect x="2" y="0" width="4" height="2" fill="var(--color-pixel-dark)" />
                <rect x="1" y="2" width="6" height="2" fill="var(--color-pixel-orange)" />
                <rect x="2" y="2" width="1" height="1" fill="var(--color-pixel-black)" />
                <rect x="5" y="2" width="1" height="1" fill="var(--color-pixel-black)" />
                <rect x="1" y="4" width="6" height="2" fill="var(--color-pixel-indigo)" />
                <rect x="2" y="6" width="2" height="2" fill="var(--color-pixel-blue)" />
                <rect x="4" y="6" width="2" height="2" fill="var(--color-pixel-blue)" />
              </svg>
            </motion.div>
          </div>

          <div className="text-left">
            <p
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "9px",
                color: "var(--color-pixel-yellow)",
                marginBottom: "2px",
              }}
            >
              VO THANH TRONG
            </p>
            <p
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: "16px",
                color: "var(--color-pixel-lime)",
                letterSpacing: "1px",
              }}
            >
              IT Engineer • Full Stack Dev
            </p>
          </div>

          {/* Status indicator */}
          <div className="flex flex-col items-center ml-2">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "var(--color-pixel-lime)",
                borderRadius: "1px",
              }}
            />
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "5px",
                color: "var(--color-pixel-lime)",
                marginTop: "2px",
              }}
            >
              ONLINE
            </span>
          </div>
        </div>
      </motion.div>

      {/* Start Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.0 }}
        className="mb-16 md:mb-20"
      >
        <button
          onClick={handleStart}
          onMouseEnter={() => audioSystem?.playHoverSound()}
          className="pixel-btn pixel-border"
          style={{ opacity: showStart ? 1 : 0.3, margin: "8px" }}
          id="start-adventure-btn"
        >
          ▶ START ADVENTURE
        </button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 md:bottom-8"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "8px",
          color: "var(--color-pixel-gray)",
        }}
      >
        ▼ SCROLL ▼
      </motion.div>
    </section>
  );
}
