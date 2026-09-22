export interface BrandTheme {
  bg: string;
  text: string;
  border: string;
  badgeBg: string;
  glowColor: string;
}

export const BRAND_THEMES: Record<string, BrandTheme> = {
  PPA: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    glowColor: '#f59e0b'
  },
  Peccinin: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    glowColor: '#3b82f6'
  },
  Intelbras: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    glowColor: '#10b981'
  },
  JFL: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/30',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
    glowColor: '#ef4444'
  },
  Asus: {
    bg: 'bg-red-600/10',
    text: 'text-red-400',
    border: 'border-red-600/30',
    badgeBg: 'bg-red-600/20 text-red-300 border-red-600/40',
    glowColor: '#dc2626'
  },
  IPEC: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    glowColor: '#f97316'
  },
  Garen: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    glowColor: '#a855f7'
  },
  Rossi: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    glowColor: '#f43f5e'
  }
};

export const getBrandTheme = (brand: string): BrandTheme => {
  return (
    BRAND_THEMES[brand] || {
      bg: 'bg-red-950/40',
      text: 'text-red-400',
      border: 'border-red-800/40',
      badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
      glowColor: '#ef4444'
    }
  );
};
