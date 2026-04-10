import { ref } from 'vue'
import { buildDateBoxContainer, buildButton, buildContentGrid, buildDropdown, buildGrid, buildHeader, buildIcon, buildTable, buildText, buildTextBadge } from '../ui/index.js'

const selectedActivityType = ref(null)
const selectedSeverity = ref('mid')
const startDate = ref('')
const endDate = ref('')

/**
 * ActivityLogsPage(user)
 * @param {{ name: string }} user
 */
export function ActivityLogsPage(user){
    return buildContentGrid({
        columns: 6,
        rows: 5,
        height: '100%',
        colGap: 12,
        rowGap: 12,
        padding: '24px',
        cellPadding: 0,
        display: false,
        span: {
            1: { colSpan: 6, rowSpan: 2 },
            13: { colSpan: 2, rowSpan: 2 },
            15: { colSpan: 2, rowSpan: 2 },
            17: { colSpan: 2, rowSpan: 2 },
            25: { colSpan: 6 }
        },
        child: {
            1: buildHeader({
              title: 'System Audit',
              subtitle: 'A Detail ledger of all administrative actions and automated system event accross the infrastructure.',
              actionText: 'Export Report',
              actionIcon: buildIcon('download', { size: 14, color: '#ffffff' }),
              onAction: () => {},
              backgroundColor: 'white',
              divider: false,
              padding: '30px 24px 22px',
              style: {
                margin: '-24px 0 0 -24px',
                width: 'calc(100% + 48px)',
              },
            }),
            13: buildGrid({
                height: '100%',
                columns: 7,
                rows: 2,
                display: true,
                align:{
                    11: 'center',
                    6: 'center Right'
                },
                span: {
                    1: { colSpan: 5 },
                    6: {colSpan: 2 },  
                    8: { colSpan: 3 },
                    12: { colSpan: 3 },
                },
                child:{
                    1: buildText('DATE RANGE SELECTION', { size: 'md', weight: 'bold', color: 'gray700', style: {marginLeft: '5px'} }),
                    8: buildDateBoxContainer({
                        placeHolder: 'mm/dd/yyyy',
                        value: startDate,
                        width: '100%',
                        height: '40px',
                        color: '#6b7280',
                        colorCon: '#ffffff',
                        padding: '0 12px',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        insert: true,
                        onPressed: () => {},
                        reqiured: false,
                        style: { boxSizing: 'border-box', marginTop: '5px' },
                    }),
                    11: buildText('TO', {
                        size: 'md', weight: 'bold', color: 'gray400'
                    }),
                    12: buildDateBoxContainer({
                        placeHolder: 'mm/dd/yyyy',
                        value: endDate,
                        width: '100%',
                        height: '40px',
                        color: '#6b7280',
                        colorCon: '#ffffff',
                        padding: '0 12px',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        insert: true,
                        onPressed: () => {},
                        reqiured: false,
                        style: { boxSizing: 'border-box', marginTop: '5px' },
                    }),
                    6: buildTextBadge('Clear', {
                        variant: 'link',
                        containerStyle: 'square',
                        radius: '10px',
                        width: '50px',
                        color: 'primary',
                        size: 'sm',
                        disabled: !startDate.value && !endDate.value,
                        onPressed: () => {
                          startDate.value = ''
                          endDate.value = ''
                        },
                        style: {
                          marginTop: '5px',
                          fontWeight: '700',
                          textDecoration: 'none',
                        },
                    }),
                }
            }),
            15: buildGrid({
                height: '100%',
                columns: 1,
                rows: 2,
                display: true,
                rowGap: 6,
                align: {
                  1: 'end left',
                  2: 'start left',
                },
                child: {
                    1: buildText('ACTIVITY TYPE', {
                      size: 'md',
                      weight: 'bold',
                      color: 'gray700',
                      style: {marginLeft: '5px'}
                    }),
                    2: buildDropdown({
                      placeholder: 'All Activities',
                      showClearButton: true,
                      items: [
                        { text: 'Login', value: 'login' },
                        { text: 'Update', value: 'update' },
                        { text: 'Delete', value: 'delete' },
                      ],
                      value: selectedActivityType,
                      onUpdate: (val) => { selectedActivityType.value = val },
                      width: '100%',
                      height: '40px',
                    }),
                }
            }),
            17: buildGrid({
                height: '100%',
                columns: 3,
                rows: 2,
                display: true,
                rowGap: 8,
                colGap: 8,
                span: {
                  1: { colSpan: 2 },
                },
                align: {
                  1: 'end left',
                  3: 'center Right',
                  4: 'start center',
                  5: 'start center',
                  6: 'start center',
                },
                child: {
                  1: buildText('SEVERITY LEVEL', {
                    size: 'md',
                    weight: 'bold',
                    color: 'gray700',
                    style: {marginLeft: '5px'}
                  }),
                  3: buildTextBadge('Clear', {
                        variant: 'link',
                        containerStyle: 'square',
                        radius: '10px',
                        width: '50px',
                        color: 'primary',
                        size: 'sm',
                        disabled: !selectedSeverity.value,
                        onPressed: () => {
                          selectedSeverity.value = ''
                        },
                        style: {
                          marginTop: '5px',
                          fontWeight: '700',
                          textDecoration: 'none',
                        },
                    }),
                  4: buildButton('Low', {
                    size: 'sm',
                    color: 'neutral',
                    variant: selectedSeverity.value === 'low' ? 'solid' : 'ghost',
                    style: {
                      width: '100%',
                      height: '36px',
                      borderRadius: '8px',
                      background: selectedSeverity.value === 'low' ? '#e8eff7' : '#f8fafc',
                      color: '#3b82f6',
                      border: '1px solid #e5e7eb',
                      fontWeight: '700',
                    },
                    onPressed: () => { selectedSeverity.value = 'low' },
                  }),
                  5: buildButton('Mid', {
                    size: 'sm',
                    color: 'warning',
                    variant: selectedSeverity.value === 'mid' ? 'solid' : 'ghost',
                    style: {
                      width: '100%',
                      height: '36px',
                      borderRadius: '8px',
                      background: selectedSeverity.value === 'mid' ? '#f3dd69' : '#f9f0bf',
                      color: '#6b5b00',
                      border: '1px solid #e5e7eb',
                      fontWeight: '700',
                    },
                    onPressed: () => { selectedSeverity.value = 'mid' },
                  }),
                  6: buildButton('Critical', {
                    size: 'sm',
                    color: 'error',
                    variant: selectedSeverity.value === 'critical' ? 'solid' : 'ghost',
                    style: {
                      width: '100%',
                      height: '36px',
                      borderRadius: '8px',
                      background: selectedSeverity.value === 'critical' ? '#f6d5d5' : '#fdeaea',
                      color: '#dc2626',
                      border: '1px solid #e5e7eb',
                      fontWeight: '700',
                    },
                    onPressed: () => { selectedSeverity.value = 'critical' },
                  }),
                }
            }),
            25: buildTable({
              columns: [
                {
                  header: 'TIMESTAMP',
                  accessor: 'timestamp',
                  flex: 2,
                  render: (value, row) => buildGrid({
                    columns: 1,
                    rows: 2,
                    display: false,
                    rowGap: 2,
                    child: {
                      1: buildText(String(value), { size: 'sm', weight: 'bold', color: 'primary' }),
                      2: buildText(String(row.time), { size: 'xs', color: 'gray400', weight: 'semibold' }),
                    },
                  }),
                },
                {
                  header: 'USER / IDENTITY',
                  accessor: 'user',
                  flex: 3,
                  render: (value) => buildText(String(value), { size: 'sm', weight: 'bold', color: 'gray700' }),
                },
                {
                  header: 'EVENT DESCRIPTION',
                  accessor: 'event',
                  flex: 5,
                  render: (value) => buildText(String(value), {
                    size: 'sm',
                    color: 'gray600',
                    weight: 'semibold',
                    lineHeight: '1.35',
                    style: { whiteSpace: 'normal' },
                  }),
                },
                {
                  header: 'IP ADDRESS',
                  accessor: 'ip',
                  flex: 2,
                  render: (value) => buildText(String(value), {
                    size: 'xs',
                    color: 'gray400',
                    weight: 'bold',
                    style: { whiteSpace: 'pre-line' },
                  }),
                },
                {
                  header: 'STATUS',
                  accessor: 'status',
                  flex: 2,
                  align: 'center',
                  render: (value, row) => buildText(String(value), {
                    size: 'xs',
                    weight: 'bold',
                    color: row.statusTextColor,
                    style: {
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      background: row.statusBg,
                    },
                  }),
                },
              ],
              data: [
                {
                  timestamp: 'Oct 24, 2023',
                  time: '09:42:15 AM',
                  user: 'Alexandria Johnson',
                  event: "Modified asset status for MBP-2023-004 from 'Active' to 'In Repair'.",
                  ip: '192.168.1.142',
                  status: 'Success',
                  statusBg: '#dbeafe',
                  statusTextColor: '#2563eb',
                },
                {
                  timestamp: 'Oct 24, 2023',
                  time: '08:15:02 AM',
                  user: 'System Daemon',
                  event: 'Automatic backup of warranty database completed successfully.',
                  ip: 'Internal\n(Loopback)',
                  status: 'Success',
                  statusBg: '#dbeafe',
                  statusTextColor: '#2563eb',
                },
                {
                  timestamp: 'Oct 23, 2023',
                  time: '11:59:44 PM',
                  user: 'Unauthorized User',
                  event: "Multiple failed login attempts detected for account 'sys_admin_prime'.",
                  ip: '45.22.190.11',
                  status: 'Blocked',
                  statusBg: '#dc2626',
                  statusTextColor: '#ffffff',
                },
                {
                  timestamp: 'Oct 23, 2023',
                  time: '04:30:10 PM',
                  user: 'Marcus Thorne',
                  event: 'Updated repair ticket #RT-99812: Replaced cooling fan in workstation.',
                  ip: '192.168.1.105',
                  status: 'Pending',
                  statusBg: '#e2e8f0',
                  statusTextColor: '#64748b',
                },
                {
                  timestamp: 'Oct 23, 2023',
                  time: '01:12:33 PM',
                  user: 'Elena Vance',
                  event: 'Password reset requested and fulfilled via multi-factor authentication.',
                  ip: '172.16.254.1',
                  status: 'Success',
                  statusBg: '#dbeafe',
                  statusTextColor: '#2563eb',
                },
              ],
              style: {
                borderRadius: '14px',
                border: '1px solid #e5e7eb',
              },
            })
        }
    })
}
