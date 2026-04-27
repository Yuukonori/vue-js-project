import { h, defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'

/**
 * buildSearch(options) — Search input with optional autocomplete
 *
 * Options:
 *   placeholder  {string}    Placeholder text
 *   value        {Ref|string} Reactive value or string
 *   onUpdate     {function}  (value: string) => void
 *   onSelect     {function}  (value: string) => void  — called when suggestion selected
 *   suggestions  {string[]}  Autocomplete list. Default: []
 *   clearable    {boolean}   Show clear button. Default: false
 *   disabled     {boolean}
 *   width        {string}    CSS width
 *   height       {string}    CSS height. Default: '44px'
 *   bg           {string}    Background. Default: '#ffffff'
 *   radius       {string}    Border radius. Default: '12px'
 *   style        {object}
 */
export function buildSearch(options = {}) {
  return h(_SearchComponent, options)
}

const _SearchComponent = defineComponent({
  name: 'Search',
  props: {
    placeholder: { default: 'Search...' },
    value:       { default: '' },
    onUpdate:    { default: null },
    onSelect:    { default: null },
    suggestions: { default: () => [] },
    clearable:   { default: false },
    disabled:    { default: false },
    width:       { default: undefined },
    height:      { default: '44px' },
    bg:          { default: '#ffffff' },
    radius:      { default: '12px' },
    style:       { default: () => ({}) },
  },
  setup(props) {
    const isFocused = ref(false)
    const container = ref(null)

    const internalVal = ref(
      typeof props.value === 'object' ? props.value.value : (props.value ?? '')
    )

    function getRawVal() {
      return typeof props.value === 'object' ? props.value.value : props.value
    }

    function setVal(v) {
      internalVal.value = v
      if (typeof props.value === 'object') props.value.value = v
      props.onUpdate?.(v)
    }

    const matches = computed(() => {
      if (!props.suggestions.length || !internalVal.value.trim()) return []
      const q = internalVal.value.toLowerCase()
      return props.suggestions.filter(s => s.toLowerCase().includes(q)).slice(0, 8)
    })

    const showDropdown = computed(() => isFocused.value && matches.value.length > 0)

    function selectSuggestion(s) {
      setVal(s)
      isFocused.value = false
      props.onSelect?.(s)
    }

    function onOutside(e) {
      if (container.value && !container.value.contains(e.target)) {
        isFocused.value = false
      }
    }

    onMounted(() => document.addEventListener('mousedown', onOutside))
    onBeforeUnmount(() => document.removeEventListener('mousedown', onOutside))

    return () => h('div', {
      ref: container,
      style: { position: 'relative', width: props.width, display: 'inline-block', ...props.style },
    }, [
      // Input row
      h('div', {
        style: {
          display:      'flex',
          alignItems:   'center',
          height:       props.height,
          padding:      '0 14px',
          gap:          '10px',
          background:   props.disabled ? '#f8fafc' : props.bg,
          border:       `1.5px solid ${isFocused.value ? '#6366f1' : '#e2e8f0'}`,
          borderRadius: showDropdown.value
            ? `${props.radius} ${props.radius} 0 0`
            : props.radius,
          cursor:       props.disabled ? 'not-allowed' : 'text',
          boxSizing:    'border-box',
          transition:   'border-color 0.15s',
        },
      }, [
        // Search icon
        h('svg', {
          width: 16, height: 16, viewBox: '0 0 24 24',
          fill: 'none', stroke: '#94a3b8', 'stroke-width': 2, 'stroke-linecap': 'round',
          style: { flexShrink: 0 },
        }, [
          h('circle', { cx: 11, cy: 11, r: 8 }),
          h('path', { d: 'M21 21l-4.35-4.35' }),
        ]),

        h('input', {
          value:       internalVal.value,
          placeholder: props.placeholder,
          disabled:    props.disabled,
          style: {
            flex:       1,
            border:     'none',
            outline:    'none',
            background: 'transparent',
            fontSize:   '15px',
            color:      '#1e293b',
            fontFamily: 'inherit',
            cursor:     props.disabled ? 'not-allowed' : 'text',
          },
          onFocus:  () => { isFocused.value = true },
          onBlur:   () => { /* handled by outside click */ },
          onInput:  (e) => setVal(e.target.value),
        }),

        // Clear button
        (props.clearable && internalVal.value)
          ? h('span', {
              style: { color: '#94a3b8', fontSize: '18px', cursor: 'pointer', lineHeight: 1, flexShrink: 0 },
              onMousedown: (e) => { e.preventDefault(); setVal('') },
            }, '×')
          : null,
      ].filter(Boolean)),

      // Suggestions dropdown
      showDropdown.value ? h('div', {
        style: {
          position:     'absolute',
          top:          '100%',
          left:         0,
          right:        0,
          background:   props.bg,
          border:       '1.5px solid #6366f1',
          borderTop:    'none',
          borderRadius: `0 0 ${props.radius} ${props.radius}`,
          boxShadow:    '0 8px 24px rgba(0,0,0,0.08)',
          zIndex:       9999,
          maxHeight:    '220px',
          overflowY:    'auto',
        },
      }, matches.value.map((s, i) =>
        h('div', {
          key: i,
          style: { padding: '10px 14px', fontSize: '15px', color: '#1e293b', cursor: 'pointer' },
          onMousedown: (e) => { e.preventDefault(); selectSuggestion(s) },
          onMouseenter: (e) => { e.target.style.background = '#f1f5f9' },
          onMouseleave: (e) => { e.target.style.background = 'transparent' },
        }, s)
      )) : null,
    ])
  },
})
