import React, { useState, useEffect } from 'react';
import { Crown, Sparkles } from 'lucide-react';
import { ThemeStyle } from '../types';
import vintageRoseImage from '../assets/images/vintage_pink_rose_crest_1788045608311.jpg';

interface CountdownTimerProps {
  targetDate: string;
  themeStyle?: ThemeStyle;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isPast: false
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: 'DÍAS', value: timeLeft.days },
    { label: 'HORAS', value: timeLeft.hours },
    { label: 'MINUTOS', value: timeLeft.minutes },
    { label: 'SEGUNDOS', value: timeLeft.seconds }
  ];

  return (
    <section id="countdown-section" className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Outer Fairytale Parchment Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#fef5f7] via-[#faebef] to-[#f6e1e7] border-2 border-[#eec2cf] p-6 sm:p-8 md:p-10 shadow-2xl shadow-black/50 text-center">
        {/* Subtle decorative background rose bouquet illustrations */}
        <img
          src={vintageRoseImage}
          alt="Rosa Decorativa"
          className="absolute -top-10 -left-10 w-32 h-32 opacity-25 pointer-events-none object-cover rotate-[-20deg]"
        />
        <img
          src={vintageRoseImage}
          alt="Rosa Decorativa"
          className="absolute -bottom-10 -right-10 w-32 h-32 opacity-25 pointer-events-none object-cover rotate-[160deg]"
        />

        {/* Golden Crown Icon */}
        <div className="flex justify-center mb-1 relative z-10">
          <Crown className="w-5 h-5 text-amber-500 fill-amber-400/40 drop-shadow-sm" />
        </div>

        {/* Section Header: ✦ FALTAN ✦ */}
        <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8 relative z-10">
          <span className="text-[#a4667a] text-xs font-serif">✦</span>
          <h2 className="text-sm sm:text-base md:text-lg font-cinzel font-bold text-[#7d3c52] tracking-[0.3em] uppercase">
            FALTAN
          </h2>
          <span className="text-[#a4667a] text-xs font-serif">✦</span>
        </div>

        {/* 4 Circular Pink Counters (Exact replica from reference image) */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 relative z-10 max-w-2xl mx-auto">
          {units.map((unit, idx) => (
            <div key={idx} className="flex flex-col items-center">
              {/* Outer Circular Ring with subtle glow */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full p-[2.5px] bg-gradient-to-b from-[#e89db4] via-[#f7cbd7] to-[#d87c98] shadow-md shadow-[#9c4c68]/15 flex items-center justify-center group hover:scale-105 transition-transform duration-300">
                {/* Inner Pink Circle Container */}
                <div className="w-full h-full rounded-full bg-gradient-to-b from-[#fff8fa] to-[#fce4ec] flex flex-col items-center justify-center border border-[#eec2cf]">
                  <span className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#68243a] tracking-tight leading-none">
                    {String(unit.value).padStart(2, '0')}
                  </span>
                </div>
              </div>
              {/* Text Label below the circle */}
              <span className="text-[10px] sm:text-xs md:text-xs font-cinzel font-semibold text-[#8a4a5e] tracking-widest mt-2 uppercase">
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        {timeLeft.isPast && (
          <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#e89db4]/20 border border-[#e89db4]/40 text-[#7d3c52] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>¡La fiesta ha comenzado!</span>
          </div>
        )}
      </div>
    </section>
  );
};
