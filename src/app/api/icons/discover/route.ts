import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * Auto-discovery API for icon library
 * Automatically finds all SVG files in public/images/iconslibrary
 * No JSON registration required!
 */

interface IconInfo {
  name: string;
  file: string;
  path: string;
  keywords: string[];
}

/**
 * Generate a human-readable name from filename
 */
function generateIconName(filename: string): string {
  // Remove .svg extension and version numbers
  const baseName = filename.replace(/\.svg$/i, '').replace(/-\d+$/, '');
  
  // Split by hyphens and capitalize each word
  return baseName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate keywords from filename for search
 */
function generateKeywords(filename: string): string[] {
  const baseName = filename.replace(/\.svg$/i, '').replace(/-\d+$/, '');
  const words = baseName.split('-');
  
  // Include the full name, individual words, and partial matches
  return [
    baseName, // full filename without extension
    ...words, // individual words
    ...words.map(w => w.toLowerCase()), // lowercase versions
  ];
}

/**
 * Scan directory for SVG files
 */
function discoverIcons(directory: string): IconInfo[] {
  try {
    if (!fs.existsSync(directory)) {
      console.warn(`Icon directory not found: ${directory}`);
      return [];
    }

    const files = fs.readdirSync(directory);
    const svgFiles = files.filter(file => file.toLowerCase().endsWith('.svg'));

    return svgFiles.map(file => ({
      name: generateIconName(file),
      file: file,
      path: `/images/iconslibrary/${file}`,
      keywords: generateKeywords(file),
    }));
  } catch (error) {
    console.error('Error discovering icons:', error);
    return [];
  }
}

export async function GET() {
  try {
    // Path to icon library directory
    const iconsDirectory = path.join(process.cwd(), 'public', 'images', 'iconslibrary');
    
    // Discover all icons
    const icons = discoverIcons(iconsDirectory);
    
    // Sort alphabetically by name
    icons.sort((a, b) => a.name.localeCompare(b.name));
    
    return NextResponse.json({
      success: true,
      count: icons.length,
      icons: icons,
      message: `Found ${icons.length} icon(s) in library`,
    });
  } catch (error) {
    console.error('Icon discovery error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to discover icons',
        icons: [],
      },
      { status: 500 }
    );
  }
}