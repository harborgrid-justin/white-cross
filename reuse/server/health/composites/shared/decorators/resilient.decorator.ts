/**
 * Resilient Decorator
 *
 * Combines timeout, retry, and circuit breaker patterns into a single
 * decorator for easy application to service methods.
 *
 * @module ResilientDecorator
 */

import { Logger } from '@nestjs/common';
import { withTimeout, TIMEOUT_DURATIONS, TimeoutError } from '../utils/timeout.util';
import { withRetry, RETRY_CONFIGS, RetryExhaustedError } from '../utils/retry.util';
import {
  CircuitBreaker,
  CircuitBreakerRegistry,
  CIRCUIT_BREAKER_CONFIGS,
  CircuitBreakerOpenError
} from '../utils/circuit-breaker.util';

/**
 * Resilient decorator configuration options
 */
export interface ResilientOptions {
  /**
   * Timeout in milliseconds (default: 30000ms)
   */
  timeout?: number;

  /**
   * Enable retry logic (default: true)
   */
  enableRetry?: boolean;

  /**
   * Retry configuration
   */
  retryConfig?: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    factor?: number;
  };

  /**
   * Enable circuit breaker (default: false)
   */
  enableCircuitBreaker?: boolean;

  /**
   * Circuit breaker name (required if enableCircuitBreaker is true)
   */
  circuitBreakerName?: string;

  /**
   * Circuit breaker configuration
   */
  circuitBreakerConfig?: {
    failureThreshold?: number;
    timeout?: number;
    successThreshold?: number;
    halfOpenMaxAttempts?: number;
  };

  /**
   * Operation name for logging
   */
  operationName?: string;

  /**
   * Custom logger instance
   */
  logger?: Logger;
}

/**
 * Resilient method decorator that adds timeout, retry, and circuit breaker protection
 *
 * @param options - Resilient configuration options
 * @returns Method decorator
 *
 * @example
 * ```typescript
 * // Basic usage - timeout and retry
 * @Resilient({ timeout: 30000 })
 * async callExternalAPI(data: any): Promise<any> {
 *   return this.httpService.post(endpoint, data);
 * }
 *
 * // With circuit breaker
 * @Resilient({
 *   timeout: 30000,
 *   enableCircuitBreaker: true,
 *   circuitBreakerName: 'epic-api'
 * })
 * async callEpicAPI(data: any): Promise<any> {
 *   return this.epicClient.call(data);
 * }
 *
 * // Custom retry configuration
 * @Resilient({
 *   timeout: 30000,
 *   retryConfig: {
 *     maxRetries: 5,
 *     baseDelay: 2000
 *   }
 * })
 * async callCriticalAPI(data: any): Promise<any> {
 *   return this.criticalService.call(data);
 * }
 *
 * // Disable retry
 * @Resilient({
 *   timeout: 5000,
 *   enableRetry: false
 * })
 * async fastLookup(id: string): Promise<any> {
 *   return this.cache.get(id);
 * }
 * ```
 */
