"""
Advanced monitoring and observability module for the White Cross Orchestrator.

This module provides comprehensive monitoring, metrics collection, performance tracking,
and health monitoring capabilities using enterprise-grade Python libraries.
"""

import asyncio
import time
import psutil
import logging
from contextlib import asynccontextmanager
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any, Callable
from collections import defaultdict, deque
import json

try:
    from prometheus_client import Counter, Histogram, Gauge, CollectorRegistry, generate_latest
    from prometheus_client.core import REGISTRY
    PROMETHEUS_AVAILABLE = True
except ImportError:
    PROMETHEUS_AVAILABLE = False
    Counter = None
    Histogram = None
    Gauge = None
    CollectorRegistry = None
    generate_latest = None

try:
    import structlog
    STRUCTLOG_AVAILABLE = True
except ImportError:
    STRUCTLOG_AVAILABLE = False
    structlog = None

try:
    from rich.console import Console
    from rich.table import Table
    from rich.progress import Progress, TaskID
    from rich.live import Live
    RICH_AVAILABLE = True
except ImportError:
    RICH_AVAILABLE = False
    Console = None
    Table = None
    Progress = None
    TaskID = None
    Live = None


@dataclass
class SystemMetrics:
    """System resource metrics."""
    cpu_percent: float
    memory_percent: float
    disk_usage_percent: float
    available_memory_gb: float
    load_average: List[float]
    timestamp: float = field(default_factory=time.time)


@dataclass
class TaskMetrics:
    """Task execution metrics."""
    task_id: str
    agent_id: str
    start_time: float
    end_time: Optional[float] = None
    status: str = "running"
    tokens_used: int = 0
    cost_cents: float = 0.0
    exit_code: Optional[int] = None
    error_message: Optional[str] = None
    
    def duration_seconds(self) -> Optional[float]:
        if self.end_time:
            return self.end_time - self.start_time
        return time.time() - self.start_time
    
    def is_completed(self) -> bool:
        return self.end_time is not None


class MetricsRegistry:
    """Centralized metrics registry with Prometheus integration."""
    
    def __init__(self):
        self.registry = CollectorRegistry() if PROMETHEUS_AVAILABLE and CollectorRegistry else None
        
        # Initialize all metrics to None first
        self.task_counter = None
        self.task_duration = None
        self.token_usage = None
        self.cost_tracking = None
        self.system_cpu = None
        self.system_memory = None
        self.active_agents = None
        
        # Only create metrics if Prometheus is available and all required classes exist
        if (PROMETHEUS_AVAILABLE and self.registry and 
            Counter is not None and Histogram is not None and 
            Gauge is not None and CollectorRegistry is not None):
            try:
                # Task metrics
                self.task_counter = Counter(
                    'orchestrator_tasks_total', 
                    'Total number of tasks processed',
                    ['status', 'agent_id'],
                    registry=self.registry
                )
                
                self.task_duration = Histogram(
                    'orchestrator_task_duration_seconds',
                    'Task execution duration in seconds',
                    ['agent_id'],
                    registry=self.registry
                )
                
                self.token_usage = Counter(
                    'orchestrator_tokens_total',
                    'Total tokens consumed',
                    ['agent_id', 'type'],
                    registry=self.registry
                )
                
                self.cost_tracking = Counter(
                    'orchestrator_cost_cents_total',
                    'Total cost in cents',
                    ['agent_id'],
                    registry=self.registry
                )
                
                # System metrics
                self.system_cpu = Gauge(
                    'orchestrator_system_cpu_percent',
                    'System CPU usage percentage',
                    registry=self.registry
                )
                
                self.system_memory = Gauge(
                    'orchestrator_system_memory_percent',
                    'System memory usage percentage',
                    registry=self.registry
                )
                
                self.active_agents = Gauge(
                    'orchestrator_active_agents',
                    'Number of active agents',
                    registry=self.registry
                )
            except Exception as e:
                # If any metric creation fails, set all to None for safety
                logging.warning(f"Failed to initialize Prometheus metrics: {e}")
                self.task_counter = None
                self.task_duration = None
                self.token_usage = None
                self.cost_tracking = None
                self.system_cpu = None
                self.system_memory = None
                self.active_agents = None
    
    def record_task_completion(self, task_metrics: TaskMetrics):
        """Record task completion metrics."""
        if not PROMETHEUS_AVAILABLE or not self.task_counter:
            return
        
        self.task_counter.labels(
            status=task_metrics.status,
            agent_id=task_metrics.agent_id
        ).inc()
        
        duration = task_metrics.duration_seconds()
        if duration is not None and self.task_duration:
            self.task_duration.labels(
                agent_id=task_metrics.agent_id
            ).observe(duration)
        
        if task_metrics.tokens_used > 0 and self.token_usage:
            self.token_usage.labels(
                agent_id=task_metrics.agent_id,
                type='total'
            ).inc(task_metrics.tokens_used)
        
        if task_metrics.cost_cents > 0 and self.cost_tracking:
            self.cost_tracking.labels(
                agent_id=task_metrics.agent_id
            ).inc(task_metrics.cost_cents)
    
    def update_system_metrics(self, metrics: SystemMetrics):
        """Update system resource metrics."""
        if not PROMETHEUS_AVAILABLE or not self.system_cpu or not self.system_memory:
            return
        
        self.system_cpu.set(metrics.cpu_percent)
        self.system_memory.set(metrics.memory_percent)
    
    def set_active_agents(self, count: int):
        """Set the number of active agents."""
        if PROMETHEUS_AVAILABLE and self.active_agents:
            self.active_agents.set(count)
    
    def export_metrics(self) -> str:
        """Export metrics in Prometheus format."""
        if PROMETHEUS_AVAILABLE and self.registry and generate_latest:
            return generate_latest(self.registry).decode('utf-8')
        return ""


