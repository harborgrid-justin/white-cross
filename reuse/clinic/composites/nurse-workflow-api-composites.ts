/**
 * LOC: CLINIC-COMP-NURSE-WF-API-001
 * File: /reuse/clinic/composites/nurse-workflow-api-composites.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - class-validator (v0.14.x)
 *   - ../../data/composites/swagger-schema-generators
 *   - ../../data/composites/swagger-response-builders
 *   - ../../data/composites/swagger-security-schemes
 *   - ../../data/composites/swagger-parameter-decorators
 *   - ../../server/health/health-nursing-workflows-kit
 *   - ../../server/health/health-clinical-workflows-kit
 *   - ../../server/health/health-patient-management-kit
 *   - ../../education/student-records-kit
 *
 * DOWNSTREAM (imported by):
 *   - Clinic nurse controllers
 *   - School health services
 *   - Nursing API documentation
 *   - Clinical workflow services
 *   - Health screening modules
 */

/**
 * File: /reuse/clinic/composites/nurse-workflow-api-composites.ts
 * Locator: WC-CLINIC-NURSE-WF-API-001
 * Purpose: Nurse Workflow API Composites - Production-grade nurse-specific API documentation
 *
 * Upstream: @nestjs/swagger, swagger composites, health kits, education kits
 * Downstream: Clinic controllers, school health services, nursing API docs
 * Dependencies: NestJS 10.x, Swagger 7.x, TypeScript 5.x, class-validator 0.14.x
 * Exports: 41 composed functions for comprehensive nurse workflow API documentation
 *
 * LLM Context: Production-grade nurse workflow API composite for White Cross school health platform.
 * Composes Swagger/OpenAPI documentation utilities with nursing workflow functions to provide complete
 * API documentation for nurse-specific endpoints including patient assessments with OpenAPI schemas,
 * medication administration APIs with security decorators, vital signs documentation with validation,
 * care plan management endpoints with response builders, nursing handoff communication APIs, clinical
 * workflow orchestration with RBAC security, health screening documentation, immunization tracking APIs,
 * MAR (Medication Administration Record) endpoints with audit logging, fall risk assessment APIs,
 * wound care documentation, restraint tracking endpoints, infection control reporting, nursing quality
 * metrics, and shift management APIs. Essential for HIPAA-compliant school nursing documentation with
 * comprehensive OpenAPI 3.0 specifications for API consumers.
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
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDate,
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
  IsBoolean,
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
  generateDatePathParam,
  generateFormatValidationSchema,
} from '../../data/composites/swagger-schema-generators';

import {
  createSuccessResponse,
  createCreatedResponse,
  createBadRequestError,
  createUnauthorizedError,
  createNotFoundError,
  createOffsetPaginatedResponse,
  createCsvExportResponse,
} from '../../data/composites/swagger-response-builders';

import {
  createJwtAuthentication,
  createRoleBasedSecurity,
  createPermissionBasedSecurity,
  createAuditTrailDecorator,
} from '../../data/composites/swagger-security-schemes';

import {
  createPaginationQueryParams,
  createSortingQueryParams,
  createDateRangeQueryParams,
  createUuidPathParam,
  createFilterQueryParams,
} from '../../data/composites/swagger-parameter-decorators';

// ============================================================================
// NURSE AUTHENTICATION & AUTHORIZATION (5 functions)
// ============================================================================

/**
 * Creates nurse JWT authentication decorator with role validation.
 * Validates nurse credentials and RBAC permissions for clinical operations.
 *
 * @param requiredRoles - Array of required nursing roles
 * @returns Decorator for nurse authentication with JWT and role validation
 *
 * @example
 * ```typescript
 * @Get('assessments')
 * @createNurseAuthDecorator(['RN', 'LPN'])
 * async getNurseAssessments() {
 *   return this.nursingService.getAssessments();
 * }
 * ```
 */
export function createNurseAuthDecorator(requiredRoles: string[] = ['RN', 'LPN', 'NP']) {
  return applyDecorators(
    ApiTags('Nurse Authentication'),
    createJwtAuthentication({
      scopes: ['nurse:access'],
      requiredClaims: ['role', 'license_number'],
    }),
    createRoleBasedSecurity(requiredRoles, false),
    ApiOperation({ summary: 'Nurse authentication required' }),
  );
}

/**
 * Creates nursing license validation schema.
 * OpenAPI schema for validating nursing license credentials.
 *
 * @returns Schema decorator for nursing license validation
 */
export function createNursingLicenseSchema() {
  return generateObjectSchema(
    'Nursing license information',
    {
      licenseNumber: generateStringSchema('Nursing license number', {
        pattern: '^[A-Z]{2}[0-9]{6,10}$',
        example: 'RN1234567',
      }),
      licenseType: generateEnumSchema(
        ['RN', 'LPN', 'NP', 'CNS', 'CRNA'],
        'Type of nursing license',
        'string',
        'RN'
      ),
      state: generateStringSchema('Licensing state', {
        pattern: '^[A-Z]{2}$',
        example: 'CA',
      }),
      expirationDate: generateFormatValidationSchema('date', 'License expiration date', {
        example: '2025-12-31',
      }),
      isActive: generateBooleanSchema('Whether license is active', true, true),
    },
    ['licenseNumber', 'licenseType', 'state', 'expirationDate']
  );
}

/**
 * Creates nurse credentials validation endpoint decorator.
 * Complete endpoint documentation for nurse credential verification.
 *
 * @returns Decorator for nurse credentials validation endpoint
 */
export function createNurseCredentialsEndpoint() {
  return applyDecorators(
    ApiTags('Nurse Authentication'),
    ApiOperation({
      summary: 'Validate nurse credentials',
      description: 'Verify nursing license and credentials for clinical access',
    }),
    ApiBody({
      description: 'Nurse credentials',
      schema: createNursingLicenseSchema(),
    }),
    createSuccessResponse(Object as any, 'Credentials validated successfully'),
    createBadRequestError('Invalid license format or expired credentials'),
    createUnauthorizedError('License verification failed'),
  );
}

/**
 * Creates nurse session management schema.
 * Session tracking for nurse clinical access with security audit.
 *
 * @returns Schema for nurse session management
 */
export function createNurseSessionSchema() {
  return generateObjectSchema(
    'Nurse clinical session',
    {
      sessionId: generateStringSchema('Session identifier', {
        format: 'uuid',
        example: '123e4567-e89b-12d3-a456-426614174000',
      }),
      nurseId: generateStringSchema('Nurse user ID', { format: 'uuid' }),
      licenseNumber: generateStringSchema('Nursing license number', {
        pattern: '^[A-Z]{2}[0-9]{6,10}$',
      }),
      facility: generateStringSchema('Healthcare facility', { example: 'Lincoln High School' }),
      sessionStart: generateFormatValidationSchema('date-time', 'Session start time'),
      sessionEnd: generateFormatValidationSchema('date-time', 'Session end time', {
        example: '2024-01-15T18:00:00Z',
      }),
      accessLevel: generateEnumSchema(
        ['full', 'limited', 'read-only'],
        'Clinical access level',
        'string',
        'full'
      ),
    },
    ['sessionId', 'nurseId', 'licenseNumber', 'facility', 'sessionStart']
  );
}

