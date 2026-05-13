import { defineComponent, h, ref, onMounted, computed } from 'vue'
import { authFetch } from '../utils/auth.js'
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
  buildIconContainer,
  buildInput,
  buildTextbox,
  buildImageUpload
} from '../ui/index.js'

export function UserProfilePage(user) {
  return {
    name: 'UserProfilePage',
    setup() {
      const displayName = user?.name || 'Ruki Nasa'
      const displayRole = (user?.role || 'Administrator').toUpperCase()

      const isEditModalOpen = ref(false)
      const editForm = ref({
        name: user?.name || '',
        email: user?.email || '',
        location: user?.location || 'Phnom Penh, Cambodia',
        about: user?.about || ''
      })

      const userAvatar = ref(user?.avatar || '')
      const is2FAEnabled = ref(false)
      const showLogoutModal = ref(false)
      const isPasswordModalOpen = ref(false)
      const passwordForm = ref({ oldPassword: '', newPassword: '', confirmPassword: '' })
      const isSavingPassword = ref(false)
      const showOldPassword = ref(false)
      const showNewPassword = ref(false)
      const showConfirmPassword = ref(false)

      // Listen for global updates (e.g. from Support page)
      onMounted(() => {
        window.addEventListener('user-updated', fetchUserData)
      })

      // State for the displayed user data
      const displayedUser = ref({ ...user })
      const isLoading = ref(true)

      const formattedJoinedDate = computed(() => {
        const date = displayedUser.value.created_at || displayedUser.value.createdAt
        if (!date) return 'May 12, 2026'
        try {
          return new Date(date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        } catch {
          return 'May 12, 2026'
        }
      })

      const fetchUserData = async () => {
        isLoading.value = true
        try {
          const urlParams = new URLSearchParams(window.location.search)
          const userId = urlParams.get('id')
          const endpoint = userId ? `/api/users/${userId}` : '/api/users/profile/me'

          const res = await authFetch(endpoint)
          if (!res || !res.ok) {
            console.error('fetchUserData: request failed', res?.status)
            return
          }
          const data = await res.json()
          if (data && !data.error) {
            displayedUser.value = data
            // If viewing self, update edit form and avatar
            if (!userId || String(userId) === String(user?.id)) {
              editForm.value = {
                name: data.name || '',
                email: data.email || '',
                location: data.location || 'Phnom Penh, Cambodia',
                about: data.about || ''
              }
              userAvatar.value = data.avatar || ''

              // Update local storage to keep sidebar in sync
              const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
              localStorage.setItem('user', JSON.stringify({ ...currentUser, ...data, name: data.name }))
              window.dispatchEvent(new Event('storage'))
            }
          }
        } catch (err) {
          console.error('Failed to fetch user data:', err)
        } finally {
          isLoading.value = false
        }
      }

      onMounted(fetchUserData)

      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      const urlParams = new URLSearchParams(window.location.search)
      const isMe = ref(!urlParams.get('id') || String(urlParams.get('id')) === String(currentUser?.id))
      const isAdmin = ref(
        String(currentUser?.role || '').toLowerCase() === 'admin' ||
        String(currentUser?.role || '').toLowerCase() === 'administrator' ||
        String(currentUser?.role || '').toLowerCase() === 'super admin'
      )
      const canEdit = ref(isMe.value || isAdmin.value)

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
            child: { 1: buildIcon(icon, { size: 24, color: iconColor }) }
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
            child: { 1: buildIcon(iconName, { size: 24, color: iconColor }) }
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

      const closeEditModal = () => { isEditModalOpen.value = false }
      const openEditModal = () => { isEditModalOpen.value = true }
      const isSaving = ref(false)

      const saveProfile = async () => {
        if (!canEdit.value) {
          alert('You do not have permission to edit this profile.')
          return
        }
        try {
          isSaving.value = true
          const payload = {
            name: editForm.value.name,
            email: editForm.value.email,
            location: editForm.value.location,
            about: editForm.value.about,
            avatar: userAvatar.value
          }
          // If editing someone else (must be admin), we need a different endpoint or a param
          const urlParams = new URLSearchParams(window.location.search)
          const userId = urlParams.get('id')
          const endpoint = userId ? `/api/users/${userId}` : '/api/users/profile'

          const res = await authFetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
          if (!res || !res.ok) {
            const errData = res ? await res.json().catch(() => ({})) : {}
            alert('Failed to update profile: ' + (errData.error || `Server error ${res?.status}`))
            return
          }
          const data = await res.json()
          if (data && !data.error) {
            await fetchUserData()
            window.dispatchEvent(new Event('storage'))
            window.dispatchEvent(new Event('user-updated'))
            closeEditModal()
          } else {
            alert('Failed to update profile: ' + (data?.error || 'Unknown error'))
          }
        } catch (err) {
          console.error(err)
          alert('Failed to update profile: ' + err.message)
        } finally {
          isSaving.value = false
        }
      }

      const closePasswordModal = () => {
        isPasswordModalOpen.value = false
        passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
        showOldPassword.value = false
        showNewPassword.value = false
        showConfirmPassword.value = false
      }

      const savePassword = async () => {
        if (!passwordForm.value.oldPassword || !passwordForm.value.newPassword) {
          alert('Please fill in all fields')
          return
        }
        if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
          alert('Passwords do not match')
          return
        }

        isSavingPassword.value = true
        try {
          const res = await authFetch('/api/users/change-password', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              oldPassword: passwordForm.value.oldPassword,
              newPassword: passwordForm.value.newPassword
            })
          })
          const data = await res.json().catch(() => ({}))
          if (res.ok && data && !data.error) {
            alert('Password updated successfully!')
            closePasswordModal()
          } else {
            alert('Failed to update password: ' + (data?.error || `Server error ${res?.status}`))
          }
        } catch (err) {
          console.error(err)
          alert('Error: ' + err.message)
        } finally {
          isSavingPassword.value = false
        }
      }

      return () => {
        const editModal = isEditModalOpen.value ? buildGrid({
          columns: 1, rows: 1,
          style: {
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10000,
            backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          },
          child: {
            1: buildCard({
              style: { width: '500px' },
              pad: '32px',
              radius: '2xl',
              shadow: '2xl',
              child: {
                1: buildGrid({
                  columns: 1, rows: 5, rowGap: 20, display: true,
                  child: {
                    1: h('div', {
                      style: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8px' }
                    }, [
                      h('div', {
                        style: { width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', marginBottom: '16px', backgroundColor: '#e0e7ff' }
                      }, [
                        buildImageUpload({ value: userAvatar, size: 100 })
                      ]),
                      h('div', {
                        style: { display: 'flex', gap: '24px', alignItems: 'center' }
                      }, [
                        h('div', { style: { position: 'relative' } }, [
                          buildButton('Upload Photo', { variant: 'outline', color: 'neutral', icon: buildIcon('upload', { size: 20 }) }),
                          h('input', {
                            type: 'file', accept: 'image/*',
                            style: { position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%', zIndex: 10 },
                            onChange: (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  userAvatar.value = event.target.result;
                                };
                                reader.readAsDataURL(file);
                              }
                            }
                          })
                        ]),
                        buildButton('Remove Photo', {
                          variant: 'text', color: 'primary', icon: buildIcon('trash', { size: 20 }),
                          onPressed: () => { userAvatar.value = '' }
                        })
                      ])
                    ]),
                    2: buildInput({
                      label: 'Full Name',
                      value: editForm.value.name,
                      onUpdate: (v) => { editForm.value.name = v },
                      placeholder: 'Enter your full name'
                    }),
                    3: buildInput({
                      label: 'Email Address',
                      value: editForm.value.email,
                      onUpdate: (v) => { editForm.value.email = v },
                      placeholder: 'Enter your email',
                      disabled: true,
                      style: { opacity: 0.7, cursor: 'not-allowed' }
                    }),
                    4: buildInput({
                      label: 'Location',
                      value: editForm.value.location,
                      onUpdate: (v) => { editForm.value.location = v },
                      placeholder: 'City, Country'
                    }),
                    5: buildGrid({
                      display: false,
                      columns: 2, colGap: 12,
                      child: {
                        1: buildButton('Cancel', {
                          variant: 'outline',
                          color: 'neutral',
                          full: true,
                          onPressed: closeEditModal
                        }),
                        2: buildButton(isSaving.value ? 'Saving...' : 'Save Changes', {
                          variant: 'solid',
                          color: 'primary',
                          full: true,
                          onPressed: saveProfile
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        }) : null

        const logoutModal = showLogoutModal.value ? h('div', {
          style: {
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10001,
            backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }
        }, [
          h('div', {
            style: {
              width: '400px', backgroundColor: '#ffffff', padding: '32px', borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)', border: '1px solid rgba(226, 232, 240, 0.8)'
            }
          }, [
            h('div', { style: { marginBottom: '24px' } }, [
              h('h3', { style: { margin: '0 0 8px 0', fontSize: '20px', fontWeight: '700', color: '#0f172a' } }, 'Confirm Logout'),
              h('p', { style: { margin: 0, fontSize: '14px', color: '#64748b' } }, 'Are you sure you want to log out of your account?')
            ]),
            h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' } }, [
              h('button', {
                style: {
                  padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0',
                  backgroundColor: 'white', color: '#64748b', fontWeight: '600', cursor: 'pointer'
                },
                onClick: () => { showLogoutModal.value = false }
              }, 'Cancel'),
              h('button', {
                style: {
                  padding: '12px', borderRadius: '12px', border: 'none',
                  backgroundColor: '#ef4444', color: 'white', fontWeight: '600', cursor: 'pointer'
                },
                onClick: () => {
                  import('../utils/auth.js').then(m => {
                    m.authUtils.clearAuth();
                    window.dispatchEvent(new Event('auth-expired'));
                  });
                }
              }, 'Logout')
            ])
          ])
        ]) : null

        const passwordModal = isPasswordModalOpen.value ? h('div', {
          style: {
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10002,
            backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }
        }, [
          h('div', {
            style: {
              width: '450px', backgroundColor: '#ffffff', padding: '32px', borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)', border: '1px solid rgba(226, 232, 240, 0.8)'
            }
          }, [
            h('div', { style: { marginBottom: '24px' } }, [
              h('h3', { style: { margin: '0 0 8px 0', fontSize: '20px', fontWeight: '700', color: '#0f172a' } }, 'Change Password'),
              h('p', { style: { margin: 0, fontSize: '14px', color: '#64748b' } }, 'Please enter your current password and choose a new one.')
            ]),
            h('div', { style: { display: 'flex', flexDirection: 'column', gap: '20px' } }, [
              buildInput({
                label: 'Current Password',
                value: passwordForm.value.oldPassword,
                type: showOldPassword.value ? 'text' : 'password',
                onUpdate: (v) => { passwordForm.value.oldPassword = v },
                placeholder: '••••••••',
                suffix: h('div', {
                  style: { cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' },
                  onClick: () => { showOldPassword.value = !showOldPassword.value }
                }, [buildIcon(showOldPassword.value ? 'eye' : 'eye-off', { size: 18, color: '#94a3b8' })])
              }),
              buildInput({
                label: 'New Password',
                value: passwordForm.value.newPassword,
                type: showNewPassword.value ? 'text' : 'password',
                onUpdate: (v) => { passwordForm.value.newPassword = v },
                placeholder: '••••••••',
                suffix: h('div', {
                  style: { cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' },
                  onClick: () => { showNewPassword.value = !showNewPassword.value }
                }, [buildIcon(showNewPassword.value ? 'eye' : 'eye-off', { size: 18, color: '#94a3b8' })])
              }),
              buildInput({
                label: 'Confirm New Password',
                value: passwordForm.value.confirmPassword,
                type: showConfirmPassword.value ? 'text' : 'password',
                onUpdate: (v) => { passwordForm.value.confirmPassword = v },
                placeholder: '••••••••',
                suffix: h('div', {
                  style: { cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' },
                  onClick: () => { showConfirmPassword.value = !showConfirmPassword.value }
                }, [buildIcon(showConfirmPassword.value ? 'eye' : 'eye-off', { size: 18, color: '#94a3b8' })])
              }),
              h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' } }, [
                h('button', {
                  style: {
                    padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0',
                    backgroundColor: 'white', color: '#64748b', fontWeight: '600', cursor: 'pointer'
                  },
                  onClick: closePasswordModal
                }, 'Cancel'),
                h('button', {
                  style: {
                    padding: '12px', borderRadius: '12px', border: 'none',
                    backgroundColor: '#6366f1', color: 'white', fontWeight: '600', cursor: 'pointer'
                  },
                  disabled: isSavingPassword.value,
                  onClick: savePassword
                }, isSavingPassword.value ? 'Saving...' : 'Update Password')
              ])
            ])
          ])
        ]) : null

        return h('div', { style: { position: 'relative', width: '100%', height: '100%' } }, [
          buildContentGrid({
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
                  2: canEdit.value ? buildButton('Edit Profile', {
                    variant: 'solid',
                    color: 'primary',
                    size: 'sm',
                    icon: buildIcon('edit', { size: 20 }),
                    style: { fontWeight: '600' },
                    onPressed: openEditModal
                  }) : null
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
                                  1: buildImageUpload({ value: userAvatar, size: 140 })
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
                                child: { 1: buildIcon('camera', { size: 22, color: '#6366f1' }) }
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
                                  1: buildText(displayedUser.value.name, { size: 'xl', weight: 'bold', color: 'gray900' }),
                                  2: buildText((displayedUser.value.role || 'User').toUpperCase(), { size: 'xs', weight: 'bold', color: '#6366f1', style: { letterSpacing: '0.5px' } }),
                                }
                              }),
                              2: buildGrid({
                                columns: 1, rows: 3,
                                rowGap: 8,
                                display: false,
                                child: {
                                  1: buildGrid({
                                    columns: 2, colGap: 8, align: 'center left', style: { gridTemplateColumns: 'auto 1fr' }, display: false,
                                    child: { 1: buildIcon('mail', { size: 18, color: 'gray400' }), 2: buildText(displayedUser.value.email, { size: 'sm', color: 'gray600' }) }
                                  }),
                                  2: buildGrid({
                                    columns: 2, colGap: 8, align: 'center left', style: { gridTemplateColumns: 'auto 1fr' }, display: false,
                                    child: { 1: buildIcon('calendar', { size: 18, color: 'gray400' }), 2: buildText(`Joined on ${formattedJoinedDate.value}`, { size: 'sm', color: 'gray600' }) }
                                  }),
                                  3: buildGrid({
                                    columns: 2, colGap: 8, align: 'center left', style: { gridTemplateColumns: 'auto 1fr' }, display: false,
                                    child: { 1: buildIcon('map-pin', { size: 18, color: 'gray400' }), 2: buildText(displayedUser.value.location || 'Phnom Penh, Cambodia', { size: 'sm', color: 'gray600' }) }
                                  })
                                }
                              })
                            }
                          })
                        }
                      }),
                      2: null // Removed stat cards as requested
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
                            width: '40px', height: '40px', radius: 'full', backgroundColor: '#eef2ff', align: 'center', display: false,
                            child: { 1: buildIcon('user', { size: 24, color: '#6366f1', style: { marginTop: '5px', marginLeft: '10px' } }) }
                          }),
                          2: buildText('About', { size: 'md', weight: 'bold', color: 'gray900', style: { marginTop: '5px' } })
                        }
                      }),
                      2: buildText(displayedUser.value.about || 'No description provided.', { size: 'sm', color: 'gray500', style: { lineHeight: '1.6', marginTop: '4px' } }),
                      3: buildGrid({
                        padding: '16px 20px',
                        backgroundColor: '#f8fafc',
                        radius: 'xl',
                        columns: 2,
                        colGap: 16,
                        align: { 1: 'center left' },
                        style: { gridTemplateColumns: 'auto 1fr', marginTop: '8px' },
                        display: true,
                        child: {
                          1: buildGrid({
                            width: '32px', height: '32px', backgroundColor: '#eef2ff', radius: 'full', align: 'center', display: false,
                            child: { 1: buildIcon('info', { size: 24, color: '#6366f1' }) }
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
                            child: { 1: buildIcon('shield', { size: 24, color: '#6366f1', style: { marginTop: '5px', marginLeft: '10px' } }) }
                          }),
                          2: buildText('Account', { size: 'md', weight: 'bold', color: 'gray900', style: { marginTop: '5px' } })
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
                        hover: true,
                        onPressed: () => { isPasswordModalOpen.value = true },
                        child: {
                          1: buildIconContainer({
                            icon: 'lock',
                            iconSize: 12,
                            colorIcon: '#6366f1',
                            size: 32,
                            colorCon: '#eef2ff',
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
                        columns: 3,
                        colGap: 16,
                        align: 'center left',
                        style: { gridTemplateColumns: 'auto 1fr auto', marginTop: '8px', cursor: 'pointer' },
                        display: true,
                        hover: true,
                        hoverColor: '#f1f5f9',
                        onPressed: () => { },
                        child: {
                          1: buildIconContainer({
                            icon: 'shield',
                            iconSize: 12,
                            colorIcon: '#10b981',
                            size: 32,
                            colorCon: '#ecfdf5',
                            containerStyle: 'circle'
                          }),
                          2: buildGrid({
                            columns: 1, rows: 2, rowGap: 4, display: false, style: { marginLeft: '10px' }, child: {
                              1: buildText('Two-Factor Authentication', { size: 'sm', weight: 'bold', color: 'gray900' }),
                              2: buildText('Add an extra layer of security to your account', { size: 'xs', color: 'gray500' })
                            }
                          }),
                          3: buildBadge(is2FAEnabled.value ? 'Enabled' : 'Disabled', {
                            variant: 'solid',
                            color: is2FAEnabled.value ? 'success' : 'neutral',
                            style: { fontSize: '10px', padding: '4px 12px' }
                          })
                        }
                      }),
                    }
                  })
                }
              }),
              7: buildGrid({
                backgroundColor: '#ef4444',
                columns: 2,
                rows: 1,
                display: true,
                align: { 1: 'center left' },
                style: { gridTemplateColumns: 'auto 1fr', marginTop: '24px' },
                hover: true,
                onPressed: () => {
                  showLogoutModal.value = true
                },
                child: {
                  1: buildIconContainer({
                    icon: 'logout',
                    iconSize: 12,
                    colorIcon: '#470404ff',
                    size: 32,
                    colorCon: '#fef2f2',
                    containerStyle: 'circle'
                  }),
                  2: buildGrid({
                    columns: 1, rows: 2, rowGap: 4, display: false, style: { marginLeft: '10px' }, child: {
                      1: buildText('Logout', { size: 'sm', weight: 'bold', color: 'white' }),
                      2: buildText('Logout your account.', { size: 'xs', color: 'white' })
                    }
                  })
                }
              })
            }
          }),
          editModal,
          logoutModal,
          passwordModal
        ])
      }
    }
  }
}
