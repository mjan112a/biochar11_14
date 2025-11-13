# Hierarchical Circular Sankey Diagrams - Complete Index

## Overview

This document provides a complete index of all 12 circular Sankey diagrams for the poultry biochar system, implementing a two-tier progressive disclosure architecture.

## Architecture

### Two-Tier System
1. **Overview Level** - High-level system diagrams showing major components and primary flows
2. **Detail Level** - Component-specific diagrams showing all inputs, processes, and outputs

---

## Complete Diagram Set (12 Files)

### Tier 1: System Overview Diagrams

#### 1. Current System Overview
**File:** [`data/diagrams/system-overview-current.json`](data/diagrams/system-overview-current.json)
- **Purpose:** High-level view of traditional poultry system
- **Components:** 4 main components (180×150px icons)
  - Chicken House
  - Processing Plant
  - Farms
  - Waterways
- **Flows:** Major material flows only
- **Style:** Icon-only display, curved connectors

#### 2. Proposed System Overview
**File:** [`data/diagrams/system-overview-proposed.json`](data/diagrams/system-overview-proposed.json)
- **Purpose:** High-level view of biochar-integrated circular system
- **Components:** 6 main components (180×150px icons)
  - Chicken House
  - Processing Plant
  - Anaerobic Digester (NEW)
  - Pyrolysis Unit (NEW)
  - Farms
  - Waterways
- **Flows:** Major material flows including circular biochar pathway
- **Style:** Icon-only display, curved connectors

---

### Tier 2: Detailed Component Diagrams

#### Current System Details (4 diagrams)

##### 3. Chicken House - Current System
**File:** [`data/diagrams/detail-chicken-house-current.json`](data/diagrams/detail-chicken-house-current.json)
- **Component:** Chicken House (180×150px)
- **Inputs:** Feed, Water, Pine Shavings (80×80px each)
- **Outputs:** Live Chickens, Used Litter (80×80px each)
- **Key Flow:** Linear input-output model

##### 4. Processing Plant - Current System
**File:** [`data/diagrams/detail-processing-plant-current.json`](data/diagrams/detail-processing-plant-current.json)
- **Component:** Processing Plant (180×150px)
- **Inputs:** Live Chickens, CO2/Dry Ice, Water (80×80px each)
- **Outputs:** Chicken Meat, FOG waste, Dead Chickens (80×80px each)
- **Key Flow:** Waste generation (FOG, dead birds)

##### 5. Farms - Current System
**File:** [`data/diagrams/detail-farms-current.json`](data/diagrams/detail-farms-current.json)
- **Component:** Farms (180×150px)
- **Inputs:** Commercial Fertilizer, Water (80×80px each)
- **Outputs:** Crops, Polluted Runoff (80×80px each)
- **Key Issue:** 100% chemical fertilizer dependency, water pollution

##### 6. Waterways - Current System
**File:** [`data/diagrams/detail-waterways-current.json`](data/diagrams/detail-waterways-current.json)
- **Component:** Waterways (180×150px)
- **Inputs:** Polluted Farm Runoff (80×80px)
- **Outputs:** Contaminated Water, Dead Zones (80×80px each)
- **Key Issue:** Severe pollution from agricultural runoff

---

#### Proposed System Details (6 diagrams)

##### 7. Chicken House - Proposed System
**File:** [`data/diagrams/detail-chicken-house-proposed.json`](data/diagrams/detail-chicken-house-proposed.json)
- **Component:** Chicken House (180×150px)
- **Inputs:** Feed, Water, Pine Shavings, Biochar (80×80px each)
- **Outputs:** Live Chickens, Litter+Char (80×80px each)
- **Key Innovation:** Biochar bedding additive reduces ammonia, improves health

##### 8. Processing Plant - Proposed System
**File:** [`data/diagrams/detail-processing-plant-proposed.json`](data/diagrams/detail-processing-plant-proposed.json)
- **Component:** Processing Plant (180×150px)
- **Inputs:** Live Chickens, CO2/Dry Ice, Water (80×80px each)
- **Outputs:** Chicken Meat, FOG→Digester, Dead Birds→Digester (80×80px each)
- **Key Innovation:** Waste streams diverted to anaerobic digester

