'use client'

import { useState, useRef, useEffect, useCallback, KeyboardEvent, useMemo } from 'react'

// ============================================
// DATA
// ============================================

const COMMANDS: Record<string, { desc: string; category: string }> = {
  help: { desc: 'Show available commands', category: 'system' },
  whoami: { desc: 'Patient identity & overview', category: 'records' },
  vitals: { desc: 'Academic & technical vitals', category: 'records' },
  projects: { desc: 'Active project files', category: 'records' },
  experience: { desc: 'Clinical & work history', category: 'records' },
  achievements: { desc: 'Awards & recognitions', category: 'records' },
  skills: { desc: 'Technical capabilities scan', category: 'diagnostics' },
  contact: { desc: 'Communication channels', category: 'system' },
  scan: { desc: 'Run neural diagnostic scan', category: 'diagnostics' },
  clear: { desc: 'Clear terminal output', category: 'system' },
  neofetch: { desc: 'System information', category: 'system' },
}

const BOOT_LINES = [
  '[SYS] Neural Interface Module .................. OK',
  '[SYS] Patient Database ......................... OK',
  '[SYS] Biometric Scanner Array .................. OK',
  '[SYS] Diagnostic Imaging Suite ................. OK',
  '[SYS] Pharmacological Database ................. OK',
  '[SYS] Encryption & HIPAA Compliance ............ OK',
  '',
  'Patient file loaded: NGUYEN, BRANDON T.',
  'Clearance: AUTHORIZED | Session active',
  '',
  'Type "help" for available commands.',
  '',
]

// ============================================
// ASCII BRAIN ART - Dense, detailed lateral view with sulci/gyri + spinal cord
// ============================================

// Dense lateral brain (version 2) + symmetrical spinal cord & nerves (no labels)
const BRAIN_ART = [
  '                           :=@@=***+   .-..                             ',
  '                     +-..*-  @@*=+--*#@=***+-------.@%*-                ',
  '                 =@-------*  %#%=**+. *@@%=*+.:=+-:#@%%*++-.           ',
  '              +#%%%@#####@@*.:##@***+..@#%%=*:..%=**+-:::.:.:.::       ',
  '           :%@@@@%%#####@@%@+###%=-:.:+..%%*=*+.@@@%=++-----:.:+.     ',
  '         %%@##%%%@@@@@%%%%=---%%%%*+  :@@%=*+=%%=*++-..:...:+--        ',
  '       #@########@@%%=###@=+---%@%=*+:.%%%%=+.@@@=------***++@....+-   ',
  '      ##@@+#@@%=@@@@##%::%=+#@%%=+:@@@@@@*:%@@%=+@%=++++=*-....+-     ',
  '     %@@@=########@=+###@*=.@##%=--+-###@%.**@##=-*#@=%%%%=*+..*+:..  ',
  '    @###@@##@=:@@@%=*%=-###@@#@%:::%###@@.###%=-  #@%%%%%=.*++-.=.    ',
  '   @##%@@@##@=.@@@%=*%=--###@@#@%:.:###@@%.##@@=..-+@%=+++:.*  +  +  ',
  '   @#%=%=+####@:+=@####%=*.@##@@=-+##@@=:##@%=-=@@#@@%%*.-#@@=++-.: +:',
  '   ####=####@@*:-###@@#@=  ###@@%%#@@@==#@%=%%%%@@%===@*+.@@@@=+:.. : ',
  '  +##########%%**-@####=##@-###@@@@@@@@@@#@%=%%**:#@=+::@%*---=+:..*+:',
  '  =#@########@%=%####@=-##@@*%##@%@#@%%%%%*+%=**++:+###@@=-+=**+.@=+:+',
  '  -#@==@########@@@%=+@#####@@=+*%%**:..+*+--  :*@##@@%=****+--====-  ',
  '  ##%%@####@######@@%=-:@##@@%%++ =+:..%%**++-.%--%#@%---*+-.%=-++=%+:',
  '  %######@##**=%%%%**+::%=--=**+  *@@*+*=@@%%%%=%*@@=%=%=-  #%=++:@%: ',
  '   +@%@@@%%*###@%=++=%*++:.%%*---=++::%@####@%=-@@@@%%*+.@#%*+::%%*:  ',
  '    *--+++@@@@@%%=-. *########@%####@@=--#@@%*=-%%%=**.@##@=+::%.=*+.=*',
  '    **=@@%=----***-%########@####@@%+-#@@%=--*-@@=-=: ##@=**- %=+:.*-.:',
  '     :**++***:-:###########@@##@@%=*.++--.::.--%=*=-*.##@@*+- %%*-.%%..',
  '          %#@@%%#@@@@*:++++-:+@%@##@%=%-@#@@%=-@***-.:  =*-   :-      ',
  '            %%@@@@%=*+*:.-@####@@@@@@*##@%=***=---**+*+.:=*-.:-  *:   ',
  '              .*%%@%=-*####@##@@%@@%=****+++++--++++:..**==-+:.. :     ',
  '                 %@%=-+##@@%%%%==========**+-@%=-  %@##@*+---=**+: -.  ',
  '                   *=*@%%-%=++*-@##########@@%=****@%%=-::::.:.:.      ',
  '                      %@%=-+##@@@%%%%=---**+-@@=+*@%%=-::::.:.. .     ',
  '                         *####++++=*=--*+:------#@@##@***@@%=**%=++.: ',
  '                              +=%@##%@%%=+@.*****-..:.::                ',
  '                                *%@#@##@%#%+-+***--+-.                  ',
  '                                  :*@####@@%=**-..:.                    ',
  '                                     %%%%%=%%:-:-..                     ',
  '                                       @%@*                             ',
  '                                       @@@=                             ',
  '                                       :@@:                             ',
  '                                       .@@.                             ',
  '                                       :@@:                             ',
  '                                       .@@.                             ',
  '                          .-+#%*-.     :@@:     .-*%#=-.                ',
  '                       .-*#+:..:+#*-.  .@@.  .-*#+:..:#*-.              ',
  '                    .-*#+:.  .-*#+:.   :@@:   .:+#*-.  .:+#*-.          ',
  '                  .-*#+:.  .-*#+:.     .@@.     .:+#*-.  .:+#*-.        ',
  '                :+#*-.  .-*#+:.        :@@:        .:+#*-.  .-*#+:      ',
  '              .-*#+:.  :+#*-.    .:.   .@@.   .:.    .-*#+:  .:+#*-.    ',
  '            :+#*-.  .-*#+:.   .-*#+-.  :@@:  .-+#*-.   .:+#*-.  .-*#+: ',
  '          .-*#+:.  :+#*-.   :+#*-.     .@@.     .-*#+:   .-*#+:  .:+#*-.',
  '        :+#*-.  .-*#+:.  .-*#+:.       :@@:       .:+#*-.  .:+#*-.  .-*#+:',
  '      .-*#+:.  :+#*-.  :+#*-.    .:.   .@@.   .:.    .-*#+:  .-*#+:  .:+#*-.',
  '    :+#*-.  .-*#+:.  .-*#+:.  .-*#+-.  :@@:  .-+#*-.  .:+#*-.  .:+#*-.  .-*#+:',
  '  .-*#+:.  :+#*-.  :+#*-.  :+#*-.     .@@.     .-*#+:  .-*#+:  .-*#+:  .:+#*-.',
  '    :+*-..-*#+:.  .-*#+:.  .-*#+:.     :@@:     .:+#*-.  .:+#*-.  .:+#*-..-*+: ',
  '     .::. :+#*-.  :+#*-.  :+#*-.      .@@.      .-*#+:  .-*#+:  .-*#+: .::. ',
  '          .-*#+:.  .-*#+:.  .:+#*-.    :@@:    .-*#+:  .:+#*-.  .:+#*-.      ',
  '           :+#*-.  :+#*-.    .-*#+:.   .@@.   .:+#*-.    .-*#+:  .-*#+:      ',
  '            .-*+:.  .-*+:.    :+#*-.   :@@:   .-*#+:    .:+*-.  .:+*-.       ',
  '              .::    .::      .-*+:.   .@@.   .:+*-.      ::.    ::.         ',
  '                               :+*-.   :@@:   .-*+:                          ',
  '                                .::    .@@.    ::.                           ',
  '                                       :@@:                                  ',
  '                                        ::                                   ',
]

