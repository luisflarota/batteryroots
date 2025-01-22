import os
import json
from typing import Dict, Any
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import openai
from anthropic import Anthropic
import sys
sys.path.append('..')
from config import MODELS, SUPPLY_CHAIN_STEPS

class ModelFactory:
    @staticmethod
    def create_model(model_name: str) -> 'BaseModel':
        if model_name not in MODELS:
            raise ValueError(f"Unknown model: {model_name}")
        
        config = MODELS[model_name]
        if config['type'] == 'huggingface':
            return HuggingFaceModel(config)
        elif config['type'] == 'api':
            if model_name == 'openai':
                return OpenAIModel(config)
            elif model_name == 'anthropic':
                return AnthropicModel(config)
        
        raise ValueError(f"Unsupported model type: {config['type']}")

class BaseModel:
    def __init__(self, config: Dict[str, Any]):
        self.config = config
    
    def process_text(self, text: str, commodity: str) -> Dict[str, Any]:
        raise NotImplementedError

    def _create_prompt(self, text: str, commodity: str) -> str:
        return f"""Analyze the following text about {commodity} supply chain and extract information to match this exact structure:

1. Supply chain stages must be exactly: {', '.join(SUPPLY_CHAIN_STEPS)}
2. For each stage, identify:
   - Companies operating in that stage
   - Their specific locations/sites
   - The country for each location
   - Approximate coordinates (latitude, longitude)

Format the output as a JSON object with this exact structure:
{{
    "nodes": [
        {{ "id": "Mining", "name": "Mining", "type": "source" }},
        {{ "id": "Processing", "name": "Processing", "type": "process" }},
        {{ "id": "Cathode", "name": "Cathode", "type": "process" }},
        {{ "id": "EV", "name": "EV", "type": "target" }}
    ],
    "locations": {{
        "Mining": [
            {{ 
                "country": "AUS",
                "coordinates": [133.7751, -25.2744],
                "company": "Company Name",
                "site": "Site Location Name"
            }}
        ],
        "Processing": [...],
        "Cathode": [...],
        "EV": [...]
    }}
}}

Text to analyze:
{text}

JSON output:"""

class HuggingFaceModel(BaseModel):
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.tokenizer = AutoTokenizer.from_pretrained(config['name'])
        self.model = AutoModelForCausalLM.from_pretrained(
            config['name'], 
            torch_dtype=torch.float16
        )
        if torch.cuda.is_available():
            self.model = self.model.cuda()

    def process_text(self, text: str, commodity: str) -> Dict[str, Any]:
        prompt = self._create_prompt(text, commodity)
        inputs = self.tokenizer(prompt, return_tensors="pt", truncation=True, max_length=2048)
        
        if torch.cuda.is_available():
            inputs = inputs.to("cuda")

        outputs = self.model.generate(
            **inputs,
            max_length=self.config['max_length'],
            temperature=self.config['temperature'],
            top_p=self.config['top_p'],
            num_return_sequences=1
        )

        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        try:
            json_str = response[response.find('{'):response.rfind('}') + 1]
            result = json.loads(json_str)
            # Ensure the result matches our expected structure
            if not self._validate_result(result):
                return self._get_default_structure()
            return result
        except:
            return self._get_default_structure()

    def _validate_result(self, result: Dict) -> bool:
        """Validate that the result matches our expected structure."""
        try:
            # Check nodes
            if not all(stage in [node['id'] for node in result['nodes']] 
                      for stage in SUPPLY_CHAIN_STEPS):
                return False
            
            # Check locations
            if not all(stage in result['locations'] for stage in SUPPLY_CHAIN_STEPS):
                return False
            
            # Check location structure
            for locations in result['locations'].values():
                for loc in locations:
                    if not all(key in loc for key in ['country', 'coordinates', 'company', 'site']):
                        return False
            
            return True
        except:
            return False

    def _get_default_structure(self) -> Dict:
        """Return default structure if processing fails."""
        return {
            "nodes": [
                {"id": "Mining", "name": "Mining", "type": "source"},
                {"id": "Processing", "name": "Processing", "type": "process"},
                {"id": "Cathode", "name": "Cathode", "type": "process"},
                {"id": "EV", "name": "EV", "type": "target"}
            ],
            "locations": {stage: [] for stage in SUPPLY_CHAIN_STEPS}
        }

class OpenAIModel(BaseModel):
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        openai.api_key = os.getenv('OPENAI_API_KEY')

    def process_text(self, text: str, commodity: str) -> Dict[str, Any]:
        prompt = self._create_prompt(text, commodity)
        try:
            response = openai.ChatCompletion.create(
                model=self.config['model'],
                messages=[{"role": "user", "content": prompt}],
                temperature=self.config['temperature'],
                max_tokens=self.config['max_tokens']
            )
            result = json.loads(response.choices[0].message.content)
            if not self._validate_result(result):
                return self._get_default_structure()
            return result
        except:
            return self._get_default_structure()

    _validate_result = HuggingFaceModel._validate_result
    _get_default_structure = HuggingFaceModel._get_default_structure

class AnthropicModel(BaseModel):
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

    def process_text(self, text: str, commodity: str) -> Dict[str, Any]:
        prompt = self._create_prompt(text, commodity)
        try:
            response = self.client.messages.create(
                model=self.config['model'],
                max_tokens=self.config['max_tokens'],
                temperature=self.config['temperature'],
                messages=[{"role": "user", "content": prompt}]
            )
            result = json.loads(response.content[0].text)
            if not self._validate_result(result):
                return self._get_default_structure()
            return result
        except:
            return self._get_default_structure()

    _validate_result = HuggingFaceModel._validate_result
    _get_default_structure = HuggingFaceModel._get_default_structure 