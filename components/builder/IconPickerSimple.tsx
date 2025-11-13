'use client';

import { useState, useEffect } from 'react';

interface IconInfo {
  name: string;
  file: string;
  path: string;
  keywords: string[];
}

interface IconPickerProps {
  isOpen: boolean;
  currentIcon?: string;
  onSelect: (iconPath: string) => void;
  onClose: () => void;
}

/**
 * Simplified IconPicker with Auto-Discovery
 * 
 * Just drop SVG files in public/images/iconslibrary/ and they automatically appear!
 * No JSON editing required.
 */
export default function IconPickerSimple({
  isOpen,
  currentIcon,
  onSelect,
  onClose,
}: IconPickerProps) {
  const [icons, setIcons] = useState<IconInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Load icons from auto-discovery API
  useEffect(() => {
    if (isOpen) {
      loadIcons();
    }
  }, [isOpen]);

  async function loadIcons() {
    try {
      setLoading(true);
      const response = await fetch('/api/icons/discover');
      const data = await response.json();
      
      if (data.success) {
        setIcons(data.icons);
      } else {
        console.error('Failed to load icons:', data.error);
      }
    } catch (error) {
      console.error('Failed to load icons:', error);
    } finally {
      setLoading(false);
    }
  }

  // Filter icons based on search
  const filteredIcons = searchTerm.trim()
    ? icons.filter(icon =>
        icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        icon.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : icons;

  // Handle icon selection
  const handleSelect = (iconPath: string) => {
    onSelect(iconPath);
    setSearchTerm('');
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
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Choose Icon</h3>
              <p className="text-sm text-gray-500 mt-1">
                {icons.length} icons available • Auto-discovered from iconslibrary/
              </p>
            </div>
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            autoFocus
          />
        </div>

        {/* Icon Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
              <p className="text-gray-600">Loading icons...</p>
            </div>
          ) : filteredIcons.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {filteredIcons.map((icon) => (
                <button
                  key={icon.path}
                  onClick={() => handleSelect(icon.path)}
                  className={`p-4 border-2 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 ${
                    currentIcon === icon.path
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                      : 'border-gray-200'
                  }`}
                  title={icon.name}
                >
                  <div className="flex flex-col items-center">
                    <img 
                      src={icon.path} 
                      alt={icon.name}
                      className="w-12 h-12 mb-2 object-contain"
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
              <div className="text-6xl mb-4 text-gray-300">
                {searchTerm ? '🔍' : '📁'}
              </div>
              <p className="text-lg font-medium text-gray-600 mb-2">
                {searchTerm ? 'No icons found' : 'No icons available'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {searchTerm 
                  ? 'Try a different search term' 
                  : 'Add SVG files to see them here'}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  💡 How to Add Icons:
                </p>
                <p className="text-xs text-blue-700">
                  Drop SVG files into:<br/>
                  <code className="bg-blue-100 px-2 py-1 rounded mt-1 inline-block">
                    public/images/iconslibrary/
                  </code>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <button
            onClick={handleRemoveIcon}
            className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            🗑️ Remove Icon
          </button>
          
          <div className="flex items-center gap-3">
            {currentIcon && (
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200">
                <span className="font-medium">Current:</span>
                <img src={currentIcon} alt="Current icon" className="w-6 h-6" />
              </div>
            )}
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}