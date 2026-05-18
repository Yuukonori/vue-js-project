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

const globalSystemState = {
    uptime: ref(0),
    latency: ref(0),
    latencyStatus: ref('STABLE'),
    isPolling: false
}

function startSystemPolling() {
    if (globalSystemState.isPolling) return;
    globalSystemState.isPolling = true;

    // Fetch initial uptime
    fetch('/api/uptime')
        .then(res => res.json())
        .then(data => { globalSystemState.uptime.value = data.uptime })
        .catch(console.error);

    setInterval(() => {
        globalSystemState.uptime.value++;
    }, 1000);

    const checkLatency = async () => {
        const start = performance.now()
        try {
            await fetch('/api/health')
            const end = performance.now()
            globalSystemState.latency.value = Math.round(end - start)

            if (globalSystemState.latency.value < 60) globalSystemState.latencyStatus.value = 'STABLE'
            else if (globalSystemState.latency.value < 150) globalSystemState.latencyStatus.value = 'WARNING'
            else globalSystemState.latencyStatus.value = 'UNSTABLE'
        } catch (err) {
            globalSystemState.latencyStatus.value = 'OFFLINE'
        }
    }

    checkLatency();
    setInterval(checkLatency, 5000);
}

export function DashboardPage(user) {
    return {
        name: 'DashboardPage',
        setup() {
            startSystemPolling()
            const repairTickets = ref([])
            const expiringAssets = ref([])
            const latency = globalSystemState.latency
            const latencyStatus = globalSystemState.latencyStatus
            const uptime = globalSystemState.uptime

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

            const canSeeAllTickets = user.allowedFeatures?.includes('all_tickets')
            const canSeeNetworkMap = user.allowedFeatures?.includes('network_map')

            const fetchData = async () => {
                try {
                    const ticketsRes = await fetch('/api/repair/tickets')
                    let tickets = await ticketsRes.json()

                    // Admins and IT department see all tickets; others only see their own
                    const isAdmin = user.role === 'Administrator' || user.role === 'administration'
                    const isIT = String(user.department || '').toLowerCase() === 'it' || String(user.role || '').toLowerCase() === 'it'

                    if (!isAdmin && !isIT) {
                        tickets = tickets.filter(t => t.submitted_by_id === user.id)
                    }
                    repairTickets.value = tickets

                    const assetsRes = await fetch('/api/assets/expiring')
                    expiringAssets.value = await assetsRes.json()
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
            const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1920
            const isMobile = viewportW < 768
            const isDesktopResponsive = viewportW > 1024 && viewportW <= 1600
            const systemCard1Key = isMobile ? 2 : 4
            const systemCard2Key = isMobile ? 3 : 5
            const systemCard3Key = isMobile ? 4 : 6
            function onShowNetworkMap() {
                if (typeof globalThis.__appNavigate === 'function') {
                    globalThis.__appNavigate('/monitoring')
                    return
                }
            }

            const isAdminOrIT = user.role === 'Administrator' || user.department === 'IT'
            const expiringKey = isDesktopResponsive ? 17 : 12

            const mainView = buildContentGrid({
                columns: 4, rows: isDesktopResponsive ? 5 : 4, colGap: 12, rowGap: 16, display: false,
                fillViewport: true,
                span: isDesktopResponsive
                    ? { 1: { colSpan: 4, rowSpan: 2 }, 9: { colSpan: 4, rowSpan: 1 }, 13: { colSpan: 4, rowSpan: 1 }, 17: { colSpan: 4, rowSpan: 1 } }
                    : { 1: { colSpan: 4, rowSpan: 2 }, 9: { colSpan: 3, rowSpan: 1 }, 12: { rowSpan: 2 }, 13: { colSpan: 3, rowSpan: 1 }, 17: { colSpan: 4 } },
                padding: '24px',
                cellPadding: 0,
                mobileConfig: {
                    columns: 1,
                    rows: 13,
                    child: {
                        1: buildHeader({
                            title: 'Dashboard',
                            titleOptions: { size: '4xl' },
                            subtitle: `Welcome back, ${user.name}!`,
                            statusText: 'ALL OK',
                            statusIcon: 'circle',
                            statusColor: dashboardColors.healthyState,
                            statusBg: 'gray200',
                            statusWidth: 'auto',
                            backgroundColor: 'transparent',
                            divider: false,
                            padding: '30px 24px 22px',
                            style: { margin: '-24px 0 0 -24px', width: 'calc(100% + 48px)' },
                        }),
                        2: null,
                        3: null,
                        4: null,
                        5: null,
                        6: null,
                        7: null,
                        8: buildGrid({
                            columns: 1, rows: 1, height: 'auto', padding: 0, rowGap: 0, display: false,
                            child: { 1: null }
                        }),
                        9: buildGrid({
                            columns: 1, rows: 4, padding: '20px', rowGap: '16', display: true,
                            backgroundColor: '#ffffff',
                            align: { 1: 'start left' },
                            style: { marginTop: '-56px' },
                            child: {
                                1: h('div', {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        gap: '8px',
                                        marginTop: '10px',
                                        width: '100%',
                                    }
                                }, [
                                    buildText('System Health', { variant: 'h3', weight: 'bold', color: dashboardColors.headingText }),
                                    Ruki.canSeeNetworkMap ? buildButton('VIEW NETWORK MAP', {
                                        variant: 'link',
                                        color: dashboardColors.actionColor,
                                        size: 'md',
                                        class: 'network-map-link-mobile',
                                        onPressed: onShowNetworkMap,
                                        style: {
                                            marginTop: '20px',
                                            fontWeight: '700',
                                            textDecoration: 'none',
                                            letterSpacing: '0.2px',
                                            fontSize: '9px',
                                            lineHeight: '1.1'
                                        }
                                    }) : null
                                ]),
                                2: buildGrid({
                                    columns: 2, rows: 2, background: dashboardColors.cardBackground, rowGap: 4, display: true,
                                    span: { 3: { colSpan: 2, rowSpan: 1 }, 4: { colSpan: 2, rowSpan: 1 } },
                                    align: { 1: 'start left', 2: 'start right', 3: 'start left', 4: 'start left' },
                                    style: { background: '#f8fbff', border: '1px solid #d9e5ff', padding: '14px' },
                                    child: {
                                        1: buildIcon('server', { size: 58, color: dashboardColors.actionColor, style: { marginRight: '0' } }),
                                        2: buildBadge('99.99%', { color: dashboardColors.healthyState, size: 'md', variant: 'solid', style: { marginTop: '0', marginRight: '0' } }),
                                        3: buildText('Server Uptime', { tag: 'div', size: '13px', color: dashboardColors.bodyText, style: { marginTop: '10px', marginLeft: '0' } }),
                                        4: buildText(Ruki.formattedUptime, { tag: 'div', size: '18px', weight: 'bold', color: dashboardColors.bodyText, style: { marginTop: '6px', marginLeft: '0' } })
                                    }
                                }),
                                3: buildGrid({
                                    columns: 2, rows: 2, background: dashboardColors.cardBackground, rowGap: 4, display: true,
                                    span: { 3: { colSpan: 2, rowSpan: 1 }, 4: { colSpan: 2, rowSpan: 1 } },
                                    align: { 1: 'start left', 2: 'start right', 3: 'start left', 4: 'start left' },
                                    style: { background: '#fff9f4', border: '1px solid #ffe4cc', padding: '14px' },
                                    child: {
                                        1: buildIcon('gauge', { size: 58, color: dashboardColors.warningState, style: { marginRight: '0' } }),
                                        2: buildBadge(Ruki.latencyStatus, { color: Ruki.latencyStatus === 'STABLE' ? dashboardColors.healthyState : Ruki.latencyStatus === 'WARNING' ? dashboardColors.warningState : dashboardColors.criticalState, size: 'md', variant: 'solid', style: { marginTop: '0', marginRight: '0' } }),
                                        3: buildText('Network Latency', { tag: 'div', size: '13px', color: dashboardColors.bodyText, style: { marginTop: '10px', marginLeft: '0' } }),
                                        4: buildText(`${Ruki.latency}ms`, { tag: 'div', size: '18px', weight: 'bold', color: dashboardColors.bodyText, style: { marginTop: '6px', marginLeft: '0' } })
                                    }
                                }),
                                4: buildGrid({
                                    columns: 2, rows: 2, background: dashboardColors.cardBackground, rowGap: 4, display: true,
                                    span: { 3: { colSpan: 2, rowSpan: 1 }, 4: { colSpan: 2, rowSpan: 1 } },
                                    align: { 1: 'start left', 2: 'start right', 3: 'start left', 4: 'start left' },
                                    style: { background: '#fff7f8', border: '1px solid #ffd8de', padding: '14px' },
                                    child: {
                                        1: buildIcon('shield', { size: 58, color: dashboardColors.criticalState, style: { marginRight: '0' } }),
                                        2: buildBadge('-//-', { color: dashboardColors.neutralState, size: 'md', variant: 'solid', style: { marginTop: '0', marginRight: '0' } }),
                                        3: buildText('Security Score', { tag: 'div', size: '13px', color: dashboardColors.bodyText, style: { marginTop: '10px', marginLeft: '0' } }),
                                        4: buildText('-//-', { tag: 'div', size: '18px', weight: 'bold', color: dashboardColors.bodyText, style: { marginTop: '6px', marginLeft: '0' } })
                                    }
                                }),
                            }
                        }),
                        10: null,
                        11: null,
                        12: buildGrid({
                            columns: 6, rows: 4, height: 'auto', rowGap: '16', padding: '20px', display: true,
                            style: { marginTop: '-28px' },
                            span: { 1: { colSpan: 6 }, 7: { colSpan: 6, rowSpan: 3 }, 25: { colSpan: 6 } },
                            align: { 1: 'center left', 7: 'center', 25: 'center' },
                            child: {
                                1: buildText('Expiring Assets', { variant: 'h3', weight: 'bold', color: dashboardColors.headingText }),
                                7: Ruki.expiringAssets.length > 0 ? buildStackedCardsList({
                                    data: Ruki.expiringAssets,
                                    border: false,
                                    columns: [
                                        {
                                            key: 'icon',
                                            accessor: 'type',
                                            render: (val) => buildIconContainer({ icon: val, colorIcon: dashboardColors.warningState, colorCon: '#fef3c7', size: 38, radius: '10px' })
                                        },
                                        { key: 'title', accessor: 'name' },
                                        { key: 'subtitle', accessor: 'expiry_label' },
                                    ],
                                }) : buildText('All assets are up to date.', { size: 'sm', color: 'gray400', style: { textAlign: 'center', width: '100%', minHeight: '72px', backgroundColor: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' } }),
                                25: buildButton('FULL EXPIRATION LOG', { variant: 'link', color: dashboardColors.actionColor, size: 'md', style: { fontWeight: '700', textDecoration: 'none', letterSpacing: '0.2px' } }),
                            }
                        }),
                        13: buildGrid({
                            columns: 3, rows: 2, height: 'auto', padding: '20px', rowGap: '16', display: true,
                            align: { 1: 'center left' },
                            span: { 1: { colSpan: 2, rowSpan: 1 }, 4: { colSpan: 3, rowSpan: 1 } },
                            child: {
                                1: buildText('Recent Repair Tickets', { variant: 'h3', weight: 'bold', color: dashboardColors.headingText }),
                                4: Ruki.repairTickets.length > 0
                                    ? buildStackedCardsList({
                                        data: Ruki.repairTickets.slice(0, 3),
                                        border: false,
                                        columns: [
                                            { key: 'title', accessor: 'subject' },
                                            { key: 'subtitle', accessor: 'submitted_by_name', render: (val) => `Submitted by ${val || 'Unknown'}` },
                                            { key: 'right', accessor: 'status', render: (val) => buildBadge(String(val || '').toUpperCase(), { color: (val || '').toLowerCase().includes('urgent') ? 'error' : (val || '').toLowerCase().includes('resolved') ? 'success' : 'info', variant: 'soft', size: 'md', radius: 'full' }) },
                                        ],
                                    })
                                    : buildText('No recent tickets found.', { size: 'md', color: 'gray400', style: { textAlign: 'center', width: '100%', minHeight: '60px', backgroundColor: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' } })
                            },
                        }),
                    },
                },
                tabletConfig: { columns: 2, rows: 3 },
                align: { [expiringKey]: 'center' },
                child: {
                    1: buildHeader({
                        title: 'Dashboard',
                        titleOptions: { size: '4xl' },
                        subtitle: `Welcome back, ${user.name}!`,
                        statusText: isMobile ? 'ALL OK' : 'ALL SYSTEM OPERATIONAL',
                        statusIcon: 'circle',
                        statusColor: dashboardColors.healthyState,
                        statusBg: 'gray200', statusWidth: isMobile ? 'auto' : '195px', backgroundColor: 'transparent', divider: false, padding: '30px 24px 22px',
                        style: { margin: '-24px 0 0 -24px', width: 'calc(100% + 48px)' },
                    }),
                    9: buildGrid({
                        columns: isMobile ? 1 : 3, rows: isMobile ? 4 : 2, padding: '20px', rowGap: '16', display: true,
                        backgroundColor: '#ffffff',
                        align: { 3: 'start right' },
                        style: isMobile ? { marginTop: '-56px' } : {},
                        span: isMobile
                            ? { 1: { colSpan: 1, rowSpan: 1 }, 7: { colSpan: 1, rowSpan: 1 } }
                            : { 1: { colSpan: 2, rowSpan: 1 }, 7: { colSpan: 3, rowSpan: 1 } },
                        child: {
                            1: isMobile
                                ? h('div', {
                                    style: {
                                        gridColumn: '1 / span 1',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        gap: '8px',
                                        marginTop: '10px',
                                        width: '100%',
                                    }
                                }, [
                                    buildText('System Health', { variant: 'h3', weight: 'bold', color: dashboardColors.headingText }),
                                    Ruki.canSeeNetworkMap ? buildButton('VIEW NETWORK MAP', {
                                        variant: 'link',
                                        color: dashboardColors.actionColor,
                                        size: 'md',
                                        class: 'network-map-link-mobile',
                                        onPressed: onShowNetworkMap,
                                        style: {
                                            marginTop: '20px',
                                            fontWeight: '700',
                                            textDecoration: 'none',
                                            letterSpacing: '0.2px',
                                            fontSize: '9px',
                                            lineHeight: '1.1'
                                        }
                                    }) : null
                                ])
                                : buildText('System Health', { variant: 'h3', weight: 'bold', color: dashboardColors.headingText, style: { marginTop: '10px' } }),
                            3: isMobile
                                ? null
                                : (Ruki.canSeeNetworkMap ? buildButton('VIEW NETWORK MAP', {
                                    variant: 'link',
                                    color: dashboardColors.actionColor,
                                    size: 'md',
                                    onPressed: onShowNetworkMap,
                                    style: {
                                        justifySelf: 'end',
                                        marginRight: '-8px',
                                        marginTop: '10px',
                                        fontWeight: '700',
                                        textDecoration: 'none',
                                        letterSpacing: '0.2px'
                                    }
                                }) : null),
                            [systemCard1Key]: buildGrid({
                                columns: isMobile ? 2 : 3, rows: isMobile ? 2 : 3, background: dashboardColors.cardBackground, rowGap: 4, display: true,
                                span: isMobile ? { 3: { colSpan: 2, rowSpan: 1 }, 4: { colSpan: 2, rowSpan: 1 } } : { 4: { colSpan: 2, rowSpan: 1 }, 7: { colSpan: 2, rowSpan: 1 } },
                                align: isMobile ? { 1: 'start left', 2: 'start right', 3: 'start left', 4: 'start left' } : { 1: 'center Left', 3: 'center right', 4: 'end Left', 7: 'center left' },
                                mobileMaxColumns: 1,
                                style: {
                                    background: '#f8fbff',
                                    border: '1px solid #d9e5ff',
                                    ...(isMobile ? { padding: '14px' } : {}),
                                },
                                child: {
                                    1: buildIcon('server', { size: isMobile ? 58 : 75, color: dashboardColors.actionColor, style: { marginRight: isMobile ? '0' : '5px' } }),
                                    [isMobile ? 2 : 3]: buildBadge('99.99%', { color: dashboardColors.healthyState, size: isMobile ? 'md' : 'lg', variant: 'solid', style: { marginTop: '0', marginRight: isMobile ? '0' : '10px' } }),
                                    [isMobile ? 3 : 4]: buildText('Server Uptime', { tag: 'div', size: isMobile ? '13px' : '16px', color: dashboardColors.bodyText, style: { marginTop: '10px', marginLeft: isMobile ? '0' : '5px' } }),
                                    [isMobile ? 4 : 7]: buildText(Ruki.formattedUptime, { tag: 'div', size: isMobile ? '18px' : '20px', weight: 'bold', color: dashboardColors.bodyText, style: { marginTop: '6px', marginLeft: isMobile ? '0' : '5px' } })
                                }
                            }),
                            [systemCard2Key]: buildGrid({
                                columns: isMobile ? 2 : 3, rows: isMobile ? 2 : 3, background: dashboardColors.cardBackground, rowGap: 4, display: true,
                                span: isMobile ? { 3: { colSpan: 2, rowSpan: 1 }, 4: { colSpan: 2, rowSpan: 1 } } : { 4: { colSpan: 2, rowSpan: 1 }, 7: { colSpan: 2, rowSpan: 1 } },
                                align: isMobile ? { 1: 'start left', 2: 'start right', 3: 'start left', 4: 'start left' } : { 1: 'center Left', 3: 'center Right', 4: 'end Left', 7: 'center left' },
                                mobileMaxColumns: 1,
                                style: {
                                    background: '#fff9f4',
                                    border: '1px solid #ffe4cc',
                                    ...(isMobile ? { padding: '14px' } : {}),
                                },
                                child: {
                                    1: buildIcon('gauge', { size: isMobile ? 58 : 75, color: dashboardColors.warningState, style: { marginRight: isMobile ? '0' : '5px' } }),
                                    [isMobile ? 2 : 3]: buildBadge(Ruki.latencyStatus, { color: Ruki.latencyStatus === 'STABLE' ? dashboardColors.healthyState : Ruki.latencyStatus === 'WARNING' ? dashboardColors.warningState : dashboardColors.criticalState, size: isMobile ? 'md' : 'lg', variant: 'solid', style: { marginTop: '0', marginRight: isMobile ? '0' : '10px' } }),
                                    [isMobile ? 3 : 4]: buildText('Network Latency', { tag: 'div', size: isMobile ? '13px' : '16px', color: dashboardColors.bodyText, style: { marginTop: '10px', marginLeft: isMobile ? '0' : '5px' } }),
                                    [isMobile ? 4 : 7]: buildText(`${Ruki.latency}ms`, { tag: 'div', size: isMobile ? '18px' : '24px', weight: 'bold', color: dashboardColors.bodyText, style: { marginTop: '6px', marginLeft: isMobile ? '0' : '5px' } })
                                }
                            }),
                            [systemCard3Key]: buildGrid({
                                columns: isMobile ? 2 : 3, rows: isMobile ? 2 : 3, background: dashboardColors.cardBackground, rowGap: 4, display: true,
                                span: isMobile ? { 3: { colSpan: 2, rowSpan: 1 }, 4: { colSpan: 2, rowSpan: 1 } } : { 4: { colSpan: 2, rowSpan: 1 }, 7: { colSpan: 2, rowSpan: 1 } },
                                align: isMobile ? { 1: 'start left', 2: 'start right', 3: 'start left', 4: 'start left' } : { 1: 'center Left', 3: 'center Right', 4: 'end Left', 7: 'center left' },
                                mobileMaxColumns: 1,
                                style: {
                                    background: '#fff7f8',
                                    border: '1px solid #ffd8de',
                                    ...(isMobile ? { padding: '14px' } : {})
                                },
                                child: {
                                    1: buildIcon('shield', { size: isMobile ? 58 : 75, color: dashboardColors.criticalState, style: { marginRight: isMobile ? '0' : '5px' } }),
                                    [isMobile ? 2 : 3]: buildBadge('-//-', { color: dashboardColors.neutralState, size: isMobile ? 'md' : 'lg', variant: 'solid', style: { marginTop: '0', marginRight: isMobile ? '0' : '10px' } }),
                                    [isMobile ? 3 : 4]: buildText('Security Score', { tag: 'div', size: isMobile ? '13px' : '16px', color: dashboardColors.bodyText, style: { marginTop: '10px', marginLeft: isMobile ? '0' : '5px' } }),
                                    [isMobile ? 4 : 7]: buildText('-//-', { tag: 'div', size: isMobile ? '18px' : '24px', weight: 'bold', color: dashboardColors.bodyText, style: { marginTop: '6px', marginLeft: isMobile ? '0' : '5px' } })
                                }
                            }),
                        }
                    }),
                    13: buildGrid({
                        columns: 3, rows: 2, height: isMobile ? 'auto' : '100%', padding: '20px', rowGap: '16', display: true,
                        align: { 1: 'center left' },
                        span: { 1: { colSpan: 2, rowSpan: 1 }, 4: { colSpan: 3, rowSpan: 1 } },
                        child: {
                            1: buildText('Recent Repair Tickets', { variant: 'h3', weight: 'bold', color: dashboardColors.headingText }),
                            4: Ruki.repairTickets.length > 0
                                ? (isMobile
                                    ? buildStackedCardsList({
                                        data: Ruki.repairTickets.slice(0, 3),
                                        border: false,
                                        columns: [
                                            { key: 'title', accessor: 'subject' },
                                            { key: 'subtitle', accessor: 'submitted_by_name', render: (val) => `Submitted by ${val || 'Unknown'}` },
                                            { key: 'right', accessor: 'status', render: (val) => buildBadge(String(val || '').toUpperCase(), { color: (val || '').toLowerCase().includes('urgent') ? 'error' : (val || '').toLowerCase().includes('resolved') ? 'success' : 'info', variant: 'soft', size: 'md', radius: 'full' }) },
                                        ],
                                    })
                                    : buildTable({
                                        columns: [
                                            { header: 'Ticket ID', accessor: 'ticket_id', flex: 1, render: (val) => buildText(String(val || ''), { tag: 'span', color: dashboardColors.actionColor, weight: 'semibold' }) },
                                            { header: 'Subject', accessor: 'subject', flex: 4 },
                                            { header: 'Submitted By', accessor: 'submitted_by_name', flex: 3, render: (val) => buildText(val || 'Unknown', { size: 'sm', color: dashboardColors.bodyText }) },
                                            { header: 'Status', accessor: 'status', flex: 2, align: 'center', render: (val) => buildBadge(String(val || '').toUpperCase(), { color: (val || '').toLowerCase().includes('urgent') ? 'error' : (val || '').toLowerCase().includes('resolved') ? 'success' : 'info', variant: 'soft', size: 'lg', radius: 'full' }) },
                                            { header: 'Updated', accessor: 'updated_at', flex: 2, align: 'center', render: (val) => val ? new Date(val).toLocaleDateString() : '' }
                                        ],
                                        data: Ruki.repairTickets,
                                        pagination: { maxRows: 3, fillRows: true },
                                        onRowClick: (row) => Ruki.openTicketDetails(row),
                                        rowHover: true,
                                    }))
                                : buildText('No recent tickets found.', { size: 'md', color: 'gray400', style: { textAlign: 'center', width: '100%', minHeight: isMobile ? '60px' : '100%', backgroundColor: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' } })
                        },
                    }),
                    [expiringKey]: buildGrid({
                        columns: 6, rows: isMobile ? 4 : 12, height: isMobile ? 'auto' : '100%', rowGap: '16', padding: '20px', display: true,
                        span: isMobile ? { 1: { colSpan: 6 }, 7: { colSpan: 6, rowSpan: 3 }, 25: { colSpan: 6 } } : { 1: { colSpan: 6 }, 7: { colSpan: 6, rowSpan: 10 }, 67: { colSpan: 6 } },
                        align: isMobile ? { 1: 'center left', 7: 'center', 25: 'center' } : { 1: 'center left', 7: 'start', 67: 'center' },
                        child: {
                            1: buildText('Expiring Assets', { variant: 'h3', weight: 'bold', color: dashboardColors.headingText }),
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
                            }) : buildText('All assets are up to date.', { size: 'sm', color: 'gray400', style: { textAlign: 'center', width: '100%', minHeight: isMobile ? '72px' : '100%', backgroundColor: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' } }),
                            [isMobile ? 25 : 67]: buildButton('FULL EXPIRATION LOG', { variant: 'link', color: dashboardColors.actionColor, size: 'md', style: { fontWeight: '700', textDecoration: 'none', letterSpacing: '0.2px' } }),
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
                                    6: buildGrid({
                                        columns: 1, rows: 2, rowGap: 8, display: false,
                                        child: {
                                            1: buildText('Prepared By (IT)', { size: 'sm', weight: 'bold', color: dashboardColors.headingText }),
                                            2: buildText(String(Ruki.selectedTicket?.prepared_by || 'Assigning...'), { size: 'md', color: dashboardColors.actionColor, weight: 'semibold', style: { padding: '12px 16px', backgroundColor: '#f0f9ff', borderRadius: '10px', border: '1px solid #bae6fd' } })
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
