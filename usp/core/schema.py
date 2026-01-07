"""
Universal Prompt Data Schema

This module defines the standardized schema for prompt data across all sources.
"""

from typing import List, Optional, Dict, Any
from dataclasses import dataclass, field, asdict
from datetime import datetime
import json


@dataclass
class PromptData:
    """
    Universal prompt data structure.

    This schema is designed to accommodate prompts from any source while
    maintaining consistency across the USP ecosystem.
    """

    # REQUIRED FIELDS
    id: str  # Unique identifier (format: {source}_{id})
    title: str  # Prompt title
    full_text: str  # The actual prompt content
    source_url: str  # Original URL
    source_platform: str  # Source identifier (e.g., "metricmule", "flowgpt")

    # OPTIONAL FIELDS
    category: Optional[str] = None  # E.g., "writing", "coding", "marketing"
    difficulty: Optional[str] = None  # "beginner", "intermediate", "advanced"
    tags: List[str] = field(default_factory=list)
    author: Optional[str] = None
    created_at: Optional[str] = None  # ISO 8601 timestamp
    video_url: Optional[str] = None  # Tutorial/demo video
    estimated_tokens: Optional[int] = None
    is_free: Optional[bool] = True
    metadata: Dict[str, Any] = field(default_factory=dict)  # Platform-specific data

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return asdict(self)

    def to_json(self) -> str:
        """Convert to JSON string."""
        return json.dumps(self.to_dict(), indent=2)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "PromptData":
        """Create from dictionary."""
        return cls(**data)

    def validate(self) -> tuple[bool, List[str]]:
        """
        Validate the prompt data.

        Returns:
            (is_valid, error_messages)
        """
        errors = []

        # Check required fields
        if not self.id:
            errors.append("Missing required field: id")
        if not self.title:
            errors.append("Missing required field: title")
        if not self.full_text:
            errors.append("Missing required field: full_text")
        if not self.source_url:
            errors.append("Missing required field: source_url")
        if not self.source_platform:
            errors.append("Missing required field: source_platform")

        # Validate difficulty if provided
        if self.difficulty and self.difficulty not in ["beginner", "intermediate", "advanced"]:
            errors.append(f"Invalid difficulty: {self.difficulty}")

        # Validate URL format
        if self.source_url and not (self.source_url.startswith("http://") or self.source_url.startswith("https://")):
            errors.append(f"Invalid URL format: {self.source_url}")

        return (len(errors) == 0, errors)


class PromptSchema:
    """Helper class for schema operations."""

    @staticmethod
    def get_required_fields() -> List[str]:
        """Get list of required field names."""
        return ["id", "title", "full_text", "source_url", "source_platform"]

    @staticmethod
    def get_optional_fields() -> List[str]:
        """Get list of optional field names."""
        return [
            "category", "difficulty", "tags", "author", "created_at",
            "video_url", "estimated_tokens", "is_free", "metadata"
        ]

    @staticmethod
    def get_all_fields() -> List[str]:
        """Get all field names."""
        return PromptSchema.get_required_fields() + PromptSchema.get_optional_fields()

    @staticmethod
    def create_empty() -> PromptData:
        """Create an empty prompt data object with required fields set to empty strings."""
        return PromptData(
            id="",
            title="",
            full_text="",
            source_url="",
            source_platform=""
        )
