<script setup>
import { ref, computed } from 'vue'
import { webFrame, buildText, buildIcon, buildButton, buildSidebar, buildImage } from './ui/index.js'
import { MENU_CONFIG } from './menu.js'
import { LoginPage } from './pages/aut/login.js'

// ════════════════════════════════════════════════════════════════════════════
//  INTERNALS — no need to edit this file. Edit src/menu.js instead.
// ════════════════════════════════════════════════════════════════════════════

const defaultItem = MENU_CONFIG.items.find(i => !i.line && i.isDefault)
                 ?? MENU_CONFIG.items.find(i => !i.line)

const currentPath = ref(defaultItem?.path ?? '/')
const isAuthenticated = ref(true)

function navigate(path) {
  currentPath.value = path
}

function handleAuthenticate(payload) {
  const email = String(payload?.email ?? '').trim()
  if (email) {
    MENU_CONFIG.user.name = email.split('@')[0]
  }
  isAuthenticated.value = true
}

function signOut() {
  isAuthenticated.value = false
}

globalThis.__appNavigate = navigate

const activeItem = computed(() =>
  MENU_CONFIG.items.find(i => !i.line && i.path === currentPath.value)
  ?? defaultItem
)

// ── Sidebar ───────────────────────────────────────────────────────────────
// Items are reactive (active state tracks currentPath); everything else is static.
// buildSidebar returns a Vue component, so we create it once to preserve collapse state.

const visibleItems = computed(() => MENU_CONFIG.items.filter(i => !i.hidden && !i.line))
const byPath = computed(() => Object.fromEntries(visibleItems.value.map(i => [i.path, i])))

const sidebarItems = computed(() => {
  const pick = (path) => byPath.value[path]
  const nodes = []
  const pushItem = (item) => {
    if (!item) return
    nodes.push({
      label: item.label,
      icon: item.icon,
      active: item.path === currentPath.value,
      onClick: () => navigate(item.path),
    })
  }

  nodes.push({ section: 'Main Menu' })
  pushItem(pick('/dashboard'))
  pushItem(pick('/assets'))
  pushItem(pick('/monitoring'))
  pushItem(pick('/repair-history'))
  pushItem(pick('/activity-logs'))
  pushItem(pick('/support'))

  return nodes
})

const sidebar = buildSidebar({
  width:  '240px',
  pad:    '14px',
  items:  sidebarItems,
  bg:     '#0f1735',
  itemColor: '#d7deef',
  mutedColor: '#7f8cae',
  dividerColor: '#2a355d',
  activeColor: '#0f1735',
  activeBgColor: '#ffffff',
  radius: '14px',
  outerPadding: '4px',
  header: webFrame({
    align:     ['center', 'start'],
    gap:       '2',
    pad:       '2',
    style:     { marginBottom: '10px' },
    child: {
      1: webFrame({
        width: '34px',
        height: '34px',
        display: true,
        border: 'none',
        align: ['center', 'center'],
        style: {
          borderRadius: '999px',
          background: 'linear-gradient(145deg, #6f61ff, #4f46e5)',
        },
        child: {
          1: buildIcon(MENU_CONFIG.header.icon, { size: 18, color: '#ffffff' }),
        },
      }),
      2: webFrame({
        direction: 'col',
        child: {
          1: buildText(MENU_CONFIG.header.title, { size: 'lg', weight: 'bold', color: '#ffffff' }),
          2: buildText(MENU_CONFIG.header.subtitle, { size: 'xs', color: '#aab7de' }),
        },
      }),
    },
  }),
  footer: webFrame({
    align: ['center', 'start'],
    gap:   '3',
    pad:   '2',
    bg:    '#ffffff',
    radius:'md',
    style: { marginTop: '8px' },
    child: {
      1: buildImage(MENU_CONFIG.user.avatar, { avatar: true }),
      2: webFrame({
        direction: 'col',
        grow:      true,
        child: {
          1: buildText(MENU_CONFIG.user.name, { size: 'sm', weight: 'semibold', color: '#0f1735' }),
          2: buildText('Web Developer', { size: 'xs', color: '#64748b' }),
        },
      }),
      3: buildButton('', {
        variant: 'ghost',
        color:   'neutral',
        size:    'sm',
        icon:    buildIcon('logout', { size: 16, color: '#64748b' }),
        style:   { padding: '6px', minWidth: 'unset' },
        onClick: signOut,
      }),
    },
  }),
})

// ── Page content (driven by active item) ─────────────────────────────────

const content = computed(() => activeItem.value.content(MENU_CONFIG.user))
const renderedPage = computed(() => ({
  name: `Page-${currentPath.value}`,
  render: () => content.value,
}))
</script>

<template>
  <component
    v-if="!isAuthenticated"
    :is="{
      name: 'AuthLoginShell',
      render: () => LoginPage({ onAuthenticate: handleAuthenticate }),
    }"
  />
  <div v-else style="min-height: 100vh; background: #eef1f8; display: flex;">
    <component :is="sidebar" />
    <component :is="renderedPage" :key="currentPath" />
  </div>
</template>

