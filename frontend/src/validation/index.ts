/**
 * WF-VAL-001 | index.ts - Validation Schemas Barrel Export
 *
 * Central export point for all Zod validation schemas used throughout the
 * healthcare platform. These schemas provide runtime type validation for
 * forms, API requests, and data processing to ensure data integrity and
 * HIPAA compliance.
 *
 * @module validation
 *
 * @remarks
 * **Schema Synchronization**: All validation schemas in this module are
 * synchronized with backend Joi validators to ensure consistent validation
 * across frontend and backend. Synchronization is performed manually and
 * documented in each schema file.
 *
 * **HIPAA Compliance**: Validation schemas include checks for:
 * - PHI data format validation (SSN, medical record numbers)
 * - NPI number format validation for healthcare providers
 * - ICD-10 code format validation for diagnoses
 * - HIPAA-compliant data sanitization
 *
 * **Healthcare-Specific Validation**:
 * - Medical terminology and codes
 * - Dosage and medication formats
 * - Emergency contact requirements
 * - Healthcare provider credentials
 * - Immunization records
 *
 * **Usage Patterns**:
 * ```typescript
 * import { medicationSchema, healthRecordSchema } from '@/validation';
 *
 * // In a form
 * const validatedData = medicationSchema.parse(formData);
 *
 * // With safe parsing
 * const result = medicationSchema.safeParse(formData);
 * if (result.success) {
 *   // Use result.data
 * } else {
 *   // Handle result.error
 * }
 * ```
 *
 * **Schema Categories**:
 * - **Healthcare**: Medications, health records (PHI-aware validation)
 * - **User Management**: Users, students, permissions
 * - **Operations**: Emergency contacts, communications, incidents
 * - **Security**: Access control, authentication, RBAC
 *
 * **Backend Synchronization**:
 * - Last Sync: 2025-10-26
 * - Backend Validators: backend/src/shared/validation/
 * - Sync Process: Manual review of Joi schemas, conversion to Zod
 *
 * @see {@link https://zod.dev/|Zod Documentation}
 * @see {@link backend/src/shared/validation} for backend Joi schemas
 *
 * Last Updated: 2025-10-26 | File Type: .ts
 */

/**
 * Critical healthcare validation schemas.
 *
 * @remarks
 * **HIPAA Compliance**: These schemas include PHI-specific validation
 * and must be used for all medication and health record operations.
 */
export * from './medicationSchemas';
export * from './healthRecordSchemas';

/**
 * User and student management validation schemas.
 *
 * @remarks
 * User and student schemas enforce required fields for authentication,
 * authorization, and student enrollment processes.
 */
export * from './userSchemas';
export * from './studentSchemas';

/**
 * Security and compliance validation schemas.
 *
 * @remarks
 * Access control schemas enforce RBAC policies and permission structures.
 */
export * from './accessControlSchemas';

/**
 * Operations and communications validation schemas.
 *
 * @remarks
 * Emergency contacts require validated phone numbers and relationship data.
 * Communication schemas enforce message templates and notification formats.
 */
export * from './emergencyContactSchemas';
export * from './communicationSchemas';
export * from './incidentReportValidation';
