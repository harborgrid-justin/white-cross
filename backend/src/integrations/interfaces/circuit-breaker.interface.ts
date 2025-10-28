/**
 * Circuit Breaker Interfaces
 *
 * Type definitions for circuit breaker pattern implementation.
 * The circuit breaker prevents cascading failures by monitoring request failures
 * and temporarily blocking requests when a threshold is exceeded.
 *
 * @module integrations/interfaces/circuit-breaker
 */

/**
 * Circuit breaker states following the classic circuit breaker pattern
 *
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Circuit is broken, requests are blocked
 * - HALF_OPEN: Testing if the circuit can be closed again
 */
export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

/**
 * Circuit breaker configuration options
 */
export interface CircuitBreakerConfig {
  /**
   * Number of consecutive failures before opening the circuit
   * @default 5
   */
  failureThreshold: number;

  /**
   * Number of consecutive successes in HALF_OPEN state before closing the circuit
   * @default 2
   */
  successThreshold: number;

  /**
   * Time in milliseconds to wait before attempting to close the circuit
   * @default 60000 (60 seconds)
   */
  timeout: number;
}

/**
 * Circuit breaker status information
 */
export interface CircuitBreakerStatus {
  /**
   * Current state of the circuit
   */
  state: CircuitState;

  /**
   * Number of consecutive failures recorded
   */
  failures: number;

  /**
   * Timestamp when the circuit can attempt to close (only when OPEN)
   */
  nextAttempt?: Date;
}
