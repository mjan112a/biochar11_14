# Component Detail Pages - Architectural Plan
**Project**: Poultry Biochar Tool  
**Created**: November 15, 2025  
**Purpose**: Visual comparison pages for system components showing Current vs Proposed transformation

---

## 🎯 Overview

Create dedicated detail pages for each major system component that visually communicate the benefits of the proposed biochar system through side-by-side Sankey diagram comparisons.

### Components to Build

**Current System (3 components)**:
- 🏡 Farm
- 🏠 Chicken House  
- 🏭 Processing Plant

**Proposed System (5 components)**:
- 🏡 Farm (transformed)
- 🏠 Chicken House (transformed)
- 🧪 Anaerobic Digester (new)
- 🔥 Pyrolysis Unit (new)
- 🏭 Processing Plant (transformed)

---

## 📐 Visual Design Concept

### Split-Screen Layout

```
┌────────────────────────────────────────────────────────────────┐
│                         HEADER                                  │
│  Component Name | Back to Overview | WasteHub Logo              │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────┬──────────────────────────────┐  │
│  │   CURRENT SYSTEM        │   PROPOSED SYSTEM            │  │
│  │   ⚠️ Problems View      │   ✅ Benefits View           │  │
│  │   (Red/Orange Border)    │   (Green Border)             │  │
│  │                          │                              │  │
│  │   [Sankey Diagram]       │   [Sankey Diagram]           │  │
│  │   - Animated flows       │   - Animated flows           │  │
│  │   - Interactive tooltips │   - Interactive tooltips     │  │
│  │   - Icon-based nodes     │   - Icon-based nodes         │  │
│  │                          │                              │  │
│  └──────────────────────────┴──────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           BENEFIT COMPARISON METRICS                      │  │
│  │  📊 Key Improvements | 💰 Economic Impact | 🌍 Environmental│  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Visual Hierarchy

1. **Top Level**: Component identification and navigation
2. **Main Content**: Side-by-side Sankey diagrams (50/50 split)
3. **Bottom**: Summary metrics and benefits
4. **Annotations**: Floating badges showing key improvements

---

## 🏗️ Component Architecture

### 1. SplitSankeyComparison Component

**Purpose**: Reusable component that displays two Sankey diagrams side-by-side

```typescript
interface SplitSankeyComparisonProps {
  currentDiagram: DiagramData | null;
  proposedDiagram: DiagramData;
  componentName: string;
  benefits?: BenefitMetric[];
}

// Features:
// - Synchronized zoom/pan (optional)
// - Color-coded borders (red=current, green=proposed)
// - Benefit badges overlay
// - Responsive layout (stacks on mobile)
// - Equal sizing for both diagrams
```

**Visual Enhancements**:
- **Current Side**: Red/orange border, "⚠️ Current Practice" header
- **Proposed Side**: Green border, "✅ Proposed System" header
- **Connecting Elements**: Arrows or comparison lines showing transformation
- **Benefit Badges**: Floating metrics showing improvements (e.g., "-90% emissions")

### 2. BenefitMetricsBar Component

**Purpose**: Summary bar showing key improvements

```typescript
interface BenefitMetric {
  category: 'environmental' | 'economic' | 'operational';
  label: string;
  improvement: string; // e.g., "-90%", "+$50k/yr"
  icon: string;
}

// Layout: Horizontal bar with 3-4 key metrics
// Styling: Green gradient background, large numbers, icons
```

### 3. ComponentDetailPage Component

**Purpose**: Page wrapper for each component's detail view

**Features**:
- Hero section with component icon and name
- Split Sankey comparison
- Benefit metrics
- Navigation back to overview
- Responsive design

---

## 🗂️ Route Structure

### New Routes (Next.js App Router)

```
src/app/
├── page.tsx                    (Homepage - existing)
└── details/
    ├── [component]/
    │   └── page.tsx           (Dynamic route for all components)
    └── layout.tsx             (Shared layout)
```

### URL Pattern

- `/details/farm` - Farm detail page
- `/details/chicken-house` - Chicken House detail page
- `/details/processing-plant` - Processing Plant detail page
- `/details/anaerobic-digester` - Anaerobic Digester detail page
- `/details/pyrolysis-unit` - Pyrolysis Unit detail page

### Component Mapping

```typescript
const COMPONENT_DETAILS = {
  'farm': {
    name: 'Farm Operations',
    icon: 'farm-01',
    currentDiagram: 'detail-farms-current.json',
    proposedDiagram: 'detail-farms-proposed.json',
    hasCurrentSystem: true
  },
  'chicken-house': {
    name: 'Chicken House',
    icon: 'chicken-house-01',
    currentDiagram: 'detail-chicken-house-current.json',
    proposedDiagram: 'detail-chicken-house-proposed.json',
    hasCurrentSystem: true
  },
  'processing-plant': {
    name: 'Processing Plant',
    icon: 'processing-plant-01',
    currentDiagram: 'detail-processing-plant-current.json',
    proposedDiagram: 'detail-processing-plant-proposed.json',
    hasCurrentSystem: true
  },
  'anaerobic-digester': {
    name: 'Anaerobic Digester',
    icon: 'anaerobic-digester-01',
    currentDiagram: null, // Doesn't exist in current
    proposedDiagram: 'detail-anaerobic-digester-proposed.json',
    hasCurrentSystem: false
  },
  'pyrolysis-unit': {
    name: 'Pyrolysis Unit',
    icon: 'pyrolysis-unit-01',
    currentDiagram: null, // Doesn't exist in current
    proposedDiagram: 'detail-pyrolysis-unit-proposed.json',
    hasCurrentSystem: false
  }
};
```

---

## 🎨 Visual Design Guidelines

### Color Scheme

**Current System**:
- Border: `#EF4444` (red-500)
- Background: `#FEF2F2` (red-50)
- Header: `#DC2626` (red-600)
- Icon: ⚠️ Warning symbol

