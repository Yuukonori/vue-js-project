import { buildButton, buildCircularProgress, buildContentGrid, buildDivider, buildGrid, buildHeader, buildIcon, buildIconText, buildTable, buildText } from '../ui/index.js'

/**
 * MonitoringPage(user)
 * @param {{ name: string }} user
 */
export function MonitoringPage(user) {
  return buildContentGrid({
    columns: 6,
    rows: 6,
    height: '100%',
    colGap: 12,
    rowGap: 12,
    padding: '24px',
    cellPadding: 0,
    display: false,
    span: {
      1: { colSpan: 6, rowSpan: 2 },
      13: { colSpan: 2 },
      15: { colSpan: 4 },
      19: { colSpan: 2 },
      21: { colSpan: 4 },
      25: { colSpan: 6 },
      31: { colSpan: 2 },
      33: { colSpan: 4 }
    },
    align: {
      13: 'center left',
    },
    child: {
      1: buildHeader({
        title: 'Central Monitoring Hub',
        subtitle: 'A holistic archival view of system health, physical assets, and user engagement.',
        backgroundColor: 'white',
        divider: false,
        padding: '30px 24px 22px',
        style: {
          margin: '-24px 0 0 -24px',
          width: 'calc(100% + 48px)',
        },
      }),
      13: buildIconText('System Health', {
        icon: 'computer',
        iconSize: 30,
        iconColor: 'primary',
        textSize: '2xl',
        textWeight: 'bold',
        textColor: 'gray800',
        gap: '8px',
        style: { marginLeft: '10px' }
     }),
     15: buildIconText('User Activities', {
        icon: 'user-activities',
        iconSize: '30',
        iconColor: 'primary',
        textSize: '2xl',
        textWeight: 'bold',
        textColor: 'gray800',
        gap: '8px',
        style: { marginLeft: '10px' }
     }),
     19: buildGrid({
        height: '100%',
        columns: 6,
        rows: 5,
        rowGap: '15',
        display: true,
        padding: '14px 16px',
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        span: {
          1: { colSpan: 5 },
          6: { colSpan: 1 },
          7: { colSpan: 6, rowSpan: 3 },
          25: { colSpan: 6 }
        },
        align: {
          1: 'center left',
          6: 'center right',
          7: 'center',
          25: 'center'
        },
        child: {
          1: buildText('Security Score', { size: 'lg', weight: 'bold', color: 'gray700', style: {marginTop: '10px'}}),
          6: buildIcon('shield', { size: 24, color: '#8a7a0a', style: {marginRight: '10px'} }),
          7: buildCircularProgress({
            value: 88,
            max: 100,
            size: 250,
            strokeWidth: 9,
            color: '#1f5fc8',
            trackColor: '#e5edf7',
            textColor: '#1f2937',
            hover: true,
            animation: true
          }),
          25: buildText('/ 100', { size: 'md', color: 'gray400' }),
        },
      }),
      21: buildGrid({
        height: '100%',
        columns: 8,
        rows: 5,
        display: true,
        padding: '16px 18px',
        rowGap: 8,
        colGap: 8,
        borderRadius: '14px',
        backgroundColor: '#ffffff',
        span: {
          1: { colSpan: 6 },
          7: { colSpan: 2 },
          9: { colSpan: 8 },
          17: { colSpan: 8 },
          25: { colSpan: 8 },
          33: { colSpan: 8 },
          41: { colSpan: 8 },
        },
        align: {
          1: 'center left',
          7: 'center right',
          9: 'start left',
          17: 'center',
          25: 'center',
          33: 'center',
          41: 'center',
        },
        child: {
          1: buildText('Real-time Activity Feed', {
             size: 'lg', weight: 'bold', color: 'gray700'
          }),
          7: buildButton('View Detailed Logs ->', {
            size: 'sm',
            weight: 'semibold',
            color: 'primary',
            onPressed: () => {}
          }),
          9: buildText('Latest events from authenticated users across all nodes', {
            size: 'sm',
            color: 'gray500',
          }),
          17: buildGrid({
            hover: true,
            onPressed: () => {},
            columns: 14,
            rows: 2,
            display: true,
            span: {
                1: { rowSpan: 2},
              2: { colSpan: 10 },
              12: { colSpan: 3 },
              16: { colSpan: 14 },
            },
            align: {
              1: 'center',
              2: 'center left',
              12: 'start right',
              16: 'start left',
            },
            child: {
              1: buildGrid({
                columns: 1,
                rows: 1,
                width: '36px',
                height: '36px',
                display: true,
                padding: 0,
                border: 'none',
                borderRadius: '10px',
                backgroundColor: '#dbeafe',
                align: { 1: 'center' },
                child: {
                  1: buildIcon('logout', { size: 18, color: '#2563eb' }),
                },
              }),
              2: buildText('Administrator Login by J. Abernathy', { size: 'lg', weight: 'bold', color: 'gray700' }),
              12: buildText('JUST NOW', { size: 'xs', weight: 'bold', color: 'gray400' }),
              16: buildText('Authenticated via RSA Token. Node: Internal Console [Terminal 04].', { size: 'sm', color: 'gray500' }),
            },
          }),
          25: buildGrid({
            hover: true,
            onPressed: () => {},
            columns: 14,
            rows: 2,
            display: true,
            span: {
                1: { rowSpan: 2 },
              2: { colSpan: 10 },
              12: { colSpan: 3 },
              16: { colSpan: 14 },
            },
            align: {
              1: 'center',
              2: 'center left',
              12: 'start right',
              16: 'start left',
            },
            child: {
              1: buildGrid({
                columns: 1,
                rows: 1,
                width: '36px',
                height: '36px',
                display: true,
                padding: 0,
                border: 'none',
                borderRadius: '10px',
                backgroundColor: '#fef3c7',
                align: { 1: 'center' },
                child: {
                  1: buildIcon('refresh', { size: 18, color: '#b45309' }),
                },
              }),
              2: buildText('Credential Update for User ID: 9928', { size: 'lg', weight: 'bold', color: 'gray700' }),
              12: buildText('12M AGO', { size: 'xs', weight: 'bold', color: 'gray400' }),
              16: buildText('Password successfully changed via Security Portal. Complexity requirements met.', { size: 'sm', color: 'gray500' }),
            },
          }),
          33: buildGrid({
            hover: true,
            onPressed: () => {},
            columns: 14,
            rows: 2,
            display: true,
            span: {
                1: { rowSpan: 2},
              2: { colSpan: 10 },
              12: { colSpan: 3 },
              16: { colSpan: 14 },
            },
            align: {
              1: 'center',
              2: 'center left',
              12: 'start right',
              16: 'start left',
            },
            child: {
              1: buildGrid({
                columns: 1,
                rows: 1,
                width: '36px',
                height: '36px',
                display: true,
                padding: 0,
                border: 'none',
                borderRadius: '10px',
                backgroundColor: '#e2e8f0',
                align: { 1: 'center' },
                child: {
                  1: buildIcon('logout', { size: 18, color: '#475569' }),
                },
              }),
              2: buildText('Session Termination for M. Vasquez', { size: 'lg', weight: 'bold', color: 'gray700' }),
              12: buildText('28M AGO', { size: 'xs', weight: 'bold', color: 'gray400' }),
              16: buildText('Manual logout from Remote Asset Console. Session duration: 01:42:12.', { size: 'sm', color: 'gray500' })
            },
          }),
        },
      }),
      25: buildIconText('Assets Status', { icon: 'assets', iconSize: 30,
            iconColor: 'primary',
            textSize: '2xl',
            textWeight: 'bold',
            textColor: 'gray800',
            gap: '8px',
            style: { marginLeft: '10px', marginTop: '10px' }
      }),
      31: buildGrid({
          height: '100%',
          columns: 2,
          rows: 4,
          display: true,
          padding: '16px',
          rowGap: 10,
          colGap: 10,
          borderRadius: '14px',
          backgroundColor: '#ffffff',
          span: {
            1: { colSpan: 2 },
            3: { colSpan: 1 },
            4: { colSpan: 1 },
            5: { colSpan: 2 },
            7: { colSpan: 2 },
            9: { colSpan: 2 },
          },
          align: {
            1: 'center left',
            3: 'center',
            4: 'center',
            5: 'center',
            7: 'center',
            9: 'center',
          },
          child: {
            1: buildText('Inventory Summary', { size: '2xl', weight: 'bold', color: 'gray700' }),
            3: buildGrid({
              columns: 1,
              rows: 2,
              display: true,
              border: 'none',
              borderRadius: '10px',
              backgroundColor: '#eaf8f2',
              padding: '36px 10px',
              align: { 1: 'center', 2: 'center' },
              child: {
                1: buildText('1,248', { size: '4xl', weight: 'bold', color: '#047857' }),
                2: buildText('ACTIVE ASSETS', { size: 'xs', weight: 'bold', color: '#059669', letterSpacing: '0.8px' }),
              },
            }),
            4: buildGrid({
              columns: 1,
              rows: 2,
              display: true,
              border: 'none',
              borderRadius: '10px',
              backgroundColor: '#fdf1f2',
              padding: '36px 10px',
              align: { 1: 'center', 2: 'center' },
              child: {
                1: buildText('12', { size: '4xl', weight: 'bold', color: '#b91c1c' }),
                2: buildText('OFFLINE', { size: 'xs', weight: 'bold', color: '#ef4444', letterSpacing: '0.8px' }),
              },
            }),
            5: buildGrid({
              columns: 2,
              rows: 2,
              display: false,
              align: { 1: 'center left', 2: 'center right' },
              child: {
                1: buildText('Server Hardware', { size: 'lg', weight: 'semibold', color: 'gray500' }),
                2: buildText('42 Nodes', { size: 'lg', weight: 'bold', color: 'gray700', style: {marginTop: '10px'} }),
                3: buildDivider({ direction: 'h', color: '#10b981', thickness: '4px', margin: '2px 0 0 0' }),
              },
            }),
            7: buildGrid({
              columns: 2,
              rows: 2,
              display: false,
              align: { 1: 'center left', 2: 'center right' },
              child: {
                1: buildText('Client Terminals', { size: 'lg', weight: 'semibold', color: 'gray500' }),
                2: buildText('98.2% Active', { size: 'lg', weight: 'bold', color: 'gray700', style: {marginTop: '10px'} }),
                3: buildDivider({ direction: 'h', color: '#10b981', thickness: '4px', margin: '2px 0 0 0' }),
              },
            }),
          },
      }),
      33: buildGrid({
        height: '100%',
        columns: 3,
        rows: 2,
        display: true,
        span: {
          1: { colSpan: 3 },
          4: { colSpan: 3 },
        },
        align: {
          1: 'center left',
          4: 'center',
        },
        child: {
          1: buildText('Critical Maintenance', { size: '2xl', weight: 'bold', color: 'gray700' }),
          4: buildTable({
            width: '100%',
            columns: [
              {
                header: 'ASSET ID',
                accessor: 'assetId',
                wrap: false,
                render: (value) => buildText(String(value), {
                  size: 'sm',
                  weight: 'bold',
                  color: 'gray700',
                  lineHeight: '1.25',
                  style: { whiteSpace: 'nowrap' },
                }),
              },
              {
                header: 'ISSUE',
                accessor: 'issue',
                wrap: false,
                render: (value) => buildText(String(value), {
                  size: 'sm',
                  weight: 'semibold',
                  color: 'gray500',
                  lineHeight: '1.25',
                  style: { whiteSpace: 'nowrap' },
                }),
              },
              {
                header: 'PRIORITY',
                accessor: 'priority',
                align: 'center',
                render: (value) => {
                  const map = { critical: '#ef4444', high: '#f59e0b', medium: '#00e038' }
                  return buildText(String(value).toUpperCase(), {
                    size: 'sm',
                    weight: 'bold',
                    color: map[String(value).toLowerCase()] ?? 'gray500',
                    letterSpacing: '0.4px',
                  })
                },
              },
              {
                header: 'ACTION',
                accessor: 'action',
                align: 'center',
                wrap: false,
                render: (value) => buildText(String(value), {
                  size: 'sm',
                  weight: 'bold',
                  color: '#2563eb',
                  lineHeight: '1.2',
                  style: { cursor: 'pointer', whiteSpace: 'nowrap' },
                }),
              },
            ],
            data: [
              { assetId: 'Node-14-UK', issue: 'Overheating - Fan failure', priority: 'Critical', action: 'Dispatch' },
              { assetId: 'Vault-Terminal-09', issue: 'Kernel Panic on boot', priority: 'High', action: 'Remote Fix' },
              { assetId: 'Storage-Array-04', issue: 'Predictive drive failure', priority: 'Medium', action: 'Order Part' },
              { assetId: 'Storage-Array-05', issue: 'Predictive drive failure', priority: 'High', action: 'Order Part' },
              { assetId: 'Storage-Array-06', issue: 'Predictive drive failure', priority: 'Low', action: 'Order Part' },
            ],
            style: {
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
            },
            pagination: {maxRows: 3}
          }),
        }
      })
    },
  })
}
