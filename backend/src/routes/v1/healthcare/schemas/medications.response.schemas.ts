/**
 * Medications Response Schemas - Comprehensive Swagger/OpenAPI Documentation
 *
 * This file contains all response schemas for medication-related endpoints.
 * Following the pattern established by Agent 4 (AG4C7D) for compliance/audit endpoints.
 *
 * HIPAA Compliance: All schemas include PHI protection metadata
 * OpenAPI Version: 2.0/3.0 compatible using Joi schemas
 *
 * @module medications.response.schemas
 */

import Joi from 'joi';

/**
 * CORE MEDICATION OBJECT SCHEMA
 * Represents a single medication record in the system
 *
 * @schema MedicationObject
 * @hipaa PHI Protected - contains patient medication information
 */
export const MedicationObjectSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .description('Medication unique identifier (UUID)')
    .example('550e8400-e29b-41d4-a716-446655440000'),

  medicationName: Joi.string()
    .description('Name of the medication with strength')
    .example('Ibuprofen 200mg'),

  dosage: Joi.string()
    .description('Dosage amount and unit')
    .example('200mg'),

  frequency: Joi.string()
    .description('How often to administer medication')
    .example('Every 6 hours as needed'),

  route: Joi.string()
    .description('Administration route. Common routes: Oral, Topical, Inhalation, Injection, Sublingual')
    .example('Oral'),

  prescribedBy: Joi.string()
    .description('Prescribing physician name')
    .example('Dr. Jane Smith'),

  startDate: Joi.date()
    .iso()
    .description('Medication start date (ISO 8601)')
    .example('2025-10-01T00:00:00Z'),

  endDate: Joi.date()
    .iso()
    .allow(null)
    .description('Medication end date (null if ongoing)')
    .example('2025-10-15T00:00:00Z'),

  instructions: Joi.string()
    .allow(null, '')
    .description('Special administration instructions')
    .example('Take with food to avoid stomach upset'),

  sideEffects: Joi.string()
    .allow(null, '')
    .description('Known or expected side effects')
    .example('May cause drowsiness, nausea, or dizziness'),

  isActive: Joi.boolean()
    .description('Whether medication is currently active. Inactive medications are archived for historical reference')
    .example(true),

  studentId: Joi.string()
    .uuid()
    .description('Student UUID')
    .example('660e8400-e29b-41d4-a716-446655440000'),

  studentName: Joi.string()
    .optional()
    .description('Student full name (included when populated)')
    .example('John Doe'),

  createdAt: Joi.date()
    .iso()
    .description('Record creation timestamp')
    .example('2025-10-01T08:00:00Z'),

  updatedAt: Joi.date()
    .iso()
    .description('Record last update timestamp')
    .example('2025-10-01T08:00:00Z')
}).label('MedicationObject').description('Complete medication record with PHI data');

/**
 * PAGINATION METADATA SCHEMA
 * Standard pagination information for list responses
 *
 * @schema PaginationObject
 */
export const PaginationObjectSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .description('Current page number')
    .example(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .description('Items per page')
    .example(20),

  total: Joi.number()
    .integer()
    .min(0)
    .description('Total number of items across all pages')
    .example(87),

  pages: Joi.number()
    .integer()
    .min(0)
    .description('Total number of pages')
    .example(5)
}).label('PaginationObject').description('Standard pagination metadata');

/**
 * SUCCESS RESPONSE: Single Medication
 * Used for GET /medications/{id}, POST /medications, PUT /medications/{id}
 *
 * @response 200 OK (GET, PUT)
 * @response 201 Created (POST)
 * @hipaa PHI Protected
 */
export const MedicationResponseSchema = Joi.object({
  success: Joi.boolean()
    .example(true)
    .description('Request success indicator'),

  data: Joi.object({
    medication: MedicationObjectSchema
  }).label('MedicationData')
}).label('MedicationResponse').description('Single medication record response');

/**
 * SUCCESS RESPONSE: Medication List with Pagination
 * Used for GET /medications, GET /medications/student/{studentId}
 *
 * @response 200 OK
 * @hipaa PHI Protected - may contain multiple patient records
 */
export const MedicationListResponseSchema = Joi.object({
  success: Joi.boolean()
    .example(true)
    .description('Request success indicator'),

  data: Joi.object({
    medications: Joi.array()
      .items(MedicationObjectSchema)
      .description('Array of medication records')
      .example([
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          medicationName: 'Ibuprofen 200mg',
          dosage: '200mg',
          frequency: 'Every 6 hours as needed',
          route: 'Oral',
          prescribedBy: 'Dr. Smith',
          startDate: '2025-10-01',
          isActive: true,
          studentId: '660e8400-e29b-41d4-a716-446655440000'
        }
      ]),

    pagination: PaginationObjectSchema
  }).label('MedicationListData')
}).label('MedicationListResponse').description('Paginated list of medication records');

/**
 * SUCCESS RESPONSE: Medication Deactivated
 * Used for PUT /medications/{id}/deactivate
 *
 * @response 200 OK
 * @hipaa PHI Protected
 */
export const MedicationDeactivatedResponseSchema = Joi.object({
  success: Joi.boolean()
    .example(true)
    .description('Request success indicator'),

  data: Joi.object({
    medication: MedicationObjectSchema,
    message: Joi.string()
      .description('Confirmation message')
      .example('Medication deactivated successfully. Historical record preserved for compliance.')
  }).label('MedicationDeactivatedData')
}).label('MedicationDeactivatedResponse').description('Medication deactivation confirmation');

