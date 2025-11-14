"""
Configuration management for the White Cross Orchestrator.

This module handles all configuration settings, environment variables,
and provides validated configuration objects using Pydantic.
"""

import os
from pathlib import Path
from typing import Dict, List, Set, Optional, Any
from pydantic import BaseModel, Field, validator
from pydantic_settings import BaseSettings


class DirectoryConfig(BaseModel):
    """Configuration for directory discovery and exclusion."""
    
    excluded_dirs: Set[str] = {
        'node_modules', 'dist', 'build', '.git', '.next', '.nuxt',
        'coverage', 'logs', '.temp', '.cache', '__pycache__',
        '.pytest_cache', '.tox', 'venv', '.venv', 'env', '.env',
        'target', 'vendor', '.idea', '.vscode/extensions',
        '.swc', '.turbo', 'tmp', 'temp', '.angular', '.nx'
    }
    
    excluded_file_patterns: Set[str] = {
        '*.log', '*.tmp', '*.cache', '*.lock', '*.pid',
        '*.map', '*.min.js', '*.min.css', '*.bundle.js',
        '.DS_Store', 'Thumbs.db', '*.pyc', '*.pyo', '*.pyd',
        '*.so', '*.dll', '*.exe', '*.bin'
    }
    
    max_scan_depth: int = Field(default=5, ge=1, le=10)
    max_dirs_per_category: int = Field(default=20, ge=1, le=100)


class TokenManagementConfig(BaseModel):
    """Configuration for token usage and management."""
    
    max_tokens_per_request: int = Field(default=8000, ge=1000, le=32000)
    context_window_size: int = Field(default=16000, ge=4000, le=128000)
    token_budget_per_task: int = Field(default=50000, ge=10000, le=200000)
    token_estimation_buffer: float = Field(default=0.15, ge=0.0, le=0.5)
    
    # Rate limiting
    requests_per_minute: int = Field(default=10, ge=1, le=100)
    requests_per_hour: int = Field(default=500, ge=10, le=5000)
    
    # Token cost tracking (in cents per 1K tokens)
    input_token_cost: float = Field(default=0.003, ge=0.0)
    output_token_cost: float = Field(default=0.015, ge=0.0)


class CodexConfig(BaseModel):
    """Configuration for Codex execution with efficiency optimizations."""
    
    # Optimized command with proper flags from codex --help
    command: List[str] = [
        "codex", "exec",
        "--full-auto",  # Low-friction sandboxed automatic execution (includes on-failure approval)
        "--sandbox", "workspace-write",  # Safe workspace modifications
    ]
    
    # Additional codex options
    enable_web_search: bool = False
    model: Optional[str] = None  # Let codex use default unless specified
    profile: Optional[str] = None  # Config profile from ~/.codex/config.toml
    
    timeout_seconds: int = Field(default=3600, ge=60, le=7200)  # 1 hour max
    max_retries: int = Field(default=3, ge=0, le=5)
    retry_delay_seconds: float = Field(default=30.0, ge=1.0, le=300.0)
    
    # Performance settings
    enable_caching: bool = True
    enable_parallel_execution: bool = True
    enable_process_reuse: bool = True
    enable_task_batching: bool = True
    enable_adaptive_budgeting: bool = True
    memory_limit_mb: Optional[int] = Field(default=2048, ge=512, le=8192)
    
    # Circuit breaker settings
    circuit_breaker_threshold: int = Field(default=5, ge=3, le=10)
    circuit_breaker_timeout: float = Field(default=120.0, ge=30.0, le=600.0)
    
    # Batch execution settings
    batch_size: int = Field(default=3, ge=1, le=10)
    batch_timeout_seconds: float = Field(default=10.0, ge=5.0, le=60.0)


class OrchestrationConfig(BaseModel):
    """Configuration for task orchestration."""
    
    max_agents: int = Field(default=5, ge=1, le=10)
    agent_names: List[str] = ["alpha", "bravo", "charlie", "delta", "echo"]
    
    # Queue management
    task_queue_timeout: float = Field(default=300.0, ge=30.0, le=3600.0)
    worker_shutdown_timeout: float = Field(default=30.0, ge=5.0, le=120.0)
    
    # Health checks
    enable_health_checks: bool = True
    health_check_interval: float = Field(default=60.0, ge=10.0, le=300.0)
    
    @validator('agent_names')
    def validate_agent_names(cls, v, values):
        max_agents = values.get('max_agents', 3)
        if len(v) < max_agents:
            raise ValueError(f"Must have at least {max_agents} agent names")
        return v


class MonitoringConfig(BaseModel):
    """Configuration for monitoring and observability."""
    
    enable_metrics: bool = True
    enable_structured_logging: bool = True
    enable_profiling: bool = Field(default=False)
    
    # Metrics
    metrics_port: int = Field(default=8000, ge=1024, le=65535)
    metrics_path: str = "/metrics"
    
    # Logging
    log_level: str = Field(default="INFO", pattern=r"^(DEBUG|INFO|WARNING|ERROR|CRITICAL)$")
    log_format: str = "json"
    enable_file_logging: bool = True
    max_log_size_mb: int = Field(default=100, ge=10, le=1000)
    log_retention_days: int = Field(default=30, ge=1, le=365)


