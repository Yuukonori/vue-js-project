/**
 * Theme Colors + Design Tokens
 * Single source of truth for the app's visual language.
 */

export const colors = {
  // Brand
  primary:   '#6366f1',
  secondary: '#8b5cf6',
  accent:    '#06b6d4',
  brandViolet: '#6f61ff',
  primaryDark: '#4f46e5',
  secondaryDark: '#7c3aed',
  accentDark: '#0891b2',
  brandIndigoSoft: '#eef2ff',
  brandPurpleSoft: '#f5f3ff',
  brandBlueSoft: '#eff6ff',
  brandIndigoPale: '#e0e7ff',
  brandPurplePale: '#ede9fe',

  // Semantic
  success:   '#22c55e',
  warning:   '#f59e0b',
  error:     '#ef4444',
  info:      '#3b82f6',
  neutral:   '#64748b',
  successDark: '#16a34a',
  warningDark: '#d97706',
  errorDark: '#dc2626',
  infoDark: '#2563eb',
  successSoft: '#f0fdf4',
  warningSoft: '#fffbeb',
  errorSoft: '#fef2f2',
  infoSoft: '#dbeafe',
  successMintSoft: '#eaf8f2',
  warningCreamSoft: '#fef3c7',
  warningSoftStrong: '#f9f0bf',
  warningSoftActive: '#f3dd69',
  errorSoftAlt: '#fdeaea',
  errorSoftPale: '#fdf1f2',
  errorSoftStrong: '#f6d5d5',
  statusOffline: '#b91c1c',
  statusBusy: '#c81e1e',
  statusHealthyStrong: '#0e8004',
  statusHealthyBright: '#00e038',
  statusWarningOlive: '#7a7600',
  statusWarningOliveDark: '#6b5b00',
  statusWarningBrown: '#a16207',
  statusWarningBrownDark: '#b45309',
  warningOrange: '#ff7c01',
  errorBright: '#f51818',
  successLine: '#10b981',
  successTextStrong: '#047857',
  successText: '#059669',

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
  slateMid: '#475467',
  slate900Alt: '#1f2937',
  neutral900Alt: '#232a35',
  neutral700Alt: '#5a6273',
  neutral600Alt: '#7e8696',
  gray600Alt: '#6b7280',
  gray700Alt: '#666666',
  gray500Alt: '#9c9c9c',
  gray600Steel: '#585858',
  gray300Alt: '#d7dbe1',
  gray300Steel: '#bfc4cc',
  gray400Steel: '#9ca3af',
  gray500Steel: '#a6abb4',
  gray200Alt: '#e5e7eb',
  gray200Soft: '#e5e7ee',
  gray150: '#e2e5eb',
  gray100Alt: '#f7f8fc',
  gray100Soft: '#F5F7FB',
  gray75: '#fafbfc',
  grayBlue100: '#e5edf7',
  grayBlue200: '#e8eff7',
  grayBlue300: '#dbe2ef',
  grayBlueSurface: '#eef1f8',
  grayTab: '#ebebf0',
  grayTabHover: '#e4e7f0',
  grayTrack: '#ecf0f6',
  textMutedBlue: '#aab7de',
  textMutedBlue2: '#d7deef',
  appNavy900: '#0f1735',
  appNavy700: '#2a355d',
  appNavy500: '#7f8cae',
  chartBlue: '#1f5fc8',
  chartSky: '#52a9dd',
  chartSkyLight: '#74c3f2',
  chartAxisDark: '#2b2f36',
  chartFrame: '#2b313a',
  ringNeutral: '#8a8a8a',
  ringWarning: '#8a7a0a',

  // Transparent
  transparent: 'transparent',
  whiteShort: '#fff',
}

/**
 * Human-readable guidance for when to use each color token.
 * Keep these descriptions updated when adding/changing theme colors.
 */
export const themeColorDescriptions = {
  primary: 'Main brand color for primary buttons, key links, and highlighted identifiers (like Ticket ID).',
  secondary: 'Secondary brand accent for less dominant actions or secondary highlights.',
  accent: 'Accent color for decorative emphasis, charts, or non-critical highlights.',
  success: 'Positive system state: healthy, resolved, online, or completed.',
  warning: 'Caution state: expiring soon, elevated attention, but not critical.',
  error: 'Critical/negative state: alerts, failures, urgent blockers.',
  info: 'Informational status: in-progress, neutral progress indicators, and guidance.',
  neutral: 'Balanced status tone for states that are neither positive nor negative.',
  white: 'Default light surface or text on dark backgrounds.',
  black: 'Strong contrast text/icon color when needed.',
  gray50: 'Lightest background tint.',
  gray100: 'Subtle card background and soft section backgrounds.',
  gray200: 'Light divider/border color.',
  gray300: 'Muted icon/border color.',
  gray400: 'Secondary metadata text.',
  gray500: 'Body secondary text.',
  gray600: 'Readable supporting text.',
  gray700: 'High-contrast body text.',
  gray800: 'Primary heading/content text.',
  gray900: 'Strongest text emphasis.',
  transparent: 'Use when the element should not paint a background.',
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
