/**
 * Circuit Breaker Utility
 *
 * Implements circuit breaker pattern for external services to prevent
 * cascading failures in healthcare integrations.
 *
 * Circuit breaker has three states:
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Failure threshold exceeded, requests fail fast
 * - HALF_OPEN: Testing if service recovered, limited requests allowed
 *
 * @module CircuitBreakerUtil
 */

import { Logger } from '@nestjs/common';

/**
 * Circuit breaker states
 */
export enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

/**
 * Circuit breaker configuration options
 */
export interface CircuitBreakerOptions {
  /**
   * Number of consecutive failures before opening circuit (default: 5)
   */
  failureThreshold?: number;

  /**
   * Time in milliseconds to wait before attempting half-open state (default: 60000ms)
   */
  timeout?: number;

  /**
   * Number of successful requests in half-open state before closing circuit (default: 2)
   */
  successThreshold?: number;

  /**
   * Maximum number of requests to allow in half-open state (default: 3)
   */
  halfOpenMaxAttempts?: number;

  /**
   * Name of the circuit breaker for logging and monitoring
   */
  name: string;

  /**
   * Custom logger instance
   */
  logger?: Logger;
}

/**
 * Circuit breaker statistics
 */
export interface CircuitBreakerStats {
  state: CircuitBreakerState;
  failureCount: number;
  successCount: number;
  lastFailureTime?: Date;
  lastSuccessTime?: Date;
  totalRequests: number;
  totalFailures: number;
  totalSuccesses: number;
  halfOpenAttempts: number;
}

/**
 * Custom circuit breaker open error
 */
export class CircuitBreakerOpenError extends Error {
  constructor(message: string, public readonly circuitBreakerName: string) {
    super(message);
    this.name = 'CircuitBreakerOpenError';
  }
}

/**
 * Circuit Breaker implementation
 *
 * @example
 * ```typescript
 * // Create circuit breaker for Epic API
 * const epicCircuitBreaker = new CircuitBreaker({
 *   failureThreshold: 5,
 *   timeout: 60000,
 *   name: 'epic-api'
 * });
 *
 * // Execute operation through circuit breaker
 * try {
 *   const result = await epicCircuitBreaker.execute(async () => {
 *     const response = await this.httpService.post(epicEndpoint, data);
 *     if (response.status !== 200) {
 *       throw new Error(`Epic API returned ${response.status}`);
 *     }
 *     return response.data;
 *   });
 *   return result;
 * } catch (error) {
 *   if (error instanceof CircuitBreakerOpenError) {
 *     this.logger.warn('Epic API circuit breaker is open');
 *     throw new ServiceUnavailableException('Epic API is currently unavailable');
 *   }
 *   throw error;
 * }
 * ```
 */
export class CircuitBreaker {
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED;
  private failureCount: number = 0;
  private successCount: number = 0;
  private lastFailureTime?: Date;
  private lastSuccessTime?: Date;
  private nextAttemptTime?: Date;
  private totalRequests: number = 0;
  private totalFailures: number = 0;
  private totalSuccesses: number = 0;
  private halfOpenAttempts: number = 0;

  private readonly failureThreshold: number;
  private readonly timeout: number;
  private readonly successThreshold: number;
  private readonly halfOpenMaxAttempts: number;
  private readonly name: string;
  private readonly logger: Logger;

  constructor(options: CircuitBreakerOptions) {
    this.failureThreshold = options.failureThreshold ?? 5;
    this.timeout = options.timeout ?? 60000;
    this.successThreshold = options.successThreshold ?? 2;
    this.halfOpenMaxAttempts = options.halfOpenMaxAttempts ?? 3;
    this.name = options.name;
    this.logger = options.logger || new Logger(`CircuitBreaker:${this.name}`);
  }

  /**
   * Executes an operation through the circuit breaker
   *
   * @param operation - The async function to execute
   * @returns Promise that resolves with operation result
   * @throws CircuitBreakerOpenError if circuit is open
   */
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    this.totalRequests++;

