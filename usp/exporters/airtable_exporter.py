"""
Airtable Exporter

Exports scraped prompts to Airtable-compatible JSON format.
"""

import json
from typing import List, Dict, Any
from pathlib import Path

from ..core.schema import PromptData
from ..core.protocol import PromptResponse


class AirtableExporter:
    """Exports prompts to Airtable-compatible format."""

    def __init__(self):
        """Initialize Airtable exporter."""
        pass

    def export(
        self,
        prompts: List[PromptData],
        output_path: str
    ) -> bool:
        """
        Export prompts to Airtable-compatible JSON.

        The output format is structured for easy import into Airtable:
        {
            "records": [
                {
                    "fields": {
                        "Title": "...",
                        "Prompt": "...",
                        ...
                    }
                }
            ]
        }

        Args:
            prompts: List of PromptData objects
            output_path: Path to output JSON file

        Returns:
            True if successful, False otherwise
        """
        try:
            # Convert to Airtable format
            records = []
            for prompt in prompts:
                record = {
                    "fields": self._convert_to_airtable_fields(prompt)
                }
                records.append(record)

            data = {
                "records": records,
                "typecast": True  # Automatically convert field types
            }

            # Write JSON
            output_file = Path(output_path)
            output_file.parent.mkdir(parents=True, exist_ok=True)

            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)

            return True

        except Exception as e:
            print(f"Airtable export failed: {str(e)}")
            return False

    def _convert_to_airtable_fields(self, prompt: PromptData) -> Dict[str, Any]:
        """
        Convert PromptData to Airtable fields.

        Args:
            prompt: PromptData object

        Returns:
            Dictionary of Airtable fields
        """
        fields = {
            "ID": prompt.id,
            "Title": prompt.title,
            "Prompt": prompt.full_text,
            "Source URL": prompt.source_url,
            "Source Platform": prompt.source_platform,
            "Is Free": prompt.is_free
        }

        # Add optional fields if they exist
        if prompt.category:
            fields["Category"] = prompt.category

        if prompt.difficulty:
            fields["Difficulty"] = prompt.difficulty

        if prompt.tags:
            # Airtable can handle arrays for multi-select fields
            fields["Tags"] = prompt.tags

        if prompt.author:
            fields["Author"] = prompt.author

        if prompt.created_at:
            fields["Created At"] = prompt.created_at

        if prompt.video_url:
            fields["Video URL"] = prompt.video_url

        if prompt.estimated_tokens:
            fields["Estimated Tokens"] = prompt.estimated_tokens

        # Add metadata as JSON string
        if prompt.metadata:
            fields["Metadata"] = json.dumps(prompt.metadata)

        return fields

    def export_response(
        self,
        response: PromptResponse,
        output_path: str
    ) -> bool:
        """
        Export PromptResponse to Airtable format.

        Args:
            response: PromptResponse object
            output_path: Path to output JSON file

        Returns:
            True if successful, False otherwise
        """
        return self.export(response.prompts, output_path)

    def export_csv_for_airtable(
        self,
        prompts: List[PromptData],
        output_path: str
    ) -> bool:
        """
        Export to CSV format optimized for Airtable import.

        Args:
            prompts: List of PromptData objects
            output_path: Path to output CSV file

        Returns:
            True if successful, False otherwise
        """
        try:
            import csv

            output_file = Path(output_path)
            output_file.parent.mkdir(parents=True, exist_ok=True)

            # Airtable-friendly column names
            columns = [
                "ID",
                "Title",
                "Prompt",
                "Category",
                "Difficulty",
                "Tags",
                "Author",
                "Created At",
                "Video URL",
                "Estimated Tokens",
                "Is Free",
                "Source URL",
                "Source Platform"
            ]

            with open(output_file, "w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=columns)
                writer.writeheader()

                for prompt in prompts:
                    row = {
                        "ID": prompt.id,
                        "Title": prompt.title,
                        "Prompt": prompt.full_text,
                        "Category": prompt.category or "",
                        "Difficulty": prompt.difficulty or "",
                        "Tags": ", ".join(prompt.tags) if prompt.tags else "",
                        "Author": prompt.author or "",
                        "Created At": prompt.created_at or "",
                        "Video URL": prompt.video_url or "",
                        "Estimated Tokens": prompt.estimated_tokens or "",
                        "Is Free": "Yes" if prompt.is_free else "No",
                        "Source URL": prompt.source_url,
                        "Source Platform": prompt.source_platform
                    }
                    writer.writerow(row)

            return True

        except Exception as e:
            print(f"Airtable CSV export failed: {str(e)}")
            return False
