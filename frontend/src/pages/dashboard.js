import { h, ref, onMounted, computed } from 'vue'
import { buildHeader, buildBadge, buildButton, buildContentGrid, buildGrid, buildIcon, buildIconContainer, buildTable, buildText, buildStackedCardsList, colors } from '../ui/index.js'

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
            const latency = ref(0)
            const latencyStatus = ref('STABLE')
            const uptime = ref(0)

            const formattedUptime = computed(() => {
                const s = uptime.value
                const d = Math.floor(s / (3600 * 24))
                const h = Math.floor((s % (3600 * 24)) / 3600)
                const m = Math.floor((s % 3600) / 60)
                const sec = s % 60

                let parts = []
                if (d > 0) parts.push(`${d}d`)
                if (h > 0) parts.push(`${h}h`)
                if (m > 0) parts.push(`${m}m`)
                parts.push(`${sec}s`)
                return parts.join(' ')
            })

            const checkLatency = async () => {
                const start = performance.now()
                try {
                    await fetch('/api/health')
                    const end = performance.now()
                    latency.value = Math.round(end - start)

                    if (latency.value < 60) latencyStatus.value = 'STABLE'
                    else if (latency.value < 150) latencyStatus.value = 'WARNING'
                    else latencyStatus.value = 'UNSTABLE'
                } catch (err) {
                    latencyStatus.value = 'OFFLINE'
                }
            }

            const canSeeAllTickets = user.allowedFeatures?.includes('all_tickets')
            const canSeeNetworkMap = user.allowedFeatures?.includes('network_map')

            const fetchData = async () => {
                try {
                    const ticketsRes = await fetch('/api/repair/tickets')
                    let tickets = await ticketsRes.json()

                    // Filter tickets based on feature permission
                    if (!canSeeAllTickets) {
                        tickets = tickets.filter(t => t.submitted_by_id === user.id || t.user_id === user.id)
                    }
                    repairTickets.value = tickets

                    const assetsRes = await fetch('/api/assets/expiring')
                    expiringAssets.value = await assetsRes.json()

                    const uptimeRes = await fetch('/api/uptime')
                    const uptimeData = await uptimeRes.json()
                    uptime.value = uptimeData.uptime

                    await checkLatency()
                } catch (err) {
                    console.error('Failed to fetch dashboard data:', err)
                }
            }

            const selectedTicket = ref(null)
            const showDetailsModal = ref(false)

            const openTicketDetails = (ticket) => {
                selectedTicket.value = ticket
                showDetailsModal.value = true
            }

            const closeTicketDetails = () => {
                showDetailsModal.value = false
                selectedTicket.value = null
            }

            onMounted(() => {
                fetchData()
                const latInterval = setInterval(checkLatency, 5000)
                const upInterval = setInterval(() => { uptime.value++ }, 1000)
                return () => {
                    clearInterval(latInterval)
                    clearInterval(upInterval)
                }
            })

            return {
                repairTickets,
                expiringAssets,
                latency,
                latencyStatus,
                uptime,
                formattedUptime,
                selectedTicket,
                showDetailsModal,
                openTicketDetails,
                closeTicketDetails,
                canSeeAllTickets,
                canSeeNetworkMap
            }
        },
        render(Ruki) {
            function onShowNetworkMap() {
                if (typeof globalThis.__appNavigate === 'function') {
                    globalThis.__appNavigate('/monitoring')
                    return
                }
            }

            const isAdminOrIT = user.role === 'Administrator' || user.department === 'IT'

            const mainView = buildContentGrid({
                columns: 4, rows: 4, colGap: 12, rowGap: 12, display: false,
                fillViewport: true,
                span: { 1: { colSpan: 4, rowSpan: 2 }, 9: { colSpan: 3, rowSpan: 1 }, 12: { rowSpan: 2 }, 13: { colSpan: 3, rowSpan: 1 }, 17: { colSpan: 4 } },
                padding: '24px', cellPadding: 0, mobileConfig: { columns: 1, rows: 3 }, tabletConfig: { columns: 2, rows: 3 },
                align: { 12: 'center' },
                child: {
                    1: buildHeader({
                        title: 'Dashboard',
                        titleOptions: { size: '4xl' },
                        subtitle: `Welcome back, ${user.name}!`,
                        statusText: 'ALL SYSTEM OPERATIONAL',
                        statusIcon: 'circle',
                        statusColor: dashboardColors.healthyState,
                        statusBg: 'gray200', statusWidth: '195px', backgroundColor: 'white', divider: false, padding: '30px 24px 22px',
                        style: { margin: '-24px 0 0 -24px', width: 'calc(100% + 48px)' },
                    }),
                    9: buildGrid({
                        columns: 3, rows: 2, padding: '20px', rowGap: '30', display: true,
                        backgroundColor: '#ffffff',
                        align: { 3: 'center right' },
                        span: { 1: { colSpan: 2, rowSpan: 1 }, 7: { colSpan: 3, rowSpan: 1 } },
                        child: {
                            1: buildText('System Health', { variant: 'h3', weight: 'bold', color: dashboardColors.headingText, style: { marginTop: '10px' } }),
                            3: Ruki.canSeeNetworkMap ? buildButton('VIEW NETWORK MAP', { variant: 'link', color: dashboardColors.actionColor, size: 'md', onPressed: onShowNetworkMap, style: { fontWeight: '700', textDecoration: 'none', letterSpacing: '0.2px' } }) : null,
                            4: buildGrid({
                                columns: 3, rows: 3, background: dashboardColors.cardBackground, rowGap: 4, display: true,
                                span: { 4: { colSpan: 2, rowSpan: 1 }, 7: { colSpan: 2, rowSpan: 1 } },
                                align: { 1: 'center Left', 3: 'center right', 4: 'end Left', 7: 'center left' },
                                child: {
                                    1: buildIcon('server', { size: 75, color: dashboardColors.actionColor, style: { marginRight: '5px' } }),
                                    3: buildBadge('99.99%', { color: dashboardColors.healthyState, size: 'lg', variant: 'solid', style: { marginRight: '10px' } }),
                                    4: buildText('Server Uptime', { tag: 'div', size: '16px', color: dashboardColors.bodyText, style: { marginTop: '10px', marginLeft: '5px' } }),
                                    7: buildText(Ruki.formattedUptime, { tag: 'div', size: '20px', weight: 'bold', color: dashboardColors.bodyText, style: { marginTop: '6px', marginLeft: '5px' } })
                                }
                            }),
                            5: buildGrid({
                                columns: 3, rows: 3, background: dashboardColors.cardBackground, rowGap: 4, display: true,
                                span: { 4: { colSpan: 2, rowSpan: 1 }, 7: { colSpan: 2, rowSpan: 1 } },
                                align: { 1: 'center Left', 3: 'center Right', 4: 'end Left', 7: 'center left' },
                                child: {
                                    1: buildIcon('gauge', { size: 75, color: dashboardColors.warningState, style: { marginRight: '5px' } }),
                                    3: buildBadge(Ruki.latencyStatus, { color: Ruki.latencyStatus === 'STABLE' ? dashboardColors.healthyState : Ruki.latencyStatus === 'WARNING' ? dashboardColors.warningState : dashboardColors.criticalState, size: 'lg', variant: 'solid', style: { marginRight: '10px' } }),
                                    4: buildText('Network Latency', { tag: 'div', size: '16px', color: dashboardColors.bodyText, style: { marginTop: '10px', marginLeft: '5px' } }),
                                    7: buildText(`${Ruki.latency}ms`, { tag: 'div', size: '24px', weight: 'bold', color: dashboardColors.bodyText, style: { marginTop: '6px', marginLeft: '5px' } })
                                }
                            }),
                            6: buildGrid({
                                columns: 3, rows: 3, background: dashboardColors.cardBackground, rowGap: 4, display: true,
                                span: { 4: { colSpan: 2, rowSpan: 1 }, 7: { colSpan: 2, rowSpan: 1 } },
                                align: { 1: 'center Left', 3: 'center Right', 4: 'end Left', 7: 'center left' },
                                child: {
                                    1: buildIcon('shield', { size: 75, color: dashboardColors.criticalState, style: { marginRight: '5px' } }),
                                    3: buildBadge('-//-', { color: dashboardColors.neutralState, size: 'lg', variant: 'solid', style: { marginRight: '10px' } }),
                                    4: buildText('Security Score', { tag: 'div', size: '16px', color: dashboardColors.bodyText, style: { marginTop: '10px', marginLeft: '5px' } }),
                                    7: buildText('-//-', { tag: 'div', size: '24px', weight: 'bold', color: dashboardColors.bodyText, style: { marginTop: '6px', marginLeft: '5px' } })
                                }
                            }),
                        }
                    }),
                    13: buildGrid({
                        columns: 3, rows: 2, height: '100%', padding: '20px', rowGap: '30', display: true,
                        align: { 1: 'center left' },
                        span: { 1: { colSpan: 2, rowSpan: 1 }, 4: { colSpan: 3, rowSpan: 1 } },
                        child: {
                            1: buildText('Recent Repair Tickets', { variant: 'h3', weight: 'bold', color: dashboardColors.headingText }),
                            4: Ruki.repairTickets.length > 0 ? buildTable({
                                columns: [
                                    { header: 'Ticket ID', accessor: 'ticket_id', flex: 1, render: (val) => buildText(String(val || ''), { tag: 'span', color: dashboardColors.actionColor, weight: 'semibold' }) },
                                    { header: 'Subject', accessor: 'subject', flex: 4 },
                                    { header: 'Submitted By', accessor: 'submitted_by_name', flex: 3, render: (val) => buildText(val || 'Unknown', { size: 'sm', color: dashboardColors.bodyText }) },
                                    { header: 'Status', accessor: 'status', flex: 2, align: 'center', render: (val) => buildBadge(String(val || '').toUpperCase(), { color: (val || '').toLowerCase().includes('urgent') ? 'error' : (val || '').toLowerCase().includes('resolved') ? 'success' : 'info', variant: 'soft', size: 'lg', radius: 'full' }) },
                                    { header: 'Updated', accessor: 'updated_at', flex: 2, align: 'center', render: (val) => val ? new Date(val).toLocaleDateString() : '' }
                                ],
                                data: Ruki.repairTickets,
                                pagination: { maxRows: 3, align: 'right', fillRows: true },
                                onRowClick: (row) => Ruki.openTicketDetails(row),
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
                                border: false,
                                columns: [
                                    {
                                        key: 'icon', accessor: 'type', render: (val) => {
                                            return buildIconContainer({ icon: val, colorIcon: dashboardColors.warningState, colorCon: '#fef3c7', size: 38, radius: '10px' })
                                        }
                                    },
                                    { key: 'title', accessor: 'name' },
                                    { key: 'subtitle', accessor: 'expiry_label' },
                                ],
                            }) : buildText('All assets are up to date.', { size: 'sm', color: 'gray400', style: { textAlign: 'center', width: '100%', height: '100%', backgroundColor: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' } }),
                            67: buildButton('FULL EXPIRATION LOG', { variant: 'link', color: dashboardColors.actionColor, size: 'md', style: { fontWeight: '700', textDecoration: 'none', letterSpacing: '0.2px' } }),
                        }
                    })
                }
            })

            const detailsModal = Ruki.showDetailsModal ? buildGrid({
                columns: 1, rows: 1, padding: 0,
                style: {
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10000,
                    backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                },
                child: {
                    1: buildGrid({
                        columns: 1, rows: 3, padding: '32px', rowGap: 20, display: true,
                        style: { width: '720px' },
                        child: {
                            1: buildText(`Ticket Details: #${Ruki.selectedTicket?.ticket_id || ''}`, { variant: 'h2', weight: 'bold', color: dashboardColors.strongHeading }),
                            2: buildGrid({
                                columns: 3, rows: 3, padding: '32px', rowGap: 24, colGap: 24, radius: 20, display: true,
                                backgroundColor: '#ffffff', border: '1px solid #e5e7ee',
                                span: { 7: { colSpan: 3 } },
                                child: {
                                    1: buildGrid({
                                        columns: 1, rows: 2, rowGap: 8, display: false,
                                        child: {
                                            1: buildText('Ticket ID', { size: 'sm', weight: 'bold', color: dashboardColors.headingText }),
                                            2: buildText(String(Ruki.selectedTicket?.ticket_id || '-'), { size: 'md', color: dashboardColors.actionColor, weight: 'semibold', style: { padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' } })
                                        }
                                    }),
                                    2: buildGrid({
                                        columns: 1, rows: 2, rowGap: 8, display: false,
                                        child: {
                                            1: buildText('Subject', { size: 'sm', weight: 'bold', color: dashboardColors.headingText }),
                                            2: buildText(String(Ruki.selectedTicket?.subject || '-'), { size: 'md', color: dashboardColors.headingText, style: { padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' } })
                                        }
                                    }),
                                    3: buildGrid({
                                        columns: 1, rows: 2, rowGap: 8, display: false,
                                        child: {
                                            1: buildText('Status', { size: 'sm', weight: 'bold', color: dashboardColors.headingText }),
                                            2: h('div', { style: { padding: '10px 16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center' } }, [
                                                buildBadge(String(Ruki.selectedTicket?.status || '').toUpperCase(), { color: (Ruki.selectedTicket?.status || '').toLowerCase().includes('urgent') ? 'error' : (Ruki.selectedTicket?.status || '').toLowerCase().includes('resolved') ? 'success' : 'info', variant: 'soft', size: 'md' })
                                            ])
                                        }
                                    }),
                                    4: buildGrid({
                                        columns: 1, rows: 2, rowGap: 8, display: false,
                                        child: {
                                            1: buildText('Updated Date', { size: 'sm', weight: 'bold', color: dashboardColors.headingText }),
                                            2: buildText(Ruki.selectedTicket?.updated_at ? new Date(Ruki.selectedTicket.updated_at).toLocaleDateString() : '-', { size: 'md', color: dashboardColors.bodyText, style: { padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' } })
                                        }
                                    }),
                                    5: buildGrid({
                                        columns: 1, rows: 2, rowGap: 8, display: false,
                                        child: {
                                            1: buildText('Submitted By', { size: 'sm', weight: 'bold', color: dashboardColors.headingText }),
                                            2: buildText(String(Ruki.selectedTicket?.submitted_by_name || 'Unknown'), { size: 'md', color: dashboardColors.bodyText, style: { padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' } })
                                        }
                                    }),
                                    7: buildGrid({
                                        columns: 1, rows: 2, rowGap: 8, display: false,
                                        child: {
                                            1: buildText('Description', { size: 'sm', weight: 'bold', color: dashboardColors.headingText }),
                                            2: buildText(String(Ruki.selectedTicket?.description || 'No additional details provided.'), { size: 'sm', color: dashboardColors.bodyText, style: { padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '100px', lineHeight: '1.6' } })
                                        }
                                    })
                                }
                            }),
                            3: buildButton('Close', { variant: 'outline', color: 'neutral', style: { width: '100%', height: '52px', fontWeight: 'bold', fontSize: '16px', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: '#ffffff' }, onPressed: Ruki.closeTicketDetails })
                        }
                    })
                }
            }) : null

            return h('div', { style: { position: 'relative', width: '100%', height: '100%' } }, [
                mainView,
                detailsModal
            ])
        }
    }
}
