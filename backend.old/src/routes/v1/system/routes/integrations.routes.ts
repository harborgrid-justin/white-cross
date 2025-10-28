/**
 * Integration Management Routes
 * HTTP endpoints for third-party integrations and data synchronization
 * All routes prefixed with /api/v1/system
 */

import { ServerRoute } from '@hapi/hapi';
import { asyncHandler } from '../../../shared/utils';
import { IntegrationsController } from '../controllers/integrations.controller';
import {
  listIntegrationsQuerySchema,
  createIntegrationSchema,
  updateIntegrationSchema,
  integrationIdParamSchema,
  syncStudentsSchema,
  syncStatusQuerySchema,
  syncLogsQuerySchema,
  gradeTransitionSchema
} from '../validators/system.validators';

/**
 * INTEGRATION MANAGEMENT ROUTES
 */

const listIntegrationsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/system/integrations',
  handler: asyncHandler(IntegrationsController.listIntegrations),
  options: {
    auth: 'jwt',
    tags: ['api', 'System', 'Integrations', 'v1'],
    description: 'List configured integrations',
    notes: '**ADMIN ONLY** - Returns paginated list of all configured integrations. Integration types: SIS (Student Information System), EMAIL (SMTP/SendGrid), SMS (Twilio), STORAGE (AWS S3/Azure), AUTHENTICATION (SAML/OAuth/LDAP), EHR, PHARMACY, LABORATORY, INSURANCE. Status values: ACTIVE (connected), INACTIVE (configured but disabled), ERROR (connection issues), PENDING (not yet configured). Credentials are masked for security.',
    validate: {
      query: listIntegrationsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Integrations retrieved successfully with pagination' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin role required' }
        }
      }
    }
  }
};

const getIntegrationByIdRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/system/integrations/{id}',
  handler: asyncHandler(IntegrationsController.getIntegrationById),
  options: {
    auth: 'jwt',
    tags: ['api', 'System', 'Integrations', 'v1'],
    description: 'Get integration details',
    notes: '**ADMIN ONLY** - Returns detailed integration configuration including name, type, endpoint, status, settings, sync frequency, and recent activity logs. Sensitive credentials (API keys, passwords) are masked for security. Includes last 5 log entries for troubleshooting. Used for integration configuration review and monitoring.',
    validate: {
      params: integrationIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Integration retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin role required' },
          '404': { description: 'Integration not found' }
        }
      }
    }
  }
};

const createIntegrationRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/system/integrations',
  handler: asyncHandler(IntegrationsController.createIntegration),
  options: {
    auth: 'jwt',
    tags: ['api', 'System', 'Integrations', 'v1'],
    description: 'Add new integration',
    notes: '**ADMIN ONLY** - Creates new integration configuration. Validates endpoint URLs, encrypts sensitive credentials (API keys, passwords, client secrets) before storage. Validates required fields based on integration type. Initially sets status to INACTIVE for safety. Supports OAuth (clientId/clientSecret) and Basic Auth (username/password) authentication methods. Integration must be tested before activation.',
    validate: {
      payload: createIntegrationSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Integration created successfully' },
          '400': { description: 'Validation error - Invalid integration configuration' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin role required' },
          '409': { description: 'Conflict - Integration with this name already exists' }
        }
      }
    }
  }
};

const updateIntegrationRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/system/integrations/{id}',
  handler: asyncHandler(IntegrationsController.updateIntegration),
  options: {
    auth: 'jwt',
    tags: ['api', 'System', 'Integrations', 'v1'],
    description: 'Update integration config',
    notes: '**ADMIN ONLY** - Updates integration configuration. Validates endpoint URLs if changed. Re-encrypts credentials if updated. Validates sync frequency (0 = manual only, >0 = automatic sync interval in minutes). Status changes: PENDING → INACTIVE → ACTIVE or ERROR. Connection is re-tested if credentials or endpoint changed. All configuration changes are logged for audit trail.',
    validate: {
      params: integrationIdParamSchema,
      payload: updateIntegrationSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Integration updated successfully' },
          '400': { description: 'Validation error - Invalid update data' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin role required' },
          '404': { description: 'Integration not found' }
        }
      }
    }
  }
};

const deleteIntegrationRoute: ServerRoute = {
  method: 'DELETE',
  path: '/api/v1/system/integrations/{id}',
  handler: asyncHandler(IntegrationsController.deleteIntegration),
  options: {
    auth: 'jwt',
    tags: ['api', 'System', 'Integrations', 'v1'],
    description: 'Remove integration',
    notes: '**ADMIN ONLY** - Deletes integration configuration and associated logs. WARNING: This action cannot be undone. Active integrations should be deactivated before deletion. Scheduled syncs will be cancelled. Historical sync logs will be removed. Consider deactivating instead of deleting to preserve audit trail.',
    validate: {
      params: integrationIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '204': { description: 'Integration deleted successfully (no content)' },
          '400': { description: 'Cannot delete active integration - deactivate first' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin role required' },
          '404': { description: 'Integration not found' }
        }
      }
    }
  }
};

const testConnectionRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/system/integrations/{id}/test',
  handler: asyncHandler(IntegrationsController.testConnection),
  options: {
    auth: 'jwt',
    tags: ['api', 'System', 'Integrations', 'v1'],
    description: 'Test integration connection',
    notes: '**ADMIN ONLY** - Tests integration connectivity and authentication. Validates credentials without modifying data. Returns response time, connection status, and integration-specific details (API version, record counts, etc.). Temporarily sets status to TESTING during test. Updates status to ACTIVE on success or ERROR on failure. Logs test results for troubleshooting. Required before activating new integrations.',
    validate: {
      params: integrationIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Connection test completed (check success field for result)' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin role required' },
          '404': { description: 'Integration not found' }
        }
      }
    }
  }
};

/**
 * DATA SYNCHRONIZATION ROUTES
 */

const syncStudentsRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/system/sync/students',
  handler: asyncHandler(IntegrationsController.syncStudents),
  options: {
    auth: 'jwt',
    tags: ['api', 'System', 'Sync', 'Students', 'v1'],
    description: 'Sync student data from SIS',
    notes: '**ADMIN ONLY** - Pulls student data from Student Information System. Full sync imports all students, incremental sync imports only changed records. Optionally filter by grade level. Creates new student records if auto-create enabled, updates existing records based on conflict resolution strategy. Returns sync session with statistics (processed, created, updated, skipped, failed). Sync runs asynchronously for large datasets. Use sync status endpoint to monitor progress.',
    validate: {
      payload: syncStudentsSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Student sync initiated successfully' },
          '400': { description: 'Validation error - Integration must be SIS type or not configured' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin role required' },
          '404': { description: 'Integration not found' }
        }
      }
    }
  }
};

const getSyncStatusRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/system/sync/status',
  handler: asyncHandler(IntegrationsController.getSyncStatus),
  options: {
    auth: 'jwt',
    tags: ['api', 'System', 'Sync', 'v1'],
    description: 'Get sync status',
    notes: 'Returns recent synchronization sessions with status and statistics. Sync statuses: IDLE (no sync running), IN_PROGRESS (currently syncing), COMPLETED (last sync successful), FAILED (last sync failed). Includes session details: start time, completion time, records processed, success/failure counts, and error messages. Optionally filter by integration ID and status. Used for monitoring active syncs and reviewing sync history.',
    validate: {
      query: syncStatusQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Sync status retrieved successfully' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};

const getSyncLogsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/system/sync/logs',
  handler: asyncHandler(IntegrationsController.getSyncLogs),
  options: {
    auth: 'jwt',
    tags: ['api', 'System', 'Sync', 'Logs', 'v1'],
    description: 'Get sync logs',
    notes: '**ADMIN ONLY** - Returns paginated integration operation logs for troubleshooting and audit trail. Logs include: sync operations, connection tests, configuration changes, errors, and warnings. Supports filtering by integration ID, status (success/failed), action type, and date range. Each log entry contains timestamp, action, status, duration, records processed, and error details. Required for HIPAA compliance auditing and operational monitoring.',
    validate: {
      query: syncLogsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Sync logs retrieved successfully with pagination' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin role required' }
        }
      }
    }
  }
};

/**
 * UTILITY ROUTES
 */

const gradeTransitionRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/system/grade-transition',
  handler: asyncHandler(IntegrationsController.gradeTransition),
  options: {
    auth: 'jwt',
    tags: ['api', 'System', 'Utilities', 'v1'],
    description: 'Trigger grade transition',
    notes: '**ADMIN ONLY** - Performs end-of-year grade transition for all active students. Automatically advances students to next grade level based on predefined progression rules (K→1, 1→2, ..., 11→12, 12→Graduate). DryRun mode previews changes without committing. Optionally filter by specific grades. Returns detailed results for each student including old grade, new grade, success status, and any errors. Creates audit trail entries. Use dryRun first to verify expected results.',
    validate: {
      payload: gradeTransitionSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Grade transition completed successfully' },
          '400': { description: 'Validation error - Invalid transition parameters' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin role required' }
        }
      }
    }
  }
};

const getSystemHealthRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/system/health',
  handler: asyncHandler(IntegrationsController.getSystemHealth),
  options: {
    auth: 'jwt',
    tags: ['api', 'System', 'Utilities', 'v1'],
    description: 'Get system health status',
    notes: 'Returns comprehensive system health metrics including database status, cache status, integration health (total, active, error, inactive counts), server uptime, memory usage, and timestamp. Used for system monitoring dashboard, alerting, and operational visibility. Helps identify system issues and integration problems at a glance.',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'System health retrieved successfully' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};

/**
 * EXPORT ROUTES
 */

export const integrationsRoutes: ServerRoute[] = [
  // Integration management
  listIntegrationsRoute,
  getIntegrationByIdRoute,
  createIntegrationRoute,
  updateIntegrationRoute,
  deleteIntegrationRoute,
  testConnectionRoute,

  // Data synchronization
  syncStudentsRoute,
  getSyncStatusRoute,
  getSyncLogsRoute,

  // Utilities
  gradeTransitionRoute,
  getSystemHealthRoute
];
