import { h, defineComponent, computed } from 'vue'
import { buildIcon } from './icon.js'

/**
 * buildReceiveCard(options) — stacked mail receipt cards
 *
 * Rules:
 *   - no mail   -> empty state visible
 *   - one mail  -> one card
 *   - second    -> inserted on top of the old mail
 *   - third+    -> inserted on top of the previous newest mail
 *
 * Options:
 *   mails        {Array}   Array of mail objects. Newest can be first or last; use `order`.
 *   order        {'newest-first'|'oldest-first'} Default: 'newest-first'
 *   titleKey     {string}  Property name for title text. Default: 'title'
 *   statusKey    {string}  Property name for status text. Default: 'status'
 *   metaKey      {string}  Property name for subtitle/meta text. Default: 'meta'
 *   emptyTitle   {string}  Empty state title. Default: 'No mail received'
 *   emptyBody    {string}  Empty state body. Default: 'Incoming messages will appear here.'
 *   blankEmpty   {boolean} Render a blank box instead of empty-state text. Default: true
 *   maxVisible   {number}  Maximum cards to render. Default: 3
 *   overlap      {number}  Vertical overlap between cards in px. Default: 10
 *   style        {object}
 */
export function buildReceiveCard(options = {}) {
  return h(_ReceiveCardComponent, options)
}

const _ReceiveCardComponent = defineComponent({
  name: 'ReceiveCard',
  props: {
    mails:       { default: () => [] },
    order:       { default: 'newest-first' },
    titleKey:    { default: 'title' },
    statusKey:   { default: 'status' },
    metaKey:     { default: 'meta' },
    emptyTitle:  { default: 'No mail received' },
    emptyBody:   { default: 'Incoming messages will appear here.' },
    blankEmpty:  { default: true },
    maxVisible:  { default: 3 },
    overlap:     { default: 10 },
    style:       { default: () => ({}) },
  },
  setup(props) {
    const visibleMails = computed(() => {
      const list = Array.isArray(props.mails) ? props.mails : []
      const ordered = props.order === 'oldest-first' ? [...list].reverse() : [...list]
      return ordered.slice(0, Math.max(1, Number(props.maxVisible) || 1))
    })

    return () => {
      if (!visibleMails.value.length) {
        return h('div', {
          style: {
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            minHeight: '120px',
            boxSizing: 'border-box',
            ...props.style,
          },
        }, props.blankEmpty
          ? []
          : [
              h('div', { style: { padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '6px', minHeight: '120px' } }, [
                h('div', { style: { fontSize: '15px', fontWeight: '700', color: '#334155' } }, props.emptyTitle),
                h('div', { style: { fontSize: '13px', color: '#64748b', textAlign: 'center' } }, props.emptyBody),
              ])
            ])
      }

      const stack = visibleMails.value.map((mail, idx) => {
        const zIndex = visibleMails.value.length - idx

        return h('div', {
          key: mail.id ?? idx,
          style: {
            position: 'relative',
            zIndex,
            marginTop: idx === 0 ? '0' : '-4px',
            background: '#ffffff',
            border: '1px solid #dde3ee',
            borderRadius: '18px',
            padding: '18px 20px',
            boxSizing: 'border-box',
            overflow: 'hidden',
          },
        }, [
          h('div', {
            style: {
              display: 'grid',
              gridTemplateColumns: '40px minmax(0, 1fr) 24px',
              gap: '14px',
              alignItems: 'center',
              minHeight: '58px',
            },
          }, [
            h('div', {
              style: {
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              },
            }, [buildIcon(mail?.icon ?? 'laptop', { size: 34, color: '#8a8400' })]),
            h('div', {
              style: {
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              },
            }, [
              h('div', {
                style: {
                  fontSize: '17px',
                  fontWeight: '700',
                  lineHeight: 1.15,
                  color: '#0f172a',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
              }, String(mail?.[props.titleKey] ?? mail?.subject ?? 'Untitled mail')),
              h('div', {
                style: {
                  fontSize: '13px',
                  fontWeight: '700',
                  lineHeight: 1.15,
                  color: '#9fb0cc',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
              }, String(mail?.[props.statusKey] ?? mail?.[props.metaKey] ?? '')),
            ]),
            h('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              },
            }, [buildIcon('chevron-right', { size: 24, color: '#d6deea' })]),
          ]),
        ])
      })

      return h('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: `${Math.max(0, (visibleMails.value.length - 1) * Number(props.overlap || 0))}px`,
          ...props.style,
        },
      }, stack)
    }
  },
})
