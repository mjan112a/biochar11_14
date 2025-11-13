# Missing Tooltips Analysis

## Summary
Out of **33 icons** in the library, only **12 have tooltips defined** (36%).
**21 icons are missing tooltips** (64%).

---

## Icons WITH Tooltips ✅ (12)

1. ✅ **fresh-pine-shavings** - Pine shavings input
2. ✅ **chicken-feed** - Chicken feed input
3. ✅ **chicken-meat** - Meat output (mapped as "meat")
4. ✅ **fossil-fuels** - Fossil fuels problem
5. ✅ **used-poultry-litter** - Used litter pollution
6. ✅ **fertilizer** - Chemical fertilizers (mapped as "fertilizers")
7. ✅ **biochar** - Biochar circular solution
8. ✅ **bio-methane** - Bio-methane renewable energy
9. ✅ **syngas-energy** - Syngas process heat (mapped as "syngas")
10. ✅ **digestate-liquids** - Digestate organic fertilizer (mapped as "digestate")
11. ✅ **digestate-solids-reduced-volume** - Digestate organic fertilizer (mapped as "digestate")
12. ✅ **live-chickens** - Live chickens transport

---

## Icons MISSING Tooltips ❌ (21)

### High Priority - Core System Components (5)
These are major components that appear in overview diagrams:

1. ❌ **anaerobic-digester** - NEW proposed system component
2. ❌ **pyrolysis-unit** - NEW proposed system component  
3. ❌ **chicken-house** - Main component (has icon but no hover info)
4. ❌ **processing-plant** - Main component (has icon but no hover info)
5. ❌ **farm-waterways** / **waterways** - Environmental component

### Medium Priority - Key Materials (8)
These appear frequently in diagrams:

6. ❌ **bio-oils** - Pyrolysis output product
7. ❌ **wood-vinegars** - Pyrolysis output product
8. ❌ **water** - Universal input/output
9. ❌ **dead-chickens** - Processing plant waste → digester input
10. ❌ **fog-fats-oils-greases** - Processing plant waste → digester input
11. ❌ **litter-char-from-chicken-house** - Biochar-enhanced litter output
12. ❌ **crops-corn** - Farm output
13. ❌ **renewable-biofuels** - Energy output

### Lower Priority - Supporting Elements (8)

14. ❌ **c02** / **ghg** - Emissions tracking
15. ❌ **diesel** - Transportation fuel
16. ❌ **electricity** - Energy output
17. ❌ **farm** - Farm component (duplicate of waterways context?)
18. ❌ **labor** - Human resource input
19. ❌ **other-waste** - Miscellaneous waste category

---

## Recommended Tooltip Creation Priority

### Phase 1: Critical System Components (5 tooltips)
These should be created FIRST as they're main components in the circular system:

1. **anaerobic-digester**
2. **pyrolysis-unit**
3. **chicken-house**
4. **processing-plant**
5. **farm-waterways**

### Phase 2: Key Circular Materials (8 tooltips)
These are essential materials in the biochar circular economy:

6. **bio-oils**
7. **wood-vinegars**
8. **water**
9. **dead-chickens**
10. **fog-fats-oils-greases**
11. **litter-char-from-chicken-house**
12. **crops-corn**
13. **renewable-biofuels**

### Phase 3: Supporting Elements (8 tooltips)
Complete the system with these supporting tooltips:

14. **c02** / **ghg**
15. **diesel**
16. **electricity**
17. **farm**
18. **labor**
19. **other-waste**

---

## Tooltip Template Structure

Each tooltip should follow this pattern:

```typescript
'icon-name': {
  title: "MATERIAL NAME (CATEGORY)",
  metrics: [
    { label: "Metric 1", value: "Value with unit", icon: "emoji" },
    { label: "Metric 2", value: "Value with unit", icon: "emoji" },
    { label: "Metric 3", value: "Value with unit", icon: "emoji" },
    { label: "Metric 4", value: "Value with unit", icon: "emoji" }
  ],
  highlights: [
    "emoji Key benefit or concern 1",
    "emoji Key benefit or concern 2",
    "emoji Key benefit or concern 3"
  ]
}
```

---

## Example: Missing Tooltips

### anaerobic-digester
```typescript
'anaerobic-digester': {
  title: "ANAEROBIC DIGESTER (COMPONENT)",
  metrics: [
    { label: "Capacity", value: "500-1000 m³", icon: "📦" },
    { label: "Retention Time", value: "20-40 days", icon: "⏱️" },
    { label: "Biogas Production", value: "200-400 m³/day", icon: "⚡" },
    { label: "Efficiency", value: "60-80% VS reduction", icon: "📊" }
  ],
  highlights: [
    "♻️ Converts organic waste to energy",
    "💰 Generates revenue from waste streams",
    "🌍 Reduces methane emissions"
  ]
}
```

### pyrolysis-unit
```typescript
'pyrolysis-unit': {
  title: "PYROLYSIS UNIT (COMPONENT)",
  metrics: [
    { label: "Temperature", value: "400-600°C", icon: "🔥" },
    { label: "Biochar Yield", value: "30-40% by weight", icon: "⚖️" },
    { label: "Processing Rate", value: "500-1000 kg/hr", icon: "⚡" },
    { label: "Energy Output", value: "Self-sustaining", icon: "🔋" }
  ],
  highlights: [
    "♻️ Transforms waste into 4 products",
    "⚡ Energy self-sufficient process",
    "🌍 Net-negative carbon emissions"
  ]
}
```

### bio-oils
```typescript
'bio-oils': {
  title: "BIO-OILS (RENEWABLE FUEL)",
  metrics: [
    { label: "Yield", value: "10-20% by weight", icon: "⚖️" },
    { label: "Energy Content", value: "16-19 MJ/kg", icon: "⚡" },
    { label: "Market Value", value: "$300-500/ton", icon: "💵" },
    { label: "Uses", value: "Heating, power generation", icon: "🔥" }
  ],
  highlights: [
    "♻️ Renewable liquid fuel",
    "💰 Additional revenue stream",
    "⚡ Can supplement energy needs"
  ]
}
```

---

## File Location
Tooltips should be added to: [`lib/tooltipData.ts`](lib/tooltipData.ts)

---

**Last Updated:** 2025-11-11  
**Status:** Analysis Complete - 21 tooltips need creation