import React, { useState, useEffect } from 'react';
import {
  Crown,
  Settings,
  Share2,
  Check,
  Camera,
  MapPin,
  MessageCircle,
  Gift,
  Mail,
  Clock,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { InvitationData } from '../types';

interface TopNavbarProps {
  data: InvitationData;
  onOpenEditor: (tab?: 'photos' | 'music' | 'basic' | 'venue' | 'rsvp' | 'transfer' | 'theme') => void;
  onReopenEnvelope: () => void;
  onJumpToChapter?: (chapterIndex: number) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  data,
  onOpenEditor,
  onReopenEnvelope,
  onJumpToChapter
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#241123]/95 backdrop-blur-xl border-b border-rose-300/30 py-2 shadow-xl shadow-black/60'
          : 'bg-gradient-to-b from-[#1a0918]/90 to-transparent py-2.5'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => {
            if (onJumpToChapter) onJumpToChapter(0);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 cursor-pointer group"
          title="Ir a la portada del cuento"
        >
          <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-300/50 flex items-center justify-center text-rose-200 group-hover:scale-105 transition-transform">
            <Crown className="w-4 h-4 text-amber-300" />
          </div>
          <div className="flex flex-col">
            <span
              className="text-base sm:text-lg font-script font-bold text-white leading-tight"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              {data.quinceaneraName}
            </span>
            <span className="text-[9px] tracking-[0.25em] uppercase text-rose-200/90 font-cinzel">
              Libro de Cuentos XV
            </span>
          </div>
        </div>

        {/* Quick Chapter Shortcuts (Desktop) */}
        {onJumpToChapter && (
          <nav className="hidden lg:flex items-center gap-1 text-xs">
            <button
              onClick={() => onJumpToChapter(1)}
              className="px-2.5 py-1 rounded-full text-rose-200 hover:text-white hover:bg-white/10 transition-colors font-cinzel text-[11px]"
            >
              Fecha
            </button>

            <button
              onClick={() => onJumpToChapter(2)}
              className="px-2.5 py-1 rounded-full text-rose-200 hover:text-white hover:bg-white/10 transition-colors font-cinzel text-[11px]"
            >
              Ubicación
            </button>

            <button
              onClick={() => onJumpToChapter(3)}
              className="px-2.5 py-1 rounded-full text-rose-200 hover:text-white hover:bg-white/10 transition-colors font-cinzel text-[11px]"
            >
              Fotos
            </button>

            <button
              onClick={() => onJumpToChapter(4)}
              className="px-2.5 py-1 rounded-full text-rose-200 hover:text-white hover:bg-white/10 transition-colors font-cinzel text-[11px]"
            >
              Regalo
            </button>

            <button
              onClick={() => onJumpToChapter(5)}
              className="px-3 py-1 rounded-full bg-gradient-to-r from-[#d87c98] to-[#cc6886] hover:from-[#c96987] hover:to-[#b85474] text-white font-cinzel font-bold text-[11px] uppercase tracking-wider shadow-sm transition-all"
            >
              Confirmar WhatsApp
            </button>
          </nav>
        )}

        {/* Right action buttons: Editor + Share + Envelope */}
        <div className="flex items-center gap-2">
          {/* Reopen Envelope */}
          <button
            onClick={onReopenEnvelope}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-rose-300/30 bg-[#35152d]/60 hover:bg-[#35152d] text-rose-100 text-xs transition-colors cursor-pointer"
            title="Ver sobre de bienvenida"
          >
            <Mail className="w-3.5 h-3.5 text-rose-300" />
            <span className="hidden xl:inline">Ver Sobre</span>
          </button>

          {/* Share invitation link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-rose-300/40 bg-rose-950/40 hover:bg-rose-950/70 text-rose-100 text-xs font-semibold transition-all cursor-pointer shadow-sm"
            title="Copiar enlace para compartir"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-rose-300" />
                <span>Compartir</span>
              </>
            )}
          </button>

          {/* Subtle Imperceptible Editor Button */}
          <button
            id="main-open-editor-btn"
            onClick={() => onOpenEditor()}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-rose-300/40 hover:text-rose-200 border border-white/10 transition-all cursor-pointer"
            title="Ajustes"
            aria-label="Ajustes"
          >
            <Settings className="w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
};
