import { h, computed } from 'vue'
import { buildIcon } from './icon.js'
import { buildText } from './text.js'

export function buildFileUpload(options = {}) {
  const {
    title = 'FILE UPLOAD',
    hint = 'Drag and drop diagnostic logs or screenshots here',
    maxSizeText = 'MAX FILE SIZE: 25MB',
    icon = 'upload',
    height = '84px',
    accept = '*/*',
    multiple = true,
    files = [],
    onUpdate,
    clearText = 'Clear',
    onPressed,
    onClick,
    style = {},
  } = options

  const handlePress = onPressed ?? onClick

  function emitFiles(fileList) {
    const fileArray = Array.from(fileList ?? [])
    onUpdate?.(fileArray)
  }

  function clearFiles(e) {
    e?.stopPropagation?.()
    onUpdate?.([])
  }

  const selectedNames = computed(() => {
    const fArr = Array.isArray(files) ? files : (files?.value || [])
    return fArr.map((f) => f?.name).filter(Boolean)
  })

  const firstFile = computed(() => {
    const fArr = Array.isArray(files) ? files : (files?.value || [])
    return fArr.length > 0 ? fArr[0] : null
  })

  const filePreviews = computed(() => {
    const fArr = Array.isArray(files) ? files : (files?.value || [])
    return fArr.map(f => {
      let isImage = false
      let url = ''
      
      const type = f.type || ''
      if (typeof type === 'string' && type.startsWith('image/')) {
        isImage = true
      } else {
        const name = (f.name || '').toLowerCase()
        isImage = name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.gif') || name.endsWith('.webp') || name.endsWith('.svg')
      }

      if (isImage) {
        if (f.dataUrl) {
          url = f.dataUrl
        } else if (f instanceof File || f instanceof Blob) {
          try {
            url = URL.createObjectURL(f)
          } catch (e) {
            console.error('Failed to create object URL:', e)
          }
        }
      }
      
      return { isImage, url, name: f.name }
    })
  })

  function openPicker() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.multiple = !!multiple
    input.onchange = (e) => emitFiles(e?.target?.files)
    input.click()
  }

  return h('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      width: '100%',
      ...style,
    },
  }, [
    buildText(title, { size: 'xs', weight: 'bold', color: 'gray700' }),
    h('div', {
      onClick: (e) => {
        handlePress?.(e)
        openPicker()
      },
      onDragover: (e) => {
        e.preventDefault()
      },
      onDrop: (e) => {
        e.preventDefault()
        emitFiles(e.dataTransfer?.files)
      },
      style: {
        border: '1px dashed #cfd8e3',
        borderRadius: '8px',
        minHeight: height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748b',
        fontSize: '13px',
        gap: '3px',
        cursor: 'pointer',
      },
    }, [
      ...(filePreviews.value.length
        ? [
            h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '8px', padding: '4px' } }, 
              filePreviews.value.map((p, idx) => 
                h('div', { style: { position: 'relative' } }, [
                  p.isImage && p.url
                    ? h('img', {
                        src: p.url,
                        alt: p.name,
                        style: {
                          width: '48px',
                          height: '48px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid #dbe3ee',
                        },
                      })
                    : h('div', {
                        style: {
                          width: '48px',
                          height: '48px',
                          borderRadius: '6px',
                          backgroundColor: '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #dbe3ee',
                        }
                      }, [buildIcon('file', { size: 16, color: '#94a3b8' })]),
                  h('button', {
                    onClick: (e) => {
                      e.stopPropagation()
                      const fArr = Array.isArray(files) ? [...files] : [...(files?.value || [])]
                      fArr.splice(idx, 1)
                      onUpdate?.(fArr)
                    },
                    style: {
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: '2px solid white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      cursor: 'pointer',
                      zIndex: 2,
                    }
                  }, '×')
                ])
              )
            ),
            h('div', { style: { lineHeight: 1.2, color: '#334155', fontWeight: '500', textAlign: 'center', maxWidth: '92%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, selectedNames.value.join(', ')),
            h('div', { style: { fontSize: '11px', color: '#9aa7b8', lineHeight: 1.1 } }, `${selectedNames.value.length} file(s) selected`),
            h('div', { style: { display: 'flex', gap: '12px', marginTop: '6px' } }, [
              h('button', {
                type: 'button',
                onClick: (e) => {
                  e.stopPropagation()
                  openPicker()
                },
                style: {
                  border: 'none',
                  background: 'transparent',
                  color: '#2563eb',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  padding: '0',
                },
              }, '+ Add more'),
              h('button', {
                type: 'button',
                onClick: (e) => {
                  e.stopPropagation()
                  clearFiles(e)
                },
                style: {
                  border: 'none',
                  background: 'transparent',
                  color: '#64748b',
                  fontSize: '11px',
                  cursor: 'pointer',
                  padding: '0',
                },
              }, clearText),
            ]),
          ]
        : [
            buildIcon(icon, { size: 18, color: '#64748b' }),
            h('div', { style: { lineHeight: 1.2 } }, hint),
            h('div', { style: { fontSize: '11px', color: '#9aa7b8', lineHeight: 1.1 } }, maxSizeText),
          ]),
    ]),
  ])
}
