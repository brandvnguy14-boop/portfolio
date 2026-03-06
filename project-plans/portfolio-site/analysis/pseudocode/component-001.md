# Neural Network Visualization - Pseudocode

## Data Structures
```
Neuron: { position, velocity, radius, activation, pulsePhase, connections[] }
Synapse: { from, to, strength, firing, fireProgress }
```

## Initialization
```
ON canvas mount:
  count = NEURON_COUNTS[intensity]
  FOR i in 0..count:
    CREATE neuron at random position with small random velocity
  BUILD synapse list from proximity pairs
```

## Animation Loop
```
EACH frame:
  FOR each neuron:
    UPDATE position by velocity
    BOUNCE off edges
    IF mouse nearby:
      INCREASE activation
      APPLY gentle attraction force
    DECAY activation
    LIMIT speed

  FOR each synapse:
    IF firing:
      ADVANCE fire progress
      IF complete: activate target neuron
    ELSE IF random chance OR source activated:
      START firing

  DRAW synapses (dim lines with traveling pulse for firing ones)
  DRAW neurons (glowing circles, brighter when activated)
```

## Adaptation
```
intensity = getAnimationIntensity(deviceCapabilities)
IF intensity == 'none': RETURN null (no canvas)
IF intensity == 'minimal': fewer neurons, shorter connections
IF intensity == 'moderate': moderate neurons
IF intensity == 'full': maximum neurons, full effects
```
