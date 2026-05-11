import { defineComponent, h, ref, onMounted, onBeforeUnmount } from 'vue'

export function ForgotPasswordPage({ onBack }) {
  return defineComponent({
    name: 'ForgotPasswordPage',
    setup() {
      const email = ref('')
      const isSubmitting = ref(false)
      const success = ref(false)
      const error = ref('')
      const mouseX = ref(50)
      const mouseY = ref(50)

      function onPointerMove(e) {
        const w = window.innerWidth || 1
        const h = window.innerHeight || 1
        mouseX.value = (e.clientX / w) * 100
        mouseY.value = (e.clientY / h) * 100
      }

      const handleSubmit = async (e) => {
        e?.preventDefault()
        if (!email.value) {
          error.value = 'Please enter your email.'
          return
        }
        isSubmitting.value = true
        error.value = ''
        try {
          // Simulate API call
          await new Promise(r => setTimeout(r, 1000))
          success.value = true
        } catch (err) {
          error.value = 'Failed to send reset link.'
        } finally {
          isSubmitting.value = false
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
          h('section', { class: 'nx-card', role: 'main', 'aria-label': 'BuilderUI reset panel' }, [
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
              h('h1', { class: 'text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50' }, 'BuilderUI'),
              h('p', { class: 'mt-1 text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300', style: { marginTop: '25px' } }, 'Reset Password'),
            ]),

            success.value
              ? h('div', { style: { padding: '20px 0', textAlign: 'center' } }, [
                h('p', { style: { color: '#4ade80', marginBottom: '16px', fontSize: '14px' } }, 'Reset link sent! Please check your email.'),
                h('button', {
                  class: 'nx-policy',
                  type: 'button',
                  style: { cursor: 'pointer', position: 'relative', zIndex: 50 },
                  onClick: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onBack) onBack();
                  }
                }, 'Back to Login'),
              ])
              : h('form', { onSubmit: handleSubmit }, [
                h('p', { style: { fontSize: '13px', color: '#94a3b8', marginTop: '30px', textAlign: 'center', lineHeight: '1.5' } }, 'Enter your email and we will send you a link to reset your password.'),
                h('label', { class: 'nx-label', for: 'nx-email', style: { marginTop: '30px' } }, 'Work Email'),
                h('div', { class: 'nx-input-wrap', style: { marginTop: '30px' } }, [
                  h('span', { class: 'nx-icon', 'aria-hidden': 'true' }, '@'),
                  h('input', {
                    id: 'nx-email',
                    class: 'nx-input',
                    type: 'email',
                    placeholder: 'name@company.com',
                    value: email.value,
                    onInput: (e) => { email.value = e.target.value },
                    required: true
                  }),
                ]),
                error.value
                  ? h('p', { class: 'nx-error', role: 'alert' }, error.value)
                  : h('p', { class: 'nx-error nx-error-empty' }, ' '),
                h('button', {
                  class: 'nx-login-btn',
                  type: 'submit',
                  disabled: isSubmitting.value,
                  style: { marginBottom: '14px' }
                }, [
                  h('span', { class: 'nx-btn-shine' }),
                  h('span', { class: 'nx-btn-text' }, isSubmitting.value ? 'SENDING...' : 'SEND RESET LINK'),
                ]),
              ]),
            h('button', {
              class: 'nx-policy',
              type: 'button',
              style: { cursor: 'pointer', position: 'relative', zIndex: 50 },
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onBack) onBack();
              }
            }, 'Back to Login'),

            h('footer', { style: { marginTop: '14px', textAlign: 'center' } }, [
              h('p', { style: { fontSize: '11px', color: '#9fb0d4' } }, '© 2026 BuilderUI Management Systems. All rights reserved.'),
            ]),
          ]),
        ]),
      ])
    },
  })
}
