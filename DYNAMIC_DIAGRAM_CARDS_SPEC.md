# Dynamic Diagram Cards Feature Specification

## Overview
Add the ability to dynamically add, remove, and update Sankey diagram cards on the homepage, allowing the homepage to display any number of uploaded diagrams.

## User Requirements
- Homepage should display multiple Sankey diagram visualizations
- Admin/user can add new diagram cards
- Each card can load a different diagram JSON file
- Cards appear below the main "Material Flow Visualization"
- Easy to update diagrams by uploading new JSON files
- Cards can be reordered, edited, or removed

## Technical Architecture

### 1. Data Structure

#### Diagram Card Configuration
```typescript
interface DiagramCard {
  id: string;
  title: string;
  description: string;
  diagramPath: string;  // Path to JSON file in /data/diagrams/
  order: number;
  createdAt: string;
  updatedAt: string;
  visible: boolean;
}
```

#### Homepage Diagrams Config
```json
// data/homepage-diagrams.json
{
  "diagrams": [
    {
      "id": "main-flow",
      "title": "Material Flow Visualization",
      "description": "Complete system showing all material flows",
      "diagramPath": "/data/diagrams/biochar-complete-system.json",
      "order": 1,
      "visible": true
    },
    {
      "id": "chicken-house-detail",
      "title": "Chicken House Detail",
      "description": "Focused view of chicken house inputs and outputs",
      "diagramPath": "/data/diagrams/chicken-house-proposed.json",
      "order": 2,
      "visible": true
    }
  ]
}
```

### 2. Component Structure

#### DiagramCard Component
```typescript
// components/homepage/DiagramCard.tsx
interface DiagramCardProps {
  card: DiagramCard;
  onEdit?: (card: DiagramCard) => void;
  onDelete?: (id: string) => void;
  editable?: boolean;
}

export function DiagramCard({ card, onEdit, onDelete, editable }: DiagramCardProps) {
  const [diagramData, setDiagramData] = useState(null);
  
  useEffect(() => {
    // Load diagram JSON from path
    fetch(card.diagramPath)
      .then(res => res.json())
      .then(setDiagramData);
  }, [card.diagramPath]);
  
  return (
    <section className="mb-12">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{card.title}</h2>
            <p className="text-gray-600">{card.description}</p>
          </div>
          {editable && (
            <div className="flex gap-2">
              <button onClick={() => onEdit?.(card)}>✏️ Edit</button>
              <button onClick={() => onDelete?.(card.id)}>🗑️ Delete</button>
            </div>
          )}
        </div>
        
        {diagramData && (
          <BuilderCanvas
            nodes={diagramData.nodes}
            links={diagramData.links}
            mode="preview"
            // ... other props
          />
        )}
      </div>
    </section>
  );
}
```

#### DiagramManager Component
```typescript
// components/homepage/DiagramManager.tsx
export function DiagramManager() {
  const [cards, setCards] = useState<DiagramCard[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Load cards from config
  useEffect(() => {
    fetch('/data/homepage-diagrams.json')
      .then(res => res.json())
      .then(data => setCards(data.diagrams));
  }, []);
  
  const handleAddCard = (newCard: DiagramCard) => {
    setCards([...cards, newCard]);
    // Save to config file
  };
  
  const handleUploadDiagram = async (file: File) => {
    // Upload diagram JSON to /data/diagrams/
    // Create new card entry
    // Add to cards list
  };
  
  return (
    <div>
      {cards
        .filter(c => c.visible)
        .sort((a, b) => a.order - b.order)
        .map(card => (
          <DiagramCard
            key={card.id}
            card={card}
            editable={editMode}
            onEdit={handleEditCard}
            onDelete={handleDeleteCard}
          />
        ))}
      
      {editMode && (
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-green-500 text-white px-6 py-3 rounded-lg"
        >
          ➕ Add New Diagram Card
        </button>
      )}
      
      {showUploadModal && (
        <DiagramUploadModal
          onUpload={handleUploadDiagram}
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </div>
  );
}
```