/**
 * Creates nurse permission validation decorator.
 * Validates specific clinical permissions for nursing operations.
 *
 * @param permissions - Required clinical permissions
 * @returns Decorator for nurse permission validation
 */
export function createNursePermissionDecorator(permissions: string[]) {
  return applyDecorators(
    createPermissionBasedSecurity(permissions, 'clinical-operations'),
    ApiOperation({
      summary: `Requires permissions: ${permissions.join(', ')}`,
    }),
  );
}

// ============================================================================
// PATIENT ASSESSMENT APIS (8 functions)
// ============================================================================

/**
 * Creates nursing assessment schema with NANDA diagnoses.
 * Complete nursing assessment documentation with standardized diagnoses.
 *
 * @returns OpenAPI schema for nursing assessments
 */
export function createNursingAssessmentSchema() {
  return generateObjectSchema(
    'Comprehensive nursing assessment',
    {
      assessmentId: generateStringSchema('Assessment ID', { format: 'uuid' }),
      patientMRN: generateStringSchema('Patient medical record number', {
        example: 'MRN-2024-001234',
      }),
      assessmentDate: generateFormatValidationSchema('date-time', 'Assessment date'),
      assessingNurse: generateStringSchema('RN performing assessment'),
      chiefComplaint: generateStringSchema('Patient chief complaint'),
      functionalStatus: generateEnumSchema(
        ['independent', 'modified-independent', 'modified-dependent', 'dependent', 'total-dependent'],
        'Functional status assessment',
        'string'
      ),
      mentalStatus: generateEnumSchema(
        ['alert-oriented', 'confused', 'lethargic', 'comatose'],
        'Mental status',
        'string'
      ),
      vitalSigns: generateObjectSchema('Vital signs', {
        temperature: generateNumericSchema('Temperature (F)', { type: 'number', minimum: 95, maximum: 105 }),
        pulse: generateNumericSchema('Pulse (bpm)', { type: 'integer', minimum: 40, maximum: 180 }),
        respirations: generateNumericSchema('Respirations (per min)', { type: 'integer', minimum: 8, maximum: 40 }),
        bloodPressure: generateStringSchema('Blood pressure', { example: '120/80' }),
        oxygenSaturation: generateNumericSchema('O2 saturation (%)', { type: 'integer', minimum: 70, maximum: 100 }),
      }, ['temperature', 'pulse', 'respirations', 'bloodPressure']),
      nandaDiagnoses: generateArraySchema(
        'NANDA nursing diagnoses',
        generateObjectSchema('NANDA diagnosis', {
          code: generateStringSchema('NANDA code', { example: '00001' }),
          label: generateStringSchema('Diagnosis label'),
          priority: generateEnumSchema([1, 2, 3], 'Diagnosis priority', 'integer'),
        }, ['code', 'label', 'priority']),
        { minItems: 0, maxItems: 10 }
      ),
    },
    ['assessmentId', 'patientMRN', 'assessmentDate', 'assessingNurse']
  );
}

/**
 * Creates assessment creation endpoint decorator.
 * POST endpoint for creating new nursing assessments.
 *
 * @returns Decorator for assessment creation endpoint
 */
export function createAssessmentCreationEndpoint() {
  return applyDecorators(
    ApiTags('Patient Assessments'),
    ApiOperation({
      summary: 'Create nursing assessment',
      description: 'Document comprehensive nursing assessment with NANDA diagnoses',
    }),
    createNurseAuthDecorator(['RN', 'NP']),
    createNursePermissionDecorator(['assessment:create']),
    ApiBody({
      description: 'Assessment data',
      schema: createNursingAssessmentSchema(),
    }),
    createCreatedResponse(Object as any, 'Assessment created successfully', true),
    createBadRequestError('Invalid assessment data'),
    createUnauthorizedError('Nurse authentication required'),
  );
}

/**
 * Creates assessment retrieval endpoint decorator.
 * GET endpoint for retrieving patient assessments with pagination.
 *
 * @returns Decorator for assessment retrieval endpoint
 */
export function createAssessmentRetrievalEndpoint() {
  return applyDecorators(
    ApiTags('Patient Assessments'),
    ApiOperation({
      summary: 'Get patient assessments',
      description: 'Retrieve nursing assessments with filtering and pagination',
    }),
    createNurseAuthDecorator(),
    createUuidPathParam('patientId', 'Patient identifier'),
    createPaginationQueryParams(1, 20, 100),
    createDateRangeQueryParams('startDate', 'endDate', 'date'),
    createOffsetPaginatedResponse(Object as any, 'Paginated assessment list'),
    createNotFoundError('Patient not found'),
  );
}

/**
 * Creates vital signs documentation schema.
 * Schema for documenting patient vital signs.
 *
 * @returns Vital signs schema decorator
 */
export function createVitalSignsSchema() {
  return generateObjectSchema(
    'Patient vital signs documentation',
    {
      vitalSignsId: generateStringSchema('Vital signs record ID', { format: 'uuid' }),
      patientMRN: generateStringSchema('Patient MRN'),
      recordedAt: generateFormatValidationSchema('date-time', 'Recording timestamp'),
      recordedBy: generateStringSchema('Nurse recording vitals'),
      temperature: generateNumericSchema('Temperature (F)', {
        type: 'number',
        minimum: 95,
        maximum: 105,
        example: 98.6,
      }),
      pulse: generateNumericSchema('Pulse rate (bpm)', {
        type: 'integer',
        minimum: 40,
        maximum: 180,
        example: 72,
      }),
      respirations: generateNumericSchema('Respiratory rate (per min)', {
        type: 'integer',
        minimum: 8,
        maximum: 40,
        example: 16,
      }),
      bloodPressureSystolic: generateNumericSchema('Systolic BP (mmHg)', {
        type: 'integer',
        minimum: 60,
        maximum: 250,
        example: 120,
      }),
      bloodPressureDiastolic: generateNumericSchema('Diastolic BP (mmHg)', {
        type: 'integer',
        minimum: 40,
        maximum: 150,
        example: 80,
      }),
      oxygenSaturation: generateNumericSchema('O2 saturation (%)', {
        type: 'integer',
        minimum: 70,
        maximum: 100,
        example: 98,
      }),
      painScale: generateNumericSchema('Pain scale (0-10)', {
        type: 'integer',
        minimum: 0,
        maximum: 10,
        example: 2,
      }),
      weight: generateNumericSchema('Weight (lbs)', {
        type: 'number',
        minimum: 10,
        maximum: 500,
      }),
      height: generateNumericSchema('Height (inches)', {
        type: 'number',
        minimum: 20,
        maximum: 90,
      }),
    },
    ['vitalSignsId', 'patientMRN', 'recordedAt', 'recordedBy', 'temperature', 'pulse', 'respirations']
  );
}

