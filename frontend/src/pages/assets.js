import { h, ref, onMounted, computed } from 'vue'
import { buildBadge, buildButton, buildContentGrid, buildDropdown, buildGrid, buildHeader, buildIcon, buildIconContainer, buildPopup, buildSearch, buildTable, buildText, buildTextBadge } from '../ui/index.js'
import { AssetForm } from './form/AssetForm.js'

export function AssetsPage(user) {
  return {
    name: 'AssetsPage',
    setup() {
      const inventory = ref([])
      const users = ref([])
      const selectedCategory = ref(null)
      const selectedStatus = ref(null)
      const selectedExpiry = ref(null)
      const searchQuery = ref('')

      const isDialogOpen = ref(false)
      const activeAsset = ref(null)
      const formRef = ref(null)

      // Notification state
      const notification = ref({ isOpen: false, title: '', type: 'success' })
      const showDeleteConfirm = ref(false)

      const fetchData = async () => {
        try {
          const res = await fetch('/api/assets/inventory')
          inventory.value = await res.json()
        } catch (err) {
          console.error('Failed to fetch inventory:', err)
        }
      }

      const fetchUsers = async () => {
        try {
          let res = await fetch('http://127.0.0.1:5050/api/users')
          if (!res.ok) {
            // Fallback for environments using Vite proxy.
            res = await fetch('/api/users')
          }
          if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`)
          const list = await res.json()
          users.value = Array.isArray(list) ? list : []
          console.log('Users fetched:', users.value)
        } catch (err) {
          console.error('Failed to fetch users:', err)
          users.value = []
        }
      }

      const selectedOwnerId = ref(null)

      const assignItems = computed(() => [
        { text: 'Unassigned', value: null },
        ...((users.value && users.value.length > 0)
          ? users.value.map(u => ({ text: u.name, value: u.id }))
          : [{ text: 'Ruki Nasa', value: 1 }, { text: 'Rio Tsukasa', value: 2 }]),
      ])

      const isITDepartment = () => {
        const dept = String(user?.department || '').trim().toLowerCase()
        return dept === 'it' || dept.includes('it')
      }
      const canManageAssets = computed(() => isITDepartment())

      const filteredInventory = computed(() => {
        return inventory.value.filter(item => {
          if (!isITDepartment()) {
            const sameUserById = user?.id != null && Number(item.assigned_user_id) === Number(user.id)
            const sameUserByName = String(item.assigned_user_name || '').trim().toLowerCase() === String(user?.name || '').trim().toLowerCase()
            if (!sameUserById && !sameUserByName) return false
          }
          if (selectedCategory.value && item.category.toLowerCase() !== selectedCategory.value.toLowerCase()) return false
          if (selectedStatus.value && item.status.toLowerCase() !== selectedStatus.value.toLowerCase()) return false
          if (selectedExpiry.value === 'expired') {
            const expiryDate = new Date(item.warranty_expiry)
            if (expiryDate >= new Date()) return false
          }
          const q = String(searchQuery.value || '').trim().toLowerCase()
          if (q) {
            const haystack = [
              item.asset_id,
              item.category,
              item.serial_number,
              item.assigned_user_name,
            ].map(v => String(v || '').toLowerCase()).join(' ')
            if (!haystack.includes(q)) return false
          }
          return true
        })
      })

      const onRowClick = async (row) => {
        // Ensure dropdown items are loaded before opening modal.
        if (!users.value.length) {
          console.log('Fetching users before opening dialog...')
          await fetchUsers()
          console.log('Users after fetch:', users.value)
        }
        activeAsset.value = row
        selectedOwnerId.value = row?.assigned_user_id ?? null
        isDialogOpen.value = true
      }

      const handleFormSuccess = (result) => {
        const isDelete = result && result.deleted
        notification.value = {
          isOpen: true,
          title: isDelete ? 'Asset Permanently Deleted' : 'Asset Successfully Updated',
          type: isDelete ? 'delete' : 'update'
        }
        
        isDialogOpen.value = false
        activeAsset.value = null
        fetchData()

        // Auto-close notification after 2 seconds
        setTimeout(() => {
          notification.value.isOpen = false
        }, 2000)
      }

      const triggerUpdate = async () => {
        if (!canManageAssets.value) return
        if (activeAsset.value?.asset_id) {
          await fetch('/api/assets/assign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              asset_id: activeAsset.value.asset_id,
              user_id: selectedOwnerId.value,
            }),
          })
        }
        formRef.value?.submitForm()
      }
      
      const setSelectedOwnerId = (v) => {
        console.log('setSelectedOwnerId called with:', v)
        selectedOwnerId.value = v
      }
      
      const triggerDelete = () => { if (canManageAssets.value) showDeleteConfirm.value = true }
      const confirmDelete = () => {
        if (!canManageAssets.value) return
        showDeleteConfirm.value = false
        formRef.value?.deleteAsset()
      }

      onMounted(async () => {
        await Promise.all([fetchData(), fetchUsers()])
      })

      return {
        inventory, filteredInventory, selectedCategory, selectedStatus, selectedExpiry,
        searchQuery,
        canManageAssets,
        isDialogOpen, activeAsset, onRowClick, handleFormSuccess, formRef, triggerUpdate, triggerDelete,
        notification, showDeleteConfirm, confirmDelete, users, selectedOwnerId, assignItems, setSelectedOwnerId
      }
    },
    render(Ruki) {
      const categoryIconMap = { laptop: 'laptop', monitor: 'monitoring', tablet: 'assets', mobile: 'phone' }
      const statusColorMap = { assigned: 'success', available: 'info', maintenance: 'warning' }
      
      console.log('=== RENDER DEBUG ===')
      console.log('Ruki.users:', Ruki.users)
      console.log('Ruki.assignItems:', Ruki.assignItems)
      console.log('assignItems type:', typeof Ruki.assignItems)
      console.log('assignItems isArray:', Array.isArray(Ruki.assignItems))
      console.log('assignItems length:', Ruki.assignItems?.length)

      function onNewAssets() {
        if (typeof globalThis.__appNavigate === 'function') globalThis.__appNavigate('/newassetsform')
      }

      const mainContent = buildContentGrid({
        columns: 6, rows: 5, colGap: 12, rowGap: 12, padding: '24px', cellPadding: 0, display: false,
        span: { 1: { colSpan: 6, rowSpan: 2 }, 13: { colSpan: 6 }, 19: { colSpan: 6, rowSpan: 2 } },
        align: { 13: 'center', 19: 'start stretch' },
        child: {
          1: buildHeader({
            title: 'Asset Inventory',
            subtitle: "Manage and track your organization's IT physical infrastructure with precision.",
            actionText: Ruki.canManageAssets ? 'New Assets' : null,
            actionIcon: Ruki.canManageAssets ? buildIcon('plus', { size: 14, color: '#ffffff' }) : null,
            onAction: Ruki.canManageAssets ? onNewAssets : null, backgroundColor: 'transparent', divider: false, padding: '30px 24px 22px',
            style: { margin: '-24px 0 0 -24px', width: 'calc(100% + 48px)' },
          }),
          13: buildGrid({
            columns: 7, rows: 3, display: true, colGap: 10, rowGap: 6,
            span: { 1: { colSpan: 2 }, 3: { colSpan: 2 }, 5: { colSpan: 2 }, 8: { colSpan: 2 }, 10: { colSpan: 2 }, 12: { colSpan: 2 }, 15: { colSpan: 7 } },
            align: { 1: 'end left', 3: 'end left', 5: 'end left', 14: 'start center', 15: 'start center' },
            child: {
              1: buildText('ASSET CATEGORY', { variant: 'h6', color: 'gray400', weight: 'semibold', style: { marginLeft: '10px' } }),
              3: buildText('DEVICE STATUS', { variant: 'h6', color: 'gray400', weight: 'semibold', style: { marginLeft: '10px' } }),
              5: buildText('WARRANTY EXPIRY', { variant: 'h6', color: 'gray400', weight: 'semibold', style: { marginLeft: '10px' } }),
              8: buildDropdown({ placeholder: 'All Categories', items: [{ text: 'Laptop', value: 'laptop' }, { text: 'Monitor', value: 'monitor' }, { text: 'Tablet', value: 'tablet' }, { text: 'Desktop', value: 'desktop' }], value: Ruki.selectedCategory, onUpdate: (v) => Ruki.selectedCategory = v, showClearButton: true, width: '100%', height: '38px' }),
              10: buildDropdown({ placeholder: 'All Statuses', items: [{ text: 'Assigned', value: 'assigned' }, { text: 'Available', value: 'available' }, { text: 'Maintenance', value: 'maintenance' }], value: Ruki.selectedStatus, onUpdate: (v) => Ruki.selectedStatus = v, showClearButton: true, width: '100%', height: '38px' }),
              12: buildDropdown({ placeholder: 'Any Time', items: [{ text: 'Expired', value: 'expired' }, { text: 'Under Warranty', value: 'active' }], value: Ruki.selectedExpiry, onUpdate: (v) => Ruki.selectedExpiry = v, showClearButton: true, width: '100%', height: '38px' }),
              14: buildTextBadge('Clear', { variant: 'link', color: 'primary', size: 'sm', onPressed: () => { Ruki.selectedCategory = null; Ruki.selectedStatus = null; Ruki.selectedExpiry = null; Ruki.searchQuery = '' }, style: { marginTop: '7px', fontWeight: '700' } }),
              15: buildSearch({
                placeholder: 'Search asset ID, category, serial, or assigned user...',
                value: Ruki.searchQuery,
                onUpdate: (v) => { Ruki.searchQuery = v },
                clearable: true,
                width: '100%',
                height: '40px',
                showclearButton: true,
              }),
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
              { header: 'ASSIGNED TO', accessor: 'assigned_user_name', render: (val) => buildText(val ? String(val) : 'Unassigned', { size: 'sm', color: val ? 'gray700' : 'gray400' }) },
              { header: 'CURRENT STATUS', accessor: 'status', align: 'center', render: (val) => buildBadge(String(val).toUpperCase(), { color: statusColorMap[String(val).toLowerCase()] ?? 'neutral', variant: 'soft', size: 'sm', radius: 'full' }) },
            ],
            data: Ruki.filteredInventory,
            rowHover: true,
            onRowClick: Ruki.onRowClick,
            style: { backgroundColor: 'white', borderRadius: '14px' },
          }) : buildText('No assets found in inventory.', { size: 'lg', color: 'gray400', style: { padding: '120px 0', textAlign: 'center', width: '100%', backgroundColor: 'white', borderRadius: '14px' } }),
        },
      })

      const dialog = Ruki.isDialogOpen ? buildGrid({
        columns: 1, rows: 1, display: true, fillViewport: true,
        backgroundColor: 'rgba(15, 23, 42, 0.20)',
        style: {
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        },
        child: {
          1: buildGrid({
            columns: 1, rows: 3, padding: '24px', borderRadius: '24px', backgroundColor: '#ffffff',
            style: { width: '800px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
            rowGap: 16,
            child: {
              1: buildGrid({
                columns: 1, rows: 1, display: false, align: { 1: 'center left' },
                child: {
                  1: buildText(`Edit Asset: ${Ruki.activeAsset?.asset_id}`, { size: 'xl', weight: 'bold', color: '#111827' }),
                }
              }),
              2: h(AssetForm, {
                ref: 'formRef',
                mode: 'edit',
                initialData: Ruki.activeAsset,
                assignItems: Ruki.assignItems.value || Ruki.assignItems,
                assignedOwner: Ruki.selectedOwnerId,
                onAssignedOwnerUpdate: Ruki.setSelectedOwnerId,
                onSuccess: Ruki.handleFormSuccess,
                onCancel: () => { Ruki.isDialogOpen = false }
              }),
              3: buildGrid({
                columns: Ruki.canManageAssets ? 3 : 1, rows: 1, colGap: 10, display: false,
                child: {
                  ...(Ruki.canManageAssets
                    ? {
                        1: buildButton('Delete', { color: 'error', variant: 'outline', size: 'sm', onPressed: Ruki.triggerDelete, style: { width: '100%', height: '38px', fontWeight: '700' } }),
                        2: buildButton('Cancel', { variant: 'outline', color: 'neutral', size: 'sm', onPressed: () => { Ruki.isDialogOpen = false }, style: { width: '100%', height: '38px', fontWeight: '700' } }),
                        3: buildButton('Update', { color: 'primary', size: 'sm', onPressed: Ruki.triggerUpdate, style: { width: '100%', height: '38px', fontWeight: '700' } }),
                      }
                    : {
                        1: buildButton('Close', { variant: 'outline', color: 'neutral', size: 'sm', onPressed: () => { Ruki.isDialogOpen = false }, style: { width: '100%', height: '38px', fontWeight: '700' } }),
                      }),
                }
              })
            }
          })
        }
      }) : null

      const deleteConfirmDialog = Ruki.showDeleteConfirm ? buildGrid({
        columns: 1, rows: 1, display: true, fillViewport: true,
        style: {
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10002,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(8px)',
        },
        child: {
          1: buildGrid({
            columns: 1, rows: 3, padding: '32px', borderRadius: '24px', backgroundColor: '#ffffff',
            style: { width: '450px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' },
            rowGap: 16,
            child: {
              1: h('div', { style: { display: 'flex', justifyContent: 'center' } }, [
                buildIconContainer({ icon: 'warning', colorIcon: '#dc2626', colorCon: '#fee2e2', size: 64, radius: '20px' })
              ]),
              2: buildGrid({
                columns: 1, rows: 2, rowGap: 4,
                child: {
                  1: buildText('Confirm Deletion', { size: 'xl', weight: 'bold', color: '#111827' }),
                  2: buildText(`Are you sure you want to permanently remove asset ${Ruki.activeAsset?.asset_id}? This action cannot be undone.`, { size: 'sm', color: 'gray500' }),
                }
              }),
              3: buildGrid({
                columns: 2, rows: 1, colGap: 12,
                child: {
                  1: buildButton('Cancel', { variant: 'outline', color: 'neutral', onPressed: () => { Ruki.showDeleteConfirm = false }, style: { width: '100%', height: '44px', borderRadius: '12px', fontWeight: '700' } }),
                  2: buildButton('Permanently Delete', { color: 'error', onPressed: Ruki.confirmDelete, style: { width: '100%', height: '44px', borderRadius: '12px', fontWeight: '700' } }),
                }
              })
            }
          })
        }
      }) : null

      const notificationDialog = Ruki.notification.isOpen ? buildGrid({
        columns: 1, rows: 1, display: true, fillViewport: true,
        style: {
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10001,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(15, 23, 42, 0.15)',
          backdropFilter: 'blur(4px)',
        },
        child: {
          1: buildGrid({
            columns: 1, rows: 2, padding: '32px', borderRadius: '24px', backgroundColor: '#ffffff',
            style: { width: '400px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' },
            rowGap: 16,
            child: {
              1: h('div', { style: { display: 'flex', justifyContent: 'center' } }, [
                buildIconContainer({
                  icon: Ruki.notification.type === 'delete' ? 'trash' : 'circle-check',
                  colorIcon: Ruki.notification.type === 'delete' ? '#ef4444' : '#10b981',
                  colorCon: Ruki.notification.type === 'delete' ? '#fee2e2' : '#d1fae5',
                  size: 64,
                  radius: '20px',
                })
              ]),
              2: buildGrid({
                columns: 1, rows: 2, rowGap: 4,
                child: {
                  1: buildText(Ruki.notification.title, { size: 'xl', weight: 'bold', color: '#111827' }),
                  2: buildText(Ruki.notification.type === 'delete' ? 'The asset record has been removed from the central archival.' : 'All changes have been successfully committed to the database.', { size: 'sm', color: 'gray500' }),
                }
              })
            }
          })
        }
      }) : null

      return h('div', { style: { position: 'relative', width: '100%', height: '100%' } }, [
        mainContent,
        dialog,
        deleteConfirmDialog,
        notificationDialog
      ])
    }
  }
}
