import { h, defineComponent, ref, computed, onMounted } from 'vue'

/**
 * buildTable(options) — Data table with optional pagination and row hover
 *
 * Options:
 *   columns      {Array}    [{ key, label, width, align, render }]
 *                            render: (value, row, index) => VNode|string
 *   data         {Array}    Array of row objects
 *   pageSize     {number}   Rows per page. 0 = no pagination. Default: 0
 *   emptyText    {string}   Text when data is empty. Default: 'No data'
 *   striped      {boolean}  Alternate row shading. Default: false
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
    emptyText:       { default: 'No data' },
    striped:         { default: false },
    onRowClick:      { default: null },
    headerUppercase: { default: false },
    width:           { default: undefined },
    height:          { default: undefined },
    style:           { default: () => ({}) },
  },
  setup(props) {
    const page    = ref(1)
    const hovered = ref(-1)

    const totalPages = computed(() =>
      props.pageSize > 0 ? Math.ceil(props.data.length / props.pageSize) : 1
    )

    const rows = computed(() => {
      if (props.pageSize <= 0) return props.data
      const start = (page.value - 1) * props.pageSize
      return props.data.slice(start, start + props.pageSize)
    })

    function cellValue(row, col) {
      return row[col.key] ?? '-'
    }

    function renderCell(row, col, idx) {
      const val = cellValue(row, col)
      if (col.render) return col.render(val, row, idx)
      return String(val)
    }

    return () => {
      const hasPagination = props.pageSize > 0 && props.data.length > props.pageSize

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
                    width:         col.width,
                    whiteSpace:    'nowrap',
                    borderBottom:  '1px solid #e5e7ee',
                  },
                }, props.headerUppercase ? String(col.label).toUpperCase() : col.label)
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
                    const isClickable = !!props.onRowClick

                    return h('tr', {
                      key: ri,
                      style: {
                        background: isHovered   ? '#f7f8fc'
                                  : isStriped   ? '#fafbfc'
                                  : '#ffffff',
                        cursor:     isClickable ? 'pointer' : 'default',
                        transition: 'background 0.1s',
                      },
                      onMouseenter: () => { hovered.value = ri },
                      onMouseleave: () => { if (hovered.value === ri) hovered.value = -1 },
                      onClick:      isClickable ? () => props.onRowClick(row) : undefined,
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
                          overflow:     'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth:     col.maxWidth ?? '300px',
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
            justifyContent: 'center',
            gap:            '6px',
            padding:        '12px 16px',
            borderTop:      '1px solid #f1f5f9',
            flexShrink:     0,
          },
        }, [
          // Prev
          _pageBtn('<', page.value === 1, () => { if (page.value > 1) page.value-- }),
          // Pages
          ...Array.from({ length: totalPages.value }, (_, i) => i + 1)
            .filter(p => Math.abs(p - page.value) <= 2)
            .map(p => h('button', {
              key: p,
              style: {
                width:        '32px',
                height:       '32px',
                border:       '1.5px solid',
                borderColor:  p === page.value ? '#6366f1' : '#e2e8f0',
                borderRadius: '8px',
                background:   p === page.value ? '#6366f1' : '#ffffff',
                color:        p === page.value ? '#ffffff' : '#475467',
                fontWeight:   p === page.value ? '700' : '400',
                fontSize:     '13px',
                cursor:       'pointer',
              },
              onClick: () => { page.value = p },
            }, p)),
          // Next
          _pageBtn('>', page.value === totalPages.value, () => { if (page.value < totalPages.value) page.value++ }),
        ]) : null,
      ])
    }
  },
})

function _pageBtn(label, disabled, onClick) {
  return h('button', {
    style: {
      width:        '32px',
      height:       '32px',
      border:       '1.5px solid #e2e8f0',
      borderRadius: '8px',
      background:   disabled ? '#f8fafc' : '#ffffff',
      color:        disabled ? '#cbd5e1' : '#475467',
      fontSize:     '13px',
      cursor:       disabled ? 'not-allowed' : 'pointer',
    },
    disabled,
    onClick,
  }, label)
}
