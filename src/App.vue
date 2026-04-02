<script setup>
import { ref, computed } from 'vue'
import { webFrame, buildText, buildIcon, buildButton, buildSidebar, buildImage } from './ui/index.js'
import { MENU_CONFIG } from './menu.js'

// ════════════════════════════════════════════════════════════════════════════
//  INTERNALS — no need to edit this file. Edit src/menu.js instead.
// ════════════════════════════════════════════════════════════════════════════

const defaultItem = MENU_CONFIG.items.find(i => !i.line && i.isDefault)
                 ?? MENU_CONFIG.items.find(i => !i.line)

const currentPath = ref(defaultItem?.path ?? '/')

function navigate(path) {
  currentPath.value = path
}

const activeItem = computed(() =>
  MENU_CONFIG.items.find(i => !i.line && i.path === currentPath.value)
  ?? defaultItem
)

// ── Sidebar ───────────────────────────────────────────────────────────────

const sidebar = computed(() =>
  buildSidebar({
    width: '260px',
    pad:   '16px',
    header: webFrame({
      direction: 'col',
      gap:       '1',
      pad:       '4',
      bg:        '#6366f1',
      radius:    'lg',
      style:     { marginBottom: '8px' },
      child: {
        1: webFrame({
          align: ['center', 'start'],
          gap:   '2',
          child: {
            1: buildIcon(MENU_CONFIG.header.icon,  { size: 24, color: '#ffffff' }),
            2: buildText(MENU_CONFIG.header.title, { size: 'lg', weight: 'bold', color: '#ffffff' }),
          },
        }),
        2: buildText(MENU_CONFIG.header.subtitle, { size: 'xs', color: '#c7d2fe' }),
      },
    }),
    items: MENU_CONFIG.items.map(i =>
      i.line
        ? { divider: true }
        : {
            label:   i.label,
            icon:    i.icon,
            active:  i.path === currentPath.value,
            onClick: () => navigate(i.path),
          }
    ),
    footer: webFrame({
      align: ['center', 'start'],
      gap:   '3',
      child: {
        1: buildImage(MENU_CONFIG.user.avatar, { avatar: true }),
        2: webFrame({
          direction: 'col',
          grow:      true,
          child: {
            1: buildText(MENU_CONFIG.user.name, { size: 'sm', weight: 'semibold', color: 'gray800' }),
            2: buildText(MENU_CONFIG.user.role, { size: 'xs', color: 'gray400' }),
          },
        }),
        3: buildButton('', {
          variant: 'ghost',
          color:   'error',
          size:    'sm',
          icon:    buildIcon('logout', { size: 16 }),
          style:   { padding: '6px', minWidth: 'unset' },
          onClick: () => console.log('sign out'),
        }),
      },
    }),
  })
)

// ── Page content (driven by active item) ─────────────────────────────────

const content = computed(() => activeItem.value.content(MENU_CONFIG.user))
</script>

<template>
  <div style="min-height: 100vh; background: #f8fafc; display: flex;">
    <component :is="() => sidebar" />
    <component :is="() => content" />
  </div>
</template>
