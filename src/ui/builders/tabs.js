import { h, defineComponent, ref, computed } from 'vue'

/**
 * buildTabs(options) — Tab bar switcher with content area
 *
 * Options:
 *   tabs           {Array}   [{ id, name, content }]
 *                             content: VNode | () => VNode
 *   defaultTab     {string}  id of tab to show by default
 *   onSelect       {function} (tab) => void
 *   fontSize       {number}   Tab label font size. Default: 14
 *   bg             {string}   Tab bar background. Default: '#ebebf0'
 *   selectedBg     {string}   Selected tab background. Default: '#ffffff'
 *   selectedColor  {string}   Selected text color. Default: '#000000'
 *   unselectedColor{string}   Unselected text color. Default: '#666666'
 *   radius         {number}   Tab bar border-radius. Default: 20
 *   width          {string}   CSS width
 *   height         {string}   CSS height
 *   cardContent    {boolean}  Wrap content in a white card. Default: true
 *   style          {object}
 */
export function buildTabs(options = {}) {
  return h(_TabsComponent, options)
}

const _TabsComponent = defineComponent({
  name: 'Tabs',
  props: {
    tabs:           { default: () => [] },
    defaultTab:     { default: null },
    onSelect:       { default: null },
    fontSize:       { default: 14 },
    bg:             { default: '#ebebf0' },
    selectedBg:     { default: '#ffffff' },
    selectedColor:  { default: '#000000' },
    unselectedColor:{ default: '#666666' },
    radius:         { default: 20 },
    width:          { default: undefined },
    height:         { default: undefined },
    cardContent:    { default: true },
    style:          { default: () => ({}) },
  },
  setup(props) {
    const visibleTabs = computed(() => props.tabs.filter(t => t.display !== false))

    const defaultId = computed(() => {
      if (props.defaultTab) return props.defaultTab
      return visibleTabs.value.find(t => t.isDefault)?.id
          ?? visibleTabs.value[0]?.id
          ?? null
    })

    const selectedId = ref(defaultId.value)
    const hoveredId  = ref(null)

    const activeTab = computed(() =>
      visibleTabs.value.find(t => t.id === selectedId.value) ?? visibleTabs.value[0]
    )

    function select(tab) {
      selectedId.value = tab.id
      props.onSelect?.(tab)
    }

    function resolveContent(tab) {
      if (!tab) return null
      const c = tab.content
      return typeof c === 'function' ? c() : c
    }

    return () => {
      const innerRadius = Math.max(0, props.radius - 4)

      return h('div', {
        style: {
          display:       'flex',
          flexDirection: 'column',
          width:         props.width,
          height:        props.height,
          ...props.style,
        },
      }, [
        // ── Tab bar ──
        h('div', {
          style: {
            display:      'flex',
            background:   props.bg,
            borderRadius: `${props.radius}px`,
            padding:      '4px',
            gap:          '0',
            flexShrink:   0,
          },
          onMouseleave: () => { hoveredId.value = null },
        }, visibleTabs.value.map(tab => {
          const isSelected = tab.id === selectedId.value
          const isHovered  = hoveredId.value === tab.id

          return h('div', {
            key: tab.id,
            style: {
              flex:           1,
              textAlign:      'center',
              padding:        '8px 12px',
              borderRadius:   `${innerRadius}px`,
              fontSize:       `${props.fontSize}px`,
              fontWeight:     isSelected ? '600' : 'normal',
              color:          isSelected ? props.selectedColor : props.unselectedColor,
              background:     isSelected ? props.selectedBg
                            : isHovered  ? '#e4e7f0'
                            : 'transparent',
              cursor:         'pointer',
              userSelect:     'none',
              transition:     'all 0.18s ease',
              boxShadow:      isSelected ? '0 2px 4px rgba(0,0,0,0.10)' : 'none',
              boxSizing:      'border-box',
              whiteSpace:     'nowrap',
              overflow:       'hidden',
              textOverflow:   'ellipsis',
            },
            onClick:      () => select(tab),
            onMouseenter: () => { hoveredId.value = tab.id },
            onMouseleave: () => { if (hoveredId.value === tab.id) hoveredId.value = null },
          }, tab.name)
        })),

        // ── Spacer ──
        h('div', { style: { height: '24px', flexShrink: 0 } }),

        // ── Content ──
        h('div', {
          style: {
            flex:     props.height ? '1' : undefined,
            overflow: props.height ? 'auto' : undefined,
          },
        }, [
          props.cardContent
            ? h('div', {
                style: {
                  background:   '#ffffff',
                  borderRadius: '16px',
                  border:       '1px solid #e5e7ee',
                  boxShadow:    '0 4px 10px rgba(0,0,0,0.02)',
                  padding:      '16px',
                },
              }, [resolveContent(activeTab.value)])
            : resolveContent(activeTab.value),
        ]),
      ])
    }
  },
})
