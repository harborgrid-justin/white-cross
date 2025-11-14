import { DocumentBuilder } from '@nestjs/swagger';
import {
  ErrorResponseDto,
  ValidationErrorResponseDto,
  ValidationErrorDetailDto,
  BusinessErrorResponseDto,
  HealthcareErrorResponseDto,
  SecurityErrorResponseDto,
  SystemErrorResponseDto,
  DatabaseErrorResponseDto,
} from '../dto/error-response.dto';

// ============================================================================
// Phase 2 Response DTO Imports
// ============================================================================

// Core Domain Response DTOs
import {
  StudentResponseDto,
  StudentDetailResponseDto,
  PaginatedStudentResponseDto,
} from '../../services/student/dto/student-response.dto';
import {
  AppointmentResponseDto,
  AppointmentDetailResponseDto,
  PaginatedAppointmentResponseDto,
} from '../../services/appointment/dto/appointment-response.dto';
import {
  MedicationResponseDto,
  MedicationDetailResponseDto,
  PaginatedMedicationResponseDto,
} from '../../services/medication/dto/medication-response.dto';
import {
  HealthRecordResponseDto,
  HealthRecordDetailResponseDto,
  PaginatedHealthRecordResponseDto,
} from '../../health-record/dto/health-record-response.dto';
import {
  VaccinationResponseDto,
  VaccinationDetailResponseDto,
  PaginatedVaccinationResponseDto,
} from '../../health-record/vaccination/dto/vaccination-response.dto';
import {
  AllergyResponseDto,
  AllergyDetailResponseDto,
  PaginatedAllergyResponseDto,
} from '../../health-record/allergy/dto/allergy-response.dto';

// Supporting Domain Response DTOs
import { UserResponseDto } from '../../services/user/dto/user-response.dto';
import { AuthResponseDto } from '../../services/auth/dto/auth-response.dto';
import { ApiKeyResponseDto } from '../../api-key-auth/dto/api-key-response.dto';
import { EmergencyBroadcastResponseDto } from '../../services/communication/emergency-broadcast/dto/emergency-broadcast-response.dto';
import { EmergencyTemplateResponseDto } from '../../services/communication/emergency-broadcast/dto/emergency-template-response.dto';
import { BroadcastStatusResponseDto } from '../../services/communication/emergency-broadcast/dto/broadcast-status-response.dto';
import { SendBroadcastResponseDto } from '../../services/communication/emergency-broadcast/dto/send-broadcast-response.dto';

// Common Response DTOs
import { PaginatedResponseDto } from '../dto/paginated-response.dto';

/**
 * Swagger API Documentation Configuration
 * Separated from main.ts to keep the bootstrap file manageable
 */
