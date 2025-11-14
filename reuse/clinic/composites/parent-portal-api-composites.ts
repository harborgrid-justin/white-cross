/**
 * LOC: CLINIC-COMP-PARENT-PORTAL-API-001
 * File: /reuse/clinic/composites/parent-portal-api-composites.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - class-validator (v0.14.x)
 *   - ../../data/composites/swagger-schema-generators
 *   - ../../data/composites/swagger-response-builders
 *   - ../../data/composites/swagger-security-schemes
 *   - ../../data/composites/swagger-parameter-decorators
 *   - ../../education/parent-engagement-kit
 *   - ../../education/student-records-kit
 *   - ../../server/health/health-patient-management-kit
 *   - ../../data/notification-service
 *
 * DOWNSTREAM (imported by):
 *   - Parent portal controllers
 *   - Guardian mobile app
 *   - Parent notification services
 *   - Consent management modules
 *   - Health record access APIs
 */

/**
 * File: /reuse/clinic/composites/parent-portal-api-composites.ts
 * Locator: WC-CLINIC-PARENT-PORTAL-API-001
 * Purpose: Parent Portal API Composites - Parent-facing health portal APIs
 *
 * Upstream: @nestjs/swagger, swagger composites, education/health kits
 * Downstream: Parent portal controllers, guardian apps, consent services
 * Dependencies: NestJS 10.x, Swagger 7.x, TypeScript 5.x, class-validator 0.14.x
 * Exports: 43 composed functions for comprehensive parent portal API documentation
 *
 * LLM Context: Production-grade parent portal API composite for White Cross parent engagement.
 * Composes Swagger/OpenAPI utilities with parent engagement functions providing complete API
 * documentation for parent-facing endpoints including guardian authentication with email/SMS MFA,
 * student health record access with FERPA compliance, immunization record viewing and updates,
 * health form submission and eSignatures, consent management for screenings and treatments,
 * real-time notification preferences, parent-nurse secure messaging, appointment scheduling and
 * requests, medication administration viewing, allergy and condition updates, emergency contact
 * management, health screening results access, absence reporting with health reasons, parent
 * dashboard with student health summary, document upload and sharing, and multilingual support.
 * Essential for parent engagement and FERPA-compliant health information access.
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
} from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDate,
  IsEnum,
  IsNumber,
  IsArray,
  IsBoolean,
  IsEmail,
  IsUUID,
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
  createBadRequestError,
  createUnauthorizedError,
  createForbiddenError,
  createNotFoundError,
  createOffsetPaginatedResponse,
} from '../../data/composites/swagger-response-builders';

import {
  createJwtAuthentication,
  createSessionCookieAuth,
  createTotpAuthentication,
} from '../../data/composites/swagger-security-schemes';

import {
  createPaginationQueryParams,
  createSortingQueryParams,
  createDateRangeQueryParams,
  createUuidPathParam,
  createFilterQueryParams,
} from '../../data/composites/swagger-parameter-decorators';

// ============================================================================
// PARENT AUTHENTICATION (6 functions)
// ============================================================================

/**
 * Creates parent authentication decorator with FERPA compliance.
 * Validates parent/guardian credentials for accessing student health records.
 *
 * @param requireMFA - Whether multi-factor authentication is required
 * @returns Decorator for parent authentication with JWT
 */
export function createParentAuthDecorator(requireMFA = false) {
  const decorators = [
    ApiTags('Parent Authentication'),
    createJwtAuthentication({
      scopes: ['parent:access'],
      requiredClaims: ['guardian_id', 'student_ids'],
    }),
    ApiOperation({ summary: 'Parent authentication required' }),
  ];

  if (requireMFA) {
    decorators.push(createTotpAuthentication('X-MFA-Code', 30));
  }

  return applyDecorators(...decorators);
}

/**
 * Creates parent registration schema.
 * Schema for parent/guardian account registration.
 *
 * @returns Parent registration schema
 */
export function createParentRegistrationSchema() {
  return generateObjectSchema(
    'Parent account registration',
    {
      email: generateFormatValidationSchema('email', 'Parent email address', {
        example: 'parent@example.com',
      }),
      firstName: generateStringSchema('Parent first name', {
        minLength: 2,
        maxLength: 50,
      }),
      lastName: generateStringSchema('Parent last name', {
        minLength: 2,
        maxLength: 50,
      }),
      phone: generateStringSchema('Phone number', {
        pattern: '^\\+?[1-9]\\d{1,14}$',
        example: '+15555551234',
      }),
      relationship: generateEnumSchema(
        ['mother', 'father', 'guardian', 'step-parent', 'grandparent', 'other'],
        'Relationship to student',
        'string'
      ),
      preferredLanguage: generateEnumSchema(['en', 'es', 'fr', 'zh', 'ar'], 'Preferred language', 'string'),
      studentVerificationCode: generateStringSchema('Student verification code', {
        minLength: 6,
        maxLength: 20,
      }),
      password: generateStringSchema('Password', {
        format: 'password',
        minLength: 8,
      }),
      agreeToTerms: generateBooleanSchema('Agree to terms and conditions', true, true),
    },
    ['email', 'firstName', 'lastName', 'phone', 'relationship', 'studentVerificationCode', 'password', 'agreeToTerms']
  );
}

/**
 * Creates parent registration endpoint decorator.
 * POST endpoint for parent account creation.
 *
 * @returns Decorator for registration endpoint
 */
export function createParentRegistrationEndpoint() {
  return applyDecorators(
    ApiTags('Parent Authentication'),
    ApiOperation({
      summary: 'Register parent account',
      description: 'Create parent portal account with student verification',
    }),
    ApiBody({
      description: 'Registration data',
      schema: createParentRegistrationSchema(),
    }),
    createCreatedResponse(Object as any, 'Account created successfully', true),
    createBadRequestError('Invalid registration data or verification code'),
  );
}

/**
 * Creates parent login schema.
 * Schema for parent authentication with optional MFA.
 *
 * @returns Login schema
 */
