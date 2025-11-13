#!/usr/bin/env python3
"""
White Cross Orchestrator - Main orchestration engine with advanced efficiency optimizations.

This module integrates all components: monitoring, task management, repository discovery,
and configuration management to provide a comprehensive AI agent orchestration platform.

Efficiency Features:
- Process pool management for subprocess reuse
- Intelligent batch task execution
- Connection pooling and caching
- Circuit breaker pattern for fault tolerance
- Memory-efficient streaming
- Adaptive concurrency control
"""

import asyncio
import logging
from pathlib import Path
import signal
import sys
import subprocess
from collections import deque
from contextlib import asynccontextmanager
from typing import Dict, List, Optional, Any, Set
from dataclasses import dataclass, field
import json
import time
import re

# Import our modular components
from config import settings as config
from monitoring import monitor
from task_management import coordinator, scheduler, TaskPriority, Task, TaskResult
from repository_discovery import analyzer
from token_manager import token_manager

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Constants
TASK_FILE = Path("tasks.json")
WORKSPACES_DIR = config.workspaces_dir_path
AGENTS = config.agent_names
CODEX_CMD = list(config.codex.command)
SESSION_STORE_FILE = WORKSPACES_DIR / "codex_sessions.json"
SESSION_ID_PATTERN = re.compile(r"session id:\s*([0-9a-f-]{36})", re.IGNORECASE)


