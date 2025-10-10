/**
 * Circuit Breaker Implementation for Medication Module
 *
 * Implements the Circuit Breaker pattern with different levels of protection
 * for medication operations based on criticality.
 *
 * @see MEDICATION_RESILIENCE_ARCHITECTURE.md
 */

import { EventEmitter } from 'events';
import { logger } from '../logger';

export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export enum ResilienceLevel {
  CRITICAL = 1,    // Medication administration, adverse reactions
  HIGH = 2,        // Prescription management
  STANDARD = 3,    // Inventory, search, reports
}

export interface CircuitBreakerConfig {
  name: string;
  level: ResilienceLevel;

  // Failure thresholds
  failureThreshold: number;
  failurePercentage?: number;
  successThreshold: number;

  // Timing
  timeout: number;
  resetTimeout: number;

  // Request volume
  volumeThreshold: number;
  rollingWindowMs: number;
  halfOpenRequests: number;

  // Fallback
  fallbackStrategy?: 'QUEUE_LOCAL' | 'CACHED_DATA_WITH_WARNING' | 'STALE_DATA_ALLOWED';
  cacheMaxAge?: number;

  // Monitoring
  alertOnOpen: boolean;
  alertChannel?: string;
  escalationDelay?: number;
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failures: number;
  successes: number;
  totalRequests: number;
  failureRate: number;
  lastFailureTime?: Date;
  lastSuccessTime?: Date;
  stateTransitions: number;
  halfOpenAttempts: number;
}

interface RequestRecord {
  timestamp: number;
  success: boolean;
  duration: number;
}

export class CircuitBreaker extends EventEmitter {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private successCount: number = 0;
  private halfOpenAttempts: number = 0;
  private lastFailureTime?: Date;
  private lastSuccessTime?: Date;
  private stateTransitions: number = 0;
  private nextAttempt?: Date;
  private requestHistory: RequestRecord[] = [];

  constructor(private config: CircuitBreakerConfig) {
    super();
    this.setupMetrics();
  }

  /**
   * Execute operation with circuit breaker protection
   */
  async execute<T>(
    operation: () => Promise<T>,
    options?: {
      fallback?: () => Promise<T>;
      context?: Record<string, any>;
    }
  ): Promise<T> {
    // Check if circuit is open
    if (this.state === CircuitState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.transitionTo(CircuitState.HALF_OPEN);
      } else {
        // Circuit is open, execute fallback if available
        if (options?.fallback) {
          logger.warn(`Circuit breaker ${this.config.name} is OPEN, executing fallback`);
          this.emit('fallback', { circuit: this.config.name, context: options.context });
          return options.fallback();
        }

        throw new CircuitBreakerOpenError(
          `Circuit breaker ${this.config.name} is OPEN`,
          this.nextAttempt
        );
      }
    }

    // Half-open state: limit concurrent requests
    if (this.state === CircuitState.HALF_OPEN) {
      if (this.halfOpenAttempts >= this.config.halfOpenRequests) {
        throw new CircuitBreakerOpenError(
          `Circuit breaker ${this.config.name} is HALF_OPEN with max requests`,
          this.nextAttempt
        );
      }
      this.halfOpenAttempts++;
    }

    // Execute with timeout
    const startTime = Date.now();

