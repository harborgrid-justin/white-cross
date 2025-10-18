/**
 * LOC: 349E858709
 * WC-UTL-LOG-008 | Application Logging Utility
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - redis.ts (config/redis.ts)
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - AuditableModel.ts (database/models/base/AuditableModel.ts)
 *   - BaseRepository.ts (database/repositories/base/BaseRepository.ts)
 *   - AllergyRepository.ts (database/repositories/impl/AllergyRepository.ts)
 *   - ... and 124 more
 */

/**
 * WC-UTL-LOG-008 | Application Logging Utility
 * Purpose: Centralized logging with structured output, audit trails, and HIPAA compliance
 * Upstream: External winston package | Dependencies: winston, winston-daily-rotate-file
 * Downstream: All services, routes, middleware | Called by: Every application component
 * Related: auditLogging.ts, errorHandler.ts, performance.ts, security.ts
 * Exports: logger instance | Key Services: Error logging, audit trails, performance metrics
 * Last Updated: 2025-10-17 | Dependencies: winston, winston-daily-rotate-file
 * Critical Path: Log level check → Format message → Write to transports → Audit trail
 * LLM Context: HIPAA-compliant logging system, sanitizes PHI, maintains audit trails
 */

/**
 * Logger utility
 * 
 * @deprecated This file is being migrated to shared utilities.
 * Import from '../shared/logging' instead for new code.
 */

// Re-export from shared logging for backward compatibility
export { logger } from '../shared/logging/logger';
export { default } from '../shared/logging/logger';
