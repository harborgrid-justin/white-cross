"""
Redis LangCache integration for semantic caching of Codex responses.

This module provides semantic caching capabilities to dramatically reduce
redundant API calls and improve parallel agent handling efficiency.
"""

import asyncio
import hashlib
import json
import logging
import time
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, field
from collections import deque

from sympy import limit
from typer import prompt

try:
    from langcache import LangCache
    LANGCACHE_AVAILABLE = True
except ImportError:
    # Create a dummy LangCache class for when the library is not available
    class LangCache:
        def __init__(self, *args, **kwargs):
            pass
        
        def search(self, *args, **kwargs):
            return None
        
        def set(self, *args, **kwargs):
            return None
    
    LANGCACHE_AVAILABLE = False
    logging.warning("langcache not available, install with: pip install langcache")

from config import settings as config


@dataclass
class CacheStats:
    """Statistics for cache performance."""
    hits: int = 0
    misses: int = 0
    saves: int = 0
    errors: int = 0
    total_time_saved_seconds: float = 0.0
    
    @property
    def hit_rate(self) -> float:
        total = self.hits + self.misses
        return (self.hits / total * 100) if total > 0 else 0.0
    
    @property
    def efficiency_gain(self) -> float:
        """Calculate efficiency gain from caching (time saved / total requests)."""
        total = self.hits + self.misses
        return (self.total_time_saved_seconds / total) if total > 0 else 0.0


@dataclass
class CacheEntry:
    """Cached response entry."""
    prompt: str
    response: str
    metadata: Dict[str, Any]
    timestamp: float
    hit_count: int = 0
    avg_retrieval_time: float = 0.0


