/**
 * LOC: C10F1961FD
 * WC-IDX-VAL-062 | index.ts - Validators Module Barrel Export
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-IDX-VAL-062 | index.ts - Validators Module Barrel Export
 * Purpose: Central export point for all validation schemas, incident reports, compliance, health records
 * Upstream: ./incidentReportValidator, ./complianceValidators, ./healthRecordValidators, ./medicationValidators | Dependencies: validator modules
 * Downstream: ../routes/*.ts, ../services/*.ts | Called by: API route handlers, service layers
 * Related: ../middleware/validation.ts, ../shared/validation/schemas.ts, ../types/validation.ts
 * Exports: All validation schemas, helper functions, validation utilities | Key Services: Validation schema aggregation
 * Last Updated: 2025-10-18 | File Type: .ts | Pattern: Barrel Export
 * Critical Path: Import request → Schema selection → Validation execution → Error handling
 * LLM Context: Validation schemas barrel export for healthcare platform, incident reporting, compliance, medical records, user authentication
 */

/**
 * Validators Barrel Export
 * Central export point for all validation schemas and helpers
 */

export * from './incidentReportValidator';
export * from './complianceValidators';
