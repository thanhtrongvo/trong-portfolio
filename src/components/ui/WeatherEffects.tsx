import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  angle: number;
  spinSpeed: number;
  phase: number;
  color: string;
}

export default function WeatherEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeWeather, setActiveWeather] = useState<'stars' | 'leaves' | 'coins' | 'hearts'>('stars');
  
  // Theme colors fetched dynamically
  const colorsRef = useRef({
    white: '#f4f4f4',
    green: '#38b764',
    yellow: '#ffcd75',
    red: '#b13e53',
    cyan: '#73eff7',
  });

  // Load color values from document styling
  const updateColors = () => {
    const rootStyles = getComputedStyle(document.documentElement);
    colorsRef.current = {
      white: rootStyles.getPropertyValue('--color-pixel-white').trim() || '#f4f4f4',
      green: rootStyles.getPropertyValue('--color-pixel-lime').trim() || '#a7f070',
      yellow: rootStyles.getPropertyValue('--color-pixel-yellow').trim() || '#ffcd75',
      red: rootStyles.getPropertyValue('--color-pixel-red').trim() || '#b13e53',
      cyan: rootStyles.getPropertyValue('--color-pixel-cyan').trim() || '#73eff7',
    };
  };

  useEffect(() => {
    updateColors();

    // Listen to theme adjustments on the html node
    const observer = new MutationObserver(() => {
      updateColors();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // Detect active section on scroll
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id === 'hero') setActiveWeather('stars');
            else if (id === 'about') setActiveWeather('leaves');
            else if (id === 'projects') setActiveWeather('coins');
            else if (id === 'contact') setActiveWeather('hearts');
          }
        });
      },
      { threshold: 0.35 }
    );

    const sections = ['hero', 'about', 'projects', 'contact'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    return () => {
      observer.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    const maxParticles = 60;

    // Resize handler
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Helper to spawn a new particle
    const createParticle = (initYAtBottom = false): Particle => {
      const size = Math.floor(Math.random() * 4) + 4; // 4 to 8px
      const x = Math.random() * canvas.width;
      
      let y = 0;
      let speedY = 0;
      let speedX = 0;
      let color = colorsRef.current.white;

      switch (activeWeather) {
        case 'stars':
          y = initYAtBottom ? Math.random() * canvas.height : -10;
          speedY = Math.random() * 0.4 + 0.1;
          speedX = Math.random() * 0.2 - 0.1;
          color = Math.random() > 0.5 ? colorsRef.current.white : colorsRef.current.cyan;
          break;
        case 'leaves':
          y = initYAtBottom ? Math.random() * canvas.height : -10;
          speedY = Math.random() * 0.8 + 0.6; // fall down
          speedX = Math.random() * 0.4 - 0.2;
          color = colorsRef.current.green;
          break;
        case 'coins':
          // coins rise up
          y = initYAtBottom ? Math.random() * canvas.height : canvas.height + 10;
          speedY = -(Math.random() * 0.8 + 0.5);
          speedX = Math.random() * 0.4 - 0.2;
          color = colorsRef.current.yellow;
          break;
        case 'hearts':
          // hearts rise up
          y = initYAtBottom ? Math.random() * canvas.height : canvas.height + 10;
          speedY = -(Math.random() * 0.6 + 0.4);
          speedX = Math.random() * 0.3 - 0.15;
          color = colorsRef.current.red;
          break;
      }

      return {
        x,
        y,
        size,
        speedY,
        speedX,
        opacity: Math.random() * 0.6 + 0.3,
        angle: Math.random() * Math.PI * 2,
        spinSpeed: Math.random() * 0.05 - 0.025,
        phase: Math.random() * Math.PI * 2,
        color,
      };
    };

    // Populate particles initially
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }

    let time = 0;

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update each particle
      particles.forEach((p, idx) => {
        p.angle += p.spinSpeed;

        // Apply path sways depending on type
        if (activeWeather === 'leaves') {
          // Leaves flutter sway
          p.x += Math.sin(time + p.phase) * 0.6 + p.speedX;
          p.y += p.speedY;
        } else if (activeWeather === 'hearts') {
          // Hearts float sway
          p.x += Math.sin(time * 0.8 + p.phase) * 0.4 + p.speedX;
          p.y += p.speedY;
        } else if (activeWeather === 'coins') {
          p.x += p.speedX;
          p.y += p.speedY;
        } else {
          // Stars twinkling
          p.x += p.speedX;
          p.y += p.speedY;
          p.opacity = 0.3 + Math.abs(Math.sin(time * 2 + p.phase)) * 0.7;
        }

        // Draw particle based on active weather type
        ctx.save();
        ctx.globalAlpha = p.opacity;

        if (activeWeather === 'stars') {
          // Draw standard pixel star (cross or dot)
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size / 2, p.size / 2);
        } else if (activeWeather === 'leaves') {
          // Draw pixelated falling leaf
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.fillStyle = colorsRef.current.green;
          
          const s = p.size / 2;
          ctx.fillRect(-s, -s / 2, s * 2, s);
          ctx.fillRect(-s / 2, -s, s, s * 2);
        } else if (activeWeather === 'coins') {
          // Draw spinning golden pixel coins
          ctx.translate(p.x, p.y);
          ctx.scale(Math.sin(p.angle * 2), 1); // spin scaling
          ctx.fillStyle = colorsRef.current.yellow;
          
          const s = p.size;
          ctx.fillRect(-s / 2, -s / 2, s, s);
          // dark shadow details
          ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
          ctx.fillRect(-s / 4, -s / 4, s / 2, s / 2);
        } else if (activeWeather === 'hearts') {
          // Draw tiny pixelated heart
          ctx.translate(p.x, p.y);
          ctx.fillStyle = colorsRef.current.red;
          
          const s = Math.max(1, Math.round(p.size / 5)); // pixel grid scale
          ctx.fillRect(-2 * s, -2 * s, s, s);
          ctx.fillRect(0, -2 * s, s, s);
          ctx.fillRect(-3 * s, -s, 3 * s, s);
          ctx.fillRect(s, -s, 2 * s, s);
          ctx.fillRect(-3 * s, 0, 7 * s, s);
          ctx.fillRect(-2 * s, s, 5 * s, s);
          ctx.fillRect(-s, 2 * s, 3 * s, s);
          ctx.fillRect(0, 3 * s, s, s);
        }

        ctx.restore();

        // Recycle particles out of bounds
        const isOutOfBounds =
          p.x < -20 ||
          p.x > canvas.width + 20 ||
          (p.speedY > 0 && p.y > canvas.height + 20) ||
          (p.speedY < 0 && p.y < -20);

        if (isOutOfBounds) {
          particles[idx] = createParticle(false);
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [activeWeather]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
