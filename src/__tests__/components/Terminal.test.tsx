import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { Terminal } from '@/components/Terminal'

// Mock canvas getContext for Brain/EKG components
HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as unknown as typeof HTMLCanvasElement.prototype.getContext

// Mock fetch for temperature API
global.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve({ current_weather: { temperature: 72 } }) })) as unknown as typeof fetch

describe('Terminal', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function bootTerminal() {
    render(<Terminal />)
    // Boot: 12 lines * 80ms = 960ms + buffer
    act(() => { vi.advanceTimersByTime(2000) })
  }

  it('shows boot messages', () => {
    render(<Terminal />)
    act(() => { vi.advanceTimersByTime(300) })
    expect(screen.getByText(/Neural Interface Module/)).toBeInTheDocument()
  })

  it('shows terminal input after boot', () => {
    bootTerminal()
    expect(screen.getByLabelText('Terminal input')).toBeInTheDocument()
  })

  it('renders status bar with patient name', () => {
    bootTerminal()
    expect(screen.getByText(/NGUYEN, B\./)).toBeInTheDocument()
  })

  it('shows NEUROS branding', () => {
    bootTerminal()
    expect(screen.getByText('NEUROS')).toBeInTheDocument()
  })

  it('processes help command', () => {
    bootTerminal()
    const input = screen.getByLabelText('Terminal input')
    fireEvent.change(input, { target: { value: 'help' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByText(/COMMAND REFERENCE/)).toBeInTheDocument()
  })

  it('processes whoami command', () => {
    bootTerminal()
    const input = screen.getByLabelText('Terminal input')
    fireEvent.change(input, { target: { value: 'whoami' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByText(/PATIENT FILE: NGUYEN, BRANDON/)).toBeInTheDocument()
  })

  it('processes projects command', () => {
    bootTerminal()
    const input = screen.getByLabelText('Terminal input')
    fireEvent.change(input, { target: { value: 'projects' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByText(/SNAPRX/)).toBeInTheDocument()
    expect(screen.getByText(/MICROBLOOM/)).toBeInTheDocument()
  })

  it('processes skills command', () => {
    bootTerminal()
    const input = screen.getByLabelText('Terminal input')
    fireEvent.change(input, { target: { value: 'skills' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByText(/TECHNICAL CAPABILITIES SCAN/)).toBeInTheDocument()
  })

  it('processes experience command', () => {
    bootTerminal()
    const input = screen.getByLabelText('Terminal input')
    fireEvent.change(input, { target: { value: 'experience' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByText(/MEDICAL SCRIBE/)).toBeInTheDocument()
    expect(screen.getByText(/PHARMACY TECHNICIAN/)).toBeInTheDocument()
  })

  it('shows error for unknown command', () => {
    bootTerminal()
    const input = screen.getByLabelText('Terminal input')
    fireEvent.change(input, { target: { value: 'foobar' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByText(/Command not found: foobar/)).toBeInTheDocument()
  })

  it('clears terminal on clear command', () => {
    bootTerminal()
    const input = screen.getByLabelText('Terminal input')
    fireEvent.change(input, { target: { value: 'whoami' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByText(/PATIENT FILE: NGUYEN, BRANDON/)).toBeInTheDocument()
    fireEvent.change(input, { target: { value: 'clear' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.queryByText(/PATIENT FILE: NGUYEN, BRANDON/)).not.toBeInTheDocument()
  })

  it('supports tab autocomplete', () => {
    bootTerminal()
    const input = screen.getByLabelText('Terminal input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'pro' } })
    fireEvent.keyDown(input, { key: 'Tab' })
    expect(input.value).toBe('projects')
  })

  it('supports command history with arrow keys', () => {
    bootTerminal()
    const input = screen.getByLabelText('Terminal input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'whoami' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    fireEvent.change(input, { target: { value: 'projects' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(input.value).toBe('projects')
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(input.value).toBe('whoami')
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(input.value).toBe('projects')
  })

  it('renders clickable quick command buttons', () => {
    bootTerminal()
    const whoamiBtn = screen.getByRole('button', { name: 'whoami' })
    expect(whoamiBtn).toBeInTheDocument()
    fireEvent.click(whoamiBtn)
    expect(screen.getByText(/PATIENT FILE: NGUYEN, BRANDON/)).toBeInTheDocument()
  })

  it('renders scan command with neural diagnostics', () => {
    bootTerminal()
    const input = screen.getByLabelText('Terminal input')
    fireEvent.change(input, { target: { value: 'scan' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByText(/Prefrontal Cortex/)).toBeInTheDocument()
    expect(screen.getByText(/Neural plasticity index/)).toBeInTheDocument()
  })

  it('renders contact with clickable links', () => {
    bootTerminal()
    const input = screen.getByLabelText('Terminal input')
    fireEvent.change(input, { target: { value: 'contact' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByText(/zba3gm@virginia.edu/)).toBeInTheDocument()
    const linkedinLink = screen.getByText('[linkedin]')
    expect(linkedinLink.closest('a')).toHaveAttribute('href', 'https://www.linkedin.com/in/brandon-nguyen-59b9a1343/')
  })
})
