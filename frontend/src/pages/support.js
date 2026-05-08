import { computed, defineComponent, h, ref } from 'vue'
import { buildImageProfile, buildButton as baseBuildButton, buildContentGrid, buildDivider, buildDropdown, buildFileUpload, buildGrid, buildHeader, buildIcon, buildImage, buildInput, buildTable, buildText, GridSpan, spacing, colors, buildIconTextContainer, buildTextBadge, buildIconText, buildTapOption } from '../ui/index.js'
import { USERS } from '../data/users.js'
import { formatLastUpdate } from '../lastUpdate.js'

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

      const users = USERS

      const defaultVisibleCount = 5
      const maxSupportUsers = 10
      const showMoreClicks = ref(0)
      const detailVisibleRows = 2
      const lastUpdatedAt = new Date(Date.now() - (4 * 60 * 1000))
      const ticketCategory = ref('hardware')
      const priorityLevel = ref('low')
      const severityLevel = ref('low')
      const selectedUploadFiles = ref([])
      const supportVisibleCount = computed(() => (showMoreClicks.value === 0 ? defaultVisibleCount : maxSupportUsers))
      const visibleUsers = computed(() => users.slice(0, supportVisibleCount.value))

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
        alert(`User Detail\n\nName: ${member.name}\nRole: ${member.role}\nID: ${member.id}`)
      }

      function buildUserRows() {
        const child = {}

        return buildGrid({
          columns: 1,
          rows: Math.max(visibleUsers.value.length, 1),
          display: false,
          rowGap: 0,
          child,
        })
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

        return buildContentGrid({
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
              backgroundColor: 'white',
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
              onPressed: () => { },
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
              onPressed: () => { },
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
              onPressed: () => { },
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
              onPressed: () => { },
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
                25: { colSpan: 6 },
                31: { colSpan: 3 },
                34: { colSpan: 3 }
              },
              align: {
                37: 'center right',
                40: 'center right',
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
                      value: priorityLevel,
                      height: '40px',
                      bg: '#f8fafc',
                      selectedBg: '#ffffff',
                      selectedColor: '#1d4ed8',
                      color: '#64748b',
                      style: { border: '1px solid #dbeafe', padding: '0', height: '40px' },
                    }),
                  },
                }),
                7: buildInput({ label: 'SUBJECT TITLE', placeholder: 'e.g., Critical failure in database connectivity', full: true, style: { paddingLeft: '14px' } }),
                13: buildInput({ label: 'ASSET TAG/ID (OPTIONAL)', placeholder: 'ALX-####-####', full: true, style: { paddingLeft: '14px' } }),
                19: buildInput({ label: 'DESCRIPTION', placeholder: 'Describe the issue in detail...', full: true, style: { paddingLeft: '14px' } }),
                25: buildGrid({
                  columns: 1,
                  rows: 1,
                  display: false,
                  child: {
                    1: buildFileUpload({
                      title: 'FILE UPLOAD',
                      hint: 'Drag and drop diagnostic logs or screenshots here',
                      maxSizeText: 'MAX FILE SIZE: 25MB',
                      accept: '.png,.jpg,.jpeg,.pdf,.txt,.log,.csv,.doc,.docx,.xls,.xlsx',
                      multiple: true,
                      files: selectedUploadFiles.value,
                      onPressed: () => {
                        // Optional hook before picker opens (analytics/custom action).
                      },
                      onUpdate: (files) => {
                        selectedUploadFiles.value = files
                      },
                    }),
                  },
                }),
                34: buildGrid({
                  columns: 2,
                  rows: 1,
                  display: false,
                  child: {
                    1: buildButton('Cancel', { variant: 'outline', size: 'sm', height: '40px', style: { width: '100%', borderColor: '#eaf2ff', color: '#1d4ed8', background: '#bcd6fb', fontWeight: '600' } }),
                    2: buildButton('Submit', { variant: 'outline', size: 'sm', height: '40px', style: { width: '100%', borderColor: '#bcd6fb', color: '#eaf2ff', background: '#1d4ed8', fontWeight: '600' } }),
                  },
                }),
                34: buildGrid({
                  columns: 2,
                  rows: 1,
                  display: false,
                  child: {
                    1: buildButton('Cancel', { variant: 'outline', size: 'sm', height: '40px', style: { width: '100%', borderColor: '#eaf2ff', color: '#1d4ed8', background: '#bcd6fb', fontWeight: '600' } }),
                    2: buildButton('Submit', { variant: 'outline', size: 'sm', height: '40px', style: { width: '100%', borderColor: '#bcd6fb', color: '#eaf2ff', background: '#1d4ed8', fontWeight: '600' } }),
                  }
                })
              }
            })
          }
        })
      }
    }
  }
}
