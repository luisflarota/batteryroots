import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { Box, Paper, Typography, Chip, Slider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import L from 'leaflet';
import { supplyChainData } from '../../data/dummy-data';
import 'leaflet/dist/leaflet.css';

const STAGE_COLORS = {
  'Mining': '#0A84FF',
  'Processing': '#30B82C',
  'Manufacturing': '#FF9F0A',
  'Distribution': '#FF375F'
};

const MARKER_SIZE = 2;

const findConnectedStages = (data, startStage, year) => {
  const visited = new Set([startStage]);
  const yearData = data.dataByYear[year];

  const findDownstream = (stage) => {
    yearData.links
      .filter(link => link.source === stage)
      .forEach(link => {
        if (!visited.has(link.target)) {
          visited.add(link.target);
          findDownstream(link.target);
        }
      });
  };

  const findUpstream = (stage) => {
    yearData.links
      .filter(link => link.target === stage)
      .forEach(link => {
        if (!visited.has(link.source)) {
          visited.add(link.source);
          findUpstream(link.source);
        }
      });
  };

  findDownstream(startStage);
  findUpstream(startStage);
  return visited;
};

const Legend = ({ onStageSelect, selectedStage, data }) => {
  const theme = useTheme();
  
  return (
    <Paper 
      sx={{ 
        p: 2, 
        mb: 2, 
        display: 'flex', 
        gap: 3,
        alignItems: 'center',
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(44, 44, 46, 0.9)' : 'rgba(255, 255, 255, 0.9)',
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
              onClick={() => onStageSelect(stage, true)}
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
            bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' ? 'grey.700' : 'grey.300',
            },
            color: theme.palette.text.primary,
            fontWeight: 'medium',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: '1px solid',
            borderColor: theme.palette.mode === 'dark' ? 'grey.700' : 'grey.400',
            boxShadow: 1
          }}
        />
      )}
    </Paper>
  );
};

