import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { Box, Paper, Typography, Chip, Slider } from '@mui/material';
import L from 'leaflet';
import { supplyChainData } from '../../data/dummy-data';
import 'leaflet/dist/leaflet.css';

const STAGE_COLORS = {
  'Mining': '#0A84FF',
  'Processing': '#30B82C',
  'Manufacturing': '#FF9F0A',
  'Distribution': '#FF375F'
};

const findConnectedStages = (data, startStage, visited = new Set()) => {
  visited.add(startStage);
  
  // Find direct outgoing connections
  data.links
    .filter(link => link.source === startStage)
    .forEach(link => visited.add(link.target));
  
  // Find direct incoming connections
  data.links
    .filter(link => link.target === startStage)
    .forEach(link => visited.add(link.source));
  
  return visited;
};

const Legend = ({ onStageSelect, selectedStage, data }) => (
  <Paper 
    sx={{ 
      p: 2, 
      mb: 2, 
      display: 'flex', 
      gap: 3,
      alignItems: 'center',
      bgcolor: 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'space-between'
    }}
  >
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      <Typography variant="subtitle2" color="text.secondary">
        Supply Chain Stages:
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {Object.entries(STAGE_COLORS).map(([stage, color]) => (
          <Box 
            key={stage}
            onClick={() => onStageSelect(stage)}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              cursor: 'pointer',
              opacity: selectedStage ? (selectedStage === stage ? 1 : 0.5) : 1,
              transition: 'opacity 0.2s ease'
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                bgcolor: color,
                borderRadius: 1
              }}
            />
            <Typography variant="body2">
              {stage}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
    {selectedStage && (
      <Chip
        label="Clear Selection"
        onClick={() => onStageSelect(null)}
        sx={{
          bgcolor: 'grey.200',
          '&:hover': {
            bgcolor: 'grey.300',
          },
          fontWeight: 'medium',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          border: '1px solid',
          borderColor: 'grey.400',
          boxShadow: 1
        }}
      />
    )}
  </Paper>
);

const FlowLines = ({ data, selectedStage, selectedYear }) => {
  const map = useMap();

  React.useEffect(() => {
    const flowGroup = L.layerGroup().addTo(map);

    // Helper function to create arrow marker - now with fixed size
    const createArrowMarker = (color) => {
      return L.divIcon({
        html: `
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M2 7 L12 7 M8 3 L12 7 L8 11" 
                  stroke="${color}" 
                  stroke-width="2" 
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"/>
          </svg>
        `,
        className: 'flow-arrow',
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });
    };

    const yearData = data.dataByYear[selectedYear];
    yearData.links.forEach(link => {
      const fromLocations = data.locations[link.source];
      const toLocations = data.locations[link.target];

      fromLocations.forEach(from => {
        toLocations.forEach(to => {
          const fromPoint = [from.coordinates[1], from.coordinates[0]];
          const toPoint = [to.coordinates[1], to.coordinates[0]];

          // Calculate line width based on the value of the link
          const lineWidth = Math.sqrt(link.value) / 2;
          const opacity = selectedStage ? 
            (selectedStage === link.source || selectedStage === link.target ? 0.7 : 0.1) 
            : 0.5;

          // Calculate the midpoint
          const midPoint = [
            (fromPoint[0] + toPoint[0]) / 2,
            (fromPoint[1] + toPoint[1]) / 2
          ];

          // Calculate the control point for the curve
          // Offset the control point perpendicular to the line
          const dx = toPoint[0] - fromPoint[0];
          const dy = toPoint[1] - fromPoint[1];
          const offset = 0.2; // Adjust this value to control curve intensity

          const controlPoint = [
            midPoint[0] - dy * offset,
            midPoint[1] + dx * offset
          ];

          // Generate points for the curved line
          const curvePoints = [];
          const steps = 30;
          
          for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const point = [
              Math.pow(1 - t, 2) * fromPoint[0] + 
              2 * (1 - t) * t * controlPoint[0] + 
              Math.pow(t, 2) * toPoint[0],
              Math.pow(1 - t, 2) * fromPoint[1] + 
              2 * (1 - t) * t * controlPoint[1] + 
              Math.pow(t, 2) * toPoint[1]
            ];
            curvePoints.push(point);
          }

          // Draw the curved line with new lineWidth calculation
          L.polyline(curvePoints, {
            color: STAGE_COLORS[link.source],
            weight: lineWidth,
            opacity: opacity,
            smoothFactor: 1
          }).addTo(flowGroup);

          // Add arrow at the midpoint of the curve
          const midIndex = Math.floor(curvePoints.length / 2);
          const arrowPoint = curvePoints[midIndex];
          const prevPoint = curvePoints[midIndex - 1];
          const nextPoint = curvePoints[midIndex + 1];

          // Calculate angle for arrow rotation
          const angle = Math.atan2(
            nextPoint[0] - prevPoint[0],
            nextPoint[1] - prevPoint[1]
          ) * 180 / Math.PI;

          // Add arrow with fixed size
          L.marker(arrowPoint, {
            icon: createArrowMarker(STAGE_COLORS[link.source]),
            rotationAngle: angle,
            rotationOrigin: 'center',
            opacity: opacity
          }).addTo(flowGroup);
        });
      });
    });

    return () => {
      map.removeLayer(flowGroup);
    };
  }, [map, data, selectedStage, selectedYear]);

  return null;
};

