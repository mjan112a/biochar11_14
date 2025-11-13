# Hybrid Sankey Diagram - Phase 3 Implementation Plan
**Enhanced Control Panel & Interactive Features**

## Objectives

Build an advanced control panel that allows users to:
1. **Drag nodes** to custom positions
2. **Adjust path styling** (width, curvature, opacity)
3. **Save/Load layouts** as JSON presets
4. **Fine-tune positions** with X/Y coordinate inputs
5. **Auto-optimize layout** to minimize crossings

---

## Components to Build

### 1. HybridSankeyControlPanel.tsx (6-8 hours)
**Features:**
- **Node Selection Dropdown** - Choose node to edit
- **Position Controls:**
  - X coordinate slider/input (0-1000)
  - Y coordinate slider/input (0-700)
  - "Reset Position" button
- **Path Styling:**
  - Width scale slider (0.5x - 2x)
  - Curvature slider (0-1)
  - Opacity slider (0.3-1.0)
- **Layout Actions:**
  - "Auto-Optimize" button - minimize crossings
  - "Reset All" button - restore defaults
- **Save/Load:**
  - "Save Layout" button - export JSON
  - "Load Layout" button - import JSON
  - Preset selector (Default, Compact, Wide)

### 2. Enhanced HybridSankeyDiagram.tsx (4-5 hours)
**Add Features:**
- **Drag-and-Drop:**
  - D3 drag behavior on nodes
  - Update position on drag
  - Snap-to-grid option
  - Real-time path recalculation
- **Node Highlighting:**
  - Highlight selected node
  - Dim non-connected nodes
  - Show connection paths
- **Callbacks:**
  - onNodePositionChange
  - onLayoutChange
  - onNodeSelect

### 3. Layout Presets System (2-3 hours)
**Preset Layouts:**
```typescript
const LAYOUT_PRESETS = {
  default: { /* current column layout */ },
  compact: { /* tighter spacing */ },
  wide: { /* more horizontal space */ },
  vertical: { /* tall/narrow */ },
  custom: { /* user-saved */ }
};
```

---

## Implementation Steps

### Step 1: Add Drag Behavior (2 hours)
```typescript
// In HybridSankeyDiagram.tsx
const drag = d3.drag()
  .on('start', (event, node) => {
    setDraggingNode(node.id);
  })
  .on('drag', (event, node) => {
    updateNodePosition(node.id, event.x, event.y);
  })
  .on('end', () => {
    setDraggingNode(null);
  });

nodeG.call(drag);
```

### Step 2: Build Control Panel UI (3 hours)
- Layout with collapsible sections
- Form controls with Tailwind styling
- State management for all settings
- Real-time updates to diagram

### Step 3: Implement Save/Load (2 hours)
```typescript
function exportLayout() {
  const layout = {
    nodes: nodes.map(n => ({ id: n.id, x: n.x, y: n.y })),
    config: pathConfig,
    timestamp: Date.now()
  };
  
  const json = JSON.stringify(layout, null, 2);
  downloadFile('layout.json', json);
}

function importLayout(file) {
  const layout = JSON.parse(file);
  applyLayout(layout);
}
```

### Step 4: Add Auto-Optimization (2 hours)
```typescript
function optimizeLayout(nodes, links) {
  // Calculate crossing score
  // Use simulated annealing to find better positions
  // Update node positions iteratively
  // Return optimized layout
}
```

### Step 5: Preset System (1 hour)
- Define preset configurations
- Preset selector dropdown
- Apply preset function
- Smooth transitions between presets

---

## UI Mockup

```
┌─────────────────────────────────────────────────┐
│  Hybrid Flow Visualization                      │
│                                                  │
│  [Current] [Proposed]  [Labels✓] [Tooltips✓]   │
│                                                  │
│  ┌──────────────┐                               │
│  │ ⚙️ Controls  │ [Collapse]                    │
│  ├──────────────┤                               │
│  │ Node Editor                                  │
│  │ Select: [Chicken House ▼]                   │
│  │ X: [━━●━━━━━] 250                           │
│  │ Y: [━━━●━━━] 350                           │
│  │ [Reset Position]                             │
│  │                                              │
│  │ Path Styling                                 │
│  │ Width:  [━━━━●━━] 1.2x                     │
│  │ Curve:  [━━━●━━━] 0.5                      │
│  │ Opacity:[━━━━●━━] 0.8                      │
│  │                                              │
│  │ Layout                                       │
│  │ Preset: [Default ▼]                        │
│  │ [Auto-Optimize] [Reset All]                │
│  │ [💾 Save] [📂 Load]                         │
│  └──────────────┘                               │
│                                                  │
│  [SVG Diagram with draggable nodes]            │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## Technical Architecture

### State Management
```typescript
interface ControlPanelState {
  selectedNode: string | null;
  pathConfig: PathConfig;
  layoutPreset: string;
  isDragging: boolean;
  customPositions: Map<string, {x: number, y: number}>;
}
```

### Component Communication
```
HybridSankeyPage
├── HybridSankeyControlPanel (controls state)
│   ├── Node Editor
│   ├── Path Styling
│   └── Layout Manager
├── HybridSankeyDiagram (receives props)
│   ├── Drag handlers (emit onPositionChange)
│   ├── Node selection (emit onNodeSelect)
│   └── Render with updated positions
```

---

## Files to Create/Modify

### New Files:
1. `components/d3/HybridSankeyControlPanel.tsx` (~300 lines)
2. `lib/layoutPresets.ts` (~150 lines)
3. `lib/layoutOptimizer.ts` (~200 lines)

### Modified Files:
1. `components/d3/HybridSankeyDiagram.tsx` (add drag, callbacks)
2. `src/app/sankey-hybrid/page.tsx` (integrate control panel)
3. `lib/hybridSankeyLayout.ts` (add preset support)

---

## Estimated Time: 18-24 hours

### Breakdown:
- Drag-and-drop: 2 hours
- Control panel UI: 3 hours
- Save/Load: 2 hours
- Auto-optimization: 2 hours
- Presets: 1 hour
- Integration: 2 hours
- Testing & Polish: 3-4 hours
- Documentation: 2-3 hours

---

## Success Criteria

✓ Users can drag nodes to new positions  
✓ Paths update in real-time during drag  
✓ Control panel adjusts all settings  
✓ Layouts can be saved and loaded  
✓ Auto-optimize reduces crossings  
✓ Presets provide quick layouts  
✓ No performance issues with interactions  

---

## Next Steps

Shall I proceed with:
1. **Full Phase 3** - All features above
2. **Drag-only** - Just drag-and-drop first
3. **Control Panel** - Just the control UI
4. **Something else** - Your preference

Ready to continue when you confirm!