const FlowLines = ({ data, selectedStage, selectedYear, onStageSelect, isLegendSelection }) => {
  const map = useMap();
  const theme = useTheme();

  useEffect(() => {
    const flowGroup = L.layerGroup().addTo(map);

    const yearData = data.dataByYear[selectedYear];
    const values = yearData.links.map(link => link.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    const getLineWidth = (value) => {
      const minWidth = 2;
      const maxWidth = 12;
      return minWidth + ((value - minValue) / (maxValue - minValue)) * (maxWidth - minWidth);
    };

    const createArrowMarker = (sourceStage, value) => {
      const color = STAGE_COLORS[sourceStage];
      const arrowSize = getLineWidth(value) + 2;
      return L.divIcon({
        html: `
          <svg width="${arrowSize * 2}" height="${arrowSize * 2}" viewBox="0 0 14 14">
            <path d="M2 7 L12 7 M8 3 L12 7 L8 11" 
                  stroke="${color}" 
                  stroke-width="${arrowSize/2}"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"/>
          </svg>
        `,
        className: 'flow-arrow',
        iconSize: [arrowSize * 2, arrowSize * 2],
        iconAnchor: [arrowSize, arrowSize]
      });
    };

    const connectedStages = selectedStage && !isLegendSelection ? 
      findConnectedStages(data, selectedStage, selectedYear) : 
      new Set();

    yearData.links.forEach(link => {
      const fromLocation = data.locations[link.source].find(loc => 
        loc.country === link.sourceCountry
      );
      const toLocation = data.locations[link.target].find(loc => 
        loc.country === link.targetCountry
      );

      if (fromLocation && toLocation) {
        const fromPoint = [fromLocation.coordinates[1], fromLocation.coordinates[0]];
        const toPoint = [toLocation.coordinates[1], toLocation.coordinates[0]];

        const lineWidth = getLineWidth(link.value);
        
        let opacity = 0.5; // Default opacity
        if (selectedStage) {
          if (isLegendSelection) {
            // Legend selection: only show arrows from selected stage
            opacity = link.source === selectedStage ? 0.7 : 0.1;
          } else {
            // Arrow selection: show connected stages
            opacity = connectedStages.has(link.source) && connectedStages.has(link.target) ? 0.7 : 0.1;
          }
        }

        const midPoint = [
          (fromPoint[0] + toPoint[0]) / 2,
          (fromPoint[1] + toPoint[1]) / 2
        ];

        const dx = toPoint[0] - fromPoint[0];
        const dy = toPoint[1] - fromPoint[1];
        const offset = 0.2;

        const controlPoint = [
          midPoint[0] - dy * offset,
          midPoint[1] + dx * offset
        ];

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

        const polyline = L.polyline(curvePoints, {
          color: STAGE_COLORS[link.source],
          weight: lineWidth,
          opacity: opacity,
          smoothFactor: 1,
          className: theme.palette.mode === 'dark' ? 'flow-line-dark' : 'flow-line'
        }).addTo(flowGroup);

        polyline.on('click', () => {
          onStageSelect(link.source, false);
        });

        const midIndex = Math.floor(curvePoints.length / 2);
        const arrowPoint = curvePoints[midIndex];
        const prevPoint = curvePoints[midIndex - 1];
        const nextPoint = curvePoints[midIndex + 1];

        const angle = Math.atan2(
          nextPoint[0] - prevPoint[0],
          nextPoint[1] - prevPoint[1]
        ) * 180 / Math.PI;

        L.marker(arrowPoint, {
          icon: createArrowMarker(link.source, link.value),
          rotationAngle: angle,
          rotationOrigin: 'center',
          opacity: opacity
        }).addTo(flowGroup)
        .on('click', () => {
          onStageSelect(link.source, false);
        });
      }
    });

    return () => {
      map.removeLayer(flowGroup);
    };
  }, [map, data, selectedStage, selectedYear, theme.palette.mode, onStageSelect, isLegendSelection]);

  return null;
};

const WorldMap = ({ commodity, selectedStage, onStageSelect, customData }) => {
  const theme = useTheme();
  const data = customData || supplyChainData[commodity];
  const [isLegendSelection, setIsLegendSelection] = useState(false);
  const [sliderValue, setSliderValue] = useState(data?.years[0] || 2020);

  if (!data) {
    return <Typography variant="body1">No data available for this commodity.</Typography>;
  }

  const handleStageSelect = (stage, fromLegend) => {
    setIsLegendSelection(fromLegend);
    onStageSelect(stage);
  };

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  const getSelectedLocationInfo = () => {
    if (!selectedStage || !data.locations[selectedStage]) return null;
    const location = data.locations[selectedStage][0];
    return `${location.company} - ${location.site}`;
  };

  return (
    <Box sx={{ 
      height: '100%', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: theme.palette.background.paper,
      borderRadius: 1,
      p: 2
    }}>
      <Legend 
        onStageSelect={handleStageSelect}
        selectedStage={selectedStage}
        data={data}
      />
      
      <Box sx={{ padding: 2 }}>
        <Typography gutterBottom color="text.primary">Select Year</Typography>
        <Slider
          value={sliderValue}
          onChange={handleSliderChange}
          aria-labelledby="year-slider"
          min={data.years[0]}
          max={data.years[data.years.length - 1]}
          step={1}
          marks={data.years.map(year => ({ value: year, label: year }))}
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
            url={theme.palette.mode === 'dark' 
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
              : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
            }
            attribution='&copy; OpenStreetMap contributors'
          />

          <FlowLines 
            data={data} 
            selectedStage={selectedStage}
            selectedYear={sliderValue}
            onStageSelect={handleStageSelect}
            isLegendSelection={isLegendSelection}
          />

          {Object.entries(data.locations).map(([stage, locations]) =>
            locations.map((location, i) => (
              <CircleMarker
                key={`${stage}-${i}`}
                center={[location.coordinates[1], location.coordinates[0]]}
                radius={MARKER_SIZE}
                fillColor="#FFFFFF"
                color="#000000"
                weight={1}
                opacity={1}
                fillOpacity={0.8}
                className="map-marker"
              >
                <Tooltip className="custom-tooltip">
                  <Box sx={{ 
                    p: 1,
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary
                  }}>
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