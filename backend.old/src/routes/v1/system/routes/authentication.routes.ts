/**
 * System Authentication Routes
 * Handles MFA (Multi-Factor Authentication) and advanced authentication features
 */

import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import {
  setupMFA,
  verifyMFA,
  getSystemHealth,
  getFeatureStatus,
  generateFeatureReport
} from '../controllers/authentication.controller';
import {
  mfaSetupSchema,
  mfaVerificationSchema,
  systemHealthQuerySchema,
  featureStatusQuerySchema
} from '../validators/authentication.validators';

/**
 * RESPONSE SCHEMAS FOR SWAGGER DOCUMENTATION
 */

const mfaSetupResponseSchema = Joi.object({
  success: Joi.boolean().required().description('Operation success status'),
  message: Joi.string().required().description('Success message'),
  data: Joi.object({
    method: Joi.string().valid('totp', 'sms', 'email').required().description('MFA method configured'),
    secret: Joi.string().optional().description('TOTP secret (for authenticator apps)'),
    qrCode: Joi.string().optional().description('QR code data URL for TOTP setup'),
    backupCodes: Joi.array().items(Joi.string()).optional().description('Emergency backup codes'),
    phoneNumber: Joi.string().optional().description('Masked phone number for SMS'),
    email: Joi.string().optional().description('Masked email for email-based MFA')
  }).required()
}).label('MFASetupResponse');

const mfaVerifyResponseSchema = Joi.object({
  success: Joi.boolean().required().description('Verification success status'),
  message: Joi.string().required().description('Verification result message'),
  data: Joi.object({
    verified: Joi.boolean().required().description('Whether MFA code was valid'),
    deviceRemembered: Joi.boolean().optional().description('Whether device was remembered'),
    nextMfaRequired: Joi.date().optional().description('Next MFA requirement time')
  }).required()
}).label('MFAVerifyResponse');

const systemHealthResponseSchema = Joi.object({
  success: Joi.boolean().required().description('Health check success status'),
  data: Joi.object({
    status: Joi.string().valid('healthy', 'degraded', 'unhealthy').required().description('Overall system status'),
    timestamp: Joi.date().required().description('Health check timestamp'),
    uptime: Joi.number().required().description('System uptime in seconds'),
    components: Joi.object({
      database: Joi.object({
        status: Joi.string().valid('connected', 'disconnected', 'error').required(),
        responseTime: Joi.number().optional().description('Database response time in ms'),
        details: Joi.string().optional()
      }).optional(),
      authentication: Joi.object({
        status: Joi.string().valid('operational', 'degraded', 'down').required(),
        activeTokens: Joi.number().optional(),
        details: Joi.string().optional()
      }).optional(),
      healthcare: Joi.object({
        status: Joi.string().valid('operational', 'degraded', 'down').required(),
        details: Joi.string().optional()
      }).optional(),
      storage: Joi.object({
        status: Joi.string().valid('operational', 'degraded', 'down').required(),
        availableSpace: Joi.string().optional(),
        details: Joi.string().optional()
      }).optional(),
      email: Joi.object({
        status: Joi.string().valid('operational', 'degraded', 'down').required(),
        details: Joi.string().optional()
      }).optional()
    }).optional().description('Individual component health details'),
    memoryUsage: Joi.object({
      heapUsed: Joi.number().optional(),
      heapTotal: Joi.number().optional(),
      external: Joi.number().optional()
    }).optional().description('Memory usage metrics')
  }).required()
}).label('SystemHealthResponse');

const featureStatusResponseSchema = Joi.object({
  success: Joi.boolean().required().description('Feature status retrieval success'),
  data: Joi.object({
    features: Joi.array().items(
      Joi.object({
        module: Joi.string().required().description('Feature module name'),
        name: Joi.string().required().description('Feature display name'),
        status: Joi.string().valid('enabled', 'disabled', 'beta', 'deprecated').required(),
        availability: Joi.string().valid('available', 'unavailable', 'degraded').required(),
        endpoints: Joi.number().optional().description('Number of endpoints'),
        description: Joi.string().optional(),
        metrics: Joi.object({
          requestCount: Joi.number().optional(),
          averageResponseTime: Joi.number().optional(),
          errorRate: Joi.number().optional()
        }).optional()
      })
    ).required().description('List of all system features'),
    summary: Joi.object({
      total: Joi.number().required(),
      enabled: Joi.number().required(),
      available: Joi.number().required(),
      degraded: Joi.number().required()
    }).required()
  }).required()
}).label('FeatureStatusResponse');

