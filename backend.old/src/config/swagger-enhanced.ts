/**
 * @fileoverview Enhanced Swagger API Documentation Configuration
 * @module config/swagger-enhanced
 * @description Production-grade Hapi-Swagger configuration with comprehensive API documentation,
 *              HIPAA compliance, security settings, and environment-specific configurations
 * @requires @hapi/hapi - Hapi server framework types
 * @requires hapi-swagger - Swagger/OpenAPI documentation plugin
 * @requires ../../package.json - Application version and metadata
 * @requires ../constants - Swagger configuration constants
 *
 * LOC: P9Q8R7S6T5
 * WC-CFG-SWG-054 | Enhanced Swagger Configuration with Production Security
 *
 * UPSTREAM (imports from):
 *   - package.json (../package.json)
 *   - index.ts (constants/index.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (index.ts)
 */

/**
 * WC-CFG-SWG-054 | Enhanced Swagger Configuration with Production Security
 * Purpose: Production-grade Swagger setup with security, performance, HIPAA compliance
 * Upstream: package.json, constants/SWAGGER_CONFIG, constants/ENVIRONMENT
 * Downstream: index.ts | Called by: Hapi server registration
 * Related: All routes/*, middleware/swagger.ts, HIPAA compliance documentation
 * Exports: swaggerOptions, extendedInfo, swaggerSecuritySchemes | Key Services: API docs
 * Last Updated: 2025-10-23 | Dependencies: @hapi/hapi, hapi-swagger, package.json
 * Critical Path: Hapi registration → Route discovery → Documentation generation → Security
 * LLM Context: Healthcare API documentation, JWT/API Key auth, HIPAA compliance, versioning
 */

import { ServerRegisterPluginObject } from '@hapi/hapi';
import * as HapiSwagger from 'hapi-swagger';
import * as Pack from '../../package.json';
import { SWAGGER_CONFIG, ENVIRONMENT } from '../constants';

/**
 * @constant {Object} swaggerSecuritySchemes
 * @description Multiple authentication schemes supported by the API
 *
 * @property {Object} jwt - JWT Bearer token authentication
 * @property {Object} apiKey - API Key authentication for integrations
 * @property {Object} oauth2 - OAuth2 authentication (future support)
 *
 * @example
 * // JWT Authentication
 * Authorization: Bearer <jwt-token>
 *
 * @example
 * // API Key Authentication
 * X-API-Key: <api-key>
 */
export const swaggerSecuritySchemes = {
  jwt: {
    type: 'apiKey',
    name: 'Authorization',
    in: 'header',
    description: 'JWT Bearer token for user authentication. Format: `Bearer <token>`\n\n' +
      'To obtain a token:\n' +
      '1. Register via POST /api/auth/register\n' +
      '2. Login via POST /api/auth/login\n' +
      '3. Copy the token from the response\n' +
      '4. Click "Authorize" button and enter: Bearer <your-token>'
  },
  apiKey: {
    type: 'apiKey',
    name: 'X-API-Key',
    in: 'header',
    description: 'API Key for third-party integrations and service-to-service authentication.\n\n' +
      'Contact your system administrator to obtain an API key.'
  },
  // Future: OAuth2 support
  // oauth2: {
  //   type: 'oauth2',
  //   flows: {
  //     authorizationCode: {
  //       authorizationUrl: '/oauth/authorize',
  //       tokenUrl: '/oauth/token',
  //       scopes: {
  //         'read:students': 'Read student information',
  //         'write:students': 'Create and update student information',
  //         'read:health_records': 'Read health records',
  //         'write:health_records': 'Create and update health records',
  //       }
  //     }
  //   }
  // }
};

/**
 * @constant {Array<Object>} enhancedSwaggerTags
 * @description Comprehensive API endpoint categorization with descriptions
 *
 * Note: hapi-swagger type definition has a typo in ExternalDocumentation interface
 * It uses 'string' instead of 'url', so we use 'string' to match the type definition
 */
