import os
import json
from typing import Dict, Any, List
import sys
sys.path.append('..')
from config import (
    READY_DATA_DIR,
    COMMODITIES,
    START_YEAR,
    CURRENT_YEAR,
    COUNTRY_CODES,
    SUPPLY_CHAIN_STEPS
)
from utils import save_to_json, log_debug

class DataConsolidator:
    def __init__(self):
        self.years = list(range(START_YEAR, CURRENT_YEAR + 1))

    def consolidate_commodity_data(self, commodity: str, model_name: str) -> Dict[str, Any]:
        """Consolidate processed data for a commodity into final format."""
        # Load processed data
        processed_file = os.path.join(
            READY_DATA_DIR,
            'processed',
            f'processed_{commodity.lower()}_{model_name}.json'
        )
        
        try:
            with open(processed_file, 'r') as f:
                processed_data = json.load(f)
        except Exception as e:
            log_debug(f"Error loading {processed_file}: {e}")
            return self._get_default_structure()

        # Initialize structure
        consolidated = {
            "nodes": [
                {"id": "Mining", "name": "Mining", "type": "source"},
                {"id": "Processing", "name": "Processing", "type": "process"},
                {"id": "Cathode", "name": "Cathode", "type": "process"},
                {"id": "EV", "name": "EV", "type": "target"}
            ],
            "locations": {stage: [] for stage in SUPPLY_CHAIN_STEPS},
            "years": self.years,
            "dataByYear": {}
        }

        # Merge locations from all processed results
        for item in processed_data:
            analysis = item['analysis']
            for stage in SUPPLY_CHAIN_STEPS:
                if stage in analysis['locations']:
                    # Add unique locations based on company and site
                    existing = {(loc['company'], loc['site']) 
                              for loc in consolidated['locations'][stage]}
                    
                    for location in analysis['locations'][stage]:
                        if (location['company'], location['site']) not in existing:
                            consolidated['locations'][stage].append(location)
                            existing.add((location['company'], location['site']))

        # Generate flow data for each year
        for year in self.years:
            consolidated["dataByYear"][str(year)] = {
                "links": self._generate_links(consolidated["locations"], year)
            }

        return consolidated

    def _generate_links(self, locations: Dict[str, List[Dict]], year: int) -> List[Dict]:
        """Generate links between locations for a given year."""
        links = []
        base_value = 1000  # Base value for flows
        year_factor = (year - START_YEAR + 1) * 100  # Increase value each year
        
        # Generate links between consecutive stages
        for i in range(len(SUPPLY_CHAIN_STEPS) - 1):
            current_stage = SUPPLY_CHAIN_STEPS[i]
            next_stage = SUPPLY_CHAIN_STEPS[i + 1]
            
            # Get locations for current and next stages
            current_locations = locations[current_stage]
            next_locations = locations[next_stage]
            
            # Create links between all locations in consecutive stages
            for source in current_locations:
                for target in next_locations:
                    # Calculate a semi-random but consistent value
                    value = base_value + year_factor
                    value += hash(f"{source['company']}{target['company']}") % 500
                    
                    links.append({
                        "source": current_stage,
                        "target": next_stage,
                        "sourceCountry": source["country"],
                        "targetCountry": target["country"],
                        "value": value
                    })
        
        return links

    def _get_default_structure(self) -> Dict[str, Any]:
        """Return default structure if processing fails."""
        return {
            "nodes": [
                {"id": "Mining", "name": "Mining", "type": "source"},
                {"id": "Processing", "name": "Processing", "type": "process"},
                {"id": "Cathode", "name": "Cathode", "type": "process"},
                {"id": "EV", "name": "EV", "type": "target"}
            ],
            "locations": {stage: [] for stage in SUPPLY_CHAIN_STEPS},
            "years": self.years,
            "dataByYear": {
                str(year): {"links": []} for year in self.years
            }
        }

def main():
    consolidator = DataConsolidator()
    all_results = {}
    
    # For now, we'll use deepseek as the default model
    model_name = "deepseek"
    
    for commodity in COMMODITIES:
        log_debug(f"Consolidating data for {commodity}...")
        consolidated = consolidator.consolidate_commodity_data(commodity, model_name)
        all_results[commodity] = consolidated
    
    # Save as JSON
    output_json = os.path.join(READY_DATA_DIR, 'final', 'supply_chain_data.json')
    save_to_json(all_results, output_json)
    
    # Save as JavaScript module
    js_content = f"export const supplyChainData = {json.dumps(all_results, indent=2)};"
    output_js = os.path.join('../../frontend/src/data', 'dummy-data.js')
    
    with open(output_js, 'w') as f:
        f.write(js_content)
    
    log_debug("Completed data consolidation")

if __name__ == "__main__":
    main() 