/**
 * Creates fall risk assessment schema.
 * Morse Fall Scale and fall prevention documentation.
 *
 * @returns Fall risk assessment schema
 */
export function createFallRiskAssessmentSchema() {
  return generateObjectSchema(
    'Fall risk assessment (Morse Fall Scale)',
    {
      assessmentId: generateStringSchema('Assessment ID', { format: 'uuid' }),
      patientMRN: generateStringSchema('Patient MRN'),
      assessmentDate: generateFormatValidationSchema('date-time', 'Assessment date'),
      historyOfFalling: generateEnumSchema([0, 25], 'History of falling (0=No, 25=Yes)', 'integer'),
      secondaryDiagnosis: generateEnumSchema([0, 15], 'Secondary diagnosis (0=No, 15=Yes)', 'integer'),
      ambulatoryAid: generateEnumSchema(
        [0, 15, 30],
        'Ambulatory aid (0=None, 15=Crutches/Cane, 30=Furniture)',
        'integer'
      ),
      ivTherapy: generateEnumSchema([0, 20], 'IV/Heparin Lock (0=No, 20=Yes)', 'integer'),
      gait: generateEnumSchema([0, 10, 20], 'Gait (0=Normal, 10=Weak, 20=Impaired)', 'integer'),
      mentalStatus: generateEnumSchema(
        [0, 15],
        'Mental status (0=Oriented, 15=Forgets limitations)',
        'integer'
      ),
      totalScore: generateNumericSchema('Total Morse Fall Scale score', {
        type: 'integer',
        minimum: 0,
        maximum: 125,
      }),
      riskLevel: generateEnumSchema(['low', 'moderate', 'high'], 'Fall risk level', 'string'),
      interventions: generateArraySchema(
        'Fall prevention interventions',
        generateStringSchema('Intervention'),
        { minItems: 0 }
      ),
    },
    ['assessmentId', 'patientMRN', 'assessmentDate', 'totalScore', 'riskLevel']
  );
}

/**
 * Creates pain assessment schema.
 * Comprehensive pain documentation with Wong-Baker scale.
 *
 * @returns Pain assessment schema
 */
export function createPainAssessmentSchema() {
  return generateObjectSchema(
    'Pain assessment documentation',
    {
      assessmentId: generateStringSchema('Assessment ID', { format: 'uuid' }),
      patientMRN: generateStringSchema('Patient MRN'),
      assessmentTime: generateFormatValidationSchema('date-time', 'Assessment timestamp'),
      painScale: generateNumericSchema('Pain intensity (0-10)', {
        type: 'integer',
        minimum: 0,
        maximum: 10,
      }),
      painLocation: generateStringSchema('Pain location', { example: 'Lower back' }),
      painQuality: generateEnumSchema(
        ['sharp', 'dull', 'burning', 'aching', 'stabbing', 'throbbing'],
        'Pain quality',
        'string'
      ),
      painDuration: generateStringSchema('Duration of pain', { example: '2 hours' }),
      aggravatingFactors: generateArraySchema(
        'Factors that worsen pain',
        generateStringSchema('Factor'),
        { minItems: 0 }
      ),
      relievingFactors: generateArraySchema(
        'Factors that relieve pain',
        generateStringSchema('Factor'),
        { minItems: 0 }
      }),
      interventionsProvided: generateArraySchema(
        'Pain interventions provided',
        generateStringSchema('Intervention'),
        { minItems: 0 }
      ),
    },
    ['assessmentId', 'patientMRN', 'assessmentTime', 'painScale']
  );
}

/**
 * Creates assessment update endpoint decorator.
 * PATCH endpoint for updating existing assessments.
 *
 * @returns Decorator for assessment update endpoint
 */
export function createAssessmentUpdateEndpoint() {
  return applyDecorators(
    ApiTags('Patient Assessments'),
    ApiOperation({
      summary: 'Update assessment',
      description: 'Update existing nursing assessment documentation',
    }),
    createNurseAuthDecorator(['RN', 'NP']),
    createUuidPathParam('assessmentId', 'Assessment identifier'),
    createSuccessResponse(Object as any, 'Assessment updated successfully'),
    createNotFoundError('Assessment not found'),
  );
}

/**
 * Creates assessment export endpoint decorator.
 * Export assessments to CSV for reporting and analysis.
 *
 * @returns Decorator for assessment CSV export
 */
export function createAssessmentExportEndpoint() {
  return applyDecorators(
    ApiTags('Patient Assessments'),
    ApiOperation({
      summary: 'Export assessments to CSV',
      description: 'Export nursing assessments for specified date range',
    }),
    createNurseAuthDecorator(),
    createDateRangeQueryParams('startDate', 'endDate', 'date'),
    createCsvExportResponse('Assessment export', 'nursing-assessments.csv'),
  );
}

// ============================================================================
// MEDICATION ADMINISTRATION APIS (7 functions)
// ============================================================================

/**
 * Creates medication administration record (MAR) schema.
 * Complete MAR documentation with barcode scanning and five rights.
 *
 * @returns MAR schema decorator
 */
export function createMARSchema() {
  return generateObjectSchema(
    'Medication Administration Record (MAR)',
    {
      marId: generateStringSchema('MAR entry ID', { format: 'uuid' }),
      patientMRN: generateStringSchema('Patient MRN'),
      medicationName: generateStringSchema('Medication name', { example: 'Acetaminophen' }),
      dosage: generateStringSchema('Medication dosage', { example: '500mg' }),
      route: generateEnumSchema(
        ['oral', 'IV', 'IM', 'subcutaneous', 'topical', 'inhalation', 'rectal'],
        'Administration route',
        'string'
      ),
      scheduledTime: generateFormatValidationSchema('date-time', 'Scheduled administration time'),
      actualTime: generateFormatValidationSchema('date-time', 'Actual administration time'),
      administeredBy: generateStringSchema('Nurse administering medication'),
      barcodeScan: generateBooleanSchema('Medication barcode scanned', true),
      patientIdVerified: generateBooleanSchema('Patient ID verified', true),
      fiveRightsChecked: generateObjectSchema('Five Rights verification', {
        rightPatient: generateBooleanSchema('Right patient verified', true),
        rightMedication: generateBooleanSchema('Right medication verified', true),
        rightDose: generateBooleanSchema('Right dose verified', true),
        rightRoute: generateBooleanSchema('Right route verified', true),
        rightTime: generateBooleanSchema('Right time verified', true),
      }, ['rightPatient', 'rightMedication', 'rightDose', 'rightRoute', 'rightTime']),
      status: generateEnumSchema(
        ['administered', 'refused', 'held', 'missed'],
        'Administration status',
        'string'
      ),
      refusalReason: generateStringSchema('Reason if refused'),
      adverseReaction: generateBooleanSchema('Adverse reaction observed', false),
    },
    ['marId', 'patientMRN', 'medicationName', 'dosage', 'route', 'scheduledTime', 'administeredBy', 'status']
  );
}

