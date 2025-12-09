'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DiagramTabs } from '@/components/ui/DiagramTabs';
import { TitleDropdown } from '@/components/ui/TitleDropdown';
import { useBuilderState } from '@/hooks/useBuilderState';
import { BuilderNode, BuilderLink, DiagramConfig } from '@/types/builder';
import BuilderToolbar from '@/components/builder/BuilderToolbar';
import BuilderCanvas from '@/components/builder/BuilderCanvas';
import NodePalette from '@/components/builder/NodePalette';
import StylePanel from '@/components/builder/StylePanel';
import { ThemeEditor } from '@/components/builder/ThemeEditor';
import ImageImportModal from '@/components/builder/ImageImportModal';

// Type declaration for File System Access API
declare global {
  interface Window {
    showOpenFilePicker?: (options?: {
      types?: { description: string; accept: Record<string, string[]> }[];
      multiple?: boolean;
    }) => Promise<FileSystemFileHandle[]>;
    showSaveFilePicker?: (options?: {
      suggestedName?: string;
      types?: { description: string; accept: Record<string, string[]> }[];
    }) => Promise<FileSystemFileHandle>;
  }
}

export default function ExperimentalSankeyPage() {
  const {
    mode,
    nodes,
    links,
    selectedItem,
    connectionMode,
    connectionStart,
    currentTheme,
    setMode,
    addNode,
    updateNode,
    deleteNode,
    updateLink,
    deleteLink,
    setSelectedItem,
    toggleConnectionMode,
    handleConnectionClick,
    cancelConnection,
    getSelectedNode,
    getSelectedLink,
    exportData,
    importData,
    clearAll,
    updateTheme,
  } = useBuilderState();

  // Theme editor state
  const [showThemeEditor, setShowThemeEditor] = useState(false);
  
  // Image import modal state
  const [showImageImportModal, setShowImageImportModal] = useState(false);

  // File handle for save-in-place functionality
  const fileHandleRef = useRef<FileSystemFileHandle | null>(null);
  const [loadedFileName, setLoadedFileName] = useState<string | null>(null);

  // Handle save - saves to original file if loaded via File System Access API, otherwise downloads
  const handleSave = useCallback(async () => {
    if (nodes.length === 0) {
      alert('Nothing to save! Add some nodes first.');
      return;
    }

    const data = exportData();
    const json = JSON.stringify(data, null, 2);

    // Try to save to the original file if we have a file handle
    if (fileHandleRef.current) {
      try {
        const writable = await fileHandleRef.current.createWritable();
        await writable.write(json);
        await writable.close();
        console.log(`Saved to ${loadedFileName}`);
        return;
      } catch (error) {
        console.warn('Failed to save to original file, falling back to download:', error);
        // Fall through to download
      }
    }

    // Fallback: download as new file
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sankey-flow-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes.length, exportData, loadedFileName]);

  // Handle "Save As" - always prompts for new location
  const handleSaveAs = useCallback(async () => {
    if (nodes.length === 0) {
      alert('Nothing to save! Add some nodes first.');
      return;
    }

    const data = exportData();
    const json = JSON.stringify(data, null, 2);

    // Try to use File System Access API for save dialog
    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: loadedFileName || `sankey-flow-${Date.now()}.json`,
          types: [
            {
              description: 'JSON Files',
              accept: { 'application/json': ['.json'] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(json);
        await writable.close();
        
        // Update the file handle for future saves
        fileHandleRef.current = handle;
        setLoadedFileName(handle.name);
        console.log(`Saved as ${handle.name}`);
        return;
      } catch (error) {
        // User cancelled or API not available
        if ((error as Error).name !== 'AbortError') {
          console.warn('Save As failed:', error);
        }
        return;
      }
    }

    // Fallback: download as new file
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = loadedFileName || `sankey-flow-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes.length, exportData, loadedFileName]);

  // Handle load - uses File System Access API if available to enable save-in-place
  const handleLoad = useCallback(async () => {
    // Try to use File System Access API for better UX
    if (window.showOpenFilePicker) {
      try {
        const [handle] = await window.showOpenFilePicker({
          types: [
            {
              description: 'JSON Files',
              accept: { 'application/json': ['.json'] },
            },
          ],
          multiple: false,
        });
        
        const file = await handle.getFile();
        const json = await file.text();
        const data = JSON.parse(json);
        importData(data);
        
        // Store the file handle for save-in-place
        fileHandleRef.current = handle;
        setLoadedFileName(file.name);
        console.log(`Loaded ${file.name} - save will update this file`);
        return;
      } catch (error) {
        // User cancelled or API not available
        if ((error as Error).name !== 'AbortError') {
          console.warn('File picker failed, falling back to input:', error);
        } else {
          return; // User cancelled
        }
      }
    }

    // Fallback: use traditional file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = event.target?.result as string;
          const data = JSON.parse(json);
          importData(data);
          
          // Clear file handle since we can't save back to this file
          fileHandleRef.current = null;
          setLoadedFileName(file.name);
        } catch (error) {
          alert('Invalid file format. Please select a valid JSON file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [importData]);

  // Handle clear
  const handleClear = useCallback(() => {
    if (nodes.length === 0) return;

    if (confirm('Are you sure you want to clear everything? This cannot be undone.')) {
      clearAll();
    }
  }, [nodes.length, clearAll]);

  // Handle AI import
  const handleImportFromImage = useCallback((
    importedNodes: BuilderNode[],
    importedLinks: BuilderLink[],
    importedConfig: DiagramConfig
  ) => {
    // Use importData from builder state to load the AI-generated diagram
    importData({
      nodes: importedNodes,
      links: importedLinks,
      config: importedConfig,
    });
  }, [importData]);

  // Handle delete
  const handleDelete = useCallback(() => {
    if (!selectedItem) return;

    if (selectedItem.type === 'node') {
      deleteNode(selectedItem.id);
    } else {
      deleteLink(selectedItem.id);
    }
  }, [selectedItem, deleteNode, deleteLink]);

  // Keyboard shortcuts - must be after all callback definitions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'n':
        case 'N':
          if (mode === 'edit') {
            addNode();
          }
          break;
        case 'c':
        case 'C':
          if (mode === 'edit' && !connectionMode && nodes.length >= 2) {
            toggleConnectionMode();
          }
          break;
        case 'Delete':
        case 'Backspace':
          if (selectedItem && mode === 'edit') {
            e.preventDefault();
            handleDelete();
          }
          break;
        case 'Escape':
          if (connectionMode) {
            cancelConnection();
          } else if (selectedItem) {
            setSelectedItem(null);
          }
          break;
        case ' ':
          e.preventDefault();
          setMode(mode === 'edit' ? 'preview' : 'edit');
          break;
        case 's':
        case 'S':
          if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
            e.preventDefault();
            handleSaveAs();
          } else if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleSave();
          }
          break;
        case 'o':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleLoad();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, nodes, selectedItem, connectionMode, addNode, toggleConnectionMode, cancelConnection, setSelectedItem, setMode, handleSave, handleSaveAs, handleDelete, handleLoad]);

  // Handle node click
  const handleNodeClick = useCallback((nodeId: string) => {
    if (mode !== 'edit') return;
    
    // If in connection mode, handle connection logic
    const handled = handleConnectionClick(nodeId);
    
    // If not handled by connection logic, just select the node
    if (!handled) {
      setSelectedItem({ type: 'node', id: nodeId });
    }
  }, [mode, handleConnectionClick, setSelectedItem]);

  // Handle link click
  const handleLinkClick = useCallback((linkId: string) => {
    if (mode !== 'edit') return;
    setSelectedItem({ type: 'link', id: linkId });
  }, [mode, setSelectedItem]);

  // Handle canvas click
  const handleCanvasClick = useCallback(() => {
    if (connectionMode) {
      cancelConnection();
    } else {
      setSelectedItem(null);
    }
  }, [connectionMode, cancelConnection, setSelectedItem]);

  // Handle add node
  const handleAddNode = useCallback(() => {
    addNode();
  }, [addNode]);

  // Handle start connection
  const handleStartConnection = useCallback(() => {
    if (nodes.length === 0) {
      alert('Add some nodes first before creating connections!');
      return;
    }
    
    if (nodes.length < 2) {
      alert('Add at least 2 nodes to create a connection!');
      return;
    }
    
    // Toggle connection mode
    toggleConnectionMode();
  }, [nodes, toggleConnectionMode]);

  // Handle node drag
  const handleNodeDrag = useCallback((nodeId: string, x: number, y: number) => {
    updateNode(nodeId, { x, y });
  }, [updateNode]);

  // Handle link drag (for adjusting returnY of backward links)
  const handleLinkDrag = useCallback((linkId: string, updates: Partial<BuilderLink>) => {
    updateLink(linkId, updates);
  }, [updateLink]);

  // Get selected node and link for style panel
  const selectedNode = getSelectedNode() ?? null;
  const selectedLink = getSelectedLink() ?? null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 flex flex-col">
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

      {/* Toolbar */}
      <BuilderToolbar
        mode={mode}
        onModeChange={setMode}
        currentTheme={currentTheme}
        onThemeChange={updateTheme}
        onEditTheme={() => setShowThemeEditor(true)}
        onSave={handleSave}
        onSaveAs={handleSaveAs}
        onLoad={handleLoad}
        onImportFromImage={() => setShowImageImportModal(true)}
        onClear={handleClear}
        loadedFileName={loadedFileName}
      />

      {/* Main Builder Interface */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Preview Mode Branding Overlay */}
        {mode === 'preview' && (
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-6 py-3 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🌱</div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Biochar System Flow</h2>
                <p className="text-xs text-gray-600">Circular Economy Solution by WasteHub</p>
              </div>
            </div>
          </div>
        )}

        {/* Left Sidebar - Tools (hidden in preview mode) */}
        {mode === 'edit' && (
          <NodePalette
            onAddNode={handleAddNode}
            onStartConnection={handleStartConnection}
            disabled={false}
          />
        )}

        {/* Center - Canvas */}
        <BuilderCanvas
          nodes={nodes}
          links={links}
          mode={mode}
          selectedItem={selectedItem}
          isDrawingConnection={connectionMode}
          connectionStart={connectionStart}
          theme={currentTheme}
          onNodeClick={handleNodeClick}
          onLinkClick={handleLinkClick}
          onNodeDrag={handleNodeDrag}
          onLinkDrag={handleLinkDrag}
          onCanvasClick={handleCanvasClick}
          onConnectionComplete={handleConnectionClick}
        />

        {/* Right Sidebar - Style Panel (hidden in preview mode) */}
        {mode === 'edit' && (
          <StylePanel
            selectedNode={selectedNode}
            selectedLink={selectedLink}
            onUpdateNode={(updates) => {
              if (selectedNode) {
                updateNode(selectedNode.id, updates);
              }
            }}
            onUpdateLink={(updates) => {
              if (selectedLink) {
                updateLink(selectedLink.id, updates);
              }
            }}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Footer */}
      <footer className={mode === 'preview' ? 'bg-gray-900 text-white' : 'bg-gray-900 text-white'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {mode === 'preview' ? (
            // Preview mode footer - styled like home page
            <div className="text-center">
              <p className="text-sm text-gray-300 mb-2">
                © 2025 WasteHub. Converting waste into value through circular economy solutions.
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                <span>🌱 Sustainable Solutions</span>
                <span>•</span>
                <span>♻️ Circular Economy</span>
                <span>•</span>
                <span>🐔 Poultry Innovation</span>
              </div>
            </div>
          ) : (
            // Edit mode footer - show stats
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                © 2025 WasteHub. Converting waste into value through circular economy solutions.
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>Nodes: {nodes.length}</span>
                <span>•</span>
                <span>Links: {links.length}</span>
                <span>•</span>
                <span>Mode: {mode === 'edit' ? '🏗️ Edit' : '👁️ Preview'}</span>
              </div>
            </div>
          )}
        </div>
      </footer>

      {/* Theme Editor Modal */}
      {showThemeEditor && (
        <ThemeEditor
          theme={currentTheme}
          onThemeUpdate={updateTheme}
          onClose={() => setShowThemeEditor(false)}
        />
      )}

      {/* Image Import Modal */}
      <ImageImportModal
        isOpen={showImageImportModal}
        onClose={() => setShowImageImportModal(false)}
        onImport={handleImportFromImage}
      />
    </div>
  );
}