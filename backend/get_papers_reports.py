import asyncio
import io
import json
import time
import ssl
import certifi
from datetime import datetime

import aiohttp
import PyPDF2
from aiolimiter import AsyncLimiter
from bs4 import BeautifulSoup
import requests
from urllib.parse import urljoin, urlparse, parse_qs, unquote


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
    
    return reports

def extract_financial_info(text):
    """ Extracts relevant financial information from the text. """
    # This is a placeholder for the actual extraction logic.
    # You can implement regex or string searching to find production, revenue, and other financial data.
    # For now, we will return the full text.
    return text  # Modify this to return only the relevant financial sections.

def scrape_nonpublic_company_reports(companies):
    reports = []
    log_filename = f"logs/scraping_log_{datetime.now().strftime('%Y%m%d')}.txt"
    
    def log_debug(message):
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_message = f"[{timestamp}] {message}"
        print(log_message)
        with open(log_filename, 'a') as f:
            f.write(log_message + '\n')

    def extract_url_from_google_link(href):
        """Extract actual URL from Google search result link"""
        if href.startswith('/url?'):
            parsed = urlparse('https://www.google.com' + href)
            return unquote(parse_qs(parsed.query)['q'][0])
        elif href.startswith('http'):
            return href
        else:
            return 'https://www.google.com' + href

    def is_valid_pdf_url(url):
        """Check if URL points to a PDF"""
        try:
            head_response = requests.head(url, allow_redirects=True, timeout=10)
            content_type = head_response.headers.get('content-type', '').lower()
            return 'pdf' in content_type or url.lower().endswith('.pdf')
        except:
            return False

    def is_annual_report(text, url):
        """Check if the PDF is likely an annual report"""
        lower_text = text.lower()
        lower_url = url.lower()
        
        annual_indicators = [
            'annual report',
            'form 10-k',
            'consolidated financial statements',
            'year ended',
            'fiscal year'
        ]
        
        # Check URL first
        if any(indicator in lower_url for indicator in annual_indicators):
            return True
            
        # Check first few paragraphs of text (higher confidence)
        first_section = lower_text[:5000]  # Check first 5000 characters
        if any(indicator in first_section for indicator in annual_indicators):
            return True
            
        return False

    for company in companies:
        retry_count = 0
        max_retries = 3
        success = False
        
        log_debug(f"\n{'='*50}")
        log_debug(f"Starting process for company: {company}")
        
        # Prioritized search queries for different report types
        search_queries = [
            # Annual Report queries (tried first)
            f'site:{company.lower().replace(" ", "")}.com filetype:pdf "annual report" 2023',
            f'"{company}" "annual report" 2023 filetype:pdf',
            f'"{company}" "form 10-k" 2023 filetype:pdf',
            # Sustainability Report queries (fallback)
            f'"{company}" "sustainability report" 2023 filetype:pdf',
            f'"{company}" "ESG report" 2023 filetype:pdf',
            # Financial Report queries (last resort)
            f'"{company}" "financial statements" 2023 filetype:pdf',
            f'"{company}" "financial report" 2023 filetype:pdf'
        ]
        
        for query_index, search_query in enumerate(search_queries):
            if success:
                break
                
            try:
                search_url = f"https://www.google.com/search?q={search_query}"
                log_debug(f"Attempt {query_index + 1}: Using search URL: {search_url}")
                
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/pdf',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Referer': 'https://www.google.com/'
                }
                
                response = requests.get(search_url, headers=headers, timeout=30)
                response.raise_for_status()
                log_debug(f"Search response status code: {response.status_code}")
                
                soup = BeautifulSoup(response.text, 'html.parser')
                potential_links = []
                
                for a in soup.find_all('a', href=True):
                    href = a['href']
                    if 'pdf' in href.lower():
                        actual_url = extract_url_from_google_link(href)
                        if actual_url:
                            log_debug(f"Found potential link: {actual_url}")
                            potential_links.append(actual_url)
                
                for link in potential_links:
                    try:
                        if is_valid_pdf_url(link):
                            log_debug(f"Attempting to download PDF from: {link}")
                            
                            pdf_response = requests.get(link, headers=headers, timeout=30)
                            pdf_response.raise_for_status()
                            
                            if 'pdf' in pdf_response.headers.get('content-type', '').lower():
                                pdf_content = io.BytesIO(pdf_response.content)
                                
                                try:
                                    pdf_reader = PyPDF2.PdfReader(pdf_content)
                                    text = ""
                                    total_pages = len(pdf_reader.pages)
                                    log_debug(f"PDF has {total_pages} pages")
                                    
                                    # Extract first few pages to check if it's an annual report
                                    for page_num in range(min(5, total_pages)):
                                        try:
                                            text += pdf_reader.pages[page_num].extract_text() or ""
                                        except Exception as e:
                                            log_debug(f"Error extracting text from page {page_num + 1}: {str(e)}")
                                    
                                    # If it looks like an annual report, extract all pages
                                    if query_index < 3 and not is_annual_report(text, link):  # Only check for annual report indicators in first 3 queries
                                        log_debug("PDF found but does not appear to be an annual report")
                                        continue
                                    
                                    # Extract full text
                                    text = ""
                                    for page_num, page in enumerate(pdf_reader.pages):
                                        try:
                                            page_text = page.extract_text() or ""
                                            text += page_text
                                            log_debug(f"Extracted text from page {page_num + 1}/{total_pages} - Length: {len(page_text)} chars")
                                        except Exception as e:
                                            log_debug(f"Error extracting text from page {page_num + 1}: {str(e)}")
                                    
                                    if len(text.strip()) > 100:
                                        report_type = "Annual Report" if query_index < 3 else \
                                                    "Sustainability Report" if query_index < 5 else \
                                                    "Financial Report"
                                        
                                        reports.append({
                                            "company": company,
                                            "url": link,
                                            "completeText": text.strip(),
                                            "pages": total_pages,
                                            "reportType": report_type,
                                            "status": "success",
                                            "timestamp": datetime.now().isoformat()
                                        })
                                        success = True
                                        log_debug(f"Successfully extracted {report_type} - {len(text)} characters")
                                        break
                                    else:
                                        log_debug("PDF found but extracted text was too short")
                                except Exception as e:
                                    log_debug(f"Error processing PDF: {str(e)}")
                            else:
                                log_debug("URL did not return PDF content")
                    except Exception as e:
                        log_debug(f"Error processing link {link}: {str(e)}")
                
                if not success:
                    time.sleep(2)  # Delay between queries
                
            except Exception as err:
                log_debug(f"Query {query_index + 1} failed: {str(err)}")
                time.sleep(2)
        
        if not success:
            reports.append({
                "company": company,
                "url": None,
                "completeText": "No reports found after trying all report types",
                "status": "failed",
                "timestamp": datetime.now().isoformat()
            })
            log_debug(f"Failed to retrieve any reports for {company}")
    
    # Final summary with report types
    success_count = sum(1 for r in reports if r.get("status") == "success")
    annual_reports = sum(1 for r in reports if r.get("reportType") == "Annual Report")
    sustainability_reports = sum(1 for r in reports if r.get("reportType") == "Sustainability Report")
    financial_reports = sum(1 for r in reports if r.get("reportType") == "Financial Report")
    
    log_debug(f"\nScraping completed:")
    log_debug(f"Total companies processed: {len(companies)}")
    log_debug(f"Successful retrievals: {success_count}")
    log_debug(f"  - Annual Reports: {annual_reports}")
    log_debug(f"  - Sustainability Reports: {sustainability_reports}")
    log_debug(f"  - Financial Reports: {financial_reports}")
    log_debug(f"Failed retrievals: {len(companies) - success_count}")
    
    return reports

def save_to_json(data, filename):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

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
    papers = asyncio.run(scrape_research_papers(query, num_papers=50))
    save_to_json(papers, 'data/research_papers.json')

    # Scrape public company reports
    public_companies = ["Albemarle", "sociedad quimica y minera"]
    public_reports = scrape_public_company_reports(public_companies)
    save_to_json(public_reports, 'data/public_annual_reports.json')

    # Scrape non-public company reports
    nonpublic_companies = ["Albemarle", "Rio Tinto"]
    nonpublic_reports = scrape_nonpublic_company_reports(nonpublic_companies)
    save_to_json(nonpublic_reports, 'data/nonpublic_annual_reports.json')

    print("Scraping completed. Results saved in JSON files.")   