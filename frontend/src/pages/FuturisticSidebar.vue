<template>
  <div :class="containerClasses">
    <button
      v-if="isMobile && !props.useExternalMobileTrigger"
      class="mobile-menu-trigger"
      type="button"
      aria-label="Toggle menu"
      @click="toggleSidebar"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    </button>

    <transition name="fade-blur">
      <button
        v-if="isMobile && mobileOpen"
        class="sidebar-backdrop"
        type="button"
        aria-label="Close menu"
        @click="closeMobileMenu"
      />
    </transition>

    <!-- Animated Background Particles -->
    <div class="particles-bg">
      <div v-for="i in 20" :key="i" class="particle" :style="particleStyle(i)"></div>
    </div>

    <!-- Main Sidebar -->
    <aside 
      :class="['futuristic-sidebar', { collapsed: isCollapsed }]"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- Glow Effect -->
      <div class="sidebar-glow"></div>

      <!-- Header -->
      <div class="sidebar-header">
        <div class="logo-container">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" fill="url(#logo-gradient)"/>
              <defs>
                <linearGradient id="logo-gradient" x1="3" y1="3" x2="21" y2="21">
                  <stop offset="0%" stop-color="#60a5fa"/>
                  <stop offset="100%" stop-color="#a78bfa"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <transition name="fade-slide">
            <span v-if="!isCollapsed" class="logo-text">BuilderUI</span>
          </transition>
        </div>
        
        <!-- Toggle Button -->
        <button 
          class="toggle-btn"
          @click="handleSidebarToggleButton"
          :class="{ collapsed: isCollapsed }"
        >
          <svg v-if="!isCollapsed" class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          <svg v-else class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="sidebar-nav">
        <div 
          v-for="(item, index) in displayMenuItems" 
          :key="item.id"
          class="menu-item-wrapper"
          :style="{ '--item-index': index }"
        >
          <div v-if="item.line" class="menu-divider" role="separator" aria-hidden="true"></div>

          <template v-else>
            <!-- Active Indicator -->
            <div v-if="props.activeItem === item.id" class="active-indicator"></div>
            
            <div
              :class="['menu-item', { active: props.activeItem === item.id }]"
              @click="handleItemClick(item.id)"
              @mouseenter="handleItemHover(item.id, $event)"
              @mouseleave="handleItemLeave"
            >
              <div class="icon-container">
                <component :is="item.icon" class="menu-icon" />
              </div>
              <transition name="fade-slide">
                <span v-if="!isCollapsed" class="menu-label">{{ item.label }}</span>
              </transition>
              
              <!-- Badge -->
              <transition name="scale-fade">
                <span v-if="item.badge" :class="['menu-badge', { 'collapsed-badge': isCollapsed }]">{{ item.badge }}</span>
              </transition>
            </div>

            <!-- Tooltip for collapsed state -->
            <transition name="tooltip-fade">
              <div v-if="isCollapsed && hoveredItem === item.id" class="menu-tooltip">
                {{ item.label }}
              </div>
            </transition>
          </template>
        </div>
      </nav>

      <!-- User Footer -->
      <div class="sidebar-footer">
        <div
          class="user-profile"
          role="button"
          tabindex="0"
          @click="handleUserProfileClick"
          @keydown.enter="handleUserProfileClick"
        >
          <div class="user-avatar">
            <img v-if="props.userAvatar" :src="props.userAvatar" alt="User Avatar" class="avatar-img" />
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <transition name="fade-slide">
            <div v-if="!isCollapsed" class="user-info">
              <div class="user-name">{{ props.userName }}</div>
              <div class="user-role">{{ props.userRole }}</div>
            </div>
          </transition>
          <button v-if="!isCollapsed" class="logout-btn" type="button" aria-label="Log out" @click.stop="handleLogout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mouse Follow Glow -->
      <div 
        class="mouse-glow" 
        :style="{ 
          left: mouseX + 'px', 
          top: mouseY + 'px',
          opacity: mouseInSidebar ? 1 : 0
        }"
      ></div>
    </aside>

    <!-- Logout Modal -->
    <transition name="fade-blur">
      <div v-if="showLogoutModal" class="custom-modal-overlay">
        <div class="custom-modal-card">
          <div class="modal-header">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out of your account?</p>
          </div>
          <div class="modal-actions">
            <button class="modal-btn-cancel" @click="showLogoutModal = false">Cancel</button>
            <button class="modal-btn-confirm" @click="confirmLogout">Logout</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

