/**
 * LOC: D2CD3BF009
 * WC-CFG-SWG-053 | Swagger API Documentation Configuration & Healthcare API Specs
 *
 * UPSTREAM (imports from):
 *   - package.json (../package.json)
 *   - index.ts (constants/index.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index-sequelize.ts (index-sequelize.ts)
 *   - index.ts (index.ts)
 */

/**
 * WC-CFG-SWG-053 | Swagger API Documentation Configuration & Healthcare API Specs
 * Purpose: Hapi-Swagger setup, API documentation, HIPAA-compliant endpoint specs
 * Upstream: package.json, constants/SWAGGER_CONFIG, constants/ENVIRONMENT
 * Downstream: All API routes, index.ts | Called by: Hapi server registration
 * Related: All routes/*, middleware/*, HIPAA compliance documentation
 * Exports: swaggerOptions, extendedInfo | Key Services: API documentation generation
 * Last Updated: 2025-10-18 | Dependencies: @hapi/hapi, hapi-swagger, package.json
 * Critical Path: Hapi registration → Route discovery → Documentation generation
 * LLM Context: Healthcare API documentation, JWT auth specs, HIPAA compliance info
 */

import { ServerRegisterPluginObject } from '@hapi/hapi';
import * as HapiSwagger from 'hapi-swagger';
import * as Pack from '../../package.json';
import { SWAGGER_CONFIG, ENVIRONMENT } from '../constants';

export const swaggerOptions: ServerRegisterPluginObject<HapiSwagger.RegisterOptions> = {
  plugin: HapiSwagger,
  options: {
    info: {
      title: 'White Cross Healthcare Platform API',
      version: Pack.version,
      description: 'Enterprise-grade healthcare platform API for school nurses to manage student health records, medications, and emergency communications. This API follows HIPAA compliance standards and implements robust security measures.',
      contact: {
        name: SWAGGER_CONFIG.CONTACT.NAME,
        email: SWAGGER_CONFIG.CONTACT.EMAIL
      },
      license: {
        name: SWAGGER_CONFIG.LICENSE.NAME,
        url: SWAGGER_CONFIG.LICENSE.URL
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Students',
        description: 'Student management and profile endpoints'
      },
      {
        name: 'Medications',
        description: 'Medication tracking and administration endpoints'
      },
      {
        name: 'Health Records',
        description: 'Student health records and medical history endpoints'
      },
      {
        name: 'Appointments',
        description: 'Appointment scheduling and management endpoints'
      },
      {
        name: 'Emergency Contacts',
        description: 'Emergency contact management endpoints'
      },
      {
        name: 'Incident Reports',
        description: 'Incident reporting and tracking endpoints'
      },
      {
        name: 'Users',
        description: 'User management and role administration endpoints'
      },
      {
        name: 'Inventory',
        description: 'Medical inventory and supplies management endpoints'
      },
      {
        name: 'Vendors',
        description: 'Vendor and supplier management endpoints'
      },
      {
        name: 'Purchase Orders',
        description: 'Purchase order creation and tracking endpoints'
      },
      {
        name: 'Budget',
        description: 'Budget management and financial tracking endpoints'
      },
      {
        name: 'Communication',
        description: 'Communication and notification endpoints'
      },
      {
        name: 'Reports',
        description: 'Analytics and reporting endpoints'
      },
      {
        name: 'Compliance',
        description: 'Regulatory compliance and audit endpoints'
      },
      {
        name: 'Documents',
        description: 'Document management and file storage endpoints'
      },
      {
        name: 'Access Control',
        description: 'Role-based access control and permissions endpoints'
      },
      {
        name: 'Audit',
        description: 'Audit logging and trail endpoints'
      },
      {
        name: 'Integration',
        description: 'Third-party integration and webhook endpoints'
      },
      {
        name: 'Administration',
        description: 'System administration and configuration endpoints'
      },
      {
        name: 'Districts',
        description: 'School district management endpoints'
      },
      {
        name: 'Schools',
        description: 'School management and configuration endpoints'
      }
    ],
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'JWT token for authentication. Format: `Bearer <token>`'
      }
    },
    security: [{ jwt: [] }],
    grouping: 'tags',
    sortEndpoints: 'ordered',
    documentationPath: SWAGGER_CONFIG.PATHS.DOCUMENTATION,
    swaggerUI: true,
    swaggerUIPath: SWAGGER_CONFIG.PATHS.SWAGGER_UI,
    jsonPath: SWAGGER_CONFIG.PATHS.JSON,
    basePath: '/',
    pathPrefixSize: 2,
    cors: true,
    schemes: ['http', 'https'],
    host: process.env.SWAGGER_HOST || `localhost:${ENVIRONMENT.PORT}`,
    expanded: 'list',
    lang: 'en',
    // Custom branding
    customCss: `
      .swagger-ui .topbar {
        background-color: ${SWAGGER_CONFIG.BRANDING.PRIMARY_COLOR};
      }
      .swagger-ui .info .title {
        color: ${SWAGGER_CONFIG.BRANDING.PRIMARY_COLOR};
      }
    `,
    customSiteTitle: SWAGGER_CONFIG.BRANDING.TITLE,
    customfavIcon: SWAGGER_CONFIG.BRANDING.FAVICON,
    // Response validation
    responseValidation: true,
    // Enable try-it-out by default
    defaultModelsExpandDepth: 1,
    defaultModelExpandDepth: 1
  }
};

