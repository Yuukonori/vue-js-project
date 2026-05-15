<script setup>
import { ref, computed, h, onMounted, onBeforeUnmount, watch } from 'vue'
import FuturisticSidebar from './pages/FuturisticSidebar.vue'
import FuturisticPageWrapper from './pages/FuturisticPageWrapper.vue'
import { MENU_CONFIG } from './menu.js'
import { LoginPage } from './pages/aut/login.js'
import { ForgotPasswordPage } from './pages/aut/forgotPassword.js'
import { authUtils, authFetch } from './utils/auth.js'

const currentPath = ref('/dashboard')
const isAuthenticated = ref(false)
const isAuthChecking = ref(true) // Prevents login flash during JWT verification on refresh
const showForgot = ref(false)
const pendingCasesCount = ref(0)
const currentUser = ref({ ...MENU_CONFIG.user, department: MENU_CONFIG.user?.department || 'IT' })
const accessPolicies = ref({})
let badgeInterval = null

function navigate(path) {
  currentPath.value = path
}

function signOut() {
  authUtils.clearAuth()
  isAuthenticated.value = false
  currentUser.value = { ...MENU_CONFIG.user, department: MENU_CONFIG.user?.department || 'IT' }
}

function handleAuthenticate() {
  isAuthenticated.value = true
}

async function handleAuthenticateWithPayload(payload) {
  if (payload?.token) {
    // Store token and user data
    authUtils.setToken(payload.token)
    authUtils.setUser(payload.user)
  }
  
  isAuthenticated.value = true
  
  if (payload?.user) {
    currentUser.value = {
      ...payload.user,
      department: payload.user.department || 'IT',
    }
  }

  // Force navigate to dashboard after login
  currentPath.value = '/dashboard'
}

// Auto-login if token exists
async function checkAuth() {
  const token = authUtils.getToken()
  const savedUser = authUtils.getUser()

  if (token && savedUser) {
    try {
      // Verify token with backend using raw fetch to avoid authFetch clearing auth
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.ok) {
        const data = await res.json()
        isAuthenticated.value = true
        currentUser.value = {
          ...data.user,
          department: data.user.department || 'IT',
        }
        console.log('Auto-login successful')
      } else if (res.status === 401 || res.status === 403) {
        // Token is genuinely expired or invalid — force re-login
        console.warn('Token invalid or expired, clearing auth')
        authUtils.clearAuth()
      } else {
        // Server error (500, etc.) — keep the token, don't log out
        console.warn('Verify endpoint returned error, keeping session:', res.status)
        isAuthenticated.value = true
        currentUser.value = {
          ...savedUser,
          department: savedUser.department || 'IT',
        }
      }
    } catch (err) {
      // Network error (backend unreachable) — keep session alive using saved user
      console.warn('Backend unreachable during auth check, using cached session')
      isAuthenticated.value = true
      currentUser.value = {
        ...savedUser,
        department: savedUser.department || 'IT',
      }
    }
  }
  // Always mark check as done so UI can render
  isAuthChecking.value = false
}

function handleAuthExpired() {
  isAuthenticated.value = false
  currentUser.value = { ...MENU_CONFIG.user, department: MENU_CONFIG.user?.department || 'IT' }
}

function isDoneStatus(status) {
  const normalized = String(status || '').trim().toLowerCase()
  return normalized === 'resolved' || normalized === 'completed' || normalized === 'done' || normalized === 'closed'
}

async function fetchPendingCasesCount() {
  const readTickets = async (url) => {
    const res = await fetch(url)
    const raw = await res.text()
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    return raw ? JSON.parse(raw) : []
  }

  try {
    const res = await fetch('/api/repair/tickets')
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    const tickets = await res.json()
    const unresolved = (Array.isArray(tickets) ? tickets : []).filter(t => !isDoneStatus(t?.status))
    pendingCasesCount.value = unresolved.length
  } catch (err) {
    console.error('Failed to fetch pending cases badge count:', err)
    pendingCasesCount.value = 0
  }
}