// Props
const props = defineProps({
  menuItems: {
    type: Array,
    required: true
  },
  activeItem: {
    type: String,
    default: 'dashboard'
  },
  onNavigate: {
    type: Function,
    required: true
  },
  onLogout: {
    type: Function,
    default: null
  },
  onCollapseChange: {
    type: Function,
    default: null
  },
  userName: {
    type: String,
    default: 'User'
  },
  userRole: {
    type: String,
    default: 'Admin'
  },
  userAvatar: {
    type: String,
    default: ''
  },
  useExternalMobileTrigger: {
    type: Boolean,
    default: false
  }
})

// Icons (using h() render function)
import { h } from 'vue'

const DashboardIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '3', y: '3', width: '7', height: '7', rx: '1' }),
      h('rect', { x: '14', y: '3', width: '7', height: '7', rx: '1' }),
      h('rect', { x: '14', y: '14', width: '7', height: '7', rx: '1' }),
      h('rect', { x: '3', y: '14', width: '7', height: '7', rx: '1' })
    ])
  }
}

const AssetsIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '2', y: '7', width: '20', height: '14', rx: '2' }),
      h('path', { d: 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' })
    ])
  }
}

const SupportIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' })
    ])
  }
}

const RepairIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' })
    ])
  }
}

const MonitoringIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M3 3v18h18' }),
      h('path', { d: 'M18 17V9' }),
      h('path', { d: 'M13 17V5' }),
      h('path', { d: 'M8 17v-3' })
    ])
  }
}

const ActivityIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
      h('path', { d: 'M14 2v6h6' }),
      h('path', { d: 'M16 13H8' }),
      h('path', { d: 'M16 17H8' }),
      h('path', { d: 'M10 9H8' })
    ])
  }
}

const UsersIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' }),
      h('circle', { cx: '9', cy: '7', r: '4' }),
      h('path', { d: 'M23 21v-2a4 4 0 0 0-3-3.87' }),
      h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' })
    ])
  }
}

const CasesIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '3', y: '7', width: '18', height: '13', rx: '2' }),
      h('path', { d: 'M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' })
    ])
  }
}

const DefaultIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('path', { d: 'M12 6v6l4 2' })
    ])
  }
}

const ShieldIcon = {
  render() {
    return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' })
    ])
  }
}

// Icon mapping
const iconMap = {
  'dashboard': DashboardIcon,
  'assets': AssetsIcon,
  'support': SupportIcon,
  'repair-history': RepairIcon,
  'monitoring': MonitoringIcon,
  'activity-logs': ActivityIcon,
  'users': UsersIcon,
  'user': UsersIcon, // Alias for users
  'cases': CasesIcon,
  'clipboard': CasesIcon, // Alias for cases
  'shield': ShieldIcon,
}

// State
const isCollapsed = ref(false)
const hoveredItem = ref(null)
const mouseX = ref(0)
const mouseY = ref(0)
const mouseInSidebar = ref(false)
const showLogoutModal = ref(false)
const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1440)
const mobileOpen = ref(false)
const mobileExpanded = ref(false)
const tabletExpanded = ref(false)

const isMobile = computed(() => viewportWidth.value < 768)
const isTablet = computed(() => viewportWidth.value >= 768 && viewportWidth.value <= 1024)
const isDesktop = computed(() => viewportWidth.value > 1024)
const containerClasses = computed(() => [
  'sidebar-container',
  {
    'mobile-open': isMobile.value && mobileOpen.value,
    'mobile-pinned': (isTablet.value || isMobile.value) && (isTablet.value || mobileOpen.value),
    'mobile-expanded': (isTablet.value && tabletExpanded.value) || (isMobile.value && mobileOpen.value && mobileExpanded.value),
  },
])

const applyResponsiveState = () => {
  if (isDesktop.value) {
    mobileOpen.value = false
    tabletExpanded.value = false
    props.onCollapseChange?.(isCollapsed.value)
    return
  }

  if (isTablet.value) {
    mobileOpen.value = false
    isCollapsed.value = !tabletExpanded.value
    props.onCollapseChange?.(true)
    return
  }

  mobileOpen.value = false
  mobileExpanded.value = false
  tabletExpanded.value = false
  isCollapsed.value = true
  props.onCollapseChange?.(true)
}

