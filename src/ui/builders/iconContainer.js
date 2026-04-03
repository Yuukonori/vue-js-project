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
 *   hover          {boolean}  Enable hover effects. Default: false
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
    hover          = false,
    onClick,
    style          = {},
  } = options

  const isCircle       = containerStyle === 'circle'
  const resolvedIcon   = iconSize ?? Math.round(size * iconScale)
  const resolvedRadius = isCircle
    ? '9999px'
    : (radius ?? `${Math.round((12 / 44) * size)}px`)
  const hoverStyle = {
    transform: 'translateY(-1px)',
    filter: 'brightness(0.98)',
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.10)',
  }

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
      transition:     hover ? 'transform 140ms ease, filter 140ms ease, box-shadow 140ms ease' : undefined,
      ...style,
    },
    onClick,
    onMouseenter: hover ? (e) => {
      Object.assign(e.currentTarget.style, hoverStyle)
    } : undefined,
    onMouseleave: hover ? (e) => {
      e.currentTarget.style.transform = ''
      e.currentTarget.style.filter = ''
      e.currentTarget.style.boxShadow = ''
    } : undefined,
  }, [
    buildIcon(icon, { size: resolvedIcon, color: colorIcon }),
  ])
}
