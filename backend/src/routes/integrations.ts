/**
 * LOC: 6032E52E4C
 * WC-RTE-IGT-038 | integrations.ts - Healthcare Integration Hub API Routes (Hapi.js)
 *
 * UPSTREAM (imports from):
 *   - integrationService.ts (services/integrationService.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (index.ts)
 */

/**
 * WC-RTE-IGT-038 | integrations.ts - Healthcare Integration Hub API Routes (Hapi.js)
 * Purpose: Hapi.js routes for comprehensive external healthcare system integrations with SIS/EHR/pharmacy/lab/government reporting
 * Upstream: ../services/integrationService/IntegrationService | Dependencies: @hapi/hapi, joi
 * Downstream: External SIS/EHR/pharmacy/lab/insurance/government systems, admin integration management UI | Called by: Integration admin panels, automated sync processes
 * Related: ../services/integrationService.ts, integration.ts (Express version), healthRecords.ts, students.ts, medications.ts, reports.ts
 * Exports: integrationRoutes | Key Services: Integration CRUD, connection testing, manual sync triggers, audit logging, statistics, admin-only operations
 * Last Updated: 2025-10-18 | File Type: .ts | Lines: ~400
 * Critical Path: Admin authentication → Integration config validation → External API communication → Data synchronization → Audit trail → Response
 * LLM Context: Healthcare integration hub (Hapi.js version) with 10 comprehensive endpoints for managing SIS/EHR/pharmacy/lab/government integrations, testing, sync operations, and monitoring
 */

/**
 * Integration Hub Routes for Hapi.js
 * Provides REST API endpoints for integration management
 *
 * Supported Integrations:
 * - SIS (Student Information System)
 * - EHR (Electronic Health Records)
 * - Pharmacy Management
 * - Laboratory Information System
 * - Insurance Verification
 * - Parent Portal
 * - Health Application
 * - Government Reporting
 */

import { ServerRoute } from '@hapi/hapi';
import { IntegrationService } from '../services/integration';
import Joi from 'joi';

// Middleware to check if user is admin
const isAdmin = (request: any) => {
  const userRole = request.auth.credentials?.role;
  return userRole === 'ADMIN' || userRole === 'DISTRICT_ADMIN';
};

