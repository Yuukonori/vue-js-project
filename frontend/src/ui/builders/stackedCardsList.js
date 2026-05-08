import { h, defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'
import { buildGrid } from './grid.js'
import { buildIcon } from './icon.js'
import { buildText } from './text.js'
import { buildIconContainer } from './iconContainer.js'
import { token, colors, radius } from '../ThemesColors.js'

/**
 * buildStackedCardsList(options) — A data-driven vertical list of cards with pagination support
 *
 * Options:
 *   data         {Array}    Raw data objects
 *   columns      {Array}    [{ key, accessor, render, style }]
 *   onItemClick  {Function} (row, index) => void
 *   pagination   {Object}   { maxRows: number, align: string }
 *   style        {Object}   Container styles
 */
export function buildStackedCardsList(options = {}) {
  return h(_StackedCardsListComponent, options)
}

const _StackedCardsListComponent = defineComponent({
  name: 'StackedCardsList',
  props: {
    data:        { type: Array, default: () => [] },
    columns:     { type: Array, default: () => [] },
    onItemClick: { type: Function, default: null },
    pagination:  { type: Object, default: null },
    style:       { type: Object, default: () => ({}) },
    items:       { type: Array, default: null }, // Legacy support
    border:      { type: Boolean, default: true },
    itemBorder:  { type: Boolean, default: true },
    divider:     { type: Boolean, default: false },
    isStacked:   { type: Boolean, default: false },
  },
  setup(props) {
    const page = ref(1)
    const now = ref(Date.now())
    let timer = null

    onMounted(() => {
      timer = setInterval(() => {
        now.value = Date.now()
      }, 30000)
    })

    onUnmounted(() => {
      if (timer) clearInterval(timer)
    })

    const getTimeAgo = (date) => {
      if (!date) return ''
      const d = new Date(date)
      if (isNaN(d.getTime())) return date
      const diff = Math.floor((now.value - d.getTime()) / 1000)
      
      if (diff < 60) return 'JUST NOW'
      if (diff < 3600) return `${Math.floor(diff / 60)}M AGO`
      if (diff < 86400) return `${Math.floor(diff / 3600)}H AGO`
      return `${Math.floor(diff / 86400)}D AGO`
    }

    const maxRows = computed(() => {
      if (props.pagination) {
        return Number(props.pagination.maxRows ?? props.pagination.max_rows ?? 0)
      }
      return 0
    })

    const totalPages = computed(() => {
      const size = maxRows.value
      if (size <= 0) return 1
      return Math.max(1, Math.ceil(props.data.length / size))
    })

    const displayedItems = computed(() => {
      const size = maxRows.value
      const reversedData = [...props.data].reverse()
      if (size <= 0) return reversedData
      const start = (page.value - 1) * size
      return reversedData.slice(start, start + size)
    })

    const renderSlot = (row, slotKey, index) => {
      const col = props.columns.find(c => c.key === slotKey)
      if (!col) return null
      const key = col.accessor
      const val = key ? row[key] : undefined
      if (col.render) return col.render(val, row, index)
      return val
    }

    const resolveItems = (data) => {
      if (data.length > 0 && props.columns.length > 0) {
        return data.map((row, idx) => {
          const rawRightNode = renderSlot(row, 'rightNode', idx)
          // If the right node is empty or looks like a timestamp/label, and we have created_at, use relative time
          const timeValue = row.created_at || row.timestamp
          const displayRightNode = (rawRightNode === '' || rawRightNode === 'JUST NOW' || !rawRightNode) && timeValue
            ? getTimeAgo(timeValue)
            : rawRightNode

          return {
            icon:        renderSlot(row, 'icon', idx),
            iconColor:   row.iconColor,
            iconBg:      row.iconBg,
            iconSize:    row.iconSize,
            title:       renderSlot(row, 'title', idx),
            subtitle:    renderSlot(row, 'subtitle', idx),
            description: renderSlot(row, 'description', idx),
            footer:      renderSlot(row, 'footer', idx),
            rightNode:   displayRightNode,
            onClick:     () => props.onItemClick?.(row, idx),
            ...row
          }
        })
      }
      return props.items ?? []
    }

    return () => {
      const items = resolveItems(displayedItems.value)
      const hasPagination = maxRows.value > 0 && props.data.length > maxRows.value

      return h('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          backgroundColor: props.border ? '#ffffff' : 'transparent',
          borderRadius: '16px',
          border: props.border ? '1px solid #e5e7ee' : 'none',
          overflow: 'hidden',
          ...props.style
        }
      }, [
        h('div', {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: props.divider ? '0' : '12px',
            padding: props.border ? '16px' : '0',
            flex: 1,
          }
        }, items.map((item, index) => {
          const hasIconContainer = !!item.iconBg
          const isLast = index === items.length - 1
          
          const zIndex = items.length - index
          const stackStyle = props.isStacked ? {
            marginTop: index === 0 ? '0' : '-30px',
            zIndex,
            transform: `scale(${1 - index * 0.02}) translateY(${index * 4}px)`,
            opacity: 1 - index * 0.1,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease-in-out',
          } : {}

          return buildGrid({
            columns: 12, rows: 1, display: true, padding: props.divider ? '20px 10px' : '18px 24px', 
            borderRadius: props.divider ? '0' : 'xl', 
            backgroundColor: '#ffffff',
            border: props.divider 
              ? (isLast ? 'none' : 'none') 
              : (props.itemBorder ? '1px solid #eef2f6' : 'none'),
            style: {
              ...(props.divider ? { borderBottom: isLast ? 'none' : '1px solid #f1f5f9' } : {}),
              ...stackStyle
            },
            hover: true,
            onPressed: () => item.onClick?.(),
            span: { 1: { colSpan: 1 }, 2: { colSpan: 10 }, 12: { colSpan: 1 } },
            align: { 1: 'start start', 2: 'start start', 12: 'center end' },
            child: {
              1: h('div', { style: { marginTop: '4px' } }, [
                hasIconContainer 
                  ? buildIconContainer({ icon: item.icon, colorIcon: item.iconColor ?? 'primary', colorCon: item.iconBg, size: 38, radius: '10px' })
                  : (typeof item.icon === 'object' && item.icon !== null ? item.icon : (item.icon ? buildIcon(item.icon, { size: item.iconSize ?? 18, color: item.iconColor ?? 'warningOrange' }) : undefined))
              ].filter(Boolean)),
              2: h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '4px' } }, [
                item.title ? buildText(item.title, { size: 'lg', weight: 'bold', color: 'gray900' }) : null,
                item.description 
                  ? (typeof item.description === 'string' ? buildText(item.description, { size: 'md', color: 'gray600', lineHeight: '1.5' }) : item.description)
                  : item.subtitle 
                      ? (typeof item.subtitle === 'string' ? buildText(item.subtitle, { size: 'sm', color: 'gray500', style: item.subtitleStyle }) : item.subtitle)
                      : null,
                item.footer ? h('div', { style: { display: 'flex', alignItems: 'center', gap: '24px', marginTop: '8px' } }, Array.isArray(item.footer) ? item.footer : [item.footer]) : null
              ].filter(Boolean)),
              12: (item.rightNode !== undefined && item.rightNode !== null) 
                  ? (typeof item.rightNode === 'object' ? item.rightNode : buildText(String(item.rightNode)))
                  : buildIcon('chevron-right', { size: 20, color: 'gray300' }),
            }
          })
        })),
        
        // Pagination UI
        hasPagination ? h('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            padding: '16px 16px',
            backgroundColor: 'transparent'
          }
        }, [
          _pageBtn('<', page.value === 1, () => { if (page.value > 1) page.value-- }),
          h('span', {
            style: { 
              fontSize: '14px', 
              fontWeight: '700', 
              color: '#1e293b', // Dark blue-gray
              textAlign: 'center',
              letterSpacing: '-0.2px'
            }
          }, `Page ${page.value} of ${totalPages.value}`),
          _pageBtn('>', page.value === totalPages.value, () => { if (page.value < totalPages.value) page.value++ }),
        ]) : null
      ])
    }
  }
})

function _pageBtn(label, disabled, onClick) {
  return h('button', {
    style: {
      width: '34px',
      height: '34px',
      border: '1.5px solid #e2e8f0',
      borderRadius: '10px',
      background: '#ffffff',
      color: disabled ? '#cbd5e1' : '#94a3b8',
      fontSize: '14px',
      fontWeight: '400',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      transition: 'all 0.2s ease',
      boxShadow: disabled ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
    },
    disabled,
    onClick,
  }, label)
}

