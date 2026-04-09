import { buildHeader, buildBadge, buildButton, buildContentGrid, buildGrid, buildIcon, buildTable, buildText, colors } from '../ui/index.js'

/**
 * Dashboard color roles for this page.
 * Each key explains what the color is used for in the UI.
 */
const dashboardColors = {
  // Text hierarchy
  headingText: 'gray800',        // Main section/page headings
  subText: 'gray500',            // Supporting text under headings
  bodyText: 'gray600',           // Standard value/label text
  strongHeading: 'gray900',      // Highest-contrast heading text
  metaText: 'gray400',           // Secondary metadata like "EXPIRING IN X DAYS"

  // States
  healthyState: 'success',       // Healthy/operational indicators
  warningState: 'warning',       // Expiring-soon or caution indicators
  criticalState: 'error',        // Urgent/alert indicators
  neutralState: 'neutral',       // Neutral status indicators

  // Brand action and emphasis
  actionColor: 'primary',        // Action links/buttons and highlighted identifiers

  // Surfaces and separators
  cardBackground: colors.gray100, // Sub-card backgrounds
  borderSoft: 'gray200',          // Light divider/border color
  iconMuted: 'gray300',           // Subtle directional icons
}

/**
 * DashboardPage(user)
 * @param {{ name: string }} user
 */
