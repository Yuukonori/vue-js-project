import { h } from 'vue'

/**
 * buildTextBadge(text, options) — Styled text badge / container
 *
 * Options:
 *   colorText      {string}   Text color. Default: '#334155'
 *   colorCon       {string}   Background color. Default: '#f1f5f9'
 *   containerStyle {'square'|'circle'}  Default: 'square'
 *   size           {number}   Font size scale in px. Default: 14
 *   width          {string}   CSS width
 *   height         {string}   CSS height
 *   padding        {string}   CSS padding (overrides default)
 *   radius         {string}   CSS border-radius (overrides default)
 *   margin         {string}   CSS margin
 *   limit          {number}   Truncate text after N characters
 *   bold           {boolean}  Font-weight bold
 *   onPressed      {function} Click handler
 *   onClick        {function} Alias of onPressed
 *   style          {object}   Extra raw styles
 */
export function buildTextBadge(text = '', options = {}) {
  if (typeof text === 'object' && text !== null) {
    options = text
    text = options.text ?? ''
  }

  const {
    colorText      = '#334155',
    colorCon       = '#f1f5f9',
    containerStyle = 'square',
    size           = 14,
    width,
    height,
    padding,
    radius,
    margin,
    limit,
    bold           = true,
    onPressed,
    onClick,
    style          = {},
  } = options

  const isCircle    = containerStyle === 'circle'
  const scale       = size / 14
  const displayText = limit && text.length > limit ? `${text.slice(0, limit)}...` : text

  const resolvedPadding  = padding  ?? `${Math.round(6 * scale)}px ${Math.round(10 * scale)}px`
  const resolvedRadius   = isCircle ? '9999px' : (radius ?? `${Math.round(10 * scale)}px`)

  const handlePress = onPressed ?? onClick

  return h('span', {
    title: (limit && text.length > limit) ? text : undefined,
    onClick: handlePress,
    style: {
      display:        'inline-flex',
      alignItems:     'center',
      justifyContent: 'center',
      background:     colorCon,
      color:          colorText,
      fontSize:       `${size}px`,
      fontWeight:     bold ? '700' : '500',
      padding:        resolvedPadding,
      borderRadius:   resolvedRadius,
      width,
      height,
      margin,
      whiteSpace:     'nowrap',
      lineHeight:     1.2,
      cursor:         handlePress ? 'pointer' : undefined,
      ...style,
    },
  }, displayText)
}