export function createParentLoginSchema() {
  return generateObjectSchema(
    'Parent login credentials',
    {
      email: generateFormatValidationSchema('email', 'Email address'),
      password: generateStringSchema('Password', { format: 'password' }),
      mfaCode: generateStringSchema('MFA code (if enabled)', {
        pattern: '^[0-9]{6}$',
        example: '123456',
      }),
      rememberDevice: generateBooleanSchema('Remember this device', false),
    },
    ['email', 'password']
  );
}

/**
 * Creates parent session schema.
 * Session information for authenticated parents.
 *
 * @returns Parent session schema
 */
export function createParentSessionSchema() {
  return generateObjectSchema(
    'Parent session information',
    {
      sessionId: generateStringSchema('Session ID', { format: 'uuid' }),
      guardianId: generateStringSchema('Guardian ID', { format: 'uuid' }),
      email: generateFormatValidationSchema('email', 'Email'),
      name: generateStringSchema('Full name'),
      students: generateArraySchema(
        'Associated students',
        generateObjectSchema('Student access', {
          studentId: generateStringSchema('Student ID', { format: 'uuid' }),
          studentName: generateStringSchema('Student name'),
          relationship: generateStringSchema('Relationship'),
          accessLevel: generateEnumSchema(['full', 'limited'], 'Access level', 'string'),
        }, ['studentId', 'studentName', 'relationship']),
        { minItems: 1 }
      ),
      sessionExpiry: generateFormatValidationSchema('date-time', 'Session expiration'),
      mfaEnabled: generateBooleanSchema('MFA enabled'),
    },
    ['sessionId', 'guardianId', 'email', 'name', 'students']
  );
}

/**
 * Creates parent MFA setup schema.
 * Schema for enabling multi-factor authentication.
 *
 * @returns MFA setup schema
 */
export function createParentMFASetupSchema() {
  return generateObjectSchema(
    'MFA setup configuration',
    {
      method: generateEnumSchema(['totp', 'sms', 'email'], 'MFA method', 'string'),
      phoneNumber: generateStringSchema('Phone number (for SMS)', {
        pattern: '^\\+?[1-9]\\d{1,14}$',
      }),
      totpSecret: generateStringSchema('TOTP secret (generated)'),
      qrCodeUrl: generateStringSchema('QR code URL (for TOTP)'),
      backupCodes: generateArraySchema(
        'Backup recovery codes',
        generateStringSchema('Backup code'),
        { minItems: 10, maxItems: 10 }
      ),
    },
    ['method']
  );
}

// ============================================================================
// HEALTH RECORD ACCESS (8 functions)
// ============================================================================

/**
 * Creates student health summary schema.
 * Comprehensive student health summary for parents.
 *
 * @returns Health summary schema
 */
