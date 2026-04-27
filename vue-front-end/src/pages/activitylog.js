import { h, ref, onMounted } from 'vue'
import { buildDateBoxContainer, buildButton, buildContentGrid, buildDropdown, buildGrid, buildHeader, buildIcon, buildTable, buildText, buildTextBadge } from '../ui/index.js'

export function ActivityLogsPage(user) {
  return {
    name: 'ActivityLogsPage',
    setup() {
      const auditLogs = ref([])
      const selectedActivityType = ref(null)
      const selectedSeverity = ref('mid')
      const startDate = ref('')
      const endDate = ref('')

      const fetchData = async () => {
        try {
          const res = await fetch('/api/logs/audit')
          auditLogs.value = await res.json()
        } catch (err) {
          console.error('Failed to fetch audit logs:', err)
        }
      }

      onMounted(fetchData)

      return { auditLogs, selectedActivityType, selectedSeverity, startDate, endDate }
    },
    render(ctx) {
      return buildContentGrid({
        columns: 6, rows: 5, height: '100%', colGap: 12, rowGap: 12, padding: '24px', cellPadding: 0, display: false,
        span: { 1: { colSpan: 6, rowSpan: 2 }, 13: { colSpan: 2, rowSpan: 2 }, 15: { colSpan: 2, rowSpan: 2 }, 17: { colSpan: 2, rowSpan: 2 }, 25: { colSpan: 6 } },
        child: {
          1: buildHeader({
            title: 'System Audit',
            subtitle: 'A Detail ledger of all administrative actions and automated system event accross the infrastructure.',
            actionText: 'Export Report', actionIcon: buildIcon('download', { size: 14, color: '#ffffff' }),
            backgroundColor: 'white', divider: false, padding: '30px 24px 22px',
            style: { margin: '-24px 0 0 -24px', width: 'calc(100% + 48px)' },
          }),
          13: buildGrid({
            height: '100%', columns: 7, rows: 2, display: true, align: { 11: 'center', 6: 'center Right' },
            span: { 1: { colSpan: 5 }, 6: { colSpan: 2 }, 8: { colSpan: 3 }, 12: { colSpan: 3 } },
            child: {
              1: buildText('DATE RANGE SELECTION', { size: 'md', weight: 'bold', color: 'gray700', style: { marginLeft: '5px' } }),
              8: buildDateBoxContainer({ placeHolder: 'mm/dd/yyyy', value: ctx.startDate, width: '100%', height: '40px', color: '#6b7280', colorCon: '#ffffff', padding: '0 12px', borderRadius: '12px', border: '1px solid #e5e7eb', insert: true, style: { boxSizing: 'border-box', marginTop: '5px' } }),
              11: buildText('TO', { size: 'md', weight: 'bold', color: 'gray400' }),
              12: buildDateBoxContainer({ placeHolder: 'mm/dd/yyyy', value: ctx.endDate, width: '100%', height: '40px', color: '#6b7280', colorCon: '#ffffff', padding: '0 12px', borderRadius: '12px', border: '1px solid #e5e7eb', insert: true, style: { boxSizing: 'border-box', marginTop: '5px' } }),
              6: buildTextBadge('Clear', { variant: 'link', color: 'primary', size: 'sm', onPressed: () => { ctx.startDate = ''; ctx.endDate = '' }, style: { marginTop: '5px', fontWeight: '700' } }),
            }
          }),
          15: buildGrid({
            height: '100%', columns: 1, rows: 2, display: true, rowGap: 6, align: { 1: 'end left', 2: 'start left' },
            child: {
              1: buildText('ACTIVITY TYPE', { size: 'md', weight: 'bold', color: 'gray700', style: { marginLeft: '5px' } }),
              2: buildDropdown({ placeholder: 'All Activities', showClearButton: true, items: [{ text: 'Login', value: 'login' }, { text: 'Update', value: 'update' }], value: ctx.selectedActivityType, onUpdate: (v) => ctx.selectedActivityType = v, width: '100%', height: '40px' }),
            }
          }),
          17: buildGrid({
            height: '100%', columns: 3, rows: 2, display: true, rowGap: 8, colGap: 8, span: { 1: { colSpan: 2 } }, align: { 1: 'end left', 3: 'center Right', 4: 'start center', 5: 'start center', 6: 'start center' },
            child: {
              1: buildText('SEVERITY LEVEL', { size: 'md', weight: 'bold', color: 'gray700', style: { marginLeft: '5px' } }),
              3: buildTextBadge('Clear', { variant: 'link', color: 'primary', size: 'sm', onPressed: () => ctx.selectedSeverity = '', style: { marginTop: '5px', fontWeight: '700' } }),
              4: buildButton('Low', { size: 'sm', color: 'neutral', style: { width: '100%', height: '36px', borderRadius: '8px', backgroundColor: ctx.selectedSeverity === 'low' ? '#e8eff7' : '#ffffff', color: '#3b82f6', border: 'none', fontWeight: '700' }, onPressed: () => ctx.selectedSeverity = 'low' }),
              5: buildButton('Mid', { size: 'sm', color: 'warning', style: { width: '100%', height: '36px', borderRadius: '8px', backgroundColor: ctx.selectedSeverity === 'mid' ? '#fef3c7' : '#ffffff', border: 'none', color: '#6b5b00', fontWeight: '700' }, onPressed: () => ctx.selectedSeverity = 'mid' }),
              6: buildButton('Critical', { size: 'sm', color: 'error', style: { width: '100%', height: '36px', borderRadius: '8px', backgroundColor: ctx.selectedSeverity === 'critical' ? '#f6d5d5' : '#ffffff', color: '#dc2626', border: 'none', fontWeight: '700' }, onPressed: () => ctx.selectedSeverity = 'critical' }),
            }
          }),
          25: ctx.auditLogs.length > 0 ? buildTable({
            columns: [
              { header: 'TIMESTAMP', accessor: 'timestamp', flex: 2, render: (val) => buildGrid({ columns: 1, rows: 2, display: false, child: { 1: buildText(val ? new Date(val).toLocaleDateString() : '', { size: 'sm', weight: 'bold', color: 'primary' }), 2: buildText(val ? new Date(val).toLocaleTimeString() : '', { size: 'xs', color: 'gray400' }) } }) },
              { header: 'USER / IDENTITY', accessor: 'user_identity', flex: 3, render: (val) => buildText(String(val), { size: 'sm', weight: 'bold', color: 'gray700' }) },
              { header: 'EVENT DESCRIPTION', accessor: 'description', flex: 5, render: (val) => buildText(String(val), { size: 'sm', color: 'gray600', weight: 'semibold', lineHeight: '1.35', style: { whiteSpace: 'normal' } }) },
              { header: 'IP ADDRESS', accessor: 'ip_address', flex: 2, render: (val) => buildText(String(val), { size: 'xs', color: 'gray400', weight: 'bold' }) },
              { header: 'STATUS', accessor: 'status', flex: 2, align: 'center', render: (val) => buildText(String(val), { size: 'xs', weight: 'bold', color: (val || '').includes('Success') ? '#2563eb' : '#ffffff', style: { display: 'inline-block', padding: '4px 12px', borderRadius: '999px', background: (val || '').includes('Success') ? '#dbeafe' : '#dc2626' } }) },
            ],
            data: ctx.auditLogs,
            style: { borderRadius: '14px', border: 'none' },
          }) : buildText('No audit logs found for the selected criteria.', { size: 'lg', color: 'gray400', style: { padding: '80px 0', textAlign: 'center', backgroundColor: 'white', borderRadius: '14px' } })
        }
      })
    }
  }
}