export const enhancedSwaggerTags = [
  {
    name: 'Authentication',
    description: 'User authentication and authorization endpoints including login, logout, registration, password reset, and token refresh.',
    externalDocs: {
      description: 'Authentication documentation',
      string: 'https://docs.whitecross.health/authentication'
    }
  },
  {
    name: 'Students',
    description: 'Student management and profile endpoints for creating, reading, updating student information, and managing student assignments.',
    externalDocs: {
      description: 'Student management guide',
      string: 'https://docs.whitecross.health/students'
    }
  },
  {
    name: 'Medications',
    description: 'Medication tracking and administration endpoints including prescription management, medication administration, inventory tracking, and alerts.',
    externalDocs: {
      description: 'Medication management documentation',
      string: 'https://docs.whitecross.health/medications'
    }
  },
  {
    name: 'Health Records',
    description: 'Student health records and medical history endpoints including immunizations, allergies, chronic conditions, and vital signs. All endpoints are HIPAA-compliant.',
    externalDocs: {
      description: 'Health records documentation',
      string: 'https://docs.whitecross.health/health-records'
    }
  },
  {
    name: 'Appointments',
    description: 'Appointment scheduling and management endpoints including availability checks, booking, rescheduling, and cancellation.',
    externalDocs: {
      description: 'Appointment scheduling guide',
      string: 'https://docs.whitecross.health/appointments'
    }
  },
  {
    name: 'Emergency Contacts',
    description: 'Emergency contact management endpoints for maintaining and verifying student emergency contact information.',
    externalDocs: {
      description: 'Emergency contacts documentation',
      string: 'https://docs.whitecross.health/emergency-contacts'
    }
  },
  {
    name: 'Incident Reports',
    description: 'Incident reporting and tracking endpoints for documenting and managing health-related incidents at school.',
    externalDocs: {
      description: 'Incident reporting guide',
      string: 'https://docs.whitecross.health/incidents'
    }
  },
  {
    name: 'Users',
    description: 'User management and role administration endpoints for managing nurses, administrators, and other staff members.',
    externalDocs: {
      description: 'User management documentation',
      string: 'https://docs.whitecross.health/users'
    }
  },
  {
    name: 'Inventory',
    description: 'Medical inventory and supplies management endpoints including stock tracking, reordering, and inventory alerts.',
    externalDocs: {
      description: 'Inventory management guide',
      string: 'https://docs.whitecross.health/inventory'
    }
  },
  {
    name: 'Vendors',
    description: 'Vendor and supplier management endpoints for maintaining vendor relationships and product catalogs.',
    externalDocs: {
      description: 'Vendor management documentation',
      string: 'https://docs.whitecross.health/vendors'
    }
  },
  {
    name: 'Purchase Orders',
    description: 'Purchase order creation and tracking endpoints for ordering supplies and managing vendor orders.',
    externalDocs: {
      description: 'Purchase order documentation',
      string: 'https://docs.whitecross.health/purchase-orders'
    }
  },
  {
    name: 'Budget',
    description: 'Budget management and financial tracking endpoints for monitoring spending and budget allocations.',
    externalDocs: {
      description: 'Budget management guide',
      string: 'https://docs.whitecross.health/budget'
    }
  },
  {
    name: 'Communication',
    description: 'Communication and notification endpoints for sending messages, emails, and SMS to parents and staff.',
    externalDocs: {
      description: 'Communication system documentation',
      string: 'https://docs.whitecross.health/communication'
    }
  },
  {
    name: 'Reports',
    description: 'Analytics and reporting endpoints for generating various reports including health trends, compliance reports, and analytics dashboards.',
    externalDocs: {
      description: 'Reporting documentation',
      string: 'https://docs.whitecross.health/reports'
    }
  },
  {
    name: 'Compliance',
    description: 'Regulatory compliance and audit endpoints for HIPAA compliance, state regulations, and audit trail management.',
    externalDocs: {
      description: 'Compliance documentation',
      string: 'https://docs.whitecross.health/compliance'
    }
  },
  {
    name: 'Documents',
    description: 'Document management and file storage endpoints for uploading, downloading, and organizing documents.',
    externalDocs: {
      description: 'Document management guide',
      string: 'https://docs.whitecross.health/documents'
    }
  },
  {
    name: 'Access Control',
    description: 'Role-based access control and permissions endpoints for managing user roles, permissions, and access levels.',
    externalDocs: {
      description: 'Access control documentation',
      string: 'https://docs.whitecross.health/access-control'
    }
  },
  {
    name: 'Audit',
    description: 'Audit logging and trail endpoints for tracking user activities and maintaining compliance audit trails.',
    externalDocs: {
      description: 'Audit logging documentation',
      string: 'https://docs.whitecross.health/audit'
    }
  },
  {
    name: 'Integration',
    description: 'Third-party integration and webhook endpoints for connecting with external systems and services.',
    externalDocs: {
      description: 'Integration guide',
      string: 'https://docs.whitecross.health/integrations'
    }
  },
  {
    name: 'Administration',
    description: 'System administration and configuration endpoints for managing system settings, backups, and system health.',
    externalDocs: {
      description: 'Administration documentation',
      string: 'https://docs.whitecross.health/administration'
    }
  },
  {
    name: 'Districts',
    description: 'School district management endpoints for managing district-level settings and configurations.',
    externalDocs: {
      description: 'District management guide',
      string: 'https://docs.whitecross.health/districts'
    }
  },
  {
    name: 'Schools',
    description: 'School management and configuration endpoints for managing individual schools within districts.',
    externalDocs: {
      description: 'School management documentation',
      string: 'https://docs.whitecross.health/schools'
    }
  }
];