export function createSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('White Cross School Health API')
    .setDescription(
      'Comprehensive HIPAA-compliant API for school health management systems. ' +
        'Provides complete student health record management, medication tracking, ' +
        'vaccination monitoring, allergy management, chronic condition tracking, ' +
        'appointment scheduling, incident reporting, analytics, and administrative functions.\n\n' +
        '## API Versioning\n' +
        'This API uses **URI-based versioning** for safe evolution and backward compatibility.\n' +
        '- **Current Version:** v1\n' +
        '- **Base URL Pattern:** `/api/{version}/{resource}`\n' +
        '- **Example:** `POST /api/v1/students`\n' +
        '- **Health Checks:** Unversioned at `/health` for Kubernetes probe compatibility\n\n' +
        '### Versioning Strategy\n' +
        '- Major version changes indicate breaking changes\n' +
        '- We maintain at least 2 major versions during transition periods\n' +
        '- Deprecation notices include sunset dates and migration guides\n' +
        '- See [API Versioning Guidelines](/docs/versioning-guidelines.md) for details\n\n' +
        '## Base URL\n' +
        'All API endpoints are prefixed with `/api/v1/` for version 1.\n' +
        'Example: `POST /api/v1/students`\n\n' +
        '## Authentication\n' +
        'All API endpoints require Bearer token authentication except for public endpoints like health checks and authentication endpoints.\n\n' +
        '## Rate Limiting\n' +
        'API requests are rate limited using Redis-backed distributed rate limiting:\n' +
        '- Short burst: 10 requests/second (100 in development)\n' +
        '- Medium burst: 50 requests/10 seconds (500 in development)\n' +
        '- Long window: 100 requests/minute (1000 in development)\n' +
        'Rate limit information is returned in response headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset\n\n' +
        '## Response Format\n' +
        'All successful responses follow a standard envelope format:\n' +
        '```json\n' +
        '{\n' +
        '  "success": true,\n' +
        '  "data": { /* response data */ },\n' +
        '  "timestamp": "2025-11-07T02:00:00.000Z",\n' +
        '  "pagination": { /* only for paginated endpoints */ }\n' +
        '}\n' +
        '```\n\n' +
        '## Compression\n' +
        'API responses are compressed using gzip/brotli to reduce bandwidth usage.\n\n' +
        '## HIPAA Compliance\n' +
        'This API handles Protected Health Information (PHI) and is designed to be HIPAA compliant. ' +
        'All data access is logged for audit purposes.\n\n' +
        '## Error Handling\n' +
        'The API uses standard HTTP status codes and returns detailed error messages in JSON format.',
    )
    .setVersion('1.0')
    .setContact(
      'White Cross Support',
      'https://whitecross.health',
      'support@whitecross.health',
    )
    .setLicense('Proprietary', 'https://whitecross.health/license')
    .setTermsOfService('https://whitecross.health/terms')
    .addServer('http://localhost:3001/api/v1', 'Development server (v1)')
    .addServer('https://api.whitecross.health/api/v1', 'Production server (v1)')

    // Core Modules
    .addTag(
      'Authentication',
      'User authentication, registration, login, and token management',
      {
        externalDocs: {
          description: 'Authentication API Documentation',
          url: 'https://docs.whitecross.health/api/authentication',
        },
      },
    )
    .addTag(
      'students',
      'Student profile management, enrollment, and demographics',
      {
        externalDocs: {
          description: 'Students API Documentation',
          url: 'https://docs.whitecross.health/api/students',
        },
      },
    )
    .addTag('Users', 'User account management and profile administration', {
      externalDocs: {
        description: 'Users API Documentation',
        url: 'https://docs.whitecross.health/api/users',
      },
    })

    // Health Management
    .addTag('Health Records', 'Comprehensive student health record management', {
      externalDocs: {
        description: 'Health Records API Documentation',
        url: 'https://docs.whitecross.health/api/health-records',
      },
    })
    .addTag(
      'Allergies',
      'Allergy tracking, safety checks, and critical allergy alerts',
      {
        externalDocs: {
          description: 'Allergies API Documentation',
          url: 'https://docs.whitecross.health/api/allergies',
        },
      },
    )
    .addTag(
      'Chronic Conditions',
      'Chronic condition management and treatment plans',
      {
        externalDocs: {
          description: 'Chronic Conditions API Documentation',
          url: 'https://docs.whitecross.health/api/chronic-conditions',
        },
      },
    )
    .addTag(
      'Vaccinations',
      'Immunization tracking and CDC-compliant vaccination schedules',
      {
        externalDocs: {
          description: 'Vaccinations API Documentation',
          url: 'https://docs.whitecross.health/api/vaccinations',
        },
      },
    )
    .addTag(
      'Vital Signs',
      'Vital signs monitoring, trends, and health assessments',
      {
        externalDocs: {
          description: 'Vital Signs API Documentation',
          url: 'https://docs.whitecross.health/api/vital-signs',
        },
      },
    )

    // Clinical Services
    .addTag(
      'Clinical',
      'Clinical services including drug interactions and clinic visits',
      {
        externalDocs: {
          description: 'Clinical API Documentation',
          url: 'https://docs.whitecross.health/api/clinical',
        },
      },
    )
    .addTag('Appointments', 'Appointment scheduling and calendar management', {
      externalDocs: {
        description: 'Appointments API Documentation',
        url: 'https://docs.whitecross.health/api/appointments',
      },
    })
    .addTag('Incident Reports', 'Health incident documentation and reporting', {
      externalDocs: {
        description: 'Incident Reports API Documentation',
        url: 'https://docs.whitecross.health/api/incident-reports',
      },
    })

    // Medication Management
    .addTag('medications', 'Medication formulary management', {
      externalDocs: {
        description: 'Medications API Documentation',
        url: 'https://docs.whitecross.health/api/medications',
      },
    })
    .addTag('administration', 'Medication administration records (MAR)', {
      externalDocs: {
        description: 'Medication Administration API Documentation',
        url: 'https://docs.whitecross.health/api/medication-administration',
      },
    })
    .addTag('inventory', 'Medication inventory and stock management', {
      externalDocs: {
        description: 'Medication Inventory API Documentation',
        url: 'https://docs.whitecross.health/api/medication-inventory',
      },
    })
    .addTag('adverse-reactions', 'Adverse drug reaction reporting', {
      externalDocs: {
        description: 'Adverse Reactions API Documentation',
        url: 'https://docs.whitecross.health/api/adverse-reactions',
      },
    })
    .addTag(
      'controlled-substances',
      'DEA-compliant controlled substance logging',
      {
        externalDocs: {
          description: 'Controlled Substances API Documentation',
          url: 'https://docs.whitecross.health/api/controlled-substances',
        },
      },
    )

    // Administrative Functions
    .addTag(
      'Administration',
      'System administration, configuration, and school management',
      {
        externalDocs: {
          description: 'Administration API Documentation',
          url: 'https://docs.whitecross.health/api/administration',
        },
      },
    )
    .addTag('Access Control', 'Role-based access control and permissions', {
      externalDocs: {
        description: 'Access Control API Documentation',
        url: 'https://docs.whitecross.health/api/access-control',
      },
    })
    .addTag('Audit', 'Audit logging and compliance tracking', {
      externalDocs: {
        description: 'Audit API Documentation',
        url: 'https://docs.whitecross.health/api/audit',
      },
    })
    .addTag('Compliance', 'Regulatory compliance and HIPAA controls', {
      externalDocs: {
        description: 'Compliance API Documentation',
        url: 'https://docs.whitecross.health/api/compliance',
      },
    })
    .addTag('Security', 'Security events, incidents, and IP restrictions', {
      externalDocs: {
        description: 'Security API Documentation',
        url: 'https://docs.whitecross.health/api/security',
      },
    })

    // Operational Modules
    .addTag('Analytics', 'Analytics, reporting, and data insights', {
      externalDocs: {
        description: 'Analytics API Documentation',
        url: 'https://docs.whitecross.health/api/analytics',
      },
    })
    .addTag('Reports', 'Report generation and scheduled reporting', {
      externalDocs: {
        description: 'Reports API Documentation',
        url: 'https://docs.whitecross.health/api/reports',
      },
    })
    .addTag('Budget', 'Budget management and financial tracking', {
      externalDocs: {
        description: 'Budget API Documentation',
        url: 'https://docs.whitecross.health/api/budget',
      },
    })
    .addTag('Contacts', 'Emergency contacts and parent/guardian management', {
      externalDocs: {
        description: 'Contacts API Documentation',
        url: 'https://docs.whitecross.health/api/contacts',
      },
    })
    .addTag('Documents', 'Document management and file storage', {
      externalDocs: {
        description: 'Documents API Documentation',
        url: 'https://docs.whitecross.health/api/documents',
      },
    })

    // Integration & Communication
    .addTag('Integration', 'Third-party integrations and SIS connectors', {
      externalDocs: {
        description: 'Integration API Documentation',
        url: 'https://docs.whitecross.health/api/integration',
      },
    })
    .addTag('Communication', 'Multi-channel communication and notifications', {
      externalDocs: {
        description: 'Communication API Documentation',
        url: 'https://docs.whitecross.health/api/communication',
      },
    })
    .addTag('Mobile', 'Mobile device management, sync, and push notifications', {
      externalDocs: {
        description: 'Mobile API Documentation',
        url: 'https://docs.whitecross.health/api/mobile',
      },
    })

    // Utilities
    .addTag('PDF Generation', 'PDF document generation and printing', {
      externalDocs: {
        description: 'PDF Generation API Documentation',
        url: 'https://docs.whitecross.health/api/pdf-generation',
      },
    })

    // Advanced Features (to be implemented)
    .addTag('Academic Transcript', 'Academic records and transcript management', {
      externalDocs: {
        description: 'Academic Transcript API Documentation',
        url: 'https://docs.whitecross.health/api/academic-transcript',
      },
    })
    .addTag('AI Search', 'Intelligent search with vector embeddings', {
      externalDocs: {
        description: 'AI Search API Documentation',
        url: 'https://docs.whitecross.health/api/ai-search',
      },
    })
    .addTag('Alerts', 'Real-time alert system and notification management', {
      externalDocs: {
        description: 'Alerts API Documentation',
        url: 'https://docs.whitecross.health/api/alerts',
      },
    })
    .addTag('Features', 'Enterprise feature flags and advanced capabilities', {
      externalDocs: {
        description: 'Features API Documentation',
        url: 'https://docs.whitecross.health/api/features',
      },
    })
    .addTag('Health Domain', 'Health domain business logic and workflows', {
      externalDocs: {
        description: 'Health Domain API Documentation',
        url: 'https://docs.whitecross.health/api/health-domain',
      },
    })

    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description:
        'Enter JWT token obtained from /auth/login or /auth/register',
      name: 'Authorization',
      in: 'header',
    })
    .addGlobalParameters({
      name: 'X-Request-ID',
      in: 'header',
      description: 'Optional request ID for tracking',
      required: false,
      schema: {
        type: 'string',
        format: 'uuid',
      },
    })
    .addGlobalParameters({
      name: 'page',
      in: 'query',
      description: 'Page number for pagination (default: 1)',
      required: false,
      schema: {
        type: 'number',
        minimum: 1,
        default: 1,
      },
    })
    .addGlobalParameters({
      name: 'limit',
      in: 'query',
      description: 'Number of items per page (default: 20, max: 100)',
      required: false,
      schema: {
        type: 'number',
        minimum: 1,
        maximum: 100,
        default: 20,
      },
    })
    .build();
}

