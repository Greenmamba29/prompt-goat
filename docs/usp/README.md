# Universal Scraper Protocol (USP)

A Python-based extensible framework for extracting and normalizing prompts from various sources.

## 🎯 Overview

The Universal Scraper Protocol (USP) provides a standardized way to scrape, normalize, and export prompts from different platforms (MetricMule, FlowGPT, PromptBase, etc.) using a consistent API.

### Key Features

- ✅ **Unified Interface**: Single API for all scraping sources
- ✅ **Multiple Methods**: Web scraping (Selenium), API calls, or hybrid
- ✅ **Extensible**: Easy to add new scrapers
- ✅ **Multiple Exports**: CSV, JSON, JSONL, Airtable-ready formats
- ✅ **CLI Tool**: Command-line interface for easy usage
- ✅ **Type-Safe**: Standardized data schema with validation
- ✅ **Production-Ready**: Error handling, logging, pagination

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements-usp.txt
```

### 2. Setup (Optional for Airtable)

```bash
cp .env.usp.example .env
# Edit .env with your Airtable credentials (if using Airtable API)
```

### 3. Run Your First Scrape

```bash
# List available scrapers
python -m usp.cli list-scrapers

# Scrape MetricMule (web method)
python -m usp.cli scrape metricmule --limit 10 --export csv

# Scrape with Airtable API
python -m usp.cli scrape metricmule --method api --api-key YOUR_KEY --base-id YOUR_BASE --export json
```

## 📁 Project Structure

```
usp/
├── core/                      # Core protocol and base classes
│   ├── protocol.py            # Request/Response types
│   ├── schema.py              # Universal prompt data schema
│   ├── base_scraper.py        # Abstract base class for scrapers
│   └── scraper_host.py        # Routes requests to scrapers
├── scrapers/                  # Scraper implementations
│   ├── metricmule_web.py      # MetricMule web scraper
│   ├── metricmule_airtable.py # MetricMule Airtable API scraper
│   └── metricmule_combined.py # Combined orchestrator
├── exporters/                 # Export formats
│   ├── csv_exporter.py        # CSV export
│   ├── json_exporter.py       # JSON/JSONL export
│   └── airtable_exporter.py   # Airtable-ready format
├── utils/                     # Utilities
├── cli.py                     # Command-line interface
└── config.py                  # Configuration management
```

## 📚 Documentation

- [Architecture Overview](./USP_ARCHITECTURE.md) - System design and components
- [Quick Start Guide](./QUICK_START.md) - Get up and running fast
- [MetricMule Setup](./METRICMULE_SETUP.md) - MetricMule-specific instructions
- [Adding New Scrapers](./ADD_NEW_SCRAPER.md) - Developer guide

## 🔧 Usage Examples

### Command Line

```bash
# Scrape with web method (no auth required)
python -m usp.cli scrape metricmule --limit 100 --export csv

# Scrape with Airtable API (requires auth)
python -m usp.cli scrape metricmule --method api \
  --api-key YOUR_KEY \
  --base-id YOUR_BASE \
  --limit 50 \
  --export json

# Scrape with hybrid method (web + Airtable)
python -m usp.cli scrape metricmule --method hybrid \
  --limit 200 \
  --export airtable-csv

# Show scraper capabilities
python -m usp.cli capabilities metricmule
```

### Python API

```python
from usp.core.scraper_host import ScraperHost
from usp.core.protocol import PromptRequest, ScrapeMethod
from usp.scrapers.metricmule_combined import MetricMuleCombinedScraper
from usp.exporters import JSONExporter

# Create and configure host
host = ScraperHost()
host.register_scraper(MetricMuleCombinedScraper())

# Create request
request = PromptRequest(
    source="metricmule",
    method=ScrapeMethod.WEB,
    limit=100
)

# Execute scrape
response = host.scrape(request)

