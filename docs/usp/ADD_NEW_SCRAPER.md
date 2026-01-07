# Adding a New Scraper to USP

Developer guide for implementing new scrapers in the Universal Scraper Protocol.

## 📋 Overview

Adding a new scraper is straightforward thanks to USP's modular architecture. This guide walks you through creating a scraper for a new source (e.g., FlowGPT, PromptBase, etc.).

## 🎯 Quick Summary

1. Create a new scraper class that inherits from `BaseScraper`
2. Implement `get_capabilities()` and `scrape()` methods
3. Register with `ScraperHost`
4. Test and export

That's it! 🎉

## 📝 Step-by-Step Guide

### Step 1: Create Scraper File

Create a new file in `usp/scrapers/`:

```bash
touch usp/scrapers/flowgpt_scraper.py
```

### Step 2: Basic Structure

```python
"""
FlowGPT Scraper

Scrapes prompts from FlowGPT.com
"""

from typing import List, Optional
from ..core.base_scraper import BaseScraper
from ..core.protocol import (
    PromptRequest,
    PromptResponse,
    ScraperCapabilities,
    ScrapeMethod
)
from ..core.schema import PromptData


class FlowGPTScraper(BaseScraper):
    """Scrapes prompts from FlowGPT."""

    BASE_URL = "https://flowgpt.com/prompts"

    def __init__(self):
        """Initialize the scraper."""
        super().__init__()
        # Add any initialization here

    def get_capabilities(self) -> ScraperCapabilities:
        """Return scraper capabilities."""
        return ScraperCapabilities(
            name="flowgpt",
            methods=[ScrapeMethod.WEB],  # What methods you support
            supports_pagination=True,
            supports_filtering=False,
            supports_search=False,
            max_results=None,
            rate_limit=None,
            requires_auth=False,
            description="Scrapes prompts from FlowGPT.com"
        )

    def scrape(self, request: PromptRequest) -> PromptResponse:
        """
        Scrape prompts from FlowGPT.

        Args:
            request: PromptRequest with parameters

        Returns:
            PromptResponse with results
        """
        response = self.create_response()

        try:
            # Your scraping logic here
            prompts = self._scrape_flowgpt(request)

            for prompt in prompts:
                response.add_prompt(prompt)

            response.success = True
            response.total_count = len(prompts)
            self.log_info(f"Successfully scraped {len(prompts)} prompts")

        except Exception as e:
            self.log_error(f"Scraping failed: {str(e)}")
            response.success = False
            response.add_error(f"Scraping failed: {str(e)}")

        return response

    def _scrape_flowgpt(self, request: PromptRequest) -> List[PromptData]:
        """
        Internal method to perform the actual scraping.

        Args:
            request: PromptRequest

        Returns:
            List of PromptData objects
        """
        # Implement your scraping logic here
        # Return list of PromptData objects
        pass
```

### Step 3: Implement Scraping Logic

Choose your scraping method:

#### Option A: Web Scraping (Selenium + BeautifulSoup)

```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

def _scrape_flowgpt(self, request: PromptRequest) -> List[PromptData]:
    """Scrape using Selenium."""
    prompts = []

    # Initialize WebDriver
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    driver = webdriver.Chrome(options=chrome_options)

    try:
        # Load page
        driver.get(self.BASE_URL)

        # Wait for content
        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))

        # Get HTML
        html = driver.page_source
        soup = BeautifulSoup(html, "html.parser")

        # Extract prompts
        prompt_elements = soup.select(".prompt-card")  # Adjust selector

        for idx, element in enumerate(prompt_elements):
            if request.limit and len(prompts) >= request.limit:
                break

            prompt_data = self._parse_element(element, idx)
            if prompt_data:
                prompts.append(prompt_data)

    finally:
        driver.quit()

    return prompts

def _parse_element(self, element, idx: int) -> Optional[PromptData]:
    """Parse a single prompt element."""
    try:
        title = element.select_one(".title").get_text(strip=True)
        full_text = element.select_one(".prompt-text").get_text(strip=True)
        source_url = element.select_one("a")["href"]

        return PromptData(
            id=f"flowgpt_{idx}",
            title=title,
            full_text=full_text,
            source_url=source_url,
            source_platform="flowgpt",
            is_free=True
        )
    except Exception as e:
        self.log_warning(f"Failed to parse element: {e}")
        return None
```

