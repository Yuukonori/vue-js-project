import { defineComponent, h, ref } from 'vue'
import {
  buildButton,
  buildContentGrid,
  buildGrid,
  buildIcon,
  buildIconTextContainer,
  buildInput,
  buildText,
} from '../../ui/index.js'

/**
 * LoginPage(options)
 * @param {{ onAuthenticate?: (payload: { email: string, password: string }) => void }} options
 */
export function LoginPage(options = {}) {
  const { onAuthenticate } = options

  return h(defineComponent({
    name: 'LoginPage',
    setup() {
      const email = ref('')
      const password = ref('')
      const error = ref('')

      function handleAuthenticate() {
        if (!email.value.trim() || !password.value.trim()) {
          error.value = 'Please enter institutional email and secure key.'
          return
        }

        error.value = ''
        onAuthenticate?.({
          email: email.value.trim(),
          password: password.value,
        })
      }

      return () => buildContentGrid({
        columns: 1,
        rows: 1,
        display: false,
        padding: '24px',
        style: {
          minHeight: '100vh',
          background: '#f3f4f6',
        },
        align: {
          1: 'center',
        },
        child: {
          1: buildGrid({
            columns: 1,
            rows: 11,
            display: false,
            width: '100%',
            rowGap: 10,
            style: {
              maxWidth: '560px',
              margin: '0 auto',
            },
            align: {
              1: 'center',
              2: 'center',
              3: 'center',
              4: 'center',
              6: 'center',
              7: 'center',
              8: 'center',
              9: 'center',
              10: 'center',
              11: 'center',
            },
            child: {
              1: buildGrid({
                columns: 1,
                rows: 1,
                width: '58px',
                height: '58px',
                display: true,
                border: 'none',
                borderRadius: '12px',
                backgroundColor: '#e5e7eb',
                align: { 1: 'center' },
                child: {
                  1: buildIcon('dashboard', { color: '#3b82f6', size: 24 }),
                },
              }),
              2: buildText('BuilderUI', {
                tag: 'div',
                size: '4xl',
                weight: 'bold',
                color: 'gray900',
                style: {
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  letterSpacing: '0.3px',
                  marginBottom: '2px',
                },
              }),
              3: buildText('MANAGEMENT SYSTEMS', {
                tag: 'div',
                size: 'sm',
                weight: 'semibold',
                color: 'gray500',
                style: {
                  letterSpacing: '2px',
                  marginBottom: '18px',
                },
              }),
              4: buildGrid({
                columns: 1,
                rows: 6,
                width: '100%',
                display: true,
                padding: '24px',
                rowGap: 10,
                borderRadius: '4px',
                border: '1px solid #e5e7eb',
                backgroundColor: '#f8fafc',
                style: {
                  maxWidth: '470px',
                  position: 'relative',
                  overflow: 'hidden',
                },
                align: {
                  1: 'center left',
                  2: 'center',
                  4: 'center left',
                  5: 'center',
                  6: 'center',
                },
                child: {
                  1: buildText('A', {
                    tag: 'div',
                    size: '5xl',
                    weight: 'bold',
                    color: 'gray900',
                    style: {
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -32%)',
                      fontSize: '310px',
                      opacity: 0.03,
                      lineHeight: 1,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  }),
                  2: buildInput({
                    label: 'EMAIL',
                    type: 'email',
                    placeholder: 'name@gmail.com',
                    iconLeft: 'mail',
                    full: true,
                    value: email,
                    onUpdate: (value) => { email.value = value },
                    style: { background: '#ffffff' },
                  }),
                  3: buildGrid({
                    columns: 2,
                    rows: 1,
                    display: false,
                    align: {
                      1: 'center left',
                      2: 'center right',
                    },
                    child: {
                      1: buildText('PASSWORD', {
                        size: 'sm',
                        weight: 'semibold',
                        color: 'gray600',
                        style: { letterSpacing: '0.5px' },
                      }),
                      2: buildButton('Forgot password?', {
                        variant: 'link',
                        size: 'sm',
                        color: 'info',
                        onPressed: () => {},
                        style: {
                          textDecoration: 'none',
                          fontWeight: 600,
                          fontSize: '12px',
                        },
                      }),
                    },
                  }),
                  4: buildInput({
                    type: 'password',
                    placeholder: 'Enter password',
                    iconLeft: 'lock',
                    full: true,
                    value: password,
                    onUpdate: (value) => { password.value = value },
                    style: { background: '#ffffff' },
                  }),
                  5: error.value
                    ? buildText(error.value, {
                        size: 'xs',
                        color: 'error',
                        style: { textAlign: 'left', width: '100%' },
                      })
                    : buildText('', { size: 'xs', color: 'transparent' }),
                  6: buildGrid({
                    columns: 1,
                    rows: 2,
                    display: false,
                    rowGap: 10,
                    child: {
                      1: buildButton('LOGIN', {
                        color: 'info',
                        size: 'lg',
                        full: true,
                        onPressed: handleAuthenticate,
                        iconRight: buildIcon('arrow-right', { size: 16, color: '#ffffff' }),
                        style: {
                          height: '50px',
                          borderRadius: '4px',
                          fontWeight: 600,
                          background: '#1d4fc7',
                          border: '1px solid #1d4fc7',
                          boxShadow: '0 8px 16px rgba(29, 79, 199, 0.22)',
                        },
                      }),
                      2: buildGrid({
                        columns: 1,
                        rows: 1,
                        display: false,
                        align: { 1: 'center' },
                        child: {
                          1: buildIconTextContainer('System Access Policy', {
                            icon: 'info',
                            iconColor: '#6b7280',
                            textColor: '#6b7280',
                            textSize: 12,
                            textStyle: { textTransform: 'none' },
                            bgColor: '#f1f5f9',
                            padding: '8px 14px',
                            radius: '999px',
                            iconSize: 14,
                          }),
                        },
                      }),
                    },
                  }),
                },
              }),
              6: buildText('', { size: 'sm', color: 'transparent' }),
              8: buildText('BuilderUI', {
                tag: 'div',
                size: 'xl',
                weight: 'bold',
                color: 'primary',
                style: {
                  marginTop: '8px',
                  marginBottom: '4px',
                  fontFamily: 'Georgia, "Times New Roman", serif',
                },
              }),
              9: buildText('© 2026 BUILDERUI IT MANAGEMENT. ALL RIGHTS RESERVED.', {
                tag: 'div',
                size: 'sm',
                weight: 'semibold',
                color: 'gray400',
                style: { letterSpacing: '0.5px' },
              }),
            },
          }),
        },
      })
    },
  }))
}
