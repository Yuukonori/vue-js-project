import { defineComponent, h, ref } from 'vue'
import {
  buildContentGrid,
  buildGrid,
  buildImage,
  buildText,
  buildButton,
  buildCard,
  buildIcon,
  buildDivider,
  buildDropdown,
  buildFileUpload
} from '../ui/index.js'

export function UserProfilePage(user) {
  return {
    name: 'UserProfilePage',
    setup() {
      const displayName = user?.name || 'Ruki Nasa'
      const displayRole = (user?.role || 'Administrator').toUpperCase()

      const targetEmployee = ref('myself')
      const employees = [
        { text: 'Myself (Current user)', value: 'myself' },
        { text: 'San Visal', value: 'visal' },
      ]

      const sectionLabel = (text) => buildText(text, {
        size: 'sm',
        weight: 'bold',
        color: 'gray800',
        style: { marginBottom: '8px', marginLeft: '4px' }
      })

      return () => buildContentGrid({
        columns: 1,
        rows: 6,
        padding: '32px 40px',
        rowGap: 8,
        display: false,
        fillViewport: true,
        child: {
          // --- PROFILE SECTION ---
          1: sectionLabel('Profile'),
          2: buildCard({
            pad: '4',
            radius: 'xl',
            shadow: 'sm',
            headerRight: buildButton('Edit Profile', {
              variant: 'ghost',
              color: 'primary',
              size: 'sm',
              icon: buildIcon('edit', { size: 16 }),
              style: { fontWeight: '600' }
            }),
            child: {
              1: buildGrid({
                columns: 1,
                rows: 2,
                rowGap: 2,
                display: false,
                child: {
                  1: buildText(displayName, { size: 'lg', weight: 'bold', color: 'gray900' }),
                  2: buildText(displayRole, { size: 'xs', weight: 'semibold', color: 'gray500', style: { letterSpacing: '0.5px' } }),
                }
              })
            }
          }),

          // --- ABOUT ---
          3: sectionLabel('About'),
          4: buildCard({
            pad: '4',
            radius: 'xl',
            shadow: 'sm',
            child: {
              1: buildGrid({
                columns: 2,
                rows: 1,
                colGap: 16,
                display: false,
                style: { gridTemplateColumns: 'auto 1fr' },
                align: { 1: 'center', 2: 'center left' },
                child: {
                  1: buildGrid({
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#f8fafc',
                    radius: 'lg',
                    border: '1px solid #f1f5f9',
                    align: 'center',
                    child: { 1: buildIcon('info', { size: 20, color: 'gray600' }) }
                  }),
                  2: buildGrid({
                    columns: 1,
                    rows: 2,
                    display: false,
                    child: {
                      1: buildText('Version', { size: 'sm', weight: 'bold', color: 'gray800' }),
                      2: buildText('1.3', { size: 'xs', color: 'gray500' }),
                    }
                  })
                }
              })
            }
          }),

          // --- ACCOUNT ---
          5: sectionLabel('Account'),
          6: buildCard({
            pad: '0',
            radius: 'xl',
            shadow: 'sm',
            child: {
              1: buildGrid({
                columns: 1,
                rows: 3,
                display: false,
                child: {
                  1: buildGrid({
                    columns: 3,
                    rows: 1,
                    padding: '16px 20px',
                    colGap: 16,
                    display: false,
                    style: { gridTemplateColumns: 'auto 1fr auto' },
                    align: { 1: 'center', 2: 'center left', 3: 'center' },
                    hover: true,
                    cursor: 'pointer',
                    child: {
                      1: buildGrid({
                        width: '36px',
                        height: '36px',
                        backgroundColor: '#f5f3ff',
                        radius: 'lg',
                        align: 'center',
                        child: { 1: buildIcon('lock', { size: 18, color: '#6366f1' }) }
                      }),
                      2: buildGrid({
                        columns: 1,
                        rows: 2,
                        display: false,
                        child: {
                          1: buildText('Change Password', { size: 'sm', weight: 'bold', color: 'gray800' }),
                          2: buildText('Update your password before it expires', { size: 'xs', color: 'gray500' }),
                        }
                      }),
                      3: buildIcon('chevron-right', { size: 16, color: 'gray400' })
                    }
                  }),
                  2: buildDivider({ margin: '0' }),
                  3: buildGrid({
                    columns: 2,
                    rows: 1,
                    padding: '16px 20px',
                    colGap: 16,
                    display: false,
                    style: { gridTemplateColumns: 'auto 1fr' },
                    align: { 1: 'center', 2: 'center left' },
                    hover: true,
                    cursor: 'pointer',
                    child: {
                      1: buildIcon('logout', { size: 18, color: '#ef4444' }),
                      2: buildText('Log Out', { size: 'sm', weight: 'bold', color: '#ef4444' })
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  }
}
