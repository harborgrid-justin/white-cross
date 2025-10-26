/**
 * Circuit Breaker Pattern Implementation
 * Prevents cascading failures by stopping requests to failing endpoints
 * States: CLOSED (normal) -> OPEN (failing) -> HALF_OPEN (testing) -> CLOSED
 */

import {
  CircuitBreakerState,
  CircuitBreakerConfig,
  CircuitBreakerMetrics,
  CircuitBreakerEvent,
  ResilienceError
} from './types';

/**
 * CircuitBreaker Class
 * Per-endpoint circuit breaker with automatic state management
 * Healthcare-safe: Prevents repeated failures but allows testing recovery
 */
export class CircuitBreaker {
  private endpoint: string;
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED;
  private failureCount: number = 0;
  private successCount: number = 0;
  private lastFailureTime: number | null = null;
  private lastSuccessTime: number | null = null;
  private nextHalfOpenTime: number | null = null;
  private requestTimings: number[] = [];
  private config: Required<CircuitBreakerConfig>;
  private listeners: Set<(event: CircuitBreakerEvent) => void> = new Set();

  constructor(endpoint: string, config: CircuitBreakerConfig) {
    this.endpoint = endpoint;
    this.config = {
      failureThreshold: config.failureThreshold,
      successThreshold: config.successThreshold,
      timeout: config.timeout,
      monitoringWindow: config.monitoringWindow,
      excludedErrors: config.excludedErrors || [],
      isErrorRetryable: config.isErrorRetryable
    };
  }

  /**
   * Execute request through circuit breaker
   * Throws ResilienceError if circuit is OPEN
   */
  public async execute<T>(operation: () => Promise<T>): Promise<T> {
    // Check if circuit should transition to HALF_OPEN
    this.checkStateTransition();

    if (this.state === CircuitBreakerState.OPEN) {
      throw this.createCircuitBreakerError('Circuit breaker is OPEN - endpoint is failing');
    }

    try {
      const startTime = performance.now();
      const result = await operation();
      const duration = performance.now() - startTime;

      this.recordSuccess(duration);
      return result;
    } catch (error) {
      this.recordFailure(error);
      throw error;
    }
  }

  /**
   * Record successful operation
   */
  private recordSuccess(duration: number): void {
    this.successCount++;
    this.failureCount = 0;
    this.lastSuccessTime = Date.now();
    this.requestTimings.push(duration);

    // Clean up old timings
    this.cleanupOldTimings();

    if (this.state === CircuitBreakerState.HALF_OPEN) {
      if (this.successCount >= this.config.successThreshold) {
        this.transitionTo(CircuitBreakerState.CLOSED);
      }
    }
  }

  /**
   * Record failed operation
   */
  private recordFailure(error: unknown): void {
    const shouldCount = this.shouldCountAsFailure(error);

    if (shouldCount) {
      this.failureCount++;
      this.successCount = 0;
      this.lastFailureTime = Date.now();

      if (this.state === CircuitBreakerState.HALF_OPEN) {
        this.transitionTo(CircuitBreakerState.OPEN);
        this.nextHalfOpenTime = Date.now() + this.config.timeout;
      } else if (this.state === CircuitBreakerState.CLOSED) {
        if (this.failureCount >= this.config.failureThreshold) {
          this.transitionTo(CircuitBreakerState.OPEN);
          this.nextHalfOpenTime = Date.now() + this.config.timeout;
        }
      }
    }
  }

