/**
 * WF-COMP-131 | healthRecordsUtils.ts - Utility functions for health records
 * Purpose: Error handling and retry logic utilities
 * Upstream: None | Dependencies: react-hot-toast
 * Downstream: All health records hook modules
 * Related: Health records hooks, error handling
 * Exports: utility functions | Key Features: PHI-safe error messages
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Error handling and retry logic for healthcare data
 * LLM Context: HIPAA-compliant error handling utilities
 */

import { toast } from 'react-hot-toast';
import { HealthRecordsApiError, CircuitBreakerError } from './types';
import { RETRY_CONFIG } from './healthRecordsConfig';

/**
 * Handles query errors with PHI-safe error messages and appropriate user feedback
 * @param error - The error object
 * @param context - Context of the error for logging
 */
export function handleQueryError(error: unknown, context: string): void {
  if (error instanceof CircuitBreakerError) {
    toast.error('Service temporarily unavailable. Please try again in a few moments.', {
      duration: 5000,
      id: 'circuit-breaker',
    });
    console.error(`Circuit breaker open for ${context}:`, error);
    return;
  }

  if (error instanceof HealthRecordsApiError) {
    if (error.statusCode === 401) {
      toast.error('Session expired. Please log in again.');
      // Trigger session expiration flow
      window.location.href = '/login';
      return;
    }

    if (error.statusCode === 403) {
      toast.error('You do not have permission to access this resource.');
      return;
    }

    // Use PHI-safe error messages
    const phiSafeMessage = error.message.includes('student') || error.message.includes('patient')
      ? 'Unable to access health records. Please contact support.'
      : error.message;

    toast.error(phiSafeMessage);
    console.error(`API error in ${context}:`, error);
    return;
  }

  toast.error(`An unexpected error occurred while ${context}`);
  console.error(`Unexpected error in ${context}:`, error);
}

/**
 * Determines if a failed query should be retried based on error type
 * @param failureCount - Number of previous failures
 * @param error - The error object
 * @returns True if should retry, false otherwise
 */
export function shouldRetry(failureCount: number, error: unknown): boolean {
  // Don't retry on certain errors
  if (error instanceof HealthRecordsApiError) {
    const noRetryStatuses = [400, 401, 403, 404, 422];
    if (error.statusCode && noRetryStatuses.includes(error.statusCode)) {
      return false;
    }
  }

  return failureCount < RETRY_CONFIG.ATTEMPTS;
}
