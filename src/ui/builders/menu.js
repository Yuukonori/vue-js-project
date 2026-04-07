import { h, ref, isRef } from 'vue'
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
 * buildSidebar(options) — Collapsible sidebar navigation with toggle animation.
 *
 * Matches the collapse/expand flow of sidebar_menu_page.dart:
 *   - 600ms easeInOutCubic width transition (300px → 72px)
 *   - Icons center-align when collapsed (translateX)
 *   - Labels slide right + fade out (400ms opacity, 600ms transform)
 *   - Circular toggle button at sidebar edge; chevron rotates 180° (easeInOutBack)
 *   - Collapsed button icon appears after 70% of the collapse animation
 *   - Header + footer fade out when collapsed
 *
 * Options:
 *   items      {Array|Ref<Array>}  Item objects or a computed ref of them.
 *                                  Each item: { label, icon, active, onClick, divider }
 *   header     {VNode}
 *   footer     {VNode}
 *   width      {string}   Expanded width. Default: '260px'
 *   bg         {string}   Default: '#ffffff'
 *   border     {boolean}  Default: true
 *   pad        {string}   Horizontal/vertical padding when expanded. Default: '16px'
 *   activeColor {string}  Default: '#6366f1'
 */
export function buildSidebar(options = {}) {
  const {
    header,
    footer,
    width       = '260px',
    bg          = '#ffffff',
    border      = true,
    pad         = '16px',
    activeColor = '#6366f1',
  } = options

  const EXPANDED_W  = parseInt(width)  || 260
  const COLLAPSED_W = 68
  const ANIM_MS     = 600
  const TEXT_MS     = 400
  const EASE        = 'cubic-bezier(0.65, 0, 0.35, 1)'       // easeInOutCubic
  const EASE_BACK   = 'cubic-bezier(0.34, 1.56, 0.64, 1)'    // easeInOutBack (chevron)
  const hPadExp     = parseInt(pad) || 16
  const hPadCol     = 8

  return {
    setup() {
      const isCollapsed         = ref(false)
      const showCollapsedButton = ref(false)

      function toggle() {
        isCollapsed.value = !isCollapsed.value
        if (isCollapsed.value) {
          // Show compact collapsed icon after 70% of animation (matches dart logic)
          setTimeout(() => {
            if (!isCollapsed.value) return
            showCollapsedButton.value = true
          }, Math.round(ANIM_MS * 0.7))
        } else {
          showCollapsedButton.value = false
        }
      }

      return () => {
        const collapsed = isCollapsed.value
        const sideW     = collapsed ? COLLAPSED_W : EXPANDED_W
        const hPad      = collapsed ? hPadCol : hPadExp
        const ICON_SIZE = 18

        // Resolve items — support plain array or computed/ref
        const rawItems = isRef(options.items) ? options.items.value : (options.items ?? [])

        // ── Items ────────────────────────────────────────────────────────────
        const itemNodes = rawItems.map((item, idx) => {
          if (item.divider) {
            return h('div', {
              key: `d${idx}`,
              style: { height: '1px', background: '#e2e8f0', margin: '6px 0', flexShrink: 0 },
            })
          }

          const isActive = item.active
          const accent   = activeColor

          return h('div', {
            key:     item.label ?? idx,
            style:   {
              width:        collapsed ? '44px' : '100%',
              margin:       collapsed ? '0 auto 4px auto' : '0 0 4px 0',
              borderRadius: '10px',
              background:   isActive ? `${accent}15` : 'transparent',
              cursor:       'pointer',
              flexShrink:   0,
              overflow:     'hidden',
            },
            onClick: item.onClick,
          }, [
            h('div', {
              style: {
                display:    'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding:    `10px ${hPad}px`,
                transition: `padding ${ANIM_MS}ms ${EASE}`,
                minHeight:  '44px',
                overflow:   'hidden',
                position:   'relative',
              },
            }, [
              // Icon — animates to center when collapsed (mirrors AnimatedAlign in dart)
              h('div', {
                style: {
                  flexShrink: 0,
                  display:    'flex',
                  alignItems: 'center',
                  width:      `${ICON_SIZE}px`,
                  justifyContent: 'center',
                  transform:  collapsed ? 'translateX(0)' : 'translateX(0)',
                  transition: `transform ${ANIM_MS}ms ${EASE}`,
                  zIndex:     1,
                },
              }, [
                buildIcon(item.icon, { size: ICON_SIZE, color: isActive ? accent : '#64748b' }),
              ]),

              // Label — slides right + fades out (mirrors AnimatedSlide + AnimatedOpacity in dart)
              h('div', {
                style: {
                  flex:         1,
                  overflow:     'hidden',
                  paddingLeft:  '10px',
                  whiteSpace:   'nowrap',
                  transform:    collapsed ? 'translateX(20px)' : 'translateX(0)',
                  opacity:      collapsed ? 0 : 1,
                  transition:   `opacity ${TEXT_MS}ms ${EASE}, transform ${ANIM_MS}ms ${EASE}`,
                  pointerEvents:'none',
                },
              }, [
                buildText(item.label, {
                  size:   'sm',
                  weight: isActive ? 'semibold' : 'normal',
                  color:  isActive ? accent : 'gray700',
                }),
              ]),
            ]),
          ])
        })

        // ── Header — fade + slide out when collapsed ─────────────────────────
        const headerNode = header
          ? h('div', {
              style: {
                overflow:   'hidden',
                opacity:    collapsed ? 0 : 1,
                transform:  collapsed ? 'translateX(8px)' : 'translateX(0)',
                maxHeight:  collapsed ? '0' : '200px',
                marginBottom: collapsed ? '0' : '8px',
                transition: [
                  `opacity ${ANIM_MS}ms ${EASE}`,
                  `transform ${ANIM_MS}ms ${EASE}`,
                  `max-height ${ANIM_MS}ms ${EASE}`,
                  `margin-bottom ${ANIM_MS}ms ${EASE}`,
                ].join(', '),
              },
            }, [header])
          : null

        // ── Footer — fade out when collapsed ────────────────────────────────
        const footerNode = footer
          ? h('div', {
              style: {
                borderTop:  '1px solid #e2e8f0',
                paddingTop: '12px',
                marginTop:  '16px',
                overflow:   'hidden',
                opacity:    collapsed ? 0 : 1,
                maxHeight:  collapsed ? '0' : '200px',
                paddingBottom: collapsed ? '0' : undefined,
                transition: [
                  `opacity ${ANIM_MS}ms ${EASE}`,
                  `max-height ${ANIM_MS}ms ${EASE}`,
                ].join(', '),
              },
            }, [footer])
          : null

        // ── Toggle button — circular, sits on sidebar edge ───────────────────
        // Mirrors AnimatedPositioned + AnimatedRotation from dart
        const toggleBtn = h('button', {
          onClick: toggle,
          style:   {
            position:    'absolute',
            top:         `${hPadExp + 16}px`,
            left:        `${sideW - 9}px`,
            transform:   'translateX(-50%)',
            width:       '26px',
            height:      '26px',
            borderRadius:'50%',
            border:      '1px solid #dbe2ef',
            background:  '#ffffff',
            boxShadow:   '0 4px 12px rgba(15, 23, 42, 0.16)',
            cursor:      'pointer',
            display:     'flex',
            alignItems:  'center',
            justifyContent: 'center',
            padding:     0,
            zIndex:      10,
            transition:  `left ${ANIM_MS}ms ${EASE}, box-shadow 180ms ease, transform 180ms ease`,
          },
          onMouseenter: (e) => {
            e.currentTarget.style.boxShadow = '0 8px 18px rgba(15, 23, 42, 0.22)'
            e.currentTarget.style.transform = 'translateX(-50%) scale(1.03)'
          },
          onMouseleave: (e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.16)'
            e.currentTarget.style.transform = 'translateX(-50%)'
          },
        }, [
          h('span', {
            style: {
              display:    'inline-flex',
              alignItems: 'center',
              // Chevron points right when collapsed, left (180°) when expanded
              transform:  collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: `transform 400ms ${EASE_BACK}`,
            },
          }, [
            buildIcon('chevron-right', { size: 14, color: '#4f46e5' }),
          ]),
        ])

        // ── Sidebar ──────────────────────────────────────────────────────────
        const aside = h('aside', {
          style: {
            display:       'flex',
            flexDirection: 'column',
            width:         '100%',
            minHeight:     '100vh',
            background:    token(colors, bg) ?? bg,
            borderRight:   border ? '1px solid #e2e8f0' : undefined,
            padding:       `${pad} ${hPad}px`,
            overflow:      'hidden',
            transition:    `padding ${ANIM_MS}ms ${EASE}`,
          },
        }, [
          headerNode,
          h('div', { style: { flex: 1, overflowY: 'auto', overflowX: 'hidden' } }, itemNodes),
          footerNode,
        ].filter(Boolean))

        // ── Wrapper — animates overall width, hosts the toggle button ────────
        return h('div', {
          style: {
            position:   'sticky',
            top:        '0',
            height:     '100vh',
            alignSelf:  'flex-start',
            flexShrink: 0,
            width:      `${sideW}px`,
            transition: `width ${ANIM_MS}ms ${EASE}`,
          },
        }, [aside, toggleBtn])
      }
    },
  }
}
