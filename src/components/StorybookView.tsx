import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Crown,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Calendar,
  MapPin,
  Gift,
  Camera,
  MessageCircle,
  Clock,
  Heart,
  Music,
  Copy,
  Check,
  Building2,
  User,
  Navigation,
  ExternalLink,
  Volume2,
  VolumeX,
  Plus,
  Send,
  Shirt,
  Sparkle,
  Star
} from 'lucide-react';
import { InvitationData } from '../types';
import { triggerPageTurnSparkles } from '../utils/sparkleEffects';
import { playPageFlipSound } from '../utils/audioSynth';
import vintageRoseImage from '../assets/images/vintage_pink_rose_crest_1788045608311.jpg';
import castleHeroImage from '../assets/images/fairytale_princess_castle_1788045594056.jpg';
import cinderellaCastleImage from '../assets/images/cinderella_castle_night.jpg';
import { FairytaleAlbumModal } from './FairytaleAlbumModal';
import { FallingRosePetals } from './FallingRosePetals';

interface StorybookViewProps {
  data: InvitationData;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  onOpenMusicSelector: () => void;
  onOpenEditor: (tab?: 'photos' | 'basic' | 'venue' | 'rsvp' | 'transfer' | 'theme') => void;
  onUpdateData?: (newData: InvitationData) => void;
}

interface ChapterDef {
  id: string;
  number: number;
  roman: string;
  title: string;
  subtitle: string;
  icon: React.FC<{ className?: string }>;
}

const CHAPTERS: ChapterDef[] = [
  {
    id: 'cover',
    number: 1,
    roman: 'I',
    title: 'Portada Real',
    subtitle: 'Érase una vez...',
    icon: Crown
  },
  {
    id: 'date-countdown',
    number: 2,
    roman: 'II',
    title: 'La Espera & Fecha',
    subtitle: '10 de Octubre 2026',
    icon: Calendar
  },
  {
    id: 'venue-dresscode',
    number: 3,
    roman: 'III',
    title: 'El Salón & Dress Code',
    subtitle: 'Quinta Marbella • San Lorenzo',
    icon: MapPin
  },
  {
    id: 'gallery',
    number: 4,
    roman: 'IV',
    title: 'Álbum de Recuerdos',
    subtitle: 'Sesión de fotos',
    icon: Camera
  },
  {
    id: 'gifts',
    number: 5,
    roman: 'V',
    title: 'Opción de Regalo',
    subtitle: 'Ueno Bank & Alias',
    icon: Gift
  },
  {
    id: 'rsvp',
    number: 6,
    roman: 'VI',
    title: 'Confirmar Asistencia',
    subtitle: 'WhatsApp directo',
    icon: MessageCircle
  }
];

