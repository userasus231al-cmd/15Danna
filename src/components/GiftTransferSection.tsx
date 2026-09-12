import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Crown, Gift, Copy, Check, Building2, User, Sparkles, Heart } from 'lucide-react';
import { TransferInfo, ThemeStyle } from '../types';
import vintageRoseImage from '../assets/images/vintage_pink_rose_crest_1788045608311.jpg';

interface GiftTransferSectionProps {
  transferInfo: TransferInfo;
  themeStyle?: ThemeStyle;
}

export const GiftTransferSection: React.FC<GiftTransferSectionProps> = ({
  transferInfo
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const copyAllDetails = () => {
    const allText = `✨ DATOS PARA TRANSFERENCIA - MIS 15:\n` +
      `🏦 Entidad: ${transferInfo.entity}\n` +
      `🔑 Alias: ${transferInfo.alias}\n` +
      `👤 Titular: ${transferInfo.accountHolder}\n` +
      (transferInfo.accountNumber && transferInfo.accountNumber !== transferInfo.alias ? `🔢 N° Cuenta: ${transferInfo.accountNumber}\n` : '') +
      (transferInfo.ciOrRuc ? `📄 CI/RUC: ${transferInfo.ciOrRuc}\n` : '');

    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => {
      setCopiedAll(false);
    }, 2500);
  };

  return (
    <section id="gift-section" className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Fairytale Rose-Gold Storybook Parchment Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#fef5f7] via-[#faebef] to-[#f6e1e7] border-2 border-[#eec2cf] p-6 sm:p-8 md:p-10 shadow-2xl shadow-black/40">
        
        {/* Subtle decorative rose bouquet */}
        <img
          src={vintageRoseImage}
          alt="Rosa Decorativa"
          className="absolute -top-8 -right-8 w-28 h-28 opacity-30 pointer-events-none object-contain rotate-12"
        />

        {/* Golden Crown */}
        <div className="flex justify-center mb-1 relative z-10">
          <Crown className="w-5 h-5 text-amber-500 fill-amber-400/40 drop-shadow-sm" />
        </div>

        {/* Header: ✦ REGALO & TRANSFERENCIA ✦ */}
        <div className="flex items-center justify-center gap-2 mb-3 relative z-10 text-center">
          <span className="text-[#a4667a] text-xs font-serif">✦</span>
          <h2 className="text-sm sm:text-base md:text-lg font-cinzel font-bold text-[#7d3c52] tracking-[0.25em] uppercase">
            REGALO & TRANSFERENCIA
          </h2>
          <span className="text-[#a4667a] text-xs font-serif">✦</span>
        </div>

        <p className="text-center font-serif text-sm text-[#7a4153] max-w-md mx-auto mb-6 leading-relaxed relative z-10">
          {transferInfo.notes || 'Tu presencia es mi mayor regalo, pero si deseas hacerme un presente en efectivo o transferencia:'}
        </p>

        {/* Bank Details Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          
          {/* Virtual Card (Left 5 Cols) */}
          <div className="md:col-span-5 flex justify-center">
            <div className="w-full max-w-xs h-48 rounded-2xl p-5 bg-gradient-to-br from-[#53213b] via-[#3a1629] to-[#250d1a] border-2 border-[#e89db4] shadow-xl text-white flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start">
                <div className="w-9 h-6 rounded bg-gradient-to-tr from-amber-200 to-amber-400 border border-amber-100 flex items-center justify-center shadow-inner">
                  <div className="w-5 h-3 border border-amber-900/30 rounded-xs" />
                </div>
                <span className="font-cinzel text-xs font-bold text-[#f7c2d2] uppercase tracking-wider">
                  {transferInfo.entity}
                </span>
              </div>

              <div>
                <span className="text-[9px] uppercase tracking-widest text-[#f0afc3] block">
                  ALIAS
                </span>
                <span className="text-2xl font-mono font-bold tracking-widest text-white drop-shadow-sm">
                  {transferInfo.alias}
                </span>
              </div>

              <div className="flex justify-between items-end border-t border-rose-300/20 pt-2">
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-[#e69bb1] block">
                    TITULAR
                  </span>
                  <span className="text-xs font-serif font-semibold text-rose-100 uppercase tracking-wide">
                    {transferInfo.accountHolder}
                  </span>
                </div>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
            </div>
          </div>

          {/* Detailed Bank Fields with 1-Click Copy Buttons (Right 7 Cols) */}
          <div className="md:col-span-7 flex flex-col gap-3">
            
            {/* Alias Box (Highlighted) */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/90 border border-[#eec2cf] shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#faebef] border border-[#e89db4] flex items-center justify-center text-[#9c4c68]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[9px] font-cinzel uppercase tracking-wider text-[#9c5a70]">
                    Alias
                  </span>
                  <span className="text-base font-mono font-bold text-[#68243a]">
                    {transferInfo.alias}
                  </span>
                </div>
              </div>

              <button
                id="copy-bank-alias-btn"
                onClick={() => copyToClipboard(transferInfo.alias, 'alias')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d87c98] hover:bg-[#c96987] text-white text-xs font-cinzel font-bold tracking-wider shadow-sm transition-all cursor-pointer"
              >
                {copiedField === 'alias' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Alias</span>
                  </>
                )}
              </button>
            </div>

            {/* Bank Entity */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/90 border border-[#eec2cf] shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#faebef] border border-[#eec2cf] flex items-center justify-center text-[#9c4c68]">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[9px] font-cinzel uppercase tracking-wider text-[#9c5a70]">
                    Entidad Bancaria
                  </span>
                  <span className="text-sm font-serif font-bold text-[#68243a]">
                    {transferInfo.entity}
                  </span>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(transferInfo.entity, 'entity')}
                className="p-2 text-[#9c5a70] hover:text-[#68243a] transition-colors cursor-pointer"
                title="Copiar entidad"
              >
                {copiedField === 'entity' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Holder Name */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/90 border border-[#eec2cf] shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#faebef] border border-[#eec2cf] flex items-center justify-center text-[#9c4c68]">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[9px] font-cinzel uppercase tracking-wider text-[#9c5a70]">
                    Nombre del Titular
                  </span>
                  <span className="text-sm font-serif font-bold text-[#68243a]">
                    {transferInfo.accountHolder}
                  </span>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(transferInfo.accountHolder, 'holder')}
                className="p-2 text-[#9c5a70] hover:text-[#68243a] transition-colors cursor-pointer"
                title="Copiar titular"
              >
                {copiedField === 'holder' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Copy All Button */}
            <button
              onClick={copyAllDetails}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-gradient-to-r from-[#d87c98] via-[#e28ca4] to-[#cc6886] hover:from-[#c96987] hover:to-[#b85474] text-white font-cinzel font-bold text-xs uppercase tracking-wider shadow-md shadow-[#9c4c68]/20 transition-all cursor-pointer mt-1"
            >
              {copiedAll ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Datos copiados al portapapeles!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Todos los Datos</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Lluvia de Sobres Physical Envelope Note */}
        <div className="mt-6 pt-4 border-t border-[#eec2cf] flex items-center justify-center gap-1.5 text-center text-xs text-[#8a4a5e] font-serif italic relative z-10">
          <Heart className="w-3.5 h-3.5 text-[#c26d87] fill-[#c26d87]/30 shrink-0" />
          <span>También contaremos con un cofre de sobres y deseos en el salón durante la fiesta.</span>
        </div>
      </div>
    </section>
  );
};
