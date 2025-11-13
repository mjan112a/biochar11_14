# How to Add New Icons to the Builder Tool

## 🎯 Quick Summary

To add new icons, you need to do **TWO things**:
1. **Copy the icon file** to `public/images/iconslibrary/`
2. **Register it** in `public/data/icons-registry.json`

---

## ❌ Common Mistake

**DON'T** put icons in `data/iconslibrary/` - that folder is not used by the system!

The browser can only access files in the `public/` directory.

---

## ✅ Step-by-Step Instructions

### Step 1: Add Icon File

**Copy your SVG file to:**
```
public/images/iconslibrary/your-icon-name.svg
```

**Naming Convention:**
- Use lowercase
- Separate words with hyphens
- End with `-01.svg` (or increment for variations)
- Example: `solar-panel-01.svg`, `wind-turbine-01.svg`

### Step 2: Register Icon in JSON

**Edit:** `public/data/icons-registry.json`

**Add your icon to the appropriate category:**

```json
{
  "name": "Your Icon Name",
  "file": "your-icon-name-01.svg",
  "keywords": "keyword1, keyword2, keyword3",
  "tooltip": "your-icon-name-01"
}
```

#### Field Descriptions:
- **name:** Display name shown in the icon picker
- **file:** Exact filename (must match the file in `public/images/iconslibrary/`)
- **keywords:** Comma-separated search terms
- **tooltip:** (Optional) Reference to tooltip data in `icon-tooltips.json`

---

## 📂 Available Categories

Choose the best category for your icon:

### 1. Components (🏭)
Processing equipment, facilities, structures
- Chicken House
- Processing Plant
- Anaerobic Digester
- Pyrolysis Unit
- Farm Waterways

### 2. Energy (⚡)
Energy products, power, electricity
- Bio-Methane
- Syngas Energy
- Renewable Biofuels

### 3. Inputs (📥)
Raw materials, feedstock
- Live Chickens
- Dead Chickens
- Used Poultry Litter
- Litter with Char
- FOG (Fats, Oils, Greases)

### 4. Outputs (📤)
Final products, marketable goods
- Biochar
- Chicken Meat
- Crops/Corn
- Bio-Oils
- Wood Vinegars
- Water

### 5. Digestate (♻️)
Anaerobic digester outputs
- Digestate Liquids
- Digestate Solids

---

## 📝 Complete Example

Let's add a "Solar Panel" icon:

### 1. Copy File
```
Source: C:\Users\myers\Downloads\solar-panel.svg
Destination: C:\Users\myers\githuprepo\Biochar2\poultry-biochar-tool\public\images\iconslibrary\solar-panel-01.svg
```

### 2. Edit icons-registry.json

Find the **Energy** category and add:

```json
{
  "name": "Energy",
  "icon": "⚡",
  "icons": [
    {
      "name": "Bio-Methane",
      "file": "bio-methane-01.svg",
      "keywords": "bio, methane, biogas, gas, energy",
      "tooltip": "bio-methane-01"
    },
    {
      "name": "Syngas Energy",
      "file": "syngas-energy-01.svg",
      "keywords": "syngas, energy, power, electricity"
    },
    {
      "name": "Renewable Biofuels",
      "file": "renewable-biofuels-01.svg",
      "keywords": "renewable, biofuels, fuel, oil, diesel"
    },
    {
      "name": "Solar Panel",
      "file": "solar-panel-01.svg",
      "keywords": "solar, panel, sun, renewable, energy, electricity",
      "tooltip": "solar-panel-01"
    }
  ]
}
```

### 3. Refresh the Builder

Reload the `/sankey-experimental` page, and your new icon will appear in the Energy category!

---

## 🔍 Troubleshooting

### Icon Not Showing Up?

**Check these common issues:**

1. ✅ **File Location:** Is the SVG in `public/images/iconslibrary/`?
   ```
   NOT: data/iconslibrary/
   YES: public/images/iconslibrary/
   ```

2. ✅ **Filename Match:** Does the `file` field in JSON exactly match the actual filename?
   ```json
   "file": "solar-panel-01.svg"  // Must match filesystem exactly
   ```

3. ✅ **Valid JSON:** Did you add commas correctly?
   - Add comma after previous icon's `}`
   - NO comma after the last icon in category
   ```json
   {
     "name": "Icon 1",
     ...
   },  // ← Comma here
   {
     "name": "Icon 2",
     ...
   }   // ← NO comma after last item
   ```

4. ✅ **File Format:** Is it a valid SVG file?
   - Open in text editor - should start with `<svg`
   - No embedded images or external dependencies
   - Viewbox should be set: `viewBox="0 0 100 100"`

5. ✅ **Browser Cache:** Try hard refresh
   - Windows/Linux: `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

---

## 📊 Current Icon Inventory

**As of last update, you have:**
- Components: 5 icons
- Energy: 3 icons
- Inputs: 5 icons
- Outputs: 6 icons
- Digestate: 2 icons
- **Total: 21 icons**

---

## 🎨 Icon Design Guidelines

### Best Practices
- **Size:** 100x100px or similar square ratio
- **Style:** Simple, clean lines (Sankey diagrams are data-focused)
- **Colors:** Use semantic colors (match your system theme)
- **Viewbox:** Always include proper viewBox attribute
- **Simplification:** Icons should be recognizable at small sizes

### SVG Optimization
Use tools like [SVGOMG](https://jakearchibald.github.io/svgomg/) to:
- Remove unnecessary metadata
- Simplify paths
- Reduce file size
- Ensure browser compatibility

---

## 🚀 Quick Reference

### File Paths
```
Icon Files:     public/images/iconslibrary/*.svg
Registry:       public/data/icons-registry.json
Tooltips:       public/data/icon-tooltips.json
```

### After Adding Icons
1. Save files
2. Refresh browser (Ctrl+F5)
3. Open Icon Picker in builder
4. Search for your icon
5. Click to select and use!

---

## 💡 Pro Tips

1. **Batch Add:** You can add multiple icons at once to the JSON file
2. **Search Terms:** Add lots of keywords for easier discovery
3. **Variations:** Create multiple versions (e.g., `solar-panel-01.svg`, `solar-panel-02.svg`)
4. **Test Locally:** View icons directly in browser: `http://localhost:3000/images/iconslibrary/your-icon.svg`
5. **Categories:** Don't have a good category? Open an issue to discuss adding new ones!

---

## ❓ Need Help?

If you're still having trouble:
1. Check the browser console for errors (F12)
2. Verify the JSON is valid: [JSONLint](https://jsonlint.com/)
3. Test the SVG in isolation
4. Review this guide again carefully

**Happy icon adding! 🎨**