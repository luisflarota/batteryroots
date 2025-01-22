import os
import json
import asyncio
import aiohttp
from bs4 import BeautifulSoup
import requests
from typing import List, Dict, Any
from datetime import datetime, timedelta
import pandas as pd
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
from tqdm import tqdm
from utils import (
    AsyncLimiter, 
    fetch, 
    save_to_json, 
    is_valid_pdf_url, 
    is_annual_report,
    log_debug
)
from openai import OpenAI
from anthropic import Anthropic

# Constants
COMMODITIES = ['Lithium', 'Cobalt', 'Nickel']
START_YEAR = 2019
CURRENT_YEAR = datetime.now().year
ARTICLES_PER_COMMODITY = 200
REPORTS_PER_COMPANY = 5

# Model configurations
OPEN_SOURCE_MODELS = {
    "mistral": {
        "name": "mistralai/Mistral-7B-Instruct-v0.1",
        "type": "local",
        "class": "causal"
    },
    "llama2": {
        "name": "meta-llama/Llama-2-7b-chat-hf",
        "type": "local",
        "class": "causal"
    },
    "phi": {
        "name": "microsoft/phi-2",
        "type": "local",
        "class": "causal"
    },
    "neural-chat": {
        "name": "Intel/neural-chat-7b-v3-1",
        "type": "local",
        "class": "causal"
    },
    "openchat": {
        "name": "openchat/openchat-3.5",
        "type": "local",
        "class": "causal"
    }
}

API_MODELS = {
    "gpt4": {
        "name": "gpt-4-turbo-preview",
        "type": "api",
        "provider": "openai",
        "api_key_env": "OPENAI_API_KEY"
    },
    "claude3": {
        "name": "claude-3-opus-20240229",
        "type": "api",
        "provider": "anthropic",
        "api_key_env": "ANTHROPIC_API_KEY"
    },
    "deepseek": {
        "name": "deepseek-coder",
        "type": "api",
        "provider": "deepseek",
        "api_key_env": "DEEPSEEK_API_KEY"
    }
}

DEFAULT_MODEL = "mistral"

