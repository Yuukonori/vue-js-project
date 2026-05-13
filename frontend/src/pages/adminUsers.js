import { onMounted, ref } from 'vue'
import { buildBadge, buildButton, buildContentGrid, buildDropdown, buildGrid, buildHeader, buildIcon, buildInput, buildTable, buildTapOption, buildText } from '../ui/index.js'

export function AdminUsersPage(user) {
  return {
    name: 'AdminUsersPage',
    setup() {
      const tableRows = ref([])
      const showEditModal = ref(false)
      const showDeleteConfirm = ref(false)
      const isSaving = ref(false)
      const isDeleting = ref(false)
      const editError = ref('')
      const successPopup = ref({ show: false, type: '', message: '' })
      const editingId = ref(null)

      const fullName = ref('')
      const email = ref('')
      const department = ref(null)
      const role = ref(null)
      const position = ref('')
      const company = ref('')
      const costCenter = ref('')
      const assets = ref('0')
      const issues = ref('0')
      const status = ref('active')

      async function loadUsers() {
        try {
          const res = await fetch('http://127.0.0.1:5050/api/users')
          if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`)
          tableRows.value = await res.json()
        } catch (e) {
          tableRows.value = []
        }
      }

      onMounted(async () => {
        await loadUsers()
      })

      function goToUserForm() {
        if (typeof globalThis.__appNavigate === 'function') {
          globalThis.__appNavigate('/userform')
        }
      }

      function openEdit(row) {
        editingId.value = row.id
        fullName.value = row.name || ''
        email.value = row.email || ''
        department.value = (row.department || '').toLowerCase()
        role.value = (row.role || '').toLowerCase()
        position.value = row.position || ''
        company.value = row.company || ''
        costCenter.value = row.costCenter || ''
        assets.value = String(row.assets ?? 0)
        issues.value = String(row.issues ?? 0)
        status.value = String(row.status || 'Active').toLowerCase() === 'active' ? 'active' : 'inactive'
        editError.value = ''
        showEditModal.value = true
      }

      function closeEdit() {
        showEditModal.value = false
      }

      async function saveEdit() {
        if (!editingId.value || isSaving.value) return

        isSaving.value = true
        editError.value = ''

        try {
          const payload = {
            name: fullName.value,
            email: email.value,
            department: department.value,
            role: role.value,
            position: position.value,
            company: company.value,
            costCenter: costCenter.value,
            assets: Number(assets.value || 0),
            issues: Number(issues.value || 0),
            status: status.value === 'active' ? 'Active' : 'Inactive',
          }

          const res = await fetch(`http://127.0.0.1:5050/api/users/${editingId.value}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

          if (!res.ok) {
            let msg = 'Failed to update user'
            try {
              const errBody = await res.json()
              msg = errBody?.error || msg
            } catch (_) {}
            throw new Error(msg)
          }

          await loadUsers()
          showEditModal.value = false
          successPopup.value = { show: true, type: 'update', message: 'User updated successfully.' }
          setTimeout(() => {
            successPopup.value = { show: false, type: '', message: '' }
          }, 1200)
        } catch (e) {
          editError.value = e?.message || 'Failed to update user. Please try again.'
        } finally {
          isSaving.value = false
        }
      }

      async function deleteUser() {
        if (!editingId.value || isDeleting.value) return
        isDeleting.value = true
        editError.value = ''
        try {
          const res = await fetch(`http://127.0.0.1:5050/api/users/${editingId.value}`, { method: 'DELETE' })
          if (!res.ok) {
            let msg = 'Failed to delete user'
            try {
              const errBody = await res.json()
              msg = errBody?.error || msg
            } catch (_) {}
            throw new Error(msg)
          }
          await loadUsers()
          showEditModal.value = false
          successPopup.value = { show: true, type: 'delete', message: 'User deleted successfully.' }
          setTimeout(() => {
            successPopup.value = { show: false, type: '', message: '' }
          }, 1200)
        } catch (e) {
          editError.value = e?.message || 'Failed to delete user. Please try again.'
        } finally {
          isDeleting.value = false
        }
      }

      function requestDelete() {
        showDeleteConfirm.value = true
      }

      function cancelDeleteRequest() {
        showDeleteConfirm.value = false
      }

      async function confirmDelete() {
        showDeleteConfirm.value = false
        await deleteUser()
      }

      return () => buildGrid({
        columns: 1,
        rows: 4,
        display: false,
        child: {
          1: buildContentGrid({
            columns: 6,
            rows: 2,
            padding: '24px',
            cellPadding: 0,
            display: false,
            span: {
              1: { colSpan: 6 },
              7: { colSpan: 6 },
            },
            child: {
              1: buildHeader({
                title: 'Users Management',
                subtitle: 'Manage organization users, assignments, and account status.',
                backgroundColor: 'transparent',
                divider: false,
                padding: '30px 24px 22px',
                actionText: 'Add User',
                actionIcon: buildIcon('plus', { size: 14, color: '#ffffff' }),
                onAction: goToUserForm,
                style: {
                  margin: '-24px 0 0 -24px',
                  width: 'calc(100% + 48px)',
                },
              }),
              7: buildTable({
                headerUppercase: true,
                onRowClick: openEdit,
                columns: [
                  {
                    header: 'USER',
                    accessor: 'name',
                    width: '250px',
                    render: (value, row) => buildGrid({
                      columns: 1,
                      rows: 2,
                      display: false,
                      child: {
                        1: buildText(String(value), { size: 'sm', weight: 'semibold', color: 'gray900' }),
                        2: buildText(String(row.email), { size: 'xs', color: 'gray500' }),
                      },
                    }),
                  },
                  { header: 'ROLE', accessor: 'role', width: '110px' },
                  { header: 'DEPARTMENT', accessor: 'department', width: '140px' },
                  { header: 'POSITION', accessor: 'position', width: '170px' },
                  { header: 'COST CENTER', accessor: 'costCenter', width: '120px' },
                  { header: 'COMPANY', accessor: 'company', width: '110px' },
                  { header: 'ASSETS', accessor: 'assets', align: 'center', width: '80px' },
                  { header: 'ISSUES', accessor: 'issues', align: 'center', width: '80px' },
                  {
                    header: 'STATUS',
                    accessor: 'status',
                    width: '110px',
                    render: (value) => String(value) === 'Active'
                      ? buildBadge('Active', { bg: '#e8f7ed', color: '#1f7a3d', radius: '999px' })
                      : buildBadge('Inactive', { bg: '#feecec', color: '#b42318', radius: '999px' }),
                  },
                ],
                data: tableRows.value,
                pageSize: 10,
                style: {
                  borderRadius: '14px',
                  border: '1px solid #e5e7ee',
                },
              }),
            },
          }),
          2: showEditModal.value
            ? buildGrid({
              columns: 1,
              rows: 1,
              display: true,
              style: { position: 'fixed', inset: '0', background: 'rgba(15,23,42,0.28)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' },
              child: {
                1: buildGrid({
                  columns: 6,
                  rows: 6,
                  display: true,
                  padding: '18px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  radius: 12,
                  colGap: 12,
                  rowGap: 10,
                  style: { width: 'min(1100px, 92vw)' },
                  span: {
                    1: { colSpan: 6 },
                    7: { colSpan: 3 },
                    10: { colSpan: 3 },
                    13: { colSpan: 2 },
                    15: { colSpan: 2 },
                    17: { colSpan: 2 },
                    19: { colSpan: 3 },
                    22: { colSpan: 3 },
                    25: { colSpan: 2 },
                    27: { colSpan: 2 },
                    29: { colSpan: 2 },
                    30: { colSpan: 6 },
                    31: { colSpan: 6 },
                  },
                  child: {
                    1: buildHeader({ title: 'Edit User', subtitle: 'Update user information', backgroundColor: 'transparent', divider: false }),
                    7: buildInput({ label: 'FULL NAME', value: fullName, onUpdate: (v) => { fullName.value = v }, full: true }),
                    10: buildInput({ label: 'EMAIL', value: email, onUpdate: (v) => { email.value = v }, full: true }),
                    13: buildDropdown({ label: 'DEPARTMENT', items: [{ text: 'IT Operations', value: 'it-ops' }, { text: 'Finance', value: 'finance' }, { text: 'Human Resource', value: 'hr' }, { text: 'Procurement', value: 'procurement' }], value: department, onUpdate: (v) => { department.value = v }, width: '100%', height: '42px', style: { marginTop: '22px' } }),
                    15: buildDropdown({ label: 'ROLE', items: [{ text: 'Admin', value: 'admin' }, { text: 'Manager', value: 'manager' }, { text: 'Staff', value: 'staff' }], value: role, onUpdate: (v) => { role.value = v }, width: '100%', height: '42px', style: { marginTop: '22px' } }),
                    17: buildInput({ label: 'POSITION', value: position, onUpdate: (v) => { position.value = v }, full: true }),
                    19: buildInput({ label: 'COMPANY', value: company, onUpdate: (v) => { company.value = v }, full: true }),
                    22: buildInput({ label: 'COST CENTER', value: costCenter, onUpdate: (v) => { costCenter.value = v }, full: true }),
                    25: buildInput({ label: 'ASSETS', type: 'number', value: assets, onUpdate: (v) => { assets.value = v }, full: true }),
                    27: buildInput({ label: 'ISSUES', type: 'number', value: issues, onUpdate: (v) => { issues.value = v }, full: true }),
                    29: buildGrid({ columns: 1, rows: 2, display: false, rowGap: 6, child: { 1: buildText('ACCOUNT STATUS', { size: 'xs', weight: 'bold', color: 'gray700' }), 2: buildTapOption({ items: [{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }], value: status, onChange: (val) => { status.value = val }, height: '40px', bg: '#f8fafc', selectedBg: '#ffffff', selectedColor: '#1d4ed8', color: '#64748b', style: { border: '1px solid #dbeafe', padding: '0', height: '40px' } }) } }),
                    30: editError.value ? buildText(editError.value, { size: 'xs', color: 'error' }) : null,
                    31: buildGrid({ columns: 3, rows: 1, display: false, colGap: 10, child: { 1: buildButton('Cancel', { variant: 'outline', size: 'sm', height: '40px', onPressed: closeEdit, style: { width: '100%' } }), 2: buildButton(isSaving.value ? 'Saving...' : 'Save', { size: 'sm', height: '40px', onPressed: saveEdit, style: { width: '100%' } }), 3: buildButton(isDeleting.value ? 'Deleting...' : 'Delete', { size: 'sm', color: 'error', height: '40px', onPressed: requestDelete, style: { width: '100%' } }) } }),
                  },
                }),
              },
            })
            : null,
          4: showDeleteConfirm.value
            ? buildGrid({
              columns: 1, rows: 1, display: true,
              style: { position: 'fixed', inset: '0', background: 'rgba(15,23,42,0.24)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' },
              child: {
                1: buildGrid({
                  columns: 1, rows: 3, display: true, rowGap: 14, padding: '24px',
                  backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb',
                  style: { width: '360px', boxShadow: '0 18px 34px rgba(0,0,0,0.16)' },
                  child: {
                    1: buildText('Delete User?', { size: 'xl', weight: 'bold', color: 'gray900' }),
                    2: buildText('This action cannot be undone. Do you want to continue?', { size: 'sm', color: 'gray600' }),
                    3: buildGrid({
                      columns: 2, rows: 1, display: false, colGap: 10,
                      child: {
                        1: buildButton('Cancel', { variant: 'outline', size: 'sm', height: '40px', onPressed: cancelDeleteRequest, style: { width: '100%' } }),
                        2: buildButton('Yes, Delete', { size: 'sm', color: 'error', height: '40px', onPressed: confirmDelete, style: { width: '100%' } }),
                      },
                    }),
                  },
                }),
              },
            })
            : null,
          3: successPopup.value.show
            ? buildGrid({
              columns: 1, rows: 1, display: true,
              style: { position: 'fixed', inset: '0', background: 'rgba(15,23,42,0.24)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
              child: {
                1: buildGrid({
                  columns: 1, rows: 3, display: true, rowGap: 14, padding: '30px',
                  backgroundColor: '#ffffff', borderRadius: '18px', border: '1px solid #e5e7eb',
                  style: { width: '340px', textAlign: 'center', boxShadow: '0 24px 36px rgba(0,0,0,0.16)' },
                  child: {
                    1: buildIcon(successPopup.value.type === 'delete' ? 'delete' : 'circle-check', { size: 36, color: successPopup.value.type === 'delete' ? '#ef4444' : '#10b981' }),
                    2: buildText('Success', { size: '2xl', weight: 'bold', color: 'gray900' }),
                    3: buildText(successPopup.value.message, { size: 'sm', color: 'gray600' }),
                  },
                }),
              },
            })
            : null,
        },
      })
    },
  }
}