/**
 * Creates medication administration endpoint decorator.
 * POST endpoint for documenting medication administration.
 *
 * @returns Decorator for medication administration endpoint
 */
export function createMedicationAdministrationEndpoint() {
  return applyDecorators(
    ApiTags('Medication Administration'),
    ApiOperation({
      summary: 'Document medication administration',
      description: 'Record medication administration with five rights verification',
    }),
    createNurseAuthDecorator(['RN', 'LPN']),
    createNursePermissionDecorator(['medication:administer']),
    ApiBody({
      description: 'MAR entry',
      schema: createMARSchema(),
    }),
    createCreatedResponse(Object as any, 'Medication administration documented'),
    createBadRequestError('Invalid MAR data or five rights not verified'),
  );
}

/**
 * Creates PRN medication request schema.
 * Schema for PRN (as needed) medication administration.
 *
 * @returns PRN medication schema
 */
export function createPRNMedicationSchema() {
  return generateObjectSchema(
    'PRN medication administration',
    {
      prnId: generateStringSchema('PRN entry ID', { format: 'uuid' }),
      patientMRN: generateStringSchema('Patient MRN'),
      medicationName: generateStringSchema('PRN medication name'),
      indication: generateStringSchema('Indication for PRN', { example: 'Headache, pain level 5/10' }),
      dosageGiven: generateStringSchema('Dosage administered'),
      administeredAt: generateFormatValidationSchema('date-time', 'Administration time'),
      administeredBy: generateStringSchema('Administering nurse'),
      effectivenessAssessment: generateObjectSchema('Medication effectiveness', {
        assessedAt: generateFormatValidationSchema('date-time', 'Reassessment time'),
        painScaleBefore: generateNumericSchema('Pain before', { type: 'integer', minimum: 0, maximum: 10 }),
        painScaleAfter: generateNumericSchema('Pain after', { type: 'integer', minimum: 0, maximum: 10 }),
        effective: generateBooleanSchema('Medication effective'),
      }, ['assessedAt']),
    },
    ['prnId', 'patientMRN', 'medicationName', 'indication', 'dosageGiven', 'administeredAt', 'administeredBy']
  );
}

/**
 * Creates medication refusal documentation schema.
 * Schema for documenting patient medication refusals.
 *
 * @returns Medication refusal schema
 */
export function createMedicationRefusalSchema() {
  return generateObjectSchema(
    'Medication refusal documentation',
    {
      refusalId: generateStringSchema('Refusal record ID', { format: 'uuid' }),
      patientMRN: generateStringSchema('Patient MRN'),
      medicationName: generateStringSchema('Refused medication'),
      scheduledTime: generateFormatValidationSchema('date-time', 'Scheduled time'),
      refusalTime: generateFormatValidationSchema('date-time', 'Refusal time'),
      documentedBy: generateStringSchema('Nurse documenting refusal'),
      reason: generateStringSchema('Patient stated reason for refusal'),
      educationProvided: generateBooleanSchema('Patient education provided', true),
      prescriberNotified: generateBooleanSchema('Prescriber notified of refusal'),
    },
    ['refusalId', 'patientMRN', 'medicationName', 'refusalTime', 'documentedBy', 'reason']
  );
}

/**
 * Creates MAR retrieval endpoint decorator.
 * GET endpoint for retrieving MAR with filtering.
 *
 * @returns Decorator for MAR retrieval endpoint
 */
export function createMARRetrievalEndpoint() {
  return applyDecorators(
    ApiTags('Medication Administration'),
    ApiOperation({
      summary: 'Get medication administration records',
      description: 'Retrieve MAR entries with filtering and pagination',
    }),
    createNurseAuthDecorator(),
    createUuidPathParam('patientId', 'Patient identifier'),
    createDateRangeQueryParams(),
    createFilterQueryParams({
      status: { type: 'string', enum: ['administered', 'refused', 'held', 'missed'] },
      route: { type: 'string', enum: ['oral', 'IV', 'IM', 'subcutaneous'] },
    }),
    createPaginationQueryParams(),
    createOffsetPaginatedResponse(Object as any, 'Paginated MAR entries'),
  );
}

/**
 * Creates medication adverse reaction schema.
 * Schema for documenting adverse drug reactions.
 *
 * @returns Adverse reaction schema
 */
export function createAdverseReactionSchema() {
  return generateObjectSchema(
    'Adverse drug reaction documentation',
    {
      reactionId: generateStringSchema('Reaction record ID', { format: 'uuid' }),
      patientMRN: generateStringSchema('Patient MRN'),
      medicationName: generateStringSchema('Medication causing reaction'),
      reactionOnset: generateFormatValidationSchema('date-time', 'Reaction onset time'),
      symptoms: generateArraySchema(
        'Reaction symptoms',
        generateStringSchema('Symptom'),
        { minItems: 1 }
      ),
      severity: generateEnumSchema(['mild', 'moderate', 'severe', 'life-threatening'], 'Reaction severity', 'string'),
      interventions: generateArraySchema(
        'Interventions performed',
        generateStringSchema('Intervention'),
        { minItems: 0 }
      ),
      prescriberNotified: generateBooleanSchema('Prescriber notified'),
      pharmacyNotified: generateBooleanSchema('Pharmacy notified'),
      reportedToFDA: generateBooleanSchema('Reported to FDA MedWatch'),
      documentedBy: generateStringSchema('Documenting nurse'),
    },
    ['reactionId', 'patientMRN', 'medicationName', 'reactionOnset', 'symptoms', 'severity', 'documentedBy']
  );
}

/**
 * Creates IV therapy documentation schema.
 * Schema for IV administration and site assessment.
 *
 * @returns IV therapy schema
 */
export function createIVTherapySchema() {
  return generateObjectSchema(
    'IV therapy documentation',
    {
      ivId: generateStringSchema('IV record ID', { format: 'uuid' }),
      patientMRN: generateStringSchema('Patient MRN'),
      insertionDate: generateFormatValidationSchema('date-time', 'IV insertion date'),
      insertedBy: generateStringSchema('Nurse who inserted IV'),
      site: generateStringSchema('IV site location', { example: 'Left forearm' }),
      catheterType: generateEnumSchema(['peripheral', 'PICC', 'central'], 'Catheter type', 'string'),
      gauge: generateEnumSchema(['18G', '20G', '22G', '24G'], 'Catheter gauge', 'string'),
      siteAssessment: generateObjectSchema('IV site assessment', {
        assessmentTime: generateFormatValidationSchema('date-time', 'Assessment time'),
        redness: generateBooleanSchema('Redness present'),
        swelling: generateBooleanSchema('Swelling present'),
        drainage: generateBooleanSchema('Drainage present'),
        pain: generateBooleanSchema('Pain at site'),
        patent: generateBooleanSchema('IV patent'),
      }, ['assessmentTime', 'patent']),
      fluidType: generateStringSchema('IV fluid type', { example: 'Normal Saline 0.9%' }),
      rate: generateNumericSchema('Infusion rate (mL/hr)', { type: 'integer', minimum: 0 }),
    },
    ['ivId', 'patientMRN', 'insertionDate', 'insertedBy', 'site', 'catheterType']
  );
}

