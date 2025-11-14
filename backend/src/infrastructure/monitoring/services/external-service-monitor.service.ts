/**
 * @fileoverview External Service Monitor Service
 * @module infrastructure/monitoring/services
 * @description Service for monitoring external service health
 */

import { Injectable, Logger } from '@nestjs/common';
import { ExternalServiceHealthInfo } from '../types/health-check.types';
import * as https from 'https';
import * as http from 'http';
import { URL } from 'url';

import { BaseService } from '@/common/base';

/**
 * Circuit Breaker States
 */
enum CircuitState {
  CLOSED = 'CLOSED',    // Normal operation
  OPEN = 'OPEN',        // Failing, reject requests
  HALF_OPEN = 'HALF_OPEN' // Testing if service recovered
}

/**
 * Circuit Breaker for each service
 */
interface CircuitBreaker {
  state: CircuitState;
  failureCount: number;
  successCount: number;
  lastFailureTime: number;
  nextAttemptTime: number;
}
@Injectable()
export class ExternalServiceMonitorService extends BaseService {
  private circuitBreakers = new Map<string, CircuitBreaker>();
  private readonly failureThreshold = 5; // Open circuit after 5 failures
  private readonly successThreshold = 2; // Close circuit after 2 successes in HALF_OPEN
  private readonly timeout = 60000; // Wait 60 seconds before retry after OPEN

  constructor() {
    super("ExternalServiceMonitorService");
  }

  /**
   * Gets or creates circuit breaker for a service
   */
  private getCircuitBreaker(serviceName: string): CircuitBreaker {
    if (!this.circuitBreakers.has(serviceName)) {
      this.circuitBreakers.set(serviceName, {
        state: CircuitState.CLOSED,
        failureCount: 0,
        successCount: 0,
        lastFailureTime: 0,
        nextAttemptTime: 0,
      });
    }
    return this.circuitBreakers.get(serviceName)!;
  }

  /**
   * Checks if circuit breaker allows request
   */
  private canAttempt(breaker: CircuitBreaker): boolean {
    if (breaker.state === CircuitState.CLOSED) {
      return true;
    }

    if (breaker.state === CircuitState.OPEN) {
      if (Date.now() >= breaker.nextAttemptTime) {
        breaker.state = CircuitState.HALF_OPEN;
        breaker.successCount = 0;
        return true;
      }
      return false;
    }

    // HALF_OPEN state
    return true;
  }

  /**
   * Records successful request
   */
  private recordSuccess(breaker: CircuitBreaker): void {
    breaker.failureCount = 0;

    if (breaker.state === CircuitState.HALF_OPEN) {
      breaker.successCount++;
      if (breaker.successCount >= this.successThreshold) {
        breaker.state = CircuitState.CLOSED;
        this.logInfo('Circuit breaker CLOSED - service recovered');
      }
    }
  }

  /**
   * Records failed request
   */
  private recordFailure(breaker: CircuitBreaker, serviceName: string): void {
    breaker.failureCount++;
    breaker.lastFailureTime = Date.now();
    breaker.successCount = 0;

    if (breaker.state === CircuitState.HALF_OPEN) {
      breaker.state = CircuitState.OPEN;
      breaker.nextAttemptTime = Date.now() + this.timeout;
      this.logWarning(`Circuit breaker OPEN for ${serviceName} - service still failing`);
    } else if (breaker.failureCount >= this.failureThreshold) {
      breaker.state = CircuitState.OPEN;
      breaker.nextAttemptTime = Date.now() + this.timeout;
      this.logError(`Circuit breaker OPEN for ${serviceName} after ${breaker.failureCount} failures`);
    }
  }

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
   * Checks health of a single external service with circuit breaker
   */
  private async checkSingleService(
    name: string,
    url: string,
    timeout: number,
  ): Promise<ExternalServiceHealthInfo> {
    const startTime = Date.now();
    const breaker = this.getCircuitBreaker(name);

    // Check circuit breaker
    if (!this.canAttempt(breaker)) {
      const responseTime = Date.now() - startTime;
      return {
        name,
        url,
        status: 'DOWN',
        responseTime,
        lastChecked: new Date(),
        lastError: 'Circuit breaker OPEN - too many failures',
        consecutiveFailures: breaker.failureCount,
      };
    }

    try {
      const response = await this.performHttpCheck(url, timeout);
      const responseTime = Date.now() - startTime;

      // Record success in circuit breaker
      this.recordSuccess(breaker);

      return {
        name,
        url,
        status: response.statusCode >= 200 && response.statusCode < 300 ? 'UP' : 'DEGRADED',
        responseTime,
        lastChecked: new Date(),
        consecutiveFailures: 0,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      // Record failure in circuit breaker
      this.recordFailure(breaker, name);

      throw new Error(`Service ${name} health check failed: ${error}`);
    }
  }

  /**
   * Performs real HTTP health check
   */
  private async performHttpCheck(urlString: string, timeout: number): Promise<{ statusCode: number }> {
    return new Promise((resolve, reject) => {
      try {
        const parsedUrl = new URL(urlString);
        const isHttps = parsedUrl.protocol === 'https:';
        const client = isHttps ? https : http;

        const options = {
          hostname: parsedUrl.hostname,
          port: parsedUrl.port || (isHttps ? 443 : 80),
          path: parsedUrl.pathname + parsedUrl.search,
          method: 'GET',
          timeout,
          headers: {
            'User-Agent': 'WhiteCross-HealthCheck/1.0',
            'Accept': 'application/json',
          },
        };

        const req = client.request(options, (res) => {
          // Consume response data to free up memory
          res.on('data', () => {});
          res.on('end', () => {
            resolve({ statusCode: res.statusCode || 500 });
          });
        });

        req.on('error', (error) => {
          reject(error);
        });

        req.on('timeout', () => {
          req.destroy();
          reject(new Error(`Request timeout after ${timeout}ms`));
        });

        req.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Gets circuit breaker status for all services
   */
  getCircuitBreakerStatus(): Array<{
    serviceName: string;
    state: string;
    failureCount: number;
    successCount: number;
  }> {
    const status: Array<{
      serviceName: string;
      state: string;
      failureCount: number;
      successCount: number;
    }> = [];

    for (const [serviceName, breaker] of this.circuitBreakers.entries()) {
      status.push({
        serviceName,
        state: breaker.state,
        failureCount: breaker.failureCount,
        successCount: breaker.successCount,
      });
    }

    return status;
  }

  /**
   * Manually resets circuit breaker for a service
   */
  resetCircuitBreaker(serviceName: string): boolean {
    const breaker = this.circuitBreakers.get(serviceName);
    if (breaker) {
      breaker.state = CircuitState.CLOSED;
      breaker.failureCount = 0;
      breaker.successCount = 0;
      this.logInfo(`Circuit breaker manually reset for ${serviceName}`);
      return true;
    }
    return false;
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