// Computed
const displayMenuItems = computed(() => {
  return props.menuItems.map(item => ({
    id: item.path || item.id,
    label: item.label,
    icon: iconMap[item.icon] || DefaultIcon,
    badge: item.badge,
    line: !!item.line,
  }))
})

// Methods
const toggleSidebar = () => {
  if (isMobile.value) {
    if (!mobileOpen.value) {
      mobileOpen.value = true
      mobileExpanded.value = false
      isCollapsed.value = true
    } else {
      mobileExpanded.value = !mobileExpanded.value
      isCollapsed.value = !mobileExpanded.value
    }
    props.onCollapseChange?.(true)
    return
  }

  if (isTablet.value) {
    tabletExpanded.value = !tabletExpanded.value
    isCollapsed.value = !tabletExpanded.value
    props.onCollapseChange?.(true)
    return
  }

  isCollapsed.value = !isCollapsed.value
  props.onCollapseChange?.(isCollapsed.value)
}

const handleSidebarToggleButton = () => {
  if (isMobile.value && mobileOpen.value && !mobileExpanded.value) {
    mobileExpanded.value = true
    isCollapsed.value = false
    props.onCollapseChange?.(true)
    return
  }
  toggleSidebar()
}

const handleItemClick = (id) => {
  props.onNavigate(id)
  if (isMobile.value) {
    mobileOpen.value = false
    mobileExpanded.value = false
    isCollapsed.value = true
  }
  if (isTablet.value) {
    tabletExpanded.value = false
    isCollapsed.value = true
  }
}

const closeMobileMenu = () => {
  mobileOpen.value = false
  mobileExpanded.value = false
  isCollapsed.value = true
}

const handleExternalMobileToggle = () => {
  if (!isMobile.value) return
  if (!mobileOpen.value) {
    mobileOpen.value = true
    mobileExpanded.value = false
    isCollapsed.value = true
  } else {
    closeMobileMenu()
  }
}

const handleUserProfileClick = () => {
  props.onNavigate('/user-profile')
}

const handleLogout = () => {
  showLogoutModal.value = true
}

const confirmLogout = () => {
  showLogoutModal.value = false
  props.onLogout?.()
}

const handleItemHover = (id, event) => {
  hoveredItem.value = id
}

const handleItemLeave = () => {
  hoveredItem.value = null
}

const handleMouseEnter = () => {
  mouseInSidebar.value = true
}

const handleMouseLeave = () => {
  mouseInSidebar.value = false
}

const particleStyle = (index) => {
  const size = Math.random() * 4 + 2
  const delay = Math.random() * 5
  const duration = Math.random() * 10 + 10
  const x = Math.random() * 100
  const y = Math.random() * 100
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}%`,
    top: `${y}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  }
}

const handleResize = () => {
  viewportWidth.value = window.innerWidth
  applyResponsiveState()
}

// Track mouse position
onMounted(() => {
  applyResponsiveState()
  window.addEventListener('resize', handleResize, { passive: true })
  window.addEventListener('toggle-mobile-sidebar', handleExternalMobileToggle)
  const sidebar = document.querySelector('.futuristic-sidebar')
  if (sidebar) {
    sidebar.addEventListener('mousemove', (e) => {
      const rect = sidebar.getBoundingClientRect()
      mouseX.value = e.clientX - rect.left
      mouseY.value = e.clientY - rect.top
    })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('toggle-mobile-sidebar', handleExternalMobileToggle)
})
</script>

<style scoped>
.sidebar-container {
  position: relative;
  height: 100vh;
}
.sidebar-backdrop {
  position: fixed;
  inset: 0;
  border: 0;
  background: rgba(15, 23, 42, 0.32);
  z-index: 1390;
}
.mobile-menu-trigger {
  position: fixed;
  top: 14px;
  left: 14px;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid rgba(96, 165, 250, 0.35);
  background: rgba(15, 23, 42, 0.9);
  color: #bfdbfe;
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  box-shadow: 0 10px 26px rgba(2, 6, 23, 0.35);
}
.mobile-menu-trigger svg {
  width: 20px;
  height: 20px;
}
@media (max-width: 767px) {
  .mobile-menu-trigger {
    display: flex;
  }
}

.particles-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.futuristic-sidebar.collapsed ~ .particles-bg,
.futuristic-sidebar.collapsed + .particles-bg {
  width: 88px;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.4), transparent);
  border-radius: 50%;
  animation: float infinite ease-in-out;
  opacity: 0.3;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-20px) translateX(10px);
  }
}

