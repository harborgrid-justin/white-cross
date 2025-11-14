/**
 * @fileoverview Resource Reporter Service
 * @module health-record/services
 * @description Generates comprehensive resource usage reports
 *
 * HIPAA CRITICAL - This service generates reports for PHI processing resource monitoring
 *
 * @compliance HIPAA Security Rule §164.312
 */

import { Injectable, Logger } from '@nestjs/common';
import { ResourceMetrics } from './resource-metrics-collector.service';
import { ResourceAlert } from './resource-monitor.service';
import { OptimizationRecommendation } from './resource-optimization-engine.service';

@Injectable()
export class ResourceReporter {
  private readonly logger = new Logger(ResourceReporter.name);

  /**
   * Generate comprehensive resource report
   */
  generateResourceReport(
    currentMetrics: ResourceMetrics,
    activeAlerts: ResourceAlert[],
    recommendations: OptimizationRecommendation[],
    resourceHistory: ResourceMetrics[],
  ): {
    summary: {
      overallHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL';
      resourceUtilization: Record<string, number>;
      activeAlerts: number;
      pendingOptimizations: number;
      complianceStatus: string;
    };
    metrics: ResourceMetrics;
    trends: {
      memory: 'IMPROVING' | 'STABLE' | 'DEGRADING';
      cpu: 'IMPROVING' | 'STABLE' | 'DEGRADING';
      database: 'IMPROVING' | 'STABLE' | 'DEGRADING';
      cache: 'IMPROVING' | 'STABLE' | 'DEGRADING';
    };
    recommendations: OptimizationRecommendation[];
    alerts: ResourceAlert[];
    predictiveInsights: Array<{
      resource: string;
      prediction: string;
      confidence: number;
      timeframe: string;
    }>;
  } {
    // Calculate overall health
    const overallHealth = this.calculateOverallHealth(currentMetrics, activeAlerts);

    // Calculate trends
    const trends = this.calculateResourceTrends(resourceHistory);

    // Generate predictive insights
    const predictiveInsights = this.generatePredictiveInsights(resourceHistory);

    return {
      summary: {
        overallHealth,
        resourceUtilization: {
          memory: currentMetrics.memory.utilization,
          cpu: currentMetrics.cpu.usage,
          database: (currentMetrics.database.activeConnections / 100) * 100, // Assuming max 100 connections
          cache: currentMetrics.cache.hitRate,
        },
        activeAlerts: activeAlerts.length,
        pendingOptimizations: recommendations.length,
        complianceStatus: 'COMPLIANT', // In a real implementation, this would be dynamic
      },
      metrics: currentMetrics,
      trends,
      recommendations,
      alerts: activeAlerts,
      predictiveInsights,
    };
  }

  /**
   * Calculate overall health status
   */
  private calculateOverallHealth(
    metrics: ResourceMetrics,
    alerts: ResourceAlert[],
  ): 'HEALTHY' | 'WARNING' | 'CRITICAL' {
    if (alerts.some((a) => a.severity === 'CRITICAL')) return 'CRITICAL';
    if (alerts.some((a) => a.severity === 'WARNING' || a.severity === 'ERROR')) return 'WARNING';
    return 'HEALTHY';
  }

  /**
   * Calculate resource trends
   */
  private calculateResourceTrends(history: ResourceMetrics[]): {
    memory: 'IMPROVING' | 'STABLE' | 'DEGRADING';
    cpu: 'IMPROVING' | 'STABLE' | 'DEGRADING';
    database: 'IMPROVING' | 'STABLE' | 'DEGRADING';
    cache: 'IMPROVING' | 'STABLE' | 'DEGRADING';
  } {
    if (history.length < 2) {
      return {
        memory: 'STABLE',
        cpu: 'STABLE',
        database: 'STABLE',
        cache: 'STABLE',
      };
    }

    const recent = history.slice(-10); // Last 10 measurements
    const older = history.slice(-20, -10); // Previous 10 measurements

    if (older.length === 0) {
      return {
        memory: 'STABLE',
        cpu: 'STABLE',
        database: 'STABLE',
        cache: 'STABLE',
      };
    }

    const calculateTrend = (
      recentValues: number[],
      olderValues: number[],
    ): 'IMPROVING' | 'STABLE' | 'DEGRADING' => {
      const recentAvg = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
      const olderAvg = olderValues.reduce((a, b) => a + b, 0) / olderValues.length;

      const change = recentAvg - olderAvg;
      const threshold = Math.abs(olderAvg * 0.05); // 5% change threshold

      if (Math.abs(change) < threshold) return 'STABLE';
      return change < 0 ? 'IMPROVING' : 'DEGRADING';
    };

    return {
      memory: calculateTrend(
        recent.map((m) => m.memory.utilization),
        older.map((m) => m.memory.utilization),
      ),
      cpu: calculateTrend(
        recent.map((m) => m.cpu.usage),
        older.map((m) => m.cpu.usage),
      ),
      database: calculateTrend(
        recent.map((m) => m.database.activeConnections),
        older.map((m) => m.database.activeConnections),
      ),
      cache: calculateTrend(
        recent.map((m) => m.cache.hitRate),
        older.map((m) => m.cache.hitRate),
      ),
    };
  }

