import os
import json
from typing import Dict, Any, List
from tqdm import tqdm
import sys
sys.path.append('..')
from config import RAW_DATA_DIR, READY_DATA_DIR, MODELS
from models.model_factory import ModelFactory
from utils import save_to_json, log_debug

class TextProcessor:
    def __init__(self, model_name: str):
        self.model = ModelFactory.create_model(model_name)
        self.model_name = model_name

    def process_commodity_data(self, commodity: str) -> Dict[str, Any]:
        """Process all data for a specific commodity."""
        # Load raw data
        articles = self._load_json(os.path.join(RAW_DATA_DIR, f'news_articles_{commodity.lower()}.json'))
        
        # Process texts
        results = []
        all_texts = articles  # Add other sources (reports, papers) here
        
        for text_data in tqdm(all_texts, desc=f"Processing {commodity} texts with {self.model_name}"):
            result = self.model.process_text(text_data['text'], commodity)
            results.append({
                'source': text_data,
                'analysis': result,
                'model': self.model_name
            })
        
        # Save processed results
        output_file = os.path.join(
            READY_DATA_DIR, 
            f'processed_{commodity.lower()}_{self.model_name}.json'
        )
        save_to_json(results, output_file)
        
        return results

    def _load_json(self, filepath: str) -> List[Dict[str, Any]]:
        """Load JSON data from file."""
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except Exception as e:
            log_debug(f"Error loading {filepath}: {e}")
            return []

def process_with_all_models(commodity: str):
    """Process commodity data with all available models."""
    results = {}
    
    for model_name in MODELS.keys():
        try:
            processor = TextProcessor(model_name)
            results[model_name] = processor.process_commodity_data(commodity)
            log_debug(f"Completed processing {commodity} with {model_name}")
        except Exception as e:
            log_debug(f"Error processing {commodity} with {model_name}: {e}")
    
    # Save combined results
    output_file = os.path.join(READY_DATA_DIR, f'processed_{commodity.lower()}_all_models.json')
    save_to_json(results, output_file)

def main():
    from config import COMMODITIES
    
    for commodity in COMMODITIES:
        log_debug(f"Processing {commodity}...")
        process_with_all_models(commodity)
        log_debug(f"Completed processing {commodity}")

if __name__ == "__main__":
    main() 