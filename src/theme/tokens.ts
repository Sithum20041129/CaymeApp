import { Platform } from 'react-native';

/**
 * Cayman Lighting Design System Tokens
 *
 * Strictly monochrome palette (black, white, and subtle neutral shades)
 * inspired by minimalist architectural & luxury product design.
 */
export const Palette = {
  background: '#FFFFFF',
  surfaceSecondary: '#F6F6F6',
  surfaceTertiary: '#EFEFEF',
  textPrimary: '#111111',
  textSecondary: '#777777',
  textMuted: '#999999',
  buttonPrimary: '#000000',
  buttonText: '#FFFFFF',
  border: '#EAEAEA',
  borderStrong: '#D4D4D4',
  disabled: '#B8B8B8',
  overlayDark: 'rgba(17, 17, 17, 0.56)',
  overlayLight: 'rgba(255, 255, 255, 0.92)',
} as const;

export const Spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radii = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const FontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'system-ui',
});

export const Typography = {
  heroTitle: {
    fontFamily: FontFamily,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '600' as const,
    letterSpacing: -0.6,
  },
  h1: {
    fontFamily: FontFamily,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '600' as const,
    letterSpacing: -0.4,
  },
  h2: {
    fontFamily: FontFamily,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  h3: {
    fontFamily: FontFamily,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.1,
  },
  body: {
    fontFamily: FontFamily,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontFamily: FontFamily,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500' as const,
  },
  caption: {
    fontFamily: FontFamily,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
  captionMedium: {
    fontFamily: FontFamily,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500' as const,
  },
  micro: {
    fontFamily: FontFamily,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500' as const,
    letterSpacing: 0.4,
  },
} as const;

export const Layout = {
  screenPadding: Spacing.md,
  cardGap: Spacing.sm,
  sectionGap: Spacing.xl,
  maxContentWidth: 960,
} as const;
