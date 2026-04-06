import { h } from 'vue'
import { buildIcon } from './icon.js'
import { buildText } from './text.js'

/**
 * buildIconTextContainer(text, options) — Icon + text inside one container
 *
 * Options:
 *   icon           {string}   Icon name (see buildIcon). Default: 'star'
 *   iconColor      {string}   Icon color token/raw. Default: '#6366f1'
 *   textColor      {string}   Text color token/raw. Default: 'gray800'
 *   textSize       {string|number} Text size. Default: 'sm'
 *   textWeight     {string}   Text weight. Default: 'semibold'
 *   bgColor        {string}   Container background. Default: '#eef2ff'
 *   colorCon       {string}   Alias of bgColor
 *   border         {string}   CSS border
 *   radius         {string}   Border radius. Default: '10px'
 *   gap            {string}   Space between icon and text. Default: '8px'
 *   padding        {string}   Container padding. Default: '8px 12px'
 *   width          {string}   CSS width
 *   height         {string}   CSS height
 *   margin         {string}   CSS margin
 *   iconSize       {number}   Icon size in px. Default: 18
 *   iconWrapSize   {number}   Optional icon wrapper box size in px
 *   iconWrapColor  {string}   Optional icon wrapper bg color
 *   hover          {boolean}  Enable hover effects. Default: false
 *   onClick        {function}
 *   textStyle      {object}   Extra text styles merged into label styles
 *   style          {object}
 */
export function buildIconTextContainer(text = '', options = {}) {
  if (typeof text === 'object' && text !== null) {
    options = text
    text = options.text ?? ''
  }

  const {
    icon         = 'star',
    iconColor    = '#22c55e',
    textColor    = '#475569',
    textSize     = 13,
    textWeight   = 'semibold',
    bgColor      = '#e5e7eb',
    colorCon,
    border,
    radius       = '8px',
    gap          = '10px',
    padding      = '8px 14px',
    width,
    height,
    margin,
    iconSize     = 10,
    iconWrapSize,
    iconWrapColor,
    hover        = false,
    onClick,
    textStyle    = {},
    style        = {},
  } = options
  const resolvedBgColor = colorCon ?? bgColor

  const hoverStyle = {
    transform: 'translateY(-1px)',
    filter: 'brightness(0.99)',
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.10)',
  }

  const normalizedTextSize = typeof textSize === 'number' ? `${textSize}px` : textSize
  const iconNode = iconWrapSize
    ? h('span', {
      style: {
        width: `${iconWrapSize}px`,
        height: `${iconWrapSize}px`,
        minWidth: `${iconWrapSize}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '9999px',
        background: iconWrapColor,
      },
    }, [buildIcon(icon, { size: iconSize, color: iconColor })])
    : icon === 'circle'
      ? h('span', {
        style: {
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          minWidth: `${iconSize}px`,
          borderRadius: '9999px',
          background: iconColor,
          display: 'inline-block',
        },
      })
      : buildIcon(icon, { size: iconSize, color: iconColor })

  return h('div', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap,
      padding,
      borderRadius: radius,
      background: resolvedBgColor,
      border,
      width,
      height,
      margin,
      cursor: onClick ? 'pointer' : undefined,
      transition: hover ? 'transform 140ms ease, filter 140ms ease, box-shadow 140ms ease' : undefined,
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
    iconNode,
    buildText(text, {
      tag: 'span',
      size: normalizedTextSize,
      weight: textWeight,
      color: textColor,
      margin: '0',
      lineHeight: '1.2',
      letterSpacing: '0.3px',
      style: {
        textTransform: 'uppercase',
        ...textStyle,
      },
    }),
  ])
}
