import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Copy, Check, CalendarPlus, ExternalLink, Car } from 'lucide-react';
import { VenueInfo, ThemeStyle } from '../types';
import { THEME_CONFIGS } from '../utils/theme';

interface LocationSectionProps {
  venue: VenueInfo;
  eventDate: string;
  quinceaneraName: string;
  themeStyle: ThemeStyle;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  venue,
  eventDate,
  quinceaneraName,
  themeStyle
}) => {
  const [copied, setCopied] = useState(false);
  const theme = THEME_CONFIGS[themeStyle] || THEME_CONFIGS['luxury-gold'];

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${venue.name}, ${venue.address}, ${venue.city}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddToGoogleCalendar = () => {
    const startDate = new Date(eventDate);
    const endDate = new Date(startDate.getTime() + 6 * 60 * 60 * 1000); // 6 hours event

    const formatCalDate = (date: Date) =>
      date.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const title = encodeURIComponent(`15 Años de ${quinceaneraName}`);
    const details = encodeURIComponent(`Celebración de 15 años en ${venue.name}. ¡Te esperamos para compartir una noche mágica!`);
    const location = encodeURIComponent(`${venue.name}, ${venue.address}, ${venue.city}`);
    const dates = `${formatCalDate(startDate)}/${formatCalDate(endDate)}`;

    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank', 'noopener,noreferrer');
  };

  const encodedMapSearch = encodeURIComponent(`${venue.name} ${venue.address} ${venue.city}`);
  const mapsLink = venue.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodedMapSearch}`;
  const wazeLink = venue.wazeUrl || `https://waze.com/ul?q=${encodedMapSearch}`;

  return (
    <section id="location-section" className="py-12 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border border-amber-500/30 bg-amber-950/30 text-amber-300">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          Lugar & Ubicación
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-100 mt-2">
          ¿Dónde celebraremos?
        </h2>
        <p className="text-stone-300 text-sm max-w-md mx-auto mt-2">
          Te esperamos en el salón de eventos para vivir juntos cada instante de la fiesta.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#1c1613] to-[#110e0c] p-6 sm:p-8 shadow-2xl shadow-black/60 backdrop-blur-xl overflow-hidden"
      >
        {/* Decorative corner borders */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-400/40 rounded-tl pointer-events-none" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-400/40 rounded-tr pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
          {/* Venue Info Left */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-300 mb-4">
              <MapPin className="w-7 h-7 text-amber-400" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 mb-1">
              {venue.name}
            </h3>

            <p className="text-amber-200/90 text-base font-medium mb-1">
              {venue.address}
            </p>

            <p className="text-stone-400 text-sm mb-4">
              {venue.city}
            </p>

            {venue.notes && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-900/80 border border-stone-800 text-stone-300 text-xs mb-6 max-w-md">
                <Car className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{venue.notes}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <a
                id="open-google-maps-btn"
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-sm shadow-md hover:brightness-110 transition-all cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>Cómo Llegar (Google Maps)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              <a
                id="open-waze-btn"
                href={wazeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-amber-400/40 bg-amber-950/30 text-amber-200 hover:bg-amber-900/40 text-sm font-medium transition-all cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-sky-400" />
                <span>Waze</span>
              </a>

              <button
                id="copy-address-btn"
                onClick={handleCopyAddress}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-stone-700 bg-stone-900/80 text-stone-200 hover:bg-stone-800 text-sm font-medium transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">¡Dirección Copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-stone-400" />
                    <span>Copiar Dirección</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Map Preview Card Right */}
          <div className="w-full md:w-80 h-56 rounded-2xl overflow-hidden border border-amber-500/30 relative shadow-inner bg-stone-900 flex flex-col items-center justify-center p-4 text-center">
            {/* Ambient Map graphic */}
            <div className="absolute inset-0 bg-[radial-gradient(#33271e_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 mb-3 shadow-lg shadow-amber-500/20 animate-pulse">
                <MapPin className="w-6 h-6 text-amber-400" />
              </div>
              <span className="font-serif font-bold text-stone-200 text-base mb-1">
                {venue.name}
              </span>
              <span className="text-xs text-stone-400 mb-4 max-w-[220px] line-clamp-2">
                {venue.address}
              </span>
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir Mapa Completo</span>
              </a>
            </div>
          </div>
        </div>

        {/* Add to Calendar Banner */}
        <div className="mt-8 pt-6 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-sm font-semibold text-stone-200 block">
              ¡Agéndalo en tu calendario para no olvidarlo!
            </span>
            <span className="text-xs text-stone-400">
              Recibirás un recordatorio antes del inicio de la fiesta.
            </span>
          </div>

          <button
            id="add-to-calendar-btn"
            onClick={handleAddToGoogleCalendar}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-400/40 bg-gradient-to-r from-amber-950/50 to-stone-900 text-amber-200 text-xs font-semibold hover:border-amber-300 transition-all cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4 text-amber-400" />
            <span>Agendar en Google Calendar</span>
          </button>
        </div>
      </motion.div>
    </section>
  );
};