// ============================================================================
// CARE PLAN MANAGEMENT APIS (6 functions)
// ============================================================================

/**
 * Creates nursing care plan schema.
 * Complete care plan with NANDA diagnoses, NOC outcomes, and NIC interventions.
 *
 * @returns Care plan schema
 */
export function createNursingCarePlanSchema() {
  return generateObjectSchema(
    'Nursing care plan',
    {
      carePlanId: generateStringSchema('Care plan ID', { format: 'uuid' }),
      patientMRN: generateStringSchema('Patient MRN'),
      createdDate: generateFormatValidationSchema('date-time', 'Care plan creation date'),
      createdBy: generateStringSchema('RN who created care plan'),
      nandaDiagnoses: generateArraySchema(
        'NANDA nursing diagnoses',
        generateObjectSchema('NANDA diagnosis', {
          code: generateStringSchema('NANDA code'),
          label: generateStringSchema('Diagnosis label'),
          relatedFactors: generateArraySchema('Related factors', generateStringSchema('Factor'), {}),
          priority: generateEnumSchema([1, 2, 3], 'Priority level', 'integer'),
        }, ['code', 'label', 'priority']),
        { minItems: 1 }
      ),
      goals: generateArraySchema(
        'NOC outcomes and goals',
        generateObjectSchema('Care plan goal', {
          goalId: generateStringSchema('Goal ID', { format: 'uuid' }),
          description: generateStringSchema('Goal description'),
          targetDate: generateFormatValidationSchema('date', 'Target completion date'),
          criteria: generateArraySchema('Success criteria', generateStringSchema('Criterion'), {}),
          status: generateEnumSchema(['active', 'achieved', 'not-achieved', 'discontinued'], 'Goal status', 'string'),
        }, ['goalId', 'description', 'targetDate', 'status']),
        { minItems: 1 }
      ),
      interventions: generateArraySchema(
        'NIC nursing interventions',
        generateObjectSchema('Nursing intervention', {
          interventionId: generateStringSchema('Intervention ID', { format: 'uuid' }),
          nicCode: generateStringSchema('NIC intervention code'),
          description: generateStringSchema('Intervention description'),
          rationale: generateStringSchema('Evidence-based rationale'),
          frequency: generateStringSchema('Frequency', { example: 'Every 4 hours' }),
          assignedTo: generateStringSchema('Assigned staff'),
          status: generateEnumSchema(['active', 'on-hold', 'completed', 'discontinued'], 'Status', 'string'),
        }, ['interventionId', 'description', 'frequency', 'status']),
        { minItems: 1 }
      ),
    },
    ['carePlanId', 'patientMRN', 'createdDate', 'createdBy', 'nandaDiagnoses', 'goals', 'interventions']
  );
}

/**
 * Creates care plan creation endpoint decorator.
 * POST endpoint for creating comprehensive nursing care plans.
 *
 * @returns Decorator for care plan creation
 */
export function createCarePlanCreationEndpoint() {
  return applyDecorators(
    ApiTags('Care Plans'),
    ApiOperation({
      summary: 'Create nursing care plan',
      description: 'Create care plan with NANDA, NOC, and NIC standardized nursing language',
    }),
    createNurseAuthDecorator(['RN', 'NP']),
    createNursePermissionDecorator(['careplan:create']),
    ApiBody({
      description: 'Care plan data',
      schema: createNursingCarePlanSchema(),
    }),
    createCreatedResponse(Object as any, 'Care plan created successfully'),
  );
}

/**
 * Creates care plan update schema.
 * Schema for updating existing care plans with revisions.
 *
 * @returns Care plan update schema
 */
export function createCarePlanUpdateSchema() {
  return generateObjectSchema(
    'Care plan update',
    {
      updateType: generateEnumSchema(
        ['add-diagnosis', 'add-goal', 'add-intervention', 'update-status', 'discontinue'],
        'Type of update',
        'string'
      ),
      updatedBy: generateStringSchema('Nurse making update'),
      updateDate: generateFormatValidationSchema('date-time', 'Update timestamp'),
      updateDetails: generateObjectSchema('Update details', {}, []),
      revisionNote: generateStringSchema('Note explaining revision'),
    },
    ['updateType', 'updatedBy', 'updateDate']
  );
}

/**
 * Creates care plan evaluation schema.
 * Schema for evaluating care plan effectiveness and goal achievement.
 *
 * @returns Care plan evaluation schema
 */
export function createCarePlanEvaluationSchema() {
  return generateObjectSchema(
    'Care plan evaluation',
    {
      evaluationId: generateStringSchema('Evaluation ID', { format: 'uuid' }),
      carePlanId: generateStringSchema('Care plan being evaluated', { format: 'uuid' }),
      evaluationDate: generateFormatValidationSchema('date-time', 'Evaluation date'),
      evaluatedBy: generateStringSchema('RN performing evaluation'),
      goalAchievement: generateArraySchema(
        'Goal achievement status',
        generateObjectSchema('Goal status', {
          goalId: generateStringSchema('Goal ID', { format: 'uuid' }),
          achieved: generateBooleanSchema('Goal achieved'),
          progressNotes: generateStringSchema('Progress notes'),
        }, ['goalId', 'achieved']),
        {}
      ),
      interventionEffectiveness: generateArraySchema(
        'Intervention effectiveness',
        generateObjectSchema('Intervention evaluation', {
          interventionId: generateStringSchema('Intervention ID', { format: 'uuid' }),
          effective: generateBooleanSchema('Intervention effective'),
          continueOrModify: generateEnumSchema(['continue', 'modify', 'discontinue'], 'Action', 'string'),
        }, ['interventionId', 'effective', 'continueOrModify']),
        {}
      ),
      overallAssessment: generateStringSchema('Overall care plan effectiveness assessment'),
    },
    ['evaluationId', 'carePlanId', 'evaluationDate', 'evaluatedBy', 'overallAssessment']
  );
}

/**
 * Creates care plan retrieval endpoint decorator.
 * GET endpoint for retrieving patient care plans.
 *
 * @returns Decorator for care plan retrieval
 */
export function createCarePlanRetrievalEndpoint() {
  return applyDecorators(
    ApiTags('Care Plans'),
    ApiOperation({
      summary: 'Get patient care plans',
      description: 'Retrieve active and historical care plans for patient',
    }),
    createNurseAuthDecorator(),
    createUuidPathParam('patientId', 'Patient identifier'),
    ApiQuery({
      name: 'status',
      required: false,
      enum: ['active', 'completed', 'discontinued'],
      description: 'Filter by care plan status',
    }),
    createOffsetPaginatedResponse(Object as any, 'Paginated care plans'),
  );
}

