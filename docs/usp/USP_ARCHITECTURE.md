# USP Architecture

This document describes the architecture and design principles of the Universal Scraper Protocol.

## 🏗️ Overview

The USP follows a modular, layered architecture inspired by the Model Context Protocol (MCP):

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                        │
│  (CLI, Python API, Web Interface)                      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   PROTOCOL LAYER                        │
│  • PromptRequest/Response                              │
│  • Universal Schema                                     │
│  • ScraperCapabilities                                 │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    ROUTING LAYER                        │
│              ScraperHost                                │
│  • Routes requests to scrapers                         │
│  • Manages scraper registry                            │
│  • Validates requests                                   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   SCRAPER LAYER                         │
│  • BaseScraper (abstract)                              │
│  • MetricMule, FlowGPT, etc. (concrete)                │
│  • Web, API, Hybrid methods                            │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    EXPORT LAYER                         │
│  • CSV, JSON, JSONL                                     │
│  • Airtable formats                                     │
│  • Custom exporters                                     │
└─────────────────────────────────────────────────────────┘
```

## 🧩 Core Components

### 1. Protocol Layer (`core/protocol.py`)

**Purpose**: Define standard request/response structures

#### PromptRequest
```python
@dataclass
class PromptRequest:
    source: str              # Which platform to scrape
    method: ScrapeMethod     # WEB, API, or HYBRID
    limit: Optional[int]     # Pagination
    offset: Optional[int]
    # Filtering
    category: Optional[str]
    difficulty: Optional[str]
    # Auth
    api_key: Optional[str]
    # Custom params
    params: Dict[str, Any]
```

#### PromptResponse
```python
@dataclass
class PromptResponse:
    success: bool
    prompts: List[PromptData]
    total_count: int
    scraped_count: int
    errors: List[str]
    warnings: List[str]
    metadata: Dict[str, Any]
```

#### ScraperCapabilities
```python
@dataclass
class ScraperCapabilities:
    name: str
    methods: List[ScrapeMethod]
    supports_pagination: bool
    supports_filtering: bool
    supports_search: bool
    max_results: Optional[int]
    rate_limit: Optional[int]
    requires_auth: bool
```

### 2. Schema Layer (`core/schema.py`)

**Purpose**: Universal data structure for prompts

```python
@dataclass
class PromptData:
    # Required fields
    id: str
    title: str
    full_text: str
    source_url: str
    source_platform: str

    # Optional fields
    category: Optional[str]
    difficulty: Optional[str]
    tags: List[str]
    author: Optional[str]
    created_at: Optional[str]
    video_url: Optional[str]
    estimated_tokens: Optional[int]
    is_free: Optional[bool]
    metadata: Dict[str, Any]
```

**Design Decisions**:
- Required fields ensure data quality
- Optional fields accommodate different sources
- `metadata` dict for platform-specific data
- Validation method for data integrity

### 3. Base Scraper (`core/base_scraper.py`)

**Purpose**: Abstract base class for all scrapers

```python
class BaseScraper(ABC):
    @abstractmethod
    def get_capabilities(self) -> ScraperCapabilities:
        """Describe what this scraper can do"""
        pass

    @abstractmethod
    def scrape(self, request: PromptRequest) -> PromptResponse:
        """Execute the scrape"""
        pass

    def validate_request(self, request: PromptRequest) -> tuple[bool, List[str]]:
        """Validate request against capabilities"""
        pass
```

**Benefits**:
- Enforces consistent interface
- Built-in validation
- Logging helpers
- Error handling utilities

### 4. Scraper Host (`core/scraper_host.py`)

**Purpose**: Central registry and router

```python
class ScraperHost:
    def register_scraper(self, scraper: BaseScraper)
    def get_scraper(self, source: str) -> Optional[BaseScraper]
    def scrape(self, request: PromptRequest) -> PromptResponse
    def list_scrapers(self) -> List[str]
    def get_capabilities(self, source: str) -> ScraperCapabilities
```

**Responsibilities**:
- Maintain scraper registry
- Route requests to correct scraper
- Validate requests
- Handle errors gracefully

### 5. Scrapers (`scrapers/`)

**MetricMule Implementation**:

```
metricmule_web.py        # Selenium + BeautifulSoup
metricmule_airtable.py   # Airtable API
metricmule_combined.py   # Orchestrates both
```

**Design Pattern**: Strategy Pattern
- Different scraping strategies (web, API)
- Combined scraper orchestrates multiple strategies
- Easy to add new strategies

### 6. Exporters (`exporters/`)

**Purpose**: Convert scraped data to various formats

```python
class CSVExporter:
    def export(self, prompts: List[PromptData], output_path: str)

class JSONExporter:
    def export(self, prompts: List[PromptData], output_path: str)
    def export_jsonl(self, prompts: List[PromptData], output_path: str)

class AirtableExporter:
    def export(self, prompts: List[PromptData], output_path: str)
    def export_csv_for_airtable(self, prompts: List[PromptData], output_path: str)