export const StorybookView: React.FC<StorybookViewProps> = ({
  data,
  isPlayingMusic,
  onToggleMusic,
  onOpenMusicSelector,
  onOpenEditor,
  onUpdateData
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageDirection, setPageDirection] = useState<number>(0);
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);

  // Transfer page copy states
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // RSVP page state
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState('1');
  const [attendStatus, setAttendStatus] = useState<'yes' | 'no'>('yes');

  // Gallery selected photo for full-screen lightbox
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(data.eventDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          isPast: false
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [data.eventDate]);

  const totalPages = CHAPTERS.length;
  const currentChapter = CHAPTERS[currentPage];

  // Navigate with realistic leaf flip sound and sparkles
  const goToPage = (newIndex: number, direction: 'next' | 'prev' | 'jump' = 'jump') => {
    if (newIndex < 0 || newIndex >= totalPages || newIndex === currentPage || isFlipping) return;
    const dir = direction === 'jump' ? (newIndex > currentPage ? 1 : -1) : (direction === 'next' ? 1 : -1);
    
    setIsFlipping(true);
    setPageDirection(dir);
    setCurrentPage(newIndex);
    
    // Play realistic parchment page-turn swoosh audio
    playPageFlipSound();
    
    // Trigger magical fairy dust sparkles
    triggerPageTurnSparkles(dir > 0 ? 'next' : 'prev');

    setTimeout(() => {
      setIsFlipping(false);
    }, 700);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      goToPage(currentPage + 1, 'next');
    }
  };

  const handlePrev = () => {
    if (currentPage > 0 && !isFlipping) {
      goToPage(currentPage - 1, 'prev');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isFlipping]);

  // Touch Swipe handling (horizontal only)
  const handleDragEnd = (_: any, info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }) => {
    const swipeThreshold = 45;
    const velocityThreshold = 180;

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      handlePrev();
    }
  };

  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const copyAllBankDetails = () => {
    const allText = `✨ DATOS PARA TRANSFERENCIA - MIS 15 DE ${data.quinceaneraName.toUpperCase()}:\n` +
      `🏦 Entidad: ${data.transferInfo.entity}\n` +
      `🔑 Alias: ${data.transferInfo.alias}\n` +
      `👤 Titular: ${data.transferInfo.accountHolder}\n` +
      (data.transferInfo.ciOrRuc ? `📄 CI/RUC: ${data.transferInfo.ciOrRuc}\n` : '');

    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleSendWhatsAppRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = data.whatsappRsvp.phoneNumber.replace(/[^\d]/g, '');
    const cleanPhone = raw.startsWith('0') ? '595' + raw.substring(1) : (raw.startsWith('595') ? raw : (raw ? '595' + raw : '595983027633'));
    let message = '';

    if (attendStatus === 'yes') {
      message = `👑 *CONFIRMACIÓN DE ASISTENCIA - MIS 15 DE ${data.quinceaneraName.toUpperCase()}*\n\n` +
        `👤 *Invitado(s):* ${guestName.trim() || 'Invitado Especial'}\n` +
        `✅ *Asistencia:* ¡Confirmo con mucha alegría mi asistencia! 🎉\n` +
        `👥 *Cantidad de personas:* ${guestCount}\n\n` +
        `¡Nos vemos en Quinta Marbella! ✨`;
    } else {
      message = `👑 *RESPUESTA DE INVITACIÓN - MIS 15 DE ${data.quinceaneraName.toUpperCase()}*\n\n` +
        `👤 *Invitado:* ${guestName.trim() || 'Invitado'}\n` +
        `❌ *Asistencia:* Lamentablemente no podré asistir esta vez, pero les deseo una noche mágica. 💕`;
    }

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#e89db4', '#f7cbd7', '#fbbf24', '#ffffff']
      });
    } catch {
      // safe
    }

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // =========================================================================
  // Authentic 3D Cylindrical Paper Curl Engine (Efecto de hojeada real)
  // =========================================================================
  const renderChapterContent = (pageIdx: number) => {
    switch (pageIdx) {
      case 0:
        return (
          <div className="w-full h-full flex flex-col justify-between items-center text-center relative overflow-hidden py-1">
            {/* Background Fairytale Castle Image */}
            <div className="absolute inset-0 z-0 opacity-75 rounded-2xl overflow-hidden pointer-events-none">
              <img
                src={castleHeroImage}
                alt="Princesa en el Castillo de Cuento de Hadas"
                className="w-full h-full object-cover object-center filter brightness-[1.1] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#2d1228]/60 via-transparent to-[#1a0816]/90" />
            </div>

            {/* Top Floating Music Badge */}
            <div className="relative z-10 w-full flex justify-between items-center px-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-1 text-[10px] font-cinzel text-amber-300 font-bold uppercase tracking-wider drop-shadow-md">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span className="text-white">Mis XV Años</span>
              </div>

              <button
                onClick={onToggleMusic}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3a1835]/90 hover:bg-[#4d2046] border border-rose-300/60 text-white text-[11px] backdrop-blur-md cursor-pointer transition-all active:scale-95 shadow-md"
              >
                <Music className={`w-3 h-3 text-rose-300 ${isPlayingMusic ? 'animate-bounce' : ''}`} />
                <span className="uppercase text-[9.5px] font-semibold">Música</span>
                {isPlayingMusic ? <Volume2 className="w-3 h-3 text-rose-300" /> : <VolumeX className="w-3 h-3 text-stone-400" />}
              </button>
            </div>

            {/* Center Hero Block */}
            <div className="relative z-10 my-auto flex flex-col items-center max-w-sm px-2 py-6">
              {/* Subtle radial dark glow behind text for better readability */}
              <div className="absolute inset-0 bg-radial from-[#1a0816]/70 via-[#2d1228]/40 to-transparent rounded-full blur-2xl -z-10" />

              {/* Crown */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-amber-400/30 to-rose-500/30 border border-amber-300/80 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)] mb-2 backdrop-blur-md">
                <Crown className="w-5 h-5 text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
              </div>

              {/* MIS XV */}
              <span className="text-[12px] sm:text-xs font-cinzel font-bold text-white uppercase tracking-[0.35em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mb-1">
                {data.subtitle || 'MIS XV'}
              </span>

              {/* Quinceañera Name: "Danna" */}
              <h1
                className="text-5xl sm:text-6xl md:text-7xl font-script text-white font-normal py-0.5 tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
                style={{ fontFamily: "'Great Vibes', cursive", textShadow: '0 0 20px rgba(244,114,182,0.8), 0 4px 8px rgba(0,0,0,0.9)' }}
              >
                {data.quinceaneraName}
              </h1>

              {/* Fairytale Quote */}
              <p className="text-[11px] sm:text-xs font-cinzel text-white uppercase tracking-[0.18em] leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mt-2 max-w-xs font-bold">
                {data.titlePhrase?.toLowerCase().includes('perfecto')
                  ? 'ÉRASE UNA VEZ UNA PRINCESA QUE SOÑABA CON SU CUENTO DE HADAS...'
                  : (data.titlePhrase || 'Érase una vez una princesa que soñaba con su cuento de hadas...')}
              </p>
              <p className="text-sm sm:text-base font-serif italic text-rose-50 mt-1 max-w-xs drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-medium">
                "Un sueño que florece bajo la luz de las estrellas para recordar por siempre."
              </p>
            </div>

            {/* Bottom Action: Abrir Cuento */}
            <div className="relative z-10 w-full flex flex-col items-center gap-1.5 pb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d87c98] via-[#e28ca4] to-[#cc6886] hover:from-[#c96987] hover:to-[#b85474] text-white font-cinzel font-bold text-xs tracking-[0.2em] uppercase shadow-lg shadow-rose-950/60 active:scale-95 transition-all cursor-pointer border border-rose-200/50"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                <span>Hojear Cuento Mágico</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-sans font-bold text-white tracking-wider">
                Toca o desliza para pasar la hoja
              </span>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="w-full h-full flex flex-col justify-between items-center text-center py-1">
            {/* Header */}
            <div className="flex flex-col items-center">
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400/40 mb-0.5" />
              <div className="flex items-center gap-1.5 font-cinzel font-bold text-xs uppercase tracking-[0.2em] text-rose-100">
                <span className="text-rose-300 text-[10px]">✦</span>
                <span>LA ESPERA & FECHA REAL</span>
                <span className="text-rose-300 text-[10px]">✦</span>
              </div>
              <p className="text-xs sm:text-sm font-serif italic text-rose-200/90 mt-0.5">
                "Cada segundo que pasa nos acerca al comienzo de una noche soñada."
              </p>
            </div>

            {/* Rose Parchment Countdown Container */}
            <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#fef5f7] via-[#faebef] to-[#f6e1e7] border-2 border-[#eec2cf] p-3 sm:p-4 text-[#68243a] shadow-lg relative overflow-hidden">
              <img
                src={vintageRoseImage}
                alt="Rosa"
                className="absolute -top-5 -right-5 w-16 h-16 opacity-30 object-contain rotate-12 pointer-events-none"
              />

              <span className="text-[10px] font-cinzel uppercase tracking-[0.25em] font-bold text-[#8a4158] block mb-2">
                ✦ FALTAN ✦
              </span>

              {/* 4 Pink Circular Counters */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2 max-w-xs mx-auto">
                {[
                  { label: 'DÍAS', value: timeLeft.days },
                  { label: 'HORAS', value: timeLeft.hours },
                  { label: 'MIN', value: timeLeft.minutes },
                  { label: 'SEG', value: timeLeft.seconds }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-[#f8d4de] to-[#e89db4] border-2 border-[#d87c98] flex items-center justify-center shadow-md">
                      <span className="text-base sm:text-lg font-mono font-bold text-[#68243a] leading-none">
                        {String(item.value).padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-[8px] font-cinzel font-bold uppercase tracking-wider text-[#8a4158] mt-1">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Date & Time Box */}
            <div className="w-full max-w-sm rounded-2xl bg-[#35152d]/80 border border-rose-300/35 p-3 text-center shadow-md">
              <div className="text-sm sm:text-base font-cinzel font-bold text-rose-100 uppercase tracking-widest">
                {data.dateDisplay.day} · {data.dateDisplay.month} · {data.dateDisplay.year}
              </div>
              <div className="text-xs font-serif font-bold text-rose-300 tracking-wider mt-0.5">
                {data.dateDisplay.time} HS — {data.dateDisplay.dayOfWeek || 'Viernes'}
              </div>

              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Mis 15 Años - ' + data.quinceaneraName)}&dates=20261010T230000Z/20261011T070000Z&details=${encodeURIComponent('Fiesta de 15 años de ' + data.quinceaneraName + ' en ' + data.venue.name)}&location=${encodeURIComponent(data.venue.name + ', ' + data.venue.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#d87c98] to-[#cc6886] hover:from-[#c96987] hover:to-[#b85474] text-white text-[10.5px] font-cinzel font-bold tracking-wider shadow-sm transition-all"
              >
                <Calendar className="w-3 h-3" />
                <span>Agendar en Calendario</span>
              </a>
            </div>

            {/* Bottom page tip */}
            <span className="text-[9.5px] font-serif text-rose-300/70 italic">
              Pasa la hoja para ver la ubicación del salón ➔
            </span>
          </div>
        );

      case 2:
        return (
          <div className="w-full h-full flex flex-col justify-between items-center text-center py-1">
            {/* Header */}
            <div className="flex flex-col items-center">
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400/40 mb-0.5" />
              <div className="flex items-center gap-1.5 font-cinzel font-bold text-xs uppercase tracking-[0.2em] text-rose-100">
                <span className="text-rose-300 text-[10px]">✦</span>
                <span>EL SALÓN & DRESS CODE</span>
                <span className="text-rose-300 text-[10px]">✦</span>
              </div>
              <p className="text-xs sm:text-sm font-serif italic text-rose-200/90 mt-0.5">
                "Un castillo encantado para celebrar juntos la magia de mis 15 años."
              </p>
            </div>

            {/* 2 Compact Cards Grid */}
            <div className="w-full max-w-sm space-y-2.5 my-auto">
              
              {/* Location Card */}
              <div className="rounded-2xl bg-gradient-to-b from-[#fef5f7] via-[#faebef] to-[#f6e1e7] border-2 border-[#eec2cf] p-3 text-[#68243a] shadow-md text-center relative overflow-hidden">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#b85474]" />
                  <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] font-bold text-[#8a4158]">
                    UBICACIÓN DE LA FIESTA
                  </span>
                </div>

                <h4 className="font-cinzel font-bold text-xs sm:text-sm text-[#68243a] uppercase tracking-wide">
                  {data.venue.name}
                </h4>
                <p className="text-[11px] font-serif font-medium text-[#8a4a5e] leading-tight mt-0.5 mb-2">
                  {data.venue.address || 'San Lorenzo'}
                </p>

                <a
                  href={data.venue.mapsUrl || 'https://maps.app.goo.gl/ZhaqmWH2r71aeRsX6'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-[#d87c98] hover:bg-[#c96987] text-white text-[10.5px] font-cinzel font-bold tracking-wider shadow-sm transition-all"
                >
                  <Navigation className="w-3 h-3" />
                  <span>VER EN GOOGLE MAPS & WAZE</span>
                </a>
              </div>

              {/* Dress Code Card */}
              <div className="rounded-2xl bg-[#35152d]/90 border border-rose-300/35 p-3 text-center shadow-md">
                <div className="flex items-center justify-center gap-1.5 mb-1.5">
                  <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] font-bold text-rose-200">
                    CÓDIGO DE VESTIMENTA
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3 mb-1">
                  {/* Dress SVG replacing user's drawing */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-rose-300 opacity-90 drop-shadow-sm">
                    <path d="M22 8v8 M42 8v8"/>
                    <path d="M22 16 c 0 -4, 10 -4, 10 2 c 0 -6, 10 -6, 10 -2 c 2 8, -4 16, -4 16 H26 c 0 0, -6 -8, -4 -16 Z"/>
                    <path d="M26 32 h12"/>
                    <path d="M26 32 C 16 40, 10 50, 12 58 C 20 60, 44 60, 52 58 C 54 50, 48 40, 38 32"/>
                    <path d="M28 32 C 24 45, 24 58, 24 58"/>
                    <path d="M36 32 C 40 45, 40 58, 40 58"/>
                    <path d="M32 32 v26"/>
                  </svg>

                  <div className="text-xs sm:text-sm font-cinzel font-bold text-amber-200 uppercase tracking-widest mt-1">
                    {data.dressCode.title || 'ELEGANTE'}
                  </div>

                  {/* Suit SVG replacing user's drawing */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-rose-300 opacity-90 drop-shadow-sm">
                    <path d="M24 12 L12 20 L14 56 H50 L52 20 L40 12"/>
                    <path d="M24 12 L32 36 L40 12"/>
                    <path d="M26 24 L32 30 L38 24"/>
                    <path d="M32 20 L30 38 L32 42 L34 38 Z"/>
                    <path d="M26 12 L32 20 L38 12"/>
                    <path d="M32 42 V56"/>
                    <path d="M42 26 L48 24"/>
                    <circle cx="32" cy="40" r="1.2" fill="currentColor"/>
                    <circle cx="32" cy="46" r="1.2" fill="currentColor"/>
                  </svg>
                </div>

                <p className="text-[10px] sm:text-[10.5px] font-serif text-rose-200/85 mt-0.5 mb-2 leading-tight">
                  {data.dressCode.description || 'Vestimenta de gala y elegante para una noche de cuento de hadas.'}
                </p>

                {/* Colores Prohibidos / Reservados */}
                <div className="pt-2 border-t border-rose-300/20 flex flex-col items-center">
                  <span className="text-[9px] sm:text-[9.5px] font-cinzel uppercase tracking-wider font-bold text-rose-200 flex items-center justify-center gap-1 mb-1.5">
                    <span className="text-rose-400">✕</span> Colores Prohibidos / Reservados <span className="text-rose-400">✕</span>
                  </span>

                  <div className="flex items-center justify-center gap-2.5">
                    {/* Blanco */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/85 border border-white/40 shadow-xs">
                      <div className="relative w-4 h-4 rounded-full bg-white border border-stone-300 flex items-center justify-center shadow-xs">
                        <div className="w-full h-[2px] bg-rose-600 rotate-45 rounded-full" />
                      </div>
                      <span className="text-[10px] sm:text-[10.5px] font-cinzel font-bold text-white tracking-wider uppercase">Blanco</span>
                    </div>

                    {/* Rosa */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/85 border border-pink-400/40 shadow-xs">
                      <div className="relative w-4 h-4 rounded-full bg-[#f472b6] border border-pink-300 flex items-center justify-center shadow-xs">
                        <div className="w-full h-[2px] bg-rose-700 rotate-45 rounded-full" />
                      </div>
                      <span className="text-[10px] sm:text-[10.5px] font-cinzel font-bold text-pink-200 tracking-wider uppercase">Rosa</span>
                    </div>
                  </div>

                  <p className="text-[8.5px] sm:text-[9px] font-serif italic text-rose-200/85 mt-1.5 leading-tight max-w-xs">
                    * La quinceañera usará estos colores. Por favor vestir otros hermosos tonos.
                  </p>
                </div>
              </div>

            </div>

            <span className="text-[9.5px] font-serif text-rose-300/70 italic">
              Pasa la hoja para ver el álbum de fotos ➔
            </span>
          </div>
        );

      case 3: {
        const mainPhoto = data.photos.find((p) => p.isPrimary) || data.photos[0];
        const secondaryPhotos = data.photos.filter((p) => p.id !== mainPhoto?.id).slice(0, 3);

        return (
          <div className="w-full h-full flex flex-col justify-between items-center text-center py-1">
            {/* Header & Beautiful Phrase at the Top */}
            <div className="flex flex-col items-center w-full">
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400/40 mb-0.5" />
              <div className="flex items-center gap-1.5 font-cinzel font-bold text-xs uppercase tracking-[0.2em] text-rose-100 mb-1">
                <span className="text-rose-300 text-[10px]">✦</span>
                <span>ÁLBUM DE FOTOS & RECUERDOS</span>
                <span className="text-rose-300 text-[10px]">✦</span>
              </div>

              {/* Top Beautiful Quote */}
              <div className="w-full max-w-xs px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#441935]/80 via-[#5a2144]/80 to-[#441935]/80 border border-rose-300/30 text-center shadow-xs">
                <p className="text-xs sm:text-sm font-serif italic text-rose-100 leading-snug">
                  "Cada fotografía guarda un instante mágico de este hermoso camino hacia mis 15 años."
                </p>
              </div>
            </div>

            {/* Fairytale Asymmetrical Showcase */}
            <div className="w-full max-w-[280px] sm:max-w-[295px] flex flex-col gap-2 my-auto">
              {/* Featured Main Photo: Balloons of 15 */}
              {mainPhoto && (
                <div
                  onClick={() => setIsAlbumModalOpen(true)}
                  className="group relative rounded-2xl overflow-hidden border-2 border-amber-400/80 bg-[#3a1835] cursor-pointer shadow-lg shadow-black/40 hover:border-amber-300 hover:shadow-amber-500/20 transition-all aspect-[16/10]"
                >
                  <img
                    src={mainPhoto.url}
                    alt={mainPhoto.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {/* Caption Gradient Banner */}
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-end">
                    <span className="text-[8.5px] font-cinzel text-amber-300 flex items-center gap-0.5">
                      Ampliar ➔
                    </span>
                  </div>
                </div>
              )}

              {/* Secondary 3 Mini Photos Preview - Elongated portrait frame */}
              <div className="grid grid-cols-3 gap-2">
                {secondaryPhotos.map((photo, idx) => (
                  <div
                    key={photo.id || idx}
                    onClick={() => setIsAlbumModalOpen(true)}
                    className="group relative rounded-xl overflow-hidden border-2 border-rose-300/50 aspect-[3/4] bg-[#3a1835] cursor-pointer shadow-sm hover:border-amber-300 hover:shadow-amber-500/20 transition-all"
                    title={photo.caption}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
                  </div>
                ))}
              </div>

              {/* Sparkling "Ver más del álbum" Button */}
              <button
                id="btn-open-fairytale-album"
                onClick={() => setIsAlbumModalOpen(true)}
                className="w-full py-2 px-3 rounded-full bg-gradient-to-r from-[#d87c98] via-[#c96987] to-[#b85474] hover:from-[#e08aa3] hover:to-[#c55f80] text-white font-cinzel font-bold text-[10.5px] tracking-wider uppercase shadow-md shadow-rose-950/60 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98 border border-rose-200/50"
              >
                <Camera className="w-3.5 h-3.5 text-amber-300" />
                <span>Ver Más del Álbum ({data.photos.length} Fotos)</span>
                <Sparkles className="w-3 h-3 text-amber-300" />
              </button>
            </div>

            {/* Photos View Hint */}
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[9px] font-serif text-rose-300/70 italic">
                Pasa la hoja para ver la opción de regalo ➔
              </span>
            </div>
          </div>
        );
      }

      case 4:
        return (
          <div className="w-full h-full flex flex-col justify-between items-center text-center py-1">
            {/* Header */}
            <div className="flex flex-col items-center">
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400/40 mb-0.5" />
              <div className="flex items-center gap-1.5 font-cinzel font-bold text-xs uppercase tracking-[0.2em] text-rose-100">
                <span className="text-rose-300 text-[10px]">✦</span>
                <span>OPCIÓN DE REGALO</span>
                <span className="text-rose-300 text-[10px]">✦</span>
              </div>
              <p className="text-xs sm:text-sm font-serif italic text-rose-200/90 mt-0.5">
                "Tu cariño y tu compañía son mi bendición más grande."
              </p>
            </div>

            {/* Virtual Bank Card & Copy Button (Ueno Bank) */}
            <div className="w-full max-w-sm space-y-2 my-auto">
              
              {/* Gift note intro */}
              <div className="text-center px-2">
                <p className="text-xs sm:text-sm font-serif text-rose-100/95 leading-relaxed italic">
                  Tu presencia es mi mayor y más hermoso regalo. Si deseas hacerme un presente para dar comienzo a este sueño, te comparto esta opción con mucho cariño:
                </p>
              </div>

              {/* Dark Plum / Rose Gold Virtual Card */}
              <div className="rounded-2xl p-3.5 bg-gradient-to-br from-[#53213b] via-[#3a1629] to-[#250d1a] border-2 border-[#e89db4] shadow-lg text-white text-left relative overflow-hidden">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-cinzel text-[11px] font-bold text-[#f7c2d2] uppercase tracking-wider">
                    {data.transferInfo.entity}
                  </span>
                  <Crown className="w-4 h-4 text-amber-300" />
                </div>

                <div className="mb-2">
                  <span className="text-[8px] uppercase tracking-widest text-[#f0afc3] block">
                    ALIAS
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xl sm:text-2xl font-mono font-bold tracking-widest text-white">
                      {data.transferInfo.alias}
                    </span>
                    <button
                      onClick={() => copyToClipboard(data.transferInfo.alias, 'alias')}
                      className="px-2.5 py-1 rounded-full bg-[#d87c98] hover:bg-[#c96987] text-white text-[10px] font-cinzel font-bold tracking-wider shadow-sm cursor-pointer flex items-center gap-1"
                    >
                      {copiedField === 'alias' ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="border-t border-rose-300/20 pt-1.5 flex justify-between items-end text-[9.5px]">
                  <div>
                    <span className="text-[7.5px] uppercase tracking-wider text-[#e69bb1] block">
                      TITULAR
                    </span>
                    <span className="font-serif font-semibold text-rose-100 uppercase">
                      {data.transferInfo.accountHolder}
                    </span>
                  </div>
                  <span className="text-amber-300 font-cinzel text-[9px]">✦ MIS 15 ✦</span>
                </div>
              </div>

              {/* Copy All Details Button */}
              <button
                onClick={copyAllBankDetails}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-gradient-to-r from-[#d87c98] via-[#e28ca4] to-[#cc6886] hover:from-[#c96987] hover:to-[#b85474] text-white font-cinzel font-bold text-[10.5px] uppercase tracking-wider shadow-md cursor-pointer"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Todos los datos copiados!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Todos los Datos Bancarios</span>
                  </>
                )}
              </button>

              {/* Thank you note */}
              <div className="flex items-center justify-center gap-1 text-[11px] sm:text-xs text-rose-200 font-serif italic mt-2">
                <Heart className="w-3 h-3 text-[#e89db4] fill-[#e89db4]" />
                <span>¡Muchas gracias por acompañarme y ser parte de mi cuento de hadas!</span>
              </div>
            </div>

            <span className="text-[9.5px] font-serif text-rose-300/70 italic">
              Pasa la hoja para confirmar tu asistencia ➔
            </span>
          </div>
        );

      case 5:
        return (
          <div className="w-full h-full flex flex-col justify-between items-center text-center py-1 relative overflow-hidden">
            {/* Full Background Image */}
            <div className="absolute inset-0 z-0 rounded-2xl overflow-hidden pointer-events-none bg-[#3a1226]">
              <img 
                src={cinderellaCastleImage}
                alt=""
                className="w-full h-full object-cover mix-blend-luminosity opacity-90"
                style={{ objectPosition: 'center 40%' }}
              />
              <div className="absolute inset-0 bg-pink-500/30 mix-blend-color" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#2d1228]/70 via-[#1a0816]/30 to-[#1a0816]/95" />
            </div>
            
            {/* Header */}
            <div className="flex flex-col items-center z-10 relative drop-shadow-md">
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400/40 mb-0.5 drop-shadow" />
              <div className="flex items-center gap-1.5 font-cinzel font-bold text-xs uppercase tracking-[0.2em] text-rose-100 drop-shadow">
                <span className="text-rose-300 text-[10px]">✦</span>
                <span>CONFIRMA TU ASISTENCIA</span>
                <span className="text-rose-300 text-[10px]">✦</span>
              </div>
              <p className="text-xs sm:text-sm font-serif italic text-rose-100 mt-0.5 drop-shadow-md font-medium">
                "Este cuento de hadas no estaría completo sin ti. Tu presencia hará brillar mi noche ♥"
              </p>
            </div>

            {/* RSVP Form Card */}
            <form onSubmit={handleSendWhatsAppRsvp} className="relative z-10 w-full max-w-sm bg-[#35152d]/90 border border-rose-300/40 rounded-2xl p-3 sm:p-3.5 space-y-2 text-left my-auto shadow-md">
              <div>
                <label className="block text-[9px] font-cinzel uppercase text-rose-200 tracking-wider mb-0.5">
                  Nombre / Familia
                </label>
                <input
                  type="text"
                  placeholder="Ej: Familia Gómez"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-rose-400/30 bg-stone-950/80 text-white text-xs focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-[9px] font-cinzel uppercase text-rose-200 tracking-wider mb-0.5">
                    Personas
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-xl border border-rose-400/30 bg-stone-950/80 text-white text-xs focus:outline-none focus:border-rose-400"
                  >
                    <option value="1">1 Persona</option>
                    <option value="2">2 Personas</option>
                    <option value="3">3 Personas</option>
                    <option value="4+">4 o más</option>
                  </select>
                </div>

                <div className="flex-1 flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={() => setAttendStatus(attendStatus === 'yes' ? 'no' : 'yes')}
                    className={`w-full py-1.5 px-2 rounded-xl text-[10.5px] font-bold border transition-all cursor-pointer text-center ${
                      attendStatus === 'yes'
                        ? 'bg-rose-500/80 text-white border-rose-300'
                        : 'bg-stone-800 text-stone-300 border-stone-600'
                    }`}
                  >
                    {attendStatus === 'yes' ? '✓ ¡Asistiré!' : '✕ No podré'}
                  </button>
                </div>
              </div>

              {/* WhatsApp Action Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-stone-950 font-cinzel font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 cursor-pointer mt-1"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-stone-950" />
                <span>CONFIRMAR POR WHATSAPP</span>
              </button>
            </form>

            {/* Farewell Signature */}
            <div className="flex flex-col items-center -mt-1 sm:mt-0 pb-1 z-10 relative">
              <p
                className="text-4xl sm:text-5xl text-rose-200 font-script leading-none"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                {data.quinceaneraName}
              </p>
              <span className="text-xs sm:text-sm font-serif text-rose-300/80 italic mt-1 drop-shadow-md">
                "¡Te espero con ilusión para vivir juntos una noche mágica e inolvidable!" ✨
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // 3D Realistic Paper Turn Animation Variants
  const realisticPaperVariants = {
    initial: (direction: number) => {
      if (direction >= 0) {
        // Forward turn: Page starts flat, ready to peel from right to left
        return {
          rotateY: 0,
          rotateZ: 0,
          skewY: 0,
          y: 0,
          scale: 1,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        };
      } else {
        // Backward turn: Previous page starts folded on the left, ready to roll down to the right
        return {
          rotateY: -180,
          rotateZ: -2.5,
          skewY: -3,
          y: -10,
          scale: 0.98,
          boxShadow: '-15px 15px 35px rgba(0,0,0,0.6)',
        };
      }
    },
    animate: {
      rotateY: 0,
      rotateZ: 0,
      skewY: 0,
      y: 0,
      scale: 1,
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      transition: {
        rotateY: { duration: 0.8, ease: [0.28, 0.04, 0.2, 1] },
        rotateZ: { duration: 0.8, ease: [0.28, 0.04, 0.2, 1] },
        skewY: { duration: 0.8, ease: [0.28, 0.04, 0.2, 1] },
        y: { duration: 0.8, ease: [0.28, 0.04, 0.2, 1] },
        scale: { duration: 0.8, ease: [0.28, 0.04, 0.2, 1] },
      }
    },
    exit: (direction: number) => {
      if (direction >= 0) {
        // Forward turn: Leaf lifts, curls into an arc in mid-flight and settles to the left
        return {
          rotateY: -180,
          rotateZ: -2.8,
          skewY: -3.5,
          y: -12,
          scale: 0.98,
          boxShadow: '25px 25px 40px rgba(0,0,0,0.7)',
          transition: {
            rotateY: { duration: 0.82, ease: [0.32, 0.06, 0.22, 1] },
            rotateZ: { duration: 0.82, ease: [0.32, 0.06, 0.22, 1] },
            skewY: { duration: 0.82, ease: [0.32, 0.06, 0.22, 1] },
            y: { duration: 0.82, ease: [0.32, 0.06, 0.22, 1] },
            scale: { duration: 0.82, ease: [0.32, 0.06, 0.22, 1] },
          }
        };
      } else {
        // Backward turn: Leaf rolls back over to the right
        return {
          rotateY: 0,
          rotateZ: 0,
          skewY: 0,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.75,
            ease: [0.32, 0.06, 0.22, 1]
          }
        };
      }
    }
  };


  return (
    <div className="w-full h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)] max-h-[100dvh] flex flex-col justify-between items-center px-2 sm:px-4 py-1 sm:py-2 select-none overflow-hidden">
      
      {/* 1. Top Ribbon / Chapter Navigation Bar */}
      <div className="w-full max-w-lg sm:max-w-2xl mx-auto flex items-center justify-between gap-2 px-1 z-20 shrink-0 h-9">
        {/* Table of Contents Button */}
        <button
          onClick={() => setIsIndexOpen(!isIndexOpen)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35152d]/85 hover:bg-[#4a1d3f] border border-rose-300/40 text-rose-100 text-[11px] font-cinzel font-bold tracking-wider backdrop-blur-md shadow-md cursor-pointer transition-all active:scale-95"
          title="Ver índice de capítulos"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden xs:inline">Capítulo {currentChapter.roman}:</span>
          <span className="text-amber-200 truncate max-w-[120px] sm:max-w-[180px]">{currentChapter.title}</span>
        </button>


        {/* Page Counter */}
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#35152d]/85 border border-rose-300/40 text-rose-200 text-[11px] font-cinzel backdrop-blur-md shadow-md">
          <span className="font-bold text-amber-300">{currentPage + 1}</span>
          <span className="text-rose-300/60">/</span>
          <span>{totalPages}</span>
        </div>
      </div>

      {/* 2. Central Storybook Stage with 3D Perspective & Book Layering */}
      <div
        className="w-full max-w-lg sm:max-w-xl md:max-w-2xl relative flex-1 flex items-center justify-center min-h-0 overflow-visible my-1"
        style={{ perspective: '1600px' }}
      >
        
        {/* Left Page Turn Button (Desktop/Tablet) */}
        {currentPage > 0 && (
          <button
            id="storybook-prev-btn"
            onClick={handlePrev}
            disabled={isFlipping}
            className="hidden sm:flex absolute -left-4 md:-left-8 z-30 w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-[#d87c98] to-[#b85474] text-white border-2 border-rose-200/60 items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            title="Página Anterior (Hojear hacia atrás)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right Page Turn Button (Desktop/Tablet) */}
        {currentPage < totalPages - 1 && (
          <button
            id="storybook-next-btn"
            onClick={handleNext}
            disabled={isFlipping}
            className="hidden sm:flex absolute -right-4 md:-right-8 z-30 w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-[#d87c98] to-[#b85474] text-white border-2 border-rose-200/60 items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            title="Página Siguiente (Hojear hacia adelante)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Decorative Background Book Stack Leaves (gives thickness and real book depth underneath) */}
        <div className="absolute inset-x-2 inset-y-1 rounded-3xl bg-[#1d0a1b]/70 border border-rose-900/40 pointer-events-none transform translate-y-1.5 scale-[0.985] shadow-2xl opacity-60" />
        <div className="absolute inset-x-4 inset-y-2 rounded-3xl bg-[#140612]/60 border border-rose-950/30 pointer-events-none transform translate-y-2.5 scale-[0.97] opacity-40" />

        {/* The 3D Animated Book Page Container */}
        <div className="w-full h-full max-h-[calc(100dvh-9rem)] sm:max-h-[calc(100dvh-9.5rem)] relative preserve-3d">
          
          {/* Base Layer (Page Underneath / Resting Book Bed) */}
          <div className="absolute inset-0 w-full h-full rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-[#2d1228] via-[#240e20] to-[#1a0816] border-2 border-rose-300/40 shadow-2xl shadow-black/70 backdrop-blur-md flex flex-col justify-between items-center relative overflow-hidden text-white z-0">
            {/* Left Spine Book Binding Shadow */}
            <div className="absolute left-0 top-0 bottom-0 w-4 sm:w-6 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none z-30 rounded-l-3xl" />
            <div className="absolute left-1.5 sm:left-2 top-3 bottom-3 w-[1px] bg-gradient-to-b from-amber-400/0 via-amber-400/40 to-amber-400/0 pointer-events-none z-30 opacity-60" />
            
            {/* Corner Gold Stars */}
            <div className="absolute top-2 left-3 text-amber-400/40 pointer-events-none text-xs font-serif z-20">✦</div>
            <div className="absolute top-2 right-2 text-amber-400/40 pointer-events-none text-xs font-serif z-20">✦</div>
            <div className="absolute bottom-2 left-3 text-amber-400/40 pointer-events-none text-xs font-serif z-20">✦</div>
            <div className="absolute bottom-2 right-2 text-amber-400/40 pointer-events-none text-xs font-serif z-20">✦</div>

            {/* Dynamic cast shadow from lifted page */}
            <div className={`absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent pointer-events-none z-25 transition-opacity duration-700 ${isFlipping ? 'opacity-70' : 'opacity-0'}`} />

            {/* Base Page Content */}
            {renderChapterContent(currentPage)}
          </div>

          {/* Active 3D Flipping Paper Leaf (Double Sided with Cylinder Bend) */}
          <AnimatePresence mode="wait" custom={pageDirection}>
            <motion.div
              key={currentPage}
              custom={pageDirection}
              variants={realisticPaperVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              drag={isFlipping ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'left center',
                willChange: 'transform, box-shadow'
              }}
              className="absolute inset-0 w-full h-full touch-none select-none z-20 cursor-grab active:cursor-grabbing"
            >
              {/* FRONT FACE OF THE PAPER LEAF */}
              <div className="absolute inset-0 w-full h-full rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-[#2d1228] via-[#240e20] to-[#1a0816] border-2 border-rose-300/45 shadow-2xl backdrop-blur-md flex flex-col justify-between items-center relative overflow-hidden text-white backface-hidden z-20">
                
                {/* Left Spine Book Binding Shadow */}
                <div className="absolute left-0 top-0 bottom-0 w-4 sm:w-6 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none z-30 rounded-l-3xl" />
                <div className="absolute left-1.5 sm:left-2 top-3 bottom-3 w-[1px] bg-gradient-to-b from-amber-400/0 via-amber-400/40 to-amber-400/0 pointer-events-none z-30 opacity-60" />

                {/* Cylinder Paper Curl Light Specular Sheen (Sweep highlight during page roll) */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-black/[0.15] pointer-events-none z-25" />

                {/* Corner Gold Stars */}
                <div className="absolute top-2 left-3 text-amber-400/40 pointer-events-none text-xs font-serif z-20">✦</div>
                <div className="absolute top-2 right-2 text-amber-400/40 pointer-events-none text-xs font-serif z-20">✦</div>
                <div className="absolute bottom-2 left-3 text-amber-400/40 pointer-events-none text-xs font-serif z-20">✦</div>
                <div className="absolute bottom-2 right-2 text-amber-400/40 pointer-events-none text-xs font-serif z-20">✦</div>


                {/* Front Content */}
                {renderChapterContent(currentPage)}
              </div>

              {/* BACK FACE OF THE PAPER LEAF (Visible when curled past 90 degrees) */}
              <div
                style={{
                  transform: 'rotateY(180deg)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
                className="absolute inset-0 w-full h-full rounded-3xl p-4 sm:p-6 bg-gradient-to-b from-[#250d1f] via-[#1c0817] to-[#12040f] border-2 border-rose-300/40 flex flex-col justify-between items-center text-center relative overflow-hidden text-rose-100/90 shadow-2xl z-10"
              >
                {/* Right Spine Fold Shadow for Reverse Page */}
                <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-l from-black/60 via-black/25 to-transparent pointer-events-none z-30 rounded-r-3xl" />
                <div className="absolute right-2 top-3 bottom-3 w-[1px] bg-gradient-to-b from-amber-400/0 via-amber-400/40 to-amber-400/0 pointer-events-none z-30 opacity-60" />

                {/* Antique Watermark Rose Crest */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
                  <img
                    src={vintageRoseImage}
                    alt="Rosa"
                    className="w-48 h-48 object-contain filter contrast-125 brightness-110"
                  />
                </div>

                {/* Top Royal Brand */}
                <div className="relative z-10 w-full flex justify-between items-center px-1">
                  <span className="text-[10px] font-cinzel text-amber-300/80 uppercase tracking-widest font-bold">
                    ✦ MIS XV AÑOS ✦
                  </span>
                  <span className="text-[10px] font-cinzel text-rose-300/80 uppercase font-bold">
                    {data.quinceaneraName}
                  </span>
                </div>

                {/* Center Royal Crest & Date */}
                <div className="relative z-10 flex flex-col items-center my-auto">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-b from-amber-400/25 to-rose-500/25 border border-amber-300/60 flex items-center justify-center text-amber-300 shadow-xl mb-2 backdrop-blur-sm">
                    <Crown className="w-7 h-7 text-amber-300 drop-shadow-[0_2px_8px_rgba(251,191,36,0.8)]" />
                  </div>
                  <h3
                    className="text-2xl sm:text-3xl text-white font-script py-0.5 tracking-wide text-glow-rose"
                    style={{ fontFamily: "'Great Vibes', cursive" }}
                  >
                    {data.quinceaneraName}
                  </h3>
                  <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-amber-300/60 to-transparent my-1.5" />
                  <span className="text-xs sm:text-sm font-serif italic text-rose-200/80">
                    {data.dateDisplay.day} de {data.dateDisplay.month} · {data.dateDisplay.year}
                  </span>
                  <p className="text-[9px] font-serif italic text-rose-200/70 mt-1 max-w-[200px]">
                    "Un capítulo mágico de amor y sueños que apenas comienza..."
                  </p>
                </div>

                {/* Bottom Chapter Indicator */}
                <div className="relative z-10 text-[9.5px] font-cinzel text-amber-300/70 tracking-wider font-semibold">
                  ✦ CUENTO DE PRINCESA ✦
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Delicate Falling Pink Rose Petals when page is static */}
          <FallingRosePetals
            active={!isFlipping}
            petalCount={14}
            className="rounded-3xl overflow-hidden pointer-events-none z-30"
          />
        </div>
      </div>

      {/* 3. Bottom Storybook Controls & Navigation Bar */}
      <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto flex flex-col items-center gap-1 px-1 z-20 shrink-0 h-14 justify-end pb-1">
        
        {/* Next / Previous Quick Action Buttons */}
        <div className="w-full flex items-center justify-between gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0 || isFlipping}
            className={`flex items-center gap-1 px-3 py-1 rounded-full font-cinzel text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
              currentPage === 0
                ? 'opacity-0 pointer-events-none'
                : isFlipping
                  ? 'opacity-50 cursor-not-allowed bg-stone-900/40 text-stone-500 border border-stone-800'
                  : 'bg-[#35152d] hover:bg-[#4a1d3f] text-rose-100 border border-rose-300/40 shadow-sm active:scale-95'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Hoja Anterior</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages - 1 || isFlipping}
            className={`flex items-center gap-1 px-3 py-1 rounded-full font-cinzel text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
              currentPage === totalPages - 1
                ? 'opacity-0 pointer-events-none'
                : isFlipping
                  ? 'opacity-50 cursor-not-allowed bg-stone-900/40 text-stone-500 border border-stone-800'
                  : 'bg-gradient-to-r from-[#d87c98] to-[#cc6886] hover:from-[#c96987] hover:to-[#b85474] text-white border border-rose-200/50 shadow-sm active:scale-95'
            }`}
          >
            <span>Siguiente Hoja</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Jewel Chapter Dots / Bookmarks */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          {CHAPTERS.map((chap, idx) => {
            const isCurrent = idx === currentPage;
            const Icon = chap.icon;

            return (
              <button
                key={chap.id}
                onClick={() => goToPage(idx, idx > currentPage ? 'next' : 'prev')}
                disabled={isFlipping}
                className={`flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  isCurrent
                    ? 'w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-r from-[#d87c98] to-[#b85474] text-white border-2 border-amber-300 shadow-md scale-110'
                    : 'w-5 h-5 rounded-full bg-[#2a1024]/80 hover:bg-[#3d1835] text-rose-300/70 border border-rose-400/30'
                }`}
                title={`Ir a ${chap.title}`}
              >
                <Icon className={`w-3 h-3 ${isCurrent ? 'text-amber-200' : ''}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Slide-out Table of Contents / Índice Modal */}
      <AnimatePresence>
        {isIndexOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-md p-4"
            onClick={() => setIsIndexOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#2d1228] via-[#240e20] to-[#1a0816] border-2 border-rose-300/50 p-5 shadow-2xl text-white relative overflow-hidden"
            >
              <div className="text-center mb-3">
                <Crown className="w-4 h-4 text-amber-400 mx-auto mb-0.5" />
                <h3 className="font-cinzel font-bold text-sm uppercase tracking-[0.2em] text-rose-100">
                  Índice del Cuento
                </h3>
              </div>

              <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
                {CHAPTERS.map((chap, idx) => {
                  const isCurrent = idx === currentPage;
                  const Icon = chap.icon;

                  return (
                    <button
                      key={chap.id}
                      onClick={() => {
                        goToPage(idx);
                        setIsIndexOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                        isCurrent
                          ? 'bg-[#d87c98] text-white border-amber-300 shadow-md'
                          : 'bg-[#35152d]/60 hover:bg-[#35152d] border-rose-300/30 text-rose-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isCurrent ? 'bg-white/20' : 'bg-rose-950/60 text-rose-300'
                        }`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="block text-[11px] font-cinzel font-bold uppercase tracking-wider">
                            {chap.roman}. {chap.title}
                          </span>
                          <span className={`text-[10px] font-serif ${isCurrent ? 'text-rose-100' : 'text-rose-300/70'}`}>
                            {chap.subtitle}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono font-bold opacity-70">
                        {chap.number}/{totalPages}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setIsIndexOpen(false)}
                  className="px-5 py-1.5 rounded-full bg-rose-950/80 hover:bg-rose-900 border border-rose-400/40 text-rose-200 text-[11px] font-cinzel font-bold tracking-wider cursor-pointer"
                >
                  Cerrar Índice
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal for Gallery */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && data.photos[selectedPhotoIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/95 backdrop-blur-xl p-4"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            <div className="relative max-w-sm max-h-[80vh] flex flex-col items-center">
              <img
                src={data.photos[selectedPhotoIndex].url}
                alt="Foto"
                className="max-w-full max-h-[70vh] object-contain rounded-2xl border border-rose-400/40 shadow-2xl"
              />
              <p className="mt-2 text-xs font-serif text-rose-200 text-center">
                {data.photos[selectedPhotoIndex].caption || `15 Años de ${data.quinceaneraName}`}
              </p>
              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="mt-3 px-4 py-1 rounded-full bg-[#d87c98] text-white text-xs font-cinzel font-bold"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fairytale Full Photo Album Modal */}
      <FairytaleAlbumModal
        isOpen={isAlbumModalOpen}
        onClose={() => setIsAlbumModalOpen(false)}
        photos={data.photos}
        quinceaneraName={data.quinceaneraName}
        heroPhotoUrl={data.heroPhotoUrl}
        onSetHeroPhoto={(url) => {
          if (onUpdateData) {
            onUpdateData({ ...data, heroPhotoUrl: url });
          }
        }}
        onUploadPhotos={(newPhotos) => {
          if (onUpdateData) {
            onUpdateData({ ...data, photos: [...newPhotos, ...data.photos] });
          }
        }}
      />

    </div>
  );
};
