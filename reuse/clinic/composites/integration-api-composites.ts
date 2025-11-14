/**
 * LOC: CLINIC-COMP-INTEGRATION-API-001
 * File: /reuse/clinic/composites/integration-api-composites.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - class-validator (v0.14.x)
 *   - ../../data/composites/swagger-schema-generators
 *   - ../../data/composites/swagger-response-builders
 *   - ../../data/composites/swagger-security-schemes
 *   - ../../data/composites/swagger-parameter-decorators
 *   - ../../server/health/health-information-exchange-kit
 *   - ../../education/student-information-system-kit
 *   - ../../data/integration-adapters
 *
 * DOWNSTREAM (imported by):
 *   - Integration services
 *   - Webhook handlers
 *   - SIS synchronization modules
 *   - EHR/EMR connectors
 *   - Data exchange APIs
 */

/**
 * File: /reuse/clinic/composites/integration-api-composites.ts
 * Locator: WC-CLINIC-INTEGRATION-API-001
 * Purpose: Integration API Composites - Third-party integration and interoperability APIs
 *
 * Upstream: @nestjs/swagger, swagger composites, health/education kits, integration adapters
 * Downstream: Integration services, webhook handlers, SIS sync, EHR connectors
 * Dependencies: NestJS 10.x, Swagger 7.x, TypeScript 5.x, class-validator 0.14.x
 * Exports: 37 composed functions for comprehensive integration API documentation
 *
 * LLM Context: Production-grade integration API composite for White Cross system integrations.
 * Composes Swagger/OpenAPI utilities with integration functions providing complete API documentation
 * for third-party integration endpoints including webhook configuration with retry logic, SIS
 * (Student Information System) bidirectional sync with Infinite Campus/PowerSchool/Skyward, HL7 v2
 * message exchange for lab results and ADT (Admission-Discharge-Transfer), FHIR R4 resource APIs
 * for EHR/EMR interoperability, OAuth2 client registration for external systems, API key management
 * with rotation, data import/export with CSV/JSON/HL7 formats, integration health monitoring with
 * alerting, event-driven architecture with message queues, transformation engines for data mapping,
 * API versioning with deprecation policies, rate limiting per integration partner, and comprehensive
 * audit logging for compliance. Essential for enterprise health data exchange and school system integration.
 */

import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiProperty,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiSecurity,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDate,
  IsEnum,
  IsNumber,
  IsArray,
  IsBoolean,
  IsUUID,
  IsUrl,
} from 'class-validator';

// Swagger utilities imports
import {
  generateStringSchema,
  generateNumericSchema,
  generateBooleanSchema,
  generateArraySchema,
  generateObjectSchema,
  generateEnumSchema,
  generateFormatValidationSchema,
} from '../../data/composites/swagger-schema-generators';

import {
  createSuccessResponse,
  createCreatedResponse,
  createNoContentResponse,
  createAcceptedResponse,
  createBadRequestError,
  createUnauthorizedError,
  createNotFoundError,
  createConflictError,
  createOffsetPaginatedResponse,
} from '../../data/composites/swagger-response-builders';

import {
  createJwtAuthentication,
  createApiKeyHeader,
  createApiKeyWithIpWhitelist,
  createHmacAuthentication,
  createOAuth2ClientCredentialsFlow,
} from '../../data/composites/swagger-security-schemes';

import {
  createPaginationQueryParams,
  createSortingQueryParams,
  createDateRangeQueryParams,
  createUuidPathParam,
  createFilterQueryParams,
  createRequestIdHeader,
} from '../../data/composites/swagger-parameter-decorators';

// ============================================================================
// WEBHOOK CONFIGURATION (6 functions)
// ============================================================================

/**
 * Creates webhook configuration schema.
 * Schema for configuring third-party webhooks with retry logic.
 *
 * @returns Webhook configuration schema
 */
export function createWebhookConfigurationSchema() {
  return generateObjectSchema(
    'Webhook configuration',
    {
      webhookId: generateStringSchema('Webhook ID', { format: 'uuid' }),
      name: generateStringSchema('Webhook name', { example: 'Student Health Updates' }),
      url: generateFormatValidationSchema('uri', 'Webhook endpoint URL', {
        example: 'https://partner.example.com/webhooks/health-updates',
      }),
      events: generateArraySchema(
        'Subscribed events',
        generateEnumSchema(
          ['student.created', 'student.updated', 'health.screening.completed', 'immunization.updated', 'medication.administered'],
          'Event type',
          'string'
        ),
        { minItems: 1 }
      ),
      secret: generateStringSchema('Webhook secret for HMAC signature'),
      headers: generateObjectSchema('Custom headers', {}, []),
      retryConfig: generateObjectSchema('Retry configuration', {
        maxRetries: generateNumericSchema('Maximum retries', {
          type: 'integer',
          minimum: 0,
          maximum: 10,
          example: 3,
        }),
        retryDelay: generateNumericSchema('Initial retry delay (ms)', {
          type: 'integer',
          minimum: 100,
          maximum: 60000,
          example: 1000,
        }),
        backoffMultiplier: generateNumericSchema('Backoff multiplier', {
          type: 'number',
          minimum: 1,
          maximum: 5,
          example: 2,
        }),
      }, ['maxRetries', 'retryDelay', 'backoffMultiplier']),
      enabled: generateBooleanSchema('Webhook enabled', true),
      createdAt: generateFormatValidationSchema('date-time', 'Creation timestamp'),
    },
    ['webhookId', 'name', 'url', 'events', 'secret', 'enabled']
  );
}