```

**Design Pattern**: Adapter Pattern
- Adapt PromptData to different formats
- Each exporter knows its format's requirements

## 🔄 Data Flow

### Example: Web Scraping Flow

```
1. User: CLI command
   └─> python -m usp.cli scrape metricmule --limit 100

2. CLI: Parse arguments, create request
   └─> PromptRequest(source="metricmule", method=WEB, limit=100)

3. ScraperHost: Route to scraper
   └─> Find MetricMuleCombinedScraper
   └─> Validate request against capabilities

4. Scraper: Execute scrape
   └─> Initialize Selenium WebDriver
   └─> Load page
   └─> Scroll for pagination
   └─> Parse HTML with BeautifulSoup
   └─> Extract prompt data
   └─> Convert to PromptData objects

5. Response: Return results
   └─> PromptResponse(success=True, prompts=[...], scraped_count=100)

6. Export: Save to file
   └─> CSVExporter.export(prompts, "output.csv")
```

## 🎯 Design Principles

### 1. Separation of Concerns
- Protocol layer independent of implementation
- Scrapers don't know about exporters
- CLI separate from core logic

### 2. Open/Closed Principle
- Open for extension (new scrapers)
- Closed for modification (core protocol stable)

### 3. Dependency Inversion
- High-level modules don't depend on low-level
- Both depend on abstractions (BaseScraper)

### 4. Single Responsibility
- Each class has one reason to change
- ScraperHost only routes
- Scrapers only scrape
- Exporters only export

### 5. Fail Fast with Grace
- Validate early (request validation)
- Log errors
- Return structured error responses
- Never crash silently

## 🔌 Extensibility

### Adding a New Scraper

```python
# 1. Create scraper class
class FlowGPTScraper(BaseScraper):
    def get_capabilities(self):
        return ScraperCapabilities(
            name="flowgpt",
            methods=[ScrapeMethod.WEB],
            supports_pagination=True
        )

    def scrape(self, request):
        response = self.create_response()
        # ... scraping logic
        return response

# 2. Register with host
host.register_scraper(FlowGPTScraper())

# 3. Use immediately
request = PromptRequest(source="flowgpt", limit=50)
response = host.scrape(request)
```

### Adding a New Export Format

```python
class MarkdownExporter:
    def export(self, prompts: List[PromptData], output_path: str):
        with open(output_path, 'w') as f:
            for prompt in prompts:
                f.write(f"# {prompt.title}\n\n")
                f.write(f"{prompt.full_text}\n\n")
                f.write("---\n\n")
```

## 🔒 Error Handling Strategy

### Levels of Error Handling

1. **Request Validation** (before scraping)
   - Invalid source
   - Unsupported method
   - Missing auth
   - Returns: `PromptResponse(success=False, errors=[...])`

2. **Scraping Errors** (during scraping)
   - Network failures
   - Parsing errors
   - Element not found
   - Logged and added to response.errors

3. **Export Errors** (during export)
   - File write errors
   - Invalid path
   - Returns: boolean success

### Example Error Flow

```python
# Invalid request
request = PromptRequest(source="nonexistent", limit=10)
response = host.scrape(request)
# response.success = False
# response.errors = ["No scraper registered for source: nonexistent"]

# Scraping error
# Network fails mid-scrape
# response.success = False
# response.errors = ["Scraping failed: Connection timeout"]
# response.scraped_count = 45  # Partial results
```

## 📊 Performance Considerations

### Pagination Strategy
- Configurable limits
- Offset-based pagination
- Scroll-based loading for web

### Rate Limiting
- Declared in capabilities
- Implemented per-scraper
- Can use `time.sleep()` or `ratelimit` library

### Memory Management
- Stream large datasets
- Process in batches
- Don't load everything into memory

### Caching (Future)
- Cache capabilities
- Cache parsed HTML (optional)
- Invalidate on schedule

## 🧪 Testing Strategy

### Unit Tests
- Test each scraper independently
- Mock HTTP requests
- Test validation logic

### Integration Tests
- Test full scrape flow
- Test with real data (small samples)
- Test exports

### E2E Tests
- CLI commands
- Full scrape + export pipeline

## 🚀 Future Enhancements

### Phase 2
- [ ] Claude validation pipeline
- [ ] Config-driven scrapers (YAML)
- [ ] More scrapers (FlowGPT, PromptBase)
- [ ] Direct database integration

### Phase 3
- [ ] Async/parallel scraping
- [ ] Distributed scraping
- [ ] Web UI dashboard
- [ ] Real-time monitoring

### Phase 4
- [ ] ML-based prompt classification
- [ ] Deduplication with fuzzy matching
- [ ] Quality scoring
- [ ] Trending detection

## 📚 References

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Selenium Documentation](https://selenium-python.readthedocs.io/)
- [BeautifulSoup Documentation](https://beautiful-soup-4.readthedocs.io/)

---

Last Updated: 2026-01-07
