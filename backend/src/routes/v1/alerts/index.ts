/**
 * Real-Time Alerts Module Routes
 * Feature 26: Real-Time Emergency Alert Infrastructure
 *
 * Module Overview:
 * - Real-Time Alerts: WebSocket-based emergency alerting system (14 routes)
 *
 * Total Routes: 14
 *
 * System Features:
 * - Multi-channel delivery (WebSocket, Email, SMS, Push)
 * - 6 severity levels (INFO → EMERGENCY)
 * - 9 alert categories (MEDICATION, ALLERGY, OUTBREAK, etc.)
 * - Alert lifecycle management (create, acknowledge, resolve, escalate)
 * - User subscription preferences with quiet hours
 * - Comprehensive delivery tracking and statistics
 */

import { ServerRoute } from '@hapi/hapi';
import realTimeAlertRoutes from './real-time-alerts';

/**
 * All real-time alert routes
 */
export const alertsRoutes: ServerRoute[] = [
  ...realTimeAlertRoutes,  // 14 real-time alert routes
];

/**
 * Route counts for tracking
 */
export const alertsModuleStats = {
  totalRoutes: alertsRoutes.length,
  realTimeAlertRoutes: realTimeAlertRoutes.length,
  module: 'Real-Time Alerts',
  version: 'v1',
  features: ['WebSocket Broadcasting', 'Multi-Channel Delivery', 'Alert Subscriptions'],
};