/**
 * Creates webhook registration endpoint decorator.
 * POST endpoint for registering new webhooks.
 *
 * @returns Decorator for webhook registration
 */
export function createWebhookRegistrationEndpoint() {
  return applyDecorators(
    ApiTags('Webhook Management'),
    ApiOperation({
      summary: 'Register webhook',
      description: 'Register webhook endpoint for event subscriptions',
    }),
    createApiKeyHeader('X-Integration-Key', 'Integration API key'),
    ApiBody({
      description: 'Webhook configuration',
      schema: createWebhookConfigurationSchema(),
    }),
    createCreatedResponse(Object as any, 'Webhook registered'),
    createBadRequestError('Invalid webhook configuration'),
  );
}

/**
 * Creates webhook event schema.
 * Schema for webhook event payloads.
 *
 * @returns Webhook event schema
 */
export function createWebhookEventSchema() {
  return generateObjectSchema(
    'Webhook event payload',
    {
      eventId: generateStringSchema('Event ID', { format: 'uuid' }),
      eventType: generateStringSchema('Event type', {
        example: 'student.health.screening.completed',
      }),
      timestamp: generateFormatValidationSchema('date-time', 'Event timestamp'),
      data: generateObjectSchema('Event data', {}, []),
      metadata: generateObjectSchema('Event metadata', {
        source: generateStringSchema('Event source system'),
        version: generateStringSchema('API version', { example: 'v1' }),
        correlationId: generateStringSchema('Correlation ID', { format: 'uuid' }),
      }, []),
    },
    ['eventId', 'eventType', 'timestamp', 'data']
  );
}

/**
 * Creates webhook delivery log schema.
 * Schema for tracking webhook delivery attempts.
 *
 * @returns Delivery log schema
 */
export function createWebhookDeliveryLogSchema() {
  return generateObjectSchema(
    'Webhook delivery log',
    {
      deliveryId: generateStringSchema('Delivery ID', { format: 'uuid' }),
      webhookId: generateStringSchema('Webhook ID', { format: 'uuid' }),
      eventId: generateStringSchema('Event ID', { format: 'uuid' }),
      attemptNumber: generateNumericSchema('Attempt number', {
        type: 'integer',
        minimum: 1,
      }),
      attemptedAt: generateFormatValidationSchema('date-time', 'Attempt timestamp'),
      status: generateEnumSchema(['pending', 'success', 'failed', 'retrying'], 'Delivery status', 'string'),
      httpStatus: generateNumericSchema('HTTP status code', {
        type: 'integer',
        minimum: 100,
        maximum: 599,
      }),
      responseBody: generateStringSchema('Response body'),
      error: generateStringSchema('Error message'),
      duration: generateNumericSchema('Request duration (ms)', {
        type: 'integer',
        minimum: 0,
      }),
    },
    ['deliveryId', 'webhookId', 'eventId', 'attemptNumber', 'attemptedAt', 'status']
  );
}

/**
 * Creates webhook test endpoint decorator.
 * POST endpoint for testing webhook configuration.
 *
 * @returns Decorator for webhook test
 */
export function createWebhookTestEndpoint() {
  return applyDecorators(
    ApiTags('Webhook Management'),
    ApiOperation({
      summary: 'Test webhook',
      description: 'Send test event to webhook endpoint',
    }),
    createApiKeyHeader('X-Integration-Key'),
    createUuidPathParam('webhookId', 'Webhook identifier'),
    createAcceptedResponse(Object as any, 'Test event queued'),
    createNotFoundError('Webhook not found'),
  );
}

/**
 * Creates webhook delivery retry endpoint decorator.
 * POST endpoint for manually retrying failed deliveries.
 *
 * @returns Decorator for delivery retry
 */
export function createWebhookRetryEndpoint() {
  return applyDecorators(
    ApiTags('Webhook Management'),
    ApiOperation({
      summary: 'Retry webhook delivery',
      description: 'Manually retry failed webhook delivery',
    }),
    createApiKeyHeader('X-Integration-Key'),
    createUuidPathParam('deliveryId', 'Delivery log identifier'),
    createAcceptedResponse(Object as any, 'Retry queued'),
    createNotFoundError('Delivery log not found'),
  );
}

// ============================================================================
// SIS SYNCHRONIZATION (7 functions)
// ============================================================================

/**
 * Creates SIS integration configuration schema.
 * Schema for Student Information System integration settings.
 *
 * @returns SIS integration schema
 */
export function createSISIntegrationSchema() {
  return generateObjectSchema(
    'SIS integration configuration',
    {
      integrationId: generateStringSchema('Integration ID', { format: 'uuid' }),
      sisProvider: generateEnumSchema(
        ['infinite-campus', 'powerschool', 'skyward', 'aspen', 'synergy'],
        'SIS provider',
        'string'
      ),
      endpoint: generateFormatValidationSchema('uri', 'SIS API endpoint'),
      authentication: generateObjectSchema('Authentication config', {
        authType: generateEnumSchema(['oauth2', 'api-key', 'basic'], 'Auth type', 'string'),
        credentials: generateObjectSchema('Credentials', {}, []),
      }, ['authType']),
      syncSchedule: generateObjectSchema('Sync schedule', {
        frequency: generateEnumSchema(['real-time', 'hourly', 'daily', 'weekly'], 'Sync frequency', 'string'),
        cronExpression: generateStringSchema('Cron expression'),
      }, ['frequency']),
      syncEntities: generateArraySchema(
        'Entities to sync',
        generateEnumSchema(
          ['students', 'enrollments', 'demographics', 'contacts', 'attendance'],
          'Entity type',
          'string'
        ),
        { minItems: 1 }
      ),
      fieldMappings: generateArraySchema(
        'Field mappings',
        generateObjectSchema('Field mapping', {
          sisField: generateStringSchema('SIS field name'),
          localField: generateStringSchema('Local field name'),
          transformation: generateStringSchema('Transformation function'),
        }, ['sisField', 'localField']),
        {}
      ),
      enabled: generateBooleanSchema('Integration enabled', true),
    },
    ['integrationId', 'sisProvider', 'endpoint', 'authentication', 'syncSchedule', 'syncEntities']
  );
}