##### 9. Anaerobic Digester - Proposed System (NEW)
**File:** [`data/diagrams/detail-anaerobic-digester-proposed.json`](data/diagrams/detail-anaerobic-digester-proposed.json)
- **Component:** Anaerobic Digester (180×150px)
- **Inputs:** FOG, Dead Chickens, Litter (portion), Water (80×80px each)
- **Outputs:** Bio-Methane, Digestate Liquid, Digestate Solid (80×80px each)
- **Key Innovation:** Converts waste to renewable energy + soil amendments

##### 10. Pyrolysis Unit - Proposed System (NEW)
**File:** [`data/diagrams/detail-pyrolysis-unit-proposed.json`](data/diagrams/detail-pyrolysis-unit-proposed.json)
- **Component:** Pyrolysis Unit (180×150px)
- **Inputs:** Used Poultry Litter (80×80px)
- **Outputs:** Biochar, Syngas, Bio-Oils, Wood Vinegar (80×80px each)
- **Key Innovation:** Transforms waste litter into 4 valuable products

##### 11. Farms - Proposed System
**File:** [`data/diagrams/detail-farms-proposed.json`](data/diagrams/detail-farms-proposed.json)
- **Component:** Sustainable Farms (180×150px)
- **Inputs:** Biochar, Digestate Liquid, Digestate Solid, Water (80×80px each)
- **Outputs:** High-Quality Crops, Clean Water, Carbon Sequestration (80×80px each)
- **Key Innovation:** 100% renewable soil amendments, carbon negative

##### 12. Waterways - Proposed System
**File:** [`data/diagrams/detail-waterways-proposed.json`](data/diagrams/detail-waterways-proposed.json)
- **Component:** Clean Waterways (180×150px)
- **Inputs:** Farm Runoff (95% clean), Biochar Filtration (80×80px each)
- **Outputs:** Clean Water (95%), Healthy Ecosystem, Minimal Pollutants (80×80px each)
- **Key Innovation:** 95% pollution reduction vs current system

---

## Visual Design Standards

### Node Sizing
- **Main Components:** 180×150px (icon-only)
- **Input/Output Materials:** 80×80px (icon-only)
- **No backgrounds or boxes** - icons float freely

### Link Styling
- **Curved Connectors:** Cubic Bezier curves for natural S-shaped flows
- **Animated Flows:** Moving particles indicate material movement
- **Color Coding:** Each material type has consistent color across diagrams

### Icon Management
- **Auto-Discovery:** Icons automatically loaded from `/public/images/iconslibrary/`
- **No Manual Registration:** Just drop SVG files in folder
- **Naming Convention:** Filename auto-converted to display name

---

## Progressive Disclosure Flow

### User Journey
1. **Start:** View system overview (current or proposed)
2. **Interact:** Click on any component to drill down
3. **Explore:** See detailed inputs, processes, outputs for that component
4. **Navigate:** Return to overview or jump to related component

### Navigation Pattern
```
Overview (4-6 components)
    ↓ (click component)
Detail View (1 component + materials)
    ↓ (click related material/component)
Related Detail View
    ↓ (click "back")
Overview
```

---

## File Organization

```
data/diagrams/
├── system-overview-current.json        # Tier 1
├── system-overview-proposed.json       # Tier 1
├── detail-chicken-house-current.json   # Tier 2
├── detail-chicken-house-proposed.json  # Tier 2
├── detail-processing-plant-current.json    # Tier 2
├── detail-processing-plant-proposed.json   # Tier 2
├── detail-anaerobic-digester-proposed.json # Tier 2 (new)
├── detail-pyrolysis-unit-proposed.json     # Tier 2 (new)
├── detail-farms-current.json           # Tier 2
├── detail-farms-proposed.json          # Tier 2
├── detail-waterways-current.json       # Tier 2
└── detail-waterways-proposed.json      # Tier 2
```

---

## JSON Structure

Each diagram file follows this structure:

```json
{
  "metadata": {
    "title": "Component Name - System (Detail Level)",
    "description": "What this diagram shows",
    "type": "overview|detail",
    "system": "current|proposed",
    "component": "component-slug"
  },
  "nodes": [
    {
      "id": "unique-id",
      "name": "Display<br/>Name",
      "x": 100,
      "y": 100,
      "width": 180,
      "height": 150,
      "color": "#hex",
      "icon": "/images/iconslibrary/icon-name.svg",
      "iconOnly": true,
      "showLabel": true
    }
  ],
  "links": [
    {
      "id": "link-id",
      "source": "source-node-id",
      "target": "target-node-id",
      "value": 10,
      "color": "#hex",
      "label": "Flow description",
      "animationFrequency": 2,
      "animationRate": 4,
      "animationSize": 4
    }
  ],
  "config": {
    "width": 850,
    "height": 850,
    "nodePadding": 20,
    "nodeWidth": 100,
    "circularLinkGap": 20
  }
}
```