    // Check if circuit should transition from OPEN to HALF_OPEN
    if (this.state === CircuitBreakerState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.transitionToHalfOpen();
      } else {
        throw new CircuitBreakerOpenError(
          `Circuit breaker "${this.name}" is OPEN`,
          this.name
        );
      }
    }

    // In HALF_OPEN state, limit number of attempts
    if (this.state === CircuitBreakerState.HALF_OPEN) {
      if (this.halfOpenAttempts >= this.halfOpenMaxAttempts) {
        throw new CircuitBreakerOpenError(
          `Circuit breaker "${this.name}" is HALF_OPEN with max attempts reached`,
          this.name
        );
      }
      this.halfOpenAttempts++;
    }

    try {
      // Execute operation
      const result = await operation();

      // Record success
      this.onSuccess();

      return result;
    } catch (error) {
      // Record failure
      this.onFailure();

      throw error;
    }
  }

  /**
   * Records a successful operation
   */
  private onSuccess(): void {
    this.totalSuccesses++;
    this.successCount++;
    this.lastSuccessTime = new Date();

    if (this.state === CircuitBreakerState.HALF_OPEN) {
      // Check if we've reached success threshold to close circuit
      if (this.successCount >= this.successThreshold) {
        this.transitionToClosed();
      }
    } else if (this.state === CircuitBreakerState.CLOSED) {
      // Reset failure count on success in closed state
      this.failureCount = 0;
    }
  }

  /**
   * Records a failed operation
   */
  private onFailure(): void {
    this.totalFailures++;
    this.failureCount++;
    this.lastFailureTime = new Date();

    if (this.state === CircuitBreakerState.HALF_OPEN) {
      // Any failure in half-open state reopens circuit
      this.transitionToOpen();
    } else if (this.state === CircuitBreakerState.CLOSED) {
      // Check if we've reached failure threshold to open circuit
      if (this.failureCount >= this.failureThreshold) {
        this.transitionToOpen();
      }
    }
  }

  /**
   * Checks if circuit should attempt reset (transition to HALF_OPEN)
   */
  private shouldAttemptReset(): boolean {
    if (!this.nextAttemptTime) {
      return true;
    }
    return new Date() >= this.nextAttemptTime;
  }

  /**
   * Transitions circuit breaker to CLOSED state
   */
  private transitionToClosed(): void {
    this.logger.log(`Circuit breaker "${this.name}" transitioning to CLOSED`);
    this.state = CircuitBreakerState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.halfOpenAttempts = 0;
    this.nextAttemptTime = undefined;
  }

  /**
   * Transitions circuit breaker to OPEN state
   */
  private transitionToOpen(): void {
    this.logger.warn(`Circuit breaker "${this.name}" transitioning to OPEN`, {
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
      timeout: this.timeout
    });
    this.state = CircuitBreakerState.OPEN;
    this.nextAttemptTime = new Date(Date.now() + this.timeout);
    this.successCount = 0;
    this.halfOpenAttempts = 0;
  }

  /**
   * Transitions circuit breaker to HALF_OPEN state
   */
  private transitionToHalfOpen(): void {
    this.logger.log(`Circuit breaker "${this.name}" transitioning to HALF_OPEN`);
    this.state = CircuitBreakerState.HALF_OPEN;
    this.failureCount = 0;
    this.successCount = 0;
    this.halfOpenAttempts = 0;
  }

  /**
   * Gets current circuit breaker state
   */
  getState(): CircuitBreakerState {
    return this.state;
  }

  /**
   * Gets current failure count
   */
  getFailureCount(): number {
    return this.failureCount;
  }

  /**
   * Gets current success count
   */
  getSuccessCount(): number {
    return this.successCount;
  }

  /**
   * Gets circuit breaker statistics
   */
  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      totalRequests: this.totalRequests,
      totalFailures: this.totalFailures,
      totalSuccesses: this.totalSuccesses,
      halfOpenAttempts: this.halfOpenAttempts
    };
  }

  /**
   * Manually resets circuit breaker to CLOSED state
   */
  reset(): void {
    this.logger.log(`Circuit breaker "${this.name}" manually reset`);
    this.transitionToClosed();
  }

  /**
   * Gets circuit breaker name
   */
  getName(): string {
    return this.name;
  }
}

