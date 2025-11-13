'use client';

import { useState } from 'react';
import { DiagramTheme, NodeThemeStyle, LinkThemeStyle } from '@/types/builder-theme';
import { 
  updateThemeDefaults, 
  exportTheme, 
  importTheme, 
  createTheme,
  saveThemeToStorage 
} from '@/lib/themeManager';

interface ThemeEditorProps {
  theme: DiagramTheme;
  onThemeUpdate: (theme: DiagramTheme) => void;
  onClose: () => void;
}

export function ThemeEditor({ theme, onThemeUpdate, onClose }: ThemeEditorProps) {
  const [editedTheme, setEditedTheme] = useState<DiagramTheme>(theme);
  const [activeTab, setActiveTab] = useState<'global' | 'canvas'>('global');

  const handleNodeDefaultChange = (updates: Partial<NodeThemeStyle>) => {
    const updated = updateThemeDefaults(editedTheme, { node: updates });
    setEditedTheme(updated);
  };

  const handleLinkDefaultChange = (updates: Partial<LinkThemeStyle>) => {
    const updated = updateThemeDefaults(editedTheme, { link: updates });
    setEditedTheme(updated);
  };

  const handleCanvasChange = (updates: Partial<typeof editedTheme.defaults.canvas>) => {
    const updated = updateThemeDefaults(editedTheme, { canvas: updates });
    setEditedTheme(updated);
  };

  const handleSave = () => {
    onThemeUpdate(editedTheme);
    onClose();
  };

  const handleSaveAsNew = () => {
    const name = prompt('Enter a name for the new theme:', `${editedTheme.name} (Copy)`);
    if (name) {
      const newTheme = createTheme(name, `Custom theme based on ${editedTheme.name}`);
      const customized = updateThemeDefaults(newTheme, {
        node: editedTheme.defaults.node,
        link: editedTheme.defaults.link,
        canvas: editedTheme.defaults.canvas
      });
      saveThemeToStorage(customized);
      onThemeUpdate(customized);
      alert('Theme saved! It will appear in the theme selector.');
      onClose();
    }
  };

  const handleExport = () => {
    const json = exportTheme(editedTheme);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${editedTheme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        try {
          const imported = importTheme(text);
          setEditedTheme(imported);
          alert('Theme imported successfully!');
        } catch (error) {
          alert(`Failed to import theme: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    };
    input.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Theme Editor</h2>
            <p className="text-sm text-white/80 mt-1">
              Editing: {editedTheme.name}
            </p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex">
            <button
              onClick={() => setActiveTab('global')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'global'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Global Styles
            </button>
            <button
              onClick={() => setActiveTab('canvas')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'canvas'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Canvas
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'global' && (
            <div className="space-y-6">
              {/* Node Defaults */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Node Defaults</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fill Color
                      </label>
                      <input
                        type="color"
                        value={editedTheme.defaults.node.fillColor}
                        onChange={(e) => handleNodeDefaultChange({ fillColor: e.target.value })}
                        className="w-full h-10 rounded border border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stroke Color
                      </label>
                      <input
                        type="color"
                        value={editedTheme.defaults.node.strokeColor}
                        onChange={(e) => handleNodeDefaultChange({ strokeColor: e.target.value })}
                        className="w-full h-10 rounded border border-gray-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stroke Width: {editedTheme.defaults.node.strokeWidth}px
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={editedTheme.defaults.node.strokeWidth}
                      onChange={(e) => handleNodeDefaultChange({ strokeWidth: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Border Radius: {editedTheme.defaults.node.borderRadius || 4}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={editedTheme.defaults.node.borderRadius || 4}
                      onChange={(e) => handleNodeDefaultChange({ borderRadius: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Link Defaults */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Link Defaults</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <input
                      type="color"
                      value={editedTheme.defaults.link.color}
                      onChange={(e) => handleLinkDefaultChange({ color: e.target.value })}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thickness: {editedTheme.defaults.link.thickness}px
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={editedTheme.defaults.link.thickness}
                      onChange={(e) => handleLinkDefaultChange({ thickness: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opacity: {((editedTheme.defaults.link.opacity || 0.6) * 100).toFixed(0)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={(editedTheme.defaults.link.opacity || 0.6) * 100}
                      onChange={(e) => handleLinkDefaultChange({ opacity: parseInt(e.target.value) / 100 })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'canvas' && (
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Canvas Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={editedTheme.defaults.canvas.backgroundColor}
                      onChange={(e) => handleCanvasChange({ backgroundColor: e.target.value })}
                      className="w-full h-10 rounded border border-gray-300"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="gridEnabled"
                      checked={editedTheme.defaults.canvas.gridEnabled}
                      onChange={(e) => handleCanvasChange({ gridEnabled: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="gridEnabled" className="text-sm font-medium text-gray-700">
                      Show Grid
                    </label>
                  </div>

                  {editedTheme.defaults.canvas.gridEnabled && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Grid Color
                        </label>
                        <input
                          type="color"
                          value={editedTheme.defaults.canvas.gridColor}
                          onChange={(e) => handleCanvasChange({ gridColor: e.target.value })}
                          className="w-full h-10 rounded border border-gray-300"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Grid Size: {editedTheme.defaults.canvas.gridSize}px
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="50"
                          value={editedTheme.defaults.canvas.gridSize}
                          onChange={(e) => handleCanvasChange({ gridSize: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={handleImport}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              📁 Import
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              💾 Export
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAsNew}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              Save as New
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:opacity-90"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}