/**
 * @fileoverview Compliance Server Actions - Next.js v16 App Router
 *
 * HIPAA-compliant server actions for compliance management including:
 * - Audit log creation with cryptographic hash chain
 * - Policy management and acknowledgment tracking
 * - Compliance report generation
 * - Training compliance tracking
 * - Real-time compliance monitoring
 *
 * All actions follow the ActionResult<T> pattern for consistent error handling
 * and implement fire-and-forget audit logging that never blocks operations.
 */

// Re-export all compliance actions from split files
export * from './compliance.types';
export * from './compliance.cache';
export * from './compliance.audit';
export * from './compliance.policy';
export * from './compliance.reports';
export * from './compliance.training';