/**
 * Creates SIS sync status schema.
 * Schema for tracking synchronization status.
 *
 * @returns Sync status schema
 */
export function createSISSyncStatusSchema() {
  return generateObjectSchema(
    'SIS sync status',
    {
      syncId: generateStringSchema('Sync job ID', { format: 'uuid' }),
      integrationId: generateStringSchema('Integration ID', { format: 'uuid' }),
      entity: generateEnumSchema(
        ['students', 'enrollments', 'demographics'],
        'Synced entity',
        'string'
      ),
      startedAt: generateFormatValidationSchema('date-time', 'Sync start time'),
      completedAt: generateFormatValidationSchema('date-time', 'Sync completion time'),
      status: generateEnumSchema(['running', 'completed', 'failed', 'partial'], 'Sync status', 'string'),
      recordsProcessed: generateNumericSchema('Records processed', {
        type: 'integer',
        minimum: 0,
      }),
      recordsCreated: generateNumericSchema('Records created', {
        type: 'integer',
        minimum: 0,
      }),
      recordsUpdated: generateNumericSchema('Records updated', {
        type: 'integer',
        minimum: 0,
      }),
      recordsFailed: generateNumericSchema('Records failed', {
        type: 'integer',
        minimum: 0,
      }),
      errors: generateArraySchema(
        'Sync errors',
        generateObjectSchema('Sync error', {
          recordId: generateStringSchema('Record ID'),
          error: generateStringSchema('Error message'),
        }, ['recordId', 'error']),
        {}
      ),
    },
    ['syncId', 'integrationId', 'entity', 'startedAt', 'status', 'recordsProcessed']
  );
}

/**
 * Creates SIS sync trigger endpoint decorator.
 * POST endpoint for manually triggering synchronization.
 *
 * @returns Decorator for sync trigger
 */
export function createSISSyncTriggerEndpoint() {
  return applyDecorators(
    ApiTags('SIS Synchronization'),
    ApiOperation({
      summary: 'Trigger SIS sync',
      description: 'Manually trigger SIS synchronization job',
    }),
    createApiKeyHeader('X-Integration-Key'),
    createUuidPathParam('integrationId', 'SIS integration identifier'),
    ApiBody({
      description: 'Sync parameters',
      schema: generateObjectSchema('Sync request', {
        entities: generateArraySchema('Entities to sync', generateStringSchema('Entity'), { minItems: 1 }),
        fullSync: generateBooleanSchema('Full sync (vs incremental)', false),
      }, ['entities']),
    }),
    createAcceptedResponse(Object as any, 'Sync job queued'),
    createNotFoundError('Integration not found'),
  );
}

/**
 * Creates student roster sync schema.
 * Schema for student roster data exchange.
 *
 * @returns Roster sync schema
 */
