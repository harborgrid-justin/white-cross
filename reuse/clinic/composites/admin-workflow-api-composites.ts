/**
 * LOC: CLINIC-COMP-ADMIN-WF-API-001
 * File: /reuse/clinic/composites/admin-workflow-api-composites.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - class-validator (v0.14.x)
 *   - ../../data/composites/swagger-schema-generators
 *   - ../../data/composites/swagger-response-builders
 *   - ../../data/composites/swagger-security-schemes
 *   - ../../data/composites/swagger-parameter-decorators
 *   - ../../education/compliance-reporting-kit
 *   - ../../education/student-analytics-kit
 *   - ../../server/health/health-analytics-reporting-kit
 *   - ../../data/production-configuration-management
 *
 * DOWNSTREAM (imported by):
 *   - Admin dashboard controllers
 *   - System configuration services
 *   - Compliance reporting modules
 *   - User management APIs
 *   - Audit trail services
 */

/**
 * File: /reuse/clinic/composites/admin-workflow-api-composites.ts
 * Locator: WC-CLINIC-ADMIN-WF-API-001
 * Purpose: Admin Workflow API Composites - Administrative oversight and configuration APIs
 *
 * Upstream: @nestjs/swagger, swagger composites, education/health kits, data utilities
 * Downstream: Admin controllers, configuration services, audit modules
 * Dependencies: NestJS 10.x, Swagger 7.x, TypeScript 5.x, class-validator 0.14.x
 * Exports: 39 composed functions for comprehensive admin workflow API documentation
 *
 * LLM Context: Production-grade admin workflow API composite for White Cross administrative operations.
 * Composes Swagger/OpenAPI utilities with admin functions providing complete API documentation for
 * administrative oversight endpoints including dashboard metrics APIs with real-time analytics, report
 * generation endpoints with CSV/PDF export, system configuration APIs with validation, user management
 * with RBAC controls, role assignment endpoints, audit log queries with filtering, compliance reporting
 * APIs, student health analytics, nurse performance metrics, facility management endpoints, school district
 * configuration, administrative workflow automation, approval workflows, bulk operations APIs, data export
 * utilities, backup/restore endpoints, system health monitoring, and administrative notifications.
 * Essential for school health administrators requiring comprehensive oversight and configuration capabilities.
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
  createCsvExportResponse,
  createExcelExportResponse,
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
  createSearchQueryParam,
} from '../../data/composites/swagger-parameter-decorators';

// ============================================================================
// ADMIN AUTHENTICATION & AUTHORIZATION (5 functions)
// ============================================================================

/**
 * Creates admin authentication decorator with role validation.
 * Validates admin credentials and RBAC permissions for system operations.
 *
 * @param requiredRoles - Array of required admin roles
 * @returns Decorator for admin authentication with JWT and role validation
 */
export function createAdminAuthDecorator(requiredRoles: string[] = ['admin', 'super-admin']) {
  return applyDecorators(
    ApiTags('Admin Authentication'),
    createJwtAuthentication({
      scopes: ['admin:access'],
      requiredClaims: ['role', 'permissions'],
    }),
    createRoleBasedSecurity(requiredRoles, false),
    ApiOperation({ summary: 'Admin authentication required' }),
  );
}

/**
 * Creates admin credentials schema.
 * OpenAPI schema for admin authentication credentials.
 *
 * @returns Schema for admin credentials
 */
export function createAdminCredentialsSchema() {
  return generateObjectSchema(
    'Admin authentication credentials',
    {
      username: generateStringSchema('Admin username', {
        minLength: 3,
        maxLength: 50,
        example: 'admin@school.edu',
      }),
      password: generateStringSchema('Admin password', {
        format: 'password',
        minLength: 8,
      }),
      mfaCode: generateStringSchema('Multi-factor authentication code', {
        pattern: '^[0-9]{6}$',
        example: '123456',
      }),
      sessionDuration: generateNumericSchema('Session duration (hours)', {
        type: 'integer',
        minimum: 1,
        maximum: 24,
        example: 8,
      }),
    },
    ['username', 'password']
  );
}

/**
 * Creates admin session schema.
 * Session tracking for administrative access with security audit.
 *
 * @returns Schema for admin session management
 */
export function createAdminSessionSchema() {
  return generateObjectSchema(
    'Admin session information',
    {
      sessionId: generateStringSchema('Session identifier', { format: 'uuid' }),
      userId: generateStringSchema('Admin user ID', { format: 'uuid' }),
      username: generateStringSchema('Admin username'),
      role: generateEnumSchema(
        ['super-admin', 'admin', 'district-admin', 'school-admin', 'health-coordinator'],
        'Admin role',
        'string'
      ),
      permissions: generateArraySchema(
        'Granted permissions',
        generateStringSchema('Permission'),
        { minItems: 0 }
      ),
      sessionStart: generateFormatValidationSchema('date-time', 'Session start time'),
      sessionExpiry: generateFormatValidationSchema('date-time', 'Session expiry time'),
      lastActivity: generateFormatValidationSchema('date-time', 'Last activity timestamp'),
      ipAddress: generateStringSchema('IP address', { example: '192.168.1.100' }),
    },
    ['sessionId', 'userId', 'username', 'role', 'sessionStart', 'sessionExpiry']
  );
}

/**
 * Creates admin permission validation decorator.
 * Validates specific administrative permissions for operations.
 *
 * @param permissions - Required administrative permissions
 * @returns Decorator for admin permission validation
 */
export function createAdminPermissionDecorator(permissions: string[]) {
  return applyDecorators(
    createPermissionBasedSecurity(permissions, 'administrative-operations'),
    ApiOperation({
      summary: `Requires permissions: ${permissions.join(', ')}`,
    }),
  );
}

/**
 * Creates admin login endpoint decorator.
 * POST endpoint for administrative authentication.
 *
 * @returns Decorator for admin login endpoint
 */
