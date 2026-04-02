import { h } from 'vue'

/**
 * buildCheckbox(options) — Checkbox with label
 *
 * Options:
 *   label      {string}    Label text
 *   checked    {boolean}   Checked state. Default: false
 *   display    {boolean}   Show a bordered card around it. Default: false
 *   width      {number}    px width
 *   height     {number}    px height
 *   disabled   {boolean}
 *   color      {string}    Checked color. Default: '#6366f1'
 *   onClick    {function}
 */
export function buildCheckbox(options = {}) {
  const {
    label    = '',
    checked  = false,
    display  = false,
    width,
    height,
    disabled = false,
    color    = '#6366f1',
    onClick,
  } = options

  const checkIcon = h('svg', {
    width: 18, height: 18,
    viewBox: '0 0 24 24',
    fill: checked ? color : 'none',
    stroke: checked ? color : '#94a3b8',
    'stroke-width': 2,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    style: { flexShrink: 0, transition: 'all 0.15s' },
  }, [
    checked
      ? h('path', { d: 'M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11' })
      : h('rect', { x: 3, y: 3, width: 18, height: 18, rx: 3, ry: 3 }),
  ])

  return h('div', {
    style: {
      display:      'inline-flex',
      alignItems:   'center',
      gap:          '8px',
      padding:      display ? '8px 12px' : '4px 0',
      background:   display ? '#ffffff' : 'transparent',
      border:       display ? '1px solid #e2e8f0' : 'none',
      borderRadius: display ? '9px' : '0',
      cursor:       disabled ? 'not-allowed' : 'pointer',
      opacity:      disabled ? 0.5 : 1,
      userSelect:   'none',
      width:        width ? `${width}px` : undefined,
      height:       height ? `${height}px` : undefined,
      boxSizing:    'border-box',
    },
    onClick: disabled ? undefined : onClick,
  }, [
    checkIcon,
    label ? h('span', {
      style: { fontSize: '14px', color: '#334155', lineHeight: 1.4 },
    }, label) : null,
  ].filter(Boolean))
}
