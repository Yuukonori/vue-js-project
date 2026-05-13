import { computed, onMounted, ref, h } from 'vue'
import { buildBadge, buildButton, buildContentGrid, buildDropdown, buildFileUpload, buildGrid, buildHeader, buildInput, buildTable, buildTapOption, buildText } from '../ui/index.js'

export function CasesPage(user) {
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
      const editSubmittedBy = ref('')
      const editStatus = ref('PENDING')
      const editPreparedBy = ref('')
      const isSaving = ref(false)
      const isDeleting = ref(false)
      const formError = ref('')
      const showDeleteConfirm = ref(false)
      const showUpdateSuccess = ref(false)
      const selectedUploadFiles = ref([])

      const statusItems = [
        { text: 'Pending', value: 'PENDING' },
        { text: 'In Progress', value: 'IN PROGRESS' },
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
      const preparedByItems = [
        { text: 'Unassigned', value: '' },
        { text: 'Visal', value: 'Visal' },
        { text: 'Piseth', value: 'Piseth' },
        { text: 'Pong', value: 'Pong' },
        { text: 'Tykea', value: 'Tykea' },
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
          const data = await apiFetch('/api/repair/tickets')

          let tickets = Array.isArray(data) ? data : []

          // Filter tickets based on feature permission
          const canSeeAllTickets = user.allowedFeatures?.includes('all_tickets')
          if (!canSeeAllTickets) {
            tickets = tickets.filter(t => t.submitted_by_id === user.id || t.user_id === user.id)
          }
          cases.value = tickets
        } catch (err) {
          console.error('Failed to fetch cases:', err)
          cases.value = []
        } finally {
          isLoading.value = false
        }
      }

      const apiFetch = async (path, options = {}) => {
        const res = await fetch(path, options)
        const raw = await res.text()
        let data = {}
        try { data = raw ? JSON.parse(raw) : {} } catch { data = { error: raw || 'Invalid server response' } }
        if (!res.ok) throw new Error(data?.error || `Request failed: ${res.status}`)
        return data
      }

      const openEdit = (row) => {
        console.log('Opening edit for ticket:', row?.ticket_id)
        editingId.value = String(row?.ticket_id || '')
        editCategory.value = String(row?.category || 'hardware').toLowerCase()
        editPriority.value = String(row?.priority || 'low').toLowerCase()
        editSubject.value = String(row?.subject || '')
        editAssetTag.value = String(row?.asset_tag || '')
        editDescription.value = String(row?.description || '')
        editSubmittedBy.value = String(row?.submitted_by_name || 'Unknown')
        editStatus.value = String(row?.status || 'PENDING').toUpperCase()
        editPreparedBy.value = String(row?.prepared_by || '')
        let evidenceData = []
        try {
          evidenceData = typeof row?.evidence === 'string' ? JSON.parse(row.evidence) : (Array.isArray(row?.evidence) ? row.evidence : [])
        } catch (e) {
          evidenceData = []
        }
        selectedUploadFiles.value = evidenceData
        formError.value = ''
        editOpen.value = true
      }

      const closeEdit = () => {
        editOpen.value = false
        formError.value = ''
        selectedUploadFiles.value = []
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
          const payload = {
            category: editCategory.value,
            priority: editPriority.value,
            subject: editSubject.value.trim(),
            assetTag: editAssetTag.value.trim(),
            description: editDescription.value.trim(),
            status: editStatus.value,
            preparedBy: editPreparedBy.value,
            evidence: selectedUploadFiles.value,
          }
          console.log('[DEBUG] Saving ticket with evidence:', payload.evidence)
          const updated = await apiFetch(`/api/repair/tickets/${encodeURIComponent(editingId.value)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
          console.log('[DEBUG] Update response:', updated)
          cases.value = cases.value.map((row) =>
            String(row.ticket_id) === String(updated.ticket_id) ? { ...row, ...updated } : row
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
          await apiFetch(`/api/repair/tickets/${encodeURIComponent(editingId.value)}`, {
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

      return {
        selectedCaseFilter, cases, isLoading, editOpen, editingId, editCategory, editPriority,
        editSubject, editAssetTag, editDescription, editSubmittedBy, editStatus, editPreparedBy,
        isSaving, isDeleting, formError, showDeleteConfirm, showUpdateSuccess, selectedUploadFiles,
        categoryItems, priorityItems, preparedByItems, statusItems,
        fetchCases, openEdit, closeEdit, saveEdit, deleteCase
      }
    },
    render(ctx) {
      const isDoneStatus = (status) => {
        const normalized = String(status || '').trim().toLowerCase()
        return normalized === 'resolved' || normalized === 'completed' || normalized === 'done' || normalized === 'closed'
      }

      let filteredCases = []
      if (ctx.selectedCaseFilter === 'done') {
        filteredCases = ctx.cases.filter(r => isDoneStatus(r.status))
      } else if (ctx.selectedCaseFilter === 'pending') {
        filteredCases = ctx.cases.filter(r => !isDoneStatus(r.status))
      } else {
        filteredCases = ctx.cases
      }

      // Sort by Ticket ID ascending
      filteredCases = [...filteredCases].sort((a, b) => {
        const idA = Number(a.ticket_id) || 0
        const idB = Number(b.ticket_id) || 0
        return idA - idB
      })

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
            backgroundColor: 'transparent',
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
                  { label: 'All Cases', value: 'all' },
                ],
                value: ctx.selectedCaseFilter,
                onUpdate: (val) => { ctx.selectedCaseFilter = val },
                height: '38px',
                bg: '#eff6ff',
                selectedBg: '#ffffff',
                selectedColor: '#1d4ed8',
                color: '#64748b',
                style: { border: '1px solid #bfdbfe' },
              }),
              2: ctx.isLoading
                ? buildText('Loading cases...', { size: 'sm', color: 'gray500' })
                : buildTable({
                  columns: [
                    { header: 'TICKET ID', accessor: 'ticket_id', render: (val) => buildText(String(val || ''), { size: 'sm', color: 'primary', weight: 'semibold' }) },
                    { header: 'SUBJECT', accessor: 'subject' },
                    { header: 'SUBMITTED BY', accessor: 'submitted_by_name', render: (val) => buildText(val || 'Unknown', { size: 'sm', color: 'gray700' }) },
                    { header: 'PREPARED BY', accessor: 'prepared_by', render: (val) => buildText(val || '-', { size: 'sm', color: 'gray600' }) },
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
                  data: filteredCases,
                  onPressed: (row) => ctx.openEdit(row),
                  emptyText: ctx.selectedCaseFilter === 'done' ? 'No finished cases found.' : (ctx.selectedCaseFilter === 'all' ? 'No cases found.' : 'No unfinished cases found.'),
                }),
            },
          }),
        },
      })

      const editModal = ctx.editOpen ? buildGrid({
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
              1: buildText(`Edit Ticket: ${ctx.editingId}`, { size: 'lg', weight: 'bold', color: 'gray800' }),
              2: buildGrid({
                columns: 2,
                rows: 2,
                colGap: 8,
                rowGap: 6,
                display: false,
                child: {
                  1: buildText('TICKET CATEGORY', { size: 'xs', weight: 'bold', color: 'gray700' }),
                  2: buildText('PRIORITY LEVEL', { size: 'xs', weight: 'bold', color: 'gray700' }),
                  3: buildDropdown({ items: ctx.categoryItems, value: ctx.editCategory, onUpdate: (v) => { ctx.editCategory = v }, width: '100%', height: '40px' }),
                  4: buildDropdown({ items: ctx.priorityItems, value: ctx.editPriority, onUpdate: (v) => { ctx.editPriority = v }, width: '100%', height: '40px' }),
                },
              }),
              3: buildInput({ label: 'SUBJECT TITLE', value: ctx.editSubject, onUpdate: (v) => { ctx.editSubject = v }, full: true }),
              4: buildInput({ label: 'ASSET TAG/ID (OPTIONAL)', value: ctx.editAssetTag, onUpdate: (v) => { ctx.editAssetTag = v }, full: true }),
              5: buildInput({ label: 'DESCRIPTION', type: 'textarea', rows: 3, value: ctx.editDescription, onUpdate: (v) => { ctx.editDescription = v }, full: true }),
              6: buildGrid({
                columns: 1, rows: 2, rowGap: 6, display: false,
                child: {
                  1: buildText('SUBMITTED BY', { size: 'xs', weight: 'bold', color: 'gray700' }),
                  2: buildText(ctx.editSubmittedBy, { size: 'sm', color: 'gray600', style: { padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' } }),
                }
              }),
              7: buildGrid({
                columns: 2,
                rows: 2,
                rowGap: 6,
                colGap: 16,
                display: false,
                child: {
                  1: buildText('STATUS', { size: 'xs', weight: 'bold', color: 'gray700' }),
                  2: buildText('PREPARED BY (IT)', { size: 'xs', weight: 'bold', color: 'gray700' }),
                  3: buildDropdown({ items: ctx.statusItems, value: ctx.editStatus, onUpdate: (v) => { ctx.editStatus = v }, width: '100%', height: '40px' }),
                  4: buildDropdown({ items: ctx.preparedByItems, value: ctx.editPreparedBy, onUpdate: (v) => { ctx.editPreparedBy = v }, width: '100%', height: '40px' }),
                },
              }),
              8: buildFileUpload({
                title: 'EVIDENCE / LOGS',
                hint: 'Drag and drop diagnostic logs or screenshots here',
                maxSizeText: 'MAX FILE SIZE: 25MB',
                accept: '.png,.jpg,.jpeg,.pdf,.txt,.log,.csv,.doc,.docx,.xls,.xlsx',
                multiple: true,
                files: ctx.selectedUploadFiles,
                onUpdate: async (newFiles) => {
                  if (newFiles.length === 0) {
                    ctx.selectedUploadFiles = []
                    return
                  }

                  // 1. Update immediately with raw File objects for instant preview
                  // Merge with existing files
                  const currentFiles = Array.isArray(ctx.selectedUploadFiles) ? [...ctx.selectedUploadFiles] : []
                  const merged = [...currentFiles]
                  
                  for (const nf of newFiles) {
                    const isDup = merged.some(f => f.name === nf.name && f.size === nf.size)
                    if (!isDup) merged.push(nf)
                  }
                  ctx.selectedUploadFiles = merged

                  // 2. Process new files into Base64 for persistence
                  const processed = [...currentFiles]
                  for (const f of newFiles) {
                    const isDup = processed.some(p => p.name === f.name && p.size === f.size)
                    if (isDup) continue

                    if (f instanceof File || f instanceof Blob) {
                      try {
                        const base64 = await new Promise((resolve, reject) => {
                          const reader = new FileReader()
                          reader.onload = (e) => resolve(e.target.result)
                          reader.onerror = (err) => reject(err)
                          reader.readAsDataURL(f)
                        })
                        processed.push({
                          name: f.name,
                          size: f.size,
                          type: f.type,
                          dataUrl: base64
                        })
                      } catch (err) {
                        console.error('File reading failed:', err)
                        processed.push(f) 
                      }
                    } else {
                      processed.push(f)
                    }
                  }
                  // 3. Update with processed data once ready
                  ctx.selectedUploadFiles = processed
                },
              }),
              9: ctx.formError ? buildText(ctx.formError, { size: 'sm', color: 'error' }) : null,
              10: buildGrid({
                columns: 3,
                rows: 1,
                colGap: 8,
                display: false,
                child: {
                  1: buildButton('Delete', { color: 'error', variant: 'outline', onPressed: () => { ctx.showDeleteConfirm = true }, style: { width: '100%', height: '38px', fontWeight: '700' } }),
                  2: buildButton('Cancel', { variant: 'outline', onPressed: ctx.closeEdit, style: { width: '100%', height: '38px', fontWeight: '700' } }),
                  3: buildButton(ctx.isSaving ? 'Updating...' : 'Update', { onPressed: ctx.saveEdit, style: { width: '100%', height: '38px', fontWeight: '700' } }),
                },
              }),
            },
          }),
        },
      }) : null

      const deleteConfirmModal = ctx.showDeleteConfirm ? buildGrid({
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
            display: true,
            rowGap: 12,
            padding: '22px',
            radius: 14,
            backgroundColor: '#ffffff',
            style: { width: '420px', boxShadow: '0 16px 30px rgba(0,0,0,0.2)' },
            child: {
              1: buildText('Delete this ticket?', { size: 'xl', weight: 'bold', color: 'gray800' }),
              2: buildText(`Ticket ${ctx.editingId} will be permanently removed.`, { size: 'sm', color: 'gray600' }),
              3: buildGrid({
                columns: 2,
                rows: 1,
                colGap: 8,
                display: false,
                child: {
                  1: buildButton('Cancel', { variant: 'outline', onPressed: () => { ctx.showDeleteConfirm = false }, style: { width: '100%', height: '38px', fontWeight: '700' } }),
                  2: buildButton(ctx.isDeleting ? 'Deleting...' : 'Yes, Delete', { color: 'error', onPressed: ctx.deleteCase, style: { width: '100%', height: '38px', fontWeight: '700' } }),
                },
              }),
            },
          }),
        },
      }) : null

      const updateSuccessModal = ctx.showUpdateSuccess ? buildGrid({
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
              3: buildText(`Ticket ID: ${ctx.editingId}`, { size: 'sm', color: '#6b7280' }),
            },
          }),
        },
      }) : null

      return h('div', { style: { position: 'relative', width: '100%', height: '100%' } }, [
        page,
        editModal,
        deleteConfirmModal,
        updateSuccessModal
      ])
    }
  }
}
