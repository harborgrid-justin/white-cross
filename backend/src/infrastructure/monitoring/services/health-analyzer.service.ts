/**
 * @fileoverview Health Analyzer Service
 * @module infrastructure/monitoring/services
 * @description Service for analyzing health check results and generating insights
 */

import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '../../shared/base/BaseService';
import { LoggerService } from '../../shared/logging/logger.service';
import { HealthCheckResponse, HealthStatus } from '../interfaces/health-check.interface';
import {
  ResourceHealthInfo,
  ExternalServiceHealthInfo,
  DetailedHealthMetrics,
  EnhancedHealthCheckResponse,
  HealthTrends,
} from '../types/health-check.types';

@Injectable()
export class HealthAnalyzerService extends BaseService {
  /**
   * Determines enhanced overall status
   */
  determineEnhancedStatus(
    baseHealth: HealthCheckResponse,
    resources: ResourceHealthInfo,
    externalServices: ExternalServiceHealthInfo[],
    security: any,
  ): {
    status: HealthStatus;
    criticalIssues: string[];
    warnings: string[];
    recommendations: string[];
  } {
    const criticalIssues: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Check base health
    if (baseHealth.status === HealthStatus.UNHEALTHY) {
      criticalIssues.push('Core infrastructure components are unhealthy');
    } else if (baseHealth.status === HealthStatus.DEGRADED) {
      warnings.push('Some infrastructure components are degraded');
    }

    // Check resources
    if (resources.cpu.usage > 90) {
      criticalIssues.push(`Critical CPU usage: ${resources.cpu.usage}%`);
      recommendations.push('Scale up compute resources or optimize application performance');
    } else if (resources.cpu.usage > 80) {
      warnings.push(`High CPU usage: ${resources.cpu.usage}%`);
    }

    if (resources.memory.usage > 95) {
      criticalIssues.push(`Critical memory usage: ${resources.memory.usage}%`);
      recommendations.push('Scale up memory or investigate memory leaks');
    } else if (resources.memory.usage > 90) {
      warnings.push(`High memory usage: ${resources.memory.usage}%`);
    }

    // Check external services
    const downServices = externalServices.filter((s) => s.status === 'DOWN');
    const degradedServices = externalServices.filter((s) => s.status === 'DEGRADED');

    if (downServices.length > 0) {
      criticalIssues.push(`External services down: ${downServices.map((s) => s.name).join(', ')}`);
      recommendations.push('Check external service connectivity and status');
    }

    if (degradedServices.length > 0) {
      warnings.push(
        `External services degraded: ${degradedServices.map((s) => s.name).join(', ')}`,
      );
    }

    // Check security
    if (security?.threatLevel === 'HIGH') {
      criticalIssues.push('High security threat level detected');
      recommendations.push('Review security logs and implement additional protection measures');
    } else if (security?.threatLevel === 'MEDIUM') {
      warnings.push('Medium security threat level detected');
    }

    // Determine overall status
    let status = HealthStatus.HEALTHY;

    if (criticalIssues.length > 0 || baseHealth.status === HealthStatus.UNHEALTHY) {
      status = HealthStatus.UNHEALTHY;
    } else if (warnings.length > 0 || baseHealth.status === HealthStatus.DEGRADED) {
      status = HealthStatus.DEGRADED;
    }

    return {
      status,
      criticalIssues,
      warnings,
      recommendations,
    };
  }

  /**
   * Gets health trends and analytics
   */
  getHealthTrends(history: EnhancedHealthCheckResponse[]): HealthTrends {
    const availabilityTrend = history.slice(-20).map((h) => h.metrics.availability);
    const responseTimeTrend = history.slice(-20).map((h) => h.performance.responseTime);

    const errorSpikes = history
      .filter((h) => h.metrics.criticalIssues.length > 0)
      .map((h) => ({
        timestamp: h.timestamp,
        errors: h.metrics.criticalIssues,
      }))
      .slice(-10);

    return {
      availabilityTrend,
      responseTimeTrend,
      errorSpikes,
    };
  }

  /**
   * Analyzes health check performance
   */
  analyzePerformance(history: EnhancedHealthCheckResponse[]): {
    averageAvailability: number;
    averageResponseTime: number;
    uptimePercentage: number;
    mostCommonIssues: string[];
  } {
    if (history.length === 0) {
      return {
        averageAvailability: 0,
        averageResponseTime: 0,
        uptimePercentage: 0,
        mostCommonIssues: [],
      };
    }

    const totalAvailability = history.reduce((sum, h) => sum + h.metrics.availability, 0);
    const averageAvailability = totalAvailability / history.length;

    const totalResponseTime = history.reduce((sum, h) => sum + h.performance.responseTime, 0);
    const averageResponseTime = totalResponseTime / history.length;

    const healthyChecks = history.filter(h => h.status === HealthStatus.HEALTHY).length;
    const uptimePercentage = (healthyChecks / history.length) * 100;

    // Find most common issues
    const allIssues = history.flatMap(h => h.metrics.criticalIssues);
    const issueCounts = allIssues.reduce((counts, issue) => {
      counts[issue] = (counts[issue] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const mostCommonIssues = Object.entries(issueCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([issue]) => issue);

    return {
      averageAvailability,
      averageResponseTime,
      uptimePercentage,
      mostCommonIssues,
    };
  }

  /**
   * Generates health recommendations
   */
  generateRecommendations(
    currentHealth: EnhancedHealthCheckResponse,
    trends: HealthTrends,
  ): string[] {
    const recommendations: string[] = [];

    // Resource-based recommendations
    if (currentHealth.resources.cpu.usage > 80) {
      recommendations.push('Consider scaling compute resources or optimizing CPU-intensive operations');
    }

    if (currentHealth.resources.memory.usage > 85) {
      recommendations.push('Monitor memory usage patterns and consider memory optimization');
    }

    // Service-based recommendations
    const downServices = currentHealth.externalServices.filter(s => s.status === 'DOWN');
    if (downServices.length > 0) {
      recommendations.push(`Investigate connectivity issues with: ${downServices.map(s => s.name).join(', ')}`);
    }

    // Trend-based recommendations
    const avgAvailability = trends.availabilityTrend.reduce((a, b) => a + b, 0) / trends.availabilityTrend.length;
    if (avgAvailability < 95) {
      recommendations.push('Overall system availability is below 95% - review recent outages');
    }

    const avgResponseTime = trends.responseTimeTrend.reduce((a, b) => a + b, 0) / trends.responseTimeTrend.length;
    if (avgResponseTime > 1000) {
      recommendations.push('Average response time exceeds 1 second - consider performance optimization');
    }

    return recommendations;
  }
}