**Proposed System**:
- Border: `#10B981` (green-500)
- Background: `#ECFDF5` (green-50)
- Header: `#059669` (green-600)
- Icon: ✅ Checkmark symbol

**Benefits/Improvements**:
- Positive metrics: Green badges with `↑` arrow
- Reduction metrics: Green badges with `↓` arrow
- Economic: Gold/amber color `#F59E0B`

### Typography

- **Page Title**: 3xl, bold, gray-900
- **Section Headers**: 2xl, bold
- **Diagram Labels**: xl, semibold
- **Metrics**: 4xl for numbers, xl for labels
- **Body Text**: base, medium

---

## 🔄 Handling Non-Existent Current Systems

For **Anaerobic Digester** and **Pyrolysis Unit** (proposed-only):

### Option 1: Empty State with Message

```
┌─────────────────────────────┐
│   CURRENT SYSTEM           │
│   ⚠️ Does Not Exist        │
│                             │
│   ╔═══════════════════╗    │
│   ║                   ║    │
│   ║       🚫         ║    │
│   ║  No equivalent    ║    │
│   ║  in current       ║    │
│   ║  practice         ║    │
│   ║                   ║    │
│   ╚═══════════════════╝    │
│                             │
└─────────────────────────────┘
```

### Option 2: Show "Gap" Visualization

Display what's missing:
- Icon with strikethrough
- Text: "This valuable process doesn't exist in current practice"
- List problems that result from the absence
- Highlight opportunity cost

### Recommended Approach

Use **Option 2** - it's more educational and emphasizes the innovation:

```typescript
function NonExistentCurrentView({ componentName }: { componentName: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 
                    bg-red-50 border-4 border-dashed border-red-300 rounded-xl">
      <div className="text-6xl mb-4 opacity-50">🚫</div>
      <h3 className="text-2xl font-bold text-red-800 mb-3">
        Does Not Exist in Current Practice
      </h3>
      <p className="text-lg text-red-700 text-center max-w-md mb-6">
        The {componentName} is a new innovation in the proposed system,
        addressing gaps in traditional poultry farming.
      </p>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h4 className="font-semibold text-red-900 mb-2">
          Problems Without This Component:
        </h4>
        <ul className="text-sm text-gray-700 space-y-1">
          {/* Component-specific problems */}
        </ul>
      </div>
    </div>
  );
}
```

---

## 🔗 Navigation Integration

### Homepage Enhancements

Add "Explore Details" section to homepage:

```typescript
// After the main diagram section
<section className="mb-8">
  <h2 className="text-3xl font-bold mb-6">Explore Component Details</h2>
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    {COMPONENTS.map(component => (
      <Link 
        href={`/details/${component.slug}`}
        key={component.slug}
        className="group"
      >
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl 
                        transition-all duration-200 text-center">
          <Icon name={component.icon} size="xl" className="mb-3" />
          <h3 className="font-semibold">{component.name}</h3>
          <p className="text-xs text-gray-500 mt-1">View Details →</p>
        </div>
      </Link>
    ))}
  </div>
</section>
```

### Diagram Click-Through

Make nodes in main Sankey diagram clickable:

```typescript
// In CircularSankeyHomepage.tsx
node.on('click', (event, d) => {
  if (d.componentSlug) {
    router.push(`/details/${d.componentSlug}`);
  }
});
```

---

## 📊 Benefit Metrics Data Structure

### Create benefit-metrics.json

```json
{
  "farm": {
    "environmental": [
      {
        "label": "Nutrient Runoff Reduction",
        "value": "-95%",
        "icon": "💧"
      },
      {
        "label": "GHG Emissions Reduction",
        "value": "-60%",
        "icon": "🌍"
      }
    ],
    "economic": [
      {
        "label": "Annual Savings",
        "value": "$50,000",
        "icon": "💰"
      },
      {
        "label": "Fertilizer Cost Reduction",
        "value": "-80%",
        "icon": "📉"
      }
    ],
    "operational": [
      {
        "label": "Soil Quality Improvement",
        "value": "+40%",
        "icon": "🌱"
      }
    ]
  },
  "chicken-house": {
    "environmental": [
      {
        "label": "Ammonia Reduction",
        "value": "-90%",
        "icon": "😤"
      }
    ],
    "economic": [
      {
        "label": "Energy Savings",
        "value": "$25,000/yr",
        "icon": "⚡"
      }
    ],
    "operational": [
      {
        "label": "Bird Health Improvement",
        "value": "+25%",
        "icon": "🐔"
      }
    ]
  }
  // ... other components
}
```