class CodexSessionManager:
    """Persist and manage Codex session identifiers per agent."""

    def __init__(self, store_path: Path):
        self._store_path = store_path
        self._sessions: Dict[str, str] = {}
        self._lock = asyncio.Lock()
        self._load_sessions()

    def _load_sessions(self) -> None:
        """Load session mapping from disk if present."""
        try:
            if self._store_path.exists():
                with self._store_path.open("r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, dict):
                        # Ensure all keys/values are strings
                        self._sessions = {str(agent): str(session_id) for agent, session_id in data.items()}
        except Exception as exc:
            logger.warning(f"Failed to load Codex session cache: {exc}")
            self._sessions = {}

    def _save_sessions(self) -> None:
        """Persist session mapping to disk atomically."""
        try:
            self._store_path.parent.mkdir(parents=True, exist_ok=True)
            temp_path = self._store_path.with_suffix(".tmp")
            with temp_path.open("w", encoding="utf-8") as f:
                json.dump(self._sessions, f, indent=2, ensure_ascii=False)
                f.write("\n")
            temp_path.replace(self._store_path)
        except Exception as exc:
            logger.warning(f"Failed to persist Codex session cache: {exc}")

    async def get(self, agent: str) -> Optional[str]:
        """Return the known session id for this agent, if any."""
        async with self._lock:
            return self._sessions.get(agent)

    async def set(self, agent: str, session_id: str) -> None:
        """Record the session id for an agent and persist."""
        async with self._lock:
            self._sessions[agent] = session_id
            self._save_sessions()

    async def clear(self, agent: str) -> None:
        """Remove an agent session mapping."""
        async with self._lock:
            if agent in self._sessions:
                del self._sessions[agent]
                self._save_sessions()


codex_sessions = CodexSessionManager(SESSION_STORE_FILE)


@dataclass
class ProcessPoolStats:
    """Statistics for process pool management."""
    total_processes_created: int = 0
    processes_reused: int = 0
    processes_killed: int = 0
    active_processes: int = 0
    average_task_time: float = 0.0
    
    def get_reuse_rate(self) -> float:
        total = self.total_processes_created + self.processes_reused
        return (self.processes_reused / total * 100) if total > 0 else 0.0


class ProcessPool:
    """Manage a pool of reusable subprocess workers for efficient task execution."""
    
    def __init__(self, max_workers: int = 3, worker_timeout: float = 600.0):
        self.max_workers = max_workers
        self.worker_timeout = worker_timeout
        self.available_workers: deque = deque()
        self.busy_workers: Set[asyncio.subprocess.Process] = set()
        self.stats = ProcessPoolStats()
        self._lock = asyncio.Lock()
        self.logger = logging.getLogger(__name__)
    
    async def get_worker(self) -> Optional[asyncio.subprocess.Process]:
        """Get an available worker or create a new one."""
        async with self._lock:
            # Try to reuse an existing worker
            while self.available_workers:
                worker = self.available_workers.popleft()
                if worker.returncode is None:  # Still alive
                    self.busy_workers.add(worker)
                    self.stats.processes_reused += 1
                    self.logger.debug(f"Reused worker (PID: {worker.pid})")
                    return worker
            
            # Create new worker if under limit
            if len(self.busy_workers) < self.max_workers:
                # Workers are created on-demand per task
                self.stats.total_processes_created += 1
                return None  # Signal to create new process
            
            return None  # Pool exhausted
    
    async def return_worker(self, worker: asyncio.subprocess.Process):
        """Return a worker to the pool for reuse."""
        async with self._lock:
            if worker in self.busy_workers:
                self.busy_workers.remove(worker)
            
            if worker.returncode is None:
                self.available_workers.append(worker)
                self.stats.active_processes = len(self.available_workers) + len(self.busy_workers)
            else:
                self.stats.processes_killed += 1
    
    async def cleanup(self):
        """Clean up all workers."""
        async with self._lock:
            all_workers = list(self.available_workers) + list(self.busy_workers)
            for worker in all_workers:
                if worker.returncode is None:
                    try:
                        worker.terminate()
                        await asyncio.wait_for(worker.wait(), timeout=5.0)
                    except:
                        worker.kill()
            
            self.available_workers.clear()
            self.busy_workers.clear()
            self.logger.info(f"Pool cleanup complete. Reuse rate: {self.stats.get_reuse_rate():.1f}%")


class CircuitBreaker:
    """Circuit breaker pattern for fault tolerance."""
    
    def __init__(self, failure_threshold: int = 5, timeout: float = 60.0):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failures = 0
        self.last_failure_time = 0.0
        self.state = "closed"  # closed, open, half-open
        self._lock = asyncio.Lock()
    
    async def call(self, func, *args, **kwargs):
        """Execute function with circuit breaker protection."""
        async with self._lock:
            if self.state == "open":
                if time.time() - self.last_failure_time > self.timeout:
                    self.state = "half-open"
                    logger.info("Circuit breaker entering half-open state")
                else:
                    raise Exception("Circuit breaker is OPEN - too many failures")
        
        try:
            result = await func(*args, **kwargs)
            async with self._lock:
                if self.state == "half-open":
                    self.state = "closed"
                    self.failures = 0
                    logger.info("Circuit breaker closed - system recovered")
            return result
        except Exception as e:
            async with self._lock:
                self.failures += 1
                self.last_failure_time = time.time()
                if self.failures >= self.failure_threshold:
                    self.state = "open"
                    logger.error(f"Circuit breaker OPENED after {self.failures} failures")
            raise


class TaskBatcher:
    """Batch similar tasks for efficient execution."""
    
    def __init__(self, batch_size: int = 5, batch_timeout: float = 10.0):
        self.batch_size = batch_size
        self.batch_timeout = batch_timeout
        self.pending_tasks: Dict[str, List[Dict[str, Any]]] = {}
        self._lock = asyncio.Lock()
    
    async def add_task(self, task: Dict[str, Any], category: str = "default") -> bool:
        """Add task to batch. Returns True if batch is ready."""
        async with self._lock:
            if category not in self.pending_tasks:
                self.pending_tasks[category] = []
            
            self.pending_tasks[category].append(task)
            return len(self.pending_tasks[category]) >= self.batch_size
    
    async def get_batch(self, category: str = "default") -> List[Dict[str, Any]]:
        """Get a batch of tasks for execution."""
        async with self._lock:
            batch = self.pending_tasks.get(category, [])
            self.pending_tasks[category] = []
            return batch


class WhiteCrossOrchestrator:
    """Main orchestrator class that coordinates all components with advanced efficiency features."""
    
    def __init__(self):
        self.running = False
        self.tasks: List[asyncio.Task] = []
        self.logger = logging.getLogger(__name__)
        
        # Efficiency components
        self.process_pool = ProcessPool(
            max_workers=config.orchestration.max_agents,
            worker_timeout=config.codex.timeout_seconds
        )
        self.circuit_breaker = CircuitBreaker(
            failure_threshold=5,
            timeout=120.0
        )
        self.task_batcher = TaskBatcher(
            batch_size=3,
            batch_timeout=10.0
        )
        
        # Performance tracking
        self.task_execution_times: deque = deque(maxlen=100)
        self.cache: Dict[str, Any] = {}
        self.cache_hits = 0
        self.cache_misses = 0
    
    async def initialize(self):
        """Initialize all orchestrator components."""
        self.logger.info("Initializing White Cross Orchestrator...")
        
        try:
            # Start monitoring
            await monitor.start()
            self.logger.info("Monitoring system initialized")
            
            # Start task coordinator
            await coordinator.start()
            self.logger.info("Task coordinator initialized")
            
            # Start scheduler
            await scheduler.start()
            self.logger.info("Task scheduler initialized")
            
            # Register default task handlers
            await self._register_default_handlers()
            
            # Schedule periodic tasks
            await self._schedule_periodic_tasks()
            
            self.logger.info("White Cross Orchestrator initialized successfully")
            
        except Exception as e:
            self.logger.error(f"Failed to initialize orchestrator: {e}")
            raise
    
    async def shutdown(self):
        """Shutdown all orchestrator components gracefully."""
        self.logger.info("Shutting down White Cross Orchestrator...")
        
        try:
            # Cancel all running tasks
            for task in self.tasks:
                if not task.done():
                    task.cancel()
            
            await asyncio.gather(*self.tasks, return_exceptions=True)
            
            # Clean up process pool
            await self.process_pool.cleanup()
            
            # Stop components in reverse order
            await scheduler.stop()
            await coordinator.stop()
            await monitor.stop()
            
            # Log performance stats
            if self.task_execution_times:
                avg_time = sum(self.task_execution_times) / len(self.task_execution_times)
                self.logger.info(f"Average task execution time: {avg_time:.2f}s")
            
            cache_total = self.cache_hits + self.cache_misses
            if cache_total > 0:
                hit_rate = (self.cache_hits / cache_total) * 100
                self.logger.info(f"Cache hit rate: {hit_rate:.1f}%")
            
            self.logger.info("White Cross Orchestrator shutdown complete")
            
        except Exception as e:
            self.logger.error(f"Error during shutdown: {e}")
    
    def _load_json_tasks(self) -> List[Dict[str, Any]]:
        """Load tasks from tasks.json file."""
        task_file = config.base_dir / "tasks.json"
        try:
            if task_file.exists():
                with open(task_file, 'r') as f:
                    tasks = json.load(f)
                    return [t for t in tasks if t.get('status') == 'open']
            return []
        except Exception as e:
            self.logger.error(f"Failed to load tasks from {task_file}: {e}")
            return []
    
    def _save_json_tasks(self, tasks: List[Dict[str, Any]]):
        """Save tasks back to tasks.json file."""
        task_file = config.base_dir / "tasks.json"
        try:
            with open(task_file, 'w') as f:
                json.dump(tasks, f, indent=2)
        except Exception as e:
            self.logger.error(f"Failed to save tasks to {task_file}: {e}")
    
    async def _execute_codex_task(self, json_task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a task from tasks.json using Codex CLI with efficiency optimizations."""
        task_id = json_task['id']
        start_time = time.time()
        self.logger.info(f"Executing Codex task {task_id}: {json_task['title']}")
        
        # Import langcache integration
        from langcache_integration import semantic_cache
        from scratchpad_manager import scratchpad_manager
        
        # Build task prompt
        prompt = f"""
You are an expert coding agent working on the White Cross healthcare platform.

Task ID: {task_id}
Task Title: {json_task['title']}

Task Description:
{json_task['description']}

Instructions:
- Work in the /workspaces/white-cross repository
- Focus on the backend/src directory as specified in the task
- Follow TypeScript and Node.js best practices
- Ensure HIPAA compliance for any healthcare data handling
- Make focused, incremental changes
- Test your changes when possible
- Provide a clear summary of what you accomplished

Please complete this task efficiently and concisely.
"""
        
        # Check semantic cache first (much better than simple string cache)
        cached_response = await semantic_cache.get(prompt)
        if cached_response:
            self.cache_hits += 1
            self.logger.info(f"🎯 Semantic Cache HIT for task {task_id}")
            return TaskResult(
                task_id=str(task_id),
                success=True,
                output=cached_response,
                metadata={
                    'cached': True,
                    'execution_time': time.time() - start_time
                }
            )
        
        self.cache_misses += 1
        
        # Create scratchpad workspace for this task
        scratchpad_session = await scratchpad_manager.create_session(task_id)
        self.logger.info(f"📝 Created scratchpad: {scratchpad_session.workspace_path}")
        
        # Adaptive token budgeting
        if config.codex.enable_adaptive_budgeting:
            budget = token_manager.counter.get_adaptive_budget(
                json_task['description'],
                config.tokens.token_budget_per_task
            )
            self.logger.info(f"💰 Adaptive budget for task {task_id}: {budget} tokens")
        
        # Build optimized Codex command with all enhancements
        cmd = list(config.codex.command)  # Start with base command

        # Add workspace directory (main repo)
        cmd.extend(["-C", str(config.base_dir.parent)])  # Main workspace
        # Note: Scratchpad is already within the main workspace, so it will be accessible
        
        # Add web search if enabled
        if config.codex.enable_web_search:
            cmd.append("--search")
        
        # Add model if specified
        if config.codex.model:
            cmd.extend(["-m", config.codex.model])
        
        # Add profile if specified
        if config.codex.profile:
            cmd.extend(["-p", config.codex.profile])
        
        # Enhanced prompt with scratchpad info
        enhanced_prompt = f"""{prompt}

SCRATCHPAD WORKSPACE:
You have access to a temporary scratchpad workspace at: {scratchpad_session.workspace_path}
Use this space to:
- Test changes before applying to main repo
- Store intermediate results in /output/
- Create draft implementations in /drafts/
- Write test scripts in /test/

The scratchpad will be automatically cleaned up after {config.scratchpad_retention_hours} hours.
"""
        
        # Add prompt to command
        cmd.append(enhanced_prompt)

        # Log the command being executed (without the full prompt)
        cmd_summary = ' '.join(cmd[:-1]) + ' [prompt]'
        self.logger.info(f"Executing command for task {task_id}: {cmd_summary}")

        async def execute_with_process_pool():
            proc = None
            worker = None
            try:
                # Use process pool if enabled
                if config.codex.enable_process_reuse:
                    worker = await self.process_pool.get_worker()
                
                proc = await asyncio.create_subprocess_exec(
                    *cmd,
                    cwd=str(config.base_dir.parent),
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE
                )
                
                # Stream output and capture all lines
                output_lines = []
                error_lines = []

                async def stream_output(stream, label, line_list):
                    """Stream and log subprocess output."""
                    while True:
                        line = await stream.readline()
                        if not line:
                            break
                        text = line.decode(errors="replace").rstrip("\n")
                        line_list.append(text)

                        # Log all output lines to file (debug level)
                        self.logger.debug(f"[Task {task_id}][{label}] {text}")

                        # Log important lines to console (info level)
                        if any(keyword in text.lower() for keyword in ['error', 'failed', 'warning', 'success', 'completed']):
                            self.logger.info(f"[Task {task_id}][{label}] {text}")
                
                await asyncio.wait_for(
                    asyncio.gather(
                        stream_output(proc.stdout, "OUT", output_lines),
                        stream_output(proc.stderr, "ERR", error_lines)
                    ),
                    timeout=config.codex.timeout_seconds
                )
                
                exit_code = await proc.wait()
                
                # Return worker to pool
                if config.codex.enable_process_reuse and worker:
                    await self.process_pool.return_worker(proc)
                
                return exit_code, output_lines
                
            except asyncio.TimeoutError:
                error_msg = f"Task {task_id} timed out after {config.codex.timeout_seconds}s"
                self.logger.error(error_msg)
                self.logger.error(f"Command: {cmd_summary}")
                if proc:
                    proc.kill()
                return -1, []
            except Exception as e:
                error_msg = f"Failed to execute Codex task {task_id}: {e}"
                self.logger.error(error_msg, exc_info=True)
                self.logger.error(f"Command: {cmd_summary}")
                if proc:
                    proc.kill()
                return -1, []
        
        try:
            # Execute with circuit breaker
            exit_code, output_lines = await self.circuit_breaker.call(execute_with_process_pool)
            
            execution_time = time.time() - start_time
            self.task_execution_times.append(execution_time)
            
            # Combine output for caching
            full_output = '\n'.join(output_lines)
            
            # Record token usage
            if config.codex.enable_adaptive_budgeting:
                estimated_tokens = sum(len(line) // 4 for line in output_lines)
                token_manager.counter.record_task_completion(
                    task_id,
                    estimated_tokens,
                    exit_code == 0
                )
            
            # Cache successful results in semantic cache
            if exit_code == 0:
                await semantic_cache.set(
                    prompt=prompt,
                    response=full_output,
                    metadata={
                        'task_id': task_id,
                        'execution_time': execution_time,
                        'timestamp': time.time()
                    }
                )
                self.logger.info(f"💾 Cached result for future semantic lookups")

            # Log scratchpad stats
            scratchpad_stats = await scratchpad_manager.get_session_stats(scratchpad_session.session_id)
            if scratchpad_stats:
                self.logger.info(f"📊 Scratchpad: {scratchpad_stats['total_files']} files, "
                               f"{scratchpad_stats['workspace_size_kb']:.1f} KB")

            self.logger.info(f"✅ Task {task_id} completed in {execution_time:.2f}s (exit: {exit_code})")

            # Return TaskResult object (not dict!)
            return TaskResult(
                task_id=str(task_id),
                success=exit_code == 0,
                error=None if exit_code == 0 else f"Task failed with exit code {exit_code}",
                output=full_output[:500] if full_output else None,
                metadata={
                    'exit_code': exit_code,
                    'execution_time': execution_time,
                    'output_lines': len(output_lines),
                    'scratchpad_session': scratchpad_session.session_id
                }
            )
            
        except Exception as e:
            self.logger.error(f"❌ Circuit breaker prevented task {task_id}: {e}")
            # Clean up scratchpad on failure
            await scratchpad_manager.cleanup_session(scratchpad_session.session_id)
            return TaskResult(
                task_id=str(task_id),
                success=False,
                error=str(e),
                metadata={'circuit_breaker_triggered': True}
            )
    
    async def _register_default_handlers(self):
        """Register default task handlers for common operations."""
        
        # Codex task executor handler
        async def codex_task_handler(task: Task) -> Any:
            try:
                json_task = task.metadata.get('json_task')
                if not json_task:
                    raise ValueError("No JSON task data found in metadata")
                
                result = await self._execute_codex_task(json_task)
                return result
                
            except Exception as e:
                self.logger.error(f"Codex task handler failed: {e}")
                raise
        
        # Repository analysis handler
        async def repository_analysis_handler(task: Task) -> Any:
            try:
                self.logger.info(f"Starting repository analysis for task {task.id}")
                
                # Perform repository analysis
                analysis_result = await analyzer.analyze_workspace()
                
                # Store results in task metadata
                task.metadata['analysis_result'] = analysis_result
                
                return {
                    'task_id': task.id,
                    'success': True,
                    'repositories_analyzed': len(analysis_result.get('repositories', [])),
                    'openai_repos_found': analysis_result.get('summary', {}).get('repositories_with_openai', 0),
                    'recommendations': analysis_result.get('recommendations', [])
                }
                
            except Exception as e:
                self.logger.error(f"Repository analysis failed: {e}")
                raise
        
        # OpenAI optimization handler
        async def openai_optimization_handler(task: Task) -> Any:
            try:
                self.logger.info(f"Starting OpenAI optimization analysis for task {task.id}")
                
                # Get repository context
                repo_context = task.repository_context
                if not repo_context:
                    raise ValueError("Repository context required for OpenAI optimization")
                
                # Analyze OpenAI usage in the specific repository
                optimization_opportunities = await self._analyze_openai_optimization(repo_context)
                
                return {
                    'task_id': task.id,
                    'success': True,
                    'repository': repo_context.name,
                    'optimization_opportunities': optimization_opportunities,
                    'estimated_savings': self._estimate_cost_savings(optimization_opportunities)
                }
                
            except Exception as e:
                self.logger.error(f"OpenAI optimization analysis failed: {e}")
                raise
        
        # Token management handler
        async def token_management_handler(task: Task) -> Any:
            try:
                self.logger.info(f"Starting token management analysis for task {task.id}")
                
                # Get token usage statistics
                token_stats = token_manager.get_usage_stats()
                
                # Generate optimization recommendations
                recommendations = self._generate_token_optimization_recommendations(token_stats)
                
                return {
                    'task_id': task.id,
                    'success': True,
                    'token_stats': token_stats,
                    'recommendations': recommendations,
                    'cost_savings_potential': self._calculate_token_cost_savings(recommendations)
                }
                
            except Exception as e:
                self.logger.error(f"Token management analysis failed: {e}")
                raise
        
        # Register handlers
        coordinator.register_handler('codex_executor', codex_task_handler)
        coordinator.register_handler('repository_analyzer', repository_analysis_handler)
        coordinator.register_handler('openai_optimizer', openai_optimization_handler)
        coordinator.register_handler('token_manager', token_management_handler)
        
        self.logger.info("Default task handlers registered")
    
    async def _schedule_periodic_tasks(self):
        """Schedule periodic maintenance and monitoring tasks."""
        
        # Schedule repository analysis every 6 hours
        async def repository_health_check():
            await coordinator.submit_task(
                title="Periodic Repository Health Check",
                description="Analyze repository health and OpenAI integration status",
                agent_id="repository_analyzer",
                priority=TaskPriority.NORMAL,
                tags={"periodic", "health-check"}
            )
        
        # Schedule token usage analysis every hour
        async def token_usage_analysis():
            await coordinator.submit_task(
                title="Token Usage Analysis",
                description="Analyze token consumption patterns and optimization opportunities",
                agent_id="token_manager",
                priority=TaskPriority.NORMAL,
                tags={"periodic", "token-analysis"}
            )
        
        # Schedule system health check every 30 minutes
        async def system_health_check():
            health_report = monitor.get_performance_report()
            self.logger.info(f"System health check: {json.dumps(health_report, indent=2)}")
        
        # Register scheduled tasks
        scheduler.schedule_task("repository_health_check", 6 * 3600, repository_health_check)  # 6 hours
        scheduler.schedule_task("token_usage_analysis", 3600, token_usage_analysis)  # 1 hour
        scheduler.schedule_task("system_health_check", 1800, system_health_check)  # 30 minutes
        
        self.logger.info("Periodic tasks scheduled")
    
    async def _analyze_openai_optimization(self, repo_context) -> List[Dict[str, Any]]:
        """Analyze OpenAI optimization opportunities for a specific repository."""
        opportunities = []
        
        # Check for streaming API opportunities
        if 'streaming' not in repo_context.openai_features:
            opportunities.append({
                'type': 'streaming_api',
                'title': 'Implement Streaming APIs',
                'description': 'Use OpenAI streaming APIs for real-time responses and better UX',
                'estimated_benefit': 'Improved user experience, reduced perceived latency',
                'complexity': 'Medium',
                'files_to_modify': ['API integration files']
            })
        
        # Check for batch processing opportunities
        if 'batch' not in repo_context.openai_features:
            opportunities.append({
                'type': 'batch_processing',
                'title': 'Implement Batch Processing',
                'description': 'Process multiple requests in batches to optimize API usage',
                'estimated_benefit': 'Reduced API costs, improved throughput',
                'complexity': 'High',
                'files_to_modify': ['API client, request processing']
            })
        
        # Check for caching opportunities
        if 'caching' not in repo_context.openai_features:
            opportunities.append({
                'type': 'response_caching',
                'title': 'Implement Response Caching',
                'description': 'Cache OpenAI responses to reduce redundant API calls',
                'estimated_benefit': 'Significant cost reduction, faster response times',
                'complexity': 'Medium',
                'files_to_modify': ['API client, caching layer']
            })
        
        # Check for error handling improvements
        if 'error_handling' not in repo_context.openai_features:
            opportunities.append({
                'type': 'advanced_error_handling',
                'title': 'Enhanced Error Handling',
                'description': 'Implement exponential backoff, rate limit recovery, and circuit breakers',
                'estimated_benefit': 'Improved reliability, reduced failed requests',
                'complexity': 'Medium',
                'files_to_modify': ['Error handling utilities']
            })
        
        return opportunities
    
    def _estimate_cost_savings(self, opportunities: List[Dict[str, Any]]) -> Dict[str, float]:
        """Estimate cost savings from optimization opportunities."""
        savings = {
            'monthly_dollar_savings': 0.0,
            'percentage_reduction': 0.0
        }
        
        # Rough estimates based on typical usage patterns
        savings_multipliers = {
            'streaming_api': 0.05,  # 5% reduction from better UX
            'batch_processing': 0.20,  # 20% reduction from batching
            'response_caching': 0.30,  # 30% reduction from caching
            'advanced_error_handling': 0.10  # 10% reduction from fewer retries
        }
        
        for opp in opportunities:
            opp_type = opp['type']
            if opp_type in savings_multipliers:
                savings['monthly_dollar_savings'] += savings_multipliers[opp_type] * 100  # Assume $100 base cost
                savings['percentage_reduction'] += savings_multipliers[opp_type] * 100
        
        return savings
    
    def _generate_token_optimization_recommendations(self, token_stats: Dict[str, Any]) -> List[str]:
        """Generate token optimization recommendations."""
        recommendations = []
        
        # Analyze usage patterns
        if token_stats.get('total_tokens', 0) > 1000000:  # Over 1M tokens
            recommendations.append("High token usage detected. Consider implementing response caching.")
        
        # Check for inefficient patterns
        avg_tokens_per_request = token_stats.get('avg_tokens_per_request', 0)
        if avg_tokens_per_request > 2000:
            recommendations.append("High average tokens per request. Consider prompt optimization.")
        
        # Check rate limiting issues
        rate_limit_hits = token_stats.get('rate_limit_hits', 0)
        if rate_limit_hits > 10:
            recommendations.append("Frequent rate limiting. Implement request batching and backoff strategies.")
        
        return recommendations
    
    def _calculate_token_cost_savings(self, recommendations: List[str]) -> Dict[str, float]:
        """Calculate potential cost savings from token optimizations."""
        savings = {'estimated_monthly_savings': 0.0}
        
        # Rough cost estimates
        if any('caching' in rec.lower() for rec in recommendations):
            savings['estimated_monthly_savings'] += 50.0
        
        if any('batch' in rec.lower() for rec in recommendations):
            savings['estimated_monthly_savings'] += 30.0
        
        if any('prompt' in rec.lower() for rec in recommendations):
            savings['estimated_monthly_savings'] += 20.0
        
        return savings
    
    async def run_analysis_task(self, repository_path: Optional[str] = None) -> str:
        """Run a comprehensive analysis task."""
        task_id = await coordinator.submit_task(
            title="Comprehensive Repository Analysis",
            description="Analyze repositories for OpenAI integration and optimization opportunities",
            agent_id="repository_analyzer",
            priority=TaskPriority.HIGH,
            metadata={'target_repository': repository_path},
            tags={"analysis", "openai", "optimization"}
        )
        
        return task_id
    
    async def run_optimization_task(self, repository_path: str) -> str:
        """Run OpenAI optimization analysis for a specific repository."""
        # Get repository context
        repos = await analyzer.discoverer.discover_repositories()
        repo_context = next((r for r in repos if r.path == repository_path), None)
        
        if not repo_context:
            raise ValueError(f"Repository not found: {repository_path}")
        
        task_id = await coordinator.submit_task(
            title=f"OpenAI Optimization Analysis: {repo_context.name}",
            description="Analyze OpenAI usage patterns and identify optimization opportunities",
            agent_id="openai_optimizer",
            priority=TaskPriority.HIGH,
            repository_context=repo_context,
            tags={"optimization", "openai", repo_context.language or "unknown"}
        )
        
        return task_id
    
    def get_status(self) -> Dict[str, Any]:
        """Get orchestrator status."""
        return {
            'running': self.running,
            'coordinator_status': coordinator.get_status(),
            'monitor_report': monitor.get_performance_report(),
            'active_tasks': len(self.tasks),
            'config': config.get_summary()
        }


@asynccontextmanager
async def orchestrator_lifecycle():
    """Context manager for orchestrator lifecycle management."""
    orchestrator = WhiteCrossOrchestrator()
    
    try:
        await orchestrator.initialize()
        yield orchestrator
    finally:
        await orchestrator.shutdown()


async def main_orchestrator():
    """Main entry point for the orchestrator."""
    logger.info("Starting White Cross Orchestrator...")
    
    # Setup signal handlers
    def signal_handler(signum, frame):
        logger.info(f"Received signal {signum}, shutting down...")
        sys.exit(0)
    
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    try:
        async with orchestrator_lifecycle() as orchestrator:
            logger.info("Orchestrator started. Press Ctrl+C to stop.")
            
            # Load tasks from tasks.json
            json_tasks = orchestrator._load_json_tasks()
            
            if json_tasks:
                logger.info(f"Found {len(json_tasks)} open tasks in tasks.json")
                
                # Submit each task to Codex executor
                for json_task in json_tasks:
                    task_id = await coordinator.submit_task(
                        title=json_task['title'],
                        description=json_task['description'],
                        agent_id='codex_executor',
                        priority=TaskPriority.HIGH,
                        metadata={'json_task': json_task},
                        tags={'codex', 'backend', 'json-task'}
                    )
                    logger.info(f"Submitted JSON task {json_task['id']} as orchestrator task {task_id}")
            else:
                logger.info("No open tasks found in tasks.json")
                # Run initial analysis as fallback
                analysis_task_id = await orchestrator.run_analysis_task()
                logger.info(f"Started initial analysis task: {analysis_task_id}")
            
            # Keep running until interrupted
            while True:
                await asyncio.sleep(10)
                
                # Log status periodically
                status = orchestrator.get_status()
                active_tasks = status['coordinator_status']['active_tasks']
                logger.info(f"Status: {active_tasks} active tasks, {status['coordinator_status']['queue_stats']['total_tasks']} total tasks")
    
    except KeyboardInterrupt:
        logger.info("Shutdown requested by user")
    except Exception as e:
        logger.error(f"Orchestrator failed: {e}")
        raise


if __name__ == "__main__":
    # Run the orchestrator
    asyncio.run(main_orchestrator())

# ----------------- UTILITIES -----------------

# Common directories to exclude from analysis
EXCLUDED_DIRS = {
    'node_modules', '.git', '__pycache__', '.pytest_cache', 'venv', 'env',
    'dist', 'build', 'coverage', '.coverage', 'htmlcov', '.nyc_output',
    'tmp', 'temp', 'cache', '.cache', 'logs', '.logs', 'bin', 'obj',
    'target', 'vendor', '.vendor', 'deps', '.deps', 'public', 'static',
    '.next', '.nuxt', '.output', '.vercel', '.netlify', 'out'
}


def find_repository_root() -> Path:
    """Find the git repository root directory."""
    current = Path.cwd()
    while current != current.parent:
        if (current / '.git').exists():
            return current
        current = current.parent
    
    # Fallback: look for common project indicators
    current = Path.cwd()
    while current != current.parent:
        indicators = ['package.json', 'pyproject.toml', 'Cargo.toml', 'go.mod']
        if any((current / indicator).exists() for indicator in indicators):
            return current
        current = current.parent
    
    raise RuntimeError("Could not find repository root")


def is_excluded_directory(path: Path, base_path: Path) -> bool:
    """Check if a directory should be excluded from analysis."""
    relative_path = path.relative_to(base_path)
    
    # Check if any part of the path matches excluded directories
    for part in relative_path.parts:
        if part.lower() in {d.lower() for d in EXCLUDED_DIRS}:
            return True
    
    # Check for deep nesting (likely generated/cache directories)
    if len(relative_path.parts) > 8:
        return True
    
    return False


def discover_source_directories(repo_root: Path) -> Dict[str, List[Path]]:
    """Discover relevant source directories in the repository."""
    source_dirs = {
        'backend': [],
        'frontend': [],
        'shared': [],
        'tests': [],
        'docs': [],
        'config': []
    }
    
    # Common directory patterns
    patterns = {
        'backend': ['backend', 'server', 'api', 'src/server', 'packages/backend'],
        'frontend': ['frontend', 'client', 'web', 'ui', 'src/client', 'packages/frontend'],
        'shared': ['shared', 'common', 'lib', 'libs', 'packages/shared'],
        'tests': ['test', 'tests', '__tests__', 'spec', 'e2e'],
        'docs': ['docs', 'documentation', 'wiki'],
        'config': ['config', 'configs', '.github', 'scripts']
    }
    
    def scan_directory(directory: Path, max_depth: int = 3, current_depth: int = 0) -> None:
        if current_depth > max_depth or not directory.is_dir():
            return
        
        if is_excluded_directory(directory, repo_root):
            return
        
        dir_name = directory.name.lower()
        
        # Categorize directories
        for category, dir_patterns in patterns.items():
            if any(pattern in str(directory.relative_to(repo_root)).lower() 
                   for pattern in dir_patterns):
                source_dirs[category].append(directory)
                break
        
        # Recursively scan subdirectories
        try:
            for child in directory.iterdir():
                if child.is_dir():
                    scan_directory(child, max_depth, current_depth + 1)
        except PermissionError:
            pass
    
    scan_directory(repo_root)
    
    # Remove duplicates and sort
    for category in source_dirs:
        source_dirs[category] = sorted(list(set(source_dirs[category])))
    
    return source_dirs


def create_workspace_context(repo_root: Path, source_dirs: Dict[str, List[Path]]) -> str:
    """Create a context description for agents about the workspace structure."""
    context_parts = [
        "Repository Structure Context:",
        "",
        f"Repository Root: {repo_root}",
        "",
        "Discovered Source Directories:"
    ]
    
    for category, dirs in source_dirs.items():
        if dirs:
            context_parts.append(f"\n{category.title()}:")
            for directory in dirs[:5]:  # Limit to first 5 to avoid overwhelming
                relative_path = directory.relative_to(repo_root)
                context_parts.append(f"  - {relative_path}")
            if len(dirs) > 5:
                context_parts.append(f"  ... and {len(dirs) - 5} more")
    
    excluded_dirs_str = ', '.join(sorted(EXCLUDED_DIRS))
    context_parts.extend([
        "",
        f"Excluded Directories: {excluded_dirs_str}",
        "",
        "Working Directory Guidelines:",
        "- Focus on source directories relevant to your task",
        "- Avoid working in build/cache directories", 
        "- Use relative paths from repository root when possible"
    ])
    
    return "\n".join(context_parts)


def load_tasks() -> List[Dict[str, Any]]:
    """Load tasks from JSON file with error handling."""
    try:
        with TASK_FILE.open("r", encoding="utf-8") as f:
            content = f.read().strip()
            if not content:
                print(f"Warning: {TASK_FILE} is empty, creating empty task list")
                return []
            
            tasks = json.loads(content)
            
            # Validate that tasks is a list
            if not isinstance(tasks, list):
                raise ValueError(f"Tasks file must contain a JSON array, got {type(tasks).__name__}")
            
            # Validate each task has required fields
            for i, task in enumerate(tasks):
                if not isinstance(task, dict):
                    raise ValueError(f"Task {i} must be an object, got {type(task).__name__}")
                
                required_fields = ["id", "title", "description", "status"]
                for field in required_fields:
                    if field not in task:
                        raise ValueError(f"Task {i} is missing required field: {field}")
            
            return tasks
            
    except FileNotFoundError:
        print(f"Warning: {TASK_FILE} not found, creating empty task list")
        return []
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in {TASK_FILE}")
        print(f"JSON Error: {e}")
        
        # Try to show the problematic area
        try:
            with TASK_FILE.open("r", encoding="utf-8") as f:
                lines = f.readlines()
                if e.lineno <= len(lines):
                    print(f"Problem near line {e.lineno}: {lines[e.lineno-1].strip()}")
        except Exception:
            pass
        
        raise SystemExit(1)
    except Exception as e:
        print(f"Error loading tasks: {e}")
        raise SystemExit(1)


def save_tasks(tasks: List[Dict[str, Any]]) -> None:
    """Save tasks to JSON file with error handling and atomic writes."""
    temp_file = None
    try:
        # Create a temporary file first to ensure atomic writes
        temp_file = TASK_FILE.with_suffix('.tmp')
        
        with temp_file.open("w", encoding="utf-8") as f:
            json.dump(tasks, f, indent=2, ensure_ascii=False)
            f.write('\n')  # Ensure file ends with newline
        
        # Atomic replace
        temp_file.replace(TASK_FILE)
        
    except Exception as e:
        print(f"Error saving tasks: {e}")
        # Clean up temp file if it exists
        if temp_file and temp_file.exists():
            temp_file.unlink()
        raise


def get_open_tasks(tasks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [t for t in tasks if t.get("status") == "open"]


def mark_task(tasks: List[Dict[str, Any]], task_id: int, **updates) -> None:
    for t in tasks:
        if t["id"] == task_id:
            t.update(updates)
            break


def ensure_workspaces():
    WORKSPACES_DIR.mkdir(parents=True, exist_ok=True)
    for agent in AGENTS:
        (WORKSPACES_DIR / f"agent_{agent}").mkdir(parents=True, exist_ok=True)


def build_prompt_for_task(task: Dict[str, Any], workspace_context: str = "") -> str:
    """
    Build a comprehensive prompt for Codex with task details and workspace context.
    """
    return f"""
You are an expert coding agent working in a repository.

Task ID: {task['id']}
Task Title: {task['title']}

Task Description:
{task['description']}

{workspace_context}

Instructions:
- Work ONLY inside the current repository workspace
- Focus on source directories, avoid build/cache/dependency directories
- Make minimal, focused changes to complete this task
- Use TypeScript/Node.js best practices for backend work
- Run appropriate tests or builds to verify changes
- When encountering permission issues, suggest alternative approaches
- Provide a clear summary of changes made and any follow-up actions needed

Best Practices:
- Check file permissions before attempting writes
- Use existing project structure and patterns
- Prefer incremental fixes over large refactors
- Document any assumptions or limitations encountered
"""


async def run_codex_for_task(agent: str, task: Dict[str, Any], workspace_context: str = "") -> int:
    """
    Launch Codex exec as a subprocess, passing the prompt as an argument.
    We stream stdout/stderr and prefix with [agent][task-id].
    """
    workspace = WORKSPACES_DIR / f"agent_{agent}"

    prompt = build_prompt_for_task(task, workspace_context)

    # Compose the complete command with the prompt as the last argument
    existing_session = await codex_sessions.get(agent)
    cmd = list(CODEX_CMD)
    if existing_session:
        cmd.extend(["resume", existing_session, prompt])
    else:
        cmd.append(prompt)

    print(f"[{agent}][task {task['id']}] Starting in {workspace} with cmd: {' '.join(cmd[:-1])} [prompt]")

    proc = await asyncio.create_subprocess_exec(
        *cmd,
        cwd=str(workspace),
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )

    session_capture: Dict[str, Optional[str]] = {"id": None}

    async def stream_output(stream, label):
        while True:
            line = await stream.readline()
            if not line:
                break
            text = line.decode(errors="replace").rstrip("\n")
            print(f"[{agent}][task {task['id']}][{label}] {text}")
            match = SESSION_ID_PATTERN.search(text)
            if match:
                session_capture["id"] = match.group(1)

    # Stream stdout and stderr concurrently
    await asyncio.gather(
        stream_output(proc.stdout, "OUT"),
        stream_output(proc.stderr, "ERR"),
    )

    exit_code = await proc.wait()

    detected_session = session_capture.get("id")
    if detected_session:
        if detected_session != existing_session:
            await codex_sessions.set(agent, detected_session)
            logger.info(f"[{agent}] Stored new Codex session: {detected_session}")
    elif exit_code != 0 and existing_session:
        # Clear the session if the run failed before emitting a session id
        await codex_sessions.clear(agent)
        logger.warning(f"[{agent}] Cleared Codex session after failed execution")

    return exit_code


# ----------------- ORCHESTRATION -----------------


async def worker(agent: str, task_queue: asyncio.Queue, tasks_state: List[Dict[str, Any]], workspace_context: str = ""):
    while True:
        try:
            task = task_queue.get_nowait()
        except asyncio.QueueEmpty:
            return

        task_id = task["id"]
        mark_task(tasks_state, task_id, status="running", agent=agent)
        save_tasks(tasks_state)

        try:
            exit_code = await run_codex_for_task(agent, task, workspace_context)
            if exit_code == 0:
                print(f"[{agent}][task {task_id}] Completed successfully")
                mark_task(tasks_state, task_id, status="done")
            else:
                print(f"[{agent}][task {task_id}] Exited with code {exit_code}")
                mark_task(tasks_state, task_id, status="error", exit_code=exit_code)
        except Exception as e:
            print(f"[{agent}][task {task_id}] ERROR: {e}")
            mark_task(tasks_state, task_id, status="error", error=str(e))
        finally:
            save_tasks(tasks_state)
            task_queue.task_done()


async def main(verbose: bool = False):
    """Main orchestrator function with improved error handling and workspace discovery."""
    # Setup logging first
    from logging_config import setup_orchestrator_logging
    setup_orchestrator_logging(verbose=verbose)

    logger.info("🚀 White Cross Orchestrator - Enterprise Python Task Coordinator")
    print("🚀 White Cross Orchestrator - Enterprise Python Task Coordinator")
    print("=" * 65)
    
    # Initialize workspace structure
    ensure_workspaces()
    
    # Discover repository structure
    try:
        repo_root = find_repository_root()
        print(f"📁 Repository root: {repo_root}")
        
        print("🔍 Discovering source directories...")
        source_dirs = discover_source_directories(repo_root)
        
        # Report discovered structure
        total_dirs = sum(len(dirs) for dirs in source_dirs.values())
        print(f"📊 Discovered {total_dirs} relevant directories:")
        for category, dirs in source_dirs.items():
            if dirs:
                print(f"   {category}: {len(dirs)} directories")
        
        workspace_context = create_workspace_context(repo_root, source_dirs)
        
    except Exception as e:
        print(f"⚠️  Warning: Could not discover repository structure: {e}")
        print("   Continuing with basic workspace setup...")
        workspace_context = ""
    
    # Load and process tasks
    tasks_state = load_tasks()
    open_tasks = get_open_tasks(tasks_state)

    if not open_tasks:
        print("\n📋 No open tasks found in tasks.json")
        if tasks_state:
            print(f"   Found {len(tasks_state)} total tasks with statuses:")
            for task in tasks_state:
                status = task.get('status', 'unknown')
                print(f"   - Task {task['id']}: {status}")
        return

    print(f"\n📋 Found {len(open_tasks)} open tasks out of {len(tasks_state)} total tasks")
    print(f"🤖 Spawning up to {len(AGENTS)} agents")
    print("-" * 50)

    task_queue: asyncio.Queue = asyncio.Queue()
    for t in open_tasks:
        task_queue.put_nowait(t)

    workers = [
        asyncio.create_task(worker(agent, task_queue, tasks_state, workspace_context))
        for agent in AGENTS
    ]

    await task_queue.join()

    # Cancel remaining workers
    for w in workers:
        if not w.done():
            w.cancel()
    
    # Wait a bit for cancellation to complete
    try:
        await asyncio.wait_for(asyncio.gather(*workers, return_exceptions=True), timeout=2.0)
    except asyncio.TimeoutError:
        print("Warning: Some workers did not shut down cleanly")

    print("\n" + "=" * 65)
    print("📊 Task Execution Summary")
    print("=" * 65)
    
    status_counts = {}
    for t in tasks_state:
        status = t.get('status', 'unknown')
        status_counts[status] = status_counts.get(status, 0) + 1
        
        agent = t.get('agent', 'none')
        status_emoji = {
            'done': '✅',
            'running': '🔄', 
            'error': '❌',
            'open': '⏳',
            'unknown': '❓'
        }.get(status, '❓')
        
        print(f"   {status_emoji} Task {t['id']}: {status} (agent={agent})")
        print(f"      {t.get('title', 'No title')}")
        
        # Show additional info for failed tasks
        if status == 'error':
            if 'error' in t:
                error_msg = str(t['error'])[:100] + "..." if len(str(t['error'])) > 100 else str(t['error'])
                print(f"      ❌ Error: {error_msg}")
            if 'exit_code' in t:
                print(f"      🔢 Exit code: {t['exit_code']}")
    
    print(f"\n📈 Summary: {status_counts}")
    
    if status_counts.get('error', 0) > 0:
        print("\n💡 Tip: Check agent logs above for detailed error information")
    
    print("\n🎉 Orchestration complete!")


if __name__ == "__main__":
    import argparse

    # Parse command line arguments
    parser = argparse.ArgumentParser(description="White Cross Orchestrator - Healthcare Optimization")
    parser.add_argument('-v', '--verbose', action='store_true',
                       help='Enable verbose logging (DEBUG level)')
    parser.add_argument('--log-file', type=str,
                       help='Custom log file path (default: orchestrator.log)')
    args = parser.parse_args()

    try:
        asyncio.run(main(verbose=args.verbose))
    except KeyboardInterrupt:
        print("\nOrchestrator interrupted by user")
        logger.info("Orchestrator interrupted by user")
        exit(130)
    except Exception as e:
        print(f"\nOrchestrator failed with error: {e}")
        logger.error(f"Orchestrator failed with error: {e}", exc_info=True)
        exit(1)
