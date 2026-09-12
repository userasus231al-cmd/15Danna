import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Shirt, AlertCircle, Palette } from 'lucide-react';
import { DressCodeInfo, ThemeStyle } from '../types';
import { THEME_CONFIGS } from '../utils/theme';

interface DressCodeSectionProps {
  dressCode: DressCodeInfo;
  themeStyle: ThemeStyle;
}

export const DressCodeSection: React.FC<DressCodeSectionProps> = ({ dressCode, themeStyle }) => {
  const theme = THEME_CONFIGS[themeStyle] || THEME_CONFIGS['luxury-gold'];

  return (
    <section id="dress-code-section" className="py-12 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#1c1511] to-[#100d0a] p-6 sm:p-8 shadow-xl backdrop-blur-xl text-center relative overflow-hidden"
      >
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border border-amber-500/40 bg-amber-950/30 text-amber-300 mb-3">
          <Shirt className="w-3.5 h-3.5 text-amber-400" />
          Código de Vestimenta
        </span>

        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 mb-2">
          {dressCode.title}
        </h2>

        <p className="text-stone-300 text-sm max-w-lg mx-auto leading-relaxed mb-6">
          {dressCode.description}
        </p>

        {/* Reserved color warning & Forbidden Colors */}
        <div className="pt-4 border-t border-rose-400/20 max-w-md mx-auto">
          <span className="text-xs uppercase tracking-widest text-rose-300 font-semibold block mb-3 flex items-center justify-center gap-1.5 font-cinzel">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            Colores Prohibidos / Reservados
          </span>

          <div className="flex justify-center items-center gap-4 mb-3">
            {/* Blanco */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/80 border border-white/40 shadow-sm">
              <div className="relative w-5 h-5 rounded-full bg-white border border-stone-300 flex items-center justify-center shadow-xs">
                <div className="w-full h-[2px] bg-rose-600 rotate-45 rounded-full" />
              </div>
              <span className="text-xs font-cinzel font-bold text-white tracking-wider uppercase">Blanco</span>
            </div>

            {/* Rosa */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/80 border border-pink-400/40 shadow-sm">
              <div className="relative w-5 h-5 rounded-full bg-[#f472b6] border border-pink-300 flex items-center justify-center shadow-xs">
                <div className="w-full h-[2px] bg-rose-700 rotate-45 rounded-full" />
              </div>
              <span className="text-xs font-cinzel font-bold text-pink-200 tracking-wider uppercase">Rosa</span>
            </div>
          </div>

          <p className="text-xs font-serif italic text-rose-200/80 max-w-sm mx-auto">
            La quinceañera usará estos colores. Por favor elegir otros tonos para celebrar juntos esta hermosa noche.
          </p>
        </div>
      </motion.div>
    </section>
  );
};
