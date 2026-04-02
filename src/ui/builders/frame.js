import { h } from 'vue'
import { token, spacing, colors, radius, shadow } from '../tokens.js'

/**
 * webFrame(options) — Layout container (flex or grid)
 *
 * Options:
 *   tag        {string}           HTML tag to use. Default: 'div'
 *   display    {true|false|'flex'|'grid'|'block'|'inline-flex'}
 *                true  → 'flex' (default)
 *                false → 'none' (hidden)
 *                'grid'→ CSS grid layout
 *   direction  {'row'|'col'}      Flex direction. Default: 'row'
 *   align      {[crossAxis, mainAxis] | string}
 *                cross-axis: 'start'|'center'|'end'|'stretch'
 *                main-axis:  'start'|'center'|'end'|'between'|'around'|'evenly'
 *   justify    {string}           Alias for align main-axis override
 *   cols       {number|string}    Grid template columns (e.g. 3 → 'repeat(3,1fr)')
 *   rows       {number|string}    Grid template rows
 *   span       {[colSpan, rowSpan]} Grid span for self
 *   gap        {string|number}    Gap between children (token key or px value)
 *   gapX       {string|number}    Column gap override
 *   gapY       {string|number}    Row gap override
 *   pad        {string|number}    Padding (token key or raw CSS value)
 *   margin     {string|number}    Margin
 *   width      {string}           CSS width
 *   height     {string}           CSS height
 *   minW       {string}           min-width
 *   minH       {string}           min-height
 *   maxW       {string}           max-width
 *   maxH       {string}           max-height
 *   fill       {boolean}          width: 100%
 *   grow       {boolean|number}   flex-grow
 *   shrink     {boolean|number}   flex-shrink
 *   wrap       {boolean}          flex-wrap
 *   bg         {string}           background color (token key or raw value)
 *   color      {string}           text color (token key or raw value)
 *   radius     {string}           border-radius (token key or raw value)
 *   shadow     {string}           box-shadow (token key or raw value)
 *   border     {string}           border CSS shorthand
 *   overflow   {string}           overflow value
 *   position   {string}           position value
 *   z          {number}           z-index
 *   cursor     {string}           cursor style
 *   style      {object}           extra raw CSS styles (merged last)
 *   class      {string|array}     CSS classes
 *   id         {string}           HTML id
 *   child      {object}           Named/ordered children: { 1: vnode, 2: vnode }
 *   children   {array}            Additional children array (appended after child)
 *   onClick    {function}         Click handler
 *   onHover    {function}         Mouseenter handler (alias)
 *   attrs      {object}           Extra HTML attributes
 */
export function webFrame(options = {}) {
  const {
    tag = 'div',
    display = true,
    direction = 'row',
    align,
    justify,
    cols,
    rows,
    span,
    gap,
    gapX,
    gapY,
    pad,
    margin,
    width,
    height,
    minW,
    minH,
    maxW,
    maxH,
    fill,
    grow,
    shrink,
    wrap,
    bg,
    color,
    radius: radiusProp,
    shadow: shadowProp,
    border,
    overflow,
    position,
    z,
    cursor,
    style = {},
    class: className,
    id,
    child = {},
    children = [],
    onClick,
    onHover,
    attrs = {},
  } = options

  // Resolve display shorthand
  const resolvedDisplay = display === true  ? 'flex'
                        : display === false ? 'none'
                        : display

  // Resolve align shorthand
  const [crossAxis, mainAxis] = Array.isArray(align)
    ? align
    : align
    ? [align, align]
    : [undefined, undefined]

  const alignMap = { start: 'flex-start', end: 'flex-end', between: 'space-between', around: 'space-around', evenly: 'space-evenly' }
  const resolveAlign = (v) => v ? (alignMap[v] ?? v) : undefined

  // Grid cols shorthand
  const gridCols = cols
    ? typeof cols === 'number' ? `repeat(${cols}, 1fr)` : cols
    : undefined

  const gridRows = rows
    ? typeof rows === 'number' ? `repeat(${rows}, 1fr)` : rows
    : undefined

  const computedStyle = {
    display: resolvedDisplay,
    flexDirection: resolvedDisplay === 'flex' || resolvedDisplay === 'inline-flex'
      ? direction === 'col' ? 'column' : 'row'
      : undefined,
    alignItems:     resolveAlign(crossAxis),
    justifyContent: resolveAlign(justify ?? mainAxis),
    flexWrap:       wrap ? 'wrap' : undefined,
    flexGrow:       grow === true ? 1 : grow !== undefined ? grow : undefined,
    flexShrink:     shrink === true ? 1 : shrink !== undefined ? shrink : undefined,
    gridTemplateColumns: gridCols,
    gridTemplateRows:    gridRows,
    gridColumn:  span ? `span ${Array.isArray(span) ? span[0] : span}` : undefined,
    gridRow:     span && Array.isArray(span) && span[1] ? `span ${span[1]}` : undefined,
    gap:         token(spacing, gap),
    columnGap:   token(spacing, gapX),
    rowGap:      token(spacing, gapY),
    padding:     token(spacing, pad),
    margin:      token(spacing, margin),
    width:       fill ? '100%' : width,
    height,
    minWidth:    minW,
    minHeight:   minH,
    maxWidth:    maxW,
    maxHeight:   maxH,
    background:  token(colors, bg),
    color:       token(colors, color),
    borderRadius: token(radius, radiusProp),
    boxShadow:   token(shadow, shadowProp),
    border,
    overflow,
    position,
    zIndex:      z,
    cursor,
    ...style,
  }

  // Strip undefined keys
  Object.keys(computedStyle).forEach(k => computedStyle[k] === undefined && delete computedStyle[k])

  const childNodes = [
    ...Object.values(child),
    ...children,
  ]

  return h(
    tag,
    {
      style: computedStyle,
      class: className,
      id,
      onClick,
      onMouseenter: onHover,
      ...attrs,
    },
    childNodes,
  )
}
