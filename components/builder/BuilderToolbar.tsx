'use client';

import { EditorMode } from '@/types/builder';
import { DiagramTheme } from '@/types/builder-theme';
import { ThemeSelector } from './ThemeSelector';

interface BuilderToolbarProps {
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  currentTheme: DiagramTheme;
  onThemeChange: (theme: DiagramTheme) => void;
  onEditTheme: () => void;
  onSave: () => void;
  onSaveAs?: () => void;
  onLoad: () => void;
  onImportFromImage: () => void;
  onClear: () => void;
  loadedFileName?: string | null;
}

export default function BuilderToolbar({
  mode,
  onModeChange,
  currentTheme,
  onThemeChange,
  onEditTheme,
  onSave,
  onSaveAs,
  onLoad,
  onImportFromImage,
  onClear,
  loadedFileName,
}: BuilderToolbarProps) {
  return (
    <div className="bg-card border-b border-border px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-6">
          <h1 className="text-lg font-bold flex items-center text-foreground uppercase tracking-wide">
            <span className="mr-2 text-primary">⚡</span>
            Sankey.OS Builder
          </h1>
          
          {/* Mode Toggle */}
          <div className="flex bg-secondary border border-border p-1">
            <button
              onClick={() => onModeChange('edit')}
              className={`px-4 py-1.5 text-sm font-mono transition-all ${
                mode === 'edit'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              EDIT
            </button>
            <button
              onClick={() => onModeChange('preview')}
              className={`px-4 py-1.5 text-sm font-mono transition-all ${
                mode === 'preview'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              PREVIEW
            </button>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center space-x-2 border-l border-border pl-4">
            <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />
            <button
              onClick={onEditTheme}
              className="bg-secondary hover:bg-secondary/80 border border-border px-3 py-2 text-foreground transition-all"
              title="Edit theme"
            >
              🎨
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Show loaded filename if available */}
          {loadedFileName && (
            <div className="flex items-center px-3 py-1.5 bg-secondary/50 border border-border text-muted-foreground text-xs font-mono">
              <span className="mr-1">📄</span>
              <span className="truncate max-w-[150px]" title={loadedFileName}>
                {loadedFileName}
              </span>
            </div>
          )}
          
          <button
            onClick={onSave}
            className="bg-secondary hover:bg-secondary/80 border border-border px-4 py-2 text-foreground text-sm font-medium transition-all flex items-center space-x-2"
            title={loadedFileName ? `Save to ${loadedFileName} (Ctrl+S)` : "Save diagram (Ctrl+S)"}
          >
            <span>💾</span>
            <span className="font-mono uppercase">Save</span>
          </button>
          
          {onSaveAs && (
            <button
              onClick={onSaveAs}
              className="bg-secondary hover:bg-secondary/80 border border-border px-4 py-2 text-foreground text-sm font-medium transition-all flex items-center space-x-2"
              title="Save As... (Ctrl+Shift+S)"
            >
              <span>📄</span>
              <span className="font-mono uppercase">Save As</span>
            </button>
          )}
          
          <button
            onClick={onLoad}
            className="bg-secondary hover:bg-secondary/80 border border-border px-4 py-2 text-foreground text-sm font-medium transition-all flex items-center space-x-2"
            title="Load diagram (Ctrl+O)"
          >
            <span>📁</span>
            <span className="font-mono uppercase">Load</span>
          </button>
          
          <button
            onClick={onImportFromImage}
            className="bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary px-4 py-2 text-sm font-medium transition-all flex items-center space-x-2"
            title="Import from image using AI"
          >
            <span>📷</span>
            <span className="font-mono uppercase">AI Import</span>
          </button>
          
          <button
            onClick={onClear}
            className="bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 text-destructive px-4 py-2 text-sm font-medium transition-all flex items-center space-x-2"
            title="Clear all"
          >
            <span>🗑️</span>
            <span className="font-mono uppercase">Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
}
