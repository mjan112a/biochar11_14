# Circular Sankey Diagram - Adjustable Variables Specification

## Overview
This document lists all adjustable variables in the CircularSankeyDiagramV2 component that can be exposed through a control panel for real-time fine-tuning.

## 1. Canvas Dimensions

### Variables
- `width`: Canvas width in pixels
  - Current: 900px (default), min 600px
  - Control Type: Slider (600-1600)
  - Location: Line 126, 150

- `height`: Canvas height in pixels
  - Current: 700px (default), calculated as width * 0.75, min 500px
  - Control Type: Slider (500-1200) OR auto-calculated from width
  - Location: Line 151

- `aspectRatio`: Height/Width ratio
  - Current: 0.75
  - Control Type: Slider (0.5-1.5)
  - Location: Line 151

## 2. Node Positioning (POSITION_MAP)

### Variables (for each node)
Each node has positioning coordinates on a 0-1 relative scale:

```typescript
{
  x: number (0-1),  // Horizontal position
  y: number (0-1),  // Vertical position
  radius?: number   // Optional: distance from center for circular layouts
}
```

**Component Nodes** (6 nodes):
- `chicken-house`: { x: 0.15, y: 0.5 }
- `processing-plant`: { x: 0.5, y: 0.15 }
- `anaerobic-digester`: { x: 0.5, y: 0.5 }
- `pyrolysis-unit`: { x: 0.85, y: 0.5 }
- `farm`: { x: 0.3, y: 0.85 }
- `land-applied`: { x: 0.7, y: 0.85 }
- `landfill`: { x: 0.9, y: 0.5 }

**Input Nodes** (8+ nodes):
- All have x, y, and optional radius values

**Intermediate Nodes** (11+ nodes):
- Positioned between components

**Output Nodes** (3+ nodes):
- Final products and circular materials

**Waste Nodes** (3 nodes):
- For current system view

### Control Type
- Individual XY sliders for each node (0-1 range)
- OR Visual drag-and-drop positioning
- Location: Lines 80-121

## 3. Flow Path Rendering

### Stroke Width
- Formula: `Math.max(minWidth, Math.sqrt(link.value) * widthMultiplier)`
- Current: `Math.max(2, Math.sqrt(link.value))`
- Location: Line 240

**Variables:**
- `minFlowWidth`: Minimum stroke width
  - Current: 2
  - Control Type: Slider (1-10)

- `flowWidthMultiplier`: Scaling factor for flow width
  - Current: 1.0 (implicit)
  - Control Type: Slider (0.1-3.0)

- `flowWidthFormula`: Choice of scaling algorithm
  - Options: 'sqrt', 'linear', 'log', 'custom'
  - Current: 'sqrt'
  - Control Type: Dropdown

### Opacity
- `flowOpacity`: Transparency of flow paths
  - Current: 0.6
  - Control Type: Slider (0.1-1.0)
  - Location: Line 242

## 4. Node Sizing

### Variables
- `componentNodeSize`: Size of component nodes
  - Current: 50
  - Control Type: Slider (30-100)
  - Location: Line 272

- `standardNodeSize`: Size of non-component nodes
  - Current: 30
  - Control Type: Slider (20-60)
  - Location: Line 272

## 5. Text & Labels

### Link Labels
- `linkLabelFontSize`: Font size for flow labels
  - Current: '10px'
  - Control Type: Slider (8-16)
  - Location: Line 253

- `linkLabelOffset`: Vertical offset from path
  - Current: -5
  - Control Type: Slider (-20 to 20)
  - Location: Line 251

### Node Labels
- `nodeLabelOffset`: Distance below node
  - Current: size/2 + 18
  - Control Type: Slider (0-40)
  - Location: Line 300

- `componentLabelFontSize`: Font size for component labels
  - Current: '12px'
  - Control Type: Slider (10-18)
  - Location: Line 302

- `standardLabelFontSize`: Font size for other node labels
  - Current: '10px'
  - Control Type: Slider (8-14)
  - Location: Line 302

## 6. Colors (COLORS Object)

### Component Colors
Each component can have a custom color:
- `chicken-house`: '#059669' (green)
- `processing-plant`: '#3B82F6' (blue)
- `anaerobic-digester`: '#8B5CF6' (purple)
- `pyrolysis-unit`: '#F59E0B' (orange)
- `farm`: '#10B981' (emerald)
- `land-applied`: '#06B6D4' (cyan)
- `landfill`: '#991B1B' (red)

**Control Type:** Color picker for each component
**Location:** Lines 48-68

