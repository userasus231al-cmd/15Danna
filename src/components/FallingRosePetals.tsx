import React, { useEffect, useRef } from 'react';

interface FallingRosePetalsProps {
  active?: boolean;
  className?: string;
  petalCount?: number;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  swaySpeed: number;
  swayOffset: number;
  swayRadius: number;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  color: string;
  colorEdge: string;
  opacity: number;
}

const PETAL_PALETTES = [
  { color: '#fff1f2', colorEdge: '#fbcfe8' }, // very light blush pink
  { color: '#fdf2f8', colorEdge: '#f9a8d4' }, // pastel petal pink
  { color: '#ffe4e6', colorEdge: '#fecdd3' }, // light rose
  { color: '#fce7f3', colorEdge: '#f9a8d4' }, // fairy soft pink
  { color: '#fff5f7', colorEdge: '#fda4af' }, // soft baby pink
];

export const FallingRosePetals: React.FC<FallingRosePetalsProps> = ({
  active = true,
  className = '',
  petalCount = 14
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const petalsRef = useRef<Petal[]>([]);
  const fadeAlphaRef = useRef<number>(active ? 1 : 0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const updateDimensions = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    resizeObserver.observe(canvas);

    // Initialize petals distributed randomly across the canvas
    const createPetal = (spawnAbove = false): Petal => {
      const palette = PETAL_PALETTES[Math.floor(Math.random() * PETAL_PALETTES.length)];
      const size = Math.random() * 2.5 + 4.5; // Small & delicate: 4.5px to 7px
      return {
        x: Math.random() * (width || 400),
        y: spawnAbove ? -Math.random() * 40 - 15 : Math.random() * (height || 600),
        size,
        speedY: Math.random() * 0.6 + 0.45, // Gentle fluttering speed
        swaySpeed: Math.random() * 0.02 + 0.015,
        swayOffset: Math.random() * Math.PI * 2,
        swayRadius: Math.random() * 1.0 + 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        flip: Math.random() * Math.PI * 2,
        flipSpeed: Math.random() * 0.025 + 0.015,
        color: palette.color,
        colorEdge: palette.colorEdge,
        opacity: Math.random() * 0.25 + 0.65 // 0.65 to 0.90
      };
    };

    petalsRef.current = Array.from({ length: petalCount }, () => createPetal(false));

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth fade transition based on active state
      const targetFade = active ? 1 : 0;
      fadeAlphaRef.current += (targetFade - fadeAlphaRef.current) * Math.min(dt * 4, 1);

      ctx.clearRect(0, 0, width, height);

      if (fadeAlphaRef.current > 0.01) {
        const currentFade = fadeAlphaRef.current;

        for (let i = 0; i < petalsRef.current.length; i++) {
          const p = petalsRef.current[i];

          // Physics update
          p.y += p.speedY;
          p.x += Math.sin(p.swayOffset + time * 0.002 * p.swaySpeed * 100) * p.swayRadius;
          p.rotation += p.rotationSpeed;
          p.flip += p.flipSpeed;

          // Recycle when petal reaches below bottom of canvas
          if (p.y > height + 25) {
            petalsRef.current[i] = createPetal(true);
            continue;
          }

          // Also wrap horizontally if blown too far sideways
          if (p.x < -30) p.x = width + 20;
          if (p.x > width + 30) p.x = -20;

          // Draw organic rose petal
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);

          // 3D turnover flutter simulation
          const flipScale = Math.cos(p.flip);
          ctx.scale(flipScale, 1);

          // Petal delicate gradient (pure light pink tones)
          const grad = ctx.createLinearGradient(0, -p.size, 0, p.size);
          grad.addColorStop(0, p.color);
          grad.addColorStop(0.65, p.colorEdge);
          grad.addColorStop(1, '#f472b6'); // soft light pink petal edge

          ctx.fillStyle = grad;
          ctx.globalAlpha = p.opacity * currentFade;

          // Organic curved rose petal shape
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          // Left petal lobe
          ctx.bezierCurveTo(-p.size * 0.85, -p.size * 0.7, -p.size * 0.95, p.size * 0.35, 0, p.size);
          // Right petal lobe
          ctx.bezierCurveTo(p.size * 0.95, p.size * 0.35, p.size * 0.85, -p.size * 0.7, 0, -p.size);
          ctx.closePath();
          ctx.fill();

          // Delicate vein light reflection highlight down the center
          if (Math.abs(flipScale) > 0.3) {
            ctx.beginPath();
            ctx.moveTo(0, -p.size * 0.65);
            ctx.quadraticCurveTo(p.size * 0.1, 0, 0, p.size * 0.75);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = Math.max(0.6, p.size * 0.07);
            ctx.stroke();
          }

          ctx.restore();
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [active, petalCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-30 ${className}`}
      style={{ opacity: active ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}
      aria-hidden="true"
    />
  );
};
