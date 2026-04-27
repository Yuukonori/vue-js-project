import { h, defineComponent, ref } from 'vue'

/**
 * buildPieChart(options) — Filled pie chart with optional % labels
 *
 * Options:
 *   slices       {Array}   [{ label, color, value }]
 *                           value: number (used as proportion)
 *   displayValue {boolean} Show % labels outside slices. Default: false
 *   emptyText    {string}  Default: 'No Data'
 *   size         {number}  Chart diameter in px. Default: 280
 *   width        {string}  CSS width. Default: '100%'
 *   style        {object}
 */
export function buildPieChart(options = {}) {
  return h(_PieChartComponent, options)
}

const _PieChartComponent = defineComponent({
  name: 'PieChart',
  props: {
    slices:       { default: () => [] },
    displayValue: { default: false },
    emptyText:    { default: 'No Data' },
    size:         { default: 280 },
    width:        { default: '100%' },
    style:        { default: () => ({}) },
  },
  setup(props) {
    const hoveredIdx = ref(null)

    function pieSlicePath(cx, cy, r, startAngle, sweepAngle, popOut) {
      if (sweepAngle <= 0) return ''
      const midAngle = startAngle + sweepAngle / 2
      const ox = popOut ? Math.cos(midAngle) * popOut : 0
      const oy = popOut ? Math.sin(midAngle) * popOut : 0
      const large = sweepAngle > Math.PI ? 1 : 0
      const x1 = cx + ox + r * Math.cos(startAngle)
      const y1 = cy + oy + r * Math.sin(startAngle)
      const x2 = cx + ox + r * Math.cos(startAngle + sweepAngle)
      const y2 = cy + oy + r * Math.sin(startAngle + sweepAngle)
      return `M ${cx + ox} ${cy + oy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`
    }

    return () => {
      const valid = props.slices.filter(s => (s.value ?? 0) > 0)
      const total = valid.reduce((s, sl) => s + sl.value, 0)

      if (!valid.length || total <= 0) {
        return h('div', {
          style: { width: props.width, height: `${props.size}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...props.style },
        }, h('span', { style: { color: '#94a3b8', fontSize: '14px', fontWeight: '600' } }, props.emptyText))
      }

      const PAD   = 20   // padding around pie for labels
      const SIZE  = props.size
      const cx    = SIZE / 2
      const cy    = SIZE / 2
      const r     = SIZE / 2 - PAD
      const labelR = r + 14

      const sliceNodes  = []
      const labelNodes  = []
      let angle = -Math.PI / 2
      const starts = []
      const sweeps = []

      valid.forEach((sl, i) => {
        const sweep = (sl.value / total) * 2 * Math.PI
        starts.push(angle)
        sweeps.push(sweep)

        const isHov    = hoveredIdx.value === i
        const popOut   = isHov ? 6 : 0
        const fillColor = isHov
          ? _tint(sl.color ?? '#6366f1', 0.15)
          : (sl.color ?? '#6366f1')

        sliceNodes.push(h('path', {
          key:          `s-${i}`,
          d:            pieSlicePath(cx, cy, r, angle, sweep, popOut),
          fill:         fillColor,
          style:        { transition: 'fill 0.15s, d 0.15s', cursor: 'pointer' },
          onMouseenter: () => { hoveredIdx.value = i },
          onMouseleave: () => { if (hoveredIdx.value === i) hoveredIdx.value = null },
        }))

        if (props.displayValue && sweep > 0.15) {
          const midAngle  = angle + sweep / 2
          const isRight   = Math.cos(midAngle) >= 0
          const lx        = cx + Math.cos(midAngle) * labelR
          const ly        = cy + Math.sin(midAngle) * labelR
          const pct       = ((sl.value / total) * 100).toFixed(0) + '%'
          const labelText = sl.label ? `${sl.label}: ${pct}` : pct

          labelNodes.push(h('text', {
            key:           `l-${i}`,
            x:             lx + (isRight ? 4 : -4),
            y:             ly + 4,
            'text-anchor': isRight ? 'start' : 'end',
            'font-size':   11,
            'font-weight': '600',
            fill:          sl.color ?? '#6366f1',
          }, labelText))
        }
        angle += sweep
      })

      return h('div', {
        style: { width: props.width, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', ...props.style },
      }, [
        h('svg', {
          width:  SIZE,
          height: SIZE,
          viewBox: `0 0 ${SIZE} ${SIZE}`,
          style: { overflow: 'visible' },
        }, [...sliceNodes, ...labelNodes]),

        // Legend
        h('div', {
          style: { display: 'flex', flexWrap: 'wrap', gap: '8px 16px', justifyContent: 'center' },
        }, valid.map((sl, i) => {
          const pct = ((sl.value / total) * 100).toFixed(1).replace(/\.0$/, '')
          return h('div', {
            key: i,
            style: { display: 'flex', alignItems: 'center', gap: '6px', cursor: 'default', opacity: hoveredIdx.value !== null && hoveredIdx.value !== i ? 0.4 : 1, transition: 'opacity 0.15s' },
            onMouseenter: () => { hoveredIdx.value = i },
            onMouseleave: () => { if (hoveredIdx.value === i) hoveredIdx.value = null },
          }, [
            h('span', { style: { width: '10px', height: '10px', borderRadius: '50%', background: sl.color ?? '#6366f1', flexShrink: 0 } }),
            h('span', { style: { fontSize: '12px', color: '#475467', fontWeight: '500' } }, `${sl.label ?? ''} ${pct}%`),
          ])
        })),
      ])
    }
  },
})

function _tint(hex, amount) {
  const n   = parseInt(hex.replace('#', ''), 16)
  const r   = Math.min(255, Math.round(((n >> 16) & 0xff) + (255 - ((n >> 16) & 0xff)) * amount))
  const g   = Math.min(255, Math.round(((n >> 8)  & 0xff) + (255 - ((n >> 8)  & 0xff)) * amount))
  const b   = Math.min(255, Math.round(( n        & 0xff) + (255 - ( n        & 0xff)) * amount))
  return `rgb(${r},${g},${b})`
}
