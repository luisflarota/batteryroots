from datetime import datetime

# Supply Chain Structure
SUPPLY_CHAIN_STEPS = ['Mining', 'Processing', 'Cathode', 'EV']

# Data Collection Settings
COMMODITIES = ['Lithium', 'Cobalt', 'Nickel']
START_YEAR = 2019
CURRENT_YEAR = datetime.now().year
ARTICLES_PER_COMMODITY = 200
REPORTS_PER_COMPANY = 5

# File Paths
RAW_DATA_DIR = '../data/raw'
READY_DATA_DIR = '../data/ready'

# Model Configurations
MODELS = {
    'deepseek': {
        'name': 'deepseek-ai/deepseek-coder-6.7b-instruct',
        'type': 'huggingface',
        'max_length': 4096,
        'temperature': 0.7,
        'top_p': 0.95
    },
    'mistral': {
        'name': 'mistralai/Mistral-7B-Instruct-v0.2',
        'type': 'huggingface',
        'max_length': 4096,
        'temperature': 0.7,
        'top_p': 0.95
    },
    'yi': {
        'name': '01-ai/Yi-34B-Chat',
        'type': 'huggingface',
        'max_length': 4096,
        'temperature': 0.7,
        'top_p': 0.95
    },
    'solar': {
        'name': 'upstage/SOLAR-10.7B-Instruct-v1.0',
        'type': 'huggingface',
        'max_length': 4096,
        'temperature': 0.7,
        'top_p': 0.95
    },
    'phi': {
        'name': 'microsoft/phi-2',
        'type': 'huggingface',
        'max_length': 2048,  # phi-2 has a smaller context window
        'temperature': 0.7,
        'top_p': 0.95
    },
    'stable': {
        'name': 'stabilityai/stablelm-zephyr-3b',
        'type': 'huggingface',
        'max_length': 4096,
        'temperature': 0.7,
        'top_p': 0.95
    },
    'openai': {
        'type': 'api',
        'model': 'gpt-4',
        'temperature': 0.7,
        'max_tokens': 4000
    },
    'anthropic': {
        'type': 'api',
        'model': 'claude-3-sonnet',
        'temperature': 0.7,
        'max_tokens': 4000
    }
}

# Country Codes
COUNTRY_CODES = {
    "United States": "USA", 
    "China": "CHN", 
    "Australia": "AUS",
    "Chile": "CHL", 
    "Argentina": "ARG", 
    "Canada": "CAN",
    "Congo": "COD", 
    "Indonesia": "IDN", 
    "Philippines": "PHL",
    "Germany": "DEU",
    "Japan": "JPN",
    "South Korea": "KOR",
    "Finland": "FIN",
    "Zambia": "ZMB"
}

# Headers for web scraping
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
} 