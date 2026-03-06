import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getDeviceType,
  getDeviceCapabilities,
  getAnimationIntensity,
  detectTouchCapability,
  detectReducedMotion,
} from '@/lib/device-detection'
import { DeviceCapabilities } from '@/types'

describe('getDeviceType', () => {
  it('returns mobile for widths below 768', () => {
    expect(getDeviceType(320)).toBe('mobile')
    expect(getDeviceType(767)).toBe('mobile')
  })

  it('returns tablet for widths 768-1023', () => {
    expect(getDeviceType(768)).toBe('tablet')
    expect(getDeviceType(1023)).toBe('tablet')
  })

  it('returns desktop for widths 1024+', () => {
    expect(getDeviceType(1024)).toBe('desktop')
    expect(getDeviceType(1920)).toBe('desktop')
  })
})

describe('getDeviceCapabilities', () => {
  it('returns desktop defaults when window is undefined (SSR)', () => {
    const originalWindow = global.window
    // @ts-expect-error testing SSR
    delete global.window
    const caps = getDeviceCapabilities()
    expect(caps.type).toBe('desktop')
    expect(caps.isTouch).toBe(false)
    expect(caps.prefersReducedMotion).toBe(false)
    expect(caps.isHighPerformance).toBe(true)
    global.window = originalWindow
  })
})

describe('getAnimationIntensity', () => {
  it('returns none when user prefers reduced motion', () => {
    const caps: DeviceCapabilities = {
      type: 'desktop',
      isTouch: false,
      prefersReducedMotion: true,
      screenWidth: 1920,
      isHighPerformance: true,
    }
    expect(getAnimationIntensity(caps)).toBe('none')
  })

  it('returns full for high-performance desktop', () => {
    const caps: DeviceCapabilities = {
      type: 'desktop',
      isTouch: false,
      prefersReducedMotion: false,
      screenWidth: 1920,
      isHighPerformance: true,
    }
    expect(getAnimationIntensity(caps)).toBe('full')
  })

  it('returns moderate for tablet', () => {
    const caps: DeviceCapabilities = {
      type: 'tablet',
      isTouch: true,
      prefersReducedMotion: false,
      screenWidth: 800,
      isHighPerformance: true,
    }
    expect(getAnimationIntensity(caps)).toBe('moderate')
  })

  it('returns minimal for mobile', () => {
    const caps: DeviceCapabilities = {
      type: 'mobile',
      isTouch: true,
      prefersReducedMotion: false,
      screenWidth: 375,
      isHighPerformance: false,
    }
    expect(getAnimationIntensity(caps)).toBe('minimal')
  })

  it('returns minimal for low-performance desktop', () => {
    const caps: DeviceCapabilities = {
      type: 'desktop',
      isTouch: false,
      prefersReducedMotion: false,
      screenWidth: 1920,
      isHighPerformance: false,
    }
    expect(getAnimationIntensity(caps)).toBe('minimal')
  })
})

describe('detectTouchCapability', () => {
  it('returns false when window is undefined', () => {
    const originalWindow = global.window
    // @ts-expect-error testing SSR
    delete global.window
    expect(detectTouchCapability()).toBe(false)
    global.window = originalWindow
  })
})

describe('detectReducedMotion', () => {
  it('returns false when window is undefined', () => {
    const originalWindow = global.window
    // @ts-expect-error testing SSR
    delete global.window
    expect(detectReducedMotion()).toBe(false)
    global.window = originalWindow
  })
})
