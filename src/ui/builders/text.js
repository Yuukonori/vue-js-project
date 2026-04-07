import { h } from 'vue'
import { token, colors, fontSize, fontWeight, spacing } from '../tokens.js'

/**
 * buildText(content, options) — Typography builder
 *
 * Options:
 *   tag        {string}    HTML tag. Default auto-selects from variant.
 *   variant    {'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'p'|'span'|'label'|'caption'|'overline'}
 *   size       {string}    Font size token or raw CSS value
 *   weight     {string}    Font weight token or raw value
 *   color      {string}    Color token or raw CSS value
 *   align      {'left'|'center'|'right'|'justify'}
 *   italic     {boolean}
 *   underline  {boolean}
 *   strike     {boolean}
 *   truncate   {boolean}   Single-line overflow ellipsis
 *   lines      {number}    Multi-line clamp (requires truncate: true)
 *   opacity    {number}
 *   width      {string}
 *   height     {string}
 *   pad        {string}    Padding
 *   margin     {string}    Margin
 *   lineHeight {string}
 *   letterSpacing {string}
 *   style      {object}
 *   class      {string}
 */

const variantDefaults = {
  h1:      { tag: 'h1',    size: '4xl',  weight: 'bold'    },
  h2:      { tag: 'h2',    size: '3xl',  weight: 'bold'    },
  h3:      { tag: 'h3',    size: '2xl',  weight: 'semibold' },
  h4:      { tag: 'h4',    size: 'xl',   weight: 'semibold' },
  h5:      { tag: 'h5',    size: 'lg',   weight: 'medium'  },
  h6:      { tag: 'h6',    size: 'md',   weight: 'medium'  },
  p:       { tag: 'p',     size: 'base', weight: 'normal'  },
  span:    { tag: 'span',  size: 'base', weight: 'normal'  },
  label:   { tag: 'label', size: 'sm',   weight: 'medium'  },
  caption: { tag: 'span',  size: 'xs',   weight: 'normal'  },
  overline:{ tag: 'span',  size: 'xs',   weight: 'semibold' },
}

function normalizeCssSize(value) {
  if (value === undefined || value === null) return undefined
  if (typeof value === 'number') return `${value}px`
  if (typeof value === 'string' && /^\d+(\.\d+)?$/.test(value.trim())) return `${value}px`
  return value
}

export function buildText(content, options = {}) {
  // Allow buildText({ content, ...options }) as single-arg call
  if (typeof content === 'object' && content !== null && !Array.isArray(content)) {
    options = content
    content = options.content ?? ''
  }

  const variant = options.variant ?? 'p'
  const defaults = variantDefaults[variant] ?? variantDefaults.p
  const resolvedTag = options.tag ?? defaults.tag

  const {
    size       = defaults.size,
    weight     = defaults.weight,
    color,
    align,
    italic,
    underline,
    strike,
    truncate,
    lines,
    opacity,
    width,
    height,
    pad,
    margin,
    lineHeight,
    letterSpacing,
    style = {},
    class: className,
    onPressed,
    onClick,
  } = options
  const handlePress = onPressed ?? onClick

  const decorations = [
    underline && 'underline',
    strike    && 'line-through',
  ].filter(Boolean).join(' ') || undefined

  const resolvedFontSize = normalizeCssSize(token(fontSize, size))

  const computedStyle = {
    fontSize:       resolvedFontSize,
    fontWeight:     token(fontWeight, weight),
    color:          token(colors, color),
    textAlign:      align,
    fontStyle:      italic ? 'italic' : undefined,
    textDecoration: decorations,
    width,
    height,
    opacity:        opacity,
    padding:        token(spacing, pad),
    margin:         token(spacing, margin),
    lineHeight,
    letterSpacing,
    // overline text transform
    textTransform:  variant === 'overline' ? 'uppercase' : undefined,
    // truncate
    overflow:       truncate ? 'hidden' : undefined,
    textOverflow:   truncate ? 'ellipsis' : undefined,
    whiteSpace:     truncate && !lines ? 'nowrap' : undefined,
    display:        lines ? '-webkit-box' : undefined,
    WebkitLineClamp: lines,
    WebkitBoxOrient: lines ? 'vertical' : undefined,
    ...style,
  }

  Object.keys(computedStyle).forEach(k => computedStyle[k] === undefined && delete computedStyle[k])

  return h(resolvedTag, { style: computedStyle, class: className, onClick: handlePress }, content)
}
