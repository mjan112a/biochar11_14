# Sankey Flow Builder - Architecture Plan

## Overview
Transform the experimental tab into a **visual Sankey diagram builder** that allows users to create custom flow diagrams for any domain (biochar, financial flows, business processes, etc.).

## Phase 1: Simple Editor (MVP)

### Core Features
1. **Node Management**
   - Add nodes via palette/button
   - Delete nodes
   - Drag to position nodes
   - Style nodes (color, size, label)

2. **Link Management**
   - Draw connections between nodes (click source → click target)
   - Delete connections
   - Style links (color, thickness/value)
   - Automatic path calculation using d3-sankey-circular

3. **Visualization Controls**
   - Toggle edit/preview mode
   - Animated flow dashes (from reference code)
   - Tooltips on hover
   - Pan/zoom canvas

4. **Data Management**
   - Save/Export as JSON
   - Load/Import from JSON
   - Start with blank canvas or template

---

## Technical Architecture

### 1. Data Model

```typescript
interface BuilderNode {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
  depth?: number;  // Auto-calculated by sankey
  value?: number;  // Auto-calculated from links
}

interface BuilderLink {
  id: string;
  source: string;  // node id
  target: string;  // node id
  value: number;   // thickness
  color: string;
  label?: string;
}

interface DiagramData {
  nodes: BuilderNode[];
  links: BuilderLink[];
  config: {
    width: number;
    height: number;
    nodePadding: number;
    circularLinkGap: number;
  };
}
```

### 2. Component Structure

```
src/app/sankey-experimental/
├── page.tsx                          # Main builder page
├── components/
│   ├── BuilderCanvas.tsx            # Main SVG canvas
│   ├── BuilderToolbar.tsx           # Top toolbar (mode, save, load)
│   ├── NodePalette.tsx              # Left panel - add nodes
│   ├── StylePanel.tsx               # Right panel - style selected item
│   ├── ConnectionDrawer.tsx         # Handle connection drawing
│   └── PreviewMode.tsx              # Read-only preview
└── hooks/
    ├── useBuilderState.tsx          # Manage nodes/links state
    ├── useConnectionDrawing.tsx     # Handle connection UX
    └── useAnimatedDashes.tsx        # Animated flow effect

lib/
├── d3-sankey-circular.ts            # Port reference code
├── builderLayoutEngine.ts           # Calculate positions
└── builderAnimations.ts             # Animated dashes
```

### 3. State Management

```typescript
// Main Builder State
const [mode, setMode] = useState<'edit' | 'preview'>('edit');
const [nodes, setNodes] = useState<BuilderNode[]>([]);
const [links, setLinks] = useState<BuilderLink[]>([]);
const [selectedItem, setSelectedItem] = useState<{type: 'node' | 'link', id: string} | null>(null);
const [isDrawingConnection, setIsDrawingConnection] = useState(false);
const [connectionStart, setConnectionStart] = useState<string | null>(null);
```

### 4. User Interactions

#### Adding Nodes
1. Click "Add Node" button
2. Node appears at center of canvas
3. User drags to position
4. Click node to select and style

#### Creating Connections
1. Click "Connect" button or press 'C'
2. Click source node (highlight)
3. Click target node
4. Link created with default style
5. Click link to style

#### Styling
- **Nodes**: Color picker, size slider, label text input
- **Links**: Color picker, thickness slider (value), label

#### Deleting
- Select item
- Press Delete key or click trash icon

---

## Implementation Plan

### Step 1: Setup Builder Infrastructure
- [ ] Create builder state management
- [ ] Add mode toggle (Edit/Preview)
- [ ] Create blank canvas component

### Step 2: Node Management
- [ ] Add node creation UI
- [ ] Implement node positioning (drag)
- [ ] Add node selection
- [ ] Create node styling panel
- [ ] Implement node deletion

### Step 3: Link Management
- [ ] Create connection drawing interface
- [ ] Implement link creation flow
- [ ] Add link selection
- [ ] Create link styling panel
- [ ] Implement link deletion

### Step 4: d3-sankey-circular Integration
- [ ] Port d3-sankey-circular.js to TypeScript
- [ ] Integrate with builder data model
- [ ] Auto-calculate node depths
- [ ] Generate circular paths
- [ ] Handle layout updates

### Step 5: Animations
- [ ] Implement animated dashes on links
- [ ] Add start/stop controls
- [ ] Configure animation speed
- [ ] Add arrow heads

### Step 6: Data Management
- [ ] Implement save/export JSON
- [ ] Implement load/import JSON
- [ ] Add validation
- [ ] Create example templates

### Step 7: Polish
- [ ] Add tooltips
- [ ] Add undo/redo
- [ ] Improve UX feedback
- [ ] Add keyboard shortcuts
- [ ] Test with biochar diagram

---

## Reference Code Integration

### From d3-sankey-circular.js

**Key Functions to Port:**
1. `sankey()` - Main layout engine
2. `identifyCircles()` - Detect circular links
3. `computeNodeDepths()` - Calculate node positions
4. `addCircularPathData()` - Generate curved paths
5. `createCircularPathString()` - SVG path generation

**Animated Dashes Implementation:**
```typescript
// From reference code
function useAnimatedDashes(svgRef: RefObject<SVGSVGElement>) {
  useEffect(() => {
    if (!svgRef.current) return;
    
    const duration = 5;
    const maxOffset = 10;
    let percentageOffset = 1;

    const interval = setInterval(() => {
      d3.selectAll('.flow-path')
        .style('stroke-dasharray', '10,10')
        .style('stroke-dashoffset', percentageOffset * maxOffset);
      
      percentageOffset = percentageOffset === 0 ? 1 : percentageOffset - 0.01;
    }, duration);

    return () => clearInterval(interval);
  }, [svgRef]);
}
```

**Arrow Heads:**
- Use `appendArrows()` function from reference
- Add arrow markers to SVG defs
- Apply to paths

---

## UI/UX Design

### Layout
```
┌─────────────────────────────────────────────────────┐
│ [🏗️ Builder] [💾 Save] [📁 Load] [▶️ Preview]      │ Toolbar
├──────┬────────────────────────────────────┬─────────┤
│ Add  │                                    │ Style   │
│ Node │         Canvas                     │ Panel   │
│      │                                    │         │
│ 🔵   │   ┌─────┐         ┌─────┐         │ Color:  │
│ Node │   │Node1│────────▶│Node2│         │ [    ]  │
│      │   └─────┘         └─────┘         │         │
│ 🔗   │       │              │             │ Width:  │
│ Link │       └──────────────┘             │ [====]  │
│      │                                    │         │
│ 🗑️   │                                    │ Label:  │
│Delete│                                    │ [     ] │
└──────┴────────────────────────────────────┴─────────┘
```

### Keyboard Shortcuts
- `N` - Add Node
- `C` - Start Connection
- `Del` - Delete Selected
- `Esc` - Cancel Action
- `Space` - Toggle Preview
- `Ctrl+S` - Save
- `Ctrl+O` - Load

---

## Example Templates

### Biochar Flow Template
Pre-configured with:
- 5 component nodes
- Input/output nodes
- Material flow types
- Color scheme

### Financial Flow Template
- Revenue sources
- Cost centers
- Profit destinations

### Business Process Template
- Process steps
- Decision points
- Outcomes

---

## Next Steps

1. **Review and approve this architecture**
2. **Start with Step 1** (Builder Infrastructure)
3. **Iterative development** - each step builds on previous
4. **Test frequently** with real use cases
5. **Gather feedback** and refine

Would you like me to proceed with implementation, or would you like to discuss any changes to this architecture?