/**
 * @constant {ServerRegisterPluginObject} swaggerOptions
 * @description Production-grade Hapi server plugin configuration for Swagger/OpenAPI documentation
 *
 * Enhanced features:
 * - Multiple authentication schemes (JWT, API Key)
 * - Comprehensive error response documentation
 * - Request/response examples
 * - Enhanced security headers
 * - Custom CSS branding
 * - External documentation links
 * - Server configuration for multiple environments
 *
 * @example
 * // Register Swagger plugin in Hapi server
 * await server.register(swaggerOptions);
 *
 * // Access Swagger UI
 * // http://localhost:3001/docs
 *
 * @see {@link SWAGGER_CONFIG} For configuration constants
 * @see {@link https://github.com/glennjones/hapi-swagger} For plugin documentation
 */
export const swaggerOptions: ServerRegisterPluginObject<HapiSwagger.RegisterOptions> = {
  plugin: HapiSwagger,
  options: {
    info: {
      title: 'White Cross Healthcare Platform API',
      version: Pack.version,
      description: `
# White Cross Healthcare Platform API

Enterprise-grade healthcare platform API for school nurses to manage student health records, medications, and emergency communications.

## Overview

This API provides comprehensive healthcare management functionality for school districts, including:
- **Student Health Records Management**: HIPAA-compliant storage and retrieval of student health information
- **Medication Tracking & Administration**: Complete medication lifecycle management with automated alerts
- **Appointment Scheduling**: Smart scheduling system with availability management
- **Incident Reporting**: Comprehensive incident tracking and reporting system
- **Emergency Contact Management**: Centralized emergency contact information with verification
- **Compliance & Regulatory Reporting**: Automated compliance reports for state and federal regulations
- **Real-time Communication**: Multi-channel communication system (email, SMS, push notifications)
- **Inventory Management**: Medical supplies tracking with automated reordering
- **Analytics & Reporting**: Comprehensive reporting suite with customizable dashboards

## Security & Compliance

### HIPAA Compliance
- **Protected Health Information (PHI)**: All endpoints handling PHI are secured with multiple authentication layers
- **Audit Logging**: Complete audit trail of all PHI access with timestamp, user, and action
- **Encryption**: Data encrypted at rest (AES-256) and in transit (TLS 1.3)
- **Access Control**: Role-based access control (RBAC) with granular permissions
- **Data Retention**: Configurable retention policies compliant with HIPAA requirements

### Authentication Methods
1. **JWT Bearer Token**: Primary authentication method for user sessions
2. **API Key**: Service-to-service authentication for integrations
3. **OAuth2** (Coming Soon): Third-party application authentication

### Security Features
- **Rate Limiting**: API requests are rate-limited to prevent abuse
- **IP Whitelisting**: Optional IP-based access control for sensitive endpoints
- **Security Headers**: CSP, HSTS, X-Frame-Options, and more
- **Input Validation**: Comprehensive input validation on all endpoints
- **SQL Injection Prevention**: Parameterized queries and ORM protection
- **XSS Prevention**: Output encoding and Content Security Policy

## API Versioning

Current Version: **v1**

The API uses URL-based versioning with the format: \`/api/v{version}/...\`

- Base URL: \`${ENVIRONMENT.BACKEND_URL || 'http://localhost:3001'}\`
- Current API: \`${ENVIRONMENT.BACKEND_URL || 'http://localhost:3001'}/api/v1\`

### Version Support Policy
- Current version (v1) is fully supported
- Previous versions remain accessible for 12 months after new version release
- Breaking changes trigger new major version
- Deprecated endpoints are marked in documentation with sunset date

## Getting Started

### 1. Authentication

Most endpoints require authentication. To get started:

\`\`\`bash
# Register a new user (if needed)
POST ${ENVIRONMENT.BACKEND_URL || 'http://localhost:3001'}/api/v1/auth/register
Content-Type: application/json

{
  "email": "nurse@school.edu",
  "password": "SecurePass123!",
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "NURSE"
}

# Login to get JWT token
POST ${ENVIRONMENT.BACKEND_URL || 'http://localhost:3001'}/api/v1/auth/login
Content-Type: application/json

{
  "email": "nurse@school.edu",
  "password": "SecurePass123!"
}

# Response
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "8h"
  }
}
\`\`\`

### 2. Making Authenticated Requests

Include the JWT token in the Authorization header:

\`\`\`bash
GET ${ENVIRONMENT.BACKEND_URL || 'http://localhost:3001'}/api/v1/students
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

### 3. Using Swagger UI

Click the "Authorize" button in the top right of this page:
1. Enter your token in the format: \`Bearer <your-token>\`
2. Click "Authorize"
3. All subsequent "Try it out" requests will include authentication

## Rate Limiting

API requests are rate-limited based on authentication status:

| Authentication | Rate Limit | Window |
|----------------|------------|--------|
| Authenticated  | ${SWAGGER_CONFIG.RATE_LIMIT_INFO.AUTHENTICATED} requests | 1 minute |
| Unauthenticated | ${SWAGGER_CONFIG.RATE_LIMIT_INFO.UNAUTHENTICATED} requests | 1 minute |

Rate limit headers are included in every response:
- \`X-RateLimit-Limit\`: Maximum requests allowed
- \`X-RateLimit-Remaining\`: Requests remaining in current window
- \`X-RateLimit-Reset\`: Unix timestamp when the rate limit resets

## Response Format

All API responses follow a consistent format:

### Success Response
\`\`\`json
{
  "success": true,
  "data": {
    // Response data varies by endpoint
  },
  "meta": {
    "timestamp": "2025-10-23T12:00:00.000Z",
    "requestId": "req_abc123"
  }
}
\`\`\`

### Error Response
\`\`\`json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": {
      // Additional error details (optional)
    }
  },
  "meta": {
    "timestamp": "2025-10-23T12:00:00.000Z",
    "requestId": "req_abc123"
  }
}
\`\`\`

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 OK | Request successful |
| 201 Created | Resource created successfully |
| 204 No Content | Request successful, no content to return |
| 400 Bad Request | Invalid request parameters or body |
| 401 Unauthorized | Authentication required or token invalid |
| 403 Forbidden | Insufficient permissions |
| 404 Not Found | Resource not found |
| 409 Conflict | Resource already exists or state conflict |
| 422 Unprocessable Entity | Validation error |
| 429 Too Many Requests | Rate limit exceeded |
| 500 Internal Server Error | Server error |
| 503 Service Unavailable | Temporary service outage |

## Pagination

List endpoints support pagination via query parameters:

\`\`\`bash
GET /api/v1/students?page=1&limit=20&sort=lastName&order=asc
\`\`\`

### Pagination Parameters

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| \`page\` | integer | 1 | - | Page number (1-indexed) |
| \`limit\` | integer | 10 | 100 | Items per page |
| \`sort\` | string | id | - | Field to sort by |
| \`order\` | string | asc | - | Sort order (asc/desc) |

### Pagination Response

\`\`\`json
{
  "success": true,
  "data": [
    // Array of items
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
\`\`\`

## Filtering & Search

Many list endpoints support filtering and search:

\`\`\`bash
# Search by name
GET /api/v1/students?search=john

# Filter by multiple criteria
GET /api/v1/students?grade=5&status=active

# Complex queries
GET /api/v1/medications?status=active&expiring=true&minStock=10
\`\`\`

## Field Selection

Reduce response size by selecting specific fields:

\`\`\`bash
GET /api/v1/students?fields=id,firstName,lastName,email
\`\`\`

## Webhooks

Subscribe to events via webhooks (requires API Key authentication):

\`\`\`bash
POST /api/v1/integration/webhooks
X-API-Key: your-api-key

{
  "url": "https://your-app.com/webhooks/white-cross",
  "events": ["medication.administered", "incident.created"],
  "secret": "your-webhook-secret"
}
\`\`\`

## Support & Resources

- **API Support**: ${SWAGGER_CONFIG.CONTACT.EMAIL}
- **Documentation**: https://docs.whitecross.health
- **Status Page**: https://status.whitecross.health
- **Changelog**: https://docs.whitecross.health/changelog
- **SDKs**: https://docs.whitecross.health/sdks

## Terms of Service

By using this API, you agree to:
- Comply with HIPAA regulations when handling PHI
- Implement proper security measures in your application
- Not exceed rate limits or abuse the service
- Report security vulnerabilities responsibly

For complete terms, visit: https://whitecross.health/terms
      `.trim(),
      contact: {
        name: SWAGGER_CONFIG.CONTACT.NAME,
        email: SWAGGER_CONFIG.CONTACT.EMAIL,
        url: 'https://whitecross.health/support'
      },
      license: {
        name: SWAGGER_CONFIG.LICENSE.NAME,
        url: SWAGGER_CONFIG.LICENSE.URL
      },
      termsOfService: 'https://whitecross.health/terms'
    },
    tags: enhancedSwaggerTags,
    securityDefinitions: swaggerSecuritySchemes,
    security: [{ jwt: [] }], // Default to JWT auth
    grouping: 'tags',
    sortTags: 'alpha', // Sort tags alphabetically (valid values: 'alpha' | 'unsorted')
    sortEndpoints: 'ordered',
    documentationPath: SWAGGER_CONFIG.PATHS.DOCUMENTATION,
    swaggerUI: true,
    swaggerUIPath: SWAGGER_CONFIG.PATHS.SWAGGER_UI,
    jsonPath: SWAGGER_CONFIG.PATHS.JSON,
    basePath: '/',
    pathPrefixSize: 2,
    cors: true,
    schemes: ENVIRONMENT.IS_PRODUCTION ? ['https'] : ['http', 'https'],
    host: process.env.SWAGGER_HOST || `localhost:${ENVIRONMENT.PORT}`,
    // Multiple servers for different environments
    servers: [
      {
        url: ENVIRONMENT.BACKEND_URL || `http://localhost:${ENVIRONMENT.PORT}`,
        description: ENVIRONMENT.IS_PRODUCTION ? 'Production' : ENVIRONMENT.IS_TEST ? 'Testing' : 'Development'
      },
      ...(process.env.SWAGGER_STAGING_URL ? [{
        url: process.env.SWAGGER_STAGING_URL,
        description: 'Staging'
      }] : []),
      ...(process.env.SWAGGER_PROD_URL ? [{
        url: process.env.SWAGGER_PROD_URL,
        description: 'Production'
      }] : [])
    ],
    expanded: 'list',
    // Custom branding
    customCss: `
      .swagger-ui {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      }
      .swagger-ui .topbar {
        background-color: ${SWAGGER_CONFIG.BRANDING.PRIMARY_COLOR};
        border-bottom: 4px solid #1a3a52;
      }
      .swagger-ui .info .title {
        color: ${SWAGGER_CONFIG.BRANDING.PRIMARY_COLOR};
        font-weight: 700;
      }
      .swagger-ui .info .description {
        line-height: 1.6;
      }
      .swagger-ui .scheme-container {
        background: #fafafa;
        padding: 20px;
        border-radius: 4px;
      }
      .swagger-ui .opblock-tag {
        font-size: 18px;
        font-weight: 600;
        border-bottom: 2px solid ${SWAGGER_CONFIG.BRANDING.PRIMARY_COLOR};
      }
      .swagger-ui .opblock .opblock-summary-method {
        font-weight: 700;
      }
      .swagger-ui .opblock.opblock-get .opblock-summary {
        border-color: #61affe;
      }
      .swagger-ui .opblock.opblock-post .opblock-summary {
        border-color: #49cc90;
      }
      .swagger-ui .opblock.opblock-put .opblock-summary {
        border-color: #fca130;
      }
      .swagger-ui .opblock.opblock-delete .opblock-summary {
        border-color: #f93e3e;
      }
    `,
    customSiteTitle: SWAGGER_CONFIG.BRANDING.TITLE,
    customfavIcon: SWAGGER_CONFIG.BRANDING.FAVICON,
    // Response validation
    responseValidation: ENVIRONMENT.IS_DEVELOPMENT || ENVIRONMENT.IS_TEST,
    // Enable try-it-out by default
    defaultModelsExpandDepth: 1,
    defaultModelExpandDepth: 1,
    // Debug options (only in development)
    debug: ENVIRONMENT.IS_DEVELOPMENT,
    // Plugin options
    validatorUrl: null, // Disable external validator for security
  }
};

/**
 * Export original swaggerOptions as default for backward compatibility
 */
export default swaggerOptions;