class SupplyChainAnalyzer:
    def __init__(self, model_key: str = DEFAULT_MODEL):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.limiter = AsyncLimiter(rate=5, period=1)
        
        # Initialize model
        self.model_key = model_key
        self.setup_model()

    def setup_model(self):
        """Setup either local model or API client based on model type"""
        if self.model_key in OPEN_SOURCE_MODELS:
            config = OPEN_SOURCE_MODELS[self.model_key]
            self.model_type = "local"
            self.model_name = config["name"]
            
            # Initialize local model
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_name,
                torch_dtype=torch.float16,
                device_map="auto"
            )
            
            # Enable optimizations
            if hasattr(self.model, 'enable_model_cpu_offload'):
                self.model.enable_model_cpu_offload()
            if hasattr(self.model, 'enable_attention_slicing'):
                self.model.enable_attention_slicing()
                
        elif self.model_key in API_MODELS:
            config = API_MODELS[self.model_key]
            self.model_type = "api"
            self.model_name = config["name"]
            self.provider = config["provider"]
            
            # Initialize API client
            api_key = os.getenv(config["api_key_env"])
            if not api_key:
                raise ValueError(f"Missing API key for {self.provider}. Set {config['api_key_env']} environment variable.")
            
            if self.provider == "openai":
                self.client = OpenAI(api_key=api_key)
            elif self.provider == "anthropic":
                self.client = Anthropic(api_key=api_key)
            elif self.provider == "deepseek":
                self.client = None  # Initialize DeepSeek client here
        else:
            raise ValueError(f"Unknown model: {self.model_key}")

    async def scrape_news_articles(self, commodity: str) -> List[Dict[str, Any]]:
        """Scrape news articles related to commodity supply chain."""
        articles = []
        search_query = f"{commodity} supply chain news"
        
        async with aiohttp.ClientSession() as session:
            for year in range(START_YEAR, CURRENT_YEAR + 1):
                query = f"{search_query} {year}"
                url = f"https://news.google.com/search?q={query}&hl=en-US&gl=US&ceid=US%3Aen"
                
                try:
                    html = await fetch(session, url, self.headers, self.limiter)
                    if html:
                        soup = BeautifulSoup(html, 'html.parser')
                        for article in soup.select('article'):
                            title = article.select_one('h3')
                            if title:
                                articles.append({
                                    'title': title.text,
                                    'year': year,
                                    'commodity': commodity,
                                    'type': 'news',
                                    'text': article.get_text()
                                })
                            if len(articles) >= ARTICLES_PER_COMMODITY:
                                break
                except Exception as e:
                    log_debug(f"Error scraping news for {commodity}: {e}")
        
        return articles

    async def scrape_company_reports(self, company: str) -> List[Dict[str, Any]]:
        """Scrape annual reports for a company."""
        reports = []
        search_query = f"{company} annual report filetype:pdf"
        
        async with aiohttp.ClientSession() as session:
            url = f"https://www.google.com/search?q={search_query}"
            try:
                html = await fetch(session, url, self.headers, self.limiter)
                if html:
                    soup = BeautifulSoup(html, 'html.parser')
                    for link in soup.find_all('a'):
                        href = link.get('href', '')
                        if 'pdf' in href.lower() and is_valid_pdf_url(href):
                            try:
                                response = requests.get(href)
                                if is_annual_report(response.text, href):
                                    reports.append({
                                        'company': company,
                                        'url': href,
                                        'year': self._extract_year_from_report(response.text),
                                        'text': response.text
                                    })
                                if len(reports) >= REPORTS_PER_COMPANY:
                                    break
                            except Exception as e:
                                log_debug(f"Error downloading report for {company}: {e}")
            except Exception as e:
                log_debug(f"Error scraping reports for {company}: {e}")
        
        return reports

    def _extract_year_from_report(self, text: str) -> int:
        """Extract year from report text."""
        try:
            # Look for patterns like "Annual Report 2023" or "For the year ended December 31, 2023"
            text_lower = text.lower()
            for year in range(CURRENT_YEAR, START_YEAR - 1, -1):
                if str(year) in text_lower:
                    return year
        except:
            pass
        return CURRENT_YEAR  # Default to current year if extraction fails

    def process_with_llm(self, text: str, commodity: str) -> Dict[str, Any]:
        """Process text with LLM to extract supply chain information."""
        # Base prompt template
        prompt_template = f"""Analyze the following text about {commodity} supply chain and extract:
1. Supply chain stages
2. Companies involved at each stage
3. Locations/sites for each company

Text to analyze:
{text}

Return only valid JSON with this structure:
{{
    "stages": ["stage1", "stage2", ...],
    "companies": {{
        "stage1": [
            {{"name": "company1", "locations": ["site1", "site2"]}},
            {{"name": "company2", "locations": ["site3", "site4"]}}
        ],
        "stage2": [...]
    }}
}}"""

        if self.model_type == "local":
            return self._process_with_local_model(prompt_template)
        else:
            return self._process_with_api_model(prompt_template)

    def _process_with_local_model(self, prompt: str) -> Dict[str, Any]:
        """Process text with local model"""
        # Adjust prompt based on model
        if "mistral" in self.model_name.lower():
            prompt = f"<s>[INST] {prompt} [/INST]"
        elif "llama" in self.model_name.lower():
            prompt = f"<s>[INST] <<SYS>>Extract supply chain information as JSON.<</SYS>>{prompt}[/INST]"

        inputs = self.tokenizer(prompt, return_tensors="pt", truncation=True, max_length=2048)
        inputs = inputs.to(self.model.device)

        outputs = self.model.generate(
            **inputs,
            max_length=4096,
            temperature=0.7,
            top_p=0.95,
            num_return_sequences=1,
            pad_token_id=self.tokenizer.eos_token_id
        )

        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return self._extract_json(response)

    def _process_with_api_model(self, prompt: str) -> Dict[str, Any]:
        """Process text with API model"""
        try:
            if self.provider == "openai":
                response = self.client.chat.completions.create(
                    model=self.model_name,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.7,
                    max_tokens=2000
                )
                result = response.choices[0].message.content

            elif self.provider == "anthropic":
                response = self.client.messages.create(
                    model=self.model_name,
                    max_tokens=2000,
                    messages=[{"role": "user", "content": prompt}]
                )
                result = response.content[0].text

            elif self.provider == "deepseek":
                # Implement DeepSeek API call here
                pass

            return self._extract_json(result)
        except Exception as e:
            log_debug(f"API model error: {e}")
            return {"stages": [], "companies": {}}

    def _extract_json(self, text: str) -> Dict[str, Any]:
        """Extract and parse JSON from model response"""
        try:
            # Find JSON in response
            json_str = text[text.find('{'):text.rfind('}') + 1]
            return json.loads(json_str)
        except:
            return {"stages": [], "companies": {}}

    def consolidate_results(self, results: List[Dict[str, Any]], commodity: str) -> Dict[str, Any]:
        """Consolidate all results into final format matching dummy-data.js structure."""
        consolidated = {
            "nodes": [],
            "locations": {},
            "years": list(range(START_YEAR, CURRENT_YEAR + 1)),
            "dataByYear": {}
        }

        # Process stages and companies
        all_stages = set()
        stage_companies = {}
        
        for result in results:
            all_stages.update(result.get("stages", []))
            for stage, companies in result.get("companies", {}).items():
                if stage not in stage_companies:
                    stage_companies[stage] = []
                stage_companies[stage].extend(companies)

        # Create nodes
        consolidated["nodes"] = [
            {"id": stage, "name": stage, "type": "process"}
            for stage in sorted(all_stages)
        ]

        # Create locations
        for stage, companies in stage_companies.items():
            consolidated["locations"][stage] = []
            for company in companies:
                for location in company.get("locations", []):
                    consolidated["locations"][stage].append({
                        "country": self._extract_country_code(location),
                        "coordinates": self._get_coordinates(location),
                        "company": company["name"],
                        "site": location
                    })

        # Create dummy flow data for each year
        for year in consolidated["years"]:
            consolidated["dataByYear"][str(year)] = {
                "links": self._generate_links(consolidated["locations"], year)
            }

        return consolidated

    def _extract_country_code(self, location: str) -> str:
        """Extract country code from location string."""
        # This is a simplified version - in practice, you'd want a proper geocoding service
        country_codes = {
            "United States": "USA", "China": "CHN", "Australia": "AUS",
            "Chile": "CHL", "Argentina": "ARG", "Canada": "CAN",
            "Congo": "COD", "Indonesia": "IDN", "Philippines": "PHL"
        }
        
        for country, code in country_codes.items():
            if country.lower() in location.lower():
                return code
        return "USA"  # Default to USA if no match found

    def _get_coordinates(self, location: str) -> List[float]:
        """Get coordinates for a location."""
        # This is a simplified version - in practice, you'd want a proper geocoding service
        return [-95.7129, 37.0902]  # Default to center of USA

    def _generate_links(self, locations: Dict[str, List[Dict]], year: int) -> List[Dict]:
        """Generate links between locations for a given year."""
        links = []
        stages = list(locations.keys())
        
        for i in range(len(stages) - 1):
            current_stage = stages[i]
            next_stage = stages[i + 1]
            
            for source in locations[current_stage]:
                for target in locations[next_stage]:
                    links.append({
                        "source": current_stage,
                        "target": next_stage,
                        "sourceCountry": source["country"],
                        "targetCountry": target["country"],
                        "value": 100 + year - START_YEAR  # Dummy value that increases each year
                    })
        
        return links

