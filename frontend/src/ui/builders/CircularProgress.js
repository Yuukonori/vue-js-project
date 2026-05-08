import { h, defineComponent, ref, onMounted } from 'vue'

/**
 * buildCircularProgress(options)
 *
 * Options:
 *   value        {number}  Current value. Default: 0
 *   max          {number}  Max value. Default: 100
 *   size         {number}  Circle size in px. Default: 120
 *   strokeWidth  {number}  Ring thickness in px. Default: 10
 *   color        {string}  Progress color. Default: '#2563eb'
 *   trackColor   {string}  Track color. Default: '#e2e8f0'
 *   textColor    {string}  Center text color. Default: '#0f172a'
 *   suffix       {string}  Text suffix. Default: ''
 *   showValue    {boolean} Show center value. Default: true
 *   rounded      {boolean} Round line cap. Default: true
 *   animation    {boolean} Animate value on mount. Default: true
 *   duration     {number}  Animation duration ms. Default: 900
 *   width        {string}  CSS width
 *   height       {string}  CSS height
 *   style        {object}  Wrapper style override
 */
export function buildCircularProgress(options = {}) {
  return h(_CircularProgressComponent, options)
}

const _CircularProgressComponent = defineComponent({
  name: 'CircularProgress',
  props: {
    value:       { default: 0 },
    max:         { default: 100 },
    size:        { default: 120 },
    strokeWidth: { default: 10 },
    color:       { default: '#2563eb' },
    trackColor:  { default: '#e2e8f0' },
    textColor:   { default: '#0f172a' },
    suffix:      { default: '' },
    showValue:   { default: true },
    rounded:     { default: true },
    animation:   { default: true },
    duration:    { default: 900 },
    hover:       { default: true },
    width:       { default: undefined },
    height:      { default: undefined },
    style:       { default: () => ({}) },
  },
  setup(props) {
    const mounted = ref(false)
    const hovered = ref(false)
    onMounted(() => {
      if (!props.animation) {
        mounted.value = true
        return
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          mounted.value = true
        })
      })
    })

    return () => {
      const max = Number(props.max) > 0 ? Number(props.max) : 100
      const rawValue = Number(props.value) || 0
      const clamped = Math.min(max, Math.max(0, rawValue))
      const ratio = clamped / max

      const size = Number(props.size) || 120
      const stroke = Number(props.strokeWidth) || 10
      const center = size / 2
      const radius = Math.max(1, center - stroke / 2)
      const circumference = 2 * Math.PI * radius
      const animatedRatio = props.animation && !mounted.value ? 0 : ratio
      const dashoffset = circumference * (1 - animatedRatio)

      return h('div', {
        style: {
          width: props.width ?? `${size}px`,
          height: props.height ?? `${size}px`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transform: props.hover && hovered.value ? 'translateY(-1px) scale(1.02)' : 'none',
          transition: 'transform 160ms ease',
          ...props.style,
        },
        onMouseenter: props.hover ? () => { hovered.value = true } : undefined,
        onMouseleave: props.hover ? () => { hovered.value = false } : undefined,
      }, [
        h('svg', {
          width: size,
          height: size,
          viewBox: `0 0 ${size} ${size}`,
          style: { transform: 'rotate(-90deg)' },
        }, [
          h('circle', {
            cx: center,
            cy: center,
            r: radius,
            fill: 'none',
            stroke: props.trackColor,
            'stroke-width': stroke,
          }),
          h('circle', {
            cx: center,
            cy: center,
            r: radius,
            fill: 'none',
            stroke: props.color,
            'stroke-width': stroke,
            'stroke-linecap': props.rounded ? 'round' : 'butt',
            'stroke-dasharray': `${circumference} ${circumference}`,
            'stroke-dashoffset': dashoffset,
            style: {
              transition: props.animation
                ? `stroke-dashoffset ${props.duration}ms cubic-bezier(0.22,1,0.36,1)`
                : 'none',
              filter: props.hover && hovered.value ? 'brightness(1.06)' : 'none',
            },
          }),
        ]),
        props.showValue
          ? h('div', {
              style: {
                position: 'absolute',
                fontSize: `${Math.max(12, Math.round(size * 0.22))}px`,
                fontWeight: '700',
                color: props.textColor,
                lineHeight: '1',
                userSelect: 'none',
                transition: 'transform 160ms ease',
                transform: props.hover && hovered.value ? 'scale(1.04)' : 'none',
              },
            }, `${Math.round(clamped)}${props.suffix}`)
          : null,
      ])
    }
  },
})
