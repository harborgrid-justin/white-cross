/**
 * WF-COMP-350 | routeValidationSecurity.ts - Security validation utilities
 * Purpose: XSS, SQL injection, and path traversal detection/prevention
 * Upstream: routeValidationTypes | Dependencies: None
 * Downstream: Validation utilities | Called by: Parameter sanitization
 * Related: routeValidationUtils, routeValidationTypes
 * Exports: Security check functions, pattern detection | Key Features: Attack prevention
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Pattern detection → Security validation → Error throwing
 * LLM Context: Security utilities for route parameter validation
 */

'use client';

import { RouteValidationError } from './routeValidationTypes';

// =====================
// SECURITY UTILITIES
// =====================

/**
 * XSS attack pattern detection
 * Checks for common XSS vectors in parameters
 */
const XSS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe[^>]*>/gi,
  /<object[^>]*>/gi,
  /<embed[^>]*>/gi,
  /eval\s*\(/gi,
  /expression\s*\(/gi,
];

/**
 * SQL injection pattern detection
 * Checks for common SQL injection attempts
 */
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
  /(UNION\s+SELECT)/gi,
  /(OR\s+1\s*=\s*1)/gi,
  /(AND\s+1\s*=\s*1)/gi,
  /(["';]|\-\-|\/\*|\*\/)/g,
];

/**
 * Path traversal pattern detection
 * Checks for directory traversal attempts
 */
const PATH_TRAVERSAL_PATTERNS = [
  /\.\.[\/\\]/g,
  /[\/\\]\.\./g,
  /%2e%2e[\/\\]/gi,
  /[\/\\]%2e%2e/gi,
];

/**
 * Detects XSS attack patterns in parameter values
 *
 * @param value - Parameter value to check
 * @returns true if XSS pattern detected
 */
export function detectXSS(value: string): boolean {
  return XSS_PATTERNS.some((pattern) => pattern.test(value));
}

/**
 * Detects SQL injection patterns in parameter values
 *
 * @param value - Parameter value to check
 * @returns true if SQL injection pattern detected
 */
export function detectSQLInjection(value: string): boolean {
  return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(value));
}

/**
 * Detects path traversal patterns in parameter values
 *
 * @param value - Parameter value to check
 * @returns true if path traversal pattern detected
 */
export function detectPathTraversal(value: string): boolean {
  return PATH_TRAVERSAL_PATTERNS.some((pattern) => pattern.test(value));
}

/**
 * Performs comprehensive security checks on parameter values
 *
 * @param value - Parameter value to validate
 * @param field - Field name for error reporting
 * @throws RouteValidationError if security threat detected
 */
export function performSecurityChecks(value: string, field: string): void {
  if (detectXSS(value)) {
    throw new RouteValidationError(
      `XSS pattern detected in ${field}`,
      field,
      'XSS_DETECTED'
    );
  }

  if (detectSQLInjection(value)) {
    throw new RouteValidationError(
      `SQL injection pattern detected in ${field}`,
      field,
      'SQL_INJECTION_DETECTED'
    );
  }

  if (detectPathTraversal(value)) {
    throw new RouteValidationError(
      `Path traversal pattern detected in ${field}`,
      field,
      'PATH_TRAVERSAL_DETECTED'
    );
  }
}

/**
 * Sanitizes special characters from parameter values
 * Removes or encodes potentially dangerous characters
 *
 * @param value - Parameter value to sanitize
 * @returns Sanitized value
 */
export function sanitizeSpecialCharacters(value: string): string {
  return value
    .replace(/[<>&"']/g, (char) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#x27;',
      };
      return entities[char] || char;
    })
    .trim();
}
