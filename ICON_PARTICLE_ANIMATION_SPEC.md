# Icon Particle Animation Feature Specification

## Overview
Add the ability to use SVG icons as animated particles flowing along connectors, as an alternative to the existing circular dot particles.

## User Requirements
- Users can select between dot particles or icon particles for flow animation
- Icon particles should use the same icon as the source or target node
- Icon size should be configurable (similar to existing particleSize)
- All existing animation controls (speed, particle count, etc.) should work with icon particles

## Technical Implementation

### 1. Data Model Updates

#### Link Type Extension
Add new properties to link/connector definitions:

```typescript
interface Link {
  // ... existing properties
  animated: boolean;
  animationSpeed?: number;
  particleSize?: number;
  
  // NEW: Icon particle properties
  particleType?: 'dot' | 'icon';  // Default: 'dot'
  particleIcon?: string;          // Icon path/URL
  particleIconSource?: 'source' | 'target' | 'custom';  // Where to get icon from
}
```

### 2. Animation System Updates

#### Particle Renderer
Modify the particle animation system to support two rendering modes:

**Dot Mode (existing):**
```typescript
ctx.beginPath();
ctx.arc(x, y, size, 0, Math.PI * 2);
ctx.fill();
```

**Icon Mode (new):**
```typescript
// Load and cache SVG icon
const icon = await loadSVGIcon(particleIcon);
// Render icon at particle position
ctx.drawImage(icon, x - size/2, y - size/2, size, size);
```

### 3. UI Controls

#### Style Panel Additions
Add new controls in the link styling section:

- **Particle Type** dropdown: "Dot" | "Icon"
- **Icon Source** radio buttons: "From Source Node" | "From Target Node" | "Custom"
- **Custom Icon** file picker (shown only when "Custom" selected)
- **Icon Size** slider (replaces or extends particleSize)

### 4. Performance Considerations

- **Icon Caching**: Pre-load and cache all icons used for particles
- **Canvas Optimization**: Use off-screen canvas for icon rendering
- **Frame Rate**: Maintain 60fps with up to 50 animated icon particles

### 5. Visual Examples

```
Before (Dot Particle):
  [Chicken House] ----●●●----> [Processing Plant]

After (Icon Particle):
  [Chicken House] ----🐔🐔🐔----> [Processing Plant]
```

## Implementation Phases

### Phase 1: Type Definitions & Data Model
- [ ] Update Link interface with new particle properties
- [ ] Add particleType to diagram JSON schema
- [ ] Update existing diagrams with default values

### Phase 2: Core Animation System
- [ ] Implement icon loading and caching system
- [ ] Modify particle animator to support icon rendering
- [ ] Add icon rotation/scaling options
- [ ] Test performance with multiple animated icons

### Phase 3: UI Controls
- [ ] Add particle type selector to StylePanel
- [ ] Add icon source selector
- [ ] Add custom icon upload/selection
- [ ] Wire up controls to update link properties

### Phase 4: Testing & Refinement
- [ ] Test with various icon sizes and formats
- [ ] Verify performance with many particles
- [ ] Add fallback for failed icon loads
- [ ] Polish animation timing and easing

## Configuration Examples

### Example 1: Chicken Icon Particles
```json
{
  "id": "house-to-processing",
  "source": "chicken-house",
  "target": "processing-plant",
  "animated": true,
  "particleType": "icon",
  "particleIconSource": "source",
  "particleSize": 20,
  "animationSpeed": 2
}
```

### Example 2: Custom Biochar Icon Particles
```json
{
  "id": "pyrolysis-to-biochar",
  "source": "pyrolysis-system",
  "target": "biochar-output",
  "animated": true,
  "particleType": "icon",
  "particleIconSource": "custom",
  "particleIcon": "/images/flow-icons/biochar.svg",
  "particleSize": 15,
  "animationSpeed": 1.5
}
```

## Benefits

1. **Visual Clarity**: Users can immediately identify what material is flowing
2. **Educational Value**: Makes the flow diagram more intuitive and self-explanatory
3. **Customization**: Provides more options for diagram styling
4. **Engagement**: More visually interesting than simple dots

## Technical Challenges & Solutions

### Challenge 1: SVG Loading Performance
**Solution**: Pre-load all icons at diagram initialization and maintain a cache

### Challenge 2: Icon Rendering on Canvas
**Solution**: Convert SVGs to canvas-compatible format or use image elements

### Challenge 3: Icon Orientation Along Path
**Solution**: Calculate tangent angle at particle position and rotate icon accordingly

### Challenge 4: Fallback for Missing Icons
**Solution**: Gracefully fall back to dot particles if icon fails to load

## Future Enhancements

- Icon trail effects (fading copies behind particle)
- Icon transformation along path (size/color changes)
- Multiple icon types in same flow (different materials)
- Animated icon sprites (e.g., flapping chicken wings)