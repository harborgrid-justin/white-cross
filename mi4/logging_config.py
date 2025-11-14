"""
Centralized logging configuration for White Cross Orchestrator.

This module provides structured logging with both console and file outputs,
configurable log levels, and proper formatting for debugging and monitoring.
"""

import logging
import sys
from pathlib import Path
from typing import Optional
from logging.handlers import RotatingFileHandler


class ColoredFormatter(logging.Formatter):
    """Custom formatter with color support for console output."""

    # ANSI color codes
    COLORS = {
        'DEBUG': '\033[36m',      # Cyan
        'INFO': '\033[32m',       # Green
        'WARNING': '\033[33m',    # Yellow
        'ERROR': '\033[31m',      # Red
        'CRITICAL': '\033[35m',   # Magenta
    }
    RESET = '\033[0m'

    def format(self, record):
        # Add color to levelname
        if record.levelname in self.COLORS:
            record.levelname = f"{self.COLORS[record.levelname]}{record.levelname}{self.RESET}"
        return super().format(record)


class LogConfig:
    """Centralized logging configuration."""

    def __init__(
        self,
        log_file: Optional[Path] = None,
        console_level: int = logging.INFO,
        file_level: int = logging.DEBUG,
        max_file_size_mb: int = 50,
        backup_count: int = 3,
        enable_colors: bool = True
    ):
        self.log_file = log_file or Path(__file__).parent / "orchestrator.log"
        self.console_level = console_level
        self.file_level = file_level
        self.max_file_size = max_file_size_mb * 1024 * 1024
        self.backup_count = backup_count
        self.enable_colors = enable_colors

    def setup_logging(self) -> logging.Logger:
        """Setup logging with both console and file handlers."""

        # Get root logger
        root_logger = logging.getLogger()
        root_logger.setLevel(logging.DEBUG)  # Capture all levels

        # Remove existing handlers
        root_logger.handlers.clear()

        # Console handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(self.console_level)

        if self.enable_colors and sys.stdout.isatty():
            console_format = ColoredFormatter(
                '%(levelname)-8s | %(name)-25s | %(message)s'
            )
        else:
            console_format = logging.Formatter(
                '%(levelname)-8s | %(name)-25s | %(message)s'
            )

        console_handler.setFormatter(console_format)
        root_logger.addHandler(console_handler)

        # File handler with rotation
        try:
            file_handler = RotatingFileHandler(
                self.log_file,
                maxBytes=self.max_file_size,
                backupCount=self.backup_count,
                encoding='utf-8'
            )
            file_handler.setLevel(self.file_level)

            file_format = logging.Formatter(
                '%(asctime)s | %(levelname)-8s | %(name)-30s | %(funcName)-20s | %(message)s',
                datefmt='%Y-%m-%d %H:%M:%S'
            )
            file_handler.setFormatter(file_format)
            root_logger.addHandler(file_handler)

            root_logger.info(f"Logging initialized - File: {self.log_file}")
        except Exception as e:
            root_logger.warning(f"Failed to setup file logging: {e}")

        return root_logger


def setup_orchestrator_logging(verbose: bool = False) -> logging.Logger:
    """
    Setup logging for the orchestrator with sensible defaults.

    Args:
        verbose: If True, set console logging to DEBUG level

    Returns:
        Configured root logger
    """
    console_level = logging.DEBUG if verbose else logging.INFO

    config = LogConfig(
        console_level=console_level,
        file_level=logging.DEBUG,  # Always debug in file
        enable_colors=True
    )

    return config.setup_logging()


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance for a specific module.

    Args:
        name: Logger name (typically __name__)

    Returns:
        Logger instance
    """
    return logging.getLogger(name)
