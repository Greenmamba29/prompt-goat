"""
CSV Exporter

Exports scraped prompts to CSV format.
"""

import csv
from typing import List
from pathlib import Path

from ..core.schema import PromptData
from ..core.protocol import PromptResponse


class CSVExporter:
    """Exports prompts to CSV format."""

    def __init__(self, include_metadata: bool = False):
        """
        Initialize CSV exporter.

        Args:
            include_metadata: Include metadata column in CSV (default: False)
        """
        self.include_metadata = include_metadata

    def export(
        self,
        prompts: List[PromptData],
        output_path: str,
        delimiter: str = ","
    ) -> bool:
        """
        Export prompts to CSV file.

        Args:
            prompts: List of PromptData objects
            output_path: Path to output CSV file
            delimiter: CSV delimiter (default: comma)

        Returns:
            True if successful, False otherwise
        """
        try:
            # Define columns
            columns = [
                "id",
                "title",
                "full_text",
                "category",
                "difficulty",
                "tags",
                "author",
                "created_at",
                "video_url",
                "estimated_tokens",
                "is_free",
                "source_url",
                "source_platform"
            ]

            if self.include_metadata:
                columns.append("metadata")

            # Write CSV
            output_file = Path(output_path)
            output_file.parent.mkdir(parents=True, exist_ok=True)

            with open(output_file, "w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=columns, delimiter=delimiter)
                writer.writeheader()

                for prompt in prompts:
                    row = {
                        "id": prompt.id,
                        "title": prompt.title,
                        "full_text": prompt.full_text,
                        "category": prompt.category or "",
                        "difficulty": prompt.difficulty or "",
                        "tags": "|".join(prompt.tags) if prompt.tags else "",
                        "author": prompt.author or "",
                        "created_at": prompt.created_at or "",
                        "video_url": prompt.video_url or "",
                        "estimated_tokens": prompt.estimated_tokens or "",
                        "is_free": prompt.is_free,
                        "source_url": prompt.source_url,
                        "source_platform": prompt.source_platform
                    }

                    if self.include_metadata:
                        row["metadata"] = str(prompt.metadata)

                    writer.writerow(row)

            return True

        except Exception as e:
            print(f"CSV export failed: {str(e)}")
            return False

    def export_response(
        self,
        response: PromptResponse,
        output_path: str,
        delimiter: str = ","
    ) -> bool:
        """
        Export PromptResponse to CSV.

        Args:
            response: PromptResponse object
            output_path: Path to output CSV file
            delimiter: CSV delimiter

        Returns:
            True if successful, False otherwise
        """
        return self.export(response.prompts, output_path, delimiter)
