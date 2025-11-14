/**
 * @fileoverview Legacy compatibility layer for AuditService
 * @deprecated This file serves as a backward compatibility layer.
 * The actual implementation has been refactored into modular components
 * under ./AuditService/ directory for better maintainability.
 * 
 * New imports should use the modular structure directly:
 * - ./AuditService/ for the main service
 * - ./AuditService/types for type definitions
 * 
 * This file will be removed in a future version.
 */

// Re-export everything from the new modular structure
export * from './AuditService/index';

// Re-export the main service class and singleton for backward compatibility
export {
  AuditService,
  auditService,
  initializeAuditService,
  cleanupAuditService,
  default
} from './AuditService/index';