// Brain regions with center positions for popup placement (fraction of art dimensions)
const BRAIN_REGIONS_DATA = [
  { id: 'frontal', name: 'Frontal Lobe', color: '#42a5f5', cx: 0.15, cy: 0.12,
    info: [
      'Prefrontal cortex: planning & judgement',
      'Primary motor cortex (precentral gyrus)',
      "Speech production (Broca's area, BA 44-45)",
      'Personality & emotional regulation',
      'Working memory & sustained attention',
    ] },
  { id: 'parietal', name: 'Parietal Lobe', color: '#26c6da', cx: 0.50, cy: 0.06,
    info: [
      'Primary somatosensory cortex (postcentral gyrus)',
      'Spatial awareness & navigation',
      'Proprioception & body schema',
      'Mathematical & logical reasoning',
      'Inferior parietal lobule: language integration',
    ] },
  { id: 'temporal', name: 'Temporal Lobe', color: '#66bb6a', cx: 0.25, cy: 0.30,
    info: [
      'Primary auditory cortex (Heschl\'s gyrus)',
      'Hippocampus: memory consolidation',
      "Wernicke's area (BA 22): language comprehension",
      'Fusiform gyrus: facial recognition',
      'Amygdala: fear conditioning & emotional memory',
    ] },
  { id: 'occipital', name: 'Occipital Lobe', color: '#ef5350', cx: 0.82, cy: 0.15,
    info: [
      'Primary visual cortex (V1, calcarine sulcus)',
      'V2-V5: color, form, motion processing',
      'Dorsal stream ("where" pathway)',
      'Ventral stream ("what" pathway)',
      'Visual association areas',
    ] },
  { id: 'cerebellum', name: 'Cerebellum', color: '#ffa726', cx: 0.75, cy: 0.35,
    info: [
      'Cerebellar cortex: 3 layers, Purkinje cells',
      'Fine motor coordination & timing',
      'Vestibulo-cerebellum: balance & eye movement',
      'Contains ~50% of all brain neurons',
      'Cerebellar peduncles connect to brainstem',
    ] },
  { id: 'brainstem', name: 'Brain Stem', color: '#ab47bc', cx: 0.50, cy: 0.48,
    info: [
      'Midbrain: superior/inferior colliculi',
      'Pons: relay between cortex & cerebellum',
      'Medulla oblongata: cardiac & respiratory centers',
      'Reticular formation: arousal & consciousness',
      'Cranial nerves III-XII originate here',
    ] },
  { id: 'spinal', name: 'Spinal Cord', color: '#90caf9', cx: 0.50, cy: 0.60,
    info: [
      'Extends from foramen magnum to L1-L2',
      'Gray matter H-shape: anterior & posterior horns',
      'White matter: ascending & descending tracts',
      'Corticospinal tract: voluntary movement',
      'Spinothalamic tract: pain & temperature',
    ] },
  { id: 'nerves', name: 'Peripheral Nerves', color: '#ce93d8', cx: 0.15, cy: 0.75,
    info: [
      'C1-C4 Cervical: neck muscles, phrenic nerve',
      'C5-T1 Brachial plexus: arms, hands, fingers',
      'T1-T12 Thoracic: intercostals, abdominal wall',
      'L1-L4 Lumbar plexus: femoral n., quadriceps',
      'L4-S3 Sacral plexus: sciatic n., gluteals',
    ] },
]

// Region assignment based on position in the art
function getRegionForPosition(row: number, col: number, totalRows: number, totalCols: number): string | null {
  const nx = col / totalCols
  const ny = row / totalRows

  // Peripheral nerves: branching below spinal cord
  if (ny >= 0.62 && (nx < 0.38 || nx > 0.62)) return 'nerves'
  // Spinal cord: center column from brainstem down
  if (ny >= 0.55 && nx >= 0.38 && nx <= 0.62) return 'spinal'
  // Brainstem: narrow area between brain and spine
  if (ny >= 0.45 && ny < 0.55 && nx >= 0.35 && nx < 0.65) return 'brainstem'
  // Cerebellum: bottom-right of brain
  if (ny >= 0.30 && ny < 0.45 && nx >= 0.55) return 'cerebellum'
  // Temporal: lower-left of brain
  if (ny >= 0.25 && ny < 0.45 && nx < 0.55) return 'temporal'
  // Frontal: left side, upper portion
  if (nx < 0.35 && ny < 0.25) return 'frontal'
  // Parietal: top center
  if (nx >= 0.35 && nx < 0.60 && ny < 0.15) return 'parietal'
  // Occipital: right side upper
  if (nx >= 0.60 && ny < 0.30) return 'occipital'
  // Fill gaps
  if (ny < 0.25 && nx < 0.60) return 'parietal'
  if (ny < 0.25) return 'occipital'
  if (nx < 0.55) return 'temporal'
  return 'cerebellum'
}

// ============================================
// ASCII BRAIN COMPONENT
// ============================================