class PerformanceProfiler:
    """Advanced performance profiling for orchestrator operations."""
    
    def __init__(self):
        self.profiles: Dict[str, List[float]] = defaultdict(list)
        self.active_profiles: Dict[str, float] = {}
        self._lock = asyncio.Lock()
    
    @asynccontextmanager
    async def profile(self, operation_name: str, metadata: Optional[Dict] = None):
        """Context manager for profiling operations."""
        start_time = time.time()
        
        async with self._lock:
            self.active_profiles[operation_name] = start_time
        
        try:
            yield
        finally:
            end_time = time.time()
            duration = end_time - start_time
            
            async with self._lock:
                self.profiles[operation_name].append(duration)
                self.active_profiles.pop(operation_name, None)
    
    def get_stats(self, operation_name: str) -> Dict[str, Any]:
        """Get performance statistics for an operation."""
        if operation_name not in self.profiles:
            return {}
        
        durations = self.profiles[operation_name]
        if not durations:
            return {}
        
        return {
            'count': len(durations),
            'total_time': sum(durations),
            'average_time': sum(durations) / len(durations),
            'min_time': min(durations),
            'max_time': max(durations),
            'p95_time': sorted(durations)[int(len(durations) * 0.95)] if len(durations) > 1 else durations[0],
            'p99_time': sorted(durations)[int(len(durations) * 0.99)] if len(durations) > 1 else durations[0]
        }
    
    def get_all_stats(self) -> Dict[str, Dict[str, Any]]:
        """Get statistics for all profiled operations."""
        return {op: self.get_stats(op) for op in self.profiles.keys()}


