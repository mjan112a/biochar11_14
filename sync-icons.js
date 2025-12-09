/**
 * Icon Sync Script
 *
 * This script copies icons from the biochar-website-v5 iconslibrary to
 * public/images/iconslibrary/ to maintain a single source of truth for all icons.
 *
 * Source: C:\Users\myers\githuprepo\Biochar2\biochar-website-v5\public\images\iconslibrary
 *
 * Usage:
 *   node sync-icons.js [--register]
 *
 * Options:
 *   --register: Also add new icons to the registry (requires manual category selection)
 */

const fs = require('fs');
const path = require('path');

// Directories - Use biochar-website-v5 as the single source of truth for icons
const V5_PROJECT_ROOT = path.resolve(__dirname, '..', 'biochar-website-v5');
const SOURCE_DIR = path.join(V5_PROJECT_ROOT, 'public', 'images', 'iconslibrary');
const DEST_DIR = path.join(__dirname, 'public', 'images', 'iconslibrary');
const REGISTRY_FILE = path.join(__dirname, 'public', 'data', 'icons-registry.json');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`✓ Created directory: ${dir}`, 'green');
  }
}

function getIconsInDirectory(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir).filter(file => file.endsWith('.svg'));
}

function copyIcon(filename) {
  const sourcePath = path.join(SOURCE_DIR, filename);
  const destPath = path.join(DEST_DIR, filename);
  
  try {
    fs.copyFileSync(sourcePath, destPath);
    return true;
  } catch (error) {
    log(`✗ Failed to copy ${filename}: ${error.message}`, 'red');
    return false;
  }
}

function getRegisteredIcons() {
  try {
    const registry = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8'));
    const registered = new Set();
    
    registry.categories.forEach(category => {
      category.icons.forEach(icon => {
        registered.add(icon.file);
      });
    });
    
    return registered;
  } catch (error) {
    log(`✗ Failed to read registry: ${error.message}`, 'red');
    return new Set();
  }
}

function main() {
  log('\n🎨 Icon Sync Tool\n', 'blue');
  log('Single Source of Truth: biochar-website-v5 iconslibrary\n', 'blue');
  
  // Check if source directory exists
  if (!fs.existsSync(SOURCE_DIR)) {
    log(`✗ Source directory not found: ${SOURCE_DIR}`, 'red');
    log(`\nMake sure the biochar-website-v5 project is located at:`, 'yellow');
    log(`  ${V5_PROJECT_ROOT}`, 'yellow');
    return;
  }
  
  // Ensure destination directory exists
  ensureDirectoryExists(DEST_DIR);
  
  // Get icons from source directory
  const sourceIcons = getIconsInDirectory(SOURCE_DIR);
  const destIcons = getIconsInDirectory(DEST_DIR);
  const registeredIcons = getRegisteredIcons();
  
  if (sourceIcons.length === 0) {
    log(`No icons found in ${SOURCE_DIR}`, 'yellow');
    return;
  }
  
  log(`Found ${sourceIcons.length} icon(s) in source directory\n`);
  
  // Copy icons
  let copiedCount = 0;
  let skippedCount = 0;
  const newIcons = [];
  
  sourceIcons.forEach(filename => {
    const destPath = path.join(DEST_DIR, filename);
    const exists = fs.existsSync(destPath);
    
    if (!exists) {
      if (copyIcon(filename)) {
        log(`✓ Copied: ${filename}`, 'green');
        copiedCount++;
        
        if (!registeredIcons.has(filename)) {
          newIcons.push(filename);
        }
      }
    } else {
      // Check if file is different
      const sourceContent = fs.readFileSync(path.join(SOURCE_DIR, filename));
      const destContent = fs.readFileSync(destPath);
      
      if (!sourceContent.equals(destContent)) {
        if (copyIcon(filename)) {
          log(`✓ Updated: ${filename}`, 'yellow');
          copiedCount++;
        }
      } else {
        log(`- Skipped (already exists): ${filename}`, 'reset');
        skippedCount++;
      }
    }
  });
  
  // Summary
  log('\n' + '─'.repeat(50));
  log(`Total: ${sourceIcons.length}`, 'blue');
  log(`Copied/Updated: ${copiedCount}`, 'green');
  log(`Skipped: ${skippedCount}`, 'yellow');
  
  // Check for unregistered icons
  if (newIcons.length > 0) {
    log('\n⚠️  Unregistered Icons:', 'yellow');
    log('The following icons need to be added to icons-registry.json:\n', 'yellow');
    
    newIcons.forEach(filename => {
      const name = filename
        .replace(/-\d+\.svg$/, '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      log(`  ${filename}`, 'yellow');
      log(`  Suggested entry:`, 'reset');
      log(`  {
    "name": "${name}",
    "file": "${filename}",
    "keywords": "keyword1, keyword2, keyword3"
  }\n`, 'reset');
    });
    
    log('Add these entries to the appropriate category in:', 'yellow');
    log(`  ${REGISTRY_FILE}\n`, 'yellow');
  }
  
  log('✓ Sync complete!\n', 'green');
}

// Run the script
main();