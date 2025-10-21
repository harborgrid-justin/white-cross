/**
 * System Authentication Routes
 * Handles MFA (Multi-Factor Authentication) and advanced authentication features
 */

import { ServerRoute } from '@hapi/hapi';
import { 
  setupMFA,
  verifyMFA,
  getSystemHealth,
  getFeatureStatus,
  generateFeatureReport
} from '../controllers/authentication.controller';
import { 
  validateMFASetup,
  validateMFAVerification,
  validateSystemHealthQuery,
  validateFeatureStatusQuery
} from '../validators/authentication.validators';

/**
 * MFA AUTHENTICATION ROUTES
 */

export const authenticationRoutes: ServerRoute[] = [
  // Setup MFA for user
  {
    method: 'POST',
    path: '/v1/system/auth/mfa/setup',
    options: {
      auth: 'jwt',
      tags: ['api', 'system', 'authentication', 'mfa'],
      description: 'Setup multi-factor authentication for user',
      notes: 'Initializes MFA for the authenticated user using TOTP, SMS, or email methods',
      validate: {
        payload: validateMFASetup
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            200: { description: 'MFA setup successful' },
            400: { description: 'Invalid MFA setup data' },
            401: { description: 'Authentication required' },
            409: { description: 'MFA already configured' },
            500: { description: 'Server error during MFA setup' }
          },
          security: [{ jwt: [] }]
        }
      }
    },
    handler: setupMFA
  },

  // Verify MFA code
  {
    method: 'POST',
    path: '/v1/system/auth/mfa/verify',
    options: {
      auth: 'jwt',
      tags: ['api', 'system', 'authentication', 'mfa'],
      description: 'Verify MFA authentication code',
      notes: 'Validates MFA code for TOTP, SMS, or backup codes',
      validate: {
        payload: validateMFAVerification
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            200: { description: 'MFA verification successful' },
            400: { description: 'Invalid MFA code' },
            401: { description: 'Authentication required' },
            403: { description: 'MFA verification failed' },
            500: { description: 'Server error during MFA verification' }
          },
          security: [{ jwt: [] }]
        }
      }
    },
    handler: verifyMFA
  }
];

/**
 * SYSTEM MONITORING ROUTES
 */

export const systemMonitoringRoutes: ServerRoute[] = [
  // Get system health status
  {
    method: 'GET',
    path: '/v1/system/admin/health',
    options: {
      auth: 'jwt',
      tags: ['api', 'system', 'monitoring', 'health'],
      description: 'Get comprehensive system health status',
      notes: 'Returns database connectivity, service status, memory usage, and performance metrics',
      validate: {
        query: validateSystemHealthQuery
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            200: { description: 'System health retrieved successfully' },
            401: { description: 'Authentication required' },
            403: { description: 'Admin access required' },
            500: { description: 'Server error retrieving system health' }
          },
          security: [{ jwt: [] }]
        }
      }
    },
    handler: getSystemHealth
  },

  // Get feature integration status
  {
    method: 'GET',
    path: '/v1/system/admin/features/status',
    options: {
      auth: 'jwt',
      tags: ['api', 'system', 'monitoring', 'features'],
      description: 'Get status of all integrated system features',
      notes: 'Returns availability and health status of healthcare, operations, analytics, and communication modules',
      validate: {
        query: validateFeatureStatusQuery
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            200: { description: 'Feature status retrieved successfully' },
            401: { description: 'Authentication required' },
            403: { description: 'Admin access required' },
            500: { description: 'Server error retrieving feature status' }
          },
          security: [{ jwt: [] }]
        }
      }
    },
    handler: getFeatureStatus
  },

  // Generate comprehensive feature report
  {
    method: 'GET',
    path: '/v1/system/admin/features/report',
    options: {
      auth: 'jwt',
      tags: ['api', 'system', 'monitoring', 'reporting'],
      description: 'Generate comprehensive feature integration report',
      notes: 'Creates detailed report of all system features, usage statistics, and integration health',
      plugins: {
        'hapi-swagger': {
          responses: {
            200: { description: 'Feature report generated successfully' },
            401: { description: 'Authentication required' },
            403: { description: 'Admin access required' },
            500: { description: 'Server error generating report' }
          },
          security: [{ jwt: [] }]
        }
      }
    },
    handler: generateFeatureReport
  }
];

/**
 * COMBINED SYSTEM ROUTES
 */

export const systemRoutes: ServerRoute[] = [
  ...authenticationRoutes,
  ...systemMonitoringRoutes
];
