# MetricMule Scraper Setup Guide

Complete guide for scraping prompts from MetricMule using USP.

## 📋 Overview

MetricMule scraper supports three methods:

1. **Web Scraping** - Uses Selenium + BeautifulSoup (no auth required)
2. **Airtable API** - Direct API access (requires credentials)
3. **Hybrid** - Combines both for maximum coverage

## 🌐 Method 1: Web Scraping (Recommended to Start)

### Prerequisites

- Chrome or Chromium browser installed
- `selenium` and `webdriver-manager` packages

### Setup

```bash
# Install dependencies (if not already done)
pip install selenium webdriver-manager beautifulsoup4

# Test it works
python -m usp.cli scrape metricmule --method web --limit 5 --export csv
```

### Configuration

Web scraping doesn't require configuration, but you can customize:

```python
# In your code
from usp.scrapers.metricmule_combined import MetricMuleCombinedScraper

# Disable headless mode (show browser)
scraper = MetricMuleCombinedScraper(headless=False)
```

Or set in `.env`:

```env
SELENIUM_HEADLESS=false
```

### Usage Examples

```bash
# Basic scrape
python -m usp.cli scrape metricmule --method web --limit 50 --export csv

# Larger scrape
python -m usp.cli scrape metricmule --method web --limit 200 --export json

# With verbose logging
python -m usp.cli scrape metricmule --method web --limit 10 --verbose
```

### How It Works

1. **Loads Page**: Opens MetricMule prompts page in Chrome
2. **Scrolls**: Scrolls down to load more prompts (pagination)
3. **Parses**: Extracts prompt data using BeautifulSoup
4. **Normalizes**: Converts to standard PromptData format

### Pros & Cons

✅ **Pros**:
- No authentication required
- Works immediately
- Gets all public data

❌ **Cons**:
- Slower than API
- Requires Chrome
- Can break if website changes

## 🔑 Method 2: Airtable API

MetricMule stores their prompts in Airtable. If you have access to their base, you can use the API.

### Prerequisites

