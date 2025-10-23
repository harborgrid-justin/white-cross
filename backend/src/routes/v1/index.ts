/**
 * API v1 Routes Aggregator
 * Central export point for all v1 API routes
 */

import { ServerRoute } from '@hapi/hapi';
import { coreRoutes } from './core';
import { healthcareRoutes } from './healthcare';
import { operationsRoutes } from './operations';
import { documentsRoutes } from './documents';
import { complianceModuleRoutes } from './compliance';
import { communicationsRoutes } from './communications';
import { communicationRoutes } from './communication';
import { incidentsRoutes } from './incidents';
import { routes as analyticsRoutes } from './analytics';
import { systemModuleRoutes } from './system';

/**
 * All v1 API routes organized by module
 *
 * Module breakdown:
 * - Core: Authentication, users, access control
 * - Healthcare: Medications, health records
 * - Operations: Students, emergency contacts, appointments
 * - Documents: Document management, signatures, templates
 * - Compliance: Audit logs, compliance reports, policies, consents
 * - Communications: Messages, broadcasts, notifications
 * - Incidents: Incident reporting, evidence, witnesses, follow-ups
 * - Analytics: Health metrics, analytics, and reporting
 * - System: System administration, integrations, and configuration
 */
export const v1Routes: ServerRoute[] = [
  ...coreRoutes,
  ...healthcareRoutes,
  ...operationsRoutes,
  ...documentsRoutes,
  ...complianceModuleRoutes,
  ...communicationsRoutes,
  ...communicationRoutes,
  ...incidentsRoutes,
  ...analyticsRoutes,
  ...systemModuleRoutes
];

/**
 * Route statistics
 */
export const getV1RouteStats = () => {
  const routesByModule = {
    core: coreRoutes.length,
    healthcare: healthcareRoutes.length,
    operations: operationsRoutes.length,
    documents: documentsRoutes.length,
    compliance: complianceRoutes.length,
    communications: communicationsRoutes.length,
    communication: communicationRoutes.length,
    incidents: incidentsRoutes.length,
    analytics: analyticsRoutes.length,
    system: systemModuleRoutes.length
  };

  return {
    total: v1Routes.length,
    byModule: routesByModule
  };
};
