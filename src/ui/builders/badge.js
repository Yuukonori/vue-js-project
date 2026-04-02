import { h } from 'vue'
import { token, colors, radius, fontSize, fontWeight } from '../tokens.js'

/**
 * buildBadge(label, options) — Badge / chip / tag builder
 *
 * Options:
 *   color    {string}   Color scheme key or raw CSS. Default: 'primary'
 *   variant  {'solid'|'soft'|'outline'}  Default: 'soft'
 *   size     {'sm'|'md'|'lg'}  Default: 'md'
 *   radius   {string}   Default: 'full'
 *   dot      {boolean}  Prepend colored dot
 *   icon     {VNode}    Prepend icon node
 *   onClose  {function} Show × button, called on click
 *   style    {object}
 *   class    {string}
 */

const colorMap = {
  primary:   { base: '#6366f1', soft: '#eef2ff', text: '#4f46e5' },
  secondary: { base: '#8b5cf6', soft: '#f5f3ff', text: '#7c3aed' },
  success:   { base: '#22c55e', soft: '#f0fdf4', text: '#16a34a' },
  warning:   { base: '#f59e0b', soft: '#fffbeb', text: '#d97706' },
  error:     { base: '#ef4444', soft: '#fef2f2', text: '#dc2626' },
  info:      { base: '#3b82f6', soft: '#eff6ff', text: '#2563eb' },
  neutral:   { base: '#64748b', soft: '#f1f5f9', text: '#475569' },
}

const sizeMap = {
  sm: { pad: '1px 7px',  font: 'xs'  },
  md: { pad: '2px 10px', font: 'xs'  },
  lg: { pad: '4px 12px', font: 'sm'  },
}

export function buildBadge(label, options = {}) {
  if (typeof label === 'object' && label !== null) {
    options = label
    label = options.label ?? ''
  }

  const {
    color   = 'neutral',
    variant = 'soft',
    size    = 'md',
    radius: r = 'full',
    dot,
    icon,
    onClose,
    style   = {},
    class: className,
  } = options

  const clr = colorMap[color] ?? { base: color, soft: color + '22', text: color }
  const sz  = sizeMap[size] ?? sizeMap.md

  const variantStyle = {
    solid:   { background: clr.base,   color: '#fff',      border: `1px solid ${clr.base}` },
    soft:    { background: clr.soft,   color: clr.text,    border: `1px solid ${clr.soft}` },
    outline: { background: 'transparent', color: clr.base, border: `1px solid ${clr.base}` },
  }

  const computedStyle = {
    display:      'inline-flex',
    alignItems:   'center',
    gap:          '4px',
    padding:      sz.pad,
    fontSize:     token(fontSize, sz.font),
    fontWeight:   token(fontWeight, 'semibold'),
    borderRadius: token(radius, r),
    lineHeight:   '1.4',
    ...variantStyle[variant],
    ...style,
  }

  const children = [
    dot ? h('span', {
      style: { width: '6px', height: '6px', borderRadius: '50%', background: clr.base, flexShrink: 0 }
    }) : null,
    icon ?? null,
    h('span', {}, label),
    onClose ? h('button', {
      onClick: onClose,
      style: {
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '0', lineHeight: 1, color: 'inherit', opacity: 0.7,
        fontSize: '14px', marginLeft: '2px',
      }
    }, '×') : null,
  ].filter(Boolean)

  return h('span', { style: computedStyle, class: className }, children)
}

/**
 * buildChip — alias for buildBadge with interactive/removable preset
 */
export function buildChip(label, options = {}) {
  return buildBadge(label, { radius: 'full', ...options })
}
