# Device Detection - Pseudocode

## Detection Strategy
```
getDeviceCapabilities():
  IF server-side (no window):
    RETURN safe defaults (desktop, no-touch, full animations)

  width = window.innerWidth
  type = classifyByWidth(width)  // mobile < 768 < tablet < 1024 < desktop

  isTouch = check 'ontouchstart' in window
         OR navigator.maxTouchPoints > 0
         OR matchMedia('(pointer: coarse)')

  reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')

  highPerformance = hardwareConcurrency >= 4 AND deviceMemory >= 4

  RETURN { type, isTouch, reducedMotion, width, highPerformance }

getAnimationIntensity(caps):
  IF reducedMotion: RETURN 'none'
  IF mobile OR !highPerformance: RETURN 'minimal'
  IF tablet: RETURN 'moderate'
  RETURN 'full'
```

## Hook
```
useDeviceCapability():
  STATE capabilities = SSR_DEFAULTS
  STATE hasMounted = false

  ON mount:
    SET hasMounted = true
    SET capabilities = getDeviceCapabilities()
    LISTEN for resize -> update capabilities
    LISTEN for reduced-motion change -> update capabilities

  IF not mounted: RETURN SSR_DEFAULTS  // prevents hydration mismatch
  RETURN capabilities
```
