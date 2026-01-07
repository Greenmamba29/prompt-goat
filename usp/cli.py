#!/usr/bin/env python3
"""
USP Command Line Interface

Usage:
    python -m usp.cli scrape metricmule --limit 100 --export csv
    python -m usp.cli scrape metricmule --method api --api-key YOUR_KEY
    python -m usp.cli list-scrapers
    python -m usp.cli capabilities metricmule
"""

import argparse
import sys
import logging
from pathlib import Path
from datetime import datetime

from .core.scraper_host import ScraperHost
from .core.protocol import PromptRequest, ScrapeMethod
from .scrapers.metricmule_combined import MetricMuleCombinedScraper
from .exporters import CSVExporter, JSONExporter, AirtableExporter


def setup_logging(verbose: bool = False):
    """Setup logging configuration."""
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )


def create_scraper_host() -> ScraperHost:
    """Create and configure the scraper host with all scrapers."""
    host = ScraperHost()

    # Register MetricMule scraper
    metricmule = MetricMuleCombinedScraper()
    host.register_scraper(metricmule)

    # Add more scrapers here as they're implemented
    # host.register_scraper(FlowGPTScraper())
    # host.register_scraper(PromptBaseScraper())

    return host


def cmd_list_scrapers(args, host: ScraperHost):
    """List all available scrapers."""
    scrapers = host.list_scrapers()
    print("\n🔌 Available Scrapers:")
    print("=" * 60)

    if not scrapers:
        print("No scrapers registered.")
        return

    for scraper_name in scrapers:
        caps = host.get_capabilities(scraper_name)
        print(f"\n📦 {caps.name}")
        print(f"   Description: {caps.description}")
        print(f"   Methods: {', '.join([m.value for m in caps.methods])}")
        print(f"   Pagination: {'✓' if caps.supports_pagination else '✗'}")
        print(f"   Filtering: {'✓' if caps.supports_filtering else '✗'}")
        print(f"   Search: {'✓' if caps.supports_search else '✗'}")
        print(f"   Auth Required: {'✓' if caps.requires_auth else '✗'}")

    print("\n" + "=" * 60)


def cmd_capabilities(args, host: ScraperHost):
    """Show capabilities for a specific scraper."""
    caps = host.get_capabilities(args.source)

    if not caps:
        print(f"❌ Scraper not found: {args.source}")
        print(f"Available scrapers: {', '.join(host.list_scrapers())}")
        return

    print(f"\n🔍 Capabilities for: {caps.name}")
    print("=" * 60)
    print(f"Description: {caps.description}")
    print(f"\nMethods: {', '.join([m.value for m in caps.methods])}")
    print(f"Supports Pagination: {'✓' if caps.supports_pagination else '✗'}")
    print(f"Supports Filtering: {'✓' if caps.supports_filtering else '✗'}")
    print(f"Supports Search: {'✓' if caps.supports_search else '✗'}")
    print(f"Auth Required: {'✓' if caps.requires_auth else '✗'}")

    if caps.max_results:
        print(f"Max Results: {caps.max_results}")
    if caps.rate_limit:
        print(f"Rate Limit: {caps.rate_limit} req/min")

    print("=" * 60 + "\n")


def cmd_scrape(args, host: ScraperHost):
    """Execute a scrape operation."""
    print(f"\n🚀 Starting scrape: {args.source}")
    print("=" * 60)

    # Parse method
    method = ScrapeMethod.WEB
    if args.method:
        try:
            method = ScrapeMethod(args.method.lower())
        except ValueError:
            print(f"❌ Invalid method: {args.method}")
            print(f"Valid methods: web, api, hybrid")
            return

    # Create request
    request = PromptRequest(
        source=args.source,
        method=method,
        limit=args.limit,
        offset=args.offset or 0,
        api_key=args.api_key,
        category=args.category,
        difficulty=args.difficulty
    )

    # Add custom parameters
    if args.base_id:
        request.params["base_id"] = args.base_id
    if args.table_name:
        request.params["table_name"] = args.table_name

    # Execute scrape
    print(f"Method: {method.value}")
    print(f"Limit: {args.limit or 'unlimited'}")
    print(f"Offset: {request.offset}")
    print()

    response = host.scrape(request)

    # Display results
    print("\n📊 Scrape Results:")
    print("=" * 60)
    print(f"Success: {'✓' if response.success else '✗'}")
    print(f"Scraped: {response.scraped_count} prompts")
    print(f"Total Available: {response.total_count}")

    if response.errors:
        print(f"\n❌ Errors:")
        for error in response.errors:
            print(f"   - {error}")

    if response.warnings:
        print(f"\n⚠️  Warnings:")
        for warning in response.warnings:
            print(f"   - {warning}")

    # Export if requested
    if args.export and response.success and response.prompts:
        export_data(response, args)

    print("=" * 60 + "\n")


