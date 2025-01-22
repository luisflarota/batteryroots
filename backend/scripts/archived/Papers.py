import asyncio
import aiohttp
from bs4 import BeautifulSoup
from utils import AsyncLimiter, fetch, scrape_paper

async def scrape_research_papers(query, num_papers=20):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
    }

    url = f"https://scholar.google.com/scholar?q={query}&hl=en&as_sdt=0,5&as_ylo=2023"

    limiter = AsyncLimiter(10, 1)  # 10 requests per second

    async with aiohttp.ClientSession() as session:
        response_text = await fetch(session, url, headers, limiter)
        if not response_text:
            print("Failed to fetch search results")
            return []

        soup = BeautifulSoup(response_text, 'html.parser')
        results = soup.select('.gs_r.gs_or.gs_scl')[:num_papers]

        tasks = [scrape_paper(session, result, headers, limiter, query) for result in results]
        papers = await asyncio.gather(*tasks)

    return [paper for paper in papers if paper is not None]