async def main():
    # Allow model selection from command line
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--model', 
                       choices=list(OPEN_SOURCE_MODELS.keys()) + list(API_MODELS.keys()), 
                       default=DEFAULT_MODEL,
                       help='Select the LLM model to use')
    args = parser.parse_args()

    analyzer = SupplyChainAnalyzer(model_key=args.model)
    all_results = {}

    for commodity in COMMODITIES:
        log_debug(f"Processing {commodity}...")
        
        # Scrape data
        articles = await analyzer.scrape_news_articles(commodity)
        
        # Extract unique companies from articles
        companies = set()
        for article in articles:
            text = article['text'].lower()
            # Simple company extraction - in practice, you'd want NER here
            for word in text.split():
                if word.endswith('corp') or word.endswith('inc') or word.endswith('ltd'):
                    companies.add(word)
        
        # Scrape company reports
        reports = []
        for company in companies:
            company_reports = await analyzer.scrape_company_reports(company)
            reports.extend(company_reports)
        
        # Process all texts with LLM
        llm_results = []
        all_texts = articles + reports
        for text in tqdm(all_texts, desc=f"Processing {commodity} texts with LLM"):
            result = analyzer.process_with_llm(text['text'], commodity)
            llm_results.append(result)
        
        # Consolidate results
        all_results[commodity] = analyzer.consolidate_results(llm_results, commodity)
    
    # Save results
    save_to_json(all_results, '../data/supply_chain_data.json')
    
    # Also save as JavaScript module
    js_content = f"export const supplyChainData = {json.dumps(all_results, indent=2)};"
    with open('../../frontend/src/data/dummy-data.js', 'w') as f:
        f.write(js_content)

if __name__ == "__main__":
    asyncio.run(main()) 