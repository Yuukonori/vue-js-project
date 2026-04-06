import { buildContentGrid, buildGrid, buildIconContainer, buildImage, buildTable, buildText } from '../ui/index.js'
import { USERS } from '../data/users.js'

/**
 * UserListPage(user)
 * @param {{ name: string }} user
 */
export function UserListPage(user) {
  return buildContentGrid({
    columns: 6,
    rows: 2,
    span: {
        1: { colSpan: 2 },
        7: { colSpan: 6 }
    },
    display: 'grid',
    child: {
        1:  buildGrid({
            columns: 6 ,
            rows: 2,
            span: {
                1: { rowSpan: 2 },
                2: { colSpan: 5, rowSpan: 2 }
            },
            align: {
                2: 'center left'
            },
            display: false,
            child: {
                1: buildIconContainer({
                    icon : 'arrow-back',
                    colorIcon : '#6366f1',
                    colorCon : '#e0e7ff',
                    size : '60',
                    radius: '20px',
                    containerStyle : 'square',
                    hover: true,
                    onClick: () => {
                        if (typeof globalThis.__appNavigate === 'function') {
                        globalThis.__appNavigate('/support')
                        }
                    }
                }),
                2: buildText('Users List', {
                    variant: 'h1',
                    color: 'black',
                })
            }
        }),
        7: buildTable({
          columns: [
            { header: 'ID', accessor: 'id', align: 'center', width: '90px' },
            {
              header: 'USER',
              accessor: 'name',
              render: (value, row) => buildGrid({
                columns: 8,
                rows: 1,
                display: false,
                colGap: 8,
                span: {
                  2: { colSpan: 7 },
                },
                align: {
                  1: 'center',
                  2: 'center left',
                },
                child: {
                  1: buildImage(row.avatar, { width: 34, height: 34, circle: true }),
                  2: buildText(String(value), { tag: 'span', size: 'sm', weight: 'semibold', color: 'gray800' }),
                },
              }),
            },
            { header: 'ROLE', accessor: 'role' },
          ],
          data: USERS,
          pageSize: 10,
          style: {
            borderRadius: '14px',
            border: '1px solid #e5e7ee',
          },
        })
    }
  })
}
