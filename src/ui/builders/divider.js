import { h } from 'vue'
import { token, colors, spacing } from '../tokens.js'

/**
 * buildDivider(options) — Horizontal or vertical separator
 *
 * Options:
 *   direction  {'h'|'v'}    Default: 'h' (horizontal)
 *   color      {string}     Line color. Default: '#e2e8f0'
 *   thickness  {string}     Default: '1px'
 *   margin     {string}     Vertical margin (h) or horizontal margin (v)
 *   label      {string}     Optional text in the center of divider
 *   style      {object}
 */
export function buildDivider(options = {}) {
  const {
    direction = 'h',
    color     = '#e2e8f0',
    thickness = '1px',
    margin,
    label,
    style     = {},
  } = options

  if (label) {
    return h('div', {
      style: {
        display:    'flex',
        alignItems: 'center',
        gap:        '12px',
        margin:     token(spacing, margin ?? '4') + ' 0',
        ...style,
      }
    }, [
      h('div', { style: { flex: 1, height: thickness, background: token(colors, color) } }),
      h('span', { style: { fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap' } }, label),
      h('div', { style: { flex: 1, height: thickness, background: token(colors, color) } }),
    ])
  }

  const isH = direction === 'h'
  return h('div', {
    style: {
      width:      isH ? '100%' : thickness,
      height:     isH ? thickness : '100%',
      background: token(colors, color),
      margin:     isH
        ? `${token(spacing, margin ?? '4')} 0`
        : `0 ${token(spacing, margin ?? '4')}`,
      flexShrink: 0,
      ...style,
    }
  })
}
