import { defineComponent, h, onMounted, ref } from 'vue'
import { buildBadge, buildButton, buildContentGrid, buildGrid, buildHeader, buildTable, buildText } from '../ui/index.js'

export function AdminUsersPage(user) {
  return {
    name: 'AdminUsersPage',
    setup() {
      const tableRows = ref([])

      onMounted(async () => {
        try {
          const res = await fetch('http://127.0.0.1:5050/api/users')
          if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`)
          tableRows.value = await res.json()
        } catch (e) {
          tableRows.value = []
        }
      })

      return () => buildContentGrid({
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
            backgroundColor: 'white',
            divider: false,
            padding: '30px 24px 22px',
            style: {
              margin: '-24px 0 0 -24px',
              width: 'calc(100% + 48px)',
            },
          }),
          7: buildTable({
            headerUppercase: true,
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
          {
            header: 'ACTIONS',
            accessor: 'id',
            width: '120px',
            render: (_, row) => buildGrid({
              columns: 2,
              rows: 1,
              colGap: 2,
              display: false,
              child: {
                1: buildButton('View', { size: 'xs', variant: 'outline', color: 'neutral', onPressed: () => {} }),
                2: buildButton('Edit', { size: 'xs', color: 'primary', onPressed: () => {} }),
              },
            }),
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
      })
    }
  }
}
