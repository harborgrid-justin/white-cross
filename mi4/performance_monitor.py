#!/usr/bin/env python3
"""
Performance monitoring and analysis tool for White Cross Orchestrator.

This module provides real-time performance metrics, bottleneck detection,
and optimization recommendations.
"""

import asyncio
import json
import time
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field, asdict
from collections import deque
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class PerformanceMetrics:
    """Performance metrics snapshot."""
    timestamp: float = field(default_factory=time.time)
    
    # Task metrics
    tasks_completed: int = 0
    tasks_failed: int = 0
    tasks_in_progress: int = 0
    average_task_time: float = 0.0
    min_task_time: float = 0.0
    max_task_time: float = 0.0
    
    # Resource metrics
    cpu_usage: float = 0.0
    memory_usage: float = 0.0
    process_pool_reuse_rate: float = 0.0
    
    # Efficiency metrics
    cache_hit_rate: float = 0.0
    token_efficiency: float = 0.0
    concurrent_tasks: int = 0
    throughput_tasks_per_minute: float = 0.0
    
    # Error metrics
    circuit_breaker_trips: int = 0
    timeout_count: int = 0
    retry_count: int = 0


@dataclass
class BottleneckAnalysis:
    """Bottleneck detection results."""
    bottleneck_type: str
    severity: str  # low, medium, high, critical
    description: str
    recommendation: str
    impact_score: float


