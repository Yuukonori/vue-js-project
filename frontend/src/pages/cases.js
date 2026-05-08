import { computed, onMounted, ref } from 'vue'
import { buildBadge, buildButton, buildContentGrid, buildDropdown, buildGrid, buildHeader, buildInput, buildTable, buildTapOption, buildText } from '../ui/index.js'

export function CasesPage() {
  return {
    name: 'CasesPage',
    setup() {
      const selectedCaseFilter = ref('pending')
      const cases = ref([])
      const isLoading = ref(false)
      const editOpen = ref(false)
      const editingId = ref('')
      const editCategory = ref('hardware')
      const editPriority = ref('low')
      const editSubject = ref('')
      const editAssetTag = ref('')
      const editDescription = ref('')
      const editStatus = ref('PENDING')
      const isSaving = ref(false)
      const isDeleting = ref(false)
      const formError = ref('')
      const showDeleteConfirm = ref(false)
      const showUpdateSuccess = ref(false)

      const statusItems = [
        { text: 'Pending', value: 'PENDING' },
        { text: 'In Progress', value: 'IN PROGRESS' },
        { text: 'Urgent', value: 'URGENT' },
        { text: 'Resolved', value: 'RESOLVED' },
        { text: 'Completed', value: 'COMPLETED' },
      ]
      const categoryItems = [
        { text: 'Hardware', value: 'hardware' },
        { text: 'Software', value: 'software' },
        { text: 'Network', value: 'network' },
      ]
      const priorityItems = [
        { text: 'Low', value: 'low' },
        { text: 'Medium', value: 'medium' },
        { text: 'High', value: 'high' },
      ]

      const isDoneStatus = (status) => {
        const normalized = String(status || '').trim().toLowerCase()
        return normalized === 'resolved' || normalized === 'completed' || normalized === 'done' || normalized === 'closed'
      }

      const filteredCases = computed(() => {
        if (selectedCaseFilter.value === 'done') {
          return cases.value.filter((row) => isDoneStatus(row.status))
        }
        return cases.value.filter((row) => !isDoneStatus(row.status))
      })

      const fetchCases = async () => {
        isLoading.value = true
        try {
          const readTickets = async (url) => {
            const res = await fetch(url)
            const raw = await res.text()
            if (!res.ok) throw new Error(`Request failed: ${res.status}`)
            return raw ? JSON.parse(raw) : []
          }

          let data = []
          try {
            data = await readTickets('/api/repair/tickets')
          } catch {
            data = await readTickets('http://127.0.0.1:5050/api/repair/tickets')
          }

          cases.value = Array.isArray(data) ? data : []
        } catch (err) {
          console.error('Failed to fetch cases:', err)
          cases.value = []
        } finally {
          isLoading.value = false
        }
      }

      const apiWithFallback = async (path, options = {}) => {
        const tryOne = async (url) => {
          const res = await fetch(url, options)
          const raw = await res.text()
          let data = {}
          try { data = raw ? JSON.parse(raw) : {} } catch { data = { error: raw || 'Invalid server response' } }
          if (!res.ok) throw new Error(data?.error || `Request failed: ${res.status}`)
          return data
        }

        try {
          return await tryOne(path)
        } catch {
          return await tryOne(`http://127.0.0.1:5050${path}`)
        }
      }

      const openEdit = (row) => {
        editingId.value = String(row?.ticket_id || '')
        editCategory.value = String(row?.category || 'hardware').toLowerCase()
        editPriority.value = String(row?.priority || 'low').toLowerCase()
        editSubject.value = String(row?.subject || '')
        editAssetTag.value = String(row?.asset_tag || '')
        editDescription.value = String(row?.description || '')
        editStatus.value = String(row?.status || 'PENDING').toUpperCase()
        formError.value = ''
        editOpen.value = true
      }

      const closeEdit = () => {
        editOpen.value = false
        formError.value = ''
        showDeleteConfirm.value = false
      }

      const saveEdit = async () => {
        if (!editingId.value || !editSubject.value.trim()) {
          formError.value = 'Subject is required.'
          return
        }
        isSaving.value = true
        formError.value = ''
        try {
          const updated = await apiWithFallback(`/api/repair/tickets/${encodeURIComponent(editingId.value)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              category: editCategory.value,
              priority: editPriority.value,
              subject: editSubject.value.trim(),
              assetTag: editAssetTag.value.trim(),
              description: editDescription.value.trim(),
              status: editStatus.value,
            }),
          })
          cases.value = cases.value.map((row) =>
            String(row.ticket_id) === String(updated.ticket_id) ? updated : row
          )
          selectedCaseFilter.value = isDoneStatus(updated.status) ? 'done' : 'pending'
          showUpdateSuccess.value = true
          setTimeout(() => {
            showUpdateSuccess.value = false
            closeEdit()
          }, 1400)
        } catch (err) {
          formError.value = err?.message || 'Failed to update ticket.'
        } finally {
          isSaving.value = false
        }
      }

      const deleteCase = async () => {
        if (!editingId.value) return
        isDeleting.value = true
        formError.value = ''
        try {
          await apiWithFallback(`/api/repair/tickets/${encodeURIComponent(editingId.value)}`, {
            method: 'DELETE',
          })
          cases.value = cases.value.filter(
            (row) => String(row.ticket_id) !== String(editingId.value)
          )
          closeEdit()
        } catch (err) {
          formError.value = err?.message || 'Failed to delete ticket.'
        } finally {
          isDeleting.value = false
          showDeleteConfirm.value = false
        }
      }

      onMounted(fetchCases)

      return () => {
        const page = buildContentGrid({
        columns: 1,
        rows: 2,
        padding: '24px',
        rowGap: 12,
        display: false,
        child: {
          1: buildHeader({
            title: 'Cases',
            subtitle: 'Track and manage case activities across users, assets, and companies.',
            backgroundColor: 'white',
            divider: false,
            padding: '30px 24px 22px',
            style: { margin: '-24px 0 0 -24px', width: 'calc(100% + 48px)' },
          }),
          2: buildGrid({
            columns: 1,
            rows: 2,
            display: false,
            rowGap: 10,
            padding: '16px',
            border: '1px solid #e2e8f0',
            radius: 12,
            backgroundColor: '#ffffff',
            child: {
              1: buildTapOption({
                items: [
                  { label: 'Case Not Yet Done', value: 'pending' },
                  { label: 'Case Done', value: 'done' },
                ],
                value: selectedCaseFilter,
                onUpdate: (val) => { selectedCaseFilter.value = val },
                height: '38px',
                bg: '#eff6ff',
                selectedBg: '#ffffff',
                selectedColor: '#1d4ed8',
                color: '#64748b',
                style: { border: '1px solid #bfdbfe' },
              }),
              2: isLoading.value
                ? buildText('Loading cases...', { size: 'sm', color: 'gray500' })
                : buildTable({
                    columns: [
                      { header: 'TICKET ID', accessor: 'ticket_id', render: (val) => buildText(String(val || ''), { size: 'sm', color: 'primary', weight: 'semibold' }) },
                      { header: 'SUBJECT', accessor: 'subject' },
                      {
                        header: 'STATUS',
                        accessor: 'status',
                        align: 'center',
                        render: (val) => {
                          const text = String(val || '').toUpperCase()
                          const badgeColor = isDoneStatus(val) ? 'success' : 'warning'
                          return buildBadge(text, { color: badgeColor, variant: 'soft', size: 'sm', radius: 'full' })
                        },
                      },
                      { header: 'UPDATED', accessor: 'updated_at', align: 'center', render: (val) => (val ? new Date(val).toLocaleDateString() : '') },
                    ],
                    data: filteredCases.value,
                    onRowClick: (row) => openEdit(row),
                    emptyText: selectedCaseFilter.value === 'done' ? 'No finished cases found.' : 'No unfinished cases found.',
                  }),
            },
          }),
        },
      })

        const editModal = editOpen.value ? buildGrid({
          columns: 1,
          rows: 1,
          display: false,
          fillViewport: true,
          style: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 10020,
            backgroundColor: 'rgba(15, 23, 42, 0.28)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          child: {
            1: buildGrid({
              columns: 1,
              rows: 10,
              display: true,
              rowGap: 10,
              padding: '22px',
              radius: 14,
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              style: { width: '520px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' },
              child: {
                1: buildText(`Edit Ticket: ${editingId.value}`, { size: 'lg', weight: 'bold', color: 'gray800' }),
                2: buildGrid({
                  columns: 2,
                  rows: 2,
                  colGap: 8,
                  rowGap: 6,
                  display: false,
                  child: {
                    1: buildText('TICKET CATEGORY', { size: 'xs', weight: 'bold', color: 'gray700' }),
                    2: buildText('PRIORITY LEVEL', { size: 'xs', weight: 'bold', color: 'gray700' }),
                    3: buildDropdown({ items: categoryItems, value: editCategory, onUpdate: (v) => { editCategory.value = v }, width: '100%', height: '40px' }),
                    4: buildDropdown({ items: priorityItems, value: editPriority, onUpdate: (v) => { editPriority.value = v }, width: '100%', height: '40px' }),
                  },
                }),
                3: buildGrid({
                  columns: 1,
                  rows: 1,
                  display: false,
                  child: {
                    1: buildInput({ label: 'SUBJECT TITLE', value: editSubject, onUpdate: (v) => { editSubject.value = v }, full: true }),
                  },
                }),
                4: buildGrid({
                  columns: 1,
                  rows: 1,
                  display: false,
                  child: {
                    1: buildInput({ label: 'ASSET TAG/ID (OPTIONAL)', value: editAssetTag, onUpdate: (v) => { editAssetTag.value = v }, full: true }),
                  },
                }),
                5: buildGrid({
                  columns: 1,
                  rows: 1,
                  display: false,
                  child: {
                    1: buildInput({ label: 'DESCRIPTION', type: 'textarea', rows: 3, value: editDescription, onUpdate: (v) => { editDescription.value = v }, full: true }),
                  },
                }),
                6: buildGrid({
                  columns: 1,
                  rows: 2,
                  rowGap: 6,
                  display: false,
                  child: {
                    1: buildText('STATUS', { size: 'xs', weight: 'bold', color: 'gray700' }),
                    2: buildDropdown({ items: statusItems, value: editStatus, onUpdate: (v) => { editStatus.value = v }, width: '100%', height: '40px' }),
                  },
                }),
                7: formError.value ? buildText(formError.value, { size: 'sm', color: 'error' }) : buildText('', { size: 'sm' }),
                8: buildGrid({
                  columns: 3,
                  rows: 1,
                  colGap: 8,
                  display: false,
                  child: {
                    1: buildButton('Delete', { color: 'error', variant: 'outline', onPressed: () => { showDeleteConfirm.value = true }, style: { width: '100%', height: '38px', fontWeight: '700' } }),
                    2: buildButton('Cancel', { variant: 'outline', onPressed: closeEdit, style: { width: '100%', height: '38px', fontWeight: '700' } }),
                    3: buildButton(isSaving.value ? 'Updating...' : 'Update', { onPressed: saveEdit, style: { width: '100%', height: '38px', fontWeight: '700' } }),
                  },
                }),
                9: (isDeleting.value || isSaving.value)
                  ? buildText(isDeleting.value ? 'Deleting ticket...' : 'Updating ticket...', { size: 'xs', color: 'gray500' })
                  : buildText('', { size: 'xs' }),
                10: buildText('', { size: 'xs' }),
              },
            }),
          },
        }) : null

        const deleteConfirmModal = showDeleteConfirm.value ? buildGrid({
          columns: 1,
          rows: 1,
          display: true,
          fillViewport: true,
          style: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 10040,
            backgroundColor: 'rgba(15, 23, 42, 0.32)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          child: {
            1: buildGrid({
              columns: 1,
              rows: 3,
              display: false,
              rowGap: 12,
              padding: '22px',
              radius: 14,
              backgroundColor: '#ffffff',
              style: { width: '420px', boxShadow: '0 16px 30px rgba(0,0,0,0.2)' },
              child: {
                1: buildText('Delete this ticket?', { size: 'xl', weight: 'bold', color: 'gray800' }),
                2: buildText(`Ticket ${editingId.value} will be permanently removed.`, { size: 'sm', color: 'gray600' }),
                3: buildGrid({
                  columns: 2,
                  rows: 1,
                  colGap: 8,
                  display: false,
                  child: {
                    1: buildButton('Cancel', { variant: 'outline', onPressed: () => { showDeleteConfirm.value = false }, style: { width: '100%', height: '38px', fontWeight: '700' } }),
                    2: buildButton(isDeleting.value ? 'Deleting...' : 'Yes, Delete', { color: 'error', onPressed: deleteCase, style: { width: '100%', height: '38px', fontWeight: '700' } }),
                  },
                }),
              },
            }),
          },
        }) : null

        const updateSuccessModal = showUpdateSuccess.value ? buildGrid({
          columns: 1,
          rows: 1,
          display: true,
          fillViewport: true,
          style: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 10050,
            backgroundColor: 'rgba(15, 23, 42, 0.24)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          child: {
            1: buildGrid({
              columns: 1,
              rows: 3,
              display: true,
              rowGap: 14,
              padding: '30px',
              radius: 18,
              backgroundColor: '#ffffff',
              style: { width: '360px', textAlign: 'center', boxShadow: '0 16px 30px rgba(0,0,0,0.2)' },
              child: {
                1: buildText('Success!', { size: '3xl', weight: 'bold', color: '#111827' }),
                2: buildText('Ticket updated successfully.', { size: 'md', color: '#4b5563' }),
                3: buildText(`Ticket ID: ${editingId.value}`, { size: 'sm', color: '#6b7280' }),
              },
            }),
          },
        }) : null

        return buildGrid({
          columns: 1,
          rows: 4,
          display: false,
          child: {
            1: page,
            2: editModal,
            3: deleteConfirmModal,
            4: updateSuccessModal,
          },
        })
      }
    }
  }
}
