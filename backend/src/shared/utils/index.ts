/**
 * LOC: 91F4823909
 * WC-IDX-329 | index.ts - Module exports and entry point
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-IDX-329 | index.ts - Module exports and entry point
 * Purpose: module exports and entry point
 * Upstream: Independent module | Dependencies: None
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: module exports and entry point, part of backend architecture
 */

// Shared utilities index
export * from './array';
export * from './object';
export * from './string';
export * from './date';
export * from './responseHelpers';
// Note: validation utilities moved to ../security/validation.service.ts
// DateHelpers provides more comprehensive date utilities
export { 
  formatDate, 
  getDateRange, 
  isPast, 
  isFuture, 
  addDays, 
  addMonths, 
  addYears, 
  parseDate,
  toISOString,
  getVaccinationPeriods,
  AgeInfo,
  DateFormat
} from './dateHelpers';
