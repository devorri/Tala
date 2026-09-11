/**
 * TALA Brand Theme & Summer Vibe Palette
 * Project SEMINA: Smart Agriculture System
 */

import { Platform } from 'react-native';

export const BrandColors = {
  primaryBlue: '#1C3829',      // Dark Forest Green
  primaryBlueDark: '#14291E',
  primaryBlueLight: '#EBF0E6',
  
  tealGreen: '#1C3829',        // Dark Forest Green
  tealGreenDark: '#14291E',
  tealGreenLight: '#EBF0E6',
  
  goldenYellow: '#A3E635',     // Fresh Lime Green Accent
  goldenYellowDark: '#65A30D',
  goldenYellowLight: '#F4FAD8',
  
  // Base & Neutral colors
  white: '#FFFFFF',
  cardBg: '#FFFFFF',
  lightBackground: '#FAF9F5',  // Organic Warm Cream/Beige
  surfaceLight: '#FFFFFF',
  borderLight: '#EFECE6',      // Soft natural border
  borderHover: '#CBD5E1',
  
  charcoal: '#1C2A1E',        // Dark charcoal high contrast
  slate: '#64748B',           // Slate 500
  mutedText: '#94A3B8',       // Slate 400
  
  // Status semantic
  danger: '#EF4444',
  dangerLight: '#FEF2F2',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  success: '#15803D',
  successLight: '#DCFCE7',
  info: '#1C3829',
  infoLight: '#EBF0E6',
  
  // Skeleton & Shimmer
  skeletonBase: '#E5E3DB',
  skeletonHighlight: '#F4F2EA',
};

// Reusable values for screens displayed on top of the TALA farm image.
export const Glass = {
  // Kept in lockstep with components/ui/GlassCard.tsx (Home screen).
  surface: 'rgba(18, 38, 28, 0.72)',
  surfaceStrong: 'rgba(18, 38, 28, 0.85)',
  surfaceSoft: 'rgba(0, 0, 0, 0.28)',
  border: 'rgba(255, 255, 255, 0.18)',
  text: '#FFFFFF',
  mutedText: 'rgba(255, 255, 255, 0.80)',
};

export const Gradients = {
  summerVibe: ['#1C3829', '#274D38'] as const,
  blueToTeal: ['#1C3829', '#2E5A43'] as const,
  tealToYellow: ['#1C3829', '#A3E635'] as const,
  cardHeader: ['#1C3829', '#274D38'] as const,
  cardTeal: ['#1C3829', '#2E5A43'] as const,
  sunshine: ['#A3E635', '#BEF264'] as const,
  skeleton: ['#E5E3DB', '#FAF9F5', '#E5E3DB'] as const,
  darkOverlay: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.65)'] as const,
};

export const Colors = {
  light: {
    text: BrandColors.charcoal,
    textSecondary: BrandColors.slate,
    background: BrandColors.lightBackground,
    card: BrandColors.white,
    tint: '#1C3829',
    tabBarActive: '#1C3829',
    tabBarInactive: '#94A3B8',
    icon: '#1C3829',
    border: BrandColors.borderLight,
  },
  dark: {
    text: '#FAF9F5',
    textSecondary: '#94A3B8',
    background: '#14291E',
    card: '#1C3829',
    tint: '#A3E635',
    tabBarActive: '#A3E635',
    tabBarInactive: '#64748B',
    icon: '#A3E635',
    border: 'rgba(255,255,255,0.1)',
  },
};

export const Typography = {
  fontFamily: {
    heading: Platform.select({
      ios: 'Poppins-SemiBold',
      android: 'Poppins_600SemiBold',
      web: "'Poppins', -apple-system, sans-serif",
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'Poppins-Bold',
      android: 'Poppins_700Bold',
      web: "'Poppins', -apple-system, sans-serif",
      default: 'System',
    }),
    regular: Platform.select({
      ios: 'System',
      android: 'Poppins_400Regular',
      web: "'Poppins', -apple-system, sans-serif",
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'Poppins_500Medium',
      web: "'Poppins', -apple-system, sans-serif",
      default: 'System',
    }),
  },
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    giant: 34,
  },
};

// Generous, breathable spacing scale
export const Spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  xxl: 38,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  full: 9999,
};

export const Shadows = {
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 5,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  hover: {
    shadowColor: '#1998D3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 5,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
