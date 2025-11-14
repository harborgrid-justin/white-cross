"""
Token management and cost optimization for the White Cross Orchestrator.

This module provides advanced token counting, budgeting, and optimization
capabilities to ensure efficient use of language model APIs.
"""

import asyncio
import time
from collections import defaultdict, deque
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple, Any
from contextlib import asynccontextmanager
import logging

try:
    import tiktoken
    TIKTOKEN_AVAILABLE = True
except ImportError:
    tiktoken = None
    TIKTOKEN_AVAILABLE = False
    logging.warning("tiktoken not available, using fallback token estimation")

try:
    from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
    TENACITY_AVAILABLE = True
except ImportError:
    TENACITY_AVAILABLE = False
    logging.warning("tenacity not available, retries disabled")


@dataclass
class TokenUsage:
    """Track token usage for a single operation."""
    input_tokens: int = 0
    output_tokens: int = 0
    timestamp: float = field(default_factory=time.time)
    cost_cents: float = 0.0
    
    @property
    def total_tokens(self) -> int:
        return self.input_tokens + self.output_tokens


@dataclass
class TokenBudget:
    """Manage token budgets and limits."""
    total_budget: int
    used_tokens: int = 0
    reserved_tokens: int = 0
    
    @property
    def available_tokens(self) -> int:
        return max(0, self.total_budget - self.used_tokens - self.reserved_tokens)
    
    @property
    def utilization_percentage(self) -> float:
        if self.total_budget == 0:
            return 0.0
        return (self.used_tokens / self.total_budget) * 100
    
    def can_accommodate(self, tokens: int) -> bool:
        return tokens <= self.available_tokens
    
    def reserve_tokens(self, tokens: int) -> bool:
        """Reserve tokens for upcoming use."""
        if self.can_accommodate(tokens):
            self.reserved_tokens += tokens
            return True
        return False
    
    def use_tokens(self, tokens: int, from_reserved: bool = False) -> bool:
        """Use tokens, optionally from reserved pool."""
        if from_reserved:
            if tokens <= self.reserved_tokens:
                self.reserved_tokens -= tokens
                self.used_tokens += tokens
                return True
            return False
        else:
            if self.can_accommodate(tokens):
                self.used_tokens += tokens
                return True
            return False


