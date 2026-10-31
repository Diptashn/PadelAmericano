import { useTournamentStore } from '../store/tournamentStore';

export const DARK_COLORS = {
  // Core Athletic Dark Palette
  background: '#090D14',       // Deepest slate black
  surface: '#111827',          // Card graphite surface
  surfaceCard: '#151E2E',      // Elevated court card
  surfaceElevated: '#1E293B',  // Dialogs, pills, steppers
  surfaceBorder: '#293548',    // Subtle graphite borders
  surfaceBorderHighlight: '#3B4A63',

  // Signature Padel Neon Lime
  primary: '#CCFF00',          // Electric Padel Lime
  primaryDark: '#A6D600',
  primaryLight: '#E5FF66',
  primaryGlow: 'rgba(204, 255, 0, 0.25)',
  primarySurface: 'rgba(204, 255, 0, 0.1)',

  // Secondary & Accents
  accentCyan: '#00F0FF',       // High-energy court blue
  accentCyanSurface: 'rgba(0, 240, 255, 0.1)',
  accentOrange: '#FF6B00',     // Energetic orange
  accentOrangeSurface: 'rgba(255, 107, 0, 0.12)',

  // Standings & Podium
  podiumGold: '#F59E0B',
  podiumGoldSurface: 'rgba(245, 158, 11, 0.18)',
  podiumSilver: '#94A3B8',
  podiumSilverSurface: 'rgba(148, 163, 184, 0.18)',
  podiumBronze: '#D97706',
  podiumBronzeSurface: 'rgba(217, 119, 6, 0.18)',

  // Text
  text: '#F8FAFC',             // Crisp white
  textSecondary: '#94A3B8',    // Slate light
  textMuted: '#64748B',        // Muted labels
  textDark: '#090D14',         // Dark text on neon buttons
  buttonText: '#090D14',       // Contrast text for primary buttons

  // Status & Notifications
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  dangerSurface: 'rgba(239, 68, 68, 0.12)',
  whatsapp: '#25D366',         // WhatsApp Brand Green
  whatsappDark: '#128C7E',
};

export const LIGHT_COLORS = {
  // Clean Athletic Crisp Light Palette
  background: '#F1F5F9',       // Clean athletic slate background
  surface: '#FFFFFF',          // Pure white surface
  surfaceCard: '#FFFFFF',      // White elevated cards
  surfaceElevated: '#E2E8F0',  // Light grey pills & steppers
  surfaceBorder: '#E2E8F0',    // Crisp border
  surfaceBorderHighlight: '#CBD5E1',

  // Athletic Court Green/Lime
  primary: '#65A30D',          // Rich Padel court lime green with high contrast
  primaryDark: '#4D7C0F',
  primaryLight: '#84CC16',
  primaryGlow: 'rgba(101, 163, 13, 0.22)',
  primarySurface: 'rgba(101, 163, 13, 0.12)',

  // Secondary & Accents
  accentCyan: '#0284C7',       // Vivid athletic blue
  accentCyanSurface: 'rgba(2, 132, 199, 0.12)',
  accentOrange: '#EA580C',
  accentOrangeSurface: 'rgba(234, 88, 12, 0.12)',

  // Standings & Podium
  podiumGold: '#D97706',
  podiumGoldSurface: 'rgba(217, 119, 6, 0.15)',
  podiumSilver: '#64748B',
  podiumSilverSurface: 'rgba(100, 116, 139, 0.12)',
  podiumBronze: '#B45309',
  podiumBronzeSurface: 'rgba(180, 83, 9, 0.12)',

  // Text
  text: '#0F172A',             // Dark slate
  textSecondary: '#475569',    // Medium slate
  textMuted: '#94A3B8',        // Muted text
  textDark: '#FFFFFF',         // White text on primary buttons
  buttonText: '#FFFFFF',       // Crisp white text on primary buttons

  // Status & Notifications
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
  dangerSurface: 'rgba(220, 38, 38, 0.1)',
  whatsapp: '#25D366',
  whatsappDark: '#128C7E',
};

// Default static fallback for any static references
export const COLORS = DARK_COLORS;

export type ColorPalette = typeof DARK_COLORS;

export const FONTS = {
  bold: '700',
  semiBold: '600',
  medium: '500',
  regular: '400',
};

export const SHADOWS = {
  primaryGlow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modal: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
};

/**
 * Reactive Theme Hook
 * Automatically causes any component calling useTheme() to re-render
 * when the user toggles between dark and light themes!
 */
export function useTheme() {
  const themeMode = useTournamentStore((s) => s.themeMode);
  const toggleTheme = useTournamentStore((s) => s.toggleTheme);
  const setThemeMode = useTournamentStore((s) => s.setThemeMode);
  const isDark = themeMode !== 'light';
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  const shadows = {
    primaryGlow: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.35 : 0.22,
      shadowRadius: 10,
      elevation: 6,
    },
    card: {
      shadowColor: isDark ? '#000000' : '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 8,
      elevation: isDark ? 4 : 2,
    },
    modal: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDark ? 0.5 : 0.2,
      shadowRadius: 16,
      elevation: 10,
    },
  };

  return {
    colors,
    isDark,
    themeMode,
    toggleTheme,
    setThemeMode,
    shadows,
  };
}