class HealthMonitor:
    """Comprehensive health monitoring for the orchestrator."""
    
    def __init__(self, check_interval: float = 30.0):
        self.check_interval = check_interval
        self.health_checks: Dict[str, Callable] = {}
        self.health_status: Dict[str, Dict[str, Any]] = {}
        self.system_metrics_history: deque = deque(maxlen=100)
        self._monitoring = False
        self._monitor_task: Optional[asyncio.Task] = None
    
    def register_health_check(self, name: str, check_func: Callable) -> None:
        """Register a health check function."""
        self.health_checks[name] = check_func
    
    async def start_monitoring(self):
        """Start continuous health monitoring."""
        if self._monitoring:
            return
        
        self._monitoring = True
        self._monitor_task = asyncio.create_task(self._monitor_loop())
    
    async def stop_monitoring(self):
        """Stop health monitoring."""
        self._monitoring = False
        if self._monitor_task:
            self._monitor_task.cancel()
            try:
                await self._monitor_task
            except asyncio.CancelledError:
                pass
    
    async def _monitor_loop(self):
        """Main monitoring loop."""
        while self._monitoring:
            try:
                # Collect system metrics
                system_metrics = self._collect_system_metrics()
                self.system_metrics_history.append(system_metrics)
                
                # Run health checks
                for name, check_func in self.health_checks.items():
                    try:
                        result = await check_func() if asyncio.iscoroutinefunction(check_func) else check_func()
                        self.health_status[name] = {
                            'status': 'healthy' if result else 'unhealthy',
                            'timestamp': time.time(),
                            'details': result if isinstance(result, dict) else {}
                        }
                    except Exception as e:
                        self.health_status[name] = {
                            'status': 'error',
                            'timestamp': time.time(),
                            'error': str(e)
                        }
                
                await asyncio.sleep(self.check_interval)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logging.error(f"Health monitoring error: {e}")
                await asyncio.sleep(self.check_interval)
    
    def _collect_system_metrics(self) -> SystemMetrics:
        """Collect current system metrics."""
        cpu_percent = psutil.cpu_percent(interval=None)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        try:
            load_avg = list(psutil.getloadavg())
        except AttributeError:
            # Windows doesn't have getloadavg
            load_avg = [0.0, 0.0, 0.0]
        
        return SystemMetrics(
            cpu_percent=cpu_percent,
            memory_percent=memory.percent,
            disk_usage_percent=disk.percent,
            available_memory_gb=memory.available / (1024**3),
            load_average=load_avg
        )
    
    def get_health_summary(self) -> Dict[str, Any]:
        """Get overall health summary."""
        total_checks = len(self.health_status)
        healthy_checks = sum(1 for status in self.health_status.values() 
                           if status['status'] == 'healthy')
        
        overall_status = 'healthy' if healthy_checks == total_checks else 'degraded'
        if any(status['status'] == 'error' for status in self.health_status.values()):
            overall_status = 'unhealthy'
        
        latest_metrics = self.system_metrics_history[-1] if self.system_metrics_history else None
        
        return {
            'overall_status': overall_status,
            'checks_total': total_checks,
            'checks_healthy': healthy_checks,
            'system_metrics': latest_metrics.__dict__ if latest_metrics else None,
            'individual_checks': self.health_status,
            'uptime_seconds': time.time() - (self.system_metrics_history[0].timestamp 
                                           if self.system_metrics_history else time.time())
        }


class RichDashboard:
    """Rich terminal dashboard for real-time monitoring."""
    
    def __init__(self):
        if not RICH_AVAILABLE or not Console:
            raise ImportError("rich library is required for dashboard functionality")
        
        self.console = Console()
        self.task_metrics: Dict[str, TaskMetrics] = {}
        self.system_metrics: Optional[SystemMetrics] = None
        self._live: Optional[Any] = None
        self._update_task: Optional[asyncio.Task] = None
        self._running = False
    
    def start_dashboard(self):
        """Start the live dashboard."""
        if self._running or not RICH_AVAILABLE or not Live:
            return
        
        self._running = True
        self._live = Live(self._generate_dashboard(), refresh_per_second=2)
        self._live.start()
        self._update_task = asyncio.create_task(self._update_loop())
    
    def stop_dashboard(self):
        """Stop the live dashboard."""
        self._running = False
        if self._live:
            self._live.stop()
        if self._update_task:
            self._update_task.cancel()
    
    def update_task_metrics(self, task_metrics: TaskMetrics):
        """Update task metrics for display."""
        self.task_metrics[task_metrics.task_id] = task_metrics
    
    def update_system_metrics(self, system_metrics: SystemMetrics):
        """Update system metrics for display."""
        self.system_metrics = system_metrics
    
    def _generate_dashboard(self) -> Any:
        """Generate the dashboard display."""
        if not RICH_AVAILABLE or not Table:
            return None
        
        # Main dashboard table
        dashboard = Table(title="🚀 White Cross Orchestrator Dashboard")
        
        # System metrics section
        if self.system_metrics:
            dashboard.add_column("System Metrics", style="cyan")
            metrics_text = f"""
CPU: {self.system_metrics.cpu_percent:.1f}%
Memory: {self.system_metrics.memory_percent:.1f}%
Available RAM: {self.system_metrics.available_memory_gb:.1f}GB
Load Avg: {self.system_metrics.load_average[0]:.2f}
            """.strip()
            dashboard.add_row(metrics_text)
        
        # Task metrics section  
        if self.task_metrics:
            task_table = Table(title="Active Tasks")
            task_table.add_column("Task ID", style="yellow")
            task_table.add_column("Agent", style="green")
            task_table.add_column("Status", style="blue")
            task_table.add_column("Duration", style="magenta")
            task_table.add_column("Tokens", style="cyan")
            
            for task in self.task_metrics.values():
                duration = f"{task.duration_seconds:.1f}s" if task.duration_seconds else "N/A"
                task_table.add_row(
                    str(task.task_id),
                    task.agent_id,
                    task.status,
                    duration,
                    str(task.tokens_used)
                )
        
        return dashboard
    
    async def _update_loop(self):
        """Update loop for the dashboard."""
        while self._running:
            if self._live:
                self._live.update(self._generate_dashboard())
            await asyncio.sleep(0.5)


