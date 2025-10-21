/**
 * System Administration Module
 * Aggregates all system configuration and integration management routes
 *
 * Module Overview:
 * - System Configuration: Settings, school management, feature flags (7 routes)
 * - Integration Management: Third-party integrations and sync (11 routes)
 * - Authentication & Monitoring: MFA setup, system health, feature status (5 routes)
 *
 * Total Routes: 23
 *
 * Security Notice:
 * All routes in this module require ADMIN role access and are used for
 * system-wide configuration, integration management, and operational utilities.
 * Credentials are encrypted at rest and masked in API responses.
 */

import { ServerRoute } from '@hapi/hapi';
import { configurationRoutes } from './routes/configuration.routes';
import { integrationsRoutes } from './routes/integrations.routes';
import { systemRoutes } from './routes/authentication.routes';

/**
 * All system administration routes
 */
export const systemModuleRoutes: ServerRoute[] = [
  ...configurationRoutes,     // 7 configuration routes
  ...integrationsRoutes,      // 11 integration & sync routes
  ...systemRoutes            // 5 authentication & monitoring routes
];

/**
 * Route counts for tracking migration progress
 */
export const systemModuleStats = {
  totalRoutes: systemModuleRoutes.length,
  configurationRoutes: configurationRoutes.length,
  integrationsRoutes: integrationsRoutes.length,
  authenticationRoutes: systemRoutes.length,
  module: 'System Administration',
  version: 'v1',
  adminOnly: true,
  description: 'System configuration, integration management, authentication, and monitoring'
};
