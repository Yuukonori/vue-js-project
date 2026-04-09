import { buildBadge, buildButton, buildContentGrid, buildDropdown, buildGrid, buildHeader, buildIcon, buildPopup, buildTable, buildText } from '../ui/index.js'
import { ref } from 'vue'

const selectedCategory = ref('all')
const selectedStatus = ref('all')
const selectedExpiry = ref('all')

/**
 * AssetsPage(user)
 * @param {{ name: string }} user
 */
export function AssetsPage(user) {
  const assetData = [
    { id: '#AST-2024-001', category: 'Laptop', serial: 'SN-82910-XQ-202', years: '2.4 Years', purchase: 'Oct 12, 2021', expiry: 'Oct 12, 2024', status: 'Assigned' },
    { id: '#AST-2024-042', category: 'Monitor', serial: 'MON-77-P-001', years: '0.8 Years', purchase: 'May 20, 2023', expiry: 'May 20, 2026', status: 'Available' },
    { id: '#AST-2023-119', category: 'Tablet', serial: 'TAB-9002-K', years: '3.1 Years', purchase: 'Jan 15, 2021', expiry: 'Jan 15, 2024', status: 'Maintenance' },
    { id: '#AST-2024-088', category: 'Laptop', serial: 'SN-22241-LM-99', years: '1.2 Years', purchase: 'Feb 28, 2023', expiry: 'Feb 28, 2026', status: 'Assigned' },
    { id: '#AST-2024-009', category: 'Mobile', serial: 'IMEI-7712399', years: '0.2 Years', purchase: 'Nov 01, 2023', expiry: 'Nov 01, 2025', status: 'Available' },
  ]

  const categoryIconMap = {
    laptop: 'laptop',
    monitor: 'monitoring',
    tablet: 'assets',
    mobile: 'phone',
  }

  const statusColorMap = {
    assigned: 'success',
    available: 'info',
    maintenance: 'warning',
  }

  function onNewAssets() {
    if (typeof globalThis.__appNavigate === 'function') {
      globalThis.__appNavigate('/newassetsform')
    }
  }

  return buildContentGrid({
    columns: 6,
    rows: 5,
    colGap: 12,
    rowGap: 12,
    padding: '24px',
    cellPadding: 0,
    display: false,
    span: {
      1: { colSpan: 6, rowSpan: 2 },
      13: { colSpan: 6 },
      19: { colSpan: 6, rowSpan: 2 },
    },
    align: {
      13: 'center',
      19: 'start stretch',
    },
    child: {
      1: buildHeader({
        title: 'Asset Inventory',
        subtitle: "Manage and track your organization's IT physical infrastructure with precision. Access lifecycle data and maintenance schedules.",
        actionText: 'New Assets',
        actionIcon: buildIcon('plus', { size: 14, color: '#ffffff' }),
        onAction: onNewAssets,
        backgroundColor: 'white',
        divider: false,
        padding: '30px 24px 22px',
        style: {
          margin: '-24px 0 0 -24px',
          width: 'calc(100% + 48px)',
        },
      }),
      13: buildGrid({
        columns: 8,
        rows: 2,
        display: true,
        colGap: 10,
        rowGap: 6,
        span: {
          1: { colSpan: 2 },
          3: { colSpan: 2 },
          5: { colSpan: 2 },
          8: { colSpan: 2 },
          9: { colSpan: 2 },
          11: { colSpan: 2 },
          13: { colSpan: 2 },
          16: { colSpan: 2 },
        },
        align: {
            1: 'end left',
            3: 'end left',
            5: 'end left',
          16: 'end center',
        },
        child: {
          1: buildText('ASSET CATEGORY', { variant: 'h6', color: 'gray400', weight: 'semibold', letterSpacing: '0.8px', style: {marginLeft: '10px'}}),
          3: buildText('DEVICE STATUS', { variant: 'h6', color: 'gray400', weight: 'semibold', letterSpacing: '0.8px', style: {marginLeft: '10px'} }),
          5: buildText('WARRANTY EXPIRY', { variant: 'h6', color: 'gray400', weight: 'semibold', letterSpacing: '0.8px', style: {marginLeft: '10px'} }),
        //   8: buildText('Clear All', {
        //     size: 'sm',
        //     color: 'primary',
        //     weight: 'semibold',
        //     style: { cursor: 'pointer' },
        //   }),
          9: buildDropdown({
            placeholder: 'All Categories',
            items: [
              { text: 'All Categories', value: 'all' },
              { text: 'Laptop', value: 'laptop' },
              { text: 'Monitor', value: 'monitor' },
              { text: 'Tablet', value: 'tablet' },
              { text: 'Mobile', value: 'mobile' },
            ],
            value: selectedCategory,
            onUpdate: (val) => { selectedCategory.value = val },
            showClearButton: true,
            width: '100%',
            height: '38px',
          }),
          11: buildDropdown({
            placeholder: 'All Statuses',
            items: [
              { text: 'All Statuses', value: 'all' },
              { text: 'Assigned', value: 'assigned' },
              { text: 'Available', value: 'available' },
              { text: 'Maintenance', value: 'maintenance' },
            ],
            value: selectedStatus,
            onUpdate: (val) => { selectedStatus.value = val },
            showClearButton: true,
            width: '100%',
            height: '38px',
          }),
          13: buildDropdown({
            placeholder: 'Any Time',
            items: [
              { text: 'Any Time', value: 'all' },
              { text: 'Expiring in 30 Days', value: '30days' },
              { text: 'Expiring in 90 Days', value: '90days' },
              { text: 'Expired', value: 'expired' },
            ],
            value: selectedExpiry,
            onUpdate: (val) => { selectedExpiry.value = val },
            showClearButton: true,
            width: '100%',
            height: '38px',
          }),
        //   16: buildText('Clear All', {
        //     size: 'sm',
        //     color: 'primary',
        //     weight: 'semibold',
        //     style: { cursor: 'pointer' },
        //   }),
        },
      }),
      19: buildTable({
        columns: [
          {
            header: 'ASSET ID',
            accessor: 'id',
            render: (value) => buildText(String(value), { tag: 'span', size: 'sm', weight: 'bold', color: 'primary' }),
          },
          {
            header: 'CATEGORY',
            accessor: 'category',
            render: (value) => buildGrid({
              columns: 6,
              rows: 1,
              display: false,
              colGap: 6,
              span: {
                2: { colSpan: 5 },
              },
              align: {
                1: 'center',
                2: 'center left',
              },
              child: {
                1: buildIcon(categoryIconMap[String(value).toLowerCase()] ?? 'assets', { size: 14, color: 'gray400' }),
                2: buildText(String(value), { tag: 'span', size: 'sm', color: 'gray700' }),
              },
            }),
          },
          { header: 'SERIAL NUMBER', accessor: 'serial' },
          { header: 'SERVICE YEARS', accessor: 'years', align: 'center' },
          { header: 'PURCHASE DATE', accessor: 'purchase' },
          {
            header: 'WARRANTY EXPIRY',
            accessor: 'expiry',
            render: (value, row) => {
              const isWarning = String(row.status).toLowerCase() === 'maintenance'
              return buildText(String(value), {
                tag: 'span',
                color: isWarning ? 'error' : 'gray700',
                weight: isWarning ? 'semibold' : 'normal',
              })
            },
          },
          {
            header: 'CURRENT STATUS',
            accessor: 'status',
            align: 'center',
            render: (value) => buildBadge(String(value).toUpperCase(), {
              color: statusColorMap[String(value).toLowerCase()] ?? 'neutral',
              variant: 'soft',
              size: 'sm',
              radius: 'full',
            }),
          },
          {
            header: '',
            accessor: 'action',
            align: 'center',
            allowOverflow: true,
            render: (_, row) => buildPopup({
              triggerText: '⋮',
              items: [
                { text: 'Delete', value: 'delete' },
              ],
              onSelect: (val) => {
                if (val === 'delete') {
                  const ok = globalThis.confirm?.(`Delete asset ${row.id}?`)
                  if (ok) globalThis.alert?.(`Deleted ${row.id}`)
                }
              },
              width: '30px',
              height: '26px',
              menuWidth: '92px',
              radius: '8px',
              style: { margin: '0 auto' },
            }),
          },
        ],
        data: assetData,
        rowHover: true,
        onRowClick: () => {},
        style: {
          borderRadius: '14px',
          border: '1px solid #e5e7ee',
        },
      }),
    },
  })
}

