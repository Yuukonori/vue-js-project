import { h, defineComponent, ref, computed, onMounted } from 'vue'

/**
 * buildTable(options) — Data table with optional pagination and row hover
 *
 * Options:
 *   columns      {Array}    [{ key, label, width, flex, align, render }]
 *                            render: (value, row, index) => VNode|string
 *                            flex: relative width weight (like Flutter flex)
 *                            allowOverflow: true to let popup/menu escape cell bounds
 *   data         {Array}    Array of row objects
 *   pageSize     {number}   Rows per page. 0 = no pagination. Default: 0
 *   pagerMode    {'full'|'arrows'|'summary'} Pagination UI mode. Default: 'full'
 *   pagination   {object}   Flutter-like pagination config:
 *                            Example:
 *                            {
 *                              maxRows: 10,          // or max_rows
 *                              align: 'center',      // left | center | right
 *                              padding: '12px 16px',
 *                              stateKey: 'asset-table-page' // optional
 *                            }
 *   emptyText    {string}   Text when data is empty. Default: 'No data'
 *   striped      {boolean}  Alternate row shading. Default: false
 *   showClearButton {boolean} Show clear button in table header. Default: false
 *   onClear      {function} () => void
 *   onRowClick   {function} (row) => void
 *   headerUppercase {boolean} Default: false
 *   width        {string}   CSS width
 *   height       {string}   CSS height
 *   style        {object}
 */
export function buildTable(options = {}) {
  return h(_TableComponent, options)
}

