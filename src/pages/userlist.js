import { buildContentGrid, buildHeader, buildGrid, buildIconContainer, buildImage, buildTable, buildText } from '../ui/index.js'
import { USERS } from '../data/users.js'

/**
 * UserListPage(user)
 * @param {{ name: string }} user
 */
export function UserListPage(user) {
  return buildContentGrid({
    columns: 6,
    rows: 2,
    padding: '24px',
    cellPadding: 0,
    span: {
        1: { colSpan: 6 },
        7: { colSpan: 6 }
    },
    display: false,
    child: {
        1: buildHeader({
          title: 'Users List',
          rowProps: {
            colGap: 0,
          },
          titleOptions: {
            align: 'left'
          },
          titleStyle: {
            marginLeft: '0px',
          },
          leftNode: buildIconContainer({
            icon: 'arrow-back',
            colorIcon: '#6366f1',
            colorCon: '#e0e7ff',
            size: '50',
            radius: '16px',
            containerStyle: 'square',
            hover: true,
            onPressed: () => {
              if (typeof globalThis.__appNavigate === 'function') {
                globalThis.__appNavigate('/support')
              }
            },
          }),
          backgroundColor: 'white',
          divider: false,
          padding: '30px 24px 22px',
          style: {
            margin: '-24px 0 0 -24px',
            width: 'calc(100% + 48px)',
          },
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
