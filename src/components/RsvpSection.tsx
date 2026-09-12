import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Crown, MessageCircle, CheckCircle2, Users, Send, Heart, AlertCircle } from 'lucide-react';
import { WhatsappRsvpInfo } from '../types';
import castleHeroImage from '../assets/images/fairytale_princess_castle_1788045594056.jpg';

interface RsvpSectionProps {
  rsvpInfo: WhatsappRsvpInfo;
  quinceaneraName: string;
  themeStyle?: string;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({
  rsvpInfo,
  quinceaneraName
}) => {
  const [guestName, setGuestName] = useState('');
  const [attendStatus, setAttendStatus] = useState<'yes' | 'no'>('yes');
  const [guestCount, setGuestCount] = useState('1');
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [showFullForm, setShowFullForm] = useState(false);

  // Clean phone number for WhatsApp link
  const cleanPhone = rsvpInfo.phoneNumber.replace(/[^\d]/g, '');

  const generateWhatsAppUrl = (customText?: string) => {
    const textToSend = customText || rsvpInfo.defaultMessage;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(textToSend)}`;
  };

  const handleSendFormRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    let message = '';
    if (attendStatus === 'yes') {
      message = `👑 *CONFIRMACIÓN DE ASISTENCIA - MIS 15 DE ${quinceaneraName.toUpperCase()}*\n\n` +
        `👤 *Invitado(s):* ${guestName.trim()}\n` +
        `✅ *Asistencia:* ¡Confirmo con mucha alegría mi asistencia! 🎉\n` +
        `👥 *Cantidad de personas:* ${guestCount}\n`;
      if (dietaryNotes.trim()) {
        message += `🍽️ *Restricciones/Dieta:* ${dietaryNotes.trim()}\n`;
      }
      message += `\n¡Gracias por la invitación! Nos vemos en el castillo. ✨`;
    } else {
      message = `👑 *RESPUESTA DE INVITACIÓN - MIS 15 DE ${quinceaneraName.toUpperCase()}*\n\n` +
        `👤 *Invitado:* ${guestName.trim()}\n` +
        `❌ *Asistencia:* Lamentablemente no podré asistir esta vez, pero les deseo una noche mágica e inolvidable. 💕`;
    }

    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#e89db4', '#f7cbd7', '#fbbf24', '#ffffff']
      });
    } catch {
      // safe
    }

    const waUrl = generateWhatsAppUrl(message);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const directWaUrl = generateWhatsAppUrl(rsvpInfo.defaultMessage);

  return (
    <section id="rsvp-section" className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Fairytale RSVP Banner Card (Exact replica from reference image bottom) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#3a1835] via-[#2d1129] to-[#1f0a1c] border-2 border-rose-300/40 p-6 sm:p-8 md:p-10 text-center shadow-2xl shadow-black/60 text-white">
        
        {/* Faint Fairytale Castle Silhouette Background */}
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <img
            src={castleHeroImage}
            alt="Castillo Silueta"
            className="w-full h-full object-cover object-center filter grayscale"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
          
          {/* Top Golden Crown */}
          <Crown className="w-5 h-5 text-amber-400 fill-amber-400/50 mb-1 drop-shadow" />

          {/* Section Title: ✦ CONFIRMA TU ASISTENCIA ✦ */}
          <div className="flex items-center justify-center gap-2 mb-2 text-center">
            <span className="text-rose-300 text-xs">✦</span>
            <h2 className="text-sm sm:text-base md:text-lg font-cinzel font-bold text-rose-100 tracking-[0.25em] uppercase">
              CONFIRMA TU ASISTENCIA
            </h2>
            <span className="text-rose-300 text-xs">✦</span>
          </div>

          {/* Subtitle from image: "Tu presencia hará esta noche aún más especial ♥" */}
          <p className="text-xs sm:text-sm font-serif italic text-rose-200/90 mb-5 flex items-center justify-center gap-1.5">
            <span>Tu presencia hará esta noche aún más especial</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          </p>

          {/* Deadline notice if set */}
          {rsvpInfo.deadlineText && (
            <div className="mb-4 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-950/60 border border-rose-400/30 text-rose-200 text-xs">
              <AlertCircle className="w-3 h-3 text-rose-300" />
              <span>{rsvpInfo.deadlineText}</span>
            </div>
          )}

          {/* Main WhatsApp Button (Exact design from reference image) */}
          <a
            id="direct-whatsapp-rsvp-btn"
            href={directWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-md flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#d87c98] via-[#e28ca4] to-[#cc6886] hover:from-[#c96987] hover:to-[#b85474] text-white font-cinzel font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-black/50 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer border border-rose-200/40"
          >
            <MessageCircle className="w-5 h-5 fill-white text-[#d87c98]" />
            <span>CONFIRMAR POR WHATSAPP</span>
          </a>

          {/* Toggle form button for multiple guests or menu details */}
          <button
            onClick={() => setShowFullForm(!showFullForm)}
            className="mt-4 text-xs font-serif text-rose-300/80 hover:text-rose-200 underline cursor-pointer"
          >
            {showFullForm ? 'Ocultar formulario detallado' : '¿Deseas especificar acompañantes o menú especial? Toca aquí'}
          </button>

          {/* Detailed Guest RSVP Form */}
          {showFullForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="w-full max-w-md mt-5 p-5 rounded-2xl bg-[#281124]/90 border border-rose-400/30 text-left shadow-lg"
            >
              <h4 className="font-cinzel text-xs font-bold text-rose-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-rose-300" />
                <span>Datos de Invitados</span>
              </h4>

              <form onSubmit={handleSendFormRsvp} className="space-y-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAttendStatus('yes')}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      attendStatus === 'yes'
                        ? 'bg-rose-500 text-white border-rose-400 font-bold'
                        : 'bg-stone-900/60 text-stone-400 border-stone-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>¡Asistiré!</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttendStatus('no')}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      attendStatus === 'no'
                        ? 'bg-stone-700 text-white border-stone-500 font-bold'
                        : 'bg-stone-900/60 text-stone-400 border-stone-700'
                    }`}
                  >
                    <span>No podré asistir</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-cinzel text-rose-200/80 mb-1">
                    Nombre Completo / Familia *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Familia Gómez / Juan Pérez"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-rose-400/30 bg-stone-950/80 text-white text-xs focus:outline-none focus:border-rose-400"
                  />
                </div>

                {attendStatus === 'yes' && (
                  <>
                    <div>
                      <label className="block text-[10px] uppercase font-cinzel text-rose-200/80 mb-1">
                        Cantidad de Invitados
                      </label>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-rose-400/30 bg-stone-950/80 text-white text-xs focus:outline-none focus:border-rose-400"
                      >
                        <option value="1">1 Persona</option>
                        <option value="2">2 Personas</option>
                        <option value="3">3 Personas</option>
                        <option value="4">4 Personas</option>
                        <option value="5+">5 o más</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-cinzel text-rose-200/80 mb-1">
                        Restricción alimentaria (Opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Menú vegetariano, sin gluten"
                        value={dietaryNotes}
                        onChange={(e) => setDietaryNotes(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-rose-400/30 bg-stone-950/80 text-white text-xs focus:outline-none focus:border-rose-400"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-stone-950 font-bold text-xs uppercase tracking-wider shadow hover:brightness-110 cursor-pointer mt-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Formulario a WhatsApp</span>
                </button>
              </form>
            </motion.div>
          )}

          <div className="mt-4 text-[10px] text-rose-300/60 font-mono">
            Contacto: {rsvpInfo.contactName} ({rsvpInfo.phoneNumber})
          </div>
        </div>
      </div>
    </section>
  );
};
