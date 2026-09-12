import React from 'react';
import { Crown, Heart, Sparkles } from 'lucide-react';
import { InvitationData } from '../types';

interface FooterSectionProps {
  data: InvitationData;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ data }) => {
  return (
    <footer className="relative mt-20 pt-12 pb-24 border-t border-amber-500/20 bg-gradient-to-b from-transparent via-[#140f0c] to-[#0a0807] text-center">
      <div className="max-w-xl mx-auto px-4 flex flex-col items-center">
        {/* Crown logo */}
        <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-4 shadow-lg shadow-amber-500/15">
          <Crown className="w-6 h-6" />
        </div>

        <h3
          className="text-3xl sm:text-4xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-yellow-100 mb-2"
          style={{ fontFamily: "'Great Vibes', cursive, 'Playfair Display', serif" }}
        >
          {data.quinceaneraName}
        </h3>

        <p className="text-amber-300/80 font-mono text-xs uppercase tracking-widest mb-6">
          Mis 15 Años • {data.dateDisplay.year}
        </p>

        <div className="flex items-center justify-center gap-2 text-stone-400 text-xs mb-4">
          <span>¡Gracias por ser parte de este momento tan especial!</span>
          <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40" />
        </div>

        <div className="text-[11px] text-stone-600 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-500/50" />
          <span>Invitación Digital Interactiva de XV Años</span>
          <Sparkles className="w-3 h-3 text-amber-500/50" />
        </div>
      </div>
    </footer>
  );
};
