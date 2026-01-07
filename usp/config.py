"""
USP Configuration

Manages configuration from environment variables and config files.
"""

import os
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv


class Config:
    """Configuration manager for USP."""

    def __init__(self, env_file: Optional[str] = None):
        """
        Initialize configuration.

        Args:
            env_file: Path to .env file (optional)
        """
        # Load .env file if provided or if default exists
        if env_file:
            load_dotenv(env_file)
        else:
            # Try to load from common locations
            for location in [".env", "../.env", "../../.env"]:
                env_path = Path(location)
                if env_path.exists():
                    load_dotenv(env_path)
                    break

    @property
    def airtable_api_key(self) -> Optional[str]:
        """Get Airtable API key from environment."""
        return os.getenv("AIRTABLE_API_KEY")

    @property
    def airtable_base_id(self) -> Optional[str]:
        """Get Airtable base ID from environment."""
        return os.getenv("AIRTABLE_BASE_ID")

    @property
    def airtable_table_name(self) -> str:
        """Get Airtable table name from environment."""
        return os.getenv("AIRTABLE_TABLE_NAME", "Prompts")

    @property
    def selenium_headless(self) -> bool:
        """Get Selenium headless mode setting."""
        return os.getenv("SELENIUM_HEADLESS", "true").lower() == "true"

    @property
    def export_dir(self) -> str:
        """Get default export directory."""
        return os.getenv("USP_EXPORT_DIR", "usp_exports")

    @property
    def log_level(self) -> str:
        """Get logging level."""
        return os.getenv("USP_LOG_LEVEL", "INFO")

    def get(self, key: str, default: Optional[str] = None) -> Optional[str]:
        """
        Get a configuration value.

        Args:
            key: Configuration key
            default: Default value if not found

        Returns:
            Configuration value or default
        """
        return os.getenv(key, default)

    def __repr__(self) -> str:
        """String representation."""
        return f"<Config airtable={'configured' if self.airtable_api_key else 'not configured'}>"


# Global config instance
config = Config()
