import { buildButton } from './button.js'
import { buildDivider } from './divider.js'
import { buildGrid } from './grid.js'
import { buildIconTextContainer } from './iconTextContainer.js'
import { buildText } from './text.js'
import { colors, token } from '../ThemesColors.js'

function normalizeTextAlign(value) {
  if (typeof value !== 'string') return value
  const lower = value.trim().toLowerCase()
  if (lower.includes('left')) return 'left'
  if (lower.includes('right')) return 'right'
  if (lower.includes('center')) return 'center'
  if (lower.includes('justify')) return 'justify'
  return value
}

/**
 * buildHeader(options) - Reusable page header section
 *
 * Defaults to a white surface to match a standard page header.
 *
 * Options:
 *   title            {string}
 *   subtitle         {string}
 *   leftNode         {VNode}
 *   rightNode        {VNode}
 *   actionText       {string}
 *   actionColor      {string}
 *   actionVariant    {'solid'|'outline'|'ghost'|'link'}
 *   actionIcon       {VNode}
 *   onAction         {function}
 *   statusText       {string}
 *   statusIcon       {string}
 *   statusColor      {string}
 *   statusBg         {string}
 *   backgroundColor  {string}
 *   display          {true|false|'grid'}
 *   divider          {boolean}
 *   dividerColor     {string}
 *   gridProps        {object}   Extra buildGrid options for outer header container
 *   rowProps         {object}   Extra buildGrid options for title row container
 *   titleGridProps   {object}   Extra buildGrid options for title/subtitle block
 *   titleStyle       {object}
 *   subtitleStyle    {object}
 *   style            {object}
 */
export function buildHeader(options = {}) {
  const {
    title = '',
    subtitle = '',
    leftNode,
    rightNode,

    actionText,
    actionColor = 'primary',
    actionVariant = 'solid',
    actionIcon,
    actionStyle = {},
    onAction,

    statusText,
    statusIcon = 'circle',
    statusColor = 'success',
    statusBg = 'gray200',
    statusWidth = '195px',
    statusOptions = {},

    backgroundColor = 'white',
    display = false,
    divider = true,
    dividerColor = 'gray200',
    padding = '22px 24px 10px',
    dividerMargin = '10px 0 0 0',
    gridProps = {},
    rowProps = {},
    titleGridProps = {},
    style = {},
    titleStyle = {},
    subtitleStyle = {},

    titleOptions = {},
    subtitleOptions = {},
  } = options
  const normalizedTitleOptions = {
    ...titleOptions,
    align: normalizeTextAlign(titleOptions.align),
  }
  const normalizedSubtitleOptions = {
    ...subtitleOptions,
    align: normalizeTextAlign(subtitleOptions.align),
  }

  const resolvedRightNode = rightNode
    ?? (actionText
      ? buildButton(actionText, {
          size: 'sm',
          color: actionColor,
          variant: actionVariant,
          icon: actionIcon,
          onPressed: onAction,
          style: {
            minWidth: '140px',
            height: '38px',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '14px',
            boxShadow: 'none',
            ...actionStyle,
          },
        })
      : statusText
        ? buildIconTextContainer(statusText, {
            icon: statusIcon,
            iconColor: token(colors, statusColor),
            bgColor: token(colors, statusBg),
            width: statusWidth,
            textSize: '10px',
            textWeight: 'bold',
            padding: '8px 12px',
            ...statusOptions,
          })
        : null)

  const hasRightSide = !!resolvedRightNode
  const hasLeftSide = !!leftNode
  const defaultInnerColumns = hasLeftSide ? (hasRightSide ? 3 : 2) : hasRightSide ? 2 : 1
  const leftSlot = hasLeftSide ? 1 : undefined
  const contentSlot = hasLeftSide ? 2 : 1
  const rightSlot = hasLeftSide && hasRightSide ? 3 : hasRightSide ? 2 : undefined
  const defaultInnerSpan = {}
  const defaultRowStyle = hasLeftSide
    ? { gridTemplateColumns: hasRightSide ? 'auto 1fr auto' : 'auto 1fr' }
    : {}

  const rowAlign = {}
  if (hasLeftSide) rowAlign[leftSlot] = 'center left'
  rowAlign[contentSlot] = 'center left'
  if (hasRightSide) rowAlign[rightSlot] = 'center right'

  const rowChild = {}
  if (hasLeftSide) rowChild[leftSlot] = leftNode
  rowChild[contentSlot] = buildGrid({
    columns: titleGridProps.columns ?? 1,
    rows: titleGridProps.rows ?? (subtitle ? 2 : 1),
    display: titleGridProps.display ?? false,
    span: titleGridProps.span,
    align: titleGridProps.align,
    rowGap: titleGridProps.rowGap,
    colGap: titleGridProps.colGap,
    padding: titleGridProps.padding,
    cellPadding: titleGridProps.cellPadding,
    style: titleGridProps.style,
    child: {
      1: buildText(title, {
        tag: 'div',
        size: '4xl',
        weight: 'bold',
        color: 'gray800',
        lineHeight: '1.1',
        margin: '0',
        ...normalizedTitleOptions,
        style: {
          ...(normalizedTitleOptions.style ?? {}),
          ...titleStyle,
        },
      }),
      2: subtitle
        ? buildText(subtitle, {
            tag: 'div',
            size: 'sm',
            color: 'gray500',
            lineHeight: '1.3',
            margin: '0',
            ...normalizedSubtitleOptions,
            style: {
              ...(normalizedSubtitleOptions.style ?? {}),
              ...subtitleStyle,
            },
          })
        : null,
    },
  })
  if (hasRightSide) rowChild[rightSlot] = resolvedRightNode

  return buildGrid({
    columns: gridProps.columns ?? 1,
    rows: gridProps.rows ?? (divider ? 2 : 1),
    display: gridProps.display ?? display,
    rowGap: gridProps.rowGap ?? 0,
    colGap: gridProps.colGap,
    padding: gridProps.padding ?? padding,
    cellPadding: gridProps.cellPadding,
    span: gridProps.span,
    align: gridProps.align,
    child: {
      1: buildGrid({
        columns: rowProps.columns ?? defaultInnerColumns,
        rows: rowProps.rows ?? 1,
        display: rowProps.display ?? false,
        span: rowProps.span ?? defaultInnerSpan,
        align: { ...rowAlign, ...(rowProps.align ?? {}) },
        rowGap: rowProps.rowGap,
        colGap: rowProps.colGap,
        padding: rowProps.padding,
        cellPadding: rowProps.cellPadding,
        style: { ...defaultRowStyle, ...(rowProps.style ?? {}) },
        child: rowChild,
      }),
      2: divider
        ? buildDivider({
            direction: 'h',
            color: dividerColor,
            thickness: '1px',
            margin: dividerMargin,
          })
        : null,
    },
    style: {
      ...(gridProps.style ?? {}),
      background: token(colors, backgroundColor),
      ...style,
    },
  })
}