class TokenCounter:
    """Advanced token counting with multiple encoding support and adaptive budgeting."""
    
    def __init__(self, model_name: str = "gpt-4"):
        self.model_name = model_name
        self._encoder = None
        self._fallback_ratio = 4  # chars per token approximation
        self.task_history: deque = deque(maxlen=50)
        self.logger = logging.getLogger(__name__)
        if TIKTOKEN_AVAILABLE and tiktoken is not None:
            try:
                self._encoder = tiktoken.encoding_for_model(model_name)
            except KeyError:
                try:
                    self._encoder = tiktoken.get_encoding("cl100k_base")
                except Exception:
                    logging.warning(f"Could not load tiktoken encoder for {model_name}")
                    logging.warning(f"Could not load tiktoken encoder for {model_name}")
    
    def count_tokens(self, text: str) -> int:
        """Count tokens in text with high accuracy."""
        if not text:
            return 0
        
        if self._encoder:
            try:
                return len(self._encoder.encode(text))
            except Exception as e:
                logging.warning(f"Token encoding failed: {e}, using fallback")
        
        # Fallback estimation
        return max(1, len(text) // self._fallback_ratio)
    
    def estimate_completion_tokens(self, prompt: str, max_tokens: int) -> int:
        """Estimate tokens needed for completion."""
        prompt_tokens = self.count_tokens(prompt)
        
        # Heuristic: completion is usually 20-80% of prompt length
        estimated_completion = min(max_tokens, int(prompt_tokens * 0.5))
        return estimated_completion
    
    def truncate_to_token_limit(self, text: str, max_tokens: int, 
                               preserve_end: bool = False) -> str:
        """Truncate text to fit within token limit."""
        current_tokens = self.count_tokens(text)
        
        if current_tokens <= max_tokens:
            return text
        
        # Binary search for optimal truncation point
        if preserve_end:
            # Keep the end, truncate from beginning
            lines = text.split('\n')
            while len(lines) > 1 and self.count_tokens('\n'.join(lines)) > max_tokens:
                lines.pop(0)
            return '\n'.join(lines)
        else:
            # Keep the beginning, truncate from end
            lines = text.split('\n')
            while len(lines) > 1 and self.count_tokens('\n'.join(lines)) > max_tokens:
                lines.pop()
            return '\n'.join(lines)
    
    def get_adaptive_budget(self, task_description: str, base_budget: int) -> int:
        """Calculate adaptive token budget based on task complexity and history."""
        # Estimate task complexity
        description_tokens = self.count_tokens(task_description)
        complexity_factor = 1.0
        
        # Adjust based on description length
        if description_tokens > 500:
            complexity_factor = 1.5
        elif description_tokens > 200:
            complexity_factor = 1.2
        
        # Adjust based on keywords indicating complexity
        complex_keywords = ['refactor', 'optimize', 'analyze', 'comprehensive', 'entire']
        simple_keywords = ['fix', 'update', 'change', 'add', 'remove']
        
        desc_lower = task_description.lower()
        if any(kw in desc_lower for kw in complex_keywords):
            complexity_factor *= 1.3
        elif any(kw in desc_lower for kw in simple_keywords):
            complexity_factor *= 0.8
        
        # Use historical data if available
        if self.task_history:
            avg_usage = sum(h['tokens_used'] for h in self.task_history) / len(self.task_history)
            if avg_usage > base_budget * 0.8:
                complexity_factor *= 1.2  # Increase budget if historically high usage
        
        adaptive_budget = int(base_budget * complexity_factor)
        self.logger.debug(f"Adaptive budget: {adaptive_budget} (factor: {complexity_factor:.2f})")
        
        return adaptive_budget
    
    def record_task_completion(self, task_id: str, tokens_used: int, success: bool):
        """Record task completion for adaptive learning."""
        self.task_history.append({
            'task_id': task_id,
            'tokens_used': tokens_used,
            'success': success,
            'timestamp': time.time()
        })


class RateLimiter:
    """Advanced rate limiting with multiple time windows."""
    
    def __init__(self, requests_per_minute: int = 10, requests_per_hour: int = 500):
        self.rpm_limit = requests_per_minute
        self.rph_limit = requests_per_hour
        
        self.minute_requests = deque()
        self.hour_requests = deque()
        
        self._lock = asyncio.Lock()
    
    async def acquire(self) -> bool:
        """Acquire permission to make a request."""
        async with self._lock:
            now = time.time()
            
            # Clean old requests
            minute_ago = now - 60
            while self.minute_requests and self.minute_requests[0] < minute_ago:
                self.minute_requests.popleft()
            
            hour_ago = now - 3600
            while self.hour_requests and self.hour_requests[0] < hour_ago:
                self.hour_requests.popleft()
            
            # Check limits
            if len(self.minute_requests) >= self.rpm_limit:
                return False
            
            if len(self.hour_requests) >= self.rph_limit:
                return False
            
            # Record request
            self.minute_requests.append(now)
            self.hour_requests.append(now)
            
            return True
    
    async def wait_for_slot(self, timeout: float = 300.0) -> bool:
        """Wait for an available rate limit slot."""
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            if await self.acquire():
                return True
            
            await asyncio.sleep(1.0)
        
        return False


class TokenManager:
    """Central token management system."""
    
    def __init__(self, input_cost_per_1k: float = 0.003, 
                 output_cost_per_1k: float = 0.015):
        self.input_cost_per_1k = input_cost_per_1k
        self.output_cost_per_1k = output_cost_per_1k
        
        # Tracking
        self.task_budgets: Dict[str, TokenBudget] = {}
        self.usage_history: List[TokenUsage] = []
        self.agent_usage: Dict[str, List[TokenUsage]] = defaultdict(list)
        
        # Components
        self.counter = TokenCounter()
        self.rate_limiter = RateLimiter()
        
        # Statistics
        self._lock = asyncio.Lock()
    
    def create_task_budget(self, task_id: str, budget: int) -> TokenBudget:
        """Create a token budget for a task."""
        task_budget = TokenBudget(total_budget=budget)
        self.task_budgets[task_id] = task_budget
        return task_budget
    
    def get_task_budget(self, task_id: str) -> Optional[TokenBudget]:
        """Get the token budget for a task."""
        return self.task_budgets.get(task_id)
    
    async def estimate_request_cost(self, prompt: str, max_tokens: int) -> Tuple[int, float]:
        """Estimate the token cost of a request."""
        input_tokens = self.counter.count_tokens(prompt)
        estimated_output = self.counter.estimate_completion_tokens(prompt, max_tokens)
        
        input_cost = (input_tokens / 1000) * self.input_cost_per_1k
        output_cost = (estimated_output / 1000) * self.output_cost_per_1k
        total_cost = input_cost + output_cost
        
        return input_tokens + estimated_output, total_cost
    
    @asynccontextmanager
    async def managed_request(self, task_id: str, prompt: str, max_tokens: int,
                             agent_id: str = "default"):
        """Context manager for managed API requests with token tracking."""
        
        # Estimate cost
        estimated_tokens, estimated_cost = await self.estimate_request_cost(prompt, max_tokens)
        
        # Check budget
        budget = self.get_task_budget(task_id)
        if budget and not budget.reserve_tokens(estimated_tokens):
            raise ValueError(f"Insufficient token budget for task {task_id}")
        
        # Wait for rate limit
        if not await self.rate_limiter.wait_for_slot():
            raise TimeoutError("Rate limit timeout")
        
        start_time = time.time()
        usage = TokenUsage(timestamp=start_time)
        
        try:
            yield usage
            
            # Mark tokens as used
            if budget:
                budget.use_tokens(usage.total_tokens, from_reserved=True)
            
        except Exception as e:
            # Return reserved tokens on failure
            if budget:
                budget.reserved_tokens -= estimated_tokens
            raise
        
        finally:
            # Record usage
            async with self._lock:
                usage.cost_cents = (
                    (usage.input_tokens / 1000) * self.input_cost_per_1k +
                    (usage.output_tokens / 1000) * self.output_cost_per_1k
                ) * 100  # Convert to cents
                
                self.usage_history.append(usage)
                self.agent_usage[agent_id].append(usage)
    
    def get_usage_stats(self) -> Dict[str, Any]:
        """Get comprehensive usage statistics."""
        if not self.usage_history:
            return {}
        
        total_input = sum(u.input_tokens for u in self.usage_history)
        total_output = sum(u.output_tokens for u in self.usage_history)
        total_cost = sum(u.cost_cents for u in self.usage_history)
        
        # Agent breakdown
        agent_stats = {}
        for agent_id, usages in self.agent_usage.items():
            if usages:
                agent_stats[agent_id] = {
                    "requests": len(usages),
                    "input_tokens": sum(u.input_tokens for u in usages),
                    "output_tokens": sum(u.output_tokens for u in usages),
                    "cost_cents": sum(u.cost_cents for u in usages)
                }
        
        # Budget status
        budget_stats = {}
        for task_id, budget in self.task_budgets.items():
            budget_stats[task_id] = {
                "total_budget": budget.total_budget,
                "used_tokens": budget.used_tokens,
                "reserved_tokens": budget.reserved_tokens,
                "utilization_pct": budget.utilization_percentage
            }
        
        return {
            "total_requests": len(self.usage_history),
            "total_input_tokens": total_input,
            "total_output_tokens": total_output,
            "total_tokens": total_input + total_output,
            "total_cost_cents": total_cost,
            "average_cost_per_request": total_cost / len(self.usage_history) if self.usage_history else 0,
            "agent_breakdown": agent_stats,
            "budget_status": budget_stats
        }
    
    def optimize_prompt(self, prompt: str, max_tokens: int, 
                       preserve_sections: Optional[List[str]] = None) -> str:
        """Optimize prompt to fit within token limits while preserving key sections."""
        current_tokens = self.counter.count_tokens(prompt)
        
        if current_tokens <= max_tokens:
            return prompt
        
        # Preserve important sections
        preserved_text = ""
        if preserve_sections:
            for section in preserve_sections:
                if section in prompt:
                    preserved_text += section + "\n"
        
        preserved_tokens = self.counter.count_tokens(preserved_text)
        remaining_budget = max_tokens - preserved_tokens
        
        if remaining_budget <= 0:
            return self.counter.truncate_to_token_limit(preserved_text, max_tokens)
        
        # Remove preserved sections temporarily
        working_prompt = prompt
        for section in (preserve_sections or []):
            working_prompt = working_prompt.replace(section, "")
        
        # Truncate the remaining content
        truncated = self.counter.truncate_to_token_limit(working_prompt, remaining_budget)
        
        # Combine preserved and truncated content
        return preserved_text + truncated


# Global token manager instance
token_manager = TokenManager()