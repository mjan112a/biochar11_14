'use client';

interface NodePaletteProps {
  onAddNode: () => void;
  onStartConnection: () => void;
  disabled?: boolean;
}

export default function NodePalette({
  onAddNode,
  onStartConnection,
  disabled = false,
}: NodePaletteProps) {
  return (
    <div className="w-64 bg-card border-r border-border p-4 space-y-6">
      <div>
        <h2 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider">Palette</h2>
        
        <div className="space-y-2">
          {/* Add Node Button */}
          <button
            onClick={onAddNode}
            disabled={disabled}
            className="w-full bg-primary text-primary-foreground py-3 px-4 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm border border-primary/20 group"
            title="Add new node (N)"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">➕</span>
            <span className="font-mono font-semibold uppercase text-sm">Add Node</span>
          </button>

          {/* Start Connection Button */}
          <button
            onClick={onStartConnection}
            disabled={disabled}
            className="w-full bg-secondary text-secondary-foreground py-3 px-4 border border-border hover:bg-secondary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm group"
            title="Draw connection (C)"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">🔗</span>
            <span className="font-mono font-semibold uppercase text-sm">Connect</span>
          </button>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">Shortcuts</h3>
        <div className="space-y-2 text-xs text-muted-foreground font-mono">
          <div className="flex justify-between items-center">
            <span>Add Node</span>
            <kbd className="bg-secondary px-2 py-1 border border-border text-foreground">N</kbd>
          </div>
          <div className="flex justify-between items-center">
            <span>Connect</span>
            <kbd className="bg-secondary px-2 py-1 border border-border text-foreground">C</kbd>
          </div>
          <div className="flex justify-between items-center">
            <span>Delete</span>
            <kbd className="bg-secondary px-2 py-1 border border-border text-foreground">Del</kbd>
          </div>
          <div className="flex justify-between items-center">
            <span>Cancel</span>
            <kbd className="bg-secondary px-2 py-1 border border-border text-foreground">Esc</kbd>
          </div>
          <div className="flex justify-between items-center">
            <span>Save</span>
            <kbd className="bg-secondary px-2 py-1 border border-border text-foreground">Ctrl+S</kbd>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">Guide</h3>
        <ol className="space-y-3 text-xs text-muted-foreground font-mono">
          <li className="flex gap-2">
            <span className="text-primary">01.</span>
            <span>Click "Add Node" to spawn entity</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">02.</span>
            <span>Drag to reposition</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">03.</span>
            <span>"Connect" to link nodes</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">04.</span>
            <span>Select to configure properties</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">05.</span>
            <span>Delete to remove artifacts</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
