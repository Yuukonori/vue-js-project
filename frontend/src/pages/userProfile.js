import { defineComponent, h, ref } from 'vue'
import {
  buildContentGrid,
  buildGrid,
  buildText,
  buildButton,
  buildCard,
  buildIcon,
  buildDivider,
  buildImage,
  buildTextBadge,
  buildBadge,
  buildIconContainer
} from '../ui/index.js'

export function UserProfilePage(user) {
  return {
    name: 'UserProfilePage',
    setup() {
      const displayName = user?.name || 'Ruki Nasa'
      const displayRole = (user?.role || 'Administrator').toUpperCase()

      const userAvatar = ref('')

      const ImageUpload = () => h('div', {
        style: { width: '100%', height: '100%', position: 'relative' }
      }, [
        h('input', {
          type: 'file',
          accept: 'image/*',
          style: {
            position: 'absolute',
            inset: 0,
            opacity: 0,
            cursor: 'pointer',
            width: '100%',
            height: '100%',
            zIndex: 10
          },
          onChange: (e) => {
            const file = e.target.files?.[0]
            if (file) {
              userAvatar.value = URL.createObjectURL(file)
            }
          }
        }),
        userAvatar.value
          ? h('img', {
            src: userAvatar.value,
            style: { width: '100%', height: '100%', objectFit: 'cover' }
          })
          : buildGrid({
            width: '100%',
            height: '100%',
            align: 'center',
            backgroundColor: '#eef2ff',
            child: {
              1: buildIcon('user', { size: 64, color: '#a5b4fc', strokeWidth: 1.5 })
            }
          })
      ])

      const statCard = (label, count, icon, bgColor, iconColor) => buildGrid({
        columns: 1, rows: 2,
        rowGap: 12,
        padding: '20px',
        backgroundColor: '#f8fafc',
        radius: '2xl',
        child: {
          1: buildGrid({
            width: '40px',
            height: '40px',
            backgroundColor: bgColor,
            radius: 'xl',
            align: 'center',
            child: { 1: buildIcon(icon, { size: 20, color: iconColor }) }
          }),
          2: buildGrid({
            columns: 1, rows: 2,
            rowGap: 2,
            child: {
              1: buildText(count.toString(), { size: '2xl', weight: 'bold', color: 'gray900' }),
              2: buildText(label, { size: 'xs', color: 'gray500', weight: 'medium' })
            }
          })
        }
      })

      const sectionHeader = (iconName, title, iconColor = '#6366f1') => buildGrid({
        columns: 2,
        colGap: 12,
        align: 'center left',
        style: { gridTemplateColumns: 'auto 1fr', marginBottom: '16px' },
        child: {
          1: buildIcon(iconName, { size: 20, color: iconColor }),
          2: buildText(title, { size: 'md', weight: 'bold', color: 'gray900' })
        }
      })

      const accountItem = (iconName, title, subtext, iconBg, iconColor, rightElement) => buildGrid({
        columns: 3,
        padding: '16px 20px',
        colGap: 16,
        style: { gridTemplateColumns: 'auto 1fr auto' },
        align: { 1: 'center', 2: 'center left', 3: 'center right' },
        hover: true,
        cursor: 'pointer',
        backgroundColor: '#f8fafc',
        radius: 'xl',
        child: {
          1: buildGrid({
            width: '40px',
            height: '40px',
            backgroundColor: iconBg,
            radius: 'full',
            align: 'center',
            child: { 1: buildIcon(iconName, { size: 20, color: iconColor }) }
          }),
          2: buildGrid({
            columns: 1, rows: 2,
            rowGap: 2,
            child: {
              1: buildText(title, { size: 'sm', weight: 'bold', color: 'gray900' }),
              2: buildText(subtext, { size: 'xs', color: 'gray500' }),
            }
          }),
          3: rightElement || buildIcon('chevron-right', { size: 16, color: 'gray400' })
        }
      })

      const activityItem = (iconName, title, subtext, time, date, iconBg, iconColor) => buildGrid({
        columns: 3,
        padding: '16px 0',
        colGap: 16,
        style: { gridTemplateColumns: 'auto 1fr auto', borderBottom: '1px solid #f1f5f9' },
        align: { 1: 'center', 2: 'center left', 3: 'center right' },
        child: {
          1: buildGrid({
            width: '40px',
            height: '40px',
            backgroundColor: iconBg,
            radius: 'full',
            align: 'center',
            child: { 1: buildIcon(iconName, { size: 20, color: iconColor }) }
          }),
          2: buildGrid({
            columns: 1, rows: 2,
            rowGap: 2,
            child: {
              1: buildText(title, { size: 'sm', weight: 'bold', color: 'gray900' }),
              2: buildText(subtext, { size: 'xs', color: 'gray500' }),
            }
          }),
          3: buildGrid({
            columns: 1, rows: 2,
            rowGap: 2,
            align: 'right',
            child: {
              1: buildText(time, { size: 'xs', color: 'gray500', weight: 'medium' }),
              2: buildText(date, { size: 'xs', color: 'gray400' }),
            }
          })
        }
      })

      return () => buildContentGrid({
        columns: 2,
        rows: 4,
        rowGap: 24,
        span: { 1: { colSpan: 2, rowSpan: 1 }, 3: { colSpan: 2, rowSpan: 1 }, 7: { colSpan: 2 } },
        padding: '32px 40px',
        display: false,
        fillViewport: true,
        child: {
          // --- HEADER ---
          1: buildGrid({
            columns: 2,
            align: { 1: 'center left', 2: 'center right' },
            style: { gridTemplateColumns: '1fr auto' },
            display: false,
            child: {
              1: buildGrid({
                columns: 1, rows: 2,
                rowGap: 4,
                display: false,
                child: {
                  1: buildText('Profile', { size: '2xl', weight: 'bold', color: 'gray900' }),
                  2: buildText('Manage your account preferences and security', { size: 'sm', color: 'gray500' })
                }
              }),
              2: buildButton('Edit Profile', {
                variant: 'solid',
                color: 'primary',
                size: 'sm',
                icon: buildIcon('edit', { size: 16 }),
                style: { fontWeight: '600' }
              })
            }
          }),

          // --- TOP CARD (User details & Stats) ---
          3: buildCard({
            pad: '32px',
            radius: '2xl',
            shadow: 'sm',
            border: '1px solid #e2e8f0',
            child: {
              1: buildGrid({
                columns: 2,
                colGap: 48,
                align: 'center left',
                style: { gridTemplateColumns: '1fr 1fr' },
                display: false,
                child: {
                  // Left: Avatar and Info
                  1: buildGrid({
                    columns: 2,
                    colGap: 24,
                    align: 'center left',
                    style: { gridTemplateColumns: 'auto 1fr' },
                    display: false,
                    child: {
                      // Avatar
                      1: buildGrid({
                        width: '140px',
                        height: '140px',
                        position: 'relative',
                        display: false,
                        child: {
                          1: buildGrid({
                            width: '100%',
                            height: '100%',
                            radius: 'full',
                            overflow: 'hidden',
                            backgroundColor: '#e0e7ff',
                            display: false,
                            child: {
                              1: ImageUpload()
                            }
                          }),
                          // Camera Button
                          2: buildGrid({
                            position: 'absolute',
                            bottom: '4px',
                            right: '4px',
                            width: '36px',
                            height: '36px',
                            backgroundColor: '#ffffff',
                            radius: 'full',
                            shadow: 'sm',
                            align: 'center',
                            border: '1px solid #e2e8f0',
                            cursor: 'pointer',
                            hover: true,
                            display: false,
                            child: { 1: buildIcon('camera', { size: 18, color: '#6366f1' }) }
                          })
                        }
                      }),
                      // Info
                      2: buildGrid({
                        columns: 1, rows: 2,
                        rowGap: 16,
                        display: false,
                        child: {
                          1: buildGrid({
                            columns: 1, rows: 2,
                            rowGap: 4,
                            display: false,
                            child: {
                              1: buildText(displayName, { size: 'xl', weight: 'bold', color: 'gray900' }),
                              2: buildText(displayRole, { size: 'xs', weight: 'bold', color: '#6366f1', style: { letterSpacing: '0.5px' } }),
                            }
                          }),
                          2: buildGrid({
                            columns: 1, rows: 3,
                            rowGap: 8,
                            display: false,
                            child: {
                              1: buildGrid({
                                columns: 2, colGap: 8, align: 'center left', style: { gridTemplateColumns: 'auto 1fr' }, display: false,
                                child: { 1: buildIcon('mail', { size: 16, color: 'gray400' }), 2: buildText('rukinasa@example.com', { size: 'sm', color: 'gray600' }) }
                              }),
                              2: buildGrid({
                                columns: 2, colGap: 8, align: 'center left', style: { gridTemplateColumns: 'auto 1fr' }, display: false,
                                child: { 1: buildIcon('calendar', { size: 16, color: 'gray400' }), 2: buildText('Joined on May 20, 2024', { size: 'sm', color: 'gray600' }) }
                              }),
                              3: buildGrid({
                                columns: 2, colGap: 8, align: 'center left', style: { gridTemplateColumns: 'auto 1fr' }, display: false,
                                child: { 1: buildIcon('map-pin', { size: 16, color: 'gray400' }), 2: buildText('Phnom Penh, Cambodia', { size: 'sm', color: 'gray600' }) }
                              })
                            }
                          })
                        }
                      })
                    }
                  }),
                }
              })
            }
          }),
          5: buildCard({
            pad: '32px',
            radius: '2xl',
            shadow: 'sm',
            border: '1px solid #e2e8f0',
            style: { height: '100%' },
            child: {
              1: buildGrid({
                columns: 1, rows: 3, rowGap: 16, display: false,
                child: {
                  1: buildGrid({
                    columns: 2, colGap: 12, align: 'center left', style: { gridTemplateColumns: 'auto 1fr' }, display: false,
                    child: {
                      1: buildGrid({
                        width: '36px', height: '36px', radius: 'full', backgroundColor: '#eef2ff', align: 'center', display: false,
                        child: { 1: buildIcon('user', { size: 18, color: '#6366f1' }) }
                      }),
                      2: buildText('About', { size: 'md', weight: 'bold', color: 'gray900' })
                    }
                  }),
                  2: buildText('System administrator with full access to platform management, user oversight, and system configuration.', { size: 'sm', color: 'gray500', style: { lineHeight: '1.6' } }),
                  3: buildGrid({
                    padding: '16px 20px',
                    backgroundColor: '#f8fafc',
                    radius: 'xl',
                    columns: 2,
                    colGap: 16,
                    align: 'center left',
                    style: { gridTemplateColumns: 'auto 1fr', marginTop: '8px' },
                    display: true,
                    child: {
                      1: buildGrid({
                        width: '32px', height: '32px', backgroundColor: '#e2e8f0', radius: 'full', align: 'center', display: false,
                        child: { 1: buildIcon('info', { size: 16, color: '#475569' }) }
                      }),
                      2: buildGrid({
                        columns: 1, rows: 2, rowGap: 4, display: false, child: {
                          1: buildText('Version', { size: 'sm', weight: 'bold', color: 'gray900' }),
                          2: buildText('1.1', { size: 'xs', color: 'gray500' })
                        }
                      })
                    }
                  })
                }
              })
            }
          }),
          6: buildCard({
            pad: '32px',
            radius: '2xl',
            shadow: 'sm',
            border: '1px solid #e2e8f0',
            style: { height: '100%' },
            child: {
              1: buildGrid({
                columns: 1, rows: 3, rowGap: 16, display: false,
                child: {
                  1: buildGrid({
                    columns: 2, colGap: 12, align: 'center left', style: { gridTemplateColumns: 'auto 1fr' }, display: false,
                    child: {
                      1: buildGrid({
                        width: '36px', height: '36px', radius: 'full', backgroundColor: '#eef2ff', align: 'center', display: false,
                        child: { 1: buildIcon('user', { size: 18, color: '#6366f1' }) }
                      }),
                      2: buildText('Acount', { size: 'md', weight: 'bold', color: 'gray900' })
                    }
                  }),
                  2: buildGrid({
                    padding: '16px 20px',
                    backgroundColor: '#f8fafc',
                    radius: 'xl',
                    columns: 2,
                    colGap: 16,
                    align: 'center left',
                    style: { gridTemplateColumns: 'auto 1fr', marginTop: '8px' },
                    display: true,
                    child: {
                      1: buildIconContainer({
                        icon: 'lock',
                        iconSize: 12,
                        colorIcon: '#475569',
                        size: 32,
                        colorCon: '#e2e8f0',
                        containerStyle: 'circle'
                      }),
                      2: buildGrid({
                        columns: 1, rows: 2, rowGap: 4, display: false, style: { marginLeft: '10px' }, child: {
                          1: buildText('Change Password', { size: 'sm', weight: 'bold', color: 'gray900' }),
                          2: buildText('Update your passsword before it expires.', { size: 'xs', color: 'gray500' })
                        }
                      })
                    }
                  }),
                  3: buildGrid({
                    padding: '16px 20px',
                    backgroundColor: '#f8fafc',
                    radius: 'xl',
                    columns: 2,
                    colGap: 16,
                    align: 'center left',
                    style: { gridTemplateColumns: 'auto 1fr', marginTop: '8px' },
                    display: true,
                    child: {
                      1: buildIconContainer({
                        icon: 'lock',
                        iconSize: 12,
                        colorIcon: '#475569',
                        size: 32,
                        colorCon: '#e2e8f0',
                        containerStyle: 'circle'
                      }),
                      2: buildGrid({
                        columns: 1, rows: 2, rowGap: 4, display: false, style: { marginLeft: '10px' }, child: {
                          1: buildText('Change Password', { size: 'sm', weight: 'bold', color: 'gray900' }),
                          2: buildText('Update your passsword before it expires.', { size: 'xs', color: 'gray500' })
                        }
                      })
                    }
                  }),
                }
              })
            }
          }),
          7: buildGrid({
            columns: 2,
            rows: 1,
            display: true,
            align: { 1: 'center left' },
            style: { gridTemplateColumns: 'auto 1fr' },
            child: {
              1: buildIconContainer({
                icon: 'logout',
                iconSize: 12,
                colorIcon: '#475569',
                size: 32,
                colorCon: '#e2e8f0',
                containerStyle: 'circle'
              }),
              2: buildGrid({
                columns: 1, rows: 2, rowGap: 4, display: false, style: { marginLeft: '10px' }, child: {
                  1: buildText('Logout', { size: 'sm', weight: 'bold', color: 'gray900' }),
                  2: buildText('Logout your account.', { size: 'xs', color: 'gray500' })
                }
              })
            }
          })
        }
      })
    }
  }
}