.futuristic-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 280px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9));
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(96, 165, 250, 0.1);
  transition: width 0.38s cubic-bezier(0.22, 1, 0.36, 1), transform 0.38s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.28s ease;
  z-index: 1000;
  overflow: hidden;
  will-change: transform, width;
  box-shadow: 
    0 0 60px rgba(96, 165, 250, 0.1),
    inset 0 0 60px rgba(96, 165, 250, 0.03);
}

@media (max-width: 1600px) and (min-width: 1367px) {
  .particles-bg {
    width: 260px;
  }
  .futuristic-sidebar {
    width: 260px;
  }
  .futuristic-sidebar.collapsed {
    width: 84px;
  }
}

@media (max-width: 1366px) and (min-width: 1025px) {
  .particles-bg {
    width: 240px;
  }
  .futuristic-sidebar {
    width: 240px;
  }
  .futuristic-sidebar.collapsed {
    width: 78px;
  }
}
@media (max-width: 1024px) {
  .sidebar-container {
    position: fixed;
    inset: 0 auto 0 0;
    width: 0;
    z-index: 1400;
    pointer-events: none;
  }
  .particles-bg {
    display: none;
  }
  .futuristic-sidebar {
    transform: translateX(-105%);
    transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1), width 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    pointer-events: auto;
    will-change: transform, width;
    z-index: 1405;
    backface-visibility: hidden;
    transform-style: preserve-3d;
  }
  .sidebar-container.mobile-open .futuristic-sidebar {
    transform: translateX(0);
  }
  .sidebar-container.mobile-pinned {
    width: 78px;
    pointer-events: auto;
  }
  .sidebar-container.mobile-pinned .futuristic-sidebar {
    width: 78px;
    transform: translateX(0);
    border-radius: 0 16px 16px 0;
  }
  .sidebar-container.mobile-pinned .futuristic-sidebar:not(.collapsed) { width: 78px; }
  .sidebar-container.mobile-pinned.mobile-expanded {
    width: 272px;
    z-index: 1400;
  }
  .sidebar-container.mobile-pinned.mobile-expanded .futuristic-sidebar {
    width: 260px;
    transform: translateX(0);
    border-radius: 0 16px 16px 0;
  }
  .sidebar-container.mobile-pinned.mobile-expanded .futuristic-sidebar.collapsed {
    width: 88px;
  }
  .sidebar-container.mobile-pinned .particles-bg {
    display: none;
  }
  .sidebar-container.mobile-pinned .menu-label,
  .sidebar-container.mobile-pinned .logo-text,
  .sidebar-container.mobile-pinned .user-info,
  .sidebar-container.mobile-pinned .logout-btn {
    display: none;
  }
  .sidebar-container.mobile-pinned .sidebar-header {
    padding: 14px 10px;
    justify-content: center;
    background: linear-gradient(135deg, #3b82f6, #14b8a6);
  }
  .sidebar-container.mobile-pinned .toggle-btn {
    background: #ffffff;
    color: #3b82f6;
    border-color: #93c5fd;
    box-shadow: 0 0 20px rgba(147, 197, 253, 0.55);
  }
  .sidebar-container.mobile-pinned .logo-container {
    display: none;
  }
  .sidebar-container.mobile-pinned .sidebar-nav {
    padding: 14px 8px;
    gap: 12px;
  }
  .sidebar-container.mobile-pinned .menu-item {
    justify-content: center;
    padding: 11px 8px;
    border-radius: 12px;
  }
  .sidebar-container.mobile-pinned .menu-item.active {
    border-color: rgba(147, 197, 253, 0.75);
    box-shadow: 0 0 0 1px rgba(96, 165, 250, 0.35) inset, 0 8px 22px rgba(59, 130, 246, 0.25);
  }
  .sidebar-container.mobile-pinned .active-indicator {
    display: none;
  }
  .sidebar-container.mobile-pinned.mobile-expanded .sidebar-header {
    justify-content: space-between;
    padding: 14px 16px;
  }
  .sidebar-container.mobile-pinned.mobile-expanded .logo-container {
    display: flex;
  }
  .sidebar-container.mobile-pinned.mobile-expanded .sidebar-nav {
    padding: 14px 12px;
    gap: 4px;
  }
  .sidebar-container.mobile-pinned.mobile-expanded .menu-item {
    justify-content: flex-start;
    padding: 14px 16px;
    border-radius: 16px;
  }
  .sidebar-container.mobile-pinned.mobile-expanded .active-indicator {
    display: block;
  }
  .sidebar-container.mobile-pinned .sidebar-footer {
    padding: 10px 8px;
  }
  .sidebar-container.mobile-pinned .user-profile {
    justify-content: center;
    padding: 8px;
    border-radius: 14px;
  }
  .sidebar-container.mobile-pinned.mobile-expanded .sidebar-footer {
    padding: 14px 12px;
  }
  .sidebar-container.mobile-pinned.mobile-expanded .user-profile {
    justify-content: flex-start;
    padding: 12px;
  }
  .sidebar-container.mobile-pinned.mobile-expanded .menu-label,
  .sidebar-container.mobile-pinned.mobile-expanded .logo-text,
  .sidebar-container.mobile-pinned.mobile-expanded .user-info {
    display: revert;
    animation: mobileFadeIn 0.22s ease-out;
  }
  .sidebar-container.mobile-pinned.mobile-expanded .logout-btn {
    display: flex;
    animation: mobileFadeIn 0.22s ease-out;
  }

  /* Keep collapsed mobile top block same style family as desktop */
  .sidebar-container.mobile-open:not(.mobile-expanded) .sidebar-header {
    background: transparent;
    border-bottom-color: rgba(96, 165, 250, 0.1);
  }
  .sidebar-container.mobile-open:not(.mobile-expanded) .toggle-btn {
    background: rgba(96, 165, 250, 0.1);
    color: #60a5fa;
    border-color: rgba(96, 165, 250, 0.2);
    box-shadow: none;
  }

  /* Keep expanded mobile header identical to desktop header styling */
  .sidebar-container.mobile-open.mobile-expanded .sidebar-header,
  .sidebar-container.mobile-pinned.mobile-expanded .sidebar-header {
    background: transparent;
    border-bottom-color: rgba(96, 165, 250, 0.1);
  }
  .sidebar-container.mobile-open.mobile-expanded .logo-text,
  .sidebar-container.mobile-pinned.mobile-expanded .logo-text {
    background: linear-gradient(135deg, #60a5fa, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: inherit;
  }
  .sidebar-container.mobile-open.mobile-expanded .logo-icon,
  .sidebar-container.mobile-pinned.mobile-expanded .logo-icon {
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(167, 139, 250, 0.2));
    border-color: rgba(96, 165, 250, 0.3);
    box-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
  }
  .sidebar-container.mobile-open.mobile-expanded .toggle-btn,
  .sidebar-container.mobile-pinned.mobile-expanded .toggle-btn {
    background: rgba(96, 165, 250, 0.1);
    color: #60a5fa;
    border-color: rgba(96, 165, 250, 0.2);
    box-shadow: none;
  }
}