// Extended info for documentation
export const extendedInfo = {
  title: 'White Cross Healthcare Platform API',
  version: Pack.version,
  description: `
# White Cross Healthcare Platform API

Enterprise-grade healthcare platform API for school nurses to manage student health records, medications, and emergency communications.

## Overview
This API provides comprehensive healthcare management functionality for school districts, including:
- Student health records management
- Medication tracking and administration
- Appointment scheduling
- Incident reporting
- Emergency contact management
- Compliance and regulatory reporting
- And much more...

## Security & Compliance
- **HIPAA Compliant**: All endpoints handling Protected Health Information (PHI) are secured and audited
- **JWT Authentication**: Bearer token authentication required for all protected endpoints
- **Role-Based Access Control**: Granular permissions based on user roles
- **Audit Logging**: All PHI access is logged for compliance
- **Encryption**: Data encrypted at rest and in transit

## Authentication
Most endpoints require authentication via JWT Bearer token:

\`\`\`
Authorization: Bearer <your-token-here>
\`\`\`

To obtain a token:
1. Register a user via \`POST /api/auth/register\` (if needed)
2. Login via \`POST /api/auth/login\`
3. Use the returned token in the Authorization header

## Rate Limiting
API requests are rate-limited to prevent abuse:
- ${SWAGGER_CONFIG.RATE_LIMIT_INFO.AUTHENTICATED} requests per minute per IP for authenticated users
- ${SWAGGER_CONFIG.RATE_LIMIT_INFO.UNAUTHENTICATED} requests per minute per IP for unauthenticated requests

## Response Format
All responses follow a standard format:

### Success Response
\`\`\`json
{
  "success": true,
  "data": { ... }
}
\`\`\`

### Error Response
\`\`\`json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
\`\`\`

## Pagination
List endpoints support pagination via query parameters:
- \`page\`: Page number (default: 1)
- \`limit\`: Items per page (default: 10, max: 100)

## Support
For API support, contact: ${SWAGGER_CONFIG.CONTACT.EMAIL}
  `.trim(),
  contact: {
    name: SWAGGER_CONFIG.CONTACT.NAME,
    email: SWAGGER_CONFIG.CONTACT.EMAIL
  },
  license: {
    name: SWAGGER_CONFIG.LICENSE.NAME,
    url: SWAGGER_CONFIG.LICENSE.URL
  }
};
