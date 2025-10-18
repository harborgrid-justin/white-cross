/**
 * LOC: 9202B0D88C
 * WC-UTL-SEH-056 | Sequelize Error Handler Re-export & Legacy Compatibility
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - auth.ts (routes/auth.ts)
 *   - bulkOperations.ts (services/allergy/bulkOperations.ts)
 *   - crudOperations.ts (services/allergy/crudOperations.ts)
 *   - queryOperations.ts (services/allergy/queryOperations.ts)
 *   - specialOperations.ts (services/allergy/specialOperations.ts)
 *   - ... and 4 more
 */

/**
 * WC-UTL-SEH-056 | Sequelize Error Handler Re-export & Legacy Compatibility
 * Purpose: Database error handling re-export, maintains backward compatibility
 * Upstream: shared/database/errorHandler | Dependencies: None (re-export only)
 * Downstream: Services, routes, database operations | Called by: Database error scenarios
 * Related: shared/database/errorHandler.ts, middleware/errorHandler.ts, database models
 * Exports: Re-exported error handling functions | Key Services: Error classification
 * Last Updated: 2025-10-18 | Dependencies: None (facade pattern)
 * Critical Path: Database error → Error classification → Shared handler execution
 * LLM Context: Deprecated utility, use shared/database/errorHandler directly
 */

/**
 * Sequelize Error Handling Utility
 * 
 * @deprecated This file is being migrated to shared utilities.
 * Import from '../shared/database' instead for new code.
 */

// Re-export from shared database utilities for backward compatibility
export * from '../shared/database/errorHandler';
