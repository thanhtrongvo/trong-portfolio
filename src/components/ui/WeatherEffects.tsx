import { useEffect, useRef, useState } from 'react';

// ── Types ─────────────────────────────────────────────────────
type WeatherType = 'stars' | 'leaves' | 'coins' | 'hearts';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  targetOpacity: number;
  angle: number;
  spinSpeed: number;
  phase: number;
  color: string;
  layer: 0 | 1 | 2; // 0=far, 1=mid, 2=near
  weather: WeatherType;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

// ── Parallax Layer Config ─────────────────────────────────────
// Layer 0 (far):  slow, small, faint
// Layer 1 (mid):  medium everything
// Layer 2 (near): fast, large, bright
const LAYER_CONFIG = [
  { speedMul: 0.22, sizeMul: 0.45, opacityBase: 0.28, parallaxMul: 0.25 },
  { speedMul: 0.55, sizeMul: 0.72, opacityBase: 0.55, parallaxMul: 0.55 },
  { speedMul: 1.00, sizeMul: 1.00, opacityBase: 0.88, parallaxMul: 1.00 },
] as const;

const PER_LAYER = 22; // 22 particles × 3 layers = 66 total

// ── Component ─────────────────────────────────────────────────
export default function WeatherEffects() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const weatherRef   = useRef<WeatherType>('stars');
  const mouseRef     = useRef({ x: 0, y: 0 });
  const offsetRef    = useRef({ x: 0, y: 0 }); // smooth mouse parallax offset

  const [activeWeather, setActiveWeather] = useState<WeatherType>('stars');

  const colorsRef = useRef({
    white:  '#f4f4f4',
    lime:   '#a7f070',
    yellow: '#ffcd75',
    red:    '#b13e53',
    cyan:   '#73eff7',
  });

  // ── Sync CSS custom properties → colorsRef ─────────────────
  const updateColors = () => {
    const root = getComputedStyle(document.documentElement);
    const g = (v: string, fb: string) => root.getPropertyValue(v).trim() || fb;
    colorsRef.current = {
      white:  g('--color-pixel-white',  '#f4f4f4'),
      lime:   g('--color-pixel-lime',   '#a7f070'),
      yellow: g('--color-pixel-yellow', '#ffcd75'),
      red:    g('--color-pixel-red',    '#b13e53'),
      cyan:   g('--color-pixel-cyan',   '#73eff7'),
    };
  };

  // ── Observers: theme + section scroll ──────────────────────
  useEffect(() => {
    updateColors();

    const themeObs = new MutationObserver(updateColors);
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    const sectionObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const w: WeatherType =
              id === 'about'    ? 'leaves' :
              id === 'projects' ? 'coins'  :
              id === 'contact'  ? 'hearts' : 'stars';
            setActiveWeather(w);
          }
        });
      },
      { threshold: 0.35 }
    );

    ['hero', 'about', 'projects', 'contact'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObs.observe(el);
    });

    // Mouse position tracker for parallax
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      themeObs.disconnect();
      sectionObs.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  // Keep weatherRef in sync (read inside animation loop)
  useEffect(() => {
    weatherRef.current = activeWeather;
  }, [activeWeather]);

  // ── Main canvas animation — set up ONCE ────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;
    let shootingStarTimer = 250; // start already ready to fire
    let shootingStars: ShootingStar[] = [];
    let particles: Particle[] = [];

    // ── Canvas resize ─────────────────────────────────────────
    const resizeCanvas = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // ── Particle factory ──────────────────────────────────────
    const mkParticle = (
      weather: WeatherType,
      layer: 0 | 1 | 2,
      spread = false
    ): Particle => {
      const cfg  = LAYER_CONFIG[layer];
      const base = Math.floor(Math.random() * 5) + 3; // 3–7px base
      const size = Math.max(2, Math.round(base * cfg.sizeMul));
      const x    = Math.random() * canvas.width;
      const c    = colorsRef.current;

      let y = 0, speedY = 0, speedX = 0, color = c.white;

      if (weather === 'stars') {
        y      = spread ? Math.random() * canvas.height : -20;
        speedY = (Math.random() * 0.3 + 0.07) * cfg.speedMul;
        speedX = (Math.random() * 0.14 - 0.07) * cfg.speedMul;
        color  = Math.random() > 0.5 ? c.white : c.cyan;

      } else if (weather === 'leaves') {
        y      = spread ? Math.random() * canvas.height : -20;
        speedY = (Math.random() * 0.9 + 0.5) * cfg.speedMul;
        speedX = (Math.random() * 0.3 - 0.15) * cfg.speedMul;
        color  = Math.random() > 0.4 ? c.lime : '#5dbb3a';

      } else if (weather === 'coins') {
        y      = spread ? Math.random() * canvas.height : canvas.height + 20;
        speedY = -(Math.random() * 0.75 + 0.45) * cfg.speedMul;
        speedX = (Math.random() * 0.28 - 0.14) * cfg.speedMul;
        color  = Math.random() > 0.4 ? c.yellow : '#ffa040';

      } else { // hearts
        y      = spread ? Math.random() * canvas.height : canvas.height + 20;
        speedY = -(Math.random() * 0.55 + 0.3) * cfg.speedMul;
        speedX = (Math.random() * 0.24 - 0.12) * cfg.speedMul;
        color  = Math.random() > 0.5 ? c.red : '#ff6688';
      }

      const targetOpacity = cfg.opacityBase * (Math.random() * 0.35 + 0.65);
      return {
        x, y, size, speedY, speedX,
        opacity:       spread ? targetOpacity : 0, // fade-in when newly spawned
        targetOpacity,
        angle:     Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() * 0.07 - 0.035) * cfg.speedMul,
        phase:     Math.random() * Math.PI * 2,
        color, layer, weather,
      };
    };

    // ── Initial particles spread across screen ────────────────
    for (let l = 0; l < 3; l++) {
      for (let i = 0; i < PER_LAYER; i++) {
        particles.push(mkParticle('stars', l as 0 | 1 | 2, true));
      }
    }

    // ── Shooting star factory ─────────────────────────────────
    const mkShootingStar = (): ShootingStar => {
      const angle = Math.PI / 4 + (Math.random() * 0.35 - 0.175);
      const speed = Math.random() * 10 + 8;
      return {
        x:       Math.random() * canvas.width * 0.65,
        y:       Math.random() * canvas.height * 0.35,
        vx:      Math.cos(angle) * speed,
        vy:      Math.sin(angle) * speed,
        life:    0,
        maxLife: Math.floor(Math.random() * 25) + 16,
      };
    };

    // ── Draw: static dot grid with parallax (PA1) ─────────────
    const drawDotGrid = () => {
      const gs = 24;
      const ox = ((offsetRef.current.x * 0.1) % gs + gs) % gs;
      const oy = ((offsetRef.current.y * 0.1) % gs + gs) % gs;
      ctx.fillStyle = 'rgba(115,239,247,0.032)';
      ctx.beginPath();
      for (let gx = ox - gs; gx <= canvas.width + gs; gx += gs) {
        for (let gy = oy - gs; gy <= canvas.height + gs; gy += gs) {
          ctx.rect(Math.round(gx), Math.round(gy), 1, 1);
        }
      }
      ctx.fill();
    };

    // ── Draw: CRT scanline overlay (PA2) ─────────────────────
    const drawScanlines = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.028)';
      ctx.beginPath();
      for (let sy = 0; sy < canvas.height; sy += 4) {
        ctx.rect(0, sy, canvas.width, 1);
      }
      ctx.fill();
    };

    // ── Draw: pixel vignette corners (PA2) ───────────────────
    const drawVignette = () => {
      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.height * 0.18,
        canvas.width / 2, canvas.height / 2, canvas.height * 0.88
      );
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.44)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // ── Draw: improved star — "+" cross with twinkle (PA2) ───
    const drawStar = (p: Particle, t: number) => {
      ctx.save();
      const twinkle = 0.32 + Math.abs(Math.sin(t * 1.8 + p.phase)) * 0.68;
      ctx.globalAlpha = p.opacity * twinkle;
      ctx.fillStyle = p.color;
      // Horizontal arm
      ctx.fillRect(p.x - p.size, p.y, p.size * 2 + 1, 1);
      // Vertical arm
      ctx.fillRect(p.x, p.y - p.size, 1, p.size * 2 + 1);
      // Bright center pixel
      ctx.globalAlpha = p.opacity * twinkle * 0.9;
      ctx.fillStyle   = '#ffffff';
      ctx.fillRect(p.x, p.y, 1, 1);
      ctx.restore();
    };

    // ── Draw: improved leaf — rotated with vein (PA2) ────────
    const drawLeaf = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle   = p.color;
      const s = Math.max(1, Math.floor(p.size / 2));
      ctx.fillRect(-s, -Math.ceil(s / 2), s * 2, s);
      ctx.fillRect(-Math.ceil(s / 2), -s, s, s * 2);
      // Center vein
      ctx.fillStyle   = 'rgba(0,0,0,0.22)';
      ctx.fillRect(0, -Math.floor(s / 2), 1, s);
      ctx.restore();
    };

    // ── Draw: improved coin — 3D spin via scaleX (PA2) ───────
    const drawCoin = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      const spinX = Math.sin(p.angle * 2.8);
      ctx.scale(Math.abs(spinX) < 0.04 ? 0.04 : spinX, 1);
      ctx.globalAlpha = p.opacity;
      const s = Math.max(2, p.size);
      // Body
      ctx.fillStyle = p.color;
      ctx.fillRect(-Math.ceil(s / 2), -Math.ceil(s / 2), s, s);
      // Rim highlight (only when facing us)
      if (spinX > 0.2) {
        ctx.globalAlpha = p.opacity * 0.45;
        ctx.fillStyle   = '#ffffff';
        ctx.fillRect(-Math.ceil(s / 2), -Math.ceil(s / 2), Math.max(1, Math.round(s / 4)), s);
      }
      // Shadow
      ctx.globalAlpha = p.opacity * 0.28;
      ctx.fillStyle   = '#000000';
      ctx.fillRect(Math.round(s / 4), -Math.ceil(s / 2), Math.max(1, Math.round(s / 4)), s);
      ctx.restore();
    };

    // ── Draw: improved heart — pulse scale (PA2) ─────────────
    const drawHeart = (p: Particle, t: number) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      const pulse = 1 + Math.sin(t * 2.2 + p.phase) * 0.09;
      ctx.scale(pulse, pulse);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle   = p.color;
      const s = Math.max(1, Math.round(p.size / 5));
      ctx.fillRect(-2 * s, -2 * s, s, s);
      ctx.fillRect( 0,     -2 * s, s, s);
      ctx.fillRect(-3 * s, -1 * s, 3 * s, s);
      ctx.fillRect( 1 * s, -1 * s, 2 * s, s);
      ctx.fillRect(-3 * s,  0,     7 * s, s);
      ctx.fillRect(-2 * s,  1 * s, 5 * s, s);
      ctx.fillRect(-1 * s,  2 * s, 3 * s, s);
      ctx.fillRect( 0,      3 * s, s, s);
      ctx.restore();
    };

    // ── Main animation loop ───────────────────────────────────
    const animate = () => {
      time += 0.012;
      shootingStarTimer++;

      const weather = weatherRef.current;

      // ── Lerp mouse parallax offset smoothly ──────────────
      const tox = (mouseRef.current.x / (window.innerWidth  || 1) - 0.5) * 24;
      const toy = (mouseRef.current.y / (window.innerHeight || 1) - 0.5) * 24;
      offsetRef.current.x += (tox - offsetRef.current.x) * 0.04;
      offsetRef.current.y += (toy - offsetRef.current.y) * 0.04;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ── Layer 0: Dot grid (PA1) ───────────────────────────
      drawDotGrid();

      // ── Shooting stars — stars section only (PA1) ─────────
      if (weather === 'stars') {
        if (shootingStarTimer > 220 && Math.random() < 0.022) {
          shootingStars.push(mkShootingStar());
          shootingStarTimer = 0;
        }
        shootingStars = shootingStars.filter(s => s.life < s.maxLife);
        for (const s of shootingStars) {
          ctx.save();
          const prog = s.life / s.maxLife;
          // Trail
          ctx.globalAlpha = (1 - prog) * 0.8;
          ctx.strokeStyle = '#f4f4f4';
          ctx.lineWidth   = 1;
          ctx.beginPath();
          const trailLen = 14 * (1 - prog * 0.5);
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - s.vx * trailLen / 10, s.y - s.vy * trailLen / 10);
          ctx.stroke();
          // Head dot
          ctx.globalAlpha = (1 - prog) * 0.95;
          ctx.fillStyle   = '#ffffff';
          ctx.fillRect(Math.round(s.x), Math.round(s.y), 2, 2);
          ctx.restore();
          s.x += s.vx;
          s.y += s.vy;
          s.life++;
        }
      } else {
        shootingStars = [];
      }

      // ── Particles — drawn far → near for depth (PA1) ──────
      for (let layerIdx = 0; layerIdx < 3; layerIdx++) {
        // Per-layer parallax displacement (far layer moves less)
        const paralMul = LAYER_CONFIG[layerIdx].parallaxMul;
        const lox = offsetRef.current.x * paralMul * 0.4;
        const loy = offsetRef.current.y * paralMul * 0.4;

        for (const p of particles) {
          if (p.layer !== layerIdx) continue;

          // ── Smooth morph: PA2 — fade old, respawn new ────
          if (p.weather !== weather) {
            p.targetOpacity = 0;
          }
          p.opacity += (p.targetOpacity - p.opacity) * 0.035;

          if (p.weather !== weather && p.opacity < 0.012) {
            const np = mkParticle(weather, p.layer, false);
            Object.assign(p, np);
            continue;
          }

          // ── Movement per weather type ─────────────────────
          if (p.weather === 'leaves') {
            p.x     += Math.sin(time * 1.3 + p.phase) * 0.72 + p.speedX;
            p.y     += p.speedY;
            p.angle += p.spinSpeed;
          } else if (p.weather === 'hearts') {
            p.x += Math.sin(time * 0.95 + p.phase) * 0.55 + p.speedX;
            p.y += p.speedY;
          } else if (p.weather === 'coins') {
            p.x     += p.speedX;
            p.y     += p.speedY;
            p.angle += p.spinSpeed * 2.6;
          } else { // stars
            p.x += p.speedX;
            p.y += p.speedY;
          }

          // ── Recycle out-of-bounds ─────────────────────────
          const out =
            p.x < -40 || p.x > canvas.width + 40 ||
            (p.speedY > 0 && p.y > canvas.height + 40) ||
            (p.speedY < 0 && p.y < -40);
          if (out) {
            const np = mkParticle(weather, p.layer, false);
            Object.assign(p, np);
            continue;
          }

          // ── Draw at parallax-offset position ─────────────
          const drawP = { ...p, x: p.x + lox, y: p.y + loy };
          if      (p.weather === 'stars')  drawStar(drawP, time);
          else if (p.weather === 'leaves') drawLeaf(drawP);
          else if (p.weather === 'coins')  drawCoin(drawP);
          else if (p.weather === 'hearts') drawHeart(drawP, time);
        }
      }

      // ── Screen overlays — no parallax (PA2) ───────────────
      ctx.globalAlpha = 1;
      drawScanlines();
      drawVignette();

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, []); // run once — reads weather via ref

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