#### Option B: API-Based Scraping

```python
import requests

def _scrape_flowgpt(self, request: PromptRequest) -> List[PromptData]:
    """Scrape using API."""
    prompts = []

    # Make API request
    api_url = "https://api.flowgpt.com/prompts"
    headers = {
        "Authorization": f"Bearer {request.api_key}",
        "Content-Type": "application/json"
    }

    params = {
        "limit": request.limit or 100,
        "offset": request.offset or 0
    }

    response = requests.get(api_url, headers=headers, params=params)
    response.raise_for_status()

    data = response.json()

    # Convert to PromptData
    for item in data.get("prompts", []):
        prompt_data = self._convert_api_response(item)
        if prompt_data:
            prompts.append(prompt_data)

    return prompts

def _convert_api_response(self, item: dict) -> Optional[PromptData]:
    """Convert API response to PromptData."""
    return PromptData(
        id=f"flowgpt_{item['id']}",
        title=item["title"],
        full_text=item["content"],
        source_url=item["url"],
        source_platform="flowgpt",
        category=item.get("category"),
        tags=item.get("tags", []),
        author=item.get("author"),
        is_free=item.get("is_free", True)
    )
```

### Step 4: Register Scraper

Update `usp/cli.py`:

```python
def create_scraper_host() -> ScraperHost:
    """Create and configure the scraper host."""
    host = ScraperHost()

    # Existing scrapers
    host.register_scraper(MetricMuleCombinedScraper())

    # Add your new scraper
    from .scrapers.flowgpt_scraper import FlowGPTScraper
    host.register_scraper(FlowGPTScraper())

    return host
```

### Step 5: Test Your Scraper

Create a test file `test_flowgpt.py`:

```python
from usp.core.scraper_host import ScraperHost
from usp.core.protocol import PromptRequest, ScrapeMethod
from usp.scrapers.flowgpt_scraper import FlowGPTScraper

# Setup
host = ScraperHost()
host.register_scraper(FlowGPTScraper())

# Test capabilities
caps = host.get_capabilities("flowgpt")
print(f"Scraper: {caps.name}")
print(f"Methods: {[m.value for m in caps.methods]}")

# Test scraping
request = PromptRequest(
    source="flowgpt",
    method=ScrapeMethod.WEB,
    limit=5
)

response = host.scrape(request)
print(f"\nSuccess: {response.success}")
print(f"Scraped: {response.scraped_count} prompts")

if response.prompts:
    print(f"\nFirst prompt:")
    print(f"  Title: {response.prompts[0].title}")
    print(f"  Text: {response.prompts[0].full_text[:100]}...")
```

Run it:

```bash
python test_flowgpt.py
```

### Step 6: Use CLI

Once registered, you can use it via CLI:

```bash
# List scrapers (should include flowgpt)
python -m usp.cli list-scrapers

# Check capabilities
python -m usp.cli capabilities flowgpt

# Scrape
python -m usp.cli scrape flowgpt --limit 10 --export csv
```

## 🎨 Advanced Features

### Pagination

```python
def _scrape_with_pagination(self, request: PromptRequest) -> List[PromptData]:
    """Implement pagination."""
    all_prompts = []
    offset = request.offset or 0
    limit = request.limit or 100
    page_size = 50  # Fetch 50 at a time

    while len(all_prompts) < limit:
        # Fetch page
        page_prompts = self._fetch_page(offset, page_size)

        if not page_prompts:
            break  # No more data

        all_prompts.extend(page_prompts)
        offset += len(page_prompts)

    return all_prompts[:limit]  # Trim to limit
```

### Filtering

