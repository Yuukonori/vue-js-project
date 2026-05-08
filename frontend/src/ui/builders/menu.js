import { h, ref, isRef, computed, watch, onMounted } from 'vue'
import { buildIcon } from './icon.js'
import { token, colors } from '../ThemesColors.js'

const ANIM_MS = 600
const TEXT_MS = 400
const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)'       // easeInOutCubic
const EASE_BACK = 'cubic-bezier(0.34, 1.56, 0.64, 1)'    // easeInOutBack (chevron)

/**
 * buildMenu(options) — Vertical list of items
 */
export function buildMenu(options = {}) {
  const {
    items = [],
    activeColor = '#6366f1',
    itemColor = '#334155',
    activeBgColor,
  } = options

  return {
    render() {
      const rawItems = isRef(items) ? items.value : items
      return h('div', {
        style: { display: 'flex', flexDirection: 'column', gap: '4px' }
      }, rawItems.map((item, idx) => {
        if (item.divider) return h('div', { key: `div-${idx}`, style: { height: '1px', background: '#e2e8f0', margin: '8px 0' } })
        
        const isActive = item.active
        const accent = token(colors, activeColor) ?? activeColor

        return h('div', {
          key: item.label || idx,
          onClick: item.onClick,
          style: {
            display: 'flex',
            alignItems: 'center',
            padding: '10px 12px',
            borderRadius: '8px',
            background: isActive ? (token(colors, activeBgColor) ?? activeBgColor ?? '#f1f5f9') : 'transparent',
            cursor: 'pointer',
            transition: 'all 200ms ease',
          }
        }, [
          item.icon && buildIcon(item.icon, { size: 18, color: isActive ? accent : itemColor }),
          h('div', {
            style: { marginLeft: '12px', fontSize: '14px', fontWeight: '500', color: isActive ? accent : itemColor }
          }, item.label)
        ])
      }))
    }
  }
}

/**
 * buildNavbar(options) — Horizontal header bar
 */
export function buildNavbar(options = {}) {
  const {
    title = 'Builder UI',
    items = [],
    bg = '#ffffff',
    border = true,
    // activeColor = '#6366f1',
  } = options

  return {
    render() {
      const rawItems = isRef(items) ? items.value : items
      return h('nav', {
        style: {
          height: '64px',
          background: token(colors, bg) ?? bg,
          borderBottom: border ? '1px solid #e2e8f0' : 'none',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          position: 'sticky',
          top: '0',
          zIndex: 100,
        }
      }, [
        h('div', { style: { fontWeight: 'bold', fontSize: '18px', color: '#1e293b', marginRight: '48px' } }, title),
        h('div', { style: { display: 'flex', gap: '32px', flex: 1 } }, rawItems.map((item, idx) => {
          const isActive = item.active
          const accent = token(colors, activeColor) ?? activeColor
          return h('div', {
            key: item.label || idx,
            onClick: item.onClick,
            style: {
              fontSize: '14px',
              fontWeight: '500',
              color: isActive ? accent : '#64748b',
              cursor: 'pointer',
              position: 'relative',
              padding: '22px 0',
            }
          }, [
            item.label,
            isActive && h('div', {
              style: {
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                height: '2px',
                background: accent,
              }
            })
          ])
        }))
      ])
    }
  }
}

/**
 * Modern Sidebar Component Builder (Oldest Baseline)
 */
