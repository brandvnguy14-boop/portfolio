import { DeviceType, DeviceCapabilities } from '@/types'

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function getDeviceType(width: number): DeviceType {
  if (width < MOBILE_BREAKPOINT) return 'mobile'
  if (width < TABLET_BREAKPOINT) return 'tablet'
  return 'desktop'
}

export function detectTouchCapability(): boolean {
  if (typeof window === 'undefined') return false
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
  )
}

export function detectReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function detectHighPerformance(): boolean {
  if (typeof window === 'undefined') return true
  const nav = navigator as Navigator & { hardwareConcurrency?: number; deviceMemory?: number }
  const cores = nav.hardwareConcurrency ?? 4
  const memory = nav.deviceMemory ?? 4
  return cores >= 4 && memory >= 4
}

export function getDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === 'undefined') {
    return {
      type: 'desktop',
      isTouch: false,
      prefersReducedMotion: false,
      screenWidth: 1280,
      isHighPerformance: true,
    }
  }

  const width = window.innerWidth
  return {
    type: getDeviceType(width),
    isTouch: detectTouchCapability(),
    prefersReducedMotion: detectReducedMotion(),
    screenWidth: width,
    isHighPerformance: detectHighPerformance(),
  }
}

export function getAnimationIntensity(capabilities: DeviceCapabilities): 'full' | 'moderate' | 'minimal' | 'none' {
  if (capabilities.prefersReducedMotion) return 'none'
  if (capabilities.type === 'mobile' || !capabilities.isHighPerformance) return 'minimal'
  if (capabilities.type === 'tablet') return 'moderate'
  return 'full'
}
