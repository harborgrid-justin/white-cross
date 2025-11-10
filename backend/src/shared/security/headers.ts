/**
 * LOC: F33379BB22
 * WC-GEN-319 | headers.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (shared/logging/logger.ts)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-319 | headers.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../logging/logger | Dependencies: ../logging/logger
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: functions, default export | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Security Headers Utility
 * Implements OWASP security best practices for HTTP headers
 *
 * Compliance: OWASP Secure Headers Project
 * HIPAA: Protects PHI transmission security
 */

import { logger } from '../logging/logger';

/**
 * Apply security headers to API responses
 * Simplified version for JSON APIs
 */
export function applyAPISecurityHeaders(response: any): void {
  response.header('X-Content-Type-Options', 'nosniff');
  response.header('X-Frame-Options', 'DENY');
  response.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.header('Cache-Control', 'no-store');
  response.header('Pragma', 'no-cache');
}

/**
 * Security headers for file downloads
 * Additional headers for PHI document downloads
 */
export function applyDownloadSecurityHeaders(
  response: any,
  filename: string,
  contentType: string,
): void {
  // Standard security headers
  response.header('X-Content-Type-Options', 'nosniff');
  response.header('X-Frame-Options', 'DENY');

  // Content disposition - force download
  response.header(
    'Content-Disposition',
    `attachment; filename="${encodeURIComponent(filename)}"`,
  );

  // Content type
  response.header('Content-Type', contentType);

  // Cache control - don't cache PHI
  response.header(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, private',
  );
  response.header('Pragma', 'no-cache');
  response.header('Expires', '0');
}

/**
 * Security headers audit logger
 * Logs missing security headers for compliance review
 */
export async function auditSecurityHeaders(
  response: any,
  path: string,
): Promise<void> {
  const requiredHeaders = [
    'Strict-Transport-Security',
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Content-Security-Policy',
    'Referrer-Policy',
  ];

  const missingHeaders = requiredHeaders.filter(
    (header) => !response.headers[header.toLowerCase()],
  );

  if (missingHeaders.length > 0) {
    logger.warn('Missing security headers', {
      path,
      missingHeaders,
      statusCode: response.statusCode,
    });
  }
}

export default {
  applyAPISecurityHeaders,
  applyDownloadSecurityHeaders,
  auditSecurityHeaders,
};