const ZoomAwareTitle = ({ selectedStage, getSelectedLocationInfo }) => {
  const map = useMap();
  const [zoomLevel, setZoomLevel] = React.useState(map.getZoom());

  React.useEffect(() => {
    const handleZoom = () => {
      setZoomLevel(map.getZoom());
    };

    map.on('zoom', handleZoom);
    return () => {
      map.off('zoom', handleZoom);
    };
  }, [map]);

  // Refined zoom adjustments with limits
  const getZoomAdjustedStyles = () => {
    // Limit the maximum zoom effect
    const normalizedZoom = Math.min(zoomLevel, 5);
    
    // More subtle scaling
    const scaleFactor = 1 + (Math.max(0, normalizedZoom - 2) * 0.02);
    
    // Adjust top position more gradually
    const baseTop = 20;
    const topAdjustment = Math.max(0, normalizedZoom - 2) * 3;
    
    return {
      top: `${baseTop + topAdjustment}px`,
      transform: `translateX(-50%) scale(${scaleFactor})`,
      opacity: zoomLevel > 8 ? 0.8 : 1, // Slightly fade out at very high zoom levels
    };
  };

  if (!selectedStage) return null;

  return (
    <Typography 
      variant="h6" 
      sx={{ 
        position: 'absolute',
        left: '50%',
        zIndex: 1000,
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        px: 4,
        py: 1.5,
        borderRadius: '12px',
        color: 'text.primary',
        fontSize: '1.1rem',
        letterSpacing: '0.3px',
        fontWeight: 500,
        textAlign: 'center',
        maxWidth: '80%',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        backdropFilter: 'blur(8px)',
        border: '1px solid',
        borderColor: 'grey.100',
        transition: 'all 0.3s ease',
        transformOrigin: 'top center',
        ...getZoomAdjustedStyles(),
        '& span': {
          display: 'block',
          color: 'text.secondary',
          fontSize: '0.85rem',
          fontWeight: 400,
          marginTop: '2px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }
      }}
    >
      <span>{selectedStage}</span>
      {getSelectedLocationInfo()}
    </Typography>
  );
};

const WorldMap = ({ commodity, selectedStage, onStageSelect }) => {
  const data = supplyChainData[commodity];
  if (!data) {
    console.error(`No data found for commodity: ${commodity}`);
    return <Typography variant="body1">No data available for this commodity.</Typography>;
  }

  const connectedStages = selectedStage ? findConnectedStages(data, selectedStage) : new Set();
  
  // New state for slider value and years
  const years = data.years; // Extract years from the data
  const [sliderValue, setSliderValue] = React.useState(years[0]); // Set initial value to the first year

  // Function to handle slider change
  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  // Updated to return company and site info
  const getSelectedLocationInfo = () => {
    if (!selectedStage || !data.locations[selectedStage]) return null;
    const location = data.locations[selectedStage][0];
    return `${location.company} - ${location.site}`;
  };

  const getMarkerOpacity = (stage) => {
    if (!selectedStage) return 0.8;
    return connectedStages.has(stage) ? 0.8 : 0.3;
  };

  const getMarkerSize = (stage, year) => {
    const yearData = data.dataByYear[year];
    const stageData = yearData.locations[stage][0];
    return Math.sqrt(stageData.value) / 2;
  };

  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Legend 
        onStageSelect={onStageSelect} 
        selectedStage={selectedStage}
        data={data}
      />
      
      {/* Slider populated with years */}
      <Box sx={{ padding: 2 }}>
        <Typography gutterBottom>Select Year</Typography>
        <Slider
          value={sliderValue}
          onChange={handleSliderChange}
          aria-labelledby="year-slider"
          min={years[0]} // Set minimum year
          max={years[years.length - 1]} // Set maximum year
          step={1} // Step by 1 year
          marks={years.map(year => ({ value: year, label: year }))} // Create marks for each year
        />
      </Box>

      <Box sx={{ flex: 1, position: 'relative' }}>
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          <FlowLines 
            data={data} 
            selectedStage={selectedStage}
            selectedYear={sliderValue}
          />
          
          {selectedStage && (
            <ZoomAwareTitle 
              selectedStage={selectedStage}
              getSelectedLocationInfo={getSelectedLocationInfo}
            />
          )}
          
          {Object.entries(data.locations).map(([stage, locations]) =>
            locations.map((location, i) => (
              <CircleMarker
                key={`${stage}-${i}`}
                center={[location.coordinates[1], location.coordinates[0]]}
                radius={getMarkerSize(stage, sliderValue)}
                fillColor={STAGE_COLORS[stage]}
                color="#FFFFFF"
                weight={2}
                opacity={1}
                fillOpacity={getMarkerOpacity(stage)}
                eventHandlers={{
                  click: () => onStageSelect(stage)
                }}
                className="map-marker"
              >
                <Tooltip className="custom-tooltip">
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle2">
                      {stage}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                      {location.company}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      {location.site}
                    </Typography>
                    <Typography variant="body2">
                      {location.country}
                    </Typography>
                    <Typography variant="body2">
                      Volume: {location.value}
                    </Typography>
                  </Box>
                </Tooltip>
              </CircleMarker>
            ))
          )}
        </MapContainer>
      </Box>
    </Box>
  );
};

export default WorldMap;