const featureReportResponseSchema = Joi.object({
  success: Joi.boolean().required().description('Report generation success'),
  data: Joi.object({
    reportId: Joi.string().required().description('Unique report identifier'),
    generatedAt: Joi.date().required().description('Report generation timestamp'),
    reportType: Joi.string().required().description('Type of report generated'),
    summary: Joi.object({
      totalModules: Joi.number().required(),
      totalEndpoints: Joi.number().required(),
      healthyServices: Joi.number().required(),
      degradedServices: Joi.number().required(),
      downServices: Joi.number().required()
    }).required(),
    modules: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        status: Joi.string().required(),
        endpoints: Joi.number().required(),
        uptime: Joi.string().optional(),
        issues: Joi.array().items(Joi.string()).optional()
      })
    ).required(),
    recommendations: Joi.array().items(Joi.string()).optional()
  }).required()
}).label('FeatureReportResponse');

const errorResponseSchema = Joi.object({
  success: Joi.boolean().required().example(false).description('Operation failure status'),
  error: Joi.object({
    message: Joi.string().required().description('Error message'),
    code: Joi.string().optional().description('Error code'),
    details: Joi.any().optional().description('Additional error details')
  }).required()
}).label('ErrorResponse');

/**
 * MFA AUTHENTICATION ROUTES
 */

export const authenticationRoutes: ServerRoute[] = [
  // Setup MFA for user
  {
    method: 'POST',
    path: '/api/v1/system/auth/mfa/setup',
    options: {
      auth: 'jwt',
      tags: ['api', 'system', 'authentication', 'mfa'],
      description: 'Setup multi-factor authentication for user',
      notes: 'Initializes MFA for the authenticated user using TOTP, SMS, or email methods',
      validate: {
        payload: mfaSetupSchema
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            200: {
              description: 'MFA setup successful',
              schema: mfaSetupResponseSchema
            },
            400: {
              description: 'Invalid MFA setup data',
              schema: errorResponseSchema
            },
            401: { description: 'Authentication required' },
            409: {
              description: 'MFA already configured',
              schema: errorResponseSchema
            },
            500: {
              description: 'Server error during MFA setup',
              schema: errorResponseSchema
            }
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
    path: '/api/v1/system/auth/mfa/verify',
    options: {
      auth: 'jwt',
      tags: ['api', 'system', 'authentication', 'mfa'],
      description: 'Verify MFA authentication code',
      notes: 'Validates MFA code for TOTP, SMS, or backup codes',
      validate: {
        payload: mfaVerificationSchema
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            200: {
              description: 'MFA verification successful',
              schema: mfaVerifyResponseSchema
            },
            400: {
              description: 'Invalid MFA code',
              schema: errorResponseSchema
            },
            401: { description: 'Authentication required' },
            403: {
              description: 'MFA verification failed',
              schema: errorResponseSchema
            },
            500: {
              description: 'Server error during MFA verification',
              schema: errorResponseSchema
            }
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
    path: '/api/v1/system/admin/health',
    options: {
      auth: 'jwt',
      tags: ['api', 'system', 'monitoring', 'health'],
      description: 'Get comprehensive system health status',
      notes: 'Returns database connectivity, service status, memory usage, and performance metrics',
      validate: {
        query: systemHealthQuerySchema
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            200: {
              description: 'System health retrieved successfully',
              schema: systemHealthResponseSchema
            },
            401: { description: 'Authentication required' },
            403: {
              description: 'Admin access required',
              schema: errorResponseSchema
            },
            500: {
              description: 'Server error retrieving system health',
              schema: errorResponseSchema
            }
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
    path: '/api/v1/system/admin/features/status',
    options: {
      auth: 'jwt',
      tags: ['api', 'system', 'monitoring', 'features'],
      description: 'Get status of all integrated system features',
      notes: 'Returns availability and health status of healthcare, operations, analytics, and communication modules',
      validate: {
        query: featureStatusQuerySchema
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            200: {
              description: 'Feature status retrieved successfully',
              schema: featureStatusResponseSchema
            },
            401: { description: 'Authentication required' },
            403: {
              description: 'Admin access required',
              schema: errorResponseSchema
            },
            500: {
              description: 'Server error retrieving feature status',
              schema: errorResponseSchema
            }
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
    path: '/api/v1/system/admin/features/report',
    options: {
      auth: 'jwt',
      tags: ['api', 'system', 'monitoring', 'reporting'],
      description: 'Generate comprehensive feature integration report',
      notes: 'Creates detailed report of all system features, usage statistics, and integration health',
      plugins: {
        'hapi-swagger': {
          responses: {
            200: {
              description: 'Feature report generated successfully',
              schema: featureReportResponseSchema
            },
            401: { description: 'Authentication required' },
            403: {
              description: 'Admin access required',
              schema: errorResponseSchema
            },
            500: {
              description: 'Server error generating report',
              schema: errorResponseSchema
            }
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
