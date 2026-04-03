import { h } from 'vue'
import { token, colors, spacing, radius, fontSize, fontWeight, shadow } from '../tokens.js'

/**
 * buildButton(label, options) — Button builder
 *
 * Options:
 *   label      {string|VNode}   Button text or child node
 *   variant    {'solid'|'outline'|'ghost'|'link'}   Default: 'solid'
 *   color      {string}         Color scheme token key. Default: 'primary'
 *   size       {'xs'|'sm'|'md'|'lg'|'xl'}           Default: 'md'
 *   radius     {string}         Border radius token. Default: 'md'
 *   width      {string}         Explicit width (overrides full)
 *   height     {string}         Explicit height (overrides size preset)
 *   full       {boolean}        width: 100%
 *   disabled   {boolean}
 *   loading    {boolean}        Shows spinner, disables interaction
 *   icon       {VNode}          Icon to prepend
 *   iconRight  {VNode}          Icon to append
 *   onClick    {function}
 *   style      {object}
 *   class      {string}
 *   attrs      {object}         Extra HTML attributes (e.g. type, name)
 */

const sizeMap = {
  xs: { pad: '2px 8px',    font: 'xs', height: '24px' },
  sm: { pad: '4px 12px',   font: 'sm', height: '32px' },
  md: { pad: '8px 18px',   font: 'base', height: '40px' },
  lg: { pad: '10px 24px',  font: 'lg', height: '48px' },
  xl: { pad: '12px 32px',  font: 'xl', height: '56px' },
}

const colorMap = {
  primary:   { base: '#6366f1', dark: '#4f46e5', text: '#fff', border: '#6366f1' },
  secondary: { base: '#8b5cf6', dark: '#7c3aed', text: '#fff', border: '#8b5cf6' },
  accent:    { base: '#06b6d4', dark: '#0891b2', text: '#fff', border: '#06b6d4' },
  success:   { base: '#22c55e', dark: '#16a34a', text: '#fff', border: '#22c55e' },
  warning:   { base: '#f59e0b', dark: '#d97706', text: '#fff', border: '#f59e0b' },
  error:     { base: '#ef4444', dark: '#dc2626', text: '#fff', border: '#ef4444' },
  neutral:   { base: '#64748b', dark: '#475569', text: '#fff', border: '#64748b' },
}

export function buildButton(label, options = {}) {
  if (typeof label === 'object' && label !== null && !Array.isArray(label)) {
    options = label
    label = options.label ?? ''
  }

  const {
    variant  = 'solid',
    color    = 'primary',
    size     = 'md',
    radius: radiusProp = 'md',
    width,
    height,
    full,
    disabled,
    loading,
    icon,
    iconRight,
    onClick,
    style    = {},
    class: className,
    attrs    = {},
  } = options

  const sz  = sizeMap[size] ?? sizeMap.md
  const clr = colorMap[color] ?? colorMap.primary

  const variantStyles = {
    solid: {
      background: disabled || loading ? '#94a3b8' : clr.base,
      color: clr.text,
      border: `1.5px solid ${disabled || loading ? '#94a3b8' : clr.base}`,
    },
    outline: {
      background: 'transparent',
      color: disabled || loading ? '#94a3b8' : clr.base,
      border: `1.5px solid ${disabled || loading ? '#94a3b8' : clr.border}`,
    },
    ghost: {
      background: 'transparent',
      color: disabled || loading ? '#94a3b8' : clr.base,
      border: '1.5px solid transparent',
    },
    link: {
      background: 'transparent',
      color: disabled || loading ? '#94a3b8' : clr.base,
      border: 'none',
      padding: '0',
      textDecoration: 'underline',
    },
  }

  const computedStyle = {
    display:        'inline-flex',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            '6px',
    padding:        sz.pad,
    height:         sz.height,
    fontSize:       token(fontSize, sz.font),
    fontWeight:     token(fontWeight, 'medium'),
    borderRadius:   token(radius, radiusProp),
    cursor:         disabled || loading ? 'not-allowed' : 'pointer',
    width:          width ?? (full ? '100%' : undefined),
    height:         height ?? sz.height,
    transition:     'all 0.15s ease',
    outline:        'none',
    userSelect:     'none',
    fontFamily:     'inherit',
    ...variantStyles[variant],
    ...style,
  }

  Object.keys(computedStyle).forEach(k => computedStyle[k] === undefined && delete computedStyle[k])

  const spinner = loading
    ? h('span', {
        style: {
          width: '14px', height: '14px',
          border: '2px solid currentColor',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          display: 'inline-block',
          animation: 'btn-spin 0.6s linear infinite',
        }
      })
    : null

  const children = [
    spinner,
    icon && !loading ? icon : null,
    label ? h('span', {}, loading ? 'Loading...' : label) : null,
    iconRight && !loading ? iconRight : null,
  ].filter(Boolean)

  const canHover = !(disabled || loading)
  const handleMouseenter = (e) => {
    if (canHover && variant !== 'link') e.currentTarget.style.filter = 'brightness(0.94)'
    if (typeof attrs.onMouseenter === 'function') attrs.onMouseenter(e)
  }
  const handleMouseleave = (e) => {
    if (canHover && variant !== 'link') e.currentTarget.style.filter = ''
    if (typeof attrs.onMouseleave === 'function') attrs.onMouseleave(e)
  }

  return h(
    'button',
    {
      style: computedStyle,
      class: className,
      disabled: disabled || loading,
      onClick: disabled || loading ? undefined : onClick,
      onMouseenter: handleMouseenter,
      onMouseleave: handleMouseleave,
      ...attrs,
    },
    children,
  )
}

