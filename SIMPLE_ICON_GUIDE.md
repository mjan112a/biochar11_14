# ✨ Super Simple Icon Guide

## 🎯 Adding New Icons (2 Easy Steps!)

### Step 1: Drop Your Icon File
Copy your SVG file to this folder:
```
public/images/iconslibrary/
```

**That's it!** Your icon will automatically appear in the builder tool! 🎉

### Step 2: Test It
1. Open the Sankey Builder: `http://localhost:3000/sankey-experimental`
2. Click on a node
3. Click the "Choose Icon" button
4. Your new icon will be there!

---

## 📝 File Naming Tips

**Good names:**
- `solar-panel-01.svg`
- `wind-turbine-01.svg`  
- `water-pump-01.svg`

**Icon names are auto-generated from filenames:**
- `solar-panel-01.svg` → "Solar Panel"
- `wind-turbine-01.svg` → "Wind Turbine"
- `water-pump-01.svg` → "Water Pump"

---

## 🔍 How It Works

The system **automatically discovers** all SVG files in `public/images/iconslibrary/`:
- No JSON editing required
- No registration needed
- No categories to worry about
- Just drop and go!

### Auto-Discovery Features
✅ **Auto-naming:** Converts filenames to readable names  
✅ **Auto-keywords:** Generates search terms from filename  
✅ **Auto-sorting:** Sorts icons alphabetically  
✅ **Auto-search:** Makes all icons searchable immediately  

---

## 📂 Current Setup

### Icon Directory Structure
```
public/
  └── images/
      └── iconslibrary/
          ├── anaerobic-digester-01.svg
          ├── biochar-01.svg
          ├── chicken-house-01.svg
          ├── pyrolysis-unit-01.svg
          └── [YOUR NEW ICONS HERE!]
```

### Auto-Discovery API
The system uses a built-in API that scans the folder:
- **Endpoint:** `/api/icons/discover`
- **Runs:** When icon picker opens
- **Returns:** All available icons

---

## 🎨 Icon Guidelines

### Recommended Specs
- **Format:** SVG (required)
- **Size:** 100x100px or similar square
- **Style:** Simple, clean, recognizable at small sizes
- **Colors:** Any (will work with the tool's theme)

### SVG Requirements
- Must be valid SVG format
- Should include proper `viewBox` attribute
- No external dependencies (embedded fonts, linked images)
- Optimized file size (use SVGOMG if needed)

---

## 🔧 Troubleshooting

### Icon not showing up?

**1. Check file location:**
```
✅ Correct: public/images/iconslibrary/my-icon.svg
❌ Wrong:   data/iconslibrary/my-icon.svg
```

**2. Check file format:**
- Must be `.svg` file
- Open in text editor - should start with `<svg`

**3. Refresh the page:**
- Hard refresh: `Ctrl + F5` (Windows/Linux) or `Cmd + Shift + R` (Mac)

**4. Check browser console:**
- Press F12 to open developer tools
- Look for any error messages

---

## 💡 Pro Tips

### Multiple Versions
Create variations of the same icon:
- `solar-panel-01.svg` (basic)
- `solar-panel-02.svg` (detailed)
- `solar-panel-03.svg` (simplified)

### Batch Import
Drop multiple files at once - they'll all be discovered automatically!

### Testing
View any icon directly in browser:
```
http://localhost:3000/images/iconslibrary/your-icon.svg
```

---

## 📊 Current Icons

As of this update, the system automatically discovers **21 built-in icons** covering:
- Processing equipment (digesters, pyrolysis units, etc.)
- Energy outputs (biomethane, syngas, biofuels)
- Material inputs (litter, chickens, FOG)
- Final products (biochar, meat, crops, digestate)

Add yours to expand the library!

---

## 🚀 Advanced: API Testing

Want to see what icons are currently available?

Visit: `http://localhost:3000/api/icons/discover`

You'll get a JSON response like:
```json
{
  "success": true,
  "count": 21,
  "icons": [
    {
      "name": "Anaerobic Digester",
      "file": "anaerobic-digester-01.svg",
      "path": "/images/iconslibrary/anaerobic-digester-01.svg",
      "keywords": ["anaerobic", "digester", ...]
    },
    ...
  ]
}
```

---

## ❓ FAQ

**Q: Do I need to restart the server after adding icons?**  
A: No! Just refresh your browser.

**Q: Can I organize icons into folders?**  
A: Not yet. Currently all icons must be in the main `iconslibrary/` folder.

**Q: What if I want categories?**  
A: The search function works really well! Just type what you're looking for.

**Q: Can I delete icons?**  
A: Yes, just delete the SVG file from the folder. It will stop appearing after a page refresh.

**Q: What about PNG or JPG images?**  
A: Only SVG format is supported. Convert your images to SVG first.

---

## 🎉 That's It!

No configuration files.  
No JSON editing.  
No complex setup.

**Just drop SVG files and they magically appear! ✨**

---

**Need help?** Check the browser console (F12) for any error messages.