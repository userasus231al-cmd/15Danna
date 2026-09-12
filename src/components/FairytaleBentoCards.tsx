import React, { useState } from 'react';
import {
  Crown,
  Calendar,
  MapPin,
  Music,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Volume2,
  ExternalLink,
  Navigation,
  Sparkles,
  Share2
} from 'lucide-react';
import { InvitationData, MusicTrack } from '../types';
import vintageRoseImage from '../assets/images/vintage_pink_rose_crest_1788045608311.jpg';

interface FairytaleBentoCardsProps {
  data: InvitationData;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  onNextTrack?: () => void;
  onPrevTrack?: () => void;
  currentTrackTitle?: string;
  onOpenMapModal?: () => void;
}

export const FairytaleBentoCards: React.FC<FairytaleBentoCardsProps> = ({
  data,
  isPlayingMusic,
  onToggleMusic,
  onNextTrack,
  onPrevTrack,
  currentTrackTitle = 'Vals Mágico de 15 Años',
  onOpenMapModal
}) => {
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleOpenMaps = () => {
    if (onOpenMapModal) {
      onOpenMapModal();
    } else {
      const url = data.venue.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(data.venue.name + ' ' + data.venue.address + ' ' + data.venue.city)}`;
      window.open(url, '_blank');
    }
  };

  const handleOpenWaze = () => {
    const wazeUrl = data.venue.wazeUrl || `https://waze.com/ul?q=${encodeURIComponent(data.venue.name + ' ' + data.venue.address)}`;
    window.open(wazeUrl, '_blank');
  };

  const handleCopyAddress = () => {
    const full = `${data.venue.name}, ${data.venue.address}, ${data.venue.city}`;
    navigator.clipboard.writeText(full);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-4">
      {/* 4 Cards Grid (Exact structure from reference image) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        
        {/* ================= CARD 1: FECHA Y HORA ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#fef5f7] via-[#faebef] to-[#f6e1e7] border-2 border-[#eec2cf] p-6 text-center shadow-xl shadow-black/40 flex flex-col justify-between items-center group hover:border-[#df95ad] transition-all duration-300 min-h-[310px]">
          {/* Top Crown & Header */}
          <div className="w-full flex flex-col items-center">
            <Crown className="w-4 h-4 text-amber-500 fill-amber-400/40 mb-1 drop-shadow-sm" />
            <div className="flex items-center justify-center gap-1.5 text-[#7d3c52] font-cinzel font-bold text-xs uppercase tracking-[0.2em]">
              <span className="text-[#a4667a] text-[10px]">✦</span>
              <span>FECHA Y HORA</span>
              <span className="text-[#a4667a] text-[10px]">✦</span>
            </div>
          </div>

          {/* Calendar Graphic with Heart */}
          <div className="my-3 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#fff5f8] to-[#fce4ec] border border-[#e89db4] flex items-center justify-center text-[#9c4c68] shadow-md shadow-[#9c4c68]/15 relative">
              <Calendar className="w-7 h-7 text-[#9c4c68]" />
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 absolute -bottom-1 -right-1" />
            </div>

            {/* Date Details */}
            <div className="mt-3 text-center">
              <span className="block text-sm sm:text-base font-cinzel font-bold text-[#68243a] tracking-wider uppercase">
                {data.dateDisplay.day} · {data.dateDisplay.month} · {data.dateDisplay.year}
              </span>
              <span className="block text-xs sm:text-sm font-serif font-bold text-[#8a4a5e] tracking-widest mt-1">
                {data.dateDisplay.time}
              </span>
            </div>
          </div>

          {/* Bottom Rose Accent */}
          <div className="w-full flex justify-center pt-2 border-t border-[#f0c8d4]/60">
            <div className="flex items-center gap-1 text-[11px] text-[#9c5a70] font-serif italic">
              <Heart className="w-3 h-3 text-[#c26d87] fill-[#c26d87]/40" />
              <span>{data.dateDisplay.dayOfWeek || 'Viernes Mágico'}</span>
            </div>
          </div>
        </div>

        {/* ================= CARD 2: UBICACIÓN ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#fef5f7] via-[#faebef] to-[#f6e1e7] border-2 border-[#eec2cf] p-6 text-center shadow-xl shadow-black/40 flex flex-col justify-between items-center group hover:border-[#df95ad] transition-all duration-300 min-h-[310px]">
          {/* Top Crown & Header */}
          <div className="w-full flex flex-col items-center">
            <Crown className="w-4 h-4 text-amber-500 fill-amber-400/40 mb-1 drop-shadow-sm" />
            <div className="flex items-center justify-center gap-1.5 text-[#7d3c52] font-cinzel font-bold text-xs uppercase tracking-[0.2em]">
              <span className="text-[#a4667a] text-[10px]">✦</span>
              <span>UBICACIÓN</span>
              <span className="text-[#a4667a] text-[10px]">✦</span>
            </div>
          </div>

          {/* Map Pin Graphic with Heart */}
          <div className="my-2 flex flex-col items-center w-full">
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#fff5f8] to-[#fce4ec] border border-[#e89db4] flex items-center justify-center text-[#9c4c68] shadow-md shadow-[#9c4c68]/15 mb-2">
              <MapPin className="w-6 h-6 text-[#b54f73] fill-[#b54f73]/20" />
            </div>

            <span className="text-[10px] font-cinzel tracking-widest text-[#9c5a70] uppercase font-bold">
              SALÓN DE EVENTOS
            </span>

            <span
              className="text-lg sm:text-xl font-script text-[#68243a] leading-tight my-0.5"
              style={{ fontFamily: "'Great Vibes', 'Alex Brush', cursive" }}
            >
              {data.venue.name}
            </span>

            <span className="text-[11px] font-serif text-[#7a4153] leading-snug max-w-[200px] px-1">
              {data.venue.address}, {data.venue.city}
            </span>
          </div>

          {/* Action Button: VER EN MAPA (Exact pink pill button from image) */}
          <div className="w-full flex flex-col gap-1.5">
            <button
              onClick={handleOpenMaps}
              className="w-full py-2 px-3 rounded-full bg-gradient-to-r from-[#d87c98] via-[#e28ca4] to-[#cc6886] hover:from-[#c96987] hover:to-[#b85474] text-white font-cinzel text-xs font-bold tracking-wider shadow-md shadow-[#9c4c68]/25 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase"
            >
              <span>VER EN MAPA</span>
              <MapPin className="w-3.5 h-3.5" />
            </button>

            <div className="flex justify-center gap-2 text-[10px] text-[#9c5a70]">
              <button
                onClick={handleOpenWaze}
                className="hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <Navigation className="w-2.5 h-2.5" /> Waze
              </button>
              <span>•</span>
              <button
                onClick={handleCopyAddress}
                className="hover:underline cursor-pointer"
              >
                {copiedAddress ? '¡Copiado!' : 'Copiar Dir.'}
              </button>
            </div>
          </div>
        </div>

        {/* ================= CARD 3: DRESS CODE ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#fef5f7] via-[#faebef] to-[#f6e1e7] border-2 border-[#eec2cf] p-6 text-center shadow-xl shadow-black/40 flex flex-col justify-between items-center group hover:border-[#df95ad] transition-all duration-300 min-h-[310px]">
          {/* Top Crown & Header */}
          <div className="w-full flex flex-col items-center">
            <Crown className="w-4 h-4 text-amber-500 fill-amber-400/40 mb-1 drop-shadow-sm" />
            <div className="flex items-center justify-center gap-1.5 text-[#7d3c52] font-cinzel font-bold text-xs uppercase tracking-[0.2em]">
              <span className="text-[#a4667a] text-[10px]">✦</span>
              <span>DRESS CODE</span>
              <span className="text-[#a4667a] text-[10px]">✦</span>
            </div>
          </div>

          {/* Gown Graphic / Mannequin Illustration */}
          <div className="my-2 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#fff5f8] to-[#fce4ec] border border-[#e89db4] flex items-center justify-center text-[#9c4c68] shadow-md shadow-[#9c4c68]/15 mb-2">
              <svg className="w-8 h-8 text-[#b54f73]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a2 2 0 100 4 2 2 0 000-4zm-3 5a1 1 0 00-.8.4L5.5 12l2.5 1 2-5h4l2 5 2.5-1-2.7-4.6A1 1 0 0015 7H9zm-2.8 7.5L4 21h16l-2.2-6.5-5.8 2.5-5.8-2.5z"/>
              </svg>
            </div>

            <span className="text-sm sm:text-base font-cinzel font-bold text-[#68243a] tracking-widest uppercase">
              {data.dressCode.title || 'ELEGANTE'}
            </span>

            <p className="text-[11px] font-serif text-[#7a4153] leading-tight mt-1 max-w-[200px]">
              {data.dressCode.description || 'Vestimenta de gala y elegante para una noche de cuento de hadas.'}
            </p>
          </div>

          {/* Forbidden Colors (Blanco y Rosa) */}
          <div className="w-full flex flex-col items-center pt-2 border-t border-[#f0c8d4]/60">
            <span className="text-[9px] font-cinzel text-[#8a3852] uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1">
              <span className="text-rose-500">✕</span> Colores Prohibidos <span className="text-rose-500">✕</span>
            </span>

            <div className="flex items-center justify-center gap-3">
              {/* Blanco */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 border border-stone-300 shadow-xs">
                <div className="relative w-3.5 h-3.5 rounded-full bg-white border border-stone-400 flex items-center justify-center">
                  <div className="w-full h-[1.5px] bg-rose-600 rotate-45 rounded-full" />
                </div>
                <span className="text-[10px] font-cinzel font-bold text-[#68243a] uppercase">Blanco</span>
              </div>

              {/* Rosa */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fae8ee] border border-pink-300 shadow-xs">
                <div className="relative w-3.5 h-3.5 rounded-full bg-[#f472b6] border border-pink-400 flex items-center justify-center">
                  <div className="w-full h-[1.5px] bg-rose-700 rotate-45 rounded-full" />
                </div>
                <span className="text-[10px] font-cinzel font-bold text-[#8a3852] uppercase">Rosa</span>
              </div>
            </div>

            <span className="text-[8.5px] font-serif italic text-[#8a4a5e] mt-1.5 text-center leading-tight">
              Reservados exclusivamente para la quinceañera
            </span>
          </div>
        </div>

        {/* ================= CARD 4: MÚSICA ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#fef5f7] via-[#faebef] to-[#f6e1e7] border-2 border-[#eec2cf] p-6 text-center shadow-xl shadow-black/40 flex flex-col justify-between items-center group hover:border-[#df95ad] transition-all duration-300 min-h-[310px]">
          {/* Top Crown & Header */}
          <div className="w-full flex flex-col items-center">
            <Crown className="w-4 h-4 text-amber-500 fill-amber-400/40 mb-1 drop-shadow-sm" />
            <div className="flex items-center justify-center gap-1.5 text-[#7d3c52] font-cinzel font-bold text-xs uppercase tracking-[0.2em]">
              <span className="text-[#a4667a] text-[10px]">✦</span>
              <span>MÚSICA</span>
              <span className="text-[#a4667a] text-[10px]">✦</span>
            </div>
          </div>

          {/* Musical Note Graphic with Sparkles */}
          <div className="my-2 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#fff5f8] to-[#fce4ec] border border-[#e89db4] flex items-center justify-center text-[#9c4c68] shadow-md shadow-[#9c4c68]/15 mb-2 relative">
              <Music className={`w-6 h-6 text-[#b54f73] ${isPlayingMusic ? 'animate-bounce' : ''}`} />
              <Sparkles className="w-3.5 h-3.5 text-amber-400 absolute -top-1 -right-1" />
            </div>

            <p className="text-xs font-serif italic text-[#7a4153] leading-snug px-2">
              Acompáñame en esta noche tan especial
            </p>

            <span className="text-[10px] font-sans font-medium text-[#9c5a70] truncate max-w-[170px] mt-1">
              {currentTrackTitle}
            </span>
          </div>

          {/* Interactive Player Controls (Exact pink play circle button with prev/next arrows) */}
          <div className="w-full flex items-center justify-center gap-3 pt-2 border-t border-[#f0c8d4]/60">
            {onPrevTrack && (
              <button
                onClick={onPrevTrack}
                className="p-1.5 rounded-full text-[#9c4c68] hover:text-[#68243a] hover:bg-[#f8dce5] transition-colors cursor-pointer"
                title="Canción anterior"
              >
                <SkipBack className="w-4 h-4" />
              </button>
            )}

            {/* Central Pink Circular Play/Pause Button */}
            <button
              onClick={onToggleMusic}
              className="w-10 h-10 rounded-full bg-gradient-to-b from-[#e89db4] via-[#df859f] to-[#cc6886] hover:from-[#d87c98] hover:to-[#b85474] text-white flex items-center justify-center shadow-md shadow-[#9c4c68]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title={isPlayingMusic ? 'Pausar música' : 'Reproducir música'}
            >
              {isPlayingMusic ? (
                <Pause className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-white translate-x-0.5" />
              )}
            </button>

            {onNextTrack && (
              <button
                onClick={onNextTrack}
                className="p-1.5 rounded-full text-[#9c4c68] hover:text-[#68243a] hover:bg-[#f8dce5] transition-colors cursor-pointer"
                title="Siguiente canción"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
