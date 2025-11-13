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
import { ResourceMonitorService } from './services/resource-monitor.service';
import { ExternalServiceMonitorService } from './services/external-service-monitor.service';
import { HealthAnalyzerService } from './services/health-analyzer.service';

import { BaseService } from '../../common/base';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
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
   * Checks security health metrics
   */
  private async checkSecurityHealth(): Promise<{
    threatLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    activeSessions: number;
    recentFailedLogins: number;
  }> {
    try {
      // Mock implementation - in production, integrate with actual security monitoring
      const activeSessions = Math.floor(Math.random() * 100);
      const recentFailedLogins = Math.floor(Math.random() * 10);

      let threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';

      if (recentFailedLogins > 50) {
        threatLevel = 'HIGH';
      } else if (recentFailedLogins > 20) {
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
   * Enhanced liveness check with process validation
   */
  checkEnhancedLiveness(): LivenessCheckResult {
    const baseLiveness = super.checkLiveness();
    const memUsage = process.memoryUsage();

    return {
      ...baseLiveness,
      pid: process.pid,
      memory: {
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
      },
      eventLoop: {
        delay: 0, // Mock - in production, measure actual event loop delay
      },
    };
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
