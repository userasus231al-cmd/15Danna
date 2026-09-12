import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Crown, Music } from 'lucide-react';
import { InvitationData } from '../types';
import vintageRoseImage from '../assets/images/vintage_pink_rose_crest_1788045608311.jpg';
import castleHeroImage from '../assets/images/fairytale_princess_castle_1788045594056.jpg';

interface EnvelopeIntroProps {
  data: InvitationData;
  onOpen: () => void;
  isOpen: boolean;
}

export const EnvelopeIntro: React.FC<EnvelopeIntroProps> = ({ data, onOpen, isOpen }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenInvitation = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);

    // Fire magical rose-gold and fairy dust celebration confetti
    try {
      confetti({
        particleCount: 30, // Reducido para no saturar
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#e89db4', '#f7cbd7', '#fbbf24', '#fef08a', '#ffffff', '#e879f9'],
        shapes: ['star', 'circle'],
        scalar: 1.15,
        ticks: 200
      });
    } catch {
      // safe fallback
    }

    setTimeout(() => {
      onOpen();
    }, 750);
  };

  if (isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.6 } }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gradient-to-b from-[#220c1d] via-[#1a0816] to-[#12040e] backdrop-blur-2xl overflow-hidden h-[100dvh]"
      >
        {/* Subtle background castle silhouette */}
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <img
            src={castleHeroImage}
            alt="Castillo Silueta"
            className="w-full h-full object-cover object-center filter grayscale brightness-50"
          />
        </div>

        {/* Ambient rose glow */}
        <div className="absolute w-72 h-72 rounded-full bg-[#d87c98]/20 blur-3xl pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center justify-center max-h-[95dvh]">
          
          {/* Top Royal Crown Badge */}
          <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mb-3 sm:mb-4 flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-rose-300/40 bg-[#3a1835]/80 text-rose-200 text-[11px] font-cinzel font-bold tracking-[0.2em] uppercase backdrop-blur-md shadow-lg shadow-black/40"
          >
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span>Invitación Real • Mis XV Años</span>
            <Sparkles className="w-3 h-3 text-amber-300" />
          </motion.div>

          {/* 3D Realistic Royal Envelope Container */}
          <div
            className="relative w-full max-w-[360px] sm:max-w-[420px] aspect-[1.38/1] flex items-center justify-center"
            style={{ perspective: 1200 }}
          >
            {/* Ambient envelope glow */}
            <div className="absolute inset-0 bg-[#d87c98]/25 blur-2xl rounded-3xl pointer-events-none" />

            {/* Main Envelope Body */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full rounded-2xl border-2 border-[#e8a3b8] bg-gradient-to-b from-[#fdf4f6] via-[#fae6ec] to-[#f4d2dc] shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(216,124,152,0.3)] overflow-visible"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#3a1228] via-[#2a0c1d] to-[#1e0714] overflow-hidden border border-rose-900/40">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:16px_16px]" />
              </div>

              {/* Royal Letter Sliding Out from Inside the Envelope */}
              <motion.div
                initial={{ y: 10 }}
                animate={{
                  y: isOpening ? -70 : 0,
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
                }}
                className="absolute inset-x-3 sm:inset-x-4 top-3 bottom-3 rounded-xl border border-amber-300/60 bg-gradient-to-b from-[#fffafb] via-[#fdf1f4] to-[#fae6ec] p-4 text-center shadow-lg flex flex-col justify-between items-center z-10"
              >
                {/* Filigree corner accents */}
                <div className="absolute top-1.5 left-2 text-[10px] text-amber-500/60 font-serif">✦</div>
                <div className="absolute top-1.5 right-2 text-[10px] text-amber-500/60 font-serif">✦</div>
                <div className="absolute bottom-1.5 left-2 text-[10px] text-amber-500/60 font-serif">✦</div>
                <div className="absolute bottom-1.5 right-2 text-[10px] text-amber-500/60 font-serif">✦</div>

                <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-cinzel font-bold tracking-[0.25em] text-[#8a4158] uppercase">
                  <Crown className="w-3 h-3 text-amber-500 fill-amber-400/40" />
                  <span>{data.subtitle || 'MIS XV AÑOS'}</span>
                  <Crown className="w-3 h-3 text-amber-500 fill-amber-400/40" />
                </div>

                <div className="my-auto py-1">
                  <h1
                    className="text-4xl sm:text-5xl font-script text-[#68243a] leading-tight font-normal tracking-wide drop-shadow-sm"
                    style={{ fontFamily: "'Great Vibes', cursive" }}
                  >
                    {data.quinceaneraName}
                  </h1>

                  <div className="flex items-center justify-center gap-2 my-1">
                    <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#c26d87]" />
                    <Heart className="w-3 h-3 text-[#c26d87] fill-[#c26d87]" />
                    <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#c26d87]" />
                  </div>

                  <p className="text-[11px] sm:text-xs text-[#752a41] font-serif italic max-w-[240px] mx-auto line-clamp-2">
                    "Tengo el honor de invitarte a compartir una noche mágica e inolvidable"
                  </p>
                </div>

                <div className="text-[9px] font-cinzel font-bold text-amber-700 tracking-wider flex items-center gap-1">
                  <span>10 DE OCTUBRE 2026</span>
                  <span>•</span>
                  <span>SAN LORENZO</span>
                </div>
              </motion.div>

              {/* Envelope Lower Pocket (Left, Right, and Bottom Folds) */}
              <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-2xl">
                {/* Left diagonal fold */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-[#f8e1e8] to-[#eed0dc] border-r border-[#e8a3b8]/40 shadow-md"
                  style={{
                    clipPath: 'polygon(0% 0%, 50% 56%, 0% 100%)'
                  }}
                />
                {/* Right diagonal fold */}
                <div
                  className="absolute inset-0 bg-gradient-to-bl from-[#f8e1e8] to-[#eed0dc] border-l border-[#e8a3b8]/40 shadow-md"
                  style={{
                    clipPath: 'polygon(100% 0%, 50% 56%, 100% 100%)'
                  }}
                />
                {/* Bottom triangular fold */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#f6cad8] via-[#fae3ea] to-[#fae6ec] border-t border-[#e8a3b8]/60 shadow-[0_-5px_15px_rgba(0,0,0,0.06)]"
                  style={{
                    clipPath: 'polygon(0% 100%, 50% 54%, 100% 100%)'
                  }}
                />

                {/* Golden filigree piping along bottom pocket seam */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polyline points="0,100 50,54 100,100" fill="none" stroke="#d48a9e" strokeWidth="0.75" />
                  <polyline points="0,0 50,56 0,100" fill="none" stroke="#e8a3b8" strokeWidth="0.5" strokeDasharray="2,2" />
                  <polyline points="100,0 50,56 100,100" fill="none" stroke="#e8a3b8" strokeWidth="0.5" strokeDasharray="2,2" />
                </svg>
              </div>

              {/* Envelope Top Triangular Flap (Solapa Superior Plegable) */}
              <motion.div
                initial={false}
                animate={{
                  rotateX: isOpening ? -165 : 0,
                  transition: { duration: 0.65, ease: [0.34, 1.2, 0.64, 1] }
                }}
                style={{
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                  perspective: 1000
                }}
                className="absolute inset-x-0 top-0 h-[62%] z-30 pointer-events-none drop-shadow-[0_8px_12px_rgba(0,0,0,0.18)]"
              >
                {/* The Triangular Flap Shape */}
                <div
                  className="w-full h-full bg-gradient-to-b from-[#fae5eb] via-[#f7d6e0] to-[#f0c3d2] relative"
                  style={{
                    clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)'
                  }}
                >
                  {/* Subtle paper grain and filigree along the flap edges */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-black/10" />
                  
                  {/* Gold piping along the triangular flap edge */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline points="0,0 50,100 100,0" fill="none" stroke="#e090a8" strokeWidth="1.2" />
                    <polyline points="3,0 50,95 97,0" fill="none" stroke="#d4829b" strokeWidth="0.6" strokeDasharray="2,2" />
                  </svg>
                </div>
              </motion.div>

              {/* The Royal Wax Seal (Sello de Lacre Real) */}
              <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 z-40 flex flex-col items-center">
                {/* Elegant Satin Ribbon Tails peeking out under the wax seal */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 pointer-events-none">
                  {/* Left ribbon tail */}
                  <div className="w-4 h-12 bg-gradient-to-b from-[#e11d48] via-[#be185d] to-[#9d174d] -rotate-[22deg] origin-top rounded-b shadow-md border-x border-[#f43f5e]/40"
                    style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 85%, 50% 100%, 0% 85%)' }}
                  />
                  {/* Right ribbon tail */}
                  <div className="w-4 h-12 bg-gradient-to-b from-[#e11d48] via-[#be185d] to-[#9d174d] rotate-[22deg] origin-top rounded-b shadow-md border-x border-[#f43f5e]/40"
                    style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 85%, 50% 100%, 0% 85%)' }}
                  />
                </div>

                {/* Realistic Royal Sealing Wax Stamp Button */}
                <motion.button
                  id="open-invitation-seal-btn"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleOpenInvitation}
                  disabled={isOpening}
                  aria-label="Abrir invitación de 15 años"
                  className="relative group w-22 h-22 sm:w-24 sm:h-24 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 select-none"
                >
                  {/* Organic Irregular Hot Wax Scallop Edge */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#f43f5e] via-[#e11d48] to-[#be185d] shadow-[0_10px_25px_rgba(225,29,72,0.65),0_0_20px_rgba(251,113,133,0.4)] border border-[#fb7185]/50 group-hover:shadow-[0_12px_30px_rgba(225,29,72,0.8),0_0_25px_rgba(251,191,36,0.6)] transition-all duration-300">
                    {/* Organic melted wax droplets / contours around rim */}
                    <div className="absolute -top-1 left-2 w-3.5 h-3.5 rounded-full bg-[#e11d48] opacity-80" />
                    <div className="absolute -bottom-1 right-2.5 w-4 h-3.5 rounded-full bg-[#be185d] opacity-80" />
                    <div className="absolute top-4 -right-1 w-3 h-3 rounded-full bg-[#f43f5e] opacity-80" />
                    <div className="absolute top-5 -left-1 w-3.5 h-3.5 rounded-full bg-[#e11d48] opacity-80" />
                  </div>

                  {/* Raised Beaded Gold/Rose Rim */}
                  <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-[#fbcfe8]/50 flex items-center justify-center pointer-events-none" />

                  {/* Inner Recessed Stamp Depression */}
                  <div className="relative w-[76%] h-[76%] rounded-full bg-gradient-to-b from-[#be185d] via-[#9d174d] to-[#831843] flex flex-col items-center justify-center text-rose-100 shadow-[inset_0_3px_8px_rgba(0,0,0,0.7)] border border-[#f43f5e]/40">
                    {/* Wax Sheen Highlight */}
                    <div className="absolute top-1 inset-x-2 h-3.5 bg-gradient-to-b from-white/30 to-transparent rounded-full pointer-events-none" />

                    {/* Royal Crown Crest in Wax Stamp */}
                    <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] mb-0.5 group-hover:scale-110 transition-transform" />
                    
                    <span className="text-[10.5px] sm:text-[11px] font-cinzel font-bold tracking-[0.2em] text-rose-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      ABRIR
                    </span>
                    <span className="text-[8px] font-serif tracking-wider text-rose-300/80">
                      Mis 15
                    </span>
                  </div>

                  {/* Golden Pulsing Halo inviting click */}
                  <span className="absolute inset-0 rounded-full border-2 border-amber-300/60 animate-ping opacity-40 pointer-events-none" />
                </motion.button>

                {/* Subtitle prompt */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#290a1f]/80 border border-rose-300/30 text-rose-100 text-[11px] font-cinzel font-bold tracking-wider shadow-md backdrop-blur-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span>Toca el sello para abrir</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Audio hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 flex flex-col items-center justify-center gap-1 text-rose-200/80 text-[11px] font-serif italic"
          >
            <div className="flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-rose-300 animate-pulse" />
              <span>Por favor sube el volumen, esta invitación contiene música</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