export function createAdminLoginEndpoint() {
  return applyDecorators(
    ApiTags('Admin Authentication'),
    ApiOperation({
      summary: 'Admin login',
      description: 'Authenticate admin user and establish session with MFA',
    }),
    ApiBody({
      description: 'Admin credentials',
      schema: createAdminCredentialsSchema(),
    }),
    createSuccessResponse(Object as any, 'Authentication successful'),
    createBadRequestError('Invalid credentials or MFA code'),
    createUnauthorizedError('Authentication failed'),
  );
}

// ============================================================================
// REPORT GENERATION APIS (7 functions)
// ============================================================================

/**
 * Creates health screening report schema.
 * Schema for generating comprehensive health screening reports.
 *
 * @returns Health screening report schema
 */
export function createHealthScreeningReportSchema() {
  return generateObjectSchema(
    'Health screening report parameters',
    {
      reportId: generateStringSchema('Report ID', { format: 'uuid' }),
      reportType: generateEnumSchema(
        ['vision', 'hearing', 'scoliosis', 'dental', 'bmi', 'comprehensive'],
        'Type of screening report',
        'string'
      ),
      dateRange: generateObjectSchema('Report date range', {
        startDate: generateFormatValidationSchema('date', 'Start date'),
        endDate: generateFormatValidationSchema('date', 'End date'),
      }, ['startDate', 'endDate']),
      schools: generateArraySchema(
        'Schools to include',
        generateStringSchema('School ID', { format: 'uuid' }),
        { minItems: 0 }
      ),
      grades: generateArraySchema(
        'Grade levels to include',
        generateEnumSchema(['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], 'Grade', 'string'),
        { minItems: 0 }
      ),
      includeReferrals: generateBooleanSchema('Include referral data', true),
      includeFollowUp: generateBooleanSchema('Include follow-up status', true),
      format: generateEnumSchema(['pdf', 'csv', 'excel'], 'Report format', 'string'),
    },
    ['reportId', 'reportType', 'dateRange', 'format']
  );
}

/**
 * Creates immunization compliance report schema.
 * Schema for immunization compliance and exemption reporting.
 *
 * @returns Immunization report schema
 */
export function createImmunizationReportSchema() {
  return generateObjectSchema(
    'Immunization compliance report',
    {
      reportId: generateStringSchema('Report ID', { format: 'uuid' }),
      reportDate: generateFormatValidationSchema('date-time', 'Report generation date'),
      schoolYear: generateStringSchema('School year', { example: '2024-2025' }),
      schools: generateArraySchema(
        'Schools included',
        generateStringSchema('School name'),
        {}
      ),
      totalStudents: generateNumericSchema('Total students', { type: 'integer', minimum: 0 }),
      compliantStudents: generateNumericSchema('Compliant students', { type: 'integer', minimum: 0 }),
      nonCompliantStudents: generateNumericSchema('Non-compliant students', { type: 'integer', minimum: 0 }),
      exemptions: generateObjectSchema('Exemption breakdown', {
        medical: generateNumericSchema('Medical exemptions', { type: 'integer', minimum: 0 }),
        religious: generateNumericSchema('Religious exemptions', { type: 'integer', minimum: 0 }),
        philosophical: generateNumericSchema('Philosophical exemptions', { type: 'integer', minimum: 0 }),
      }, []),
      complianceRate: generateNumericSchema('Compliance rate (%)', {
        type: 'number',
        minimum: 0,
        maximum: 100,
      }),
      missingVaccines: generateArraySchema(
        'Most commonly missing vaccines',
        generateObjectSchema('Vaccine', {
          name: generateStringSchema('Vaccine name'),
          count: generateNumericSchema('Missing count', { type: 'integer' }),
        }, ['name', 'count']),
        {}
      ),
    },
    ['reportId', 'reportDate', 'schoolYear', 'totalStudents', 'complianceRate']
  );
}

/**
 * Creates nurse performance metrics schema.
 * Schema for nurse productivity and quality metrics reporting.
 *
 * @returns Nurse performance schema
 */
export function createNursePerformanceReportSchema() {
  return generateObjectSchema(
    'Nurse performance metrics report',
    {
      reportId: generateStringSchema('Report ID', { format: 'uuid' }),
      nurseId: generateStringSchema('Nurse ID', { format: 'uuid' }),
      nurseName: generateStringSchema('Nurse name'),
      reportingPeriod: generateObjectSchema('Reporting period', {
        startDate: generateFormatValidationSchema('date', 'Period start'),
        endDate: generateFormatValidationSchema('date', 'Period end'),
      }, ['startDate', 'endDate']),
      metrics: generateObjectSchema('Performance metrics', {
        totalVisits: generateNumericSchema('Total student visits', { type: 'integer', minimum: 0 }),
        assessmentsCompleted: generateNumericSchema('Assessments completed', { type: 'integer', minimum: 0 }),
        medicationsAdministered: generateNumericSchema('Medications administered', { type: 'integer', minimum: 0 }),
        documentationTimeliness: generateNumericSchema('Documentation timeliness (%)', {
          type: 'number',
          minimum: 0,
          maximum: 100,
        }),
        patientSatisfaction: generateNumericSchema('Patient satisfaction score', {
          type: 'number',
          minimum: 0,
          maximum: 10,
        }),
        errorRate: generateNumericSchema('Error rate (%)', {
          type: 'number',
          minimum: 0,
          maximum: 100,
        }),
        overtimeHours: generateNumericSchema('Overtime hours', { type: 'number', minimum: 0 }),
      }, []),
    },
    ['reportId', 'nurseId', 'nurseName', 'reportingPeriod', 'metrics']
  );
}

/**
 * Creates report generation endpoint decorator.
 * POST endpoint for generating administrative reports.
 *
 * @returns Decorator for report generation endpoint
 */
export function createReportGenerationEndpoint() {
  return applyDecorators(
    ApiTags('Report Generation'),
    ApiOperation({
      summary: 'Generate administrative report',
      description: 'Generate comprehensive reports for health screening, compliance, and performance',
    }),
    createAdminAuthDecorator(),
    createAdminPermissionDecorator(['reports:generate']),
    ApiBody({
      description: 'Report parameters',
      schema: generateObjectSchema('Report request', {
        reportType: generateEnumSchema(
          ['health-screening', 'immunization', 'nurse-performance', 'compliance', 'analytics'],
          'Report type',
          'string'
        ),
        parameters: generateObjectSchema('Report parameters', {}, []),
      }, ['reportType', 'parameters']),
    }),
    createCreatedResponse(Object as any, 'Report generation initiated'),
  );
}

/**
 * Creates report retrieval endpoint decorator.
 * GET endpoint for retrieving generated reports with pagination.
 *
 * @returns Decorator for report retrieval endpoint
 */
export function createReportRetrievalEndpoint() {
  return applyDecorators(
    ApiTags('Report Generation'),
    ApiOperation({
      summary: 'Get generated reports',
      description: 'Retrieve list of generated administrative reports',
    }),
    createAdminAuthDecorator(),
    createPaginationQueryParams(1, 20, 100),
    createSortingQueryParams(['createdAt', 'reportType', 'status'], 'createdAt'),
    createFilterQueryParams({
      reportType: { type: 'string' },
      status: { type: 'string', enum: ['generating', 'completed', 'failed'] },
    }),
    createOffsetPaginatedResponse(Object as any, 'Paginated reports'),
  );
}

/**
 * Creates report download endpoint decorator.
 * GET endpoint for downloading generated reports.
 *
 * @returns Decorator for report download endpoint
 */
export function createReportDownloadEndpoint() {
  return applyDecorators(
    ApiTags('Report Generation'),
    ApiOperation({
      summary: 'Download report',
      description: 'Download generated report in specified format',
    }),
    createAdminAuthDecorator(),
    createUuidPathParam('reportId', 'Report identifier'),
    ApiQuery({
      name: 'format',
      required: false,
      enum: ['pdf', 'csv', 'excel'],
      description: 'Download format',
    }),
    createSuccessResponse(Object as any, 'Report file'),
    createNotFoundError('Report not found'),
  );
}

/**
 * Creates scheduled report schema.
 * Schema for configuring automated report scheduling.
 *
 * @returns Scheduled report schema
 */
export function createScheduledReportSchema() {
  return generateObjectSchema(
    'Scheduled report configuration',
    {
      scheduleId: generateStringSchema('Schedule ID', { format: 'uuid' }),
      reportType: generateEnumSchema(
        ['health-screening', 'immunization', 'nurse-performance', 'compliance'],
        'Report type',
        'string'
      ),
      frequency: generateEnumSchema(['daily', 'weekly', 'monthly', 'quarterly'], 'Report frequency', 'string'),
      parameters: generateObjectSchema('Report parameters', {}, []),
      recipients: generateArraySchema(
        'Email recipients',
        generateStringSchema('Email address', { format: 'email' }),
        { minItems: 1 }
      ),
      enabled: generateBooleanSchema('Schedule enabled', true),
      nextRunDate: generateFormatValidationSchema('date-time', 'Next scheduled run'),
    },
    ['scheduleId', 'reportType', 'frequency', 'recipients']
  );
}

// ============================================================================
// SYSTEM CONFIGURATION APIS (6 functions)
// ============================================================================

/**
 * Creates system configuration schema.
 * Schema for global system configuration settings.
 *
 * @returns System configuration schema
 */
export function createSystemConfigurationSchema() {
  return generateObjectSchema(
    'System configuration settings',
    {
      configId: generateStringSchema('Configuration ID', { format: 'uuid' }),
      category: generateEnumSchema(
        ['general', 'security', 'notifications', 'integrations', 'compliance'],
        'Configuration category',
        'string'
      ),
      settings: generateObjectSchema('Configuration settings', {
        sessionTimeout: generateNumericSchema('Session timeout (minutes)', {
          type: 'integer',
          minimum: 5,
          maximum: 1440,
        }),
        passwordPolicy: generateObjectSchema('Password policy', {
          minLength: generateNumericSchema('Minimum length', { type: 'integer', minimum: 8, maximum: 32 }),
          requireUppercase: generateBooleanSchema('Require uppercase'),
          requireLowercase: generateBooleanSchema('Require lowercase'),
          requireNumbers: generateBooleanSchema('Require numbers'),
          requireSpecialChars: generateBooleanSchema('Require special characters'),
          expirationDays: generateNumericSchema('Expiration days', { type: 'integer', minimum: 30, maximum: 365 }),
        }, []),
        mfaRequired: generateBooleanSchema('Multi-factor authentication required'),
        auditRetentionDays: generateNumericSchema('Audit log retention (days)', {
          type: 'integer',
          minimum: 90,
          maximum: 2555,
        }),
      }, []),
      lastModified: generateFormatValidationSchema('date-time', 'Last modification date'),
      modifiedBy: generateStringSchema('Modified by admin'),
    },
    ['configId', 'category', 'settings', 'lastModified']
  );
}

/**
 * Creates configuration update endpoint decorator.
 * PATCH endpoint for updating system configuration.
 *
 * @returns Decorator for configuration update endpoint
 */
export function createConfigurationUpdateEndpoint() {
  return applyDecorators(
    ApiTags('System Configuration'),
    ApiOperation({
      summary: 'Update system configuration',
      description: 'Update global system configuration settings',
    }),
    createAdminAuthDecorator(['super-admin']),
    createAdminPermissionDecorator(['config:write']),
    createUuidPathParam('configId', 'Configuration identifier'),
    ApiBody({
      description: 'Configuration updates',
      schema: createSystemConfigurationSchema(),
    }),
    createSuccessResponse(Object as any, 'Configuration updated'),
    createBadRequestError('Invalid configuration values'),
  );
}

/**
 * Creates school configuration schema.
 * Schema for individual school settings and preferences.
 *
 * @returns School configuration schema
 */
export function createSchoolConfigurationSchema() {
  return generateObjectSchema(
    'School-specific configuration',
    {
      schoolId: generateStringSchema('School ID', { format: 'uuid' }),
      schoolName: generateStringSchema('School name'),
      healthOfficeHours: generateArraySchema(
        'Health office operating hours',
        generateObjectSchema('Operating hours', {
          dayOfWeek: generateEnumSchema(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], 'Day', 'string'),
          openTime: generateStringSchema('Opening time', { example: '08:00' }),
          closeTime: generateStringSchema('Closing time', { example: '15:30' }),
        }, ['dayOfWeek', 'openTime', 'closeTime']),
        {}
      ),
      staffAssignments: generateArraySchema(
        'Assigned health staff',
        generateObjectSchema('Staff assignment', {
          staffId: generateStringSchema('Staff ID', { format: 'uuid' }),
          name: generateStringSchema('Staff name'),
          role: generateEnumSchema(['RN', 'LPN', 'Health-Aide'], 'Role', 'string'),
          schedule: generateStringSchema('Work schedule'),
        }, ['staffId', 'name', 'role']),
        {}
      ),
      screeningSchedule: generateObjectSchema('Annual screening schedule', {
        visionScreening: generateFormatValidationSchema('date', 'Vision screening date'),
        hearingScreening: generateFormatValidationSchema('date', 'Hearing screening date'),
        scoliosisScreening: generateFormatValidationSchema('date', 'Scoliosis screening date'),
        bmiAssessment: generateFormatValidationSchema('date', 'BMI assessment date'),
      }, []),
      emergencyContacts: generateArraySchema(
        'Emergency contacts',
        generateObjectSchema('Emergency contact', {
          name: generateStringSchema('Contact name'),
          role: generateStringSchema('Role/Title'),
          phone: generateStringSchema('Phone number'),
        }, ['name', 'role', 'phone']),
        { minItems: 1 }
      ),
    },
    ['schoolId', 'schoolName']
  );
}

/**
 * Creates facility management schema.
 * Schema for health office facilities and equipment tracking.
 *
 * @returns Facility management schema
 */
export function createFacilityManagementSchema() {
  return generateObjectSchema(
    'Health facility management',
    {
      facilityId: generateStringSchema('Facility ID', { format: 'uuid' }),
      schoolId: generateStringSchema('School ID', { format: 'uuid' }),
      location: generateStringSchema('Health office location'),
      equipment: generateArraySchema(
        'Medical equipment inventory',
        generateObjectSchema('Equipment item', {
          itemId: generateStringSchema('Equipment ID', { format: 'uuid' }),
          name: generateStringSchema('Equipment name'),
          quantity: generateNumericSchema('Quantity', { type: 'integer', minimum: 0 }),
          lastInspection: generateFormatValidationSchema('date', 'Last inspection date'),
          nextInspection: generateFormatValidationSchema('date', 'Next inspection due'),
          status: generateEnumSchema(['operational', 'needs-repair', 'out-of-service'], 'Status', 'string'),
        }, ['itemId', 'name', 'quantity', 'status']),
        {}
      ),
      supplies: generateArraySchema(
        'Medical supplies inventory',
        generateObjectSchema('Supply item', {
          supplyId: generateStringSchema('Supply ID', { format: 'uuid' }),
          name: generateStringSchema('Supply name'),
          currentStock: generateNumericSchema('Current stock', { type: 'integer', minimum: 0 }),
          reorderLevel: generateNumericSchema('Reorder level', { type: 'integer', minimum: 0 }),
          expirationDate: generateFormatValidationSchema('date', 'Expiration date'),
        }, ['supplyId', 'name', 'currentStock']),
        {}
      ),
      capacity: generateObjectSchema('Facility capacity', {
        beds: generateNumericSchema('Number of beds', { type: 'integer', minimum: 0 }),
        restRooms: generateNumericSchema('Rest rooms', { type: 'integer', minimum: 0 }),
        maxOccupancy: generateNumericSchema('Max occupancy', { type: 'integer', minimum: 1 }),
      }, []),
    },
    ['facilityId', 'schoolId', 'location']
  );
}

/**
 * Creates notification configuration schema.
 * Schema for configuring system-wide notifications and alerts.
 *
 * @returns Notification configuration schema
 */
export function createNotificationConfigurationSchema() {
  return generateObjectSchema(
    'Notification configuration',
    {
      configId: generateStringSchema('Config ID', { format: 'uuid' }),
      notificationType: generateEnumSchema(
        ['email', 'sms', 'push', 'in-app'],
        'Notification type',
        'string'
      ),
      eventTriggers: generateArraySchema(
        'Events that trigger notifications',
        generateEnumSchema(
          ['medication-due', 'screening-due', 'immunization-due', 'health-alert', 'staff-absence'],
          'Event trigger',
          'string'
        ),
        { minItems: 1 }
      ),
      recipients: generateObjectSchema('Recipient configuration', {
        roles: generateArraySchema('Recipient roles', generateStringSchema('Role'), {}),
        specificUsers: generateArraySchema('Specific users', generateStringSchema('User ID', { format: 'uuid' }), {}),
      }, []),
      template: generateStringSchema('Notification template'),
      enabled: generateBooleanSchema('Notifications enabled', true),
    },
    ['configId', 'notificationType', 'eventTriggers', 'enabled']
  );
}

/**
 * Creates configuration retrieval endpoint decorator.
 * GET endpoint for retrieving system configuration.
 *
 * @returns Decorator for configuration retrieval
 */
export function createConfigurationRetrievalEndpoint() {
  return applyDecorators(
    ApiTags('System Configuration'),
    ApiOperation({
      summary: 'Get system configuration',
      description: 'Retrieve current system configuration settings',
    }),
    createAdminAuthDecorator(),
    ApiQuery({
      name: 'category',
      required: false,
      enum: ['general', 'security', 'notifications', 'integrations', 'compliance'],
      description: 'Filter by configuration category',
    }),
    createSuccessResponse(Object as any, 'Configuration retrieved'),
  );
}

// ============================================================================
// USER MANAGEMENT APIS (7 functions)
// ============================================================================

/**
 * Creates user account schema.
 * Schema for user account creation and management.
 *
 * @returns User account schema
 */
export function createUserAccountSchema() {
  return generateObjectSchema(
    'User account information',
    {
      userId: generateStringSchema('User ID', { format: 'uuid' }),
      username: generateStringSchema('Username', {
        minLength: 3,
        maxLength: 50,
        example: 'john.doe@school.edu',
      }),
      email: generateFormatValidationSchema('email', 'Email address', {
        example: 'john.doe@school.edu',
      }),
      firstName: generateStringSchema('First name'),
      lastName: generateStringSchema('Last name'),
      role: generateEnumSchema(
        ['super-admin', 'admin', 'district-admin', 'school-admin', 'nurse', 'health-aide', 'teacher', 'parent'],
        'User role',
        'string'
      ),
      permissions: generateArraySchema(
        'User permissions',
        generateStringSchema('Permission'),
        { minItems: 0 }
      ),
      status: generateEnumSchema(['active', 'inactive', 'suspended', 'locked'], 'Account status', 'string'),
      schools: generateArraySchema(
        'Assigned schools',
        generateStringSchema('School ID', { format: 'uuid' }),
        { minItems: 0 }
      ),
      createdAt: generateFormatValidationSchema('date-time', 'Account creation date'),
      lastLogin: generateFormatValidationSchema('date-time', 'Last login date'),
      mfaEnabled: generateBooleanSchema('MFA enabled', false),
    },
    ['userId', 'username', 'email', 'firstName', 'lastName', 'role', 'status']
  );
}

/**
 * Creates user creation endpoint decorator.
 * POST endpoint for creating new user accounts.
 *
 * @returns Decorator for user creation endpoint
 */
export function createUserCreationEndpoint() {
  return applyDecorators(
    ApiTags('User Management'),
    ApiOperation({
      summary: 'Create user account',
      description: 'Create new user account with role and permissions',
    }),
    createAdminAuthDecorator(['super-admin', 'admin']),
    createAdminPermissionDecorator(['users:create']),
    ApiBody({
      description: 'User account data',
      schema: createUserAccountSchema(),
    }),
    createCreatedResponse(Object as any, 'User account created'),
    createBadRequestError('Invalid user data or username already exists'),
  );
}

/**
 * Creates user update endpoint decorator.
 * PATCH endpoint for updating user accounts.
 *
 * @returns Decorator for user update endpoint
 */
export function createUserUpdateEndpoint() {
  return applyDecorators(
    ApiTags('User Management'),
    ApiOperation({
      summary: 'Update user account',
      description: 'Update existing user account information',
    }),
    createAdminAuthDecorator(['super-admin', 'admin']),
    createAdminPermissionDecorator(['users:update']),
    createUuidPathParam('userId', 'User identifier'),
    createSuccessResponse(Object as any, 'User account updated'),
    createNotFoundError('User not found'),
  );
}

/**
 * Creates user retrieval endpoint decorator.
 * GET endpoint for retrieving user accounts with filtering.
 *
 * @returns Decorator for user retrieval endpoint
 */
export function createUserRetrievalEndpoint() {
  return applyDecorators(
    ApiTags('User Management'),
    ApiOperation({
      summary: 'Get user accounts',
      description: 'Retrieve user accounts with filtering and pagination',
    }),
    createAdminAuthDecorator(),
    createSearchQueryParam(['username', 'email', 'firstName', 'lastName'], 2),
    createFilterQueryParams({
      role: { type: 'string' },
      status: { type: 'string', enum: ['active', 'inactive', 'suspended'] },
      schoolId: { type: 'string' },
    }),
    createPaginationQueryParams(1, 20, 100),
    createSortingQueryParams(['lastName', 'createdAt', 'lastLogin'], 'lastName'),
    createOffsetPaginatedResponse(Object as any, 'Paginated users'),
  );
}

/**
 * Creates role assignment schema.
 * Schema for managing user roles and permissions.
 *
 * @returns Role assignment schema
 */
export function createRoleAssignmentSchema() {
  return generateObjectSchema(
    'Role assignment',
    {
      userId: generateStringSchema('User ID', { format: 'uuid' }),
      role: generateEnumSchema(
        ['super-admin', 'admin', 'district-admin', 'school-admin', 'nurse', 'health-aide'],
        'Role to assign',
        'string'
      ),
      permissions: generateArraySchema(
        'Additional permissions',
        generateStringSchema('Permission'),
        { minItems: 0 }
      ),
      schools: generateArraySchema(
        'School assignments',
        generateStringSchema('School ID', { format: 'uuid' }),
        { minItems: 0 }
      ),
      effectiveDate: generateFormatValidationSchema('date-time', 'Effective date'),
      expirationDate: generateFormatValidationSchema('date-time', 'Expiration date'),
      assignedBy: generateStringSchema('Admin assigning role'),
    },
    ['userId', 'role', 'effectiveDate', 'assignedBy']
  );
}

/**
 * Creates user deactivation endpoint decorator.
 * DELETE endpoint for deactivating user accounts.
 *
 * @returns Decorator for user deactivation endpoint
 */
export function createUserDeactivationEndpoint() {
  return applyDecorators(
    ApiTags('User Management'),
    ApiOperation({
      summary: 'Deactivate user account',
      description: 'Deactivate or suspend user account',
    }),
    createAdminAuthDecorator(['super-admin', 'admin']),
    createAdminPermissionDecorator(['users:deactivate']),
    createUuidPathParam('userId', 'User identifier'),
    ApiBody({
      description: 'Deactivation details',
      schema: generateObjectSchema('Deactivation request', {
        reason: generateStringSchema('Deactivation reason'),
        permanent: generateBooleanSchema('Permanent deactivation'),
      }, ['reason']),
    }),
    createNoContentResponse('User account deactivated'),
    createNotFoundError('User not found'),
  );
}

/**
 * Creates bulk user operations schema.
 * Schema for bulk user management operations.
 *
 * @returns Bulk operations schema
 */
export function createBulkUserOperationsSchema() {
  return generateObjectSchema(
    'Bulk user operations',
    {
      operationType: generateEnumSchema(
        ['create', 'update', 'deactivate', 'assign-role', 'reset-password'],
        'Operation type',
        'string'
      ),
      userIds: generateArraySchema(
        'User IDs to operate on',
        generateStringSchema('User ID', { format: 'uuid' }),
        { minItems: 1, maxItems: 1000 }
      ),
      operationData: generateObjectSchema('Operation-specific data', {}, []),
      performedBy: generateStringSchema('Admin performing operation'),
      timestamp: generateFormatValidationSchema('date-time', 'Operation timestamp'),
    },
    ['operationType', 'userIds', 'performedBy']
  );
}

// ============================================================================
// AUDIT LOG APIS (5 functions)
// ============================================================================

/**
 * Creates audit log entry schema.
 * Schema for comprehensive audit logging.
 *
 * @returns Audit log schema
 */
export function createAuditLogSchema() {
  return generateObjectSchema(
    'Audit log entry',
    {
      logId: generateStringSchema('Log entry ID', { format: 'uuid' }),
      timestamp: generateFormatValidationSchema('date-time', 'Event timestamp'),
      userId: generateStringSchema('User ID', { format: 'uuid' }),
      username: generateStringSchema('Username'),
      action: generateEnumSchema(
        ['create', 'read', 'update', 'delete', 'login', 'logout', 'config-change', 'permission-change'],
        'Action performed',
        'string'
      ),
      resource: generateStringSchema('Resource affected', { example: 'User' }),
      resourceId: generateStringSchema('Resource ID'),
      changes: generateObjectSchema('Changes made', {
        before: generateObjectSchema('Before state', {}, []),
        after: generateObjectSchema('After state', {}, []),
      }, []),
      ipAddress: generateStringSchema('IP address', { example: '192.168.1.100' }),
      userAgent: generateStringSchema('User agent string'),
      status: generateEnumSchema(['success', 'failure', 'partial'], 'Operation status', 'string'),
      errorMessage: generateStringSchema('Error message if failed'),
    },
    ['logId', 'timestamp', 'userId', 'action', 'resource', 'status']
  );
}

/**
 * Creates audit log query endpoint decorator.
 * GET endpoint for querying audit logs with advanced filtering.
 *
 * @returns Decorator for audit log query endpoint
 */
export function createAuditLogQueryEndpoint() {
  return applyDecorators(
    ApiTags('Audit Logs'),
    ApiOperation({
      summary: 'Query audit logs',
      description: 'Retrieve audit logs with comprehensive filtering and pagination',
    }),
    createAdminAuthDecorator(),
    createAdminPermissionDecorator(['audit:read']),
    createDateRangeQueryParams('startDate', 'endDate', 'date-time'),
    createFilterQueryParams({
      userId: { type: 'string' },
      action: { type: 'string' },
      resource: { type: 'string' },
      status: { type: 'string', enum: ['success', 'failure', 'partial'] },
    }),
    createSearchQueryParam(['username', 'resource', 'resourceId'], 2),
    createPaginationQueryParams(1, 50, 500),
    createSortingQueryParams(['timestamp', 'action', 'username'], 'timestamp'),
    createOffsetPaginatedResponse(Object as any, 'Paginated audit logs'),
  );
}

/**
 * Creates audit log export endpoint decorator.
 * GET endpoint for exporting audit logs to CSV.
 *
 * @returns Decorator for audit log export
 */
export function createAuditLogExportEndpoint() {
  return applyDecorators(
    ApiTags('Audit Logs'),
    ApiOperation({
      summary: 'Export audit logs',
      description: 'Export audit logs to CSV for compliance reporting',
    }),
    createAdminAuthDecorator(['super-admin', 'admin']),
    createAdminPermissionDecorator(['audit:export']),
    createDateRangeQueryParams('startDate', 'endDate', 'date-time'),
    createCsvExportResponse('Audit log export', 'audit-logs.csv'),
  );
}

/**
 * Creates security event schema.
 * Schema for critical security events requiring immediate attention.
 *
 * @returns Security event schema
 */
export function createSecurityEventSchema() {
  return generateObjectSchema(
    'Security event',
    {
      eventId: generateStringSchema('Event ID', { format: 'uuid' }),
      timestamp: generateFormatValidationSchema('date-time', 'Event timestamp'),
      severity: generateEnumSchema(['low', 'medium', 'high', 'critical'], 'Severity level', 'string'),
      eventType: generateEnumSchema(
        ['failed-login', 'permission-escalation', 'data-breach-attempt', 'unauthorized-access', 'config-tampering'],
        'Event type',
        'string'
      ),
      userId: generateStringSchema('User ID'),
      ipAddress: generateStringSchema('IP address'),
      description: generateStringSchema('Event description'),
      affectedResources: generateArraySchema(
        'Affected resources',
        generateStringSchema('Resource'),
        {}
      ),
      mitigationStatus: generateEnumSchema(
        ['detected', 'investigating', 'mitigated', 'resolved'],
        'Mitigation status',
        'string'
      ),
      notifiedParties: generateArraySchema(
        'Notified parties',
        generateStringSchema('Party'),
        {}
      ),
    },
    ['eventId', 'timestamp', 'severity', 'eventType', 'description']
  );
}

/**
 * Creates security event endpoint decorator.
 * GET endpoint for retrieving critical security events.
 *
 * @returns Decorator for security event endpoint
 */
export function createSecurityEventEndpoint() {
  return applyDecorators(
    ApiTags('Audit Logs'),
    ApiOperation({
      summary: 'Get security events',
      description: 'Retrieve critical security events requiring attention',
    }),
    createAdminAuthDecorator(['super-admin']),
    createAdminPermissionDecorator(['security:read']),
    createDateRangeQueryParams('startDate', 'endDate', 'date-time'),
    ApiQuery({
      name: 'severity',
      required: false,
      enum: ['low', 'medium', 'high', 'critical'],
      description: 'Filter by severity',
    }),
    createOffsetPaginatedResponse(Object as any, 'Security events'),
  );
}

// ============================================================================
// COMPLIANCE REPORTING (5 functions)
// ============================================================================

/**
 * Creates HIPAA compliance report schema.
 * Schema for HIPAA compliance documentation and reporting.
 *
 * @returns HIPAA compliance schema
 */
export function createHIPAAComplianceSchema() {
  return generateObjectSchema(
    'HIPAA compliance report',
    {
      reportId: generateStringSchema('Report ID', { format: 'uuid' }),
      reportDate: generateFormatValidationSchema('date-time', 'Report date'),
      reportingPeriod: generateObjectSchema('Reporting period', {
        startDate: generateFormatValidationSchema('date', 'Period start'),
        endDate: generateFormatValidationSchema('date', 'Period end'),
      }, ['startDate', 'endDate']),
      accessControls: generateObjectSchema('Access controls assessment', {
        uniqueUserIdentification: generateBooleanSchema('Unique user IDs implemented'),
        emergencyAccessProcedures: generateBooleanSchema('Emergency access procedures'),
        automaticLogoff: generateBooleanSchema('Automatic logoff implemented'),
        encryptionDecryption: generateBooleanSchema('Encryption/decryption implemented'),
      }, []),
      auditControls: generateObjectSchema('Audit controls', {
        hardwareSystemActivity: generateBooleanSchema('Hardware/system activity logged'),
        softwareActivityReviewed: generateBooleanSchema('Software activity reviewed'),
        auditReports: generateNumericSchema('Audit reports generated', { type: 'integer', minimum: 0 }),
      }, []),
      transmissionSecurity: generateObjectSchema('Transmission security', {
        integrityControls: generateBooleanSchema('Integrity controls implemented'),
        encryption: generateBooleanSchema('Transmission encryption implemented'),
      }, []),
      violations: generateArraySchema(
        'Compliance violations',
        generateObjectSchema('Violation', {
          date: generateFormatValidationSchema('date-time', 'Violation date'),
          type: generateStringSchema('Violation type'),
          description: generateStringSchema('Violation description'),
          remediated: generateBooleanSchema('Remediated'),
        }, ['date', 'type', 'description', 'remediated']),
        {}
      ),
    },
    ['reportId', 'reportDate', 'reportingPeriod']
  );
}

/**
 * Creates FERPA compliance schema.
 * Schema for FERPA (Family Educational Rights and Privacy Act) compliance.
 *
 * @returns FERPA compliance schema
 */
export function createFERPAComplianceSchema() {
  return generateObjectSchema(
    'FERPA compliance report',
    {
      reportId: generateStringSchema('Report ID', { format: 'uuid' }),
      reportDate: generateFormatValidationSchema('date-time', 'Report date'),
      parentalConsent: generateObjectSchema('Parental consent tracking', {
        totalConsentsRequired: generateNumericSchema('Total consents required', { type: 'integer', minimum: 0 }),
        consentsObtained: generateNumericSchema('Consents obtained', { type: 'integer', minimum: 0 }),
        consentRate: generateNumericSchema('Consent rate (%)', { type: 'number', minimum: 0, maximum: 100 }),
      }, []),
      disclosureTracking: generateObjectSchema('Disclosure tracking', {
        totalDisclosures: generateNumericSchema('Total disclosures', { type: 'integer', minimum: 0 }),
        authorizedDisclosures: generateNumericSchema('Authorized disclosures', { type: 'integer', minimum: 0 }),
        unauthorizedAttempts: generateNumericSchema('Unauthorized attempts', { type: 'integer', minimum: 0 }),
      }, []),
      recordAccessRequests: generateObjectSchema('Record access requests', {
        totalRequests: generateNumericSchema('Total requests', { type: 'integer', minimum: 0 }),
        fulfilled: generateNumericSchema('Fulfilled requests', { type: 'integer', minimum: 0 }),
        denied: generateNumericSchema('Denied requests', { type: 'integer', minimum: 0 }),
        averageResponseTime: generateNumericSchema('Avg response time (days)', { type: 'number', minimum: 0 }),
      }, []),
    },
    ['reportId', 'reportDate']
  );
}

/**
 * Creates compliance dashboard endpoint decorator.
 * GET endpoint for compliance dashboard metrics.
 *
 * @returns Decorator for compliance dashboard
 */
export function createComplianceDashboardEndpoint() {
  return applyDecorators(
    ApiTags('Compliance Reporting'),
    ApiOperation({
      summary: 'Get compliance dashboard',
      description: 'Retrieve compliance metrics and status dashboard',
    }),
    createAdminAuthDecorator(),
    createAdminPermissionDecorator(['compliance:read']),
    createSuccessResponse(Object as any, 'Compliance dashboard data'),
  );
}

/**
 * Creates compliance export endpoint decorator.
 * GET endpoint for exporting compliance reports.
 *
 * @returns Decorator for compliance export
 */
export function createComplianceExportEndpoint() {
  return applyDecorators(
    ApiTags('Compliance Reporting'),
    ApiOperation({
      summary: 'Export compliance report',
      description: 'Export compliance documentation in various formats',
    }),
    createAdminAuthDecorator(['super-admin', 'admin']),
    createAdminPermissionDecorator(['compliance:export']),
    ApiQuery({
      name: 'reportType',
      required: true,
      enum: ['hipaa', 'ferpa', 'immunization', 'screening'],
      description: 'Compliance report type',
    }),
    ApiQuery({
      name: 'format',
      required: false,
      enum: ['pdf', 'excel'],
      description: 'Export format',
    }),
    createDateRangeQueryParams('startDate', 'endDate', 'date'),
    createSuccessResponse(Object as any, 'Compliance report file'),
  );
}

// ============================================================================
// DASHBOARD AND METRICS (4 functions)
// ============================================================================

/**
 * Creates admin dashboard metrics schema.
 * Real-time metrics for administrative dashboard.
 *
 * @returns Dashboard metrics schema
 */
export function createAdminDashboardMetricsSchema() {
  return generateObjectSchema(
    'Admin dashboard metrics',
    {
      timestamp: generateFormatValidationSchema('date-time', 'Metrics timestamp'),
      summary: generateObjectSchema('Summary metrics', {
        totalStudents: generateNumericSchema('Total students', { type: 'integer', minimum: 0 }),
        totalStaff: generateNumericSchema('Total staff', { type: 'integer', minimum: 0 }),
        activeUsers: generateNumericSchema('Active users (24h)', { type: 'integer', minimum: 0 }),
        pendingTasks: generateNumericSchema('Pending tasks', { type: 'integer', minimum: 0 }),
      }, []),
      healthMetrics: generateObjectSchema('Health metrics', {
        clinicVisitsToday: generateNumericSchema('Clinic visits today', { type: 'integer', minimum: 0 }),
        medicationsAdministered: generateNumericSchema('Medications administered', { type: 'integer', minimum: 0 }),
        immunizationCompliance: generateNumericSchema('Immunization compliance (%)', {
          type: 'number',
          minimum: 0,
          maximum: 100,
        }),
        screeningsDue: generateNumericSchema('Screenings due', { type: 'integer', minimum: 0 }),
      }, []),
      alerts: generateArraySchema(
        'Active alerts',
        generateObjectSchema('Alert', {
          alertId: generateStringSchema('Alert ID', { format: 'uuid' }),
          type: generateEnumSchema(['critical', 'warning', 'info'], 'Alert type', 'string'),
          message: generateStringSchema('Alert message'),
          timestamp: generateFormatValidationSchema('date-time', 'Alert timestamp'),
        }, ['alertId', 'type', 'message', 'timestamp']),
        {}
      ),
    },
    ['timestamp', 'summary']
  );
}

/**
 * Creates dashboard endpoint decorator.
 * GET endpoint for admin dashboard data.
 *
 * @returns Decorator for dashboard endpoint
 */
export function createDashboardEndpoint() {
  return applyDecorators(
    ApiTags('Dashboard'),
    ApiOperation({
      summary: 'Get admin dashboard',
      description: 'Retrieve real-time dashboard metrics and alerts',
    }),
    createAdminAuthDecorator(),
    createSuccessResponse(Object as any, 'Dashboard data'),
  );
}

/**
 * Creates analytics query endpoint decorator.
 * POST endpoint for custom analytics queries.
 *
 * @returns Decorator for analytics query
 */
export function createAnalyticsQueryEndpoint() {
  return applyDecorators(
    ApiTags('Dashboard'),
    ApiOperation({
      summary: 'Run analytics query',
      description: 'Execute custom analytics query for reporting',
    }),
    createAdminAuthDecorator(),
    createAdminPermissionDecorator(['analytics:query']),
    ApiBody({
      description: 'Analytics query parameters',
      schema: generateObjectSchema('Analytics query', {
        queryType: generateEnumSchema(
          ['trend', 'distribution', 'comparison', 'correlation'],
          'Query type',
          'string'
        ),
        metrics: generateArraySchema('Metrics to analyze', generateStringSchema('Metric'), { minItems: 1 }),
        dimensions: generateArraySchema('Analysis dimensions', generateStringSchema('Dimension'), {}),
        filters: generateObjectSchema('Query filters', {}, []),
        dateRange: generateObjectSchema('Date range', {
          startDate: generateFormatValidationSchema('date', 'Start date'),
          endDate: generateFormatValidationSchema('date', 'End date'),
        }, ['startDate', 'endDate']),
      }, ['queryType', 'metrics', 'dateRange']),
    }),
    createSuccessResponse(Object as any, 'Analytics results'),
  );
}

/**
 * Creates dashboard widget configuration schema.
 * Schema for customizing dashboard widgets.
 *
 * @returns Widget configuration schema
 */
export function createDashboardWidgetSchema() {
  return generateObjectSchema(
    'Dashboard widget configuration',
    {
      widgetId: generateStringSchema('Widget ID', { format: 'uuid' }),
      widgetType: generateEnumSchema(
        ['metric', 'chart', 'table', 'alert-list', 'activity-feed'],
        'Widget type',
        'string'
      ),
      title: generateStringSchema('Widget title'),
      position: generateObjectSchema('Widget position', {
        x: generateNumericSchema('X position', { type: 'integer', minimum: 0 }),
        y: generateNumericSchema('Y position', { type: 'integer', minimum: 0 }),
        width: generateNumericSchema('Width', { type: 'integer', minimum: 1, maximum: 12 }),
        height: generateNumericSchema('Height', { type: 'integer', minimum: 1 }),
      }, ['x', 'y', 'width', 'height']),
      configuration: generateObjectSchema('Widget-specific configuration', {}, []),
      refreshInterval: generateNumericSchema('Refresh interval (seconds)', {
        type: 'integer',
        minimum: 10,
        maximum: 3600,
      }),
      visible: generateBooleanSchema('Widget visible', true),
    },
    ['widgetId', 'widgetType', 'title', 'position']
  );
}
