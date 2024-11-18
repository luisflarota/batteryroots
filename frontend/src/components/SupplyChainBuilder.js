import React, { useState, useEffect } from 'react';
import { Factory } from 'lucide-react';

const SupplyChainBuilder = () => {
  const [facilitiesData, setFacilitiesData] = useState({});
  const [selectedStage, setSelectedStage] = useState('mining');

  useEffect(() => {
    fetch('/api/facilities')
      .then(response => response.json())
      .then(data => setFacilitiesData(data));
  }, []);

  const FacilitySelector = ({ stage, facilities }) => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{stage.charAt(0).toUpperCase() + stage.slice(1)}</h3>
      </div>
      <select 
        onChange={(e) => console.log(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">Select facility</option>
        {facilities.map((facility) => (
          <option key={facility.id} value={facility.id}>
            {facility.name} - {facility.company}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="p-4">
      {Object.entries(facilitiesData).map(([stage, facilities]) => (
        <FacilitySelector key={stage} stage={stage} facilities={facilities} />
      ))}
    </div>
  );
};

export default SupplyChainBuilder;