  /**
   * Determine if error should count as failure
   * Excludes client errors (4xx) by default
   */
  private shouldCountAsFailure(error: unknown): boolean {
    // Check custom predicate
    if (this.config.isErrorRetryable) {
      return this.config.isErrorRetryable(error);
    }

    // Check if error code is excluded
    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as { status: unknown }).status;
      if (typeof status === 'number' && this.config.excludedErrors.includes(status)) {
        return false;
      }
    }

    // Default: count errors with status >= 500 or no status (network error)
    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as { status: unknown }).status;
      if (typeof status === 'number' && status < 500) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if state should transition
   */
  private checkStateTransition(): void {
    if (this.state === CircuitBreakerState.OPEN && this.nextHalfOpenTime) {
      if (Date.now() >= this.nextHalfOpenTime) {
        this.transitionTo(CircuitBreakerState.HALF_OPEN);
        this.successCount = 0;
      }
    }
  }

  /**
   * Transition to new state
   */
  private transitionTo(newState: CircuitBreakerState): void {
    const previousState = this.state;
    this.state = newState;

    const event: CircuitBreakerEvent = {
      type: 'stateChange',
      state: newState,
      endpoint: this.endpoint,
      timestamp: Date.now(),
      message: `Circuit breaker transitioned from ${previousState} to ${newState}`
    };

    if (previousState !== newState) {
      this.emit(event);
    }
  }

  /**
   * Clean up old request timings outside monitoring window
   */
  private cleanupOldTimings(): void {
    const cutoffTime = Date.now() - this.config.monitoringWindow;
    const cutoffTimings = this.requestTimings.filter(() => {
      // Note: We don't have individual timestamps, so this is simplified
      return true;
    });
    this.requestTimings = cutoffTimings;
  }

  /**
   * Create circuit breaker error
   */
  private createCircuitBreakerError(message: string): ResilienceError {
    return new Error(message) as ResilienceError & {
      type: 'circuitBreakerOpen';
      endpoint: string;
      timestamp: number;
    };
  }

  /**
   * Emit event to listeners
   */
  private emit(event: CircuitBreakerEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in circuit breaker event listener:', error);
      }
    });
  }

  /**
   * Add event listener
   */
  public onStateChange(listener: (event: CircuitBreakerEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get current metrics
   */
  public getMetrics(): CircuitBreakerMetrics {
    const requestsInWindow = this.requestTimings.length;
    const failureRate = requestsInWindow > 0 ? this.failureCount / requestsInWindow : 0;
    const avgResponseTime = requestsInWindow > 0
      ? this.requestTimings.reduce((a, b) => a + b, 0) / requestsInWindow
      : 0;

    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      requestsInMonitoringWindow: requestsInWindow,
      failureRate,
      averageResponseTime: avgResponseTime
    };
  }

  /**
   * Reset circuit breaker to CLOSED state
   * Use for testing or manual recovery
   */
  public reset(): void {
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
    this.lastSuccessTime = null;
    this.nextHalfOpenTime = null;
    this.requestTimings = [];
    this.transitionTo(CircuitBreakerState.CLOSED);
  }

  /**
   * Get current state
   */
  public getState(): CircuitBreakerState {
    this.checkStateTransition();
    return this.state;
  }

  /**
   * Check if circuit is open
   */
  public isOpen(): boolean {
    this.checkStateTransition();
    return this.state === CircuitBreakerState.OPEN;
  }

  /**
   * Check if circuit is half-open
   */
  public isHalfOpen(): boolean {
    this.checkStateTransition();
    return this.state === CircuitBreakerState.HALF_OPEN;
  }

  /**
   * Check if circuit is closed (healthy)
   */
  public isClosed(): boolean {
    this.checkStateTransition();
    return this.state === CircuitBreakerState.CLOSED;
  }
}

/**
 * Circuit Breaker Registry
 * Maintains per-endpoint circuit breakers
 */
export class CircuitBreakerRegistry {
  private breakers: Map<string, CircuitBreaker> = new Map();
  private config: CircuitBreakerConfig;

  constructor(config: CircuitBreakerConfig) {
    this.config = config;
  }

  /**
   * Get or create circuit breaker for endpoint
   */
  public getBreaker(endpoint: string): CircuitBreaker {
    if (!this.breakers.has(endpoint)) {
      this.breakers.set(endpoint, new CircuitBreaker(endpoint, this.config));
    }
    return this.breakers.get(endpoint)!;
  }

  /**
   * Execute request through circuit breaker
   */
  public async execute<T>(endpoint: string, operation: () => Promise<T>): Promise<T> {
    const breaker = this.getBreaker(endpoint);
    return breaker.execute(operation);
  }

  /**
   * Get metrics for all circuit breakers
   */
  public getAllMetrics(): Map<string, CircuitBreakerMetrics> {
    const metrics = new Map<string, CircuitBreakerMetrics>();
    this.breakers.forEach((breaker, endpoint) => {
      metrics.set(endpoint, breaker.getMetrics());
    });
    return metrics;
  }

  /**
   * Reset all circuit breakers
   */
  public resetAll(): void {
    this.breakers.forEach(breaker => breaker.reset());
  }

  /**
   * Remove circuit breaker
   */
  public removeBreaker(endpoint: string): void {
    this.breakers.delete(endpoint);
  }

  /**
   * Get list of open endpoints
   */
  public getOpenEndpoints(): string[] {
    const open: string[] = [];
    this.breakers.forEach((breaker, endpoint) => {
      if (breaker.isOpen()) {
        open.push(endpoint);
      }
    });
    return open;
  }

  /**
   * Get list of half-open endpoints
   */
  public getHalfOpenEndpoints(): string[] {
    const halfOpen: string[] = [];
    this.breakers.forEach((breaker, endpoint) => {
      if (breaker.isHalfOpen()) {
        halfOpen.push(endpoint);
      }
    });
    return halfOpen;
  }

  /**
   * Update configuration
   */
  public updateConfig(config: CircuitBreakerConfig): void {
    this.config = config;
  }
}
