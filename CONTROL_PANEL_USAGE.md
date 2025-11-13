# Circular Sankey Control Panel - Complete Guide

## Overview

The Circular Sankey Control Panel provides real-time control over **every adjustable parameter** in the circular Sankey diagram. This allows you to fine-tune the visualization until it looks exactly how you want it, then export the configuration for production use.

## Quick Start

### 1. Access the Control Panel

Navigate to: **`http://localhost:3000/sankey-test`**

This dedicated test page displays:
- The circular Sankey diagram
- The control panel (right side)
- Usage instructions

### 2. Using the Controls

The control panel has **8 tabs**, each controlling different aspects:

#### 📐 Canvas Tab
- **Width**: 600-1600px (default: 900px)
- **Height**: 500-1200px (default: 700px)
- **Aspect Ratio**: 0.5-1.5 (default: 0.78)
- **Background Color**: Color picker

#### 🔵 Nodes Tab
- **Component Size**: 30-100px (default: 50px)
- **Standard Size**: 20-60px (default: 30px)
- **Node Positions**: Individual X/Y sliders for each node (0-100%)
  - Select node from dropdown
  - Adjust X position (horizontal placement)
  - Adjust Y position (vertical placement)
  - Adjust Radius (for circular layouts, if applicable)

#### 🌊 Flows Tab
- **Min Width**: 1-10px (default: 2px)
- **Width Multiplier**: 0.1-3.0x (default: 1.0x)
- **Width Formula**: 
  - Square Root (√) - default, balanced scaling
  - Linear (1:1) - proportional to value
  - Logarithmic (log) - compressed for large ranges
- **Opacity**: 10-100% (default: 60%)

#### 🏷️ Labels Tab
- **Show Link Labels**: Toggle on/off
- **Show Node Labels**: Toggle on/off
- **Link Font Size**: 8-16px (default: 10px)
- **Link Label Offset**: -20 to 20px (default: -5px)
- **Node Label Offset**: 0-40px (default: 18px)
- **Component Font Size**: 10-18px (default: 12px)
- **Standard Font Size**: 8-14px (default: 10px)

#### 🌀 Curves Tab
- **Circular Path Curvature**: 0.1-1.0 (default: 0.3)
  - Controls how dramatically circular flows curve
  - Lower = subtle curves
  - Higher = dramatic, sweeping curves

#### 🎨 Colors Tab
**Component Colors** (7 components):
- Chicken House
- Processing Plant
- Anaerobic Digester
- Pyrolysis Unit
- Farm
- Land Applied
- Landfill

**Material Type Colors** (9 types):
- Input, Intermediate, Output
- Energy, Biochar, Material
- Manure, Gas, Waste

#### 🎬 Animation Tab
- **Enable Animation**: Toggle particle animation on/off
- **Use Icon Particles**: Toggle between material icons and circles
- **Particle Count**: 1-20 per flow (default: 5)
- **Particle Size**: 2-16px (default: 6px)
- **Particle Speed**: 0.1-3.0x (default: 1.0x)

#### 💾 Presets Tab
- **Export Configuration**: Download current settings as JSON
- **Import Configuration**: Load previously saved JSON file
- **Reset to Defaults**: Restore all original settings
- **Quick Presets**:
  - Default (900x700)
  - Compact (700x500)
  - Large (1200x800)

## Workflow for Fine-Tuning

### Step 1: Adjust Canvas
1. Go to **Canvas** tab
2. Set desired width and height
3. Adjust aspect ratio if needed
4. Change background color (optional)

### Step 2: Position Nodes
1. Go to **Nodes** tab
2. Adjust component and standard node sizes
3. For each node that needs repositioning:
   - Select from dropdown
   - Use X slider (left ↔ right)
   - Use Y slider (top ↔ bottom)
4. Keep adjusting until layout looks clean

### Step 3: Refine Flows
1. Go to **Flows** tab
2. Adjust min width (ensure small flows are visible)
3. Adjust width multiplier (scale all flows)
4. Try different formulas:
   - **sqrt** - good for most cases
   - **linear** - when values are similar
   - **log** - when values vary greatly
5. Adjust opacity for visual clarity

### Step 4: Fine-Tune Labels
1. Go to **Labels** tab
2. Toggle labels on/off as needed
3. Adjust font sizes for readability
4. Adjust offsets to prevent overlaps

### Step 5: Adjust Curves
1. Go to **Curves** tab
2. Increase curvature for dramatic effect
3. Decrease for subtle, minimal curves

### Step 6: Customize Colors
1. Go to **Colors** tab
2. Click color pickers to change
3. Match your brand colors or preferences

### Step 7: Configure Animation
1. Go to **Animation** tab
2. Toggle animation on/off
3. Adjust particle count (more = busier)
4. Adjust speed (faster = more dynamic)
5. Toggle icon particles for realism

### Step 8: Save Your Work
1. Go to **Presets** tab
2. Click **Export Configuration**
3. Save the JSON file
4. Use this config in production