export function createStudentRosterSyncSchema() {
  return generateObjectSchema(
    'Student roster sync',
    {
      syncDate: generateFormatValidationSchema('date-time', 'Sync timestamp'),
      schoolYear: generateStringSchema('School year', { example: '2024-2025' }),
      students: generateArraySchema(
        'Student records',
        generateObjectSchema('Student record', {
          sisId: generateStringSchema('SIS student ID'),
          firstName: generateStringSchema('First name'),
          lastName: generateStringSchema('Last name'),
          grade: generateEnumSchema(['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], 'Grade', 'string'),
          dateOfBirth: generateFormatValidationSchema('date', 'Date of birth'),
          school: generateStringSchema('School name'),
          enrollmentStatus: generateEnumSchema(['active', 'inactive', 'transferred'], 'Enrollment status', 'string'),
        }, ['sisId', 'firstName', 'lastName', 'grade', 'dateOfBirth', 'school', 'enrollmentStatus']),
        {}
      ),
      totalRecords: generateNumericSchema('Total records', {
        type: 'integer',
        minimum: 0,
      }),
    },
    ['syncDate', 'schoolYear', 'students', 'totalRecords']
  );
}

/**
 * Creates demographic update schema.
 * Schema for student demographic updates from SIS.
 *
 * @returns Demographic update schema
 */
export function createDemographicUpdateSchema() {
  return generateObjectSchema(
    'Demographic update',
    {
      sisId: generateStringSchema('SIS student ID'),
      updates: generateObjectSchema('Updated fields', {
        address: generateStringSchema('Updated address'),
        phone: generateStringSchema('Updated phone'),
        emergencyContacts: generateArraySchema(
          'Updated emergency contacts',
          generateObjectSchema('Contact', {
            name: generateStringSchema('Contact name'),
            relationship: generateStringSchema('Relationship'),
            phone: generateStringSchema('Phone'),
          }, ['name', 'relationship', 'phone']),
          {}
        ),
      }, []),
      updateTimestamp: generateFormatValidationSchema('date-time', 'Update timestamp'),
      source: generateStringSchema('Update source', { example: 'PowerSchool' }),
    },
    ['sisId', 'updates', 'updateTimestamp', 'source']
  );
}

/**
 * Creates enrollment change notification schema.
 * Schema for student enrollment change events.
 *
 * @returns Enrollment change schema
 */
export function createEnrollmentChangeSchema() {
  return generateObjectSchema(
    'Enrollment change notification',
    {
      changeId: generateStringSchema('Change ID', { format: 'uuid' }),
      sisId: generateStringSchema('SIS student ID'),
      changeType: generateEnumSchema(['enrollment', 'withdrawal', 'transfer'], 'Change type', 'string'),
      effectiveDate: generateFormatValidationSchema('date', 'Effective date'),
      school: generateStringSchema('School name'),
      grade: generateStringSchema('Grade level'),
      reason: generateStringSchema('Change reason'),
      notificationDate: generateFormatValidationSchema('date-time', 'Notification timestamp'),
    },
    ['changeId', 'sisId', 'changeType', 'effectiveDate', 'school', 'notificationDate']
  );
}

/**
 * Creates SIS data validation schema.
 * Schema for validating SIS data before sync.
 *
 * @returns Data validation schema
 */
export function createSISDataValidationSchema() {
  return generateObjectSchema(
    'SIS data validation result',
    {
      validationId: generateStringSchema('Validation ID', { format: 'uuid' }),
      validatedAt: generateFormatValidationSchema('date-time', 'Validation timestamp'),
      totalRecords: generateNumericSchema('Total records', { type: 'integer', minimum: 0 }),
      validRecords: generateNumericSchema('Valid records', { type: 'integer', minimum: 0 }),
      invalidRecords: generateNumericSchema('Invalid records', { type: 'integer', minimum: 0 }),
      validationErrors: generateArraySchema(
        'Validation errors',
        generateObjectSchema('Validation error', {
          recordId: generateStringSchema('Record ID'),
          field: generateStringSchema('Field name'),
          error: generateStringSchema('Error description'),
          severity: generateEnumSchema(['warning', 'error'], 'Severity', 'string'),
        }, ['recordId', 'field', 'error', 'severity']),
        {}
      ),
      readyForSync: generateBooleanSchema('Ready for synchronization'),
    },
    ['validationId', 'validatedAt', 'totalRecords', 'validRecords', 'invalidRecords', 'readyForSync']
  );
}

// ============================================================================
// EHR/EMR INTEGRATION (6 functions)
// ============================================================================

/**
 * Creates HL7 v2 message schema.
 * Schema for HL7 v2 message exchange.
 *
 * @returns HL7 message schema
 */
export function createHL7MessageSchema() {
  return generateObjectSchema(
    'HL7 v2 message',
    {
      messageId: generateStringSchema('Message ID', { format: 'uuid' }),
      messageType: generateEnumSchema(['ADT', 'ORU', 'ORM', 'SIU'], 'HL7 message type', 'string'),
      messageEvent: generateStringSchema('Message event', { example: 'A01' }),
      rawMessage: generateStringSchema('Raw HL7 message'),
      parsedSegments: generateObjectSchema('Parsed segments', {
        MSH: generateObjectSchema('MSH segment', {}, []),
        PID: generateObjectSchema('PID segment', {}, []),
      }, []),
      sendingFacility: generateStringSchema('Sending facility'),
      receivingFacility: generateStringSchema('Receiving facility'),
      timestamp: generateFormatValidationSchema('date-time', 'Message timestamp'),
      status: generateEnumSchema(['received', 'processing', 'processed', 'error'], 'Processing status', 'string'),
      acknowledgment: generateObjectSchema('ACK details', {
        ackCode: generateEnumSchema(['AA', 'AE', 'AR'], 'ACK code', 'string'),
        errorMessage: generateStringSchema('Error message'),
      }, []),
    },
    ['messageId', 'messageType', 'messageEvent', 'rawMessage', 'sendingFacility', 'timestamp', 'status']
  );
}

/**
 * Creates FHIR resource exchange schema.
 * Schema for FHIR R4 resource operations.
 *
 * @returns FHIR resource schema
 */
export function createFHIRResourceSchema() {
  return generateObjectSchema(
    'FHIR R4 resource',
    {
      resourceType: generateEnumSchema(
        ['Patient', 'Observation', 'Immunization', 'MedicationRequest', 'AllergyIntolerance'],
        'FHIR resource type',
        'string'
      ),
      id: generateStringSchema('Resource ID'),
      meta: generateObjectSchema('Resource metadata', {
        versionId: generateStringSchema('Version ID'),
        lastUpdated: generateFormatValidationSchema('date-time', 'Last updated'),
        profile: generateArraySchema('Profiles', generateStringSchema('Profile URL'), {}),
      }, []),
      resource: generateObjectSchema('FHIR resource data', {}, []),
      bundle: generateBooleanSchema('Part of bundle', false),
    },
    ['resourceType', 'id', 'resource']
  );
}

/**
 * Creates FHIR endpoint decorator.
 * POST/GET endpoint for FHIR resource operations.
 *
 * @returns Decorator for FHIR endpoint
 */
export function createFHIREndpoint() {
  return applyDecorators(
    ApiTags('FHIR Integration'),
    ApiOperation({
      summary: 'FHIR resource operation',
      description: 'Create or retrieve FHIR R4 resources',
    }),
    createOAuth2ClientCredentialsFlow(
      'https://auth.example.com/oauth/token',
      { 'system/*.read': 'Read FHIR resources', 'system/*.write': 'Write FHIR resources' }
    ),
    ApiHeader({
      name: 'Accept',
      required: false,
      schema: {
        type: 'string',
        enum: ['application/fhir+json', 'application/fhir+xml'],
        example: 'application/fhir+json',
      },
    }),
    createSuccessResponse(Object as any, 'FHIR resource'),
    createBadRequestError('Invalid FHIR resource'),
  );
}

/**
 * Creates lab result interface schema.
 * Schema for receiving lab results from EHR.
 *
 * @returns Lab result schema
 */
export function createLabResultInterfaceSchema() {
  return generateObjectSchema(
    'Lab result interface',
    {
      resultId: generateStringSchema('Result ID', { format: 'uuid' }),
      patientMRN: generateStringSchema('Patient MRN'),
      orderingProvider: generateStringSchema('Ordering provider'),
      labTest: generateStringSchema('Lab test name', { example: 'Complete Blood Count' }),
      collectionDate: generateFormatValidationSchema('date-time', 'Specimen collection date'),
      resultDate: generateFormatValidationSchema('date-time', 'Result date'),
      results: generateArraySchema(
        'Test results',
        generateObjectSchema('Result', {
          testName: generateStringSchema('Test name'),
          value: generateStringSchema('Result value'),
          unit: generateStringSchema('Unit of measure'),
          referenceRange: generateStringSchema('Reference range'),
          abnormalFlag: generateEnumSchema(['normal', 'high', 'low', 'critical'], 'Abnormal flag', 'string'),
        }, ['testName', 'value']),
        { minItems: 1 }
      ),
      status: generateEnumSchema(['preliminary', 'final', 'corrected'], 'Result status', 'string'),
      receivedFrom: generateStringSchema('Source EHR system'),
    },
    ['resultId', 'patientMRN', 'labTest', 'collectionDate', 'results', 'status', 'receivedFrom']
  );
}

/**
 * Creates EHR patient matching schema.
 * Schema for patient matching between systems.
 *
 * @returns Patient matching schema
 */
export function createPatientMatchingSchema() {
  return generateObjectSchema(
    'Patient matching request',
    {
      matchRequestId: generateStringSchema('Match request ID', { format: 'uuid' }),
      demographics: generateObjectSchema('Patient demographics', {
        firstName: generateStringSchema('First name'),
        lastName: generateStringSchema('Last name'),
        dateOfBirth: generateFormatValidationSchema('date', 'Date of birth'),
        gender: generateEnumSchema(['male', 'female', 'other'], 'Gender', 'string'),
        ssn: generateStringSchema('Social security number (last 4)'),
        phone: generateStringSchema('Phone number'),
      }, ['firstName', 'lastName', 'dateOfBirth']),
      matchCriteria: generateObjectSchema('Matching criteria', {
        algorithm: generateEnumSchema(['exact', 'probabilistic', 'fuzzy'], 'Match algorithm', 'string'),
        minimumScore: generateNumericSchema('Minimum match score', {
          type: 'number',
          minimum: 0,
          maximum: 1,
        }),
      }, ['algorithm']),
      matches: generateArraySchema(
        'Potential matches',
        generateObjectSchema('Match', {
          patientId: generateStringSchema('Matched patient ID'),
          matchScore: generateNumericSchema('Match score', { type: 'number', minimum: 0, maximum: 1 }),
          matchedFields: generateArraySchema('Matched fields', generateStringSchema('Field'), {}),
        }, ['patientId', 'matchScore']),
        {}
      ),
    },
    ['matchRequestId', 'demographics', 'matchCriteria']
  );
}

/**
 * Creates medication reconciliation schema.
 * Schema for medication reconciliation between EHR and school system.
 *
 * @returns Medication reconciliation schema
 */
export function createMedicationReconciliationSchema() {
  return generateObjectSchema(
    'Medication reconciliation',
    {
      reconciliationId: generateStringSchema('Reconciliation ID', { format: 'uuid' }),
      patientMRN: generateStringSchema('Patient MRN'),
      ehrMedications: generateArraySchema(
        'Medications from EHR',
        generateObjectSchema('EHR medication', {
          medicationName: generateStringSchema('Medication name'),
          dosage: generateStringSchema('Dosage'),
          frequency: generateStringSchema('Frequency'),
          prescriber: generateStringSchema('Prescriber'),
          startDate: generateFormatValidationSchema('date', 'Start date'),
        }, ['medicationName', 'dosage', 'frequency']),
        {}
      ),
      schoolMedications: generateArraySchema(
        'Medications on file at school',
        generateObjectSchema('School medication', {
          medicationName: generateStringSchema('Medication name'),
          dosage: generateStringSchema('Dosage'),
          frequency: generateStringSchema('Frequency'),
        }, ['medicationName', 'dosage']),
        {}
      ),
      discrepancies: generateArraySchema(
        'Identified discrepancies',
        generateObjectSchema('Discrepancy', {
          medicationName: generateStringSchema('Medication name'),
          discrepancyType: generateEnumSchema(
            ['missing-in-school', 'missing-in-ehr', 'dosage-mismatch', 'discontinued'],
            'Discrepancy type',
            'string'
          ),
          recommendation: generateStringSchema('Recommended action'),
        }, ['medicationName', 'discrepancyType']),
        {}
      ),
      reconciledAt: generateFormatValidationSchema('date-time', 'Reconciliation timestamp'),
    },
    ['reconciliationId', 'patientMRN', 'ehrMedications', 'schoolMedications', 'reconciledAt']
  );
}

// ============================================================================
// DATA IMPORT/EXPORT (5 functions)
// ============================================================================

/**
 * Creates data export request schema.
 * Schema for requesting data exports.
 *
 * @returns Export request schema
 */
export function createDataExportRequestSchema() {
  return generateObjectSchema(
    'Data export request',
    {
      exportId: generateStringSchema('Export ID', { format: 'uuid' }),
      exportType: generateEnumSchema(
        ['students', 'health-records', 'immunizations', 'screenings', 'audit-logs'],
        'Export type',
        'string'
      ),
      format: generateEnumSchema(['csv', 'json', 'xml', 'hl7', 'fhir'], 'Export format', 'string'),
      filters: generateObjectSchema('Export filters', {
        dateRange: generateObjectSchema('Date range', {
          startDate: generateFormatValidationSchema('date', 'Start date'),
          endDate: generateFormatValidationSchema('date', 'End date'),
        }, []),
        schools: generateArraySchema('School IDs', generateStringSchema('School ID'), {}),
        grades: generateArraySchema('Grade levels', generateStringSchema('Grade'), {}),
      }, []),
      includeDeleted: generateBooleanSchema('Include deleted records', false),
      requestedBy: generateStringSchema('Requester user ID', { format: 'uuid' }),
      requestedAt: generateFormatValidationSchema('date-time', 'Request timestamp'),
      status: generateEnumSchema(['pending', 'processing', 'completed', 'failed'], 'Export status', 'string'),
      downloadUrl: generateStringSchema('Download URL (when completed)'),
      expiresAt: generateFormatValidationSchema('date-time', 'Download expiration'),
    },
    ['exportId', 'exportType', 'format', 'requestedBy', 'requestedAt', 'status']
  );
}

/**
 * Creates export request endpoint decorator.
 * POST endpoint for initiating data exports.
 *
 * @returns Decorator for export request
 */
export function createDataExportEndpoint() {
  return applyDecorators(
    ApiTags('Data Import/Export'),
    ApiOperation({
      summary: 'Request data export',
      description: 'Initiate data export job in specified format',
    }),
    createApiKeyHeader('X-Integration-Key'),
    ApiBody({
      description: 'Export request',
      schema: createDataExportRequestSchema(),
    }),
    createAcceptedResponse(Object as any, 'Export job queued'),
    createBadRequestError('Invalid export request'),
  );
}

/**
 * Creates data import schema.
 * Schema for bulk data imports.
 *
 * @returns Import schema
 */
export function createDataImportSchema() {
  return generateObjectSchema(
    'Data import',
    {
      importId: generateStringSchema('Import ID', { format: 'uuid' }),
      importType: generateEnumSchema(
        ['students', 'immunizations', 'health-records'],
        'Import type',
        'string'
      ),
      format: generateEnumSchema(['csv', 'json', 'xml'], 'Import format', 'string'),
      fileUrl: generateStringSchema('Import file URL or path'),
      mappingProfile: generateStringSchema('Field mapping profile ID', { format: 'uuid' }),
      validationMode: generateEnumSchema(['strict', 'lenient'], 'Validation mode', 'string'),
      importedBy: generateStringSchema('Importing user ID', { format: 'uuid' }),
      importedAt: generateFormatValidationSchema('date-time', 'Import timestamp'),
      status: generateEnumSchema(['validating', 'importing', 'completed', 'failed'], 'Import status', 'string'),
      recordsProcessed: generateNumericSchema('Records processed', { type: 'integer', minimum: 0 }),
      recordsImported: generateNumericSchema('Records imported', { type: 'integer', minimum: 0 }),
      recordsFailed: generateNumericSchema('Records failed', { type: 'integer', minimum: 0 }),
      errors: generateArraySchema(
        'Import errors',
        generateObjectSchema('Error', {
          row: generateNumericSchema('Row number', { type: 'integer' }),
          field: generateStringSchema('Field name'),
          error: generateStringSchema('Error message'),
        }, ['row', 'error']),
        {}
      ),
    },
    ['importId', 'importType', 'format', 'fileUrl', 'importedBy', 'importedAt', 'status']
  );
}

/**
 * Creates field mapping profile schema.
 * Schema for data transformation mappings.
 *
 * @returns Mapping profile schema
 */
export function createFieldMappingProfileSchema() {
  return generateObjectSchema(
    'Field mapping profile',
    {
      profileId: generateStringSchema('Profile ID', { format: 'uuid' }),
      name: generateStringSchema('Profile name', { example: 'PowerSchool Student Import' }),
      description: generateStringSchema('Profile description'),
      sourceFormat: generateEnumSchema(['csv', 'json', 'xml', 'hl7'], 'Source format', 'string'),
      targetEntity: generateEnumSchema(['student', 'immunization', 'health-record'], 'Target entity', 'string'),
      mappings: generateArraySchema(
        'Field mappings',
        generateObjectSchema('Field mapping', {
          sourceField: generateStringSchema('Source field name'),
          targetField: generateStringSchema('Target field name'),
          transformation: generateEnumSchema(
            ['direct', 'uppercase', 'lowercase', 'date-format', 'lookup', 'custom'],
            'Transformation',
            'string'
          ),
          transformationConfig: generateObjectSchema('Transformation config', {}, []),
          defaultValue: generateStringSchema('Default value if source is empty'),
          required: generateBooleanSchema('Target field required'),
        }, ['sourceField', 'targetField', 'transformation']),
        { minItems: 1 }
      ),
      createdAt: generateFormatValidationSchema('date-time', 'Creation timestamp'),
      version: generateNumericSchema('Profile version', { type: 'integer', minimum: 1 }),
    },
    ['profileId', 'name', 'sourceFormat', 'targetEntity', 'mappings', 'version']
  );
}

/**
 * Creates data transformation endpoint decorator.
 * POST endpoint for applying data transformations.
 *
 * @returns Decorator for transformation endpoint
 */
export function createDataTransformationEndpoint() {
  return applyDecorators(
    ApiTags('Data Import/Export'),
    ApiOperation({
      summary: 'Transform data',
      description: 'Apply field mappings and transformations to data',
    }),
    createApiKeyHeader('X-Integration-Key'),
    ApiBody({
      description: 'Transformation request',
      schema: generateObjectSchema('Transformation request', {
        profileId: generateStringSchema('Mapping profile ID', { format: 'uuid' }),
        sourceData: generateArraySchema('Source data records', generateObjectSchema('Record', {}, []), {}),
      }, ['profileId', 'sourceData']),
    }),
    createSuccessResponse(Object as any, 'Transformed data'),
    createBadRequestError('Transformation failed'),
  );
}

// ============================================================================
// INTEGRATION MONITORING (6 functions)
// ============================================================================

/**
 * Creates integration health schema.
 * Schema for integration health monitoring.
 *
 * @returns Integration health schema
 */
export function createIntegrationHealthSchema() {
  return generateObjectSchema(
    'Integration health status',
    {
      integrationId: generateStringSchema('Integration ID', { format: 'uuid' }),
      integrationName: generateStringSchema('Integration name'),
      integrationType: generateEnumSchema(['webhook', 'sis', 'ehr', 'fhir'], 'Integration type', 'string'),
      status: generateEnumSchema(['healthy', 'degraded', 'down'], 'Health status', 'string'),
      lastCheckAt: generateFormatValidationSchema('date-time', 'Last health check'),
      uptime: generateNumericSchema('Uptime percentage', {
        type: 'number',
        minimum: 0,
        maximum: 100,
      }),
      metrics: generateObjectSchema('Health metrics', {
        requestsLast24h: generateNumericSchema('Requests (24h)', { type: 'integer', minimum: 0 }),
        successRate: generateNumericSchema('Success rate (%)', { type: 'number', minimum: 0, maximum: 100 }),
        averageLatency: generateNumericSchema('Avg latency (ms)', { type: 'number', minimum: 0 }),
        errorRate: generateNumericSchema('Error rate (%)', { type: 'number', minimum: 0, maximum: 100 }),
      }, []),
      recentErrors: generateArraySchema(
        'Recent errors',
        generateObjectSchema('Error', {
          timestamp: generateFormatValidationSchema('date-time', 'Error timestamp'),
          error: generateStringSchema('Error message'),
        }, ['timestamp', 'error']),
        {}
      ),
    },
    ['integrationId', 'integrationName', 'integrationType', 'status', 'lastCheckAt', 'metrics']
  );
}

/**
 * Creates health check endpoint decorator.
 * GET endpoint for integration health monitoring.
 *
 * @returns Decorator for health check
 */
export function createIntegrationHealthEndpoint() {
  return applyDecorators(
    ApiTags('Integration Monitoring'),
    ApiOperation({
      summary: 'Get integration health',
      description: 'Retrieve health status for all integrations',
    }),
    createApiKeyHeader('X-Integration-Key'),
    createOffsetPaginatedResponse(Object as any, 'Integration health statuses'),
  );
}

/**
 * Creates integration metrics schema.
 * Schema for integration performance metrics.
 *
 * @returns Metrics schema
 */
export function createIntegrationMetricsSchema() {
  return generateObjectSchema(
    'Integration metrics',
    {
      integrationId: generateStringSchema('Integration ID', { format: 'uuid' }),
      metricsDate: generateFormatValidationSchema('date', 'Metrics date'),
      requests: generateObjectSchema('Request metrics', {
        total: generateNumericSchema('Total requests', { type: 'integer', minimum: 0 }),
        successful: generateNumericSchema('Successful requests', { type: 'integer', minimum: 0 }),
        failed: generateNumericSchema('Failed requests', { type: 'integer', minimum: 0 }),
        retried: generateNumericSchema('Retried requests', { type: 'integer', minimum: 0 }),
      }, []),
      latency: generateObjectSchema('Latency metrics', {
        average: generateNumericSchema('Average (ms)', { type: 'number', minimum: 0 }),
        p50: generateNumericSchema('50th percentile (ms)', { type: 'number', minimum: 0 }),
        p95: generateNumericSchema('95th percentile (ms)', { type: 'number', minimum: 0 }),
        p99: generateNumericSchema('99th percentile (ms)', { type: 'number', minimum: 0 }),
      }, []),
      dataTransfer: generateObjectSchema('Data transfer', {
        bytesIn: generateNumericSchema('Bytes received', { type: 'integer', minimum: 0 }),
        bytesOut: generateNumericSchema('Bytes sent', { type: 'integer', minimum: 0 }),
      }, []),
    },
    ['integrationId', 'metricsDate']
  );
}

/**
 * Creates integration alert schema.
 * Schema for integration alerts and notifications.
 *
 * @returns Alert schema
 */
export function createIntegrationAlertSchema() {
  return generateObjectSchema(
    'Integration alert',
    {
      alertId: generateStringSchema('Alert ID', { format: 'uuid' }),
      integrationId: generateStringSchema('Integration ID', { format: 'uuid' }),
      severity: generateEnumSchema(['info', 'warning', 'error', 'critical'], 'Alert severity', 'string'),
      alertType: generateEnumSchema(
        ['connection-failure', 'rate-limit', 'authentication-failure', 'data-error'],
        'Alert type',
        'string'
      ),
      message: generateStringSchema('Alert message'),
      triggeredAt: generateFormatValidationSchema('date-time', 'Alert timestamp'),
      acknowledged: generateBooleanSchema('Alert acknowledged', false),
      acknowledgedBy: generateStringSchema('Acknowledged by user'),
      acknowledgedAt: generateFormatValidationSchema('date-time', 'Acknowledgment timestamp'),
      resolved: generateBooleanSchema('Alert resolved', false),
      resolvedAt: generateFormatValidationSchema('date-time', 'Resolution timestamp'),
    },
    ['alertId', 'integrationId', 'severity', 'alertType', 'message', 'triggeredAt']
  );
}

/**
 * Creates rate limiting schema.
 * Schema for integration rate limiting configuration.
 *
 * @returns Rate limit schema
 */
export function createRateLimitingSchema() {
  return generateObjectSchema(
    'Rate limiting configuration',
    {
      integrationId: generateStringSchema('Integration ID', { format: 'uuid' }),
      limits: generateObjectSchema('Rate limits', {
        requestsPerSecond: generateNumericSchema('Requests per second', {
          type: 'integer',
          minimum: 1,
          maximum: 10000,
        }),
        requestsPerMinute: generateNumericSchema('Requests per minute', {
          type: 'integer',
          minimum: 1,
          maximum: 600000,
        }),
        requestsPerDay: generateNumericSchema('Requests per day', {
          type: 'integer',
          minimum: 1,
        }),
        burstSize: generateNumericSchema('Burst size', {
          type: 'integer',
          minimum: 1,
        }),
      }, []),
      currentUsage: generateObjectSchema('Current usage', {
        requestsThisSecond: generateNumericSchema('Requests this second', { type: 'integer', minimum: 0 }),
        requestsThisMinute: generateNumericSchema('Requests this minute', { type: 'integer', minimum: 0 }),
        requestsToday: generateNumericSchema('Requests today', { type: 'integer', minimum: 0 }),
      }, []),
      throttled: generateBooleanSchema('Currently throttled', false),
      resetAt: generateFormatValidationSchema('date-time', 'Rate limit reset time'),
    },
    ['integrationId', 'limits', 'currentUsage']
  );
}

/**
 * Creates API versioning schema.
 * Schema for API version management.
 *
 * @returns API versioning schema
 */
export function createAPIVersioningSchema() {
  return generateObjectSchema(
    'API version information',
    {
      currentVersion: generateStringSchema('Current API version', { example: 'v2' }),
      supportedVersions: generateArraySchema(
        'Supported versions',
        generateStringSchema('Version', { example: 'v1' }),
        { minItems: 1 }
      ),
      deprecatedVersions: generateArraySchema(
        'Deprecated versions',
        generateObjectSchema('Deprecated version', {
          version: generateStringSchema('Version', { example: 'v1' }),
          deprecatedAt: generateFormatValidationSchema('date', 'Deprecation date'),
          sunsetDate: generateFormatValidationSchema('date', 'Sunset date'),
          migrationGuide: generateStringSchema('Migration guide URL'),
        }, ['version', 'deprecatedAt', 'sunsetDate']),
        {}
      ),
      changelog: generateArraySchema(
        'Version changelog',
        generateObjectSchema('Change', {
          version: generateStringSchema('Version'),
          changes: generateArraySchema('Changes', generateStringSchema('Change description'), {}),
          releasedAt: generateFormatValidationSchema('date', 'Release date'),
        }, ['version', 'changes', 'releasedAt']),
        {}
      ),
    },
    ['currentVersion', 'supportedVersions']
  );
}

// ============================================================================
// OAuth2 CLIENT MANAGEMENT (7 functions)
// ============================================================================

/**
 * Creates OAuth2 client registration schema.
 * Schema for registering OAuth2 clients.
 *
 * @returns OAuth2 client schema
 */
export function createOAuth2ClientSchema() {
  return generateObjectSchema(
    'OAuth2 client registration',
    {
      clientId: generateStringSchema('Client ID', { format: 'uuid' }),
      clientName: generateStringSchema('Client application name'),
      clientSecret: generateStringSchema('Client secret (hashed)'),
      redirectUris: generateArraySchema(
        'Allowed redirect URIs',
        generateFormatValidationSchema('uri', 'Redirect URI'),
        { minItems: 1 }
      ),
      scopes: generateArraySchema(
        'Granted scopes',
        generateStringSchema('Scope'),
        { minItems: 1 }
      ),
      grantTypes: generateArraySchema(
        'Allowed grant types',
        generateEnumSchema(
          ['authorization_code', 'client_credentials', 'refresh_token'],
          'Grant type',
          'string'
        ),
        { minItems: 1 }
      ),
      tokenEndpointAuthMethod: generateEnumSchema(
        ['client_secret_basic', 'client_secret_post', 'client_secret_jwt'],
        'Token auth method',
        'string'
      ),
      createdAt: generateFormatValidationSchema('date-time', 'Registration date'),
      active: generateBooleanSchema('Client active', true),
    },
    ['clientId', 'clientName', 'redirectUris', 'scopes', 'grantTypes', 'tokenEndpointAuthMethod']
  );
}

/**
 * Creates OAuth2 client registration endpoint decorator.
 * POST endpoint for OAuth2 client registration.
 *
 * @returns Decorator for client registration
 */
export function createOAuth2ClientRegistrationEndpoint() {
  return applyDecorators(
    ApiTags('OAuth2 Management'),
    ApiOperation({
      summary: 'Register OAuth2 client',
      description: 'Register new OAuth2 client application',
    }),
    createApiKeyHeader('X-Admin-Key', 'Admin API key'),
    ApiBody({
      description: 'Client registration',
      schema: createOAuth2ClientSchema(),
    }),
    createCreatedResponse(Object as any, 'Client registered'),
    createBadRequestError('Invalid client configuration'),
  );
}
