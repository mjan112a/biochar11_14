# Sankey Flow Builder - Theming & Customization Architecture

**Purpose:** Design a comprehensive theming system to customize Sankey diagrams with custom SVG assets, icons, and styling - creating a "CSS for Sankey" approach.

---

## 🎯 Design Goals

1. **Separation of Structure & Style**: Keep diagram structure (nodes, connections) separate from visual styling
2. **Reusability**: Create themes that can be applied to multiple diagrams
3. **Asset Management**: Centralized library for custom SVG icons and animations
4. **Flexibility**: Support both global defaults and per-item overrides
5. **Portability**: Export themes as standalone JSON files
6. **User-Friendly**: In-app visual editor + spreadsheet export option

---

## 📐 Proposed Architecture

### **Approach: Hybrid System (In-App + Export)**

Combine the best of both worlds:
- **Primary workflow**: In-app theme editor (real-time preview)
- **Alternative workflow**: Export to Excel/CSV for bulk editing
- **Asset workflow**: Upload custom SVGs to library or use existing icons

---

## 🗂️ Data Structure

### 1. Extended Builder Types

```typescript
// types/builder-theme.ts

export interface ThemeAsset {
  id: string;
  name: string;
  type: 'node-icon' | 'flow-particle' | 'connector-icon';
  path: string;  // URL or data URI
  svgContent?: string;  // Embedded SVG for custom uploads
  category?: string;  // e.g., 'energy', 'material', 'component'
  tags?: string[];
}

export interface NodeThemeStyle {
  // Visual appearance
  shape: 'rectangle' | 'rounded-rect' | 'circle' | 'hexagon' | 'custom-svg';
  icon?: string;  // Asset ID or path
  iconPosition: 'above' | 'inside' | 'left' | 'right';
  iconSize: number;
  
  // Colors & effects
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  gradient?: {
    type: 'linear' | 'radial';
    stops: Array<{ offset: number; color: string }>;
  };
  shadow?: {
    blur: number;
    offset: { x: number; y: number };
    color: string;
  };
  
  // Typography
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  textColor: string;
  textPosition: 'center' | 'top' | 'bottom';
}

export interface LinkThemeStyle {
  // Path styling
  color: string;
  thickness: number;
  curvature: number;  // 0-1, affects bezier curve intensity
  dashed?: {
    enabled: boolean;
    pattern: number[];  // e.g., [5, 3] for SVG dash pattern
  };
  
  // Label styling
  labelIcon?: string;  // Asset ID or path
  labelIconPosition: 'above' | 'inline' | 'none';
  labelFontSize: number;
  labelColor: string;
  labelBackground?: string;
  labelPadding: number;
  
  // Animation styling
  particleAsset?: string;  // Asset ID for custom flow particle
  particleSize: number;
  particleOpacity: number;
  particleSpeed: number;
  particleFrequency: number;
}

export interface DiagramTheme {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  created: string;
  modified: string;
  
  // Global defaults
  defaults: {
    node: NodeThemeStyle;
    link: LinkThemeStyle;
    canvas: {
      backgroundColor: string;
      gridEnabled: boolean;
      gridColor: string;
      gridSize: number;
    };
  };
  
  // Per-item overrides (optional)
  nodeStyles: Record<string, Partial<NodeThemeStyle>>;  // nodeId -> style
  linkStyles: Record<string, Partial<LinkThemeStyle>>;  // linkId -> style
  
  // Asset library reference
  assets: ThemeAsset[];
  
  // Type-based styling (alternative to per-item)
  nodeTypes?: Record<string, Partial<NodeThemeStyle>>;  // type -> style
  linkTypes?: Record<string, Partial<LinkThemeStyle>>;  // type -> style
}

export interface StyledBuilderNode extends BuilderNode {
  type?: string;  // e.g., 'input', 'process', 'output'
  styleOverride?: Partial<NodeThemeStyle>;
}

export interface StyledBuilderLink extends BuilderLink {
  type?: string;  // e.g., 'material-flow', 'energy-flow', 'waste'
  styleOverride?: Partial<LinkThemeStyle>;
}
```

---

## 🎨 Theme Application Logic

### Theme Resolution Order (CSS-like cascade):

