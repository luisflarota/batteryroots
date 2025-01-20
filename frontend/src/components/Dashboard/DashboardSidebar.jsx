import React from 'react';
import { 
  Box, 
  Drawer, 
  IconButton, 
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
  ButtonGroup,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LanguageIcon from '@mui/icons-material/Language';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpIcon from '@mui/icons-material/Help';
import { supplyChainData } from '../../data/dummy-data';

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 56;

const DashboardSidebar = ({ 
  open, 
  onToggle, 
  selectedCommodity, 
  onCommodityChange,
  inputYear,
  onYearChange,
  flowMetric,
  onFlowMetricChange
}) => {
  const data = supplyChainData[selectedCommodity];
  const years = data?.years || [];

  const handleLanguageClick = () => {
    // TODO: Implement language selection
    console.log('Language selection clicked');
  };

  const handleNotificationsClick = () => {
    // TODO: Implement notifications panel
    console.log('Notifications clicked');
  };

  const handleHelpClick = () => {
    // TODO: Implement help/chat assistant
    console.log('Help clicked');
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
            <Typography variant="h6">Settings</Typography>
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
              <Typography variant="subtitle2" gutterBottom>
                Flow Metric
              </Typography>
              <ToggleButtonGroup
                value={flowMetric}
                exclusive
                onChange={(e, value) => value && onFlowMetricChange(value)}
                fullWidth
                size="small"
              >
                <ToggleButton value="production">Production</ToggleButton>
                <ToggleButton value="emissions">Emissions</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ mb: 2, fontSize: '1rem', fontWeight: 'medium' }}>
                Year
              </Typography>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 1.5
              }}>
                {years.map((year) => (
                  <Button
                    key={year}
                    onClick={() => onYearChange(year)}
                    variant={inputYear === year ? 'contained' : 'outlined'}
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 'medium',
                      borderRadius: 2,
                      '&.MuiButton-contained': {
                        boxShadow: 4,
                        '&:hover': {
                          boxShadow: 6
                        }
                      },
                      '&.MuiButton-outlined': {
                        borderWidth: 1.5,
                        '&:hover': {
                          borderWidth: 1.5,
                          bgcolor: 'action.hover'
                        }
                      }
                    }}
                  >
                    {year}
                  </Button>
                ))}
              </Box>
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
            <Tooltip title="Language" placement="right">
              <ListItemButton onClick={handleLanguageClick}>
                <ListItemIcon>
                  <LanguageIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <ListItem disablePadding>
            <Tooltip title="Notifications" placement="right">
              <ListItemButton onClick={handleNotificationsClick}>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </ListItem>
          <ListItem disablePadding>
            <Tooltip title="Help" placement="right">
              <ListItemButton onClick={handleHelpClick}>
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

export default DashboardSidebar; 