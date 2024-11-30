import React, { useState } from 'react';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { commodities } from '../../data/dummy-data';
import WorldMap from './WorldMap';
import SankeyDiagram from './SankeyDiagram';

const Dashboard = ({ selectedCommodity, onCommodityChange }) => {
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedView, setSelectedView] = useState('map');
  const [flowMetric, setFlowMetric] = useState('production');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleStageSelect = (stage) => {
    setSelectedStage(prev => prev === stage ? null : stage);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="commodity-select-label" sx={{ 
            fontFamily: 'SF Mono, Menlo, monospace',
            fontSize: '0.875rem'
          }}>
            Select Commodity
          </InputLabel>
          <Select
            labelId="commodity-select-label"
            value={selectedCommodity}
            label="Select Commodity"
            onChange={(e) => {
              onCommodityChange(e.target.value);
              setSelectedStage(null);
            }}
            sx={{
              fontFamily: 'SF Mono, Menlo, monospace',
              fontSize: '0.875rem',
              height: '48px'
            }}
          >
            {commodities.map(commodity => (
              <MenuItem 
                key={commodity} 
                value={commodity}
                sx={{ 
                  fontFamily: 'SF Mono, Menlo, monospace',
                  fontSize: '0.875rem'
                }}
              >
                {commodity}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <ToggleButtonGroup
          value={flowMetric}
          exclusive
          onChange={(e, value) => value && setFlowMetric(value)}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              fontFamily: 'SF Mono, Menlo, monospace',
              fontSize: '0.875rem',
              textTransform: 'none',
              px: 2
            }
          }}
        >
          <ToggleButton value="production">Production</ToggleButton>
          <ToggleButton value="emissions">Emissions</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Paper 
        elevation={0} 
        sx={{ 
          height: isMobile ? '500px' : '700px',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden'
        }}
      >
        {selectedView === 'map' ? (
          <WorldMap 
            commodity={selectedCommodity}
            selectedStage={selectedStage}
            onStageSelect={handleStageSelect}
            flowMetric={flowMetric}
          />
        ) : (
          <SankeyDiagram
            commodity={selectedCommodity}
            selectedStage={selectedStage}
            onStageSelect={handleStageSelect}
          />
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;