#### DiagramUploadModal Component
```typescript
// components/homepage/DiagramUploadModal.tsx
export function DiagramUploadModal({ onUpload, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  const handleSubmit = async () => {
    if (!file) return;
    
    // Read file content
    const content = await file.text();
    const diagramData = JSON.parse(content);
    
    // Create new card
    const newCard: DiagramCard = {
      id: generateId(),
      title,
      description,
      diagramPath: `/data/diagrams/${file.name}`,
      order: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      visible: true
    };
    
    onUpload(newCard, diagramData);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Add New Diagram</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter diagram title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter diagram description"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Diagram JSON File
            </label>
            <input
              type="file"
              accept=".json"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title || !file}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
            >
              Add Diagram
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 3. Homepage Integration

Update `src/app/page.tsx`:

```typescript
export default function HomePage() {
  const [editMode, setEditMode] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-amber-50">
      <header>
        {/* ... existing header ... */}
        
        {/* Admin toggle button */}
        <button
          onClick={() => setEditMode(!editMode)}
          className="absolute top-4 right-4"
        >
          {editMode ? '👁️ View Mode' : '✏️ Edit Mode'}
        </button>
      </header>
      
      {/* ... existing hero section ... */}
      
      <main>
        {/* Dynamic Diagram Cards */}
        <DiagramManager editMode={editMode} />
      </main>
      
      {/* ... existing footer ... */}
    </div>
  );
}
```

### 4. File Storage Options

#### Option A: Client-Side Only (Temporary)
- Store in localStorage
- No persistence across sessions
- Good for testing/development

#### Option B: JSON File Storage
- Save to `/data/homepage-diagrams.json`
- Upload diagrams to `/data/diagrams/`
- Simple, no database needed
- Requires file system access

#### Option C: Database Storage (Recommended for Production)
- Store card metadata in database
- Upload diagrams to cloud storage or local `/data/diagrams/`
- Proper user authentication
- Full CRUD operations

### 5. Implementation Phases

#### Phase 1: Basic Structure
- [ ] Create DiagramCard component
- [ ] Create homepage-diagrams.json config file
- [ ] Load and display configured diagrams
- [ ] Test with existing diagram files

#### Phase 2: Add Functionality
- [ ] Create DiagramUploadModal component
- [ ] Implement file upload handling
- [ ] Add new card creation
- [ ] Save updated config

#### Phase 3: Management Features
- [ ] Add edit mode toggle
- [ ] Implement card reordering (drag & drop)
- [ ] Add delete functionality
- [ ] Add show/hide toggle

#### Phase 4: Polish & Features
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add preview before uploading
- [ ] Add diagram validation
- [ ] Add card animations

## Security Considerations

1. **File Validation**: Validate JSON structure before accepting uploads
2. **Access Control**: Protect edit mode with authentication
3. **File Size Limits**: Prevent large file uploads
4. **Path Sanitization**: Ensure uploaded files go to safe locations

## User Workflow

### Adding a New Diagram:
1. Click "✏️ Edit Mode" button (admin only)
2. Scroll to bottom of diagrams
3. Click "➕ Add New Diagram Card"
4. Fill in title and description
5. Upload diagram JSON file
6. Click "Add Diagram"
7. New card appears on homepage

### Updating a Diagram:
1. Enter edit mode
2. Click "✏️ Edit" on desired card
3. Upload new JSON file or edit details
4. Save changes

### Removing a Diagram:
1. Enter edit mode
2. Click "🗑️ Delete" on unwanted card
3. Confirm deletion

## Benefits

- **Flexible Homepage**: Easy to add/remove content
- **Always Current**: Upload latest diagrams anytime
- **No Code Changes**: Update homepage without deploying
- **Showcase Multiple Views**: Display various system perspectives
- **Professional Presentation**: Clean, card-based layout

## Example Use Cases

1. **Monthly Updates**: Upload new diagram showing current system metrics
2. **Comparison Views**: Show before/after system improvements
3. **Component Deep Dives**: Add detailed views of each major component
4. **Client Presentations**: Customize homepage for specific audiences
5. **Version History**: Keep historical diagrams visible
