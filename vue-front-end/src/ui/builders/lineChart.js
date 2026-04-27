import { h, defineComponent, ref } from 'vue'
import { formatValueShort } from '../utils.js'

/**
 * buildLineChart(options) — Multi-series SVG line chart
 *
 * Options:
 *   series       {Array}   [{ label, color, data: [{ x, y }] }]
 *                           x: string (month/category), y: number
 *   width        {string}  CSS width. Default: '100%'
 *   height       {number}  px height. Default: 300
 *   showAverage  {boolean} Draw a dashed average line. Default: false
 *   displayValue {boolean} Show value labels on points. Default: false
 *   emptyText    {string}  Default: 'No Data'
 *   style        {object}
 */
export function buildLineChart(options = {}) {
  return h(_LineChartComponent, options)
}

const _LineChartComponent = defineComponent({
  name: 'LineChart',
  props: {
    series:       { default: () => [] },
    width:        { default: '100%' },
    height:       { default: 300 },
    showAverage:  { default: false },
    displayValue: { default: false },
    emptyText:    { default: 'No Data' },
    style:        { default: () => ({}) },
  },
  setup(props) {
    const hoveredX = ref(null)   // index of hovered x position

    const ML = 48, MR = 20, MT = 24, MB = 56  // margins

    function niceStep(raw) {
      if (raw <= 0) return 1
      const exp  = Math.pow(10, Math.floor(Math.log10(raw)))
      const f    = raw / exp
      const nice = f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10
      return nice * exp
    }

    function computeScale(series, W, H) {
      const allVals = series.flatMap(s => s.data.map(d => d.y))
      if (!allVals.length) return null
      const maxY = Math.max(...allVals)
      const GRIDS = 4
      const step  = niceStep(maxY / GRIDS)
      const top   = step * GRIDS < maxY ? step * (GRIDS + 1) : step * GRIDS
      const chartW = W - ML - MR
      const chartH = H - MT - MB

      const months = series[0]?.data.map(d => d.x) ?? []
      const xOf = (i) => {
        if (months.length === 1) return ML + chartW / 2
        return ML + i * (chartW / (months.length - 1))
      }
      const yOf = (v) => MT + chartH * (1 - v / top)

      return { top, step, GRIDS, chartW, chartH, months, xOf, yOf }
    }

    function dashedLine(x1, y1, x2, y2) {
      return h('line', {
        x1, y1, x2, y2,
        stroke: 'rgba(0,0,0,0.15)',
        'stroke-width': 1,
        'stroke-dasharray': '4 4',
      })
    }

    return () => {
      const hasData = props.series.some(s => s.data?.length > 0)

      if (!hasData) {
        return h('div', {
          style: { width: props.width, height: `${props.height}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...props.style },
        }, h('span', { style: { color: '#94a3b8', fontSize: '14px', fontWeight: '600' } }, props.emptyText))
      }

      return h('div', {
        style: { width: props.width, ...props.style },
      }, [
        h('svg', {
          width:  '100%',
          height: props.height,
          viewBox: `0 0 600 ${props.height}`,
          preserveAspectRatio: 'none',
          style: { display: 'block', overflow: 'visible' },
          onMouseleave: () => { hoveredX.value = null },
          onMousemove: (e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const svgW = 600
            const ratioX = svgW / rect.width
            const mx = (e.clientX - rect.left) * ratioX
            const sc = computeScale(props.series, svgW, props.height)
            if (!sc) return
            const { months, xOf } = sc
            if (months.length === 0) return
            let closest = 0, minD = Infinity
            months.forEach((_, i) => {
              const d = Math.abs(xOf(i) - mx)
              if (d < minD) { minD = d; closest = i }
            })
            hoveredX.value = closest
          },
        }, (() => {
          const W  = 600
          const H  = props.height
          const sc = computeScale(props.series, W, H)
          if (!sc) return []
          const { top, step, GRIDS, chartW, chartH, months, xOf, yOf } = sc
          const nodes = []

          // Grid lines
          for (let i = 0; i <= GRIDS; i++) {
            const y = MT + (chartH / GRIDS) * i
            nodes.push(dashedLine(ML, y, W - MR, y))
            const val = top - step * i
            nodes.push(h('text', {
              x: ML - 6, y: y + 4,
              'text-anchor': 'end',
              'font-size': 11,
              fill: '#475467',
            }, formatValueShort(val)))
          }

          // Axes
          nodes.push(h('line', { x1: ML, y1: MT, x2: ML, y2: MT + chartH, stroke: '#cbd5e1', 'stroke-width': 1.2 }))
          nodes.push(h('line', { x1: ML, y1: MT + chartH, x2: W - MR, y2: MT + chartH, stroke: '#cbd5e1', 'stroke-width': 1.2 }))

          // Hovered vertical line
          if (hoveredX.value !== null) {
            const hx = xOf(hoveredX.value)
            nodes.push(h('line', { x1: hx, y1: MT, x2: hx, y2: MT + chartH, stroke: 'rgba(0,0,0,0.15)', 'stroke-width': 1 }))
          }

          // Series lines + dots
          props.series.forEach((s, si) => {
            if (!s.data?.length) return
            const pts = s.data.map((d, i) => ({ x: xOf(i), y: yOf(d.y) }))
            const d   = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

            nodes.push(h('path', {
              key: `line-${si}`,
              d,
              fill:           'none',
              stroke:         s.color ?? '#6366f1',
              'stroke-width': 2,
            }))

            pts.forEach((p, i) => {
              const isHov = hoveredX.value === i
              nodes.push(h('circle', {
                key:    `dot-${si}-${i}`,
                cx:     p.x,
                cy:     p.y,
                r:      isHov ? 6 : 4,
                fill:   '#ffffff',
                stroke: s.color ?? '#6366f1',
                'stroke-width': 2,
                style: { transition: 'r 0.1s' },
              }))

              // Value labels
              if (props.displayValue || isHov) {
                nodes.push(h('text', {
                  key:            `val-${si}-${i}`,
                  x:              p.x,
                  y:              p.y - 10,
                  'text-anchor':  'middle',
                  'font-size':    10,
                  'font-weight':  '600',
                  fill:           s.color ?? '#6366f1',
                }, formatValueShort(s.data[i].y)))
              }
            })
          })

          // X-axis labels
          months.forEach((m, i) => {
            nodes.push(h('text', {
              key:           `xl-${i}`,
              x:             xOf(i),
              y:             MT + chartH + 18,
              'text-anchor': 'middle',
              'font-size':   12,
              'font-weight': '600',
              fill:          '#1e293b',
            }, m))
          })

          // Legend
          const legendY  = MT + chartH + 44
          const itemW    = 80
          const totalW   = props.series.length * itemW
          const startX   = ML + (chartW - totalW) / 2
          props.series.forEach((s, i) => {
            const lx = startX + i * itemW
            nodes.push(h('circle', { key: `lg-${i}`, cx: lx + 5, cy: legendY, r: 5, fill: s.color ?? '#6366f1' }))
            nodes.push(h('text', { key: `lt-${i}`, x: lx + 14, y: legendY + 4, 'font-size': 12, fill: '#1e293b', 'font-weight': '600' }, s.label ?? ''))
          })

          return nodes
        })()),
      ])
    }
  },
})