export function buildSidebar(options = {}) {
  const {
    header,
    footer,
    width = '260px',
    bg = '#ffffff',
    border = true,
    pad = '16px',
    activeColor = '#6366f1',
    itemColor = '#334155',
    mutedColor = '#64748b',
    dividerColor = '#e2e8f0',
    activeBgColor,
    radius = '0px',
    outerPadding = '0px',
  } = options

  const EXPANDED_W = 250
  const COLLAPSED_W = 70
  const hPadExp = parseInt(pad) || 16
  const hPadCol = 8

  return {
    setup() {
      const isCollapsed = ref(false)
      const showToggleButton = ref(true)

      function toggle() {
        if (!isCollapsed.value) {
          // Collapsing - hide button immediately
          showToggleButton.value = false
        }
        isCollapsed.value = !isCollapsed.value
        if (!isCollapsed.value) {
          // Expanding - show button after animation
          setTimeout(() => {
            showToggleButton.value = true
          }, ANIM_MS)
        }
      }

      return () => {
        const collapsed = isCollapsed.value
        const sideW = collapsed ? COLLAPSED_W : EXPANDED_W
        const hPad = collapsed ? hPadCol : hPadExp

        const rawItems = isRef(options.items) ? options.items.value : (options.items ?? [])

        const itemNodes = rawItems.map((item, idx) => {
          if (item.divider) {
            return h('div', {
              key: `divider-${idx}`,
              style: {
                height: '1px',
                background: token(colors, dividerColor) ?? dividerColor,
                margin: collapsed ? '12px 16px' : '12px 8px',
                opacity: 0.6,
                transition: `margin ${ANIM_MS}ms ${EASE}`,
              }
            })
          }

          if (item.section) {
            return !collapsed && h('div', {
              key: `section-${idx}`,
              style: {
                padding: '16px 12px 8px 12px',
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: token(colors, mutedColor) ?? mutedColor,
                opacity: 0.8,
              }
            }, item.label || item.section)
          }

          if (item.type === 'search') {
            return h('div', {
              key: 'search',
              style: {
                margin: collapsed ? '8px auto' : '8px 8px 16px 8px',
                width: collapsed ? '40px' : 'calc(100% - 16px)',
                height: '40px',
                borderRadius: '8px',
                background: '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '0' : '0 12px',
                cursor: 'pointer',
                transition: `all ${ANIM_MS}ms ${EASE}`,
              }
            }, [
              buildIcon('search', { size: 18, color: token(colors, mutedColor) ?? mutedColor }),
              !collapsed && h('div', {
                style: { marginLeft: '12px', color: token(colors, mutedColor) ?? mutedColor, fontSize: '14px' }
              }, 'Search...')
            ])
          }

          const isActive = item.active
          const accent = token(colors, activeColor) ?? activeColor
          
          return h('div', {
            key: item.label || idx,
            style: {
              width: collapsed ? '44px' : 'calc(100% - 24px)',
              margin: collapsed ? '0 auto 4px auto' : '0 12px 8px 12px',
              borderRadius: '12px',
              background: isActive ? (token(colors, activeBgColor) ?? activeBgColor ?? '#1d192b') : 'transparent',
              cursor: 'pointer',
              transition: `all ${ANIM_MS}ms ${EASE}`,
            },
            onClick: item.onClick,
          }, [
            h('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: `10px ${hPad}px`,
                transition: `padding ${ANIM_MS}ms ${EASE}`,
                minHeight: '44px',
              }
            }, [
              buildIcon(item.icon, { size: 18, color: isActive ? accent : itemColor }),
              !collapsed && h('div', {
                style: { flex: 1, marginLeft: '12px', fontSize: '14px', fontWeight: isActive ? '600' : '400', color: isActive ? accent : itemColor }
              }, item.label),
            ])
          ])
        })

        const resolvedHeader = typeof header === 'function' ? header({ collapsed, toggle }) : header
        const headerNode = resolvedHeader
          ? h('div', {
            style: {
              margin: '0 8px 12px 8px',
              display: 'flex',
              justifyContent: collapsed ? 'center' : 'flex-start',
              width: collapsed ? '100%' : 'calc(100% - 16px)',
              overflow: 'hidden',
            },
          }, [resolvedHeader])
          : null

        const resolvedFooter = typeof footer === 'function' ? footer({ collapsed }) : footer
        const footerNode = resolvedFooter
          ? h('div', {
            style: {
              padding: '0',
              marginTop: 'auto',
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              overflow: 'hidden',
            },
          }, [resolvedFooter])
          : null

        const toggleBtn = h('button', {
          onClick: toggle,
          style: {
            position: 'fixed',
            top: '36px',
            left: `${EXPANDED_W}px`,
            transform: 'translateX(-50%)',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            background: '#ffffffff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            zIndex: 99999,
            transition: `box-shadow 180ms ease, transform 180ms ease, opacity 300ms ease`,
            opacity: collapsed ? 0 : 1,
            pointerEvents: collapsed ? 'none' : 'auto',
          },
          onMouseenter: (e) => {
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.18)'
            e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)'
          },
          onMouseleave: (e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.12)'
            e.currentTarget.style.transform = 'translateX(-50%)'
          },
        }, [
          h('span', {
            style: {
              display: 'inline-flex',
              alignItems: 'center',
            },
          }, [
            buildIcon(collapsed ? 'chevron-right' : 'chevron-left', { size: 16, color: '#1e293b' }),
          ]),
        ])

        const aside = h('aside', {
          style: {
            display: 'grid',
            gridTemplateRows: 'auto 1fr auto',
            width: '100%',
            minHeight: '100vh',
            background: token(colors, bg) ?? bg,
            borderRight: border ? `1px solid ${dividerColor}` : undefined,
            padding: collapsed ? `${pad} ${hPad}px ${pad} ${hPad}px` : `${pad} ${hPad}px`,
            overflow: 'hidden',
            transition: `padding ${ANIM_MS}ms ${EASE}`,
          },
        }, [
          headerNode ?? h('div'),
          h('div', { style: { overflowY: 'auto', overflowX: 'hidden' } }, itemNodes),
          footerNode ?? h('div'),
        ])

        return h('div', {
          style: {
            position: 'relative',
            display: 'flex',
            height: '100vh',
            alignSelf: 'flex-start',
            flexShrink: 0,
            width: `${sideW}px`,
            padding: outerPadding,
            transition: `width ${ANIM_MS}ms ${EASE}`,
          },
        }, [
          h('div', {
            style: {
              position: 'sticky',
              top: '0',
              height: '100vh',
              width: '100%',
              display: 'grid',
              gridTemplateRows: 'auto 1fr auto',
            },
          }, [aside]),
          showToggleButton.value && !collapsed && toggleBtn
        ])
      }
    },
  }
}
