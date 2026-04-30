import { h, ref, onMounted, computed } from 'vue'
import { buildBadge, buildButton, buildContentGrid, buildDropdown, buildGrid, buildHeader, buildIcon, buildPopup, buildTable, buildText, buildTextBadge } from '../ui/index.js'

export function AssetsPage(user) {
  return {
    name: 'AssetsPage',
    setup() {
      const inventory = ref([])
      const selectedCategory = ref(null)
      const selectedStatus = ref(null)
      const selectedExpiry = ref(null)

      const fetchData = async () => {
        try {
          const res = await fetch('/api/assets/inventory')
          inventory.value = await res.json()
        } catch (err) {
          console.error('Failed to fetch inventory:', err)
        }
      }

      const filteredInventory = computed(() => {
        return inventory.value.filter(item => {
          // Category filter
          if (selectedCategory.value && item.category.toLowerCase() !== selectedCategory.value.toLowerCase()) {
            return false
          }
          // Status filter
          if (selectedStatus.value && item.status.toLowerCase() !== selectedStatus.value.toLowerCase()) {
            return false
          }
          // Expiry filter
          if (selectedExpiry.value === 'expired') {
            const expiryDate = new Date(item.warranty_expiry)
            if (expiryDate >= new Date()) return false
          }
          return true
        })
      })

      onMounted(fetchData)

      return { inventory, filteredInventory, selectedCategory, selectedStatus, selectedExpiry }
    },
    render(Ruki) {
      const categoryIconMap = { laptop: 'laptop', monitor: 'monitoring', tablet: 'assets', mobile: 'phone' }
      const statusColorMap = { assigned: 'success', available: 'info', maintenance: 'warning' }

      function onNewAssets() {
        if (typeof globalThis.__appNavigate === 'function') globalThis.__appNavigate('/newassetsform')
      }

      return buildContentGrid({
        columns: 6, rows: 5, colGap: 12, rowGap: 12, padding: '24px', cellPadding: 0, display: false,
        span: { 1: { colSpan: 6, rowSpan: 2 }, 13: { colSpan: 6 }, 19: { colSpan: 6, rowSpan: 2 } },
        align: { 13: 'center', 19: 'start stretch' },
        child: {
          1: buildHeader({
            title: 'Asset Inventory',
            subtitle: "Manage and track your organization's IT physical infrastructure with precision.",
            actionText: 'New Assets', actionIcon: buildIcon('plus', { size: 14, color: '#ffffff' }),
            onAction: onNewAssets, backgroundColor: 'white', divider: false, padding: '30px 24px 22px',
            style: { margin: '-24px 0 0 -24px', width: 'calc(100% + 48px)' },
          }),
          13: buildGrid({
            columns: 7, rows: 2, display: true, colGap: 10, rowGap: 6,
            span: { 1: { colSpan: 2 }, 3: { colSpan: 2 }, 5: { colSpan: 2 }, 8: { colSpan: 2 }, 10: { colSpan: 2 }, 12: { colSpan: 2 } },
            align: { 1: 'end left', 3: 'end left', 5: 'end left', 14: 'start center' },
            child: {
              1: buildText('ASSET CATEGORY', { variant: 'h6', color: 'gray400', weight: 'semibold', style: { marginLeft: '10px' } }),
              3: buildText('DEVICE STATUS', { variant: 'h6', color: 'gray400', weight: 'semibold', style: { marginLeft: '10px' } }),
              5: buildText('WARRANTY EXPIRY', { variant: 'h6', color: 'gray400', weight: 'semibold', style: { marginLeft: '10px' } }),
              8: buildDropdown({ placeholder: 'All Categories', items: [{ text: 'Laptop', value: 'laptop' }, { text: 'Monitor', value: 'monitor' }, { text: 'Tablet', value: 'tablet' }, { text: 'Desktop', value: 'desktop' }], value: Ruki.selectedCategory, onUpdate: (v) => Ruki.selectedCategory = v, showClearButton: true, width: '100%', height: '38px' }),
              10: buildDropdown({ placeholder: 'All Statuses', items: [{ text: 'Assigned', value: 'assigned' }, { text: 'Available', value: 'available' }, { text: 'Maintenance', value: 'maintenance' }], value: Ruki.selectedStatus, onUpdate: (v) => Ruki.selectedStatus = v, showClearButton: true, width: '100%', height: '38px' }),
              12: buildDropdown({ placeholder: 'Any Time', items: [{ text: 'Expired', value: 'expired' }, { text: 'Under Warranty', value: 'active' }], value: Ruki.selectedExpiry, onUpdate: (v) => Ruki.selectedExpiry = v, showClearButton: true, width: '100%', height: '38px' }),
              14: buildTextBadge('Clear', { variant: 'link', color: 'primary', size: 'sm', onPressed: () => { Ruki.selectedCategory = null; Ruki.selectedStatus = null; Ruki.selectedExpiry = null }, style: { marginTop: '7px', fontWeight: '700' } }),
            },
          }),
          19: Ruki.filteredInventory.length > 0 ? buildTable({
            columns: [
              { header: 'ASSET ID', accessor: 'asset_id', render: (val) => buildText(String(val), { tag: 'span', size: 'sm', weight: 'bold', color: 'primary' }) },
              { header: 'CATEGORY', accessor: 'category', render: (val) => buildGrid({ columns: 6, rows: 1, display: false, colGap: 6, span: { 2: { colSpan: 5 } }, align: { 1: 'center', 2: 'center left' }, child: { 1: buildIcon(categoryIconMap[String(val).toLowerCase()] ?? 'assets', { size: 14, color: 'gray400' }), 2: buildText(String(val), { tag: 'span', size: 'sm', color: 'gray700' }) } }) },
              { header: 'SERIAL NUMBER', accessor: 'serial_number' },
              { header: 'SERVICE YEARS', accessor: 'service_years', align: 'center' },
              { header: 'PURCHASE DATE', accessor: 'purchase_date', render: (val) => val ? new Date(val).toLocaleDateString() : '' },
              { header: 'WARRANTY EXPIRY', accessor: 'warranty_expiry', render: (val) => val ? new Date(val).toLocaleDateString() : '' },
              { header: 'CURRENT STATUS', accessor: 'status', align: 'center', render: (val) => buildBadge(String(val).toUpperCase(), { color: statusColorMap[String(val).toLowerCase()] ?? 'neutral', variant: 'soft', size: 'sm', radius: 'full' }) },
            ],
            data: Ruki.filteredInventory,
            rowHover: true,
            style: { backgroundColor: 'white', borderRadius: '14px' },
          }) : buildText('No assets found in inventory.', { size: 'lg', color: 'gray400', style: { padding: '120px 0', textAlign: 'center', width: '100%', backgroundColor: 'white', borderRadius: '14px' } }),
        },
      })
    }
  }
}