async function loadAccessPolicies() {
  try {
    const res = await fetch('/api/access-policies')
    if (!res.ok) throw new Error(`Failed to load policies: ${res.status}`)
    const rows = await res.json()
    const map = {}
    for (const row of Array.isArray(rows) ? rows : []) {
      map[String(row.department || '').toLowerCase()] = {
        pages: Array.isArray(row.allowed_pages) ? row.allowed_pages : [],
        features: Array.isArray(row.allowed_features) ? row.allowed_features : []
      }
    }
    accessPolicies.value = map
  } catch (err) {
    console.error('Failed to load access policies:', err)
    accessPolicies.value = {}
  }
}

function isITDepartment(dept) {
  const value = String(dept || '').trim().toLowerCase()
  return value === 'it' || value.includes('it')
}

const defaultNonITPaths = ['/dashboard', '/assets', '/support', '/repair-history', '/user-profile']

const allowedPaths = computed(() => {
  const roleKey = String(currentUser.value?.role || '').trim().toLowerCase()
  const deptKey = String(currentUser.value?.department || '').trim().toLowerCase()
  
  // Try Role first, then Department for policy lookups
  const policy = accessPolicies.value[roleKey] || accessPolicies.value[deptKey]
  const fromPolicy = policy?.pages

  if (Array.isArray(fromPolicy) && fromPolicy.includes('*')) return '*'
  if (Array.isArray(fromPolicy) && fromPolicy.length > 0) return fromPolicy
  
  if (currentUser.value?.role === 'Administrator' || isITDepartment(deptKey) || isITDepartment(roleKey)) return '*'
  return defaultNonITPaths
})

globalThis.__appNavigate = navigate

const defaultItem = MENU_CONFIG.items[0]
const activeItem = computed(() =>
  MENU_CONFIG.items.find(i => !i.line && i.path === currentPath.value)
  ?? defaultItem
)

const visibleItems = computed(() => {
  return MENU_CONFIG.items.filter(i => {
    if (i.hidden) return false
    if (i.path === '/access-control') {
      const role = String(currentUser.value?.role || '').toLowerCase()
      const dept = String(currentUser.value?.department || '').toLowerCase()
      return role === 'administrator' || isITDepartment(dept) || isITDepartment(role)
    }
    if (allowedPaths.value === '*') return true
    return allowedPaths.value.includes(i.path)
  })
})

const sidebarMenuItems = computed(() => {
  return visibleItems.value.map(item => ({
    id: item.path || item.id || ('divider-' + item.label),
    path: item.path,
    label: item.label,
    icon: item.icon,
    badge: item.path === '/cases' && pendingCasesCount.value > 0 ? String(pendingCasesCount.value) : null,
    line: !!item.line,
  }))
})

const allowedFeatures = computed(() => {
  const roleKey = String(currentUser.value?.role || '').trim().toLowerCase()
  const deptKey = String(currentUser.value?.department || '').trim().toLowerCase()
  
  const policy = accessPolicies.value[roleKey] || accessPolicies.value[deptKey]
  const fromPolicy = policy?.features

  if (currentUser.value?.role === 'Administrator' || isITDepartment(deptKey) || isITDepartment(roleKey)) {
    return ['network_map', 'all_tickets', 'create_ticket', 'delete_ticket', 'edit_asset', 'delete_asset', 'export_data', 'view_costs']
  }
  return Array.isArray(fromPolicy) ? fromPolicy : []
})

const renderedPage = computed(() => {
  if (allowedPaths.value !== '*' && !allowedPaths.value.includes(currentPath.value)) {
    currentPath.value = '/dashboard'
  }
  const page = activeItem.value.content({ 
    ...currentUser.value, 
    allowedFeatures: allowedFeatures.value 
  })
  if (page && (page.setup || page.render || typeof page === 'function')) {
    return page
  }
  return h('div', { style: { padding: '40px', color: '#e2e8f0' } }, [
    h('h1', { style: { color: '#f8fafc', marginBottom: '16px' } }, activeItem.value.label),
    h('p', 'This page is under construction.')
  ])
})

const authView = computed(() => {
  if (showForgot.value) {
    return ForgotPasswordPage({ onBack: () => { showForgot.value = false } })
  }
  return LoginPage({ 
    onAuthenticate: handleAuthenticateWithPayload,
    onForgot: () => { showForgot.value = true }
  })
})

