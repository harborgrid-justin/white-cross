import { Injectable, Logger } from '@nestjs/common';

import { BaseService } from '@/common/base';
/**
 * Circuit breaker states
 */
export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
}

/**
 * Circuit breaker status
 */
export interface CircuitBreakerStatus {
  state: CircuitState;
  failures: number;
  nextAttempt?: Date;
}

/**
 * Circuit Breaker Service
 * Implements the circuit breaker pattern to prevent cascading failures
 * in external API integrations
 */
@Injectable()
export class CircuitBreakerService extends BaseService {
  constructor() {
    super("CircuitBreakerService");
  }

  private readonly circuits = new Map<
    string,
    {
      state: CircuitState;
      failureCount: number;
      successCount: number;
      nextAttempt: number;
      config: CircuitBreakerConfig;
    }
  >();

  /**
   * Initialize a circuit breaker for a specific service
   */
  initialize(
    serviceName: string,
    config: Partial<CircuitBreakerConfig> = {},
  ): void {
    const defaultConfig: CircuitBreakerConfig = {
      failureThreshold: 5,
      successThreshold: 2,
      timeout: 60000, // 60 seconds
    };

    this.circuits.set(serviceName, {
      state: CircuitState.CLOSED,
      failureCount: 0,
      successCount: 0,
      nextAttempt: Date.now(),
      config: { ...defaultConfig, ...config },
    });

    this.logInfo(`Circuit breaker initialized for ${serviceName}`);
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(serviceName: string, fn: () => Promise<T>): Promise<T> {
    if (!this.circuits.has(serviceName)) {
      this.initialize(serviceName);
    }

    const circuit = this.circuits.get(serviceName)!;

    // Check if circuit is open
    if (circuit.state === CircuitState.OPEN) {
      if (Date.now() < circuit.nextAttempt) {
        throw new Error(
          `Circuit breaker is OPEN for ${serviceName}. Retry after ${new Date(circuit.nextAttempt).toISOString()}`,
        );
      }
      // Transition to HALF_OPEN
      circuit.state = CircuitState.HALF_OPEN;
      circuit.successCount = 0;
      this.logInfo(`${serviceName} circuit breaker: OPEN -> HALF_OPEN`);
    }

    try {
      const result = await fn();
      this.recordSuccess(serviceName);
      return result;
    } catch (error) {
      this.recordFailure(serviceName);
      throw error;
    }
  }

  /**
   * Record a successful request
   */
  private recordSuccess(serviceName: string): void {
    const circuit = this.circuits.get(serviceName);
    if (!circuit) return;

    circuit.failureCount = 0;

    if (circuit.state === CircuitState.HALF_OPEN) {
      circuit.successCount++;

      if (circuit.successCount >= circuit.config.successThreshold) {
        circuit.state = CircuitState.CLOSED;
        circuit.successCount = 0;
        this.logInfo(`${serviceName} circuit breaker: HALF_OPEN -> CLOSED`);
      }
    }
  }

  /**
   * Record a failed request
   */
  private recordFailure(serviceName: string): void {
    const circuit = this.circuits.get(serviceName);
    if (!circuit) return;

    circuit.failureCount++;

    if (circuit.failureCount >= circuit.config.failureThreshold) {
      circuit.state = CircuitState.OPEN;
      circuit.nextAttempt = Date.now() + circuit.config.timeout;
      this.logError(`${serviceName} circuit breaker: CLOSED -> OPEN`, {
        failures: circuit.failureCount,
        nextAttempt: new Date(circuit.nextAttempt).toISOString(),
      });
    }
  }

  /**
   * Get circuit breaker status
   */
  getStatus(serviceName: string): CircuitBreakerStatus | null {
    const circuit = this.circuits.get(serviceName);
    if (!circuit) return null;

    return {
      state: circuit.state,
      failures: circuit.failureCount,
      nextAttempt:
        circuit.state === CircuitState.OPEN
          ? new Date(circuit.nextAttempt)
          : undefined,
    };
  }

  /**
   * Reset circuit breaker (for testing or manual intervention)
   */
  reset(serviceName: string): void {
    const circuit = this.circuits.get(serviceName);
    if (!circuit) return;

    circuit.state = CircuitState.CLOSED;
    circuit.failureCount = 0;
    circuit.successCount = 0;
    this.logInfo(`${serviceName} circuit breaker reset to CLOSED`);
  }
}
