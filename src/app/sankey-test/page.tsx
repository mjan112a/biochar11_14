'use client';

import { CircularSankeyWithControls } from '@/components/d3/CircularSankeyWithControls';

export default function SankeyTestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Circular Sankey Diagram - Control Panel Test
          </h1>
          <p className="text-gray-600">
            Use the control panel on the right to adjust all diagram parameters in real-time.
            Export your configuration when you find the perfect settings.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <CircularSankeyWithControls />
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">How to Use:</h2>
          <ul className="list-disc list-inside space-y-1 text-blue-800">
            <li><strong>Canvas Tab:</strong> Adjust diagram size and background color</li>
            <li><strong>Nodes Tab:</strong> Control node sizes and individual node positions</li>
            <li><strong>Flows Tab:</strong> Modify flow line widths, opacity, and scaling formula</li>
            <li><strong>Labels Tab:</strong> Change font sizes, offsets, and visibility</li>
            <li><strong>Curves Tab:</strong> Adjust how circular flows curve</li>
            <li><strong>Colors Tab:</strong> Customize all component and material colors</li>
            <li><strong>Animation Tab:</strong> Control particle animation settings</li>
            <li><strong>Presets Tab:</strong> Export, import, reset, or use quick presets</li>
          </ul>
        </div>

        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-green-900 mb-2">Tips:</h2>
          <ul className="list-disc list-inside space-y-1 text-green-800">
            <li>Changes apply instantly - experiment freely!</li>
            <li>Use the Export button to save your perfect configuration</li>
            <li>Import previously saved configurations with the Import button</li>
            <li>Reset to defaults if you want to start over</li>
            <li>The control panel can be collapsed using the ✕ button</li>
          </ul>
        </div>
      </div>
    </div>
  );
}