/**
 * Export Error Response DTOs for use with SwaggerModule extraModels
 * These DTOs provide comprehensive error documentation for all API endpoints
 */
export const ERROR_RESPONSE_DTOS = [
  ErrorResponseDto,
  ValidationErrorResponseDto,
  ValidationErrorDetailDto,
  BusinessErrorResponseDto,
  HealthcareErrorResponseDto,
  SecurityErrorResponseDto,
  SystemErrorResponseDto,
  DatabaseErrorResponseDto,
];

/**
 * Export Phase 2 Domain Response DTOs for Swagger schema registration
 *
 * These DTOs represent comprehensive response schemas for all major domains
 * with full Swagger/OpenAPI documentation including:
 * - Detailed field descriptions and examples
 * - Nested association objects
 * - Pagination support
 * - HIPAA compliance documentation
 * - Type safety with enums and validation
 *
 * Usage: Register with SwaggerModule.createDocument extraModels option
 *
 * @see https://docs.nestjs.com/openapi/types-and-parameters#extra-models
 */
export const PHASE_2_RESPONSE_DTOS = [
  // Student Domain
  StudentResponseDto,
  StudentDetailResponseDto,
  PaginatedStudentResponseDto,

  // Appointment Domain
  AppointmentResponseDto,
  AppointmentDetailResponseDto,
  PaginatedAppointmentResponseDto,

  // Medication Domain
  MedicationResponseDto,
  MedicationDetailResponseDto,
  PaginatedMedicationResponseDto,

  // Health Record Domain
  HealthRecordResponseDto,
  HealthRecordDetailResponseDto,
  PaginatedHealthRecordResponseDto,

  // Vaccination Domain
  VaccinationResponseDto,
  VaccinationDetailResponseDto,
  PaginatedVaccinationResponseDto,

  // Allergy Domain
  AllergyResponseDto,
  AllergyDetailResponseDto,
  PaginatedAllergyResponseDto,

  // Supporting Domains
  UserResponseDto,
  AuthResponseDto,
  ApiKeyResponseDto,

  // Emergency Broadcast Communication
  EmergencyBroadcastResponseDto,
  EmergencyTemplateResponseDto,
  BroadcastStatusResponseDto,
  SendBroadcastResponseDto,

  // Common Response DTOs
  PaginatedResponseDto,
];