    try {
      const result = await this.executeWithTimeout(operation);

      const duration = Date.now() - startTime;
      this.recordSuccess(duration);

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      this.recordFailure(duration, error);

      // Try fallback on failure
      if (options?.fallback) {
        logger.warn(`Operation failed in ${this.config.name}, executing fallback`, { error });
        this.emit('fallback', { circuit: this.config.name, error, context: options.context });
        return options.fallback();
      }

      throw error;
    }
  }

  /**
   * Execute operation with timeout
   */
  private async executeWithTimeout<T>(operation: () => Promise<T>): Promise<T> {
    return Promise.race([
      operation(),
      new Promise<T>((_, reject) => {
        setTimeout(() => {
          reject(new TimeoutError(
            `Operation timed out after ${this.config.timeout}ms in circuit ${this.config.name}`
          ));
        }, this.config.timeout);
      }),
    ]);
  }

  /**
   * Record successful operation
   */
  private recordSuccess(duration: number): void {
    this.successCount++;
    this.lastSuccessTime = new Date();

    this.addRequestRecord({ timestamp: Date.now(), success: true, duration });

    // State transition logic
    if (this.state === CircuitState.HALF_OPEN) {
      if (this.successCount >= this.config.successThreshold) {
        this.transitionTo(CircuitState.CLOSED);
        this.reset();
      }
    } else if (this.state === CircuitState.CLOSED) {
      // Reset failure count on success in closed state
      this.failureCount = 0;
    }

    this.emit('success', {
      circuit: this.config.name,
      duration,
      state: this.state,
    });
  }

  /**
   * Record failed operation
   */
  private recordFailure(duration: number, error: any): void {
    this.failureCount++;
    this.lastFailureTime = new Date();

    this.addRequestRecord({ timestamp: Date.now(), success: false, duration });

    // Check if should open circuit
    if (this.shouldOpenCircuit()) {
      this.transitionTo(CircuitState.OPEN);
      this.nextAttempt = new Date(Date.now() + this.config.resetTimeout);

      // Alert on circuit open
      if (this.config.alertOnOpen) {
        this.alertCircuitOpen();
      }
    }

    this.emit('failure', {
      circuit: this.config.name,
      error,
      duration,
      state: this.state,
      failureCount: this.failureCount,
    });
  }

  /**
   * Check if circuit should open based on failure threshold
   */
  private shouldOpenCircuit(): boolean {
    // Clean old records
    this.cleanRequestHistory();

    // Check volume threshold
    if (this.requestHistory.length < this.config.volumeThreshold) {
      return false;
    }

    // Check failure count threshold
    if (this.failureCount >= this.config.failureThreshold) {
      return true;
    }

    // Check failure percentage threshold
    if (this.config.failurePercentage !== undefined) {
      const failures = this.requestHistory.filter(r => !r.success).length;
      const failureRate = (failures / this.requestHistory.length) * 100;

      if (failureRate >= this.config.failurePercentage) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if should attempt to reset from open state
   */
  private shouldAttemptReset(): boolean {
    if (!this.nextAttempt) return false;
    return Date.now() >= this.nextAttempt.getTime();
  }

  /**
   * Transition to new state
   */
  private transitionTo(newState: CircuitState): void {
    const oldState = this.state;
    this.state = newState;
    this.stateTransitions++;

    logger.info(`Circuit breaker ${this.config.name} transitioned`, {
      from: oldState,
      to: newState,
      transitions: this.stateTransitions,
    });

    this.emit('stateChange', {
      circuit: this.config.name,
      from: oldState,
      to: newState,
      stats: this.getStats(),
    });

    if (newState === CircuitState.HALF_OPEN) {
      this.halfOpenAttempts = 0;
    }
  }

  /**
   * Reset circuit breaker to initial state
   */
  private reset(): void {
    this.failureCount = 0;
    this.successCount = 0;
    this.halfOpenAttempts = 0;
    this.requestHistory = [];
  }

  /**
   * Add request record to history
   */
  private addRequestRecord(record: RequestRecord): void {
    this.requestHistory.push(record);
    this.cleanRequestHistory();
  }

  /**
   * Clean old request records outside rolling window
   */
  private cleanRequestHistory(): void {
    const cutoff = Date.now() - this.config.rollingWindowMs;
    this.requestHistory = this.requestHistory.filter(r => r.timestamp >= cutoff);
  }

  /**
   * Get current statistics
   */
  getStats(): CircuitBreakerStats {
    this.cleanRequestHistory();

    const failures = this.requestHistory.filter(r => !r.success).length;
    const totalRequests = this.requestHistory.length;
    const failureRate = totalRequests > 0 ? (failures / totalRequests) * 100 : 0;

    return {
      state: this.state,
      failures: this.failureCount,
      successes: this.successCount,
      totalRequests,
      failureRate,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      stateTransitions: this.stateTransitions,
      halfOpenAttempts: this.halfOpenAttempts,
    };
  }

  /**
   * Get current state
   */
  getState(): CircuitState {
    return this.state;
  }

  /**
   * Setup metrics collection
   */
  private setupMetrics(): void {
    // Emit metrics periodically
    setInterval(() => {
      const stats = this.getStats();
      this.emit('metrics', {
        circuit: this.config.name,
        level: this.config.level,
        ...stats,
      });
    }, 60000); // Every minute
  }

  /**
   * Alert when circuit opens
   */
  private alertCircuitOpen(): void {
    const alert = {
      circuit: this.config.name,
      level: this.config.level,
      state: this.state,
      failures: this.failureCount,
      timestamp: new Date(),
      nextAttempt: this.nextAttempt,
      stats: this.getStats(),
    };

    logger.error('Circuit breaker opened', alert);
    this.emit('alert', alert);

    // Escalate if configured
    if (this.config.escalationDelay) {
      setTimeout(() => {
        if (this.state === CircuitState.OPEN) {
          logger.error('Circuit breaker still open - ESCALATING', alert);
          this.emit('escalate', alert);
        }
      }, this.config.escalationDelay);
    }
  }

  /**
   * Force open circuit (for testing/manual intervention)
   */
  forceOpen(): void {
    this.transitionTo(CircuitState.OPEN);
    this.nextAttempt = new Date(Date.now() + this.config.resetTimeout);
  }

  /**
   * Force close circuit (for testing/manual intervention)
   */
  forceClose(): void {
    this.transitionTo(CircuitState.CLOSED);
    this.reset();
  }
}

/**
 * Circuit Breaker Factory
 */
export class CircuitBreakerFactory {
  private static breakers = new Map<string, CircuitBreaker>();

  static createLevel1(name: string): CircuitBreaker {
    const config: CircuitBreakerConfig = {
      name,
      level: ResilienceLevel.CRITICAL,
      failureThreshold: 1,
      successThreshold: 5,
      timeout: 5000,
      resetTimeout: 30000,
      halfOpenRequests: 1,
      volumeThreshold: 1,
      rollingWindowMs: 60000,
      fallbackStrategy: 'QUEUE_LOCAL',
      alertOnOpen: true,
      alertChannel: 'CRITICAL_OPS',
      escalationDelay: 60000,
    };

    return this.getOrCreate(name, config);
  }

  static createLevel2(name: string): CircuitBreaker {
    const config: CircuitBreakerConfig = {
      name,
      level: ResilienceLevel.HIGH,
      failureThreshold: 3,
      failurePercentage: 50,
      successThreshold: 10,
      timeout: 10000,
      resetTimeout: 60000,
      halfOpenRequests: 3,
      volumeThreshold: 10,
      rollingWindowMs: 120000,
      fallbackStrategy: 'CACHED_DATA_WITH_WARNING',
      cacheMaxAge: 300000,
      alertOnOpen: true,
      alertChannel: 'HIGH_PRIORITY',
      escalationDelay: 300000,
    };

    return this.getOrCreate(name, config);
  }

  static createLevel3(name: string): CircuitBreaker {
    const config: CircuitBreakerConfig = {
      name,
      level: ResilienceLevel.STANDARD,
      failureThreshold: 5,
      failurePercentage: 60,
      successThreshold: 20,
      timeout: 10000,
      resetTimeout: 120000,
      halfOpenRequests: 5,
      volumeThreshold: 20,
      rollingWindowMs: 300000,
      fallbackStrategy: 'STALE_DATA_ALLOWED',
      cacheMaxAge: 3600000,
      alertOnOpen: true,
      alertChannel: 'STANDARD_OPS',
    };

    return this.getOrCreate(name, config);
  }

  private static getOrCreate(name: string, config: CircuitBreakerConfig): CircuitBreaker {
    if (!this.breakers.has(name)) {
      this.breakers.set(name, new CircuitBreaker(config));
    }
    return this.breakers.get(name)!;
  }

  static getBreaker(name: string): CircuitBreaker | undefined {
    return this.breakers.get(name);
  }

  static getAllBreakers(): Map<string, CircuitBreaker> {
    return this.breakers;
  }
}

/**
 * Custom Errors
 */
export class CircuitBreakerOpenError extends Error {
  constructor(message: string, public nextAttempt?: Date) {
    super(message);
    this.name = 'CircuitBreakerOpenError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}
