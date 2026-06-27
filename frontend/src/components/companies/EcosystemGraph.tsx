'use client';

import React, { useState } from 'react';

interface GraphNode {
  id: string;
  name: string;
  type: string; // 'center' | 'product' | 'investor' | 'competitor' | 'acquisition' | 'alumni'
  logo_url?: string | null;
}

interface GraphEdge {
  source: string;
  target: string;
}

interface EcosystemGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

interface PositionedNode extends GraphNode {
  x: number;
  y: number;
  color: string;
}

export default function EcosystemGraph({ nodes, edges }: EcosystemGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<PositionedNode | null>(null);

  // Find center node
  const centerNode = nodes.find((n) => n.type === 'center') || nodes[0];
  if (!centerNode) {
    return <div className="text-center py-12 text-gray-500 font-medium">No graph data available.</div>;
  }

  // Filter neighbors by type
  const products = nodes.filter((n) => n.type === 'product');
  const investors = nodes.filter((n) => n.type === 'investor');
  const competitors = nodes.filter((n) => n.type === 'competitor');
  const otherNodes = nodes.filter((n) => n.type !== 'center' && n.type !== 'product' && n.type !== 'investor' && n.type !== 'competitor');

  const positionedNodes: PositionedNode[] = [];

  // Color mapping
  const colors: Record<string, string> = {
    center: '#E53935', // brand red
    product: '#6366F1', // indigo
    investor: '#10B981', // green
    competitor: '#EF4444', // red
    acquisition: '#F59E0B', // amber
    alumni: '#6B7280', // gray
  };

  // Center coordinate
  const cx = 400;
  const cy = 300;
  positionedNodes.push({
    ...centerNode,
    x: cx,
    y: cy,
    color: colors.center,
  });

  // Calculate Product positions (Top cluster, y=100)
  const productY = 100;
  const pCount = products.length;
  const pSpacing = pCount > 1 ? Math.min(500 / (pCount - 1), 120) : 120;
  products.forEach((node, i) => {
    const x = cx + (i - (pCount - 1) / 2) * pSpacing;
    positionedNodes.push({
      ...node,
      x,
      y: productY,
      color: colors.product,
    });
  });

  // Calculate Investor positions (Left cluster, x=130)
  const investorX = 130;
  const iCount = investors.length;
  const iSpacing = iCount > 1 ? Math.min(360 / (iCount - 1), 75) : 75;
  investors.forEach((node, i) => {
    const y = cy + (i - (iCount - 1) / 2) * iSpacing;
    positionedNodes.push({
      ...node,
      x: investorX,
      y,
      color: colors.investor,
    });
  });

  // Calculate Competitor positions (Bottom cluster, y=490)
  const competitorY = 490;
  const cCount = competitors.length;
  const cSpacing = cCount > 1 ? Math.min(500 / (cCount - 1), 120) : 120;
  competitors.forEach((node, i) => {
    const x = cx + (i - (cCount - 1) / 2) * cSpacing;
    positionedNodes.push({
      ...node,
      x,
      y: competitorY,
      color: colors.competitor,
    });
  });

  // Calculate Other nodes positions (Right cluster, x=670)
  const otherX = 670;
  const oCount = otherNodes.length;
  const oSpacing = oCount > 1 ? Math.min(360 / (oCount - 1), 75) : 75;
  otherNodes.forEach((node, i) => {
    const y = cy + (i - (oCount - 1) / 2) * oSpacing;
    positionedNodes.push({
      ...node,
      x: otherX,
      y,
      color: colors[node.type] || '#6B7280',
    });
  });

  // Create a map for fast lookup of positioned node coordinates
  const nodePositionMap = new Map<string, { x: number; y: number }>();
  positionedNodes.forEach((n) => {
    nodePositionMap.set(n.id, { x: n.x, y: n.y });
  });

  return (
    <div className="relative w-full border border-gray-200/80 rounded-xl bg-gray-50/50 p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Ecosystem Connections</h3>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.center }} />
            <span className="text-gray-600">Company</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.product }} />
            <span className="text-gray-600">Products</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.investor }} />
            <span className="text-gray-600">Investors</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.competitor }} />
            <span className="text-gray-600">Competitors</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox="0 0 800 600"
          width="100%"
          height="auto"
          className="min-w-[640px] max-w-[800px] mx-auto select-none"
        >
          {/* ClipPath definitions for circular logo clipping */}
          <defs>
            {positionedNodes.map((node) => (
              <clipPath key={`clip-${node.id}`} id={`clipPath-${node.id}`}>
                <circle cx={node.x} cy={node.y} r={node.type === 'center' ? 24 : 14} />
              </clipPath>
            ))}
          </defs>

          {/* Draw connecting edges */}
          {edges.map((edge, idx) => {
            const start = nodePositionMap.get(edge.source);
            const end = nodePositionMap.get(edge.target);
            if (!start || !end) return null;

            return (
              <line
                key={`edge-${idx}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#E5E7EB"
                strokeWidth={1.5}
                className="transition-all duration-300"
              />
            );
          })}

          {/* Draw nodes */}
          {positionedNodes.map((node) => {
            const isCenter = node.type === 'center';
            const radius = isCenter ? 26 : 16;

            return (
              <g
                key={`node-${node.id}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Node Outer Circle Ring */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius + 3}
                  fill="white"
                  stroke={node.color}
                  strokeWidth={isCenter ? 2.5 : 1.5}
                  className="transition-all duration-200 hover:scale-110"
                />

                {/* Node Fill Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius}
                  fill="#F3F4F6"
                />

                {/* Clipped logo image if available, else letter icon */}
                {node.logo_url ? (
                  <image
                    href={node.logo_url}
                    x={node.x - (isCenter ? 24 : 14)}
                    y={node.y - (isCenter ? 24 : 14)}
                    width={isCenter ? 48 : 28}
                    height={isCenter ? 48 : 28}
                    clipPath={`url(#clipPath-${node.id})`}
                  />
                ) : (
                  <text
                    x={node.x}
                    y={node.y + 4.5}
                    textAnchor="middle"
                    fill="#374151"
                    fontSize={isCenter ? '14px' : '9px'}
                    fontWeight="bold"
                  >
                    {node.name.substring(0, 2).toUpperCase()}
                  </text>
                )}

                {/* Node Labels */}
                <text
                  x={node.x}
                  y={node.y + radius + 15}
                  textAnchor="middle"
                  fill="#374151"
                  fontSize="10px"
                  fontWeight={isCenter ? 'bold' : '600'}
                  className="transition-colors hover:fill-black pointer-events-none"
                >
                  {node.name.length > 15 ? `${node.name.substring(0, 12)}...` : node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* State-driven Tooltip Overlay */}
      {hoveredNode && (
        <div
          className="absolute z-10 bg-gray-900 text-white p-3 rounded-xl shadow-lg border border-gray-800 text-xs max-w-xs transition-opacity duration-200 pointer-events-none"
          style={{
            left: `${(hoveredNode.x / 800) * 100}%`,
            top: `${(hoveredNode.y / 600) * 100 - 15}%`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            {hoveredNode.logo_url && (
              <img
                src={hoveredNode.logo_url}
                alt={hoveredNode.name}
                className="h-5 w-5 rounded bg-white object-contain"
              />
            )}
            <span className="font-bold text-sm tracking-tight">{hoveredNode.name}</span>
          </div>
          <p className="text-gray-400 capitalize font-medium mb-0.5">
            Type: <span className="text-brand font-semibold">{hoveredNode.type}</span>
          </p>
          <p className="text-gray-500 font-medium">Click node on detail screen to explore.</p>
        </div>
      )}
    </div>
  );
}
