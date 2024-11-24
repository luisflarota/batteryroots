// src/utils/supplyChainUtils.js
export const STAGE_COLORS = {
  'Mining': '#0A84FF',      // iOS Blue
  'Processing': '#30B82C',  // iOS Green
  'Manufacturing': '#FF9F0A',// iOS Orange
  'Distribution': '#FF375F' // iOS Red
};

export const calculateNodeSize = (value) => {
  return Math.sqrt(value) * 1.5;
};

export const getStageColor = (stage, opacity = 1) => {
  return `${STAGE_COLORS[stage]}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};