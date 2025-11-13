# Drag-and-Drop Node Positioning - Quick Guide

## How to Use

1. **Access the test page:**
   ```
   http://localhost:3000/sankey-test
   ```

2. **Enable Edit Mode:**
   - Look for the floating panel on the **left side** (top-left corner)
   - Check "Edit Mode (Drag Nodes)" checkbox
   - **Edit mode is enabled by default**

3. **Drag Nodes:**
   - Click on any node
   - Hold and drag to new position
   - Release to drop
   - Connected flows update automatically in real-time

4. **Use Grid:**
   - Check "Show Grid" to display positioning grid
   - Check "Snap to Grid" for magnetic alignment
   - Grid size: 5% of canvas (adjustable in code)

5. **Undo/Redo:**
   - Click "↶ Undo" or press **Ctrl+Z** (Cmd+Z on Mac)
   - Click "↷ Redo" or press **Ctrl+Y** (Cmd+Y on Mac)
   - History: Up to 50 states saved

## Features

### Visual Drag-and-Drop ✅
- **Click and drag** any node to reposition
- **Real-time flow updates** - connections follow nodes
- **Smooth cursor changes** - `grab` → `grabbing`
- **Node highlighting** on hover

### Grid System ✅
- **Visual grid display** - Light gray lines
- **Major/minor grid lines** - Bold lines every 2 grid units
- **Snap-to-grid** - Magnetic alignment when enabled
- **Adjustable grid size** - Default 5% (45px on 900px canvas)

### Undo/Redo System ✅
- **50-state history** - Last 50 changes remembered
- **Keyboard shortcuts:**
  - **Ctrl+Z** (Cmd+Z) - Undo
  - **Ctrl+Y** (Cmd+Y) - Redo
  - **Ctrl+Shift+Z** (Cmd+Shift+Z) - Also redo
- **Visual indicators** - Shows current state (e.g., "3 / 10 states")
- **Disabled buttons** - Gray when can't undo/redo

### Auto-Configuration Update ✅
- **Real-time config updates** - Position saved immediately
- **Export includes positions** - Your layout is saved
- **Relative coordinates** - Positions stored as 0-1 values

## Control Panel Integration

The drag-and-drop works **seamlessly with the control panel**:

1. **Drag nodes** to rough positions
2. **Fine-tune with sliders** in Nodes tab (if needed)
3. **Export configuration** when perfect
4. **Use in production** - Import saved layout

## Technical Details

### How It Works

```typescript
// Positions stored as relative values (0-1)
config.nodes.positions['chicken-house'] = {
  x: 0.15,  // 15% from left
  y: 0.50,  // 50% from top
}

// Grid snapping
gridSize = 0.05  // 5% of canvas
gridPixels = gridSize * canvasWidth  // 45px on 900px canvas
snappedX = Math.round(x / gridPixels) * gridPixels
```

### File Changes

**Modified Files:**
1. [`CircularSankeyDiagramV2.tsx`](components/d3/CircularSankeyDiagramV2.tsx) - Added drag behavior
2. [`CircularSankeyWithControls.tsx`](components/d3/CircularSankeyWithControls.tsx) - Added edit controls

**New Props:**
```typescript
interface CircularSankeyDiagramV2Props {
  editMode?: boolean;      // Enable drag-and-drop
  showGrid?: boolean;      // Display grid
  snapToGrid?: boolean;    // Magnetic alignment
  gridSize?: number;       // Grid spacing (0-1)
  onConfigChange?: (config) => void;  // Position updates
}
```

## Tips & Tricks

### Quick Positioning Workflow
1. **Enable grid** - Shows structure
2. **Disable snap** initially - Free movement
3. **Rough position** all nodes
4. **Enable snap** - Align to grid
5. **Fine-tune** with small adjustments
6. **Export** when satisfied

### Keyboard Workflow
- Drag with **mouse**
- **Ctrl+Z** to undo mistakes
- **Ctrl+Y** if you undo too much
- Use **control panel sliders** for precision

### Grid Sizes
- **0.05 (5%)** - Default, good balance
- **0.10 (10%)** - Coarser, faster alignment
- **0.025 (2.5%)** - Finer, more precision

### Best Practices
- **Start coarse, refine fine** - Rough layout first
- **Use undo liberally** - Don't fear experimentation
- **Check all views** - Test with current & proposed systems
- **Export often** - Save good layouts as you go

## Comparison: Sliders vs Drag-and-Drop

### Sliders (Original)
- ✅ Precise numeric control
- ✅ Good for exact positioning
- ❌ Slow for major layout changes
- ❌ Hard to visualize relationships

### Drag-and-Drop (New)
- ✅ Fast, intuitive positioning
- ✅ Visual feedback in real-time
- ✅ Easy to see node relationships
- ❌ Less precise without grid

### Combined Approach (Best)
1. **Drag for rough layout**
2. **Sliders for fine-tuning**
3. **Export perfect result**

## Troubleshooting

### Nodes Won't Drag
- Check "Edit Mode" is enabled
- Ensure you're clicking on the node itself (icon area)
- Control panel might be covering nodes - collapse it

### Flows Look Wrong
- Flows update in real-time during drag
- If stuck, try undo/redo
- Refresh page if persistent

### Grid Not Showing
- Check "Show Grid" is enabled
- Grid is subtle (light gray)
- Zoom in if needed

### Snap Not Working
- Requires "Edit Mode" enabled
- Snap only works during drag
- Grid size might be too small/large

### Undo/Redo Not Working
- Must make changes to have history
- History cleared on page refresh
- Limited to 50 states

### Position Doesn't Save
- Ensure `onConfigChange` prop is provided
- Check console for errors
- Export config to verify

## Future Enhancements

Possible additions:
- Multi-select nodes (drag multiple at once)
- Alignment tools (align left, center, right)
- Distribution tools (space evenly)
- Copy/paste positions
- Layout templates
- Zoom/pan for large diagrams
- Mini-map for navigation

## Summary

**Drag-and-drop node positioning** is now fully integrated with:
- ✅ Visual grid display
- ✅ Snap-to-grid alignment  
- ✅ Undo/redo (50 states)
- ✅ Keyboard shortcuts
- ✅ Real-time flow updates
- ✅ Auto-config saving
- ✅ Export/import support

This makes creating the perfect Sankey layout **much faster and more intuitive** than using sliders alone!