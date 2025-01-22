import os
import asyncio
import json
from datetime import datetime
from typing import Dict, Any
from scrapers.news_scraper import main as scrape_news
from scrapers.report_scraper import main as scrape_reports
from processors.text_processor import process_with_all_models
from processors.data_consolidator import DataConsolidator
from config import MODELS, COMMODITIES, RAW_DATA_DIR, READY_DATA_DIR
from utils import log_debug

def ensure_directories():
    """Ensure all necessary directories exist."""
    directories = [
        os.path.join(RAW_DATA_DIR, 'news'),
        os.path.join(RAW_DATA_DIR, 'reports'),
        os.path.join(READY_DATA_DIR, 'processed'),
        os.path.join(READY_DATA_DIR, 'final')
    ]
    for directory in directories:
        os.makedirs(directory, exist_ok=True)

async def run_data_collection():
    """Run the data collection phase (news and reports)."""
    try:
        # Step 1: Scrape news articles
        log_debug("Starting news article scraping...")
        news_data = await scrape_news()
        log_debug("Completed news article scraping")

        # Step 2: Extract companies from news
        companies = set()
        for commodity_articles in news_data.values():
            for article in commodity_articles:
                text = article['text'].lower()
                # Simple company extraction - in practice, you'd want NER here
                for word in text.split():
                    if word.endswith('corp') or word.endswith('inc') or word.endswith('ltd'):
                        companies.add(word)

        # Step 3: Scrape annual reports for extracted companies
        log_debug("Starting annual report scraping...")
        await scrape_reports(list(companies))
        log_debug("Completed annual report scraping")

        return True
    except Exception as e:
        log_debug(f"Data collection failed: {e}")
        return False

async def run_llm_processing():
    """Run the LLM processing phase with multiple models."""
    try:
        for commodity in COMMODITIES:
            log_debug(f"Processing {commodity} with multiple models...")
            process_with_all_models(commodity)
        return True
    except Exception as e:
        log_debug(f"LLM processing failed: {e}")
        return False

def consolidate_data():
    """Consolidate processed data into final format for each model."""
    try:
        consolidator = DataConsolidator()
        
        for name in MODELS.keys():
            log_debug(f"Consolidating data for model: {name}")
            all_results = {}
            
            for commodity in COMMODITIES:
                log_debug(f"Consolidating {commodity} data for {name}...")
                consolidated = consolidator.consolidate_commodity_data(commodity, name)
                all_results[commodity] = consolidated
            
            # Save as JSON
            output_json = os.path.join(READY_DATA_DIR, 'final', f'supply_chain_data_{name}.json')
            with open(output_json, 'w') as f:
                json.dump(all_results, f, indent=2)
            
            # Save as JavaScript module
            js_content = f"export const supplyChainData = {json.dumps(all_results, indent=2)};"
            output_js = os.path.join('../../frontend/src/data', f'dummy-data_{name}.js')
            
            with open(output_js, 'w') as f:
                f.write(js_content)
            
            log_debug(f"Completed consolidation for {name}")
        
        return True
    except Exception as e:
        log_debug(f"Data consolidation failed: {e}")
        return False

def create_pipeline_report(collection_success: bool, processing_success: bool, consolidation_success: bool):
    """Create a report of the pipeline run."""
    report = {
        "timestamp": datetime.now().isoformat(),
        "stages": {
            "data_collection": {
                "success": collection_success,
                "files": os.listdir(RAW_DATA_DIR) if collection_success else []
            },
            "llm_processing": {
                "success": processing_success,
                "models_used": list(MODELS.keys()) if processing_success else []
            },
            "data_consolidation": {
                "success": consolidation_success,
                "output_files": os.listdir(os.path.join(READY_DATA_DIR, 'final')) if consolidation_success else []
            }
        }
    }
    
    report_file = os.path.join(READY_DATA_DIR, 'pipeline_report.json')
    with open(report_file, 'w') as f:
        json.dump(report, f, indent=2)

async def run_pipeline():
    """Run the complete supply chain analysis pipeline."""
    try:
        # Ensure directories exist
        ensure_directories()
        
        # Step 1: Data Collection
        log_debug("Starting data collection phase...")
        collection_success = await run_data_collection()
        
        # Step 2: LLM Processing
        log_debug("Starting LLM processing phase...")
        processing_success = await run_llm_processing() if collection_success else False
        
        # Step 3: Data Consolidation
        log_debug("Starting data consolidation phase...")
        consolidation_success = consolidate_data() if processing_success else False
        
        # Create pipeline report
        create_pipeline_report(collection_success, processing_success, consolidation_success)
        
        if consolidation_success:
            log_debug("Pipeline completed successfully!")
        else:
            log_debug("Pipeline completed with errors. Check pipeline_report.json for details.")

    except Exception as e:
        log_debug(f"Pipeline failed: {e}")
        create_pipeline_report(False, False, False)
        raise

if __name__ == "__main__":
    # Run the pipeline
    asyncio.run(run_pipeline()) 