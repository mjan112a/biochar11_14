# Quick Start Guide - Poultry Biochar Tool

**Project**: c:/Users/myers/githuprepo/Biochar2/poultry-biochar-tool  
**Status**: ✅ Fully Operational  
**Last Updated**: November 14, 2025

---

## 🚀 Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

**Access**: http://localhost:3000

---

## 📌 What's Working

✅ **Circular Sankey diagrams** with forward and circular (U-shaped) links  
✅ **Interactive tooltips** with context-aware content (33 icons)  
✅ **Current vs Proposed toggle** on homepage  
✅ **Animated particle flows** following curved paths  
✅ **Builder tool** for creating/editing diagrams  

---

## 🔑 Key Files to Know

| File | Purpose |
|------|---------|
| [`src/app/page.tsx`](src/app/page.tsx) | Homepage with toggle |
| [`components/d3/CircularSankeyHomepage.tsx`](components/d3/CircularSankeyHomepage.tsx) | Main diagram component |
| [`public/data/icon-tooltips.json`](public/data/icon-tooltips.json) | Tooltip content (33 icons) |
| [`data/diagrams/system-overview-current.json`](data/diagrams/system-overview-current.json) | Current system diagram |
| [`data/diagrams/system-overview-proposed.json`](data/diagrams/system-overview-proposed.json) | Proposed system diagram |

---

## 🐛 Today's Fix

**Problem**: Tooltips showed problems even in proposed view  
**Solution**: Added `metadata.system` to both diagram JSON files  
**Result**: Tooltips now correctly show problems (current) vs improvements (proposed)

---

## 📝 How Tooltips Work

1. **Diagram JSON** has `"metadata": { "system": "current" }` or `"proposed"`
2. **CircularSankeyHomepage** detects this at line 78
3. **IconTooltip component** loads appropriate context from `icon-tooltips.json`
4. **Result**: Current shows ⚠️ problems, Proposed shows ✓ improvements

---

## 🎯 Next Session Starting Points

### Easy Wins
- Add boundary circles to diagrams (manual JSON edit)
- Create more diagram variations
- Adjust tooltip content for specific icons

### Medium Complexity
- Build UI controls for boundary circles
- Add export functionality (PNG/SVG)
- Mobile responsive improvements

### Advanced Features
- Drill-down to component details
- Multi-diagram comparison view
- Real-time data integration
- Animation speed controls

---

## 📚 Full Documentation

- **Complete Status**: [`PROJECT_STATUS_2025-11-14.md`](PROJECT_STATUS_2025-11-14.md)
- **Technical Architecture**: [`CIRCULAR_SANKEY_ARCHITECTURE.md`](CIRCULAR_SANKEY_ARCHITECTURE.md)
- **Boundary Circles**: [`BOUNDARY_CIRCLE_FEATURE.md`](BOUNDARY_CIRCLE_FEATURE.md)

---

## 🔄 Typical Workflow

### Viewing the System
1. `npm run dev`
2. Toggle between current/proposed
3. Hover icons for tooltips

### Editing Diagrams
1. Open JSON file in `data/diagrams/`
2. Modify nodes/links
3. Refresh browser to see changes

### Adding New Icons
1. Add SVG to `public/images/iconslibrary/`
2. Add tooltip entry to `public/data/icon-tooltips.json`
3. Reference in diagram JSON

---

## ⚡ Common Tasks

### Add a Boundary Circle (Manual)
```json
// In diagram JSON, under "config":
"boundaryCircles": [{
  "id": "boundary-1",
  "name": "System Boundary",
  "centerX": 500,
  "centerY": 550,
  "radius": 400,
  "color": "#10B981",
  "strokeDasharray": "10,5"
}]
```

### Create New Diagram
1. Copy existing JSON from `data/diagrams/`
2. Update metadata.title and metadata.system
3. Modify nodes and links as needed
4. Import into page.tsx or builder

### Update Tooltip Content
```json
// In public/data/icon-tooltips.json:
"icon-name-01": {
  "title": "Icon Name",
  "contexts": {
    "current": {
      "title": "Current System Name",
      "problems": ["Problem 1", "Problem 2"]
    },
    "proposed": {
      "title": "Proposed System Name",
      "improvements": ["Improvement 1", "Improvement 2"]
    }
  }
}
```

---

## 🎨 Visual Customization

**Node Colors**: Edit in diagram JSON  
**Link Colors**: Edit in diagram JSON  
**Particle Speed**: `animationRate` in link definition  
**Tooltip Styling**: Edit `components/ui/IconTooltip.tsx`

---

## 🆘 Troubleshooting

**Tooltips not showing context correctly?**
- Check `metadata.system` is set in diagram JSON
- Verify icon filename matches tooltip JSON key
- Check browser console for errors

**Circular links not rendering?**
- Ensure target X < source X
- Add `returnY` property to link if needed
- Check `generateLinkPath()` function

**Particles not animating?**
- Verify `animationFrequency` and `animationRate` in link
- Check path is being generated correctly
- Inspect browser performance

---

## 💡 Quick Tips

- Use **circular links** when flow goes backward (target left of source)
- Set `returnY` to control how low circular paths drop
- Multiple circular links need different `returnY` values (stagger by ~60px)
- Icons load from `/images/iconslibrary/` folder
- Tooltip keys match icon filenames (without .svg)

---

**Ready to go! System is stable and working well.** 🚀