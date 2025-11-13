# Hybrid Sankey Diagram - Particle Animations & Ribbon Visualization Guide

This guide covers the two major new features added to the Hybrid Sankey Diagram component.

## Overview

The Hybrid Sankey Diagram now supports two advanced visualization modes:

1. **Particle Flow Animations** - Animated dots that travel along flow paths to visualize material movement
2. **Traditional Sankey Ribbons** - Filled ribbon paths with width proportional to flow volume

Both features can be used independently or combined for maximum visual impact.

---

## 1. Particle Flow Animations

### Description
Animated particles (dots) that move along flow paths, providing a dynamic visualization of material flow through the system. Particles can be customized with various parameters to match the specific needs of your diagram.

### Features

#### Core Parameters

- **flowRate** (1-10 particles/sec)
  - Controls how many particles are spawned per second
  - Higher values create denser flow visualization
  - Default: 3 particles/sec

- **velocity** (0.1-3.0x)
  - Speed multiplier for particle movement
  - 1.0 = base speed, >1.0 = faster, <1.0 = slower
  - Default: 1.0x

- **particleSize** (2-12px)
  - Radius of particle dots in pixels
  - Larger sizes are more visible but can clutter the diagram
  - Default: 6px

- **particleSpacing** (20-150px)
  - Minimum distance between particles on the same path
  - Prevents overcrowding and maintains visual clarity
  - Default: 50px

- **particleLifetime** (0 = infinite, or milliseconds)
  - How long particles exist before fading out
  - 0 means particles loop indefinitely
  - Useful for creating pulsing effects
  - Default: 0 (infinite)

- **pauseOnHover** (boolean)
  - When enabled, animations pause when mouse hovers over the diagram
  - Useful for detailed inspection of the diagram
  - Default: false

- **particleShape** ('circle' | 'square' | 'custom')
  - Shape of the animated particles
  - Custom shapes can use flow-specific icons
  - Default: 'circle'

- **animationDuration** (milliseconds)
  - Base time for a particle to traverse its entire path
  - Adjusted by velocity multiplier
  - Default: 3000ms

### Usage Example

```tsx
import { HybridSankeyDiagram } from '@/components/d3/HybridSankeyDiagram';
import { ParticleAnimationConfig } from '@/lib/flowParticleAnimator';

function MyDiagram() {
  const particleConfig: ParticleAnimationConfig = {
    enabled: true,
    flowRate: 5,
    velocity: 1.5,
    particleSize: 8,
    animationDuration: 3000,
    particleLifetime: 0, // infinite
    particleSpacing: 60,
    pauseOnHover: true,
    particleShape: 'circle'
  };

  return (
    <HybridSankeyDiagram
      visualizationMode="lines"
      showAnimations={true}
      particleConfig={particleConfig}
      // ... other props
    />
  );
}
```

### Implementation Details

The particle animation system uses:
- **RequestAnimationFrame** for smooth 60fps animations
- **SVG path calculations** to position particles along curves
- **Automatic path detection** from rendered SVG elements
- **Fade in/out effects** at path endpoints for smooth appearance
- **Collision avoidance** via spacing parameter

### Performance Considerations

- Particle animations use minimal CPU due to efficient RAF loop
- Recommended maximum: 20 concurrent particles per path
- Use lower flowRate values (1-3) for complex diagrams with many flows
- Disable animations on low-end devices if performance issues occur

---

## 2. Traditional Sankey Ribbons

### Description
Filled ribbon paths that replace or supplement line-based paths. Ribbons have width proportional to flow volume, creating a traditional Sankey diagram appearance with smooth bezier curves and tapered connections at nodes.

### Features

#### Core Parameters

- **widthScale** (0.05-0.3x)
  - Multiplier for ribbon width calculation
  - Higher values create wider ribbons
  - Default: 0.15x

- **taperRatio** (0-1)
  - How much ribbons taper at node connections
  - 0 = no taper (full width at nodes)
  - 1 = full taper (thin at nodes, wide in middle)
  - Default: 0.3

- **curvature** (0-1)
  - Amount of curve in S-shaped flows
  - 0 = more angular, 1 = more curved
  - Default: 0.5

