import { h, defineComponent, ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

/**
 * buildDropdown(options) — Dropdown select
 *
 * Options:
 *   placeholder  {string}   Placeholder label when nothing is selected
 *   items        {Array}    [{ text, value }] — option list
 *   value        {Ref|any}  Currently selected value (or Ref to it)
 *   onUpdate     {function} (value) => void — called on selection
 *   multiSelect  {boolean}  Allow multiple selections. Default: false
 *   required     {boolean}  Red border when empty. Default: false
 *   disabled     {boolean}
 *   clearable    {boolean}  Show clear button when selected. Default: false
 *   showClearButton {boolean} Alias of clearable
 *   width        {string}   CSS width
 *   height       {string}   CSS height
 *   bg           {string}   Background color. Default: '#ffffff'
 *   radius       {string}   Border radius. Default: '12px'
 *   style        {object}
 */
export function buildDropdown(options = {}) {
  return h(_DropdownComponent, options)
}

const _DropdownComponent = defineComponent({
  name: 'Dropdown',
  props: {
    placeholder: { default: 'Select...' },
    items:       { default: () => [] },
    value:       { default: null },
    onUpdate:    { default: null },
    multiSelect: { default: false },
    required:    { default: false },
    disabled:    { default: false },
    clearable:   { default: false },
    showClearButton: { default: false },
    width:       { default: undefined },
    height:      { default: '44px' },
    bg:          { default: '#ffffff' },
    radius:      { default: '12px' },
    style:       { default: () => ({}) },
  },
  setup(props) {
    const isOpen    = ref(false)
    const container = ref(null)

    function getRaw() {
      return typeof props.value === 'object' && props.value !== null && 'value' in props.value
        ? props.value.value
        : props.value
    }

    function setRaw(v) {
      if (typeof props.value === 'object' && props.value !== null && 'value' in props.value) {
        props.value.value = v
      }
      props.onUpdate?.(v)
    }

    const selectedValues = computed(() => {
      if (!props.multiSelect) return []
      const raw = getRaw()
      if (Array.isArray(raw)) return raw.map(String)
      return raw != null ? [String(raw)] : []
    })

    function isSelected(itemValue) {
      if (props.multiSelect) return selectedValues.value.includes(String(itemValue))
      const raw = getRaw()
      return raw != null && String(raw) === String(itemValue)
    }

    function getLabel() {
      if (props.multiSelect) {
        const labels = props.items
          .filter(i => selectedValues.value.includes(String(i.value)))
          .map(i => i.text)
        if (!labels.length) return null
        if (labels.length <= 2) return labels.join(', ')
        return `${labels[0]}, ${labels[1]} +${labels.length - 2}`
      }
      const raw = getRaw()
      if (raw == null) return null
      return props.items.find(i => String(i.value) === String(raw))?.text ?? null
    }

    function toggle(itemValue) {
      if (props.multiSelect) {
        const cur = [...selectedValues.value]
        const idx = cur.indexOf(String(itemValue))
        if (idx >= 0) cur.splice(idx, 1)
        else cur.push(String(itemValue))
        setRaw(cur)
      } else {
        setRaw(itemValue)
        isOpen.value = false
      }
    }

    function clear(e) {
      e.stopPropagation()
      setRaw(props.multiSelect ? [] : null)
    }

    function onOutsideClick(e) {
      if (container.value && !container.value.contains(e.target)) {
        isOpen.value = false
      }
    }

    onMounted(() => document.addEventListener('mousedown', onOutsideClick))
    onBeforeUnmount(() => document.removeEventListener('mousedown', onOutsideClick))

    return () => {
      const label       = getLabel()
      const hasValue    = props.multiSelect ? selectedValues.value.length > 0 : getRaw() != null
      const canClear    = props.clearable || props.showClearButton
      const borderColor = (props.required && !hasValue) ? '#ef4444' : (isOpen.value ? '#6366f1' : '#e2e8f0')

      return h('div', {
        ref: container,
        style: { position: 'relative', width: props.width, display: 'inline-block', ...props.style },
      }, [
        // Trigger
        h('div', {
          style: {
            display:      'flex',
            alignItems:   'center',
            height:       props.height,
            padding:      '0 14px',
            background:   props.disabled ? '#f8fafc' : props.bg,
            border:       `1.5px solid ${borderColor}`,
            borderRadius: props.radius,
            cursor:       props.disabled ? 'not-allowed' : 'pointer',
            userSelect:   'none',
            boxSizing:    'border-box',
            transition:   'border-color 0.15s',
            gap:          '8px',
          },
          onClick: props.disabled ? undefined : () => { isOpen.value = !isOpen.value },
        }, [
          h('span', {
            style: {
              flex:         1,
              fontSize:     '15px',
              color:        label ? '#1e293b' : '#94a3b8',
              overflow:     'hidden',
              textOverflow: 'ellipsis',
              whiteSpace:   'nowrap',
            },
          }, label ?? props.placeholder),

          hasValue && canClear
            ? h('span', {
                style: { color: '#94a3b8', fontSize: '16px', lineHeight: 1, padding: '0 2px', cursor: 'pointer' },
                onClick: clear,
              }, '×')
            : h('svg', {
                width: 16, height: 16, viewBox: '0 0 24 24',
                fill: 'none', stroke: '#94a3b8', 'stroke-width': 2,
                style: { flexShrink: 0, transition: 'transform 0.15s', transform: isOpen.value ? 'rotate(180deg)' : 'none' },
              }, [h('path', { d: 'M6 9l6 6 6-6' })]),
        ]),

        // Dropdown menu
        isOpen.value ? h('div', {
          style: {
            position:     'absolute',
            top:          'calc(100% + 6px)',
            left:         0,
            right:        0,
            background:   '#f7f8fc',
            border:       '1px solid rgba(0,0,0,0.1)',
            borderRadius: props.radius,
            boxShadow:    '0 8px 24px rgba(0,0,0,0.08)',
            zIndex:       9999,
            maxHeight:    '220px',
            overflowY:    'auto',
          },
        }, props.items.map((item, idx) =>
          h('div', {
            key: idx,
            style: {
              padding:    '10px 14px',
              fontSize:   '15px',
              color:      '#1e293b',
              cursor:     'pointer',
              background: isSelected(item.value) ? '#ede9fe' : 'transparent',
              fontWeight: isSelected(item.value) ? '600' : '400',
              transition: 'background 0.1s',
            },
            onClick: () => toggle(item.value),
            onMouseenter: (e) => { if (!isSelected(item.value)) e.target.style.background = '#f1f5f9' },
            onMouseleave: (e) => { e.target.style.background = isSelected(item.value) ? '#ede9fe' : 'transparent' },
          }, [
            props.multiSelect ? h('span', {
              style: { marginRight: '8px', color: isSelected(item.value) ? '#6366f1' : '#cbd5e1' },
            }, isSelected(item.value) ? '☑' : '☐') : null,
            item.text,
          ].filter(Boolean))
        )) : null,
      ])
    }
  },
})
