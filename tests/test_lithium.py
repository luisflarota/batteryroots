import requests
import pandas as pd
from bs4 import BeautifulSoup
import ollama
import io
from PyPDF2 import PdfReader
import logging
import re
from urllib.parse import urljoin

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def fetch_reports():
    """
    Fetch important reports on lithium resources from well-known sources
    """
    reports = []
    sources = [
        {"name": "USGS2024", "url": "https://pubs.usgs.gov/periodicals/mcs2024/mcs2024-lithium.pdf"},
        {"name": "USGS2020", "url": "https://pubs.usgs.gov/myb/vol1/2020/myb1-2020-lithium.pdf"},
        # {"name": "IEA", "url": "https://www.iea.org/reports/the-role-of-critical-minerals-in-clean-energy-transitions"},
        # {"name": "McKinsey", "url": "https://www.mckinsey.com/industries/metals-and-mining/our-insights/lithium-mining-how-new-production-technologies-could-fuel-the-global-ev-revolution"},
        # {"name": "S&P Global", "url": "https://www.spglobal.com/commodity-insights/en/market-insights/topics/battery-metals"},
        # {"name": "BloombergNEF", "url": "https://about.bnef.com/blog/lithium-supply-is-set-to-triple-by-2025-what-could-go-wrong/"},
        # {"name": "Goldman Sachs", "url": "https://www.goldmansachs.com/insights/pages/gs-research/battery-metals-watch-the-end-of-the-beginning/report.pdf"},
        # {"name": "World Bank", "url": "https://www.worldbank.org/en/topic/extractiveindustries/brief/climate-smart-mining-minerals-for-climate-action"},
        # {"name": "Benchmark Mineral Intelligence", "url": "https://www.benchmarkminerals.com/lithium/"},
        # {"name": "Wood Mackenzie", "url": "https://www.woodmac.com/industries/power-and-renewables/batteries-energy-storage/"},
        # {"name": "Roskill", "url": "https://roskill.com/market-report/lithium/"}
    ]
    
    for source in sources:
        try:
            logger.info("Fetching report from %s...", source['name'])
            response = requests.get(source["url"])
            if response.status_code == 200:
                if source["url"].endswith('.pdf'):
                    content = process_pdf(response.content)
                else:
                    content = process_webpage(response.content, source["url"])
                
                reports.append({"source": source["name"], "content": content})
                logger.info("Successfully fetched and processed report from %s", source['name'])
            else:
                logger.warning("Failed to fetch report from %s. Status code: %d", source['name'], response.status_code)
        except Exception:
            logger.exception("Error fetching report from %s", source['name'])
    
    logger.info("Total reports fetched: %d", len(reports))
    return reports

def process_pdf(content):
    """Process PDF content"""
    pdf_file = io.BytesIO(content)
    pdf_reader = PdfReader(pdf_file)
    text_content = ""
    for page in pdf_reader.pages:
        text_content += page.extract_text()
    logger.info(f"PDF processed. Total characters: {len(text_content)}")
    return text_content

def process_webpage(content, base_url):
    """Process webpage content and any linked PDFs"""
    soup = BeautifulSoup(content, 'html.parser')
    text_content = soup.get_text()
    
    # Find and process linked PDFs
    pdf_links = soup.find_all('a', href=re.compile(r'\.pdf$'))
    for link in pdf_links:
        pdf_url = urljoin(base_url, link['href'])
        logger.info(f"Found linked PDF: {pdf_url}")
        try:
            pdf_response = requests.get(pdf_url)
            if pdf_response.status_code == 200:
                pdf_content = process_pdf(pdf_response.content)
                text_content += f"\n\nContent from linked PDF ({pdf_url}):\n{pdf_content}"
            else:
                logger.warning(f"Failed to fetch linked PDF: {pdf_url}")
        except Exception as e:
            logger.error(f"Error processing linked PDF {pdf_url}: {str(e)}")
    
    logger.info(f"Webpage processed. Total characters (including linked PDFs): {len(text_content)}")
    return text_content

def summarize_with_ollama(reports):
    """
    Use Ollama with llama3.1:latest model to summarize the reports and create a table
    """
    # Combine all report content
    all_content = "\n\n".join([f"{report['source']}:\n{report['content']}" for report in reports])
    
    prompt = f"""
    Summarize the following information about the lithium value chain and create a detailed table.
    The table should include:
    1. Stage in the value chain
    2. Quantity/Volume
    3. Key players/companies
    4. Geographic locations
    5. Any notable trends or challenges

    Information to summarize:
    {all_content}

    Please format the response as a markdown table.
    """

    try:
        response = ollama.chat(
            model='llama3.1:latest',
            messages=[{'role': 'user', 'content': prompt}]
        )
        return response['message']['content']
    except Exception as e:
        return f"Error: Unable to generate summary. Error: {str(e)}"

def main():
    logger.info("Starting the lithium report analysis process")
    
    # Step 1: Fetch reports
    reports = fetch_reports()
    logger.info("Fetched %d reports.", len(reports))

    # Step 2: Summarize and create table
    logger.info("Starting summarization process")
    table = summarize_with_ollama(reports)
    logger.info("Summarization complete")
    
    print("Lithium Value Chain Summary Table:")
    print(table)

    # Optionally, save the table to a file
    with open("lithium_value_chain_summary.md", "w") as f:
        f.write(table)
    logger.info("Summary table saved to lithium_value_chain_summary.md")

    logger.info("Lithium report analysis process completed")

if __name__ == "__main__":
    main()