const _TableComponent = defineComponent({
  name: 'Table',
  props: {
    columns:         { default: () => [] },
    data:            { default: () => [] },
    pageSize:        { default: 0 },
    pagerMode:       { default: 'full' },
    pagination:      { default: null },
    emptyText:       { default: 'No data' },
    striped:         { default: false },
    showClearButton: { default: false },
    onClear:         { default: null },
    onRowClick:      { default: null },
    onPressed:       { default: null },
    headerUppercase: { default: false },
    width:           { default: undefined },
    height:          { default: undefined },
    style:           { default: () => ({}) },
  },
  setup(props) {
    const page    = ref(1)
    const hovered = ref(-1)

    function resolvePageSize() {
      if (props.pagination) {
        const fromMap = Number(props.pagination.maxRows ?? props.pagination.max_rows ?? 10)
        return Number.isFinite(fromMap) && fromMap > 0 ? fromMap : 10
      }
      const fromProp = Number(props.pageSize ?? 0)
      return Number.isFinite(fromProp) && fromProp > 0 ? fromProp : 0
    }

    const totalPages = computed(() =>
      resolvePageSize() > 0 ? Math.max(1, Math.ceil(props.data.length / resolvePageSize())) : 1
    )

    const rows = computed(() => {
      const size = resolvePageSize()
      if (size <= 0) return props.data
      const start = (page.value - 1) * size
      const dataSlice = props.data.slice(start, start + size)

      if (props.pagination?.fillRows || props.pagination?.fill_rows) {
        if (dataSlice.length > 0 && dataSlice.length < size) {
          const padded = [...dataSlice]
          while (padded.length < size) {
            padded.push({ __isPadding: true })
          }
          return padded
        }
      }
      return dataSlice
    })

    function colKey(col) {
      return col.key ?? col.accessor
    }

    function colLabel(col) {
      return col.label ?? col.header ?? ''
    }

    function cellValue(row, col) {
      const key = colKey(col)
      if (!key) return '-'
      return row[key] ?? '-'
    }

    function renderCell(row, col, idx) {
      if (row.__isPadding) return h('div', { style: { height: '30px' } }, '\u00A0')
      const val = cellValue(row, col)
      if (col.render) return col.render(val, row, idx)
      return String(val)
    }

    function resolveColumnWidth(col, flexTotal) {
      if (col?.width) return col.width
      const flex = Number(col?.flex ?? 0)
      if (flexTotal > 0 && Number.isFinite(flex) && flex > 0) {
        return `${(flex / flexTotal) * 100}%`
      }
      return undefined
    }

    return () => {
      const resolvedPageSize = resolvePageSize()
      const flexTotal = props.columns.reduce((sum, col) => {
        if (col?.width) return sum
        const flex = Number(col?.flex ?? 0)
        return Number.isFinite(flex) && flex > 0 ? sum + flex : sum
      }, 0)
      const hasPaginationConfig = !!props.pagination
      const hasPagination = resolvedPageSize > 0 && (
        hasPaginationConfig
          ? true
          : (props.pagerMode === 'summary'
              ? props.data.length >= 0
              : props.data.length > resolvedPageSize)
      )
      const summaryMode = hasPaginationConfig || props.pagerMode === 'summary'

      return h('div', {
        style: {
          width:        props.width,
          height:       props.height,
          display:      'flex',
          flexDirection:'column',
          background:   '#ffffff',
          borderRadius: '16px',
          border:       '1px solid #e5e7ee',
          overflow:     'hidden',
          boxSizing:    'border-box',
          ...props.style,
        },
      }, [
        // ── Scrollable table area ──
        props.showClearButton ? h('div', {
          style: {
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '10px 12px 0 12px',
          },
        }, [
          h('button', {
            style: {
              border: 'none',
              background: 'transparent',
              color: '#6366f1',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            },
            onClick: () => props.onClear?.(),
          }, 'Clear'),
        ]) : null,
        h('div', { style: { flex: 1, overflowX: 'auto', overflowY: props.height ? 'auto' : 'visible' } }, [
          h('table', {
            style: {
              width:           '100%',
              borderCollapse:  'collapse',
              fontSize:        '14px',
            },
          }, [
            // Header
            h('thead', {}, [
              h('tr', {
                style: { background: '#f7f8fc' },
              }, props.columns.map((col, ci) =>
                h('th', {
                  key: ci,
                  style: {
                    padding:       '12px 16px',
                    textAlign:     col.align ?? 'left',
                    fontWeight:    '600',
                    fontSize:      '12px',
                    color:         '#475467',
                    letterSpacing: '0.3px',
                    width:         resolveColumnWidth(col, flexTotal),
                    whiteSpace:    'nowrap',
                    borderBottom:  '1px solid #e5e7ee',
                  },
                }, props.headerUppercase ? String(colLabel(col)).toUpperCase() : colLabel(col))
              )),
            ]),

            // Body
            h('tbody', {}, [
              rows.value.length === 0
                ? h('tr', {}, [
                    h('td', {
                      colspan: props.columns.length,
                      style: { padding: '32px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '14px', fontWeight: '500' },
                    }, props.emptyText),
                  ])
                : rows.value.map((row, ri) => {
                    const isHovered  = hovered.value === ri
                    const isStriped  = props.striped && ri % 2 === 1
                    const clickHandler = props.onRowClick || props.onPressed
                    const isClickable = !!clickHandler

                    return h('tr', {
                      key: ri,
                      style: {
                        background: !row.__isPadding && isHovered   ? '#f7f8fc'
                                  : isStriped   ? '#fafbfc'
                                  : '#ffffff',
                        cursor:     !row.__isPadding && isClickable ? 'pointer' : 'default',
                        transition: 'transform 140ms ease, filter 140ms ease, box-shadow 140ms ease, background 140ms ease',
                        transform:  !row.__isPadding && isHovered ? 'translateY(-1px)' : undefined,
                        filter:     !row.__isPadding && isHovered ? 'brightness(0.99)' : undefined,
                        boxShadow:  !row.__isPadding && isHovered ? '0 8px 20px rgba(15, 23, 42, 0.10)' : undefined,
                      },
                      onMouseenter: row.__isPadding ? undefined : () => { hovered.value = ri },
                      onMouseleave: row.__isPadding ? undefined : () => { if (hovered.value === ri) hovered.value = -1 },
                      onClick:      !row.__isPadding && isClickable ? () => clickHandler(row) : undefined,
                    }, props.columns.map((col, ci) =>
                      h('td', {
                        key: ci,
                        style: {
                          padding:      '13px 16px',
                          textAlign:    col.align ?? 'left',
                          color:        '#1e293b',
                          fontWeight:   '500',
                          borderBottom: '1px solid #f1f5f9',
                          whiteSpace:   col.wrap ? 'normal' : 'nowrap',
                          overflow:     col.allowOverflow ? 'visible' : 'hidden',
                          textOverflow: 'ellipsis',
                          width:        resolveColumnWidth(col, flexTotal),
                          maxWidth:     col.maxWidth ?? '300px',
                          position:     col.allowOverflow ? 'relative' : undefined,
                          zIndex:       col.allowOverflow ? 2 : undefined,
                        },
                      }, renderCell(row, col, ri))
                    ))
                  }),
            ]),
          ]),
        ]),

        // ── Pagination ──
        hasPagination ? h('div', {
          style: {
            display:        'flex',
            alignItems:     'center',
            justifyContent: _resolvePagerAlign(props.pagination?.align),
            gap:            summaryMode ? '16px' : '8px',
            padding:        props.pagination?.padding ?? '16px 16px',
            borderTop:      '1px solid #f1f5f9',
            flexShrink:     0,
          },
        }, [
          // Prev
          _pageBtn('<', page.value === 1, () => { if (page.value > 1) page.value-- }),
          ...(summaryMode
            ? [
                h('span', {
                  style: {
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#1e293b',
                    textAlign: 'center',
                    userSelect: 'none',
                    letterSpacing: '-0.2px'
                  },
                }, `Page ${page.value} of ${totalPages.value}`),
              ]
            : props.pagerMode === 'arrows'
            ? []
            : Array.from({ length: totalPages.value }, (_, i) => i + 1)
                .filter(p => Math.abs(p - page.value) <= 2)
                .map(p => h('button', {
                  key: p,
                  style: {
                    width:        '30px',
                    height:       '30px',
                    border:       '1.5px solid',
                    borderColor:  p === page.value ? '#6366f1' : '#e2e8f0',
                    borderRadius: '8px',
                    background:   p === page.value ? '#6366f1' : '#ffffff',
                    color:        p === page.value ? '#ffffff' : '#475467',
                    fontWeight:   p === page.value ? '700' : '400',
                    fontSize:     '12px',
                    cursor:       'pointer',
                  },
                  onClick: () => { page.value = p },
                }, p))),
          // Next
          _pageBtn('>', page.value === totalPages.value, () => { if (page.value < totalPages.value) page.value++ }),
        ]) : null,
      ])
    }
  },
})

function _resolvePagerAlign(align) {
  if (typeof align !== 'string') return 'center'
  const normalized = align.trim().toLowerCase()
  if (normalized === 'left' || normalized === 'start' || normalized === 'flex-start') return 'flex-start'
  if (normalized === 'right' || normalized === 'end' || normalized === 'flex-end') return 'flex-end'
  return 'center'
}

function _pageBtn(label, disabled, onClick) {
  return h('button', {
    style: {
      width:        '34px',
      height:       '34px',
      border:       '1.5px solid #e2e8f0',
      borderRadius: '10px',
      background:   '#ffffff',
      color:        disabled ? '#cbd5e1' : '#94a3b8',
      fontSize:     '14px',
      fontWeight:   '400',
      cursor:       disabled ? 'not-allowed' : 'pointer',
      padding:      0,
      display:      'flex',
      alignItems:   'center',
      justifyContent: 'center',
      transition:   'all 0.2s ease',
      boxShadow:    disabled ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
    },
    disabled,
    onClick,
  }, label)
}
