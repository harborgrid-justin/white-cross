import { DocumentBuilder } from '@nestjs/swagger';

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
    )
    .addTag(
      'students',
      'Student profile management, enrollment, and demographics',
    )
    .addTag('Users', 'User account management and profile administration')

    // Health Management
    .addTag('Health Records', 'Comprehensive student health record management')
    .addTag(
      'Allergies',
      'Allergy tracking, safety checks, and critical allergy alerts',
    )
    .addTag(
      'Chronic Conditions',
      'Chronic condition management and treatment plans',
    )
    .addTag(
      'Vaccinations',
      'Immunization tracking and CDC-compliant vaccination schedules',
    )
    .addTag(
      'Vital Signs',
      'Vital signs monitoring, trends, and health assessments',
    )

    // Clinical Services
    .addTag(
      'Clinical',
      'Clinical services including drug interactions and clinic visits',
    )
    .addTag('Appointments', 'Appointment scheduling and calendar management')
    .addTag('Incident Reports', 'Health incident documentation and reporting')

    // Medication Management
    .addTag('medications', 'Medication formulary management')
    .addTag('administration', 'Medication administration records (MAR)')
    .addTag('inventory', 'Medication inventory and stock management')
    .addTag('adverse-reactions', 'Adverse drug reaction reporting')
    .addTag(
      'controlled-substances',
      'DEA-compliant controlled substance logging',
    )

    // Administrative Functions
    .addTag(
      'Administration',
      'System administration, configuration, and school management',
    )
    .addTag('Access Control', 'Role-based access control and permissions')
    .addTag('Audit', 'Audit logging and compliance tracking')
    .addTag('Compliance', 'Regulatory compliance and HIPAA controls')
    .addTag('Security', 'Security events, incidents, and IP restrictions')

    // Operational Modules
    .addTag('Analytics', 'Analytics, reporting, and data insights')
    .addTag('Reports', 'Report generation and scheduled reporting')
    .addTag('Budget', 'Budget management and financial tracking')
    .addTag('Contacts', 'Emergency contacts and parent/guardian management')
    .addTag('Documents', 'Document management and file storage')

    // Integration & Communication
    .addTag('Integration', 'Third-party integrations and SIS connectors')
    .addTag('Communication', 'Multi-channel communication and notifications')
    .addTag('Mobile', 'Mobile device management, sync, and push notifications')

    // Utilities
    .addTag('PDF Generation', 'PDF document generation and printing')

    // Advanced Features (to be implemented)
    .addTag('Academic Transcript', 'Academic records and transcript management')
    .addTag('AI Search', 'Intelligent search with vector embeddings')
    .addTag('Alerts', 'Real-time alert system and notification management')
    .addTag('Features', 'Enterprise feature flags and advanced capabilities')
    .addTag('Health Domain', 'Health domain business logic and workflows')

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
    .build();
}

/**
 * Add global response schemas to Swagger document
 */
export function addGlobalSchemas(document: any) {
  document.components = document.components || {};
  document.components.schemas = {
    ...document.components.schemas,
    ErrorResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'An error occurred' },
        error: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'VALIDATION_ERROR' },
            details: { type: 'array', items: { type: 'string' } },
          },
        },
        timestamp: { type: 'string', format: 'date-time' },
        path: { type: 'string', example: '/api/students' },
      },
    },
    PaginationResponse: {
      type: 'object',
      properties: {
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 20 },
        total: { type: 'number', example: 150 },
        pages: { type: 'number', example: 8 },
      },
    },
    SuccessResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Operation completed successfully',
        },
        data: { type: 'object' },
      },
    },
  };
}
