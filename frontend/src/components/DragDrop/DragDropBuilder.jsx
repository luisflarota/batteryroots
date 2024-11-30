import React, { useState } from 'react';
import { Box, Paper, Typography, FormControl, Select, MenuItem, Button, IconButton, InputLabel, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Xarrow, { Xwrapper } from 'react-xarrows';
import LocationNode from './LocationNode';
import WorldMap from '../Dashboard/WorldMap';
import { supplyChainData } from '../../data/dummy-data';
import Autocomplete from '@mui/material/Autocomplete';
import { useTheme } from '@mui/material/styles';

const SUPPLY_CHAIN_STEPS = ['Mining', 'Processing', 'Manufacturing', 'Distribution'];

const DragDropBuilder = ({ selectedCommodity, onCommodityChange }) => {
  const [customChains, setCustomChains] = useState({});
  const [connectionsMap, setConnectionsMap] = useState({});
  const [usedCompaniesMap, setUsedCompaniesMap] = useState({});
  const [showVisualization, setShowVisualization] = useState(false);
  const [searchInputs, setSearchInputs] = useState({});
  const [autocompleteValue, setAutocompleteValue] = useState({});
  const [selectedForConnection, setSelectedForConnection] = useState(null);
  const theme = useTheme();

  // Get current commodity's data
  const customChain = customChains[selectedCommodity] || {
    Mining: [],
    Processing: [],
    Manufacturing: [],
    Distribution: []
  };
  const connections = connectionsMap[selectedCommodity] || [];
  const usedCompanies = usedCompaniesMap[selectedCommodity] || new Set();

  const handleCompanyClick = (location, step) => {
    if (!usedCompanies.has(`${location.company}-${location.site}`)) {
      // Update chain
      setCustomChains(prev => {
        const currentChain = prev[selectedCommodity] || {
          Mining: [],
          Processing: [],
          Manufacturing: [],
          Distribution: []
        };
        
        const updatedChain = {
          ...currentChain,
          [step]: [...currentChain[step], location]
        };
  
        // Create new connections (automatic step-by-step connections)
        const newConnections = [];
        const currentStepIndex = SUPPLY_CHAIN_STEPS.indexOf(step);
        
        if (currentStepIndex > 0) {
          const previousStep = SUPPLY_CHAIN_STEPS[currentStepIndex - 1];
          const previousCompanies = currentChain[previousStep];
          const currentCompanyIndex = updatedChain[step].length - 1;
          
          previousCompanies.forEach((_, prevIndex) => {
            newConnections.push({
              start: `${previousStep}-${prevIndex}`,
              end: `${step}-${currentCompanyIndex}`
            });
          });
        }
  
        if (currentStepIndex < SUPPLY_CHAIN_STEPS.length - 1) {
          const nextStep = SUPPLY_CHAIN_STEPS[currentStepIndex + 1];
          const nextCompanies = currentChain[nextStep];
          const currentCompanyIndex = updatedChain[step].length - 1;
  
          nextCompanies.forEach((_, nextIndex) => {
            newConnections.push({
              start: `${step}-${currentCompanyIndex}`,
              end: `${nextStep}-${nextIndex}`
            });
          });
        }
  
        // Update connections
        setConnectionsMap(prev => ({
          ...prev,
          [selectedCommodity]: [...(prev[selectedCommodity] || []), ...newConnections]
        }));
  
        return {
          ...prev,
          [selectedCommodity]: updatedChain
        };
      });
  
      // Update used companies
      setUsedCompaniesMap(prev => ({
        ...prev,
        [selectedCommodity]: new Set([...(prev[selectedCommodity] || []), `${location.company}-${location.site}`])
      }));
    }
  };

  const handleChainNodeClick = (nodeId, step) => {
    if (!selectedForConnection) {
      setSelectedForConnection({ id: nodeId, step });
    } else {
      const startStepIndex = SUPPLY_CHAIN_STEPS.indexOf(selectedForConnection.step);
      const endStepIndex = SUPPLY_CHAIN_STEPS.indexOf(step);
      
      // Only allow connections to next step or within same step
      if (endStepIndex >= startStepIndex) {
        setConnectionsMap(prev => ({
          ...prev,
          [selectedCommodity]: [...(prev[selectedCommodity] || []), {
            start: selectedForConnection.id,
            end: nodeId
          }]
        }));
      }
      
      setSelectedForConnection(null);
    }
  };

  const handleRemoveCompany = (step, index) => {
    const removedCompany = customChain[step][index];
    
    setCustomChains(prev => {
      const currentChain = prev[selectedCommodity];
      return {
        ...prev,
        [selectedCommodity]: {
          ...currentChain,
          [step]: currentChain[step].filter((_, i) => i !== index)
        }
      };
    });

    setUsedCompaniesMap(prev => {
      const currentUsed = new Set(prev[selectedCommodity]);
      currentUsed.delete(`${removedCompany.company}-${removedCompany.site}`);
      return {
        ...prev,
        [selectedCommodity]: currentUsed
      };
    });

    setConnectionsMap(prev => {
      const currentConnections = prev[selectedCommodity] || [];
      const updatedConnections = currentConnections
        .filter(conn => !conn.start.startsWith(`${step}-${index}`) && !conn.end.startsWith(`${step}-${index}`))
        .map(conn => {
          let { start, end } = conn;
          const [startStep, startIndex] = start.split('-');
          const [endStep, endIndex] = end.split('-');

          if (startStep === step && parseInt(startIndex) > index) {
            start = `${startStep}-${parseInt(startIndex) - 1}`;
          }
          if (endStep === step && parseInt(endIndex) > index) {
            end = `${endStep}-${parseInt(endIndex) - 1}`;
          }

          return { start, end };
        });

      return {
        ...prev,
        [selectedCommodity]: updatedConnections
      };
    });

    // Clear selection if removed company was selected for connection
    if (selectedForConnection?.id.startsWith(`${step}-${index}`)) {
      setSelectedForConnection(null);
    }
  };

  const handleRemoveConnection = (index) => {
    setConnectionsMap(prev => ({
      ...prev,
      [selectedCommodity]: prev[selectedCommodity].filter((_, i) => i !== index)
    }));
  };

  const isChainValid = () => {
    return customChain && SUPPLY_CHAIN_STEPS.every(step => customChain[step].length > 0);
  };

  const handleSearchInputChange = (step, value) => {
    setSearchInputs(prev => ({ ...prev, [step]: value }));
  };

  const getAvailableCompanies = (step) => {
    return supplyChainData[selectedCommodity].locations[step].filter(
      location => !usedCompanies.has(`${location.company}-${location.site}`) &&
                  location.company.toLowerCase().includes(searchInputs[step]?.toLowerCase() || '')
    );
  };

  const getCustomMapData = () => {
    return {
      nodes: SUPPLY_CHAIN_STEPS.map(id => ({ 
        id, 
        name: id, 
        type: id === 'Mining' ? 'source' : id === 'Distribution' ? 'target' : 'process' 
      })),
      locations: customChain,
      dataByYear: {
        2024: {
          links: connections.map(conn => {
            const [sourceStep, sourceIndex] = conn.start.split('-');
            const [targetStep, targetIndex] = conn.end.split('-');
            const sourceLocation = customChain[sourceStep][parseInt(sourceIndex)];
            const targetLocation = customChain[targetStep][parseInt(targetIndex)];
            
            return {
              source: sourceStep,
              sourceCountry: sourceLocation.country,
              target: targetStep,
              targetCountry: targetLocation.country,
              value: 100
            };
          })
        }
      },
      years: [2024]
    };
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'nowrap',
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
                setShowVisualization(false);
                setSelectedForConnection(null);
              }}
              sx={{
                fontFamily: 'SF Mono, Menlo, monospace',
                fontSize: '0.875rem',
                height: '48px'
              }}
            >
              {Object.keys(supplyChainData).map(commodity => (
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
          <Button 
            variant="contained"
            disabled={!isChainValid()}
            onClick={() => setShowVisualization(true)}
            sx={{ flexShrink: 0 }}
          >
            Visualize Chain
          </Button>
        </Box>

        <Xwrapper>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
            {SUPPLY_CHAIN_STEPS.map((step) => (
              <Paper 
                key={step}
                sx={{ 
                  width: '100%',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <Typography variant="h6" align="center">
                  {step}
                </Typography>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Available Companies
                  </Typography>
                  <Autocomplete
                    options={getAvailableCompanies(step)}
                    getOptionLabel={(option) => option.company}
                    value={autocompleteValue[step] || null}
                    onChange={(event, value) => {
                      if (value) {
                        handleCompanyClick(value, step);
                        setAutocompleteValue(prev => ({ ...prev, [step]: null }));
                        handleSearchInputChange(step, '');
                      }
                    }}
                    onInputChange={(event, value) => {
                      handleSearchInputChange(step, value);
                      setAutocompleteValue(prev => ({ ...prev, [step]: null }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Search companies..."
                        sx={{ mb: 2 }}
                      />
                    )}
                  />
                  <Box sx={{
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    minHeight: 150,
                    maxHeight: 300,
                    overflowY: 'auto',
                    height: 250
                  }}>
                    {getAvailableCompanies(step).map((location, index) => (
                      <Box
                        key={`available-${step}-${index}`}
                        onClick={() => {
                          handleCompanyClick(location, step);
                          setAutocompleteValue(prev => ({ ...prev, [step]: null }));
                          handleSearchInputChange(step, '');
                        }}
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

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Your Chain
                  </Typography>
                  <Box
                    sx={{
                      minHeight: 150,
                      border: '2px dashed',
                      borderColor: selectedForConnection?.step === step ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      p: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      bgcolor: theme.palette.background.paper
                    }}
                  >
                    {customChain[step].map((location, index) => {
                      const nodeId = `${step}-${index}`;
                      const isSelected = selectedForConnection?.id === nodeId;
                      
                      return (
                        <Box
                          key={nodeId}
                          id={nodeId}
                          onClick={() => handleChainNodeClick(nodeId, step)}
                          sx={{ 
                            position: 'relative',
                            bgcolor: theme.palette.background.default,
                            border: isSelected ? '2px solid' : 'none',
                            borderColor: 'primary.main',
                            borderRadius: 1,
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: isSelected ? undefined : 'action.hover'
                            }
                          }}
                        >
                          <LocationNode 
                            location={location} 
                            stage={step}
                          />
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveCompany(step, index);
                            }}
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

          {connections.map((connection, index) => (
            <Xarrow
              key={`${connection.start}-${connection.end}`}
              start={connection.start}
              end={connection.end}
              color="#666"
              strokeWidth={2}
              path="straight"
              curveness={0.2}
              headSize={6}
              labels={{
                middle: <Box 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveConnection(index);
                  }}
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
          ))}
        </Xwrapper>
      </Box>
      
      {showVisualization && (
        <Box sx={{ mt: 4, border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Custom Supply Chain
          </Typography>
          <Box sx={{ height: '80vh' }}>
            <WorldMap
              commodity={selectedCommodity}
              customData={getCustomMapData()}
              isCustomView={true}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DragDropBuilder;