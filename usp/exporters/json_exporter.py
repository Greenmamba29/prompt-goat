"""
JSON Exporter

Exports scraped prompts to JSON format.
"""

import json
from typing import List
from pathlib import Path

from ..core.schema import PromptData
from ..core.protocol import PromptResponse


class JSONExporter:
    """Exports prompts to JSON format."""

    def __init__(self, pretty: bool = True):
        """
        Initialize JSON exporter.

        Args:
            pretty: Use pretty printing with indentation (default: True)
        """
        self.pretty = pretty

    def export(
        self,
        prompts: List[PromptData],
        output_path: str
    ) -> bool:
        """
        Export prompts to JSON file.

        Args:
            prompts: List of PromptData objects
            output_path: Path to output JSON file

        Returns:
            True if successful, False otherwise
        """
        try:
            # Convert prompts to dictionaries
            data = {
                "count": len(prompts),
                "prompts": [p.to_dict() for p in prompts]
            }

            # Write JSON
            output_file = Path(output_path)
            output_file.parent.mkdir(parents=True, exist_ok=True)

            with open(output_file, "w", encoding="utf-8") as f:
                if self.pretty:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                else:
                    json.dump(data, f, ensure_ascii=False)

            return True

        except Exception as e:
            print(f"JSON export failed: {str(e)}")
            return False

    def export_response(
        self,
        response: PromptResponse,
        output_path: str,
        include_metadata: bool = True
    ) -> bool:
        """
        Export PromptResponse to JSON with full response data.

        Args:
            response: PromptResponse object
            output_path: Path to output JSON file
            include_metadata: Include response metadata (default: True)

        Returns:
            True if successful, False otherwise
        """
        try:
            # Create comprehensive response data
            data = {
                "success": response.success,
                "total_count": response.total_count,
                "scraped_count": response.scraped_count,
                "prompts": [p.to_dict() for p in response.prompts]
            }

            if include_metadata:
                data["metadata"] = response.metadata
                data["errors"] = response.errors
                data["warnings"] = response.warnings

            # Write JSON
            output_file = Path(output_path)
            output_file.parent.mkdir(parents=True, exist_ok=True)

            with open(output_file, "w", encoding="utf-8") as f:
                if self.pretty:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                else:
                    json.dump(data, f, ensure_ascii=False)

            return True

        except Exception as e:
            print(f"JSON export failed: {str(e)}")
            return False

    def export_jsonl(
        self,
        prompts: List[PromptData],
        output_path: str
    ) -> bool:
        """
        Export prompts to JSONL format (one JSON object per line).

        Args:
            prompts: List of PromptData objects
            output_path: Path to output JSONL file

        Returns:
            True if successful, False otherwise
        """
        try:
            output_file = Path(output_path)
            output_file.parent.mkdir(parents=True, exist_ok=True)

            with open(output_file, "w", encoding="utf-8") as f:
                for prompt in prompts:
                    f.write(json.dumps(prompt.to_dict(), ensure_ascii=False) + "\n")

            return True

        except Exception as e:
            print(f"JSONL export failed: {str(e)}")
            return False
