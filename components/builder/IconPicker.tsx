'use client';

import { useState, useMemo, useEffect } from 'react';
import { getIconsLibrary, searchIcons, IconDefinition, IconCategory } from '@/lib/iconsLibrary';

interface IconPickerProps {
  isOpen: boolean;
  currentIcon?: string;
  onSelect: (iconPath: string) => void;
  onClose: () => void;
}

/**
 * IconPicker Component
 *
 * Visual icon selector with categorized tabs and search functionality.
 * Displays all available icons from the icons library.
 */
export default function IconPicker({
  isOpen,
  currentIcon,
  onSelect,
  onClose,
}: IconPickerProps) {
  const [iconsLibrary, setIconsLibrary] = useState<IconCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedIcons, setDisplayedIcons] = useState<IconDefinition[]>([]);

  // Load icons library on mount
  useEffect(() => {
    getIconsLibrary().then(library => {
      setIconsLibrary(library);
      if (library.length > 0 && !selectedCategory) {
        setSelectedCategory(library[0].name);
      }
    });
  }, []);

  // Get filtered icons based on search or category
  useEffect(() => {
    async function loadIcons() {
      if (searchTerm.trim()) {
        const results = await searchIcons(searchTerm);
        setDisplayedIcons(results);
      } else {
        const category = iconsLibrary.find(cat => cat.name === selectedCategory);
        setDisplayedIcons(category?.icons || []);
      }
    }
    
    if (iconsLibrary.length > 0) {
      loadIcons();
    }
  }, [searchTerm, selectedCategory, iconsLibrary]);

  // Handle icon selection
  const handleSelect = (iconPath: string) => {
    onSelect(iconPath);
    setSearchTerm(''); // Clear search on selection
    onClose();
  };

  // Handle remove icon
  const handleRemoveIcon = () => {
    onSelect('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl font-bold text-gray-900">Choose Icon</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              title="Close"
            >
              ×
            </button>
          </div>
          
          {/* Search */}
          <input
            type="text"
            placeholder="Search icons by name or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Tabs (hidden when searching) */}
        {!searchTerm.trim() && (
          <div className="px-6 py-3 border-b border-gray-200 flex gap-2 overflow-x-auto">
            {iconsLibrary.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* Icon Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {displayedIcons.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {displayedIcons.map((icon) => (
                <button
                  key={icon.path}
                  onClick={() => handleSelect(icon.path)}
                  className={`p-4 border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 ${
                    currentIcon === icon.path
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200'
                  }`}
                  title={icon.name}
                >
                  <div className="flex flex-col items-center">
                    <img 
                      src={icon.path} 
                      alt={icon.name}
                      className="w-16 h-16 mb-2 object-contain"
                    />
                    <p className="text-xs text-center text-gray-700 line-clamp-2 leading-tight">
                      {icon.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4 text-gray-300">🔍</div>
              <p className="text-lg font-medium text-gray-600 mb-2">No icons found</p>
              <p className="text-sm text-gray-500">
                Try a different search term or browse categories
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleRemoveIcon}
            className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            🗑️ Remove Icon
          </button>
          
          <div className="flex items-center gap-3">
            {currentIcon && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Current:</span>
                <img src={currentIcon} alt="Current icon" className="w-8 h-8" />
              </div>
            )}
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}