# USP Quick Start Guide

Get up and running with the Universal Scraper Protocol in 5 minutes.

## 📋 Prerequisites

- Python 3.9 or higher
- Chrome or Chromium browser (for web scraping)
- pip (Python package manager)

## 🚀 Installation

### Step 1: Install Dependencies

```bash
# Navigate to project root
cd prompt-goat

# Install USP requirements
pip install -r requirements-usp.txt
```

This will install:
- `selenium` - Web automation
- `beautifulsoup4` - HTML parsing
- `requests` - HTTP client
- `webdriver-manager` - Automatic ChromeDriver management
- `python-dotenv` - Environment variables

### Step 2: Verify Installation

```bash
# Check if USP is accessible
python -m usp.cli --help
```

You should see the USP CLI help message.

## 🎯 Your First Scrape

### Option 1: Command Line (Easiest)

```bash
# List available scrapers
python -m usp.cli list-scrapers

# Scrape 10 prompts from MetricMule
python -m usp.cli scrape metricmule --limit 10 --export csv

# Check the output
ls usp_exports/
```

### Option 2: Python Script

Create `test_usp.py`:

```python
from usp.core.scraper_host import ScraperHost
from usp.core.protocol import PromptRequest, ScrapeMethod
from usp.scrapers.metricmule_combined import MetricMuleCombinedScraper

# Setup
host = ScraperHost()
host.register_scraper(MetricMuleCombinedScraper())

# Create request
request = PromptRequest(
    source="metricmule",
    method=ScrapeMethod.WEB,
    limit=10
)

# Execute
response = host.scrape(request)

# Results
print(f"Success: {response.success}")
print(f"Scraped: {response.scraped_count} prompts")

if response.prompts:
    print(f"\nFirst prompt: {response.prompts[0].title}")
```

Run it:

```bash
python test_usp.py
```

### Option 3: Run Example

```bash
python examples/metricmule_example.py
```

## 📊 Export Formats

### CSV Export

```bash
python -m usp.cli scrape metricmule --limit 50 --export csv
```

Output: `usp_exports/metricmule_TIMESTAMP.csv`

### JSON Export

```bash
python -m usp.cli scrape metricmule --limit 50 --export json
```

Output: `usp_exports/metricmule_TIMESTAMP.json`

### Airtable-Ready Export

```bash
# JSON format for Airtable import
python -m usp.cli scrape metricmule --limit 50 --export airtable

# CSV format for Airtable import
python -m usp.cli scrape metricmule --limit 50 --export airtable-csv
```

## 🔧 Common Tasks

### Scrape More Prompts

```bash
# Scrape 100 prompts
python -m usp.cli scrape metricmule --limit 100 --export json

# Scrape with pagination offset
python -m usp.cli scrape metricmule --limit 50 --offset 100 --export csv
```

### Check Scraper Capabilities

```bash
python -m usp.cli capabilities metricmule
```

Output:
```
🔍 Capabilities for: metricmule
============================================================
Description: Scrapes prompts from MetricMule using web and/or Airtable API
Methods: web, api, hybrid
Supports Pagination: ✓
Supports Filtering: ✓
Supports Search: ✗
Auth Required: ✗
============================================================
```

### Verbose Logging

```bash
python -m usp.cli scrape metricmule --limit 10 --export csv --verbose
```

## 🎨 Using Different Methods

### Web Scraping (Default)

No authentication required.

```bash
python -m usp.cli scrape metricmule --method web --limit 50 --export csv
```

### Airtable API

Requires Airtable credentials. See [METRICMULE_SETUP.md](./METRICMULE_SETUP.md) for details.

```bash
python -m usp.cli scrape metricmule \
  --method api \
  --api-key YOUR_AIRTABLE_KEY \
  --base-id YOUR_BASE_ID \
  --limit 50 \
  --export json
```

### Hybrid (Web + Airtable)

Combines both methods for comprehensive results.

```bash
python -m usp.cli scrape metricmule \
  --method hybrid \
  --api-key YOUR_AIRTABLE_KEY \
  --base-id YOUR_BASE_ID \
  --limit 100 \
  --export json
```

## 📝 Working with Exported Data

### CSV in Python

```python
import pandas as pd

df = pd.read_csv('usp_exports/metricmule_20260107_120000.csv')
print(df.head())
print(df['category'].value_counts())
```

### JSON in Python

```python
import json

with open('usp_exports/metricmule_20260107_120000.json') as f:
    data = json.load(f)

prompts = data['prompts']
print(f"Total: {len(prompts)}")

# Filter by category
coding_prompts = [p for p in prompts if p.get('category') == 'coding']
print(f"Coding prompts: {len(coding_prompts)}")
```

### Import to Airtable

1. Export with Airtable format:
   ```bash
   python -m usp.cli scrape metricmule --limit 100 --export airtable
   ```

2. In Airtable:
   - Go to your base
   - Click "Add or import" → "CSV file" or "JSON"
   - Upload the exported file
   - Map fields as needed

## 🐛 Troubleshooting

### "No module named 'usp'"

```bash
# Make sure you're in the project root
cd prompt-goat

# Set PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Or run with python -m
python -m usp.cli list-scrapers
```

### "WebDriver not found"

```bash
# Install webdriver-manager (should be in requirements)
pip install webdriver-manager

# Or manually install ChromeDriver
# Download from: https://chromedriver.chromium.org/
```

### "Selenium TimeoutException"

The website may be slow or blocking. Try:

```bash
# Increase timeout (edit metricmule_web.py)
# Or use API method instead
python -m usp.cli scrape metricmule --method api --api-key YOUR_KEY
```

### "No prompts scraped"

Website structure may have changed. Check:

```bash
# Run with verbose logging
python -m usp.cli scrape metricmule --limit 10 --export csv --verbose

# Check if selectors need updating in:
# usp/scrapers/metricmule_web.py
```

## 🎓 Next Steps

1. **Configure Airtable** (optional): [METRICMULE_SETUP.md](./METRICMULE_SETUP.md)
2. **Understand Architecture**: [USP_ARCHITECTURE.md](./USP_ARCHITECTURE.md)
3. **Add New Scrapers**: [ADD_NEW_SCRAPER.md](./ADD_NEW_SCRAPER.md)
4. **Integrate with DiscoverMate**: See main project README

## 💡 Tips

- **Start small**: Test with `--limit 10` first
- **Use exports**: Always export to save your data
- **Check capabilities**: Know what each scraper supports
- **Read logs**: Use `--verbose` for debugging
- **Respect rate limits**: Don't hammer servers

## 📚 Resources

- [Full Documentation](./README.md)
- [Architecture Guide](./USP_ARCHITECTURE.md)
- [Example Code](../../examples/metricmule_example.py)

---

Need help? Check the [main repository](https://github.com/Greenmamba29/prompt-goat) or open an issue.
