import React from 'react';
import { Crown, Sparkles, Heart } from 'lucide-react';
import vintageRoseImage from '../assets/images/vintage_pink_rose_crest_1788045608311.jpg';
import castleHeroImage from '../assets/images/fairytale_princess_castle_1788045594056.jpg';

interface AboutMyNightSectionProps {
  dedicationQuote?: string;
  parents?: {
    mother: string;
    father: string;
    godparents: string;
  };
}

export const AboutMyNightSection: React.FC<AboutMyNightSectionProps> = ({
  dedicationQuote = 'Hay momentos en la vida que son muy especiales por sí solos. Compartirlos con las personas que quieres, los convierte en momentos inolvidables. Te invito a ser parte de este sueño hecho realidad. ¡No faltes!',
  parents
}) => {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-4">
      {/* Fairytale Storybook Parchment Card (Exact replica from reference image) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#fef5f7] via-[#faebef] to-[#f6e1e7] border-2 border-[#eec2cf] p-6 sm:p-8 md:p-10 text-center shadow-2xl shadow-black/40">
        
        {/* Left Watercolor Rose Bouquet */}
        <div className="hidden sm:block absolute left-4 top-1/2 -translate-y-1/2 w-28 h-36 md:w-32 md:h-40 pointer-events-none opacity-85">
          <img
            src={vintageRoseImage}
            alt="Rosa de Ensueño"
            className="w-full h-full object-contain filter drop-shadow-sm rotate-[-10deg]"
          />
        </div>

        {/* Right Fairytale Castle Silhouette/Artwork */}
        <div className="hidden sm:block absolute right-4 top-1/2 -translate-y-1/2 w-28 h-36 md:w-32 md:h-40 pointer-events-none opacity-80 rounded-2xl overflow-hidden shadow-sm border border-[#eec2cf]/60">
          <img
            src={castleHeroImage}
            alt="Castillo Mágico"
            className="w-full h-full object-cover object-top filter contrast-[1.05]"
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
          {/* Top Golden Crown */}
          <Crown className="w-5 h-5 text-amber-500 fill-amber-400/40 mb-1 drop-shadow-sm" />

          {/* Section Header: ✦ SOBRE MI NOCHE ✦ */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-[#a4667a] text-xs font-serif">✦</span>
            <h2 className="text-sm sm:text-base md:text-lg font-cinzel font-bold text-[#7d3c52] tracking-[0.25em] uppercase">
              SOBRE MI NOCHE
            </h2>
            <span className="text-[#a4667a] text-xs font-serif">✦</span>
          </div>

          {/* Fairytale Storybook Text */}
          <div className="space-y-2 text-[#68243a] font-serif text-sm sm:text-base leading-relaxed px-2">
            <p>Hay momentos en la vida que son muy especiales por sí solos.</p>
            <p>Compartirlos con las personas que quieres,</p>
            <p>los convierte en momentos inolvidables.</p>
            <p className="font-semibold text-[#7d3c52]">Te invito a ser parte de este sueño hecho realidad.</p>
            <p className="text-lg sm:text-xl font-script text-[#9c4c68] font-bold pt-1" style={{ fontFamily: "'Great Vibes', cursive" }}>
              ¡No faltes!
            </p>
          </div>

          {/* Parents and Godparents Note if available */}
          {parents && (parents.mother || parents.godparents) && (
            <div className="mt-5 pt-4 border-t border-[#eec2cf] w-full grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#8a4a5e]">
              <div>
                <span className="block font-cinzel font-bold text-[#7d3c52] uppercase tracking-wider text-[10px]">
                  Mis Padres:
                </span>
                <span className="font-serif italic">{parents.mother} & {parents.father}</span>
              </div>
              <div>
                <span className="block font-cinzel font-bold text-[#7d3c52] uppercase tracking-wider text-[10px]">
                  Mis Padrinos:
                </span>
                <span className="font-serif italic">{parents.godparents}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
