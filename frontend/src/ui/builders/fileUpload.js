import { h } from 'vue'
import { buildIcon } from './icon.js'
import { buildText } from './text.js'

/**
 * buildFileUpload(options) - File upload dropzone block
 *
 * Options:
 *   title         {string}   Top label text. Default: 'FILE UPLOAD'
 *   hint          {string}   Main helper text in dropzone
 *   maxSizeText   {string}   Small max-size text
 *   icon          {string}   Icon name. Default: 'upload'
 *   height        {string}   Dropzone min height. Default: '96px'
 *   accept        {string}   Input accept filter. Example: '.png,.jpg,application/pdf'
 *   multiple      {boolean}  Allow multi-file select. Default: true
 *   files         {Array}    Selected files array (for display)
 *   onUpdate      {function} Callback with selected files array
 *   clearText     {string}   Clear action label. Default: 'Clear'
 *   onPressed     {function} Optional click handler (alias of onClick)
 *   onClick       {function} Optional click hook for the dropzone
 *   style         {object}   Extra style for wrapper
 */
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
    const files = Array.from(fileList ?? [])
    onUpdate?.(files)
  }
  function clearFiles(e) {
    e?.stopPropagation?.()
    onUpdate?.([])
  }

  const selectedNames = Array.isArray(files) ? files.map((f) => f?.name).filter(Boolean) : []
  const firstFile = Array.isArray(files) && files.length ? files[0] : null
  const firstIsImage = !!(firstFile && typeof firstFile.type === 'string' && firstFile.type.startsWith('image/'))
  const firstImageUrl = firstIsImage ? URL.createObjectURL(firstFile) : ''

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
        cursor: (onPressed || onClick) ? 'pointer' : 'default',
      },
    }, [
      ...(selectedNames.length
        ? [
            firstIsImage
              ? h('img', {
                  src: firstImageUrl,
                  alt: firstFile?.name ?? 'uploaded image',
                  style: {
                    width: '52px',
                    height: '52px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #dbe3ee',
                  },
                })
              : buildIcon('image', { size: 18, color: '#64748b' }),
            h('div', { style: { lineHeight: 1.2, color: '#334155', fontWeight: '500', textAlign: 'center', maxWidth: '92%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, selectedNames.join(', ')),
            h('div', { style: { fontSize: '11px', color: '#9aa7b8', lineHeight: 1.1 } }, `${selectedNames.length} file(s) selected`),
            h('button', {
              type: 'button',
              onClick: clearFiles,
              style: {
                marginTop: '2px',
                border: 'none',
                background: 'transparent',
                color: '#2563eb',
                fontSize: '11px',
                cursor: 'pointer',
                padding: '0',
              },
            }, clearText),
          ]
        : [
            buildIcon(icon, { size: 18, color: '#64748b' }),
            h('div', { style: { lineHeight: 1.2 } }, hint),
            h('div', { style: { fontSize: '11px', color: '#9aa7b8', lineHeight: 1.1 } }, maxSizeText),
          ]),
    ]),
  ])
}
