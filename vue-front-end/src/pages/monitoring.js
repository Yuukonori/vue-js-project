import { h, ref, onMounted } from 'vue'
import { buildButton, buildCircularProgress, buildContentGrid, buildDivider, buildGrid, buildHeader, buildIcon, buildIconContainer, buildIconText, buildTable, buildText, buildStackedCardsList } from '../ui/index.js'

export function MonitoringPage(user) {
  return {
    name: 'MonitoringPage',
    setup() {
      const activityFeed = ref([])
      const maintenanceTasks = ref([])

      const fetchData = async () => {
        try {
          const activityRes = await fetch('/api/activity/feed')
          activityFeed.value = await activityRes.json()

          const maintenanceRes = await fetch('/api/maintenance/tasks')
          maintenanceTasks.value = await maintenanceRes.json()
        } catch (err) {
          console.error('Failed to fetch monitoring data:', err)
        }
      }

      onMounted(fetchData)

      return { activityFeed, maintenanceTasks }
    },
    render(ctx) {
      return buildContentGrid({
        columns: 6, rows: 6, height: '100%', colGap: 12, rowGap: 12, padding: '24px', cellPadding: 0, display: false,
        span: { 1: { colSpan: 6, rowSpan: 2 }, 13: { colSpan: 2 }, 15: { colSpan: 4 }, 19: { colSpan: 2 }, 21: { colSpan: 4 }, 25: { colSpan: 6 }, 31: { colSpan: 2 }, 33: { colSpan: 4 } },
        align: { 13: 'center left' },
        child: {
          1: buildHeader({
            title: 'Central Monitoring Hub',
            subtitle: 'A holistic archival view of system health, physical assets, and user engagement.',
            backgroundColor: 'white', divider: false, padding: '30px 24px 22px',
            style: { margin: '-24px 0 0 -24px', width: 'calc(100% + 48px)' },
          }),
          13: buildIconText('System Health', { icon: 'computer', iconSize: 30, iconColor: 'primary', textSize: '2xl', textWeight: 'bold', textColor: 'gray800', gap: '8px', style: { marginLeft: '10px' } }),
          15: buildIconText('User Activities', { icon: 'user-activities', iconSize: '30', iconColor: 'primary', textSize: '2xl', textWeight: 'bold', textColor: 'gray800', gap: '8px', style: { marginLeft: '10px' } }),
          19: buildGrid({
            columns: 6, rows: 5, rowGap: '15', display: true, padding: '14px 16px', backgroundColor: '#ffffff', borderRadius: '14px',
            style: { height: '100%' },
            span: { 1: { colSpan: 5 }, 6: { colSpan: 1 }, 7: { colSpan: 6, rowSpan: 3 }, 25: { colSpan: 6 } },
            align: { 1: 'center left', 6: 'center right', 7: 'center', 25: 'center' },
            child: {
              1: buildText('Security Score', { size: 'lg', weight: 'bold', color: 'gray700', style: { marginTop: '10px' } }),
              6: buildIcon('shield', { size: 24, color: '#8a7a0a', style: { marginRight: '10px' } }),
              7: buildCircularProgress({ value: 88, max: 100, size: 220, strokeWidth: 9, color: '#1f5fc8', trackColor: '#e5edf7', textColor: '#1f2937', hover: true, animation: true }),
              25: buildText('/ 100', { size: 'md', color: 'gray400' }),
            },
          }),
          21: buildGrid({
            columns: 8, rows: 5, display: true, padding: '16px 18px', rowGap: 8, colGap: 8, borderRadius: '14px', backgroundColor: '#ffffff',
            style: { height: '100%' },
            span: { 1: { colSpan: 6 }, 7: { colSpan: 2 }, 9: { colSpan: 8 }, 17: { colSpan: 8, rowSpan: 8 } },
            align: { 1: 'center left', 7: 'center right', 9: 'start left', 17: 'start' },
            child: {
              1: buildText('Real-time Activity Feed', { size: 'lg', weight: 'bold', color: 'gray700' }),
              7: buildButton('View Detailed Logs ->', { size: 'sm', weight: 'semibold', color: 'primary', onPressed: () => { if (globalThis.__appNavigate) globalThis.__appNavigate('/activity-logs') } }),
              9: buildText('Latest events from authenticated users across all nodes', { size: 'sm', color: 'gray500' }),
              17: ctx.activityFeed.length > 0 ? buildStackedCardsList({
                data: ctx.activityFeed,
                columns: [
                  {
                    key: 'icon', accessor: 'type', render: (val) => {
                      const configs = { login: { icon: 'logout', color: '#2563eb', bg: '#dbeafe' }, update: { icon: 'refresh', color: '#b45309', bg: '#fef3c7' }, logout: { icon: 'logout', color: '#475569', bg: '#e2e8f0' } }
                      const conf = configs[val] || configs.logout
                      return buildIconContainer({ icon: conf.icon, colorIcon: conf.color, colorCon: conf.bg, size: 38, radius: '10px' })
                    }
                  },
                  { key: 'title', accessor: 'title' },
                  { key: 'description', accessor: 'description' },
                  { key: 'rightNode', accessor: 'time_label', render: (val) => buildText(val, { size: 'xs', weight: 'bold', color: 'gray400' }) }
                ],
              }) : buildText('No activity recorded yet.', { size: 'sm', color: 'gray400', style: { textAlign: 'center', width: '100%', height: '100%', backgroundColor: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '270px' } }),
            },
          }),
          25: buildIconText('Assets Status', { icon: 'assets', iconSize: 30, iconColor: 'primary', textSize: '2xl', textWeight: 'bold', textColor: 'gray800', gap: '8px', style: { marginLeft: '10px', marginTop: '10px' } }),
          31: buildGrid({
            columns: 2, rows: 4, display: true, padding: '16px', rowGap: 10, colGap: 10, borderRadius: '14px', backgroundColor: '#ffffff',
            style: { height: '100%' },
            span: { 1: { colSpan: 2 }, 3: { colSpan: 1 }, 4: { colSpan: 1 }, 5: { colSpan: 2 }, 7: { colSpan: 2 }, 9: { colSpan: 2 } },
            align: { 1: 'center left', 3: 'center', 4: 'center', 5: 'center', 7: 'center', 9: 'center' },
            child: {
              1: buildText('Inventory Summary', { size: '2xl', weight: 'bold', color: 'gray700' }),
              3: buildGrid({
                columns: 1, rows: 2, display: true, border: 'none', borderRadius: '10px', backgroundColor: '#eaf8f2', padding: '36px 10px', align: { 1: 'center', 2: 'center' },
                child: { 1: buildText('1,248', { size: '4xl', weight: 'bold', color: '#047857' }), 2: buildText('ACTIVE ASSETS', { size: 'xs', weight: 'bold', color: '#059669', letterSpacing: '0.8px' }) },
              }),
              4: buildGrid({
                columns: 1, rows: 2, display: true, border: 'none', borderRadius: '10px', backgroundColor: '#fdf1f2', padding: '36px 10px', align: { 1: 'center', 2: 'center' },
                child: { 1: buildText('12', { size: '4xl', weight: 'bold', color: '#b91c1c' }), 2: buildText('OFFLINE', { size: 'xs', weight: 'bold', color: '#ef4444', letterSpacing: '0.8px' }) },
              }),
              5: buildGrid({
                columns: 2, rows: 2, display: false, align: { 1: 'center left', 2: 'center right' },
                child: { 1: buildText('Server Hardware', { size: 'lg', weight: 'semibold', color: 'gray500' }), 2: buildText('42 Nodes', { size: 'lg', weight: 'bold', color: 'gray700', style: { marginTop: '10px' } }), 3: buildDivider({ direction: 'h', color: '#10b981', thickness: '4px', margin: '2px 0 0 0' }) },
              }),
              7: buildGrid({
                columns: 2, rows: 2, display: false, align: { 1: 'center left', 2: 'center right' },
                child: { 1: buildText('Client Terminals', { size: 'lg', weight: 'semibold', color: 'gray500' }), 2: buildText('98.2% Active', { size: 'lg', weight: 'bold', color: 'gray700', style: { marginTop: '10px' } }), 3: buildDivider({ direction: 'h', color: '#10b981', thickness: '4px', margin: '2px 0 0 0' }) },
              }),
            },
          }),
          33: buildGrid({
            columns: 3, rows: 4, display: true, span: { 1: { colSpan: 3 }, 4: { colSpan: 3, rowSpan: 3 } }, align: { 1: 'center left', 4: 'center' },
            style: { height: '100%' },
            child: {
              1: buildText('Critical Maintenance', { size: '2xl', weight: 'bold', color: 'gray700' }),
              4: ctx.maintenanceTasks.length > 0 ? buildTable({
                width: '100%',
                columns: [
                  { header: 'ASSET ID', accessor: 'asset_id', render: (val) => buildText(String(val), { size: 'sm', weight: 'bold', color: 'gray700', style: { whiteSpace: 'nowrap' } }) },
                  { header: 'ISSUE', accessor: 'issue', render: (val) => buildText(String(val), { size: 'sm', weight: 'semibold', color: 'gray500', style: { whiteSpace: 'nowrap' } }) },
                  { header: 'PRIORITY', accessor: 'priority', align: 'center', render: (val) => buildText(String(val).toUpperCase(), { size: 'sm', weight: 'bold', color: (val || '').toLowerCase().includes('critical') ? '#ef4444' : '#f59e0b', letterSpacing: '0.4px' }) },
                  { header: 'ACTION', accessor: 'action_text', align: 'center', render: (val) => buildText(String(val), { size: 'sm', weight: 'bold', color: '#2563eb', style: { cursor: 'pointer', whiteSpace: 'nowrap' } }) },
                ],
                data: ctx.maintenanceTasks,
                style: { borderRadius: '12px', border: '1px solid #e5e7eb' },
                pagination: { maxRows: 3 }
              }) : buildText('No critical maintenance required.', { size: 'md', color: 'gray400', style: { textAlign: 'center', width: '100%', height: '100%', backgroundColor: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' } }),
            }
          })
        },
      })
    }
  }
}