function AsciiBrain({ onRegionHover, hoveredRegion }: {
  onRegionHover: (region: typeof BRAIN_REGIONS_DATA[number] | null) => void
  hoveredRegion: typeof BRAIN_REGIONS_DATA[number] | null
}) {
  const totalRows = BRAIN_ART.length
  const totalCols = useMemo(() => Math.max(...BRAIN_ART.map(l => l.length)), [])

  return (
    <div className="relative">
      <div className="font-mono text-[3.5px] sm:text-[4.5px] md:text-[5.5px] lg:text-[7px] xl:text-[8px] leading-[1.1] select-none whitespace-pre"
           style={{ letterSpacing: '0.15px' }}>
        {BRAIN_ART.map((line, row) => (
          <div key={row}>
            {line.split('').map((char, col) => {
              const regionId = getRegionForPosition(row, col, totalRows, totalCols)
              const region = BRAIN_REGIONS_DATA.find(r => r.id === regionId)
              // For spaces: check if within the bounding box of the art on this line
              if (char === ' ') {
                const trimmed = line.trimStart()
                const leadingSpaces = line.length - trimmed.length
                const trailingStart = leadingSpaces + trimmed.trimEnd().length
                const isInsideArt = col >= leadingSpaces && col < trailingStart
                if (isInsideArt && region) {
                  return (
                    <span key={col}
                      className="cursor-crosshair"
                      onMouseEnter={() => onRegionHover(region)}
                      onMouseLeave={() => onRegionHover(null)}
                    > </span>
                  )
                }
                return <span key={col}> </span>
              }
              const isHovered = hoveredRegion?.id === regionId
              return (
                <span
                  key={col}
                  className="cursor-crosshair transition-colors duration-150"
                  style={{
                    color: isHovered ? '#ffffff' : (region?.color || '#00d4ff'),
                    opacity: isHovered ? 1 : 0.65,
                    textShadow: isHovered ? `0 0 6px ${region?.color || '#00d4ff'}` : 'none',
                  }}
                  onMouseEnter={() => region && onRegionHover(region)}
                  onMouseLeave={() => onRegionHover(null)}
                  onClick={() => region && onRegionHover(region)}
                >
                  {char}
                </span>
              )
            })}
          </div>
        ))}
      </div>

      {/* Region info popup - positioned near the hovered region */}
      {hoveredRegion && (
        <div
          className="absolute z-10 pointer-events-none"
          style={{
            left: `${hoveredRegion.cx * 100}%`,
            top: `${hoveredRegion.cy * 100}%`,
            transform: hoveredRegion.cx > 0.5
              ? 'translate(-110%, -50%)'
              : 'translate(10%, -50%)',
          }}
        >
          <div className="bg-[#0a1628]/95 border border-[#00d4ff30] rounded-lg p-3 w-52 shadow-lg shadow-[#00d4ff10] backdrop-blur-sm">
            <div className="font-bold text-xs tracking-wide" style={{ color: hoveredRegion.color }}>{hoveredRegion.name}</div>
            <div className="w-full h-px bg-[#00d4ff20] my-1.5" />
            <ul className="space-y-1">
              {hoveredRegion.info.map((line, i) => (
                <li key={i} className="text-[10px] text-[#00d4ff80] flex gap-1.5">
                  <span className="text-[#00d4ff40] shrink-0">&#9656;</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Hover hint - below the art, not overlapping */}
      {!hoveredRegion && (
        <div className="text-center mt-2 text-[10px] text-[#00d4ff] tracking-widest uppercase whitespace-nowrap terminal-glow vital-pulse">
          Hover brain regions for details
        </div>
      )}
    </div>
  )
}

// ============================================
// EKG MONITOR
// ============================================

function EKGMonitor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const offsetRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const _ctx = canvas.getContext('2d')
    if (!_ctx) return
    const ctx: CanvasRenderingContext2D = _ctx

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const cycleLen = 120
    function getY(t: number): number {
      if (t < 0.08) return 0.5
      if (t < 0.16) return 0.5 - Math.sin(((t - 0.08) / 0.08) * Math.PI) * 0.08
      if (t < 0.28) return 0.5
      if (t < 0.32) return 0.5 + Math.sin(((t - 0.28) / 0.04) * Math.PI) * 0.06
      if (t < 0.38) return 0.5 - Math.sin(((t - 0.32) / 0.06) * Math.PI) * 0.4
      if (t < 0.42) return 0.5 + Math.sin(((t - 0.38) / 0.04) * Math.PI) * 0.15
      if (t < 0.52) return 0.5
      if (t < 0.65) return 0.5 - Math.sin(((t - 0.52) / 0.13) * Math.PI) * 0.1
      return 0.5
    }

    let animId: number
    const draw = () => {
      const cw = canvas.offsetWidth, ch = canvas.offsetHeight
      ctx.clearRect(0, 0, cw, ch)
      ctx.beginPath()
      ctx.strokeStyle = '#00d4ff'
      ctx.lineWidth = 1.5
      ctx.shadowColor = '#00d4ff'
      ctx.shadowBlur = 6
      for (let x = 0; x < cw; x++) {
        const t = ((x + offsetRef.current) % cycleLen) / cycleLen
        const y = getY(t) * ch
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.shadowBlur = 0
      offsetRef.current += 0.8
      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

// ============================================
// EDUCATIONAL PANELS
// ============================================

// ============================================
// SPINAL CORD CROSS-SECTION - Interactive ASCII visualization
// ============================================

const SPINAL_ART = [
  '                                                                                  ',
  '          ╔══════════════════ SPINAL CORD CROSS-SECTION ══════════════════╗        ',
  '          ║                                                              ║        ',
  '          ║                     POSTERIOR (DORSAL)                       ║        ',
  '          ║                                                              ║        ',
  '          ║              .-------=====--------.                          ║        ',
  '          ║          .--##DDDDDDDDDDDDDDDDD##--.                       ║        ',
  '          ║       .-##DDDDDDDDD|||||||DDDDDDDDD##-.                    ║        ',
  '          ║     .-#DDDDDDDDD|||||||||||||||DDDDDDDDD#-.                ║        ',
  '          ║    -#SSSSDDDDDD|||||||||||||||||DDDDDSSSS#-                ║        ',
  '          ║   -#SSSSSSSDDD||||||PPPPPPP|||||||DDDSSSSSS#-              ║        ',
  '          ║  -#SSSSSSSSDD|||||PPPPPPPPPPPP|||||DDSSSSSSS#-             ║        ',
  '          ║  #LLLSSSSSSDD||||PPPPPPPPPPPPPP||||DDSSSSSSLLL#            ║        ',
  '          ║ #LLLLSSSSSD|||||PPPPPPPPPPPPPPP|||||DSSSSSLLLLL#           ║        ',
  '          ║ #LLLLSSSSD|||||PPPPPP.....PPPPPP|||||DSSSSLLLLLL#          ║        ',
  '          ║ #LLLLSSSD||||||PPPPP.......PPPPPP||||||DSSSLLLLLL#         ║        ',
  '          ║ #LLLSSSD||||||PPPPP....C....PPPPP|||||||DSSSLLLLLL#        ║        ',
  '          ║ #LLLSSD|||||||PPPPP.........PPPPPP||||||DSSSLLLLL#         ║        ',
  '          ║ #LLLLSSD||||||PPPPPP.......PPPPPP||||||DSSSLLLLL#          ║        ',
  '          ║ #LLLLLSSD|||||PPPPPP.....PPPPPPP|||||DSSSLLLLLL#           ║        ',
  '          ║ #LLLLLSSSD|||||PPPPPPPPPPPPPPPP|||||DSSSSLLLLLL#           ║        ',
  '          ║  #LLLSSSSSD||||PPPPPPPPPPPPPP|||||DSSSSSLLLL#              ║        ',
  '          ║  -#VVVSSSSSD||||PPPPPPPPPPPP||||DSSSSSSVVV#-              ║        ',
  '          ║   -#VVVVSSSSDD|||AAAAAAAAAA||||DDSSSSVVVV#-               ║        ',
  '          ║    -#VVVVSSSDDDD||AAAAAAAA||DDDDSSSVVVVV#-                ║        ',
  '          ║     .-#VVVSSSDDDDD|||||||DDDDDSSSVVVV#-.                  ║        ',
  '          ║       .-##VVVSSSDDDDDDDDDDDDSSVVVV##-.                   ║        ',
  '          ║          .--##VVVVVSSSSSSVVVVV##--.                       ║        ',
  '          ║              .-------=====--------.                       ║        ',
  '          ║                                                              ║        ',
  '          ║                    ANTERIOR (VENTRAL)                        ║        ',
  '          ║                                                              ║        ',
  '          ╚══════════════════════════════════════════════════════════════╝        ',
]

const SPINAL_REGIONS = [
  { id: 'dorsal_col', name: 'Dorsal Columns', color: '#42a5f5', cx: 0.50, cy: 0.08,
    info: [
      'DCML pathway: fine touch, vibration, proprioception',
      'Fasciculus gracilis (medial): lower body T6↓',
      'Fasciculus cuneatus (lateral): upper body T6↑',
      '1° neuron → ipsilateral ascent → nucleus gracilis/cuneatus',
      'Decussates as internal arcuate fibers → medial lemniscus',
      'Lesion: ipsilateral loss of fine touch below level',
    ] },
  { id: 'lat_cst', name: 'Lateral Corticospinal Tract', color: '#ef5350', cx: 0.85, cy: 0.45,
    info: [
      'Major descending motor pathway (85% of CST)',
      'Motor cortex → internal capsule → pyramidal decussation',
      'Controls voluntary fine motor: distal limbs',
      'UMN lesion signs: spasticity, hyperreflexia, +Babinski',
      'Located in lateral funiculus of white matter',
    ] },
  { id: 'spinothal', name: 'Spinothalamic Tract', color: '#66bb6a', cx: 0.15, cy: 0.45,
    info: [
      'Anterolateral system: pain, temperature, crude touch',
      'Lateral: pain & temperature → VPL thalamus → S1',
      'Anterior: crude touch & pressure',
      'Crosses at anterior white commissure (1-2 levels up)',
      'Lesion: contralateral loss of pain/temp below',
      'Syringomyelia: central canal expansion → bilateral loss',
    ] },
  { id: 'post_horn', name: 'Posterior (Dorsal) Horn', color: '#ffa726', cx: 0.50, cy: 0.22,
    info: [
      'Gray matter: sensory processing & relay',
      'Laminae I-VI (Rexed laminae)',
      'Substantia gelatinosa (lamina II): pain modulation',
      'Gate control theory: Aβ fibers inhibit pain transmission',
      'Endorphin/enkephalin release modulates nociception',
      'First synapse for spinothalamic pathway',
    ] },
  { id: 'ant_horn', name: 'Anterior (Ventral) Horn', color: '#ab47bc', cx: 0.50, cy: 0.72,
    info: [
      'Gray matter: lower motor neurons (LMN)',
      'Alpha motor neurons → extrafusal muscle fibers',
      'Gamma motor neurons → intrafusal (muscle spindle)',
      'Medial: axial/proximal muscles · Lateral: distal muscles',
      'LMN lesion: flaccid paralysis, atrophy, fasciculations',
      'Poliomyelitis: destroys anterior horn cells',
    ] },
  { id: 'central', name: 'Central Canal', color: '#26c6da', cx: 0.50, cy: 0.47,
    info: [
      'Continuation of ventricular system · Contains CSF',
      'Lined by ependymal cells',
      'Anterior white commissure immediately ventral',
      'Syringomyelia: pathological dilation of central canal',
      '→ damages crossing spinothalamic fibers first',
      '→ bilateral "cape-like" loss of pain/temp',
    ] },
  { id: 'ventral_cst', name: 'Anterior Corticospinal Tract', color: '#ce93d8', cx: 0.50, cy: 0.82,
    info: [
      'Uncrossed (ipsilateral) · 15% of corticospinal fibers',
      'Descends in anterior funiculus',
      'Crosses at segmental level via anterior white commissure',
      'Controls: axial & proximal muscles, bilateral trunk',
      'Located in anterior (ventral) white matter',
    ] },
]

function getSpinalRegion(row: number, col: number, totalRows: number, totalCols: number): string | null {
  const line = SPINAL_ART[row]
  if (!line) return null
  const ch = line[col]
  if (ch === 'D' || ch === '|') {
    const ny = row / totalRows
    if (ny < 0.35) return 'dorsal_col'
    return 'post_horn'
  }
  if (ch === 'L') return 'lat_cst'
  if (ch === 'S') return 'spinothal'
  if (ch === 'P') return 'post_horn'
  if (ch === 'A') return 'ant_horn'
  if (ch === 'V') return 'ventral_cst'
  if (ch === 'C') return 'central'
  if (ch === '.' && row >= 14 && row <= 20) return 'central'
  return null
}

function AsciiSpinalCord({ onRegionHover, hoveredRegion }: {
  onRegionHover: (r: typeof SPINAL_REGIONS[number] | null) => void
  hoveredRegion: typeof SPINAL_REGIONS[number] | null
}) {
  const totalRows = SPINAL_ART.length
  const totalCols = useMemo(() => Math.max(...SPINAL_ART.map(l => l.length)), [])
  const displayChars: Record<string, string> = { D: '#', L: '%', S: '=', P: '@', A: '*', V: '+', C: 'o' }

  return (
    <div className="relative">
      <div className="font-mono text-[4px] sm:text-[5px] md:text-[6.5px] lg:text-[8px] xl:text-[9px] leading-[1.15] select-none whitespace-pre"
           style={{ letterSpacing: '0.1px' }}>
        {SPINAL_ART.map((line, row) => (
          <div key={row}>
            {line.split('').map((char, col) => {
              const regionId = getSpinalRegion(row, col, totalRows, totalCols)
              const region = SPINAL_REGIONS.find(r => r.id === regionId)
              if (!region) {
                return <span key={col} className="text-[#00d4ff40]">{char === 'D' || char === 'L' || char === 'S' || char === 'P' || char === 'A' || char === 'V' || char === 'C' ? (displayChars[char] || char) : char}</span>
              }
              const isHov = hoveredRegion?.id === regionId
              const display = displayChars[char] || char
              return (
                <span key={col}
                  className="cursor-crosshair transition-colors duration-150"
                  style={{
                    color: isHov ? '#ffffff' : region.color,
                    opacity: isHov ? 1 : 0.7,
                    textShadow: isHov ? `0 0 6px ${region.color}` : 'none',
                  }}
                  onMouseEnter={() => onRegionHover(region)}
                  onMouseLeave={() => onRegionHover(null)}
                >{display}</span>
              )
            })}
          </div>
        ))}
      </div>
      {hoveredRegion && (
        <div className="absolute z-10 pointer-events-none"
          style={{
            left: `${hoveredRegion.cx * 100}%`,
            top: `${hoveredRegion.cy * 100}%`,
            transform: hoveredRegion.cx > 0.5 ? 'translate(-110%, -50%)' : 'translate(10%, -50%)',
          }}>
          <div className="bg-[#0a1628]/95 border border-[#00d4ff30] rounded-lg p-3 w-56 shadow-lg shadow-[#00d4ff10] backdrop-blur-sm">
            <div className="font-bold text-xs tracking-wide" style={{ color: hoveredRegion.color }}>{hoveredRegion.name}</div>
            <div className="w-full h-px bg-[#00d4ff20] my-1.5" />
            <ul className="space-y-1">
              {hoveredRegion.info.map((line, i) => (
                <li key={i} className="text-[10px] text-[#00d4ff80] flex gap-1.5">
                  <span className="text-[#00d4ff40] shrink-0">&#9656;</span><span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {!hoveredRegion && (
        <div className="text-center mt-2 text-[10px] text-[#00d4ff] tracking-widest uppercase whitespace-nowrap terminal-glow vital-pulse">
          Hover spinal cord regions for details
        </div>
      )}
    </div>
  )
}

function PathwaysPanel() {
  const [hoveredRegion, setHoveredRegion] = useState<typeof SPINAL_REGIONS[number] | null>(null)
  return (
    <div className="flex items-center justify-center p-2 sm:p-3 h-full">
      <AsciiSpinalCord onRegionHover={setHoveredRegion} hoveredRegion={hoveredRegion} />
    </div>
  )
}

// ============================================
// SYNAPSE - Interactive ASCII visualization for Pharmacology
// ============================================

const SYNAPSE_ART = [
  '     ╔═══════════════════ SYNAPTIC CLEFT ═══════════════════╗     ',
  '     ║                                                      ║     ',
  '     ║        ╔══════════════════════════════════╗           ║     ',
  '     ║        ║    PRESYNAPTIC TERMINAL          ║           ║     ',
  '     ║        ║                                  ║           ║     ',
  '     ║        ║  MMMMMM    VVVVV    MMMMMM      ║           ║     ',
  '     ║        ║  MMMMMM    VVVVV    MMMMMM      ║           ║     ',
  '     ║        ║  MMMMMM    VVVVV    MMMMMM      ║           ║     ',
  '     ║        ║       VVVVV    VVVVV             ║           ║     ',
  '     ║        ║           CCCCCCCC               ║           ║     ',
  '     ║        ║           CCCCCCCC               ║           ║     ',
  '     ║        ║      RRRRR SSSSSS RRRRR          ║           ║     ',
  '     ║        ╠══════════════════════════════════╣           ║     ',
  '     ║        ║RRRRR                       RRRRR║           ║     ',
  '     ║                                                      ║     ',
  '     ║          NNNN  NNNN   NNNN  NNNN   NNNN              ║     ',
  '     ║          NNNN  NNNN   NNNN  NNNN   NNNN              ║     ',
  '     ║                                                      ║     ',
  '     ║        EEEE                                EEEE      ║     ',
  '     ║        EEEE   NNNN  NNNN  NNNN  NNNN      EEEE      ║     ',
  '     ║        EEEE   NNNN  NNNN  NNNN  NNNN      EEEE      ║     ',
  '     ║        EEEE                                EEEE      ║     ',
  '     ║                                                      ║     ',
  '     ║        ╠══════════════════════════════════╣           ║     ',
  '     ║        ║    POSTSYNAPTIC MEMBRANE         ║           ║     ',
  '     ║        ║                                  ║           ║     ',
  '     ║        ║  GGGGGG  AAAAAA  DDDDD  OOOOO   ║           ║     ',
  '     ║        ║  GGGGGG  AAAAAA  DDDDD  OOOOO   ║           ║     ',
  '     ║        ║  GGGGGG  AAAAAA  DDDDD  OOOOO   ║           ║     ',
  '     ║        ║   Cl-     Na+    K+/Ca  Gi/Gq   ║           ║     ',
  '     ║        ║                                  ║           ║     ',
  '     ║        ║       PPPPPPPPPPPPPPPP           ║           ║     ',
  '     ║        ║       PPPPPPPPPPPPPPPP           ║           ║     ',
  '     ║        ║       PPPPPPPPPPPPPPPP           ║           ║     ',
  '     ║        ╚══════════════════════════════════╝           ║     ',
  '     ║                                                      ║     ',
  '     ╚══════════════════════════════════════════════════════╝     ',
]

const SYNAPSE_REGIONS = [
  { id: 'vesicle', name: 'Synaptic Vesicles', color: '#42a5f5', cx: 0.40, cy: 0.12,
    info: [
      'Membrane-bound organelles storing neurotransmitters',
      'Loaded by vesicular transporters (VMAT, VAChT, VGAT, VGluT)',
      'SNARE complex mediates docking & fusion',
      'v-SNARE (synaptobrevin) + t-SNARE (syntaxin + SNAP-25)',
      'Botulinum toxin: cleaves SNAREs → blocks release',
      'Target: Reserpine depletes vesicular monoamines (blocks VMAT)',
    ] },
  { id: 'calcium', name: 'Voltage-Gated Ca²⁺ Channels', color: '#ffa726', cx: 0.40, cy: 0.25,
    info: [
      'P/Q-type and N-type at presynaptic terminal',
      'AP arrival → depolarization → Ca²⁺ influx',
      'Ca²⁺ binds synaptotagmin → triggers vesicle fusion',
      'Target: Gabapentin/Pregabalin bind α2δ subunit',
      'Eaton-Lambert: autoAb against presynaptic Ca²⁺ channels',
      'ω-conotoxin blocks N-type · ω-agatoxin blocks P/Q-type',
    ] },
  { id: 'mao', name: 'MAO (Mitochondrial)', color: '#ab47bc', cx: 0.15, cy: 0.12,
    info: [
      'Monoamine Oxidase: intracellular enzyme on mitochondria',
      'MAO-A: metabolizes 5-HT, NE (and DA)',
      'MAO-B: preferentially metabolizes DA',
      'MAOIs (Phenelzine, Tranylcypromine): irreversible inhibitors',
      'Selegiline: MAO-B selective at low dose (Parkinson\'s)',
      'CRITICAL: Tyramine crisis with MAOIs + aged foods',
      'Contraindicated with SSRIs → serotonin syndrome',
    ] },
  { id: 'reuptake', name: 'Reuptake Transporters', color: '#ef5350', cx: 0.82, cy: 0.30,
    info: [
      'Presynaptic membrane proteins recycling NT from cleft',
      'SERT (serotonin): blocked by SSRIs, SNRIs, TCAs',
      'NET (norepinephrine): blocked by SNRIs, TCAs, cocaine',
      'DAT (dopamine): blocked by cocaine, methylphenidate',
      'Amphetamines: reverse transporters → NT efflux',
      'SSRIs (Fluoxetine, Sertraline): first-line for depression',
      'TCAs: block SERT+NET + antimuscarinic + antihistamine',
    ] },
  { id: 'nt_cleft', name: 'Neurotransmitters (in Cleft)', color: '#66bb6a', cx: 0.40, cy: 0.42,
    info: [
      'Released NT molecules in the synaptic cleft (~20nm gap)',
      'Glutamate: primary excitatory · GABA: primary inhibitory',
      'Dopamine, Serotonin, NE, ACh, Endorphins',
      'NT fate: bind receptors, reuptake, enzymatic degradation, diffusion',
      'AChE in cleft: rapidly degrades ACh → choline + acetate',
      'COMT (extracellular): degrades catecholamines (DA, NE, Epi)',
    ] },
  { id: 'enzyme', name: 'Degradation Enzymes', color: '#ce93d8', cx: 0.14, cy: 0.52,
    info: [
      'AChE (acetylcholinesterase): in synaptic cleft',
      'AChE inhibitors: Donepezil (Alzheimer\'s), Neostigmine (MG)',
      'Physostigmine: crosses BBB (anticholinergic toxicity reversal)',
      'COMT: catechol-O-methyltransferase (extracellular)',
      'Entacapone: COMT inhibitor (Parkinson\'s adjunct, ↑ L-DOPA)',
      'Organophosphates: irreversible AChE → cholinergic crisis',
      'Tx: Atropine + Pralidoxime (2-PAM)',
    ] },
  { id: 'gaba_r', name: 'GABA-A Receptor (Cl⁻)', color: '#26c6da', cx: 0.20, cy: 0.75,
    info: [
      'Ligand-gated Cl⁻ channel · Inhibitory (hyperpolarization)',
      'Subunits: 2α + 2β + 1γ (pentameric)',
      'GABA site: β subunit · BZD site: α/γ interface',
      'BZDs (Diazepam, Lorazepam): ↑ Cl⁻ FREQUENCY · Reversal: Flumazenil',
      'Barbiturates (Phenobarbital): ↑ Cl⁻ DURATION · Can activate without GABA',
      'Alcohol: enhances GABA-A · Cross-tolerance with BZDs',
      'Zolpidem: binds BZD1 (α1) selectively → hypnotic only',
    ] },
  { id: 'ampa_r', name: 'AMPA/NMDA Receptors (Na⁺/Ca²⁺)', color: '#42a5f5', cx: 0.38, cy: 0.75,
    info: [
      'Glutamate ionotropic receptors · Excitatory',
      'AMPA: fast Na⁺ influx → rapid depolarization (fast EPSP)',
      'NMDA: Ca²⁺ + Na⁺ · Voltage-dependent Mg²⁺ block',
      'NMDA requires: glutamate + glycine co-agonist + depolarization',
      'NMDA → Ca²⁺ → CaMKII → LTP (learning & memory)',
      'Ketamine, PCP, Memantine: NMDA antagonists',
      'Memantine: Alzheimer\'s (moderate-severe) · blocks excitotoxicity',
    ] },
  { id: 'dopa_r', name: 'Dopamine Receptors (K⁺/Ca²⁺)', color: '#66bb6a', cx: 0.55, cy: 0.75,
    info: [
      'G-protein coupled (metabotropic) receptors',
      'D1-like (D1, D5): Gs → ↑cAMP → excitatory effects',
      'D2-like (D2, D3, D4): Gi → ↓cAMP → inhibitory',
      'Antipsychotics: D2 antagonists (Haloperidol, Risperidone)',
      'D2 agonists: Bromocriptine, Pramipexole (Parkinson\'s)',
      'Aripiprazole: D2 partial agonist (atypical antipsychotic)',
    ] },
  { id: 'opioid_r', name: 'Opioid Receptors (Gi)', color: '#ef5350', cx: 0.72, cy: 0.75,
    info: [
      'μ (mu): analgesia, euphoria, respiratory depression, miosis, constipation',
      'κ (kappa): analgesia, dysphoria, sedation',
      'δ (delta): analgesia, antidepressant effects',
      'All Gi coupled: ↓cAMP, ↑K⁺ (hyperpolarize), ↓Ca²⁺',
      'Full agonists: Morphine, Fentanyl, Heroin, Methadone',
      'Partial: Buprenorphine · Antagonist: Naloxone (Narcan)',
      'Tolerance to all effects EXCEPT miosis & constipation',
    ] },
  { id: 'second_msg', name: 'Second Messenger Cascades', color: '#ffa726', cx: 0.40, cy: 0.90,
    info: [
      'Gs: ↑adenylyl cyclase → ↑cAMP → PKA activation',
      'Gi: ↓adenylyl cyclase → ↓cAMP · Also ↑K⁺, ↓Ca²⁺',
      'Gq: ↑PLC → IP3 (↑Ca²⁺ from ER) + DAG (↑PKC)',
      'cAMP targets: PKA → CREB → gene transcription',
      'IP3/Ca²⁺: smooth muscle contraction, secretion',
      'Receptor kinases → desensitization (tolerance mechanism)',
      'Key for long-term synaptic plasticity (LTP/LTD)',
    ] },
]

function getSynapseRegion(row: number, col: number): string | null {
  const line = SYNAPSE_ART[row]
  if (!line) return null
  const ch = line[col]
  if (ch === 'V') return 'vesicle'
  if (ch === 'C') return 'calcium'
  if (ch === 'M') return 'mao'
  if (ch === 'R') return 'reuptake'
  if (ch === 'N') return 'nt_cleft'
  if (ch === 'E') return 'enzyme'
  if (ch === 'G') return 'gaba_r'
  if (ch === 'A') return 'ampa_r'
  if (ch === 'D') return 'dopa_r'
  if (ch === 'O') return 'opioid_r'
  if (ch === 'P') return 'second_msg'
  if (ch === 'S') return 'reuptake'
  return null
}

function AsciiSynapse({ onRegionHover, hoveredRegion }: {
  onRegionHover: (r: typeof SYNAPSE_REGIONS[number] | null) => void
  hoveredRegion: typeof SYNAPSE_REGIONS[number] | null
}) {
  const displayChars: Record<string, string> = {
    V: '◎', C: '⊕', M: '▓', R: '↺', N: '◆', E: '⊗', G: '▣', A: '▤', D: '▥', O: '▧', P: '░', S: '↻',
  }

  return (
    <div className="relative">
      <div className="font-mono text-[4px] sm:text-[5px] md:text-[6.5px] lg:text-[8px] xl:text-[9px] leading-[1.2] select-none whitespace-pre"
           style={{ letterSpacing: '0.1px' }}>
        {SYNAPSE_ART.map((line, row) => (
          <div key={row}>
            {line.split('').map((char, col) => {
              const regionId = getSynapseRegion(row, col)
              const region = SYNAPSE_REGIONS.find(r => r.id === regionId)
              if (!region) return <span key={col} className="text-[#00d4ff40]">{char}</span>
              const isHov = hoveredRegion?.id === regionId
              const display = displayChars[char] || char
              return (
                <span key={col}
                  className="cursor-crosshair transition-colors duration-150"
                  style={{
                    color: isHov ? '#ffffff' : region.color,
                    opacity: isHov ? 1 : 0.7,
                    textShadow: isHov ? `0 0 6px ${region.color}` : 'none',
                  }}
                  onMouseEnter={() => onRegionHover(region)}
                  onMouseLeave={() => onRegionHover(null)}
                >{display}</span>
              )
            })}
          </div>
        ))}
      </div>
      {hoveredRegion && (
        <div className="absolute z-10 pointer-events-none"
          style={{
            left: `${hoveredRegion.cx * 100}%`,
            top: `${hoveredRegion.cy * 100}%`,
            transform: hoveredRegion.cx > 0.5 ? 'translate(-110%, -50%)' : 'translate(10%, -50%)',
          }}>
          <div className="bg-[#0a1628]/95 border border-[#00d4ff30] rounded-lg p-3 w-60 shadow-lg shadow-[#00d4ff10] backdrop-blur-sm">
            <div className="font-bold text-xs tracking-wide" style={{ color: hoveredRegion.color }}>{hoveredRegion.name}</div>
            <div className="w-full h-px bg-[#00d4ff20] my-1.5" />
            <ul className="space-y-1">
              {hoveredRegion.info.map((line, i) => (
                <li key={i} className="text-[10px] text-[#00d4ff80] flex gap-1.5">
                  <span className="text-[#00d4ff40] shrink-0">&#9656;</span><span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {!hoveredRegion && (
        <div className="text-center mt-2 text-[10px] text-[#00d4ff] tracking-widest uppercase whitespace-nowrap terminal-glow vital-pulse">
          Hover synapse components for pharmacology
        </div>
      )}
    </div>
  )
}

function PharmPanel() {
  const [hoveredRegion, setHoveredRegion] = useState<typeof SYNAPSE_REGIONS[number] | null>(null)
  return (
    <div className="flex items-center justify-center p-2 sm:p-3 h-full">
      <AsciiSynapse onRegionHover={setHoveredRegion} hoveredRegion={hoveredRegion} />
    </div>
  )
}

// ============================================
// OUTPUT GENERATORS - Fixed box alignment
// ============================================

const W = 47 // box inner width

function box(lines: string[]): string[] {
  const top = '\u250C' + '\u2500'.repeat(W) + '\u2510'
  const bot = '\u2514' + '\u2500'.repeat(W) + '\u2518'
  const sep = '\u251C' + '\u2500'.repeat(W) + '\u2524'
  const row = (s: string) => '\u2502' + s.padEnd(W) + '\u2502'
  const result: string[] = [top]
  for (const l of lines) {
    if (l === '---') result.push(sep)
    else result.push(row(l))
  }
  result.push(bot)
  return result
}

function dbox(lines: string[]): string[] {
  const top = '\u2554' + '\u2550'.repeat(W) + '\u2557'
  const bot = '\u255A' + '\u2550'.repeat(W) + '\u255D'
  const sep = '\u2560' + '\u2550'.repeat(W) + '\u2563'
  const row = (s: string) => '\u2551' + s.padEnd(W) + '\u2551'
  const result: string[] = [top]
  for (const l of lines) {
    if (l === '---') result.push(sep)
    else result.push(row(l))
  }
  result.push(bot)
  return result
}

function getHelp(): string[] {
  return box([
    '  NEUROS COMMAND REFERENCE',
    '---',
    '',
    '  PATIENT RECORDS',
    '    whoami       Patient identity & overview',
    '    vitals       Academic & technical vitals',
    '    experience   Clinical & work history',
    '    projects     Active project files',
    '    research     Research protocols',
    '    achievements Awards & recognitions',
    '    skills       Technical capabilities scan',
    '',
    '  DIAGNOSTICS',
    '    scan         Neural diagnostic scan',
    '',
    '  SYSTEM',
    '    contact      Communication channels',
    '    neofetch     System information',
    '    clear        Clear terminal',
    '    help         Show this menu',
    '',
    '  Tip: Hover brain regions for neuroscience',
    '  Tip: Use Tab for autocomplete',
    '  Tip: Use Up/Down for command history',
  ])
}

function getWhoami(): string[] {
  return dbox([
    '  PATIENT FILE: NGUYEN, BRANDON',
    '---',
    '',
    '  ID:         BN-2025-UVA',
    '  STATUS:     ACTIVE',
    '  LOCATION:   Charlottesville, VA',
    '  ORIGIN:     Chantilly, VA',
    '',
    '  CLASSIFICATION:',
    '    Pre-Medical Neuroscience Student',
    '    University of Virginia',
    '    Medical Scribe @ UVA Health ED',
    '    Full-Stack Developer',
    '    Pharmacy Technician',
    '    Biomedical Researcher',
    '',
    '  SUMMARY:',
    '    Neuroscience student who builds health',
    '    technology. Currently developing SnapRx',
    '    and MicroBloom while scribing at UVA',
    '    Health ED and conducting biomedical',
    '    research at UVA.',
    '',
    '  LINKS:',
    '    [[LinkedIn]] [[GitHub]] [[Email]]      ',
  ])
}

function getVitals(): string[] {
  return box([
    ' ACADEMIC VITALS',
    '---',
    '',
    '  GPA (UVA)    \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591  3.82',
    '  GPA (HS)     \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591  4.17',
    '  Projects     \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591  5+',
    '  Backend Mods \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591  44+',
    '  Languages    \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591  14+',
    '',
    '  STATUS: Dean\'s List | National Merit',
    '---',
    ' CURRENT COURSEWORK',
    '',
    '  BIOL 2200  Intro Bio: Organisms & Evo',
    '  CHEM 1420  Intro College Chemistry II',
    '  CHEM 1421  Chemistry II Lab',
    '  PSYC 3160  Cognitive Neuroscience',
    '  ENWR 2520  Special Topics in Writing',
    '  EGMT 1520  Empirical Engagement',
    '  EGMT 1540  Ethical Engagement',
  ])
}

function getProjects(): string[] {
  return box([
    ' ACTIVE PROJECT FILES',
    '---',
    '',
    '  [01] SNAPRX                     [[snaprx]]',
    '       Medication management platform',
    '       OCR scanning | Drug interactions',
    '       Pharmacy price comparison | HIPAA',
    '       Python FastAPI React-Native PostgreSQL',
    '       GCP Cloud-Vision',
    '       STATUS: \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 BETA',
    '',
    '  [02] MICROBLOOM               [[microbloom]]',
    '       Parenting app for first 1,000 days',
    '       Journaling | 14+ languages',
    '       Milestone tracking | Family sharing',
    '       React-Native Expo Supabase',
    '       STATUS: \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 LIVE',
    '',
    '  [03] RESONANCE',
    '       Music rating app with social feed',
    '       Rate, review & discover music',
    '       React FastAPI Full-Stack',
    '       STATUS: \u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591 IN DEV',
    '',
    '  [04] EARNINGS ALPHA',
    '       Earnings outcome prediction tool',
    '       Macro, fundamentals & sentiment',
    '       Python FastAPI Pandas yfinance',
    '       STATUS: \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591 ALPHA',
  ])
}

function getExperience(): string[] {
  return box([
    ' CLINICAL & WORK HISTORY',
    '---',
    '',
    '  \u25CF MEDICAL SCRIBE',
    '    UVA Health Emergency Dept | Present',
    '    Real-time clinical documentation, ED',
    '    physician support, patient encounters',
    '',
    '  \u25CF PHARMACY TECHNICIAN',
    '    Giant Pharmacy | Aug 2024 - Present',
    '    Prescriptions, HIPAA, patient comms',
    '',
    '  \u25CF BIOMEDICAL RESEARCHER',
    '    University of Virginia | Jun 2025 - Now',
    '    Oral health / well-being cross-sectional',
    '    analysis',
    '',
    '  \u25CF YOUTH LEADER TRAINER',
    '    VEYM | Jun 2025 - Present',
    '    Community service, mentorship, national',
    '',
  ])
}


function getAchievements(): string[] {
  return box([
    ' AWARDS & RECOGNITIONS',
    '---',
    '',
    '  \u2605  Dean\'s List               UVA    2025',
    '     3.82 GPA',
    '',
    '  \u2605  National Merit Scholar     NMSP   2025',
    '',
    '  \u2605  AP Scholar                 CB     2025',
    '',
    '  \u2605  National Honors Society    FHS    2024',
    '',
    '  \u2605  ML Club President          FHS    2024',
    '',
    '  \u2605  SnapRx Beta Launch         ---    2025',
    '     44+ backend modules, HIPAA-compliant',
    '',
    '  \u2605  MicroBloom Launch          ---    2025',
    '     14+ languages, AI-powered',
  ])
}

function getSkills(): string[] {
  return box([
    ' TECHNICAL CAPABILITIES SCAN',
    '---',
    '',
    '  LANGUAGES',
    '  Python     \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591  95%',
    '  TypeScript \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591  88%',
    '  JavaScript \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591  88%',
    '  Java       \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591  65%',
    '  SQL        \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591  78%',
    '',
    '  FRAMEWORKS & INFRA',
    '  FastAPI     \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591 95%',
    '  React Nat.  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591 85%',
    '  Next.js     \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591 80%',
    '  PostgreSQL  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591 90%',
    '  GCP/Docker  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591 78%',
    '---',
    ' CLINICAL & PHARMACY SKILLS',
    '',
    '  MEDICAL SCRIBE',
    '  ED documentation, H&P, ROS, MDM',
    '  ICD-10/CPT coding, physician orders',
    '  Epic/Cerner EHR navigation',
    '  Triage acuity, differential dx notes',
    '',
    '  PHARMACY TECHNICIAN',
    '  Rx processing & adjudication',
    '  Drug utilization review (DUR)',
    '  Controlled substance scheduling',
    '  Sig code recognition',
    '  NDC lookup, formulary navigation',
    '  Insurance & prior authorization',
    '',
    '  COLLABORATIVE',
    '  Interdisciplinary team coordination',
    '  Patient communication & education',
    '  HIPAA compliance & PHI handling',
    '  Cross-cultural care (14+ languages)',
  ])
}

function getContact(): string[] {
  return box([
    ' COMMUNICATION CHANNELS',
    '---',
    '',
    '  EMAIL     zba3gm@virginia.edu    [[email]]',
    '  LINKEDIN  Brandon Nguyen       [[linkedin]]',
    '  GITHUB    @brandvnguy14-boop    [[github]]',
    '',
    '  LOCATION  University of Virginia',
    '            Charlottesville, VA',
  ])
}

function getNeofetch(): string[] {
  return [
    '',
    '    \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2557   \u2588\u2588\u2557     brandon@neuros',
    '    \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2551     \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500',
    '    \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2554\u2588\u2588\u2557 \u2588\u2588\u2551     OS: NEUROS Medical Terminal v3.8.2',
    '    \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551\u255A\u2588\u2588\u2557\u2588\u2588\u2551     Host: University of Virginia',
    '    \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551 \u255A\u2588\u2588\u2588\u2588\u2551     Kernel: Neuroscience/Pre-Med',
    '    \u255A\u2550\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u255D  \u255A\u2550\u2550\u2550\u255D     Uptime: since Aug 2025',
    '                            Packages: 44+ (fastapi)',
    '    \u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584     Shell: python/typescript',
    '    \u2588 SnapRx  MicroBloom\u2588   Resolution: 3.82 GPA',
    '    \u2588 Resonance  EAlpha \u2588   Terminal: NEUROS',
    '    \u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580    CPU: Cognitive Neuroscience',
    '                            Memory: National Merit Scholar',
    '',
  ]
}

function getScan(): string[] {
  return [
    '> Initiating neural diagnostic scan...',
    '> Scanning cortical regions...',
    '',
    '  REGION              STATUS    ACTIVITY',
    '  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500   \u2500\u2500\u2500\u2500\u2500     \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500',
    '  Prefrontal Cortex   ONLINE    \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591 HIGH',
    '  Motor Cortex        ONLINE    \u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591 NORMAL',
    '  Temporal Lobe       ONLINE    \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591 HIGH',
    '  Hippocampus         ONLINE    \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591 ELEVATED',
    '  Broca\'s Area        ONLINE    \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591 ACTIVE',
    '  Visual Cortex       ONLINE    \u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591 NORMAL',
    '  Cerebellum          ONLINE    \u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591 NOMINAL',
    '',
    '  DIAGNOSIS: All systems operational.',
    '  Neural plasticity index: 94.2%',
    '  Recommendation: Continue current protocol.',
    '',
  ]
}

const LINK_MAP: Record<string, string> = {
  '[[LinkedIn]]': 'https://www.linkedin.com/in/brandon-nguyen-59b9a1343/',
  '[[linkedin]]': 'https://www.linkedin.com/in/brandon-nguyen-59b9a1343/',
  '[[GitHub]]': 'https://github.com/brandvnguy14-boop',
  '[[github]]': 'https://github.com/brandvnguy14-boop',
  '[[Email]]': 'mailto:zba3gm@virginia.edu',
  '[[email]]': 'mailto:zba3gm@virginia.edu',
  '[[snaprx]]': 'https://snaprx.co',
  '[[microbloom]]': 'https://microbloom.life',
}

// ============================================
// TERMINAL COMPONENT
// ============================================

interface OutputLine {
  text: string
  type: 'output' | 'command' | 'system'
}

export function Terminal() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<OutputLine[]>([])
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [booted, setBooted] = useState(false)
  const [bootLines, setBootLines] = useState<string[]>([])
  const [hoveredRegion, setHoveredRegion] = useState<typeof BRAIN_REGIONS_DATA[number] | null>(null)
  const [leftTab, setLeftTab] = useState<'neuro' | 'pathways' | 'pharm'>('neuro')
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const [time, setTime] = useState('')
  const [temp, setTemp] = useState<string | null>(null)

  // Clock
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  // Charlottesville temperature
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=38.0293&longitude=-78.4767&current_weather=true&temperature_unit=fahrenheit')
      .then(r => r.json())
      .then(data => {
        if (data?.current_weather?.temperature != null) setTemp(`${Math.round(data.current_weather.temperature)}`)
      })
      .catch(() => {})
  }, [])

  // Boot sequence
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        const msg = BOOT_LINES[i]
        setBootLines((prev) => [...prev, msg])
        i++
      } else {
        clearInterval(interval)
        setBooted(true)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll
  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight
  }, [history, bootLines])

  const focusInput = useCallback(() => { inputRef.current?.focus() }, [])

  const processCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    const newHistory: OutputLine[] = [...history, { text: `neuros> ${cmd}`, type: 'command' }]
    let output: string[] = []

    switch (trimmed) {
      case 'help': output = getHelp(); break
      case 'whoami': output = getWhoami(); break
      case 'vitals': output = getVitals(); break
      case 'projects': output = getProjects(); break
      case 'experience': case 'exp': output = getExperience(); break
      case 'achievements': case 'awards': output = getAchievements(); break
      case 'skills': case 'tech': output = getSkills(); break
      case 'contact': output = getContact(); break
      case 'scan': output = getScan(); break
      case 'neofetch': output = getNeofetch(); break
      case 'clear': setHistory([]); setInput(''); return
      case '': setHistory(newHistory); setInput(''); return
      default: output = [`Command not found: ${trimmed}`, 'Type "help" for available commands.']
    }

    setHistory([...newHistory, ...output.map(t => ({ text: t, type: 'output' as const })), { text: '', type: 'output' }])
    setInput('')
    setCmdHistory(prev => [cmd, ...prev])
    setHistoryIndex(-1)
  }, [history])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { processCommand(input) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (cmdHistory.length > 0 && historyIndex < cmdHistory.length - 1) { const n = historyIndex + 1; setHistoryIndex(n); setInput(cmdHistory[n]) } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (historyIndex > 0) { const n = historyIndex - 1; setHistoryIndex(n); setInput(cmdHistory[n]) } else { setHistoryIndex(-1); setInput('') } }
    else if (e.key === 'Tab') { e.preventDefault(); const p = input.toLowerCase(); if (p) { const m = Object.keys(COMMANDS).find(c => c.startsWith(p)); if (m) setInput(m) } }
  }

  const renderLine = (text: string) => {
    const linkRegex = /\[\[([^\]]+)\]\]/g
    const parts: (string | React.ReactElement)[] = []
    let lastIndex = 0
    let match
    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
      const fullMatch = match[0], label = match[1], url = LINK_MAP[fullMatch]
      if (url) {
        parts.push(<a key={match.index} href={url} target={url.startsWith('mailto') ? undefined : '_blank'}
          rel={url.startsWith('mailto') ? undefined : 'noopener noreferrer'}
          className="text-[#ffa502] hover:text-[#ffcc66] underline underline-offset-2 cursor-pointer"
          onClick={e => e.stopPropagation()}>[{label}]</a>)
      } else parts.push(`[${label}]`)
      lastIndex = match.index + fullMatch.length
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex))
    return parts.length > 0 ? parts : text
  }

  const handleRegionHover = useCallback((region: typeof BRAIN_REGIONS_DATA[number] | null) => {
    setHoveredRegion(region)
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col bg-[#0a1628] text-[#00d4ff] text-xs sm:text-sm overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 border-b border-[#00d4ff15] bg-[#0d1f3c] text-[10px] sm:text-xs shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-[#00d4ff] terminal-glow-strong font-bold tracking-wider">NEUROS</span>
          <span className="text-[#00d4ff50]">Medical Research Terminal v3.8.2</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="hidden sm:inline text-[#00d4ff50]">Patient: NGUYEN, B.</span>
          <span className="text-[#ff4757] heart-pulse">&#9829;</span>
          <span className="text-[#00d4ff60]">72 bpm</span>
          <span className="hidden sm:inline text-[#2ed573]">SpO2 98%</span>
          <span className="text-[#ffa502]">{temp ? `${temp}\u00B0F` : '--\u00B0F'}</span>
          <span className="vital-pulse text-[#00d4ff]">{time}</span>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Left panel with tabs */}
        <div className="flex flex-col lg:w-[38%] shrink-0 border-b lg:border-b-0 lg:border-r border-[#00d4ff10]">
          {/* Tab bar */}
          <div className="flex shrink-0 border-b border-[#00d4ff10] bg-[#0d1f3c]">
            {([['neuro', 'NEURO'], ['pathways', 'PATHWAYS'], ['pharm', 'PHARM']] as const).map(([id, label]) => (
              <button key={id} onClick={() => setLeftTab(id)}
                className={`flex-1 px-2 py-1.5 text-[9px] sm:text-[10px] tracking-widest uppercase transition-all ${
                  leftTab === id
                    ? 'text-[#00d4ff] border-b-2 border-[#00d4ff] bg-[#00d4ff08]'
                    : 'text-[#00d4ff40] hover:text-[#00d4ff80] border-b-2 border-transparent'
                }`}>
                {label}
              </button>
            ))}
          </div>
          {/* Tab content */}
          <div className="flex-1 overflow-auto">
            {leftTab === 'neuro' && (
              <div className="flex items-center justify-center p-2 sm:p-3 h-full">
                <AsciiBrain onRegionHover={handleRegionHover} hoveredRegion={hoveredRegion} />
              </div>
            )}
            {leftTab === 'pathways' && <PathwaysPanel />}
            {leftTab === 'pharm' && <PharmPanel />}
          </div>
        </div>

        {/* Terminal panel */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* EKG strip */}
          <div className="h-8 border-b border-[#00d4ff10] shrink-0">
            <EKGMonitor />
          </div>

          {/* Terminal output */}
          <div className="flex-1 flex flex-col min-h-0" onClick={focusInput}>
            <div ref={outputRef} className="flex-1 overflow-y-auto terminal-scroll px-3 sm:px-4 py-2 font-mono leading-relaxed">
              {bootLines.map((line, i) => (
                <div key={`boot-${i}`}
                  className={`boot-line ${line.startsWith('[SYS]') ? 'text-[#2ed573aa]' : line.startsWith('Patient') ? 'text-[#ffa502]' : 'text-[#00d4ff80]'}`}
                  style={{ animationDelay: `${i * 0.04}s` }}>
                  {line || '\u00A0'}
                </div>
              ))}
              {booted && history.map((line, i) => (
                <div key={i} className={line.type === 'command' ? 'text-[#64b5f6] terminal-glow mt-1' : 'text-[#00d4ff] whitespace-pre'}>
                  {line.text ? renderLine(line.text) : '\u00A0'}
                </div>
              ))}
              {booted && (
                <div className="flex items-center gap-0 mt-1 terminal-glow">
                  <span className="text-[#64b5f6] shrink-0">neuros&gt; </span>
                  <div className="relative flex-1">
                    <input ref={inputRef} type="text" value={input}
                      onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                      className="bg-transparent outline-none text-[#00d4ff] w-full caret-transparent font-mono"
                      autoFocus spellCheck={false} autoComplete="off" aria-label="Terminal input" />
                    <span className="cursor-blink absolute top-0 text-[#00d4ff]" style={{ left: `${input.length}ch` }}>_</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick commands */}
            <div className="shrink-0 border-t border-[#00d4ff10] px-3 sm:px-4 py-1.5 flex flex-wrap gap-1.5 bg-[#0d1f3c]">
              {['whoami', 'projects', 'skills', 'experience', 'contact', 'scan'].map(cmd => (
                <button key={cmd} onClick={e => { e.stopPropagation(); processCommand(cmd) }}
                  className="px-2.5 py-1 text-[10px] sm:text-xs border border-[#00d4ff20] rounded text-[#00d4ff60] hover:text-[#00d4ff] hover:border-[#00d4ff50] hover:bg-[#00d4ff08] transition-all uppercase tracking-wider">
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
