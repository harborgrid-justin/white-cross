/**
 * Compliance & Audit Module
 * Aggregates all compliance and audit routes
 *
 * Module Overview:
 * - Audit Trail: Comprehensive audit logging for HIPAA compliance (15 routes)
 * - Compliance Management: Reports, checklists, policies, consents (10 routes)
 *
 * Total Routes: 25
 *
 * HIPAA Compliance:
 * This module implements required audit logging per 45 CFR § 164.308(a)(1)(ii)(D)
 * and supports HIPAA Privacy Rule and Security Rule compliance reporting.
 */

import { ServerRoute } from '@hapi/hapi';
import { auditRoutes } from './routes/audit.routes';
import { complianceRoutes } from './routes/compliance.routes';

/**
 * All compliance and audit routes
 */
export const complianceModuleRoutes: ServerRoute[] = [
  ...auditRoutes,           // 15 audit trail routes
  ...complianceRoutes       // 10 compliance management routes
];

/**
 * Route counts for tracking migration progress
 */
export const complianceModuleStats = {
  totalRoutes: complianceModuleRoutes.length,
  auditRoutes: auditRoutes.length,
  complianceRoutes: complianceRoutes.length,
  module: 'Compliance & Audit',
  version: 'v1',
  hipaaCompliant: true
};