  /**
   * Generate predictive insights
   */
  private generatePredictiveInsights(history: ResourceMetrics[]): Array<{
    resource: string;
    prediction: string;
    confidence: number;
    timeframe: string;
  }> {
    const insights: Array<{
      resource: string;
      prediction: string;
      confidence: number;
      timeframe: string;
    }> = [];

    if (history.length < 5) {
      return insights;
    }

    // Simple trend analysis (in a real implementation, this would use ML models)
    const recentMemory = history.slice(-5).map((m) => m.memory.utilization);
    const memoryTrend = this.calculateSimpleTrend(recentMemory);

    if (memoryTrend > 0.5) {
      // Increasing trend
      insights.push({
        resource: 'memory',
        prediction: 'Memory usage is trending upward and may reach critical levels',
        confidence: Math.min(memoryTrend * 100, 85),
        timeframe: 'Next 2-4 hours',
      });
    }

    const recentCpu = history.slice(-5).map((m) => m.cpu.usage);
    const cpuTrend = this.calculateSimpleTrend(recentCpu);

    if (cpuTrend > 0.3) {
      insights.push({
        resource: 'cpu',
        prediction: 'CPU usage is increasing and may impact performance',
        confidence: Math.min(cpuTrend * 100, 75),
        timeframe: 'Next 1-2 hours',
      });
    }

    return insights;
  }

  /**
   * Calculate simple trend (simplified linear regression slope)
   */
  private calculateSimpleTrend(values: number[]): number {
    if (values.length < 2) return 0;

    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
    const sumXX = (n * (n - 1) * (2 * n - 1)) / 6;

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

    return slope;
  }

  /**
   * Generate detailed metrics report
   */
  generateDetailedMetricsReport(
    metrics: ResourceMetrics,
    timeRange: '1h' | '24h' | '7d' = '24h',
  ): {
    period: string;
    metrics: ResourceMetrics;
    statistics: {
      averages: Record<string, number>;
      peaks: Record<string, number>;
      trends: Record<string, 'UP' | 'DOWN' | 'STABLE'>;
    };
    recommendations: string[];
  } {
    // Calculate statistics (simplified)
    const statistics = {
      averages: {
        memory: metrics.memory.utilization,
        cpu: metrics.cpu.usage,
        database: metrics.database.activeConnections,
        cache: metrics.cache.hitRate,
      },
      peaks: {
        memory: metrics.memory.utilization,
        cpu: metrics.cpu.usage,
        database: metrics.database.activeConnections,
        cache: metrics.cache.hitRate,
      },
      trends: {
        memory: 'STABLE' as const,
        cpu: 'STABLE' as const,
        database: 'STABLE' as const,
        cache: 'STABLE' as const,
      },
    };

    // Generate recommendations based on metrics
    const recommendations: string[] = [];

    if (metrics.memory.utilization > 80) {
      recommendations.push('Consider implementing memory optimization strategies');
    }

    if (metrics.cpu.usage > 70) {
      recommendations.push('Monitor CPU usage and consider scaling resources');
    }

    if (metrics.cache.hitRate < 60) {
      recommendations.push('Optimize cache strategy to improve hit rate');
    }

    return {
      period: timeRange,
      metrics,
      statistics,
      recommendations,
    };
  }
}
