import { buildContentGrid, buildGrid, buildIcon, buildIconContainer, buildImage, buildText, radius } from '../ui/index.js'
import { USERS } from '../data/users.js'

/**
 * UserListPage(user)
 * @param {{ name: string }} user
 */
export function UserListPage(user) {
  const rowChildren = {}

  return buildContentGrid({
    columns: 6,
    rows: 2,
    span: {
        1: { colSpan: 2 },
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
        })
    }
  })
}
