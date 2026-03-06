'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useDeviceCapability } from '@/hooks/useDeviceCapability'
import { getAnimationIntensity } from '@/lib/device-detection'

interface Neuron {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  activation: number
  pulsePhase: number
  connections: number[]
}

interface Synapse {
  from: number
  to: number
  strength: number
  firing: boolean
  fireProgress: number
}

const NEURON_COUNTS = { full: 30, moderate: 20, minimal: 12, none: 0 }
const CONNECTION_DISTANCE = { full: 120, moderate: 100, minimal: 80, none: 0 }
const FIRE_CHANCE = { full: 0.001, moderate: 0.0008, minimal: 0.0005, none: 0 }

export function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const neuronsRef = useRef<Neuron[]>([])
  const synapsesRef = useRef<Synapse[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000, active: false })
  const device = useDeviceCapability()
  const intensity = getAnimationIntensity(device)

  const initNeurons = useCallback(
    (width: number, height: number) => {
      const count = NEURON_COUNTS[intensity]
      const neurons: Neuron[] = []
      for (let i = 0; i < count; i++) {
        neurons.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: 2 + Math.random() * 3,
          activation: 0,
          pulsePhase: Math.random() * Math.PI * 2,
          connections: [],
        })
      }
      neuronsRef.current = neurons
      synapsesRef.current = []
    },
    [intensity]
  )

  const updateSynapses = useCallback(() => {
    const neurons = neuronsRef.current
    const maxDist = CONNECTION_DISTANCE[intensity]
    const synapses: Synapse[] = []

    for (let i = 0; i < neurons.length; i++) {
      neurons[i].connections = []
      for (let j = i + 1; j < neurons.length; j++) {
        const dx = neurons[i].x - neurons[j].x
        const dy = neurons[i].y - neurons[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < maxDist) {
          const strength = 1 - dist / maxDist
          synapses.push({
            from: i,
            to: j,
            strength,
            firing: false,
            fireProgress: 0,
          })
          neurons[i].connections.push(j)
          neurons[j].connections.push(i)
        }
      }
    }
    synapsesRef.current = synapses
  }, [intensity])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || intensity === 'none') return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
      initNeurons(canvas.offsetWidth, canvas.offsetHeight)
      updateSynapses()
    }

    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true }
    }

    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect()
      const touch = e.touches[0]
      mouseRef.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top, active: true }
    }

    const handleLeave = () => {
      mouseRef.current = { ...mouseRef.current, active: false }
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true })
    canvas.addEventListener('mouseleave', handleLeave)
    canvas.addEventListener('touchend', handleLeave)

    const animate = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      ctx.clearRect(0, 0, width, height)

      const neurons = neuronsRef.current
      const synapses = synapsesRef.current
      const mouse = mouseRef.current
      const fireChance = FIRE_CHANCE[intensity]

      // Update neurons
      for (const neuron of neurons) {
        neuron.x += neuron.vx
        neuron.y += neuron.vy
        neuron.pulsePhase += 0.02

        if (neuron.x < 0 || neuron.x > width) neuron.vx *= -1
        if (neuron.y < 0 || neuron.y > height) neuron.vy *= -1
        neuron.x = Math.max(0, Math.min(width, neuron.x))
        neuron.y = Math.max(0, Math.min(height, neuron.y))

        if (mouse.active) {
          const dx = mouse.x - neuron.x
          const dy = mouse.y - neuron.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 200) {
            const force = (200 - dist) / 200
            neuron.activation = Math.min(1, neuron.activation + force * 0.1)
            neuron.vx += (dx / dist) * force * 0.02
            neuron.vy += (dy / dist) * force * 0.02
          }
        }

        neuron.activation *= 0.97

        const speed = Math.sqrt(neuron.vx * neuron.vx + neuron.vy * neuron.vy)
        if (speed > 1) {
          neuron.vx = (neuron.vx / speed) * 1
          neuron.vy = (neuron.vy / speed) * 1
        }
      }

      // Update synapses
      for (const synapse of synapses) {
        if (synapse.firing) {
          synapse.fireProgress += 0.03
          if (synapse.fireProgress >= 1) {
            synapse.firing = false
            synapse.fireProgress = 0
            neurons[synapse.to].activation = Math.min(1, neurons[synapse.to].activation + 0.5)
          }
        } else if (
          Math.random() < fireChance ||
          neurons[synapse.from].activation > 0.5
        ) {
          synapse.firing = true
          synapse.fireProgress = 0
        }
      }

      // Draw synapses
      for (const synapse of synapses) {
        const from = neurons[synapse.from]
        const to = neurons[synapse.to]
        const alpha = synapse.strength * 0.15

        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`
        ctx.lineWidth = 0.5
        ctx.stroke()

        if (synapse.firing) {
          const px = from.x + (to.x - from.x) * synapse.fireProgress
          const py = from.y + (to.y - from.y) * synapse.fireProgress
          const gradient = ctx.createRadialGradient(px, py, 0, px, py, 8)
          gradient.addColorStop(0, 'rgba(100, 181, 246, 0.8)')
          gradient.addColorStop(1, 'rgba(100, 181, 246, 0)')
          ctx.beginPath()
          ctx.arc(px, py, 8, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()

          ctx.beginPath()
          ctx.moveTo(from.x, from.y)
          ctx.lineTo(px, py)
          ctx.strokeStyle = `rgba(100, 181, 246, ${0.4 * (1 - synapse.fireProgress)})`
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
      }

      // Draw neurons
      for (const neuron of neurons) {
        const pulse = Math.sin(neuron.pulsePhase) * 0.3 + 0.7
        const baseAlpha = 0.3 + neuron.activation * 0.7

        if (neuron.activation > 0.1) {
          const glowGradient = ctx.createRadialGradient(
            neuron.x, neuron.y, 0,
            neuron.x, neuron.y, neuron.radius * 4
          )
          glowGradient.addColorStop(0, `rgba(0, 212, 255, ${neuron.activation * 0.3})`)
          glowGradient.addColorStop(1, 'rgba(0, 212, 255, 0)')
          ctx.beginPath()
          ctx.arc(neuron.x, neuron.y, neuron.radius * 4, 0, Math.PI * 2)
          ctx.fillStyle = glowGradient
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(neuron.x, neuron.y, neuron.radius * pulse, 0, Math.PI * 2)
        const r = Math.round(0 + neuron.activation * 100)
        const g = Math.round(212 - neuron.activation * 30)
        const b = 255
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${baseAlpha})`
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    const synapseInterval = setInterval(updateSynapses, 2000)
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
      clearInterval(synapseInterval)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('mouseleave', handleLeave)
      canvas.removeEventListener('touchend', handleLeave)
    }
  }, [intensity, initNeurons, updateSynapses])

  if (intensity === 'none') return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.5 }}
      aria-hidden="true"
    />
  )
}
