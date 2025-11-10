/**
 * Healthcare Downstream Composites - Type Definitions
 *
 * Central export for all type definitions used across healthcare downstream composites.
 * Import from this file for consistent type usage throughout the application.
 *
 * @example
 * ```typescript
 * import {
 *   PatientDemographics,
 *   MedicationOrder,
 *   HL7v2Message,
 *   OperationResult
 * } from './types';
 * ```
 *
 * @module types
 * @since 1.0.0
 */

// Common types and utilities
export * from './common.types';

// Patient types
export * from './patient.types';

// Medication types
export * from './medication.types';

// Prescription and e-prescribing types
export * from './prescription.types';

// HL7 v2 message types
export * from './hl7.types';

// Clinical types
export * from './clinical.types';

// Billing and revenue cycle types
export * from './billing.types';
