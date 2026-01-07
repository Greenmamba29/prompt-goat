"""
Base Scraper Abstract Class

All USP scrapers must inherit from this class and implement the required methods.
"""

from abc import ABC, abstractmethod
from typing import List, Optional
import logging
from .protocol import PromptRequest, PromptResponse, ScraperCapabilities
from .schema import PromptData


class BaseScraper(ABC):
    """
    Abstract base class for all USP scrapers.

    To create a new scraper:
    1. Inherit from BaseScraper
    2. Implement get_capabilities()
    3. Implement scrape()
    4. Register with ScraperHost
    """

    def __init__(self):
        """Initialize the scraper."""
        self.logger = logging.getLogger(self.__class__.__name__)
        self._capabilities = None

    @abstractmethod
    def get_capabilities(self) -> ScraperCapabilities:
        """
        Return the capabilities of this scraper.

        This method must be implemented by all scrapers to describe
        what they can do.

        Returns:
            ScraperCapabilities object
        """
        pass

    @abstractmethod
    def scrape(self, request: PromptRequest) -> PromptResponse:
        """
        Scrape prompts based on the request.

        This is the main method that performs the actual scraping.

        Args:
            request: PromptRequest object with scraping parameters

        Returns:
            PromptResponse object with results
        """
        pass

    def validate_request(self, request: PromptRequest) -> tuple[bool, List[str]]:
        """
        Validate that this scraper can handle the request.

        Args:
            request: PromptRequest to validate

        Returns:
            (is_valid, error_messages)
        """
        errors = []
        capabilities = self.get_capabilities()

        # Check if method is supported
        if request.method not in capabilities.methods:
            errors.append(
                f"Method {request.method.value} not supported by {capabilities.name}. "
                f"Supported: {[m.value for m in capabilities.methods]}"
            )

        # Check if pagination is supported
        if request.limit and not capabilities.supports_pagination:
            errors.append(f"Pagination not supported by {capabilities.name}")

        # Check max results
        if capabilities.max_results and request.limit and request.limit > capabilities.max_results:
            errors.append(
                f"Requested limit {request.limit} exceeds max {capabilities.max_results}"
            )

        # Check authentication
        if capabilities.requires_auth and not (request.auth_token or request.api_key):
            errors.append(f"Authentication required for {capabilities.name}")

        # Check filtering support
        if request.category and not capabilities.supports_filtering:
            errors.append(f"Filtering not supported by {capabilities.name}")

        # Check search support
        if request.search_query and not capabilities.supports_search:
            errors.append(f"Search not supported by {capabilities.name}")

        return (len(errors) == 0, errors)

    def create_response(self, success: bool = True) -> PromptResponse:
        """
        Create an empty response object.

        Args:
            success: Whether the operation was successful

        Returns:
            Empty PromptResponse
        """
        return PromptResponse(success=success)

    def create_error_response(self, error: str) -> PromptResponse:
        """
        Create an error response.

        Args:
            error: Error message

        Returns:
            PromptResponse with error
        """
        response = PromptResponse(success=False)
        response.add_error(error)
        return response

    def log_info(self, message: str):
        """Log an info message."""
        self.logger.info(message)

    def log_warning(self, message: str):
        """Log a warning message."""
        self.logger.warning(message)

    def log_error(self, message: str):
        """Log an error message."""
        self.logger.error(message)

    def __repr__(self) -> str:
        """String representation."""
        capabilities = self.get_capabilities()
        return f"<{self.__class__.__name__} source={capabilities.name}>"
