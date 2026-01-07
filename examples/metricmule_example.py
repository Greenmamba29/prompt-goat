#!/usr/bin/env python3
"""
MetricMule Scraping Example

This example demonstrates how to use the USP to scrape prompts from MetricMule.
"""

import sys
from pathlib import Path

# Add parent directory to path to import usp
sys.path.insert(0, str(Path(__file__).parent.parent))

from usp.core.scraper_host import ScraperHost
from usp.core.protocol import PromptRequest, ScrapeMethod
from usp.scrapers.metricmule_combined import MetricMuleCombinedScraper
from usp.exporters import CSVExporter, JSONExporter, AirtableExporter


def example_web_scraping():
    """Example: Scrape MetricMule using web scraping."""
    print("\n" + "=" * 60)
    print("EXAMPLE 1: Web Scraping")
    print("=" * 60)

    # Create scraper host and register MetricMule
    host = ScraperHost()
    host.register_scraper(MetricMuleCombinedScraper(headless=True))

    # Create request
    request = PromptRequest(
        source="metricmule",
        method=ScrapeMethod.WEB,
        limit=10  # Scrape 10 prompts
    )

    # Execute scrape
    print("\n🚀 Scraping MetricMule (web method)...")
    response = host.scrape(request)

    # Display results
    print(f"\n✓ Success: {response.success}")
    print(f"✓ Scraped: {response.scraped_count} prompts")

    if response.prompts:
        print(f"\n📝 Sample prompt:")
        sample = response.prompts[0]
        print(f"   Title: {sample.title}")
        print(f"   Text: {sample.full_text[:100]}...")
        print(f"   Source: {sample.source_url}")

    return response


def example_export_csv(response):
    """Example: Export results to CSV."""
    print("\n" + "=" * 60)
    print("EXAMPLE 2: Export to CSV")
    print("=" * 60)

    exporter = CSVExporter()
    output_path = "usp_exports/metricmule_prompts.csv"

    print(f"\n💾 Exporting to: {output_path}")
    success = exporter.export_response(response, output_path)

    if success:
        print(f"✓ Export successful!")
    else:
        print(f"✗ Export failed")


def example_export_json(response):
    """Example: Export results to JSON."""
    print("\n" + "=" * 60)
    print("EXAMPLE 3: Export to JSON")
    print("=" * 60)

    exporter = JSONExporter(pretty=True)
    output_path = "usp_exports/metricmule_prompts.json"

    print(f"\n💾 Exporting to: {output_path}")
    success = exporter.export_response(response, output_path)

    if success:
        print(f"✓ Export successful!")
    else:
        print(f"✗ Export failed")


def example_export_airtable(response):
    """Example: Export results to Airtable format."""
    print("\n" + "=" * 60)
    print("EXAMPLE 4: Export to Airtable Format")
    print("=" * 60)

    exporter = AirtableExporter()
    output_path = "usp_exports/metricmule_airtable.json"

    print(f"\n💾 Exporting to Airtable format: {output_path}")
    success = exporter.export_response(response, output_path)

    if success:
        print(f"✓ Export successful!")
        print(f"📌 You can now import this file into Airtable")
    else:
        print(f"✗ Export failed")


def example_airtable_scraping():
    """Example: Scrape MetricMule using Airtable API (requires credentials)."""
    print("\n" + "=" * 60)
    print("EXAMPLE 5: Airtable API Scraping (Optional)")
    print("=" * 60)

    print("\n⚠️  This example requires Airtable credentials.")
    print("Set AIRTABLE_API_KEY and AIRTABLE_BASE_ID in .env file.")
    print("Skipping for now...")

    # Uncomment to use:
    # from usp.config import config
    #
    # if config.airtable_api_key and config.airtable_base_id:
    #     host = ScraperHost()
    #     host.register_scraper(MetricMuleCombinedScraper())
    #
    #     request = PromptRequest(
    #         source="metricmule",
    #         method=ScrapeMethod.API,
    #         api_key=config.airtable_api_key,
    #         limit=10
    #     )
    #     request.params["base_id"] = config.airtable_base_id
    #
    #     response = host.scrape(request)
    #     print(f"✓ Scraped {response.scraped_count} prompts from Airtable")


def example_list_capabilities():
    """Example: List scraper capabilities."""
    print("\n" + "=" * 60)
    print("EXAMPLE 6: Check Scraper Capabilities")
    print("=" * 60)

    host = ScraperHost()
    host.register_scraper(MetricMuleCombinedScraper())

    caps = host.get_capabilities("metricmule")

    print(f"\n📦 MetricMule Scraper Capabilities:")
    print(f"   Name: {caps.name}")
    print(f"   Methods: {', '.join([m.value for m in caps.methods])}")
    print(f"   Pagination: {'✓' if caps.supports_pagination else '✗'}")
    print(f"   Filtering: {'✓' if caps.supports_filtering else '✗'}")
    print(f"   Description: {caps.description}")


def main():
    """Run all examples."""
    print("\n" + "=" * 60)
    print("USP MetricMule Examples")
    print("=" * 60)

    # Example 1: Web scraping
    response = example_web_scraping()

    if response and response.success and response.prompts:
        # Example 2-4: Exports
        example_export_csv(response)
        example_export_json(response)
        example_export_airtable(response)

    # Example 5: Airtable (optional)
    example_airtable_scraping()

    # Example 6: Capabilities
    example_list_capabilities()

    print("\n" + "=" * 60)
    print("✓ All examples complete!")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
