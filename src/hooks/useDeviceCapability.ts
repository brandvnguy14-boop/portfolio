'use client'

import { useState, useEffect } from 'react'
import { DeviceCapabilities } from '@/types'
import { getDeviceCapabilities } from '@/lib/device-detection'

const SSR_DEFAULTS: DeviceCapabilities = {
  type: 'desktop',
  isTouch: false,
  prefersReducedMotion: false,
  screenWidth: 1280,
  isHighPerformance: true,
}

export function useDeviceCapability(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(SSR_DEFAULTS)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    setCapabilities(getDeviceCapabilities())

    const handleResize = () => {
      setCapabilities(getDeviceCapabilities())
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionChange = () => {
      setCapabilities(getDeviceCapabilities())
    }

    window.addEventListener('resize', handleResize)
    motionQuery.addEventListener('change', handleMotionChange)

    return () => {
      window.removeEventListener('resize', handleResize)
      motionQuery.removeEventListener('change', handleMotionChange)
    }
  }, [])

  if (!hasMounted) return SSR_DEFAULTS
  return capabilities
}