---

## Key Differences: Current vs Proposed

### Current System (Linear)
- **4 Components:** Chicken House → Processing → Farms → Waterways
- **Waste Generation:** FOG, dead birds, litter all become pollution
- **Resource Dependency:** 100% commercial fertilizer, fossil fuels
- **Environmental Impact:** High pollution, water contamination
- **Diagram Count:** 5 files (1 overview + 4 details)

### Proposed System (Circular)
- **6 Components:** Added Anaerobic Digester + Pyrolysis Unit
- **Waste → Value:** All waste streams converted to useful products
- **Resource Independence:** 100% renewable, self-sustaining loop
- **Environmental Impact:** 95% pollution reduction, carbon negative
- **Diagram Count:** 7 files (1 overview + 6 details)

---

## Implementation Status

✅ **ALL 12 DIAGRAMS COMPLETE**

### Completed Components
- [x] System Overview - Current
- [x] System Overview - Proposed
- [x] Chicken House - Current
- [x] Chicken House - Proposed
- [x] Processing Plant - Current
- [x] Processing Plant - Proposed
- [x] Anaerobic Digester - Proposed (NEW)
- [x] Pyrolysis Unit - Proposed (NEW)
- [x] Farms - Current
- [x] Farms - Proposed
- [x] Waterways - Current
- [x] Waterways - Proposed

### Visual Features
- [x] Icon-only display (no boxes)
- [x] Curved connector lines (cubic Bezier)
- [x] Animated flow particles
- [x] Consistent sizing (180×150 components, 80×80 materials)
- [x] Color-coded material types

### System Features
- [x] Auto-discovery API for icons
- [x] Hierarchical navigation structure
- [x] Progressive disclosure pattern
- [x] Metadata for filtering/navigation

---

## Next Steps (Future Enhancements)

1. **Interactive Navigation**
   - Click component in overview → drill down to detail
   - Click material → trace through system
   - Breadcrumb navigation

2. **Comparison Views**
   - Side-by-side current vs proposed
   - Highlight differences
   - Show impact metrics

3. **Data Binding**
   - Live parameter updates
   - Calculate flows from user inputs
   - Material balance validation

4. **Export & Sharing**
   - PDF export
   - Image export
   - Shareable links

---

## Usage in Application

### Loading a Diagram
```typescript
import diagramData from '@/data/diagrams/system-overview-proposed.json';
```

### Rendering
```typescript
<SankeyDiagram 
  diagramData={diagramData}
  width={850}
  height={850}
/>
```

### Navigation
```typescript
const handleNodeClick = (nodeId: string) => {
  // Navigate to detail view for this component
  router.push(`/diagram/detail-${nodeId}-${system}`);
};
```

---

## Maintenance

### Adding New Diagrams
1. Create JSON file following structure above
2. Place in `data/diagrams/` directory
3. Use appropriate naming: `[type]-[component]-[system].json`
4. Ensure all icon paths are valid

### Adding New Icons
1. Drop SVG file in `public/images/iconslibrary/`
2. Use naming convention: `descriptive-name-01.svg`
3. Icon auto-discovered by API
4. Reference in diagram: `/images/iconslibrary/your-icon.svg`

### Updating Flows
- Adjust `value` property for flow thickness
- Adjust `animationFrequency` for particle density
- Adjust `animationRate` for particle speed
- Adjust `animationSize` for particle size

---

## Documentation Files

- [`CIRCULAR_SANKEY_ARCHITECTURE.md`](CIRCULAR_SANKEY_ARCHITECTURE.md) - System architecture overview
- [`SIMPLE_ICON_GUIDE.md`](SIMPLE_ICON_GUIDE.md) - User guide for adding icons
- [`HOW_TO_ADD_NEW_ICONS.md`](HOW_TO_ADD_NEW_ICONS.md) - Technical icon guide
- This file - Complete diagram index

---

**Last Updated:** 2025-11-11  
**Status:** Complete - All 12 diagrams implemented  
**Version:** 1.0