# Sankey Theming System - Phase 1 Complete

**Date:** November 8, 2024  
**Status:** ✅ Phase 1 Core Theme System - COMPLETE

---

## 🎉 Completed in Phase 1

### 1. **Type Definitions** ✅
**File:** [`types/builder-theme.ts`](types/builder-theme.ts:1)

**Created comprehensive type system:**
- `ThemeAsset`: Custom SVG assets (node icons, flow particles, connector icons)
- `NodeThemeStyle`: Complete node styling (shape, colors, typography, effects)
- `LinkThemeStyle`: Complete link styling (colors, animations, labels)
- `CanvasStyle`: Background and grid configuration
- `DiagramTheme`: Main theme container with cascade support
- `StyledBuilderNode` & `StyledBuilderLink`: Extended node/link with theme support

**Key Features:**
- Support for multiple node shapes (rectangle, rounded-rect, circle, hexagon, custom-svg)
- Icon positioning options (above, inside, left, right, below)
- Gradients and shadows
- Dash patterns for links
- Particle animation customization
- Hover effects

### 2. **Built-in Theme Presets** ✅
**File:** [`lib/themePresets.ts`](lib/themePresets.ts:1)

**Created 4 professional themes:**

#### Default Theme
- Clean, neutral design
- Suitable for any diagram type
- Rounded rectangles with subtle shadows
- Gray color scheme

#### Biochar Energy Flow Theme
- Optimized for energy system diagrams
- Color-coded node types:
  - 🔵 Input (blue)
  - 🟡 Process (orange/yellow)
  - 🟢 Output (green)
  - 🟣 Component (purple)
  - 🔷 Storage (cyan)
- Link types for material, energy, waste, and water flows
- Animated particles with glow effects
- Dot grid pattern

#### Material Cycle Theme
- Circular economy focus
- Circular nodes
- Green color palette
- Animated dashed links
- No grid for cleaner look

#### Process Flow Theme
- Business process diagrams
- Rectangle nodes with left-aligned icons
- Minimal shadows
- Node types for start, process, decision, end
- Link types with colors (yes/no branches)

### 3. **Theme Manager** ✅
**File:** [`lib/themeManager.ts`](lib/themeManager.ts:1)

**Implemented complete theme management:**

**Core Functions:**
- `resolveNodeStyle()`: CSS-like cascade (defaults → type → per-item → inline)
- `resolveLinkStyle()`: CSS-like cascade for links
- `getAsset()` / `getAssetPath()`: Asset lookup and path resolution

**Theme Operations:**
- `createTheme()`: Create new custom theme
- `cloneTheme()`: Duplicate existing theme
- `mergeThemes()`: Combine two themes
- `exportTheme()`: Export as JSON
- `importTheme()`: Import from JSON with validation

**Theme Editing:**
- `updateThemeDefaults()`: Modify global defaults
- `setNodeTypeStyle()`: Set styling for node types
- `setLinkTypeStyle()`: Set styling for link types
- `setNodeStyle()`: Set styling for specific node
- `setLinkStyle()`: Set styling for specific link

**Asset Management:**
- `addAsset()`: Add custom SVG to theme
- `removeAsset()`: Remove asset
- `updateAsset()`: Modify asset metadata

**Storage:**
- `saveThemeToStorage()`: Save to localStorage
- `loadThemeFromStorage()`: Load from localStorage
- `getStoredThemes()`: Get all custom themes
- `deleteThemeFromStorage()`: Remove custom theme
- `getAllThemes()`: Get built-in + custom themes

**Validation:**
- `validateTheme()`: Check theme structure integrity

---

## 🎨 Theme Cascade Logic (CSS-like)

The theme system uses a 4-level cascade, similar to CSS:

```
1. Theme Defaults (theme.defaults.node or .link)
         ↓
2. Type-Based Styles (theme.nodeTypes['input'] or linkTypes['energy-flow'])
         ↓
3. Per-Item Styles (theme.nodeStyles['node-1'] or linkStyles['link-1'])
         ↓
4. Inline Overrides (node.styleOverride or link.styleOverride)
```

**Example:**
```typescript
// Theme has these settings:
defaults.node.fillColor = '#ffffff'
nodeTypes['process'].fillColor = '#fef3c7'
nodeStyles['node-5'].fillColor = '#dcfce7'

// For a node with type='process' and id='node-3':
// Result: fillColor = '#fef3c7' (from type)

// For node with type='process', id='node-5':
// Result: fillColor = '#dcfce7' (per-item overrides type)
```

---

## 📊 Data Structure Example

### Minimal Theme
```json
{
  "id": "my-theme",
  "name": "My Custom Theme",
  "version": "1.0.0",
  "defaults": {
    "node": { "shape": "rounded-rect", "fillColor": "#fff", ... },
    "link": { "color": "#64748b", "thickness": 4, ... },
    "canvas": { "backgroundColor": "#f8fafc", ... }
  },
  "nodeStyles": {},
  "linkStyles": {},
  "assets": []
}
```

