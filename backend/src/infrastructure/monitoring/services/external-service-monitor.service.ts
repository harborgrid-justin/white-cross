/**
 * @fileoverview External Service Monitor Service
 * @module infrastructure/monitoring/services
 * @description Service for monitoring external service health
 */

import { Injectable, Logger } from '@nestjs/common';
import { ExternalServiceHealthInfo } from '../types/health-check.types';

import { BaseService } from '@/common/base';
@Injectable()
export class ExternalServiceMonitorService extends BaseService {
  /**
   * Checks external services health
   */
  async checkExternalServicesHealth(timeout: number): Promise<ExternalServiceHealthInfo[]> {
    // Define external services to check
    const services = [
      {
        name: 'auth_service',
        url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001/health',
      },
      {
        name: 'notification_service',
        url: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3002/health',
      },
      {
        name: 'sis_integration',
        url: process.env.SIS_INTEGRATION_URL || 'http://localhost:3003/health',
      },
    ];

    const results: ExternalServiceHealthInfo[] = [];

    for (const service of services) {
      try {
        const healthInfo = await this.checkSingleService(service.name, service.url, timeout);
        results.push(healthInfo);
      } catch (error) {
        results.push({
          name: service.name,
          url: service.url,
          status: 'DOWN',
          responseTime: timeout,
          lastChecked: new Date(),
          lastError: error instanceof Error ? error.message : 'Unknown error',
          consecutiveFailures: 1,
        });
      }
    }

    return results;
  }

  /**
   * Checks health of a single external service
   */
  private async checkSingleService(
    name: string,
    url: string,
    timeout: number,
  ): Promise<ExternalServiceHealthInfo> {
    const startTime = Date.now();

    try {
      // Mock HTTP request - in production, use actual HTTP client like axios
      const response = await this.performHttpCheck(url, timeout);
      const responseTime = Date.now() - startTime;

      return {
        name,
        url,
        status: response.ok ? 'UP' : 'DEGRADED',
        responseTime,
        lastChecked: new Date(),
        consecutiveFailures: 0,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      throw new Error(`Service ${name} health check failed: ${error}`);
    }
  }

  /**
   * Performs HTTP check (mock implementation)
   */
  private async performHttpCheck(url: string, timeout: number): Promise<{ ok: boolean }> {
    // Mock HTTP check - replace with actual HTTP client in production
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          // 90% success rate
          resolve({ ok: true });
        } else {
          reject(new Error('Service unavailable'));
        }
      }, Math.random() * 200);
    });
  }

  /**
   * Gets service health summary
   */
  getServiceHealthSummary(services: ExternalServiceHealthInfo[]): {
    total: number;
    up: number;
    down: number;
    degraded: number;
    averageResponseTime: number;
  } {
    const up = services.filter(s => s.status === 'UP').length;
    const down = services.filter(s => s.status === 'DOWN').length;
    const degraded = services.filter(s => s.status === 'DEGRADED').length;

    const totalResponseTime = services.reduce((sum, s) => sum + s.responseTime, 0);
    const averageResponseTime = services.length > 0 ? totalResponseTime / services.length : 0;

    return {
      total: services.length,
      up,
      down,
      degraded,
      averageResponseTime,
    };
  }
}
