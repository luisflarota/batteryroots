// src/components/Dashboard/Dashboard.jsx
import React from 'react';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Paper 
} from '@mui/material';
import { commodities } from '../../data/dummy-data';
import WorldMap from './WorldMap';

const Dashboard = ({ selectedCommodity, onCommodityChange }) => {
  const [selectedStage, setSelectedStage] = React.useState(null);

  const handleStageSelect = (stage) => {
    setSelectedStage(prev => prev === stage ? null : stage);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Commodity</InputLabel>
        <Select
          value={selectedCommodity}
          label="Commodity"
          onChange={(e) => {
            onCommodityChange(e.target.value);
            setSelectedStage(null);
          }}
        >
          {commodities.map(commodity => (
            <MenuItem key={commodity} value={commodity}>
              {commodity}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Paper sx={{ p: 3, height: '700px' }}>
        <WorldMap 
          commodity={selectedCommodity}
          selectedStage={selectedStage}
          onStageSelect={handleStageSelect}
        />
      </Paper>
    </Box>
  );
};

export default Dashboard;