/**
 * ERROR RESPONSE: Standard Error
 * Used for all error conditions (400, 401, 403, 404, 500)
 *
 * @response 400 Bad Request
 * @response 401 Unauthorized
 * @response 403 Forbidden
 * @response 404 Not Found
 * @response 500 Internal Server Error
 */
export const ErrorResponseSchema = Joi.object({
  success: Joi.boolean()
    .example(false)
    .description('Request success indicator'),

  error: Joi.object({
    message: Joi.string()
      .description('Human-readable error message')
      .example('Medication not found'),

    code: Joi.string()
      .optional()
      .description('Machine-readable error code. Common codes: VALIDATION_ERROR, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, INTERNAL_ERROR')
      .example('MEDICATION_NOT_FOUND'),

    details: Joi.any()
      .optional()
      .description('Additional error details or context')
      .example({ field: 'dosage', issue: 'Invalid format' })
  }).label('ErrorObject')
}).label('ErrorResponse').description('Standard error response for all error conditions');

/**
 * ERROR RESPONSE: Validation Error with Field Details
 * Used specifically for 400 Bad Request with validation failures
 *
 * @response 400 Bad Request
 */
export const ValidationErrorResponseSchema = Joi.object({
  success: Joi.boolean()
    .example(false)
    .description('Request success indicator'),

  error: Joi.object({
    message: Joi.string()
      .description('Human-readable error message')
      .example('Validation failed'),

    code: Joi.string()
      .example('VALIDATION_ERROR')
      .description('Machine-readable error code'),

    details: Joi.array()
      .items(
        Joi.object({
          field: Joi.string()
            .description('Field name that failed validation')
            .example('dosage'),

          message: Joi.string()
            .description('Validation error message for this field')
            .example('Dosage is required and must be a valid format'),

          type: Joi.string()
            .optional()
            .description('Type of validation error')
            .example('any.required')
        }).label('ValidationFieldError')
      )
      .description('Array of field-specific validation errors')
  }).label('ValidationErrorObject')
}).label('ValidationErrorResponse').description('Detailed validation error response');

/**
 * ERROR RESPONSE: Unauthorized (Missing or Invalid Authentication)
 * Used for 401 Unauthorized
 *
 * @response 401 Unauthorized
 */
export const UnauthorizedResponseSchema = Joi.object({
  success: Joi.boolean()
    .example(false),

  error: Joi.object({
    message: Joi.string()
      .example('Missing authentication')
      .description('Authentication error message'),

    code: Joi.string()
      .example('UNAUTHORIZED')
      .description('Error code')
  })
}).label('UnauthorizedResponse').description('Authentication required response');

/**
 * ERROR RESPONSE: Forbidden (Insufficient Permissions)
 * Used for 403 Forbidden
 *
 * @response 403 Forbidden
 */
export const ForbiddenResponseSchema = Joi.object({
  success: Joi.boolean()
    .example(false),

  error: Joi.object({
    message: Joi.string()
      .example('Insufficient permissions. Requires NURSE or ADMIN role.')
      .description('Permission error message'),

    code: Joi.string()
      .example('FORBIDDEN')
      .description('Error code'),

    requiredRole: Joi.string()
      .optional()
      .example('NURSE')
      .description('Required role for this operation')
  })
}).label('ForbiddenResponse').description('Insufficient permissions response');

/**
 * ERROR RESPONSE: Not Found
 * Used for 404 Not Found
 *
 * @response 404 Not Found
 */
export const NotFoundResponseSchema = Joi.object({
  success: Joi.boolean()
    .example(false),

  error: Joi.object({
    message: Joi.string()
      .example('Medication not found')
      .description('Not found error message'),

    code: Joi.string()
      .example('MEDICATION_NOT_FOUND')
      .description('Error code'),

    resourceId: Joi.string()
      .optional()
      .example('550e8400-e29b-41d4-a716-446655440000')
      .description('ID of the resource that was not found')
  })
}).label('NotFoundResponse').description('Resource not found response');

/**
 * ERROR RESPONSE: Internal Server Error
 * Used for 500 Internal Server Error
 *
 * @response 500 Internal Server Error
 */
export const InternalErrorResponseSchema = Joi.object({
  success: Joi.boolean()
    .example(false),

  error: Joi.object({
    message: Joi.string()
      .example('An internal error occurred while processing your request')
      .description('Internal error message'),

    code: Joi.string()
      .example('INTERNAL_ERROR')
      .description('Error code'),

    requestId: Joi.string()
      .optional()
      .example('req_abc123xyz')
      .description('Request ID for error tracking')
  })
}).label('InternalErrorResponse').description('Internal server error response');

/**
 * EXPORT ALL SCHEMAS
 *
 * Usage in route files:
 *
 * ```typescript
 * import {
 *   MedicationResponseSchema,
 *   MedicationListResponseSchema,
 *   ErrorResponseSchema
 * } from '../schemas/medications.response.schemas';
 *
 * plugins: {
 *   'hapi-swagger': {
 *     responses: {
 *       '200': { description: 'Success', schema: MedicationResponseSchema },
 *       '401': { description: 'Unauthorized', schema: ErrorResponseSchema }
 *     }
 *   }
 * }
 * ```
 */
export default {
  MedicationObjectSchema,
  PaginationObjectSchema,
  MedicationResponseSchema,
  MedicationListResponseSchema,
  MedicationDeactivatedResponseSchema,
  ErrorResponseSchema,
  ValidationErrorResponseSchema,
  UnauthorizedResponseSchema,
  ForbiddenResponseSchema,
  NotFoundResponseSchema,
  InternalErrorResponseSchema
};
