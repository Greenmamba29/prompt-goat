#!/usr/bin/env python3
"""
Basic test to verify USP components work.
"""

import sys

def test_imports():
    """Test all imports work."""
    print("Testing imports...")
    from usp.core.protocol import PromptRequest, PromptResponse, ScraperCapabilities, ScrapeMethod
    from usp.core.schema import PromptData, PromptSchema
    from usp.core.base_scraper import BaseScraper
    from usp.core.scraper_host import ScraperHost
    from usp.scrapers.metricmule_combined import MetricMuleCombinedScraper
    from usp.exporters import CSVExporter, JSONExporter, AirtableExporter
    print("✓ All imports successful")

def test_schema():
    """Test PromptData schema."""
    print("\nTesting schema...")
    from usp.core.schema import PromptData

    prompt = PromptData(
        id="test_1",
        title="Test Prompt",
        full_text="This is a test prompt for USP",
        source_url="https://example.com",
        source_platform="test",
        category="testing",
        tags=["test", "usp"]
    )

    # Test validation
    is_valid, errors = prompt.validate()
    assert is_valid, f"Validation failed: {errors}"

    # Test serialization
    data_dict = prompt.to_dict()
    assert data_dict["title"] == "Test Prompt"

    # Test deserialization
    prompt2 = PromptData.from_dict(data_dict)
    assert prompt2.title == prompt.title

    print("✓ Schema validation works")

def test_protocol():
    """Test protocol objects."""
    print("\nTesting protocol...")
    from usp.core.protocol import PromptRequest, PromptResponse, ScrapeMethod
    from usp.core.schema import PromptData

    # Test request
    request = PromptRequest(
        source="test",
        method=ScrapeMethod.WEB,
        limit=10
    )
    assert request.source == "test"
    assert request.method == ScrapeMethod.WEB

    # Test response
    response = PromptResponse(success=True)
    test_prompt = PromptData(
        id="test_1",
        title="Test",
        full_text="Test prompt",
        source_url="https://example.com",
        source_platform="test"
    )
    response.add_prompt(test_prompt)
    assert response.scraped_count == 1
    assert len(response.prompts) == 1

    print("✓ Protocol objects work")

def test_scraper_host():
    """Test scraper host."""
    print("\nTesting scraper host...")
    from usp.core.scraper_host import ScraperHost
    from usp.scrapers.metricmule_combined import MetricMuleCombinedScraper

    host = ScraperHost()
    host.register_scraper(MetricMuleCombinedScraper())

    # Test registration
    scrapers = host.list_scrapers()
    assert "metricmule" in scrapers

    # Test capabilities
    caps = host.get_capabilities("metricmule")
    assert caps is not None
    assert caps.name == "metricmule"

    print("✓ Scraper host works")

def test_exporters():
    """Test exporters."""
    print("\nTesting exporters...")
    from usp.core.schema import PromptData
    from usp.exporters import JSONExporter
    import json
    import os

    # Create test data
    prompts = [
        PromptData(
            id="test_1",
            title="Test Prompt 1",
            full_text="This is test prompt 1",
            source_url="https://example.com/1",
            source_platform="test"
        ),
        PromptData(
            id="test_2",
            title="Test Prompt 2",
            full_text="This is test prompt 2",
            source_url="https://example.com/2",
            source_platform="test"
        )
    ]

    # Test JSON export
    exporter = JSONExporter()
    output_path = "/tmp/test_usp_export.json"
    success = exporter.export(prompts, output_path)
    assert success, "Export failed"
    assert os.path.exists(output_path), "Export file not created"

    # Verify content
    with open(output_path) as f:
        data = json.load(f)
        assert data["count"] == 2
        assert len(data["prompts"]) == 2

    # Clean up
    os.remove(output_path)

    print("✓ Exporters work")

def main():
    """Run all tests."""
    print("=" * 60)
    print("USP Basic Test Suite")
    print("=" * 60)

    try:
        test_imports()
        test_schema()
        test_protocol()
        test_scraper_host()
        test_exporters()

        print("\n" + "=" * 60)
        print("✓ All tests passed!")
        print("=" * 60)
        return 0

    except Exception as e:
        print(f"\n✗ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    sys.exit(main())