@media (max-width: 767px) {
  .sidebar-container.mobile-open .futuristic-sidebar {
    transform: translate3d(0, 0, 0);
  }
  .sidebar-container.mobile-open:not(.mobile-expanded) .futuristic-sidebar {
    width: 78px;
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), width 0.2s ease-out;
  }
  .sidebar-container.mobile-open.mobile-expanded .futuristic-sidebar {
    width: 260px;
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), width 0.24s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .sidebar-backdrop {
    transition: opacity 0.22s ease;
    will-change: opacity;
  }
}

@keyframes mobileFadeIn {
  from {
    opacity: 0;
    transform: translateX(-4px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.futuristic-sidebar.collapsed {
  width: 88px;
}

.sidebar-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.1), transparent 70%);
  animation: rotate 20s linear infinite;
  pointer-events: none;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 20px;
  border-bottom: 1px solid rgba(96, 165, 250, 0.1);
  position: relative;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(167, 139, 250, 0.2));
  border-radius: 12px;
  border: 1px solid rgba(96, 165, 250, 0.3);
  box-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
  transition: all 0.3s ease;
}

.logo-icon:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(96, 165, 250, 0.5);
}

.logo-icon svg {
  width: 24px;
  height: 24px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.toggle-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(96, 165, 250, 0.1);
  border: 1px solid rgba(96, 165, 250, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  color: #60a5fa;
}

.toggle-btn:hover {
  background: rgba(96, 165, 250, 0.2);
  border-color: rgba(96, 165, 250, 0.4);
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
}

.toggle-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.sidebar-nav {
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  height: calc(100vh - 200px);
}

.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(96, 165, 250, 0.3);
  border-radius: 2px;
}

