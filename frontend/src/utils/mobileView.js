import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const DEFAULT_BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
  desktop: 1440,
}

export function useResponsiveView(customBreakpoints = {}) {
  const breakpoints = { ...DEFAULT_BREAKPOINTS, ...customBreakpoints }
  const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1440)
  const viewportHeight = ref(typeof window !== 'undefined' ? window.innerHeight : 900)

  const isMobile = computed(() => viewportWidth.value < breakpoints.mobile)
  const isTablet = computed(() => viewportWidth.value >= breakpoints.mobile && viewportWidth.value < breakpoints.tablet)
  const isDesktop = computed(() => viewportWidth.value >= breakpoints.tablet)
  const isLargeDesktop = computed(() => viewportWidth.value >= breakpoints.desktop)

  const sidebarMode = computed(() => (isMobile.value ? 'overlay' : 'docked'))
  const compactDensity = computed(() => isMobile.value || isTablet.value)
  const contentWidthTier = computed(() => {
    if (viewportWidth.value < breakpoints.mobile) return 'xs'
    if (viewportWidth.value < breakpoints.tablet) return 'sm'
    if (viewportWidth.value < breakpoints.desktop) return 'md'
    return 'lg'
  })

  const updateViewport = () => {
    viewportWidth.value = window.innerWidth
    viewportHeight.value = window.innerHeight
  }

  onMounted(() => {
    window.addEventListener('resize', updateViewport, { passive: true })
    updateViewport()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateViewport)
  })

  return {
    viewportWidth,
    viewportHeight,
    breakpoints,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    sidebarMode,
    compactDensity,
    contentWidthTier,
    updateViewport,
  }
}

