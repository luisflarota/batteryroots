import React, { useState } from 'react';
import { Box, Paper, Typography, FormControl, Select, MenuItem, Button, IconButton, InputLabel, TextField, Drawer, List, ListItem, ListItemIcon, ListItemButton, Tooltip, Chip, Stack, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Xarrow, { Xwrapper } from 'react-xarrows';
import LocationNode from './LocationNode';
import WorldMap from '../Dashboard/WorldMap';
import { supplyChainData } from '../../data/dummy-data';
import Autocomplete from '@mui/material/Autocomplete';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import HelpIcon from '@mui/icons-material/Help';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const SUPPLY_CHAIN_STEPS = ['Mining', 'Processing', 'Cathode', 'EV'];

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 56;

const BuilderSidebar = ({ 
  open, 
  onToggle,
  selectedCommodity,
  onCommodityChange,
  highlightedYear,
  onHighlightYear,
  showYearHighlight
}) => {
  // Get years from dummy data for the selected commodity
  const years = selectedCommodity ? 
    supplyChainData[selectedCommodity].years : 
    [];

  const handleYearClick = (year) => {
    onHighlightYear(highlightedYear === year ? null : year);
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={open}
      sx={{
        width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
          boxSizing: 'border-box',
          border: 'none',
          bgcolor: 'background.paper',
          boxShadow: 3,
          height: '100%',
          overflowX: 'hidden',
          transition: theme => theme.transitions.create(['width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      {open ? (
        <>
          <Box sx={{ 
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography variant="h6">Builder Settings</Typography>
            <IconButton onClick={onToggle}>
              <ChevronLeftIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Commodity</InputLabel>
              <Select
                value={selectedCommodity}
                onChange={(e) => onCommodityChange(e.target.value)}
                label="Commodity"
              >
                {Object.keys(supplyChainData).map((commodity) => (
                  <MenuItem key={commodity} value={commodity}>
                    {commodity}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2,
                  bgcolor: showYearHighlight ? 'primary.light' : 'transparent',
                  transition: 'background-color 0.3s'
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  gutterBottom 
                  color="text.secondary"
                  sx={{ fontSize: '1.1rem', fontWeight: 500, mb: 2 }}
                >
                  Available Years
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {years.map(year => (
                    <Chip
                      key={year}
                      label={year}
                      onClick={() => handleYearClick(year)}
                      color={highlightedYear === year ? "primary" : "default"}
                      variant="outlined"
                      sx={{ 
                        mb: 1,
                        fontSize: '1rem',
                        height: 36,
                        fontWeight: highlightedYear === year ? 'bold' : 'normal'
                      }}
                    />
                  ))}
                </Stack>
              </Paper>
            </Box>
          </Box>
        </>
      ) : (
        <List sx={{ p: 0 }}>
          <ListItem disablePadding>
            <Tooltip title="Settings" placement="right">
              <ListItemButton onClick={onToggle}>
                <ListItemIcon>
                  <MenuIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <ListItem disablePadding>
            <Tooltip title="Save Chain" placement="right">
              <ListItemButton>
                <ListItemIcon>
                  <SaveIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <ListItem disablePadding>
            <Tooltip title="Load Chain" placement="right">
              <ListItemButton>
                <ListItemIcon>
                  <RestoreIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <ListItem disablePadding>
            <Tooltip title="Help" placement="right">
              <ListItemButton>
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
      )}
    </Drawer>
  );
};

const DragDropBuilder = ({ selectedCommodity, onCommodityChange, mode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [highlightedYear, setHighlightedYear] = useState(null);
  const [showYearAlert, setShowYearAlert] = useState(false);
  const [inputYear, setInputYear] = useState(2024);
  const [selectedYears, setSelectedYears] = useState(new Set());
  const [editingYears, setEditingYears] = useState(new Set());
  const [customChains, setCustomChains] = useState({});
  const [connectionsMap, setConnectionsMap] = useState({});
  const [usedCompaniesMap, setUsedCompaniesMap] = useState({});
  const [showVisualization, setShowVisualization] = useState(false);
  const [searchInputs, setSearchInputs] = useState({});
  const [autocompleteValue, setAutocompleteValue] = useState({});
  const [selectedForConnection, setSelectedForConnection] = useState(null);
  const [showYearHighlight, setShowYearHighlight] = useState(false);
  const theme = useTheme();

  // Get current commodity's data
  const customChain = customChains[selectedCommodity] || {
    Mining: [],
    Processing: [],
    Cathode: [],
    EV: []
  };
  const connections = connectionsMap[selectedCommodity] || [];
  const usedCompanies = usedCompaniesMap[selectedCommodity] || new Set();

  // Update initial selected year when commodity changes
  React.useEffect(() => {
    if (selectedCommodity && supplyChainData[selectedCommodity]) {
      const commodityYears = supplyChainData[selectedCommodity].years;
      setSelectedYear(commodityYears[commodityYears.length - 1]); // Set to most recent year
    }
  }, [selectedCommodity]);

  const handleCompanyClick = (location, step) => {
    if (!highlightedYear) {
      setShowYearAlert(true);
      setShowYearHighlight(true);
      if (!sidebarOpen) {
        setSidebarOpen(true);
      }
      // Auto-hide the highlight after 4 seconds
      setTimeout(() => {
        setShowYearHighlight(false);
      }, 2000);
      return;
    }

    if (!usedCompanies.has(`${location.company}-${location.site}`)) {
      // Update chain
      setCustomChains(prev => {
        const currentChain = prev[selectedCommodity] || {
          Mining: [],
          Processing: [],
          Cathode: [],
          EV: []
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
    
    // First remove all connections involving this company
    setConnectionsMap(prev => {
      const currentConnections = prev[selectedCommodity] || [];
      const nodeId = `${step}-${index}`;
      
      // Filter out connections involving the removed node
      const filteredConnections = currentConnections.filter(conn => 
        !conn.start.startsWith(`${step}-`) && !conn.end.startsWith(`${step}-`)
      );
      
      // Update indices for remaining connections
      const updatedConnections = filteredConnections.map(conn => {
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
    
    // Then remove the company
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

    // Update used companies
    setUsedCompaniesMap(prev => {
      const currentUsed = new Set(prev[selectedCommodity]);
      currentUsed.delete(`${removedCompany.company}-${removedCompany.site}`);
      return {
        ...prev,
        [selectedCommodity]: currentUsed
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

  const getCustomMapData = (year) => {
    // Get the base data structure from dummy data
    const dummyData = supplyChainData[selectedCommodity];
    
    // Get the flow values for the selected year
    const yearData = dummyData.dataByYear[year];
    
    // Create a map of company+site to help identify our chain companies
    const chainCompanies = {};
    SUPPLY_CHAIN_STEPS.forEach(step => {
      customChain[step].forEach(loc => {
        chainCompanies[`${loc.company}-${loc.site}`] = {
          step,
          country: loc.country,
          coordinates: loc.coordinates
        };
      });
    });

    // Filter locations to only include companies in our chain
    const filteredLocations = {};
    SUPPLY_CHAIN_STEPS.forEach(step => {
      filteredLocations[step] = dummyData.locations[step].filter(loc => 
        chainCompanies[`${loc.company}-${loc.site}`]
      );
    });

    // Filter and map links to only include connections between our chain companies
    const filteredLinks = yearData.links.filter(link => {
      // Find the actual companies at source and target
      const sourceCompany = customChain[link.source].find(loc => loc.country === link.sourceCountry);
      const targetCompany = customChain[link.target].find(loc => loc.country === link.targetCountry);
      
      return sourceCompany && targetCompany;
    });

    return {
      nodes: dummyData.nodes,
      locations: filteredLocations,
      years: [year],
      dataByYear: {
        [year]: {
          links: filteredLinks
        }
      }
    };
  };

  const handleInputYearChange = (e) => {
    const year = parseInt(e.target.value);
    if (!isNaN(year) && year >= 1900 && year <= 2100) {
      setInputYear(year);
    }
  };

  const yearOptions = Array.from({ length: 7 }, (_, i) => inputYear - 3 + i);

  const handleYearClick = (year) => {
    const newSelectedYears = new Set(selectedYears);
    const newEditingYears = new Set(editingYears);

    if (newEditingYears.has(year)) {
      newEditingYears.delete(year);
    } else if (newSelectedYears.has(year)) {
      newEditingYears.add(year);
    } else {
      newSelectedYears.add(year);
    }

    if (!newEditingYears.has(year) && !newSelectedYears.has(year)) {
      newSelectedYears.delete(year);
    }

    if (newSelectedYears.has(year) && !newEditingYears.has(year)) {
      newSelectedYears.delete(year);
    }

    setSelectedYears(newSelectedYears);
    setEditingYears(newEditingYears);
    setHighlightedYear(year);
  };

  return (
    <Box sx={{ 
      display: 'flex',
      height: '100%',
      width: '100%',
      overflow: 'hidden'
    }}>
      <BuilderSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        selectedCommodity={selectedCommodity}
        onCommodityChange={onCommodityChange}
        highlightedYear={highlightedYear}
        onHighlightYear={setHighlightedYear}
        showYearHighlight={showYearHighlight}
      />
      
      <Box sx={{ 
        flexGrow: 1,
        height: '100%',
        transition: theme => theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        p: 2
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          alignItems: 'center',
          mb: 3,
          gap: 2
        }}>
          <Button 
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={() => {/* TODO: Implement save functionality */}}
          >
            Save
          </Button>

          <Button 
            variant="contained"
            disabled={!isChainValid()}
            onClick={() => setShowVisualization(true)}
            startIcon={<VisibilityIcon />}
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

        {showVisualization && (
          <Box sx={{ 
            position: 'absolute',
            top: '64px',
            left: sidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH,
            right: 0,
            bottom: 0,
            bgcolor: 'background.paper',
            zIndex: 1200,
            p: 2,
            overflow: 'auto',
            transition: theme => theme.transitions.create(['left'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            })
          }}>
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              mb: 2
            }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => setShowVisualization(false)}
                sx={{ color: 'text.primary' }}
              >
                Go Back
              </Button>
            </Box>
            
            <Box sx={{ height: 'calc(100% - 48px)' }}>
              <WorldMap
                commodity={selectedCommodity}
                data={getCustomMapData(highlightedYear)}
                selectedYear={highlightedYear}
                showLegend={true}
                isCustomView={true}
              />
            </Box>
          </Box>
        )}
      </Box>

      <Snackbar 
        open={showYearAlert} 
        autoHideDuration={2000} 
        onClose={() => setShowYearAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowYearAlert(false)} 
          severity="info" 
          variant="filled"
          sx={{ 
            width: '100%',
            '& .MuiAlert-message': {
              fontSize: '1rem'
            }
          }}
        >
          Please select a year in the builder settings panel {!sidebarOpen && '(click the menu icon on the left)'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DragDropBuilder;