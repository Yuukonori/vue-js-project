import { h, defineComponent, ref, watch } from 'vue'

/**
 * buildTapOption(options) - Segmented option/tap selector
 *
 * Options:
 *   items        {Array}    [{ label, value }]
 *   value        {Ref|any}  Selected value (or Ref)
 *   onUpdate     {function} (value) => void
 *   full         {boolean}  Stretch each option equally. Default: true
 *   bg           {string}   Container background. Default: '#eef2ff'
 *   selectedBg   {string}   Active option background. Default: '#ffffff'
 *   selectedColor{string}   Active text color. Default: '#1e293b'
 *   color        {string}   Inactive text color. Default: '#64748b'
 *   radius       {string}   Container radius. Default: '14px'
 *   height       {string}   Option height. Default: '40px'
 *   disabled     {boolean}
 *   style        {object}
 */
export function buildTapOption(options = {}) {
  return h(_TapOptionComponent, options)
}

const _TapOptionComponent = defineComponent({
  name: 'TapOption',
  props: {
    items:         { default: () => [] },
    value:         { default: null },
    onUpdate:      { default: null },
    full:          { default: true },
    bg:            { default: '#eef2ff' },
    selectedBg:    { default: '#ffffff' },
    selectedColor: { default: '#1e293b' },
    color:         { default: '#64748b' },
    radius:        { default: '14px' },
    height:        { default: '40px' },
    disabled:      { default: false },
    style:         { default: () => ({}) },
  },
  setup(props) {
    function getRaw() {
      return typeof props.value === 'object' && props.value !== null && 'value' in props.value
        ? props.value.value
        : props.value
    }

    const selected = ref(getRaw() ?? props.items[0]?.value ?? null)

    watch(
      () => getRaw(),
      (next) => { selected.value = next ?? props.items[0]?.value ?? null },
      { immediate: true }
    )

    function setValue(v) {
      if (props.disabled) return
      selected.value = v
      // Update parent ref if passed
      if (typeof props.value === 'object' && props.value !== null && 'value' in props.value) {
        props.value.value = v
      }
      // Trigger update event
      if (props.onUpdate) {
        props.onUpdate(v)
      }
    }

    return () => h('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px',
        borderRadius: props.radius,
        background: props.bg,
        width: '100%',
        boxSizing: 'border-box',
        opacity: props.disabled ? 0.65 : 1,
        position: 'relative',
        overflow: 'hidden',
        ...props.style,
      },
    }, [
      selected.value != null
        ? h('div', {
            style: {
              position: 'absolute',
              top: '4px',
              bottom: '4px',
              left: '4px',
              width: `calc((100% - 8px - ${(props.items.length - 1) * 6}px) / ${Math.max(props.items.length, 1)})`,
              borderRadius: '10px',
              background: props.selectedBg,
              boxShadow: '0 3px 10px rgba(15, 23, 42, 0.10)',
              transform: `translateX(calc((100% + 6px) * ${Math.max(0, props.items.findIndex(i => String(i.value) === String(selected.value))) }))`,
              transition: 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1), background-color 180ms ease, box-shadow 200ms ease',
              pointerEvents: 'none',
            },
          })
        : null,
      ...props.items.map((item, idx) => {
      const isActive = String(item.value) === String(selected.value)
      return h('button', {
        key: item.value ?? idx,
        type: 'button',
        disabled: props.disabled,
        style: {
          flex: props.full ? 1 : undefined,
          height: props.height,
          padding: '0 14px',
          border: 'none',
          borderRadius: '10px',
          background: 'transparent',
          color: isActive ? props.selectedColor : props.color,
          fontSize: '14px',
          fontWeight: isActive ? '600' : '500',
          cursor: props.disabled ? 'not-allowed' : 'pointer',
          transition: 'color 220ms ease, transform 180ms ease',
          whiteSpace: 'nowrap',
          position: 'relative',
          zIndex: 1,
        },
        onClick: () => setValue(item.value),
        onMouseenter: (e) => {
          if (!props.disabled && !isActive) e.currentTarget.style.transform = 'translateY(-1px)'
        },
        onMouseleave: (e) => {
          e.currentTarget.style.transform = ''
        },
      }, item.label ?? item.name ?? String(item.value ?? ''))
    }),
    ])
  },
})