class Monitor:
    """Main monitoring coordinator."""
    
    def __init__(self, enable_dashboard: bool = True):
        self.enable_dashboard = enable_dashboard
        self.metrics_registry = MetricsRegistry()
        self.profiler = PerformanceProfiler()
        self.health_monitor = HealthMonitor()
        self.dashboard = RichDashboard() if (RICH_AVAILABLE and enable_dashboard) else None
        
        # Setup structured logging if available
        if STRUCTLOG_AVAILABLE and structlog:
            structlog.configure(
                processors=[
                    structlog.stdlib.filter_by_level,
                    structlog.stdlib.add_logger_name,
                    structlog.stdlib.add_log_level,
                    structlog.processors.TimeStamper(fmt="iso"),
                    structlog.processors.StackInfoRenderer(),
                    structlog.processors.format_exc_info,
                    structlog.processors.JSONRenderer()
                ],
                wrapper_class=structlog.stdlib.BoundLogger,
                logger_factory=structlog.stdlib.LoggerFactory(),
                cache_logger_on_first_use=True,
            )
            self.logger = structlog.get_logger()
        else:
            self.logger = logging.getLogger(__name__)
    
    async def start(self):
        """Start all monitoring components."""
        await self.health_monitor.start_monitoring()
        
        # Register default health checks
        self.health_monitor.register_health_check(
            'system_resources',
            self._check_system_resources
        )
        
        if self.dashboard:
            self.dashboard.start_dashboard()
    
    async def stop(self):
        """Stop all monitoring components."""
        await self.health_monitor.stop_monitoring()
        
        if self.dashboard:
            self.dashboard.stop_dashboard()
    
    def record_task_start(self, task_id: str, agent_id: str) -> TaskMetrics:
        """Record task start."""
        task_metrics = TaskMetrics(
            task_id=task_id,
            agent_id=agent_id,
            start_time=time.time()
        )
        
        if self.dashboard:
            self.dashboard.update_task_metrics(task_metrics)
        
        return task_metrics
    
    def record_task_completion(self, task_metrics: TaskMetrics, 
                             status: str, exit_code: Optional[int] = None,
                             error_message: Optional[str] = None):
        """Record task completion."""
        task_metrics.end_time = time.time()
        task_metrics.status = status
        task_metrics.exit_code = exit_code
        task_metrics.error_message = error_message
        
        self.metrics_registry.record_task_completion(task_metrics)
        
        if self.dashboard:
            self.dashboard.update_task_metrics(task_metrics)
        
        self.logger.info(
            "Task completed",
            extra={
                "task_id": task_metrics.task_id,
                "agent_id": task_metrics.agent_id,
                "status": status,
                "duration": task_metrics.duration_seconds(),
                "tokens_used": task_metrics.tokens_used
            }
        )
    
    def _check_system_resources(self) -> Dict[str, Any]:
        """Check system resource health."""
        metrics = self.health_monitor._collect_system_metrics()
        
        # Update dashboard
        if self.dashboard:
            self.dashboard.update_system_metrics(metrics)
        
        # Update Prometheus metrics
        self.metrics_registry.update_system_metrics(metrics)
        
        # Determine health status
        warnings = []
        if metrics.cpu_percent > 80:
            warnings.append(f"High CPU usage: {metrics.cpu_percent:.1f}%")
        if metrics.memory_percent > 85:
            warnings.append(f"High memory usage: {metrics.memory_percent:.1f}%")
        if metrics.available_memory_gb < 1.0:
            warnings.append(f"Low available memory: {metrics.available_memory_gb:.1f}GB")
        
        return {
            'healthy': len(warnings) == 0,
            'warnings': warnings,
            'metrics': metrics.__dict__
        }
    
    def get_performance_report(self) -> Dict[str, Any]:
        """Generate comprehensive performance report."""
        return {
            'profiler_stats': self.profiler.get_all_stats(),
            'health_summary': self.health_monitor.get_health_summary(),
            'prometheus_metrics': self.metrics_registry.export_metrics() if PROMETHEUS_AVAILABLE else None
        }


# Global monitor instance
monitor = Monitor(enable_dashboard=False)