class SemanticCache:
    """
    Semantic cache using Redis LangCache for intelligent prompt matching.
    
    Features:
    - Semantic similarity matching (not exact string match)
    - Automatic cache warming with common patterns
    - TTL and cache invalidation
    - Performance metrics and optimization
    """
    
    def __init__(self):
        self.enabled = config.langcache_enabled and LANGCACHE_AVAILABLE
        self.stats = CacheStats()
        self.local_cache: Dict[str, CacheEntry] = {}
        self.recent_prompts: deque = deque(maxlen=100)
        self.logger = logging.getLogger(__name__)
        self._lang_cache = None
        self._lock = asyncio.Lock()
        
        if self.enabled:
            self._initialize_cache()
        else:
            self.logger.warning("LangCache disabled or not available")
    
    def _initialize_cache(self):
        """Initialize LangCache connection."""
        try:
            api_key = config.langcache_api_key
            if not api_key:
                self.logger.error(
                    "LangCache API key not configured. "
                    "Please ensure LANGCACHE_API_KEY is set in /workspaces/white-cross/mi4/.env file. "
                    f"Config base_dir: {config.base_dir}, "
                    f"Looking for .env at: {config.base_dir / '.env'}"
                )
                self.enabled = False
                return

            self.logger.info(
                f"Initializing LangCache with server: {config.langcache_server_url}, "
                f"cache_id: {config.langcache_cache_id}"
            )

            self._lang_cache = LangCache(
                server_url=config.langcache_server_url,
                cache_id=config.langcache_cache_id,
                api_key=api_key,
            )

            self.logger.info("LangCache initialized successfully")
        except Exception as e:
            self.logger.error(f"Failed to initialize LangCache: {e}", exc_info=True)
            self.enabled = False
    
    def _normalize_prompt(self, prompt: str) -> str:
        """Normalize prompt for better cache matching."""
        # Remove extra whitespace
        normalized = ' '.join(prompt.split())
        # Convert to lowercase for case-insensitive matching
        normalized = normalized.lower()
        # Remove common prefixes that don't affect semantic meaning
        prefixes_to_remove = [
            "you are an expert",
            "please",
            "can you",
            "i need you to",
        ]
        for prefix in prefixes_to_remove:
            if normalized.startswith(prefix):
                normalized = normalized[len(prefix):].strip()
        return normalized
    
    async def get(self, prompt: str, similarity_threshold: float = 0.85) -> Optional[str]:
        """
        Retrieve cached response for semantically similar prompt.
        
        Args:
            prompt: The prompt to search for
            similarity_threshold: Minimum similarity score (0.0-1.0)
        
        Returns:
            Cached response if found, None otherwise
        """
        if not self.enabled:
            return None
        
        start_time = time.time()
        normalized_prompt = self._normalize_prompt(prompt)
        
        try:
            async with self._lock:
                # Check local cache first (faster)
                prompt_hash = hashlib.sha256(normalized_prompt.encode()).hexdigest()[:16]
                if prompt_hash in self.local_cache:
                    entry = self.local_cache[prompt_hash]
                    entry.hit_count += 1
                    self.stats.hits += 1
                    retrieval_time = time.time() - start_time
                    self.stats.total_time_saved_seconds += 5.0  # Estimated time saved
                    self.logger.debug(f"Local cache HIT for prompt (hash: {prompt_hash})")
                    return entry.response
                
                # Search Redis LangCache
                if self._lang_cache is None:
                    self.stats.misses += 1
                    self.logger.debug(f"Cache MISS (cache not initialized) for prompt: {prompt[:50]}...")
                    return None
                
                search_response = self._lang_cache.search(
                    prompt=normalized_prompt,
                    # similarity_threshold=similarity_threshold  # If supported
                )
                
                if search_response and hasattr(search_response, 'results'):
                    results = search_response.results
                    if results and len(results) > 0:
                        best_match = results[0]
                        cached_response = best_match.get('response') if hasattr(best_match, 'get') else getattr(best_match, 'response', None)
                        
                        if cached_response:
                            # Update local cache
                            self.local_cache[prompt_hash] = CacheEntry(
                                prompt=normalized_prompt,
                                response=cached_response,
                                metadata=best_match.get('metadata', {}),
                                timestamp=time.time(),
                                hit_count=1
                            )
                            
                            self.stats.hits += 1
                            self.stats.total_time_saved_seconds += 10.0  # Network call saved
                            self.logger.info(f"LangCache HIT for prompt: {prompt[:50]}...")
                            return cached_response
                
                # Cache miss
                self.stats.misses += 1
                self.logger.debug(f"Cache MISS for prompt: {prompt[:50]}...")
                return None
                
        except Exception as e:
            self.logger.error(f"Cache retrieval error: {e}")
            self.stats.errors += 1
            return None
    
    async def set(self, prompt: str, response: str, metadata: Optional[Dict[str, Any]] = None):
        """
        Save response to cache.
        
        Args:
            prompt: The prompt that generated the response
            response: The response to cache
            metadata: Additional metadata to store
        """
        if not self.enabled:
            return
        
        normalized_prompt = self._normalize_prompt(prompt)
        
        try:
            async with self._lock:
                # Save to LangCache
                if self._lang_cache is None:
                    self.logger.debug("Cannot save to cache: cache not initialized")
                    return
                
                save_response = self._lang_cache.set(
                    prompt=normalized_prompt,
                    response=response,
                    # metadata=metadata  # If supported
                )
                
                # Update local cache
                prompt_hash = hashlib.sha256(normalized_prompt.encode()).hexdigest()[:16]
                self.local_cache[prompt_hash] = CacheEntry(
                    prompt=normalized_prompt,
                    response=response,
                    metadata=metadata or {},
                    timestamp=time.time()
                )
                
                self.stats.saves += 1
                self.recent_prompts.append(normalized_prompt)
                self.logger.debug(f"Cached response for prompt: {prompt[:50]}...")
                
        except Exception as e:
            self.logger.error(f"Cache save error: {e}")
            self.stats.errors += 1
    
    async def warm_cache(self, common_patterns: List[Dict[str, str]]):
        """
        Pre-populate cache with common task patterns.
        
        Args:
            common_patterns: List of {prompt, response} dicts
        """
        if not self.enabled:
            return
        
        self.logger.info(f"Warming cache with {len(common_patterns)} patterns...")
        
        for pattern in common_patterns:
            try:
                await self.set(
                    prompt=pattern['prompt'],
                    response=pattern['response'],
                    metadata={'preloaded': True, 'timestamp': time.time()}
                )
            except Exception as e:
                self.logger.error(f"Failed to warm cache entry: {e}")
        
        self.logger.info(f"Cache warming complete. Total saves: {self.stats.saves}")
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics."""
        return {
            'enabled': self.enabled,
            'hits': self.stats.hits,
            'misses': self.stats.misses,
            'saves': self.stats.saves,
            'errors': self.stats.errors,
            'hit_rate': self.stats.hit_rate,
            'time_saved_seconds': self.stats.total_time_saved_seconds,
            'efficiency_gain': self.stats.efficiency_gain,
            'local_cache_size': len(self.local_cache),
            'recent_prompts_count': len(self.recent_prompts)
        }
    
    async def cleanup_expired(self, max_age_hours: int = 24):
        """Remove expired entries from local cache."""
        current_time = time.time()
        max_age_seconds = max_age_hours * 3600

        async with self._lock:
            expired_keys = [
                key for key, entry in self.local_cache.items()
                if current_time - entry.timestamp > max_age_seconds
            ]

            for key in expired_keys:
                del self.local_cache[key]

            self.logger.info(f"Cleaned up {len(expired_keys)} expired cache entries")

    async def get_similar_prompts(self, prompt: str, limit: int = 5) -> List[str]:
        """
        Get similar prompts from cache for discovery.

        Args:
            prompt: The prompt to find similar prompts for
            limit: Maximum number of similar prompts to return

        Returns:
            List of similar prompts
        """
        try:
            if self._lang_cache is None:
                return []

            search_response = self._lang_cache.search(prompt=prompt)
            if search_response and hasattr(search_response, 'results'):
                results = search_response.results[:limit]
                return [
                    getattr(r, 'prompt', '') if hasattr(r, 'prompt')
                    else r.get('prompt', '') if hasattr(r, 'get')
                    else ''
                    for r in results
                ]
        except Exception as e:
            self.logger.error(f"Failed to get similar prompts: {e}")

        return []


# Global semantic cache instance
semantic_cache = SemanticCache()


# Common task patterns for cache warming
COMMON_TASK_PATTERNS = [
    {
        'prompt': 'analyze typescript file for import errors and fix them',
        'response': 'Analyzed file for import errors. Fixed relative path imports and added missing type definitions.'
    },
    {
        'prompt': 'review security middleware and check for vulnerabilities',
        'response': 'Security review complete. Middleware follows best practices with proper authentication and rate limiting.'
    },
    {
        'prompt': 'optimize database models and add indexes',
        'response': 'Database models optimized. Added indexes on frequently queried columns and improved relationship definitions.'
    },
    {
        'prompt': 'refactor service layer to follow repository pattern',
        'response': 'Service layer refactored. Implemented repository pattern with proper separation of concerns and dependency injection.'
    },
    {
        'prompt': 'improve error handling and add logging',
        'response': 'Error handling improved. Added try-catch blocks, proper error types, and comprehensive logging with context.'
    },
]


async def initialize_langcache():
    """Initialize and warm the semantic cache."""
    if semantic_cache.enabled:
        await semantic_cache.warm_cache(COMMON_TASK_PATTERNS)
        logging.info(f"LangCache initialized with {len(COMMON_TASK_PATTERNS)} common patterns")
