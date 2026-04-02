/**
 * Design Tokens — single source of truth for colors, spacing, typography, etc.
 * Use these in builder options for consistency.
 */

export const colors = {
  // Brand
  primary:   '#6366f1',
  secondary: '#8b5cf6',
  accent:    '#06b6d4',

  // Semantic
  success:   '#22c55e',
  warning:   '#f59e0b',
  error:     '#ef4444',
  info:      '#3b82f6',

  // Neutrals
  white:     '#ffffff',
  black:     '#000000',
  gray50:    '#f8fafc',
  gray100:   '#f1f5f9',
  gray200:   '#e2e8f0',
  gray300:   '#cbd5e1',
  gray400:   '#94a3b8',
  gray500:   '#64748b',
  gray600:   '#475569',
  gray700:   '#334155',
  gray800:   '#1e293b',
  gray900:   '#0f172a',

  // Transparent
  transparent: 'transparent',
}

export const spacing = {
  0:  '0px',
  1:  '4px',
  2:  '8px',
  3:  '12px',
  4:  '16px',
  5:  '20px',
  6:  '24px',
  8:  '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
}

export const fontSize = {
  xs:   '11px',
  sm:   '13px',
  base: '15px',
  md:   '16px',
  lg:   '18px',
  xl:   '20px',
  '2xl': '24px',
  '3xl': '30px',
  '4xl': '36px',
  '5xl': '48px',
}

export const fontWeight = {
  light:    '300',
  normal:   '400',
  medium:   '500',
  semibold: '600',
  bold:     '700',
}

export const radius = {
  none: '0px',
  sm:   '4px',
  md:   '8px',
  lg:   '12px',
  xl:   '16px',
  '2xl':'24px',
  full: '9999px',
}

export const shadow = {
  none: 'none',
  sm:   '0 1px 2px rgba(0,0,0,0.05)',
  md:   '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
  lg:   '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
  xl:   '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
}

/** Resolve a token value or pass through a raw CSS value */
export function token(map, value) {
  if (value === undefined || value === null) return undefined
  return map[value] ?? value
}
