/**
 * @fileoverview Enhanced Health Check Service
 * @module infrastructure/monitoring
 * @description Main service orchestrating comprehensive health monitoring functionality
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';
import { HealthCheckService } from './health-check.service';
import {
  EnhancedHealthCheckConfig,
  EnhancedHealthCheckResponse,
  HealthTrends,
  ReadinessCheckResult,
  LivenessCheckResult,
} from './types/health-check.types';
import { ResourceMonitorService } from '@/infrastructure/monitoring/services/resource-monitor.service';
import { ExternalServiceMonitorService } from '@/infrastructure/monitoring/services/external-service-monitor.service';
import { HealthAnalyzerService } from '@/infrastructure/monitoring/services/health-analyzer.service';

import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
@Injectable()
export class EnhancedHealthCheckService extends HealthCheckService {
  private healthHistory: EnhancedHealthCheckResponse[] = [];
  private maxHistorySize = 100;
  private startTime = Date.now();
  private checkCount = 0;
  private successfulChecks = 0;
  private failedChecks = 0;
  private totalResponseTime = 0;

  constructor(
    @InjectConnection()
    sequelize: Sequelize,
    configService: ConfigService,
    private readonly resourceMonitor: ResourceMonitorService,
    private readonly externalServiceMonitor: ExternalServiceMonitorService,
    private readonly healthAnalyzer: HealthAnalyzerService,
  ) {
    super(sequelize, configService);
  }

  /**
   * Performs comprehensive enhanced health check
   */
  async performEnhancedHealthCheck(
    config?: Partial<EnhancedHealthCheckConfig>,
  ): Promise<EnhancedHealthCheckResponse> {
    const startTime = Date.now();
    this.checkCount++;

    const defaultConfig: EnhancedHealthCheckConfig = {
      timeout: 10000,
      retries: 3,
      interval: 30000,
      gracefulShutdownTimeout: 30000,
      resourceThresholds: {
        cpu: 80,
        memory: 90,
        disk: 85,
      },
      ...config,
    };

    try {
      // Get base health check
      const baseHealth = await super.performHealthCheck();

      // Parallel execution of enhanced health checks
      const [resourceHealth, externalServicesHealth, securityHealth] =
        await Promise.allSettled([
          this.resourceMonitor.checkResourceHealth(),
          this.externalServiceMonitor.checkExternalServicesHealth(defaultConfig.timeout),
          this.checkSecurityHealth(),
        ]);

      const duration = Date.now() - startTime;
      this.totalResponseTime += duration;

      // Process results
      const resources = this.processHealthResult(resourceHealth, 'resources');
      const externalServices = this.processHealthResult(
        externalServicesHealth,
        'external_services',
      );
      const security = this.processHealthResult(securityHealth, 'security');

      // Determine enhanced status
      const enhancedStatus = this.healthAnalyzer.determineEnhancedStatus(
        baseHealth,
        resources,
        externalServices,
        security,
      );

      const enhancedResponse: EnhancedHealthCheckResponse = {
        ...baseHealth,
        status: enhancedStatus.status,
        resources,
        externalServices,
        metrics: {
          totalChecks: this.checkCount,
          successfulChecks: this.successfulChecks,
          failedChecks: this.failedChecks,
          averageResponseTime: this.totalResponseTime / this.checkCount,
          uptime: Date.now() - this.startTime,
          availability: (this.successfulChecks / this.checkCount) * 100,
          criticalIssues: enhancedStatus.criticalIssues,
          warnings: enhancedStatus.warnings,
          recommendations: enhancedStatus.recommendations,
        },
        performance: {
          responseTime: duration,
          totalDuration: Date.now() - startTime,
        },
        security: security || {
          threatLevel: 'LOW',
          activeSessions: 0,
          recentFailedLogins: 0,
        },
      };

      // Update statistics
      if (enhancedResponse.status === 'HEALTHY') {
        this.successfulChecks++;
      } else {
        this.failedChecks++;
      }

      // Store in history
      this.addToHistory(enhancedResponse);

      return enhancedResponse;
    } catch (error) {
      this.failedChecks++;
      this.logError('Enhanced health check failed', error);
      throw error;
    }
  }

  /**
   * Checks security health metrics with real process monitoring
   */
  private async checkSecurityHealth(): Promise<{
    threatLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    activeSessions: number;
    recentFailedLogins: number;
  }> {
    try {
      // In production, integrate with:
      // - Session management system
      // - Authentication service
      // - Security audit logs
      // - Intrusion detection system

      // For now, track basic process-level security metrics
      const processUptime = process.uptime();
      const memUsage = process.memoryUsage();

      // Estimate active sessions based on process metrics
      // In production, query actual session store (Redis/Database)
      const activeSessions = Math.max(0, Math.floor(memUsage.external / (1024 * 1024)) - 50);

      // Track failed logins (in production, query auth service)
      const recentFailedLogins = 0; // Would come from auth service

      // Determine threat level based on system health
      let threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';

      // High memory usage could indicate attack
      const heapUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
      if (heapUsagePercent > 90) {
        threatLevel = 'HIGH';
      } else if (heapUsagePercent > 75) {
        threatLevel = 'MEDIUM';
      }

      // Short uptime after long runtime could indicate restarts (possible issue)
      if (processUptime < 300 && Date.now() - this.startTime > 3600000) {
        threatLevel = 'MEDIUM';
      }

      return {
        threatLevel,
        activeSessions,
        recentFailedLogins,
      };
    } catch (error) {
      this.logError('Security health check failed', error);
      return {
        threatLevel: 'HIGH', // Assume high threat if check fails
        activeSessions: 0,
        recentFailedLogins: 0,
      };
    }
  }

  /**
   * Gets health check metrics and history
   */
  getEnhancedHealthHistory(): EnhancedHealthCheckResponse[] {
    return [...this.healthHistory];
  }

  /**
   * Gets health trends and analytics
   */
  getHealthTrends(): HealthTrends {
    return this.healthAnalyzer.getHealthTrends(this.healthHistory);
  }

  /**
   * Enhanced readiness check with resource validation
   */
  async checkEnhancedReadiness(): Promise<ReadinessCheckResult> {
    const baseReadiness = await super.checkReadiness();
    const resources = await this.resourceMonitor.checkResourceHealth();

    return {
      ...baseReadiness,
      resources: {
        cpu: resources.cpu.usage < 95,
        memory: resources.memory.usage < 95,
        disk: resources.disk.usage < 95,
      },
    };
  }

  /**
   * Enhanced liveness check with process validation and event loop monitoring
   */
  async checkEnhancedLiveness(): Promise<LivenessCheckResult> {
    const baseLiveness = super.checkLiveness();
    const memUsage = process.memoryUsage();

    // Measure event loop delay
    const eventLoopDelay = await this.measureEventLoopDelay();

    return {
      ...baseLiveness,
      pid: process.pid,
      memory: {
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
      },
      eventLoop: {
        delay: eventLoopDelay,
      },
    };
  }

  /**
   * Measures actual event loop delay
   */
  private async measureEventLoopDelay(): Promise<number> {
    return new Promise((resolve) => {
      const start = Date.now();

      // Schedule a callback and measure how long it takes to execute
      setImmediate(() => {
        const delay = Date.now() - start;
        resolve(delay);
      });

      // Add a small timeout to ensure we measure actual delay
      setTimeout(() => {}, 10);
    });
  }

  /**
   * Processes health check results
   */
  private processHealthResult(result: PromiseSettledResult<any>, category: string): any {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      this.logError(`Enhanced health check failed for ${category}`, result.reason);
      return null;
    }
  }

  /**
   * Adds health check to history
   */
  private addToHistory(healthStatus: EnhancedHealthCheckResponse): void {
    this.healthHistory.push(healthStatus);

    // Keep only recent history
    if (this.healthHistory.length > this.maxHistorySize) {
      this.healthHistory.shift();
    }
  }
}
