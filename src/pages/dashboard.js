import { buildContentGrid, buildGrid, buildText } from '../ui/index.js'

/**
 * DashboardPage(user)
 * @param {{ name: string }} user
 */
export function DashboardPage(user) {
  return buildContentGrid({
    columns: 4,
    rows:    3,
    colGap:  12,
    rowGap:  12,
    padding: '24px',
    cellPadding: 0,
    mobileConfig: { columns: 1, rows: 3 },
    tabletConfig: { columns: 2, rows: 3 },
    display: 'grid',
    child: {
      1: buildGrid({
        columns: 1, rows: 1,
        padding: '20px',
        child: {
          1: buildText('Dashboard', { variant: 'h2', weight: 'bold', color: 'gray800' }),
          2: buildText('Welcome back, ' + user.name + '!', { size: 'base', color: 'gray400' }),
        },
      }),
    },
    span: {
      1: { colSpan: 4, rowSpan: 1 },
    },
  })
}