## Using Exported Configuration

### In Your Code

```typescript
import { CircularSankeyDiagramV2 } from '@/components/d3/CircularSankeyDiagramV2';
import myConfig from './my-perfect-config.json';

function MyComponent() {
  return <CircularSankeyDiagramV2 config={myConfig} />;
}
```

### Sharing Configurations

The exported JSON can be:
- Shared with team members
- Version controlled in Git
- Used across multiple instances
- Modified programmatically

## Tips & Tricks

### Node Positioning
- **Components** should be evenly spaced in a circle or line
- **Inputs** typically go on outer edges (x: 0.05 or 0.95)
- **Outputs** can be placed strategically based on flow
- **Intermediate** nodes should be between source and target

### Flow Width Formulas
- **√ (sqrt)**: Best for values ranging 1-1000
- **Linear**: Best when values are 1-100
- **Log**: Best when values range from 1-10000+

### Colors
- Use **contrasting colors** for adjacent components
- Use **similar hues** for related materials
- Consider **colorblind-friendly palettes**

### Animation
- More particles = smoother but busier
- Slower speed = easier to follow individual flows
- Icon particles = more realistic and informative

## Keyboard Shortcuts

- **ESC**: Close control panel
- **Ctrl/Cmd + E**: Export (when panel is open)
- **Ctrl/Cmd + R**: Reset to defaults (with confirmation)

## Common Use Cases

### 1. Presentation Mode
```
Canvas: Large (1200x800)
Nodes: Larger sizes (60/40)
Flows: Higher opacity (80%)
Labels: Larger fonts (14/12)
Animation: Slower speed (0.5x), fewer particles (3)
```

### 2. Compact Dashboard
```
Canvas: Compact (700x500)
Nodes: Smaller sizes (40/25)
Flows: Thinner (min: 1px, multiplier: 0.8)
Labels: Smaller fonts (9/8)
Animation: Faster speed (1.5x), fewer particles (3)
```

### 3. Print/PDF Export
```
Canvas: High resolution (1400x1000)
Nodes: Medium sizes (50/30)
Flows: Moderate opacity (70%)
Labels: Clear, readable (12/10)
Animation: Disabled
Background: White
```

### 4. Focus on Specific Flows
```
Flows: Thicker lines (multiplier: 2.0)
Colors: High contrast
Labels: Show only critical labels
Animation: More particles (8), slower (0.7x)
```

## Technical Details

### Configuration Structure

```typescript
interface CircularSankeyConfig {
  canvas: {
    width: number;
    height: number;
    aspectRatio: number;
    backgroundColor: string;
  };
  nodes: {
    sizes: {
      componentSize: number;
      standardSize: number;
    };
    positions: Record<string, {
      x: number;  // 0-1
      y: number;  // 0-1
      radius?: number;  // 0-1
    }>;
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
    showLinkLabels: boolean;
    showNodeLabels: boolean;
  };
  curves: {
    circularCurvature: number;
  };
  colors: {
    [key: string]: string;  // Hex colors
  };
  animation: {
    particleCount: number;
    particleSize: number;
    particleSpeed: number;
    useIcons: boolean;
    enabled: boolean;
  };
}
```

### Files Created

1. **`types/circular-sankey-config.ts`** - TypeScript types and default config
2. **`components/d3/CircularSankeyControlPanel.tsx`** - Control panel UI component
3. **`components/d3/CircularSankeyWithControls.tsx`** - Wrapper combining diagram + controls
4. **`src/app/sankey-test/page.tsx`** - Test page
5. **`CIRCULAR_SANKEY_CONTROLS_SPEC.md`** - Technical specification

### Modified Files

1. **`components/d3/CircularSankeyDiagramV2.tsx`** - Now accepts `config` prop

## Troubleshooting

### Controls Not Showing
- Check that you're on `/sankey-test` page
- Ensure control panel isn't collapsed (look for "Show Controls" button)

### Changes Not Applying
- Changes apply instantly - if not working, check browser console for errors
- Try resetting to defaults and starting over

### Export Not Working
- Check browser's download folder
- Ensure browser allows file downloads
- Try a different browser if issues persist

### Import Not Working
- Ensure JSON file is valid (use JSON validator)
- Check that file matches config structure
- File must have `.json` extension

### Node Positions Seem Wrong
- Remember positions are relative (0-1 scale)
- 0.5 = center, 0 = left/top, 1 = right/bottom
- Check aspect ratio isn't distorting layout

## Support

For issues or questions:
1. Check this documentation
2. Review `CIRCULAR_SANKEY_CONTROLS_SPEC.md` for technical details
3. Inspect browser console for error messages
4. Check that all dependencies are installed

## Future Enhancements (Possible)

- Visual drag-and-drop node positioning
- Undo/redo functionality
- Multiple saved presets in localStorage
- Copy/paste node positions
- Bulk color theming
- Live preview comparison (side-by-side)
- Snap-to-grid for node positioning
- Export as SVG/PNG image