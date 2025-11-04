/**
 * WF-COMP-350 | routeValidationTypes.ts - Type definitions and custom errors
 * Purpose: Core types, interfaces, and error classes for route validation
 * Upstream: zod | Dependencies: zod
 * Downstream: All route validation modules | Called by: Validation utilities
 * Related: routeValidation schemas, hooks, and utilities
 * Exports: types, interfaces, classes | Key Features: Custom error handling
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Error creation → User message generation → Error handling
 * LLM Context: Type definitions for route validation system
 */

'use client';

import { z } from 'zod';

// =====================
// TYPE DEFINITIONS
// =====================

/**
 * Generic parameter validator function type
 */
export type ParamValidator<T> = (params: Record<string, string | undefined>) => ValidationResult<T>;

/**
 * Validation result with success/error state
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: RouteValidationError;
}

/**
 * Schema definition for parameter validation
 */
export interface ParamSchema {
  schema: z.ZodSchema<any>;
  required?: boolean;
  transform?: (value: any) => any;
}

/**
 * Validation error details
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * Options for param validation hooks
 */
export interface ValidationHookOptions {
  redirect?: string;
  fallbackRoute?: string;
  onError?: (error: RouteValidationError) => void;
  silent?: boolean;
}

// =====================
// CUSTOM ERROR CLASS
// =====================

/**
 * Custom error class for route parameter validation failures
 * Provides detailed error information for debugging and user feedback
 */
export class RouteValidationError extends Error {
  public readonly field: string;
  public readonly code: string;
  public readonly statusCode: number;
  public readonly userMessage: string;
  public readonly details?: ValidationError[];
  public readonly timestamp: string;

  constructor(
    message: string,
    field: string,
    code: string = 'VALIDATION_ERROR',
    details?: ValidationError[]
  ) {
    super(message);
    this.name = 'RouteValidationError';
    this.field = field;
    this.code = code;
    this.statusCode = 400;
    this.userMessage = this.generateUserMessage(field, code);
    this.details = details;
    this.timestamp = new Date().toISOString();

    // Maintains proper stack trace for where error was thrown (V8 engines)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RouteValidationError);
    }
  }

  /**
   * Generates user-friendly error messages based on validation failure
   */
  private generateUserMessage(field: string, code: string): string {
    const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();

    switch (code) {
      case 'INVALID_UUID':
        return `Invalid ${fieldName} identifier. Please check the URL and try again.`;
      case 'INVALID_NUMBER':
        return `The ${fieldName} must be a valid number.`;
      case 'INVALID_DATE':
        return `The ${fieldName} must be a valid date.`;
      case 'INVALID_ENUM':
        return `Invalid ${fieldName} value. Please select a valid option.`;
      case 'XSS_DETECTED':
        return 'Potentially harmful content detected in URL. Request blocked for security.';
      case 'SQL_INJECTION_DETECTED':
        return 'Suspicious pattern detected in URL. Request blocked for security.';
      case 'PATH_TRAVERSAL_DETECTED':
        return 'Invalid path format detected. Request blocked for security.';
      case 'MISSING_REQUIRED':
        return `Required parameter "${fieldName}" is missing.`;
      case 'OUT_OF_RANGE':
        return `The ${fieldName} is out of acceptable range.`;
      default:
        return `Invalid ${fieldName}. Please check your input and try again.`;
    }
  }

  /**
   * Converts error to JSON for logging/API responses
   */
  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      userMessage: this.userMessage,
      field: this.field,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}
