import { buildContentGrid, buildHeader, buildGrid, buildIconContainer } from '../../ui/index.js'

/**
 * AssetsPage(user)
 * @param {{ name: string }} user
 */
export function NewAssetsForm(user){
    return buildContentGrid({
        columns: 6,
            rows: 2,
            padding: '24px',
            cellPadding: 0,
            span: {
                1: { colSpan: 6 },
                7: { colSpan: 6 }
            },
            display: 'grid',
            child: {
                1: buildHeader({
                  title: 'Register New Assets',
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
                7: buildGrid({
                    
                })
            }
    })
}
