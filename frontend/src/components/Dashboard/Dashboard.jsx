import React, { useState } from 'react';
import { Box } from '@mui/material';
import WorldMap from './WorldMap';
import DashboardSidebar from './DashboardSidebar';

const Dashboard = ({ selectedCommodity, onCommodityChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [flowMetric, setFlowMetric] = useState('production');
  const [inputYear, setInputYear] = useState(2024);

  const handleStageSelect = (stage) => {
    setSelectedStage(prev => prev === stage ? null : stage);
  };

  return (
    <Box sx={{ 
      display: 'flex',
      height: '100%',
      width: '100%',
      overflow: 'hidden'
    }}>
      <DashboardSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        selectedCommodity={selectedCommodity}
        onCommodityChange={onCommodityChange}
        flowMetric={flowMetric}
        onFlowMetricChange={setFlowMetric}
        inputYear={inputYear}
        onYearChange={setInputYear}
      />
      
      <Box sx={{ 
        flexGrow: 1,
        height: '100%',
        transition: theme => theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        })
      }}>
        <WorldMap
          commodity={selectedCommodity}
          selectedStage={selectedStage}
          onStageSelect={handleStageSelect}
          flowMetric={flowMetric}
          selectedYear={inputYear}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;