1. **Base defaults** from theme
2. **Type-based styles** (if node/link has a type)
3. **Per-item overrides** (if specific nodeId/linkId has style)
4. **Inline style overrides** (if node/link has styleOverride)

```typescript
function resolveNodeStyle(
  node: StyledBuilderNode, 
  theme: DiagramTheme
): NodeThemeStyle {
  return {
    ...theme.defaults.node,
    ...(node.type ? theme.nodeTypes?.[node.type] : {}),
    ...(theme.nodeStyles[node.id] || {}),
    ...(node.styleOverride || {})
  };
}
```

---

## 🛠️ Implementation Components

### 1. **Asset Library Manager**

**Location:** `components/builder/AssetLibrary.tsx`

**Features:**
- Upload custom SVG files
- Browse existing icon library (from `/images/system-icons/`)
- Preview assets
- Tag/categorize assets
- Search and filter
- Delete/rename custom assets

**Storage:**
- Store custom assets in browser localStorage or IndexedDB
- Option to export assets with theme as data URIs
- Reference built-in assets by path

### 2. **Theme Editor Panel**

**Location:** `components/builder/ThemeEditor.tsx`

**Tabs:**
- **Global Defaults**: Set default styles for all nodes/links
- **Node Types**: Define styles for node categories (input, process, output)
- **Link Types**: Define styles for link categories (material, energy, waste)
- **Assets**: Manage custom SVG library
- **Canvas**: Background, grid, global settings

**Interface:**
```
┌─────────────────────────────────────┐
│ Theme Editor                    [×] │
├─────────────────────────────────────┤
│ [Global] [Types] [Assets] [Canvas] │
├─────────────────────────────────────┤
│                                     │
│  Node Appearance                    │
│  ┌─────┐ Shape: [Rectangle ▼]      │
│  │ ⭐  │ Icon: [Browse...] [Clear]  │
│  └─────┘ Position: [Above ▼]       │
│          Size: [32px ━━━━●]        │
│                                     │
│  Colors                             │
│  Fill: [██████] #4a90e2            │
│  Stroke: [██████] #2c5aa0          │
│  Width: [2px ━━●━━━]               │
│                                     │
│  ⚡ Apply to selected               │
│  📋 Copy style                      │
│  ↻  Reset to default                │
└─────────────────────────────────────┘
```

### 3. **Enhanced Style Panel**

**Location:** Update `components/builder/StylePanel.tsx`

**New sections:**
- **Theme**: Dropdown to select active theme
- **Type Assignment**: Assign type to selected node/link
- **Style Override**: Toggle between theme style vs custom override
- **Quick Asset Picker**: Choose icon from library

### 4. **Theme Import/Export**

**Location:** `lib/themeManager.ts`

**Functions:**
```typescript
export function exportTheme(theme: DiagramTheme): string
export function importTheme(json: string): DiagramTheme
export function exportThemeAsSpreadsheet(theme: DiagramTheme, diagram: DiagramData): Blob
export function importThemeFromSpreadsheet(file: File): Promise<DiagramTheme>
export function mergeThemes(base: DiagramTheme, override: DiagramTheme): DiagramTheme
```

### 5. **Spreadsheet Export Format**

**Excel/CSV Structure:**

**Sheet 1: Diagram Structure**
| Node ID | Node Name | Node Type | X | Y | Source Links | Target Links |
|---------|-----------|-----------|---|---|--------------|--------------|
| node-1  | Input     | input     | 100 | 200 | link-1 | - |
| node-2  | Process   | process   | 400 | 200 | link-2 | link-1 |

**Sheet 2: Node Styles**
| Node ID | Node Name | Icon Path | Icon Position | Fill Color | Stroke Color | Font Size |
|---------|-----------|-----------|---------------|------------|--------------|-----------|
| node-1  | Input     | /icons/input.svg | above | #4a90e2 | #2c5aa0 | 14 |

**Sheet 3: Link Styles**
| Link ID | Label | Source | Target | Color | Thickness | Particle Asset | Speed | Frequency |
|---------|-------|--------|--------|-------|-----------|----------------|-------|-----------|
| link-1  | Flow  | node-1 | node-2 | #52c41a | 5 | /icons/dot.svg | 5 | 3 |

