// src/App.jsx
import React, { useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline, IconButton } from '@mui/material';
import { Tabs, Tab, Box, Container } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Dashboard from './components/Dashboard/Dashboard';
import DragDropBuilder from './components/DragDrop/DragDropBuilder';
import { createTheme } from '@mui/material/styles';
import './styles/index.css';

const App = () => {
  // Theme state with localStorage persistence
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('theme-mode');
    return savedMode || 'light';
  });

  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCommodity, setSelectedCommodity] = useState('Lithium');
  
  const [customChain, setCustomChain] = useState({
    Mining: [],
    Processing: [],
    Manufacturing: [],
    Distribution: []
  });
  const [connections, setConnections] = useState([]);

  // Theme configuration
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      ...(mode === 'light' 
        ? {
            primary: {
              main: '#007AFF',
            },
            background: {
              default: '#F5F5F7',
              paper: '#FFFFFF',
            }
          }
        : {
            primary: {
              main: '#0A84FF',
            },
            background: {
              default: '#1C1C1E',
              paper: '#2C2C2E',
            },
            text: {
              primary: '#FFFFFF',
              secondary: 'rgba(255, 255, 255, 0.7)',
            }
          })
    },
    typography: {
      fontFamily: 'SF Mono, Menlo, monospace',
      
    },
  }), [mode]);

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        width: '100%', 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <Container maxWidth="xl" sx={{ flex: 1, py: 3 }}>
          <Box sx={{ 
            bgcolor: 'background.paper', 
            borderRadius: 3,
            p: 2,
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <IconButton 
              onClick={toggleMode}
              color="inherit"
              sx={{ mr: 2 }}
            >
              {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
            
            <Tabs 
              value={selectedTab} 
              onChange={(e, newValue) => setSelectedTab(newValue)} 
              centered
            >
              <Tab label="Supply Chain Dashboard" />
              <Tab label="Supply Chain Builder" />
            </Tabs>
            
            <Box sx={{ width: 48 }} /> {/* Spacer for symmetry */}
          </Box>

          <Box sx={{ flex: 1 }}>
            {selectedTab === 0 ? (
              <Dashboard 
                selectedCommodity={selectedCommodity}
                onCommodityChange={setSelectedCommodity}
              />
            ) : (
              <DragDropBuilder 
                selectedCommodity={selectedCommodity}
                onCommodityChange={setSelectedCommodity}
                customChain={customChain}
                setCustomChain={setCustomChain}
                connections={connections}
                setConnections={setConnections}
              />
            )}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;