export function DashboardPage(user) {

    function onShowNetworkMap() {
      if (typeof globalThis.__appNavigate === 'function') {
        globalThis.__appNavigate('/monitoring')
        return
      }
      alert('Network map route is unavailable.')
    }


  return buildContentGrid({
    columns: 4,
    rows:    4,
    colGap:  12,
    rowGap:  12,
    display: false,
        span: {
        1: { colSpan: 4, rowSpan: 2 },
        9: { colSpan: 3, rowSpan: 1 },
        12: { rowSpan: 2 },
        13: { colSpan: 3, rowSpan: 1 },
        17: { colSpan: 4 },
    },
    padding: '24px',
    cellPadding: 0,
    mobileConfig: { columns: 1, rows: 3 },
    tabletConfig: { columns: 2, rows: 3 },
    align: {
        12: 'center',
    },
    child: {
      1: buildHeader({
        title: 'Dashboard',
        subtitle: `Welcome back, ${user.name}!`,
        statusText: 'ALL SYSTEM OPERATIONAL',
        statusIcon: 'circle',
        statusColor: dashboardColors.healthyState,
        statusBg: 'gray200',
        statusWidth: '195px',
        backgroundColor: 'white',
        divider: false,
        padding: '30px 24px 22px',
        style: {
          margin: '-24px 0 0 -24px',
          width: 'calc(100% + 48px)',
        },
      }),
      9: buildGrid({
        columns: 3, rows: 2,
        padding: '20px',
        rowGap: '30',
        display: true,
        align: {
            3: 'center right',
        },
        span: {
            1: { colSpan: 2, rowSpan: 1 },
            7: { colSpan: 3, rowSpan: 1 }
        },
        child: {
            1: buildText('System Health', { variant: 'h3', weight: 'bold', color: dashboardColors.headingText, style: { marginTop: '10px' } }),
            3: buildButton('VIEW NETWORK MAP', { 
                variant: 'link',
                color: dashboardColors.actionColor,
                size: 'md',
                onPressed: onShowNetworkMap,
                style: {
                    fontWeight: '700',
                    textDecoration: 'none',
                    letterSpacing: '0.2px',
                }, 
            }),
            4: buildGrid({
                columns: 3, rows: 3,
                background: dashboardColors.cardBackground,
                hover: true,
                rowGap: 4,
                display: true,
                onPressed: onShowNetworkMap,
                span: {
                    4: { colSpan: 2, rowSpan: 1 }
                },
                align: {
                    1: 'center Left',
                    3: 'center right',
                    4: 'end Left',
                    7: 'center left',
                },
                child: {
                    1: buildIcon('server', { size: 75, color: dashboardColors.actionColor, style: {marginRight: '5px'},}),
                    3: buildBadge('99.99%',
                        { color: dashboardColors.healthyState,
                            size: 'lg',
                            variant: 'solid',
                            style: {
                                marginRight: '10px'
                            }
                        }),
                    4: buildText('Server Uptime', {
                        tag: 'div',
                        size: '16px',
                        color: dashboardColors.bodyText,
                        style: { marginTop: '10px', marginLeft: '5px' },
                    }),
                    7: buildText('42 Nodes', {
                        tag: 'div',
                        size: '20px',
                        weight: 'bold',
                        color: dashboardColors.bodyText,
                        style: { marginTop: '6px', marginLeft: '5px' },
                    })
                }
            }),
            5: buildGrid({
                columns: 3, rows: 3,
                background: dashboardColors.cardBackground,
                hover: true,
                rowGap: 4,
                display: true,
                onPressed: onShowNetworkMap,
                span: {
                    4: { colSpan: 2, rowSpan: 1 },
                    7: { colSpan: 2, rowSpan: 1 }
                },
                align: {
                    1: 'center Left',
                    3: 'center Right',
                    4: 'end Left',
                    7: 'center left',
                },
                child: {
                    1: buildIcon('gauge', { size: 75, color: dashboardColors.warningState, style: {marginRight: '5px'}, }),
                    3: buildBadge('STABLE',
                        { color: dashboardColors.neutralState,
                            size: 'lg',
                            variant: 'solid',
                            style: {
                                marginRight: '10px'
                            }
                        }),
                    4: buildText('Network Latency', {
                        tag: 'div',
                        size: '16px',
                        color: dashboardColors.bodyText,
                        style: { marginTop: '10px', marginLeft: '5px' },
                    }),
                    7: buildText('14ms', {
                        tag: 'div',
                        size: '24px',
                        weight: 'bold',
                        color: dashboardColors.bodyText,
                        style: { marginTop: '6px', marginLeft: '5px' },
                    })
                }
            }),
            6: buildGrid({
                columns: 3, rows: 3,
                background: dashboardColors.cardBackground,
                hover: true,
                rowGap: 4,
                display: true,
                onPressed: onShowNetworkMap,
                span: {
                    4: { colSpan: 2, rowSpan: 1 },
                    7: { colSpan: 2, rowSpan: 1 }
                },
                align: {
                    1: 'center Left',
                    3: 'center Right',
                    4: 'end Left',
                    7: 'center left',
                },
                child: {
                    1: buildIcon('shield', { size: 75, color: dashboardColors.criticalState, style: {marginRight: '5px'}, }),
                    3: buildBadge('2 ALERTS',
                        { color: dashboardColors.criticalState,
                            size: 'lg',
                            variant: 'solid',
                            style: {
                                marginRight: '10px'
                            }
                        }),
                    4: buildText('Security Score', {
                        tag: 'div',
                        size: '16px',
                        color: dashboardColors.bodyText,
                        style: { marginTop: '10px',marginLeft: '5px' },
                    }),
                    7: buildText('88 / 100', {
                        tag: 'div',
                        size: '24px',
                        weight: 'bold',
                        color: dashboardColors.bodyText,
                        style: { marginTop: '6px', marginLeft: '5px' },
                    })
                }
            }),
        }
      }),
        13: buildGrid({
            columns: 3, rows: 2,
            padding: '20px',
            rowGap: '30',
            display: true,
            align: {
                1: 'center left',
            },
            span: {
                1: { colSpan: 2, rowSpan: 1 },
                4: { colSpan: 3, rowSpan: 1 }
            },
            child: {
                1: buildText('Recent Repair Tickets', { variant: 'h3', weight: 'bold', color: dashboardColors.headingText }),
                4: buildTable({
                    columns: [
                        {
                            header: 'Ticket ID',
                            accessor: 'id',
                            render: (value) => buildText(String(value || ''), {
                                tag: 'span',
                                color: dashboardColors.actionColor,
                                weight: 'semibold',
                            }),
                        },
                        { header: 'Subject', accessor: 'subject' },
                        {
                            header: 'Status',
                            accessor: 'status',
                            align: 'center',
                            render: (value) => {
                                const normalized = String(value || '').trim().toLowerCase()
                                const colorByStatus = {
                                    'in progress': 'info',
                                    resolved: 'success',
                                    urgent: 'error',
                                    pending: 'neutral',
                                }

                                return buildBadge(String(value || '').toUpperCase(), {
                                    color: colorByStatus[normalized] ?? 'neutral',
                                    variant: 'soft',
                                    size: 'lg',
                                    radius: 'full',
                                })
                            }
                        },
                        { header: 'Updated', accessor: 'updated', align: 'center' }
                    ],
                    data: [
                        { id: '12345', subject: 'Display flicker - User A.smith', status: 'In Progress', updated: '2026-01-01' },
                        { id: '12346', subject: 'Keyboard Replacement', status: 'Resolved', updated: '2026-01-02' },
                        { id: '12347', subject: 'Cloud Sync Error', status: 'Pending', updated: '2026-01-03' },
                        { id: '12348', subject: 'Software Update Failure', status: 'Urgent', updated: '2026-01-04' }
                    ],
                    rowHover: true,
                    onRowClick: (row) => alert(`Clicked ticket ${row.id}: ${row.subject} (${row.status})`),
                })
            },
      }),
      12: buildGrid({
        columns: 6, rows: 12,
        height: '100%',
        rowGap: '20',
        padding: '20px',
        display: true,
        span: {
            2: { colSpan: 4 },
            7: { colSpan: 6, rowSpan: 2 },
            19: { colSpan: 6, rowSpan: 2 },
            31: { colSpan: 6, rowSpan: 2 },
            43: { colSpan: 6, rowSpan: 2 },
            55: { colSpan: 6, rowSpan: 2 },
            67: { colSpan: 6 },
        },
        align: {
            1: 'center',
            2: 'center left',
            67: 'center',
        },
        child: {
            1: buildIcon('calendar-x', { size: 40, color: dashboardColors.warningState }),
            2: buildText('Expiring Assets', { variant: 'h3', weight: 'bold', color: dashboardColors.strongHeading }),
            7: buildGrid({
                columns: 12, rows: 2,
                hover: true,
                padding: '12px',
                display: true,
                align: {
                    1: 'center left',
                    2: 'center left',
                    12: 'center',
                },
                span: {
                    1: { rowSpan: 2 },
                    2: { colSpan: 10 },
                    12: { rowSpan: 2 },
                    14: { colSpan: 10 },
                },
                onPressed: () => alert('View Expiring Assets clicked'),
                child: {
                    1: buildGrid({
                        columns: 1, rows: 1,
                        display: true,
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px',
                        child: {
                            1: buildIcon('laptop', { size: 40, color: dashboardColors.warningState }),
                        },
                    }),
                    2: buildText('MacBook Pro M2', {
                        tag: 'div',
                        size: '16px',
                        weight: 'bold',
                        color: dashboardColors.headingText,
                    }),
                    12: buildIcon('chevron-right', { size: 26, color: dashboardColors.iconMuted }),
                    14: buildText('EXPIRING IN 12 DAYS', {
                        tag: 'div',
                        size: '14px',
                        weight: 'semibold',
                        color: dashboardColors.metaText,
                    }),
                },
            }),
            19: buildGrid({
                columns: 12, rows: 2,
                hover: true,
                padding: '12px',
                display: true,
                align: {
                    1: 'center left',
                    2: 'center left',
                    12: 'center',
                },
                span: {
                    1: { rowSpan: 2 },
                    2: { colSpan: 10 },
                    12: { rowSpan: 2 },
                    14: { colSpan: 10 },
                },
                onPressed: () => alert('View Expiring Assets clicked'),
                child: {
                    1: buildGrid({
                        columns: 1, rows: 1,
                        display: true,
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px',
                        child: {
                            1: buildIcon('router', { size: 40, color: dashboardColors.warningState }),
                        },
                    }),
                    2: buildText('Cisco Edge Switch', {
                        tag: 'div',
                        size: '16px',
                        weight: 'bold',
                        color: dashboardColors.headingText,
                    }),
                    12: buildIcon('chevron-right', { size: 26, color: dashboardColors.iconMuted }),
                    14: buildText('EXPIRING IN 24 DAYS', {
                        tag: 'div',
                        size: '14px',
                        weight: 'semibold',
                        color: dashboardColors.metaText,
                    }),
                },
            }),
            31: buildGrid({
                columns: 12, rows: 2,
                hover: true,
                padding: '12px',
                display: true,
                align: {
                    1: 'center left',
                    2: 'center left',
                    12: 'center',
                },
                span: {
                    1: { rowSpan: 2 },
                    2: { colSpan: 10 },
                    12: { rowSpan: 2 },
                    14: { colSpan: 10 },
                },
                onPressed: () => alert('View Expiring Assets clicked'),
                child: {
                    1: buildGrid({
                        columns: 1, rows: 1,
                        display: true,
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px',
                        child: {
                            1: buildIcon('printer', { size: 40, color: dashboardColors.warningState }),
                        },
                    }),
                    2: buildText('Printer Laser Jett', {
                        tag: 'div',
                        size: '16px',
                        weight: 'bold',
                        color: dashboardColors.headingText,
                    }),
                    12: buildIcon('chevron-right', { size: 26, color: dashboardColors.iconMuted }),
                    14: buildText('DUE IN 2 DAYS', {
                        tag: 'div',
                        size: '14px',
                        weight: 'semibold',
                        color: dashboardColors.metaText,
                    }),
                },
            }),
            43: buildGrid({
                columns: 12, rows: 2,
                hover: true,
                padding: '12px',
                display: true,
                align: {
                    1: 'center left',
                    2: 'center left',
                    12: 'center',
                },
                span: {
                    1: { rowSpan: 2 },
                    2: { colSpan: 10 },
                    12: { rowSpan: 2 },
                    14: { colSpan: 10 },
                },
                onPressed: () => alert('View Expiring Assets clicked'),
                child: {
                    1: buildGrid({
                        columns: 1, rows: 1,
                        display: true,
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px',
                        child: {
                            1: buildIcon('laptop', { size: 40, color: dashboardColors.warningState }),
                        },
                    }),
                    2: buildText('MacBook Pro M3', {
                        tag: 'div',
                        size: '16px',
                        weight: 'bold',
                        color: dashboardColors.headingText,
                    }),
                    12: buildIcon('chevron-right', { size: 26, color: dashboardColors.iconMuted }),
                    14: buildText('EXPIRING IN 12 DAYS', {
                        tag: 'div',
                        size: '14px',
                        weight: 'semibold',
                        color: dashboardColors.metaText,
                    }),
                },
            }),
            55: buildGrid({
                columns: 12, rows: 2,
                hover: true,
                padding: '12px',
                display: true,
                align: {
                    1: 'center left',
                    2: 'center left',
                    12: 'center',
                },
                span: {
                    1: { rowSpan: 2 },
                    2: { colSpan: 10 },
                    12: { rowSpan: 2 },
                    14: { colSpan: 10 },
                },
                onPressed: () => alert('View Expiring Assets clicked'),
                child: {
                    1: buildGrid({
                        columns: 1, rows: 1,
                        display: true,
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px',
                        child: {
                            1: buildIcon('laptop', { size: 40, color: dashboardColors.warningState }),
                        },
                    }),
                    2: buildText('MacBook Pro M1', {
                        tag: 'div',
                        size: '16px',
                        weight: 'bold',
                        color: dashboardColors.headingText,
                    }),
                    12: buildIcon('chevron-right', { size: 26, color: dashboardColors.iconMuted }),
                    14: buildText('EXPIRING IN 12 DAYS', {
                        tag: 'div',
                        size: '14px',
                        weight: 'semibold',
                        color: dashboardColors.metaText,
                    }),
                },
            }),
            67: buildButton('FULL EXPIRATION LOG', {
                variant: 'link',
                color: dashboardColors.actionColor,
                size: 'md',
                onPressed: () => alert('Opening full expiration log...'),
                style: {
                    fontWeight: '700',
                    textDecoration: 'none',
                    letterSpacing: '0.2px',
                },
            }),
        }
      })
    }
  })
}

