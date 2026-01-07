"""
Universal Scraper Protocol (USP)
A standardized protocol for extracting and normalizing prompts from various sources.
"""

__version__ = "0.1.0"

from .core.protocol import PromptRequest, PromptResponse, ScraperCapabilities
from .core.schema import PromptData, PromptSchema
from .core.base_scraper import BaseScraper
from .core.scraper_host import ScraperHost

__all__ = [
    "PromptRequest",
    "PromptResponse",
    "ScraperCapabilities",
    "PromptData",
    "PromptSchema",
    "BaseScraper",
    "ScraperHost",
]
