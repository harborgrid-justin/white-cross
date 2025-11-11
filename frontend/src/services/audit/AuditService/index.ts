/**
 * @fileoverview Audit Service Module Exports
 * 
 * Central export point for the modular audit service implementation.
 * Provides clean imports for all audit service functionality.
 * 
 * @module AuditService
 * @version 1.0.0
 * @since 2025-11-11
 */

// Core service class
export { AuditService } from './core';

// Utility functions (for advanced usage)
export {
  generateChecksum,
  generateEventId,
  generateBatchId,
  generateSessionId,
  getClientIP,
  getUserAgent,
} from './utils';

// Storage and Event managers (for advanced usage)
export { StorageManager } from './storage-manager';
export { EventManager } from './event-manager';

// Re-export types and configuration from parent modules
export * from '../types';
export * from '../config';

// Create and export singleton instance
import { AuditService } from './core';

/**
 * Singleton instance of the audit service
 */
export const auditService = new AuditService();

/**
 * Initialize the audit service with user context
 * Should be called after user authentication
 */
export function initializeAuditService(user: {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}): void {
  auditService.setUserContext(user);
}

/**
 * Cleanup the audit service
 * Should be called on logout
 */
export function cleanupAuditService(): void {
  auditService.clearUserContext();
}

// Default export is the service class for flexibility
export default AuditService;