def export_data(response, args):
    """Export scraped data to file."""
    print(f"\n💾 Exporting to {args.export.upper()} format...")

    # Generate output filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_dir = Path(args.output_dir or "usp_exports")
    output_dir.mkdir(parents=True, exist_ok=True)

    export_format = args.export.lower()
    filename = f"{args.source}_{timestamp}.{export_format}"
    output_path = output_dir / filename

    # Export based on format
    success = False

    if export_format == "csv":
        exporter = CSVExporter(include_metadata=args.include_metadata)
        success = exporter.export_response(response, str(output_path))

    elif export_format == "json":
        exporter = JSONExporter(pretty=True)
        success = exporter.export_response(response, str(output_path))

    elif export_format == "jsonl":
        exporter = JSONExporter()
        success = exporter.export_jsonl(response.prompts, str(output_path))

    elif export_format == "airtable":
        exporter = AirtableExporter()
        success = exporter.export_response(response, str(output_path))

    elif export_format == "airtable-csv":
        exporter = AirtableExporter()
        filename = f"{args.source}_{timestamp}.csv"
        output_path = output_dir / filename
        success = exporter.export_csv_for_airtable(response.prompts, str(output_path))

    if success:
        print(f"✓ Exported to: {output_path}")
    else:
        print(f"✗ Export failed")


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="Universal Scraper Protocol (USP) - Command Line Interface",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # List available scrapers
  python -m usp.cli list-scrapers

  # Show capabilities
  python -m usp.cli capabilities metricmule

  # Scrape with web method
  python -m usp.cli scrape metricmule --limit 100 --export csv

  # Scrape with API method
  python -m usp.cli scrape metricmule --method api --api-key YOUR_KEY --base-id YOUR_BASE

  # Scrape with hybrid method
  python -m usp.cli scrape metricmule --method hybrid --limit 200 --export json
        """
    )

    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Enable verbose logging"
    )

    subparsers = parser.add_subparsers(dest="command", help="Commands")

    # list-scrapers command
    subparsers.add_parser(
        "list-scrapers",
        help="List all available scrapers"
    )

    # capabilities command
    cap_parser = subparsers.add_parser(
        "capabilities",
        help="Show capabilities for a scraper"
    )
    cap_parser.add_argument("source", help="Source name (e.g., metricmule)")

    # scrape command
    scrape_parser = subparsers.add_parser(
        "scrape",
        help="Scrape prompts from a source"
    )
    scrape_parser.add_argument("source", help="Source to scrape (e.g., metricmule)")
    scrape_parser.add_argument("--method", choices=["web", "api", "hybrid"], help="Scraping method")
    scrape_parser.add_argument("--limit", type=int, help="Maximum number of prompts to scrape")
    scrape_parser.add_argument("--offset", type=int, help="Starting offset for pagination")
    scrape_parser.add_argument("--category", help="Filter by category")
    scrape_parser.add_argument("--difficulty", choices=["beginner", "intermediate", "advanced"], help="Filter by difficulty")
    scrape_parser.add_argument("--api-key", help="API key for authentication")
    scrape_parser.add_argument("--base-id", help="Airtable base ID")
    scrape_parser.add_argument("--table-name", help="Airtable table name")
    scrape_parser.add_argument("--export", choices=["csv", "json", "jsonl", "airtable", "airtable-csv"], help="Export format")
    scrape_parser.add_argument("--output-dir", help="Output directory for exports (default: usp_exports)")
    scrape_parser.add_argument("--include-metadata", action="store_true", help="Include metadata in exports")

    args = parser.parse_args()

    # Setup logging
    setup_logging(args.verbose)

    # Create scraper host
    host = create_scraper_host()

    # Execute command
    if args.command == "list-scrapers":
        cmd_list_scrapers(args, host)
    elif args.command == "capabilities":
        cmd_capabilities(args, host)
    elif args.command == "scrape":
        cmd_scrape(args, host)
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
