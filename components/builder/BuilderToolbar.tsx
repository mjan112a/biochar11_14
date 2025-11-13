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
  onLoad: () => void;
  onImportFromImage: () => void;
  onClear: () => void;
}

export default function BuilderToolbar({
  mode,
  onModeChange,
  currentTheme,
  onThemeChange,
  onEditTheme,
  onSave,
  onLoad,
  onImportFromImage,
  onClear,
}: BuilderToolbarProps) {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold flex items-center">
            <span className="mr-2">🧪</span>
            Sankey Flow Builder
          </h1>
          
          {/* Mode Toggle */}
          <div className="flex bg-white/20 rounded-lg p-1">
            <button
              onClick={() => onModeChange('edit')}
              className={`px-4 py-2 rounded transition-all ${
                mode === 'edit'
                  ? 'bg-white text-purple-600 font-semibold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              🏗️ Edit
            </button>
            <button
              onClick={() => onModeChange('preview')}
              className={`px-4 py-2 rounded transition-all ${
                mode === 'preview'
                  ? 'bg-white text-purple-600 font-semibold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              👁️ Preview
            </button>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center space-x-2">
            <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />
            <button
              onClick={onEditTheme}
              className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-all"
              title="Edit theme"
            >
              🎨
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onSave}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all flex items-center space-x-2"
            title="Save diagram (Ctrl+S)"
          >
            <span>💾</span>
            <span>Save</span>
          </button>
          
          <button
            onClick={onLoad}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all flex items-center space-x-2"
            title="Load diagram (Ctrl+O)"
          >
            <span>📁</span>
            <span>Load</span>
          </button>
          
          <button
            onClick={onImportFromImage}
            className="bg-green-500/80 hover:bg-green-500 px-4 py-2 rounded-lg transition-all flex items-center space-x-2"
            title="Import from image using AI"
          >
            <span>📷</span>
            <span>AI Import</span>
          </button>
          
          <button
            onClick={onClear}
            className="bg-red-500/80 hover:bg-red-500 px-4 py-2 rounded-lg transition-all flex items-center space-x-2"
            title="Clear all"
          >
            <span>🗑️</span>
            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
}