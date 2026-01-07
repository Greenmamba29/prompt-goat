"""
Scraper Host - Routes requests to appropriate scrapers

The ScraperHost is the main entry point for the USP system.
It manages all registered scrapers and routes requests to the correct one.
"""

from typing import Dict, List, Optional
import logging
from .base_scraper import BaseScraper
from .protocol import PromptRequest, PromptResponse, ScraperCapabilities


class ScraperHost:
    """
    Central hub for managing and routing to scrapers.

    Usage:
        host = ScraperHost()
        host.register_scraper(MetricMuleScraper())
        host.register_scraper(FlowGPTScraper())

        request = PromptRequest(source="metricmule", limit=100)
        response = host.scrape(request)
    """

    def __init__(self):
        """Initialize the scraper host."""
        self.scrapers: Dict[str, BaseScraper] = {}
        self.logger = logging.getLogger(self.__class__.__name__)

    def register_scraper(self, scraper: BaseScraper):
        """
        Register a scraper with the host.

        Args:
            scraper: BaseScraper instance to register
        """
        capabilities = scraper.get_capabilities()
        source_name = capabilities.name.lower()

        if source_name in self.scrapers:
            self.logger.warning(f"Overwriting existing scraper: {source_name}")

        self.scrapers[source_name] = scraper
        self.logger.info(f"Registered scraper: {source_name}")

    def unregister_scraper(self, source: str):
        """
        Unregister a scraper.

        Args:
            source: Source name to unregister
        """
        source = source.lower()
        if source in self.scrapers:
            del self.scrapers[source]
            self.logger.info(f"Unregistered scraper: {source}")
        else:
            self.logger.warning(f"Scraper not found: {source}")

    def get_scraper(self, source: str) -> Optional[BaseScraper]:
        """
        Get a scraper by source name.

        Args:
            source: Source name

        Returns:
            BaseScraper instance or None if not found
        """
        return self.scrapers.get(source.lower())

    def list_scrapers(self) -> List[str]:
        """
        List all registered scraper names.

        Returns:
            List of source names
        """
        return list(self.scrapers.keys())

    def get_capabilities(self, source: str) -> Optional[ScraperCapabilities]:
        """
        Get capabilities for a specific scraper.

        Args:
            source: Source name

        Returns:
            ScraperCapabilities or None if scraper not found
        """
        scraper = self.get_scraper(source)
        if scraper:
            return scraper.get_capabilities()
        return None

    def get_all_capabilities(self) -> Dict[str, ScraperCapabilities]:
        """
        Get capabilities for all registered scrapers.

        Returns:
            Dictionary mapping source names to capabilities
        """
        return {
            source: scraper.get_capabilities()
            for source, scraper in self.scrapers.items()
        }

    def scrape(self, request: PromptRequest) -> PromptResponse:
        """
        Execute a scraping request.

        This method:
        1. Finds the appropriate scraper
        2. Validates the request
        3. Executes the scrape
        4. Returns the response

        Args:
            request: PromptRequest with scraping parameters

        Returns:
            PromptResponse with results
        """
        source = request.source.lower()

        # Find scraper
        scraper = self.get_scraper(source)
        if not scraper:
            error = f"No scraper registered for source: {request.source}"
            self.logger.error(error)
            return PromptResponse(success=False, errors=[error])

        # Validate request
        is_valid, errors = scraper.validate_request(request)
        if not is_valid:
            self.logger.error(f"Invalid request: {errors}")
            return PromptResponse(success=False, errors=errors)

        # Execute scrape
        try:
            self.logger.info(f"Executing scrape: source={source}, method={request.method.value}")
            response = scraper.scrape(request)
            self.logger.info(
                f"Scrape complete: scraped={response.scraped_count}, "
                f"success={response.success}, errors={len(response.errors)}"
            )
            return response

        except Exception as e:
            error = f"Scrape failed with exception: {str(e)}"
            self.logger.exception(error)
            return PromptResponse(success=False, errors=[error])

    def scrape_multiple(self, requests: List[PromptRequest]) -> List[PromptResponse]:
        """
        Execute multiple scraping requests.

        Args:
            requests: List of PromptRequest objects

        Returns:
            List of PromptResponse objects
        """
        responses = []
        for request in requests:
            response = self.scrape(request)
            responses.append(response)
        return responses

    def __repr__(self) -> str:
        """String representation."""
        return f"<ScraperHost scrapers={list(self.scrapers.keys())}>"
