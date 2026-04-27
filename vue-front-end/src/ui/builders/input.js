import { h } from 'vue'
import { token, colors, spacing, radius, fontSize } from '../ThemesColors.js'
import { buildText } from './text.js'
import { buildIcon } from './icon.js'

/**
 * buildInput(options) — Text input / textarea / select builder
 *
 * Options:
 *   type       {'text'|'password'|'email'|'number'|'textarea'|'select'}  Default: 'text'
 *   label      {string}
 *   placeholder {string}
 *   value      {string|ref}    modelValue for v-model binding
 *   onUpdate   {function}      Called with new value (replaces v-model)
 *   hint       {string}        Helper text below input
 *   error      {string}        Error message (replaces hint, styles in red)
 *   prefix     {VNode|string}  Left adornment
 *   suffix     {VNode|string}  Right adornment
 *   iconLeft   {string}        Icon name (left)
 *   iconRight  {string}        Icon name (right)
 *   size       {'sm'|'md'|'lg'}  Default: 'md'
 *   radius     {string}
 *   width      {string}        Explicit width (overrides full)
 *   height     {string}        Explicit height of the input field (overrides size preset)
 *   full       {boolean}       width: 100%
 *   disabled   {boolean}
 *   readonly   {boolean}
 *   rows       {number}        Textarea rows. Default: 4
 *   options    {array}         Select options: [{label, value}] or ['value']
 *   style      {object}
 *   class      {string}
 */

const sizeMap = {
  sm: { pad: '6px 10px', font: 'sm', height: '32px' },
  md: { pad: '9px 12px', font: 'base', height: '40px' },
  lg: { pad: '12px 16px', font: 'lg', height: '48px' },
}

export function buildInput(options = {}) {
  const {
    type        = 'text',
    label,
    placeholder,
    value,
    onUpdate,
    hint,
    error,
    prefix,
    suffix,
    iconLeft,
    iconRight,
    size        = 'md',
    radius: r   = 'md',
    width,
    height,
    full,
    disabled,
    readonly,
    rows        = 4,
    options: selectOptions = [],
    style       = {},
    class: className,
    attrs       = {},
  } = options

  const sz = sizeMap[size] ?? sizeMap.md
  const hasError = !!error
  const borderColor = hasError ? '#ef4444' : '#cbd5e1'

  const baseInputStyle = {
    width:       full ? '100%' : undefined,
    flex:        '1',
    height:      type === 'textarea' ? undefined : sz.height,
    padding:     sz.pad,
    paddingLeft: iconLeft  ? '36px' : undefined,
    paddingRight: iconRight ? '36px' : undefined,
    fontSize:    token(fontSize, sz.font),
    fontFamily:  'inherit',
    color:       '#1e293b',
    background:  disabled ? '#f1f5f9' : '#ffffff',
    border:      `1.5px solid ${borderColor}`,
    borderRadius: token(radius, r),
    outline:     'none',
    cursor:      disabled ? 'not-allowed' : 'text',
    resize:      type === 'textarea' ? 'vertical' : undefined,
    transition:  'border-color 0.15s',
    ...style,
  }

  // Build the actual input/textarea/select element
  let inputEl
  if (type === 'textarea') {
    inputEl = h('textarea', {
      placeholder,
      value: value?.value ?? value,
      rows,
      disabled,
      readonly,
      style: { ...baseInputStyle, height: undefined, minHeight: `${rows * 24}px` },
      onInput: (e) => onUpdate?.(e.target.value),
      ...attrs,
    })
  } else if (type === 'select') {
    inputEl = h('select', {
      value: value?.value ?? value,
      disabled,
      style: { ...baseInputStyle, appearance: 'none', cursor: disabled ? 'not-allowed' : 'pointer' },
      onChange: (e) => onUpdate?.(e.target.value),
      ...attrs,
    }, selectOptions.map(opt => {
      const optVal   = typeof opt === 'object' ? opt.value : opt
      const optLabel = typeof opt === 'object' ? opt.label : opt
      return h('option', { value: optVal }, optLabel)
    }))
  } else {
    inputEl = h('input', {
      type,
      placeholder,
      value: value?.value ?? value,
      disabled,
      readonly,
      style: baseInputStyle,
      onInput: (e) => onUpdate?.(e.target.value),
      ...attrs,
    })
  }

  // Wrap with icons/prefix/suffix
  const wrapperStyle = {
    position: 'relative',
    display:  'flex',
    alignItems: 'center',
    width:    full ? '100%' : undefined,
  }

  const iconStyle = (side) => ({
    position: 'absolute',
    [side]: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    color: '#94a3b8',
    display: 'flex',
  })

  const inputWrapped = h('div', { style: wrapperStyle }, [
    iconLeft  ? h('span', { style: iconStyle('left') },  [buildIcon(iconLeft,  { size: 16 })]) : null,
    prefix    ? h('span', { style: { padding: '0 8px', color: '#64748b', fontSize: token(fontSize, sz.font), whiteSpace: 'nowrap' } }, [prefix]) : null,
    inputEl,
    suffix    ? h('span', { style: { padding: '0 8px', color: '#64748b', fontSize: token(fontSize, sz.font), whiteSpace: 'nowrap' } }, [suffix]) : null,
    iconRight ? h('span', { style: iconStyle('right') }, [buildIcon(iconRight, { size: 16 })]) : null,
  ].filter(Boolean))

  // Full field with label + input + hint/error
  return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px', width: full ? '100%' : undefined }, class: className }, [
    label ? buildText(label, { variant: 'label', size: 'sm', weight: 'medium', color: 'gray700' }) : null,
    inputWrapped,
    (hint || error)
      ? buildText(error ?? hint, { variant: 'caption', color: hasError ? 'error' : 'gray500' })
      : null,
  ].filter(Boolean))
}
