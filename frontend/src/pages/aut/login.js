import { defineComponent, h, ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * LoginPage(options)
 * @param {{ onAuthenticate?: (payload: { email: string, password: string, user?: any }) => void }} options
 */
export function LoginPage(options = {}) {
  const { onAuthenticate, onForgot } = options

  return defineComponent({
    name: 'LoginPage',
    setup() {
      const email = ref('')
      const password = ref('')
      const error = ref('')
      const showPassword = ref(false)
      const rememberMe = ref(true)
      const mouseX = ref(50)
      const mouseY = ref(50)

      function onPointerMove(e) {
        const w = window.innerWidth || 1
        const h = window.innerHeight || 1
        mouseX.value = (e.clientX / w) * 100
        mouseY.value = (e.clientY / h) * 100
      }

      async function handleAuthenticate() {
        if (!email.value.trim() || !password.value.trim()) {
          error.value = 'Please enter institutional email and secure key.'
          return
        }

        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email.value.trim(),
              password: password.value,
            }),
          })

          const raw = await res.text()
          let payload = null
          try {
            payload = JSON.parse(raw)
          } catch (_) {
            error.value = 'Server returned unexpected response. Please restart frontend and backend.'
            return
          }

          if (!res.ok || !payload?.ok || !payload?.user) {
            error.value = payload?.error || 'Invalid email or password.'
            return
          }

          error.value = ''
          onAuthenticate?.({ email: payload.user.email, password: password.value, user: payload.user })
        } catch (_) {
          error.value = 'Unable to connect to server. Please try again.'
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
          h('section', { class: 'nx-card', role: 'main', 'aria-label': 'BuilderUI login panel' }, [
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
              h('p', { class: 'mt-1 text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300' }, 'Management Systems'),
            ]),
            h('form', {
              onSubmit: (e) => { e.preventDefault(); handleAuthenticate() }
            }, [
              h('label', { class: 'nx-label', for: 'nx-email' }, 'Work Email'),
              h('div', { class: 'nx-input-wrap' }, [
                h('span', { class: 'nx-icon', 'aria-hidden': 'true' }, '@'),
                  h('input', {
                    id: 'nx-email',
                    class: 'nx-input',
                    type: 'email',
                    placeholder: 'name@company.com',
                    autocomplete: 'email',
                    value: email.value,
                    onInput: (e) => { email.value = e.target.value },
                  }),
              ]),
              h('div', { class: 'nx-pass-head', style: { position: 'relative', zIndex: 10 } }, [
                h('label', { class: 'nx-label', for: 'nx-password' }, 'Password'),
                h('button', { 
                  type: 'button', 
                  class: 'nx-link', 
                  style: { cursor: 'pointer', position: 'relative', zIndex: 20, padding: '5px' },
                  onClick: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (options.onForgot) options.onForgot();
                  }
                }, 'Forgot password?'),
              ]),
              h('div', { class: 'nx-input-wrap' }, [
                h('span', { class: 'nx-icon', 'aria-hidden': 'true' }, '*'),
                  h('input', {
                    id: 'nx-password',
                    class: 'nx-input',
                    type: showPassword.value ? 'text' : 'password',
                    placeholder: 'Enter password',
                    autocomplete: 'current-password',
                    value: password.value,
                    onInput: (e) => { password.value = e.target.value },
                    onKeydown: (e) => { if (e.key === 'Enter') handleAuthenticate() },
                  }),
                  h('button', {
                    class: 'nx-eye',
                    type: 'button',
                    'aria-label': showPassword.value ? 'Hide password' : 'Show password',
                    onClick: () => { showPassword.value = !showPassword.value },
                  }, showPassword.value ? 'Hide' : 'Show'),
              ]),
              h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' } }, [
                h('label', { style: { display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#b8c6eb' } }, [
                  h('input', {
                    type: 'checkbox',
                    checked: rememberMe.value,
                    onChange: (e) => { rememberMe.value = e.target.checked },
                  }),
                  h('span', 'Remember me'),
                ]),
                h('span', { style: { fontSize: '11px', color: '#9cc8ff', border: '1px solid rgba(148,163,184,.38)', borderRadius: '999px', padding: '4px 10px' } }, 'Secure Access'),
              ]),
              error.value
                ? h('p', { class: 'nx-error', role: 'alert' }, error.value)
                : h('p', { class: 'nx-error nx-error-empty' }, ' '),
              h('button', { class: 'nx-login-btn', type: 'submit' }, [
                h('span', { class: 'nx-btn-shine' }),
                h('span', { class: 'nx-btn-text' }, 'SIGN IN TO BUILDERUI'),
              ]),
              h('button', { class: 'nx-policy', type: 'button' }, 'Security Access Policy'),
            ]),
            h('footer', { style: { marginTop: '14px', textAlign: 'center' } }, [
              h('p', { style: { fontSize: '11px', color: '#9fb0d4' } }, '© 2026 BuilderUI Management Systems. All rights reserved.'),
            ]),
          ]),
        ]),
      ])
    },
  })
}