### With Type-Based Styling
```json
{
  "nodeTypes": {
    "input": {
      "fillColor": "#dbeafe",
      "strokeColor": "#3b82f6",
      "icon": "/images/system-icons/inputs/fresh-pine-shavings.png"
    },
    "output": {
      "fillColor": "#dcfce7",
      "strokeColor": "#22c55e"
    }
  },
  "linkTypes": {
    "material-flow": {
      "color": "#8b5cf6",
      "thickness": 6
    },
    "energy-flow": {
      "color": "#f59e0b",
      "dashed": { "enabled": true, "pattern": [8, 4] }
    }
  }
}
```

---

## 🔄 How to Use (For Developers)

### Apply Theme to Nodes/Links

```typescript
import { resolveNodeStyle, resolveLinkStyle } from '@/lib/themeManager';
import { biocharEnergyTheme } from '@/lib/themePresets';

// Resolve style for a node
const node = {
  id: 'node-1',
  name: 'Pyrolysis Unit',
  type: 'process',  // Uses nodeTypes['process'] style
  x: 100,
  y: 100
};

const style = resolveNodeStyle(node, biocharEnergyTheme);
// style.fillColor = '#fef3c7' (from nodeTypes['process'])
// style.strokeColor = '#f59e0b'
// style.icon = '/images/system-icons/components/pyrolysis-unit.png'
```

### Create Custom Theme

```typescript
import { createTheme, setNodeTypeStyle } from '@/lib/themeManager';

let theme = createTheme('My Energy Theme', 'Custom theme for energy diagrams');

// Add node type styling
theme = setNodeTypeStyle(theme, 'solar', {
  fillColor: '#fef3c7',
  strokeColor: '#f59e0b',
  icon: '/custom/solar-panel.svg'
});

// Save to localStorage
saveThemeToStorage(theme);
```

### Load and Switch Themes

```typescript
import { getAllThemes, loadThemeFromStorage } from '@/lib/themeManager';

// Get all available themes
const allThemes = getAllThemes();

// Load specific theme
const myTheme = loadThemeFromStorage('custom-theme-12345');
```

---

## 📁 File Structure Created

```
types/
  builder-theme.ts          ✅ Type definitions (234 lines)

lib/
  themePresets.ts           ✅ 4 built-in themes (500 lines)
  themeManager.ts           ✅ Theme management (403 lines)

Total: 1,137 lines of foundational code
```

---

## 🚀 What's Next - Phase 2

**Phase 2 will add:**
- [ ] Asset Library component (upload SVGs)
- [ ] Theme selector dropdown in toolbar
- [ ] Basic theme editor panel
- [ ] Connect theme to canvas rendering
- [ ] Apply styles to nodes/links in BuilderCanvas

**Phase 3 will add:**
- [ ] Advanced shape rendering
- [ ] Gradient and shadow effects
- [ ] Custom SVG node shapes
- [ ] Icon positioning

**Phase 4 will add:**
- [ ] Spreadsheet export/import
- [ ] Theme gallery UI
- [ ] Theme sharing

---

## 💡 Key Design Decisions

### Why CSS-like Cascade?
- **Familiar**: Web developers understand defaults → overrides
- **Flexible**: Can style by type OR by specific item
- **Efficient**: Don't repeat styles for every node
- **Maintainable**: Change theme, all items update

### Why Type-Based Styling?
- **Semantic**: Nodes have meaning (input, process, output)
- **Consistent**: All "process" nodes look the same
- **Reusable**: One theme works for multiple diagrams
- **Easy to teach**: "Assign types, theme does the rest"

### Why localStorage for Custom Themes?
- **No backend needed**: Works offline
- **Fast**: Instant load
- **Private**: User's themes stay local
- **Simple**: JSON import/export for sharing

### Why Separate Asset System?
- **Flexibility**: Use built-in icons OR custom SVGs
- **Portability**: Embed assets in theme (data URIs)
- **Organization**: Tag and categorize assets
- **Reusability**: One asset used in multiple themes

---

## 🎯 Success Criteria - ACHIEVED

✅ **Theme data structure defined** - Comprehensive types with all features  
✅ **CSS-like cascade implemented** - 4-level resolution  
✅ **Built-in themes created** - 4 professional presets  
✅ **Theme manager functions** - Full CRUD operations  
✅ **Storage system** - localStorage integration  
✅ **Validation** - Structure checking  
✅ **Documentation** - Architecture doc + this summary  

---

## 📝 Notes for Implementation

### Backward Compatibility
Current nodes have: `{ id, name, x, y, color, width, height }`  
Extended nodes add: `{ type?, styleOverride? }`  
Old diagrams work without modification ✅

### Performance Considerations
- Theme resolution is O(1) with object spread
- localStorage read is synchronous but fast
- Asset paths are resolved on-demand
- No impact on drag/animation performance

### Future Enhancements
- **Theme variants**: Light/dark mode per theme
- **Animation presets**: One-click particle effects
- **AI themes**: "Create a theme for supply chain"
- **Theme marketplace**: Community sharing
- **Responsive themes**: Different styles at zoom levels

---

**Phase 1 Status:** ✅ COMPLETE  
**Ready for Phase 2:** Yes  
**Estimated Phase 2 Time:** 2-3 hours
