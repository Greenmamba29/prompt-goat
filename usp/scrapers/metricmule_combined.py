"""
MetricMule Combined Scraper

Orchestrates both web and Airtable scrapers for comprehensive data collection.
"""

from typing import List, Optional

from ..core.base_scraper import BaseScraper
from ..core.protocol import PromptRequest, PromptResponse, ScraperCapabilities, ScrapeMethod
from .metricmule_web import MetricMuleWebScraper
from .metricmule_airtable import MetricMuleAirtableScraper


class MetricMuleCombinedScraper(BaseScraper):
    """
    Combined scraper that uses both web and Airtable methods.

    This scraper can:
    - Route to web or API based on request
    - Combine results from both sources
    - Deduplicate prompts
    """

    def __init__(
        self,
        headless: bool = True,
        base_id: Optional[str] = None,
        api_key: Optional[str] = None
    ):
        """
        Initialize combined scraper.

        Args:
            headless: Run web scraper in headless mode
            base_id: Airtable base ID
            api_key: Airtable API key
        """
        super().__init__()
        self.web_scraper = MetricMuleWebScraper(headless=headless)
        self.airtable_scraper = MetricMuleAirtableScraper(base_id=base_id, api_key=api_key)

    def get_capabilities(self) -> ScraperCapabilities:
        """Return combined capabilities."""
        return ScraperCapabilities(
            name="metricmule",
            methods=[ScrapeMethod.WEB, ScrapeMethod.API, ScrapeMethod.HYBRID],
            supports_pagination=True,
            supports_filtering=True,
            supports_search=False,
            max_results=None,
            rate_limit=5,
            requires_auth=False,  # Web doesn't require auth
            description="Scrapes prompts from MetricMule using web and/or Airtable API"
        )

    def scrape(self, request: PromptRequest) -> PromptResponse:
        """
        Scrape prompts using the requested method.

        Args:
            request: PromptRequest with parameters

        Returns:
            PromptResponse with scraped prompts
        """
        if request.method == ScrapeMethod.WEB:
            return self._scrape_web(request)
        elif request.method == ScrapeMethod.API:
            return self._scrape_airtable(request)
        elif request.method == ScrapeMethod.HYBRID:
            return self._scrape_hybrid(request)
        else:
            return self.create_error_response(f"Unsupported method: {request.method}")

    def _scrape_web(self, request: PromptRequest) -> PromptResponse:
        """Scrape using web scraper."""
        self.log_info("Scraping via web")
        return self.web_scraper.scrape(request)

    def _scrape_airtable(self, request: PromptRequest) -> PromptResponse:
        """Scrape using Airtable API."""
        self.log_info("Scraping via Airtable API")
        return self.airtable_scraper.scrape(request)

    def _scrape_hybrid(self, request: PromptRequest) -> PromptResponse:
        """
        Scrape using both web and Airtable, then combine results.

        Args:
            request: PromptRequest with parameters

        Returns:
            Combined PromptResponse
        """
        self.log_info("Scraping via hybrid method (web + Airtable)")
        response = self.create_response()

        # Try web scraping first
        web_response = self.web_scraper.scrape(request)
        if web_response.success:
            self.log_info(f"Web scraping: {web_response.scraped_count} prompts")
            for prompt in web_response.prompts:
                response.add_prompt(prompt)
        else:
            self.log_warning(f"Web scraping failed: {web_response.errors}")
            response.warnings.extend([f"Web: {e}" for e in web_response.errors])

        # Try Airtable if credentials available
        if request.api_key or self.airtable_scraper.api_key:
            airtable_response = self.airtable_scraper.scrape(request)
            if airtable_response.success:
                self.log_info(f"Airtable scraping: {airtable_response.scraped_count} prompts")

                # Deduplicate by title and text similarity
                existing_texts = {p.full_text for p in response.prompts}
                for prompt in airtable_response.prompts:
                    if prompt.full_text not in existing_texts:
                        response.add_prompt(prompt)
                        existing_texts.add(prompt.full_text)
                    else:
                        self.log_info(f"Skipped duplicate: {prompt.title}")
            else:
                self.log_warning(f"Airtable scraping failed: {airtable_response.errors}")
                response.warnings.extend([f"Airtable: {e}" for e in airtable_response.errors])
        else:
            response.add_warning("Airtable scraping skipped: no API key provided")

        # Set success if we got any results
        response.success = len(response.prompts) > 0
        response.total_count = len(response.prompts)

        if not response.success and not response.prompts:
            response.add_error("Both web and Airtable scraping failed")

        self.log_info(f"Hybrid scraping complete: {response.scraped_count} total prompts")
        return response