- **arcRadius** (0.5-2.0x)
  - Radius multiplier for circular arc flows
  - Larger values create wider arcs
  - Default: 1.2x

- **minWidth** / **maxWidth** (pixels)
  - Bounds for ribbon width regardless of flow value
  - Prevents ribbons from being too thin or too wide
  - Defaults: min=4px, max=80px

### Ribbon Types

The generator automatically selects the appropriate ribbon type based on node positions:

1. **Straight Ribbons**
   - Used for short, direct connections (<150px)
   - Minimal curvature
   - Tapered ends for smooth node attachment

2. **S-Curve Ribbons**
   - Used for medium-to-long distance flows
   - Smooth cubic bezier curves
   - Adjustable curvature parameter

3. **Arc Ribbons**
   - Used for circular/return flows (backward direction)
   - Dashed stroke pattern to indicate recycling
   - Wider outer radius, narrower inner radius

### Usage Example

```tsx
import { HybridSankeyDiagram } from '@/components/d3/HybridSankeyDiagram';
import { RibbonConfig } from '@/lib/ribbonPathGenerator';

function MyDiagram() {
  const ribbonConfig: RibbonConfig = {
    minWidth: 4,
    maxWidth: 80,
    widthScale: 0.15,
    curvature: 0.5,
    arcRadius: 1.2,
    taperRatio: 0.3
  };

  return (
    <HybridSankeyDiagram
      visualizationMode="ribbons"
      ribbonConfig={ribbonConfig}
      // ... other props
    />
  );
}
```

### Styling

Ribbons support:
- **Fill color** - Based on flow type/category
- **Fill opacity** - Adjusts based on hover state
- **Stroke** - Thin outline matching fill color
- **Dashed patterns** - For circular flows
- **Gradient fills** - Can be added for enhanced visual appeal

### Implementation Details

Ribbons are generated as closed SVG paths:
- **Top edge** - Bezier curve from source to target
- **Bottom edge** - Reversed bezier curve back to source
- **Closed path** - Filled with flow color
- **Width calculation** - Proportional to √(flow value)

---

## 3. Visualization Modes

The diagram supports three visualization modes:

### Lines Mode
- Traditional line-based paths
- Supports particle animations
- Best for complex diagrams with many flows
- Lower visual clutter

### Ribbons Mode
- Filled ribbon paths only
- No particle animations (incompatible)
- Best for emphasizing flow volumes
- Traditional Sankey appearance

### Both Mode
- Combines lines and ribbons
- Particles animate on underlying line paths
- Ribbons provide visual weight
- Maximum visual information
- Use with caution - can be visually busy

### Mode Selection Example

```tsx
<HybridSankeyDiagram
  visualizationMode="both" // 'lines' | 'ribbons' | 'both'
  showAnimations={true}
  particleConfig={particleConfig}
  ribbonConfig={ribbonConfig}
/>
```

---

## 4. Control Panel Integration

The HybridSankeyControlPanel component now includes dedicated sections for:

### Visualization Mode Selector
- Three-button toggle: Lines | Ribbons | Both
- Visual feedback for current mode

### Particle Animation Controls
- Flow Rate slider
- Velocity multiplier
- Particle size adjustment
- Spacing control
- Pause on Hover toggle

### Ribbon Styling Controls
- Width scale slider
- Taper ratio adjustment
- Curvature control
- Arc radius multiplier

### Usage with Control Panel

```tsx
import { HybridSankeyControlPanel } from '@/components/d3/HybridSankeyControlPanel';

function MyApp() {
  const [visualizationMode, setVisualizationMode] = useState<VisualizationMode>('lines');
  const [showAnimations, setShowAnimations] = useState(false);
  const [particleConfig, setParticleConfig] = useState<ParticleAnimationConfig>({...});
  const [ribbonConfig, setRibbonConfig] = useState<RibbonConfig>({...});

  return (
    <>
      <HybridSankeyDiagram
        visualizationMode={visualizationMode}
        showAnimations={showAnimations}
        particleConfig={particleConfig}
        ribbonConfig={ribbonConfig}
        // ... other props
      />
      
      <HybridSankeyControlPanel
        visualizationMode={visualizationMode}
        onVisualizationModeChange={setVisualizationMode}
        showAnimations={showAnimations}
        onShowAnimationsChange={setShowAnimations}
        particleConfig={particleConfig}
        onParticleConfigChange={setParticleConfig}
        ribbonConfig={ribbonConfig}
        onRibbonConfigChange={setRibbonConfig}
        // ... other props
      />
    </>
  );
}
```

