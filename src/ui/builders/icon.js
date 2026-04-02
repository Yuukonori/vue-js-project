import { h } from 'vue'
import { token, colors } from '../tokens.js'

/**
 * buildIcon(name, options) — SVG icon builder
 *
 * Built-in icon names: 'home' | 'menu' | 'close' | 'search' | 'bell' | 'user'
 *   | 'settings' | 'chevron-down' | 'chevron-up' | 'chevron-left' | 'chevron-right'
 *   | 'check' | 'plus' | 'minus' | 'edit' | 'trash' | 'eye' | 'eye-off'
 *   | 'mail' | 'phone' | 'calendar' | 'clock' | 'star' | 'heart' | 'link'
 *   | 'upload' | 'download' | 'refresh' | 'logout' | 'lock' | 'unlock'
 *   | 'arrow-left' | 'arrow-right' | 'arrow-up' | 'arrow-down'
 *
 * Options:
 *   size     {number|string}  px size. Default: 20
 *   color    {string}         Color token or raw CSS value
 *   stroke   {number}         Stroke width. Default: 2
 *   onClick  {function}
 *   style    {object}
 *   class    {string}
 */

const icons = {
  'home':          'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
  'menu':          'M3 12h18 M3 6h18 M3 18h18',
  'close':         'M18 6L6 18 M6 6l12 12',
  'search':        'M11 19a8 8 0 100-16 8 8 0 000 16z M21 21l-4.35-4.35',
  'bell':          'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0',
  'user':          'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z',
  'settings':      'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
  'chevron-down':  'M6 9l6 6 6-6',
  'chevron-up':    'M18 15l-6-6-6 6',
  'chevron-left':  'M15 18l-6-6 6-6',
  'chevron-right': 'M9 18l6-6-6-6',
  'check':         'M20 6L9 17l-5-5',
  'plus':          'M12 5v14 M5 12h14',
  'minus':         'M5 12h14',
  'edit':          'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  'trash':         'M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6',
  'eye':           'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z',
  'eye-off':       'M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94 M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19 M1 1l22 22',
  'mail':          'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
  'phone':         'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z',
  'calendar':      'M3 9h18 M16 2v4 M8 2v4 M3 4h18v18H3z',
  'clock':         'M12 2a10 10 0 100 20 10 10 0 000-20z M12 6v6l4 2',
  'star':          'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'heart':         'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
  'link':          'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71 M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
  'upload':        'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12',
  'download':      'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  'refresh':       'M1 4v6h6 M23 20v-6h-6 M20.49 9A9 9 0 005.64 5.64L1 10 M23 14l-4.64 4.36A9 9 0 013.51 15',
  'logout':        'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9',
  'lock':          'M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 0110 0v4',
  'unlock':        'M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 019.9-1',
  'arrow-left':    'M19 12H5 M12 19l-7-7 7-7',
  'arrow-right':   'M5 12h14 M12 5l7 7-7 7',
  'arrow-up':      'M12 19V5 M5 12l7-7 7 7',
  'arrow-down':    'M12 5v14 M19 12l-7 7-7-7',
  'grid':          'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  'list':          'M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01',
  'dashboard':     'M3 3h8v8H3z M13 3h8v8h-8z M3 13h8v8H3z M13 13h8v8h-8z',
  'chart':         'M18 20V10 M12 20V4 M6 20v-6',
  'info':          'M12 22a10 10 0 100-20 10 10 0 000 20z M12 16v-4 M12 8h.01',
  'warning':       'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01',
  'circle-check':  'M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3',
}

export function buildIcon(name, options = {}) {
  if (typeof name === 'object' && name !== null) {
    options = name
    name = options.name ?? 'circle-check'
  }

  const {
    size   = 20,
    color,
    stroke = 2,
    onClick,
    style  = {},
    class: className,
  } = options

  const paths = icons[name]
  if (!paths) console.warn(`[buildIcon] Unknown icon: "${name}"`)

  const pathNodes = paths
    ? paths.split(' M').map((d, i) => h('path', {
        key: i,
        d: i === 0 ? d : 'M' + d,
        fill: 'none',
      }))
    : []

  return h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width:  size,
    height: size,
    viewBox: '0 0 24 24',
    stroke: token(colors, color) ?? 'currentColor',
    strokeWidth: stroke,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none',
    style: {
      flexShrink: 0,
      cursor: onClick ? 'pointer' : undefined,
      ...style,
    },
    class: className,
    onClick,
  }, pathNodes)
}
