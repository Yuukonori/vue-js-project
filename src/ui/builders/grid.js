import { h, defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * GridSpan({ colSpan, rowSpan }) — span config helper
 * Usage: GridSpan({ colSpan: 2 }), GridSpan({ rowSpan: 2 }), GridSpan({ colSpan: 2, rowSpan: 2 })
 */
export function GridSpan({ colSpan = 1, rowSpan = 1 } = {}) {
  return { colSpan, rowSpan }
}

/**
 * buildGrid(options) — Structured rows/columns grid with optional card chrome and grid-line overlay
 *
 * Options:
 *   columns          {number}           Number of columns. Default: 1
 *   rows             {number}           Number of rows. Default: 1
 *   child            {object}           1-indexed children: { 1: vnode, 5: vnode }
 *   span             {object}           1-indexed span config: { 1: { colSpan: 2, rowSpan: 1 } }
 *   display          {true|false|'grid'}
 *                    true  = card chrome (white bg, border)
 *                    false = transparent/no chrome
 *                    'grid' = chrome + visible grid lines + index labels
 *   colGap           {number}           Column gap in px. Default: 8
 *   rowGap           {number}           Row gap in px. Default: 6
 *   emptyRowHeight   {number}           Min-height of empty rows when keepStructure. Default: 48
 *   padding          {string|number}    Container padding. Default: '12px'
 *   cellPadding      {string|number}    Per-cell padding. Default: 0
 *   backgroundColor  {string}           Default: '#ffffff'
 *   borderRadius     {string|number}    Default: '16px'
 *   border           {string}           CSS border shorthand. Default: '1px solid #E5E7EE'
 *   boxShadow        {string}           Default: none
 *   hovered          {boolean}          Hover-darkening effect. Default: false
 *   onPressed        {function}         Click handler
 *   mobileMaxColumns {number}           Cap columns on mobile (<640 px)
 *   width            {string}           CSS width. Default: '100%'
 *   height           {string}           CSS height
 *   style            {object}           Extra raw CSS styles
 */
export function buildGrid(options = {}) {
  return h(_GridComponent, options)
}

/**
 * buildContentGrid(options) — Page-level scrollable grid wrapper
 *
 * Options (subset that differ from buildGrid defaults):
 *   colGap           {number}   Default: 12
 *   rowGap           {number}   Default: 12
 *   padding          {string}   Default: '16px'
 *   cellPadding      {string}   Default: '8px'
 *   backgroundColor  {string}   Default: 'transparent'
 *   borderRadius     {string}   Default: '0px'
 *   fillViewport     {boolean}  Stretch to fill viewport height. Default: false
 *   mobileConfig     {object}   { columns, rows, span?, child? } — overrides at < 640 px
 *   tabletConfig     {object}   { columns, rows, span?, child? } — overrides at 640–1024 px
 *   ... (all buildGrid options are forwarded)
 */
export function buildContentGrid(options = {}) {
  return h(_ContentGridComponent, options)
}

// ─── Shared helpers ─────────────────────────────────────────────────────────

function _resolvePx(v) {
  if (v === undefined || v === null || v === 0) return undefined
  return typeof v === 'number' ? `${v}px` : v
}

function _isCoveredBySpan(index, columns, spans) {
  const row = Math.floor((index - 1) / columns)
  const col = (index - 1) % columns
  for (const [startStr, spanCfg] of Object.entries(spans)) {
    const si = Number(startStr)
    if (si === index) continue
    const startRow = Math.floor((si - 1) / columns)
    const startCol = (si - 1) % columns
    const colSpan  = spanCfg?.colSpan ?? 1
    const rowSpan  = spanCfg?.rowSpan ?? 1
    if (row >= startRow && row < startRow + rowSpan &&
        col >= startCol && col < startCol + colSpan) {
      return true
    }
  }
  return false
}

function _blendDark(hex, amount) {
  const clean = (hex ?? '').replace(/^#/, '')
  if (clean.length !== 6) return hex
  const n = parseInt(clean, 16)
  const r = Math.max(0, Math.round(((n >> 16) & 0xff) * (1 - amount)))
  const g = Math.max(0, Math.round(((n >>  8) & 0xff) * (1 - amount)))
  const b = Math.max(0, Math.round(( n        & 0xff) * (1 - amount)))
  return `rgb(${r},${g},${b})`
}

// ─── _GridComponent ──────────────────────────────────────────────────────────

const _GridComponent = defineComponent({
  name: 'BuildGrid',
  props: {
    columns:          { default: 1 },
    rows:             { default: 1 },
    child:            { default: () => ({}) },
    span:             { default: () => ({}) },
    display:          { default: true },
    colGap:           { default: 8 },
    rowGap:           { default: 6 },
    emptyRowHeight:   { default: 48 },
    padding:          { default: '12px' },
    cellPadding:      { default: 0 },
    backgroundColor:  { default: '#ffffff' },
    borderRadius:     { default: '16px' },
    border:           { default: undefined },
    boxShadow:        { default: undefined },
    hovered:          { default: false },
    onPressed:        { default: undefined },
    mobileMaxColumns: { default: undefined },
    width:            { default: '100%' },
    height:           { default: undefined },
    style:            { default: () => ({}) },
  },
  setup(props) {
    const isHovered  = ref(false)
    const isMobile   = ref(typeof window !== 'undefined' && window.innerWidth < 640)
    let   _resizeRef

    onMounted(() => {
      if (props.mobileMaxColumns != null) {
        _resizeRef = () => { isMobile.value = window.innerWidth < 640 }
        window.addEventListener('resize', _resizeRef)
      }
    })
    onBeforeUnmount(() => {
      if (_resizeRef) window.removeEventListener('resize', _resizeRef)
    })

    return () => {
      const showChrome    = props.display !== false
      const showGridLines = props.display === 'grid'
      const keepStructure = props.display === true || showGridLines

      const effectiveCols = (props.mobileMaxColumns != null && isMobile.value && props.mobileMaxColumns < props.columns)
        ? props.mobileMaxColumns
        : props.columns

      const bg = (props.hovered && isHovered.value)
        ? _blendDark(props.backgroundColor, 0.04)
        : props.backgroundColor

      const resolvedPad     = _resolvePx(props.padding)
      const resolvedCellPad = _resolvePx(props.cellPadding)
      const resolvedRadius  = _resolvePx(props.borderRadius)

      const containerStyle = {
        display:              'grid',
        gridTemplateColumns:  `repeat(${effectiveCols}, 1fr)`,
        columnGap:            `${props.colGap}px`,
        rowGap:               `${props.rowGap}px`,
        padding:              resolvedPad,
        width:                props.width,
        height:               props.height,
        background:           showChrome ? bg : 'transparent',
        borderRadius:         showChrome ? resolvedRadius : undefined,
        border:               showChrome ? (props.border ?? '1px solid #E5E7EE') : undefined,
        boxShadow:            showChrome ? props.boxShadow : undefined,
        boxSizing:            'border-box',
        cursor:               props.onPressed ? 'pointer' : undefined,
        ...props.style,
      }
      Object.keys(containerStyle).forEach(k => containerStyle[k] === undefined && delete containerStyle[k])

      // ── build cells ──────────────────────────────────────────────────────
      const cells = []

      // Standard path: iterate every slot, skip span-covered slots
      // Use auto-placement (span only) so CSS handles both standard and mobile reflow
      for (let r = 0; r < props.rows; r++) {
        for (let c = 0; c < props.columns; c++) {
          const index = r * props.columns + c + 1

          // Skip slots covered by another span (not the origin)
          if (_isCoveredBySpan(index, props.columns, props.span) && !props.span[index]) continue

          const spanCfg  = props.span[index]
          const colSpan  = Math.max(1, Math.min(spanCfg?.colSpan ?? 1, effectiveCols - (c % effectiveCols)))
          const rowSpan  = Math.max(1, spanCfg?.rowSpan ?? 1)
          const childNode = props.child[index]

          // Drop empty cells when not keeping structure
          if (!childNode && !keepStructure) continue

          const cellStyle = {
            gridColumn:  colSpan > 1 ? `span ${colSpan}` : undefined,
            gridRow:     rowSpan > 1 ? `span ${rowSpan}` : undefined,
            padding:     resolvedCellPad,
            minHeight:   (!childNode && keepStructure && props.emptyRowHeight > 0)
                           ? `${props.emptyRowHeight}px` : undefined,
            position:    showGridLines ? 'relative' : undefined,
            boxSizing:   'border-box',
            // Grid lines: outline doesn't affect layout
            outline:     showGridLines ? '1px solid rgba(0,0,0,0.12)' : undefined,
            outlineOffset: showGridLines ? '-0.5px' : undefined,
          }
          Object.keys(cellStyle).forEach(k => cellStyle[k] === undefined && delete cellStyle[k])

          const cellChildren = childNode ? [childNode] : []

          // Index label in grid-lines mode
          if (showGridLines) {
            const labelText = spanCfg && (colSpan > 1 || rowSpan > 1)
              ? `${index}–${(r + rowSpan - 1) * props.columns + (c + colSpan)}`
              : String(index)
            cellChildren.push(h('span', {
              key: `lbl-${index}`,
              style: {
                position:     'absolute',
                top:          '2px',
                left:         '4px',
                fontSize:     '10px',
                fontWeight:   '500',
                color:        'rgba(0,0,0,0.35)',
                pointerEvents: 'none',
                lineHeight:   '1',
                userSelect:   'none',
              },
            }, labelText))
          }

          cells.push(h('div', { key: index, style: cellStyle }, cellChildren))
        }
      }

      return h('div', {
        style:        containerStyle,
        onClick:      props.onPressed,
        onMouseenter: props.hovered ? () => { isHovered.value = true  } : undefined,
        onMouseleave: props.hovered ? () => { isHovered.value = false } : undefined,
      }, cells)
    }
  },
})

// ─── _ContentGridComponent ───────────────────────────────────────────────────

const _ContentGridComponent = defineComponent({
  name: 'BuildContentGrid',
  props: {
    columns:         { default: 1 },
    rows:            { default: 1 },
    child:           { default: () => ({}) },
    span:            { default: () => ({}) },
    display:         { default: true },
    colGap:          { default: 12 },
    rowGap:          { default: 12 },
    padding:         { default: '16px' },
    cellPadding:     { default: '8px' },
    backgroundColor: { default: 'transparent' },
    borderRadius:    { default: '0px' },
    border:          { default: undefined },
    boxShadow:       { default: undefined },
    fillViewport:    { default: false },
    mobileConfig:    { default: undefined },
    tabletConfig:    { default: undefined },
    style:           { default: () => ({}) },
  },
  setup(props) {
    // Use container width (not window width) so sidebar doesn't skew breakpoints
    const containerWidth = ref(9999)
    const containerEl    = ref(null)
    let   _ro

    onMounted(() => {
      if (!containerEl.value) return
      _ro = new ResizeObserver(entries => {
        const w = entries[0]?.contentRect?.width
        if (w != null) containerWidth.value = w
      })
      _ro.observe(containerEl.value)
    })
    onBeforeUnmount(() => {
      _ro?.disconnect()
    })

    return () => {
      const isMobile = containerWidth.value < 640
      const isTablet = containerWidth.value >= 640 && containerWidth.value < 1024

      const cfg = (isMobile && props.mobileConfig)
        ? props.mobileConfig
        : (isTablet && props.tabletConfig)
        ? props.tabletConfig
        : null

      const grid = buildGrid({
        columns:         cfg?.columns        ?? props.columns,
        rows:            cfg?.rows           ?? props.rows,
        child:           cfg?.child          ?? props.child,
        span:            cfg?.span           ?? props.span,
        display:         props.display,
        colGap:          props.colGap,
        rowGap:          props.rowGap,
        padding:         props.padding,
        cellPadding:     props.cellPadding,
        backgroundColor: props.backgroundColor,
        borderRadius:    props.borderRadius,
        border:          props.border,
        boxShadow:       props.boxShadow,
        width:           '100%',
        style:           props.style,
      })

      const scrollStyle = {
        width:     '100%',
        overflowY: 'auto',
        flex:      props.fillViewport ? '1 1 0' : undefined,
        minHeight: props.fillViewport ? 0 : undefined,
      }
      Object.keys(scrollStyle).forEach(k => scrollStyle[k] === undefined && delete scrollStyle[k])

      return h('div', { ref: containerEl, style: scrollStyle }, [grid])
    }
  },
})