/**
 * Checks if an error is a CircuitBreakerOpenError
 *
 * @param error - The error to check
 * @returns true if the error is a CircuitBreakerOpenError
 */
export function isCircuitBreakerOpenError(error: any): error is CircuitBreakerOpenError {
  return error instanceof CircuitBreakerOpenError || error?.name === 'CircuitBreakerOpenError';
}

/**
 * Standard circuit breaker configurations for healthcare services
 */
export const CIRCUIT_BREAKER_CONFIGS = {
  /** Default configuration (5 failures, 60s timeout) */
  DEFAULT: {
    failureThreshold: 5,
    timeout: 60000,
    successThreshold: 2,
    halfOpenMaxAttempts: 3
  },

  /** Epic EHR (5 failures, 60s timeout) */
  EPIC: {
    failureThreshold: 5,
    timeout: 60000,
    successThreshold: 2,
    halfOpenMaxAttempts: 3
  },

  /** Cerner Millennium (5 failures, 60s timeout) */
  CERNER: {
    failureThreshold: 5,
    timeout: 60000,
    successThreshold: 2,
    halfOpenMaxAttempts: 3
  },

  /** Surescripts e-Prescribing (5 failures, 90s timeout - longer due to DEA) */
  SURESCRIPTS: {
    failureThreshold: 5,
    timeout: 90000,
    successThreshold: 2,
    halfOpenMaxAttempts: 3
  },

  /** HIE networks (3 failures, 120s timeout - more sensitive) */
  HIE: {
    failureThreshold: 3,
    timeout: 120000,
    successThreshold: 2,
    halfOpenMaxAttempts: 2
  },

  /** Insurance clearinghouses (5 failures, 60s timeout) */
  INSURANCE: {
    failureThreshold: 5,
    timeout: 60000,
    successThreshold: 2,
    halfOpenMaxAttempts: 3
  },

  /** Laboratory systems (5 failures, 60s timeout) */
  LABORATORY: {
    failureThreshold: 5,
    timeout: 60000,
    successThreshold: 2,
    halfOpenMaxAttempts: 3
  }
};

/**
 * Circuit breaker registry for managing multiple circuit breakers
 */
export class CircuitBreakerRegistry {
  private static instance: CircuitBreakerRegistry;
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();
  private readonly logger = new Logger('CircuitBreakerRegistry');

  private constructor() {}

  /**
   * Gets singleton instance of circuit breaker registry
   */
  static getInstance(): CircuitBreakerRegistry {
    if (!CircuitBreakerRegistry.instance) {
      CircuitBreakerRegistry.instance = new CircuitBreakerRegistry();
    }
    return CircuitBreakerRegistry.instance;
  }

  /**
   * Gets or creates a circuit breaker
   *
   * @param name - Circuit breaker name
   * @param options - Circuit breaker options (used if creating new)
   * @returns Circuit breaker instance
   */
  getOrCreate(name: string, options?: Omit<CircuitBreakerOptions, 'name'>): CircuitBreaker {
    if (!this.circuitBreakers.has(name)) {
      this.logger.log(`Creating new circuit breaker: ${name}`);
      const circuitBreaker = new CircuitBreaker({
        ...options,
        name
      });
      this.circuitBreakers.set(name, circuitBreaker);
    }
    return this.circuitBreakers.get(name)!;
  }

  /**
   * Gets all circuit breakers
   */
  getAll(): Map<string, CircuitBreaker> {
    return new Map(this.circuitBreakers);
  }

  /**
   * Gets statistics for all circuit breakers
   */
  getAllStats(): Record<string, CircuitBreakerStats> {
    const stats: Record<string, CircuitBreakerStats> = {};
    for (const [name, circuitBreaker] of this.circuitBreakers.entries()) {
      stats[name] = circuitBreaker.getStats();
    }
    return stats;
  }

  /**
   * Resets all circuit breakers
   */
  resetAll(): void {
    this.logger.log('Resetting all circuit breakers');
    for (const circuitBreaker of this.circuitBreakers.values()) {
      circuitBreaker.reset();
    }
  }

  /**
   * Clears all circuit breakers from registry
   */
  clear(): void {
    this.logger.log('Clearing circuit breaker registry');
    this.circuitBreakers.clear();
  }
}
