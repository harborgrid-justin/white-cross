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
 * @fileoverview Validators Module Barrel Export
 * @module validators
 * @description Central export point for all Joi validation schemas used across the healthcare platform
 * @exports incidentReportValidator - Incident reporting schemas and validation constraints
 * @exports complianceValidators - HIPAA/FERPA compliance, consent forms, audit logs
 * @exports healthRecordValidators - Health records, allergies, vaccinations, vital signs (commented out)
 * @exports medicationValidators - Medication management, Five Rights validation (commented out)
 * @exports userValidators - User authentication schemas (commented out)
 *
 * WC-IDX-VAL-062 | index.ts - Validators Module Barrel Export
 * Purpose: Central export point for all validation schemas, incident reports, compliance, health records
 * Upstream: ./incidentReportValidator, ./complianceValidators, ./healthRecordValidators, ./medicationValidators | Dependencies: validator modules
 * Downstream: ../routes/*.ts, ../services/*.ts | Called by: API route handlers, service layers
 * Related: ../middleware/validation.ts, ../shared/validation/schemas.ts, ../types/validation.ts
 * Exports: All validation schemas, helper functions, validation utilities | Key Services: Validation schema aggregation
 * Last Updated: 2025-10-18 | File Type: .ts | Pattern: Barrel Export
 * Critical Path: Import request → Schema selection → Validation execution → Error handling
 * LLM Context: Validation schemas barrel export for healthcare platform, incident reporting, compliance, medical records, user authentication
 *
 * @example
 * // Import specific validators
 * import {
 *   createIncidentReportSchema,
 *   createWitnessStatementSchema,
 *   VALIDATION_CONSTRAINTS
 * } from './validators';
 *
 * @example
 * // Import compliance validators
 * import {
 *   createConsentFormSchema,
 *   signConsentFormSchema,
 *   createAuditLogSchema
 * } from './validators';
 *
 * @example
 * // Use in route handler
 * import { createIncidentReportSchema } from './validators';
 * import { validateRequest } from '../middleware/validation';
 *
 * router.post('/incidents',
 *   validateRequest(createIncidentReportSchema),
 *   incidentController.create
 * );
 */

/**
 * @namespace IncidentReportValidators
 * @description Incident reporting validation schemas with safety compliance
 * @property {Object} createIncidentReportSchema - Create incident report with business rules
 * @property {Object} updateIncidentReportSchema - Update incident report (partial)
 * @property {Object} createWitnessStatementSchema - Create witness statement
 * @property {Object} createFollowUpActionSchema - Create follow-up action with priority
 * @property {Object} VALIDATION_CONSTRAINTS - Length constraints for incident fields
 * @property {Function} validateIncidentData - Helper function for validation
 */
export * from './incidentReportValidator';

/**
 * @namespace ComplianceValidators
 * @description HIPAA/FERPA compliance validation for consent, policies, and audit logs
 * @property {Object} createConsentFormSchema - Create consent form with legal requirements
 * @property {Object} signConsentFormSchema - Digital signature with audit trail
 * @property {Object} createPolicySchema - Create policy document with versioning
 * @property {Object} createAuditLogSchema - Create immutable audit log entry
 * @property {Object} createComplianceReportSchema - Create compliance report
 * @property {Object} auditLogFiltersSchema - Filter audit logs
 * @property {RegExp} versionPattern - Semantic versioning pattern
 * @property {RegExp} periodPattern - Reporting period pattern
 * @property {Array<string>} validRelationships - Authorized consent relationships
 */
export * from './complianceValidators';

/**
 * @namespace HealthRecordValidators
 * @description Health record validation schemas (allergies, vaccinations, vital signs, etc.)
 * @property {Object} createHealthRecordSchema - Create general health record
 * @property {Object} createAllergySchema - Create allergy record with EpiPen tracking
 * @property {Object} createConditionSchema - Create chronic condition with ICD-10 codes
 * @property {Object} createVaccinationSchema - Create vaccination record with CVX/NDC codes
 * @property {Object} createScreeningSchema - Create screening record
 * @property {Object} createGrowthMeasurementSchema - Create growth measurement
 * @property {Object} createVitalSignsSchema - Create vital signs with clinical ranges
 * @note Currently commented out - uncomment when health records module is active
 */
// export * from './healthRecordValidators';

/**
 * @namespace MedicationValidators
 * @description Medication validation schemas following Five Rights of Medication Administration
 * @property {Object} createMedicationSchema - Create medication in formulary
 * @property {Object} assignMedicationToStudentSchema - Create prescription
 * @property {Object} logMedicationAdministrationSchema - Log med administration (Five Rights)
 * @property {Object} addToInventorySchema - Add medication to inventory
 * @property {Object} reportAdverseReactionSchema - Report adverse reaction
 * @property {RegExp} ndcPattern - NDC code format pattern
 * @property {RegExp} dosagePattern - Dosage format pattern
 * @property {Array<RegExp>} frequencyPatterns - Medication frequency patterns
 * @property {Function} frequencyValidator - Custom frequency validator
 * @note Currently commented out - uncomment when medications module is active
 */
// export * from './medicationValidators';

/**
 * @namespace UserValidators
 * @description User authentication validation schemas
 * @property {Object} validateRequest - Request body validation middleware
 * @property {Object} validateQuery - Query parameters validation middleware
 * @property {Object} validateParams - URL parameters validation middleware
 * @note Re-exports from shared validation utilities for backward compatibility
 * @deprecated Migrate to importing directly from '../shared/validation'
 */
// export * from './userValidators';
