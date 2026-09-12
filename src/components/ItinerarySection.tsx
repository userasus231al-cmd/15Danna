import React from 'react';
import { motion } from 'motion/react';
import { Crown, Clock, Sparkles, Heart, Utensils, Music, PartyPopper, Calendar } from 'lucide-react';
import { ItineraryItem } from '../types';

interface ItinerarySectionProps {
  itinerary: ItineraryItem[];
  themeStyle?: string;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  Crown,
  Heart,
  Utensils,
  Music,
  PartyPopper,
  Clock,
  Calendar
};

export const ItinerarySection: React.FC<ItinerarySectionProps> = ({ itinerary }) => {
  return (
    <section id="itinerary-section" className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Outer Fairytale Container */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#2d1228] via-[#240e20] to-[#1a0816] border-2 border-rose-300/35 p-6 sm:p-8 md:p-10 shadow-2xl shadow-black/60 text-white">
        
        {/* Golden Crown */}
        <div className="flex justify-center mb-1">
          <Crown className="w-5 h-5 text-amber-400 fill-amber-400/50 drop-shadow" />
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-center gap-2 mb-2 text-center">
          <span className="text-rose-300 text-xs">✦</span>
          <h2 className="text-sm sm:text-base md:text-lg font-cinzel font-bold text-rose-100 tracking-[0.25em] uppercase">
            CRONOGRAMA DE LA NOCHE
          </h2>
          <span className="text-rose-300 text-xs">✦</span>
        </div>

        <p className="text-center text-xs sm:text-sm font-serif italic text-rose-200/85 max-w-md mx-auto mb-8">
          Cada instante ha sido preparado con ilusión para compartirlo contigo
        </p>

        {/* Timeline */}
        <div className="relative border-l-2 border-rose-400/30 ml-4 sm:ml-28 md:ml-32 space-y-6 pb-2">
          {itinerary.map((item, index) => {
            const IconComponent = ICON_MAP[item.iconName] || Sparkles;

            return (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, x: 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="relative pl-6 sm:pl-8 group"
              >
                {/* Desktop time marker */}
                <div className="hidden sm:block absolute -left-28 md:-left-32 top-1.5 text-right w-24 md:w-28 pr-3">
                  <span className="font-mono font-bold text-rose-300 text-sm">
                    {item.time} hs
                  </span>
                </div>

                {/* Node icon */}
                <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-[#35152d] border-2 border-rose-400 flex items-center justify-center text-rose-200 shadow-md shadow-rose-900/40 group-hover:scale-110 group-hover:bg-[#d87c98] group-hover:text-white transition-all duration-300">
                  <IconComponent className="w-4 h-4" />
                </div>

                {/* Card */}
                <div className="p-4 sm:p-5 rounded-2xl border border-rose-400/25 bg-[#3a1835]/70 backdrop-blur-md shadow-lg group-hover:border-rose-400/50 transition-all">
                  <div className="sm:hidden font-mono font-bold text-rose-300 text-xs mb-1">
                    {item.time} hs
                  </div>
                  <h3 className="font-cinzel font-bold text-sm sm:text-base text-rose-100 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-rose-200/80 text-xs sm:text-sm font-serif leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