onMounted(() => {
  checkAuth() // Check for existing token on mount
  loadAccessPolicies()
  fetchPendingCasesCount()
  badgeInterval = setInterval(fetchPendingCasesCount, 15000)
  window.addEventListener('auth-expired', handleAuthExpired)
  window.addEventListener('user-updated', () => {
    const savedUser = authUtils.getUser()
    if (savedUser) {
      currentUser.value = { ...savedUser, department: savedUser.department || 'IT' }
    }
  })
})

onBeforeUnmount(() => {
  if (badgeInterval) clearInterval(badgeInterval)
  window.removeEventListener('auth-expired', handleAuthExpired)
})

watch(currentPath, () => {
  if (allowedPaths.value !== '*' && !allowedPaths.value.includes(currentPath.value)) {
    currentPath.value = '/dashboard'
  }
})
</script>

<template>
  <!-- Blank screen while JWT is being verified — prevents login page flash on refresh -->
  <div v-if="isAuthChecking" style="height:100vh;background:#0f172a;"></div>
  <component v-else-if="!isAuthenticated" :is="authView" />
  <div v-else style="display: flex; height: 100vh; background: #f7fcff; color: #1e293b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; overflow: hidden;">
    <FuturisticSidebar 
      :menuItems="sidebarMenuItems"
      :activeItem="currentPath"
      :onNavigate="navigate"
      :onLogout="signOut"
      :userName="currentUser.name || MENU_CONFIG.user.name"
      :userRole="currentUser.role || MENU_CONFIG.user.role"
      :userAvatar="currentUser.avatar || ''"
    />
    <div style="flex: 1; margin-left: 280px; position: relative; overflow-y: auto; transition: margin-left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);">
      <FuturisticPageWrapper>
        <transition 
          name="fade" 
          mode="out-in"
        >
          <component :is="renderedPage" :key="currentPath" />
        </transition>
      </FuturisticPageWrapper>
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background: #f7fcff;
}
.nx-login {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(1200px 600px at 10% -10%, rgba(34, 211, 238, 0.18), transparent 60%),
    radial-gradient(1000px 520px at 100% 0%, rgba(99, 102, 241, 0.24), transparent 60%),
    linear-gradient(180deg, #050816, #080c1d 60%, #060915);
  color: #e6ecff;
  font-family: Inter, Segoe UI, system-ui, sans-serif;
}
.nx-bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(124, 154, 255, 0.09) 1px, transparent 1px),
    linear-gradient(90deg, rgba(124, 154, 255, 0.09) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent 75%);
  transform: perspective(900px) rotateX(60deg) translateY(24%);
}
.nx-bg-rings,.nx-bg-lines,.nx-mouse-glow,.nx-holo{position:absolute;pointer-events:none}
.nx-bg-rings{inset:-20%;background:radial-gradient(circle at 20% 30%,rgba(59,130,246,.18),transparent 35%),radial-gradient(circle at 75% 20%,rgba(168,85,247,.22),transparent 35%),radial-gradient(circle at 50% 80%,rgba(34,211,238,.12),transparent 45%);animation:floatBg 14s ease-in-out infinite}
.nx-bg-lines{inset:0;background:repeating-linear-gradient(115deg,transparent 0 140px,rgba(56,189,248,.08) 140px 141px,transparent 141px 280px);animation:scan 9s linear infinite}
.nx-mouse-glow{width:420px;height:420px;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(59,130,246,.26),rgba(168,85,247,.13) 35%,transparent 70%);filter:blur(14px);transition:left 2ms linear,top 2ms linear}
.nx-card-wrap{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
.nx-holo{width:560px;height:560px;border-radius:50%;background:radial-gradient(circle,rgba(96,165,250,.16),rgba(168,85,247,.1),transparent 72%);filter:blur(10px);animation:pulse 5s ease-in-out infinite}
.nx-card{position:relative;width:min(92vw,480px);padding:30px 28px 24px;border-radius:28px;background:linear-gradient(135deg,rgba(16,23,42,.65),rgba(30,41,59,.45));backdrop-filter:blur(18px);border:1px solid rgba(148,163,184,.34);box-shadow:0 30px 90px rgba(0,0,0,.52),0 0 0 1px rgba(147,197,253,.2) inset;animation:cardIn .8s cubic-bezier(.22,1,.36,1)}
.nx-card::before{content:'';position:absolute;inset:-1px;border-radius:28px;padding:1px;background:linear-gradient(120deg,rgba(56,189,248,.7),rgba(99,102,241,.58),rgba(168,85,247,.7));mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:borderFlow 6s linear infinite}
.nx-logo{font-size:42px;font-weight:800;letter-spacing:.4px;background:linear-gradient(90deg,#e6f2ff,#9ad8ff 45%,#c7b8ff);background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-align:center;text-shadow:0 0 24px rgba(96,165,250,.35)}
.nx-sub{text-align:center;font-size:11px;letter-spacing:3.6px;text-transform:uppercase;color:#b3c4ef;margin-top:6px}
.nx-divider{height:1px;margin:16px 0 14px;background:linear-gradient(90deg,transparent,rgba(148,163,184,.6),transparent)}
.nx-label{display:block;font-size:12px;color:#b8c6eb;text-transform:uppercase;letter-spacing:1.2px;margin:8px 0 8px}
.nx-pass-head{display:flex;justify-content:space-between;align-items:center}
.nx-input-wrap{position:relative;margin-bottom:8px}
.nx-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#9eb4e6;font-size:12px}
.nx-input{width:100%;height:48px;border-radius:14px;border:1px solid rgba(148,163,184,.34);background:rgba(15,23,42,.46);color:#eff6ff;padding:0 40px 0 36px;outline:none;transition:all .25s ease}
.nx-input::placeholder{color:#9fb0d4}
.nx-input:hover{transform:translateY(-1px);border-color:rgba(96,165,250,.5)}
.nx-input:focus{border-color:#60a5fa;box-shadow:0 0 0 3px rgba(59,130,246,.2),0 0 30px rgba(56,189,248,.18)}
.nx-eye{position:absolute;right:10px;top:50%;transform:translateY(-50%);border:none;background:transparent;color:#9eb4e6;cursor:pointer}
.nx-link{border:none;background:transparent;color:#9cc8ff;font-size:12px;cursor:pointer}
.nx-link:hover{text-decoration:underline}
.nx-error{min-height:18px;margin:4px 0 8px;color:#fda4af;font-size:12px}
.nx-error-empty{opacity:0}
.nx-login-btn{position:relative;width:100%;height:52px;border:none;border-radius:14px;color:#fff;cursor:pointer;overflow:hidden;background:linear-gradient(92deg,#2563eb,#6366f1 50%,#8b5cf6);box-shadow:0 12px 32px rgba(79,70,229,.45);transition:transform .2s ease,box-shadow .2s ease}
.nx-login-btn:hover{transform:translateY(-1px);box-shadow:0 16px 38px rgba(79,70,229,.55)}
.nx-login-btn:active{transform:translateY(1px) scale(.997)}
.nx-btn-shine{position:absolute;inset:-40% -120%;background:linear-gradient(110deg,transparent 36%,rgba(255,255,255,.3) 48%,transparent 62%);animation:shine 2.8s linear infinite}
.nx-btn-text{position:relative;font-weight:700;letter-spacing:1.2px}
.nx-btn-arrow{position:relative;margin-left:10px;display:inline-block;animation:arrowPulse 1.5s ease-in-out infinite}
.nx-policy{margin-top:12px;width:100%;height:38px;border-radius:11px;border:1px solid rgba(148,163,184,.38);background:rgba(15,23,42,.5);color:#c7d5f5;cursor:pointer}
@keyframes cardIn{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes borderFlow{to{filter:hue-rotate(360deg)}}
@keyframes shine{to{transform:translateX(60%)}}
@keyframes arrowPulse{50%{transform:translateX(3px)}}
@keyframes pulse{50%{transform:scale(1.03)}}
@keyframes floatBg{50%{transform:translateY(-10px)}}
@keyframes scan{to{transform:translateX(-160px)}}
@media (max-width:640px){.nx-card{padding:24px 18px 18px}.nx-logo{font-size:34px}.nx-sub{letter-spacing:2.4px}}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
