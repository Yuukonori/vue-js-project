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

      const defaultLimited = ['/dashboard', '/assets', '/support', '/repair-history']
      const allPages = ['/dashboard', '/assets', '/support', '/repair-history', '/monitoring', '/activity-logs', '/users', '/cases']

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
          let res = await fetch('http://127.0.0.1:5050/api/users')
          if (!res.ok) res = await fetch('/api/users')
          if (!res.ok) throw new Error(`Failed to load departments: ${res.status}`)
          const list = await res.json()
          const unique = Array.from(new Set((Array.isArray(list) ? list : [])
            .map(u => String(u?.department || '').trim())
            .filter(Boolean)))
          departmentItems.value = unique.map(dep => ({ text: dep, value: dep.toLowerCase() }))
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
      }

      function useDefaultLimited() {
        selectedPages.value = [...defaultLimited]
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
            body: JSON.stringify({ allowed_pages }),
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
            backgroundColor: 'white',
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
                  { header: 'DEPARTMENT', accessor: 'department', render: (val) => buildText(String(val || ''), { weight: 'semibold' }) },
                  { header: 'ALLOWED PAGES', accessor: 'allowed_pages', render: (val) => buildText(Array.isArray(val) ? val.join(', ') : '', { size: 'sm', color: 'gray600' }) },
                ],
                data: rows.value,
                onRowClick: openDepartment,
              }),
              3: buildGrid({
                columns: 4,
                rows: 4,
                display: true,
                colGap: 8,
                rowGap: 8,
                span: { 1: { colSpan: 2 }, 3: { colSpan: 2 }, 5: { colSpan: 4 }, 9: { colSpan: 4 }, 13: { colSpan: 4 } },
                child: {
                  1: buildGrid({
                    columns: 1,
                    rows: 2,
                    rowGap: 6,
                    display: false,
                    child: {
                      1: buildText('DEPARTMENT', { size: 'xs', weight: 'bold', color: 'gray700' }),
                      2: buildDropdown({
                        placeholder: 'Select department',
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
                  9: buildGrid({
                    columns: 3,
                    rows: 1,
                    display: false,
                    colGap: 8,
                    child: {
                      1: buildButton('Use Non-IT Default', { variant: 'outline', onPressed: useDefaultLimited, style: { width: '100%', height: '40px', fontWeight: '700' } }),
                      2: buildButton('Clear All', { variant: 'outline', onPressed: () => { selectedPages.value = [] }, style: { width: '100%', height: '40px', fontWeight: '700' } }),
                      3: buildButton(isSaving.value ? 'Saving...' : 'Save Policy', { onPressed: savePolicy, style: { width: '100%', height: '40px', fontWeight: '700' } }),
                    },
                  }),
                  13: error.value ? buildText(error.value, { size: 'sm', color: 'error' }) : buildText('', { size: 'sm' }),
                },
              }),
            },
          }),
        },
      })
    }
  }
}