### Material Type Colors
- `input`: '#9CA3AF' (gray)
- `intermediate`: '#6B7280' (gray)
- `output`: '#10B981' (green)
- `energy`: '#F59E0B' (orange)
- `biochar`: '#065F46' (dark green)
- `material`: '#6B7280' (gray)
- `manure`: '#92400E' (brown)
- `gas`: '#8B5CF6' (purple)
- `waste`: '#DC2626' (red)

**Control Type:** Color picker for each type

## 7. Path Generation

### Direct Paths (Arcs)
- Uses D3 arc path with radius = distance between nodes
- No adjustable variables (automatic calculation)
- Location: Lines 378-384

### Circular Paths (Curves)
- `circularPathCurvature`: Curve intensity
  - Current: 0.3 (perpendicular offset multiplier)
  - Control Type: Slider (0.1-1.0)
  - Location: Lines 394-395

Formula: 
```typescript
const perpX = -dy * curvature;
const perpY = dx * curvature;
```

## 8. Particle Animation

These variables are in the FlowParticleAnimator class (separate file), but can be controlled:

- `particleCount`: Particles per flow
  - Typical: 3-10
  - Control Type: Slider (1-20)

- `particleSize`: Size of animated particles
  - Typical: 4-8
  - Control Type: Slider (2-16)

- `particleSpeed`: Animation speed multiplier
  - Typical: 1.0
  - Control Type: Slider (0.1-3.0)

- `useIconParticles`: Whether to use material icons or circles
  - Current: true (uses icons when available)
  - Control Type: Toggle

## 9. Layout Presets

Pre-configured layouts that can be selected:

1. **Circular Layout**: Components arranged in circle
2. **Linear Layout**: Left-to-right flow
3. **Hierarchical**: Top-down process flow
4. **Custom**: User-defined positions

## Control Panel Organization

### Recommended Tab Structure:

1. **Canvas Tab**
   - Dimensions (width, height, aspect ratio)
   - Background color

2. **Nodes Tab**
   - Node sizes (component, standard)
   - Node positioning (grid of XY sliders or visual editor)
   - Node colors

3. **Flows Tab**
   - Flow width (min, multiplier, formula)
   - Flow opacity
   - Flow colors by type

4. **Labels Tab**
   - Font sizes (link, component, standard)
   - Label offsets
   - Label visibility toggles

5. **Curves Tab**
   - Circular path curvature
   - Path smoothing options

6. **Animation Tab**
   - Particle count
   - Particle size
   - Particle speed
   - Icon particles toggle

7. **Presets Tab**
   - Save current configuration
   - Load saved configurations
   - Export as JSON
   - Layout presets

## Implementation Strategy

### Phase 1: Create Control Panel Component
```typescript
interface SankeyControlConfig {
  canvas: {
    width: number;
    height: number;
    aspectRatio: number;
  };
  nodes: {
    componentSize: number;
    standardSize: number;
    positions: Record<string, { x: number; y: number }>;
  };
  flows: {
    minWidth: number;
    widthMultiplier: number;
    widthFormula: 'sqrt' | 'linear' | 'log';
    opacity: number;
  };
  labels: {
    linkFontSize: number;
    linkOffset: number;
    nodeLabelOffset: number;
    componentFontSize: number;
    standardFontSize: number;
  };
  curves: {
    circularCurvature: number;
  };
  colors: Record<string, string>;
  animation: {
    particleCount: number;
    particleSize: number;
    particleSpeed: number;
    useIcons: boolean;
  };
}
```

### Phase 2: Modify CircularSankeyDiagramV2
- Accept config prop
- Use config values instead of hardcoded constants
- Add real-time update capability

### Phase 3: Add Persistence
- Save configurations to localStorage
- Export/import as JSON files
- Create preset library

### Phase 4: Visual Position Editor
- Drag-and-drop node positioning
- Visual feedback for changes
- Snap to grid option

## Benefits of Control Panel

1. **Rapid Iteration**: Instantly see changes without code edits
2. **Experimentation**: Try different layouts and styles easily
3. **Documentation**: Generate exact specifications for final implementation
4. **Collaboration**: Non-technical stakeholders can provide input
5. **Preset Management**: Save and compare different configurations
6. **Export**: Generate final configuration for production use

## Next Steps

1. Create `SankeyControlPanel.tsx` component with all controls
2. Modify `CircularSankeyDiagramV2.tsx` to accept configuration prop
3. Add localStorage persistence
4. Implement export/import functionality
5. Create visual node position editor (optional but recommended)