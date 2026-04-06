import { h } from 'vue'
import { token, colors, spacing, radius, shadow } from '../tokens.js'
import { buildText } from './text.js'
import { buildDivider } from './divider.js'

/**
 * buildCard(options) — Card container builder
 *
 * Options:
 *   title      {string|VNode}   Card header title
 *   subtitle   {string|VNode}   Header subtitle
 *   headerRight {VNode}         Right side of header
 *   child      {object}         Named children map: { 1: vnode, 2: vnode }
 *   children   {array}          Children array
 *   footer     {VNode|VNode[]}  Footer content
 *   bg         {string}         Background. Default: 'white'
 *   border     {boolean}        Show border. Default: true
 *   shadow     {string}         Shadow token. Default: 'md'
 *   radius     {string}         Default: 'lg'
 *   pad        {string}         Body padding. Default: '6'
 *   full       {boolean}        width: 100%
 *   hover      {boolean}        Hover shadow effect
 *   onClick    {function}
 *   style      {object}
 *   class      {string}
 */
export function buildCard(options = {}) {
  const {
    title,
    subtitle,
    headerRight,
    child    = {},
    children = [],
    footer,
    bg       = '#ffffff',
    border   = true,
    shadow: s = 'md',
    radius: r  = 'lg',
    pad       = '6',
    full,
    hover,
    onClick,
    style    = {},
    class: className,
  } = options

  const cardStyle = {
    background:   token(colors, bg),
    border:       border ? '1px solid #e2e8f0' : undefined,
    borderRadius: token(radius, r),
    boxShadow:    token(shadow, s),
    width:        full ? '100%' : undefined,
    overflow:     'hidden',
    cursor:       onClick ? 'pointer' : undefined,
    transition:   hover ? 'transform 140ms ease, filter 140ms ease, box-shadow 140ms ease' : undefined,
    ...style,
  }

  const hasHeader = title || subtitle || headerRight

  const headerNode = hasHeader
    ? h('div', {
        style: {
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        `${token(spacing, pad)}`,
          paddingBottom:  '0',
        }
      }, [
        h('div', {}, [
          title    ? (typeof title    === 'string' ? buildText(title,    { variant: 'h5' }) : title)    : null,
          subtitle ? (typeof subtitle === 'string' ? buildText(subtitle, { variant: 'caption', color: 'gray500' }) : subtitle) : null,
        ].filter(Boolean)),
        headerRight ?? null,
      ].filter(Boolean))
    : null

  const bodyChildren = [...Object.values(child), ...children]

  const bodyNode = bodyChildren.length
    ? h('div', { style: { padding: token(spacing, pad) } }, bodyChildren)
    : null

  const footerNode = footer
    ? h('div', {}, [
        buildDivider(),
        h('div', { style: { padding: `${token(spacing, '4')} ${token(spacing, pad)}` } },
          Array.isArray(footer) ? footer : [footer])
      ])
    : null

  return h('div', {
    style: cardStyle,
    class: className,
    onClick,
    onMouseenter: hover ? (e) => {
      e.currentTarget.style.transform = 'translateY(-1px)'
      e.currentTarget.style.filter = 'brightness(0.99)'
      e.currentTarget.style.boxShadow = '0 8px 20px rgba(15, 23, 42, 0.10)'
    } : undefined,
    onMouseleave: hover ? (e) => {
      e.currentTarget.style.boxShadow = token(shadow, s)
      e.currentTarget.style.transform = ''
      e.currentTarget.style.filter = ''
    } : undefined,
  }, [headerNode, bodyNode, footerNode].filter(Boolean))
}