---

## 🚀 Implementation Phases

### Phase 1: Core Infrastructure (Week 1)
- [x] Create SplitSankeyComparison component
- [x] Set up /details/[component] route
- [x] Create BenefitMetricsBar component
- [x] Design NonExistentCurrentView for new components

### Phase 2: Component Pages (Week 2)
- [ ] Build Farm detail page
- [ ] Build Chicken House detail page
- [ ] Build Processing Plant detail page
- [ ] Build Anaerobic Digester detail page
- [ ] Build Pyrolysis Unit detail page

### Phase 3: Navigation & Polish (Week 3)
- [ ] Add navigation from homepage
- [ ] Add clickable diagram nodes
- [ ] Responsive design testing
- [ ] Performance optimization
- [ ] Mobile layout adjustments

### Phase 4: Enhancement (Week 4)
- [ ] Add synchronized zoom/pan
- [ ] Add comparison annotations
- [ ] Add export functionality (PDF/PNG)
- [ ] Add analytics tracking
- [ ] User feedback collection

---

## 💡 Interactive Features

### Comparison Mode Features

1. **Highlight Differences**
   - Button to highlight nodes that changed
   - Dim unchanged elements
   - Animate new connections

2. **Benefit Annotations**
   - Floating badges showing improvements
   - Arrows pointing to key changes
   - Tooltips with detailed explanations

3. **Toggle Views**
   - Show/hide labels
   - Focus mode (zoom to specific flow)
   - Simplified vs detailed view

4. **Export Options**
   - Download as image
   - Generate PDF report
   - Share link with annotations

---

## 📱 Responsive Design

### Desktop (1200px+)
- Side-by-side 50/50 layout
- Full diagram detail visible
- Benefits bar horizontal

### Tablet (768px - 1199px)
- Side-by-side maintained
- Slightly reduced diagram size
- Benefits bar horizontal

### Mobile (<768px)
- Stacked layout (Current on top, Proposed below)
- Swipe to switch between views
- Benefits bar vertical
- Simplified diagrams with fewer details

---

## 🎯 Success Metrics

### User Engagement
- Time spent on detail pages
- Click-through rate from homepage
- Diagram interaction rate

### Visual Communication
- User feedback on clarity
- A/B testing of layouts
- Heat maps of attention

### Educational Impact
- Quiz results (if implemented)
- Understanding of benefits
- Conversion to stakeholders

---

## 📝 Documentation Needs

1. **User Guide**: How to navigate detail pages
2. **Developer Guide**: Adding new components
3. **Content Guide**: Writing benefit descriptions
4. **Design Guide**: Visual standards

---

## 🔧 Technical Considerations

### Performance
- Lazy load diagrams (load on scroll)
- Memoize expensive calculations
- Optimize SVG rendering
- Implement virtual scrolling for large diagrams

### Accessibility
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators
- Alt text for all icons

### Browser Support
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers

---

## 🎨 Design Mockup (Text-based)

```
╔══════════════════════════════════════════════════════════════════╗
║  🏡 FARM OPERATIONS              [Back to Overview]  [WasteHub] ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  ┌─────────────────────────────┬─────────────────────────────┐  ║
║  │ ⚠️ CURRENT PRACTICE         │ ✅ PROPOSED SYSTEM          │  ║
║  │ [RED BORDER]                │ [GREEN BORDER]              │  ║
║  │                             │                             │  ║
║  │  📊 Sankey Diagram          │  📊 Sankey Diagram          │  ║
║  │  ↓ Input flows              │  ↓ Input flows              │  ║
║  │  🏡 Farm node               │  🏡 Farm node               │  ║
║  │  ↓ Output flows             │  ↓ Output flows             │  ║
║  │                             │                             │  ║
║  │  [Interactive tooltips]     │  [Interactive tooltips]     │  ║
║  │  [Animated particles]       │  [Animated particles]       │  ║
║  │                             │                             │  ║
║  └─────────────────────────────┴─────────────────────────────┘  ║
║                                                                   ║
║  ┌────────────────────────────────────────────────────────────┐  ║
║  │            🎯 KEY IMPROVEMENTS AT A GLANCE                  │  ║
║  ├────────────────────────────────────────────────────────────┤  ║
║  │  🌍 Environmental  │  💰 Economic      │  ⚙️ Operational   │  ║
║  │  -95% Runoff      │  $50k Annual     │  +40% Soil Quality │  ║
║  │  -60% Emissions   │  -80% Fert Cost  │  Better Yields     │  ║
║  └────────────────────────────────────────────────────────────┘  ║
║                                                                   ║
╚══════════════════════════════════════════════════════════════════╝
```

---

**Next Steps**: Review this plan, then we can proceed to implementation in Code mode.

---

*Created for Poultry Biochar Tool - Component Detail Pages Feature*