import { h, ref, onMounted } from 'vue'
import { buildBadge, buildButton, buildContentGrid, buildGrid, buildHeader, buildIcon, buildIconText, buildProgressBar, buildTable, buildText, buildTextBadge, buildStackedCardsList } from '../ui/index.js'

export function RepairHistoryPage(user) {
  return {
    name: 'RepairHistoryPage',
    setup() {
      const ongoingRepairs = ref([])
      const serviceHistory = ref([])
      const problemFrequency = ref([])

      const canSeeAllTickets = user.allowedFeatures?.includes('all_tickets')

      const fetchData = async () => {
        try {
          const res = await fetch('/api/repair/tickets')
          if (!res.ok) throw new Error(`Request failed: ${res.status}`)
          let tickets = await res.json()
          if (!Array.isArray(tickets)) tickets = []

          // Filter tickets based on feature permission
          const filtered = !canSeeAllTickets 
            ? tickets.filter(t => t.submitted_by_id === user.id || t.user_id === user.id)
            : tickets

          const isDone = (status) => ['RESOLVED', 'COMPLETED'].includes((status || '').toUpperCase())
          ongoingRepairs.value = filtered.filter(t => !isDone(t.status))
          serviceHistory.value = filtered.filter(t => isDone(t.status))

          // Fetch frequency data
          try {
            const freqRes = await fetch('/api/problem-frequency')
            if (freqRes.ok) problemFrequency.value = await freqRes.json()
            else problemFrequency.value = []
          } catch {
            problemFrequency.value = []
          }
        } catch (err) {
          console.error('Failed to fetch repair history:', err)
          ongoingRepairs.value = []
          serviceHistory.value = []
          problemFrequency.value = []
        }
      }

      onMounted(fetchData)

      const showDetailsModal = ref(false)
      const selectedTicket = ref(null)

      const openTicketDetails = (ticket) => {
        let evidenceData = []
        try {
          evidenceData = typeof ticket.evidence === 'string' ? JSON.parse(ticket.evidence) : (Array.isArray(ticket.evidence) ? ticket.evidence : [])
        } catch (e) {
          evidenceData = []
        }
        selectedTicket.value = { ...ticket, evidence: evidenceData }
        showDetailsModal.value = true
      }

      const closeTicketDetails = () => {
        showDetailsModal.value = false
        selectedTicket.value = null
      }

      const isAdmin = (user.role || '').toLowerCase().includes('admin')
      const isIT = (user.department || '').toLowerCase().includes('it')
      const canManage = isAdmin || isIT

      return { ongoingRepairs, serviceHistory, problemFrequency, showDetailsModal, selectedTicket, openTicketDetails, closeTicketDetails, canManage }
    },
    render(Ruki) {
      const mainView = buildContentGrid({
        columns: 4, rows: 6, colGap: 12, rowGap: 12, padding: '24px', cellPadding: 0, display: false,
        fillViewport: true,
        span: { 1: { colSpan: 4, rowSpan: 2 }, 9: { colSpan: 2, rowSpan: 2 }, 11: { colSpan: 2, rowSpan: 2 }, 17: { colSpan: 3 }, 21: { colSpan: 4 } },
        align: { 17: 'center Left', 9: 'stretch', 11: 'stretch' },
        child: {
          1: buildHeader({
            title: 'Repair & Maintenance History',
            subtitle: 'Deep diagnostics and technical log archival for enterprise assets.',
            titleOptions: { size: '4xl' },
            backgroundColor: 'transparent', divider: false, padding: '30px 24px 22px',
            style: { margin: '-24px 0 0 -24px', width: 'calc(100% + 48px)' },
          }),
          9: buildGrid({
            columns: 6, rows: 4, height: '100%', display: true, backgroundColor: '#ffffffff', padding: '24px', borderRadius: '16px', border: '1px solid #eef2f6',
            span: { 1: { colSpan: 4 }, 5: { colSpan: 2 }, 7: { colSpan: 6, rowSpan: 10 } },
            align: { 1: 'center left', 5: 'center right' },
            style: { height: '100%' },
            child: {
              1: buildIconText('Ongoing Repairs', { icon: 'clipboard', iconSize: 26, iconColor: '#2563eb', textSize: '22px', textWeight: 'bold', textColor: '#1e293b', gap: '10px' }),
              5: buildBadge(`${Ruki.ongoingRepairs.length} ACTIVE TICKETS`, { variant: 'soft', color: 'neutral', size: 'lg', radius: 'full', style: { padding: '6px 16px', fontWeight: '700' } }),
              7: Ruki.ongoingRepairs.length > 0 ? buildStackedCardsList({
                data: Ruki.ongoingRepairs,
                border: false,
                hover: false,
                clickable: false,
                backgroundColor: '#f1f5f9',
                columns: [
                  { key: 'icon', accessor: 'priority', render: (val) => buildIcon('circle', { size: 22, color: (val || '').toLowerCase() === 'high' ? '#dc2626' : '#d97706' }) },
                  { key: 'title', accessor: 'subject' },
                  { key: 'description', accessor: 'description' },
                  {
                    key: 'footer', render: (_, row) => [
                      buildBadge(String(row.status || '').toUpperCase(), { color: (row.status || '').toLowerCase().includes('urgent') ? 'error' : 'warning', variant: 'soft', size: 'sm' }),
                      buildIconText(row.updated_at ? new Date(row.updated_at).toLocaleDateString() : 'Just now', { icon: 'clock', iconSize: 14, iconColor: 'gray500', textSize: 'xs', textColor: 'gray500', gap: '4px' })
                    ]
                  },
                  { key: 'rightNode', accessor: 'status', render: (val, row) => buildButton('View Details', { variant: 'solid', size: 'sm', style: { minWidth: '120px', color: 'white', fontWeight: '700', borderRadius: '8px', backgroundColor: '#4f46e5' }, onPressed: () => Ruki.openTicketDetails(row) }) }
                ],
                pagination: { maxRows: 3 },
              }) : buildText('No ongoing repairs at this time.', { size: 'sm', color: 'gray400', style: { textAlign: 'center', width: '100%', height: '100%', backgroundColor: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '260px' } }),
              11: buildButton('Show More', { color: 'primary', size: 'md', hover: true }),
            }
          }),
          11: buildGrid({
            columns: 1, rows: 2, display: true, padding: '24px', borderRadius: '16px', border: '1px solid #eef2f6', backgroundColor: 'white', style: { height: '100%' },
            child: {
              1: buildText('Problem Frequency', { variant: 'h4', color: '#475569', weight: 'bold' }),
              2: Ruki.problemFrequency.length > 0 ? buildText('Chart Data Here', { size: 'sm', color: 'gray500' }) : buildText('No Problem Frequency available.', { size: 'sm', color: 'gray400', style: { textAlign: 'center', width: '100%', padding: '40px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' } }),
            }
          }),
          17: buildText('SERVICE HISTORY & FAILURE MONITORING', { variant: 'h4', color: '#475569', weight: 'bold', style: { marginLeft: '5px' } }),
          21: Ruki.serviceHistory.length > 0 ? buildTable({
            columns: [
              { header: 'TICKET ID', accessor: 'ticket_id', render: (val) => buildText(String(val), { size: 'sm', color: '#4f46e5', weight: 'semibold' }) },
              { header: 'SUBJECT', accessor: 'subject', render: (val) => buildText(val, { size: 'sm', weight: 'bold', color: '#334155' }) },
              { header: 'SUBMITTED BY', accessor: 'submitted_by_name', render: (val) => buildText(val || 'Unknown', { size: 'sm', color: '#64748b' }) },
              { header: 'PREPARED BY', accessor: 'prepared_by', render: (val) => buildText(val || '-', { size: 'sm', color: '#64748b' }) },
              { header: 'STATUS', accessor: 'status', render: (val) => buildBadge(String(val || '').toUpperCase(), { color: 'success', variant: 'soft', size: 'sm' }) },
              { header: 'UPDATED', accessor: 'updated_at', render: (val) => buildText(val ? new Date(val).toLocaleDateString() : '', { size: 'sm', color: '#334155', weight: 'semibold' }) },
            ],
            data: Ruki.serviceHistory,
            pagination: { maxRows: 3, fillRows: true },
            onPressed: (row) => Ruki.openTicketDetails(row),
            style: { backgroundColor: 'white', borderRadius: '14px' },
          }) : buildGrid({
            columns: 1,
            rows: 1,
            display: true,
            backgroundColor: 'white',
            borderRadius: '14px',
            border: '1px solid #e5e7ee',
            child: {
              1: buildText('No service history records available.', { size: 'md', color: 'gray400', style: { padding: '80px 0', textAlign: 'center', width: '100%' } })
            }
          })
        },
      })

      const detailsModal = Ruki.showDetailsModal ? buildGrid({
        columns: 1, rows: 1, padding: 0,
        style: {
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10000,
          backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        },
        child: {
          1: buildGrid({
            columns: 1, rows: 3, padding: '32px', rowGap: 20, display: true,
            style: { width: '720px' },
            child: {
              1: buildText(`Ticket Details: #${Ruki.selectedTicket?.ticket_id || ''}`, { variant: 'h2', weight: 'bold', color: '#0f172a' }),
              2: buildGrid({
                columns: 3, rows: 3, padding: '32px', rowGap: 24, colGap: 24, radius: 20, display: true,
                backgroundColor: '#ffffff', border: '1px solid #e5e7ee',
                span: { 7: { colSpan: 3 } },
                child: {
                  1: buildGrid({
                    columns: 1, rows: 2, rowGap: 8, display: false,
                    child: {
                      1: buildText('Ticket ID', { size: 'sm', weight: 'bold', color: '#334155' }),
                      2: buildText(String(Ruki.selectedTicket?.ticket_id || '-'), { size: 'md', color: '#2563eb', weight: 'semibold', style: { padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' } })
                    }
                  }),
                  2: buildGrid({
                    columns: 1, rows: 2, rowGap: 8, display: false,
                    child: {
                      1: buildText('Subject', { size: 'sm', weight: 'bold', color: '#334155' }),
                      2: buildText(String(Ruki.selectedTicket?.subject || '-'), { size: 'md', color: '#334155', style: { padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' } })
                    }
                  }),
                  3: buildGrid({
                    columns: 1, rows: 2, rowGap: 8, display: false,
                    child: {
                      1: buildText('Status', { size: 'sm', weight: 'bold', color: '#334155' }),
                      2: h('div', { style: { padding: '10px 16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center' } }, [
                        buildBadge(String(Ruki.selectedTicket?.status || '').toUpperCase(), { color: (Ruki.selectedTicket?.status || '').toLowerCase().includes('urgent') ? 'error' : (Ruki.selectedTicket?.status || '').toLowerCase().includes('resolved') ? 'success' : 'info', variant: 'soft', size: 'md' })
                      ])
                    }
                  }),
                  4: buildGrid({
                    columns: 1, rows: 2, rowGap: 8, display: false,
                    child: {
                      1: buildText('Updated Date', { size: 'sm', weight: 'bold', color: '#334155' }),
                      2: buildText(Ruki.selectedTicket?.updated_at ? new Date(Ruki.selectedTicket.updated_at).toLocaleDateString() : '-', { size: 'md', color: '#475569', style: { padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' } })
                    }
                  }),
                  5: buildGrid({
                    columns: 1, rows: 2, rowGap: 8, display: false,
                    child: {
                      1: buildText('Submitted By', { size: 'sm', weight: 'bold', color: '#334155' }),
                      2: buildText(String(Ruki.selectedTicket?.submitted_by_name || 'Unknown'), { size: 'md', color: '#475569', style: { padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' } })
                    }
                  }),
                  6: buildGrid({
                    columns: 1, rows: 2, rowGap: 8, display: false,
                    child: {
                      1: buildText('Prepared By (IT)', { size: 'sm', weight: 'bold', color: '#334155' }),
                      2: buildText(String(Ruki.selectedTicket?.prepared_by || 'Assigning...'), { size: 'md', color: '#2563eb', weight: 'semibold', style: { padding: '12px 16px', backgroundColor: '#f0f9ff', borderRadius: '10px', border: '1px solid #bae6fd' } })
                    }
                  }),
                  7: buildGrid({
                    columns: 1, rows: 2, rowGap: 8, display: false,
                    child: {
                      1: buildText('Description', { size: 'sm', weight: 'bold', color: '#334155' }),
                      2: buildText(String(Ruki.selectedTicket?.description || 'No additional details provided.'), { size: 'sm', color: '#475569', style: { padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '100px', lineHeight: '1.6' } })
                    }
                  }),
                  8: (Ruki.selectedTicket?.evidence && Array.isArray(Ruki.selectedTicket.evidence) && Ruki.selectedTicket.evidence.length > 0) ? buildGrid({
                    columns: 1, rows: 2, rowGap: 8, display: false,
                    child: {
                      1: buildText('Evidence / Logs', { size: 'sm', weight: 'bold', color: '#334155' }),
                      2: h('div', { style: { display: 'flex', gap: '10px', flexWrap: 'wrap', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' } },
                        Ruki.selectedTicket.evidence.map(file => {
                          if (file.dataUrl && (file.type || '').startsWith('image/')) {
                            return h('img', { src: file.dataUrl, style: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' } })
                          }
                          return h('div', { style: { padding: '8px 12px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', color: '#475569' } }, file.name || 'File')
                        })
                      )
                    }
                  }) : null
                }
              }),
              3: buildGrid({
                columns: Ruki.canManage ? 2 : 1, rows: 1, colGap: 12, display: false,
                child: {
                  1: buildButton('Close', { variant: 'outline', color: 'neutral', style: { width: '100%', height: '52px', fontWeight: 'bold', fontSize: '16px', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: '#ffffff' }, onPressed: Ruki.closeTicketDetails }),
                  ...(Ruki.canManage ? {
                    2: buildButton('Manage in Cases', { variant: 'solid', color: 'primary', style: { width: '100%', height: '52px', fontWeight: 'bold', fontSize: '16px', borderRadius: '14px', color: '#ffffff', backgroundColor: '#4f46e5' }, onPressed: () => { if (typeof globalThis.__appNavigate === 'function') globalThis.__appNavigate('/cases') } })
                  } : {})
                }
              })
            }
          })
        }
      }) : null

      return h('div', { style: { position: 'relative', width: '100%', height: '100%' } }, [
        mainView,
        detailsModal
      ])
    }
  }
}
