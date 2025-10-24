/**
 * WF-IDX-361 | index.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: React components/utilities | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Validation Schemas Barrel Export
 * Central export point for all validation schemas
 *
 * Backend Synchronized: These schemas match backend Joi validators
 * Last Sync: 2025-10-24
 */

// Critical healthcare validation schemas
export * from './medicationSchemas';
export * from './healthRecordSchemas';

// User and student management
export * from './userSchemas';
export * from './studentSchemas';

// Security and compliance
export * from './accessControlSchemas';

// Operations and communications
export * from './emergencyContactSchemas';
export * from './communicationSchemas';
export * from './incidentReportValidation';
