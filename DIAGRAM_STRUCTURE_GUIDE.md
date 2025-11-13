# Diagram Structure & Theme Workflow

## Overview

**Yes, this is absolutely possible and already built into the system!** 

The Sankey Flow Builder separates **structure** (nodes, connections, positions) from **styling** (colors, sizes, appearance). This allows you to:

1. ✅ **Load a diagram structure** → Get all nodes and connections
2. ✅ **Apply a theme** → Style everything with colors and effects
3. ✅ **Mix and match** → Same structure, different themes
4. ✅ **Save variations** → Export different styled versions

## File Types

### 1. Diagram Structure Files (`.json`)
Contains:
- **Nodes**: Positions, labels, types, IDs
- **Links**: Source, target, values, labels
- **Animation settings**: Speed, particle size
- **Metadata**: Name, description, tags

**Example**: `data/diagrams/biochar-system-structure.json`

### 2. Theme Files (`.json`)
Contains:
- **Color schemes**: Node types, link types
- **Global defaults**: Sizes, borders, shadows
- **Canvas settings**: Background, grid
- **Asset references**: Icons, images

**Example**: `data/themes/biochar-system-theme.json`

## Complete Workflow

### Step 1: Load the Diagram Structure

1. **Navigate to Builder**: Go to `/sankey-experimental`
2. **Click "📁 Load" button** in the toolbar (top-right)
3. **Select the structure file**: Choose `biochar-system-structure.json` from:
   ```
   c:\Users\myers\githuprepo\Biochar2\poultry-biochar-tool\data\diagrams\biochar-system-structure.json
   ```
4. **Diagram loads**: You'll see all 14 nodes and 15 connections appear
   - 4 Input nodes (feed, water, shavings, CO2)
   - 4 Component nodes (chicken house, processing, pyrolysis, digester)
   - 4 Output nodes (meat, biochar, digestate, water)
   - 2 Energy nodes (syngas, bio-methane)
   - All connections with animation settings

### Step 2: Apply the Biochar Theme

1. **Click theme dropdown** in toolbar (currently shows "Default")
2. **Click 🎨 button** to open theme editor
3. **Click "📁 Import"** in theme editor
4. **Select theme file**: Choose `biochar-system-theme.json` from:
   ```
   c:\Users\myers\githuprepo\Biochar2\poultry-biochar-tool\data\themes\biochar-system-theme.json
   ```
5. **Click "Apply Changes"** → All nodes get color-coded!
   - Input nodes: Blue
   - Components: Pink
   - Processes: Yellow
   - Outputs: Green
   - Energy: Light yellow
   - Waste: Red

### Step 3: Customize (Optional)

**Edit Individual Nodes**:
- Click any node to select it
- Use right sidebar to change colors
- Overrides apply to that node only

**Edit Theme Globally**:
- Open theme editor (🎨)
- Adjust colors, sizes, borders
- Changes apply to all nodes of that type

**Edit Animation**:
- Click any link to select it
- Adjust thickness, color in right sidebar
- Animation settings are part of structure

### Step 4: Save Your Work

**Save Structure Only**:
- Click "💾 Save" button → Exports diagram with current positions
- Includes animation settings
- Theme is NOT included (applied separately)

**Save Theme Separately**:
- Open theme editor (🎨)
- Click "💾 Export" → Saves theme as JSON
- Can be applied to any diagram

## What's Included in Each File

### Biochar Structure (`biochar-system-structure.json`)

**14 Nodes**:
1. Chicken Feed Input (x: 50, y: 200)
2. Water Input (x: 50, y: 300)
3. Pine Shavings Input (x: 50, y: 400)
4. CO2 Gas Input (x: 50, y: 500)
5. Chicken House (x: 250, y: 250)
6. Processing Plant (x: 450, y: 150)
7. Pyrolysis Unit (x: 450, y: 350)
8. Anaerobic Digester (x: 650, y: 250)
9. Chicken Meat Output (x: 650, y: 100)
10. Biochar Output (x: 650, y: 450)
11. Syngas Energy (x: 450, y: 500)
12. Bio-Methane Energy (x: 850, y: 250)
13. Digestate Output (x: 850, y: 350)
14. Farm Waterways (x: 850, y: 150)

**15 Links** (all animated with particles):
- Feed → House
- Water → House
- Shavings → House
- House → Processing
- Processing → Meat
- CO2 → Processing
- House Litter → Pyrolysis
- Processing Waste → Digester
- Pyrolysis → Biochar
- Pyrolysis → Syngas
- Pyrolysis → Digester (biochar addition)
- Syngas → Digester (heat)
- Digester → Bio-Methane
- Digester → Digestate
- Digester → Farm Water

**Animation Settings**:
- All links animated with flowing particles
- Speed: 1.5-3 (varies by flow type)
- Particle size: 3-5px (varies by material)

### Biochar Theme (`biochar-system-theme.json`)

