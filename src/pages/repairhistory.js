import { buildBadge, buildButton, buildContentGrid, buildDivider, buildGrid, buildIcon, buildIconText, buildProgressBar, buildTable, buildText, buildTextBadge } from '../ui/index.js'

/**
 * RepairHistoryPage(user)
 * @param {{ name: string }} user
 */
export function RepairHistoryPage(user) {
  const incidents = [
    {
      title: 'Mainframe Server Cluster A-12',
      description: 'Thermal throttling detected in Rack 4. Cooling failure suspected.',
      severity: 'Critical',
      elapsed: '15m elapsed',
      color: '#ef4444',
      button: 'Assign Support',
    },
    {
      title: 'Workstation #442 - Research Dept',
      description: 'GPU Driver Kernel Panic after latest firmware update.',
      severity: 'Urgent',
      elapsed: '40m elapsed',
      color: '#a16207',
      button: 'View Logs',
    },
  ]

  const frequency = [
    { label: 'Power Supply Failure', value: 0.62 },
    { label: 'Software Conflict', value: 0.40 },
    { label: 'SSD Degradation', value: 0.82 },
  ]

  return buildContentGrid({
    columns: 4,
    rows: 6,
    colGap: 12,
    rowGap: 20,
    padding: '24px',
    cellPadding: 0,
    display: false,
    span: {
      1: { colSpan: 4 },
      5: { colSpan: 5},
      9: { colSpan: 2, rowSpan: 2 },
      11: { colSpan: 2, rowSpan: 2 },
      17: { colSpan: 3 },
      21: { colSpan: 4 }
    },
    align: {
        17: 'center Left'
    },
    child: {
      1: buildGrid({
        columns: 1,
        rows: 2,
        display: false,
        child: {
          1: buildText('Repair & Maintenance History', {
            tag: 'div',
            size: '4xl',
            weight: 'bold',
            color: 'gray800',
            lineHeight: '1.1',
            margin: '0',
          }),
          2: buildText('Deep diagnostics and technical log archival for enterprise assets.', {
            tag: 'div',
            size: 'sm',
            color: 'gray500',
            lineHeight: '1.3',
            margin: '0',
          }),
        },
      }),
      5: buildDivider({ direction: 'h', color: 'gray200', thickness: '1px', margin: '8px' }),
      9: buildGrid({
          columns: 3,
          rows: 4,
          display: true,
          align: {
            11: 'center'
          },
          span: {
            1: { colSpan: 2 },
            4: { colSpan: 3 },
            7: { colSpan: 3 }
          },
          child: {
            1: buildIconText('Ongoing Repairs', {
                textWeight: 'bold',
                icon: 'clipboard',
                iconSize: '50px',
                color: 'gray400',
                weight: 'semibold',
                letterSpacing: '0.8px',
                textSize: '24px',
                style: { marginLeft: '10px'}
            }),
            4: buildGrid({
                columns: 3,
                rows: 2,
                display: true,
                backgroundColor: '#F5F7FB',
                padding: '10px',
                colGap: 8,
                rowGap: 4,
                borderRadius: '10px',
                align: {
                  1: 'center left',
                  3: 'center Right',
                },
                span: {
                  1: { colSpan: 2, rowSpan: 2 },
                  3: { rowSpan: 2 },
                },
                child: {
                  1: buildGrid({
                    style: {
                        marginLeft: '10px'
                    },
                    columns: 12,
                    rows: 4,
                    display: false,
                    rowGap: 5,
                    span: {
                      2: { colSpan: 11 },
                      13: { colSpan: 12 },
                      25: { colSpan: 12 },
                      37: { colSpan: 4 },
                      41: { colSpan: 8 },
                    },
                    align: {
                      1: 'center',
                      2: 'center left',
                      37: 'center left',
                      41: 'center left',
                    },
                    child: {
                      1: buildText('●', { size: 'base', color: '#ff7c01' }),
                      2: buildText('WorkStation #442 - Research Dept', {
                        tag: 'div',
                        size: 'lg',
                        weight: 'bold',
                        color: 'gray800',
                        margin: '0',
                      }),
                      13: buildText('GPU Driver Kernal Panic after latest firmware update.', {
                        tag: 'div',
                        size: 'md',
                        color: 'gray600',
                        lineHeight: '1.2',
                        margin: '0',
                      }),
                      37: buildBadge('URGENT', {
                        color: '#ff7c01',
                        variant: 'soft',
                        size: 'sm',
                        style: {
                          letterSpacing: '0.4px',
                        },
                      }),
                      41: buildIconText('2H 15M ELAPSED', {
                        icon: 'clock',
                        iconSize: 14,
                        iconColor: 'gray500',
                        textSize: 'xs',
                        textWeight: 'semibold',
                        textColor: 'gray500',
                        gap: '4px',
                      }),
                    },
                  }),
                  3: buildButton('View Log', {
                    color: 'neutral',
                    size: 'sm',
                    style: {
                      minWidth: '98px',
                      minHeight: '52px',
                      fontSize: '14px',
                      fontWeight: '700',
                      marginRight: '10px'
                    },
                  }),
                }
            }),
            7: buildGrid({
                columns: 3,
                rows: 2,
                display: true,
                backgroundColor: '#F5F7FB',
                padding: '10px',
                colGap: 8,
                rowGap: 4,
                borderRadius: '10px',
                align: {
                  1: 'center left',
                  3: 'center Right',
                },
                span: {
                  1: { colSpan: 2, rowSpan: 2 },
                  3: { rowSpan: 2 },
                },
                child: {
                  1: buildGrid({
                    style: {
                        marginLeft: '10px'
                    },
                    columns: 12,
                    rows: 4,
                    display: false,
                    rowGap: 5,
                    span: {
                      2: { colSpan: 11 },
                      13: { colSpan: 12 },
                      25: { colSpan: 12 },
                      37: { colSpan: 4 },
                      41: { colSpan: 8 },
                    },
                    align: {
                      1: 'center',
                      2: 'center left',
                      37: 'center left',
                      41: 'center left',
                    },
                    child: {
                      1: buildText('●', { size: 'base', color: '#f51818' }),
                      2: buildText('Mainframe Server Cluster A-12', {
                        tag: 'div',
                        size: 'lg',
                        weight: 'bold',
                        color: 'gray800',
                        margin: '0',
                      }),
                      13: buildText('Thermal throttling detected in Rack 4. Cooling failure suspected.', {
                        tag: 'div',
                        size: 'md',
                        color: 'gray600',
                        lineHeight: '1.2',
                        margin: '0',
                      }),
                      37: buildBadge('CRITICAL', {
                        color: '#f51818',
                        variant: 'soft',
                        size: 'sm',
                        style: {
                          letterSpacing: '0.4px',
                        },
                      }),
                      41: buildIconText('2H 15M ELAPSED', {
                        icon: 'clock',
                        iconSize: 14,
                        iconColor: 'gray500',
                        textSize: 'xs',
                        textWeight: 'semibold',
                        textColor: 'gray500',
                        gap: '4px',
                      }),
                    },
                  }),
                  3: buildButton('Assign Support', {
                    color: 'neutral',
                    size: 'sm',
                    style: {
                      minWidth: '98px',
                      minHeight: '52px',
                      fontSize: '14px',
                      fontWeight: '700',
                      marginRight: '10px'
                    },
                  }),
                }
            }),
            11: buildButton('Show More',
                {
                    Color: 'primary',
                    size: 'md',
                    hover: true,
                    onclick: () => {}
                }
              ),
          }
      }),
      11: buildGrid({
        height: '100%',
        columns: 1,
        rows: 2,
        display: false,
        span: {
            1: { rowSpan: 2 }
        },
        child: {
            1:  buildProgressBar({
                height: '100%',
                title: 'Problem Frequency',
                titleColor: '#475569',
                bars: [
                    { text: 'Power Supply Failure', color: '#2563eb', value: 6200 },
                    { text: 'Software Conflict',    color: '#2563eb', value: 4100 },
                    { text: 'SSD Degradation',      color: '#2563eb', value: 8300 },
                ],
                animation: true,
                hover: true
            })
        }
      }),
      17: buildText('SERVICE HISTOY & FAILURE MONITORING',{
        variant: 'h4',
        color: '#475569',
        weight: 'bold',
        letterSpacing: '0.8px',
        style: {
            marginLeft: '5px'
        }
      }),
      21: buildTable({
        columns: [
          {
            header: 'ASSET ID',
            accessor: 'asset',
            render: (value, row) => buildGrid({
              columns: 1,
              rows: 2,
              display: false,
              rowGap: 2,
              child: {
                1: buildText(value, { tag: 'div', size: 'xl', weight: 'bold', color: 'gray800' }),
                2: buildText(row.subAsset, { tag: 'div', size: 'sm', color: 'gray500' }),
              },
            }),
          },
          {
            header: 'FAILURE FREQUENCY',
            accessor: 'frequencyLabel',
            align: 'center',
            render: (value) => buildText(value, { tag: 'div', size: 'sm', color: 'gray500', weight: 'semibold' }),
          },
          { header: 'LAST SERVICE', accessor: 'lastService' },
          {
            header: 'CONDITION',
            accessor: 'condition',
            align: 'center',
            render: (value, row) => buildTextBadge(value, {
              colorText: row.conditionColor,
              colorCon: '#f8fafc',
              size: 14,
              bold: true,
              padding: '4px 10px',
              radius: '8px',
            }),
          },
          {
            header: 'STATUS',
            accessor: 'statusIcon',
            align: 'center',
            render: (value, row) => buildIcon(value, { size: 16, color: row.statusColor }),
          },
        ],
        data: [
          {
            asset: 'LPT-7721',
            subAsset: 'MacBook Pro 16" - Design Lab',
            freqBars: 2,
            freqColor: '#2563eb',
            frequencyLabel: '2 incidents in 6 months',
            lastService: 'Oct 12, 2023',
            condition: 'Degrading',
            conditionColor: '#7a7600',
            statusIcon: 'warning',
            statusColor: '#7a7600',
          },
          {
            asset: 'SRV-0019',
            subAsset: 'Dell PowerEdge - Data Ctr 2',
            freqBars: 4,
            freqColor: '#c81e1e',
            frequencyLabel: 'Critical Failure Rate',
            lastService: 'Dec 01, 2023',
            condition: 'Unstable',
            conditionColor: '#dc2626',
            statusIcon: 'info',
            statusColor: '#c81e1e',
          },
          {
            asset: 'PRN-8821',
            subAsset: 'HP Enterprise Jet - Floor 3',
            freqBars: 1,
            freqColor: '#2563eb',
            frequencyLabel: '1 incident in 12 months',
            lastService: 'Jan 15, 2024',
            condition: 'Excellent',
            conditionColor: '#0e8004',
            statusIcon: 'circle-check',
            statusColor: '#0e8004',
          },
        ],
        pagination: { maxRows: 3, align: 'center',},
        onRowClick: () => {},
        style: {
          borderRadius: '14px',
          border: '1px solid #e5e7eb',
        },
      })
    },
  })
}
