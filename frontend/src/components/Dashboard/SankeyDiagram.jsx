// src/components/Dashboard/SankeyDiagram.jsx
import React from 'react';
import { Box } from '@mui/material';
import { supplyChainData } from '../../data/dummy-data';

const STAGE_COLORS = {
  'Mining': '#0A84FF',      // iOS Blue
  'Processing': '#30B82C',  // iOS Green
  'Manufacturing': '#FF9F0A',// iOS Orange
  'Distribution': '#FF375F' // iOS Red
};

const SankeyDiagram = ({ commodity, selectedStage, onStageSelect }) => {
  const data = supplyChainData[commodity];
  const nodeWidth = 120;
  const nodeHeight = 40;
  const spacing = 100;
  const startX = 50;
  const startY = 50;

  // Helper to get opacity based on selection state
  const getNodeOpacity = (nodeId) => {
    if (!selectedStage) return 0.8;
    return selectedStage === nodeId ? 0.8 : 0.3;
  };

  const getLinkOpacity = (source, target) => {
    if (!selectedStage) return 0.6;
    return selectedStage === source || selectedStage === target ? 0.6 : 0.2;
  };

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <svg width="100%" height="100%" viewBox="0 0 600 300">
        {/* Draw links first so they appear behind nodes */}
        {data.links.map((link, index) => {
          const sourceIndex = data.nodes.findIndex(n => n.id === link.source);
          const targetIndex = data.nodes.findIndex(n => n.id === link.target);
          
          const x1 = startX + nodeWidth + (sourceIndex * (nodeWidth + spacing));
          const x2 = startX + (targetIndex * (nodeWidth + spacing));
          const y1 = startY + (nodeHeight / 2);
          const y2 = startY + (nodeHeight / 2);
          
          return (
            <path
              key={`link-${index}`}
              d={`M ${x1} ${y1} L ${x2 + nodeWidth} ${y2}`}
              stroke={STAGE_COLORS[link.source]}
              strokeWidth={Math.max(2, link.value / 20)}
              fill="none"
              opacity={getLinkOpacity(link.source, link.target)}
              style={{ transition: 'opacity 0.3s ease' }}
            />
          );
        })}
        
        {/* Draw nodes */}
        {data.nodes.map((node, index) => {
          const x = startX + (index * (nodeWidth + spacing));
          const y = startY;
          
          return (
            <g 
              key={`node-${index}`} 
              transform={`translate(${x},${y})`}
              onClick={() => onStageSelect(node.id)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                width={nodeWidth}
                height={nodeHeight}
                rx={4}
                fill={STAGE_COLORS[node.id]}
                opacity={getNodeOpacity(node.id)}
                style={{ transition: 'opacity 0.3s ease' }}
              />
              <text
                x={nodeWidth / 2}
                y={nodeHeight / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="14"
              >
                {node.name}
              </text>
            </g>
          );
        })}
      </svg>
    </Box>
  );
};

export default SankeyDiagram;