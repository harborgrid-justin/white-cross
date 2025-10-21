/**
 * System Configuration Routes
 * HTTP endpoints for system settings, school management, and feature flags
 * All routes prefixed with /api/v1/system
 */

import { ServerRoute } from '@hapi/hapi';
import { asyncHandler } from '../../../shared/utils';
import { ConfigurationController } from '../controllers/configuration.controller';
import {
  updateSystemConfigSchema,
  listSchoolsQuerySchema,
  updateSchoolSchema,
  updateFeaturesSchema,
  schoolIdParamSchema
} from '../validators/system.validators';

/**
 * SYSTEM CONFIGURATION ROUTES
 */

const getSystemConfigRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/system/config',
  handler: asyncHandler(ConfigurationController.getSystemConfig),
  options: {
    auth: 'jwt',
    tags: ['api', 'System', 'Configuration', 'v1'],
    description: 'Get system configuration',
    notes: '**ADMIN ONLY** - Returns current system configuration settings including SMTP, security, performance, and integration settings. All sensitive credentials are masked. Used for system administration dashboard and configuration management.',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'System configuration retrieved successfully' },
          '401': { description: 'Unauthorized - Authentication required' },
          '403': { description: 'Forbidden - Admin role required' }
        }
      }
    }
  }
};

const updateSystemConfigRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/system/config',
  handler: asyncHandler(ConfigurationController.updateSystemConfig),
  options: {
    auth: 'jwt',
    tags: ['api', 'System', 'Configuration', 'v1'],
    description: 'Update system configuration',
    notes: '**ADMIN ONLY** - Updates system-wide configuration settings. Settings are categorized (GENERAL, SECURITY, NOTIFICATION, INTEGRATION, BACKUP, PERFORMANCE). Changes may require system restart depending on setting type. All updates are logged for audit trail. Use with caution as incorrect settings can affect system functionality.',
    validate: {
      payload: updateSystemConfigSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'System configuration updated successfully' },
          '400': { description: 'Validation error - Invalid configuration data' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin role required' }
        }
      }
    }
  }
};

/**
 * SCHOOL MANAGEMENT ROUTES
 */

const listSchoolsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/system/schools',
  handler: asyncHandler(ConfigurationController.listSchools),
  options: {
    auth: 'jwt',
    tags: ['api', 'System', 'Schools', 'v1'],
    description: 'List schools in district',
    notes: '**ADMIN/DISTRICT_ADMIN ONLY** - Returns paginated list of schools. Supports filtering by district ID and searching by name or code. Includes school settings, contact information, and active status. Used for district-wide school management and reporting.',
    validate: {
      query: listSchoolsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Schools retrieved successfully with pagination' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin or District Admin role required' }
        }
      }
    }
  }
};

const getSchoolByIdRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/system/schools/{schoolId}',
  handler: asyncHandler(ConfigurationController.getSchoolById),
  options: {
    auth: 'jwt',
    tags: ['api', 'System', 'Schools', 'v1'],
    description: 'Get school by ID',
    notes: 'Returns detailed school information including name, code, address, contact details, settings, and active status. Used for school profile viewing and configuration.',
    validate: {
      params: schoolIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'School retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'School not found' }
        }
      }
    }
  }
};

const updateSchoolRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/system/schools/{schoolId}',
  handler: asyncHandler(ConfigurationController.updateSchool),
  options: {
    auth: 'jwt',
    tags: ['api', 'System', 'Schools', 'v1'],
    description: 'Update school settings',
    notes: '**ADMIN/DISTRICT_ADMIN ONLY** - Updates school configuration including name, code, contact information, and school-specific settings. Validates phone and email formats. All updates are logged for audit trail. Used for maintaining accurate school information.',
    validate: {
      params: schoolIdParamSchema,
      payload: updateSchoolSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'School updated successfully' },
          '400': { description: 'Validation error - Invalid school data' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin or District Admin role required' },
          '404': { description: 'School not found' }
        }
      }
    }
  }
};

/**
 * FEATURE MANAGEMENT ROUTES
 */

const getFeaturesRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/system/features',
  handler: asyncHandler(ConfigurationController.getFeatures),
  options: {
    auth: 'jwt',
    tags: ['api', 'System', 'Features', 'v1'],
    description: 'Get enabled features',
    notes: 'Returns current feature flag configuration. Features include: MEDICATION_MANAGEMENT (medication tracking), INCIDENT_REPORTING (incident reports), PARENT_PORTAL (parent access), MOBILE_APP (mobile application), ANALYTICS_DASHBOARD (advanced analytics), INTEGRATION_SIS (SIS integration), AUTOMATED_NOTIFICATIONS (automated alerts). Used for feature availability checks and license compliance.',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Features retrieved successfully' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};

const updateFeaturesRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/system/features',
  handler: asyncHandler(ConfigurationController.updateFeatures),
  options: {
    auth: 'jwt',
    tags: ['api', 'System', 'Features', 'v1'],
    description: 'Update enabled features',
    notes: '**ADMIN ONLY** - Enables or disables system features. Feature flags control availability of major platform modules. Enabling features may require additional licensing. Disabling features hides functionality but preserves existing data. Changes take effect immediately. Use with caution as features may have dependencies.',
    validate: {
      payload: updateFeaturesSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Features updated successfully' },
          '400': { description: 'Validation error - Invalid feature flags' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin role required' }
        }
      }
    }
  }
};

/**
 * EXPORT ROUTES
 */

export const configurationRoutes: ServerRoute[] = [
  // System configuration
  getSystemConfigRoute,
  updateSystemConfigRoute,

  // School management
  listSchoolsRoute,
  getSchoolByIdRoute,
  updateSchoolRoute,

  // Feature management
  getFeaturesRoute,
  updateFeaturesRoute
];
