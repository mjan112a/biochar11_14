# AI-Powered Diagram Import Specification

## 🎯 Feature Overview

Enable users to upload hand-drawn or photographed Sankey diagrams and automatically convert them to editable JSON format using Google Gemini Pro 2.5 vision AI.

## 🏗️ Architecture

### Components

```
User Upload
    ↓
ImageImportModal (React Component)
    ↓
/api/ai/parse-diagram (Next.js API Route)
    ↓
Google Gemini Pro 2.5 API
    ↓
Structured JSON Response
    ↓
Builder State (Load into Editor)
    ↓
User Refinement
```

### Data Flow

1. **Upload**: User drops/selects image file
2. **Preview**: Image displayed with upload progress
3. **Process**: Image sent to API with optional context hints
4. **Parse**: Gemini analyzes image and extracts diagram structure
5. **Validate**: Response validated against builder JSON schema
6. **Preview**: Generated diagram shown with confidence indicators
7. **Import**: User accepts and diagram loads into editor
8. **Refine**: User makes adjustments in visual editor

## 📋 Technical Specifications

### Image Upload Modal

**File:** `components/builder/ImageImportModal.tsx`

**Features:**
- Drag & drop zone
- File picker fallback
- Image preview
- Context hints input (optional)
- Processing progress indicator
- Result preview
- Confidence warnings
- Accept/Cancel actions

**Supported Formats:**
- PNG, JPG, JPEG, WebP
- Max size: 10MB
- Recommended: Clear lighting, straight angle, high contrast

### API Route

**Endpoint:** `/api/ai/parse-diagram`

**Method:** POST

**Request:**
```typescript
{
  image: File (multipart/form-data)
  contextHints?: string // e.g., "biochar system with chicken house"
  canvasSize?: { width: number, height: number }
}
```

**Response:**
```typescript
{
  success: boolean;
  data?: {
    nodes: BuilderNode[];
    links: BuilderLink[];
    config: DiagramConfig;
    metadata: {
      confidence: number; // 0-1
      warnings: string[];
      extractedText: string[];
      processingTime: number;
    };
  };
  error?: string;
}
```

### Gemini Prompt Template

**System Role:**
```
You are an expert at analyzing hand-drawn flow diagrams and Sankey diagrams. 
You extract nodes, connections, flow directions, and labels from images.
You MUST output valid JSON matching the exact schema provided.
```

**User Prompt:**
```
Analyze this Sankey diagram image and extract its structure.

Context hints: {contextHints}

EXTRACT:
1. NODES: All boxes/shapes representing process steps or components
   - Names (text inside/near shapes)
   - Positions (x,y coordinates, canvas is {width}x{height})
   - Rough sizes

2. LINKS: All arrows/flows between nodes
   - Source and target nodes
   - Direction (arrows, spatial flow)
   - Thickness (represents flow value)
   - Labels (text on flows)

3. LAYOUT: Overall spatial arrangement
   - Left-to-right flow?
   - Circular/loop connections?
   - Vertical positioning

OUTPUT EXACT JSON:
{
  "nodes": [
    {
      "id": "node-1",
      "name": "Extracted Name",
      "x": 200,
      "y": 300,
      "color": "#3B82F6",
      "width": 80,
      "height": 50
    }
  ],
  "links": [
    {
      "id": "link-1",
      "source": "node-1",
      "target": "node-2",
      "value": 10,
      "color": "#9CA3AF",
      "label": "Flow Name"
    }
  ],
  "config": {
    "width": {width},
    "height": {height},
    "nodePadding": 20,
    "nodeWidth": 80,
    "circularLinkGap": 20
  },
  "metadata": {
    "confidence": 0.85,
    "warnings": ["Node 3 text unclear"],
    "notes": "Left-to-right flow with one circular return"
  }
}

RULES:
- Node IDs must be unique strings
- Link source/target must reference existing node IDs
- Estimate positions proportionally to canvas size
- Value = flow thickness (1-50)
- If text is unclear, make best guess and add warning
- Default node color: #3B82F6 (blue)
- Default link color: #9CA3AF (gray)
- DO NOT include any text outside the JSON
```

### Validation Schema

**File:** `lib/aiDiagramValidator.ts`

```typescript
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function validateAIDiagram(data: any): ValidationResult {
  // Check required fields exist
  // Validate node IDs are unique
  // Validate link references exist
  // Check coordinate ranges
  // Validate data types
  // Return detailed validation result
}
```

## 🎨 User Interface

### Import Button Location

**Builder Toolbar** - Add between "Save" and "Preview" buttons:
```tsx
<button 
  onClick={() => setShowImportModal(true)}
  className="..."
>
  📷 Import from Image
</button>
```

### Modal Design

**Upload State:**
```
┌────────────────────────────────────┐
│  Import Diagram from Image    [X]  │
├────────────────────────────────────┤
│                                    │
│     ╔══════════════════════╗      │
│     ║   📷  Drop Image      ║      │
│     ║      or Click         ║      │
│     ╚══════════════════════╝      │
│                                    │
│  Context (optional):               │
│  [________________________]        │
│                                    │
│          [Upload & Parse]          │
└────────────────────────────────────┘
```