**Node Type Colors**:
- Input (blue): `#dbeafe` fill, `#3b82f6` border
- Component (pink): `#fce7f3` fill, `#ec4899` border
- Process (yellow): `#fef3c7` fill, `#f59e0b` border
- Output (green): `#dcfce7` fill, `#22c55e` border
- Energy (light yellow): `#fef9c3` fill, `#eab308` border
- Waste (red): `#fee2e2` fill, `#ef4444` border

**Link Type Colors**:
- Material: `#6366f1` (indigo)
- Energy: `#f59e0b` (amber)
- Waste: `#ef4444` (red)
- Water: `#06b6d4` (cyan)

**Canvas Settings**:
- Background: `#f9fafb` (light gray)
- Grid: Enabled, 20px spacing, `#e5e7eb` color

## Use Cases

### Use Case 1: Load Complete System
1. Load `biochar-system-structure.json` → Get full diagram
2. Apply `biochar-system-theme.json` → Get color-coding
3. Result: Complete biochar system with all flows and styling

### Use Case 2: Create Variations
1. Load the structure once
2. Try different themes:
   - Material Cycle theme (circular economy look)
   - Process Flow theme (business diagram style)
   - Your custom theme
3. See which looks best

### Use Case 3: Customize and Save
1. Load structure + theme
2. Move nodes to better positions
3. Adjust colors for specific nodes
4. Save structure: `my-biochar-layout.json`
5. Export theme: `my-biochar-colors.json`

### Use Case 4: Share with Team
1. Create your diagram
2. Export structure → Share positions/connections
3. Export theme → Share color scheme
4. Team loads both files → Identical diagram

## Technical Details

### Structure File Format

```json
{
  "version": "1.0.0",
  "name": "Diagram Name",
  "nodes": [
    {
      "id": "unique-id",
      "label": "Display Name",
      "x": 100,
      "y": 200,
      "type": "input",
      "width": 120,
      "height": 80
    }
  ],
  "links": [
    {
      "id": "unique-id",
      "source": "node-id",
      "target": "node-id",
      "value": 6,
      "label": "Flow Label",
      "type": "material",
      "animated": true,
      "animationSpeed": 2,
      "particleSize": 4
    }
  ]
}
```

### Theme File Format

```json
{
  "id": "theme-id",
  "name": "Theme Name",
  "defaults": {
    "node": { "fillColor": "#fff", "strokeColor": "#333" },
    "link": { "color": "#999", "thickness": 4 },
    "canvas": { "backgroundColor": "#f9fafb" }
  },
  "nodeTypes": {
    "input": { "fillColor": "#dbeafe" }
  }
}
```

### How They Work Together

1. **Structure loads** → Creates nodes and links with IDs
2. **Theme applies** → Matches node types to colors
3. **Node type matches** → `type: "input"` gets input colors
4. **Link type matches** → `type: "material"` gets material color
5. **Overrides work** → Individual node colors override theme

## Advantages of Separation

✅ **Reusability**: Same structure, multiple themes  
✅ **Flexibility**: Change colors without redrawing  
✅ **Collaboration**: Structure person ≠ design person  
✅ **Versioning**: Track structure and style separately  
✅ **Testing**: Try different themes quickly  
✅ **Branding**: Company theme applies to all diagrams  

## Current Files Available

### Diagram Structures
- ✅ `data/diagrams/biochar-system-structure.json` - Full biochar system (NEW!)

### Themes
- ✅ `data/themes/biochar-system-theme.json` - Biochar colors (NEW!)
- ✅ Built-in: Default, Biochar Energy Flow, Material Cycle, Process Flow

## Next Steps

1. **Load the biochar structure** using the Load button
2. **Apply the biochar theme** using theme editor import
3. **Experiment**: Move nodes, adjust colors
4. **Create variations**: Try different themes
5. **Save your versions**: Export structure and theme

## FAQ

**Q: Do I need to load both files?**  
A: Yes! Structure = what/where, Theme = how it looks

**Q: Can I load structure without a theme?**  
A: Yes, it uses the default theme

**Q: Can I apply a theme to an empty canvas?**  
A: Yes, but it only affects new nodes you create

**Q: What if node types don't match?**  
A: Nodes use default styling if type isn't in theme

**Q: Can I edit after loading?**  
A: Absolutely! Load is just a starting point

**Q: Does structure save my theme?**  
A: No, themes are separate. Export both if you want to preserve everything.

## Troubleshooting

**Structure loads but colors are wrong:**
- You need to apply a theme
- Click 🎨 → Import → Select theme file

**Theme doesn't change appearance:**
- Make sure you loaded a structure first
- Click "Apply Changes" after importing theme
- Check node types match theme definitions

**Animation not working:**
- Animation is part of structure, not theme
- Check `animated: true` in structure file
- Verify `animationSpeed` and `particleSize` are set

**Particles not showing:**
- Animation must be enabled in link properties
- Check browser console for errors
- Try refreshing the page

## Support

- Structure format: `types/index.ts` (BuilderNode, BuilderLink)
- Theme format: `types/builder-theme.ts` (DiagramTheme)
- Load implementation: `hooks/useBuilderState.tsx`
- Example structures: `data/diagrams/`
- Example themes: `data/themes/`