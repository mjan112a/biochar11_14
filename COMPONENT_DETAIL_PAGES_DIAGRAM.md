# Component Detail Pages - Visual Architecture Diagram

## System Flow Diagram

```mermaid
graph TB
    subgraph Homepage
        A[Homepage with Toggle] --> B[Current System View]
        A --> C[Proposed System View]
    end
    
    subgraph Navigation
        B --> D[Explore Details Section]
        C --> D
        D --> E[Farm Card]
        D --> F[Chicken House Card]
        D --> G[Processing Plant Card]
        D --> H[Anaerobic Digester Card]
        D --> I[Pyrolysis Unit Card]
    end
    
    subgraph DetailPages[Detail Pages]
        E --> J[/details/farm]
        F --> K[/details/chicken-house]
        G --> L[/details/processing-plant]
        H --> M[/details/anaerobic-digester]
        I --> N[/details/pyrolysis-unit]
    end
    
    subgraph ComponentStructure[Detail Page Structure]
        J --> O[SplitSankeyComparison]
        O --> P[Current Diagram]
        O --> Q[Proposed Diagram]
        O --> R[BenefitMetricsBar]
        P --> S[CircularSankeyHomepage]
        Q --> S
    end
    
    style A fill:#e3f2fd
    style D fill:#fff9c4
    style O fill:#c8e6c9
    style S fill:#ffccbc
```

## Component Hierarchy

```mermaid
graph TD
    A[ComponentDetailPage] --> B[Header with Navigation]
    A --> C[Hero Section]
    A --> D[SplitSankeyComparison]
    A --> E[BenefitMetricsBar]
    A --> F[Footer]
    
    D --> G[CurrentSystemPanel]
    D --> H[ProposedSystemPanel]
    
    G --> I[CircularSankeyHomepage]
    G --> J[Problem Indicators]
    
    H --> K[CircularSankeyHomepage]
    H --> L[Improvement Indicators]
    
    E --> M[Environmental Metrics]
    E --> N[Economic Metrics]
    E --> O[Operational Metrics]
    
    style A fill:#2196f3,color:#fff
    style D fill:#4caf50,color:#fff
    style E fill:#ff9800,color:#fff
```

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant HomePage
    participant Router
    participant DetailPage
    participant DataLoader
    participant SankeyComponent
    
    User->>HomePage: Clicks "Farm Details"
    HomePage->>Router: Navigate to /details/farm
    Router->>DetailPage: Load page with slug='farm'
    DetailPage->>DataLoader: Load detail-farms-current.json
    DetailPage->>DataLoader: Load detail-farms-proposed.json
    DataLoader-->>DetailPage: Return diagram data
    DetailPage->>SankeyComponent: Render Current diagram
    DetailPage->>SankeyComponent: Render Proposed diagram
    SankeyComponent-->>User: Display split comparison
    User->>SankeyComponent: Hover over node
    SankeyComponent-->>User: Show tooltip with context
```

## Page Layout Structure

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER BAR                                                       │
│  [WasteHub Logo] | [Component Name] | [Back to Overview]         │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  HERO SECTION                                                     │
│  ┌─────────┐                                                      │
│  │  Icon   │  Component Name                                      │
│  │  [SVG]  │  Brief description                                   │
│  └─────────┘                                                      │
│                                                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  SPLIT SANKEY COMPARISON                                          │
│  ┌───────────────────────────┬───────────────────────────────┐  │
│  │  CURRENT SYSTEM          │  PROPOSED SYSTEM              │  │
│  │  ┌──────────────────────┐│  ┌──────────────────────────┐ │  │
│  │  │                      ││  │                      │     │  │
│  │  │  Sankey Diagram      ││  │  Sankey Diagram          │  │
│  │  │  with animated flows ││  │  with animated flows     │  │
│  │  │                      ││  │                          │  │
│  │  └──────────────────────┘│  └──────────────────────────┘ │  │
│  │  [Problems/Challenges]   │  [Benefits/Improvements]      │  │
│  └───────────────────────────┴───────────────────────────────┘  │
│                                                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  BENEFIT METRICS BAR                                              │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │ 🌍 Environ-  │ 💰 Economic  │ ⚙️ Operation │ 📊 Overall  │  │
│  │    mental    │              │     al       │   Impact    │  │
│  │  -95% runoff │ $50k savings │ +40% quality │  Highly     │  │
│  └──────────────┴──────────────┴──────────────┴──────────────┘  │
│                                                                   │
├──────────────────────────────────────────────────────────────────┤
│  FOOTER                                                           │
│  © 2025 WasteHub | Circular Economy Solutions                    │
└──────────────────────────────────────────────────────────────────┘
```

## Component Interaction Flow

