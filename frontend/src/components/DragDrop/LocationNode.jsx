import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const LocationNode = ({ location, stage, isSelected, clickable }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        bgcolor: 'background.paper',
        border: isSelected ? '2px solid' : 'none',
        borderColor: 'primary.main',
        '&:hover': {
          bgcolor: clickable ? 'action.hover' : 'background.paper',
          transform: clickable ? 'scale(1.02)' : 'none',
          cursor: clickable ? 'grab' : 'default'
        },
        '&:active': {
          cursor: clickable ? 'grabbing' : 'default'
        },
        transition: 'all 0.2s ease'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="subtitle2" color="primary" fontWeight="bold">
          {location.company}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {location.site}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">
            {location.country}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Value: {location.value}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default LocationNode;