'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { BuilderNode, BuilderLink, EditorMode, SelectedItem } from '@/types/builder';
import { DiagramTheme } from '@/types/builder-theme';
import IconTooltip from '@/components/ui/IconTooltip';

interface BuilderCanvasProps {
  nodes: BuilderNode[];
  links: BuilderLink[];
  mode: EditorMode;
  selectedItem: SelectedItem | null;
  isDrawingConnection: boolean;
  connectionStart: string | null;
  theme: DiagramTheme;
  onNodeClick: (nodeId: string) => void;
  onLinkClick: (linkId: string) => void;
  onNodeDrag: (nodeId: string, x: number, y: number) => void;
  onLinkDrag: (linkId: string, updates: Partial<BuilderLink>) => void;
  onCanvasClick: () => void;
  onConnectionComplete?: (targetNodeId: string) => void;
}

export default function BuilderCanvas({
  nodes,
  links,
  mode,
  selectedItem,
  isDrawingConnection,
  connectionStart,
  theme,
  onNodeClick,
  onLinkClick,
  onNodeDrag,
  onLinkDrag,
  onCanvasClick,
  onConnectionComplete,
}: BuilderCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [draggingLinkHandle, setDraggingLinkHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [linkDragStart, setLinkDragStart] = useState({ curveOffset: 0, mouseY: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  
  // Zoom and pan state
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  
  // Tooltip state
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipIconPath, setTooltipIconPath] = useState<string | undefined>();
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Track mouse position for connection drawing
  useEffect(() => {
    if (!isDrawingConnection || !svgRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDrawingConnection]);

  // Handle mouse down on node (start drag)
  const handleNodeMouseDown = useCallback((nodeId: string, e: React.MouseEvent) => {
    if (mode !== 'edit') return;
    
    e.stopPropagation();
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !svgRef.current) return;

    // Convert client coordinates to SVG coordinates
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const scaleX = 1000 / rect.width;  // viewBox width / actual width
    const scaleY = 1100 / rect.height; // viewBox height / actual height
    
    const svgX = (e.clientX - rect.left) * scaleX;
    const svgY = (e.clientY - rect.top) * scaleY;

    setDraggingNode(nodeId);
    // Store offset from click point to node's position
    setDragStart({ x: svgX - node.x, y: svgY - node.y });
    setHasDragged(false);
  }, [mode, nodes]);

  // Handle mouse move (during drag)
  useEffect(() => {
    if (!draggingNode || !svgRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const svg = svgRef.current;
      if (!svg) return;

      setHasDragged(true);

      const rect = svg.getBoundingClientRect();
      const scaleX = 1000 / rect.width;  // viewBox width / actual width
      const scaleY = 1100 / rect.height; // viewBox height / actual height
      
      // Convert client coordinates to SVG coordinates
      const svgX = (e.clientX - rect.left) * scaleX;
      const svgY = (e.clientY - rect.top) * scaleY;
      
      // Subtract the initial offset to get new node position
      const x = svgX - dragStart.x;
      const y = svgY - dragStart.y;

      const newX = Math.max(40, Math.min(960, x));
      const newY = Math.max(40, Math.min(1060, y));

      onNodeDrag(draggingNode, newX, newY);
    };

    const handleMouseUp = () => {
      setDraggingNode(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingNode, dragStart, onNodeDrag]);

  // Generate path between nodes with circular arcs for reverse connections
  const generateLinkPath = (link: BuilderLink, linkIndex: number): string => {
    const sourceNode = nodes.find(n => n.id === link.source);
    const targetNode = nodes.find(n => n.id === link.target);
    
    if (!sourceNode || !targetNode) return '';

    const sx = sourceNode.x + (sourceNode.width || 80);
    const sy = sourceNode.y + (sourceNode.height || 50) / 2;
    const tx = targetNode.x;
    const ty = targetNode.y + (targetNode.height || 50) / 2;

    // Check if this is a reverse connection (target is left of source)
    if (tx < sx) {
      // Calculate stagger to prevent overlaps - each link gets its own offset
      const stagger = linkIndex * 60; // Offset by 60px for each link
      const gap = 30; // Gap from nodes
      // Use custom returnY if provided, otherwise calculate staggered position
      const bottomY = link.returnY !== undefined
        ? link.returnY
        : Math.max(sy, ty) + 100 + stagger;
      
      return `
        M ${sx} ${sy}
        L ${sx + gap} ${sy}
        Q ${sx + gap + 20} ${sy} ${sx + gap + 20} ${sy + 20}
        L ${sx + gap + 20} ${bottomY - 20}
        Q ${sx + gap + 20} ${bottomY} ${sx + gap} ${bottomY}
        L ${tx - gap} ${bottomY}
        Q ${tx - gap - 20} ${bottomY} ${tx - gap - 20} ${bottomY - 20}
        L ${tx - gap - 20} ${ty + 20}
        Q ${tx - gap - 20} ${ty} ${tx - gap} ${ty}
        L ${tx} ${ty}
      `;
    }

    // Forward connection: use cubic Bezier curve for natural S-curves
    const midX = (sx + tx) / 2;
    
    // Use cubic Bezier with horizontal control points for smooth S-curve
    // This creates the "little curves" that look natural
    return `M ${sx} ${sy} C ${midX} ${sy}, ${midX} ${ty}, ${tx} ${ty}`;
  };

  // Get path midpoint for label placement
  const getPathMidpoint = (link: BuilderLink): { x: number; y: number } => {
    const sourceNode = nodes.find(n => n.id === link.source);
    const targetNode = nodes.find(n => n.id === link.target);
    
    if (!sourceNode || !targetNode) return { x: 0, y: 0 };

    const sx = sourceNode.x + (sourceNode.width || 80);
    const sy = sourceNode.y + (sourceNode.height || 50) / 2;
    const tx = targetNode.x;
    const ty = targetNode.y + (targetNode.height || 50) / 2;

    // Simple midpoint for now
    return {
      x: (sx + tx) / 2,
      y: (sy + ty) / 2
    };
  };

  // Wheel handler - use for panning only, not zooming
  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Don't zoom on wheel/trackpad scroll - only use pinch gestures
    // Allow natural scrolling for panning
    if (!e.ctrlKey) {
      // Regular scroll - pan the canvas
      setPanX(prev => prev - e.deltaX);
      setPanY(prev => prev - e.deltaY);
    } else {
      // Ctrl+Scroll - zoom (for mouse users)
      e.preventDefault();
      const delta = -e.deltaY * 0.001;
      const newZoom = Math.min(Math.max(0.25, zoom + delta), 3);
      setZoom(newZoom);
    }
  }, [zoom]);

  const handleZoomIn = () => {
    setZoom(Math.min(zoom * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom / 1.2, 0.25));
  };

  const handleZoomReset = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  // Touch handlers for pinch-to-zoom
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      setLastTouchDistance(distance);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance !== null) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const delta = (distance - lastTouchDistance) * 0.01;
      const newZoom = Math.min(Math.max(0.25, zoom + delta), 3);
      setZoom(newZoom);
      setLastTouchDistance(distance);
    }
  }, [lastTouchDistance, zoom]);

  const handleTouchEnd = useCallback(() => {
    setLastTouchDistance(null);
  }, []);

  // Pan handlers (Shift+drag)
  const handlePanStart = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) { // Middle click or Shift+Left click
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  }, [panX, panY]);

  const handlePanMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPanX(e.clientX - panStart.x);
      setPanY(e.clientY - panStart.y);
    }
  }, [isPanning, panStart]);

  const handlePanEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Link drag handlers - for adjusting returnY of backward links
  const handleLinkHandleMouseDown = useCallback((linkId: string, link: BuilderLink, linkIndex: number, e: React.MouseEvent) => {
    if (mode !== 'edit') return;
    e.stopPropagation();
    
    const svg = svgRef.current;
    if (!svg) return;
    
    const rect = svg.getBoundingClientRect();
    const scaleY = 1100 / rect.height;
    const svgY = (e.clientY - rect.top) * scaleY;
    
    // Get current returnY or calculate default (MUST match the rendering logic!)
    const sourceNode = nodes.find(n => n.id === link.source);
    const targetNode = nodes.find(n => n.id === link.target);
    if (!sourceNode || !targetNode) return;
    
    const sy = sourceNode.y + (sourceNode.height || 50) / 2;
    const ty = targetNode.y + (targetNode.height || 50) / 2;
    // IMPORTANT: Include the stagger offset that's used when rendering the handle!
    const stagger = linkIndex * 60;
    const currentReturnY = link.returnY !== undefined ? link.returnY : Math.max(sy, ty) + 100 + stagger;
    
    // If returnY is not set yet, set it now to "lock in" the current position
    // This prevents any jump when transitioning from calculated→explicit value
    if (link.returnY === undefined) {
      onLinkDrag(linkId, { returnY: currentReturnY });
    }
    
    setDraggingLinkHandle(linkId);
    setLinkDragStart({
      curveOffset: currentReturnY,
      mouseY: svgY
    });
    setHasDragged(false);
  }, [mode, nodes, onLinkDrag]);

  // Handle link handle drag
  useEffect(() => {
    if (!draggingLinkHandle || !svgRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const svg = svgRef.current;
      if (!svg) return;

      setHasDragged(true);

      const rect = svg.getBoundingClientRect();
      const scaleY = 1100 / rect.height;
      const svgY = (e.clientY - rect.top) * scaleY;
      
      // Calculate new returnY based on mouse position
      const deltaY = svgY - linkDragStart.mouseY;
      const newReturnY = linkDragStart.curveOffset + deltaY;
      
      // Clamp to reasonable range (below nodes)
      const clampedReturnY = Math.max(0, Math.min(1200, newReturnY));
      
      // Update the link's returnY
      onLinkDrag(draggingLinkHandle, { returnY: clampedReturnY });
    };

    const handleMouseUp = () => {
      setDraggingLinkHandle(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingLinkHandle, linkDragStart, onLinkDrag]);

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCanvasClick();
    }
  };

  // Handle node click
  const handleNodeClick = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isDrawingConnection && connectionStart !== nodeId) {
      onConnectionComplete?.(nodeId);
    } else if (!isDrawingConnection) {
      onNodeClick(nodeId);
    }
  };

  // Get connection start node for preview line
  const startNode = connectionStart ? nodes.find(n => n.id === connectionStart) : null;

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-hidden relative"
      style={{ backgroundColor: theme.defaults.canvas.backgroundColor }}
      onMouseDown={handlePanStart}
      onMouseMove={handlePanMove}
      onMouseUp={handlePanEnd}
      onMouseLeave={handlePanEnd}
    >
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
          title="Zoom In (or use mouse wheel)"
        >
          <span className="text-xl font-bold">+</span>
        </button>
        <button
          onClick={handleZoomReset}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded transition-colors text-xs font-semibold"
          title="Reset Zoom"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
          title="Zoom Out (or use mouse wheel)"
        >
          <span className="text-xl font-bold">−</span>
        </button>
      </div>

      {/* Pan instruction */}
      {zoom > 1 && (
        <div className="absolute bottom-4 left-4 z-10 bg-black/70 text-white px-3 py-2 rounded text-sm">
          💡 Two-finger scroll to pan • Pinch to zoom • Hold <kbd className="bg-white/20 px-1.5 py-0.5 rounded text-xs">Ctrl</kbd> + scroll to zoom
        </div>
      )}

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 -100 1000 1400"
        onClick={handleCanvasClick}
        className={isPanning ? "cursor-grabbing" : "cursor-default"}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          touchAction: 'none'
        }}
      >
        <g transform={`translate(${panX / zoom}, ${panY / zoom}) scale(${zoom})`}>
        {/* Grid pattern */}
        {theme.defaults.canvas.gridEnabled && (
          <>
            <defs>
              <pattern
                id="grid"
                width={theme.defaults.canvas.gridSize}
                height={theme.defaults.canvas.gridSize}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M ${theme.defaults.canvas.gridSize} 0 L 0 0 0 ${theme.defaults.canvas.gridSize}`}
                  fill="none"
                  stroke={theme.defaults.canvas.gridColor}
                  strokeWidth="0.5"
                  opacity={theme.defaults.canvas.gridOpacity || 0.5}
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </>
        )}

        {/* Links */}
        <g className="links">
          {/* Define paths for textPath references */}
          <defs>
            {links.map((link, index) => {
              const sourceNode = nodes.find(n => n.id === link.source);
              const targetNode = nodes.find(n => n.id === link.target);
              const isReverse = sourceNode && targetNode && targetNode.x < sourceNode.x + (sourceNode.width || 80);
              
              return (
                <path
                  key={`path-def-${link.id}`}
                  id={`link-path-${link.id}`}
                  d={generateLinkPath(link, index)}
                  fill="none"
                />
              );
            })}
          </defs>
          
          {links.map((link, index) => {
            const sourceNode = nodes.find(n => n.id === link.source);
            const targetNode = nodes.find(n => n.id === link.target);
            const isReverse = sourceNode && targetNode && targetNode.x < sourceNode.x + (sourceNode.width || 80);
            
            return (
              <g key={link.id}>
                <path
                  d={generateLinkPath(link, index)}
                  stroke={link.color || theme.defaults.link.color}
                  strokeWidth={link.value || theme.defaults.link.thickness}
                  fill="none"
                  opacity={theme.defaults.link.opacity || 0.6}
                  className="cursor-pointer hover:opacity-100 transition-opacity"
                  style={{
                    strokeLinecap: 'round',
                    filter: selectedItem?.type === 'link' && selectedItem.id === link.id
                      ? 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.8))'
                      : undefined
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onLinkClick(link.id);
                  }}
                />
                
                {/* Link label following the path */}
                {link.label && (
                  <text
                    fontSize="12"
                    fill="#374151"
                    fontWeight="600"
                    className="pointer-events-none select-none"
                  >
                    <textPath
                      href={`#link-path-${link.id}`}
                      startOffset={isReverse ? "15%" : "50%"}
                      textAnchor="middle"
                      style={{
                        paintOrder: 'stroke',
                        stroke: 'white',
                        strokeWidth: 3,
                        strokeLinejoin: 'round'
                      }}
                    >
                      {link.label}
                    </textPath>
                  </text>
                )}

                {/* Animated particles (dots or icons) */}
                {Array.from({ length: link.animationFrequency || 5 }).map((_, dotIndex) => {
                  const animationRate = link.animationRate || 5;
                  const particleSize = link.animationSize || 4;
                  const duration = (11 - animationRate) * 2; // Convert rate to duration (slow = longer)
                  const delay = (dotIndex / (link.animationFrequency || 5)) * duration; // Stagger particles
                  
                  // Determine if we should use an icon
                  const useIcon = link.particleIconSource && link.particleIconSource !== 'dot';
                  let iconPath: string | undefined;
                  
                  if (useIcon) {
                    const sourceNode = nodes.find(n => n.id === link.source);
                    const targetNode = nodes.find(n => n.id === link.target);
                    
                    if (link.particleIconSource === 'source') {
                      iconPath = sourceNode?.icon;
                    } else if (link.particleIconSource === 'target') {
                      iconPath = targetNode?.icon;
                    } else if (link.particleIconSource === 'custom' && link.particleIcon) {
                      iconPath = link.particleIcon;
                    }
                  }
                  
                  return useIcon && iconPath ? (
                    <image
                      key={`particle-${link.id}-${dotIndex}`}
                      href={iconPath}
                      width={particleSize * 4}
                      height={particleSize * 4}
                      x={-particleSize * 2}
                      y={-particleSize * 2}
                      opacity="0.9"
                      className="pointer-events-none"
                    >
                      <animateMotion
                        dur={`${duration}s`}
                        repeatCount="indefinite"
                        begin={`${delay}s`}
                      >
                        <mpath href={`#link-path-${link.id}`} />
                      </animateMotion>
                    </image>
                  ) : (
                    <circle
                      key={`dot-${link.id}-${dotIndex}`}
                      r={particleSize}
                      fill={link.color}
                      opacity="0.8"
                      className="pointer-events-none"
                    >
                      <animateMotion
                        dur={`${duration}s`}
                        repeatCount="indefinite"
                        begin={`${delay}s`}
                      >
                        <mpath href={`#link-path-${link.id}`} />
                      </animateMotion>
                    </circle>
                  );
                })}
                
                {/* Drag handle for return links - only show in edit mode */}
                {mode === 'edit' && isReverse && sourceNode && targetNode && (() => {
                  const sx = sourceNode.x + (sourceNode.width || 80);
                  const sy = sourceNode.y + (sourceNode.height || 50) / 2;
                  const ty = targetNode.y + (targetNode.height || 50) / 2;
                  const bottomY = link.returnY !== undefined
                    ? link.returnY
                    : Math.max(sy, ty) + 100 + (index * 60);
                  const midX = (sx + targetNode.x) / 2;
                  
                  return (
                    <g>
                      {/* Drag handle circle */}
                      <circle
                        cx={midX}
                        cy={bottomY}
                        r="8"
                        fill={selectedItem?.type === 'link' && selectedItem.id === link.id ? '#9333EA' : '#6B7280'}
                        stroke="white"
                        strokeWidth="2"
                        className="cursor-ns-resize hover:fill-purple-600 transition-colors"
                        onMouseDown={(e) => handleLinkHandleMouseDown(link.id, link, index, e)}
                        style={{
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                        }}
                      />
                      {/* Drag handle icon */}
                      <text
                        x={midX}
                        y={bottomY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="10"
                        className="pointer-events-none select-none"
                        fontWeight="bold"
                      >
                        ⇕
                      </text>
                    </g>
                  );
                })()}
              </g>
            );
          })}
        </g>

        {/* Preview connection line while drawing */}
        {isDrawingConnection && startNode && (
          <line
            x1={startNode.x + (startNode.width || 80)}
            y1={startNode.y + (startNode.height || 50) / 2}
            x2={mousePos.x}
            y2={mousePos.y}
            stroke="#9333EA"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.6"
          />
        )}

        {/* Nodes */}
        <g className="nodes">
          {nodes.map(node => (
            <g
              key={node.id}
              className={`builder-node ${mode === 'edit' ? 'cursor-move' : 'cursor-pointer'}`}
              transform={`translate(${node.x}, ${node.y})`}
              onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
              onClick={(e) => {
                e.stopPropagation();
                if (mode !== 'edit') {
                  handleNodeClick(node.id, e);
                } else if (!hasDragged) {
                  // Only trigger click if we didn't drag
                  handleNodeClick(node.id, e);
                }
              }}
              onMouseEnter={(e) => {
                if (node.icon) {
                  setTooltipIconPath(node.icon);
                  setTooltipPos({ x: e.clientX, y: e.clientY });
                  setTooltipVisible(true);
                }
              }}
              onMouseMove={(e) => {
                if (tooltipVisible) {
                  setTooltipPos({ x: e.clientX, y: e.clientY });
                }
              }}
              onMouseLeave={() => {
                setTooltipVisible(false);
              }}
            >
              {/* Invisible hitbox for icon-only nodes (enables dragging) */}
              {node.iconOnly && (
                <rect
                  width={node.width || 80}
                  height={node.height || 50}
                  fill="transparent"
                  stroke={selectedItem?.type === 'node' && selectedItem.id === node.id ? '#9333EA' : 'transparent'}
                  strokeWidth={selectedItem?.type === 'node' && selectedItem.id === node.id ? 2 : 0}
                  strokeDasharray={selectedItem?.type === 'node' && selectedItem.id === node.id ? '4,4' : '0'}
                  rx={4}
                  className="transition-all"
                />
              )}
              
              {/* Node rectangle - only show if not icon-only mode */}
              {!node.iconOnly && (
                <rect
                  width={node.width || 80}
                  height={node.height || 50}
                  fill={node.color || theme.defaults.node.fillColor}
                  stroke={
                    selectedItem?.type === 'node' && selectedItem.id === node.id
                      ? '#9333EA'
                      : (theme.defaults.node.strokeColor || '#374151')
                  }
                  strokeWidth={
                    selectedItem?.type === 'node' && selectedItem.id === node.id
                      ? 3
                      : (theme.defaults.node.strokeWidth || 1)
                  }
                  rx={theme.defaults.node.borderRadius || 4}
                  className="transition-all"
                  style={{
                    filter: selectedItem?.type === 'node' && selectedItem.id === node.id
                      ? 'drop-shadow(0 0 12px rgba(147, 51, 234, 0.8))'
                      : (theme.defaults.node.shadow?.enabled
                        ? `drop-shadow(0 ${theme.defaults.node.shadow.offset.y}px ${theme.defaults.node.shadow.blur}px ${theme.defaults.node.shadow.color})`
                        : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))')
                  }}
                />
              )}
              
              {/* Node icon */}
              {node.icon && (
                <image
                  href={node.icon}
                  x={node.iconOnly ? 0 : (node.width || 80) / 2 - 20}
                  y={node.iconOnly ? 0 : 10}
                  width={node.iconOnly ? (node.width || 80) : 40}
                  height={node.iconOnly ? (node.height || 50) : 40}
                  preserveAspectRatio="xMidYMid meet"
                  className="pointer-events-none"
                  style={{
                    filter: selectedItem?.type === 'node' && selectedItem.id === node.id && node.iconOnly
                      ? 'drop-shadow(0 0 12px rgba(147, 51, 234, 0.8))'
                      : 'none'
                  }}
                />
              )}
              
              {/* Node label - only show if showLabel is not false */}
              {(node.showLabel !== false) && (() => {
                // Split name by <br/> or <br> for multi-line support
                const lines = node.name.split(/<br\s*\/?>/i);
                const fontSize = node.fontSize || theme.defaults.node.fontSize || 12;
                const lineHeight = fontSize * 1.2;
                const yBase = node.iconOnly ? (node.height || 50) + 15 : (node.icon ? (node.height || 50) - 10 : (node.height || 50) / 2);
                // Adjust y position to center multi-line text
                const yOffset = lines.length > 1 ? -((lines.length - 1) * lineHeight) / 2 : 0;
                
                return (
                  <text
                    x={(node.width || 80) / 2}
                    y={yBase + yOffset}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={theme.defaults.node.textColor || "#1f2937"}
                    fontSize={fontSize}
                    fontWeight={theme.defaults.node.fontWeight || 600}
                    className="pointer-events-none select-none"
                  >
                    {lines.map((line, i) => (
                      <tspan
                        key={i}
                        x={(node.width || 80) / 2}
                        dy={i === 0 ? 0 : lineHeight}
                      >
                        {line}
                      </tspan>
                    ))}
                  </text>
                );
              })()}

              {/* Connection indicator in connection mode */}
              {isDrawingConnection && (
                <circle
                  cx={(node.width || 80) / 2}
                  cy={(node.height || 50) / 2}
                  r="8"
                  fill="none"
                  stroke="#9333EA"
                  strokeWidth="2"
                  className="animate-pulse"
                />
              )}
            </g>
          ))}
        </g>
        </g>
      </svg>

      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-400">
            <div className="text-6xl mb-4">🎨</div>
            <div className="text-xl font-semibold mb-2">Start Building Your Flow</div>
            <div className="text-sm">Click "Add Node" to create your first node</div>
          </div>
        </div>
      )}

      {/* Connection mode hint */}
      {isDrawingConnection && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <span>🔗</span>
            <span className="font-semibold">
              {!connectionStart
                ? 'Click source node to start connection'
                : 'Click target node to complete connection'}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCanvasClick();
              }}
              className="ml-4 text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded"
            >
              Cancel (Esc)
            </button>
          </div>
        </div>
      )}

      {/* Tooltip */}
      <IconTooltip
        iconPath={tooltipIconPath}
        context="proposed"
        x={tooltipPos.x}
        y={tooltipPos.y}
        visible={tooltipVisible}
      />
    </div>
  );
}