/**
 * Export all Response DTOs for Swagger schema registration
 * Combines error response DTOs and Phase 2 domain response DTOs
 *
 * Usage in main.ts:
 * ```typescript
 * import { ALL_RESPONSE_DTOS } from './common/config/swagger.config';
 *
 * const document = SwaggerModule.createDocument(app, config, {
 *   extraModels: ALL_RESPONSE_DTOS,
 * });
 * ```
 */
export const ALL_RESPONSE_DTOS = [
  ...ERROR_RESPONSE_DTOS,
  ...PHASE_2_RESPONSE_DTOS,
];

/**
 * Add global response schemas to Swagger document
 * Note: Error Response schemas are now defined as DTOs in error-response.dto.ts
 * and should be registered using SwaggerModule.createDocument with extraModels
 */
export function addGlobalSchemas(document: any) {
  document.components = document.components || {};
  document.components.schemas = {
    ...document.components.schemas,
    // Standard pagination metadata for list endpoints
    PaginationResponse: {
      type: 'object',
      required: ['page', 'limit', 'total', 'pages'],
      properties: {
        page: {
          type: 'number',
          description: 'Current page number',
          example: 1,
          minimum: 1,
        },
        limit: {
          type: 'number',
          description: 'Number of items per page',
          example: 20,
          minimum: 1,
          maximum: 100,
        },
        total: {
          type: 'number',
          description: 'Total number of items',
          example: 150,
          minimum: 0,
        },
        pages: {
          type: 'number',
          description: 'Total number of pages',
          example: 8,
          minimum: 0,
        },
      },
    },
    // Standard success response wrapper
    SuccessResponse: {
      type: 'object',
      required: ['success', 'data', 'timestamp'],
      properties: {
        success: {
          type: 'boolean',
          description: 'Indicates if the request was successful',
          example: true,
        },
        message: {
          type: 'string',
          description: 'Optional success message',
          example: 'Operation completed successfully',
        },
        data: {
          type: 'object',
          description: 'Response data payload',
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
          description: 'ISO 8601 timestamp of the response',
          example: '2025-11-14T10:30:00.000Z',
        },
        pagination: {
          $ref: '#/components/schemas/PaginationResponse',
          description: 'Pagination metadata (only for paginated endpoints)',
        },
      },
    },
  };
}
