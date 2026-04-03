import { computed, defineComponent, h, ref } from 'vue'
import { buildBadge, buildButton as baseBuildButton, buildContentGrid, buildDivider, buildGrid, buildIcon, buildImage, buildTable, buildText, GridSpan, spacing, colors } from '../ui/index.js'
import { USERS } from '../data/users.js'

/**
 * SupportPage(user)
 * @param {{ name: string }} user
 */
export function SupportPage(user) {
  return h(defineComponent({
    name: 'SupportPageContent',
    setup() {
      function buildButton(label, options = {}) {
        return baseBuildButton(label, {
          ...options,
          color: options.color ?? options.Color,
          onClick: options.onClick ?? options.onclick,
        })
      }

      const users = USERS

      const defaultVisibleCount = 5
      const maxSupportUsers = 10
      const showMoreClicks = ref(0)
      const detailVisibleRows = 2
      const assignedAssets = ['MacBook Pro M2 (42)', 'Cisco Edge Switch']
      const repairHistory = ['Ticket #12345 - Display Flicker']

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

//------------Function-----------------//        

//------------Active Staff-----------------//

        visibleUsers.value.forEach((member, index) => {
          child[index + 1] = buildGrid({
            columns: 6,
            rows: 1,
            display: true,
            padding: '10px 12px',
            hovered: true,
            onPressed: () => openUserDetail(member),
            border: 'none',
            borderRadius: '8px',
            align: {
              1: 'center',
              2: 'center left',
              6: 'center',
            },
            span: {
              2: { colSpan: 4, rowSpan: 1 },
            },
            child: {
              1: buildImage(member.avatar, { width: 42, height: 42, circle: true }),
              2: buildGrid({
                columns: 1,
                rows: 2,
                display: false,
                rowGap: 2,
                child: {
                  1: buildText(member.name, { size: 'sm', weight: 'semibold', color: 'gray800' }),
                  2: buildText(member.role, { size: 'xs', color: 'gray500' }),
                },
              }),
              6: buildText('>', { size: 'sm', color: 'gray400' }),
            },
            style: {
              borderBottom: index === visibleUsers.value.length - 1 ? 'none' : '1px solid #e5e7ee',
            },
          })
        })

// ---------Active Stuff-----------------//

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
            hovered: true,
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
          display: 'grid',
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
        return buildContentGrid({
        columns: 4,
        rows: 4,
        colGap: 12,
        rowGap: 12,
        padding: '24px',
        cellPadding: 0,
        mobileConfig: { columns: 1, rows: 5 },
        tabletConfig: { columns: 2, rows: 4 },
        display: false,
        align: {
          1: 'center left',
          4: 'center',
          9: 'center',
          10: 'center'
        },
        span: {
          1: { colSpan: 3, rowSpan: 1 },
          5: { colSpan: 4 },
          9: { rowSpan: 2 },
          10: { colSpan: 3, rowSpan: 2 }
        },
        child: {
          1: buildGrid({
            columns: 1,
            rows: 2,
            padding: '20px',
            display: false,
            child: {
              1: buildText('User Directory', { variant: 'h1', weight: 'bold', color: 'gray800' }),
              2: buildText(
                'System-wide management of people, their assigned hardware, and historical system interactions',
                { size: 'base', color: 'gray400' },
              ),
            },
          }),
          5: buildDivider({direction: 'h', color: 'gray200', thickness: '1px', margin: '4' }),
          9: buildGrid({
            columns: 2,
            rows: 4,
            height: '100%',
            padding: '14px',
            rowGap: 10,
            span: {
                1: { colSpan: 2 },
                3: { colSpan: 2 },
                7: { colSpan: 2 },
            },
            align: {
                1: 'center',
                7: 'center'
            },
            display: true,
            child: {
              1: buildText(`ACTIVE STAFF (${users.length})`, {
                variant: 'overline',
                color: 'gray500',
                weight: 'semibold',
                letterSpacing: '1px',
              }),
              3: buildUserRows(),
              7: buildButton('Show More',
                {
                    Color: 'primary',
                    size: 'md',
                    onclick: onShowMoreUsers
                }
              ),
            },
          }),
          10: buildGrid({
            width: '90%',
            columns: 4,
            rows: 4,
            height: '100%',
            align: {
                5: 'center',
                7: 'center',
                9: 'center left',
                11: 'center right'
            },
            span: {
                1: { colSpan: 4 },
                5: { colSpan: 2 },
                7: { colSpan: 2 },
                9: { colSpan: 2 },
                11: { colSpan: 2 },
                13: { colSpan: 4 }
            },
            display: 'grid',
            child: {
                1: buildGrid({
                    columns: 6,
                    rows: 2,
                    display: false,
                    span: {
                        1: { rowSpan: 2 },
                        2: { colSpan: 3 },
                        8: { colSpan: 3 }
                    },
                    align: {
                        1: 'center right',
                        2: 'end left',
                        8: 'startr left'
                    },
                    child: {
                        1: buildIcon('profile', { size: 100, color: 'primary' }),
                        2: buildText('Username', { variant: 'h2', weight: 'bold', color: 'gray800' }),
                        8: buildText('role: Admin IT', { variant: 'p', color: 'gray800' })
                    }
                }),
                5: buildGrid({
                    height: '100%',
                    width: '95%',
                    columns: 4,
                    rows: 5,
                    backgroundColor: '#F5F7FB',
                    display: true,
                    span: {
                        1: { colSpan: 2 },
                        3: { colSpan: 2 },
                        5: { colSpan: 4 },
                        9: { colSpan: 4, rowSpan: 2 },
                        13: { colSpan: 4 }
                    },
                    align: {
                        1: 'center left',
                        3: 'center right'
                    },
                    child: {
                        1: buildText('Assigned Assets', {
                            size: 14,
                            color: 'black'
                        }),
                        3: buildText('1 ACTIVE', {
                            size: 14,
                            color: 'primary'
                        }),
                        5: buildDivider({ direction: 'h', color: 'gray200', thickness: '1px', margin: '4px' }),
                        9: buildGrid({
                            columns: 12, rows: 2,
                            height: '100%',
                            hovered: true,
                            padding: '12px',
                            display: true,
                            align: {
                                1: 'center left',
                                2: 'center left',
                                12: 'center',
                            },
                            span: {
                                1: { rowSpan: 2 },
                                2: { colSpan: 10 },
                                12: { rowSpan: 2 },
                                14: { colSpan: 10 },
                            },
                            onPressed: () => alert('View Expiring Assets clicked'),
                            child: {
                                1: buildGrid({
                                    columns: 1, rows: 1,
                                    display: true,
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '8px',
                                    child: {
                                        1: buildIcon('laptop', { size: 40, color: '#7a7600' }),
                                    },
                                }),
                                2: buildText('MacBook Pro M2', {
                                    tag: 'div',
                                    size: '16px',
                                    weight: 'bold',
                                    color: 'gray800',
                                }),
                                12: buildIcon('chevron-right', { size: 26, color: 'gray300' }),
                                14: buildText('ACTIVE', {
                                    tag: 'div',
                                    size: '14px',
                                    weight: 'semibold',
                                    color: 'gray400',
                                }),
                            },
                        }),
                        13: buildGrid({
                           columns: 12, rows: 2,
                            height: '100%',
                            hovered: true,
                            padding: '12px',
                            display: true,
                            align: {
                                1: 'center left',
                                2: 'center left',
                                12: 'center',
                            },
                            span: {
                                1: { rowSpan: 2 },
                                2: { colSpan: 10 },
                                12: { rowSpan: 2 },
                                14: { colSpan: 10 },
                            },
                            onPressed: () => alert('View Expiring Assets clicked'),
                            child: {
                                1: buildGrid({
                                    columns: 1, rows: 1,
                                    display: true,
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '8px',
                                    child: {
                                        1: buildIcon('laptop', { size: 40, color: '#7a7600' }),
                                    },
                                }),
                                2: buildText('MacBook Pro M1', {
                                    tag: 'div',
                                    size: '16px',
                                    weight: 'bold',
                                    color: 'gray800',
                                }),
                                12: buildIcon('chevron-right', { size: 26, color: 'gray300' }),
                                14: buildText('INACTIVE', {
                                    tag: 'div',
                                    size: '14px',
                                    weight: 'semibold',
                                    color: 'gray400',
                                }),
                            },
                        })
                    }
                }),
                7:  buildGrid({
                    height: '100%',
                    width: '95%',
                    columns: 4,
                    rows: 5,
                    backgroundColor: '#F5F7FB',
                    display: true,
                    span: {
                        1: { colSpan: 2 },
                        3: { colSpan: 2 },
                        5: { colSpan: 4 },
                        9: { colSpan: 4 },
                        13: { colSpan: 4 }
                    },
                    align: {
                        1: 'center left',
                        3: 'center right'
                    },
                    child: {
                        1: buildText('Repair History', {
                            size: 14,
                            color: 'black'
                        }),
                        3: buildText('VIEW ALL', {
                            size: 14,
                            color: 'primary'
                        }),
                        5: buildDivider({ direction: 'h', color: 'gray200', thickness: '1px', margin: '4px' }),
                        9: buildGrid({
                            columns: 12, rows: 2,
                            height: '100%',
                            hovered: true,
                            padding: '12px',
                            display: true,
                            align: {
                                1: 'center left',
                                2: 'center left',
                                12: 'center',
                            },
                            span: {
                                1: { rowSpan: 2 },
                                2: { colSpan: 10 },
                                12: { rowSpan: 2 },
                                14: { colSpan: 10 },
                            },
                            onPressed: () => alert('View Expiring Assets clicked'),
                            child: {
                                1: buildGrid({
                                    columns: 1, rows: 1,
                                    display: true,
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '8px',
                                    child: {
                                        1: buildIcon('laptop', { size: 40, color: '#7a7600' }),
                                    },
                                }),
                                2: buildText('MacBook Pro M2', {
                                    tag: 'div',
                                    size: '16px',
                                    weight: 'bold',
                                    color: 'gray800',
                                }),
                                12: buildIcon('chevron-right', { size: 26, color: 'gray300' }),
                                14: buildText('DONE CHECKING OFFICE', {
                                    tag: 'div',
                                    size: '14px',
                                    weight: 'semibold',
                                    color: 'gray400',
                                }),
                            },  
                        }),
                        13: buildGrid({
                            columns: 1,
                            rows: 1,
                            height: '100%',
                            keepStructure: true,
                            emptyRowHeight: 85,
                            hovered: true,
                            display: false
                        }),
                    }
                }),
                9: buildGrid({
                    columns: 1,
                    rows: 1,
                    display: false,
                    height: '52px',
                    align: {
                        1: 'end left',
                    },
                    child: {
                        1: buildText('Security & Activity Log', {
                            size: 14,
                            color: 'gray800',
                        }),
                    },
                }),
                11: buildGrid({
                    columns: 1,
                    rows: 1,
                    display: false,
                    height: '52px',
                    align: {
                        1: 'end right',
                    },
                    child: {
                        1: buildText('LAST SEEN: 4MIN AGO', {
                            size: 14,
                            color: 'gray800',
                        }),
                    },
                }),
                13: buildTable({
                    columns: [
                        { header: 'EVENT DESCRIPTION', accessor: 'event' },
                        { header: 'ID ADDRESS', accessor: 'address' },
                        { header: 'LOCATION', accessor: 'location', align: 'center'},
                        { header: 'TIMESTAMP', accessor: 'time', align: 'center' }
                    ],
                    data: [
                        { event: 'Succesful System Login', address: '192.168.1.104', location: 'Phnom Penh', time: 'Today, 09:00am' },
                        { event: 'Password Update Request', address: '192.168.1.104', location: 'Phnom Penh', time: 'Today, 08:00am' },
                        { event: 'Assets Status: (In Repair)', address: '192.168.1.104', location: 'Phnom Penh', time: 'Yesterday, 16:00pm' },
                    ],
                    rowHover: true,
                    onRowClick: (row) => alert(`Clicked ticket ${row.event}: ${row.address} (${row.location})`),
                        })
                    },
                })
            }
          })
        }
      }
    })
)}
