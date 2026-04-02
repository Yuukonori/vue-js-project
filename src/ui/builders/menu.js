import { h, ref } from 'vue'
import { token, colors, spacing, radius, shadow, fontSize } from '../tokens.js'
import { buildIcon } from './icon.js'
import { buildText } from './text.js'

/**
 * buildMenu(items, options) — Navigation / dropdown menu builder
 *
 * items: Array of item objects:
 *   { label, icon, href, onClick, active, disabled, divider, children }
 *
 * Options:
 *   variant    {'nav'|'sidebar'|'dropdown'}   Default: 'nav'
 *   direction  {'row'|'col'}                  Default: 'row' for nav, 'col' for sidebar/dropdown
 *   gap        {string}
 *   pad        {string}
 *   bg         {string}
 *   activeColor {string}   Color of active item. Default: 'primary'
 *   style      {object}
 *   class      {string}
 */

export function buildMenu(items = [], options = {}) {
  const {
    variant     = 'nav',
    direction,
    gap         = variant === 'nav' ? '2' : '1',
    pad,
    bg,
    activeColor = '#6366f1',
    style       = {},
    class: className,
  } = options

  const dir = direction ?? (variant === 'nav' ? 'row' : 'col')

  const menuStyle = {
    display:        'flex',
    flexDirection:  dir === 'col' ? 'column' : 'row',
    gap:            token(spacing, gap),
    padding:        token(spacing, pad),
    background:     token(colors, bg),
    listStyle:      'none',
    margin:         0,
    ...style,
  }

  const itemNodes = items.map((item, idx) => {
    if (item.divider) {
      return h('li', {
        key: `divider-${idx}`,
        style: {
          height: dir === 'col' ? '1px' : '100%',
          width:  dir === 'row' ? '1px' : '100%',
          background: '#e2e8f0',
          margin: dir === 'col' ? '4px 0' : '0 4px',
          flexShrink: 0,
        },
      })
    }

    const isActive   = item.active
    const isDisabled = item.disabled

    const itemStyle = {
      display:        'flex',
      alignItems:     'center',
      gap:            '8px',
      padding:        variant === 'dropdown' ? '8px 14px' : variant === 'sidebar' ? '10px 14px' : '6px 12px',
      borderRadius:   token(radius, 'md'),
      fontSize:       token(fontSize, variant === 'dropdown' ? 'sm' : 'base'),
      fontWeight:     isActive ? '600' : '400',
      color:          isDisabled ? '#94a3b8' : isActive ? activeColor : '#334155',
      background:     isActive && variant !== 'nav' ? `${activeColor}15` : 'transparent',
      cursor:         isDisabled ? 'not-allowed' : 'pointer',
      opacity:        isDisabled ? 0.5 : 1,
      textDecoration: 'none',
      transition:     'all 0.15s',
      userSelect:     'none',
      borderBottom:   isActive && variant === 'nav' ? `2px solid ${activeColor}` : undefined,
      borderRadius:   isActive && variant === 'nav' ? '0' : token(radius, 'md'),
    }

    const children = [
      item.icon ? buildIcon(item.icon, { size: variant === 'sidebar' ? 20 : 16, color: isActive ? activeColor : '#64748b' }) : null,
      buildText(item.label, { size: variant === 'sidebar' ? 'base' : 'sm', weight: isActive ? 'semibold' : 'normal', color: isDisabled ? 'gray400' : isActive ? activeColor : 'gray700' }),
      item.badge
        ? h('span', {
            style: {
              marginLeft: 'auto',
              background: activeColor,
              color: '#fff',
              fontSize: '11px',
              fontWeight: '600',
              padding: '1px 7px',
              borderRadius: '9999px',
            }
          }, String(item.badge))
        : null,
      item.children
        ? buildIcon('chevron-right', { size: 14, color: 'gray400', style: { marginLeft: 'auto' } })
        : null,
    ].filter(Boolean)

    return h('li', { key: item.label ?? idx }, [
      h(item.href ? 'a' : 'div', {
        href:    item.href,
        style:   itemStyle,
        onClick: !isDisabled ? item.onClick : undefined,
      }, children)
    ])
  })

  return h('ul', { style: menuStyle, class: className }, itemNodes)
}

/**
 * buildNavbar(options) — Full top navigation bar
 *
 * Options:
 *   logo       {VNode|string}    Logo area
 *   items      {array}           Nav items (see buildMenu)
 *   actions    {VNode[]}         Right-side actions
 *   bg         {string}          Background. Default: 'white'
 *   border     {boolean}         Show bottom border. Default: true
 *   height     {string}          Default: '60px'
 *   pad        {string}          Horizontal padding. Default: '24px'
 *   sticky     {boolean}         position: sticky; top: 0
 *   shadow     {string}
 */
export function buildNavbar(options = {}) {
  const {
    logo,
    items     = [],
    actions   = [],
    bg        = '#ffffff',
    border    = true,
    height    = '60px',
    pad       = '24px',
    sticky,
    shadow: shadowProp = 'sm',
  } = options

  const barStyle = {
    display:         'flex',
    alignItems:      'center',
    height,
    padding:         `0 ${pad}`,
    background:      token(colors, bg),
    borderBottom:    border ? '1px solid #e2e8f0' : undefined,
    boxShadow:       token(shadow, shadowProp),
    position:        sticky ? 'sticky' : undefined,
    top:             sticky ? '0' : undefined,
    zIndex:          sticky ? 100 : undefined,
    gap:             '24px',
  }

  return h('nav', { style: barStyle }, [
    logo ? h('div', { style: { flexShrink: 0 } }, [logo]) : null,
    items.length ? buildMenu(items, { variant: 'nav', direction: 'row' }) : null,
    actions.length
      ? h('div', { style: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' } }, actions)
      : null,
  ].filter(Boolean))
}

/**
 * buildSidebar(options) — Sidebar navigation
 *
 * Options:
 *   items      {array}
 *   header     {VNode}
 *   footer     {VNode}
 *   width      {string}   Default: '240px'
 *   bg         {string}   Default: 'white'
 *   border     {boolean}  Default: true
 */
export function buildSidebar(options = {}) {
  const {
    items   = [],
    header,
    footer,
    width   = '240px',
    bg      = '#ffffff',
    border  = true,
    pad     = '12px',
  } = options

  const sideStyle = {
    display:      'flex',
    flexDirection:'column',
    width,
    minHeight:    '100vh',
    background:   token(colors, bg),
    borderRight:  border ? '1px solid #e2e8f0' : undefined,
    padding:      pad,
    flexShrink:   0,
  }

  return h('aside', { style: sideStyle }, [
    header ? h('div', { style: { marginBottom: '16px' } }, [header]) : null,
    h('div', { style: { flex: 1 } }, [
      buildMenu(items, { variant: 'sidebar', direction: 'col' }),
    ]),
    footer ? h('div', { style: { marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' } }, [footer]) : null,
  ].filter(Boolean))
}
