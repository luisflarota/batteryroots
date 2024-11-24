// src/components/Dashboard/Legend.jsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Legend = () => {
  const legendItems = [
    { color: '#1976d2', label: 'Mining' },
    { color: '#2196f3', label: 'Processing' },
    { color: '#64b5f6', label: 'Manufacturing' },
    { color: '#90caf9', label: 'Distribution' }
  ];

  return (
    <Paper sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
      <Typography variant="subtitle2" color="text.secondary">
        Supply Chain Stages:
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {legendItems.map(({ color, label }) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: color,
                borderRadius: 0.5
              }}
            />
            <Typography variant="body2">{label}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default Legend;