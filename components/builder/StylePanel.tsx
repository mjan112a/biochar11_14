'use client';

import { useState } from 'react';
import { BuilderNode, BuilderLink } from '@/types/builder';
import IconPickerSimple from './IconPickerSimple';

interface StylePanelProps {
  selectedNode: BuilderNode | null;
  selectedLink: BuilderLink | null;
  onUpdateNode: (updates: Partial<BuilderNode>) => void;
  onUpdateLink: (updates: Partial<BuilderLink>) => void;
  onDelete: () => void;
}

export default function StylePanel({
  selectedNode,
  selectedLink,
  onUpdateNode,
  onUpdateLink,
  onDelete,
}: StylePanelProps) {
  const hasSelection = selectedNode || selectedLink;
  const [showNodeIconPicker, setShowNodeIconPicker] = useState(false);
  const [showLinkIconPicker, setShowLinkIconPicker] = useState(false);

  // Predefined color palette
  const colors = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Purple', value: '#9333EA' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Yellow', value: '#EAB308' },
    { name: 'Green', value: '#10B981' },
    { name: 'Teal', value: '#14B8A6' },
    { name: 'Cyan', value: '#06B6D4' },
    { name: 'Gray', value: '#6B7280' },
  ];

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      {!hasSelection ? (
        <div className="text-center text-gray-400 py-12">
          <div className="text-4xl mb-3">🎨</div>
          <div className="text-sm">Select a node or link to style it</div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">
              {selectedNode ? '📦 Node' : '🔗 Link'} Properties
            </h2>
            <button
              onClick={onDelete}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition-all"
              title="Delete (Del)"
            >
              🗑️
            </button>
          </div>

          {/* Node Properties */}
          {selectedNode && (
            <>
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={selectedNode.name}
                  onChange={(e) => onUpdateNode({ name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  placeholder="Node name"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Color
                </label>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => onUpdateNode({ color: color.value })}
                      className={`w-full aspect-square rounded-lg transition-all ${
                        selectedNode.color === color.value
                          ? 'ring-2 ring-purple-600 ring-offset-2 scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={selectedNode.color || '#ffffff'}
                  onChange={(e) => onUpdateNode({ color: e.target.value })}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Width: {selectedNode.width || 80}px
                </label>
                <input
                  type="range"
                  min="40"
                  max="200"
                  value={selectedNode.width || 80}
                  onChange={(e) => onUpdateNode({ width: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Height: {selectedNode.height || 50}px
                </label>
                <input
                  type="range"
                  min="30"
                  max="150"
                  value={selectedNode.height || 50}
                  onChange={(e) => onUpdateNode({ height: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Position */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    X Position
                  </label>
                  <input
                    type="number"
                    value={Math.round(selectedNode.x)}
                    onChange={(e) => onUpdateNode({ x: parseInt(e.target.value) || 0 })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Y Position
                  </label>
                  <input
                    type="number"
                    value={Math.round(selectedNode.y)}
                    onChange={(e) => onUpdateNode({ y: parseInt(e.target.value) || 0 })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-gray-900"
                  />
                </div>
              </div>
              {/* Icon Settings */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Node Icon
                </label>
                <button
                  onClick={() => setShowNodeIconPicker(true)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {selectedNode.icon ? (
                      <>
                        <img
                          src={selectedNode.icon}
                          alt="Node icon"
                          className="w-12 h-12 object-contain flex-shrink-0"
                        />
                        <span className="text-sm text-gray-700 truncate">
                          {selectedNode.icon.split('/').pop()}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-2xl flex-shrink-0">
                          🖼️
                        </div>
                        <span className="text-sm text-gray-500">
                          Choose icon from library
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-purple-600 group-hover:text-purple-700 flex-shrink-0">
                    🎨
                  </div>
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Click to browse the icon library
                </p>
              </div>

              {/* Display Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Icon Only Mode
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedNode.iconOnly || false}
                      onChange={(e) => onUpdateNode({ iconOnly: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  When enabled, icon fills entire node without background/border
                </p>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Show Label
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedNode.showLabel !== false}
                      onChange={(e) => onUpdateNode({ showLabel: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  Display text label {selectedNode.iconOnly ? 'below icon' : 'inside node'}
                </p>

              {/* Label Font Size */}
              {(selectedNode.showLabel !== false) && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Label Font Size: {selectedNode.fontSize || 12}px
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="24"
                    value={selectedNode.fontSize || 12}
                    onChange={(e) => onUpdateNode({ fontSize: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              )}

              {/* Label Offset - vertical position adjustment */}
              {(selectedNode.showLabel !== false) && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Label Offset: {selectedNode.labelOffset || 0}px
                  </label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={selectedNode.labelOffset || 0}
                    onChange={(e) => onUpdateNode({ labelOffset: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Higher</span>
                    <span>Lower</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Adjust vertical position of label below icon
                  </p>
                </div>
              )}
              </div>

            </>
          )}

          {/* Link Properties */}
          {selectedLink && (
            <>
              {/* Label */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Label (optional)
                </label>
                <input
                  type="text"
                  value={selectedLink.label || ''}
                  onChange={(e) => onUpdateLink({ label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  placeholder="Link label"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Color
                </label>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => onUpdateLink({ color: color.value })}
                      className={`w-full aspect-square rounded-lg transition-all ${
                        selectedLink.color === color.value
                          ? 'ring-2 ring-purple-600 ring-offset-2 scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={selectedLink.color || '#9CA3AF'}
                  onChange={(e) => onUpdateLink({ color: e.target.value })}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>

              {/* Thickness/Value */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thickness: {selectedLink.value}
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={selectedLink.value}
                  onChange={(e) => onUpdateLink({ value: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Thin</span>
                  <span>Thick</span>
                </div>
              </div>

              {/* Animation Controls */}
              <div className="pt-3 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Animation</h4>
                
                {/* Animation Rate */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Speed: {selectedLink.animationRate || 5}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={selectedLink.animationRate || 5}
                    onChange={(e) => onUpdateLink({ animationRate: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Slow</span>
                    <span>Very Fast</span>
                  </div>
                </div>

                {/* Animation Frequency */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Flow Rate: {selectedLink.animationFrequency || 5}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={selectedLink.animationFrequency || 5}
                    onChange={(e) => onUpdateLink({ animationFrequency: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Low</span>
                    <span>Very High</span>
                  </div>
                </div>

                {/* Animation Size */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {selectedLink.particleType === 'icon' ? 'Icon' : 'Dot'} Size: {selectedLink.animationSize || 4}px
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    value={selectedLink.animationSize || 4}
                    onChange={(e) => onUpdateLink({ animationSize: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Small</span>
                    <span>Very Large</span>
                  </div>
                </div>

                {/* Particle Style Selection */}
                <div className="pt-3 border-t border-gray-200 mt-3">
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Particle Style
                  </label>
                  <select
                    value={selectedLink.particleIconSource || 'dot'}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === 'dot') {
                        onUpdateLink({ particleType: 'dot', particleIconSource: undefined, particleIcon: undefined });
                      } else if (value === 'custom') {
                        onUpdateLink({
                          particleType: 'icon',
                          particleIconSource: 'custom'
                        });
                      } else {
                        onUpdateLink({
                          particleType: 'icon',
                          particleIconSource: value as 'source' | 'target',
                          particleIcon: undefined
                        });
                      }
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="dot">⚪ Circular Dot</option>
                    <option value="source">📤 Source Node Icon</option>
                    <option value="target">📥 Target Node Icon</option>
                    <option value="custom">🎨 Custom Icon</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedLink.particleIconSource === 'source' && 'Particles use the source node\'s icon'}
                    {selectedLink.particleIconSource === 'target' && 'Particles use the target node\'s icon'}
                    {selectedLink.particleIconSource === 'custom' && 'Particles use a custom icon from library'}
                    {(!selectedLink.particleIconSource || selectedLink.particleIconSource === 'dot') && 'Traditional circular dot particles'}
                  </p>

                  {/* Custom Icon Picker */}
                  {selectedLink.particleIconSource === 'custom' && (
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Custom Particle Icon
                      </label>
                      <button
                        onClick={() => setShowLinkIconPicker(true)}
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all text-center"
                      >
                        {selectedLink.particleIcon ? (
                          <div className="flex items-center justify-center gap-2">
                            <img
                              src={selectedLink.particleIcon}
                              alt="Particle icon"
                              className="w-12 h-12 object-contain"
                            />
                            <span className="text-sm text-gray-600">Click to change</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-2xl">🖼️</span>
                            <span className="text-sm text-gray-600">Choose icon from library</span>
                          </div>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Arc Radius for return connectors */}
                <div className="pt-3 border-t border-gray-200 mt-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Arc Radius: {(selectedLink.arcRadius || 0.5).toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0.3"
                    max="1.0"
                    step="0.05"
                    value={selectedLink.arcRadius || 0.5}
                    onChange={(e) => onUpdateLink({ arcRadius: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Tight</span>
                    <span>Wide</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Controls curve depth for return connectors
                  </p>
                </div>

                {/* Return Y Position for horizontal backloop */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Return Y Position: {selectedLink.returnY || 'Auto'}
                  </label>
                  <input
                    type="range"
                    min="400"
                    max="1200"
                    step="10"
                    value={selectedLink.returnY || 800}
                    onChange={(e) => onUpdateLink({ returnY: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Higher</span>
                    <span>Lower</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Vertical position of the horizontal bottom line
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Info */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex items-center space-x-2">
                <span>💡</span>
                <span>
                  {selectedNode
                    ? 'Drag the node on canvas to reposition it'
                    : 'Links auto-route between nodes'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Icon Picker Modals */}
      <IconPickerSimple
        isOpen={showNodeIconPicker}
        currentIcon={selectedNode?.icon}
        onSelect={(iconPath: string) => {
          if (selectedNode) {
            onUpdateNode({ icon: iconPath });
          }
        }}
        onClose={() => setShowNodeIconPicker(false)}
      />

      <IconPickerSimple
        isOpen={showLinkIconPicker}
        currentIcon={selectedLink?.particleIcon}
        onSelect={(iconPath: string) => {
          if (selectedLink) {
            onUpdateLink({
              particleIcon: iconPath,
              particleType: 'icon',
              particleIconSource: 'custom'
            });
          }
        }}
        onClose={() => setShowLinkIconPicker(false)}
      />
    </div>
  );
}