import ssl
import certifi
from datetime import datetime
import requests
from urllib.parse import unquote, parse_qs, urlparse
import asyncio

class AsyncLimiter:
    def __init__(self, rate, period):
        self.semaphore = asyncio.Semaphore(rate)
        self.period = period

    async def __aenter__(self):
        await self.semaphore.acquire()
        return self

    async def __aexit__(self, *args):
        self.semaphore.release()
        await asyncio.sleep(self.period)

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

def is_valid_pdf_url(url):
    try:
        head_response = requests.head(url, allow_redirects=True, timeout=10)
        content_type = head_response.headers.get('content-type', '').lower()
        return 'pdf' in content_type or url.lower().endswith('.pdf')
    except:
        return False

def is_annual_report(text, url):
    lower_text = text.lower()
    lower_url = url.lower()

    annual_indicators = [
        'annual report',
        'form 10-k',
        'consolidated financial statements',
        'year ended',
        'fiscal year'
    ]

    if any(indicator in lower_url for indicator in annual_indicators):
        return True

    first_section = lower_text[:5000]
    if any(indicator in first_section for indicator in annual_indicators):
        return True

    return False

def log_debug(message):
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(f"[{timestamp}] {message}")

def extract_url_from_google_link(href):
    if href.startswith('/url?'):
        parsed = urlparse('https://www.google.com' + href)
        return unquote(parse_qs(parsed.query)['q'][0])
    elif href.startswith('http'):
        return href
    else:
        return 'https://www.google.com' + href

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