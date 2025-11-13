# How to Change Homepage Sankey Diagrams

## Quick Answer

The JSON files are specified in **[`src/app/page.tsx`](src/app/page.tsx) on lines 10-11:**

```typescript
// Import the diagram data
import currentSystemData from '@/data/diagrams/system-overview-current.json';
import proposedSystemData from '@/data/diagrams/system-overview-proposed.json';
```

Simply change these file paths to any other diagram JSON file!

---

## Step-by-Step Instructions

### 1. Open the Homepage File
Open [`src/app/page.tsx`](src/app/page.tsx)

### 2. Find the Import Section (Lines 9-11)
Look for these lines at the top of the file:

```typescript
// Import the diagram data
import currentSystemData from '@/data/diagrams/system-overview-current.json';
import proposedSystemData from '@/data/diagrams/system-overview-proposed.json';
```

### 3. Change the File Paths
Replace the file paths with any diagram from the [`data/diagrams/`](data/diagrams/) folder.

**Example - Use component detail diagrams:**
```typescript
// Import the diagram data
import currentSystemData from '@/data/diagrams/detail-chicken-house-current.json';
import proposedSystemData from '@/data/diagrams/detail-chicken-house-proposed.json';
```

### 4. Save the File
The Next.js dev server will automatically reload with your new diagrams!

---

## Available Diagram Files

### System Overview Diagrams (Default)
These show the high-level system with main components:

**Current System:**
```typescript
import currentSystemData from '@/data/diagrams/system-overview-current.json';
```
- 4 main components (Chicken House, Processing Plant, Farms, Waterways)
- Linear flow showing waste disposal

**Proposed System:**
```typescript
import proposedSystemData from '@/data/diagrams/system-overview-proposed.json';
```
- 6 main components (adds Anaerobic Digester & Pyrolysis Unit)
- Circular flow showing biochar loop

---

### Detailed Component Diagrams

#### Current System Details

**Chicken House - Current:**
```typescript
import currentSystemData from '@/data/diagrams/detail-chicken-house-current.json';
```
- Shows: Feed, Water, Pine Shavings → Chicken House → Live Birds, Used Litter

**Processing Plant - Current:**
```typescript
import currentSystemData from '@/data/diagrams/detail-processing-plant-current.json';
```
- Shows: Live Chickens, CO2, Water → Processing Plant → Meat, FOG, Dead Birds

**Farms - Current:**
```typescript
import currentSystemData from '@/data/diagrams/detail-farms-current.json';
```
- Shows: Commercial Fertilizer, Water → Farms → Crops, Polluted Runoff

**Waterways - Current:**
```typescript
import currentSystemData from '@/data/diagrams/detail-waterways-current.json';
```
- Shows: Polluted Runoff → Waterways → Contaminated Water, Dead Zones

---

#### Proposed System Details

**Chicken House - Proposed:**
```typescript
import proposedSystemData from '@/data/diagrams/detail-chicken-house-proposed.json';
```
- Shows: Feed, Water, Pine, **Biochar** → Chicken House → Live Birds, Litter+Char

**Processing Plant - Proposed:**
```typescript
import proposedSystemData from '@/data/diagrams/detail-processing-plant-proposed.json';
```
- Shows: Live Chickens, CO2, Water → Processing Plant → Meat, FOG→Digester, Dead→Digester

**Anaerobic Digester - Proposed (NEW):**
```typescript
import proposedSystemData from '@/data/diagrams/detail-anaerobic-digester-proposed.json';
```
- Shows: FOG, Dead Chickens, Litter, Water → Digester → Bio-Methane, Digestate (liquid & solid)

**Pyrolysis Unit - Proposed (NEW):**
```typescript
import proposedSystemData from '@/data/diagrams/detail-pyrolysis-unit-proposed.json';
```
- Shows: Used Litter → Pyrolysis → Biochar, Syngas, Bio-Oils, Wood Vinegar

**Farms - Proposed:**
```typescript
import proposedSystemData from '@/data/diagrams/detail-farms-proposed.json';
```
- Shows: Biochar, Digestate, Water → Farms → Crops, Clean Water, Carbon Sequestration

**Waterways - Proposed:**
```typescript
import proposedSystemData from '@/data/diagrams/detail-waterways-proposed.json';
```
- Shows: Clean Runoff, Biochar Filter → Waterways → Clean Water (95%), Healthy Ecosystem

---

## Complete Example

Here's a complete example showing how to display the **Pyrolysis Unit** details on the homepage:

### File: `src/app/page.tsx` (lines 9-11)

```typescript
// Import the diagram data
import currentSystemData from '@/data/diagrams/detail-processing-plant-current.json';
import proposedSystemData from '@/data/diagrams/detail-pyrolysis-unit-proposed.json';
```

