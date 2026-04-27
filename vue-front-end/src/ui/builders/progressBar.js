import { h, defineComponent, ref, onMounted } from 'vue'
import { formatCurrency } from '../utils.js'

/**
 * buildProgressBar(options) — Horizontal progress bar list
 *
 * Options:
 *   title      {string}   Card title. Default: 'Sales Breakdown'
 *   titleColor {string}   Title color. Default: '#232a35'
 *   bars       {Array}    [{ text, color, value }]
 *   gap        {number}   Gap between rows in px. Default: 12
 *   fontSize   {number}   Base font size. Default: 12
 *   barHeight  {number}   Bar track height in px. Default: 12
 *   animation  {boolean}  Animate fill on mount. Default: false
 *   hover      {boolean}  Enable hover highlight on each row. Default: true
 *   width      {string}   CSS width
 *   height     {string}   CSS height
 *   style      {object}
 */
export function buildProgressBar(options = {}) {
  return h(_ProgressBarComponent, options)
}

const _ProgressBarComponent = defineComponent({
  name: 'ProgressBar',
  props: {
    title:     { default: 'Sales Breakdown' },
    titleColor:{ default: '#232a35' },
    bars:      { default: () => [] },
    gap:       { default: 12 },
    fontSize:  { default: 12 },
    barHeight: { default: 12 },
    animation: { default: false },
    hover:     { default: true },
    width:     { default: undefined },
    height:    { default: undefined },
    style:     { default: () => ({}) },
  },
  setup(props) {
    const animatedIn = ref(false)
    onMounted(() => {
      if (!props.animation) {
        animatedIn.value = true
        return
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          animatedIn.value = true
        })
      })
    })

    return () => {
      const maxValue = props.bars.reduce((m, b) => Math.max(m, b.value ?? 0), 0)
      const labelSize = props.fontSize + 4

      return h('div', {
        style: {
          width:        props.width,
          height:       props.height,
          background:   '#ffffff',
          border:       'none',
          borderRadius: '12px',
          padding:      '20px',
          boxSizing:    'border-box',
          display:      'flex',
          flexDirection:'column',
          gap:          '0',
          ...props.style,
        },
      }, [
        h('div', {
          style: { fontSize: `${props.fontSize + 10}px`, fontWeight: '700', color: props.titleColor, marginBottom: `${props.gap + 6}px` },
        }, props.title),

        props.bars.length === 0
          ? h('div', { style: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: `${props.fontSize}px`, color: '#7e8696' } }, 'No data')
          : props.bars.map((bar, i) => {
              const value = Math.max(0, bar.value ?? 0)
              const ratio = maxValue > 0 ? value / maxValue : 0
              const animatedRatio = (props.animation && !animatedIn.value) ? 0 : ratio

              return h('div', {
                key: i,
                style: {
                  marginBottom: i < props.bars.length - 1 ? `${props.gap}px` : '0',
                  borderRadius: '8px',
                  padding: '4px 0',
                  transition: props.hover ? 'background 140ms ease, transform 140ms ease' : 'none',
                },
                onMouseenter: props.hover ? (e) => {
                  e.currentTarget.style.background = '#f8fafc'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  const fill = e.currentTarget.querySelector('[data-role="progress-fill"]')
                  if (fill) fill.style.filter = 'brightness(1.05)'
                } : undefined,
                onMouseleave: props.hover ? (e) => {
                  e.currentTarget.style.background = ''
                  e.currentTarget.style.transform = ''
                  const fill = e.currentTarget.querySelector('[data-role="progress-fill"]')
                  if (fill) fill.style.filter = ''
                } : undefined,
              }, [
                h('div', { style: { display: 'flex', alignItems: 'center', marginBottom: '8px' } }, [
                  h('span', { style: { flex: 1, fontSize: `${labelSize}px`, color: '#5a6273', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, bar.text ?? ''),
                  h('span', { style: { fontSize: `${labelSize}px`, color: '#232a35', fontWeight: '700', marginLeft: '12px', whiteSpace: 'nowrap' } }),
                ]),
                h('div', {
                  style: { position: 'relative', height: `${props.barHeight}px`, background: '#ecf0f6', borderRadius: `${props.barHeight / 2}px`, overflow: 'hidden' },
                }, [
                  h('div', {
                    'data-role': 'progress-fill',
                    style: {
                      position:     'absolute',
                      left:         0, top: 0, bottom: 0,
                      width:        `${animatedRatio * 100}%`,
                      background:   bar.color ?? '#6366f1',
                      borderRadius: `${props.barHeight / 2}px`,
                      transition:   props.animation ? 'width 0.9s cubic-bezier(0.22,1,0.36,1), filter 140ms ease' : 'filter 140ms ease',
                    },
                  }),
                ]),
              ])
            }),
      ])
    }
  },
})
