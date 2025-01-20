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
    document.documentElement.setAttribute('data-theme', newMode);
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
        <Container 
          maxWidth={false} 
          disableGutters 
          sx={{ 
            flex: 1,
            height: '100vh',
            overflow: 'hidden',
            p: 0
          }}
        >
          <Box sx={{ 
            bgcolor: 'background.paper', 
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: 1,
            borderColor: 'divider',
            height: '64px'
          }}>
            <Box sx={{ width: 48 }} />
            
            <Tabs 
              value={selectedTab} 
              onChange={(e, newValue) => setSelectedTab(newValue)} 
              centered
            >
              <Tab label="Dashboard" />
              <Tab label="Builder" />
            </Tabs>
            
            <IconButton 
              onClick={toggleMode}
              color="inherit"
              sx={{ width: 48 }}
            >
              {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Box>

          <Box sx={{ 
            height: 'calc(100vh - 64px)',
            overflow: 'hidden'
          }}>
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
                mode={mode}
              />
            )}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;