import { h } from 'vue'
import { token, radius, shadow } from '../ThemesColors.js'

/**
 * buildImage(src, options) — Image builder
 *
 * Options:
 *   src      {string}
 *   alt      {string}
 *   width    {string|number}
 *   height   {string|number}
 *   radius   {string}     Border radius token
 *   shadow   {string}     Shadow token
 *   fit      {'cover'|'contain'|'fill'|'none'}  object-fit. Default: 'cover'
 *   circle   {boolean}    Shorthand for radius: 'full' and equal w/h
 *   avatar   {boolean}    Small circular image preset
 *   size     {number}     Used with circle/avatar (px)
 *   style    {object}
 *   class    {string}
 *   onPressed {function}
 *   onClick  {function}  Alias of onPressed
 */
export function buildImage(src, options = {}) {
  if (typeof src === 'object' && src !== null) {
    options = src
    src = options.src ?? ''
  }

  const {
    alt    = '',
    width,
    height,
    radius: r,
    shadow: s,
    fit    = 'cover',
    circle,
    avatar,
    size,
    style  = {},
    class: className,
    onPressed,
    onClick,
  } = options
  const handlePress = onPressed ?? onClick

  const resolvedRadius = circle || avatar ? '9999px' : token(radius, r)
  const resolvedSize   = size ?? (avatar ? 40 : undefined)

  const computedStyle = {
    width:        resolvedSize ? `${resolvedSize}px` : width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height:       resolvedSize ? `${resolvedSize}px` : height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
    borderRadius: resolvedRadius,
    boxShadow:    token(shadow, s),
    objectFit:    fit,
    display:      'block',
    flexShrink:   0,
    cursor:       handlePress ? 'pointer' : undefined,
    ...style,
  }

  Object.keys(computedStyle).forEach(k => computedStyle[k] === undefined && delete computedStyle[k])

  return h('img', { src, alt, style: computedStyle, class: className, onClick: handlePress })
}
