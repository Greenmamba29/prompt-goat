"""
USP Protocol Definitions

Request and response structures for the Universal Scraper Protocol.
"""

from typing import List, Optional, Dict, Any
from dataclasses import dataclass, field
from enum import Enum
from .schema import PromptData


class ScrapeMethod(Enum):
    """Available scraping methods."""
    WEB = "web"  # Web scraping (Selenium, BeautifulSoup, etc.)
    API = "api"  # Direct API calls
    HYBRID = "hybrid"  # Combination of web + API


@dataclass
class ScraperCapabilities:
    """
    Describes what a scraper can do.
    """
    name: str  # Scraper name (e.g., "metricmule")
    methods: List[ScrapeMethod]  # Available scraping methods
    supports_pagination: bool = True
    supports_filtering: bool = False
    supports_search: bool = False
    max_results: Optional[int] = None  # Max results per request (None = unlimited)
    rate_limit: Optional[int] = None  # Requests per minute (None = no limit)
    requires_auth: bool = False
    description: str = ""


@dataclass
class PromptRequest:
    """
    Universal request structure for scraping prompts.
    """
    source: str  # Source platform identifier (e.g., "metricmule", "flowgpt")
    method: ScrapeMethod = ScrapeMethod.WEB  # Scraping method to use

    # Pagination
    limit: Optional[int] = None  # Max number of results to return
    offset: Optional[int] = 0  # Starting offset

    # Filtering (optional, depends on scraper capabilities)
    category: Optional[str] = None
    difficulty: Optional[str] = None
    search_query: Optional[str] = None
    tags: List[str] = field(default_factory=list)

    # Authentication (if required)
    auth_token: Optional[str] = None
    api_key: Optional[str] = None

    # Additional parameters
    params: Dict[str, Any] = field(default_factory=dict)

    def __post_init__(self):
        """Validate and normalize the request."""
        if isinstance(self.method, str):
            self.method = ScrapeMethod(self.method)


@dataclass
class PromptResponse:
    """
    Universal response structure for scraped prompts.
    """
    success: bool
    prompts: List[PromptData] = field(default_factory=list)
    total_count: int = 0  # Total available (for pagination)
    scraped_count: int = 0  # Number scraped in this request
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)  # Additional info

    def __post_init__(self):
        """Calculate scraped_count if not provided."""
        if self.scraped_count == 0 and self.prompts:
            self.scraped_count = len(self.prompts)

    def add_prompt(self, prompt: PromptData):
        """Add a prompt to the response."""
        self.prompts.append(prompt)
        self.scraped_count = len(self.prompts)

    def add_error(self, error: str):
        """Add an error message."""
        self.errors.append(error)

    def add_warning(self, warning: str):
        """Add a warning message."""
        self.warnings.append(warning)

    def is_valid(self) -> bool:
        """Check if the response contains valid data."""
        return self.success and len(self.prompts) > 0 and len(self.errors) == 0

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "success": self.success,
            "prompts": [p.to_dict() for p in self.prompts],
            "total_count": self.total_count,
            "scraped_count": self.scraped_count,
            "errors": self.errors,
            "warnings": self.warnings,
            "metadata": self.metadata
        }