# Export results
if response.success:
    exporter = JSONExporter()
    exporter.export_response(response, "prompts.json")
    print(f"Scraped {response.scraped_count} prompts")
```

## 🎨 Data Schema

All prompts follow the `PromptData` schema:

```python
{
    "id": str,              # REQUIRED - unique identifier
    "title": str,           # REQUIRED - prompt title
    "full_text": str,       # REQUIRED - the actual prompt
    "source_url": str,      # REQUIRED - where it came from
    "source_platform": str, # REQUIRED - e.g., "metricmule"

    "category": str,        # OPTIONAL - e.g., "writing", "coding"
    "difficulty": str,      # OPTIONAL - "beginner", "intermediate", "advanced"
    "tags": List[str],      # OPTIONAL
    "author": str,          # OPTIONAL
    "created_at": str,      # OPTIONAL - ISO timestamp
    "video_url": str,       # OPTIONAL - tutorial video
    "estimated_tokens": int,# OPTIONAL
    "is_free": bool,        # OPTIONAL
    "metadata": dict        # OPTIONAL - platform-specific fields
}
```

## 🔌 Available Scrapers

### MetricMule
- **Methods**: Web, API, Hybrid
- **Auth Required**: No (Web), Yes (API)
- **Features**: Pagination, Airtable integration
- **Status**: ✅ Implemented

### Coming Soon
- FlowGPT
- PromptBase
- Custom config-driven scrapers

## 🛠️ Development

### Adding a New Scraper

```python
from usp.core.base_scraper import BaseScraper
from usp.core.protocol import PromptRequest, PromptResponse, ScraperCapabilities, ScrapeMethod

class MyCustomScraper(BaseScraper):
    def get_capabilities(self) -> ScraperCapabilities:
        return ScraperCapabilities(
            name="mycustom",
            methods=[ScrapeMethod.WEB],
            supports_pagination=True,
            description="Scrapes from my custom source"
        )

    def scrape(self, request: PromptRequest) -> PromptResponse:
        response = self.create_response()
        # ... your scraping logic here
        return response

# Register with host
host.register_scraper(MyCustomScraper())
```

See [ADD_NEW_SCRAPER.md](./ADD_NEW_SCRAPER.md) for detailed guide.

## 🤝 Integration with DiscoverMate

The USP exports data in formats ready for import into your DiscoverMate database:

1. **CSV Export**: Import via Prisma seed scripts
2. **JSON Export**: Use in API endpoints (`/api/prompts/bulk`)
3. **Airtable Export**: Direct Airtable import

## ⚙️ Configuration

Configuration via `.env` file:

```env
# Airtable (optional, for API method)
AIRTABLE_API_KEY=your_key
AIRTABLE_BASE_ID=your_base
AIRTABLE_TABLE_NAME=Prompts

# Selenium
SELENIUM_HEADLESS=true

# Exports
USP_EXPORT_DIR=usp_exports
USP_LOG_LEVEL=INFO
```

## 📊 Export Formats

- **CSV**: Standard CSV with all fields
- **JSON**: Structured JSON with metadata
- **JSONL**: JSON Lines (one object per line)
- **Airtable JSON**: Ready for Airtable import
- **Airtable CSV**: CSV optimized for Airtable

## 🐛 Troubleshooting

### Selenium Issues

```bash
# Install ChromeDriver
pip install webdriver-manager

# Or manually download ChromeDriver matching your Chrome version
```

### Import Errors

```bash
# Make sure you're in the project root
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

### Airtable API Errors

- Check API key is valid
- Verify base ID is correct
- Ensure table name matches exactly

## 📝 License

Part of the PromptGoat/DiscoverMate project.

## 🙏 Credits

Built with:
- Selenium - Web automation
- BeautifulSoup4 - HTML parsing
- Requests - HTTP client

---

For questions or issues, see the main [PromptGoat repository](https://github.com/Greenmamba29/prompt-goat).
