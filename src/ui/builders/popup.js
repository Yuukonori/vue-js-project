import { h, defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * buildPopup(options) - Compact action popup menu
 *
 * Options:
 *   triggerText  {string}   Trigger label. Default: '⋮'
 *   items        {Array}    [{ text, value }]
 *   onSelect     {function} (value) => void
 *   width        {string}   Trigger width. Default: '28px'
 *   height       {string}   Trigger height. Default: '28px'
 *   menuWidth    {string}   Menu width. Default: '120px'
 *   align        {'left'|'right'} Menu horizontal align. Default: 'right'
 *   radius       {string}   Trigger border radius. Default: '8px'
 *   style        {object}
 */
export function buildPopup(options = {}) {
  return h(_PopupComponent, options)
}

const _PopupComponent = defineComponent({
  name: 'Popup',
  props: {
    triggerText: { default: '⋮' },
    items:       { default: () => [] },
    onSelect:    { default: null },
    width:       { default: '28px' },
    height:      { default: '28px' },
    menuWidth:   { default: '120px' },
    align:       { default: 'right' },
    radius:      { default: '8px' },
    style:       { default: () => ({}) },
  },
  setup(props) {
    const isOpen = ref(false)
    const root = ref(null)

    function onOutsideClick(e) {
      if (root.value && !root.value.contains(e.target)) isOpen.value = false
    }

    onMounted(() => document.addEventListener('mousedown', onOutsideClick))
    onBeforeUnmount(() => document.removeEventListener('mousedown', onOutsideClick))

    return () => h('div', {
      ref: root,
      style: {
        position: 'relative',
        display: 'inline-block',
        ...props.style,
      },
    }, [
      h('button', {
        style: {
          width: props.width,
          height: props.height,
          border: 'none',
          borderRadius: props.radius,
          background: 'transparent',
          color: '#94a3b8',
          fontSize: '18px',
          fontWeight: '700',
          lineHeight: 1,
          cursor: 'pointer',
          padding: 0,
        },
        onClick: () => { isOpen.value = !isOpen.value },
      }, props.triggerText),
      isOpen.value ? h('div', {
        style: {
          position: 'absolute',
          top: 'calc(100% + 4px)',
          right: props.align === 'right' ? '0' : undefined,
          left: props.align === 'left' ? '0' : undefined,
          width: props.menuWidth,
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          boxShadow: '0 8px 20px rgba(15, 23, 42, 0.10)',
          overflow: 'hidden',
          zIndex: 10000,
        },
      }, props.items.map((item, idx) =>
        h('button', {
          key: idx,
          style: {
            width: '100%',
            border: 'none',
            background: 'transparent',
            textAlign: 'left',
            padding: '8px 10px',
            color: '#334155',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
          },
          onClick: () => {
            isOpen.value = false
            props.onSelect?.(item.value)
          },
          onMouseenter: (e) => { e.currentTarget.style.background = '#f8fafc' },
          onMouseleave: (e) => { e.currentTarget.style.background = 'transparent' },
        }, item.text),
      )) : null,
    ])
  },
})