export function createStudentHealthSummarySchema() {
  return generateObjectSchema(
    'Student health summary',
    {
      studentId: generateStringSchema('Student ID', { format: 'uuid' }),
      studentName: generateStringSchema('Student name'),
      grade: generateEnumSchema(['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], 'Grade level', 'string'),
      immunizationStatus: generateEnumSchema(['compliant', 'non-compliant', 'exempt'], 'Immunization status', 'string'),
      allergies: generateArraySchema(
        'Known allergies',
        generateObjectSchema('Allergy', {
          allergen: generateStringSchema('Allergen'),
          severity: generateEnumSchema(['mild', 'moderate', 'severe'], 'Severity', 'string'),
          reaction: generateStringSchema('Reaction description'),
        }, ['allergen', 'severity']),
        {}
      ),
      medications: generateArraySchema(
        'Current medications',
        generateObjectSchema('Medication', {
          name: generateStringSchema('Medication name'),
          dosage: generateStringSchema('Dosage'),
          frequency: generateStringSchema('Frequency'),
          administeredAt: generateEnumSchema(['home', 'school'], 'Administration location', 'string'),
        }, ['name', 'dosage', 'frequency']),
        {}
      ),
      conditions: generateArraySchema(
        'Medical conditions',
        generateStringSchema('Condition'),
        {}
      ),
      lastPhysicalDate: generateFormatValidationSchema('date', 'Last physical exam'),
      nextPhysicalDue: generateFormatValidationSchema('date', 'Next physical due'),
      clinicVisitsThisYear: generateNumericSchema('Clinic visits this year', {
        type: 'integer',
        minimum: 0,
      }),
    },
    ['studentId', 'studentName', 'immunizationStatus']
  );
}

/**
 * Creates health record access endpoint decorator.
 * GET endpoint for accessing student health records (FERPA compliant).
 *
 * @returns Decorator for health record access
 */
export function createHealthRecordAccessEndpoint() {
  return applyDecorators(
    ApiTags('Health Records'),
    ApiOperation({
      summary: 'Get student health summary',
      description: 'Access student health information (FERPA compliant)',
    }),
    createParentAuthDecorator(),
    createUuidPathParam('studentId', 'Student identifier'),
    createSuccessResponse(Object as any, 'Student health summary'),
    createForbiddenError('Not authorized to access this student'),
    createNotFoundError('Student not found'),
  );
}

/**
 * Creates immunization record schema.
 * Detailed immunization history for students.
 *
 * @returns Immunization record schema
 */
export function createImmunizationRecordSchema() {
  return generateObjectSchema(
    'Immunization record',
    {
      recordId: generateStringSchema('Record ID', { format: 'uuid' }),
      studentId: generateStringSchema('Student ID', { format: 'uuid' }),
      vaccines: generateArraySchema(
        'Vaccine history',
        generateObjectSchema('Vaccine', {
          vaccineId: generateStringSchema('Vaccine ID', { format: 'uuid' }),
          vaccineName: generateStringSchema('Vaccine name', {
            example: 'MMR (Measles, Mumps, Rubella)',
          }),
          doseNumber: generateNumericSchema('Dose number', {
            type: 'integer',
            minimum: 1,
          }),
          dateAdministered: generateFormatValidationSchema('date', 'Administration date'),
          provider: generateStringSchema('Healthcare provider'),
          lotNumber: generateStringSchema('Lot number'),
          expirationDate: generateFormatValidationSchema('date', 'Vaccine expiration'),
        }, ['vaccineName', 'doseNumber', 'dateAdministered']),
        {}
      ),
      missingVaccines: generateArraySchema(
        'Required vaccines not on file',
        generateObjectSchema('Missing vaccine', {
          vaccineName: generateStringSchema('Vaccine name'),
          requiredDoses: generateNumericSchema('Required doses', { type: 'integer' }),
          dueDate: generateFormatValidationSchema('date', 'Due date'),
        }, ['vaccineName', 'requiredDoses']),
        {}
      ),
      exemptions: generateArraySchema(
        'Vaccine exemptions',
        generateObjectSchema('Exemption', {
          exemptionType: generateEnumSchema(['medical', 'religious', 'philosophical'], 'Exemption type', 'string'),
          vaccine: generateStringSchema('Vaccine exempted'),
          effectiveDate: generateFormatValidationSchema('date', 'Effective date'),
          expirationDate: generateFormatValidationSchema('date', 'Expiration date'),
        }, ['exemptionType', 'vaccine', 'effectiveDate']),
        {}
      ),
      complianceStatus: generateEnumSchema(['compliant', 'non-compliant', 'exempt'], 'Compliance status', 'string'),
    },
    ['recordId', 'studentId', 'vaccines', 'complianceStatus']
  );
}

/**
 * Creates clinic visit history schema.
 * Schema for student clinic visit records.
 *
 * @returns Clinic visit schema
 */
export function createClinicVisitHistorySchema() {
  return generateObjectSchema(
    'Clinic visit history',
    {
      visitId: generateStringSchema('Visit ID', { format: 'uuid' }),
      studentId: generateStringSchema('Student ID', { format: 'uuid' }),
      visitDate: generateFormatValidationSchema('date-time', 'Visit date'),
      chiefComplaint: generateStringSchema('Chief complaint', {
        example: 'Headache and nausea',
      }),
      assessment: generateStringSchema('Nurse assessment'),
      interventions: generateArraySchema(
        'Interventions provided',
        generateStringSchema('Intervention'),
        {}
      ),
      disposition: generateEnumSchema(
        ['returned-to-class', 'sent-home', 'emergency-transport', 'parent-pickup'],
        'Visit disposition',
        'string'
      ),
      parentNotified: generateBooleanSchema('Parent notified'),
      followUpRequired: generateBooleanSchema('Follow-up required'),
      followUpNotes: generateStringSchema('Follow-up notes'),
    },
    ['visitId', 'studentId', 'visitDate', 'chiefComplaint', 'disposition']
  );
}

/**
 * Creates medication administration history schema.
 * Schema for viewing medication administration records.
 *
 * @returns Medication history schema
 */
export function createMedicationHistorySchema() {
  return generateObjectSchema(
    'Medication administration history',
    {
      studentId: generateStringSchema('Student ID', { format: 'uuid' }),
      administrations: generateArraySchema(
        'Medication administrations',
        generateObjectSchema('Administration', {
          administrationId: generateStringSchema('Administration ID', { format: 'uuid' }),
          medicationName: generateStringSchema('Medication name'),
          dosage: generateStringSchema('Dosage'),
          route: generateEnumSchema(['oral', 'inhaled', 'topical'], 'Route', 'string'),
          administeredAt: generateFormatValidationSchema('date-time', 'Administration time'),
          administeredBy: generateStringSchema('Nurse name'),
          reason: generateStringSchema('Reason for administration'),
          effectiveness: generateStringSchema('Effectiveness notes'),
        }, ['administrationId', 'medicationName', 'dosage', 'administeredAt', 'administeredBy']),
        {}
      ),
      totalAdministrations: generateNumericSchema('Total administrations', {
        type: 'integer',
        minimum: 0,
      }),
    },
    ['studentId', 'administrations', 'totalAdministrations']
  );
}

/**
 * Creates health screening results schema.
 * Schema for viewing screening results (vision, hearing, scoliosis, BMI).
 *
 * @returns Screening results schema
 */
export function createHealthScreeningResultsSchema() {
  return generateObjectSchema(
    'Health screening results',
    {
      studentId: generateStringSchema('Student ID', { format: 'uuid' }),
      screenings: generateArraySchema(
        'Completed screenings',
        generateObjectSchema('Screening', {
          screeningId: generateStringSchema('Screening ID', { format: 'uuid' }),
          screeningType: generateEnumSchema(['vision', 'hearing', 'scoliosis', 'bmi', 'dental'], 'Screening type', 'string'),
          screeningDate: generateFormatValidationSchema('date', 'Screening date'),
          result: generateEnumSchema(['pass', 'refer', 'incomplete'], 'Result', 'string'),
          findings: generateStringSchema('Findings'),
          recommendations: generateStringSchema('Recommendations'),
          followUpRequired: generateBooleanSchema('Follow-up required'),
          parentNotified: generateBooleanSchema('Parent notified'),
        }, ['screeningId', 'screeningType', 'screeningDate', 'result']),
        {}
      ),
    },
    ['studentId', 'screenings']
  );
}

/**
 * Creates emergency contact information schema.
 * Schema for viewing and updating emergency contacts.
 *
 * @returns Emergency contact schema
 */
export function createEmergencyContactSchema() {
  return generateObjectSchema(
    'Emergency contact information',
    {
      studentId: generateStringSchema('Student ID', { format: 'uuid' }),
      contacts: generateArraySchema(
        'Emergency contacts',
        generateObjectSchema('Emergency contact', {
          contactId: generateStringSchema('Contact ID', { format: 'uuid' }),
          name: generateStringSchema('Contact name'),
          relationship: generateStringSchema('Relationship to student'),
          phone: generateStringSchema('Phone number', {
            pattern: '^\\+?[1-9]\\d{1,14}$',
          }),
          alternatePhone: generateStringSchema('Alternate phone'),
          email: generateFormatValidationSchema('email', 'Email address'),
          address: generateStringSchema('Address'),
          priority: generateNumericSchema('Contact priority', {
            type: 'integer',
            minimum: 1,
            maximum: 10,
          }),
          authorizedPickup: generateBooleanSchema('Authorized for pickup'),
          medicalDecisions: generateBooleanSchema('Authorized for medical decisions'),
        }, ['contactId', 'name', 'relationship', 'phone', 'priority']),
        { minItems: 1 }
      ),
    },
    ['studentId', 'contacts']
  );
}

/**
 * Creates allergy update endpoint decorator.
 * POST endpoint for parents to update allergy information.
 *
 * @returns Decorator for allergy update
 */
export function createAllergyUpdateEndpoint() {
  return applyDecorators(
    ApiTags('Health Records'),
    ApiOperation({
      summary: 'Update student allergies',
      description: 'Parent updates student allergy information',
    }),
    createParentAuthDecorator(),
    createUuidPathParam('studentId', 'Student identifier'),
    ApiBody({
      description: 'Allergy information',
      schema: generateObjectSchema('Allergy update', {
        allergen: generateStringSchema('Allergen', { example: 'Peanuts' }),
        severity: generateEnumSchema(['mild', 'moderate', 'severe'], 'Severity', 'string'),
        reaction: generateStringSchema('Typical reaction'),
        treatmentPlan: generateStringSchema('Treatment/action plan'),
        epiPenRequired: generateBooleanSchema('EpiPen required'),
      }, ['allergen', 'severity', 'reaction']),
    }),
    createCreatedResponse(Object as any, 'Allergy information updated'),
    createBadRequestError('Invalid allergy data'),
  );
}

// ============================================================================
// CONSENT MANAGEMENT (6 functions)
// ============================================================================

/**
 * Creates consent request schema.
 * Schema for health-related consent requests to parents.
 *
 * @returns Consent request schema
 */
export function createConsentRequestSchema() {
  return generateObjectSchema(
    'Consent request',
    {
      consentId: generateStringSchema('Consent ID', { format: 'uuid' }),
      studentId: generateStringSchema('Student ID', { format: 'uuid' }),
      consentType: generateEnumSchema(
        ['health-screening', 'medication-administration', 'treatment', 'information-sharing', 'field-trip'],
        'Consent type',
        'string'
      ),
      title: generateStringSchema('Consent title', {
        example: 'Vision Screening Consent',
      }),
      description: generateStringSchema('Detailed description'),
      requestDate: generateFormatValidationSchema('date-time', 'Request date'),
      dueDate: generateFormatValidationSchema('date-time', 'Response due date'),
      status: generateEnumSchema(['pending', 'granted', 'denied', 'expired'], 'Consent status', 'string'),
      documentUrl: generateStringSchema('Consent form document URL'),
      requiresSignature: generateBooleanSchema('Requires electronic signature'),
    },
    ['consentId', 'studentId', 'consentType', 'title', 'description', 'requestDate', 'status']
  );
}

/**
 * Creates consent response schema.
 * Schema for parent consent submission with eSignature.
 *
 * @returns Consent response schema
 */
export function createConsentResponseSchema() {
  return generateObjectSchema(
    'Consent response',
    {
      consentId: generateStringSchema('Consent ID', { format: 'uuid' }),
      response: generateEnumSchema(['grant', 'deny'], 'Consent decision', 'string'),
      guardianName: generateStringSchema('Guardian name'),
      signatureData: generateStringSchema('Electronic signature (base64)'),
      signatureDate: generateFormatValidationSchema('date-time', 'Signature date'),
      ipAddress: generateStringSchema('IP address'),
      comments: generateStringSchema('Additional comments'),
    },
    ['consentId', 'response', 'guardianName', 'signatureData', 'signatureDate']
  );
}

/**
 * Creates consent submission endpoint decorator.
 * POST endpoint for submitting consent responses.
 *
 * @returns Decorator for consent submission
 */
export function createConsentSubmissionEndpoint() {
  return applyDecorators(
    ApiTags('Consent Management'),
    ApiOperation({
      summary: 'Submit consent response',
      description: 'Parent submits consent decision with electronic signature',
    }),
    createParentAuthDecorator(),
    createUuidPathParam('consentId', 'Consent request identifier'),
    ApiBody({
      description: 'Consent response',
      schema: createConsentResponseSchema(),
    }),
    createCreatedResponse(Object as any, 'Consent response submitted'),
    createBadRequestError('Invalid consent response'),
  );
}

/**
 * Creates consent history schema.
 * Schema for viewing consent history for a student.
 *
 * @returns Consent history schema
 */
export function createConsentHistorySchema() {
  return generateObjectSchema(
    'Consent history',
    {
      studentId: generateStringSchema('Student ID', { format: 'uuid' }),
      consents: generateArraySchema(
        'Consent records',
        createConsentRequestSchema(),
        {}
      ),
      pendingCount: generateNumericSchema('Pending consents', {
        type: 'integer',
        minimum: 0,
      }),
      totalCount: generateNumericSchema('Total consents', {
        type: 'integer',
        minimum: 0,
      }),
    },
    ['studentId', 'consents', 'pendingCount', 'totalCount']
  );
}

/**
 * Creates consent retrieval endpoint decorator.
 * GET endpoint for retrieving pending consents.
 *
 * @returns Decorator for consent retrieval
 */
export function createConsentRetrievalEndpoint() {
  return applyDecorators(
    ApiTags('Consent Management'),
    ApiOperation({
      summary: 'Get consent requests',
      description: 'Retrieve pending and historical consent requests',
    }),
    createParentAuthDecorator(),
    createUuidPathParam('studentId', 'Student identifier'),
    ApiQuery({
      name: 'status',
      required: false,
      enum: ['pending', 'granted', 'denied', 'expired'],
      description: 'Filter by consent status',
    }),
    createOffsetPaginatedResponse(Object as any, 'Consent requests'),
  );
}

/**
 * Creates bulk consent schema.
 * Schema for bulk consent operations (e.g., annual screenings).
 *
 * @returns Bulk consent schema
 */
export function createBulkConsentSchema() {
  return generateObjectSchema(
    'Bulk consent submission',
    {
      consentIds: generateArraySchema(
        'Consent IDs',
        generateStringSchema('Consent ID', { format: 'uuid' }),
        { minItems: 1, maxItems: 20 }
      ),
      response: generateEnumSchema(['grant-all', 'deny-all'], 'Bulk decision', 'string'),
      guardianName: generateStringSchema('Guardian name'),
      signatureData: generateStringSchema('Electronic signature'),
      signatureDate: generateFormatValidationSchema('date-time', 'Signature date'),
    },
    ['consentIds', 'response', 'guardianName', 'signatureData', 'signatureDate']
  );
}

// ============================================================================
// NOTIFICATION APIS (7 functions)
// ============================================================================

/**
 * Creates notification preference schema.
 * Schema for managing parent notification preferences.
 *
 * @returns Notification preference schema
 */
export function createNotificationPreferenceSchema() {
  return generateObjectSchema(
    'Notification preferences',
    {
      guardianId: generateStringSchema('Guardian ID', { format: 'uuid' }),
      preferences: generateObjectSchema('Notification preferences', {
        email: generateObjectSchema('Email preferences', {
          enabled: generateBooleanSchema('Email notifications enabled'),
          address: generateFormatValidationSchema('email', 'Email address'),
          frequency: generateEnumSchema(['immediate', 'daily-digest', 'weekly-digest'], 'Email frequency', 'string'),
        }, ['enabled']),
        sms: generateObjectSchema('SMS preferences', {
          enabled: generateBooleanSchema('SMS notifications enabled'),
          phone: generateStringSchema('Phone number'),
        }, ['enabled']),
        push: generateObjectSchema('Push notification preferences', {
          enabled: generateBooleanSchema('Push notifications enabled'),
          deviceTokens: generateArraySchema('Device tokens', generateStringSchema('Token'), {}),
        }, ['enabled']),
      }, []),
      notificationTypes: generateArraySchema(
        'Enabled notification types',
        generateEnumSchema(
          ['clinic-visit', 'medication-administered', 'screening-result', 'consent-required', 'immunization-due'],
          'Notification type',
          'string'
        ),
        {}
      ),
    },
    ['guardianId', 'preferences', 'notificationTypes']
  );
}

/**
 * Creates notification schema.
 * Schema for parent notifications.
 *
 * @returns Notification schema
 */
export function createParentNotificationSchema() {
  return generateObjectSchema(
    'Parent notification',
    {
      notificationId: generateStringSchema('Notification ID', { format: 'uuid' }),
      guardianId: generateStringSchema('Guardian ID', { format: 'uuid' }),
      studentId: generateStringSchema('Student ID', { format: 'uuid' }),
      studentName: generateStringSchema('Student name'),
      type: generateEnumSchema(
        ['clinic-visit', 'medication-administered', 'screening-result', 'consent-required', 'immunization-due', 'health-alert'],
        'Notification type',
        'string'
      ),
      priority: generateEnumSchema(['low', 'medium', 'high', 'urgent'], 'Priority', 'string'),
      title: generateStringSchema('Notification title'),
      message: generateStringSchema('Notification message'),
      sentAt: generateFormatValidationSchema('date-time', 'Sent timestamp'),
      read: generateBooleanSchema('Read status', false),
      readAt: generateFormatValidationSchema('date-time', 'Read timestamp'),
      actionRequired: generateBooleanSchema('Action required'),
      actionUrl: generateStringSchema('Action URL'),
    },
    ['notificationId', 'guardianId', 'studentId', 'type', 'priority', 'title', 'message', 'sentAt']
  );
}

/**
 * Creates notification retrieval endpoint decorator.
 * GET endpoint for retrieving parent notifications.
 *
 * @returns Decorator for notification retrieval
 */
export function createNotificationRetrievalEndpoint() {
  return applyDecorators(
    ApiTags('Notifications'),
    ApiOperation({
      summary: 'Get notifications',
      description: 'Retrieve parent notifications with filtering',
    }),
    createParentAuthDecorator(),
    ApiQuery({
      name: 'read',
      required: false,
      type: Boolean,
      description: 'Filter by read status',
    }),
    ApiQuery({
      name: 'type',
      required: false,
      enum: ['clinic-visit', 'medication-administered', 'screening-result', 'consent-required'],
      description: 'Filter by notification type',
    }),
    createPaginationQueryParams(1, 20, 100),
    createOffsetPaginatedResponse(Object as any, 'Notifications'),
  );
}

/**
 * Creates notification mark read endpoint decorator.
 * PATCH endpoint for marking notifications as read.
 *
 * @returns Decorator for mark read endpoint
 */
export function createNotificationMarkReadEndpoint() {
  return applyDecorators(
    ApiTags('Notifications'),
    ApiOperation({
      summary: 'Mark notification as read',
      description: 'Mark one or multiple notifications as read',
    }),
    createParentAuthDecorator(),
    ApiBody({
      description: 'Notification IDs to mark as read',
      schema: generateObjectSchema('Mark read request', {
        notificationIds: generateArraySchema(
          'Notification IDs',
          generateStringSchema('Notification ID', { format: 'uuid' }),
          { minItems: 1 }
        ),
      }, ['notificationIds']),
    }),
    createNoContentResponse('Notifications marked as read'),
  );
}

/**
 * Creates real-time notification subscription schema.
 * Schema for WebSocket notification subscriptions.
 *
 * @returns Subscription schema
 */
export function createNotificationSubscriptionSchema() {
  return generateObjectSchema(
    'Real-time notification subscription',
    {
      subscriptionId: generateStringSchema('Subscription ID', { format: 'uuid' }),
      guardianId: generateStringSchema('Guardian ID', { format: 'uuid' }),
      studentIds: generateArraySchema(
        'Student IDs to monitor',
        generateStringSchema('Student ID', { format: 'uuid' }),
        { minItems: 1 }
      ),
      notificationTypes: generateArraySchema(
        'Notification types to receive',
        generateStringSchema('Type'),
        { minItems: 0 }
      ),
      websocketUrl: generateStringSchema('WebSocket connection URL'),
    },
    ['subscriptionId', 'guardianId', 'studentIds', 'websocketUrl']
  );
}

/**
 * Creates notification template schema.
 * Schema for custom notification templates.
 *
 * @returns Template schema
 */
export function createNotificationTemplateSchema() {
  return generateObjectSchema(
    'Notification template',
    {
      templateId: generateStringSchema('Template ID', { format: 'uuid' }),
      templateType: generateEnumSchema(
        ['clinic-visit', 'medication', 'screening', 'consent'],
        'Template type',
        'string'
      ),
      subject: generateStringSchema('Notification subject'),
      bodyTemplate: generateStringSchema('Message body template'),
      variables: generateArraySchema(
        'Template variables',
        generateStringSchema('Variable name'),
        {}
      ),
      language: generateEnumSchema(['en', 'es', 'fr', 'zh', 'ar'], 'Template language', 'string'),
    },
    ['templateId', 'templateType', 'subject', 'bodyTemplate', 'language']
  );
}

/**
 * Creates notification digest schema.
 * Schema for daily/weekly notification digests.
 *
 * @returns Digest schema
 */
export function createNotificationDigestSchema() {
  return generateObjectSchema(
    'Notification digest',
    {
      digestId: generateStringSchema('Digest ID', { format: 'uuid' }),
      guardianId: generateStringSchema('Guardian ID', { format: 'uuid' }),
      digestPeriod: generateEnumSchema(['daily', 'weekly'], 'Digest period', 'string'),
      periodStart: generateFormatValidationSchema('date-time', 'Period start'),
      periodEnd: generateFormatValidationSchema('date-time', 'Period end'),
      notifications: generateArraySchema(
        'Notifications in digest',
        createParentNotificationSchema(),
        {}
      ),
      totalCount: generateNumericSchema('Total notifications', {
        type: 'integer',
        minimum: 0,
      }),
    },
    ['digestId', 'guardianId', 'digestPeriod', 'periodStart', 'periodEnd', 'notifications', 'totalCount']
  );
}

// ============================================================================
// COMMUNICATION PORTAL (6 functions)
// ============================================================================

/**
 * Creates secure message schema.
 * Schema for parent-nurse secure messaging.
 *
 * @returns Secure message schema
 */
export function createSecureMessageSchema() {
  return generateObjectSchema(
    'Secure message',
    {
      messageId: generateStringSchema('Message ID', { format: 'uuid' }),
      conversationId: generateStringSchema('Conversation ID', { format: 'uuid' }),
      senderId: generateStringSchema('Sender ID', { format: 'uuid' }),
      senderName: generateStringSchema('Sender name'),
      senderRole: generateEnumSchema(['parent', 'nurse', 'admin'], 'Sender role', 'string'),
      recipientId: generateStringSchema('Recipient ID', { format: 'uuid' }),
      recipientName: generateStringSchema('Recipient name'),
      subject: generateStringSchema('Message subject'),
      body: generateStringSchema('Message body'),
      sentAt: generateFormatValidationSchema('date-time', 'Sent timestamp'),
      read: generateBooleanSchema('Read status', false),
      readAt: generateFormatValidationSchema('date-time', 'Read timestamp'),
      attachments: generateArraySchema(
        'Message attachments',
        generateObjectSchema('Attachment', {
          fileId: generateStringSchema('File ID', { format: 'uuid' }),
          fileName: generateStringSchema('File name'),
          fileSize: generateNumericSchema('File size (bytes)', { type: 'integer' }),
          fileType: generateStringSchema('MIME type'),
          downloadUrl: generateStringSchema('Download URL'),
        }, ['fileId', 'fileName', 'fileSize', 'fileType']),
        {}
      ),
    },
    ['messageId', 'conversationId', 'senderId', 'senderName', 'senderRole', 'recipientId', 'subject', 'body', 'sentAt']
  );
}

/**
 * Creates message send endpoint decorator.
 * POST endpoint for sending secure messages.
 *
 * @returns Decorator for message send
 */
export function createMessageSendEndpoint() {
  return applyDecorators(
    ApiTags('Communication'),
    ApiOperation({
      summary: 'Send secure message',
      description: 'Send secure message to school nurse',
    }),
    createParentAuthDecorator(),
    ApiBody({
      description: 'Message data',
      schema: generateObjectSchema('Message request', {
        recipientId: generateStringSchema('Recipient nurse ID', { format: 'uuid' }),
        studentId: generateStringSchema('Student ID (for context)', { format: 'uuid' }),
        subject: generateStringSchema('Message subject'),
        body: generateStringSchema('Message body'),
        attachments: generateArraySchema(
          'Attachment IDs',
          generateStringSchema('Attachment ID', { format: 'uuid' }),
          { maxItems: 5 }
        ),
      }, ['recipientId', 'studentId', 'subject', 'body']),
    }),
    createCreatedResponse(Object as any, 'Message sent'),
    createBadRequestError('Invalid message data'),
  );
}

/**
 * Creates conversation history endpoint decorator.
 * GET endpoint for retrieving message conversations.
 *
 * @returns Decorator for conversation retrieval
 */
export function createConversationHistoryEndpoint() {
  return applyDecorators(
    ApiTags('Communication'),
    ApiOperation({
      summary: 'Get message conversations',
      description: 'Retrieve parent-nurse message conversations',
    }),
    createParentAuthDecorator(),
    createPaginationQueryParams(1, 20, 50),
    createFilterQueryParams({
      studentId: { type: 'string' },
      unreadOnly: { type: 'boolean' },
    }),
    createOffsetPaginatedResponse(Object as any, 'Conversations'),
  );
}

/**
 * Creates message thread schema.
 * Schema for a complete message thread.
 *
 * @returns Message thread schema
 */
export function createMessageThreadSchema() {
  return generateObjectSchema(
    'Message thread',
    {
      conversationId: generateStringSchema('Conversation ID', { format: 'uuid' }),
      subject: generateStringSchema('Thread subject'),
      participants: generateArraySchema(
        'Thread participants',
        generateObjectSchema('Participant', {
          userId: generateStringSchema('User ID', { format: 'uuid' }),
          name: generateStringSchema('Name'),
          role: generateEnumSchema(['parent', 'nurse'], 'Role', 'string'),
        }, ['userId', 'name', 'role']),
        { minItems: 2 }
      ),
      messages: generateArraySchema(
        'Thread messages',
        createSecureMessageSchema(),
        { minItems: 1 }
      ),
      unreadCount: generateNumericSchema('Unread messages', {
        type: 'integer',
        minimum: 0,
      }),
      lastMessageAt: generateFormatValidationSchema('date-time', 'Last message timestamp'),
    },
    ['conversationId', 'subject', 'participants', 'messages', 'lastMessageAt']
  );
}

/**
 * Creates file attachment upload schema.
 * Schema for uploading message attachments.
 *
 * @returns Attachment upload schema
 */
export function createAttachmentUploadSchema() {
  return generateObjectSchema(
    'File attachment upload',
    {
      file: generateStringSchema('File data (multipart/form-data)'),
      fileName: generateStringSchema('Original file name'),
      fileType: generateStringSchema('MIME type', { example: 'application/pdf' }),
      fileSize: generateNumericSchema('File size (bytes)', {
        type: 'integer',
        minimum: 1,
        maximum: 10485760, // 10MB
      }),
    },
    ['file', 'fileName', 'fileType', 'fileSize']
  );
}

/**
 * Creates message templates schema.
 * Schema for pre-defined message templates.
 *
 * @returns Message template schema
 */
export function createMessageTemplateSchema() {
  return generateObjectSchema(
    'Message template',
    {
      templateId: generateStringSchema('Template ID', { format: 'uuid' }),
      templateName: generateStringSchema('Template name'),
      subject: generateStringSchema('Default subject'),
      bodyTemplate: generateStringSchema('Message body template'),
      category: generateEnumSchema(
        ['appointment-request', 'medication-question', 'absence-notification', 'general-inquiry'],
        'Template category',
        'string'
      ),
    },
    ['templateId', 'templateName', 'subject', 'bodyTemplate', 'category']
  );
}

// ============================================================================
// APPOINTMENT SCHEDULING (5 functions)
// ============================================================================

/**
 * Creates appointment request schema.
 * Schema for parent appointment requests.
 *
 * @returns Appointment request schema
 */
export function createAppointmentRequestSchema() {
  return generateObjectSchema(
    'Appointment request',
    {
      requestId: generateStringSchema('Request ID', { format: 'uuid' }),
      studentId: generateStringSchema('Student ID', { format: 'uuid' }),
      guardianId: generateStringSchema('Guardian ID', { format: 'uuid' }),
      appointmentType: generateEnumSchema(
        ['immunization', 'screening', 'medication-review', 'health-consultation'],
        'Appointment type',
        'string'
      ),
      preferredDates: generateArraySchema(
        'Preferred dates',
        generateFormatValidationSchema('date', 'Preferred date'),
        { minItems: 1, maxItems: 3 }
      ),
      preferredTimes: generateArraySchema(
        'Preferred time slots',
        generateEnumSchema(['morning', 'afternoon', 'anytime'], 'Time preference', 'string'),
        {}
      ),
      reason: generateStringSchema('Reason for appointment'),
      urgency: generateEnumSchema(['routine', 'soon', 'urgent'], 'Urgency level', 'string'),
      status: generateEnumSchema(
        ['pending', 'scheduled', 'confirmed', 'cancelled', 'completed'],
        'Request status',
        'string'
      ),
      scheduledDate: generateFormatValidationSchema('date-time', 'Scheduled appointment time'),
    },
    ['requestId', 'studentId', 'guardianId', 'appointmentType', 'preferredDates', 'reason', 'urgency', 'status']
  );
}

/**
 * Creates appointment submission endpoint decorator.
 * POST endpoint for submitting appointment requests.
 *
 * @returns Decorator for appointment submission
 */
export function createAppointmentSubmissionEndpoint() {
  return applyDecorators(
    ApiTags('Appointments'),
    ApiOperation({
      summary: 'Request appointment',
      description: 'Submit appointment request for student health services',
    }),
    createParentAuthDecorator(),
    ApiBody({
      description: 'Appointment request',
      schema: createAppointmentRequestSchema(),
    }),
    createCreatedResponse(Object as any, 'Appointment request submitted'),
    createBadRequestError('Invalid appointment data'),
  );
}

/**
 * Creates appointment availability schema.
 * Schema for viewing available appointment slots.
 *
 * @returns Availability schema
 */
export function createAppointmentAvailabilitySchema() {
  return generateObjectSchema(
    'Appointment availability',
    {
      date: generateFormatValidationSchema('date', 'Availability date'),
      slots: generateArraySchema(
        'Available time slots',
        generateObjectSchema('Time slot', {
          slotId: generateStringSchema('Slot ID', { format: 'uuid' }),
          startTime: generateStringSchema('Start time', { example: '09:00' }),
          endTime: generateStringSchema('End time', { example: '09:30' }),
          available: generateBooleanSchema('Slot available', true),
          nurseAssigned: generateStringSchema('Assigned nurse'),
        }, ['slotId', 'startTime', 'endTime', 'available']),
        {}
      ),
    },
    ['date', 'slots']
  );
}

/**
 * Creates appointment cancellation endpoint decorator.
 * DELETE endpoint for cancelling appointments.
 *
 * @returns Decorator for cancellation
 */
export function createAppointmentCancellationEndpoint() {
  return applyDecorators(
    ApiTags('Appointments'),
    ApiOperation({
      summary: 'Cancel appointment',
      description: 'Cancel scheduled appointment',
    }),
    createParentAuthDecorator(),
    createUuidPathParam('appointmentId', 'Appointment identifier'),
    ApiBody({
      description: 'Cancellation reason',
      schema: generateObjectSchema('Cancellation', {
        reason: generateStringSchema('Cancellation reason'),
        reschedule: generateBooleanSchema('Request to reschedule'),
      }, ['reason']),
    }),
    createNoContentResponse('Appointment cancelled'),
    createNotFoundError('Appointment not found'),
  );
}

/**
 * Creates appointment reminder schema.
 * Schema for appointment reminders.
 *
 * @returns Reminder schema
 */
export function createAppointmentReminderSchema() {
  return generateObjectSchema(
    'Appointment reminder',
    {
      reminderId: generateStringSchema('Reminder ID', { format: 'uuid' }),
      appointmentId: generateStringSchema('Appointment ID', { format: 'uuid' }),
      reminderType: generateEnumSchema(['24-hour', '1-hour', 'day-before'], 'Reminder type', 'string'),
      sentAt: generateFormatValidationSchema('date-time', 'Sent timestamp'),
      deliveryMethod: generateEnumSchema(['email', 'sms', 'push'], 'Delivery method', 'string'),
    },
    ['reminderId', 'appointmentId', 'reminderType', 'sentAt', 'deliveryMethod']
  );
}

// ============================================================================
// HEALTH FORM SUBMISSION (5 functions)
// ============================================================================

/**
 * Creates health form schema.
 * Schema for digital health forms.
 *
 * @returns Health form schema
 */
export function createHealthFormSchema() {
  return generateObjectSchema(
    'Health form',
    {
      formId: generateStringSchema('Form ID', { format: 'uuid' }),
      formType: generateEnumSchema(
        ['annual-health', 'emergency-info', 'medication-authorization', 'allergy-form', 'physical-exam'],
        'Form type',
        'string'
      ),
      studentId: generateStringSchema('Student ID', { format: 'uuid' }),
      schoolYear: generateStringSchema('School year', { example: '2024-2025' }),
      sections: generateArraySchema(
        'Form sections',
        generateObjectSchema('Form section', {
          sectionId: generateStringSchema('Section ID'),
          sectionTitle: generateStringSchema('Section title'),
          fields: generateArraySchema(
            'Form fields',
            generateObjectSchema('Field', {
              fieldId: generateStringSchema('Field ID'),
              fieldType: generateEnumSchema(
                ['text', 'textarea', 'select', 'checkbox', 'date', 'file'],
                'Field type',
                'string'
              ),
              label: generateStringSchema('Field label'),
              required: generateBooleanSchema('Field required'),
              value: generateStringSchema('Field value'),
            }, ['fieldId', 'fieldType', 'label', 'required']),
            {}
          ),
        }, ['sectionId', 'sectionTitle', 'fields']),
        { minItems: 1 }
      ),
      status: generateEnumSchema(['draft', 'submitted', 'approved', 'rejected'], 'Form status', 'string'),
      submittedAt: generateFormatValidationSchema('date-time', 'Submission timestamp'),
      signature: generateStringSchema('Guardian eSignature'),
    },
    ['formId', 'formType', 'studentId', 'schoolYear', 'sections', 'status']
  );
}

/**
 * Creates form submission endpoint decorator.
 * POST endpoint for submitting health forms.
 *
 * @returns Decorator for form submission
 */
export function createFormSubmissionEndpoint() {
  return applyDecorators(
    ApiTags('Health Forms'),
    ApiOperation({
      summary: 'Submit health form',
      description: 'Submit completed health form with eSignature',
    }),
    createParentAuthDecorator(),
    ApiBody({
      description: 'Health form data',
      schema: createHealthFormSchema(),
    }),
    createCreatedResponse(Object as any, 'Form submitted successfully'),
    createBadRequestError('Invalid form data or missing required fields'),
  );
}

/**
 * Creates form retrieval endpoint decorator.
 * GET endpoint for retrieving forms.
 *
 * @returns Decorator for form retrieval
 */
export function createFormRetrievalEndpoint() {
  return applyDecorators(
    ApiTags('Health Forms'),
    ApiOperation({
      summary: 'Get health forms',
      description: 'Retrieve health forms for student',
    }),
    createParentAuthDecorator(),
    createUuidPathParam('studentId', 'Student identifier'),
    ApiQuery({
      name: 'status',
      required: false,
      enum: ['draft', 'submitted', 'approved'],
      description: 'Filter by form status',
    }),
    createOffsetPaginatedResponse(Object as any, 'Health forms'),
  );
}

/**
 * Creates document upload schema.
 * Schema for uploading health documents.
 *
 * @returns Document upload schema
 */
export function createDocumentUploadSchema() {
  return generateObjectSchema(
    'Health document upload',
    {
      documentId: generateStringSchema('Document ID', { format: 'uuid' }),
      studentId: generateStringSchema('Student ID', { format: 'uuid' }),
      documentType: generateEnumSchema(
        ['physical-exam', 'immunization-record', 'prescription', 'lab-result', 'other'],
        'Document type',
        'string'
      ),
      fileName: generateStringSchema('Original file name'),
      fileSize: generateNumericSchema('File size (bytes)', {
        type: 'integer',
        minimum: 1,
        maximum: 10485760,
      }),
      fileType: generateStringSchema('MIME type', { example: 'application/pdf' }),
      uploadedAt: generateFormatValidationSchema('date-time', 'Upload timestamp'),
      uploadedBy: generateStringSchema('Guardian ID', { format: 'uuid' }),
      status: generateEnumSchema(['pending-review', 'approved', 'rejected'], 'Review status', 'string'),
    },
    ['documentId', 'studentId', 'documentType', 'fileName', 'fileSize', 'fileType', 'uploadedAt', 'uploadedBy', 'status']
  );
}

/**
 * Creates form template schema.
 * Schema for retrieving blank form templates.
 *
 * @returns Form template schema
 */
export function createFormTemplateSchema() {
  return generateObjectSchema(
    'Form template',
    {
      templateId: generateStringSchema('Template ID', { format: 'uuid' }),
      formType: generateEnumSchema(
        ['annual-health', 'emergency-info', 'medication-authorization'],
        'Form type',
        'string'
      ),
      templateVersion: generateStringSchema('Template version', { example: 'v2.1' }),
      effectiveDate: generateFormatValidationSchema('date', 'Effective date'),
      language: generateEnumSchema(['en', 'es', 'fr'], 'Form language', 'string'),
      templateStructure: createHealthFormSchema(),
    },
    ['templateId', 'formType', 'templateVersion', 'effectiveDate', 'language']
  );
}
