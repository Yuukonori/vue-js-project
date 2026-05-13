import { computed, defineComponent, h, ref } from 'vue'
import { buildImageProfile, buildButton as baseBuildButton, buildContentGrid, buildDivider, buildDropdown, buildFileUpload, buildGrid, buildHeader, buildIcon, buildIconContainer, buildImage, buildInput, buildTable, buildText, GridSpan, spacing, colors, buildIconTextContainer, buildTextBadge, buildIconText, buildTapOption } from '../ui/index.js'

import { formatLastUpdate } from '../lastUpdate.js'
import { authFetch } from '../utils/auth.js'

/**
 * SupportPage(user)
 * @param {{ name: string }} user
 */
export function SupportPage(user) {
  return {
    name: 'SupportPageContent',

    setup() {
      function buildButton(label, options = {}) {
        return baseBuildButton(label, {
          ...options,
          color: options.color ?? options.Color,
          onPressed: options.onPressed ?? options.onClick ?? options.onclick,
        })
      }



      const defaultVisibleCount = 5
      const maxSupportUsers = 10
      const showMoreClicks = ref(0)
      const detailVisibleRows = 2
      const lastUpdatedAt = new Date(Date.now() - (4 * 60 * 1000))
      const ticketCategory = ref('hardware')
      const priorityLevel = ref('low')
      const severityLevel = ref('low')
      const selectedUploadFiles = ref([])
      const subjectTitle = ref('')
      const assetTag = ref('')
      const issueDescription = ref('')
      const isSubmitting = ref(false)
      const submitMessage = ref('')
      const showSuccessPopup = ref(false)
      const submittedTicketId = ref('')
      const selectedMember = ref(null)

      const supportMembers = [
        { id: 'S01', name: 'Visal', role: 'Front-end Developer', dept: 'IT Department', icon: 'person' },
        { id: 'S02', name: 'Piseth', role: 'Automation Programmer', dept: 'IT Department', icon: 'person' },
        { id: 'S03', name: 'Pong', role: 'IT Support', dept: 'IT Department', icon: 'person' },
        { id: 'S04', name: 'Tykea', role: 'Engeneering', dept: 'IT Department', icon: 'person' },
      ]


      //------------Function-----------------//

      function onShowMoreUsers() {
        showMoreClicks.value += 1
        if (showMoreClicks.value > 1) {
          if (typeof globalThis.__appNavigate === 'function') {
            globalThis.__appNavigate('/userlist')
          }
          return
        }
      }

      function openUserDetail(member) {
        selectedMember.value = member
      }

      function resetTicketForm() {
        ticketCategory.value = 'hardware'
        priorityLevel.value = 'low'
        subjectTitle.value = ''
        assetTag.value = ''
        issueDescription.value = ''
        selectedUploadFiles.value = []
        submitMessage.value = ''
      }

      async function submitTicket() {
        if (!subjectTitle.value.trim()) {
          submitMessage.value = 'Subject title is required.'
          return
        }

        isSubmitting.value = true
        submitMessage.value = ''
        try {
          const payload = {
            category: ticketCategory.value,
            priority: priorityLevel.value,
            subject: subjectTitle.value.trim(),
            assetTag: assetTag.value.trim(),
            description: issueDescription.value.trim(),
            submittedBy: user.id, // Add current user ID
          }

          const res = await authFetch('/api/repair/tickets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

          const raw = await res.text()
          let data = null
          try { data = raw ? JSON.parse(raw) : null } catch { data = { error: raw?.slice(0, 140) || 'Invalid server response' } }
          if (!res.ok) throw new Error(data?.error || 'Failed to submit ticket')

          submittedTicketId.value = String(data.ticket_id || '')
          submitMessage.value = `Ticket ${data.ticket_id} submitted successfully.`
          showSuccessPopup.value = true

          // Play notification sound
          try {
            const audio = new Audio('/src/sfx/notification sound.mp3')
            audio.volume = 0.5
            audio.play().catch(err => console.log('Audio play failed:', err))
          } catch (err) {
            console.log('Audio error:', err)
          }

          resetTicketForm()
          setTimeout(() => { showSuccessPopup.value = false }, 3000)
        } catch (err) {
          submitMessage.value = err?.message || 'Failed to submit ticket.'
        } finally {
          isSubmitting.value = false
        }
      }



      function buildDetailCard(title, actionText, items) {
        const normalizedItems = Array.from({ length: detailVisibleRows }, (_, i) => items[i] ?? '')

        const child = {
          1: buildText(title, { size: 14, color: 'black' }),
          3: buildText(actionText, { size: 14, color: 'primary' }),
          5: buildDivider({ direction: 'h', color: 'gray200', thickness: '1px', margin: '4px' }),
        }

        normalizedItems.forEach((item, i) => {
          const slot = 9 + (i * 4)
          child[slot] = buildGrid({
            columns: 1,
            rows: 1,
            height: '100%',
            hover: true,
            display: true,
            padding: item ? '10px 12px' : undefined,
            align: item ? { 1: 'center left' } : {},
            child: item
              ? {
                1: buildText(item, { size: 'sm', color: 'gray700' }),
              }
              : {},
          })
        })

        return buildGrid({
          height: '100%',
          columns: 4,
          rows: 5,
          backgroundColor: '#F5F7FB',
          display: true,
          span: {
            1: { colSpan: 2 },
            3: { colSpan: 2 },
            5: { colSpan: 4 },
            9: { colSpan: 4 },
            13: { colSpan: 4 },
          },
          align: {
            1: 'center left',
            3: 'center right',
          },
          child,
        })
      }

      return () => {
        function buildActionTile({ icon, title, subtitle, active = false }) {
          return buildGrid({
            columns: 1,
            rows: 3,
            display: true,
            rowGap: 4,
            padding: '14px 16px',
            radius: '12px',
            border: active ? '2px solid #2563eb' : '1px solid #cbd5e1',
            backgroundColor: active ? '#eff6ff' : '#ffffff',
            align: { 1: 'center left', 2: 'center left', 3: 'center left' },
            child: {
              1: buildIcon(icon, { size: 20, color: active ? '#2563eb' : '#64748b' }),
              2: buildText(title, { size: 'lg', weight: 'bold', color: active ? '#1d4ed8' : 'gray800' }),
              3: buildText(subtitle, { size: 'sm', color: 'gray500' }),
            },
          })
        }

        const mainPage = buildContentGrid({
          columns: 4,
          rows: 7,
          colGap: 18,
          rowGap: 12,
          padding: '24px',
          cellPadding: 0,
          mobileConfig: { columns: 1, rows: 5 },
          tabletConfig: { columns: 2, rows: 4 },
          display: false,
          fillViewport: true,
          align: {
            9: 'center left',
            10: 'center right'
          },
          span: {
            1: { colSpan: 4, rowSpan: 2 },
            9: { colSpan: 4 },
            13: { rowSpan: 2 },
            14: { rowSpan: 2 },
            15: { rowSpan: 2 },
            16: { rowSpan: 2 },
            21: { colSpan: 4 },
            25: { colSpan: 4 }
          },
          child: {
            1: buildHeader({
              title: 'Support Contact',
              subtitle: 'Provide detailed information regarding your system issue. Our technical curators will analyze your request and assign it to the appropriate archivist for resolution.',
              backgroundColor: 'transparent',
              divider: false,
              padding: '30px 24px 22px',
              style: {
                margin: '-24px 0 0 -24px',
                width: 'calc(100% + 48px)',
              },
            }),
            9: buildIconText('iT Support', { icon: 'support', iconSize: 30, iconColor: 'primary', textSize: '2xl', textWeight: 'bold', textColor: 'gray800', gap: '8px', style: { marginLeft: '10px' } }),
            13: buildGrid({
              columns: 1,
              rows: 2,
              display: true,
              align: { 1: 'center', 2: 'center' },
              onPressed: () => openUserDetail(supportMembers[0]),
              hover: true,
              child: {
                1: buildIcon('person', { size: 120, color: '#111827' }),
                2: buildText('Visal', { size: 'lg', weight: 'bold', color: 'gray700', style: { margin: 0 } })
              }
            }),
            14: buildGrid({
              columns: 1,
              rows: 2,
              display: true,
              align: { 1: 'center', 2: 'center' },
              onPressed: () => openUserDetail(supportMembers[1]),
              hover: true,
              child: {
                1: buildIcon('person', { size: 120, color: '#111827' }),
                2: buildText('Piseth', { size: 'lg', weight: 'bold', color: 'gray700', style: { margin: 0 } })
              }
            }),
            15: buildGrid({
              columns: 1,
              rows: 2,
              display: true,
              align: { 1: 'center', 2: 'center' },
              onPressed: () => openUserDetail(supportMembers[2]),
              hover: true,
              child: {
                1: buildIcon('person', { size: 120, color: '#111827' }),
                2: buildText('Pong', { size: 'lg', weight: 'bold', color: 'gray700', style: { margin: 0 } })
              }
            }),
            16: buildGrid({
              columns: 1,
              rows: 2,
              display: true,
              align: { 1: 'center', 2: 'center' },
              onPressed: () => openUserDetail(supportMembers[3]),
              hover: true,
              child: {
                1: buildIcon('person', { size: 120, color: '#111827' }),
                2: buildText('Tykea', { size: 'lg', weight: 'bold', color: 'gray700', style: { margin: 0 } })
              }
            }),
            21: buildIconText('Request Support Tickets', { icon: 'info', iconSize: 30, iconColor: 'primary', textSize: '2xl', textWeight: 'bold', textColor: 'gray800', gap: '8px', style: { marginLeft: '10px' } }),
            25: buildGrid({
              columns: 6,
              rows: 6,
              display: true,
              padding: '18px',
              backgroundColor: '#ffffffff',
              border: '1px solid #e2e8f0',
              radius: 12,
              colGap: 12,
              rowGap: 10,
              span: {
                1: { colSpan: 3 },
                4: { colSpan: 3 },
                7: { colSpan: 6 },
                13: { colSpan: 6 },
                19: { colSpan: 6 },
                25: { colSpan: 3 },
                28: { colSpan: 3 }
              },
              align: {
                28: 'center right',
              },
              child: {
                1: buildGrid({
                  columns: 1,
                  rows: 2,
                  rowGap: 6,
                  display: false,
                  child: {
                    1: buildText('TICKET CATEGORY', { size: 'xs', weight: 'bold', color: 'gray700' }),
                    2: buildDropdown({
                      placeholder: 'Select category',
                      items: [{ text: 'Hardware', value: 'hardware' }, { text: 'Software', value: 'software' }, { text: 'Network', value: 'network' }],
                      value: ticketCategory,
                      width: '100%',
                      height: '40px',
                    }),
                  },
                }),
                4: buildGrid({
                  columns: 1,
                  rows: 4,
                  rowGap: 6,
                  colGap: 8,
                  span: { 1: { colSpan: 1 } },
                  display: false,
                  align: { 2: 'center right' },
                  child: {
                    1: buildText('PRIORITY LEVEL', { size: 'xs', weight: 'bold', color: 'gray700' }),
                    2: buildTapOption({
                      items: [
                        { label: 'Low', value: 'low' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'High', value: 'high' },
                      ],
                      value: priorityLevel.value,
                      onUpdate: (v) => { priorityLevel.value = v },
                      height: '40px',
                      bg: '#f8fafc',
                      selectedBg: '#ffffff',
                      selectedColor: '#1d4ed8',
                      color: '#64748b',
                      style: { border: '1px solid #dbeafe', padding: '0', height: '40px' },
                    }),
                  },
                }),
                7: buildInput({
                  label: 'SUBJECT TITLE',
                  placeholder: 'e.g., Critical failure in database connectivity',
                  full: true,
                  value: subjectTitle,
                  onUpdate: (v) => { subjectTitle.value = v },
                  style: { paddingLeft: '14px' }
                }),
                13: buildInput({
                  label: 'ASSET TAG/ID (OPTIONAL)',
                  placeholder: 'ALX-####-####',
                  full: true,
                  value: assetTag,
                  onUpdate: (v) => { assetTag.value = v },
                  style: { paddingLeft: '14px' }
                }),
                19: buildInput({
                  label: 'DESCRIPTION',
                  placeholder: 'Describe the issue in detail...',
                  full: true,
                  value: issueDescription,
                  onUpdate: (v) => { issueDescription.value = v },
                  style: { paddingLeft: '14px' }
                }),
                28: buildGrid({
                  columns: 2,
                  rows: 1,
                  display: false,
                  child: {
                    1: buildButton('Cancel', { variant: 'outline', size: 'sm', height: '40px', onPressed: resetTicketForm, style: { width: '100%', borderColor: '#eaf2ff', color: '#1d4ed8', background: '#bcd6fb', fontWeight: '600' } }),
                    2: buildButton(isSubmitting.value ? 'Submitting...' : 'Submit', { variant: 'outline', size: 'sm', height: '40px', onPressed: submitTicket, style: { width: '100%', borderColor: '#bcd6fb', color: '#eaf2ff', background: '#1d4ed8', fontWeight: '600' } }),
                  },
                }),
                25: submitMessage.value
                  ? buildText(submitMessage.value, {
                    size: 'sm',
                    color: submitMessage.value.includes('successfully') ? 'success' : 'error',
                    style: { textAlign: 'left', marginTop: '6px' }
                  })
                  : buildText('', { size: 'sm' })
              }
            })
          }
        })

        const successDialog = showSuccessPopup.value ? buildGrid({
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
            backgroundColor: 'rgba(15, 23, 42, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          },
          child: {
            1: buildGrid({
              columns: 1,
              rows: 4,
              display: true,
              rowGap: 16,
              padding: '34px',
              radius: 24,
              backgroundColor: '#ffffff',
              style: { width: '400px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
              align: { 1: 'center', 2: 'center', 3: 'center', 4: 'center' },
              child: {
                1: buildIconContainer({ icon: 'circle-check', colorIcon: '#10b981', colorCon: '#d1fae5', size: '80', radius: '50%', containerStyle: 'square', style: { margin: '0 auto' } }),
                2: buildText('Success!', { size: '3xl', weight: 'bold', color: '#111827' }),
                3: buildText('Ticket successfully submitted.', { size: 'md', color: '#4b5563' }),
                4: submittedTicketId.value ? buildText(`Ticket ID: ${submittedTicketId.value}`, { size: 'sm', color: '#6b7280' }) : buildText('', { size: 'sm' }),
              },
            }),
          },
        }) : null

        const memberPopup = selectedMember.value ? buildGrid({
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
            zIndex: 10060,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          },
          onPressed: () => { selectedMember.value = null },
          child: {
            1: buildGrid({
              columns: 1,
              rows: 6,
              display: true,
              rowGap: 12,
              padding: '34px',
              radius: 28,
              backgroundColor: '#ffffff',
              style: {
                width: '420px',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255,255,255,0.1)'
              },
              align: { 1: 'center', 2: 'center', 3: 'center', 4: 'center', 5: 'center', 6: 'center' },
              onPressed: (e) => { e.stopPropagation() }, // Prevent closing when clicking inside
              child: {
                1: buildIconContainer({ icon: 'person', colorIcon: '#3b82f6', colorCon: '#eff6ff', size: '100', radius: '50%', containerStyle: 'square', style: { margin: '0 auto 10px' } }),
                2: buildText(selectedMember.value.name, { size: '3xl', weight: 'bold', color: '#111827' }),
                3: buildTextBadge(selectedMember.value.role, { color: 'primary', size: 'sm', style: { margin: '0 auto' } }),
                4: buildDivider({ margin: '20px 0' }),
                5: buildGrid({
                  columns: 2,
                  rows: 2,
                  display: true,
                  rowGap: 12,
                  align: { 1: 'center left', 2: 'center right', 3: 'center left', 4: 'center right' },
                  child: {
                    1: buildText('Staff ID', { size: 'sm', color: 'gray500', weight: 'bold' }),
                    2: buildText(selectedMember.value.id, { size: 'sm', color: 'gray800' }),
                    3: buildText('Department', { size: 'sm', color: 'gray500', weight: 'bold' }),
                    4: buildText(selectedMember.value.dept, { size: 'sm', color: 'gray800' }),
                  }
                }),
                6: buildButton('Close Details', {
                  variant: 'outline',
                  color: 'neutral',
                  full: true,
                  style: { marginTop: '24px' },
                  onPressed: () => { selectedMember.value = null }
                }),
              },
            }),
          },
        }) : null

        return h('div', [mainPage, successDialog, memberPopup])
      }
    }
  }
}