.menu-item-wrapper {
  position: relative;
  animation: slideIn 0.5s ease-out backwards;
  animation-delay: calc(var(--item-index) * 0.05s);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.active-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 70%;
  background: linear-gradient(180deg, #60a5fa, #a78bfa);
  border-radius: 0 4px 4px 0;
  box-shadow: 0 0 20px rgba(96, 165, 250, 0.6);
  animation: slideInIndicator 0.3s ease-out;
}

@keyframes slideInIndicator {
  from {
    height: 0%;
    opacity: 0;
  }
  to {
    height: 70%;
    opacity: 1;
  }
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  color: rgba(226, 232, 240, 0.7);
  overflow: hidden;
}

.futuristic-sidebar.collapsed .menu-item {
  justify-content: center;
  padding: 14px;
}

.menu-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(167, 139, 250, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 16px;
}

.menu-item:hover::before {
  opacity: 1;
}

.menu-item:hover {
  transform: scale(1.01);
  color: #e2e8f0;
  box-shadow: 0 8px 24px rgba(96, 165, 250, 0.2);
}

.menu-item.active {
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.15), rgba(167, 139, 250, 0.15));
  color: #ffffff;
  border: 1px solid rgba(96, 165, 250, 0.3);
  box-shadow: 
    0 0 30px rgba(96, 165, 250, 0.3),
    inset 0 0 20px rgba(96, 165, 250, 0.1);
  transform: scale(1.02);
}

.icon-container {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.menu-item:hover .icon-container {
  transform: rotate(5deg) scale(1.1);
}

.menu-item.active .icon-container {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.menu-icon {
  width: 100%;
  height: 100%;
}

.menu-label {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.menu-badge {
  margin-left: auto;
  padding: 2px 8px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
}

.collapsed-badge {
  position: absolute;
  top: 6px;
  right: 10px;
  margin-left: 0;
  min-width: 19px;
  height: 19px;
  padding: 0 6px;
  border-radius: 999px;
  border: 2px solid #14233f;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  box-shadow: 0 6px 14px rgba(239, 68, 68, 0.45);
  transform: translate(28%, -22%);
  z-index: 3;
}

.menu-tooltip {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 12px;
  padding: 8px 16px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(96, 165, 250, 0.3);
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  pointer-events: none;
}

.menu-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.3), transparent);
  margin: 16px 0;
  animation: dividerGlow 3s ease-in-out infinite;
}

@keyframes dividerGlow {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

.mouse-glow {
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.15), transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
  z-index: 1;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: all 0.2s ease;
}

.scale-fade-enter-from,
.scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: all 0.2s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px) translateY(-50%);
}

/* User Footer */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(96, 165, 250, 0.1);
  margin-top: auto;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(167, 139, 250, 0.1));
  border: 1px solid rgba(96, 165, 250, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.futuristic-sidebar.collapsed .user-profile {
  justify-content: center;
  padding: 12px 8px;
}

.user-profile:hover {
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.15), rgba(167, 139, 250, 0.15));
  border-color: rgba(96, 165, 250, 0.3);
  box-shadow: 0 4px 16px rgba(96, 165, 250, 0.2);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0 20px rgba(96, 165, 250, 0.4);
}

.user-avatar svg {
  width: 24px;
  height: 24px;
  color: white;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 12px;
  color: rgba(226, 232, 240, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(96, 165, 250, 0.25);
  background: rgba(15, 23, 42, 0.35);
  color: #93c5fd;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  border-color: rgba(96, 165, 250, 0.45);
  color: #bfdbfe;
  background: rgba(30, 41, 59, 0.55);
}

.logout-btn svg {
  width: 16px;
  height: 16px;
}

/* Modal Styles */
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
}

.custom-modal-card {
  width: 400px;
  background: #ffffff;
  padding: 32px;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15);
  border: 1px solid rgba(226, 232, 240, 0.8);
}
@media (max-width: 640px) {
  .custom-modal-card {
    width: calc(100vw - 24px);
    max-width: 400px;
    padding: 22px;
    border-radius: 16px;
  }
}

.modal-header h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.modal-header p {
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #64748b;
}

.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.modal-btn-cancel {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-btn-cancel:hover {
  background: #f8fafc;
}

.modal-btn-confirm {
  padding: 12px;
  border-radius: 12px;
  border: none;
  background: #ef4444;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-btn-confirm:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.fade-blur-enter-active,
.fade-blur-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-blur-enter-from,
.fade-blur-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
