import { defineComponent, h, ref, onMounted, onBeforeUnmount } from 'vue'
import { buildButton } from '../../ui/index.js'

export function ForgotPasswordPage({ onBack }) {
  return defineComponent({
    name: 'ForgotPasswordPage',
    setup() {
      const email = ref('')
      const isSubmitting = ref(false)
      const success = ref(false)
      const error = ref('')
      const copied = ref(false)
      const mouseX = ref(50)
      const mouseY = ref(50)

      const adminEmail = '@visalsan17'

      function onPointerMove(e) {
        const w = window.innerWidth || 1
        const hh = window.innerHeight || 1
        mouseX.value = (e.clientX / w) * 100
        mouseY.value = (e.clientY / hh) * 100
      }

      const handleNotifyAdmin = async (e) => {
        e?.preventDefault()
        if (!email.value.trim()) {
          error.value = 'Please enter your email address.'
          return
        }
        isSubmitting.value = true
        error.value = ''
        try {
          await new Promise(r => setTimeout(r, 1000))
          success.value = true
        } catch {
          error.value = 'Failed to notify admin. Please try again.'
        } finally {
          isSubmitting.value = false
        }
      }

      const copyAdminEmail = async () => {
        const textToCopy = adminEmail
        try {
          // Primary: Modern API
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(textToCopy)
          } else {
            throw new Error('Clipboard API unavailable')
          }
          copied.value = true
        } catch (err) {
          // Fallback: execCommand('copy')
          try {
            const textArea = document.createElement("textarea")
            textArea.value = textToCopy
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand("copy")
            document.body.removeChild(textArea)
            copied.value = true
          } catch (fallbackErr) {
            console.error('Copy failed:', fallbackErr)
            copied.value = false
          }
        }
        if (copied.value) {
          setTimeout(() => { copied.value = false }, 2000)
        }
      }

      onMounted(() => window.addEventListener('pointermove', onPointerMove))
      onBeforeUnmount(() => window.removeEventListener('pointermove', onPointerMove))

      return () => h('div', { class: 'nx-login' }, [
        h('div', { class: 'nx-bg-grid' }),
        h('div', { class: 'nx-bg-rings' }),
        h('div', { class: 'nx-bg-lines' }),
        h('div', {
          class: 'nx-mouse-glow',
          style: { left: `${mouseX.value}%`, top: `${mouseY.value}%` },
        }),
        h('main', { class: 'nx-card-wrap' }, [
          h('div', { class: 'nx-holo' }),
          h('section', { class: 'nx-card', role: 'main', 'aria-label': 'BuilderUI forgot password panel' }, [

            // --- Logo & Title ---
            h('div', { class: 'mb-8 text-center' }, [
              h('div', {
                class: 'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/30',
                style: { marginLeft: 'auto', marginRight: 'auto' }
              }, [
                h('svg', { class: 'h-8 w-8', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'aria-hidden': 'true' }, [
                  h('rect', { x: '3', y: '3', width: '8', height: '8', rx: '1.5' }),
                  h('rect', { x: '13', y: '3', width: '8', height: '8', rx: '1.5' }),
                  h('rect', { x: '3', y: '13', width: '8', height: '8', rx: '1.5' }),
                  h('rect', { x: '13', y: '13', width: '8', height: '8', rx: '1.5' }),
                ])
              ]),
              h('h1', { class: 'nx-logo', style: { fontSize: '22px', marginTop: '20px' } }, 'Forgot Password?'),
              h('p', { class: 'nx-sub', style: { marginTop: '8px', letterSpacing: '0' } }, 'Resetting your password requires Admin approval'),
            ]),

            h('div', { class: 'nx-divider' }),

            // --- Contact Admin Section ---
            h('div', { style: { padding: '10px 0' } }, [
              h('p', {
                class: 'nx-label',
                style: {
                  fontSize: '12px',
                  textAlign: 'center',
                  fontWeight: '700',
                  marginBottom: '16px',
                  width: '100%'
                }
              }, 'Please contact the Admin to reset your password'),

              h('div', {
                onClick: copyAdminEmail,
                style: {
                  width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', // Centered
                  padding: '16px', borderRadius: '14px',
                  border: '1px solid rgba(148,163,184,0.3)',
                  background: 'rgba(15,23,42,0.4)', marginBottom: '24px',
                  boxShadow: 'inset 0 0 20px rgba(96,165,250,0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  userSelect: 'text', // Allow manual selection
                },
                onMouseenter: (e) => { e.currentTarget.style.borderColor = 'rgba(96,165,250,0.6)'; e.currentTarget.style.background = 'rgba(15,23,42,0.6)' },
                onMouseleave: (e) => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)'; e.currentTarget.style.background = 'rgba(15,23,42,0.4)' },
              }, [
                h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
                  h('svg', {
                    viewBox: '0 0 24 24',
                    style: { width: '18px', height: '18px', fill: '#60a5fa' },
                    'aria-hidden': 'true'
                  }, [
                    h('path', { d: 'M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 1.589 4.887c.191.528.098.737.662.737.43 0 .621-.194.86-.432l2.063-2.006 4.293 3.17c.79.435 1.357.21 1.554-.73l2.812-13.25c.287-1.152-.435-1.673-1.189-1.335z' })
                  ]),
                  h('span', {
                    style: {
                      color: copied.value ? '#4ade80' : '#e2e8f0',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }
                  }, copied.value ? 'Copied to clipboard!' : adminEmail),
                ]),
              ]),

              // --- QR Code Section ---
              h('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '28px',
                  padding: '20px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '24px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 0 20px rgba(96,165,250,0.05)',
                  backdropFilter: 'blur(10px)',
                }
              }, [
                h('p', { style: { fontSize: '10px', color: '#94a3b8', marginBottom: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' } }, 'Scan to contact'),
                h('div', {
                  style: {
                    padding: '8px',
                    background: '#fff',
                    borderRadius: '16px',
                    boxShadow: '0 0 20px rgba(96,165,250,0.2)'
                  }
                }, [
                  h('img', {
                    src: '/image/QR_2.jpg',
                    alt: 'Admin Telegram QR',
                    style: { width: '140px', height: '140px', borderRadius: '8px', display: 'block' }
                  }),
                ]),
              ]),

              // --- Back to Login Button ---
              buildButton('Back to Login', {
                variant: 'outline',
                color: 'neutral',
                full: true,
                style: { position: 'relative', zIndex: 100, pointerEvents: 'auto' },
                onPressed: () => { if (onBack) onBack() }
              }),
            ]),

            // --- Footer ---
            h('footer', { style: { marginTop: '14px', textAlign: 'center' } }, [
              h('p', { style: { fontSize: '11px', color: '#9fb0d4' } }, '© 2026 BuilderUI Management Systems. All rights reserved.'),
            ]),
          ]),
        ]),
      ])
    },
  })
}
