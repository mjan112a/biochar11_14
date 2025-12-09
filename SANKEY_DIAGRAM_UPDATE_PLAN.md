# Sankey Diagram Update Implementation Plan

## Overview
This document outlines the comprehensive updates needed for both Current and Proposed system diagrams based on user requirements.

---

## Phase 1: Icon Management

### Icons Available in data/iconslibrary (to copy to public/images/iconslibrary):
| Icon File | Status | Usage |
|-----------|--------|-------|
| labor-01.svg | ✅ Available | Input between feed and bedding |
| Labor.svg | ✅ Available | Alternative labor icon |
| dead-chickens-01.svg | ✅ Available | Dead birds output |
| chicken-meat-01.svg | ✅ Available | Meat output |
| GHG-01.svg | ✅ Available | Greenhouse gas emissions |
| syngas-energy-01.svg | ✅ Available | Syngas energy output |
| diesel-01.svg | ✅ Available | Farm input |
| water-01.svg | ✅ Available | Water input |
| bio-methane-01.svg | ✅ Available | RNG output |

### Icons That May Need Creation:
| Icon Needed | Description | Workaround |
|-------------|-------------|------------|
| Combined Energy | Flame + lightning bolt together | Use electricity-01.svg for now |
| Good birds truck | Nice truck with live birds | Use live-chickens-01.svg |
| Bad birds truck | Truck with dead birds | Use dead-chickens-01.svg |
| Dirty ag truck | Ugly agricultural truck | Use other-waste-01.svg |
| Clean truck | Nice truck for blended transport | Use existing truck or biochar icon |
| Chemical fertilizer | Fertilizer icon | Use fertilizer-01.svg if exists |
| RNG | Renewable Natural Gas | Use bio-methane-01.svg |

---

## Phase 2: Current System Updates

### Node Renames:
```json
{
  "chicken-house": "Poultry<br/>Producer",
  "node-fresh-pine-shavings": "Fresh Poultry<br/>Bedding", 
  "node-chicken-feed": "Chicken Feed<br/>and Water"
}
```

### New Nodes to Add:
1. **Labor** - Position between chicken feed and fresh bedding inputs
   - icon: "/images/iconslibrary/labor-01.svg"
   - x: ~75, y: ~420
   
2. **Energy** (Combined) - Replace separate fossil fuels and electricity
   - icon: "/images/iconslibrary/electricity-01.svg"
   - Combine existing fossil fuel and electricity nodes
   
3. **Diesel** - Farm input
   - icon: "/images/iconslibrary/diesel-01.svg"
   
4. **Chemical Fertilizer** - Farm input
   - icon: "/images/iconslibrary/fertilizer-01.svg"
   
5. **Water** - Farm input
   - icon: "/images/iconslibrary/water-01.svg"
   
6. **Dead Birds** - Output from Poultry Producer
   - icon: "/images/iconslibrary/dead-chickens-01.svg"
   
7. **GHG (Farm)** - Output from Farm
   - icon: "/images/iconslibrary/GHG-01.svg"

### Nodes to Remove:
1. Remove raincloud arrows and windmill from Processing Plant (handled in icon)
2. Remove wastewater output link from Processing Plant

### Link Changes:
| Source | Target | Change | Line Thickness |
|--------|--------|--------|----------------|
| Poultry Producer | Processing Plant | Keep "Live Birds" | Thick (value: 15) |
| Poultry Producer | Dead Birds | ADD NEW | Medium (value: 5) |
| Poultry Producer | Farms | Change to "Waste Litter", dirty truck | Thick (value: 15) |
| Processing Plant | Waterways | REMOVE wastewater | - |
| Processing Plant | GHG | ADD NEW | Medium (value: 8) |
| Processing Plant | Meat | ADD NEW | Medium (value: 10) |
| Farm | GHG | ADD NEW | Thick (value: 12) |
| Farm | Waterways | Change label to "Nutrient Runoff" | Thick (value: 15) |
| Diesel/Fertilizer/Water | Farm | ADD NEW inputs | Medium (value: 8 each) |

---

## Phase 3: Proposed System Updates

### Node Updates:
1. **Poultry Producer** - Same rename as current
2. **Fresh Poultry Bedding** - Same rename as current
3. **Anaerobic Digester** - Keep but update inputs/outputs
4. **Pyrolysis Unit** - Update icon to horizontal cylinder style
5. **Remove** Offal node

