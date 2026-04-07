import { h } from 'vue'
import { buildIcon } from './icon.js'
import { buildText } from './text.js'

/**
 * buildIconText(text, options) - Inline icon + text helper
 *
 * Options:
 *   icon         {string}   Icon name. Default: 'info'
 *   iconColor    {string}   Icon color token/raw. Default: 'gray500'
 *   iconSize     {number}   Icon size in px. Default: 16
 *   textColor    {string}   Text color token/raw. Default: 'gray700'
 *   textSize     {string|number} Text size. Default: 'sm'
 *   textWeight   {string}   Text weight. Default: 'medium'
 *   gap          {string}   Gap between icon and text. Default: '8px'
 *   align        {'start'|'center'|'end'} Vertical alignment. Default: 'center'
 *   width        {string}   CSS width
 *   margin       {string}   CSS margin
 *   onPressed    {function}
 *   onClick      {function}   Alias of onPressed
 *   style        {object}   Extra container style
 *   textStyle    {object}   Extra text style
 */
export function buildIconText(text = '', options = {}) {
  if (typeof text === 'object' && text !== null) {
    options = text
    text = options.text ?? ''
  }

  const {
    icon = 'info',
    iconColor = 'gray500',
    iconSize = 16,
    textColor = 'gray700',
    textSize = 'sm',
    textWeight = 'medium',
    gap = '8px',
    align = 'center',
    width,
    margin,
    onPressed,
    onClick,
    style = {},
    textStyle = {},
  } = options

  const alignMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
  }

  const handlePress = onPressed ?? onClick

  return h('span', {
    style: {
      display: 'inline-flex',
      alignItems: alignMap[align] ?? 'center',
      gap,
      width,
      margin,
      cursor: handlePress ? 'pointer' : undefined,
      ...style,
    },
    onClick: handlePress,
  }, [
    buildIcon(icon, { size: iconSize, color: iconColor }),
    buildText(text, {
      tag: 'span',
      size: textSize,
      weight: textWeight,
      color: textColor,
      margin: '0',
      lineHeight: '1.2',
      style: textStyle,
    }),
  ])
}