**Sheet 4: Theme Assets**
| Asset ID | Asset Name | Type | Path/Data URI |
|----------|------------|------|---------------|
| asset-1  | Energy Icon | node-icon | data:image/svg+xml;base64,... |

**Sheet 5: Global Defaults**
| Setting | Value |
|---------|-------|
| Default Node Fill | #4a90e2 |
| Default Link Color | #52c41a |
| Canvas Background | #f5f5f5 |

---

## 🔄 Workflows

### **Workflow 1: In-App Theme Creation**

1. Create/edit diagram structure in Builder
2. Open Theme Editor
3. Set global defaults (colors, sizes, fonts)
4. Upload custom SVGs to Asset Library
5. Define node types (input, process, output) with different styles
6. Define link types (material, energy, waste) with different colors
7. Assign types to nodes/links OR apply per-item styles
8. Preview in real-time
9. Save theme to library
10. Export theme as JSON for reuse

### **Workflow 2: Spreadsheet Customization**

1. Create diagram structure in Builder
2. Export → "Export Theme Spreadsheet"
3. Open Excel/CSV file
4. Edit styles in spreadsheet (bulk operations easy)
5. Add asset paths or data URIs
6. Save spreadsheet
7. Import back into Builder
8. Preview and adjust
9. Save finalized diagram + theme

### **Workflow 3: Theme Library & Templates**

1. Browse pre-built themes (Energy Flow, Material Cycle, Process Map)
2. Apply theme to current diagram
3. Customize as needed
4. Save as new theme variant
5. Share themes across projects

---

## 📦 File Structure

```
types/
  builder-theme.ts          # Theme type definitions

lib/
  themeManager.ts           # Theme import/export/merge logic
  assetManager.ts           # Asset upload/storage/retrieval
  spreadsheetExporter.ts    # Excel/CSV export
  spreadsheetImporter.ts    # Excel/CSV import
  themePresets.ts           # Built-in theme templates

components/builder/
  ThemeEditor.tsx           # Main theme editor panel
  AssetLibrary.tsx          # Asset management interface
  AssetPicker.tsx           # Quick asset selection component
  ThemeSelector.tsx         # Theme dropdown/switcher
  TypeAssigner.tsx          # Assign types to nodes/links
  StylePanel.tsx            # Enhanced with theme support

data/themes/
  default-theme.json
  energy-flow-theme.json
  material-cycle-theme.json
  process-map-theme.json
```

---

## 🎯 Implementation Phases

### **Phase 1: Core Theme System**
- [ ] Define theme data structures
- [ ] Create basic theme editor UI
- [ ] Implement theme application logic
- [ ] Add theme selector to toolbar
- [ ] Create 2-3 example themes

### **Phase 2: Asset Management**
- [ ] Build asset library component
- [ ] Implement SVG upload
- [ ] Connect to existing icon library
- [ ] Add asset picker to style panel
- [ ] Support custom particle animations

### **Phase 3: Advanced Styling**
- [ ] Add node shape options (not just rectangles)
- [ ] Implement gradients and shadows
- [ ] Add icon positioning options
- [ ] Support custom SVG shapes for nodes

### **Phase 4: Spreadsheet Export/Import**
- [ ] Build spreadsheet exporter
- [ ] Build spreadsheet importer
- [ ] Add validation and error handling
- [ ] Create user documentation

### **Phase 5: Theme Library**
- [ ] Create theme preset system
- [ ] Build theme template gallery
- [ ] Add theme sharing (export/import)
- [ ] Implement theme versioning

---

## 🎨 Example Theme: Biochar Energy Flow

