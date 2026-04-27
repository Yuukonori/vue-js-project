import { createApp } from 'vue'
import App from './App.vue'

// Global spinner keyframes
const style = document.createElement('style')
style.textContent = `
  @keyframes btn-spin {
    to { transform: rotate(360deg); }
  }
  * { box-sizing: border-box; }
  a { text-decoration: none; color: inherit; }
`
document.head.appendChild(style)

createApp(App).mount('#app')
