import { h, defineComponent, computed } from 'vue'

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
 *   bodyKey      {string}  Property name for body text. Default: 'body'
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
    bodyKey:     { default: 'body' },
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
        const topOffset = idx * Number(props.overlap || 0)
        const zIndex = visibleMails.value.length - idx

        return h('div', {
          key: mail.id ?? idx,
          style: {
            position: idx === 0 ? 'relative' : 'relative',
            zIndex,
            marginTop: idx === 0 ? '0' : `-${Number(props.overlap || 0)}px`,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 8px 20px rgba(15, 23, 42, 0.08)',
            transform: idx === 0 ? 'none' : `translateY(${topOffset}px)`,
            boxSizing: 'border-box',
            overflow: 'hidden',
          },
        }, [
          h('div', { style: { display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' } }, [
            h('div', { style: { minWidth: 0, flex: 1 } }, [
              h('div', { style: { fontSize: '16px', fontWeight: '700', color: '#0f172a' } }, String(mail?.[props.titleKey] ?? mail?.subject ?? 'Untitled mail')),
              mail?.[props.metaKey] || mail?.from || mail?.date
                ? h('div', { style: { marginTop: '4px', fontSize: '12px', fontWeight: '600', color: '#94a3b8' } },
                    String(mail?.[props.metaKey] ?? mail?.from ?? mail?.date))
                : null,
            ].filter(Boolean)),
            h('div', { style: { fontSize: '12px', fontWeight: '700', color: '#64748b', flexShrink: 0 } }, `#${visibleMails.value.length - idx}`),
          ]),
          h('div', { style: { marginTop: '10px', fontSize: '13px', lineHeight: 1.5, color: '#334155' } },
            String(mail?.[props.bodyKey] ?? mail?.message ?? ''))
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
