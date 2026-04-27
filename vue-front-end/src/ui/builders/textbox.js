import { h, defineComponent, ref, watch } from 'vue'

/**
 * buildTextbox(options) — Text input with floating label
 *
 * Options:
 *   placeholder  {string}    Floating label / placeholder text
 *   value        {Ref|string} Reactive value or string
 *   onUpdate     {function}  (value: string) => void
 *   type         {string}    Input type: 'text'|'password'|'email'|'number'. Default: 'text'
 *   multiline    {boolean}   Render as textarea. Default: false
 *   rows         {number}    Textarea rows. Default: 3
 *   width        {string}    CSS width
 *   height       {string}    CSS height
 *   disabled     {boolean}
 *   readonly     {boolean}
 *   required     {boolean}   Show red border when empty
 *   radius       {string}    Border radius. Default: '9px'
 *   bg           {string}    Background color. Default: '#ffffff'
 *   color        {string}    Text color. Default: '#1e293b'
 *   style        {object}
 */
export function buildTextbox(options = {}) {
  return h(_TextboxComponent, options)
}

const _TextboxComponent = defineComponent({
  name: 'Textbox',
  props: {
    placeholder: { default: '' },
    value:       { default: '' },
    onUpdate:    { default: null },
    type:        { default: 'text' },
    multiline:   { default: false },
    rows:        { default: 3 },
    width:       { default: undefined },
    height:      { default: undefined },
    disabled:    { default: false },
    readonly:    { default: false },
    required:    { default: false },
    radius:      { default: '9px' },
    bg:          { default: '#ffffff' },
    color:       { default: '#1e293b' },
    style:       { default: () => ({}) },
  },
  setup(props) {
    const isFocused  = ref(false)
    const internalVal = ref(typeof props.value === 'object' ? props.value.value : (props.value ?? ''))

    // sync when prop.value changes (supports both Ref and plain string)
    watch(() => typeof props.value === 'object' ? props.value.value : props.value, (v) => {
      if (v !== internalVal.value) internalVal.value = v ?? ''
    })

    const isEmpty    = () => !internalVal.value
    const isFloating = () => isFocused.value || !isEmpty()

    function borderColor() {
      if (props.required && isEmpty()) return '#ef4444'
      if (isFocused.value) return '#6366f1'
      return '#e2e8f0'
    }

    return () => {
      const inputProps = {
        value:    internalVal.value,
        disabled: props.disabled,
        readOnly: props.readonly,
        type:     props.multiline ? undefined : props.type,
        rows:     props.multiline ? props.rows : undefined,
        style: {
          width:      '100%',
          border:     'none',
          outline:    'none',
          background: 'transparent',
          fontSize:   '15px',
          color:      props.disabled ? '#94a3b8' : props.color,
          padding:    '0',
          paddingTop: '18px',
          resize:     props.multiline ? 'vertical' : 'none',
          fontFamily: 'inherit',
          lineHeight: '1.5',
          cursor:     props.disabled ? 'not-allowed' : 'text',
        },
        onFocus:  () => { isFocused.value = true },
        onBlur:   () => { isFocused.value = false },
        onInput:  (e) => {
          internalVal.value = e.target.value
          props.onUpdate?.(e.target.value)
          if (typeof props.value === 'object') props.value.value = e.target.value
        },
      }

      return h('div', {
        style: {
          position:     'relative',
          width:        props.width,
          height:       props.height,
          background:   props.disabled ? '#f8fafc' : props.bg,
          border:       `1.5px solid ${borderColor()}`,
          borderRadius: props.radius,
          padding:      '8px 14px 8px',
          boxSizing:    'border-box',
          transition:   'border-color 0.15s',
          ...props.style,
        },
      }, [
        // Floating label
        h('label', {
          style: {
            position:   'absolute',
            left:       '14px',
            top:        isFloating() ? '6px' : '50%',
            transform:  isFloating() ? 'none' : 'translateY(-50%)',
            fontSize:   isFloating() ? '11px' : '15px',
            color:      isFocused.value ? '#6366f1' : '#94a3b8',
            transition: 'all 0.15s ease',
            pointerEvents: 'none',
            lineHeight: 1,
            userSelect: 'none',
          },
        }, props.placeholder),
        // Input or textarea
        props.multiline
          ? h('textarea', inputProps)
          : h('input', inputProps),
      ])
    }
  },
})
