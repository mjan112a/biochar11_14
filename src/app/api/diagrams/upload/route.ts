import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * API Route: POST /api/diagrams/upload
 * 
 * Handles uploading of diagram JSON files to /public/data/diagrams/
 * Validates the JSON structure before saving
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.json')) {
      return NextResponse.json(
        { error: 'File must be a JSON file' },
        { status: 400 }
      );
    }

    // Read file content
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const content = buffer.toString('utf-8');

    // Validate JSON structure
    let jsonData;
    try {
      jsonData = JSON.parse(content);
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid JSON file' },
        { status: 400 }
      );
    }

    // Validate required structure
    if (!jsonData.nodes || !Array.isArray(jsonData.nodes)) {
      return NextResponse.json(
        { error: 'Invalid diagram format: missing nodes array' },
        { status: 400 }
      );
    }

    if (!jsonData.links || !Array.isArray(jsonData.links)) {
      return NextResponse.json(
        { error: 'Invalid diagram format: missing links array' },
        { status: 400 }
      );
    }

    if (!jsonData.config || typeof jsonData.config !== 'object') {
      return NextResponse.json(
        { error: 'Invalid diagram format: missing config object' },
        { status: 400 }
      );
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const originalName = file.name.replace('.json', '');
    const safeFilename = originalName.replace(/[^a-zA-Z0-9-_]/g, '-');
    const filename = `${safeFilename}-${timestamp}.json`;

    // Ensure directory exists
    const uploadsDir = join(process.cwd(), 'public', 'data', 'diagrams');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save file
    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, content);

    // Return success with file info
    return NextResponse.json({
      success: true,
      filename,
      path: `/data/diagrams/${filename}`,
      nodeCount: jsonData.nodes.length,
      linkCount: jsonData.links.length,
    });

  } catch (error) {
    console.error('Error uploading diagram:', error);
    return NextResponse.json(
      { error: 'Failed to upload diagram' },
      { status: 500 }
    );
  }
}