**Result:**
- **CURRENT toggle:** Shows processing plant with waste outputs
- **PROPOSED toggle:** Shows pyrolysis unit transforming waste into 4 products

---

## Mix and Match Examples

### Example 1: Compare Processing Plant
Show how processing changes from current to proposed:

```typescript
import currentSystemData from '@/data/diagrams/detail-processing-plant-current.json';
import proposedSystemData from '@/data/diagrams/detail-processing-plant-proposed.json';
```

### Example 2: Focus on New Technologies
Show the two new components in the proposed system:

```typescript
import currentSystemData from '@/data/diagrams/detail-anaerobic-digester-proposed.json';
import proposedSystemData from '@/data/diagrams/detail-pyrolysis-unit-proposed.json';
```

### Example 3: Environmental Impact
Show the difference in environmental outcomes:

```typescript
import currentSystemData from '@/data/diagrams/detail-waterways-current.json';
import proposedSystemData from '@/data/diagrams/detail-waterways-proposed.json';
```

### Example 4: Chicken House Improvement
Show how biochar improves chicken house operations:

```typescript
import currentSystemData from '@/data/diagrams/detail-chicken-house-current.json';
import proposedSystemData from '@/data/diagrams/detail-chicken-house-proposed.json';
```

---

## Important Notes

### 1. Variable Names Don't Need to Change
You can keep the variable names `currentSystemData` and `proposedSystemData` even when importing detail diagrams. The names are just variables, not tied to the file content.

### 2. Both Files Must Exist
Both imports must point to valid JSON files, or the build will fail.

### 3. File Structure Must Match
All diagram JSON files follow the same structure, so they're interchangeable:
```json
{
  "metadata": { ... },
  "nodes": [ ... ],
  "links": [ ... ],
  "config": { ... }
}
```

### 4. Diagram Size
The component automatically scales diagrams to fit the 850×700px container.

---

## File Location Reference

All diagram files are in: **[`data/diagrams/`](data/diagrams/)**

```
data/diagrams/
├── system-overview-current.json           ← Overview diagrams
├── system-overview-proposed.json          ↑
├── detail-chicken-house-current.json      ← Current system details
├── detail-processing-plant-current.json   ↑
├── detail-farms-current.json              ↑
├── detail-waterways-current.json          ↑
├── detail-chicken-house-proposed.json     ← Proposed system details
├── detail-processing-plant-proposed.json  ↑
├── detail-anaerobic-digester-proposed.json ↑
├── detail-pyrolysis-unit-proposed.json    ↑
├── detail-farms-proposed.json             ↑
└── detail-waterways-proposed.json         ↑
```

---

## Testing Your Changes

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Open Homepage
Navigate to `http://localhost:3000`

### 3. Toggle Switch
- Click **CURRENT** to see first diagram
- Click **PROPOSED** to see second diagram

### 4. Check Animations
- Particles should animate along flow paths
- Hover over components for scale effect
- Toggle should smoothly transition

---

## Troubleshooting

### Error: "Cannot find module"
**Problem:** File path is incorrect or file doesn't exist

**Solution:** 
1. Check file exists in `data/diagrams/` folder
2. Verify exact filename (case-sensitive)
3. Ensure `.json` extension is included

### Diagram Doesn't Display
**Problem:** JSON structure is invalid

**Solution:**
1. Open JSON file and validate structure
2. Check all required fields are present:
   - `metadata`
   - `nodes` (array with id, name, x, y, width, height, color, icon)
   - `links` (array with source, target, value, color)
   - `config`

### Animations Not Working
**Problem:** Missing animation properties in links

**Solution:**
Add these properties to link objects:
```json
{
  "animationFrequency": 2,
  "animationRate": 4,
  "animationSize": 4
}
```

---

## Quick Reference

**File to Edit:** [`src/app/page.tsx`](src/app/page.tsx)  
**Lines to Change:** 10-11  
**Diagram Location:** [`data/diagrams/`](data/diagrams/)  
**Total Diagrams:** 12 files (2 overview + 10 detail)

---

## Future Enhancement: Config File

To make diagram selection even easier without editing code, we could create a config file:

**Proposed: `data/homepage-config.json`**
```json
{
  "currentSystemDiagram": "system-overview-current.json",
  "proposedSystemDiagram": "system-overview-proposed.json"
}
```

Then the homepage could dynamically load diagrams from this config. Would you like me to implement this feature?

---

**Last Updated:** 2025-11-11  
**Related Docs:** [`HIERARCHICAL_DIAGRAMS_INDEX.md`](HIERARCHICAL_DIAGRAMS_INDEX.md)