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
          const res = await fetch('/api/conn_1778809328809/inventory/showAssets')
          if (!res.ok) throw new Error(`Failed to fetch inventory: ${res.status}`)
          const body = await res.json()
          inventory.value = Array.isArray(body) ? body : (body.data || [])
        } catch (err) {
          console.error('Failed to fetch inventory:', err)
          inventory.value = []
        }
      }

      const fetchUsers = async () => {
        try {
          const res = await fetch('/api/conn_1778809328809/app_users/showUsers')
          if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`)
          const body = await res.json()
          const rawData = Array.isArray(body) ? body : (body.data || [])
          users.value = rawData.map(u => ({
            id: u.id,
            name: u.full_name || u.name,
            email: u.email
          }))
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
        const enriched = inventory.value.map(item => {
          if (item.assigned_user_name) return item
          const owner = users.value.find(u => Number(u.id) === Number(item.assigned_user_id))
          return { ...item, assigned_user_name: owner ? owner.name : null }
        })
        return enriched.filter(item => {
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
        if (!users.value.length) {
          await fetchUsers()
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

        setTimeout(() => {
          notification.value.isOpen = false
        }, 2000)
      }

      const setSelectedOwnerId = (v) => {
        selectedOwnerId.value = v
      }

      const confirmDelete = () => {
        showDeleteConfirm.value = false
        formRef.value?.deleteAsset()
      }

      onMounted(async () => {
        await Promise.all([fetchData(), fetchUsers()])
      })

      return () => {
        const categoryIconMap = { laptop: 'laptop', monitor: 'monitoring', tablet: 'assets', mobile: 'phone' }
        const statusColorMap = { assigned: 'success', available: 'info', maintenance: 'warning' }

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
              actionText: canManageAssets.value ? 'New Assets' : null,
              actionIcon: canManageAssets.value ? buildIcon('plus', { size: 14, color: '#ffffff' }) : null,
              onAction: canManageAssets.value ? onNewAssets : null, backgroundColor: 'transparent', divider: false, padding: '30px 24px 22px',
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
                8: buildDropdown({ placeholder: 'All Categories', items: [{ text: 'Laptop', value: 'laptop' }, { text: 'Monitor', value: 'monitor' }, { text: 'Tablet', value: 'tablet' }, { text: 'Desktop', value: 'desktop' }], value: selectedCategory.value, onUpdate: (v) => { selectedCategory.value = v }, showClearButton: true, width: '100%', height: '38px' }),
                10: buildDropdown({ placeholder: 'All Statuses', items: [{ text: 'Assigned', value: 'assigned' }, { text: 'Available', value: 'available' }, { text: 'Maintenance', value: 'maintenance' }], value: selectedStatus.value, onUpdate: (v) => { selectedStatus.value = v }, showClearButton: true, width: '100%', height: '38px' }),
                12: buildDropdown({ placeholder: 'Any Time', items: [{ text: 'Expired', value: 'expired' }, { text: 'Under Warranty', value: 'active' }], value: selectedExpiry.value, onUpdate: (v) => { selectedExpiry.value = v }, showClearButton: true, width: '100%', height: '38px' }),
                14: buildTextBadge('Clear', { variant: 'link', color: 'primary', size: 'sm', onPressed: () => { selectedCategory.value = null; selectedStatus.value = null; selectedExpiry.value = null; searchQuery.value = '' }, style: { marginTop: '7px', fontWeight: '700' } }),
                15: buildSearch({
                  placeholder: 'Search asset ID, category, serial, or assigned user...',
                  value: searchQuery.value,
                  onUpdate: (v) => { searchQuery.value = v },
                  clearable: true,
                  width: '100%',
                  height: '40px',
                  showclearButton: true,
                }),
              },
            }),
            19: filteredInventory.value.length > 0 ? buildTable({
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
              data: filteredInventory.value,
              rowHover: true,
              onRowClick,
              style: { backgroundColor: 'white', borderRadius: '14px' },
            }) : buildText('No assets found in inventory.', { size: 'lg', color: 'gray400', style: { padding: '120px 0', textAlign: 'center', width: '100%', backgroundColor: 'white', borderRadius: '14px', border: '1px solid #e2e8f0' } }),
          },
        })

        const dialog = isDialogOpen.value ? buildGrid({
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
              columns: 1, rows: 2, padding: '24px', borderRadius: '24px', backgroundColor: '#ffffff',
              style: { width: '800px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
              rowGap: 16,
              child: {
                1: buildGrid({
                  columns: 1, rows: 1, display: false, align: { 1: 'center left' },
                  child: {
                    1: buildText(`Edit Asset: ${activeAsset.value?.asset_id}`, { size: 'xl', weight: 'bold', color: '#111827' }),
                  }
                }),
                2: h(AssetForm, {
                  ref: (el) => { if (el) formRef.value = el },
                  mode: 'edit',
                  initialData: activeAsset.value,
                  assignItems: assignItems.value,
                  assignedOwner: selectedOwnerId.value,
                  onAssignedOwnerUpdate: setSelectedOwnerId,
                  onSuccess: handleFormSuccess,
                  canManageAssets: canManageAssets.value,
                  onCancel: () => { isDialogOpen.value = false },
                  onDelete: () => { showDeleteConfirm.value = true }
                }),
              }
            })
          }
        }) : null

        const deleteConfirmDialog = showDeleteConfirm.value ? buildGrid({
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
                  columns: 1, rows: 2, rowGap: 4, display: false,
                  child: {
                    1: buildText('Confirm Deletion', { size: 'xl', weight: 'bold', color: '#111827' }),
                    2: buildText(`Are you sure you want to permanently remove asset ${activeAsset.value?.asset_id}? This action cannot be undone.`, { size: 'sm', color: 'gray500' }),
                  }
                }),
                3: buildGrid({
                  columns: 2, rows: 1, colGap: 12, display: false,
                  child: {
                    1: buildButton('Cancel', { variant: 'outline', color: 'neutral', onPressed: () => { showDeleteConfirm.value = false }, style: { width: '100%', height: '44px', borderRadius: '12px', fontWeight: '700' } }),
                    2: buildButton('Permanently Delete', { color: 'error', onPressed: confirmDelete, style: { width: '100%', height: '44px', borderRadius: '12px', fontWeight: '700' } }),
                  }
                })
              }
            })
          }
        }) : null

        const notificationDialog = notification.value.isOpen ? buildGrid({
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
                    icon: notification.value.type === 'delete' ? 'trash' : 'circle-check',
                    colorIcon: notification.value.type === 'delete' ? '#ef4444' : '#10b981',
                    colorCon: notification.value.type === 'delete' ? '#fee2e2' : '#d1fae5',
                    size: 64,
                    radius: '20px',
                  })
                ]),
                2: buildGrid({
                  columns: 1, rows: 2, rowGap: 4, display: false,
                  child: {
                    1: buildText(notification.value.title, { size: 'xl', weight: 'bold', color: '#111827' }),
                    2: buildText(notification.value.type === 'delete' ? 'The asset record has been removed from the central archival.' : 'All changes have been successfully committed to the database.', { size: 'sm', color: 'gray500' }),
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
}