/**
 * Creates care plan interdisciplinary collaboration schema.
 * Schema for interdisciplinary team input on care plans.
 *
 * @returns Collaboration schema
 */
export function createCarePlanCollaborationSchema() {
  return generateObjectSchema(
    'Interdisciplinary care plan collaboration',
    {
      collaborationId: generateStringSchema('Collaboration ID', { format: 'uuid' }),
      carePlanId: generateStringSchema('Care plan ID', { format: 'uuid' }),
      discipline: generateEnumSchema(
        ['nursing', 'physician', 'physical-therapy', 'occupational-therapy', 'social-work', 'nutrition'],
        'Healthcare discipline',
        'string'
      ),
      contributor: generateStringSchema('Contributing professional'),
      contributionDate: generateFormatValidationSchema('date-time', 'Contribution date'),
      recommendations: generateArraySchema(
        'Discipline-specific recommendations',
        generateStringSchema('Recommendation'),
        { minItems: 1 }
      ),
      sharedGoals: generateArraySchema(
        'Shared interdisciplinary goals',
        generateStringSchema('Goal'),
        {}
      ),
    },
    ['collaborationId', 'carePlanId', 'discipline', 'contributor', 'contributionDate', 'recommendations']
  );
}

// ============================================================================
// VITAL SIGNS DOCUMENTATION (5 functions)
// ============================================================================

/**
 * Creates vital signs documentation endpoint decorator.
 * POST endpoint for recording patient vital signs.
 *
 * @returns Decorator for vital signs documentation
 */
export function createVitalSignsDocumentationEndpoint() {
  return applyDecorators(
    ApiTags('Vital Signs'),
    ApiOperation({
      summary: 'Document vital signs',
      description: 'Record patient vital signs with automatic flagging of abnormal values',
    }),
    createNurseAuthDecorator(),
    ApiBody({
      description: 'Vital signs data',
      schema: createVitalSignsSchema(),
    }),
    createCreatedResponse(Object as any, 'Vital signs documented'),
    createBadRequestError('Invalid vital signs data or out of range values'),
  );
}

/**
 * Creates vital signs trend analysis schema.
 * Schema for vital signs trending and pattern analysis.
 *
 * @returns Vital signs trend schema
 */
export function createVitalSignsTrendSchema() {
  return generateObjectSchema(
    'Vital signs trend analysis',
    {
      trendId: generateStringSchema('Trend analysis ID', { format: 'uuid' }),
      patientMRN: generateStringSchema('Patient MRN'),
      analysisDate: generateFormatValidationSchema('date-time', 'Analysis date'),
      dateRange: generateObjectSchema('Date range for analysis', {
        startDate: generateFormatValidationSchema('date-time', 'Start date'),
        endDate: generateFormatValidationSchema('date-time', 'End date'),
      }, ['startDate', 'endDate']),
      temperatureTrend: generateEnumSchema(['stable', 'increasing', 'decreasing', 'fluctuating'], 'Temperature trend', 'string'),
      pulseTrend: generateEnumSchema(['stable', 'increasing', 'decreasing', 'fluctuating'], 'Pulse trend', 'string'),
      bpTrend: generateEnumSchema(['stable', 'increasing', 'decreasing', 'fluctuating'], 'Blood pressure trend', 'string'),
      abnormalPatterns: generateArraySchema(
        'Identified abnormal patterns',
        generateStringSchema('Pattern'),
        {}
      ),
      clinicalSignificance: generateStringSchema('Clinical significance notes'),
    },
    ['trendId', 'patientMRN', 'analysisDate', 'dateRange']
  );
}

/**
 * Creates vital signs alert configuration schema.
 * Schema for configuring automated vital signs alerts.
 *
 * @returns Alert configuration schema
 */
export function createVitalSignsAlertSchema() {
  return generateObjectSchema(
    'Vital signs alert configuration',
    {
      alertId: generateStringSchema('Alert configuration ID', { format: 'uuid' }),
      patientMRN: generateStringSchema('Patient MRN'),
      parameter: generateEnumSchema(
        ['temperature', 'pulse', 'respirations', 'bloodPressure', 'oxygenSaturation'],
        'Vital sign parameter',
        'string'
      ),
      thresholds: generateObjectSchema('Alert thresholds', {
        criticalHigh: generateNumericSchema('Critical high threshold', { type: 'number' }),
        high: generateNumericSchema('High threshold', { type: 'number' }),
        low: generateNumericSchema('Low threshold', { type: 'number' }),
        criticalLow: generateNumericSchema('Critical low threshold', { type: 'number' }),
      }, []),
      alertRecipients: generateArraySchema(
        'Alert recipients',
        generateStringSchema('Recipient'),
        { minItems: 1 }
      ),
      alertEnabled: generateBooleanSchema('Alert enabled', true),
    },
    ['alertId', 'patientMRN', 'parameter', 'alertEnabled']
  );
}

/**
 * Creates orthostatic vital signs schema.
 * Schema for orthostatic blood pressure and pulse measurements.
 *
 * @returns Orthostatic vitals schema
 */
export function createOrthostaticVitalsSchema() {
  return generateObjectSchema(
    'Orthostatic vital signs',
    {
      orthstaticId: generateStringSchema('Orthostatic test ID', { format: 'uuid' }),
      patientMRN: generateStringSchema('Patient MRN'),
      testDate: generateFormatValidationSchema('date-time', 'Test date'),
      performedBy: generateStringSchema('Nurse performing test'),
      supineReadings: generateObjectSchema('Supine position readings', {
        bloodPressure: generateStringSchema('BP supine', { example: '120/80' }),
        pulse: generateNumericSchema('Pulse supine', { type: 'integer', example: 72 }),
      }, ['bloodPressure', 'pulse']),
      sittingReadings: generateObjectSchema('Sitting position readings', {
        bloodPressure: generateStringSchema('BP sitting', { example: '118/78' }),
        pulse: generateNumericSchema('Pulse sitting', { type: 'integer', example: 75 }),
      }, ['bloodPressure', 'pulse']),
      standingReadings: generateObjectSchema('Standing position readings', {
        bloodPressure: generateStringSchema('BP standing', { example: '115/75' }),
        pulse: generateNumericSchema('Pulse standing', { type: 'integer', example: 80 }),
      }, ['bloodPressure', 'pulse']),
      interpretation: generateEnumSchema(
        ['normal', 'orthostatic-hypotension', 'orthostatic-intolerance'],
        'Test interpretation',
        'string'
      ),
      symptoms: generateArraySchema(
        'Symptoms during test',
        generateStringSchema('Symptom'),
        {}
      ),
    },
    ['orthstaticId', 'patientMRN', 'testDate', 'performedBy', 'supineReadings', 'sittingReadings', 'standingReadings']
  );
}

