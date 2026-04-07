import { h, defineComponent, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { buildIcon } from './icon.js'

/**
 * buildDateBoxContainer(options) - Date input box with picker icon
 *
 * Options:
 *   placeHolder   {string}   Placeholder/label text
 *   color         {string}   Text color. Default: '#000000'
 *   colorCon      {string}   Container background. Default: '#ffffff'
 *   width         {string}   CSS width
 *   height        {string}   CSS height
 *   value         {Ref|string}
 *   onUpdate      {function} (value: string) => void
 *   onSubmitted   {function} (value: string) => void
 *   onPressed     {function} () => void
 *   margin        {string}   CSS margin
 *   padding       {string}   CSS padding. Default: '0 16px'
 *   borderRadius  {string}   Border radius. Default: '9px'
 *   border        {string}   CSS border shorthand
 *   textStyle     {object}   Extra text styles
 *   textInputAction {string} Input enter key hint (enter|done|next|search|go|send)
 *   enabled       {boolean}  Default: true
 *   insert        {boolean}  Allow manual typing. Default: true
 *   reqiured      {boolean}  Red border when empty. Default: false
 *   firstDate     {string|Date} min date (YYYY-MM-DD)
 *   lastDate      {string|Date} max date (YYYY-MM-DD)
 *   initialDate   {string|Date}
 *   style         {object}
 *   panelStyle    {object}   Calendar popup style override
 */
export function buildDateBoxContainer(options = {}) {
  return h(_DateBoxContainerComponent, options)
}

const _DateBoxContainerComponent = defineComponent({
  name: 'DateBoxContainer',
  props: {
    placeHolder:     { default: '' },
    color:           { default: '#000000' },
    colorCon:        { default: '#ffffff' },
    width:           { default: undefined },
    height:          { default: undefined },
    value:           { default: '' },
    onUpdate:        { default: null },
    onSubmitted:     { default: null },
    onPressed:       { default: null },
    margin:          { default: '0' },
    padding:         { default: '0 16px' },
    borderRadius:    { default: '9px' },
    border:          { default: undefined },
    textStyle:       { default: () => ({}) },
    textInputAction: { default: undefined },
    enabled:         { default: true },
    insert:          { default: true },
    reqiured:        { default: false },
    firstDate:       { default: undefined },
    lastDate:        { default: undefined },
    initialDate:     { default: undefined },
    style:           { default: () => ({}) },
    panelStyle:      { default: () => ({}) },
  },
  setup(props) {
    const containerRef = ref(null)
    const isOpen = ref(false)
    const internalVal = ref(typeof props.value === 'object' && props.value !== null && 'value' in props.value
      ? (props.value.value ?? '')
      : (props.value ?? ''))
    const viewMonth = ref(new Date())

    watch(() => (typeof props.value === 'object' && props.value !== null && 'value' in props.value)
      ? props.value.value
      : props.value, (v) => {
      if ((v ?? '') !== internalVal.value) internalVal.value = v ?? ''
    })

    function setVal(v) {
      internalVal.value = v ?? ''
      if (typeof props.value === 'object' && props.value !== null && 'value' in props.value) {
        props.value.value = internalVal.value
      }
      props.onUpdate?.(internalVal.value)
    }

    function parseDate(input) {
      if (!input) return null
      if (input instanceof Date && !Number.isNaN(input.getTime())) return new Date(input.getFullYear(), input.getMonth(), input.getDate())
      const raw = String(input).trim()
      if (!raw) return null
      const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
      if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
      const us = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
      if (us) return new Date(Number(us[3]), Number(us[1]) - 1, Number(us[2]))
      const d = new Date(raw)
      if (Number.isNaN(d.getTime())) return null
      return new Date(d.getFullYear(), d.getMonth(), d.getDate())
    }

    function formatDisplayDate(date) {
      const mm = String(date.getMonth() + 1).padStart(2, '0')
      const dd = String(date.getDate()).padStart(2, '0')
      const yyyy = String(date.getFullYear())
      return `${mm}/${dd}/${yyyy}`
    }

    function isSameDate(a, b) {
      return a && b &&
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    }

    function isOutOfRange(date) {
      const min = parseDate(props.firstDate)
      const max = parseDate(props.lastDate)
      if (min && date < min) return true
      if (max && date > max) return true
      return false
    }

    function openDatePicker() {
      if (!props.enabled) return
      const base = parseDate(internalVal.value) ?? parseDate(props.initialDate) ?? new Date()
      viewMonth.value = new Date(base.getFullYear(), base.getMonth(), 1)
      isOpen.value = true
    }

    function onOutsideClick(e) {
      if (containerRef.value && !containerRef.value.contains(e.target)) {
        isOpen.value = false
      }
    }

    onMounted(() => document.addEventListener('mousedown', onOutsideClick))
    onBeforeUnmount(() => document.removeEventListener('mousedown', onOutsideClick))

    return () => {
      const isEmpty = !String(internalVal.value ?? '').trim()
      const resolvedBorder = (props.reqiured && isEmpty)
        ? '1px solid #ef4444'
        : (props.border ?? '1px solid rgba(0,0,0,0.12)')
      const selectedDate = parseDate(internalVal.value)
      const monthStart = new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth(), 1)
      const firstWeekday = monthStart.getDay()
      const daysInMonth = new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth() + 1, 0).getDate()
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const weekLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
      const cells = []
      for (let i = 0; i < firstWeekday; i++) cells.push(null)
      for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth(), d))

      return h('div', {
        ref: containerRef,
        style: {
          position: 'relative',
          width: props.width,
          height: props.height,
          margin: props.margin,
          padding: props.padding,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxSizing: 'border-box',
          background: props.colorCon,
          border: resolvedBorder,
          borderRadius: props.borderRadius,
          ...props.style,
        },
        onClick: () => {
          if (!props.enabled) return
          props.onPressed?.()
          openDatePicker()
        },
      }, [
        h('input', {
          type: 'text',
          value: internalVal.value,
          placeholder: props.placeHolder,
          disabled: !props.enabled,
          readOnly: !props.insert,
          enterKeyHint: props.textInputAction,
          style: {
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            paddingRight: '28px',
            color: props.color,
            fontSize: '16px',
            fontFamily: 'inherit',
            ...props.textStyle,
          },
          onInput: (e) => setVal(e.target.value),
          onClick: (e) => {
            e.stopPropagation()
            props.onPressed?.()
            openDatePicker()
          },
          onKeydown: (e) => {
            if (e.key === 'Enter') props.onSubmitted?.(internalVal.value)
          },
        }),
        h('button', {
          type: 'button',
          disabled: !props.enabled,
          onClick: (e) => {
            e.stopPropagation()
            props.onPressed?.()
            openDatePicker()
          },
          style: {
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            border: 'none',
            background: 'transparent',
            padding: 0,
            margin: 0,
            lineHeight: 1,
            cursor: props.enabled ? 'pointer' : 'not-allowed',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'inherit',
          },
        }, [buildIcon('calendar', { size: 20, color: props.color })]),
        isOpen.value ? h('div', {
          style: {
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 9999,
            width: '260px',
            background: '#f7f8fc',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            padding: '10px',
            boxSizing: 'border-box',
            ...props.panelStyle,
          },
          onClick: (e) => e.stopPropagation(),
        }, [
          h('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
              color: '#1e293b',
            },
          }, [
            h('button', {
              type: 'button',
              style: { border: 'none', background: 'transparent', cursor: 'pointer', padding: '2px' },
              onClick: () => { viewMonth.value = new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth() - 1, 1) },
            }, [buildIcon('chevron-left', { size: 16, color: '#475569' })]),
            h('span', { style: { fontSize: '14px', fontWeight: '700' } }, `${monthNames[viewMonth.value.getMonth()]} ${viewMonth.value.getFullYear()}`),
            h('button', {
              type: 'button',
              style: { border: 'none', background: 'transparent', cursor: 'pointer', padding: '2px' },
              onClick: () => { viewMonth.value = new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth() + 1, 1) },
            }, [buildIcon('chevron-right', { size: 16, color: '#475569' })]),
          ]),
          h('div', {
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
              fontSize: '12px',
              color: '#64748b',
              marginBottom: '4px',
            },
          }, weekLabels.map(w => h('div', { style: { textAlign: 'center', fontWeight: '600', padding: '2px 0' } }, w))),
          h('div', {
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
            },
          }, cells.map((dateObj, i) => {
            if (!dateObj) return h('div', { key: `e-${i}` })
            const selected = isSameDate(dateObj, selectedDate)
            const disabled = isOutOfRange(dateObj)
            return h('button', {
              key: `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()}`,
              type: 'button',
              disabled,
              style: {
                border: 'none',
                borderRadius: '6px',
                height: '28px',
                background: selected ? '#dbeafe' : 'transparent',
                color: disabled ? '#cbd5e1' : '#1e293b',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: selected ? '700' : '500',
              },
              onClick: () => {
                if (disabled) return
                const formatted = formatDisplayDate(dateObj)
                setVal(formatted)
                props.onSubmitted?.(formatted)
                isOpen.value = false
              },
            }, String(dateObj.getDate()))
          })),
        ]) : null,
      ])
    }
  },
})
