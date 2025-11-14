"""
Advanced task management module for the White Cross Orchestrator.

This module provides sophisticated task coordination, dependency management,
and execution orchestration with integration to monitoring and repository discovery.
"""

import asyncio
import json
import uuid
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional, Set, Any, Callable, Awaitable
from dataclasses import dataclass, field
from collections import defaultdict, deque
import logging
import time

from monitoring import TaskMetrics, monitor
from repository_discovery import RepositoryInfo, discoverer


class TaskStatus(Enum):
    """Task execution status."""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    TIMEOUT = "timeout"


class TaskPriority(Enum):
    """Task priority levels."""
    LOW = 1
    NORMAL = 2
    HIGH = 3
    CRITICAL = 4


@dataclass
class TaskDependency:
    """Task dependency specification."""
    task_id: str
    dependency_type: str = "completion"  # completion, success, failure
    required: bool = True


@dataclass
class Task:
    """Advanced task specification with dependencies and metadata."""
    id: str
    title: str
    description: str
    agent_id: str
    priority: TaskPriority = TaskPriority.NORMAL
    status: TaskStatus = TaskStatus.PENDING
    dependencies: List[TaskDependency] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    timeout_seconds: Optional[int] = None
    retry_count: int = 0
    max_retries: int = 3
    tags: Set[str] = field(default_factory=set)
    repository_context: Optional[RepositoryInfo] = None
    
    def __post_init__(self):
        if isinstance(self.created_at, str):
            self.created_at = datetime.fromisoformat(self.created_at)
        if isinstance(self.started_at, str):
            self.started_at = datetime.fromisoformat(self.started_at)
        if isinstance(self.completed_at, str):
            self.completed_at = datetime.fromisoformat(self.completed_at)
    
    @property
    def is_completed(self) -> bool:
        return self.status in [TaskStatus.COMPLETED, TaskStatus.FAILED, TaskStatus.CANCELLED, TaskStatus.TIMEOUT]
    
    def can_start(self, completed_tasks: Set[str]) -> bool:
        """Check if task can start based on dependencies."""
        return all(dep.task_id in completed_tasks for dep in self.dependencies)
    
    @property
    def duration_seconds(self) -> Optional[float]:
        if self.started_at and self.completed_at:
            return (self.completed_at - self.started_at).total_seconds()
        elif self.started_at:
            return (datetime.now() - self.started_at).total_seconds()
        return None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert task to dictionary for serialization."""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'agent_id': self.agent_id,
            'priority': self.priority.value,
            'status': self.status.value,
            'dependencies': [dep.__dict__ for dep in self.dependencies],
            'metadata': self.metadata,
            'created_at': self.created_at.isoformat(),
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'timeout_seconds': self.timeout_seconds,
            'retry_count': self.retry_count,
            'max_retries': self.max_retries,
            'tags': list(self.tags),
            'repository_context': self.repository_context.__dict__ if self.repository_context else None
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Task':
        """Create task from dictionary."""
        # Convert priority and status back to enums
        data['priority'] = TaskPriority(data['priority'])
        data['status'] = TaskStatus(data['status'])
        
        # Convert dependencies
        data['dependencies'] = [TaskDependency(**dep) for dep in data['dependencies']]
        
        # Convert tags back to set
        data['tags'] = set(data['tags'])
        
        return cls(**data)


@dataclass
class TaskResult:
    """Result of task execution."""
    task_id: str
    success: bool
    output: Any = None
    error: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)
    execution_time: Optional[float] = None


class TaskQueue:
    """Advanced task queue with priority management and dependency resolution."""
    
    def __init__(self):
        self.tasks: Dict[str, Task] = {}
        self.pending_tasks: Dict[TaskPriority, deque] = {
            priority: deque() for priority in TaskPriority
        }
        self.running_tasks: Set[str] = set()
        self.completed_tasks: Dict[str, TaskResult] = {}
        self._lock = asyncio.Lock()
        self.logger = logging.getLogger(__name__)
    
    async def add_task(self, task: Task) -> str:
        """Add a task to the queue."""
        async with self._lock:
            self.tasks[task.id] = task
            if task.status == TaskStatus.PENDING:
                self.pending_tasks[task.priority].append(task.id)
            
            self.logger.info(f"Added task {task.id} to queue")
            return task.id
    
    async def get_next_task(self) -> Optional[Task]:
        """Get the next task to execute based on priority, dependencies, and intelligent scheduling."""
        async with self._lock:
            best_task = None
            best_score = -1
            
            # Check priorities from highest to lowest
            for priority in reversed(list(TaskPriority)):
                queue = self.pending_tasks[priority]
                
                # Check each task in the queue
                for task_id in list(queue):
                    task = self.tasks[task_id]
                    
                    # Skip if already running
                    if task_id in self.running_tasks:
                        continue
                    
                    # Check if dependencies are satisfied
                    completed_task_ids = set(self.completed_tasks.keys())
                    if not task.can_start(completed_task_ids):
                        continue
                    
                    # Calculate task score for intelligent prioritization
                    score = self._calculate_task_score(task)
                    
                    if score > best_score:
                        best_score = score
                        best_task = task
            
            if best_task:
                self.running_tasks.add(best_task.id)
                best_task.status = TaskStatus.RUNNING
                best_task.started_at = datetime.now()
                self.logger.info(f"Starting task {best_task.id} (score: {best_score:.2f})")
                return best_task
            
            return None
    
    def _calculate_task_score(self, task: Task) -> float:
        """Calculate priority score for intelligent task selection."""
        score = task.priority.value * 100
        
        # Boost score for older tasks (prevent starvation)
        age_hours = (datetime.now() - task.created_at).total_seconds() / 3600
        score += age_hours * 10
        
        # Boost score for tasks with fewer retries
        score += (task.max_retries - task.retry_count) * 5
        
        # Boost score for tasks with timeouts (urgency)
        if task.timeout_seconds:
            score += 20
        
        # Penalize tasks with many dependencies (may block others)
        score -= len(task.dependencies) * 3
        
        return score
    
    async def complete_task(self, task_id: str, result: TaskResult):
        """Mark a task as completed."""
        async with self._lock:
            if task_id in self.tasks:
                task = self.tasks[task_id]
                task.status = TaskStatus.COMPLETED if result.success else TaskStatus.FAILED
                task.completed_at = datetime.now()
                
                self.running_tasks.discard(task_id)
                self.completed_tasks[task_id] = result
                
                # Record metrics
                task_metrics = monitor.record_task_start(task_id, task.agent_id)
                monitor.record_task_completion(
                    task_metrics, 
                    task.status.value,
                    exit_code=0 if result.success else 1,
                    error_message=result.error
                )
                
                self.logger.info(f"Completed task {task_id}: {result.success}")
    
    async def fail_task(self, task_id: str, error: str):
        """Mark a task as failed."""
        async with self._lock:
            if task_id in self.tasks:
                task = self.tasks[task_id]
                
                # Check if we should retry
                if task.retry_count < task.max_retries:
                    task.retry_count += 1
                    task.status = TaskStatus.PENDING
                    self.pending_tasks[task.priority].append(task_id)
                    self.running_tasks.discard(task_id)
                    
                    self.logger.warning(f"Retrying task {task_id} (attempt {task.retry_count})")
                else:
                    task.status = TaskStatus.FAILED
                    task.completed_at = datetime.now()
                    self.running_tasks.discard(task_id)
                    
                    result = TaskResult(task_id=task_id, success=False, error=error)
                    self.completed_tasks[task_id] = result
                    
                    self.logger.error(f"Task {task_id} failed permanently: {error}")
    
    async def cancel_task(self, task_id: str):
        """Cancel a task."""
        async with self._lock:
            if task_id in self.tasks:
                task = self.tasks[task_id]
                task.status = TaskStatus.CANCELLED
                task.completed_at = datetime.now()
                self.running_tasks.discard(task_id)
                
                self.logger.info(f"Cancelled task {task_id}")
    
    def get_task_status(self, task_id: str) -> Optional[Task]:
        """Get the current status of a task."""
        return self.tasks.get(task_id)
    
    def get_queue_stats(self) -> Dict[str, Any]:
        """Get queue statistics."""
        return {
            'total_tasks': len(self.tasks),
            'pending_tasks': sum(len(queue) for queue in self.pending_tasks.values()),
            'running_tasks': len(self.running_tasks),
            'completed_tasks': len(self.completed_tasks),
            'tasks_by_priority': {
                priority.name: len(queue) for priority, queue in self.pending_tasks.items()
            },
            'tasks_by_status': {
                status.value: len([t for t in self.tasks.values() if t.status == status])
                for status in TaskStatus
            }
        }


class TaskCoordinator:
    """Advanced task coordinator with dependency management and execution orchestration."""
    
    def __init__(self, max_concurrent_tasks: int = 5):
        self.queue = TaskQueue()
        self.max_concurrent = max_concurrent_tasks
        self.active_tasks: Set[asyncio.Task] = set()
        self.task_handlers: Dict[str, Callable[[Task], Awaitable[TaskResult]]] = {}
        self.logger = logging.getLogger(__name__)
        self._running = False
        self._coordinator_task: Optional[asyncio.Task] = None
    
    def register_handler(self, agent_id: str, handler: Callable[[Task], Awaitable[TaskResult]]):
        """Register a task handler for a specific agent."""
        self.task_handlers[agent_id] = handler
        self.logger.info(f"Registered handler for agent {agent_id}")
    
    async def submit_task(self, title: str, description: str, agent_id: str, 
                         priority: TaskPriority = TaskPriority.NORMAL,
                         dependencies: Optional[List[TaskDependency]] = None,
                         metadata: Optional[Dict[str, Any]] = None,
                         timeout_seconds: Optional[int] = None,
                         tags: Optional[Set[str]] = None,
                         repository_context: Optional[RepositoryInfo] = None) -> str:
        """Submit a new task to the coordinator."""
        
        task = Task(
            id=str(uuid.uuid4()),
            title=title,
            description=description,
            agent_id=agent_id,
            priority=priority,
            dependencies=dependencies or [],
            metadata=metadata or {},
            timeout_seconds=timeout_seconds,
            tags=tags or set(),
            repository_context=repository_context
        )
        
        await self.queue.add_task(task)
        self.logger.info(f"Submitted task {task.id} for agent {agent_id}")
        
        return task.id
    
    async def start(self):
        """Start the task coordinator."""
        if self._running:
            return
        
        self._running = True
        self._coordinator_task = asyncio.create_task(self._coordinate())
        self.logger.info("Task coordinator started")
    
    async def stop(self):
        """Stop the task coordinator."""
        self._running = False
        
        if self._coordinator_task:
            self._coordinator_task.cancel()
            try:
                await self._coordinator_task
            except asyncio.CancelledError:
                pass
        
        # Cancel all active tasks
        for task in self.active_tasks:
            task.cancel()
        
        await asyncio.gather(*self.active_tasks, return_exceptions=True)
        self.logger.info("Task coordinator stopped")
    
    async def _coordinate(self):
        """Main coordination loop."""
        while self._running:
            try:
                # Check if we can start more tasks
                if len(self.active_tasks) < self.max_concurrent:
                    task = await self.queue.get_next_task()
                    
                    if task:
                        # Start task execution
                        execution_task = asyncio.create_task(self._execute_task(task))
                        self.active_tasks.add(execution_task)
                        
                        # Clean up completed tasks
                        self.active_tasks = {t for t in self.active_tasks if not t.done()}
                
                await asyncio.sleep(0.1)  # Small delay to prevent busy waiting
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                self.logger.error(f"Error in coordination loop: {e}")
                await asyncio.sleep(1)
    
    async def _execute_task(self, task: Task) -> TaskResult:
        """Execute a single task."""
        try:
            # Get the handler for this agent
            handler = self.task_handlers.get(task.agent_id)
            if not handler:
                error_msg = f"No handler registered for agent {task.agent_id}"
                self.logger.error(error_msg)
                await self.queue.fail_task(task.id, error_msg)
                return TaskResult(task_id=task.id, success=False, error=error_msg)
            
            # Execute with timeout if specified
            if task.timeout_seconds:
                result = await asyncio.wait_for(
                    handler(task), 
                    timeout=task.timeout_seconds
                )
            else:
                result = await handler(task)
            
            # Mark as completed
            await self.queue.complete_task(task.id, result)
            return result
            
        except asyncio.TimeoutError:
            error_msg = f"Task {task.id} timed out after {task.timeout_seconds} seconds"
            self.logger.error(error_msg)
            await self.queue.fail_task(task.id, error_msg)
            return TaskResult(task_id=task.id, success=False, error=error_msg)
            
        except Exception as e:
            error_msg = f"Task {task.id} failed with error: {str(e)}"
            self.logger.error(error_msg)
            await self.queue.fail_task(task.id, error_msg)
            return TaskResult(task_id=task.id, success=False, error=str(e))
    
    def get_status(self) -> Dict[str, Any]:
        """Get coordinator status."""
        return {
            'running': self._running,
            'active_tasks': len(self.active_tasks),
            'queue_stats': self.queue.get_queue_stats(),
            'registered_agents': list(self.task_handlers.keys())
        }


class TaskScheduler:
    """Advanced task scheduler with cron-like functionality."""
    
    def __init__(self):
        self.scheduled_tasks: Dict[str, Dict[str, Any]] = {}
        self.logger = logging.getLogger(__name__)
        self._running = False
        self._scheduler_task: Optional[asyncio.Task] = None
    
    def schedule_task(self, task_id: str, interval_seconds: int, 
                     task_factory: Callable[[], Awaitable[None]]):
        """Schedule a recurring task."""
        self.scheduled_tasks[task_id] = {
            'interval': interval_seconds,
            'factory': task_factory,
            'last_run': None,
            'next_run': datetime.now()
        }
        self.logger.info(f"Scheduled task {task_id} to run every {interval_seconds} seconds")
    
    async def start(self):
        """Start the scheduler."""
        if self._running:
            return
        
        self._running = True
        self._scheduler_task = asyncio.create_task(self._schedule_loop())
        self.logger.info("Task scheduler started")
    
    async def stop(self):
        """Stop the scheduler."""
        self._running = False
        
        if self._scheduler_task:
            self._scheduler_task.cancel()
            try:
                await self._scheduler_task
            except asyncio.CancelledError:
                pass
        
        self.logger.info("Task scheduler stopped")
    
    async def _schedule_loop(self):
        """Main scheduling loop."""
        while self._running:
            try:
                now = datetime.now()
                
                for task_id, config in self.scheduled_tasks.items():
                    if now >= config['next_run']:
                        # Execute the task
                        try:
                            await config['factory']()
                            config['last_run'] = now
                            config['next_run'] = now + timedelta(seconds=config['interval'])
                            self.logger.debug(f"Executed scheduled task {task_id}")
                        except Exception as e:
                            self.logger.error(f"Scheduled task {task_id} failed: {e}")
                
                await asyncio.sleep(1)  # Check every second
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                self.logger.error(f"Error in scheduler loop: {e}")
                await asyncio.sleep(5)


# Global instances
task_queue = TaskQueue()
coordinator = TaskCoordinator()
scheduler = TaskScheduler()