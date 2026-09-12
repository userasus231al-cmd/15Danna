import { ThemeStyle } from '../types';

export interface ThemeConfig {
  id: ThemeStyle;
  name: string;
  badge: string;
  bgGradient: string;
  cardBg: string;
  cardBorder: string;
  cardInnerGlow: string;
  accentText: string;
  accentTitle: string;
  buttonPrimary: string;
  buttonSecondary: string;
  ornamentColor: string;
  glowColor: string;
  goldShine: string;
}

export const THEME_CONFIGS: Record<ThemeStyle, ThemeConfig> = {
  'luxury-gold': {
    id: 'luxury-gold',
    name: 'Oro Real & Noche Mágica',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    bgGradient: 'from-[#0b0a09] via-[#141210] to-[#0a0807]',
    cardBg: 'bg-[#181614]/90 backdrop-blur-xl',
    cardBorder: 'border-amber-500/30 hover:border-amber-400/50',
    cardInnerGlow: 'shadow-[0_0_50px_-12px_rgba(245,158,11,0.15)]',
    accentText: 'text-amber-300',
    accentTitle: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-100',
    buttonPrimary: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-stone-950 font-bold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:brightness-110',
    buttonSecondary: 'border border-amber-400/40 bg-amber-950/30 text-amber-200 hover:bg-amber-900/40 hover:border-amber-300',
    ornamentColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.25)',
    goldShine: 'bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300'
  },
  'rose-gold': {
    id: 'rose-gold',
    name: 'Rose Gold & Romance',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    bgGradient: 'from-[#140b10] via-[#1a0f16] to-[#0f070d]',
    cardBg: 'bg-[#1e111a]/90 backdrop-blur-xl',
    cardBorder: 'border-rose-400/30 hover:border-rose-300/50',
    cardInnerGlow: 'shadow-[0_0_50px_-12px_rgba(244,63,94,0.18)]',
    accentText: 'text-rose-300',
    accentTitle: 'text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-amber-100',
    buttonPrimary: 'bg-gradient-to-r from-rose-400 via-rose-300 to-pink-500 text-stone-950 font-bold shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:brightness-110',
    buttonSecondary: 'border border-rose-400/40 bg-rose-950/30 text-rose-200 hover:bg-rose-900/40 hover:border-rose-300',
    ornamentColor: '#fda4af',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    goldShine: 'bg-gradient-to-r from-rose-200 via-pink-100 to-rose-300'
  },
  'royal-emerald': {
    id: 'royal-emerald',
    name: 'Esmeralda Imperial & Dorado',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    bgGradient: 'from-[#06140f] via-[#091a14] to-[#040f0b]',
    cardBg: 'bg-[#0b1f19]/90 backdrop-blur-xl',
    cardBorder: 'border-emerald-400/30 hover:border-amber-400/50',
    cardInnerGlow: 'shadow-[0_0_50px_-12px_rgba(16,185,129,0.18)]',
    accentText: 'text-emerald-300',
    accentTitle: 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-amber-200 to-yellow-100',
    buttonPrimary: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-500 text-stone-950 font-bold shadow-lg shadow-emerald-500/25 hover:shadow-amber-500/40 hover:brightness-110',
    buttonSecondary: 'border border-emerald-400/40 bg-emerald-950/30 text-emerald-200 hover:bg-emerald-900/40 hover:border-emerald-300',
    ornamentColor: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.25)',
    goldShine: 'bg-gradient-to-r from-emerald-200 via-amber-100 to-yellow-200'
  },
  'lavender-midnight': {
    id: 'lavender-midnight',
    name: 'Lila Princesa & Medianoche',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    bgGradient: 'from-[#0f0918] via-[#160d24] to-[#0a0512]',
    cardBg: 'bg-[#1a102a]/90 backdrop-blur-xl',
    cardBorder: 'border-purple-400/30 hover:border-purple-300/50',
    cardInnerGlow: 'shadow-[0_0_50px_-12px_rgba(168,85,247,0.18)]',
    accentText: 'text-purple-300',
    accentTitle: 'text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-amber-100',
    buttonPrimary: 'bg-gradient-to-r from-purple-400 via-pink-300 to-purple-500 text-stone-950 font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:brightness-110',
    buttonSecondary: 'border border-purple-400/40 bg-purple-950/30 text-purple-200 hover:bg-purple-900/40 hover:border-purple-300',
    ornamentColor: '#c084fc',
    glowColor: 'rgba(192, 132, 252, 0.25)',
    goldShine: 'bg-gradient-to-r from-purple-200 via-pink-100 to-amber-200'
  },
  'celestial-navy': {
    id: 'celestial-navy',
    name: 'Azul Noche Estrellada & Oro',
    badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    bgGradient: 'from-[#070e1b] via-[#0c162b] to-[#040811]',
    cardBg: 'bg-[#0f1d38]/90 backdrop-blur-xl',
    cardBorder: 'border-sky-400/30 hover:border-amber-300/50',
    cardInnerGlow: 'shadow-[0_0_50px_-12px_rgba(56,189,248,0.18)]',
    accentText: 'text-sky-300',
    accentTitle: 'text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-amber-200 to-yellow-100',
    buttonPrimary: 'bg-gradient-to-r from-amber-400 via-yellow-200 to-sky-400 text-stone-950 font-bold shadow-lg shadow-sky-500/25 hover:shadow-amber-500/40 hover:brightness-110',
    buttonSecondary: 'border border-sky-400/40 bg-sky-950/30 text-sky-200 hover:bg-sky-900/40 hover:border-sky-300',
    ornamentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.25)',
    goldShine: 'bg-gradient-to-r from-sky-200 via-amber-100 to-yellow-200'
  }
};
