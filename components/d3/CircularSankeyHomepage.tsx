'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import IconTooltip from '@/components/ui/IconTooltip';

interface DiagramNode {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  icon: string;
  iconOnly?: boolean;
  showLabel?: boolean;
  fontSize?: number;
}

interface DiagramLink {
  id: string;
  source: string;
  target: string;
  value: number;
  color: string;
  label?: string;
  animationFrequency?: number;
  animationRate?: number;
  animationSize?: number;
  particleIconSource?: string;
  particleIcon?: string;
  particleType?: string;
}

interface DiagramData {
  metadata?: {
    title: string;
    description: string;
    type: string;
    system: string;
  };
  nodes: DiagramNode[];
  links: DiagramLink[];
  config: {
    width: number;
    height: number;
    nodePadding?: number;
    nodeWidth?: number;
    circularLinkGap?: number;
  };
}

interface CircularSankeyHomepageProps {
  diagramData: DiagramData;
  width?: number;
  height?: number;
}

export function CircularSankeyHomepage({
  diagramData,
  width = 850,
  height = 700
}: CircularSankeyHomepageProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Tooltip state
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipIconPath, setTooltipIconPath] = useState<string | undefined>();
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [tooltipContext, setTooltipContext] = useState<'current' | 'proposed'>('current');

  useEffect(() => {
    if (!svgRef.current || !diagramData) return;

    // Determine context from metadata
    const context = diagramData.metadata?.system === 'proposed' ? 'proposed' : 'current';
    setTooltipContext(context);

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    
    // Create main group with transform
    const g = svg.append('g')
      .attr('class', 'diagram-group')
      .attr('transform', 'translate(0, -50)'); // Shift up slightly

    // Create node map for quick lookup
    const nodeMap = new Map(diagramData.nodes.map(node => [node.id, node]));

    // Generate link path (matching BuilderCanvas logic)
    const generateLinkPath = (link: DiagramLink, linkIndex: number): string => {
      const sourceNode = nodeMap.get(link.source);
      const targetNode = nodeMap.get(link.target);
      
      if (!sourceNode || !targetNode) return '';

      const sx = sourceNode.x + sourceNode.width;
      const sy = sourceNode.y + sourceNode.height / 2;
      const tx = targetNode.x;
      const ty = targetNode.y + targetNode.height / 2;

      // Forward connection: use cubic Bezier curve for natural S-curves
      const midX = (sx + tx) / 2;
      return `M ${sx} ${sy} C ${midX} ${sy}, ${midX} ${ty}, ${tx} ${ty}`;
    };

    // Create defs for path references (for textPath)
    const defs = g.append('defs');
    diagramData.links.forEach((link, index) => {
      defs.append('path')
        .attr('id', `link-path-${link.id}`)
        .attr('d', generateLinkPath(link, index))
        .attr('fill', 'none');
    });

    // Draw links
    const linksGroup = g.append('g').attr('class', 'links');
    
    diagramData.links.forEach((link, linkIndex) => {
      const sourceNode = nodeMap.get(link.source);
      const targetNode = nodeMap.get(link.target);
      
      if (!sourceNode || !targetNode) return;

      const linkGroup = linksGroup.append('g');
      const path = generateLinkPath(link, linkIndex);

      // Draw link path with proper width based on value
      linkGroup.append('path')
        .attr('d', path)
        .attr('stroke', link.color)
        .attr('stroke-width', link.value || 4) // Use link.value for width
        .attr('fill', 'none')
        .attr('opacity', 0.6)
        .attr('stroke-linecap', 'round');

      // Add link label following the path
      if (link.label) {
        linkGroup.append('text')
          .attr('font-size', '12')
          .attr('fill', '#374151')
          .attr('font-weight', '600')
          .attr('class', 'pointer-events-none select-none')
          .append('textPath')
          .attr('href', `#link-path-${link.id}`)
          .attr('startOffset', '50%')
          .attr('text-anchor', 'middle')
          .style('paint-order', 'stroke')
          .style('stroke', 'white')
          .style('stroke-width', '3')
          .style('stroke-linejoin', 'round')
          .text(link.label);
      }

      // Add animated particles (default if no animationFrequency is 3 particles)
      const particleCount = link.animationFrequency !== undefined ? link.animationFrequency : 3;
      const particleSize = link.animationSize || 4;
      const animationRate = link.animationRate || 3;
      const duration = (11 - animationRate) * 2; // Convert rate to duration

      if (particleCount > 0) {
        // Determine if we should use an icon
        const useIcon = link.particleIcon || (link.particleIconSource && link.particleIconSource !== 'dot');
        const iconPath = link.particleIcon || (useIcon ? link.particleIconSource : undefined);

        for (let i = 0; i < particleCount; i++) {
          const delay = (i / particleCount) * duration;
          
          if (useIcon && iconPath) {
            // Create icon particle (source and target nodes are guaranteed to exist here)
            if (!sourceNode || !targetNode) continue;
            
            const icon = linkGroup.append('image')
              .attr('href', iconPath)
              .attr('width', particleSize * 2)
              .attr('height', particleSize * 2)
              .attr('x', -particleSize)
              .attr('y', -particleSize)
              .attr('opacity', 0.8);

            // Capture node positions in closure
            const sx = sourceNode.x + sourceNode.width;
            const sy = sourceNode.y + sourceNode.height / 2;
            const tx = targetNode.x;
            const ty = targetNode.y + targetNode.height / 2;

            function animateIcon() {
              icon
                .attr('transform', `translate(${sx},${sy})`)
                .transition()
                .duration(duration * 1000)
                .ease(d3.easeLinear)
                .delay(delay * 1000)
                .attrTween('transform', function() {
                  return function(t) {
                    // Calculate position along cubic Bezier curve
                    const midX = (sx + tx) / 2;
                    
                    const x = Math.pow(1-t, 3) * sx + 
                             3 * Math.pow(1-t, 2) * t * midX + 
                             3 * (1-t) * Math.pow(t, 2) * midX + 
                             Math.pow(t, 3) * tx;
                    const y = Math.pow(1-t, 3) * sy + 
                             3 * Math.pow(1-t, 2) * t * sy + 
                             3 * (1-t) * Math.pow(t, 2) * ty + 
                             Math.pow(t, 3) * ty;
                    return `translate(${x},${y})`;
                  };
                })
                .on('end', animateIcon);
            }

            animateIcon();
          } else {
            // Create circle particle (source and target nodes are guaranteed to exist here)
            if (!sourceNode || !targetNode) continue;
            
            const circle = linkGroup.append('circle')
              .attr('r', particleSize)
              .attr('fill', link.color)
              .attr('opacity', 0.8);

            // Capture node positions in closure
            const sx = sourceNode.x + sourceNode.width;
            const sy = sourceNode.y + sourceNode.height / 2;
            const tx = targetNode.x;
            const ty = targetNode.y + targetNode.height / 2;

            function animate() {
              circle
                .attr('transform', `translate(${sx},${sy})`)
                .transition()
                .duration(duration * 1000)
                .ease(d3.easeLinear)
                .delay(delay * 1000)
                .attrTween('transform', function() {
                  return function(t) {
                    const midX = (sx + tx) / 2;
                    
                    const x = Math.pow(1-t, 3) * sx + 
                             3 * Math.pow(1-t, 2) * t * midX + 
                             3 * (1-t) * Math.pow(t, 2) * midX + 
                             Math.pow(t, 3) * tx;
                    const y = Math.pow(1-t, 3) * sy + 
                             3 * Math.pow(1-t, 2) * t * sy + 
                             3 * (1-t) * Math.pow(t, 2) * ty + 
                             Math.pow(t, 3) * ty;
                    return `translate(${x},${y})`;
                  };
                })
                .on('end', animate);
            }

            animate();
          }
        }
      }
    });

    // Draw nodes
    const nodesGroup = g.append('g').attr('class', 'nodes');
    
    diagramData.nodes.forEach(node => {
      const nodeGroup = nodesGroup.append('g')
        .attr('class', 'node')
        .attr('transform', `translate(${node.x},${node.y})`);

      // Add icon
      nodeGroup.append('image')
        .attr('href', node.icon)
        .attr('width', node.width)
        .attr('height', node.height)
        .attr('preserveAspectRatio', 'xMidYMid meet');

      // Add label if showLabel is true (matching BuilderCanvas logic)
      if (node.showLabel !== false) {
        // Split name by <br/> or <br> for multi-line support
        const lines = node.name.split(/<br\s*\/?>/i);
        const fontSize = node.fontSize || 12;
        const lineHeight = fontSize * 1.2;
        const yBase = node.iconOnly ? node.height + 15 : node.height - 10;
        const yOffset = lines.length > 1 ? -((lines.length - 1) * lineHeight) / 2 : 0;
        
        const textGroup = nodeGroup.append('text')
          .attr('x', node.width / 2)
          .attr('y', yBase + yOffset)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', '#1f2937')
          .attr('font-size', fontSize)
          .attr('font-weight', '600')
          .attr('class', 'pointer-events-none select-none');

        lines.forEach((line, i) => {
          textGroup.append('tspan')
            .attr('x', node.width / 2)
            .attr('dy', i === 0 ? 0 : lineHeight)
            .text(line);
        });
      }

      // Add hover effects and tooltip
      nodeGroup
        .style('cursor', 'pointer')
        .on('mouseenter', function(event) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('transform', `translate(${node.x},${node.y}) scale(1.05)`);
          
          // Show tooltip
          if (node.icon) {
            setTooltipIconPath(node.icon);
            setTooltipPos({ x: event.clientX, y: event.clientY });
            setTooltipVisible(true);
          }
        })
        .on('mousemove', function(event) {
          if (tooltipVisible) {
            setTooltipPos({ x: event.clientX, y: event.clientY });
          }
        })
        .on('mouseleave', function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('transform', `translate(${node.x},${node.y}) scale(1)`);
          
          // Hide tooltip
          setTooltipVisible(false);
        });
    });

    // Center the diagram
    const bbox = g.node()?.getBBox();
    if (bbox) {
      const scale = Math.min(
        width / (bbox.width + 40),
        height / (bbox.height + 40),
        1
      );
      const translateX = (width - bbox.width * scale) / 2 - bbox.x * scale;
      const translateY = (height - bbox.height * scale) / 2 - bbox.y * scale;
      
      g.attr('transform', `translate(${translateX},${translateY}) scale(${scale})`);
    }

  }, [diagramData, width, height]);

  return (
    <div ref={containerRef} className="w-full relative" style={{ height: `${height}px` }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full"
        style={{ background: 'transparent' }}
      />
      
      {/* Tooltip */}
      <IconTooltip
        iconPath={tooltipIconPath}
        context={tooltipContext}
        x={tooltipPos.x}
        y={tooltipPos.y}
        visible={tooltipVisible}
      />
    </div>
  );
}