import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BuilderNode, BuilderLink, DiagramConfig } from '@/types/builder';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface AIResponse {
  nodes: BuilderNode[];
  links: BuilderLink[];
  config: DiagramConfig;
  metadata?: {
    confidence?: number;
    warnings?: string[];
    notes?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const contextHints = formData.get('contextHints') as string || '';
    const canvasWidth = parseInt(formData.get('canvasWidth') as string || '1000');
    const canvasHeight = parseInt(formData.get('canvasHeight') as string || '1100');

    if (!imageFile) {
      return NextResponse.json(
        { success: false, error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Convert image to base64
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Get file mime type
    const mimeType = imageFile.type || 'image/jpeg';

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Craft the prompt
    const prompt = `Analyze this Sankey diagram image and extract its structure.

Context hints: ${contextHints || 'General flow diagram'}

EXTRACT:
1. NODES: All boxes/shapes representing process steps or components
   - Names (text inside/near shapes)
     * If you see "<br/>" or "<br>" in the text, PRESERVE IT EXACTLY as "<br/>" in the name
     * This indicates a line break that will be rendered in the UI
     * Example: "Used Poultry<br/>Litter" should be extracted as "Used Poultry<br/>Litter"
   - Positions (x,y coordinates, canvas is ${canvasWidth}x${canvasHeight})
   - Rough sizes
   - COLORS based on semantic meaning:
     * Waste/byproducts/manure → #92400E (brown) or #78350F (dark brown)
     * Energy/power/electricity → #F59E0B (amber) or #EAB308 (yellow)
     * Clean products/outputs → #10B981 (green) or #14B8A6 (teal)
     * Raw materials/inputs → #6B7280 (gray) or #9CA3AF (light gray)
     * Water/liquids → #3B82F6 (blue) or #06B6D4 (cyan)
     * Processing/equipment → #8B5CF6 (purple) or #6366F1 (indigo)
     * Organic matter → #84CC16 (lime) or #22C55E (green)
     * Carbon/biochar → #1F2937 (dark gray) or #374151 (gray)

2. LINKS: All arrows/flows between nodes
   - Source and target nodes
   - Direction (arrows, spatial flow)
   - Thickness (represents flow value, estimate 1-50)
   - Labels (text on flows)
   - COLORS: Match the color of the material being transferred
     * If material is waste → use brown/gray
     * If material is energy → use yellow/orange
     * If material is clean product → use green/teal
     * Similar materials should have similar colors

3. LAYOUT: Overall spatial arrangement
   - Left-to-right flow?
   - Circular/loop connections?
   - Vertical positioning

OUTPUT EXACT JSON (no markdown, no code blocks, JUST the JSON):
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
    "width": ${canvasWidth},
    "height": ${canvasHeight},
    "nodePadding": 20,
    "nodeWidth": 80,
    "circularLinkGap": 20
  },
  "metadata": {
    "confidence": 0.85,
    "warnings": ["Node 3 text unclear"],
    "notes": "Left-to-right flow"
  }
}

RULES:
- Node IDs must be unique strings (e.g., "node-1", "node-2")
- Link source/target must reference existing node IDs
- Estimate positions proportionally to canvas size ${canvasWidth}x${canvasHeight}
- Value = flow thickness (1-50, thicker = higher value)
- If text is unclear, make best guess and add warning
- Output ONLY the JSON, no other text
- Ensure all node IDs are referenced correctly in links
- IMPORTANT: If you see "<br/>" or "<br>" in node text, preserve it EXACTLY as "<br/>" in the name field
- Line breaks: Text with multiple lines should use "<br/>" between lines in the name field
- COLOR ASSIGNMENT IS CRITICAL:
  * Analyze the semantic meaning of each node and link
  * Assign colors based on material type and similarity
  * Similar materials = similar colors
  * Energy flows = warm colors (yellow, orange, red)
  * Waste/organic = earth tones (brown, tan, dark green)
  * Clean/processed = bright colors (green, teal, blue)
  * Equipment/processes = purple, indigo
  * Use the color palette above to maintain consistency
  * Links should match the color of the material they transport`;

    // Call Gemini API
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Image,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();

    // Clean up response (remove markdown code blocks if present)
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    // Parse the JSON
    let parsedData: AIResponse;
    try {
      parsedData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', cleanedText);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to parse AI response. The AI may have returned invalid JSON.',
          rawResponse: text,
        },
        { status: 500 }
      );
    }

    // Validate the response
    if (!parsedData.nodes || !Array.isArray(parsedData.nodes)) {
      return NextResponse.json(
        { success: false, error: 'Invalid response: missing nodes array' },
        { status: 500 }
      );
    }

    if (!parsedData.links || !Array.isArray(parsedData.links)) {
      return NextResponse.json(
        { success: false, error: 'Invalid response: missing links array' },
        { status: 500 }
      );
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      data: parsedData,
    });

  } catch (error: any) {
    console.error('Error parsing diagram:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An error occurred while processing the image',
      },
      { status: 500 }
    );
  }
}