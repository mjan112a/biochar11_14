# Biochar Theme Creation Guide

This guide will help you create and customize a theme for the Biochar Flow Diagram using the in-app theme editor.

## Quick Start

1. **Navigate to the Sankey Flow Builder**: Go to the Experimental tab
2. **Open Theme Editor**: Click the 🎨 button next to the theme selector in the toolbar
3. **Import the Base Theme**: Click "📁 Import" and select `/data/themes/biochar-system-theme.json`
4. **Customize as needed** using the visual editor
5. **Save Your Theme**: Click "Save as New" and give it a custom name

## Theme Structure

### Node Types (Color Coding)

The biochar system uses color-coded node types to represent different parts of the process:

- **Input** (Blue) - `#dbeafe` background, `#3b82f6` border
  - Chicken feed, water, pine shavings, live chickens
  
- **Component** (Pink) - `#fce7f3` background, `#ec4899` border
  - Chicken house, pyrolysis unit, anaerobic digester, processing plant
  
- **Process** (Yellow) - `#fef3c7` background, `#f59e0b` border
  - Composting, heating, digestion processes
  
- **Output** (Green) - `#dcfce7` background, `#22c55e` border
  - Biochar, chicken meat, digestate, crops
  
- **Energy** (Light Yellow) - `#fef9c3` background, `#eab308` border
  - Syngas, bio-methane, renewable energy
  
- **Waste** (Red) - `#fee2e2` background, `#ef4444` border
  - Wastewater, emissions, unused materials

### Link Types (Flow Categories)

Different types of material flows use different colors:

- **Material Flows** - `#6366f1` (indigo) - Main material pathways
- **Energy Flows** - `#f59e0b` (amber) - Energy/heat transfers
- **Waste Flows** - `#ef4444` (red) - Waste streams
- **Water Flows** - `#06b6d4` (cyan) - Water/liquid flows

## Using the Theme Editor

### Global Styles Tab

This sets the default appearance for all nodes and links:

#### Node Defaults
- **Fill Color**: Background color of nodes
- **Stroke Color**: Border color of nodes
- **Stroke Width**: Border thickness (1-5px)
- **Border Radius**: Corner roundness (0-20px)

#### Link Defaults
- **Color**: Default link color
- **Thickness**: Link width (1-10px)
- **Opacity**: Transparency (0-100%)

### Canvas Tab

Customize the background appearance:

- **Background Color**: Canvas background
- **Show Grid**: Toggle grid display
- **Grid Color**: Grid line color
- **Grid Size**: Spacing between grid lines (10-50px)

## Creating a Custom Biochar Theme

### Step-by-Step Instructions

1. **Start with the Base Theme**
   - Import `biochar-system-theme.json`
   - This gives you the color-coded node types

2. **Adjust Global Node Settings**
   - Go to "Global Styles" tab
   - Adjust default node appearance:
     - Border radius: 8px for rounded, 0px for sharp
     - Stroke width: 2px recommended
     - Shadow: Enable for depth

3. **Customize Canvas**
   - Go to "Canvas" tab
   - Set background: `#f9fafb` (light gray) recommended
   - Enable grid with `#e5e7eb` color
   - Grid size: 20px for good alignment

4. **Adjust Link Appearance**
   - Thickness: 4-6px for main flows
   - Opacity: 60-70% for layering
   - Keep colors as defined for consistency

5. **Save Your Theme**
   - Click "Save as New"
   - Name it: "My Biochar System"
   - It will be saved to browser localStorage
   - Use "💾 Export" to save as JSON file

## Available Icons/Assets

The biochar theme comes with pre-configured assets:

### Components
- Chicken House (`chicken-house.png`)
- Pyrolysis Unit (`pyrolysis-unit.png`)
- Anaerobic Digester (`anaerobic-digester.png`)
- Processing Plant (`processing-plant.png`)

### Materials
- Biochar (`biochar.svg`)
- Syngas (`syngas.svg`)
- Litter (`litter.svg`)
- Chicken Feed (`chicken-feed.svg`)
- Digestate (`digestate.svg`)
- Fertilizer (`fertilizer.svg`)

### Additional Icons
All icons in `/public/images/system-icons/` and `/public/images/flow-icons/` are available.

## Tips for Best Results

### Color Consistency
- Stick to the defined color palette for node types
- Use colors that contrast well with white text
- Keep stroke colors darker than fill colors

### Visual Hierarchy
- Use larger nodes for important components
- Make primary flows thicker than secondary flows
- Use opacity to show less important connections

### Grid Alignment
- Enable grid for clean layouts
- Use 20px grid size (matches default node positioning)
- Snap nodes to grid for professional appearance

### Link Design
- Keep link thickness proportional to flow volume
- Use animation for active/important flows
- Match link colors to their material type

## Exporting and Sharing

### Export Your Theme
1. Click "💾 Export" in theme editor
2. Save the JSON file to your project
3. Share with team members

### Import a Theme
1. Click "📁 Import" in theme editor
2. Select the JSON theme file
3. Customize further if needed

### Load on Startup
To make a theme the default:
1. Export your theme as JSON
2. Place in `/data/themes/` directory
3. Update the default theme in code

## Advanced Customization

### Per-Node Styling
While the theme editor currently handles global and type-based styles, you can:
1. Select individual nodes in the builder
2. Use the right sidebar to customize colors
3. These overrides are saved with your diagram

### Custom Color Schemes
Create variations for different scenarios:
- **Light Mode**: Current default
- **Dark Mode**: Invert colors (dark background, light nodes)
- **High Contrast**: Stronger color differences
- **Grayscale**: For printing/documentation

## Troubleshooting

### Theme Not Applying
- Ensure you clicked "Apply Changes"
- Check that you selected the theme from dropdown
- Refresh the page if needed

### Colors Look Different
- Check monitor color calibration
- Ensure opacity settings aren't too low
- Verify hex codes match your expectations

### Performance Issues
- Reduce number of animated links if slow
- Disable shadows if rendering is laggy
- Simplify grid if too many lines

## Next Steps

After creating your theme:
1. Test with actual biochar flow data
2. Export and backup your theme
3. Share with team for feedback
4. Iterate based on usability

## Support

For questions or issues:
- Check the theme JSON structure in `/types/builder-theme.ts`
- Review example themes in `/lib/themePresets.ts`
- Refer to the main documentation in project root