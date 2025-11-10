/**
 * Timeout Utility
 *
 * Provides configurable timeout wrapper for async operations to prevent
 * hung connections and ensure system responsiveness in healthcare integrations.
 *
 * @module TimeoutUtil
 */

import { GatewayTimeoutException } from '@nestjs/common';

/**
 * Timeout configuration options
 */
export interface TimeoutOptions {
  /**
   * Timeout duration in milliseconds
   */
  timeout: number;

  /**
   * Operation name for error messages and logging
   */
  operationName?: string;

  /**
   * Custom error message
   */
  errorMessage?: string;
}

/**
 * Custom timeout error class
 */
export class TimeoutError extends Error {
  constructor(message: string, public readonly timeout: number, public readonly operationName?: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Wraps an async operation with a timeout
 *
 * @param operation - The async function to execute
 * @param timeout - Timeout in milliseconds
 * @param operationName - Name of the operation for error context
 * @returns Promise that resolves with operation result or rejects with TimeoutError
 *
 * @example
 * ```typescript
 * // Basic usage
 * const result = await withTimeout(
 *   () => externalAPI.call(),
 *   30000,
 *   'Epic FHIR API call'
 * );
 *
 * // With error handling
 * try {
 *   const result = await withTimeout(
 *     () => this.cernerAPI.getPatient(patientId),
 *     30000,
 *     'Cerner patient lookup'
 *   );
 * } catch (error) {
 *   if (error instanceof TimeoutError) {
 *     this.logger.error('Operation timed out', {
 *       operation: error.operationName,
 *       timeout: error.timeout
 *     });
 *     throw new GatewayTimeoutException('External service timed out');
 *   }
 *   throw error;
 * }
 * ```
 */
export async function withTimeout<T>(
  operation: () => Promise<T>,
  timeout: number,
  operationName?: string
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    // Create timeout promise
    const timeoutId = setTimeout(() => {
      const errorMessage = operationName
        ? `Operation "${operationName}" timed out after ${timeout}ms`
        : `Operation timed out after ${timeout}ms`;

      reject(new TimeoutError(errorMessage, timeout, operationName));
    }, timeout);

    // Execute operation
    operation()
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

/**
 * Wraps an async operation with timeout configuration options
 *
 * @param operation - The async function to execute
 * @param options - Timeout configuration options
 * @returns Promise that resolves with operation result or rejects with TimeoutError
 *
 * @example
 * ```typescript
 * const result = await withTimeoutOptions(
 *   () => this.epicAPI.searchPatients(criteria),
 *   {
 *     timeout: 45000,
 *     operationName: 'Epic patient search',
 *     errorMessage: 'Patient search took too long'
 *   }
 * );
 * ```
 */
export async function withTimeoutOptions<T>(
  operation: () => Promise<T>,
  options: TimeoutOptions
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      const errorMessage = options.errorMessage ||
        (options.operationName
          ? `Operation "${options.operationName}" timed out after ${options.timeout}ms`
          : `Operation timed out after ${options.timeout}ms`);

      reject(new TimeoutError(errorMessage, options.timeout, options.operationName));
    }, options.timeout);

    operation()
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

/**
 * Standard timeout durations for healthcare operations (in milliseconds)
 */
export const TIMEOUT_DURATIONS = {
  /** Database queries - 10 seconds */
  DATABASE: 10000,

  /** Fast external APIs (verification, lookup) - 5 seconds */
  FAST_API: 5000,

  /** Standard external APIs (FHIR, HL7) - 30 seconds */
  STANDARD_API: 30000,

  /** Heavy processing (analytics, reporting) - 60 seconds */
  HEAVY_PROCESSING: 60000,

  /** Batch operations - 120 seconds */
  BATCH: 120000,

  /** Epic EHR - 30 seconds */
  EPIC: 30000,

  /** Cerner Millennium - 30 seconds */
  CERNER: 30000,

  /** athenahealth - 30 seconds */
  ATHENAHEALTH: 30000,

  /** HIE networks (CommonWell/Carequality) - 45 seconds */
  HIE: 45000,

  /** Insurance clearinghouses - 20 seconds */
  INSURANCE: 20000,

  /** Laboratory systems - 30 seconds */
  LABORATORY: 30000,

  /** e-Prescribing (Surescripts) - 15 seconds */
  EPRESCRIBING: 15000
};

/**
 * Checks if an error is a TimeoutError
 *
 * @param error - The error to check
 * @returns true if the error is a TimeoutError
 */
export function isTimeoutError(error: any): error is TimeoutError {
  return error instanceof TimeoutError || error?.name === 'TimeoutError';
}
