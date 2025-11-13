# Required Data Updates for Circular Sankey Diagrams

## Summary of Changes

### 1. ADD Missing Inputs to Chicken House
**New Nodes:**
- fossil-fuels-heating (already exists as "fossil-fuels", just add flow)
- water (if not already present)

**New Flows:**
- `fossil-fuels` → `chicken-house` (heating/brooding, value: 30)
- `water` → `chicken-house` (if needed, value: 20)

**Keep existing:**
- chicken-feed-input → chicken-house
- biochar → chicken-house (proposed only)

### 2. ADD Missing Outputs from Chicken House
**New Nodes to Add:**
```json
{
  "id": "ammonia-emissions",
  "name": "Ammonia Emissions",
  "type": "output",
  "icon": "emissions"
},
{
  "id": "ghg-emissions-chicken",
  "name": "GHG Emissions",
  "type": "output",
  "icon": "emissions"
}
```

**New Flows:**
- `chicken-house` → `ammonia-emissions` (value: 15)
- `chicken-house` → `ghg-emissions-chicken` (value: 25)

**Keep existing:**
- chicken-house → live-chickens
- chicken-house → dead-chickens
- chicken-house → litter-char (or used-litter)

### 3. FIX Processing Plant - Add Electricity
**New Node (if not exists):**
```json
{
  "id": "electricity-input",
  "name": "Electricity",
  "type": "input",
  "icon": "electricity"
}
```

**New Flow:**
- `electricity-input` → `processing-plant` (value: 40)

**Apply to BOTH:**
- flows-circular.json (proposed system)
- flows-circular-current.json (current system)

### 4. CHANGE: Dry Ice → Liquefied CO₂
**Find and Replace:**
- Node ID: "dry-ice" → "liquid-co2"
- Name: "Dry Ice" → "Liquefied CO₂"
- Icon: "dry-ice" → "liquid-co2" (or "co2")

**Flow updates:**
- Any flow with source "dry-ice" → change to "liquid-co2"
- Label: "Dry Ice" → "Liquefied CO₂"

## Implementation Plan

### Step 1: Update flows-circular.json (Proposed System)
1. Add ammonia-emissions node
2. Add ghg-emissions-chicken node
3. Add electricity-input node (if missing)
4. Add liquid-co2 node (rename from dry-ice)
5. Add flow: fossil-fuels → chicken-house
6. Add flow: chicken-house → ammonia-emissions
7. Add flow: chicken-house → ghg-emissions-chicken
8. Add flow: electricity-input → processing-plant
9. Update any dry-ice flows to liquid-co2

### Step 2: Update flows-circular-current.json (Current System)
1. Add same emission nodes
2. Add electricity-input node
3. Add same flows for emissions
4. Add electricity flow
5. Update dry-ice to liquid-co2

### Step 3: Copy to Public Directory
- Copy updated files to public/data/system/

### Step 4: Test
- Verify both systems display correctly
- Check tooltips show correct information
- Verify toggle switches between systems properly