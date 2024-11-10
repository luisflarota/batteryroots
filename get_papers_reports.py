import asyncio
import io
import json
import re
import time

import aiohttp
import PyPDF2
from aiolimiter import AsyncLimiter
from bs4 import BeautifulSoup
import requests
import ssl
import certifi

async def fetch(session, url, headers, limiter):
    ssl_context = ssl.create_default_context(cafile=certifi.where())
    async with limiter:
        try:
            async with session.get(url, headers=headers, ssl=ssl_context) as response:
                return await response.text()
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None

async def scrape_paper(session, result, headers, limiter, query):
    title = result.select_one('.gs_rt').text if result.select_one('.gs_rt') else "No title found"
    paper_url = result.select_one('.gs_rt a')['href'] if result.select_one('.gs_rt a') else None
    year = result.select_one('.gs_a').text.split('-')[-1].strip() if result.select_one('.gs_a') else "Year not found"
    
    paper_text = "No complete text available, but the title is: " + title
    if paper_url:
        fetched_text = await fetch(session, paper_url, headers, limiter)
        if fetched_text:
            paper_text = fetched_text

    return {
        "title": title,
        "year": year,
        "keywords": query.split(),
        "url": paper_url,
        "completeText": paper_text
    }

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



def scrape_public_company_reports(companies):
    reports = []
    session = requests.Session()

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'DNT': '1',
    }

    for company in companies:
        print(f"Searching for annual report for company: {company}")
        
        search_url = f"https://www.annualreports.com/Companies?search={company}"
        print(f"Constructed search URL: {search_url}")
        
        time.sleep(2)  # Delay to avoid being blocked
        response = session.get(search_url, headers=headers)
        print(f"Response status code for search URL: {response.status_code}")

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            print("Parsed HTML response with BeautifulSoup.")
            
            company_link = soup.select_one('span.companyName a')
            
            if company_link:
                company_url = f"https://www.annualreports.com{company_link['href']}"
                print(f"Found company page URL: {company_url}")
                
                company_page_response = session.get(company_url, headers=headers)
                print(f"Response status code for company page: {company_page_response.status_code}")
                
                if company_page_response.status_code == 200:
                    company_page_soup = BeautifulSoup(company_page_response.text, 'html.parser')
                    
                    # Try to find 10-K first, if not found, get the first annual report
                    report_link = company_page_soup.select_one('a.btn_form_10k[href^="/Click/"][onclick*="Form 10K - (HTML)"]') or \
                                  company_page_soup.select_one('a.btn_form_10k[href^="/Click/"]')
                    
                    if report_link:
                        report_url = f"https://www.annualreports.com{report_link['href']}"
                        print(f"Found report link for {company}: {report_url}")

                        report_response = session.get(report_url, headers=headers, allow_redirects=True)
                        print(f"Response status code for report: {report_response.status_code}")
                        
                        if report_response.status_code == 200:
                            if report_response.headers.get('Content-Type', '').startswith('application/pdf'):
                                print(f"Downloading PDF for {company} from {report_response.url}")
                                pdf_content = io.BytesIO(report_response.content)
                                pdf_reader = PyPDF2.PdfReader(pdf_content)
                                text = ""
                                for page in pdf_reader.pages:
                                    page_text = page.extract_text() or ""
                                    text += page_text
                                print(f"Extracted text length for {company}'s PDF: {len(text)} characters.")
                            else:
                                report_soup = BeautifulSoup(report_response.text, 'html.parser')
                                text = report_soup.get_text(separator=' ', strip=True)
                                print(f"Extracted text length for {company}'s HTML report: {len(text)} characters.")
                            
                            reports.append({
                                "company": company,
                                "url": report_response.url,
                                "completeText": text
                            })
                        else:
                            print(f"Failed to retrieve report for {company}. Status code: {report_response.status_code}")
                    else:
                        print(f"No report link found for {company}.")
                else:
                    print(f"Failed to open company page for {company}. Status code: {company_page_response.status_code}")
            else:
                print(f"No company page found for {company} in the search results.")
        else:
            print(f"Failed to retrieve search results for {company}. Status code: {response.status_code}")
    
    with open('public_company_annual_reports.json', 'w', encoding='utf-8') as json_file:
        json.dump(reports, json_file, ensure_ascii=False, indent=4)
    print("Saved reports to public_company_annual_reports.json.")
    
    return reports

def extract_financial_info(text):
    """ Extracts relevant financial information from the text. """
    # This is a placeholder for the actual extraction logic.
    # You can implement regex or string searching to find production, revenue, and other financial data.
    # For now, we will return the full text.
    return text  # Modify this to return only the relevant financial sections.

def scrape_nonpublic_company_reports(companies):
    reports = []
    
    for company in companies:
        search_url = f"https://www.google.com/search?q={company}+annual+report+filetype:pdf"
        response = requests.get(search_url)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        pdf_link = soup.select_one('.r a')
        if pdf_link:
            pdf_url = pdf_link['href']
            
            pdf_response = requests.get(pdf_url)
            if pdf_response.status_code == 200:
                pdf_content = io.BytesIO(pdf_response.content)
                pdf_reader = PyPDF2.PdfReader(pdf_content)
                text = ""
                for page in pdf_reader.pages:
                    page_text = page.extract_text() or ""  # Ensure we handle None
                    text += page_text
            else:
                text = "No text available for this report."  # {{ edit_3 }}
            
            reports.append({
                "company": company,
                "url": pdf_url,
                "completeText": text
            })
    
    return reports

def save_to_json(data, filename):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def clean_xbrl_text(xbrl_text):
    """Cleans the extracted XBRL text."""
    # Remove unnecessary whitespace and newlines
    cleaned_text = ' '.join(xbrl_text.split())
    # You can add more specific cleaning logic here if needed
    return cleaned_text

def clean_html_text(html_text):
    """Cleans the extracted HTML text."""
    # Remove unnecessary whitespace and newlines
    cleaned_text = ' '.join(html_text.split())
    # You can add more specific cleaning logic here if needed
    return cleaned_text

# Usage
if __name__ == "__main__":
    # Scrape research papers
    query = "lithium supply chain"
    papers = asyncio.run(scrape_research_papers(query))
    save_to_json(papers, 'research_papers.json')

    # Scrape public company reports
    public_companies = ["Albemarle", "sociedad quimica y minera"]
    public_reports = scrape_public_company_reports(public_companies)
    save_to_json(public_reports, 'public_annual_reports.json')

    # Scrape non-public company reports
    nonpublic_companies = ["Cargill", "Koch Industries", "Mars"]
    nonpublic_reports = scrape_nonpublic_company_reports(nonpublic_companies)
    save_to_json(nonpublic_reports, 'nonpublic_annual_reports.json')

    print("Scraping completed. Results saved in JSON files.")