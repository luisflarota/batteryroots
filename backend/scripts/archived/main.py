import asyncio
from Papers import scrape_research_papers
from AnnualReports import scrape_public_company_reports, scrape_nonpublic_company_reports
from utils import save_to_json

if __name__ == "__main__":
    # Scrape research papers
    query = "lithium supply chain"
    num_papers = 50

    async def main():
        papers = await scrape_research_papers(query, num_papers)
        save_to_json(papers, '../data/research_papers.json')

    asyncio.run(main())

    # # Scrape public compan     reports
    # public_companies = ["Albemarle", "sociedad quimica y minera"]
    # public_reports = scrape_public_company_reports(public_companies)
    # save_to_json(public_reports, 'data/public_annual_reports.json')

    # # Scrape non-public company reports
    # nonpublic_companies = ["Albemarle", "Rio Tinto"]
    # nonpublic_reports = scrape_nonpublic_company_reports(nonpublic_companies)
    # save_to_json(nonpublic_reports, 'data/nonpublic_annual_reports.json')