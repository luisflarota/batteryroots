// src/components/DragDrop/DragDropBuilder.jsx
import React, { useState } from 'react';
import { Box, Paper, Typography, FormControl, Select, MenuItem, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Xarrow, { Xwrapper } from 'react-xarrows';
import LocationNode from './LocationNode';
import WorldMap from '../Dashboard/WorldMap';
import { supplyChainData } from '../../data/dummy-data';

const SUPPLY_CHAIN_STEPS = ['Mining', 'Processing', 'Manufacturing', 'Distribution'];

const DragDropBuilder = ({ selectedCommodity, onCommodityChange }) => {
  const [customChain, setCustomChain] = useState({
    Mining: [],
    Processing: [],
    Manufacturing: [],
    Distribution: []
  });
  const [connections, setConnections] = useState([]);
  const [startConnection, setStartConnection] = useState(null);
  const [showVisualization, setShowVisualization] = useState(false);
  const [usedCompanies, setUsedCompanies] = useState(new Set());

  const handleCompanyClick = (location, step) => {
    if (!usedCompanies.has(`${location.company}-${location.site}`)) {
      setCustomChain(prev => ({
        ...prev,
        [step]: [...prev[step], location]
      }));
      setUsedCompanies(prev => new Set([...prev, `${location.company}-${location.site}`]));
    }
  };

  const handleChainNodeClick = (nodeId, step) => {
    if (!startConnection) {
      setStartConnection({ id: nodeId, step });
    } else {
      // Only connect if clicking a node in the next step
      const startStepIndex = SUPPLY_CHAIN_STEPS.indexOf(startConnection.step);
      const endStepIndex = SUPPLY_CHAIN_STEPS.indexOf(step);
      
      if (endStepIndex === startStepIndex + 1) {
        setConnections(prev => [...prev, {
          start: startConnection.id,
          end: nodeId
        }]);
      }
      setStartConnection(null);
    }
  };

  const handleRemoveConnection = (connectionIndex) => {
    setConnections(prev => prev.filter((_, index) => index !== connectionIndex));
  };

  const handleRemoveCompany = (step, index) => {
    const removedCompany = customChain[step][index];
    setCustomChain(prev => ({
      ...prev,
      [step]: prev[step].filter((_, i) => i !== index)
    }));
    setUsedCompanies(prev => {
      const newSet = new Set(prev);
      newSet.delete(`${removedCompany.company}-${removedCompany.site}`);
      return newSet;
    });
    // Remove any connections involving this company
    setConnections(prev => prev.filter(conn => 
      !conn.start.startsWith(`${step}-${index}`) && 
      !conn.end.startsWith(`${step}-${index}`)
    ));
  };

  const isChainValid = () => {
    return SUPPLY_CHAIN_STEPS.every(step => customChain[step].length > 0) && 
           connections.length === SUPPLY_CHAIN_STEPS.length - 1;
  };

  const getAvailableCompanies = (step) => {
    return supplyChainData[selectedCommodity].locations[step].filter(
      location => !usedCompanies.has(`${location.company}-${location.site}`)
    );
  };

  // Transform custom chain data to match the exact format expected by WorldMap
  const getCustomMapData = () => {
    const customData = {
      locations: {},
      links: []  // Note: using 'links' instead of 'flows' to match existing format
    };

    // Add only the selected companies for each stage
    SUPPLY_CHAIN_STEPS.forEach(stage => {
      if (customChain[stage] && customChain[stage].length > 0) {
        customData.locations[stage] = customChain[stage];
      } else {
        customData.locations[stage] = [];
      }
    });

    // Add only the drawn connections
    connections.forEach(conn => {
      const [sourceStep] = conn.start.split('-');
      const [targetStep] = conn.end.split('-');
      
      customData.links.push({
        source: sourceStep,
        target: targetStep
      });
    });

    return customData;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Builder Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControl size="small">
            <Select
              value={selectedCommodity}
              onChange={(e) => onCommodityChange(e.target.value)}
            >
              {Object.keys(supplyChainData).map(commodity => (
                <MenuItem key={commodity} value={commodity}>{commodity}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button 
            variant="contained"
            disabled={!isChainValid()}
            onClick={() => setShowVisualization(true)}
          >
            Visualize Chain
          </Button>
        </Box>

        {/* Chain Builder */}
        <Xwrapper>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
            {SUPPLY_CHAIN_STEPS.map((step) => (
              <Paper 
                key={step}
                sx={{ 
                  minWidth: 300,
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <Typography variant="h6" align="center">
                  {step}
                </Typography>

                {/* Available Companies */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Available Companies
                  </Typography>
                  <Box sx={{
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    minHeight: 100
                  }}>
                    {getAvailableCompanies(step).map((location, index) => (
                      <Box
                        key={`available-${step}-${index}`}
                        onClick={() => handleCompanyClick(location, step)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <LocationNode 
                          location={location} 
                          stage={step}
                          clickable
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Chain Building Area */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Your Chain
                  </Typography>
                  <Box
                    sx={{
                      minHeight: 150,
                      border: '2px dashed',
                      borderColor: startConnection?.step === step ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      p: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1
                    }}
                  >
                    {customChain[step].map((location, index) => {
                      const nodeId = `${step}-${index}`;
                      return (
                        <Box
                          key={nodeId}
                          id={nodeId}
                          sx={{ 
                            position: 'relative',
                            cursor: startConnection ? 'pointer' : 'default'
                          }}
                        >
                          <Box
                            onClick={() => handleChainNodeClick(nodeId, step)}
                            sx={{ 
                              border: startConnection?.id === nodeId ? '2px solid' : 'none',
                              borderColor: 'primary.main',
                              borderRadius: 1
                            }}
                          >
                            <LocationNode 
                              location={location} 
                              stage={step}
                              isSelected={startConnection?.id === nodeId}
                            />
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveCompany(step, index)}
                            sx={{ 
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              bgcolor: 'background.paper',
                              boxShadow: 1,
                              '&:hover': { bgcolor: 'error.light', color: 'white' }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>

          {/* Draw connections */}
          {connections.map((connection, index) => (
            <Box key={`${connection.start}-${connection.end}`}>
              <Xarrow
                start={connection.start}
                end={connection.end}
                color="#666"
                strokeWidth={2}
                path="straight"
                curveness={0.2}
                onClick={() => handleRemoveConnection(index)}
                headSize={6}
                labels={{
                  middle: <Box 
                    onClick={() => handleRemoveConnection(index)}
                    sx={{ 
                      cursor: 'pointer',
                      bgcolor: 'background.paper',
                      p: 0.5,
                      borderRadius: 1,
                      boxShadow: 1,
                      '&:hover': { bgcolor: 'error.light', color: 'white' }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </Box>
                }}
              />
            </Box>
          ))}
        </Xwrapper>
      </Box>

      {/* Visualization Section */}
      {showVisualization && (
        <Box sx={{ mt: 4, border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Custom Supply Chain
          </Typography>
          <Box sx={{ height: '500px' }}>
            <WorldMap
              commodity={selectedCommodity}
              locations={getCustomMapData().locations}
              links={getCustomMapData().links}
              isCustomView={true}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DragDropBuilder;