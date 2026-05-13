import { h, ref, onMounted } from 'vue'
import { buildBadge, buildButton, buildCircularProgress, buildContentGrid, buildDivider, buildGrid, buildHeader, buildIcon, buildIconContainer, buildIconText, buildTable, buildText, buildStackedCardsList } from '../ui/index.js'

export function MonitoringPage(user) {
  return {
    name: 'MonitoringPage',
    setup() {
      const activityFeed = ref([])
      const maintenanceTasks = ref([])
      const inventory = ref([])

      const fetchData = async () => {
        try {
          const activityRes = await fetch('/api/activity/feed')
          activityFeed.value = await activityRes.json()

          const maintenanceRes = await fetch('/api/maintenance/tasks')
          maintenanceTasks.value = await maintenanceRes.json()

          const inventoryRes = await fetch('/api/assets/inventory')
          inventory.value = await inventoryRes.json()
        } catch (err) {
          console.error('Failed to fetch monitoring data:', err)
        }
      }

      onMounted(fetchData)

      return { activityFeed, maintenanceTasks, inventory }
    },
    render(Ruki) {
      return buildContentGrid({
        columns: 6, rows: 6, height: '100%', colGap: 12, rowGap: 12, padding: '24px', cellPadding: 0, display: false,
        fillViewport: true,
        span: { 1: { colSpan: 6, rowSpan: 2 }, 13: { colSpan: 2 }, 15: { colSpan: 2 }, 19: { colSpan: 2 }, 21: { colSpan: 4 }, 25: { colSpan: 4 }, 31: { colSpan: 2 }, 33: { colSpan: 4 } },
        align: { 13: 'center left', 15: 'center left', 18: 'center Right', 30: 'center Right'},
        child: {
          1: buildHeader({
            title: 'Central Monitoring Hub',
            titleOptions: { size: '4xl' },
            subtitle: 'A holistic archival view of system health, physical assets, and user engagement.',
            backgroundColor: 'transparent', divider: false, padding: '30px 24px 22px',
            style: { margin: '-24px 0 0 -24px', width: 'calc(100% + 48px)' },
          }),
          13: buildIconText('System Health', { icon: 'computer', iconSize: 30, iconColor: 'primary', textSize: '2xl', textWeight: 'bold', textColor: 'gray800', gap: '8px', style: { marginLeft: '10px' } }),
          15: buildIconText('User Activities', { icon: 'user-activities', iconSize: '30', iconColor: 'primary', textSize: '2xl', textWeight: 'bold', textColor: 'gray800', gap: '8px', style: { marginLeft: '10px' } }),
          18: buildButton('View Detailed Logs ->', { size: 'sm', weight: 'semibold', color: 'primary', onPressed: () => { if (globalThis.__appNavigate) globalThis.__appNavigate('/activity-logs') }, style: { marginRight: '10px' } }),
          19: buildGrid({
            columns: 8, rows: 5, display: true, padding: '16px 18px', rowGap: 8, colGap: 8, borderRadius: '14px', backgroundColor: '#ffffff',
            style: { height: '100%' },
            span: { 1: { colSpan: 6 }, 7: { colSpan: 2 }, 9: { colSpan: 8, rowSpan: 3 }, 17: { colSpan: 8 } },
            align: { 1: 'start left', 7: 'start right', 9: 'center', 17: 'center' },
            child: {
              1: h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } }, [
                buildText('Security Score', { size: 'lg', weight: 'bold', color: 'gray700', style: { margin: 0 } }),
                buildText('Current protective posture and threat detection status', { size: 'sm', color: 'gray500', style: { margin: 0 } }),
              ]),
              7: buildBadge('-//-', { color: 'neutral', size: 'lg', variant: 'solid', style: { marginRight: '4px' } }),
              9: buildText('-//-', { size: '4xl', weight: 'bold', color: 'gray800' }),
              17: buildText('-//-', { size: 'md', color: 'gray400', style: { marginTop: '10px' } }),
            },
          }),
          21: buildGrid({
            columns: 8, rows: 5, display: true, padding: '16px 18px', rowGap: 8, colGap: 8, borderRadius: '14px', backgroundColor: '#ffffff',
            style: { height: '100%' },
            span: { 1: { colSpan: 6 }, 7: { colSpan: 2 }, 9: { colSpan: 8, rowSpan: 4 } },
            align: { 1: 'start left', 7: 'start right', 9: 'start' },
            child: {
              1: h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } }, [
                buildText('Real-time Activity Feed', { size: 'lg', weight: 'bold', color: 'gray700', style: { margin: 0 } }),
                buildText('Latest events from authenticated users across all nodes', { size: 'sm', color: 'gray500', style: { margin: 0 } }),
              ]),
              9: Ruki.activityFeed.length > 0 ? buildStackedCardsList({
                data: Ruki.activityFeed,
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
                pagination: { maxRows: 4 },
                border: false
              }) : buildText('No activity recorded yet.', { size: 'sm', color: 'gray400', style: { textAlign: 'center', width: '100%', height: '100%', backgroundColor: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '270px' } }),
            },
          }),
          25: buildIconText('Assets Status', { icon: 'assets', iconSize: 30, iconColor: 'primary', textSize: '2xl', textWeight: 'bold', textColor: 'gray800', gap: '8px', style: { marginLeft: '10px', marginTop: '10px' } }),
          30: buildButton('+ Add Mentenance', { size: 'sm', weight: 'semibold', color: 'primary', onPressed: () => { if (globalThis.__appNavigate) globalThis.__appNavigate('/critical_maintenance') }, style: { marginRight: '10px' } }),
          31: buildGrid({
            columns: 2, rows: 4, display: true, padding: '16px', rowGap: 10, colGap: 10, borderRadius: '14px', backgroundColor: '#ffffff',
            style: { height: '100%' },
            span: { 1: { colSpan: 2 }, 3: { colSpan: 1 }, 4: { colSpan: 1 }, 5: { colSpan: 2 }, 7: { colSpan: 2 }, 9: { colSpan: 2 } },
            align: { 1: 'center left', 3: 'center', 4: 'center', 5: 'center', 7: 'center', 9: 'center' },
            child: {
              1: buildText('Inventory Summary', { size: '2xl', weight: 'bold', color: 'gray700' }),
              3: buildGrid({
                columns: 1, rows: 2, display: true, border: 'none', borderRadius: '10px', backgroundColor: '#eaf8f2', padding: '36px 10px', align: { 1: 'center', 2: 'center' },
                child: { 1: buildText(String(Ruki.inventory.length), { size: '4xl', weight: 'bold', color: '#047857' }), 2: buildText('ACTIVE ASSETS', { size: 'xs', weight: 'bold', color: '#059669', letterSpacing: '0.8px' }) },
              }),
              4: buildGrid({
                columns: 1, rows: 2, display: true, border: 'none', borderRadius: '10px', backgroundColor: '#fdf1f2', padding: '36px 10px', align: { 1: 'center', 2: 'center' },
                child: { 1: buildText(String(Ruki.inventory.filter(a => a.status === 'MAINTENANCE').length), { size: '4xl', weight: 'bold', color: '#b91c1c' }), 2: buildText('OFFLINE', { size: 'xs', weight: 'bold', color: '#ef4444', letterSpacing: '0.8px' }) },
              }),
              5: buildGrid({
                columns: 2, rows: 2, display: false, align: { 1: 'center left', 2: 'center right' },
                child: { 
                  1: buildText('Server Hardware', { size: 'lg', weight: 'semibold', color: 'gray500' }), 
                  2: buildText(`${Ruki.inventory.filter(a => a.category === 'Server').length} Nodes`, { size: 'lg', weight: 'bold', color: 'gray700', style: { marginTop: '10px' } }), 
                  3: buildDivider({ direction: 'h', color: '#10b981', thickness: '4px', margin: '2px 0 0 0' }) 
                },
              }),
              7: buildGrid({
                columns: 2, rows: 2, display: false, align: { 1: 'center left', 2: 'center right' },
                child: { 
                  1: buildText('Client Terminals', { size: 'lg', weight: 'semibold', color: 'gray500' }), 
                  2: buildText(`${Ruki.inventory.length > 0 ? (((Ruki.inventory.length - Ruki.inventory.filter(a => a.status === 'MAINTENANCE').length) / Ruki.inventory.length) * 100).toFixed(1) : 0}% Active`, { size: 'lg', weight: 'bold', color: 'gray700', style: { marginTop: '10px' } }), 
                  3: buildDivider({ direction: 'h', color: '#10b981', thickness: '4px', margin: '2px 0 0 0' }) 
                },
              }),
            },
          }),
          33: buildGrid({
            columns: 3, rows: 4, display: true, span: { 1: { colSpan: 3 }, 4: { colSpan: 3, rowSpan: 3 } }, align: { 1: 'center left', 4: 'center' },
            style: { height: '100%' },
            child: {
              1: buildGrid({
                columns: 2, rows: 1, display: false, align: { 1: 'center left', 2: 'center right' },
                child: {
                  1: buildText('Critical Maintenance', { size: '2xl', weight: 'bold', color: 'gray700' }),
                  2: buildText('ACTION REQUIRED', { size: 'xs', weight: 'bold', color: '#b91c1c', style: { backgroundColor: '#fee2e2', padding: '4px 10px', borderRadius: '4px', letterSpacing: '0.5px' } }),
                }
              }),
              4: Ruki.maintenanceTasks.length > 0 ? buildTable({
                width: '100%',
                columns: [
                  { header: 'ASSET ID', accessor: 'asset_id', render: (val) => buildText(String(val), { size: 'md', weight: 'bold', color: '#111827', style: { whiteSpace: 'nowrap' } }) },
                  { header: 'ISSUE', accessor: 'issue', render: (val) => buildText(String(val), { size: 'sm', weight: 'medium', color: '#4b5563', style: { whiteSpace: 'nowrap' } }) },
                  { 
                    header: 'PRIORITY', 
                    accessor: 'priority', 
                    align: 'center', 
                    render: (val) => {
                      const color = {
                        'critical': '#ef4444',
                        'high': '#d97706',
                        'medium': '#b45309'
                      }[(val || '').toLowerCase()] || '#6b7280';
                      return buildText(String(val).toUpperCase(), { size: 'xs', weight: 'bold', color, letterSpacing: '0.5px' });
                    }
                  },
                  { header: 'ACTION', accessor: 'action_text', align: 'center', render: (val) => buildText(String(val), { size: 'md', weight: 'bold', color: '#2563eb', style: { cursor: 'pointer', whiteSpace: 'nowrap' } }) },
                ],
                data: Ruki.maintenanceTasks,
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