```json
{
  "id": "biochar-energy-theme",
  "name": "Biochar Energy Flow",
  "version": "1.0.0",
  "description": "Theme for biochar energy system diagrams",
  "defaults": {
    "node": {
      "shape": "rounded-rect",
      "iconPosition": "above",
      "iconSize": 48,
      "fillColor": "#ffffff",
      "strokeColor": "#334155",
      "strokeWidth": 2,
      "fontSize": 14,
      "fontFamily": "Inter, sans-serif",
      "textColor": "#1e293b"
    },
    "link": {
      "color": "#64748b",
      "thickness": 4,
      "curvature": 0.5,
      "labelIconPosition": "above",
      "labelFontSize": 11,
      "labelColor": "#475569",
      "particleSize": 4,
      "particleOpacity": 0.8,
      "particleSpeed": 5,
      "particleFrequency": 3
    },
    "canvas": {
      "backgroundColor": "#f8fafc",
      "gridEnabled": true,
      "gridColor": "#e2e8f0",
      "gridSize": 20
    }
  },
  "nodeTypes": {
    "input": {
      "fillColor": "#dbeafe",
      "strokeColor": "#3b82f6",
      "icon": "/images/system-icons/inputs/fresh-pine-shavings.png"
    },
    "process": {
      "fillColor": "#fef3c7",
      "strokeColor": "#f59e0b",
      "icon": "/images/system-icons/components/pyrolysis-unit.png"
    },
    "output": {
      "fillColor": "#dcfce7",
      "strokeColor": "#22c55e",
      "icon": "/images/system-icons/outputs/biochar.svg"
    }
  },
  "linkTypes": {
    "material-flow": {
      "color": "#8b5cf6",
      "particleAsset": "/images/flow-icons/litter.svg"
    },
    "energy-flow": {
      "color": "#f59e0b",
      "particleAsset": "/images/flow-icons/syngas.svg",
      "dashed": { "enabled": true, "pattern": [5, 3] }
    },
    "waste-flow": {
      "color": "#ef4444",
      "particleAsset": "/images/flow-icons/waste.svg"
    }
  },
  "assets": [
    {
      "id": "custom-particle-1",
      "name": "Biochar Particle",
      "type": "flow-particle",
      "path": "/custom-assets/biochar-particle.svg"
    }
  ]
}
```

---

## 💡 Recommendations

### **Recommended Approach: In-App Primary, Export Secondary**

**Reasoning:**
1. **Real-time preview**: Users can see changes immediately
2. **Visual editing**: Easier than remembering syntax/structure
3. **Asset management**: Drag-and-drop SVG uploads
4. **Type safety**: UI prevents invalid configurations
5. **Spreadsheet option**: Available for power users doing bulk edits

### **Key Advantages:**

✅ **Leverages existing infrastructure**: Your icon library is extensive  
✅ **CSS-like approach**: Familiar mental model (defaults → types → overrides)  
✅ **Flexible workflows**: Both GUI and spreadsheet supported  
✅ **Portable themes**: Export/import as JSON  
✅ **Reusable**: One theme works across multiple diagrams  
✅ **Professional output**: Custom branding with company assets  

### **Future Enhancements:**

- **Theme marketplace**: Share themes with community
- **AI-assisted theming**: "Create a theme for energy diagrams"
- **Animation presets**: Pre-built particle animations
- **Responsive themes**: Different styles for different zoom levels
- **Accessibility themes**: High contrast, colorblind-friendly

---

## 📊 Comparison: In-App vs Spreadsheet

| Feature | In-App Editor | Spreadsheet Export |
|---------|--------------|-------------------|
| **Real-time preview** | ✅ Yes | ❌ No (must re-import) |
| **Visual asset picking** | ✅ Easy drag-drop | ⚠️ Manual paths |
| **Bulk editing** | ⚠️ One-by-one | ✅ Easy multi-row |
| **Learning curve** | ✅ Low (visual) | ⚠️ Medium (syntax) |
| **Type safety** | ✅ Built-in validation | ⚠️ Manual checking |
| **Version control** | ⚠️ Requires export | ✅ Easy with Git |
| **Collaboration** | ⚠️ Requires sharing JSON | ✅ Share spreadsheet |
| **Advanced users** | ⚠️ May feel limited | ✅ Full control |

**Conclusion**: Use in-app as primary workflow, offer spreadsheet export for specific use cases (bulk operations, version control, collaboration with non-designers).

---

## 🚀 Next Steps

1. Review this architecture document
2. Approve overall approach
3. Prioritize implementation phases
4. Start with Phase 1 (Core Theme System)
5. Create proof-of-concept with one example theme

Would you like me to proceed with implementing Phase 1?