export function Resilient(options: ResilientOptions = {}): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const methodName = String(propertyKey);
    const operationName = options.operationName || `${target.constructor.name}.${methodName}`;

    descriptor.value = async function (...args: any[]) {
      const logger = options.logger || new Logger(target.constructor.name);

      // Build the operation with layers of resilience
      let operation = () => originalMethod.apply(this, args);

      // Layer 1: Circuit Breaker (outermost)
      if (options.enableCircuitBreaker) {
        if (!options.circuitBreakerName) {
          throw new Error(
            `Circuit breaker name is required when enableCircuitBreaker is true for ${operationName}`
          );
        }

        const circuitBreakerRegistry = CircuitBreakerRegistry.getInstance();
        const circuitBreaker = circuitBreakerRegistry.getOrCreate(
          options.circuitBreakerName,
          options.circuitBreakerConfig
        );

        const originalOp = operation;
        operation = () => circuitBreaker.execute(originalOp);
      }

      // Layer 2: Retry (middle)
      if (options.enableRetry !== false) {
        const retryConfig = {
          ...RETRY_CONFIGS.DEFAULT,
          ...options.retryConfig,
          operationName,
          logger
        };

        const originalOp = operation;
        operation = () => withRetry(originalOp, retryConfig);
      }

      // Layer 3: Timeout (innermost)
      if (options.timeout) {
        const originalOp = operation;
        operation = () => withTimeout(originalOp, options.timeout!, operationName);
      }

      // Execute with all resilience layers
      try {
        return await operation();
      } catch (error) {
        // Handle specific error types
        if (error instanceof TimeoutError) {
          logger.error(`Timeout in ${operationName}`, {
            timeout: error.timeout,
            operation: error.operationName
          });
        } else if (error instanceof RetryExhaustedError) {
          logger.error(`Retry exhausted in ${operationName}`, {
            attempts: error.attempts,
            lastError: error.lastError?.message
          });
        } else if (error instanceof CircuitBreakerOpenError) {
          logger.warn(`Circuit breaker open in ${operationName}`, {
            circuitBreaker: error.circuitBreakerName
          });
        }

        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Pre-configured resilient decorators for common healthcare scenarios
 */

/**
 * Standard API call resilience (30s timeout, 3 retries, no circuit breaker)
 *
 * @example
 * ```typescript
 * @ResilientAPI()
 * async callExternalAPI(data: any): Promise<any> {
 *   return this.httpService.post(endpoint, data);
 * }
 * ```
 */
export function ResilientAPI(operationName?: string): MethodDecorator {
  return Resilient({
    timeout: TIMEOUT_DURATIONS.STANDARD_API,
    enableRetry: true,
    retryConfig: RETRY_CONFIGS.DEFAULT,
    operationName
  });
}

/**
 * Fast API call resilience (5s timeout, 2 retries, no circuit breaker)
 *
 * @example
 * ```typescript
 * @ResilientFastAPI()
 * async quickLookup(id: string): Promise<any> {
 *   return this.lookupService.get(id);
 * }
 * ```
 */
export function ResilientFastAPI(operationName?: string): MethodDecorator {
  return Resilient({
    timeout: TIMEOUT_DURATIONS.FAST_API,
    enableRetry: true,
    retryConfig: RETRY_CONFIGS.FAST,
    operationName
  });
}

/**
 * Epic EHR call resilience (30s timeout, 3 retries, circuit breaker)
 *
 * @param circuitBreakerName - Name for the circuit breaker instance
 *
 * @example
 * ```typescript
 * @ResilientEpic('epic-patient-search')
 * async searchPatients(criteria: any): Promise<any> {
 *   return this.epicClient.searchPatients(criteria);
 * }
 * ```
 */
export function ResilientEpic(circuitBreakerName: string): MethodDecorator {
  return Resilient({
    timeout: TIMEOUT_DURATIONS.EPIC,
    enableRetry: true,
    retryConfig: RETRY_CONFIGS.DEFAULT,
    enableCircuitBreaker: true,
    circuitBreakerName,
    circuitBreakerConfig: CIRCUIT_BREAKER_CONFIGS.EPIC,
    operationName: `Epic:${circuitBreakerName}`
  });
}

/**
 * Cerner call resilience (30s timeout, 3 retries, circuit breaker)
 *
 * @param circuitBreakerName - Name for the circuit breaker instance
 *
 * @example
 * ```typescript
 * @ResilientCerner('cerner-patient-lookup')
 * async getPatient(patientId: string): Promise<any> {
 *   return this.cernerClient.getPatient(patientId);
 * }
 * ```
 */
export function ResilientCerner(circuitBreakerName: string): MethodDecorator {
  return Resilient({
    timeout: TIMEOUT_DURATIONS.CERNER,
    enableRetry: true,
    retryConfig: RETRY_CONFIGS.DEFAULT,
    enableCircuitBreaker: true,
    circuitBreakerName,
    circuitBreakerConfig: CIRCUIT_BREAKER_CONFIGS.CERNER,
    operationName: `Cerner:${circuitBreakerName}`
  });
}

/**
 * HIE network call resilience (45s timeout, 3 retries, circuit breaker with sensitive threshold)
 *
 * @param circuitBreakerName - Name for the circuit breaker instance
 *
 * @example
 * ```typescript
 * @ResilientHIE('hie-patient-discovery')
 * async discoverPatient(demographics: any): Promise<any> {
 *   return this.hieClient.discoverPatient(demographics);
 * }
 * ```
 */
export function ResilientHIE(circuitBreakerName: string): MethodDecorator {
  return Resilient({
    timeout: TIMEOUT_DURATIONS.HIE,
    enableRetry: true,
    retryConfig: RETRY_CONFIGS.DEFAULT,
    enableCircuitBreaker: true,
    circuitBreakerName,
    circuitBreakerConfig: CIRCUIT_BREAKER_CONFIGS.HIE,
    operationName: `HIE:${circuitBreakerName}`
  });
}

/**
 * Insurance verification resilience (20s timeout, 3 retries, circuit breaker)
 *
 * @param circuitBreakerName - Name for the circuit breaker instance
 *
 * @example
 * ```typescript
 * @ResilientInsurance('insurance-eligibility')
 * async verifyEligibility(data: any): Promise<any> {
 *   return this.clearinghouse.verifyEligibility(data);
 * }
 * ```
 */
export function ResilientInsurance(circuitBreakerName: string): MethodDecorator {
  return Resilient({
    timeout: TIMEOUT_DURATIONS.INSURANCE,
    enableRetry: true,
    retryConfig: RETRY_CONFIGS.DEFAULT,
    enableCircuitBreaker: true,
    circuitBreakerName,
    circuitBreakerConfig: CIRCUIT_BREAKER_CONFIGS.INSURANCE,
    operationName: `Insurance:${circuitBreakerName}`
  });
}

/**
 * Database operation resilience (10s timeout, 3 retries, no circuit breaker)
 *
 * @example
 * ```typescript
 * @ResilientDatabase()
 * async queryPatients(criteria: any): Promise<any> {
 *   return this.database.query(sql, params);
 * }
 * ```
 */
export function ResilientDatabase(operationName?: string): MethodDecorator {
  return Resilient({
    timeout: TIMEOUT_DURATIONS.DATABASE,
    enableRetry: true,
    retryConfig: RETRY_CONFIGS.DATABASE,
    operationName
  });
}
