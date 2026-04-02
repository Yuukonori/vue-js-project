import { h } from 'vue'
import { buildIcon } from './icon.js'

/**
 * buildIconContainer(options) — Icon inside a styled container
 *
 * Options:
 *   icon           {string}   Icon name (see buildIcon)
 *   colorIcon      {string}   Icon color. Default: '#6366f1'
 *   colorCon       {string}   Container background. Default: '#e0e7ff'
 *   size           {number}   Container size in px. Default: 44
 *   iconSize       {number}   Icon size in px. Auto-scaled if omitted
 *   iconScale      {number}   Icon/container ratio. Default: 0.55
 *   containerStyle {'square'|'circle'}  Default: 'square'
 *   radius         {string}   Border radius (overrides containerStyle). e.g. '8px'
 *   margin         {string}   CSS margin
 *   onClick        {function}
 *   style          {object}
 */
export function buildIconContainer(options = {}) {
  const {
    icon           = 'star',
    colorIcon      = '#6366f1',
    colorCon       = '#e0e7ff',
    size           = 44,
    iconSize,
    iconScale      = 0.55,
    containerStyle = 'square',
    radius,
    margin,
    onClick,
    style          = {},
  } = options

  const isCircle       = containerStyle === 'circle'
  const resolvedIcon   = iconSize ?? Math.round(size * iconScale)
  const resolvedRadius = isCircle
    ? '9999px'
    : (radius ?? `${Math.round((12 / 44) * size)}px`)

  return h('div', {
    style: {
      display:        'inline-flex',
      alignItems:     'center',
      justifyContent: 'center',
      width:          `${size}px`,
      height:         `${size}px`,
      background:     colorCon,
      borderRadius:   resolvedRadius,
      flexShrink:     0,
      margin,
      cursor:         onClick ? 'pointer' : undefined,
      ...style,
    },
    onClick,
  }, [
    buildIcon(icon, { size: resolvedIcon, color: colorIcon }),
  ])
}
