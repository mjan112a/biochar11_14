import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

/**
 * API Route: POST /api/diagrams/config
 * 
 * Adds a new diagram card to the homepage configuration
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, diagramPath, order, visible } = body;

    // Validate required fields
    if (!title || !description || !diagramPath) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, diagramPath' },
        { status: 400 }
      );
    }

    // Read existing configuration
    const configPath = join(process.cwd(), 'public', 'data', 'homepage-diagrams.json');
    const configContent = await readFile(configPath, 'utf-8');
    const config = JSON.parse(configContent);

    // Create new card
    const newCard = {
      id: `diagram-${Date.now()}`,
      title,
      description,
      diagramPath,
      order: order || config.cards.length + 1,
      visible: visible !== undefined ? visible : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add card to configuration
    config.cards.push(newCard);
    config.lastUpdated = new Date().toISOString();

    // Write updated configuration
    await writeFile(configPath, JSON.stringify(config, null, 2));

    return NextResponse.json({
      success: true,
      card: newCard,
    });

  } catch (error) {
    console.error('Error updating config:', error);
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 }
    );
  }
}

/**
 * API Route: DELETE /api/diagrams/config
 * 
 * Removes a diagram card from the homepage configuration
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cardId = searchParams.get('id');

    if (!cardId) {
      return NextResponse.json(
        { error: 'Missing card ID' },
        { status: 400 }
      );
    }

    // Read existing configuration
    const configPath = join(process.cwd(), 'public', 'data', 'homepage-diagrams.json');
    const configContent = await readFile(configPath, 'utf-8');
    const config = JSON.parse(configContent);

    // Find and remove card
    const initialLength = config.cards.length;
    config.cards = config.cards.filter((card: any) => card.id !== cardId);

    if (config.cards.length === initialLength) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    config.lastUpdated = new Date().toISOString();

    // Write updated configuration
    await writeFile(configPath, JSON.stringify(config, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Card deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting card:', error);
    return NextResponse.json(
      { error: 'Failed to delete card' },
      { status: 500 }
    );
  }
}

/**
 * API Route: PATCH /api/diagrams/config
 * 
 * Updates card visibility
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardId, visible } = body;

    if (!cardId || visible === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: cardId, visible' },
        { status: 400 }
      );
    }

    // Read existing configuration
    const configPath = join(process.cwd(), 'public', 'data', 'homepage-diagrams.json');
    const configContent = await readFile(configPath, 'utf-8');
    const config = JSON.parse(configContent);

    // Find and update card
    const card = config.cards.find((c: any) => c.id === cardId);
    if (!card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    card.visible = visible;
    card.updatedAt = new Date().toISOString();
    config.lastUpdated = new Date().toISOString();

    // Write updated configuration
    await writeFile(configPath, JSON.stringify(config, null, 2));

    return NextResponse.json({
      success: true,
      card,
    });

  } catch (error) {
    console.error('Error updating visibility:', error);
    return NextResponse.json(
      { error: 'Failed to update visibility' },
      { status: 500 }
    );
  }
}