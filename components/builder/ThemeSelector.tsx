'use client';

import { useState, useRef, useEffect } from 'react';
import { DiagramTheme } from '@/types/builder-theme';
import { themePresets } from '@/lib/themePresets';
import { getAllThemes } from '@/lib/themeManager';

interface ThemeSelectorProps {
  currentTheme: DiagramTheme;
  onThemeChange: (theme: DiagramTheme) => void;
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [themes, setThemes] = useState<DiagramTheme[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load all themes (built-in + custom)
  useEffect(() => {
    const allThemes = getAllThemes();
    setThemes(allThemes);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleThemeSelect = (theme: DiagramTheme) => {
    onThemeChange(theme);
    setIsOpen(false);
  };

  // Get theme category badge color
  const getCategoryColor = (theme: DiagramTheme): string => {
    if (theme.isBuiltIn) {
      if (theme.id.includes('biochar')) return 'bg-orange-100 text-orange-700';
      if (theme.id.includes('material')) return 'bg-green-100 text-green-700';
      if (theme.id.includes('process')) return 'bg-blue-100 text-blue-700';
      return 'bg-gray-100 text-gray-700';
    }
    return 'bg-purple-100 text-purple-700';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        title="Select Theme"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
        <span className="text-sm font-medium text-gray-700">{currentTheme.name}</span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Select Theme</h3>
            <p className="text-xs text-gray-500 mt-1">
              {themes.length} theme{themes.length !== 1 ? 's' : ''} available
            </p>
          </div>

          <div className="p-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                  theme.id === currentTheme.id
                    ? 'bg-purple-50 border border-purple-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {theme.name}
                      </h4>
                      {theme.id === currentTheme.id && (
                        <svg className="w-4 h-4 text-purple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    {theme.description && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {theme.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 mt-1.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(theme)}`}>
                        {theme.isBuiltIn ? 'Built-in' : 'Custom'}
                      </span>
                      {theme.tags && theme.tags.length > 0 && (
                        <span className="text-xs text-gray-400">
                          {theme.tags.slice(0, 2).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Theme Preview Colors */}
                  <div className="flex flex-col space-y-1 ml-2">
                    <div 
                      className="w-8 h-3 rounded border border-gray-200"
                      style={{ backgroundColor: theme.defaults.node.fillColor }}
                      title="Node fill color"
                    />
                    <div 
                      className="w-8 h-3 rounded border border-gray-200"
                      style={{ backgroundColor: theme.defaults.link.color }}
                      title="Link color"
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-lg">
            <p className="text-xs text-gray-500">
              💡 Tip: Create custom themes in the Theme Editor
            </p>
          </div>
        </div>
      )}
    </div>
  );
}