import { h, defineComponent, ref } from 'vue'

/**
 * buildDonutChart(options) — Donut/ring chart with right-side legend
 *
 * Options:
 *   slices         {Array}   [{ name, text, detail, color, value }]
 *                             value: number (used as proportion)
 *   strokeWidth    {number}  Ring thickness in px. Default: 50
 *   gap            {number}  Gap between slices in degrees. Default: 2
 *   displayValue   {boolean} Show % labels. Default: false
 *   emptyText      {string}  Default: 'No Data'
 *   width          {string}  CSS width. Default: '100%'
 *   height         {number}  px height. Default: 300
 *   style          {object}
 */
export function buildDonutChart(options = {}) {
  return h(_DonutChartComponent, options)
}

const _DonutChartComponent = defineComponent({
  name: 'DonutChart',
  props: {
    slices:       { default: () => [] },
    strokeWidth:  { default: 50 },
    gap:          { default: 2 },
    displayValue: { default: false },
    emptyText:    { default: 'No Data' },
    width:        { default: '100%' },
    height:       { default: 300 },
    style:        { default: () => ({}) },
  },
  setup(props) {
    const hoveredIdx = ref(null)

    function degToRad(d) { return d * Math.PI / 180 }

    function arcPath(cx, cy, r, startAngle, sweepAngle) {
      if (sweepAngle <= 0) return ''
      const large = sweepAngle > Math.PI ? 1 : 0
      const x1 = cx + r * Math.cos(startAngle)
      const y1 = cy + r * Math.sin(startAngle)
      const x2 = cx + r * Math.cos(startAngle + sweepAngle)
      const y2 = cy + r * Math.sin(startAngle + sweepAngle)
      return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
    }

    return () => {
      const valid = props.slices.filter(s => (s.value ?? 0) > 0)
      const total = valid.reduce((s, sl) => s + sl.value, 0)

      if (!valid.length || total <= 0) {
        return h('div', {
          style: { width: props.width, height: `${props.height}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...props.style },
        }, h('span', { style: { color: '#94a3b8', fontSize: '14px', fontWeight: '600' } }, props.emptyText))
      }

      const SIZE   = props.height
      const cx     = SIZE / 2
      const cy     = SIZE / 2
      const r      = SIZE / 2 - props.strokeWidth / 2 - 4
      const gap    = degToRad(props.gap)

      // Build arc nodes
      const arcNodes = []
      let angle = -Math.PI / 2

      valid.forEach((sl, i) => {
        const sweep     = (sl.value / total) * 2 * Math.PI
        const adjSweep  = Math.max(0, sweep - gap)
        const isHov     = hoveredIdx.value === i
        const sw        = isHov ? props.strokeWidth + 6 : props.strokeWidth
        const rr        = isHov ? r + 3 : r

        if (adjSweep > 0) {
          arcNodes.push(h('path', {
            key:              `arc-${i}`,
            d:                arcPath(cx, cy, rr, angle + gap / 2, adjSweep),
            fill:             'none',
            stroke:           sl.color ?? '#6366f1',
            'stroke-width':   sw,
            'stroke-linecap': 'butt',
            style:            { transition: 'stroke-width 0.15s, d 0.15s' },
            onMouseenter:     () => { hoveredIdx.value = i },
            onMouseleave:     () => { if (hoveredIdx.value === i) hoveredIdx.value = null },
          }))

          if (props.displayValue) {
            const midAngle = angle + gap / 2 + adjSweep / 2
            const pct = ((sl.value / total) * 100).toFixed(1).replace(/\.0$/, '') + '%'
            arcNodes.push(h('text', {
              key:           `pct-${i}`,
              x:             cx + r * Math.cos(midAngle),
              y:             cy + r * Math.sin(midAngle) + 4,
              'text-anchor': 'middle',
              'font-size':   11,
              'font-weight': '600',
              fill:          '#ffffff',
            }, pct))
          }
        }
        angle += sweep
      })

      // Legend rows
      const legendItems = valid.map((sl, i) => {
        const pct = ((sl.value / total) * 100).toFixed(1).replace(/\.0$/, '')
        return h('div', {
          key:          i,
          style: {
            display:        'flex',
            alignItems:     'center',
            gap:            '8px',
            padding:        '5px 0',
            cursor:         'default',
            opacity:        hoveredIdx.value !== null && hoveredIdx.value !== i ? 0.5 : 1,
            transition:     'opacity 0.15s',
          },
          onMouseenter: () => { hoveredIdx.value = i },
          onMouseleave: () => { if (hoveredIdx.value === i) hoveredIdx.value = null },
        }, [
          h('span', {
            style: {
              width: '16px', height: '16px', borderRadius: '4px',
              background: sl.color ?? '#6366f1', flexShrink: 0,
            },
          }),
          h('div', { style: { flex: 1, minWidth: 0 } }, [
            h('div', { style: { fontSize: '13px', fontWeight: '600', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, sl.name),
            sl.text ? h('div', { style: { fontSize: '12px', color: '#64748b' } }, sl.text) : null,
          ].filter(Boolean)),
          props.displayValue
            ? h('div', { style: { textAlign: 'right', flexShrink: 0 } }, [
                h('div', { style: { fontSize: '13px', fontWeight: '600', color: '#1e293b' } }, sl.text ?? ''),
                h('div', { style: { fontSize: '12px', color: '#94a3b8' } }, `${pct}%`),
              ])
            : null,
        ].filter(Boolean))
      })

      return h('div', {
        style: { width: props.width, display: 'flex', alignItems: 'center', gap: '16px', ...props.style },
      }, [
        // Donut SVG
        h('svg', {
          width:  SIZE,
          height: SIZE,
          viewBox: `0 0 ${SIZE} ${SIZE}`,
          style: { flexShrink: 0 },
        }, arcNodes),

        // Legend
        h('div', {
          style: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
        }, legendItems),
      ])
    }
  },
})
