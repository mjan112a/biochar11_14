# Boundary Circle Feature

## Overview
The boundary circle feature allows you to add dotted/dashed circular boundaries around your diagram to visually define the system ecosystem. This is perfect for showing:
- **Current System**: Many items leaving the boundary (waste, emissions, etc.)
- **Proposed System**: Fewer items leaving (closed-loop, circular economy)

## How to Add Boundary Circles

### Option 1: Manually in JSON
Add a `boundaryCircles` array to your diagram's `config` section:

```json
{
  "nodes": [...],
  "links": [...],
  "config": {
    "width": 1000,
    "height": 1100,
    "nodePadding": 20,
    "nodeWidth": 80,
    "circularLinkGap": 20,
    "boundaryCircles": [
      {
        "id": "ecosystem-boundary",
        "name": "System Boundary",
        "centerX": 500,
        "centerY": 550,
        "radius": 400,
        "color": "#6B7280",
        "strokeWidth": 3,
        "strokeDasharray": "10,5",
        "opacity": 0.6,
        "showLabel": true
      }
    ]
  }
}
```

### Option 2: Using the Builder (Coming Soon)
A boundary circle tool will be added to the builder toolbar with:
- Click-and-drag to define center and radius
- Properties panel to adjust appearance
- Multiple boundaries support

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | string | required | Unique identifier |
| `name` | string | required | Label text (e.g., "System Boundary") |
| `centerX` | number | required | X coordinate of center |
| `centerY` | number | required | Y coordinate of center |
| `radius` | number | required | Circle radius in pixels |
| `color` | string | "#6B7280" | Stroke color (hex, rgb, etc.) |
| `strokeWidth` | number | 2 | Line thickness |
| `strokeDasharray` | string | "5,5" | Dash pattern (e.g., "10,5" = 10px dash, 5px gap) |
| `opacity` | number | 0.5 | Transparency (0.0 to 1.0) |
| `showLabel` | boolean | true | Display the label |

## Common Patterns

### Dotted Circle (Fine)
```json
"strokeDasharray": "2,3"
```

### Dashed Circle (Medium)
```json
"strokeDasharray": "10,5"
```

### Long Dash Circle
```json
"strokeDasharray": "20,10"
```

### Solid Circle
```json
"strokeDasharray": ""
```

## Visual Strategy

### Current System Example
```json
{
  "boundaryCircles": [{
    "id": "boundary-1",
    "name": "System Boundary",
    "centerX": 500,
    "centerY": 550,
    "radius": 350,
    "color": "#EF4444",
    "strokeWidth": 2,
    "strokeDasharray": "8,4",
    "opacity": 0.7
  }]
}
```
**Effect**: Red dashed circle with many flows crossing outward (waste, emissions)

### Proposed System Example
```json
{
  "boundaryCircles": [{
    "id": "boundary-1",
    "name": "Closed Loop System",
    "centerX": 500,
    "centerY": 550,
    "radius": 400,
    "color": "#10B981",
    "strokeWidth": 3,
    "strokeDasharray": "10,5",
    "opacity": 0.8
  }]
}
```
**Effect**: Green dashed circle with most flows staying inside (circular economy)

## Multiple Boundaries

You can add multiple concentric circles for different layers:

```json
"boundaryCircles": [
  {
    "id": "inner",
    "name": "Core System",
    "centerX": 500,
    "centerY": 550,
    "radius": 250,
    "color": "#10B981",
    "strokeDasharray": "5,3"
  },
  {
    "id": "outer",
    "name": "Extended System",
    "centerX": 500,
    "centerY": 550,
    "radius": 450,
    "color": "#6B7280",
    "strokeDasharray": "10,5",
    "opacity": 0.4
  }
]
```

## Tips

1. **Center Point**: Usually the center of your main components
2. **Radius**: Should encompass your core system with some margin
3. **Color**: Use red/orange for current (problems), green/blue for proposed (solutions)
4. **Opacity**: Keep it subtle (0.4-0.7) so it doesn't overwhelm the diagram
5. **Label Position**: Labels appear at the top of the circle

## Current Diagram Integration

To add to your current system overview diagram:
1. Open `/data/diagrams/system-overview-current.json`
2. Add `boundaryCircles` to the `config` object
3. Position to show items leaving the boundary

To add to your proposed system diagram:
1. Open `/data/diagrams/system-overview-proposed.json`
2. Add `boundaryCircles` showing circular flows
3. Use different color to show improvement (e.g., green)