// Get all integrations
const getAllIntegrationsHandler = async (request: any, h: any) => {
  try {
    if (!isAdmin(request)) {
      return h.response({
        success: false,
        error: { message: 'Access denied. Admin privileges required.' }
      }).code(403);
    }

    const type = request.query.type;
    const integrations = await IntegrationService.getAllIntegrations(type);

    return h.response({
      success: true,
      data: { integrations }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get integration by ID
const getIntegrationByIdHandler = async (request: any, h: any) => {
  try {
    if (!isAdmin(request)) {
      return h.response({
        success: false,
        error: { message: 'Access denied. Admin privileges required.' }
      }).code(403);
    }

    const integration = await IntegrationService.getIntegrationById(request.params.id);

    return h.response({
      success: true,
      data: { integration }
    });
  } catch (error) {
    const statusCode = error instanceof Error && error.message === 'Integration not found' ? 404 : 500;
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(statusCode);
  }
};

// Create new integration
const createIntegrationHandler = async (request: any, h: any) => {
  try {
    if (!isAdmin(request)) {
      return h.response({
        success: false,
        error: { message: 'Access denied. Admin privileges required.' }
      }).code(403);
    }

    const integration = await IntegrationService.createIntegration(request.payload);

    return h.response({
      success: true,
      data: { integration }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Update integration
const updateIntegrationHandler = async (request: any, h: any) => {
  try {
    if (!isAdmin(request)) {
      return h.response({
        success: false,
        error: { message: 'Access denied. Admin privileges required.' }
      }).code(403);
    }

    const integration = await IntegrationService.updateIntegration(
      request.params.id,
      request.payload
    );

    return h.response({
      success: true,
      data: { integration }
    });
  } catch (error) {
    const statusCode = error instanceof Error && error.message === 'Integration not found' ? 404 : 500;
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(statusCode);
  }
};

// Delete integration
const deleteIntegrationHandler = async (request: any, h: any) => {
  try {
    if (!isAdmin(request)) {
      return h.response({
        success: false,
        error: { message: 'Access denied. Admin privileges required.' }
      }).code(403);
    }

    await IntegrationService.deleteIntegration(request.params.id);

    return h.response({
      success: true,
      data: { message: 'Integration deleted successfully' }
    });
  } catch (error) {
    const statusCode = error instanceof Error && error.message === 'Integration not found' ? 404 : 500;
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(statusCode);
  }
};

// Test integration connection
const testConnectionHandler = async (request: any, h: any) => {
  try {
    if (!isAdmin(request)) {
      return h.response({
        success: false,
        error: { message: 'Access denied. Admin privileges required.' }
      }).code(403);
    }

    const result = await IntegrationService.testConnection(request.params.id);

    return h.response({
      success: true,
      data: { result }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Trigger integration sync
const syncIntegrationHandler = async (request: any, h: any) => {
  try {
    if (!isAdmin(request)) {
      return h.response({
        success: false,
        error: { message: 'Access denied. Admin privileges required.' }
      }).code(403);
    }

    const result = await IntegrationService.syncIntegration(request.params.id);

    return h.response({
      success: true,
      data: { result }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get integration logs
const getIntegrationLogsHandler = async (request: any, h: any) => {
  try {
    if (!isAdmin(request)) {
      return h.response({
        success: false,
        error: { message: 'Access denied. Admin privileges required.' }
      }).code(403);
    }

    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;

    const result = await IntegrationService.getIntegrationLogs(
      request.params.id,
      undefined,
      page,
      limit
    );

    return h.response({
      success: true,
      data: result
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get all integration logs (with optional type filter)
const getAllIntegrationLogsHandler = async (request: any, h: any) => {
  try {
    if (!isAdmin(request)) {
      return h.response({
        success: false,
        error: { message: 'Access denied. Admin privileges required.' }
      }).code(403);
    }

    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;
    const type = request.query.type;

    const result = await IntegrationService.getIntegrationLogs(
      undefined,
      type,
      page,
      limit
    );

    return h.response({
      success: true,
      data: result
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get integration statistics
const getIntegrationStatisticsHandler = async (request: any, h: any) => {
  try {
    if (!isAdmin(request)) {
      return h.response({
        success: false,
        error: { message: 'Access denied. Admin privileges required.' }
      }).code(403);
    }

    const statistics = await IntegrationService.getIntegrationStatistics();

    return h.response({
      success: true,
      data: { statistics }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Define integration routes for Hapi
export const integrationRoutes: ServerRoute[] = [
  // Get all integrations
  {
    method: 'GET',
    path: '/integrations',
    handler: getAllIntegrationsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'integrations'],
      description: 'Get all integration configurations',
      notes: 'Returns all integration configurations with optional type filtering. Admin access required.',
      validate: {
        query: Joi.object({
          type: Joi.string()
            .valid('SIS', 'EHR', 'PHARMACY', 'LABORATORY', 'INSURANCE', 'PARENT_PORTAL', 'HEALTH_APP', 'GOVERNMENT_REPORTING')
            .optional()
            .description('Filter integrations by type')
        })
      }
    }
  },

  // Get integration by ID
  {
    method: 'GET',
    path: '/integrations/{id}',
    handler: getIntegrationByIdHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'integrations'],
      description: 'Get integration configuration by ID',
      notes: 'Returns a single integration configuration. Sensitive credentials are masked. Admin access required.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Integration ID')
        })
      }
    }
  },

  // Create new integration
  {
    method: 'POST',
    path: '/integrations',
    handler: createIntegrationHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'integrations'],
      description: 'Create new integration configuration',
      notes: 'Creates a new integration with the specified configuration. Admin access required.',
      validate: {
        payload: Joi.object({
          name: Joi.string().trim().required().description('Integration name'),
          type: Joi.string()
            .valid('SIS', 'EHR', 'PHARMACY', 'LABORATORY', 'INSURANCE', 'PARENT_PORTAL', 'HEALTH_APP', 'GOVERNMENT_REPORTING')
            .required()
            .description('Integration type'),
          endpoint: Joi.string().uri().optional().description('API endpoint URL'),
          apiKey: Joi.string().optional().description('API key for authentication'),
          username: Joi.string().optional().description('Username for authentication'),
          password: Joi.string().optional().description('Password for authentication'),
          settings: Joi.object().optional().description('Additional integration-specific settings'),
          syncFrequency: Joi.number().integer().min(1).optional().description('Sync frequency in minutes')
        })
      }
    }
  },

  // Update integration
  {
    method: 'PUT',
    path: '/integrations/{id}',
    handler: updateIntegrationHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'integrations'],
      description: 'Update integration configuration',
      notes: 'Updates an existing integration configuration. Admin access required.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Integration ID')
        }),
        payload: Joi.object({
          name: Joi.string().trim().optional().description('Integration name'),
          endpoint: Joi.string().uri().optional().description('API endpoint URL'),
          apiKey: Joi.string().optional().description('API key for authentication'),
          username: Joi.string().optional().description('Username for authentication'),
          password: Joi.string().optional().description('Password for authentication'),
          settings: Joi.object().optional().description('Additional integration-specific settings'),
          syncFrequency: Joi.number().integer().min(1).optional().description('Sync frequency in minutes'),
          isActive: Joi.boolean().optional().description('Integration active status')
        })
      }
    }
  },

  // Delete integration
  {
    method: 'DELETE',
    path: '/integrations/{id}',
    handler: deleteIntegrationHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'integrations'],
      description: 'Delete integration configuration',
      notes: 'Permanently deletes an integration configuration. Admin access required.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Integration ID')
        })
      }
    }
  },

  // Test integration connection
  {
    method: 'POST',
    path: '/integrations/{id}/test',
    handler: testConnectionHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'integrations'],
      description: 'Test integration connection',
      notes: 'Tests the connection to the integration service and returns connection status and latency. Admin access required.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Integration ID')
        })
      }
    }
  },

  // Trigger integration sync
  {
    method: 'POST',
    path: '/integrations/{id}/sync',
    handler: syncIntegrationHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'integrations'],
      description: 'Trigger manual integration sync',
      notes: 'Manually triggers a synchronization with the integration service. Returns sync results. Admin access required.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Integration ID')
        })
      }
    }
  },

  // Get integration logs
  {
    method: 'GET',
    path: '/integrations/{id}/logs',
    handler: getIntegrationLogsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'integrations'],
      description: 'Get integration logs',
      notes: 'Returns paginated logs for a specific integration. Admin access required.',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('Integration ID')
        }),
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1).description('Page number'),
          limit: Joi.number().integer().min(1).max(100).default(20).description('Items per page')
        })
      }
    }
  },

  // Get all integration logs
  {
    method: 'GET',
    path: '/integrations/logs/all',
    handler: getAllIntegrationLogsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'integrations'],
      description: 'Get all integration logs',
      notes: 'Returns paginated logs for all integrations with optional type filtering. Admin access required.',
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1).description('Page number'),
          limit: Joi.number().integer().min(1).max(100).default(20).description('Items per page'),
          type: Joi.string()
            .valid('SIS', 'EHR', 'PHARMACY', 'LABORATORY', 'INSURANCE', 'PARENT_PORTAL', 'HEALTH_APP', 'GOVERNMENT_REPORTING')
            .optional()
            .description('Filter logs by integration type')
        })
      }
    }
  },

  // Get integration statistics
  {
    method: 'GET',
    path: '/integrations/statistics/overview',
    handler: getIntegrationStatisticsHandler,
    options: {
      auth: 'jwt',
      tags: ['api', 'integrations'],
      description: 'Get integration statistics',
      notes: 'Returns comprehensive statistics about all integrations including sync rates, success metrics, and performance data. Admin access required.'
    }
  }
];