```python
def scrape(self, request: PromptRequest) -> PromptResponse:
    """Support filtering."""
    response = self.create_response()

    # Scrape all
    prompts = self._scrape_flowgpt(request)

    # Apply filters
    if request.category:
        prompts = [p for p in prompts if p.category == request.category]

    if request.difficulty:
        prompts = [p for p in prompts if p.difficulty == request.difficulty]

    for prompt in prompts:
        response.add_prompt(prompt)

    response.success = True
    return response
```

### Authentication

```python
def get_capabilities(self) -> ScraperCapabilities:
    return ScraperCapabilities(
        name="flowgpt",
        methods=[ScrapeMethod.API],
        requires_auth=True,  # Set to True
        # ...
    )

def scrape(self, request: PromptRequest) -> PromptResponse:
    # Check for auth
    if not request.api_key:
        return self.create_error_response("API key required")

    # Use api_key in requests
    headers = {"Authorization": f"Bearer {request.api_key}"}
    # ...
```

### Error Handling

```python
def _scrape_flowgpt(self, request: PromptRequest) -> List[PromptData]:
    """Robust error handling."""
    prompts = []

    try:
        # Main scraping logic
        response = requests.get(self.BASE_URL, timeout=30)
        response.raise_for_status()

    except requests.Timeout:
        self.log_error("Request timeout")
        raise

    except requests.HTTPError as e:
        self.log_error(f"HTTP error: {e.response.status_code}")
        raise

    except Exception as e:
        self.log_error(f"Unexpected error: {str(e)}")
        raise

    return prompts
```

## ✅ Checklist

Before submitting your scraper:

- [ ] Inherits from `BaseScraper`
- [ ] Implements `get_capabilities()`
- [ ] Implements `scrape()`
- [ ] Returns `PromptData` objects
- [ ] Handles errors gracefully
- [ ] Logs appropriately
- [ ] Validates required fields
- [ ] Tests with different limits
- [ ] Tests pagination (if supported)
- [ ] Tests filtering (if supported)
- [ ] Updates `cli.py` to register
- [ ] Adds documentation

## 📚 Examples

### Simple Scraper (20 lines)

```python
class SimpleScraper(BaseScraper):
    def get_capabilities(self):
        return ScraperCapabilities(
            name="simple",
            methods=[ScrapeMethod.WEB],
            supports_pagination=False
        )

    def scrape(self, request):
        response = self.create_response()
        try:
            # Minimal scraping
            prompts = self._fetch_prompts()
            for p in prompts:
                response.add_prompt(p)
            response.success = True
        except Exception as e:
            response.add_error(str(e))
        return response

    def _fetch_prompts(self):
        # Your logic here
        return []
```

### Full-Featured Scraper

See `usp/scrapers/metricmule_combined.py` for a complete example with:
- Multiple methods (web, API, hybrid)
- Pagination
- Filtering
- Deduplication
- Error handling
- Logging

## 🐛 Debugging Tips

### Enable Verbose Logging

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Print Intermediate Results

```python
def _scrape_flowgpt(self, request):
    html = driver.page_source
    print(f"HTML length: {len(html)}")

    elements = soup.select(".prompt")
    print(f"Found {len(elements)} elements")

    # Continue scraping...
```

### Test Selectors

```python
# In your browser's console
document.querySelectorAll(".prompt-card")
// Should return elements

// Try different selectors until you find the right one
```

## 🚀 Next Steps

1. **Implement your scraper** following this guide
2. **Test thoroughly** with different scenarios
3. **Add to CLI** by registering with ScraperHost
4. **Document** in a new `docs/usp/YOUR_SCRAPER_SETUP.md`
5. **Share** with the community!

## 📖 References

- [Base Scraper Code](../../usp/core/base_scraper.py)
- [Protocol Definitions](../../usp/core/protocol.py)
- [Schema](../../usp/core/schema.py)
- [MetricMule Example](../../usp/scrapers/metricmule_combined.py)

---

Need help? Open an issue or check the [architecture guide](./USP_ARCHITECTURE.md).