**Processing State:**
```
┌────────────────────────────────────┐
│  Analyzing Diagram...         [X]  │
├────────────────────────────────────┤
│                                    │
│     [Image Preview]                │
│                                    │
│  ⏳ AI is analyzing your diagram   │
│  ▓▓▓▓▓▓▓▓▓▓░░░░░░░░ 65%          │
│                                    │
│  Extracting nodes and flows...     │
└────────────────────────────────────┘
```

**Result Preview State:**
```
┌────────────────────────────────────┐
│  Import Preview               [X]  │
├────────────────────────────────────┤
│  ✓ 5 nodes extracted               │
│  ✓ 7 links identified              │
│  ⚠ 2 warnings                      │
│                                    │
│  [Mini canvas preview]             │
│                                    │
│  Warnings:                         │
│  • Node "Prcsng Plnt" - unclear   │
│  • Link value estimated            │
│                                    │
│    [Cancel]  [Import to Editor]    │
└────────────────────────────────────┘
```

## 🔧 Implementation Steps

### Phase 1: Core Infrastructure (Day 1)
- [x] Create specification document
- [ ] Set up Gemini API credentials
- [ ] Create API route structure
- [ ] Implement image upload handling
- [ ] Create basic Gemini integration

### Phase 2: Modal & UI (Day 1-2)
- [ ] Build ImageImportModal component
- [ ] Implement drag & drop
- [ ] Add context hints input
- [ ] Create processing UI
- [ ] Build preview component

### Phase 3: AI Integration (Day 2)
- [ ] Craft detailed Gemini prompt
- [ ] Implement JSON parsing
- [ ] Add validation logic
- [ ] Handle errors gracefully
- [ ] Add confidence scoring

### Phase 4: Builder Integration (Day 2-3)
- [ ] Add import button to toolbar
- [ ] Load AI result into builder state
- [ ] Add confidence indicators (yellow borders)
- [ ] Show warnings panel
- [ ] Enable immediate editing

### Phase 5: Testing & Refinement (Day 3)
- [ ] Test with various image types
- [ ] Test with hand-drawn sketches
- [ ] Test with photographed whiteboards
- [ ] Refine prompt for accuracy
- [ ] Add example images

## 📊 Success Metrics

### Target Accuracy
- **Node Extraction:** 80%+ (names and positions)
- **Link Identification:** 85%+ (connections correct)
- **Text Recognition:** 70%+ (clear handwriting)
- **Overall Usability:** 90%+ satisfaction

### Performance Targets
- **Processing Time:** <10 seconds for typical diagram
- **Success Rate:** 95%+ (valid JSON returned)
- **User Acceptance:** 80%+ of AI suggestions accepted

## 🚀 Future Enhancements

### v2.0 Features
- **Icon Matching:** AI suggests icons from library based on node names
- **Tooltip Generation:** AI creates initial tooltip content
- **Multi-page Support:** Handle complex diagrams split across pages
- **Learning:** Improve prompts based on user corrections
- **Templates:** Recognize common diagram patterns

### v3.0 Features
- **Batch Processing:** Upload multiple diagrams at once
- **Video Input:** Extract diagram from video of whiteboard session
- **Real-time Collab:** Multiple users refining AI output together
- **Export:** Generate beautiful renders from refined diagrams

## 🔐 Security & Privacy

### API Key Management
- Store Gemini API key in environment variables
- Never expose key to client
- Rate limiting on API route
- Usage monitoring

### Image Handling
- Images not stored server-side (unless user opts in)
- Temporary processing only
- Respect privacy - no data retention
- Option to delete uploaded images immediately

### Error Handling
- Graceful degradation if AI unavailable
- Clear error messages to user
- Fallback to manual creation
- Retry logic for temporary failures

## 💰 Cost Considerations

### Gemini Pro 2.5 Pricing (as of 2024)
- **Input:** ~$0.0001 per image
- **Output:** ~$0.0003 per 1K tokens
- **Est. per diagram:** $0.001 - $0.005

### Monthly Estimates
- 100 diagrams: $0.50
- 1,000 diagrams: $5.00
- 10,000 diagrams: $50.00

**Very affordable for this value!**

## 📖 User Documentation

### Quick Start Guide
1. Click "📷 Import from Image"
2. Drop or select your diagram image
3. (Optional) Add context hints
4. Click "Upload & Parse"
5. Review AI-generated diagram
6. Accept to load into editor
7. Refine positions and styling

### Best Practices
- **Good Lighting:** Clear, well-lit images work best
- **Straight Angle:** Avoid skewed perspectives
- **Clear Text:** Print or neat handwriting
- **High Contrast:** Dark lines on light background
- **Context Hints:** Add system type for better accuracy

### Troubleshooting
- **Low Confidence:** Review warnings, manual adjustment
- **Missing Nodes:** AI missed them - add manually
- **Wrong Connections:** Drag links to correct nodes
- **Text Errors:** Edit node names in style panel

## 🎯 Success Story Example

**Before AI Import:**
"I had a whiteboard diagram from our team meeting. Recreating it manually took 45 minutes - placing every node, drawing every connection, typing every label. Tedious!"

**After AI Import:**
"I snapped a photo, uploaded it, and got a working diagram in 30 seconds. Spent 5 minutes adjusting positions and adding colors. Total time: 5.5 minutes. 8x faster!"

## 📝 Notes

- This feature is **game-changing** for user adoption
- Lowers barrier to entry significantly
- Makes tool accessible to non-technical users
- Perfect complement to visual editor
- Differentiates from competitors

**Let's build this!** 🚀