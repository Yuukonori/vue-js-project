import { h } from 'vue'
import { buildGrid } from './grid.js'
import { buildIcon } from './icon.js'
import { buildText } from './text.js'
import { buildIconContainer } from './iconContainer.js'
import { token, colors, radius } from '../ThemesColors.js'

/**
 * buildStackedCardsList(options) — A data-driven vertical list of cards
 *
 * Options:
 *   data         {Array}    Raw data objects
 *   columns      {Array}    [{ key, accessor, render, style }]
 *                            key: 'icon' | 'title' | 'subtitle' | 'description' | 'footer' | 'rightNode'
 *   onItemClick  {Function} (row, index) => void
 *   items        {Array}    (Legacy) Direct list of item objects
 *   style        {Object}   Container styles
 */
export function buildStackedCardsList(options = {}) {
  const {
    data = [],
    columns = [],
    onItemClick,
    items: legacyItems, // Support legacy items if data is missing
    style = {},
  } = options

  // Helper to resolve cell values (accessor/render pattern)
  const renderSlot = (row, slotKey, index) => {
    const col = columns.find(c => c.key === slotKey)
    if (!col) return null

    const key = col.accessor
    const val = key ? row[key] : undefined
    
    if (col.render) return col.render(val, row, index)
    return val
  }

  // Resolve items: prefer new data/columns pattern, fallback to legacy items
  const finalItems = (data.length > 0 && columns.length > 0)
    ? data.map((row, idx) => ({
        icon:        renderSlot(row, 'icon', idx),
        iconColor:   row.iconColor, // specialized prop fallback
        iconBg:      row.iconBg,    // specialized prop fallback
        iconSize:    row.iconSize,  // specialized prop fallback
        title:       renderSlot(row, 'title', idx),
        subtitle:    renderSlot(row, 'subtitle', idx),
        description: renderSlot(row, 'description', idx),
        footer:      renderSlot(row, 'footer', idx),
        rightNode:   renderSlot(row, 'rightNode', idx),
        onClick:     () => onItemClick?.(row, idx),
        ...row // spread row properties in case they are used directly
      }))
    : legacyItems ?? []

  return h('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      width: '100%',
      ...style
    }
  }, finalItems.map((item, index) => {
    const hasIconContainer = !!item.iconBg

    return buildGrid({
      columns: 12,
      rows: 1,
      display: true,
      padding: '18px 24px',
      borderRadius: 'xl',
      border: '1px solid #eef2f6',
      hover: true,
      onPressed: () => {
        if (item.onClick) item.onClick()
      },
      span: {
        1: { colSpan: 1 },  // Left: Icon
        2: { colSpan: 8 },  // Middle: Content
        11: { colSpan: 3 }, // Right: Button/Node
      },
      align: {
        1: 'start start',
        2: 'start start',
        11: 'center end',
      },
      child: {
        1: h('div', { style: { marginTop: '4px' } }, [
          hasIconContainer 
            ? buildIconContainer({ 
                icon: item.icon, 
                colorIcon: item.iconColor ?? 'primary', 
                colorCon: item.iconBg, 
                size: 38,
                radius: '10px'
              })
            : (typeof item.icon === 'object' ? item.icon : (item.icon ? buildIcon(item.icon, { size: item.iconSize ?? 18, color: item.iconColor ?? 'warningOrange' }) : null))
        ]),
        2: h('div', { 
            style: { 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '6px', 
                paddingLeft: '4px' 
            } 
        }, [
          // Title
          item.title ? buildText(item.title, { size: 'lg', weight: 'bold', color: 'gray900' }) : null,
          
          // Subtitle or Description
          item.description 
            ? (typeof item.description === 'string' ? buildText(item.description, { size: 'md', color: 'gray600', lineHeight: '1.5' }) : item.description)
            : item.subtitle 
                ? (typeof item.subtitle === 'string' ? buildText(item.subtitle, { size: 'sm', color: 'gray500', style: item.subtitleStyle }) : item.subtitle)
                : null,

          // Footer
          item.footer ? h('div', { 
            style: { 
                display: 'flex', 
                alignItems: 'center', 
                gap: '24px', 
                marginTop: '8px' 
            } 
          }, Array.isArray(item.footer) ? item.footer : [item.footer]) : null
        ]),
        11: item.rightNode ?? buildIcon('chevron-right', { size: 20, color: 'gray300' }),
      }
    })
  }))
}
