import { buildIconTextContainer, buildBadge, buildButton, buildContentGrid, buildDivider, buildGrid, buildIcon, buildTable, buildText, buildTextBadge, colors, radius, spacing } from '../ui/index.js'

/**
 * DashboardPage(user)
 * @param {{ name: string }} user
 */
export function DashboardPage(user) {
  return buildContentGrid({
    columns: 4,
    rows:    4,
    colGap:  12,
    rowGap:  12,
    display: false,
        span: {
        5: { colSpan: 4, rowSpan: 1 },
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
        5: 'center',
        4: 'center',
        12: 'center',
    },
    child: {
      1: buildGrid({
        columns: 1, rows: 2,
        padding: '0',
        display: false,    
        child: {
          1: buildText('Dashboard', {
            tag: 'div',
            size: '4xl',
            weight: 'bold',
            color: 'gray800',
            lineHeight: '1.1',
            margin: '0',
          }),
          2: buildText('Welcome back, ' + user.name + '!', {
            tag: 'div',
            size: 'sm',
            color: 'gray500',
            lineHeight: '1.3',
            margin: '0',
          }),
        },
      }),
      4: buildGrid({
        columns: 2, rows: 1,
        padding: '0',
        display: false,
        align: {
            2: 'center right',
        },
        child: {
          2: buildIconTextContainer('ALL SYSTEM OPERATIONAL', {
                icon: 'circle',
                iconColor: '#32CD32',
                textSize: '10px',
                // textStyle: { marginTop: '2px'},
                width: '195px'
            })
        },
      }),
      5: buildDivider({ direction: 'h', color: 'gray200', thickness: '1px', margin: '8px' }),
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
            1: buildText('System Health', { variant: 'h3', weight: 'bold', color: 'gray800' }),
            3: buildButton('VIEW NETWORK MAP', { 
                variant: 'link',
                color: 'primary',
                size: 'md',
                onClick: () => alert('Opening full expiration log...'),
                style: {
                    fontWeight: '700',
                    textDecoration: 'none',
                    letterSpacing: '0.2px',
                }, 
            }),
            4: buildGrid({
                columns: 3, rows: 3,
                background: colors.gray100,
                hovered: true,
                rowGap: 4,
                display: true,
                onPressed: () => alert('View Network Map clicked'),
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
                    1: buildIcon('server', { size: 75, color: 'primary', style: {marginRight: '5px'},}),
                    3: buildBadge('99.99%',
                        { color: 'green',
                            size: 'lg',
                            variant: 'solid',
                            style: {
                                marginRight: '10px'
                            }
                        }),
                    4: buildText('Server Uptime', {
                        tag: 'div',
                        size: '16px',
                        color: 'gray600',
                        style: { marginTop: '10px', marginLeft: '5px' },
                    }),
                    7: buildText('42 Nodes', {
                        tag: 'div',
                        size: '20px',
                        weight: 'bold',
                        color: 'gray600',
                        style: { marginTop: '6px', marginLeft: '5px' },
                    })
                }
            }),
            5: buildGrid({
                columns: 3, rows: 3,
                background: colors.gray100,
                hovered: true,
                rowGap: 4,
                display: true,
                onPressed: () => alert('View Network Map clicked'),
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
                    1: buildIcon('gauge', { size: 75, color: '#7a7600', style: {marginRight: '5px'}, }),
                    3: buildBadge('STABLE',
                        { color: 'grey',
                            size: 'lg',
                            variant: 'solid',
                            style: {
                                marginRight: '10px'
                            }
                        }),
                    4: buildText('Network Latency', {
                        tag: 'div',
                        size: '16px',
                        color: 'gray600',
                        style: { marginTop: '10px', marginLeft: '5px' },
                    }),
                    7: buildText('14ms', {
                        tag: 'div',
                        size: '24px',
                        weight: 'bold',
                        color: 'gray600',
                        style: { marginTop: '6px', marginLeft: '5px' },
                    })
                }
            }),
            6: buildGrid({
                columns: 3, rows: 3,
                background: colors.gray100,
                hovered: true,
                rowGap: 4,
                display: true,
                onPressed: () => alert('View Network Map clicked'),
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
                    1: buildIcon('shield', { size: 75, color: 'red', style: {marginRight: '5px'}, }),
                    3: buildBadge('2 ALERTS',
                        { color: 'red',
                            size: 'lg',
                            variant: 'solid',
                            style: {
                                marginRight: '10px'
                            }
                        }),
                    4: buildText('Security Score', {
                        tag: 'div',
                        size: '16px',
                        color: 'gray600',
                        style: { marginTop: '10px',marginLeft: '5px' },
                    }),
                    7: buildText('88 / 100', {
                        tag: 'div',
                        size: '24px',
                        weight: 'bold',
                        color: 'gray600',
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
                1: buildText('Recent Repair Tickets', { variant: 'h3', weight: 'bold', color: 'gray800' }),
                4: buildTable({
                    columns: [
                        { header: 'Ticket ID', accessor: 'id' },
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
            1: buildIcon('calendar-x', { size: 40, color: '#7a7600' }),
            2: buildText('Expiring Assets', { variant: 'h3', weight: 'bold', color: 'black' }),
            7: buildGrid({
                columns: 12, rows: 2,
                hovered: true,
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
                            1: buildIcon('laptop', { size: 40, color: '#7a7600' }),
                        },
                    }),
                    2: buildText('MacBook Pro M2', {
                        tag: 'div',
                        size: '16px',
                        weight: 'bold',
                        color: 'gray800',
                    }),
                    12: buildIcon('chevron-right', { size: 26, color: 'gray300' }),
                    14: buildText('EXPIRING IN 12 DAYS', {
                        tag: 'div',
                        size: '14px',
                        weight: 'semibold',
                        color: 'gray400',
                    }),
                },
            }),
            19: buildGrid({
                columns: 12, rows: 2,
                hovered: true,
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
                            1: buildIcon('router', { size: 40, color: '#7a7600' }),
                        },
                    }),
                    2: buildText('Cisco Edge Switch', {
                        tag: 'div',
                        size: '16px',
                        weight: 'bold',
                        color: 'gray800',
                    }),
                    12: buildIcon('chevron-right', { size: 26, color: 'gray300' }),
                    14: buildText('EXPIRING IN 24 DAYS', {
                        tag: 'div',
                        size: '14px',
                        weight: 'semibold',
                        color: 'gray400',
                    }),
                },
            }),
            31: buildGrid({
                columns: 12, rows: 2,
                hovered: true,
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
                            1: buildIcon('printer', { size: 40, color: '#7a7600' }),
                        },
                    }),
                    2: buildText('Printer Laser Jett', {
                        tag: 'div',
                        size: '16px',
                        weight: 'bold',
                        color: 'gray800',
                    }),
                    12: buildIcon('chevron-right', { size: 26, color: 'gray300' }),
                    14: buildText('DUE IN 2 DAYS', {
                        tag: 'div',
                        size: '14px',
                        weight: 'semibold',
                        color: 'gray400',
                    }),
                },
            }),
            43: buildGrid({
                columns: 12, rows: 2,
                hovered: true,
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
                            1: buildIcon('laptop', { size: 40, color: '#7a7600' }),
                        },
                    }),
                    2: buildText('MacBook Pro M3', {
                        tag: 'div',
                        size: '16px',
                        weight: 'bold',
                        color: 'gray800',
                    }),
                    12: buildIcon('chevron-right', { size: 26, color: 'gray300' }),
                    14: buildText('EXPIRING IN 12 DAYS', {
                        tag: 'div',
                        size: '14px',
                        weight: 'semibold',
                        color: 'gray400',
                    }),
                },
            }),
            55: buildGrid({
                columns: 12, rows: 2,
                hovered: true,
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
                            1: buildIcon('laptop', { size: 40, color: '#7a7600' }),
                        },
                    }),
                    2: buildText('MacBook Pro M1', {
                        tag: 'div',
                        size: '16px',
                        weight: 'bold',
                        color: 'gray800',
                    }),
                    12: buildIcon('chevron-right', { size: 26, color: 'gray300' }),
                    14: buildText('EXPIRING IN 12 DAYS', {
                        tag: 'div',
                        size: '14px',
                        weight: 'semibold',
                        color: 'gray400',
                    }),
                },
            }),
            67: buildButton('FULL EXPIRATION LOG', {
                variant: 'link',
                color: 'primary',
                size: 'md',
                onClick: () => alert('Opening full expiration log...'),
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

