/**
 * Analytics Module Index
 * Aggregates and exports all analytics-related routes
 * @module routes/v1/analytics
 */

import { ServerRoute } from '@hapi/hapi';
import { analyticsRoutes } from './routes/analytics.routes';

/**
 * All analytics routes
 * Includes health metrics, incident analytics, medication analytics,
 * appointment analytics, dashboards, and custom reporting
 */
export const routes: ServerRoute[] = [
  ...analyticsRoutes
];

/**
 * Export individual route arrays for selective registration
 */
export { analyticsRoutes };

/**
 * Module metadata
 */
export const metadata = {
  name: 'Analytics',
  version: '1.0.0',
  description: 'Health metrics, analytics, and reporting endpoints',
  routeCount: routes.length,
  basePath: '/api/v1/analytics',
  tags: ['Analytics', 'Health Metrics', 'Reports', 'Dashboard'],
  capabilities: [
    'Health metrics aggregation',
    'Trend analysis',
    'Incident analytics',
    'Medication usage tracking',
    'Appointment analytics',
    'Real-time dashboards',
    'Custom report generation',
    'Compliance reporting',
    'Module metadata endpoint'
  ]
};