---

## 5. Best Practices

### Performance
- Start with default values and adjust incrementally
- Disable animations on mobile devices if needed
- Use 'lines' mode for diagrams with 20+ flows
- Test on target hardware before deploying

### Visual Clarity
- **For complex diagrams**: Use lines mode with subtle animations
- **For presentations**: Use ribbons mode for maximum impact  
- **For detailed analysis**: Use both mode sparingly, or toggle between modes
- Adjust opacity values to prevent visual overload

### Accessibility
- Provide alternative non-animated views
- Ensure sufficient color contrast for ribbons
- Add ARIA labels for screen readers
- Support pause on hover for users who need time to process

### User Experience
- Provide clear mode selection controls
- Include tooltips explaining each parameter
- Save user preferences in local storage
- Provide preset configurations for common use cases

---

## 6. API Reference

### HybridSankeyDiagram Props

```typescript
interface HybridSankeyDiagramProps {
  // Visualization mode
  visualizationMode?: 'lines' | 'ribbons' | 'both';
  
  // Animation controls
  showAnimations?: boolean;
  particleConfig?: ParticleAnimationConfig;
  
  // Ribbon controls
  ribbonConfig?: RibbonConfig;
  
  // ... other existing props
}
```

### ParticleAnimationConfig

```typescript
interface ParticleAnimationConfig {
  enabled: boolean;
  flowRate: number;              // 1-10 particles/sec
  velocity: number;              // 0.1-3.0x speed multiplier
  particleSize: number;          // 2-12px radius
  animationDuration: number;     // milliseconds for full traverse
  particleLifetime: number;      // 0 = infinite, or milliseconds
  particleSpacing: number;       // 20-150px minimum distance
  pauseOnHover: boolean;         // stop on interaction
  particleShape: 'circle' | 'square' | 'custom';
  particleColor?: string | ((linkType: string) => string);
}
```

### RibbonConfig

```typescript
interface RibbonConfig {
  minWidth: number;      // minimum ribbon width in pixels
  maxWidth: number;      // maximum ribbon width in pixels
  widthScale: number;    // 0.05-0.3 width multiplier
  curvature: number;     // 0-1 curve amount for S-curves
  arcRadius: number;     // 0.5-2.0 radius multiplier for arcs
  taperRatio: number;    // 0-1 taper at node connections
}
```

---

## 7. Troubleshooting

### Particles Not Appearing
- Verify `showAnimations={true}`
- Check that `visualizationMode` is 'lines' or 'both'
- Ensure path elements have proper IDs
- Check browser console for errors

### Ribbons Not Rendering
- Verify `visualizationMode` is 'ribbons' or 'both'
- Check that ribbonConfig is properly passed
- Ensure layout data includes valid links
- Verify SVG viewBox dimensions

### Performance Issues
- Reduce `flowRate` value
- Decrease number of concurrent particles
- Use 'lines' mode instead of 'both'
- Disable animations on low-end devices

### Visual Artifacts
- Adjust `particleSpacing` to prevent overlap
- Increase `taperRatio` to improve node connections
- Adjust opacity values in ribbon styling
- Check for z-index conflicts in CSS

---

## 8. Future Enhancements

Potential future improvements:

- Custom particle shapes per flow type
- Gradient ribbons with multiple colors
- Interactive particle speed on hover
- Ribbon gradient transitions
- Export animated diagrams as GIF/video
- Performance profiling dashboard
- More particle shapes (triangles, icons, etc.)
- Ribbon animation effects (width pulsing, etc.)

---

## Support

For issues, questions, or feature requests, please refer to the project repository or contact the development team.