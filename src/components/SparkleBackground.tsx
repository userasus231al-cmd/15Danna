import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export const SparkleBackground: React.FC<{ glowColor?: string }> = ({ glowColor = 'rgba(251, 191, 36, 0.15)' }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 32 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 5 + 4,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.7 + 0.3
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Ambient background glows */}
      <div
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[140px] opacity-40 transition-all duration-1000"
        style={{ backgroundColor: glowColor }}
      />
      <div
        className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[160px] opacity-30 transition-all duration-1000"
        style={{ backgroundColor: glowColor }}
      />
      <div
        className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full blur-[160px] opacity-30 transition-all duration-1000"
        style={{ backgroundColor: glowColor }}
      />

      {/* Floating Sparkle Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: '#fffbeb',
            boxShadow: `0 0 ${p.size * 3}px 1px rgba(254, 240, 138, 0.8)`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity
          }}
        />
      ))}
    </div>
  );
};
