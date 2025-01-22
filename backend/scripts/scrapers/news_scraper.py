import os
import json
import asyncio
import aiohttp
from bs4 import BeautifulSoup
from datetime import datetime
from typing import List, Dict, Any
import sys
sys.path.append('..')
from config import (
    COMMODITIES, 
    START_YEAR, 
    CURRENT_YEAR, 
    ARTICLES_PER_COMMODITY,
    HEADERS,
    RAW_DATA_DIR
)
from utils import AsyncLimiter, fetch, save_to_json, log_debug

class NewsArticleScraper:
    def __init__(self):
        self.headers = HEADERS
        self.limiter = AsyncLimiter(rate=5, period=1)

    async def scrape_articles(self, commodity: str) -> List[Dict[str, Any]]:
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
                                    'text': article.get_text(),
                                    'timestamp': datetime.now().isoformat()
                                })
                            if len(articles) >= ARTICLES_PER_COMMODITY:
                                break
                except Exception as e:
                    log_debug(f"Error scraping news for {commodity}: {e}")
        
        return articles

async def main():
    scraper = NewsArticleScraper()
    all_articles = {}

    for commodity in COMMODITIES:
        log_debug(f"Scraping news articles for {commodity}...")
        articles = await scraper.scrape_articles(commodity)
        all_articles[commodity] = articles
        
        # Save raw data for each commodity separately
        commodity_file = os.path.join(RAW_DATA_DIR, f'news_articles_{commodity.lower()}.json')
        save_to_json(articles, commodity_file)
        
        log_debug(f"Saved {len(articles)} articles for {commodity}")
    
    # Save combined data
    combined_file = os.path.join(RAW_DATA_DIR, 'news_articles_all.json')
    save_to_json(all_articles, combined_file)
    log_debug("Completed news article scraping")

if __name__ == "__main__":
    asyncio.run(main()) 