# Icon Particle Animation - Implementation Guide

## Overview
This guide provides step-by-step instructions for implementing icon-based particle animation in the Sankey Builder.

## Prerequisites
- Type definitions updated in `types/builder.ts` ✅
- Familiarity with Canvas API and SVG rendering
- Understanding of the existing particle animation system

## Implementation Steps

### Step 1: Create Icon Loading Utility

Create `lib/iconLoader.ts`:

```typescript
interface IconCache {
  [key: string]: HTMLImageElement | null;
}

class IconLoader {
  private cache: IconCache = {};
  private loadingPromises: Map<string, Promise<HTMLImageElement>> = new Map();

  async loadIcon(iconPath: string): Promise<HTMLImageElement> {
    // Return from cache if available
    if (this.cache[iconPath]) {
      return this.cache[iconPath]!;
    }

    // Return existing promise if already loading
    if (this.loadingPromises.has(iconPath)) {
      return this.loadingPromises.get(iconPath)!;
    }

    // Create new loading promise
    const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // For CORS
      
      img.onload = () => {
        this.cache[iconPath] = img;
        this.loadingPromises.delete(iconPath);
        resolve(img);
      };
      
      img.onerror = () => {
        console.error(`Failed to load icon: ${iconPath}`);
        this.loadingPromises.delete(iconPath);
        reject(new Error(`Icon load failed: ${iconPath}`));
      };
      
      img.src = iconPath;
    });

    this.loadingPromises.set(iconPath, loadPromise);
    return loadPromise;
  }

  preloadIcons(iconPaths: string[]): Promise<void> {
    const promises = iconPaths.map(path => 
      this.loadIcon(path).catch(() => null)
    );
    return Promise.all(promises).then(() => {});
  }

  clearCache() {
    this.cache = {};
    this.loadingPromises.clear();
  }
}

export const iconLoader = new IconLoader();
```

### Step 2: Extend Particle Animator

Update `lib/flowParticleAnimator.ts`:

```typescript
import { BuilderLink, BuilderNode } from '@/types/builder';
import { iconLoader } from './iconLoader';

interface Particle {
  offset: number;
  speed: number;
  size: number;
  // New properties for icon particles
  type: 'dot' | 'icon';
  icon?: HTMLImageElement;
  rotation?: number;
}

class FlowParticleAnimator {
  private particles: Map<string, Particle[]> = new Map();
  
  // ... existing code ...

  private async createParticle(
    link: BuilderLink,
    sourceNode?: BuilderNode,
    targetNode?: BuilderNode
  ): Promise<Particle> {
    const particleType = link.particleType || 'dot';
    const size = link.animationSize || 4;
    const speed = (link.animationRate || 5) / 100;

    const particle: Particle = {
      offset: Math.random(),
      speed,
      size,
      type: particleType,
      rotation: 0
    };

    // Load icon if needed
    if (particleType === 'icon') {
      const iconPath = this.getIconPath(link, sourceNode, targetNode);
      if (iconPath) {
        try {
          particle.icon = await iconLoader.loadIcon(iconPath);
        } catch (error) {
          console.warn('Failed to load particle icon, falling back to dot', error);
          particle.type = 'dot';
        }
      } else {
        particle.type = 'dot';
      }
    }

    return particle;
  }

  private getIconPath(
    link: BuilderLink,
    sourceNode?: BuilderNode,
    targetNode?: BuilderNode
  ): string | null {
    // Custom icon specified
    if (link.particleIcon) {
      return link.particleIcon;
    }

    // Get icon from source/target
    const iconSource = link.particleIconSource || 'source';
    if (iconSource === 'source' && sourceNode?.icon) {
      return sourceNode.icon;
    }
    if (iconSource === 'target' && targetNode?.icon) {
      return targetNode.icon;
    }

    return null;
  }

  renderParticle(
    ctx: CanvasRenderingContext2D,
    particle: Particle,
    x: number,
    y: number,
    tangentAngle: number
  ) {
    ctx.save();

    if (particle.type === 'icon' && particle.icon) {
      // Render icon particle
      ctx.translate(x, y);
      ctx.rotate(tangentAngle);
      
      const size = particle.size * 2; // Icons should be slightly larger
      ctx.drawImage(
        particle.icon,
        -size / 2,
        -size / 2,
        size,
        size
      );
    } else {
      // Render dot particle (existing code)
      ctx.beginPath();
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    ctx.restore();
  }

  // ... rest of existing code ...
}
```

