/**
 * @fileoverview Type definitions for error handling utilities
 * @module utils/errorHandling/types
 * @category Utils
 *
 * Provides type definitions, interfaces, and type guards for the error
 * handling system across the healthcare platform.
 */

import { ApiError, ValidationError } from '@/types';

/**
 * Error types for classification
 */
export type ErrorType =
  | 'NETWORK_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'CLIENT_ERROR'
  | 'TIMEOUT_ERROR'
  | 'UNKNOWN_ERROR';

/**
 * Standardized processed error object
 */
export interface ProcessedError {
  type: ErrorType;
  message: string;
  userMessage: string;
  details?: unknown;
  statusCode?: number;
  timestamp: string;
  canRetry: boolean;
}

/**
 * Error notification for UI display
 */
export interface ErrorNotification {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  action?: {
    label: string;
    handler: () => void;
  };
}

/**
 * Result interface for error handler utility
 */
export interface UseErrorHandlerResult {
  handleError: (error: unknown, context?: string) => void;
  clearError: () => void;
  error: ProcessedError | null;
  hasError: boolean;
}

/**
 * Options for retry mechanism
 */
export interface RetryOptions {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: ProcessedError) => boolean;
}

/**
 * Type guard for API errors
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}

/**
 * Type guard for validation errors
 */
export function isValidationError(error: unknown): error is ValidationError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'field' in error &&
    'message' in error
  );
}
