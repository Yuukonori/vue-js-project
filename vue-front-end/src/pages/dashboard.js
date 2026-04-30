import { h, ref, onMounted } from 'vue'
import { buildHeader, buildBadge, buildButton, buildContentGrid, buildGrid, buildIcon, buildTable, buildText, buildStackedCardsList, colors } from '../ui/index.js'

const dashboardColors = {
    headingText: 'gray800',
    subText: 'gray500',
    bodyText: 'gray600',
    strongHeading: 'gray900',
    metaText: 'gray400',
    healthyState: 'success',
    warningState: 'warning',
    criticalState: 'error',
    neutralState: 'neutral',
    actionColor: 'primary',
    cardBackground: colors.gray100,
    borderSoft: 'gray200',
    iconMuted: 'gray300',
}

export function DashboardPage(user) {
    return {
        name: 'DashboardPage',
        setup() {
            const repairTickets = ref([])
            const expiringAssets = ref([])

            const fetchData = async () => {
                try {
                    const ticketsRes = await fetch('/api/repair/tickets')
                    repairTickets.value = await ticketsRes.json()

                    const assetsRes = await fetch('/api/assets/expiring')
                    expiringAssets.value = await assetsRes.json()
                } catch (err) {
                    console.error('Failed to fetch dashboard data:', err)
                }
            }

            onMounted(fetchData)

            return {
                repairTickets,
                expiringAssets
            }
        },
        render(Ruki) {
            function onShowNetworkMap() {
                if (typeof globalThis.__appNavigate === 'function') {
                    globalThis.__appNavigate('/monitoring')
                    return
                }
            }

            return buildContentGrid({
                columns: 4, rows: 4, colGap: 12, rowGap: 12, display: false,
                fillViewport: true,
                span: { 1: { colSpan: 4, rowSpan: 2 }, 9: { colSpan: 3, rowSpan: 1 }, 12: { rowSpan: 2 }, 13: { colSpan: 3, rowSpan: 1 }, 17: { colSpan: 4 } },
                padding: '16px', cellPadding: 0, mobileConfig: { columns: 1, rows: 3 }, tabletConfig: { columns: 2, rows: 3 },
                align: { 12: 'center' },
                child: {
                    1: buildHeader({
                        title: 'Dashboard',
                        titleOptions: { size: '2xl' },
                        subtitle: `Welcome back, ${user.name}!`,
                        statusText: 'ALL SYSTEM OPERATIONAL',
                        statusIcon: 'circle',
                        statusColor: dashboardColors.healthyState,
                        statusBg: 'gray200', statusWidth: '195px', backgroundColor: 'white', divider: false, padding: '16px 24px 12px',
                        style: { margin: '-16px 0 0 -16px', width: 'calc(100% + 32px)' },
                    }),
                    9: buildGrid({
                        columns: 3, rows: 2, padding: '20px', rowGap: '30', display: true,
                        align: { 3: 'center right' },
                        span: { 1: { colSpan: 2, rowSpan: 1 }, 7: { colSpan: 3, rowSpan: 1 } },
                        child: {
                            1: buildText('System Health', { variant: 'h3', weight: 'bold', color: dashboardColors.headingText, style: { marginTop: '10px' } }),
                            3: buildButton('VIEW NETWORK MAP', { variant: 'link', color: dashboardColors.actionColor, size: 'md', onPressed: onShowNetworkMap, style: { fontWeight: '700', textDecoration: 'none', letterSpacing: '0.2px' } }),
                            4: buildGrid({
                                columns: 3, rows: 3, background: dashboardColors.cardBackground, hover: true, rowGap: 4, display: true, onPressed: onShowNetworkMap,
                                span: { 4: { colSpan: 2, rowSpan: 1 } },
                                align: { 1: 'center Left', 3: 'center right', 4: 'end Left', 7: 'center left' },
                                child: {
                                    1: buildIcon('server', { size: 75, color: dashboardColors.actionColor, style: { marginRight: '5px' } }),
                                    3: buildBadge('99.99%', { color: dashboardColors.healthyState, size: 'lg', variant: 'solid', style: { marginRight: '10px' } }),
                                    4: buildText('Server Uptime', { tag: 'div', size: '16px', color: dashboardColors.bodyText, style: { marginTop: '10px', marginLeft: '5px' } }),
                                    7: buildText('42 Nodes', { tag: 'div', size: '20px', weight: 'bold', color: dashboardColors.bodyText, style: { marginTop: '6px', marginLeft: '5px' } })
                                }
                            }),
                            5: buildGrid({
                                columns: 3, rows: 3, background: dashboardColors.cardBackground, hover: true, rowGap: 4, display: true, onPressed: onShowNetworkMap,
                                span: { 4: { colSpan: 2, rowSpan: 1 }, 7: { colSpan: 2, rowSpan: 1 } },
                                align: { 1: 'center Left', 3: 'center Right', 4: 'end Left', 7: 'center left' },
                                child: {
                                    1: buildIcon('gauge', { size: 75, color: dashboardColors.warningState, style: { marginRight: '5px' } }),
                                    3: buildBadge('STABLE', { color: dashboardColors.neutralState, size: 'lg', variant: 'solid', style: { marginRight: '10px' } }),
                                    4: buildText('Network Latency', { tag: 'div', size: '16px', color: dashboardColors.bodyText, style: { marginTop: '10px', marginLeft: '5px' } }),
                                    7: buildText('14ms', { tag: 'div', size: '24px', weight: 'bold', color: dashboardColors.bodyText, style: { marginTop: '6px', marginLeft: '5px' } })
                                }
                            }),
                            6: buildGrid({
                                columns: 3, rows: 3, background: dashboardColors.cardBackground, hover: true, rowGap: 4, display: true, onPressed: onShowNetworkMap,
                                span: { 4: { colSpan: 2, rowSpan: 1 }, 7: { colSpan: 2, rowSpan: 1 } },
                                align: { 1: 'center Left', 3: 'center Right', 4: 'end Left', 7: 'center left' },
                                child: {
                                    1: buildIcon('shield', { size: 75, color: dashboardColors.criticalState, style: { marginRight: '5px' } }),
                                    3: buildBadge('2 ALERTS', { color: dashboardColors.criticalState, size: 'lg', variant: 'solid', style: { marginRight: '10px' } }),
                                    4: buildText('Security Score', { tag: 'div', size: '16px', color: dashboardColors.bodyText, style: { marginTop: '10px', marginLeft: '5px' } }),
                                    7: buildText('88 / 100', { tag: 'div', size: '24px', weight: 'bold', color: dashboardColors.bodyText, style: { marginTop: '6px', marginLeft: '5px' } })
                                }
                            }),
                        }
                    }),
                    13: buildGrid({
                        columns: 3, rows: 2, padding: '20px', rowGap: '30', display: true,
                        align: { 1: 'center left' },
                        span: { 1: { colSpan: 2, rowSpan: 1 }, 4: { colSpan: 3, rowSpan: 1 } },
                        child: {
                            1: buildText('Recent Repair Tickets', { variant: 'h3', weight: 'bold', color: dashboardColors.headingText }),
                            4: Ruki.repairTickets.length > 0 ? buildTable({
                                columns: [
                                    { header: 'Ticket ID', accessor: 'ticket_id', render: (val) => buildText(String(val || ''), { tag: 'span', color: dashboardColors.actionColor, weight: 'semibold' }) },
                                    { header: 'Subject', accessor: 'subject' },
                                    { header: 'Status', accessor: 'status', align: 'center', render: (val) => buildBadge(String(val || '').toUpperCase(), { color: (val || '').toLowerCase().includes('urgent') ? 'error' : (val || '').toLowerCase().includes('resolved') ? 'success' : 'info', variant: 'soft', size: 'lg', radius: 'full' }) },
                                    { header: 'Updated', accessor: 'updated_at', align: 'center', render: (val) => val ? new Date(val).toLocaleDateString() : '' }
                                ],
                                data: Ruki.repairTickets,
                                rowHover: true,
                            }) : buildText('No recent tickets found.', { size: 'md', color: 'gray400', style: { textAlign: 'center', width: '100%', height: '100%', backgroundColor: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' } })
                        },
                    }),
                    12: buildGrid({
                        columns: 6, rows: 12, height: '100%', rowGap: '20', padding: '20px', display: true,
                        span: { 2: { colSpan: 4 }, 7: { colSpan: 6, rowSpan: 10 }, 67: { colSpan: 6 } },
                        align: { 1: 'center', 2: 'center left', 7: 'start', 67: 'center' },
                        child: {
                            1: buildIcon('calendar-x', { size: 40, color: dashboardColors.warningState }),
                            2: buildText('Expiring Assets', { variant: 'h3', weight: 'bold', color: dashboardColors.strongHeading }),
                            7: Ruki.expiringAssets.length > 0 ? buildStackedCardsList({
                                data: Ruki.expiringAssets,
                                columns: [
                                    { key: 'icon', accessor: 'type', render: (val) => buildIcon(val, { size: 32, color: dashboardColors.warningState }) },
                                    { key: 'title', accessor: 'name' },
                                    { key: 'subtitle', accessor: 'expiry_label' },
                                ],
                            }) : buildText('All assets are up to date.', { size: 'sm', color: 'gray400', style: { textAlign: 'center', width: '100%', height: '100%', backgroundColor: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' } }),
                            67: buildButton('FULL EXPIRATION LOG', { variant: 'link', color: dashboardColors.actionColor, size: 'md', style: { fontWeight: '700', textDecoration: 'none', letterSpacing: '0.2px' } }),
                        }
                    })
                }
            })
        }
    }
}