### Step 3: Update BuilderCanvas Component

Modify `components/builder/BuilderCanvas.tsx` to preload icons:

```typescript
useEffect(() => {
  // Preload all icons used in the diagram
  const iconPaths = new Set<string>();
  
  // Collect node icons
  nodes.forEach(node => {
    if (node.icon) iconPaths.add(node.icon);
  });

  // Collect particle icons
  links.forEach(link => {
    if (link.particleType === 'icon') {
      if (link.particleIcon) {
        iconPaths.add(link.particleIcon);
      } else {
        const source = nodes.find(n => n.id === link.source);
        const target = nodes.find(n => n.id === link.target);
        
        if (link.particleIconSource === 'target' && target?.icon) {
          iconPaths.add(target.icon);
        } else if (source?.icon) {
          iconPaths.add(source.icon);
        }
      }
    }
  });

  iconLoader.preloadIcons(Array.from(iconPaths));
}, [nodes, links]);
```

### Step 4: Add UI Controls to StylePanel

Update `components/builder/StylePanel.tsx`:

```typescript
// Add to link editing section
{selectedLink && (
  <>
    {/* ... existing controls ... */}
    
    {/* Particle Type Selection */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        Particle Type
      </label>
      <select
        value={selectedLink.particleType || 'dot'}
        onChange={(e) => updateLink({
          ...selectedLink,
          particleType: e.target.value as 'dot' | 'icon'
        })}
        className="w-full p-2 border rounded"
      >
        <option value="dot">Dot</option>
        <option value="icon">Icon</option>
      </select>
    </div>

    {/* Icon Source (only show if particleType is 'icon') */}
    {selectedLink.particleType === 'icon' && (
      <>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Icon Source
          </label>
          <select
            value={selectedLink.particleIconSource || 'source'}
            onChange={(e) => updateLink({
              ...selectedLink,
              particleIconSource: e.target.value as 'source' | 'target' | 'custom'
            })}
            className="w-full p-2 border rounded"
          >
            <option value="source">From Source Node</option>
            <option value="target">From Target Node</option>
            <option value="custom">Custom Icon</option>
          </select>
        </div>

        {/* Custom Icon Input (only show if iconSource is 'custom') */}
        {selectedLink.particleIconSource === 'custom' && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Custom Icon Path
            </label>
            <input
              type="text"
              value={selectedLink.particleIcon || ''}
              onChange={(e) => updateLink({
                ...selectedLink,
                particleIcon: e.target.value
              })}
              placeholder="/images/icons/custom.svg"
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the path to your custom icon (SVG or PNG)
            </p>
          </div>
        )}
      </>
    )}
  </>
)}
```

### Step 5: Update Example Diagrams

Add icon particle examples to test diagrams:

```json
{
  "id": "chicken-flow",
  "source": "chicken-house",
  "target": "processing-plant",
  "value": 5,
  "label": "Live Chickens",
  "color": "#4ade80",
  "animationRate": 3,
  "animationFrequency": 5,
  "animationSize": 6,
  "particleType": "icon",
  "particleIconSource": "source"
}
```

## Testing Checklist

- [ ] Dot particles still work correctly
- [ ] Icon particles load and render properly
- [ ] Icon source selection (source/target/custom) works
- [ ] Custom icon path input works
- [ ] Icon particles animate smoothly (60fps)
- [ ] Icons rotate along path correctly
- [ ] Fallback to dots if icon fails to load
- [ ] Performance with 20+ animated icon particles
- [ ] Icons display at correct size
- [ ] Different icon types (SVG, PNG) work

## Performance Optimization Tips

1. **Icon Caching**: Icons are loaded once and cached
2. **Canvas Optimization**: Use off-screen canvas for complex icons
3. **Particle Count**: Limit to ~50 particles total for smooth animation
4. **Icon Size**: Keep icon files small (<50KB)
5. **Frame Rate**: Monitor and maintain 60fps

## Troubleshooting

### Icons Not Showing
- Check icon path is correct and accessible
- Verify CORS settings for external icons
- Check browser console for loading errors

### Poor Performance
- Reduce particle count (animationFrequency)
- Use smaller icon files
- Consider using PNG instead of complex SVG

### Icons Not Rotating
- Ensure tangent angle is calculated correctly
- Check ctx.rotate() is applied before drawing

## Future Enhancements

- Icon trail effects
- Animated icon sprites
- Multiple icon types per flow
- Icon transformation along path
- Particle glow/shadow effects
