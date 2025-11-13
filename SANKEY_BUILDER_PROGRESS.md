# Sankey Flow Builder - Development Progress

**Last Updated:** November 8, 2024  
**Status:** Core MVP Complete with Animation Features

---

## 🎯 Current State

The Sankey Flow Builder is a fully functional visual editor for creating custom flow diagrams with circular/reverse connections and animated flow visualization.

**Access:** http://localhost:3000/sankey-experimental

---

## ✅ Completed Features

### Core Functionality
- [x] Visual node creation and placement
- [x] Drag-and-drop node repositioning (React event handlers)
- [x] Two-click connection workflow (source → target)
- [x] Forward connections (simple curves)
- [x] Reverse/circular connections (looping arcs)
- [x] Staggered paths to prevent overlap (60px offset per link)
- [x] Node and link selection system
- [x] Delete functionality (nodes and links)
- [x] Edit/Preview mode toggle
- [x] Save/Load diagrams as JSON
- [x] Clear canvas functionality

### Styling Controls
- [x] Node properties: Name, color (10 presets + custom), width, height, X/Y position
- [x] Link properties: Label, color, thickness (1-50)
- [x] Color picker with preset palette
- [x] Visual feedback for selected items

### Advanced Features
- [x] **Path-following labels** using SVG `<textPath>`
- [x] **Label orientation fix** for reverse connections (positioned at 15% vs 50%)
- [x] **Animated flow dots** using SVG `<animateMotion>`
- [x] **Animation controls:**
  - Speed: 1-10 (how fast dots travel)
  - Flow Rate: 1-20 (how many dots/frequency)
  - Dot Size: 2-10px (visual size)

### UI Components
- [x] Purple/pink gradient toolbar
- [x] Left sidebar (Node Palette) with Add Node, Connect buttons, shortcuts
- [x] Right sidebar (Style Panel) with comprehensive controls
- [x] Canvas with grid background
- [x] Keyboard shortcuts (N, C, Del, Esc, Ctrl+S)

---

## 📂 Key Files

### Type Definitions
- **`types/builder.ts`**: Data models for BuilderNode, BuilderLink with animation properties

### State Management
- **`hooks/useBuilderState.tsx`**: Complete state logic for nodes, links, selection, connection mode

### Components
- **`components/builder/BuilderToolbar.tsx`**: Top toolbar with mode toggle and actions
- **`components/builder/NodePalette.tsx`**: Left sidebar for adding nodes and connections
- **`components/builder/StylePanel.tsx`**: Right sidebar for styling selected items
- **`components/builder/BuilderCanvas.tsx`**: Main SVG canvas with:
  - Path generation (forward and circular)
  - Drag handlers (lines 58-94)
  - Animated dots (lines 275-298)
  - Label rendering with textPath

### Integration
- **`src/app/sankey-experimental/page.tsx`**: Main page integrating all components

---

## 🔧 Technical Implementation Details

### Drag Functionality (Fixed)
**Problem:** D3 drag behavior conflicted with React  
**Solution:** Replaced with React event handlers
- `onMouseDown`: Capture node and offset
- Window `mousemove`: Calculate SVG coordinates
- Window `mouseup`: End drag
- Coordinates constrained to bounds (40-960, 40-1060)

### Connection Workflow
**Mode-based system:**
1. Click "Connect" button → enables connection mode
2. Click source node → stores source ID
3. Click target node → creates link
4. Click same node or Esc → cancels

### Circular Paths (Reverse Connections)
**Condition:** `targetX < sourceX`  
**Path routing:** Down → Left → Up → Right into target  
**Staggering:** `linkIndex * 60` offset prevents overlap

### Animated Dots
**Technology:** SVG `<animateMotion>` with `<mpath>`  
**Parameters:**
- Duration: `(11 - animationRate) * 2` seconds
- Delay: Evenly distributed based on frequency
- Follows exact path including circular arcs

### Label Positioning
**Forward connections:** 50% along path (center)  
**Reverse connections:** 15% along path (readable vertical segment)  
**Technique:** SVG `<textPath>` with white stroke outline

---

## 🚀 Next Steps (Pending)

### High Priority
1. **Add tooltips on hover** for nodes/links
   - Show node name, connections
   - Show link flow value, label
   - Position dynamically

2. **Test with biochar data**
   - Load existing flow diagram data
   - Verify all connections render correctly
   - Ensure labels are appropriate

### Medium Priority
3. **Undo/Redo functionality**
   - State history management
   - Keyboard shortcuts (Ctrl+Z, Ctrl+Y)
   - History limit (e.g., 50 actions)

4. **Export options**
   - Export as PNG/SVG image
   - Export to different data formats
   - Print-friendly view

### Low Priority
5. **Additional features from architecture:**
   - Node grouping/containers
   - Link bundling for multiple connections
   - Zoom and pan controls
   - Mini-map overview
   - Grid snap toggle
   - Alignment guides

---

## 🐛 Known Issues

None currently reported.

---

## 📝 Development Notes

### Animation Performance
- SVG `animateMotion` is hardware-accelerated
- Performance remains smooth with 20+ animated dots per link
- No frame drops observed in testing

### Browser Compatibility
- Tested in Chrome (primary)
- SVG features widely supported
- Consider testing in Firefox, Safari

### Data Persistence
- JSON format is lightweight and human-readable
- Consider adding versioning for future schema changes
- Auto-save to localStorage as backup option

---

## 🎨 Design Decisions

### Why React event handlers over D3 drag?
- Better integration with React's component lifecycle
- Avoids event system conflicts
- More predictable state updates
- Easier to debug

### Why textPath for labels?
- Follows path curves perfectly
- Automatic positioning and rotation
- Native SVG feature (no calculations needed)
- Better performance than manual text positioning

### Why animateMotion for dots?
- Hardware-accelerated animation
- Precise path following (including complex arcs)
- Easy to control with standard SVG attributes
- No JavaScript animation loop needed

---

## 🔄 How to Continue Work

1. **Run the development server:**
   ```bash
   npm run dev
   ```

2. **Access the builder:**
   Navigate to http://localhost:3000/sankey-experimental

3. **Pick up where we left off:**
   - Review pending tasks above
   - Check `types/builder.ts` for data model
   - Main logic in `hooks/useBuilderState.tsx`
   - Canvas rendering in `components/builder/BuilderCanvas.tsx`

4. **Testing changes:**
   - Create nodes with "Add Node" button
   - Connect nodes with "Connect" button → click source → click target
   - Select links to adjust animation settings
   - Test forward and reverse connections
   - Verify labels display correctly
   - Watch animated dots flow through paths

---

## 📚 References

- **SVG Animation:** [MDN - animateMotion](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animateMotion)
- **Text on Path:** [MDN - textPath](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/textPath)
- **React Events:** [React - Handling Events](https://react.dev/learn/responding-to-events)

---

## 💡 Ideas for Future Enhancements

1. **Templates:** Pre-built diagram templates (supply chain, energy flow, etc.)
2. **Smart routing:** Automatic path optimization to minimize crossings
3. **Icons on nodes:** Custom icons or images
4. **Node tooltips:** Rich hover information
5. **Link curves:** Adjustable curve intensity
6. **Animation presets:** One-click animation styles
7. **Themes:** Dark mode, color schemes
8. **Collaboration:** Multi-user editing (real-time)
9. **Version control:** Track diagram changes over time
10. **Integration:** Import from other formats (CSV, JSON schemas)

---

**End of Progress Report**