import React from 'react';
import { motion } from 'motion/react';
import { Crown, Sparkles, ChevronDown, Volume2, VolumeX, Music, Heart } from 'lucide-react';
import { InvitationData } from '../types';
import heroCastleImage from '../assets/images/fairytale_princess_castle_1788045594056.jpg';

interface HeroSectionProps {
  data: InvitationData;
  onNavigateTo: (sectionId: string) => void;
  isPlayingMusic?: boolean;
  onToggleMusic?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  data,
  onNavigateTo,
  isPlayingMusic = false,
  onToggleMusic
}) => {
  const displayImage = data.heroPhotoUrl || heroCastleImage;

  return (
    <section id="hero-section" className="relative min-h-[90vh] sm:min-h-[95vh] flex flex-col items-center justify-between text-center overflow-hidden pb-12 pt-6 px-4">
      {/* Background artwork: Fairytale Castle & Princess */}
      <div className="absolute inset-0 z-0">
        <img
          src={displayImage}
          alt={`Mis XV ${data.quinceaneraName}`}
          className="w-full h-full object-cover object-top sm:object-center filter brightness-[0.92] contrast-[1.05]"
        />
        {/* Soft vignette & gradient blending to match reference plum/dusk background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#241123]/60 via-transparent to-[#241123] pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#1f0e1d]/70 pointer-events-none" />
      </div>

      {/* Top Floating Music Pill Button (As seen in image top-right: 🎵 MÚSICA) */}
      <div className="relative z-20 w-full max-w-4xl flex justify-end px-2 pt-2">
        <button
          onClick={onToggleMusic}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3a1835]/80 hover:bg-[#4d2046]/90 border border-rose-300/40 text-rose-100 text-xs font-semibold backdrop-blur-md shadow-lg shadow-black/40 transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <Music className={`w-3.5 h-3.5 text-rose-300 ${isPlayingMusic ? 'animate-bounce' : ''}`} />
          <span className="tracking-widest uppercase text-[11px]">Música</span>
          {isPlayingMusic ? (
            <Volume2 className="w-3.5 h-3.5 text-rose-300 animate-pulse" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-stone-400" />
          )}
        </button>
      </div>

      {/* Main Title Area (Matching the image exactly: Crown + MIS XV + Danna + Quote) */}
      <div className="relative z-20 max-w-2xl mx-auto flex flex-col items-center mt-2 sm:mt-6">
        {/* Golden Ornate Crown */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-2"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-b from-amber-400/20 to-rose-500/20 border border-amber-300/60 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/20 backdrop-blur-sm">
            <Crown className="w-6 h-6 text-amber-300 drop-shadow-[0_2px_8px_rgba(251,191,36,0.8)]" />
          </div>
        </motion.div>

        {/* Subtitle: MIS XV */}
        <motion.span
          initial={{ opacity: 0, tracking: '0.1em' }}
          animate={{ opacity: 1, tracking: '0.35em' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs sm:text-sm md:text-base font-cinzel font-semibold text-rose-100/90 uppercase tracking-[0.35em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-1"
        >
          {data.subtitle || 'MIS XV'}
        </motion.span>

        {/* Quinceañera Cursive Name: "Danna" */}
        <motion.h1
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-script text-white font-normal my-1 sm:my-2 tracking-wide text-glow-rose drop-shadow-[0_4px_25px_rgba(244,114,182,0.8)]"
          style={{ fontFamily: "'Great Vibes', 'Alex Brush', cursive" }}
        >
          {data.quinceaneraName}
        </motion.h1>

        {/* Storybook Quote: "ÉRASE UNA VEZ UNA PRINCESA QUE SOÑABA CON SU CUENTO DE HADAS..." */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-3 sm:mt-5 max-w-lg px-4"
        >
          <p className="text-xs sm:text-sm md:text-base font-cinzel text-rose-100/95 uppercase tracking-[0.18em] leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] font-medium">
            {data.titlePhrase?.toLowerCase().includes('perfecto')
              ? 'ÉRASE UNA VEZ UNA PRINCESA QUE SOÑABA CON SU CUENTO DE HADAS...'
              : (data.titlePhrase || 'ÉRASE UNA VEZ UNA PRINCESA QUE SOÑABA CON SU CUENTO DE HADAS...')}
          </p>
          <p className="text-xs sm:text-sm font-serif italic text-rose-200/90 mt-1.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            "Hay momentos que brillan para siempre en el corazón."
          </p>
        </motion.div>
      </div>

      {/* Down Arrow / "Desliza para comenzar" (As shown in reference image) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="relative z-20 flex flex-col items-center gap-2 mt-8 cursor-pointer group"
        onClick={() => onNavigateTo('countdown-section')}
      >
        <div className="w-9 h-9 rounded-full bg-[#3a1835]/70 border border-rose-300/60 flex items-center justify-center text-rose-200 group-hover:bg-[#4d2046] group-hover:scale-110 transition-all shadow-lg shadow-black/50">
          <ChevronDown className="w-5 h-5 text-rose-200 animate-bounce" />
        </div>
        <span className="text-[11px] font-sans tracking-widest text-rose-200/90 font-medium uppercase drop-shadow">
          Desliza para comenzar
        </span>
      </motion.div>
    </section>
  );
};
