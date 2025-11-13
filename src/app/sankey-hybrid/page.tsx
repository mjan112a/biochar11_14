'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { DiagramTabs } from '@/components/ui/DiagramTabs';
import { TitleDropdown } from '@/components/ui/TitleDropdown';
import { HybridSankeyDiagram, VisualizationMode } from '@/components/d3/HybridSankeyDiagram';
import { HybridSankeyControlPanel } from '@/components/d3/HybridSankeyControlPanel';
import { HybridNode } from '@/lib/hybridSankeyLayout';
import { PathConfig } from '@/lib/hybridPathGenerator';
import { RibbonConfig } from '@/lib/ribbonPathGenerator';
import { ParticleAnimationConfig } from '@/lib/flowParticleAnimator';
import { optimizeLayoutFull } from '@/lib/layoutOptimizer';
import { exportLayoutToJSON, importLayoutFromJSON, applyPreset } from '@/lib/layoutPresets';
import Link from 'next/link';

export default function HybridSankeyPage() {
  const [systemView, setSystemView] = useState<'current' | 'proposed'>('proposed');
  const [showLabels, setShowLabels] = useState(true);
  const [showTooltips, setShowTooltips] = useState(true);
  const [enableDrag, setEnableDrag] = useState(true);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [customPositions, setCustomPositions] = useState<Map<string, {x: number, y: number}>>(new Map());
  const [layoutNodes, setLayoutNodes] = useState<HybridNode[]>([]);
  const [currentPreset, setCurrentPreset] = useState('default');
  const [visualizationMode, setVisualizationMode] = useState<VisualizationMode>('lines');
  const [showAnimations, setShowAnimations] = useState(false);
  
  const [pathConfig, setPathConfig] = useState<PathConfig>({
    minWidth: 2,
    maxWidth: 40,
    widthScale: 0.1,
    curvature: 0.5,
    arcRadius: 1.2
  });

  const [ribbonConfig, setRibbonConfig] = useState<RibbonConfig>({
    widthScale: 0.15,
    taperRatio: 0.3,
    curvature: 0.5,
    arcRadius: 1.2
  });

  const [particleConfig, setParticleConfig] = useState<ParticleAnimationConfig>({
    enabled: true,
    flowRate: 5,
    velocity: 1.5,
    particleSize: 8,
    particleSpacing: 60,
    pauseOnHover: true,
    particleShape: 'circle'
  });

  // Handle node position change
  const handleNodePositionChange = useCallback((nodeId: string, x: number, y: number) => {
    setCustomPositions(prev => {
      const updated = new Map(prev);
      updated.set(nodeId, { x, y });
      return updated;
    });
    
    // Update layout nodes
    setLayoutNodes(prev =>
      prev.map(n => n.id === nodeId ? { ...n, x, y } : n)
    );
  }, []);

  // Handle layout change from diagram
  const handleLayoutChange = useCallback((nodes: HybridNode[]) => {
    setLayoutNodes(nodes);
  }, []);

  // Optimize layout
  const handleOptimizeLayout = useCallback(() => {
    if (layoutNodes.length === 0) return;
    
    // This would need the links data too, but for now just show message
    alert('Optimization will reduce path crossings. Feature coming soon!');
  }, [layoutNodes]);

  // Reset layout
  const handleResetLayout = useCallback(() => {
    setCustomPositions(new Map());
    setCurrentPreset('default');
    setPathConfig({
      minWidth: 2,
      maxWidth: 40,
      widthScale: 0.1,
      curvature: 0.5,
      arcRadius: 1.2
    });
  }, []);

  // Save layout
  const handleSaveLayout = useCallback(() => {
    if (layoutNodes.length === 0) {
      alert('No layout to save');
      return;
    }
    
    const json = exportLayoutToJSON(layoutNodes, undefined, pathConfig);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hybrid-sankey-layout-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [layoutNodes, pathConfig]);

  // Load layout
  const handleLoadLayout = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const json = e.target?.result as string;
      const layout = importLayoutFromJSON(json);
      
      if (!layout) {
        alert('Invalid layout file');
        return;
      }
      
      // Apply loaded positions
      const positions = new Map(Object.entries(layout.nodes));
      setCustomPositions(positions);
      
      // Apply path config if present
      if (layout.pathConfig) {
        setPathConfig(prev => ({ ...prev, ...layout.pathConfig }));
      }
      
      setCurrentPreset('custom');
    };
    reader.readAsText(file);
  }, []);

  // Handle preset change
  const handlePresetChange = useCallback((preset: string) => {
    setCurrentPreset(preset);
    // Reset custom positions when changing presets
    if (preset !== 'custom') {
      setCustomPositions(new Map());
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image
                src="/images/wastehub-logo.png"
                alt="WasteHub"
                width={200}
                height={60}
                className="h-12 w-auto cursor-pointer"
                priority
              />
            </Link>
            <div className="h-8 w-px bg-gray-300" />
            <TitleDropdown />
          </div>
          
          {/* Navigation Links */}
          <nav className="flex items-center gap-4 mt-4 border-t border-gray-200 pt-3">
            <Link
              href="/trial-results"
              className="text-sm font-medium text-gray-700 hover:text-green-600 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              📊 Trial Results
            </Link>
            <Link
              href="/intellectual-property"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              🔒 Intellectual Property
            </Link>
          </nav>
        </div>
      </header>

      {/* Diagram Tabs Navigation */}
      <DiagramTabs />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Introduction Section */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-blue-600">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Hybrid Sankey Flow Visualization
            </h2>
            
            <p className="text-lg text-gray-700 mb-4">
              This <strong>hybrid layout</strong> displays material flows using a combination of straight lines, S-curves, and circular arcs—providing a clearer view of complex flow patterns while maintaining the circular economy visualization.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-4">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <span>🚧</span>
                Under Development - Phase 1
              </h3>
              <p className="text-sm text-gray-700">
                This page is currently under construction. The hybrid Sankey diagram with advanced path generation, 
                interactive controls, and drag-and-drop positioning will be implemented in upcoming development phases.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              {/* Planned Features */}
              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <span>✨</span>
                  Planned Features
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Column-based node layout</li>
                  <li>• Smart path generation (straight/S-curve/arc)</li>
                  <li>• Width-proportional flow rendering</li>
                  <li>• Interactive drag-and-drop positioning</li>
                  <li>• Collision detection & avoidance</li>
                  <li>• Custom layout save/load</li>
                </ul>
              </div>
              
              {/* Current Status */}
              <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded">
                <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                  <span>⚙️</span>
                  Development Timeline
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>Phase 1:</strong> Navigation & Structure ✓</li>
                  <li>• <strong>Phase 2:</strong> Core Components (In Progress)</li>
                  <li>• <strong>Phase 3:</strong> Control Panel (Upcoming)</li>
                  <li>• <strong>Phase 4:</strong> Path Logic (Upcoming)</li>
                  <li>• <strong>Phase 5:</strong> Polish & Testing (Upcoming)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Hybrid Sankey Diagram */}
        <section>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Interactive Flow Diagram
              </h3>
              
              {/* Controls */}
              <div className="flex items-center gap-4">
                {/* System Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">System:</span>
                  <button
                    onClick={() => setSystemView('current')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      systemView === 'current'
                        ? 'bg-red-100 text-red-700 border-2 border-red-500'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Current
                  </button>
                  <button
                    onClick={() => setSystemView('proposed')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      systemView === 'proposed'
                        ? 'bg-green-100 text-green-700 border-2 border-green-500'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Proposed
                  </button>
                </div>

                {/* Drag Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableDrag}
                    onChange={(e) => setEnableDrag(e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Drag</span>
                </label>

                {/* Labels Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLabels}
                    onChange={(e) => setShowLabels(e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Labels</span>
                </label>

                {/* Tooltips Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTooltips}
                    onChange={(e) => setShowTooltips(e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Tooltips</span>
                </label>
              </div>
            </div>

            <HybridSankeyDiagram
              systemView={systemView}
              showLabels={showLabels}
              showTooltips={showTooltips}
              showAnimations={showAnimations}
              enableDrag={enableDrag}
              onNodePositionChange={handleNodePositionChange}
              onLayoutChange={handleLayoutChange}
              customPositions={customPositions}
              pathConfig={pathConfig}
              selectedNode={selectedNode}
              visualizationMode={visualizationMode}
              ribbonConfig={ribbonConfig}
              particleConfig={particleConfig}
            />

            {/* Control Panel */}
            <div className="mt-6">
              <HybridSankeyControlPanel
                nodes={layoutNodes}
                selectedNode={selectedNode}
                onNodeSelect={setSelectedNode}
                onNodePositionChange={handleNodePositionChange}
                pathConfig={pathConfig}
                onPathConfigChange={setPathConfig}
                ribbonConfig={ribbonConfig}
                onRibbonConfigChange={setRibbonConfig}
                particleConfig={particleConfig}
                onParticleConfigChange={setParticleConfig}
                visualizationMode={visualizationMode}
                onVisualizationModeChange={setVisualizationMode}
                showAnimations={showAnimations}
                onShowAnimationsChange={setShowAnimations}
                onOptimizeLayout={handleOptimizeLayout}
                onResetLayout={handleResetLayout}
                onSaveLayout={handleSaveLayout}
                onLoadLayout={handleLoadLayout}
                currentPreset={currentPreset}
                onPresetChange={handlePresetChange}
              />
            </div>

            <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <h4 className="font-semibold text-blue-900 mb-2">Understanding the Visualization:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>Columns:</strong> Nodes are organized left-to-right by process stage</li>
                <li>• <strong>Straight lines:</strong> Direct short-distance connections</li>
                <li>• <strong>S-curves:</strong> Smooth paths for medium-distance flows</li>
                <li>• <strong>Circular arcs:</strong> Return/loop flows shown with curved paths</li>
                <li>• <strong>Path width:</strong> Proportional to material volume</li>
                <li>• <strong>Dashed lines:</strong> Indicate circular/reuse flows</li>
                <li>• <strong>Hover nodes:</strong> View connections and detailed information</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Documentation Section */}
        <section className="mt-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 border border-blue-200">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
              <span>📚</span>
              About This Visualization
            </h3>
            
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">
                The <strong>Hybrid Sankey Diagram</strong> combines the best aspects of traditional Sankey diagrams 
                with circular flow visualization. Unlike the purely circular layout, this hybrid approach:
              </p>
              
              <ul className="space-y-2 mb-4">
                <li>
                  <strong>Arranges nodes in vertical columns</strong> — making the process flow clearer 
                  and easier to follow from left to right
                </li>
                <li>
                  <strong>Uses intelligent path generation</strong> — straight lines for direct connections, 
                  S-curves for medium distances, and large arcs for return flows
                </li>
                <li>
                  <strong>Scales flow width proportionally</strong> — wider paths represent higher volume flows, 
                  providing instant visual feedback on material quantities
                </li>
                <li>
                  <strong>Allows manual adjustment</strong> — drag nodes to custom positions and the system 
                  will automatically recalculate optimal paths
                </li>
              </ul>
              
              <p className="text-sm text-gray-600 italic">
                This visualization style is inspired by research in circular economy data visualization 
                and material flow analysis, combining clarity with circular principles.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-sm text-gray-400">
            © 2025 WasteHub. Converting waste into value through circular economy solutions.
          </p>
        </div>
      </footer>
    </div>
  );
}