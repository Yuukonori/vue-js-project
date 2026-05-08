import { h, ref, onMounted } from 'vue'
import { buildBadge, buildButton, buildContentGrid, buildGrid, buildHeader, buildIcon, buildIconText, buildProgressBar, buildTable, buildText, buildTextBadge, buildStackedCardsList } from '../ui/index.js'

export function RepairHistoryPage(user) {
  return {
    name: 'RepairHistoryPage',
    setup() {
      const ongoingRepairs = ref([])
      const serviceHistory = ref([])
      const problemFrequency = ref([])

      const fetchData = async () => {
        try {
          const ongoingRes = await fetch('/api/repair/ongoing')
          ongoingRepairs.value = await ongoingRes.json()

          const historyRes = await fetch('/api/assets/history')
          serviceHistory.value = await historyRes.json()

          const frequencyRes = await fetch('/api/problem-frequency')
          problemFrequency.value = await frequencyRes.json()
        } catch (err) {
          console.error('Failed to fetch repair history:', err)
        }
      }

      onMounted(fetchData)

      return { ongoingRepairs, serviceHistory, problemFrequency }
    },
    render(Ruki) {
      return buildContentGrid({
        columns: 4, rows: 6, colGap: 12, rowGap: 12, padding: '24px', cellPadding: 0, display: false,
        fillViewport: true,
        span: { 1: { colSpan: 4, rowSpan: 2 }, 9: { colSpan: 2, rowSpan: 2 }, 11: { colSpan: 2, rowSpan: 2 }, 17: { colSpan: 3 }, 21: { colSpan: 4 } },
        align: { 17: 'center Left' },
        child: {
          1: buildHeader({
            title: 'Repair & Maintenance History',
            subtitle: 'Deep diagnostics and technical log archival for enterprise assets.',
            titleOptions: { size: '4xl' },
            backgroundColor: 'white', divider: false, padding: '30px 24px 22px',
            style: { margin: '-24px 0 0 -24px', width: 'calc(100% + 48px)' },
          }),
          9: buildGrid({
            columns: 6, rows: 4, display: true, backgroundColor: '#ffffffff', padding: '24px', borderRadius: '16px', border: '1px solid #eef2f6',
            span: { 1: { colSpan: 4 }, 5: { colSpan: 2 }, 7: { colSpan: 6, rowSpan: 10 } },
            align: { 1: 'center left', 5: 'center right' },
            style: { height: '100%' },
            child: {
              1: buildIconText('Ongoing Repairs', { icon: 'clipboard', iconSize: 26, iconColor: '#2563eb', textSize: '22px', textWeight: 'bold', textColor: '#1e293b', gap: '10px' }),
              5: buildBadge(`${Ruki.ongoingRepairs.length} ACTIVE TICKETS`, { variant: 'soft', color: 'neutral', size: 'lg', radius: 'full', style: { padding: '6px 16px', fontWeight: '700' } }),
              7: Ruki.ongoingRepairs.length > 0 ? buildStackedCardsList({
                data: Ruki.ongoingRepairs,
                border: false,
                columns: [
                  { key: 'icon', accessor: 'severity', render: (val) => buildIcon('circle', { size: 22, color: (val || '').includes('CRITICAL') ? '#dc2626' : '#d97706' }) },
                  { key: 'title', accessor: 'name' },
                  { key: 'description', accessor: 'description' },
                  {
                    key: 'footer', render: (_, row) => [
                      buildBadge(row.severity, { color: (row.severity || '').includes('CRITICAL') ? 'error' : 'warning', variant: 'soft', size: 'sm' }),
                      buildIconText(row.elapsed, { icon: 'clock', iconSize: 14, iconColor: 'gray500', textSize: 'xs', textColor: 'gray500', gap: '4px' })
                    ]
                  },
                  { key: 'rightNode', accessor: 'action_label', render: (val) => buildButton(val, { variant: 'solid', color: 'primary', size: 'md', style: { minWidth: '120px', color: 'white', fontWeight: '700', borderRadius: '8px' } }) }
                ],
              }) : buildText('No ongoing repairs at this time.', { size: 'sm', color: 'gray400', style: { textAlign: 'center', width: '100%', height: '100%', backgroundColor: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '260px' } }),
              11: buildButton('Show More', { color: 'primary', size: 'md', hover: true }),
            }
          }),
          11: buildGrid({
            columns: 1, rows: 2, display: true, padding: '24px', borderRadius: '16px', border: '1px solid #eef2f6', backgroundColor: 'white', style: { height: '100%' },
            child: {
              1: buildText('Problem Frequency', { variant: 'h4', color: '#475569', weight: 'bold' }),
              2: Ruki.problemFrequency.length > 0 ? buildText('Chart Data Here', { size: 'sm', color: 'gray500' }) : buildText('No Problem Frequency available.', { size: 'sm', color: 'gray400', style: { textAlign: 'center', width: '100%', padding: '40px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' } }),
            }
          }),
          17: buildText('SERVICE HISTORY & FAILURE MONITORING', { variant: 'h4', color: '#475569', weight: 'bold', style: { marginLeft: '5px' } }),
          21: Ruki.serviceHistory.length > 0 ? buildTable({
            columns: [
              { header: 'ASSET ID', accessor: 'asset_id', render: (val, row) => buildGrid({ columns: 1, rows: 2, display: false, rowGap: 2, child: { 1: buildText(val, { tag: 'div', size: 'xl', weight: 'bold', color: 'gray800' }), 2: buildText(row.asset_name, { tag: 'div', size: 'sm', color: 'gray500' }) } }) },
              { header: 'FAILURE FREQUENCY', accessor: 'failure_frequency', align: 'center', render: (val) => buildText(val, { tag: 'div', size: 'sm', color: 'gray500', weight: 'semibold' }) },
              { header: 'LAST SERVICE', accessor: 'last_service', render: (val) => val ? new Date(val).toLocaleDateString() : '' },
              { header: 'CONDITION', accessor: 'condition', align: 'center', render: (val) => buildTextBadge(val, { colorText: (val || '').includes('Degrading') ? '#7a7600' : (val || '').includes('Unstable') ? '#dc2626' : '#0e8004', colorCon: '#f8fafc', size: 14, bold: true, padding: '4px 10px', radius: '8px' }) },
              { header: 'STATUS', accessor: 'status_icon', align: 'center', render: (val) => buildIcon(val === 'error' ? 'circle-x' : val === 'warning' ? 'warning' : 'circle-check', { size: 16, color: val === 'error' ? '#c81e1e' : val === 'warning' ? '#7a7600' : '#0e8004' }) },
            ],
            data: Ruki.serviceHistory,
            pagination: { maxRows: 3, align: 'center' },
            style: { backgroundColor: 'white', borderRadius: '14px' },
          }) : buildGrid({
            columns: 1,
            rows: 1,
            display: true,
            backgroundColor: 'white',
            borderRadius: '14px',
            border: '1px solid #e5e7ee',
            child: {
              1: buildText('No service history records available.', { size: 'md', color: 'gray400', style: { padding: '80px 0', textAlign: 'center', width: '100%' } })
            }
          })
        },
      })
    }
  }
}
