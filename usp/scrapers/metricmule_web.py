"""
MetricMule Web Scraper

Scrapes prompts from MetricMule's website using Selenium + BeautifulSoup.
"""

import time
from typing import List, Optional
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import re

from ..core.base_scraper import BaseScraper
from ..core.protocol import PromptRequest, PromptResponse, ScraperCapabilities, ScrapeMethod
from ..core.schema import PromptData


class MetricMuleWebScraper(BaseScraper):
    """
    Scrapes prompts from MetricMule website.

    URL: https://www.metricmule.com/prompts
    """

    BASE_URL = "https://www.metricmule.com/prompts"

    def __init__(self, headless: bool = True):
        """
        Initialize the MetricMule web scraper.

        Args:
            headless: Run browser in headless mode (default: True)
        """
        super().__init__()
        self.headless = headless
        self.driver = None

    def get_capabilities(self) -> ScraperCapabilities:
        """Return scraper capabilities."""
        return ScraperCapabilities(
            name="metricmule",
            methods=[ScrapeMethod.WEB],
            supports_pagination=True,
            supports_filtering=False,
            supports_search=False,
            max_results=None,
            rate_limit=None,
            requires_auth=False,
            description="Scrapes prompts from MetricMule's website"
        )

    def _init_driver(self):
        """Initialize Selenium WebDriver."""
        if self.driver:
            return

        chrome_options = Options()
        if self.headless:
            chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

        self.driver = webdriver.Chrome(options=chrome_options)
        self.log_info("WebDriver initialized")

    def _close_driver(self):
        """Close Selenium WebDriver."""
        if self.driver:
            self.driver.quit()
            self.driver = None
            self.log_info("WebDriver closed")

    def scrape(self, request: PromptRequest) -> PromptResponse:
        """
        Scrape prompts from MetricMule.

        Args:
            request: PromptRequest with parameters

        Returns:
            PromptResponse with scraped prompts
        """
        response = self.create_response()

        try:
            # Initialize driver
            self._init_driver()

            # Load the page
            self.log_info(f"Loading {self.BASE_URL}")
            self.driver.get(self.BASE_URL)

            # Wait for content to load
            wait = WebDriverWait(self.driver, 10)
            wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            time.sleep(2)  # Additional wait for dynamic content

            # Scroll to load more prompts if needed
            if request.limit and request.limit > 20:
                self._scroll_to_load_more(request.limit)

            # Get page source and parse
            html = self.driver.page_source
            soup = BeautifulSoup(html, "html.parser")

            # Extract prompts
            prompts = self._extract_prompts(soup, request.limit)

            for prompt in prompts:
                response.add_prompt(prompt)

            response.success = True
            response.total_count = len(prompts)
            self.log_info(f"Successfully scraped {len(prompts)} prompts")

        except Exception as e:
            self.log_error(f"Scraping failed: {str(e)}")
            response.success = False
            response.add_error(f"Scraping failed: {str(e)}")

        finally:
            self._close_driver()

        return response

    def _scroll_to_load_more(self, target_count: int):
        """
        Scroll the page to load more prompts.

        Args:
            target_count: Target number of prompts to load
        """
        last_height = self.driver.execute_script("return document.body.scrollHeight")
        scroll_attempts = 0
        max_scrolls = min(target_count // 10, 20)  # Limit scrolls

        while scroll_attempts < max_scrolls:
            # Scroll down
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(1.5)

            # Check if new content loaded
            new_height = self.driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break

            last_height = new_height
            scroll_attempts += 1
            self.log_info(f"Scrolled {scroll_attempts} times")

    def _extract_prompts(self, soup: BeautifulSoup, limit: Optional[int] = None) -> List[PromptData]:
        """
        Extract prompt data from parsed HTML.

        This method tries multiple selector strategies to find prompts.

        Args:
            soup: BeautifulSoup parsed HTML
            limit: Maximum number of prompts to extract

        Returns:
            List of PromptData objects
        """
        prompts = []

        # Strategy 1: Look for common prompt card patterns
        # Try various selectors that might contain prompt cards
        selectors = [
            ".prompt-card",
            ".prompt",
            "[class*='prompt']",
            ".card",
            "article",
            "[data-prompt-id]",
        ]

        prompt_elements = []
        for selector in selectors:
            elements = soup.select(selector)
            if elements:
                self.log_info(f"Found {len(elements)} elements with selector: {selector}")
                prompt_elements = elements
                break

        # If no structured elements found, try to find text-based prompts
        if not prompt_elements:
            self.log_warning("No structured prompt elements found, trying text extraction")
            prompt_elements = self._find_prompts_by_text(soup)

        # Extract data from elements
        for idx, element in enumerate(prompt_elements):
            if limit and len(prompts) >= limit:
                break

            try:
                prompt_data = self._extract_prompt_from_element(element, idx)
                if prompt_data:
                    prompts.append(prompt_data)
            except Exception as e:
                self.log_warning(f"Failed to extract prompt {idx}: {str(e)}")

        return prompts

    def _find_prompts_by_text(self, soup: BeautifulSoup) -> List:
        """
        Fallback: Find prompts by looking for text patterns.

        Args:
            soup: BeautifulSoup parsed HTML

        Returns:
            List of elements that might be prompts
        """
        # Look for paragraphs or divs with substantial text
        candidates = []
        for tag in soup.find_all(["p", "div", "section"]):
            text = tag.get_text(strip=True)
            # Heuristic: Prompts are usually 50+ characters
            if len(text) > 50 and len(text) < 5000:
                candidates.append(tag)

        return candidates

    def _extract_prompt_from_element(self, element, idx: int) -> Optional[PromptData]:
        """
        Extract prompt data from a single element.

        Args:
            element: BeautifulSoup element
            idx: Index for generating ID

        Returns:
            PromptData object or None
        """
        # Try to extract title
        title = None
        for tag in ["h1", "h2", "h3", "h4", ".title", "[class*='title']"]:
            title_elem = element.select_one(tag) if "." in tag or "[" in tag else element.find(tag)
            if title_elem:
                title = title_elem.get_text(strip=True)
                break

        # Try to extract full text (the actual prompt)
        full_text = element.get_text(strip=True)

        # Try to extract category/tags
        category = None
        tags = []
        for tag_elem in element.select("[class*='tag'], [class*='category'], .badge"):
            tag_text = tag_elem.get_text(strip=True)
            if tag_text:
                tags.append(tag_text)
                if not category:
                    category = tag_text

        # Try to extract URL
        source_url = self.BASE_URL
        link = element.find("a", href=True)
        if link:
            href = link["href"]
            if href.startswith("http"):
                source_url = href
            elif href.startswith("/"):
                source_url = f"https://www.metricmule.com{href}"

        # Validate minimum requirements
        if not full_text or len(full_text) < 20:
            return None

        if not title:
            # Generate title from first few words
            words = full_text.split()[:10]
            title = " ".join(words) + ("..." if len(words) >= 10 else "")

        # Create PromptData
        prompt_id = f"metricmule_{idx}_{hash(full_text) % 100000}"

        return PromptData(
            id=prompt_id,
            title=title,
            full_text=full_text,
            source_url=source_url,
            source_platform="metricmule",
            category=category,
            tags=tags,
            is_free=True,
            metadata={
                "scrape_method": "web",
                "element_type": element.name,
            }
        )

    def __del__(self):
        """Cleanup when object is destroyed."""
        self._close_driver()
