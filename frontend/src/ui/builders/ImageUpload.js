import { h, ref } from 'vue'
import { buildIcon } from './icon.js'

/**
 * buildImageUpload(options) - Reusable Image Upload component
 * 
 * Options:
 *   value      {string|ref} Reactive ref or string for image src (base64 or URL)
 *   onInput    {function}  Callback when image changes (returns base64)
 *   size       {number}    Circle size in pixels. Default: 100
 *   style      {object}    Custom styles
 */
export function buildImageUpload(options = {}) {
  const {
    value = ref(''),
    onInput = () => {},
    size = 100,
    style = {}
  } = options

  // Internal reactivity handler
  const internalValue = (typeof value === 'object' && value !== null && 'value' in value) 
    ? value 
    : ref(value)

  return h('div', {
    style: { 
      width: `${size}px`, 
      height: `${size}px`, 
      position: 'relative',
      borderRadius: '50%',
      overflow: 'hidden',
      backgroundColor: '#e0e7ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }
  }, [
    // Invisible File Input
    h('input', {
      type: 'file',
      accept: 'image/*',
      style: {
        position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10, width: '100%', height: '100%'
      },
      onChange: (e) => {
        const file = e.target.files?.[0]
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = event.target.result;
            internalValue.value = result;
            onInput(result);
          };
          reader.readAsDataURL(file);
        }
      }
    }),
    // Image / Placeholder Display
    h('div', {
      style: {
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundImage: internalValue.value ? `url(${internalValue.value})` : 'none',
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        pointerEvents: 'none'
      }
    }, [
      !internalValue.value ? buildIcon('user', { size: size * 0.4, color: '#94a3b8' }) : null
    ])
  ])
}