class OrchestratorSettings(BaseSettings):
    """Main settings class that loads configuration from environment and files."""
    
    # Base paths
    base_dir: Path = Field(default_factory=lambda: Path(__file__).parent)
    task_file: str = "tasks.json"
    workspaces_dir: str = "workspaces"
    
    # Component configurations
    directories: DirectoryConfig = Field(default_factory=DirectoryConfig)
    tokens: TokenManagementConfig = Field(default_factory=TokenManagementConfig)
    codex: CodexConfig = Field(default_factory=CodexConfig)
    orchestration: OrchestrationConfig = Field(default_factory=OrchestrationConfig)
    monitoring: MonitoringConfig = Field(default_factory=MonitoringConfig)
    
    # Environment-specific settings
    environment: str = Field(default="development", pattern=r"^(development|staging|production)$")
    debug: bool = Field(default=False)
    
    # External service configurations
    redis_url: Optional[str] = None
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    
    # Redis LangCache configuration
    langcache_enabled: bool = Field(default=True)
    langcache_server_url: str = Field(default="https://gcp-us-east4.langcache.redis.io")
    langcache_cache_id: str = Field(default="e257ac5aa004431695433df5999f8510")
    langcache_api_key: Optional[str] = None
    
    # Scratchpad workspace for agent temp writing
    scratchpad_dir: str = "scratchpad"
    scratchpad_retention_hours: int = Field(default=24, ge=1, le=168)
    
    class Config:
        # Use absolute path to .env file relative to this config module
        env_file = str(Path(__file__).parent / ".env")
        env_file_encoding = "utf-8"
        env_nested_delimiter = "__"
        case_sensitive = False
    
    @property
    def task_file_path(self) -> Path:
        """Get the full path to the tasks file."""
        return self.base_dir / self.task_file
    
    @property
    def workspaces_dir_path(self) -> Path:
        """Get the full path to the workspaces directory."""
        return self.base_dir / self.workspaces_dir
    
    @property
    def agent_names(self) -> List[str]:
        """Get the list of agent names limited by max_agents."""
        return self.orchestration.agent_names[:self.orchestration.max_agents]
    
    @property
    def scratchpad_dir_path(self) -> Path:
        """Get the full path to the scratchpad directory."""
        return self.base_dir / self.scratchpad_dir

    def get_summary(self) -> Dict[str, Any]:
        """Get a summary of the current configuration."""
        return {
            'environment': self.environment,
            'debug': self.debug,
            'max_agents': self.orchestration.max_agents,
            'agent_names': self.agent_names,
            'task_file': str(self.task_file),
            'workspaces_dir': str(self.workspaces_dir),
            'monitoring_enabled': self.monitoring.enable_metrics,
            'token_budget_enabled': self.tokens.token_budget_per_task > 0,
            'redis_configured': self.redis_url is not None,
            'openai_configured': self.openai_api_key is not None,
            'anthropic_configured': self.anthropic_api_key is not None,
            # Efficiency features
            'process_reuse_enabled': self.codex.enable_process_reuse,
            'task_batching_enabled': self.codex.enable_task_batching,
            'adaptive_budgeting_enabled': self.codex.enable_adaptive_budgeting,
            'circuit_breaker_enabled': True,
            'caching_enabled': self.codex.enable_caching,
            'langcache_enabled': self.langcache_enabled,
            'scratchpad_enabled': True,
            'web_search_enabled': self.codex.enable_web_search
        }


def load_settings() -> OrchestratorSettings:
    """Load and validate orchestrator settings."""
    settings = OrchestratorSettings()

    # Validate critical settings
    env_file_path = Path(__file__).parent / ".env"
    if not env_file_path.exists():
        import warnings
        warnings.warn(
            f"⚠️  .env file not found at {env_file_path}. "
            "Some features like LangCache may not work correctly."
        )

    return settings


def validate_environment() -> Dict[str, Any]:
    """Validate environment configuration and return diagnostics."""
    env_file_path = Path(__file__).parent / ".env"

    diagnostics = {
        'env_file_path': str(env_file_path),
        'env_file_exists': env_file_path.exists(),
        'config_base_dir': str(settings.base_dir),
        'langcache_configured': settings.langcache_api_key is not None,
        'langcache_enabled': settings.langcache_enabled,
        'openai_configured': settings.openai_api_key is not None,
        'anthropic_configured': settings.anthropic_api_key is not None,
        'redis_configured': settings.redis_url is not None,
    }

    if env_file_path.exists():
        diagnostics['env_file_size'] = env_file_path.stat().st_size
        # Read and count non-empty lines
        with open(env_file_path) as f:
            lines = [l.strip() for l in f if l.strip() and not l.strip().startswith('#')]
            diagnostics['env_file_variables'] = len(lines)

    return diagnostics


# Global settings instance
settings = load_settings()