/**
 * Creates vital signs retrieval endpoint decorator.
 * GET endpoint for retrieving vital signs history.
 *
 * @returns Decorator for vital signs retrieval
 */
export function createVitalSignsRetrievalEndpoint() {
  return applyDecorators(
    ApiTags('Vital Signs'),
    ApiOperation({
      summary: 'Get vital signs history',
      description: 'Retrieve patient vital signs with date range filtering',
    }),
    createNurseAuthDecorator(),
    createUuidPathParam('patientId', 'Patient identifier'),
    createDateRangeQueryParams('startDate', 'endDate', 'date-time'),
    createPaginationQueryParams(1, 50, 200),
    createOffsetPaginatedResponse(Object as any, 'Paginated vital signs'),
  );
}

// ============================================================================
// SHIFT HANDOFF APIS (4 functions)
// ============================================================================

/**
 * Creates SBAR nursing handoff schema.
 * Structured SBAR (Situation-Background-Assessment-Recommendation) handoff.
 *
 * @returns SBAR handoff schema
 */
export function createSBARHandoffSchema() {
  return generateObjectSchema(
    'SBAR nursing handoff',
    {
      handoffId: generateStringSchema('Handoff ID', { format: 'uuid' }),
      patientMRN: generateStringSchema('Patient MRN'),
      handoffDate: generateFormatValidationSchema('date-time', 'Handoff timestamp'),
      outgoingNurse: generateStringSchema('Outgoing shift nurse'),
      incomingNurse: generateStringSchema('Incoming shift nurse'),
      situation: generateStringSchema('Current situation', {
        example: 'Patient is post-op day 2 following appendectomy',
      }),
      background: generateStringSchema('Relevant background', {
        example: 'History of diabetes, on insulin regimen',
      }),
      assessment: generateStringSchema('Current assessment', {
        example: 'Vital signs stable, pain controlled at 3/10, incision clean and dry',
      }),
      recommendation: generateStringSchema('Recommendations for incoming shift', {
        example: 'Continue pain management, ambulate patient BID, monitor for infection',
      }),
      pendingTasks: generateArraySchema(
        'Pending tasks for incoming shift',
        generateObjectSchema('Pending task', {
          task: generateStringSchema('Task description'),
          priority: generateEnumSchema(['high', 'medium', 'low'], 'Task priority', 'string'),
          dueTime: generateFormatValidationSchema('date-time', 'Due time'),
        }, ['task', 'priority']),
        {}
      ),
      criticalAlerts: generateArraySchema(
        'Critical alerts and safety concerns',
        generateStringSchema('Alert'),
        {}
      ),
    },
    ['handoffId', 'patientMRN', 'handoffDate', 'outgoingNurse', 'incomingNurse', 'situation', 'background', 'assessment', 'recommendation']
  );
}

/**
 * Creates handoff creation endpoint decorator.
 * POST endpoint for documenting shift handoff.
 *
 * @returns Decorator for handoff creation
 */
export function createHandoffCreationEndpoint() {
  return applyDecorators(
    ApiTags('Nursing Handoff'),
    ApiOperation({
      summary: 'Create shift handoff',
      description: 'Document structured SBAR handoff between nursing shifts',
    }),
    createNurseAuthDecorator(),
    ApiBody({
      description: 'SBAR handoff data',
      schema: createSBARHandoffSchema(),
    }),
    createCreatedResponse(Object as any, 'Handoff documented'),
  );
}

/**
 * Creates handoff acknowledgment schema.
 * Schema for incoming nurse to acknowledge handoff receipt.
 *
 * @returns Handoff acknowledgment schema
 */
export function createHandoffAcknowledgmentSchema() {
  return generateObjectSchema(
    'Handoff acknowledgment',
    {
      acknowledgmentId: generateStringSchema('Acknowledgment ID', { format: 'uuid' }),
      handoffId: generateStringSchema('Handoff being acknowledged', { format: 'uuid' }),
      acknowledgedBy: generateStringSchema('Incoming nurse'),
      acknowledgmentTime: generateFormatValidationSchema('date-time', 'Acknowledgment time'),
      clarifyingQuestions: generateArraySchema(
        'Questions asked during handoff',
        generateStringSchema('Question'),
        {}
      ),
      additionalConcerns: generateStringSchema('Additional concerns or notes'),
    },
    ['acknowledgmentId', 'handoffId', 'acknowledgedBy', 'acknowledgmentTime']
  );
}

/**
 * Creates handoff retrieval endpoint decorator.
 * GET endpoint for retrieving handoff history.
 *
 * @returns Decorator for handoff retrieval
 */
export function createHandoffRetrievalEndpoint() {
  return applyDecorators(
    ApiTags('Nursing Handoff'),
    ApiOperation({
      summary: 'Get handoff history',
      description: 'Retrieve nursing handoff documentation',
    }),
    createNurseAuthDecorator(),
    createDateRangeQueryParams('startDate', 'endDate', 'date-time'),
    ApiQuery({
      name: 'nurse',
      required: false,
      type: String,
      description: 'Filter by nurse name',
    }),
    createOffsetPaginatedResponse(Object as any, 'Paginated handoffs'),
  );
}

// ============================================================================
// NURSING WORKFLOW ORCHESTRATION (6 functions)
// ============================================================================

/**
 * Creates nursing task assignment schema.
 * Schema for assigning clinical tasks to nursing staff.
 *
 * @returns Task assignment schema
 */
export function createNursingTaskSchema() {
  return generateObjectSchema(
    'Nursing task assignment',
    {
      taskId: generateStringSchema('Task ID', { format: 'uuid' }),
      patientMRN: generateStringSchema('Patient MRN'),
      taskType: generateEnumSchema(
        ['assessment', 'medication', 'vitals', 'treatment', 'documentation', 'education'],
        'Type of nursing task',
        'string'
      ),
      description: generateStringSchema('Task description'),
      assignedTo: generateStringSchema('Assigned nurse'),
      assignedBy: generateStringSchema('Assigning charge nurse'),
      priority: generateEnumSchema(['stat', 'urgent', 'routine'], 'Task priority', 'string'),
      dueTime: generateFormatValidationSchema('date-time', 'Task due time'),
      estimatedDuration: generateNumericSchema('Estimated duration (minutes)', {
        type: 'integer',
        minimum: 5,
        maximum: 240,
      }),
      status: generateEnumSchema(
        ['assigned', 'in-progress', 'completed', 'deferred', 'cancelled'],
        'Task status',
        'string'
      ),
      completedAt: generateFormatValidationSchema('date-time', 'Completion time'),
      completionNotes: generateStringSchema('Notes upon completion'),
    },
    ['taskId', 'patientMRN', 'taskType', 'description', 'assignedTo', 'priority', 'dueTime', 'status']
  );
}

