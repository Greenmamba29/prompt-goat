"""
MetricMule Airtable API Scraper

Scrapes prompts from MetricMule's Airtable database using the Airtable API.
"""

import requests
from typing import List, Optional, Dict, Any

from ..core.base_scraper import BaseScraper
from ..core.protocol import PromptRequest, PromptResponse, ScraperCapabilities, ScrapeMethod
from ..core.schema import PromptData


class MetricMuleAirtableScraper(BaseScraper):
    """
    Scrapes prompts from MetricMule's Airtable database.

    Requires Airtable credentials in the request or environment.
    """

    def __init__(self, base_id: Optional[str] = None, api_key: Optional[str] = None):
        """
        Initialize the Airtable scraper.

        Args:
            base_id: Airtable base ID (optional, can be provided in request)
            api_key: Airtable API key (optional, can be provided in request)
        """
        super().__init__()
        self.base_id = base_id
        self.api_key = api_key

    def get_capabilities(self) -> ScraperCapabilities:
        """Return scraper capabilities."""
        return ScraperCapabilities(
            name="metricmule",
            methods=[ScrapeMethod.API],
            supports_pagination=True,
            supports_filtering=True,
            supports_search=False,
            max_results=None,
            rate_limit=5,  # Airtable: 5 requests per second
            requires_auth=True,
            description="Scrapes prompts from MetricMule's Airtable database via API"
        )

    def scrape(self, request: PromptRequest) -> PromptResponse:
        """
        Scrape prompts from Airtable.

        Args:
            request: PromptRequest with parameters

        Returns:
            PromptResponse with scraped prompts
        """
        response = self.create_response()

        # Get credentials
        api_key = request.api_key or self.api_key
        base_id = request.params.get("base_id") or self.base_id
        table_name = request.params.get("table_name", "Prompts")

        if not api_key:
            return self.create_error_response("Airtable API key is required")
        if not base_id:
            return self.create_error_response("Airtable base_id is required")

        try:
            # Fetch records from Airtable
            records = self._fetch_records(
                api_key=api_key,
                base_id=base_id,
                table_name=table_name,
                limit=request.limit,
                offset=request.offset
            )

            # Convert to PromptData
            for record in records:
                prompt_data = self._convert_record_to_prompt(record)
                if prompt_data:
                    response.add_prompt(prompt_data)

            response.success = True
            response.total_count = len(records)
            self.log_info(f"Successfully scraped {len(records)} prompts from Airtable")

        except Exception as e:
            self.log_error(f"Airtable scraping failed: {str(e)}")
            response.success = False
            response.add_error(f"Airtable scraping failed: {str(e)}")

        return response

    def _fetch_records(
        self,
        api_key: str,
        base_id: str,
        table_name: str,
        limit: Optional[int] = None,
        offset: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """
        Fetch records from Airtable.

        Args:
            api_key: Airtable API key
            base_id: Airtable base ID
            table_name: Table name
            limit: Max number of records
            offset: Starting offset

        Returns:
            List of record dictionaries
        """
        url = f"https://api.airtable.com/v0/{base_id}/{table_name}"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        all_records = []
        airtable_offset = None

        while True:
            params = {}
            if limit and len(all_records) >= limit:
                break
            if airtable_offset:
                params["offset"] = airtable_offset

            # Make request
            self.log_info(f"Fetching from Airtable: {url}")
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()

            data = response.json()
            records = data.get("records", [])
            all_records.extend(records)

            # Check for more pages
            airtable_offset = data.get("offset")
            if not airtable_offset or (limit and len(all_records) >= limit):
                break

        # Apply offset and limit
        if offset:
            all_records = all_records[offset:]
        if limit:
            all_records = all_records[:limit]

        return all_records

    def _convert_record_to_prompt(self, record: Dict[str, Any]) -> Optional[PromptData]:
        """
        Convert an Airtable record to PromptData.

        Args:
            record: Airtable record dictionary

        Returns:
            PromptData object or None
        """
        try:
            fields = record.get("fields", {})
            record_id = record.get("id", "")

            # Map Airtable fields to PromptData
            # These field names are assumptions - adjust based on actual Airtable schema
            title = fields.get("Title") or fields.get("Name") or fields.get("Prompt Title", "Untitled")
            full_text = fields.get("Prompt") or fields.get("Full Text") or fields.get("Content", "")

            if not full_text or len(full_text) < 10:
                self.log_warning(f"Skipping record {record_id}: insufficient text")
                return None

            # Extract other fields
            category = fields.get("Category") or fields.get("Type")
            difficulty = fields.get("Difficulty") or fields.get("Level")
            tags = fields.get("Tags", [])
            if isinstance(tags, str):
                tags = [t.strip() for t in tags.split(",")]

            author = fields.get("Author") or fields.get("Creator")
            video_url = fields.get("Video URL") or fields.get("Tutorial Link")
            source_url = fields.get("URL") or fields.get("Link") or "https://www.metricmule.com/prompts"

            # Create PromptData
            prompt_id = f"metricmule_airtable_{record_id}"

            return PromptData(
                id=prompt_id,
                title=title,
                full_text=full_text,
                source_url=source_url,
                source_platform="metricmule",
                category=category,
                difficulty=difficulty,
                tags=tags,
                author=author,
                video_url=video_url,
                is_free=True,
                metadata={
                    "scrape_method": "airtable",
                    "airtable_id": record_id,
                    "raw_fields": fields
                }
            )

        except Exception as e:
            self.log_error(f"Failed to convert record: {str(e)}")
            return None