class PerformanceMonitor:
    """Real-time performance monitoring and analysis."""
    
    def __init__(self, history_size: int = 1000):
        self.history_size = history_size
        self.metrics_history: deque = deque(maxlen=history_size)
        self.bottlenecks: List[BottleneckAnalysis] = []
        self.logger = logging.getLogger(__name__)
    
    def record_metrics(self, metrics: PerformanceMetrics):
        """Record a metrics snapshot."""
        self.metrics_history.append(metrics)
    
    def analyze_bottlenecks(self) -> List[BottleneckAnalysis]:
        """Analyze recent metrics to identify bottlenecks."""
        if len(self.metrics_history) < 10:
            return []
        
        bottlenecks = []
        recent_metrics = list(self.metrics_history)[-50:]
        
        # Check average task time
        avg_times = [m.average_task_time for m in recent_metrics if m.average_task_time > 0]
        if avg_times:
            avg_task_time = sum(avg_times) / len(avg_times)
            if avg_task_time > 300:  # 5 minutes
                bottlenecks.append(BottleneckAnalysis(
                    bottleneck_type="slow_tasks",
                    severity="high",
                    description=f"Tasks taking {avg_task_time:.1f}s on average",
                    recommendation="Consider breaking down complex tasks or increasing timeout limits",
                    impact_score=min(avg_task_time / 60, 10.0)
                ))
        
        # Check cache hit rate
        cache_rates = [m.cache_hit_rate for m in recent_metrics if m.cache_hit_rate >= 0]
        if cache_rates:
            avg_cache_rate = sum(cache_rates) / len(cache_rates)
            if avg_cache_rate < 20:
                bottlenecks.append(BottleneckAnalysis(
                    bottleneck_type="low_cache_hits",
                    severity="medium",
                    description=f"Cache hit rate only {avg_cache_rate:.1f}%",
                    recommendation="Review cache key generation and expiration policies",
                    impact_score=5.0
                ))
        
        # Check process pool reuse
        reuse_rates = [m.process_pool_reuse_rate for m in recent_metrics if m.process_pool_reuse_rate >= 0]
        if reuse_rates:
            avg_reuse = sum(reuse_rates) / len(reuse_rates)
            if avg_reuse < 30:
                bottlenecks.append(BottleneckAnalysis(
                    bottleneck_type="low_process_reuse",
                    severity="medium",
                    description=f"Process reuse rate only {avg_reuse:.1f}%",
                    recommendation="Increase process pool size or worker timeout",
                    impact_score=6.0
                ))
        
        # Check failure rate
        total_tasks = sum(m.tasks_completed + m.tasks_failed for m in recent_metrics)
        failed_tasks = sum(m.tasks_failed for m in recent_metrics)
        if total_tasks > 0:
            failure_rate = (failed_tasks / total_tasks) * 100
            if failure_rate > 20:
                bottlenecks.append(BottleneckAnalysis(
                    bottleneck_type="high_failure_rate",
                    severity="critical",
                    description=f"Task failure rate at {failure_rate:.1f}%",
                    recommendation="Check error logs and review task requirements",
                    impact_score=10.0
                ))
        
        # Check concurrent tasks
        concurrent_counts = [m.concurrent_tasks for m in recent_metrics]
        if concurrent_counts:
            avg_concurrent = sum(concurrent_counts) / len(concurrent_counts)
            max_agents = 3  # Default from config
            if avg_concurrent < max_agents * 0.5:
                bottlenecks.append(BottleneckAnalysis(
                    bottleneck_type="underutilized_concurrency",
                    severity="low",
                    description=f"Only {avg_concurrent:.1f} concurrent tasks on average",
                    recommendation="Review task queue and dependency constraints",
                    impact_score=3.0
                ))
        
        # Check circuit breaker trips
        cb_trips = sum(m.circuit_breaker_trips for m in recent_metrics)
        if cb_trips > 5:
            bottlenecks.append(BottleneckAnalysis(
                bottleneck_type="frequent_circuit_breaks",
                severity="high",
                description=f"Circuit breaker tripped {cb_trips} times",
                recommendation="Investigate underlying failures and increase resilience",
                impact_score=8.0
            ))
        
        # Sort by impact score
        bottlenecks.sort(key=lambda b: b.impact_score, reverse=True)
        self.bottlenecks = bottlenecks
        return bottlenecks
    
    def generate_report(self) -> Dict[str, Any]:
        """Generate comprehensive performance report."""
        if not self.metrics_history:
            return {"error": "No metrics available"}
        
        recent_metrics = list(self.metrics_history)[-50:]
        latest = recent_metrics[-1]
        
        # Calculate trends
        task_times = [m.average_task_time for m in recent_metrics if m.average_task_time > 0]
        cache_rates = [m.cache_hit_rate for m in recent_metrics if m.cache_hit_rate >= 0]
        
        report = {
            "timestamp": time.time(),
            "current_metrics": asdict(latest),
            "trends": {
                "average_task_time": {
                    "current": latest.average_task_time,
                    "mean_recent": sum(task_times) / len(task_times) if task_times else 0,
                    "trend": "stable"
                },
                "cache_hit_rate": {
                    "current": latest.cache_hit_rate,
                    "mean_recent": sum(cache_rates) / len(cache_rates) if cache_rates else 0,
                    "trend": "stable"
                }
            },
            "bottlenecks": [asdict(b) for b in self.analyze_bottlenecks()],
            "recommendations": self._generate_recommendations()
        }
        
        return report
    
    def _generate_recommendations(self) -> List[str]:
        """Generate optimization recommendations based on metrics."""
        recommendations = []
        
        if not self.bottlenecks:
            recommendations.append("System performing well - no critical bottlenecks detected")
            return recommendations
        
        # Generate recommendations based on bottlenecks
        for bottleneck in self.bottlenecks[:5]:  # Top 5 issues
            if bottleneck.severity in ["critical", "high"]:
                recommendations.append(f"URGENT: {bottleneck.recommendation}")
            else:
                recommendations.append(bottleneck.recommendation)
        
        # General optimization tips
        if len(self.metrics_history) >= self.history_size:
            recommendations.append("Consider increasing metrics history size for better trend analysis")
        
        return recommendations
    
    def print_summary(self):
        """Print performance summary to console."""
        report = self.generate_report()
        
        print("\n" + "="*60)
        print("PERFORMANCE MONITOR SUMMARY")
        print("="*60)
        
        current = report["current_metrics"]
        print(f"\n📊 Current Status:")
        print(f"  Tasks Completed: {current['tasks_completed']}")
        print(f"  Tasks Failed: {current['tasks_failed']}")
        print(f"  Tasks In Progress: {current['tasks_in_progress']}")
        print(f"  Average Task Time: {current['average_task_time']:.2f}s")
        print(f"  Concurrent Tasks: {current['concurrent_tasks']}")
        
        print(f"\n⚡ Efficiency Metrics:")
        print(f"  Cache Hit Rate: {current['cache_hit_rate']:.1f}%")
        print(f"  Process Reuse Rate: {current['process_pool_reuse_rate']:.1f}%")
        print(f"  Throughput: {current['throughput_tasks_per_minute']:.2f} tasks/min")
        
        bottlenecks = report["bottlenecks"]
        if bottlenecks:
            print(f"\n⚠️  Detected Bottlenecks ({len(bottlenecks)}):")
            for i, b in enumerate(bottlenecks[:3], 1):
                print(f"  {i}. [{b['severity'].upper()}] {b['description']}")
                print(f"     → {b['recommendation']}")
        else:
            print(f"\n✅ No bottlenecks detected - system running optimally")
        
        recommendations = report["recommendations"]
        if recommendations:
            print(f"\n💡 Recommendations:")
            for i, rec in enumerate(recommendations[:3], 1):
                print(f"  {i}. {rec}")
        
        print("\n" + "="*60 + "\n")
    
    def export_report(self, filepath: Path):
        """Export performance report to JSON file."""
        report = self.generate_report()
        with open(filepath, 'w') as f:
            json.dump(report, f, indent=2)
        self.logger.info(f"Performance report exported to {filepath}")


async def continuous_monitoring(interval: int = 60):
    """Continuously monitor orchestrator performance."""
    monitor = PerformanceMonitor()
    
    while True:
        try:
            # This would integrate with the actual orchestrator
            # For now, we'll create sample metrics
            metrics = PerformanceMetrics(
                tasks_completed=10,
                tasks_failed=1,
                tasks_in_progress=2,
                average_task_time=45.5,
                cache_hit_rate=65.0,
                process_pool_reuse_rate=75.0,
                concurrent_tasks=2,
                throughput_tasks_per_minute=0.5
            )
            
            monitor.record_metrics(metrics)
            monitor.print_summary()
            
            await asyncio.sleep(interval)
            
        except KeyboardInterrupt:
            logger.info("Monitoring stopped by user")
            break
        except Exception as e:
            logger.error(f"Monitoring error: {e}")
            await asyncio.sleep(interval)


if __name__ == "__main__":
    print("Starting Performance Monitor...")
    print("Press Ctrl+C to stop\n")
    asyncio.run(continuous_monitoring(interval=30))
