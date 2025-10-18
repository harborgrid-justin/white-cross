/**
 * LOC: 55D129475C
 * WC-IDX-SHR-068 | index.ts - Shared Utilities Barrel Export
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - User.ts (database/models/core/User.ts)
 *   - 03-users-and-assignments.ts (database/seeders/03-users-and-assignments.ts)
 *   - UserService.ts (database/services/UserService.ts)
 *   - administration.ts (routes/administration.ts)
 *   - audit.ts (routes/audit.ts)
 *   - ... and 4 more
 */

/**
 * WC-IDX-SHR-068 | index.ts - Shared Utilities Barrel Export
 * Purpose: Central export point for all shared utilities, security, auth, validation, healthcare functions
 * Upstream: ./utils, ./security, ./auth, ./validation, ./database, ./healthcare | Dependencies: shared module exports
 * Downstream: ../routes/*.ts, ../services/*.ts, ../middleware/*.ts | Called by: application components
 * Related: ../types/index.ts, ../config/*.ts, ../validators/*.ts
 * Exports: Utility functions, security helpers, auth utilities, validation schemas, healthcare utilities | Key Services: Shared functionality aggregation
 * Last Updated: 2025-10-18 | File Type: .ts | Pattern: Barrel Export
 * Critical Path: Import request → Shared utility selection → Function execution → Code reusability
 * LLM Context: Healthcare platform shared utilities with security, authentication, validation, database helpers, medical functions, communication tools
 */

/**
 * Shared utilities and functions for White Cross backend
 * 
 * This module exports all shared functionality that can be used
 * across different parts of the application to reduce code duplication
 * and improve maintainability.
 */

// Utility functions
export * from './utils';

// Security functions
export * from './security';

// Authentication functions
export * from './auth';

// Validation functions
export * from './validation';

// Database utilities
export * from './database';

// Logging utilities
export * from './logging';

// Healthcare utilities
export * from './healthcare';

// Communication utilities
export * from './communication';

// File utilities
export * from './files';

// Time and scheduling utilities
export * from './time';

// Performance monitoring utilities
export * from './monitoring';

// Configuration utilities
export * from './config';