```mermaid
stateDiagram-v2
    [*] --> Homepage
    Homepage --> ExploreDetails: Click "Explore Details"
    ExploreDetails --> SelectComponent: Choose component
    SelectComponent --> LoadCurrentData: Has current system
    SelectComponent --> LoadProposedOnly: No current system
    
    LoadCurrentData --> RenderSplitView: Both diagrams loaded
    LoadProposedOnly --> RenderSingleView: Only proposed loaded
    
    RenderSplitView --> InteractCurrent: Hover/Click current
    RenderSplitView --> InteractProposed: Hover/Click proposed
    
    InteractCurrent --> ShowCurrentTooltip
    InteractProposed --> ShowProposedTooltip
    
    ShowCurrentTooltip --> RenderSplitView
    ShowProposedTooltip --> RenderSplitView
    
    RenderSplitView --> ViewMetrics: Scroll to metrics
    ViewMetrics --> BackToHome: Click back
    
    BackToHome --> Homepage
```

## File Organization

```
poultry-biochar-tool/
├── src/app/
│   ├── page.tsx                          # Homepage
│   └── details/
│       ├── [component]/
│       │   └── page.tsx                  # Dynamic detail page
│       └── layout.tsx                    # Shared layout
│
├── components/
│   ├── comparison/
│   │   ├── SplitSankeyComparison.tsx    # Main split view component
│   │   ├── BenefitMetricsBar.tsx        # Metrics display
│   │   ├── NonExistentCurrentView.tsx   # Empty state
│   │   └── ComparisonHeader.tsx         # Header with labels
│   │
│   ├── d3/
│   │   └── CircularSankeyHomepage.tsx   # Reused Sankey renderer
│   │
│   └── ui/
│       ├── Icon.tsx                      # Icon renderer
│       └── IconTooltip.tsx              # Tooltip component
│
├── data/
│   ├── diagrams/
│   │   ├── detail-farms-current.json
│   │   ├── detail-farms-proposed.json
│   │   ├── detail-chicken-house-current.json
│   │   ├── detail-chicken-house-proposed.json
│   │   ├── detail-processing-plant-current.json
│   │   ├── detail-processing-plant-proposed.json
│   │   ├── detail-anaerobic-digester-proposed.json
│   │   └── detail-pyrolysis-unit-proposed.json
│   │
│   └── benefits/
│       └── component-metrics.json        # New: benefit metrics data
│
└── COMPONENT_DETAIL_PAGES_ARCHITECTURE.md
```

## Responsive Behavior

```mermaid
graph LR
    A[Desktop 1200px+] --> B[Side-by-side 50/50]
    C[Tablet 768-1199px] --> D[Side-by-side adjusted]
    E[Mobile <768px] --> F[Stacked vertical]
    
    B --> G[Full diagram detail]
    D --> H[Reduced diagram size]
    F --> I[Simplified view]
    
    G --> J[Horizontal metrics]
    H --> J
    I --> K[Vertical metrics]
    
    style A fill:#4caf50
    style C fill:#ff9800
    style E fill:#f44336
```

## Color-Coding Strategy

```mermaid
graph TD
    A[Component Type] --> B{Has Current System?}
    
    B -->|Yes| C[Farm]
    B -->|Yes| D[Chicken House]
    B -->|Yes| E[Processing Plant]
    B -->|No| F[Anaerobic Digester]
    B -->|No| G[Pyrolysis Unit]
    
    C --> H[Red Border: Current]
    C --> I[Green Border: Proposed]
    
    D --> H
    D --> I
    
    E --> H
    E --> I
    
    F --> J[Gray/Empty: No Current]
    F --> K[Green Border: Proposed]
    
    G --> J
    G --> K
    
    style H fill:#ffebee,stroke:#ef4444,stroke-width:4px
    style I fill:#ecfdf5,stroke:#10b981,stroke-width:4px
    style J fill:#f5f5f5,stroke:#9e9e9e,stroke-width:2px,stroke-dasharray: 5 5
    style K fill:#ecfdf5,stroke:#10b981,stroke-width:4px
```

## User Journey Map

```mermaid
journey
    title User Experience Journey Through Detail Pages
    section Discovery
      Land on homepage: 5: User
      Toggle current/proposed: 4: User
      Notice "Explore Details": 3: User
    section Exploration
      Click Farm card: 5: User
      See side-by-side comparison: 5: User
      Hover over flows: 4: User
      Read tooltips: 4: User
    section Understanding
      Compare Current vs Proposed: 5: User
      View benefit metrics: 5: User
      Understand transformation: 5: User
    section Navigation
      Return to overview: 4: User
      Explore next component: 5: User
      Share insights: 4: User
```

---

**Legend:**
- 🟦 Blue: Navigation/Routing
- 🟩 Green: Core Components
- 🟧 Orange: Data/Metrics
- 🟥 Red: Visualization/Sankey
