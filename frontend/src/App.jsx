// src/App.jsx
import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Tabs, Tab, Box, Container } from '@mui/material';
import Dashboard from './components/Dashboard/Dashboard';
import DragDropBuilder from './components/DragDrop/DragDropBuilder';
import { createTheme } from '@mui/material/styles';
import './styles/index.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#007AFF', // Apple-style blue
    },
    background: {
      default: '#F5F5F7', // Apple-style light gray
      paper: '#FFFFFF',
    }
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
});

const App = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCommodity, setSelectedCommodity] = useState('Lithium');
  
  // Keep the state here instead of in individual components
  const [customChain, setCustomChain] = useState({
    Mining: [],
    Processing: [],
    Manufacturing: [],
    Distribution: []
  });
  const [connections, setConnections] = useState([]);

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
            mb: 3
          }}>
            <Tabs 
              value={selectedTab} 
              onChange={(e, newValue) => setSelectedTab(newValue)} 
              centered
            >
              <Tab label="Supply Chain Dashboard" />
              <Tab label="Supply Chain Builder" />
            </Tabs>
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