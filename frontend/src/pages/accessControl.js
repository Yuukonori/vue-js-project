import { onMounted, ref } from 'vue'
import { buildButton, buildCheckbox, buildContentGrid, buildDropdown, buildGrid, buildHeader, buildTable, buildText } from '../ui/index.js'

export function AccessControlPage() {
  return {
    name: 'AccessControlPage',
    setup() {
      const rows = ref([])
      const departmentItems = ref([])
      const isSaving = ref(false)
      const error = ref('')
      const selectedDepartment = ref('')
      const selectedPages = ref([])
      const selectedFeatures = ref([])

      const defaultLimited = ['/dashboard', '/assets', '/support', '/repair-history']
      const allPages = ['/dashboard', '/assets', '/support', '/repair-history', '/monitoring', '/activity-logs', '/users', '/cases']
      
      const allFeatures = [
        { id: 'network_map', label: 'View Network Map', category: 'MODULE' },
        { id: 'all_tickets', label: 'View All Tickets', category: 'MODULE' },
        { id: 'create_ticket', label: 'Create New Ticket', category: 'FUNCTION' },
        { id: 'delete_ticket', label: 'Delete Tickets', category: 'FUNCTION' },
        { id: 'edit_asset', label: 'Edit Asset Details', category: 'FUNCTION' },
        { id: 'delete_asset', label: 'Delete Assets', category: 'FUNCTION' },
        { id: 'export_data', label: 'Export Data Reports', category: 'OPTION' },
        { id: 'view_costs', label: 'View Financial Costs', category: 'OPTION' },
      ]

      async function loadPolicies() {
        error.value = ''
        try {
          const res = await fetch('/api/access-policies')
          if (!res.ok) throw new Error(`Failed to load access policies: ${res.status}`)
          const data = await res.json()
          rows.value = Array.isArray(data) ? data : []
        } catch (e) {
          error.value = e?.message || 'Failed to load access policies.'
          rows.value = []
        }
      }

      async function loadDepartments() {
        try {
          const res = await fetch('/api/users')
          if (!res.ok) throw new Error(`Failed to load roles/departments: ${res.status}`)
          const list = await res.json()
          const uList = Array.isArray(list) ? list : []
          
          const deps = Array.from(new Set(uList.map(u => String(u?.department || '').trim()).filter(Boolean)))
          const roles = Array.from(new Set(uList.map(u => String(u?.role || '').trim()).filter(Boolean)))
          
          const combined = Array.from(new Set([...deps, ...roles])).sort()
          departmentItems.value = combined.map(item => ({ text: item, value: item.toLowerCase() }))
        } catch (e) {
          console.error('Failed to load departments:', e)
          departmentItems.value = []
        }
      }

      function openDepartment(row) {
        selectedDepartment.value = String(row?.department || '').toLowerCase()
        const pages = Array.isArray(row?.allowed_pages) ? row.allowed_pages : []
        if (pages.includes('*')) {
          selectedPages.value = [...allPages]
        } else {
          selectedPages.value = pages.filter(p => allPages.includes(p))
        }
        selectedFeatures.value = Array.isArray(row?.allowed_features) ? row.allowed_features : []
      }

      function togglePage(path) {
        if (selectedPages.value.includes(path)) {
          selectedPages.value = selectedPages.value.filter(p => p !== path)
        } else {
          selectedPages.value = [...selectedPages.value, path]
        }
      }

      function toggleAllPages() {
        selectedPages.value = selectedPages.value.length === allPages.length ? [] : [...allPages]
      }

      function toggleFeature(feat) {
        if (selectedFeatures.value.includes(feat)) {
          selectedFeatures.value = selectedFeatures.value.filter(f => f !== feat)
        } else {
          selectedFeatures.value = [...selectedFeatures.value, feat]
        }
      }

      async function savePolicy() {
        if (!selectedDepartment.value.trim()) {
          error.value = 'Select a department row first.'
          return
        }
        isSaving.value = true
        error.value = ''
        try {
          const allowed_pages = selectedPages.value.length === allPages.length ? ['*'] : [...selectedPages.value]

          const res = await fetch(`/api/access-policies/${encodeURIComponent(selectedDepartment.value)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              allowed_pages, 
              allowed_features: selectedFeatures.value 
            }),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data?.error || 'Failed to save policy')
          await loadPolicies()
        } catch (e) {
          error.value = e?.message || 'Failed to save policy.'
        } finally {
          isSaving.value = false
        }
      }

      onMounted(async () => {
        await Promise.all([loadPolicies(), loadDepartments()])
      })

      return () => buildContentGrid({
        columns: 1,
        rows: 2,
        padding: '24px',
        rowGap: 12,
        display: false,
        child: {
          1: buildHeader({
            title: 'Access Control',
            subtitle: 'Choose which pages each department can see using checkboxes.',
            backgroundColor: 'transparent',
            divider: false,
            padding: '30px 24px 22px',
            style: { margin: '-24px 0 0 -24px', width: 'calc(100% + 48px)' },
          }),
          2: buildGrid({
            columns: 1,
            rows: 3,
            display: true,
            rowGap: 10,
            padding: '16px',
            border: '1px solid #e2e8f0',
            radius: 12,
            backgroundColor: '#ffffff',
            child: {
              1: buildGrid({
                columns: 1,
                rows: 2,
                display: false,
                rowGap: 4,
                child: {
                  1: buildText('Access Note', { size: 'sm', weight: 'bold', color: '#92400e' }),
                  2: buildText('Some in-page features are restricted by role. Only Admin / IT can see and manage all features.', { size: 'sm', color: '#b45309' }),
                },
              }),
              2: buildTable({
                columns: [
                  { header: 'ROLE / DEPARTMENT', accessor: 'department', render: (val) => buildText(String(val || '').toUpperCase(), { weight: 'semibold', size: 'sm' }) },
                  { header: 'PAGE ACCESS', accessor: 'allowed_pages', render: (val) => buildText(Array.isArray(val) ? val.join(', ') : '', { size: 'xs', color: 'gray600' }) },
                  { header: 'FEATURES/OPTIONS', accessor: 'allowed_features', render: (val) => buildText(Array.isArray(val) ? val.join(', ') : '', { size: 'xs', color: 'blue600' }) },
                ],
                data: rows.value,
                onRowClick: openDepartment,
              }),
              3: buildGrid({
                columns: 4,
                rows: 6,
                display: true,
                colGap: 8,
                rowGap: 12,
                span: { 1: { colSpan: 2 }, 3: { colSpan: 2 }, 5: { colSpan: 4 }, 10: { colSpan: 4 }, 15: { colSpan: 4 }, 20: { colSpan: 4 }, 25: { colSpan: 4 } },
                child: {
                  1: buildGrid({
                    columns: 1,
                    rows: 2,
                    rowGap: 6,
                    display: false,
                    child: {
                      1: buildText('ROLE / DEPARTMENT', { size: 'xs', weight: 'bold', color: 'gray700' }),
                      2: buildDropdown({
                        placeholder: 'Select target',
                        items: departmentItems.value,
                        value: selectedDepartment,
                        onUpdate: (v) => { selectedDepartment.value = v },
                        width: '100%',
                        height: '40px',
                      }),
                    },
                  }),
                  3: buildCheckbox({
                    label: `Allow All Pages (${allPages.length})`,
                    checked: selectedPages.value.length === allPages.length,
                    onClick: toggleAllPages,
                    display: true,
                    style: { marginTop: '23px' },
                  }),
                  5: buildGrid({
                    columns: 1, rows: 2, rowGap: 8, display: false,
                    child: {
                      1: buildText('PAGE ACCESS', { size: 'xs', weight: 'bold', color: 'gray700' }),
                      2: buildGrid({
                        columns: 4,
                        rows: 2,
                        display: false,
                        colGap: 8,
                        rowGap: 8,
                        child: {
                          1: buildCheckbox({ label: '/dashboard', checked: selectedPages.value.includes('/dashboard'), onClick: () => togglePage('/dashboard'), display: true }),
                          2: buildCheckbox({ label: '/assets', checked: selectedPages.value.includes('/assets'), onClick: () => togglePage('/assets'), display: true }),
                          3: buildCheckbox({ label: '/support', checked: selectedPages.value.includes('/support'), onClick: () => togglePage('/support'), display: true }),
                          4: buildCheckbox({ label: '/repair-history', checked: selectedPages.value.includes('/repair-history'), onClick: () => togglePage('/repair-history'), display: true }),
                          5: buildCheckbox({ label: '/monitoring', checked: selectedPages.value.includes('/monitoring'), onClick: () => togglePage('/monitoring'), display: true }),
                          6: buildCheckbox({ label: '/activity-logs', checked: selectedPages.value.includes('/activity-logs'), onClick: () => togglePage('/activity-logs'), display: true }),
                          7: buildCheckbox({ label: '/users', checked: selectedPages.value.includes('/users'), onClick: () => togglePage('/users'), display: true }),
                          8: buildCheckbox({ label: '/cases', checked: selectedPages.value.includes('/cases'), onClick: () => togglePage('/cases'), display: true }),
                        },
                      }),
                    }
                  }),
                  10: buildGrid({
                    columns: 1, rows: 2, rowGap: 8, display: false,
                    child: {
                      1: buildText('FEATURE & FUNCTION ACCESS', { size: 'xs', weight: 'bold', color: 'gray700' }),
                      2: buildGrid({
                        columns: 3, rows: 2, display: false, colGap: 8, rowGap: 8,
                        child: Object.fromEntries(
                          allFeatures
                            .filter(f => f.category !== 'OPTION')
                            .map((f, i) => [i + 1, buildCheckbox({ 
                              label: f.label, 
                              checked: selectedFeatures.value.includes(f.id), 
                              onClick: () => toggleFeature(f.id), 
                              display: true 
                            })])
                        )
                      })
                    }
                  }),
                  15: buildGrid({
                    columns: 1, rows: 2, rowGap: 8, display: false,
                    child: {
                      1: buildText('OPTION ACCESS', { size: 'xs', weight: 'bold', color: 'gray700' }),
                      2: buildGrid({
                        columns: 3, rows: 1, display: false, colGap: 8,
                        child: Object.fromEntries(
                          allFeatures
                            .filter(f => f.category === 'OPTION')
                            .map((f, i) => [i + 1, buildCheckbox({ 
                              label: f.label, 
                              checked: selectedFeatures.value.includes(f.id), 
                              onClick: () => toggleFeature(f.id), 
                              display: true 
                            })])
                        )
                      })
                    }
                  }),
                  20: buildGrid({
                    columns: 3,
                    rows: 1,
                    display: false,
                    colGap: 8,
                    child: {
                      1: buildButton('Non-IT Preset', { variant: 'outline', onPressed: () => { selectedPages.value = [...defaultLimited]; selectedFeatures.value = [] }, style: { width: '100%', height: '40px', fontWeight: '700' } }),
                      2: buildButton('Clear All', { variant: 'outline', onPressed: () => { selectedPages.value = []; selectedFeatures.value = [] }, style: { width: '100%', height: '40px', fontWeight: '700' } }),
                      3: buildButton(isSaving.value ? 'Saving...' : 'Save Policy', { onPressed: savePolicy, style: { width: '100%', height: '40px', fontWeight: '700' } }),
                    },
                  }),
                  25: error.value ? buildText(error.value, { size: 'sm', color: 'error' }) : buildText('', { size: 'sm' }),
                },
              }),
            },
          }),
        },
      })
    }
  }
}