/**
 * Creates nursing workflow automation schema.
 * Schema for automated nursing workflow triggers and actions.
 *
 * @returns Workflow automation schema
 */
export function createNursingWorkflowAutomationSchema() {
  return generateObjectSchema(
    'Nursing workflow automation',
    {
      automationId: generateStringSchema('Automation rule ID', { format: 'uuid' }),
      ruleName: generateStringSchema('Automation rule name', { example: 'Post-op vital signs protocol' }),
      trigger: generateObjectSchema('Workflow trigger', {
        triggerType: generateEnumSchema(
          ['admission', 'procedure-complete', 'lab-result', 'time-based', 'assessment-finding'],
          'Trigger type',
          'string'
        ),
        condition: generateStringSchema('Trigger condition'),
      }, ['triggerType', 'condition']),
      automatedActions: generateArraySchema(
        'Automated actions to execute',
        generateObjectSchema('Action', {
          actionType: generateEnumSchema(
            ['create-task', 'send-alert', 'create-order', 'update-careplan'],
            'Action type',
            'string'
          ),
          actionDetails: generateStringSchema('Action details'),
        }, ['actionType']),
        { minItems: 1 }
      ),
      enabled: generateBooleanSchema('Automation enabled', true),
    },
    ['automationId', 'ruleName', 'trigger', 'automatedActions']
  );
}

/**
 * Creates nursing acuity scoring schema.
 * Patient acuity assessment for staffing ratios and resource allocation.
 *
 * @returns Acuity scoring schema
 */
export function createNursingAcuitySchema() {
  return generateObjectSchema(
    'Nursing acuity assessment',
    {
      acuityId: generateStringSchema('Acuity assessment ID', { format: 'uuid' }),
      patientMRN: generateStringSchema('Patient MRN'),
      assessmentDate: generateFormatValidationSchema('date-time', 'Assessment date'),
      assessedBy: generateStringSchema('Assessing nurse'),
      selfCareDeficit: generateEnumSchema([0, 1, 2, 3], 'Self-care deficit score', 'integer'),
      treatmentComplexity: generateEnumSchema([0, 1, 2, 3], 'Treatment complexity score', 'integer'),
      monitoring: generateEnumSchema([0, 1, 2, 3], 'Monitoring requirements score', 'integer'),
      emotionalSupport: generateEnumSchema([0, 1, 2, 3], 'Emotional support needs score', 'integer'),
      totalAcuityScore: generateNumericSchema('Total acuity score', {
        type: 'integer',
        minimum: 0,
        maximum: 12,
      }),
      acuityLevel: generateEnumSchema(['low', 'moderate', 'high', 'critical'], 'Acuity level', 'string'),
      recommendedStaffingRatio: generateStringSchema('Recommended nurse-to-patient ratio', {
        example: '1:4',
      }),
    },
    ['acuityId', 'patientMRN', 'assessmentDate', 'assessedBy', 'totalAcuityScore', 'acuityLevel']
  );
}

/**
 * Creates nursing delegation documentation schema.
 * Schema for documenting task delegation to unlicensed assistive personnel.
 *
 * @returns Delegation schema
 */
export function createNursingDelegationSchema() {
  return generateObjectSchema(
    'Nursing task delegation',
    {
      delegationId: generateStringSchema('Delegation ID', { format: 'uuid' }),
      delegatingNurse: generateStringSchema('RN delegating task'),
      delegatedTo: generateStringSchema('UAP receiving delegation'),
      delegatedToRole: generateEnumSchema(['CNA', 'MA', 'LNA', 'PCT'], 'Role of delegate', 'string'),
      taskDelegated: generateStringSchema('Task being delegated'),
      patientMRN: generateStringSchema('Patient MRN'),
      delegationDate: generateFormatValidationSchema('date-time', 'Delegation timestamp'),
      supervision: generateEnumSchema(
        ['direct-observation', 'periodic-inspection', 'initial-direction'],
        'Level of supervision',
        'string'
      ),
      expectedOutcome: generateStringSchema('Expected task outcome'),
      completionReported: generateBooleanSchema('Completion reported back to RN'),
      nursingJudgmentRequired: generateBooleanSchema('Requires nursing judgment', false),
    },
    ['delegationId', 'delegatingNurse', 'delegatedTo', 'delegatedToRole', 'taskDelegated', 'patientMRN', 'delegationDate']
  );
}

/**
 * Creates nursing quality metrics schema.
 * Schema for nursing quality indicators and performance metrics.
 *
 * @returns Quality metrics schema
 */
export function createNursingQualityMetricsSchema() {
  return generateObjectSchema(
    'Nursing quality metrics',
    {
      metricsId: generateStringSchema('Metrics record ID', { format: 'uuid' }),
      reportingPeriod: generateObjectSchema('Reporting period', {
        startDate: generateFormatValidationSchema('date', 'Period start'),
        endDate: generateFormatValidationSchema('date', 'Period end'),
      }, ['startDate', 'endDate']),
      unit: generateStringSchema('Nursing unit', { example: 'School Health Office' }),
      fallsWithInjury: generateNumericSchema('Falls with injury count', { type: 'integer', minimum: 0 }),
      pressureUlcers: generateNumericSchema('Hospital-acquired pressure ulcers', { type: 'integer', minimum: 0 }),
      catheterUTI: generateNumericSchema('Catheter-associated UTIs', { type: 'integer', minimum: 0 }),
      medicationErrors: generateNumericSchema('Medication errors', { type: 'integer', minimum: 0 }),
      painReassessment: generateNumericSchema('Pain reassessment compliance (%)', {
        type: 'number',
        minimum: 0,
        maximum: 100,
      }),
      fallRiskAssessment: generateNumericSchema('Fall risk assessment compliance (%)', {
        type: 'number',
        minimum: 0,
        maximum: 100,
      }),
      handHygiene: generateNumericSchema('Hand hygiene compliance (%)', {
        type: 'number',
        minimum: 0,
        maximum: 100,
      }),
      patientSatisfaction: generateNumericSchema('Patient satisfaction score', {
        type: 'number',
        minimum: 0,
        maximum: 10,
      }),
    },
    ['metricsId', 'reportingPeriod', 'unit']
  );
}

/**
 * Creates nursing quality endpoint decorator.
 * GET endpoint for retrieving nursing quality metrics.
 *
 * @returns Decorator for quality metrics endpoint
 */
export function createNursingQualityMetricsEndpoint() {
  return applyDecorators(
    ApiTags('Nursing Quality'),
    ApiOperation({
      summary: 'Get nursing quality metrics',
      description: 'Retrieve quality indicators and performance metrics for nursing services',
    }),
    createNurseAuthDecorator(['RN', 'NP', 'CNS']),
    createDateRangeQueryParams('startDate', 'endDate', 'date'),
    ApiQuery({
      name: 'unit',
      required: false,
      type: String,
      description: 'Filter by nursing unit',
    }),
    createSuccessResponse(Object as any, 'Quality metrics retrieved'),
  );
}
