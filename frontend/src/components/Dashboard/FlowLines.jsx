// src/components/Dashboard/FlowLines.jsx
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-curve';
import { getStageColor } from '../../utils/supplyChainUtils';

const FlowLines = ({ data, selectedNode }) => {
  const map = useMap();

  useEffect(() => {
    const flowGroup = L.layerGroup().addTo(map);

    // Create flow lines between connected locations
    
    data.links.forEach(link => {
      const fromLocations = data.locations[link.source];
      const toLocations = data.locations[link.target];

      fromLocations.forEach(from => {
        toLocations.forEach(to => {
          // Create coordinates
          const fromLatLng = L.latLng(from.coordinates[1], from.coordinates[0]);
          const toLatLng = L.latLng(to.coordinates[1], to.coordinates[0]);

          // Calculate midpoint with offset for curve
          const midLat = (fromLatLng.lat + toLatLng.lat) / 2;
          const midLng = (fromLatLng.lng + toLatLng.lng) / 2;
          const offset = 20; // Curve height

          // Create curved line
          const curvedPath = L.curve(
            [
              'M', [fromLatLng.lat, fromLatLng.lng],
              'Q',
              [midLat + offset, midLng],
              [toLatLng.lat, toLatLng.lng]
            ],
            {
              color: getStageColor(link.source),
              weight: Math.max(2, link.value / 20),
              opacity: selectedNode ? (
                selectedNode === link.source || selectedNode === link.target ? 0.8 : 0.2
              ) : 0.6,
              fill: false,
              className: 'flow-line'
            }
          ).addTo(flowGroup);

          // Add arrow marker
          const arrowSize = Math.max(4, link.value / 30);
          const arrowHead = L.polyline(
            [
              toLatLng,
              L.latLng(toLatLng.lat - arrowSize/2, toLatLng.lng - arrowSize/2),
              L.latLng(toLatLng.lat - arrowSize/2, toLatLng.lng + arrowSize/2)
            ],
            {
              color: getStageColor(link.source),
              weight: 2,
              opacity: selectedNode ? (
                selectedNode === link.source || selectedNode === link.target ? 0.8 : 0.2
              ) : 0.6
            }
          ).addTo(flowGroup);

          // Add click handlers
          curvedPath.on('click', () => {
            map.fireEvent('flowlineclick', { source: link.source, target: link.target });
          });
        });
      });
    });

    return () => {
      map.removeLayer(flowGroup);
    };
  }, [map, data, selectedNode]);

  return null;
};

export default FlowLines;