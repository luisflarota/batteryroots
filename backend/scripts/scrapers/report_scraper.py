import os
import json
import asyncio
import aiohttp
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from typing import List, Dict, Any
import sys
sys.path.append('..')
from config import (
    REPORTS_PER_COMPANY,
    START_YEAR,
    CURRENT_YEAR,
    HEADERS,
    RAW_DATA_DIR
)
from utils import (
    AsyncLimiter, 
    fetch, 
    save_to_json, 
    is_valid_pdf_url, 
    is_annual_report,
    log_debug
)

class AnnualReportScraper:
    def __init__(self):
        self.headers = HEADERS
        self.limiter = AsyncLimiter(rate=5, period=1)

    async def scrape_reports(self, company: str) -> List[Dict[str, Any]]:
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
                                    year = self._extract_year(response.text)
                                    if START_YEAR <= year <= CURRENT_YEAR:
                                        reports.append({
                                            'company': company,
                                            'url': href,
                                            'year': year,
                                            'text': response.text,
                                            'timestamp': datetime.now().isoformat()
                                        })
                                if len(reports) >= REPORTS_PER_COMPANY:
                                    break
                            except Exception as e:
                                log_debug(f"Error downloading report for {company}: {e}")
            except Exception as e:
                log_debug(f"Error scraping reports for {company}: {e}")
        
        return reports

    def _extract_year(self, text: str) -> int:
        """Extract year from report text."""
        try:
            text_lower = text.lower()
            for year in range(CURRENT_YEAR, START_YEAR - 1, -1):
                if str(year) in text_lower:
                    return year
        except:
            pass
        return CURRENT_YEAR

async def scrape_company_reports(companies: List[str]) -> Dict[str, List[Dict[str, Any]]]:
    """Scrape reports for multiple companies."""
    scraper = AnnualReportScraper()
    all_reports = {}

    for company in companies:
        log_debug(f"Scraping reports for {company}...")
        reports = await scraper.scrape_reports(company)
        all_reports[company] = reports
        
        # Save raw data for each company
        company_file = os.path.join(RAW_DATA_DIR, f'annual_reports_{company.lower().replace(" ", "_")}.json')
        save_to_json(reports, company_file)
        
        log_debug(f"Saved {len(reports)} reports for {company}")
    
    return all_reports

async def main():
    # Example companies - in practice, this would come from news article analysis
    companies = [
        "Albemarle",
        "SQM",
        "Ganfeng Lithium",
        "Tesla",
        "CATL"
    ]
    
    all_reports = await scrape_company_reports(companies)
    
    # Save combined data
    combined_file = os.path.join(RAW_DATA_DIR, 'annual_reports_all.json')
    save_to_json(all_reports, combined_file)
    log_debug("Completed annual report scraping")

if __name__ == "__main__":
    asyncio.run(main()) 