### New Nodes to Add:
1. **RNG** - Output from AD
   - icon: "/images/iconslibrary/bio-methane-01.svg"
   
2. **Renewable CO2** - Output from AD
   - icon: "/images/iconslibrary/C02-01.svg"
   
3. **Syngas Energy** - Output from Pyrolysis
   - icon: "/images/iconslibrary/syngas-energy-01.svg"
   
4. **Biochar/Digestate Blend** - Between pyrolysis and farm
   - icon: Use biochar icon with blend label

### Link Changes:
| Source | Target | Change | Line Thickness |
|--------|--------|--------|----------------|
| Poultry Producer | AD | Add "Litter with Biochar" | Medium |
| Poultry Producer | AD | Add "Dead Birds" | Thin |
| Processing Plant | AD | Remove Offal link | - |
| AD | RNG | ADD NEW | Medium |
| AD | CO2 | ADD NEW | Thin |
| AD | Farms | Change to "Digestate" | SKINNIER than current |
| Pyrolysis | Syngas | ADD NEW to Processing Plant | Medium |
| Pyrolysis | Biochar | To bedding producer | Medium |
| Blend | Farm | Nice truck visual | Medium |
| Farm inputs | Farm | SKINNIER lines | Thin (value: 5) |
| Farm | GHG | SKINNIER than current | Thin (value: 5) |
| Farm | Waterways | "Reduced Runoff" not "Clean Water" | Thin (value: 5) |
| Processing Plant | Energy inputs | SKINNIER | Thin (value: 5) |
| Processing Plant | GHG | SKINNIER | Thin (value: 5) |

---

## Phase 4: Line Thickness Implementation

### Thickness Scale:
- **Thick**: value 15-25 (high volume flows)
- **Medium**: value 8-12 (moderate flows)
- **Thin**: value 3-5 (reduced/minimal flows)

### Current System Line Values:
| Flow | Value | Meaning |
|------|-------|---------|
| Live Birds | 15 | High volume |
| Waste Litter | 15 | High volume (problem!) |
| GHG emissions | 12 | Significant |
| Nutrient Runoff | 15 | Major problem |
| Farm inputs | 10 | Standard |

### Proposed System Line Values:
| Flow | Value | Meaning |
|------|-------|---------|
| Live Birds | 15 | Same |
| Digestate to Farm | 5 | Reduced volume |
| Biochar | 8 | Moderate |
| Farm GHG | 3 | Much less |
| Farm Runoff | 3 | Much less |
| Energy inputs | 5 | Less needed |

---

## Phase 5: UI/Layout Updates

### Already Completed:
- [x] Toggle moved closer to diagram
- [x] Title shows "Current" or "Proposed"
- [x] Component titles moved closer

### Still Needed:
- [ ] Review banner width vs content width
- [ ] Revise "Waste Hub" placement and wording
- [ ] Single icon per flow (reduce digestate icons from 10 to 1)

---

## Implementation Order

### Step 1: Copy Icons
```bash
# Copy all icons from data/iconslibrary to public/images/iconslibrary
cp data/iconslibrary/*.svg public/images/iconslibrary/
```

### Step 2: Update Current System JSON
File: `data/diagrams/system-overview-current.json`

### Step 3: Update Proposed System JSON  
File: `data/diagrams/system-overview-proposed.json`

### Step 4: Test in Browser
- Run `npm run dev`
- Navigate to homepage
- Toggle between Current and Proposed
- Verify all icons load
- Verify line thicknesses are visible

---

## JSON Structure Reference

### Node Structure:
```json
{
  "id": "unique-id",
  "name": "Display<br/>Name",
  "x": 100,
  "y": 200,
  "width": 60,
  "height": 60,
  "icon": "/images/iconslibrary/icon-name.svg",
  "iconOnly": true,
  "showLabel": true,
  "color": "#059669"
}
```

### Link Structure:
```json
{
  "id": "link-unique-id",
  "source": "source-node-id",
  "target": "target-node-id",
  "value": 10,
  "color": "#059669",
  "label": "Flow Label",
  "animationFrequency": 2,
  "animationRate": 3,
  "animationSize": 4,
  "particleIconSource": "dot"
}
```

### Line Thickness (value field):
- The `value` field controls line thickness
- Higher value = thicker line
- Use value 3-5 for thin, 8-12 for medium, 15-25 for thick