1. **Airtable Account**: Sign up at [airtable.com](https://airtable.com)
2. **API Key**: Get from [airtable.com/account](https://airtable.com/account)
3. **Base Access**: You need access to MetricMule's Airtable base
4. **Base ID**: Found in the Airtable URL

### Getting Your Credentials

#### 1. Get API Key

1. Go to [airtable.com/account](https://airtable.com/account)
2. Scroll to "API" section
3. Click "Generate API key"
4. Copy your key (starts with `key...`)

#### 2. Get Base ID

1. Open MetricMule's Airtable base
2. Look at the URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
3. The `appXXXXXXXXXXXXXX` is your Base ID

#### 3. Get Table Name

1. In Airtable, look at the tab names at the bottom
2. Common names: "Prompts", "Prompt Library", "Master Prompts"
3. Default in USP: "Prompts"

### Setup

Create `.env` file in project root:

```bash
cp .env.usp.example .env
```

Edit `.env`:

```env
AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TABLE_NAME=Prompts
```

### Usage Examples

```bash
# Basic API scrape
python -m usp.cli scrape metricmule --method api \
  --api-key keyXXXXXXXXXXXXXX \
  --base-id appXXXXXXXXXXXXXX \
  --limit 50 \
  --export json

# Using .env (recommended)
# After setting up .env, credentials are auto-loaded
python -m usp.cli scrape metricmule --method api --limit 100 --export csv

# Specify table name
python -m usp.cli scrape metricmule --method api \
  --api-key keyXXX \
  --base-id appXXX \
  --table-name "Master Prompts" \
  --limit 50
```

### Python API Usage

```python
from usp.core.scraper_host import ScraperHost
from usp.core.protocol import PromptRequest, ScrapeMethod
from usp.scrapers.metricmule_combined import MetricMuleCombinedScraper
from usp.config import config

# Setup with credentials from .env
host = ScraperHost()
host.register_scraper(MetricMuleCombinedScraper(
    api_key=config.airtable_api_key,
    base_id=config.airtable_base_id
))

# Create request
request = PromptRequest(
    source="metricmule",
    method=ScrapeMethod.API,
    api_key=config.airtable_api_key,
    limit=100
)
request.params["base_id"] = config.airtable_base_id
request.params["table_name"] = "Prompts"

# Execute
response = host.scrape(request)
print(f"Scraped {response.scraped_count} prompts")
```

### Field Mapping

The scraper maps Airtable fields to PromptData:

```python
Airtable Field      → PromptData Field
─────────────────────────────────────
"Title"             → title
"Prompt"            → full_text
"Category"          → category
"Difficulty"        → difficulty
"Tags"              → tags
"Author"            → author
"Video URL"         → video_url
"URL"               → source_url
```

If your Airtable uses different field names, edit `usp/scrapers/metricmule_airtable.py`.

### Pros & Cons

✅ **Pros**:
- Much faster than web scraping
- More reliable (structured data)
- Gets exact data as stored

❌ **Cons**:
- Requires authentication
- Needs base access
- Limited by Airtable rate limits (5 req/sec)

## 🔀 Method 3: Hybrid (Best of Both)

Combines web and API for maximum coverage.

### Setup

Same as Airtable API (requires credentials).

### Usage

```bash
python -m usp.cli scrape metricmule --method hybrid \
  --api-key keyXXX \
  --base-id appXXX \
  --limit 200 \
  --export json
```

### How It Works

1. **Web Scrape**: Gets all prompts from website
2. **Airtable API**: Gets all prompts from Airtable
3. **Merge**: Combines and deduplicates
4. **Return**: Returns combined results

### Deduplication

Prompts are deduplicated by `full_text` field:

```python
# If same prompt text appears in both sources,
# only one is kept (prefers Airtable version)
```

### Pros & Cons

✅ **Pros**:
- Maximum coverage
- Gets prompts from both sources
- Handles missing data gracefully

❌ **Cons**:
- Slowest method (does both)
- Requires Airtable credentials
- Most resource-intensive

## 📊 Comparison

| Feature | Web | API | Hybrid |
|---------|-----|-----|--------|
| Speed | Medium | Fast | Slow |
| Auth Required | ❌ | ✅ | ✅ |
| Reliability | Medium | High | High |
| Coverage | Public only | All with access | Maximum |
| Setup Time | 0 min | 5 min | 5 min |

## 🎯 Which Method Should I Use?

### Use Web Scraping If:
- You want to get started immediately
- You don't have Airtable access
- You only need public prompts
- You're testing the system

### Use Airtable API If:
- You have Airtable access
- You need fast, reliable scraping
- You need structured data
- You're doing production scraping

### Use Hybrid If:
- You want maximum coverage
- You have Airtable access
- You don't mind slower scraping
- You need to ensure you get everything

## 🔧 Advanced Configuration

### Custom Field Mapping

Edit `usp/scrapers/metricmule_airtable.py`:

```python
def _convert_record_to_prompt(self, record: Dict[str, Any]) -> Optional[PromptData]:
    fields = record.get("fields", {})

    # Customize field mapping here
    title = fields.get("Prompt Name")  # If your field is "Prompt Name"
    full_text = fields.get("Full Prompt Text")  # Custom field name
    # ... etc
```

### Custom Selectors (Web Scraping)

Edit `usp/scrapers/metricmule_web.py`:

```python
def _extract_prompts(self, soup: BeautifulSoup, limit: Optional[int] = None):
    # Add your custom CSS selectors
    selectors = [
        ".my-custom-prompt-class",
        "[data-prompt='true']",
        # ... etc
    ]
```

### Rate Limiting

For Airtable API:

```python
import time

# Add delay between requests
time.sleep(0.2)  # 5 requests per second
```

## 🐛 Troubleshooting

### "Airtable API key is required"

- Check your `.env` file
- Verify `AIRTABLE_API_KEY` is set
- Or pass `--api-key` explicitly

### "No prompts scraped" (Web)

Website structure changed:
1. Run with `--verbose`
2. Check what selectors are found
3. Update selectors in `metricmule_web.py`

### "Invalid base_id"

- Check the Airtable URL
- Make sure you copied the full `appXXXXXXXXXXXXXX`
- Verify you have access to this base

### "Table not found"

- Check the exact table name in Airtable (case-sensitive)
- Pass `--table-name "Your Table Name"`

### Rate Limit Errors

- Airtable: Max 5 requests/second
- Add delays in the code
- Use smaller batches

## 📚 Resources

- [Airtable API Documentation](https://airtable.com/developers/web/api/introduction)
- [Selenium Documentation](https://selenium-python.readthedocs.io/)
- [MetricMule Website](https://www.metricmule.com/prompts)

## 🎓 Next Steps

1. Try web scraping first: `python -m usp.cli scrape metricmule --method web --limit 10`
2. Set up Airtable credentials if available
3. Compare results from both methods
4. Choose the method that works best for you

---

For more help, see the [Quick Start Guide](./QUICK_START.md) or [Architecture](./USP_ARCHITECTURE.md).
