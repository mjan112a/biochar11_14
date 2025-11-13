# Icon Library Management Guide

## 📚 Overview

The icon library uses a simple JSON configuration file that's easy to edit. No coding required!

## 🎯 Quick Start - Adding a New Icon

### Step 1: Add Your SVG File

Place your icon file here:
```
public/images/iconslibrary/your-icon-name-01.svg
```

**Naming Rules:**
- Use lowercase
- Separate words with hyphens
- End with `-01.svg`
- Example: `solar-panel-01.svg`

### Step 2: Register in JSON

Open [`public/data/icons-registry.json`](public/data/icons-registry.json) and add your icon.

**Example - Adding to "Outputs" category:**

```json
{
  "name": "Outputs",
  "icon": "📤",
  "icons": [
    {
      "name": "Biochar",
      "file": "biochar-01.svg",
      "keywords": "biochar, char, carbon, soil"
    },
    
    // ADD YOUR NEW ICON HERE:
    {
      "name": "Fertilizer",
      "file": "fertilizer-01.svg",
      "keywords": "fertilizer, nutrients, soil, amendment, organic"
    }
  ]
}
```

### Step 3: Done! ✅

That's it! The icon will appear immediately in the icon picker.

## 📋 JSON Format

Each icon entry has four fields:

```json
{
  "name": "Display Name",           // What users see
  "file": "filename-01.svg",         // Just the filename (no path)
  "keywords": "word1, word2, word3", // Comma-separated search terms
  "tooltip": "filename-01"           // Tooltip key (filename without .svg)
}
```

## 💬 Tooltip System

Each icon can have rich tooltip content stored in [`public/data/icon-tooltips.json`](public/data/icon-tooltips.json).

### Tooltip Structure

Tooltips support multiple contexts (current vs proposed systems, different scales, etc.):

```json
{
  "tooltips": {
    "your-icon-01": {
      "title": "Your Icon Name",
      "short_description": "Brief one-liner",
      "contexts": {
        "current": {
          "title": "Current System Context",
          "description": "...",
          "performance": { ... },
          "problems": [ ... ]
        },
        "proposed": {
          "title": "Proposed System Context",
          "description": "...",
          "improvements": [ ... ],
          "value": "..."
        }
      }
    }
  }
}
```

### Adding a Tooltip

When you add an icon, also add its tooltip:

**1. Register icon** in [`icons-registry.json`](public/data/icons-registry.json):
```json
{
  "name": "Solar Panel",
  "file": "solar-panel-01.svg",
  "keywords": "solar, panel, renewable, energy",
  "tooltip": "solar-panel-01"
}
```

**2. Add tooltip content** in [`icon-tooltips.json`](public/data/icon-tooltips.json):
```json
{
  "tooltips": {
    "solar-panel-01": {
      "title": "Solar Panel",
      "short_description": "Renewable electricity from sunlight",
      "contexts": {
        "proposed": {
          "title": "Solar Energy Integration",
          "description": "Supplemental renewable electricity",
          "performance": {
            "capacity": "500 kW typical installation",
            "generation": "700,000 kWh/year"
          },
          "benefits": [
            "Reduces grid dependence",
            "Complements biogas generation",
            "Additional carbon offset"
          ]
        }
      }
    }
  }
}
```

### Tooltip Contexts

- **`both`**: Element appears in both current and proposed systems
- **`current`**: Only in current system
- **`proposed`**: Only in proposed system
- **`current_only`**: Explicitly only current system

You can also add custom contexts for different scales, regions, etc.

## 🏷️ Writing Good Keywords

Keywords make your icon easy to find. Include:

- **Alternative names**: "truck, lorry, vehicle"
- **What it does**: "transport, delivery, shipping"
- **Related concepts**: "logistics, freight, cargo"

**Example:**
```json
{
  "name": "Solar Panel",
  "file": "solar-panel-01.svg",
  "keywords": "solar, panel, pv, photovoltaic, renewable, sun, energy, electricity, power, green"
}
```

## 📂 Current Categories

Add icons to these existing categories:

1. **🏭 Components** - System components and facilities
2. **⚡ Energy** - Energy sources and forms
3. **📥 Inputs** - Input materials
4. **📤 Outputs** - Output products
5. **♻️ Digestate** - Digestate products

## ➕ Adding a New Category

To create a new category, add to the `categories` array:

```json
{
  "categories": [
    {
      "name": "Transportation",
      "icon": "🚛",
      "icons": [
        {
          "name": "Truck",
          "file": "truck-01.svg",
          "keywords": "truck, transport, vehicle, delivery"
        }
      ]
    }
  ]
}
```

## ✅ Checklist

Before testing your new icon:

- [ ] SVG file in `/public/images/iconslibrary/`
- [ ] Filename follows `lowercase-with-hyphens-01.svg` format
- [ ] Added to [`public/data/icons-registry.json`](public/data/icons-registry.json)
- [ ] Included helpful keywords
- [ ] Added tooltip reference (filename without .svg)
- [ ] Created tooltip content in [`public/data/icon-tooltips.json`](public/data/icon-tooltips.json)
- [ ] JSON syntax is valid (no missing commas or brackets)

## 💡 Testing Your Icon

1. Open the Sankey Builder (`/sankey-experimental`)
2. Add or select a node
3. Click the icon picker button
4. Search for your icon or find it in its category
5. Click to select it

## 🐛 Troubleshooting

**Icon doesn't appear?**
- Check JSON syntax (use jsonlint.com)
- Verify filename matches exactly
- Ensure file is in correct directory
- Check browser console for errors

**Can't find icon in search?**
- Add more keywords
- Check for typos in keywords
- Keywords are comma-separated with spaces

## 📖 Full Example

Here's a complete example adding a "Compost Bin" icon:

**1. Add file:**
```
public/images/iconslibrary/compost-bin-01.svg
```

**2. Edit [`public/data/icons-registry.json`](public/data/icons-registry.json):**
```json
{
  "name": "Outputs",
  "icon": "📤",
  "icons": [
    {
      "name": "Water",
      "file": "water-01.svg",
      "keywords": "water, liquid, h2o"
    },
    {
      "name": "Compost Bin",
      "file": "compost-bin-01.svg",
      "keywords": "compost, bin, composting, waste, organic, decompose, soil"
    }
  ]
}
```

**3. Test:**
- Open icon picker
- Search "compost" or browse "Outputs"
- Icon appears! ✨

## 🎨 Icon Requirements

- **Format**: SVG only (required)
- **Size**: Any (auto-scaled)
- **Style**: Simple designs work best
- **Colors**: Any (may be styled by CSS)

## 🚀 Benefits of JSON-Based System

✅ **No coding needed** - Just edit JSON  
✅ **Easy to read** - Clear structure  
✅ **Quick updates** - No recompilation  
✅ **Non-technical friendly** - Anyone can add icons  
✅ **Version controllable** - Track changes in Git

## 📝 Summary

**Three simple steps:**
1. 📁 Add SVG to `/public/images/iconslibrary/`
2. 📝 Register in [`public/data/icons-registry.json`](public/data/icons-registry.json)
3. 🔍 Add searchable keywords

No restart needed - changes apply immediately! 🎉