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
    <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Tools</h2>
        
        <div className="space-y-2">
          {/* Add Node Button */}
          <button
            onClick={onAddNode}
            disabled={disabled}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-md"
            title="Add new node (N)"
          >
            <span className="text-xl">➕</span>
            <span className="font-semibold">Add Node</span>
          </button>

          {/* Start Connection Button */}
          <button
            onClick={onStartConnection}
            disabled={disabled}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-md"
            title="Draw connection (C)"
          >
            <span className="text-xl">🔗</span>
            <span className="font-semibold">Connect</span>
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Keyboard Shortcuts</h3>
        <div className="space-y-1 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Add Node</span>
            <kbd className="bg-gray-100 px-2 py-0.5 rounded">N</kbd>
          </div>
          <div className="flex justify-between">
            <span>Connect</span>
            <kbd className="bg-gray-100 px-2 py-0.5 rounded">C</kbd>
          </div>
          <div className="flex justify-between">
            <span>Delete</span>
            <kbd className="bg-gray-100 px-2 py-0.5 rounded">Del</kbd>
          </div>
          <div className="flex justify-between">
            <span>Cancel</span>
            <kbd className="bg-gray-100 px-2 py-0.5 rounded">Esc</kbd>
          </div>
          <div className="flex justify-between">
            <span>Save</span>
            <kbd className="bg-gray-100 px-2 py-0.5 rounded">Ctrl+S</kbd>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">How to Use</h3>
        <ol className="space-y-2 text-xs text-gray-600">
          <li className="flex">
            <span className="mr-2">1.</span>
            <span>Click "Add Node" to create a node on the canvas</span>
          </li>
          <li className="flex">
            <span className="mr-2">2.</span>
            <span>Drag nodes to position them</span>
          </li>
          <li className="flex">
            <span className="mr-2">3.</span>
            <span>Click "Connect", then click source and target nodes</span>
          </li>
          <li className="flex">
            <span className="mr-2">4.</span>
            <span>Click nodes or links to style them in the right panel</span>
          </li>
          <li className="flex">
            <span className="mr-2">5.</span>
            <span>Press Delete to remove selected items</span>
          </li>
        </ol>
      </div>
    </div>
  );
}